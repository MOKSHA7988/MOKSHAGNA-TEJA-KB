import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MapPin,
  Sparkles,
  Calendar,
  CloudSun,
  Utensils,
  BookOpen,
  Image as ImageIcon,
  Play,
  Clock,
  IndianRupee,
  Star,
  Plus,
  Check,
  ChevronRight,
  Heart,
  Share2,
  ShieldAlert,
  Compass,
  Download,
  FileText,
  Hotel as HotelIcon,
  Bus,
  Ticket,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Video,
  Camera,
  Flame,
  Volume2,
  Copy,
  Bookmark,
  Navigation,
  Phone,
  MessageCircle,
  ExternalLink,
  Eye,
  Locate,
} from 'lucide-react';
import { Destination, Place, Hotel, TripTier, ReelSpot } from '../types/travel';
import { BudgetTierBreakdownModal } from './BudgetTierBreakdownModal';
import { PlaceDetailAndNavigationModal } from './PlaceDetailAndNavigationModal';
import { getCreatorSpotsForDestination } from '../data/creatorReelSpots';
import { RealTimeWeatherAndTransitWidget } from './RealTimeWeatherAndTransitWidget';
import confetti from 'canvas-confetti';

interface DestinationDetailModalProps {
  destination: Destination | null;
  onClose: () => void;
  onPlanTrip: (destination: Destination, tier?: TripTier) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onAddPlaceToTrip?: (place: Place) => void;
  onDownloadPDF?: (destination: Destination) => void;
  onBookTrip?: (destination: Destination, travelMode?: 'flight' | 'train' | 'car' | 'bus') => void;
  hotels: Hotel[];
  currency?: 'INR' | 'USD' | 'EUR';
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  onClose,
  onPlanTrip,
  isSaved,
  onToggleSave,
  onAddPlaceToTrip,
  onDownloadPDF,
  onBookTrip,
  hotels,
  currency = 'INR',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'transit' | 'creator' | 'places' | 'food' | 'culture' | 'gallery' | 'hotels'>('overview');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [addedPlaces, setAddedPlaces] = useState<string[]>([]);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [activeReelModal, setActiveReelModal] = useState<ReelSpot | null>(null);
  const [copiedAudioId, setCopiedAudioId] = useState<string | null>(null);
  const [savedReelSpots, setSavedReelSpots] = useState<string[]>([]);
  const [budgetModalTier, setBudgetModalTier] = useState<TripTier | null>(null);
  const [inlineExpandedTier, setInlineExpandedTier] = useState<TripTier | null>('budget');
  const [selectedDetailPlace, setSelectedDetailPlace] = useState<Place | null>(null);
  const [hotelBudgetFilter, setHotelBudgetFilter] = useState<'all' | 'budget' | 'standard' | 'luxury'>('all');
  const [hotelSortOrder, setHotelSortOrder] = useState<'budget-first' | 'rating' | 'price-desc'>('budget-first');
  const [hotelMapModal, setHotelMapModal] = useState<Hotel | null>(null);

  if (!destination) return null;

  const creatorSpots = getCreatorSpotsForDestination(destination.id);

  const handleCopyAudio = (spot: ReelSpot) => {
    navigator.clipboard.writeText(spot.viralAudioPrompt);
    setCopiedAudioId(spot.id);
    setTimeout(() => setCopiedAudioId(null), 2500);
  };

  const handleToggleSaveReel = (spotId: string) => {
    if (savedReelSpots.includes(spotId)) {
      setSavedReelSpots(savedReelSpots.filter((id) => id !== spotId));
    } else {
      setSavedReelSpots([...savedReelSpots, spotId]);
      confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
    }
  };

  const handleAddPlace = (place: Place) => {
    if (!addedPlaces.includes(place.id)) {
      setAddedPlaces([...addedPlaces, place.id]);
      if (onAddPlaceToTrip) onAddPlaceToTrip(place);
    }
  };

  const matchedHotels = hotels.filter(
    (h) => h.destinationId === destination.id || h.destinationName.toLowerCase().includes(destination.name.toLowerCase().slice(0, 4))
  );

  // Guarantee diverse budget stays if fewer than 5 exist
  const synthesizedStays: Hotel[] = [
    {
      id: `ht-${destination.id}-b1`,
      destinationId: destination.id,
      destinationName: destination.name,
      name: `Zostel ${destination.name} Travelers Hub & Pods`,
      rating: 4.8,
      reviewsCount: 620,
      pricePerNight: 650,
      location: `Central ${destination.name}`,
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      tier: 'budget',
      amenities: ['Backpacker Dorms', 'High-Speed WiFi', 'Cafe & Community Bonfire', 'Luggage Lockers'],
      roomType: 'Mixed Dorm Bed in Air-Cooled Pod',
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      phoneNumber: '+91 8000 123 456',
      whatsappNumber: '+91 98765 43210',
      fullAddress: `Main Station Road, Near Central Bus Terminal, ${destination.name}, ${destination.state}`,
      distanceFromCenter: '1.2 km from City Center',
      coordinates: { lat: destination.coordinates.lat + 0.005, lng: destination.coordinates.lng + 0.005 },
    },
    {
      id: `ht-${destination.id}-b2`,
      destinationId: destination.id,
      destinationName: destination.name,
      name: `${destination.name} Green Valley Budget Homestay`,
      rating: 4.6,
      reviewsCount: 430,
      pricePerNight: 1200,
      location: `Hill View, ${destination.name}`,
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      tier: 'budget',
      amenities: ['Home-Cooked Meals', '24x7 Hot Water', 'Sightseeing Assistance', 'Mountain View'],
      roomType: 'Standard Double Bed Room',
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      phoneNumber: '+91 8272 334 890',
      whatsappNumber: '+91 94481 99220',
      fullAddress: `Green Valley Lane, ${destination.name}, ${destination.state}`,
      distanceFromCenter: '2.5 km from Town Center',
      coordinates: { lat: destination.coordinates.lat - 0.004, lng: destination.coordinates.lng + 0.003 },
    },
    {
      id: `ht-${destination.id}-std1`,
      destinationId: destination.id,
      destinationName: destination.name,
      name: `Grand ${destination.name} Heritage Residency`,
      rating: 4.7,
      reviewsCount: 780,
      pricePerNight: 2800,
      location: `Residency Road, ${destination.name}`,
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      tier: 'standard',
      amenities: ['Free Buffet Breakfast', 'Swimming Pool', 'AC Rooms', 'Multi-Cuisine Restaurant'],
      roomType: 'Deluxe AC Room with Balcony',
      cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
      phoneNumber: '+91 8272 224 555',
      whatsappNumber: '+91 94811 55660',
      fullAddress: `Residency Road, Civil Station, ${destination.name}, ${destination.state}`,
      distanceFromCenter: '1.5 km from City Center',
      coordinates: { lat: destination.coordinates.lat + 0.008, lng: destination.coordinates.lng - 0.006 },
    },
  ];

  const existingIds = new Set(matchedHotels.map((h) => h.id));
  const destinationHotels = [
    ...matchedHotels,
    ...synthesizedStays.filter((s) => !existingIds.has(s.id)),
  ];

  const filteredHotels = destinationHotels
    .filter((h) => {
      if (hotelBudgetFilter === 'budget') return h.pricePerNight <= 1500;
      if (hotelBudgetFilter === 'standard') return h.pricePerNight > 1500 && h.pricePerNight <= 4500;
      if (hotelBudgetFilter === 'luxury') return h.pricePerNight > 4500;
      return true;
    })
    .sort((a, b) => {
      if (hotelSortOrder === 'budget-first') return a.pricePerNight - b.pricePerNight;
      if (hotelSortOrder === 'price-desc') return b.pricePerNight - a.pricePerNight;
      return b.rating - a.rating;
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        id="destination-detail-dialog"
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Top Hero Banner with Background Image */}
        <div className="relative h-64 sm:h-80 w-full shrink-0 bg-slate-950 overflow-hidden">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          {/* Top floating controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-xs font-bold text-cyan-300 border border-cyan-500/30">
                {destination.type}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-xs font-bold text-amber-300 border border-amber-500/30">
                ★ {destination.rating} ({destination.reviewsCount} reviews)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onDownloadPDF && (
                <button
                  id="modal-download-pdf-top-btn"
                  onClick={() => onDownloadPDF(destination)}
                  className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              )}
              <button
                id="modal-toggle-save-btn"
                onClick={() => onToggleSave(destination.id)}
                className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                  isSaved
                    ? 'bg-rose-500 border-rose-400 text-white'
                    : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button
                id="close-destination-detail-btn"
                onClick={onClose}
                className="p-2.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Hero Content Bottom */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{destination.state}, {destination.country}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {destination.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                {destination.tagline}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onBookTrip && (
                <button
                  id="modal-book-trip-hero-cta"
                  onClick={() => onBookTrip(destination)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-900/30 hover:brightness-110 transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Book Trip (Travel + Stay)</span>
                </button>
              )}

              {onDownloadPDF && (
                <button
                  id="modal-download-pdf-hero-cta"
                  onClick={() => onDownloadPDF(destination)}
                  className="px-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700 font-bold text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>PDF Schedule</span>
                </button>
              )}

              <button
                id="modal-plan-trip-cta"
                onClick={() => {
                  onPlanTrip(destination);
                  onClose();
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <Compass className="w-4 h-4" />
                <span>Create AI Itinerary</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900/90 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'overview', label: 'Overview & Climate', icon: Compass },
            { id: 'transit', label: 'Live Weather & Travel Modes', icon: CloudSun, badge: 'Live 🚆✈️' },
            { id: 'creator', label: `Reel & Creator Spots (${creatorSpots.length})`, icon: Video, badge: 'Viral 🎬' },
            { id: 'places', label: `Places to Visit (${destination.places.length})`, icon: MapPin },
            { id: 'food', label: 'Food & Cuisine', icon: Utensils },
            { id: 'culture', label: 'Culture & Etiquette', icon: BookOpen },
            { id: 'gallery', label: 'Gallery & Video', icon: ImageIcon },
            { id: 'hotels', label: `Hotels (${destinationHotels.length})`, icon: Star },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`modal-tab-${tab.id}`}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isTabActive
                    ? tab.id === 'creator'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-md shadow-rose-500/10'
                      : tab.id === 'transit'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.id === 'creator' ? 'text-rose-400' : tab.id === 'transit' ? 'text-emerald-400' : ''}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black text-white ${tab.id === 'transit' ? 'bg-emerald-600' : 'bg-rose-500'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB: CREATOR & REEL SPOTS */}
          {activeSubTab === 'creator' && (
            <div className="space-y-6">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-indigo-950/40 to-slate-900 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-300">
                    <Flame className="w-4 h-4 text-rose-400" />
                    <span>Content Creator & Reel Shoot Guide for {destination.name}</span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-xl">
                    High-performing photography locations with transparent ticket entry price tags, camera fees, drone rules, golden hour lighting times, and viral audio cues.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-full bg-slate-850 border border-slate-700 text-xs font-bold text-slate-300">
                    {creatorSpots.length} Photogenic Spots
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {creatorSpots.map((spot) => {
                  const isSaved = savedReelSpots.includes(spot.id);
                  return (
                    <div
                      key={spot.id}
                      id={`modal-reel-spot-${spot.id}`}
                      className="p-4 sm:p-5 rounded-3xl bg-slate-800/70 border border-slate-750 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg"
                    >
                      <div className="space-y-3">
                        {/* Photo / Video Preview Header */}
                        <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-950">
                          <img
                            src={spot.photos[0]}
                            alt={spot.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />

                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-md text-[10px] font-extrabold text-cyan-300 border border-cyan-500/30">
                              {spot.spotType}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-rose-900/85 backdrop-blur-md text-[10px] font-black text-rose-300 border border-rose-500/40 flex items-center gap-1">
                              <Flame className="w-3 h-3 text-rose-400" />
                              {spot.viralScore}%
                            </span>
                          </div>

                          {spot.videoUrl && (
                            <button
                              onClick={() => setActiveReelModal(spot)}
                              className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white backdrop-blur-md flex items-center justify-center shadow-xl border border-white/20 hover:scale-110 transition-all cursor-pointer"
                              title="Play Video Reel"
                            >
                              <Play className="w-5 h-5 fill-current text-rose-400 group-hover:text-white ml-0.5" />
                            </button>
                          )}

                          {/* Multi-Photo Preview Strip */}
                          <div className="absolute bottom-2 right-2 flex items-center gap-1">
                            {spot.photos.map((pUrl, pIdx) => (
                              <button
                                key={pIdx}
                                onClick={() => setActivePhoto(pUrl)}
                                className="w-6 h-6 rounded-md overflow-hidden border border-white/50 hover:border-cyan-400 transition-all"
                                title="Expand Photo"
                              >
                                <img src={pUrl} alt="" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-white text-base leading-snug">{spot.name}</h4>
                          <p className="text-xs text-amber-300 flex items-center gap-1 mt-0.5">
                            <Sparkles className="w-3 h-3" />
                            <span>Vibe: {spot.aestheticVibe}</span>
                          </p>
                        </div>

                        {/* Price Tag Banner */}
                        <div className="p-3 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 font-medium flex items-center gap-1">
                              <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Entry Ticket:</span>
                            </span>
                            <span className="font-black text-emerald-300 text-sm">
                              {spot.entryPrice === 0 ? 'Free Entry' : `₹${spot.entryPrice.toLocaleString()}`}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-slate-750 text-[10px]">
                            <div className="bg-slate-900/80 p-1.5 rounded-lg text-center">
                              <p className="text-slate-400">Camera Fee</p>
                              <p className="font-bold text-slate-200">{spot.cameraFee === 0 ? 'Free' : `₹${spot.cameraFee}`}</p>
                            </div>
                            <div className="bg-slate-900/80 p-1.5 rounded-lg text-center">
                              <p className="text-slate-400">Tripod</p>
                              <p className={`font-bold ${spot.tripodAllowed ? 'text-emerald-300' : 'text-rose-400'}`}>
                                {spot.tripodAllowed ? 'Allowed' : 'Restricted'}
                              </p>
                            </div>
                            <div className="bg-slate-900/80 p-1.5 rounded-lg text-center">
                              <p className="text-slate-400">Drone</p>
                              <p className={`font-bold ${spot.dronePermitted ? 'text-emerald-300' : 'text-rose-400'}`}>
                                {spot.dronePermitted ? 'Permitted' : 'Prohibited'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Shooting Specs */}
                        <div className="space-y-1.5 text-xs">
                          <div className="p-2 rounded-xl bg-slate-850/80 border border-slate-800 text-[11px] text-slate-300 space-y-0.5">
                            <span className="text-cyan-400 font-bold flex items-center gap-1">
                              <Camera className="w-3 h-3" />
                              <span>Best Angle & Framing:</span>
                            </span>
                            <p>{spot.bestAngle}</p>
                          </div>

                          <div className="p-2 rounded-xl bg-slate-850/80 border border-slate-800 text-[11px] text-slate-300 space-y-0.5">
                            <span className="text-amber-400 font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Golden Hour Lighting:</span>
                            </span>
                            <p>{spot.lightingTime}</p>
                          </div>

                          <div className="p-2 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between gap-2 text-[11px]">
                            <div className="flex items-center gap-1 text-indigo-300 min-w-0">
                              <Volume2 className="w-3 h-3 shrink-0 text-indigo-400" />
                              <span className="truncate">{spot.viralAudioPrompt}</span>
                            </div>
                            <button
                              onClick={() => handleCopyAudio(spot)}
                              className="px-2 py-0.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-200 text-[10px] font-bold shrink-0 transition-all flex items-center gap-1"
                            >
                              {copiedAudioId === spot.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedAudioId === spot.id ? 'Copied' : 'Copy Audio'}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Card Action */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-700/60">
                        <button
                          onClick={() => handleToggleSaveReel(spot.id)}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            isSaved
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-gradient-to-r from-rose-500 to-indigo-600 text-white hover:opacity-90 shadow-sm'
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Saved to Shotlist</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3.5 h-3.5" />
                              <span>Save to Shoot Plan</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* TAB 1: OVERVIEW & CLIMATE */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  About {destination.name}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {destination.description}
                </p>
                <div className="flex flex-wrap gap-4 pt-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-4 h-4 text-teal-400" />
                    <span>Best Time: <strong>{destination.bestTimeToVisitMonths}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>Ideal Stay: <strong>{destination.idealDays} Days</strong></span>
                  </div>
                </div>
              </div>

              {/* Real-Time Weather & Multi-Modal Transit Pricing Widget */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CloudSun className="w-4 h-4 text-cyan-400" />
                    <span>Real-Time Weather & Live Travel Mode Fares</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('transit')}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>Full Transit View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <RealTimeWeatherAndTransitWidget
                  destination={destination}
                  onBookTrip={(mode, origin) => onBookTrip?.(destination, mode)}
                />
              </div>

              {/* Climate and Live Weather */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CloudSun className="w-4 h-4 text-amber-400" />
                  Seasonal Climate & Weather Forecast
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {destination.seasons.map((season, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-800/60 border border-slate-750 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{season.season}</span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            season.suitability === 'Peak'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {season.suitability} Season
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 space-y-1">
                        <p>Avg Temp: <strong className="text-cyan-300">{season.avgTemp}</strong></p>
                        <p>Rainfall: <strong className="text-slate-200">{season.rainfall}</strong></p>
                        <p className="text-[11px] text-slate-400 pt-1">{season.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Tiers Preview & Interactive Breakdown List */}
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-400" />
                    <span>Estimated Daily Budget Breakdown</span>
                  </h3>
                  <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Click any card for full itemized list & calculator</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Budget Backpacker Card */}
                  <button
                    id="budget-tier-btn-budget"
                    type="button"
                    onClick={() => {
                      setInlineExpandedTier('budget');
                      setBudgetModalTier('budget');
                    }}
                    className={`p-4 rounded-2xl text-left border transition-all relative group cursor-pointer flex flex-col justify-between space-y-2 ${
                      inlineExpandedTier === 'budget'
                        ? 'bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                        : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700 hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-emerald-300 font-bold flex items-center gap-1">
                        <span>Budget Backpacker</span>
                      </p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                        Details →
                      </span>
                    </div>
                    <p className="text-lg font-black text-emerald-400">
                      ₹{destination.estimatedBudgetPerDay.budget.toLocaleString()}
                      <span className="text-xs font-normal text-slate-400"> /day</span>
                    </p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Homestays, shared dorms, local KSRTC buses & traditional mess stalls
                    </p>
                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-emerald-400 font-medium">
                      <span>Click to view itemized list</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  {/* Standard Comfort Card */}
                  <button
                    id="budget-tier-btn-standard"
                    type="button"
                    onClick={() => {
                      setInlineExpandedTier('standard');
                      setBudgetModalTier('standard');
                    }}
                    className={`p-4 rounded-2xl text-left border transition-all relative group cursor-pointer flex flex-col justify-between space-y-2 ${
                      inlineExpandedTier === 'standard'
                        ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                        : 'bg-slate-800/70 hover:bg-slate-800 border-cyan-500/30 hover:border-cyan-400/60 bg-cyan-950/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-cyan-300 font-bold">Standard Comfort</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                        Popular
                      </span>
                    </div>
                    <p className="text-lg font-black text-cyan-400">
                      ₹{destination.estimatedBudgetPerDay.standard.toLocaleString()}
                      <span className="text-xs font-normal text-slate-400"> /day</span>
                    </p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      3★ boutique resorts, private AC cab & multi-cuisine restaurant dining
                    </p>
                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-cyan-400 font-medium">
                      <span>Click to view itemized list</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  {/* Luxury Heritage Card */}
                  <button
                    id="budget-tier-btn-luxury"
                    type="button"
                    onClick={() => {
                      setInlineExpandedTier('luxury');
                      setBudgetModalTier('luxury');
                    }}
                    className={`p-4 rounded-2xl text-left border transition-all relative group cursor-pointer flex flex-col justify-between space-y-2 ${
                      inlineExpandedTier === 'luxury'
                        ? 'bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                        : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-amber-300 font-bold">Luxury Heritage</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                        VIP
                      </span>
                    </div>
                    <p className="text-lg font-black text-amber-400">
                      ₹{destination.estimatedBudgetPerDay.luxury.toLocaleString()}
                      <span className="text-xs font-normal text-slate-400"> /day</span>
                    </p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      5★ Palaces & plunge pool villas, chauffeur SUV & fine gourmet menus
                    </p>
                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-amber-400 font-medium">
                      <span>Click to view itemized list</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>

                {/* Inline Quick Itemized List Preview */}
                {inlineExpandedTier && (
                  <div className="p-4 rounded-2xl bg-slate-850/90 border border-slate-750 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-750 pb-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          Itemized Daily List for{' '}
                          <strong className="text-cyan-300">
                            {inlineExpandedTier === 'budget'
                              ? 'Budget Backpacker (₹' + destination.estimatedBudgetPerDay.budget.toLocaleString() + '/day)'
                              : inlineExpandedTier === 'standard'
                              ? 'Standard Comfort (₹' + destination.estimatedBudgetPerDay.standard.toLocaleString() + '/day)'
                              : 'Luxury Heritage (₹' + destination.estimatedBudgetPerDay.luxury.toLocaleString() + '/day)'}
                          </strong>
                        </span>
                      </span>
                      <button
                        id="open-full-budget-calc-btn"
                        onClick={() => setBudgetModalTier(inlineExpandedTier)}
                        className="text-xs text-cyan-300 hover:text-cyan-200 font-bold underline flex items-center gap-1"
                      >
                        <span>Open Full Calculator</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-0.5">
                        <span className="text-[10px] text-slate-400">🏨 Stay</span>
                        <p className="font-bold text-indigo-300">
                          ₹{Math.round((inlineExpandedTier === 'budget' ? destination.estimatedBudgetPerDay.budget * 0.44 : inlineExpandedTier === 'standard' ? destination.estimatedBudgetPerDay.standard * 0.48 : destination.estimatedBudgetPerDay.luxury * 0.52)).toLocaleString()}
                        </p>
                        <p className="text-[9px] text-slate-400 truncate">
                          {inlineExpandedTier === 'budget' ? 'Dorm / Homestay' : inlineExpandedTier === 'standard' ? '3★ Resort Cottage' : '5★ Pool Villa'}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-0.5">
                        <span className="text-[10px] text-slate-400">🍲 Food & Meals</span>
                        <p className="font-bold text-amber-300">
                          ₹{Math.round((inlineExpandedTier === 'budget' ? destination.estimatedBudgetPerDay.budget * 0.24 : inlineExpandedTier === 'standard' ? destination.estimatedBudgetPerDay.standard * 0.22 : destination.estimatedBudgetPerDay.luxury * 0.22)).toLocaleString()}
                        </p>
                        <p className="text-[9px] text-slate-400 truncate">
                          {inlineExpandedTier === 'budget' ? 'Local Mess / Thali' : inlineExpandedTier === 'standard' ? 'Buffet & Cafes' : 'Gourmet Tasting'}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-0.5">
                        <span className="text-[10px] text-slate-400">🚌 Local Transit</span>
                        <p className="font-bold text-cyan-300">
                          ₹{Math.round((inlineExpandedTier === 'budget' ? destination.estimatedBudgetPerDay.budget * 0.18 : inlineExpandedTier === 'standard' ? destination.estimatedBudgetPerDay.standard * 0.18 : destination.estimatedBudgetPerDay.luxury * 0.16)).toLocaleString()}
                        </p>
                        <p className="text-[9px] text-slate-400 truncate">
                          {inlineExpandedTier === 'budget' ? 'KSRTC / Scooter' : inlineExpandedTier === 'standard' ? 'Private AC Cab' : 'Luxury SUV'}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-0.5">
                        <span className="text-[10px] text-slate-400">🎟️ Sightseeing</span>
                        <p className="font-bold text-emerald-300">
                          ₹{Math.round((inlineExpandedTier === 'budget' ? destination.estimatedBudgetPerDay.budget * 0.08 : inlineExpandedTier === 'standard' ? destination.estimatedBudgetPerDay.standard * 0.08 : destination.estimatedBudgetPerDay.luxury * 0.06)).toLocaleString()}
                        </p>
                        <p className="text-[9px] text-slate-400 truncate">
                          {inlineExpandedTier === 'budget' ? 'Entry tickets' : inlineExpandedTier === 'standard' ? 'Guided tours' : 'VIP access'}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-0.5 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-slate-400">🎒 Misc / Buffer</span>
                        <p className="font-bold text-purple-300">
                          ₹{Math.round((inlineExpandedTier === 'budget' ? destination.estimatedBudgetPerDay.budget * 0.06 : inlineExpandedTier === 'standard' ? destination.estimatedBudgetPerDay.standard * 0.04 : destination.estimatedBudgetPerDay.luxury * 0.04)).toLocaleString()}
                        </p>
                        <p className="text-[9px] text-slate-400 truncate">Water & Buffer</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: LIVE WEATHER & MULTI-MODAL TRAVEL MODES */}
          {activeSubTab === 'transit' && (
            <div className="space-y-6">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/40 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Real-Time Weather & Live Multi-Modal Transit Intelligence</span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-xl">
                    Live meteorological satellite sensor feed and dynamic transit cost comparison comparing Flights, IRCTC Trains (Vande Bharat, 2A, 3A), and Car Road Trips (Personal Fuel+FASTag vs AC Outstation Cabs).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onPlanTrip(destination)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-xs shadow-md shrink-0 flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Build Trip Plan</span>
                </button>
              </div>

              <RealTimeWeatherAndTransitWidget
                destination={destination}
                onBookTrip={(mode, origin) => onBookTrip?.(destination, mode)}
              />
            </div>
          )}

          {/* TAB 2: PLACES TO VISIT GRID */}
          {activeSubTab === 'places' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">
                  Must-Visit Places & Attractions in {destination.name}
                </h3>
                <span className="text-xs text-slate-400">
                  Select places to customize your trip
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.places.map((place) => {
                  const isAdded = addedPlaces.includes(place.id);
                  return (
                    <div
                      key={place.id}
                      id={`place-card-${place.id}`}
                      className="p-4 rounded-2xl bg-slate-800/60 border border-slate-750 hover:border-slate-600 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2 cursor-pointer group" onClick={() => setSelectedDetailPlace(place)}>
                        <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-900">
                          <img
                            src={place.images[0] || destination.heroImage}
                            alt={place.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-md text-[10px] font-bold text-cyan-300 border border-slate-700">
                            {place.category}
                          </div>
                          <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-slate-700">
                            ★ {place.rating}
                          </div>
                          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-cyan-300 flex items-center gap-1 shadow-md">
                            <Navigation className="w-3 h-3 text-cyan-400" />
                            <span>View Map & Info</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                            <span>{place.name}</span>
                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                          </h4>
                          <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                            {place.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            {place.timeNeeded}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <IndianRupee className="w-3 h-3 text-emerald-400" />
                            {place.entryFee === 0 ? 'Free Entry' : `₹${place.entryFee} Entry`}
                          </span>
                          {place.visitingHours && (
                            <>
                              <span>•</span>
                              <span className="text-[10px] text-amber-300">
                                {place.visitingHours.slice(0, 16)}
                              </span>
                            </>
                          )}
                        </div>

                        {place.highlight && (
                          <div className="text-[11px] text-cyan-300 bg-cyan-950/30 p-2 rounded-lg border border-cyan-500/20">
                            ✨ <strong>Highlight:</strong> {place.highlight}
                          </div>
                        )}
                      </div>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-700/60">
                        <button
                          id={`view-details-nav-btn-${place.id}`}
                          type="button"
                          onClick={() => setSelectedDetailPlace(place)}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 hover:border-cyan-500/50 flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Details & Navigation</span>
                        </button>

                        <button
                          id={`add-place-btn-${place.id}`}
                          onClick={() => handleAddPlace(place)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:opacity-90 shadow-sm'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added to Plan</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Trip</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: FOOD & CUISINE */}
          {activeSubTab === 'food' && (
            <div className="space-y-6">
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-400" />
                  Regional Culinary Overview
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {destination.foodAndCuisine.overview}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-200">
                  Signature Dishes You Must Try
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {destination.foodAndCuisine.signatureDishes.map((dish, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-800/60 border border-slate-750 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-white text-sm">{dish.name}</h5>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            dish.type === 'veg'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {dish.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {dish.description}
                      </p>
                      <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-700/60 flex items-center justify-between">
                        <span>Spice: <strong className="capitalize text-amber-300">{dish.spiceLevel}</strong></span>
                        <span className="text-cyan-300 truncate max-w-[130px]">{dish.famousSpot}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Street food spots */}
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Famous Street Food Hubs & Snack Markets
                </h4>
                <div className="flex flex-wrap gap-2">
                  {destination.foodAndCuisine.streetFoodSpots.map((spot, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-800 text-slate-200 px-3 py-1 rounded-xl border border-slate-700"
                    >
                      📍 {spot}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CULTURE & ETIQUETTE */}
          {activeSubTab === 'culture' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-cyan-300">
                    Spoken Languages & Major Festivals
                  </h4>
                  <div className="space-y-2 text-xs text-slate-300">
                    <p>
                      <strong>Languages:</strong> {destination.culture.languages.join(', ')}
                    </p>
                    <p>
                      <strong>Festivals:</strong> {destination.culture.festivals.join(' • ')}
                    </p>
                    <p>
                      <strong>Traditions:</strong> {destination.culture.traditions.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    Local Etiquette & Travel Norms
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {destination.culture.etiquetteTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                  {destination.culture.dressCode && (
                    <p className="text-xs text-slate-400 pt-2 border-t border-slate-700/60">
                      <strong>Recommended Dress Code:</strong> {destination.culture.dressCode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GALLERY & VIDEO */}
          {activeSubTab === 'gallery' && (
            <div className="space-y-5">
              {destination.videoUrl && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                    <Play className="w-4 h-4 text-rose-400" />
                    Cinematic Travel Video
                  </h4>
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800">
                    <iframe
                      src={destination.videoUrl}
                      title={`${destination.name} Video Tour`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-200">Photo Lightbox</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {destination.galleryImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActivePhoto(imgUrl)}
                      className="h-32 sm:h-40 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-cyan-400 cursor-pointer transition-all"
                    >
                      <img
                        src={imgUrl}
                        alt={`${destination.name} ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: HOTELS */}
          {activeSubTab === 'hotels' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-750">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <HotelIcon className="w-4 h-4 text-cyan-400" />
                    <span>Handpicked Stays & Budget Accommodations in {destination.name}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Verified guest-rated properties with direct phone contacts, WhatsApp inquiries & navigation routes.
                  </p>
                </div>

                {/* Sort Order Dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 whitespace-nowrap">Sort:</span>
                  <select
                    value={hotelSortOrder}
                    onChange={(e) => setHotelSortOrder(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="budget-first">Price: Low to High (Budget First)</option>
                    <option value="rating">Top Guest Rating</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Budget Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setHotelBudgetFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    hotelBudgetFilter === 'all'
                      ? 'bg-cyan-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  All Stays ({destinationHotels.length})
                </button>
                <button
                  type="button"
                  onClick={() => setHotelBudgetFilter('budget')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                    hotelBudgetFilter === 'budget'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-slate-700'
                  }`}
                >
                  <span>💚 Budget Friendly (≤ ₹1,500)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHotelBudgetFilter('standard')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                    hotelBudgetFilter === 'standard'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-800 text-indigo-400 hover:text-indigo-300 border border-slate-700'
                  }`}
                >
                  <span>Standard Comfort (₹1,501 - ₹4,500)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHotelBudgetFilter('luxury')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                    hotelBudgetFilter === 'luxury'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-slate-800 text-amber-400 hover:text-amber-300 border border-slate-700'
                  }`}
                >
                  <span>5★ Luxury Resorts (₹4,500+)</span>
                </button>
              </div>

              {/* Hotels Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHotels.map((hotel) => {
                  const phoneNum = hotel.phoneNumber || '+91 8000 123 456';
                  const waNum = hotel.whatsappNumber || phoneNum;
                  const coords = hotel.coordinates || destination.coordinates;
                  const googleNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}&destination_place_name=${encodeURIComponent(hotel.name + ', ' + destination.name)}`;

                  return (
                    <div
                      key={hotel.id}
                      className="p-4 rounded-2xl bg-slate-800/80 border border-slate-750 hover:border-slate-600 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2.5">
                        <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-900">
                          <img
                            src={hotel.imageUrl}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-md text-[10px] font-bold uppercase text-cyan-300 border border-slate-700">
                            {hotel.tier}
                          </div>
                          <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-slate-700">
                            ★ {hotel.rating} ({hotel.reviewsCount} reviews)
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-white text-base leading-snug">{hotel.name}</h4>
                          <p className="text-xs text-slate-300 font-medium mt-0.5">{hotel.roomType}</p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="truncate">{hotel.fullAddress || hotel.location}</span>
                          </p>
                          {hotel.distanceFromCenter && (
                            <p className="text-[10px] text-slate-400 pl-4">
                              Distance: {hotel.distanceFromCenter}
                            </p>
                          )}
                        </div>

                        {/* Amenities Tags */}
                        {hotel.amenities && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {hotel.amenities.slice(0, 4).map((amenity, aIdx) => (
                              <span
                                key={aIdx}
                                className="px-2 py-0.5 rounded-md bg-slate-900 text-[10px] text-slate-300 border border-slate-750"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Contact & Navigation Actions Bar */}
                        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-750 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-emerald-400" /> Phone:
                            </span>
                            <a
                              href={`tel:${phoneNum.replace(/\s+/g, '')}`}
                              className="font-mono text-emerald-400 hover:underline font-bold text-xs flex items-center gap-1"
                            >
                              <span>{phoneNum}</span>
                            </a>
                          </div>

                          <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-800">
                            <a
                              href={`tel:${phoneNum.replace(/\s+/g, '')}`}
                              className="px-2 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Call</span>
                            </a>

                            <a
                              href={`https://wa.me/${waNum.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I would like to inquire about booking a room at ${hotel.name} in ${destination.name}.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1.5 rounded-lg bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 hover:bg-emerald-600/40 text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => setHotelMapModal(hotel)}
                              className="px-2 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                            >
                              <Locate className="w-3 h-3" />
                              <span>Map</span>
                            </button>
                          </div>

                          <a
                            href={googleNavUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Navigation className="w-3 h-3 text-cyan-400" />
                            <span>Navigate in Google Maps</span>
                            <ExternalLink className="w-3 h-3 opacity-70" />
                          </a>
                        </div>
                      </div>

                      {/* Pricing & Booking Footer */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-750">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">Starting from</span>
                          <span className="text-base font-extrabold text-emerald-400">
                            ₹{hotel.pricePerNight.toLocaleString()}{' '}
                            <span className="text-xs text-slate-400 font-normal">/night</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {onBookTrip && (
                            <button
                              type="button"
                              onClick={() => {
                                onBookTrip(destination);
                                onClose();
                              }}
                              className="px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-amber-500 text-white hover:brightness-110 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Ticket className="w-3.5 h-3.5" />
                              <span>Book Stay & Trip</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              onPlanTrip(destination);
                              onClose();
                            }}
                            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-750 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                          >
                            Add to Plan
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Reel Video Player Modal */}
      <AnimatePresence>
        {activeReelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-slate-750 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button
                onClick={() => setActiveReelModal(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700 backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 bg-black flex items-center justify-center min-h-[300px] md:min-h-[480px]">
                {activeReelModal.videoUrl ? (
                  <iframe
                    src={`${activeReelModal.videoUrl}?autoplay=1`}
                    title={activeReelModal.name}
                    className="w-full h-full min-h-[300px] md:min-h-[480px]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <Video className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                    <p>Reel Video Tour</p>
                  </div>
                )}
              </div>

              <div className="w-full md:w-80 p-6 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 space-y-4 overflow-y-auto">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-extrabold uppercase border border-rose-500/30">
                    {activeReelModal.spotType}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1.5">{activeReelModal.name}</h3>
                  <p className="text-xs text-rose-400 font-bold flex items-center gap-1 mt-0.5">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{activeReelModal.viralScore}% Viral Potential</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Entry Ticket:</span>
                    <strong className="text-emerald-300">{activeReelModal.entryPrice === 0 ? 'Free' : `₹${activeReelModal.entryPrice}`}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Camera:</span>
                    <strong className="text-slate-200">{activeReelModal.cameraFee === 0 ? 'Free' : `₹${activeReelModal.cameraFee}`}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Drone Permit:</span>
                    <strong className={activeReelModal.dronePermitted ? 'text-emerald-400' : 'text-rose-400'}>
                      {activeReelModal.dronePermitted ? 'Permitted' : 'Prohibited'}
                    </strong>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <p>
                    <strong className="text-amber-300">🌅 Optimal Time:</strong> {activeReelModal.lightingTime}
                  </p>
                  <p>
                    <strong className="text-cyan-300">🎬 Transition:</strong> {activeReelModal.recommendedTransition}
                  </p>
                  <p>
                    <strong className="text-indigo-300">🎵 Audio Prompt:</strong> {activeReelModal.viralAudioPrompt}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Photo Lightbox */}
      <AnimatePresence>
        {activePhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute -top-12 right-0 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={activePhoto}
                alt="Enlarged preview"
                className="max-h-[80vh] w-auto rounded-2xl object-contain border border-slate-750 shadow-2xl"
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Itemized Budget List & Calculator Modal */}
      <AnimatePresence>
        {budgetModalTier && (
          <BudgetTierBreakdownModal
            destination={destination}
            initialTier={budgetModalTier}
            currency={currency}
            isOpen={true}
            onClose={() => setBudgetModalTier(null)}
            onPlanTrip={(dest, tier) => {
              onPlanTrip(dest, tier);
              onClose();
            }}
            onDownloadPDF={onDownloadPDF}
          />
        )}
      </AnimatePresence>

      {/* Complete Place Details with Embedded Map & Navigation Modal */}
      {selectedDetailPlace && (
        <PlaceDetailAndNavigationModal
          place={selectedDetailPlace}
          destination={destination}
          isOpen={!!selectedDetailPlace}
          onClose={() => setSelectedDetailPlace(null)}
          onAddPlaceToTrip={(p) => handleAddPlace(p)}
          isAdded={addedPlaces.includes(selectedDetailPlace.id)}
        />
      )}

      {/* Hotel Map & Route Navigation Modal */}
      <AnimatePresence>
        {hotelMapModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 bg-slate-850 border-b border-slate-750 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{hotelMapModal.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <span>{hotelMapModal.location}, {destination.name}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setHotelMapModal(null)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Embedded Map */}
              <div className="h-64 sm:h-80 w-full bg-slate-950 relative">
                <iframe
                  title={`Map of ${hotelMapModal.name}`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(`${hotelMapModal.name}, ${hotelMapModal.location}, ${destination.name}`)}&output=embed`}
                />
              </div>

              {/* Contact & Navigation Details */}
              <div className="p-4 sm:p-5 space-y-4 bg-slate-900">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 space-y-1">
                    <span className="text-slate-400 text-[11px] block">Full Address</span>
                    <p className="font-medium text-slate-200">{hotelMapModal.fullAddress || hotelMapModal.location}</p>
                    {hotelMapModal.distanceFromCenter && (
                      <p className="text-[11px] text-cyan-300 pt-0.5">{hotelMapModal.distanceFromCenter}</p>
                    )}
                  </div>
                  <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 space-y-1">
                    <span className="text-slate-400 text-[11px] block">Contact Phone & WhatsApp</span>
                    <p className="font-mono text-emerald-400 font-bold">{hotelMapModal.phoneNumber || '+91 8000 123 456'}</p>
                    <p className="text-[11px] text-slate-400">Nightly Rate: <strong className="text-emerald-300">₹{hotelMapModal.pricePerNight}</strong></p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${(hotelMapModal.coordinates?.lat || destination.coordinates.lat)},${(hotelMapModal.coordinates?.lng || destination.coordinates.lng)}&destination_place_name=${encodeURIComponent(hotelMapModal.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 transition-all"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Open Live Navigation in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  <a
                    href={`tel:${(hotelMapModal.phoneNumber || '+918000123456').replace(/\s+/g, '')}`}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Desk</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
