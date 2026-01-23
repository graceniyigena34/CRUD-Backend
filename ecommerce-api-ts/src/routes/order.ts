import { Router } from "express";
import { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder } from "../controllers/Order";

const router = Router();

// POST - Create order
router.post("/", createOrder);

// GET - Get all orders
router.get("/", getOrders);

// GET - Get order by id
router.get("/:id", getOrderById);

// PUT - Update order status
router.put("/:id", updateOrderStatus);

// DELETE - Delete order
router.delete("/:id", deleteOrder);

export default router;