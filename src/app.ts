import express, { NextFunction, Request, Response } from "express";
import { userRoutes } from "./app/modules/user/user.routes";
import { authRoutes } from "./app/modules/auth/auth.routes";
import { productRoutes } from "./app/modules/product/product.routes";
import cookieParser from "cookie-parser";
import { orderRoutes } from "./app/modules/order/order.routes";
import cors from "cors";
import { paymentRoutes } from "./app/modules/payment/payment.routes";

const app = express();

app.use(
  cors({
    origin: [`http://localhost:3000`],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to the E-Commerce App API");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 404,
    success: false,
    message: "Route Not Found",
  });
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 400).json({
    status: error.status,
    success: false,
    message: error.message || "Bad Request",
    error,
  });
});

export default app;
