import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Users,
  Sparkles,
  Download,
  Bookmark,
  Share2,
  Clock,
  MapPin,
  Utensils,
  IndianRupee,
  Layers,
  CheckCircle2,
  FileText,
  DollarSign,
  Euro,
  Compass,
  ArrowRight,
  ShieldCheck,
  Package,
  Eye,
  Ticket,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Destination, TripPlan, TripTier, UserProfile } from '../types/travel';
import { generateItinerary, exportItineraryToPDF } from '../utils/itineraryPlanner';
import { PDFGeneratorModal } from './PDFGeneratorModal';

interface TripPlannerViewProps {
  destinations: Destination[];
  activeDestination: Destination | null;
  user: UserProfile | null;
  currency: 'INR' | 'USD' | 'EUR';
  onTripSaved: (trip: TripPlan) => void;
  onOpenAuth: () => void;
  selectedTier?: TripTier;
  onBookTrip?: (
    destination: Destination,
    travelMode?: 'flight' | 'train' | 'car' | 'bus',
    origin?: string,
    initialStep?: number,
    tier?: 'budget' | 'standard' | 'luxury',
    budgetLimit?: number
  ) => void;
}

export const TripPlannerView: React.FC<TripPlannerViewProps> = ({
  destinations,
  activeDestination,
  user,
  currency,
  onTripSaved,
  onOpenAuth,
  selectedTier,
  onBookTrip,
}) => {
  const [selectedDestId, setSelectedDestId] = useState<string>(
    activeDestination?.id || destinations[0]?.id || 'coorg'
  );
  const [days, setDays] = useState<number>(activeDestination?.idealDays || 4);
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [travelerType, setTravelerType] = useState<'solo' | 'couple' | 'family' | 'friends'>('couple');
  const [tripTier, setTripTier] = useState<TripTier>(selectedTier || 'standard');
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Nature',
    'Local Food',
    'Sightseeing',
  ]);

  const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [activeFilterDay, setActiveFilterDay] = useState<number | 'all'>('all');

  // Sync if activeDestination or selectedTier changes
  useEffect(() => {
    if (activeDestination) {
      setSelectedDestId(activeDestination.id);
      setDays(activeDestination.idealDays || 4);
    }
  }, [activeDestination]);

  useEffect(() => {
    if (selectedTier) {
      setTripTier(selectedTier);
    }
  }, [selectedTier]);

  const currentDestination =
    destinations.find((d) => d.id === selectedDestId) || destinations[0];

  const handleGeneratePlan = () => {
    if (!currentDestination) return;

    const plan = generateItinerary({
      destination: currentDestination,
      days,
      tripTier,
      travelersCount,
      travelerType,
      interests: selectedInterests,
      startDate,
    });

    setCurrentPlan(plan);
    setSaveSuccess(false);
    setActiveFilterDay('all');

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  // Generate on first mount
  useEffect(() => {
    if (!currentPlan && currentDestination) {
      handleGeneratePlan();
    }
  }, [currentDestination]);

  const handleSaveToAccount = async () => {
    if (!currentPlan) return;
    if (!user) {
      onOpenAuth();
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...currentPlan,
        username: user.email,
      };

      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveSuccess(true);
        onTripSaved(currentPlan);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
        });
      }
    } catch (e) {
      console.error('Failed to save trip', e);
    } finally {
      setIsSaving(false);
    }
  };

  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleDirectDownloadPDF = async () => {
    if (currentPlan && currentDestination) {
      try {
        setIsExportingPDF(true);
        await exportItineraryToPDF(currentPlan, currentDestination);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.error('Failed to export PDF:', e);
      } finally {
        setIsExportingPDF(false);
      }
    }
  };

  const formatPrice = (inr: number) => {
    if (currency === 'USD') return `$${Math.round(inr / 85).toLocaleString()}`;
    if (currency === 'EUR') return `€${Math.round(inr / 92).toLocaleString()}`;
    return `₹${inr.toLocaleString()}`;
  };

  const displayedDays =
    activeFilterDay === 'all'
      ? currentPlan?.itinerary || []
      : (currentPlan?.itinerary || []).filter((d) => d.day === activeFilterDay);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* View Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Day-by-Day Route & Budget Optimization
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Smart Trip Planner & Itinerary Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Auto-clusters nearby attractions, balances morning/evening schedules, calculates exact budgets, and exports printable PDFs.
          </p>
        </div>

        {currentPlan && (
          <div className="flex items-center gap-2 flex-wrap">
            {onBookTrip && currentDestination && (
              <button
                id="planner-book-trip-top-cta"
                onClick={() =>
                  onBookTrip(
                    currentDestination,
                    'flight',
                    'Bengaluru',
                    5,
                    currentPlan.tripTier,
                    Math.round(currentPlan.budgetBreakdown.hotel / Math.max(1, currentPlan.totalDays - 1))
                  )
                }
                className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 text-white hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-red-900/30"
              >
                <Ticket className="w-4 h-4" />
                <span>⚡ Book Trip (MakeMyTrip)</span>
              </button>
            )}

            <button
              id="export-pdf-modal-btn"
              onClick={() => setIsPDFModalOpen(true)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:opacity-95 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Itinerary PDF</span>
            </button>

            <button
              id="save-trip-btn"
              onClick={handleSaveToAccount}
              disabled={isSaving}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                saveSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700'
              }`}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-cyan-400" />
                  <span>{isSaving ? 'Saving...' : 'Save Trip'}</span>
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration Controls */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-5 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Compass className="w-4 h-4 text-cyan-400" />
              Trip Customization
            </h2>

            {/* Destination Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Destination</label>
              <select
                id="planner-destination-select"
                value={selectedDestId}
                onChange={(e) => setSelectedDestId(e.target.value)}
                className="w-full bg-slate-800 text-white text-sm font-semibold p-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-cyan-500"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Days & Travelers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Duration</label>
                <select
                  id="planner-days-select"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full bg-slate-800 text-white text-sm font-semibold p-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-cyan-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                    <option key={d} value={d}>
                      {d} {d === 1 ? 'Day' : 'Days'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Travelers</label>
                <select
                  id="planner-travelers-select"
                  value={travelersCount}
                  onChange={(e) => setTravelersCount(Number(e.target.value))}
                  className="w-full bg-slate-800 text-white text-sm font-semibold p-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-cyan-500"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((c) => (
                    <option key={c} value={c}>
                      {c} {c === 1 ? 'Person' : 'People'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Group Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Traveler Type</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['solo', 'couple', 'family', 'friends'] as const).map((t) => (
                  <button
                    key={t}
                    id={`traveler-type-${t}`}
                    type="button"
                    onClick={() => setTravelerType(t)}
                    className={`py-2 text-center rounded-xl text-xs font-semibold capitalize border transition-all ${
                      travelerType === t
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Trip Tier */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Experience Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'budget', label: 'Budget', desc: 'Homestays' },
                  { id: 'standard', label: 'Standard', desc: '3★ Resorts' },
                  { id: 'luxury', label: 'Luxury', desc: '5★ Villas' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    id={`tier-select-${tier.id}`}
                    type="button"
                    onClick={() => setTripTier(tier.id as any)}
                    className={`p-2.5 text-center rounded-xl text-xs font-semibold border transition-all ${
                      tripTier === tier.id
                        ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold">{tier.label}</div>
                    <div className="text-[10px] text-slate-400">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Trip Start Date</label>
              <input
                id="planner-start-date-input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs font-semibold p-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Action button */}
            <button
              id="recalculate-plan-btn"
              type="button"
              onClick={handleGeneratePlan}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Itinerary</span>
            </button>
          </div>

          {/* Quick Budget Summary Widget */}
          {currentPlan && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl"
            >
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Trip Financial Summary</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {currentPlan.tripTier.toUpperCase()}
                </span>
              </h3>

              <div className="space-y-2.5 text-xs text-slate-300 border-b border-slate-800 pb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Accommodation ({currentPlan.totalDays - 1 || 1} nights)</span>
                  <span className="font-semibold text-white">
                    {formatPrice(currentPlan.budgetBreakdown.hotel)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Local Transport & Cabs</span>
                  <span className="font-semibold text-white">
                    {formatPrice(currentPlan.budgetBreakdown.transport)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Meals & Signature Dining</span>
                  <span className="font-semibold text-white">
                    {formatPrice(currentPlan.budgetBreakdown.food)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Attraction Entry Tickets</span>
                  <span className="font-semibold text-white">
                    {formatPrice(currentPlan.budgetBreakdown.attractions)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Activities & Guided Walks</span>
                  <span className="font-semibold text-white">
                    {formatPrice(currentPlan.budgetBreakdown.activities)}
                  </span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Estimated Cost</p>
                  <p className="text-xl font-black text-emerald-400">
                    {formatPrice(currentPlan.budgetBreakdown.total)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Per Person</p>
                  <p className="text-sm font-bold text-cyan-300">
                    {formatPrice(currentPlan.budgetBreakdown.perPersonCost)}
                  </p>
                </div>
              </div>

              {onBookTrip && currentDestination && (
                <button
                  id="planner-sidebar-book-trip-btn"
                  onClick={() =>
                    onBookTrip(
                      currentDestination,
                      'flight',
                      'Bengaluru',
                      5,
                      currentPlan.tripTier,
                      Math.round(currentPlan.budgetBreakdown.hotel / Math.max(1, currentPlan.totalDays - 1))
                    )
                  }
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-xl shadow-red-900/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Book Complete Trip (Travel + Stay + Passes)</span>
                </button>
              )}

              <button
                onClick={() => setIsPDFModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Open PDF Document Preview</span>
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Right Column: Itinerary Day Timeline */}
        <div className="lg:col-span-8 space-y-6">
          {currentPlan ? (
            <div className="space-y-6">
              {/* Destination Hero Intro Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    AI Curated Overview
                  </span>
                  <span className="text-xs text-slate-400">
                    {currentPlan.startDate} to {currentPlan.endDate}
                  </span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed italic">
                  "{currentPlan.personalizedIntro}"
                </p>
              </motion.div>

              {/* Day Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setActiveFilterDay('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeFilterDay === 'all'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  All Days ({currentPlan.itinerary.length})
                </button>
                {currentPlan.itinerary.map((d) => (
                  <button
                    key={d.day}
                    onClick={() => setActiveFilterDay(d.day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                      activeFilterDay === d.day
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Day {d.day}
                  </button>
                ))}
              </div>

              {/* Day-by-Day Timeline Cards with Stagger Animation */}
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {displayedDays.map((day, idx) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      id={`itinerary-day-${day.day}`}
                      className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl hover:border-slate-700 transition-all"
                    >
                      {/* Day Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 text-white font-extrabold text-sm flex items-center justify-center shadow-md">
                            D{day.day}
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-base">
                              Day {day.day} - {day.theme}
                            </h3>
                            <p className="text-xs text-cyan-400">{day.date}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                            Est. Day Budget: {formatPrice(day.dailyCostEstimate)}
                          </span>
                        </div>
                      </div>

                      {/* Time Slots */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Morning */}
                        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-750 space-y-1.5 hover:border-amber-500/30 transition-all">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Morning (08:30 AM)</span>
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed font-medium">
                            {day.morningSlot.activity}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            🚗 {day.morningSlot.travelDuration}
                          </p>
                        </div>

                        {/* Afternoon */}
                        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-750 space-y-1.5 hover:border-cyan-500/30 transition-all">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Afternoon (01:30 PM)</span>
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed font-medium">
                            {day.afternoonSlot.activity}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            🚗 {day.afternoonSlot.travelDuration}
                          </p>
                        </div>

                        {/* Evening */}
                        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-750 space-y-1.5 hover:border-indigo-500/30 transition-all">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Evening (05:30 PM)</span>
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed font-medium">
                            {day.eveningSlot.activity}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            🚶 {day.eveningSlot.travelDuration}
                          </p>
                        </div>
                      </div>

                      {/* Food & Notes footer */}
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300 border-t border-slate-800/80">
                        <div className="flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span><strong>Cuisine Highlight:</strong> {day.recommendedFood}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 italic">
                          {day.notes}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* PDF Quick Download Floating Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-teal-950/60 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500 text-slate-950 uppercase tracking-wider">
                      Offline Ready
                    </span>
                    <span className="text-xs text-cyan-300 font-bold">
                      Complete Printable Schedule
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Need an offline copy for your trip?
                  </h4>
                  <p className="text-xs text-slate-400">
                    Download this day-by-day plan with packing guidelines, meal tips, and emergency contacts in vector PDF.
                  </p>
                </div>

                <button
                  onClick={() => setIsPDFModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/25 hover:opacity-90 transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Itinerary PDF</span>
                </button>
              </div>

              {/* Packing Checklist & Tips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-4 h-4" />
                    Essential Packing Checklist
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {currentPlan.packingChecklist.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Travel & Climate Advisory
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Check seasonal rainfall updates before departure. Carry UPI/cash as some hill station entrance booths and spice estates have intermittent cellular reception.
                  </p>
                  <p className="text-[11px] text-cyan-300">
                    💡 24/7 AI Assistance available throughout your journey.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800">
              <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-spin-slow" />
              <p className="text-sm font-semibold text-slate-400">
                Click "Generate AI Itinerary" to calculate your custom plan.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Animated PDF Generator & Preview Modal */}
      <AnimatePresence>
        {isPDFModalOpen && currentDestination && (
          <PDFGeneratorModal
            destination={currentDestination}
            initialPlan={currentPlan}
            currency={currency}
            onClose={() => setIsPDFModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
