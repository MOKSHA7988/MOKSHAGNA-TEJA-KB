import React, { useState } from 'react';
import {
  Wifi,
  Battery,
  Signal,
  Compass,
  MapPin,
  Heart,
  Luggage,
  MessageSquare,
  User,
  Sparkles,
  Hotel,
  Navigation,
  Activity,
  Code,
  CheckCircle2,
} from 'lucide-react';
import { Destination, UserProfile, TripPlan, BookingRecord } from '../types/travel';

interface AndroidMobileFrameProps {
  destinations: Destination[];
  user: UserProfile | null;
  activeDestination: Destination | null;
  onSelectDestination: (dest: Destination) => void;
  onPlanTrip: (dest: Destination) => void;
  onOpenAssistant: () => void;
  onOpenRecommender: () => void;
  onOpenExportToMobile?: () => void;
}

export const AndroidMobileFrame: React.FC<AndroidMobileFrameProps> = ({
  destinations,
  user,
  activeDestination,
  onSelectDestination,
  onPlanTrip,
  onOpenAssistant,
  onOpenRecommender,
  onOpenExportToMobile,
}) => {
  const [mobileTab, setMobileTab] = useState<'home' | 'plan' | 'hotels' | 'assistant' | 'profile'>('home');
  const [showNetworkLogs, setShowNetworkLogs] = useState(false);

  const mockLogs = [
    { method: 'POST', endpoint: '/api/recommend', status: 200, latency: '42ms' },
    { method: 'GET', endpoint: '/api/destinations', status: 200, latency: '28ms' },
    { method: 'POST', endpoint: '/api/assistant', status: 200, latency: '120ms' },
    { method: 'GET', endpoint: '/api/weather/coorg', status: 200, latency: '35ms' },
  ];

  return (
    <div className="py-8 px-4 flex flex-col items-center justify-center space-y-6">
      {/* Top Description */}
      <div className="text-center max-w-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
          <Activity className="w-3.5 h-3.5" />
          Native Android Architecture • Kotlin + Jetpack Compose + Retrofit
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Android Mobile Application Preview
        </h2>
        <p className="text-xs text-slate-400">
          Live simulation of the native Jetpack Compose Material 3 interface interacting with the Flask/Express REST API.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {onOpenExportToMobile && (
            <button
              onClick={onOpenExportToMobile}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs hover:from-cyan-500 hover:to-blue-500 flex items-center gap-1.5 shadow-lg shadow-cyan-950/40 cursor-pointer"
            >
              <span>📱 Open on Real Phone / Scan QR</span>
            </button>
          )}

          <button
            onClick={() => setShowNetworkLogs(!showNetworkLogs)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-semibold hover:bg-slate-750 flex items-center gap-1.5 cursor-pointer"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showNetworkLogs ? 'Hide Retrofit Logs' : 'View Retrofit API Calls'}</span>
          </button>
        </div>
      </div>

      {/* Network Logs Drawer */}
      {showNetworkLogs && (
        <div className="w-full max-w-md bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400 font-bold">
            <span>Retrofit HTTP Client Trace</span>
            <span className="text-emerald-400">Base: http://10.0.2.2:5000</span>
          </div>
          <div className="space-y-1">
            {mockLogs.map((log, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold">{log.method}</span>
                <span className="text-slate-300">{log.endpoint}</span>
                <span className="text-emerald-400">{log.status} OK</span>
                <span className="text-slate-500">{log.latency}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Android Device Mockup Chassis */}
      <div className="relative w-[360px] h-[720px] bg-slate-950 rounded-[44px] border-[10px] border-slate-800 shadow-2xl overflow-hidden flex flex-col ring-1 ring-slate-700">
        {/* Android Punch-hole Camera & Speaker */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-50 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800" />
        </div>

        {/* Android Status Bar */}
        <div className="h-7 px-6 pt-1 flex items-center justify-between text-[10px] font-bold text-slate-300 z-40 bg-slate-950/80 backdrop-blur-md shrink-0">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Native App Top Bar */}
        <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-sm text-white tracking-tight">
              MG TRAVELS
            </span>
          </div>

          <button
            onClick={onOpenRecommender}
            className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* App Screen Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs no-scrollbar bg-slate-950">
          {mobileTab === 'home' && (
            <div className="space-y-4">
              {/* Hero greeting banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-850 border border-slate-800 space-y-2">
                <p className="text-[10px] text-cyan-400 font-bold uppercase">
                  Welcome back, {user ? user.fullName.split(' ')[0] : 'Traveler'}
                </p>
                <h3 className="text-sm font-bold text-white leading-snug">
                  Where is your next AI-crafted adventure?
                </h3>
                <button
                  onClick={onOpenRecommender}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-xs shadow-md"
                >
                  Start AI Matcher
                </button>
              </div>

              {/* Destination list cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-slate-300 font-bold">
                  <span>Top AI Recommendations</span>
                  <span className="text-[10px] text-cyan-400">View All</span>
                </div>

                {destinations.slice(0, 4).map((d) => (
                  <div
                    key={d.id}
                    onClick={() => onSelectDestination(d)}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex gap-3 items-center active:scale-98 transition-transform cursor-pointer"
                  >
                    <img
                      src={d.heroImage}
                      alt={d.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-xs truncate">{d.name}</h4>
                        <span className="text-[10px] font-extrabold text-cyan-400">
                          {d.aiScore ? `${d.aiScore}%` : `★ ${d.rating}`}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{d.state}</p>
                      <p className="text-[10px] text-emerald-400 font-bold mt-1">
                        ₹{d.estimatedBudgetPerDay.standard.toLocaleString()} /day
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mobileTab === 'plan' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">AI Itinerary Builder</h3>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <p className="text-slate-300 text-xs">Destination: <strong>Coorg (Kodagu)</strong></p>
                <p className="text-slate-400 text-[11px]">4 Days • 2 Travelers • Standard Tier</p>
                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <p className="text-cyan-300 text-[11px]">Day 1: Raja's Seat & Madikeri Fort</p>
                  <p className="text-cyan-300 text-[11px]">Day 2: Abbey Falls & Golden Temple</p>
                  <p className="text-cyan-300 text-[11px]">Day 3: Dubare Elephant Camp</p>
                </div>
                <button
                  onClick={() => onPlanTrip(destinations[0])}
                  className="w-full py-2 mt-2 rounded-xl bg-cyan-500 text-white font-bold text-xs"
                >
                  Open Full Plan
                </button>
              </div>
            </div>
          )}

          {mobileTab === 'hotels' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Verified Stays</h3>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                <p className="font-bold text-white text-xs">Evolve Back Plantation</p>
                <p className="text-[11px] text-slate-400">Coorg • ★ 4.9</p>
                <p className="text-xs font-bold text-emerald-400">₹18,000 /night</p>
              </div>
            </div>
          )}

          {mobileTab === 'assistant' && (
            <div className="space-y-3 text-center py-6">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">AI Travel Guide</h3>
              <p className="text-[11px] text-slate-400">Ask any questions in conversational RAG mode</p>
              <button
                onClick={onOpenAssistant}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Launch Chat Drawer
              </button>
            </div>
          )}

          {mobileTab === 'profile' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 mx-auto flex items-center justify-center text-cyan-300 font-bold">
                  {user ? user.fullName[0] : 'U'}
                </div>
                <p className="font-bold text-white text-xs">{user ? user.fullName : 'Guest Traveler'}</p>
                <p className="text-[10px] text-amber-400 font-semibold">{user ? `${user.loyaltyPoints} Loyalty Pts` : '500 Welcome Pts'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Android Material 3 Bottom Navigation Bar */}
        <div className="h-16 px-4 bg-slate-900 border-t border-slate-800 flex items-center justify-around text-slate-400 shrink-0">
          {[
            { id: 'home', label: 'Explore', icon: Compass },
            { id: 'plan', label: 'Plan', icon: Luggage },
            { id: 'hotels', label: 'Stays', icon: Hotel },
            { id: 'assistant', label: 'AI Chat', icon: MessageSquare },
            { id: 'profile', label: 'Profile', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = mobileTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setMobileTab(tab.id as any)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  isSelected ? 'text-cyan-400 font-bold scale-105' : 'hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px]">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Android Gesture Bar */}
        <div className="h-4 bg-slate-950 flex items-center justify-center shrink-0">
          <div className="w-28 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
