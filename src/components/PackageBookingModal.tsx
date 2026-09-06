import React, { useState } from 'react';
import {
  X,
  Calendar,
  Users,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  QrCode,
  Coins,
  Percent,
  MapPin,
  Clock,
  Car,
  Utensils,
  ChevronRight,
  Download,
  Printer,
  HeartHandshake,
  AlertCircle,
} from 'lucide-react';
import { HolidayPackage, BookingRecord, UserProfile } from '../types/travel';

interface PackageBookingModalProps {
  pkg: HolidayPackage;
  user: UserProfile | null;
  currency: 'INR' | 'USD' | 'EUR';
  onClose: () => void;
  onBookingSuccess: (booking: BookingRecord, pointsEarned: number) => void;
}

export const PackageBookingModal: React.FC<PackageBookingModalProps> = ({
  pkg,
  user,
  currency,
  onClose,
  onBookingSuccess,
}) => {
  const [step, setStep] = useState<'customize' | 'travelers' | 'payment' | 'confirmed'>('customize');
  const [selectedDate, setSelectedDate] = useState<string>(pkg.availableDates[0] || '2026-09-15');
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [hotelTier, setHotelTier] = useState<'standard' | 'luxury'>('standard');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [pickupCity, setPickupCity] = useState<string>('');

  // Traveler Details
  const [travelerName, setTravelerName] = useState<string>(user?.fullName || '');
  const [travelerPhone, setTravelerPhone] = useState<string>(user?.phone || '+91 98765 43210');
  const [travelerEmail, setTravelerEmail] = useState<string>(user?.email || 'traveler@example.com');
  const [specialRequest, setSpecialRequest] = useState<string>('');

  // Payment & Discounts
  const [promoInput, setPromoInput] = useState<string>('HOLIDAY2026');
  const [appliedPromo, setAppliedPromo] = useState<string>('HOLIDAY2026');
  const [promoMessage, setPromoMessage] = useState<string>('10% Early Bird Discount Applied!');
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'AdvanceToken'>('UPI');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [earnedPoints, setEarnedPoints] = useState<number>(0);

  // Currency Formatter
  const formatCurrency = (inr: number) => {
    if (currency === 'USD') return `$${Math.round(inr / 83)}`;
    if (currency === 'EUR') return `€${Math.round(inr / 90)}`;
    return `₹${inr.toLocaleString('en-IN')}`;
  };

  // Pricing calculations
  const baseRate = hotelTier === 'luxury' ? pkg.pricePerPerson + 4000 : pkg.pricePerPerson;
  const travelersCost = baseRate * adults + baseRate * children * 0.7;

  const addonsCost = selectedAddons.reduce((sum, addonId) => {
    const item = pkg.customizableAddons.find((a) => a.id === addonId);
    return sum + (item ? item.price : 0);
  }, 0);

  const rawTotal = travelersCost + addonsCost;

  let promoDiscount = 0;
  if (appliedPromo === 'MGTRAVELS500') promoDiscount = 500;
  if (appliedPromo === 'HOLIDAY2026') promoDiscount = Math.round(rawTotal * 0.1);
  if (appliedPromo === 'EARLYBIRD10') promoDiscount = Math.round(rawTotal * 0.1);

  const availableUserPoints = user?.loyaltyPoints || 500;
  const maxRedeemablePoints = Math.min(availableUserPoints, Math.round(rawTotal * 0.15));
  const loyaltyDiscount = useLoyaltyPoints ? maxRedeemablePoints : 0;

  const finalPayable = Math.max(1000, Math.round(rawTotal - promoDiscount - loyaltyDiscount));
  const advanceTokenAmount = Math.round(finalPayable * 0.2); // 20% token payment

  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter((id) => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'MGTRAVELS500') {
      setAppliedPromo(code);
      setPromoMessage('Flat ₹500 discount successfully applied!');
    } else if (code === 'HOLIDAY2026' || code === 'EARLYBIRD10') {
      setAppliedPromo(code);
      setPromoMessage('10% Season Promo discount applied!');
    } else {
      setAppliedPromo('');
      setPromoMessage('Invalid promo code. Try MGTRAVELS500 or HOLIDAY2026');
    }
  };

  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/packages/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: pkg.id,
          username: user?.email || 'moksgnateja@gmail.com',
          travelerName,
          travelerPhone,
          travelerEmail,
          travelDate: selectedDate,
          adults,
          children,
          hotelTier,
          selectedAddonIds: selectedAddons,
          pickupLocation: pickupCity || pkg.pickupDropLocation,
          specialRequests: specialRequest,
          paymentMethod: paymentMethod === 'AdvanceToken' ? '20% Advance Token Booking' : paymentMethod,
          loyaltyPointsRedeemed: loyaltyDiscount,
          promoCode: appliedPromo,
        }),
      });

      const data = await response.json();
      if (data.success && data.booking) {
        setConfirmedBooking(data.booking);
        setEarnedPoints(data.pointsEarned || Math.round(finalPayable * 0.05));
        setStep('confirmed');
        onBookingSuccess(data.booking, data.pointsEarned || Math.round(finalPayable * 0.05));
      } else {
        alert(data.message || 'Booking failed');
      }
    } catch (err) {
      console.error('Booking failed:', err);
      // Fallback local booking
      const fallbackBooking: BookingRecord = {
        id: `bk-${Date.now()}`,
        bookingRef: `MGT-PKG-${Math.floor(10000 + Math.random() * 90000)}`,
        username: user?.email || 'moksgnateja@gmail.com',
        type: 'package',
        title: pkg.title,
        destination: pkg.destinationName,
        dates: `${selectedDate} (${pkg.durationDays}D / ${pkg.durationNights}N)`,
        guests: adults + children,
        amountPaid: finalPayable,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
        details: `${pkg.durationDays}D/${pkg.durationNights}N package reserved. Primary Traveler: ${travelerName}`,
      };
      setConfirmedBooking(fallbackBooking);
      setEarnedPoints(Math.round(finalPayable * 0.05));
      setStep('confirmed');
      onBookingSuccess(fallbackBooking, Math.round(finalPayable * 0.05));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-100 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-b border-slate-800 flex items-start justify-between">
          <div className="flex-1 pr-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {pkg.theme}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Package
              </span>
              {pkg.badge && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ★ {pkg.badge}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {pkg.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-slate-400">
              <span className="flex items-center gap-1 text-cyan-300 font-medium">
                <MapPin className="w-4 h-4 text-cyan-400" /> {pkg.destinationName}, {pkg.state}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-400" /> {pkg.durationDays} Days / {pkg.durationNights} Nights
              </span>
              <span className="text-emerald-400 font-semibold">
                ★ {pkg.rating} ({pkg.reviewsCount} verified reviews)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        {step !== 'confirmed' && (
          <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between text-xs sm:text-sm">
            <button
              onClick={() => setStep('customize')}
              className={`flex items-center gap-2 font-semibold ${
                step === 'customize' ? 'text-cyan-400' : 'text-slate-400'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === 'customize' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                1
              </span>
              <span>Customize Package</span>
            </button>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <button
              onClick={() => setStep('travelers')}
              className={`flex items-center gap-2 font-semibold ${
                step === 'travelers' ? 'text-cyan-400' : 'text-slate-400'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === 'travelers' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                2
              </span>
              <span>Traveler Info</span>
            </button>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <button
              onClick={() => setStep('payment')}
              className={`flex items-center gap-2 font-semibold ${
                step === 'payment' ? 'text-cyan-400' : 'text-slate-400'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === 'payment' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                3
              </span>
              <span>Payment & Perks</span>
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* STEP 1: CUSTOMIZE */}
          {step === 'customize' && (
            <div className="space-y-6">
              {/* Date & Traveler Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-cyan-400" /> Select Travel Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-cyan-500"
                  >
                    {pkg.availableDates.map((d) => (
                      <option key={d} value={d}>
                        {d} (Instant Confirmation Available)
                      </option>
                    ))}
                    <option value="Custom Flexible Dates">Custom Date (On Request)</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-cyan-400" /> Number of Travelers
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center justify-between bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5">
                      <span className="text-xs text-slate-300">Adults (12+ yrs)</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-cyan-300">{adults}</span>
                        <button
                          type="button"
                          onClick={() => setAdults(adults + 1)}
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 flex items-center justify-between bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5">
                      <span className="text-xs text-slate-300">Kids (3-11 yrs)</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-cyan-300">{children}</span>
                        <button
                          type="button"
                          onClick={() => setChildren(children + 1)}
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hotel Tier Selection */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-cyan-400" /> Accommodation Category
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setHotelTier('standard')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      hotelTier === 'standard'
                        ? 'bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white text-sm">4-Star Deluxe Resort / Hotel</span>
                      <span className="text-xs font-bold text-emerald-400">Included</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Scenic Deluxe Room with private balcony, swimming pool access, buffet breakfast & dinner.
                    </p>
                  </div>

                  <div
                    onClick={() => setHotelTier('luxury')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      hotelTier === 'luxury'
                        ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-amber-200 text-sm">5-Star Luxury Heritage Villa / Suite</span>
                      <span className="text-xs font-bold text-amber-300">+ {formatCurrency(4000)} / person</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Private pool villa or lake-view suite, Butler service, complimentary high tea & spa credit.
                    </p>
                  </div>
                </div>
              </div>

              {/* Customizable Add-on Experiences */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Recommended Add-ons & Upgrades
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkg.customizableAddons.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                          isChecked
                            ? 'bg-cyan-950/40 border-cyan-500'
                            : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 w-4 h-4 text-cyan-500 rounded bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-white">{addon.name}</span>
                            <span className="text-xs font-extrabold text-cyan-300">
                              + {formatCurrency(addon.price)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{addon.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Day-Wise Itinerary Preview Accordion */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-400" /> Included Day-Wise Itinerary Highlights
                </h4>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {pkg.dayWiseSchedule.map((day) => (
                    <div
                      key={day.day}
                      className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-cyan-300">
                        <span>Day {day.day}: {day.title}</span>
                        <span className="text-[10px] text-emerald-400 font-medium">
                          Meals: {day.mealsIncluded.join(', ')}
                        </span>
                      </div>
                      <p className="text-slate-300">{day.summary}</p>
                      <p className="text-[11px] text-slate-400">
                        <strong className="text-slate-300">Stay:</strong> {day.stayHotel}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TRAVELER INFO */}
          {step === 'travelers' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-cyan-400 shrink-0" />
                <span>
                  Please enter traveler details exactly as shown on government IDs (Aadhaar/Passport). We will
                  issue the travel voucher to this primary contact.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Primary Traveler Full Name *</label>
                  <input
                    type="text"
                    value={travelerName}
                    onChange={(e) => setTravelerName(e.target.value)}
                    placeholder="e.g. Mokshagna Teja"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Mobile Phone (for WhatsApp Voucher) *</label>
                  <input
                    type="tel"
                    value={travelerPhone}
                    onChange={(e) => setTravelerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Email Address (for PDF Itinerary) *</label>
                  <input
                    type="email"
                    value={travelerEmail}
                    onChange={(e) => setTravelerEmail(e.target.value)}
                    placeholder="traveler@example.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Preferred Pickup Point / Airport</label>
                  <input
                    type="text"
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    placeholder={pkg.pickupDropLocation}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Special Requests / Dietary Preferences</label>
                <textarea
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="e.g. Jain / Vegetarian food, ground-floor room, anniversary surprise cake, baby cot..."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT & DISCOUNTS */}
          {step === 'payment' && (
            <div className="space-y-6">
              {/* Promo Code & Loyalty Points Bar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Promo Code Box */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-emerald-400" /> Have a Promo Code?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="e.g. HOLIDAY2026"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white uppercase focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold hover:opacity-90 transition-all"
                    >
                      Apply
                    </button>
                  </div>
                  {promoMessage && (
                    <p
                      className={`text-[11px] font-medium ${
                        appliedPromo ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {promoMessage}
                    </p>
                  )}
                </div>

                {/* Loyalty Points Redemption Box */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-amber-400" /> Redeem Loyalty Points
                    </label>
                    <span className="text-xs font-bold text-amber-300">
                      Balance: {availableUserPoints} pts
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-xl p-3">
                    <div className="text-xs">
                      <p className="font-semibold text-white">Redeem {maxRedeemablePoints} Points</p>
                      <p className="text-[11px] text-slate-400">Save {formatCurrency(maxRedeemablePoints)} immediately</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUseLoyaltyPoints(!useLoyaltyPoints)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        useLoyaltyPoints
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {useLoyaltyPoints ? 'Applied ✓' : 'Use Points'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-cyan-400" /> Choose Payment Option
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                      paymentMethod === 'UPI'
                        ? 'bg-cyan-950/40 border-cyan-500'
                        : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <QrCode className="w-6 h-6 text-cyan-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Instant UPI / QR Code</p>
                      <p className="text-[11px] text-slate-400">Google Pay, PhonePe, Paytm QR</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                      paymentMethod === 'Card'
                        ? 'bg-cyan-950/40 border-cyan-500'
                        : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-indigo-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Credit / Debit Card</p>
                      <p className="text-[11px] text-slate-400">Visa, Mastercard, RuPay with 0% EMI</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('AdvanceToken')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                      paymentMethod === 'AdvanceToken'
                        ? 'bg-emerald-950/40 border-emerald-500'
                        : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <HeartHandshake className="w-6 h-6 text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-emerald-300">20% Advance Token Booking</p>
                      <p className="text-[11px] text-slate-400">
                        Pay {formatCurrency(advanceTokenAmount)} now, balance on arrival
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('NetBanking')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                      paymentMethod === 'NetBanking'
                        ? 'bg-cyan-950/40 border-cyan-500'
                        : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <ShieldCheck className="w-6 h-6 text-teal-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Net Banking</p>
                      <p className="text-[11px] text-slate-400">All major Indian banks supported</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown Bill */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Base Package ({adults} Adults, {children} Kids)</span>
                  <span>{formatCurrency(travelersCost)}</span>
                </div>
                {addonsCost > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Selected Addons ({selectedAddons.length})</span>
                    <span>+{formatCurrency(addonsCost)}</span>
                  </div>
                )}
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promo Discount ({appliedPromo})</span>
                    <span>-{formatCurrency(promoDiscount)}</span>
                  </div>
                )}
                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Loyalty Points Discount</span>
                    <span>-{formatCurrency(loyaltyDiscount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                  <span>Total Amount Payable</span>
                  <span className="text-base text-cyan-300">
                    {paymentMethod === 'AdvanceToken' ? (
                      <>
                        {formatCurrency(advanceTokenAmount)}{' '}
                        <span className="text-xs font-normal text-slate-400">
                          (Token 20% of {formatCurrency(finalPayable)})
                        </span>
                      </>
                    ) : (
                      formatCurrency(finalPayable)
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMED VOUCHER */}
          {step === 'confirmed' && confirmedBooking && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Payment & Reservation Successful
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">Package Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Booking Reference: <strong className="text-cyan-300 font-mono text-sm">{confirmedBooking.bookingRef}</strong>
                </p>
              </div>

              {/* Printable Voucher Card */}
              <div className="max-w-xl mx-auto p-6 rounded-3xl bg-slate-950 border border-cyan-500/30 text-left space-y-4 shadow-xl">
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-white text-base">{pkg.title}</h4>
                    <p className="text-xs text-cyan-300">{pkg.destinationName} | {pkg.durationDays}D / {pkg.durationNights}N</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Travel Date</span>
                    <p className="font-semibold text-slate-200">{selectedDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Guests</span>
                    <p className="font-semibold text-slate-200">{adults} Adults, {children} Kids</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Lead Traveler</span>
                    <p className="font-semibold text-slate-200">{travelerName || 'Primary Traveler'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Amount Paid</span>
                    <p className="font-bold text-emerald-400">{formatCurrency(confirmedBooking.amountPaid)}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  <p className="font-semibold text-white mb-1">Includes:</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                    <li>{pkg.hotelStarRating}-Star Accommodation & Daily Buffet Meals</li>
                    <li>Private AC Transport with dedicated chauffeur</li>
                    <li>All Entry passes & Guided plantation/monument walks</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                  <Coins className="w-5 h-5 shrink-0" />
                  <span>
                    Congratulations! You earned <strong className="text-white">+{earnedPoints} MG Loyalty Points</strong> on this reservation!
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                >
                  <Printer className="w-4 h-4" /> Print Voucher
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold hover:opacity-90 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  View in My Bookings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step !== 'confirmed' && (
          <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Total Package Cost</span>
              <span className="text-lg sm:text-xl font-extrabold text-cyan-300">
                {formatCurrency(finalPayable)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {step !== 'customize' && (
                <button
                  type="button"
                  onClick={() => setStep(step === 'payment' ? 'travelers' : 'customize')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                >
                  Back
                </button>
              )}

              {step === 'customize' && (
                <button
                  type="button"
                  onClick={() => setStep('travelers')}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs sm:text-sm font-bold hover:opacity-90 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <span>Proceed to Traveler Info</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {step === 'travelers' && (
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs sm:text-sm font-bold hover:opacity-90 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <span>Proceed to Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {step === 'payment' && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmBooking}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs sm:text-sm font-extrabold hover:opacity-95 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Confirming...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Pay {formatCurrency(paymentMethod === 'AdvanceToken' ? advanceTokenAmount : finalPayable)}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
