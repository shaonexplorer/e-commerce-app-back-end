"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const order_service_1 = require("./order.service");
const createOrder = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const [order, session] = yield order_service_1.orderService.createOrder(req);
    res.status(201).json({
        status: 201,
        success: true,
        message: "order created successfully",
        data: { session, order },
    });
}));
const updateOrderStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedOrder = yield order_service_1.orderService.updateOrderStatus(req);
    res.status(201).json({
        status: 201,
        success: true,
        message: "order status updated successfully",
        data: updatedOrder,
    });
}));
const getOrders = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderItems = yield order_service_1.orderService.getOrders(req);
    res.status(200).json({
        status: 200,
        success: true,
        message: "orders retrieved successfully",
        data: orderItems,
    });
}));
const getAllOrders = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_service_1.orderService.getAllOrders(req);
    res.status(200).json({
        status: 200,
        success: true,
        message: "orders retrieved successfully",
        data: orders,
    });
}));
const getorderItems = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderItems = yield order_service_1.orderService.getOrderIems(req);
    res.status(200).json({
        status: 200,
        success: true,
        message: "order items retrieved successfully",
        data: orderItems,
    });
}));
const getSingleOrder = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_service_1.orderService.getSingleOrder(req);
    res.status(200).json({
        status: 200,
        success: true,
        message: "order retrieved successfully",
        data: order,
    });
}));
exports.orderController = {
    createOrder,
    updateOrderStatus,
    getAllOrders,
    getorderItems,
    getSingleOrder,
    getOrders,
};
