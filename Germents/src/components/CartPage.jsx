import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../src/components/CartContext";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeItem,
    subtotal,
    tax,
    shipping,
    total,
    clearCart,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    instructions: "",
  });

  // Load saved address from localStorage on component mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('deliveryAddress');
    if (savedAddress) {
      setDeliveryAddress(JSON.parse(savedAddress));
    }
  }, []);

  const finalTotal = Math.max(0, total - discount);

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "save10") {
      setDiscount(subtotal * 0.1);
      alert("10% discount applied!");
    } else if (couponCode.toLowerCase() === "freeship") {
      setDiscount(shipping);
      alert("Free shipping applied!");
    } else {
      alert("Invalid coupon code.");
    }
    setCouponCode("");
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({ ...prev, [name]: value }));
  };

  const saveAddress = () => {
    // Validate required fields
    if (!deliveryAddress.name || !deliveryAddress.street || !deliveryAddress.city || 
        !deliveryAddress.state || !deliveryAddress.zip || !deliveryAddress.phone || 
        !deliveryAddress.email) {
      alert("Please fill all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(deliveryAddress.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Save to localStorage
    localStorage.setItem('deliveryAddress', JSON.stringify(deliveryAddress));
    alert("Delivery address saved successfully!");
    setShowAddressForm(false);
  };

  const truncateTitle = (title) => {
    const words = title.split(' ');
    if (words.length > 3) {
      return words.slice(0, 3).join(' ') + '...';
    }
    return title;
  };

  const handleCheckout = () => {
    if (!deliveryAddress.street) {
      alert("Please add a delivery address first");
      setShowAddressForm(true);
    } else if (!deliveryAddress.email) {
      alert("Please make sure your email address is included");
      setShowAddressForm(true);
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Floating decorative elements */}
        <div className="fixed -left-32 top-1/4 w-64 h-64 bg-indigo-100 rounded-full opacity-10 -z-10"></div>
        <div className="fixed -right-32 bottom-1/4 w-64 h-64 bg-pink-100 rounded-full opacity-10 -z-10"></div>
        
        {/* Header */}
        <div className="relative mb-12">
          <div className="flex items-center relative z-10">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4 transition-colors duration-200 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </button>
            <h1 className="text-4xl font-bold text-gray-900 font-serif relative">
              Your Shopping Cart
              <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></span>
            </h1>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md max-w-2xl mx-auto relative overflow-hidden border border-gray-100">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-50 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-50 rounded-full"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="mt-4 text-2xl font-medium text-gray-900">Your cart feels lonely</h2>
              <p className="mt-2 text-gray-600 max-w-md mx-auto">Your shopping cart is waiting to be filled. Explore our collection and find something special!</p>
              <button
                onClick={() => navigate("/")}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 font-medium text-sm text-indigo-800 uppercase tracking-wider">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Total</div>
                  <div className="col-span-1 text-center">Action</div>
                </div>
                <AnimatePresence>
                  {cartItems.map((item) => {
                    const key = `${item.id}-${item.color}-${item.size}`;
                    return (
                      <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="grid grid-cols-2 md:grid-cols-12 gap-4 p-6 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors duration-150"
                      >
                      <div className="col-span-2 md:col-span-5 flex items-center gap-4">
                        <div className="relative">
                        <img 
                          src={`https://jack-cruise-backend.onrender.com/uploads/${item.image}`} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-sm" 
                        />
                        {item.quantity > 1 && (
                          <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center shadow-sm">
                          {item.quantity}
                          </span>
                        )}
                        </div>
                        <div>
                        <p className="font-medium text-gray-900" title={item.name}>
                          {truncateTitle(item.name)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-800 mr-1">
                          {item.color}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                          {item.size}
                          </span>
                        </p>
                        </div>
                      </div>
                      <div className="md:col-span-2 text-center">
                        <span className="md:hidden text-xs text-gray-500 mr-2">Price:</span>
                        <span className="font-medium text-gray-700">
                        ${typeof item.price === "number" ? item.price.toFixed(2) : "0.00"}
                        </span>
                      </div>
                      <div className="md:col-span-2 flex justify-center items-center gap-2">
                        <button
                        onClick={() =>
                          updateQuantity(item.id, item.color, item.size, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className={`p-2 rounded-md ${item.quantity <= 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} transition-colors duration-200`}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                        onClick={() =>
                          updateQuantity(item.id, item.color, item.size, item.quantity + 1)
                        }
                        className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors duration-200"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        </button>
                      </div>
                      <div className="md:col-span-2 text-center">
                        <span className="md:hidden text-xs text-gray-500 mr-2">Total:</span>
                        <span className="font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                        onClick={() =>
                          setShowRemoveConfirm({ id: item.id, color: item.color, size: item.size })
                        }
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        </button>
                      </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-2.5 text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2 transition-colors duration-200 hover:bg-indigo-50 rounded-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Continue Shopping
                </button>
                <button
                  onClick={clearCart}
                  className="px-6 py-2.5 text-red-600 hover:text-red-800 font-medium flex items-center gap-2 transition-colors duration-200 hover:bg-red-50 rounded-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary and Delivery Address */}
            <div className="w-full lg:w-96 space-y-6">
              {/* Delivery Address Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-indigo-100 rounded-full opacity-10"></div>
                
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 font-serif flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Delivery Address
                  </h2>
                  {!showAddressForm && (
                    <button 
                      onClick={() => setShowAddressForm(true)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                    >
                      {deliveryAddress.street ? "Edit" : "Add"}
                    </button>
                  )}
                </div>
                
                {showAddressForm ? (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="name"
                          value={deliveryAddress.name}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                        <input
                          type="email"
                          name="email"
                          value={deliveryAddress.email}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          name="street"
                          value={deliveryAddress.street}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="city"
                            value={deliveryAddress.city}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="state"
                            value={deliveryAddress.state}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            name="zip"
                            value={deliveryAddress.zip}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                          <input
                            type="tel"
                            name="phone"
                            value={deliveryAddress.phone}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Instructions (Optional)</label>
                        <textarea
                          name="instructions"
                          value={deliveryAddress.instructions}
                          onChange={handleAddressChange}
                          rows="2"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button 
                        onClick={() => setShowAddressForm(false)}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveAddress}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
                      >
                        Save Address
                      </button>
                    </div>
                  </motion.div>
                ) : deliveryAddress.street ? (
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="font-medium">{deliveryAddress.name}</p>
                    <p>{deliveryAddress.email}</p>
                    <p>{deliveryAddress.street}</p>
                    <p>{deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zip}</p>
                    <p className="mt-2">Phone: {deliveryAddress.phone}</p>
                    {deliveryAddress.instructions && (
                      <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400">
                        <p className="text-yellow-700">Instructions: {deliveryAddress.instructions}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>No delivery address added yet</p>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-pink-100 rounded-full opacity-10"></div>
                <h2 className="text-xl font-bold text-gray-900 font-serif mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-100 text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-4 mt-6">
                  {/* <div className="relative">
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                    <button 
                      onClick={applyCoupon}
                      className="absolute right-1 top-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors duration-200"
                    >
                      Apply
                    </button>
                  </div> */}
                  
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <p className="text-center text-sm text-gray-500">
                    or{' '}
                    <button 
                      onClick={() => navigate("/")} 
                      className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                    >
                      Continue Shopping
                    </button>
                  </p>
                </div>
              </div>

              {/* Delivery Options */}
              {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"> */}
                {/* <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  Delivery Options
                </h3> */}
                <div className="space-y-3">
                  {/* <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors duration-200 cursor-pointer"> */}
                    {/* <div className="flex-shrink-0"> */}
                      {/* <div className="w-5 h-5 rounded-full border-2 border-indigo-500 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                      </div> */}
                    {/* </div> */}
                    {/* <div>
                      <p className="font-medium">Standard Delivery</p>
                      <p className="text-sm text-gray-500">3-5 business days • Free</p>
                    </div> */}
                  {/* </div> */}
                  {/* <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors duration-200 cursor-pointer"> */}
                    {/* <div className="flex-shrink-0">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    </div> */}
                    {/* <div>
                      <p className="font-medium">Express Delivery</p>
                      <p className="text-sm text-gray-500">1-2 business days • $5.99</p>
                    </div> */}
                  {/* </div> */}
                {/* </div> */}
              </div>
            </div>
          </div>
        )}

        {/* Remove Confirmation Modal */}
        <AnimatePresence>
          {showRemoveConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-8 rounded-xl max-w-md w-full shadow-2xl border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-8 w-8 text-red-500 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Remove Item</h3>
                    <p className="mt-2 text-gray-600">
                      Are you sure you want to remove this item from your cart?
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-4">
                  <button 
                    onClick={() => setShowRemoveConfirm(null)} 
                    className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-medium rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
                    onClick={() => {
                      const { id, color, size } = showRemoveConfirm;
                      removeItem(id, color, size);
                      setShowRemoveConfirm(null);
                    }}
                  >
                    Remove Item
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CartPage;