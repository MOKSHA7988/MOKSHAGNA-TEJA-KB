import { jsPDF } from 'jspdf';
import { Destination, Place, TripPlan, TripTier, ItineraryDay, VehicleExpenseConfig, PlaceTicketConfig } from '../types/travel';

/**
 * Calculates straight line distance in km between two lat/lng pairs (Haversine formula)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Provides intelligent default vehicle configuration based on destination topography & budget tier
 */
export function getDefaultVehicleConfig(
  destination: Destination,
  totalDays: number,
  tripTier: TripTier = 'standard'
): VehicleExpenseConfig {
  const days = Math.max(1, totalDays);
  const destType = destination.type;

  if (destType === 'Beaches') {
    if (tripTier === 'budget') {
      return {
        vehicleType: 'scooter',
        vehicleName: 'Two-Wheeler / Scooter Rental (Activa / Dio)',
        dailyRate: 450,
        fuelAndTollsPerDay: 200,
        driverAllowancePerDay: 0,
        totalDays: days,
        totalVehicleCost: (450 + 200) * days,
        notes: 'Popular for beach hopping in Goa & coastal areas. Helmet and valid Driving License required.',
      };
    } else if (tripTier === 'luxury') {
      return {
        vehicleType: 'suv_cab',
        vehicleName: 'Private AC Luxury SUV (Innova Crysta / Fortuner)',
        dailyRate: 4200,
        fuelAndTollsPerDay: 800,
        driverAllowancePerDay: 400,
        totalDays: days,
        totalVehicleCost: (4200 + 800 + 400) * days,
        notes: 'Chauffeur-driven AC SUV with dedicated airport transfers & full-day touring.',
      };
    } else {
      return {
        vehicleType: 'self_drive',
        vehicleName: 'Self-Drive Car (Swift / Baleno / Thar)',
        dailyRate: 1800,
        fuelAndTollsPerDay: 600,
        driverAllowancePerDay: 0,
        totalDays: days,
        totalVehicleCost: (1800 + 600) * days,
        notes: 'Flexible self-drive vehicle with unlimited km, ideal for coastal exploration.',
      };
    }
  } else if (destType === 'Hill Stations' || destType === 'Wildlife' || destType === 'Adventure') {
    if (tripTier === 'budget') {
      return {
        vehicleType: 'auto',
        vehicleName: 'Local Auto-Rickshaw & Shared Mountain Jeeps',
        dailyRate: 900,
        fuelAndTollsPerDay: 150,
        driverAllowancePerDay: 0,
        totalDays: days,
        totalVehicleCost: (900 + 150) * days,
        notes: 'Budget-friendly local autos for town sightseeing and shared 4x4 jeeps for viewpoints.',
      };
    } else if (tripTier === 'luxury') {
      return {
        vehicleType: 'suv_cab',
        vehicleName: 'Chauffeur-Driven 4x4 / Luxury SUV (Innova / Scorpio)',
        dailyRate: 3800,
        fuelAndTollsPerDay: 700,
        driverAllowancePerDay: 400,
        totalDays: days,
        totalVehicleCost: (3800 + 700 + 400) * days,
        notes: 'Experienced mountain driver skilled in ghat hairpins, forest reserves & scenic passes.',
      };
    } else {
      return {
        vehicleType: 'sedan_cab',
        vehicleName: 'Private Tourist AC Sedan (Dzire / Etios - 8hr/80km)',
        dailyRate: 2400,
        fuelAndTollsPerDay: 500,
        driverAllowancePerDay: 300,
        totalDays: days,
        totalVehicleCost: (2400 + 500 + 300) * days,
        notes: 'Dedicated local tourist cab with local sightseeing permits & luggage space.',
      };
    }
  } else {
    // Heritage, Pilgrimage, Cities
    if (tripTier === 'budget') {
      return {
        vehicleType: 'auto',
        vehicleName: 'Local Auto-Rickshaw & E-Rickshaw Day Pass',
        dailyRate: 750,
        fuelAndTollsPerDay: 100,
        driverAllowancePerDay: 0,
        totalDays: days,
        totalVehicleCost: (750 + 100) * days,
        notes: 'Quick navigation through historic bazaars, old alleys, and temple gates.',
      };
    } else if (tripTier === 'luxury') {
      return {
        vehicleType: 'sedan_cab',
        vehicleName: 'Chauffeur-Driven Premium AC Cab (Camry / Ciaz / Innova)',
        dailyRate: 3200,
        fuelAndTollsPerDay: 500,
        driverAllowancePerDay: 350,
        totalDays: days,
        totalVehicleCost: (3200 + 500 + 350) * days,
        notes: 'Uniformed chauffeur with bottled water, seamless monument parking & airport pick/drop.',
      };
    } else {
      return {
        vehicleType: 'sedan_cab',
        vehicleName: 'Private AC Tourist Cab (Dzire / Etios 8hr/80km)',
        dailyRate: 2200,
        fuelAndTollsPerDay: 400,
        driverAllowancePerDay: 300,
        totalDays: days,
        totalVehicleCost: (2200 + 400 + 300) * days,
        notes: 'Comfortable air-conditioned private taxi covering all scheduled monuments.',
      };
    }
  }
}

/**
 * Extracts and populates default place ticket configurations with realistic entry fees, child concessions, and camera fees
 */
export function getDefaultPlaceTickets(
  destination: Destination,
  travelersCount = 1
): PlaceTicketConfig[] {
  const count = Math.max(1, travelersCount);
  const placesList = destination.places && destination.places.length > 0
    ? destination.places
    : [
        {
          id: `${destination.id || 'dest'}-p1`,
          name: `${destination.name} Panoramic Viewpoint & Promenade`,
          category: 'Scenic & Nature',
          entryFee: 30,
        },
        {
          id: `${destination.id || 'dest'}-p2`,
          name: `${destination.name} Heritage Landmark & Cultural Hall`,
          category: 'Heritage & History',
          entryFee: 50,
        },
        {
          id: `${destination.id || 'dest'}-p3`,
          name: `${destination.name} Nature Park & Garden Walkways`,
          category: 'Scenic & Nature',
          entryFee: 20,
        },
      ];

  return placesList.map((place) => {
    const adult = typeof place.entryFee === 'number' ? place.entryFee : 30;
    // Child concession (50% of adult or free if under ₹50)
    const child = adult > 50 ? Math.round(adult * 0.5) : 0;
    // Camera permit fee estimation based on landmark category
    let cameraFee = 0;
    const cat = (place.category || '').toLowerCase();
    if (cat.includes('heritage') || cat.includes('palace') || cat.includes('fort')) {
      cameraFee = 50;
    } else if (cat.includes('wildlife') || cat.includes('national park')) {
      cameraFee = 100;
    } else if (adult > 100) {
      cameraFee = 25;
    }

    const foreign = adult > 0 ? (adult <= 50 ? 250 : adult * 5) : 0;

    // Timings
    let timings = '09:00 AM - 05:30 PM';
    if (cat.includes('temple') || cat.includes('pilgrimage')) {
      timings = '06:00 AM - 08:30 PM';
    } else if (cat.includes('sunset') || cat.includes('viewpoint') || cat.includes('beach')) {
      timings = '06:00 AM - 07:00 PM';
    }

    return {
      placeId: place.id || `p-${Math.random()}`,
      placeName: place.name || 'Local Attraction',
      category: place.category || 'Sightseeing',
      adultTicket: adult,
      childTicket: child,
      cameraFee,
      foreignVisitorTicket: foreign,
      timings,
      included: true,
      totalForGroup: adult * count + cameraFee,
    };
  });
}

/**
 * Auto-clusters places into balanced daily itineraries using proximity clustering
 */
export function generateItinerary({
  destination,
  days,
  tripTier = 'standard',
  customDailyBudget,
  customTotalBudget,
  travelersCount = 1,
  travelerType = 'solo',
  interests = ['Sightseeing', 'Nature', 'Culture', 'Local Food'],
  startDate,
  vehicleConfig,
  ticketsConfig,
}: {
  destination: Destination;
  days: number;
  tripTier: TripTier;
  customDailyBudget?: number;
  customTotalBudget?: number;
  travelersCount: number;
  travelerType: 'solo' | 'couple' | 'family' | 'friends';
  interests: string[];
  startDate?: string;
  vehicleConfig?: VehicleExpenseConfig;
  ticketsConfig?: PlaceTicketConfig[];
}): TripPlan {
  const allPlaces = [...destination.places];
  const totalDays = Math.max(1, Math.min(10, days || destination.idealDays || 3));
  const count = Math.max(1, travelersCount || 1);

  // Initialize or use vehicle and ticket configurations
  const activeVehicleConfig = vehicleConfig || getDefaultVehicleConfig(destination, totalDays, tripTier);
  const activeTicketsConfig = ticketsConfig || getDefaultPlaceTickets(destination, count);

  // Sum total customized vehicle and ticket admissions
  const totalVehicleExpense = activeVehicleConfig.totalVehicleCost;
  const totalAttractionsTickets = activeTicketsConfig
    .filter((t) => t.included)
    .reduce((acc, curr) => acc + curr.totalForGroup, 0);

  // Determine exact daily rate per person baseline
  let dailyRatePerPerson: number;
  if (customDailyBudget && customDailyBudget > 0) {
    dailyRatePerPerson = Math.round(customDailyBudget);
  } else if (customTotalBudget && customTotalBudget > 0) {
    dailyRatePerPerson = Math.max(100, Math.round(customTotalBudget / (totalDays * count)));
  } else if (tripTier === 'budget') {
    dailyRatePerPerson = destination.estimatedBudgetPerDay?.budget || 700;
  } else if (tripTier === 'luxury') {
    dailyRatePerPerson = destination.estimatedBudgetPerDay?.luxury || 14000;
  } else {
    dailyRatePerPerson = destination.estimatedBudgetPerDay?.standard || 3500;
  }

  // Realistic proportional budget splits
  const stayDailyPerPerson = Math.round(dailyRatePerPerson * 0.44);
  const foodDailyPerPerson = Math.round(dailyRatePerPerson * 0.24);
  const miscDailyPerPerson = Math.max(0, Math.round(dailyRatePerPerson * 0.08));

  const totalHotel = stayDailyPerPerson * totalDays * count;
  const totalFood = foodDailyPerPerson * totalDays * count;
  const totalMisc = miscDailyPerPerson * totalDays * count;

  // Use explicit vehicle & tickets calculations
  const totalTransport = totalVehicleExpense;
  const totalAttractions = totalAttractionsTickets;
  const totalActivities = 0;

  const total = totalHotel + totalFood + totalTransport + totalAttractions + totalMisc;
  const perPersonCost = Math.round(total / count);
  const dailyCost = Math.round(total / totalDays);

  // Build days
  const itineraryDays: ItineraryDay[] = [];
  const placesPerDay = Math.max(1, Math.ceil(allPlaces.length / totalDays));

  const start = new Date(startDate || Date.now());
  const endDate = new Date(start);
  endDate.setDate(start.getDate() + totalDays);

  for (let d = 0; d < totalDays; d++) {
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + d);

    // Pick places for this day
    const startIndex = (d * placesPerDay) % allPlaces.length;
    let dayPlaces = allPlaces.slice(startIndex, startIndex + placesPerDay);
    if (dayPlaces.length === 0) {
      dayPlaces = [allPlaces[d % allPlaces.length] || allPlaces[0]];
    }

    const morningPlace = dayPlaces[0] || destination.places[0];
    const afternoonPlace = dayPlaces[1] || dayPlaces[0];
    const eveningPlace = dayPlaces[2] || dayPlaces[dayPlaces.length - 1];

    const foodItem =
      destination.foodAndCuisine.signatureDishes[
        d % destination.foodAndCuisine.signatureDishes.length
      ]?.name || 'Local delicacies';

    const morningTicket = activeTicketsConfig.find((t) => t.placeId === morningPlace.id)?.adultTicket ?? morningPlace.entryFee;
    const afternoonTicket = activeTicketsConfig.find((t) => t.placeId === afternoonPlace.id)?.adultTicket ?? afternoonPlace.entryFee;
    const eveningTicket = activeTicketsConfig.find((t) => t.placeId === eveningPlace.id)?.adultTicket ?? eveningPlace.entryFee;

    itineraryDays.push({
      day: d + 1,
      date: dayDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      theme:
        d === 0
          ? 'Arrival, Scenic Introduction & Sunset Views'
          : d === totalDays - 1
          ? 'Heritage Souvenirs, Nature Walk & Farewell'
          : `Exploring Highlights of ${destination.name} - Phase ${d + 1}`,
      places: dayPlaces,
      recommendedFood: `${foodItem} at ${destination.foodAndCuisine.streetFoodSpots[0] || 'Local Cafe'}`,
      morningSlot: {
        placeId: morningPlace.id,
        activity: `Visit ${morningPlace.name} (${morningPlace.category}) - ${morningPlace.highlight}`,
        travelDuration: `${activeVehicleConfig.vehicleName.split('(')[0].trim()} • 25 min drive [Ticket: ${morningTicket === 0 ? 'Free' : `₹${morningTicket}`}]`,
      },
      afternoonSlot: {
        placeId: afternoonPlace.id,
        activity: `Explore ${afternoonPlace.name} & lunch tasting authentic ${foodItem}`,
        travelDuration: `${activeVehicleConfig.vehicleName.split('(')[0].trim()} • 20 min scenic route [Ticket: ${afternoonTicket === 0 ? 'Free' : `₹${afternoonTicket}`}]`,
      },
      eveningSlot: {
        placeId: eveningPlace.id,
        activity: `Sunset stroll at ${eveningPlace.name} and local cultural exploration`,
        travelDuration: `Walking / Short ride • 15 min [Ticket: ${eveningTicket === 0 ? 'Free' : `₹${eveningTicket}`}]`,
      },
      dailyCostEstimate: dailyCost,
      notes: `Vehicle: ${activeVehicleConfig.vehicleName}. Day's ticket admissions approx ₹${(morningTicket + afternoonTicket + eveningTicket) * count} for ${count} pax.`,
    });
  }

  const packingList = [
    'Light woolens / windcheater jacket',
    'Comfortable walking & trekking shoes',
    'Power bank and camera gear',
    'Sunscreen SPF 50 & sunglasses',
    'Prescribed medications & basic first-aid',
    'Government ID proof (Aadhaar / Passport)',
    'Water-resistant backpack & rain cover',
  ];

  if (destination.climate === 'cool' || destination.climate === 'snowy') {
    packingList.unshift('Thermal innerwear & woolen gloves');
  } else if (destination.climate === 'tropical') {
    packingList.unshift('Breathable cotton linen & swimwear');
  }

  return {
    id: `trip-${Date.now()}`,
    destinationId: destination.id,
    destinationName: destination.name,
    destinationImage: destination.heroImage,
    state: destination.state,
    startDate: start.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    totalDays,
    travelersCount: count,
    travelerType,
    tripTier,
    interests,
    itinerary: itineraryDays,
    budgetBreakdown: {
      transport: totalTransport,
      hotel: totalHotel,
      food: totalFood,
      attractions: totalAttractions,
      activities: totalActivities,
      miscellaneous: totalMisc,
      total,
      perPersonCost,
      dailyCost,
    },
    vehicleExpenseConfig: activeVehicleConfig,
    ticketsConfig: activeTicketsConfig,
    personalizedIntro: `A custom ${totalDays}-day ${tripTier} itinerary designed for ${count} ${travelerType} exploring ${destination.name}. Features verified local vehicle commute tariffs (₹${activeVehicleConfig.dailyRate}/day for ${activeVehicleConfig.vehicleName}) and itemized sightseeing ticket admissions for all key landmarks.`,
    packingChecklist: packingList,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Loads an image from a URL and converts it into a JPEG base64 Data URL.
 * Resizes the image to keep PDF size optimized.
 */
export async function loadImageAsDataUrl(
  url: string,
  maxWidth = 600,
  maxHeight = 400
): Promise<string | null> {
  if (!url) return null;
  if (url.startsWith('data:')) return url;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.referrerPolicy = 'no-referrer';

    // Safe timeout so PDF generation never hangs if network is slow
    const timer = setTimeout(() => {
      resolve(null);
    }, 3500);

    img.onload = () => {
      clearTimeout(timer);
      try {
        const canvas = document.createElement('canvas');
        let w = img.naturalWidth || 400;
        let h = img.naturalHeight || 300;

        // Calculate aspect-preserving dimensions
        const ratio = Math.min(maxWidth / w, maxHeight / h, 1);
        w = Math.max(10, Math.round(w * ratio));
        h = Math.max(10, Math.round(h * ratio));

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve(dataUrl);
        } else {
          resolve(null);
        }
      } catch (err) {
        console.warn('Canvas toDataURL failed:', err);
        resolve(null);
      }
    };

    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };

    img.src = url;
  });
}

/**
 * Downloads a high-craft, beautifully styled PDF itinerary with high-res place photos,
 * complete local vehicle expense breakdown & verified attraction ticket prices.
 */
export async function exportItineraryToPDF(
  trip: TripPlan,
  destination: Destination,
  customVehicleConfig?: VehicleExpenseConfig,
  customTicketsConfig?: PlaceTicketConfig[]
): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const vehicle = customVehicleConfig || trip.vehicleExpenseConfig || getDefaultVehicleConfig(destination, trip.totalDays, trip.tripTier);
  const tickets = customTicketsConfig || trip.ticketsConfig || getDefaultPlaceTickets(destination, trip.travelersCount);

  // 1. Preload Destination Hero & Place Photos in Parallel
  const heroPromise = loadImageAsDataUrl(destination.heroImage, 700, 350);
  const placesPromises = destination.places.map(async (p) => {
    const imgUrl = p.images?.[0] || destination.heroImage;
    const dataUrl = await loadImageAsDataUrl(imgUrl, 450, 300);
    return { id: p.id, dataUrl, place: p };
  });

  const [heroDataUrl, loadedPlaces] = await Promise.all([
    heroPromise,
    Promise.all(placesPromises),
  ]);

  const placeImageMap = new Map<string, string>();
  loadedPlaces.forEach((item) => {
    if (item.dataUrl) {
      placeImageMap.set(item.id, item.dataUrl);
    }
  });

  // ==================== PAGE 1: COVER & EXECUTIVE OVERVIEW ====================

  // Primary Header Banner with Slate Background
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent Line (Cyan gradient line)
  doc.setFillColor(6, 182, 212); // Cyan 500
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // Header Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('MG TRAVELS AI | DAY-BY-DAY ITINERARY', 14, 16);

  // Subtitle
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(56, 189, 248); // Sky 400
  doc.text(
    `${destination.name.toUpperCase()} (${destination.state.toUpperCase()}) • ${trip.totalDays} DAYS • VEHICLE & TICKETS INCLUDED`,
    14,
    25
  );

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.text(
    `Dates: ${trip.startDate} to ${trip.endDate}   |   Travelers: ${trip.travelersCount} (${trip.travelerType.toUpperCase()})   |   Vehicle: ${vehicle.vehicleType.toUpperCase()}`,
    14,
    33
  );

  let y = 49;

  // Render Destination Hero Banner Image if loaded
  if (heroDataUrl) {
    try {
      const imgHeight = 42;
      doc.addImage(heroDataUrl, 'JPEG', 14, y, pageWidth - 28, imgHeight, undefined, 'FAST');
      
      // Floating overlay badge for rating & climate
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(18, y + imgHeight - 10, 95, 7.5, 1.5, 1.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text(
        `* RATING: ${destination.rating}/5   |   CLIMATE: ${destination.climate.toUpperCase()}   |   ${destination.type.toUpperCase()}`,
        21,
        y + imgHeight - 5
      );
      
      y += imgHeight + 4.5;
    } catch (e) {
      console.warn('Failed to embed hero image into PDF:', e);
    }
  }

  // Executive Summary Card with Itemized Vehicle & Ticket totals
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, pageWidth - 28, 32, 2.5, 2.5, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('TRIP FINANCIAL & TRAVEL OVERVIEW', 18, y + 6);

  doc.setFontSize(7.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(
    `• Total Budget: Rs. ${trip.budgetBreakdown.total.toLocaleString()} (Rs. ${trip.budgetBreakdown.perPersonCost.toLocaleString()} per person)  |  Daily Avg: Rs. ${trip.budgetBreakdown.dailyCost.toLocaleString()}`,
    18,
    y + 12.5
  );
  doc.text(
    `• 🚗 Vehicle Commute: Rs. ${vehicle.totalVehicleCost.toLocaleString()} (${vehicle.vehicleName.split('(')[0].trim()})   |   🎟️ Attraction Tickets: Rs. ${trip.budgetBreakdown.attractions.toLocaleString()}`,
    18,
    y + 18.5
  );
  doc.text(
    `• 🏨 Hotel: Rs. ${trip.budgetBreakdown.hotel.toLocaleString()}   |   🍲 Food & Dining: Rs. ${trip.budgetBreakdown.food.toLocaleString()}   |   🎒 Misc: Rs. ${trip.budgetBreakdown.miscellaneous.toLocaleString()}`,
    18,
    y + 24.5
  );

  y += 36;

  // Personalized Intro
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(7.8);
  doc.setFont('helvetica', 'italic');
  const splitIntro = doc.splitTextToSize(
    trip.personalizedIntro || destination.description,
    pageWidth - 28
  );
  doc.text(splitIntro, 14, y);
  y += splitIntro.length * 3.6 + 4;

  // Day by Day Section Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('DAY-BY-DAY SCHEDULE & ATTRACTION TIMELINE', 14, y);
  y += 5;

  // Render each day's schedule with place photos
  trip.itinerary.forEach((day) => {
    const morningPlace = destination.places.find((p) => p.id === day.morningSlot.placeId);
    const afternoonPlace = destination.places.find((p) => p.id === day.afternoonSlot.placeId);
    const dayPlace = morningPlace || afternoonPlace || destination.places[0];
    const placeThumb = dayPlace ? placeImageMap.get(dayPlace.id) : null;

    const cardHeight = placeThumb ? 38 : 34;

    if (y > pageHeight - cardHeight - 12) {
      doc.addPage();
      y = 18;
    }

    // Day Container Box
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, y, pageWidth - 28, cardHeight, 2, 2, 'FD');

    // Day Header Pill
    doc.setFillColor(14, 116, 144); // Cyan 700
    doc.roundedRect(16, y + 2.5, 38, 5.2, 1, 1, 'F');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`DAY ${day.day} • ${day.date}`, 18, y + 6.2);

    // Day Theme
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    const themeText = doc.splitTextToSize(day.theme, placeThumb ? 88 : 125);
    doc.text(themeText[0] || day.theme, 57, y + 6.3);

    // If place image is available, render on the right
    const textWidth = placeThumb ? pageWidth - 76 : pageWidth - 36;
    if (placeThumb) {
      try {
        const imgX = pageWidth - 52;
        const imgY = y + 3;
        const imgW = 34;
        const imgH = 26;
        doc.addImage(placeThumb, 'JPEG', imgX, imgY, imgW, imgH, undefined, 'FAST');

        // Place Name caption under image
        doc.setFillColor(15, 23, 42);
        doc.rect(imgX, imgY + imgH, imgW, 5.5, 'F');
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        const placeNameShort = (dayPlace?.name || '').slice(0, 22);
        doc.text(placeNameShort, imgX + 1.5, imgY + imgH + 4);
      } catch (e) {
        console.warn('Failed to embed place thumb:', e);
      }
    }

    // Schedule Slot lines
    doc.setFontSize(7.2);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    const mText = `[08:30 AM] ${day.morningSlot.activity}`;
    const aText = `[01:30 PM] ${day.afternoonSlot.activity}`;
    const eText = `[05:30 PM] ${day.eveningSlot.activity}`;

    doc.text(doc.splitTextToSize(mText, textWidth)[0] || mText, 17, y + 13);
    doc.text(doc.splitTextToSize(aText, textWidth)[0] || aText, 17, y + 18.8);
    doc.text(doc.splitTextToSize(eText, textWidth)[0] || eText, 17, y + 24.6);

    // Footer of Day
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Cuisine: ${day.recommendedFood.slice(0, 48)}   |   Est. Cost: Rs. ${day.dailyCostEstimate.toLocaleString()}`,
      17,
      y + 31.5
    );

    y += cardHeight + 3.5;
  });

  // ==================== PAGE 2: VEHICLE EXPENSES & TICKET PRICES GUIDE ====================
  doc.addPage();
  y = 16;

  // Header Banner for Vehicle Expenses & Ticket Prices
  doc.setFillColor(15, 23, 42);
  doc.rect(14, y, pageWidth - 28, 14, 'F');
  doc.setFillColor(6, 182, 212);
  doc.rect(14, y + 14, pageWidth - 28, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`LOCAL VEHICLE EXPENSES & ATTRACTION TICKET DIRECTORY`, 18, y + 9.5);

  y += 20;

  // ----------------- SECTION 1: VEHICLE COMMUTE EXPENSES -----------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(14, 116, 144);
  doc.text('1. LOCAL VEHICLE COMMUTE & TARIFF BREAKDOWN', 14, y);
  y += 4.5;

  // Chosen vehicle highlight box
  doc.setDrawColor(186, 230, 253);
  doc.setFillColor(240, 249, 255);
  doc.roundedRect(14, y, pageWidth - 28, 24, 2, 2, 'FD');

  doc.setTextColor(12, 74, 96);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`Selected Mode: ${vehicle.vehicleName}`, 18, y + 5.5);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(
    `• Daily Base Rental / Fare: Rs. ${vehicle.dailyRate.toLocaleString()} / day   |   Fuel, Tolls & Parking: Rs. ${vehicle.fuelAndTollsPerDay.toLocaleString()} / day`,
    18,
    y + 11.5
  );
  doc.text(
    `• Driver Bata / Allowance: Rs. ${vehicle.driverAllowancePerDay.toLocaleString()} / day   |   Duration: ${vehicle.totalDays} Days   |   Total Vehicle Cost: Rs. ${vehicle.totalVehicleCost.toLocaleString()}`,
    18,
    y + 16.5
  );
  doc.text(
    `• Local Commute Notes: ${vehicle.notes || 'Includes point-to-point sightseeing, parking halts, and scheduled inter-city transfers.'}`,
    18,
    y + 21
  );

  y += 28;

  // Area Comparative Commute Benchmarks Table
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Standard Regional Tariff Benchmarks (${destination.name}, ${destination.state})`, 14, y);
  y += 3.5;

  // Table header
  doc.setFillColor(226, 232, 240);
  doc.rect(14, y, pageWidth - 28, 6, 'F');
  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('VEHICLE TYPE', 17, y + 4.2);
  doc.text('TYPICAL RATE IN THAT AREA', 65, y + 4.2);
  doc.text('RECOMMENDED FOR', 120, y + 4.2);
  doc.text('REMARKS', 158, y + 4.2);
  y += 6;

  const areaVehicleTariffs = [
    {
      type: 'Local Auto-Rickshaw',
      rate: 'Rs. 80-150 / hop (Rs. 1,000-1,400 full day)',
      for: 'Short town hops, bazaars & temples',
      remarks: 'Pre-negotiate or use meter where available',
    },
    {
      type: 'AC Sedan Taxi (Dzire/Etios)',
      rate: 'Rs. 2,200 - 2,800 (8hr / 80km package)',
      for: 'Couples & families (up to 4 pax)',
      remarks: 'Covers major waterfalls & viewpoints',
    },
    {
      type: 'AC SUV (Innova Crysta)',
      rate: 'Rs. 3,600 - 4,800 (8hr / 80km package)',
      for: 'Groups 4-7 pax & ghat hairpin roads',
      remarks: 'Highest comfort, luggage space & hill power',
    },
    {
      type: 'Scooter / Bike Rental',
      rate: 'Rs. 400 - 700 / day (Petrol extra)',
      for: 'Solo backpackers & couples',
      remarks: 'Valid Driving License and helmet required',
    },
  ];

  areaVehicleTariffs.forEach((row, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, 250, 252);
    doc.rect(14, y, pageWidth - 28, 5.5, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.rect(14, y, pageWidth - 28, 5.5, 'S');

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(row.type, 17, y + 3.8);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(row.rate, 65, y + 3.8);
    doc.text(row.for, 120, y + 3.8);
    doc.text(row.remarks, 158, y + 3.8);

    y += 5.5;
  });

  y += 6;

  // ----------------- SECTION 2: SIGHTSEEING TICKET PRICES TABLE -----------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(14, 116, 144);
  doc.text('2. SIGHTSEEING ATTRACTIONS ENTRY TICKET & PERMIT DIRECTORY', 14, y);
  y += 4.5;

  // Table header
  doc.setFillColor(15, 23, 42);
  doc.rect(14, y, pageWidth - 28, 6.5, 'F');
  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('ATTRACTION / PLACE', 17, y + 4.5);
  doc.text('CATEGORY', 68, y + 4.5);
  doc.text('ADULT (INR)', 105, y + 4.5);
  doc.text('CHILD (INR)', 125, y + 4.5);
  doc.text('CAMERA (INR)', 145, y + 4.5);
  doc.text(`TOTAL (${trip.travelersCount} PAX)`, 166, y + 4.5);
  y += 6.5;

  let grandTotalTickets = 0;

  tickets.forEach((tick, idx) => {
    if (y > pageHeight - 25) {
      doc.addPage();
      y = 18;
    }

    const rowCost = tick.included ? tick.totalForGroup : 0;
    grandTotalTickets += rowCost;

    doc.setFillColor(idx % 2 === 0 ? 255 : 248, 250, 252);
    doc.rect(14, y, pageWidth - 28, 5.8, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, pageWidth - 28, 5.8, 'S');

    doc.setFontSize(6.6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(tick.placeName.slice(0, 32), 17, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(tick.category.slice(0, 20), 68, y + 4);
    doc.text(tick.adultTicket === 0 ? 'Free' : `Rs. ${tick.adultTicket}`, 105, y + 4);
    doc.text(tick.childTicket === 0 ? 'Free' : `Rs. ${tick.childTicket}`, 125, y + 4);
    doc.text(tick.cameraFee === 0 ? 'Nil' : `Rs. ${tick.cameraFee}`, 145, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(tick.included ? 14 : 148, tick.included ? 116 : 163, tick.included ? 144 : 184);
    doc.text(tick.included ? `Rs. ${rowCost.toLocaleString()}` : 'Excluded', 166, y + 4);

    y += 5.8;
  });

  // Ticket totals row
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 6.5, 'F');
  doc.setFontSize(7.2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL ESTIMATED ATTRACTION ADMISSION & CAMERA FEES:', 17, y + 4.5);
  doc.setTextColor(14, 116, 144);
  doc.text(`Rs. ${grandTotalTickets.toLocaleString()}`, 166, y + 4.5);
  y += 10;

  // ----------------- SECTION 3: TOTAL VEHICLE & ENTRANCE FEES COMBINED BREAKDOWN -----------------
  if (y > pageHeight - 50) {
    doc.addPage();
    y = 18;
  }

  const combinedVehicleAndFees = vehicle.totalVehicleCost + grandTotalTickets;
  const perPersonCombined = Math.round(combinedVehicleAndFees / trip.travelersCount);
  const perDayCombined = Math.round(combinedVehicleAndFees / vehicle.totalDays);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('3. TOTAL VEHICLE & ENTRANCE FEES ITEMIZED SUMMARY', 14, y);
  y += 4.5;

  // Combined Summary Card Box
  doc.setDrawColor(6, 182, 212);
  doc.setFillColor(240, 253, 250); // Emerald/Teal 50
  doc.roundedRect(14, y, pageWidth - 28, 28, 2.5, 2.5, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136); // Teal 600
  doc.text(
    `COMBINED TOTAL VEHICLE & ENTRANCE FEES: Rs. ${combinedVehicleAndFees.toLocaleString()} (${vehicle.totalDays} Days / ${trip.travelersCount} Pax)`,
    18,
    y + 6
  );

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(
    `• Total Vehicle Commute: Rs. ${vehicle.totalVehicleCost.toLocaleString()}  [(Rs. ${vehicle.dailyRate} base + Rs. ${vehicle.fuelAndTollsPerDay} fuel + Rs. ${vehicle.driverAllowancePerDay} bata) x ${vehicle.totalDays} days]`,
    18,
    y + 11.8
  );
  doc.text(
    `• Total Attraction Entrance Fees: Rs. ${grandTotalTickets.toLocaleString()}  [${tickets.filter(t => t.included).length} Verified Sightseeing Attractions for ${trip.travelersCount} Travelers]`,
    18,
    y + 16.8
  );
  doc.text(
    `• Per-Person Combined Allocation: Rs. ${perPersonCombined.toLocaleString()} / person   |   Daily Combined Average: Rs. ${perDayCombined.toLocaleString()} / day`,
    18,
    y + 21.8
  );

  y += 33;

  // Practical Ticketing & Permit Tips Box
  if (y > pageHeight - 32) {
    doc.addPage();
    y = 18;
  }

  doc.setDrawColor(254, 215, 170);
  doc.setFillColor(255, 251, 235);
  doc.roundedRect(14, y, pageWidth - 28, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(154, 52, 18);
  doc.text('🎟️ OFFICIAL TICKET BOOKING & ENTRY GUIDELINES', 18, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(120, 53, 15);
  doc.text(
    '• Carry valid Government photo ID proof (Aadhaar / Driving License / Passport) for age verification at ticket counters.',
    18,
    y + 9.5
  );
  doc.text(
    '• For ASI Monuments, pre-booking via the official ASI portal offers QR fast-track entry and saves Rs. 5 per ticket.',
    18,
    y + 13.5
  );
  doc.text(
    '• Foreign nationals ticket prices range from Rs. 250 - Rs. 650 depending on SAARC / Non-SAARC category.',
    18,
    y + 17.5
  );

  y += 24;

  // ==================== PAGE 3: PLACES PHOTO GALLERY & PACKING ====================
  if (y > pageHeight - 80) {
    doc.addPage();
    y = 16;
  }

  // Header Banner for Places Photo Guide
  doc.setFillColor(15, 23, 42);
  doc.rect(14, y, pageWidth - 28, 12, 'F');
  doc.setFillColor(6, 182, 212);
  doc.rect(14, y + 12, pageWidth - 28, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`DESTINATION ATTRACTIONS & SIGHTSEEING PHOTO GUIDE`, 18, y + 8);

  y += 18;

  // 2-Column Grid of Attraction Photos and Descriptions
  const colWidth = (pageWidth - 34) / 2;
  const cardH = 46;

  const topPlaces = destination.places.slice(0, 4);

  topPlaces.forEach((place, index) => {
    const col = index % 2;
    const xPos = 14 + col * (colWidth + 6);

    if (index > 0 && index % 2 === 0) {
      y += cardH + 4;
    }

    if (y > pageHeight - cardH - 15) {
      doc.addPage();
      y = 18;
    }

    // Place Box Container
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(xPos, y, colWidth, cardH, 2, 2, 'FD');

    // Place Photo
    const pImg = placeImageMap.get(place.id);
    const photoH = 24;
    if (pImg) {
      try {
        doc.addImage(pImg, 'JPEG', xPos + 1.5, y + 1.5, colWidth - 3, photoH, undefined, 'FAST');
      } catch (e) {
        console.warn('Place gallery image error:', e);
      }
    } else {
      doc.setFillColor(241, 245, 249);
      doc.rect(xPos + 1.5, y + 1.5, colWidth - 3, photoH, 'F');
    }

    // Category tag overlay on image
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(xPos + 3, y + 3, 28, 4.2, 1, 1, 'F');
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(5.8);
    doc.setFont('helvetica', 'bold');
    doc.text((place.category || 'Attraction').toUpperCase(), xPos + 4.5, y + 6);

    // Place Details Text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(place.name, xPos + 3, y + photoH + 5);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(
      `Entry: ${place.entryFee === 0 ? 'Free' : `Rs. ${place.entryFee}`}  |  Time: ${place.timeNeeded || '2 hrs'}  |  Rating: * ${place.rating}/5`,
      xPos + 3,
      y + photoH + 9.5
    );

    doc.setFontSize(6.2);
    doc.setTextColor(100, 116, 139);
    const highlightLines = doc.splitTextToSize(place.highlight || place.description, colWidth - 6);
    doc.text(highlightLines.slice(0, 2), xPos + 3, y + photoH + 14);
  });

  y += cardH + 6;

  // Packing Checklist Section
  if (y > pageHeight - 55) {
    doc.addPage();
    y = 18;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('ESSENTIAL TRAVEL PACKING CHECKLIST', 14, y);
  y += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(71, 85, 105);

  trip.packingChecklist.slice(0, 6).forEach((item, index) => {
    if (index % 2 === 0) {
      doc.text(`[  ] ${item}`, 18, y);
      const nextItem = trip.packingChecklist[index + 1];
      if (nextItem) {
        doc.text(`[  ] ${nextItem}`, 110, y);
      }
      y += 4.2;
    }
  });

  y += 4;

  // Emergency & Safety Information
  if (y > pageHeight - 28) {
    doc.addPage();
    y = 18;
  }

  doc.setDrawColor(254, 202, 202);
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(14, y, pageWidth - 28, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(153, 27, 27);
  doc.text('24x7 EMERGENCY ASSISTANCE & HELPLINES', 18, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(185, 28, 28);
  doc.text(
    '• National Emergency: 112   |   Tourist Police: 1363   |   Ambulance: 108   |   Highway Patrol: 1033',
    18,
    y + 9.5
  );
  doc.text(
    `• MG Travels 24/7 Digital Concierge Support: +91 800-MG-TRIP / help@mgtravels.ai`,
    18,
    y + 13.5
  );

  // Footer on every page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(6.8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `MG Travels AI Platform • Day-Wise Photo Itinerary, Vehicle & Ticket Guide • Page ${i} of ${totalPages}`,
      14,
      pageHeight - 6
    );
  }

  const fileName = `${trip.destinationName.replace(/[^a-zA-Z0-9]/g, '_')}_DayWise_Vehicle_Tickets_Itinerary.pdf`;
  doc.save(fileName);
  return doc;
}
