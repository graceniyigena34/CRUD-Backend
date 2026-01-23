import { Request, Response } from "express";
import mongoose from "mongoose";
import { OrderModel } from "../models/Order";
import { CartModel } from "../models/cart";
import { ProductModel } from "../models/product";
import { AuthRequest } from "../middleware/auth";
import nodemailer from "nodemailer";

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management system
 */

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create order from cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shippingAddress
 *             properties:
 *               shippingAddress:
 *                 type: string
 *                 example: "123 Main St, City, State 12345"
 *               paymentMethod:
 *                 type: string
 *                 example: "credit_card"
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalAmount:
 *                   type: number
 *                 status:
 *                   type: string
 *                   example: pending
 *       400:
 *         description: Cart is empty or insufficient stock
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to create order
 */
// Create Order from Cart
export const createOrder = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.user?.userId;
    
    // Get cart items
    const cartItems = await CartModel.find({ userId }).populate("productId").session(session);
    
    if (cartItems.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Cart is empty" });
    }
    
    let totalAmount = 0;
    const orderItems = [];
    
    // Process cart items and check stock
    for (const cartItem of cartItems) {
      const product = cartItem.productId as any;
      
      if (product.stock < cartItem.quantity) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      
      // Reduce stock
      await ProductModel.findByIdAndUpdate(
        product._id,
        { $inc: { stock: -cartItem.quantity } },
        { session }
      );
      
      const itemTotal = product.price * cartItem.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity
      });
    }
    
    // Create order
    const order = new OrderModel({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod
    });
    
    await order.save({ session });
    
    // Clear cart
    await CartModel.deleteMany({ userId }, { session });
    
    await session.commitTransaction();
    
    // Send order confirmation email
    const mailOptions = {
      from: `"E-commerce App" <${process.env.EMAIL_USER}>`,
      to: req.user?.email,
      subject: "Order Placed Successfully",
      html: `
        <h2>Order Confirmation</h2>
        <p>Your order #${order._id} has been placed successfully!</p>
        <p>Total Amount: $${totalAmount}</p>
        <p>Status: ${order.status}</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.status(201).json(order);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Failed to create order", error });
  } finally {
    session.endSession();
  }
};

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   items:
 *                     type: array
 *                   totalAmount:
 *                     type: number
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to fetch orders
 */
// Get User Orders
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get single order (user's own)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64d2bfe4e0c8b2f1a2c9d5b9
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Failed to fetch order
 */
// Get Single Order (User's own)
export const getUserOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    
    const order = await OrderModel.findOne({ _id: id, userId });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error });
  }
};

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel order (only pending orders)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64d2bfe4e0c8b2f1a2c9d5b9
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order cancelled successfully
 *                 order:
 *                   type: object
 *       400:
 *         description: Only pending orders can be cancelled
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Failed to cancel order
 */
// Cancel Order (Customer)
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    const { id } = req.params;
    const userId = req.user?.userId;
    
    const order = await OrderModel.findOne({ _id: id, userId }).session(session);
    
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Order not found" });
    }
    
    if (order.status !== "pending") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }
    
    // Restore stock
    for (const item of order.items) {
      await ProductModel.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }
    
    order.status = "cancelled";
    await order.save({ session });
    
    await session.commitTransaction();
    
    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Failed to cancel order", error });
  } finally {
    session.endSession();
  }
};

/**
 * @swagger
 * /api/orders/admin/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: object
 *                   items:
 *                     type: array
 *                   totalAmount:
 *                     type: number
 *                   status:
 *                     type: string
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Failed to fetch orders
 */
// Admin: Get All Orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find().populate("userId", "firstName lastName email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

/**
 * @swagger
 * /api/orders/admin/orders/{id}/status:
 *   patch:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64d2bfe4e0c8b2f1a2c9d5b9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipped, delivered, cancelled]
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Failed to update order status
 */
// Admin: Update Order Status
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("userId", "firstName lastName email");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Send status update email
    const user = order.userId as any;
    const mailOptions = {
      from: `"E-commerce App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Order Status Updated",
      html: `
        <h2>Order Status Update</h2>
        <p>Hello ${user.firstName},</p>
        <p>Your order #${order._id} status has been updated to: <strong>${status}</strong></p>
        <p>Total Amount: $${order.totalAmount}</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error });
  }
};