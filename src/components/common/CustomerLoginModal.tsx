import React, { useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  X,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CustomerLoginModal: React.FC = () => {
  const {
    showCustomerLoginModal,
    setShowCustomerLoginModal,
    sendCustomerOtp,
    verifyCustomerOtpAndLogin,
    currentCustomer,
  } = useStore();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [name, setName] = useState(currentCustomer.name || '');
  const [phone, setPhone] = useState(currentCustomer.phone || '');
  const [address, setAddress] = useState(currentCustomer.address || '');
  const [otp, setOtp] = useState('');
  const [sentOtpDebug, setSentOtpDebug] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!showCustomerLoginModal) return null;

  // Step 1: Request & Generate Real OTP for phone number
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Kripya sahi 10-digit mobile number enter karein.');
      return;
    }

    setLoading(true);
    const res = await sendCustomerOtp(cleanPhone);
    setLoading(false);

    if (res.success) {
      setStep('otp');
      setSentOtpDebug(res.otp || null);
      setSuccessMsg(`OTP safaltapoorvak mobile number +91 ${cleanPhone} par generate ho gaya hai!`);
    } else {
      setError(res.message);
    }
  };

  // Step 2: Verify Entered OTP and Sign in
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Kripya 6-digit OTP code enter karein.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const ok = verifyCustomerOtpAndLogin(
        phone,
        otp.trim(),
        name.trim() || 'Customer',
        address.trim() || 'Pachrukhi, Siwan'
      );
      setLoading(false);

      if (ok) {
        setShowCustomerLoginModal(false);
        setStep('phone');
        setOtp('');
        setError('');
        setSuccessMsg('');
      } else {
        setError('Galat OTP! Kripya SMS / Notification mein aaya hua sahi 6-digit code dalein.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#ff5722] to-[#ff7043] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight font-display">
                Customer Mobile Login
              </h3>
              <p className="text-[11px] text-white/80">
                100% Secure OTP Verification
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowCustomerLoginModal(false);
              setStep('phone');
              setError('');
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5">
          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleRequestOtp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Aapka Pura Naam (Customer Name)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prashant Srivastava"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 hover:bg-white focus:bg-white text-xs font-semibold rounded-xl border border-neutral-200 focus:border-[#ff5722] focus:ring-2 focus:ring-[#ff5722]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Mobile Number (Jispe OTP Aayega) *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-neutral-500 pointer-events-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="7000455037"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-3 py-2.5 bg-neutral-50 hover:bg-white focus:bg-white text-xs font-semibold rounded-xl border border-neutral-200 focus:border-[#ff5722] focus:ring-2 focus:ring-[#ff5722]/20 outline-none transition-all tabular-nums font-mono text-sm"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Aapke is mobile number par 6-digit OTP verification code aayega.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Delivery Address (Pachrukhi / Siwan)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Pachrukhi, Siwan Bihar"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 hover:bg-white focus:bg-white text-xs font-semibold rounded-xl border border-neutral-200 focus:border-[#ff5722] focus:ring-2 focus:ring-[#ff5722]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#ff5722] hover:bg-[#f4511e] active:scale-[0.99] text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Generating OTP...</span>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span>Generate &amp; Send OTP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-center">
                <span className="text-[11px] text-neutral-500 block">OTP Sent to Mobile Number:</span>
                <span className="text-sm font-extrabold text-neutral-900 font-mono tracking-wider">
                  +91 {phone}
                </span>
                {sentOtpDebug && (
                  <div className="mt-2 py-1 px-2.5 bg-orange-100 border border-orange-200 rounded-lg inline-flex items-center gap-1.5 text-xs text-[#ff5722] font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Your OTP: {sentOtpDebug}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 text-center">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  autoFocus
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full py-3 bg-neutral-50 hover:bg-white focus:bg-white text-center text-xl font-black tracking-widest rounded-xl border-2 border-neutral-200 focus:border-[#ff5722] focus:ring-2 focus:ring-[#ff5722]/20 outline-none transition-all tabular-nums font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#ff5722] hover:bg-[#f4511e] active:scale-[0.99] text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <span>Verifying OTP...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify OTP &amp; Login</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-1 text-neutral-500">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="hover:text-neutral-900 font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Change Number</span>
                </button>
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="text-[#ff5722] hover:underline font-bold"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
