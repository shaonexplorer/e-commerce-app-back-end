"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const invoice_controller_1 = require("./invoice.controller");
const router = express_1.default.Router();
router.post("/:orderId", invoice_controller_1.invoiceController.createInvoice);
exports.invoiceRoutes = router;
