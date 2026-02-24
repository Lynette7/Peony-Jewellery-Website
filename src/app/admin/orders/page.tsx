'use client';

import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Eye, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Order } from '@/types/database';

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-900/50 text-yellow-300' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-900/50 text-blue-300' },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-900/50 text-purple-300' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-900/50 text-green-300' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-900/50 text-red-300' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchQuery) {
      filtered = filtered.filter(
        (o) =>
          o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status: newStatus as Order['status'] } : o
        )
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as Order['status'] });
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find((s) => s.value === status)?.color || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f8dae2]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#fcfbf9]">Orders</h1>
        <p className="text-[#f8dae2]">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-[#5a002d] rounded-xl shadow-sm border border-[#920b4c] p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#f8dae2]" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9] placeholder-[#f8dae2]/50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9]"
          >
            <option value="all">All Status</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#5a002d] rounded-xl shadow-sm border border-[#920b4c] overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="mx-auto mb-4 text-[#920b4c]" size={48} />
            <h3 className="text-lg font-medium text-[#fcfbf9] mb-2">No orders found</h3>
            <p className="text-[#f8dae2]">
              {orders.length === 0
                ? 'Orders will appear here once customers start checking out.'
                : 'Try adjusting your search or filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#4d0025] border-b border-[#920b4c]">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#f8dae2] uppercase tracking-wider">
                    Order
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#f8dae2] uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#f8dae2] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#f8dae2] uppercase tracking-wider">
                    Total
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#f8dae2] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-[#f8dae2] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#920b4c]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#920b4c]/20">
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm text-[#fcfbf9]">
                        #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-[#f8dae2] capitalize">
                        {order.payment_method}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#fcfbf9]">{order.customer_name}</p>
                      <p className="text-sm text-[#f8dae2]">{order.customer_email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#f8dae2]">{formatDate(order.created_at)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#fcfbf9]">{formatPrice(order.total)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-xs font-medium px-3 py-1 rounded-full border-0 cursor-pointer ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-[#f8dae2] hover:text-[#fcfbf9] hover:bg-[#920b4c]/50 rounded-lg transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="text-sm text-[#f8dae2]">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#5a002d] rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#920b4c]">
            <div className="p-6 border-b border-[#920b4c] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#fcfbf9]">
                  Order #{selectedOrder.id.slice(0, 8)}
                </h2>
                <p className="text-sm text-[#f8dae2]">{formatDate(selectedOrder.created_at)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-[#920b4c]/50 rounded-lg text-[#f8dae2]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <h3 className="text-sm font-medium text-[#f8dae2] mb-2">Status</h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                  className={`text-sm font-medium px-4 py-2 rounded-lg ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-medium text-[#f8dae2] mb-2">Customer</h3>
                <div className="bg-[#4d0025] rounded-lg p-4 space-y-2">
                  <p className="font-medium text-[#fcfbf9]">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-[#f8dae2]">{selectedOrder.customer_email}</p>
                  <p className="text-sm text-[#f8dae2]">{selectedOrder.customer_phone}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-medium text-[#f8dae2] mb-2">Shipping Address</h3>
                <div className="bg-[#4d0025] rounded-lg p-4">
                  <p className="text-[#f8dae2]">{selectedOrder.address}</p>
                  <p className="text-[#f8dae2]">
                    {selectedOrder.city}, {selectedOrder.postal_code}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-medium text-[#f8dae2] mb-2">Items</h3>
                <div className="bg-[#4d0025] rounded-lg divide-y divide-[#920b4c]">
                  {Array.isArray(selectedOrder.items) &&
                    (selectedOrder.items as Array<{
                      name: string;
                      quantity: number;
                      price: number;
                      variant?: string | null;
                    }>).map((item, index) => (
                      <div key={index} className="p-4 flex justify-between">
                        <div>
                          <p className="font-medium text-[#fcfbf9]">{item.name}</p>
                          {item.variant && (
                            <p className="text-xs text-[#f8dae2]/70 mt-0.5">Variant: {item.variant}</p>
                          )}
                          <p className="text-sm text-[#f8dae2]">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-[#fcfbf9]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Payment */}
              <div className="flex justify-between items-center pt-4 border-t border-[#920b4c]">
                <div>
                  <p className="text-sm text-[#f8dae2]">Payment Method</p>
                  <p className="font-medium text-[#fcfbf9] capitalize">
                    {selectedOrder.payment_method}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#f8dae2]">Total</p>
                  <p className="text-xl font-bold text-[#f8dae2]">
                    {formatPrice(selectedOrder.total)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
