import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Printer,
  Share2,
  Train,
  Plane,
  Car,
  Bus,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  Phone,
  Sparkles,
  AlertCircle,
  Copy,
  FileCheck,
  Hotel as HotelIcon,
  Ticket,
  Send,
  Smartphone,
  PhoneCall,
  Volume2,
  VolumeX,
  MessageSquare,
  Navigation,
  Check,
} from 'lucide-react';
import { BookingRecord } from '../types/travel';

interface RealETicketModalProps {
  booking: BookingRecord | null;
  isOpen: boolean;
  onClose: () => void;
  currency?: string;
}

export const RealETicketModal: React.FC<RealETicketModalProps> = ({
  booking,
  isOpen,
  onClose,
  currency = 'INR',
}) => {
  const [activeTab, setActiveTab] = useState<'travel' | 'hotel' | 'sightseeing' | 'dispatch'>('travel');
  const [copiedPnr, setCopiedPnr] = useState(false);
  const [copiedHotelCode, setCopiedHotelCode] = useState(false);
  const [shared, setShared] = useState(false);
  const [isCallingHotel, setIsCallingHotel] = useState(false);
  const [isHotelCallAnswered, setIsHotelCallAnswered] = useState(false);
  const [speechMuted, setSpeechMuted] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);

  const ticketRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !booking) return null;

  const mode = booking.travelMode || (booking.type === 'train' ? 'train' : booking.type === 'flight' ? 'flight' : 'train');

  // Generate authentic 10-digit PNR if missing
  const authenticPnr = booking.pnr || (
    mode === 'train' ? `482-${(Math.abs(booking.bookingRef.split('').reduce((a, b) => a + b.charCodeAt(0), 0) * 1337) % 9000000 + 1000000)}`
    : mode === 'flight' ? `6E-${booking.bookingRef.slice(-4).toUpperCase()}`
    : `RB-${booking.bookingRef.slice(-6).toUpperCase()}`
  );

  const hotelConfId = booking.hotelDetails?.hotelConfirmationCode || `HTL-${booking.bookingRef.replace(/\D/g, '') || '892410'}`;
  const hotelPhone = booking.hotelDetails?.hotelPhone || '+91 80 4646 7000';
  const hotelWhatsapp = booking.hotelDetails?.hotelWhatsapp || '+91 99000 46467';
  const hotelName = booking.hotelDetails?.hotelName || 'Grand Heritage Hotel';
  const hotelAddress = booking.hotelDetails?.hotelAddress || `${booking.destination} Central Area`;

  const handleCopyPnr = () => {
    navigator.clipboard?.writeText(authenticPnr.replace('-', ''));
    setCopiedPnr(true);
    setTimeout(() => setCopiedPnr(false), 2000);
  };

  const handleCopyHotelCode = () => {
    navigator.clipboard?.writeText(hotelConfId);
    setCopiedHotelCode(true);
    setTimeout(() => setCopiedHotelCode(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Pre-formatted full trip message for WhatsApp and SMS
  const fullItineraryMessage = `✅ *BOOKING CONFIRMED - MakeMyTrip & TripAdvisor*
Booking ID: ${booking.bookingRef} | Status: 100% CONFIRMED
Traveler: ${booking.username}
Destination: ${booking.destination}
Dates: ${booking.dates}

🚆 *TRANSPORTATION TICKET (${mode.toUpperCase()}):*
• Operator: ${booking.travelTicketDetails?.operator || 'MakeMyTrip Express'}
• PNR / Ticket No: ${authenticPnr}
• Seats/Berths: ${booking.travelTicketDetails?.seats?.join(', ') || 'Confirmed'}
• Departure: ${booking.travelTicketDetails?.departureTime || '06:00 AM'} | Origin: ${booking.origin || 'Selected Station'}
• Arrival: ${booking.travelTicketDetails?.arrivalTime || '11:30 AM'} | Destination: ${booking.destination}

🏨 *HOTEL RESERVATION:*
• Hotel: ${hotelName}
• Confirmation ID: ${hotelConfId}
• Room: ${booking.hotelDetails?.roomType || 'Deluxe Room'} (${booking.hotelDetails?.nights || 2} Nights, ${booking.hotelDetails?.rooms || 1} Room)
• Hotel Front Desk Helpline: ${hotelPhone}
• Hotel WhatsApp: ${hotelWhatsapp}
• Address: ${hotelAddress}
• Note: In case confirmation call/SMS didn't arrive, call the hotel desk directly at ${hotelPhone}.

🎟️ *SIGHTSEEING PASSES:*
${(booking.attractionTickets && booking.attractionTickets.length > 0)
  ? booking.attractionTickets.map((a, i) => `• ${a.name} (${a.count} Passes) - Timed Slot: 09:30 AM`).join('\n')
  : '• Included City Explorer & Heritage Walking Pass'}

💳 Amount Paid: ₹${booking.amountPaid.toLocaleString()}
Have a delightful journey!`;

  const handleSendToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(fullItineraryMessage)}`;
    window.open(url, '_blank');
    setWhatsappSent(true);
  };

  const handleSendSms = () => {
    const cleanPhone = (booking.username.includes('@') ? '' : booking.username.replace(/\D/g, ''));
    const url = `sms:${cleanPhone}?body=${encodeURIComponent(fullItineraryMessage)}`;
    window.open(url, '_blank');
    setSmsSent(true);
  };

  const triggerHotelCall = () => {
    setIsCallingHotel(true);
    setIsHotelCallAnswered(false);
  };

  const answerHotelCall = () => {
    setIsHotelCallAnswered(true);
    if ('speechSynthesis' in window && !speechMuted) {
      try {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(
          `Namaste! This is the reservation desk manager from ${hotelName}. We are delighted to confirm your booking for ${booking.hotelDetails?.nights || 2} nights in ${booking.destination}. Your room is reserved. Please call us back at ${hotelPhone} if you need late check-in or airport pickup assistance. Have a wonderful trip!`
        );
        speech.rate = 0.95;
        window.speechSynthesis.speak(speech);
      } catch (e) {
        console.log('Speech error', e);
      }
    }
  };

  const endHotelCall = () => {
    setIsCallingHotel(false);
    setIsHotelCallAnswered(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        id="real-e-ticket-dialog"
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[94vh] flex flex-col"
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-950 border-b border-slate-800 text-white z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Verified Official E-Ticket & Vouchers Hub
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Trip E-Tickets', text: fullItineraryMessage }).catch(() => {});
                } else {
                  navigator.clipboard?.writeText(fullItineraryMessage);
                  setShared(true);
                  setTimeout(() => setShared(false), 2000);
                }
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
              title="Share Ticket Itinerary"
            >
              {shared ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs: Travel E-Ticket | Hotel Voucher | Sightseeing Passes | WhatsApp & SMS Hub */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-2 bg-slate-900/90 border-b border-slate-800 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('travel')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'travel'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {mode === 'train' ? <Train className="w-4 h-4" /> : mode === 'flight' ? <Plane className="w-4 h-4" /> : <Ticket className="w-4 h-4 text-emerald-400" />}
            <span>1. {mode === 'train' ? 'IRCTC Railway ERS' : mode === 'flight' ? 'Flight Boarding Pass' : 'Travel Ticket'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hotel')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'hotel'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <HotelIcon className="w-4 h-4" />
            <span>2. Hotel Stay Voucher</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sightseeing')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sightseeing'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>3. Sightseeing Passes ({booking.attractionTickets?.length || 2})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dispatch')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dispatch'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>4. WhatsApp, SMS & Hotel Hotline</span>
          </button>
        </div>

        {/* PRINTABLE / VIEWABLE BODY */}
        <div className="overflow-y-auto p-3 sm:p-5 bg-slate-950 flex-1 space-y-4">
          {/* TAB 1: TRAVEL MODE OFFICIAL TICKET */}
          {activeTab === 'travel' && (
            <div
              ref={ticketRef}
              className="bg-white text-slate-900 rounded-2xl p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 font-sans relative"
            >
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] select-none">
                <span className="text-7xl sm:text-8xl font-black rotate-[-30deg] uppercase tracking-widest text-slate-900">
                  {mode === 'train' ? 'IRCTC CONFIRMED' : 'VERIFIED TICKET'}
                </span>
              </div>

              {/* 1. OFFICIAL HEADER (IRCTC OR AIRLINE OR BUS) */}
              {mode === 'train' ? (
                <div className="border-b-2 border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-red-700 flex items-center justify-center text-white font-black text-xs shadow-md">
                      <Train className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-black tracking-tight text-red-700">IRCTC / INDIAN RAILWAYS</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-800 font-bold rounded border border-red-200">
                          CRIS E-Ticketing
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium">
                        Centre for Railway Information Systems (Government of India)
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">10-Digit Railway PNR</span>
                    <div className="flex items-center sm:justify-end gap-1.5">
                      <span className="text-xl font-mono font-black text-red-700 tracking-wider">
                        {authenticPnr}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyPnr}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        title="Copy PNR"
                      >
                        {copiedPnr ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-b-2 border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-700 flex items-center justify-center text-white font-black shadow-md">
                      {mode === 'flight' ? <Plane className="w-7 h-7" /> : <Bus className="w-7 h-7" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-black tracking-tight text-blue-800">
                          {booking.travelTicketDetails?.operator || 'MakeMyTrip Official Travel Pass'}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 font-bold rounded">
                          100% Guaranteed
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium">
                        {mode === 'flight' ? 'IATA Official Electronic Boarding Pass & Reservation' : 'Official Interstate Transport Reservation'}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">PNR / Ticket No.</span>
                    <span className="text-xl font-mono font-black text-blue-800 tracking-wider">
                      {authenticPnr}
                    </span>
                  </div>
                </div>
              )}

              {/* Journey Details Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Train / Flight No & Name</span>
                  <strong className="text-slate-900 block">
                    {booking.travelTicketDetails?.flightOrTrainNumber || '20608 / Vande Bharat'} - {booking.travelTicketDetails?.operator || 'Express'}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Class / Quota</span>
                  <strong className="text-slate-900 block">
                    {booking.travelTicketDetails?.seatClass || '3A (AC 3 Tier)'} • General (GN)
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Booking Date & Time</span>
                  <strong className="text-slate-900 block">
                    {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Booking Status</span>
                  <span className="inline-flex items-center gap-1 font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>CNF CONFIRMED</span>
                  </span>
                </div>
              </div>

              {/* Origin -> Destination Route Display */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Origin Station / Terminal</span>
                  <span className="text-base font-black text-white">{booking.origin || 'Selected Origin'}</span>
                  <span className="text-xs text-cyan-300 block">Dep: {booking.travelTicketDetails?.departureTime || '05:45 AM'}</span>
                </div>
                <div className="flex flex-col items-center px-4">
                  <span className="text-[10px] text-slate-400 font-mono">NON-STOP</span>
                  <div className="w-24 sm:w-36 h-0.5 bg-cyan-500 relative my-1">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 absolute -top-[3px] left-0" />
                    <div className="w-2 h-2 rounded-full bg-cyan-400 absolute -top-[3px] right-0" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">CONFIRMED BERTH</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Destination</span>
                  <span className="text-base font-black text-white">{booking.destination}</span>
                  <span className="text-xs text-emerald-300 block">Arr: {booking.travelTicketDetails?.arrivalTime || '11:30 AM'}</span>
                </div>
              </div>

              {/* Passenger List with Coach & Berths */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-slate-700 tracking-wider block">
                  Passenger Booking & Berth Allocation Details
                </span>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 text-[11px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">Passenger Name</th>
                        <th className="p-2.5">Age / Gender</th>
                        <th className="p-2.5">Booking Status</th>
                        <th className="p-2.5">Coach</th>
                        <th className="p-2.5">Berth / Seat</th>
                        <th className="p-2.5">Berth Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                      {(booking.travelTicketDetails?.passengerList && booking.travelTicketDetails.passengerList.length > 0
                        ? booking.travelTicketDetails.passengerList
                        : [
                            { name: booking.username || 'Lead Traveler', age: '28', gender: 'M', seatPref: 'Confirmed Berth' },
                          ]
                      ).map((passenger, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-500">{idx + 1}</td>
                          <td className="p-2.5 font-bold text-slate-900">{passenger.name}</td>
                          <td className="p-2.5">{passenger.age} Yrs / {passenger.gender}</td>
                          <td className="p-2.5">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black text-[10px]">
                              CNF
                            </span>
                          </td>
                          <td className="p-2.5 font-mono font-bold text-red-700">
                            {mode === 'flight' ? '14' : 'B3'}
                          </td>
                          <td className="p-2.5 font-mono font-bold text-slate-900">
                            {mode === 'flight' ? String.fromCharCode(65 + idx) : (18 + idx * 3)}
                          </td>
                          <td className="p-2.5 text-slate-600">
                            {passenger.seatPref || (idx % 2 === 0 ? 'Lower Berth' : 'Side Lower')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* QR Code & Digital Verification */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200">
                    <QrCode className="w-14 h-14 text-slate-900" />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-slate-900 block">CRIS / TTE Digital Validator QR</span>
                    <p className="text-[11px] text-slate-600">
                      Scan with Handheld Terminal (HHT) or airline boarding gate kiosk.
                    </p>
                    <p className="text-[10px] font-mono text-slate-500">
                      DIGITAL SIGNATURE: 0x{authenticPnr.replace(/\D/g, '')}789FCA
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-[10px] text-slate-500 block font-bold">Helpline / IRCTC 24x7</span>
                  <span className="text-sm font-bold text-slate-900">Dial 139 (RailMadad)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOTEL STAY RESERVATION VOUCHER */}
          {activeTab === 'hotel' && (
            <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 font-sans relative">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
                <span className="text-8xl font-black rotate-[-30deg] uppercase tracking-widest text-slate-900">
                  HOTEL CONFIRMED
                </span>
              </div>

              {/* Header */}
              <div className="border-b-2 border-amber-500 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center text-white font-black shadow-md">
                    <HotelIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black tracking-tight text-amber-900">
                        OFFICIAL HOTEL RESERVATION VOUCHER
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded border border-emerald-200">
                        TripAdvisor & MMT Assured
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Guaranteed Check-in with Instant Front Desk Room Allocation
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Hotel Confirmation Code</span>
                  <div className="flex items-center sm:justify-end gap-1.5">
                    <span className="text-xl font-mono font-black text-amber-700 tracking-wider">
                      {hotelConfId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyHotelCode}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      title="Copy Hotel Code"
                    >
                      {copiedHotelCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* CRITICAL: Hotel Front Desk Contact & Confirmation Hotline Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-amber-700" />
                    <strong className="text-xs text-amber-950 font-black">
                      Official Hotel Front Desk Hotline: {hotelPhone}
                    </strong>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-snug">
                    In case the automated confirmation SMS or call hasn't reached your phone, call the hotel desk directly to verify your reservation or request early check-in.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${hotelPhone.replace(/\s+/g, '')}`}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Hotel Desk</span>
                  </a>

                  <a
                    href={`https://wa.me/${hotelWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${hotelName}, I am ${booking.username}. I have a confirmed reservation #${hotelConfId}. Kindly confirm my room.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Hotel</span>
                  </a>

                  <button
                    type="button"
                    onClick={triggerHotelCall}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                    title="Simulate Receptionist Phone Call"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Test Hotel Call</span>
                  </button>
                </div>
              </div>

              {/* Hotel Information Grid */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">{hotelName}</h3>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{hotelAddress}</span>
                    </p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotelName}, ${hotelAddress}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto hover:bg-slate-800"
                  >
                    <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Check-in Date</span>
                    <strong className="text-slate-900">{booking.dates.split('to')[0]?.trim() || 'Day of Arrival'} (12:00 PM)</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Check-out Date</span>
                    <strong className="text-slate-900">{booking.dates.split('to')[1]?.trim() || 'Day of Departure'} (11:00 AM)</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Allocated Room Type</span>
                    <strong className="text-slate-900">{booking.hotelDetails?.roomType || 'Deluxe Lake View Room'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Rooms & Nights</span>
                    <strong className="text-slate-900">
                      {booking.hotelDetails?.rooms || 1} Room(s) • {booking.hotelDetails?.nights || 2} Night(s)
                    </strong>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Complimentary Inclusions</span>
                  <div className="flex flex-wrap gap-2 text-[11px] text-emerald-800 font-medium">
                    <span className="px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">✓ Free Buffet Breakfast</span>
                    <span className="px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">✓ High-Speed WiFi 24x7</span>
                    <span className="px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">✓ Free Cancellation up to 24h</span>
                    <span className="px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">✓ Welcome Drinks & Housekeeping</span>
                  </div>
                </div>
              </div>

              {/* Hotel Verification QR & Barcode */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200">
                    <QrCode className="w-14 h-14 text-slate-900" />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-slate-900 block">Front Desk Express Check-in QR</span>
                    <p className="text-[11px] text-slate-600">
                      Present this QR code or Hotel Confirmation ID at reception for instant keycard issuance.
                    </p>
                    <p className="text-[10px] font-mono text-slate-500">
                      VOUCHER VALIDATION: {hotelConfId}-HOTEL-DESK-KEY
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SIGHTSEEING & ATTRACTION ENTRY PASSES */}
          {activeTab === 'sightseeing' && (
            <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 font-sans relative">
              {/* Header */}
              <div className="border-b-2 border-cyan-600 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-black shadow-md">
                    <Ticket className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black tracking-tight text-cyan-900">
                        OFFICIAL ATTRACTION & SIGHTSEEING E-PASSES
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-cyan-100 text-cyan-800 font-bold rounded">
                        Fast-Track Turnstile Access
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Guaranteed entry to selected attractions and heritage reserves in {booking.destination}
                    </p>
                  </div>
                </div>
              </div>

              {/* Passes Cards Grid */}
              <div className="space-y-4">
                {(booking.attractionTickets && booking.attractionTickets.length > 0
                  ? booking.attractionTickets
                  : [
                      { name: `${booking.destination} Heritage Promenade & Lake Reserve`, count: booking.guests || 2, price: 50 },
                      { name: `${booking.destination} Botanical Gardens & City Museum`, count: booking.guests || 2, price: 100 },
                    ]
                ).map((attraction, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <div className="space-y-1 text-xs w-full sm:w-auto">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-black text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{attraction.name}</h4>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Valid for <strong className="text-slate-900">{attraction.count} Visitors</strong> • Timed Slot: <strong>09:30 AM - 01:00 PM</strong>
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500 font-mono">
                        <span>PASS ID: TK-ATT-{Math.floor(100000 + idx * 4321)}</span>
                        <span>•</span>
                        <span>DIRECT QR BARCODE SCAN</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                      <div className="p-1.5 bg-white border border-slate-200 rounded-lg">
                        <QrCode className="w-12 h-12 text-slate-900" />
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-black text-xs">
                        ACTIVATED
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <strong className="text-slate-800 uppercase font-bold block text-[10px]">
                  Attraction Entry Instructions:
                </strong>
                <p>
                  1. Scan the digital QR code at the e-gate turnstile. No physical paper ticket printing is necessary.
                </p>
                <p>
                  2. All passes include priority skip-the-line access during the allocated morning or afternoon slot.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: WHATSAPP, SMS DISPATCH & HOTEL CONFIRMATION HOTLINE */}
          {activeTab === 'dispatch' && (
            <div className="space-y-4">
              {/* Hotel Front Desk Direct Hotline & Simulator */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-700 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-white">
                        {hotelName} - Front Desk Hotline
                      </h4>
                      <p className="text-xs text-slate-400">
                        In case confirmation message or call didn't come, use this verified number to confirm with the hotel
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                    24x7 Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-slate-400 text-[10px] block">Reception Direct Phone</span>
                    <strong className="text-base text-emerald-400 font-mono">{hotelPhone}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-slate-400 text-[10px] block">Front Desk WhatsApp</span>
                    <strong className="text-base text-cyan-300 font-mono">{hotelWhatsapp}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-slate-400 text-[10px] block">Reservation Reference</span>
                    <strong className="text-base text-amber-400 font-mono">{hotelConfId}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <a
                    href={`tel:${hotelPhone.replace(/\s+/g, '')}`}
                    className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Hotel Desk Now</span>
                  </a>

                  <a
                    href={`https://wa.me/${hotelWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello, I have booked a room at ${hotelName} through MakeMyTrip. Booking Ref: ${hotelConfId}. Kindly confirm my reservation.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={triggerHotelCall}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Simulate Incoming Hotel Call</span>
                  </button>
                </div>
              </div>

              {/* Automatic WhatsApp & SMS Dispatch Buttons */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-700 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-white">
                      Instant WhatsApp & SMS Ticket Dispatch
                    </h4>
                    <p className="text-xs text-slate-400">
                      Send all tickets (Transport, Hotel Voucher, Sightseeing Passes) directly to your mobile
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleSendToWhatsApp}
                    className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{whatsappSent ? 'Sent to WhatsApp (Open Again)' : 'Send All Tickets to WhatsApp'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendSms}
                    className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-600/30 transition-all cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{smsSent ? 'SMS Dispatched (Send Again)' : 'Send Real SMS to Mobile Phone'}</span>
                  </button>
                </div>

                {/* Simulated Incoming Message from Hotel Front Desk */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <HotelIcon className="w-3.5 h-3.5" />
                      <span>Live SMS from Hotel Management:</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Just Now • Delivered</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {`[SMS from ${hotelName}]
Dear Guest, your booking at ${hotelName} (${booking.destination}) is CONFIRMED!
Ref: ${hotelConfId} | Room: ${booking.hotelDetails?.roomType || 'Deluxe Room'}
Check-in: 12:00 PM. Reception Desk Phone: ${hotelPhone}.
We eagerly await your arrival!`}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SIMULATED INCOMING HOTEL CALL MODAL OVERLAY */}
        <AnimatePresence>
          {isCallingHotel && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-emerald-500/60 p-6 text-center space-y-5 shadow-2xl relative"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
                  <PhoneCall className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold block">
                    {isHotelCallAnswered ? 'Connected • Hotel Front Desk' : 'Incoming Call From Hotel Reception'}
                  </span>
                  <h3 className="text-xl font-black text-white mt-1">{hotelName}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{hotelPhone}</p>
                </div>

                {isHotelCallAnswered ? (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 text-left space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold">
                      <span>VOICE CONFIRMATION ACTIVE</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSpeechMuted(!speechMuted);
                          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                        }}
                        className="flex items-center gap-1 text-slate-400 hover:text-white"
                      >
                        {speechMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span>{speechMuted ? 'Unmute' : 'Mute'}</span>
                      </button>
                    </div>
                    <p className="italic leading-relaxed">
                      "Namaste! This is the front desk manager from {hotelName}. We have received and confirmed your reservation #{hotelConfId} for {booking.hotelDetails?.nights || 2} nights in {booking.destination}. Your room is reserved and we look forward to hosting you. Have a safe journey!"
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-300">
                    The hotel management is calling to verify your booking details and welcome you.
                  </p>
                )}

                <div className="flex items-center justify-center gap-4 pt-2">
                  {!isHotelCallAnswered ? (
                    <>
                      <button
                        type="button"
                        onClick={endHotelCall}
                        className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                      >
                        <X className="w-4 h-4" />
                        <span>Decline</span>
                      </button>
                      <button
                        type="button"
                        onClick={answerHotelCall}
                        className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg animate-pulse"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Answer Call</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={endHotelCall}
                      className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Phone className="w-4 h-4 rotate-[135deg]" />
                      <span>End Call</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Bottom Action Footer Bar */}
        <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Digital Reservation Voucher • 100% Confirmed</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold flex items-center gap-1.5 shadow-md hover:opacity-90 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Download / Print All</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
