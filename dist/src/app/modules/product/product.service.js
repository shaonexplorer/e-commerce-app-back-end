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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const prisma_1 = require("../../config/prisma");
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const getPublicProducts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, category, price, orderBy } = req.query;
    const whereCondition = {};
    if (searchTerm) {
        whereCondition.title = {
            contains: searchTerm,
            mode: "insensitive",
        };
    }
    if (category) {
        whereCondition.category = {
            equals: category,
        };
    }
    if (price) {
        whereCondition.price = {
            lte: Number(price),
        };
    }
    let order = { createdAt: "desc" };
    if (orderBy == "priceHigh") {
        order = { price: "desc" };
    }
    else if (orderBy == "priceLow") {
        order = { price: "asc" };
    }
    else if (orderBy == "recent") {
        order = { createdAt: "desc" };
    }
    const products = yield prisma_1.prisma.product.findMany({
        where: whereCondition,
        orderBy: order,
    });
    return products;
});
const getAllProducts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.userId;
    const products = yield prisma_1.prisma.product.findMany({
        where: { sellerId: id },
        orderBy: { createdAt: "desc" },
    });
    return products;
});
const getProductById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const product = yield prisma_1.prisma.product.findUniqueOrThrow({
        where: { id },
    });
    return product;
});
const createProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const images = req.files;
    const buffers = images === null || images === void 0 ? void 0 : images.map((file) => file.buffer);
    const uploadToCloudinary = (buffer) => {
        return new Promise((resolve, reject) => {
            cloudinary_1.default.uploader
                .upload_stream((error, uploadResult) => {
                if (error) {
                    return reject(error);
                }
                return resolve(uploadResult);
            })
                .end(buffer);
        });
    };
    const uploadResult = buffers === null || buffers === void 0 ? void 0 : buffers.map((buffer) => uploadToCloudinary(buffer));
    const result = yield Promise.all(uploadResult);
    console.log({ result });
    let imageUrls = [];
    if (result.length) {
        imageUrls = result.map((img) => img.secure_url);
    }
    const product = yield prisma_1.prisma.product.create({
        data: Object.assign(Object.assign({}, req.body), { price: parseFloat(req.body.price), quantity: parseInt(req.body.quantity), images: imageUrls, sellerId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId }),
    });
    return product;
});
const deleteProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const product = yield prisma_1.prisma.product.delete({
        where: { id: id },
    });
    return product;
});
const editProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const images = req.files;
    // const uploads = images?.map((file) => {
    //   return cloudinary.uploader.upload(file.path);
    // });
    // const cloudinaryImages = await Promise.all(uploads || []);
    const buffers = images === null || images === void 0 ? void 0 : images.map((file) => file.buffer);
    const uploadToCloudinary = (buffer) => {
        return new Promise((resolve, reject) => {
            cloudinary_1.default.uploader
                .upload_stream((error, uploadResult) => {
                if (error) {
                    return reject(error);
                }
                return resolve(uploadResult);
            })
                .end(buffer);
        });
    };
    const uploadResult = buffers === null || buffers === void 0 ? void 0 : buffers.map((buffer) => uploadToCloudinary(buffer));
    const result = yield Promise.all(uploadResult);
    console.log({ result });
    let imageUrls = [];
    // if (cloudinaryImages.length) {
    //   imageUrls = cloudinaryImages.map((img) => img.secure_url);
    // }
    if (result.length) {
        imageUrls = result.map((img) => img.secure_url);
    }
    // const local = images?.forEach((file) => {
    //   fs.unlinkSync(file.path);
    // });
    // await Promise.all(local || []);
    if (req.body.existingImages) {
        imageUrls = [...req.body.existingImages, ...imageUrls];
    }
    const _a = req.body, { existingImages } = _a, payload = __rest(_a, ["existingImages"]);
    const product = yield prisma_1.prisma.product.update({
        where: { id: id },
        data: Object.assign(Object.assign({}, payload), (imageUrls.length > 0 && { images: imageUrls })),
    });
    return product;
});
exports.productService = {
    createProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
    editProduct,
    getPublicProducts,
};
