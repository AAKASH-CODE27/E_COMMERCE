import express from "express";
import { processPayment, sendStripeApiKey } from "../controller/paymentController.js";
import { verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.route("/payment/process").post(verifyUserAuth, processPayment);
router.route("/stripeapikey").get(verifyUserAuth, sendStripeApiKey);

export default router;
