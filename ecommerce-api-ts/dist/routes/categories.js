"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_1 = require("../controllers/categories");
const router = (0, express_1.Router)();
// GET all categories
router.get("/", categories_1.getCategories);
// POST create category
router.post("/", categories_1.createCategory);
exports.default = router;
