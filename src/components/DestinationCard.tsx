import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Sparkles,
  Heart,
  Calendar,
  IndianRupee,
  DollarSign,
  Euro,
  ArrowRight,
  Sun,
  CloudSnow,
  CloudRain,
  CloudSun,
  FileText,
  Download,
  Video,
  Flame,
  Train,
  Car,
  Plane,
  Clock,
  Compass,
  Ticket,
} from 'lucide-react';
import { Destination } from '../types/travel';
import { getCreatorSpotsForDestination } from '../data/creatorReelSpots';
import { getQuickTransitSummary } from '../utils/transitPricing';
import { LiveWeatherData, fetchRealTimeWeather, getStaticFallbackWeather } from '../utils/liveWeather';

interface DestinationCardProps {
  destination: Destination;
  currency: 'INR' | 'USD' | 'EUR';
  isSaved: boolean;
  userBudget?: number;
  budgetType?: 'per_day' | 'total';
  onToggleSave: (id: string) => void;
  onSelect: (destination: Destination) => void;
  onPlanTrip: (destination: Destination) => void;
  onDownloadPDF?: (destination: Destination) => void;
  onBookTrip?: (destination: Destination, travelMode?: 'flight' | 'train' | 'car' | 'bus') => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  currency,
  isSaved,
  userBudget,
  budgetType = 'per_day',
  onToggleSave,
  onSelect,
  onPlanTrip,
  onDownloadPDF,
  onBookTrip,
}) => {
  const formatPrice = (inr: number) => {
    if (currency === 'USD') return `$${Math.round(inr / 85).toLocaleString()}`;
    if (currency === 'EUR') return `€${Math.round(inr / 92).toLocaleString()}`;
    return `₹${inr.toLocaleString()}`;
  };

  const getClimateBadge = (climate: string) => {
    switch (climate) {
      case 'cool':
        return { icon: CloudRain, label: 'Cool & Misty', color: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/30' };
      case 'snowy':
        return { icon: CloudSnow, label: 'Snow & Alpine', color: 'text-sky-300 bg-sky-950/60 border-sky-500/30' };
      case 'tropical':
        return { icon: Sun, label: 'Tropical Warm', color: 'text-amber-300 bg-amber-950/60 border-amber-500/30' };
      default:
        return { icon: Sun, label: 'Pleasant', color: 'text-teal-300 bg-teal-950/60 border-teal-500/30' };
    }
  };

  const climateInfo = getClimateBadge(destination.climate);
  const ClimateIcon = climateInfo.icon;
  const creatorSpots = getCreatorSpotsForDestination(destination.id);

  // Real-time live weather
  const [liveWeather, setLiveWeather] = useState<LiveWeatherData>(() =>
    getStaticFallbackWeather(destination.name, destination.climate)
  );

  useEffect(() => {
    let isMounted = true;
    fetchRealTimeWeather(destination).then((data) => {
      if (isMounted) setLiveWeather(data);
    });
    return () => {
      isMounted = false;
    };
  }, [destination.name]);

  // Real-time multi-modal transit pricing (Train, Car, Flight)
  const transitQuick = useMemo(() => getQuickTransitSummary(destination.name, 'Bengaluru'), [destination.name]);

  const activeDailyCost =
    userBudget && budgetType === 'per_day'
      ? userBudget
      : userBudget && budgetType === 'total'
      ? Math.round(userBudget / (destination.idealDays || 3))
      : destination.estimatedBudgetPerDay.standard;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      id={`destination-card-${destination.id}`}
      className="group relative bg-slate-900/80 hover:bg-slate-850/90 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col"
    >
      {/* Top Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-950">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          {/* AI Score if available */}
          {destination.aiScore ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs font-black shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{destination.aiScore}% Match</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-amber-300 text-xs font-bold shadow-md">
              <span>★ {destination.rating}</span>
            </div>
          )}

          {/* Action buttons on top right */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {onDownloadPDF && (
              <button
                id={`pdf-quick-btn-${destination.id}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadPDF(destination);
                }}
                className="p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 backdrop-blur-md transition-all shadow-md"
                title="Download Day-Wise Schedule PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            <button
              id={`save-btn-${destination.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(destination.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                isSaved
                  ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-rose-400'
              }`}
              title={isSaved ? 'Remove from Saved' : 'Save to Favorites'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom Image Tagging */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs gap-2">
          {/* Real-time weather live pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold backdrop-blur-md shadow-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>{liveWeather.tempStr}</span>
            <span className="text-slate-300 font-medium truncate max-w-[90px]">{liveWeather.condition}</span>
          </div>

          <div className="px-2.5 py-0.5 rounded-full bg-slate-900/85 border border-slate-700/80 text-slate-300 text-[11px] font-medium backdrop-blur-md shrink-0">
            {destination.idealDays} Days Rec.
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Location & Title */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-cyan-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>{destination.state}, {destination.country}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{destination.type}</span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
            {destination.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {destination.tagline || destination.description}
          </p>

          {creatorSpots.length > 0 && (
            <div className="pt-1 flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-bold flex items-center gap-1">
                <Video className="w-3 h-3 text-rose-400" />
                <span>{creatorSpots.length} Viral Reel Spots</span>
              </span>
              <span className="text-[10px] text-slate-400">
                • {creatorSpots[0].aestheticVibe}
              </span>
            </div>
          )}

          {/* Real-Time Travel Modes (Train, Car, Flight) Fares Strip */}
          <div className="pt-2">
            <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-bold text-slate-300 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-cyan-400" />
                  <span>Real-Time Travel Modes (from BLR)</span>
                </span>
                <span className="text-emerald-400 font-semibold">{transitQuick.distanceKm} km</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center">
                {/* Train */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onBookTrip) onBookTrip(destination, 'train');
                    else onSelect(destination);
                  }}
                  className="p-1.5 rounded-xl bg-slate-850/80 border border-slate-750/70 hover:border-cyan-400 hover:bg-slate-800 cursor-pointer transition-all active:scale-[0.97] group/transit"
                  title="Click to Book Train Ticket (IRCTC)"
                >
                  <div className="flex items-center justify-center gap-1 text-[10px] text-cyan-300 font-bold group-hover/transit:text-cyan-200">
                    <Train className="w-3 h-3" />
                    <span>Train</span>
                  </div>
                  <p className="text-xs font-black text-white mt-0.5">₹{transitQuick.train.price.toLocaleString()}</p>
                  <p className="text-[9px] text-slate-400">{transitQuick.train.duration}</p>
                </div>

                {/* Car */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onBookTrip) onBookTrip(destination, 'car');
                    else onSelect(destination);
                  }}
                  className="p-1.5 rounded-xl bg-slate-850/80 border border-slate-750/70 hover:border-emerald-400 hover:bg-slate-800 cursor-pointer transition-all active:scale-[0.97] group/transit"
                  title="Click to Book Outstation Cab / Road Trip"
                >
                  <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-300 font-bold group-hover/transit:text-emerald-200">
                    <Car className="w-3 h-3" />
                    <span>Car / Cab</span>
                  </div>
                  <p className="text-xs font-black text-white mt-0.5">₹{transitQuick.car.personalFuelToll.toLocaleString()}</p>
                  <p className="text-[9px] text-slate-400">{transitQuick.car.duration}</p>
                </div>

                {/* Flight */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onBookTrip) onBookTrip(destination, 'flight');
                    else onSelect(destination);
                  }}
                  className="p-1.5 rounded-xl bg-slate-850/80 border border-slate-750/70 hover:border-indigo-400 hover:bg-slate-800 cursor-pointer transition-all active:scale-[0.97] group/transit"
                  title="Click to Book Flight Ticket"
                >
                  <div className="flex items-center justify-center gap-1 text-[10px] text-indigo-300 font-bold group-hover/transit:text-indigo-200">
                    <Plane className="w-3 h-3" />
                    <span>Flight</span>
                  </div>
                  <p className="text-xs font-black text-white mt-0.5">
                    {transitQuick.flight.available ? `₹${transitQuick.flight.price.toLocaleString()}` : 'Via Hub'}
                  </p>
                  <p className="text-[9px] text-slate-400">
                    {transitQuick.flight.available ? transitQuick.flight.duration : 'Scenic road'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Price and Actions */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="text-[10px] text-slate-400 font-medium">
                {userBudget ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>⚡ Your Budget Target</span>
                  </span>
                ) : (
                  'Standard Daily Est.'
                )}
              </p>
              <p className={`text-sm font-bold ${userBudget ? 'text-emerald-300' : 'text-emerald-400'}`}>
                {formatPrice(activeDailyCost)}
                <span className="text-[10px] text-slate-400 font-normal"> /day</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-medium">Best Season</p>
              <p className="text-xs font-semibold text-slate-300 truncate max-w-[120px]">
                {destination.bestTimeToVisitMonths.split(' ')[0]} - {destination.bestTimeToVisitMonths.split(' ')[2] || 'Mar'}
              </p>
            </div>
          </div>

          {/* Primary Quick Book Bar */}
          {onBookTrip && (
            <button
              id={`card-book-trip-btn-${destination.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onBookTrip(destination);
              }}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 hover:brightness-110 shadow-md shadow-rose-900/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Book Trip (Travel + Stay + Pass)</span>
              <span className="text-[10px] bg-black/25 px-1.5 py-0.5 rounded-md font-mono">
                From ₹{transitQuick.train.price.toLocaleString()}
              </span>
            </button>
          )}

          <div className="grid grid-cols-3 gap-2 pt-0.5">
            <button
              id={`card-view-btn-${destination.id}`}
              onClick={() => onSelect(destination)}
              className="py-1.5 px-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all text-center"
            >
              Overview
            </button>
            <button
              id={`card-pdf-btn-${destination.id}`}
              onClick={() => {
                if (onDownloadPDF) onDownloadPDF(destination);
                else onPlanTrip(destination);
              }}
              className="py-1.5 px-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 transition-all text-center flex items-center justify-center gap-1"
              title="Download Day-Wise PDF"
            >
              <Download className="w-3 h-3 text-cyan-400" />
              <span>PDF</span>
            </button>
            <button
              id={`card-plan-btn-${destination.id}`}
              onClick={() => onPlanTrip(destination)}
              className="py-1.5 px-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-95 shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1"
            >
              <span>Plan</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
