import { Router } from "express";
import { createOrder, getUserOrders, getUserOrder, cancelOrder, getAllOrders, updateOrderStatus } from "../controllers/Order";
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router = Router();

// Customer Routes (Protected)
router.post("/", authenticateToken, createOrder);
router.get("/", authenticateToken, getUserOrders);
router.get("/:id", authenticateToken, getUserOrder);
router.patch("/:id/cancel", authenticateToken, cancelOrder);

// Admin Routes (Protected + Admin Role)
router.get("/admin/orders", authenticateToken, requireAdmin, getAllOrders);
router.patch("/admin/orders/:id/status", authenticateToken, requireAdmin, updateOrderStatus);

export default router;