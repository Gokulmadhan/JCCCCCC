const express = require('express');
const PaymentController = require('../controllers/paymentController');

const router = express.Router();


router.post("/create-order", PaymentController.createOrder);
router.post("/verify", PaymentController.verifyPayment);



module.exports = router;