"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = __importDefault(require("./config/db"));
const categories_1 = __importDefault(require("./routes/categories"));
const product_1 = __importDefault(require("./routes/product"));
const cart_1 = __importDefault(require("./routes/cart"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
//connect DB
(0, db_1.default)();
// Routes
app.use("/api/categories", categories_1.default);
app.use("/api/products", product_1.default);
app.use("/api/cart", cart_1.default);
// Default route
app.get("/", (_req, res) => {
    res.send("E-commerce API is running!");
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
