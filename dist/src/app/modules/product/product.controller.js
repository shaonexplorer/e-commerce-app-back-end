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
exports.productController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const product_service_1 = require("./product.service");
const getPublicProducts = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_service_1.productService.getPublicProducts(req);
    res.status(200).json({
        status: 200,
        success: true,
        message: "Product retrieved successfully",
        data: products,
    });
}));
const getAllProducts = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_service_1.productService.getAllProducts(req);
    res.status(200).json({
        status: 200,
        success: true,
        message: "Product retrieved successfully",
        data: products,
    });
}));
const getProductById = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_service_1.productService.getProductById(req);
    res.status(200).json({
        status: 200,
        success: true,
        message: "Product retrieved successfully",
        data: product,
    });
}));
const createProduct = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_service_1.productService.createProduct(req);
    res.status(201).json({
        status: 201,
        success: true,
        message: "Product created successfully",
        data: product,
    });
}));
const editProduct = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_service_1.productService.editProduct(req);
    res.status(201).json({
        status: 201,
        success: true,
        message: "Product edited successfully",
        data: product,
    });
}));
const deleteProduct = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_service_1.productService.deleteProduct(req);
    res.status(200).json({
        status: 200,
        success: true,
        message: "Product deleted successfully",
        data: product,
    });
}));
exports.productController = {
    createProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
    editProduct,
    getPublicProducts,
};
