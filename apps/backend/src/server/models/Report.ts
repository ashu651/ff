import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReport extends Document {
  reporter: Types.ObjectId;
  targetUser?: Types.ObjectId | null;
  targetPost?: Types.ObjectId | null;
  reason: string;
  status: 'open' | 'reviewed' | 'actioned' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IReport>(
  {
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetUser: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    targetPost: { type: Schema.Types.ObjectId, ref: 'Post', default: null },
    reason: { type: String, required: true },
    status: { type: String, enum: ['open', 'reviewed', 'actioned', 'dismissed'], default: 'open', index: true },
  },
  { timestamps: true }
);

export const Report = mongoose.model<IReport>('Report', schema);