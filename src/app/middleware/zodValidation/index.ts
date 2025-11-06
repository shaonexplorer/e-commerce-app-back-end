import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const zodValidation =
  (zodScheme: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      req.body = await zodScheme.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
