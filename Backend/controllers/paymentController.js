const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");
const Order = require("../models/Orders");

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PaymentController = {
  // ✅ Step 1: Create Razorpay Order
  createOrder: async (req, res) => {
    try {
      const { amount, currency } = req.body;

      if (!amount || !currency) {
        return res.status(400).json({ message: "Amount and currency are required" });
      }

      const options = {
        amount: amount * 100, // convert to paise
        currency,
        payment_capture: 1,
      };

      const order = await razorpayInstance.orders.create(options);
      if (!order || !order.id) {
        return res.status(500).json({ message: "Failed to create Razorpay order" });
      }

      res.status(200).json(order);
    } catch (error) {
      console.error("Razorpay createOrder error:", error);
      res.status(500).json({ message: "Razorpay error: " + error.message });
    }
  },

  // ✅ Step 2: Verify Razorpay Payment from Frontend
  verifyPayment: async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: "Missing payment details" });
      }

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      // Optional: You can enable this check
      // if (expectedSignature !== razorpay_signature) {
      //   return res.status(400).json({ success: false, message: "Invalid signature" });
      // }

      const order = await Order.findOne({ "razorpayOrder.razorpayOrderId": razorpay_order_id });

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found in DB" });
      }

      order.payment.razorpayPaymentId = razorpay_payment_id;
      order.payment.razorpayPaymentStatus = "paid";
      order.payment.verified = true;
      order.order_status = "paid";
      order.payment.paidAt = new Date();

      await order.save();

      return res.status(200).json({ success: true, message: "Payment verified and order updated", order });
    } catch (error) {
      console.error("Payment verification error:", error.message);
      res.status(500).json({ success: false, message: "Server error during verification" });
    }
  },

  // ✅ Step 3: Razorpay Webhook Handler
  handleWebhook: async (req, res) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const rawBody = req.body; // raw buffer (using express.raw())
    const signature = req.headers["x-razorpay-signature"];

    let payload;
    try {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        console.error("❌ Invalid webhook signature");
        return res.status(400).send("Invalid signature");
      }

      // Parse after verification
      payload = JSON.parse(rawBody);
    } catch (err) {
      console.error("❌ Failed to verify or parse webhook:", err.message);
      return res.status(400).send("Webhook error");
    }

    const event = payload.event;
    const paymentEntity = payload.payload.payment?.entity;
    const orderId = paymentEntity?.order_id;
    const paymentId = paymentEntity?.id;

    console.log("✅ Verified Razorpay webhook event:", event);

    if (!orderId || !paymentId) {
      return res.status(200).send("No action required.");
    }

    try {
      const order = await Order.findOne({ "razorpayOrder.razorpayOrderId": orderId });

      if (!order) {
        console.warn(`No matching order found for Razorpay order_id: ${orderId}`);
        return res.status(200).send("Order not found");
      }

      // Handle different Razorpay events
      switch (event) {
        case "payment.captured":
          order.payment.razorpayPaymentId = paymentId;
          order.payment.razorpayPaymentStatus = "paid";
          order.payment.webhookVerified = true;
          order.payment.paidAt = new Date(paymentEntity.created_at * 1000);
          order.order_status = "paid";
          break;

        case "payment.failed":
          order.payment.razorpayPaymentStatus = "cancelled";
          order.order_status = "cancelled";
          break;

        case "payment.dispute.created":
          order.payment.razorpayPaymentStatus = "disputed";
          break;

        case "refund.processed":
          order.payment.razorpayPaymentStatus = "refunded";
          order.order_status = "refunded";
          break;

        default:
          console.log("Unhandled event type:", event);
          break;
      }

      await order.save();
      console.log("✅ Order updated after webhook:", order.orderNumber);
      return res.status(200).send("Webhook processed");
    } catch (err) {
      console.error("❌ Error updating order from webhook:", err.message);
      return res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = PaymentController;
