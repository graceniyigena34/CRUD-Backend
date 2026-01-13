import { Router } from "express";
import { addToCart, getCart, updateCartItem, deleteCartItem } from "../controllers/cart";

const router = Router();

// POST - Add item to cart
router.post("/", addToCart);

// GET - Get all cart items
router.get("/", getCart);

// PUT - Update cart item by id
router.put("/:id", updateCartItem);

// DELETE - Delete cart item by id
router.delete("/:id", deleteCartItem);

export default router;
