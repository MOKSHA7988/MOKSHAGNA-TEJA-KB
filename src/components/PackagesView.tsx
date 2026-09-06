import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Check,
  Search,
  Filter,
  ArrowRight,
  Star,
  Hotel,
  Car,
  Utensils,
  Camera,
  Coins,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { HolidayPackage, UserProfile, BookingRecord } from '../types/travel';
import { PACKAGES_DATABASE } from '../data/travelDatabase';
import { PackageBookingModal } from './PackageBookingModal';

interface PackagesViewProps {
  user: UserProfile | null;
  currency: 'INR' | 'USD' | 'EUR';
  onBookingSuccess: (booking: BookingRecord, pointsEarned: number) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const PackagesView: React.FC<PackagesViewProps> = ({
  user,
  currency,
  onBookingSuccess,
  onNavigateToTab,
}) => {
  const [packages, setPackages] = useState<HolidayPackage[]>(PACKAGES_DATABASE);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [activePackageForBooking, setActivePackageForBooking] = useState<HolidayPackage | null>(null);
  const [expandedDayWisePkgId, setExpandedDayWisePkgId] = useState<string | null>(null);

  // Format Currency
  const formatCurrency = (inr: number) => {
    if (currency === 'USD') return `$${Math.round(inr / 83)}`;
    if (currency === 'EUR') return `€${Math.round(inr / 90)}`;
    return `₹${inr.toLocaleString('en-IN')}`;
  };

  const themes = ['All', 'Weekend Getaway', 'Honeymoon', 'Adventure Trek', 'Spiritual & Heritage'];

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destinationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = selectedTheme === 'All' || pkg.theme === selectedTheme;
    const matchesTier = selectedTier === 'All' || pkg.tier === selectedTier;
    return matchesSearch && matchesTheme && matchesTier;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-cyan-950/60 to-indigo-950/80 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Curated All-Inclusive Holidays
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> Earn 5% Loyalty Cashback
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Book Complete Holiday Packages with <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-300 bg-clip-text text-transparent">AI-Tailored Itineraries</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Handcrafted vacations including premium stays, private chauffeur transfers, gourmet dining, guided sightseeing & exclusive local experiences. Customize every detail with 1-click booking.
          </p>

          {/* Search and Filters Bar */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search packages by destination, state, or theme..."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 shadow-inner"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {themes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedTheme === theme
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Package Listings Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>Available Holiday Packages</span>
            <span className="text-xs font-normal text-slate-400">({filteredPackages.length} packages found)</span>
          </h2>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Tier:</span>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-slate-800 text-slate-200 rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-cyan-500 text-xs"
            >
              <option value="All">All Tiers</option>
              <option value="standard">Standard (4-Star)</option>
              <option value="luxury">Luxury (5-Star)</option>
            </select>
          </div>
        </div>

        {filteredPackages.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 space-y-3">
            <Filter className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-base font-semibold text-white">No packages match your search criteria</p>
            <p className="text-xs">Try searching for "Coorg", "Kerala", "Goa", "Manali", or "Rajasthan"</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTheme('All');
                setSelectedTier('All');
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold hover:bg-cyan-500/30"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPackages.map((pkg) => {
              const isDayWiseExpanded = expandedDayWisePkgId === pkg.id;
              return (
                <div
                  key={pkg.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col group"
                >
                  {/* Hero Banner & Badges */}
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img
                      src={pkg.heroImage}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                        {pkg.theme}
                      </span>
                      {pkg.badge && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-slate-950 shadow-md">
                          ★ {pkg.badge}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-1 border border-emerald-500/30">
                      <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                      <span>{pkg.rating}</span>
                      <span className="text-[10px] text-slate-400">({pkg.reviewsCount})</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-xs text-cyan-300 font-medium mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{pkg.destinationName}, {pkg.state}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug line-clamp-1">
                        {pkg.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Features / Highlights Chips */}
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                          <Clock className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                          <span className="text-[11px] text-slate-400 block">Duration</span>
                          <span className="font-bold text-white">{pkg.durationDays}D / {pkg.durationNights}N</span>
                        </div>

                        <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                          <Hotel className="w-4 h-4 text-teal-400 mx-auto mb-1" />
                          <span className="text-[11px] text-slate-400 block">Stay</span>
                          <span className="font-bold text-white">{pkg.hotelStarRating}★ Resort</span>
                        </div>

                        <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                          <Car className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                          <span className="text-[11px] text-slate-400 block">Transfer</span>
                          <span className="font-bold text-white">Private Cab</span>
                        </div>
                      </div>

                      {/* Inclusions summary list */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                          Top Package Inclusions
                        </span>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {pkg.inclusions.slice(0, 3).map((inc, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Day-Wise Itinerary Accordion Button */}
                      <button
                        onClick={() => setExpandedDayWisePkgId(isDayWiseExpanded ? null : pkg.id)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-300 hover:text-cyan-300 flex items-center justify-between transition-all"
                      >
                        <span>
                          {isDayWiseExpanded ? 'Hide Day-Wise Itinerary' : `View Full ${pkg.durationDays}-Day Itinerary Plan`}
                        </span>
                        {isDayWiseExpanded ? (
                          <ChevronUp className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      {/* Expanded Day Wise Details */}
                      {isDayWiseExpanded && (
                        <div className="space-y-2 pt-1 border-t border-slate-800">
                          {pkg.dayWiseSchedule.map((day) => (
                            <div
                              key={day.day}
                              className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1"
                            >
                              <div className="flex justify-between items-center font-bold text-cyan-300">
                                <span>Day {day.day}: {day.title}</span>
                                <span className="text-[10px] text-emerald-400">
                                  Meals: {day.mealsIncluded.join(', ')}
                                </span>
                              </div>
                              <p className="text-slate-300 text-[11px]">{day.summary}</p>
                              <p className="text-[10px] text-slate-400">
                                🏨 Stay: <span className="text-slate-300">{day.stayHotel}</span>
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pricing & Booking CTA Footer */}
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-500 line-through">
                            {formatCurrency(pkg.originalPricePerPerson)}
                          </span>
                          <span className="text-xs font-bold text-emerald-400">
                            Save {Math.round(((pkg.originalPricePerPerson - pkg.pricePerPerson) / pkg.originalPricePerPerson) * 100)}%
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl sm:text-2xl font-extrabold text-cyan-300">
                            {formatCurrency(pkg.pricePerPerson)}
                          </span>
                          <span className="text-[10px] text-slate-400">/ person</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActivePackageForBooking(pkg)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 text-white text-xs sm:text-sm font-bold hover:opacity-95 shadow-lg shadow-cyan-500/20 group-hover:scale-[1.02] transition-all"
                      >
                        <span>Book Package</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Package Booking Modal */}
      {activePackageForBooking && (
        <PackageBookingModal
          pkg={activePackageForBooking}
          user={user}
          currency={currency}
          onClose={() => setActivePackageForBooking(null)}
          onBookingSuccess={(booking, points) => {
            onBookingSuccess(booking, points);
            setActivePackageForBooking(null);
          }}
        />
      )}
    </div>
  );
};
