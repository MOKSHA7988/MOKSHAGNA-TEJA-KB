import React, { useState } from 'react';
import {
  Luggage,
  Calendar,
  CheckCircle2,
  MapPin,
  Users,
  FileCheck,
  ShieldCheck,
  Download,
  Printer,
  Sparkles,
  Plane,
  Hotel,
  Compass,
  QrCode,
  Coins,
  ArrowRight,
  X,
  Ticket,
} from 'lucide-react';
import { BookingRecord, UserProfile } from '../types/travel';
import { RealETicketModal } from './RealETicketModal';

interface BookingDashboardViewProps {
  bookings: BookingRecord[];
  user: UserProfile | null;
  currency: 'INR' | 'USD' | 'EUR';
  onNavigateToTab?: (tab: string) => void;
}

export const BookingDashboardView: React.FC<BookingDashboardViewProps> = ({
  bookings,
  user,
  currency,
  onNavigateToTab,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedVoucher, setSelectedVoucher] = useState<BookingRecord | null>(null);
  const [realTicketBooking, setRealTicketBooking] = useState<BookingRecord | null>(null);

  const formatPrice = (inr: number) => {
    if (currency === 'USD') return `$${Math.round(inr / 83).toLocaleString()}`;
    if (currency === 'EUR') return `€${Math.round(inr / 90).toLocaleString()}`;
    return `₹${inr.toLocaleString('en-IN')}`;
  };

  const filtered = bookings.filter((b) => {
    if (filterType === 'all') return true;
    if (filterType === 'package') return b.type === 'package';
    if (filterType === 'hotel') return b.type === 'hotel';
    if (filterType === 'transit') return b.type === 'activity' && b.title.includes('(');
    if (filterType === 'experience') return b.type === 'activity' && !b.title.includes('(');
    return true;
  });

  const totalSpent = bookings.reduce((sum, b) => sum + b.amountPaid, 0);
  const totalPointsEarned = Math.round(totalSpent * 0.05);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
            <Luggage className="w-3.5 h-3.5" /> Confirmed Trips & Vouchers
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Lifetime Points Earned: +{totalPointsEarned} pts</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          My Travel <span className="bg-gradient-to-r from-cyan-300 to-teal-200 bg-clip-text text-transparent">Bookings & E-Tickets</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Access your verified holiday packages, luxury hotel confirmations, flight/train e-tickets, and adventure passes with instant QR check-in and downloadable tax invoices.
        </p>

        {/* Stats Strip */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Total Active Bookings</span>
            <span className="text-xl font-bold text-white">{bookings.length} Confirmed</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Total Invested</span>
            <span className="text-xl font-bold text-emerald-400">{formatPrice(totalSpent)}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Account Status</span>
            <span className="text-xl font-bold text-cyan-300">Verified VIP</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Support Line</span>
            <span className="text-xl font-bold text-indigo-300">24/7 Dedicated</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All (${bookings.length})` },
          { id: 'package', label: 'Holiday Packages' },
          { id: 'hotel', label: 'Hotels & Resorts' },
          { id: 'transit', label: 'Flights & Trains' },
          { id: 'experience', label: 'Local Experiences' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === tab.id
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings Grid */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Header with Reference & Status */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block">E-VOUCHER REF</span>
                      <p className="text-xs font-mono font-bold text-cyan-300">{b.bookingRef}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                        {b.type}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {b.status}
                      </span>
                    </div>
                  </div>

                  {/* Title and details */}
                  <h3 className="text-lg font-bold text-white leading-snug">{b.title}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {b.destination}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      {b.dates}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      {b.guests} Guests
                    </span>
                  </div>

                  {b.details && (
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                      {b.details}
                    </div>
                  )}
                </div>

                {/* Footer and Voucher trigger */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Total Amount Paid</span>
                    <p className="text-lg font-extrabold text-emerald-400">
                      {formatPrice(b.amountPaid)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRealTicketBooking(b)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-900/30 transition-all cursor-pointer"
                      title="View authentic IRCTC / Boarding Pass E-Ticket"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Official E-Ticket</span>
                    </button>

                    <button
                      onClick={() => setSelectedVoucher(b)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Summary Voucher</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800 space-y-4">
            <Luggage className="w-12 h-12 text-slate-600 mx-auto mb-1" />
            <h3 className="text-base font-bold text-white">No active reservations in this category</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Book all-inclusive holiday packages, verified hotels, or adventure tours to see your confirmed e-tickets here.
            </p>
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('packages')}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold hover:opacity-90 shadow-md shadow-cyan-500/20"
              >
                Browse Holiday Packages
              </button>
            )}
          </div>
        )}
      </div>

      {/* Voucher Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  MG Travels Official E-Voucher
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedVoucher.title}</h3>
                <p className="text-xs text-slate-400">
                  Voucher Reference: <strong className="text-cyan-300 font-mono">{selectedVoucher.bookingRef}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Destination</span>
                  <span className="font-bold text-slate-200">{selectedVoucher.destination}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Dates / Schedule</span>
                  <span className="font-bold text-slate-200">{selectedVoucher.dates}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Travelers</span>
                  <span className="font-bold text-slate-200">{selectedVoucher.guests} Passenger(s)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Status</span>
                  <span className="font-bold text-emerald-400">Confirmed & Guaranteed</span>
                </div>
              </div>

              {selectedVoucher.details && (
                <div className="pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <span className="text-slate-500 block mb-1">Reservation Inclusions & Notes</span>
                  <p>{selectedVoucher.details}</p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] block">Total Amount Paid</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {formatPrice(selectedVoucher.amountPaid)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-cyan-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                  <QrCode className="w-4 h-4" />
                  <span>Valid QR for Check-in</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  setRealTicketBooking(selectedVoucher);
                  setSelectedVoucher(null);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Ticket className="w-4 h-4" />
                <span>Open IRCTC / Real E-Ticket</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button
                  onClick={() => {
                    alert(`E-Voucher PDF generated for ${selectedVoucher.bookingRef}`);
                    setSelectedVoucher(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold hover:opacity-90 shadow-md shadow-cyan-500/20"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authentic Real E-Ticket Modal (IRCTC Railway Reservation Slip / Airline Boarding Pass) */}
      {realTicketBooking && (
        <RealETicketModal
          booking={realTicketBooking}
          isOpen={!!realTicketBooking}
          onClose={() => setRealTicketBooking(null)}
          currency={currency}
        />
      )}
    </div>
  );
};
