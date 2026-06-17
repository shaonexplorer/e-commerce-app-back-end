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
exports.orderService = void 0;
const prisma_1 = require("../../config/prisma");
require("dotenv/config");
const secret_key = process.env.STRIPE_SECRET;
const client_url = process.env.CLIENT_URL;
const stripe = require("stripe")(secret_key);
const createOrder = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const items = req.body.items;
    if (items.length === 0) {
        throw new Error("Order must contain at least one item.");
    }
    let totalAmount = 0;
    const result = yield prisma_1.prisma.$transaction((tnx) => __awaiter(void 0, void 0, void 0, function* () {
        for (const item of items) {
            const product = yield prisma_1.prisma.product.findUnique({
                where: { id: item.id },
            });
            if (!product) {
                throw new Error(`Product with ID ${item.id} not found.`);
            }
            if (product.quantity < item.quantity) {
                throw new Error(`Insufficient stock of product: ${product.title}.`);
            }
            totalAmount += product.price * item.quantity;
            //   product.quantity -= item.quantity;
            yield tnx.product.update({
                where: { id: item.id },
                data: { quantity: { decrement: item.quantity } },
            });
        }
        const order = yield tnx.order.create({
            data: { buyerId: userId, totalAmount },
        });
        const data = yield Promise.all(items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield tnx.product.findUnique({
                where: { id: item.id },
            });
            return {
                orderId: order.id,
                productId: item.id,
                quantity: item.quantity,
                sellerId: product.sellerId,
                price: product.price,
            };
        })));
        yield tnx.orderItem.createMany({ data });
        // payment init
        const cartItems = req.body.items;
        const lineItems = cartItems.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    unit_amount: Math.round(item.unitPrice * 100), // Price in cents (e.g., $20.00)
                    product_data: {
                        name: item.name,
                        // description: "A comprehensive guide to Node.js.",
                        images: [item.image],
                    },
                },
                quantity: item.quantity,
            };
        });
        const session = yield stripe.checkout.sessions.create({
            line_items: [...lineItems],
            mode: "payment",
            success_url: `${client_url}/payment?success=true&orderId=${order.id}`,
        });
        return [order, session];
    }));
    return result;
});
const updateOrderStatus = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { status } = req.body;
    const updatedOrder = yield prisma_1.prisma.order.update({
        where: { id: orderId },
        data: {
            status,
            orderItems: { updateMany: { where: {}, data: { status } } },
        },
    });
    return updatedOrder;
});
const getOrders = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const orderItems = yield prisma_1.prisma.orderItem.findMany({
        where: { sellerId: userId },
        include: { Product: true, order: true },
    });
    return orderItems;
});
const getAllOrders = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma_1.prisma.order.findMany({ include: { buyer: true } });
    return orders;
});
const getOrderIems = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.orderId;
    const orderItems = yield prisma_1.prisma.orderItem.findMany({
        where: { orderId },
        include: { Product: true, order: true },
    });
    return orderItems;
});
const getSingleOrder = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.orderId;
    const order = yield prisma_1.prisma.order.findFirstOrThrow({
        where: { id: orderId },
        include: { buyer: true },
    });
    return order;
});
exports.orderService = {
    createOrder,
    updateOrderStatus,
    getAllOrders,
    getOrderIems,
    getSingleOrder,
    getOrders,
};
