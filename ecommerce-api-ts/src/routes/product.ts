import { Router } from "express";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../controllers/product";

const router = Router();

// POST - Create product
router.post("/", createProduct);

// GET - Get all products
router.get("/", getProducts);

// GET - Get product by id
router.get("/:id", getProductById);

// PUT - Update product by id
router.put("/:id", updateProduct);

// DELETE - Delete product by id
router.delete("/:id", deleteProduct);

export default router;
