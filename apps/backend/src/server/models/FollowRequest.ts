import mongoose, { Schema, Document, Types } from 'mongoose';

export type FollowRequestStatus = 'pending' | 'accepted' | 'declined';

export interface IFollowRequest extends Document {
  fromUser: Types.ObjectId;
  toUser: Types.ObjectId;
  status: FollowRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IFollowRequest>(
  {
    fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    toUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending', index: true },
  },
  { timestamps: true }
);

schema.index({ fromUser: 1, toUser: 1 }, { unique: true });

export const FollowRequest = mongoose.model<IFollowRequest>('FollowRequest', schema);