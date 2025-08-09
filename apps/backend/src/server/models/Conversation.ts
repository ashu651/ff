import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IConversation extends Document {
  members: Types.ObjectId[];
  lastMessage?: Types.ObjectId | null;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message', default: null },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

conversationSchema.index({ members: 1 });

export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);