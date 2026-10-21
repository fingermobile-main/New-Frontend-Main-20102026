/**
 * Financial Economic Ecosystem Service & Accounting Ratios Unit Tests
 * FingerMobile Protocol™ Production Verification
 */

const financialEcosystemService = require('../../services/financialEcosystemService');

describe('Financial Economic Ecosystem & Accounting Ratios Unit Tests', () => {
  describe('1. Sovereign Bank Rails (Revenue vs. Profit)', () => {
    it('should correctly configure Fidelity Bank Platform Revenue accounts (NGN, GBP, EUR, USSD)', () => {
      const revenueRails = financialEcosystemService.getRevenueRails();
      expect(revenueRails.bankName).toBe('Fidelity Bank');
      expect(revenueRails.accountName).toBe('FingerMobile Protocol Communication');
      expect(revenueRails.swiftCode).toBe('FIDTNGLA');
      expect(revenueRails.headquartersAddress).toContain('Lagos');

      const ngnAcc = revenueRails.accounts.find(a => a.currency === 'NGN');
      expect(ngnAcc).toBeDefined();
      expect(ngnAcc.accountNumber).toBe('5600792703');
      expect(ngnAcc.ussdCode).toBe('5250325184');

      const gbpAcc = revenueRails.accounts.find(a => a.currency === 'GBP');
      expect(gbpAcc).toBeDefined();
      expect(gbpAcc.accountNumber).toBe('5250325201');

      const eurAcc = revenueRails.accounts.find(a => a.currency === 'EUR');
      expect(eurAcc).toBeDefined();
      expect(eurAcc.accountNumber).toBe('5250325191');
    });

    it('should correctly configure Fidelity Bank Platform PROFIT account (Abuja Area 8 Branch)', () => {
      const profitRails = financialEcosystemService.getProfitRails();
      expect(profitRails.bankName).toBe('Fidelity Bank');
      expect(profitRails.accountName).toBe('FingerMobile Protocol Communication');
      expect(profitRails.branchName).toBe('Area 8 Branch');
      expect(profitRails.branchCity).toBe('Abuja');
      expect(profitRails.accountNumber).toBe('5601279229');
      expect(profitRails.ussdCode).toBe('5250325184');
      expect(profitRails.swiftCode).toBe('FIDTNGLA');
      expect(profitRails.corporateAddress).toContain('Abuja');
      expect(profitRails.autoSweepEnabled).toBe(true);
    });

    it('should provide rigorous definitions for Revenue, Income, and Profit', () => {
      const defs = financialEcosystemService.getEconomicDefinitions();
      expect(defs.revenue.definition).toContain('top line');
      expect(defs.income.formulaGross).toContain('Sales - COGS');
      expect(defs.income.formulaNet).toContain('Total Revenue - Total Expenses');
      expect(defs.profit.definition).toContain('bottom line');
    });
  });

  describe('2. Interest and Growth Calculators', () => {
    it('should accurately compute Simple Interest I = P * r * t and A = P(1 + r*t)', () => {
      const p = 100000;
      const r = 0.10; // 10%
      const t = 2; // 2 years
      const result = financialEcosystemService.calculateSimpleInterest(p, r, t);
      expect(result.interest).toBe(20000.00);
      expect(result.totalAmount).toBe(120000.00);
    });

    it('should accurately compute Compound Interest Future Value FV = PV * (1 + r/n)^(n*t)', () => {
      const pv = 100000;
      const r = 0.12; // 12%
      const n = 12; // monthly
      const t = 1; // 1 year
      const result = financialEcosystemService.calculateCompoundInterest(pv, r, n, t);
      // FV = 100000 * (1 + 0.01)^12 = 112682.50
      expect(result.futureValue).toBeCloseTo(112682.50, 1);
      expect(result.interestEarned).toBeCloseTo(12682.50, 1);
    });

    it('should accurately compute Present Value PV = FV / (1 + r)^t', () => {
      const fv = 121000;
      const r = 0.10;
      const t = 2;
      const result = financialEcosystemService.calculatePresentValue(fv, r, t);
      expect(result.presentValue).toBe(100000.00);
    });

    it('should accurately compute Effective Annual Rate EAR = (1 + r/n)^n - 1', () => {
      const r = 0.12; // 12% nominal
      const n = 12; // monthly compounding
      const result = financialEcosystemService.calculateEffectiveAnnualRate(r, n);
      expect(result.effectiveAnnualRatePercent).toBeCloseTo(12.6825, 2);
    });
  });

  describe('3. FingerMobile Business and Accounting Ratios', () => {
    it('should evaluate the Balance Sheet equation Assets = Liabilities + Equity with zero delta', () => {
      const evaluation = financialEcosystemService.evaluateAccountingRatios();
      expect(evaluation.balanceSheetEquation.isBalanced).toBe(true);
      expect(evaluation.balanceSheetEquation.assets).toBe(evaluation.balanceSheetEquation.sumLiabilitiesAndEquity);
    });

    it('should compute Net Income = Total Revenue - Total Expenses and Gross Profit = Sales - COGS', () => {
      const evaluation = financialEcosystemService.evaluateAccountingRatios();
      expect(evaluation.incomeMetrics.grossProfit).toBe(
        evaluation.incomeMetrics.totalRevenue - evaluation.incomeMetrics.cogs
      );
      expect(evaluation.incomeMetrics.netIncome).toBe(
        evaluation.incomeMetrics.totalRevenue - evaluation.incomeMetrics.totalExpenses
      );
      expect(evaluation.incomeMetrics.grossProfitMarginPercent).toBeGreaterThan(0);
      expect(evaluation.incomeMetrics.netProfitMarginPercent).toBeGreaterThan(0);
    });

    it('should compute Current Ratio = Current Assets / Current Liabilities correctly', () => {
      const evaluation = financialEcosystemService.evaluateAccountingRatios({
        currentAssets: 5000000,
        currentLiabilities: 2000000,
        inventory: 500000
      });
      expect(evaluation.ratios.currentRatio.value).toBe(2.5);
      expect(evaluation.ratios.currentRatio.status).toBe('HEALTHY');
    });

    it('should compute Quick Ratio = (Current Assets - Inventory) / Current Liabilities correctly', () => {
      const evaluation = financialEcosystemService.evaluateAccountingRatios({
        currentAssets: 5000000,
        currentLiabilities: 2000000,
        inventory: 1000000
      });
      expect(evaluation.ratios.quickRatio.value).toBe(2.0);
      expect(evaluation.ratios.quickRatio.status).toBe('HEALTHY');
    });

    it('should compute Return on Assets (ROA) = Net Income / Total Assets correctly', () => {
      const evaluation = financialEcosystemService.evaluateAccountingRatios({
        totalRevenue: 10000000,
        totalExpenses: 7000000,
        totalAssets: 15000000
      });
      // Net Income = 3,000,000 / 15,000,000 = 0.20 (20%)
      expect(evaluation.ratios.returnOnAssets.percent).toBe(20.0);
      expect(evaluation.ratios.returnOnAssets.status).toBe('SUPERIOR');
    });
  });

  describe('4. Modernized Financial Models from Excel (18 Sheets)', () => {
    it('should maintain all 18 sheets from the financial blueprint', () => {
      const sheets = financialEcosystemService.getAllExcelSheets();
      expect(Object.keys(sheets).length).toBe(18);
      expect(sheets.sheet1_cost).toBeDefined();
      expect(sheets.sheet5_capex_opex_dancia4tv.totalBillOfQuantityNgn).toBe(1412050000.00);
      expect(sheets.sheet8_loan_request.loanPrincipalNgn).toBe(426700000.00);
      expect(sheets.sheet8_loan_request.annualInterestRatePercent).toBe(33.0);
      expect(sheets.sheet8_loan_request.primePlusInterestTotalNgn).toBe(567511000.00);
      expect(sheets.sheet17_amortization_schedule.monthlyBreakdown36Months.length).toBe(36);
    });
  });

  describe('5. Double-Entry Ledger & Profit Sweep', () => {
    it('should record transactions and update accumulated profit on profit sweeps', () => {
      const initialProfit = financialEcosystemService.getProfitRails().totalAccumulatedProfitNgn;
      const entry = financialEcosystemService.recordLedgerEntry({
        category: 'PROFIT_SWEEP',
        entryTitle: 'Weekly Surplus Settlement to Fidelity Bank Area 8',
        sourceService: 'Treasury Controller',
        amount: 5000000.00,
        currency: 'NGN'
      });
      expect(entry.id).toContain('TXN-');
      const updatedProfit = financialEcosystemService.getProfitRails().totalAccumulatedProfitNgn;
      expect(updatedProfit).toBe(initialProfit + 5000000.00);
    });
  });
});
