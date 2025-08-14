const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../models/Order");
require("dotenv").config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const OrderController = {
  // ✅ Create new order (COD or Razorpay)
  createOrder: async (req, res) => {
    try {
      const {
        userId,
        amount,
        mode,
        cartItems,
        addressData,
        razorpayOrder,
      } = req.body;

      if (!cartItems?.length || !addressData || !userId || !mode) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const orderNumber = `ORD-${uuidv4()}`;

      const payload = {
        userId,
        amount,
        mode,
        orderNumber,
        cartItems,
        addressData,
        status: mode === "cod" ? "pending" : "paid", // ✅ COD orders start as pending
        razorpayOrder: mode !== "cod" ? razorpayOrder : undefined,
        payment:
          mode === "cod"
            ? {
              razorpayPaymentStatus: "cod",
              paidAt: new Date(),
            }
            : undefined,
      };

      const newOrder = new Order(payload);
      const savedOrder = await newOrder.save();

      res.status(201).json({
        message: "Order created successfully",
        order: savedOrder,
      });
    } catch (error) {
      console.error("Order creation error:", error);
      res
        .status(500)
        .json({ message: "Failed to create order", error: error.message });
    }
  },

  // ✅ Get all orders (for admin)
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      res.status(200).json({ orders });
    } catch (error) {
      console.error("Get all orders error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  },
trackOrder: async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Tracking orders for user:", userId);
    const currentOrders = await Order.find({ userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(5); // Limit to 5 orders

    // console.log("Current Orders:", currentOrders);

    if (!currentOrders || currentOrders.length === 0) {
      return res.status(404).json({ message: "No current orders found" });
    }

    res.status(200).json({ orders: currentOrders });
  } catch (error) {
    console.error("Track order error:", error);
    res.status(500).json({ message: "Failed to track current orders" });
  }
}

  ,

  // ✅ Get orders by user ID
  getUserOrders: async (req, res) => {
    try {
      const { userId } = req.params;
      const orders = await Order.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json({ orders });
    } catch (error) {
      console.error("Get user orders error:", error);
      res.status(500).json({ message: "Failed to fetch user orders" });
    }
  },

  // ✅ Verify Razorpay payment
  verifySignature: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      const order = await Order.findOne({
        orderNumber: orderId,
        "razorpayOrder.razorpayOrderId": razorpay_order_id,
      });

      if (!order) return res.status(404).json({ error: "Order not found" });

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ error: "Invalid signature" });
      }

      order.payment = {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        razorpayPaymentStatus: "captured",
        webhookVerified: false,
        method: "razorpay",
        paidAt: new Date(),
      };

      order.status = "paid";
      await order.save();

      res.status(200).json({ message: "Payment verified", order });
    } catch (error) {
      console.error("Verify signature error:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  },

  // ✅ Update order status (admin panel action)
  updateOrderStatus: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await Order.findOneAndUpdate(
        { orderNumber: orderId },
        { status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
      console.error("Update status error:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  },

  // ✅ Delete order
  deleteOrder: async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findOneAndDelete({ orderNumber: orderId });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order deleted", order });
    } catch (error) {
      console.error("Delete order error:", error);
      res.status(500).json({ message: "Failed to delete order" });
    }
  },
};

module.exports = OrderController;
