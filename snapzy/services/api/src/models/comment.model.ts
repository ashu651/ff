import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
  post: Types.ObjectId;
  author: Types.ObjectId;
  text: string;
  parentComment?: Types.ObjectId | null;
  createdAt: Date;
}

const schema = new Schema<IComment>({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  text: { type: String, required: true },
  parentComment: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Comment = model<IComment>('Comment', schema);