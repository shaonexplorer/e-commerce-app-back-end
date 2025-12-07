import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { orderController } from "./order.controller";

const router = express.Router();

router.get("/", authenticate(["SELLER"]), orderController.getAllOrders);

router.get("/orderItems/:orderId", orderController.getorderItems);

router.post("/", authenticate(["BUYER", "ADMIN"]), orderController.createOrder);

router.patch(
  "/:orderId",
  authenticate(["ADMIN"]),
  orderController.updateOrderStatus
);

export const orderRoutes = router;
