import { NextFunction, Request, Response } from "express";

import PDFDocument from "pdfkit";
import { invoiceServices, IOrder } from "./invoice.service";

const createInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;

    // Mock order; replace with DB lookup
    const order: IOrder = {
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
      notes:
        "Thank you for your purchase! Returns accepted within 30 days if unused.",
      payment: {
        method: "Card",
        status: "Paid",
        transactionId: "txn_4f9c2a",
      },
    };

    const { orderItems, buyer } = await invoiceServices.getOrderItems(orderId);

    order.customer.email = buyer.email;
    order.customer.name = buyer.name as string;

    orderItems.forEach((item) => {
      order.items.push({
        id: item.productId,
        name: item.Product.title,
        qty: item.quantity,
        unitPrice: item.price as number,
      });
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="invoice-${order.id}.pdf"`
    );

    const doc = new PDFDocument({
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
    const fmtMoney = (v: number) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: CURRENCY,
      }).format(v);

    const sumItems = (
      items: {
        id: string;
        name: string;
        qty: number;
        unitPrice: number;
      }[]
    ) => items.reduce((acc, it) => acc + it.qty * it.unitPrice, 0);

    const subtotal = sumItems(order.items);
    const discountTotal = (order.discounts || []).reduce(
      (a, d) => a + d.amount,
      0
    );
    const shippingTotal = order.shipping?.amount || 0;
    const tax = (subtotal - discountTotal) * order.taxRate;
    const grandTotal = Math.max(
      0,
      subtotal - discountTotal + shippingTotal + tax
    );

    // Register fonts (optional: use your own font files)
    // doc.registerFont('Inter', 'public/fonts/Inter-Regular.ttf');
    // doc.registerFont('Inter-Bold', 'public/fonts/Inter-Bold.ttf');

    // Header
    invoiceServices.drawHeader(doc, order, COLORS);

    // Meta
    invoiceServices.drawMeta(doc, order, COLORS);

    // Customer
    invoiceServices.drawCustomer(doc, order, COLORS);

    // Items Table
    invoiceServices.drawItemsTable(doc, order, COLORS, fmtMoney);

    // Summary
    invoiceServices.drawSummary(
      doc,
      { subtotal, discountTotal, shippingTotal, tax, grandTotal },
      order,
      COLORS,
      fmtMoney
    );

    // Notes & Footer
    invoiceServices.drawNotes(doc, order, COLORS);
    invoiceServices.drawFooter(doc, order, COLORS);

    doc.end();
  } catch (error) {
    console.log(error);
  }
};

export const invoiceController = { createInvoice };
