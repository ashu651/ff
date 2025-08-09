import mongoose, { Schema, Document, Types } from 'mongoose';

export type MediaType = 'image' | 'video';

export interface PostMediaItem {
  url: string;
  type: MediaType;
  thumbnailUrl?: string;
}

export interface IPost extends Document {
  user: Types.ObjectId;
  caption?: string;
  mediaUrl: string; // deprecated, keep for compatibility
  mediaType: MediaType; // deprecated
  media: PostMediaItem[];
  tags: string[]; // hashtags
  userTags: Types.ObjectId[]; // tagged users
  location?: string;
  likes: Types.ObjectId[];
  commentsCount: number;
  scheduledAt?: Date | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const postMediaSchema = new Schema<PostMediaItem>({
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], required: true },
  thumbnailUrl: { type: String },
});

const postSchema = new Schema<IPost>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    caption: { type: String },
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ['image', 'video'] },
    media: { type: [postMediaSchema], default: [] },
    tags: [{ type: String, index: true }],
    userTags: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
    location: { type: String, index: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
    commentsCount: { type: Number, default: 0 },
    scheduledAt: { type: Date, default: null, index: true },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ caption: 'text', tags: 1, location: 1 });

export const Post = mongoose.model<IPost>('Post', postSchema);