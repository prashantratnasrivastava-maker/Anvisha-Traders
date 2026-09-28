import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  Lock,
  LogOut,
  MapPin,
  Mic,
  Phone,
  Search,
  SlidersHorizontal,
  Smartphone,
  Store,
  User,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PWAInstallModal } from './PWAInstallModal';

export const Header: React.FC = () => {
  const {
    businessInfo,
    activeRole,
    setActiveRole,
    customerTab,
    setCustomerTab,
    adminTab,
    setAdminTab,
    cartItemCount,
    searchQuery,
    setSearchQuery,
    notifications,
    unreadCountForCustomer,
    unreadCountForAdmin,
    markNotificationAsRead,
    markAllAsRead,
    setSelectedOrderForTracking,
    orders,
    isAdminAuthenticated,
    logoutAdmin,
    setShowAdminLoginModal,
    currentCustomer,
    setShowCustomerLoginModal,
    logoutCustomer,
    isCloudOnline,
  } = useStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showVoiceSearchPrompt, setShowVoiceSearchPrompt] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const unreadCount = activeRole === 'admin' ? unreadCountForAdmin : unreadCountForCustomer;
  const filteredNotifications = notifications.filter((n) => {
    if (activeRole === 'admin') {
      return n.recipient === 'admin' || n.recipient === 'both';
    }
    return n.recipient === 'customer' || n.recipient === 'both';
  });

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.orderId) {
      const order = orders.find((o) => o.id === notif.orderId);
      if (order) {
        setSelectedOrderForTracking(order);
        if (activeRole === 'customer') {
          setCustomerTab('orders');
        } else {
          setAdminTab('orders');
        }
      }
    }
    setShowNotifications(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Top micro announcement bar */}
      <div className="bg-neutral-900 text-neutral-100 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-[#ff7043]">{businessInfo.name}</span>
          <span className="hidden sm:inline text-neutral-400">·</span>
          <span className="hidden sm:inline text-neutral-300 truncate">
            {businessInfo.address}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {/* Live Internet Cloud Sync Indicator */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isCloudOnline
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}
            title={isCloudOnline ? 'Connected to Firebase Cloud Database (Live Online)' : 'Offline mode'}
          >
            {isCloudOnline ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span>Cloud Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-red-400" />
                <span>Offline</span>
              </>
            )}
          </div>
          <span className="text-neutral-600 hidden sm:inline">|</span>
          <a
            href={`tel:${businessInfo.contact}`}
            className="flex items-center gap-1 text-neutral-300 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3 text-[#ff7043]" />
            <span className="tabular-nums">{businessInfo.contact}</span>
          </a>
          <span className="text-neutral-600">|</span>
          <button
            onClick={() => setShowInstallModal(true)}
            className="flex items-center gap-1 text-[#ff7043] hover:text-white font-semibold text-[11px] transition-colors bg-white/10 px-2 py-0.5 rounded-full"
            title="Download App & Publish to Play Store"
          >
            <Download className="w-3 h-3" />
            <span>Download App</span>
          </button>
          <span className="text-neutral-600">|</span>
          {/* Customer Login / User status pill */}
          {activeRole === 'customer' && (
            <>
              {currentCustomer.isLoggedIn ? (
                <button
                  onClick={() => setShowCustomerLoginModal(true)}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all"
                  title="Aapka Customer Profile"
                >
                  <User className="w-3 h-3 text-emerald-400" />
                  <span className="truncate max-w-[110px]">{currentCustomer.name}</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowCustomerLoginModal(true)}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ff5722] hover:bg-[#f4511e] text-white shadow-sm transition-all"
                  title="Customer Login with OTP"
                >
                  <User className="w-3 h-3" />
                  <span>Customer Login</span>
                </button>
              )}
              <span className="text-neutral-600">|</span>
            </>
          )}

          {/* Role Switcher Pill with Passcode Lock */}
          {activeRole === 'admin' ? (
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ff5722] text-white flex items-center gap-1 shadow-sm">
                <Store className="w-3 h-3" />
                <span>Admin: 7000455037</span>
              </span>
              <button
                onClick={logoutAdmin}
                className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-600/80 hover:bg-red-600 text-white flex items-center gap-1 transition-colors"
                title="Admin Logout"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  setActiveRole('admin');
                } else {
                  setShowAdminLoginModal(true);
                }
              }}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1.5 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
              title="Admin Login - Password Protected"
            >
              <Lock className="w-3 h-3 text-[#ff7043]" />
              <span>Admin Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand mark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (activeRole === 'customer') {
                setCustomerTab('home');
              } else {
                setAdminTab('dashboard');
              }
            }}
            className="text-left group"
          >
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Anvisha Traders Logo"
                className="w-10 h-10 object-contain rounded-xl shadow-sm border border-neutral-200 bg-white p-0.5 group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="text-lg font-extrabold tracking-tight text-neutral-900 group-hover:text-[#ff5722] transition-colors font-display block leading-tight">
                  {businessInfo.name}
                </span>
                <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#ff5722]" />
                  Pachrukhi, Siwan
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Search Bar - styled exactly like the reference screenshot */}
        {activeRole === 'customer' && (
          <div className="flex-1 max-w-xl mx-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or ask a question..."
                className="w-full pl-9 pr-16 py-2 bg-neutral-100 hover:bg-neutral-50 focus:bg-white text-sm rounded-full border border-neutral-200 focus:border-[#ff5722] focus:ring-2 focus:ring-[#ff5722]/20 transition-all outline-none"
              />
              <div className="absolute right-2 flex items-center gap-1 text-neutral-400">
                <button
                  type="button"
                  onClick={() => setShowVoiceSearchPrompt(true)}
                  className="p-1 hover:text-[#ff5722] rounded-full transition-colors"
                  title="Voice Search"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 hover:text-neutral-700 rounded-full transition-colors"
                  title="Clear / Scan"
                >
                  {searchQuery ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#ff5722] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-neutral-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-neutral-900">
                      {activeRole === 'admin' ? 'Admin Notifications' : 'Your Notifications'}
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] bg-orange-100 text-[#ff5722] px-2 py-0.5 rounded-full font-medium">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => markAllAsRead(activeRole)}
                    className="text-xs text-[#ff5722] hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-neutral-400">
                      No notifications yet
                    </div>
                  ) : (
                    filteredNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3 text-left transition-colors cursor-pointer hover:bg-neutral-50 ${
                          !notif.read ? 'bg-orange-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-neutral-900 leading-snug">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                        {notif.orderId && (
                          <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[#ff5722]">
                            <span>Track Order #{notif.orderId}</span>
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-neutral-50 border-t border-neutral-100 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-neutral-500 hover:text-neutral-800 font-medium"
                  >
                    Close panel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Role specific quick action */}
          {activeRole === 'customer' ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setShowCustomerLoginModal(true)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  currentCustomer.isLoggedIn
                    ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-800'
                    : 'bg-[#ff5722] hover:bg-[#f4511e] border-[#ff5722] text-white shadow-sm shadow-orange-500/20'
                }`}
                title={currentCustomer.isLoggedIn ? 'Customer Profile' : 'Customer Login'}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {currentCustomer.isLoggedIn ? currentCustomer.name.split(' ')[0] : 'Customer Login'}
                </span>
                <span className="sm:hidden">
                  {currentCustomer.isLoggedIn ? 'Account' : 'Login'}
                </span>
              </button>

              <button
                onClick={() => setCustomerTab('cart')}
                className="relative flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-full text-xs font-semibold transition-all"
              >
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#ff5722] text-white text-[11px] font-bold flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdminTab('orders')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-all"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Admin Center</span>
            </button>
          )}
        </div>
      </div>

      {/* Voice Search simulation modal */}
      {showVoiceSearchPrompt && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 bg-orange-100 text-[#ff5722] rounded-full mx-auto flex items-center justify-center mb-4 animate-pulse">
              <Mic className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">Listening to your search...</h3>
            <p className="text-xs text-neutral-500 mt-1">
              e.g., &quot;Kurti&quot;, &quot;Sweatshirt&quot;, &quot;Almonds&quot;, &quot;Spices&quot;
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {['Kurti', 'Sweatshirt', 'Almonds', 'Mustard Oil'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    setShowVoiceSearchPrompt(false);
                  }}
                  className="px-3 py-1 rounded-full text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
                >
                  &quot;{term}&quot;
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowVoiceSearchPrompt(false)}
              className="mt-6 w-full py-2 bg-neutral-900 text-white text-xs font-medium rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* PWA Download & Store Publishing Instructions Modal */}
      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </header>
  );
};
