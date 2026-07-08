import stripePackage from "stripe";
import handleAsyncError from "../middleware/handleAsyncError.js";

// PROCESS STRIPE PAYMENTS
// POST /api/v1/payment/process
export const processPayment = handleAsyncError(async (req, res, next) => {
  const stripe = stripePackage(process.env.STRIPE_API_KEY);

  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount, // amount in cents
    currency: "usd",
    metadata: {
      company: "E-Commerce",
    },
  });

  res.status(200).json({
    success: true,
    client_secret: myPayment.client_secret,
  });
});

// SEND STRIPE PUBLISHABLE KEY
// GET /api/v1/stripeapikey
export const sendStripeApiKey = handleAsyncError(async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});
