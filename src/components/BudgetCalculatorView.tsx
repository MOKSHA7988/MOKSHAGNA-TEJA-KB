import React, { useState } from 'react';
import {
  IndianRupee,
  DollarSign,
  Euro,
  Users,
  Calendar,
  Sparkles,
  Plane,
  Train,
  Car,
  Bus,
  Hotel,
  Utensils,
  Ticket,
  Zap,
  ShoppingBag,
} from 'lucide-react';
import { TripTier } from '../types/travel';

interface BudgetCalculatorViewProps {
  currency: 'INR' | 'USD' | 'EUR';
}

export const BudgetCalculatorView: React.FC<BudgetCalculatorViewProps> = ({ currency }) => {
  const [travelers, setTravelers] = useState(2);
  const [days, setDays] = useState(4);
  const [tier, setTier] = useState<TripTier>('standard');
  const [transportMode, setTransportMode] = useState<'flight' | 'train' | 'car' | 'bus'>('car');

  const formatPrice = (inr: number) => {
    if (currency === 'USD') return `$${Math.round(inr / 85).toLocaleString()}`;
    if (currency === 'EUR') return `€${Math.round(inr / 92).toLocaleString()}`;
    return `₹${inr.toLocaleString()}`;
  };

  const transportBase =
    transportMode === 'flight' ? 7500 : transportMode === 'train' ? 1600 : transportMode === 'car' ? 2400 : 900;
  const hotelRate = tier === 'luxury' ? 16000 : tier === 'standard' ? 4500 : 1800;
  const foodRate = tier === 'luxury' ? 2800 : tier === 'standard' ? 1100 : 500;
  const activityRate = tier === 'luxury' ? 1800 : tier === 'standard' ? 800 : 300;

  const transportTotal = transportBase * travelers;
  const hotelTotal = hotelRate * (days > 1 ? days - 1 : 1);
  const foodTotal = foodRate * days * travelers;
  const attractionsTotal = 600 * days * travelers;
  const activitiesTotal = activityRate * days * travelers;
  const miscTotal = 500 * days * travelers;

  const grandTotal = transportTotal + hotelTotal + foodTotal + attractionsTotal + activitiesTotal + miscTotal;
  const perPersonCost = Math.round(grandTotal / travelers);
  const dailyCost = Math.round(grandTotal / days);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
          <IndianRupee className="w-3.5 h-3.5" />
          Real-time Multi-Tier Financial Modeling
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Intelligent Travel Budget & Expense Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Simulate comprehensive trip costs with customizable transit modes, accommodation tiers, meal plans, and sight entries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-5 shadow-xl">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
            Budget Parameters
          </h2>

          {/* Travelers & Days */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Travelers Count</label>
              <select
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full bg-slate-800 text-white text-xs font-semibold p-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-cyan-500"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((t) => (
                  <option key={t} value={t}>
                    {t} {t === 1 ? 'Traveler' : 'Travelers'}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Trip Length</label>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full bg-slate-800 text-white text-xs font-semibold p-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-cyan-500"
              >
                {[2, 3, 4, 5, 6, 7, 8, 10, 14].map((d) => (
                  <option key={d} value={d}>
                    {d} Days
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Experience Tier */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Stay & Service Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'budget', label: 'Budget', sub: 'Homestays' },
                { id: 'standard', label: 'Standard', sub: '3-4★ Resorts' },
                { id: 'luxury', label: 'Luxury', sub: '5★ Heritage' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTier(t.id as any)}
                  className={`p-3 rounded-xl text-center border transition-all ${
                    tier === t.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs">{t.label}</div>
                  <div className="text-[10px] text-slate-400">{t.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Transport Mode */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Inter-City Transit Mode</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'car', label: 'Road/Cab', icon: Car },
                { id: 'train', label: 'Train', icon: Train },
                { id: 'bus', label: 'Bus', icon: Bus },
                { id: 'flight', label: 'Flight', icon: Plane },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = transportMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setTransportMode(m.id as any)}
                    className={`p-2.5 rounded-xl text-center border transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-[11px] font-semibold">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Output Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Totals Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-cyan-500/30 space-y-4 shadow-xl shadow-cyan-500/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Total Estimated Expenditure
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {travelers} Travelers • {days} Days • {tier.toUpperCase()} Tier
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-750">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Grand Total</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">{formatPrice(grandTotal)}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-750">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Cost Per Person</p>
                <p className="text-2xl font-black text-cyan-300 mt-1">{formatPrice(perPersonCost)}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-750">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Daily Group Cost</p>
                <p className="text-2xl font-black text-amber-300 mt-1">{formatPrice(dailyCost)}</p>
              </div>
            </div>
          </div>

          {/* Category-wise Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Hotel className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Accommodation</h4>
                  <p className="text-[10px] text-slate-400">{days - 1} nights at {formatPrice(hotelRate)}/nt</p>
                </div>
              </div>
              <span className="text-sm font-bold text-white">{formatPrice(hotelTotal)}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Transit & Cabs</h4>
                  <p className="text-[10px] text-slate-400">{transportMode.toUpperCase()} base estimate</p>
                </div>
              </div>
              <span className="text-sm font-bold text-white">{formatPrice(transportTotal)}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Food & Dining</h4>
                  <p className="text-[10px] text-slate-400">Signature meals & coffee/tea</p>
                </div>
              </div>
              <span className="text-sm font-bold text-white">{formatPrice(foodTotal)}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Attractions & Entries</h4>
                  <p className="text-[10px] text-slate-400">Monuments, parks & viewpoints</p>
                </div>
              </div>
              <span className="text-sm font-bold text-white">{formatPrice(attractionsTotal)}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Activities & Treks</h4>
                  <p className="text-[10px] text-slate-400">Plantation tours & guide charges</p>
                </div>
              </div>
              <span className="text-sm font-bold text-white">{formatPrice(activitiesTotal)}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Souvenirs & Misc</h4>
                  <p className="text-[10px] text-slate-400">Spices, chocolates, emergency fund</p>
                </div>
              </div>
              <span className="text-sm font-bold text-white">{formatPrice(miscTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
