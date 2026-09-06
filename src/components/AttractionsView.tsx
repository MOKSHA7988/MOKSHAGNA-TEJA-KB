import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Clock,
  IndianRupee,
  Search,
  Sparkles,
  Check,
  Plus,
  TreePine,
  Waves,
  Mountain,
  Landmark,
} from 'lucide-react';
import { Attraction } from '../types/travel';

interface AttractionsViewProps {
  attractions: Attraction[];
  currency: 'INR' | 'USD' | 'EUR';
  onAddAttractionToTrip?: (attraction: Attraction) => void;
}

export const AttractionsView: React.FC<AttractionsViewProps> = ({
  attractions,
  currency,
  onAddAttractionToTrip,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addedList, setAddedList] = useState<string[]>([]);

  const formatPrice = (inr: number) => {
    if (inr === 0) return 'Free';
    if (currency === 'USD') return `$${Math.round(inr / 85).toLocaleString()}`;
    if (currency === 'EUR') return `€${Math.round(inr / 92).toLocaleString()}`;
    return `₹${inr.toLocaleString()}`;
  };

  const categories = [
    'All',
    'Scenic & Nature',
    'Waterfalls & Trekking',
    'Heritage & History',
    'Culture & Temples',
    'Wildlife & Safari',
    'Beaches & Coastal',
  ];

  const filtered = attractions.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.destinationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleAdd = (attraction: Attraction) => {
    if (!addedList.includes(attraction.id)) {
      setAddedList([...addedList, attraction.id]);
      if (onAddAttractionToTrip) onAddAttractionToTrip(attraction);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
          <Compass className="w-3.5 h-3.5" />
          Curated Experiences, Hidden Waterfalls & Heritage Sanctuaries
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Explore Top Attractions & Experiences
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Discover certified sightseeing spots with recommended visiting hours, entry tickets, and scenic highlights.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search attractions, temples, waterfalls, safari..."
              className="w-full pl-10 pr-3 py-2.5 bg-slate-800 text-white placeholder-slate-400 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => {
          const isAdded = addedList.includes(item.id);
          return (
            <div
              key={item.id}
              id={`attraction-card-${item.id}`}
              className="group bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-md text-[11px] font-bold text-cyan-300 border border-cyan-500/30">
                    {item.destinationName}
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-xs font-bold text-amber-300 border border-slate-700">
                    ★ {item.rating}
                  </div>
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/85 backdrop-blur-md text-[10px] text-slate-300 font-medium border border-slate-700">
                    {item.category}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {item.timeNeeded}
                    </span>
                    <span>•</span>
                    <span className="text-slate-300">{item.bestTimeOfDay}</span>
                  </div>

                  <div className="text-[11px] text-cyan-300 bg-cyan-950/30 p-2 rounded-xl border border-cyan-500/20">
                    ✨ <strong>Highlight:</strong> {item.highlight}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">Entry Fee</p>
                  <p className="text-sm font-bold text-emerald-400">
                    {formatPrice(item.entryFee)}
                  </p>
                </div>

                <button
                  id={`add-attraction-btn-${item.id}`}
                  onClick={() => handleAdd(item)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    isAdded
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:opacity-95 shadow-sm'
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
                      <span>Add to Plan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
