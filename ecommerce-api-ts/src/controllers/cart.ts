import { Request, Response } from "express";
import { CartModel } from "../models/cart";

// Add to Cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    const cartItem = new CartModel({
      productId,
      quantity
    });

    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart", error });
  }
};

// Get Cart Items
export const getCart = async (req: Request, res: Response) => {
  try {
    const cartItems = await CartModel.find();
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart", error });
  }
};

// Update Cart Item
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { productId, quantity } = req.body;
    
    const updatedItem = await CartModel.findByIdAndUpdate(
      id,
      { productId, quantity },
      { new: true }
    );
    
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
