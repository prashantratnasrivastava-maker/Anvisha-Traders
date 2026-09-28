import React, { useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  X,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  MessageCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CustomerLoginModal: React.FC = () => {
  const {
    showCustomerLoginModal,
    setShowCustomerLoginModal,
    submitCustomerLoginRequest,
    checkCustomerStatus,
    currentCustomer,
    businessInfo,
  } = useStore();

  const [name, setName] = useState(currentCustomer.name || '');
  const [phone, setPhone] = useState(currentCustomer.phone || '');
  const [address, setAddress] = useState(currentCustomer.address || 'Pachrukhi, Siwan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusResult, setStatusResult] = useState<'idle' | 'approved' | 'pending' | 'rejected' | 'blocked'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  if (!showCustomerLoginModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Kripya sahi 10-digit mobile number enter karein (e.g. 9835012345).');
      return;
    }

    if (!name.trim()) {
      setError('Kripya apna poora naam enter karein.');
      return;
    }

    setLoading(true);

    try {
      const res = await submitCustomerLoginRequest(name, cleanPhone, address);
      setStatusResult(res.status);
      setStatusMessage(res.message);

      if (res.status === 'approved') {
        // Close modal after 1.5 seconds so user sees approval confirmation
        setTimeout(() => {
          setShowCustomerLoginModal(false);
        }, 1500);
      }
    } catch (err: any) {
      setError('Server se judne me samasya aayi. Kripya punah prayas karein.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecheckStatus = async () => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Pehle apna 10-digit phone number enter karein.');
      return;
    }

    setLoading(true);
    setError('');
    const status = await checkCustomerStatus(cleanPhone);
    setLoading(false);

    if (status === 'approved') {
      setStatusResult('approved');
      setStatusMessage('Mubarak ho! Dukan Admin ne aapka account approve kar diya hai. Ab aap login ho gaye hain!');
      setTimeout(() => {
        setShowCustomerLoginModal(false);
      }, 1500);
    } else if (status === 'pending') {
      setStatusResult('pending');
      setStatusMessage('Aapki request abhi Admin ke paas pending hai. Kripya thoda intezar karein ya dukan par WhatsApp karein.');
    } else if (status === 'rejected' || status === 'blocked') {
      setStatusResult('rejected');
      setStatusMessage('Aapka account verify nahi ho saka hai. Dukan par baat karein.');
    } else {
      setError('Is number se abhi tak koi request nahi mili hai. Niche "Request Access" karein.');
    }
  };

  const handleOpenDukanWhatsApp = () => {
    const cleanAdminPhone = (businessInfo.contact || '7000455037').replace(/[^0-9]/g, '');
    const cleanCustPhone = phone.replace(/[^0-9]/g, '');
    const text = `Namaste Anvisha Traders, maine online store par registration request bheji hai.\nNaam: ${name || 'Customer'}\nMobile: ${cleanCustPhone}\nGaon/Address: ${address}\nKripya mera account approve kar dijiye taaki main order kar sakun.`;
    window.open(`https://wa.me/91${cleanAdminPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="p-5 bg-gradient-to-r from-[#ff5722] to-[#ff7043] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight font-display">
                Customer Sign In / Registration
              </h3>
              <p className="text-[11px] text-orange-100">
                {businessInfo.name} · Pachrukhi, Siwan
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCustomerLoginModal(false)}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Status Alert if submitted */}
          {statusResult === 'approved' && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Account Approved &amp; Active! 🎉</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                {statusMessage || 'Aapka account safalta-poorvak verify ho gaya hai. Aap dukan se online shopping kar sakte hain.'}
              </p>
            </div>
          )}

          {statusResult === 'pending' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2.5 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                <span>Request Sent: Approval Pending ⏳</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {statusMessage}
              </p>
              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRecheckStatus}
                  disabled={loading}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all disabled:opacity-50"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Check Status Now</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenDukanWhatsApp}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Dukan par WhatsApp karein</span>
                </button>
              </div>
            </div>
          )}

          {statusResult === 'rejected' && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Verification Not Completed</span>
              </div>
              <p className="text-[11px] text-red-700 leading-relaxed">
                {statusMessage}
              </p>
              <button
                type="button"
                onClick={handleOpenDukanWhatsApp}
                className="px-3 py-1.5 bg-neutral-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contact Dukan: {businessInfo.contact}</span>
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Aapka Poora Naam (Full Name) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:border-[#ff5722] focus:ring-1 focus:ring-[#ff5722] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Aapka Mobile Number (10-Digit) *
              </label>
              <div className="relative flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-neutral-200 bg-neutral-100 text-neutral-600 text-xs font-bold">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  className="flex-1 px-3 py-2.5 text-xs bg-neutral-50 rounded-r-xl border border-neutral-200 focus:bg-white focus:border-[#ff5722] focus:ring-1 focus:ring-[#ff5722] outline-none font-mono"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">
                Koyi OTP nahi aayega. Seedha dukan admin verify karke approve karega.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Gaon / Delivery Address (Pachrukhi, Siwan) *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Near Shiv Mandir, Harpur, Pachrukhi"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:border-[#ff5722] focus:ring-1 focus:ring-[#ff5722] outline-none resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || statusResult === 'approved'}
              className="w-full py-3 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Request Bheji Jaa Rahi Hai...' : 'Login / Submit Request'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Check if already registered */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-500">Pehle se request bheja hai?</span>
            <button
              type="button"
              onClick={handleRecheckStatus}
              disabled={loading}
              className="text-[#ff5722] hover:underline font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Approval Status Check Karein</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
