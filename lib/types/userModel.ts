import mongoose, { Schema, models, model } from 'mongoose';
import { IUser } from './user.d';

/**
 * User schema definition
 * Defines the structure and validation rules for user documents
 */
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], required: true },
});

// Create or retrieve the User model
const User = models.User || model<IUser>('User', UserSchema);

export default User; 