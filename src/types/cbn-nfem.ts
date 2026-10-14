/**
 * FingerMobile™Protocol - Central Bank of Nigeria (CBN) NFEM & REER Domain Types
 * Defines the Volume-Weighted Average Price (VWAP) interbank transaction data models,
 * structural market variables, and the Bank for International Settlements (BIS) REER basket.
 */

export type DealerCategory =
  | 'AUTHORIZED_DEALER_BANK'
  | 'INSTITUTIONAL_INVESTOR'
  | 'INTERNATIONAL_OIL_COMPANY'
  | 'CBN_INTERVENTION';

export interface NFEMTransaction {
  id: string;
  dealerName: string;
  dealerType: DealerCategory;
  price: number; // e.g., 1330.00 NGN / USD
  volumeUsd: number; // e.g., 10,000,000 USD
  totalNairaValue: number; // price * volumeUsd
  timestamp: string;
  tradingVenue: 'Bloomberg BMatch' | 'FMDQ Refinitiv' | 'Interbank Bilateral';
  status: 'SETTLED' | 'MATCHED';
  ticketRef: string;
}

export interface NFEMDailySummary {
  date: string;
  totalTurnoverUsd: number;
  totalNairaTurnover: number;
  vwapRate: number; // Sum(Price * Volume) / Total Turnover Volume
  highRate: number;
  lowRate: number;
  transactionsCount: number;
  publishedAt: string;
  willingBuyerSellerRatio: number; // e.g., 1.05
  sourceVenue: string;
}

export interface StructuralMarketFactors {
  moneySupplyM2Naira: number; // In Trillions NGN (e.g., 95.2)
  fxReservesUsd: number; // In Billions USD (e.g., 38.5)
  moneySupplyRatio: number; // M2 in USD equivalent / Reserves
  dailyFxTurnoverUsd: number; // In Millions USD (e.g., 185.4)
  nigeriaCpi: number; // Nigeria CPI annual rate (%)
  usCpi: number; // United States CPI annual rate (%)
  inflationVariance: number; // nigeriaCpi - usCpi (%)
  clearingPressure: 'APPRECIATING' | 'BALANCED' | 'DEPRECIATING';
  updatedAt: string;
}

export interface REERBasketPartner {
  partnerCode: 'CN' | 'EU' | 'US' | 'IN' | 'GB' | 'JP';
  partnerName: string;
  currency: string;
  tradeFlowWeight: number; // wi (Sum of all weights = 1.00)
  nominalExchangeRate: number; // E(Naira/i)
  foreignPriceIndex: number; // Pi
  nigeriaPriceIndex: number; // P_Nigeria
  relativePriceRatio: number; // P_Nigeria / Pi
  effectiveTerm: number; // wi * (E(Naira/i) / (P_Nigeria / Pi))
}

export interface REERCalculationResult {
  reerIndex: number; // Sum of effective terms
  baseYear: string;
  valuationStatus: 'UNDERVALUED' | 'FAIR_VALUE' | 'OVERVALUED';
  partners: REERBasketPartner[];
  calculatedAt: string;
}

export interface AutonomousIngestAuditLog {
  id: string;
  timestamp: string;
  source: string;
  targetDate: string;
  rawRate: number;
  computedNfemVwap: number;
  totalTurnoverUsd: number;
  reerIndex: number;
  calibratedFicNaira: number;
  calibratedFicUsd: number;
  auditHash: string;
  status: 'SUCCESS' | 'WARNING' | 'RECONCILED';
  message: string;
}
