"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("./app/modules/user/user.routes");
const auth_routes_1 = require("./app/modules/auth/auth.routes");
const product_routes_1 = require("./app/modules/product/product.routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const order_routes_1 = require("./app/modules/order/order.routes");
const cors_1 = __importDefault(require("cors"));
const payment_routes_1 = require("./app/modules/payment/payment.routes");
const invoice_routes_1 = require("./app/modules/invoice/invoice.routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        `http://localhost:3000`,
        `https://e-commerce-app-front-end-psi.vercel.app`,
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send("Welcome to the E-Commerce App API");
});
app.use("/api/v1/users", user_routes_1.userRoutes);
app.use("/api/v1/auth", auth_routes_1.authRoutes);
app.use("/api/v1/product", product_routes_1.productRoutes);
app.use("/api/v1/order", order_routes_1.orderRoutes);
app.use("/api/v1/payment", payment_routes_1.paymentRoutes);
app.use("/api/v1/invoice", invoice_routes_1.invoiceRoutes);
app.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        success: false,
        message: "Route Not Found",
    });
});
app.use((error, req, res, next) => {
    res.status(error.status || 400).json({
        status: error.status,
        success: false,
        message: error.message || "Bad Request",
        error,
    });
});
exports.default = app;
