require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const paymentRoutes = require("./routes/payment");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173", // your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


// 👉 Normal JSON body parser (for most APIs)
app.use(express.json());  
app.use(bodyParser.urlencoded({ extended: true }));

// 👉 IMPORTANT: Webhook route (must come BEFORE express.json for raw body)
app.use("/api/payment", paymentRoutes);

// DB connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
