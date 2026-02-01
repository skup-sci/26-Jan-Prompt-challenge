// Property-Based Tests for Price Discovery Service
// Feature: multilingual-mandi-platform

import * as fc from 'fast-check';
import { PriceDiscoveryService } from '../services/PriceDiscoveryService';

describe('Price Discovery Service - Property Tests', () => {
  let service: PriceDiscoveryService;

  beforeEach(() => {
    service = new PriceDiscoveryService();
  });

  /**
   * Property 3: Price Discovery Performance and Accuracy
   * **Validates: Requirements 2.1, 2.2, 2.3**
   * 
   * For any commodity type, quantity, and vendor location, price recommendations 
   * should be generated within 3 seconds and incorporate current market trends, 
   * seasonal variations, regional demand, vendor location, commodity quality, 
   * and historical data.
   */
  test('Property 3: Price recommendations complete within 3 seconds with market factors', async () => {
    const commodityArb = fc.constantFrom(
      'wheat', 'rice', 'onion', 'potato', 'tomato', 
      'cotton', 'sugarcane', 'turmeric', 'chili', 'soybean'
    );
    
    const quantityArb = fc.integer({ min: 1, max: 1000 });
    
    const locationArb = fc.constantFrom(
      'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata',
      'Pune', 'Jaipur', 'Lucknow', 'Ahmedabad', 'Hyderabad'
    );

    await fc.assert(
      fc.asyncProperty(
        commodityArb,
        quantityArb,
        locationArb,
        async (commodity, quantity, location) => {
          const startTime = Date.now();
          
          const recommendation = await service.getPriceRecommendation(
            commodity,
            quantity,
            location
          );
          
          const elapsedTime = Date.now() - startTime;
          
          // Requirement 2.1: Response within 3 seconds
          expect(elapsedTime).toBeLessThan(3000);
          
          // Requirement 2.2, 2.3: Incorporates market factors
          expect(recommendation).toBeDefined();
          expect(recommendation.commodity).toBeTruthy();
          expect(recommendation.recommendedPrice).toBeGreaterThan(0);
          expect(recommendation.priceRange.min).toBeGreaterThan(0);
          expect(recommendation.priceRange.max).toBeGreaterThan(recommendation.priceRange.min);
          expect(recommendation.confidence).toBeGreaterThan(0);
          expect(recommendation.confidence).toBeLessThanOrEqual(1);
          expect(recommendation.marketFactors.length).toBeGreaterThan(0);
          expect(recommendation.lastUpdated).toBeInstanceOf(Date);
          
          // Price range should be reasonable (within ±10% of recommended)
          const priceDiff = recommendation.priceRange.max - recommendation.priceRange.min;
          const avgPrice = (recommendation.priceRange.max + recommendation.priceRange.min) / 2;
          expect(priceDiff / avgPrice).toBeLessThan(0.15); // Max 15% range
        }
      ),
      { numRuns: 20 } // As specified: 20 iterations
    );
  });

  test('Property 3 (Extended): Market trends analysis includes historical data', async () => {
    const commodityArb = fc.constantFrom(
      'wheat', 'rice', 'onion', 'potato', 'tomato'
    );

    await fc.assert(
      fc.asyncProperty(
        commodityArb,
        async (commodity) => {
          const trends = await service.getMarketTrends(commodity, '30d');
          
          // Should include historical data (Requirement 2.2, 2.3)
          expect(trends).toBeDefined();
          expect(trends.commodity).toBeTruthy();
          expect(trends.currentPrice).toBeGreaterThan(0);
          expect(['rising', 'falling', 'stable']).toContain(trends.trend);
          expect(trends.historicalPrices.length).toBeGreaterThan(0);
          
          // Historical prices should be valid
          trends.historicalPrices.forEach(entry => {
            expect(entry.date).toBeInstanceOf(Date);
            expect(entry.price).toBeGreaterThan(0);
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 3 (Extended): Commodity search returns relevant results', async () => {
    const queryArb = fc.constantFrom(
      'wheat', 'rice', 'vegetable', 'grain', 'spice', ''
    );

    await fc.assert(
      fc.asyncProperty(
        queryArb,
        async (query) => {
          const results = await service.searchCommodities(query);
          
          // Should return valid commodity data (Requirement 4.1, 4.4)
          expect(Array.isArray(results)).toBe(true);
          
          if (query) {
            // Results should match query
            results.forEach(commodity => {
              const matchesQuery = 
                commodity.name.toLowerCase().includes(query.toLowerCase()) ||
                commodity.category.toLowerCase().includes(query.toLowerCase());
              expect(matchesQuery).toBe(true);
            });
          } else {
            // Empty query returns all commodities
            expect(results.length).toBeGreaterThan(0);
          }
          
          // All results should have valid structure
          results.forEach(commodity => {
            expect(commodity.id).toBeTruthy();
            expect(commodity.name).toBeTruthy();
            expect(commodity.category).toBeTruthy();
            expect(commodity.unit).toBeTruthy();
            expect(commodity.basePrice).toBeGreaterThan(0);
          });
        }
      ),
      { numRuns: 20 }
    );
  });
});
