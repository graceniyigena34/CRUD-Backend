import { Router } from "express";
import { addToCart, getCartByUser, updateCartItem, deleteCartItem, clearCart } from "../controllers/cart";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// POST - Add item to cart (Authenticated users)
router.post("/", authenticateToken, addToCart);

// GET - Get cart items by user (Authenticated users)
router.get("/user/:userId", authenticateToken, getCartByUser);

// PUT - Update cart item by id (Authenticated users)
router.put("/:id", authenticateToken, updateCartItem);

// DELETE - Delete cart item by id (Authenticated users)
router.delete("/:id", authenticateToken, deleteCartItem);

// DELETE - Clear cart by user (Authenticated users)
router.delete("/user/:userId", authenticateToken, clearCart);

export default router;
