import mongoose, { Schema, Document, Types } from 'mongoose';

export type AnalyticsEventName = 'post_view' | 'like' | 'comment' | 'story_view' | 'message_send' | 'follow' | 'save' | 'share';

export interface IAnalyticsEvent extends Document {
  user?: Types.ObjectId | null;
  contentType?: 'post' | 'story' | 'reel' | 'profile' | null;
  contentId?: Types.ObjectId | null;
  name: AnalyticsEventName;
  meta?: Record<string, any>;
  createdAt: Date;
}

const schema = new Schema<IAnalyticsEvent>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    contentType: { type: String, default: null },
    contentId: { type: Schema.Types.ObjectId, default: null, index: true },
    name: { type: String, required: true, index: true },
    meta: { type: Object, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AnalyticsEvent = mongoose.model<IAnalyticsEvent>('AnalyticsEvent', schema);