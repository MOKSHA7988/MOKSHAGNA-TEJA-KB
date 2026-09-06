import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video,
  Camera,
  Play,
  Pause,
  Clock,
  Sparkles,
  MapPin,
  Compass,
  Check,
  Copy,
  ChevronRight,
  Share2,
  ExternalLink,
  Film,
  Zap,
  Filter,
  Eye,
  SlidersHorizontal,
  Bookmark,
  Heart,
  IndianRupee,
  Layers,
  Flame,
  Volume2,
} from 'lucide-react';
import { ReelSpot, Destination } from '../types/travel';
import { CREATOR_REEL_SPOTS } from '../data/creatorReelSpots';
import confetti from 'canvas-confetti';

interface ReelCreatorStudioViewProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  savedReelSpotIds?: string[];
  onToggleSaveReelSpot?: (spotId: string) => void;
  currency?: 'INR' | 'USD' | 'EUR';
}

export const ReelCreatorStudioView: React.FC<ReelCreatorStudioViewProps> = ({
  destinations,
  onSelectDestination,
  savedReelSpotIds = [],
  onToggleSaveReelSpot,
  currency = 'INR',
}) => {
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState<string>('all');
  const [selectedSpotType, setSelectedSpotType] = useState<string>('all');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<'all' | 'free' | 'under50'>('all');
  const [droneFilterOnly, setDroneFilterOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Spot for Video / Lightbox Modal
  const [activeVideoSpot, setActiveVideoSpot] = useState<ReelSpot | null>(null);
  const [activePhotoSpot, setActivePhotoSpot] = useState<{ spot: ReelSpot; photoIdx: number } | null>(null);
  const [copiedAudioId, setCopiedAudioId] = useState<string | null>(null);
  const [addedShotlist, setAddedShotlist] = useState<string[]>([]);

  // Format currency
  const formatPrice = (amount: number) => {
    if (amount === 0) return 'Free';
    if (currency === 'USD') return `$${Math.ceil(amount / 85)}`;
    if (currency === 'EUR') return `€${Math.ceil(amount / 92)}`;
    return `₹${amount.toLocaleString()}`;
  };

  const handleCopyAudio = (spot: ReelSpot) => {
    navigator.clipboard.writeText(spot.viralAudioPrompt);
    setCopiedAudioId(spot.id);
    setTimeout(() => setCopiedAudioId(null), 2500);
  };

  const handleToggleShotlist = (spotId: string) => {
    if (addedShotlist.includes(spotId)) {
      setAddedShotlist(addedShotlist.filter((id) => id !== spotId));
    } else {
      setAddedShotlist([...addedShotlist, spotId]);
      if (onToggleSaveReelSpot) onToggleSaveReelSpot(spotId);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
      });
    }
  };

  // Filtered spots
  const filteredSpots = useMemo(() => {
    return CREATOR_REEL_SPOTS.filter((spot) => {
      if (selectedDestinationFilter !== 'all' && spot.destinationId !== selectedDestinationFilter) {
        return false;
      }
      if (selectedSpotType !== 'all' && spot.spotType !== selectedSpotType) {
        return false;
      }
      if (selectedPriceFilter === 'free' && spot.entryPrice > 0) {
        return false;
      }
      if (selectedPriceFilter === 'under50' && spot.entryPrice > 50) {
        return false;
      }
      if (droneFilterOnly && !spot.dronePermitted) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          spot.name.toLowerCase().includes(query) ||
          spot.destinationName.toLowerCase().includes(query) ||
          spot.aestheticVibe.toLowerCase().includes(query) ||
          spot.spotType.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [
    selectedDestinationFilter,
    selectedSpotType,
    selectedPriceFilter,
    droneFilterOnly,
    searchQuery,
  ]);

  const spotTypes = [
    'all',
    'Sunset & Viewpoint',
    'Heritage & Architecture',
    'Waterfall & Mist',
    'Spiritual & Aarti',
    'Street & Culture',
    'Aerial & Drone',
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Hero Banner for Creators */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 p-6 sm:p-10 shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-500/20 via-indigo-500/20 to-cyan-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Video className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Content Creator & Reel Maker Studio</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Discover Viral Reel Spots, Golden Angles & Entry Price Tags
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Curated cinematic photography and reel locations across India with exact ticket entry prices, drone permissions, camera guidelines, golden hour light timings, and viral audio cues.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/30">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">Viral Reel Ready</p>
                <p className="text-[11px] text-slate-400">95%+ Explore Score</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
                <IndianRupee className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">Transparent Price Tags</p>
                <p className="text-[11px] text-slate-400">Entry & Camera Fees</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">Golden Hour Cues</p>
                <p className="text-[11px] text-slate-400">Exact Lighting Timings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search spots by name, vibe (e.g. moody mist, pink palace, sunset)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            <Video className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* Destination Dropdown Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Destination:</span>
            <select
              value={selectedDestinationFilter}
              onChange={(e) => setSelectedDestinationFilter(e.target.value)}
              className="px-3 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="all">All Destinations ({destinations.length})</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Spot Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {spotTypes.map((type) => {
            const isSelected = selectedSpotType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedSpotType(type)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-500 to-indigo-600 text-white shadow-md shadow-rose-500/20'
                    : 'bg-slate-800/70 border border-slate-750 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {type === 'all' ? 'All Types' : type}
              </button>
            );
          })}
        </div>

        {/* Additional Toggle Filters (Price, Drone) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Price Filter:</span>
            <button
              onClick={() => setSelectedPriceFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                selectedPriceFilter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Any Entry Fee
            </button>
            <button
              onClick={() => setSelectedPriceFilter('free')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                selectedPriceFilter === 'free'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              100% Free Spots Only
            </button>
            <button
              onClick={() => setSelectedPriceFilter('under50')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                selectedPriceFilter === 'under50'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ≤ ₹50 Entry
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={droneFilterOnly}
                onChange={(e) => setDroneFilterOnly(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-cyan-500 accent-cyan-500"
              />
              <span className="text-xs">🛸 Drone Permitted Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Spots Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-white">
              Featured Reel & Photography Locations
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-bold">
              {filteredSpots.length} {filteredSpots.length === 1 ? 'Spot' : 'Spots'}
            </span>
          </div>

          <p className="text-xs text-slate-400 hidden sm:block">
            Click any spot to watch video reel or view full high-res photo gallery
          </p>
        </div>

        {filteredSpots.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">No creator spots match current filters</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try resetting destination or price filters to see all top viral spots across India.
            </p>
            <button
              onClick={() => {
                setSelectedDestinationFilter('all');
                setSelectedSpotType('all');
                setSelectedPriceFilter('all');
                setDroneFilterOnly(false);
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-500/30 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.map((spot) => {
              const isAdded = addedShotlist.includes(spot.id) || savedReelSpotIds.includes(spot.id);
              const parentDest = destinations.find((d) => d.id === spot.destinationId);

              return (
                <motion.div
                  key={spot.id}
                  id={`reel-spot-card-${spot.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between group relative"
                >
                  {/* Card Visual Header */}
                  <div>
                    <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                      <img
                        src={spot.photos[0]}
                        alt={spot.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-[11px] font-extrabold text-cyan-300 border border-cyan-500/30">
                          {spot.spotType}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-full bg-rose-950/80 backdrop-blur-md text-[11px] font-black text-rose-300 border border-rose-500/40 flex items-center gap-1">
                            <Flame className="w-3 h-3 text-rose-400" />
                            {spot.viralScore}% Viral
                          </span>
                        </div>
                      </div>

                      {/* Video Play Button Overlay */}
                      {spot.videoUrl && (
                        <button
                          id={`play-reel-btn-${spot.id}`}
                          onClick={() => setActiveVideoSpot(spot)}
                          className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/20 group-hover:scale-110 transition-all cursor-pointer"
                          title="Watch Cinematic Reel Preview"
                        >
                          <Play className="w-6 h-6 fill-current text-rose-400 group-hover:text-white ml-1 transition-colors" />
                        </button>
                      )}

                      {/* Bottom Image Sub-Thumbnail Strip */}
                      <div className="absolute bottom-2.5 right-3 flex items-center gap-1">
                        {spot.photos.map((photoUrl, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => setActivePhotoSpot({ spot, photoIdx: pIdx })}
                            className="w-7 h-7 rounded-lg overflow-hidden border border-white/40 hover:border-cyan-400 transition-all"
                            title="View Photo"
                          >
                            <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>

                      {/* Location Badge */}
                      <div className="absolute bottom-2.5 left-3 text-xs font-bold text-slate-200 flex items-center gap-1 drop-shadow-md">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span>{spot.destinationName}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-4">
                      <div>
                        <h4 className="text-base font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">
                          {spot.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Vibe: <strong className="text-slate-200">{spot.aestheticVibe}</strong></span>
                        </p>
                      </div>

                      {/* Prominent Price Tag Banner */}
                      <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-semibold flex items-center gap-1">
                            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Entry Price:</span>
                          </span>
                          <span className="font-black text-emerald-300 text-sm">
                            {formatPrice(spot.entryPrice)}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-slate-700/60 text-[10px] text-slate-300">
                          <div className="bg-slate-850 p-1.5 rounded-lg text-center">
                            <p className="text-slate-400">Camera</p>
                            <p className="font-bold text-white">{spot.cameraFee === 0 ? 'Free' : formatPrice(spot.cameraFee)}</p>
                          </div>
                          <div className="bg-slate-850 p-1.5 rounded-lg text-center">
                            <p className="text-slate-400">Tripod</p>
                            <p className={`font-bold ${spot.tripodAllowed ? 'text-emerald-300' : 'text-rose-400'}`}>
                              {spot.tripodAllowed ? 'Allowed' : 'Restricted'}
                            </p>
                          </div>
                          <div className="bg-slate-850 p-1.5 rounded-lg text-center">
                            <p className="text-slate-400">Drone</p>
                            <p className={`font-bold ${spot.dronePermitted ? 'text-emerald-300' : 'text-rose-400'}`}>
                              {spot.dronePermitted ? 'Permitted' : 'Prohibited'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Creator Shooting Playbook Specs */}
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
                          <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
                            <Camera className="w-3.5 h-3.5" />
                            <span>Best Angle & Framing</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            {spot.bestAngle}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
                          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Golden Hour Lighting</span>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            {spot.lightingTime}
                          </p>
                        </div>

                        {/* Trending Reel Audio Cue */}
                        <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-indigo-300 text-[11px] min-w-0">
                            <Volume2 className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                            <span className="truncate">{spot.viralAudioPrompt}</span>
                          </div>
                          <button
                            onClick={() => handleCopyAudio(spot)}
                            className="p-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 shrink-0 transition-all text-[10px] font-bold flex items-center gap-1"
                            title="Copy Audio Prompt"
                          >
                            {copiedAudioId === spot.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedAudioId === spot.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-800/80 pt-4">
                    <button
                      id={`shotlist-btn-${spot.id}`}
                      onClick={() => handleToggleShotlist(spot.id)}
                      className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isAdded
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>In Shotlist</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Add to Shotlist</span>
                        </>
                      )}
                    </button>

                    {parentDest && (
                      <button
                        onClick={() => onSelectDestination(parentDest)}
                        className="py-2.5 px-3.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 hover:opacity-90 transition-all flex items-center gap-1"
                        title="View Full Destination Guide"
                      >
                        <span>Explore</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Reel Player Modal */}
      <AnimatePresence>
        {activeVideoSpot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveVideoSpot(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700 backdrop-blur-md"
              >
                ✕
              </button>

              {/* Video Embed Screen */}
              <div className="flex-1 bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                {activeVideoSpot.videoUrl ? (
                  <iframe
                    src={`${activeVideoSpot.videoUrl}?autoplay=1`}
                    title={activeVideoSpot.name}
                    className="w-full h-full min-h-[320px] md:min-h-[480px]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <Video className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                    <p>Cinematic Video Preview</p>
                  </div>
                )}
              </div>

              {/* Reel Info Sidebar */}
              <div className="w-full md:w-80 p-6 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 space-y-4 overflow-y-auto">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-extrabold uppercase border border-rose-500/30">
                    {activeVideoSpot.spotType}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1.5">{activeVideoSpot.name}</h3>
                  <p className="text-xs text-cyan-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{activeVideoSpot.destinationName}</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ticket Entry:</span>
                    <strong className="text-emerald-400">{formatPrice(activeVideoSpot.entryPrice)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Camera Fee:</span>
                    <strong className="text-slate-200">{activeVideoSpot.cameraFee === 0 ? 'Free' : formatPrice(activeVideoSpot.cameraFee)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Drone Permit:</span>
                    <strong className={activeVideoSpot.dronePermitted ? 'text-emerald-400' : 'text-rose-400'}>
                      {activeVideoSpot.dronePermitted ? 'Allowed' : 'Prohibited'}
                    </strong>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <p>
                    <strong className="text-amber-300">🌅 Optimal Time:</strong> {activeVideoSpot.lightingTime}
                  </p>
                  <p>
                    <strong className="text-cyan-300">🎬 Transition:</strong> {activeVideoSpot.recommendedTransition}
                  </p>
                  <p>
                    <strong className="text-indigo-300">🎵 Audio Match:</strong> {activeVideoSpot.viralAudioPrompt}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Creator Pro Tips</p>
                  <ul className="text-xs space-y-1 text-slate-300">
                    {activeVideoSpot.creatorTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-400">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Photo Lightbox Modal */}
      <AnimatePresence>
        {activePhotoSpot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
              <button
                onClick={() => setActivePhotoSpot(null)}
                className="absolute -top-12 right-0 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700"
              >
                ✕
              </button>
              <img
                src={activePhotoSpot.spot.photos[activePhotoSpot.photoIdx]}
                alt={activePhotoSpot.spot.name}
                className="max-h-[75vh] w-auto rounded-2xl object-contain border border-slate-700 shadow-2xl"
              />
              <div className="text-center mt-3 text-white">
                <p className="font-bold text-base">{activePhotoSpot.spot.name}</p>
                <p className="text-xs text-slate-400">
                  Photo {activePhotoSpot.photoIdx + 1} of {activePhotoSpot.spot.photos.length} • {activePhotoSpot.spot.destinationName}
                </p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
