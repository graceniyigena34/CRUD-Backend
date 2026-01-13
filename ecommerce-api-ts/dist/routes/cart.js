"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_1 = require("../controllers/cart");
const router = (0, express_1.Router)();
// POST - Add item to cart
router.post("/", cart_1.addToCart);
// GET - Get all cart items
router.get("/", cart_1.getCart);
// PUT - Update cart item by id
router.put("/:id", cart_1.updateCartItem);
// DELETE - Delete cart item by id
router.delete("/:id", cart_1.deleteCartItem);
exports.default = router;
