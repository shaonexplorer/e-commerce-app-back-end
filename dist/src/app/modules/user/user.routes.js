"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const zodValidation_1 = require("../../middleware/zodValidation");
const user_validation_1 = require("./user.validation");
const authenticate_1 = require("../../middleware/authenticate");
const router = express_1.default.Router();
router.get("/getMe", (0, authenticate_1.authenticate)(["ADMIN", "SELLER", "BUYER"]), user_controller_1.userController.getMe);
router.get("/", (0, authenticate_1.authenticate)(["ADMIN"]), user_controller_1.userController.getAllUsers);
router.post("/register", (0, zodValidation_1.zodValidation)(user_validation_1.createUserZodSchema), user_controller_1.userController.register);
router.post("/:id", (0, authenticate_1.authenticate)(["ADMIN"]), user_controller_1.userController.suspendUser);
exports.userRoutes = router;
