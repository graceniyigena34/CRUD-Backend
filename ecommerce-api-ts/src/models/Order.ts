import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  shippingAddress: string;
  paymentMethod: string;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "paid", "shipped", "delivered", "cancelled"], 
    default: "pending" 
  },
  shippingAddress: { type: String },
  paymentMethod: { type: String, default: "cash" },
  isPaid: { type: Boolean, default: false }
}, { timestamps: true });

export const OrderModel = mongoose.model<IOrder>("Order", orderSchema);
