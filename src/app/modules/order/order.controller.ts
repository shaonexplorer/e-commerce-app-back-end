import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { orderService } from "./order.service";

const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const [order, session] = await orderService.createOrder(req);

    res.status(201).json({
      status: 201,
      success: true,
      message: "order created successfully",
      data: { session, order },
    });
  }
);

const updateOrderStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedOrder = await orderService.updateOrderStatus(req);

    res.status(201).json({
      status: 201,
      success: true,
      message: "order status updated successfully",
      data: updatedOrder,
    });
  }
);

const getOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderItems = await orderService.getOrders(req);

    res.status(200).json({
      status: 200,
      success: true,
      message: "orders retrieved successfully",
      data: orderItems,
    });
  }
);

const getAllOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await orderService.getAllOrders(req);

    res.status(200).json({
      status: 200,
      success: true,
      message: "orders retrieved successfully",
      data: orders,
    });
  }
);

const getorderItems = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderItems = await orderService.getOrderIems(req);

    res.status(200).json({
      status: 200,
      success: true,
      message: "order items retrieved successfully",
      data: orderItems,
    });
  }
);

const getSingleOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await orderService.getSingleOrder(req);

    res.status(200).json({
      status: 200,
      success: true,
      message: "order retrieved successfully",
      data: order,
    });
  }
);

export const orderController = {
  createOrder,
  updateOrderStatus,
  getAllOrders,
  getorderItems,
  getSingleOrder,
  getOrders,
};
