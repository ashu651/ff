import { Schema, model, Document, Types } from 'mongoose';

export interface IMediaItem {
  url: string;
  publicId: string;
  type: 'image' | 'video';
  width?: number;
  height?: number;
  duration?: number;
}

export interface IPost extends Document {
  author: Types.ObjectId;
  caption?: string;
  media: IMediaItem[];
  hashtags: string[];
  location?: { name: string; coords?: [number, number] };
  likesCount: number;
  commentsCount: number;
  visibility: 'public' | 'private';
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMediaItem>({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], required: true },
  width: Number,
  height: Number,
  duration: Number,
});

const postSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    caption: String,
    media: { type: [mediaSchema], default: [] },
    hashtags: [{ type: String, index: true }],
    location: { name: String, coords: [Number] },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });

export const Post = model<IPost>('Post', postSchema);