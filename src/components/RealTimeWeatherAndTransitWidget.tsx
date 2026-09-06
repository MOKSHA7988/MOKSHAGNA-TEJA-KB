import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  CloudSun,
  CloudRain,
  CloudSnow,
  CloudFog,
  CloudLightning,
  Wind,
  Droplets,
  Plane,
  Train,
  Car,
  RefreshCw,
  Sparkles,
  MapPin,
  Clock,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  Navigation,
  Fuel,
  Info,
  Sliders,
  Ticket,
  Bus,
} from 'lucide-react';
import { Destination } from '../types/travel';
import {
  LiveWeatherData,
  fetchRealTimeWeather,
  getStaticFallbackWeather,
} from '../utils/liveWeather';
import {
  computeRealTimeTransitCost,
  MultiModalTransitResult,
  FuelType,
  CarCategory,
} from '../utils/transitPricing';

interface RealTimeWeatherAndTransitWidgetProps {
  destination: Destination | { name: string; state?: string; climate?: string; coordinates?: { lat: number; lng: number } };
  initialOrigin?: string;
  onSelectTransitMode?: (mode: 'flight' | 'train' | 'car', cost: number, details: string) => void;
  onBookTrip?: (travelMode: 'flight' | 'train' | 'car' | 'bus', origin?: string) => void;
  compact?: boolean;
}

const COMMON_ORIGINS = [
  { name: 'Bengaluru (BLR)', code: 'BLR', query: 'Bengaluru' },
  { name: 'Delhi (DEL)', code: 'DEL', query: 'Delhi' },
  { name: 'Mumbai (BOM)', code: 'BOM', query: 'Mumbai' },
  { name: 'Hyderabad (HYD)', code: 'HYD', query: 'Hyderabad' },
  { name: 'Chennai (MAA)', code: 'MAA', query: 'Chennai' },
  { name: 'Pune (PNQ)', code: 'PNQ', query: 'Pune' },
  { name: 'Kolkata (CCU)', code: 'CCU', query: 'Kolkata' },
  { name: 'Jaipur (JAI)', code: 'JAI', query: 'Jaipur' },
];

export const RealTimeWeatherAndTransitWidget: React.FC<RealTimeWeatherAndTransitWidgetProps> = ({
  destination,
  initialOrigin = 'Bengaluru',
  onSelectTransitMode,
  onBookTrip,
  compact = false,
}) => {
  const [origin, setOrigin] = useState<string>(initialOrigin);
  const [customOrigin, setCustomOrigin] = useState<string>('');
  const [isCustomOriginActive, setIsCustomOriginActive] = useState<boolean>(false);
  const [passengers, setPassengers] = useState<number>(1);
  const [fuelType, setFuelType] = useState<FuelType>('petrol');
  const [carCategory, setCarCategory] = useState<CarCategory>('sedan');

  // Weather state
  const [weather, setWeather] = useState<LiveWeatherData>(() =>
    getStaticFallbackWeather(destination.name, (destination as any).climate)
  );
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);
  const [weatherRefreshedAt, setWeatherRefreshedAt] = useState<Date>(new Date());

  // Transit state
  const [transitResult, setTransitResult] = useState<MultiModalTransitResult>(() =>
    computeRealTimeTransitCost(origin, destination.name, passengers, fuelType, carCategory)
  );
  const [activeTransitMode, setActiveTransitMode] = useState<'flight' | 'train' | 'car'>('train');
  const [expandedModeDetails, setExpandedModeDetails] = useState<'flight' | 'train' | 'car' | null>(null);

  // Fetch real-time weather on mount & when destination changes
  useEffect(() => {
    let isMounted = true;
    setIsWeatherLoading(true);

    fetchRealTimeWeather(destination)
      .then((data) => {
        if (isMounted) {
          setWeather(data);
          setIsWeatherLoading(false);
          setWeatherRefreshedAt(new Date());
        }
      })
      .catch(() => {
        if (isMounted) setIsWeatherLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [destination.name]);

  // Recalculate transit when parameters change
  useEffect(() => {
    const activeOrigin = isCustomOriginActive && customOrigin.trim() ? customOrigin.trim() : origin;
    const computed = computeRealTimeTransitCost(
      activeOrigin,
      destination.name,
      passengers,
      fuelType,
      carCategory
    );
    setTransitResult(computed);
  }, [origin, customOrigin, isCustomOriginActive, destination.name, passengers, fuelType, carCategory]);

  const handleManualWeatherRefresh = async () => {
    setIsWeatherLoading(true);
    try {
      const data = await fetchRealTimeWeather(destination);
      setWeather(data);
      setWeatherRefreshedAt(new Date());
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const getWeatherIcon = (iconType: LiveWeatherData['iconType']) => {
    switch (iconType) {
      case 'sun':
        return <Sun className="w-6 h-6 text-amber-400 animate-pulse" />;
      case 'cloud-rain':
        return <CloudRain className="w-6 h-6 text-cyan-400" />;
      case 'cloud-snow':
        return <CloudSnow className="w-6 h-6 text-sky-200" />;
      case 'cloud-fog':
        return <CloudFog className="w-6 h-6 text-slate-300" />;
      case 'cloud-lightning':
        return <CloudLightning className="w-6 h-6 text-amber-300" />;
      default:
        return <CloudSun className="w-6 h-6 text-amber-300" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. REAL-TIME WEATHER CARD */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-750 shadow-lg relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Real-Time Weather at {destination.name}</span>
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              Live Sensor
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">
              {weather.lastUpdated}
            </span>
            <button
              id="refresh-weather-btn"
              type="button"
              onClick={handleManualWeatherRefresh}
              disabled={isWeatherLoading}
              title="Refresh Live Sensor Weather"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isWeatherLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Current Weather Highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-3 items-center">
          <div className="sm:col-span-5 flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-inner">
              {getWeatherIcon(weather.iconType)}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white tracking-tight">{weather.tempStr}</span>
                <span className="text-xs text-slate-400">
                  Feels like {Math.round(weather.feelsLike)}°C
                </span>
              </div>
              <p className="text-xs font-semibold text-cyan-300">{weather.condition}</p>
            </div>
          </div>

          <div className="sm:col-span-7 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-750/70">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px]">
                <Droplets className="w-3 h-3 text-cyan-400" />
                <span>Humidity</span>
              </div>
              <p className="text-xs font-bold text-slate-200 mt-0.5">{weather.humidity}%</p>
            </div>

            <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-750/70">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px]">
                <Wind className="w-3 h-3 text-teal-400" />
                <span>Wind</span>
              </div>
              <p className="text-xs font-bold text-slate-200 mt-0.5">{weather.windSpeed} km/h</p>
            </div>

            <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-750/70">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px]">
                <Sun className="w-3 h-3 text-amber-400" />
                <span>UV Index</span>
              </div>
              <p className="text-xs font-bold text-slate-200 mt-0.5">{weather.uvIndex} (Mod)</p>
            </div>
          </div>
        </div>

        {/* 4-Day Forecast Strip */}
        {weather.forecast && weather.forecast.length > 0 && (
          <div className="pt-3 border-t border-slate-800/80 mt-3">
            <div className="grid grid-cols-4 gap-2 text-center">
              {weather.forecast.map((f, idx) => (
                <div
                  key={idx}
                  className="p-1.5 rounded-lg bg-slate-800/40 border border-slate-750/50 flex flex-col items-center justify-center"
                >
                  <span className="text-[10px] text-slate-400 font-medium">{f.day}</span>
                  <span className="text-xs font-bold text-slate-200 my-0.5">{f.temp}</span>
                  <span className="text-[9px] text-slate-400 truncate max-w-full px-1">{f.condition}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. REAL-TIME MULTI-MODAL TRAVEL MODES & ALL PRICES */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-750 shadow-lg space-y-4">
        {/* Origin & Passenger Controls Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">
                Real-Time Travel Modes & Fares
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                Live Pricing
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Distance: <strong className="text-slate-200">{transitResult.distanceRoadKm} km</strong> via expressway • Comparing Flight, Train & Car
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>From:</span>
            </div>

            {!isCustomOriginActive ? (
              <select
                id="select-travel-origin"
                value={origin}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setIsCustomOriginActive(true);
                  } else {
                    setOrigin(e.target.value);
                  }
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400"
              >
                {COMMON_ORIGINS.map((c) => (
                  <option key={c.code} value={c.query}>
                    {c.name}
                  </option>
                ))}
                <option value="custom">+ Other City...</option>
              </select>
            ) : (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Enter city..."
                  value={customOrigin}
                  onChange={(e) => setCustomOrigin(e.target.value)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 w-28 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => setIsCustomOriginActive(false)}
                  className="text-[11px] text-slate-400 hover:text-white underline px-1"
                >
                  Reset
                </button>
              </div>
            )}

            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-750">
              <span className="text-[11px] text-slate-400">Pax:</span>
              <select
                id="select-travel-pax"
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400"
              >
                <option value={1}>1 Solo</option>
                <option value={2}>2 Couple</option>
                <option value={4}>4 Group</option>
                <option value={6}>6 Family</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3 Travel Mode Cards (Train, Car, Flight) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* MODE 1: TRAIN */}
          <div
            id="travel-mode-card-train"
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
              activeTransitMode === 'train'
                ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                : 'bg-slate-800/50 hover:bg-slate-800 border-slate-750 hover:border-slate-650'
            }`}
            onClick={() => {
              setActiveTransitMode('train');
              setExpandedModeDetails(expandedModeDetails === 'train' ? null : 'train');
            }}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    <Train className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">Train Travel</h5>
                    <span className="text-[10px] text-slate-400">IRCTC / Vande Bharat</span>
                  </div>
                </div>
                {transitResult.summaryComparison.cheapestMode === 'train' && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Cheapest
                  </span>
                )}
              </div>

              <div className="mt-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-cyan-400">
                    ₹{transitResult.train.cheapestFarePerPerson.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400">/ person (Sleeper)</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-300 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {transitResult.train.durationStr}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">
                    3A ₹{transitResult.train.classes.find(c => c.code === '3A')?.farePerPerson || 650}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">
                {transitResult.train.topTrains[0]?.trainName ? 'Fast Vande Bharat / Exp' : 'Regular Express'}
              </span>
              <span className="text-cyan-400 font-semibold flex items-center gap-0.5">
                <span>View options</span>
                {expandedModeDetails === 'train' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </span>
            </div>
          </div>

          {/* MODE 2: CAR / ROAD TRIP */}
          <div
            id="travel-mode-card-car"
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
              activeTransitMode === 'car'
                ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                : 'bg-slate-800/50 hover:bg-slate-800 border-slate-750 hover:border-slate-650'
            }`}
            onClick={() => {
              setActiveTransitMode('car');
              setExpandedModeDetails(expandedModeDetails === 'car' ? null : 'car');
            }}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">Car / Outstation Cab</h5>
                    <span className="text-[10px] text-slate-400">Drive or Private AC Cab</span>
                  </div>
                </div>
                {transitResult.summaryComparison.bestValueMode === 'car' && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Best for Group
                  </span>
                )}
              </div>

              <div className="mt-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-emerald-400">
                    ₹{transitResult.car.personal.totalCost.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400">total (Fuel + FASTag)</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-300 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    {transitResult.car.personal.drivingTimeStr}
                  </span>
                  <span>•</span>
                  <span className="text-amber-300 font-medium">
                    Cab ₹{transitResult.car.outstationCab.totalSedanCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">
                ₹{transitResult.car.personal.costPerPerson} / person ({passengers} pax)
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <span>View fuel & cab</span>
                {expandedModeDetails === 'car' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </span>
            </div>
          </div>

          {/* MODE 3: FLIGHT */}
          <div
            id="travel-mode-card-flight"
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
              activeTransitMode === 'flight'
                ? 'bg-slate-800/90 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                : 'bg-slate-800/50 hover:bg-slate-800 border-slate-750 hover:border-slate-650'
            }`}
            onClick={() => {
              setActiveTransitMode('flight');
              setExpandedModeDetails(expandedModeDetails === 'flight' ? null : 'flight');
            }}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">Domestic Flight</h5>
                    <span className="text-[10px] text-slate-400">IndiGo / Air India / Akasa</span>
                  </div>
                </div>
                {transitResult.flight.available && transitResult.summaryComparison.fastestMode === 'flight' && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                    ⚡ Fastest
                  </span>
                )}
              </div>

              <div className="mt-3">
                {transitResult.flight.available ? (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-indigo-300">
                        ₹{transitResult.flight.totalPerPerson.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-400">/ person (Economy)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-300 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        {transitResult.flight.durationStr}
                      </span>
                      <span>•</span>
                      <span className="text-slate-400 truncate">
                        {transitResult.flight.operators[0]?.stops || 'Non-stop Direct'}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-slate-400">No Direct Airport</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Nearest airport is connected via scenic road/train transfer
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">
                {transitResult.flight.available ? `${transitResult.flight.operators.length} Airlines live` : 'Road connection'}
              </span>
              <span className="text-indigo-400 font-semibold flex items-center gap-0.5">
                <span>View fares</span>
                {expandedModeDetails === 'flight' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </span>
            </div>
          </div>
        </div>

        {/* EXPANDED DETAILS ACCORDION FOR SELECTED TRAVEL MODE */}
        <AnimatePresence>
          {expandedModeDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2 border-t border-slate-800"
            >
              {/* DETAILS: TRAIN */}
              {expandedModeDetails === 'train' && (
                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Train className="w-3.5 h-3.5 text-cyan-400" />
                      <span>IRCTC Train Classes & Seat Availability</span>
                    </h5>
                    <span className="text-[11px] text-slate-400">
                      Duration: <strong>{transitResult.train.durationStr}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {transitResult.train.classes.map((cls) => (
                      <div
                        key={cls.code}
                        className="p-2.5 rounded-lg bg-slate-850 border border-slate-750 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-cyan-300">{cls.code}</span>
                          <span className="text-[9px] text-emerald-400 font-medium">
                            {cls.availabilityChancePercent}% Conf.
                          </span>
                        </div>
                        <p className="text-xs font-black text-white">₹{cls.farePerPerson.toLocaleString()}</p>
                        <p className="text-[9px] text-slate-400 line-clamp-1">{cls.name}</p>
                        <div className="text-[9px] text-emerald-400 pt-0.5">{cls.availabilityStatus}</div>
                      </div>
                    ))}
                  </div>

                  {transitResult.train.topTrains.length > 0 && (
                    <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">Top Recommended:</span>
                        <span>{transitResult.train.topTrains[0].trainName}</span>
                        <span className="text-slate-400">({transitResult.train.topTrains[0].departureTime} departure)</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        {transitResult.train.topTrains[0].punctualityRating}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                    {onBookTrip && (
                      <button
                        type="button"
                        onClick={() => onBookTrip('train', origin)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-bold hover:brightness-110 shadow-md shadow-red-500/20 flex items-center gap-1.5 transition-all"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Book Train Ticket (IRCTC)</span>
                      </button>
                    )}
                    {onSelectTransitMode && (
                      <button
                        type="button"
                        onClick={() =>
                          onSelectTransitMode(
                            'train',
                            transitResult.train.cheapestFarePerPerson * passengers,
                            `Train Travel (${transitResult.train.durationStr})`
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold hover:opacity-90 transition-opacity"
                      >
                        Add Train to Trip (₹{(transitResult.train.cheapestFarePerPerson * passengers).toLocaleString()})
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* DETAILS: CAR / ROAD */}
              {expandedModeDetails === 'car' && (
                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Road Trip Breakdown (Personal Vehicle vs AC Cab)</span>
                    </h5>
                    <span className="text-[11px] text-slate-400">
                      Driving Time: <strong>{transitResult.car.personal.drivingTimeStr}</strong> ({transitResult.distanceRoadKm} km)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Personal Car Itemized Cost */}
                    <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-750 pb-1.5">
                        <span className="text-xs font-bold text-emerald-300">Option A: Drive Your Own Car</span>
                        <span className="text-xs font-bold text-white">
                          ₹{transitResult.car.personal.totalCost.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Estimated Fuel ({transitResult.car.personal.fuelLitersNeeded}L @ ₹102/L):</span>
                          <span className="font-semibold text-slate-200">₹{transitResult.car.personal.fuelCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">FASTag Toll Plazas:</span>
                          <span className="font-semibold text-slate-200">₹{transitResult.car.personal.tollCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Vehicle Wear & Maintenance:</span>
                          <span className="font-semibold text-slate-200">₹{transitResult.car.personal.maintenanceCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-800 text-emerald-400 font-bold">
                          <span>Cost per person ({passengers} pax):</span>
                          <span>₹{transitResult.car.personal.costPerPerson.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Outstation AC Cab */}
                    <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-750 pb-1.5">
                        <span className="text-xs font-bold text-cyan-300">Option B: Book Outstation AC Cab</span>
                        <span className="text-xs font-bold text-white">
                          From ₹{transitResult.car.outstationCab.hatchbackFare.toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                          <p className="text-slate-400 text-[10px]">Sedan (Dzire/Etios)</p>
                          <p className="text-xs font-bold text-white">₹{transitResult.car.outstationCab.totalSedanCost.toLocaleString()}</p>
                          <p className="text-[9px] text-slate-400">Up to 4 Pax + AC</p>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                          <p className="text-slate-400 text-[10px]">SUV (Innova/Ertiga)</p>
                          <p className="text-xs font-bold text-white">₹{transitResult.car.outstationCab.suvFare.toLocaleString()}</p>
                          <p className="text-[9px] text-slate-400">Up to 6-7 Pax + AC</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 italic">
                        * Includes driver allowance (bata), all state entry permits & FASTag tolls.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                    {onBookTrip && (
                      <button
                        type="button"
                        onClick={() => onBookTrip('car', origin)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-bold hover:brightness-110 shadow-md shadow-red-500/20 flex items-center gap-1.5 transition-all"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Book Outstation Cab</span>
                      </button>
                    )}
                    {onSelectTransitMode && (
                      <button
                        type="button"
                        onClick={() =>
                          onSelectTransitMode(
                            'car',
                            transitResult.car.personal.totalCost,
                            `Car Travel (${transitResult.car.personal.drivingTimeStr})`
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold hover:opacity-90 transition-opacity"
                      >
                        Add Car/Cab to Trip (₹{transitResult.car.personal.totalCost.toLocaleString()})
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* DETAILS: FLIGHT */}
              {expandedModeDetails === 'flight' && (
                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Plane className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Live Airline Fares & Schedule</span>
                    </h5>
                    <span className="text-[11px] text-slate-400">
                      Air Time: <strong>{transitResult.flight.durationStr}</strong>
                    </span>
                  </div>

                  {transitResult.flight.available ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {transitResult.flight.operators.map((op, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-850 border border-slate-750 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-indigo-300">{op.airline}</span>
                              <span className="text-[10px] font-extrabold text-white">₹{op.price.toLocaleString()}</span>
                            </div>
                            <div className="text-[11px] text-slate-300 flex items-center justify-between">
                              <span>{op.departureTime} → {op.arrivalTime}</span>
                              <span className="text-[10px] text-slate-400">{op.duration}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">{op.stops} • {op.baggage}</p>
                            <div className="text-[9px] text-emerald-400">{op.onTimeRating}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                        {onBookTrip && (
                          <button
                            type="button"
                            onClick={() => onBookTrip('flight', origin)}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-bold hover:brightness-110 shadow-md shadow-red-500/20 flex items-center gap-1.5 transition-all"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                            <span>Book Flight Ticket</span>
                          </button>
                        )}
                        {onSelectTransitMode && (
                          <button
                            type="button"
                            onClick={() =>
                              onSelectTransitMode(
                                'flight',
                                transitResult.flight.totalPerPerson * passengers,
                                `Flight Travel (${transitResult.flight.durationStr})`
                              )
                            }
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold hover:opacity-90 transition-opacity"
                          >
                            Add Flight to Trip (₹{(transitResult.flight.totalPerPerson * passengers).toLocaleString()})
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1.5">
                      <p className="text-xs text-slate-300 font-semibold">
                        Direct commercial flights to {destination.name} are not available due to mountainous or protected ecology.
                      </p>
                      <p className="text-[11px] text-cyan-300">
                        Recommended route: Fly to nearest major airport, then take an scenic 2-3h AC cab or Vande Bharat connecting train.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
