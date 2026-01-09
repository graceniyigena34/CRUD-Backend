import { v4 as uuidv4 } from "uuid";

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  categoryId: string;
  inStock: boolean;
  quantity: number;
}

export const products: Product[] = [];

export const createProduct = (data: Omit<Product, "id">): Product => {
  const newProduct: Product = { id: uuidv4(), ...data };
  products.push(newProduct);
  return newProduct;
};
