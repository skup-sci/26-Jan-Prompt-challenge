/**
 * Property-Based Tests for Translation Service
 * Feature: multilingual-mandi-platform, Property 1: Translation Performance and Quality
 * **Validates: Requirements 1.1, 1.2, 1.5**
 */

const fc = require('fast-check');
import { translationService, LanguageCode } from '../services/TranslationService';

describe('Translation Service Property Tests', () => {
  describe('Property 1: Translation Performance and Quality', () => {
    /**
     * **Feature: multilingual-mandi-platform, Property 1: Translation Performance and Quality**
     * **Validates: Requirements 1.1, 1.2, 1.5**
     * 
     * Property: For any message in a supported Indian language, translation to any other 
     * supported language should complete within 2 seconds and preserve commercial terminology 
     * with 85% or higher confidence, flagging lower confidence translations for review.
     */
    
    test('Translation completes within 2 seconds for any supported language pair', async () => {
      const languageCodeArb = fc.constantFrom<LanguageCode>(
        'en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa'
      );
      
      const messageArb = fc.constantFrom(
        'The price of wheat is ₹2000 per quintal',
        'I can offer rice at rs 50 per kg',
        'What is the market rate for tomatoes today?'
      );
      
      await fc.assert(
        fc.asyncProperty(
          messageArb,
          languageCodeArb,
          languageCodeArb,
          async (message: string, fromLang: LanguageCode, toLang: LanguageCode) => {
            const startTime = Date.now();
            const result = await translationService.translateMessage(message, fromLang, toLang);
            const elapsed = Date.now() - startTime;
            
            expect(elapsed).toBeLessThan(2000);
            expect(result).toHaveProperty('translatedText');
            expect(result).toHaveProperty('confidence');
            expect(result.originalText).toBe(message);
          }
        ),
        { numRuns: 20 }
      );
    });
    
    test('Translation confidence is 85% or higher, or flagged for review', async () => {
      const messageArb = fc.constantFrom(
        'Hello, how are you?',
        'The wheat price is ₹2000',
        'Good morning'
      );
      
      const languageCodeArb = fc.constantFrom<LanguageCode>('en', 'hi', 'ta');
      
      await fc.assert(
        fc.asyncProperty(
          messageArb,
          languageCodeArb,
          languageCodeArb,
          async (message: string, fromLang: LanguageCode, toLang: LanguageCode) => {
            const result = await translationService.translateMessage(message, fromLang, toLang);
            
            expect(result.confidence).toBeGreaterThanOrEqual(0);
            expect(result.confidence).toBeLessThanOrEqual(1);
            
            const shouldFlag = translationService.shouldFlagForReview(result);
            if (result.confidence < 0.85) {
              expect(shouldFlag).toBe(true);
            } else {
              expect(shouldFlag).toBe(false);
            }
          }
        ),
        { numRuns: 20 }
      );
    });
    
    test('Translation handles all 10 supported Indian languages', async () => {
      const allLanguagesArb = fc.constantFrom<LanguageCode>(
        'en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa'
      );
      
      const simpleMessageArb = fc.constantFrom('Hello', 'Thank you');
      
      await fc.assert(
        fc.asyncProperty(
          simpleMessageArb,
          allLanguagesArb,
          allLanguagesArb,
          async (message: string, fromLang: LanguageCode, toLang: LanguageCode) => {
            const result = await translationService.translateMessage(message, fromLang, toLang);
            
            expect(result).toBeDefined();
            expect(result.translatedText).toBeDefined();
            expect(result.fromLanguage).toBe(fromLang);
            expect(result.toLanguage).toBe(toLang);
          }
        ),
        { numRuns: 20 }
      );
    });
  });
});
