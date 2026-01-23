import { Request, Response } from "express";
import { CartModel } from "../models/cart";
import { ProductModel } from "../models/product";

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *               - quantity
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 64d2bfe4e0c8b2f1a2c9d5b6
 *               productId:
 *                 type: string
 *                 example: 64d2bfe4e0c8b2f1a2c9d5b7
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *       200:
 *         description: Item quantity updated in cart
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to add to cart
 */
// Add to Cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity } = req.body;
    
    // Check if product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Check if item already exists in cart
    const existingCartItem = await CartModel.findOne({ userId, productId });
    
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      res.json(existingCartItem);
    } else {
      const cartItem = new CartModel({
        userId,
        productId,
        quantity
      });
      
      await cartItem.save();
      res.status(201).json(cartItem);
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart", error });
  }
};

/**
 * @swagger
 * /api/cart/user/{userId}:
 *   get:
 *     summary: Get cart items by user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 64d2bfe4e0c8b2f1a2c9d5b6
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
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
 *                   productId:
 *                     type: object
 *                   quantity:
 *                     type: number
 *       500:
 *         description: Failed to fetch cart
 */
// Get Cart Items by User
export const getCartByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const cartItems = await CartModel.find({ userId }).populate("productId", "name price imageUrl");
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart", error });
  }
};

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64d2bfe4e0c8b2f1a2c9d5b8
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 5
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Failed to update cart item
 */
// Update Cart Item
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    const updatedItem = await CartModel.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    ).populate("productId", "name price imageUrl");
    
    if (!updatedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart item", error });
  }
};

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Delete cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64d2bfe4e0c8b2f1a2c9d5b8
 *     responses:
 *       200:
 *         description: Item removed from cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Item removed from cart
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Failed to delete cart item
 */
// Delete Cart Item
export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedItem = await CartModel.findByIdAndDelete(id);
    
    if (!deletedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete cart item", error });
  }
};

/**
 * @swagger
 * /api/cart/user/{userId}:
 *   delete:
 *     summary: Clear entire cart for user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 64d2bfe4e0c8b2f1a2c9d5b6
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart cleared successfully
 *       500:
 *         description: Failed to clear cart
 */
// Clear Cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await CartModel.deleteMany({ userId });
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", error });
  }
};
