import { Request, Response } from "express";
import { UserModel } from "../models/User";
import { hashPassword } from "../utils/hashpassword";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new UserModel({
      firstName,
      lastName,
      email,
      password: await hashPassword(password),
    });

    await user.save();

    const { password: _, ...userResponse } = user.toObject();
    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
