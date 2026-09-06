import React, { useState } from 'react';
import {
  Luggage,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Sparkles,
  AlertTriangle,
  Scale,
  Printer,
  RotateCcw,
  Plane,
  CloudSun,
  ShieldAlert,
} from 'lucide-react';
import { PackingItem, Destination } from '../types/travel';
import { DEFAULT_PACKING_ITEMS, INITIAL_DESTINATIONS } from '../data/travelDatabase';

interface PackingChecklistViewProps {
  onNavigateToTab?: (tab: string) => void;
}

export const PackingChecklistView: React.FC<PackingChecklistViewProps> = () => {
  const [items, setItems] = useState<PackingItem[]>(DEFAULT_PACKING_ITEMS);
  const [selectedDestination, setSelectedDestination] = useState<string>('coorg');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<PackingItem['category']>('Clothing');
  const [newItemWeight, setNewItemWeight] = useState<number>(300);

  const activeDest = INITIAL_DESTINATIONS.find((d) => d.id === selectedDestination) || INITIAL_DESTINATIONS[0];

  const categories: ('All' | PackingItem['category'])[] = [
    'All',
    'Clothing',
    'Electronics',
    'Toiletries',
    'Documents',
    'Medication',
    'Adventure/Seasonal',
  ];

  const toggleItemPacked = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: PackingItem = {
      id: `custom-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      essential: false,
      packed: false,
      weightGrams: Number(newItemWeight) || 200,
    };

    setItems([...items, newItem]);
    setNewItemName('');
  };

  const handleReset = () => {
    setItems(DEFAULT_PACKING_ITEMS);
  };

  // Calculations
  const packedCount = items.filter((i) => i.packed).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  // Luggage Weight (Estimated)
  const totalEstimatedWeightGrams = items
    .filter((i) => i.packed)
    .reduce((sum, item) => sum + item.weightGrams, 1500); // 1.5kg base bag weight
  const totalWeightKg = (totalEstimatedWeightGrams / 1000).toFixed(1);

  const checkinLimitKg = 15;
  const cabinLimitKg = 7;
  const isOverweight = Number(totalWeightKg) > checkinLimitKg;

  const filteredItems = items.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
            <Luggage className="w-3.5 h-3.5 text-cyan-400" /> Smart Packing Assistant
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Climate-Synced Checklist
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Smart Packing & <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-300 bg-clip-text text-transparent">Luggage Weight Estimator</span>
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          Never forget travel essentials. Dynamically customized for your destination climate, activity requirements, and airline check-in weight limits.
        </p>

        {/* Destination Selector */}
        <div className="pt-2 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-4 py-2 rounded-2xl text-xs">
            <CloudSun className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">Target Destination:</span>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
            >
              {INITIAL_DESTINATIONS.map((d) => (
                <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                  {d.name} ({d.climate.toUpperCase()} Climate)
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-cyan-300 font-medium bg-cyan-950/40 border border-cyan-500/30 px-3.5 py-2 rounded-2xl">
            Packing Advice: {activeDest.climate === 'cool' ? 'Pack light warm layers & windbreaker' : activeDest.climate === 'tropical' ? 'Pack breathable cottons, sunglasses & sunscreen' : 'Comfortable walking gear & hydration bottle'}
          </div>
        </div>
      </div>

      {/* Progress & Luggage Weight Meter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Packing Progress */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider">Packing Progress</span>
            <span className="font-bold text-cyan-400">{packedCount} of {totalCount} Packed ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Luggage Weight Estimator */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-amber-400" /> Est. Packed Weight
            </span>
            <span className={`font-bold ${isOverweight ? 'text-rose-400' : 'text-emerald-400'}`}>
              {totalWeightKg} kg
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Cabin Limit: {cabinLimitKg} kg</span>
            <span>Domestic Flight Limit: {checkinLimitKg} kg</span>
          </div>
          {isOverweight && (
            <p className="text-[10px] text-rose-400 flex items-center gap-1 font-semibold">
              <AlertTriangle className="w-3 h-3" /> Exceeds 15kg airline check-in baggage limit!
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 shadow-lg">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" /> Print List
          </button>
          <button
            onClick={handleReset}
            className="py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Add Custom Item Form */}
      <form
        onSubmit={handleAddItem}
        className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center gap-3"
      >
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add custom item (e.g. GoPro Action Camera, Trekking Pole)..."
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value as any)}
          className="bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none"
        >
          {categories.filter((c) => c !== 'All').map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2 text-xs text-slate-300">
          <span>Est.</span>
          <input
            type="number"
            value={newItemWeight}
            onChange={(e) => setNewItemWeight(Number(e.target.value))}
            className="w-14 bg-transparent text-white font-bold focus:outline-none"
          />
          <span>g</span>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold hover:opacity-90 shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </form>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Checklist Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItemPacked(item.id)}
            className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between gap-3 transition-all ${
              item.packed
                ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-white'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {item.packed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600 shrink-0" />
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p
                    className={`text-xs font-bold truncate ${
                      item.packed ? 'line-through text-slate-400' : 'text-white'
                    }`}
                  >
                    {item.name}
                  </p>
                  {item.essential && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Required
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                  <span>{item.category}</span>
                  <span>•</span>
                  <span>~{item.weightGrams}g</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeItem(item.id);
              }}
              className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
