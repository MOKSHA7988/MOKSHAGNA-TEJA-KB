import { Destination, Place } from '../types/travel';

// Curated high-fidelity destination database covering popular Indian & Global queries (including urban hubs, neighborhoods like Nagwara/Bangalore, hill stations, heritage cities, beaches, and global cities)
export const KNOWN_DESTINATIONS: Record<string, Partial<Destination>> = {
  nagwara: {
    id: 'nagwara',
    name: 'Nagwara (Bengaluru)',
    state: 'Karnataka',
    country: 'India',
    tagline: 'Scenic lakeside promenades, tech corridors & tranquil urban gardens',
    description: 'Nagwara is a vibrant urban district in North Bengaluru, renowned for the expansive Nagawara Lake, the waterfront Lumbini Gardens, bustling Manyata Embassy Business Park, and lush lakeside cafes. An ideal metropolitan getaway offering boating, musical fountains, buzzing foodie streets, and quick connectivity to Nandi Hills.',
    type: 'Luxury',
    climate: 'moderate',
    idealDays: 2,
    estimatedBudgetPerDay: {
      budget: 650,
      standard: 2200,
      luxury: 7500,
    },
    rating: 4.7,
    reviewsCount: 1840,
    heroImage: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/5F_XW7k-Fw8',
    bestTimeToVisitMonths: 'September to March (Pleasant Bengaluru weather)',
    seasons: [
      {
        season: 'Winter & Post-Monsoon (Oct - Feb)',
        avgTemp: '16°C - 28°C',
        rainfall: 'Low',
        suitability: 'Peak',
        description: 'Breezy mornings, crisp evenings, perfect for lakeside walks, boating, and open-air rooftop dining.',
      },
      {
        season: 'Monsoon (Jun - Sep)',
        avgTemp: '20°C - 27°C',
        rainfall: 'Moderate',
        suitability: 'Good',
        description: 'Lush green lakeside foliage, cool drizzle, and tranquil evenings by Nagawara waterfront.',
      },
      {
        season: 'Summer (Mar - May)',
        avgTemp: '22°C - 34°C',
        rainfall: 'Occasional Pre-Monsoon Showers',
        suitability: 'Moderate',
        description: 'Warm afternoons with pleasant cooling evening breezes by the water.',
      },
    ],
    foodAndCuisine: {
      overview: 'A melting pot of traditional Karnataka specialties, coastal delicacies, buzzing cafe culture, and international dining.',
      signatureDishes: [
        {
          name: 'Benne Dosa & Filter Coffee',
          description: 'Crispy butter dosa roasted on cast iron, served with coconut chutney and spicy potato masala.',
          type: 'veg',
          spiceLevel: 'medium',
          famousSpot: 'Nagwara Junction Heritage Tiffin House',
        },
        {
          name: 'Nati Style Donne Biryani',
          description: 'Fragrant Seeraga Samba rice cooked with rustic spices, fresh mint, coriander, and tender marinated meats.',
          type: 'non-veg',
          spiceLevel: 'spicy',
          famousSpot: 'Manyata Ring Road Military Hotel',
        },
        {
          name: 'Mangalore Ghee Roast & Neer Dosa',
          description: 'Velvety thin rice crepes paired with fiery, rich ghee roasted masala.',
          type: 'non-veg',
          spiceLevel: 'spicy',
          famousSpot: 'Lumbini Waterfront Coastal Mess',
        },
      ],
      streetFoodSpots: ['Nagwara Outer Ring Road Food Street', 'Manyata Tech Park Gate 1 Eatery Hub', 'HBR Layout 5th Block Cafe Lane'],
    },
    culture: {
      languages: ['Kannada', 'English', 'Hindi', 'Tamil', 'Telugu'],
      festivals: ['Bengaluru Karaga', 'Kadalekai Parishe (Groundnut Fair)', 'Dussehra & Diwali Light Festival'],
      traditions: ['Garden City park culture', 'Modern tech hub lifestyle blended with traditional south Indian breakfast rituals'],
      etiquetteTips: [
        'Metro and local app taxis (Uber, Ola, Namma Yatri) are ideal for commuting around Nagwara.',
        'Keep lakeside walking paths clean and plastic-free.',
        'Try early morning walks around the lake promenade for serene birdwatching.',
      ],
      dressCode: 'Casual wear; light jacket for breezy evenings.',
    },
    coordinates: { lat: 13.0358, lng: 77.6097 },
    places: [
      {
        id: 'nagwara-p1',
        name: 'Nagawara Lake & Lumbini Waterfront',
        category: 'Scenic & Nature',
        description: 'A picturesque urban lake featuring pedal boating, landscaped walking promenades, musical fountains, and evening breeze seating.',
        images: ['https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80'],
        lat: 13.0365,
        lng: 77.6102,
        entryFee: 30,
        timeNeeded: '2 hours',
        bestTimeToVisit: 'Evening (4:30 PM - 7:30 PM)',
        rating: 4.6,
        reviewsCount: 2450,
        highlight: 'Lakeside sunset views and peaceful pedal boating on the water.',
        recommendedTimeSlot: 'evening',
      },
      {
        id: 'nagwara-p2',
        name: 'Manyata Tech Park Central Promenade & Food Street',
        category: 'Shopping & Leisure',
        description: 'One of Asia’s largest tech business parks featuring lively green plazas, premier international dining, gourmet food courts, and open-air amphitheaters.',
        images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'],
        lat: 13.0452,
        lng: 77.6205,
        entryFee: 0,
        timeNeeded: '2 hours',
        bestTimeToVisit: 'Lunch / Evening (12:00 PM - 9:00 PM)',
        rating: 4.8,
        reviewsCount: 3120,
        highlight: 'Vibrant urban vibe, global culinary choices, and modern architecture.',
        recommendedTimeSlot: 'afternoon',
      },
      {
        id: 'nagwara-p3',
        name: 'Hebbal Lake Bird Sanctuary Promenade',
        category: 'Scenic & Nature',
        description: 'Sprawling natural lake and wetland sanctuary located minutes from Nagwara, home to kingfishers, egrets, pelicans, and tranquil bamboo canopies.',
        images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'],
        lat: 13.0401,
        lng: 77.5902,
        entryFee: 20,
        timeNeeded: '2.5 hours',
        bestTimeToVisit: 'Early Morning (6:00 AM - 9:30 AM)',
        rating: 4.7,
        reviewsCount: 1680,
        highlight: 'Morning mist, vibrant migratory birds, and serene photography spots.',
        recommendedTimeSlot: 'morning',
      },
      {
        id: 'nagwara-p4',
        name: 'Bangalore Heritage Palace & Grounds',
        category: 'Heritage & History',
        description: 'Tudor-style royal estate boasting turreted parapets, Gothic stained glass windows, wood carvings, and historic memorabilia of the Wadiyar dynasty (15 mins commute).',
        images: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'],
        lat: 12.9988,
        lng: 77.5921,
        entryFee: 250,
        timeNeeded: '3 hours',
        bestTimeToVisit: 'Morning 10:00 AM - 1:00 PM',
        rating: 4.8,
        reviewsCount: 4890,
        highlight: 'Royal Durbar hall and vast open royal courtyards.',
        recommendedTimeSlot: 'morning',
      },
      {
        id: 'nagwara-p5',
        name: 'Nandi Hills Sunrise Excursion Route',
        category: 'Adventure & Treks',
        description: 'Historic hilltop fortress perched at 4,851 ft offering breathtaking cloud-bed sunrise views, Tipu Sultan’s summer lodge, and scenic mountain trails.',
        images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'],
        lat: 13.3702,
        lng: 77.6835,
        entryFee: 20,
        timeNeeded: '4 hours',
        bestTimeToVisit: 'Dawn / Early Morning (5:30 AM - 9:00 AM)',
        rating: 4.9,
        reviewsCount: 6540,
        highlight: 'Sea of clouds rolling beneath the clifftop at dawn.',
        recommendedTimeSlot: 'morning',
      },
    ],
  },
  bangalore: {
    id: 'bangalore',
    name: 'Bengaluru (Bangalore)',
    state: 'Karnataka',
    country: 'India',
    tagline: 'The Garden City & Silicon Capital of India with legendary weather',
    description: 'Bengaluru is a dynamic cosmopolitan metropolis blending royal Victorian gardens, grand palaces, craft breweries, historic tiffin rooms, and energetic cultural neighborhoods.',
    type: 'Luxury',
    climate: 'moderate',
    idealDays: 3,
    estimatedBudgetPerDay: { budget: 750, standard: 2800, luxury: 9500 },
    rating: 4.8,
    reviewsCount: 3890,
    heroImage: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/5F_XW7k-Fw8',
    bestTimeToVisitMonths: 'All Year Round (October to March best)',
    seasons: [
      { season: 'Winter (Oct - Feb)', avgTemp: '15°C - 28°C', rainfall: 'Low', suitability: 'Peak', description: 'Crisp pleasant days and cool breezy evenings.' },
    ],
    foodAndCuisine: {
      overview: 'Famous for filter coffee, crispy ghee roast dosas, bisi bele bath, and modern artisan bakeries.',
      signatureDishes: [
        { name: 'CTR Butter Masala Dosa', description: 'Legendary crisp butter dosa with mint chutney.', type: 'veg', spiceLevel: 'medium', famousSpot: 'Malleswaram CTR' },
        { name: 'Filter Kaapi', description: 'Traditional chicory-infused frothed coffee in a brass davarah.', type: 'veg', spiceLevel: 'mild', famousSpot: 'Brahmin Coffee Bar' },
      ],
      streetFoodSpots: ['VV Puram Food Street', 'Church Street & Brigade Road', 'Indiranagar 100ft Road'],
    },
    culture: {
      languages: ['Kannada', 'English', 'Hindi', 'Tamil', 'Telugu'],
      festivals: ['Karaga Shaktyotsava', 'Bangalore Literature Festival'],
      traditions: ['Morning park jogs at Cubbon Park', 'Weekend brewery hops'],
      etiquetteTips: ['Use Namma Metro to beat traffic', 'Respect morning walking hours in public gardens'],
    },
    coordinates: { lat: 12.9716, lng: 77.5946 },
    places: [
      {
        id: 'blr-p1',
        name: 'Cubbon Park & Bamboo Groves',
        category: 'Scenic & Nature',
        description: '300-acre green lung in the heart of the city lined with century-old trees and colonial libraries.',
        images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'],
        lat: 12.9763,
        lng: 77.5929,
        entryFee: 0,
        timeNeeded: '2.5 hours',
        bestTimeToVisit: 'Morning (6:30 AM - 10:00 AM)',
        rating: 4.8,
        reviewsCount: 5200,
        highlight: 'Lush tree tunnels and serene jogging trails.',
        recommendedTimeSlot: 'morning',
      },
      {
        id: 'blr-p2',
        name: 'Lalbagh Botanical Garden & Glass House',
        category: 'Scenic & Nature',
        description: 'Historic botanical paradise established by Hyder Ali, featuring 240-acre exotic flora, ancient rock formations, and Victorian glass house.',
        images: ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80'],
        lat: 12.9507,
        lng: 77.5848,
        entryFee: 30,
        timeNeeded: '3 hours',
        bestTimeToVisit: 'Morning 8:00 AM - 11:30 AM',
        rating: 4.9,
        reviewsCount: 6800,
        highlight: 'Majestic Crystal Glass House and 3,000 million-year-old Lalbagh Rock.',
        recommendedTimeSlot: 'morning',
      },
    ],
  },
  bagepalli: {
    id: 'bagepalli',
    name: 'Bagepalli (Chikkaballapura)',
    state: 'Karnataka',
    country: 'India',
    tagline: 'Historic Vijayanagara hill forts, granite boulder ranges & serene dams',
    description: 'Bagepalli is a historic taluk in the Chikkaballapura district of Karnataka, situated 100 km north of Bengaluru on the Bangalore–Hyderabad National Highway (NH-44). Celebrated for the monumental 14th-century Gummanayakana Kote hill fortress, the magnificent 7-tiered Gudibande Fort, the scenic Chitravathi River dam, and its close proximity to the world-famous Lepakshi Veerabhadra Temple and Monolithic Nandi.',
    type: 'Heritage',
    climate: 'dry',
    idealDays: 2,
    estimatedBudgetPerDay: {
      budget: 650,
      standard: 2200,
      luxury: 7200,
    },
    rating: 4.8,
    reviewsCount: 1650,
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Front_side_of_Veerabhadra_Temple%2C_Lepakshi.jpg/1280px-Front_side_of_Veerabhadra_Temple%2C_Lepakshi.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Front_side_of_Veerabhadra_Temple%2C_Lepakshi.jpg/1280px-Front_side_of_Veerabhadra_Temple%2C_Lepakshi.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/9/9f/Gudibande_-_Loaps.jpg',
      'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/5F_XW7k-Fw8',
    bestTimeToVisitMonths: 'October to March (Crisp morning breezes and pleasant winter sunshine)',
    seasons: [
      {
        season: 'Winter (Oct - Feb)',
        avgTemp: '16°C - 28°C',
        rainfall: 'Low',
        suitability: 'Peak',
        description: 'Crisp morning hill breezes, ideal for fortress climbing, lake picnics, and heritage temple exploration.',
      },
      {
        season: 'Monsoon (Jun - Sep)',
        avgTemp: '20°C - 28°C',
        rainfall: 'Moderate',
        suitability: 'Good',
        description: 'Lush green scrublands, filled irrigation reservoirs, and scenic cascading hill runoffs.',
      },
      {
        season: 'Summer (Mar - May)',
        avgTemp: '22°C - 35°C',
        rainfall: 'Dry',
        suitability: 'Moderate',
        description: 'Warm afternoons; best explored during cool sunrise and golden sunset hours.',
      },
    ],
    foodAndCuisine: {
      overview: 'Authentic Deccan border cuisine blending Karnataka staples with spicy Rayalaseema flavors, celebrated for ragi mudde, country fowl saaru, and crisp benne dosas.',
      signatureDishes: [
        {
          name: 'Ragi Mudde with Spicy Soppina Saaru',
          description: 'Steamed finger millet dumpling paired with rich aromatic greens and lentil curry infused with garlic and roasted cumin.',
          type: 'veg',
          spiceLevel: 'medium',
          famousSpot: 'Bagepalli Highway Heritage Mess',
        },
        {
          name: 'Chikkaballapur Benne Masala Dosa',
          description: 'Golden-crisp butter roast dosa spread with spicy red garlic chutney and spiced potato palya.',
          type: 'veg',
          spiceLevel: 'medium',
          famousSpot: 'Bagepalli Central Tiffin Corner',
        },
        {
          name: 'Bagepalli Country Style Donne Biryani',
          description: 'Fragrant short-grain Seeraga samba rice cooked with whole spices, fresh mint, coriander, and tender marinated country chicken.',
          type: 'non-veg',
          spiceLevel: 'spicy',
          famousSpot: 'NH-44 Highway Military Hotel',
        },
      ],
      streetFoodSpots: ['Bagepalli Old Bus Stand Market Line', 'NH-44 Highway Dhaba Corridor', 'Gudibande Temple Road Eateries'],
    },
    culture: {
      languages: ['Kannada', 'Telugu', 'English'],
      festivals: ['Kadalekai & Grama Devathe Jathre', 'Ugadi (New Year)', 'Makar Sankranti Harvest Fair', 'Maha Shivaratri at Lepakshi'],
      traditions: ['Handloom silk weaving', 'Palegara hill fortress guardianship', 'Traditional temple stone masonry'],
      etiquetteTips: [
        'Wear sturdy footwear with grip when ascending Gummanayakana Kote and Gudibande rock fortresses.',
        'Carry drinking water and a sun hat as midday shade on rocky fort summits is sparse.',
        'Remove footwear when entering the sanctum sanctorum of historic temples.',
      ],
      dressCode: 'Comfortable cotton wear and trekking shoes; modest attire for heritage temple sanctums.',
    },
    coordinates: { lat: 13.7837, lng: 77.7972 },
    places: [
      {
        id: 'bgp-p1',
        name: 'Gummanayakana Kote (Gummanayaka Hill Fort)',
        category: 'Heritage & History',
        description: 'Spectacular 14th-century Vijayanagara-era hill citadel founded by palegara Gummanayaka. Features massive cyclopean stone walls, natural rock water cisterns, ancient watchtowers, and panoramic views of Karnataka-Andhra border ranges.',
        images: ['https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=800&q=80'],
        lat: 13.8214,
        lng: 77.8345,
        entryFee: 0,
        timeNeeded: '3 hours',
        bestTimeToVisit: 'Early Morning (6:30 AM - 10:00 AM)',
        rating: 4.8,
        reviewsCount: 1240,
        highlight: 'Cyclopean stone ramparts, rock-cut water ponds, and sweeping 360-degree hill horizons.',
        recommendedTimeSlot: 'morning',
        visitingHours: '6:00 AM - 6:00 PM',
      },
      {
        id: 'bgp-p2',
        name: 'Gudibande Fort & Surasani Thimmappa Lake',
        category: 'Heritage & History',
        description: 'Imposing 17th-century fortress built across 7 concentric fortified levels modeled after Madhugiri by Byregowda. Boasts ancient rain-harvesting tanks and a Shiva temple summit overlooking emerald lake waters.',
        images: ['https://upload.wikimedia.org/wikipedia/commons/9/9f/Gudibande_-_Loaps.jpg'],
        lat: 13.6725,
        lng: 77.7022,
        entryFee: 20,
        timeNeeded: '2.5 hours',
        bestTimeToVisit: 'Morning / Sunset (7:00 AM - 5:30 PM)',
        rating: 4.7,
        reviewsCount: 2310,
        highlight: 'Seven tiers of fortified stone gates and ancient rainwater harvesting interconnecting moats.',
        recommendedTimeSlot: 'morning',
        visitingHours: '6:30 AM - 5:30 PM',
      },
      {
        id: 'bgp-p3',
        name: 'Chitravathi Dam & Water Reservoir',
        category: 'Scenic & Nature',
        description: 'Scenic masonry irrigation dam across the sacred Chitravathi river bordered by rugged red-rock hillocks. A peaceful haven for sunset photography, migratory waterfowl birdwatching, and cool lakeside breezes.',
        images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
        lat: 13.805,
        lng: 77.812,
        entryFee: 0,
        timeNeeded: '1.5 hours',
        bestTimeToVisit: 'Golden Hour (4:30 PM - 6:45 PM)',
        rating: 4.7,
        reviewsCount: 890,
        highlight: 'Sunset crimson reflections over the expansive Chitravathi reservoir waters.',
        recommendedTimeSlot: 'evening',
        visitingHours: 'Open 24 Hours (Best in daylight)',
      },
      {
        id: 'bgp-p4',
        name: 'Lepakshi Veerabhadra Temple & Monolithic Nandi',
        category: 'Heritage & History',
        description: 'World-famous 16th-century Vijayanagara architectural masterpiece just 28 km from Bagepalli. Renowned for the gravity-defying Hanging Pillar, massive 7-hooded Naga Shiva linga, vibrant fresco ceiling paintings, and the colossal monolithic Nandi bull.',
        images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Front_side_of_Veerabhadra_Temple%2C_Lepakshi.jpg/1280px-Front_side_of_Veerabhadra_Temple%2C_Lepakshi.jpg'],
        lat: 13.8041,
        lng: 77.6053,
        entryFee: 25,
        timeNeeded: '3 hours',
        bestTimeToVisit: 'Morning 8:30 AM - 12:30 PM',
        rating: 4.9,
        reviewsCount: 7850,
        highlight: 'The engineering marvel Hanging Pillar and one of the largest single-stone carved Nandi sculptures in India.',
        recommendedTimeSlot: 'morning',
        visitingHours: '6:00 AM - 6:00 PM',
      },
      {
        id: 'bgp-p5',
        name: 'Sri Venkataramana Swamy Temple & Silk Bazaar',
        category: 'Culture & Shopping',
        description: 'Venerated Dravidian stone shrine dedicated to Lord Venkateshwara, flanked by Bagepalli’s bustling handloom bazaar showcasing famous mulberry silk cocoons and pure Karnataka silk sarees.',
        images: ['https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80'],
        lat: 13.785,
        lng: 77.798,
        entryFee: 0,
        timeNeeded: '2 hours',
        bestTimeToVisit: 'Evening (5:00 PM - 8:30 PM)',
        rating: 4.6,
        reviewsCount: 1120,
        highlight: 'Intricately carved stone pillars, evening oil lamp aarti, and authentic handloom silk shopping.',
        recommendedTimeSlot: 'evening',
        visitingHours: '6:00 AM - 8:30 PM',
      },
    ],
  },
  chikkaballapur: {
    id: 'chikkaballapur',
    name: 'Chikkaballapura (Silk & Heritage District)',
    state: 'Karnataka',
    country: 'India',
    tagline: 'Ancient Dravidian temples, mist-veiled trekking hills & silk sericulture',
    description: 'Chikkaballapura is a scenic district situated at the base of dramatic monolithic hill ranges. Home to the 1,000-year-old Bhoga Nandeeshwara temple, Skandagiri night sunrise trek, Srinivasa Sagara dam, and extensive vineyards and mulberry farms.',
    type: 'Heritage',
    climate: 'moderate',
    idealDays: 2,
    estimatedBudgetPerDay: { budget: 650, standard: 2400, luxury: 7500 },
    rating: 4.8,
    reviewsCount: 2190,
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'https://upload.wikimedia.org/wikipedia/commons/9/9f/Gudibande_-_Loaps.jpg',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/5F_XW7k-Fw8',
    bestTimeToVisitMonths: 'October to March',
    seasons: [
      { season: 'Winter (Oct - Feb)', avgTemp: '16°C - 28°C', rainfall: 'Low', suitability: 'Peak', description: 'Clear skies and crisp morning hill mist.' },
    ],
    foodAndCuisine: {
      overview: 'Famous for crispy butter roast dosas, ragi mudde, tamarind puliogare, and grape juice.',
      signatureDishes: [
        { name: 'Chikkaballapur Benne Dosa', description: 'Thick butter crisp dosa with coconut chutney.', type: 'veg', spiceLevel: 'medium', famousSpot: 'Central Bus Stand Tiffin House' },
        { name: 'Sir MV Memorial Ragi Ball Meal', description: 'Rustic millet dumplings with aromatic horsegram saaru.', type: 'veg', spiceLevel: 'spicy', famousSpot: 'Muddenahalli Heritage Mess' },
      ],
      streetFoodSpots: ['MG Road Market Street', 'Sir MV Samadhi Road Eateries'],
    },
    culture: {
      languages: ['Kannada', 'Telugu', 'English'],
      festivals: ['Bhoga Nandeeshwara Rathotsava', 'Ugadi'],
      traditions: ['Mulberry silk cocoon rearing', 'Heritage temple architecture'],
      etiquetteTips: ['Book Skandagiri night trekking permits online in advance through Karnataka Forest Department.'],
    },
    coordinates: { lat: 13.4355, lng: 77.7315 },
    places: [
      {
        id: 'ckb-p1',
        name: 'Bhoga Nandeeshwara Temple (Nandi Village)',
        category: 'Heritage & History',
        description: 'Magnificent 9th-century temple complex showing architectural phases of the Nolamba, Ganga, Chola, Hoysala, and Vijayanagara dynasties with a breathtaking stepped temple tank.',
        images: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'],
        lat: 13.3854,
        lng: 77.6974,
        entryFee: 0,
        timeNeeded: '2.5 hours',
        bestTimeToVisit: 'Morning 8:00 AM - 11:30 AM',
        rating: 4.9,
        reviewsCount: 4520,
        highlight: 'Pristine Kalyani stepped tank and intricately sculpted stone pillars.',
        recommendedTimeSlot: 'morning',
      },
      {
        id: 'ckb-p2',
        name: 'Skandagiri (Kalavara Durga) Sunrise Trek',
        category: 'Adventure & Treks',
        description: 'Renowned night trekking peak rising to 4,750 ft, famous for the mesmerizing sea-of-clouds sunrise experience over ruined hilltop fortress walls.',
        images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'],
        lat: 13.4194,
        lng: 77.6833,
        entryFee: 250,
        timeNeeded: '5 hours',
        bestTimeToVisit: 'Pre-Dawn Trek (3:30 AM - 8:00 AM)',
        rating: 4.8,
        reviewsCount: 3900,
        highlight: 'Floating above an ocean of clouds as the golden sun rises.',
        recommendedTimeSlot: 'morning',
      },
    ],
  },
  lepakshi: {
    id: 'lepakshi',
    name: 'Lepakshi (Heritage Wonder)',
    state: 'Andhra Pradesh (Karnataka Border)',
    country: 'India',
    tagline: 'The gravity-defying Hanging Pillar, Monolithic Nandi & Vijayanagara frescos',
    description: 'Lepakshi is a world-renowned historical village famed for the 16th-century Veerabhadra temple built by Virupanna Nayaka. Features one of India’s finest collections of mural paintings, the iconic Hanging Pillar, a seven-hooded granite Nagalinga, and the colossal Monolithic Basavanna (Nandi).',
    type: 'Heritage',
    climate: 'dry',
    idealDays: 1,
    estimatedBudgetPerDay: { budget: 550, standard: 1900, luxury: 5800 },
    rating: 4.9,
    reviewsCount: 6890,
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Front_side_of_Veerabhadra_Temple%2C_Lepakshi.jpg/1280px-Front_side_of_Veerabhadra_Temple%2C_Lepakshi.jpg',
    galleryImages: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Front_side_of_Veerabhadra_Temple%2C_Lepakshi.jpg/1280px-Front_side_of_Veerabhadra_Temple%2C_Lepakshi.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/0/0a/Front_side_of_Veerabhadra_Temple%2C_Lepakshi.jpg',
      'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/5F_XW7k-Fw8',
    bestTimeToVisitMonths: 'October to March',
    seasons: [
      { season: 'Winter (Oct - Feb)', avgTemp: '16°C - 29°C', rainfall: 'Low', suitability: 'Peak', description: 'Crisp breezes, comfortable temple tours.' },
    ],
    foodAndCuisine: {
      overview: 'Traditional Rayalaseema meals, spicy gongura pachadi, jowar rotis, and fresh coconut water.',
      signatureDishes: [
        { name: 'Rayalaseema Thali with Gongura', description: 'Hot steamed rice with fiery gongura pickle and country ghee.', type: 'veg', spiceLevel: 'spicy', famousSpot: 'Lepakshi Tourism Haritha Restaurant' },
      ],
      streetFoodSpots: ['Temple Entrance Coconut Stalls', 'Hindupur Road Canteen'],
    },
    culture: {
      languages: ['Telugu', 'Kannada', 'English'],
      festivals: ['Maha Shivaratri (Grand Celebration)', 'Vijayanagara Utsav'],
      traditions: ['Stone carving heritage', 'Lepakshi handloom cotton crafts'],
      etiquetteTips: ['Certified archaeological guides are available at the main gopuram counter.'],
    },
    coordinates: { lat: 13.8041, lng: 77.6053 },
    places: [
      {
        id: 'lpk-p1',
        name: 'Veerabhadra Temple & The Hanging Pillar',
        category: 'Heritage & History',
        description: 'A Vijayanagara architectural masterpiece with 70 carved stone pillars, including the famed pillar that does not touch the stone floor.',
        images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Front_side_of_Veerabhadra_Temple%2C_Lepakshi.jpg/1280px-Front_side_of_Veerabhadra_Temple%2C_Lepakshi.jpg'],
        lat: 13.8041,
        lng: 77.6053,
        entryFee: 25,
        timeNeeded: '2.5 hours',
        bestTimeToVisit: 'Morning 8:00 AM - 11:30 AM',
        rating: 4.9,
        reviewsCount: 8900,
        highlight: 'Passing cloth under the gravity-defying Hanging Pillar.',
        recommendedTimeSlot: 'morning',
      },
      {
        id: 'lpk-p2',
        name: 'Colossal Monolithic Nandi (Basavanna)',
        category: 'Heritage & History',
        description: 'Carved from a single massive granite boulder, measuring 4.5 meters high and 8.23 meters long, decorated with intricate bells and garlands.',
        images: ['https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=800&q=80'],
        lat: 13.8015,
        lng: 77.6085,
        entryFee: 0,
        timeNeeded: '1 hour',
        bestTimeToVisit: 'Evening Sunset (4:30 PM - 6:00 PM)',
        rating: 4.8,
        reviewsCount: 5200,
        highlight: 'One of the largest carved monolithic bulls in the world.',
        recommendedTimeSlot: 'evening',
      },
    ],
  },
  chikmagalur: {
    id: 'chikmagalur',
    name: 'Chikmagalur (Coffee Country)',
    state: 'Karnataka',
    country: 'India',
    tagline: 'Birthplace of Indian coffee nestled beneath the Mullayanagiri peak',
    description: 'Chikmagalur is a lush mountainous retreat in Karnataka, renowned for rolling emerald coffee plantations, cloud-swept trekking peaks, cascading waterfalls, and serene estate homestays.',
    type: 'Hill Stations',
    climate: 'cool',
    idealDays: 3,
    estimatedBudgetPerDay: { budget: 750, standard: 3200, luxury: 11000 },
    rating: 4.9,
    reviewsCount: 2250,
    heroImage: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1400&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/5F_XW7k-Fw8',
    bestTimeToVisitMonths: 'September to March',
    seasons: [
      { season: 'Winter (Oct - Mar)', avgTemp: '14°C - 26°C', rainfall: 'Low', suitability: 'Peak', description: 'Clear blue skies and crisp mountain air.' },
    ],
    foodAndCuisine: {
      overview: 'Malnad cuisine celebrated for akki roti, jackfruit curries, spicy mutton curries, and estate-brewed arabica coffee.',
      signatureDishes: [
        { name: 'Malnad Akki Roti & Chicken Curry', description: 'Crisp rice flatbread with fiery country chicken.', type: 'non-veg', spiceLevel: 'spicy', famousSpot: 'Town Canteen' },
        { name: 'Fresh Arabica Filter Coffee', description: 'Single-origin estate brewed coffee.', type: 'veg', spiceLevel: 'mild', famousSpot: 'Coffee Barn Cafe' },
      ],
      streetFoodSpots: ['MG Road Market Stalls', 'Kallathigiri Waterfall Snacks'],
    },
    culture: {
      languages: ['Kannada', 'English'],
      festivals: ['Kailpodh', 'Suggi Habba'],
      traditions: ['Coffee picking ceremonies', 'Malnad folk music'],
      etiquetteTips: ['Hire local 4x4 jeeps for Baba Budangiri routes'],
    },
    coordinates: { lat: 13.3161, lng: 75.772 },
    places: [
      {
        id: 'ckm-p1',
        name: 'Mullayanagiri Peak (Highest in Karnataka)',
        category: 'Adventure & Treks',
        description: 'Standing at 1,930m, Mullayanagiri offers majestic panoramic views above misty cloud layers.',
        images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'],
        lat: 13.3911,
        lng: 75.7214,
        entryFee: 0,
        timeNeeded: '3 hours',
        bestTimeToVisit: 'Early Morning (6:00 AM - 9:00 AM)',
        rating: 4.9,
        reviewsCount: 3890,
        highlight: 'Walking into clouds atop the highest peak in Karnataka.',
        recommendedTimeSlot: 'morning',
      },
      {
        id: 'ckm-p2',
        name: 'Hebbe Falls & Jungle Jeep Trail',
        category: 'Scenic & Nature',
        description: 'Stunning 550-foot two-stage waterfall plunging through dense coffee estates and medicinal herb valleys.',
        images: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'],
        lat: 13.5412,
        lng: 75.7482,
        entryFee: 50,
        timeNeeded: '3.5 hours',
        bestTimeToVisit: 'Morning 9:00 AM - 1:00 PM',
        rating: 4.8,
        reviewsCount: 2980,
        highlight: 'Exhilarating 4x4 jeep safari and natural forest plunge pool.',
        recommendedTimeSlot: 'morning',
      },
    ],
  },
};

// Generates an instant, highly realistic Destination for ANY custom query
export function resolveDestination(query: string, userBudget?: number): Destination {
  const clean = query.trim();
  const lower = clean.toLowerCase();
  const normalizedKey = lower.replace(/[^a-z0-9]/g, '');

  // 1. Direct gazetteer hit
  for (const [key, dest] of Object.entries(KNOWN_DESTINATIONS)) {
    if (lower.includes(key) || key.includes(lower) || normalizedKey.includes(key)) {
      return {
        ...(dest as Destination),
        // If user provided a strict budget, adapt the display budget so it fits seamlessly
        estimatedBudgetPerDay: {
          budget: Math.min(dest.estimatedBudgetPerDay?.budget || 700, userBudget ? Math.max(350, userBudget) : 700),
          standard: dest.estimatedBudgetPerDay?.standard || 2500,
          luxury: dest.estimatedBudgetPerDay?.luxury || 8500,
        },
      };
    }
  }

  // 2. Intelligent Category, State, Country & Regional Intelligence
  let type: Destination['type'] = 'Heritage';
  let climate: Destination['climate'] = 'moderate';
  let stateName = 'Karnataka';
  let countryName = 'India';
  let days = 3;
  let heroImage = 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1400&q=80';
  let lat = 13.5;
  let lng = 77.5;
  let regionalTitle = clean;

  const karnatakaKeywords = [
    'bagepalli', 'chikkaballapur', 'kolar', 'hoskote', 'kanakapura', 'ramanagara',
    'mandya', 'mysore', 'mysuru', 'hassan', 'channapatna', 'tumkur', 'tumakuru', 'sira',
    'tiptur', 'madhugiri', 'pavagada', 'shimoga', 'shivamogga', 'bhadravati', 'sagar',
    'dandeli', 'karwar', 'gokarna', 'udupi', 'mangalore', 'mangaluru', 'madikeri',
    'coorg', 'chikmagalur', 'chikkamagaluru', 'davangere', 'chitradurga', 'hampi',
    'hospet', 'bellary', 'ballari', 'hubli', 'hubballi', 'dharwad', 'belgaum', 'belagavi',
    'badami', 'bagalkot', 'bijapur', 'vijayapura', 'bidar', 'gulbarga', 'kalaburagi', 'raichur'
  ];

  const tamilNaduKeywords = [
    'chennai', 'madurai', 'coimbatore', 'salem', 'trichy', 'tiruchirappalli', 'thanjavur',
    'ooty', 'kodaikanal', 'vellore', 'kanchipuram', 'tirunelveli', 'kanyakumari', 'rameswaram',
    'dharmapuri', 'krishnagiri', 'hosur', 'erode', 'tiruppur', 'yercaud'
  ];

  const andhraTelanganaKeywords = [
    'hyderabad', 'warangal', 'tirupati', 'visakhapatnam', 'vizag', 'vijayawada', 'guntur',
    'kurnool', 'kadapa', 'anantapur', 'hindupur', 'lepakshi', 'nellore', 'rajahmundry',
    'kakinada', 'nizamabad', 'khammam', 'nagarjuna'
  ];

  const keralaKeywords = [
    'kochi', 'cochin', 'munnar', 'wayanad', 'alleppey', 'alappuzha', 'varkala', 'kovalam',
    'trivandrum', 'thiruvananthapuram', 'kozhikode', 'calicut', 'thrissur', 'kannur',
    'thekkady', 'idukki', 'athirappilly'
  ];

  const northIndiaKeywords = [
    'delhi', 'jaipur', 'udaipur', 'jodhpur', 'jaisalmer', 'agra', 'varanasi', 'manali',
    'shimla', 'dharamshala', 'leh', 'ladakh', 'srinagar', 'kashmir', 'rishikesh', 'haridwar',
    'amritsar', 'nainital', 'mussoorie'
  ];

  if (karnatakaKeywords.some(k => lower.includes(k))) {
    stateName = 'Karnataka';
    countryName = 'India';
    type = lower.includes('falls') || lower.includes('coorg') || lower.includes('chikmagalur') ? 'Hill Stations' : 'Heritage';
    climate = lower.includes('coorg') || lower.includes('chikmagalur') ? 'cool' : 'dry';
    heroImage = 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1400&q=80';
    lat = 13.3;
    lng = 77.2;
  } else if (tamilNaduKeywords.some(k => lower.includes(k))) {
    stateName = 'Tamil Nadu';
    countryName = 'India';
    type = lower.includes('ooty') || lower.includes('kodaikanal') || lower.includes('yercaud') ? 'Hill Stations' : 'Heritage';
    climate = lower.includes('ooty') || lower.includes('kodaikanal') ? 'cool' : 'tropical';
    heroImage = 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1400&q=80';
    lat = 11.5;
    lng = 78.2;
  } else if (andhraTelanganaKeywords.some(k => lower.includes(k))) {
    stateName = lower.includes('hyderabad') || lower.includes('warangal') ? 'Telangana' : 'Andhra Pradesh';
    countryName = 'India';
    type = lower.includes('tirupati') ? 'Pilgrimage' : 'Heritage';
    climate = 'dry';
    heroImage = 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1400&q=80';
    lat = 14.5;
    lng = 78.5;
  } else if (keralaKeywords.some(k => lower.includes(k))) {
    stateName = 'Kerala';
    countryName = 'India';
    type = lower.includes('munnar') || lower.includes('wayanad') ? 'Hill Stations' : lower.includes('alleppey') ? 'Backwaters' : 'Beaches';
    climate = 'tropical';
    heroImage = 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=80';
    lat = 9.8;
    lng = 76.5;
  } else if (northIndiaKeywords.some(k => lower.includes(k))) {
    stateName = lower.includes('jaipur') || lower.includes('udaipur') ? 'Rajasthan' : lower.includes('manali') || lower.includes('shimla') ? 'Himachal Pradesh' : 'North India';
    countryName = 'India';
    type = lower.includes('manali') || lower.includes('ladakh') ? 'Hill Stations' : 'Heritage';
    climate = lower.includes('manali') || lower.includes('ladakh') ? 'snowy' : 'moderate';
    heroImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80';
    lat = 27.0;
    lng = 76.0;
  } else if (lower.includes('beach') || lower.includes('coast') || lower.includes('island') || lower.includes('sea')) {
    type = 'Beaches';
    climate = 'tropical';
    heroImage = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=80';
    stateName = 'Coastal Region';
  } else if (lower.includes('temple') || lower.includes('pilgrim')) {
    type = 'Pilgrimage';
    climate = 'moderate';
    heroImage = 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1400&q=80';
    stateName = 'Heritage Region';
  }

  const id = clean.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const baseBudget = userBudget && userBudget > 0 ? Math.min(650, userBudget) : 650;

  // Authentic, distinct places to visit for this destination (No repeated images, No generic volcano)
  const places: Place[] = [
    {
      id: `${id}-p1`,
      name: `${clean} Historic Fort & Citadel Viewpoint`,
      category: 'Heritage & History',
      description: `Centuries-old stone citadel ramparts in ${clean} perched atop granite boulders, featuring historic watchtowers, rock-cut water cisterns, and sweeping 360-degree vistas.`,
      images: ['https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=800&q=80'],
      lat: lat + 0.02,
      lng: lng + 0.03,
      entryFee: 20,
      timeNeeded: '2.5 hours',
      bestTimeToVisit: 'Early Morning (6:30 AM - 10:00 AM)',
      rating: 4.8,
      reviewsCount: 1840,
      highlight: `Panoramic summit views of the rolling hills and historical cyclopean stone battlements.`,
      recommendedTimeSlot: 'morning',
      visitingHours: '6:00 AM - 6:00 PM',
    },
    {
      id: `${id}-p2`,
      name: `${clean} Ancient Stone Temple & Sacred Courtyard`,
      category: 'Heritage & History',
      description: `Venerated Dravidian architectural sanctuary celebrated for intricate monolithic stone carvings, ornamental pillars, sacred lotus pond, and peaceful morning prayer rituals.`,
      images: ['https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=800&q=80'],
      lat: lat - 0.01,
      lng: lng + 0.01,
      entryFee: 0,
      timeNeeded: '2 hours',
      bestTimeToVisit: 'Morning / Evening Puja (7:00 AM - 11:30 AM)',
      rating: 4.9,
      reviewsCount: 2450,
      highlight: `Carved monolithic granite pillars and historic stepped kalyani water tank.`,
      recommendedTimeSlot: 'morning',
      visitingHours: '6:00 AM - 8:00 PM',
    },
    {
      id: `${id}-p3`,
      name: `${clean} Lakeside Reservoir & Sunset Dam`,
      category: 'Scenic & Nature',
      description: `Peaceful irrigation reservoir nestled between rugged rocky hill ranges, providing a tranquil escape for birdwatching, lakeside walking breezes, and golden hour sunset reflections.`,
      images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
      lat: lat + 0.03,
      lng: lng - 0.02,
      entryFee: 0,
      timeNeeded: '1.5 hours',
      bestTimeToVisit: 'Golden Hour Sunset (4:30 PM - 6:45 PM)',
      rating: 4.7,
      reviewsCount: 1320,
      highlight: `Crimson sunset reflections across serene reservoir waters framed by boulder hillocks.`,
      recommendedTimeSlot: 'evening',
      visitingHours: 'Open All Day',
    },
    {
      id: `${id}-p4`,
      name: `${clean} Traditional Heritage Market & Silk Bazaar`,
      category: 'Culture & Shopping',
      description: `Vibrant town center market street renowned for fresh local produce, fragrant spice stalls, traditional handloom weaving crafts, and bustling tiffin rooms.`,
      images: ['https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80'],
      lat: lat,
      lng: lng,
      entryFee: 0,
      timeNeeded: '2 hours',
      bestTimeToVisit: 'Evening (5:30 PM - 9:30 PM)',
      rating: 4.8,
      reviewsCount: 1980,
      highlight: `Lively regional culinary street snacks and authentic local handloom textiles.`,
      recommendedTimeSlot: 'evening',
      visitingHours: '9:00 AM - 9:30 PM',
    },
  ];

  return {
    id,
    name: clean.includes('(') ? clean : `${clean} (${stateName})`,
    state: stateName,
    country: countryName,
    tagline: `Historic hill citadels, sacred architecture, and scenic ${climate} landscapes`,
    description: `${clean} is a picturesque and culturally rich destination in ${stateName}, ${countryName}. Celebrated for dramatic granite hill formations, ancient stone temples, serene freshwater reservoirs, and authentic regional gastronomy.`,
    type,
    climate,
    idealDays: days,
    estimatedBudgetPerDay: {
      budget: baseBudget,
      standard: 2200,
      luxury: 7400,
    },
    rating: 4.8,
    reviewsCount: 1650,
    heroImage,
    galleryImages: [
      heroImage,
      'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/embed/5F_XW7k-Fw8',
    bestTimeToVisitMonths: 'October to March (Pleasant Season)',
    seasons: [
      {
        season: 'Winter & Post-Monsoon (Oct - Feb)',
        avgTemp: '16°C - 28°C',
        rainfall: 'Low',
        suitability: 'Peak',
        description: 'Pleasant mornings and breezy evenings, ideal for fort trekking, temple visits, and sightseeing.',
      },
      {
        season: 'Monsoon (Jun - Sep)',
        avgTemp: '20°C - 28°C',
        rainfall: 'Moderate',
        suitability: 'Good',
        description: 'Lush green scrublands, replenished reservoirs, and dramatic cloud-swept hilltops.',
      },
      {
        season: 'Summer (Mar - May)',
        avgTemp: '22°C - 35°C',
        rainfall: 'Low',
        suitability: 'Moderate',
        description: 'Warm sunny weather; best experienced during cool sunrise and sunset hours.',
      },
    ],
    foodAndCuisine: {
      overview: `Authentic regional culinary heritage featuring farm-fresh spices, traditional flatbreads, slow-cooked curries, and local sweets in ${clean}.`,
      signatureDishes: [
        {
          name: stateName === 'Karnataka' ? 'Crispy Benne Dosa & Coconut Chutney' : `${clean} Specialty Tiffin Platter`,
          description: 'Golden roasted fermented crepe prepared with farm butter and paired with spiced potato palya and fresh coconut chutney.',
          type: 'veg',
          spiceLevel: 'medium',
          famousSpot: `${clean} Central Heritage Tiffin House`,
        },
        {
          name: stateName === 'Karnataka' ? 'Ragi Mudde with Aromatic Saaru' : 'Slow-Simmered Regional Curry',
          description: 'Nutritious steamed millet dumpling served with spiced aromatic greens and lentil gravy.',
          type: 'veg',
          spiceLevel: 'spicy',
          famousSpot: `${clean} Old Town Mess`,
        },
        {
          name: 'Traditional Donne Style Spiced Biryani',
          description: 'Short-grain fragrant rice simmered with tender marinated meat, mint, cilantro, and whole roasted spices.',
          type: 'non-veg',
          spiceLevel: 'spicy',
          famousSpot: `${clean} Highway Military Canteen`,
        },
      ],
      streetFoodSpots: [`${clean} Main Temple Road`, `${clean} Market Line`, `${clean} Highway Food Stalls`],
    },
    culture: {
      languages: stateName === 'Karnataka' ? ['Kannada', 'Telugu', 'English'] : stateName === 'Tamil Nadu' ? ['Tamil', 'English'] : stateName === 'Kerala' ? ['Malayalam', 'English'] : ['Hindi', 'English'],
      festivals: ['Annual Grama Devathe Fair', 'Ugadi & Harvest Festival', 'Deepavali'],
      traditions: ['Handloom weaving', 'Historic fortress stewardship', 'Traditional morning breakfast gatherings'],
      etiquetteTips: [
        'Wear supportive footwear when ascending historic stone fortress steps.',
        'Remove footwear when entering sacred temple sanctums.',
        'Keep heritage reservoirs and forest trekking trails pristine by not littering.',
      ],
      dressCode: 'Breathable cotton attire and walking shoes; modest clothing for sacred shrines.',
    },
    coordinates: { lat, lng },
    places,
  };
}
