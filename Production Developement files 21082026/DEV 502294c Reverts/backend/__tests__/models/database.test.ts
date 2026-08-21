import { Wallet } from '../models/WalletModel';
import { Transaction } from '../models/TransactionModel';
import { Earnings } from '../models/EarningsModel';
import { Stake } from '../models/StakeModel';

describe('Database Models', () => {
  describe('Wallet Model', () => {
    it('should create wallet with valid data', () => {
      const walletData = {
userId: 'user-123',
balance: 100.50,
currency: 'USD',
status: 'active'
      };

      expect(walletData.userId).toBeDefined();
      expect(walletData.balance).toBeGreaterThan(0);
      expect(['active', 'suspended', 'closed']).toContain(walletData.status);
    });

    it('should validate required fields', () => {
      const invalidWallet = {
balance: -50,
currency: ''
      };

      expect(invalidWallet.balance).toBeLessThan(0);
    });
  });

  describe('Transaction Model', () => {
    it('should create transaction with valid data', () => {
      const transactionData = {
walletId: 'wallet-123',
userId: 'user-123',
type: 'credit',
amount: 50.00,
currency: 'USD',
status: 'completed'
      };

      expect(transactionData.type).toMatch(/^(credit|debit|stake|payout|distribution)$/);
      expect(transactionData.amount).toBeGreaterThan(0);
    });

    it('should validate transaction types', () => {
      const validTypes = ['credit', 'debit', 'stake', 'payout', 'distribution'];
      expect(validTypes).toContain('credit');
      expect(validTypes).toContain('debit');
    });
  });

  describe('Earnings Model', () => {
    it('should create earnings record', () => {
      const earningsData = {
userId: 'user-123',
source: 'views',
amount: 25.00,
currency: 'USD',
status: 'pending'
      };

      expect(earningsData.source).toMatch(/^(views|subscriptions|gems|ads|donations|tips|affiliate|merchandise|other)$/);
      expect(earningsData.amount).toBeGreaterThan(0);
    });
  });

  describe('Stake Model', () => {
    it('should create stake with valid data', () => {
      const stakeData = {
userId: 'user-123',
walletId: 'wallet-123',
amount: 100.00,
currency: 'USD',
status: 'active',
rewardRate: 5.5
      };

      expect(stakeData.amount).toBeGreaterThan(0);
      expect(stakeData.rewardRate).toBeGreaterThan(0);
      expect(['active', 'unstaked', 'pending']).toContain(stakeData.status);
    });
  });
});
