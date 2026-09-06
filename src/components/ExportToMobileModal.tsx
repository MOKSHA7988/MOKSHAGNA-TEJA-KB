import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  QrCode,
  Download,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Apple,
  Chrome,
  Terminal,
  X,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
  ArrowRight
} from 'lucide-react';
import QRCode from 'qrcode';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ExportToMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportToMobileModal: React.FC<ExportToMobileModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'scan' | 'pwa_guide' | 'native_export' | 'manifest'>('scan');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  // Use the current or preview URL
  const mobileUrl = typeof window !== 'undefined' 
    ? (window.location.origin.includes('localhost') || window.location.origin.includes('ais-dev')
        ? window.location.href
        : window.location.origin)
    : 'https://ais-pre-vy4ravm6ml342v7m42za2l-885860704623.asia-southeast1.run.app';

  useEffect(() => {
    if (!isOpen) return;
    QRCode.toDataURL(mobileUrl, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code', err));
  }, [isOpen, mobileUrl]);

  if (!isOpen) return null;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(mobileUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleCopyCode = async (cmd: string, key: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCommand(key);
      setTimeout(() => setCopiedCommand(null), 2500);
    } catch {
      // fallback
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MG Travels AI – Mobile Travel Planner',
          text: 'Explore and book personalized travel experiences on mobile with MG Travels AI!',
          url: mobileUrl,
        });
      } catch {
        // Ignored if cancelled
      }
    } else {
      handleCopyUrl();
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(`Explore MG Travels AI on mobile: ${mobileUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div
      id="export-to-mobile-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="export-to-mobile-modal-content"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shadow-inner">
              <Smartphone className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Export & Open on Mobile</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  PWA Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Run natively on Android & iOS without app store friction
              </p>
            </div>
          </div>

          <button
            id="close-export-mobile-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('scan')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'scan'
                ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR & Instant Link</span>
          </button>

          <button
            onClick={() => setActiveTab('pwa_guide')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'pwa_guide'
                ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install as Mobile App (PWA)</span>
          </button>

          <button
            onClick={() => setActiveTab('native_export')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'native_export'
                ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Capacitor APK & App Store</span>
          </button>

          <button
            onClick={() => setActiveTab('manifest')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'manifest'
                ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>App Manifest</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: SCAN QR & INSTANT LINK */}
          {activeTab === 'scan' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* QR Code Card */}
                <div className="flex flex-col items-center justify-center p-6 bg-slate-950/80 rounded-2xl border border-slate-800 text-center">
                  <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-200 relative group">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="MG Travels AI Mobile QR Code"
                        className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                        Generating QR Code...
                      </div>
                    )}
                    <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center pointer-events-none">
                      <span className="px-2 py-1 bg-slate-900/90 text-cyan-400 text-[11px] font-bold rounded-md shadow">
                        Point Phone Camera Here
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-300 font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Scan with iPhone Camera or Android Google Lens
                  </p>
                </div>

                {/* Instant Actions */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Open Directly on Any Phone</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Instant launch in mobile browser or install straight to home screen. Optimized with responsive touch controls, bottom navigation, and offline caching.
                    </p>
                  </div>

                  {/* URL Box */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Mobile URL</div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={mobileUrl}
                        className="w-full bg-slate-900 text-slate-200 text-xs font-mono px-3 py-2 rounded-lg border border-slate-700/60 focus:outline-none select-all"
                      />
                      <button
                        onClick={handleCopyUrl}
                        className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                      >
                        {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Share Buttons */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={openWhatsApp}
                      className="p-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-700/50 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Send to WhatsApp</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Share Sheet</span>
                    </button>
                  </div>

                  {/* Install trigger if installable on desktop/Android browser */}
                  {isInstallable && (
                    <button
                      onClick={install}
                      className="w-full p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Install App on this Device Now</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Instant Launch</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Zero app store downloads needed. Opens immediately with full screen standalone display.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Offline & Cached</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Service worker precaches assets so itineraries and bookings remain viewable offline.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-violet-400 text-xs font-bold mb-1">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Native Look & Feel</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Smooth mobile navigation, gesture support, and adaptive layouts tailored for one-handed use.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PWA INSTALLATION GUIDE */}
          {activeTab === 'pwa_guide' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-cyan-200">Progressive Web App (PWA) Standards Met</h4>
                  <p className="text-xs text-cyan-300/80 leading-relaxed mt-0.5">
                    This web app includes a Web App Manifest, auto-updating service worker caching, high-resolution maskable icons, and standalone mobile display mode.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Android Guide */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Chrome className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Android (Chrome & Samsung)</h4>
                      <p className="text-[11px] text-slate-400">1-click home screen install</p>
                    </div>
                  </div>

                  <ol className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <span>Scan the QR code or open the link in <strong>Google Chrome</strong> or <strong>Samsung Internet</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <span>Tap the <strong>&ldquo;Add MG Travels to Home Screen&rdquo;</strong> prompt at the bottom.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <span>Or tap the browser <strong>Menu (⋮)</strong> and select <strong>&ldquo;Install app&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                      <span>The app icon appears on your home screen and app drawer, launching without browser address bars!</span>
                    </li>
                  </ol>
                </div>

                {/* iOS Safari Guide */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
                    <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                      <Apple className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">iPhone & iPad (Safari)</h4>
                      <p className="text-[11px] text-slate-400">Apple Web Clip installation</p>
                    </div>
                  </div>

                  <ol className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <span>Open the app link in <strong>Safari</strong> on your iPhone or iPad.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <span>Tap the <strong>Share</strong> button (the square icon with an upward arrow at the bottom).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <span>Scroll down the menu and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                      <span>Tap <strong>Add</strong> in the top right corner. The app is placed on your home screen with custom icon!</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CAPACITOR & NATIVE STORE APK EXPORT */}
          {activeTab === 'native_export' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-1">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Package as Native Android APK / iOS App with Capacitor</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You can package this exact Vite/React app directly into a native Android Studio (`.apk` / `.aab`) or iOS Xcode project using Capacitor in 4 commands:
                </p>
              </div>

              {/* Step 1 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>1. Install Capacitor dependencies</span>
                  <button
                    onClick={() => handleCopyCode('npm install @capacitor/core @capacitor/cli @capacitor/android', 'cap1')}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    {copiedCommand === 'cap1' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCommand === 'cap1' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto">
                  npm install @capacitor/core @capacitor/cli @capacitor/android
                </pre>
              </div>

              {/* Step 2 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>2. Initialize Capacitor Project</span>
                  <button
                    onClick={() => handleCopyCode('npx cap init "MG Travels AI" "com.mgtravels.ai" --web-dir dist', 'cap2')}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    {copiedCommand === 'cap2' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCommand === 'cap2' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto">
                  npx cap init "MG Travels AI" "com.mgtravels.ai" --web-dir dist
                </pre>
              </div>

              {/* Step 3 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>3. Build Web Assets & Add Android Platform</span>
                  <button
                    onClick={() => handleCopyCode('npm run build && npx cap add android && npx cap sync', 'cap3')}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    {copiedCommand === 'cap3' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCommand === 'cap3' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto">
                  npm run build && npx cap add android && npx cap sync
                </pre>
              </div>

              {/* Step 4 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>4. Open in Android Studio & Generate Signed APK / AAB</span>
                  <button
                    onClick={() => handleCopyCode('npx cap open android', 'cap4')}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    {copiedCommand === 'cap4' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCommand === 'cap4' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto">
                  npx cap open android
                </pre>
              </div>

              {/* Bubblewrap TWA Alternative */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
                <span className="font-bold text-slate-200">Google Play Store Trusted Web Activity (TWA): </span>
                You can also use Google&apos;s official tool <code className="text-cyan-400 font-mono">@bubblewrap/cli</code> via <code className="text-cyan-400 font-mono">npx @bubblewrap/cli init --manifest={mobileUrl}/manifest.webmanifest</code> to produce a Google Play-ready signed `.aab` bundle directly from this PWA!
              </div>
            </div>
          )}

          {/* TAB 4: MANIFEST & ASSETS */}
          {activeTab === 'manifest' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Web App Manifest (W3C Standard)</h4>
                  <p className="text-[11px] text-slate-400">Served dynamically at <code className="text-cyan-400">/manifest.webmanifest</code></p>
                </div>
                <button
                  onClick={() => {
                    const manifestContent = JSON.stringify({
                      id: '/',
                      name: 'MG Travels AI – Personalized Travel Recommendation System',
                      short_name: 'MG Travels',
                      description: 'AI-powered personalized travel recommendations, multi-modal travel cost intelligence, real bookings, and day-wise itineraries.',
                      theme_color: '#0f172a',
                      background_color: '#090d16',
                      display: 'standalone',
                      orientation: 'portrait',
                      start_url: '/',
                      scope: '/',
                      icons: [
                        { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
                        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
                        { src: '/pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
                      ],
                    }, null, 2);
                    const blob = new Blob([manifestContent], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'manifest.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Manifest</span>
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 max-h-72 overflow-y-auto leading-relaxed">
                <pre>{`{
  "id": "/",
  "name": "MG Travels AI – Personalized Travel Recommendation System",
  "short_name": "MG Travels",
  "description": "AI-powered personalized travel recommendations, multi-modal travel cost intelligence, real bookings, and day-wise itineraries.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#0f172a",
  "background_color": "#090d16",
  "icons": [
    {
      "src": "/pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/pwa-maskable-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}`}</pre>
              </div>

              {/* Asset Preview Icons */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/pwa-192x192.png" alt="App Icon" className="w-10 h-10 rounded-xl border border-slate-700 shadow" />
                  <div>
                    <div className="text-xs font-bold text-white">App Icons & Splash Screen</div>
                    <div className="text-[11px] text-slate-400">192px, 512px, Maskable & Apple Touch Icon configured</div>
                  </div>
                </div>
                <a
                  href="/icon.svg"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  <span>View SVG</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Live Sync Enabled across all devices</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
