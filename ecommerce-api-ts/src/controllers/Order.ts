import { Request, Response } from "express";
import { OrderModel } from "../models/Order";
import { OrderItemModel } from "../models/OrderItem";
import { CartModel } from "../models/cart";
import { ProductModel } from "../models/product";

// Create Order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, shippingAddress, paymentMethod, items } = req.body;
    
    let totalAmount = 0;
    
    // Calculate total amount
    for (const item of items) {
      const product = await ProductModel.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      totalAmount += product.price * item.quantity;
    }
    
    const order = new OrderModel({
      userId,
      totalAmount,
      shippingAddress,
      paymentMethod
    });

    await order.save();
    
    // Create order items
    for (const item of items) {
      const product = await ProductModel.findById(item.productId);
      await OrderItemModel.create({
        orderId: order._id,
        productId: item.productId,
        quantity: item.quantity,
        price: product!.price
      });
    }
    
    // Clear cart items for this user
    await CartModel.deleteMany({ userId });
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error });
  }
};

// Get All Orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find().populate("userId", "firstName lastName email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

// Get Order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id).populate("userId", "firstName lastName email");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    const orderItems = await OrderItemModel.find({ orderId: id }).populate("productId", "name price");
    
    res.json({ ...order.toObject(), items: orderItems });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error });
  }
};

// Update Order Status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, isPaid } = req.body;
    
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { status, isPaid },
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error });
  }
};

// Delete Order
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Delete order items first
    await OrderItemModel.deleteMany({ orderId: id });
    
    const deletedOrder = await OrderModel.findByIdAndDelete(id);
    
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error });
  }
};