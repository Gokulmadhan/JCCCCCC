// const mongoose = require("mongoose");
// 
// // Embedded Order Item Schema
// const orderItemSchema = new mongoose.Schema(
//   {
//     id: { type: String, required: true },
//     name: { type: String, required: true },
//     size: { type: String },
//     quantity: { type: Number, required: true, min: 1 },
//     price: { type: Number, required: true, min: 0 },
//   },
//   { _id: false }
// );
// 
// // Shipping Address Schema
// const shippingAddressSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     phone: { type: String, required: true },
//     street: { type: String, required: true },
//     addressLine2: { type: String },
//     city: { type: String, required: true },
//     state: { type: String },
//     zip: { type: String, required: true },
//     instructions: { type: String },
//     email: { type: String },
//   },
//   { _id: false }
// );
// 
// // Razorpay Payment Schema
// const razorpayPaymentSchema = new mongoose.Schema(
//   {
//     method: {
//       type: String, // ✅ No unique constraint
//     },
//     razorpayOrderId: {
//       type: String,
//       required: true,
//     },
//     amount: {
//       type: Number,
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
// 
// // Main Order Schema
// const orderSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: String,
//       required: true,
//       ref: "User",
//       index: true,
//     },
//     mode: {
//       type: String,
//       required: true,
//     },
//     amount: {
//       type: Number,
//       required: true,
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
// 
// // Compound Index (User + Order)
// orderSchema.index({ userId: 1, orderNumber: 1 }, { unique: true });
// 
// const Order = mongoose.model("Order", orderSchema);
// module.exports = Order;
// 
// 
// 
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
razorpayOrder: {
  razorpayOrderId: {
    type: String,
    required: function () {
      return this.mode !== 'cod'; // only required if not COD
    },
  },
},


  razorpayPaymentStatus: {
    type: String,
   enum: ["created", "captured", "failed", "cod"], 
    default: 'created',
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  cartItems: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number,
      color: String,
      size: String,
      image: String,
    },
  ],
  addressData: {
    fullName: String,
    phone: String,
    name: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    instructions: String,
  },
  userId: {
    type: String, 
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled', 'shipped', 'delivered', 'refunded'],
    default: 'pending',
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },
  payment: {
    method: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    razorpayPaymentStatus: {
      type: String,
      enum: ["created", "captured", "failed","cod"],
      default: "created",
    },
    webhookVerified: { type: Boolean, default: false },
    paidAt: { type: Date },
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
