import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = await AuthService.login(req);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "User logged in successfully",
      accessToken,
      refreshToken,
    });
  }
);

const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "User logged out successfully",
    });
  }
);

export const AuthController = {
  login,
  logOut,
};
