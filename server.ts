import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

import { resolveDestination } from './src/utils/destinationResolver.ts';
import {
  INITIAL_DESTINATIONS,
  HOTELS_DATABASE,
  ATTRACTIONS_DATABASE,
  PACKAGES_DATABASE,
  TRANSIT_DATABASE,
  EXPERIENCES_DATABASE,
  DEFAULT_PACKING_ITEMS,
  EMERGENCY_CONTACTS_DATABASE,
} from './src/data/travelDatabase.ts';
import { runHybridRecommendation } from './src/utils/recommendationEngine.ts';
import { computeRealTimeTransitCost } from './src/utils/transitPricing.ts';
import {
  Destination,
  Hotel,
  Attraction,
  TripPlan,
  BookingRecord,
  UserProfile,
  HolidayPackage,
  TransitOption,
  TravelExperience,
  PackingItem,
  EmergencyContact,
} from './src/types/travel.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory state store for dynamic runtime user data
const state = {
  destinations: [...INITIAL_DESTINATIONS] as Destination[],
  hotels: [...HOTELS_DATABASE] as Hotel[],
  attractions: [...ATTRACTIONS_DATABASE] as Attraction[],
  packages: [...PACKAGES_DATABASE] as HolidayPackage[],
  transits: [...TRANSIT_DATABASE] as TransitOption[],
  experiences: [...EXPERIENCES_DATABASE] as TravelExperience[],
  packingItems: [...DEFAULT_PACKING_ITEMS] as PackingItem[],
  emergencyContacts: [...EMERGENCY_CONTACTS_DATABASE] as EmergencyContact[],
  savedTrips: new Map<string, string[]>(), // username -> destinationIds / tripIds
  userTrips: new Map<string, TripPlan[]>(), // username -> TripPlan[]
  bookings: [
    {
      id: 'bk-101',
      bookingRef: 'MGT-89421',
      username: 'moksgnateja@gmail.com',
      type: 'hotel' as const,
      title: 'Evolve Back Plantation Villa',
      destination: 'Coorg (Kodagu)',
      dates: 'Oct 14 - Oct 18, 2026',
      guests: 2,
      amountPaid: 56000,
      status: 'Confirmed' as const,
      createdAt: '2026-08-20T10:15:00.000Z',
      details: 'Heritage Pool Villa with breakfast included and complimentary spice estate walk.',
    },
    {
      id: 'bk-102',
      bookingRef: 'MGT-94512',
      username: 'moksgnateja@gmail.com',
      type: 'package' as const,
      title: 'Vembanad Lake Houseboat Overnight',
      destination: 'Alleppey (Backwaters)',
      dates: 'Nov 02 - Nov 04, 2026',
      guests: 2,
      amountPaid: 17000,
      status: 'Voucher Issued' as const,
      createdAt: '2026-08-22T14:30:00.000Z',
      details: 'Deluxe A/C 1-Bedroom Kettuvallam with all meals prepared onboard.',
    },
  ] as BookingRecord[],
  users: [
    {
      id: 'usr-1',
      username: 'moksgnateja@gmail.com',
      fullName: 'Mokshagna Teja',
      email: 'moksgnateja@gmail.com',
      phone: '+91 98765 43210',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      authProvider: 'google' as const,
      loyaltyPoints: 1250,
      walletBalance: 3500,
      preferredClimate: ['cool' as const, 'tropical' as const],
      preferredTripTypes: ['Hill Stations' as const, 'Beaches' as const],
      budgetRange: [15000, 60000] as [number, number],
      savedDestinationIds: ['coorg', 'munnar', 'kerala-backwaters'],
      totalTripsCompleted: 4,
    },
  ] as UserProfile[],
};

// Gemini AI Client Helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------
// 1. AUTHENTICATION ENDPOINTS
// ----------------------------------------------------

app.post('/api/register', (req, res) => {
  const { fullName, email, phone, password } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ success: false, message: 'Full name, email and password are required' });
  }

  const existing = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists' });
  }

  const newUser: UserProfile = {
    id: `usr-${Date.now()}`,
    username: email,
    fullName,
    email,
    phone: phone || '',
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
    authProvider: 'local',
    loyaltyPoints: 500, // Welcome reward bonus!
    walletBalance: 1000,
    preferredClimate: ['cool', 'moderate'],
    preferredTripTypes: ['Hill Stations', 'Heritage'],
    budgetRange: [10000, 50000],
    savedDestinationIds: ['coorg'],
    totalTripsCompleted: 0,
  };

  state.users.push(newUser);
  res.json({
    success: true,
    message: 'Registration successful! 500 Loyalty points credited.',
    user: newUser,
  });
});

app.post('/api/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier) {
    return res.status(400).json({ success: false, message: 'Email or phone number is required' });
  }

  let user = state.users.find(
    (u) =>
      u.email.toLowerCase() === identifier.toLowerCase() ||
      (u.phone && u.phone.includes(identifier)) ||
      u.username.toLowerCase() === identifier.toLowerCase()
  );

  if (!user) {
    // If not found, create a guest or demo user session gracefully
    user = {
      id: `usr-${Date.now()}`,
      username: identifier,
      fullName: identifier.split('@')[0] || 'Traveler',
      email: identifier.includes('@') ? identifier : `${identifier}@mgtravels.ai`,
      phone: !identifier.includes('@') ? identifier : '',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(identifier)}`,
      authProvider: 'local',
      loyaltyPoints: 500,
      walletBalance: 1000,
      preferredClimate: ['cool'],
      preferredTripTypes: ['Hill Stations', 'Beaches'],
      budgetRange: [15000, 50000],
      savedDestinationIds: ['coorg', 'munnar'],
      totalTripsCompleted: 1,
    };
    state.users.push(user);
  }

  res.json({
    success: true,
    message: 'Login successful',
    user,
  });
});

app.post('/api/google-auth', (req, res) => {
  const { idToken, email, name, picture } = req.body;
  const userEmail = email || 'google.traveler@gmail.com';
  const userName = name || 'Google Traveler';

  let user = state.users.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
  if (!user) {
    user = {
      id: `usr-g-${Date.now()}`,
      username: userEmail,
      fullName: userName,
      email: userEmail,
      phone: '',
      avatarUrl: picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      authProvider: 'google',
      loyaltyPoints: 1000, // Google Sign-in bonus
      walletBalance: 2000,
      preferredClimate: ['cool', 'tropical'],
      preferredTripTypes: ['Hill Stations', 'Adventure'],
      budgetRange: [20000, 80000],
      savedDestinationIds: ['coorg', 'goa'],
      totalTripsCompleted: 2,
    };
    state.users.push(user);
  }

  res.json({
    success: true,
    message: 'Google authentication successful',
    user,
  });
});

// ----------------------------------------------------
// 2. DESTINATIONS & HYBRID RECOMMENDATION API
// ----------------------------------------------------

app.get('/api/destinations', (req, res) => {
  res.json({
    success: true,
    total: state.destinations.length,
    destinations: state.destinations,
  });
});

app.get('/api/destination/:id', (req, res) => {
  const dest = state.destinations.find(
    (d) => d.id.toLowerCase() === req.params.id.toLowerCase() || d.name.toLowerCase().includes(req.params.id.toLowerCase())
  );
  if (!dest) {
    return res.status(404).json({ success: false, message: 'Destination not found' });
  }
  res.json({ success: true, destination: dest });
});

app.post('/api/recommend', (req, res) => {
  const { budget = 25000, climate, state: reqState, tripType, days = 4, interests = [] } = req.body;
  const scored = runHybridRecommendation(state.destinations, {
    budget,
    climate,
    state: reqState,
    tripType,
    days,
    interests,
  });

  res.json({
    success: true,
    count: scored.length,
    recommendations: scored,
  });
});

// Helper to fetch real Wikipedia extract, coordinates, and authentic photo
async function fetchWikipediaData(query: string): Promise<{ imageUrl?: string; extract?: string; coordinates?: { lat: number; lng: number } } | null> {
  try {
    const clean = encodeURIComponent(query.trim().replace(/[\(\),]/g, ' ').trim());
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${clean}`, {
      headers: { 'User-Agent': 'MGTravels-App/1.0' },
    });
    if (res.ok) {
      const data = await res.json();
      return {
        imageUrl: data.originalimage?.source || data.thumbnail?.source,
        extract: data.extract,
        coordinates: data.coordinates ? { lat: data.coordinates.lat, lng: data.coordinates.lon } : undefined,
      };
    }
  } catch (e) {
    // fallback gracefully
  }
  return null;
}

// Category-based authentic curated photography library ensuring distinct, high-definition imagery
function getAuthenticPlacePhoto(placeName: string, category: string, index: number): string {
  const lower = (placeName + ' ' + category).toLowerCase();
  
  if (lower.includes('fort') || lower.includes('kote') || lower.includes('citadel') || lower.includes('rampart') || lower.includes('durga')) {
    const fortPhotos = [
      'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600100397608-f010e42e5a40?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80',
    ];
    return fortPhotos[index % fortPhotos.length];
  }
  
  if (lower.includes('temple') || lower.includes('gudi') || lower.includes('shrine') || lower.includes('basadi') || lower.includes('nandi') || lower.includes('heritage')) {
    const templePhotos = [
      'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    ];
    return templePhotos[index % templePhotos.length];
  }
  
  if (lower.includes('dam') || lower.includes('reservoir') || lower.includes('lake') || lower.includes('river') || lower.includes('kalyani')) {
    const waterPhotos = [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    ];
    return waterPhotos[index % waterPhotos.length];
  }
  
  if (lower.includes('market') || lower.includes('bazaar') || lower.includes('silk') || lower.includes('food') || lower.includes('street')) {
    const marketPhotos = [
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80',
    ];
    return marketPhotos[index % marketPhotos.length];
  }
  
  if (lower.includes('peak') || lower.includes('trek') || lower.includes('hill') || lower.includes('viewpoint') || lower.includes('sunrise')) {
    const hillPhotos = [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    ];
    return hillPhotos[index % hillPhotos.length];
  }

  const generalPhotos = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
  ];
  return generalPhotos[index % generalPhotos.length];
}

// Real-Time Place Photo API Endpoint
app.get('/api/realtime-place-photo', async (req, res) => {
  const query = (req.query.query as string) || '';
  if (!query) {
    return res.status(400).json({ success: false, message: 'Query required' });
  }

  const wikiData = await fetchWikipediaData(query);
  if (wikiData?.imageUrl) {
    return res.json({ success: true, imageUrl: wikiData.imageUrl, source: 'wikipedia' });
  }

  const fallback = getAuthenticPlacePhoto(query, '', 0);
  return res.json({ success: true, imageUrl: fallback, source: 'curated-authentic' });
});

// Helper to create a fallback structured destination if AI model is unavailable or in high demand
function createFallbackDestination(destinationName: string): Destination {
  return resolveDestination(destinationName);
}

// Dynamic AI Destination Generator (for any Indian / Global destination entered by user)
app.post('/api/generate-destination', async (req, res) => {
  const { destinationName } = req.body;
  if (!destinationName) {
    return res.status(400).json({ success: false, message: 'Destination name is required' });
  }

  // Check if exists in existing catalog
  const existing = state.destinations.find(
    (d) => d.name.toLowerCase() === destinationName.toLowerCase() || d.id.toLowerCase() === destinationName.toLowerCase()
  );
  if (existing) {
    return res.json({ success: true, destination: existing, source: 'database' });
  }

  // Check if it resolves to a verified known destination (e.g. Bagepalli, Chikkaballapura, Lepakshi, etc.)
  const resolved = resolveDestination(destinationName);
  if (resolved.id === 'bagepalli' || resolved.id === 'chikkaballapur' || resolved.id === 'lepakshi' || resolved.id === 'nagwara' || resolved.id === 'chikmagalur') {
    state.destinations.unshift(resolved);
    return res.json({ success: true, destination: resolved, source: 'verified-gazetteer' });
  }

  // Fetch real-time Wikipedia context & authentic photo for this destination
  const wikiData = await fetchWikipediaData(destinationName);

  const ai = getGeminiClient();
  if (!ai) {
    const fallbackDest = createFallbackDestination(destinationName);
    if (wikiData?.imageUrl) {
      fallbackDest.heroImage = wikiData.imageUrl;
      fallbackDest.galleryImages = [wikiData.imageUrl, ...fallbackDest.galleryImages.slice(1)];
    }
    if (wikiData?.extract) {
      fallbackDest.description = wikiData.extract;
    }
    state.destinations.unshift(fallbackDest);
    return res.json({ success: true, destination: fallbackDest, source: 'ai-fallback' });
  }

  try {
    const prompt = `You are a real-time factual travel intelligence system. Generate a complete, highly realistic JSON destination profile for: "${destinationName}".
    IMPORTANT RULES:
    1. Provide REAL, geographically accurate facts. State and Country MUST be factual (e.g. if Bagepalli, state is Karnataka, district is Chikkaballapura, country is India).
    2. Do NOT make up generic attraction names like "Panoramic Waterfront" or "Cultural Plaza". Provide the ACTUAL famous historical fortresses, ancient temples, river dams, trekking peaks, or traditional markets in or immediately adjacent to ${destinationName}.
    3. Provide REAL signature cuisine of that specific district/region (e.g., Ragi Mudde, Benne Dosa, Donne Biryani).
    4. Provide 4 to 5 distinct places to visit.
    
    Return ONLY valid JSON matching this schema:
    {
      "name": "${destinationName}",
      "state": "Accurate State/District",
      "country": "Accurate Country",
      "tagline": "Compelling factual 1-line summary",
      "description": "Engaging 2-3 sentence factual overview of the place's heritage, nature, and culture",
      "type": "Hill Stations" | "Beaches" | "Heritage" | "Wildlife" | "Pilgrimage" | "Adventure" | "Backwaters" | "Luxury",
      "climate": "cool" | "tropical" | "moderate" | "dry" | "snowy" | "monsoon",
      "idealDays": 2,
      "estimatedBudgetPerDay": { "budget": 650, "standard": 2200, "luxury": 7500 },
      "rating": 4.8,
      "bestTimeToVisitMonths": "e.g. October to March",
      "seasons": [
        { "season": "Winter (Oct - Feb)", "avgTemp": "16°C - 28°C", "rainfall": "Low", "suitability": "Peak", "description": "Pleasant and breezy" }
      ],
      "foodAndCuisine": {
        "overview": "Overview of authentic local gastronomy",
        "signatureDishes": [
          { "name": "Authentic Dish 1", "description": "Preparation and flavors", "type": "veg", "spiceLevel": "medium", "famousSpot": "Popular local eatery" },
          { "name": "Authentic Dish 2", "description": "Preparation and flavors", "type": "non-veg", "spiceLevel": "spicy", "famousSpot": "Popular local eatery" }
        ],
        "streetFoodSpots": ["Market Street 1", "Eatery Line 2"]
      },
      "culture": {
        "languages": ["Regional Language", "English"],
        "festivals": ["Festival 1", "Festival 2"],
        "traditions": ["Tradition 1"],
        "etiquetteTips": ["Tip 1", "Tip 2"]
      },
      "coordinates": { "lat": 13.5, "lng": 77.5 },
      "places": [
        {
          "id": "p1",
          "name": "Actual Real Attraction Name",
          "category": "Heritage & History",
          "description": "Factual description of this landmark",
          "lat": 13.52,
          "lng": 77.53,
          "entryFee": 20,
          "timeNeeded": "2.5 hours",
          "bestTimeToVisit": "Morning",
          "rating": 4.8,
          "reviewsCount": 2100,
          "highlight": "Specific real architectural or scenic highlight",
          "recommendedTimeSlot": "morning"
        }
      ]
    }`;

    let responseText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
      responseText = response.text || '';
    } catch (apiErr: any) {
      console.warn('Gemini API high demand / temporary error for generate-destination, using rich intelligent fallback:', apiErr?.message || apiErr);
      const fallbackDest = createFallbackDestination(destinationName);
      if (wikiData?.imageUrl) {
        fallbackDest.heroImage = wikiData.imageUrl;
      }
      state.destinations.unshift(fallbackDest);
      return res.json({ success: true, destination: fallbackDest, source: 'ai-fallback' });
    }

    const parsed = JSON.parse(responseText || '{}');
    const heroImg = wikiData?.imageUrl || resolved.heroImage || 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1400&q=80';
    
    // Assign distinct, authentic photos to each place (never repeat the hero image and never use generic volcanos)
    const enrichedPlaces = (parsed.places || []).map((p: any, idx: number) => {
      const photo = getAuthenticPlacePhoto(p.name || '', p.category || '', idx);
      return {
        ...p,
        images: [photo],
      };
    });

    const newDest: Destination = {
      ...parsed,
      id: destinationName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      heroImage: heroImg,
      galleryImages: [
        heroImg,
        'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      ],
      videoUrl: 'https://www.youtube.com/embed/5F_XW7k-Fw8',
      places: enrichedPlaces.length > 0 ? enrichedPlaces : resolved.places,
    };

    state.destinations.unshift(newDest);
    res.json({ success: true, destination: newDest, source: 'gemini-ai' });
  } catch (error) {
    console.error('AI Destination Generation error, responding with structured destination:', error);
    const fallbackDest = createFallbackDestination(destinationName);
    state.destinations.unshift(fallbackDest);
    res.json({ success: true, destination: fallbackDest, source: 'ai-fallback' });
  }
});

// ----------------------------------------------------
// 3. HOTELS, ATTRACTIONS & WEATHER ENDPOINTS
// ----------------------------------------------------

app.get('/api/hotels', (req, res) => {
  res.json({ success: true, hotels: state.hotels });
});

app.get('/api/hotels/:destination', (req, res) => {
  const query = req.params.destination.toLowerCase();
  const matched = state.hotels.filter(
    (h) => h.destinationId.toLowerCase() === query || h.destinationName.toLowerCase().includes(query)
  );
  res.json({ success: true, count: matched.length, hotels: matched.length > 0 ? matched : state.hotels });
});

app.get('/api/attractions', (req, res) => {
  res.json({ success: true, attractions: state.attractions });
});

app.get('/api/attractions/:destination', (req, res) => {
  const query = req.params.destination.toLowerCase();
  const matched = state.attractions.filter(
    (a) => a.destinationId.toLowerCase() === query || a.destinationName.toLowerCase().includes(query)
  );
  res.json({ success: true, count: matched.length, attractions: matched.length > 0 ? matched : state.attractions });
});

app.get('/api/weather/:location', (req, res) => {
  const loc = req.params.location.toLowerCase();
  // Simulated intelligent live weather generator for travel
  const isCool = loc.includes('coorg') || loc.includes('munnar') || loc.includes('ooty') || loc.includes('manali') || loc.includes('ladakh');
  const temp = isCool ? (loc.includes('manali') || loc.includes('ladakh') ? 8 : 19) : 29;

  res.json({
    success: true,
    location: req.params.location,
    temperature: `${temp}°C`,
    condition: isCool ? 'Pleasant & Misty' : 'Sunny & Clear Breeze',
    humidity: '68%',
    windSpeed: '12 km/h',
    rainProbability: isCool ? '15%' : '5%',
    uvIndex: 4,
    forecast: [
      { day: 'Today', temp: `${temp}°C`, condition: isCool ? 'Partly Cloudy' : 'Sunny' },
      { day: 'Tomorrow', temp: `${temp + 1}°C`, condition: 'Clear Sky' },
      { day: 'Day 3', temp: `${temp - 1}°C`, condition: 'Mild Mist' },
      { day: 'Day 4', temp: `${temp}°C`, condition: 'Pleasant Breeze' },
    ],
  });
});

// ----------------------------------------------------
// 4. TRIPS, SAVED TRIPS & BOOKINGS API
// ----------------------------------------------------

app.post('/api/trips', (req, res) => {
  const trip = req.body as TripPlan;
  const username = trip.username || 'moksgnateja@gmail.com';

  const userTripList = state.userTrips.get(username) || [];
  userTripList.unshift(trip);
  state.userTrips.set(username, userTripList);

  res.json({ success: true, message: 'Trip itinerary saved successfully!', trip });
});

app.get('/api/trips/:username', (req, res) => {
  const username = req.params.username;
  const trips = state.userTrips.get(username) || [];
  res.json({ success: true, total: trips.length, trips });
});

app.post('/api/saved-trips', (req, res) => {
  const { username = 'moksgnateja@gmail.com', destinationId } = req.body;
  const current = state.savedTrips.get(username) || ['coorg', 'munnar'];
  if (!current.includes(destinationId)) {
    current.push(destinationId);
  } else {
    // toggle off
    const idx = current.indexOf(destinationId);
    current.splice(idx, 1);
  }
  state.savedTrips.set(username, current);
  res.json({ success: true, savedDestinationIds: current });
});

app.get('/api/saved-trips/:username', (req, res) => {
  const username = req.params.username;
  const savedIds = state.savedTrips.get(username) || ['coorg', 'munnar', 'kerala-backwaters'];
  const matchedDestinations = state.destinations.filter((d) => savedIds.includes(d.id));
  res.json({ success: true, count: matchedDestinations.length, savedDestinations: matchedDestinations });
});

app.post('/api/bookings', (req, res) => {
  const { username = 'moksgnateja@gmail.com', title, destination, dates, guests = 2, amountPaid, type = 'hotel' } = req.body;
  const newBooking: BookingRecord = {
    id: `bk-${Date.now()}`,
    bookingRef: `MGT-${Math.floor(10000 + Math.random() * 90000)}`,
    username,
    type,
    title: title || 'Luxury Stay Reservation',
    destination: destination || 'Coorg',
    dates: dates || 'Upcoming Weekend',
    guests,
    amountPaid: amountPaid || 12000,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
    details: `Instant confirmation with MG Travels instant loyalty points applied.`,
  };

  state.bookings.unshift(newBooking);
  res.json({ success: true, message: 'Booking confirmed successfully!', booking: newBooking });
});

app.get('/api/bookings/:username', (req, res) => {
  const username = req.params.username;
  const userBookings = state.bookings.filter((b) => b.username.toLowerCase() === username.toLowerCase() || username === 'all');
  res.json({ success: true, total: userBookings.length, bookings: userBookings });
});

// ----------------------------------------------------
// 4. PACKAGES, FLIGHTS, TRANSIT & EXPERIENCE ENDPOINTS
// ----------------------------------------------------

app.get('/api/packages', (req, res) => {
  const { destination, theme, maxPrice } = req.query;
  let result = [...state.packages];

  if (destination && typeof destination === 'string') {
    const dLower = destination.toLowerCase();
    result = result.filter(
      (p) =>
        p.destinationId.toLowerCase().includes(dLower) ||
        p.destinationName.toLowerCase().includes(dLower) ||
        p.state.toLowerCase().includes(dLower)
    );
  }

  if (theme && typeof theme === 'string' && theme !== 'All') {
    result = result.filter((p) => p.theme === theme);
  }

  if (maxPrice && !isNaN(Number(maxPrice))) {
    result = result.filter((p) => p.pricePerPerson <= Number(maxPrice));
  }

  res.json({ success: true, count: result.length, packages: result });
});

app.get('/api/packages/:id', (req, res) => {
  const pkg = state.packages.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!pkg) {
    return res.status(404).json({ success: false, message: 'Package not found' });
  }
  res.json({ success: true, package: pkg });
});

app.post('/api/packages/book', (req, res) => {
  const {
    packageId,
    username = 'moksgnateja@gmail.com',
    travelerName,
    travelerPhone,
    travelerEmail,
    travelDate,
    adults = 2,
    children = 0,
    hotelTier = 'standard',
    selectedAddonIds = [],
    pickupLocation,
    specialRequests,
    paymentMethod = 'UPI',
    loyaltyPointsRedeemed = 0,
    promoCode,
  } = req.body;

  const pkg = state.packages.find((p) => p.id === packageId);
  if (!pkg) {
    return res.status(404).json({ success: false, message: 'Invalid package ID selected' });
  }

  const basePricePerPerson = pkg.pricePerPerson;
  let totalPerPerson = basePricePerPerson;
  if (hotelTier === 'luxury') totalPerPerson += 4000;

  let totalAmount = totalPerPerson * (Number(adults) + Number(children) * 0.7);

  // Add selected addons
  let addonsCost = 0;
  if (Array.isArray(selectedAddonIds) && selectedAddonIds.length > 0) {
    pkg.customizableAddons.forEach((addon) => {
      if (selectedAddonIds.includes(addon.id)) {
        addonsCost += addon.price;
      }
    });
  }
  totalAmount += addonsCost;

  // Promo code discount
  let promoDiscount = 0;
  if (promoCode && promoCode.toUpperCase() === 'MGTRAVELS500') {
    promoDiscount = 500;
  } else if (promoCode && promoCode.toUpperCase() === 'HOLIDAY2026') {
    promoDiscount = Math.round(totalAmount * 0.1);
  }

  // Loyalty points discount (1 point = ₹1)
  const loyaltyDiscount = Math.min(Number(loyaltyPointsRedeemed) || 0, Math.round(totalAmount * 0.2));
  const finalAmount = Math.max(1000, Math.round(totalAmount - promoDiscount - loyaltyDiscount));

  // Earn 5% loyalty points on booking
  const pointsEarned = Math.round(finalAmount * 0.05);

  const newBooking: BookingRecord = {
    id: `bk-pkg-${Date.now()}`,
    bookingRef: `MGT-PKG-${Math.floor(10000 + Math.random() * 90000)}`,
    username,
    type: 'package',
    title: pkg.title,
    destination: pkg.destinationName,
    dates: `${travelDate || 'Selected Dates'} (${pkg.durationDays}D / ${pkg.durationNights}N)`,
    guests: Number(adults) + Number(children),
    amountPaid: finalAmount,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
    details: `${pkg.durationDays} Days / ${pkg.durationNights} Nights | Hotel: ${pkg.hotelStarRating}★ | Pickup: ${pickupLocation || pkg.pickupDropLocation} | Contact: ${travelerName || 'Primary Traveler'} (${travelerPhone || '+91-9876543210'}) | Addons: ${selectedAddonIds.length} included | Payment: ${paymentMethod} | Points Credited: +${pointsEarned} pts.`,
  };

  state.bookings.unshift(newBooking);

  // Update user profile loyalty points if user exists
  const user = state.users.find((u) => u.username === username || u.email === username);
  if (user) {
    user.loyaltyPoints = (user.loyaltyPoints || 0) - loyaltyDiscount + pointsEarned;
    user.totalTripsCompleted = (user.totalTripsCompleted || 0) + 1;
  }

  res.json({
    success: true,
    message: 'Package booking successfully confirmed! Voucher and itinerary generated.',
    booking: newBooking,
    pointsEarned,
    finalAmount,
    voucherUrl: `/vouchers/${newBooking.bookingRef}`,
  });
});

app.get('/api/transits', (req, res) => {
  const { type, origin, destination } = req.query;
  let list = [...state.transits];

  if (type && type !== 'all') {
    list = list.filter((t) => t.type === type);
  }

  if (origin && typeof origin === 'string') {
    list = list.filter((t) => t.origin.toLowerCase().includes(origin.toLowerCase()) || t.originCode.toLowerCase().includes(origin.toLowerCase()));
  }

  if (destination && typeof destination === 'string') {
    list = list.filter((t) => t.destination.toLowerCase().includes(destination.toLowerCase()) || t.destinationCode.toLowerCase().includes(destination.toLowerCase()));
  }

  res.json({ success: true, count: list.length, transits: list });
});

// Real-Time Multi-Modal Travel Fare & Cost Computation API
app.post('/api/transit/live-fares', (req, res) => {
  const {
    origin = 'Bangalore',
    destination = 'Goa',
    passengers = 1,
    fuelType = 'petrol',
    carCategory = 'sedan',
    travelDate,
  } = req.body;

  const result = computeRealTimeTransitCost(
    origin,
    destination,
    Number(passengers) || 1,
    fuelType,
    carCategory,
    travelDate
  );

  res.json({
    success: true,
    data: result,
  });
});

app.post('/api/transits/book', (req, res) => {
  const { transitId, username = 'moksgnateja@gmail.com', passengerCount = 1, travelDate, passengerNames = [] } = req.body;
  const transit = state.transits.find((t) => t.id === transitId);
  if (!transit) {
    return res.status(404).json({ success: false, message: 'Transit route not found' });
  }

  const amountPaid = transit.price * passengerCount;
  const newBooking: BookingRecord = {
    id: `bk-tr-${Date.now()}`,
    bookingRef: `MGT-TR-${Math.floor(10000 + Math.random() * 90000)}`,
    username,
    type: 'activity',
    title: `${transit.operatorName} (${transit.flightTrainNumber})`,
    destination: `${transit.originCode} → ${transit.destinationCode}`,
    dates: travelDate || 'Confirmed Travel Date',
    guests: passengerCount,
    amountPaid,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
    details: `${transit.classType} | Departure: ${transit.departureTime} | Arrival: ${transit.arrivalTime} | Baggage: ${transit.baggage} | Passenger(s): ${passengerNames.join(', ') || passengerCount + ' Passenger(s)'}`,
  };

  state.bookings.unshift(newBooking);
  res.json({ success: true, message: 'Transit ticket confirmed successfully!', booking: newBooking });
});

app.get('/api/experiences', (req, res) => {
  const { destinationId, category } = req.query;
  let list = [...state.experiences];

  if (destinationId && typeof destinationId === 'string') {
    list = list.filter((e) => e.destinationId.toLowerCase().includes(destinationId.toLowerCase()));
  }

  if (category && typeof category === 'string' && category !== 'All') {
    list = list.filter((e) => e.category === category);
  }

  res.json({ success: true, count: list.length, experiences: list });
});

app.post('/api/experiences/book', (req, res) => {
  const { experienceId, username = 'moksgnateja@gmail.com', guests = 2, selectedDate, timeSlot } = req.body;
  const exp = state.experiences.find((e) => e.id === experienceId);
  if (!exp) {
    return res.status(404).json({ success: false, message: 'Experience not found' });
  }

  const amountPaid = exp.pricePerPerson * guests;
  const newBooking: BookingRecord = {
    id: `bk-exp-${Date.now()}`,
    bookingRef: `MGT-EXP-${Math.floor(10000 + Math.random() * 90000)}`,
    username,
    type: 'activity',
    title: exp.title,
    destination: exp.destinationName,
    dates: `${selectedDate || 'Upcoming Weekend'} (${timeSlot || exp.timeSlots[0]})`,
    guests,
    amountPaid,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
    details: `Instructor: ${exp.instructor} | Language: ${exp.language} | Spot: ${exp.locationSpot} | Inclusions: ${exp.inclusions.join(', ')}`,
  };

  state.bookings.unshift(newBooking);
  res.json({ success: true, message: 'Experience booked successfully!', booking: newBooking });
});

app.get('/api/emergency-contacts', (req, res) => {
  res.json({ success: true, emergencyContacts: state.emergencyContacts });
});

app.get('/api/packing-checklist/:destinationId', (req, res) => {
  const dest = state.destinations.find((d) => d.id.toLowerCase() === req.params.destinationId.toLowerCase());
  const climate = dest?.climate || 'moderate';

  const tailoredList = state.packingItems.filter((item) => {
    if (!item.climateMatch) return true;
    return item.climateMatch.includes(climate as any);
  });

  res.json({
    success: true,
    destination: dest?.name || 'Your Trip',
    climate,
    totalItems: tailoredList.length,
    items: tailoredList,
  });
});

app.post('/api/budget/calculate', (req, res) => {
  const {
    travelers = 2,
    days = 4,
    tier = 'standard',
    transportMode = 'flight', // 'flight' | 'train' | 'car' | 'bus'
    destinationBudgetPerDay = 5000,
  } = req.body;

  const transportBase = transportMode === 'flight' ? 7000 : transportMode === 'train' ? 1500 : 2500;
  const hotelRate = tier === 'luxury' ? 16000 : tier === 'standard' ? 4500 : 1800;
  const foodRate = tier === 'luxury' ? 2500 : tier === 'standard' ? 1000 : 500;
  const activityRate = tier === 'luxury' ? 2000 : tier === 'standard' ? 800 : 300;

  const transport = transportBase * travelers;
  const hotel = hotelRate * (days > 1 ? days - 1 : 1);
  const food = foodRate * days * travelers;
  const attractions = 600 * days * travelers;
  const activities = activityRate * days * travelers;
  const miscellaneous = 500 * days * travelers;

  const total = transport + hotel + food + attractions + activities + miscellaneous;

  res.json({
    success: true,
    breakdown: {
      transport,
      hotel,
      food,
      attractions,
      activities,
      miscellaneous,
      total,
      perPersonCost: Math.round(total / travelers),
      dailyCost: Math.round(total / days),
    },
  });
});

app.post('/api/route', (req, res) => {
  const { origin = 'Bangalore', destination = 'Coorg', stops = [] } = req.body;

  // Approximate realistic routes
  let distanceKm = 245;
  let carHours = 5.2;
  let trainHours = 6.5;
  let busHours = 6.0;

  if (destination.toLowerCase().includes('munnar')) {
    distanceKm = 480;
    carHours = 9.5;
    trainHours = 11.0;
  } else if (destination.toLowerCase().includes('goa')) {
    distanceKm = 560;
    carHours = 10.5;
    trainHours = 12.0;
  } else if (destination.toLowerCase().includes('manali')) {
    distanceKm = 520; // from Delhi
    carHours = 11.0;
    busHours = 13.0;
  }

  // Adjust for extra stops
  distanceKm += stops.length * 45;
  carHours += stops.length * 1.2;

  res.json({
    success: true,
    route: {
      origin,
      destination,
      stops,
      totalDistanceKm: distanceKm,
      estimatedHours: {
        car: Math.round(carHours * 10) / 10,
        train: Math.round(trainHours * 10) / 10,
        bus: Math.round(busHours * 10) / 10,
        flight: 1.2,
      },
      recommendedStopsAlongWay: ['Mysore Palace Highway Food Court', 'Kushalnagar Bamboo Forest Cafe', 'Scenic Ghats Viewpoint'],
      tollEstimate: Math.round(distanceKm * 0.9),
      fuelEstimate: Math.round(distanceKm * 7.5),
      scenicNotes: 'Picturesque mountain hairpin curves with lush canopy covers and roadside tea stalls.',
    },
  });
});

// ----------------------------------------------------
// 6. AI TRAVEL ASSISTANT (RAG + GEMINI 3.7 FLASH)
// ----------------------------------------------------

app.post('/api/assistant', async (req, res) => {
  const { message, conversationHistory = [] } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, message: 'User prompt is required' });
  }

  // RAG Context Retrieval: Retrieve relevant destination, hotel and attractions from memory
  const relevantDestinations = state.destinations.map((d) => ({
    name: d.name,
    state: d.state,
    tagline: d.tagline,
    type: d.type,
    climate: d.climate,
    bestMonths: d.bestTimeToVisitMonths,
    dishes: d.foodAndCuisine.signatureDishes.map((s) => s.name).join(', '),
    places: d.places.map((p) => p.name).join(', '),
  }));

  // Intelligent contextual assistant responder (for offline / high-demand / fallback states)
  const generateContextualFallbackReply = (query: string) => {
    const lower = query.toLowerCase();

    // Match destinations from database
    const matchedDest = state.destinations.find(
      (d) => lower.includes(d.name.toLowerCase()) || lower.includes(d.id.toLowerCase()) || lower.includes(d.state.toLowerCase())
    );

    if (matchedDest) {
      const placesList = matchedDest.places.slice(0, 4).map((p, i) => `• **Day ${i + 1}**: Visit **${p.name}** (${p.highlight || p.category}) - Best time: ${p.bestTimeToVisit}`).join('\n');
      const dishes = matchedDest.foodAndCuisine.signatureDishes.map((d) => `*${d.name}*`).join(', ');
      return {
        reply: `### **${matchedDest.name} (${matchedDest.state}) Tailored Itinerary**\n\n${matchedDest.tagline}\n\n**Recommended Day-by-Day Schedule (${matchedDest.idealDays} Days):**\n${placesList}\n\n🍲 **Must-Try Local Flavors**: ${dishes}\n\n🌤️ **Best Season**: ${matchedDest.bestTimeToVisitMonths}\n\n💰 **Estimated Daily Budget**: Backpacker: ₹${matchedDest.estimatedBudgetPerDay.budget.toLocaleString()}/day | Standard: ₹${matchedDest.estimatedBudgetPerDay.standard.toLocaleString()}/day | Luxury: ₹${matchedDest.estimatedBudgetPerDay.luxury.toLocaleString()}/day.\n\n*Would you like me to open the interactive itinerary planner for ${matchedDest.name}?*`,
        actionPayload: { type: 'create_itinerary', destinationId: matchedDest.id, destinationName: matchedDest.name },
      };
    }

    if (lower.includes('budget') || lower.includes('cost') || lower.includes('expense') || lower.includes('price')) {
      return {
        reply: `### 💰 **MG Travels Daily Budget Guide (India)**\n\n• **🎒 Budget Backpacker (₹2,000 - ₹3,000 / day)**: Shared homestays, hostels (Zostel), KSRTC state buses, authentic local mess/Darshini thalis.\n• **✨ Standard Comfort (₹4,500 - ₹6,500 / day)**: 3-4★ plantation resorts, private AC cab transit, multi-cuisine garden dining.\n• **👑 Luxury Heritage (₹12,000 - ₹25,000+ / day)**: 5★ pool villas, chauffeur SUVs, fine dining & private plantation naturalists.\n\nUse our **Budget Calculator** tab for real-time itemized cost estimates for any group size!`,
      };
    }

    if (lower.includes('hotel') || lower.includes('resort') || lower.includes('stay')) {
      const sampleHotels = state.hotels.slice(0, 3).map((h) => `• **${h.name}** in *${h.destinationName}* (${h.rating}★) — ₹${h.pricePerNight.toLocaleString()}/night`).join('\n');
      return {
        reply: `### 🏨 **Top-Rated Handpicked Stays**\n\nHere are some of our guest-favorite verified resorts:\n\n${sampleHotels}\n\nCheck our **Hotels** tab for instant room bookings with MG loyalty discounts!`,
      };
    }

    if (lower.includes('food') || lower.includes('dish') || lower.includes('eat') || lower.includes('cuisine')) {
      return {
        reply: `### 🍛 **Signature Regional Culinary Guide**\n\n• **Coorg**: *Kadambuttu (Steamed Rice Dumplings)*, *Pandi Curry*, & artisanal single-origin estate coffee.\n• **Munnar & Kerala**: *Appam with Vegetable Stew*, *Karimeen Pollichathu (Spiced Pearlspot)*, & Malabar Parotta.\n• **Goa**: *Goan Fish Curry Thali*, *Prawn Balchão*, & coconut Bebinca dessert.\n• **Manali & Himachal**: *Siddu with Ghee & Dal*, *Himachali Dham*, & fresh river trout!`,
      };
    }

    return {
      reply: `### 🌿 **Welcome to MG Travels Travel Specialist**\n\nBased on real-time travel recommendations, here are top picks for this season:\n\n1. **Coorg (Kodagu)** — Lush misty coffee hills & waterfalls (Ideal: 3-4 Days)\n2. **Munnar** — Rolling tea estates & wildlife sanctuaries (Ideal: 3 Days)\n3. **Alleppey Backwaters** — Serene overnight kettuvallam houseboats (Ideal: 2-3 Days)\n4. **Goa Coastal** — Sun-kissed beaches, Portuguese heritage & water sports\n\nAsk me for custom day-by-day itineraries, hotel recommendations, or road trip routes!`,
    };
  };

  const ai = getGeminiClient();
  if (!ai) {
    const fallback = generateContextualFallbackReply(message);
    return res.json({
      success: true,
      reply: fallback.reply,
      actionPayload: fallback.actionPayload,
    });
  }

  try {
    const ragContext = `
You are the elite AI Travel Guide for "MG TRAVELS" (AI-Based Personalized Travel Recommendation System).
You have real-time access to our verified destination database:
${JSON.stringify(relevantDestinations, null, 2)}

User inquiry: "${message}"

Instructions:
1. Provide an inspiring, concise, and structured travel response with bullet points, time slots, local food suggestions, and budget estimates.
2. Recommend specific places from the database where applicable.
3. Mention cultural tips and best times to visit.
4. Keep the tone warm, sophisticated, and helpful.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: ragContext,
    });

    const reply = response.text || 'I am ready to help you plan your next journey!';
    res.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    // If Gemini experiences temporary 503 high demand or quota unavailability, seamlessly fall back to local RAG database
    console.warn('Gemini Assistant 503/high-demand error, falling back to rich RAG database response:', error?.message || error);
    const fallback = generateContextualFallbackReply(message);
    res.json({
      success: true,
      reply: fallback.reply,
      actionPayload: fallback.actionPayload,
    });
  }
});

// ----------------------------------------------------
// 7. VITE DEV / PRODUCTION MIDDLEWARE INTEGRATION
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MG TRAVELS] Full-stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
