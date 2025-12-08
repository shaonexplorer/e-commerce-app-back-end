import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { orderController } from "./order.controller";

const router = express.Router();

router.get("/", authenticate(["SELLER"]), orderController.getOrders);

router.get("/all", authenticate(["ADMIN"]), orderController.getAllOrders);

router.get("/:orderId", orderController.getSingleOrder);

router.get("/orderItems/:orderId", orderController.getorderItems);

router.post("/", authenticate(["BUYER", "ADMIN"]), orderController.createOrder);

router.patch(
  "/:orderId",
  authenticate(["ADMIN"]),
  orderController.updateOrderStatus
);

export const orderRoutes = router;
