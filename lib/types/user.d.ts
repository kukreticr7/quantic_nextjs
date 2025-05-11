/**
 * User role type
 * Defines possible user roles in the system
 */
export type UserRole = 'admin' | 'user';

/**
 * User interface
 * Defines the structure of a user in the system
 */
export interface IUser {
  _id?: string;      // Optional MongoDB document ID
  email: string;     // User's email address
  password: string;  // Hashed password
  role: UserRole;    // User's role (admin or user)
} 