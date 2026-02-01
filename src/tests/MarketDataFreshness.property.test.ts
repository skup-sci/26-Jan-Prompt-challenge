// Property-Based Tests for Market Data Freshness
// Feature: multilingual-mandi-platform

import * as fc from 'fast-check';
import { PriceDiscoveryService } from '../services/PriceDiscoveryService';

describe('Market Data Freshness - Property Tests', () => {
  let service: PriceDiscoveryService;

  beforeEach(() => {
    service = new PriceDiscoveryService();
  });

  /**
   * Property 4: Market Data Freshness
   * **Validates: Requirements 2.4, 4.2**
   * 
   * For any commodity with active market data, price recommendations should 
   * update every 15 minutes, and price displays should refresh within 30 seconds 
   * of market data updates.
   */
  test('Property 4: Price recommendations include fresh timestamps', async () => {
    const commodityArb = fc.constantFrom(
      'wheat', 'rice', 'onion', 'potato', 'tomato'
    );
    
    const quantityArb = fc.integer({ min: 10, max: 500 });
    const locationArb = fc.constantFrom('Delhi', 'Mumbai', 'Bangalore');

    await fc.assert(
      fc.asyncProperty(
        commodityArb,
        quantityArb,
        locationArb,
        async (commodity, quantity, location) => {
          const beforeTime = new Date();
          
          const recommendation = await service.getPriceRecommendation(
            commodity,
            quantity,
            location
          );
          
          const afterTime = new Date();
          
          // Requirement 4.2: Data should be fresh (within 30 seconds)
          expect(recommendation.lastUpdated).toBeInstanceOf(Date);
          expect(recommendation.lastUpdated.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime() - 30000);
          expect(recommendation.lastUpdated.getTime()).toBeLessThanOrEqual(afterTime.getTime());
          
          // Data should be current
          const dataAge = afterTime.getTime() - recommendation.lastUpdated.getTime();
          expect(dataAge).toBeLessThan(30000); // Within 30 seconds
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 4 (Extended): Market trends reflect current data', async () => {
    const commodityArb = fc.constantFrom(
      'wheat', 'rice', 'cotton', 'soybean'
    );

    await fc.assert(
      fc.asyncProperty(
        commodityArb,
        async (commodity) => {
          const trend = await service.getMarketTrends(commodity, '30d');
          
          // Should have current price data
          expect(trend.currentPrice).toBeGreaterThan(0);
          expect(trend.historicalPrices.length).toBeGreaterThan(0);
          
          // Most recent historical price should match current price
          const mostRecentHistorical = trend.historicalPrices[trend.historicalPrices.length - 1];
          expect(mostRecentHistorical.price).toBe(trend.currentPrice);
          
          // Historical data should be ordered by date
          for (let i = 1; i < trend.historicalPrices.length; i++) {
            expect(trend.historicalPrices[i].date.getTime())
              .toBeGreaterThanOrEqual(trend.historicalPrices[i - 1].date.getTime());
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 4 (Extended): Market data updates are consistent', async () => {
    const commodityArb = fc.constantFrom('wheat', 'rice', 'onion');

    await fc.assert(
      fc.asyncProperty(
        commodityArb,
        async (commodity) => {
          // Get initial recommendation
          const rec1 = await service.getPriceRecommendation(commodity, 100, 'Delhi');
          
          // Trigger market data update
          await service.updateMarketData();
          
          // Get updated recommendation
          const rec2 = await service.getPriceRecommendation(commodity, 100, 'Delhi');
          
          // Both should have valid data
          expect(rec1.recommendedPrice).toBeGreaterThan(0);
          expect(rec2.recommendedPrice).toBeGreaterThan(0);
          
          // Prices should be in reasonable range (not wildly different)
          const priceDiff = Math.abs(rec2.recommendedPrice - rec1.recommendedPrice);
          const avgPrice = (rec1.recommendedPrice + rec2.recommendedPrice) / 2;
          const percentDiff = (priceDiff / avgPrice) * 100;
          
          // After update, prices shouldn't change more than 10% (reasonable market movement)
          expect(percentDiff).toBeLessThan(10);
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 4 (Extended): Volatility detection works correctly', async () => {
    const commodityArb = fc.constantFrom(
      'wheat', 'rice', 'onion', 'potato', 'tomato'
    );

    await fc.assert(
      fc.asyncProperty(
        commodityArb,
        async (commodity) => {
          const volatilityCheck = await service.checkVolatility(commodity);
          
          // Should return valid volatility data
          expect(volatilityCheck).toBeDefined();
          expect(typeof volatilityCheck.volatile).toBe('boolean');
          expect(typeof volatilityCheck.changePercent).toBe('number');
          expect(volatilityCheck.changePercent).toBeGreaterThanOrEqual(0);
          
          // If volatile, change should be > 10% (Requirement 2.5)
          if (volatilityCheck.volatile) {
            expect(volatilityCheck.changePercent).toBeGreaterThan(10);
          } else {
            expect(volatilityCheck.changePercent).toBeLessThanOrEqual(10);
          }
        }
      ),
      { numRuns: 20 }
    );
  });
});
