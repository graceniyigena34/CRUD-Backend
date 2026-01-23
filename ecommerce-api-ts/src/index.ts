import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { connectDB } from "./config/db";

import authRoutes from "./routes/auth";
import categoryRoutes from "./routes/categories";
import productRoutes from "./routes/product";
import cartRoutes from "./routes/cart";
import userRoutes from "./routes/user";
import orderRoutes from "./routes/order";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

//connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Default route
app.get("/", (_req: Request, res: Response) => {
  res.send("E-commerce API is running!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


