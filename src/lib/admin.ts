/**
 * Admin User Setup Utility
 * 
 * This module ensures that the user specified in the ADMIN_EMAIL environment variable
 * is automatically assigned the ADMIN role. This happens in two scenarios:
 * 
 * 1. On application startup: If a user with the ADMIN_EMAIL already exists and doesn't
 *    have the ADMIN role, it will be updated to have ADMIN role.
 * 
 * 2. During user registration: If someone registers with the ADMIN_EMAIL, they will
 *    automatically be assigned the ADMIN role.
 * 
 * To use this feature, add the following to your .env file:
 * ADMIN_EMAIL=admin@yourcompany.com
 * 
 * The email comparison is case-insensitive.
 */

import { UserRole, PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let adminSetupCompleted = false;

/**
 * Ensures that the user with the ADMIN_EMAIL environment variable
 * has the ADMIN role. This function should be called once during app startup.
 */
export async function ensureAdminUser(): Promise<void> {
  // Prevent multiple executions
  if (adminSetupCompleted) {
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  
  // Skip if ADMIN_EMAIL is not configured
  if (!adminEmail) {
    console.log('[ADMIN_SETUP] ADMIN_EMAIL environment variable not set, skipping admin user setup');
    adminSetupCompleted = true;
    return;
  }

  // Initialize Prisma client
  const prisma = globalThis.prisma || new PrismaClient();
  if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
  }

  try {
    console.log(`[ADMIN_SETUP] Checking admin user setup for email: ${adminEmail}`);
    
    // Find user with the admin email
    const adminUser = await prisma.user.findUnique({
      where: {
        email: adminEmail
      }
    });

    if (!adminUser) {
      console.log(`[ADMIN_SETUP] User with email ${adminEmail} not found. Admin role will be assigned when the user registers.`);
      adminSetupCompleted = true;
      return;
    }

    // Check if user already has admin role
    if (adminUser.role === UserRole.ADMIN) {
      console.log(`[ADMIN_SETUP] User ${adminEmail} already has ADMIN role`);
      adminSetupCompleted = true;
      return;
    }

    // Update user to admin role
    await prisma.user.update({
      where: {
        email: adminEmail
      },
      data: {
        role: UserRole.ADMIN
      }
    });

    console.log(`[ADMIN_SETUP] Successfully assigned ADMIN role to user: ${adminEmail}`);
  } catch (error) {
    console.error('[ADMIN_SETUP] Error during admin user setup:', error);
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