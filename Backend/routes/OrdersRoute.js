// const express = require("express");
// const router = express.Router();
// const OrderController = require("../controllers/orderController");

// // @route   POST /api/orders/create
// // @desc    Create a new order
// router.post("/create", OrderController.createOrder);

// // @route   GET /api/orders/
// // @desc    Get all orders (Admin)
// router.get("/", OrderController.getAllOrders);

// // @route   GET /api/orders/user/:userId
// // @desc    Get all orders of a specific user
// router.get("/user/:userId", OrderController.getUserOrders);

// // @route   PATCH /api/orders/:orderId/status
// // @desc    Update order status (Admin)
// router.patch("/:orderId/status", OrderController.updateOrderStatus);

// // @route   PATCH /api/orders/:orderId/verify
// // @desc    Verify Razorpay payment signature
// router.patch("/:orderId/verify", OrderController.verifySignature);

// // @route   DELETE /api/orders/:orderId
// // @desc    Delete an order
// router.delete("/:orderId", OrderController.deleteOrder);

// module.exports = router;
