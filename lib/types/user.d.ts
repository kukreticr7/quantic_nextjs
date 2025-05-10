export type UserRole = 'admin' | 'user';

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  role: UserRole;
} 