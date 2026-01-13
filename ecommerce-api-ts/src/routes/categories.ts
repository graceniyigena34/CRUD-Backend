import { Router } from "express";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../controllers/categories";

const router = Router();

// POST - Create category
router.post("/", createCategory);

// GET - Get all categories
router.get("/", getCategories);

// PUT - Update category by id
router.put("/:id", updateCategory);

// DELETE - Delete category by id
router.delete("/:id", deleteCategory);

export default router;
