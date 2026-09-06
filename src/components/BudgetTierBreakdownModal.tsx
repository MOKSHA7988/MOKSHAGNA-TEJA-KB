import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  IndianRupee,
  DollarSign,
  Euro,
  Hotel,
  Utensils,
  Bus,
  Ticket,
  Sparkles,
  ShieldCheck,
  Compass,
  Download,
  Calendar,
  Users,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Coffee,
  MapPin,
} from 'lucide-react';
import { Destination, TripTier } from '../types/travel';

interface BudgetTierBreakdownModalProps {
  destination: Destination;
  initialTier?: TripTier;
  currency: 'INR' | 'USD' | 'EUR';
  isOpen: boolean;
  onClose: () => void;
  onPlanTrip: (destination: Destination, tier: TripTier) => void;
  onDownloadPDF?: (destination: Destination) => void;
}

interface ExpenseItem {
  name: string;
  cost: number;
  description: string;
  tip?: string;
}

interface TierDetails {
  title: string;
  subtitle: string;
  dailyRate: number;
  colorTheme: {
    badge: string;
    border: string;
    text: string;
    accentBg: string;
    gradient: string;
  };
  stay: {
    type: string;
    cost: number;
    items: ExpenseItem[];
  };
  food: {
    cost: number;
    items: ExpenseItem[];
  };
  transit: {
    type: string;
    cost: number;
    items: ExpenseItem[];
  };
  sightseeing: {
    cost: number;
    items: ExpenseItem[];
  };
  misc: {
    cost: number;
    items: ExpenseItem[];
  };
  tips: string[];
  sampleRoutine: string[];
}

export const BudgetTierBreakdownModal: React.FC<BudgetTierBreakdownModalProps> = ({
  destination,
  initialTier = 'budget',
  currency,
  isOpen,
  onClose,
  onPlanTrip,
  onDownloadPDF,
}) => {
  const [selectedTier, setSelectedTier] = useState<TripTier>(initialTier);
  const [days, setDays] = useState<number>(destination.idealDays || 3);
  const [travelers, setTravelers] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'tips' | 'calculator'>('breakdown');

  if (!isOpen) return null;

  const formatPrice = (inr: number) => {
    if (currency === 'USD') return `$${Math.round(inr / 85).toLocaleString()}`;
    if (currency === 'EUR') return `€${Math.round(inr / 92).toLocaleString()}`;
    return `₹${inr.toLocaleString()}`;
  };

  const getTierData = (tier: TripTier): TierDetails => {
    const baseBudget = destination.estimatedBudgetPerDay.budget || 2500;
    const baseStandard = destination.estimatedBudgetPerDay.standard || 5000;
    const baseLuxury = destination.estimatedBudgetPerDay.luxury || 12000;

    if (tier === 'budget') {
      return {
        title: 'Budget Backpacker',
        subtitle: 'Authentic local stays, public transit, street eateries & maximum freedom',
        dailyRate: baseBudget,
        colorTheme: {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          accentBg: 'bg-emerald-950/30',
          gradient: 'from-emerald-500 to-teal-500',
        },
        stay: {
          type: 'Youth Hostels, Shared Dorms & Estate Homestays',
          cost: Math.round(baseBudget * 0.44),
          items: [
            {
              name: 'Cozy Backpacker Hostel Bed / Local Homestay Room',
              cost: Math.round(baseBudget * 0.44),
              description: 'Shared dorm bed (Zostel/Hosteller) or traditional plantation homestay with warm host family.',
              tip: 'Includes complimentary hot morning estate coffee/tea & Wi-Fi.',
            },
          ],
        },
        food: {
          cost: Math.round(baseBudget * 0.24),
          items: [
            {
              name: 'Local Breakfast & Filter Coffee',
              cost: Math.round(baseBudget * 0.05),
              description: 'Authentic Darshini / local mess (Hot Akki Roti, crispy Vada, Idli sambar & piping hot coffee).',
            },
            {
              name: 'Regional Thali / Traditional Lunch',
              cost: Math.round(baseBudget * 0.10),
              description: 'Unlimited regional rice thali with seasonal curries, Kadambuttu (rice dumplings), or local specials.',
            },
            {
              name: 'Evening High Tea & Snacks',
              cost: Math.round(baseBudget * 0.03),
              description: 'Spiced chai with hot banana fritters or roasted corn by the hills.',
            },
            {
              name: 'Casual Dinner & Local Delicacy',
              cost: Math.round(baseBudget * 0.06),
              description: 'Local town restaurant dinner (Roti curries, street noodles, or authentic regional dishes).',
            },
          ],
        },
        transit: {
          type: 'Local KSRTC Buses, Shared Autos & Scooter Rentals',
          cost: Math.round(baseBudget * 0.18),
          items: [
            {
              name: 'State Transport Buses & Shared Autos',
              cost: Math.round(baseBudget * 0.10),
              description: 'Economical red/green state buses connecting town center to main tourist junctions.',
            },
            {
              name: 'Scooter Rental / Fuel Share',
              cost: Math.round(baseBudget * 0.08),
              description: 'Shared daily Honda Activa / bike rental (₹450/day split between two) + petrol fuel.',
              tip: 'Carry a valid driving license for easy rental pickups.',
            },
          ],
        },
        sightseeing: {
          cost: Math.round(baseBudget * 0.08),
          items: [
            {
              name: 'Viewpoint & Waterfall Entry Passes',
              cost: Math.round(baseBudget * 0.05),
              description: 'Government tickets for Abbey Falls (₹15), Raja Seat (₹10), viewpoints & heritage spots.',
            },
            {
              name: 'Nature Walks & Self-Guided Trails',
              cost: Math.round(baseBudget * 0.03),
              description: 'Public trekking paths, plantation boundaries & riverside walks (mostly free or nominal).',
            },
          ],
        },
        misc: {
          cost: Math.round(baseBudget * 0.06),
          items: [
            {
              name: 'Contingency, Mineral Water & Snacks',
              cost: Math.round(baseBudget * 0.06),
              description: 'Packaged drinking water refills, emergency medical buffer & roadside spices sample.',
            },
          ],
        },
        tips: [
          `Stay near central bus terminals in ${destination.name} to easily access frequent public transportation.`,
          'Rent a scooter (approx. ₹400-500/day) to visit waterfalls and coffee estates on your own flexible schedule.',
          'Eat at busy local family-run eateries and "Darshinis" for the most authentic taste at fraction of resort costs.',
          'Carry cash and have UPI apps setup; some remote hill checkpoints have low cellular network bandwidth.',
          'Travel on weekdays (Mon-Thu) to get up to 30% discount on backpacker hostels and homestays.',
        ],
        sampleRoutine: [
          '07:30 AM: Morning stroll & authentic breakfast at local town mess (₹120)',
          '09:00 AM: Catch morning KSRTC bus or ride scooter to scenic waterfalls (₹30)',
          '01:00 PM: Authentic regional lunch thali at plantation cafeteria (₹200)',
          '03:30 PM: Self-guided trek to panoramic hill viewpoints (₹20)',
          '06:00 PM: Sunset viewing at historic gardens with evening filter coffee (₹40)',
          '08:30 PM: Local street dinner and socializing at hostel common lounge (₹180)',
        ],
      };
    }

    if (tier === 'standard') {
      return {
        title: 'Standard Comfort',
        subtitle: 'Quality 3-4★ boutique resorts, private AC cab transit & signature dining',
        dailyRate: baseStandard,
        colorTheme: {
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          border: 'border-cyan-500/40',
          text: 'text-cyan-400',
          accentBg: 'bg-cyan-950/30',
          gradient: 'from-cyan-500 to-teal-500',
        },
        stay: {
          type: '3★ Boutique Coffee Estate Resort & Premium Cottages',
          cost: Math.round(baseStandard * 0.48),
          items: [
            {
              name: 'Private Mountain View Cottage / 3★ Resort Room',
              cost: Math.round(baseStandard * 0.48),
              description: 'Private cottage with balcony, swimming pool access, and buffet breakfast spread included.',
              tip: 'Includes complimentary evening plantation walk guided by estate naturalists.',
            },
          ],
        },
        food: {
          cost: Math.round(baseStandard * 0.22),
          items: [
            {
              name: 'Resort Buffet Breakfast & Fresh Juices',
              cost: Math.round(baseStandard * 0.04),
              description: 'Multi-cuisine breakfast with fresh seasonal fruits, eggs to order & regional specialties.',
            },
            {
              name: 'Multi-Cuisine Fine Restaurant Lunch',
              cost: Math.round(baseStandard * 0.09),
              description: 'A-la-carte lunch at top-rated local heritage restaurants and garden bistros.',
            },
            {
              name: 'Sunset Coffee & Specialty Pastries',
              cost: Math.round(baseStandard * 0.03),
              description: 'Artisanal roasted coffee and estate fresh confectioneries.',
            },
            {
              name: 'Candlelight / Garden Dinner Experience',
              cost: Math.round(baseStandard * 0.06),
              description: 'Full course dinner with barbecue counters and regional signature preparations.',
            },
          ],
        },
        transit: {
          type: 'Dedicated Private AC Sedan with Chauffeur',
          cost: Math.round(baseStandard * 0.18),
          items: [
            {
              name: 'Full Day Dedicated Private AC Cab (Swift Dzire / Etios)',
              cost: Math.round(baseStandard * 0.18),
              description: 'Door-to-door private cab covering 8 hours / 80km sightseeing with experienced local driver.',
              tip: 'Tolls, parking fees, and driver allowances included.',
            },
          ],
        },
        sightseeing: {
          cost: Math.round(baseStandard * 0.08),
          items: [
            {
              name: 'Guided Plantation Tour & Elephant Sanctuary Access',
              cost: Math.round(baseStandard * 0.08),
              description: 'Express entry passes, guided coffee-tasting tour and boating tickets.',
            },
          ],
        },
        misc: {
          cost: Math.round(baseStandard * 0.04),
          items: [
            {
              name: 'Souvenirs, Artisanal Coffee Beans & Tips',
              cost: Math.round(baseStandard * 0.04),
              description: 'Fresh organic spices, homemade chocolates & souvenir shopping.',
            },
          ],
        },
        tips: [
          'Pre-book your private cab through MG Travels for verified chauffeurs and fixed non-surge tariffs.',
          'Take advantage of resort amenities like swimming pools and complimentary high-tea hours.',
          'Purchase certified estate single-origin coffee beans directly from registered planters.',
        ],
        sampleRoutine: [
          '08:30 AM: Sumptuous buffet breakfast at resort terrace',
          '09:45 AM: Private AC cab pickup for full-day sightseeing loop',
          '01:30 PM: Garden dining at colonial heritage bistro',
          '03:30 PM: Naturalist-guided coffee plantation walk & bean tasting',
          '06:30 PM: Sunset viewpoint photoshoot with tea stall snacks',
          '08:30 PM: Dinner under the stars with bonfire at resort',
        ],
      };
    }

    // Luxury Tier
    return {
      title: 'Luxury Heritage Escape',
      subtitle: '5★ Luxury Villas, private plunge pools, gourmet chefs & VIP private transfers',
      dailyRate: baseLuxury,
      colorTheme: {
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        border: 'border-amber-500/40',
        text: 'text-amber-400',
        accentBg: 'bg-amber-950/30',
        gradient: 'from-amber-500 to-orange-500',
      },
      stay: {
        type: '5★ Luxury Palace / Private Plunge Pool Estate Villa',
        cost: Math.round(baseLuxury * 0.52),
        items: [
          {
            name: 'Presidential / Pool Villa (Taj, Evolve Back, Tamara tier)',
            cost: Math.round(baseLuxury * 0.52),
            description: 'Private jacuzzi/plunge pool, 24-hour personal butler, Ayurvedic spa sessions and luxury toiletries.',
          },
        ],
      },
      food: {
        cost: Math.round(baseLuxury * 0.22),
        items: [
          {
            name: 'Gourmet Chef-Crafted Dining Experiences',
            cost: Math.round(baseLuxury * 0.22),
            description: 'Private candlelight plantation dinner, multi-course tasting menus, vintage wine pairings.',
          },
        ],
      },
      transit: {
        type: 'Luxury SUV / Mercedes Chauffeur Service',
        cost: Math.round(baseLuxury * 0.16),
        items: [
          {
            name: 'Dedicated Luxury SUV (Innova Crysta / Luxury Sedan)',
            cost: Math.round(baseLuxury * 0.16),
            description: 'Round-the-clock VIP private chauffeur with on-board Wi-Fi and chilled refreshments.',
          },
        ],
      },
      sightseeing: {
        cost: Math.round(baseLuxury * 0.06),
        items: [
          {
            name: 'VIP Priority Sightseeing & Private Guide',
            cost: Math.round(baseLuxury * 0.06),
            description: 'Zero-wait VIP access to attractions, private heritage historian tour.',
          },
        ],
      },
      misc: {
        cost: Math.round(baseLuxury * 0.04),
        items: [
          {
            name: 'Luxury Spa Rituals & Premium Shopping',
            cost: Math.round(baseLuxury * 0.04),
            description: 'Signature herbal spa treatment, premium artisanal spice collections.',
          },
        ],
      },
      tips: [
        'Request an elevated hill-facing pool villa for unmatched sunrise panoramas.',
        'Schedule your signature Ayurvedic massage 24 hours in advance.',
      ],
      sampleRoutine: [
        '09:00 AM: Floating champagne breakfast in private pool',
        '10:30 AM: Private luxury SUV transit to historical sanctuary with VIP entry',
        '01:30 PM: Gourmet four-course lunch curated by master chefs',
        '04:00 PM: 90-minute Ayurvedic deep relaxation spa treatment',
        '07:30 PM: Private candlelight dinner in private estate cabana',
      ],
    };
  };

  const tierData = getTierData(selectedTier);

  // Totals calculation
  const totalCost = tierData.dailyRate * days * travelers;
  const stayTotal = tierData.stay.cost * (days > 1 ? days - 1 : 1) * Math.ceil(travelers / 2);
  const foodTotal = tierData.food.cost * days * travelers;
  const transitTotal = tierData.transit.cost * days;
  const sightseeingTotal = tierData.sightseeing.cost * days * travelers;
  const miscTotal = tierData.misc.cost * days * travelers;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        id="budget-tier-breakdown-modal"
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="relative p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 shrink-0">
          <button
            id="close-budget-breakdown-btn"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 mb-2">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>Transparent Itemized Budget Breakdown</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{destination.name} Trip Budget</span>
                <span className="text-sm font-normal text-slate-400">({destination.state})</span>
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Daily Rate (Per Person)
              </span>
              <p className={`text-2xl font-black ${tierData.colorTheme.text}`}>
                {formatPrice(tierData.dailyRate)}
                <span className="text-xs font-normal text-slate-400"> /day</span>
              </p>
            </div>
          </div>

          {/* Tier Switcher Tabs */}
          <div className="grid grid-cols-3 gap-2 mt-5">
            {[
              {
                id: 'budget',
                label: 'Budget Backpacker',
                price: destination.estimatedBudgetPerDay.budget,
                color: 'text-emerald-400',
              },
              {
                id: 'standard',
                label: 'Standard Comfort',
                price: destination.estimatedBudgetPerDay.standard,
                color: 'text-cyan-400',
              },
              {
                id: 'luxury',
                label: 'Luxury Heritage',
                price: destination.estimatedBudgetPerDay.luxury,
                color: 'text-amber-400',
              },
            ].map((t) => {
              const isSelected = selectedTier === t.id;
              return (
                <button
                  key={t.id}
                  id={`budget-select-tier-${t.id}`}
                  onClick={() => setSelectedTier(t.id as TripTier)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 text-slate-400'
                  }`}
                >
                  <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                    {t.label}
                  </p>
                  <p className={`text-sm font-black ${t.color}`}>
                    {formatPrice(t.price)}
                    <span className="text-[10px] font-normal text-slate-400">/d</span>
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-slate-800 bg-slate-900/90 shrink-0">
          {[
            { id: 'breakdown', label: 'Itemized List of the Budget', icon: IndianRupee },
            { id: 'calculator', label: 'Multi-Day Total Calculator', icon: Users },
            { id: 'tips', label: 'Saving Tips & Daily Routine', icon: Lightbulb },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`budget-modal-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: ITEMIZED LIST OF THE BUDGET */}
          {activeTab === 'breakdown' && (
            <div className="space-y-6">
              {/* Overview Banner for Selected Tier */}
              <div className={`p-4 rounded-2xl border ${tierData.colorTheme.border} ${tierData.colorTheme.accentBg} space-y-1.5`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>{tierData.title} Profile</span>
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${tierData.colorTheme.badge}`}>
                    {selectedTier.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {tierData.subtitle}
                </p>
              </div>

              {/* 1. ACCOMMODATION / STAY */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-750 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      <Hotel className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">1. Stay & Accommodation</h4>
                      <p className="text-[11px] text-slate-400">{tierData.stay.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-indigo-300">
                      {formatPrice(tierData.stay.cost)}
                    </span>
                    <span className="text-[10px] text-slate-400"> /night</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {tierData.stay.items.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-850 border border-slate-750 text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold text-slate-200">
                        <span>{item.name}</span>
                        <span className="text-indigo-400 font-bold">{formatPrice(item.cost)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{item.description}</p>
                      {item.tip && (
                        <p className="text-[10px] text-teal-300 font-medium pt-0.5">
                          💡 {item.tip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. FOOD & DINING */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-750 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">2. Daily Food, Tea & Meals</h4>
                      <p className="text-[11px] text-slate-400">Breakfast, regional thalis, snacks & beverages</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-amber-300">
                      {formatPrice(tierData.food.cost)}
                    </span>
                    <span className="text-[10px] text-slate-400"> /day</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {tierData.food.items.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-850 border border-slate-750 text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold text-slate-200">
                        <span>{item.name}</span>
                        <span className="text-amber-400 font-bold">{formatPrice(item.cost)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. LOCAL TRANSIT */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-750 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">3. Local Commute & Sightseeing Transit</h4>
                      <p className="text-[11px] text-slate-400">{tierData.transit.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-cyan-300">
                      {formatPrice(tierData.transit.cost)}
                    </span>
                    <span className="text-[10px] text-slate-400"> /day</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {tierData.transit.items.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-850 border border-slate-750 text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold text-slate-200">
                        <span>{item.name}</span>
                        <span className="text-cyan-400 font-bold">{formatPrice(item.cost)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{item.description}</p>
                      {item.tip && (
                        <p className="text-[10px] text-cyan-300 font-medium pt-0.5">
                          💡 {item.tip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. SIGHTSEEING & TICKETS */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-750 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">4. Sightseeing, Permits & Entry Tickets</h4>
                      <p className="text-[11px] text-slate-400">Waterfalls, parks, viewpoints & estate walks</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-300">
                      {formatPrice(tierData.sightseeing.cost)}
                    </span>
                    <span className="text-[10px] text-slate-400"> /day</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {tierData.sightseeing.items.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-850 border border-slate-750 text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold text-slate-200">
                        <span>{item.name}</span>
                        <span className="text-emerald-400 font-bold">{formatPrice(item.cost)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. MISCELLANEOUS & CONTINGENCY */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-750 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">5. Miscellaneous, Water & Safety Buffer</h4>
                      <p className="text-[11px] text-slate-400">Emergency buffer, mineral water refills & locker fees</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-purple-300">
                      {formatPrice(tierData.misc.cost)}
                    </span>
                    <span className="text-[10px] text-slate-400"> /day</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {tierData.misc.items.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-850 border border-slate-750 text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold text-slate-200">
                        <span>{item.name}</span>
                        <span className="text-purple-400 font-bold">{formatPrice(item.cost)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MULTI-DAY TOTAL CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              {/* Controls */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-750 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Trip Duration (Days)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 7].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDays(d)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                          days === d
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                            : 'bg-slate-850 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Travelers Count</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTravelers(t)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                          travelers === t
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                            : 'bg-slate-850 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        {t} {t === 1 ? 'Solo' : `${t}p`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calculated Breakdown Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-750 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Total Estimated Cost for {days} Days ({travelers} {travelers === 1 ? 'Traveler' : 'Travelers'})
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {tierData.title}
                  </span>
                </div>

                <div className="space-y-3 text-xs text-slate-300 border-b border-slate-800 pb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Hotel className="w-3.5 h-3.5 text-indigo-400" />
                      Accommodation ({days > 1 ? days - 1 : 1} nights)
                    </span>
                    <span className="font-semibold text-white">{formatPrice(stayTotal)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-amber-400" />
                      Food & Signature Meals ({days} days)
                    </span>
                    <span className="font-semibold text-white">{formatPrice(foodTotal)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Bus className="w-3.5 h-3.5 text-cyan-400" />
                      Local Sightseeing Transit & Fuel
                    </span>
                    <span className="font-semibold text-white">{formatPrice(transitTotal)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                      Attractions & Entry Passes
                    </span>
                    <span className="font-semibold text-white">{formatPrice(sightseeingTotal)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      Personal Buffer & Misc
                    </span>
                    <span className="font-semibold text-white">{formatPrice(miscTotal)}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Grand Total Trip Cost
                    </p>
                    <p className="text-2xl font-black text-emerald-400">
                      {formatPrice(totalCost)}
                    </p>
                  </div>

                  {travelers > 1 && (
                    <div className="sm:text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Per Person Share
                      </p>
                      <p className="text-base font-bold text-cyan-300">
                        {formatPrice(Math.round(totalCost / travelers))}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MONEY-SAVING TIPS & SAMPLE ROUTINE */}
          {activeTab === 'tips' && (
            <div className="space-y-6">
              {/* Backpacker Tips */}
              <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-750 space-y-3">
                <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>Money-Saving Hacks for {destination.name}</span>
                </h4>
                <div className="space-y-2">
                  {tierData.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Daily Routine */}
              <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-750 space-y-3">
                <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  <span>Sample Daily Spending & Activity Routine</span>
                </h4>
                <div className="space-y-2">
                  {tierData.sampleRoutine.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-850 border border-slate-750 text-xs text-slate-200">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 hidden sm:block">
            Estimated for <strong className="text-white">{destination.name}</strong> • {days} Days
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onDownloadPDF && (
              <button
                id="modal-budget-pdf-btn"
                onClick={() => {
                  onDownloadPDF(destination);
                  onClose();
                }}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>PDF Schedule</span>
              </button>
            )}

            <button
              id="apply-budget-plan-cta"
              onClick={() => {
                onPlanTrip(destination, selectedTier);
                onClose();
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 hover:opacity-95 flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plan {tierData.title} Trip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
