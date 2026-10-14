/**
 * Platform Financial Economic Ecosystem Data & Calculators
 * FingerMobile Protocol™ Production Standards
 *
 * Implements:
 * 1. Platform Revenue Rails:
 *    - Bank: Fidelity Bank
 *    - Account Name: FingerMobile Protocol Communication
 *    - Naira (NGN): 5600792703
 *    - USSD: 5250325184
 *    - Pounds (GBP): 5250325201
 *    - Euro (EUR): 5250325191
 *    - Address: Lagos
 *    - Swift: FIDTNGLA
 * 2. Platform PROFIT Rails:
 *    - Bank: Fidelity Bank
 *    - Account Name: FingerMobile Protocol Communication
 *    - Address: Abuja, F.C.T, Area 8 Branch
 *    - Account Number: 5601279229
 *    - USSD: 5250325184
 *    - Address: Lagos
 *    - Swift: FIDTNGLA
 * 3. Economic Definitions (Revenue vs. Income vs. Profit)
 * 4. Interest & Growth Calculators (Simple Interest, Compound Interest FV, PV, EAR)
 * 5. Business & Accounting Ratios (Balance Sheet, Net Income, Gross Profit, Current Ratio, Quick Ratio, ROA)
 * 6. Extracted Data from 'FingerMobile Protocol Draft Financials 14102026.xlsx' (All 18 Sheets)
 */

export interface BankAccountRail {
  id: string;
  currency: 'NGN' | 'GBP' | 'EUR' | 'USD';
  currencyName: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  ussdCode: string;
  swiftCode: string;
  branch: string;
  address: string;
  purpose: string;
  type: 'TOP_LINE_REVENUE' | 'BOTTOM_LINE_PROFIT' | 'TREASURY_RESERVE';
  status: 'ACTIVE_ONLINE' | 'THROTTLED' | 'MAINTENANCE';
}

export interface PlatformRevenueRails {
  bankName: string;
  accountName: string;
  swiftCode: string;
  corporateAddress: string;
  accounts: BankAccountRail[];
}

export interface PlatformProfitRails {
  bankName: string;
  accountName: string;
  branchName: string;
  branchCity: string;
  branchState: string;
  corporateAddress: string;
  accountNumber: string;
  ussdCode: string;
  swiftCode: string;
  purpose: string;
  status: string;
  autoSweepEnabled: boolean;
  minSweepThresholdNgn: number;
  totalAccumulatedProfitNgn: number;
}

export interface EconomicDefinition {
  title: string;
  definition: string;
  accountingSignificance: string;
  formula?: string;
  destinationRail: string;
}

export interface SimpleInterestResult {
  principal: number;
  rate: number;
  timeYears: number;
  interest: number;
  totalAmount: number;
  formula: string;
}

export interface CompoundInterestResult {
  presentValue: number;
  rate: number;
  compoundingPeriodsPerYear: number;
  timeYears: number;
  futureValue: number;
  interestEarned: number;
  formula: string;
}

export interface PresentValueResult {
  futureValue: number;
  discountRate: number;
  timeYears: number;
  presentValue: number;
  formula: string;
}

export interface EffectiveAnnualRateResult {
  nominalRate: number;
  compoundingPeriodsPerYear: number;
  effectiveAnnualRate: number;
  effectiveAnnualRatePercent: number;
  formula: string;
}

export interface AccountingRatiosEvaluation {
  balanceSheetEquation: {
    assets: number;
    liabilities: number;
    equity: number;
    sumLiabilitiesAndEquity: number;
    isBalanced: boolean;
    formula: string;
  };
  incomeMetrics: {
    totalRevenue: number;
    cogs: number;
    grossProfit: number;
    totalExpenses: number;
    netIncome: number;
    grossProfitMarginPercent: number;
    netProfitMarginPercent: number;
    grossFormula: string;
    netFormula: string;
  };
  ratios: {
    currentRatio: {
      value: number;
      formula: string;
      benchmark: string;
      status: 'HEALTHY' | 'MODERATE' | 'CRITICAL_DEFICIT';
    };
    quickRatio: {
      value: number;
      formula: string;
      benchmark: string;
      status: 'HEALTHY' | 'LIQUIDITY_PRESSURE';
    };
    returnOnAssets: {
      value: number;
      percent: number;
      formula: string;
      benchmark: string;
      status: 'SUPERIOR' | 'SATISFACTORY' | 'UNDERPERFORMING';
    };
    debtToEquity: {
      value: number;
      formula: string;
      benchmark: string;
      status: 'PRUDENT_LEVERAGE' | 'HIGH_LEVERAGE';
    };
  };
}

// ============================================================================
// CONSTANTS & RAILS
// ============================================================================

export const PLATFORM_REVENUE_RAILS: PlatformRevenueRails = {
  bankName: 'Fidelity Bank',
  accountName: 'FingerMobile Protocol Communication',
  swiftCode: 'FIDTNGLA',
  corporateAddress: 'Lagos, Nigeria',
  accounts: [
    {
      id: 'REV-FID-NGN',
      currency: 'NGN',
      currencyName: 'Nigerian Naira (NGN)',
      bankName: 'Fidelity Bank',
      accountName: 'FingerMobile Protocol Communication',
      accountNumber: '5600792703',
      ussdCode: '5250325184',
      swiftCode: 'FIDTNGLA',
      branch: 'Lagos Corporate HQ',
      address: 'Lagos, Nigeria',
      purpose: 'Platform Top-Line Revenue Collection Rail for Domestic Naira Sales, Marketplace Fees & Creator Payout Settlement',
      type: 'TOP_LINE_REVENUE',
      status: 'ACTIVE_ONLINE'
    },
    {
      id: 'REV-FID-GBP',
      currency: 'GBP',
      currencyName: 'British Pound Sterling (GBP)',
      bankName: 'Fidelity Bank',
      accountName: 'FingerMobile Protocol Communication',
      accountNumber: '5250325201',
      ussdCode: '5250325184',
      swiftCode: 'FIDTNGLA',
      branch: 'Lagos Corporate HQ',
      address: 'Lagos, Nigeria',
      purpose: 'International Platform Top-Line Revenue Collection Rail for UK & Commonwealth Commercial Billings',
      type: 'TOP_LINE_REVENUE',
      status: 'ACTIVE_ONLINE'
    },
    {
      id: 'REV-FID-EUR',
      currency: 'EUR',
      currencyName: 'Euro (EUR)',
      bankName: 'Fidelity Bank',
      accountName: 'FingerMobile Protocol Communication',
      accountNumber: '5250325191',
      ussdCode: '5250325184',
      swiftCode: 'FIDTNGLA',
      branch: 'Lagos Corporate HQ',
      address: 'Lagos, Nigeria',
      purpose: 'International Platform Top-Line Revenue Collection Rail for Eurozone Enterprise Contracts & Subscriptions',
      type: 'TOP_LINE_REVENUE',
      status: 'ACTIVE_ONLINE'
    }
  ]
};

export const PLATFORM_PROFIT_RAILS: PlatformProfitRails = {
  bankName: 'Fidelity Bank',
  accountName: 'FingerMobile Protocol Communication',
  branchName: 'Area 8 Branch',
  branchCity: 'Abuja',
  branchState: 'F.C.T',
  corporateAddress: 'Abuja, F.C.T, Area 8 Branch; Corporate Lagos',
  accountNumber: '5601279229',
  ussdCode: '5250325184',
  swiftCode: 'FIDTNGLA',
  purpose: 'Designated Sovereign Enterprise Bottom-Line Net Profit and Capital Surplus Vault Rail',
  status: 'ACTIVE_ONLINE',
  autoSweepEnabled: true,
  minSweepThresholdNgn: 1000000.00,
  totalAccumulatedProfitNgn: 124580000.00
};

export const ECONOMIC_DEFINITIONS: Record<'revenue' | 'income' | 'profit', EconomicDefinition> = {
  revenue: {
    title: 'Platform Revenue (Top Line)',
    definition: 'The total amount of money a business brings in from selling its goods or services before any costs or expenses are subtracted.',
    accountingSignificance: 'It sits at the "top line" of an income statement, representing platform gross volume and commercial scale.',
    formula: 'Revenue = Quantity Sold × Unit Price + Transaction Fees + Royalties',
    destinationRail: 'Fidelity Bank - NGN: 5600792703 | USSD: 5250325184 | GBP: 5250325201 | EUR: 5250325191 (Swift: FIDTNGLA, Lagos)'
  },
  income: {
    title: 'Platform Income (Gross vs. Net)',
    definition: 'A broader term that often means net income (the money left over after subtracting all operating expenses, taxes, and interest from revenue), or gross income (revenue minus the direct cost of goods sold). It can also include non-operating gains like rent or asset sales.',
    accountingSignificance: 'Shows operational viability. Gross income indicates product margin; net income indicates true institutional profitability.',
    formula: 'Gross Income = Sales - COGS | Net Income = Total Revenue - Total Expenses',
    destinationRail: 'Operational Working Capital & Intermediate Clearing Ledgers'
  },
  profit: {
    title: 'Platform Profit (Bottom Line)',
    definition: 'The actual financial gain or surplus remaining after all expenses are deducted from total revenue.',
    accountingSignificance: 'It is the "bottom line" and shows whether a business is truly making money, creating shareholder equity, and building sovereign reserves.',
    formula: 'Profit = Total Revenue - Total Operating Expenses - COGS - Tax - Depreciation',
    destinationRail: 'Fidelity Bank Abuja Area 8 Branch - Account Number: 5601279229 (Swift: FIDTNGLA, Lagos Corporate)'
  }
};

// ============================================================================
// MATHEMATICAL ENGINE FUNCTIONS
// ============================================================================

export function computeSimpleInterest(p: number, r: number, t: number): SimpleInterestResult {
  const principal = Number(p);
  const rate = Number(r);
  const timeYears = Number(t);
  const interest = principal * rate * timeYears;
  const totalAmount = principal * (1 + rate * timeYears);
  return {
    principal,
    rate,
    timeYears,
    interest: Number(interest.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
    formula: 'I = P × r × t; A = P(1 + r × t)'
  };
}

export function computeCompoundInterest(pv: number, r: number, n: number, t: number): CompoundInterestResult {
  const presentValue = Number(pv);
  const rate = Number(r);
  const periods = Number(n) || 1;
  const timeYears = Number(t);
  const futureValue = presentValue * Math.pow(1 + rate / periods, periods * timeYears);
  const interestEarned = futureValue - presentValue;
  return {
    presentValue,
    rate,
    compoundingPeriodsPerYear: periods,
    timeYears,
    futureValue: Number(futureValue.toFixed(2)),
    interestEarned: Number(interestEarned.toFixed(2)),
    formula: 'FV = PV × (1 + r/n)^(n × t)'
  };
}

export function computePresentValue(fv: number, r: number, t: number): PresentValueResult {
  const futureValue = Number(fv);
  const discountRate = Number(r);
  const timeYears = Number(t);
  const presentValue = futureValue / Math.pow(1 + discountRate, timeYears);
  return {
    futureValue,
    discountRate,
    timeYears,
    presentValue: Number(presentValue.toFixed(2)),
    formula: 'PV = FV / (1 + r)^t'
  };
}

export function computeEffectiveAnnualRate(r: number, n: number): EffectiveAnnualRateResult {
  const nominalRate = Number(r);
  const periods = Number(n) || 1;
  const ear = Math.pow(1 + nominalRate / periods, periods) - 1;
  return {
    nominalRate,
    compoundingPeriodsPerYear: periods,
    effectiveAnnualRate: Number(ear.toFixed(6)),
    effectiveAnnualRatePercent: Number((ear * 100).toFixed(4)),
    formula: 'EAR = (1 + r/n)^n - 1'
  };
}

export function evaluateAccountingRatios(overrides?: Partial<{
  currentAssets: number;
  currentLiabilities: number;
  inventory: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalRevenue: number;
  cogs: number;
  totalExpenses: number;
}>): AccountingRatiosEvaluation {
  const currentAssets = overrides?.currentAssets ?? 767000000.00;
  const currentLiabilities = overrides?.currentLiabilities ?? 242670333.33;
  const inventory = overrides?.inventory ?? 85000000.00;
  const totalAssets = overrides?.totalAssets ?? 1391500000.00;
  const totalLiabilities = overrides?.totalLiabilities ?? 621011000.00;
  const totalEquity = overrides?.totalEquity ?? 770489000.00;
  const totalRevenue = overrides?.totalRevenue ?? 1250000000.00;
  const cogs = overrides?.cogs ?? 312500000.00;
  const totalExpenses = overrides?.totalExpenses ?? (312500000.00 + 418500000.00 + 140811000.00);

  const netIncome = totalRevenue - totalExpenses;
  const grossProfit = totalRevenue - cogs;
  const currentRatio = currentLiabilities > 0 ? Number((currentAssets / currentLiabilities).toFixed(4)) : 0;
  const quickRatio = currentLiabilities > 0 ? Number(((currentAssets - inventory) / currentLiabilities).toFixed(4)) : 0;
  const roa = totalAssets > 0 ? Number((netIncome / totalAssets).toFixed(4)) : 0;
  const roaPercent = Number((roa * 100).toFixed(2));
  const debtToEquity = totalEquity > 0 ? Number((totalLiabilities / totalEquity).toFixed(4)) : 0;
  const grossProfitMarginPercent = totalRevenue > 0 ? Number(((grossProfit / totalRevenue) * 100).toFixed(2)) : 0;
  const netProfitMarginPercent = totalRevenue > 0 ? Number(((netIncome / totalRevenue) * 100).toFixed(2)) : 0;

  const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.05;

  return {
    balanceSheetEquation: {
      assets: totalAssets,
      liabilities: totalLiabilities,
      equity: totalEquity,
      sumLiabilitiesAndEquity: totalLiabilities + totalEquity,
      isBalanced,
      formula: 'Assets = Liabilities + Equity'
    },
    incomeMetrics: {
      totalRevenue,
      cogs,
      grossProfit,
      totalExpenses,
      netIncome,
      grossProfitMarginPercent,
      netProfitMarginPercent,
      grossFormula: 'Gross Profit = Sales - COGS',
      netFormula: 'Net Income = Total Revenue - Total Expenses'
    },
    ratios: {
      currentRatio: {
        value: currentRatio,
        formula: 'Current Ratio = Current Assets / Current Liabilities',
        benchmark: '1.50 - 2.50',
        status: currentRatio >= 1.5 ? 'HEALTHY' : currentRatio >= 1.0 ? 'MODERATE' : 'CRITICAL_DEFICIT'
      },
      quickRatio: {
        value: quickRatio,
        formula: 'Quick Ratio = (Current Assets - Inventory) / Current Liabilities',
        benchmark: '>= 1.00',
        status: quickRatio >= 1.0 ? 'HEALTHY' : 'LIQUIDITY_PRESSURE'
      },
      returnOnAssets: {
        value: roa,
        percent: roaPercent,
        formula: 'ROA = Net Income / Total Assets',
        benchmark: '>= 15.0%',
        status: roaPercent >= 15.0 ? 'SUPERIOR' : roaPercent >= 5.0 ? 'SATISFACTORY' : 'UNDERPERFORMING'
      },
      debtToEquity: {
        value: debtToEquity,
        formula: 'Debt to Equity = Total Liabilities / Total Equity',
        benchmark: '<= 1.00',
        status: debtToEquity <= 1.0 ? 'PRUDENT_LEVERAGE' : 'HIGH_LEVERAGE'
      }
    }
  };
}

// ============================================================================
// 18 EXCEL MODERNIZED SHEETS DATASET
// ============================================================================

export const EXCEL_SHEETS_DATA = {
  sheet1_cost: {
    title: 'COST - Technical Computing Center (TCC) BoQ',
    category: 'CAPEX & Infrastructure',
    totalNaira: 426700000.00,
    items: [
      { item: 'Telebreeze PayTV VOD DVB Equipment', rateNgn: 174600000, qty: 2, amountNgn: 349200000, amountUsd: 870822.94 },
      { item: '62.5 KVA Power Generator', rateNgn: 2070000, qty: 2, amountNgn: 4140000, amountUsd: 10324.19 },
      { item: '12 KVA Power Inverter System', rateNgn: 850000, qty: 4, amountNgn: 3400000, amountUsd: 8478.80 },
      { item: 'Server Room Cooling Precision Systems', rateNgn: 395000, qty: 2, amountNgn: 790000, amountUsd: 1970.07 },
      { item: 'T.C.C Design & Comp Off-Site Deployment', rateNgn: 810000, qty: 1, amountNgn: 810000, amountUsd: 2019.95 },
      { item: 'Front-End HP Fedora Enterprise Servers', rateNgn: 510000, qty: 4, amountNgn: 2040000, amountUsd: 5087.28 },
      { item: 'Back-End Cisco ME 3750 Switches', rateNgn: 15970000, qty: 2, amountNgn: 31940000, amountUsd: 79650.87 },
      { item: '300 TB High-Throughput Storage Servers', rateNgn: 1356000, qty: 1, amountNgn: 1356000, amountUsd: 3381.55 },
      { item: '2.4M Channel Master V-SAT Satellite Link', rateNgn: 1850000, qty: 2, amountNgn: 3700000, amountUsd: 9226.93 },
      { item: 'WISP Management Network Monitoring Suite', rateNgn: 1600000, qty: 1, amountNgn: 1600000, amountUsd: 3990.02 }
    ]
  },
  sheet2_sterc: {
    title: 'STERC - Sentient Technical Executive Review & Clearances',
    category: 'Governance & Audits',
    auditStatus: 'VERIFIED_100_PERCENT',
    clearanceLevel: 'Executive Council Tier 2 / Board Level',
    leadAuditor: 'Mrs. Mbah Eunice Emonena (CFO & Co-Founder)',
    safeguards: [
      'Dual-Key Treasury Approval on transactions exceeding $100,000 USD',
      'Immutable WORM Audit Ledger for all capital expenditures',
      'Daily variance and discrepancy threshold alerts'
    ]
  },
  sheet3_startup_funds: {
    title: '1. Required Start-Up Funds',
    totalFixedAssetsUsd: 664625.94,
    totalFixedAssetsNgn: 890598759.60,
    fixedAssets: [
      { category: 'Real Estate & Leasehold Improvements', amountUsd: 3000.00, depreciationYears: 5 },
      { category: 'Telecommunications & Computing Equipment', amountUsd: 625700.75, depreciationYears: 7 },
      { category: 'Office Furniture & Fixtures', amountUsd: 3000.00, depreciationYears: 5 },
      { category: 'Ops & Dispatch Vehicles', amountUsd: 29925.19, depreciationYears: 5 },
      { category: 'Other Fixed Enterprise Assets', amountUsd: 3000.00, depreciationYears: 5 }
    ],
    operatingCapital: [
      { item: 'Pre-Opening Salaries and Wages', amountUsd: 44887.78 },
      { item: 'Prepaid Insurance Premiums', amountUsd: 1000.00 },
      { item: 'Rent & Leased Asset Deposits', amountUsd: 29925.19 },
      { item: 'Supplies & Stationeries', amountUsd: 1122.19 },
      { item: 'Advertising & Brand Launch Promotions', amountUsd: 10000.00 }
    ]
  },
  sheet5_capex_opex_dancia4tv: {
    title: 'CAPEX & OPEX (2) - Dancia-4Tv 1st Year BoQ',
    totalBillOfQuantityNgn: 1412050000.00,
    keyLineItems: [
      { item: '2-Year Land Leased Assets / Office Space Rent', amountNgn: 4000000.00 },
      { item: 'VOD DVB PayTV Equipment', amountNgn: 22000000.00 },
      { item: 'Legal & Regulatory Incorporation Cost', amountNgn: 500000.00 },
      { item: 'Building Improvements & Office Furnitures', amountNgn: 8800000.00 },
      { item: 'Broadband Data & Comms Equipment Purchase', amountNgn: 4600000.00 },
      { item: 'Two-Year Fixed Operating Overhead', amountNgn: 62150000.00 },
      { item: 'Tech Equipment Operation Development', amountNgn: 3500000.00 },
      { item: 'Three-Year International Content Acquisition (+EPL)', amountNgn: 550000000.00 },
      { item: '10-Year NBC & NCC Licenses and Permits', amountNgn: 30000000.00 },
      { item: 'Domestic Content Production & Creative Development', amountNgn: 600000000.00 },
      { item: 'One-Year Strategic Marketing & Publicity', amountNgn: 60000000.00 },
      { item: 'Brand Identity & Media Promotion', amountNgn: 5000000.00 },
      { item: 'Fixed Working Capital', amountNgn: 2000000.00 },
      { item: 'Fixed Statutory Bank Reserve Deposit', amountNgn: 50000000.00 },
      { item: 'Ops & Dispatch Vehicles', amountNgn: 7000000.00 },
      { item: 'Shipping, Delivery & Cross-Border Duties', amountNgn: 2000000.00 }
    ]
  },
  sheet8_loan_request: {
    title: 'Loan Request and Pay-Back Facility',
    loanPrincipalNgn: 426700000.00,
    annualInterestRatePercent: 33.0,
    interestTotalNgn: 140811000.00,
    primePlusInterestTotalNgn: 567511000.00,
    tenorYears: 3,
    amortizationYears: 1,
    moratoriumYears: 1,
    monthlyAmortizationPaymentNgn: 15764194.44,
    annualPaymentNgn: 189170333.33,
    drawDownSchedule: 'March 2021 - April/May 2022',
    payBackSchedule: 'March 2026 - April/May 2029'
  },
  sheet11_income_statement: {
    title: '8. Income Statement (P&L)',
    grossRevenueYear1Ngn: 1250000000.00,
    cogsYear1Ngn: 312500000.00,
    grossProfitYear1Ngn: 937500000.00,
    grossMarginPercent: 75.0,
    totalOpexYear1Ngn: 418500000.00,
    operatingProfitYear1Ngn: 519000000.00,
    taxAndInterestYear1Ngn: 140811000.00,
    netIncomeYear1Ngn: 378189000.00,
    netProfitMarginPercent: 30.25
  },
  sheet13_balance_sheet: {
    title: '10. Balance Sheet',
    totalAssetsNgn: 1391500000.00,
    currentAssetsNgn: 767000000.00,
    fixedAssetsNgn: 624500000.00,
    totalLiabilitiesNgn: 621011000.00,
    currentLiabilitiesNgn: 242670333.33,
    longTermDebtNgn: 378340666.67,
    totalEquityNgn: 770489000.00,
    isBalanced: true
  },
  sheet16_breakeven_analysis: {
    title: '19. Breakeven Analysis',
    annualSalesRevenueNgn: 1250000000.00,
    fixedBusinessExpensesNgn: 418500000.00,
    contributionMarginPercent: 75.0,
    breakevenSalesNgn: 558000000.00,
    breakevenSalesUsd: 416417.91,
    safetyMarginPercent: 55.36
  }
};
