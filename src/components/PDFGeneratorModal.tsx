import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FileText,
  Download,
  CheckCircle2,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Utensils,
  IndianRupee,
  ShieldCheck,
  Package,
  Layers,
  ArrowRight,
  Eye,
  Check,
  Sliders,
  Users,
  Compass,
  Car,
  Ticket,
  Fuel,
  Info,
  RotateCcw,
  Camera,
  Navigation,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Destination, TripPlan, TripTier, VehicleExpenseConfig, PlaceTicketConfig } from '../types/travel';
import {
  generateItinerary,
  exportItineraryToPDF,
  getDefaultVehicleConfig,
  getDefaultPlaceTickets,
} from '../utils/itineraryPlanner';

interface PDFGeneratorModalProps {
  destination: Destination | null;
  initialPlan?: TripPlan | null;
  initialTier?: TripTier;
  initialDailyBudget?: number;
  initialDays?: number;
  onClose: () => void;
  currency?: 'INR' | 'USD' | 'EUR';
}

export const PDFGeneratorModal: React.FC<PDFGeneratorModalProps> = ({
  destination,
  initialPlan,
  initialTier = 'budget',
  initialDailyBudget,
  initialDays,
  onClose,
  currency = 'INR',
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(initialPlan || null);
  const [activePreviewDay, setActivePreviewDay] = useState<number>(1);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'vehicle' | 'tickets' | 'breakdown' | 'preview'>('overview');

  // Config parameters
  const defaultDaily = initialDailyBudget || destination?.estimatedBudgetPerDay?.budget || 700;
  const [days, setDays] = useState<number>(initialDays || destination?.idealDays || 4);
  const [tripTier, setTripTier] = useState<TripTier>(initialTier || 'budget');
  const [customDailyBudget, setCustomDailyBudget] = useState<number>(defaultDaily);
  const [travelers, setTravelers] = useState<number>(2);

  // Vehicle Expense State in that area
  const [vehicleConfig, setVehicleConfig] = useState<VehicleExpenseConfig>(() =>
    destination
      ? getDefaultVehicleConfig(destination, initialDays || destination?.idealDays || 4, (initialTier as TripTier) || 'budget')
      : {
          vehicleType: 'sedan_cab',
          vehicleName: 'Private AC Sedan Cab (8hr/80km)',
          dailyRate: 2400,
          fuelAndTollsPerDay: 500,
          driverAllowancePerDay: 300,
          totalDays: 4,
          totalVehicleCost: (2400 + 500 + 300) * 4,
          notes: 'Standard tourist taxi with local permits.',
        }
  );

  // Place Ticket Prices State
  const [ticketsConfig, setTicketsConfig] = useState<PlaceTicketConfig[]>(() =>
    destination ? getDefaultPlaceTickets(destination, 2) : []
  );

  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Explicit calculation for Total Vehicle & Entrance Fees Breakdown
  const totalVehicleCost = (vehicleConfig.dailyRate + vehicleConfig.fuelAndTollsPerDay + vehicleConfig.driverAllowancePerDay) * days;
  const totalTicketsCost = ticketsConfig
    .filter((t) => t.included)
    .reduce((acc, curr) => acc + curr.totalForGroup, 0);

  const totalVehicleAndFees = totalVehicleCost + totalTicketsCost;
  const perPersonVehicleAndFees = Math.round(totalVehicleAndFees / Math.max(1, travelers));
  const perDayVehicleAndFees = Math.round(totalVehicleAndFees / Math.max(1, days));
  const includedAttractionsCount = ticketsConfig.filter((t) => t.included).length;

  const generationSteps = [
    { title: 'Geocoding Attractions & Place Photography', desc: `Fetching high-resolution landmark photos for ${destination?.name || 'destination'}` },
    { title: 'Calculating Local Vehicle & Commute Tariffs', desc: 'Synthesizing area taxi rates, autos, fuel & parking costs' },
    { title: 'Itemizing Attraction Ticket Prices & Entry Fees', desc: 'Compiling adult tickets, child concessions & camera permits' },
    { title: 'Finalizing Vector Document & Place Gallery', desc: 'Embedding verified tariffs, climate guidelines & SOS helplines' },
  ];

  // Recalculate vehicle total whenever vehicle config or days change
  useEffect(() => {
    if (!destination) return;
    setVehicleConfig((prev) => {
      const totalDays = days;
      const totalVehicleCost = (prev.dailyRate + prev.fuelAndTollsPerDay + prev.driverAllowancePerDay) * totalDays;
      return { ...prev, totalDays, totalVehicleCost };
    });
  }, [days]);

  // Recalculate ticket totals for group whenever travelers change
  useEffect(() => {
    if (!destination) return;
    setTicketsConfig((prev) =>
      prev.map((t) => ({
        ...t,
        totalForGroup: t.included ? t.adultTicket * travelers + t.cameraFee : 0,
      }))
    );
  }, [travelers]);

  // Re-generate plan whenever parameters change
  useEffect(() => {
    if (!destination) return;

    const plan = generateItinerary({
      destination,
      days,
      tripTier,
      customDailyBudget,
      travelersCount: travelers,
      travelerType: travelers === 1 ? 'solo' : travelers === 2 ? 'couple' : 'friends',
      interests: ['Sightseeing', 'Nature', 'Culture', 'Local Food'],
      startDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      vehicleConfig,
      ticketsConfig,
    });

    setCurrentPlan(plan);
  }, [destination, days, tripTier, customDailyBudget, travelers, vehicleConfig, ticketsConfig]);

  // Animated progress bar on modal load
  useEffect(() => {
    if (!destination) return;

    let currentP = 0;
    const interval = setInterval(() => {
      currentP += 25;
      setProgress(currentP);

      if (currentP === 25) setActiveStep(1);
      else if (currentP === 50) setActiveStep(2);
      else if (currentP === 75) setActiveStep(3);
      else if (currentP >= 100) {
        clearInterval(interval);
        setIsGenerating(false);
        setActiveStep(4);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [destination]);

  if (!destination) return null;

  const handleDownload = async () => {
    if (currentPlan && destination) {
      try {
        setIsDownloading(true);
        await exportItineraryToPDF(currentPlan, destination, vehicleConfig, ticketsConfig);
        setIsDownloaded(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.error('PDF export error:', err);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const formatPrice = (inr: number) => {
    if (currency === 'USD') return `$${Math.round(inr / 85).toLocaleString()}`;
    if (currency === 'EUR') return `€${Math.round(inr / 92).toLocaleString()}`;
    return `₹${inr.toLocaleString()}`;
  };

  const handleSelectTierPreset = (tier: TripTier) => {
    setTripTier(tier);
    if (tier === 'budget') {
      const budgetRate = destination.estimatedBudgetPerDay?.budget || 700;
      setCustomDailyBudget(budgetRate);
    } else if (tier === 'standard') {
      const stdRate = destination.estimatedBudgetPerDay?.standard || 3500;
      setCustomDailyBudget(stdRate);
    } else {
      const luxRate = destination.estimatedBudgetPerDay?.luxury || 14000;
      setCustomDailyBudget(luxRate);
    }
    const defaultVeh = getDefaultVehicleConfig(destination, days, tier);
    setVehicleConfig(defaultVeh);
  };

  // Vehicle Preset Quick Select
  const handleSelectVehiclePreset = (type: VehicleExpenseConfig['vehicleType']) => {
    let name = '';
    let daily = 2000;
    let fuelTolls = 400;
    let bata = 300;
    let notes = '';

    if (type === 'auto') {
      name = 'Local Auto-Rickshaw & Tuk-Tuk Full-Day';
      daily = 900;
      fuelTolls = 150;
      bata = 0;
      notes = 'Convenient for local market sightseeing, heritage alleys and temples.';
    } else if (type === 'sedan_cab') {
      name = 'Private AC Sedan Cab (Dzire / Etios - 8hr/80km)';
      daily = 2400;
      fuelTolls = 500;
      bata = 300;
      notes = 'Dedicated chauffeur cab with local sightseeing permits & luggage space.';
    } else if (type === 'suv_cab') {
      name = 'Chauffeur-Driven AC SUV (Innova Crysta / Ertiga)';
      daily = 4200;
      fuelTolls = 800;
      bata = 400;
      notes = 'Spacious & powerful for ghat roads, mountain terrain and group travel.';
    } else if (type === 'self_drive') {
      name = 'Self-Drive Car (Swift / Baleno / Thar)';
      daily = 1800;
      fuelTolls = 600;
      bata = 0;
      notes = 'Independent self-drive rental with unlimited km. Fuel extra as per usage.';
    } else if (type === 'scooter') {
      name = 'Two-Wheeler / Scooter Rental (Activa / Royal Enfield)';
      daily = 500;
      fuelTolls = 200;
      bata = 0;
      notes = 'Agile and budget-friendly for couples/solo travelers. Helmet mandatory.';
    } else {
      name = 'Local Public Transit & Shared Jeep Pass';
      daily = 250;
      fuelTolls = 50;
      bata = 0;
      notes = 'State transport buses and local shuttle jeeps between towns.';
    }

    setVehicleConfig({
      vehicleType: type,
      vehicleName: name,
      dailyRate: daily,
      fuelAndTollsPerDay: fuelTolls,
      driverAllowancePerDay: bata,
      totalDays: days,
      totalVehicleCost: (daily + fuelTolls + bata) * days,
      notes,
    });
  };

  // Ticket updates
  const handleUpdateTicket = (placeId: string, field: 'adultTicket' | 'childTicket' | 'cameraFee', value: number) => {
    setTicketsConfig((prev) =>
      prev.map((item) => {
        if (item.placeId === placeId) {
          const updated = { ...item, [field]: Math.max(0, value) };
          const rowCost = updated.included ? updated.adultTicket * travelers + updated.cameraFee : 0;
          return { ...updated, totalForGroup: rowCost };
        }
        return item;
      })
    );
  };

  const handleToggleTicketInclude = (placeId: string) => {
    setTicketsConfig((prev) =>
      prev.map((item) => {
        if (item.placeId === placeId) {
          const included = !item.included;
          const rowCost = included ? item.adultTicket * travelers + item.cameraFee : 0;
          return { ...item, included, totalForGroup: rowCost };
        }
        return item;
      })
    );
  };

  const handleToggleAllTickets = (includeAll: boolean) => {
    setTicketsConfig((prev) =>
      prev.map((item) => {
        const rowCost = includeAll ? item.adultTicket * travelers + item.cameraFee : 0;
        return { ...item, included: includeAll, totalForGroup: rowCost };
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        id="pdf-generator-modal"
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[94vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                  Vehicle & Ticket Cost PDF Engine
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {destination.name}, {destination.state}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Customize Vehicle Expenses & Attraction Ticket Prices for PDF
              </h2>
            </div>
          </div>

          <button
            id="close-pdf-modal-btn"
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Controls */}
        <div className="px-4 sm:px-6 pt-3 pb-2 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>1. Trip Setup & Days</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vehicle')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'vehicle'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>2. Vehicle Expense ({formatPrice(totalVehicleCost)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tickets')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'tickets'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>3. Place Tickets ({formatPrice(totalTicketsCost)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('breakdown')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'breakdown'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20 font-black'
                : 'bg-slate-800/80 text-teal-300 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>4. Total Vehicle & Entrance Fees ({formatPrice(totalVehicleAndFees)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>5. Day Preview</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW & TRIP SETUP */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-850 border border-slate-750 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-750 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">General PDF Trip Parameters</h3>
                  </div>
                  <span className="text-xs text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                    Live Calculation Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* Duration in Days */}
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Duration (Days):</span>
                    </label>
                    <div className="flex items-center gap-1">
                      {[2, 3, 4, 5, 7].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setDays(num)}
                          className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-all ${
                            days === num
                              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {num}D
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trip Tier Presets */}
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Budget Tier Preset:</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSelectTierPreset('budget')}
                        className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          tripTier === 'budget'
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        Backpacker
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectTierPreset('standard')}
                        className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          tripTier === 'standard'
                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        Standard
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectTierPreset('luxury')}
                        className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          tripTier === 'luxury'
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        Luxury
                      </button>
                    </div>
                  </div>

                  {/* Daily Budget Input */}
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5 text-teal-400" />
                      <span>Daily Budget Rate / Pax:</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min="100"
                        step="50"
                        value={customDailyBudget}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            setCustomDailyBudget(val);
                          }
                        }}
                        className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:ring-2 focus:ring-cyan-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Travelers count */}
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Travelers:</span>
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 6].map((cnt) => (
                        <button
                          key={cnt}
                          type="button"
                          onClick={() => setTravelers(cnt)}
                          className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-all ${
                            travelers === cnt
                              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {cnt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Summary Cards with vehicle & ticket highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div
                  onClick={() => setActiveTab('vehicle')}
                  className="p-4 rounded-2xl bg-slate-850 border border-amber-500/30 hover:border-amber-500/60 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Car className="w-4 h-4" /> Vehicle Commute
                    </span>
                    <span className="text-[10px] text-slate-400 underline">Edit ➔</span>
                  </div>
                  <p className="text-base font-black text-white">{formatPrice(totalVehicleCost)}</p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {vehicleConfig.vehicleName} ({formatPrice(vehicleConfig.dailyRate)}/day)
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('tickets')}
                  className="p-4 rounded-2xl bg-slate-850 border border-emerald-500/30 hover:border-emerald-500/60 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Ticket className="w-4 h-4" /> Entrance Tickets
                    </span>
                    <span className="text-[10px] text-slate-400 underline">Edit ➔</span>
                  </div>
                  <p className="text-base font-black text-white">{formatPrice(totalTicketsCost)}</p>
                  <p className="text-[11px] text-slate-400">
                    {includedAttractionsCount} Attractions ({travelers} Pax)
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('breakdown')}
                  className="p-4 rounded-2xl bg-slate-850 border border-teal-500/40 hover:border-teal-500/70 transition-all cursor-pointer space-y-1 bg-gradient-to-br from-teal-950/20 to-slate-850"
                >
                  <div className="flex items-center justify-between text-xs text-teal-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4" /> Total Vehicle & Fees
                    </span>
                    <span className="text-[10px] text-teal-300 underline font-bold">View Breakdown ➔</span>
                  </div>
                  <p className="text-base font-black text-teal-300">{formatPrice(totalVehicleAndFees)}</p>
                  <p className="text-[11px] text-slate-400">
                    {formatPrice(perPersonVehicleAndFees)}/pax • {formatPrice(perDayVehicleAndFees)}/day
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-850 border border-cyan-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs text-cyan-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <IndianRupee className="w-4 h-4" /> Grand Total Trip PDF
                    </span>
                  </div>
                  <p className="text-base font-black text-cyan-300">
                    {currentPlan ? formatPrice(currentPlan.budgetBreakdown.total) : '...'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {currentPlan ? `${formatPrice(currentPlan.budgetBreakdown.perPersonCost)} / person` : ''}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOCAL VEHICLE EXPENSE IN THAT AREA */}
          {activeTab === 'vehicle' && (
            <div className="space-y-5">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-850 border border-slate-750 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-750 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">
                      Local Vehicle Selection & Regional Commute Tariff ({destination.name})
                    </h3>
                  </div>
                  <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    {days} Days Commute
                  </span>
                </div>

                {/* Quick Vehicle Presets Grid */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Choose Vehicle Type in {destination.name}:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <button
                      type="button"
                      onClick={() => handleSelectVehiclePreset('auto')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        vehicleConfig.vehicleType === 'auto'
                          ? 'bg-amber-500/20 border-amber-500 text-white'
                          : 'bg-slate-900 border-slate-750 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <p className="font-bold flex items-center gap-1.5 text-amber-300">
                        🛺 Auto Rickshaw
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">₹900/day • Short hops & town</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectVehiclePreset('sedan_cab')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        vehicleConfig.vehicleType === 'sedan_cab'
                          ? 'bg-cyan-500/20 border-cyan-500 text-white'
                          : 'bg-slate-900 border-slate-750 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <p className="font-bold flex items-center gap-1.5 text-cyan-300">
                        🚗 AC Sedan Cab (8hr/80km)
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">₹2,400/day • Dzire / Etios</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectVehiclePreset('suv_cab')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        vehicleConfig.vehicleType === 'suv_cab'
                          ? 'bg-indigo-500/20 border-indigo-500 text-white'
                          : 'bg-slate-900 border-slate-750 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <p className="font-bold flex items-center gap-1.5 text-indigo-300">
                        🚙 AC SUV / Innova
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">₹4,200/day • Hills & 4-7 Pax</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectVehiclePreset('self_drive')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        vehicleConfig.vehicleType === 'self_drive'
                          ? 'bg-teal-500/20 border-teal-500 text-white'
                          : 'bg-slate-900 border-slate-750 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <p className="font-bold flex items-center gap-1.5 text-teal-300">
                        🚘 Self-Drive Car
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">₹1,800/day • Swift / Thar</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectVehiclePreset('scooter')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        vehicleConfig.vehicleType === 'scooter'
                          ? 'bg-emerald-500/20 border-emerald-500 text-white'
                          : 'bg-slate-900 border-slate-750 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <p className="font-bold flex items-center gap-1.5 text-emerald-300">
                        🛵 Two-Wheeler / Scooter
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">₹500/day • Activa / Bike</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectVehiclePreset('public_transit')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        vehicleConfig.vehicleType === 'public_transit'
                          ? 'bg-purple-500/20 border-purple-500 text-white'
                          : 'bg-slate-900 border-slate-750 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <p className="font-bold flex items-center gap-1.5 text-purple-300">
                        🚌 Local Bus & Metro Pass
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">₹250/day • Shared transit</p>
                    </button>
                  </div>
                </div>

                {/* Granular Vehicle Expense Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Daily Base Rental / Taxi Fare:</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={vehicleConfig.dailyRate}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          setVehicleConfig((prev) => {
                            const totalVehicleCost = (val + prev.fuelAndTollsPerDay + prev.driverAllowancePerDay) * days;
                            return { ...prev, dailyRate: val, totalVehicleCost };
                          });
                        }}
                        className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Fuel, Tolls & Parking / Day:</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={vehicleConfig.fuelAndTollsPerDay}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          setVehicleConfig((prev) => {
                            const totalVehicleCost = (prev.dailyRate + val + prev.driverAllowancePerDay) * days;
                            return { ...prev, fuelAndTollsPerDay: val, totalVehicleCost };
                          });
                        }}
                        className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Driver Allowance / Bata / Day:</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={vehicleConfig.driverAllowancePerDay}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          setVehicleConfig((prev) => {
                            const totalVehicleCost = (prev.dailyRate + prev.fuelAndTollsPerDay + val) * days;
                            return { ...prev, driverAllowancePerDay: val, totalVehicleCost };
                          });
                        }}
                        className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Calculation Summary Bar */}
                <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-300 font-medium">
                      ({formatPrice(vehicleConfig.dailyRate)} base + {formatPrice(vehicleConfig.fuelAndTollsPerDay)} fuel/parking + {formatPrice(vehicleConfig.driverAllowancePerDay)} bata) × {days} days
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold">Total Vehicle Expense in {destination.name}:</span>
                    <span className="text-base font-black text-amber-300">
                      {formatPrice(vehicleConfig.totalVehicleCost)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ATTRACTION TICKET PRICES OF THAT PLACE */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-850 border border-slate-750 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-750 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">
                      Place Ticket Prices & Entry Fees ({destination.name})
                    </h3>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {travelers} Travelers
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  Adjust official admission tickets, student discounts, or camera permits for each landmark. These verified ticket prices will be printed directly in your PDF report.
                </p>

                {/* Places Ticket Table */}
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {ticketsConfig.map((item) => (
                    <div
                      key={item.placeId}
                      className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                        item.included
                          ? 'bg-slate-900 border-slate-750'
                          : 'bg-slate-950/60 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={item.included}
                          onChange={() => handleToggleTicketInclude(item.placeId)}
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">{item.placeName}</p>
                          <p className="text-[10px] text-slate-400">
                            {item.category} • Hours: {item.timings || '09:00 AM - 05:30 PM'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        {/* Adult Ticket */}
                        <div className="space-y-0.5">
                          <label className="text-[10px] text-slate-400">Adult (₹):</label>
                          <input
                            type="number"
                            min="0"
                            value={item.adultTicket}
                            disabled={!item.included}
                            onChange={(e) =>
                              handleUpdateTicket(item.placeId, 'adultTicket', Number(e.target.value) || 0)
                            }
                            className="w-16 px-2 py-1 bg-slate-800 rounded-lg border border-slate-700 text-white font-bold text-center text-xs"
                          />
                        </div>

                        {/* Child Ticket */}
                        <div className="space-y-0.5">
                          <label className="text-[10px] text-slate-400">Child (₹):</label>
                          <input
                            type="number"
                            min="0"
                            value={item.childTicket}
                            disabled={!item.included}
                            onChange={(e) =>
                              handleUpdateTicket(item.placeId, 'childTicket', Number(e.target.value) || 0)
                            }
                            className="w-16 px-2 py-1 bg-slate-800 rounded-lg border border-slate-700 text-white font-bold text-center text-xs"
                          />
                        </div>

                        {/* Camera Fee */}
                        <div className="space-y-0.5">
                          <label className="text-[10px] text-slate-400">Camera (₹):</label>
                          <input
                            type="number"
                            min="0"
                            value={item.cameraFee}
                            disabled={!item.included}
                            onChange={(e) =>
                              handleUpdateTicket(item.placeId, 'cameraFee', Number(e.target.value) || 0)
                            }
                            className="w-16 px-2 py-1 bg-slate-800 rounded-lg border border-slate-700 text-white font-bold text-center text-xs"
                          />
                        </div>

                        {/* Subtotal */}
                        <div className="min-w-20 text-right">
                          <span className="text-[10px] text-slate-400 block">Group Total:</span>
                          <span className="font-bold text-emerald-400 text-xs">
                            {item.included ? formatPrice(item.totalForGroup) : 'Excluded'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal Pill */}
                <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <span className="text-slate-300">
                    Total Admission Tickets ({includedAttractionsCount} Attractions for {travelers} Pax):
                  </span>
                  <span className="text-base font-black text-emerald-300">
                    {formatPrice(totalTicketsCost)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TOTAL VEHICLE & ENTRANCE FEES COMBINED BREAKDOWN */}
          {activeTab === 'breakdown' && (
            <div className="space-y-5">
              {/* Header Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-850 border border-teal-500/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-750 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-teal-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Total Vehicle & Entrance Fees Breakdown ({destination.name})
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Synthesized commute tariffs and admission tickets based on {days} days & {travelers} travelers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs text-teal-400 font-bold bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/30">
                      Live Export Sync
                    </span>
                  </div>
                </div>

                {/* 4 Summary Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Card 1: Total Vehicle Commute */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5" /> Total Vehicle Fees
                      </span>
                    </div>
                    <p className="text-lg font-black text-white">{formatPrice(totalVehicleCost)}</p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {vehicleConfig.vehicleName.split('(')[0]} ({days} Days)
                    </p>
                  </div>

                  {/* Card 2: Total Entrance Fees */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Ticket className="w-3.5 h-3.5" /> Total Entrance Fees
                      </span>
                    </div>
                    <p className="text-lg font-black text-white">{formatPrice(totalTicketsCost)}</p>
                    <p className="text-[10px] text-slate-400">
                      {includedAttractionsCount} Sights for {travelers} Pax
                    </p>
                  </div>

                  {/* Card 3: Combined Vehicle & Fees */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-950/60 to-slate-900 border border-teal-500/40 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-teal-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" /> Combined Vehicle & Fees
                      </span>
                    </div>
                    <p className="text-lg font-black text-teal-300">{formatPrice(totalVehicleAndFees)}</p>
                    <p className="text-[10px] text-slate-300 font-medium">
                      {formatPrice(perPersonVehicleAndFees)}/pax • {formatPrice(perDayVehicleAndFees)}/day
                    </p>
                  </div>

                  {/* Card 4: Share of Trip Budget */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-cyan-400 font-bold">
                      <span className="flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5" /> PDF Budget Share
                      </span>
                    </div>
                    <p className="text-lg font-black text-cyan-300">
                      {currentPlan ? `${Math.round((totalVehicleAndFees / currentPlan.budgetBreakdown.total) * 100)}%` : '...'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Of total {currentPlan ? formatPrice(currentPlan.budgetBreakdown.total) : ''}
                    </p>
                  </div>
                </div>

                {/* Visual Ratio Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                      Vehicle: {formatPrice(totalVehicleCost)} ({totalVehicleAndFees > 0 ? Math.round((totalVehicleCost / totalVehicleAndFees) * 100) : 0}%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                      Tickets: {formatPrice(totalTicketsCost)} ({totalVehicleAndFees > 0 ? Math.round((totalTicketsCost / totalVehicleAndFees) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden flex">
                    <div
                      style={{
                        width: `${totalVehicleAndFees > 0 ? (totalVehicleCost / totalVehicleAndFees) * 100 : 50}%`,
                      }}
                      className="bg-amber-400 h-full transition-all duration-300"
                    />
                    <div
                      style={{
                        width: `${totalVehicleAndFees > 0 ? (totalTicketsCost / totalVehicleAndFees) * 100 : 50}%`,
                      }}
                      className="bg-emerald-400 h-full transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Itemized Side-by-Side Breakdown Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Column 1: Vehicle Commute Itemized */}
                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-750 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                        <Car className="w-4 h-4" />
                        <span>Vehicle Commute Itemized ({days} Days)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('vehicle')}
                        className="text-[10px] text-amber-400 hover:underline font-bold"
                      >
                        Change Vehicle ➔
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-300 font-medium">Selected Vehicle</span>
                        <span className="text-white font-bold truncate max-w-44 text-right">
                          {vehicleConfig.vehicleName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-300">
                          Base Rental ({formatPrice(vehicleConfig.dailyRate)} × {days}D)
                        </span>
                        <span className="text-white font-bold">
                          {formatPrice(vehicleConfig.dailyRate * days)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-300">
                          Fuel, Tolls & Parking ({formatPrice(vehicleConfig.fuelAndTollsPerDay)} × {days}D)
                        </span>
                        <span className="text-white font-bold">
                          {formatPrice(vehicleConfig.fuelAndTollsPerDay * days)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-slate-300">
                          Driver Allowance / Bata ({formatPrice(vehicleConfig.driverAllowancePerDay)} × {days}D)
                        </span>
                        <span className="text-white font-bold">
                          {formatPrice(vehicleConfig.driverAllowancePerDay * days)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-xs font-bold mt-2">
                    <span className="text-slate-300">Subtotal Vehicle Commute:</span>
                    <span className="text-amber-300">{formatPrice(totalVehicleCost)}</span>
                  </div>
                </div>

                {/* Column 2: Sightseeing Attractions Itemized */}
                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-750 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                        <Ticket className="w-4 h-4" />
                        <span>Included Attraction Tickets ({includedAttractionsCount} Sights)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleAllTickets(true)}
                          className="text-[10px] text-emerald-400 hover:underline font-semibold"
                        >
                          All
                        </button>
                        <span className="text-slate-600">|</span>
                        <button
                          type="button"
                          onClick={() => handleToggleAllTickets(false)}
                          className="text-[10px] text-slate-400 hover:underline font-semibold"
                        >
                          None
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                      {ticketsConfig.map((item) => (
                        <div
                          key={item.placeId}
                          className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-all ${
                            item.included
                              ? 'bg-slate-900 border-slate-800'
                              : 'bg-slate-950/40 border-slate-850 opacity-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={item.included}
                              onChange={() => handleToggleTicketInclude(item.placeId)}
                              className="w-3.5 h-3.5 rounded text-emerald-500 cursor-pointer"
                            />
                            <div>
                              <p className="font-bold text-white text-[11px] truncate max-w-40">
                                {item.placeName}
                              </p>
                              <p className="text-[9px] text-slate-400">
                                {item.category} • Adult: ₹{item.adultTicket}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-emerald-400 text-xs">
                            {item.included ? formatPrice(item.totalForGroup) : 'Excluded'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs font-bold mt-2">
                    <span className="text-slate-300">Subtotal Sightseeing Tickets:</span>
                    <span className="text-emerald-300">{formatPrice(totalTicketsCost)}</span>
                  </div>
                </div>
              </div>

              {/* Verified PDF Assurance Callout */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-cyan-950/40 border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white">
                      Verified Total Vehicle & Entrance Fees ({formatPrice(totalVehicleAndFees)})
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Exported PDF will print the exact vehicle breakdown ({days}D) and attraction ticket items with full mathematical accuracy.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-all shrink-0 cursor-pointer"
                >
                  View Day-Wise Schedule ➔
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: INTERACTIVE PREVIEW & SUMMARY */}
          {activeTab === 'preview' && currentPlan && (
            <div className="space-y-5">
              {/* Itemized Budget Breakdown Card Matching exact inputs */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-750 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Complete Itemized Budget Breakdown ({currentPlan.totalDays} Days)</span>
                  </h4>
                  <span className="text-xs font-bold text-emerald-400">
                    Grand Total: {formatPrice(currentPlan.budgetBreakdown.total)}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-750">
                    <p className="text-[10px] text-slate-400">🚗 Vehicle Commute</p>
                    <p className="font-bold text-amber-300">{formatPrice(totalVehicleCost)}</p>
                    <p className="text-[9px] text-slate-500">{formatPrice(Math.round(totalVehicleCost / days))}/day</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-750">
                    <p className="text-[10px] text-slate-400">🎟️ Place Tickets</p>
                    <p className="font-bold text-emerald-300">{formatPrice(totalTicketsCost)}</p>
                    <p className="text-[9px] text-slate-500">{includedAttractionsCount} sights</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-750">
                    <p className="text-[10px] text-slate-400">🏨 Stay / Hotel</p>
                    <p className="font-bold text-indigo-300">{formatPrice(currentPlan.budgetBreakdown.hotel)}</p>
                    <p className="text-[9px] text-slate-500">{formatPrice(Math.round(currentPlan.budgetBreakdown.hotel / currentPlan.totalDays))}/night</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-750">
                    <p className="text-[10px] text-slate-400">🍲 Food & Dining</p>
                    <p className="font-bold text-cyan-300">{formatPrice(currentPlan.budgetBreakdown.food)}</p>
                    <p className="text-[9px] text-slate-500">{formatPrice(Math.round(currentPlan.budgetBreakdown.food / currentPlan.totalDays))}/day</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-750 col-span-2 sm:col-span-1">
                    <p className="text-[10px] text-slate-400">🎒 Misc & Water</p>
                    <p className="font-bold text-purple-300">{formatPrice(currentPlan.budgetBreakdown.miscellaneous)}</p>
                    <p className="text-[9px] text-slate-500">Buffer</p>
                  </div>
                </div>
              </div>

              {/* Day selector tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {currentPlan.itinerary.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setActivePreviewDay(day.day)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      activePreviewDay === day.day
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    <span>Day {day.day}</span>
                    <span className="text-[10px] opacity-80">({day.date?.split(',')[0]})</span>
                  </button>
                ))}
              </div>

              {/* Active Day Card */}
              {(() => {
                const day =
                  currentPlan.itinerary.find((d) => d.day === activePreviewDay) ||
                  currentPlan.itinerary[0];
                if (!day) return null;

                return (
                  <div className="p-5 rounded-3xl bg-slate-800/60 border border-slate-750 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
                      <div>
                        <h5 className="font-bold text-white text-sm sm:text-base">
                          Day {day.day}: {day.theme}
                        </h5>
                        <p className="text-xs text-cyan-400">{day.date}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 self-start sm:self-auto">
                        Est. Cost: {formatPrice(day.dailyCostEstimate)}
                      </span>
                    </div>

                    {/* Time blocks with vehicle commute and ticket info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-300">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Morning Slot (08:30 AM)</span>
                        </div>
                        <p className="text-slate-200 font-medium">{day.morningSlot.activity}</p>
                        <p className="text-[10px] text-slate-400">🚗 {day.morningSlot.travelDuration}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Afternoon Slot (01:30 PM)</span>
                        </div>
                        <p className="text-slate-200 font-medium">{day.afternoonSlot.activity}</p>
                        <p className="text-[10px] text-slate-400">🚗 {day.afternoonSlot.travelDuration}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Evening Slot (05:30 PM)</span>
                        </div>
                        <p className="text-slate-200 font-medium">{day.eveningSlot.activity}</p>
                        <p className="text-[10px] text-slate-400">🚗 {day.eveningSlot.travelDuration}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300 pt-2 border-t border-slate-700/60">
                      <div className="flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span><strong>Signature Meal:</strong> {day.recommendedFood}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 italic">{day.notes}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Footer Action Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
            <span>
              Total Vehicle & Entrance Fees: <strong className="text-teal-300">{formatPrice(totalVehicleAndFees)}</strong> (Vehicle: {formatPrice(totalVehicleCost)} + Tickets: {formatPrice(totalTicketsCost)})
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'overview') setActiveTab('vehicle');
                else if (activeTab === 'vehicle') setActiveTab('tickets');
                else if (activeTab === 'tickets') setActiveTab('breakdown');
                else if (activeTab === 'breakdown') setActiveTab('preview');
                else setActiveTab('overview');
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              {activeTab === 'breakdown' ? 'Preview Day Schedule ➔' : 'Next Step ➔'}
            </button>

            <button
              id="modal-download-pdf-now-btn"
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Compiling PDF with Vehicle & Tickets...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>{isDownloaded ? 'Download Updated PDF' : 'Download Complete PDF'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
