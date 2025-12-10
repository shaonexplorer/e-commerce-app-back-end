import express from "express";
import { invoiceController } from "./invoice.controller";

const router = express.Router();

router.post("/:orderId", invoiceController.createInvoice);

export const invoiceRoutes = router;
