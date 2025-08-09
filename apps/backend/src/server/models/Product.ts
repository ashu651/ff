import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  seller: Types.ObjectId;
  title: string;
  priceCents: number;
  imageUrl?: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IProduct>(
  {
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    priceCents: { type: Number, required: true },
    imageUrl: { type: String },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', schema);