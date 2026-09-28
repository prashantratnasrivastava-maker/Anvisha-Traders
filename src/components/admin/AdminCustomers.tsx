import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  MapPin,
  Calendar,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  MessageCircle,
  AlertTriangle,
  RefreshCw,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CustomerApprovalRequest } from '../../types';

export const AdminCustomers: React.FC = () => {
  const {
    customerApprovalRequests,
    approveCustomerRequest,
    rejectCustomerRequest,
    businessInfo,
  } = useStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState('');

  const filteredRequests = customerApprovalRequests.filter((req) => {
    // Filter by tab status
    if (activeFilter !== 'all' && req.status !== activeFilter) {
      return false;
    }
    // Filter by search query (name, phone, address)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = req.name.toLowerCase().includes(q);
      const matchPhone = req.phone.includes(q);
      const matchAddress = req.address.toLowerCase().includes(q);
      return matchName || matchPhone || matchAddress;
    }
    return true;
  });

  const pendingCount = customerApprovalRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = customerApprovalRequests.filter((r) => r.status === 'approved').length;
  const rejectedCount = customerApprovalRequests.filter((r) => r.status === 'rejected' || r.status === 'blocked').length;

  const handleOpenWhatsApp = (customerPhone: string, customerName: string, status: string) => {
    const clean = customerPhone.replace(/[^0-9]/g, '');
    let text = `Namaste ${customerName} ji! Main Anvisha Traders (Pachrukhi, Siwan) se baat kar raha hoon.`;
    if (status === 'approved') {
      text = `Namaste ${customerName} ji! 🎉 Aapka Anvisha Traders par customer account approve ho gaya hai. Ab aap app me login karke online grocery/cold drinks order place kar sakte hain! Dukan: Pachrukhi, Siwan.`;
    }
    window.open(`https://wa.me/91${clean}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleConfirmReject = (id: string) => {
    rejectCustomerRequest(id, customReason || 'Verification could not be confirmed');
    setRejectingId(null);
    setCustomReason('');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#ff5722] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 font-display">
                Customer Verification &amp; Approvals
              </h2>
              <p className="text-xs text-neutral-500">
                Grahak ka Name &amp; Mobile Number verify karke 1-click me Approve ya Reject karein
              </p>
            </div>
          </div>
        </div>

        {/* Quick Summary Pill Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending: {pendingCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Approved: {approvedCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-bold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-neutral-500" />
            <span>Total: {customerApprovalRequests.length}</span>
          </div>
        </div>
      </div>

      {/* Info Notice Box */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-white p-4 rounded-2xl border border-orange-200/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#ff5722] shrink-0 mt-0.5" />
        <div className="text-xs text-neutral-700 leading-relaxed">
          <strong className="text-neutral-900 font-semibold block mb-0.5">
            Aapki Dukan ka 100% Surakshit System:
          </strong>
          Koyi bhi naya customer apna Name, Phone aur Gaon/Address daal kar registration request bhejega. Jab tak aap yahan se <span className="font-bold text-emerald-700">Approve</span> nahi karenge, farzi ya anjaan log dukan par order nahi de payenge. Approve hone ke baad customer bina OTP ke turant dukan se shopping kar sakega!
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeFilter === 'all'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            All ({customerApprovalRequests.length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeFilter === 'pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>Pending</span>
            {pendingCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeFilter === 'pending' ? 'bg-amber-700 text-white' : 'bg-amber-200 text-amber-900'}`}>
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeFilter === 'approved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setActiveFilter('rejected')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeFilter === 'rejected'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, phone, village..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-neutral-300 focus:border-[#ff5722] focus:ring-1 focus:ring-[#ff5722] outline-none"
          />
        </div>
      </div>

      {/* Customer Requests Table / Cards */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 mb-1">
            Koyi Customer Request Nahi Mili
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {activeFilter === 'pending'
              ? 'Abhi koyi naya customer approval ke liye pending nahi hai. Sabhi verified hain!'
              : 'Aapke search filter ke mutabiq koyi customer request record nahi mila.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((req) => {
            const isPending = req.status === 'pending';
            const isApproved = req.status === 'approved';
            const isRejected = req.status === 'rejected' || req.status === 'blocked';

            return (
              <div
                key={req.id}
                className={`bg-white rounded-2xl border p-4 shadow-xs flex flex-col justify-between transition-all ${
                  isPending
                    ? 'border-amber-300 bg-amber-50/20 ring-1 ring-amber-200'
                    : isApproved
                    ? 'border-emerald-200'
                    : 'border-neutral-200 opacity-80'
                }`}
              >
                <div>
                  {/* Top Status & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isPending
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : isApproved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {isPending && <Clock className="w-3 h-3 text-amber-600 animate-spin" />}
                      {isApproved && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {isRejected && <XCircle className="w-3 h-3 text-red-600" />}
                      <span className="uppercase tracking-wider">
                        {isPending ? 'Pending Approval' : isApproved ? 'Approved & Active' : 'Rejected'}
                      </span>
                    </span>

                    <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(req.requestedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-2 mb-4">
                    <div>
                      <h4 className="text-base font-bold text-neutral-900 font-display">
                        {req.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-[#ff5722]" />
                        <span className="font-mono">{req.phone}</span>
                        <button
                          onClick={() => handleOpenWhatsApp(req.phone, req.name, req.status)}
                          className="ml-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold flex items-center gap-1 transition-colors"
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5 text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{req.address || 'Address provided on order'}</span>
                    </div>

                    {req.rejectionReason && (
                      <p className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                        Reason: {req.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-neutral-100 pt-3">
                  {isPending ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => approveCustomerRequest(req.id)}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Approve</span>
                        </button>

                        <button
                          onClick={() => setRejectingId(rejectingId === req.id ? null : req.id)}
                          className="px-3 py-2 bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-700 border border-neutral-200 hover:border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <UserX className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>

                      {/* Custom Reject Box */}
                      {rejectingId === req.id && (
                        <div className="p-3 bg-red-50 rounded-xl border border-red-200 space-y-2 animate-fadeIn">
                          <label className="text-[10px] font-bold text-red-800 uppercase block">
                            Rejection Reason (Optional):
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Unverified number or outside delivery area"
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            className="w-full text-xs p-2 rounded-lg border border-red-300 outline-none bg-white text-neutral-800"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setRejectingId(null)}
                              className="px-2 py-1 text-[11px] text-neutral-600 hover:underline"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleConfirmReject(req.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700"
                            >
                              Confirm Reject
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : isApproved ? (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Account Verified
                      </span>
                      <button
                        onClick={() => rejectCustomerRequest(req.id, 'Blocked by admin')}
                        className="text-[11px] text-neutral-400 hover:text-red-600 font-semibold"
                      >
                        Block / Revoke
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-red-600 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        Rejected / Blocked
                      </span>
                      <button
                        onClick={() => approveCustomerRequest(req.id)}
                        className="text-[11px] text-[#ff5722] hover:underline font-bold"
                      >
                        Re-Approve Account
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
