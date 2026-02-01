/**
 * Negotiation Assistant Service
 * 
 * Provides AI-powered suggestions for price negotiations between vendors
 * speaking different languages. Focuses on helpful, polite suggestions.
 */

import { priceDiscoveryService } from './PriceDiscoveryService';

export interface NegotiationContext {
  commodity: string;
  marketPrice?: number;
  currentOffer: number;
  previousOffers: number[];
  userLanguage: string;
  vendorLanguage: string;
}

export interface NegotiationSuggestion {
  type: 'counter' | 'accept' | 'reject' | 'info';
  message: string;
  suggestedPrice?: number;
  reasoning: string;
  tone: 'polite' | 'neutral' | 'firm';
}

/**
 * Get negotiation suggestion based on current context
 */
export async function getNegotiationSuggestion(context: NegotiationContext): Promise<NegotiationSuggestion> {
  const { commodity, marketPrice, currentOffer, previousOffers } = context;
  
  // Get market price if not provided
  let referencePrice = marketPrice;
  if (!referencePrice) {
    const priceResult = await priceDiscoveryService.getPrice(commodity);
    if (priceResult) {
      // Use average of price range
      referencePrice = (priceResult.commodity.priceMin + priceResult.commodity.priceMax) / 2;
    }
  }
  
  // If no market price available, provide general advice
  if (!referencePrice) {
    return {
      type: 'info',
      message: 'Consider the quality and quantity before deciding.',
      reasoning: 'No market price available',
      tone: 'neutral'
    };
  }
  
  // Calculate difference from market price
  const difference = ((currentOffer - referencePrice) / referencePrice) * 100;
  
  // Determine negotiation stage
  const isFirstOffer = previousOffers.length === 0;
  const hasCountered = previousOffers.length > 0;
  
  // Generate suggestion based on offer vs market price
  if (difference > 15) {
    // Offer is significantly above market price
    return generateHighOfferSuggestion(currentOffer, referencePrice, isFirstOffer);
  } else if (difference < -15) {
    // Offer is significantly below market price
    return generateLowOfferSuggestion(currentOffer, referencePrice, isFirstOffer);
  } else if (Math.abs(difference) <= 5) {
    // Offer is close to market price
    return generateFairOfferSuggestion(currentOffer, referencePrice, hasCountered);
  } else {
    // Offer is moderately off market price
    return generateModerateOfferSuggestion(currentOffer, referencePrice, difference > 0);
  }
}

/**
 * Generate suggestion for high offer (above market)
 */
function generateHighOfferSuggestion(
  offer: number,
  marketPrice: number,
  isFirstOffer: boolean
): NegotiationSuggestion {
  const counterOffer = Math.round(marketPrice * 1.05); // 5% above market
  
  return {
    type: 'counter',
    message: `This offer is above market rate. You can politely counter with ₹${counterOffer}.`,
    suggestedPrice: counterOffer,
    reasoning: `Offer (₹${offer}) is higher than market price (₹${Math.round(marketPrice)})`,
    tone: 'polite'
  };
}

/**
 * Generate suggestion for low offer (below market)
 */
function generateLowOfferSuggestion(
  offer: number,
  marketPrice: number,
  isFirstOffer: boolean
): NegotiationSuggestion {
  const counterOffer = Math.round(marketPrice * 0.95); // 5% below market
  
  return {
    type: isFirstOffer ? 'reject' : 'counter',
    message: isFirstOffer 
      ? `This offer is too low. Politely suggest ₹${counterOffer} instead.`
      : `Still below market. You can counter with ₹${counterOffer}.`,
    suggestedPrice: counterOffer,
    reasoning: `Offer (₹${offer}) is below market price (₹${Math.round(marketPrice)})`,
    tone: isFirstOffer ? 'polite' : 'firm'
  };
}

/**
 * Generate suggestion for fair offer (close to market)
 */
function generateFairOfferSuggestion(
  offer: number,
  marketPrice: number,
  hasCountered: boolean
): NegotiationSuggestion {
  if (hasCountered) {
    return {
      type: 'accept',
      message: `This is a fair price. You can accept this offer.`,
      reasoning: `Offer (₹${offer}) is close to market price (₹${Math.round(marketPrice)})`,
      tone: 'polite'
    };
  } else {
    const counterOffer = Math.round(offer * 0.98); // Slight counter
    return {
      type: 'counter',
      message: `Good offer! You can accept or try ₹${counterOffer}.`,
      suggestedPrice: counterOffer,
      reasoning: `Offer (₹${offer}) is fair, close to market price (₹${Math.round(marketPrice)})`,
      tone: 'polite'
    };
  }
}

/**
 * Generate suggestion for moderate offer
 */
function generateModerateOfferSuggestion(
  offer: number,
  marketPrice: number,
  isHigh: boolean
): NegotiationSuggestion {
  const counterOffer = Math.round(marketPrice);
  
  if (isHigh) {
    return {
      type: 'counter',
      message: `You can politely counter with ₹${counterOffer}.`,
      suggestedPrice: counterOffer,
      reasoning: `Offer (₹${offer}) is slightly above market (₹${Math.round(marketPrice)})`,
      tone: 'polite'
    };
  } else {
    return {
      type: 'counter',
      message: `Counter with ₹${counterOffer} to meet market rate.`,
      suggestedPrice: counterOffer,
      reasoning: `Offer (₹${offer}) is slightly below market (₹${Math.round(marketPrice)})`,
      tone: 'polite'
    };
  }
}

/**
 * Generate polite response templates
 */
export function getPoliteResponseTemplate(
  suggestion: NegotiationSuggestion,
  language: string = 'en'
): string {
  const templates = {
    en: {
      counter: [
        `Thank you for your offer. I was thinking ₹${suggestion.suggestedPrice}.`,
        `I appreciate your interest. How about ₹${suggestion.suggestedPrice}?`,
        `That's a bit different from what I had in mind. Can we do ₹${suggestion.suggestedPrice}?`
      ],
      accept: [
        `That sounds fair. I accept your offer.`,
        `Yes, that works for me.`,
        `Agreed. Let's proceed with this price.`
      ],
      reject: [
        `I appreciate your offer, but I can't go that low. How about ₹${suggestion.suggestedPrice}?`,
        `Thank you, but that's below my cost. I can do ₹${suggestion.suggestedPrice}.`,
        `I understand, but I need at least ₹${suggestion.suggestedPrice}.`
      ]
    },
    hi: {
      counter: [
        `आपके प्रस्ताव के लिए धन्यवाद। मैं ₹${suggestion.suggestedPrice} सोच रहा था।`,
        `आपकी रुचि की सराहना करता हूं। ₹${suggestion.suggestedPrice} कैसा रहेगा?`,
        `यह मेरे विचार से थोड़ा अलग है। क्या हम ₹${suggestion.suggestedPrice} कर सकते हैं?`
      ],
      accept: [
        `यह उचित लगता है। मैं आपका प्रस्ताव स्वीकार करता हूं।`,
        `हां, यह मेरे लिए ठीक है।`,
        `सहमत। चलिए इस कीमत पर आगे बढ़ते हैं।`
      ],
      reject: [
        `मैं आपके प्रस्ताव की सराहना करता हूं, लेकिन मैं इतना कम नहीं जा सकता। ₹${suggestion.suggestedPrice} कैसा रहेगा?`,
        `धन्यवाद, लेकिन यह मेरी लागत से कम है। मैं ₹${suggestion.suggestedPrice} कर सकता हूं।`,
        `मैं समझता हूं, लेकिन मुझे कम से कम ₹${suggestion.suggestedPrice} चाहिए।`
      ]
    }
  };
  
  const langTemplates = templates[language as keyof typeof templates] || templates.en;
  const typeTemplates = langTemplates[suggestion.type as keyof typeof langTemplates];
  
  if (!typeTemplates || typeTemplates.length === 0) {
    return suggestion.message;
  }
  
  // Pick a random template for variety
  return typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
}

/**
 * Evaluate if negotiation is stalled
 */
export function isNegotiationStalled(previousOffers: number[]): boolean {
  if (previousOffers.length < 3) return false;
  
  // Check if last 3 offers are very similar (within 2%)
  const recent = previousOffers.slice(-3);
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const allSimilar = recent.every(offer => Math.abs((offer - avg) / avg) < 0.02);
  
  return allSimilar;
}

/**
 * Suggest compromise when negotiation is stalled
 */
export function suggestCompromise(
  yourLastOffer: number,
  theirLastOffer: number
): NegotiationSuggestion {
  const midpoint = Math.round((yourLastOffer + theirLastOffer) / 2);
  
  return {
    type: 'counter',
    message: `Meet in the middle at ₹${midpoint}?`,
    suggestedPrice: midpoint,
    reasoning: 'Negotiation seems stalled, suggesting compromise',
    tone: 'polite'
  };
}

/**
 * Get quick tips for negotiation
 */
export function getNegotiationTips(language: string = 'en'): string[] {
  const tips = {
    en: [
      'Always be polite and respectful',
      'Know the market price before negotiating',
      'Start with a reasonable offer',
      'Be willing to compromise',
      'Consider quality and quantity',
      'Build long-term relationships'
    ],
    hi: [
      'हमेशा विनम्र और सम्मानजनक रहें',
      'बातचीत से पहले बाजार मूल्य जानें',
      'उचित प्रस्ताव से शुरू करें',
      'समझौता करने के लिए तैयार रहें',
      'गुणवत्ता और मात्रा पर विचार करें',
      'दीर्घकालिक संबंध बनाएं'
    ]
  };
  
  return tips[language as keyof typeof tips] || tips.en;
}

// Export singleton instance
export const negotiationService = {
  getNegotiationSuggestion: async (context: NegotiationContext) => getNegotiationSuggestion(context),
  getPoliteResponseTemplate,
  isNegotiationStalled,
  suggestCompromise,
  getNegotiationTips
};

export default negotiationService;
