import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  FileText,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  RefreshCw,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

export const CustomerOrders: React.FC = () => {
  const {
    orders,
    setSelectedOrderForInvoice,
    selectedOrderForTracking,
    setSelectedOrderForTracking,
    setCustomerTab,
    businessInfo,
  } = useStore();

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    selectedOrderForTracking ? selectedOrderForTracking.id : (orders[0]?.id || null)
  );

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case 'dispatched':
        return (
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Truck className="w-3 h-3" /> Out for Delivery
          </span>
        );
      case 'confirmed':
        return (
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Package className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold text-neutral-700 bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" /> Placed / Processing
          </span>
        );
    }
  };

  const statusSteps: { key: OrderStatus; label: string }[] = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'dispatched', label: 'Dispatched' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const getStepState = (orderStatus: OrderStatus, stepKey: OrderStatus) => {
    const orderLevels: Record<OrderStatus, number> = {
      pending: 1,
      confirmed: 2,
      dispatched: 3,
      delivered: 4,
      cancelled: 0,
    };
    const current = orderLevels[orderStatus];
    const target = orderLevels[stepKey];

    if (orderStatus === 'cancelled') return 'cancelled';
    if (current > target) return 'completed';
    if (current === target) return 'current';
    return 'upcoming';
  };

  if (orders.length === 0) {
    return (
      <div className="pb-24 max-w-xl mx-auto px-4 pt-12 text-center">
        <div className="w-20 h-20 bg-orange-50 text-[#ff5722] rounded-3xl mx-auto flex items-center justify-center mb-4">
          <Package className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 font-display">No Orders Placed Yet</h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
          When you place an order with Anvisha Traders, your live tracking and official GST tax invoice will appear here.
        </p>
        <button
          onClick={() => setCustomerTab('home')}
          className="mt-6 px-6 py-2.5 bg-[#ff5722] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/30"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="pb-28 max-w-2xl mx-auto px-4 pt-3">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 font-display">
            Your Orders &amp; Live Tracking
          </h2>
          <p className="text-xs text-neutral-500">
            Real-time status updates &amp; official GST invoices from Anvisha Traders
          </p>
        </div>
        <div className="text-xs font-semibold text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full tabular-nums">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order.id;

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden transition-all"
            >
              {/* Card Header */}
              <div
                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                className="p-4 cursor-pointer hover:bg-neutral-50/50 transition-colors flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-extrabold text-neutral-900">
                      #{order.id}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span>·</span>
                    <span className="font-semibold text-neutral-800">
                      {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                    </span>
                    <span>·</span>
                    <span className="capitalize">{order.paymentMethod.toUpperCase()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-[#ff5722] hidden sm:inline">
                    {isExpanded ? 'Hide Details' : 'Track & Details'}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 text-neutral-600" />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-4 pt-1 border-t border-neutral-100 bg-neutral-50/40 space-y-4">
                  {/* Status Progress Stepper */}
                  <div className="p-3 bg-white rounded-xl border border-neutral-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-3">
                      Order Journey Status
                    </span>
                    <div className="grid grid-cols-4 relative">
                      {statusSteps.map((step, idx) => {
                        const state = getStepState(order.status, step.key);
                        return (
                          <div key={step.key} className="flex flex-col items-center text-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 z-10 transition-colors ${
                                state === 'completed'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : state === 'current'
                                  ? 'bg-[#ff5722] text-white ring-4 ring-orange-100 shadow-xs animate-pulse'
                                  : 'bg-neutral-200 text-neutral-500'
                              }`}
                            >
                              {state === 'completed' ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                idx + 1
                              )}
                            </div>
                            <span
                              className={`text-[10px] font-semibold leading-tight ${
                                state === 'current'
                                  ? 'text-[#ff5722]'
                                  : state === 'completed'
                                  ? 'text-neutral-800'
                                  : 'text-neutral-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Timeline Log */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 space-y-2">
                      <span className="text-[11px] font-semibold text-neutral-600 block">
                        Recent Updates:
                      </span>
                      {order.statusTimeline.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#ff5722] mt-1.5 shrink-0" />
                          <div className="flex-1">
                            <div className="flex justify-between items-center text-neutral-800">
                              <span className="font-semibold">{item.label}</span>
                              <span className="text-[10px] text-neutral-400">{item.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-neutral-500">{item.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Items in package (No rate/MRP shown to customer) */}
                  <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-2">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                      Items in Package ({order.items.length})
                    </span>
                    <div className="divide-y divide-neutral-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover bg-neutral-50 shrink-0 border border-neutral-100"
                            />
                            <div className="truncate">
                              <p className="text-xs font-semibold text-neutral-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-[10px] font-bold text-[#ff5722]">
                                Qty: {item.quantity} {item.unit}
                              </p>
                            </div>
                          </div>
                          <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full shrink-0">
                            Confirmed
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-neutral-100 flex justify-between text-xs font-semibold text-neutral-600">
                      <span>Total Packets</span>
                      <span className="font-bold text-neutral-900">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} Units
                      </span>
                    </div>
                  </div>

                  {/* Delivery Location & Store Help Contact */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                    <div className="text-xs text-neutral-600 flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{order.deliveryAddress}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const itemsList = order.items
                            .map((it) => `• ${it.name} (${it.quantity} ${it.unit})`)
                            .join('\n');
                          const waText = `🛍️ *ANVISHA TRADERS - ORDER INQUIRY*\n\nNamaste Anvisha Traders,\nMera Order ID: *${order.id}*\nStatus: *${order.status.toUpperCase()}*\nBill Total: *₹${order.grandTotal.toLocaleString('en-IN')}*\n\n*Items:*\n${itemsList}\n\nKripya mujhe is order ki delivery update de dijiye.`;
                          window.open(`https://api.whatsapp.com/send?phone=917000455037&text=${encodeURIComponent(waText)}`, '_blank');
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0"
                        title="Get live delivery update on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp Status</span>
                      </button>

                      <a
                        href={`tel:${businessInfo.contact}`}
                        className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#ff7043]" />
                        <span>Call Store</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
