"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../../middleware/authenticate");
const order_controller_1 = require("./order.controller");
const router = express_1.default.Router();
router.get("/", (0, authenticate_1.authenticate)(["SELLER"]), order_controller_1.orderController.getOrders);
router.get("/all", (0, authenticate_1.authenticate)(["ADMIN"]), order_controller_1.orderController.getAllOrders);
router.get("/:orderId", order_controller_1.orderController.getSingleOrder);
router.get("/orderItems/:orderId", order_controller_1.orderController.getorderItems);
router.post("/", (0, authenticate_1.authenticate)(["BUYER", "ADMIN"]), order_controller_1.orderController.createOrder);
router.patch("/:orderId", (0, authenticate_1.authenticate)(["ADMIN"]), order_controller_1.orderController.updateOrderStatus);
exports.orderRoutes = router;
