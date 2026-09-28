import React, { useState } from 'react';
import {
  Check,
  Copy,
  Download,
  FileCode,
  Globe,
  HelpCircle,
  Play,
  Share2,
  Smartphone,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

const MANIFEST_DATA = {
  id: '/',
  name: 'Anvisha Traders - Smart Store & Billing',
  short_name: 'Anvisha',
  description:
    'Customer ordering portal with live tracking and GST invoice viewer, paired with full Admin store, inventory, and billing management.',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
  background_color: '#f8f8f9',
  theme_color: '#ff5722',
  orientation: 'any',
  lang: 'en-IN',
  dir: 'ltr',
  categories: ['shopping', 'business', 'utilities'],
  prefer_related_applications: false,
  icons: [
    {
      src: '/pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/pwa-maskable-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: '/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/icon.svg',
      sizes: 'any',
      type: 'image/svg+xml',
      purpose: 'any',
    },
  ],
  screenshots: [
    {
      src: '/screenshot-desktop.png',
      sizes: '1280x720',
      type: 'image/png',
      form_factor: 'wide',
      label: 'Anvisha Traders Store Catalog & Management',
    },
    {
      src: '/screenshot-mobile.png',
      sizes: '750x1334',
      type: 'image/png',
      form_factor: 'narrow',
      label: 'Anvisha Traders Mobile Shopping & Orders',
    },
  ],
  shortcuts: [
    {
      name: 'Store Catalog',
      short_name: 'Catalog',
      description: 'Browse products and hardware materials',
      url: '/?view=catalog',
      icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
    },
    {
      name: 'My Orders',
      short_name: 'Orders',
      description: 'Track your submitted orders and deliveries',
      url: '/?view=orders',
      icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
    },
  ],
  related_applications: [],
};

export const PWAInstallModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'app' | 'pwabuilder' | 'manifest' | 'android'>('android');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedManifest, setCopiedManifest] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(JSON.stringify(MANIFEST_DATA, null, 2));
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2000);
  };

  const handleDownloadManifest = () => {
    const blob = new Blob([JSON.stringify(MANIFEST_DATA, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#ff5722] text-white flex items-center justify-center font-bold shadow-sm shadow-orange-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-900 font-display">
                Anvisha App &amp; PWABuilder Hub
              </h3>
              <p className="text-xs text-neutral-500 font-medium">
                Install on Phone • Google Play APK • Web App Manifest
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-200/70 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-neutral-200 px-4 pt-2 gap-2 bg-neutral-50/40 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('android')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'android'
                ? 'border-[#ff5722] text-[#ff5722]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Play Store Android Project
          </button>
          <button
            onClick={() => setActiveTab('app')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'app'
                ? 'border-[#ff5722] text-[#ff5722]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Direct Phone App
          </button>
          <button
            onClick={() => setActiveTab('pwabuilder')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pwabuilder'
                ? 'border-[#ff5722] text-[#ff5722]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Store className="w-4 h-4" />
            PWABuilder Help
          </button>
          <button
            onClick={() => setActiveTab('manifest')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'manifest'
                ? 'border-[#ff5722] text-[#ff5722]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Manifest JSON
          </button>
        </div>

        {/* Body content with scroll */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-neutral-800">
          {activeTab === 'android' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    Complete Native Android Studio Project
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-200/80 px-2.5 py-0.5 rounded-full">
                    Ready to Build .AAB
                  </span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed mb-3">
                  Google Play Store ke naye rules (SDK 34) ke mutabiq complete Android Project taiyar kar diya gaya hai. Is project ko download karke aap 2 minute mein signed <strong>.aab (Android App Bundle)</strong> generate kar sakte hain.
                </p>
                <a
                  href="/anvisha-traders-android-source.zip"
                  download="anvisha-traders-android-source.zip"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Android Studio Project (.ZIP)
                </a>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2 text-xs text-neutral-700">
                <h4 className="font-bold text-neutral-900">Google Play Store APK / AAB kaise generate karein:</h4>
                <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
                  <li>Upar diye button se <strong>anvisha-traders-android-source.zip</strong> download karein aur unzip karein.</li>
                  <li><strong>Android Studio</strong> open karke <strong>Open</strong> par click karein aur is folder ko select karein.</li>
                  <li>Upar menu mein <strong>Build ➔ Generate Signed Bundle / APK</strong> dabayein.</li>
                  <li><strong>Android App Bundle (.aab)</strong> select karein aur <strong>Finish</strong> dabayein.</li>
                  <li>Play Store Console par upload ke liye ready file mil jayegi!</li>
                </ol>
              </div>
            </div>
          )}
          {activeTab === 'app' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-[#ff5722]" />
                    Direct 1-Click Install (Phone &amp; Desktop)
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    No Store Needed
                  </span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed mb-3">
                  Ye website fully PWA-supported hai. Aap aur aapke customers bina kisi Google Play
                  Store fee ke direct phone par official app ki tarah install kar sakte hain!
                </p>
                {isInstallable ? (
                  <button
                    onClick={() => {
                      install();
                      onClose();
                    }}
                    className="w-full py-2.5 bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Install App on This Device Now
                  </button>
                ) : (
                  <div className="p-3 bg-white/80 rounded-xl border border-orange-100 text-xs text-neutral-700 space-y-1">
                    <p className="font-bold text-neutral-900">Chrome / Mobile Browser mein install karne ke steps:</p>
                    <p>1. Chrome browser ke upar right corner mein <strong>3 dots (⋮)</strong> dabayein.</p>
                    <p>2. <strong>&quot;Install app&quot;</strong> ya <strong>&quot;Add to Home screen&quot;</strong> par click karein.</p>
                    <p>3. App aapke mobile home screen par Anvisha Traders icon ke saath install ho jayegi!</p>
                  </div>
                )}
              </div>

              {/* App URL box */}
              <div className="p-3.5 bg-neutral-100/80 rounded-2xl space-y-2 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-700">Aapka App Link:</span>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1 text-xs font-bold text-[#ff5722] hover:underline"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedUrl ? 'Copied to Clipboard!' : 'Copy Link'}
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-neutral-300 font-mono text-neutral-700 select-all"
                />
              </div>
            </div>
          )}

          {activeTab === 'pwabuilder' && (
            <div className="space-y-4">
              {/* Alert explaining what happened in screenshot */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <p className="font-bold text-amber-950 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  PWABuilder Screenshot mein error kyu aaya?
                </p>
                <p className="leading-relaxed text-amber-800">
                  Aapke screenshot mein <strong>&quot;Last tested 32 minutes ago&quot;</strong> aur <strong>&quot;Timed out&quot;</strong> dikh raha hai.
                  Yeh isliye hua kyunki AI Studio ka Dev URL private Google login se protected hota hai, isliye PWABuilder ka bahar ka bot login na hone ke karan load nahi kar paya.
                </p>
              </div>

              {/* How to fix on PWABuilder */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
                  2 Simple Solutions:
                </h4>

                {/* Option 1: Direct in PWABuilder (Fastest) */}
                <div className="p-3.5 rounded-2xl bg-white border-2 border-[#ff5722]/30 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#ff5722] text-white flex items-center justify-center text-[11px] font-black">
                        1
                      </span>
                      PWABuilder mein &quot;Click here to customize it!&quot; dabayein
                    </span>
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Aapke screen par jo popup dikh raha hai <strong>&quot;Click here to customize it!&quot;</strong>, uspe click karein:
                  </p>
                  <div className="bg-neutral-50 rounded-xl p-2.5 text-[11px] space-y-1 font-mono text-neutral-700 border border-neutral-200">
                    <div><strong>Name:</strong> Anvisha Traders - Smart Store &amp; Billing</div>
                    <div><strong>Short Name:</strong> Anvisha</div>
                    <div><strong>Description:</strong> Customer ordering portal with live tracking and GST invoice viewer</div>
                    <div><strong>Theme Color:</strong> #ff5722</div>
                    <div><strong>Background:</strong> #f8f8f9</div>
                  </div>
                  <button
                    onClick={handleCopyManifest}
                    className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedManifest ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedManifest ? 'Full Manifest Copied!' : 'Copy Full Manifest JSON'}
                  </button>
                </div>

                {/* Option 2: AI Studio Share button */}
                <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-2">
                  <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-neutral-800 text-white flex items-center justify-center text-[11px] font-black">
                      2
                    </span>
                    AI Studio mein &quot;Share&quot; button daba kar public link banayein
                  </span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Google AI Studio ke screen par upar right corner mein <strong>&quot;Share&quot;</strong> button click karein. Phir jo public link mile, use PWABuilder mein daal kar <strong>&quot;Re-test&quot;</strong> dabayein. Bot turant 100% score verify karega!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manifest' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Web App Manifest (manifest.json)</h4>
                  <p className="text-[11px] text-neutral-500">Standard W3C compliant JSON file</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyManifest}
                    className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    {copiedManifest ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedManifest ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownloadManifest}
                    className="px-2.5 py-1.5 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
              </div>

              <div className="bg-neutral-900 text-neutral-100 rounded-2xl p-3 text-[11px] font-mono overflow-x-auto max-h-60 border border-neutral-800">
                <pre>{JSON.stringify(MANIFEST_DATA, null, 2)}</pre>
              </div>

              <p className="text-[11px] text-neutral-500 italic">
                Yeh file server ke root par <code>/manifest.json</code> aur <code>/manifest.webmanifest</code> par live available hai.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
