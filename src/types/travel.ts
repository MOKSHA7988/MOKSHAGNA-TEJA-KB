export type DestinationCategory =
  | 'All'
  | 'Beaches'
  | 'Hill Stations'
  | 'Heritage'
  | 'Wildlife'
  | 'Pilgrimage'
  | 'Adventure'
  | 'Backwaters'
  | 'Luxury';

export type ClimateType = 'cool' | 'tropical' | 'moderate' | 'dry' | 'snowy' | 'monsoon';

export type TripTier = 'budget' | 'standard' | 'luxury';

export interface Place {
  id: string;
  name: string;
  category: string;
  description: string;
  images: string[];
  videoUrl?: string;
  lat: number;
  lng: number;
  entryFee: number; // in INR
  timeNeeded: string; // e.g. "2-3 hours"
  bestTimeToVisit: string;
  rating: number;
  reviewsCount: number;
  highlight: string;
  recommendedTimeSlot?: 'morning' | 'afternoon' | 'evening';
  fullHistory?: string;
  visitingHours?: string;
  openingDays?: string;
  distanceFromCenter?: string;
  etiquetteTips?: string[];
  contactNumber?: string;
  parkingFee?: string;
  cameraFee?: string;
  nearbySpots?: string[];
}

export type PlaceToVisit = Place;

export interface Dish {
  name: string;
  description: string;
  type: 'veg' | 'non-veg';
  spiceLevel: 'mild' | 'medium' | 'spicy';
  famousSpot: string;
  imageUrl?: string;
}

export interface CultureInfo {
  languages: string[];
  festivals: string[];
  traditions: string[];
  etiquetteTips: string[];
  dressCode?: string;
}

export interface SeasonWeather {
  season: string; // e.g. "Winter (Oct - Mar)"
  avgTemp: string; // e.g. "15°C - 25°C"
  rainfall: string; // e.g. "Low (5mm)"
  suitability: 'Peak' | 'Good' | 'Moderate' | 'Avoid';
  description: string;
}

export interface Hotel {
  id: string;
  destinationId: string;
  destinationName: string;
  name: string;
  rating: number;
  reviewsCount: number;
  pricePerNight: number; // in INR
  location: string;
  imageUrl: string;
  images?: string[];
  tier: TripTier;
  amenities: string[];
  roomType: string;
  coordinates?: { lat: number; lng: number };
  cancellationPolicy: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  email?: string;
  fullAddress?: string;
  distanceFromCenter?: string;
}

export interface Attraction {
  id: string;
  destinationId: string;
  destinationName: string;
  name: string;
  category: string;
  rating: number;
  description: string;
  imageUrl: string;
  entryFee: number;
  timings: string;
  duration: string;
}

export interface ReelSpot {
  id: string;
  destinationId: string;
  destinationName: string;
  name: string;
  spotType: 'Sunset & Viewpoint' | 'Heritage & Architecture' | 'Waterfall & Mist' | 'Spiritual & Aarti' | 'Street & Culture' | 'Aerial & Drone' | 'Cafes & Nightlife' | 'Waterways & Slow Living';
  entryPrice: number; // in INR (0 = Free)
  cameraFee: number; // in INR (0 = Free)
  dronePermitted: boolean;
  tripodAllowed: boolean;
  bestAngle: string;
  lightingTime: string;
  aestheticVibe: string;
  viralAudioPrompt: string;
  recommendedTransition: string;
  creatorTips: string[];
  photos: string[];
  videoUrl?: string; // YouTube embed or direct MP4
  reelDuration?: string;
  viralScore: number; // 0 - 100
  viewsEstimate?: string;
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  country: string;
  tagline: string;
  description: string;
  type: DestinationCategory;
  climate: ClimateType;
  idealDays: number;
  estimatedBudgetPerDay: {
    budget: number;
    standard: number;
    luxury: number;
  };
  rating: number;
  reviewsCount: number;
  heroImage: string;
  galleryImages: string[];
  videoUrl?: string;
  bestTimeToVisitMonths: string;
  seasons: SeasonWeather[];
  foodAndCuisine: {
    overview: string;
    signatureDishes: Dish[];
    streetFoodSpots: string[];
  };
  culture: CultureInfo;
  places: Place[];
  creatorSpots?: ReelSpot[];
  aiScore?: number; // 0-100 calculated match score
  matchReasons?: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ItineraryDay {
  day: number;
  date?: string;
  theme: string;
  places: Place[];
  recommendedFood: string;
  morningSlot: {
    placeId: string;
    activity: string;
    travelDuration?: string;
  };
  afternoonSlot: {
    placeId: string;
    activity: string;
    travelDuration?: string;
  };
  eveningSlot: {
    placeId: string;
    activity: string;
    travelDuration?: string;
  };
  dailyCostEstimate: number;
  notes?: string;
}

export interface VehicleExpenseConfig {
  vehicleType: 'auto' | 'sedan_cab' | 'suv_cab' | 'self_drive' | 'scooter' | 'public_transit' | 'custom';
  vehicleName: string;
  dailyRate: number; // Daily rental or fare in INR
  fuelAndTollsPerDay: number; // Fuel, parking & highway tolls in INR
  driverAllowancePerDay: number; // Driver bata / food allowance
  totalDays: number;
  totalVehicleCost: number; // (dailyRate + fuelAndTolls + driverAllowance) * totalDays
  notes?: string;
}

export interface PlaceTicketConfig {
  placeId: string;
  placeName: string;
  category: string;
  adultTicket: number; // in INR
  childTicket: number; // in INR
  cameraFee: number; // in INR
  foreignVisitorTicket?: number; // in INR
  timings?: string;
  included: boolean;
  totalForGroup: number; // calculated for group size
}

export interface TripPlan {
  id: string;
  userId?: string;
  username?: string;
  destinationId: string;
  destinationName: string;
  destinationImage: string;
  state: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  travelersCount: number;
  travelerType: 'solo' | 'couple' | 'family' | 'friends';
  tripTier: TripTier;
  interests: string[];
  itinerary: ItineraryDay[];
  budgetBreakdown: {
    transport: number;
    hotel: number;
    food: number;
    attractions: number;
    activities: number;
    miscellaneous: number;
    total: number;
    perPersonCost: number;
    dailyCost: number;
  };
  vehicleExpenseConfig?: VehicleExpenseConfig;
  ticketsConfig?: PlaceTicketConfig[];
  personalizedIntro?: string;
  packingChecklist: string[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  authProvider: 'local' | 'google';
  loyaltyPoints: number;
  walletBalance: number;
  preferredClimate: ClimateType[];
  preferredTripTypes: DestinationCategory[];
  budgetRange: [number, number];
  savedDestinationIds: string[];
  savedReelSpotIds?: string[];
  isCreator?: boolean;
  socialHandle?: string;
  creatorBio?: string;
  cameraGear?: string;
  totalTripsCompleted: number;
}

export interface BookingRecord {
  id: string;
  bookingRef: string;
  username: string;
  type: 'hotel' | 'activity' | 'package' | 'trip' | 'flight' | 'train';
  title: string;
  destination: string;
  dates: string;
  guests: number;
  amountPaid: number;
  status: 'Confirmed' | 'Voucher Issued' | 'Pending' | 'Completed';
  createdAt: string;
  details: string;
  travelMode?: 'flight' | 'train' | 'car' | 'bus';
  origin?: string;
  pnr?: string;
  travelTicketDetails?: {
    operator: string;
    flightOrTrainNumber?: string;
    seatClass?: string;
    seats?: string[];
    departureTime?: string;
    arrivalTime?: string;
    origin?: string;
    destination?: string;
    ticketPricePerPerson?: number;
    totalTicketFare?: number;
    passengerList?: Array<{ name: string; age: string; gender: string; seatPref?: string }>;
    quota?: string;
    irctcUsername?: string;
  };
  hotelDetails?: {
    hotelId?: string;
    hotelName: string;
    roomType: string;
    nights: number;
    rooms: number;
    pricePerNight?: number;
    hotelPhone?: string;
    hotelWhatsapp?: string;
    hotelAddress?: string;
    hotelCheckInDate?: string;
    hotelCheckOutDate?: string;
    hotelConfirmationCode?: string;
    hotelManagerName?: string;
    hotelRating?: number;
  };
  attractionTickets?: Array<{
    id?: string;
    name: string;
    count: number;
    price: number;
    category?: string;
    entrySlot?: string;
    ticketCode?: string;
    visitingHours?: string;
  }>;
}

export interface RouteStop {
  name: string;
  lat: number;
  lng: number;
  arrivalOrder: number;
}

export interface RouteCalculationResult {
  origin: string;
  destination: string;
  stops: string[];
  totalDistanceKm: number;
  estimatedHours: {
    car: number;
    train: number;
    bus: number;
    flight?: number;
  };
  recommendedStopsAlongWay: string[];
  tollEstimate: number;
  fuelEstimate: number;
  scenicNotes: string;
}

export type RouteInfo = RouteCalculationResult;

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionPayload?: {
    type: 'suggest_destination' | 'create_itinerary' | 'budget_calc';
    destinationId?: string;
    destinationName?: string;
  };
}

export interface PackageAddon {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'activity' | 'dining' | 'wellness' | 'transport';
  icon?: string;
}

export interface DaySchedule {
  day: number;
  title: string;
  summary: string;
  morningActivity: string;
  afternoonActivity: string;
  eveningActivity: string;
  mealsIncluded: string[]; // e.g. ["Breakfast", "Dinner"]
  stayHotel: string;
  scenicTips?: string;
}

export interface HolidayPackage {
  id: string;
  title: string;
  slug: string;
  destinationId: string;
  destinationName: string;
  state: string;
  durationDays: number;
  durationNights: number;
  pricePerPerson: number;
  originalPricePerPerson: number;
  rating: number;
  reviewsCount: number;
  heroImage: string;
  galleryImages: string[];
  theme: 'Honeymoon' | 'Family Fun' | 'Adventure Trek' | 'Luxury Retreat' | 'Spiritual & Heritage' | 'Weekend Getaway' | 'Wildlife Safari';
  tier: TripTier;
  pickupDropLocation: string;
  hotelStarRating: number;
  inclusions: string[];
  exclusions: string[];
  dayWiseSchedule: DaySchedule[];
  customizableAddons: PackageAddon[];
  availableDates: string[];
  cancellationPolicy: string;
  badge?: string; // e.g. "Bestseller", "Top Rated 2026", "Limited Deal"
}

export interface TransitOption {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'cab';
  operatorName: string;
  flightTrainNumber: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  classType: string;
  stops: string;
  baggage: string;
  seatsAvailable: number;
  mealIncluded: boolean;
}

export interface TravelExperience {
  id: string;
  title: string;
  destinationId: string;
  destinationName: string;
  category: 'Water Sports' | 'Plantation & Nature' | 'Heritage Walk' | 'Safari & Wildlife' | 'Culinary Tour' | 'Adventure Trek';
  duration: string;
  pricePerPerson: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  groupSize: string;
  instructor: string;
  language: string;
  inclusions: string[];
  timeSlots: string[];
  highlights: string[];
  locationSpot: string;
}

export interface PackingItem {
  id: string;
  name: string;
  category: 'Clothing' | 'Electronics' | 'Toiletries' | 'Documents' | 'Medication' | 'Adventure/Seasonal';
  essential: boolean;
  packed: boolean;
  weightGrams: number;
  climateMatch?: ClimateType[];
}

export interface WeatherForecastDay {
  dayName: string;
  dateStr: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  iconName: string;
  precipitationProb: number;
  humidity: number;
  uvIndex: number;
  aqi: number;
  advisory: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  category: 'Police' | 'Medical' | 'Tourism' | 'Women Safety' | 'Disaster Management';
  description: string;
  availableHours: string;
}

export interface RecommendationRequest {
  budget: number;
  budgetType?: 'per_day' | 'total';
  strictBudget?: boolean;
  budgetPerDay?: number;
  climate?: string;
  state?: string;
  tripType?: string;
  tripTypes?: string[];
  days?: number;
  interests?: string[];
  travelerType?: string;
  placeQuery?: string;
}
