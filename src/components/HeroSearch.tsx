import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Sparkles,
  MapPin,
  Palmtree,
  Mountain,
  Landmark,
  Compass,
  Flame,
  Zap,
  Waves,
  Crown,
  Trees,
  IndianRupee,
  DollarSign,
  Euro,
  X,
  SlidersHorizontal,
  RotateCcw,
  Check,
  ChevronDown,
  CheckSquare,
  Square,
  Layers,
  Calendar,
  CloudSun,
  Train,
  Plane,
  Bus,
  Car,
  Filter,
} from 'lucide-react';
import { DestinationCategory } from '../types/travel';

interface HeroSearchProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (c: string[]) => void;
  selectedDuration?: string;
  setSelectedDuration?: (d: string) => void;
  selectedClimate?: string;
  setSelectedClimate?: (c: string) => void;
  selectedTravelMode?: string;
  setSelectedTravelMode?: (m: string) => void;
  budgetFilter?: number;
  setBudgetFilter: (b: number | undefined) => void;
  budgetType: 'per_day' | 'total';
  setBudgetType: (t: 'per_day' | 'total') => void;
  currency?: 'INR' | 'USD' | 'EUR';
  onSearchSubmit: (query: string) => void;
  onOpenRecommender: () => void;
  onOpenAssistant: () => void;
  onResetFilters: () => void;
}

export const CATEGORIES_LIST: { id: DestinationCategory; label: string; icon: any; countNote?: string }[] = [
  { id: 'Hill Stations', label: 'Hill Stations', icon: Mountain, countNote: 'Munnar, Manali, Ooty, Coorg' },
  { id: 'Beaches', label: 'Beaches & Coastal', icon: Palmtree, countNote: 'Goa, Gokarna, Varkala, Pondicherry' },
  { id: 'Backwaters', label: 'Backwaters & Lakes', icon: Waves, countNote: 'Alleppey, Kumarakom' },
  { id: 'Heritage', label: 'Heritage & Forts', icon: Landmark, countNote: 'Hampi, Jaipur, Udaipur' },
  { id: 'Adventure', label: 'Adventure & Treks', icon: Zap, countNote: 'Ladakh, Rishikesh, Spiti' },
  { id: 'Wildlife', label: 'Wildlife & Safari', icon: Trees, countNote: 'Kabini, Jim Corbett, Ranthambore' },
  { id: 'Pilgrimage', label: 'Pilgrimage & Sacred', icon: Landmark, countNote: 'Varanasi, Tirupati, Madurai' },
  { id: 'Luxury', label: 'Luxury Escapes', icon: Crown, countNote: '5-Star Villas & Royal Palaces' },
];

export const DURATION_OPTIONS = [
  { id: 'all', label: 'All Durations', icon: Calendar },
  { id: 'weekend', label: '1-2 Days (Weekend)', countNote: 'Quick Escapes' },
  { id: 'short', label: '3-4 Days (Short Trip)', countNote: 'Most Popular' },
  { id: 'week', label: '5-7 Days (Vacation)', countNote: 'Full Itinerary' },
  { id: 'extended', label: '8+ Days (Extended)', countNote: 'Grand Tour' },
];

export const CLIMATE_OPTIONS = [
  { id: 'all', label: 'All Climates' },
  { id: 'cool', label: '🌲 Cool / Mountain' },
  { id: 'tropical', label: '🌴 Tropical / Beach' },
  { id: 'moderate', label: '☀️ Pleasant / Mild' },
  { id: 'snowy', label: '❄️ Snowy / Peaks' },
  { id: 'dry', label: '🏜️ Warm / Heritage' },
];

export const TRAVEL_MODE_OPTIONS = [
  { id: 'all', label: 'All Modes', icon: Compass },
  { id: 'train', label: '🚄 Vande Bharat & Trains', icon: Train },
  { id: 'flight', label: '✈️ Flights Available', icon: Plane },
  { id: 'bus', label: '🚌 AC Sleeper / Volvo', icon: Bus },
  { id: 'roadtrip', label: '🚗 Scenic Road Trip', icon: Car },
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategories = ['All'],
  setSelectedCategories,
  selectedDuration = 'all',
  setSelectedDuration,
  selectedClimate = 'all',
  setSelectedClimate,
  selectedTravelMode = 'all',
  setSelectedTravelMode,
  budgetFilter,
  setBudgetFilter,
  budgetType,
  setBudgetType,
  currency = 'INR',
  onSearchSubmit,
  onOpenRecommender,
  onOpenAssistant,
  onResetFilters,
}) => {
  const [budgetInputValue, setBudgetInputValue] = useState<string>(
    budgetFilter ? String(budgetFilter) : ''
  );
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState<boolean>(false);
  const [isSearchSuggestionsOpen, setIsSearchSuggestionsOpen] = useState<boolean>(false);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const POPULAR_SUGGESTIONS = [
    { name: 'Nagwara (Bengaluru)', note: 'Nagawara Lake, Lumbini Gardens, Manyata Park' },
    { name: 'Bengaluru', note: 'Cubbon Park, Lalbagh, Brewery Trail' },
    { name: 'Chikmagalur', note: 'Mullayanagiri, Hebbe Falls, Coffee Estates' },
    { name: 'Coorg (Kodagu)', note: 'Abbey Falls, Coffee Plantations, Dubare Camp' },
    { name: 'Goa', note: 'Palolem Beach, Fort Aguada, Dudhsagar' },
    { name: 'Munnar', note: 'Tea Estates, Eravikulam, Mattupetty' },
    { name: 'Hampi', note: 'Virupaksha Temple, Stone Chariot, Matanga' },
    { name: 'Manali', note: 'Solang Valley, Rohtang Pass, Old Manali' },
    { name: 'Ooty', note: 'Botanical Garden, Nilgiri Toy Train, Doddabetta' },
    { name: 'Pondicherry', note: 'French Quarter, Promenade Beach, Auroville' },
    { name: 'Varanasi', note: 'Ganga Aarti, Dashashwamedh Ghat, Kashi Vishwanath' },
    { name: 'Paris', note: 'Eiffel Tower, Louvre, Seine River Cruise' },
    { name: 'Bali', note: 'Ubud Rice Terraces, Uluwatu, Seminyak' },
  ];

  const filteredSuggestions = POPULAR_SUGGESTIONS.filter((s) =>
    !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.note.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAllSelected = selectedCategories.includes('All') || selectedCategories.length === 0;

  // Sync budget input if budgetFilter changes outside
  useEffect(() => {
    setBudgetInputValue(budgetFilter ? String(budgetFilter) : '');
  }, [budgetFilter]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryPickerOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchSuggestionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const CurrencyIcon =
    currency === 'USD' ? DollarSign : currency === 'EUR' ? Euro : IndianRupee;
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₹';

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBudgetInputValue(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setBudgetFilter(num);
    } else if (val === '') {
      setBudgetFilter(undefined);
    }
  };

  const handleApplyPresetBudget = (amount: number) => {
    setBudgetInputValue(String(amount));
    setBudgetFilter(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
    }
  };

  // Toggle a category in multi-select mode
  const handleToggleCategory = (catId: string) => {
    if (catId === 'All') {
      setSelectedCategories(['All']);
      return;
    }

    if (isAllSelected) {
      setSelectedCategories([catId]);
    } else {
      if (selectedCategories.includes(catId)) {
        const next = selectedCategories.filter((c) => c !== catId);
        setSelectedCategories(next.length === 0 ? ['All'] : next);
      } else {
        setSelectedCategories([...selectedCategories, catId]);
      }
    }
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    !isAllSelected ||
    Boolean(budgetFilter && budgetFilter > 0) ||
    selectedDuration !== 'all' ||
    selectedClimate !== 'all' ||
    selectedTravelMode !== 'all';

  const getCategoryButtonText = () => {
    if (isAllSelected) return 'All Categories';
    if (selectedCategories.length === 1) return selectedCategories[0];
    if (selectedCategories.length === 2) return `${selectedCategories[0]}, ${selectedCategories[1]}`;
    return `${selectedCategories[0]} (+${selectedCategories.length - 1} more)`;
  };

  return (
    <div className="relative overflow-hidden pt-6 pb-8 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-72 bg-gradient-to-tr from-cyan-600/15 via-teal-500/10 to-indigo-600/15 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        {/* Main Title & Search Header */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AI Multi-Filter Travel Engine • Budget-Compliant</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Discover Your Ideal Indian Getaway
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Search by destination, days, climate, category, travel mode, and exact daily budget.
          </p>
        </div>

        {/* Primary Comprehensive Entry Search & Filter Box */}
        <div className="bg-slate-900/90 border border-slate-750 p-4 sm:p-5 rounded-3xl shadow-2xl backdrop-blur-xl space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Top Row: Search Input + Category Trigger + Search CTA */}
            <div className="flex flex-col md:flex-row items-stretch gap-2.5">
              {/* Search Place Input with Autocomplete Suggestions */}
              <div className="relative flex-1" ref={searchContainerRef}>
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                <input
                  id="hero-destination-search-input"
                  type="text"
                  placeholder="Where do you want to explore? (e.g. Nagwara, Coorg, Munnar, Goa, Paris...)"
                  value={searchQuery}
                  onFocus={() => setIsSearchSuggestionsOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchSuggestionsOpen(true);
                  }}
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-850 border border-slate-700 text-white placeholder-slate-400 text-sm font-medium focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchSuggestionsOpen(false);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Instant Autocomplete Suggestions Popover */}
                {isSearchSuggestionsOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 p-2.5 bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl z-50 space-y-1 max-h-80 overflow-y-auto custom-scrollbar backdrop-blur-xl">
                    <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 border-b border-slate-800">
                      <span>{searchQuery ? `Matching Places for "${searchQuery}"` : 'Popular Destinations & Cities'}</span>
                      <span className="text-cyan-400 text-[10px]">Instant AI & Result</span>
                    </div>

                    {/* Active typed search query trigger */}
                    {searchQuery.trim().length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          onSearchSubmit(searchQuery.trim());
                          setIsSearchSuggestionsOpen(false);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-left bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-semibold text-xs flex items-center justify-between transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                          <span>Show result & itinerary for <strong>"{searchQuery.trim()}"</strong></span>
                        </div>
                        <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/30">
                          Auto-Generate
                        </span>
                      </button>
                    )}

                    {filteredSuggestions.slice(0, 7).map((s) => (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => {
                          setSearchQuery(s.name);
                          onSearchSubmit(s.name);
                          setIsSearchSuggestionsOpen(false);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-left hover:bg-slate-800 text-slate-200 text-xs flex items-center justify-between transition-all group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 group-hover:scale-110 transition-transform" />
                          <div className="truncate">
                            <p className="font-bold text-white group-hover:text-cyan-300 transition-colors">{s.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{s.note}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 group-hover:text-cyan-400 flex items-center gap-0.5 shrink-0">
                          <span>View</span>
                          <ChevronDown className="w-3 h-3 -rotate-90" />
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Multi-Category Selector Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  id="hero-category-picker-btn"
                  type="button"
                  onClick={() => setIsCategoryPickerOpen(!isCategoryPickerOpen)}
                  className={`w-full md:w-56 px-4 py-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between gap-2 ${
                    !isAllSelected
                      ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-300 ring-1 ring-cyan-500/30'
                      : 'bg-slate-850 border-slate-700 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="truncate">{getCategoryButtonText()}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
                      isCategoryPickerOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>

                {/* Multi-Select Category Dropdown Menu */}
                {isCategoryPickerOpen && (
                  <div className="absolute top-full left-0 right-0 md:right-auto md:w-80 mt-2 p-3 bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl z-50 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-white">Select Categories</span>
                      <button
                        type="button"
                        onClick={() => setSelectedCategories(['All'])}
                        className="text-[10px] text-cyan-400 hover:underline font-semibold"
                      >
                        Reset to All
                      </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                      {/* All Option */}
                      <button
                        type="button"
                        onClick={() => handleToggleCategory('All')}
                        className={`w-full p-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all ${
                          isAllSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Compass className="w-3.5 h-3.5 text-cyan-400" />
                          <span>All Travel Categories</span>
                        </div>
                        {isAllSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>

                      {CATEGORIES_LIST.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = selectedCategories.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleToggleCategory(cat.id)}
                            className={`w-full p-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Icon className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                              <div className="truncate">
                                <p className="truncate">{cat.label}</p>
                                {cat.countNote && (
                                  <p className="text-[10px] text-slate-400 truncate">{cat.countNote}</p>
                                )}
                              </div>
                            </div>
                            {isSelected ? (
                              <CheckSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Search CTA */}
              <button
                id="hero-submit-search-btn"
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-90 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>

            {/* Row 2: Comprehensive Entry Filters (Days, Climate, Travel Mode, Budget Input & Presets) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-850/70 border border-slate-750 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* 1. DAYS / DURATION OPTION */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Duration / Days:</span>
                  </label>
                  <select
                    id="hero-duration-select"
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration && setSelectedDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium text-xs focus:ring-2 focus:ring-cyan-500 outline-none"
                  >
                    <option value="all">Any Duration (All)</option>
                    <option value="weekend">1-2 Days (Weekend Escape)</option>
                    <option value="short">3-4 Days (Short Getaway)</option>
                    <option value="week">5-7 Days (Full Vacation)</option>
                    <option value="extended">8+ Days (Extended Tour)</option>
                  </select>
                </div>

                {/* 2. CLIMATE OPTION */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold flex items-center gap-1.5">
                    <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Climate & Weather:</span>
                  </label>
                  <select
                    id="hero-climate-select"
                    value={selectedClimate}
                    onChange={(e) => setSelectedClimate && setSelectedClimate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium text-xs focus:ring-2 focus:ring-cyan-500 outline-none"
                  >
                    <option value="all">All Climates</option>
                    <option value="cool">🌲 Cool / Mountain Station</option>
                    <option value="tropical">🌴 Tropical / Coastal Beach</option>
                    <option value="moderate">☀️ Pleasant / Moderate</option>
                    <option value="snowy">❄️ Snowy / High Altitude</option>
                    <option value="dry">🏜️ Warm / Heritage Desert</option>
                  </select>
                </div>

                {/* 3. TRAVEL MODE OPTION */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold flex items-center gap-1.5">
                    <Train className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Travel Mode:</span>
                  </label>
                  <select
                    id="hero-travel-mode-select"
                    value={selectedTravelMode}
                    onChange={(e) => setSelectedTravelMode && setSelectedTravelMode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium text-xs focus:ring-2 focus:ring-cyan-500 outline-none"
                  >
                    <option value="all">All Travel Modes</option>
                    <option value="train">🚄 Vande Bharat & Trains</option>
                    <option value="flight">✈️ Flights Available</option>
                    <option value="bus">🚌 AC Volvo / Sleeper Bus</option>
                    <option value="roadtrip">🚗 Scenic Road Trip / Cab</option>
                  </select>
                </div>

                {/* 4. EXACT USER BUDGET INPUT & PER-DAY SWITCH */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-400 font-bold flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                      <span>User Budget:</span>
                    </label>
                    {/* Per Day vs Total Trip toggle */}
                    <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-750 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setBudgetType('per_day')}
                        className={`px-1.5 py-0.5 rounded-md font-bold transition-all ${
                          budgetType === 'per_day'
                            ? 'bg-emerald-500 text-slate-950 shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        /day
                      </button>
                      <button
                        type="button"
                        onClick={() => setBudgetType('total')}
                        className={`px-1.5 py-0.5 rounded-md font-bold transition-all ${
                          budgetType === 'total'
                            ? 'bg-emerald-500 text-slate-950 shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        total
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                      {currencySymbol}
                    </span>
                    <input
                      id="hero-budget-input"
                      type="number"
                      placeholder="e.g. 700"
                      min="100"
                      step="50"
                      value={budgetInputValue}
                      onChange={handleBudgetChange}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Budget Preset Chips (Including ₹700 Backpacker) */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-750/80 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-semibold">Quick Presets:</span>
                  {[
                    { label: '⚡ ₹700 Backpacker', val: 700 },
                    { label: '₹1,500 Budget+', val: 1500 },
                    { label: '₹3,500 Standard', val: 3500 },
                    { label: '₹10,000+ Luxury', val: 10000 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => handleApplyPresetBudget(preset.val)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                        budgetFilter === preset.val
                          ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Reset Filters CTA */}
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setBudgetInputValue('');
                      onResetFilters();
                    }}
                    className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 font-bold transition-all ml-auto"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All Filters</span>
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Popular Places Quick Explore Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[11px] text-slate-400 font-bold whitespace-nowrap flex items-center gap-1 shrink-0">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>Popular:</span>
            </span>
            {[
              'Nagwara (Bengaluru)',
              'Bengaluru',
              'Chikmagalur',
              'Coorg',
              'Goa',
              'Munnar',
              'Hampi',
              'Manali',
              'Ooty',
              'Paris',
              'Bali',
            ].map((placeName) => (
              <button
                key={placeName}
                type="button"
                onClick={() => {
                  setSearchQuery(placeName);
                  onSearchSubmit(placeName);
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all shrink-0 ${
                  searchQuery.toLowerCase().includes(placeName.toLowerCase())
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/30'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-750'
                }`}
              >
                {placeName}
              </button>
            ))}
          </div>

          {/* Quick Category Chips for One-Click Toggle */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
            <button
              type="button"
              onClick={() => setSelectedCategories(['All'])}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isAllSelected
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>All ({CATEGORIES_LIST.length})</span>
            </button>

            {CATEGORIES_LIST.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleToggleCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-teal-400" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
