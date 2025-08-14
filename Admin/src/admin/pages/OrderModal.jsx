import React, { useState } from 'react';
import {
  X, Calendar, CheckCircle, Truck, Package, User, Phone,
  MapPin, CreditCard, RotateCcw, XCircle
} from 'lucide-react';

export const OrderModal = ({ order, onClose, onUpdateStatus, onRefund, onCancelOrder }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  if (!order) return null;

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => `₹${((amount ?? 0) / 100).toLocaleString('en-IN')}`;

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      shipped: 'bg-blue-100 text-blue-800 border-blue-200',
      delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      created: 'bg-orange-100 text-orange-800',
      captured: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus?.(order?.orderNumber, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRefund = async () => {
    if (window.confirm('Are you sure you want to process a refund for this order?')) {
      setIsUpdating(true);
      try {
        await onRefund?.(order?._id);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setIsUpdating(true);
      try {
        await onCancelOrder?.(order?._id);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const orderStatus = order?.order_status || order?.status || 'pending';
  const payment = order?.payment || {};
  const address = order?.addressData || {};
  const cartItems = order?.cartItems || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-gray-600 mt-1">{order?.orderNumber || 'Order #N/A'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Order Status & Date */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(orderStatus)}`}>
                {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
              </span>
              <span className="text-gray-500 text-sm flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(order?.createdAt)}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 flex-wrap">
              {orderStatus === 'pending' && (
                <button onClick={() => handleStatusUpdate('paid')} disabled={isUpdating}
                  className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50">
                  <CheckCircle className="w-4 h-4" /> Mark Paid
                </button>
              )}
              {orderStatus === 'paid' && (
                <button onClick={() => handleStatusUpdate('shipped')} disabled={isUpdating}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50">
                  <Truck className="w-4 h-4" /> Mark Shipped
                </button>
              )}
              {orderStatus === 'shipped' && (
                <button onClick={() => handleStatusUpdate('delivered')} disabled={isUpdating}
                  className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 disabled:opacity-50">
                  <Package className="w-4 h-4" /> Mark Delivered
                </button>
              )}
              {(orderStatus === 'paid' || orderStatus === 'delivered') && (
                <button onClick={handleRefund} disabled={isUpdating}
                  className="flex items-center gap-1 px-3 py-2 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 disabled:opacity-50">
                  <RotateCcw className="w-4 h-4" /> Refund
                </button>
              )}
              {(orderStatus === 'pending' || orderStatus === 'paid') && (
                <button onClick={handleCancel} disabled={isUpdating}
                  className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50">
                  <XCircle className="w-4 h-4" /> Cancel
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Items */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-600" /> Order Items
              </h3>
              <div className="space-y-3">
                {cartItems.length > 0 ? cartItems.map((item, index) => (
                  <div key={index} className="bg-white rounded-md p-3 border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item?.name || 'Unnamed Product'}</h4>
                        <p className="text-sm text-gray-600">Color: {item?.color || 'N/A'}</p>
                        <p className="text-sm text-gray-600">Size: {item?.size || 'N/A'}</p>
                        <p className="text-sm text-gray-600">Quantity: {item?.quantity || 0}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(item?.price * 100)}</p>
                        <p className="text-sm text-gray-600">per item</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-sm">No items found in this order.</p>
                )}
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" /> Customer Information
              </h3>
              <div className="bg-white rounded-md p-3 border space-y-2">
                <p className="font-medium text-gray-900">{address?.name || 'Unnamed'}</p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {address?.phone || 'N/A'}
                </p>
                <div className="text-sm text-gray-600 flex items-start gap-1">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{address?.street || 'No Address'}</p>
                    <p>{address?.city}, {address?.state}</p>
                    <p>{address?.zip}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-600" /> Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-md p-3 border space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium uppercase">{payment?.method || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Razorpay Order ID:</span>
                  <span className="font-mono text-sm">{order?.razorpayOrder?.razorpayOrderId || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Razorpay Payment ID:</span>
                  <span className="font-mono text-sm">{payment?.razorpayPaymentId || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid At:</span>
                  <span className="font-mono text-sm">{formatDate(payment?.paidAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Currency:</span>
                  <span className="font-medium">{order?.currency || 'INR'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment?.razorpayPaymentStatus)}`}>
                    {payment?.razorpayPaymentStatus || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-md p-3 border space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-lg">{formatCurrency(order?.amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Manual Status Update */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Update Order Status</h3>
            <div className="flex flex-wrap gap-2">
              {['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={isUpdating || orderStatus === status}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    orderStatus === status
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
