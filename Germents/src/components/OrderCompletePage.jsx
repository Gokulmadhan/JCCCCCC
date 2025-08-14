// src/pages/OrderConfirmationPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../components/CartContext';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const { deliveryAddress, cartItems, total, clearCart } = useCart();
  
  // Generate a random order number
  const orderNumber = `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  
  // Clear cart when component unmounts (optional)
  useEffect(() => {
    return () => {
      clearCart();
    };
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 sm:p-12 rounded-xl shadow-lg max-w-md w-full text-center"
      >
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="font-medium text-gray-900">{orderNumber}</p>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500">Delivery Address</p>
            <p className="font-medium text-gray-900">{deliveryAddress.name}</p>
            <p className="text-gray-700">{deliveryAddress.street}</p>
            <p className="text-gray-700">{deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zip}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-medium text-gray-900">${total.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/orders')} // Assuming you have an orders page
            className="w-full px-6 py-2.5 text-indigo-600 hover:text-indigo-800 font-medium rounded-lg transition-colors duration-200"
          >
            View Order Details
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmationPage;