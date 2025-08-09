import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserCollection {
  name: string;
  posts: Types.ObjectId[];
}

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
  collections: IUserCollection[];
  pinnedPosts: Types.ObjectId[];
  isPrivate: boolean;
  verified: boolean;
  verificationRequest?: { status: 'none' | 'pending' | 'approved' | 'rejected'; note?: string };
  blockedUsers: Types.ObjectId[];
  mutedUsers: Types.ObjectId[];
  closeFriends: Types.ObjectId[];
  twoFactorEnabled: boolean;
  twoFactorSecret?: string | null;
  locale?: string;
  createdAt: Date;
  updatedAt: Date;
}

const collectionsSchema = new Schema<IUserCollection>({
  name: { type: String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

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
    collections: { type: [collectionsSchema], default: [] },
    pinnedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    isPrivate: { type: Boolean, default: false, index: true },
    verified: { type: Boolean, default: false },
    verificationRequest: { type: Object, default: { status: 'none' } },
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