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
exports.getProducts = exports.createProduct = void 0;
const product_1 = require("../models/product");
const uuid_1 = require("uuid");
// Create Product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, categoryId, description } = req.body;
        const product = new product_1.ProductModel({
            id: (0, uuid_1.v4)(),
            name,
            price,
            categoryId,
            description
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
        res.status(500).json({ message: "Failed to fetch products" });
    }
});
exports.getProducts = getProducts;
