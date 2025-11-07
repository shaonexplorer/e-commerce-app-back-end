import express from "express";
import { userController } from "./user.controller";
import { zodValidation } from "../../middleware/zodValidation";
import { createUserZodSchema } from "./user.validation";
import { authenticate } from "../../middleware/authenticate";

const router = express.Router();

router.get(
  "/getMe",
  authenticate(["ADMIN", "SELLER", "BUYER"]),
  userController.getMe
);

router.get("/", authenticate(["ADMIN"]), userController.getAllUsers);

router.post("/:id", authenticate(["ADMIN"]), userController.suspendUser);

router.post(
  "/register",
  zodValidation(createUserZodSchema),
  userController.register
);

export const userRoutes = router;
