import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IHighlight extends Document {
  user: Types.ObjectId;
  title: string;
  coverUrl?: string;
  stories: Types.ObjectId[];
  createdAt: Date;
}

const schema = new Schema<IHighlight>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    coverUrl: { type: String },
    stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Highlight = mongoose.model<IHighlight>('Highlight', schema);