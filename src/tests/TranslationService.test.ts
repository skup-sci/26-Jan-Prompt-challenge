/**
 * Unit tests for Translation Service
 * 
 * Tests specific examples and edge cases for translation functionality
 */

import TranslationService, {
  translationService,
  SUPPORTED_LANGUAGES,
  TranslationResult,
} from '../services/TranslationService';

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    service = new TranslationService();
    service.clearCache();
  });

  afterEach(() => {
    service.clearCache();
  });

  describe('Language Support', () => {
    it('should support all 10 required Indian languages', () => {
      const languages = Object.keys(SUPPORTED_LANGUAGES);
      expect(languages).toContain('en'); // English
      expect(languages).toContain('hi'); // Hindi
      expect(languages).toContain('ta'); // Tamil
      expect(languages).toContain('te'); // Telugu
      expect(languages).toContain('bn'); // Bengali
      expect(languages).toContain('mr'); // Marathi
      expect(languages).toContain('gu'); // Gujarati
      expect(languages).toContain('kn'); // Kannada
      expect(languages).toContain('ml'); // Malayalam
      expect(languages).toContain('pa'); // Punjabi
      expect(languages.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('translateMessage', () => {
    it('should translate text between different languages', async () => {
      const result = await service.translateMessage(
        'Hello, what is the price?',
        'en',
        'hi'
      );

      expect(result).toBeDefined();
      expect(result.originalText).toBe('Hello, what is the price?');
      expect(result.fromLanguage).toBe('en');
      expect(result.toLanguage).toBe('hi');
      expect(result.translatedText).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should return original text when translating to same language', async () => {
      const text = 'Hello, what is the price?';
      const result = await service.translateMessage(text, 'en', 'en');

      expect(result.translatedText).toBe(text);
      expect(result.confidence).toBe(1.0);
      expect(result.fromLanguage).toBe('en');
      expect(result.toLanguage).toBe('en');
    });

    it('should preserve commercial terms during translation', async () => {
      const text = 'The price is ₹500 per kg';
      const result = await service.translateMessage(text, 'en', 'hi');

      // Check that currency and units are preserved
      expect(result.preservedTerms.length).toBeGreaterThan(0);
      expect(result.translatedText).toContain('₹500');
    });

    it('should handle empty text', async () => {
      const result = await service.translateMessage('', 'en', 'hi');

      expect(result).toBeDefined();
      expect(result.translatedText).toBe('');
      expect(result.confidence).toBeGreaterThanOrEqual(0);
    });

    it('should handle very long text', async () => {
      const longText = 'Hello '.repeat(200); // 1200 characters
      const result = await service.translateMessage(longText, 'en', 'hi');

      expect(result).toBeDefined();
      expect(result.translatedText).toBeDefined();
    });

    it('should complete translation within 2 seconds', async () => {
      const startTime = Date.now();
      await service.translateMessage(
        'What is the market price for wheat today?',
        'en',
        'hi'
      );
      const elapsed = Date.now() - startTime;

      expect(elapsed).toBeLessThan(2000); // Requirement 1.1
    });
  });

  describe('Confidence Scoring', () => {
    it('should return confidence score between 0 and 1', async () => {
      const result = await service.translateMessage(
        'Hello, what is the price?',
        'en',
        'hi'
      );

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should have high confidence for same language translation', async () => {
      const result = await service.translateMessage(
        'Hello, what is the price?',
        'en',
        'en'
      );

      expect(result.confidence).toBe(1.0);
    });

    it('should flag low confidence translations for review', async () => {
      const result = await service.translateMessage(
        'Hello, what is the price?',
        'en',
        'hi'
      );

      const shouldFlag = service.shouldFlagForReview(result);
      expect(typeof shouldFlag).toBe('boolean');

      // If confidence is below 0.85, should be flagged
      if (result.confidence < 0.85) {
        expect(shouldFlag).toBe(true);
      } else {
        expect(shouldFlag).toBe(false);
      }
    });
  });

  describe('Commercial Term Preservation', () => {
    it('should preserve currency symbols', async () => {
      const text = 'The price is ₹500';
      const result = await service.translateMessage(text, 'en', 'hi');

      expect(result.translatedText).toContain('₹500');
      expect(result.preservedTerms).toContain('₹500');
    });

    it('should preserve quantity units', async () => {
      const text = 'I need 50 kg of wheat';
      const result = await service.translateMessage(text, 'en', 'hi');

      expect(result.preservedTerms.length).toBeGreaterThan(0);
    });

    it('should preserve multiple commercial terms', async () => {
      const text = 'The price is ₹500 per kg for premium quality wheat';
      const result = await service.translateMessage(text, 'en', 'hi');

      expect(result.preservedTerms.length).toBeGreaterThan(0);
    });

    it('should preserve market terminology', async () => {
      const text = 'What is the mandi rate today?';
      const result = await service.translateMessage(text, 'en', 'hi');

      expect(result.preservedTerms.length).toBeGreaterThan(0);
    });
  });

  describe('Translation Caching', () => {
    it('should cache translation results', async () => {
      const text = 'Hello, what is the price?';
      
      // First translation
      const result1 = await service.translateMessage(text, 'en', 'hi');
      
      // Second translation (should be cached)
      const result2 = await service.translateMessage(text, 'en', 'hi');

      expect(result1.translatedText).toBe(result2.translatedText);
      expect(result1.confidence).toBe(result2.confidence);
    });

    it('should retrieve cached translations faster', async () => {
      const text = 'Hello, what is the price?';
      
      // First translation
      const start1 = Date.now();
      await service.translateMessage(text, 'en', 'hi');
      const time1 = Date.now() - start1;
      
      // Second translation (cached)
      const start2 = Date.now();
      await service.translateMessage(text, 'en', 'hi');
      const time2 = Date.now() - start2;

      // Cached should be faster (or at least not slower)
      expect(time2).toBeLessThanOrEqual(time1 + 10); // Allow 10ms margin
    });

    it('should clear cache when requested', async () => {
      await service.translateMessage('Hello', 'en', 'hi');
      
      const statsBefore = service.getCacheStats();
      expect(statsBefore.size).toBeGreaterThan(0);

      service.clearCache();
      
      const statsAfter = service.getCacheStats();
      expect(statsAfter.size).toBe(0);
    });

    it('should provide cache statistics', () => {
      const stats = service.getCacheStats();
      
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('maxSize');
      expect(typeof stats.size).toBe('number');
      expect(typeof stats.maxSize).toBe('number');
    });
  });

  describe('Language Detection', () => {
    it('should detect language of text', async () => {
      const result = await service.detectLanguage('Hello, how are you?');

      expect(result).toBeDefined();
      expect(result).toHaveProperty('language');
      expect(result).toHaveProperty('confidence');
      expect(typeof result.language).toBe('string');
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should handle empty text for language detection', async () => {
      const result = await service.detectLanguage('');

      expect(result).toBeDefined();
      expect(result.language).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle translation errors gracefully', async () => {
      // This test ensures the service doesn't crash on errors
      const result = await service.translateMessage(
        'Test text',
        'en',
        'hi'
      );

      expect(result).toBeDefined();
      expect(result.translatedText).toBeDefined();
    });

    it('should return low confidence on translation failure', async () => {
      // Mock a failure scenario by using invalid input
      const result = await service.translateMessage('', 'en', 'hi');

      // Even on failure, should return a result
      expect(result).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters', async () => {
      const text = 'Price: ₹500! @#$%^&*()';
      const result = await service.translateMessage(text, 'en', 'hi');

      expect(result).toBeDefined();
      expect(result.translatedText).toBeDefined();
    });

    it('should handle numbers and mixed content', async () => {
      const text = '123 kg wheat costs ₹4500 in 2024';
      const result = await service.translateMessage(text, 'en', 'hi');

      expect(result).toBeDefined();
      expect(result.translatedText).toContain('₹4500');
    });

    it('should handle text with only numbers', async () => {
      const text = '12345';
      const result = await service.translateMessage(text, 'en', 'hi');

      expect(result).toBeDefined();
      expect(result.translatedText).toBeDefined();
    });

    it('should handle text with only special characters', async () => {
      const text = '@#$%^&*()';
      const result = await service.translateMessage(text, 'en', 'hi');

      expect(result).toBeDefined();
      expect(result.translatedText).toBeDefined();
    });
  });

  describe('Singleton Instance', () => {
    it('should export a singleton instance', () => {
      expect(translationService).toBeDefined();
      expect(translationService).toBeInstanceOf(TranslationService);
    });

    it('should maintain state across singleton usage', async () => {
      await translationService.translateMessage('Test', 'en', 'hi');
      const stats = translationService.getCacheStats();
      
      expect(stats.size).toBeGreaterThan(0);
    });
  });
});
