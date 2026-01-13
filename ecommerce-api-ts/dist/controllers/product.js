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
exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.createProduct = void 0;
const product_1 = require("../models/product");
const uuid_1 = require("uuid");
// Create Product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, categoryId, description, inStock, quantity } = req.body;
        const product = new product_1.ProductModel({
            id: (0, uuid_1.v4)(),
            name,
            price,
            categoryId,
            description,
            inStock,
            quantity
        });
        yield product.save();
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create product", error });
    }
});
exports.createProduct = createProduct;
// Get All Products
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.ProductModel.find();
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch products", error });
    }
});
exports.getProducts = getProducts;
// Update Product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedProduct = yield product_1.ProductModel.findOneAndUpdate({ id }, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update product", error });
    }
});
exports.updateProduct = updateProduct;
// Delete Product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedProduct = yield product_1.ProductModel.findOneAndDelete({ id });
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete product", error });
    }
});
exports.deleteProduct = deleteProduct;
