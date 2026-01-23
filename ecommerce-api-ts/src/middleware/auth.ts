import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenBlacklistModel } from "../models/TokenBlacklist";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

// Verify JWT Token
export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  // Check if token is blacklisted
  const blacklistedToken = await TokenBlacklistModel.findOne({ token });
  if (blacklistedToken) {
    return res.status(401).json({ message: "Token has been invalidated" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Admin Only Middleware
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Vendor or Admin Middleware
export const requireVendorOrAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "vendor" && req.user?.role !== "admin") {
    return res.status(403).json({ message: "Vendor or Admin access required" });
  }
  next();
};

// Customer Access Middleware
export const requireCustomer = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "customer") {
    return res.status(403).json({ message: "Customer access required" });
  }
  next();
};

export { AuthRequest };