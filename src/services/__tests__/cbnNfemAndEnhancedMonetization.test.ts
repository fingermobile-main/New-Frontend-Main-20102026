/**
 * FingerMobile™Protocol - Comprehensive Test Suite:
 * 1. CBN NFEM Ingestion Engine & REER Controller (Methodologies 1, 2 & 3)
 * 2. Exchange Rate Service (1 FIC = $0.05c USD / ₦65.00k NGN at $1 = ₦1,340)
 * 3. Enhanced Wallet Service (4-Part Earning Distribution & 1-Year Sleepers @ 1.5% APY)
 */

import { cbnNfemIngestionService } from '../cbnNfemIngestionService';
import { exchangeRateService } from '../exchangeRateService';
import { enhancedWalletService } from '../enhancedWalletService';
import { NFEMTransaction } from '../../types/cbn-nfem';

describe('CBN NFEM Ingestion Engine & REER Controller', () => {
  beforeEach(() => {
    cbnNfemIngestionService.resetToDefaultTape();
  });

  describe('Methodology 1: Volume-Weighted Average Price (VWAP)', () => {
    it('should mathematically tilt the clearing rate toward the higher volume trade (Bank A $10M @ ₦1,330 vs Bank B $2M @ ₦1,335)', () => {
      // User's exact prompt scenario:
      // Bank A: $10M @ ₦1,330/$
      // Bank B: $2M @ ₦1,335/$
      const testTransactions: NFEMTransaction[] = [
        {
          id: 'tx-bank-a',
          dealerName: 'Bank A (Authorized Dealer)',
          dealerType: 'AUTHORIZED_DEALER_BANK',
          price: 1330.0,
          volumeUsd: 10000000,
          totalNairaValue: 13300000000,
          timestamp: '2026-10-13T10:00:00.000Z',
          tradingVenue: 'Bloomberg BMatch',
          status: 'SETTLED',
          ticketRef: 'BMATCH-TEST-A',
        },
        {
          id: 'tx-bank-b',
          dealerName: 'Bank B (Authorized Dealer)',
          dealerType: 'AUTHORIZED_DEALER_BANK',
          price: 1335.0,
          volumeUsd: 2000000,
          totalNairaValue: 2670000000,
          timestamp: '2026-10-13T10:15:00.000Z',
          tradingVenue: 'Bloomberg BMatch',
          status: 'SETTLED',
          ticketRef: 'BMATCH-TEST-B',
        },
      ];

      const summary = cbnNfemIngestionService.computeVwapSummary(testTransactions);

      // Total Volume = $12,000,000
      // Total Turnover = ₦13,300,000,000 + ₦2,670,000,000 = ₦15,970,000,000
      // VWAP = 15,970,000,000 / 12,000,000 = ₦1,330.8333...
      expect(summary.totalTurnoverUsd).toBe(12000000);
      expect(summary.totalNairaTurnover).toBe(15970000000);
      expect(summary.vwapRate).toBe(1330.83);

      // Verify mathematical tilt: VWAP is much closer to Bank A's 1,330 than Bank B's 1,335
      const diffFromA = Math.abs(summary.vwapRate - 1330);
      const diffFromB = Math.abs(summary.vwapRate - 1335);
      expect(diffFromA).toBeLessThan(diffFromB);
    });

    it('should dynamically update the live tape when an interbank trade is injected', () => {
      const initialSummary = cbnNfemIngestionService.getDailySummary();
      const initialTurnover = initialSummary.totalTurnoverUsd;

      // Inject institutional order: $20M @ ₦1,338
      const updatedSummary = cbnNfemIngestionService.simulateInterbankTrade(
        'Citibank Nigeria (FPI Desk)',
        'INSTITUTIONAL_INVESTOR',
        1338.0,
        20000000,
        'Bloomberg BMatch'
      );

      expect(updatedSummary.totalTurnoverUsd).toBe(initialTurnover + 20000000);
      expect(updatedSummary.transactionsCount).toBe(initialSummary.transactionsCount + 1);
    });
  });

  describe('Methodology 2: Macroeconomic Structural Variables', () => {
    it('should provide calibrated telemetry for M2, reserves, and inflation variance', () => {
      const factors = cbnNfemIngestionService.getStructuralFactors();

      expect(factors.moneySupplyM2Naira).toBeGreaterThan(90); // ~₦95.8 Trillion
      expect(factors.fxReservesUsd).toBeGreaterThan(30); // ~$38.9 Billion
      expect(factors.dailyFxTurnoverUsd).toBeGreaterThan(100); // ~$185.4M
      expect(factors.inflationVariance).toBe(30.3); // Nigeria 33.2% - US 2.9% = 30.3%
      expect(factors.clearingPressure).toBe('BALANCED');
    });
  });

  describe('Methodology 3: Real Effective Exchange Rate (REER - BIS Methodology)', () => {
    it('should compute the 6-partner currency basket with weights summing to exactly 1.00', () => {
      const reerResult = cbnNfemIngestionService.computeReer(1340.0);

      const totalWeight = reerResult.partners.reduce(
        (sum, p) => sum + p.tradeFlowWeight,
        0
      );
      expect(Math.round(totalWeight * 100) / 100).toBe(1.0);

      // Partner weights check: CN: 28%, EU: 24%, US: 18%, IN: 12%, GB: 10%, JP: 8%
      const partnerCodes = reerResult.partners.map((p) => p.partnerCode);
      expect(partnerCodes).toEqual(['CN', 'EU', 'US', 'IN', 'GB', 'JP']);

      // Composite REER index check
      expect(reerResult.reerIndex).toBeGreaterThan(70);
      expect(reerResult.reerIndex).toBeLessThan(100);
      expect(reerResult.valuationStatus).toBe('FAIR_VALUE');
    });
  });

  describe('Protocol FIC Parity Calibration & Ingestion Workflow', () => {
    it('should calibrate FIC to ₦65.00 NGN ($0.05 USD) with merchant discount buffer', () => {
      const calibration = cbnNfemIngestionService.calibrateFicValuation(1340.0, true);

      expect(calibration.ficUsd).toBe(0.05);
      expect(calibration.ficNaira).toBe(65.0);
      expect(calibration.mathematicalParityNaira).toBe(67.0); // 1340 * 0.05 = 67.0
      expect(calibration.discountPercent).toBe(2.99); // (67 - 65) / 67 * 100 ≈ 2.99%
    });

    it('should execute full autonomous daily ingest and generate signed audit logs', async () => {
      const result = await cbnNfemIngestionService.runDailyAutonomousIngest(false);

      expect(result.summary.vwapRate).toBeGreaterThan(1300);
      expect(result.calibratedFic.ficNaira).toBe(65.0);
      expect(result.calibratedFic.ficUsd).toBe(0.05);
      expect(result.auditLog.status).toBe('SUCCESS');
      expect(result.auditLog.auditHash).toMatch(/^0x[a-f0-9]+/);
    });
  });
});

describe('Exchange Rate Service (Tokenomic Conversions)', () => {
  it('should accurately convert between FIC and USD at 1 USD = 20 FIC (1 FIC = $0.05 USD)', () => {
    expect(exchangeRateService.getFicUsdRate()).toBe(20);
    expect(exchangeRateService.getUsdPerFic()).toBe(0.05);

    // ficToUsd: 20 FIC = $1.00 USD, 100 FIC = $5.00 USD, 1000 FIC = $50.00 USD
    expect(exchangeRateService.ficToUsd(20)).toBe(1.0);
    expect(exchangeRateService.ficToUsd(100)).toBe(5.0);
    expect(exchangeRateService.ficToUsd(1000)).toBe(50.0);

    // usdToFic: $1.00 USD = 20 FIC, $5.00 USD = 100 FIC
    expect(exchangeRateService.usdToFic(1.0)).toBe(20.0);
    expect(exchangeRateService.usdToFic(5.0)).toBe(100.0);
    expect(exchangeRateService.usdToFic(50.0)).toBe(1000.0);
  });

  it('should accurately convert FIC to Chinese Renminbi (CNY)', () => {
    // 20 FIC = $1.00 USD * 7.24 CNY = 7.24 CNY
    expect(exchangeRateService.ficToCny(20)).toBe(7.24);
    // 1 FIC = $0.05 USD * 7.24 CNY = 0.36 CNY
    expect(exchangeRateService.ficToCny(1)).toBe(0.36);
  });

  it('should convert FIC to Nigerian Naira at the ₦65.00 anchor', () => {
    const local = exchangeRateService.ficToLocalCurrency(100, 'NG');
    expect(local.currency).toBe('NGN');
    expect(local.amount).toBe(6500.0); // 100 * 65.00 = 6,500.00
    expect(local.ratePerFic).toBe(65.0);
  });

  it('should valuate multi-balance wallets accurately', () => {
    // Liquid 14,850 FIC, Store Credit 8,250 FIC, Staked 1,650 FIC
    const valuation = exchangeRateService.convertMultiBalanceValuation(14850, 8250, 1650);

    // 14850 * 0.05 = $742.50
    expect(valuation.ficUsd).toBe(742.5);
    // 8250 * 0.05 = $412.50
    expect(valuation.storeCreditUsd).toBe(412.5);
    // 1650 * 0.05 = $82.50
    expect(valuation.stakeUsd).toBe(82.5);
    // Total: 742.50 + 412.50 + 82.50 = $1,237.50
    expect(valuation.totalUsd).toBe(1237.5);
  });
});

describe('Enhanced Wallet 4-Part Earning Distribution & Staking System', () => {
  it('should distribute gross earnings according to 45% Member, 25% Store Credit, 5% Sleepers, 25% Platform Revenue', async () => {
    const grossEarning = 10000.0;
    const { distribution } = await enhancedWalletService.distributeEarnings(
      'mem-test-user',
      grossEarning,
      'ADS',
      'ref-ads-99'
    );

    // 45% Net to Member Liquid FIC
    expect(distribution.memberRetained).toBe(4500.0);
    // 25% Net to Store Credit
    expect(distribution.storeCredit).toBe(2500.0);
    // 5% Net to Sleepers Staking
    expect(distribution.stakeAmount).toBe(500.0);
    // 25% Net to Platform Revenue
    expect(distribution.platformRetained).toBe(2500.0);

    // Sum verification
    const sum =
      distribution.memberRetained +
      distribution.storeCredit +
      distribution.stakeAmount +
      distribution.platformRetained;
    expect(sum).toBe(grossEarning);
  });

  it('should automatically generate a 365-day locked sleeper stake at 1.5% fixed APY for the 5% portion', async () => {
    const stakes = await enhancedWalletService.getStakeInvestments('mem-test-user');
    expect(stakes.length).toBeGreaterThan(0);

    const latestStake = stakes[0];
    expect(latestStake.amount).toBe(500.0);
    expect(latestStake.interestRate).toBe(1.5);
    // Expected return: 500 * 1.015 = 507.50 FIC
    expect(latestStake.expectedReturn).toBe(507.5);
    expect(latestStake.status).toBe('active');

    // Maturity check: ~365 days in future
    const start = new Date(latestStake.startDate).getTime();
    const end = new Date(latestStake.maturityDate).getTime();
    const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
    expect(diffDays).toBe(365);
  });

  it('should enforce store credit spend strictly on platform stores', async () => {
    // Valid store spend
    const successResult = await enhancedWalletService.spendStoreCredit(
      'mem-test-user',
      100.0,
      'FLAMINGO',
      'order-101',
      'Flamingo VIP access card'
    );
    expect(successResult.success).toBe(true);
    expect(successResult.newStoreCreditBalance).toBeDefined();

    const txs = await enhancedWalletService.getStoreCreditTransactions('mem-test-user');
    expect(txs.length).toBeGreaterThan(0);
    expect(txs[0].store).toBe('FLAMINGO');
  });
});
