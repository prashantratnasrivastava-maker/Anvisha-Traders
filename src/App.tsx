/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { ToastNotification } from './components/common/ToastNotification';
import { CustomerHome } from './components/customer/CustomerHome';
import { CustomerShorts } from './components/customer/CustomerShorts';
import { CustomerCart } from './components/customer/CustomerCart';
import { CustomerOrders } from './components/customer/CustomerOrders';
import { CustomerProfile } from './components/customer/CustomerProfile';
import { CustomerBottomNav } from './components/customer/CustomerBottomNav';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { AdminHeader } from './components/admin/AdminHeader';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminShorts } from './components/admin/AdminShorts';
import { AdminCategories } from './components/admin/AdminCategories';
import { AdminInventory } from './components/admin/AdminInventory';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminReports } from './components/admin/AdminReports';
import { AdminSettings } from './components/admin/AdminSettings';
import { InvoiceModal } from './components/invoice/InvoiceModal';
import { AdminLoginModal } from './components/common/AdminLoginModal';
import { CustomerLoginModal } from './components/common/CustomerLoginModal';

const MainApp: React.FC = () => {
  const { activeRole, customerTab, adminTab } = useStore();

  return (
    <div className="min-h-screen bg-[#f8f8f9] text-neutral-900 flex flex-col font-sans">
      {/* Universal Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeRole === 'customer' ? (
          <div className="w-full">
            {customerTab === 'home' && <CustomerHome />}
            {customerTab === 'shorts' && <CustomerShorts />}
            {customerTab === 'cart' && <CustomerCart />}
            {customerTab === 'orders' && <CustomerOrders />}
            {customerTab === 'profile' && <CustomerProfile />}

            {/* Bottom Nav for mobile/customer ergonomics */}
            <CustomerBottomNav />

            {/* Product Quick View Modal */}
            <ProductDetailModal />
          </div>
        ) : (
          <div className="w-full pb-16">
            {/* Admin sub-header navigation */}
            <AdminHeader />

            {/* Admin Tab Views */}
            {adminTab === 'dashboard' && <AdminDashboard />}
            {adminTab === 'products' && <AdminProducts />}
            {adminTab === 'shorts' && <AdminShorts />}
            {adminTab === 'categories' && <AdminCategories />}
            {adminTab === 'inventory' && <AdminInventory />}
            {adminTab === 'orders' && <AdminOrders />}
            {adminTab === 'customers' && <AdminCustomers />}
            {adminTab === 'reports' && <AdminReports />}
            {adminTab === 'settings' && <AdminSettings />}
          </div>
        )}
      </main>

      {/* Official GST Tax Invoice Generator & Viewer Modal */}
      <InvoiceModal />

      {/* Security Login Modals */}
      <AdminLoginModal />
      <CustomerLoginModal />

      {/* Floating Real-time Notification Toast */}
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
