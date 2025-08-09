import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAccountLink extends Document {
  owner: Types.ObjectId;
  accounts: Types.ObjectId[];
  createdAt: Date;
}

const schema = new Schema<IAccountLink>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    accounts: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AccountLink = mongoose.model<IAccountLink>('AccountLink', schema);