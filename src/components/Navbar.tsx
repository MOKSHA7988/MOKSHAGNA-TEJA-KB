import React from 'react';
import {
  Compass,
  Sparkles,
  Heart,
  User,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  ShieldCheck,
  Luggage,
  Coins,
  Radio,
  CloudSun,
} from 'lucide-react';
import { UserProfile } from '../types/travel';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile | null;
  savedCount: number;
  onOpenAuth: () => void;
  onOpenAssistant: () => void;
  onOpenRecommender: () => void;
  onOpenExportToMobile?: () => void;
  isAndroidPreview: boolean;
  setIsAndroidPreview: (val: boolean) => void;
  currency: 'INR' | 'USD' | 'EUR';
  setCurrency: (c: 'INR' | 'USD' | 'EUR') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  showLiveTicker?: boolean;
  setShowLiveTicker?: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  savedCount,
  onOpenAuth,
  onOpenAssistant,
  onOpenRecommender,
  onOpenExportToMobile,
  isAndroidPreview,
  setIsAndroidPreview,
  currency,
  setCurrency,
  isDarkMode,
  setIsDarkMode,
  showLiveTicker = true,
  setShowLiveTicker,
}) => {
  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 bg-slate-900/90 border-slate-800/80 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            id="brand-logo-btn"
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-2.5 group text-left focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-cyan-200 to-teal-400 bg-clip-text text-transparent">
                  MG TRAVELS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  AI v3.8
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Personalized Travel Intelligence
              </p>
            </div>
          </button>

          {/* Live Status Pill in Navbar */}
          {setShowLiveTicker && (
            <button
              onClick={() => setShowLiveTicker(!showLiveTicker)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all cursor-pointer"
              title="Toggle Live Weather, Hotel & Transit Bar"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px]">Live Updates Active</span>
            </button>
          )}
        </div>

        {/* Primary Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/50">
          {[
            { id: 'explore', label: 'Explore' },
            { id: 'creator', label: '🎬 Reel Spots', badge: 'Viral' },
            { id: 'packages', label: 'Packages', badge: 'Hot' },
            { id: 'planner', label: 'AI Planner' },
            { id: 'hotels', label: 'Hotels' },
            { id: 'flights', label: 'Flights & Trains' },
            { id: 'experiences', label: 'Experiences' },
            { id: 'checklist', label: 'Packing' },
            { id: 'route', label: 'Routes' },
            { id: 'budget', label: 'Budget' },
            { id: 'sos', label: 'SOS Safety' },
            { id: 'bookings', label: 'Bookings' },
          ].map((item) => (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                activeTab === item.id
                  ? item.id === 'creator'
                    ? 'bg-gradient-to-r from-rose-500 to-indigo-600 text-white shadow-md shadow-rose-500/20'
                    : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-500/20'
                  : item.id === 'creator'
                  ? 'text-rose-300 hover:text-white hover:bg-rose-950/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                    item.id === 'creator'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Medium Screen Nav Dropdown / Scrollable */}
        <div className="hidden lg:flex xl:hidden items-center gap-1 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/50">
          {[
            { id: 'explore', label: 'Explore' },
            { id: 'creator', label: '🎬 Reels' },
            { id: 'packages', label: 'Packages' },
            { id: 'planner', label: 'Planner' },
            { id: 'hotels', label: 'Hotels' },
            { id: 'flights', label: 'Transit' },
            { id: 'experiences', label: 'Activities' },
            { id: 'bookings', label: 'Bookings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                activeTab === item.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Export to Mobile / PWA Install Button */}
          {onOpenExportToMobile && (
            <>
              <div className="hidden sm:block">
                <PWAInstallButton onOpenExportModal={onOpenExportToMobile} variant="full" />
              </div>
              <div className="sm:hidden">
                <PWAInstallButton onOpenExportModal={onOpenExportToMobile} variant="compact" />
              </div>
            </>
          )}

          {/* AI Match Button */}
          <button
            id="ai-recommend-trigger-btn"
            onClick={onOpenRecommender}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 hover:border-cyan-400 transition-all duration-200 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">AI Match</span>
          </button>

          {/* AI Assistant Chat Trigger */}
          <button
            id="ai-assistant-btn"
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 hover:bg-indigo-600/50 transition-all duration-200 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AI Assistant</span>
          </button>

          {/* Currency Toggle */}
          <select
            id="currency-selector"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="bg-slate-800 text-slate-200 text-xs font-semibold px-2 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500 cursor-pointer hidden md:block"
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </select>

          {/* Saved Destinations Wishlist */}
          <button
            id="saved-wishlist-btn"
            onClick={() => setActiveTab('saved')}
            className={`relative p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-750'
            }`}
            title="Saved Destinations"
          >
            <Heart className={`w-4 h-4 ${savedCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {savedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-bounce">
                {savedCount}
              </span>
            )}
          </button>

          {/* User Profile / Login Avatar */}
          {user ? (
            <button
              id="user-profile-menu-btn"
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-cyan-500/50 transition-all cursor-pointer"
            >
              <img
                referrerPolicy="no-referrer"
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={user.fullName}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-cyan-500/50"
              />
              <div className="text-left hidden lg:block pr-1.5">
                <p className="text-xs font-bold text-slate-200 leading-tight">
                  {user.fullName.split(' ')[0]}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
                  <Coins className="w-2.5 h-2.5" />
                  <span>{user.loyaltyPoints || 0} pts</span>
                </div>
              </div>
            </button>
          ) : (
            <button
              id="header-login-btn"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all duration-200 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
