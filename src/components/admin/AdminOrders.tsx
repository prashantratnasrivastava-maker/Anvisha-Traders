import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Filter,
  MapPin,
  Phone,
  Search,
  Truck,
  User,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

export const AdminOrders: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    generateInvoice,
    setSelectedOrderForInvoice,
  } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !search ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerPhone.includes(search);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleCreateOrViewInvoice = (order: Order) => {
    if (!order.invoiceNumber) {
      generateInvoice(order.id);
    }
    setSelectedOrderForInvoice(order);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-neutral-900 font-display">
            Customer Orders &amp; Billing Invoices
          </h2>
          <p className="text-xs text-neutral-500">
            Process orders, change live delivery status (notifies customer instantly) &amp; issue official GST tax invoices
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-neutral-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, Customer Name, or Phone (e.g. 7000455037)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-[#ff5722] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {['all', 'pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {status} ({orders.filter((o) => status === 'all' || o.status === status).length})
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Master List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200">
            <Clock className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-neutral-800">No orders match criteria</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-5 transition-all"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-neutral-900">
                    #{order.id}
                  </span>
                  <span className="text-neutral-400">·</span>
                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {order.invoiceNumber && (
                    <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                      Inv: {order.invoiceNumber}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Status selector */}
                  <span className="text-xs font-semibold text-neutral-600 hidden sm:inline">
                    Status:
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value as OrderStatus)
                    }
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-neutral-300 bg-neutral-50 focus:border-[#ff5722] outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="dispatched">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {/* Generate / View Invoice Button */}
                  <button
                    onClick={() => handleCreateOrViewInvoice(order)}
                    className="px-3 py-1.5 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-orange-500/20"
                    title="Generate & View Official GST Invoice"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Official Invoice</span>
                  </button>
                </div>
              </div>

              {/* Order Body Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
                {/* Customer Details */}
                <div className="space-y-1.5 text-xs text-neutral-600">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                    <User className="w-3.5 h-3.5 text-[#ff5722]" />
                    <span>{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="text-neutral-800 hover:text-[#ff5722] font-semibold tabular-nums"
                    >
                      {order.customerPhone}
                    </a>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{order.deliveryAddress}</span>
                  </div>
                  {order.landmark && (
                    <p className="text-[11px] text-neutral-500 pl-5">
                      Landmark: {order.landmark}
                    </p>
                  )}
                </div>

                {/* Items Purchased */}
                <div className="space-y-2 md:col-span-2">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Ordered Products ({order.items.length})
                  </span>
                  <div className="bg-neutral-50 rounded-xl p-3 divide-y divide-neutral-200/60">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-1.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-md object-cover bg-white"
                          />
                          <span className="font-semibold text-neutral-800">
                            {item.name}
                          </span>
                          <span className="text-neutral-500">
                            × {item.quantity} {item.unit}
                          </span>
                        </div>
                        <span className="font-bold text-neutral-900 tabular-nums">
                          ₹{item.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 px-1">
                    <div className="space-x-3 text-neutral-500">
                      <span>Subtotal: ₹{order.subtotal}</span>
                      <span>GST (5%): ₹{order.taxAmount}</span>
                      <span>Delivery: ₹{order.deliveryFee}</span>
                      <span className="capitalize font-medium text-neutral-800">
                        Method: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                      </span>
                    </div>
                    <div className="text-sm font-extrabold text-neutral-900">
                      Total: <span className="text-[#ff5722]">₹{order.grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
