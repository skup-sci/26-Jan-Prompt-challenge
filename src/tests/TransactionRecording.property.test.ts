// Property-Based Tests for Transaction Recording
// Feature: multilingual-mandi-platform

import * as fc from 'fast-check';
import { TransactionService } from '../services/TransactionService';

describe('Transaction Recording - Property Tests', () => {
  let service: TransactionService;

  beforeEach(async () => {
    service = new TransactionService();
    // Clear localStorage to ensure clean state
    localStorage.clear();
    // Clear all transactions before each test
    await service.clearAllTransactions();
  });

  afterEach(async () => {
    // Clean up after each test
    await service.clearAllTransactions();
    localStorage.clear();
  });

  /**
   * Property 16: Transaction Recording Completeness
   * **Validates: Requirements 7.1**
   * 
   * For any completed trade, all transaction details including commodity, 
   * quantity, price, and parties should be automatically recorded with 
   * complete accuracy.
   */
  test('Property 16: All transaction details are recorded accurately', async () => {
    const buyerIdArb = fc.string({ minLength: 3, maxLength: 20 });
    const sellerIdArb = fc.string({ minLength: 3, maxLength: 20 });
    const commodityArb = fc.constantFrom(
      'wheat', 'rice', 'onion', 'potato', 'tomato', 
      'cotton', 'sugarcane', 'turmeric', 'chili', 'soybean'
    );
    const quantityArb = fc.integer({ min: 1, max: 1000 });
    const priceArb = fc.integer({ min: 10, max: 10000 });

    await fc.assert(
      fc.asyncProperty(
        buyerIdArb,
        sellerIdArb,
        commodityArb,
        quantityArb,
        priceArb,
        async (buyerId, sellerId, commodity, quantity, price) => {
          // Requirement 7.1: Record transaction with all details
          const transaction = await service.recordTransaction(
            buyerId,
            sellerId,
            commodity,
            quantity,
            price
          );

          // Verify all required fields are recorded
          expect(transaction).toBeDefined();
          expect(transaction.id).toBeTruthy();
          expect(transaction.buyerId).toBe(buyerId);
          expect(transaction.sellerId).toBe(sellerId);
          expect(transaction.commodity).toBe(commodity);
          expect(transaction.quantity).toBe(quantity);
          expect(transaction.agreedPrice).toBe(price);
          expect(transaction.totalAmount).toBe(quantity * price);
          expect(transaction.status).toBe('pending');
          expect(transaction.createdAt).toBeInstanceOf(Date);

          // Verify transaction can be retrieved
          const retrieved = await service.getTransaction(transaction.id);
          expect(retrieved).toBeDefined();
          expect(retrieved?.id).toBe(transaction.id);
          expect(retrieved?.buyerId).toBe(buyerId);
          expect(retrieved?.sellerId).toBe(sellerId);
          expect(retrieved?.commodity).toBe(commodity);
          expect(retrieved?.quantity).toBe(quantity);
          expect(retrieved?.agreedPrice).toBe(price);
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 16: Transaction completion is recorded with timestamp', async () => {
    const commodityArb = fc.constantFrom('wheat', 'rice', 'onion');
    const quantityArb = fc.integer({ min: 10, max: 500 });
    const priceArb = fc.integer({ min: 100, max: 5000 });

    await fc.assert(
      fc.asyncProperty(
        commodityArb,
        quantityArb,
        priceArb,
        async (commodity, quantity, price) => {
          // Record transaction
          const transaction = await service.recordTransaction(
            'buyer1',
            'seller1',
            commodity,
            quantity,
            price
          );

          const beforeComplete = new Date();

          // Complete transaction
          const completed = await service.completeTransaction(transaction.id);

          const afterComplete = new Date();

          // Verify completion details
          expect(completed.status).toBe('completed');
          expect(completed.completedAt).toBeInstanceOf(Date);
          expect(completed.completedAt!.getTime()).toBeGreaterThanOrEqual(beforeComplete.getTime());
          expect(completed.completedAt!.getTime()).toBeLessThanOrEqual(afterComplete.getTime());

          // Verify all original details are preserved
          expect(completed.buyerId).toBe(transaction.buyerId);
          expect(completed.sellerId).toBe(transaction.sellerId);
          expect(completed.commodity).toBe(transaction.commodity);
          expect(completed.quantity).toBe(transaction.quantity);
          expect(completed.agreedPrice).toBe(transaction.agreedPrice);
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 16: Multiple transactions are recorded independently', async () => {
    const transactionConfigArb = fc.array(
      fc.record({
        buyerId: fc.string({ minLength: 3, maxLength: 10 }),
        sellerId: fc.string({ minLength: 3, maxLength: 10 }),
        commodity: fc.constantFrom('wheat', 'rice', 'onion', 'potato'),
        quantity: fc.integer({ min: 10, max: 500 }),
        price: fc.integer({ min: 100, max: 5000 })
      }),
      { minLength: 2, maxLength: 10 }
    );

    await fc.assert(
      fc.asyncProperty(
        transactionConfigArb,
        async (configs) => {
          const transactions = [];

          // Record multiple transactions
          for (const config of configs) {
            const transaction = await service.recordTransaction(
              config.buyerId,
              config.sellerId,
              config.commodity,
              config.quantity,
              config.price
            );
            transactions.push(transaction);
          }

          // Verify all transactions are recorded independently
          expect(transactions.length).toBe(configs.length);

          // All transaction IDs should be unique
          const ids = new Set(transactions.map(t => t.id));
          expect(ids.size).toBe(transactions.length);

          // Each transaction should maintain its own data
          for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];
            const config = configs[i];

            expect(transaction.buyerId).toBe(config.buyerId);
            expect(transaction.sellerId).toBe(config.sellerId);
            expect(transaction.commodity).toBe(config.commodity);
            expect(transaction.quantity).toBe(config.quantity);
            expect(transaction.agreedPrice).toBe(config.price);
            expect(transaction.totalAmount).toBe(config.quantity * config.price);
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 16: Transaction filtering works correctly', async () => {
    const userIdArb = fc.constantFrom('user1', 'user2', 'user3');
    const commodityArb = fc.constantFrom('wheat', 'rice', 'onion');
    const quantityArb = fc.integer({ min: 10, max: 100 });
    const priceArb = fc.integer({ min: 100, max: 1000 });

    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            buyerId: userIdArb,
            sellerId: userIdArb,
            commodity: commodityArb,
            quantity: quantityArb,
            price: priceArb
          }),
          { minLength: 5, maxLength: 15 }
        ),
        async (configs) => {
          // Record transactions
          for (const config of configs) {
            await service.recordTransaction(
              config.buyerId,
              config.sellerId,
              config.commodity,
              config.quantity,
              config.price
            );
          }

          // Test filtering by user
          const testUserId = 'user1';
          const userTransactions = await service.getUserTransactions(testUserId);
          
          // All returned transactions should involve the user
          userTransactions.forEach(t => {
            expect(t.buyerId === testUserId || t.sellerId === testUserId).toBe(true);
          });

          // Test filtering by commodity
          const testCommodity = 'wheat';
          const commodityTransactions = await service.getTransactions({
            commodity: testCommodity
          });
          
          // All returned transactions should match the commodity
          commodityTransactions.forEach(t => {
            expect(t.commodity.toLowerCase()).toContain(testCommodity.toLowerCase());
          });

          // Test filtering by status
          const pendingTransactions = await service.getTransactions({
            status: 'pending'
          });
          
          // All returned transactions should be pending
          pendingTransactions.forEach(t => {
            expect(t.status).toBe('pending');
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 16: Transaction ratings are recorded correctly', async () => {
    const commodityArb = fc.constantFrom('wheat', 'rice', 'onion');
    const quantityArb = fc.integer({ min: 10, max: 500 });
    const priceArb = fc.integer({ min: 100, max: 5000 });
    const ratingArb = fc.integer({ min: 1, max: 5 });

    await fc.assert(
      fc.asyncProperty(
        commodityArb,
        quantityArb,
        priceArb,
        ratingArb,
        ratingArb,
        async (commodity, quantity, price, buyerRating, sellerRating) => {
          // Record and complete transaction
          const transaction = await service.recordTransaction(
            'buyer1',
            'seller1',
            commodity,
            quantity,
            price
          );

          await service.completeTransaction(transaction.id);

          // Add buyer rating
          const withBuyerRating = await service.rateTransaction(
            transaction.id,
            'buyer',
            buyerRating
          );

          expect(withBuyerRating.ratings?.buyerRating).toBe(buyerRating);

          // Add seller rating
          const withBothRatings = await service.rateTransaction(
            transaction.id,
            'seller',
            sellerRating
          );

          expect(withBothRatings.ratings?.buyerRating).toBe(buyerRating);
          expect(withBothRatings.ratings?.sellerRating).toBe(sellerRating);
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 16: Transaction summary calculates correctly', async () => {
    const commodityArb = fc.constantFrom('wheat', 'rice', 'onion');
    const quantityArb = fc.integer({ min: 10, max: 100 });
    const priceArb = fc.integer({ min: 100, max: 1000 });

    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            commodity: commodityArb,
            quantity: quantityArb,
            price: priceArb
          }),
          { minLength: 3, maxLength: 10 }
        ),
        async (configs) => {
          // Clear before each property test iteration
          await service.clearAllTransactions();
          
          const userId = 'testUser';
          const transactions = [];

          // Record and complete transactions
          for (const config of configs) {
            const transaction = await service.recordTransaction(
              userId,
              'seller1',
              config.commodity,
              config.quantity,
              config.price
            );
            await service.completeTransaction(transaction.id);
            transactions.push(transaction);
          }

          // Get summary
          const summary = await service.getTransactionSummary(userId);

          // Verify summary calculations
          expect(summary.totalTransactions).toBe(configs.length);

          const expectedVolume = configs.reduce((sum, c) => sum + c.quantity, 0);
          expect(summary.totalVolume).toBe(expectedVolume);

          const expectedValue = configs.reduce((sum, c) => sum + (c.quantity * c.price), 0);
          expect(summary.totalValue).toBe(expectedValue);

          const expectedAvgPrice = expectedValue / expectedVolume;
          // Use toBeCloseTo for floating point comparison
          expect(summary.averagePrice).toBeCloseTo(expectedAvgPrice, 2);

          const uniqueCommodities = new Set(configs.map(c => c.commodity));
          expect(summary.commodities.length).toBe(uniqueCommodities.size);
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 16: Commodity analytics are calculated correctly', async () => {
    const commodityArb = fc.constantFrom('wheat', 'rice', 'onion');
    const quantityArb = fc.integer({ min: 10, max: 100 });
    const priceArb = fc.integer({ min: 100, max: 1000 });

    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            commodity: commodityArb,
            quantity: quantityArb,
            price: priceArb
          }),
          { minLength: 5, maxLength: 15 }
        ),
        async (configs) => {
          // Clear before each property test iteration
          await service.clearAllTransactions();
          
          const userId = 'testUser';

          // Record and complete transactions
          for (const config of configs) {
            const transaction = await service.recordTransaction(
              userId,
              'seller1',
              config.commodity,
              config.quantity,
              config.price
            );
            await service.completeTransaction(transaction.id);
          }

          // Get commodity analytics
          const analytics = await service.getCommodityAnalytics(userId);

          // Verify analytics structure
          expect(Array.isArray(analytics)).toBe(true);
          expect(analytics.length).toBeGreaterThan(0);

          // Verify each commodity's analytics
          analytics.forEach(item => {
            expect(item.commodity).toBeTruthy();
            expect(item.totalTransactions).toBeGreaterThan(0);
            expect(item.totalVolume).toBeGreaterThan(0);
            expect(item.totalValue).toBeGreaterThan(0);
            
            // Use toBeCloseTo for floating point comparison
            const expectedAvgPrice = item.totalValue / item.totalVolume;
            expect(item.averagePrice).toBeCloseTo(expectedAvgPrice, 2);

            // Verify calculations match actual data
            const commodityConfigs = configs.filter(c => c.commodity === item.commodity);
            expect(item.totalTransactions).toBe(commodityConfigs.length);

            const expectedVolume = commodityConfigs.reduce((sum, c) => sum + c.quantity, 0);
            expect(item.totalVolume).toBe(expectedVolume);

            const expectedValue = commodityConfigs.reduce((sum, c) => sum + (c.quantity * c.price), 0);
            expect(item.totalValue).toBe(expectedValue);
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 16: Transaction cancellation preserves original data', async () => {
    const commodityArb = fc.constantFrom('wheat', 'rice', 'onion');
    const quantityArb = fc.integer({ min: 10, max: 500 });
    const priceArb = fc.integer({ min: 100, max: 5000 });

    await fc.assert(
      fc.asyncProperty(
        commodityArb,
        quantityArb,
        priceArb,
        async (commodity, quantity, price) => {
          // Record transaction
          const transaction = await service.recordTransaction(
            'buyer1',
            'seller1',
            commodity,
            quantity,
            price
          );

          // Cancel transaction
          const cancelled = await service.cancelTransaction(
            transaction.id,
            'Buyer changed mind'
          );

          // Verify status changed but data preserved
          expect(cancelled.status).toBe('cancelled');
          expect(cancelled.buyerId).toBe(transaction.buyerId);
          expect(cancelled.sellerId).toBe(transaction.sellerId);
          expect(cancelled.commodity).toBe(transaction.commodity);
          expect(cancelled.quantity).toBe(transaction.quantity);
          expect(cancelled.agreedPrice).toBe(transaction.agreedPrice);
          expect(cancelled.totalAmount).toBe(transaction.totalAmount);
        }
      ),
      { numRuns: 20 }
    );
  });
});
