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
exports.userService = void 0;
const prisma_1 = require("../../config/prisma");
require("dotenv/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const getMe = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const user = yield prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            password: false,
            email: true,
            id: true,
            name: true,
            role: true,
            isBanned: true,
        },
    });
    return user;
});
const register = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = process.env.SALT_ROUNDS;
    const hasedPassword = yield bcrypt_1.default.hash(req.body.password, Number(saltRounds));
    const user = yield prisma_1.prisma.user.create({
        data: Object.assign(Object.assign({}, req.body), { password: hasedPassword }),
    });
    return user;
});
const getAllUsers = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.prisma.user.findMany();
    return users;
});
const suspendUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = yield prisma_1.prisma.user.update({
        where: { id: userId },
        data: { isBanned: true },
    });
    return user;
});
exports.userService = {
    register,
    getAllUsers,
    suspendUser,
    getMe,
};
