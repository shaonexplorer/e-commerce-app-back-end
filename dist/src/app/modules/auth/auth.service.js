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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = require("../../config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const login = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const jwt_secret = process.env.JWT_SECRET;
    const user = yield prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, userRole: user.role }, jwt_secret, { expiresIn: "1d" });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id, userRole: user.role }, jwt_secret, { expiresIn: "30d" });
    return { accessToken, refreshToken };
});
exports.AuthService = {
    login,
};
