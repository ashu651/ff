import mongoose, { Schema, Document, Types } from 'mongoose';

export type MediaType = 'image' | 'video';

export interface IPost extends Document {
  user: Types.ObjectId;
  caption?: string;
  mediaUrl: string;
  mediaType: MediaType;
  tags: string[];
  location?: string;
  likes: Types.ObjectId[];
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    caption: { type: String },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video'], required: true },
    tags: [{ type: String, index: true }],
    location: { type: String, index: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ caption: 'text', tags: 1, location: 1 });

export const Post = mongoose.model<IPost>('Post', postSchema);