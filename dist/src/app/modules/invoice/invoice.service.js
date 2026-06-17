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
exports.invoiceServices = void 0;
const moment_1 = __importDefault(require("moment"));
const prisma_1 = require("../../config/prisma");
function drawHeader(doc, order, COLORS) {
    const top = doc.y - 10;
    // Branding bar
    // doc
    //   .rect(
    //     doc.page.margins.left,
    //     top,
    //     doc.page.width - doc.page.margins.left - doc.page.margins.right,
    //     80
    //   )
    //   .fill(COLORS.light);
    doc
        .fillColor(COLORS.primary)
        .fontSize(22)
        .text(order.company.name, { continued: false, align: "left" });
    doc.moveDown(0.2);
    doc
        .fillColor(COLORS.subtext)
        .fontSize(10)
        .text(`${order.company.address}\n${order.company.email} | ${order.company.phone}\n${order.company.website}`);
    // Title and status badge
    doc.moveUp(2.4);
    const rightX = doc.page.width - doc.page.margins.right;
    doc
        .fillColor(COLORS.accent)
        .fontSize(24)
        .text("Invoice", rightX - 200, top + 12, { width: 200, align: "right" });
    const statusColor = order.payment.status === "Paid" ? COLORS.success : COLORS.accent;
    doc
        .roundedRect(rightX - 200, top + 44, 200, 24, 6)
        .fillOpacity(0.1)
        .fill(statusColor)
        .fillOpacity(1);
    doc
        .fillColor(statusColor)
        .fontSize(11)
        .text(order.payment.status, rightX - 200, top + 52, {
        width: 200,
        align: "center",
    });
    doc.moveDown();
    doc.fillColor(COLORS.text);
    doc
        .moveTo(doc.page.margins.left, top + 80)
        .lineTo(rightX, top + 80)
        .strokeColor(COLORS.border)
        .lineWidth(1)
        .stroke();
    doc.moveDown();
}
function drawMeta(doc, order, COLORS) {
    var _a;
    doc.moveDown(0.6);
    const leftX = doc.page.margins.left;
    doc
        .fillColor(COLORS.text)
        .fontSize(12)
        .text(`Invoice #${order.id}`, leftX, doc.y, { continued: false });
    doc
        .fillColor(COLORS.subtext)
        .fontSize(10)
        .text(`Date: ${(0, moment_1.default)(order.createdAt).format("MMM D, YYYY")}`);
    if ((_a = order.payment) === null || _a === void 0 ? void 0 : _a.transactionId) {
        doc.text(`Transaction: ${order.payment.transactionId}`);
    }
    doc.moveDown(0.6);
}
function drawCustomer(doc, order, COLORS) {
    const yStart = doc.y + 20;
    const colWidth = (doc.page.width - doc.page.margins.left - doc.page.margins.right) / 2 - 10;
    // Bill to
    doc
        .fillColor(COLORS.primary)
        .fontSize(12)
        .text("Bill to", doc.page.margins.left, yStart);
    doc
        .fillColor(COLORS.text)
        .fontSize(11)
        .text(order.customer.name)
        .fillColor(COLORS.subtext)
        .fontSize(10)
        .text(order.customer.email)
        .text(order.customer.phone)
        .text(order.customer.address, { width: colWidth });
    // Payment method
    const rightX = doc.page.margins.left + colWidth + 20;
    // doc
    //   .fillColor(COLORS.primary)
    //   .fontSize(12)
    //   .text("Payment details", rightX, yStart, { align: "right" });
    // doc
    //   .fillColor(COLORS.text)
    //   .fontSize(11)
    //   .text(`Method: ${order.payment.method}`, {
    //     align: "right",
    //   })
    //   .fillColor(COLORS.subtext)
    //   .fontSize(10)
    //   .text(`Status: ${order.payment.status}`, {
    //     align: "right",
    //   });
    doc.moveDown(0.8);
}
function drawItemsTable(doc, order, COLORS, fmtMoney) {
    const tableTop = doc.y + 10;
    const leftX = doc.page.margins.left;
    const rightX = doc.page.width - doc.page.margins.right;
    const rowHeight = 26;
    const cols = [
        { label: "Id", width: 230 },
        { label: "Item", width: 180 },
        { label: "Qty", width: 40 },
        { label: "Unit price", width: 70 },
        // { label: "Line total", width: 120 },
    ];
    // Header
    doc.rect(leftX, tableTop, rightX - leftX, rowHeight).fill(COLORS.light);
    doc.fillColor(COLORS.primary).fontSize(11);
    let x = leftX + 10;
    cols.forEach((c) => {
        doc.text(c.label, x, tableTop + 8, { width: c.width - 20 });
        x += c.width;
    });
    // Rows
    let y = tableTop + rowHeight;
    order.items.forEach((item, i) => {
        const stripe = i % 2 === 0;
        if (stripe) {
            doc
                .rect(leftX, y, rightX - leftX, rowHeight)
                .fillOpacity(0.04)
                .fill(COLORS.accent)
                .fillOpacity(1);
        }
        x = leftX + 10;
        doc
            .fillColor(COLORS.subtext)
            .text(item.id, x, y + 8, { width: cols[0].width - 20 });
        x += cols[0].width;
        doc.fillColor(COLORS.text).fontSize(10);
        doc.text(item.name, x, y + 8, { width: cols[1].width - 20 });
        x += cols[1].width;
        doc
            .fillColor(COLORS.text)
            .text(String(item.qty), x, y + 8, { width: cols[2].width - 20 });
        x += cols[2].width;
        doc.text(fmtMoney(item.unitPrice), x, y + 8, { width: cols[3].width - 20 });
        x += cols[3].width;
        // const lineTotal = item.qty * item.unitPrice;
        // doc.text(fmtMoney(lineTotal), x, y + 8, {
        //   width: cols[4].width - 20,
        //   align: "right",
        // });
        y += rowHeight;
    });
    // Border line
    doc
        .moveTo(leftX, y)
        .lineTo(rightX, y)
        .strokeColor(COLORS.border)
        .lineWidth(1)
        .stroke();
    doc.moveDown(1);
}
function drawSummary(doc, totals, order, COLORS, fmtMoney) {
    var _a;
    const { subtotal, discountTotal, shippingTotal, tax, grandTotal } = totals;
    const leftX = doc.page.margins.left;
    const rightX = doc.page.width - doc.page.margins.right;
    const summaryWidth = 300;
    const summaryX = rightX - summaryWidth;
    doc
        .fillColor(COLORS.primary)
        .fontSize(12)
        .text("Summary", summaryX, doc.y + 10);
    const rows = [
        { label: "Subtotal", value: fmtMoney(subtotal) },
        ...(discountTotal > 0
            ? [{ label: "Discounts", value: `- ${fmtMoney(discountTotal)}` }]
            : []),
        {
            label: ((_a = order.shipping) === null || _a === void 0 ? void 0 : _a.label) || "Shipping",
            value: fmtMoney(shippingTotal),
        },
        {
            label: `Tax (${(order.taxRate * 100).toFixed(1)}%)`,
            value: fmtMoney(tax),
        },
    ];
    let y = doc.y + 10;
    rows.forEach((r) => {
        doc
            .fillColor(COLORS.subtext)
            .fontSize(10)
            .text(r.label, summaryX, y, { width: summaryWidth / 2 });
        doc
            .fillColor(COLORS.text)
            .fontSize(10)
            .text(r.value, summaryX + summaryWidth / 2, y, {
            width: summaryWidth / 2,
            align: "right",
        });
        y += 18;
    });
    // Grand total box
    // doc
    //   .roundedRect(summaryX, y + 6, summaryWidth, 34, 6)
    //   .strokeColor(COLORS.border)
    //   .lineWidth(1)
    //   .stroke();
    doc
        .fillColor(COLORS.primary)
        .fontSize(12)
        .text("Total", summaryX, y + 15);
    doc
        .fillColor(COLORS.accent)
        .fontSize(14)
        .text(fmtMoney(grandTotal), summaryX + summaryWidth / 2, y + 12, {
        width: summaryWidth / 2,
        align: "right",
    });
    // Optional: QR code placeholder (e.g., to order page)
    // doc
    //   .fillColor(COLORS.subtext)
    //   .fontSize(9)
    //   .text("Scan to view order", leftX, y + 8);
    // If you render an actual QR, draw it at leftX, y+24 (using an image from a pre-generated QR).
    doc.moveDown(5);
}
function drawNotes(doc, order, COLORS) {
    const leftX = doc.page.margins.left;
    doc.fillColor(COLORS.primary).fontSize(12).text("Notes", leftX);
    doc
        .fillColor(COLORS.subtext)
        .fontSize(10)
        .text(order.notes || "—");
    doc.moveDown(0.8);
}
function drawFooter(doc, order, COLORS) {
    const footerY = doc.page.height - doc.page.margins.bottom - 40;
    doc
        .moveTo(doc.page.margins.left, footerY)
        .lineTo(doc.page.width - doc.page.margins.right, footerY)
        .strokeColor(COLORS.border)
        .lineWidth(1)
        .stroke();
    doc
        .fillColor(COLORS.subtext)
        .fontSize(9)
        .text(`© ${new Date().getFullYear()} ${order.company.name} — All rights reserved.`, doc.page.margins.left, footerY + 10, { continued: true })
        .text("This invoice was generated electronically and is valid without a signature.", {
        align: "right",
        width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    });
}
const getOrderItems = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderItems, buyer } = yield prisma_1.prisma.order.findFirstOrThrow({
        where: { id },
        include: { orderItems: { include: { Product: true } }, buyer: true },
    });
    return { orderItems, buyer };
});
exports.invoiceServices = {
    drawCustomer,
    drawFooter,
    drawHeader,
    drawItemsTable,
    drawMeta,
    drawNotes,
    drawSummary,
    getOrderItems,
};
