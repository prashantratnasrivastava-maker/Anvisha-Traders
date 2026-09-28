import React, { useState } from 'react';
import {
  BarChart3,
  Boxes,
  Clapperboard,
  Download,
  FileSpreadsheet,
  FolderTree,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Store,
  Truck,
  Users,
  LogOut,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PWAInstallModal } from '../common/PWAInstallModal';
import { AdminTab } from '../../types';

export const AdminHeader: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    setActiveRole,
    orders,
    products,
    shorts,
    businessInfo,
    logoutAdmin,
    pendingApprovalsCount,
  } = useStore();
  const [showInstallModal, setShowInstallModal] = useState(false);

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  const tabs: { id: AdminTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Boxes },
    { id: 'shorts', label: 'Video Shorts 🎬', icon: Clapperboard, badge: shorts.length },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'inventory', label: 'Inventory & Stock', icon: Package, badge: lowStockCount },
    { id: 'orders', label: 'Orders & Invoices', icon: Truck, badge: pendingOrdersCount },
    { id: 'customers', label: 'Customer Approvals', icon: Users, badge: pendingApprovalsCount },
    { id: 'reports', label: 'Daily Sales Report', icon: BarChart3 },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];


  return (
    <div className="bg-white border-b border-neutral-200 sticky top-[53px] z-30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top admin notice banner */}
        <div className="py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-neutral-900 font-display">
              {businessInfo.name} Management Portal
            </span>
            <span className="text-xs text-neutral-400">|</span>
            <span className="text-xs text-neutral-600">Pachrukhi, Siwan</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInstallModal(true)}
              className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#ff7043]" />
              <span>Download / Play Store Link</span>
            </button>
            <button
              onClick={() => setActiveRole('customer')}
              className="px-3 py-1 bg-orange-50 hover:bg-orange-100 text-[#ff5722] border border-orange-200 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Preview Customer Storefront</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
              title="Logout from Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation links */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-[#ff5722] text-white' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* PWA Download Modal */}
      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
};
