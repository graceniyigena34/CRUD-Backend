import { Router } from "express";
import { categories, createCategory, Category } from "../models/categories";

const router = Router();

// GET all categories
router.get("/", (_, res) => {
  res.json(categories);
});

// GET category by ID
router.get("/:id", (req, res) => {
  const category = categories.find(c => c.id === req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json(category);
});

// POST create category
router.post("/", (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });
  const newCategory: Category = createCategory(name, description);
  res.status(201).json(newCategory);
});

// PUT update category
router.put("/:id", (req, res) => {
  const category = categories.find(c => c.id === req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });

  category.name = req.body.name ?? category.name;
  category.description = req.body.description ?? category.description;

  res.json(category);
});

// DELETE category
router.delete("/:id", (req, res) => {
  const index = categories.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Category not found" });

  categories.splice(index, 1);
  res.json({ message: "Category deleted" });
});

export default router;
