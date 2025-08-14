const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/PaymentRoute");
const ordersRoute = require("./routes/ordersRoutes");
const UserRoutes = require("./routes/UserRoutes");
const { v4: uuidv4 } = require("uuid");
const { handleWebhook } = require("./controllers/paymentController");

const app = express();

// ✅ 1. Raw body for webhook FIRST
app.post("/payment/webhook", express.raw({ type: "application/json" }), handleWebhook);

// ✅ 2. Then use JSON for all other routes
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ 3. Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ✅ 4. Define Routes
app.use("/products", productRoutes);
app.use("/payment", paymentRoutes); // ⚠️ /payment/webhook already handled above
app.use("/orders", ordersRoute);
app.use("/users", UserRoutes);

// ✅ 5. Start Server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
