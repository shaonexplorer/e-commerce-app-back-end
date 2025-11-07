import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/login", AuthController.login);

router.post("/logOut", AuthController.logOut);

export const authRoutes = router;
