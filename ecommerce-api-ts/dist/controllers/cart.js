"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCartItem = exports.updateCartItem = exports.getCart = exports.addToCart = void 0;
const cart_1 = require("../models/cart");
// Add to Cart
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity } = req.body;
        const cartItem = new cart_1.CartModel({
            productId,
            quantity
        });
        yield cartItem.save();
        res.status(201).json(cartItem);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to add to cart", error });
    }
});
exports.addToCart = addToCart;
// Get Cart Items
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartItems = yield cart_1.CartModel.find();
        res.json(cartItems);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch cart", error });
    }
});
exports.getCart = getCart;
// Update Cart Item
const updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { productId, quantity } = req.body;
        const updatedItem = yield cart_1.CartModel.findByIdAndUpdate(id, { productId, quantity }, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        res.json(updatedItem);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update cart item", error });
    }
});
exports.updateCartItem = updateCartItem;
// Delete Cart Item
const deleteCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedItem = yield cart_1.CartModel.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        res.json({ message: "Item removed from cart" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete cart item", error });
    }
});
exports.deleteCartItem = deleteCartItem;
