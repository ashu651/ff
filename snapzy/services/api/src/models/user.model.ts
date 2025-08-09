import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  name: string;
  bio?: string;
  avatar?: { url: string; publicId: string };
  website?: string;
  location?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  settings: { darkMode: boolean; privateAccount: boolean };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    bio: String,
    avatar: { url: String, publicId: String },
    website: String,
    location: String,
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },
    settings: {
      darkMode: { type: Boolean, default: false },
      privateAccount: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);