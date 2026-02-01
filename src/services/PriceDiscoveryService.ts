/**
 * Price Discovery Service
 * 
 * Handles commodity price lookups with fuzzy matching and conversational responses.
 */

import { CommodityPrice, SAMPLE_PRICES } from '../data/samplePrices';

export interface PriceQueryResult {
  commodity: CommodityPrice;
  conversationalResponse: string;
  confidence: number;
}

/**
 * Normalize commodity name for matching
 * - Convert to lowercase
 * - Remove extra spaces
 * - Handle common variations
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/price|rate|bhav|cost|value/gi, '') // Remove price-related words
    .trim();
}

/**
 * Calculate similarity score between two strings (simple Levenshtein-like)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Exact match
  if (s1 === s2) return 1.0;
  
  // Contains match
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Character overlap
  const chars1 = new Set(s1.split(''));
  const chars2 = new Set(s2.split(''));
  const intersection = new Set([...chars1].filter(x => chars2.has(x)));
  const union = new Set([...chars1, ...chars2]);
  
  return intersection.size / union.size;
}

/**
 * Search for commodity by name with fuzzy matching
 */
export function searchCommodity(query: string): CommodityPrice | null {
  const normalizedQuery = normalizeName(query);
  
  if (!normalizedQuery) return null;
  
  let bestMatch: CommodityPrice | null = null;
  let bestScore = 0;
  
  for (const commodity of SAMPLE_PRICES) {
    // Check all possible names and aliases
    const searchTerms = [
      commodity.name,
      commodity.nameHindi,
      commodity.nameTamil || '',
      ...commodity.aliases
    ];
    
    for (const term of searchTerms) {
      const score = calculateSimilarity(normalizedQuery, term.toLowerCase());
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = commodity;
      }
    }
  }
  
  // Return match only if confidence is reasonable (> 0.5 for stricter matching)
  return bestScore > 0.5 ? bestMatch : null;
}

/**
 * Get price for a specific commodity
 */
export async function getPrice(
  commodityName: string, 
  userQuery: string = '', 
  language: string = 'en'
): Promise<PriceQueryResult | null> {
  const commodity = searchCommodity(commodityName);
  
  if (!commodity) {
    return null;
  }
  
  const response = await generateConversationalResponse(commodity, userQuery, language);
  
  return {
    commodity,
    conversationalResponse: response,
    confidence: 0.85 // Simple confidence for MVP
  };
}

/**
 * Generate conversational response for price query using Gemini AI
 * Keep it short, natural, and friendly
 */
async function generateConversationalResponse(
  commodity: CommodityPrice, 
  userQuery: string = '', 
  language: string = 'en'
): Promise<string> {
  const { name, priceMin, priceMax, unit, market, trend } = commodity;
  
  // Format price range
  const priceRange = priceMin === priceMax 
    ? `₹${priceMin}` 
    : `₹${priceMin}–${priceMax}`;
  
  // Try to use Gemini API for natural response
  try {
    const { geminiService } = await import('./GeminiService');
    
    if (geminiService.isConfigured()) {
      const prompt = `You are a helpful mandi assistant for Indian traders.

User question: "${userQuery || `What is ${name} price?`}"

Market data:
Commodity: ${name}
Price range: ${priceRange} per ${unit}
Market: ${market}
Trend: ${trend}

Instructions:
- Reply in simple ${language === 'hi' ? 'Hindi' : language === 'ta' ? 'Tamil' : 'English'}
- Keep it short (1–2 sentences)
- Sound like a friendly trader
- Mention price clearly
- No long explanations`;

      const aiResponse = await geminiService.getPriceInsights(name, (priceMin + priceMax) / 2, { market, trend });
      
      // If AI response is good, use it
      if (aiResponse && aiResponse.length > 10 && !aiResponse.includes('API key not configured')) {
        return aiResponse;
      }
    }
  } catch (error) {
    console.warn('Gemini API call failed, using fallback response', error);
  }
  
  // Fallback to static response if AI fails
  const unitText = unit === 'kg' ? 'per kg' : 'per quintal';
  let trendText = '';
  if (trend === 'up') {
    trendText = ' Prices are rising.';
  } else if (trend === 'down') {
    trendText = ' Prices are falling.';
  }
  
  const responses = [
    `${name} is ${priceRange} ${unitText} in ${market}.${trendText}`,
    `Today ${name} costs ${priceRange} ${unitText}.${trendText}`,
    `${name}: ${priceRange} ${unitText} at ${market}.${trendText}`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Get all available commodities
 */
export function getAllCommodities(): CommodityPrice[] {
  return SAMPLE_PRICES;
}

/**
 * Get related commodities (same category)
 */
export function getRelatedCommodities(commodityId: string, limit: number = 3): CommodityPrice[] {
  const commodity = SAMPLE_PRICES.find(c => c.id === commodityId);
  
  if (!commodity) return [];
  
  return SAMPLE_PRICES
    .filter(c => c.id !== commodityId && c.category === commodity.category)
    .slice(0, limit);
}

/**
 * Parse natural language query to extract commodity name
 * Handles queries like:
 * - "onion price"
 * - "what is tomato rate"
 * - "check wheat bhav"
 * - "टमाटर का भाव"
 */
export function parseQuery(query: string): string {
  // Remove common question words and price-related terms
  const cleaned = query
    .toLowerCase()
    .replace(/what is|what's|check|show|tell me|price of|rate of|bhav|cost of|value of|price|rate|cost|value/gi, '')
    .replace(/\?/g, '')
    .trim();
  
  return cleaned;
}

/**
 * Get suggestions for partial commodity name
 */
export function getSuggestions(partial: string): CommodityPrice[] {
  if (!partial || partial.length < 2) return [];
  
  const normalized = normalizeName(partial);
  
  return SAMPLE_PRICES.filter(commodity => {
    const searchTerms = [
      commodity.name,
      commodity.nameHindi,
      ...commodity.aliases
    ];
    
    return searchTerms.some(term => 
      term.toLowerCase().includes(normalized)
    );
  }).slice(0, 5); // Limit to 5 suggestions
}

// Export singleton instance with async getPrice
export const priceDiscoveryService = {
  getPrice: async (commodityName: string, userQuery: string = '', language: string = 'en') => 
    getPrice(commodityName, userQuery, language),
  searchCommodity,
  getAllCommodities,
  getRelatedCommodities,
  parseQuery,
  getSuggestions
};

export default priceDiscoveryService;
