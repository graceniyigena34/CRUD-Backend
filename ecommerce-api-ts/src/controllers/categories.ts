import { Request, Response } from "express";
import { CategoryModel } from "../models/categories";

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: Electronic devices and accessories
 *     responses:
 *       201:
 *         description: Category created successfully
 *       500:
 *         description: Failed to create category
 */
// Create Category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const category = new CategoryModel({
      name,
      description
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to create category", error });
  }
};

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *       500:
 *         description: Failed to fetch categories
 */
// Get All Categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64d2bfe4e0c8b2f1a2c9d5b6
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Failed to update category
 */
// Update Category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Failed to update category", error });
  }
};

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64d2bfe4e0c8b2f1a2c9d5b6
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Failed to delete category
 */
// Delete Category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);
    
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error });
  }
};

