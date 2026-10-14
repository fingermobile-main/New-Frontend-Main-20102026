/**
 * FingerMobile™Protocol - Enhanced Earning & Monetization System Types
 * Enforces the 4-part earning distribution policy, 1-year locked sleeper staking,
 * store credit isolation, and real-time USD/CNY exchange rates.
 */

export const EARNING_SPLIT_PERCENTAGES = {
  MEMBER_RETAINED_PCT: 0.45,   // 45% Net (wallet-fiat / liquid FIC)
  STORE_CREDIT_PCT: 0.25,      // 25% Net (platform store use only)
  STAKE_INVESTMENT_PCT: 0.05,  // 5% (1-year sleeping period with 1.5% annual interest)
  PLATFORM_REVENUE_PCT: 0.25,  // 25% (platform revenue, visible only to SuperAdmin)
} as const;

export const DEFAULT_USD_TO_FIC_RATE = 20; // 1 USD = 20 FIC (SuperAdmin configurable, where 1 FIC = $0.05 USD)
export const DEFAULT_FIC_USD_VALUE = 0.05; // 1 FIC = $0.05c USD
export const DEFAULT_FIC_NAIRA_VALUE = 65.0; // 1 FIC = ₦65.00k NGN (Apex Bank market benchmark)
export const DEFAULT_USD_NAIRA_RATE = 1340.0; // $1.00c USD = ₦1,340.00k NGN (Apex Bank rate)
export const SLEEPER_STAKE_ANNUAL_INTEREST_RATE = 1.5; // 1.5% fixed annual return
export const SLEEPER_STAKE_DURATION_DAYS = 365; // 1-year sleeping lockup

export type PlatformStoreType = 'FLAMINGO' | 'OWNIT' | 'MARKETPLACE' | 'STOREFRONT';

export interface ExchangeRate {
  id: string;
  baseCurrency: 'USD' | 'CNY';
  targetCurrency: string; // 'FIC', 'NGN', 'KES', 'GHS', 'ZAR', 'EUR', 'GBP', etc.
  rate: number;
  countryCode?: string;
  provider: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface EnhancedWallet {
  id: string;
  memberId: string;
  ficBalance: number;          // Liquid wallet (45% retention)
  storeCreditBalance: number;  // Restricted to platform stores (25%)
  stakeBalance: number;        // Active locked sleeper investments (5%)
  fiatBalance: number;         // Fiat equivalent
  reservedBalance: number;     // Escrow holds
  currencyCode: string;        // Default 'FIC'
  lastTransactionAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EarningDistribution {
  id: string;
  earningId: string;
  memberId: string;
  memberName?: string;
  grossEarning: number;
  earningType: 'ADS' | 'GEMS' | 'TIPS' | 'VIEWS' | 'SUBSCRIPTIONS' | 'SHOP_SALES' | 'STREAM_REWARDS';
  memberRetained: number;    // 45% (Liquid FIC)
  storeCredit: number;       // 25% (Store Credit)
  stakeAmount: number;       // 5% (Auto-staked in Sleepers)
  platformRetained: number;  // 25% (Platform Treasury)
  distributionDate: string;
  txHash?: string;
}

export interface StakeInvestment {
  id: string;
  memberId: string;
  amount: number;
  interestRate: number;      // 1.5%
  startDate: string;
  maturityDate: string;      // 1 year from startDate
  status: 'active' | 'matured' | 'withdrawn';
  expectedReturn: number;    // Principal + 1.5%
  actualReturn: number;
  distributionId?: string;   // Reference to originating earning distribution
  createdAt: string;
}

export interface StoreCreditTransaction {
  id: string;
  memberId: string;
  store: PlatformStoreType;
  orderId: string;
  amount: number;
  timestamp: string;
  description: string;
}

export interface MultiBalanceUsdValuation {
  ficUsd: number;
  storeCreditUsd: number;
  stakeUsd: number;
  totalUsd: number;
  ficCny: number;
  rateUsed: number;
}
