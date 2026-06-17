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
exports.invoiceController = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const invoice_service_1 = require("./invoice.service");
const createInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { orderId } = req.params;
        // Mock order; replace with DB lookup
        const order = {
            id: orderId,
            createdAt: new Date(),
            currency: "USD",
            company: {
                name: "Shoppers Point",
                email: "shaonexplorer@gmail.com",
                phone: "+880 1680051016",
                address: "6/12 Block-G/1, Mirpur-2, Dhaka-1216",
                website: "https://shopperspoint.com",
            },
            customer: {
                name: "Abir Hossain",
                email: "shaonexplorer@gmail.com",
                phone: "+880 1680051016",
                address: "Road 10, Dhanmondi, Dhaka 1209, Bangladesh",
            },
            items: [
            // {
            //   sku: "SKU-001",
            //   name: "Wireless Headphones",
            //   qty: 1,
            //   unitPrice: 89.99,
            // },
            ],
            discounts: [{ label: "Holiday Discount", amount: 10 }],
            shipping: { label: "Standard Shipping", amount: 5.99 },
            taxRate: 0.075, // 7.5%
            notes: "Thank you for your purchase! Returns accepted within 30 days if unused.",
            payment: {
                method: "Card",
                status: "Paid",
                transactionId: "txn_4f9c2a",
            },
        };
        const { orderItems, buyer } = yield invoice_service_1.invoiceServices.getOrderItems(orderId);
        order.customer.email = buyer.email;
        order.customer.name = buyer.name;
        orderItems.forEach((item) => {
            order.items.push({
                id: item.productId,
                name: item.Product.title,
                qty: item.quantity,
                unitPrice: item.price,
            });
        });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="invoice-${order.id}.pdf"`);
        const doc = new pdfkit_1.default({
            size: "A4",
            margin: 40,
            info: {
                Title: `Invoice ${order.id}`,
                Author: order.company.name,
                Subject: "Invoice",
            },
        });
        doc.pipe(res);
        // Theme tokens
        const COLORS = {
            primary: "#1f2937", // slate-800
            text: "#111827", // gray-900
            subtext: "#6b7280", // gray-500
            border: "#e5e7eb", // gray-200
            light: "#f9fafb", // gray-50
            accent: "#2563eb", // blue-600
            success: "#16a34a", // green-600
        };
        const CURRENCY = order.currency;
        // Helpers
        const fmtMoney = (v) => new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: CURRENCY,
        }).format(v);
        const sumItems = (items) => items.reduce((acc, it) => acc + it.qty * it.unitPrice, 0);
        const subtotal = sumItems(order.items);
        const discountTotal = (order.discounts || []).reduce((a, d) => a + d.amount, 0);
        const shippingTotal = ((_a = order.shipping) === null || _a === void 0 ? void 0 : _a.amount) || 0;
        const tax = (subtotal - discountTotal) * order.taxRate;
        const grandTotal = Math.max(0, subtotal - discountTotal + shippingTotal + tax);
        // Register fonts (optional: use your own font files)
        // doc.registerFont('Inter', 'public/fonts/Inter-Regular.ttf');
        // doc.registerFont('Inter-Bold', 'public/fonts/Inter-Bold.ttf');
        // Header
        invoice_service_1.invoiceServices.drawHeader(doc, order, COLORS);
        // Meta
        invoice_service_1.invoiceServices.drawMeta(doc, order, COLORS);
        // Customer
        invoice_service_1.invoiceServices.drawCustomer(doc, order, COLORS);
        // Items Table
        invoice_service_1.invoiceServices.drawItemsTable(doc, order, COLORS, fmtMoney);
        // Summary
        invoice_service_1.invoiceServices.drawSummary(doc, { subtotal, discountTotal, shippingTotal, tax, grandTotal }, order, COLORS, fmtMoney);
        // Notes & Footer
        invoice_service_1.invoiceServices.drawNotes(doc, order, COLORS);
        invoice_service_1.invoiceServices.drawFooter(doc, order, COLORS);
        doc.end();
    }
    catch (error) {
        console.log(error);
    }
});
exports.invoiceController = { createInvoice };
