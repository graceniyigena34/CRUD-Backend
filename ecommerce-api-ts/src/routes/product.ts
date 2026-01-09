import { Router } from "express";
import { products, createProduct, Product } from "../models/product";

const router = Router();

// GET all products
router.get("/", (_, res) => res.json(products));

// GET product by ID
router.get("/:id", (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// POST create product
router.post("/", (req, res) => {
  const { name, price, description, categoryId, inStock, quantity } = req.body;
  if (!name || price == null || !categoryId || inStock == null || quantity == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newProduct: Product = createProduct({ name, price, description, categoryId, inStock, quantity });
  res.status(201).json(newProduct);
});

// PUT update product
router.put("/:id", (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  Object.assign(product, req.body);
  res.json(product);
});

// DELETE product
router.delete("/:id", (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });

  products.splice(index, 1);
  res.json({ message: "Product deleted" });
});

export default router;
