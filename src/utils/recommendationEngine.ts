import { Destination, RecommendationRequest } from '../types/travel';

export interface ScoredDestination extends Destination {
  aiScore: number;
  matchReasons: string[];
  scoreBreakdown: {
    preferenceSimilarity: number;
    budgetMatch: number;
    weatherMatch: number;
    ratingScore: number;
    tripTypeMatch: number;
  };
}

/**
 * Calculates vector dot product and norms for Cosine Similarity:
 * similarity = (A · B) / (||A|| × ||B||)
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;
  return Math.min(1, Math.max(0, dotProduct / denominator));
}

// Map categories to index
const CATEGORY_KEYS = [
  'Hill Stations',
  'Beaches',
  'Heritage',
  'Wildlife',
  'Pilgrimage',
  'Adventure',
  'Backwaters',
  'Luxury',
];

const INTEREST_KEYWORDS: Record<string, string[]> = {
  nature: ['Hill Stations', 'Backwaters', 'Wildlife'],
  adventure: ['Adventure', 'Hill Stations', 'Beaches'],
  heritage: ['Heritage', 'Pilgrimage'],
  relaxation: ['Backwaters', 'Beaches', 'Hill Stations'],
  wildlife: ['Wildlife', 'Hill Stations'],
  food: ['Heritage', 'Hill Stations', 'Backwaters', 'Beaches'],
  spiritual: ['Pilgrimage', 'Heritage'],
  culture: ['Heritage', 'Pilgrimage', 'Hill Stations'],
};

/**
 * Hybrid Recommendation Engine
 * Combines Rule-Based, Content-Based Cosine Similarity, Weighted Multi-Factor Scoring & Ranking
 */
export function runHybridRecommendation(
  destinations: Destination[],
  request: RecommendationRequest
): ScoredDestination[] {
  const {
    budget = 25000,
    budgetType = 'total',
    strictBudget = true,
    climate,
    state,
    tripType,
    tripTypes,
    days = 4,
    interests = [],
    placeQuery,
  } = request;

  // Compute effective daily budget and total budget
  const effectiveDailyBudget =
    budgetType === 'per_day'
      ? budget
      : Math.round(budget / Math.max(1, days));

  const totalUserBudget =
    budgetType === 'per_day'
      ? budget * days
      : budget;

  // 1. Feature vector creation for User
  // Vector dimensions: [HillStations, Beaches, Heritage, Wildlife, Pilgrimage, Adventure, Backwaters, Luxury, CoolClimate, TropicalClimate, ModerateClimate, SnowyClimate]
  const userVector: number[] = new Array(12).fill(0.1);

  // Boost requested tripType(s)
  const activeTripTypes: string[] =
    tripTypes && tripTypes.length > 0
      ? tripTypes
      : tripType && tripType !== 'All'
      ? [tripType]
      : [];

  activeTripTypes.forEach((type) => {
    const catIdx = CATEGORY_KEYS.indexOf(type);
    if (catIdx !== -1) {
      userVector[catIdx] = 1.0;
    }
  });

  // Boost interests
  interests.forEach((interest) => {
    const matchedCategories = INTEREST_KEYWORDS[interest.toLowerCase()] || [];
    matchedCategories.forEach((cat) => {
      const idx = CATEGORY_KEYS.indexOf(cat);
      if (idx !== -1) {
        userVector[idx] = Math.min(1.0, userVector[idx] + 0.4);
      }
    });
  });

  // Climate preference in user vector
  if (climate) {
    if (climate === 'cool') userVector[8] = 1.0;
    if (climate === 'tropical') userVector[9] = 1.0;
    if (climate === 'moderate') userVector[10] = 1.0;
    if (climate === 'snowy') userVector[11] = 1.0;
  }

  // Pre-filter destinations if strictBudget is enabled and budget is specified
  let candidateDestinations = destinations;
  if (strictBudget && budget > 0) {
    candidateDestinations = destinations.filter((dest) => {
      const tripDays = days || dest.idealDays || 3;
      const dailyCost = dest.estimatedBudgetPerDay.budget;
      const totalTripCost = dailyCost * tripDays;

      if (budgetType === 'per_day') {
        return dailyCost <= effectiveDailyBudget;
      } else {
        return totalTripCost <= totalUserBudget;
      }
    });
  }

  // 2. Score each candidate destination
  const scoredList: ScoredDestination[] = candidateDestinations.map((dest) => {
    const destVector: number[] = new Array(12).fill(0.05);

    // Set destination category
    const catIdx = CATEGORY_KEYS.indexOf(dest.type);
    if (catIdx !== -1) {
      destVector[catIdx] = 1.0;
    }

    // Set destination climate
    if (dest.climate === 'cool') destVector[8] = 1.0;
    if (dest.climate === 'tropical') destVector[9] = 1.0;
    if (dest.climate === 'moderate') destVector[10] = 1.0;
    if (dest.climate === 'snowy') destVector[11] = 1.0;

    // A. Preference Similarity (Cosine Similarity)
    const preferenceSimilarity = cosineSimilarity(userVector, destVector);

    // B. Budget Match Score
    const minDaily = dest.estimatedBudgetPerDay.budget;
    const stdDaily = dest.estimatedBudgetPerDay.standard;
    const estimatedStandardTripCost = stdDaily * days;
    const estimatedBudgetTripCost = minDaily * days;

    let budgetMatch = 0.8;
    if (effectiveDailyBudget >= stdDaily) {
      // Comfortably covers standard tier
      const ratio = stdDaily / effectiveDailyBudget;
      budgetMatch = ratio > 0.35 ? 1.0 : 0.92;
    } else if (effectiveDailyBudget >= minDaily) {
      // Fits budget/backpacker tier perfectly (e.g. ₹500/day for ₹450 destination)
      budgetMatch = 0.96;
    } else {
      // Over budget penalty
      const overRatio = effectiveDailyBudget / minDaily;
      budgetMatch = Math.max(0.15, overRatio * 0.6);
    }

    // C. Weather/Climate Match
    let weatherMatch = 0.7;
    if (climate && climate.toLowerCase() === dest.climate.toLowerCase()) {
      weatherMatch = 1.0;
    } else if (!climate || climate === 'any') {
      weatherMatch = 0.9;
    } else {
      weatherMatch = 0.45;
    }

    // D. Rating & Popularity Score (Normalized 0 to 1)
    const ratingScore = Math.min(1.0, dest.rating / 5.0);

    // E. Trip-Type / State / Place Match
    let tripTypeMatch = 0.6;
    if (activeTripTypes.length > 0) {
      const matchesActive = activeTripTypes.some(
        (t) =>
          dest.type.toLowerCase() === t.toLowerCase() ||
          dest.type.toLowerCase().includes(t.toLowerCase()) ||
          t.toLowerCase().includes(dest.type.toLowerCase())
      );
      if (matchesActive) tripTypeMatch = 1.0;
    }
    if (state && state.toLowerCase() === dest.state.toLowerCase()) {
      tripTypeMatch = Math.min(1.0, tripTypeMatch + 0.3);
    }
    if (placeQuery && placeQuery.trim()) {
      const q = placeQuery.trim().toLowerCase();
      if (
        dest.name.toLowerCase().includes(q) ||
        dest.state.toLowerCase().includes(q) ||
        dest.tagline.toLowerCase().includes(q)
      ) {
        tripTypeMatch = Math.min(1.0, tripTypeMatch + 0.5);
      }
    }

    // Step 5: Weighted Formula:
    // Final Score = 0.30 * Preference Similarity + 0.30 * Budget Match + 0.15 * Weather Match + 0.15 * Rating + 0.10 * Trip-Type Match
    const rawScore =
      0.30 * preferenceSimilarity +
      0.30 * budgetMatch +
      0.15 * weatherMatch +
      0.15 * ratingScore +
      0.10 * tripTypeMatch;

    // Scale to percentage (70% - 99% range)
    const percentage = Math.round(Math.min(99, Math.max(60, rawScore * 100)));

    const matchReasons: string[] = [];
    if (budgetType === 'per_day') {
      if (effectiveDailyBudget >= minDaily) {
        matchReasons.push(
          `Fits your ₹${effectiveDailyBudget.toLocaleString()}/day budget (starts at ₹${minDaily.toLocaleString()}/day)`
        );
      }
    } else {
      if (totalUserBudget >= estimatedBudgetTripCost) {
        matchReasons.push(
          `Within your ₹${totalUserBudget.toLocaleString()} trip budget (est. ₹${estimatedBudgetTripCost.toLocaleString()} - ₹${estimatedStandardTripCost.toLocaleString()})`
        );
      }
    }

    if (activeTripTypes.length > 0 && activeTripTypes.some((t) => dest.type.toLowerCase().includes(t.toLowerCase()))) {
      matchReasons.push(`Matches your interest in ${dest.type}`);
    }
    if (climate && dest.climate.toLowerCase() === climate.toLowerCase()) {
      matchReasons.push(`Ideal ${dest.climate} climate`);
    }
    if (state && dest.state.toLowerCase() === state.toLowerCase()) {
      matchReasons.push(`Located in ${dest.state}`);
    }
    if (dest.rating >= 4.8) {
      matchReasons.push(`Highly rated destination (${dest.rating} ★)`);
    }
    if (matchReasons.length === 0) {
      matchReasons.push('Optimal match for your selected travel profile');
    }

    return {
      ...dest,
      aiScore: percentage,
      matchReasons,
      scoreBreakdown: {
        preferenceSimilarity: Math.round(preferenceSimilarity * 100),
        budgetMatch: Math.round(budgetMatch * 100),
        weatherMatch: Math.round(weatherMatch * 100),
        ratingScore: Math.round(ratingScore * 100),
        tripTypeMatch: Math.round(tripTypeMatch * 100),
      },
    };
  });

  // Step 6: Sort by final score descending
  return scoredList.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
}
