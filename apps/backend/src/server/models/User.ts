import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  passwordHash: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  savedPosts: Types.ObjectId[];
  isPrivate: boolean;
  verified: boolean;
  blockedUsers: Types.ObjectId[];
  mutedUsers: Types.ObjectId[];
  closeFriends: Types.ObjectId[];
  twoFactorEnabled: boolean;
  twoFactorSecret?: string | null;
  locale?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    bio: { type: String },
    avatarUrl: { type: String },
    passwordHash: { type: String, required: true },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
    savedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post', index: true }],
    isPrivate: { type: Boolean, default: false, index: true },
    verified: { type: Boolean, default: false },
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    mutedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    closeFriends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, default: null },
    locale: { type: String, default: 'en' },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);