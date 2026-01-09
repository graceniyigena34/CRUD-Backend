import { v4 as uuidv4 } from "uuid";

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export const categories: Category[] = [];

export const createCategory = (name: string, description?: string): Category => {
  const newCategory: Category = { id: uuidv4(), name, description };
  categories.push(newCategory);
  return newCategory;
};
