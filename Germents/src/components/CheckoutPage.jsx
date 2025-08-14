import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { motion } from 'framer-motion';
import handleRazorpay from '../services/PaymentHandler';
import { createBackendOrder, createRazorpayOrder, verifyPayment } from '../services/razorpayService';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const CheckoutPage = () => {
  const {
    cartItems,
    total,
    deliveryAddress,
    clearCart,
    subtotal,
    tax,
    shipping,
  } = useCart();

  const uploads = import.meta.env.VITE_UPLOADS;
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.jc_auth.user);

  useEffect(() => {
    if (!user) {
      toast.info("Please sign in to continue checkout.");
    }

    if (!deliveryAddress || !deliveryAddress.street) {
      toast.warn('Please provide a delivery address before proceeding.');
      navigate('/address');
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!deliveryAddress.street) {
      newErrors.address = 'Delivery address is required';
    }

    if (paymentMethod === 'card') {
      if (!cardDetails.number || !/^\d{16}$/.test(cardDetails.number.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Valid card number is required';
      }
      if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
        newErrors.cardExpiry = 'Valid expiry date (MM/YY) is required';
      }
      if (!cardDetails.cvv || !/^\d{3,4}$/.test(cardDetails.cvv)) {
        newErrors.cardCvv = 'Valid CVV is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!user || !user.userId) {
      toast.warn("Please sign in to place an order.");
      navigate("/signin");
      return;
    }

    if (!validateForm()) return;

    const orderPayload = {
      amount: total,
      razorpayPaymentStatus: 'created',
      currency: 'INR',
      cartItems,
      addressData: deliveryAddress,
      userId: user?.userId,
      mode: paymentMethod,
    };

    try {
      if (paymentMethod === 'cod') {
        const orderRes = await createBackendOrder(orderPayload);
        if (orderRes?.order) {
          toast.success("Order placed successfully with COD!");
          clearCart();
          navigate('/');
        } else {
          toast.error("Failed to place COD order.");
        }
        return;
      }

      const razorpayOrder = await createRazorpayOrder(total);
      orderPayload.razorpayOrder = { razorpayOrderId: razorpayOrder.id };

      const paymentSuccess = async (paymentRes) => {
        try {
          const orderRes = await createBackendOrder(orderPayload);
          const orderId = orderRes?.order?.orderNumber;

          if (!orderId) {
            console.error("Order number not found");
            return;
          }

          const verifyRes = await verifyPayment(orderId, paymentRes);
          if (verifyRes) {
            clearCart();
            toast.success("🎉 Payment successful!");
            navigate('/');
          } else {
            toast.error("Payment verification failed.");
          }
        } catch (err) {
          console.error("Error in paymentSuccess:", err);
          toast.error("Something went wrong during payment.");
        }
      };

      const paymentFailed = async () => {
        toast.info("Payment was cancelled or failed.");
      };

      await handleRazorpay(
        orderPayload.amount,
        orderPayload.currency,
        razorpayOrder.id,
        deliveryAddress.fullName,
        deliveryAddress.phone,
        paymentSuccess,
        paymentFailed
      );
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Something went wrong during payment.");
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
      >
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">There are no items to checkout.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Continue Shopping
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Review your order before payment</p>
        </div>

        <form onSubmit={handlePayment}>
          {/* Order Summary */}
          <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            </div>
            <div className="p-6">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.color}-${item.size}`}
                  className="flex justify-between py-4 border-b border-gray-100"
                >
                  <div className="flex items-center">
                    <img
                      src={`${uploads}/${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.color} / {item.size} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Address & Payment Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Address */}
            <div className="bg-white shadow rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Delivery Address</h2>
              </div>
              <div className="p-6 space-y-2">
                <p className="font-medium">{deliveryAddress.name}</p>
                <p>{deliveryAddress.street}</p>
                <p>
                  {deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zip}
                </p>
                <p>Phone: {deliveryAddress.phone}</p>
                {deliveryAddress.instructions && (
                  <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                    <p className="text-yellow-700 text-sm">
                      <span className="font-medium">Instructions:</span>{' '}
                      {deliveryAddress.instructions}
                    </p>
                  </div>
                )}
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address}</p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white shadow rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
              </div>
              <div className="p-6 space-y-4">
                <label
                  className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer"
                  onClick={() => setPaymentMethod('upi')}
                >
                  <input type="radio" checked={paymentMethod === 'upi'} readOnly />
                  <span className="font-medium">UPI</span>
                </label>

                <label
                  className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer"
                  onClick={() => setPaymentMethod('cod')}
                >
                  <input type="radio" checked={paymentMethod === 'cod'} readOnly />
                  <span className="font-medium">Cash On Delivery</span>
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/CartPage')}
              className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-medium rounded-lg"
            >
              Back to Cart
            </button>
            <button
              type="submit"
              disabled={!user}
              className={`px-8 py-3 font-medium rounded-lg shadow-md ${
                user
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {user ? 'Complete Payment' : 'Sign in to Pay'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
