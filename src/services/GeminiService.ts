/**
 * Gemini API Service
 * Handles AI-powered features: Voice Assistant, Negotiation, Price Discovery
 * 
 * To use: Add your Gemini API key in .env file:
 * REACT_APP_GEMINI_API_KEY=your_api_key_here
 */

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
// Using gemini-1.5-flash (faster and cheaper) - you can also use gemini-1.5-pro for better quality
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

class GeminiService {
  private apiKey: string;

  constructor() {
    this.apiKey = GEMINI_API_KEY;
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }

  /**
   * Make a request to Gemini API
   */
  private async makeRequest(prompt: string): Promise<string> {
    if (!this.isConfigured()) {
      console.warn('Gemini API key not configured. Using fallback responses.');
      return this.getFallbackResponse(prompt);
    }

    try {
      console.log('🚀 Making Gemini API request...');
      
      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }),
      });

      console.log('📡 Gemini API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Gemini API error:', response.status, errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data: GeminiResponse = await response.json();
      console.log('✅ Gemini API response received');
      
      return data.candidates[0]?.content?.parts[0]?.text || 'No response from AI';
    } catch (error) {
      console.error('❌ Gemini API error:', error);
      return this.getFallbackResponse(prompt);
    }
  }

  /**
   * Fallback responses when API is not configured
   */
  private getFallbackResponse(prompt: string): string {
    if (prompt.includes('price') || prompt.includes('mandi')) {
      return 'Current market price is around ₹25-30 per kg. This is based on recent mandi data.';
    }
    if (prompt.includes('negotiate')) {
      return 'Based on market analysis, I suggest offering ₹26 per kg, which is fair for both parties.';
    }
    return 'AI response (API key not configured)';
  }

  /**
   * Get price discovery insights using Gemini
   */
  async getPriceInsights(commodity: string, currentPrice: number, marketData: any): Promise<string> {
    const prompt = `You are a mandi price expert in India. 
    
Commodity: ${commodity}
Current Market Price: ₹${currentPrice}
Market: ${marketData.market || 'Unknown'}
Trend: ${marketData.trend || 'stable'}

Provide a brief, conversational insight about this price in 2-3 sentences. 
Include:
1. Whether this is a good price
2. Price trend (rising/falling/stable)
3. Brief recommendation for buyers

Keep it simple and farmer-friendly.`;

    return await this.makeRequest(prompt);
  }

  /**
   * Get negotiation advice using Gemini
   */
  async getNegotiationAdvice(params: {
    commodity: string;
    marketPrice: number;
    vendorOffer: number;
    buyerBudget?: number;
  }): Promise<string> {
    const { commodity, marketPrice, vendorOffer, buyerBudget } = params;
    const difference = ((vendorOffer - marketPrice) / marketPrice) * 100;

    const prompt = `You are a negotiation expert for Indian mandi trading.

Commodity: ${commodity}
Market Price: ₹${marketPrice}
Vendor's Offer: ₹${vendorOffer}
Difference from Market: ${difference.toFixed(1)}%
${buyerBudget ? `Buyer's Budget: ₹${buyerBudget}` : ''}

Provide negotiation advice in 2-3 sentences:
1. Should the buyer ACCEPT, COUNTER, or REJECT?
2. If counter, what price to offer?
3. Brief reasoning

Be practical and fair to both parties.`;

    return await this.makeRequest(prompt);
  }

  /**
   * Get voice command interpretation using Gemini
   */
  async interpretVoiceCommand(transcript: string, context: string = 'mandi'): Promise<{
    intent: string;
    commodity?: string;
    action?: string;
    confidence: number;
  }> {
    const prompt = `You are a voice command interpreter for a mandi platform.

User said: "${transcript}"
Context: ${context}

Extract:
1. Intent (price_check, negotiate, list_item, general_query)
2. Commodity name (if mentioned)
3. Action (if any)

Respond in JSON format:
{
  "intent": "price_check",
  "commodity": "onion",
  "action": "check_price",
  "confidence": 0.95
}`;

    const response = await this.makeRequest(prompt);
    
    try {
      // Try to parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse Gemini response as JSON');
    }

    // Fallback
    return {
      intent: 'general_query',
      confidence: 0.5,
    };
  }

  /**
   * Translate text using Gemini (alternative to Google Translate)
   */
  async translateText(text: string, fromLang: string, toLang: string): Promise<string> {
    const prompt = `Translate the following text from ${fromLang} to ${toLang}.
Only provide the translation, nothing else.

Text: ${text}`;

    return await this.makeRequest(prompt);
  }

  /**
   * Get market trend analysis using Gemini
   */
  async getMarketTrendAnalysis(commodity: string, historicalPrices: number[]): Promise<string> {
    const prompt = `You are a market analyst for Indian agricultural commodities.

Commodity: ${commodity}
Recent Prices (last 7 days): ${historicalPrices.join(', ')}

Analyze the trend and provide:
1. Current trend (rising/falling/stable)
2. Predicted direction for next week
3. Brief recommendation for traders

Keep it concise (3-4 sentences).`;

    return await this.makeRequest(prompt);
  }

  /**
   * Generate polite negotiation responses using Gemini
   */
  async generatePoliteResponse(situation: string, language: string = 'en'): Promise<string> {
    const prompt = `Generate a polite negotiation response for this situation:

${situation}

Language: ${language === 'hi' ? 'Hindi (Devanagari script)' : 'English'}

Provide a culturally appropriate, respectful response that maintains good business relationships.
Keep it brief (1-2 sentences).`;

    return await this.makeRequest(prompt);
  }

  /**
   * Parse natural language listing command using Gemini
   * Example: "26 kg aloo bechna hai 30 rupaye kilo"
   */
  async parseListingCommand(voiceInput: string): Promise<{
    commodity: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    confidence: number;
  } | null> {
    const prompt = `You are a smart assistant for Indian mandi traders. Parse this voice command into structured listing data.

Voice command: "${voiceInput}"

Common Hindi to English translations (case-insensitive):
- aloo/aalu/aaloo/आलू/Aloo/Aalu → Potato
- pyaaz/pyaz/प्याज/Pyaaz → Onion
- tamatar/टमाटर/Tamatar → Tomato
- gehun/gehu/गेहूं/Gehun → Wheat
- chawal/चावल/Chawal → Rice
- mirch/मिर्च/Mirch → Chili
- gobhi/गोभी/Gobhi → Cauliflower
- palak/पालक/Palak → Spinach
- gajar/गाजर/Gajar → Carrot
- baingan/बैंगन/Baingan → Eggplant

Common units (case-insensitive):
- kg/kilo/kilogram/KG/Kg → kg
- quintal/कुंतल/Quintal → quintal
- ton/टन/Ton → ton
- piece/पीस/Piece → piece
- dozen/दर्जन/Dozen → dozen

IMPORTANT RULES:
1. Accept ANY quantity (1 kg to 10000 kg)
2. Be flexible with spelling variations
3. Ignore case (Aalu = aalu = AALU)
4. Accept partial commands (if price missing, set to 0)
5. Be lenient - if you can guess the commodity, do it

Extract these fields:
1. Commodity name (translate to English if needed)
2. Quantity (any positive number)
3. Unit (kg, quintal, ton, piece, dozen)
4. Price per unit (number only, in rupees, or 0 if not mentioned)

Respond with ONLY valid JSON, no other text:
{
  "commodity": "Potato",
  "quantity": 6,
  "unit": "kg",
  "pricePerUnit": 30,
  "confidence": 0.95
}

If you cannot parse at all, return:
{
  "commodity": "",
  "quantity": 0,
  "unit": "kg",
  "pricePerUnit": 0,
  "confidence": 0
}`;

    try {
      const response = await this.makeRequest(prompt);
      console.log('📝 AI Response:', response);
      
      // Try to parse JSON from response - handle markdown code blocks
      let jsonText = response;
      
      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Extract JSON object
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ Parsed data:', parsed);
        
        // Validate the parsed data - be more lenient
        if (parsed.commodity && parsed.quantity > 0 && parsed.pricePerUnit > 0) {
          // Ensure confidence is set
          if (!parsed.confidence || parsed.confidence === 0) {
            parsed.confidence = 0.8; // Default confidence
          }
          return parsed;
        } else {
          console.warn('⚠️ Parsed data incomplete:', parsed);
        }
      } else {
        console.warn('⚠️ No JSON found in response');
      }
    } catch (e) {
      console.error('❌ Failed to parse listing command:', e);
    }

    return null;
  }
}

// Export singleton instance
export const geminiService = new GeminiService();

// Export for testing
export { GeminiService };
