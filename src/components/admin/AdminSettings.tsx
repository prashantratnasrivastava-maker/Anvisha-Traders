import React, { useState } from 'react';
import {
  Check,
  CreditCard,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Store,
  KeyRound,
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminSettings: React.FC = () => {
  const { businessInfo, updateBusinessInfo, changeAdminPassword, isCloudOnline } = useStore();

  const [name, setName] = useState(businessInfo.name);
  const [contact, setContact] = useState(businessInfo.contact);
  const [address, setAddress] = useState(businessInfo.address);
  const [city, setCity] = useState(businessInfo.city);
  const [pincode, setPincode] = useState(businessInfo.pincode);
  const [state, setState] = useState(businessInfo.state);
  const [gstin, setGstin] = useState(businessInfo.gstin);
  const [upiId, setUpiId] = useState(businessInfo.upiId);
  const [tagline, setTagline] = useState(businessInfo.tagline);
  const [bannerNotice, setBannerNotice] = useState(businessInfo.bannerNotice);
  const [isSaved, setIsSaved] = useState(false);

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessInfo({
      name,
      contact,
      address,
      city,
      pincode,
      state,
      gstin,
      upiId,
      tagline,
      bannerNotice,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-black text-neutral-900 font-display">
          Store Details &amp; Business Profile
        </h2>
        <p className="text-xs text-neutral-500">
          Edit physical store address, contact helpline, GSTIN tax registration and payment IDs. All changes immediately sync across Customer storefront &amp; Tax invoices.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 space-y-5">
        {/* Core details */}
        <div>
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-[#ff5722]" />
            <span>Store Identity &amp; Contact</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Store Business Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Contact Phone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Physical Address */}
        <div className="pt-4 border-t border-neutral-100">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#ff5722]" />
            <span>Physical Address (Pachrukhi, Siwan)</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Full Street &amp; Building Address *
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  City / Town *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tax and Payments */}
        <div className="pt-4 border-t border-neutral-100">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-[#ff5722]" />
            <span>Taxation &amp; UPI Payment Config</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                GSTIN Registration Number *
              </label>
              <input
                type="text"
                required
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none uppercase font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Store UPI VPA / QR ID *
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Notices */}
        <div className="pt-4 border-t border-neutral-100">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
            Customer Announcement Notice
          </h3>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">
              Top Announcement Banner Message
            </label>
            <input
              type="text"
              value={bannerNotice}
              onChange={(e) => setBannerNotice(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            Last updated store profile info
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Store Info Updated!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Details</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Internet Cloud Connection & Firebase Sync Status */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isCloudOnline ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              {isCloudOnline ? <Wifi className="w-5 h-5 animate-pulse" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-black text-neutral-900 font-display flex items-center gap-2">
                <span>Firebase Cloud Database &amp; Internet Status</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isCloudOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {isCloudOnline ? 'ONLINE & SYNCED' : 'OFFLINE MODE'}
                </span>
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Dono portal (Customer storefront aur Admin management) live internet cloud se jude hue hain. Real-time orders, OTP authentication, aur password updates turant sync hote hain.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Password Change Security Box */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 space-y-4">
        <div>
          <h3 className="text-sm font-black text-neutral-900 font-display flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#ff5722]" />
            <span>Admin Password Change (Security Settings)</span>
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Aap apna Admin secret login password yahan se kabhi bhi badal sakte hain. Naya password turant cloud par save hoga.
          </p>
        </div>

        {passError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            {passError}
          </div>
        )}

        {passSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{passSuccess}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPassError('');
            setPassSuccess('');

            if (newPassword !== confirmPassword) {
              setPassError('Naya password aur confirm password aapas mein match nahi kar rahe!');
              return;
            }

            const res = changeAdminPassword(oldPassword, newPassword);
            if (res.success) {
              setPassSuccess(res.message);
              setOldPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setTimeout(() => setPassSuccess(''), 4000);
            } else {
              setPassError(res.message);
            }
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showOldPass ? 'text' : 'password'}
                  required
                  placeholder="e.g. 123ABCD"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-9 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPass(!showOldPass)}
                  className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600"
                >
                  {showOldPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-9 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600"
                >
                  {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Confirm New Password *
              </label>
              <input
                type={showNewPass ? 'text' : 'password'}
                required
                placeholder="Re-type new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-orange-400" />
              <span>Update Admin Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
