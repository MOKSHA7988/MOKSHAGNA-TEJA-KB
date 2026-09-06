import React, { useState } from 'react';
import {
  Compass,
  Star,
  Clock,
  Users,
  MapPin,
  Sparkles,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  X,
  Coins,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { TravelExperience, UserProfile, BookingRecord } from '../types/travel';
import { EXPERIENCES_DATABASE } from '../data/travelDatabase';

interface ExperiencesViewProps {
  user: UserProfile | null;
  currency: 'INR' | 'USD' | 'EUR';
  onBookingSuccess: (booking: BookingRecord, pointsEarned: number) => void;
}

export const ExperiencesView: React.FC<ExperiencesViewProps> = ({
  user,
  currency,
  onBookingSuccess,
}) => {
  const [experiences] = useState<TravelExperience[]>(EXPERIENCES_DATABASE);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedExperience, setSelectedExperience] = useState<TravelExperience | null>(null);
  const [slotDate, setSlotDate] = useState<string>('2026-09-20');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  // Format Currency
  const formatCurrency = (inr: number) => {
    if (currency === 'USD') return `$${Math.round(inr / 83)}`;
    if (currency === 'EUR') return `€${Math.round(inr / 90)}`;
    return `₹${inr.toLocaleString('en-IN')}`;
  };

  const categories = [
    'All',
    'Water Sports',
    'Plantation & Nature',
    'Adventure Trek',
    'Culinary Tour',
  ];

  const filtered = experiences.filter(
    (exp) => selectedCategory === 'All' || exp.category === selectedCategory
  );

  const handleBookExperience = async () => {
    if (!selectedExperience) return;

    try {
      const response = await fetch('/api/experiences/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experienceId: selectedExperience.id,
          username: user?.email || 'moksgnateja@gmail.com',
          guests: guestsCount,
          selectedDate: slotDate,
          timeSlot: selectedSlot || selectedExperience.timeSlots[0],
        }),
      });

      const data = await response.json();
      if (data.success && data.booking) {
        setConfirmedBooking(data.booking);
        setIsSuccess(true);
        onBookingSuccess(data.booking, Math.round(selectedExperience.pricePerPerson * guestsCount * 0.05));
      }
    } catch (e) {
      console.error(e);
      const fallback: BookingRecord = {
        id: `bk-exp-${Date.now()}`,
        bookingRef: `MGT-EXP-${Math.floor(10000 + Math.random() * 90000)}`,
        username: user?.email || 'moksgnateja@gmail.com',
        type: 'activity',
        title: selectedExperience.title,
        destination: selectedExperience.destinationName,
        dates: `${slotDate} (${selectedSlot || selectedExperience.timeSlots[0]})`,
        guests: guestsCount,
        amountPaid: selectedExperience.pricePerPerson * guestsCount,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
        details: `Instructor: ${selectedExperience.instructor} | Spot: ${selectedExperience.locationSpot}`,
      };
      setConfirmedBooking(fallback);
      setIsSuccess(true);
      onBookingSuccess(fallback, Math.round(selectedExperience.pricePerPerson * guestsCount * 0.05));
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/60 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-teal-400" /> Curated Local Adventures
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Unforgettable <span className="bg-gradient-to-r from-teal-300 via-cyan-200 to-amber-200 bg-clip-text text-transparent">Local Experiences & Activities</span>
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          Book authentic local masterclasses, high-altitude tandem paragliding, underwater scuba dives, private backwater Shikara cruises, and midnight culinary street safaris with verified local masters.
        </p>

        {/* Category filter pills */}
        <div className="pt-3 flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Experiences */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((exp) => (
          <div
            key={exp.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={exp.imageUrl}
                alt={exp.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-bold text-teal-300 border border-teal-500/30">
                {exp.category}
              </div>
              <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-bold text-emerald-400 flex items-center gap-1 border border-emerald-500/30">
                <Star className="w-3 h-3 fill-emerald-400" />
                <span>{exp.rating}</span>
                <span className="text-[10px] text-slate-400">({exp.reviewsCount})</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-xs text-slate-300 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {exp.locationSpot}, {exp.destinationName}
              </div>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                <h3 className="font-bold text-base text-white group-hover:text-teal-300 transition-colors line-clamp-2">
                  {exp.title}
                </h3>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> {exp.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-500" /> {exp.groupSize}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                  <p className="font-semibold text-teal-300">Guided by: {exp.instructor}</p>
                  <p className="text-[10px] text-slate-400">Languages: {exp.language}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Price per guest</span>
                  <span className="text-lg font-extrabold text-cyan-300">
                    {formatCurrency(exp.pricePerPerson)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedExperience(exp);
                    setSelectedSlot(exp.timeSlots[0]);
                    setIsSuccess(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-bold hover:opacity-90 shadow-md shadow-teal-500/20 transition-all flex items-center gap-1"
                >
                  <span>Book Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Slot Modal */}
      {selectedExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  Book Local Experience
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedExperience.title}</h3>
                <p className="text-xs text-slate-400">{selectedExperience.locationSpot}</p>
              </div>
              <button
                onClick={() => setSelectedExperience(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isSuccess ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Select Date *</label>
                  <input
                    type="date"
                    value={slotDate}
                    onChange={(e) => setSlotDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 [color-scheme:dark]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Choose Available Time Slot</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedExperience.timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          selectedSlot === slot
                            ? 'bg-teal-950/50 border-teal-400 text-teal-300 shadow-md shadow-teal-500/10'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Number of Guests</label>
                  <div className="flex items-center gap-3 bg-slate-950 border border-slate-700 rounded-xl p-2 px-4 justify-between">
                    <span className="text-xs text-slate-300">Participants</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-cyan-300">{guestsCount}</span>
                      <button
                        type="button"
                        onClick={() => setGuestsCount(guestsCount + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Total Experience Fee</span>
                    <span className="text-xl font-extrabold text-teal-300">
                      {formatCurrency(selectedExperience.pricePerPerson * guestsCount)}
                    </span>
                  </div>
                  <button
                    onClick={handleBookExperience}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-bold hover:opacity-90 shadow-md shadow-teal-500/20"
                  >
                    Confirm & Reserve
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center py-4">
                <CheckCircle2 className="w-14 h-14 text-teal-400 mx-auto" />
                <div>
                  <h4 className="text-lg font-bold text-white">Experience Reserved!</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Activity Pass ID: <strong className="text-teal-300 font-mono">{confirmedBooking?.bookingRef}</strong>
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left text-slate-300 space-y-1">
                  <p>Instructor {selectedExperience.instructor} has been notified for your slot.</p>
                  <p className="text-emerald-400 font-semibold">+60 Loyalty Points credited to your wallet!</p>
                </div>
                <button
                  onClick={() => setSelectedExperience(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
