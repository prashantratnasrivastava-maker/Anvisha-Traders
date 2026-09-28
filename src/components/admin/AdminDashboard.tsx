import React from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  Clock,
  DollarSign,
  FileSpreadsheet,
  FileText,
  FolderPlus,
  Package,
  Plus,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users,
  UserCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    categories,
    setAdminTab,
    updateOrderStatus,
    setSelectedOrderForInvoice,
    adjustStock,
    customerApprovalRequests,
    pendingApprovalsCount,
  } = useStore();

  // Metrics
  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  );
  const todaySales = todayOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const pendingOrders = orders.filter((o) => o.status === 'pending');

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Today&apos;s Sales
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-neutral-900 tabular-nums font-display">
              ₹{todaySales.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              {todayOrders.length} orders received today
            </p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#ff5722] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-neutral-900 tabular-nums font-display">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              {orders.length} lifetime orders
            </p>
          </div>
        </div>

        {/* Customer Approvals KPI */}
        <div
          onClick={() => setAdminTab('customers')}
          className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-amber-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Customer Approvals
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${pendingApprovalsCount > 0 ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-neutral-100 text-neutral-600'}`}>
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-neutral-900 tabular-nums font-display">
              {pendingApprovalsCount} Pending
            </span>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              {customerApprovalRequests.length} registered customers
            </p>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Stock Warnings
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-neutral-900 tabular-nums font-display">
              {lowStockProducts.length} Items
            </span>
            <p className="text-[11px] text-amber-600 font-semibold mt-0.5">
              Stock count &le; 5 units
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Strip */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-neutral-900 text-white rounded-2xl shadow-sm">
        <span className="text-xs font-bold text-neutral-300 ml-2 mr-1">Quick Actions:</span>
        <button
          onClick={() => setAdminTab('customers')}
          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Verify Customers {pendingApprovalsCount > 0 ? `(${pendingApprovalsCount})` : ''}</span>
        </button>
        <button
          onClick={() => setAdminTab('products')}
          className="px-3 py-1.5 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </button>
        <button
          onClick={() => setAdminTab('categories')}
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>Add Category</span>
        </button>
        <button
          onClick={() => setAdminTab('reports')}
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Daily Sales Report</span>
        </button>
        <button
          onClick={() => setAdminTab('inventory')}
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Package className="w-3.5 h-3.5" />
          <span>Restock Inventory</span>
        </button>
      </div>

      {/* 2-Column Split: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                Recent Customer Orders
              </h3>
              <p className="text-xs text-neutral-500">
                Update status or generate customer GST invoice
              </p>
            </div>
            <button
              onClick={() => setAdminTab('orders')}
              className="text-xs font-semibold text-[#ff5722] hover:underline"
            >
              View all orders ({orders.length}) →
            </button>
          </div>

          <div className="divide-y divide-neutral-100 overflow-x-auto">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-900">#{order.id}</span>
                    <span className="text-xs text-neutral-500">· {order.customerName}</span>
                    <span className="text-[10px] text-neutral-400">({order.customerPhone})</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5 truncate max-w-sm">
                    {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    <span className="font-bold text-neutral-900 tabular-nums">
                      ₹{order.grandTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="text-neutral-400">·</span>
                    <span className="capitalize text-neutral-600">
                      {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Dropdown */}
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value as OrderStatus)
                    }
                    className="text-xs font-semibold px-2 py-1 bg-neutral-100 rounded-lg border border-neutral-200 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="dispatched">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => setSelectedOrderForInvoice(order)}
                    className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
                    title="View, Edit Rates & Print Official GST Invoice"
                  >
                    <FileText className="w-3 h-3 text-[#ff7043]" />
                    <span>Invoice / Edit Rate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Low Stock Warnings */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Low Stock Monitor</span>
              </h3>
              <span className="text-[11px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                {lowStockProducts.length} alert
              </span>
            </div>

            <div className="space-y-3 mt-3">
              {lowStockProducts.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  All catalog items have healthy inventory levels!
                </div>
              ) : (
                lowStockProducts.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-neutral-900 truncate">{p.name}</p>
                      <p className="text-[10px] text-amber-700 font-semibold">
                        {p.stock} {p.unit} remaining
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => adjustStock(p.id, 5)}
                        className="px-2 py-1 bg-white hover:bg-neutral-200 border border-neutral-300 rounded text-[11px] font-bold text-neutral-800"
                        title="Quick Restock +5 units"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => adjustStock(p.id, 10)}
                        className="px-2 py-1 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded text-[11px] font-bold"
                        title="Quick Restock +10 units"
                      >
                        +10
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setAdminTab('inventory')}
            className="w-full mt-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-xl text-xs font-bold transition-colors"
          >
            Manage All Inventory →
          </button>
        </div>
      </div>
    </div>
  );
};
