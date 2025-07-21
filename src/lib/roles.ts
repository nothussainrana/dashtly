import { UserRole } from '@prisma/client';

// Define role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY = {
  REGULAR: 1,
  PRO: 2,
  ADMIN: 3,
} as const;

/**
 * Check if a user has a specific role
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Check if user is admin
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN;
}

/**
 * Check if user is pro or higher
 */
export function isPro(userRole: UserRole): boolean {
  return hasRole(userRole, UserRole.PRO);
}

/**
 * Check if user is regular user
 */
export function isRegular(userRole: UserRole): boolean {
  return userRole === UserRole.REGULAR;
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames = {
    [UserRole.REGULAR]: 'Regular',
    [UserRole.PRO]: 'Pro',
    [UserRole.ADMIN]: 'Admin',
  };
  
  return roleNames[role] || 'Regular';
}

/**
 * Get all available roles
 */
export function getAllRoles(): UserRole[] {
  return Object.values(UserRole);
} 