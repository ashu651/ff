import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPushSubscription extends Document {
  user: Types.ObjectId;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  createdAt: Date;
}

const schema = new Schema<IPushSubscription>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    endpoint: { type: String, required: true, unique: true },
    keys: { type: Object, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const PushSubscription = mongoose.model<IPushSubscription>('PushSubscription', schema);