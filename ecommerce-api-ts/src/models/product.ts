import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  categoryId?: mongoose.Types.ObjectId;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
  stock: { type: Number, required: true, default: 0 },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const ProductModel = mongoose.model<IProduct>("Product", productSchema);
