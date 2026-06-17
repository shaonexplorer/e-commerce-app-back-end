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
exports.userController = void 0;
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../utils/catchAsync");
const getMe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.getMe(req);
    res.status(200).json({
        status: 200,
        success: true,
        message: "User retrived successfully",
        data: user,
    });
}));
const register = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.register(req);
    res.status(201).json({
        status: 201,
        success: true,
        message: "User registered successfully",
        data: user,
    });
}));
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_service_1.userService.getAllUsers(req);
    res.status(200).json({
        status: 200,
        success: true,
        message: "User retrieved successfully",
        data: users,
    });
}));
const suspendUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.suspendUser(req);
    res.status(200).json({
        status: 200,
        success: true,
        message: "User suspended successfully",
        data: user,
    });
}));
exports.userController = {
    register,
    getAllUsers,
    suspendUser,
    getMe,
};
