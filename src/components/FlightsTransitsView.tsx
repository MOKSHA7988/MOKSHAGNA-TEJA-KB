import React, { useState, useEffect, useMemo } from 'react';
import {
  Plane,
  Train,
  Car,
  Bus,
  Bike,
  Search,
  ArrowRight,
  Clock,
  Luggage,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  Coins,
  Ticket,
  Utensils,
  Fuel,
  Zap,
  Leaf,
  Sparkles,
  TrendingDown,
  Info,
  DollarSign,
  Download,
  QrCode,
  MapPin,
  ArrowUpDown,
  RefreshCw,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TransitOption, UserProfile, BookingRecord } from '../types/travel';
import { TRANSIT_DATABASE } from '../data/travelDatabase';
import {
  computeRealTimeTransitCost,
  MultiModalTransitResult,
  FuelType,
  CarCategory,
  LIVE_FUEL_PRICES,
  MAJOR_CITIES,
} from '../utils/transitPricing';

interface FlightsTransitsViewProps {
  user: UserProfile | null;
  currency: 'INR' | 'USD' | 'EUR';
  onBookingSuccess: (booking: BookingRecord, pointsEarned: number) => void;
}

export const FlightsTransitsView: React.FC<FlightsTransitsViewProps> = ({
  user,
  currency,
  onBookingSuccess,
}) => {
  const [originCity, setOriginCity] = useState<string>('Bangalore');
  const [destCity, setDestCity] = useState<string>('Goa');
  const [travelDate, setTravelDate] = useState<string>('2026-10-15');
  const [passengers, setPassengers] = useState<number>(2);
  const [activeTab, setActiveTab] = useState<'matrix' | 'flight' | 'train' | 'car' | 'bus' | 'bike'>('matrix');

  // Car configuration filters
  const [selectedFuel, setSelectedFuel] = useState<FuelType>('petrol');
  const [selectedCarCategory, setSelectedCarCategory] = useState<CarCategory>('sedan');

  // Live computed multi-modal transit data
  const [transitResult, setTransitResult] = useState<MultiModalTransitResult>(() =>
    computeRealTimeTransitCost('Bangalore', 'Goa', 2, 'petrol', 'sedan', '2026-10-15')
  );

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingItem, setBookingItem] = useState<{
    type: 'flight' | 'train' | 'cab' | 'bus' | 'self_drive';
    operator: string;
    code: string;
    classType: string;
    pricePerPerson: number;
    totalAmount: number;
    departureTime: string;
    arrivalTime: string;
    details: string;
  } | null>(null);

  const [passengerName, setPassengerName] = useState<string>(user?.fullName || 'Teja Traveler');
  const [passengerPhone, setPassengerPhone] = useState<string>(user?.phone || '+91 98765 43210');
  const [seatPreference, setSeatPreference] = useState<string>('Window Seat');
  const [mealPreference, setMealPreference] = useState<string>('Vegetarian Meal');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  // Recalculate whenever inputs change
  useEffect(() => {
    if (originCity.trim() && destCity.trim()) {
      const computed = computeRealTimeTransitCost(
        originCity,
        destCity,
        passengers,
        selectedFuel,
        selectedCarCategory,
        travelDate
      );
      setTransitResult(computed);
    }
  }, [originCity, destCity, passengers, selectedFuel, selectedCarCategory, travelDate]);

  // Format Currency
  const formatCurrency = (inr: number) => {
    if (currency === 'USD') return `$${Math.round(inr / 83).toLocaleString()}`;
    if (currency === 'EUR') return `€${Math.round(inr / 90).toLocaleString()}`;
    return `₹${inr.toLocaleString('en-IN')}`;
  };

  const handleSwapCities = () => {
    const temp = originCity;
    setOriginCity(destCity);
    setDestCity(temp);
  };

  const handleOpenBooking = (item: {
    type: 'flight' | 'train' | 'cab' | 'bus' | 'self_drive';
    operator: string;
    code: string;
    classType: string;
    pricePerPerson: number;
    totalAmount: number;
    departureTime: string;
    arrivalTime: string;
    details: string;
  }) => {
    setBookingItem(item);
    setIsSuccess(false);
    setIsBookingModalOpen(true);
  };

  const handleConfirmReservation = async () => {
    if (!bookingItem) return;

    try {
      const res = await fetch('/api/transits/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transitId: `tr-live-${Date.now()}`,
          username: user?.email || 'moksgnateja@gmail.com',
          passengerCount: passengers,
          travelDate,
          passengerNames: [passengerName],
        }),
      });
      const data = await res.json();

      const bookingRecord: BookingRecord = data.booking || {
        id: `bk-tr-${Date.now()}`,
        bookingRef: `MGT-${bookingItem.type.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
        username: user?.email || 'moksgnateja@gmail.com',
        type: 'activity',
        title: `${bookingItem.operator} (${bookingItem.code})`,
        destination: `${transitResult.originCode} → ${transitResult.destinationCode}`,
        dates: travelDate,
        guests: passengers,
        amountPaid: bookingItem.totalAmount,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
        details: `${bookingItem.classType} | Seat: ${seatPreference} | Meal: ${mealPreference} | ${bookingItem.details}`,
      };

      setConfirmedBooking(bookingRecord);
      setIsSuccess(true);
      const points = Math.round(bookingItem.totalAmount * 0.05);
      onBookingSuccess(bookingRecord, points);
    } catch (e) {
      console.error(e);
      const fallbackRecord: BookingRecord = {
        id: `bk-tr-${Date.now()}`,
        bookingRef: `MGT-${bookingItem.type.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
        username: user?.email || 'moksgnateja@gmail.com',
        type: 'activity',
        title: `${bookingItem.operator} (${bookingItem.code})`,
        destination: `${transitResult.originCode} → ${transitResult.destinationCode}`,
        dates: travelDate,
        guests: passengers,
        amountPaid: bookingItem.totalAmount,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
        details: `${bookingItem.classType} | Seat: ${seatPreference} | ${bookingItem.details}`,
      };
      setConfirmedBooking(fallbackRecord);
      setIsSuccess(true);
      onBookingSuccess(fallbackRecord, Math.round(bookingItem.totalAmount * 0.05));
    }
  };

  const POPULAR_ROUTES = [
    { from: 'Delhi', to: 'Goa', label: 'Delhi ⇄ Goa' },
    { from: 'Bangalore', to: 'Coorg', label: 'Bangalore ⇄ Coorg' },
    { from: 'Mumbai', to: 'Udaipur', label: 'Mumbai ⇄ Udaipur' },
    { from: 'Delhi', to: 'Manali', label: 'Delhi ⇄ Manali' },
    { from: 'Hyderabad', to: 'Munnar', label: 'Hyderabad ⇄ Munnar' },
    { from: 'Bangalore', to: 'Goa', label: 'Bangalore ⇄ Goa' },
    { from: 'Chennai', to: 'Ooty', label: 'Chennai ⇄ Ooty' },
    { from: 'Kolkata', to: 'Varanasi', label: 'Kolkata ⇄ Varanasi' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Intelligent Route Selector */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Real-Time Multi-Modal Fare Intelligence
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5" /> Eco-CO₂ Tracking & Cost Calculator
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Real-Time Travel Cost: <span className="bg-gradient-to-r from-indigo-300 via-cyan-300 to-teal-200 bg-clip-text text-transparent">Flight, Car, Train & Bus</span>
            </h1>
          </div>

          {/* Live Fuel Rates Badge */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Fuel className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-500 block">Live Petrol</span>
                <span className="font-bold text-amber-300">₹{LIVE_FUEL_PRICES.petrolPerLiter}/L</span>
              </div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="flex items-center gap-1.5 text-slate-300">
              <Zap className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-500 block">Live EV Charge</span>
                <span className="font-bold text-emerald-300">₹{LIVE_FUEL_PRICES.evPerKWh}/kWh</span>
              </div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="flex items-center gap-1.5 text-slate-300">
              <Train className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-[10px] text-slate-500 block">IRCTC Live</span>
                <span className="font-bold text-cyan-300">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Route Selector Pills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Popular Indian Travel Corridors (Instant Load)
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {POPULAR_ROUTES.map((route, i) => (
              <button
                key={i}
                onClick={() => {
                  setOriginCity(route.from);
                  setDestCity(route.to);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  originCity.toLowerCase().includes(route.from.toLowerCase()) &&
                  destCity.toLowerCase().includes(route.to.toLowerCase())
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }`}
              >
                {route.label}
              </button>
            ))}
          </div>
        </div>

        {/* Route & Passenger Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          <div className="sm:col-span-4 relative p-3.5 bg-slate-950/90 border border-slate-700 rounded-2xl">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Departure City (Origin)
            </label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <input
                type="text"
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                placeholder="e.g. Delhi, Bangalore, Mumbai, Hyderabad"
                className="w-full bg-transparent text-sm text-white font-bold focus:outline-none placeholder-slate-500"
              />
            </div>
          </div>

          <div className="sm:col-span-1 flex items-center justify-center">
            <button
              onClick={handleSwapCities}
              title="Swap Origin and Destination"
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all shadow-md"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          <div className="sm:col-span-4 p-3.5 bg-slate-950/90 border border-slate-700 rounded-2xl">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Arrival Destination (City / Hill Station)
            </label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                type="text"
                value={destCity}
                onChange={(e) => setDestCity(e.target.value)}
                placeholder="e.g. Goa, Coorg, Munnar, Manali, Jaipur"
                className="w-full bg-transparent text-sm text-white font-bold focus:outline-none placeholder-slate-500"
              />
            </div>
          </div>

          <div className="sm:col-span-2 p-3.5 bg-slate-950/90 border border-slate-700 rounded-2xl">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Travel Date
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full bg-transparent text-xs text-white font-bold focus:outline-none [color-scheme:dark]"
            />
          </div>

          <div className="sm:col-span-1 p-3.5 bg-slate-950/90 border border-slate-700 rounded-2xl">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Pax
            </label>
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full bg-transparent text-sm text-white font-bold focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 8, 12].map((n) => (
                <option key={n} value={n} className="bg-slate-900 text-white">
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Distance & Route Metrics Summary */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-300">
              Route: <strong className="text-white">{transitResult.origin} ({transitResult.originCode})</strong> →{' '}
              <strong className="text-white">{transitResult.destination} ({transitResult.destinationCode})</strong>
            </span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <span className="text-slate-300">
              Highway Distance: <strong className="text-cyan-300">{transitResult.distanceRoadKm} km</strong>
            </span>
            <span className="text-slate-300">
              Air Distance: <strong className="text-indigo-300">{transitResult.distanceAirKm} km</strong>
            </span>
            <span className="text-slate-300">
              Rail Distance: <strong className="text-emerald-300">{transitResult.distanceRailKm} km</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'matrix', label: '⚡ All Modes Cost Matrix', icon: Sparkles },
          { id: 'flight', label: '✈️ Flight Real-Time Fares', icon: Plane },
          { id: 'train', label: '🚆 Train (Vande Bharat & IRCTC)', icon: Train },
          { id: 'car', label: '🚗 Car (Personal Fuel, Cabs & Rental)', icon: Car },
          { id: 'bus', label: '🚌 Volvo & AC Sleeper Buses', icon: Bus },
          { id: 'bike', label: '🏍️ Touring Motorcycle & Ferries', icon: Bike },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 via-cyan-500 to-teal-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ALL MODES COMPARISON MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Smart AI Recommendation Summary Note */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/40 to-slate-900 border border-emerald-500/30 text-xs sm:text-sm text-slate-200 flex items-start gap-3 shadow-lg">
            <div className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-300 shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white flex items-center gap-2">
                <span>Smart Travel Intelligence Recommendation</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                  {passengers} Traveler{passengers > 1 ? 's' : ''} Analysis
                </span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {transitResult.summaryComparison.recommendationNote}
              </p>
            </div>
          </div>

          {/* Direct Comparative Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. FLIGHT CARD */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-xl space-y-4 relative overflow-hidden flex flex-col justify-between">
              {transitResult.summaryComparison.fastestMode === 'flight' && (
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500 text-white shadow-md">
                  ⚡ FASTEST
                </span>
              )}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                    <Plane className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Commercial Flight</h3>
                    <p className="text-xs text-slate-400">Non-Stop Air Corridor</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" /> Air Time:
                    </span>
                    <span className="font-bold text-white">{transitResult.flight.durationStr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Carbon Footprint:
                    </span>
                    <span className="font-semibold text-slate-300">{transitResult.flight.co2KgPerPerson} kg CO₂ / pax</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Comfort Score:</span>
                    <span className="font-bold text-amber-300">9.0 / 10</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total for {passengers} Pax</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-indigo-300">
                      {formatCurrency(transitResult.flight.totalGroupCost)}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({formatCurrency(transitResult.flight.totalPerPerson)} /pax)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('flight')}
                  className="w-full py-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Flight Schedules</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. TRAIN CARD */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-xl space-y-4 relative overflow-hidden flex flex-col justify-between">
              {transitResult.summaryComparison.cheapestMode === 'train' && (
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 shadow-md">
                  💰 MOST ECONOMICAL
                </span>
              )}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Train className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Vande Bharat / Express</h3>
                    <p className="text-xs text-slate-400">IRCTC Rail Network</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" /> Travel Duration:
                    </span>
                    <span className="font-bold text-white">{transitResult.train.durationStr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Carbon Footprint:
                    </span>
                    <span className="font-semibold text-emerald-300 font-bold">{transitResult.train.co2KgPerPerson} kg CO₂ (Lowest)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Class Types:</span>
                    <span className="font-bold text-slate-300">EC, CC, 2A, 3A, SL</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">Fares starting from</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-emerald-400">
                      {formatCurrency(transitResult.train.totalGroupCost)}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({formatCurrency(transitResult.train.cheapestFarePerPerson)} /pax)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('train')}
                  className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Trains & Seats</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3. PERSONAL CAR / ROAD TRIP CARD */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-xl space-y-4 relative overflow-hidden flex flex-col justify-between">
              {passengers >= 3 && (
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 shadow-md">
                  👑 BEST FOR GROUP
                </span>
              )}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Personal Car Drive</h3>
                    <p className="text-xs text-slate-400">Fuel + FASTag Tolls</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Driving Time:
                    </span>
                    <span className="font-bold text-white">{transitResult.car.personal.drivingTimeStr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fuel Required:</span>
                    <span className="font-bold text-amber-300">{transitResult.car.personal.fuelLitersNeeded} Liters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">FASTag Tolls:</span>
                    <span className="font-semibold text-slate-300">{formatCurrency(transitResult.car.personal.tollCost)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Road Trip Cost</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-amber-300">
                      {formatCurrency(transitResult.car.personal.totalCost)}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({formatCurrency(transitResult.car.personal.costPerPerson)} /pax)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('car')}
                  className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Detailed Car Breakdown</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 4. VOLVO BUS CARD */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-xl space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                    <Bus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Volvo AC Sleeper Bus</h3>
                    <p className="text-xs text-slate-400">Direct Overnight Bus</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" /> Duration:
                    </span>
                    <span className="font-bold text-white">{transitResult.bus.durationStr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Operators:</span>
                    <span className="font-bold text-slate-300">KSRTC / Zingbus</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Comfort Score:</span>
                    <span className="font-semibold text-slate-300">7.5 / 10</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total for {passengers} Pax</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-cyan-400">
                      {formatCurrency(transitResult.bus.totalGroupCost)}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({formatCurrency(transitResult.bus.cheapestFarePerPerson)} /pax)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('bus')}
                  className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Sleeper Buses</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FLIGHTS REAL-TIME FARES */}
      {activeTab === 'flight' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Plane className="w-5 h-5 text-indigo-400" />
                  Live Airline Schedules & Dynamic Fares
                </h3>
                <p className="text-xs text-slate-400">
                  {transitResult.origin} ({transitResult.originCode}) → {transitResult.destination} ({transitResult.destinationCode}) • Air Distance: {transitResult.distanceAirKm} km
                </p>
              </div>

              {/* Price Breakdown Badge */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="flex justify-between gap-4">
                  <span>Base Airfare:</span>
                  <span className="font-bold text-white">{formatCurrency(transitResult.flight.basePricePerPerson)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Taxes, UDF & GST:</span>
                  <span className="font-bold text-white">{formatCurrency(transitResult.flight.taxesAndFeesPerPerson)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {transitResult.flight.operators.map((fl, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                      <Plane className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">{fl.airline}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                          {fl.flightNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                          {fl.onTimeRating}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="text-indigo-300 font-semibold">{fl.seatClass}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Luggage className="w-3.5 h-3.5 text-slate-400" /> {fl.baggage}
                        </span>
                        {fl.mealIncluded && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400 flex items-center gap-1">
                              <Utensils className="w-3.5 h-3.5" /> Hot Meal Included
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-center">
                    <div>
                      <span className="text-lg font-bold text-white block">{fl.departureTime}</span>
                      <span className="text-xs text-slate-400 font-semibold">{transitResult.originCode}</span>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <span className="text-[10px] text-indigo-400 font-bold mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {fl.duration}
                      </span>
                      <div className="w-24 h-0.5 bg-slate-700 relative">
                        <span className="absolute -top-1.5 left-0 w-3 h-3 rounded-full bg-indigo-500" />
                        <span className="absolute -top-1.5 right-0 w-3 h-3 rounded-full bg-cyan-400" />
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1">{fl.stops}</span>
                    </div>

                    <div>
                      <span className="text-lg font-bold text-white block">{fl.arrivalTime}</span>
                      <span className="text-xs text-slate-400 font-semibold">{transitResult.destinationCode}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 block">Total for {passengers} Pax</span>
                      <span className="text-xl font-extrabold text-indigo-300">
                        {formatCurrency(fl.price * passengers)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        ({formatCurrency(fl.price)} / traveler)
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        handleOpenBooking({
                          type: 'flight',
                          operator: fl.airline,
                          code: fl.flightNumber,
                          classType: fl.seatClass,
                          pricePerPerson: fl.price,
                          totalAmount: fl.price * passengers,
                          departureTime: fl.departureTime,
                          arrivalTime: fl.arrivalTime,
                          details: `${fl.baggage} | ${fl.stops}`,
                        })
                      }
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-xs font-bold hover:opacity-95 shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
                    >
                      <span>Book Flight</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRAIN REAL-TIME FARES & VANDE BHARAT */}
      {activeTab === 'train' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Train className="w-5 h-5 text-emerald-400" />
                IRCTC Indian Railways & High-Speed Vande Bharat Fares
              </h3>
              <p className="text-xs text-slate-400">
                Track Distance: {transitResult.distanceRailKm} km • Direct Rail Corridor with Live Berth Availability & Tatkal Surge Predictor
              </p>
            </div>

            {/* Train Classes Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {transitResult.train.classes.map((cls, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {cls.code}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        {cls.availabilityStatus}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{cls.name}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{cls.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="text-[10px] text-slate-400 block">General Fare</span>
                        <span className="text-lg font-extrabold text-emerald-400">
                          {formatCurrency(cls.farePerPerson * passengers)}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          ({formatCurrency(cls.farePerPerson)} / pax)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Tatkal Rate</span>
                        <span className="text-sm font-bold text-amber-400">
                          {formatCurrency(cls.tatkalFarePerPerson * passengers)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleOpenBooking({
                          type: 'train',
                          operator: `Indian Railways (${cls.code})`,
                          code: `IRCTC-${cls.code}`,
                          classType: cls.name,
                          pricePerPerson: cls.farePerPerson,
                          totalAmount: cls.farePerPerson * passengers,
                          departureTime: '05:45 AM',
                          arrivalTime: '02:30 PM',
                          details: `${cls.availabilityStatus} | Confirm Probability: ${cls.availabilityChancePercent}%`,
                        })
                      }
                      className="w-full py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Book Rail Ticket</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CAR, ROAD TRIP, FUEL & CABS */}
      {activeTab === 'car' && (
        <div className="space-y-6">
          {/* Interactive Fuel & Vehicle Customizer Bar */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-400" />
                Customize Vehicle & Fuel Parameters
              </h3>
              <span className="text-xs text-slate-400">
                Total Driving Distance: <strong className="text-cyan-300">{transitResult.distanceRoadKm} km</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Fuel Type Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Select Fuel Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'petrol', label: 'Petrol', price: LIVE_FUEL_PRICES.petrolPerLiter, unit: '/L' },
                    { id: 'diesel', label: 'Diesel', price: LIVE_FUEL_PRICES.dieselPerLiter, unit: '/L' },
                    { id: 'cng', label: 'CNG', price: LIVE_FUEL_PRICES.cngPerKg, unit: '/kg' },
                    { id: 'ev', label: 'EV Electric', price: LIVE_FUEL_PRICES.evPerKWh, unit: '/kWh' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFuel(f.id as any)}
                      className={`p-2.5 rounded-2xl text-xs font-bold transition-all text-center ${
                        selectedFuel === f.id
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <span className="block">{f.label}</span>
                      <span className="text-[10px] opacity-80">₹{f.price}{f.unit}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle Category Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Vehicle Category & Mileage</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'hatchback', label: 'Hatchback', note: '18 km/l (Swift)' },
                    { id: 'sedan', label: 'Sedan', note: '14.5 km/l (City)' },
                    { id: 'suv', label: 'SUV', note: '10.2 km/l (Creta)' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCarCategory(c.id as any)}
                      className={`p-2.5 rounded-2xl text-xs font-bold transition-all text-center ${
                        selectedCarCategory === c.id
                          ? 'bg-cyan-500 text-slate-950 shadow-md'
                          : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <span className="block">{c.label}</span>
                      <span className="text-[10px] opacity-80">{c.note}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3 Pillars of Road Travel: Personal Car vs Outstation Chauffeur Cab vs Self Drive */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Personal Car Real-Time Cost Breakdown */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Fuel className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Personal Car Drive</h4>
                  <p className="text-xs text-slate-400">Self-Drive Own Vehicle</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fuel Required:</span>
                    <span className="font-bold text-white">{transitResult.car.personal.fuelLitersNeeded} Units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Fuel Expense:</span>
                    <span className="font-bold text-amber-400">{formatCurrency(transitResult.car.personal.fuelCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">FASTag Highway Tolls:</span>
                    <span className="font-bold text-white">{formatCurrency(transitResult.car.personal.tollCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vehicle Wear Allowance:</span>
                    <span className="font-semibold text-slate-400">{formatCurrency(transitResult.car.personal.maintenanceCost)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Driving Cost</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-amber-300">
                      {formatCurrency(transitResult.car.personal.totalCost)}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({formatCurrency(transitResult.car.personal.costPerPerson)} /person)
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                  🛣️ Driving Time: <strong>{transitResult.car.personal.drivingTimeStr}</strong> via NHAI 6-Lane Expressway
                </div>
              </div>
            </div>

            {/* 2. Outstation Chauffeur Cab */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/40 shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Outstation Chauffeur Cab</h4>
                  <p className="text-xs text-slate-400">Dedicated Commercial AC Chauffeur</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">AC Sedan (Dzire / Etios):</span>
                    <span className="font-bold text-cyan-300">{formatCurrency(transitResult.car.outstationCab.sedanFare)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">AC SUV (Innova Crysta):</span>
                    <span className="font-bold text-white">{formatCurrency(transitResult.car.outstationCab.suvFare)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tempo (12-Seater):</span>
                    <span className="font-bold text-white">{formatCurrency(transitResult.car.outstationCab.tempoFare)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Driver Allowance Included:</span>
                    <span>{formatCurrency(transitResult.car.outstationCab.driverBata)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">AC Sedan Starting from</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-cyan-400">
                      {formatCurrency(transitResult.car.outstationCab.sedanFare)}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({formatCurrency(transitResult.car.outstationCab.sedanPerPerson)} /person)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleOpenBooking({
                      type: 'cab',
                      operator: 'MG Travels Verified AC Chauffeur',
                      code: 'CAB-SEDAN-OUTSTATION',
                      classType: 'Dedicated AC Sedan (4 Seats)',
                      pricePerPerson: transitResult.car.outstationCab.sedanPerPerson,
                      totalAmount: transitResult.car.outstationCab.sedanFare,
                      departureTime: 'Flexible (Doorstep Pickup)',
                      arrivalTime: `${transitResult.car.personal.drivingHours}h Direct`,
                      details: 'Doorstep pickup, highway restaurant stops, luggage assistance',
                    })
                  }
                  className="w-full py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Book Chauffeur Cab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3. Self-Drive Car Rental */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Self-Drive Car Rental</h4>
                  <p className="text-xs text-slate-400">Zoomcar / Revv Verified Hub</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Car Rental:</span>
                    <span className="font-bold text-white">{formatCurrency(transitResult.car.selfDriveRental.dailyRentalFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Fuel:</span>
                    <span className="font-bold text-white">{formatCurrency(transitResult.car.selfDriveRental.fuelCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tolls & Damage Cover:</span>
                    <span className="font-bold text-white">{formatCurrency(transitResult.car.selfDriveRental.tollCost + transitResult.car.selfDriveRental.insurance)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total All-Inclusive</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-purple-300">
                      {formatCurrency(transitResult.car.selfDriveRental.totalCost)}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({formatCurrency(transitResult.car.selfDriveRental.costPerPerson)} /pax)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleOpenBooking({
                      type: 'self_drive',
                      operator: 'Verified Self-Drive Network (Zoomcar / Revv)',
                      code: 'SELFDRIVE-VERIFIED',
                      classType: 'Self-Drive Sedan with Insurance',
                      pricePerPerson: transitResult.car.selfDriveRental.costPerPerson,
                      totalAmount: transitResult.car.selfDriveRental.totalCost,
                      departureTime: 'Keyless App Unlock',
                      arrivalTime: 'Flexible Drop',
                      details: 'Zero security deposit with valid Driving License, full insurance',
                    })
                  }
                  className="w-full py-2.5 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Reserve Self-Drive</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BUSES (VOLVO & AC SLEEPER) */}
      {activeTab === 'bus' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bus className="w-5 h-5 text-cyan-400" />
                Volvo Multi-Axle & Luxury AC Sleeper Bus Schedules
              </h3>
              <p className="text-xs text-slate-400">
                Direct Highway Route ({transitResult.distanceRoadKm} km) • Overnight comfortable sleep with charging ports & blanket amenities
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {transitResult.bus.options.map((bus, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                      <Bus className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">{bus.operator}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                          ★ {bus.rating} Rating
                        </span>
                      </div>
                      <p className="text-xs text-cyan-300 font-semibold">{bus.busType}</p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {bus.amenities.map((a, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-center">
                    <div>
                      <span className="text-lg font-bold text-white block">{bus.departureTime}</span>
                      <span className="text-xs text-slate-400">{transitResult.origin}</span>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <span className="text-[10px] text-cyan-400 font-bold mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {bus.duration}
                      </span>
                      <div className="w-20 h-0.5 bg-slate-700" />
                    </div>

                    <div>
                      <span className="text-lg font-bold text-white block">{bus.arrivalTime}</span>
                      <span className="text-xs text-slate-400">{transitResult.destination}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 block">Total for {passengers} Pax</span>
                      <span className="text-xl font-extrabold text-cyan-300">
                        {formatCurrency(bus.price * passengers)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        ({formatCurrency(bus.price)} / seat)
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        handleOpenBooking({
                          type: 'bus',
                          operator: bus.operator,
                          code: 'VOLVO-SLEEPER',
                          classType: bus.busType,
                          pricePerPerson: bus.price,
                          totalAmount: bus.price * passengers,
                          departureTime: bus.departureTime,
                          arrivalTime: bus.arrivalTime,
                          details: `Amenities: ${bus.amenities.join(', ')}`,
                        })
                      }
                      className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                    >
                      <span>Select Berth</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MOTORBIKE & SCENIC ROAD TOURING */}
      {activeTab === 'bike' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bike className="w-5 h-5 text-amber-400" />
                Royal Enfield Motorbike Touring & Fuel Cost Breakdown
              </h3>
              <p className="text-xs text-slate-400">
                Scenic Highway Distance: {transitResult.distanceRoadKm} km • Ideal for solo/duo adventure touring through mountain ghats
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-amber-300">Adventure Motorbike Specs</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Recommended Bike:</span>
                    <span className="font-bold text-white">{transitResult.bike.recommendedBike}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average Touring Mileage:</span>
                    <span className="font-bold text-white">32 km / Liter</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fuel Required:</span>
                    <span className="font-bold text-amber-300">{Math.round((transitResult.distanceRoadKm / 32) * 10) / 10} Liters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">NHAI Expressway 2-Wheeler Tolls:</span>
                    <span className="font-bold text-emerald-400">₹0 (Exempt)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total Fuel Cost for Tour</span>
                  <span className="text-2xl font-black text-amber-400">
                    {formatCurrency(transitResult.bike.fuelCost)}
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white">Rider Safety & Ghats Advisory</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Carry waterproof saddlebags, emergency puncture kit, and full-face helmet. Early morning departures (05:30 AM) recommended to bypass city congestion.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                  ⭐ Scenic Vibe Score: <strong>{transitResult.bike.scenicRating} / 10</strong> (Pristine viewpoint curves)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transit Reservation & Digital Boarding Pass Modal */}
      {isBookingModalOpen && bookingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Real-Time Instant Reservation
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {bookingItem.operator}
                </h3>
                <p className="text-xs text-slate-400">
                  {transitResult.origin} ({transitResult.originCode}) → {transitResult.destination} ({transitResult.destinationCode})
                </p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isSuccess ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Class / Type:</span>
                    <span className="font-bold text-white">{bookingItem.classType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Departure:</span>
                    <span className="font-bold text-cyan-300">{travelDate} ({bookingItem.departureTime})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Travelers:</span>
                    <span className="font-bold text-white">{passengers} Passenger(s)</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Lead Passenger Full Name *</label>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="Enter full legal name"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Mobile Phone (WhatsApp E-Ticket)</label>
                  <input
                    type="tel"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Seat Preference</label>
                    <select
                      value={seatPreference}
                      onChange={(e) => setSeatPreference(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                    >
                      <option value="Window Seat">Window Seat</option>
                      <option value="Aisle Seat">Aisle Seat</option>
                      <option value="Lower Berth">Lower Berth</option>
                      <option value="Coupe Berth">Coupe Berth</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Meal Preference</label>
                    <select
                      value={mealPreference}
                      onChange={(e) => setMealPreference(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                    >
                      <option value="Vegetarian Meal">Vegetarian Meal</option>
                      <option value="Jain Meal">Jain Meal</option>
                      <option value="Non-Veg Meal">Non-Veg Meal</option>
                      <option value="No Meal">No Meal</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Total Final Fare</span>
                    <span className="text-2xl font-black text-cyan-300">
                      {formatCurrency(bookingItem.totalAmount)}
                    </span>
                  </div>
                  <button
                    onClick={handleConfirmReservation}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold hover:opacity-90 shadow-md shadow-emerald-500/20"
                  >
                    Confirm & Pay
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5 text-center py-2">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                <div>
                  <h4 className="text-lg font-bold text-white">Transit Ticket Confirmed!</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    PNR / Ref: <strong className="text-cyan-300 font-mono">{confirmedBooking?.bookingRef}</strong>
                  </p>
                </div>

                {/* Digital Boarding Pass Voucher */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 text-left space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block">PASSENGER</span>
                      <strong className="text-white text-sm">{passengerName}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">TRANSIT TYPE</span>
                      <strong className="text-cyan-300 uppercase">{bookingItem.type}</strong>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <div>
                      <span className="text-base font-bold text-white">{transitResult.originCode}</span>
                      <span className="text-[10px] text-slate-400 block">{bookingItem.departureTime}</span>
                    </div>
                    <div className="text-center px-4">
                      <span className="text-[10px] text-cyan-400">Direct Route</span>
                      <div className="w-16 h-0.5 bg-slate-700 mx-auto my-1" />
                      <span className="text-[10px] text-slate-500">{travelDate}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-white">{transitResult.destinationCode}</span>
                      <span className="text-[10px] text-slate-400 block">{bookingItem.arrivalTime}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Seat: <strong className="text-white">{seatPreference}</strong></span>
                    <span className="text-emerald-400 font-bold">+50 MG Loyalty Points Credited</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                >
                  Close & View in Booking Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
