import { Router } from "express";
import { carts, Cart, CartItem } from "../models/cart";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// GET cart by userId
router.get("/:userId", (req, res) => {
  const cart = carts.find(c => c.userId === req.params.userId);
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  res.json(cart);
});

// POST add item to cart
router.post("/:userId/items", (req, res) => {
  let cart = carts.find(c => c.userId === req.params.userId);
  if (!cart) {
    cart = { userId: req.params.userId, items: [] };
    carts.push(cart);
  }

  const { productId, quantity } = req.body;
  if (!productId || quantity == null) return res.status(400).json({ message: "Missing productId or quantity" });

  const newItem: CartItem = { id: uuidv4(), productId, quantity };
  cart.items.push(newItem);
  res.status(201).json(newItem);
});

// PUT update cart item
router.put("/:userId/items/:id", (req, res) => {
  const cart = carts.find(c => c.userId === req.params.userId);
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  Object.assign(item, req.body);
  res.json(item);
});

// DELETE cart item
router.delete("/:userId/items/:id", (req, res) => {
  const cart = carts.find(c => c.userId === req.params.userId);
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const index = cart.items.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Item not found" });

  cart.items.splice(index, 1);
  res.json({ message: "Item deleted" });
});

// DELETE entire cart
router.delete("/:userId", (req, res) => {
  const index = carts.findIndex(c => c.userId === req.params.userId);
  if (index === -1) return res.status(404).json({ message: "Cart not found" });

  carts.splice(index, 1);
  res.json({ message: "Cart deleted" });
});

export default router;
