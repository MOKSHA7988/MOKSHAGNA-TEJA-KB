import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plane,
  Train,
  Car,
  Bus,
  Hotel as HotelIcon,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  CreditCard,
  QrCode,
  Download,
  Printer,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Tag,
  Percent,
  Coins,
  AlertCircle,
  Luggage,
  Coffee,
  Wifi,
  Compass,
  Check,
  Smartphone,
  Building2,
  Lock,
  Shield,
  Wallet,
  ArrowRight,
  Edit3,
  Copy,
  RefreshCw,
  Search,
  Navigation,
  ChevronDown,
  AlertTriangle,
  Sliders,
  Filter,
  ArrowUpDown,
  PhoneCall,
  Phone,
  MessageSquare,
  Send,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Destination, Hotel, BookingRecord, UserProfile } from '../types/travel';
import { HOTELS_DATABASE, INITIAL_DESTINATIONS } from '../data/travelDatabase';
import { computeRealTimeTransitCost, MultiModalTransitResult, COMMON_ORIGINS } from '../utils/transitPricing';
import confetti from 'canvas-confetti';
import { RealETicketModal } from './RealETicketModal';

interface TripBookingModalProps {
  destination: Destination;
  allDestinations?: Destination[];
  isOpen?: boolean;
  initialStep?: number;
  initialTravelMode?: 'flight' | 'train' | 'car' | 'bus';
  initialOrigin?: string;
  initialTier?: 'budget' | 'standard' | 'luxury';
  initialBudgetLimit?: number;
  user: UserProfile | null;
  currency: 'INR' | 'USD' | 'EUR';
  onClose: () => void;
  onBookingSuccess: (booking: BookingRecord, pointsEarned: number) => void;
  onOpenAuth?: () => void;
}

export const TripBookingModal: React.FC<TripBookingModalProps> = ({
  destination,
  allDestinations,
  isOpen = true,
  initialStep = 5,
  initialTravelMode = 'flight',
  initialOrigin = 'Bengaluru',
  initialTier,
  initialBudgetLimit,
  user,
  currency,
  onClose,
  onBookingSuccess,
  onOpenAuth,
}) => {
  // Active Selected Destination State (enables finding, entering, and selecting any destination)
  const [currentDestination, setCurrentDestination] = useState<Destination>(destination);
  const [destSearchQuery, setDestSearchQuery] = useState<string>('');
  const [isDestDropdownOpen, setIsDestDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    if (destination) {
      setCurrentDestination(destination);
    }
  }, [destination]);

  // Destination catalogue pool
  const destinationsPool = useMemo(() => {
    return allDestinations && allDestinations.length > 0 ? allDestinations : INITIAL_DESTINATIONS;
  }, [allDestinations]);

  // Filtered destinations list for Destination Option Entry
  const filteredDestinations = useMemo(() => {
    const q = destSearchQuery.trim().toLowerCase();
    if (!q) return destinationsPool;
    return destinationsPool.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q)
    );
  }, [destinationsPool, destSearchQuery]);

  // Handler for selecting any destination from option entry
  const handleSelectDestination = (dest: Destination) => {
    setCurrentDestination(dest);
    setIsDestDropdownOpen(false);
    setDestSearchQuery('');
    setSelectedHotelId('');
    setSelectedAttractions(dest.places?.slice(0, 2).map((p) => p.id) || []);
    if (dest.idealDays) {
      setHotelNights(dest.idealDays);
    }
  };

  // Handler for entering any custom destination not in database
  const handleCustomDestinationSubmit = (customName: string) => {
    const trimmed = customName.trim();
    if (!trimmed) return;
    const match = destinationsPool.find(
      (d) => d.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (match) {
      handleSelectDestination(match);
    } else {
      const dynamicDest: Destination = {
        id: trimmed.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: trimmed,
        state: 'India',
        country: 'India',
        tagline: `Top-rated travel getaway & holiday destination to ${trimmed}`,
        description: `Explore the scenic beauty, vibrant culture, sights and attractions of ${trimmed}.`,
        type: 'Heritage',
        climate: 'moderate',
        idealDays: 3,
        estimatedBudgetPerDay: {
          budget: 850,
          standard: 2600,
          luxury: 7200,
        },
        rating: 4.8,
        reviewsCount: 1120,
        heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        galleryImages: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'],
        bestTimeToVisitMonths: 'September to April',
        seasons: [],
        places: [
          {
            id: `${trimmed.toLowerCase().replace(/[^a-z0-9]/g, '-')}-p1`,
            name: `${trimmed} Panoramic Viewpoint & Walk`,
            category: 'Sightseeing',
            description: `Iconic scenic lookout and top photography spot in ${trimmed}`,
            images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'],
            lat: 20.5937,
            lng: 78.9629,
            entryFee: 150,
            timeNeeded: '2 hours',
            bestTimeToVisit: 'Morning / Sunset',
            rating: 4.8,
            reviewsCount: 420,
            highlight: 'Scenic Panorama & Sunset',
          },
          {
            id: `${trimmed.toLowerCase().replace(/[^a-z0-9]/g, '-')}-p2`,
            name: `${trimmed} Heritage Landmark & Market`,
            category: 'Heritage',
            description: `Vibrant cultural market and historic landmark in ${trimmed}`,
            images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'],
            lat: 20.5937,
            lng: 78.9629,
            entryFee: 250,
            timeNeeded: '3 hours',
            bestTimeToVisit: 'Afternoon',
            rating: 4.7,
            reviewsCount: 680,
            highlight: 'Handicrafts & Authentic Cuisine',
          },
        ],
        foodAndCuisine: {
          overview: `Famous local delicacies, regional street food, and authentic dining spots in ${trimmed}.`,
          signatureDishes: [
            {
              name: `${trimmed} Special Thali`,
              description: 'Authentic regional platter with traditional spices and fresh preparations',
              type: 'veg',
              spiceLevel: 'medium',
              famousSpot: 'City Heritage Kitchen',
            },
          ],
          streetFoodSpots: ['Main Market Chowk', 'Heritage Food Street'],
        },
        culture: {
          languages: ['Hindi', 'English', 'Regional'],
          festivals: ['Local Season Carnival', 'Diwali'],
          traditions: ['Warm Indian Hospitality', 'Handloom crafts'],
          etiquetteTips: ['Modest attire recommended at spiritual spots'],
        },
        coordinates: {
          lat: 20.5937,
          lng: 78.9629,
        },
      };
      handleSelectDestination(dynamicDest);
    }
  };

  // Booking Steps: 1: Mode & Ticket -> 2: Hotel -> 3: Sightseeing Tickets -> 4: Traveler Details -> 5: Checkout & Payment -> 6: E-Ticket
  const [step, setStep] = useState<number>(initialStep);
  const [isRealTicketModalOpen, setIsRealTicketModalOpen] = useState<boolean>(false);

  // Configuration States
  const [origin, setOrigin] = useState<string>(initialOrigin);
  const [travelMode, setTravelMode] = useState<'flight' | 'train' | 'car' | 'bus'>(initialTravelMode);
  const [travelDate, setTravelDate] = useState<string>('2026-09-18');
  const [returnDate, setReturnDate] = useState<string>('2026-09-22');
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);

  // Travel Mode Specific Selections & Exact Ticket Pricing
  const [selectedFlightIndex, setSelectedFlightIndex] = useState<number>(0);
  const [flightSeatClass, setFlightSeatClass] = useState<'economy_saver' | 'economy_regular' | 'business'>('economy_saver');

  const [selectedTrainClass, setSelectedTrainClass] = useState<string>('3A');
  const [selectedTrainIndex, setSelectedTrainIndex] = useState<number>(0);

  const [cabType, setCabType] = useState<'sedan' | 'suv' | 'crysta'>('sedan');
  const [isSelfDrive, setIsSelfDrive] = useState<boolean>(false);

  const [selectedBusIndex, setSelectedBusIndex] = useState<number>(0);

  // Hotel Stay Selection (TripAdvisor & MMT Recommended)
  const [includeHotel, setIncludeHotel] = useState<boolean>(true);
  const [selectedHotelId, setSelectedHotelId] = useState<string>('');
  const [hotelRoomType, setHotelRoomType] = useState<string>('Deluxe Room with Breakfast');
  const [hotelRoomsCount, setHotelRoomsCount] = useState<number>(1);
  const [hotelNights, setHotelNights] = useState<number>(destination.idealDays || 3);

  // Stay Tier & Budget Limit States
  const [selectedStayTier, setSelectedStayTier] = useState<'all' | 'budget' | 'standard' | 'luxury'>(
    initialTier || 'all'
  );
  const [hotelBudgetLimit, setHotelBudgetLimit] = useState<number>(() => {
    if (initialBudgetLimit && initialBudgetLimit > 0) return initialBudgetLimit;
    const destBudget = destination.estimatedBudgetPerDay?.budget;
    return destBudget ? Math.max(1000, Math.round(destBudget * 1.5)) : 2000;
  });
  const [onlyShowWithinBudget, setOnlyShowWithinBudget] = useState<boolean>(false);
  const [hotelSortOrder, setHotelSortOrder] = useState<'budget_first' | 'rating' | 'price_desc'>('budget_first');

  // Update budget limit when destination changes if initial budget limit was not provided
  useEffect(() => {
    if (currentDestination?.estimatedBudgetPerDay?.budget && !initialBudgetLimit) {
      const rec = Math.max(1000, Math.round(currentDestination.estimatedBudgetPerDay.budget * 1.5));
      setHotelBudgetLimit(rec);
    }
  }, [currentDestination.id, initialBudgetLimit]);

  // Sightseeing & Attraction Passes (TripAdvisor 'Things to do')
  const [selectedAttractions, setSelectedAttractions] = useState<string[]>(() => {
    // Default select first 2 attraction entry tickets if available
    return destination.places?.slice(0, 2).map((p) => p.id) || [];
  });

  // Traveler Details Form (MakeMyTrip format) - Starts empty by default as requested
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [passengerDetails, setPassengerDetails] = useState<Array<{ name: string; age: string; gender: string; seatPref: string; mealPref: string }>>(() => {
    const count = adults + children > 0 ? adults + children : 2;
    return Array.from({ length: count }, () => ({
      name: '',
      age: '',
      gender: 'Male',
      seatPref: 'Window / Lower Berth',
      mealPref: 'Veg Meal',
    }));
  });
  const [specialRequest, setSpecialRequest] = useState<string>('');

  // Coupons & Payment
  const [promoCode, setPromoCode] = useState<string>('MMTTRIP');
  const [appliedPromo, setAppliedPromo] = useState<string>('MMTTRIP');
  const [promoDiscountAmount, setPromoDiscountAmount] = useState<number>(750);
  const [promoError, setPromoError] = useState<string>('');
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState<boolean>(false);
  const [paymentOption, setPaymentOption] = useState<'full_upi' | 'full_card' | 'advance_20'>('full_upi');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Multi-Category Payment Gateway State (MakeMyTrip / Cleartrip / TripAdvisor Style)
  const [selectedPaymentCategory, setSelectedPaymentCategory] = useState<'upi' | 'card' | 'netbanking' | 'wallets' | 'hotel_advance' | 'custom_receiver'>('upi');
  
  // UPI Options
  const [upiSubMode, setUpiSubMode] = useState<'my_upi_id' | 'qr_code' | 'instant_apps'>('my_upi_id');
  const [myUpiId, setMyUpiId] = useState<string>('');
  const [isUpiVerified, setIsUpiVerified] = useState<boolean>(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('gpay');
  const [qrCountdown, setQrCountdown] = useState<number>(589);

  // Custom / Owner Receiving Payment Settings (where payment recipient is configurable by user)
  const [merchantUpiId, setMerchantUpiId] = useState<string>('moksgnateja@okhdfcbank');
  const [merchantPayeeName, setMerchantPayeeName] = useState<string>('MG Travels');
  const [isCustomReceiverActive, setIsCustomReceiverActive] = useState<boolean>(true);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  // Card payment details - Starts empty
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [saveCard, setSaveCard] = useState<boolean>(false);

  // Net banking details
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');

  // Wallets & PayLater
  const [selectedWallet, setSelectedWallet] = useState<string>('Paytm Wallet');

  // Interactive Payment Gateway Authorization Drawer
  const [isGatewayDialogOpen, setIsGatewayDialogOpen] = useState<boolean>(false);
  const [gatewayStage, setGatewayStage] = useState<'authorizing' | 'otp_verification' | 'success'>('authorizing');
  const [otpCode, setOtpCode] = useState<string>('784219');
  const [cardOtp, setCardOtp] = useState<string>('784921');

  // Live countdown for dynamic UPI QR code
  useEffect(() => {
    const timer = setInterval(() => {
      setQrCountdown((prev) => (prev > 1 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Final Generated Confirmation & Real-Time Communication
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [earnedPoints, setEarnedPoints] = useState<number>(0);
  const [hotelCallActive, setHotelCallActive] = useState<boolean>(false);
  const [hotelCallAnswered, setHotelCallAnswered] = useState<boolean>(false);
  const [hotelCallMuted, setHotelCallMuted] = useState<boolean>(false);
  const [hotelSmsToastVisible, setHotelSmsToastVisible] = useState<boolean>(true);
  const [activeTicketSegment, setActiveTicketSegment] = useState<'all' | 'travel' | 'hotel' | 'sightseeing' | 'dispatch'>('all');
  const [whatsappDispatchedNotice, setWhatsappDispatchedNotice] = useState<boolean>(false);
  const [smsDispatchedNotice, setSmsDispatchedNotice] = useState<boolean>(false);

  // Sync passenger array length with adults + children (starts with clean empty inputs)
  const totalPassengers = adults + children;
  useEffect(() => {
    setPassengerDetails((prev) => {
      const next = [...prev];
      while (next.length < totalPassengers) {
        next.push({
          name: '',
          age: '',
          gender: next.length % 2 === 0 ? 'Male' : 'Female',
          seatPref: 'Window / Lower Berth',
          mealPref: 'Veg Meal',
        });
      }
      return next.slice(0, totalPassengers);
    });
  }, [totalPassengers]);

  // Compute Multi-Modal Transit Pricing using live engine
  const transitData: MultiModalTransitResult = useMemo(() => {
    return computeRealTimeTransitCost(
      currentDestination.name,
      origin,
      totalPassengers,
      'petrol',
      cabType === 'crysta' ? 'luxury' : cabType === 'suv' ? 'suv' : 'sedan',
      hotelNights
    );
  }, [currentDestination.name, origin, totalPassengers, cabType, hotelNights]);

  // Destination Hotels (from database or synthesized authentic stays)
  const allAvailableHotels = useMemo(() => {
    let list = HOTELS_DATABASE.filter(
      (h) => h.destinationId === currentDestination.id || h.destinationName.toLowerCase().includes(currentDestination.name.toLowerCase())
    );

    const budgetRate = currentDestination.estimatedBudgetPerDay?.budget || 800;
    const standardRate = currentDestination.estimatedBudgetPerDay?.standard || 2800;
    const luxuryRate = currentDestination.estimatedBudgetPerDay?.luxury || 7500;

    // Check if list has budget tier hotels. If not, synthesize genuine budget stays
    const hasBudget = list.some((h) => h.tier === 'budget' || h.pricePerNight <= Math.max(1500, budgetRate * 1.4));
    if (!hasBudget) {
      list = [
        ...list,
        {
          id: `ht-${currentDestination.id}-budget-hostel`,
          destinationId: currentDestination.id,
          destinationName: currentDestination.name,
          name: `${currentDestination.name} Backpacker Haven & Beach Pods`,
          rating: 4.8,
          reviewsCount: 1680,
          pricePerNight: budgetRate,
          location: `Central ${currentDestination.name}`,
          imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
          tier: 'budget' as const,
          amenities: ['Budget Friendly Pods', 'Complimentary Breakfast', 'Free High-Speed WiFi', 'Co-Working Lounge'],
          roomType: 'AC Dorm Pod / Budget Deluxe Room',
          cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
        },
        {
          id: `ht-${currentDestination.id}-budget-homestay`,
          destinationId: currentDestination.id,
          destinationName: currentDestination.name,
          name: `${currentDestination.name} Eco Palm Homestay & Cottages`,
          rating: 4.6,
          reviewsCount: 920,
          pricePerNight: Math.round(budgetRate * 1.35),
          location: `Green Belt ${currentDestination.name}`,
          imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
          tier: 'budget' as const,
          amenities: ['Home-Cooked Breakfast', 'Garden Balcony', 'Free WiFi', 'Host Travel Assistance'],
          roomType: 'Cozy Budget AC Room',
          cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
        },
      ];
    }

    if (list.length > 0) return list;

    // Fallback hotel generator for places without explicit DB records
    return [
      {
        id: `ht-${currentDestination.id}-budget`,
        destinationId: currentDestination.id,
        destinationName: currentDestination.name,
        name: `${currentDestination.name} Backpacker Hostel & Pods`,
        rating: 4.7,
        reviewsCount: 1140,
        pricePerNight: budgetRate,
        location: `Central ${currentDestination.name}`,
        imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
        tier: 'budget' as const,
        amenities: ['Budget Pod Beds', 'High Speed WiFi', 'Free Breakfast', 'Community Lounge'],
        roomType: 'Budget AC Pod Room',
        cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      },
      {
        id: `ht-${currentDestination.id}-standard`,
        destinationId: currentDestination.id,
        destinationName: currentDestination.name,
        name: `${currentDestination.name} Boutique Valley Homestay`,
        rating: 4.6,
        reviewsCount: 680,
        pricePerNight: standardRate,
        location: `Central ${currentDestination.name}`,
        imageUrl: currentDestination.galleryImages?.[0] || currentDestination.heroImage,
        tier: 'standard' as const,
        amenities: ['Home-cooked Authentic Breakfast', 'Bonfire Deck', 'Free WiFi', 'Scenic Balcony'],
        roomType: 'Superior King Room with Garden Balcony',
        cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
      },
      {
        id: `ht-${currentDestination.id}-luxury`,
        destinationId: currentDestination.id,
        destinationName: currentDestination.name,
        name: `The Grand ${currentDestination.name} Heritage Resort & Spa`,
        rating: 4.8,
        reviewsCount: 1420,
        pricePerNight: luxuryRate,
        location: `${currentDestination.name}, ${currentDestination.state}`,
        imageUrl: currentDestination.heroImage,
        tier: 'luxury' as const,
        amenities: ['TripAdvisor Travelers Choice', 'Infinity Pool', 'Complimentary Breakfast', 'Free High-Speed WiFi', 'Spa & Wellness'],
        roomType: 'Deluxe Heritage Mountain View Villa',
        cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      },
    ];
  }, [currentDestination]);

  // Compatibility alias for general list
  const availableHotels = allAvailableHotels;

  // Filtered and sorted hotels based on budget limits and tier
  const displayedHotels = useMemo(() => {
    let list = [...allAvailableHotels];

    // Filter by tier
    if (selectedStayTier !== 'all') {
      list = list.filter((h) => h.tier === selectedStayTier);
    }

    // Filter by budget limit
    if (onlyShowWithinBudget) {
      list = list.filter((h) => h.pricePerNight <= hotelBudgetLimit);
    }

    // Sort order
    if (hotelSortOrder === 'budget_first') {
      list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (hotelSortOrder === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (hotelSortOrder === 'price_desc') {
      list.sort((a, b) => b.pricePerNight - a.pricePerNight);
    }

    return list;
  }, [allAvailableHotels, selectedStayTier, onlyShowWithinBudget, hotelBudgetLimit, hotelSortOrder]);

  // Quick tier shortcuts
  const budgetHotelOption = useMemo(() => {
    return allAvailableHotels.find((h) => h.tier === 'budget') ||
           [...allAvailableHotels].sort((a, b) => a.pricePerNight - b.pricePerNight)[0];
  }, [allAvailableHotels]);

  const standardHotelOption = useMemo(() => {
    return allAvailableHotels.find((h) => h.tier === 'standard') ||
           allAvailableHotels.find((h) => h.pricePerNight > 2000 && h.pricePerNight < 6000);
  }, [allAvailableHotels]);

  const luxuryHotelOption = useMemo(() => {
    return allAvailableHotels.find((h) => h.tier === 'luxury') ||
           [...allAvailableHotels].sort((a, b) => b.pricePerNight - a.pricePerNight)[0];
  }, [allAvailableHotels]);

  // Intelligent selection of hotel matching budget limit or selected tier
  useEffect(() => {
    if (allAvailableHotels.length === 0) return;

    // If selected hotel already belongs to this destination and matches current tier, keep it
    const current = allAvailableHotels.find((h) => h.id === selectedHotelId);
    if (current && selectedStayTier !== 'all' && current.tier !== selectedStayTier) {
      const match = allAvailableHotels.find((h) => h.tier === selectedStayTier);
      if (match) {
        setSelectedHotelId(match.id);
        return;
      }
    }

    if (!selectedHotelId || !current) {
      let pick: Hotel | undefined;
      if (initialTier === 'budget' || selectedStayTier === 'budget') {
        pick = budgetHotelOption;
      } else if (initialTier === 'luxury' || selectedStayTier === 'luxury') {
        pick = luxuryHotelOption;
      } else if (initialTier === 'standard' || selectedStayTier === 'standard') {
        pick = standardHotelOption;
      } else {
        // By default, select the best rated hotel that fits within budget limit
        pick = allAvailableHotels.find((h) => h.pricePerNight <= hotelBudgetLimit) ||
               budgetHotelOption ||
               allAvailableHotels[0];
      }
      if (pick) {
        setSelectedHotelId(pick.id);
      }
    }
  }, [
    allAvailableHotels,
    selectedHotelId,
    selectedStayTier,
    initialTier,
    hotelBudgetLimit,
    budgetHotelOption,
    standardHotelOption,
    luxuryHotelOption,
  ]);

  const selectedHotel = allAvailableHotels.find((h) => h.id === selectedHotelId) || budgetHotelOption || allAvailableHotels[0];

  // Currency formatter
  const formatPrice = (inr: number) => {
    if (currency === 'USD') return `$${Math.round(inr / 83).toLocaleString()}`;
    if (currency === 'EUR') return `€${Math.round(inr / 90).toLocaleString()}`;
    return `₹${inr.toLocaleString('en-IN')}`;
  };

  // ----------------------------------------------------
  // TICKET PRICE CALCULATIONS (Same as MakeMyTrip & TripAdvisor)
  // ----------------------------------------------------
  // 1. Travel Mode Ticket Price
  let travelTicketPricePerPerson = 0;
  let travelModeTotalCost = 0;
  let travelModeDetailsStr = '';

  if (travelMode === 'flight') {
    const flightOp = transitData.flight.operators[selectedFlightIndex] || transitData.flight.operators[0];
    let basePrice = flightOp ? flightOp.price : transitData.flight.basePricePerPerson;
    if (flightSeatClass === 'economy_regular') basePrice += 750;
    if (flightSeatClass === 'business') basePrice = Math.round(basePrice * 2.2);

    travelTicketPricePerPerson = basePrice;
    travelModeTotalCost = basePrice * totalPassengers;
    travelModeDetailsStr = `${flightOp?.airline || 'IndiGo'} (${flightOp?.flightNumber || '6E-402'}) • ${flightSeatClass.replace('_', ' ').toUpperCase()}`;
  } else if (travelMode === 'train') {
    const cls = transitData.train.classes.find((c) => c.code === selectedTrainClass) || transitData.train.classes[0];
    travelTicketPricePerPerson = cls ? cls.farePerPerson : 850;
    travelModeTotalCost = travelTicketPricePerPerson * totalPassengers;
    const trainOp = transitData.train.topTrains[selectedTrainIndex] || transitData.train.topTrains[0];
    travelModeDetailsStr = `${trainOp?.trainName || 'Vande Bharat / Express'} • Class ${selectedTrainClass}`;
  } else if (travelMode === 'car') {
    if (isSelfDrive) {
      travelModeTotalCost = transitData.car.selfDriveRental.totalCost;
      travelTicketPricePerPerson = Math.round(travelModeTotalCost / totalPassengers);
      travelModeDetailsStr = `Self-Drive Rental (${cabType.toUpperCase()}) • Fuel & FASTag Included`;
    } else {
      let fare = transitData.car.outstationCab.sedanFare;
      if (cabType === 'suv') fare = transitData.car.outstationCab.suvFare;
      if (cabType === 'crysta') fare = Math.round(transitData.car.outstationCab.suvFare * 1.3);

      travelModeTotalCost = fare;
      travelTicketPricePerPerson = Math.round(fare / totalPassengers);
      travelModeDetailsStr = `Private AC Outstation Cab (${cabType === 'crysta' ? 'Innova Crysta' : cabType.toUpperCase()}) • Doorstep Pickup`;
    }
  } else if (travelMode === 'bus') {
    const busOp = transitData.bus?.options?.[selectedBusIndex] || { price: 950, operator: 'KSRTC Airavat Volvo' };
    travelTicketPricePerPerson = busOp.price;
    travelModeTotalCost = busOp.price * totalPassengers;
    travelModeDetailsStr = `${busOp.operator} • AC Multi-Axle Sleeper`;
  }

  // 2. Hotel Stay Total Price
  const hotelNightlyRate = selectedHotel ? selectedHotel.pricePerNight : 3500;
  const hotelTotalCost = includeHotel ? hotelNightlyRate * hotelRoomsCount * hotelNights : 0;

  // 3. Sightseeing & Attraction Tickets Total Price
  const attractionTicketsList = (currentDestination.places || []).map((place) => {
    const isSelected = selectedAttractions.includes(place.id);
    const adultPrice = place.entryFee || 150;
    const childPrice = Math.round(adultPrice * 0.5);
    const groupTotal = adultPrice * adults + childPrice * children;
    return {
      place,
      isSelected,
      adultPrice,
      childPrice,
      groupTotal,
    };
  });

  const attractionsTotalCost = attractionTicketsList
    .filter((a) => a.isSelected)
    .reduce((sum, a) => sum + a.groupTotal, 0);

  // 4. Taxes & GST (5% on transport, 12% on stays)
  const transportGST = Math.round(travelModeTotalCost * 0.05);
  const hotelGST = Math.round(hotelTotalCost * 0.12);
  const convenienceFee = 199; // MMT booking platform convenience fee
  const totalTaxesAndFees = transportGST + hotelGST + convenienceFee;

  // 5. Total and Discounts
  const grossSubtotal = travelModeTotalCost + hotelTotalCost + attractionsTotalCost + totalTaxesAndFees;

  // Coupon handling
  const applyPromo = (code: string) => {
    setPromoError('');
    const c = code.trim().toUpperCase();
    if (c === 'MMTTRIP') {
      setAppliedPromo('MMTTRIP');
      setPromoDiscountAmount(750);
    } else if (c === 'TRIPADVISOR2026') {
      setAppliedPromo('TRIPADVISOR2026');
      setPromoDiscountAmount(Math.min(1500, Math.round(grossSubtotal * 0.1)));
    } else if (c === 'FLYINDIA') {
      setAppliedPromo('FLYINDIA');
      setPromoDiscountAmount(500);
    } else if (c === 'IRCTCSAVE') {
      setAppliedPromo('IRCTCSAVE');
      setPromoDiscountAmount(350);
    } else {
      setPromoError('Invalid coupon code. Try MMTTRIP or TRIPADVISOR2026');
    }
  };

  const loyaltyDiscount = useLoyaltyPoints ? Math.min(user?.loyaltyPoints || 500, Math.round(grossSubtotal * 0.1)) : 0;
  const netTotalPayable = Math.max(100, grossSubtotal - promoDiscountAmount - loyaltyDiscount);
  const advance20PercentAmount = Math.round(netTotalPayable * 0.2);
  const payableAmount = selectedPaymentCategory === 'hotel_advance' ? advance20PercentAmount : netTotalPayable;

  // UPI Deep Link Launcher & Gateway Trigger
  const handleLaunchUpiAndPay = (appChoice?: string) => {
    const chosenApp = appChoice || selectedUpiApp || 'gpay';
    setSelectedUpiApp(chosenApp);
    const amount = selectedPaymentCategory === 'hotel_advance' ? advance20PercentAmount : netTotalPayable;
    const payeePa = merchantUpiId || 'moksgnateja@okhdfcbank';
    const payeePn = merchantPayeeName || 'MG Travels';
    const note = `MMT Trip ${currentDestination.name}`;

    const standardUpiUrl = `upi://pay?pa=${encodeURIComponent(payeePa)}&pn=${encodeURIComponent(payeePn)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    let deepLink = standardUpiUrl;
    if (chosenApp === 'gpay') {
      deepLink = `tez://upi/pay?pa=${encodeURIComponent(payeePa)}&pn=${encodeURIComponent(payeePn)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    } else if (chosenApp === 'phonepe') {
      deepLink = `phonepe://pay?pa=${encodeURIComponent(payeePa)}&pn=${encodeURIComponent(payeePn)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    } else if (chosenApp === 'paytm') {
      deepLink = `paytmmp://pay?pa=${encodeURIComponent(payeePa)}&pn=${encodeURIComponent(payeePn)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    }

    try {
      window.location.href = deepLink;
    } catch (e) {
      console.log('UPI intent launch attempt', e);
    }

    setIsGatewayDialogOpen(true);
    setGatewayStage('authorizing');
  };

  // Handle final checkout confirmation
  const handleConfirmBooking = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const pnrNum = `MMT-${Math.floor(100000 + Math.random() * 900000)}`;
      const bookingId = `BK-TRIP-${Date.now().toString().slice(-6)}`;
      const points = Math.round(netTotalPayable * 0.05);
      const actualPaid = selectedPaymentCategory === 'hotel_advance' ? advance20PercentAmount : netTotalPayable;
      const paymentMethodLabel =
        selectedPaymentCategory === 'upi'
          ? `UPI (${myUpiId})`
          : selectedPaymentCategory === 'card'
          ? `Card (${cardNumber.slice(-4) || '7821'})`
          : selectedPaymentCategory === 'netbanking'
          ? `Net Banking (${selectedBank})`
          : selectedPaymentCategory === 'wallets'
          ? `Wallet (${selectedWallet})`
          : selectedPaymentCategory === 'hotel_advance'
          ? '20% Advance Token'
          : `Owner UPI (${merchantUpiId})`;

      const record: BookingRecord = {
        id: bookingId,
        bookingRef: pnrNum,
        username: contactName.trim() || user?.fullName || contactEmail.trim() || user?.email || 'Lead Traveler',
        type: 'trip',
        title: `${currentDestination.name} Complete Trip (${travelMode.toUpperCase()})`,
        destination: currentDestination.name,
        dates: `${travelDate} to ${returnDate} (${hotelNights} Nights)`,
        guests: totalPassengers,
        amountPaid: actualPaid,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
        details: `${travelModeDetailsStr} | ${includeHotel ? selectedHotel.name : 'No Hotel'} | ${paymentMethodLabel}`,
        travelMode,
        origin,
        pnr: pnrNum,
        travelTicketDetails: {
          operator: travelModeDetailsStr.split('•')[0]?.trim() || 'MakeMyTrip Express',
          flightOrTrainNumber: travelMode === 'flight' ? '6E-402' : travelMode === 'train' ? '20608' : undefined,
          seatClass: travelMode === 'flight' ? flightSeatClass : travelMode === 'train' ? selectedTrainClass : undefined,
          seats: passengerDetails.map((p, i) => `${travelMode === 'flight' ? '14' : travelMode === 'train' ? 'B3-' : 'Seat '}${String.fromCharCode(65 + i)}`),
          departureTime: travelMode === 'flight' ? '06:15 AM' : travelMode === 'train' ? '05:45 AM' : '07:00 AM',
          arrivalTime: travelMode === 'flight' ? '08:00 AM' : travelMode === 'train' ? '11:30 AM' : '01:30 PM',
          origin,
          destination: currentDestination.name,
          ticketPricePerPerson: travelTicketPricePerPerson,
          totalTicketFare: travelModeTotalCost,
          passengerList: passengerDetails.map((p, idx) => ({
            name: p.name.trim() || (idx === 0 && contactName.trim() ? contactName.trim() : `Traveler ${idx + 1}`),
            age: p.age.trim() || '28',
            gender: p.gender,
            seatPref: p.seatPref,
          })),
          quota: 'General (GN)',
          irctcUsername: 'irctc_verified_user',
        },
        hotelDetails: includeHotel
          ? {
              hotelId: selectedHotel.id,
              hotelName: selectedHotel.name,
              roomType: hotelRoomType,
              nights: hotelNights,
              rooms: hotelRoomsCount,
              pricePerNight: hotelNightlyRate,
              hotelPhone: selectedHotel.phoneNumber || '+91 80 4646 7000',
              hotelWhatsapp: selectedHotel.whatsappNumber || '+91 99000 46467',
              hotelAddress: selectedHotel.fullAddress || selectedHotel.location,
              hotelCheckInDate: travelDate,
              hotelCheckOutDate: returnDate,
              hotelConfirmationCode: `HTL-CNF-${Math.floor(100000 + Math.random() * 900000)}`,
              hotelManagerName: 'Front Office Reservation Desk',
              hotelRating: selectedHotel.rating,
            }
          : undefined,
        attractionTickets: attractionTicketsList
          .filter((a) => a.isSelected)
          .map((a, idx) => ({
            id: a.place.id,
            name: a.place.name,
            count: totalPassengers,
            price: a.groupTotal,
            category: a.place.category || 'Sightseeing Attraction',
            entrySlot: '09:30 AM - 01:00 PM',
            ticketCode: `TK-ATT-${Math.floor(100000 + idx * 2314)}`,
            visitingHours: a.place.bestTimeToVisit || '10:00 AM - 5:00 PM',
          })),
      };

      setConfirmedBooking(record);
      setEarnedPoints(points);
      setIsProcessing(false);
      setIsGatewayDialogOpen(false);
      setHotelSmsToastVisible(true);
      setStep(6); // Go to E-Ticket voucher step

      onBookingSuccess(record, points);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-750 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* TOP HEADER: MAKEMYTRIP & TRIPADVISOR CO-BRANDING */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-rose-500 via-red-600 to-amber-500 text-white shadow-lg shadow-rose-500/20 flex items-center justify-center">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black tracking-wider px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/40">
                  MakeMyTrip Assured
                </span>
                <span className="text-xs font-black tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span>TripAdvisor Travelers&apos; Choice</span>
                  <span className="text-amber-300">★ 4.8</span>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1 flex items-center gap-2 flex-wrap">
                <span>Book Trip to {currentDestination.name}</span>
                <span className="text-xs font-medium text-slate-400">({currentDestination.state})</span>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setIsDestDropdownOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-[11px] font-bold text-cyan-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:border-cyan-400"
                  title="Click to select or search any destination"
                >
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>Change Destination</span>
                  <ChevronDown className="w-3 h-3 text-cyan-400" />
                </button>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Live Fares & Instant PNR</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEP PROGRESS BAR */}
        {step < 6 && (
          <div className="bg-slate-950/80 px-4 sm:px-6 py-2.5 border-b border-slate-800/80 flex items-center justify-between text-xs overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: 1, label: '1. Travel Mode & Ticket' },
              { id: 2, label: '2. Hotel Stay' },
              { id: 3, label: '3. Sightseeing Passes' },
              { id: 4, label: '4. Traveler Details' },
              { id: 5, label: '5. Fare Summary & Pay' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  step === s.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : step > s.id
                    ? 'text-emerald-400'
                    : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                {step > s.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* MAIN MODAL SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* ========================================================================= */}
          {/* STEP 1: TRAVEL MODE & TICKET SELECTION (FLIGHT, TRAIN, CAR, BUS)         */}
          {/* ========================================================================= */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Origin City, Destination Option Entry, Date & Passengers Bar */}
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* 1. Origin City */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span>Origin City (From)</span>
                    </label>
                    <select
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:border-cyan-500 focus:outline-none cursor-pointer"
                    >
                      {COMMON_ORIGINS.map((c) => (
                        <option key={c.code} value={c.query}>
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Destination Option Entry (To) */}
                  <div className="relative">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-emerald-400" />
                        <span>Destination (To)</span>
                      </span>
                      <span className="text-[10px] text-cyan-400 font-normal">Option Entry</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setIsDestDropdownOpen(!isDestDropdownOpen)}
                      className="w-full bg-slate-800 hover:bg-slate-750 border border-cyan-500/50 hover:border-cyan-400 rounded-xl px-3 py-2 text-xs font-semibold text-white flex items-center justify-between cursor-pointer transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <span className="font-bold text-white truncate">{currentDestination.name}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">({currentDestination.state})</span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />
                    </button>

                    {/* Destination Option Entry Dropdown Popover */}
                    {isDestDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 z-50 bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl p-3.5 space-y-3 w-80 sm:w-96 max-w-[90vw]">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                          <span className="text-xs font-black text-white flex items-center gap-1.5">
                            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Destination Option Entry</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsDestDropdownOpen(false)}
                            className="text-slate-400 hover:text-white text-xs"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            autoFocus
                            value={destSearchQuery}
                            onChange={(e) => setDestSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && destSearchQuery.trim()) {
                                handleCustomDestinationSubmit(destSearchQuery);
                              }
                            }}
                            placeholder="Type or search any destination..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                          />
                          {destSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setDestSearchQuery('')}
                              className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        {/* Quick Popular Destination Chips */}
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Popular Getaways
                          </span>
                          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto no-scrollbar">
                            {destinationsPool.slice(0, 8).map((d) => (
                              <button
                                key={d.id}
                                type="button"
                                onClick={() => handleSelectDestination(d)}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                  currentDestination.id === d.id
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                                }`}
                              >
                                {d.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Filtered Destinations List */}
                        <div className="max-h-52 overflow-y-auto space-y-1.5 no-scrollbar border-t border-slate-800 pt-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Available Destinations ({filteredDestinations.length})
                          </span>
                          {filteredDestinations.map((d) => (
                            <div
                              key={d.id}
                              onClick={() => handleSelectDestination(d)}
                              className={`p-2 rounded-xl border flex items-center justify-between gap-2.5 cursor-pointer transition-all ${
                                currentDestination.id === d.id
                                  ? 'bg-cyan-950/60 border-cyan-500/80 text-white'
                                  : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/70 text-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={d.heroImage}
                                  alt={d.name}
                                  className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-700"
                                />
                                <div className="truncate">
                                  <p className="text-xs font-bold text-white truncate">{d.name}</p>
                                  <p className="text-[10px] text-slate-400 truncate">{d.state}, {d.country} • {d.type}</p>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[10px] font-bold text-amber-300 flex items-center gap-0.5 justify-end">
                                  ★ {d.rating}
                                </span>
                                <span className="text-[10px] text-slate-400">₹{d.estimatedBudgetPerDay?.budget || 850}/day</span>
                              </div>
                            </div>
                          ))}

                          {/* Custom Destination Option if query doesn't match an existing destination */}
                          {destSearchQuery.trim() && !filteredDestinations.some(d => d.name.toLowerCase() === destSearchQuery.trim().toLowerCase()) && (
                            <button
                              type="button"
                              onClick={() => handleCustomDestinationSubmit(destSearchQuery)}
                              className="w-full p-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold text-left flex items-center gap-2 transition-all cursor-pointer"
                            >
                              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>Plan & Book trip to &quot;<strong className="text-white underline">{destSearchQuery.trim()}</strong>&quot;</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Departure Date */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Departure Date
                    </label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  {/* 4. Return Date */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  {/* 5. Passengers */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Passengers (Pax)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white">
                        <span>Adults:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            className="w-5 h-5 rounded bg-slate-700 text-center font-bold"
                          >
                            -
                          </button>
                          <span className="font-black text-cyan-400">{adults}</span>
                          <button
                            type="button"
                            onClick={() => setAdults(adults + 1)}
                            className="w-5 h-5 rounded bg-slate-700 text-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white">
                        <span>Child:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            className="w-5 h-5 rounded bg-slate-700 text-center font-bold"
                          >
                            -
                          </button>
                          <span className="font-black text-cyan-400">{children}</span>
                          <button
                            type="button"
                            onClick={() => setChildren(children + 1)}
                            className="w-5 h-5 rounded bg-slate-700 text-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Destination Pill Selector Shortcut */}
                <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Quick Destinations:</span>
                  </span>
                  {['Goa', 'Manali', 'Kerala', 'Nagwara', 'Jaipur', 'Ladakh', 'Ooty', 'Varanasi', 'Andaman'].map((quickName) => {
                    const quickDest = destinationsPool.find((d) => d.name.toLowerCase().includes(quickName.toLowerCase()));
                    const isCurrent = currentDestination.name.toLowerCase().includes(quickName.toLowerCase());
                    return (
                      <button
                        key={quickName}
                        type="button"
                        onClick={() => {
                          if (quickDest) handleSelectDestination(quickDest);
                          else handleCustomDestinationSubmit(quickName);
                        }}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer text-xs flex items-center gap-1 ${
                          isCurrent
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 ring-1 ring-white/20'
                            : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/80'
                        }`}
                      >
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        <span>{quickName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MODE SELECTOR TABS (FLIGHTS, TRAIN, CAR, BUS) */}
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2 mb-3">
                  <Ticket className="w-4 h-4 text-cyan-400" />
                  <span>Choose Travel Mode & Live Ticket Option</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {/* FLIGHT TAB */}
                  <button
                    type="button"
                    onClick={() => setTravelMode('flight')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      travelMode === 'flight'
                        ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-850 hover:bg-slate-800 border-slate-750'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                        <Plane className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                        Fastest
                      </span>
                    </div>
                    <div className="mt-2">
                      <h4 className="font-bold text-white text-xs">Flights</h4>
                      <p className="text-[10px] text-slate-400">
                        {transitData.flight.durationStr} non-stop
                      </p>
                      <p className="text-sm font-black text-indigo-400 mt-1">
                        ₹{transitData.flight.basePricePerPerson.toLocaleString()}
                        <span className="text-[10px] text-slate-400 font-normal"> /seat</span>
                      </p>
                    </div>
                  </button>

                  {/* TRAIN TAB */}
                  <button
                    type="button"
                    onClick={() => setTravelMode('train')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      travelMode === 'train'
                        ? 'bg-cyan-950/60 border-cyan-500 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-850 hover:bg-slate-800 border-slate-750'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                        <Train className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                        IRCTC Vande Bharat
                      </span>
                    </div>
                    <div className="mt-2">
                      <h4 className="font-bold text-white text-xs">Train (IRCTC)</h4>
                      <p className="text-[10px] text-slate-400">
                        {transitData.train.durationStr}
                      </p>
                      <p className="text-sm font-black text-cyan-400 mt-1">
                        ₹{transitData.train.cheapestFarePerPerson.toLocaleString()}
                        <span className="text-[10px] text-slate-400 font-normal"> /seat</span>
                      </p>
                    </div>
                  </button>

                  {/* CAR / CAB TAB */}
                  <button
                    type="button"
                    onClick={() => setTravelMode('car')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      travelMode === 'car'
                        ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-850 hover:bg-slate-800 border-slate-750'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                        <Car className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        Doorstep AC
                      </span>
                    </div>
                    <div className="mt-2">
                      <h4 className="font-bold text-white text-xs">Outstation Cab</h4>
                      <p className="text-[10px] text-slate-400">
                        {transitData.car.personal.drivingTimeStr} ({transitData.distanceRoadKm} km)
                      </p>
                      <p className="text-sm font-black text-emerald-400 mt-1">
                        ₹{transitData.car.outstationCab.sedanPerPerson.toLocaleString()}
                        <span className="text-[10px] text-slate-400 font-normal"> /pax</span>
                      </p>
                    </div>
                  </button>

                  {/* VOLVO BUS TAB */}
                  <button
                    type="button"
                    onClick={() => setTravelMode('bus')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      travelMode === 'bus'
                        ? 'bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-850 hover:bg-slate-800 border-slate-750'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                        <Bus className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                        Sleeper Bus
                      </span>
                    </div>
                    <div className="mt-2">
                      <h4 className="font-bold text-white text-xs">Volvo Bus</h4>
                      <p className="text-[10px] text-slate-400">
                        Overnight luxury
                      </p>
                      <p className="text-sm font-black text-amber-400 mt-1">
                        ₹950
                        <span className="text-[10px] text-slate-400 font-normal"> /seat</span>
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* DETAILED TICKET OPTIONS FOR THE SELECTED MODE */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-850/90 border border-slate-750 space-y-4">
                {/* 1. FLIGHT DETAILS */}
                {travelMode === 'flight' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                        <Plane className="w-4 h-4 text-indigo-400" />
                        <span>Available Flights: {origin} ➔ {destination.name}</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        15kg Check-in + 7kg Cabin Baggage included
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {transitData.flight.operators.map((flight, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedFlightIndex(idx)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            selectedFlightIndex === idx
                              ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/40'
                              : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 font-black text-xs">
                              {flight.airline.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{flight.airline}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                                  {flight.flightNumber}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                {flight.departureTime} ({origin}) ➔ {flight.arrivalTime} ({destination.name}) • {flight.duration}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-750">
                            <div className="text-right">
                              <span className="text-base font-black text-white">
                                ₹{flight.price.toLocaleString()}
                              </span>
                              <p className="text-[10px] text-emerald-400 font-bold">
                                {flight.onTimeRating}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                selectedFlightIndex === idx
                                  ? 'border-indigo-400 bg-indigo-500 text-white'
                                  : 'border-slate-600'
                              }`}
                            >
                              {selectedFlightIndex === idx && <Check className="w-3 h-3" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Class Selector for Flight */}
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-300">Ticket Class:</span>
                      {[
                        { id: 'economy_saver', label: 'Economy Saver', badge: 'Best Value' },
                        { id: 'economy_regular', label: 'Flexi Regular (+₹750)', badge: 'Free Reschedule' },
                        { id: 'business', label: 'Business / Premium (+₹4,200)', badge: 'Lounge + Meals' },
                      ].map((cls) => (
                        <button
                          key={cls.id}
                          type="button"
                          onClick={() => setFlightSeatClass(cls.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            flightSeatClass === cls.id
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                          }`}
                        >
                          {cls.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. TRAIN DETAILS (IRCTC) */}
                {travelMode === 'train' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                        <Train className="w-4 h-4 text-cyan-400" />
                        <span>IRCTC Top Trains: {origin} Junction ➔ {destination.name}</span>
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Instant IRCTC Booking with Real-Time PNR Confirmation
                      </span>
                    </div>

                    {/* Train Classes Selection Grid */}
                    <div>
                      <span className="text-xs font-bold text-slate-300 block mb-2">
                        Select Train Class & Berth:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {transitData.train.classes.map((cls) => (
                          <div
                            key={cls.code}
                            onClick={() => setSelectedTrainClass(cls.code)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer ${
                              selectedTrainClass === cls.code
                                ? 'bg-cyan-950/50 border-cyan-400 ring-1 ring-cyan-400/40 shadow-sm'
                                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-black text-white text-xs">{cls.code}</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                                {cls.availabilityStatus}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 truncate">{cls.name}</p>
                            <p className="text-sm font-black text-cyan-300 mt-1">
                              ₹{cls.farePerPerson.toLocaleString()}
                              <span className="text-[10px] text-slate-400 font-normal"> /seat</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Train List */}
                    <div className="space-y-2 pt-2">
                      {transitData.train.topTrains.map((train, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedTrainIndex(idx)}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer ${
                            selectedTrainIndex === idx
                              ? 'bg-cyan-950/30 border-cyan-500/60'
                              : 'bg-slate-800/60 border-slate-700/80'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs">{train.trainName}</span>
                              <span className="text-[10px] font-mono text-cyan-400">#{train.trainNumber}</span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              Dep: {train.departureTime} • Arr: {train.arrivalTime} • Duration: {train.duration}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-emerald-400">{train.punctualityRating}</span>
                            <p className="text-[10px] text-slate-400">{train.runsOnDays}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. CAR / CAB DETAILS */}
                {travelMode === 'car' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                        <Car className="w-4 h-4 text-emerald-400" />
                        <span>Private Outstation Cab or Self-Drive ({transitData.distanceRoadKm} km)</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Door-to-door doorstep pickup & hotel drop included
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'sedan', name: 'AC Prime Sedan', model: 'Swift Dzire / Toyota Etios', fare: transitData.car.outstationCab.sedanFare, pax: '1 - 4 Pax' },
                        { id: 'suv', name: 'AC Prime SUV', model: 'Maruti Ertiga / Kia Carens', fare: transitData.car.outstationCab.suvFare, pax: '1 - 6 Pax' },
                        { id: 'crysta', name: 'Luxury Crysta', model: 'Toyota Innova Crysta', fare: Math.round(transitData.car.outstationCab.suvFare * 1.3), pax: '1 - 7 Pax' },
                      ].map((cab) => (
                        <div
                          key={cab.id}
                          onClick={() => setCabType(cab.id as any)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                            cabType === cab.id
                              ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/40 shadow-sm'
                              : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">{cab.name}</span>
                            <span className="text-[10px] font-bold text-slate-400">{cab.pax}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">{cab.model}</p>
                          <div className="mt-3 flex items-baseline justify-between">
                            <span className="text-base font-black text-emerald-400">
                              ₹{cab.fare.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400">total vehicle</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Includes Driver Bata, FASTag Toll Estimates, Fuel & 24/7 Roadside Assistance</span>
                      </div>
                      <span className="font-bold text-emerald-400">
                        ₹{Math.round((cabType === 'suv' ? transitData.car.outstationCab.suvFare : transitData.car.outstationCab.sedanFare) / totalPassengers)} / person
                      </span>
                    </div>
                  </div>
                )}

                {/* 4. BUS DETAILS */}
                {travelMode === 'bus' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                        <Bus className="w-4 h-4 text-amber-400" />
                        <span>Volvo & AC Multi-Axle Sleeper Buses</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Live GPS tracking, sanitized blankets & water bottle included
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {(transitData.bus?.options || [
                        { operator: 'KSRTC Airavat Club Class', busType: 'Volvo Multi-Axle AC Semi-Sleeper (2+2)', departureTime: '09:15 PM', arrivalTime: '06:45 AM', duration: '9h 30m', price: 950, rating: 4.8 },
                        { operator: 'IntrCity SmartBus Luxury', busType: 'AC Multi-Axle Sleeper (2+1 Berths)', departureTime: '10:30 PM', arrivalTime: '07:30 AM', duration: '9h 00m', price: 1150, rating: 4.9 },
                      ]).map((bus, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedBusIndex(idx)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            selectedBusIndex === idx
                              ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/40'
                              : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{bus.operator}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                                ★ {bus.rating}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">{bus.busType}</p>
                            <p className="text-[10px] text-slate-500">
                              Dep: {bus.departureTime} ➔ Arr: {bus.arrivalTime} ({bus.duration})
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-black text-amber-400">
                              ₹{bus.price.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400 block">/ seat</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: HOTEL & STAY (TRIPADVISOR & MMT RECOMMENDED)                     */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <HotelIcon className="w-4 h-4 text-cyan-400" />
                    <span>TripAdvisor Recommended Stays in {destination.name}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Handpicked luxury resorts, boutique homestays, and budget retreats with verified traveler reviews.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                  <span className="text-xs font-bold text-slate-300">Need Accommodation?</span>
                  <input
                    type="checkbox"
                    checked={includeHotel}
                    onChange={(e) => setIncludeHotel(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              {includeHotel ? (
                <div className="space-y-4">
                  {/* Nights & Rooms counter */}
                  <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold">Nights:</span>
                      <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                        <button
                          type="button"
                          onClick={() => setHotelNights(Math.max(1, hotelNights - 1))}
                          className="w-5 h-5 rounded bg-slate-700 font-bold text-white hover:bg-slate-600"
                        >
                          -
                        </button>
                        <span className="font-bold text-cyan-400">{hotelNights}</span>
                        <button
                          type="button"
                          onClick={() => setHotelNights(hotelNights + 1)}
                          className="w-5 h-5 rounded bg-slate-700 font-bold text-white hover:bg-slate-600"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold">Rooms:</span>
                      <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                        <button
                          type="button"
                          onClick={() => setHotelRoomsCount(Math.max(1, hotelRoomsCount - 1))}
                          className="w-5 h-5 rounded bg-slate-700 font-bold text-white hover:bg-slate-600"
                        >
                          -
                        </button>
                        <span className="font-bold text-cyan-400">{hotelRoomsCount}</span>
                        <button
                          type="button"
                          onClick={() => setHotelRoomsCount(hotelRoomsCount + 1)}
                          className="w-5 h-5 rounded bg-slate-700 font-bold text-white hover:bg-slate-600"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-slate-300 font-medium">
                      Total Stay: <strong className="text-emerald-400">₹{(hotelNightlyRate * hotelRoomsCount * hotelNights).toLocaleString()}</strong>
                    </div>
                  </div>

                  {/* Stay Budget Limit & Tier Filter Toolbar */}
                  <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-3.5">
                    {/* Tier Filter Tabs */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
                        {[
                          { id: 'all', label: `All Stays (${allAvailableHotels.length})` },
                          { id: 'budget', label: '💚 Budget Friendly' },
                          { id: 'standard', label: 'Standard Comfort' },
                          { id: 'luxury', label: '5★ Luxury Resorts' },
                        ].map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedStayTier(t.id as any)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                              selectedStayTier === t.id
                                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>

                      {/* Sort Order */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-bold">Sort:</span>
                        <select
                          value={hotelSortOrder}
                          onChange={(e) => setHotelSortOrder(e.target.value as any)}
                          className="bg-slate-900 text-white text-xs rounded-lg px-2.5 py-1 border border-slate-700 outline-none focus:border-cyan-500"
                        >
                          <option value="budget_first">Budget First (Lowest Price)</option>
                          <option value="rating">Highest Rated</option>
                          <option value="price_desc">Price: High to Low</option>
                        </select>
                      </div>
                    </div>

                    {/* Stay Budget Limit Control Bar */}
                    <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-slate-300 font-bold flex items-center gap-1">
                          <Sliders className="w-3.5 h-3.5 text-amber-400" />
                          <span>Max Stay Budget Limit:</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="range"
                            min={500}
                            max={15000}
                            step={250}
                            value={hotelBudgetLimit}
                            onChange={(e) => setHotelBudgetLimit(Number(e.target.value))}
                            className="w-28 sm:w-36 accent-cyan-400 cursor-pointer"
                          />
                          <span className="font-black text-cyan-300 px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                            ₹{hotelBudgetLimit.toLocaleString()}/nt
                          </span>
                        </div>

                        {/* Quick Presets */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setHotelBudgetLimit(currentDestination.estimatedBudgetPerDay?.budget || 800)}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 font-bold transition-all"
                            title="Set to Destination Daily Budget"
                          >
                            Match Dest Budget (₹{currentDestination.estimatedBudgetPerDay?.budget || 800})
                          </button>
                          {[
                            { label: '₹800', val: 800 },
                            { label: '₹1,500', val: 1500 },
                            { label: '₹3,500', val: 3500 },
                            { label: '₹7,500', val: 7500 },
                          ].map((preset) => (
                            <button
                              key={preset.val}
                              type="button"
                              onClick={() => setHotelBudgetLimit(preset.val)}
                              className={`text-[10px] px-1.5 py-0.5 rounded font-bold transition-all ${
                                hotelBudgetLimit === preset.val
                                  ? 'bg-cyan-500 text-white'
                                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                              }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Toggle Only Show Within Budget */}
                      <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={onlyShowWithinBudget}
                          onChange={(e) => setOnlyShowWithinBudget(e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-cyan-500 focus:ring-0 cursor-pointer"
                        />
                        <span>Only show stays within budget</span>
                      </label>
                    </div>
                  </div>

                  {/* Hotel Cards List */}
                  {displayedHotels.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-slate-850 border border-slate-750 text-center space-y-3">
                      <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                      <h4 className="text-sm font-bold text-white">No stays found under ₹{hotelBudgetLimit.toLocaleString()}/night</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Try raising your budget limit or switching the tier filter to view available homestays and resorts.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setOnlyShowWithinBudget(false);
                          setSelectedStayTier('all');
                          setHotelBudgetLimit(2500);
                        }}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold transition-all"
                      >
                        Reset Budget Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {displayedHotels.map((hotel) => {
                        const fitsBudget = hotel.pricePerNight <= hotelBudgetLimit;
                        const totalHotelCost = hotel.pricePerNight * hotelRoomsCount * hotelNights;

                        return (
                          <div
                            key={hotel.id}
                            onClick={() => setSelectedHotelId(hotel.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                              selectedHotelId === hotel.id
                                ? 'bg-slate-800/95 border-cyan-500 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/10'
                                : 'bg-slate-850 hover:bg-slate-800 border-slate-750'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="relative h-40 rounded-xl overflow-hidden">
                                <img
                                  src={hotel.imageUrl}
                                  alt={hotel.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-md text-[10px] font-black text-amber-300 border border-amber-500/30">
                                  <span>★ {hotel.rating}</span>
                                  <span className="text-slate-400">({hotel.reviewsCount} reviews)</span>
                                </div>
                                <div className="absolute top-2 right-2 flex items-center gap-1">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full backdrop-blur-md text-[10px] font-bold text-white uppercase ${
                                      hotel.tier === 'budget'
                                        ? 'bg-emerald-600/90'
                                        : hotel.tier === 'luxury'
                                        ? 'bg-purple-600/90'
                                        : 'bg-blue-600/90'
                                    }`}
                                  >
                                    {hotel.tier}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-black text-white text-sm">{hotel.name}</h4>
                                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>{hotel.location}</span>
                                  </p>
                                </div>
                              </div>

                              {/* Budget Limit Match Pill */}
                              <div className="pt-0.5">
                                {fitsBudget ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>Fits Budget Limit (≤ ₹{hotelBudgetLimit.toLocaleString()}/nt)</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-300 border border-amber-500/30">
                                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                                    <span>Above budget by ₹{(hotel.pricePerNight - hotelBudgetLimit).toLocaleString()}/nt</span>
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {hotel.amenities.slice(0, 3).map((am, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                                  >
                                    {am}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-750 flex items-center justify-between">
                              <div>
                                <div>
                                  <span className="text-lg font-black text-white">
                                    ₹{hotel.pricePerNight.toLocaleString()}
                                  </span>
                                  <span className="text-[10px] text-slate-400"> /night</span>
                                </div>
                                <span className="text-[10px] text-slate-400 block">
                                  Total: <strong className="text-emerald-300">₹{totalHotelCost.toLocaleString()}</strong> ({hotelNights} nights)
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedHotelId(hotel.id);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  selectedHotelId === hotel.id
                                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                                    : 'bg-slate-750 hover:bg-slate-700 text-slate-300'
                                }`}
                              >
                                {selectedHotelId === hotel.id ? '✓ Selected' : 'Select Stay'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-850 border border-slate-750 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-slate-500 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Travel Mode Only Booking</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    You chose to skip hotel reservation. We will book your {travelMode.toUpperCase()} tickets and sightseeing passes only.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: SIGHTSEEING & ATTRACTION ENTRY TICKETS (TRIPADVISOR THINGS TO DO)  */}
          {/* ========================================================================= */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-cyan-400" />
                    <span>TripAdvisor &apos;Things To Do&apos; Sightseeing Entry Tickets</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Pre-book guaranteed skip-the-line attraction entry passes with digital QR barcodes.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400">Passes Total:</span>
                  <p className="text-sm font-black text-emerald-400">₹{attractionsTotalCost.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {attractionTicketsList.map(({ place, isSelected, adultPrice, childPrice, groupTotal }) => (
                  <div
                    key={place.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAttractions(selectedAttractions.filter((id) => id !== place.id));
                      } else {
                        setSelectedAttractions([...selectedAttractions, place.id]);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500/30'
                        : 'bg-slate-850 hover:bg-slate-800 border-slate-750'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                        <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">{place.name}</h4>
                        <p className="text-[10px] text-slate-400">{place.category} • {place.duration}</p>
                        <p className="text-[10px] text-cyan-300 font-medium mt-0.5">
                          Adult: ₹{adultPrice} | Child: ₹{childPrice}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-white">
                        ₹{groupTotal.toLocaleString()}
                      </span>
                      <div
                        className={`w-5 h-5 mt-1 rounded-md border flex items-center justify-center ml-auto ${
                          isSelected ? 'bg-cyan-500 border-cyan-400 text-white' : 'border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: TRAVELER DETAILS (MAKEMYTRIP FORMAT)                              */}
          {/* ========================================================================= */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Traveler Details & Primary Contact (MakeMyTrip Format)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Enter passenger names exactly as per Government Photo ID (Aadhaar / Passport / Driving License).
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {user && (
                    <button
                      type="button"
                      onClick={() => {
                        setContactName(user.fullName || '');
                        setContactEmail(user.email || '');
                        setContactPhone(user.phone || '');
                        setPassengerDetails((prev) =>
                          prev.map((p, i) =>
                            i === 0 ? { ...p, name: user.fullName || '', age: '28' } : p
                          )
                        );
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 font-semibold text-xs border border-cyan-700/50 transition-colors cursor-pointer"
                    >
                      Auto-fill My Profile
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setContactName('');
                      setContactEmail('');
                      setContactPhone('');
                      setSpecialRequest('');
                      setPassengerDetails((prev) =>
                        prev.map((p) => ({ ...p, name: '', age: '' }))
                      );
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Primary Contact Bar */}
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Primary Contact Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Email Address (For E-Ticket)
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Mobile Phone (For SMS PNR)
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              {/* Passenger Specific Fields */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 block">
                  Passenger Seat & Berth Allocations ({passengerDetails.length} Passengers):
                </span>

                {passengerDetails.map((pax, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-750 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center"
                  >
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        Traveler {idx + 1} Name
                      </label>
                      <input
                        type="text"
                        value={pax.name}
                        onChange={(e) => {
                          const next = [...passengerDetails];
                          next[idx].name = e.target.value;
                          setPassengerDetails(next);
                        }}
                        placeholder={`Enter Traveler ${idx + 1} Name`}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        Age & Gender
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={pax.age}
                          onChange={(e) => {
                            const next = [...passengerDetails];
                            next[idx].age = e.target.value;
                            setPassengerDetails(next);
                          }}
                          className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
                          placeholder="Age"
                        />
                        <select
                          value={pax.gender}
                          onChange={(e) => {
                            const next = [...passengerDetails];
                            next[idx].gender = e.target.value;
                            setPassengerDetails(next);
                          }}
                          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        Seat / Berth Preference
                      </label>
                      <select
                        value={pax.seatPref}
                        onChange={(e) => {
                          const next = [...passengerDetails];
                          next[idx].seatPref = e.target.value;
                          setPassengerDetails(next);
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                      >
                        <option value="Window / Lower Berth">Window / Lower Berth</option>
                        <option value="Aisle / Middle Berth">Aisle / Middle Berth</option>
                        <option value="Upper / Any Berth">Upper / Any Berth</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        Complimentary Meal
                      </label>
                      <select
                        value={pax.mealPref}
                        onChange={(e) => {
                          const next = [...passengerDetails];
                          next[idx].mealPref = e.target.value;
                          setPassengerDetails(next);
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                      >
                        <option value="Veg Meal">Vegetarian Meal</option>
                        <option value="Non-Veg Meal">Non-Vegetarian Meal</option>
                        <option value="Jain Meal">Jain Meal (No onion/garlic)</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Requests */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Special Travel Notes / Dietary or Wheelchair Assistance
                </label>
                <textarea
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                  placeholder="E.g., early check-in, ground floor room, baby stroller..."
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: FARE SUMMARY, COUPONS & INSTANT CHECKOUT (MAKEMYTRIP STYLE)        */}
          {/* ========================================================================= */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  <span>Itemized Fare Summary & Instant Checkout</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Review complete fare breakdown including transit tickets, resort stay, attraction tickets and taxes.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Package Summary & Itemized Bill */}
                <div className="lg:col-span-6 space-y-4">
                  {/* Visual Trip & Stay Package Card */}
                  <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-750">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                          Trip & Stay Package ({currentDestination.name})
                        </h4>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-bold">
                        MakeMyTrip Co-Branded
                      </span>
                    </div>

                    {/* Destination Option Entry Segment */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={currentDestination.heroImage}
                          alt={currentDestination.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div className="truncate">
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block flex items-center gap-1">
                            <Navigation className="w-2.5 h-2.5 text-emerald-400" />
                            <span>Destination Option Entry</span>
                          </span>
                          <p className="text-xs font-bold text-white truncate">
                            {currentDestination.name}, {currentDestination.state}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setStep(1);
                          setIsDestDropdownOpen(true);
                        }}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Change Destination</span>
                      </button>
                    </div>

                    {/* Travel Segment */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          {travelMode === 'flight' && <Plane className="w-3.5 h-3.5 text-indigo-400" />}
                          {travelMode === 'train' && <Train className="w-3.5 h-3.5 text-cyan-400" />}
                          {travelMode === 'car' && <Car className="w-3.5 h-3.5 text-emerald-400" />}
                          {travelMode === 'bus' && <Bus className="w-3.5 h-3.5 text-amber-400" />}
                          <span>{travelMode.toUpperCase()} TICKETS ({totalPassengers} Pax)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Change Travel</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {origin} ➔ {currentDestination.name} • {travelModeDetailsStr}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                        <span>Date: {travelDate} (Departure: 06:15 AM)</span>
                        <strong className="text-white text-xs">₹{travelModeTotalCost.toLocaleString()}</strong>
                      </div>
                    </div>

                    {/* Stay Segment with Budget Limit & Tier Match Controls */}
                    {includeHotel && (
                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <HotelIcon className="w-3.5 h-3.5 text-amber-400" />
                            <span>RESORT STAY ({hotelNights} Nights)</span>
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                selectedHotel.tier === 'budget'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : selectedHotel.tier === 'luxury'
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                  : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              }`}
                            >
                              {selectedHotel.tier}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Change Stay</span>
                          </button>
                        </div>

                        {/* Hotel Info & Rate */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>{selectedHotel.name}</span>
                              <span className="text-[10px] text-amber-300 font-normal">★ {selectedHotel.rating}</span>
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {hotelRoomType} • {hotelRoomsCount} Room(s) for {totalPassengers} Guests
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5 text-cyan-400" />
                              <span>{selectedHotel.location}</span>
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-black text-white">
                              ₹{hotelTotalCost.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              ₹{hotelNightlyRate.toLocaleString()}/night
                            </div>
                          </div>
                        </div>

                        {/* Stay Tier Quick Match Selector (Budget / Standard / Luxury) */}
                        <div className="pt-2 border-t border-slate-800/80">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Sliders className="w-2.5 h-2.5 text-cyan-400" />
                              <span>Quick Match Hotel Tier:</span>
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Budget Limit: <strong className="text-cyan-300">₹{hotelBudgetLimit.toLocaleString()}/nt</strong>
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5">
                            {budgetHotelOption && (
                              <button
                                type="button"
                                onClick={() => setSelectedHotelId(budgetHotelOption.id)}
                                className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  selectedHotel.id === budgetHotelOption.id
                                    ? 'bg-emerald-950/70 border-emerald-500 ring-1 ring-emerald-500/50 shadow-sm'
                                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-emerald-400">💚 Budget</span>
                                  {selectedHotel.id === budgetHotelOption.id && (
                                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                                  )}
                                </div>
                                <p className="text-[11px] font-extrabold text-white mt-0.5">
                                  ₹{budgetHotelOption.pricePerNight.toLocaleString()}
                                  <span className="text-[9px] font-normal text-slate-400">/nt</span>
                                </p>
                                <p className="text-[9px] text-slate-400 truncate">
                                  ₹{(budgetHotelOption.pricePerNight * hotelNights * hotelRoomsCount).toLocaleString()} total
                                </p>
                              </button>
                            )}

                            {standardHotelOption && (
                              <button
                                type="button"
                                onClick={() => setSelectedHotelId(standardHotelOption.id)}
                                className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  selectedHotel.id === standardHotelOption.id
                                    ? 'bg-blue-950/70 border-blue-500 ring-1 ring-blue-500/50 shadow-sm'
                                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-blue-400">Standard</span>
                                  {selectedHotel.id === standardHotelOption.id && (
                                    <Check className="w-2.5 h-2.5 text-blue-400" />
                                  )}
                                </div>
                                <p className="text-[11px] font-extrabold text-white mt-0.5">
                                  ₹{standardHotelOption.pricePerNight.toLocaleString()}
                                  <span className="text-[9px] font-normal text-slate-400">/nt</span>
                                </p>
                                <p className="text-[9px] text-slate-400 truncate">
                                  ₹{(standardHotelOption.pricePerNight * hotelNights * hotelRoomsCount).toLocaleString()} total
                                </p>
                              </button>
                            )}

                            {luxuryHotelOption && (
                              <button
                                type="button"
                                onClick={() => setSelectedHotelId(luxuryHotelOption.id)}
                                className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  selectedHotel.id === luxuryHotelOption.id
                                    ? 'bg-purple-950/70 border-purple-500 ring-1 ring-purple-500/50 shadow-sm'
                                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-purple-400">5★ Luxury</span>
                                  {selectedHotel.id === luxuryHotelOption.id && (
                                    <Check className="w-2.5 h-2.5 text-purple-400" />
                                  )}
                                </div>
                                <p className="text-[11px] font-extrabold text-white mt-0.5">
                                  ₹{luxuryHotelOption.pricePerNight.toLocaleString()}
                                  <span className="text-[9px] font-normal text-slate-400">/nt</span>
                                </p>
                                <p className="text-[9px] text-slate-400 truncate">
                                  ₹{(luxuryHotelOption.pricePerNight * hotelNights * hotelRoomsCount).toLocaleString()} total
                                </p>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Budget Limit Status & 1-Click Match Warning Banner */}
                        {selectedHotel.pricePerNight <= hotelBudgetLimit ? (
                          <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-[11px]">
                            <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>Within your stay budget limit (₹{hotelNightlyRate.toLocaleString()} ≤ ₹{hotelBudgetLimit.toLocaleString()}/nt)</span>
                            </span>
                            <span className="text-[10px] text-emerald-400 font-bold">
                              Budget Matched
                            </span>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                              <span className="flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>Hotel price exceeds budget limit by ₹{(hotelNightlyRate - hotelBudgetLimit).toLocaleString()}/nt</span>
                              </span>
                              <span className="text-[10px] text-amber-200/80">Limit: ₹{hotelBudgetLimit.toLocaleString()}/nt</span>
                            </div>
                            {budgetHotelOption && (
                              <button
                                type="button"
                                onClick={() => setSelectedHotelId(budgetHotelOption.id)}
                                className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 text-[11px] font-bold flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
                              >
                                <span className="flex items-center gap-1">
                                  <span>Match Budget: Switch to {budgetHotelOption.name}</span>
                                </span>
                                <span className="text-emerald-200">
                                  ₹{budgetHotelOption.pricePerNight.toLocaleString()}/nt • Save ₹{((hotelNightlyRate - budgetHotelOption.pricePerNight) * hotelNights * hotelRoomsCount).toLocaleString()}
                                </span>
                              </button>
                            )}
                          </div>
                        )}

                        {/* Adjustable Stay Budget Limit Bar */}
                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                          <span>Adjust Stay Budget Limit:</span>
                          <div className="flex items-center gap-1">
                            {[
                              { label: '₹800/nt', val: 800 },
                              { label: '₹1,500/nt', val: 1500 },
                              { label: '₹3,500/nt', val: 3500 },
                              { label: '₹7,500/nt', val: 7500 },
                            ].map((b) => (
                              <button
                                key={b.val}
                                type="button"
                                onClick={() => setHotelBudgetLimit(b.val)}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                                  hotelBudgetLimit === b.val
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                {b.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Guests Segment */}
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Traveler</span>
                        <span className="font-bold text-slate-200">{contactName || 'Lead Traveler'}</span>
                        <span className="text-[10px] text-slate-400 block">{contactPhone || 'No phone entered'} • {contactEmail || 'No email entered'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Details</span>
                      </button>
                    </div>
                  </div>

                  {/* Itemized Bill Breakdown */}
                  <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-3">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider pb-2 border-b border-slate-750">
                      Itemized Bill Breakdown
                    </h4>

                    {/* Transit Ticket Line */}
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Transit Tickets ({travelMode.toUpperCase()})</span>
                      <span className="font-bold text-white">₹{travelModeTotalCost.toLocaleString()}</span>
                    </div>

                    {/* Hotel Line */}
                    {includeHotel && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Resort Stay ({hotelNights} Nights)</span>
                        <span className="font-bold text-white">₹{hotelTotalCost.toLocaleString()}</span>
                      </div>
                    )}

                    {/* Attraction Passes Line */}
                    {attractionsTotalCost > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Sightseeing Passes ({selectedAttractions.length})</span>
                        <span className="font-bold text-white">₹{attractionsTotalCost.toLocaleString()}</span>
                      </div>
                    )}

                    {/* Taxes and GST */}
                    <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-750">
                      <span>Taxes & GST (5% Transit + 12% Hotel + Platform Fee)</span>
                      <span>₹{totalTaxesAndFees.toLocaleString()}</span>
                    </div>

                    {/* Promo Code Applied */}
                    {promoDiscountAmount > 0 && (
                      <div className="flex justify-between text-xs text-emerald-400 font-bold">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <span>Coupon Discount ({appliedPromo})</span>
                        </span>
                        <span>-₹{promoDiscountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    {/* Loyalty Points */}
                    {loyaltyDiscount > 0 && (
                      <div className="flex justify-between text-xs text-amber-400 font-bold">
                        <span className="flex items-center gap-1">
                          <Coins className="w-3 h-3" />
                          <span>Loyalty Points Redeemed</span>
                        </span>
                        <span>-₹{loyaltyDiscount.toLocaleString()}</span>
                      </div>
                    )}

                    {/* Total */}
                    <div className="pt-3 border-t border-slate-700 flex items-baseline justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-400">Total Net Amount</span>
                        <p className="text-[10px] text-emerald-400 font-semibold">
                          Earns +{Math.round(netTotalPayable * 0.05)} Loyalty Points
                        </p>
                      </div>
                      <span className="text-2xl font-black text-cyan-400">
                        ₹{netTotalPayable.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Promo Coupons Bar */}
                  <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750 space-y-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white">Apply Promo / Coupon Code</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold uppercase text-white focus:border-cyan-500 focus:outline-none"
                        placeholder="ENTER CODE (E.g. MMTTRIP)"
                      />
                      <button
                        type="button"
                        onClick={() => applyPromo(promoCode)}
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && <p className="text-[11px] text-rose-400">{promoError}</p>}
                    <div className="flex gap-2 pt-1 flex-wrap">
                      {['MMTTRIP (₹750 OFF)', 'TRIPADVISOR2026 (10% OFF)', 'FLYINDIA (₹500 OFF)'].map((cp) => (
                        <button
                          key={cp}
                          type="button"
                          onClick={() => {
                            const c = cp.split(' ')[0];
                            setPromoCode(c);
                            applyPromo(c);
                          }}
                          className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-cyan-300 font-bold cursor-pointer"
                        >
                          {cp}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Payment Option Customization (Same as MakeMyTrip / Travel Sites) */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-750">
                      <div>
                        <h4 className="font-black text-white text-sm flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-cyan-400" />
                          <span>SELECT PAYMENT OPTION</span>
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Choose your preferred payment method below
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold">
                        <Lock className="w-3 h-3" />
                        <span>256-Bit SSL</span>
                      </div>
                    </div>

                    {/* Payment Categories Selector (MakeMyTrip Style) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'upi', label: '📱 UPI', sub: 'GPay, PhonePe, Paytm' },
                        { id: 'card', label: '💳 Credit / Debit', sub: 'Visa, MasterCard, RuPay' },
                        { id: 'netbanking', label: '🏦 Net Banking', sub: '50+ Indian Banks' },
                        { id: 'wallets', label: '👛 Wallets / Later', sub: 'Amazon, Simpl 0%' },
                        { id: 'hotel_advance', label: '🏨 Pay at Hotel', sub: `Pay 20% (₹${advance20PercentAmount.toLocaleString()})` },
                        { id: 'custom_receiver', label: '⚙️ My UPI Account', sub: 'Personal / Merchant' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedPaymentCategory(cat.id as any)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedPaymentCategory === cat.id
                              ? 'bg-cyan-950/60 border-cyan-500 ring-1 ring-cyan-500/40 text-cyan-300'
                              : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          <span className="font-bold text-xs block text-white">{cat.label}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{cat.sub}</span>
                        </button>
                      ))}
                    </div>

                    {/* TAB CONTENT: 1. UPI */}
                    {selectedPaymentCategory === 'upi' && (
                      <div className="space-y-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                        {/* Sub-modes: My UPI ID vs Dynamic QR */}
                        <div className="flex rounded-lg bg-slate-800 p-1 border border-slate-700 gap-1">
                          <button
                            type="button"
                            onClick={() => setUpiSubMode('my_upi_id')}
                            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                              upiSubMode === 'my_upi_id'
                                ? 'bg-cyan-600 text-white shadow'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Pay via My UPI ID
                          </button>
                          <button
                            type="button"
                            onClick={() => setUpiSubMode('qr_code')}
                            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                              upiSubMode === 'qr_code'
                                ? 'bg-cyan-600 text-white shadow'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Scan Dynamic QR Code
                          </button>
                          <button
                            type="button"
                            onClick={() => setUpiSubMode('instant_apps')}
                            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                              upiSubMode === 'instant_apps'
                                ? 'bg-cyan-600 text-white shadow'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            UPI Apps
                          </button>
                        </div>

                        {/* MODE A: PAY VIA MY UPI ID */}
                        {upiSubMode === 'my_upi_id' && (
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between pb-1">
                                <label className="text-xs font-bold text-slate-200">
                                  Enter Your Personal UPI ID (Google Pay, PhonePe, Paytm, BHIM)
                                </label>
                                {isUpiVerified && (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Verified</span>
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                  <input
                                    type="text"
                                    value={myUpiId}
                                    onChange={(e) => {
                                      setMyUpiId(e.target.value);
                                      setIsUpiVerified(true);
                                    }}
                                    placeholder="e.g. moksgnateja@okaxis"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-cyan-300 focus:border-cyan-500 focus:outline-none"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setIsUpiVerified(true)}
                                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 cursor-pointer"
                                >
                                  Verify
                                </button>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1">
                                Verified Payee Account: <strong className="text-emerald-400 font-semibold">{user?.fullName || 'Teja Moksgna'} (HDFC Bank / Axis)</strong>
                              </p>
                            </div>

                            {/* Quick Handle Extensions */}
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Quick UPI Handles
                              </span>
                              <div className="flex gap-1.5 flex-wrap">
                                {['@okaxis', '@okhdfcbank', '@paytm', '@ybl', '@upi', '@ibl'].map((handle) => (
                                  <button
                                    key={handle}
                                    type="button"
                                    onClick={() => {
                                      const base = myUpiId.includes('@') ? myUpiId.split('@')[0] : myUpiId;
                                      setMyUpiId(`${base || 'moksgnateja'}${handle}`);
                                      setIsUpiVerified(true);
                                    }}
                                    className="text-[10px] px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-mono font-bold cursor-pointer"
                                  >
                                    {handle}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 flex items-center justify-between text-xs">
                              <span className="text-slate-300">Fast 1-Click Launch on Mobile:</span>
                              <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold">
                                  GPay
                                </span>
                                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
                                  PhonePe
                                </span>
                                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                                  Paytm
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* MODE B: DYNAMIC QR CODE */}
                        {upiSubMode === 'qr_code' && (
                          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                            <div className="relative p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                              {/* Authentic SVG QR Code Representation */}
                              <svg width="150" height="150" viewBox="0 0 150 150" className="w-36 h-36">
                                <rect width="150" height="150" fill="white" />
                                {/* Finder patterns */}
                                <rect x="10" y="10" width="35" height="35" fill="black" rx="4" />
                                <rect x="16" y="16" width="23" height="23" fill="white" rx="2" />
                                <rect x="21" y="21" width="13" height="13" fill="black" rx="2" />

                                <rect x="105" y="10" width="35" height="35" fill="black" rx="4" />
                                <rect x="111" y="16" width="23" height="23" fill="white" rx="2" />
                                <rect x="116" y="21" width="13" height="13" fill="black" rx="2" />

                                <rect x="10" y="105" width="35" height="35" fill="black" rx="4" />
                                <rect x="16" y="111" width="23" height="23" fill="white" rx="2" />
                                <rect x="21" y="116" width="13" height="13" fill="black" rx="2" />

                                {/* Matrix dots */}
                                <rect x="52" y="15" width="7" height="7" fill="black" />
                                <rect x="65" y="15" width="7" height="7" fill="black" />
                                <rect x="78" y="15" width="7" height="7" fill="black" />
                                <rect x="91" y="15" width="7" height="7" fill="black" />
                                <rect x="52" y="30" width="7" height="7" fill="black" />
                                <rect x="78" y="30" width="7" height="7" fill="black" />
                                <rect x="65" y="45" width="7" height="7" fill="black" />
                                <rect x="91" y="45" width="7" height="7" fill="black" />

                                <rect x="15" y="52" width="7" height="7" fill="black" />
                                <rect x="30" y="52" width="7" height="7" fill="black" />
                                <rect x="105" y="52" width="7" height="7" fill="black" />
                                <rect x="125" y="52" width="7" height="7" fill="black" />

                                <rect x="15" y="65" width="7" height="7" fill="black" />
                                <rect x="35" y="65" width="7" height="7" fill="black" />
                                <rect x="115" y="65" width="7" height="7" fill="black" />
                                <rect x="130" y="65" width="7" height="7" fill="black" />

                                <rect x="15" y="78" width="7" height="7" fill="black" />
                                <rect x="40" y="78" width="7" height="7" fill="black" />
                                <rect x="105" y="78" width="7" height="7" fill="black" />
                                <rect x="125" y="78" width="7" height="7" fill="black" />

                                <rect x="52" y="105" width="7" height="7" fill="black" />
                                <rect x="70" y="105" width="7" height="7" fill="black" />
                                <rect x="90" y="105" width="7" height="7" fill="black" />
                                <rect x="120" y="105" width="7" height="7" fill="black" />

                                <rect x="52" y="125" width="7" height="7" fill="black" />
                                <rect x="75" y="125" width="7" height="7" fill="black" />
                                <rect x="100" y="125" width="7" height="7" fill="black" />
                                <rect x="120" y="125" width="7" height="7" fill="black" />

                                {/* Center UPI Badge */}
                                <circle cx="75" cy="75" r="18" fill="white" />
                                <circle cx="75" cy="75" r="15" fill="#0891b2" />
                                <text x="75" y="79" fill="white" fontSize="9" fontWeight="900" textAnchor="middle">
                                  UPI
                                </text>
                              </svg>
                            </div>

                            <div className="text-center space-y-1">
                              <span className="text-xs font-bold text-white block">
                                Scan with any UPI app on your phone
                              </span>
                              <div className="flex items-center justify-center gap-2 text-xs">
                                <span className="text-slate-400">Time remaining:</span>
                                <span className="font-mono font-bold text-amber-400">
                                  {Math.floor(qrCountdown / 60).toString().padStart(2, '0')}:
                                  {(qrCountdown % 60).toString().padStart(2, '0')}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-mono">
                                Payee: {merchantPayeeName} ({merchantUpiId})
                              </p>
                            </div>
                          </div>
                        )}

                        {/* MODE C: INSTANT UPI APPS */}
                        {upiSubMode === 'instant_apps' && (
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'gpay', name: 'Google Pay', color: 'from-blue-600 to-indigo-600', note: 'Instant UPI PIN check' },
                              { id: 'phonepe', name: 'PhonePe', color: 'from-purple-600 to-indigo-700', note: 'Autopay & Cashback' },
                              { id: 'paytm', name: 'Paytm UPI', color: 'from-cyan-600 to-blue-600', note: 'Zero processing fee' },
                              { id: 'cred', name: 'CRED UPI', color: 'from-slate-800 to-slate-900', note: 'Earn CRED Coins' },
                            ].map((app) => (
                              <button
                                key={app.id}
                                type="button"
                                onClick={() => {
                                  setSelectedUpiApp(app.id);
                                  handleLaunchUpiAndPay(app.id);
                                }}
                                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                  selectedUpiApp === app.id
                                    ? 'bg-cyan-950/60 border-cyan-400 ring-1 ring-cyan-400/40'
                                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-white block">{app.name}</span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                                    Auto-Launch
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 block mt-0.5">{app.note}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Direct 1-Click Launch Button for Mobile UPI */}
                        {upiSubMode === 'instant_apps' && (
                          <button
                            type="button"
                            onClick={() => handleLaunchUpiAndPay(selectedUpiApp)}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:brightness-110 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                          >
                            <Smartphone className="w-4 h-4" />
                            <span>
                              Open {selectedUpiApp === 'gpay' ? 'Google Pay' : selectedUpiApp === 'phonepe' ? 'PhonePe' : selectedUpiApp === 'paytm' ? 'Paytm' : 'UPI App'} & Pay ₹{payableAmount.toLocaleString()}
                            </span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* TAB CONTENT: 2. CREDIT / DEBIT CARD */}
                    {selectedPaymentCategory === 'card' && (
                      <div className="space-y-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <div>
                          <div className="flex items-center justify-between pb-1">
                            <label className="text-xs font-bold text-slate-200">Card Number</label>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-400">
                              <span>Visa / Mastercard / RuPay</span>
                            </div>
                          </div>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4532 •••• •••• 7821"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-200 block pb-1">Name on Card</label>
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="Full Name as printed on card"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-200 block pb-1">Valid Thru (MM/YY)</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="08/29"
                              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:border-cyan-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-200 block pb-1">CVV / CVC</label>
                            <input
                              type="password"
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="•••"
                              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:border-cyan-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <label className="flex items-center gap-2 pt-1 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={saveCard}
                            onChange={(e) => setSaveCard(e.target.checked)}
                            className="rounded accent-cyan-500"
                          />
                          <span>Save this card securely as per RBI guidelines for instant checkout</span>
                        </label>
                      </div>
                    )}

                    {/* TAB CONTENT: 3. NET BANKING */}
                    {selectedPaymentCategory === 'netbanking' && (
                      <div className="space-y-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-xs font-bold text-slate-300 block">Popular Indian Banks</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            'HDFC Bank',
                            'State Bank of India',
                            'ICICI Bank',
                            'Axis Bank',
                            'Kotak Mahindra Bank',
                            'Punjab National Bank',
                          ].map((bank) => (
                            <button
                              key={bank}
                              type="button"
                              onClick={() => setSelectedBank(bank)}
                              className={`p-2 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                                selectedBank === bank
                                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/40'
                                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                              }`}
                            >
                              {bank}
                            </button>
                          ))}
                        </div>

                        <div className="pt-2">
                          <label className="text-xs font-bold text-slate-300 block pb-1">All Other Indian Banks</label>
                          <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none cursor-pointer"
                          >
                            <option value="HDFC Bank">HDFC Bank</option>
                            <option value="State Bank of India">State Bank of India (SBI)</option>
                            <option value="ICICI Bank">ICICI Bank</option>
                            <option value="Axis Bank">Axis Bank</option>
                            <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                            <option value="Bank of Baroda">Bank of Baroda</option>
                            <option value="Canara Bank">Canara Bank</option>
                            <option value="IndusInd Bank">IndusInd Bank</option>
                            <option value="Federal Bank">Federal Bank</option>
                            <option value="Union Bank of India">Union Bank of India</option>
                            <option value="IDBI Bank">IDBI Bank</option>
                            <option value="Yes Bank">Yes Bank</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT: 4. WALLETS & PAY LATER */}
                    {selectedPaymentCategory === 'wallets' && (
                      <div className="space-y-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-xs font-bold text-slate-300 block">Digital Wallets & PayLater</span>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'Paytm Wallet', name: 'Paytm Wallet', desc: 'Instant 1-tap checkout' },
                            { id: 'Amazon Pay', name: 'Amazon Pay', desc: 'Use Amazon balance & cashback' },
                            { id: 'Mobikwik', name: 'MobiKwik ZIP', desc: 'Pay next month 0% interest' },
                            { id: 'Simpl', name: 'Simpl PayLater', desc: 'Pay in 3 split payments' },
                          ].map((wallet) => (
                            <button
                              key={wallet.id}
                              type="button"
                              onClick={() => setSelectedWallet(wallet.id)}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                selectedWallet === wallet.id
                                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/40'
                                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                              }`}
                            >
                              <strong className="text-xs block text-white">{wallet.name}</strong>
                              <span className="text-[10px] text-slate-400 block">{wallet.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT: 5. PAY AT HOTEL (20% ADVANCE TOKEN) */}
                    {selectedPaymentCategory === 'hotel_advance' && (
                      <div className="space-y-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 space-y-1">
                          <strong className="font-bold block text-white">
                            Lock Booking with 20% Advance Token Today: ₹{advance20PercentAmount.toLocaleString()}
                          </strong>
                          <p className="text-[11px] text-amber-300/90">
                            Pay only 20% today to guarantee your travel tickets and room reservation.
                            The remaining balance of <strong>₹{(netTotalPayable - advance20PercentAmount).toLocaleString()}</strong> can be paid directly upon arrival at the hotel reception.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT: 6. MY PAYMENT RECEIVER (MERCHANT / OWNER UPI SETTINGS) */}
                    {selectedPaymentCategory === 'custom_receiver' && (
                      <div className="space-y-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="flex items-center justify-between pb-1">
                          <div>
                            <span className="text-xs font-black text-white block">
                              My Receiving Payment Details
                            </span>
                            <p className="text-[10px] text-slate-400">
                              Direct customer booking payments to your own account
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isCustomReceiverActive}
                              onChange={(e) => setIsCustomReceiverActive(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                          </label>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block pb-1">
                              My Receiving UPI ID (Where bookings should be paid)
                            </label>
                            <input
                              type="text"
                              value={merchantUpiId}
                              onChange={(e) => setMerchantUpiId(e.target.value)}
                              placeholder="e.g. moksgnateja@okhdfcbank"
                              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-cyan-300 focus:border-cyan-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block pb-1">
                              My Payee / Business Name
                            </label>
                            <input
                              type="text"
                              value={merchantPayeeName}
                              onChange={(e) => setMerchantPayeeName(e.target.value)}
                              placeholder="e.g. Teja Moksgna (MG Travels)"
                              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Current Active Receiver:</span>
                            <span className="font-bold text-emerald-400">{merchantUpiId}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(merchantUpiId);
                              setCopiedUpi(true);
                              setTimeout(() => setCopiedUpi(false), 2000);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedUpi ? 'Copied!' : 'Copy UPI'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Primary Pay Action Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsGatewayDialogOpen(true);
                          setGatewayStage(selectedPaymentCategory === 'card' ? 'otp_verification' : 'authorizing');
                        }}
                        disabled={isProcessing}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-black text-sm shadow-xl shadow-emerald-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>
                          Pay{' '}
                          ₹{selectedPaymentCategory === 'hotel_advance' ? advance20PercentAmount.toLocaleString() : netTotalPayable.toLocaleString()}{' '}
                          & Confirm Booking
                        </span>
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Instant Ticket & Voucher</span>
                      </span>
                      <span>•</span>
                      <span>Free cancellation within 24h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 6: VERIFIED E-TICKET VOUCHER & DIGITAL PNR (MAKEMYTRIP CO-BRANDED)   */}
          {/* ========================================================================= */}
          {step === 6 && confirmedBooking && (
            <div className="space-y-6">
              {/* Success Badge */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/40 text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Trip Booking Confirmed! E-Ticket & Vouchers Issued
                </h3>
                <p className="text-xs text-slate-300">
                  Confirmation sent to <strong className="text-cyan-300">{confirmedBooking.username}</strong> and via SMS to{' '}
                  <strong className="text-cyan-300">{contactPhone}</strong>.
                </p>
              </div>

              {/* 1. REAL-TIME INCOMING NOTIFICATION FROM HOTEL MANAGEMENT */}
              {confirmedBooking.hotelDetails && hotelSmsToastVisible && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-2 border-amber-500/60 shadow-xl space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <HotelIcon className="w-4 h-4 text-amber-400" />
                        <span>Incoming Message from Hotel Management</span>
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Just Now • Delivered</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/90 border border-amber-500/30 text-xs font-mono text-amber-100 leading-relaxed">
                    <p className="font-bold text-white mb-1">
                      From: {confirmedBooking.hotelDetails.hotelName} (Front Office Desk)
                    </p>
                    <p>
                      "Dear {contactName}, your reservation #{confirmedBooking.hotelDetails.hotelConfirmationCode || 'HTL-CNF-89211'} for {confirmedBooking.hotelDetails.rooms || 1} {confirmedBooking.hotelDetails.roomType} ({confirmedBooking.hotelDetails.nights || 2} Nights) is CONFIRMED. Check-in is at 12:00 PM. Our reception desk is available 24x7 at {confirmedBooking.hotelDetails.hotelPhone || selectedHotel.phoneNumber || '+91 80 4646 7000'}. Welcome to {confirmedBooking.destination}!"
                    </p>
                  </div>
                </div>
              )}

              {/* 2. DIRECT HOTEL FRONT DESK HELPLINE & VERIFICATION (USER REQUIREMENT) */}
              {confirmedBooking.hotelDetails && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border-2 border-amber-500/50 shadow-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                        <PhoneCall className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-white text-sm">
                          Direct Hotel Reception Hotline
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          If confirmation call/SMS did not reach your phone, call the hotel desk directly to verify.
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Front Desk Phone</span>
                      <strong className="text-base text-emerald-400 font-mono">
                        {confirmedBooking.hotelDetails.hotelPhone || selectedHotel.phoneNumber || '+91 80 4646 7000'}
                      </strong>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href={`tel:${(confirmedBooking.hotelDetails.hotelPhone || selectedHotel.phoneNumber || '+918046467000').replace(/\s+/g, '')}`}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/30 transition-all cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Hotel Desk</span>
                    </a>

                    <a
                      href={`https://wa.me/${(confirmedBooking.hotelDetails.hotelWhatsapp || selectedHotel.whatsappNumber || '+919900046467').replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${confirmedBooking.hotelDetails.hotelName}, I have booked through MakeMyTrip. Booking Ref: ${confirmedBooking.hotelDetails.hotelConfirmationCode || 'HTL-CNF-89211'}. Kindly confirm my room.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Hotel</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setHotelCallActive(true);
                        setHotelCallAnswered(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-all"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Simulate Hotel Confirmation Call</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 3. AUTOMATIC WHATSAPP & SMS TICKET DISPATCH */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/40 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-xs sm:text-sm">
                        Automatic WhatsApp & SMS Ticket Delivery
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Dispatch all travel, hotel, and sightseeing e-tickets directly to your phone
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const msg = `✅ *BOOKING CONFIRMED - MakeMyTrip & TripAdvisor*\nBooking Ref: ${confirmedBooking.bookingRef}\nTraveler: ${confirmedBooking.username}\nDestination: ${confirmedBooking.destination}\nDates: ${confirmedBooking.dates}\n\n🚆 *TRAVEL TICKET (${travelMode.toUpperCase()}):*\n• Operator: ${confirmedBooking.travelTicketDetails?.operator || 'Express'}\n• PNR: ${confirmedBooking.pnr || confirmedBooking.bookingRef}\n• Seats: ${confirmedBooking.travelTicketDetails?.seats?.join(', ') || 'Confirmed'}\n\n🏨 *HOTEL RESERVATION:*\n• Hotel: ${confirmedBooking.hotelDetails?.hotelName || selectedHotel.name}\n• Ref: ${confirmedBooking.hotelDetails?.hotelConfirmationCode || 'HTL-CNF-89211'}\n• Front Desk Helpline: ${confirmedBooking.hotelDetails?.hotelPhone || selectedHotel.phoneNumber || '+91 80 4646 7000'}\n\n🎟️ *SIGHTSEEING PASSES:*\n${confirmedBooking.attractionTickets?.map((a) => `• ${a.name} (${a.count} Passes)`).join('\n') || '• City Sightseeing Pass'}\n\nAmount Paid: ₹${confirmedBooking.amountPaid.toLocaleString()}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                      setWhatsappDispatchedNotice(true);
                    }}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{whatsappDispatchedNotice ? 'Sent to WhatsApp (Open Again)' : 'Send All Tickets to WhatsApp'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const cleanPhone = contactPhone.replace(/\D/g, '');
                      const smsBody = `MMT Booking Confirmed! Ref: ${confirmedBooking.bookingRef}. Hotel: ${confirmedBooking.hotelDetails?.hotelName} (Desk: ${confirmedBooking.hotelDetails?.hotelPhone}). Transport: ${travelMode.toUpperCase()} (PNR: ${confirmedBooking.pnr}). Have a safe trip!`;
                      window.open(`sms:${cleanPhone}?body=${encodeURIComponent(smsBody)}`, '_blank');
                      setSmsDispatchedNotice(true);
                    }}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{smsDispatchedNotice ? 'SMS Dispatched (Send Again)' : 'Send Real SMS to Mobile Phone'}</span>
                  </button>
                </div>
              </div>

              {/* Official Real E-Ticket Launch Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/70 border-2 border-red-500/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black shadow-lg shadow-red-600/40 shrink-0">
                    {travelMode === 'train' ? <Train className="w-7 h-7" /> : travelMode === 'flight' ? <Plane className="w-7 h-7" /> : <Ticket className="w-7 h-7" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-white text-sm sm:text-base">
                        {travelMode === 'train' ? 'IRCTC Official Electronic Reservation Slip (ERS)' : travelMode === 'flight' ? 'Official Flight E-Boarding Pass' : 'Official Transportation Ticket'}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        CNF CONFIRMED
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      PNR: <strong className="text-cyan-300 font-mono font-black">{confirmedBooking.pnr || confirmedBooking.bookingRef}</strong> • Real layout with QR code & coach berth details
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRealTicketModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:brightness-110 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-900/50 transition-all cursor-pointer shrink-0"
                >
                  <Ticket className="w-4 h-4" />
                  <span>View Official Real E-Ticket & Vouchers</span>
                </button>
              </div>

              {/* CO-BRANDED E-TICKET VOUCHER CARD */}
              <div
                id="printable-e-ticket-voucher"
                className="p-5 sm:p-7 rounded-3xl bg-slate-950 border-2 border-slate-750 shadow-2xl space-y-6 relative overflow-hidden"
              >
                {/* Watermark Logo */}
                <div className="absolute -right-8 -bottom-8 opacity-5 text-slate-100 pointer-events-none">
                  <Compass className="w-80 h-80" />
                </div>

                {/* Ticket Top Header */}
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-lg text-white">MG TRAVELS</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-red-600/20 text-red-400 font-bold border border-red-500/30">
                        MakeMyTrip & TripAdvisor Co-Branded
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Electronic Travel Document & Tax Invoice</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Verified PNR / Ref</span>
                    <span className="text-lg font-mono font-black text-cyan-400 tracking-wider">
                      {confirmedBooking.bookingRef}
                    </span>
                  </div>
                </div>

                {/* Ticket Grid Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Destination</span>
                    <strong className="text-white text-sm">{confirmedBooking.destination}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Travel Dates</span>
                    <strong className="text-slate-200">{confirmedBooking.dates}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Travelers</span>
                    <strong className="text-slate-200">{confirmedBooking.guests} Guests</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Status</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{confirmedBooking.status}</span>
                    </span>
                  </div>
                </div>

                {/* Travel Mode Ticket Segment */}
                {confirmedBooking.travelTicketDetails && (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-2">
                        {travelMode === 'flight' && <Plane className="w-4 h-4 text-indigo-400" />}
                        {travelMode === 'train' && <Train className="w-4 h-4 text-cyan-400" />}
                        {travelMode === 'car' && <Car className="w-4 h-4 text-emerald-400" />}
                        {travelMode === 'bus' && <Bus className="w-4 h-4 text-amber-400" />}
                        <span>
                          {travelMode.toUpperCase()} TICKET: {confirmedBooking.travelTicketDetails.operator}
                        </span>
                      </span>
                      <span className="font-mono text-cyan-300 font-bold">
                        Seats: {confirmedBooking.travelTicketDetails.seats?.join(', ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 pt-1">
                      <div>
                        <span className="text-[10px] text-slate-500 block">From:</span>
                        <span>{origin}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">To:</span>
                        <span>{destination.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Departure:</span>
                        <span>{confirmedBooking.travelTicketDetails.departureTime}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Ticket Fare:</span>
                        <strong className="text-white">
                          ₹{confirmedBooking.travelTicketDetails.totalTicketFare?.toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hotel Stay Segment */}
                {confirmedBooking.hotelDetails && (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-2">
                        <HotelIcon className="w-4 h-4 text-amber-400" />
                        <span>HOTEL STAY VOUCHER: {confirmedBooking.hotelDetails.hotelName}</span>
                      </span>
                      <span className="text-emerald-400 font-bold">Confirmed</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {confirmedBooking.hotelDetails.roomType} • {confirmedBooking.hotelDetails.rooms} Room(s) for{' '}
                      {confirmedBooking.hotelDetails.nights} Night(s)
                    </p>
                  </div>
                )}

                {/* Digital Barcode / QR Segment */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-xl">
                      <QrCode className="w-16 h-16 text-slate-950" />
                    </div>
                    <div className="text-xs space-y-1">
                      <h5 className="font-bold text-white">Paperless Mobile Check-In QR</h5>
                      <p className="text-slate-400">
                        Scan at airport gate, railway TTE scanner, or resort front desk.
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        DIGITAL-TOKEN: {confirmedBooking.bookingRef}-{Date.now().toString().slice(-4)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Amount Paid</span>
                    <span className="text-xl font-black text-emerald-400">
                      ₹{confirmedBooking.amountPaid.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Paid via {paymentOption.toUpperCase()}</span>
                  </div>
                </div>

                {/* Action Buttons: Download PDF, Compare on MakeMyTrip / TripAdvisor */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsRealTicketModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:brightness-110 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-red-900/40 cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>{travelMode === 'train' ? 'Official IRCTC Ticket' : 'Official Boarding Pass'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / Save PDF</span>
                    </button>

                    <a
                      href={`https://www.makemytrip.com/search?keyword=${encodeURIComponent(destination.name)}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-red-400" />
                      <span>Compare on MakeMyTrip</span>
                    </a>

                    <a
                      href={`https://www.tripadvisor.com/Search?q=${encodeURIComponent(destination.name)}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                      <span>View on TripAdvisor</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM STEP NAVIGATION CONTROLS */}
        {step < 6 && (
          <div className="bg-slate-950 p-4 sm:p-5 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep(Math.max(1, step - 1))}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                step === 1
                  ? 'opacity-40 cursor-not-allowed text-slate-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <span className="text-[10px] text-slate-400 block">Estimated Trip Fare</span>
                <span className="text-base font-black text-cyan-400">
                  ₹{netTotalPayable.toLocaleString()}
                </span>
              </div>

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all cursor-pointer"
                >
                  <span>Continue to Step {step + 1}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Book (₹{netTotalPayable.toLocaleString()})</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
        {/* ========================================================================= */}
        {/* INTERACTIVE BANKING PAYMENT GATEWAY DIALOG (SAME AS LEADING TRAVEL SITES) */}
        {/* ========================================================================= */}
        {isGatewayDialogOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsGatewayDialogOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Gateway Top Badge */}
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">
                    {selectedPaymentCategory === 'upi'
                      ? 'UPI Secure Payment Gateway'
                      : selectedPaymentCategory === 'card'
                      ? '3D Secure 2.0 (RBI Verified)'
                      : selectedPaymentCategory === 'netbanking'
                      ? `${selectedBank} NetBanking Portal`
                      : selectedPaymentCategory === 'wallets'
                      ? `${selectedWallet} Checkout`
                      : 'MakeMyTrip Co-Branded Gateway'}
                  </h4>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>256-Bit Encrypted • Verified Merchant</span>
                  </span>
                </div>
              </div>

              {/* Payable Amount Display */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                    Total Amount Due
                  </span>
                  <span className="text-2xl font-black text-emerald-400">
                    ₹{payableAmount.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Payment Mode</span>
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                    {selectedPaymentCategory}
                  </span>
                </div>
              </div>

              {/* Dynamic Gateway Content: ALL UPI MODES */}
              {selectedPaymentCategory === 'upi' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 text-xs text-slate-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-cyan-400" />
                        <span>UPI Payment Triggered</span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        Auto-Redirect Active
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      We have invoked your mobile UPI app for <strong className="text-emerald-400">₹{payableAmount.toLocaleString()}</strong> to <strong className="text-cyan-300 font-mono">{merchantUpiId}</strong>. If your UPI app did not open automatically, tap your app below:
                    </p>

                    {/* Direct App Launch Links */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={`tez://upi/pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${encodeURIComponent(merchantPayeeName)}&am=${payableAmount}&cu=INR&tn=${encodeURIComponent(`MMT Trip ${currentDestination.name}`)}`}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-center text-xs font-bold text-white flex items-center justify-center gap-1.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span>Open Google Pay</span>
                      </a>
                      <a
                        href={`phonepe://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${encodeURIComponent(merchantPayeeName)}&am=${payableAmount}&cu=INR&tn=${encodeURIComponent(`MMT Trip ${currentDestination.name}`)}`}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-center text-xs font-bold text-white flex items-center justify-center gap-1.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        <span>Open PhonePe</span>
                      </a>
                      <a
                        href={`paytmmp://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${encodeURIComponent(merchantPayeeName)}&am=${payableAmount}&cu=INR&tn=${encodeURIComponent(`MMT Trip ${currentDestination.name}`)}`}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-center text-xs font-bold text-white flex items-center justify-center gap-1.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-cyan-500" />
                        <span>Open Paytm</span>
                      </a>
                      <a
                        href={`upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${encodeURIComponent(merchantPayeeName)}&am=${payableAmount}&cu=INR&tn=${encodeURIComponent(`MMT Trip ${currentDestination.name}`)}`}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-center text-xs font-bold text-white flex items-center justify-center gap-1.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Open Any UPI App</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs py-1">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span className="text-slate-300">Awaiting payment authorization from UPI PIN...</span>
                    <span className="font-mono font-bold text-amber-400">04:58</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-black text-sm shadow-xl shadow-emerald-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>Confirming UPI Credits with Bank...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>I Have Approved & Paid ₹{payableAmount.toLocaleString()} (Confirm Now)</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {selectedPaymentCategory === 'card' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-200 block">
                      Enter 6-Digit Bank OTP (One Time Password)
                    </span>
                    <input
                      type="text"
                      maxLength={6}
                      value={cardOtp}
                      onChange={(e) => setCardOtp(e.target.value)}
                      placeholder="784921"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-center font-mono font-bold text-lg tracking-widest text-cyan-300 focus:border-cyan-500 focus:outline-none"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>OTP sent to registered mobile ending ••89</span>
                      <button type="button" className="text-cyan-400 font-bold underline cursor-pointer">
                        Resend OTP
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-black text-sm shadow-xl shadow-emerald-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>Authorizing with Card Issuer...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Submit OTP & Authorize ₹{payableAmount.toLocaleString()}</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {(selectedPaymentCategory === 'netbanking' || selectedPaymentCategory === 'wallets' || selectedPaymentCategory === 'hotel_advance' || selectedPaymentCategory === 'custom_receiver' || (selectedPaymentCategory === 'upi' && upiSubMode === 'instant_apps')) && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-white block">
                      Redirecting to Secure Banking Partner
                    </span>
                    <p className="text-[11px] text-slate-400">
                      You are authorizing payment of <strong className="text-white">₹{payableAmount.toLocaleString()}</strong> using {selectedPaymentCategory === 'netbanking' ? selectedBank : selectedPaymentCategory === 'wallets' ? selectedWallet : 'Authorized Channel'}.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-black text-sm shadow-xl shadow-emerald-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>Processing Instant Confirmation...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Authorize & Issue Digital Ticket Voucher</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Zero convenience fee charged for UPI & RuPay transactions</span>
              </div>
            </motion.div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SIMULATED INCOMING CALL FROM HOTEL MANAGEMENT (SPEECH SYNTHESIS REAL-TIME) */}
        {/* ========================================================================= */}
        {hotelCallActive && confirmedBooking && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className="w-full max-w-sm bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 text-center shadow-2xl space-y-6"
            >
              <div className="space-y-2">
                <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 relative">
                  <HotelIcon className="w-10 h-10" />
                  {!hotelCallAnswered && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 block">
                    {hotelCallAnswered ? 'Connected • Audio Call' : 'Incoming Call from Hotel'}
                  </span>
                  <h4 className="text-lg font-black text-white">
                    {confirmedBooking.hotelDetails?.hotelName || selectedHotel.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    {confirmedBooking.hotelDetails?.hotelPhone || selectedHotel.phoneNumber || '+91 80 4646 7000'}
                  </p>
                </div>
              </div>

              {/* Call Body */}
              {!hotelCallAnswered ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300">
                    Front Office Reservation Desk is calling to confirm your room reservation and check-in time.
                  </p>
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setHotelCallActive(false)}
                      className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 cursor-pointer"
                      title="Decline"
                    >
                      <Phone className="w-6 h-6 rotate-[135deg]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHotelCallAnswered(true);
                        if ('speechSynthesis' in window) {
                          try {
                            window.speechSynthesis.cancel();
                            const hotelName = confirmedBooking.hotelDetails?.hotelName || selectedHotel.name;
                            const utterance = new SpeechSynthesisUtterance(
                              `Hello ${contactName}! This is the front desk reservation manager at ${hotelName}. We have received and confirmed your booking through MakeMyTrip. Your room is reserved and we are excited to welcome you to ${confirmedBooking.destination}. If you need anything before your arrival, please call our 24-hour reception desk. Have a wonderful journey!`
                            );
                            utterance.rate = 0.95;
                            utterance.pitch = 1.0;
                            window.speechSynthesis.speak(utterance);
                          } catch (e) {
                            console.log('Speech synthesis', e);
                          }
                        }
                      }}
                      className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 animate-bounce cursor-pointer"
                      title="Answer Call"
                    >
                      <Phone className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1.5 font-mono text-slate-300">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">
                      Live Audio Transcript:
                    </span>
                    <p className="text-slate-200 leading-relaxed">
                      "Hello {contactName}! This is the front desk at {confirmedBooking.hotelDetails?.hotelName}. We have received your booking and confirmed your room for {confirmedBooking.hotelDetails?.nights} nights. We look forward to your check-in!"
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if ('speechSynthesis' in window) {
                          if (hotelCallMuted) {
                            window.speechSynthesis.resume();
                          } else {
                            window.speechSynthesis.pause();
                          }
                        }
                        setHotelCallMuted(!hotelCallMuted);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                    >
                      {hotelCallMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                      <span>{hotelCallMuted ? 'Unmute' : 'Mute Voice'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                        }
                        setHotelCallActive(false);
                        setHotelCallAnswered(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/30 cursor-pointer"
                    >
                      <Phone className="w-4 h-4 rotate-[135deg]" />
                      <span>End Call</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Real E-Ticket Modal (IRCTC Train / Airline Boarding Pass) */}
        {confirmedBooking && (
          <RealETicketModal
            booking={confirmedBooking}
            isOpen={isRealTicketModalOpen}
            onClose={() => setIsRealTicketModalOpen(false)}
            currency={currency}
          />
        )}
      </motion.div>
    </div>
  );
};
