import mongoose, { Schema, Document, Types } from 'mongoose';

export type NotificationType = 'like' | 'comment' | 'follow' | 'message';

export interface INotification extends Document {
  user: Types.ObjectId; // recipient
  fromUser: Types.ObjectId; // actor
  type: NotificationType;
  post?: Types.ObjectId | null;
  comment?: Types.ObjectId | null;
  message?: Types.ObjectId | null;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['like', 'comment', 'follow', 'message'], required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', default: null },
    comment: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    message: { type: Schema.Types.ObjectId, ref: 'Message', default: null },
    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);