import { Request, Response } from "express";
import { ProductModel } from "../models/product";
import { v4 as uuidv4 } from "uuid";

// Create Product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, categoryId, description, inStock, quantity } = req.body;

    const product = new ProductModel({
      id: uuidv4(),
      name,
      price,
      categoryId,
      description,
      inStock,
      quantity
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error });
  }
};

// Get All Products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

// Update Product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { id },
      req.body,
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
  }
};

// Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedProduct = await ProductModel.findOneAndDelete({ id });
    
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error });
  }
};
