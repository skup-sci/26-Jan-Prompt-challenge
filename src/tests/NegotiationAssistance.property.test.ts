// Property-Based Tests for Negotiation Assistance
// Feature: multilingual-mandi-platform

import * as fc from 'fast-check';
import { NegotiationService } from '../services/NegotiationService';

describe('Negotiation Assistance - Property Tests', () => {
  let service: NegotiationService;

  beforeEach(() => {
    service = new NegotiationService();
  });

  /**
   * Property 6: Negotiation AI Assistance
   * **Validates: Requirements 3.1, 3.2, 3.3, 3.5**
   * 
   * For any negotiation session, the assistant should analyze both parties' 
   * historical patterns, provide real-time counter-offer suggestions based on 
   * market conditions, evaluate offers against current rates, and suggest 
   * compromise solutions when negotiations stall.
   */
  test('Property 6: Negotiation sessions are created with valid structure', async () => {
    const buyerIdArb = fc.string({ minLength: 3, maxLength: 20 });
    const sellerIdArb = fc.string({ minLength: 3, maxLength: 20 });
    const commodityArb = fc.constantFrom(
      'wheat', 'rice', 'onion', 'potato', 'tomato', 
      'cotton', 'sugarcane', 'turmeric', 'chili', 'soybean'
    );
    const quantityArb = fc.integer({ min: 1, max: 1000 });
    const initialPriceArb = fc.integer({ min: 10, max: 10000 });

    await fc.assert(
      fc.asyncProperty(
        buyerIdArb,
        sellerIdArb,
        commodityArb,
        quantityArb,
        initialPriceArb,
        async (buyerId, sellerId, commodity, quantity, initialPrice) => {
          // Requirement 3.1: Start negotiation with historical pattern analysis
          const session = await service.startNegotiation(
            buyerId,
            sellerId,
            commodity,
            quantity,
            initialPrice
          );

          // Verify session structure
          expect(session).toBeDefined();
          expect(session.sessionId).toBeTruthy();
          expect(session.buyerId).toBe(buyerId);
          expect(session.sellerId).toBe(sellerId);
          expect(session.commodity).toBe(commodity);
          expect(session.quantity).toBe(quantity);
          expect(session.status).toBe('active');
          expect(session.history).toEqual([]);
          expect(session.createdAt).toBeInstanceOf(Date);
          expect(session.updatedAt).toBeInstanceOf(Date);

          // If initial price provided, should have current offer
          if (initialPrice) {
            expect(session.currentOffer).toBeDefined();
            expect(session.currentOffer?.price).toBe(initialPrice);
            expect(session.currentOffer?.fromParty).toBe('buyer');
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 6: Offer analysis evaluates against market conditions', async () => {
    const commodityArb = fc.constantFrom('wheat', 'rice', 'onion', 'potato');
    const quantityArb = fc.integer({ min: 10, max: 500 });
    const marketPriceArb = fc.integer({ min: 100, max: 5000 });
    const offerPriceArb = fc.integer({ min: 50, max: 6000 });

    await fc.assert(
      fc.asyncProperty(
        commodityArb,
        quantityArb,
        marketPriceArb,
        offerPriceArb,
        async (commodity, quantity, marketPrice, offerPrice) => {
          // Create session
          const session = await service.startNegotiation(
            'buyer1',
            'seller1',
            commodity,
            quantity
          );

          // Make an offer
          const updatedSession = await service.makeOffer(
            session.sessionId,
            'buyer',
            offerPrice
          );

          // Requirement 3.3: Analyze offer against market rates
          const analysis = await service.analyzeOffer(
            session.sessionId,
            updatedSession.currentOffer!,
            marketPrice
          );

          // Verify analysis structure
          expect(analysis).toBeDefined();
          expect(['accept', 'reject', 'counter']).toContain(analysis.recommendation);
          expect(analysis.reasoning).toBeDefined();
          expect(analysis.reasoning.length).toBeGreaterThan(0);
          expect(analysis.marketComparison).toBeDefined();
          expect(analysis.marketComparison.offerPrice).toBe(offerPrice);
          expect(analysis.marketComparison.marketPrice).toBe(marketPrice);
          expect(analysis.marketComparison.difference).toBe(offerPrice - marketPrice);

          // Verify recommendation logic
          const diffPercent = Math.abs(analysis.marketComparison.differencePercent);
          
          if (diffPercent <= 3) {
            // Within 3% should recommend accept
            expect(analysis.recommendation).toBe('accept');
          } else if (diffPercent > 10) {
            // More than 10% should recommend reject
            expect(analysis.recommendation).toBe('reject');
            expect(analysis.suggestedCounterPrice).toBeDefined();
          } else {
            // Between 3-10% should recommend counter
            expect(analysis.recommendation).toBe('counter');
            expect(analysis.suggestedCounterPrice).toBeDefined();
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 6: Counter-offer suggestions are based on market conditions', async () => {
    const commodityArb = fc.constantFrom('wheat', 'rice', 'cotton');
    const quantityArb = fc.integer({ min: 10, max: 500 });
    const marketPriceArb = fc.integer({ min: 100, max: 5000 });
    
    await fc.assert(
      fc.asyncProperty(
        commodityArb,
        quantityArb,
        marketPriceArb,
        async (commodity, quantity, marketPrice) => {
          // Create session with offer that needs counter
          const offerPrice = marketPrice * 1.15; // 15% above market
          
          const session = await service.startNegotiation(
            'buyer1',
            'seller1',
            commodity,
            quantity,
            offerPrice
          );

          // Requirement 3.2: Provide real-time counter-offer suggestions
          const suggestion = await service.suggestCounterOffer(
            session.sessionId,
            session.currentOffer!,
            marketPrice
          );

          // Verify suggestion structure
          expect(suggestion).toBeDefined();
          expect(suggestion.suggestedPrice).toBeGreaterThan(0);
          expect(suggestion.reasoning).toBeDefined();
          expect(suggestion.reasoning.length).toBeGreaterThan(0);
          expect(suggestion.politeMessage).toBeDefined();
          expect(suggestion.politeMessage.length).toBeGreaterThan(0);

          // Requirement 3.5: Polite messaging
          expect(suggestion.politeMessage).toMatch(/thank|appreciate|hope|believe|propose|suggest/i);

          // Counter-offer should be reasonable (between offer and market)
          expect(suggestion.suggestedPrice).toBeLessThan(offerPrice);
          expect(suggestion.suggestedPrice).toBeGreaterThanOrEqual(marketPrice * 0.95);
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 6: Negotiation history tracks all events', async () => {
    const commodityArb = fc.constantFrom('wheat', 'rice');
    const quantityArb = fc.integer({ min: 10, max: 100 });
    const pricesArb = fc.array(fc.integer({ min: 100, max: 1000 }), { minLength: 2, maxLength: 5 });

    await fc.assert(
      fc.asyncProperty(
        commodityArb,
        quantityArb,
        pricesArb,
        async (commodity, quantity, prices) => {
          // Create session
          let session = await service.startNegotiation(
            'buyer1',
            'seller1',
            commodity,
            quantity
          );

          // Make multiple offers
          for (let i = 0; i < prices.length; i++) {
            const fromParty = i % 2 === 0 ? 'buyer' : 'seller';
            session = await service.makeOffer(
              session.sessionId,
              fromParty,
              prices[i]
            );
          }

          // Verify history tracking
          expect(session.history.length).toBe(prices.length);
          
          session.history.forEach((event, index) => {
            expect(event.eventId).toBeTruthy();
            expect(['offer', 'counter_offer']).toContain(event.type);
            expect(event.timestamp).toBeInstanceOf(Date);
            expect(event.data).toBeDefined();
          });

          // Verify current offer is the last one
          expect(session.currentOffer?.price).toBe(prices[prices.length - 1]);
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 6: Accepting offer completes negotiation', async () => {
    const commodityArb = fc.constantFrom('wheat', 'rice', 'onion');
    const quantityArb = fc.integer({ min: 10, max: 500 });
    const priceArb = fc.integer({ min: 100, max: 5000 });

    await fc.assert(
      fc.asyncProperty(
        commodityArb,
        quantityArb,
        priceArb,
        async (commodity, quantity, price) => {
          // Create session with offer
          const session = await service.startNegotiation(
            'buyer1',
            'seller1',
            commodity,
            quantity,
            price
          );

          // Accept the offer
          const deal = await service.acceptOffer(session.sessionId, 'seller');

          // Verify deal structure
          expect(deal).toBeDefined();
          expect(deal.dealId).toBeTruthy();
          expect(deal.sessionId).toBe(session.sessionId);
          expect(deal.buyerId).toBe('buyer1');
          expect(deal.sellerId).toBe('seller1');
          expect(deal.commodity).toBe(commodity);
          expect(deal.quantity).toBe(quantity);
          expect(deal.agreedPrice).toBe(price);
          expect(deal.completedAt).toBeInstanceOf(Date);

          // Verify session is completed
          const updatedSession = await service.getSession(session.sessionId);
          expect(updatedSession?.status).toBe('completed');
          expect(updatedSession?.history.length).toBeGreaterThan(0);
          
          // Last event should be acceptance
          const lastEvent = updatedSession?.history[updatedSession.history.length - 1];
          expect(lastEvent?.type).toBe('accept');
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 6: Rejecting offer maintains active session', async () => {
    const commodityArb = fc.constantFrom('wheat', 'rice');
    const quantityArb = fc.integer({ min: 10, max: 500 });
    const priceArb = fc.integer({ min: 100, max: 5000 });

    await fc.assert(
      fc.asyncProperty(
        commodityArb,
        quantityArb,
        priceArb,
        async (commodity, quantity, price) => {
          // Create session with offer
          const session = await service.startNegotiation(
            'buyer1',
            'seller1',
            commodity,
            quantity,
            price
          );

          // Reject the offer
          const updatedSession = await service.rejectOffer(
            session.sessionId,
            'seller',
            'Price too high'
          );

          // Verify session is still active
          expect(updatedSession.status).toBe('active');
          expect(updatedSession.history.length).toBeGreaterThan(0);
          
          // Last event should be rejection
          const lastEvent = updatedSession.history[updatedSession.history.length - 1];
          expect(lastEvent.type).toBe('reject');
          expect(lastEvent.fromParty).toBe('seller');
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 6: Multiple sessions can be managed independently', async () => {
    const commodityArb = fc.constantFrom('wheat', 'rice', 'onion');
    const quantityArb = fc.integer({ min: 10, max: 500 });
    const priceArb = fc.integer({ min: 100, max: 5000 });

    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            commodity: commodityArb,
            quantity: quantityArb,
            price: priceArb
          }),
          { minLength: 2, maxLength: 5 }
        ),
        async (sessionConfigs) => {
          const sessions = [];

          // Create multiple sessions
          for (const config of sessionConfigs) {
            const session = await service.startNegotiation(
              'buyer1',
              'seller1',
              config.commodity,
              config.quantity,
              config.price
            );
            sessions.push(session);
          }

          // Verify all sessions are independent
          const sessionIds = new Set(sessions.map(s => s.sessionId));
          expect(sessionIds.size).toBe(sessions.length); // All unique IDs

          // Verify each session maintains its own state
          for (let i = 0; i < sessions.length; i++) {
            const session = sessions[i];
            const config = sessionConfigs[i];
            
            expect(session.commodity).toBe(config.commodity);
            expect(session.quantity).toBe(config.quantity);
            expect(session.currentOffer?.price).toBe(config.price);
          }
        }
      ),
      { numRuns: 20 }
    );
  });
});
