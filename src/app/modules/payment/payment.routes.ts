import express from "express";
import "dotenv/config";

const router = express.Router();
const stripe = require("stripe")();

const client_url = process.env.CLIENT_URL;

router.post("/create-checkout-session", async (req, res, next) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of the product you want to sell
        price: req.body.price,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${client_url}?success=true`,
  });

  res.redirect(303, session.url);
});

export const paymentRoutes = router;
