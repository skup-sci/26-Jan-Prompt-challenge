// Transaction Service for Multilingual Mandi Platform
// Handles transaction recording and history management
// Requirements: 7.1

export interface Transaction {
  id: string;
  buyerId: string;
  sellerId: string;
  commodity: string;
  quantity: number;
  agreedPrice: number;
  totalAmount: number;
  qualitySpecs?: Record<string, any>;
  negotiationSessionId?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
  ratings?: {
    buyerRating?: number;
    sellerRating?: number;
  };
  metadata?: {
    location?: string;
    deliveryDate?: Date;
    paymentMethod?: string;
    notes?: string;
    cancellationReason?: string;
  };
}

export interface TransactionSummary {
  totalTransactions: number;
  totalVolume: number;
  totalValue: number;
  averagePrice: number;
  commodities: string[];
  dateRange: {
    from: Date;
    to: Date;
  };
}

export interface TransactionFilter {
  userId?: string;
  commodity?: string;
  status?: 'pending' | 'completed' | 'cancelled';
  dateFrom?: Date;
  dateTo?: Date;
}

// Simple transaction storage
class TransactionStore {
  private transactions: Map<string, Transaction> = new Map();

  saveTransaction(transaction: Transaction): void {
    this.transactions.set(transaction.id, transaction);
    
    // Also save to localStorage for persistence
    this.saveToLocalStorage();
  }

  getTransaction(id: string): Transaction | undefined {
    return this.transactions.get(id);
  }

  getAllTransactions(): Transaction[] {
    return Array.from(this.transactions.values());
  }

  getTransactionsByFilter(filter: TransactionFilter): Transaction[] {
    let results = this.getAllTransactions();

    if (filter.userId) {
      results = results.filter(
        t => t.buyerId === filter.userId || t.sellerId === filter.userId
      );
    }

    if (filter.commodity) {
      results = results.filter(
        t => t.commodity.toLowerCase().includes(filter.commodity!.toLowerCase())
      );
    }

    if (filter.status) {
      results = results.filter(t => t.status === filter.status);
    }

    if (filter.dateFrom) {
      results = results.filter(t => t.createdAt >= filter.dateFrom!);
    }

    if (filter.dateTo) {
      results = results.filter(t => t.createdAt <= filter.dateTo!);
    }

    return results;
  }

  updateTransaction(id: string, updates: Partial<Transaction>): void {
    const transaction = this.transactions.get(id);
    if (transaction) {
      Object.assign(transaction, updates);
      this.transactions.set(id, transaction);
      this.saveToLocalStorage();
    }
  }

  deleteTransaction(id: string): void {
    this.transactions.delete(id);
    this.saveToLocalStorage();
  }

  clearAll(): void {
    this.transactions.clear();
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    try {
      const data = Array.from(this.transactions.values());
      localStorage.setItem('mandi_transactions', JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save transactions to localStorage:', err);
    }
  }

  loadFromLocalStorage(): void {
    try {
      const data = localStorage.getItem('mandi_transactions');
      if (data) {
        const transactions: Transaction[] = JSON.parse(data);
        transactions.forEach(t => {
          // Convert date strings back to Date objects
          t.createdAt = new Date(t.createdAt);
          if (t.completedAt) t.completedAt = new Date(t.completedAt);
          this.transactions.set(t.id, t);
        });
      }
    } catch (err) {
      console.error('Failed to load transactions from localStorage:', err);
    }
  }
}

const transactionStore = new TransactionStore();
// Don't load from localStorage on initialization for tests
if (typeof process === 'undefined' || process.env.NODE_ENV !== 'test') {
  transactionStore.loadFromLocalStorage();
}

export class TransactionService {
  private generateId(): string {
    return `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Record a new transaction
   * Requirement 7.1: Automatically record transaction details
   */
  async recordTransaction(
    buyerId: string,
    sellerId: string,
    commodity: string,
    quantity: number,
    agreedPrice: number,
    negotiationSessionId?: string,
    metadata?: Transaction['metadata']
  ): Promise<Transaction> {
    const transaction: Transaction = {
      id: this.generateId(),
      buyerId,
      sellerId,
      commodity,
      quantity,
      agreedPrice,
      totalAmount: quantity * agreedPrice,
      negotiationSessionId,
      status: 'pending',
      createdAt: new Date(),
      metadata
    };

    transactionStore.saveTransaction(transaction);
    return transaction;
  }

  /**
   * Complete a transaction
   * Requirement 7.1: Record completion details
   */
  async completeTransaction(
    transactionId: string,
    qualitySpecs?: Record<string, any>
  ): Promise<Transaction> {
    const transaction = transactionStore.getTransaction(transactionId);
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status === 'completed') {
      throw new Error('Transaction already completed');
    }

    transactionStore.updateTransaction(transactionId, {
      status: 'completed',
      completedAt: new Date(),
      qualitySpecs
    });

    return transactionStore.getTransaction(transactionId)!;
  }

  /**
   * Cancel a transaction
   */
  async cancelTransaction(transactionId: string, reason?: string): Promise<Transaction> {
    const transaction = transactionStore.getTransaction(transactionId);
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status === 'completed') {
      throw new Error('Cannot cancel completed transaction');
    }

    transactionStore.updateTransaction(transactionId, {
      status: 'cancelled',
      metadata: {
        ...transaction.metadata,
        cancellationReason: reason
      }
    });

    return transactionStore.getTransaction(transactionId)!;
  }

  /**
   * Add rating to a transaction
   * Requirement 5.1: Allow transaction rating
   */
  async rateTransaction(
    transactionId: string,
    ratingBy: 'buyer' | 'seller',
    rating: number
  ): Promise<Transaction> {
    const transaction = transactionStore.getTransaction(transactionId);
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== 'completed') {
      throw new Error('Can only rate completed transactions');
    }

    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const ratings = transaction.ratings || {};
    if (ratingBy === 'buyer') {
      ratings.buyerRating = rating;
    } else {
      ratings.sellerRating = rating;
    }

    transactionStore.updateTransaction(transactionId, { ratings });

    return transactionStore.getTransaction(transactionId)!;
  }

  /**
   * Get transaction by ID
   */
  async getTransaction(transactionId: string): Promise<Transaction | undefined> {
    return transactionStore.getTransaction(transactionId);
  }

  /**
   * Get all transactions for a user
   * Requirement 7.1: Transaction history view
   */
  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return transactionStore.getTransactionsByFilter({ userId });
  }

  /**
   * Get transactions by filter
   */
  async getTransactions(filter: TransactionFilter): Promise<Transaction[]> {
    return transactionStore.getTransactionsByFilter(filter);
  }

  /**
   * Get transaction summary for a user
   * Requirement 7.2: Trading reports and analytics
   */
  async getTransactionSummary(
    userId: string,
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<TransactionSummary> {
    const transactions = transactionStore.getTransactionsByFilter({
      userId,
      status: 'completed',
      dateFrom,
      dateTo
    });

    if (transactions.length === 0) {
      return {
        totalTransactions: 0,
        totalVolume: 0,
        totalValue: 0,
        averagePrice: 0,
        commodities: [],
        dateRange: {
          from: dateFrom || new Date(),
          to: dateTo || new Date()
        }
      };
    }

    const totalVolume = transactions.reduce((sum, t) => sum + t.quantity, 0);
    const totalValue = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const commodities = [...new Set(transactions.map(t => t.commodity))];

    return {
      totalTransactions: transactions.length,
      totalVolume,
      totalValue,
      averagePrice: totalValue / totalVolume,
      commodities,
      dateRange: {
        from: dateFrom || transactions[0].createdAt,
        to: dateTo || transactions[transactions.length - 1].createdAt
      }
    };
  }

  /**
   * Get commodity-wise analytics
   * Requirement 7.3: Insights on profitable commodities
   */
  async getCommodityAnalytics(userId: string): Promise<{
    commodity: string;
    totalTransactions: number;
    totalVolume: number;
    totalValue: number;
    averagePrice: number;
  }[]> {
    const transactions = transactionStore.getTransactionsByFilter({
      userId,
      status: 'completed'
    });

    const commodityMap = new Map<string, {
      transactions: number;
      volume: number;
      value: number;
    }>();

    transactions.forEach(t => {
      const existing = commodityMap.get(t.commodity) || {
        transactions: 0,
        volume: 0,
        value: 0
      };

      existing.transactions++;
      existing.volume += t.quantity;
      existing.value += t.totalAmount;

      commodityMap.set(t.commodity, existing);
    });

    return Array.from(commodityMap.entries()).map(([commodity, data]) => ({
      commodity,
      totalTransactions: data.transactions,
      totalVolume: data.volume,
      totalValue: data.value,
      averagePrice: data.value / data.volume
    }));
  }

  /**
   * Get trading partner analytics
   * Requirement 7.3: Insights on trading partners
   */
  async getPartnerAnalytics(userId: string): Promise<{
    partnerId: string;
    partnerType: 'buyer' | 'seller';
    totalTransactions: number;
    totalValue: number;
    averageRating?: number;
  }[]> {
    const transactions = transactionStore.getTransactionsByFilter({
      userId,
      status: 'completed'
    });

    const partnerMap = new Map<string, {
      type: 'buyer' | 'seller';
      transactions: number;
      value: number;
      ratings: number[];
    }>();

    transactions.forEach(t => {
      const partnerId = t.buyerId === userId ? t.sellerId : t.buyerId;
      const partnerType = t.buyerId === userId ? 'seller' : 'buyer';

      const existing = partnerMap.get(partnerId) || {
        type: partnerType,
        transactions: 0,
        value: 0,
        ratings: []
      };

      existing.transactions++;
      existing.value += t.totalAmount;

      // Add rating if available
      if (t.ratings) {
        const rating = partnerType === 'buyer' ? t.ratings.buyerRating : t.ratings.sellerRating;
        if (rating) existing.ratings.push(rating);
      }

      partnerMap.set(partnerId, existing);
    });

    return Array.from(partnerMap.entries()).map(([partnerId, data]) => ({
      partnerId,
      partnerType: data.type,
      totalTransactions: data.transactions,
      totalValue: data.value,
      averageRating: data.ratings.length > 0
        ? data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length
        : undefined
    }));
  }

  /**
   * Delete all transactions (for testing)
   */
  async clearAllTransactions(): Promise<void> {
    transactionStore.clearAll();
  }
}

// Export singleton instance
export const transactionService = new TransactionService();
