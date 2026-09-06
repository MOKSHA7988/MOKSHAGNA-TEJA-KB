import React from 'react';
import { Smartphone, Download, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenExportModal: () => void;
  className?: string;
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  onOpenExportModal,
  className = '',
  variant = 'full',
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Handle direct click
  const handleClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        onOpenExportModal();
      }
    } else {
      onOpenExportModal();
    }
  };

  if (variant === 'compact') {
    return (
      <button
        id="pwa-install-compact-btn"
        onClick={handleClick}
        title="Export to Mobile / Install PWA"
        className={`relative flex items-center justify-center p-2 rounded-xl bg-gradient-to-r from-cyan-600/90 to-blue-600/90 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-950/40 border border-cyan-400/30 transition-all cursor-pointer group ${className}`}
      >
        <Smartphone className="w-4 h-4 text-cyan-200 group-hover:scale-110 transition-transform" />
        <span className="sr-only">Export to Mobile</span>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
      </button>
    );
  }

  return (
    <button
      id="pwa-install-header-btn"
      onClick={handleClick}
      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/90 via-sky-600/90 to-blue-600/90 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/50 border border-cyan-400/40 transition-all cursor-pointer group ${className}`}
    >
      <Smartphone className="w-3.5 h-3.5 text-cyan-200 group-hover:scale-110 transition-transform" />
      <span className="tracking-tight">
        {isInstalled ? 'Mobile App Ready' : isInstallable ? 'Install App' : 'Export to Mobile'}
      </span>
      <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-extrabold uppercase tracking-widest text-cyan-100">
        PWA
      </span>
      <span className="absolute -top-1 -right-1 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
      </span>
    </button>
  );
};
