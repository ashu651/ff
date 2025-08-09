import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStoryPollOption {
  label: string;
  votes: number;
}

export interface IStory extends Document {
  user: Types.ObjectId;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  expiresAt: Date;
  viewers: Types.ObjectId[];
  audience: 'public' | 'close_friends';
  poll?: { question: string; options: IStoryPollOption[] } | null;
  createdAt: Date;
}

const pollOptionSchema = new Schema<IStoryPollOption>({
  label: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const storySchema = new Schema<IStory>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video'], required: true },
    expiresAt: { type: Date, required: true, index: true },
    viewers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    audience: { type: String, enum: ['public', 'close_friends'], default: 'public', index: true },
    poll: { type: Object, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Story = mongoose.model<IStory>('Story', storySchema);