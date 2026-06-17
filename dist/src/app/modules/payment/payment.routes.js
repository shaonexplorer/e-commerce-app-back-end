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
exports.paymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const router = express_1.default.Router();
const secret_key = process.env.STRIPE_SECRET;
const stripe = require("stripe")(secret_key);
const client_url = process.env.CLIENT_URL;
router.post("/create-checkout-session", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItems = req.body.cartItems;
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
    try {
        const session = yield stripe.checkout.sessions.create({
            line_items: [...lineItems],
            mode: "payment",
            success_url: `${client_url}?success=true`,
        });
        //   res.redirect(303, session.url);
        res.status(200).json({ success: true, data: session });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
exports.paymentRoutes = router;
