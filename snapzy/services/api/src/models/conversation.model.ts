import { Schema, model, Document, Types } from 'mongoose';

export interface IMessageItem {
  sender: Types.ObjectId;
  text?: string;
  media?: { url: string; publicId: string };
  read: boolean;
  createdAt: Date;
}

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  messages: IMessageItem[];
  lastUpdated: Date;
}

const messageSchema = new Schema<IMessageItem>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: String,
  media: { url: String, publicId: String },
  read: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } });

const schema = new Schema<IConversation>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: { type: [messageSchema], default: [] },
  lastUpdated: { type: Date, default: () => new Date(), index: true },
}, { timestamps: false });

schema.index({ participants: 1 });

export const Conversation = model<IConversation>('Conversation', schema);