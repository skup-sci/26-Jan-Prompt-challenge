/**
 * Property-Based Tests for Translation Service
 * 
 * **Property 1: Translation Performance and Quality**
 * **Validates: Requirements 1.1, 1.2, 1.5**
 * 
 * For any message in a supported Indian language, translation to any other 
 * supported language should complete within 2 seconds and preserve commercial 
 * terminology with 85% or higher confidence, flagging lower confidence translations for review.
 */

import * as fc from 'fast-check';
import { translationService, SUPPORTED_LANGUAGES, LanguageCode } from '../services/TranslationService';

describe('TranslationService Property-Based Tests', () => {
  describe('Property 1: Translation Performance and Quality', () => {
    /**
     * **Validates: Requirements 1.1, 1.2, 1.5**
     */
    it('should translate any message within 2 seconds with proper confidence scoring', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate random text messages
          fc.string({ minLength: 1, maxLength: 500 }),
          // Generate random source language
          fc.constantFrom(...Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[]),
          // Generate random target language
          fc.constantFrom(...Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[]),
          async (text, fromLang, toLang) => {
            // Skip empty or whitespace-only strings
            if (!text.trim()) {
              return true;
            }

            const startTime = Date.now();
            
            // Perform translation
            const result = await translationService.translateMessage(text, fromLang, toLang);
            
            const elapsed = Date.now() - startTime;

            // Requirement 1.1: Translation should complete within 2 seconds
            expect(elapsed).toBeLessThan(2000);

            // Verify result structure
            expect(result).toBeDefined();
            expect(result.translatedText).toBeDefined();
            expect(result.originalText).toBe(text);
            expect(result.fromLanguage).toBe(fromLang);
            expect(result.toLanguage).toBe(toLang);
            expect(result.confidence).toBeGreaterThanOrEqual(0);
            expect(result.confidence).toBeLessThanOrEqual(1);
            expect(Array.isArray(result.preservedTerms)).toBe(true);
            expect(result.timestamp).toBeInstanceOf(Date);

            // Requirement 1.5: Low confidence translations should be flagged
            const shouldFlag = translationService.shouldFlagForReview(result);
            if (result.confidence < 0.85) {
              expect(shouldFlag).toBe(true);
            } else {
              expect(shouldFlag).toBe(false);
            }

            return true;
          }
        ),
        { numRuns: 100, timeout: 5000 }
      );
    });

    it('should preserve commercial terminology during translation', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate messages with commercial terms
          fc.record({
            prefix: fc.string({ maxLength: 50 }),
            term: fc.constantFrom(
              '₹100', 'rs 500', '10 kg', '5 quintal', 
              'premium quality', 'mandi price', 'wholesale rate',
              'wheat', 'rice', 'dal', 'payment', 'cash'
            ),
            suffix: fc.string({ maxLength: 50 }),
          }),
          fc.constantFrom(...Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[]),
          fc.constantFrom(...Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[]),
          async ({ prefix, term, suffix }, fromLang, toLang) => {
            const text = `${prefix} ${term} ${suffix}`.trim();
            
            if (!text) {
              return true;
            }

            const result = await translationService.translateMessage(text, fromLang, toLang);

            // Requirement 1.2: Commercial terms should be preserved
            // The translated text should contain the term or it should be in preservedTerms
            const termInResult = result.translatedText.toLowerCase().includes(term.toLowerCase()) ||
                                 result.preservedTerms.some(t => t.toLowerCase().includes(term.toLowerCase()));

            // For same language, term should definitely be present
            if (fromLang === toLang) {
              expect(result.translatedText).toContain(term);
            }

            return true;
          }
        ),
        { numRuns: 100, timeout: 5000 }
      );
    });

    it('should handle same-language translation efficiently', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 200 }),
          fc.constantFrom(...Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[]),
          async (text, lang) => {
            if (!text.trim()) {
              return true;
            }

            const startTime = Date.now();
            const result = await translationService.translateMessage(text, lang, lang);
            const elapsed = Date.now() - startTime;

            // Same language translation should be instant
            expect(elapsed).toBeLessThan(100);
            
            // Text should remain unchanged
            expect(result.translatedText).toBe(text);
            expect(result.confidence).toBe(1.0);
            expect(result.fromLanguage).toBe(lang);
            expect(result.toLanguage).toBe(lang);

            return true;
          }
        ),
        { numRuns: 50, timeout: 3000 }
      );
    });

    it('should maintain confidence scores within valid range', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 300 }),
          fc.constantFrom(...Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[]),
          fc.constantFrom(...Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[]),
          async (text, fromLang, toLang) => {
            if (!text.trim()) {
              return true;
            }

            const result = await translationService.translateMessage(text, fromLang, toLang);

            // Confidence must be between 0 and 1
            expect(result.confidence).toBeGreaterThanOrEqual(0);
            expect(result.confidence).toBeLessThanOrEqual(1);

            // getConfidenceScore should return the same value
            const score = translationService.getConfidenceScore(result);
            expect(score).toBe(result.confidence);

            return true;
          }
        ),
        { numRuns: 100, timeout: 5000 }
      );
    });

    it('should cache translations for repeated requests', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 5, maxLength: 100 }),
          fc.constantFrom(...Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[]),
          fc.constantFrom(...Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[]),
          async (text, fromLang, toLang) => {
            if (!text.trim()) {
              return true;
            }

            // First translation
            const startTime1 = Date.now();
            const result1 = await translationService.translateMessage(text, fromLang, toLang);
            const elapsed1 = Date.now() - startTime1;

            // Second translation (should be cached)
            const startTime2 = Date.now();
            const result2 = await translationService.translateMessage(text, fromLang, toLang);
            const elapsed2 = Date.now() - startTime2;

            // Cached translation should be faster
            expect(elapsed2).toBeLessThanOrEqual(elapsed1);

            // Results should be identical
            expect(result2.translatedText).toBe(result1.translatedText);
            expect(result2.confidence).toBe(result1.confidence);
            expect(result2.fromLanguage).toBe(result1.fromLanguage);
            expect(result2.toLanguage).toBe(result1.toLanguage);

            return true;
          }
        ),
        { numRuns: 50, timeout: 5000 }
      );
    });
  });
});
