/**
 * Real-Time Place & Image Intelligence Service
 * Fetches authentic Wikipedia summaries, Wikimedia Commons high-resolution photography,
 * and OpenStreetMap geographical coordinates & administrative boundaries.
 */

export interface RealtimePlaceInfo {
  title: string;
  extract?: string;
  description?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  coordinates?: { lat: number; lng: number };
  state?: string;
  district?: string;
  country?: string;
  source: 'wikipedia' | 'osm' | 'curated';
}

// In-memory cache to prevent redundant network queries
const placeCache = new Map<string, RealtimePlaceInfo>();

/**
 * Fetches real-time summary and verified high-res photo from Wikipedia REST API
 */
export async function fetchWikipediaPlace(query: string): Promise<RealtimePlaceInfo | null> {
  const normalized = query.trim();
  const cacheKey = normalized.toLowerCase();
  if (placeCache.has(cacheKey)) {
    return placeCache.get(cacheKey)!;
  }

  try {
    const cleanTitle = encodeURIComponent(normalized.replace(/[\(\),]/g, ' ').trim());
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${cleanTitle}`, {
      headers: { 'User-Agent': 'MGTravels-App/1.0' },
    });

    if (!res.ok) {
      // Try search query if direct title was not found
      return await searchWikipediaPlace(normalized);
    }

    const data = await res.json();
    if (data.type === 'disambiguation') {
      return await searchWikipediaPlace(normalized);
    }

    const result: RealtimePlaceInfo = {
      title: data.titles?.display || data.title || normalized,
      extract: data.extract,
      description: data.description,
      imageUrl: data.originalimage?.source || data.thumbnail?.source,
      thumbnailUrl: data.thumbnail?.source,
      coordinates: data.coordinates ? { lat: data.coordinates.lat, lng: data.coordinates.lon } : undefined,
      source: 'wikipedia',
    };

    placeCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.warn('Wikipedia fetch failed for', query, err);
    return null;
  }
}

/**
 * Fallback search on Wikipedia Action API for landmarks & places
 */
async function searchWikipediaPlace(query: string): Promise<RealtimePlaceInfo | null> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages|extracts&exintro=1&explaintext=1&pithumbsize=1000&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;

    const firstPageId = Object.keys(pages)[0];
    const page = pages[firstPageId];
    if (!page) return null;

    const result: RealtimePlaceInfo = {
      title: page.title || query,
      extract: page.extract,
      imageUrl: page.thumbnail?.source,
      thumbnailUrl: page.thumbnail?.source,
      source: 'wikipedia',
    };

    placeCache.set(query.toLowerCase(), result);
    return result;
  } catch (err) {
    return null;
  }
}

/**
 * Fetches accurate geocoding, district, state & country from OpenStreetMap
 */
export async function fetchOsmLocation(query: string): Promise<{
  lat: number;
  lng: number;
  displayName: string;
  state?: string;
  district?: string;
  country?: string;
} | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'MGTravels-App/1.0' },
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const item = data[0];
    const addr = item.address || {};
    const district = addr.state_district || addr.county || addr.city || addr.town;
    const state = addr.state || addr.region;
    const country = addr.country || 'India';

    return {
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      displayName: item.display_name,
      district,
      state,
      country,
    };
  } catch (err) {
    return null;
  }
}

/**
 * Curated, high-fidelity photo library for specific travel themes & categories
 * ensuring that every place always displays an authentic, distinct, optically stunning photo.
 */
export const CATEGORY_AUTHENTIC_PHOTOS: Record<string, string[]> = {
  hill_fort: [
    'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80', // Ancient stone fortress
    'https://images.unsplash.com/photo-1600100397608-f010e42e5a40?auto=format&fit=crop&w=1200&q=80', // Fort parapets
    'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80', // Heritage citadel
  ],
  heritage_temple: [
    'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1200&q=80', // Dravidian carved temple stone pillars
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', // Ancient gopuram
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80', // Temple sanctum
  ],
  dam_reservoir_lake: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Serene blue water reservoir
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=80', // Mountain dam waters
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80', // Misty lake reflections
  ],
  bazaar_market: [
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80', // Traditional silk & spices market
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', // Vibrant culinary food street
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80', // Artisan crafts bazaar
  ],
  rocky_hills_trek: [
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80', // Rocky granite hill peaks
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', // Dramatic hill ridges
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', // Lush valley panorama
  ],
};
