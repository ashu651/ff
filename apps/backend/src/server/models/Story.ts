import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStory extends Document {
  user: Types.ObjectId;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  expiresAt: Date;
  viewers: Types.ObjectId[];
  createdAt: Date;
}

const storySchema = new Schema<IStory>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video'], required: true },
    expiresAt: { type: Date, required: true, index: true },
    viewers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Story = mongoose.model<IStory>('Story', storySchema);