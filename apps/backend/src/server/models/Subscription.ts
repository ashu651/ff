import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISubscription extends Document {
  creator: Types.ObjectId;
  subscriber: Types.ObjectId;
  tier: 'basic' | 'premium';
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ISubscription>(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subscriber: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tier: { type: String, enum: ['basic', 'premium'], default: 'basic' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

schema.index({ creator: 1, subscriber: 1 }, { unique: true });

export const Subscription = mongoose.model<ISubscription>('Subscription', schema);