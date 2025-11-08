import { Request } from "express";
import { prisma } from "../../config/prisma";

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
        where: { id: item.productId },
      });
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found.`);
      }
      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product ID ${item.productId}.`);
      }
      totalAmount += product.price * item.quantity;
      //   product.quantity -= item.quantity;
      await tnx.product.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    const order = await tnx.order.create({
      data: { buyerId: userId, totalAmount },
    });

    const data = await Promise.all(
      items.map(async (item: { productId: string; quantity: number }) => {
        const product = await tnx.product.findUnique({
          where: { id: item.productId },
        });
        return {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          sellerId: (product as any).sellerId,
          price: (product as any).price,
        };
      })
    );

    await tnx.orderItem.createMany({ data });

    return order;
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

export const orderService = {
  createOrder,
  updateOrderStatus,
  getAllOrders,
};
