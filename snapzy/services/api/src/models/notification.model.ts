import { Schema, model, Document, Types } from 'mongoose';

export type NotificationType = 'like' | 'comment' | 'follow' | 'message';

export interface INotification extends Document {
  user: Types.ObjectId;
  type: NotificationType;
  sourceUser: Types.ObjectId;
  payload?: any;
  read: boolean;
  createdAt: Date;
}

const schema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['like', 'comment', 'follow', 'message'], required: true },
  sourceUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  payload: { type: Object, default: {} },
  read: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Notification = model<INotification>('Notification', schema);