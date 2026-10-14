/**
 * FingerMobile™Protocol - Enhanced Wallet & 4-Part Earning Distribution Service
 * Implements the mathematical 4-part split formula:
 *  - 45% Net to Member (Liquid FIC / Fiat)
 *  - 25% Net to Store Credit (Restricted to Flamingo, OwnIt, Marketplace, Storefront)
 *  - 5% Net to Stake Investment (1-Year locked Sleepers @ 1.5% fixed APY)
 *  - 25% Net to Platform Revenue (SuperAdmin viewable)
 */

import {
  EnhancedWallet,
  EarningDistribution,
  StakeInvestment,
  StoreCreditTransaction,
  PlatformStoreType,
  EARNING_SPLIT_PERCENTAGES,
  SLEEPER_STAKE_ANNUAL_INTEREST_RATE,
  SLEEPER_STAKE_DURATION_DAYS,
} from '../types/enhanced-monetization';

const STORAGE_KEY_WALLETS = 'fingermobile_enhanced_wallets_v1';
const STORAGE_KEY_DISTRIBUTIONS = 'fingermobile_earning_distributions_v1';
const STORAGE_KEY_STAKES = 'fingermobile_sleeper_stakes_v1';
const STORAGE_KEY_STORE_TXS = 'fingermobile_store_credit_txs_v1';

// Seeded default enhanced wallet for the active session
const DEFAULT_SAMPLE_WALLET: EnhancedWallet = {
  id: 'wallet-enh-001',
  memberId: 'mem-primary-user',
  ficBalance: 14850.0,         // 45% liquid retained portion
  storeCreditBalance: 8250.0,  // 25% store credit portion
  stakeBalance: 1650.0,        // 5% active sleeper stakes
  fiatBalance: 742.50,         // Equivalent in USD (14,850 FIC * $0.05/FIC)
  reservedBalance: 0.0,
  currencyCode: 'FIC',
  lastTransactionAt: '2026-10-13T16:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-10-13T16:00:00.000Z',
};

// Seeded earning distributions showing the 4-part allocation
const DEFAULT_SAMPLE_DISTRIBUTIONS: EarningDistribution[] = [
  {
    id: 'dist-001',
    earningId: 'earn-ads-101',
    memberId: 'mem-primary-user',
    memberName: 'Israel Obinna',
    grossEarning: 10000.0,
    earningType: 'ADS',
    memberRetained: 4500.0,    // 45%
    storeCredit: 2500.0,       // 25%
    stakeAmount: 500.0,        // 5%
    platformRetained: 2500.0,  // 25%
    distributionDate: '2026-10-10T14:30:00.000Z',
    txHash: '0x8f9c1e7a4b2d6a5e1c3b4a2f9e7d5c3b1a',
  },
  {
    id: 'dist-002',
    earningId: 'earn-gems-102',
    memberId: 'mem-primary-user',
    memberName: 'Israel Obinna',
    grossEarning: 6000.0,
    earningType: 'GEMS',
    memberRetained: 2700.0,    // 45%
    storeCredit: 1500.0,       // 25%
    stakeAmount: 300.0,        // 5%
    platformRetained: 1500.0,  // 25%
    distributionDate: '2026-10-11T18:15:00.000Z',
    txHash: '0x3b1a2f9e7d5c3b1a8f9c1e7a4b2d6a5e1c',
  },
  {
    id: 'dist-003',
    earningId: 'earn-shop-103',
    memberId: 'mem-primary-user',
    memberName: 'Israel Obinna',
    grossEarning: 17000.0,
    earningType: 'SHOP_SALES',
    memberRetained: 7650.0,    // 45%
    storeCredit: 4250.0,       // 25%
    stakeAmount: 850.0,        // 5%
    platformRetained: 4250.0,  // 25%
    distributionDate: '2026-10-12T09:45:00.000Z',
    txHash: '0x7d5c3b1a8f9c1e7a4b2d6a5e1c3b4a2f9e',
  },
];

// Seeded 1-Year Sleeper Stakes (5% earning portion locked for 365 days @ 1.5% APY)
const DEFAULT_SAMPLE_STAKES: StakeInvestment[] = [
  {
    id: 'stake-001',
    memberId: 'mem-primary-user',
    amount: 500.0,
    interestRate: SLEEPER_STAKE_ANNUAL_INTEREST_RATE,
    startDate: '2026-10-10T14:30:00.000Z',
    maturityDate: '2027-10-10T14:30:00.000Z',
    status: 'active',
    expectedReturn: 507.5,     // 500 + 1.5%
    actualReturn: 0.0,
    distributionId: 'dist-001',
    createdAt: '2026-10-10T14:30:00.000Z',
  },
  {
    id: 'stake-002',
    memberId: 'mem-primary-user',
    amount: 300.0,
    interestRate: SLEEPER_STAKE_ANNUAL_INTEREST_RATE,
    startDate: '2026-10-11T18:15:00.000Z',
    maturityDate: '2027-10-11T18:15:00.000Z',
    status: 'active',
    expectedReturn: 304.5,     // 300 + 1.5%
    actualReturn: 0.0,
    distributionId: 'dist-002',
    createdAt: '2026-10-11T18:15:00.000Z',
  },
  {
    id: 'stake-003',
    memberId: 'mem-primary-user',
    amount: 850.0,
    interestRate: SLEEPER_STAKE_ANNUAL_INTEREST_RATE,
    startDate: '2026-10-12T09:45:00.000Z',
    maturityDate: '2027-10-12T09:45:00.000Z',
    status: 'active',
    expectedReturn: 862.75,    // 850 + 1.5%
    actualReturn: 0.0,
    distributionId: 'dist-003',
    createdAt: '2026-10-12T09:45:00.000Z',
  },
];

class EnhancedWalletService {
  /**
   * Fetch current authenticated member's multi-balance wallet
   */
  public async getWallet(memberId = 'mem-primary-user'): Promise<EnhancedWallet> {
    if (typeof window === 'undefined') return DEFAULT_SAMPLE_WALLET;

    try {
      const raw = localStorage.getItem(STORAGE_KEY_WALLETS);
      if (raw) {
        const wallets: Record<string, EnhancedWallet> = JSON.parse(raw);
        if (wallets[memberId]) {
          return wallets[memberId];
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed to parse wallets from localStorage, initializing defaults', err);
    }

    // Save and return default
    this.saveWallet(DEFAULT_SAMPLE_WALLET);
    return DEFAULT_SAMPLE_WALLET;
  }

  /**
   * Persist a member wallet into localStorage
   */
  private saveWallet(wallet: EnhancedWallet): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_WALLETS);
      const wallets: Record<string, EnhancedWallet> = raw ? JSON.parse(raw) : {};
      wallets[wallet.memberId] = wallet;
      localStorage.setItem(STORAGE_KEY_WALLETS, JSON.stringify(wallets));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error saving enhanced wallet:', err);
    }
  }

  /**
   * Executes the 4-part earning distribution policy:
   * 1. 45% Net to Member Retained (Liquid FIC)
   * 2. 25% Net to Store Credit (Platform Stores Only)
   * 3. 5% Net to Stake Investment ("Sleepers" 1-Year Lock @ 1.5% APY)
   * 4. 25% Net to Platform Revenue (SuperAdmin viewable)
   */
  public async distributeEarnings(
    memberId: string,
    grossEarning: number,
    earningType: EarningDistribution['earningType'] = 'ADS',
    referenceId = `earn-${Date.now()}`
  ): Promise<{ wallet: EnhancedWallet; distribution: EarningDistribution; stake: StakeInvestment }> {
    if (grossEarning <= 0) {
      throw new Error('Gross earning amount must be greater than zero.');
    }

    // Calculate portions according to policy
    const memberRetained = parseFloat(
      (grossEarning * EARNING_SPLIT_PERCENTAGES.MEMBER_RETAINED_PCT).toFixed(2)
    );
    const storeCredit = parseFloat(
      (grossEarning * EARNING_SPLIT_PERCENTAGES.STORE_CREDIT_PCT).toFixed(2)
    );
    const stakeAmount = parseFloat(
      (grossEarning * EARNING_SPLIT_PERCENTAGES.STAKE_INVESTMENT_PCT).toFixed(2)
    );
    const platformRetained = parseFloat(
      (grossEarning * EARNING_SPLIT_PERCENTAGES.PLATFORM_REVENUE_PCT).toFixed(2)
    );

    // Update wallet
    const wallet = await this.getWallet(memberId);
    wallet.ficBalance = parseFloat((wallet.ficBalance + memberRetained).toFixed(2));
    wallet.storeCreditBalance = parseFloat((wallet.storeCreditBalance + storeCredit).toFixed(2));
    wallet.stakeBalance = parseFloat((wallet.stakeBalance + stakeAmount).toFixed(2));
    wallet.lastTransactionAt = new Date().toISOString();
    wallet.updatedAt = new Date().toISOString();
    this.saveWallet(wallet);

    // Record distribution
    const now = new Date();
    const distribution: EarningDistribution = {
      id: `dist-${Date.now()}`,
      earningId: referenceId,
      memberId,
      grossEarning,
      earningType,
      memberRetained,
      storeCredit,
      stakeAmount,
      platformRetained,
      distributionDate: now.toISOString(),
      txHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
    };

    const distributions = await this.getEarningDistributions();
    distributions.unshift(distribution);
    this.saveDistributions(distributions);

    // Auto-create 1-year locked sleeper stake
    const maturity = new Date(now.getTime() + SLEEPER_STAKE_DURATION_DAYS * 24 * 60 * 60 * 1000);
    const expectedReturn = parseFloat(
      (stakeAmount * (1 + SLEEPER_STAKE_ANNUAL_INTEREST_RATE / 100)).toFixed(2)
    );

    const stake: StakeInvestment = {
      id: `stake-${Date.now()}`,
      memberId,
      amount: stakeAmount,
      interestRate: SLEEPER_STAKE_ANNUAL_INTEREST_RATE,
      startDate: now.toISOString(),
      maturityDate: maturity.toISOString(),
      status: 'active',
      expectedReturn,
      actualReturn: 0.0,
      distributionId: distribution.id,
      createdAt: now.toISOString(),
    };

    const stakes = await this.getStakeInvestments(memberId);
    stakes.unshift(stake);
    this.saveStakes(stakes);

    return { wallet, distribution, stake };
  }

  /**
   * Spend Store Credit strictly on platform stores:
   * Flamingo, OwnIt, Marketplace, or Storefront
   */
  public async spendStoreCredit(
    memberId: string,
    amount: number,
    store: PlatformStoreType,
    orderId = `ord-${Date.now()}`,
    description = 'Store purchase'
  ): Promise<{ success: boolean; newStoreCreditBalance: number; message: string }> {
    if (amount <= 0) {
      return { success: false, newStoreCreditBalance: 0, message: 'Invalid purchase amount.' };
    }

    const wallet = await this.getWallet(memberId);
    if (wallet.storeCreditBalance < amount) {
      return {
        success: false,
        newStoreCreditBalance: wallet.storeCreditBalance,
        message: `Insufficient store credit. You have ${wallet.storeCreditBalance.toLocaleString()} FIC available for ${store}.`,
      };
    }

    wallet.storeCreditBalance = parseFloat((wallet.storeCreditBalance - amount).toFixed(2));
    wallet.lastTransactionAt = new Date().toISOString();
    wallet.updatedAt = new Date().toISOString();
    this.saveWallet(wallet);

    // Record store credit spend audit
    const tx: StoreCreditTransaction = {
      id: `sctx-${Date.now()}`,
      memberId,
      store,
      orderId,
      amount,
      timestamp: new Date().toISOString(),
      description,
    };
    this.saveStoreCreditTx(tx);

    return {
      success: true,
      newStoreCreditBalance: wallet.storeCreditBalance,
      message: `Successfully used ${amount.toLocaleString()} FIC store credit at ${store}.`,
    };
  }

  /**
   * Fetch member's store credit transactions
   */
  public async getStoreCreditTransactions(memberId = 'mem-primary-user'): Promise<StoreCreditTransaction[]> {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STORE_TXS);
      if (raw) {
        const list: StoreCreditTransaction[] = JSON.parse(raw);
        return list.filter((tx) => !memberId || tx.memberId === memberId);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed to parse store credit transactions from localStorage', err);
    }
    return [];
  }

  /**
   * Fetch member's active and matured Sleeper stakes
   */
  public async getStakeInvestments(memberId = 'mem-primary-user'): Promise<StakeInvestment[]> {
    if (typeof window === 'undefined') return DEFAULT_SAMPLE_STAKES;

    try {
      const raw = localStorage.getItem(STORAGE_KEY_STAKES);
      if (raw) {
        const parsed: StakeInvestment[] = JSON.parse(raw);
        return parsed.filter((s) => s.memberId === memberId);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed to parse stakes from localStorage', err);
    }

    this.saveStakes(DEFAULT_SAMPLE_STAKES);
    return DEFAULT_SAMPLE_STAKES;
  }

  /**
   * Withdraw a matured Sleeper stake back to liquid FIC balance
   */
  public async withdrawMaturedStake(
    memberId: string,
    stakeId: string
  ): Promise<{ success: boolean; creditedAmount: number; message: string }> {
    const stakes = await this.getStakeInvestments(memberId);
    const stake = stakes.find((s) => s.id === stakeId);

    if (!stake) {
      return { success: false, creditedAmount: 0, message: 'Stake investment not found.' };
    }

    const now = new Date();
    const maturity = new Date(stake.maturityDate);

    if (now < maturity && stake.status === 'active') {
      return {
        success: false,
        creditedAmount: 0,
        message: `Stake is still locked in the 1-year sleeping period until ${maturity.toLocaleDateString()}.`,
      };
    }

    if (stake.status === 'withdrawn') {
      return { success: false, creditedAmount: 0, message: 'This stake has already been withdrawn.' };
    }

    const returnAmount = stake.expectedReturn;
    stake.status = 'withdrawn';
    stake.actualReturn = returnAmount;
    this.saveStakes(stakes);

    // Credit member liquid FIC
    const wallet = await this.getWallet(memberId);
    wallet.ficBalance = parseFloat((wallet.ficBalance + returnAmount).toFixed(2));
    wallet.stakeBalance = parseFloat(Math.max(0, wallet.stakeBalance - stake.amount).toFixed(2));
    this.saveWallet(wallet);

    return {
      success: true,
      creditedAmount: returnAmount,
      message: `Successfully claimed ${returnAmount.toLocaleString()} FIC principal and interest.`,
    };
  }

  /**
   * Fetch all earning distributions for a member
   */
  public async getEarningDistributions(memberId?: string): Promise<EarningDistribution[]> {
    if (typeof window === 'undefined') return DEFAULT_SAMPLE_DISTRIBUTIONS;

    try {
      const raw = localStorage.getItem(STORAGE_KEY_DISTRIBUTIONS);
      if (raw) {
        const parsed: EarningDistribution[] = JSON.parse(raw);
        if (memberId) {
          return parsed.filter((d) => d.memberId === memberId);
        }
        return parsed;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed to parse distributions from localStorage', err);
    }

    this.saveDistributions(DEFAULT_SAMPLE_DISTRIBUTIONS);
    return memberId
      ? DEFAULT_SAMPLE_DISTRIBUTIONS.filter((d) => d.memberId === memberId)
      : DEFAULT_SAMPLE_DISTRIBUTIONS;
  }

  /**
   * Calculate cumulative platform retained revenue (for SuperAdmin Treasury)
   */
  public async getTotalPlatformRetainedRevenue(): Promise<{ totalFic: number; totalCount: number }> {
    const all = await this.getEarningDistributions();
    const totalFic = all.reduce((sum, d) => sum + (d.platformRetained || 0), 0);
    return {
      totalFic: parseFloat(totalFic.toFixed(2)),
      totalCount: all.length,
    };
  }

  private saveDistributions(distributions: EarningDistribution[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_DISTRIBUTIONS, JSON.stringify(distributions));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error saving distributions:', err);
    }
  }

  private saveStakes(stakes: StakeInvestment[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_STAKES, JSON.stringify(stakes));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error saving stakes:', err);
    }
  }

  private saveStoreCreditTx(tx: StoreCreditTransaction): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STORE_TXS);
      const list: StoreCreditTransaction[] = raw ? JSON.parse(raw) : [];
      list.unshift(tx);
      localStorage.setItem(STORAGE_KEY_STORE_TXS, JSON.stringify(list));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error saving store credit tx:', err);
    }
  }
}

export const enhancedWalletService = new EnhancedWalletService();
export default enhancedWalletService;
