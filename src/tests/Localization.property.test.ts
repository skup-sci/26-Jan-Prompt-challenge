/**
 * Property-Based Tests for UI Localization
 * Feature: multilingual-mandi-platform, Property 2: UI Localization Consistency
 * **Validates: Requirements 1.4**
 */

const fc = require('fast-check');
import { localizationService } from '../services/LocalizationService';
import { LanguageCode } from '../services/TranslationService';

describe('UI Localization Property Tests', () => {
  describe('Property 2: UI Localization Consistency', () => {
    /**
     * **Feature: multilingual-mandi-platform, Property 2: UI Localization Consistency**
     * **Validates: Requirements 1.4**
     * 
     * Property: For any supported language selection, all interface elements should be 
     * displayed in that language with proper formatting and cultural context.
     */
    
    test('All UI elements are translated for any supported language', () => {
      const languageCodeArb = fc.constantFrom<LanguageCode>(
        'en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa'
      );
      
      const uiKeyArb = fc.constantFrom(
        'nav.home',
        'nav.prices',
        'nav.negotiate',
        'action.search',
        'action.submit',
        'price.title',
        'negotiate.title',
        'settings.language',
        'message.welcome'
      );
      
      fc.assert(
        fc.property(
          languageCodeArb,
          uiKeyArb,
          (language: LanguageCode, key: string) => {
            localizationService.setLanguage(language);
            const text = localizationService.getText(key);
            
            // Assert: Text should be defined and non-empty
            expect(text).toBeDefined();
            expect(text.length).toBeGreaterThan(0);
            
            // Assert: Text should not be the key itself (means translation exists)
            expect(text).not.toBe(key);
            
            // Assert: Current language should be set correctly
            expect(localizationService.getCurrentLanguage()).toBe(language);
          }
        ),
        { numRuns: 20 }
      );
    });
    
    test('Language selection persists across service instances', () => {
      const languageCodeArb = fc.constantFrom<LanguageCode>(
        'en', 'hi', 'ta', 'te', 'bn'
      );
      
      fc.assert(
        fc.property(
          languageCodeArb,
          (language: LanguageCode) => {
            // Set language
            localizationService.setLanguage(language);
            
            // Verify it's set
            const currentLang = localizationService.getCurrentLanguage();
            expect(currentLang).toBe(language);
            
            // Verify it's stored in localStorage
            const stored = localStorage.getItem('mandi_preferred_language');
            expect(stored).toBe(language);
          }
        ),
        { numRuns: 20 }
      );
    });
    
    test('All 10 supported languages have complete translations', () => {
      const allLanguagesArb = fc.constantFrom<LanguageCode>(
        'en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa'
      );
      
      // Core UI keys that must exist in all languages
      const coreKeys = [
        'nav.home',
        'nav.prices',
        'action.search',
        'action.submit',
        'price.title',
        'settings.language',
        'message.loading',
        'message.welcome',
      ];
      
      fc.assert(
        fc.property(
          allLanguagesArb,
          (language: LanguageCode) => {
            localizationService.setLanguage(language);
            
            // Check all core keys have translations
            coreKeys.forEach((key) => {
              const text = localizationService.getText(key);
              
              // Assert: Translation exists and is not the key
              expect(text).toBeDefined();
              expect(text).not.toBe(key);
              expect(text.length).toBeGreaterThan(0);
            });
          }
        ),
        { numRuns: 20 }
      );
    });
    
    test('Language names are correctly returned for all supported languages', () => {
      const languageCodeArb = fc.constantFrom<LanguageCode>(
        'en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa'
      );
      
      fc.assert(
        fc.property(
          languageCodeArb,
          (language: LanguageCode) => {
            const name = localizationService.getLanguageName(language);
            
            // Assert: Language name should be defined and non-empty
            expect(name).toBeDefined();
            expect(name.length).toBeGreaterThan(0);
            
            // Assert: Language name should not be the code itself
            expect(name).not.toBe(language);
          }
        ),
        { numRuns: 20 }
      );
    });
    
    test('Available languages list contains all 10 supported languages', () => {
      const availableLanguages = localizationService.getAvailableLanguages();
      
      // Assert: Should have exactly 10 languages
      expect(availableLanguages).toHaveLength(10);
      
      // Assert: Each language should have code and name
      availableLanguages.forEach((lang) => {
        expect(lang).toHaveProperty('code');
        expect(lang).toHaveProperty('name');
        expect(lang.code).toBeDefined();
        expect(lang.name).toBeDefined();
        expect(lang.name.length).toBeGreaterThan(0);
      });
      
      // Assert: All expected languages are present
      const expectedCodes: LanguageCode[] = ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa'];
      expectedCodes.forEach((code) => {
        const found = availableLanguages.find((lang) => lang.code === code);
        expect(found).toBeDefined();
      });
    });
    
    test('Unsupported language defaults to English gracefully', () => {
      const invalidLanguageArb = fc.constantFrom(
        'xx' as LanguageCode,
        'zz' as LanguageCode,
        'invalid' as LanguageCode
      );
      
      fc.assert(
        fc.property(
          invalidLanguageArb,
          (invalidLang: LanguageCode) => {
            localizationService.setLanguage(invalidLang);
            
            // Assert: Should default to English
            const currentLang = localizationService.getCurrentLanguage();
            expect(currentLang).toBe('en');
            
            // Assert: Should still be able to get translations
            const text = localizationService.getText('nav.home');
            expect(text).toBe('Home');
          }
        ),
        { numRuns: 20 }
      );
    });
    
    test('getText returns fallback when key not found', () => {
      const languageCodeArb = fc.constantFrom<LanguageCode>('en', 'hi', 'ta');
      const invalidKeyArb = fc.constantFrom(
        'invalid.key',
        'nonexistent.text',
        'missing.translation'
      );
      const fallbackArb = fc.string({ minLength: 1, maxLength: 20 });
      
      fc.assert(
        fc.property(
          languageCodeArb,
          invalidKeyArb,
          fallbackArb,
          (language: LanguageCode, key: string, fallback: string) => {
            localizationService.setLanguage(language);
            const text = localizationService.getText(key, fallback);
            
            // Assert: Should return fallback or key
            expect(text).toBeDefined();
            expect([fallback, key]).toContain(text);
          }
        ),
        { numRuns: 20 }
      );
    });
  });
});
