import React from 'react';
import { Heart, Compass, ArrowRight, Trash2, Calendar, MapPin, Ticket } from 'lucide-react';
import { Destination, TripPlan } from '../types/travel';

interface SavedTripsViewProps {
  savedDestinations: Destination[];
  userTrips: TripPlan[];
  onSelectDestination: (d: Destination) => void;
  onPlanTrip: (d: Destination) => void;
  onRemoveSaved: (id: string) => void;
  onBookTrip?: (d: Destination) => void;
  currency: 'INR' | 'USD' | 'EUR';
}

export const SavedTripsView: React.FC<SavedTripsViewProps> = ({
  savedDestinations,
  userTrips,
  onSelectDestination,
  onPlanTrip,
  onRemoveSaved,
  onBookTrip,
  currency,
}) => {
  const formatPrice = (inr: number) => {
    if (currency === 'USD') return `$${Math.round(inr / 85).toLocaleString()}`;
    if (currency === 'EUR') return `€${Math.round(inr / 92).toLocaleString()}`;
    return `₹${inr.toLocaleString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold">
          <Heart className="w-3.5 h-3.5 fill-current" />
          Wishlist & Saved AI Travel Plans
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Your Saved Destinations & Custom Itineraries
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Revisit your favorite dream destinations or review saved day-by-day travel schedules.
        </p>
      </div>

      {/* Saved Wishlist Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Wishlisted Destinations ({savedDestinations.length})</span>
        </h2>

        {savedDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDestinations.map((dest) => (
              <div
                key={dest.id}
                className="group bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => onRemoveSaved(dest.id)}
                        className="p-2 rounded-full bg-slate-900/80 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-slate-700"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/85 text-cyan-300 text-[11px] font-bold border border-cyan-500/30">
                      {dest.type}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{dest.state}</span>
                      <span>•</span>
                      <span className="text-amber-300">★ {dest.rating}</span>
                    </div>

                    <h3 className="font-bold text-white text-base">{dest.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{dest.tagline}</p>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectDestination(dest)}
                    className="text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Details
                  </button>
                  <div className="flex items-center gap-1.5">
                    {onBookTrip && (
                      <button
                        onClick={() => onBookTrip(dest)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-amber-500 text-white flex items-center gap-1 shadow-sm hover:brightness-110"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Book</span>
                      </button>
                    )}
                    <button
                      onClick={() => onPlanTrip(dest)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-teal-500 text-white flex items-center gap-1 shadow-sm"
                    >
                      <span>Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900/50 rounded-3xl border border-slate-800 space-y-2">
            <Heart className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs font-semibold text-slate-400">
              No saved destinations yet. Click the heart icon on any card to save!
            </p>
          </div>
        )}
      </div>

      {/* Saved Itineraries */}
      {userTrips.length > 0 && (
        <div className="space-y-4 pt-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Saved AI Itineraries ({userTrips.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userTrips.map((trip) => (
              <div
                key={trip.id}
                className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">{trip.destinationName}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    {trip.totalDays} Days • {trip.tripTier.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{trip.startDate} to {trip.endDate}</span>
                  <span>•</span>
                  <span>{trip.travelersCount} ({trip.travelerType})</span>
                </div>

                <p className="text-xs text-slate-300 italic line-clamp-2">
                  "{trip.personalizedIntro}"
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400">
                    Total: {formatPrice(trip.budgetBreakdown.total)}
                  </span>
                  <span className="text-slate-400">
                    {trip.itinerary.length} Days Planned
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
