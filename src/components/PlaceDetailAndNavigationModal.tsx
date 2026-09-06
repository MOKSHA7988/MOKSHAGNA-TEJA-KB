import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MapPin,
  Clock,
  IndianRupee,
  Navigation,
  Compass,
  Check,
  Plus,
  Share2,
  Copy,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Phone,
  Car,
  Camera,
  Layers,
  Calendar,
  Info,
} from 'lucide-react';
import { Place, Destination } from '../types/travel';

interface PlaceDetailAndNavigationModalProps {
  place: Place | null;
  destination: Destination;
  isOpen: boolean;
  onClose: () => void;
  onAddPlaceToTrip?: (place: Place) => void;
  isAdded?: boolean;
}

export const PlaceDetailAndNavigationModal: React.FC<PlaceDetailAndNavigationModalProps> = ({
  place,
  destination,
  isOpen,
  onClose,
  onAddPlaceToTrip,
  isAdded = false,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [mapZoom, setMapZoom] = useState(14);

  if (!isOpen || !place) return null;

  const images = place.images && place.images.length > 0 ? place.images : [destination.heroImage];
  const activeImage = images[activeImageIdx] || images[0];

  const handleCopyCoordinates = () => {
    const coordStr = `${place.lat.toFixed(5)}, ${place.lng.toFixed(5)}`;
    navigator.clipboard?.writeText(coordStr);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2200);
  };

  const handleShare = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
    if (navigator.share) {
      navigator.share({
        title: `${place.name} - ${destination.name}`,
        text: `Check out ${place.name} in ${destination.name}!`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2200);
    }
  };

  const googleMapsNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}&destination_place_name=${encodeURIComponent(place.name + ', ' + destination.name)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        id="place-detail-modal"
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Modal Top Header Bar with Close Button */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md transition-all shadow-md cursor-pointer"
            title="Share Location"
          >
            {shareSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md transition-all shadow-md cursor-pointer"
            title="Close Details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8 space-y-6">
          {/* Hero Visual Banner & Gallery */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
              <img
                src={activeImage}
                alt={place.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Badges on hero */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-500/90 backdrop-blur-md text-white text-xs font-bold shadow-md">
                  {place.category}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 text-xs font-black flex items-center gap-1 shadow-md">
                  ★ {place.rating} ({place.reviewsCount.toLocaleString()} reviews)
                </span>
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{destination.name}, {destination.state}</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight drop-shadow-md">
                  {place.name}
                </h2>
              </div>
            </div>

            {/* Gallery Thumbnails (if multiple) */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      activeImageIdx === idx ? 'border-cyan-400 ring-2 ring-cyan-400/40' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${place.name} thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Key Facts Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-850/90 border border-slate-750">
              <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Dwell Duration
              </span>
              <strong className="text-sm font-bold text-white mt-1 block">{place.timeNeeded}</strong>
              <span className="text-[10px] text-slate-400 capitalize">
                Best: {place.recommendedTimeSlot || 'morning'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-850/90 border border-slate-750">
              <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Entry Fee
              </span>
              <strong className="text-sm font-bold text-emerald-400 mt-1 block">
                {place.entryFee === 0 ? 'Free Entry' : `₹${place.entryFee} / person`}
              </strong>
              <span className="text-[10px] text-slate-400">
                {place.cameraFee ? `Camera: ${place.cameraFee}` : 'Smartphones allowed'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-850/90 border border-slate-750">
              <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Best Visiting Time
              </span>
              <strong className="text-xs font-bold text-amber-300 mt-1 block leading-tight">
                {place.bestTimeToVisit}
              </strong>
              <span className="text-[10px] text-slate-400">
                {place.visitingHours ? place.visitingHours.slice(0, 18) : 'Daytime hours'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-850/90 border border-slate-750">
              <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-indigo-400" /> Parking & Transit
              </span>
              <strong className="text-xs font-bold text-indigo-300 mt-1 block leading-tight">
                {place.parkingFee || 'Parking Available'}
              </strong>
              <span className="text-[10px] text-slate-400">Paved road access</span>
            </div>
          </div>

          {/* Place Overview & Highlight Banner */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-850 to-slate-900 border border-cyan-500/30">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-1">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Key Attraction Highlight</span>
              </div>
              <p className="text-sm font-semibold text-white">
                {place.highlight || place.description}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-2">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Description & Architecture</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {place.description}
              </p>
              {place.fullHistory && (
                <div className="pt-3 border-t border-slate-700/60 mt-2 space-y-1.5">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Historical Background & Significance
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {place.fullHistory}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Visiting Hours, Days & Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Visiting Hours & Schedule</span>
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Timings:</span>
                  <strong className="text-white">{place.visitingHours || '09:00 AM - 05:30 PM'}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Operating Days:</span>
                  <strong className="text-emerald-400">{place.openingDays || 'Open all 7 days of the week'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Distance from Center:</span>
                  <span className="text-cyan-300 text-right font-medium">{place.distanceFromCenter || 'Approx 8 km from central town'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Helpline & Official Inquiries</span>
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                <p className="text-slate-400">
                  For guided tour bookings, photography permissions, and special wheelchair assistance:
                </p>
                {place.contactNumber ? (
                  <a
                    href={`tel:${place.contactNumber.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 font-bold transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Information Desk: {place.contactNumber}</span>
                  </a>
                ) : (
                  <span className="text-slate-400 italic">Managed by State Tourism Department (Helpline 1363)</span>
                )}
              </div>
            </div>
          </div>

          {/* Traveler Tips & Etiquette */}
          {place.etiquetteTips && place.etiquetteTips.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-750 space-y-2">
              <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Visitor Guidelines & Etiquette</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {place.etiquetteTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* INTERACTIVE MAP & NAVIGATION SECTION */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <Navigation className="w-4 h-4" />
                  <span>Google Maps & Live Navigation</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  Route to {place.name}
                </h3>
              </div>

              {/* Coordinates Pill with Copy Button */}
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{place.lat.toFixed(4)}° N, {place.lng.toFixed(4)}° E</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCoordinates}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center gap-1 cursor-pointer transition-all"
                  title="Copy GPS Coordinates"
                >
                  {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Embedded Live Map View */}
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner">
              <iframe
                title={`Map of ${place.name}`}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://maps.google.com/maps?q=${place.lat},${place.lng}&hl=en&z=${mapZoom}&output=embed`}
                className="w-full h-full border-0 filter contrast-105"
              />

              {/* Map Floating Overlay Control Bar */}
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] font-bold text-white flex items-center gap-2 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Destination Pin: {place.name}</span>
              </div>

              {/* Zoom In/Out Floating Controls */}
              <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-lg">
                <button
                  type="button"
                  onClick={() => setMapZoom((prev) => Math.min(prev + 1, 18))}
                  className="w-8 h-8 rounded-lg bg-slate-850 hover:bg-slate-700 text-white font-black text-sm flex items-center justify-center transition-all cursor-pointer"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setMapZoom((prev) => Math.max(prev - 1, 10))}
                  className="w-8 h-8 rounded-lg bg-slate-850 hover:bg-slate-700 text-white font-black text-sm flex items-center justify-center transition-all cursor-pointer"
                  title="Zoom Out"
                >
                  -
                </button>
              </div>
            </div>

            {/* Turn-by-Turn Navigation Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="text-xs text-slate-400 space-y-0.5">
                <span className="font-bold text-slate-300 block">
                  📍 {place.distanceFromCenter || `Located in ${destination.name}`}
                </span>
                <p className="text-[11px] text-slate-400">
                  Tap below to launch real-time turn-by-turn driving or walking directions in Google Maps.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={googleMapsNavUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Navigate in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
                </a>

                {onAddPlaceToTrip && (
                  <button
                    type="button"
                    onClick={() => onAddPlaceToTrip(place)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Added to Plan</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Add to Trip Plan</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
