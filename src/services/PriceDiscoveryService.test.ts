/**
 * Unit Tests for Price Discovery Service
 */

import { priceDiscoveryService, parseQuery, searchCommodity, getPrice } from './PriceDiscoveryService';

describe('PriceDiscoveryService', () => {
  describe('searchCommodity', () => {
    it('should find commodity by exact English name', () => {
      const result = searchCommodity('tomato');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Tomato');
    });

    it('should find commodity by Hindi name', () => {
      const result = searchCommodity('टमाटर');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Tomato');
    });

    it('should find commodity by alias', () => {
      const result = searchCommodity('pyaz');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Onion');
    });

    it('should handle case insensitivity', () => {
      const result = searchCommodity('ONION');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Onion');
    });

    it('should handle plural forms', () => {
      const result = searchCommodity('tomatoes');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Tomato');
    });

    it('should return null for non-existent commodity', () => {
      const result = searchCommodity('banana');
      expect(result).toBeNull();
    });

    it('should handle fuzzy matching', () => {
      const result = searchCommodity('tomatoe'); // Typo
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Tomato');
    });
  });

  describe('getPrice', () => {
    it('should return price result with conversational response', () => {
      const result = getPrice('onion');
      expect(result).not.toBeNull();
      expect(result?.commodity.name).toBe('Onion');
      expect(result?.conversationalResponse).toContain('Onion');
      expect(result?.conversationalResponse).toContain('₹');
      expect(result?.confidence).toBeGreaterThan(0);
    });

    it('should return null for non-existent commodity', () => {
      const result = getPrice('banana');
      expect(result).toBeNull();
    });

    it('should include price range in response', () => {
      const result = getPrice('tomato');
      expect(result?.conversationalResponse).toMatch(/₹\d+/);
    });

    it('should include unit in response', () => {
      const result = getPrice('wheat');
      expect(result?.conversationalResponse).toContain('quintal');
    });
  });

  describe('parseQuery', () => {
    it('should extract commodity from "onion price"', () => {
      const result = parseQuery('onion price');
      expect(result).toBe('onion');
    });

    it('should extract commodity from "what is tomato rate"', () => {
      const result = parseQuery('what is tomato rate');
      expect(result).toBe('tomato');
    });

    it('should extract commodity from "check wheat bhav"', () => {
      const result = parseQuery('check wheat bhav');
      expect(result).toBe('wheat');
    });

    it('should handle question marks', () => {
      const result = parseQuery('potato price?');
      expect(result).toBe('potato');
    });

    it('should handle mixed case', () => {
      const result = parseQuery('What is ONION price?');
      expect(result).toBe('onion');
    });
  });

  describe('getAllCommodities', () => {
    it('should return all commodities', () => {
      const commodities = priceDiscoveryService.getAllCommodities();
      expect(commodities.length).toBeGreaterThan(0);
      expect(commodities[0]).toHaveProperty('name');
      expect(commodities[0]).toHaveProperty('priceMin');
      expect(commodities[0]).toHaveProperty('priceMax');
    });
  });

  describe('getRelatedCommodities', () => {
    it('should return commodities from same category', () => {
      const related = priceDiscoveryService.getRelatedCommodities('tomato', 3);
      expect(related.length).toBeGreaterThan(0);
      expect(related.every(c => c.category === 'vegetable')).toBe(true);
      expect(related.every(c => c.id !== 'tomato')).toBe(true);
    });

    it('should limit results', () => {
      const related = priceDiscoveryService.getRelatedCommodities('tomato', 2);
      expect(related.length).toBeLessThanOrEqual(2);
    });
  });

  describe('getSuggestions', () => {
    it('should return suggestions for partial match', () => {
      const suggestions = priceDiscoveryService.getSuggestions('tom');
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0].name).toBe('Tomato');
    });

    it('should return empty array for very short input', () => {
      const suggestions = priceDiscoveryService.getSuggestions('t');
      expect(suggestions).toEqual([]);
    });

    it('should limit suggestions to 5', () => {
      const suggestions = priceDiscoveryService.getSuggestions('a');
      expect(suggestions.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Data Integrity', () => {
    it('all commodities should have valid price ranges', () => {
      const commodities = priceDiscoveryService.getAllCommodities();
      commodities.forEach(c => {
        expect(c.priceMin).toBeGreaterThan(0);
        expect(c.priceMax).toBeGreaterThanOrEqual(c.priceMin);
      });
    });

    it('all commodities should have valid units', () => {
      const commodities = priceDiscoveryService.getAllCommodities();
      commodities.forEach(c => {
        expect(['kg', 'quintal']).toContain(c.unit);
      });
    });

    it('all commodities should have valid trends', () => {
      const commodities = priceDiscoveryService.getAllCommodities();
      commodities.forEach(c => {
        expect(['up', 'down', 'stable']).toContain(c.trend);
      });
    });

    it('all commodities should have icons', () => {
      const commodities = priceDiscoveryService.getAllCommodities();
      commodities.forEach(c => {
        expect(c.icon).toBeTruthy();
        expect(c.icon.length).toBeGreaterThan(0);
      });
    });
  });
});
