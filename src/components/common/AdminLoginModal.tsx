import React, { useState } from 'react';
import { Lock, Phone, KeyRound, ShieldAlert, CheckCircle2, Store, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLoginModal: React.FC = () => {
  const { showAdminLoginModal, setShowAdminLoginModal, loginAdmin } = useStore();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showAdminLoginModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = loginAdmin(phone.trim(), password);
      if (success) {
        setShowAdminLoginModal(false);
        setPhone('');
        setPassword('');
        setError('');
      } else {
        setError('Galat Phone Number ya Password! Sirf authorised owner login kar sakta hai.');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 p-6 text-white text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-[#ff5722] text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/30">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black tracking-tight font-display">
            Admin Store Login
          </h3>
          <p className="text-xs text-neutral-300 mt-1">
            Anvisha Traders Management Portal
          </p>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold">
            🔒 Protected Owner Area
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-start gap-2 animate-shake">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Admin Mobile Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="7000455037"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 hover:bg-white focus:bg-white text-sm font-semibold rounded-xl border border-neutral-200 focus:border-[#ff5722] focus:ring-2 focus:ring-[#ff5722]/20 outline-none transition-all tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Secret Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-neutral-50 hover:bg-white focus:bg-white text-sm font-semibold rounded-xl border border-neutral-200 focus:border-[#ff5722] focus:ring-2 focus:ring-[#ff5722]/20 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#ff5722] hover:bg-[#f4511e] active:scale-[0.99] text-white rounded-xl text-sm font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Checking credentials...</span>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                setShowAdminLoginModal(false);
                setError('');
              }}
              className="text-xs text-neutral-500 hover:text-neutral-800 font-semibold"
            >
              Back to Customer Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
