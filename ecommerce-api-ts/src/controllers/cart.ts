import { Request, Response } from "express";
import { CartModel } from "../models/cart";
import { ProductModel } from "../models/product";

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
