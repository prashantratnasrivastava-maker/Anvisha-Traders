import React, { useState } from 'react';
import {
  Award,
  ChevronRight,
  CreditCard,
  Download,
  ExternalLink,
  History,
  Info,
  Lock,
  LogOut,
  MapPin,
  Phone,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Store,
  User,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PWAInstallModal } from '../common/PWAInstallModal';

export const CustomerProfile: React.FC = () => {
  const {
    businessInfo,
    setCustomerTab,
    setActiveRole,
    orders,
    currentCustomer,
    setShowCustomerLoginModal,
    logoutCustomer,
    isAdminAuthenticated,
    setShowAdminLoginModal,
  } = useStore();
  const [showInstallModal, setShowInstallModal] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="pb-28 max-w-2xl mx-auto px-4 pt-3">
      {/* User profile header matching screen 3 */}
      <div className="flex items-center gap-3.5 mb-5 p-4 bg-white rounded-3xl border border-neutral-200/80 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ff5722] to-[#ffab91] flex items-center justify-center text-white text-xl font-bold shadow-md shadow-orange-500/20">
          {getInitials(currentCustomer.name || 'Customer')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-neutral-900 truncate">
              {currentCustomer.name}
            </h3>
            {currentCustomer.status === 'approved' ? (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified &amp; Approved
              </span>
            ) : currentCustomer.status === 'pending' ? (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                Pending Approval
              </span>
            ) : (
              <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-full">
                Guest Customer
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
            <Phone className="w-3 h-3 text-neutral-400" />
            <span className="tabular-nums">{currentCustomer.phone || '7000455037'}</span>
            <span>·</span>
            <span className="truncate">{currentCustomer.address || 'Pachrukhi, Siwan'}</span>
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5">
          {currentCustomer.isLoggedIn ? (
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={() => setShowCustomerLoginModal(true)}
                className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl transition-colors"
              >
                Switch User
              </button>
              <button
                onClick={logoutCustomer}
                className="text-[10px] text-red-600 hover:underline font-semibold"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCustomerLoginModal(true)}
              className="px-3.5 py-1.5 text-xs font-bold bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-xl shadow-sm transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Anvisha Pay / Club Card - Exactly matching the virtual card in Screen 3 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ffedd5] via-[#fed7aa] to-[#fb923c] p-6 shadow-md border border-orange-300/40 mb-5 text-neutral-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black tracking-tight font-display text-[#c2410c]">
              Anvisha<span className="text-neutral-900">Club</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest bg-white/60 px-1.5 py-0.5 rounded">
              VIP
            </span>
          </div>
          <span className="text-sm font-black italic tracking-wider text-neutral-900">
            PAY / REWARDS
          </span>
        </div>

        <div className="my-5">
          <p className="text-xs text-neutral-700 uppercase tracking-widest font-mono">
            Card Number
          </p>
          <p className="text-lg font-mono font-bold tracking-widest text-neutral-900 tabular-nums">
            **** **** 3463 2387
          </p>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-orange-300/60">
          <div>
            <span className="text-[10px] text-neutral-600 block uppercase">Member Name</span>
            <span className="font-bold">Prashant Srivastava</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-600 block uppercase">Valid Thru</span>
            <span className="font-bold font-mono">08/2028</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-600 block uppercase">Balance</span>
            <span className="font-bold text-[#c2410c]">₹1,250 Pts</span>
          </div>
        </div>
      </div>

      {/* 4 Action Cards Grid - Matches the exact 4 large cards in Screen 3 */}
      <div className="grid grid-cols-2 gap-3.5 mb-6">
        <button
          onClick={() => setCustomerTab('orders')}
          className="p-4 bg-white hover:bg-neutral-50 rounded-2xl border border-neutral-200/90 shadow-xs flex flex-col justify-between h-28 text-left transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">Your Orders</span>
            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-[#ff5722] transition-colors" />
          </div>
          <div>
            <span className="text-[11px] text-neutral-500 block">
              Track live &amp; invoices
            </span>
            <span className="text-xs font-bold text-[#ff5722] mt-0.5 inline-block">
              {orders.length} Orders ↗
            </span>
          </div>
        </button>

        <button
          onClick={() => setCustomerTab('orders')}
          className="p-4 bg-white hover:bg-neutral-50 rounded-2xl border border-neutral-200/90 shadow-xs flex flex-col justify-between h-28 text-left transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">Buy Again</span>
            <RotateCcw className="w-4 h-4 text-neutral-400 group-hover:text-[#ff5722] transition-colors" />
          </div>
          <div>
            <span className="text-[11px] text-neutral-500 block">
              Quick reorder favorites
            </span>
            <span className="text-xs font-bold text-neutral-700 mt-0.5 inline-block">
              Visit Buy Again ↗
            </span>
          </div>
        </button>

        <a
          href={`tel:${businessInfo.contact}`}
          className="p-4 bg-white hover:bg-neutral-50 rounded-2xl border border-neutral-200/90 shadow-xs flex flex-col justify-between h-28 text-left transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">Store Contact</span>
            <Phone className="w-4 h-4 text-neutral-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <div>
            <span className="text-[11px] text-neutral-500 block">
              Call {businessInfo.name}
            </span>
            <span className="text-xs font-bold text-emerald-600 mt-0.5 inline-block tabular-nums">
              {businessInfo.contact} ↗
            </span>
          </div>
        </a>

        <button
          onClick={() => {
            if (isAdminAuthenticated) {
              setActiveRole('admin');
            } else {
              setShowAdminLoginModal(true);
            }
          }}
          className="p-4 bg-white hover:bg-neutral-50 rounded-2xl border border-neutral-200/90 shadow-xs flex flex-col justify-between h-28 text-left transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">Admin Portal</span>
            <Lock className="w-4 h-4 text-neutral-400 group-hover:text-[#ff5722] transition-colors" />
          </div>
          <div>
            <span className="text-[11px] text-neutral-500 block">
              Protected Owner Area
            </span>
            <span className="text-xs font-bold text-[#ff5722] mt-0.5 inline-block">
              {isAdminAuthenticated ? 'Open Admin ⚙️' : 'Admin Login 🔒'}
            </span>
          </div>
        </button>
      </div>

      {/* Download App & Play Store Card */}
      <div className="p-4 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white rounded-3xl shadow-sm mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ff5722] text-white flex items-center justify-center shrink-0 shadow-md">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-display text-white">
              Download App / Publish to Play Store
            </h4>
            <p className="text-[11px] text-neutral-300">
              Direct Phone Install (PWA) &amp; Android Play Store APK/AAB link
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowInstallModal(true)}
          className="px-3.5 py-1.5 bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-bold rounded-xl shadow-sm whitespace-nowrap transition-transform active:scale-95"
        >
          Get Links
        </button>
      </div>

      {/* Official Store Address & Verified Details */}
      <div className="p-4 bg-white rounded-3xl border border-neutral-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-[#ff5722]" />
          <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            Official Store Details · {businessInfo.name}
          </h4>
        </div>

        <div className="space-y-2 text-xs text-neutral-600">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-800">Physical Store Address:</span>
              <p className="text-neutral-700 leading-relaxed">{businessInfo.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
            <div>
              <span className="font-semibold text-neutral-800">Direct Helpline: </span>
              <a
                href={`tel:${businessInfo.contact}`}
                className="text-[#ff5722] font-bold hover:underline tabular-nums"
              >
                {businessInfo.contact}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-semibold text-neutral-800">Registered GSTIN: </span>
              <span className="font-mono text-neutral-700">{businessInfo.gstin}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">Pachrukhi, Siwan (Bihar)</span>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Store Open Today
          </span>
        </div>
      </div>

      {/* PWA Install & Store Modal */}
      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
};
