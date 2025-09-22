const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  qty: Number,
  price: Number,
});

const OrderSchema = new mongoose.Schema({
  customer: {
    name: String,
    phone: String,
    address: String,
  },
  products: [ProductSchema],
  totalAmount: Number, // rupees
  paymentStatus: { type: String, default: "pending" }, // pending | paid | failed
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
