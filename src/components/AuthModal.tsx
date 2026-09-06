import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Coins,
  CheckCircle2,
  Video,
  KeyRound,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types/travel';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isCreator, setIsCreator] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleInstantDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const demoUser: UserProfile = {
        id: 'user_demo_creator',
        fullName: 'Mokshagna Teja (Creator)',
        username: 'mokshagnateja',
        email: 'mokshagnateja@gmail.com',
        phone: '+91 98765 43210',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        authProvider: 'google',
        loyaltyPoints: 1500,
        walletBalance: 4500,
        preferredClimate: ['cool', 'tropical'],
        preferredTripTypes: ['Hill Stations', 'Beaches'],
        budgetRange: [15000, 60000],
        savedDestinationIds: ['coorg-karnataka', 'munnar-kerala', 'varanasi-up'],
        isCreator: true,
        savedReelSpotIds: ['coorg-mandalpatti-sunset', 'munnar-kolukkumalai-sunrise'],
        totalTripsCompleted: 5,
      };
      localStorage.setItem('mg_travel_user', JSON.stringify(demoUser));
      onAuthSuccess(demoUser);
      onClose();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setIsLoading(false);
    }, 400);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/google-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'mokshagnateja@gmail.com',
          name: 'Mokshagna Teja',
          picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        }),
      });

      const data = await res.json();
      if (data.success) {
        onAuthSuccess(data.user);
        onClose();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setErrorMessage(data.message || 'Google authentication failed');
      }
    } catch (e) {
      console.error(e);
      // Fallback local account
      handleInstantDemoLogin();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
    const payload =
      authMode === 'login'
        ? { identifier: email, password }
        : { fullName, email, phone, password, isCreator };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        onAuthSuccess(data.user);
        onClose();
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
      } else {
        setErrorMessage(data.message || 'Authentication failed');
      }
    } catch (e) {
      console.error(e);
      // Client-side fallback for seamless instant login
      const fallbackUser: UserProfile = {
        id: `user_${Date.now()}`,
        fullName: fullName || (email ? email.split('@')[0] : 'Traveler Explorer'),
        username: email ? email.split('@')[0] : 'traveler',
        email: email || 'mokshagnateja@gmail.com',
        phone: '+91 98765 43210',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        authProvider: 'local',
        loyaltyPoints: authMode === 'register' ? 500 : 250,
        walletBalance: 2000,
        preferredClimate: ['cool'],
        preferredTripTypes: ['Hill Stations'],
        budgetRange: [10000, 50000],
        savedDestinationIds: ['coorg-karnataka'],
        isCreator,
        savedReelSpotIds: ['coorg-mandalpatti-sunset'],
        totalTripsCompleted: 1,
      };
      localStorage.setItem('mg_travel_user', JSON.stringify(fallbackUser));
      onAuthSuccess(fallbackUser);
      onClose();
      confetti({ particleCount: 50, spread: 50 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        id="auth-dialog"
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-rose-500 to-indigo-600 mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {authMode === 'login' ? 'Welcome Back to MG Travels' : 'Create Your Travel & Creator Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {authMode === 'login'
              ? 'Sign in to access saved itineraries, viral reel spots & budget breakdowns.'
              : 'Join to earn 500 Loyalty Points & unlock creator shooting guides.'}
          </p>
        </div>

        {/* Quick Demo Login Option */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id="quick-demo-login-btn"
            type="button"
            onClick={handleInstantDemoLogin}
            disabled={isLoading}
            className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>1-Click Demo Login</span>
          </button>

          <button
            id="google-signin-btn"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="py-2.5 px-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.67v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.16z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.41l4.04-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.59l4.04 3.15c.95-2.84 3.6-4.99 6.72-4.99z"
              />
            </svg>
            <span>Google Login</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="h-px bg-slate-800 flex-1" />
          <span>or with email</span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authMode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Mokshagna Teja"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-800 text-white placeholder-slate-400 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mokshagnateja@gmail.com"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-800 text-white placeholder-slate-400 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {authMode === 'register' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-800 text-white placeholder-slate-400 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Creator Mode Checkbox */}
              <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Travel Content Creator Mode</p>
                    <p className="text-[10px] text-slate-400">Unlock viral reel spots & shoot timings</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isCreator}
                  onChange={(e) => setIsCreator(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500 bg-slate-800 border-slate-700 focus:ring-rose-500 accent-rose-500 cursor-pointer"
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-800 text-white placeholder-slate-400 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-rose-500 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <span>{authMode === 'login' ? 'Sign In to Account' : 'Register Free Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          {authMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setAuthMode('register')}
                className="text-cyan-400 font-bold hover:underline"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setAuthMode('login')}
                className="text-cyan-400 font-bold hover:underline"
              >
                Sign In instead
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
