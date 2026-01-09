import { v4 as uuidv4 } from "uuid";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}

export const carts: Cart[] = [];
