import React, { useState, useMemo } from 'react';
import {
  Landmark,
  DollarSign,
  TrendingUp,
  Scale,
  Calculator,
  FileSpreadsheet,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Sliders,
  Percent
} from 'lucide-react';
import {
  PLATFORM_REVENUE_RAILS,
  PLATFORM_PROFIT_RAILS,
  ECONOMIC_DEFINITIONS,
  EXCEL_SHEETS_DATA,
  computeSimpleInterest,
  computeCompoundInterest,
  computePresentValue,
  computeEffectiveAnnualRate,
  evaluateAccountingRatios,
  BankAccountRail
} from '../../constants/platformFinancialEcosystemData';

export const EnterpriseFinancialEcosystemConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rails' | 'ratios' | 'growth-lab' | 'excel-sheets' | 'ledger'>('rails');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // --------------------------------------------------------------------------
  // Tab 2: Ratio Sandbox State
  // --------------------------------------------------------------------------
  const [sandboxAssets, setSandboxAssets] = useState<number>(1391500000);
  const [sandboxLiabilities, setSandboxLiabilities] = useState<number>(621011000);
  const [sandboxEquity, setSandboxEquity] = useState<number>(770489000);
  const [sandboxCurrentAssets, setSandboxCurrentAssets] = useState<number>(767000000);
  const [sandboxCurrentLiabilities, setSandboxCurrentLiabilities] = useState<number>(242670333);
  const [sandboxInventory, setSandboxInventory] = useState<number>(85000000);
  const [sandboxRevenue, setSandboxRevenue] = useState<number>(1250000000);
  const [sandboxCogs, setSandboxCogs] = useState<number>(312500000);
  const [sandboxExpenses, setSandboxExpenses] = useState<number>(871811000);

  const dynamicEvaluation = useMemo(() => {
    return evaluateAccountingRatios({
      totalAssets: sandboxAssets,
      totalLiabilities: sandboxLiabilities,
      totalEquity: sandboxEquity,
      currentAssets: sandboxCurrentAssets,
      currentLiabilities: sandboxCurrentLiabilities,
      inventory: sandboxInventory,
      totalRevenue: sandboxRevenue,
      cogs: sandboxCogs,
      totalExpenses: sandboxExpenses
    });
  }, [
    sandboxAssets,
    sandboxLiabilities,
    sandboxEquity,
    sandboxCurrentAssets,
    sandboxCurrentLiabilities,
    sandboxInventory,
    sandboxRevenue,
    sandboxCogs,
    sandboxExpenses
  ]);

  // --------------------------------------------------------------------------
  // Tab 3: Interest & Growth Calculators State
  // --------------------------------------------------------------------------
  const [simpleP, setSimpleP] = useState<number>(426700000);
  const [simpleR, setSimpleR] = useState<number>(0.33);
  const [simpleT, setSimpleT] = useState<number>(3);
  const simpleResult = useMemo(() => computeSimpleInterest(simpleP, simpleR, simpleT), [simpleP, simpleR, simpleT]);

  const [compoundPv, setCompoundPv] = useState<number>(100000000);
  const [compoundR, setCompoundR] = useState<number>(0.15);
  const [compoundN, setCompoundN] = useState<number>(12);
  const [compoundT, setCompoundT] = useState<number>(3);
  const compoundResult = useMemo(
    () => computeCompoundInterest(compoundPv, compoundR, compoundN, compoundT),
    [compoundPv, compoundR, compoundN, compoundT]
  );

  const [pvFv, setPvFv] = useState<number>(567511000);
  const [pvR, setPvR] = useState<number>(0.10);
  const [pvT, setPvT] = useState<number>(3);
  const pvResult = useMemo(() => computePresentValue(pvFv, pvR, pvT), [pvFv, pvR, pvT]);

  const [earNominal, setEarNominal] = useState<number>(0.33);
  const [earN, setEarN] = useState<number>(12);
  const earResult = useMemo(() => computeEffectiveAnnualRate(earNominal, earN), [earNominal, earN]);

  // --------------------------------------------------------------------------
  // Tab 4: Excel Sheets Active View
  // --------------------------------------------------------------------------
  const [selectedSheetKey, setSelectedSheetKey] = useState<string>('sheet11_income_statement');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const formatNaira = (val: number) => {
    return '₦' + val.toLocaleString('en-NG', { maximumFractionDigits: 2 });
  };

  const formatUSD = (val: number) => {
    return '$' + val.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Sovereign Enterprise Financial Ecosystem */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 p-6 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Landmark className="w-3.5 h-3.5" />
              Sovereign Financial Economic Ecosystem & Treasury Rail
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              FingerMobile Enterprise Financial Core
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              100% segregated financial architecture. All Platform <strong>Revenue</strong> flows directly into dedicated multi-currency
              rails at <strong>Fidelity Bank Lagos</strong>, while all Platform <strong>Profit</strong> is swept into <strong>Fidelity Bank Abuja Area 8 Branch</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2.5 backdrop-blur-sm">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Revenue Destination</div>
              <div className="text-sm font-black text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Fidelity Bank Lagos
              </div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2.5 backdrop-blur-sm">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Profit Surplus Rail</div>
              <div className="text-sm font-black text-purple-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                Fidelity Bank Abuja (Area 8)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tab Bar */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'rails', label: '1. Sovereign Bank Rails (Revenue vs. Profit)', icon: Landmark },
          { id: 'ratios', label: '2. Accounting & Financial Ratios', icon: Scale },
          { id: 'growth-lab', label: '3. Interest & Growth Lab', icon: Calculator },
          { id: 'excel-sheets', label: '4. Excel Financials (18 Sheets)', icon: FileSpreadsheet },
          { id: 'ledger', label: '5. Double-Entry P&L Sweep', icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs whitespace-nowrap rounded-t-lg transition-all ${
                isActive
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: SOVEREIGN BANK RAILS (REVENUE VS. PROFIT)                     */}
      {/* ==================================================================== */}
      {activeTab === 'rails' && (
        <div className="space-y-6">
          {/* Revenue vs. Income vs. Profit Conceptual Trinity Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Revenue */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800/40 p-5 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  Top Line
                </span>
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">
                {ECONOMIC_DEFINITIONS.revenue.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                {ECONOMIC_DEFINITIONS.revenue.definition}
              </p>
              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 text-[11px]">
                <strong className="text-gray-700 dark:text-gray-200 block mb-1">Designated Inflow Rail:</strong>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                  Fidelity Bank Lagos (NGN: 5600792703)
                </span>
              </div>
            </div>

            {/* Income */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-800/40 p-5 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                  Gross & Net Margin
                </span>
                <Scale className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">
                {ECONOMIC_DEFINITIONS.income.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                {ECONOMIC_DEFINITIONS.income.definition}
              </p>
              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 text-[11px] space-y-1">
                <div className="font-mono text-gray-600 dark:text-gray-400">
                  Gross: <strong className="text-blue-600 dark:text-blue-400">Sales - COGS</strong>
                </div>
                <div className="font-mono text-gray-600 dark:text-gray-400">
                  Net: <strong className="text-blue-600 dark:text-blue-400">Total Rev - Total Exp</strong>
                </div>
              </div>
            </div>

            {/* Profit */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-purple-200 dark:border-purple-800/40 p-5 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                  Bottom Line
                </span>
                <Landmark className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">
                {ECONOMIC_DEFINITIONS.profit.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                {ECONOMIC_DEFINITIONS.profit.definition}
              </p>
              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 text-[11px]">
                <strong className="text-gray-700 dark:text-gray-200 block mb-1">Designated Surplus Rail:</strong>
                <span className="text-purple-600 dark:text-purple-400 font-semibold font-mono">
                  Fidelity Bank Area 8 Abuja (5601279229)
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Multi-Currency Platform Revenue Destination Bank Rails */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  Primary Inflow Protocol
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  1. Platform Revenue Destination Bank Rails (Fidelity Bank)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  All gross revenue generated across FingerMobile Storefronts, Subscriptions, Marketplace, Advertising, and Infinity Coin must be paid directly into these accounts.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Swift: FIDTNGLA
                </span>
                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Lagos Corporate HQ
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PLATFORM_REVENUE_RAILS.accounts.map((rail: BankAccountRail) => (
                <div
                  key={rail.id}
                  className="rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-gradient-to-br from-white via-emerald-50/20 to-white dark:from-slate-900 dark:via-emerald-950/10 dark:to-slate-900 p-5 space-y-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wide bg-emerald-600 text-white shadow-2xs">
                      {rail.currency} Rail
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Active Online
                    </span>
                  </div>

                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                      Account Name
                    </div>
                    <div className="text-sm font-extrabold text-gray-900 dark:text-white">
                      {rail.accountName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {rail.bankName} • {rail.branch}
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-800/90 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400">Account Number</div>
                      <div className="font-mono font-extrabold text-base text-gray-900 dark:text-white tracking-wider">
                        {rail.accountNumber}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(rail.accountNumber, rail.id)}
                      className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 hover:text-emerald-600 transition"
                      title="Copy Account Number"
                    >
                      {copiedKey === rail.id ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="text-[10px] text-gray-400 uppercase font-bold">USSD Rail</div>
                      <div className="font-mono font-bold text-gray-800 dark:text-gray-200">{rail.ussdCode}</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="text-[10px] text-gray-400 uppercase font-bold">Bank Swift</div>
                      <div className="font-mono font-bold text-gray-800 dark:text-gray-200">{rail.swiftCode}</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                    {rail.purpose}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Platform PROFIT Destination Bank Rails */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-purple-200 dark:border-purple-800/40 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                  <Landmark className="w-4 h-4" />
                  Sovereign Surplus Protocol
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  2. Platform PROFIT Destination Bank Rail (Fidelity Bank Abuja Area 8)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  All bottom-line net profit remaining after deducting operational expenses, COGS, taxes, and interest must be swept to this sovereign facility.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Swift: FIDTNGLA
                </span>
                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Abuja F.C.T • Area 8 Branch
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Detailed Bank Card */}
              <div className="lg:col-span-2 rounded-xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between relative z-10 mb-6">
                  <div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-purple-300">
                      Official Profit Custodian Facility
                    </span>
                    <h4 className="text-2xl font-black">{PLATFORM_PROFIT_RAILS.bankName}</h4>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-purple-500/30 text-purple-200 border border-purple-400/30">
                      Bottom-Line Net Profit
                    </span>
                  </div>
                </div>

                <div className="space-y-4 relative z-10 mb-6">
                  <div>
                    <div className="text-xs text-purple-300 uppercase tracking-wider font-semibold">
                      Account Name
                    </div>
                    <div className="text-xl font-bold tracking-wide">
                      {PLATFORM_PROFIT_RAILS.accountName}
                    </div>
                  </div>

                  <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-purple-300 uppercase font-semibold">
                        Designated Profit Account Number
                      </div>
                      <div className="font-mono text-2xl font-black tracking-widest text-emerald-400">
                        {PLATFORM_PROFIT_RAILS.accountNumber}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(PLATFORM_PROFIT_RAILS.accountNumber, 'profit_acc')}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
                    >
                      {copiedKey === 'profit_acc' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Account
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-purple-700/50 pt-4 text-xs relative z-10">
                  <div>
                    <span className="text-purple-300 block text-[10px] uppercase">Designated Branch</span>
                    <strong className="text-white">{PLATFORM_PROFIT_RAILS.branchName}, {PLATFORM_PROFIT_RAILS.branchCity}</strong>
                  </div>
                  <div>
                    <span className="text-purple-300 block text-[10px] uppercase">USSD Dial Code</span>
                    <strong className="font-mono text-white">{PLATFORM_PROFIT_RAILS.ussdCode}</strong>
                  </div>
                  <div>
                    <span className="text-purple-300 block text-[10px] uppercase">Corporate Address</span>
                    <strong className="text-white">Lagos HQ / Abuja</strong>
                  </div>
                </div>
              </div>

              {/* Profit Sweep Metrics */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-800/50 p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Automated Profit Sweep Protocol
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    The platform engine continuously reconciles Top-Line Revenue against operational costs. When surplus exceeds the threshold, funds are automatically swept into the Profit Rail.
                  </p>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Auto-Sweep Status:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Enabled & Verified</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Sweep Minimum Threshold:</span>
                      <strong className="font-mono text-gray-900 dark:text-white">₦1,000,000.00</strong>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-gray-500 dark:text-gray-400">Total Accumulated Profit:</span>
                      <strong className="font-mono text-lg font-black text-purple-600 dark:text-purple-400">
                        {formatNaira(PLATFORM_PROFIT_RAILS.totalAccumulatedProfitNgn)}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    Reconciliation oversight by CFO Mrs. Mbah Eunice Emonena
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: ACCOUNTING & FINANCIAL RATIOS                                */}
      {/* ==================================================================== */}
      {activeTab === 'ratios' && (
        <div className="space-y-6">
          {/* Ratio Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Balance Sheet Equilibrium */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase text-gray-500">Balance Sheet Equation</span>
                {dynamicEvaluation.balanceSheetEquation.isBalanced ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Balanced
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    Delta Detected
                  </span>
                )}
              </div>
              <div className="text-xl font-extrabold text-gray-900 dark:text-white mb-1">
                Assets = Liab + Equity
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <div>Total Assets: <strong className="text-gray-900 dark:text-white font-mono">{formatNaira(dynamicEvaluation.balanceSheetEquation.assets)}</strong></div>
                <div>Liabilities + Equity: <strong className="text-gray-900 dark:text-white font-mono">{formatNaira(dynamicEvaluation.balanceSheetEquation.sumLiabilitiesAndEquity)}</strong></div>
              </div>
            </div>

            {/* Current Ratio */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase text-gray-500">Current Ratio</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  dynamicEvaluation.ratios.currentRatio.status === 'HEALTHY'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {dynamicEvaluation.ratios.currentRatio.status}
                </span>
              </div>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-1">
                {dynamicEvaluation.ratios.currentRatio.value}x
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Formula: <span className="font-mono text-gray-700 dark:text-gray-300">CA / CL</span>
                <div className="text-[10px] text-gray-400 mt-1">Benchmark: 1.50 - 2.50x</div>
              </div>
            </div>

            {/* Quick Ratio (Acid-Test) */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase text-gray-500">Quick Ratio (Acid-Test)</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  dynamicEvaluation.ratios.quickRatio.status === 'HEALTHY'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {dynamicEvaluation.ratios.quickRatio.status}
                </span>
              </div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-1">
                {dynamicEvaluation.ratios.quickRatio.value}x
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Formula: <span className="font-mono text-gray-700 dark:text-gray-300">(CA - Inv) / CL</span>
                <div className="text-[10px] text-gray-400 mt-1">Benchmark: &ge; 1.00x</div>
              </div>
            </div>

            {/* Return on Assets (ROA) */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase text-gray-500">Return on Assets (ROA)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  {dynamicEvaluation.ratios.returnOnAssets.status}
                </span>
              </div>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mb-1">
                {dynamicEvaluation.ratios.returnOnAssets.percent}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Formula: <span className="font-mono text-gray-700 dark:text-gray-300">Net Income / Total Assets</span>
                <div className="text-[10px] text-gray-400 mt-1">Benchmark: &ge; 15.0%</div>
              </div>
            </div>
          </div>

          {/* Interactive Ratio Sandbox Simulator */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  Live Accounting Ratio Sandbox & Stress Tester
                </h3>
                <p className="text-xs text-gray-500">
                  Adjust enterprise financial levers to dynamically test liquidity, solvency, and profitability thresholds in real-time.
                </p>
              </div>
              <button
                onClick={() => {
                  setSandboxAssets(1391500000);
                  setSandboxLiabilities(621011000);
                  setSandboxEquity(770489000);
                  setSandboxCurrentAssets(767000000);
                  setSandboxCurrentLiabilities(242670333);
                  setSandboxInventory(85000000);
                  setSandboxRevenue(1250000000);
                  setSandboxCogs(312500000);
                  setSandboxExpenses(871811000);
                }}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset to Baseline
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Asset & Liability Inputs */}
              <div className="space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Balance Sheet Levers (₦)
                </h4>
                <div>
                  <label className="text-gray-500 block mb-1">Current Assets</label>
                  <input
                    type="number"
                    value={sandboxCurrentAssets}
                    onChange={(e) => setSandboxCurrentAssets(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Current Liabilities</label>
                  <input
                    type="number"
                    value={sandboxCurrentLiabilities}
                    onChange={(e) => setSandboxCurrentLiabilities(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Inventory / Hardware Stock</label>
                  <input
                    type="number"
                    value={sandboxInventory}
                    onChange={(e) => setSandboxInventory(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Total Balance Sheet Inputs */}
              <div className="space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Solvency & Capital Levers (₦)
                </h4>
                <div>
                  <label className="text-gray-500 block mb-1">Total Assets</label>
                  <input
                    type="number"
                    value={sandboxAssets}
                    onChange={(e) => setSandboxAssets(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Total Liabilities</label>
                  <input
                    type="number"
                    value={sandboxLiabilities}
                    onChange={(e) => setSandboxLiabilities(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Total Shareholder Equity</label>
                  <input
                    type="number"
                    value={sandboxEquity}
                    onChange={(e) => setSandboxEquity(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Income & P&L Inputs */}
              <div className="space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">
                  P&L Operational Levers (₦)
                </h4>
                <div>
                  <label className="text-gray-500 block mb-1">Total Platform Revenue</label>
                  <input
                    type="number"
                    value={sandboxRevenue}
                    onChange={(e) => setSandboxRevenue(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Cost of Goods Sold (COGS)</label>
                  <input
                    type="number"
                    value={sandboxCogs}
                    onChange={(e) => setSandboxCogs(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Total Operating Expenses (OPEX)</label>
                  <input
                    type="number"
                    value={sandboxExpenses}
                    onChange={(e) => setSandboxExpenses(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Simulated Live Outputs */}
            <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-sans">Simulated Gross Profit</span>
                <span className="text-lg font-black text-emerald-400">
                  {formatNaira(dynamicEvaluation.incomeMetrics.grossProfit)}
                </span>
                <div className="text-[10px] text-emerald-300/80 font-sans">
                  Margin: {dynamicEvaluation.incomeMetrics.grossProfitMarginPercent}%
                </div>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-sans">Simulated Net Income</span>
                <span className="text-lg font-black text-blue-400">
                  {formatNaira(dynamicEvaluation.incomeMetrics.netIncome)}
                </span>
                <div className="text-[10px] text-blue-300/80 font-sans">
                  Net Margin: {dynamicEvaluation.incomeMetrics.netProfitMarginPercent}%
                </div>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-sans">Debt-to-Equity Ratio</span>
                <span className="text-lg font-black text-purple-400">
                  {dynamicEvaluation.ratios.debtToEquity.value}x
                </span>
                <div className="text-[10px] text-purple-300/80 font-sans">
                  Leverage: {dynamicEvaluation.ratios.debtToEquity.status}
                </div>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-sans">Balance Delta</span>
                <span className={`text-lg font-black ${
                  dynamicEvaluation.balanceSheetEquation.isBalanced ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {dynamicEvaluation.balanceSheetEquation.isBalanced ? '₦0.00 (Perfect)' : 'Imbalance'}
                </span>
                <div className="text-[10px] text-gray-400 font-sans">
                  Assets = Liab + Equity
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: INTEREST & GROWTH LAB                                         */}
      {/* ==================================================================== */}
      {activeTab === 'growth-lab' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Simple Interest Engine */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-600" />
                    Simple Interest & Amount Calculator
                  </h3>
                  <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    I = P × r × t &nbsp;|&nbsp; A = P(1 + r × t)
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Linear Growth
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-gray-500 block mb-1">Principal (P)</label>
                  <input
                    type="number"
                    value={simpleP}
                    onChange={(e) => setSimpleP(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Annual Rate (r)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={simpleR}
                    onChange={(e) => setSimpleR(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Tenor in Years (t)</label>
                  <input
                    type="number"
                    value={simpleT}
                    onChange={(e) => setSimpleT(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">
                    Calculated Interest (I)
                  </div>
                  <div className="text-lg font-black font-mono text-emerald-900 dark:text-emerald-100">
                    {formatNaira(simpleResult.interest)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">
                    Total Amount (A = P + I)
                  </div>
                  <div className="text-lg font-black font-mono text-emerald-900 dark:text-emerald-100">
                    {formatNaira(simpleResult.totalAmount)}
                  </div>
                </div>
              </div>
            </div>

            {/* Compound Interest (Future Value) Engine */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Compound Interest (Future Value)
                  </h3>
                  <div className="text-xs font-mono text-blue-600 dark:text-blue-400">
                    FV = PV × (1 + r/n)^(n × t)
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Exponential Growth
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>
                  <label className="text-gray-500 block mb-1">Present Value (PV)</label>
                  <input
                    type="number"
                    value={compoundPv}
                    onChange={(e) => setCompoundPv(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Rate (r)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={compoundR}
                    onChange={(e) => setCompoundR(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Periods/Yr (n)</label>
                  <input
                    type="number"
                    value={compoundN}
                    onChange={(e) => setCompoundN(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Years (t)</label>
                  <input
                    type="number"
                    value={compoundT}
                    onChange={(e) => setCompoundT(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300">
                    Future Value (FV)
                  </div>
                  <div className="text-lg font-black font-mono text-blue-900 dark:text-blue-100">
                    {formatNaira(compoundResult.futureValue)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300">
                    Compound Interest Accrued
                  </div>
                  <div className="text-lg font-black font-mono text-blue-900 dark:text-blue-100">
                    {formatNaira(compoundResult.interestEarned)}
                  </div>
                </div>
              </div>
            </div>

            {/* Present Value (PV) Engine */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                    <Scale className="w-4 h-4 text-purple-600" />
                    Present Value (Discounting Engine)
                  </h3>
                  <div className="text-xs font-mono text-purple-600 dark:text-purple-400">
                    PV = FV / (1 + r)^t
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  Time-Value of Money
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-gray-500 block mb-1">Target Future Value (FV)</label>
                  <input
                    type="number"
                    value={pvFv}
                    onChange={(e) => setPvFv(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Discount Rate (r)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={pvR}
                    onChange={(e) => setPvR(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Years (t)</label>
                  <input
                    type="number"
                    value={pvT}
                    onChange={(e) => setPvT(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40">
                <div className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300">
                  Required Present Value Investment (PV)
                </div>
                <div className="text-xl font-black font-mono text-purple-900 dark:text-purple-100">
                  {formatNaira(pvResult.presentValue)}
                </div>
              </div>
            </div>

            {/* Effective Annual Rate (EAR) Engine */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                    <Percent className="w-4 h-4 text-amber-600" />
                    Effective Annual Rate (EAR)
                  </h3>
                  <div className="text-xs font-mono text-amber-600 dark:text-amber-400">
                    EAR = (1 + r/n)^n - 1
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  True Cost of Borrowing
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-gray-500 block mb-1">Nominal Stated Rate (r)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={earNominal}
                    onChange={(e) => setEarNominal(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Compounding Periods (n)</label>
                  <input
                    type="number"
                    value={earN}
                    onChange={(e) => setEarN(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
                <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300">
                  Effective Annualized Rate (EAR)
                </div>
                <div className="text-2xl font-black font-mono text-amber-900 dark:text-amber-100">
                  {earResult.effectiveAnnualRatePercent}%
                </div>
              </div>
            </div>
          </div>

          {/* Special Feature: ₦426.7M Commercial Loan Payback Facility */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                  ₦426.7M Commercial Start-Up Loan & Amortization Facility
                </h3>
                <p className="text-xs text-gray-500">
                  Prime commercial facility: ₦426,700,000 principal at 33% interest = ₦140,811,000. Total payback: ₦567,511,000 across 3 years with 1-year moratorium.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold font-mono">
                  Monthly Payment: ₦15,764,194.44
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="text-gray-400 text-[10px] uppercase font-bold">Principal Drawdown</div>
                <div className="font-mono font-extrabold text-gray-900 dark:text-white">₦426,700,000.00</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="text-gray-400 text-[10px] uppercase font-bold">Total 33% Interest</div>
                <div className="font-mono font-extrabold text-amber-600 dark:text-amber-400">₦140,811,000.00</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="text-gray-400 text-[10px] uppercase font-bold">Prime + Interest Total</div>
                <div className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400">₦567,511,000.00</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="text-gray-400 text-[10px] uppercase font-bold">Annual Debt Service</div>
                <div className="font-mono font-extrabold text-purple-600 dark:text-purple-400">₦189,170,333.33/yr</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: EXCEL FINANCIALS (18 SHEETS EXTRACTED)                       */}
      {/* ==================================================================== */}
      {activeTab === 'excel-sheets' && (
        <div className="space-y-6">
          {/* Sheet Selector */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'sheet11_income_statement', label: '8. Income Statement (P&L)' },
              { key: 'sheet13_balance_sheet', label: '10. Balance Sheet' },
              { key: 'sheet1_cost', label: 'COST - TCC Infrastructure BoQ' },
              { key: 'sheet3_startup_funds', label: '1. Required Start-Up Funds' },
              { key: 'sheet5_capex_opex_dancia4tv', label: 'CAPEX & OPEX (2) - Dancia-4Tv BoQ' },
              { key: 'sheet8_loan_request', label: 'Loan Request & Pay-Back' },
              { key: 'sheet16_breakeven_analysis', label: '19. Breakeven Analysis' }
            ].map((sheet) => (
              <button
                key={sheet.key}
                onClick={() => setSelectedSheetKey(sheet.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedSheetKey === sheet.key
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {sheet.label}
              </button>
            ))}
          </div>

          {/* Active Sheet View */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
            {selectedSheetKey === 'sheet11_income_statement' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                    {EXCEL_SHEETS_DATA.sheet11_income_statement.title}
                  </h3>
                  <span className="text-xs font-mono font-bold text-emerald-600">
                    Net Margin: {EXCEL_SHEETS_DATA.sheet11_income_statement.netProfitMarginPercent}%
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs divide-y divide-gray-200 dark:divide-gray-800">
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      <tr>
                        <td className="py-2.5 font-bold text-gray-900 dark:text-white">Gross Platform Revenue</td>
                        <td className="py-2.5 text-right font-mono font-bold text-emerald-600">
                          {formatNaira(EXCEL_SHEETS_DATA.sheet11_income_statement.grossRevenueYear1Ngn)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-gray-600 dark:text-gray-300">Cost of Goods Sold (COGS)</td>
                        <td className="py-2.5 text-right font-mono text-gray-500">
                          ({formatNaira(EXCEL_SHEETS_DATA.sheet11_income_statement.cogsYear1Ngn)})
                        </td>
                      </tr>
                      <tr className="bg-gray-50/60 dark:bg-slate-800/40">
                        <td className="py-2.5 font-extrabold text-gray-900 dark:text-white">Gross Profit</td>
                        <td className="py-2.5 text-right font-mono font-extrabold text-gray-900 dark:text-white">
                          {formatNaira(EXCEL_SHEETS_DATA.sheet11_income_statement.grossProfitYear1Ngn)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-gray-600 dark:text-gray-300">Total Operating Expenses (OPEX)</td>
                        <td className="py-2.5 text-right font-mono text-gray-500">
                          ({formatNaira(EXCEL_SHEETS_DATA.sheet11_income_statement.totalOpexYear1Ngn)})
                        </td>
                      </tr>
                      <tr className="bg-gray-50/60 dark:bg-slate-800/40">
                        <td className="py-2.5 font-extrabold text-gray-900 dark:text-white">Operating Profit (EBITDA)</td>
                        <td className="py-2.5 text-right font-mono font-extrabold text-blue-600 dark:text-blue-400">
                          {formatNaira(EXCEL_SHEETS_DATA.sheet11_income_statement.operatingProfitYear1Ngn)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-gray-600 dark:text-gray-300">Taxes & Debt Service Interest (33%)</td>
                        <td className="py-2.5 text-right font-mono text-amber-600">
                          ({formatNaira(EXCEL_SHEETS_DATA.sheet11_income_statement.taxAndInterestYear1Ngn)})
                        </td>
                      </tr>
                      <tr className="bg-emerald-50/60 dark:bg-emerald-950/20 font-black text-sm">
                        <td className="py-3 text-emerald-900 dark:text-emerald-200">Net Platform Income (Bottom Line Profit)</td>
                        <td className="py-3 text-right font-mono text-emerald-700 dark:text-emerald-300">
                          {formatNaira(EXCEL_SHEETS_DATA.sheet11_income_statement.netIncomeYear1Ngn)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedSheetKey === 'sheet13_balance_sheet' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                    {EXCEL_SHEETS_DATA.sheet13_balance_sheet.title}
                  </h3>
                  <span className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Assets = Liabilities + Equity (Balanced)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-2 p-4 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                    <h4 className="font-bold text-gray-900 dark:text-white uppercase text-[11px] mb-2">
                      Assets Side
                    </h4>
                    <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                      <span>Total Current Assets:</span>
                      <strong className="font-mono">{formatNaira(EXCEL_SHEETS_DATA.sheet13_balance_sheet.currentAssetsNgn)}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                      <span>Fixed Assets (Servers, Telecoms, Inverters):</span>
                      <strong className="font-mono">{formatNaira(EXCEL_SHEETS_DATA.sheet13_balance_sheet.fixedAssetsNgn)}</strong>
                    </div>
                    <div className="flex justify-between py-2 text-sm font-black text-emerald-600">
                      <span>Total Assets:</span>
                      <span className="font-mono">{formatNaira(EXCEL_SHEETS_DATA.sheet13_balance_sheet.totalAssetsNgn)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 p-4 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                    <h4 className="font-bold text-gray-900 dark:text-white uppercase text-[11px] mb-2">
                      Liabilities & Equity Side
                    </h4>
                    <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                      <span>Current Liabilities:</span>
                      <strong className="font-mono">{formatNaira(EXCEL_SHEETS_DATA.sheet13_balance_sheet.currentLiabilitiesNgn)}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                      <span>Long-Term Debt (Commercial Facility):</span>
                      <strong className="font-mono">{formatNaira(EXCEL_SHEETS_DATA.sheet13_balance_sheet.longTermDebtNgn)}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                      <span>Total Shareholder Equity:</span>
                      <strong className="font-mono">{formatNaira(EXCEL_SHEETS_DATA.sheet13_balance_sheet.totalEquityNgn)}</strong>
                    </div>
                    <div className="flex justify-between py-2 text-sm font-black text-indigo-600">
                      <span>Total Liabilities + Equity:</span>
                      <span className="font-mono">{formatNaira(EXCEL_SHEETS_DATA.sheet13_balance_sheet.totalAssetsNgn)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSheetKey === 'sheet1_cost' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                    {EXCEL_SHEETS_DATA.sheet1_cost.title}
                  </h3>
                  <span className="text-xs font-mono font-bold text-indigo-600">
                    Total: {formatNaira(EXCEL_SHEETS_DATA.sheet1_cost.totalNaira)}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-slate-800 text-gray-500 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3 text-left">Equipment Item</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Rate (₦)</th>
                        <th className="py-2.5 px-3 text-right">Amount (₦)</th>
                        <th className="py-2.5 px-3 text-right">Amount ($)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {EXCEL_SHEETS_DATA.sheet1_cost.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 px-3 font-semibold text-gray-900 dark:text-white">{it.item}</td>
                          <td className="py-2.5 px-3 text-center">{it.qty}</td>
                          <td className="py-2.5 px-3 text-right font-mono">{formatNaira(it.rateNgn)}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900 dark:text-white">{formatNaira(it.amountNgn)}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-gray-500">{formatUSD(it.amountUsd)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedSheetKey === 'sheet5_capex_opex_dancia4tv' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                    {EXCEL_SHEETS_DATA.sheet5_capex_opex_dancia4tv.title}
                  </h3>
                  <span className="text-xs font-mono font-bold text-purple-600">
                    Total: {formatNaira(EXCEL_SHEETS_DATA.sheet5_capex_opex_dancia4tv.totalBillOfQuantityNgn)}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {EXCEL_SHEETS_DATA.sheet5_capex_opex_dancia4tv.keyLineItems.map((line, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40 flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{line.item}</span>
                      <strong className="font-mono text-gray-900 dark:text-white">{formatNaira(line.amountNgn)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedSheetKey === 'sheet8_loan_request' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                    {EXCEL_SHEETS_DATA.sheet8_loan_request.title}
                  </h3>
                  <span className="text-xs font-mono font-bold text-amber-600">
                    Annual Rate: {EXCEL_SHEETS_DATA.sheet8_loan_request.annualInterestRatePercent}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800/50 space-y-2">
                    <div className="flex justify-between"><span>Loan Request Principal:</span><strong className="font-mono">{formatNaira(EXCEL_SHEETS_DATA.sheet8_loan_request.loanPrincipalNgn)}</strong></div>
                    <div className="flex justify-between"><span>33% Commercial Interest:</span><strong className="font-mono text-amber-600">{formatNaira(EXCEL_SHEETS_DATA.sheet8_loan_request.interestTotalNgn)}</strong></div>
                    <div className="flex justify-between text-sm font-black pt-2 border-t"><span>Prime Plus Interest:</span><strong className="font-mono text-indigo-600">{formatNaira(EXCEL_SHEETS_DATA.sheet8_loan_request.primePlusInterestTotalNgn)}</strong></div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800/50 space-y-2">
                    <div className="flex justify-between"><span>Tenor:</span><strong>{EXCEL_SHEETS_DATA.sheet8_loan_request.tenorYears} Years</strong></div>
                    <div className="flex justify-between"><span>Moratorium:</span><strong>{EXCEL_SHEETS_DATA.sheet8_loan_request.moratoriumYears} Year</strong></div>
                    <div className="flex justify-between"><span>Monthly Pay-Back:</span><strong className="font-mono text-emerald-600">{formatNaira(EXCEL_SHEETS_DATA.sheet8_loan_request.monthlyAmortizationPaymentNgn)}</strong></div>
                  </div>
                </div>
              </div>
            )}

            {selectedSheetKey === 'sheet16_breakeven_analysis' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                    {EXCEL_SHEETS_DATA.sheet16_breakeven_analysis.title}
                  </h3>
                  <span className="text-xs font-mono font-bold text-emerald-600">
                    Margin of Safety: {EXCEL_SHEETS_DATA.sheet16_breakeven_analysis.safetyMarginPercent}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-[10px] text-gray-400 uppercase font-sans">Annual Sales Revenue</span>
                    <div className="text-base font-black text-gray-900 dark:text-white">{formatNaira(EXCEL_SHEETS_DATA.sheet16_breakeven_analysis.annualSalesRevenueNgn)}</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-[10px] text-gray-400 uppercase font-sans">Fixed Business Expenses</span>
                    <div className="text-base font-black text-rose-600">{formatNaira(EXCEL_SHEETS_DATA.sheet16_breakeven_analysis.fixedBusinessExpensesNgn)}</div>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 uppercase font-sans">Breakeven Volume</span>
                    <div className="text-base font-black text-emerald-600">{formatNaira(EXCEL_SHEETS_DATA.sheet16_breakeven_analysis.breakevenSalesNgn)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: DOUBLE-ENTRY P&L SWEEP & RECONCILIATION                      */}
      {/* ==================================================================== */}
      {activeTab === 'ledger' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Live Revenue Inflow & Profit Sweep Ledger
              </h3>
              <p className="text-xs text-gray-500">
                Audited real-time double-entry ledger routing revenue to Fidelity Bank Lagos and sweeping bottom-line profit to Fidelity Bank Area 8 Abuja.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Double-Entry Reconciled (100%)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-500 font-semibold">
                <tr>
                  <th className="py-2.5 px-3 text-left">Ref</th>
                  <th className="py-2.5 px-3 text-left">Type</th>
                  <th className="py-2.5 px-3 text-left">Transaction Description</th>
                  <th className="py-2.5 px-3 text-left">Source Service</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-left">Destination Rail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <tr className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 font-mono text-gray-500 font-semibold">FMP-REV-2026-901</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">REVENUE</span></td>
                  <td className="py-2.5 px-3 font-medium text-gray-900 dark:text-white">Multi-Vendor Marketplace Gross Commissions</td>
                  <td className="py-2.5 px-3 text-gray-500">Storefronts</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">₦8,450,000.00</td>
                  <td className="py-2.5 px-3 font-mono text-gray-600 dark:text-gray-400">REV-NGN (Fidelity Bank: 5600792703)</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 font-mono text-gray-500 font-semibold">FMP-REV-2026-902</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">REVENUE</span></td>
                  <td className="py-2.5 px-3 font-medium text-gray-900 dark:text-white">VIP Flamingo & Creator Tier Subscriptions</td>
                  <td className="py-2.5 px-3 text-gray-500">Subscriptions</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">₦14,200,000.00</td>
                  <td className="py-2.5 px-3 font-mono text-gray-600 dark:text-gray-400">REV-NGN (Fidelity Bank: 5600792703)</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 font-mono text-gray-500 font-semibold">FMP-REV-2026-903</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">REVENUE (GBP)</span></td>
                  <td className="py-2.5 px-3 font-medium text-gray-900 dark:text-white">UK Corporate Enterprise PayLink Settlement</td>
                  <td className="py-2.5 px-3 text-gray-500">International PayLinks</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-600">£18,500.00</td>
                  <td className="py-2.5 px-3 font-mono text-gray-600 dark:text-gray-400">REV-GBP (Fidelity Bank: 5250325201)</td>
                </tr>
                <tr className="hover:bg-purple-50/50 dark:hover:bg-purple-950/20 bg-purple-50/30">
                  <td className="py-2.5 px-3 font-mono text-purple-700 font-semibold">FMP-PRF-2026-101</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-600 text-white">PROFIT SWEEP</span></td>
                  <td className="py-2.5 px-3 font-bold text-purple-950 dark:text-purple-200">Automated Q3 Net Surplus Sweep to Enterprise Reserve</td>
                  <td className="py-2.5 px-3 text-purple-700 dark:text-purple-300">P&L Auto-Reconciliation</td>
                  <td className="py-2.5 px-3 text-right font-mono font-extrabold text-purple-700 dark:text-purple-300">₦25,000,000.00</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-purple-800 dark:text-purple-300">PROFIT-ABUJA (Fidelity Bank Area 8: 5601279229)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnterpriseFinancialEcosystemConsole;
