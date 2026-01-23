import { Router } from "express";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../controllers/product";
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router = Router();

// POST - Create product (Admin only)
router.post("/", authenticateToken, requireAdmin, createProduct);

// GET - Get all products (Public)
router.get("/", getProducts);

// GET - Get product by id (Public)
router.get("/:id", getProductById);

// PUT - Update product by id (Admin only)
router.put("/:id", authenticateToken, requireAdmin, updateProduct);

// DELETE - Delete product by id (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, deleteProduct);

export default router;
