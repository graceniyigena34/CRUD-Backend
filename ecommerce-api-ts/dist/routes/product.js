"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_1 = require("../controllers/product");
const router = (0, express_1.Router)();
// POST - Create product
router.post("/", product_1.createProduct);
// GET - Get all products
router.get("/", product_1.getProducts);
// PUT - Update product by id
router.put("/:id", product_1.updateProduct);
// DELETE - Delete product by id
router.delete("/:id", product_1.deleteProduct);
exports.default = router;
