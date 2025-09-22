const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const Order = require("../models/Order.js");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// create order endpoint
router.post("/create-order", async (req, res) => {
  try {
    const { amount, customer, products } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    // 1) Save order in DB with pending status
    const newOrder = await Order.create({
      customer,
      products,
      totalAmount: amount,
      paymentStatus: "pending",
    });

    // 2) Create Razorpay order (amount in paise)
    const options = {
      amount: Math.round(amount * 100), // rupees -> paise
      currency: "INR",
      receipt: `rcpt_${newOrder._id}`,
      notes: {
        orderId: newOrder._id.toString()
      }
    };

    const razorOrder = await razorpay.orders.create(options);

    // 3) save razorpay order id to DB
    newOrder.razorpayOrderId = razorOrder.id;
    await newOrder.save();

    res.json({
      ok: true,
      order: newOrder,
      razorOrder,
      keyId: process.env.RAZORPAY_KEY_ID, // frontend needs public key
    });
  } catch (err) {
    console.error("create-order error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// verify payment endpoint
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Validate signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // mark order as paid
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          paymentStatus: "paid",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        { new: true }
      );

      return res.json({ ok: true, order });
    } else {
      return res.status(400).json({ ok: false, error: "Invalid signature" });
    }
  } catch (err) {
    console.error("verify-payment error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🔔 Razorpay webhook endpoint
router.post(
  "/razorpay-webhook",
  express.raw({ type: "application/json" }), // raw body required
  (req, res) => {
    try {
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET; // set in Razorpay dashboard & .env
      const signature = req.headers["x-razorpay-signature"];
      const body = req.body; // raw buffer

      const expected = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");

      if (expected === signature) {
        const payload = JSON.parse(body.toString());

        console.log("Webhook verified:", payload.event);

        // Example: update DB if payment was captured
        if (payload.event === "payment.captured") {
          // TODO: update order in MongoDB as paid
        }

        res.json({ ok: true });
      } else {
        res.status(400).json({ ok: false, error: "Invalid webhook signature" });
      }
    } catch (err) {
      console.error("Webhook error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
