import mongoose, { Schema, Document } from "mongoose";

export interface ICart extends Document {
  productId: string;
  quantity: number;
}

const cartSchema = new Schema<ICart>({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true }
});

export const CartModel = mongoose.model<ICart>("Cart", cartSchema);
