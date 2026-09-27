import React from 'react';
import { Bell, CheckCircle2, ChevronRight, Package, Truck, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ToastNotification: React.FC = () => {
  const {
    activeToast,
    dismissToast,
    setSelectedOrderForTracking,
    orders,
    activeRole,
    setCustomerTab,
    setAdminTab,
  } = useStore();

  if (!activeToast) return null;

  const handleClick = () => {
    if (activeToast.orderId) {
      const order = orders.find((o) => o.id === activeToast.orderId);
      if (order) {
        setSelectedOrderForTracking(order);
        if (activeRole === 'customer') {
          setCustomerTab('orders');
        } else {
          setAdminTab('orders');
        }
      }
    }
    dismissToast();
  };

  const getIcon = () => {
    if (activeToast.type === 'order_status') {
      return <Truck className="w-5 h-5 text-emerald-600" />;
    }
    if (activeToast.type === 'order_placed') {
      return <Package className="w-5 h-5 text-[#ff5722]" />;
    }
    return <Bell className="w-5 h-5 text-amber-500" />;
  };

  return (
    <div className="fixed top-16 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-4 duration-200">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-neutral-200/80 p-3.5 flex items-start gap-3">
        <div className="p-2 bg-neutral-100 rounded-xl shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1 cursor-pointer" onClick={handleClick}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900 leading-tight">
              {activeToast.title}
            </span>
            <span className="text-[10px] text-neutral-400">now</span>
          </div>
          <p className="text-xs text-neutral-600 mt-0.5 line-clamp-2 leading-relaxed">
            {activeToast.message}
          </p>
          {activeToast.orderId && (
            <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#ff5722]">
              <span>View Order #{activeToast.orderId}</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          )}
        </div>
        <button
          onClick={dismissToast}
          className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
