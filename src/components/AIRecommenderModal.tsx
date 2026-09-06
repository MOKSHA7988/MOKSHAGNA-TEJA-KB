import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Sliders,
  Compass,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Calendar,
  IndianRupee,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Destination, RecommendationRequest } from '../types/travel';
import { runHybridRecommendation, ScoredDestination } from '../utils/recommendationEngine';

interface AIRecommenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onPlanTripForDestination: (dest: Destination) => void;
}

export const AIRecommenderModal: React.FC<AIRecommenderModalProps> = ({
  isOpen,
  onClose,
  destinations,
  onSelectDestination,
  onPlanTripForDestination,
}) => {
  const [budgetType, setBudgetType] = useState<'per_day' | 'total'>('per_day');
  const [budget, setBudget] = useState(500);
  const [placeQuery, setPlaceQuery] = useState('');
  const [climate, setClimate] = useState('any');
  const [statePref, setStatePref] = useState('All');
  const [selectedTripTypes, setSelectedTripTypes] = useState<string[]>(['All']);
  const [days, setDays] = useState(4);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'nature',
    'food',
    'relaxation',
  ]);

  if (!isOpen) return null;

  const toggleTripType = (type: string) => {
    if (type === 'All') {
      setSelectedTripTypes(['All']);
      return;
    }
    if (selectedTripTypes.includes('All')) {
      setSelectedTripTypes([type]);
    } else {
      if (selectedTripTypes.includes(type)) {
        const next = selectedTripTypes.filter((t) => t !== type);
        setSelectedTripTypes(next.length === 0 ? ['All'] : next);
      } else {
        setSelectedTripTypes([...selectedTripTypes, type]);
      }
    }
  };

  const interestsList = [
    { id: 'nature', label: 'Nature & Scenery' },
    { id: 'adventure', label: 'Adventure & Trekking' },
    { id: 'heritage', label: 'History & Heritage' },
    { id: 'food', label: 'Food & Cuisine' },
    { id: 'relaxation', label: 'Relaxation & Spa' },
    { id: 'wildlife', label: 'Wildlife Safari' },
    { id: 'spiritual', label: 'Spiritual & Sacred' },
  ];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleBudgetTypeChange = (type: 'per_day' | 'total') => {
    setBudgetType(type);
    if (type === 'per_day' && budget > 15000) {
      setBudget(1000);
    } else if (type === 'total' && budget < 2000) {
      setBudget(20000);
    }
  };

  const recommendationResults = runHybridRecommendation(destinations, {
    budget,
    budgetType,
    strictBudget: true,
    placeQuery,
    climate: climate === 'any' ? undefined : climate,
    state: statePref === 'All' ? undefined : statePref,
    tripTypes: selectedTripTypes.includes('All') ? undefined : selectedTripTypes,
    days,
    interests: selectedInterests,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="ai-recommender-dialog"
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Hybrid AI Recommendation Engine
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                  Cosine Similarity 0.30 • Multi-factor
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Adjust parameters below for instant weighted match scores
              </p>
            </div>
          </div>
          <button
            id="close-ai-recommender-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-5 bg-slate-800/40 p-5 rounded-2xl border border-slate-800">
            {/* Manual Place / Keyword Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Specific Place or Keyword</span>
                {placeQuery && (
                  <button
                    type="button"
                    onClick={() => setPlaceQuery('')}
                    className="text-[10px] text-cyan-400 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </label>
              <input
                id="recommender-place-input"
                type="text"
                value={placeQuery}
                onChange={(e) => setPlaceQuery(e.target.value)}
                placeholder="e.g. Coorg, Goa, Munnar, Kashmir..."
                className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500 placeholder-slate-500"
              />
            </div>

            {/* Budget Controls (Manual Input + Toggle + Presets + Slider) */}
            <div className="space-y-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/70">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-200 flex items-center gap-1.5 font-bold">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Target Budget</span>
                </span>
                
                {/* /Day vs Total Toggle */}
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => handleBudgetTypeChange('per_day')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                      budgetType === 'per_day'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Per Day (/d)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBudgetTypeChange('total')}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                      budgetType === 'total'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Total Trip
                  </button>
                </div>
              </div>

              {/* Number Input & Dynamic Calculation */}
              <div className="flex items-center justify-between gap-3 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/30">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <span>Enter Amount:</span>
                  <span className="text-emerald-400 font-extrabold text-sm">₹</span>
                </div>
                <input
                  id="recommender-budget-input"
                  type="number"
                  min={100}
                  max={500000}
                  step={budgetType === 'per_day' ? 50 : 500}
                  value={budget || ''}
                  onChange={(e) => setBudget(Math.max(0, Number(e.target.value)))}
                  placeholder={budgetType === 'per_day' ? 'e.g. 500' : 'e.g. 20000'}
                  className="w-28 bg-transparent text-right text-sm font-extrabold text-emerald-400 focus:outline-none placeholder-slate-600"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-slate-400">Presets:</span>
                {(budgetType === 'per_day'
                  ? [350, 500, 1000, 2000, 3500, 6000]
                  : [2000, 5000, 15000, 30000, 60000]
                ).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBudget(preset)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all ${
                      budget === preset
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    ₹{preset >= 1000 ? `${preset / 1000}k` : preset}
                    {budgetType === 'per_day' ? '/d' : ''}
                  </button>
                ))}
              </div>

              {/* Slider */}
              <input
                id="recommender-budget-slider"
                type="range"
                min={budgetType === 'per_day' ? 300 : 1500}
                max={budgetType === 'per_day' ? 10000 : 100000}
                step={budgetType === 'per_day' ? 50 : 1000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />

              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
                <span>
                  {budgetType === 'per_day' ? 'Min: ₹300/day' : 'Min: ₹1,500'}
                </span>
                <span className="text-emerald-300 font-semibold">
                  {budgetType === 'per_day'
                    ? `Total for ${days} days: ₹${(budget * days).toLocaleString()}`
                    : `Daily approx: ₹${Math.round(budget / Math.max(1, days)).toLocaleString()}/day`}
                </span>
                <span>
                  {budgetType === 'per_day' ? 'Max: ₹10,000/day' : 'Max: ₹100,000+'}
                </span>
              </div>
            </div>

            {/* Climate Preference */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">
                Preferred Climate
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'cool', label: 'Cool & Misty' },
                  { id: 'tropical', label: 'Tropical & Beach' },
                  { id: 'snowy', label: 'Snowy & Alpine' },
                  { id: 'any', label: 'Any Climate' },
                ].map((item) => (
                  <button
                    key={item.id}
                    id={`climate-opt-${item.id}`}
                    type="button"
                    onClick={() => setClimate(item.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      climate === item.id
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trip Types / Categories (Multi-Select) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Trip Types / Categories (Multi-Select)
                </label>
                <span className="text-[10px] text-cyan-400">
                  {selectedTripTypes.includes('All')
                    ? 'All Types'
                    : `${selectedTripTypes.length} Selected`}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'All',
                  'Hill Stations',
                  'Beaches',
                  'Backwaters',
                  'Heritage',
                  'Adventure',
                  'Wildlife',
                  'Pilgrimage',
                ].map((type) => {
                  const isSelected = selectedTripTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleTripType(type)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {type === 'All' ? 'All Types' : type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Duration (Days)</label>
              <select
                id="recommender-days-select"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full bg-slate-800 text-slate-200 text-xs font-semibold p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
              >
                {[2, 3, 4, 5, 6, 7, 10].map((d) => (
                  <option key={d} value={d}>
                    {d} Days
                  </option>
                ))}
              </select>
            </div>

            {/* State Preference */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Preferred Region/State</label>
              <select
                id="recommender-state-select"
                value={statePref}
                onChange={(e) => setStatePref(e.target.value)}
                className="w-full bg-slate-800 text-slate-200 text-xs font-semibold p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
              >
                <option value="All">All India</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Goa">Goa</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Ladakh">Ladakh</option>
              </select>
            </div>

            {/* Interests multi-select */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Personalized Interests
              </label>
              <div className="flex flex-wrap gap-1.5">
                {interestsList.map((interest) => {
                  const isSelected = selectedInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      id={`interest-chip-${interest.id}`}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                        isSelected
                          ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                          : 'bg-slate-800 border-slate-700/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      {interest.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>AI Recommended Destinations ({recommendationResults.length})</span>
                </h3>
                <p className="text-[11px] text-emerald-400 font-medium">
                  {budgetType === 'per_day'
                    ? `Showing destinations matching ≤ ₹${budget.toLocaleString()}/day budget`
                    : `Showing destinations matching ≤ ₹${budget.toLocaleString()} total trip budget`}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700">
                Sorted by AI Score
              </span>
            </div>

            {recommendationResults.length === 0 ? (
              <div className="text-center py-12 p-6 bg-slate-850/60 rounded-3xl border border-slate-800 space-y-3">
                <IndianRupee className="w-10 h-10 text-emerald-400/50 mx-auto" />
                <h4 className="text-sm font-bold text-white">
                  No places found within ₹{budget.toLocaleString()} {budgetType === 'per_day' ? '/day' : 'total'}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  India's most budget-friendly destinations (Amritsar, Pushkar, Varanasi, Rishikesh, Hampi) start from ₹350 - ₹500/day for backpackers.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBudgetType('per_day');
                      setBudget(500);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                  >
                    Set Budget to ₹500/day
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {recommendationResults.map((dest: ScoredDestination, index: number) => {
                  const isTopMatch = index === 0;
                  const isWithinDailyBudget =
                    budgetType === 'per_day'
                      ? dest.estimatedBudgetPerDay.budget <= budget
                      : (dest.estimatedBudgetPerDay.budget * days) <= budget;

                  return (
                    <div
                      key={dest.id}
                      id={`rec-item-${dest.id}`}
                      className={`p-4 rounded-2xl border transition-all duration-200 ${
                        isTopMatch
                          ? 'bg-gradient-to-r from-slate-800/90 to-slate-850/90 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-850/70 border-slate-750 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex gap-4 items-start">
                        <img
                          src={dest.heroImage}
                          alt={dest.name}
                          className="w-20 h-20 rounded-xl object-cover border border-slate-700 shrink-0"
                        />

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-white text-base truncate">
                              {dest.name}
                            </h4>
                            {/* Score Badge */}
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-extrabold text-xs shadow-md shadow-cyan-500/20">
                              <Sparkles className="w-3 h-3" />
                              <span>{dest.aiScore}% Match</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-300 line-clamp-1">
                            {dest.tagline}
                          </p>

                          {/* Budget info pills */}
                          <div className="flex flex-wrap items-center gap-2 text-[11px]">
                            <span className="flex items-center gap-1 text-slate-300">
                              <MapPin className="w-3 h-3 text-cyan-400" />
                              {dest.state}
                            </span>
                            <span>•</span>
                            <span className="text-amber-400 font-semibold">
                              ★ {dest.rating}
                            </span>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                              Budget: ₹{dest.estimatedBudgetPerDay.budget.toLocaleString()}/day
                            </span>
                            <span className="text-slate-400">
                              (Std: ₹{dest.estimatedBudgetPerDay.standard.toLocaleString()}/d)
                            </span>
                          </div>

                          {/* Match Reason tags */}
                          {dest.matchReasons && dest.matchReasons.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {dest.matchReasons.slice(0, 2).map((reason, rIdx) => (
                                <span
                                  key={rIdx}
                                  className="text-[10px] bg-slate-800 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-500/20"
                                >
                                  ✓ {reason}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-800/80">
                        <button
                          id={`explore-dest-${dest.id}`}
                          onClick={() => {
                            onSelectDestination(dest);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all"
                        >
                          View Overview & Places
                        </button>
                        <button
                          id={`plan-trip-dest-${dest.id}`}
                          onClick={() => {
                            onPlanTripForDestination(dest);
                            onClose();
                          }}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:opacity-90 transition-all flex items-center gap-1 shadow-sm"
                        >
                          <span>Plan {days}-Day Trip</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
