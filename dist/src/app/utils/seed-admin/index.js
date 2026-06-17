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
exports.seedAdmin = void 0;
require("dotenv/config");
const prisma_1 = require("../../config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        const salt = process.env.SALT_ROUNDS;
        const admin = yield prisma_1.prisma.user.findFirst({ where: { email } });
        if (admin) {
            return console.log("Admin user already exists");
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, Number(salt));
        yield prisma_1.prisma.user.create({
            data: { email, password: hashedPassword, role: "ADMIN", name: "admin" },
        });
        console.log("Admin user seeded successfully");
    }
    catch (error) {
        console.log(error);
    }
});
exports.seedAdmin = seedAdmin;
