import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Printer,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminReports: React.FC = () => {
  const { orders, businessInfo } = useStore();
  const [timeRange, setTimeRange] = useState<'today' | 'yesterday' | 'week' | 'month' | 'all'>('today');

  const now = new Date();
  const todayStr = now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    if (timeRange === 'today') {
      return orderDate.toDateString() === todayStr;
    }
    if (timeRange === 'yesterday') {
      return orderDate.toDateString() === yesterdayStr;
    }
    if (timeRange === 'week') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
      return orderDate >= sevenDaysAgo;
    }
    if (timeRange === 'month') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
      return orderDate >= thirtyDaysAgo;
    }
    return true;
  });

  const validOrders = filteredOrders.filter((o) => o.status !== 'cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalTax = validOrders.reduce((sum, o) => sum + o.taxAmount, 0);
  const totalUnits = validOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );
  const avgOrderValue = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-neutral-900 font-display">
            Daily Sales &amp; Revenue Analytics
          </h2>
          <p className="text-xs text-neutral-500">
            Real-time daily transaction summaries, tax calculations, and printable store balance sheet
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Print Report */}
          <button
            onClick={handlePrintReport}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Daily Report</span>
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white p-3 rounded-2xl border border-neutral-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1 mr-2">
          Date Scope:
        </span>
        {[
          { key: 'today', label: 'Today (Live)' },
          { key: 'yesterday', label: 'Yesterday' },
          { key: 'week', label: 'Past 7 Days' },
          { key: 'month', label: 'This Month' },
          { key: 'all', label: 'All Time' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTimeRange(tab.key as typeof timeRange)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              timeRange === tab.key
                ? 'bg-[#ff5722] text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
            Net Sales Revenue
          </span>
          <span className="text-2xl font-black text-neutral-900 tabular-nums font-display mt-2 block">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {validOrders.length} valid orders
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
            Units Sold
          </span>
          <span className="text-2xl font-black text-[#ff5722] tabular-nums font-display mt-2 block">
            {totalUnits} Units
          </span>
          <span className="text-[11px] text-neutral-500">Total items packaged</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
            Average Order Value
          </span>
          <span className="text-2xl font-black text-neutral-900 tabular-nums font-display mt-2 block">
            ₹{Math.round(avgOrderValue).toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-neutral-500">Per customer cart</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
            GST Collected (5%)
          </span>
          <span className="text-2xl font-black text-blue-600 tabular-nums font-display mt-2 block">
            ₹{totalTax.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-blue-700">Tax liability recorded</span>
        </div>
      </div>

      {/* Detailed Orders Breakdown Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            Daily Transaction Journal ({filteredOrders.length} records)
          </span>
          <span className="text-xs text-neutral-500 font-medium">
            Store: {businessInfo.name} · Pachrukhi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white border-b border-neutral-200 text-neutral-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Date / Time</th>
                <th className="p-3.5">Customer &amp; Phone</th>
                <th className="p-3.5">Items</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Grand Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400">
                    No transactions found for the selected time range.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="p-3.5 font-bold text-neutral-900">#{order.id}</td>
                    <td className="p-3.5 text-neutral-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-neutral-900 block">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-neutral-400 tabular-nums">
                        {order.customerPhone}
                      </span>
                    </td>
                    <td className="p-3.5 text-neutral-600 max-w-xs truncate">
                      {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                    </td>
                    <td className="p-3.5 uppercase font-medium text-neutral-700">
                      {order.paymentMethod} ({order.paymentStatus})
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-orange-100 text-[#ff5722]'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-extrabold text-neutral-900 tabular-nums">
                      ₹{order.grandTotal.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredOrders.length > 0 && (
              <tfoot className="bg-neutral-50 border-t border-neutral-200 font-bold text-neutral-900">
                <tr>
                  <td colSpan={6} className="p-3.5 text-right uppercase text-xs">
                    Total Revenue:
                  </td>
                  <td className="p-3.5 text-right text-base text-[#ff5722] tabular-nums font-black">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
