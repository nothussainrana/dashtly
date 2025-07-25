/**
 * Admin User Setup Utility
 * 
 * This module ensures that users specified in the ADMIN_EMAIL_1 through ADMIN_EMAIL_9 environment variables
 * are automatically assigned the ADMIN role. This happens in three scenarios:
 * 
 * 1. On application startup: If users with any of the ADMIN_EMAIL_X already exist and don't
 *    have the ADMIN role, they will be updated to have ADMIN role.
 * 
 * 2. During user registration: If someone registers with an email that matches any ADMIN_EMAIL_X,
 *    they will be automatically assigned the ADMIN role.
 * 
 * 3. Local development: If NEXTAUTH_URL contains 'localhost' and admin users don't exist,
 *    new admin users will be automatically created using ADMIN_EMAIL_X and ADMIN_PASSWORD_X.
 * 
 * To use this feature, add the following to your .env file:
 * ADMIN_EMAIL_1=admin1@yourcompany.com
 * ADMIN_EMAIL_2=admin2@yourcompany.com
 * ADMIN_PASSWORD_1=password1 (only needed for local development)
 * ADMIN_PASSWORD_2=password2 (only needed for local development)
 * 
 * The email comparison is case-insensitive.
 */

import { UserRole, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateVerificationCode, getVerificationCodeExpiry } from './email';

declare global {
  var prisma: PrismaClient | undefined;
}

let adminSetupCompleted = false;

/**
 * Gets all admin emails from environment variables (ADMIN_EMAIL_1 to ADMIN_EMAIL_9)
 */
function getAdminEmails(): { email: string; password?: string; index: number }[] {
  const adminEmails: { email: string; password?: string; index: number }[] = [];
  
  for (let i = 1; i <= 9; i++) {
    const email = process.env[`ADMIN_EMAIL_${i}`];
    const password = process.env[`ADMIN_PASSWORD_${i}`];
    
    if (email) {
      adminEmails.push({ email, password, index: i });
    }
  }
  
  return adminEmails;
}

/**
 * Checks if an email is an admin email
 */
export function isAdminEmail(email: string): boolean {
  const adminEmails = getAdminEmails();
  return adminEmails.some(admin => admin.email.toLowerCase() === email.toLowerCase());
}

/**
 * Checks if the current environment is localhost based on NEXTAUTH_URL
 */
function isLocalhost(): boolean {
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  return nextAuthUrl ? nextAuthUrl.includes('localhost') : false;
}

/**
 * Creates a new admin user with the provided email and password
 */
async function createAdminUser(prisma: PrismaClient, email: string, password: string, index: number): Promise<void> {
  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationCode = generateVerificationCode();
  const verificationExpiry = getVerificationCodeExpiry();

  // Generate a default username from email (remove @ and domain)
  const defaultUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
  
  // Ensure username is unique by adding a suffix if needed
  let username = defaultUsername;
  let counter = 1;
  while (true) {
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });
    if (!existingUser) break;
    username = `${defaultUsername}_${counter}`;
    counter++;
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: `Local Admin ${index}`,
      username,
      hashedPassword,
      emailVerificationCode: verificationCode,
      emailVerificationExpiry: verificationExpiry,
      emailVerified: new Date(), // Auto-verify for localhost
      role: UserRole.ADMIN
    }
  });

  console.log(`[ADMIN_SETUP] ✅ Created new admin user for localhost: ${email} (username: ${username})`);
}

/**
 * Ensures that users with ADMIN_EMAIL_X environment variables
 * have the ADMIN role. This function should be called once during app startup.
 */
export async function ensureAdminUser(): Promise<void> {
  // Prevent multiple executions
  if (adminSetupCompleted) {
    return;
  }

  const adminEmails = getAdminEmails();
  const isLocal = isLocalhost();
  
  // Skip if no admin emails are configured
  if (adminEmails.length === 0) {
    console.log('[ADMIN_SETUP] No ADMIN_EMAIL_X environment variables set, skipping admin user setup');
    adminSetupCompleted = true;
    return;
  }

  // Initialize Prisma client
  const prisma = globalThis.prisma || new PrismaClient();
  if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
  }

  try {
    console.log(`[ADMIN_SETUP] Checking admin user setup for ${adminEmails.length} admin email(s)${isLocal ? ' (localhost detected)' : ''}`);
    
    // Process each admin email
    for (const adminConfig of adminEmails) {
      const { email, password, index } = adminConfig;
      
      try {
        // Find user with the admin email
        const adminUser = await prisma.user.findUnique({
          where: {
            email: email
          }
        });

        if (!adminUser) {
          // If running on localhost and ADMIN_PASSWORD_X is provided, create the admin user
          if (isLocal && password) {
            console.log(`[ADMIN_SETUP] 🚀 Localhost environment detected - creating admin user ${index} automatically`);
            await createAdminUser(prisma, email, password, index);
          } else if (isLocal && !password) {
            console.log(`[ADMIN_SETUP] ⚠️  Localhost detected but ADMIN_PASSWORD_${index} not set for ${email}. Please add ADMIN_PASSWORD_${index} to your .env file to auto-create admin user.`);
          } else {
            console.log(`[ADMIN_SETUP] Admin user ${index} with email ${email} not found. Admin role will be assigned when the user registers.`);
          }
          continue;
        }

        // Check if user already has admin role
        if (adminUser.role === UserRole.ADMIN) {
          console.log(`[ADMIN_SETUP] ✅ Admin user ${index} (${email}) already has ADMIN role`);
          continue;
        }

        // Update user to admin role
        await prisma.user.update({
          where: {
            email: email
          },
          data: {
            role: UserRole.ADMIN
          }
        });

        console.log(`[ADMIN_SETUP] ✅ Successfully assigned ADMIN role to user ${index}: ${email}`);
      } catch (error) {
        console.error(`[ADMIN_SETUP] ❌ Error processing admin user ${index} (${email}):`, error);
        // Continue with other admin users even if one fails
      }
    }
  } catch (error) {
    console.error('[ADMIN_SETUP] ❌ Error during admin user setup:', error);
    // Don't throw error to prevent app startup failure
  } finally {
    adminSetupCompleted = true;
  }
}

/**
 * Reset the admin setup flag (useful for testing)
 */
export function resetAdminSetup(): void {
  adminSetupCompleted = false;
} 