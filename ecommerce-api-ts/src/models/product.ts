import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  id: string;
  name: string;
  price: number;
  description?: string;
  categoryId: string;
  inStock: boolean;
  quantity: number;
}

const productSchema = new Schema<IProduct>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  categoryId: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  quantity: { type: Number, required: true }
});

export const ProductModel = mongoose.model<IProduct>("Product", productSchema);
