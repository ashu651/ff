import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDeviceSession extends Document {
  user: Types.ObjectId;
  userAgent?: string;
  ip?: string;
  createdAt: Date;
  lastSeenAt: Date;
}

const schema = new Schema<IDeviceSession>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userAgent: { type: String },
    ip: { type: String },
    lastSeenAt: { type: Date, default: () => new Date() },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const DeviceSession = mongoose.model<IDeviceSession>('DeviceSession', schema);