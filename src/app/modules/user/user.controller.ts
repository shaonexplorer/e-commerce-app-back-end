import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.getMe(req);
    res.status(200).json({
      status: 200,
      success: true,
      message: "User retrived successfully",
      data: user,
    });
  }
);

const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.register(req);
    res.status(201).json({
      status: 201,
      success: true,
      message: "User registered successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userService.getAllUsers(req);
    res.status(200).json({
      status: 200,
      success: true,
      message: "User retrieved successfully",
      data: users,
    });
  }
);

const suspendUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.suspendUser(req);
    res.status(200).json({
      status: 200,
      success: true,
      message: "User suspended successfully",
      data: user,
    });
  }
);

export const userController = {
  register,
  getAllUsers,
  suspendUser,
  getMe,
};
