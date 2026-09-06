import React, { useState, useEffect } from 'react';
import {
  Navigation,
  MapPin,
  Car,
  Train,
  Bus,
  Plane,
  Clock,
  IndianRupee,
  Fuel,
  Sparkles,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Leaf,
  Info,
} from 'lucide-react';
import { RouteInfo } from '../types/travel';
import { computeRealTimeTransitCost, MultiModalTransitResult, FuelType } from '../utils/transitPricing';

interface RoutePlannerViewProps {
  currency: 'INR' | 'USD' | 'EUR';
}

export const RoutePlannerView: React.FC<RoutePlannerViewProps> = ({ currency }) => {
  const [origin, setOrigin] = useState('Bangalore');
  const [destination, setDestination] = useState('Coorg (Kodagu)');
  const [stops, setStops] = useState<string[]>(['Mysore Palace Viewpoint']);
  const [newStop, setNewStop] = useState('');
  const [activeMode, setActiveMode] = useState<'car' | 'train' | 'bus' | 'flight'>('car');
  const [fuelType, setFuelType] = useState<FuelType>('petrol');
  const [passengers, setPassengers] = useState<number>(2);
  const [routeData, setRouteData] = useState<RouteInfo | null>(null);
  const [transitFares, setTransitFares] = useState<MultiModalTransitResult>(() =>
    computeRealTimeTransitCost('Bangalore', 'Coorg (Madikeri)', 2, 'petrol', 'sedan')
  );
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (inr: number) => {
    if (currency === 'USD') return `$${Math.round(inr / 83).toLocaleString()}`;
    if (currency === 'EUR') return `€${Math.round(inr / 90).toLocaleString()}`;
    return `₹${inr.toLocaleString('en-IN')}`;
  };

  const fetchRoute = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, stops }),
      });
      const data = await res.json();
      if (data.success) {
        setRouteData(data.route);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoute();
    const liveFares = computeRealTimeTransitCost(origin, destination, passengers, fuelType, 'sedan');
    setTransitFares(liveFares);
  }, [origin, destination, stops, fuelType, passengers]);

  const handleAddStop = () => {
    if (newStop.trim()) {
      setStops([...stops, newStop.trim()]);
      setNewStop('');
    }
  };

  const handleRemoveStop = (idx: number) => {
    setStops(stops.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
          <Navigation className="w-3.5 h-3.5" />
          Smart Road Trip & Real-Time Multi-Modal Routing
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Intelligent Route Planner & Live Travel Cost Comparison
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Calculate exact road distances, live multi-modal travel durations, vehicle fuel budgets, FASTag highway tolls, and direct flight vs train fares.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Form */}
        <div className="lg:col-span-5 space-y-5 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <MapPin className="w-4 h-4 text-cyan-400" />
            Route & Traveler Setup
          </h2>

          <div className="space-y-4">
            {/* Origin */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Departure City (Origin)</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs font-semibold p-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-cyan-500"
              >
                <option value="Bangalore">Bangalore (Bengaluru)</option>
                <option value="Delhi">Delhi (NCR)</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Kochi">Kochi (Cochin)</option>
              </select>
            </div>

            {/* Destination */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Arrival Destination</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs font-semibold p-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-cyan-500"
              >
                <option value="Coorg (Kodagu)">Coorg (Kodagu, Karnataka)</option>
                <option value="Goa">Goa (Beaches & Forts)</option>
                <option value="Munnar">Munnar (Kerala)</option>
                <option value="Manali">Manali (Himachal Pradesh)</option>
                <option value="Jaipur">Jaipur (Rajasthan)</option>
                <option value="Udaipur">Udaipur (Lakes & Palaces)</option>
                <option value="Agra">Agra (Taj Mahal)</option>
                <option value="Varanasi">Varanasi (Ghats)</option>
                <option value="Alleppey">Alleppey (Backwaters)</option>
                <option value="Ooty">Ooty (Nilgiris)</option>
              </select>
            </div>

            {/* Passengers & Fuel Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Travelers</label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full bg-slate-800 text-white text-xs font-semibold p-2.5 rounded-xl border border-slate-700"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} Traveler{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Car Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as any)}
                  className="w-full bg-slate-800 text-white text-xs font-semibold p-2.5 rounded-xl border border-slate-700"
                >
                  <option value="petrol">Petrol (₹101.94/L)</option>
                  <option value="diesel">Diesel (₹87.89/L)</option>
                  <option value="cng">CNG (₹75.50/kg)</option>
                  <option value="ev">Electric EV (₹8.50/kWh)</option>
                </select>
              </div>
            </div>

            {/* Stops list */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Scenic Intermediate Stops</span>
                <span className="text-[10px] text-cyan-400">({stops.length} added)</span>
              </label>

              <div className="space-y-1.5">
                {stops.map((stop, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-slate-800/90 px-3 py-2 rounded-xl text-xs text-slate-200 border border-slate-700"
                  >
                    <span>📍 Stop {idx + 1}: {stop}</span>
                    <button
                      onClick={() => handleRemoveStop(idx)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newStop}
                  onChange={(e) => setNewStop(e.target.value)}
                  placeholder="Add custom stop (e.g. Cafe, Temple)..."
                  className="flex-1 bg-slate-800 px-3 py-2 text-xs rounded-xl border border-slate-700 text-white placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={handleAddStop}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-xl text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-time Multi-Modal Cost Comparison Matrix */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                Real-Time Cost Comparison ({passengers} Pax)
              </h3>
              <span className="text-xs text-slate-400">
                Distance: <strong className="text-white">{transitFares.distanceRoadKm} km</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Car */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                  <Car className="w-3.5 h-3.5" /> Car (Fuel+Toll)
                </div>
                <div className="text-lg font-black text-amber-300">
                  {formatPrice(transitFares.car.personal.totalCost)}
                </div>
                <p className="text-[10px] text-slate-400">
                  {transitFares.car.personal.drivingTimeStr} • ({formatPrice(transitFares.car.personal.costPerPerson)}/pax)
                </p>
              </div>

              {/* Train */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                  <Train className="w-3.5 h-3.5" /> Train (IRCTC)
                </div>
                <div className="text-lg font-black text-emerald-300">
                  {formatPrice(transitFares.train.totalGroupCost)}
                </div>
                <p className="text-[10px] text-slate-400">
                  {transitFares.train.durationStr} • ({formatPrice(transitFares.train.cheapestFarePerPerson)}/pax)
                </p>
              </div>

              {/* Flight */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold">
                  <Plane className="w-3.5 h-3.5" /> Flight
                </div>
                <div className="text-lg font-black text-indigo-300">
                  {transitFares.flight.available ? formatPrice(transitFares.flight.totalGroupCost) : 'N/A'}
                </div>
                <p className="text-[10px] text-slate-400">
                  {transitFares.flight.available ? `${transitFares.flight.durationStr} • Non-stop` : 'No direct airport'}
                </p>
              </div>

              {/* Bus */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
                  <Bus className="w-3.5 h-3.5" /> Volvo Bus
                </div>
                <div className="text-lg font-black text-cyan-300">
                  {formatPrice(transitFares.bus.totalGroupCost)}
                </div>
                <p className="text-[10px] text-slate-400">
                  {transitFares.bus.durationStr} • ({formatPrice(transitFares.bus.cheapestFarePerPerson)}/pax)
                </p>
              </div>
            </div>
          </div>

          {routeData && (
            <div className="space-y-5">
              {/* Visual Route Timeline */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  Step-by-Step Waypoint Navigation & Halts
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-teal-500 before:to-emerald-500">
                  {/* Origin Step */}
                  <div className="relative space-y-1">
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-cyan-950" />
                    <h4 className="text-sm font-bold text-white">Start: {origin}</h4>
                    <p className="text-xs text-slate-400">Early morning departure recommended (06:00 AM)</p>
                  </div>

                  {/* Waypoints */}
                  {stops.map((stop, idx) => (
                    <div key={idx} className="relative space-y-1">
                      <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-amber-400 ring-4 ring-amber-950" />
                      <h4 className="text-sm font-bold text-amber-300">Stop {idx + 1}: {stop}</h4>
                      <p className="text-xs text-slate-400">Rest break & refreshment halt (approx. 45 mins)</p>
                    </div>
                  ))}

                  {/* Destination Step */}
                  <div className="relative space-y-1">
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-950" />
                    <h4 className="text-sm font-bold text-emerald-300">Arrival: {destination}</h4>
                    <p className="text-xs text-slate-400">Hotel check-in & evening leisure</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-750 text-xs text-slate-300 space-y-1 mt-4">
                  <p className="font-bold text-cyan-300">🚗 Scenic Highway Notes:</p>
                  <p className="text-slate-300">{routeData.scenicNotes}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
