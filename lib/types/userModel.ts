import mongoose, { Schema, models, model } from 'mongoose';
import { IUser } from './user.d';

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], required: true },
});

const User = models.User || model<IUser>('User', UserSchema);

export default User; 