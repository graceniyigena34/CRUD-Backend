import { Request, Response } from "express";
import { CategoryModel } from "../models/categories";
import { v4 as uuidv4 } from "uuid";

// Create Category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const category = new CategoryModel({
      id: uuidv4(),
      name,
      description
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to create category", error });
  }
};

// Get All Categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};

// Update Category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCategory = await CategoryModel.findOneAndUpdate(
      { id },
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

// Delete Category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCategory = await CategoryModel.findOneAndDelete({ id });
    
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error });
  }
};

