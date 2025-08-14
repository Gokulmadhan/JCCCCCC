import React, { useEffect, useState, useMemo } from 'react';
import { Loader2, Search, Filter, Package, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import axios from 'axios';
import { OrderModal } from './OrderModal';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { getOrders, updateOrderStatus } from '../api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const base_url = import.meta.env.VITE_BACKEND_URL;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getOrders();
      setOrders(data.orders || data || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
      setError('Failed to fetch orders. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus });
      await fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, order_status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleRefund = async (orderId) => {
    try {
      await axios.post(`${base_url}/orders/${orderId}/refund`);
      await fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          order_status: 'refunded',
          payment: { ...prev.payment, razorpay_status: 'refunded' }
        }));
      }
      alert('Refund processed successfully');
    } catch (err) {
      console.error('Failed to process refund', err);
      alert('Failed to process refund. Please try again.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(`/api/orders/${orderId}/cancel`);
      await fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, order_status: 'cancelled' }));
      }
      alert('Order cancelled successfully');
    } catch (err) {
      console.error('Failed to cancel order', err);
      alert('Failed to cancel order. Please try again.');
    }
  };

  const formatDate = (iso) => {
    if (!iso) return 'N/A';
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      shipped: 'bg-blue-100 text-blue-800',
      delivered: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Column helper for type safety
  const columnHelper = createColumnHelper();

  // Define columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('orderNumber', {
        header: 'Order No',
        cell: ({ row }) => (
          <div>
            <div className="text-sm text-gray-500">
              ID: ...{row.original.orderNumber?.slice(-6) || 'N/A'}
            </div>
          </div>
        ),
        filterFn: 'includesString',
      }),
      columnHelper.accessor('addressData.name', {
        id: 'customer',
        header: 'Customer',
        cell: ({ row }) => (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {row.original.addressData?.name || 'N/A'}
            </div>
            <div className="text-sm text-gray-500">
              {row.original.addressData?.phone || 'N/A'}
            </div>
          </div>
        ),
        filterFn: 'includesString',
      }),
      columnHelper.accessor('cartItems', {
        header: 'Items',
        cell: ({ getValue }) => {
          const items = getValue() || [];
          return `${items.length} item${items.length !== 1 ? 's' : ''}`;
        },
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          const aItems = rowA.original.cartItems?.length || 0;
          const bItems = rowB.original.cartItems?.length || 0;
          return aItems - bItems;
        },
      }),
      columnHelper.accessor('payment', {
        header: 'Payment',
        cell: ({ getValue }) => {
          const payment = getValue() || {};
          return (
            <div>
              <div className="text-sm text-gray-900 capitalize">
                {payment.method || 'N/A'}
              </div>
              <div className="text-sm text-gray-500">
                {payment.razorpayPaymentStatus || 'N/A'}
              </div>
            </div>
          );
        },
        enableSorting: false,
      }),
      columnHelper.accessor('amount', {
        header: 'Amount',
        cell: ({ getValue }) => {
          const amount = getValue() || 0;
          return `₹${(amount / 100).toLocaleString('en-IN')}`;
        },
        sortingFn: 'basic',
      }),
      columnHelper.accessor('createdAt', {
        header: 'Date',
        cell: ({ getValue }) => formatDate(getValue()),
        sortingFn: 'datetime',
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue();
          return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(status)}`}>
              {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
            </span>
          );
        },
        filterFn: (row, columnId, value) => {
          if (value === 'all') return true;
          return row.getValue(columnId) === value;
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <select
              value={row.original.status || ''}
              onChange={(e) => updateStatus(row.original.orderNumber, e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
            <button
              onClick={() => setSelectedOrder(row.original)}
              className="text-blue-600 hover:text-blue-900 font-medium"
            >
              View
            </button>
          </div>
        ),
      }),
    ],
    [updateStatus]
  );

  // Filter data based on status
  const filteredData = useMemo(() => {
    if (statusFilter === 'all') return orders;
    // return orders.filter(order => order.order_status === statusFilter);
    return orders.filter(order => order.order_status === statusFilter);

  }, [orders, statusFilter]);

  // Initialize table
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    initialState: {
      pagination: {
        pageSize: 10,
      },
      sorting: [
        {
          id: 'createdAt',
          desc: true,
        },
      ],
    },
  });

  // Calculate stats
  const getOrderCount = (status) => {
    if (!Array.isArray(orders)) return 0;
    return status === 'all'
      ? orders.length
      : orders.filter(order => order?.order_status === status).length;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Orders Dashboard</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-2 text-red-600 hover:text-red-800 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <label className="font-medium text-gray-700">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {['all', 'pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'].map((status) => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search orders..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { status: 'all', label: 'Total Orders', color: 'bg-gray-500' },
          { status: 'pending', label: 'Pending', color: 'bg-yellow-500' },
          { status: 'shipped', label: 'Shipped', color: 'bg-blue-500' },
          { status: 'delivered', label: 'Delivered', color: 'bg-green-500' },
        ].map(({ status, label, color }) => {
          const count = getOrderCount(status);

          return (
            <div key={status} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${color} mr-3`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{label}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <span className="ml-1">
                              {{
                                asc: '↑',
                                desc: '↓',
                              }[header.column.getIsSorted()] ?? '↕'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {table.getRowModel().rows.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400 text-sm mt-2">
                {globalFilter ? 'Try adjusting your search criteria' : 'Orders will appear here once created'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          of {table.getFilteredRowModel().rows.length} results
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          
          <button
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="px-3 py-2 text-sm text-gray-700">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          
          <button
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <button
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
          
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateStatus}
          onRefund={handleRefund}
          onCancelOrder={handleCancelOrder}
        />
      )}
    </div>
  );
};

export default Orders;