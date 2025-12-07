import express from "express";
import "dotenv/config";

const router = express.Router();
const secret_key = process.env.STRIPE_SECRET;
const stripe = require("stripe")(secret_key);

const client_url = process.env.CLIENT_URL;

export interface ICartItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

router.post("/create-checkout-session", async (req, res, next) => {
  const cartItems = req.body.cartItems;
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

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [...lineItems],
      mode: "payment",
      success_url: `${client_url}?success=true`,
    });

    //   res.redirect(303, session.url);
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export const paymentRoutes = router;
