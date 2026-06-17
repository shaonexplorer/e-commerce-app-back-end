"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductZodSchema = exports.createProductZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createProductZodSchema = zod_1.default.object({
    title: zod_1.default.string(),
    description: zod_1.default.string(),
    category: zod_1.default.string(), // For browse/search
    price: zod_1.default.string(), // Base price
    quantity: zod_1.default.string(), // Stock quantity
    sellerId: zod_1.default.string().optional(),
});
exports.updateProductZodSchema = zod_1.default.object({
    title: zod_1.default.string().optional(),
    description: zod_1.default.string().optional(),
    category: zod_1.default.string().optional(), // For browse/search
    price: zod_1.default.number().optional(), // Base price
    quantity: zod_1.default.number().optional(), // Stock quantity
    sellerId: zod_1.default.string().optional(),
    existingImages: zod_1.default.array(zod_1.default.string()).optional(),
});
