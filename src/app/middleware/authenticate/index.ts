import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authenticate =
  (roles: string[]) =>
  (
    req: Request & { user?: string | JwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies?.accessToken;

      if (!token) {
        throw new Error("Authentication token is missing");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      if (roles.length && !roles.includes((decoded as any).userRole)) {
        throw new Error("You are not authorized to access this resource");
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
