/**
 * Translation Service for Multilingual Mandi Platform
 * 
 * Provides real-time translation capabilities for 10+ Indian languages
 * with confidence scoring, commercial term preservation, and caching.
 * 
 * Supported Languages:
 * - Hindi (hi), English (en), Tamil (ta), Telugu (te), Bengali (bn)
 * - Marathi (mr), Gujarati (gu), Kannada (kn), Malayalam (ml), Punjabi (pa)
 * 
 * Note: Google Translate API requires a backend server.
 * This implementation uses mock translations for browser compatibility.
 */

export interface TranslationResult {
  translatedText: string;
  confidence: number;
  originalText: string;
  fromLanguage: string;
  toLanguage: string;
  preservedTerms: string[];
  timestamp: Date;
}

export interface LanguageDetection {
  language: string;
  confidence: number;
}

export interface TranslationCache {
  key: string;
  result: TranslationResult;
  usageCount: number;
  lastUsed: Date;
}

/**
 * Commercial terms that should be preserved during translation
 * These are common trading terms used in Indian markets
 */
const COMMERCIAL_TERMS = [
  // Price-related terms
  'rupee', 'rupees', '₹', 'rs', 'price', 'rate', 'cost',
  // Quantity terms
  'kg', 'kilogram', 'quintal', 'ton', 'tonne', 'litre', 'liter',
  // Quality terms
  'grade', 'quality', 'premium', 'standard',
  // Market terms
  'mandi', 'apmc', 'wholesale', 'retail', 'market',
  // Transaction terms
  'payment', 'advance', 'credit', 'cash', 'upi',
  // Common commodities
  'wheat', 'rice', 'dal', 'onion', 'potato', 'tomato',
];

/**
 * Supported Indian languages with their codes
 */
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  hi: 'Hindi',
  ta: 'Tamil',
  te: 'Telugu',
  bn: 'Bengali',
  mr: 'Marathi',
  gu: 'Gujarati',
  kn: 'Kannada',
  ml: 'Malayalam',
  pa: 'Punjabi',
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

class TranslationService {
  private cache: Map<string, TranslationCache>;
  private readonly CACHE_KEY = 'mandi_translation_cache';
  private readonly MAX_CACHE_SIZE = 1000;
  private readonly CONFIDENCE_THRESHOLD = 0.85;
  private translateClient: any | null;
  private useMockTranslation: boolean;

  constructor() {
    this.cache = new Map();
    this.loadCacheFromStorage();
    
    // Google Translate API requires a backend server
    // Using mock translations for browser compatibility
    this.useMockTranslation = true;
    this.translateClient = null;
    console.warn('Google Translate API requires a backend server. Using mock translations for browser.');
  }

  /**
   * Translate text from one language to another
   * @param text - Text to translate
   * @param fromLang - Source language code
   * @param toLang - Target language code
   * @returns Translation result with confidence score
   */
  async translateMessage(
    text: string,
    fromLang: LanguageCode,
    toLang: LanguageCode
  ): Promise<TranslationResult> {
    const startTime = Date.now();

    // Check cache first
    const cacheKey = this.getCacheKey(text, fromLang, toLang);
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // If same language, return as-is
    if (fromLang === toLang) {
      const result: TranslationResult = {
        translatedText: text,
        confidence: 1.0,
        originalText: text,
        fromLanguage: fromLang,
        toLanguage: toLang,
        preservedTerms: [],
        timestamp: new Date(),
      };
      return result;
    }

    try {
      // Extract and preserve commercial terms
      const { cleanText, preservedTerms } = this.extractCommercialTerms(text);

      // Perform translation using Google Translate API
      const translatedText = await this.performTranslation(
        cleanText,
        fromLang,
        toLang
      );

      // Restore preserved terms
      const finalText = this.restoreCommercialTerms(
        translatedText,
        preservedTerms
      );

      // Calculate confidence score
      const confidence = this.calculateConfidence(text, translatedText, fromLang, toLang);

      const result: TranslationResult = {
        translatedText: finalText,
        confidence,
        originalText: text,
        fromLanguage: fromLang,
        toLanguage: toLang,
        preservedTerms: preservedTerms.map(t => t.term),
        timestamp: new Date(),
      };

      // Ensure translation completes within 2 seconds (Requirement 1.1)
      const elapsed = Date.now() - startTime;
      if (elapsed > 2000) {
        console.warn(`Translation took ${elapsed}ms, exceeding 2s requirement`);
      }

      // Cache the result
      this.addToCache(cacheKey, result);

      return result;
    } catch (error) {
      console.error('Translation error:', error);
      // Return original text with low confidence on error
      return {
        translatedText: text,
        confidence: 0,
        originalText: text,
        fromLanguage: fromLang,
        toLanguage: toLang,
        preservedTerms: [],
        timestamp: new Date(),
      };
    }
  }

  /**
   * Detect the language of the given text
   * @param text - Text to analyze
   * @returns Detected language and confidence
   */
  async detectLanguage(text: string): Promise<LanguageDetection> {
    try {
      // Use Google Translate API for language detection
      const detected = await this.performLanguageDetection(text);
      return detected;
    } catch (error) {
      console.error('Language detection error:', error);
      // Default to English with low confidence
      return {
        language: 'en',
        confidence: 0.5,
      };
    }
  }

  /**
   * Get confidence score for a translation
   * @param translation - Translation result
   * @returns Confidence score (0-1)
   */
  getConfidenceScore(translation: TranslationResult): number {
    return translation.confidence;
  }

  /**
   * Check if translation confidence is below threshold
   * @param translation - Translation result
   * @returns True if translation should be flagged for review
   */
  shouldFlagForReview(translation: TranslationResult): boolean {
    return translation.confidence < this.CONFIDENCE_THRESHOLD;
  }

  /**
   * Clear the translation cache
   */
  clearCache(): void {
    this.cache.clear();
    this.saveCacheToStorage();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
    };
  }

  // Private helper methods

  private getCacheKey(text: string, fromLang: string, toLang: string): string {
    return `${fromLang}:${toLang}:${text.toLowerCase().trim()}`;
  }

  private getFromCache(key: string): TranslationResult | null {
    const cached = this.cache.get(key);
    if (cached) {
      // Update usage statistics
      cached.usageCount++;
      cached.lastUsed = new Date();
      this.cache.set(key, cached);
      return cached.result;
    }
    return null;
  }

  private addToCache(key: string, result: TranslationResult): void {
    // Implement LRU cache eviction if needed
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictOldestCacheEntry();
    }

    this.cache.set(key, {
      key,
      result,
      usageCount: 1,
      lastUsed: new Date(),
    });

    this.saveCacheToStorage();
  }

  private evictOldestCacheEntry(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastUsed.getTime() < oldestTime) {
        oldestTime = entry.lastUsed.getTime();
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private loadCacheFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.CACHE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.cache = new Map(
          data.map((item: any) => [
            item.key,
            {
              ...item,
              lastUsed: new Date(item.lastUsed),
              result: {
                ...item.result,
                timestamp: new Date(item.result.timestamp),
              },
            },
          ])
        );
      }
    } catch (error) {
      console.error('Error loading cache from storage:', error);
      this.cache = new Map();
    }
  }

  private saveCacheToStorage(): void {
    try {
      const data = Array.from(this.cache.values());
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving cache to storage:', error);
    }
  }

  private extractCommercialTerms(text: string): {
    cleanText: string;
    preservedTerms: Array<{ term: string; placeholder: string }>;
  } {
    const preservedTerms: Array<{ term: string; placeholder: string }> = [];
    let cleanText = text;

    // Extract numbers with currency symbols
    const currencyPattern = /₹\s*[\d,]+(?:\.\d+)?|rs\.?\s*[\d,]+(?:\.\d+)?/gi;
    const currencyMatches = text.match(currencyPattern) || [];
    currencyMatches.forEach((match, index) => {
      const placeholder = `__CURRENCY_${index}__`;
      preservedTerms.push({ term: match, placeholder });
      cleanText = cleanText.replace(match, placeholder);
    });

    // Extract commercial terms
    COMMERCIAL_TERMS.forEach((term, index) => {
      const pattern = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = cleanText.match(pattern) || [];
      matches.forEach((match) => {
        const placeholder = `__TERM_${term.toUpperCase()}_${index}__`;
        preservedTerms.push({ term: match, placeholder });
        cleanText = cleanText.replace(match, placeholder);
      });
    });

    return { cleanText, preservedTerms };
  }

  private restoreCommercialTerms(
    text: string,
    preservedTerms: Array<{ term: string; placeholder: string }>
  ): string {
    let restoredText = text;
    preservedTerms.forEach(({ term, placeholder }) => {
      restoredText = restoredText.replace(placeholder, term);
    });
    return restoredText;
  }

  private calculateConfidence(
    originalText: string,
    translatedText: string,
    fromLang: string,
    toLang: string
  ): number {
    // Base confidence score
    let confidence = 0.9;

    // Reduce confidence for very short texts
    if (originalText.length < 10) {
      confidence -= 0.1;
    }

    // Reduce confidence for very long texts
    if (originalText.length > 500) {
      confidence -= 0.05;
    }

    // Reduce confidence if translation is identical (might indicate failure)
    if (originalText === translatedText && fromLang !== toLang) {
      confidence = 0.5;
    }

    // Ensure confidence is between 0 and 1
    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Perform actual translation using Google Translate API
   */
  private async performTranslation(
    text: string,
    fromLang: LanguageCode,
    toLang: LanguageCode
  ): Promise<string> {
    // Use mock translation if API key is not available
    if (this.useMockTranslation || !this.translateClient) {
      return this.mockTranslation(text, toLang);
    }

    try {
      // Call Google Translate API
      const [translation] = await this.translateClient.translate(text, {
        from: fromLang,
        to: toLang,
      });
      
      return translation;
    } catch (error) {
      console.error('Google Translate API error:', error);
      // Fallback to mock translation on error
      return this.mockTranslation(text, toLang);
    }
  }

  /**
   * Mock translation for development/testing
   * Provides simple but realistic translations for Hindi, Tamil, Telugu
   */
  private mockTranslation(text: string, toLang: LanguageCode): string {
    // Handle empty text
    if (!text || text.trim() === '') {
      return text;
    }

    // If already in target language, return as-is
    const detectedLang = this.mockLanguageDetection(text).language;
    if (detectedLang === toLang) {
      return text;
    }

    // Simple word-by-word translation for common phrases
    const translations: Record<LanguageCode, Record<string, string>> = {
      hi: {
        'hello': 'नमस्ते',
        'thank you': 'धन्यवाद',
        'yes': 'हाँ',
        'no': 'नहीं',
        'price': 'मूल्य',
        'offer': 'प्रस्ताव',
        'accept': 'स्वीकार',
        'reject': 'अस्वीकार',
        'good': 'अच्छा',
        'fair': 'उचित',
        'too high': 'बहुत अधिक',
        'too low': 'बहुत कम',
        'per kg': 'प्रति किलो',
        'per quintal': 'प्रति क्विंटल',
        'market': 'बाजार',
        'today': 'आज',
      },
      ta: {
        'hello': 'வணக்கம்',
        'thank you': 'நன்றி',
        'yes': 'ஆம்',
        'no': 'இல்லை',
        'price': 'விலை',
        'offer': 'சலுகை',
        'accept': 'ஏற்கவும்',
        'reject': 'நிராகரி',
        'good': 'நல்லது',
        'fair': 'நியாயமான',
        'too high': 'மிக அதிகம்',
        'too low': 'மிக குறைவு',
        'per kg': 'கிலோவுக்கு',
        'per quintal': 'குவிண்டலுக்கு',
        'market': 'சந்தை',
        'today': 'இன்று',
      },
      te: {
        'hello': 'నమస్కారం',
        'thank you': 'ధన్యవాదాలు',
        'yes': 'అవును',
        'no': 'కాదు',
        'price': 'ధర',
        'offer': 'ఆఫర్',
        'accept': 'అంగీకరించు',
        'reject': 'తిరస్కరించు',
        'good': 'మంచి',
        'fair': 'న్యాయమైన',
        'too high': 'చాలా ఎక్కువ',
        'too low': 'చాలా తక్కువ',
        'per kg': 'కిలోకు',
        'per quintal': 'క్వింటల్‌కు',
        'market': 'మార్కెట్',
        'today': 'ఈరోజు',
      },
      en: {}, // English is the source
      bn: {},
      mr: {},
      gu: {},
      kn: {},
      ml: {},
      pa: {},
    };

    // Get translations for target language
    const langTranslations = translations[toLang] || {};
    
    // Translate common phrases
    let translated = text.toLowerCase();
    for (const [english, foreign] of Object.entries(langTranslations)) {
      const pattern = new RegExp(`\\b${english}\\b`, 'gi');
      translated = translated.replace(pattern, foreign);
    }

    // If no translation occurred, add language prefix for clarity
    if (translated === text.toLowerCase()) {
      return `[${SUPPORTED_LANGUAGES[toLang]}] ${text}`;
    }

    return translated;
  }

  /**
   * Perform language detection using Google Translate API
   */
  private async performLanguageDetection(text: string): Promise<LanguageDetection> {
    // Use mock detection if API key is not available
    if (this.useMockTranslation || !this.translateClient) {
      return this.mockLanguageDetection(text);
    }

    try {
      // Call Google Translate API for language detection
      const [detection] = await this.translateClient.detect(text);
      
      return {
        language: detection.language,
        confidence: detection.confidence || 0.95,
      };
    } catch (error) {
      console.error('Google Translate API detection error:', error);
      // Fallback to mock detection on error
      return this.mockLanguageDetection(text);
    }
  }

  /**
   * Mock language detection for development/testing
   */
  private mockLanguageDetection(text: string): LanguageDetection {
    // Simple heuristic: check for common Hindi/Indian language characters
    const hindiPattern = /[\u0900-\u097F]/;
    const tamilPattern = /[\u0B80-\u0BFF]/;
    const teluguPattern = /[\u0C00-\u0C7F]/;
    const bengaliPattern = /[\u0980-\u09FF]/;
    const gujaratiPattern = /[\u0A80-\u0AFF]/;
    const kannadaPattern = /[\u0C80-\u0CFF]/;
    const malayalamPattern = /[\u0D00-\u0D7F]/;
    const punjabiPattern = /[\u0A00-\u0A7F]/;
    const marathiPattern = /[\u0900-\u097F]/; // Same as Hindi/Devanagari

    if (hindiPattern.test(text)) return { language: 'hi', confidence: 0.9 };
    if (tamilPattern.test(text)) return { language: 'ta', confidence: 0.9 };
    if (teluguPattern.test(text)) return { language: 'te', confidence: 0.9 };
    if (bengaliPattern.test(text)) return { language: 'bn', confidence: 0.9 };
    if (gujaratiPattern.test(text)) return { language: 'gu', confidence: 0.9 };
    if (kannadaPattern.test(text)) return { language: 'kn', confidence: 0.9 };
    if (malayalamPattern.test(text)) return { language: 'ml', confidence: 0.9 };
    if (punjabiPattern.test(text)) return { language: 'pa', confidence: 0.9 };

    // Default to English
    return { language: 'en', confidence: 0.95 };
  }
}

// Export singleton instance
export const translationService = new TranslationService();
export default TranslationService;
