/**
 * Expanded Mandi Price Data - All India Coverage
 * 35+ commodities across 10+ states
 */

export interface CommodityPrice {
  id: string;
  name: string;
  nameHindi: string;
  priceMin: number;
  priceMax: number;
  unit: string;
  market: string;
  state: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  category: 'vegetable' | 'grain' | 'pulse' | 'cash-crop' | 'fruit' | 'spice';
}

export const ALL_PRICES: CommodityPrice[] = [
  // Delhi
  { id: 'del-1', name: 'Tomato', nameHindi: 'टमाटर', priceMin: 18, priceMax: 22, unit: 'kg', market: 'Azadpur Mandi', state: 'Delhi', trend: 'up', icon: '🍅', category: 'vegetable' },
  { id: 'del-2', name: 'Onion', nameHindi: 'प्याज', priceMin: 28, priceMax: 32, unit: 'kg', market: 'Azadpur Mandi', state: 'Delhi', trend: 'stable', icon: '🧅', category: 'vegetable' },
  { id: 'del-3', name: 'Potato', nameHindi: 'आलू', priceMin: 14, priceMax: 17, unit: 'kg', market: 'Azadpur Mandi', state: 'Delhi', trend: 'down', icon: '🥔', category: 'vegetable' },
  
  // Maharashtra
  { id: 'mh-1', name: 'Onion', nameHindi: 'प्याज', priceMin: 25, priceMax: 30, unit: 'kg', market: 'Vashi Mandi', state: 'Maharashtra', trend: 'stable', icon: '🧅', category: 'vegetable' },
  { id: 'mh-2', name: 'Sugarcane', nameHindi: 'गन्ना', priceMin: 280, priceMax: 310, unit: 'quintal', market: 'Kolhapur Mandi', state: 'Maharashtra', trend: 'stable', icon: '🎋', category: 'cash-crop' },
  { id: 'mh-3', name: 'Cotton', nameHindi: 'कपास', priceMin: 5800, priceMax: 6200, unit: 'quintal', market: 'Nagpur Mandi', state: 'Maharashtra', trend: 'up', icon: '🌱', category: 'cash-crop' },
  
  // Punjab
  { id: 'pb-1', name: 'Wheat', nameHindi: 'गेहूं', priceMin: 2000, priceMax: 2200, unit: 'quintal', market: 'Khanna Mandi', state: 'Punjab', trend: 'up', icon: '🌾', category: 'grain' },
  { id: 'pb-2', name: 'Rice', nameHindi: 'चावल', priceMin: 3200, priceMax: 3600, unit: 'quintal', market: 'Amritsar Mandi', state: 'Punjab', trend: 'stable', icon: '🍚', category: 'grain' },
  { id: 'pb-3', name: 'Maize', nameHindi: 'मक्का', priceMin: 1800, priceMax: 2000, unit: 'quintal', market: 'Ludhiana Mandi', state: 'Punjab', trend: 'up', icon: '🌽', category: 'grain' },
  
  // Haryana
  { id: 'hr-1', name: 'Rice', nameHindi: 'चावल', priceMin: 3000, priceMax: 3500, unit: 'quintal', market: 'Karnal Mandi', state: 'Haryana', trend: 'stable', icon: '🍚', category: 'grain' },
  { id: 'hr-2', name: 'Wheat', nameHindi: 'गेहूं', priceMin: 2050, priceMax: 2250, unit: 'quintal', market: 'Panipat Mandi', state: 'Haryana', trend: 'up', icon: '🌾', category: 'grain' },
  
  // Uttar Pradesh
  { id: 'up-1', name: 'Potato', nameHindi: 'आलू', priceMin: 12, priceMax: 15, unit: 'kg', market: 'Agra Mandi', state: 'Uttar Pradesh', trend: 'down', icon: '🥔', category: 'vegetable' },
  { id: 'up-2', name: 'Sugarcane', nameHindi: 'गन्ना', priceMin: 300, priceMax: 330, unit: 'quintal', market: 'Meerut Mandi', state: 'Uttar Pradesh', trend: 'stable', icon: '🎋', category: 'cash-crop' },
  { id: 'up-3', name: 'Mango', nameHindi: 'आम', priceMin: 40, priceMax: 60, unit: 'kg', market: 'Lucknow Mandi', state: 'Uttar Pradesh', trend: 'up', icon: '🥭', category: 'fruit' },
  
  // Gujarat
  { id: 'gj-1', name: 'Cotton', nameHindi: 'कपास', priceMin: 5500, priceMax: 6000, unit: 'quintal', market: 'Rajkot Mandi', state: 'Gujarat', trend: 'up', icon: '🌱', category: 'cash-crop' },
  { id: 'gj-2', name: 'Groundnut', nameHindi: 'मूंगफली', priceMin: 5000, priceMax: 5500, unit: 'quintal', market: 'Junagadh Mandi', state: 'Gujarat', trend: 'stable', icon: '🥜', category: 'cash-crop' },
  { id: 'gj-3', name: 'Cumin', nameHindi: 'जीरा', priceMin: 25000, priceMax: 28000, unit: 'quintal', market: 'Unjha Mandi', state: 'Gujarat', trend: 'up', icon: '🌿', category: 'spice' },
  
  // Madhya Pradesh
  { id: 'mp-1', name: 'Pulses', nameHindi: 'दाल', priceMin: 80, priceMax: 95, unit: 'kg', market: 'Indore Mandi', state: 'Madhya Pradesh', trend: 'up', icon: '🫘', category: 'pulse' },
  { id: 'mp-2', name: 'Soybean', nameHindi: 'सोयाबीन', priceMin: 4000, priceMax: 4500, unit: 'quintal', market: 'Bhopal Mandi', state: 'Madhya Pradesh', trend: 'stable', icon: '🫛', category: 'pulse' },
  { id: 'mp-3', name: 'Wheat', nameHindi: 'गेहूं', priceMin: 1950, priceMax: 2150, unit: 'quintal', market: 'Gwalior Mandi', state: 'Madhya Pradesh', trend: 'stable', icon: '🌾', category: 'grain' },
  
  // Andhra Pradesh
  { id: 'ap-1', name: 'Chilli', nameHindi: 'मिर्च', priceMin: 120, priceMax: 150, unit: 'kg', market: 'Guntur Mandi', state: 'Andhra Pradesh', trend: 'up', icon: '🌶️', category: 'spice' },
  { id: 'ap-2', name: 'Rice', nameHindi: 'चावल', priceMin: 2800, priceMax: 3200, unit: 'quintal', market: 'Vijayawada Mandi', state: 'Andhra Pradesh', trend: 'stable', icon: '🍚', category: 'grain' },
  { id: 'ap-3', name: 'Turmeric', nameHindi: 'हल्दी', priceMin: 7000, priceMax: 8000, unit: 'quintal', market: 'Nizamabad Mandi', state: 'Andhra Pradesh', trend: 'up', icon: '🟡', category: 'spice' },
  
  // Karnataka
  { id: 'ka-1', name: 'Cabbage', nameHindi: 'पत्तागोभी', priceMin: 8, priceMax: 12, unit: 'kg', market: 'Bangalore Mandi', state: 'Karnataka', trend: 'down', icon: '🥬', category: 'vegetable' },
  { id: 'ka-2', name: 'Coffee', nameHindi: 'कॉफी', priceMin: 18000, priceMax: 22000, unit: 'quintal', market: 'Chikmagalur Mandi', state: 'Karnataka', trend: 'up', icon: '☕', category: 'cash-crop' },
  { id: 'ka-3', name: 'Ragi', nameHindi: 'रागी', priceMin: 3500, priceMax: 4000, unit: 'quintal', market: 'Mysore Mandi', state: 'Karnataka', trend: 'stable', icon: '🌾', category: 'grain' },
  
  // Tamil Nadu
  { id: 'tn-1', name: 'Rice', nameHindi: 'चावल', priceMin: 2900, priceMax: 3300, unit: 'quintal', market: 'Thanjavur Mandi', state: 'Tamil Nadu', trend: 'stable', icon: '🍚', category: 'grain' },
  { id: 'tn-2', name: 'Banana', nameHindi: 'केला', priceMin: 20, priceMax: 30, unit: 'dozen', market: 'Trichy Mandi', state: 'Tamil Nadu', trend: 'stable', icon: '🍌', category: 'fruit' },
  { id: 'tn-3', name: 'Coconut', nameHindi: 'नारियल', priceMin: 25, priceMax: 35, unit: 'piece', market: 'Coimbatore Mandi', state: 'Tamil Nadu', trend: 'up', icon: '🥥', category: 'fruit' },
  
  // West Bengal
  { id: 'wb-1', name: 'Rice', nameHindi: 'चावल', priceMin: 2700, priceMax: 3100, unit: 'quintal', market: 'Kolkata Mandi', state: 'West Bengal', trend: 'stable', icon: '🍚', category: 'grain' },
  { id: 'wb-2', name: 'Jute', nameHindi: 'जूट', priceMin: 4500, priceMax: 5000, unit: 'quintal', market: 'Barrackpore Mandi', state: 'West Bengal', trend: 'up', icon: '🌿', category: 'cash-crop' },
  { id: 'wb-3', name: 'Potato', nameHindi: 'आलू', priceMin: 10, priceMax: 13, unit: 'kg', market: 'Hooghly Mandi', state: 'West Bengal', trend: 'down', icon: '🥔', category: 'vegetable' },
  
  // Rajasthan
  { id: 'rj-1', name: 'Mustard', nameHindi: 'सरसों', priceMin: 5500, priceMax: 6000, unit: 'quintal', market: 'Jaipur Mandi', state: 'Rajasthan', trend: 'up', icon: '🌼', category: 'cash-crop' },
  { id: 'rj-2', name: 'Bajra', nameHindi: 'बाजरा', priceMin: 2000, priceMax: 2300, unit: 'quintal', market: 'Jodhpur Mandi', state: 'Rajasthan', trend: 'stable', icon: '🌾', category: 'grain' },
  { id: 'rj-3', name: 'Coriander', nameHindi: 'धनिया', priceMin: 8000, priceMax: 9000, unit: 'quintal', market: 'Kota Mandi', state: 'Rajasthan', trend: 'up', icon: '🌿', category: 'spice' },
];

export const STATES = [
  'Delhi', 'Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh',
  'Gujarat', 'Madhya Pradesh', 'Andhra Pradesh', 'Karnataka',
  'Tamil Nadu', 'West Bengal', 'Rajasthan'
];

export function getPricesByState(state: string): CommodityPrice[] {
  return ALL_PRICES.filter(p => p.state === state);
}

export function getAllStates(): string[] {
  return STATES;
}

export function getRandomPrices(count: number = 10): CommodityPrice[] {
  const shuffled = [...ALL_PRICES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
