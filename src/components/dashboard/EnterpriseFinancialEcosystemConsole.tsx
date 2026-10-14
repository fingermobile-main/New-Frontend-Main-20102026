import React, { useState, useMemo, useEffect } from 'react';
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
  Percent,
  Lock,
  Unlock,
  AlertTriangle,
  Plus,
  Trash2,
  Save,
  Check,
  UserCheck,
  ArrowRight,
  Shield,
  Layers,
  FileCheck,
  RotateCcw
} from 'lucide-react';
import {
  PLATFORM_REVENUE_RAILS,
  PLATFORM_PROFIT_RAILS,
  ECONOMIC_DEFINITIONS,
  computeSimpleInterest,
  computeCompoundInterest,
  computePresentValue,
  computeEffectiveAnnualRate,
  evaluateAccountingRatios,
  BankAccountRail,
  IncomeStatementSheetData,
  BalanceSheetData,
  CostTccBoqData,
  StartupFundsData,
  CapexOpexDancia4TvData,
  FinancialLineItem,
  DEFAULT_INCOME_STATEMENT,
  DEFAULT_BALANCE_SHEET,
  DEFAULT_COST_TCC_BOQ,
  DEFAULT_STARTUP_FUNDS,
  DEFAULT_CAPEX_OPEX_DANCIA4TV
} from '../../constants/platformFinancialEcosystemData';
import SubscriptionModelsConsole from './SubscriptionModelsConsole';

type ActiveTab = 'rails' | 'ratios' | 'growth-lab' | 'excel-sheets' | 'subscriptions' | 'ledger';
type SheetKey =
  | 'income_statement'
  | 'balance_sheet'
  | 'cost_tcc_boq'
  | 'startup_funds'
  | 'capex_opex_dancia';

type GovernanceRole = 'CFO' | 'SUPER_ADMIN';

export const EnterpriseFinancialEcosystemConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('rails');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [governanceRole, setGovernanceRole] = useState<GovernanceRole>('CFO');
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [isEditingSheet, setIsEditingSheet] = useState<boolean>(true);

  // --------------------------------------------------------------------------
  // Dynamic Financial Sheets State (with LocalStorage persistence)
  // --------------------------------------------------------------------------
  const [incomeStatement, setIncomeStatement] = useState<IncomeStatementSheetData>(() => {
    try {
      const saved = localStorage.getItem('fmp_dynamic_sheet_income_statement');
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    return DEFAULT_INCOME_STATEMENT;
  });

  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetData>(() => {
    try {
      const saved = localStorage.getItem('fmp_dynamic_sheet_balance_sheet');
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    return DEFAULT_BALANCE_SHEET;
  });

  const [costTccBoq, setCostTccBoq] = useState<CostTccBoqData>(() => {
    try {
      const saved = localStorage.getItem('fmp_dynamic_sheet_cost_tcc_boq');
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    return DEFAULT_COST_TCC_BOQ;
  });

  const [startupFunds, setStartupFunds] = useState<StartupFundsData>(() => {
    try {
      const saved = localStorage.getItem('fmp_dynamic_sheet_startup_funds');
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    return DEFAULT_STARTUP_FUNDS;
  });

  const [capexOpexDancia, setCapexOpexDancia] = useState<CapexOpexDancia4TvData>(() => {
    try {
      const saved = localStorage.getItem('fmp_dynamic_sheet_capex_opex_dancia');
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    return DEFAULT_CAPEX_OPEX_DANCIA4TV;
  });

  const [selectedSheetKey, setSelectedSheetKey] = useState<SheetKey>('income_statement');

  // Listen for external subscriptions P&L sync events
  useEffect(() => {
    const handleSubSync = (e: any) => {
      const annualNgn = e.detail?.annualTotalNgn;
      if (annualNgn) {
        setIncomeStatement((prev) => {
          const updatedRevenues = prev.revenues.map((r) =>
            r.id === 'rev_subscriptions'
              ? { ...r, amountNgn: annualNgn, notes: `Auto-synced from active subscriptions (${e.detail?.count || 10} tiers)` }
              : r
          );
          const updated: IncomeStatementSheetData = {
            ...prev,
            revenues: updatedRevenues,
            approval: { ...prev.approval, status: 'DRAFT' as const, lastEditedAt: new Date().toISOString() }
          };
          localStorage.setItem('fmp_dynamic_sheet_income_statement', JSON.stringify(updated));
          return updated;
        });
        showBanner(`📥 Subscriptions successfully synced into 8. Income Statement (P&L): ₦${annualNgn.toLocaleString()}`);
      }
    };
    window.addEventListener('fingermobile_subscriptions_pnl_sync', handleSubSync);
    return () => window.removeEventListener('fingermobile_subscriptions_pnl_sync', handleSubSync);
  }, []);

  const showBanner = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(null), 4000);
  };

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
  // Live Calculated Financial Metrics for Dynamic Sheets
  // --------------------------------------------------------------------------
  const incomeMetrics = useMemo(() => {
    const totalRevenue = incomeStatement.revenues.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const totalCogs = incomeStatement.cogs.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const grossProfit = totalRevenue - totalCogs;
    const grossMarginPercent = totalRevenue > 0 ? Number(((grossProfit / totalRevenue) * 100).toFixed(2)) : 0;
    const totalOpex = incomeStatement.opex.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const ebitda = grossProfit - totalOpex;
    const debtService = Number(incomeStatement.loanInterestAnnualNgn) || 0;
    const profitBeforeTax = ebitda - debtService;
    const tax = profitBeforeTax > 0 ? profitBeforeTax * (incomeStatement.taxRatePercent / 100) : 0;
    const netIncome = profitBeforeTax - tax;
    const netProfitMarginPercent = totalRevenue > 0 ? Number(((netIncome / totalRevenue) * 100).toFixed(2)) : 0;

    return {
      totalRevenue,
      totalCogs,
      grossProfit,
      grossMarginPercent,
      totalOpex,
      ebitda,
      debtService,
      profitBeforeTax,
      tax,
      netIncome,
      netProfitMarginPercent
    };
  }, [incomeStatement]);

  const balanceMetrics = useMemo(() => {
    const currentAssetsTotal = balanceSheet.currentAssets.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const grossFixedAssets = balanceSheet.fixedAssets.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const netFixedAssets = grossFixedAssets - (Number(balanceSheet.accumulatedDepreciationNgn) || 0);
    const totalAssets = currentAssetsTotal + netFixedAssets;

    const currentLiabTotal = balanceSheet.currentLiabilities.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const longTermDebtTotal = balanceSheet.longTermLiabilities.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const totalLiabilities = currentLiabTotal + longTermDebtTotal;

    const equityTotal = balanceSheet.equityItems.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0) + incomeMetrics.netIncome;
    const totalLiabAndEquity = totalLiabilities + equityTotal;
    const isBalanced = Math.abs(totalAssets - totalLiabAndEquity) < 1.00;
    const varianceDelta = totalAssets - totalLiabAndEquity;

    return {
      currentAssetsTotal,
      grossFixedAssets,
      netFixedAssets,
      totalAssets,
      currentLiabTotal,
      longTermDebtTotal,
      totalLiabilities,
      equityTotal,
      totalLiabAndEquity,
      isBalanced,
      varianceDelta
    };
  }, [balanceSheet, incomeMetrics.netIncome]);

  const costTccMetrics = useMemo(() => {
    const totalNgn = costTccBoq.items.reduce((acc, it) => acc + ((Number(it.quantity) || 1) * (Number(it.unitPriceNgn) || 0)), 0);
    const rate = costTccBoq.usdExchangeRate || 1550;
    const totalUsd = totalNgn / rate;
    return { totalNgn, totalUsd, rate };
  }, [costTccBoq]);

  const startupFundsMetrics = useMemo(() => {
    const totalFixedUsd = startupFunds.fixedAssets.reduce((acc, it) => acc + (Number(it.amountUsd) || 0), 0);
    const totalFixedNgn = startupFunds.fixedAssets.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const totalOpUsd = startupFunds.operatingCapital.reduce((acc, it) => acc + (Number(it.amountUsd) || 0), 0);
    const totalOpNgn = startupFunds.operatingCapital.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    return {
      totalFixedUsd,
      totalFixedNgn,
      totalOpUsd,
      totalOpNgn,
      grandTotalUsd: totalFixedUsd + totalOpUsd,
      grandTotalNgn: totalFixedNgn + totalOpNgn
    };
  }, [startupFunds]);

  const capexOpexDanciaMetrics = useMemo(() => {
    const totalAllocatedNgn = capexOpexDancia.items.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const totalAllocatedUsd = totalAllocatedNgn / (capexOpexDancia.usdExchangeRate || 1550);
    const loanTarget = capexOpexDancia.totalLoanAllocationNgn || 1412050000;
    const remainingBufferNgn = loanTarget - totalAllocatedNgn;
    return { totalAllocatedNgn, totalAllocatedUsd, loanTarget, remainingBufferNgn };
  }, [capexOpexDancia]);

  // --------------------------------------------------------------------------
  // Financial Sheets Workflow Handlers (CFO Edit vs. Super Admin Approval ONLY)
  // --------------------------------------------------------------------------
  const handleSaveWorkingDraft = () => {
    if (governanceRole !== 'CFO') {
      showBanner('⚠️ Note: Working drafts are prepared under CFO authority.');
    }
    const updateMeta = (prev: any) => ({
      ...prev,
      approval: {
        ...prev.approval,
        status: 'DRAFT' as const,
        lastEditedBy: 'Mrs. Mbah Eunice Emonena (CFO)',
        lastEditedAt: new Date().toISOString(),
        version: (prev.approval?.version || 1) + 1
      }
    });

    if (selectedSheetKey === 'income_statement') {
      const updated = updateMeta(incomeStatement);
      setIncomeStatement(updated);
      localStorage.setItem('fmp_dynamic_sheet_income_statement', JSON.stringify(updated));
    } else if (selectedSheetKey === 'balance_sheet') {
      const updated = updateMeta(balanceSheet);
      setBalanceSheet(updated);
      localStorage.setItem('fmp_dynamic_sheet_balance_sheet', JSON.stringify(updated));
    } else if (selectedSheetKey === 'cost_tcc_boq') {
      const updated = updateMeta(costTccBoq);
      setCostTccBoq(updated);
      localStorage.setItem('fmp_dynamic_sheet_cost_tcc_boq', JSON.stringify(updated));
    } else if (selectedSheetKey === 'startup_funds') {
      const updated = updateMeta(startupFunds);
      setStartupFunds(updated);
      localStorage.setItem('fmp_dynamic_sheet_startup_funds', JSON.stringify(updated));
    } else if (selectedSheetKey === 'capex_opex_dancia') {
      const updated = updateMeta(capexOpexDancia);
      setCapexOpexDancia(updated);
      localStorage.setItem('fmp_dynamic_sheet_capex_opex_dancia', JSON.stringify(updated));
    }
    showBanner(`💾 Working draft saved locally to sovereign financial database.`);
  };

  const handleSubmitForApproval = () => {
    const updateMeta = (prev: any) => ({
      ...prev,
      approval: {
        ...prev.approval,
        status: 'PENDING_SUPER_ADMIN_APPROVAL' as const,
        lastEditedBy: 'Mrs. Mbah Eunice Emonena (CFO & Co-Founder)',
        lastEditedAt: new Date().toISOString(),
        notes: 'Submitted by CFO for statutory ratification and executive sign-off.'
      }
    });

    if (selectedSheetKey === 'income_statement') {
      const updated = updateMeta(incomeStatement);
      setIncomeStatement(updated);
      localStorage.setItem('fmp_dynamic_sheet_income_statement', JSON.stringify(updated));
    } else if (selectedSheetKey === 'balance_sheet') {
      const updated = updateMeta(balanceSheet);
      setBalanceSheet(updated);
      localStorage.setItem('fmp_dynamic_sheet_balance_sheet', JSON.stringify(updated));
    } else if (selectedSheetKey === 'cost_tcc_boq') {
      const updated = updateMeta(costTccBoq);
      setCostTccBoq(updated);
      localStorage.setItem('fmp_dynamic_sheet_cost_tcc_boq', JSON.stringify(updated));
    } else if (selectedSheetKey === 'startup_funds') {
      const updated = updateMeta(startupFunds);
      setStartupFunds(updated);
      localStorage.setItem('fmp_dynamic_sheet_startup_funds', JSON.stringify(updated));
    } else if (selectedSheetKey === 'capex_opex_dancia') {
      const updated = updateMeta(capexOpexDancia);
      setCapexOpexDancia(updated);
      localStorage.setItem('fmp_dynamic_sheet_capex_opex_dancia', JSON.stringify(updated));
    }
    showBanner(`📤 Sheet submitted to SUPER ADMIN for ratification. Status: PENDING_APPROVAL.`);
  };

  const handleSuperAdminApprove = () => {
    if (governanceRole !== 'SUPER_ADMIN') {
      alert('🔒 ACCESS RESTRICTED: Under FingerMobile Corporate Governance, only the SUPER ADMIN can ratify and lock financial sheets.');
      return;
    }

    const updateMeta = (prev: any) => ({
      ...prev,
      approval: {
        ...prev.approval,
        status: 'APPROVED_BY_SUPER_ADMIN' as const,
        approvedBy: 'SUPER ADMIN (Council Supreme Authority)',
        approvedAt: new Date().toISOString(),
        notes: 'Officially audited, verified, and ratified as the immutable baseline.'
      }
    });

    if (selectedSheetKey === 'income_statement') {
      const updated = updateMeta(incomeStatement);
      setIncomeStatement(updated);
      localStorage.setItem('fmp_dynamic_sheet_income_statement', JSON.stringify(updated));
    } else if (selectedSheetKey === 'balance_sheet') {
      const updated = updateMeta(balanceSheet);
      setBalanceSheet(updated);
      localStorage.setItem('fmp_dynamic_sheet_balance_sheet', JSON.stringify(updated));
    } else if (selectedSheetKey === 'cost_tcc_boq') {
      const updated = updateMeta(costTccBoq);
      setCostTccBoq(updated);
      localStorage.setItem('fmp_dynamic_sheet_cost_tcc_boq', JSON.stringify(updated));
    } else if (selectedSheetKey === 'startup_funds') {
      const updated = updateMeta(startupFunds);
      setStartupFunds(updated);
      localStorage.setItem('fmp_dynamic_sheet_startup_funds', JSON.stringify(updated));
    } else if (selectedSheetKey === 'capex_opex_dancia') {
      const updated = updateMeta(capexOpexDancia);
      setCapexOpexDancia(updated);
      localStorage.setItem('fmp_dynamic_sheet_capex_opex_dancia', JSON.stringify(updated));
    }
    showBanner(`🛡️ SUCCESS: Sheet officially RATIFIED and LOCKED by SUPER ADMIN!`);
  };

  const handleSuperAdminUnlock = () => {
    if (governanceRole !== 'SUPER_ADMIN') {
      alert('🔒 ACCESS RESTRICTED: Only the SUPER ADMIN can unlock an approved financial sheet.');
      return;
    }
    if (!window.confirm('Unlock this sheet for revisions by the CFO and Accounts staff?')) return;

    const updateMeta = (prev: any) => ({
      ...prev,
      approval: {
        ...prev.approval,
        status: 'REVISION_REQUESTED' as const,
        notes: 'Unlocked by Super Admin for CFO revisions.'
      }
    });

    if (selectedSheetKey === 'income_statement') {
      const updated = updateMeta(incomeStatement);
      setIncomeStatement(updated);
      localStorage.setItem('fmp_dynamic_sheet_income_statement', JSON.stringify(updated));
    } else if (selectedSheetKey === 'balance_sheet') {
      const updated = updateMeta(balanceSheet);
      setBalanceSheet(updated);
      localStorage.setItem('fmp_dynamic_sheet_balance_sheet', JSON.stringify(updated));
    } else if (selectedSheetKey === 'cost_tcc_boq') {
      const updated = updateMeta(costTccBoq);
      setCostTccBoq(updated);
      localStorage.setItem('fmp_dynamic_sheet_cost_tcc_boq', JSON.stringify(updated));
    } else if (selectedSheetKey === 'startup_funds') {
      const updated = updateMeta(startupFunds);
      setStartupFunds(updated);
      localStorage.setItem('fmp_dynamic_sheet_startup_funds', JSON.stringify(updated));
    } else if (selectedSheetKey === 'capex_opex_dancia') {
      const updated = updateMeta(capexOpexDancia);
      setCapexOpexDancia(updated);
      localStorage.setItem('fmp_dynamic_sheet_capex_opex_dancia', JSON.stringify(updated));
    }
    showBanner(`🔓 Sheet unlocked for revision by CFO.`);
  };

  const handleResetToBaseline = () => {
    if (window.confirm('Reset this sheet back to platform default baseline values?')) {
      if (selectedSheetKey === 'income_statement') {
        setIncomeStatement(DEFAULT_INCOME_STATEMENT);
        localStorage.removeItem('fmp_dynamic_sheet_income_statement');
      } else if (selectedSheetKey === 'balance_sheet') {
        setBalanceSheet(DEFAULT_BALANCE_SHEET);
        localStorage.removeItem('fmp_dynamic_sheet_balance_sheet');
      } else if (selectedSheetKey === 'cost_tcc_boq') {
        setCostTccBoq(DEFAULT_COST_TCC_BOQ);
        localStorage.removeItem('fmp_dynamic_sheet_cost_tcc_boq');
      } else if (selectedSheetKey === 'startup_funds') {
        setStartupFunds(DEFAULT_STARTUP_FUNDS);
        localStorage.removeItem('fmp_dynamic_sheet_startup_funds');
      } else if (selectedSheetKey === 'capex_opex_dancia') {
        setCapexOpexDancia(DEFAULT_CAPEX_OPEX_DANCIA4TV);
        localStorage.removeItem('fmp_dynamic_sheet_capex_opex_dancia');
      }
      showBanner(`🔄 Sheet reset to platform default baseline.`);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const formatNaira = (val: number) => {
    return '₦' + Number(val || 0).toLocaleString('en-NG', { maximumFractionDigits: 2 });
  };

  const formatUSD = (val: number) => {
    return '$' + Number(val || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  // Helper for current sheet approval metadata
  const currentApproval = useMemo(() => {
    if (selectedSheetKey === 'income_statement') return incomeStatement.approval;
    if (selectedSheetKey === 'balance_sheet') return balanceSheet.approval;
    if (selectedSheetKey === 'cost_tcc_boq') return costTccBoq.approval;
    if (selectedSheetKey === 'startup_funds') return startupFunds.approval;
    return capexOpexDancia.approval;
  }, [selectedSheetKey, incomeStatement, balanceSheet, costTccBoq, startupFunds, capexOpexDancia]);

  return (
    <div className="space-y-6 text-black">
      {/* Status Notification Banner */}
      {statusBanner && (
        <div className="p-4 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{statusBanner}</span>
          </div>
          <button onClick={() => setStatusBanner(null)} className="text-white hover:opacity-80">
            ✕
          </button>
        </div>
      )}

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
            <p className="text-sm text-slate-200 max-w-2xl font-medium">
              100% segregated financial architecture. All Platform <strong>Revenue</strong> flows directly into dedicated multi-currency
              rails at <strong>Fidelity Bank Lagos</strong>, while all Platform <strong>Profit</strong> is swept into <strong>Fidelity Bank Abuja Area 8 Branch</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 backdrop-blur-sm">
              <div className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">Revenue Destination</div>
              <div className="text-sm font-black text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Fidelity Bank Lagos
              </div>
            </div>
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 backdrop-blur-sm">
              <div className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">Profit Surplus Rail</div>
              <div className="text-sm font-black text-purple-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                Fidelity Bank Abuja (Area 8)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Governance & Role Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-gray-300 shadow-sm">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-indigo-600" />
          <div>
            <span className="text-xs uppercase tracking-wider font-extrabold text-black block">
              Active Executive Governance Session
            </span>
            <span className="text-xs text-black font-semibold">
              Financial sheets are editable by CFO & ratified by Super Admin ONLY.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-black mr-1">Switch Role:</span>
          <button
            onClick={() => setGovernanceRole('CFO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              governanceRole === 'CFO'
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                : 'bg-gray-100 hover:bg-gray-200 text-black border border-gray-300'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>👩‍💼 CFO (Mrs. Mbah Eunice Emonena)</span>
          </button>
          <button
            onClick={() => setGovernanceRole('SUPER_ADMIN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              governanceRole === 'SUPER_ADMIN'
                ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-300'
                : 'bg-gray-100 hover:bg-gray-200 text-black border border-gray-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>🛡️ SUPER ADMIN (Supreme Council)</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tab Bar */}
      <div className="flex border-b border-gray-300 space-x-2 overflow-x-auto pb-1 bg-white p-2 rounded-t-xl">
        {[
          { id: 'rails', label: '1. Sovereign Bank Rails (Revenue vs. Profit)', icon: Landmark },
          { id: 'ratios', label: '2. Accounting & Financial Ratios', icon: Scale },
          { id: 'growth-lab', label: '3. Interest & Growth Lab', icon: Calculator },
          { id: 'excel-sheets', label: '4. Dynamic Financial Sheets (P&L, Balance Sheet, BoQ)', icon: FileSpreadsheet },
          { id: 'subscriptions', label: '5. Platform Subscriptions & Monetization Feeder', icon: Layers },
          { id: 'ledger', label: '6. Double-Entry P&L Sweep Ledger', icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`flex items-center gap-2 py-3 px-4 font-bold text-xs whitespace-nowrap rounded-lg transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-black hover:text-black hover:bg-gray-100 font-semibold'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-black'}`} />
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
            <div className="bg-white rounded-xl border border-emerald-300 p-5 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wide bg-emerald-100 text-emerald-950 border border-emerald-300">
                  Top Line Revenue
                </span>
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-black text-black mb-1.5">
                {ECONOMIC_DEFINITIONS.revenue.title}
              </h3>
              <p className="text-xs text-black font-medium mb-3 leading-relaxed">
                {ECONOMIC_DEFINITIONS.revenue.definition}
              </p>
              <div className="pt-3 border-t border-gray-200 text-[11px]">
                <strong className="text-black font-extrabold block mb-1">Designated Inflow Rail:</strong>
                <span className="text-black font-bold font-mono">
                  Fidelity Bank Lagos (NGN: 5600792703)
                </span>
              </div>
            </div>

            {/* Income */}
            <div className="bg-white rounded-xl border border-blue-300 p-5 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wide bg-blue-100 text-blue-950 border border-blue-300">
                  Gross & Net Income
                </span>
                <Scale className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-black text-black mb-1.5">
                {ECONOMIC_DEFINITIONS.income.title}
              </h3>
              <p className="text-xs text-black font-medium mb-3 leading-relaxed">
                {ECONOMIC_DEFINITIONS.income.definition}
              </p>
              <div className="pt-3 border-t border-gray-200 text-[11px] space-y-1">
                <div className="font-mono text-black font-semibold">
                  Gross: <strong className="text-black font-black">Sales - COGS</strong>
                </div>
                <div className="font-mono text-black font-semibold">
                  Net: <strong className="text-black font-black">Total Rev - Total Exp</strong>
                </div>
              </div>
            </div>

            {/* Profit */}
            <div className="bg-white rounded-xl border border-purple-300 p-5 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wide bg-purple-100 text-purple-950 border border-purple-300">
                  Bottom Line Profit
                </span>
                <Landmark className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-black text-black mb-1.5">
                {ECONOMIC_DEFINITIONS.profit.title}
              </h3>
              <p className="text-xs text-black font-medium mb-3 leading-relaxed">
                {ECONOMIC_DEFINITIONS.profit.definition}
              </p>
              <div className="pt-3 border-t border-gray-200 text-[11px]">
                <strong className="text-black font-extrabold block mb-1">Designated Surplus Rail:</strong>
                <span className="text-black font-bold font-mono">
                  Fidelity Bank Area 8 Abuja (5601279229)
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Multi-Currency Platform Revenue Destination Bank Rails */}
          <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-300">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Primary Inflow Protocol
                </div>
                <h3 className="text-xl font-extrabold text-black">
                  1. Platform Revenue Destination Bank Rails (Fidelity Bank)
                </h3>
                <p className="text-xs text-black font-medium">
                  All gross revenue generated across FingerMobile Storefronts, Subscriptions, Marketplace, Advertising, and Infinity Coin must be paid directly into these accounts.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-gray-100 text-black border border-gray-300">
                  Swift: FIDTNGLA
                </span>
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-emerald-100 text-black border border-emerald-300">
                  Lagos Corporate HQ
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PLATFORM_REVENUE_RAILS.accounts.map((rail: BankAccountRail) => (
                <div
                  key={rail.id}
                  className="rounded-xl border border-gray-300 bg-white p-5 space-y-4 hover:shadow-md transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wide bg-emerald-600 text-white shadow-2xs">
                      {rail.currency} Rail
                    </span>
                    <span className="text-[11px] font-extrabold text-black flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Active Online
                    </span>
                  </div>

                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-black font-extrabold">
                      Account Name
                    </div>
                    <div className="text-sm font-black text-black">
                      {rail.accountName}
                    </div>
                    <div className="text-xs text-black font-semibold">
                      {rail.bankName} • {rail.branch}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-300 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-black text-black">Account Number</div>
                      <div className="font-mono font-black text-base text-black tracking-wider">
                        {rail.accountNumber}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(rail.accountNumber, rail.id)}
                      className="p-1.5 rounded hover:bg-gray-200 text-black hover:text-emerald-700 transition"
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
                    <div className="p-2 rounded bg-gray-50 border border-gray-300">
                      <div className="text-[10px] text-black uppercase font-extrabold">USSD Rail</div>
                      <div className="font-mono font-black text-black">{rail.ussdCode}</div>
                    </div>
                    <div className="p-2 rounded bg-gray-50 border border-gray-300">
                      <div className="text-[10px] text-black uppercase font-extrabold">Bank Swift</div>
                      <div className="font-mono font-black text-black">{rail.swiftCode}</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-black font-medium leading-tight">
                    {rail.purpose}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Platform PROFIT Destination Bank Rails */}
          <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-300">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black mb-1">
                  <Landmark className="w-4 h-4 text-purple-600" />
                  Sovereign Surplus Protocol
                </div>
                <h3 className="text-xl font-extrabold text-black">
                  2. Platform PROFIT Destination Bank Rail (Fidelity Bank Abuja Area 8)
                </h3>
                <p className="text-xs text-black font-medium">
                  All bottom-line net profit remaining after deducting operational expenses, COGS, taxes, and interest must be swept to this sovereign facility.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-purple-100 text-black border border-purple-300">
                  Swift: FIDTNGLA
                </span>
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-gray-100 text-black border border-gray-300">
                  Abuja F.C.T • Area 8 Branch
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Detailed Bank Card */}
              <div className="lg:col-span-2 rounded-xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
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
              <div className="bg-white rounded-xl border border-gray-300 p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-base font-black text-black mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Automated Profit Sweep Rules
                  </h4>
                  <p className="text-xs text-black font-medium leading-relaxed mb-4">
                    Daily 23:59:00 UTC reconciliation sweeps the net margin surplus from Lagos clearing into Abuja Area 8 vault reserves.
                  </p>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                      <span className="text-black font-semibold">Auto-Sweep Status:</span>
                      <span className="px-2 py-0.5 rounded font-extrabold bg-emerald-100 text-black">Enabled & Active</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                      <span className="text-black font-semibold">Sweep Minimum Threshold:</span>
                      <strong className="font-mono text-black font-extrabold">{formatNaira(PLATFORM_PROFIT_RAILS.minSweepThresholdNgn)}</strong>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-black font-semibold">Accumulated Profit in Reserve:</span>
                      <strong className="font-mono text-black font-black">{formatNaira(PLATFORM_PROFIT_RAILS.totalAccumulatedProfitNgn)}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-300 text-[11px] text-black font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Dual-Key Sign-off Required for Withdrawals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: ACCOUNTING & FINANCIAL RATIOS SANDBOX                         */}
      {/* ==================================================================== */}
      {activeTab === 'ratios' && (
        <div className="space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-300 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase text-black">Balance Sheet Equation</span>
                {dynamicEvaluation.balanceSheetEquation.isBalanced ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                )}
              </div>
              <div className="text-lg font-black text-black">
                {dynamicEvaluation.balanceSheetEquation.isBalanced ? 'Balanced (100%)' : 'Imbalance Detected'}
              </div>
              <div className="text-xs text-black font-semibold mt-1">
                Assets: {formatNaira(dynamicEvaluation.balanceSheetEquation.assets)}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-300 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase text-black">Current Ratio</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-100 text-black">
                  {dynamicEvaluation.ratios.currentRatio.status}
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-black">
                {dynamicEvaluation.ratios.currentRatio.value}x
              </div>
              <div className="text-xs text-black font-semibold mt-1">
                Benchmark: {dynamicEvaluation.ratios.currentRatio.benchmark}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-300 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase text-black">Quick Ratio (Acid-Test)</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-black">
                  {dynamicEvaluation.ratios.quickRatio.status}
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-black">
                {dynamicEvaluation.ratios.quickRatio.value}x
              </div>
              <div className="text-xs text-black font-semibold mt-1">
                Benchmark: {dynamicEvaluation.ratios.quickRatio.benchmark}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-300 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase text-black">Return on Assets (ROA)</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-purple-100 text-black">
                  {dynamicEvaluation.ratios.returnOnAssets.status}
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-black">
                {dynamicEvaluation.ratios.returnOnAssets.percent}%
              </div>
              <div className="text-xs text-black font-semibold mt-1">
                Benchmark: {dynamicEvaluation.ratios.returnOnAssets.benchmark}
              </div>
            </div>
          </div>

          {/* Interactive Ratio Simulation Sandbox */}
          <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-gray-300">
              <div>
                <h3 className="font-extrabold text-lg text-black flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-600" />
                  Dynamic Business & Accounting Ratio Sandbox
                </h3>
                <p className="text-xs text-black font-medium">
                  Modify the base parameters to simulate asset liquidity, gross/net margin, and leverage ratios in real-time.
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
                className="px-3 py-1.5 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-black" />
                <span>Reset to Platform Defaults</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Assets & Liabilities Column */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-black tracking-wider border-b border-gray-200 pb-1">
                  1. Balance Sheet Parameters
                </h4>
                <div>
                  <label className="text-black font-bold text-xs block mb-1">Total Assets (₦)</label>
                  <input
                    type="number"
                    value={sandboxAssets}
                    onChange={(e) => setSandboxAssets(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="text-black font-bold text-xs block mb-1">Total Liabilities (₦)</label>
                  <input
                    type="number"
                    value={sandboxLiabilities}
                    onChange={(e) => setSandboxLiabilities(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="text-black font-bold text-xs block mb-1">Shareholder Equity (₦)</label>
                  <input
                    type="number"
                    value={sandboxEquity}
                    onChange={(e) => setSandboxEquity(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
              </div>

              {/* Working Capital Column */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-black tracking-wider border-b border-gray-200 pb-1">
                  2. Liquidity & Working Capital
                </h4>
                <div>
                  <label className="text-black font-bold text-xs block mb-1">Current Assets (₦)</label>
                  <input
                    type="number"
                    value={sandboxCurrentAssets}
                    onChange={(e) => setSandboxCurrentAssets(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="text-black font-bold text-xs block mb-1">Current Liabilities (₦)</label>
                  <input
                    type="number"
                    value={sandboxCurrentLiabilities}
                    onChange={(e) => setSandboxCurrentLiabilities(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="text-black font-bold text-xs block mb-1">Inventory (₦)</label>
                  <input
                    type="number"
                    value={sandboxInventory}
                    onChange={(e) => setSandboxInventory(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
              </div>

              {/* Income Metrics Column */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-black tracking-wider border-b border-gray-200 pb-1">
                  3. Income & Profit Drivers
                </h4>
                <div>
                  <label className="text-black font-bold text-xs block mb-1">Total Gross Revenue (₦)</label>
                  <input
                    type="number"
                    value={sandboxRevenue}
                    onChange={(e) => setSandboxRevenue(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="text-black font-bold text-xs block mb-1">Cost of Goods Sold (COGS) (₦)</label>
                  <input
                    type="number"
                    value={sandboxCogs}
                    onChange={(e) => setSandboxCogs(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="text-black font-bold text-xs block mb-1">Total Operating Expenses (OPEX) (₦)</label>
                  <input
                    type="number"
                    value={sandboxExpenses}
                    onChange={(e) => setSandboxExpenses(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Simulated Live Results Grid */}
            <div className="mt-6 pt-4 border-t border-gray-300 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-black block text-[10px] uppercase font-sans font-bold">Simulated Gross Profit</span>
                <span className="text-sm font-black text-black">
                  {formatNaira(dynamicEvaluation.incomeMetrics.grossProfit)}
                </span>
                <div className="text-[10px] text-black font-semibold">Margin: {dynamicEvaluation.incomeMetrics.grossProfitMarginPercent}%</div>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-black block text-[10px] uppercase font-sans font-bold">Simulated Net Income</span>
                <span className="text-sm font-black text-black">
                  {formatNaira(dynamicEvaluation.incomeMetrics.netIncome)}
                </span>
                <div className="text-[10px] text-black font-semibold">Margin: {dynamicEvaluation.incomeMetrics.netProfitMarginPercent}%</div>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-black block text-[10px] uppercase font-sans font-bold">Debt-to-Equity Ratio</span>
                <span className="text-sm font-black text-black">
                  {dynamicEvaluation.ratios.debtToEquity.value}x
                </span>
                <div className="text-[10px] text-black font-semibold">{dynamicEvaluation.ratios.debtToEquity.status}</div>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-black block text-[10px] uppercase font-sans font-bold">Balance Equation Status</span>
                <span className={`text-sm font-black ${dynamicEvaluation.balanceSheetEquation.isBalanced ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {dynamicEvaluation.balanceSheetEquation.isBalanced ? 'Balanced' : 'Imbalanced'}
                </span>
                <div className="text-[10px] text-black font-semibold">Assets = Liab + Equity</div>
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
            <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-300">
                <div>
                  <h3 className="font-extrabold text-base text-black flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-600" />
                    Simple Interest & Amount Calculator
                  </h3>
                  <div className="text-xs font-mono font-bold text-black">
                    I = P × r × t &nbsp;|&nbsp; A = P(1 + r × t)
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-[10px] font-black bg-emerald-100 text-black">
                  Linear Growth
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-black font-bold block mb-1">Principal (P)</label>
                  <input
                    type="number"
                    value={simpleP}
                    onChange={(e) => setSimpleP(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="text-black font-bold block mb-1">Annual Rate (r)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={simpleR}
                    onChange={(e) => setSimpleR(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="text-black font-bold block mb-1">Tenor in Years (t)</label>
                  <input
                    type="number"
                    value={simpleT}
                    onChange={(e) => setSimpleT(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase font-black text-black">
                    Calculated Interest (I)
                  </div>
                  <div className="text-lg font-black font-mono text-black">
                    {formatNaira(simpleResult.interest)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-black text-black">
                    Total Amount (A = P + I)
                  </div>
                  <div className="text-lg font-black font-mono text-black">
                    {formatNaira(simpleResult.totalAmount)}
                  </div>
                </div>
              </div>
            </div>

            {/* Compound Interest (Future Value) Engine */}
            <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-300">
                <div>
                  <h3 className="font-extrabold text-base text-black flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Compound Interest (Future Value)
                  </h3>
                  <div className="text-xs font-mono font-bold text-black">
                    FV = PV × (1 + r/n)^(n × t)
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-[10px] font-black bg-blue-100 text-black">
                  Exponential Growth
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>
                  <label className="text-black font-bold block mb-1">PV</label>
                  <input
                    type="number"
                    value={compoundPv}
                    onChange={(e) => setCompoundPv(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="text-black font-bold block mb-1">Rate (r)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={compoundR}
                    onChange={(e) => setCompoundR(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="text-black font-bold block mb-1">Periods/Yr (n)</label>
                  <input
                    type="number"
                    value={compoundN}
                    onChange={(e) => setCompoundN(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="text-black font-bold block mb-1">Years (t)</label>
                  <input
                    type="number"
                    value={compoundT}
                    onChange={(e) => setCompoundT(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 border border-blue-300 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase font-black text-black">
                    Future Value (FV)
                  </div>
                  <div className="text-lg font-black font-mono text-black">
                    {formatNaira(compoundResult.futureValue)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-black text-black">
                    Compound Interest Accrued
                  </div>
                  <div className="text-lg font-black font-mono text-black">
                    {formatNaira(compoundResult.interestEarned)}
                  </div>
                </div>
              </div>
            </div>

            {/* Present Value (PV) Engine */}
            <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-300">
                <div>
                  <h3 className="font-extrabold text-base text-black flex items-center gap-2">
                    <Scale className="w-4 h-4 text-purple-600" />
                    Present Value (Discounting Engine)
                  </h3>
                  <div className="text-xs font-mono font-bold text-black">
                    PV = FV / (1 + r)^t
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-[10px] font-black bg-purple-100 text-black">
                  Time-Value of Money
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-black font-bold block mb-1">Target Future Value (FV)</label>
                  <input
                    type="number"
                    value={pvFv}
                    onChange={(e) => setPvFv(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="text-black font-bold block mb-1">Discount Rate (r)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={pvR}
                    onChange={(e) => setPvR(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="text-black font-bold block mb-1">Years (t)</label>
                  <input
                    type="number"
                    value={pvT}
                    onChange={(e) => setPvT(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-purple-50 border border-purple-300">
                <div className="text-[10px] uppercase font-black text-black">
                  Required Present Value Investment (PV)
                </div>
                <div className="text-xl font-black font-mono text-black">
                  {formatNaira(pvResult.presentValue)}
                </div>
              </div>
            </div>

            {/* Effective Annual Rate (EAR) Engine */}
            <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-300">
                <div>
                  <h3 className="font-extrabold text-base text-black flex items-center gap-2">
                    <Percent className="w-4 h-4 text-amber-600" />
                    Effective Annual Rate (EAR)
                  </h3>
                  <div className="text-xs font-mono font-bold text-black">
                    EAR = (1 + r/n)^n - 1
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-[10px] font-black bg-amber-100 text-black">
                  True Cost of Borrowing
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-black font-bold block mb-1">Nominal Stated Rate (r)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={earNominal}
                    onChange={(e) => setEarNominal(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="text-black font-bold block mb-1">Compounding Periods (n)</label>
                  <input
                    type="number"
                    value={earN}
                    onChange={(e) => setEarN(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded border border-gray-300 bg-white font-mono text-xs text-black font-semibold"
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-amber-50 border border-amber-300">
                <div className="text-[10px] uppercase font-black text-black">
                  Effective Annualized Rate (EAR)
                </div>
                <div className="text-2xl font-black font-mono text-black">
                  {earResult.effectiveAnnualRatePercent}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: DYNAMIC FINANCIAL SHEETS (P&L, Balance Sheet, BoQ)            */}
      {/* ==================================================================== */}
      {activeTab === 'excel-sheets' && (
        <div className="space-y-6">
          {/* Sheet Selector Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-gray-300 rounded-xl shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: 'income_statement', label: '8. Income Statement (P&L)' },
                { key: 'balance_sheet', label: '10. Balance Sheet' },
                { key: 'cost_tcc_boq', label: 'COST - TCC Infrastructure BoQ' },
                { key: 'startup_funds', label: '1. Required Start-Up Funds' },
                { key: 'capex_opex_dancia', label: 'CAPEX & OPEX (2) - Dancia-4Tv Bo' }
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSelectedSheetKey(s.key as SheetKey)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    selectedSheetKey === s.key
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-gray-100 hover:bg-gray-200 text-black border border-gray-300'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetToBaseline}
                className="px-3 py-1.5 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-black text-xs font-bold flex items-center gap-1.5"
                title="Reset active sheet to default platform values"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Baseline</span>
              </button>
            </div>
          </div>

          {/* Ratification Status & Executive Approval Bar */}
          <div className="p-4 rounded-xl bg-white border border-gray-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {currentApproval.status === 'APPROVED_BY_SUPER_ADMIN' ? (
                <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-emerald-700" />
                </div>
              ) : currentApproval.status === 'PENDING_SUPER_ADMIN_APPROVAL' ? (
                <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center flex-shrink-0">
                  <Unlock className="w-5 h-5 text-blue-700" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'
                        ? 'bg-emerald-600 text-white'
                        : currentApproval.status === 'PENDING_SUPER_ADMIN_APPROVAL'
                        ? 'bg-amber-500 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    Status: {currentApproval.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs font-bold text-black">
                    Version: v{currentApproval.version || 1}.0
                  </span>
                </div>
                <div className="text-xs text-black font-semibold mt-1">
                  Last Edited By: <strong>{currentApproval.lastEditedBy}</strong> • {currentApproval.lastEditedAt || 'Live'}
                  {currentApproval.approvedBy && (
                    <span className="block text-emerald-900 font-bold mt-0.5">
                      Ratified By: {currentApproval.approvedBy} ({currentApproval.approvedAt})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Workflow Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* CFO Actions */}
              <button
                onClick={handleSaveWorkingDraft}
                className="px-3.5 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300 text-xs font-bold flex items-center gap-1.5"
                title="Save working draft to local sovereign storage"
              >
                <Save className="w-4 h-4 text-indigo-700" />
                <span>Save CFO Draft</span>
              </button>

              <button
                onClick={handleSubmitForApproval}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                title="Submit sheet to Super Admin for official sign-off"
              >
                <FileCheck className="w-4 h-4" />
                <span>Submit to Super Admin</span>
              </button>

              {/* SUPER ADMIN APPROVAL ONLY */}
              {governanceRole === 'SUPER_ADMIN' && (
                <>
                  {currentApproval.status !== 'APPROVED_BY_SUPER_ADMIN' ? (
                    <button
                      onClick={handleSuperAdminApprove}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 animate-pulse"
                      title="Ratify and lock financial sheet under Supreme Authority"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Ratify & Approve (Super Admin Only)</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSuperAdminUnlock}
                      className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5"
                      title="Unlock this sheet to allow CFO modifications"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Unlock for Revision</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ACTIVE SHEET 1: 8. Income Statement (P&L) */}
          {selectedSheetKey === 'income_statement' && (
            <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-300 gap-2">
                <div>
                  <h3 className="font-extrabold text-lg text-black">
                    {incomeStatement.title}
                  </h3>
                  <p className="text-xs text-black font-semibold">
                    Auto-populated from Platform Subscriptions, Storefront Gross Commissions, Canary Ads, and Dancia-4Tv Broadcasting. Fully editable by CFO.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-extrabold text-black block">Net Profit Margin</span>
                  <span className="text-xl font-mono font-black text-emerald-700">
                    {incomeMetrics.netProfitMarginPercent}%
                  </span>
                </div>
              </div>

              {/* 1. Revenues Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-black tracking-wider flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    A. Gross Operating Revenues (Inflow)
                  </h4>
                  <span className="text-xs font-mono font-black text-emerald-800">
                    Total: {formatNaira(incomeMetrics.totalRevenue)}
                  </span>
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-xs divide-y divide-gray-200">
                    <thead className="bg-gray-100 text-black font-extrabold">
                      <tr>
                        <th className="py-2.5 px-3 text-left">Revenue Stream</th>
                        <th className="py-2.5 px-3 text-left">Category</th>
                        <th className="py-2.5 px-3 text-left">Operational Notes</th>
                        <th className="py-2.5 px-3 text-right">Annual Gross (₦)</th>
                        <th className="py-2.5 px-2 text-center w-16">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {incomeStatement.revenues.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="py-2 px-3 font-bold text-black">{item.name}</td>
                          <td className="py-2 px-3 text-black font-semibold">{item.category}</td>
                          <td className="py-2 px-3 text-black font-medium">{item.notes}</td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                              value={item.amountNgn}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setIncomeStatement((prev) => ({
                                  ...prev,
                                  revenues: prev.revenues.map((r, i) => (i === idx ? { ...r, amountNgn: val } : r))
                                }));
                              }}
                              className="w-36 px-2 py-1 text-right font-mono font-bold text-black border border-gray-300 rounded bg-white"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                              onClick={() => {
                                setIncomeStatement((prev) => ({
                                  ...prev,
                                  revenues: prev.revenues.filter((_, i) => i !== idx)
                                }));
                              }}
                              className="text-rose-600 hover:text-rose-800 p-1"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                  onClick={() => {
                    const newItem: FinancialLineItem = {
                      id: `rev_custom_${Date.now()}`,
                      name: 'New Platform Revenue Source',
                      category: 'Custom Product',
                      amountNgn: 10000000.00,
                      notes: 'Custom revenue line item',
                      isCustom: true
                    };
                    setIncomeStatement((prev) => ({ ...prev, revenues: [...prev.revenues, newItem] }));
                  }}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Revenue Stream</span>
                </button>
              </div>

              {/* 2. Cost of Goods Sold (COGS) */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-black tracking-wider flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-600" />
                    B. Cost of Goods Sold (COGS & Direct Operational Costs)
                  </h4>
                  <span className="text-xs font-mono font-black text-rose-700">
                    Total: ({formatNaira(incomeMetrics.totalCogs)})
                  </span>
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-xs divide-y divide-gray-200">
                    <thead className="bg-gray-100 text-black font-extrabold">
                      <tr>
                        <th className="py-2.5 px-3 text-left">Cost Component</th>
                        <th className="py-2.5 px-3 text-left">Category</th>
                        <th className="py-2.5 px-3 text-left">Description</th>
                        <th className="py-2.5 px-3 text-right">Annual Cost (₦)</th>
                        <th className="py-2.5 px-2 text-center w-16">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {incomeStatement.cogs.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="py-2 px-3 font-bold text-black">{item.name}</td>
                          <td className="py-2 px-3 text-black font-semibold">{item.category}</td>
                          <td className="py-2 px-3 text-black font-medium">{item.notes}</td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                              value={item.amountNgn}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setIncomeStatement((prev) => ({
                                  ...prev,
                                  cogs: prev.cogs.map((c, i) => (i === idx ? { ...c, amountNgn: val } : c))
                                }));
                              }}
                              className="w-36 px-2 py-1 text-right font-mono font-bold text-black border border-gray-300 rounded bg-white"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                              onClick={() => {
                                setIncomeStatement((prev) => ({
                                  ...prev,
                                  cogs: prev.cogs.filter((_, i) => i !== idx)
                                }));
                              }}
                              className="text-rose-600 hover:text-rose-800 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center text-xs">
                  <span className="font-extrabold text-black">Auto-Calculated Gross Profit (Sales - COGS):</span>
                  <span className="font-mono font-black text-black text-sm">
                    {formatNaira(incomeMetrics.grossProfit)} ({incomeMetrics.grossMarginPercent}% Margin)
                  </span>
                </div>
              </div>

              {/* 3. Operating Expenses (OPEX) */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-black tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    C. Operating Expenses (OPEX & Overheads)
                  </h4>
                  <span className="text-xs font-mono font-black text-rose-700">
                    Total: ({formatNaira(incomeMetrics.totalOpex)})
                  </span>
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-xs divide-y divide-gray-200">
                    <thead className="bg-gray-100 text-black font-extrabold">
                      <tr>
                        <th className="py-2.5 px-3 text-left">Expense Item</th>
                        <th className="py-2.5 px-3 text-left">Category</th>
                        <th className="py-2.5 px-3 text-left">Notes</th>
                        <th className="py-2.5 px-3 text-right">Annual Budget (₦)</th>
                        <th className="py-2.5 px-2 text-center w-16">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {incomeStatement.opex.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="py-2 px-3 font-bold text-black">{item.name}</td>
                          <td className="py-2 px-3 text-black font-semibold">{item.category}</td>
                          <td className="py-2 px-3 text-black font-medium">{item.notes}</td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                              value={item.amountNgn}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setIncomeStatement((prev) => ({
                                  ...prev,
                                  opex: prev.opex.map((o, i) => (i === idx ? { ...o, amountNgn: val } : o))
                                }));
                              }}
                              className="w-36 px-2 py-1 text-right font-mono font-bold text-black border border-gray-300 rounded bg-white"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                              onClick={() => {
                                setIncomeStatement((prev) => ({
                                  ...prev,
                                  opex: prev.opex.filter((_, i) => i !== idx)
                                }));
                              }}
                              className="text-rose-600 hover:text-rose-800 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Final Net Income Summary Block */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-300 space-y-2 text-xs">
                  <div className="flex justify-between py-1">
                    <span className="font-bold text-black">Operating Profit (EBITDA):</span>
                    <strong className="font-mono text-black font-extrabold">{formatNaira(incomeMetrics.ebitda)}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-bold text-black">Annual 33% Commercial Loan Debt Service:</span>
                    <strong className="font-mono text-amber-700 font-extrabold">({formatNaira(incomeMetrics.debtService)})</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-bold text-black">Tax Reserve ({incomeStatement.taxRatePercent}%):</span>
                    <strong className="font-mono text-black font-bold">({formatNaira(incomeMetrics.tax)})</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300 text-sm font-black bg-emerald-100 p-2 rounded-lg">
                    <span className="text-emerald-950 font-black">Net Platform Income (Bottom Line Profit):</span>
                    <span className="font-mono text-emerald-950 font-black">{formatNaira(incomeMetrics.netIncome)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE SHEET 2: 10. Balance Sheet */}
          {selectedSheetKey === 'balance_sheet' && (
            <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-300 gap-2">
                <div>
                  <h3 className="font-extrabold text-lg text-black">
                    {balanceSheet.title}
                  </h3>
                  <p className="text-xs text-black font-semibold">
                    Balance Sheet Equation: Assets = Liabilities + Shareholder Equity. Dynamic real-time auditor.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-extrabold text-black block">Balance Equation</span>
                  <span className={`text-base font-black flex items-center gap-1 ${balanceMetrics.isBalanced ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {balanceMetrics.isBalanced ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> BALANCED (100%)
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4" /> Variance: {formatNaira(balanceMetrics.varianceDelta)}
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                {/* Left: Assets Side */}
                <div className="space-y-4 p-4 rounded-xl border border-emerald-300 bg-emerald-50/20">
                  <div className="flex justify-between items-center border-b border-emerald-300 pb-2">
                    <h4 className="font-black text-sm uppercase text-black">1. Total Assets</h4>
                    <span className="font-mono font-black text-black text-sm">
                      {formatNaira(balanceMetrics.totalAssets)}
                    </span>
                  </div>

                  {/* Current Assets */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-black uppercase text-black block">A. Current Assets</span>
                    {balanceSheet.currentAssets.map((ca, idx) => (
                      <div key={ca.id} className="flex justify-between items-center py-1.5 border-b border-gray-200">
                        <span className="text-black font-semibold">{ca.name}</span>
                        <input
                          type="number"
                          disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                          value={ca.amountNgn}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setBalanceSheet((prev) => ({
                              ...prev,
                              currentAssets: prev.currentAssets.map((item, i) => (i === idx ? { ...item, amountNgn: val } : item))
                            }));
                          }}
                          className="w-32 px-2 py-1 text-right font-mono font-bold text-black border border-gray-300 rounded bg-white"
                        />
                      </div>
                    ))}
                    <div className="flex justify-between font-black text-black pt-1">
                      <span>Total Current Assets:</span>
                      <span className="font-mono">{formatNaira(balanceMetrics.currentAssetsTotal)}</span>
                    </div>
                  </div>

                  {/* Fixed Assets */}
                  <div className="space-y-2 pt-2 border-t border-gray-300">
                    <span className="text-[11px] font-black uppercase text-black block">B. Fixed Enterprise Assets</span>
                    {balanceSheet.fixedAssets.map((fa, idx) => (
                      <div key={fa.id} className="flex justify-between items-center py-1.5 border-b border-gray-200">
                        <span className="text-black font-semibold">{fa.name}</span>
                        <input
                          type="number"
                          disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                          value={fa.amountNgn}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setBalanceSheet((prev) => ({
                              ...prev,
                              fixedAssets: prev.fixedAssets.map((item, i) => (i === idx ? { ...item, amountNgn: val } : item))
                            }));
                          }}
                          className="w-32 px-2 py-1 text-right font-mono font-bold text-black border border-gray-300 rounded bg-white"
                        />
                      </div>
                    ))}
                    <div className="flex justify-between py-1 text-black font-bold">
                      <span>Gross Fixed Assets:</span>
                      <span className="font-mono">{formatNaira(balanceMetrics.grossFixedAssets)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-black font-bold">
                      <span>Less: Accumulated Depreciation:</span>
                      <input
                        type="number"
                        disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                        value={balanceSheet.accumulatedDepreciationNgn}
                        onChange={(e) => setBalanceSheet((prev) => ({ ...prev, accumulatedDepreciationNgn: Number(e.target.value) }))}
                        className="w-32 px-2 py-1 text-right font-mono font-bold text-black border border-gray-300 rounded bg-white"
                      />
                    </div>
                    <div className="flex justify-between font-black text-black pt-1 border-t border-gray-300">
                      <span>Net Fixed Assets:</span>
                      <span className="font-mono">{formatNaira(balanceMetrics.netFixedAssets)}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Liabilities & Equity Side */}
                <div className="space-y-4 p-4 rounded-xl border border-indigo-300 bg-indigo-50/20">
                  <div className="flex justify-between items-center border-b border-indigo-300 pb-2">
                    <h4 className="font-black text-sm uppercase text-black">2. Liabilities & Equity</h4>
                    <span className="font-mono font-black text-black text-sm">
                      {formatNaira(balanceMetrics.totalLiabAndEquity)}
                    </span>
                  </div>

                  {/* Liabilities */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-black uppercase text-black block">A. Current & Long-Term Liabilities</span>
                    {balanceSheet.currentLiabilities.map((cl, idx) => (
                      <div key={cl.id} className="flex justify-between items-center py-1.5 border-b border-gray-200">
                        <span className="text-black font-semibold">{cl.name}</span>
                        <input
                          type="number"
                          disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                          value={cl.amountNgn}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setBalanceSheet((prev) => ({
                              ...prev,
                              currentLiabilities: prev.currentLiabilities.map((item, i) => (i === idx ? { ...item, amountNgn: val } : item))
                            }));
                          }}
                          className="w-32 px-2 py-1 text-right font-mono font-bold text-black border border-gray-300 rounded bg-white"
                        />
                      </div>
                    ))}
                    {balanceSheet.longTermLiabilities.map((lt, idx) => (
                      <div key={lt.id} className="flex justify-between items-center py-1.5 border-b border-gray-200">
                        <span className="text-black font-semibold">{lt.name}</span>
                        <input
                          type="number"
                          disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                          value={lt.amountNgn}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setBalanceSheet((prev) => ({
                              ...prev,
                              longTermLiabilities: prev.longTermLiabilities.map((item, i) => (i === idx ? { ...item, amountNgn: val } : item))
                            }));
                          }}
                          className="w-32 px-2 py-1 text-right font-mono font-bold text-black border border-gray-300 rounded bg-white"
                        />
                      </div>
                    ))}
                    <div className="flex justify-between font-black text-black pt-1">
                      <span>Total Liabilities:</span>
                      <span className="font-mono">{formatNaira(balanceMetrics.totalLiabilities)}</span>
                    </div>
                  </div>

                  {/* Equity */}
                  <div className="space-y-2 pt-2 border-t border-gray-300">
                    <span className="text-[11px] font-black uppercase text-black block">B. Shareholder & Platform Equity</span>
                    {balanceSheet.equityItems.map((eq, idx) => (
                      <div key={eq.id} className="flex justify-between items-center py-1.5 border-b border-gray-200">
                        <span className="text-black font-semibold">{eq.name}</span>
                        <input
                          type="number"
                          disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                          value={eq.amountNgn}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setBalanceSheet((prev) => ({
                              ...prev,
                              equityItems: prev.equityItems.map((item, i) => (i === idx ? { ...item, amountNgn: val } : item))
                            }));
                          }}
                          className="w-32 px-2 py-1 text-right font-mono font-bold text-black border border-gray-300 rounded bg-white"
                        />
                      </div>
                    ))}
                    <div className="flex justify-between py-1 text-black font-bold">
                      <span>Retained Net Profit Surplus (from P&L):</span>
                      <span className="font-mono font-black text-black">{formatNaira(incomeMetrics.netIncome)}</span>
                    </div>
                    <div className="flex justify-between font-black text-black pt-1 border-t border-gray-300">
                      <span>Total Shareholder Equity:</span>
                      <span className="font-mono">{formatNaira(balanceMetrics.equityTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE SHEET 3: COST - TCC Infrastructure BoQ */}
          {selectedSheetKey === 'cost_tcc_boq' && (
            <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-300 gap-2">
                <div>
                  <h3 className="font-extrabold text-lg text-black">
                    {costTccBoq.title}
                  </h3>
                  <p className="text-xs text-black font-semibold">
                    Technical Computing Center (TCC) Hardware & Broadcast Bill of Quantities. Editable quantities and rates.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-extrabold text-black block">BoQ Total (₦)</span>
                  <span className="text-xl font-mono font-black text-black">
                    {formatNaira(costTccMetrics.totalNgn)}
                  </span>
                  <span className="text-xs font-mono font-bold text-black block">
                    ({formatUSD(costTccMetrics.totalUsd)} @ ₦{costTccMetrics.rate}/$)
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-xs divide-y divide-gray-200">
                  <thead className="bg-gray-100 text-black font-extrabold">
                    <tr>
                      <th className="py-2.5 px-3 text-left">Equipment / Item</th>
                      <th className="py-2.5 px-3 text-left">Category</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Rate (₦)</th>
                      <th className="py-2.5 px-3 text-right">Total Amount (₦)</th>
                      <th className="py-2.5 px-3 text-right">Total ($)</th>
                      <th className="py-2.5 px-2 text-center w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {costTccBoq.items.map((it, idx) => {
                      const lineNgn = (it.quantity || 1) * (it.unitPriceNgn || 0);
                      const lineUsd = lineNgn / costTccMetrics.rate;
                      return (
                        <tr key={it.id} className="hover:bg-gray-50">
                          <td className="py-2 px-3 font-bold text-black">{it.name}</td>
                          <td className="py-2 px-3 text-black font-semibold">{it.category}</td>
                          <td className="py-2 px-3 text-center">
                            <input
                              type="number"
                              disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                              value={it.quantity}
                              onChange={(e) => {
                                const q = Number(e.target.value);
                                setCostTccBoq((prev) => ({
                                  ...prev,
                                  items: prev.items.map((item, i) => (i === idx ? { ...item, quantity: q } : item))
                                }));
                              }}
                              className="w-14 px-1.5 py-1 text-center font-mono font-bold text-black border border-gray-300 rounded bg-white"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                              value={it.unitPriceNgn}
                              onChange={(e) => {
                                const r = Number(e.target.value);
                                setCostTccBoq((prev) => ({
                                  ...prev,
                                  items: prev.items.map((item, i) => (i === idx ? { ...item, unitPriceNgn: r } : item))
                                }));
                              }}
                              className="w-28 px-2 py-1 text-right font-mono font-bold text-black border border-gray-300 rounded bg-white"
                            />
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-black text-black">
                            {formatNaira(lineNgn)}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-black">
                            {formatUSD(lineUsd)}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                              onClick={() => {
                                setCostTccBoq((prev) => ({
                                  ...prev,
                                  items: prev.items.filter((_, i) => i !== idx)
                                }));
                              }}
                              className="text-rose-600 hover:text-rose-800 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <button
                disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                onClick={() => {
                  const newItem: FinancialLineItem = {
                    id: `tcc_custom_${Date.now()}`,
                    name: 'New Server / Network Hardware',
                    category: 'Hardware Infrastructure',
                    quantity: 1,
                    unitPriceNgn: 5000000,
                    amountNgn: 5000000,
                    depreciationYears: 5
                  };
                  setCostTccBoq((prev) => ({ ...prev, items: [...prev.items, newItem] }));
                }}
                className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Equipment Line Item</span>
              </button>
            </div>
          )}

          {/* ACTIVE SHEET 4: 1. Required Start-Up Funds */}
          {selectedSheetKey === 'startup_funds' && (
            <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-300 gap-2">
                <div>
                  <h3 className="font-extrabold text-lg text-black">
                    {startupFunds.title}
                  </h3>
                  <p className="text-xs text-black font-semibold">
                    Comprehensive capital requirement: Fixed Assets + Pre-Opening Operating Capital.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-extrabold text-black block">Grand Total Required</span>
                  <span className="text-xl font-mono font-black text-black">
                    {formatNaira(startupFundsMetrics.grandTotalNgn)}
                  </span>
                  <span className="text-xs font-mono font-bold text-black block">
                    ({formatUSD(startupFundsMetrics.grandTotalUsd)})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Fixed Assets */}
                <div className="space-y-3 p-4 border border-gray-300 rounded-xl bg-gray-50/50">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <h4 className="font-black text-sm uppercase text-black">A. Fixed Assets</h4>
                    <span className="font-mono font-black text-black">
                      {formatNaira(startupFundsMetrics.totalFixedNgn)} ({formatUSD(startupFundsMetrics.totalFixedUsd)})
                    </span>
                  </div>

                  {startupFunds.fixedAssets.map((fa, idx) => (
                    <div key={fa.id} className="flex justify-between items-center py-1.5 border-b border-gray-200">
                      <span className="text-black font-semibold">{fa.name}</span>
                      <input
                        type="number"
                        disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                        value={fa.amountNgn}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setStartupFunds((prev) => ({
                            ...prev,
                            fixedAssets: prev.fixedAssets.map((item, i) => (i === idx ? { ...item, amountNgn: val } : item))
                          }));
                        }}
                        className="w-32 px-2 py-1 text-right font-mono font-bold text-black border border-gray-300 rounded bg-white"
                      />
                    </div>
                  ))}
                </div>

                {/* Operating Capital */}
                <div className="space-y-3 p-4 border border-gray-300 rounded-xl bg-gray-50/50">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <h4 className="font-black text-sm uppercase text-black">B. Operating Capital (Pre-Opening)</h4>
                    <span className="font-mono font-black text-black">
                      {formatNaira(startupFundsMetrics.totalOpNgn)} ({formatUSD(startupFundsMetrics.totalOpUsd)})
                    </span>
                  </div>

                  {startupFunds.operatingCapital.map((op, idx) => (
                    <div key={op.id} className="flex justify-between items-center py-1.5 border-b border-gray-200">
                      <span className="text-black font-semibold">{op.name}</span>
                      <input
                        type="number"
                        disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                        value={op.amountNgn}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setStartupFunds((prev) => ({
                            ...prev,
                            operatingCapital: prev.operatingCapital.map((item, i) => (i === idx ? { ...item, amountNgn: val } : item))
                          }));
                        }}
                        className="w-32 px-2 py-1 text-right font-mono font-bold text-black border border-gray-300 rounded bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE SHEET 5: CAPEX & OPEX (2) - Dancia-4Tv Bo */}
          {selectedSheetKey === 'capex_opex_dancia' && (
            <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-300 gap-2">
                <div>
                  <h3 className="font-extrabold text-lg text-black">
                    {capexOpexDancia.title}
                  </h3>
                  <p className="text-xs text-black font-semibold">
                    17 Itemized Loan Allocation Lines from the Excel BoQ schedule.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-extrabold text-black block">Total Allocation</span>
                  <span className="text-xl font-mono font-black text-black">
                    {formatNaira(capexOpexDanciaMetrics.totalAllocatedNgn)}
                  </span>
                  <span className="text-xs font-mono font-bold text-black block">
                    Target: {formatNaira(capexOpexDanciaMetrics.loanTarget)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {capexOpexDancia.items.map((line, idx) => (
                  <div
                    key={line.id}
                    className="p-3 rounded-lg border border-gray-300 bg-white flex justify-between items-center shadow-xs"
                  >
                    <div className="pr-2">
                      <div className="font-bold text-black">{line.name}</div>
                      <div className="text-[11px] text-black font-medium">{line.notes}</div>
                    </div>
                    <input
                      type="number"
                      disabled={currentApproval.status === 'APPROVED_BY_SUPER_ADMIN'}
                      value={line.amountNgn}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCapexOpexDancia((prev) => ({
                          ...prev,
                          items: prev.items.map((item, i) => (i === idx ? { ...item, amountNgn: val } : item))
                        }));
                      }}
                      className="w-32 px-2 py-1 text-right font-mono font-bold text-black border border-gray-300 rounded bg-white flex-shrink-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: PLATFORM SUBSCRIPTION MODELS & MONETIZATION FEEDER            */}
      {/* ==================================================================== */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-300 text-black text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700 flex-shrink-0" />
              <span>
                Select, Duplicate (single or multiple), Copy/Paste, Move, and Search subscription cards below.
                Click <strong>"Sync Subscriptions to Financial P&L"</strong> to feed current pricing and volume into Sheet 8 (Income Statement).
              </span>
            </div>
          </div>
          <SubscriptionModelsConsole sourceDashboard="MasterDashboard" />
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 6: DOUBLE-ENTRY P&L SWEEP & RECONCILIATION                      */}
      {/* ==================================================================== */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-300">
            <div>
              <h3 className="font-extrabold text-base text-black flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Live Revenue Inflow & Profit Sweep Ledger
              </h3>
              <p className="text-xs text-black font-medium">
                Audited real-time double-entry ledger routing revenue to Fidelity Bank Lagos and sweeping bottom-line profit to Fidelity Bank Area 8 Abuja.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-black border border-emerald-300">
              Double-Entry Reconciled (100%)
            </span>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-xs divide-y divide-gray-200">
              <thead className="bg-gray-100 text-black font-extrabold">
                <tr>
                  <th className="py-2.5 px-3 text-left">Ref</th>
                  <th className="py-2.5 px-3 text-left">Type</th>
                  <th className="py-2.5 px-3 text-left">Transaction Description</th>
                  <th className="py-2.5 px-3 text-left">Source Service</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-left">Destination Rail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-mono text-black font-bold">FMP-REV-2026-901</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-black">REVENUE</span></td>
                  <td className="py-2.5 px-3 font-bold text-black">Multi-Vendor Marketplace Gross Commissions</td>
                  <td className="py-2.5 px-3 text-black font-semibold">Storefronts</td>
                  <td className="py-2.5 px-3 text-right font-mono font-black text-black">₦8,450,000.00</td>
                  <td className="py-2.5 px-3 font-mono text-black font-semibold">REV-NGN (Fidelity Bank: 5600792703)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-mono text-black font-bold">FMP-REV-2026-902</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-black">REVENUE</span></td>
                  <td className="py-2.5 px-3 font-bold text-black">VIP Flamingo & Creator Tier Subscriptions</td>
                  <td className="py-2.5 px-3 text-black font-semibold">Subscriptions</td>
                  <td className="py-2.5 px-3 text-right font-mono font-black text-black">₦14,200,000.00</td>
                  <td className="py-2.5 px-3 font-mono text-black font-semibold">REV-NGN (Fidelity Bank: 5600792703)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-mono text-black font-bold">FMP-REV-2026-903</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-black">REVENUE (GBP)</span></td>
                  <td className="py-2.5 px-3 font-bold text-black">UK Corporate Enterprise PayLink Settlement</td>
                  <td className="py-2.5 px-3 text-black font-semibold">International PayLinks</td>
                  <td className="py-2.5 px-3 text-right font-mono font-black text-black">£18,500.00</td>
                  <td className="py-2.5 px-3 font-mono text-black font-semibold">REV-GBP (Fidelity Bank: 5250325201)</td>
                </tr>
                <tr className="hover:bg-purple-50 bg-purple-50/50">
                  <td className="py-2.5 px-3 font-mono text-black font-bold">FMP-PRF-2026-101</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-600 text-white">PROFIT SWEEP</span></td>
                  <td className="py-2.5 px-3 font-extrabold text-black">Automated Q3 Net Surplus Sweep to Enterprise Reserve</td>
                  <td className="py-2.5 px-3 text-black font-semibold">P&L Auto-Reconciliation</td>
                  <td className="py-2.5 px-3 text-right font-mono font-black text-purple-900">₦25,000,000.00</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-black">PROFIT-ABUJA (Fidelity Bank Area 8: 5601279229)</td>
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
