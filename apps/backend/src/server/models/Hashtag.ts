import mongoose, { Schema, Document } from 'mongoose';

export interface IHashtag extends Document {
  name: string;
  postsCount: number;
  updatedAt: Date;
}

const hashtagSchema = new Schema<IHashtag>(
  {
    name: { type: String, required: true, unique: true, index: true },
    postsCount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export const Hashtag = mongoose.model<IHashtag>('Hashtag', hashtagSchema);