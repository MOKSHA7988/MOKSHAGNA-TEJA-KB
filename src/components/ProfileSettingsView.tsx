import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Coins,
  Wallet,
  Compass,
  Heart,
  ShieldCheck,
  LogOut,
  Save,
  CheckCircle2,
  Sparkles,
  Award,
} from 'lucide-react';
import { UserProfile } from '../types/travel';

interface ProfileSettingsViewProps {
  user: UserProfile | null;
  onUpdateUser: (updated: UserProfile) => void;
  onSignOut: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  user,
  onUpdateUser,
  onSignOut,
}) => {
  if (!user) return null;

  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone || '');
  const [preferredClimate, setPreferredClimate] = useState<string[]>(user.preferredClimate);
  const [preferredTripTypes, setPreferredTripTypes] = useState<string[]>(user.preferredTripTypes);
  const [isSaved, setIsSaved] = useState(false);

  const climateOptions = ['cool', 'tropical', 'snowy', 'moderate'];
  const tripTypeOptions = [
    'Hill Stations',
    'Beaches',
    'Backwaters',
    'Heritage',
    'Adventure',
    'Wildlife',
    'Pilgrimage',
    'Luxury',
  ];

  const toggleClimate = (c: string) => {
    if (preferredClimate.includes(c)) {
      setPreferredClimate(preferredClimate.filter((x) => x !== c));
    } else {
      setPreferredClimate([...preferredClimate, c as any]);
    }
  };

  const toggleTripType = (t: string) => {
    if (preferredTripTypes.includes(t)) {
      setPreferredTripTypes(preferredTripTypes.filter((x) => x !== t));
    } else {
      setPreferredTripTypes([...preferredTripTypes, t as any]);
    }
  };

  const handleSaveProfile = () => {
    const updated: UserProfile = {
      ...user,
      fullName,
      phone,
      preferredClimate: preferredClimate as any,
      preferredTripTypes: preferredTripTypes as any,
    };
    onUpdateUser(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-lg"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{user.fullName}</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {user.authProvider} User
              </span>
            </div>
            <p className="text-xs text-slate-400">{user.email}</p>
            <p className="text-xs text-slate-400">{user.phone || 'Phone not linked'}</p>
          </div>
        </div>

        <button
          onClick={onSignOut}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Rewards & Wallet Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
            <Coins className="w-4 h-4" />
            <span>Loyalty Rewards</span>
          </div>
          <p className="text-2xl font-black text-amber-300">{user.loyaltyPoints} Pts</p>
          <p className="text-[11px] text-slate-400">Equivalent to ₹{user.loyaltyPoints} in discounts</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
            <Wallet className="w-4 h-4" />
            <span>Traveler Wallet</span>
          </div>
          <p className="text-2xl font-black text-emerald-300">₹{user.walletBalance.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">Instant credit for fast checkouts</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase">
            <Award className="w-4 h-4" />
            <span>Trips Completed</span>
          </div>
          <p className="text-2xl font-black text-cyan-300">{user.totalTripsCompleted} Expeditions</p>
          <p className="text-[11px] text-slate-400">Explorer tier membership</p>
        </div>
      </div>

      {/* Profile Settings Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
        <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Personalized AI Preferences & Contact Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-800 p-3 rounded-2xl border border-slate-700 text-white text-xs font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-slate-800 p-3 rounded-2xl border border-slate-700 text-white text-xs font-semibold"
            />
          </div>
        </div>

        {/* Climate Preferences */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Preferred Climates</label>
          <div className="flex flex-wrap gap-2">
            {climateOptions.map((c) => {
              const isSelected = preferredClimate.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleClimate(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trip Types Preferences */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Preferred Travel Styles</label>
          <div className="flex flex-wrap gap-2">
            {tripTypeOptions.map((t) => {
              const isSelected = preferredTripTypes.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTripType(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save button */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          {isSaved && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Preferences updated successfully!
            </span>
          )}
          <button
            onClick={handleSaveProfile}
            className="ml-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 hover:opacity-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
