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
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);