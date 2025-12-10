import moment from "moment";

interface IOrder {
  id: string;
  createdAt: Date;
  currency: string;
  company: {
    name: string;
    email: string;
    phone: string;
    address: string;
    website: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: {
    sku: string;
    name: string;
    qty: number;
    unitPrice: number;
  }[];
  discounts: {
    label: string;
    amount: number;
  }[];
  shipping: {
    label: string;
    amount: number;
  };
  taxRate: number;
  notes: string;
  payment: {
    method: string;
    status: string;
    transactionId: string;
  };
}

interface IColors {
  primary: string; // slate-800
  text: string; // gray-900
  subtext: string; // gray-500
  border: string; // gray-200
  light: string; // gray-50
  accent: string; // blue-600
  success: string; // green-600
}

interface ITotal {
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  tax: number;
  grandTotal: number;
}

function drawHeader(doc: PDFKit.PDFDocument, order: IOrder, COLORS: IColors) {
  const top = doc.y;

  // Branding bar
  doc
    .rect(
      doc.page.margins.left,
      top,
      doc.page.width - doc.page.margins.left - doc.page.margins.right,
      60
    )
    .fill(COLORS.light);

  doc
    .fillColor(COLORS.primary)
    .fontSize(22)
    .text(order.company.name, { continued: false, align: "left" });
  doc.moveDown(0.2);
  doc
    .fillColor(COLORS.subtext)
    .fontSize(10)
    .text(
      `${order.company.address}\n${order.company.email} | ${order.company.phone}\n${order.company.website}`
    );

  // Title and status badge
  doc.moveUp(2.4);
  const rightX = doc.page.width - doc.page.margins.right;
  doc
    .fillColor(COLORS.accent)
    .fontSize(24)
    .text("Invoice", rightX - 200, top + 12, { width: 200, align: "right" });

  const statusColor =
    order.payment.status === "Paid" ? COLORS.success : COLORS.accent;
  doc
    .roundedRect(rightX - 200, top + 44, 200, 24, 6)
    .fillOpacity(0.1)
    .fill(statusColor)
    .fillOpacity(1);
  doc
    .fillColor(statusColor)
    .fontSize(11)
    .text(order.payment.status, rightX - 200, top + 48, {
      width: 200,
      align: "center",
    });

  doc.moveDown();
  doc.fillColor(COLORS.text);
  doc
    .moveTo(doc.page.margins.left, top + 70)
    .lineTo(rightX, top + 70)
    .strokeColor(COLORS.border)
    .lineWidth(1)
    .stroke();

  doc.moveDown();
}

function drawMeta(doc: PDFKit.PDFDocument, order: IOrder, COLORS: IColors) {
  doc.moveDown(0.6);
  const leftX = doc.page.margins.left;

  doc
    .fillColor(COLORS.text)
    .fontSize(12)
    .text(`Invoice #${order.id}`, leftX, doc.y, { continued: false });
  doc
    .fillColor(COLORS.subtext)
    .fontSize(10)
    .text(`Date: ${moment(order.createdAt).format("MMM D, YYYY")}`);
  if (order.payment?.transactionId) {
    doc.text(`Transaction: ${order.payment.transactionId}`);
  }

  doc.moveDown(0.6);
}

function drawCustomer(doc: PDFKit.PDFDocument, order: IOrder, COLORS: IColors) {
  const yStart = doc.y;
  const colWidth =
    (doc.page.width - doc.page.margins.left - doc.page.margins.right) / 2 - 10;

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
  doc
    .fillColor(COLORS.primary)
    .fontSize(12)
    .text("Payment details", rightX, yStart);
  doc
    .fillColor(COLORS.text)
    .fontSize(11)
    .text(`Method: ${order.payment.method}`, rightX)
    .fillColor(COLORS.subtext)
    .fontSize(10)
    .text(`Status: ${order.payment.status}`, rightX);

  doc.moveDown(0.8);
}

function drawItemsTable(
  doc: PDFKit.PDFDocument,
  order: IOrder,
  COLORS: IColors,
  fmtMoney: (v: any) => string
) {
  const tableTop = doc.y + 10;
  const leftX = doc.page.margins.left;
  const rightX = doc.page.width - doc.page.margins.right;
  const rowHeight = 26;

  const cols = [
    { label: "Item", width: 220 },
    { label: "SKU", width: 110 },
    { label: "Qty", width: 60 },
    { label: "Unit price", width: 100 },
    { label: "Line total", width: 120 },
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
    doc.fillColor(COLORS.text).fontSize(10);
    doc.text(item.name, x, y + 8, { width: cols[0].width - 20 });
    x += cols[0].width;

    doc
      .fillColor(COLORS.subtext)
      .text(item.sku, x, y + 8, { width: cols[1].width - 20 });
    x += cols[1].width;

    doc
      .fillColor(COLORS.text)
      .text(String(item.qty), x, y + 8, { width: cols[2].width - 20 });
    x += cols[2].width;

    doc.text(fmtMoney(item.unitPrice), x, y + 8, { width: cols[3].width - 20 });
    x += cols[3].width;

    const lineTotal = item.qty * item.unitPrice;
    doc.text(fmtMoney(lineTotal), x, y + 8, {
      width: cols[4].width - 20,
      align: "right",
    });

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

function drawSummary(
  doc: PDFKit.PDFDocument,
  totals: ITotal,
  order: IOrder,
  COLORS: IColors,
  fmtMoney: (v: any) => string
) {
  const { subtotal, discountTotal, shippingTotal, tax, grandTotal } = totals;

  const leftX = doc.page.margins.left;
  const rightX = doc.page.width - doc.page.margins.right;
  const summaryWidth = 280;
  const summaryX = rightX - summaryWidth;

  doc.fillColor(COLORS.primary).fontSize(12).text("Summary", summaryX, doc.y);

  const rows = [
    { label: "Subtotal", value: fmtMoney(subtotal) },
    ...(discountTotal > 0
      ? [{ label: "Discounts", value: `- ${fmtMoney(discountTotal)}` }]
      : []),
    {
      label: order.shipping?.label || "Shipping",
      value: fmtMoney(shippingTotal),
    },
    {
      label: `Tax (${(order.taxRate * 100).toFixed(1)}%)`,
      value: fmtMoney(tax),
    },
  ];

  let y = doc.y + 6;
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
  doc
    .roundedRect(summaryX, y + 6, summaryWidth, 34, 6)
    .strokeColor(COLORS.border)
    .lineWidth(1)
    .stroke();
  doc
    .fillColor(COLORS.primary)
    .fontSize(12)
    .text("Total", summaryX + 10, y + 15);
  doc
    .fillColor(COLORS.accent)
    .fontSize(14)
    .text(fmtMoney(grandTotal), summaryX + summaryWidth / 2, y + 12, {
      width: summaryWidth / 2,
      align: "right",
    });

  // Optional: QR code placeholder (e.g., to order page)
  doc
    .fillColor(COLORS.subtext)
    .fontSize(9)
    .text("Scan to view order", leftX, y + 8);
  // If you render an actual QR, draw it at leftX, y+24 (using an image from a pre-generated QR).

  doc.moveDown(1.2);
}

function drawNotes(doc: PDFKit.PDFDocument, order: IOrder, COLORS: IColors) {
  doc.fillColor(COLORS.primary).fontSize(12).text("Notes");
  doc
    .fillColor(COLORS.subtext)
    .fontSize(10)
    .text(order.notes || "—");
  doc.moveDown(0.8);
}

function drawFooter(doc: PDFKit.PDFDocument, order: IOrder, COLORS: IColors) {
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
    .text(
      `© ${new Date().getFullYear()} ${
        order.company.name
      } — All rights reserved.`,
      doc.page.margins.left,
      footerY + 10
    )
    .text(
      "This invoice was generated electronically and is valid without a signature.",
      {
        align: "right",
        width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
      }
    );
}

export const invoiceServices = {
  drawCustomer,
  drawFooter,
  drawHeader,
  drawItemsTable,
  drawMeta,
  drawNotes,
  drawSummary,
};
