import React, { useState } from 'react';
import {
  Hotel as HotelIcon,
  Star,
  MapPin,
  Wifi,
  Coffee,
  Sparkles,
  Check,
  ShieldCheck,
  IndianRupee,
  Search,
  Filter,
  Coins,
  Calendar,
  Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Hotel, UserProfile, BookingRecord } from '../types/travel';

interface HotelsViewProps {
  hotels: Hotel[];
  user: UserProfile | null;
  currency: 'INR' | 'USD' | 'EUR';
  onBookingConfirmed: (booking: BookingRecord) => void;
  onOpenAuth: () => void;
}

export const HotelsView: React.FC<HotelsViewProps> = ({
  hotels,
  user,
  currency,
  onBookingConfirmed,
  onOpenAuth,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(25000);
  const [selectedAmenity, setSelectedAmenity] = useState('All');

  // Booking Modal state
  const [bookingHotel, setBookingHotel] = useState<Hotel | null>(null);
  const [checkInDate, setCheckInDate] = useState('2026-10-15');
  const [checkOutDate, setCheckOutDate] = useState('2026-10-18');
  const [guestsCount, setGuestsCount] = useState(2);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);
  const [bookingSuccessRef, setBookingSuccessRef] = useState<string | null>(null);

  const formatPrice = (inr: number) => {
    if (currency === 'USD') return `$${Math.round(inr / 85).toLocaleString()}`;
    if (currency === 'EUR') return `€${Math.round(inr / 92).toLocaleString()}`;
    return `₹${inr.toLocaleString()}`;
  };

  const amenitiesList = [
    'All',
    'Swimming Pool',
    'Spa & Wellness',
    'Free WiFi',
    'Mountain View',
    'Plantation Walk',
    'Complimentary Breakfast',
  ];

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.destinationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDest =
      selectedDestination === 'All' ||
      hotel.destinationId === selectedDestination ||
      hotel.destinationName.toLowerCase().includes(selectedDestination.toLowerCase());

    const matchesRating = hotel.rating >= minRating;
    const matchesPrice = hotel.pricePerNight <= maxPrice;
    const matchesAmenity =
      selectedAmenity === 'All' || hotel.amenities.some((a) => a.includes(selectedAmenity));

    return matchesSearch && matchesDest && matchesRating && matchesPrice && matchesAmenity;
  });

  const handleConfirmBooking = async () => {
    if (!bookingHotel) return;
    if (!user) {
      onOpenAuth();
      return;
    }

    setIsProcessingBooking(true);
    const nights = 3;
    let total = bookingHotel.pricePerNight * nights;
    if (useLoyaltyPoints && user.loyaltyPoints) {
      total = Math.max(0, total - user.loyaltyPoints);
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.email,
          title: bookingHotel.name,
          destination: bookingHotel.destinationName,
          dates: `${checkInDate} to ${checkOutDate}`,
          guests: guestsCount,
          amountPaid: total,
          type: 'hotel',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookingSuccessRef(data.booking.bookingRef);
        onBookingConfirmed(data.booking);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingBooking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
          <HotelIcon className="w-3.5 h-3.5" />
          Verified Heritage Stays & Luxury Eco-Resorts
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Find Handpicked Stays & Boutique Retreats
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Book certified luxury plantations, private pool villas, and heritage houseboats with instant confirmation.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hotel or location..."
              className="w-full pl-10 pr-3 py-2.5 bg-slate-800 text-white placeholder-slate-400 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Destination filter */}
          <div>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full bg-slate-800 text-white text-xs font-semibold p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Destinations</option>
              <option value="coorg">Coorg (Kodagu)</option>
              <option value="munnar">Munnar</option>
              <option value="goa">Goa</option>
              <option value="kerala-backwaters">Alleppey</option>
              <option value="manali">Manali</option>
              <option value="jaipur">Jaipur</option>
              <option value="varanasi">Varanasi</option>
              <option value="ladakh">Ladakh</option>
            </select>
          </div>

          {/* Min Rating */}
          <div>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full bg-slate-800 text-white text-xs font-semibold p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
            >
              <option value={0}>Any Star Rating</option>
              <option value={4.5}>★ 4.5 & Above (Superb)</option>
              <option value={4.7}>★ 4.7 & Above (Luxury)</option>
              <option value={4.8}>★ 4.8 & Above (Exceptional)</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Max Nightly:</span>
              <span className="text-emerald-400 font-bold">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={2000}
              max={30000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>

        {/* Amenity chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Amenities:
          </span>
          {amenitiesList.map((amenity) => (
            <button
              key={amenity}
              onClick={() => setSelectedAmenity(amenity)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedAmenity === amenity
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/80'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel.id}
            id={`hotel-card-${hotel.id}`}
            className="group bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Hotel Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-xs font-bold text-amber-300 border border-slate-700 shadow-md">
                  ★ {hotel.rating} ({hotel.reviewsCount})
                </div>
                <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-slate-900/85 backdrop-blur-md text-[11px] font-semibold text-cyan-300 border border-cyan-500/30">
                  {hotel.destinationName}
                </div>
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                    {hotel.name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    {hotel.location}
                  </p>
                </div>

                <p className="text-xs text-slate-300 font-medium">
                  Room: {hotel.roomType}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hotel.amenities.slice(0, 3).map((amenity, aIdx) => (
                    <span
                      key={aIdx}
                      className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700"
                    >
                      ✓ {amenity}
                    </span>
                  ))}
                  {hotel.amenities.length > 3 && (
                    <span className="text-[10px] text-slate-400 px-1 py-0.5">
                      +{hotel.amenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom booking row */}
            <div className="p-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400">Starting from</p>
                <p className="text-base font-black text-emerald-400">
                  {formatPrice(hotel.pricePerNight)}
                  <span className="text-[10px] text-slate-400 font-normal"> /night</span>
                </p>
              </div>

              <button
                id={`book-hotel-btn-${hotel.id}`}
                onClick={() => {
                  setBookingHotel(hotel);
                  setBookingSuccessRef(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:opacity-95 shadow-md shadow-cyan-500/20 transition-all"
              >
                Instant Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Checkout Modal */}
      {bookingHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-5">
            {bookingSuccessRef ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Booking Confirmed!</h3>
                <p className="text-xs text-slate-300">
                  Your reservation at <strong>{bookingHotel.name}</strong> is locked with voucher{' '}
                  <span className="font-mono text-cyan-300 font-bold">{bookingSuccessRef}</span>.
                </p>
                <div className="p-4 rounded-2xl bg-slate-800 text-xs text-slate-300 space-y-1 text-left">
                  <p><strong>Dates:</strong> {checkInDate} to {checkOutDate} (3 Nights)</p>
                  <p><strong>Guests:</strong> {guestsCount} Adults</p>
                  <p><strong>Location:</strong> {bookingHotel.location}</p>
                </div>
                <button
                  onClick={() => setBookingHotel(null)}
                  className="w-full py-3 rounded-xl bg-cyan-500 text-white font-bold text-sm"
                >
                  Close & View in Dashboard
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">{bookingHotel.name}</h3>
                    <p className="text-xs text-cyan-400">{bookingHotel.location}</p>
                  </div>
                  <button
                    onClick={() => setBookingHotel(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-semibold">Check-in</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full bg-slate-800 p-2 rounded-xl text-white border border-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-semibold">Check-out</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-slate-800 p-2 rounded-xl text-white border border-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="text-slate-400 font-semibold">Number of Guests</label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full bg-slate-800 p-2.5 rounded-xl text-white border border-slate-700 font-semibold"
                  >
                    {[1, 2, 3, 4, 6].map((g) => (
                      <option key={g} value={g}>
                        {g} {g === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {user && user.loyaltyPoints > 0 && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-amber-300">
                      <Coins className="w-4 h-4" />
                      <span>Apply {user.loyaltyPoints} Loyalty Points (₹{user.loyaltyPoints} OFF)</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={useLoyaltyPoints}
                      onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                      className="w-4 h-4 accent-amber-500"
                    />
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Base Fare (3 Nights)</span>
                    <span>{formatPrice(bookingHotel.pricePerNight * 3)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Taxes & Eco Surcharge</span>
                    <span>{formatPrice(Math.round(bookingHotel.pricePerNight * 3 * 0.12))}</span>
                  </div>
                  {useLoyaltyPoints && user && (
                    <div className="flex justify-between text-amber-400 font-semibold">
                      <span>Loyalty Discount</span>
                      <span>-₹{user.loyaltyPoints}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-700 flex justify-between text-sm font-bold text-white">
                    <span>Total Amount</span>
                    <span className="text-emerald-400">
                      {formatPrice(
                        Math.max(
                          0,
                          Math.round(bookingHotel.pricePerNight * 3 * 1.12) -
                            (useLoyaltyPoints && user ? user.loyaltyPoints : 0)
                        )
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  disabled={isProcessingBooking}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:opacity-95"
                >
                  {isProcessingBooking ? 'Securing Reservation...' : 'Confirm & Reserve Voucher'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
