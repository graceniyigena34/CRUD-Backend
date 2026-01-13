"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_1 = require("../controllers/categories");
const router = (0, express_1.Router)();
// POST - Create category
router.post("/", categories_1.createCategory);
// GET - Get all categories
router.get("/", categories_1.getCategories);
// PUT - Update category by id
router.put("/:id", categories_1.updateCategory);
// DELETE - Delete category by id
router.delete("/:id", categories_1.deleteCategory);
exports.default = router;
