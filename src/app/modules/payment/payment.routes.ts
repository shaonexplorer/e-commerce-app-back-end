import express from "express";
import "dotenv/config";

const router = express.Router();
const secret_key = process.env.STRIPE_SECRET;
const stripe = require("stripe")(secret_key);

const client_url = process.env.CLIENT_URL;

router.post("/create-checkout-session", async (req, res, next) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: 2000, // Price in cents (e.g., $20.00)
          product_data: {
            name: "Premium E-book",
            description: "A comprehensive guide to Node.js.",
            images: ["https://example.com/image.png"],
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${client_url}?success=true`,
  });

  res.redirect(303, session.url);
});

export const paymentRoutes = router;
