// const mongoose = require("mongoose");

// // Embedded OrderItem Schema
// const orderItemSchema = new mongoose.Schema(
//   {
//     productId: {
//       type: String,
//       required: true,
//     },
//     title: {
//       type: String,
//       required: true,
//     },
//     size: {
//       type: String,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//       min: 1,
//     },
//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//   },
//   { _id: false }
// );

// // Embedded Shipping Address Schema
// const shippingAddressSchema = new mongoose.Schema(
//   {
//     fullName: { type: String, required: true },
//     addressLine1: { type: String, required: true },
//     addressLine2: { type: String },
//     city: { type: String, required: true },
//     state: { type: String },
//     postalCode: { type: String, required: true },
//     country: { type: String, required: true },
//     phone: { type: String, required: true },
//   },
//   { _id: false }
// );

// // Embedded Payment Schema (Specific to Razorpay UPI)
// const razorpayPaymentSchema = new mongoose.Schema(
//   {
//     method: {
//       type: String,
//     },
//     razorpayOrderId: {
//       type: String,
//       required: true,
//     },
//     amount: {
//       type: Number, // Changed to Number
//     },
//     currency: {
//       type: String,
//     },
//     webhookVerified: {
//       type: Boolean,
//     },
//     razorpayPaymentId: {
//       type: String,
//       default: undefined,
//     },
//     razorpaySignature: {
//       type: String,
//       default: undefined,
//     },
//     razorpayPaymentStatus: {
//       type: String,
//       enum: [
//         "created",
//         "authorized",
//         "captured",
//         "failed",
//         "dispute_created",
//         "dispute_won",
//         "dispute_lost",
//         "dispute_closed",
//         "dispute_under_review",
//         "action_required",
//         "refunded",
//         "refund_failed",
//       ],
//       default: "created",
//     },
//     paidAt: {
//       type: Date,
//     },
//   },
//   { _id: false }
// );

// // Main Order Schema
// const orderSchema = new mongoose.Schema(
//   {
//     userId: {
//        type: String, 
//       required: true,
//       ref: "User",
//       index: true,
//     },
//     orderNumber: {
//       type: String,
//       unique: true,
//       required: true,
//     },
//     orderItems: {
//       type: [orderItemSchema],
//       validate: [(val) => val.length > 0, "Order must contain at least one item."],
//     },
//     shippingAddress: {
//       type: shippingAddressSchema,
//       required: true,
//     },
//     payment: {
//       type: razorpayPaymentSchema,
//       required: true,
//     },
//     order_status: {
//       type: String,
//       default: "pending",
//     },
//     notes: {
//       type: String,
//       maxlength: 1000,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Unique compound index
// orderSchema.index({ userId: 1, orderNumber: 1 }, { unique: true });

// const Order = mongoose.model("Order", orderSchema);
// module.exports = Order;
