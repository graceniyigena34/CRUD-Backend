import { Router } from "express";
import { addToCart, getCartByUser, updateCartItem, deleteCartItem, clearCart } from "../controllers/cart";

const router = Router();

// POST - Add item to cart
router.post("/", addToCart);

// GET - Get cart items by user
router.get("/user/:userId", getCartByUser);

// PUT - Update cart item by id
router.put("/:id", updateCartItem);

// DELETE - Delete cart item by id
router.delete("/:id", deleteCartItem);

// DELETE - Clear cart by user
router.delete("/user/:userId", clearCart);

export default router;
