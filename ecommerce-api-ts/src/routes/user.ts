import { Router } from "express";
import { createUser, getUsers, getUserById, updateUser, deleteUser } from "../controllers/User";

const router = Router();

// POST - Create user
router.post("/", createUser);

// GET - Get all users
router.get("/", getUsers);

// GET - Get user by id
router.get("/:id", getUserById);

// PUT - Update user by id
router.put("/:id", updateUser);

// DELETE - Delete user by id
router.delete("/:id", deleteUser);

export default router;