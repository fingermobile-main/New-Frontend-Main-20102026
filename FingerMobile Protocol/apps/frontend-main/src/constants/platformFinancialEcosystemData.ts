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
 * 6. Dynamic Financial Sheets:
 *    - 8. Income Statement (P&L)
 *    - 10. Balance Sheet
 *    - COST - TCC Infrastructure BoQ
 *    - 1. Required Start-Up Funds
 *    - CAPEX & OPEX (2) - Dancia-4Tv BoQ
 *    With CFO editing capability & SUPER ADMIN ONLY ratification/approval workflow!
 */

export type ApprovalStatus =
  | 'DRAFT'
  | 'PENDING_SUPER_ADMIN_APPROVAL'
  | 'APPROVED_BY_SUPER_ADMIN'
  | 'REVISION_REQUESTED';

export interface SheetApprovalMetadata {
  status: ApprovalStatus;
  lastEditedBy: string;
  lastEditedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
  version: number;
}

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
// DYNAMIC FINANCIAL SHEET INTERFACES (CFO Editable & Super Admin Ratified)
// ============================================================================

export interface FinancialLineItem {
  id: string;
  name: string;
  category: string;
  amountNgn: number;
  amountUsd?: number;
  quantity?: number;
  unitPriceNgn?: number;
  depreciationYears?: number;
  notes?: string;
  isCustom?: boolean;
}

export interface IncomeStatementSheetData {
  title: string;
  approval: SheetApprovalMetadata;
  revenues: FinancialLineItem[];
  cogs: FinancialLineItem[];
  opex: FinancialLineItem[];
  loanInterestAnnualNgn: number;
  /** Loan interest rate percentage (fluctuates annually — CFO-editable). Default 33% commercial rate. */
  loanInterestRatePercent?: number;
  /** Loan principal amount in Naira (CFO-editable). Used to recalculate annual debt service. */
  loanPrincipalNgn?: number;
  taxRatePercent: number;
}


export interface BalanceSheetData {
  title: string;
  approval: SheetApprovalMetadata;
  currentAssets: FinancialLineItem[];
  fixedAssets: FinancialLineItem[];
  accumulatedDepreciationNgn: number;
  currentLiabilities: FinancialLineItem[];
  longTermLiabilities: FinancialLineItem[];
  equityItems: FinancialLineItem[];
}

export interface CostTccBoqData {
  title: string;
  approval: SheetApprovalMetadata;
  usdExchangeRate: number; // e.g. 1 USD = ₦1,550 or ₦400 baseline
  items: FinancialLineItem[];
}

export interface StartupFundsData {
  title: string;
  approval: SheetApprovalMetadata;
  usdExchangeRate: number;
  fixedAssets: FinancialLineItem[];
  operatingCapital: FinancialLineItem[];
}

export interface CapexOpexDancia4TvData {
  title: string;
  approval: SheetApprovalMetadata;
  totalLoanAllocationNgn: number;
  usdExchangeRate: number;
  items: FinancialLineItem[];
}

// ============================================================================
// PRODUCTION CONSTANTS
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
    },
    {
      id: 'DIRECT-FCMB-NGN',
      currency: 'NGN',
      currencyName: 'Nigerian Naira (NGN) - Direct Pay',
      bankName: 'First City Monument Bank (FCMB)',
      accountName: 'FingerMobile Protocol Communication Company',
      accountNumber: '2004515736',
      ussdCode: 'N/A',
      swiftCode: 'FCMBNGLA',
      branch: 'Adeola Hopewell VI Lagos',
      address: 'Adeola Hopewell, Victoria Island, Lagos, Nigeria',
      purpose: 'FingerMobile Direct Pay - Primary Receiving & Payout Rail for Members, Franchise, Salaries, Grants & Storefronts',
      type: 'TOP_LINE_REVENUE',
      status: 'ACTIVE_ONLINE'
    },
    {
      id: 'DIRECT-FCMB-USD',
      currency: 'USD',
      currencyName: 'United States Dollar (USD) - Direct Pay',
      bankName: 'First City Monument Bank Ltd (Corr: CITIBANK NY CITIUS33XXX)',
      accountName: 'FingerMobile Protocol Communication',
      accountNumber: '2005377173',
      ussdCode: 'N/A',
      swiftCode: 'FCMBNGLAXXX',
      branch: 'Adeola Hopewell VI Lagos',
      address: 'Adeola Hopewell, Victoria Island, Lagos, Nigeria',
      purpose: 'FingerMobile Direct Pay - USD International Commercial Inflow & Creator Payout (Corr Acc: 36887918)',
      type: 'TOP_LINE_REVENUE',
      status: 'ACTIVE_ONLINE'
    },
    {
      id: 'DIRECT-FCMB-GBP',
      currency: 'GBP',
      currencyName: 'Great British Pound (GBP) - Direct Pay',
      bankName: 'First City Monument Bank Ltd (Corr: CITIBANK London CITIGB2LXXX)',
      accountName: 'FingerMobile Protocol Communication',
      accountNumber: '2005377269',
      ussdCode: 'N/A',
      swiftCode: 'FCMBNGLAXXX',
      branch: 'Adeola Hopewell VI Lagos',
      address: 'Adeola Hopewell, Victoria Island, Lagos, Nigeria',
      purpose: 'FingerMobile Direct Pay - GBP International Rail (IBAN: GB08CITI18500811871706 / Corr Acc: 11871706)',
      type: 'TOP_LINE_REVENUE',
      status: 'ACTIVE_ONLINE'
    },
    {
      id: 'DIRECT-FCMB-EUR',
      currency: 'EUR',
      currencyName: 'Euro (EUR) - Direct Pay',
      bankName: 'First City Monument Bank Ltd',
      accountName: 'FingerMobile Protocol Communication',
      accountNumber: '2005377283',
      ussdCode: 'N/A',
      swiftCode: 'FCMBNGLA',
      branch: 'Adeola Hopewell VI Lagos',
      address: 'Adeola Hopewell, Victoria Island, Lagos, Nigeria',
      purpose: 'FingerMobile Direct Pay - Eurozone Settlement Rail (Swift: FCMBNGLA / FCMBNGLAWEB)',
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

  const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 1.00;

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
// DYNAMIC EXCEL FINANCIAL SHEETS DEFAULT DATASETS (Auto-Populated with Platform Features)
// ============================================================================

export const DEFAULT_INCOME_STATEMENT: IncomeStatementSheetData = {
  title: '8. Income Statement (P&L) - FingerMobile Sovereign Enterprise',
  approval: {
    status: 'DRAFT',
    lastEditedBy: 'Mrs. Mbah Eunice Emonena (CFO & Co-Founder)',
    lastEditedAt: '2026-10-14 18:30:00 UTC',
    notes: 'CFO Working Draft — Unlocked for Active Financial Modeling and Micro-Management.',
    version: 1
  },
  revenues: [
    { id: 'rev_subscriptions', name: 'Platform Membership & Creator Subscriptions', category: 'Subscriptions', amountNgn: 450000000.00, notes: 'Explorer, Rising, Growth, Pro, Enterprise tiers' },
    { id: 'rev_storefronts', name: 'Multi-Vendor Marketplace Storefront Commissions', category: 'Marketplace', amountNgn: 320000000.00, notes: 'Physical & digital goods 0.75% - 5.0% commission' },
    { id: 'rev_canary_ads', name: 'Canary Ads Decentralized Advertising Network', category: 'Advertising', amountNgn: 180000000.00, notes: 'Sponsored feed banners, video pre-rolls, push promo' },
    { id: 'rev_dancia_vod', name: 'Dancia-4Tv Video-On-Demand (VOD) & PPV Streaming', category: 'Broadcasting', amountNgn: 150000000.00, notes: 'PayTV live sporting rights, movies, stem streams' },
    { id: 'rev_fic_minting', name: 'Infinity Coin (FIC) Vault Spreads & Swaps', category: 'Treasury & FX', amountNgn: 100000000.00, notes: '1 FIC = $0.05 USD / ₦65.00 NGN protocol swaps' },
    { id: 'rev_loansqr', name: 'LoanSqr SME Merchant Micro-Financing Interest', category: 'FinTech', amountNgn: 50000000.00, notes: 'Short-term supplier credit facilities' }
  ],
  cogs: [
    { id: 'cogs_creator_pool', name: 'Creator Revenue Share Pool (70% Direct Payout)', category: 'Creator Economy', amountNgn: 180000000.00, notes: 'Direct sovereign payout pool to creators & streamers' },
    { id: 'cogs_telebreeze_infra', name: 'Telebreeze Streaming CDN & Transcoding Bandwidth', category: 'Infrastructure', amountNgn: 65000000.00, notes: '4K live stream routing & low-latency edge servers' },
    { id: 'cogs_payment_rails', name: 'Fidelity Bank & Interbank Settlement Rail Fees', category: 'Banking', amountNgn: 37500000.00, notes: 'USSD, NIP, card acquiring interchange processing' },
    { id: 'cogs_cloud_storage', name: 'Storage Server Hardware & Cloud Fedora Instances', category: 'Storage', amountNgn: 30000000.00, notes: '300 TB user media vault and database replicas' }
  ],
  opex: [
    { id: 'opex_owners_comp', name: 'Owner\'s Executive Compensation (CFO, CEO, CTO, COO)', category: 'Executive Compensation', amountNgn: 175062342.00, notes: '4 Executive council members' },
    { id: 'opex_directors', name: 'Departmental Directors & Operational Heads (8 Staff)', category: 'Staff Compensation', amountNgn: 108000000.00, notes: 'Lead engineering, finance, security, and content' },
    { id: 'opex_tech_ops', name: 'Technical & Systems Engineering Personnel (8 Staff)', category: 'Technical Staff', amountNgn: 46800000.00, notes: 'Full-time DevOps, frontend, backend and QA' },
    { id: 'opex_marketing', name: 'National Strategic Marketing & Brand Publicity', category: 'Publicity', amountNgn: 60000000.00, notes: 'Multi-channel acquisition, media, billboards' },
    { id: 'opex_rent_utils', name: 'Technical Center Facility Rent & Broadband Links', category: 'Facility', amountNgn: 20637658.00, notes: 'TCC server building and enterprise satellite' },
    { id: 'opex_licenses', name: 'Regulatory NBC & NCC Statutory License Amortization', category: 'Compliance', amountNgn: 8000000.00, notes: '10-Year broadcast permits annual allotment' }
  ],
  loanInterestAnnualNgn: 140811000.00 / 3, // ₦46,937,000 per year (33% of ₦426.7M principal / 3yr term)
  loanInterestRatePercent: 33,              // 33% Commercial bank loan rate (CFO-adjustable annually)
  loanPrincipalNgn: 426700000,              // ₦426.7M total commercial loan principal
  taxRatePercent: 10.0                      // 10% CIT / CITA tax reserve (FIRS-adjustable, CFO-editable)
};

export const DEFAULT_BALANCE_SHEET: BalanceSheetData = {
  title: '10. Balance Sheet - FingerMobile Sovereign Enterprise',
  approval: {
    status: 'DRAFT',
    lastEditedBy: 'Mrs. Mbah Eunice Emonena (CFO & Co-Founder)',
    lastEditedAt: '2026-10-14 18:30:00 UTC',
    notes: 'CFO Working Draft — Unlocked for Active Financial Modeling and Micro-Management.',
    version: 1
  },
  currentAssets: [
    { id: 'ca_lagos_bank', name: 'Fidelity Bank Lagos Top-Line Revenue Clearing (5600792703)', category: 'Cash & Bank', amountNgn: 320000000.00 },
    { id: 'ca_abuja_bank', name: 'Fidelity Bank Abuja Area 8 Profit Surplus Vault (5601279229)', category: 'Cash & Bank', amountNgn: 124580000.00 },
    { id: 'ca_fic_reserve', name: 'Sovereign Vault Infinity Coin (FIC) Strategic Reserves', category: 'Digital Reserves', amountNgn: 200000000.00, notes: 'Backing treasury @ ₦65.00/FIC' },
    { id: 'ca_receivables', name: 'Accounts Receivable (Enterprise Clients & Storefronts)', category: 'Receivables', amountNgn: 37420000.00 },
    { id: 'ca_inventory', name: 'Digital & Physical Merchandising Inventory', category: 'Inventory', amountNgn: 85000000.00 }
  ],
  fixedAssets: [
    { id: 'fa_telecoms', name: 'TCC Infrastructure Servers, Switches, Inverters & Generators', category: 'TCC Equipment', amountNgn: 426700000.00, depreciationYears: 7 },
    { id: 'fa_broadcasting', name: 'Dancia-4Tv Broadcast Satellite Disks & Antennas', category: 'Broadcast Tech', amountNgn: 150000000.00, depreciationYears: 5 },
    { id: 'fa_vehicles', name: 'Operations & Dispatch Logistics Fleet', category: 'Vehicles', amountNgn: 44887780.00, depreciationYears: 5 },
    { id: 'fa_leasehold', name: 'Office Renovations, Interior & Building Improvements', category: 'Leasehold', amountNgn: 15412220.00, depreciationYears: 5 }
  ],
  accumulatedDepreciationNgn: 12500000.00,
  currentLiabilities: [
    { id: 'cl_accounts_payable', name: 'Accounts Payable & Vendor Obligations', category: 'Trade Payables', amountNgn: 92670333.33 },
    { id: 'cl_creator_escrow', name: 'Creator Escrow Vault Pending Milestone Releases', category: 'Escrow Liabilities', amountNgn: 150000000.00 }
  ],
  longTermLiabilities: [
    { id: 'lt_commercial_loan', name: '₦426.7M Commercial Bank Facility @ 33% Interest', category: 'Long-Term Facility', amountNgn: 378340666.67, notes: 'Tenor: 3 Years with 1-Year Moratorium' }
  ],
  equityItems: [
    { id: 'eq_founder_capital', name: 'Contributed Shareholder Paid-Up Capital', category: 'Owner Equity', amountNgn: 500000000.00 },
    { id: 'eq_retained_earnings', name: 'Retained Platform Surplus & Institutional Profits', category: 'Retained Earnings', amountNgn: 270489000.00 }
  ]
};

export const DEFAULT_COST_TCC_BOQ: CostTccBoqData = {
  title: 'COST - Technical Computing Center (TCC) Bill of Quantities',
  approval: {
    status: 'DRAFT',
    lastEditedBy: 'Mrs. Mbah Eunice Emonena (CFO & Co-Founder)',
    lastEditedAt: '2026-10-14 18:30:00 UTC',
    notes: 'CFO Working Draft — Unlocked for Active Financial Modeling and Micro-Management.',
    version: 1
  },
  usdExchangeRate: 1550,
  items: [
    { id: 'tcc_1', name: 'Telebreeze PayTV VOD DVB Equipment', category: 'Broadcast Tech', quantity: 2, unitPriceNgn: 174600000, amountNgn: 349200000, amountUsd: 225290.32, depreciationYears: 7 },
    { id: 'tcc_2', name: '62.5 KVA Power Generator System', category: 'Power', quantity: 2, unitPriceNgn: 2070000, amountNgn: 4140000, amountUsd: 2670.97, depreciationYears: 5 },
    { id: 'tcc_3', name: '12 KVA Power Inverter System', category: 'Power', quantity: 4, unitPriceNgn: 850000, amountNgn: 3400000, amountUsd: 2193.55, depreciationYears: 5 },
    { id: 'tcc_4', name: 'Server Room Cooling Precision Systems', category: 'HVAC', quantity: 2, unitPriceNgn: 395000, amountNgn: 790000, amountUsd: 509.68, depreciationYears: 5 },
    { id: 'tcc_5', name: 'T.C.C Design & Comp Off-Site Deployment', category: 'Professional Services', quantity: 1, unitPriceNgn: 810000, amountNgn: 810000, amountUsd: 522.58, depreciationYears: 5 },
    { id: 'tcc_6', name: 'Front-End HP Fedora Enterprise Servers', category: 'Compute', quantity: 4, unitPriceNgn: 510000, amountNgn: 2040000, amountUsd: 1316.13, depreciationYears: 4 },
    { id: 'tcc_7', name: 'Back-End Cisco ME 3750 Switches (Dual Set)', category: 'Networking', quantity: 2, unitPriceNgn: 15970000, amountNgn: 31940000, amountUsd: 20606.45, depreciationYears: 5 },
    { id: 'tcc_8', name: '300 TB High-Throughput Media Storage Servers', category: 'Storage', quantity: 1, unitPriceNgn: 1356000, amountNgn: 1356000, amountUsd: 874.84, depreciationYears: 5 },
    { id: 'tcc_9', name: '2.4M Channel Master V-SAT Satellite Link', category: 'Satellite Links', quantity: 2, unitPriceNgn: 1850000, amountNgn: 3700000, amountUsd: 2387.10, depreciationYears: 5 },
    { id: 'tcc_10', name: 'WISP Management Network Monitoring Suite (1 Yr)', category: 'Software Suite', quantity: 1, unitPriceNgn: 1600000, amountNgn: 1600000, amountUsd: 1032.26, depreciationYears: 3 },
    { id: 'tcc_11', name: 'Office Intranet Gigabit Structured Cabling', category: 'Networking', quantity: 1, unitPriceNgn: 467000, amountNgn: 467000, amountUsd: 301.29, depreciationYears: 5 },
    { id: 'tcc_12', name: '1200 Directional Omni Antennas', category: 'Antennas', quantity: 1, unitPriceNgn: 85000, amountNgn: 85000, amountUsd: 54.84, depreciationYears: 5 },
    { id: 'tcc_13', name: 'I7 XLM Engineer Laptops & Field Terminals', category: 'Client Terminals', quantity: 7, unitPriceNgn: 325000, amountNgn: 2275000, amountUsd: 1467.74, depreciationYears: 3 },
    { id: 'tcc_14', name: '21" Desktops Core i7 Operations Hubs', category: 'Client Terminals', quantity: 20, unitPriceNgn: 250000, amountNgn: 5000000, amountUsd: 3225.81, depreciationYears: 3 }
  ]
};

export const DEFAULT_STARTUP_FUNDS: StartupFundsData = {
  title: '1. Required Start-Up Funds - FingerMobile Capital Structure',
  approval: {
    status: 'DRAFT',
    lastEditedBy: 'Mrs. Mbah Eunice Emonena (CFO & Co-Founder)',
    lastEditedAt: '2026-10-14 18:30:00 UTC',
    notes: 'CFO Working Draft — Unlocked for Active Financial Modeling and Micro-Management.',
    version: 1
  },
  usdExchangeRate: 1550,
  fixedAssets: [
    { id: 'su_fa_leasehold', name: 'Building & Leasehold Improvements', category: 'Real Estate', amountUsd: 3000.00, amountNgn: 4650000.00, depreciationYears: 5 },
    { id: 'su_fa_telecoms', name: 'Telecommunications & Computing Equipment', category: 'Equipment', amountUsd: 625700.75, amountNgn: 969836162.50, depreciationYears: 7 },
    { id: 'su_fa_furniture', name: 'Office Furniture and Executive Fixtures', category: 'Furniture', amountUsd: 3000.00, amountNgn: 4650000.00, depreciationYears: 5 },
    { id: 'su_fa_vehicles', name: 'Operations & Dispatch Logistics Vehicles', category: 'Vehicles', amountUsd: 29925.19, amountNgn: 46384044.50, depreciationYears: 5 },
    { id: 'su_fa_other', name: 'Other Fixed Enterprise Infrastructure', category: 'Other Fixed', amountUsd: 3000.00, amountNgn: 4650000.00, depreciationYears: 5 }
  ],
  operatingCapital: [
    { id: 'su_op_salaries', name: 'Pre-Opening Salaries and Wages Reserve', category: 'Salaries', amountUsd: 44887.78, amountNgn: 69576059.00 },
    { id: 'su_op_insurance', name: 'Prepaid Commercial Insurance Premiums', category: 'Insurance', amountUsd: 1000.00, amountNgn: 1550000.00 },
    { id: 'su_op_rent', name: 'Rent and Leased Property Deposits', category: 'Deposits', amountUsd: 29925.19, amountNgn: 46384044.50 },
    { id: 'su_op_supplies', name: 'Supplies, Stationery and Office Consumables', category: 'Supplies', amountUsd: 1122.19, amountNgn: 1739394.50 },
    { id: 'su_op_ads', name: 'Advertising, Media PR & Launch Promotions', category: 'Marketing', amountUsd: 10000.00, amountNgn: 15500000.00 },
    { id: 'su_op_licenses', name: 'NBC-NCC 10-Year Commercial Operating Licenses', category: 'Regulatory', amountUsd: 73965.09, amountNgn: 114645889.50 },
    { id: 'su_op_working_capital', name: 'Working Capital Cash on Hand (Contingency)', category: 'Liquid Reserves', amountUsd: 18703.24, amountNgn: 28990022.00 }
  ]
};

export const DEFAULT_CAPEX_OPEX_DANCIA4TV: CapexOpexDancia4TvData = {
  title: 'CAPEX & OPEX (2) - Dancia-4Tv 1st Year Plan Bill of Quantity',
  approval: {
    status: 'DRAFT',
    lastEditedBy: 'Mrs. Mbah Eunice Emonena (CFO & Co-Founder)',
    lastEditedAt: '2026-10-14 18:30:00 UTC',
    notes: 'CFO Working Draft — Unlocked for Active Financial Modeling and Micro-Management.',
    version: 1
  },
  totalLoanAllocationNgn: 1412050000.00,
  usdExchangeRate: 1550,
  items: [
    { id: 'dancia_1', name: '1. Two (2) Year Land Leased Assets / Office Space Rent', category: 'Real Estate', amountNgn: 16000000.00, notes: '2 years @ ₦8,000,000/yr' },
    { id: 'dancia_2', name: '2. Telebreeze for PayTV VOD DVB Equipment', category: 'Broadcast Tech', amountNgn: 349200000.00, notes: '2 units @ ₦174,600,000' },
    { id: 'dancia_3', name: '3. Legal Counsel, Contracts & Regulatory Incorporation', category: 'Legal', amountNgn: 500000.00, notes: 'Statutory filing & deed seals' },
    { id: 'dancia_4', name: '4. Building Improvements and Office Renovation', category: 'Facilities', amountNgn: 8800000.00, notes: 'Server room prep & acoustics' },
    { id: 'dancia_5', name: '5. One-Year Broadband Dedicated Data Trunk Link', category: 'Comms', amountNgn: 4600000.00, notes: 'High-speed fiber connectivity' },
    { id: 'dancia_6', name: '6. Two-Year Overhead, Operations & Logistics Costs', category: 'Overhead', amountNgn: 62150000.00, notes: 'Operational contingency' },
    { id: 'dancia_7', name: '7. Tech Equipment Operation & Systems Development', category: 'R&D', amountNgn: 3500000.00, notes: 'Platform integration' },
    { id: 'dancia_8', name: '8. 3-Year International Content Acquisition (+EPL Rights)', category: 'Content Licensing', amountNgn: 550000000.00, notes: 'Premier league & global media' },
    { id: 'dancia_9', name: '9. 10-Year NBC & NCC Licenses, Permits and Clearances', category: 'Regulatory', amountNgn: 30000000.00, notes: '10-Year national broadcast license' },
    { id: 'dancia_10', name: '10. One-Year Domestic Content Development & Media Network', category: 'Production', amountNgn: 600000000.00, notes: 'Local film, music, short-dramas' },
    { id: 'dancia_11', name: '11. One-Year Strategic Marketing, Billboard & Ad Campaigns', category: 'Marketing', amountNgn: 60000000.00, notes: 'National promotional blitz' },
    { id: 'dancia_12', name: '12. Brand Identity, Promotion & Media Launch', category: 'Branding', amountNgn: 5000000.00, notes: 'PR events and agency services' },
    { id: 'dancia_13', name: '13. One-Year Inventory, Office Supplies & Stationeries', category: 'Supplies', amountNgn: 500000.00, notes: 'Consumables' },
    { id: 'dancia_14', name: '14. Fixed Working Capital Liquidity Buffer', category: 'Working Capital', amountNgn: 2000000.00, notes: 'Reserve liquidity' },
    { id: 'dancia_15', name: '15. Statutory Fixed Bank Escrow Deposit', category: 'Banking Deposit', amountNgn: 50000000.00, notes: 'Compulsory regulatory deposit' },
    { id: 'dancia_16', name: '16. Operations, Field Broadcast & Dispatch Vehicles', category: 'Logistics', amountNgn: 7000000.00, notes: 'Field fleet' },
    { id: 'dancia_17', name: '17. Shipping, Cargo Delivery and Customs Import Duties', category: 'Customs & Logistics', amountNgn: 2000000.00, notes: 'Port clearance & logistics' }
  ]
};

// Legacy backward-compatibility wrapper
export const EXCEL_SHEETS_DATA = {
  sheet1_cost: {
    title: DEFAULT_COST_TCC_BOQ.title,
    category: 'CAPEX & Infrastructure',
    totalNaira: DEFAULT_COST_TCC_BOQ.items.reduce((acc, it) => acc + it.amountNgn, 0),
    items: DEFAULT_COST_TCC_BOQ.items.map((it) => ({
      item: it.name,
      rateNgn: it.unitPriceNgn || 0,
      qty: it.quantity || 1,
      amountNgn: it.amountNgn,
      amountUsd: it.amountUsd || 0
    }))
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
    title: DEFAULT_STARTUP_FUNDS.title,
    totalFixedAssetsUsd: DEFAULT_STARTUP_FUNDS.fixedAssets.reduce((acc, it) => acc + (it.amountUsd || 0), 0),
    totalFixedAssetsNgn: DEFAULT_STARTUP_FUNDS.fixedAssets.reduce((acc, it) => acc + it.amountNgn, 0),
    fixedAssets: DEFAULT_STARTUP_FUNDS.fixedAssets.map((it) => ({
      category: it.name,
      amountUsd: it.amountUsd || 0,
      depreciationYears: it.depreciationYears || 5
    })),
    operatingCapital: DEFAULT_STARTUP_FUNDS.operatingCapital.map((it) => ({
      item: it.name,
      amountUsd: it.amountUsd || 0
    }))
  },
  sheet5_capex_opex_dancia4tv: {
    title: DEFAULT_CAPEX_OPEX_DANCIA4TV.title,
    totalBillOfQuantityNgn: DEFAULT_CAPEX_OPEX_DANCIA4TV.items.reduce((acc, it) => acc + it.amountNgn, 0),
    keyLineItems: DEFAULT_CAPEX_OPEX_DANCIA4TV.items.map((it) => ({
      item: it.name,
      amountNgn: it.amountNgn
    }))
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
    title: DEFAULT_INCOME_STATEMENT.title,
    grossRevenueYear1Ngn: DEFAULT_INCOME_STATEMENT.revenues.reduce((acc, it) => acc + it.amountNgn, 0),
    cogsYear1Ngn: DEFAULT_INCOME_STATEMENT.cogs.reduce((acc, it) => acc + it.amountNgn, 0),
    grossProfitYear1Ngn:
      DEFAULT_INCOME_STATEMENT.revenues.reduce((acc, it) => acc + it.amountNgn, 0) -
      DEFAULT_INCOME_STATEMENT.cogs.reduce((acc, it) => acc + it.amountNgn, 0),
    grossMarginPercent: 74.0,
    totalOpexYear1Ngn: DEFAULT_INCOME_STATEMENT.opex.reduce((acc, it) => acc + it.amountNgn, 0),
    operatingProfitYear1Ngn: 519000000.00,
    taxAndInterestYear1Ngn: 140811000.00,
    netIncomeYear1Ngn: 378189000.00,
    netProfitMarginPercent: 30.25
  },
  sheet13_balance_sheet: {
    title: DEFAULT_BALANCE_SHEET.title,
    totalAssetsNgn: 1391500000.00,
    currentAssetsNgn: DEFAULT_BALANCE_SHEET.currentAssets.reduce((acc, it) => acc + it.amountNgn, 0),
    fixedAssetsNgn: DEFAULT_BALANCE_SHEET.fixedAssets.reduce((acc, it) => acc + it.amountNgn, 0),
    totalLiabilitiesNgn: 621011000.00,
    currentLiabilitiesNgn: DEFAULT_BALANCE_SHEET.currentLiabilities.reduce((acc, it) => acc + it.amountNgn, 0),
    longTermDebtNgn: DEFAULT_BALANCE_SHEET.longTermLiabilities.reduce((acc, it) => acc + it.amountNgn, 0),
    totalEquityNgn: DEFAULT_BALANCE_SHEET.equityItems.reduce((acc, it) => acc + it.amountNgn, 0),
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
