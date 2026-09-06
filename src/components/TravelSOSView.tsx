import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  HeartPulse,
  Flame,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Clock,
  Compass,
  FileText,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { EMERGENCY_CONTACTS_DATABASE } from '../data/travelDatabase';
import { EmergencyContact } from '../types/travel';

export const TravelSOSView: React.FC = () => {
  const [contacts] = useState<EmergencyContact[]>(EMERGENCY_CONTACTS_DATABASE);
  const [activeTab, setActiveTab] = useState<'helplines' | 'guidelines' | 'embassies'>('helplines');
  const [callingState, setCallingState] = useState<string | null>(null);

  const simulateCall = (number: string, service: string) => {
    setCallingState(`Connecting to ${service} (${number})...`);
    setTimeout(() => {
      setCallingState(null);
      alert(`Simulated emergency call connection to: ${service} at ${number}`);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border border-rose-900/40 p-6 sm:p-10 shadow-2xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> 24x7 Traveler Safety & SOS Center
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            India Multi-Lingual Tourist Support
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Emergency Helplines & <span className="bg-gradient-to-r from-rose-300 via-amber-200 to-orange-300 bg-clip-text text-transparent">Travel Safety Hub</span>
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          Direct access to national emergency services, multi-lingual tourist police helplines, road-side vehicle breakdown assistance, and essential medical protocols.
        </p>

        {/* SOS One-Tap Buttons */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => simulateCall('112', 'National Emergency Unified')}
            className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white flex flex-col items-center justify-center gap-1 shadow-lg shadow-rose-600/30 transition-all group"
          >
            <ShieldAlert className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-extrabold">Call 112</span>
            <span className="text-[10px] text-rose-100 font-medium">Unified Emergency</span>
          </button>

          <button
            onClick={() => simulateCall('1363', 'Tourist Helpline')}
            className="p-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white flex flex-col items-center justify-center gap-1 shadow-lg shadow-cyan-600/30 transition-all group"
          >
            <Compass className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-extrabold">Call 1363</span>
            <span className="text-[10px] text-cyan-100 font-medium">Tourist Helpline</span>
          </button>

          <button
            onClick={() => simulateCall('108', 'Ambulance Medical SOS')}
            className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white flex flex-col items-center justify-center gap-1 shadow-lg shadow-emerald-600/30 transition-all group"
          >
            <HeartPulse className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-extrabold">Call 108</span>
            <span className="text-[10px] text-emerald-100 font-medium">Medical Ambulance</span>
          </button>

          <button
            onClick={() => simulateCall('1033', 'National Highway SOS')}
            className="p-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-slate-950 flex flex-col items-center justify-center gap-1 shadow-lg shadow-amber-600/30 transition-all group"
          >
            <Flame className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-extrabold">Call 1033</span>
            <span className="text-[10px] text-slate-900 font-bold">Highway Emergency</span>
          </button>
        </div>

        {callingState && (
          <div className="p-3 rounded-xl bg-rose-950 border border-rose-500 text-rose-200 text-xs font-semibold text-center animate-pulse">
            {callingState}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: 'helplines', label: 'Emergency Contacts' },
          { id: 'guidelines', label: 'Safety Guidelines & Protocols' },
          { id: 'embassies', label: 'Lost Documents & Support' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Helplines List */}
      {activeTab === 'helplines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                    {contact.category.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {contact.availableHours}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white">{contact.service}</h3>
                <p className="text-xs text-slate-400">{contact.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">Dial Toll-Free</span>
                  <span className="text-lg font-mono font-extrabold text-rose-300">
                    {contact.number}
                  </span>
                </div>

                <button
                  onClick={() => simulateCall(contact.number, contact.service)}
                  className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-200 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                  <span>Call Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Safety Guidelines */}
      {activeTab === 'guidelines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> General Travel Safety Checklist
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Keep digital and printed photocopies of your government ID (Aadhaar / Passport) in cloud storage.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Share your live GPS location or hotel room details with a family member or trusted friend.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Use registered prepaid taxi booths or MG Travels verified cab partners at airports & railway stations.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Drink sealed bottled water and consume freshly prepared hot meals in high-altitude zones.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> High Altitude & Mountain Precautions (Manali / Ladakh)
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Acclimatize for at least 24-48 hours upon landing in Leh (3,500m) before doing strenuous activities.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Carry Diamox (under doctor consultation) and portable oxygen cans when visiting Khardung La (5,359m).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Stay hydrated (3-4 liters of water daily) and avoid excessive alcohol during the first 2 days.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Lost Documents */}
      {activeTab === 'embassies' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" /> What to do if you lose your Wallet, Phone, or ID
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-cyan-300 block">1. File an e-FIR</span>
              <p className="text-slate-400">
                Lodge a lost document report on the state police portal or nearest station within 24 hours.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-cyan-300 block">2. Block Cards Immediately</span>
              <p className="text-slate-400">
                Call your bank helpline or use your mobile banking app to temporarily freeze all debit/credit cards.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-cyan-300 block">3. Contact MG Travels Concierge</span>
              <p className="text-slate-400">
                Our 24/7 travel desk will assist with emergency cash transfers, local hotel validation, and return transit.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
