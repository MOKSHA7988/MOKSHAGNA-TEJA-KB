import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Compass,
  Sparkles,
  RefreshCw,
  Sliders,
  DollarSign,
  Euro,
  IndianRupee,
  Layers,
  Heart,
  User,
  Smartphone,
  ShieldCheck,
  Calendar,
  CloudSun,
  Train,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Types
import {
  Destination,
  Hotel,
  Attraction,
  UserProfile,
  TripPlan,
  TripTier,
  BookingRecord,
} from './types/travel';

// Data
import { INITIAL_DESTINATIONS, HOTELS_DATABASE, ATTRACTIONS_DATABASE } from './data/travelDatabase';
import { resolveDestination } from './utils/destinationResolver';

// Components
import { Navbar } from './components/Navbar';
import { LiveTravelIntelligenceBar } from './components/LiveTravelIntelligenceBar';
import { HeroSearch } from './components/HeroSearch';
import { DestinationCard } from './components/DestinationCard';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { AIRecommenderModal } from './components/AIRecommenderModal';
import { TravelAssistantDrawer } from './components/TravelAssistantDrawer';
import { TripPlannerView } from './components/TripPlannerView';
import { HotelsView } from './components/HotelsView';
import { RoutePlannerView } from './components/RoutePlannerView';
import { BudgetCalculatorView } from './components/BudgetCalculatorView';
import { SavedTripsView } from './components/SavedTripsView';
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { BookingDashboardView } from './components/BookingDashboardView';
import { AndroidMobileFrame } from './components/AndroidMobileFrame';
import { AuthModal } from './components/AuthModal';
import { PackagesView } from './components/PackagesView';
import { FlightsTransitsView } from './components/FlightsTransitsView';
import { ExperiencesView } from './components/ExperiencesView';
import { PackingChecklistView } from './components/PackingChecklistView';
import { TravelSOSView } from './components/TravelSOSView';
import { PDFGeneratorModal } from './components/PDFGeneratorModal';
import { ReelCreatorStudioView } from './components/ReelCreatorStudioView';
import { NatureAmbientController } from './components/NatureAmbientController';
import { TripBookingModal } from './components/TripBookingModal';
import { ExportToMobileModal } from './components/ExportToMobileModal';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  // Primary State
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [hotels, setHotels] = useState<Hotel[]>(HOTELS_DATABASE);
  const [attractions, setAttractions] = useState<Attraction[]>(ATTRACTIONS_DATABASE);

  // User & Sessions
  const [user, setUser] = useState<UserProfile | null>({
    id: 'usr-1',
    username: 'moksgnateja@gmail.com',
    fullName: 'Mokshagna Teja',
    email: 'moksgnateja@gmail.com',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    authProvider: 'google',
    loyaltyPoints: 1250,
    walletBalance: 3500,
    preferredClimate: ['cool', 'tropical'],
    preferredTripTypes: ['Hill Stations', 'Beaches'],
    budgetRange: [15000, 60000],
    savedDestinationIds: ['coorg', 'munnar', 'kerala-backwaters'],
    totalTripsCompleted: 4,
  });

  const [savedDestinationIds, setSavedDestinationIds] = useState<string[]>([
    'coorg',
    'munnar',
    'kerala-backwaters',
  ]);
  const [userTrips, setUserTrips] = useState<TripPlan[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([
    {
      id: 'bk-101',
      bookingRef: 'MGT-84920',
      username: 'moksgnateja@gmail.com',
      type: 'hotel',
      title: 'Evolve Back Plantation Villa',
      destination: 'Coorg (Kodagu)',
      dates: 'Oct 14 - Oct 18, 2026',
      guests: 2,
      amountPaid: 56000,
      status: 'Confirmed',
      createdAt: '2026-08-20T10:15:00.000Z',
      details: 'Heritage Pool Villa with breakfast included and complimentary spice estate walk.',
    },
    {
      id: 'bk-102',
      bookingRef: 'MGT-94512',
      username: 'moksgnateja@gmail.com',
      type: 'package',
      title: 'Vembanad Lake Houseboat Overnight',
      destination: 'Alleppey (Backwaters)',
      dates: 'Nov 02 - Nov 04, 2026',
      guests: 2,
      amountPaid: 17000,
      status: 'Voucher Issued',
      createdAt: '2026-08-22T14:30:00.000Z',
      details: 'Deluxe A/C 1-Bedroom Kettuvallam with all meals prepared onboard.',
    },
  ]);

  // Navigation & Filter states (Days, Climate, Category, Travel Mode, User Budget)
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedClimate, setSelectedClimate] = useState<string>('all');
  const [selectedTravelMode, setSelectedTravelMode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [budgetFilter, setBudgetFilter] = useState<number | undefined>(undefined);
  const [budgetType, setBudgetType] = useState<'per_day' | 'total'>('per_day');
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isAndroidPreview, setIsAndroidPreview] = useState<boolean>(false);
  const [showLiveTicker, setShowLiveTicker] = useState<boolean>(true);

  // Modals & Drawers
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedPlannerTier, setSelectedPlannerTier] = useState<TripTier>('standard');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isRecommenderOpen, setIsRecommenderOpen] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isGeneratingDest, setIsGeneratingDest] = useState<boolean>(false);
  const [isExportMobileModalOpen, setIsExportMobileModalOpen] = useState<boolean>(false);

  // PDF modal state configuration
  const [pdfModalConfig, setPdfModalConfig] = useState<{
    destination: Destination;
    tier?: TripTier;
    dailyBudget?: number;
    days?: number;
  } | null>(null);

  // MakeMyTrip / TripAdvisor Style Booking Modal state
  const [bookingModalConfig, setBookingModalConfig] = useState<{
    destination: Destination;
    travelMode?: 'flight' | 'train' | 'car' | 'bus';
    origin?: string;
    initialStep?: number;
    tier?: 'budget' | 'standard' | 'luxury';
    budgetLimit?: number;
  } | null>(null);

  const handleOpenBooking = (
    dest: Destination,
    travelMode: 'flight' | 'train' | 'car' | 'bus' = 'flight',
    origin: string = 'Bengaluru',
    initialStep: number = 5, // Opens directly to Review Trip & Payment Options!
    tier?: 'budget' | 'standard' | 'luxury',
    budgetLimit?: number
  ) => {
    setIsDetailModalOpen(false); // Close destination detail modal to bring checkout modal to front
    setBookingModalConfig({ destination: dest, travelMode, origin, initialStep, tier, budgetLimit });
  };

  // Fetch live destinations from backend if available
  useEffect(() => {
    fetch('/api/destinations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.destinations?.length) {
          setDestinations(data.destinations);
        }
      })
      .catch((e) => console.log('Using initial destination store'));
  }, []);

  const handleToggleSave = async (id: string) => {
    let nextSaved: string[];
    if (savedDestinationIds.includes(id)) {
      nextSaved = savedDestinationIds.filter((dId) => dId !== id);
    } else {
      nextSaved = [...savedDestinationIds, id];
    }
    setSavedDestinationIds(nextSaved);

    if (user) {
      try {
        await fetch('/api/saved-trips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: user.email,
            destinationId: id,
          }),
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSelectDestination = (dest: Destination) => {
    setSelectedDestination(dest);
    setIsDetailModalOpen(true);
  };

  const handlePlanTripForDestination = (dest: Destination, tier?: TripTier) => {
    setSelectedDestination(dest);
    if (tier) {
      setSelectedPlannerTier(tier);
    }
    setActiveTab('planner');
  };

  // Handler for opening the PDF generator with exact budget & preferences
  const handleOpenPDFGenerator = (
    dest: Destination,
    tier?: TripTier,
    dailyBudget?: number,
    days?: number
  ) => {
    // If user filtered by budget in search, default the daily budget to that
    const effectiveBudget = dailyBudget || budgetFilter || dest.estimatedBudgetPerDay.budget;
    setPdfModalConfig({
      destination: dest,
      tier: tier || (budgetFilter && budgetFilter <= 1200 ? 'budget' : 'standard'),
      dailyBudget: effectiveBudget,
      days: days || dest.idealDays || 4,
    });
  };

  // Auto-resolve unknown place queries so results are displayed instantly without dead-ends
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length >= 2) {
      const lower = q.toLowerCase();
      const exists = destinations.some(
        (d) =>
          d.name.toLowerCase().includes(lower) ||
          d.id.toLowerCase().includes(lower) ||
          d.state.toLowerCase().includes(lower) ||
          d.places?.some((p) => p.name.toLowerCase().includes(lower))
      );
      if (!exists) {
        const generated = resolveDestination(q, budgetFilter);
        setDestinations((prev) => [generated, ...prev]);
        // Also call backend to asynchronously save/enrich
        fetch('/api/generate-destination', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destinationName: q }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.destination) {
              setDestinations((prev) => {
                const filtered = prev.filter((d) => d.id !== generated.id && d.id !== data.destination.id);
                return [data.destination, ...filtered];
              });
            }
          })
          .catch(() => {});
      }
    }
  }, [searchQuery, budgetFilter]);

  // AI Dynamic Custom Destination Handler
  const handleSearchSubmit = async (query: string) => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return;

    const existing = destinations.find(
      (d) =>
        d.name.toLowerCase().includes(trimmed) ||
        d.id.toLowerCase().includes(trimmed) ||
        d.state.toLowerCase().includes(trimmed) ||
        d.places?.some((p) => p.name.toLowerCase().includes(trimmed))
    );

    if (existing) {
      handleSelectDestination(existing);
      return;
    }

    // Instant local synthesis fallback
    const instantDest = resolveDestination(query.trim(), budgetFilter);
    setDestinations((prev) => [instantDest, ...prev]);
    handleSelectDestination(instantDest);

    // Dynamic AI Generation for custom query
    setIsGeneratingDest(true);
    try {
      const res = await fetch('/api/generate-destination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationName: query.trim() }),
      });

      const data = await res.json();
      if (data.success && data.destination) {
        setDestinations((prev) => {
          const withoutInstant = prev.filter((d) => d.id !== instantDest.id && d.id !== data.destination.id);
          return [data.destination, ...withoutInstant];
        });
        handleSelectDestination(data.destination);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingDest(false);
    }
  };

  const handleBookingSuccess = (booking: BookingRecord, pointsEarned: number) => {
    setBookings((prev) => [booking, ...prev]);
    if (user) {
      setUser({
        ...user,
        loyaltyPoints: (user.loyaltyPoints || 0) + pointsEarned,
        totalTripsCompleted: (user.totalTripsCompleted || 0) + 1,
      });
    }
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Filtered destination list for explore view (Days, Climate, Category, Travel Mode, Budget)
  const filteredDestinations = destinations.filter((dest) => {
    // 1. Search Text matching
    const q = searchQuery.trim().toLowerCase();
    const isExplicitNameMatch =
      q !== '' &&
      (dest.name.toLowerCase().includes(q) ||
        dest.state.toLowerCase().includes(q) ||
        dest.country.toLowerCase().includes(q) ||
        dest.id.toLowerCase().includes(q) ||
        dest.tagline.toLowerCase().includes(q) ||
        dest.description.toLowerCase().includes(q) ||
        dest.places?.some((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)));

    // When the user explicitly enters a place query (e.g., "Nagwara"), ALWAYS display the place!
    if (isExplicitNameMatch) {
      return true;
    }

    // If there is an active search query and this destination doesn't match, exclude it
    if (q !== '' && !isExplicitNameMatch) {
      return false;
    }

    // 2. Category Filter
    const isAllCat = selectedCategories.includes('All') || selectedCategories.length === 0;
    const matchesCategory =
      isAllCat ||
      selectedCategories.some(
        (cat) =>
          dest.type.toLowerCase() === cat.toLowerCase() ||
          dest.type.toLowerCase().includes(cat.toLowerCase()) ||
          cat.toLowerCase().includes(dest.type.toLowerCase())
      );

    // 3. Days / Duration Filter
    let matchesDuration = true;
    if (selectedDuration === 'weekend') {
      matchesDuration = dest.idealDays <= 2;
    } else if (selectedDuration === 'short') {
      matchesDuration = dest.idealDays >= 3 && dest.idealDays <= 4;
    } else if (selectedDuration === 'week') {
      matchesDuration = dest.idealDays >= 5 && dest.idealDays <= 7;
    } else if (selectedDuration === 'extended') {
      matchesDuration = dest.idealDays >= 8;
    }

    // 4. Climate Filter
    let matchesClimate = true;
    if (selectedClimate !== 'all') {
      matchesClimate = dest.climate.toLowerCase().includes(selectedClimate.toLowerCase());
    }

    // 5. Travel Mode Filter
    let matchesTravelMode = true;
    if (selectedTravelMode !== 'all') {
      if (selectedTravelMode === 'flight') {
        matchesTravelMode = !dest.id.includes('hampi'); // Hampi has nearest airport further away
      } else if (selectedTravelMode === 'train') {
        matchesTravelMode = true; // All destinations have major railway junction access
      }
    }

    // 6. Budget Compliance
    let matchesBudget = true;
    if (budgetFilter !== undefined && budgetFilter > 0) {
      const multiplier = currency === 'USD' ? 85 : currency === 'EUR' ? 92 : 1;
      const targetBudgetINR = budgetFilter * multiplier;
      const tripDays = dest.idealDays || 3;
      const dailyBaseCost = dest.estimatedBudgetPerDay.budget;
      const calculatedTotalTripCost = dailyBaseCost * tripDays;

      if (budgetType === 'per_day') {
        matchesBudget = dailyBaseCost <= targetBudgetINR || targetBudgetINR >= 350;
      } else {
        matchesBudget = calculatedTotalTripCost <= targetBudgetINR || targetBudgetINR >= 1000;
      }
    }

    return (
      matchesCategory &&
      matchesDuration &&
      matchesClimate &&
      matchesTravelMode &&
      matchesBudget
    );
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategories(['All']);
    setSelectedDuration('all');
    setSelectedClimate('all');
    setSelectedTravelMode('all');
    setBudgetFilter(undefined);
  };

  const savedDestinationsList = destinations.filter((d) => savedDestinationIds.includes(d.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        savedCount={savedDestinationIds.length}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenRecommender={() => setIsRecommenderOpen(true)}
        onOpenExportToMobile={() => setIsExportMobileModalOpen(true)}
        isAndroidPreview={isAndroidPreview}
        setIsAndroidPreview={setIsAndroidPreview}
        currency={currency}
        setCurrency={setCurrency}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        showLiveTicker={showLiveTicker}
        setShowLiveTicker={setShowLiveTicker}
      />

      {/* Live Intelligence Feed: Live Weather, Hotel Prices & Transit Fares with API Hook */}
      {showLiveTicker && (
        <LiveTravelIntelligenceBar
          destinations={destinations}
          onSelectDestination={handleSelectDestination}
          currency={currency}
        />
      )}

      {/* Generating AI Destination Notice */}
      {isGeneratingDest && (
        <div className="bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs font-bold py-2.5 px-4 text-center flex items-center justify-center gap-2 shadow-lg">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Generating AI Destination profile & verified itineraries for "{searchQuery}"...</span>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {isAndroidPreview ? (
          /* Native Android App Preview Chassis */
          <AndroidMobileFrame
            destinations={destinations}
            user={user}
            activeDestination={selectedDestination}
            onSelectDestination={handleSelectDestination}
            onPlanTrip={handlePlanTripForDestination}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            onOpenRecommender={() => setIsRecommenderOpen(true)}
            onOpenExportToMobile={() => setIsExportMobileModalOpen(true)}
          />
        ) : (
          /* Full Desktop / Responsive Web Views */
          <>
            {activeTab === 'explore' && (
              <div className="space-y-8 pb-16">
                <HeroSearch
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  selectedDuration={selectedDuration}
                  setSelectedDuration={setSelectedDuration}
                  selectedClimate={selectedClimate}
                  setSelectedClimate={setSelectedClimate}
                  selectedTravelMode={selectedTravelMode}
                  setSelectedTravelMode={setSelectedTravelMode}
                  budgetFilter={budgetFilter}
                  setBudgetFilter={setBudgetFilter}
                  budgetType={budgetType}
                  setBudgetType={setBudgetType}
                  currency={currency}
                  onSearchSubmit={handleSearchSubmit}
                  onOpenRecommender={() => setIsRecommenderOpen(true)}
                  onOpenAssistant={() => setIsAssistantOpen(true)}
                  onResetFilters={handleResetFilters}
                />

                {/* Destinations Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  {/* Featured Holiday Packages Banner Card */}
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 uppercase tracking-wider">
                          New Feature
                        </span>
                        <span className="text-xs text-cyan-300 font-bold">
                          All-Inclusive Holiday Packages with 1-Click Booking
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        Handcrafted Vacations: Flights, 4★/5★ Resorts, Private Cabs & Guided Tours
                      </h3>
                      <p className="text-xs text-slate-400">
                        Book complete packages for Coorg, Kerala Backwaters, Goa, Manali & Rajasthan with customizable add-ons & instant digital vouchers.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('packages')}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 hover:opacity-90 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <span>Explore Packages</span>
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                        <span>Curated Destinations</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                          {filteredDestinations.length} Places
                        </span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Filtered by place "{searchQuery || 'All'}", categories [{selectedCategories.join(', ')}], and budget {budgetFilter ? `≤ ${currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'}${budgetFilter.toLocaleString()} (${budgetType === 'per_day' ? 'per day' : 'total trip'})` : 'any'}.
                      </p>
                    </div>

                    {/* AI Magic Match pill */}
                    <button
                      onClick={() => setIsRecommenderOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-500/30 transition-all self-start sm:self-auto cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span>Run AI Recommendation Algorithm</span>
                    </button>
                  </div>

                  {filteredDestinations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {filteredDestinations.map((dest) => (
                        <DestinationCard
                          key={dest.id}
                          destination={dest}
                          currency={currency}
                          isSaved={savedDestinationIds.includes(dest.id)}
                          userBudget={budgetFilter}
                          budgetType={budgetType}
                          onToggleSave={handleToggleSave}
                          onSelect={handleSelectDestination}
                          onPlanTrip={handlePlanTripForDestination}
                          onDownloadPDF={(d) => handleOpenPDFGenerator(d)}
                          onBookTrip={handleOpenBooking}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800 space-y-4 max-w-lg mx-auto p-6">
                      <Compass className="w-12 h-12 text-slate-500 mx-auto" />
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white">
                          No matching destinations for your criteria
                        </h3>
                        <p className="text-xs text-slate-400">
                          {searchQuery ? `Place: "${searchQuery}" • ` : ''}
                          {!selectedCategories.includes('All') ? `Categories: "${selectedCategories.join(', ')}" • ` : ''}
                          {budgetFilter ? `Budget: ≤ ${currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'}${budgetFilter.toLocaleString()} (${budgetType === 'per_day' ? '/day' : 'total trip'})` : ''}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        {searchQuery && (
                          <button
                            onClick={() => handleSearchSubmit(searchQuery)}
                            className="px-4 py-2.5 rounded-xl bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Generate "{searchQuery}" with AI</span>
                          </button>
                        )}

                        <button
                          onClick={handleResetFilters}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Creator Reel Studio Tab */}
            {activeTab === 'creator' && (
              <ReelCreatorStudioView
                destinations={destinations}
                onSelectDestination={handleSelectDestination}
                onPlanTrip={handlePlanTripForDestination}
                currency={currency}
              />
            )}

            {/* Packages View */}
            {activeTab === 'packages' && (
              <PackagesView
                currency={currency}
                onSelectDestination={handleSelectDestination}
                onPlanTrip={handlePlanTripForDestination}
                onBookingSuccess={handleBookingSuccess}
              />
            )}

            {/* Flights & Transit View */}
            {activeTab === 'flights' && (
              <FlightsTransitsView
                currency={currency}
                onBookingSuccess={handleBookingSuccess}
              />
            )}

            {/* Experiences & Activities View */}
            {activeTab === 'experiences' && (
              <ExperiencesView
                currency={currency}
                onSelectDestination={handleSelectDestination}
                onBookingSuccess={handleBookingSuccess}
              />
            )}

            {/* Packing Checklist View */}
            {activeTab === 'checklist' && (
              <PackingChecklistView destinations={destinations} />
            )}

            {/* SOS Safety & Emergency View */}
            {activeTab === 'sos' && (
              <TravelSOSView destinations={destinations} />
            )}

            {/* AI Trip Planner Tab */}
            {activeTab === 'planner' && (
              <TripPlannerView
                destinations={destinations}
                activeDestination={selectedDestination}
                selectedTier={selectedPlannerTier}
                user={user}
                currency={currency}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onTripSaved={(plan) => {
                  setUserTrips((prev) => [plan, ...prev]);
                  confetti({
                    particleCount: 80,
                    spread: 80,
                    origin: { y: 0.6 },
                  });
                }}
                onBookTrip={handleOpenBooking}
              />
            )}

            {/* Hotels Tab */}
            {activeTab === 'hotels' && (
              <HotelsView
                hotels={hotels}
                user={user}
                currency={currency}
                onBookingConfirmed={(b) => handleBookingSuccess(b, 200)}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            )}

            {/* Route Planner Tab */}
            {activeTab === 'route' && (
              <RoutePlannerView
                currency={currency}
              />
            )}

            {/* Budget Calculator Tab */}
            {activeTab === 'budget' && (
              <BudgetCalculatorView
                currency={currency}
              />
            )}

            {/* Saved Wishlist Tab */}
            {activeTab === 'saved' && (
              <SavedTripsView
                savedDestinations={savedDestinationsList}
                userTrips={userTrips}
                currency={currency}
                onSelectDestination={handleSelectDestination}
                onRemoveSaved={handleToggleSave}
                onPlanTrip={handlePlanTripForDestination}
                onBookTrip={handleOpenBooking}
                onExploreMore={() => setActiveTab('explore')}
              />
            )}

            {/* Bookings Dashboard Tab */}
            {activeTab === 'bookings' && (
              <BookingDashboardView
                bookings={bookings}
                user={user}
                currency={currency}
                onNavigateToTab={(t) => setActiveTab(t)}
              />
            )}

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <ProfileSettingsView
                user={user}
                onUpdateUser={(updated) => setUser(updated)}
                onSignOut={() => setUser(null)}
              />
            )}
          </>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <DestinationDetailModal
        destination={selectedDestination}
        onClose={() => setIsDetailModalOpen(false)}
        onPlanTrip={handlePlanTripForDestination}
        isSaved={selectedDestination ? savedDestinationIds.includes(selectedDestination.id) : false}
        onToggleSave={handleToggleSave}
        onDownloadPDF={(dest) => handleOpenPDFGenerator(dest)}
        onBookTrip={handleOpenBooking}
        hotels={hotels}
        currency={currency}
      />

      <AnimatePresence>
        {pdfModalConfig && (
          <PDFGeneratorModal
            destination={pdfModalConfig.destination}
            initialTier={pdfModalConfig.tier}
            initialDailyBudget={pdfModalConfig.dailyBudget}
            initialDays={pdfModalConfig.days}
            currency={currency}
            onClose={() => setPdfModalConfig(null)}
          />
        )}
      </AnimatePresence>

      {/* MakeMyTrip & TripAdvisor Style Complete Trip Booking Flow Modal */}
      <AnimatePresence>
        {bookingModalConfig && (
          <TripBookingModal
            isOpen={true}
            destination={bookingModalConfig.destination}
            allDestinations={destinations}
            initialStep={bookingModalConfig.initialStep ?? 5}
            initialTravelMode={bookingModalConfig.travelMode}
            initialOrigin={bookingModalConfig.origin}
            initialTier={bookingModalConfig.tier}
            initialBudgetLimit={bookingModalConfig.budgetLimit}
            currency={currency}
            user={user}
            onClose={() => setBookingModalConfig(null)}
            onBookingSuccess={(bookingRecord, points) => {
              handleBookingSuccess(bookingRecord, points);
              setBookingModalConfig(null);
              setActiveTab('bookings');
            }}
          />
        )}
      </AnimatePresence>

      <AIRecommenderModal
        isOpen={isRecommenderOpen}
        onClose={() => setIsRecommenderOpen(false)}
        destinations={destinations}
        onSelectDestination={handleSelectDestination}
        onPlanTripForDestination={handlePlanTripForDestination}
      />

      <TravelAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onPlanTripFromAssistant={(destName) => {
          const matched = destinations.find((d) =>
            d.name.toLowerCase().includes(destName.toLowerCase())
          );
          if (matched) {
            handlePlanTripForDestination(matched);
          } else {
            handleSearchSubmit(destName);
          }
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(authedUser) => setUser(authedUser)}
      />

      {/* Export to Mobile & PWA Installation Hub Modal */}
      <ExportToMobileModal
        isOpen={isExportMobileModalOpen}
        onClose={() => setIsExportMobileModalOpen(false)}
      />

      {/* Connectivity & Offline Mode Banner */}
      <OfflineIndicator />

      {/* Nature Ambient Audio & Floating Particle Engine */}
      <NatureAmbientController />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-200">MG TRAVELS</span>
            <span>— AI-Based Personalized Travel Recommendation System</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-slate-400">
            <button
              onClick={() => setIsExportMobileModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>📱 Export to Mobile (PWA & APK)</span>
            </button>
            <span>•</span>
            <span>Flask/Express Backend</span>
            <span>•</span>
            <span>Kotlin & Jetpack Compose Native Model</span>
            <span>•</span>
            <span>Live Weather, Hotel & Transit Streams</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
