import React, { useEffect, useState } from 'react';
import {
  Package, Clock, CheckCircle, Truck, MapPin,
  CreditCard, Phone, Filter, Eye,
  Calendar, User, ShoppingBag, ArrowRight,
  X, AlertCircle, ChevronRight
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';

// Set this to your actual backend URL
const backendURL = 'https://jack-cruise-backend.onrender.com'; // or from env

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const user =  useSelector((state) => state.jc_auth.user);
  const userId = user?.userId;

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        // Replace with actual API call
        const response = await fetch(`${backendURL}/orders/track/${userId}`);
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchMyOrders();
  }, [userId]);

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          color: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock className="w-4 h-4" />,
          dot: 'bg-yellow-400',
          progress: 25
        };
      case 'paid':
        return {
          color: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200',
          icon: <CreditCard className="w-4 h-4" />,
          dot: 'bg-blue-400',
          progress: 50
        };
      case 'shipped':
        return {
          color: 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-200',
          icon: <Truck className="w-4 h-4" />,
          dot: 'bg-green-400',
          progress: 75
        };
      case 'delivered':
        return {
          color: 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-200',
          icon: <CheckCircle className="w-4 h-4" />,
          dot: 'bg-emerald-400',
          progress: 100
        };
      case 'canceled':
        return {
          color: 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-200',
          icon: <X className="w-4 h-4" />,
          dot: 'bg-red-400',
          progress: 0
        };
      case 'refund':
        return {
          color: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 border-purple-200',
          icon: <ArrowRight className="w-4 h-4" />,
          dot: 'bg-purple-400',
          progress: 0
        };
      default:
        return {
          color: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-200',
          icon: <Package className="w-4 h-4" />,
          dot: 'bg-gray-400',
          progress: 0
        };
    }
  };

  const getProgressSteps = (status) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: <Package className="w-4 h-4" /> },
      { key: 'paid', label: 'Payment Confirmed', icon: <CreditCard className="w-4 h-4" /> },
      { key: 'shipped', label: 'Shipped', icon: <Truck className="w-4 h-4" /> },
      { key: 'delivered', label: 'Delivered', icon: <CheckCircle className="w-4 h-4" /> }
    ];

    const statusOrder = ['pending', 'paid', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(status?.toLowerCase());

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter;
    return matchesStatus;
  });

  const OrderCard = ({ order }) => {
    const statusConfig = getStatusConfig(order.status);
    const steps = getProgressSteps(order.status);
    
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">#{order.orderNumber}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-full border ${statusConfig.color}`}>
              {statusConfig.icon}
              <span className="capitalize font-medium">{order.status}</span>
            </div>
          </div>

          {/* Order Progress Steps */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Order Progress</h4>
            <div className="relative">
              {steps.map((step, index) => (
                <div key={step.key} className="flex items-center mb-3 last:mb-0">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2 
                    ${step.completed ? 'bg-blue-500 border-blue-500 text-white' : 
                      step.active ? 'bg-blue-100 border-blue-500 text-blue-600' : 
                      'bg-gray-100 border-gray-300 text-gray-400'}
                  `}>
                    {step.icon}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${step.completed || step.active ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`absolute left-4 w-0.5 h-6 mt-8 ${step.completed ? 'bg-blue-500' : 'bg-gray-300'}`} 
                         style={{ top: `${index * 2.75}rem` }}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Total Amount</p>
              <p className="text-lg font-semibold text-gray-900">₹{order.amount?.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Items</p>
              <p className="text-lg font-semibold text-gray-900">{order.cartItems?.length || 0}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Shipping to:</p>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">{order.addressData?.name}</p>
                <p className="text-xs text-gray-500">{order.addressData?.city}, {order.addressData?.state}</p>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Items:</p>
            <div className="space-y-2">
              {order.cartItems?.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} • Size: {item.size?.toUpperCase()}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">₹{item.price?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OrderModal = ({ order, onClose }) => {
    const steps = getProgressSteps(order.status);
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h2>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5"/>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Order Progress */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Order Progress</h3>
              <div className="relative">
                {steps.map((step, index) => (
                  <div key={step.key} className="flex items-center mb-4 last:mb-0">
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 
                      ${step.completed ? 'bg-blue-500 border-blue-500 text-white' : 
                        step.active ? 'bg-blue-100 border-blue-500 text-blue-600' : 
                        'bg-gray-100 border-gray-300 text-gray-400'}
                    `}>
                      {step.icon}
                    </div>
                    <div className="ml-4">
                      <p className={`font-medium ${step.completed || step.active ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.label}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`absolute left-5 w-0.5 h-8 mt-10 ${step.completed ? 'bg-blue-500' : 'bg-gray-300'}`} 
                           style={{ top: `${index * 4 + 2.5}rem` }}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Order Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p><span className="text-gray-500">Total:</span> ₹{order.amount?.toLocaleString()}</p>
                  <p><span className="text-gray-500">Payment:</span> {order.mode}</p>
                  <p><span className="text-gray-500">Status:</span> {order.payment?.razorpayPaymentStatus || 'N/A'}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Shipping Address</h4>
                <div className="text-sm text-gray-700">
                  <p className="font-medium">{order.addressData?.name}</p>
                  <p>{order.addressData?.street}</p>
                  <p>{order.addressData?.city}, {order.addressData?.state}</p>
                  <p>{order.addressData?.zip}</p>
                  <p className="flex items-center gap-1 mt-2">
                    <Phone className="w-4 h-4" />
                    {order.addressData?.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Items Ordered</h4>
              <div className="space-y-3">
                {order.cartItems?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} • Size: {item.size?.toUpperCase()}</p>
                    </div>
                    <p className="font-semibold text-gray-900">₹{item.price?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filter */}
        <div className="mb-8 flex justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="canceled">Canceled</option>
            <option value="refund">Refund</option>
          </select>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">You haven't placed any orders yet or no orders match your filter.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map(order => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;