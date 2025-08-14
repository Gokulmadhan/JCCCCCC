const express = require("express");
const OrderController = require("../controllers/orderController");
const router = express.Router();
// const authenticate = require('../middleware/authMiddleware');

router.post("/create", OrderController.createOrder);
router.get("/", OrderController.getAllOrders);
// router.get("/user/:userId", OrderController.getUserOrders);
router.get("/user/:userId",  OrderController.getUserOrders);
router.get("/track/:userId",  OrderController.trackOrder);
// trackOrder
router.patch("/:orderId/status", OrderController.updateOrderStatus);

router.patch("/:orderId/verify", OrderController.verifySignature);

router.delete("/:orderId",OrderController.deleteOrder)

module.exports = router;
