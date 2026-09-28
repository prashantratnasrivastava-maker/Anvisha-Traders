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
  Smartphone,
  Send,
  ExternalLink,
  Sparkles,
  Tag,
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
  // Offer Banner States
  const [offersEnabled, setOffersEnabled] = useState(businessInfo.offersEnabled ?? true);
  const [offerTag, setOfferTag] = useState(businessInfo.offerTag || 'Festive Mega Offer');
  const [offerHeading, setOfferHeading] = useState(businessInfo.offerHeading || 'Explore Complete Catalog & Festive Deals');
  const [offerSubheading, setOfferSubheading] = useState(businessInfo.offerSubheading || 'Special wholesale & retail discounts! Quality clothing, daily groceries & spices delivered in Pachrukhi & Siwan.');
  const [offerBadgeText, setOfferBadgeText] = useState(businessInfo.offerBadgeText || 'Flat Discounts & Bulk Savings');
  const [offerButtonText, setOfferButtonText] = useState(businessInfo.offerButtonText || 'Loot Lo / Explore Offers');
  const [offerDiscountPercent, setOfferDiscountPercent] = useState<number>(businessInfo.offerDiscountPercent ?? 15);
  const [fast2SmsApiKey, setFast2SmsApiKey] = useState(businessInfo.fast2SmsApiKey || '');
  const [smsGatewayEnabled, setSmsGatewayEnabled] = useState(businessInfo.smsGatewayEnabled ?? false);
  const [whatsappCloudApiEnabled, setWhatsappCloudApiEnabled] = useState(businessInfo.whatsappCloudApiEnabled ?? false);
  const [whatsappPhoneNumberId, setWhatsappPhoneNumberId] = useState(businessInfo.whatsappPhoneNumberId || '');
  const [whatsappAccessToken, setWhatsappAccessToken] = useState(businessInfo.whatsappAccessToken || '');
  const [whatsappTemplateName, setWhatsappTemplateName] = useState(businessInfo.whatsappTemplateName || '');
  const [testNumber, setTestNumber] = useState(businessInfo.contact || '7000455037');
  const [testingWhatsApp, setTestingWhatsApp] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const handleTestWhatsApp = async () => {
    if (!whatsappPhoneNumberId || !whatsappAccessToken) {
      setTestResult({ success: false, msg: 'Kripya pehle Phone Number ID aur Access Token enter karein.' });
      return;
    }
    setTestingWhatsApp(true);
    setTestResult(null);

    const clean = testNumber.replace(/[^0-9]/g, '');
    try {
      const metaApiUrl = `https://graph.facebook.com/v20.0/${whatsappPhoneNumberId.trim()}/messages`;
      const payload = whatsappTemplateName.trim()
        ? {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: `91${clean}`,
            type: 'template',
            template: {
              name: whatsappTemplateName.trim(),
              language: { code: 'en_US' },
              components: [
                { type: 'body', parameters: [{ type: 'text', text: '582914' }] }
              ]
            }
          }
        : {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: `91${clean}`,
            type: 'text',
            text: {
              preview_url: false,
              body: '🛒 Anvisha Traders Test OTP: 582914. Meta WhatsApp Cloud API is working perfectly!'
            }
          };

      const res = await fetch(metaApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whatsappAccessToken.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data?.messages?.length > 0) {
        setTestResult({ success: true, msg: `Message sent successfully to +91 ${clean}!` });
      } else {
        setTestResult({ success: false, msg: data?.error?.message || 'Meta API returned an error.' });
      }
    } catch (e: any) {
      setTestResult({ success: false, msg: e?.message || 'Network error connecting to Meta API.' });
    }
    setTestingWhatsApp(false);
  };

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
      offersEnabled,
      offerTag,
      offerHeading,
      offerSubheading,
      offerBadgeText,
      offerButtonText,
      offerDiscountPercent,
      fast2SmsApiKey,
      smsGatewayEnabled,
      whatsappCloudApiEnabled,
      whatsappPhoneNumberId,
      whatsappAccessToken,
      whatsappTemplateName,
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

        {/* Dukan Offers & Promotional Banner Section with ON/OFF Toggle */}
        <div className="pt-4 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#ff5722]" />
              <span>Customer Home Offer Banner (Festive &amp; Sale Offers)</span>
            </h3>

            {/* ON / OFF Toggle Switch */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${offersEnabled ? 'text-emerald-700' : 'text-neutral-400'}`}>
                {offersEnabled ? 'Offer Live (ON)' : 'Offer Hidden (OFF)'}
              </span>
              <button
                type="button"
                onClick={() => setOffersEnabled(!offersEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  offersEnabled ? 'bg-[#ff5722]' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    offersEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <p className="text-xs text-neutral-500 mb-3">
            Aap apni dukan ka koi bhi naya offer (jaise Chhath Puja, Diwali, Lagan, Season Sale) grahakon ko home page par dikha sakte hain. Jab offer khatam ho jaye, toggle switch se band (OFF) kar sakte hain.
          </p>

          <div className={`p-4 rounded-2xl border transition-all space-y-3 ${offersEnabled ? 'bg-orange-50/40 border-orange-200' : 'bg-neutral-50 border-neutral-200 opacity-60'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Offer Tag / Event Name
                </label>
                <input
                  type="text"
                  value={offerTag}
                  disabled={!offersEnabled}
                  onChange={(e) => setOfferTag(e.target.value)}
                  placeholder="e.g. Festive Mega Offer, Diwali Loot, Chhath Offer"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:border-[#ff5722] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Discount Highlight (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  value={offerDiscountPercent}
                  disabled={!offersEnabled}
                  onChange={(e) => setOfferDiscountPercent(parseInt(e.target.value) || 0)}
                  placeholder="e.g. 15"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:border-[#ff5722] outline-none tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Main Offer Heading (Bada Title)
              </label>
              <input
                type="text"
                value={offerHeading}
                disabled={!offersEnabled}
                onChange={(e) => setOfferHeading(e.target.value)}
                placeholder="e.g. Explore Complete Catalog &amp; Festive Deals"
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:border-[#ff5722] outline-none font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Offer Subtitle / Description Message
              </label>
              <textarea
                rows={2}
                value={offerSubheading}
                disabled={!offersEnabled}
                onChange={(e) => setOfferSubheading(e.target.value)}
                placeholder="e.g. Special wholesale &amp; retail discounts! Quality clothing, daily groceries &amp; spices delivered in Pachrukhi &amp; Siwan."
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:border-[#ff5722] outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Action Button Label
                </label>
                <input
                  type="text"
                  value={offerButtonText}
                  disabled={!offersEnabled}
                  onChange={(e) => setOfferButtonText(e.target.value)}
                  placeholder="e.g. Loot Lo / Explore Offers"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:border-[#ff5722] outline-none"
                />
              </div>

              {/* Live Preview Pill */}
              <div className="flex flex-col justify-end">
                <span className="text-[11px] text-neutral-500 font-medium mb-1">Customer View Status:</span>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-xl text-center border ${
                  offersEnabled
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                }`}>
                  {offersEnabled ? `🟢 Banner Active (${offerDiscountPercent}% OFF)` : '⚪ Banner Hidden from Customers'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SMS Gateway Integration (Free Google Firebase + Fast2SMS) */}
        <div className="pt-4 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#ff5722]" />
              <span>Real Telecom SMS Gateway (Mobile Message Inbox OTP)</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              10,000 Free SMS / Month
            </span>
          </div>

          <p className="text-xs text-neutral-600 mb-3 leading-relaxed">
            Customer ke mobile ke normal <strong>Message (SMS) Inbox</strong> mein direct OTP verification code deliver karne ke liye niche diye gaye 2 free providers hain:
          </p>

          <div className="space-y-3">
            {/* Meta WhatsApp Cloud API (1,000 Free Messages/Month by Meta) */}
            <div className="space-y-3 bg-emerald-50/50 p-4 rounded-2xl border-2 border-emerald-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span className="text-xs font-black text-emerald-950">
                      Meta Official WhatsApp Cloud API (Direct Customer Inbox OTP)
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-800">
                    Customer ke WhatsApp inbox mein Anvisha Traders ka OTP seedhe pahunchta hai (1,000 Free Messages/Mahina).
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-emerald-300 shrink-0">
                  <label className="text-xs text-emerald-900 font-bold cursor-pointer">
                    Enable WhatsApp API
                  </label>
                  <input
                    type="checkbox"
                    checked={whatsappCloudApiEnabled}
                    onChange={(e) => setWhatsappCloudApiEnabled(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>

              {whatsappCloudApiEnabled && (
                <div className="space-y-3 pt-2 border-t border-emerald-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        Meta Phone Number ID *
                      </label>
                      <input
                        type="text"
                        value={whatsappPhoneNumberId}
                        onChange={(e) => setWhatsappPhoneNumberId(e.target.value)}
                        placeholder="e.g. 104938291029381"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-emerald-600 outline-none font-mono"
                      />
                      <span className="text-[10px] text-neutral-500">Meta WhatsApp Getting Started page se copy karein</span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        WhatsApp Template Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={whatsappTemplateName}
                        onChange={(e) => setWhatsappTemplateName(e.target.value)}
                        placeholder="e.g. anvisha_otp or leave empty for text"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-emerald-600 outline-none font-mono"
                      />
                      <span className="text-[10px] text-neutral-500">Approved template ka naam daalein</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      Meta Access Token (Bearer Token) *
                    </label>
                    <input
                      type="password"
                      value={whatsappAccessToken}
                      onChange={(e) => setWhatsappAccessToken(e.target.value)}
                      placeholder="EAAB... (Temporary ya Permanent System User Token)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-emerald-600 outline-none font-mono"
                    />
                  </div>

                  {/* Test WhatsApp message trigger */}
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs font-bold text-neutral-700 shrink-0">Test Mobile:</span>
                      <input
                        type="tel"
                        value={testNumber}
                        onChange={(e) => setTestNumber(e.target.value)}
                        className="w-32 px-2 py-1 text-xs border rounded-lg font-mono"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={testingWhatsApp}
                      onClick={handleTestWhatsApp}
                      className="w-full sm:w-auto px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{testingWhatsApp ? 'Sending Test...' : 'Test Send OTP via WhatsApp'}</span>
                    </button>
                  </div>

                  {testResult && (
                    <div className={`p-2.5 rounded-xl text-xs font-medium ${testResult.success ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                      {testResult.msg}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-neutral-600 pt-1 border-t border-emerald-200/60">
                    <span>Meta Developers Portal se Token &amp; ID lene ke liye:</span>
                    <a
                      href="https://developers.facebook.com/apps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
                    >
                      <span>developers.facebook.com/apps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Provider 2: Fast2SMS */}
            <div className="space-y-2.5 bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-800 block">
                    Option 2: Fast2SMS Gateway (India Cellular API)
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Fast direct Indian telecom delivery (Optional)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-neutral-600 font-semibold cursor-pointer">
                    Enable Fast2SMS
                  </label>
                  <input
                    type="checkbox"
                    checked={smsGatewayEnabled}
                    onChange={(e) => setSmsGatewayEnabled(e.target.checked)}
                    className="w-4 h-4 text-[#ff5722] rounded accent-[#ff5722] cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Fast2SMS Dev API Key
                </label>
                <input
                  type="password"
                  value={fast2SmsApiKey}
                  onChange={(e) => setFast2SmsApiKey(e.target.value)}
                  placeholder="Enter Fast2SMS Dev API Key"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-200/60">
                <span>Free Fast2SMS signup ke liye:</span>
                <a
                  href="https://www.fast2sms.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#ff5722] hover:underline font-bold flex items-center gap-1"
                >
                  <span>fast2sms.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
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
