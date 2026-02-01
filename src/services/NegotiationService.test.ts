/**
 * Unit Tests for Negotiation Service
 */

import {
  getNegotiationSuggestion,
  getPoliteResponseTemplate,
  isNegotiationStalled,
  suggestCompromise,
  getNegotiationTips,
  NegotiationContext
} from './NegotiationService';

describe('NegotiationService', () => {
  describe('getNegotiationSuggestion', () => {
    it('should suggest counter for high offer', () => {
      const context: NegotiationContext = {
        commodity: 'tomato',
        marketPrice: 20,
        currentOffer: 25, // 25% above market
        previousOffers: [],
        userLanguage: 'en',
        vendorLanguage: 'hi'
      };
      
      const suggestion = getNegotiationSuggestion(context);
      
      expect(suggestion.type).toBe('counter');
      expect(suggestion.suggestedPrice).toBeLessThan(25);
      expect(suggestion.message).toContain('politely counter');
      expect(suggestion.tone).toBe('polite');
    });

    it('should suggest reject for very low offer', () => {
      const context: NegotiationContext = {
        commodity: 'onion',
        marketPrice: 16,
        currentOffer: 10, // 37.5% below market
        previousOffers: [],
        userLanguage: 'en',
        vendorLanguage: 'hi'
      };
      
      const suggestion = getNegotiationSuggestion(context);
      
      expect(suggestion.type).toBe('reject');
      expect(suggestion.suggestedPrice).toBeGreaterThan(10);
      expect(suggestion.message).toContain('too low');
    });

    it('should suggest accept for fair offer after countering', () => {
      const context: NegotiationContext = {
        commodity: 'potato',
        marketPrice: 14,
        currentOffer: 14.5, // Very close to market
        previousOffers: [12, 13],
        userLanguage: 'en',
        vendorLanguage: 'hi'
      };
      
      const suggestion = getNegotiationSuggestion(context);
      
      expect(suggestion.type).toBe('accept');
      expect(suggestion.message).toContain('fair');
    });

    it('should provide info when no market price available', () => {
      const context: NegotiationContext = {
        commodity: 'unknown-commodity',
        currentOffer: 100,
        previousOffers: [],
        userLanguage: 'en',
        vendorLanguage: 'hi'
      };
      
      const suggestion = getNegotiationSuggestion(context);
      
      expect(suggestion.type).toBe('info');
      expect(suggestion.message).toBeTruthy();
    });

    it('should use market price from service if not provided', () => {
      const context: NegotiationContext = {
        commodity: 'tomato',
        // No marketPrice provided
        currentOffer: 25,
        previousOffers: [],
        userLanguage: 'en',
        vendorLanguage: 'hi'
      };
      
      const suggestion = getNegotiationSuggestion(context);
      
      expect(suggestion).toBeTruthy();
      expect(suggestion.type).toBeDefined();
    });

    it('should suggest firmer tone after multiple counters', () => {
      const context: NegotiationContext = {
        commodity: 'wheat',
        marketPrice: 2175,
        currentOffer: 1800, // Still too low
        previousOffers: [1500, 1600, 1700],
        userLanguage: 'en',
        vendorLanguage: 'hi'
      };
      
      const suggestion = getNegotiationSuggestion(context);
      
      expect(suggestion.type).toBe('counter');
      expect(suggestion.tone).toBe('firm');
    });
  });

  describe('getPoliteResponseTemplate', () => {
    it('should return English template for counter', () => {
      const suggestion = {
        type: 'counter' as const,
        message: 'Test',
        suggestedPrice: 20,
        reasoning: 'Test',
        tone: 'polite' as const
      };
      
      const template = getPoliteResponseTemplate(suggestion, 'en');
      
      expect(template).toContain('₹20');
      expect(template.length).toBeGreaterThan(0);
    });

    it('should return Hindi template for counter', () => {
      const suggestion = {
        type: 'counter' as const,
        message: 'Test',
        suggestedPrice: 20,
        reasoning: 'Test',
        tone: 'polite' as const
      };
      
      const template = getPoliteResponseTemplate(suggestion, 'hi');
      
      expect(template).toContain('₹20');
      expect(template).toMatch(/[\u0900-\u097F]/); // Contains Devanagari script
    });

    it('should return template for accept', () => {
      const suggestion = {
        type: 'accept' as const,
        message: 'Test',
        reasoning: 'Test',
        tone: 'polite' as const
      };
      
      const template = getPoliteResponseTemplate(suggestion, 'en');
      
      expect(template).toBeTruthy();
      expect(template.length).toBeGreaterThan(0);
    });

    it('should return template for reject', () => {
      const suggestion = {
        type: 'reject' as const,
        message: 'Test',
        suggestedPrice: 25,
        reasoning: 'Test',
        tone: 'polite' as const
      };
      
      const template = getPoliteResponseTemplate(suggestion, 'en');
      
      expect(template).toContain('₹25');
    });

    it('should fallback to English for unsupported language', () => {
      const suggestion = {
        type: 'counter' as const,
        message: 'Test',
        suggestedPrice: 20,
        reasoning: 'Test',
        tone: 'polite' as const
      };
      
      const template = getPoliteResponseTemplate(suggestion, 'fr');
      
      expect(template).toBeTruthy();
      expect(template).toContain('₹20');
    });
  });

  describe('isNegotiationStalled', () => {
    it('should return false for less than 3 offers', () => {
      expect(isNegotiationStalled([100, 105])).toBe(false);
    });

    it('should return true when last 3 offers are very similar', () => {
      const offers = [100, 110, 120, 121, 122, 121.5];
      expect(isNegotiationStalled(offers)).toBe(true);
    });

    it('should return false when offers are still changing significantly', () => {
      const offers = [100, 110, 120, 130];
      expect(isNegotiationStalled(offers)).toBe(false);
    });

    it('should handle exactly 3 offers', () => {
      const stalledOffers = [100, 101, 100.5];
      const changingOffers = [100, 110, 120];
      
      expect(isNegotiationStalled(stalledOffers)).toBe(true);
      expect(isNegotiationStalled(changingOffers)).toBe(false);
    });
  });

  describe('suggestCompromise', () => {
    it('should suggest midpoint between two offers', () => {
      const suggestion = suggestCompromise(100, 120);
      
      expect(suggestion.type).toBe('counter');
      expect(suggestion.suggestedPrice).toBe(110);
      expect(suggestion.message).toContain('middle');
    });

    it('should round midpoint to nearest integer', () => {
      const suggestion = suggestCompromise(100, 121);
      
      expect(suggestion.suggestedPrice).toBe(111); // Rounded from 110.5
    });

    it('should have polite tone', () => {
      const suggestion = suggestCompromise(100, 120);
      
      expect(suggestion.tone).toBe('polite');
    });
  });

  describe('getNegotiationTips', () => {
    it('should return English tips by default', () => {
      const tips = getNegotiationTips();
      
      expect(tips.length).toBeGreaterThan(0);
      expect(tips[0]).toContain('polite');
    });

    it('should return Hindi tips when requested', () => {
      const tips = getNegotiationTips('hi');
      
      expect(tips.length).toBeGreaterThan(0);
      expect(tips[0]).toMatch(/[\u0900-\u097F]/); // Contains Devanagari
    });

    it('should fallback to English for unsupported language', () => {
      const tips = getNegotiationTips('fr');
      
      expect(tips.length).toBeGreaterThan(0);
      expect(tips[0]).not.toMatch(/[\u0900-\u097F]/);
    });

    it('should return multiple tips', () => {
      const tips = getNegotiationTips('en');
      
      expect(tips.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Suggestion Quality', () => {
    it('all suggestions should have required fields', () => {
      const contexts: NegotiationContext[] = [
        {
          commodity: 'tomato',
          marketPrice: 20,
          currentOffer: 25,
          previousOffers: [],
          userLanguage: 'en',
          vendorLanguage: 'hi'
        },
        {
          commodity: 'onion',
          marketPrice: 16,
          currentOffer: 10,
          previousOffers: [],
          userLanguage: 'en',
          vendorLanguage: 'hi'
        },
        {
          commodity: 'wheat',
          marketPrice: 2175,
          currentOffer: 2200,
          previousOffers: [2100],
          userLanguage: 'en',
          vendorLanguage: 'hi'
        }
      ];
      
      contexts.forEach(context => {
        const suggestion = getNegotiationSuggestion(context);
        
        expect(suggestion.type).toBeDefined();
        expect(suggestion.message).toBeTruthy();
        expect(suggestion.reasoning).toBeTruthy();
        expect(suggestion.tone).toBeDefined();
      });
    });

    it('suggested prices should be reasonable', () => {
      const context: NegotiationContext = {
        commodity: 'tomato',
        marketPrice: 20,
        currentOffer: 30,
        previousOffers: [],
        userLanguage: 'en',
        vendorLanguage: 'hi'
      };
      
      const suggestion = getNegotiationSuggestion(context);
      
      if (suggestion.suggestedPrice) {
        expect(suggestion.suggestedPrice).toBeGreaterThan(0);
        expect(suggestion.suggestedPrice).toBeLessThan(100); // Reasonable for tomato
      }
    });
  });
});
