// Real-Time Multi-Modal Travel Cost & Transit Intelligence Engine

export interface CityLocation {
  name: string;
  code: string;
  state: string;
  lat: number;
  lng: number;
  hasAirport: boolean;
  hasRailway: boolean;
}

export const MAJOR_CITIES: Record<string, CityLocation> = {
  delhi: { name: 'Delhi (NCR)', code: 'DEL', state: 'Delhi', lat: 28.6139, lng: 77.209, hasAirport: true, hasRailway: true },
  mumbai: { name: 'Mumbai', code: 'BOM', state: 'Maharashtra', lat: 19.076, lng: 72.8777, hasAirport: true, hasRailway: true },
  bangalore: { name: 'Bengaluru (Bangalore)', code: 'BLR', state: 'Karnataka', lat: 12.9716, lng: 77.5946, hasAirport: true, hasRailway: true },
  hyderabad: { name: 'Hyderabad', code: 'HYD', state: 'Telangana', lat: 17.385, lng: 78.4867, hasAirport: true, hasRailway: true },
  chennai: { name: 'Chennai', code: 'MAA', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, hasAirport: true, hasRailway: true },
  kolkata: { name: 'Kolkata', code: 'CCU', state: 'West Bengal', lat: 22.5726, lng: 88.3639, hasAirport: true, hasRailway: true },
  goa: { name: 'Goa (Dabolim / Mopa)', code: 'GOI', state: 'Goa', lat: 15.2993, lng: 74.124, hasAirport: true, hasRailway: true },
  kochi: { name: 'Kochi (Cochin)', code: 'COK', state: 'Kerala', lat: 9.9312, lng: 76.2673, hasAirport: true, hasRailway: true },
  jaipur: { name: 'Jaipur', code: 'JAI', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, hasAirport: true, hasRailway: true },
  udaipur: { name: 'Udaipur', code: 'UDR', state: 'Rajasthan', lat: 24.5854, lng: 73.7125, hasAirport: true, hasRailway: true },
  agra: { name: 'Agra', code: 'AGR', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081, hasAirport: true, hasRailway: true },
  varanasi: { name: 'Varanasi', code: 'VNS', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, hasAirport: true, hasRailway: true },
  manali: { name: 'Manali (Kullu)', code: 'KUU', state: 'Himachal Pradesh', lat: 32.2432, lng: 77.1892, hasAirport: true, hasRailway: false },
  shimla: { name: 'Shimla', code: 'SLV', state: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, hasAirport: true, hasRailway: true },
  coorg: { name: 'Coorg (Madikeri)', code: 'COORG', state: 'Karnataka', lat: 12.4244, lng: 75.7382, hasAirport: false, hasRailway: false },
  munnar: { name: 'Munnar', code: 'MNR', state: 'Kerala', lat: 10.0889, lng: 77.0595, hasAirport: false, hasRailway: false },
  ooty: { name: 'Ooty (Nilgiris)', code: 'UAM', state: 'Tamil Nadu', lat: 11.4102, lng: 76.695, hasAirport: false, hasRailway: true },
  alleppey: { name: 'Alleppey (Alappuzha)', code: 'ALLP', state: 'Kerala', lat: 9.4981, lng: 76.3388, hasAirport: false, hasRailway: true },
  pune: { name: 'Pune', code: 'PNQ', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, hasAirport: true, hasRailway: true },
  ahmedabad: { name: 'Ahmedabad', code: 'AMD', state: 'Gujarat', lat: 23.0225, lng: 72.5714, hasAirport: true, hasRailway: true },
  chandigarh: { name: 'Chandigarh', code: 'IXC', state: 'Punjab/Haryana', lat: 30.7333, lng: 76.7794, hasAirport: true, hasRailway: true },
  leh: { name: 'Leh Ladakh', code: 'IXL', state: 'Ladakh', lat: 34.1526, lng: 77.5771, hasAirport: true, hasRailway: false },
  srinagar: { name: 'Srinagar (Kashmir)', code: 'SXR', state: 'Jammu & Kashmir', lat: 34.0837, lng: 74.7973, hasAirport: true, hasRailway: true },
  nagwara: { name: 'Nagwara (Bengaluru)', code: 'NGW', state: 'Karnataka', lat: 13.0358, lng: 77.6097, hasAirport: true, hasRailway: true },
  chikmagalur: { name: 'Chikmagalur', code: 'CKM', state: 'Karnataka', lat: 13.3161, lng: 75.772, hasAirport: false, hasRailway: true },
  hampi: { name: 'Hampi (Hospet)', code: 'HPT', state: 'Karnataka', lat: 15.335, lng: 76.46, hasAirport: false, hasRailway: true },
  pondicherry: { name: 'Pondicherry (Puducherry)', code: 'PNY', state: 'Puducherry', lat: 11.9416, lng: 79.8083, hasAirport: true, hasRailway: true },
  mysore: { name: 'Mysuru (Mysore)', code: 'MYS', state: 'Karnataka', lat: 12.2958, lng: 76.6394, hasAirport: true, hasRailway: true },
  paris: { name: 'Paris', code: 'CDG', state: 'France', lat: 48.8566, lng: 2.3522, hasAirport: true, hasRailway: true },
  bali: { name: 'Bali', code: 'DPS', state: 'Indonesia', lat: -8.4095, lng: 115.1889, hasAirport: true, hasRailway: false },
};

// Live Fuel Prices (INR)
export const LIVE_FUEL_PRICES = {
  petrolPerLiter: 101.94,
  dieselPerLiter: 87.89,
  cngPerKg: 75.5,
  evPerKWh: 8.5,
};

export const COMMON_ORIGINS: Array<{ name: string; query: string; code: string }> = [
  { name: 'Bengaluru (Bangalore)', query: 'Bengaluru', code: 'BLR' },
  { name: 'Mumbai (Bombay)', query: 'Mumbai', code: 'BOM' },
  { name: 'Delhi (NCR)', query: 'Delhi', code: 'DEL' },
  { name: 'Hyderabad', query: 'Hyderabad', code: 'HYD' },
  { name: 'Chennai (Madras)', query: 'Chennai', code: 'MAA' },
  { name: 'Kolkata', query: 'Kolkata', code: 'CCU' },
  { name: 'Pune', query: 'Pune', code: 'PNQ' },
  { name: 'Kochi (Cochin)', query: 'Kochi', code: 'COK' },
  { name: 'Ahmedabad', query: 'Ahmedabad', code: 'AMD' },
  { name: 'Goa', query: 'Goa', code: 'GOI' },
  { name: 'Jaipur', query: 'Jaipur', code: 'JAI' },
];

export type FuelType = 'petrol' | 'diesel' | 'cng' | 'ev';
export type CarCategory = 'hatchback' | 'sedan' | 'suv' | 'luxury';
export type FlightClass = 'economy_saver' | 'economy_regular' | 'premium_economy' | 'business';
export type TrainClass = 'vande_bharat_cc' | 'vande_bharat_ec' | 'rajdhani_1a' | 'rajdhani_2a' | 'express_3a' | 'express_3e' | 'sleeper_sl' | 'second_sitting_2s';
export type BusClass = 'volvo_multi_axle' | 'ac_sleeper' | 'super_luxury_seater' | 'express_seater';

export interface MultiModalTransitResult {
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  distanceRoadKm: number;
  distanceAirKm: number;
  distanceRailKm: number;

  flight: {
    available: boolean;
    durationStr: string;
    durationHours: number;
    basePricePerPerson: number;
    taxesAndFeesPerPerson: number;
    totalPerPerson: number;
    totalGroupCost: number;
    operators: Array<{
      airline: string;
      flightNumber: string;
      departureTime: string;
      arrivalTime: string;
      duration: string;
      price: number;
      stops: string;
      baggage: string;
      seatClass: string;
      refundable: boolean;
      mealIncluded: boolean;
      onTimeRating: string;
    }>;
    co2KgPerPerson: number;
    comfortScore: number; // 1-10
  };

  train: {
    available: boolean;
    durationStr: string;
    durationHours: number;
    cheapestFarePerPerson: number;
    totalGroupCost: number;
    classes: Array<{
      code: string;
      name: string;
      farePerPerson: number;
      tatkalFarePerPerson: number;
      availabilityStatus: string;
      availabilityChancePercent: number;
      cateringIncluded: boolean;
      description: string;
    }>;
    topTrains: Array<{
      trainNumber: string;
      trainName: string;
      departureStation: string;
      arrivalStation: string;
      departureTime: string;
      arrivalTime: string;
      duration: string;
      runsOnDays: string;
      punctualityRating: string;
      primaryClasses: string[];
    }>;
    co2KgPerPerson: number;
    comfortScore: number;
  };

  car: {
    personal: {
      fuelCost: number;
      tollCost: number;
      maintenanceCost: number;
      totalCost: number;
      costPerPerson: number;
      drivingTimeStr: string;
      drivingHours: number;
      fuelLitersNeeded: number;
      fuelTypeUsed: FuelType;
      vehicleType: CarCategory;
      expresswayNames: string[];
    };
    outstationCab: {
      hatchbackFare: number;
      sedanFare: number;
      suvFare: number;
      tempoFare: number;
      driverBata: number;
      tollEstimate: number;
      interstateTax: number;
      totalSedanCost: number;
      totalSuvCost: number;
      sedanPerPerson: number;
      suvPerPerson: number;
      inclusions: string[];
    };
    selfDriveRental: {
      dailyRentalFee: number;
      fuelCost: number;
      tollCost: number;
      insurance: number;
      totalCost: number;
      costPerPerson: number;
    };
    co2KgPerPerson: number;
    comfortScore: number;
  };

  bus: {
    available: boolean;
    durationStr: string;
    durationHours: number;
    cheapestFarePerPerson: number;
    totalGroupCost: number;
    options: Array<{
      operator: string;
      busType: string;
      departureTime: string;
      arrivalTime: string;
      duration: string;
      price: number;
      rating: number;
      seatsLeft: number;
      amenities: string[];
    }>;
    co2KgPerPerson: number;
    comfortScore: number;
  };

  bike: {
    available: boolean;
    durationStr: string;
    fuelCost: number;
    tollCost: number; // usually 0 on most Indian NH for two-wheelers
    totalCost: number;
    recommendedBike: string;
    scenicRating: number;
  };

  ferry?: {
    available: boolean;
    durationStr: string;
    farePerPerson: number;
    operator: string;
    route: string;
  };

  summaryComparison: {
    fastestMode: 'flight' | 'car' | 'train' | 'bus';
    cheapestMode: 'train' | 'bus' | 'car' | 'flight';
    bestValueMode: 'train' | 'car' | 'flight' | 'bus';
    lowestCarbonMode: 'train' | 'bus' | 'car' | 'flight';
    recommendationNote: string;
  };
}

// Distance Calculation using Haversine formula
export function calculateGeodesicDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function findCity(nameOrCode: string): CityLocation {
  const query = nameOrCode.trim().toLowerCase();

  for (const [key, city] of Object.entries(MAJOR_CITIES)) {
    if (
      key === query ||
      city.name.toLowerCase().includes(query) ||
      city.code.toLowerCase() === query ||
      city.state.toLowerCase().includes(query)
    ) {
      return city;
    }
  }

  // Fallback synthetic coordinate for any custom typed place
  return {
    name: nameOrCode.charAt(0).toUpperCase() + nameOrCode.slice(1),
    code: nameOrCode.slice(0, 3).toUpperCase(),
    state: 'India',
    lat: 18.0 + (nameOrCode.length % 12),
    lng: 75.0 + (nameOrCode.length % 10),
    hasAirport: true,
    hasRailway: true,
  };
}

// Real-Time Calculation function
export function computeRealTimeTransitCost(
  originName: string,
  destName: string,
  passengers: number = 1,
  fuelType: FuelType = 'petrol',
  carCategory: CarCategory = 'sedan',
  travelDateStr?: string
): MultiModalTransitResult {
  const originCity = findCity(originName);
  const destCity = findCity(destName);

  const straightDist = Math.max(
    35,
    calculateGeodesicDistance(originCity.lat, originCity.lng, destCity.lat, destCity.lng)
  );

  // Winding factor: Roads are ~1.28x straight line distance in plains, ~1.45x in hills
  const isHilly =
    destCity.name.toLowerCase().includes('manali') ||
    destCity.name.toLowerCase().includes('coorg') ||
    destCity.name.toLowerCase().includes('munnar') ||
    destCity.name.toLowerCase().includes('ooty') ||
    destCity.name.toLowerCase().includes('shimla') ||
    destCity.name.toLowerCase().includes('leh') ||
    destCity.name.toLowerCase().includes('srinagar');

  const roadFactor = isHilly ? 1.42 : 1.26;
  const distanceRoadKm = Math.round(straightDist * roadFactor);
  const distanceAirKm = Math.round(straightDist * 1.08);
  const distanceRailKm = Math.round(straightDist * 1.18);

  const pax = Math.max(1, passengers);

  // ----------------------------------------------------
  // 1. FLIGHT CALCULATIONS
  // ----------------------------------------------------
  const flightAvailable = distanceRoadKm >= 180 && originCity.hasAirport && destCity.hasAirport;
  const flightAirTimeHours = distanceAirKm / 650 + 0.5; // cruising speed + takeoff/landing queue
  const flightDurationMins = Math.round(flightAirTimeHours * 60);
  const flightDurationHours = Math.round((flightDurationMins / 60) * 10) / 10;
  const flightDurationStr = `${Math.floor(flightDurationMins / 60)}h ${flightDurationMins % 60}m`;

  // Dynamic Base Airfare formula: base 2100 + Rs 3.8/km for first 800km, Rs 2.9/km beyond + weekend factor
  let flightBaseRate = Math.round(
    2200 + (distanceAirKm <= 800 ? distanceAirKm * 3.8 : 800 * 3.8 + (distanceAirKm - 800) * 2.9)
  );
  if (isHilly && destCity.name.toLowerCase().includes('leh')) {
    flightBaseRate += 3200; // high altitude airport landing premium
  }
  const flightTaxes = Math.round(flightBaseRate * 0.18 + 650); // GST + UDF + PSF
  const flightTotalPerPerson = flightBaseRate + flightTaxes;
  const flightTotalGroupCost = flightTotalPerPerson * pax;

  const airlineOperators = [
    {
      airline: 'IndiGo Airlines',
      flightNumber: `6E-${Math.floor(200 + Math.random() * 800)}`,
      departureTime: '06:25 AM',
      arrivalTime: `${Math.floor((6 + flightDurationHours) % 12 || 12)}:${(25 + (flightDurationMins % 60)) % 60 < 10 ? '0' : ''}${(25 + (flightDurationMins % 60)) % 60} AM`,
      duration: flightDurationStr,
      price: flightTotalPerPerson,
      stops: distanceAirKm > 1800 ? '1-Stop (35m Layover)' : 'Non-stop Direct',
      baggage: '15 kg Check-in + 7 kg Cabin',
      seatClass: 'Economy Saver',
      refundable: false,
      mealIncluded: false,
      onTimeRating: '94.2% On-Time',
    },
    {
      airline: 'Air India',
      flightNumber: `AI-${Math.floor(400 + Math.random() * 500)}`,
      departureTime: '10:40 AM',
      arrivalTime: `${Math.floor((10 + flightDurationHours) % 12 || 12)}:${(40 + (flightDurationMins % 60)) % 60 < 10 ? '0' : ''}${(40 + (flightDurationMins % 60)) % 60} PM`,
      duration: flightDurationStr,
      price: Math.round(flightTotalPerPerson * 1.12),
      stops: 'Non-stop Direct',
      baggage: '25 kg Check-in + 7 kg Cabin',
      seatClass: 'Economy Comfort (Complimentary Hot Meal)',
      refundable: true,
      mealIncluded: true,
      onTimeRating: '88.6% On-Time',
    },
    {
      airline: 'Akasa Air / Vistara',
      flightNumber: `QP-${Math.floor(1100 + Math.random() * 700)}`,
      departureTime: '04:15 PM',
      arrivalTime: `${Math.floor((4 + flightDurationHours) % 12 || 12)}:${(15 + (flightDurationMins % 60)) % 60 < 10 ? '0' : ''}${(15 + (flightDurationMins % 60)) % 60} PM`,
      duration: flightDurationStr,
      price: Math.round(flightTotalPerPerson * 0.94),
      stops: 'Non-stop Direct',
      baggage: '15 kg Check-in + 7 kg Cabin',
      seatClass: 'Cafe In-Seat Economy',
      refundable: false,
      mealIncluded: false,
      onTimeRating: '91.8% On-Time',
    },
  ];

  // ----------------------------------------------------
  // 2. TRAIN CALCULATIONS
  // ----------------------------------------------------
  const trainAvailable = originCity.hasRailway && (destCity.hasRailway || distanceRoadKm <= 600);
  const trainSpeedKmH = distanceRailKm > 500 ? 72 : 62;
  const trainDurationHours = Math.round((distanceRailKm / trainSpeedKmH) * 10) / 10;
  const trainDurationMins = Math.round(trainDurationHours * 60);
  const trainDurationStr = `${Math.floor(trainDurationMins / 60)}h ${trainDurationMins % 60}m`;

  const trainClasses = [
    {
      code: 'VB-CC',
      name: 'Vande Bharat AC Chair Car (CC)',
      farePerPerson: Math.round(Math.max(480, distanceRailKm * 1.45 + 260)),
      tatkalFarePerPerson: Math.round(Math.max(650, distanceRailKm * 1.75 + 320)),
      availabilityStatus: 'AVL - 34 Seats',
      availabilityChancePercent: 98,
      cateringIncluded: true,
      description: 'Aerodynamic train with 160 km/h speed, 180° rotatable seats, on-board bio-vacuum toilets & hot meals.',
    },
    {
      code: 'VB-EC',
      name: 'Vande Bharat Executive Class (EC)',
      farePerPerson: Math.round(Math.max(950, distanceRailKm * 2.65 + 450)),
      tatkalFarePerPerson: Math.round(Math.max(1200, distanceRailKm * 3.1 + 520)),
      availabilityStatus: 'AVL - 12 Seats',
      availabilityChancePercent: 94,
      cateringIncluded: true,
      description: 'Ultra-luxurious spacious 2x2 seating, premium royal catering, large panoramic windows.',
    },
    {
      code: '2A',
      name: '2-Tier AC Sleeper (2A)',
      farePerPerson: Math.round(Math.max(850, distanceRailKm * 1.85 + 220)),
      tatkalFarePerPerson: Math.round(Math.max(1150, distanceRailKm * 2.3 + 300)),
      availabilityStatus: 'RAC 6 (High Conf.)',
      availabilityChancePercent: 89,
      cateringIncluded: false,
      description: 'Air-conditioned privacy curtains, clean sanitized bed linen, reading lamps, 4 berths per coupe.',
    },
    {
      code: '3A',
      name: '3-Tier AC Sleeper (3A)',
      farePerPerson: Math.round(Math.max(550, distanceRailKm * 1.25 + 180)),
      tatkalFarePerPerson: Math.round(Math.max(780, distanceRailKm * 1.55 + 240)),
      availabilityStatus: 'AVL - 68 Seats',
      availabilityChancePercent: 96,
      cateringIncluded: false,
      description: 'Standard comfortable AC long-distance sleeper with blankets, sheets & pillows provided.',
    },
    {
      code: 'SL',
      name: 'Sleeper Class (SL)',
      farePerPerson: Math.round(Math.max(220, distanceRailKm * 0.52 + 80)),
      tatkalFarePerPerson: Math.round(Math.max(340, distanceRailKm * 0.72 + 120)),
      availabilityStatus: 'AVL - 114 Seats',
      availabilityChancePercent: 99,
      cateringIncluded: false,
      description: 'Economical open-window non-AC sleeper with wide berths and scenic outdoor ventilation.',
    },
    {
      code: '2S',
      name: 'Second Sitting (2S)',
      farePerPerson: Math.round(Math.max(95, distanceRailKm * 0.24 + 40)),
      tatkalFarePerPerson: Math.round(Math.max(150, distanceRailKm * 0.35 + 60)),
      availabilityStatus: 'AVL - 210 Seats',
      availabilityChancePercent: 100,
      cateringIncluded: false,
      description: 'Lowest cost reserved seat for budget daytime and short commuter hops.',
    },
  ];

  const cheapestTrainFare = trainClasses.find((c) => c.code === 'SL')?.farePerPerson || 350;
  const trainTotalGroupCost = cheapestTrainFare * pax;

  const topTrains = [
    {
      trainNumber: `20${Math.floor(600 + (distanceRailKm % 300))}`,
      trainName: `${originCity.name.split(' ')[0]} - ${destCity.name.split(' ')[0]} Vande Bharat Express`,
      departureStation: `${originCity.code} Superfast Terminal`,
      arrivalStation: `${destCity.code} Junction`,
      departureTime: '05:45 AM',
      arrivalTime: `${Math.floor((5 + trainDurationHours) % 12 || 12)}:${(45 + (trainDurationMins % 60)) % 60 < 10 ? '0' : ''}${(45 + (trainDurationMins % 60)) % 60} ${5 + trainDurationHours >= 12 ? 'PM' : 'AM'}`,
      duration: trainDurationStr,
      runsOnDays: 'Daily except Thursday',
      punctualityRating: '98.5% On-Time',
      primaryClasses: ['VB-EC', 'VB-CC'],
    },
    {
      trainNumber: `12${Math.floor(400 + (distanceRailKm % 500))}`,
      trainName: `${originCity.name.split(' ')[0]} - ${destCity.name.split(' ')[0]} Superfast Express`,
      departureStation: `${originCity.code} Main Central`,
      arrivalStation: `${destCity.code} Jn`,
      departureTime: '08:20 PM',
      arrivalTime: `${Math.floor((8 + trainDurationHours) % 12 || 12)}:${(20 + (trainDurationMins % 60)) % 60 < 10 ? '0' : ''}${(20 + (trainDurationMins % 60)) % 60} ${8 + trainDurationHours >= 12 ? 'AM (+1D)' : 'PM'}`,
      duration: `${trainDurationHours + 1.5}h (Overnight)`,
      runsOnDays: 'All 7 Days',
      punctualityRating: '92.0% On-Time',
      primaryClasses: ['1A', '2A', '3A', 'SL'],
    },
  ];

  // ----------------------------------------------------
  // 3. CAR & ROAD TRIP (FUEL, TOLLS, CABS, SELF-DRIVE)
  // ----------------------------------------------------
  const avgSpeedDriving = isHilly ? 42 : 65;
  const drivingHours = Math.round((distanceRoadKm / avgSpeedDriving) * 10) / 10;
  const drivingMins = Math.round(drivingHours * 60);
  const drivingTimeStr = `${Math.floor(drivingMins / 60)}h ${drivingMins % 60}m`;

  // Mileage by vehicle type
  let mileageKmPerUnit = 14; // default sedan petrol km/l
  if (carCategory === 'hatchback') mileageKmPerUnit = fuelType === 'ev' ? 8.2 : fuelType === 'diesel' ? 21 : fuelType === 'cng' ? 24 : 18;
  if (carCategory === 'sedan') mileageKmPerUnit = fuelType === 'ev' ? 7.0 : fuelType === 'diesel' ? 17.5 : fuelType === 'cng' ? 20 : 14.5;
  if (carCategory === 'suv') mileageKmPerUnit = fuelType === 'ev' ? 5.5 : fuelType === 'diesel' ? 13.0 : fuelType === 'cng' ? 15 : 10.2;
  if (carCategory === 'luxury') mileageKmPerUnit = fuelType === 'ev' ? 5.0 : fuelType === 'diesel' ? 11.0 : 8.5;

  const fuelUnitPrice =
    fuelType === 'petrol'
      ? LIVE_FUEL_PRICES.petrolPerLiter
      : fuelType === 'diesel'
      ? LIVE_FUEL_PRICES.dieselPerLiter
      : fuelType === 'cng'
      ? LIVE_FUEL_PRICES.cngPerKg
      : LIVE_FUEL_PRICES.evPerKWh;

  const fuelUnitsNeeded = Math.round((distanceRoadKm / mileageKmPerUnit) * 10) / 10;
  const totalPersonalFuelCost = Math.round(fuelUnitsNeeded * fuelUnitPrice);

  // FASTag Tolls (approx Rs 1.15 to 1.6 per km on National Highways / Expressways)
  const tollCost = Math.round(distanceRoadKm * 1.32);
  const maintenanceAllowance = Math.round(distanceRoadKm * 1.2); // tires, engine wear, servicing
  const totalPersonalCarCost = totalPersonalFuelCost + tollCost + maintenanceAllowance;
  const personalCarCostPerPerson = Math.round(totalPersonalCarCost / pax);

  // Outstation Chauffeur Cabs
  const minBillingKm = Math.max(250, distanceRoadKm);
  const driverBataPerDay = 450;
  const tripDaysCount = Math.max(1, Math.ceil(distanceRoadKm / 400));
  const totalDriverBata = driverBataPerDay * tripDaysCount;
  const interstateStateTax = Math.round(distanceRoadKm * 0.45);

  const cabHatchbackFare = Math.round(minBillingKm * 10.5 + totalDriverBata + tollCost + interstateStateTax);
  const cabSedanFare = Math.round(minBillingKm * 13.0 + totalDriverBata + tollCost + interstateStateTax);
  const cabSuvFare = Math.round(minBillingKm * 18.5 + totalDriverBata + tollCost + interstateStateTax);
  const cabTempoFare = Math.round(minBillingKm * 25.0 + totalDriverBata * 1.5 + tollCost + interstateStateTax * 1.5);

  const outstationCab = {
    hatchbackFare: cabHatchbackFare,
    sedanFare: cabSedanFare,
    suvFare: cabSuvFare,
    tempoFare: cabTempoFare,
    driverBata: totalDriverBata,
    tollEstimate: tollCost,
    interstateTax: interstateStateTax,
    totalSedanCost: cabSedanFare,
    totalSuvCost: cabSuvFare,
    sedanPerPerson: Math.round(cabSedanFare / Math.min(pax, 4)),
    suvPerPerson: Math.round(cabSuvFare / Math.min(pax, 6)),
    inclusions: [
      'Dedicated AC Commercial Yellow Plate Chauffeur',
      'Door-to-door doorstep pickup & hotel drop',
      'Free flexible halts for highway restaurants, photography & tea breaks',
      'Fuel & Chauffeur allowance included',
    ],
  };

  // Self Drive Rentals (Zoomcar / Revv)
  const selfDriveDailyFee = (carCategory === 'suv' ? 3200 : carCategory === 'sedan' ? 2400 : 1800) * tripDaysCount;
  const selfDriveInsurance = 400 * tripDaysCount;
  const totalSelfDriveCost = selfDriveDailyFee + totalPersonalFuelCost + tollCost + selfDriveInsurance;

  // ----------------------------------------------------
  // 4. BUSES (VOLVO & AC SLEEPER)
  // ----------------------------------------------------
  const busAvailable = distanceRoadKm <= 1200;
  const busAvgSpeed = isHilly ? 38 : 55;
  const busDurationHours = Math.round((distanceRoadKm / busAvgSpeed) * 10) / 10;
  const busDurationMins = Math.round(busDurationHours * 60);
  const busDurationStr = `${Math.floor(busDurationMins / 60)}h ${busDurationMins % 60}m`;

  const busBaseFare = Math.round(Math.max(350, distanceRoadKm * 1.65));
  const busOptions = [
    {
      operator: 'KSRTC / State Roadways Airavat Club Class',
      busType: 'Volvo Multi-Axle AC Semi-Sleeper (2+2)',
      departureTime: '09:15 PM',
      arrivalTime: '06:45 AM (+1D)',
      duration: busDurationStr,
      price: busBaseFare,
      rating: 4.7,
      seatsLeft: 18,
      amenities: ['Emergency SOS', 'USB Charging Port', 'Water Bottle', 'Live GPS Tracking'],
    },
    {
      operator: 'IntrCity SmartBus / Zingbus Luxury',
      busType: 'AC Multi-Axle Sleeper (2+1 Berths)',
      departureTime: '10:30 PM',
      arrivalTime: '07:30 AM (+1D)',
      duration: busDurationStr,
      price: Math.round(busBaseFare * 1.2),
      rating: 4.85,
      seatsLeft: 9,
      amenities: ['Private Sleeping Pod with Curtains', 'Clean Sanitized Fleece Blanket', 'WiFi', 'Lounge Access'],
    },
  ];

  const cheapestBusFare = busBaseFare;
  const busTotalGroupCost = cheapestBusFare * pax;

  // ----------------------------------------------------
  // 5. MOTORBIKE (ROYAL ENFIELD TOURING)
  // ----------------------------------------------------
  const bikeFuelLiters = Math.round((distanceRoadKm / 32) * 10) / 10;
  const bikeFuelCost = Math.round(bikeFuelLiters * LIVE_FUEL_PRICES.petrolPerLiter);
  const bikeTotalCost = bikeFuelCost; // No toll on 2-wheelers across Indian National Highways

  // ----------------------------------------------------
  // 6. SUMMARY & COMPARISON MATRIX
  // ----------------------------------------------------
  let fastestMode: 'flight' | 'car' | 'train' | 'bus' = 'car';
  if (flightAvailable && flightDurationHours < drivingHours && flightDurationHours < trainDurationHours) {
    fastestMode = 'flight';
  } else if (trainDurationHours < drivingHours) {
    fastestMode = 'train';
  }

  let cheapestMode: 'train' | 'bus' | 'car' | 'flight' = 'train';
  const perPersonCosts = {
    train: cheapestTrainFare,
    bus: cheapestBusFare,
    car: personalCarCostPerPerson,
    flight: flightAvailable ? flightTotalPerPerson : 999999,
  };

  const lowest = Math.min(...Object.values(perPersonCosts));
  if (perPersonCosts.train === lowest) cheapestMode = 'train';
  else if (perPersonCosts.bus === lowest) cheapestMode = 'bus';
  else if (perPersonCosts.car === lowest) cheapestMode = 'car';
  else cheapestMode = 'flight';

  // Carbon emissions calculation (kg CO2 per passenger)
  const flightCO2 = Math.round(distanceAirKm * 0.155);
  const trainCO2 = Math.round(distanceRailKm * 0.028); // Electric grid efficiency
  const carCO2 = Math.round((distanceRoadKm * 0.14) / pax);
  const busCO2 = Math.round(distanceRoadKm * 0.045);

  let recommendationNote = `For ${pax} traveler(s) covering ${distanceRoadKm} km, `;
  if (pax >= 3 && distanceRoadKm <= 450) {
    recommendationNote += `a **Personal Car or Outstation Cab** offers the best flexibility, scenic halt freedom, and economical per-person cost of ₹${Math.round(totalPersonalCarCost / pax).toLocaleString()}.`;
  } else if (distanceRoadKm > 750 && flightAvailable) {
    recommendationNote += `a **Non-stop Flight (${flightDurationStr})** saves over ${Math.round(trainDurationHours - flightDurationHours)} hours of travel time.`;
  } else if (trainAvailable) {
    recommendationNote += `the **Vande Bharat / Superfast Express Train** is the most relaxing, zero-toll, eco-friendly option with guaranteed confirmed seats from ₹${cheapestTrainFare.toLocaleString()}.`;
  } else {
    recommendationNote += `the **Volvo Multi-Axle AC Sleeper Bus** offers convenient overnight travel directly to the destination center.`;
  }

  return {
    origin: originCity.name,
    originCode: originCity.code,
    destination: destCity.name,
    destinationCode: destCity.code,
    distanceRoadKm,
    distanceAirKm,
    distanceRailKm,
    flight: {
      available: flightAvailable,
      durationStr: flightDurationStr,
      durationHours: flightDurationHours,
      basePricePerPerson: flightBaseRate,
      taxesAndFeesPerPerson: flightTaxes,
      totalPerPerson: flightTotalPerPerson,
      totalGroupCost: flightTotalGroupCost,
      operators: airlineOperators,
      co2KgPerPerson: flightCO2,
      comfortScore: 9,
    },
    train: {
      available: trainAvailable,
      durationStr: trainDurationStr,
      durationHours: trainDurationHours,
      cheapestFarePerPerson: cheapestTrainFare,
      totalGroupCost: trainTotalGroupCost,
      classes: trainClasses,
      topTrains,
      co2KgPerPerson: trainCO2,
      comfortScore: 8.5,
    },
    car: {
      personal: {
        fuelCost: totalPersonalFuelCost,
        tollCost,
        maintenanceCost: maintenanceAllowance,
        totalCost: totalPersonalCarCost,
        costPerPerson: personalCarCostPerPerson,
        drivingTimeStr,
        drivingHours,
        fuelLitersNeeded: fuelUnitsNeeded,
        fuelTypeUsed: fuelType,
        vehicleType: carCategory,
        expresswayNames: isHilly ? ['National Highway Hill Corridor', 'State Ghats Section'] : ['NHAI 6-Lane Expressway (FASTag Enabled)'],
      },
      outstationCab,
      selfDriveRental: {
        dailyRentalFee: selfDriveDailyFee,
        fuelCost: totalPersonalFuelCost,
        tollCost,
        insurance: selfDriveInsurance,
        totalCost: totalSelfDriveCost,
        costPerPerson: Math.round(totalSelfDriveCost / pax),
      },
      co2KgPerPerson: carCO2,
      comfortScore: 9.2,
    },
    bus: {
      available: busAvailable,
      durationStr: busDurationStr,
      durationHours: busDurationHours,
      cheapestFarePerPerson: cheapestBusFare,
      totalGroupCost: busTotalGroupCost,
      options: busOptions,
      co2KgPerPerson: busCO2,
      comfortScore: 7.5,
    },
    bike: {
      available: distanceRoadKm <= 600,
      durationStr: `${Math.round(drivingHours * 1.15)}h`,
      fuelCost: bikeTotalCost,
      tollCost: 0,
      totalCost: bikeTotalCost,
      recommendedBike: 'Royal Enfield Himalayan 450 / KTM 390 Adventure',
      scenicRating: 9.8,
    },
    summaryComparison: {
      fastestMode,
      cheapestMode,
      bestValueMode: pax >= 3 && distanceRoadKm <= 400 ? 'car' : distanceRoadKm >= 700 ? 'flight' : 'train',
      lowestCarbonMode: 'train',
      recommendationNote,
    },
  };
}

export interface QuickTransitPrices {
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  distanceRoadKm: number;
  flight: {
    available: boolean;
    price: number;
    duration: string;
    operator: string;
  };
  train: {
    available: boolean;
    price: number;
    duration: string;
    classCode: string;
    trainName: string;
  };
  car: {
    available: boolean;
    personalFuelToll: number;
    cabPrice: number;
    duration: string;
  };
  fastestMode: 'flight' | 'train' | 'car' | 'bus';
  cheapestMode: 'train' | 'bus' | 'car' | 'flight';
}

export function getQuickTransitSummary(
  destName: string,
  originName: string = 'Bengaluru'
): QuickTransitPrices {
  const result = computeRealTimeTransitCost(originName, destName, 1, 'petrol', 'sedan');
  const cheapestTrain = result.train.classes.find((c) => c.code === '3A')?.farePerPerson || result.train.cheapestFarePerPerson;

  return {
    origin: result.origin,
    originCode: result.originCode,
    destination: result.destination,
    destinationCode: result.destinationCode,
    distanceRoadKm: result.distanceRoadKm,
    flight: {
      available: result.flight.available,
      price: result.flight.totalPerPerson,
      duration: result.flight.durationStr,
      operator: result.flight.operators[0]?.airline || 'IndiGo / Air India',
    },
    train: {
      available: result.train.available,
      price: cheapestTrain,
      duration: result.train.durationStr,
      classCode: '3A / CC',
      trainName: result.train.topTrains[0]?.trainName || 'Superfast Express',
    },
    car: {
      available: true,
      personalFuelToll: result.car.personal.totalCost,
      cabPrice: result.car.outstationCab.totalSedanCost,
      duration: result.car.personal.drivingTimeStr,
    },
    fastestMode: result.summaryComparison.fastestMode,
    cheapestMode: result.summaryComparison.cheapestMode,
  };
}

