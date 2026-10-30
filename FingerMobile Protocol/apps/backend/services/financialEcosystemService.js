/**
 * Comprehensive Financial Economic Ecosystem Service
 * FingerMobile Protocol™ Production Architecture
 *
 * Implements:
 * 1. Platform Revenue Destination Rails (Fidelity Bank - NGN 5600792703, USSD 5250325184, GBP 5250325201, EUR 5250325191, Swift: FIDTNGLA)
 * 2. Platform PROFIT Destination Rails (Fidelity Bank Abuja Area 8 Branch - 5601279229, USSD 5250325184, Swift: FIDTNGLA)
 * 3. Core Economic Foundations (Revenue vs. Income vs. Profit)
 * 4. Interest & Growth Mathematical Engines (Simple Interest, Compound Interest FV, PV, EAR)
 * 5. Business & Accounting Ratios (Balance Sheet Equation, Net Income, Gross Profit, Current Ratio, Quick Ratio, ROA)
 * 6. Extracted Financial Models from 'FingerMobile Protocol Draft Financials 14102026.xlsx' (All 18 Sheets)
 */

const db = require('../db');
const logger = require('../utils/logger');

// In-Memory Thread-Safe State with PostgreSQL persistence hooks
class FinancialEcosystemService {
  constructor() {
    this.initDestinationRails();
    this.initDefinitions();
    this.initFinancialSheetsData();
    this.initLedger();
  }

  initDestinationRails() {
    this.revenueRails = {
      bankName: 'Fidelity Bank',
      accountName: 'FingerMobile Protocol Communication',
      swiftCode: 'FIDTNGLA',
      headquartersAddress: 'Lagos, Nigeria',
      accounts: [
        {
          id: 'REV-NGN',
          currency: 'NGN',
          currencyName: 'Nigerian Naira',
          accountNumber: '5600792703',
          ussdCode: '5250325184',
          purpose: 'Primary Platform Revenue Collection Rail (Storefronts, Subscriptions, PayLinks, Ads, Fees)',
          status: 'ACTIVE_ONLINE'
        },
        {
          id: 'REV-GBP',
          currency: 'GBP',
          currencyName: 'British Pound Sterling',
          accountNumber: '5250325201',
          ussdCode: '5250325184',
          purpose: 'International Platform Revenue Collection Rail (UK & European Commercial Partners)',
          status: 'ACTIVE_ONLINE'
        },
        {
          id: 'REV-EUR',
          currency: 'EUR',
          currencyName: 'Euro',
          accountNumber: '5250325191',
          ussdCode: '5250325184',
          purpose: 'International Platform Revenue Collection Rail (Eurozone Commercial Subscriptions & Sales)',
          status: 'ACTIVE_ONLINE'
        }
      ]
    };

    this.profitRails = {
      bankName: 'Fidelity Bank',
      accountName: 'FingerMobile Protocol Communication',
      branchName: 'Area 8 Branch',
      branchCity: 'Abuja',
      branchState: 'F.C.T',
      corporateAddress: 'Abuja, F.C.T, Area 8 Branch; Corporate Lagos',
      accountNumber: '5601279229',
      ussdCode: '5250325184',
      swiftCode: 'FIDTNGLA',
      purpose: 'Designated Sovereign Enterprise Bottom-Line Profit and Financial Surplus Vault Rail',
      status: 'ACTIVE_ONLINE',
      autoSweepEnabled: true,
      sweepThresholdNgn: 1000000.00,
      totalAccumulatedProfitNgn: 124580000.00
    };
  }

  initDefinitions() {
    this.economicDefinitions = {
      revenue: {
        title: 'Platform Top-Line Revenue',
        definition: 'The total amount of money a business brings in from selling its goods or services before any costs or expenses are subtracted. It sits at the "top line" of an income statement.',
        designatedDestination: 'Fidelity Bank - NGN: 5600792703 / GBP: 5250325201 / EUR: 5250325191 / USSD: 5250325184 (Swift: FIDTNGLA)'
      },
      income: {
        title: 'Platform Income (Gross vs. Net)',
        definition: 'A broader term that often means net income (the money left over after subtracting all operating expenses, taxes, and interest from revenue), or gross income (revenue minus the direct cost of goods sold). It can also include non-operating gains like rent or asset sales.',
        formulaGross: 'Gross Income / Gross Profit = Sales - COGS (Cost of Goods Sold)',
        formulaNet: 'Net Income = Total Revenue - Total Expenses (COGS + OPEX + Taxes + Interest)'
      },
      profit: {
        title: 'Platform Bottom-Line Profit & Financial Surplus',
        definition: 'The actual financial gain or surplus remaining after all expenses are deducted from total revenue. It is the "bottom line" and shows whether a business is truly making money and generating shareholder value.',
        designatedDestination: 'Fidelity Bank Abuja Area 8 Branch - Account Number: 5601279229 / USSD: 5250325184 (Swift: FIDTNGLA)'
      }
    };
  }

  initFinancialSheetsData() {
    // 18 Sheets extracted and modernized from FingerMobile Protocol Draft Financials 14102026.xlsx
    this.excelSheets = {
      sheet1_cost: {
        title: 'COST - Technical Computing Center (TCC) Bill of Quantities',
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
        leadAuditor: 'Mrs. Mbah Eunice Emonena (CFO & Co-Founder)'
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
      sheet4_capex_opex_mirella: {
        title: 'CAPEX & OPEX - Gracelink Mirella 1st Year Plan',
        operationalBaseNgn: 12000000.00,
        mirellaIndividualPoolNgn: 200000000.00,
        totalStartupAllocationNgn: 426700000.00
      },
      sheet5_capex_opex_dancia4tv: {
        title: 'CAPEX & OPEX (2) - Dancia-4Tv 1st Year BoQ',
        totalBillOfQuantityNgn: 1412050000.00,
        totalLoanAllocationNgn: 1412050000.00,
        usdExchangeRate: 1550,
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
        ],
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
      },
      sheet6_salaries: {
        title: '2. Salaries and Wages Schedule',
        headcountTotal: 24,
        monthlyTotalUsd: 167144.00,
        yearOneTotalUsd: 2005728.00,
        yearTwoTotalUsd: 2507160.00,
        yearThreeTotalUsd: 3760740.00,
        breakdown: [
          { roleCategory: 'Owner\'s Executive Compensation', staffCount: 4, monthlyUsd: 22443.89, year1Usd: 269326.68 },
          { roleCategory: 'Departmental Directors & Heads', staffCount: 8, monthlyUsd: 60000.00, year1Usd: 720000.00 },
          { roleCategory: 'Full-Time Technical & Ops Staff', staffCount: 8, monthlyUsd: 26000.00, year1Usd: 312000.00 },
          { roleCategory: 'Part-Time Specialized Personnel', staffCount: 4, monthlyUsd: 1144.00, year1Usd: 13728.00 },
          { roleCategory: 'Independent Contractors & Tech Quants', staffCount: 4, monthlyUsd: 80000.00, year1Usd: 960000.00 }
        ]
      },
      sheet7_operating_expenses: {
        title: '3. Fixed Operating Expenses',
        monthlyTotalUsd: 8364.51,
        yearOneTotalUsd: 100374.19,
        yearTwoTotalUsd: 125467.74,
        yearThreeTotalUsd: 188201.61,
        expenses: [
          { expense: 'Global & Domestic Advertising', monthlyUsd: 3750.00, year1Usd: 45000.00 },
          { expense: 'Vehicles, Logistics & Dispatch Maintenance', monthlyUsd: 635.48, year1Usd: 7625.81 },
          { expense: 'Software Dues & Enterprise Cloud Subscriptions', monthlyUsd: 425.81, year1Usd: 5109.68 },
          { expense: 'General Enterprise Liability Insurance', monthlyUsd: 500.00, year1Usd: 6000.00 },
          { expense: 'Statutory Licenses, Fees and Permits', monthlyUsd: 1677.42, year1Usd: 20129.03 },
          { expense: 'Legal, Corporate Secretarial & Professional Fees', monthlyUsd: 800.00, year1Usd: 9600.00 },
          { expense: 'Office Operations & Consumable Supplies', monthlyUsd: 325.81, year1Usd: 3909.68 },
          { expense: 'Corporate Property Leasehold Rent', monthlyUsd: 623.42, year1Usd: 7481.03 }
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
      sheet9_sales_forecast: {
        title: '4. Projected Sales Forecast',
        yearOneForecastNgn: 1250000000.00,
        yearTwoGrowthPercent: 25.0,
        yearTwoForecastNgn: 1562500000.00,
        yearThreeGrowthPercent: 50.0,
        yearThreeForecastNgn: 2343750000.00
      },
      sheet10_cash_receipts: {
        title: '6. Cash Receipts-Disbursements',
        accountsReceivableCycle: [
          { timeframe: '0 to 30 Days', collectionPercent: 80 },
          { timeframe: '31 to 60 Days', collectionPercent: 20 },
          { timeframe: 'Over 60 Days', collectionPercent: 0 }
        ],
        accountsPayableCycle: [
          { timeframe: '0 to 30 Days (Supplier prompt payment)', disbursementPercent: 100 }
        ]
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
      sheet12_cash_flow: {
        title: '9. Cash Flow Statement',
        operatingCashFlowYear1Ngn: 624500000.00,
        investingCashFlowYear1Ngn: -426700000.00,
        financingCashFlowYear1Ngn: 426700000.00,
        endingCashBalanceYear1Ngn: 624500000.00,
        runwayMonths: 18.5
      },
      sheet13_balance_sheet: {
        title: '10. Balance Sheet',
        assets: {
          currentAssets: {
            cashAndEquivalents: 624500000.00,
            accountsReceivable: 45000000.00,
            inventoryAndHardware: 85000000.00,
            prepaidExpenses: 12500000.00,
            totalCurrentAssets: 767000000.00
          },
          fixedAssets: {
            telecommunicationsAndServers: 625700000.00,
            vehiclesAndLogistics: 35000000.00,
            leaseholdAndRenovations: 18800000.00,
            lessAccumulatedDepreciation: -55000000.00,
            netFixedAssets: 624500000.00
          },
          totalAssets: 1391500000.00
        },
        liabilitiesAndEquity: {
          currentLiabilities: {
            accountsPayable: 35000000.00,
            accruedPayrollAndTaxes: 18500000.00,
            shortTermLoanPortion: 189170333.33,
            totalCurrentLiabilities: 242670333.33
          },
          longTermLiabilities: {
            commercialLoanLongTerm: 378340666.67,
            totalLongTermLiabilities: 378340666.67
          },
          totalLiabilities: 621011000.00,
          equity: {
            ownerInjectedEquity: 392300000.00,
            retainedEarnings: 378189000.00,
            totalEquity: 770489000.00
          },
          totalLiabilitiesAndEquity: 1391500000.00
        },
        isBalanced: true
      },
      sheet14_year_end_summary: {
        title: '11. Year End Summary',
        summary: [
          { year: 'Year 1', revenueNgn: 1250000000, opexNgn: 418500000, netProfitNgn: 378189000, margin: '30.2%' },
          { year: 'Year 2', revenueNgn: 1562500000, opexNgn: 523125000, netProfitNgn: 489500000, margin: '31.3%' },
          { year: 'Year 3', revenueNgn: 2343750000, opexNgn: 784687500, netProfitNgn: 792100000, margin: '33.8%' }
        ]
      },
      sheet15_financial_ratios: {
        title: '18. Financial Ratios Evaluator',
        ratios: {
          currentRatio: 3.16, // 767M / 242.6M
          quickRatio: 2.81,   // (767M - 85M) / 242.6M
          debtToEquityRatio: 0.81, // 621M / 770M
          returnOnAssetsPercent: 27.18, // (378.18M / 1391.5M) * 100
          grossProfitMarginPercent: 75.0,
          netProfitMarginPercent: 30.25
        }
      },
      sheet16_breakeven_analysis: {
        title: '19. Breakeven Analysis',
        annualSalesRevenueNgn: 1250000000.00,
        fixedBusinessExpensesNgn: 418500000.00,
        contributionMarginPercent: 75.0,
        breakevenSalesNgn: 558000000.00,
        breakevenSalesUsd: 416417.91,
        safetyMarginPercent: 55.36
      },
      sheet17_amortization_schedule: {
        title: '20. Amortization Schedule',
        monthlyBreakdown36Months: this.generate36MonthAmortization()
      },
      sheet18_financial_diagnostics: {
        title: '21. Financial Diagnostics',
        tests: [
          { testName: 'Balance Sheet Equilibrium Check', condition: 'Assets == Liabilities + Equity', status: 'PASS', variance: '₦0.00' },
          { testName: 'Current Ratio Solvency Test', condition: 'Current Ratio >= 1.50', status: 'PASS', score: '3.16 (Strong)' },
          { testName: 'Quick Ratio Liquidity Test', condition: 'Quick Ratio >= 1.00', status: 'PASS', score: '2.81 (Extremely Liquid)' },
          { testName: 'Debt-to-Equity Prudence Test', condition: 'Debt / Equity <= 1.50', status: 'PASS', score: '0.81 (Conservative Leverage)' },
          { testName: 'Return on Assets (ROA) Yield Test', condition: 'ROA >= 15.0%', status: 'PASS', score: '27.18% (Superior Enterprise Efficiency)' }
        ]
      }
    };
  }

  generate36MonthAmortization() {
    const principal = 426700000.00;
    const totalInterest = 140811000.00;
    const totalPrimePlusInterest = 567511000.00;
    const monthlyPayment = 15764194.44;
    const schedule = [];

    let balance = totalPrimePlusInterest;
    for (let month = 1; month <= 36; month++) {
      const interestPart = Number((totalInterest / 36).toFixed(2));
      const principalPart = Number((principal / 36).toFixed(2));
      balance = Math.max(0, balance - monthlyPayment);

      schedule.push({
        month,
        monthlyPayment,
        principalComponent: principalPart,
        interestComponent: interestPart,
        remainingBalance: Number(balance.toFixed(2)),
        isMoratorium: month <= 12
      });
    }
    return schedule;
  }

  initLedger() {
    this.ledgerEntries = [
      {
        id: 'TXN-REV-001',
        reference: 'FMP-REV-2026-901',
        category: 'REVENUE',
        entryTitle: 'Multi-Vendor Marketplace Gross Commissions',
        sourceService: 'Storefronts & Marketplace',
        amount: 8450000.00,
        currency: 'NGN',
        targetBankAccount: 'REV-NGN (Fidelity Bank: 5600792703)',
        timestamp: new Date().toISOString()
      },
      {
        id: 'TXN-REV-002',
        reference: 'FMP-REV-2026-902',
        category: 'REVENUE',
        entryTitle: 'VIP Flamingo & Creator Tier Subscriptions',
        sourceService: 'Subscriptions',
        amount: 14200000.00,
        currency: 'NGN',
        targetBankAccount: 'REV-NGN (Fidelity Bank: 5600792703)',
        timestamp: new Date().toISOString()
      },
      {
        id: 'TXN-REV-003',
        reference: 'FMP-REV-2026-903',
        category: 'REVENUE',
        entryTitle: 'UK Corporate Enterprise PayLink Settlement',
        sourceService: 'PayLinks & International',
        amount: 18500.00,
        currency: 'GBP',
        targetBankAccount: 'REV-GBP (Fidelity Bank: 5250325201)',
        timestamp: new Date().toISOString()
      },
      {
        id: 'TXN-PROFIT-001',
        reference: 'FMP-PRF-2026-101',
        category: 'PROFIT_SWEEP',
        entryTitle: 'Automated Q3 Net Surplus Sweep to Enterprise Reserve',
        sourceService: 'P&L Automated Reconciliation Engine',
        amount: 25000000.00,
        currency: 'NGN',
        targetBankAccount: 'PROFIT-ABUJA (Fidelity Bank Area 8: 5601279229)',
        timestamp: new Date().toISOString()
      }
    ];
  }

  // ==========================================================================
  // MATHEMATICAL CALCULATORS & ENGINES
  // ==========================================================================

  /**
   * 1. Simple Interest (I): I = P * r * t
   * @param {number} p Principal
   * @param {number} r Annual interest rate (decimal, e.g. 0.33 for 33%)
   * @param {number} t Time in years
   */
  calculateSimpleInterest(p, r, t) {
    const P = Number(p);
    const R = Number(r);
    const T = Number(t);
    const interest = P * R * T;
    const totalAmount = P * (1 + R * T);
    return {
      principal: P,
      rate: R,
      timeYears: T,
      interest: Number(interest.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      formula: 'I = P * r * t; A = P(1 + r*t)'
    };
  }

  /**
   * 2. Compound Interest (Future Value): FV = PV * (1 + r/n)^(n*t)
   * @param {number} pv Present Value
   * @param {number} r Annual interest rate (decimal)
   * @param {number} n Compounding periods per year (e.g. 12 for monthly, 4 quarterly, 1 annually)
   * @param {number} t Time in years
   */
  calculateCompoundInterest(pv, r, n, t) {
    const PV = Number(pv);
    const R = Number(r);
    const N = Number(n) || 1;
    const T = Number(t);
    const fv = PV * Math.pow(1 + R / N, N * T);
    const interestEarned = fv - PV;
    return {
      presentValue: PV,
      rate: R,
      compoundingPeriodsPerYear: N,
      timeYears: T,
      futureValue: Number(fv.toFixed(2)),
      interestEarned: Number(interestEarned.toFixed(2)),
      formula: 'FV = PV * (1 + r/n)^(n*t)'
    };
  }

  /**
   * 3. Present Value (PV): PV = FV / (1 + r)^t
   * @param {number} fv Future Value
   * @param {number} r Annual discount rate (decimal)
   * @param {number} t Time in years
   */
  calculatePresentValue(fv, r, t) {
    const FV = Number(fv);
    const R = Number(r);
    const T = Number(t);
    const pv = FV / Math.pow(1 + R, T);
    return {
      futureValue: FV,
      discountRate: R,
      timeYears: T,
      presentValue: Number(pv.toFixed(2)),
      formula: 'PV = FV / (1 + r)^t'
    };
  }

  /**
   * 4. Effective Annual Rate (EAR): EAR = (1 + r/n)^n - 1
   * @param {number} r Nominal annual rate (decimal)
   * @param {number} n Compounding periods per year
   */
  calculateEffectiveAnnualRate(r, n) {
    const R = Number(r);
    const N = Number(n) || 1;
    const ear = Math.pow(1 + R / N, N) - 1;
    return {
      nominalRate: R,
      compoundingPeriodsPerYear: N,
      effectiveAnnualRate: Number(ear.toFixed(6)),
      effectiveAnnualRatePercent: Number((ear * 100).toFixed(4)),
      formula: 'EAR = (1 + r/n)^n - 1'
    };
  }

  /**
   * 5. Business & Accounting Ratios Evaluator
   * Computes Current Ratio, Quick Ratio, ROA, Net Income, Gross Profit, and Balance Sheet check
   */
  evaluateAccountingRatios(params = {}) {
    const currentAssets = Number(params.currentAssets ?? this.excelSheets.sheet13_balance_sheet.assets.currentAssets.totalCurrentAssets);
    const currentLiabilities = Number(params.currentLiabilities ?? this.excelSheets.sheet13_balance_sheet.liabilitiesAndEquity.currentLiabilities.totalCurrentLiabilities);
    const inventory = Number(params.inventory ?? this.excelSheets.sheet13_balance_sheet.assets.currentAssets.inventoryAndHardware);
    const totalAssets = Number(params.totalAssets ?? this.excelSheets.sheet13_balance_sheet.assets.totalAssets);
    const totalLiabilities = Number(params.totalLiabilities ?? this.excelSheets.sheet13_balance_sheet.liabilitiesAndEquity.totalLiabilities);
    const totalEquity = Number(params.totalEquity ?? this.excelSheets.sheet13_balance_sheet.liabilitiesAndEquity.equity.totalEquity);
    const totalRevenue = Number(params.totalRevenue ?? this.excelSheets.sheet11_income_statement.grossRevenueYear1Ngn);
    const cogs = Number(params.cogs ?? this.excelSheets.sheet11_income_statement.cogsYear1Ngn);
    const totalExpenses = Number(params.totalExpenses ?? (cogs + this.excelSheets.sheet11_income_statement.totalOpexYear1Ngn + this.excelSheets.sheet11_income_statement.taxAndInterestYear1Ngn));

    // Core Formulas
    const netIncome = totalRevenue - totalExpenses;
    const grossProfit = totalRevenue - cogs;
    const currentRatio = currentLiabilities > 0 ? Number((currentAssets / currentLiabilities).toFixed(4)) : 0;
    const quickRatio = currentLiabilities > 0 ? Number(((currentAssets - inventory) / currentLiabilities).toFixed(4)) : 0;
    const roa = totalAssets > 0 ? Number((netIncome / totalAssets).toFixed(4)) : 0;
    const roaPercent = Number((roa * 100).toFixed(2));
    const debtToEquity = totalEquity > 0 ? Number((totalLiabilities / totalEquity).toFixed(4)) : 0;
    const grossProfitMarginPercent = totalRevenue > 0 ? Number(((grossProfit / totalRevenue) * 100).toFixed(2)) : 0;
    const netProfitMarginPercent = totalRevenue > 0 ? Number(((netIncome / totalRevenue) * 100).toFixed(2)) : 0;

    // Balance Sheet Equation Check: Assets = Liabilities + Equity
    const balanceDifference = Math.abs(totalAssets - (totalLiabilities + totalEquity));
    const isBalanced = balanceDifference < 0.05;

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

  // ==========================================================================
  // API EXPOSURES & DATA GETTERS
  // ==========================================================================

  getRevenueRails() {
    return this.revenueRails;
  }

  getProfitRails() {
    return this.profitRails;
  }

  getEconomicDefinitions() {
    return this.economicDefinitions;
  }

  getAllExcelSheets() {
    return this.excelSheets;
  }

  resolveSheetAlias(key) {
    const keyAliases = {
      'income_statement': 'sheet11_income_statement',
      'balance_sheet': 'sheet13_balance_sheet',
      'cost_tcc_boq': 'sheet1_cost',
      'startup_funds': 'sheet3_startup_funds',
      'capex_opex_dancia': 'sheet5_capex_opex_dancia4tv',
      'sheet11_income_statement': 'income_statement',
      'sheet13_balance_sheet': 'balance_sheet',
      'sheet1_cost': 'cost_tcc_boq',
      'sheet3_startup_funds': 'startup_funds',
      'sheet5_capex_opex_dancia4tv': 'capex_opex_dancia'
    };
    return keyAliases[key] || key;
  }

  async getExcelSheet(key) {
    const aliasKey = this.resolveSheetAlias(key);
    try {
      const res = await db.financialDb.query(
        'SELECT sheet_key, title, version, status, last_edited_by, last_edited_at, approved_by, approved_at, notes, sheet_data FROM platform_financial_sheets WHERE sheet_key = $1 OR sheet_key = $2 LIMIT 1',
        [key, aliasKey]
      );
      if (res.rows && res.rows.length > 0) {
        const row = res.rows[0];
        const sheetData = row.sheet_data || {};
        if ((key === 'capex_opex_dancia' || aliasKey === 'capex_opex_dancia') && !sheetData.items) {
          const fallback = this.excelSheets['sheet5_capex_opex_dancia4tv'];
          if (Array.isArray(sheetData.keyLineItems)) {
            sheetData.items = sheetData.keyLineItems.map((k, idx) => ({
              id: `dancia_${idx + 1}`,
              name: k.item || k.name || `Line Item ${idx + 1}`,
              category: k.category || 'General',
              amountNgn: Number(k.amountNgn) || 0,
              notes: k.notes || ''
            }));
          } else if (fallback && Array.isArray(fallback.items)) {
            sheetData.items = fallback.items;
          }
        }
        return {
          sheetKey: row.sheet_key,
          title: row.title,
          version: row.version,
          status: row.status,
          lastEditedBy: row.last_edited_by,
          lastEditedAt: row.last_edited_at,
          approvedBy: row.approved_by,
          approvedAt: row.approved_at,
          notes: row.notes,
          ...sheetData
        };
      }
    } catch (err) {
      if (logger && logger.warn) logger.warn(`Error reading sheet ${key} from DB, falling back to memory:`, err.message);
    }
    const mem = this.excelSheets[key] || this.excelSheets[aliasKey] || null;
    if (mem && (key === 'capex_opex_dancia' || aliasKey === 'capex_opex_dancia') && !mem.items && mem.keyLineItems) {
      mem.items = mem.keyLineItems.map((k, idx) => ({
        id: `dancia_${idx + 1}`,
        name: k.item || k.name || `Line Item ${idx + 1}`,
        category: k.category || 'General',
        amountNgn: Number(k.amountNgn) || 0,
        notes: k.notes || ''
      }));
    }
    return mem;
  }

  async saveSheet(key, sheetData, metadata = {}) {
    const aliasKey = this.resolveSheetAlias(key);
    const title = metadata.title || (this.excelSheets[key] ? this.excelSheets[key].title : (this.excelSheets[aliasKey] ? this.excelSheets[aliasKey].title : `Sheet ${key}`));
    const lastEditedBy = metadata.lastEditedBy || 'Mrs. Mbah Eunice Emonena (CFO)';
    const status = metadata.status || 'DRAFT';
    const notes = metadata.notes || '';
    const version = Number(metadata.version) || 1;

    try {
      const res = await db.financialDb.query(`
        INSERT INTO platform_financial_sheets (sheet_key, title, version, status, last_edited_by, last_edited_at, notes, sheet_data)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, $7::jsonb)
        ON CONFLICT (sheet_key) DO UPDATE SET
          title = EXCLUDED.title,
          version = platform_financial_sheets.version + 1,
          status = EXCLUDED.status,
          last_edited_by = EXCLUDED.last_edited_by,
          last_edited_at = CURRENT_TIMESTAMP,
          notes = EXCLUDED.notes,
          sheet_data = EXCLUDED.sheet_data,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `, [key, title, version, status, lastEditedBy, notes, JSON.stringify(sheetData)]);

      // Update in-memory copy
      this.excelSheets[key] = {
        sheetKey: key,
        title,
        version: res.rows[0].version,
        status: res.rows[0].status,
        lastEditedBy,
        lastEditedAt: res.rows[0].last_edited_at,
        notes,
        ...sheetData
      };

      // Record audit record
      await this.recordAuditLog({
        sheetKey: key,
        sheetLabel: title,
        action: 'DRAFT_SAVED',
        actor: lastEditedBy,
        actorRole: 'CFO',
        notes: notes || 'Financial sheet state updated and persisted to PostgreSQL',
        version: res.rows[0].version,
        payloadSummary: `Updated ${key} with ${Object.keys(sheetData).length} financial fields.`
      });

      return res.rows[0];
    } catch (err) {
      if (logger && logger.error) logger.error(`Error persisting sheet ${key} to DB:`, err);
      // Update in-memory copy as fallback
      this.excelSheets[key] = { sheetKey: key, title, ...sheetData };
      return { sheet_key: key, title, sheet_data: sheetData };
    }
  }

  async approveSheet(key, approver = 'Mbah Israel Obinna (SUPER ADMIN)', notes = 'Approved') {
    try {
      const res = await db.financialDb.query(`
        UPDATE platform_financial_sheets
        SET status = 'APPROVED_BY_SUPER_ADMIN',
            approved_by = $1,
            approved_at = CURRENT_TIMESTAMP,
            notes = COALESCE($2, notes),
            updated_at = CURRENT_TIMESTAMP
        WHERE sheet_key = $3
        RETURNING *
      `, [approver, notes, key]);

      if (res.rows.length > 0) {
        const approved = res.rows[0];
        if (this.excelSheets[key]) {
          this.excelSheets[key].status = 'APPROVED_BY_SUPER_ADMIN';
          this.excelSheets[key].approvedBy = approver;
          this.excelSheets[key].approvedAt = approved.approved_at;
        }

        await this.recordAuditLog({
          sheetKey: key,
          sheetLabel: approved.title,
          action: 'SUPER_ADMIN_APPROVED',
          actor: approver,
          actorRole: 'SUPER_ADMIN',
          notes: notes || 'SuperAdmin ratified financial model into immutable sovereign ledger',
          version: approved.version
        });

        return approved;
      }
    } catch (err) {
      if (logger && logger.error) logger.error(`Error approving sheet ${key} in DB:`, err);
    }
    return null;
  }

  async recordAuditLog(log) {
    try {
      await db.financialDb.query(`
        INSERT INTO platform_financial_audit_ledger (sheet_key, sheet_label, action, actor, actor_role, notes, version, payload_summary)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        log.sheetKey,
        log.sheetLabel || log.sheetKey,
        log.action,
        log.actor || 'System',
        log.actorRole || 'CFO',
        log.notes || '',
        log.version || 1,
        log.payloadSummary || ''
      ]);
    } catch (err) {
      if (logger && logger.warn) logger.warn('Error recording financial audit log:', err.message);
    }
  }

  async getAuditLogs(sheetKey) {
    try {
      const query = sheetKey
        ? 'SELECT * FROM platform_financial_audit_ledger WHERE sheet_key = $1 ORDER BY timestamp DESC LIMIT 100'
        : 'SELECT * FROM platform_financial_audit_ledger ORDER BY timestamp DESC LIMIT 100';
      const params = sheetKey ? [sheetKey] : [];
      const res = await db.financialDb.query(query, params);
      return res.rows;
    } catch (err) {
      if (logger && logger.warn) logger.warn('Error fetching financial audit logs from DB:', err.message);
      return [];
    }
  }

  getLedger() {
    return this.ledgerEntries;
  }

  recordLedgerEntry(entry) {
    const newEntry = {
      id: `TXN-${Date.now()}`,
      reference: entry.reference || `FMP-${Date.now().toString(36).toUpperCase()}`,
      category: entry.category || 'REVENUE',
      entryTitle: entry.entryTitle,
      sourceService: entry.sourceService,
      amount: Number(entry.amount),
      currency: entry.currency || 'NGN',
      targetBankAccount: entry.targetBankAccount || 'REV-NGN (Fidelity Bank: 5600792703)',
      timestamp: new Date().toISOString()
    };
    this.ledgerEntries.unshift(newEntry);

    // If it is a profit sweep, update accumulated profit
    if (newEntry.category === 'PROFIT_SWEEP') {
      this.profitRails.totalAccumulatedProfitNgn += newEntry.amount;
    }

    return newEntry;
  }
}

// Export singleton instance
const financialEcosystemService = new FinancialEcosystemService();
module.exports = financialEcosystemService;
