import { Request } from "express";
import { prisma } from "../../config/prisma";
import "dotenv/config";
import { ICartItem } from "../payment/payment.routes";

const secret_key = process.env.STRIPE_SECRET;
const client_url = process.env.CLIENT_URL;
const stripe = require("stripe")(secret_key);

const createOrder = async (
  req: Request & { user?: { userId: string; userRole: string } }
) => {
  const userId = req.user?.userId as string;

  const items = req.body.items;

  if (items.length === 0) {
    throw new Error("Order must contain at least one item.");
  }

  let totalAmount = 0;

  const result = await prisma.$transaction(async (tnx) => {
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });
      if (!product) {
        throw new Error(`Product with ID ${item.id} not found.`);
      }
      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ID ${item.id}.`);
      }
      totalAmount += product.price * item.quantity;
      //   product.quantity -= item.quantity;
      await tnx.product.update({
        where: { id: item.id },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    const order = await tnx.order.create({
      data: { buyerId: userId, totalAmount },
    });

    const data = await Promise.all(
      items.map(async (item: { id: string; quantity: number }) => {
        const product = await tnx.product.findUnique({
          where: { id: item.id },
        });
        return {
          orderId: order.id,
          productId: item.id,
          quantity: item.quantity,
          sellerId: (product as any).sellerId,
          price: (product as any).price,
        };
      })
    );

    await tnx.orderItem.createMany({ data });

    // payment init
    const cartItems = req.body.items;
    const lineItems = cartItems.map((item: ICartItem) => {
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

    const session = await stripe.checkout.sessions.create({
      line_items: [...lineItems],
      mode: "payment",
      success_url: `${client_url}/payment?success=true&orderId=${order.buyerId}`,
    });

    return [order, session];
  });

  return result;
};

const updateOrderStatus = async (req: Request) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      orderItems: { updateMany: { where: {}, data: { status } } },
    },
  });

  return updatedOrder;
};

const getAllOrders = async (req: Request & { user?: any }) => {
  const userId = req.user?.userId;
  const orderItems = await prisma.orderItem.findMany({
    where: { sellerId: userId },
    include: { Product: true, order: true },
  });
  return orderItems;
};

const getOrderIems = async (req: Request) => {
  const orderId = req.params.orderId;
  const orderItems = await prisma.orderItem.findMany({
    where: { orderId },
    include: { Product: true },
  });
  return orderItems;
};

export const orderService = {
  createOrder,
  updateOrderStatus,
  getAllOrders,
  getOrderIems,
};
