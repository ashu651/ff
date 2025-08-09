import { Schema, model, Document, Types } from 'mongoose';

export interface IStory extends Document {
  author: Types.ObjectId;
  media: { url: string; publicId: string; type: 'image' | 'video' };
  expiresAt: Date;
  createdAt: Date;
}

const schema = new Schema<IStory>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  media: { url: { type: String, required: true }, publicId: { type: String, required: true }, type: { type: String, enum: ['image', 'video'], required: true } },
  expiresAt: { type: Date, required: true, index: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Story = model<IStory>('Story', schema);