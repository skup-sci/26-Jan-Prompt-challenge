/**
 * Sample Mandi Price Data for Demo
 * 
 * This dataset contains mock commodity prices for demonstration purposes.
 * Prices are representative of typical Indian mandi rates.
 */

export interface CommodityPrice {
  id: string;
  name: string;              // English name
  nameHindi: string;         // Hindi name
  nameTamil?: string;        // Tamil name (optional for MVP)
  priceMin: number;          // Minimum price in range
  priceMax: number;          // Maximum price in range
  unit: 'kg' | 'quintal';    // Unit of measurement
  market: string;            // Market name
  timestamp: Date;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;     // Percentage change
  icon: string;              // Emoji icon
  category: 'vegetable' | 'grain' | 'pulse' | 'cash-crop';
  aliases: string[];         // Alternative names for search
}

export const SAMPLE_PRICES: CommodityPrice[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    nameHindi: 'टमाटर',
    nameTamil: 'தக்காளி',
    priceMin: 18,
    priceMax: 22,
    unit: 'kg',
    market: 'Delhi Azadpur Mandi',
    timestamp: new Date(),
    trend: 'up',
    changePercent: 5.0,
    icon: '🍅',
    category: 'vegetable',
    aliases: ['tomato', 'tamatar', 'टमाटर', 'tomatoes']
  },
  {
    id: 'onion',
    name: 'Onion',
    nameHindi: 'प्याज',
    nameTamil: 'வெங்காயம்',
    priceMin: 14,
    priceMax: 18,
    unit: 'kg',
    market: 'Mumbai Vashi Mandi',
    timestamp: new Date(),
    trend: 'stable',
    changePercent: 0,
    icon: '🧅',
    category: 'vegetable',
    aliases: ['onion', 'pyaz', 'प्याज', 'onions', 'kanda']
  },
  {
    id: 'wheat',
    name: 'Wheat',
    nameHindi: 'गेहूं',
    nameTamil: 'கோதுமை',
    priceMin: 2100,
    priceMax: 2250,
    unit: 'quintal',
    market: 'Punjab Khanna Mandi',
    timestamp: new Date(),
    trend: 'up',
    changePercent: 3.5,
    icon: '🌾',
    category: 'grain',
    aliases: ['wheat', 'gehun', 'गेहूं', 'gehu']
  },
  {
    id: 'potato',
    name: 'Potato',
    nameHindi: 'आलू',
    nameTamil: 'உருளைக்கிழங்கு',
    priceMin: 12,
    priceMax: 16,
    unit: 'kg',
    market: 'Uttar Pradesh Agra Mandi',
    timestamp: new Date(),
    trend: 'down',
    changePercent: -2.0,
    icon: '🥔',
    category: 'vegetable',
    aliases: ['potato', 'aloo', 'आलू', 'potatoes', 'alu']
  },
  {
    id: 'rice',
    name: 'Rice',
    nameHindi: 'चावल',
    nameTamil: 'அரிசி',
    priceMin: 2800,
    priceMax: 3200,
    unit: 'quintal',
    market: 'Haryana Karnal Mandi',
    timestamp: new Date(),
    trend: 'stable',
    changePercent: 0.5,
    icon: '🍚',
    category: 'grain',
    aliases: ['rice', 'chawal', 'चावल', 'dhan']
  },
  {
    id: 'cotton',
    name: 'Cotton',
    nameHindi: 'कपास',
    nameTamil: 'பருத்தி',
    priceMin: 5800,
    priceMax: 6200,
    unit: 'quintal',
    market: 'Gujarat Rajkot Mandi',
    timestamp: new Date(),
    trend: 'up',
    changePercent: 4.0,
    icon: '🌱',
    category: 'cash-crop',
    aliases: ['cotton', 'kapas', 'कपास', 'rui']
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    nameHindi: 'गन्ना',
    nameTamil: 'கரும்பு',
    priceMin: 280,
    priceMax: 320,
    unit: 'quintal',
    market: 'Maharashtra Kolhapur Mandi',
    timestamp: new Date(),
    trend: 'stable',
    changePercent: 1.0,
    icon: '🎋',
    category: 'cash-crop',
    aliases: ['sugarcane', 'ganna', 'गन्ना', 'ikku']
  },
  {
    id: 'pulses',
    name: 'Pulses (Tur Dal)',
    nameHindi: 'दाल (तूर)',
    nameTamil: 'பருப்பு',
    priceMin: 8500,
    priceMax: 9200,
    unit: 'quintal',
    market: 'Madhya Pradesh Indore Mandi',
    timestamp: new Date(),
    trend: 'down',
    changePercent: -1.5,
    icon: '🫘',
    category: 'pulse',
    aliases: ['pulses', 'dal', 'दाल', 'tur', 'arhar', 'toor']
  },
  {
    id: 'chilli',
    name: 'Green Chilli',
    nameHindi: 'हरी मिर्च',
    nameTamil: 'பச்சை மிளகாய்',
    priceMin: 25,
    priceMax: 35,
    unit: 'kg',
    market: 'Andhra Pradesh Guntur Mandi',
    timestamp: new Date(),
    trend: 'up',
    changePercent: 8.0,
    icon: '🌶️',
    category: 'vegetable',
    aliases: ['chilli', 'mirch', 'मिर्च', 'chili', 'pepper', 'hari mirch']
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    nameHindi: 'पत्तागोभी',
    nameTamil: 'முட்டைகோஸ்',
    priceMin: 8,
    priceMax: 12,
    unit: 'kg',
    market: 'Karnataka Bangalore Mandi',
    timestamp: new Date(),
    trend: 'stable',
    changePercent: 0,
    icon: '🥬',
    category: 'vegetable',
    aliases: ['cabbage', 'patta gobhi', 'पत्तागोभी', 'bandh gobi']
  }
];

/**
 * Get all available commodities
 */
export function getAllCommodities(): CommodityPrice[] {
  return SAMPLE_PRICES;
}

/**
 * Get commodity by ID
 */
export function getCommodityById(id: string): CommodityPrice | null {
  return SAMPLE_PRICES.find(c => c.id === id) || null;
}

/**
 * Get commodities by category
 */
export function getCommoditiesByCategory(category: CommodityPrice['category']): CommodityPrice[] {
  return SAMPLE_PRICES.filter(c => c.category === category);
}
