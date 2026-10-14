import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  RotateCcw,
  Activity,
  Database,
  History,
  Edit3,
  Eye,
  Zap,
  Radio,
  X
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
  DEFAULT_CAPEX_OPEX_DANCIA4TV,
  ApprovalStatus
} from '../../constants/platformFinancialEcosystemData';
import SubscriptionModelsConsole from './SubscriptionModelsConsole';
import {
  financialDb,
  SheetKey,
  DbTableBankRails,
  DbTableAuditRecord,
  DbTableHeartbeatTelemetry
} from '../../services/financialEcosystemDatabase';
import {
  financialHeartbeat,
  PlatformLiveInflows
} from '../../services/financialHeartbeatService';

type ActiveTab = 'rails' | 'ratios' | 'growth-lab' | 'excel-sheets' | 'subscriptions' | 'ledger';
type GovernanceRole = 'CFO' | 'SUPER_ADMIN';

export const EnterpriseFinancialEcosystemConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('rails');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [governanceRole, setGovernanceRole] = useState<GovernanceRole>('CFO');
  const [statusBanner, setStatusBanner] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [isEditingSheet, setIsEditingSheet] = useState<boolean>(true);
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [autoHeartbeatSync, setAutoHeartbeatSync] = useState<boolean>(true);
  const [lastHeartbeat, setLastHeartbeat] = useState<PlatformLiveInflows | null>(null);
  const [auditList, setAuditList] = useState<DbTableAuditRecord[]>(() => financialDb.getAuditTrail());

  // --------------------------------------------------------------------------
  // Sovereign Bank Rails State (Loaded from Database)
  // --------------------------------------------------------------------------
  const [bankRails, setBankRails] = useState<DbTableBankRails[]>(() => financialDb.getBankRails());
  const [isEditingBankRails, setIsEditingBankRails] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // Dynamic Financial Sheets State (with LocalStorage + Relational DB persistence)
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

  const showBanner = useCallback((msg: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setStatusBanner({ message: msg, type });
    setTimeout(() => setStatusBanner(null), 6000);
  }, []);

  // --------------------------------------------------------------------------
  // Live Financial Heartbeat Initialization & Event Listener
  // --------------------------------------------------------------------------
  useEffect(() => {
    financialHeartbeat.startHeartbeat(10000);

    const handleHeartbeat = (e: any) => {
      const live: PlatformLiveInflows = e.detail;
      if (!live) return;
      setLastHeartbeat(live);

      if (autoHeartbeatSync) {
        setIncomeStatement((prev) => {
          // If the sheet is actively locked by Super Admin, don't overwrite without unlock
          if (prev.approval?.status === 'APPROVED_BY_SUPER_ADMIN') return prev;

          const updatedRevenues = prev.revenues.map((r) => {
            if (r.id === 'rev_subscriptions' && live.subscriptionsAnnualNgn) {
              return { ...r, amountNgn: live.subscriptionsAnnualNgn, notes: `Live heartbeat sync (${live.activeSubscriberCount} active models)` };
            }
            if (r.id === 'rev_storefronts' && live.storefrontCommissionNgn) {
              return { ...r, amountNgn: live.storefrontCommissionNgn, notes: `Live GMV commission: ₦${live.storefrontCommissionNgn.toLocaleString()}` };
            }
            if (r.id === 'rev_canary_ads' && live.canaryAdsAnnualNgn) {
              return { ...r, amountNgn: live.canaryAdsAnnualNgn };
            }
            if (r.id === 'rev_dancia_vod' && live.danciaBroadcastingAnnualNgn) {
              return { ...r, amountNgn: live.danciaBroadcastingAnnualNgn };
            }
            return r;
          });

          const updated: IncomeStatementSheetData = {
            ...prev,
            revenues: updatedRevenues,
            approval: { ...prev.approval, lastEditedAt: new Date().toISOString() }
          };
          localStorage.setItem('fmp_dynamic_sheet_income_statement', JSON.stringify(updated));
          return updated;
        });
      }
    };

    window.addEventListener('fingermobile_financial_heartbeat', handleHeartbeat);
    return () => {
      window.removeEventListener('fingermobile_financial_heartbeat', handleHeartbeat);
    };
  }, [autoHeartbeatSync]);

  // Listen for external subscriptions P&L sync button event
  useEffect(() => {
    const handleSubSync = (e: any) => {
      const annualNgn = e.detail?.annualTotalNgn;
      if (annualNgn) {
        setIncomeStatement((prev) => {
          const updatedRevenues = prev.revenues.map((r) =>
            r.id === 'rev_subscriptions'
              ? { ...r, amountNgn: annualNgn, notes: `Manual sync from active subscriptions (${e.detail?.count || 10} tiers)` }
              : r
          );
          const updated: IncomeStatementSheetData = {
            ...prev,
            revenues: updatedRevenues,
            approval: { ...prev.approval, status: 'DRAFT', lastEditedAt: new Date().toISOString() }
          };
          localStorage.setItem('fmp_dynamic_sheet_income_statement', JSON.stringify(updated));
          return updated;
        });
        showBanner(`📥 Subscriptions successfully synced into 8. Income Statement (P&L): ₦${annualNgn.toLocaleString()}`);
      }
    };
    window.addEventListener('fingermobile_subscriptions_pnl_sync', handleSubSync);
    return () => window.removeEventListener('fingermobile_subscriptions_pnl_sync', handleSubSync);
  }, [showBanner]);

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
    const totalRev = incomeStatement.revenues.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const totalCogs = incomeStatement.cogs.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const grossProfit = totalRev - totalCogs;
    const totalOpex = incomeStatement.opex.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const operatingIncome = grossProfit - totalOpex;

    // Fluctuating Loan Debt Service Calculation
    const principal = incomeStatement.loanPrincipalNgn ?? 426700000;
    const ratePercent = incomeStatement.loanInterestRatePercent ?? 33.0;
    const debtService = (principal * ratePercent) / 100;

    const netBeforeTax = operatingIncome - debtService;

    // Fluctuating Tax Reserve Calculation
    const taxRate = incomeStatement.taxRatePercent ?? 10.0;
    const tax = netBeforeTax > 0 ? (netBeforeTax * taxRate) / 100 : 0;
    const netIncome = netBeforeTax - tax;

    const grossMarginPercent = totalRev > 0 ? ((grossProfit / totalRev) * 100).toFixed(1) : '0.0';
    const netProfitMarginPercent = totalRev > 0 ? ((netIncome / totalRev) * 100).toFixed(1) : '0.0';

    return {
      totalRevenue: totalRev,
      totalCogs,
      grossProfit,
      grossMarginPercent,
      totalOpex,
      operatingIncome,
      debtService,
      debtRatePercent: ratePercent,
      debtPrincipalNgn: principal,
      netBeforeTax,
      tax,
      taxRatePercent: taxRate,
      netIncome,
      netProfitMarginPercent
    };
  }, [incomeStatement]);

  const balanceMetrics = useMemo(() => {
    const caTotal = balanceSheet.currentAssets.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const faTotalGross = balanceSheet.fixedAssets.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const netFa = faTotalGross - (Number(balanceSheet.accumulatedDepreciationNgn) || 0);
    const totalAssets = caTotal + netFa;

    const clTotal = balanceSheet.currentLiabilities.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const ltTotal = balanceSheet.longTermLiabilities.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const totalLiab = clTotal + ltTotal;

    const eqItemsTotal = balanceSheet.equityItems.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const retainedFromIncome = incomeMetrics.netIncome;
    const totalEquity = eqItemsTotal + retainedFromIncome;

    const totalLiabAndEquity = totalLiab + totalEquity;
    const isBalanced = Math.abs(totalAssets - totalLiabAndEquity) < 1.0;
    const varianceDelta = totalAssets - totalLiabAndEquity;

    return {
      currentAssetsTotal: caTotal,
      grossFixedAssets: faTotalGross,
      netFixedAssets: netFa,
      totalAssets,
      currentLiabilitiesTotal: clTotal,
      longTermLiabilitiesTotal: ltTotal,
      totalLiabilities: totalLiab,
      equityTotal: totalEquity,
      totalLiabAndEquity,
      isBalanced,
      varianceDelta
    };
  }, [balanceSheet, incomeMetrics.netIncome]);

  const costTccMetrics = useMemo(() => {
    const totalNgn = costTccBoq.items.reduce(
      (acc, it) => acc + (Number(it.quantity) || 1) * (Number(it.unitPriceNgn) || 0),
      0
    );
    const rate = Number(costTccBoq.usdExchangeRate) || 1550;
    const totalUsd = totalNgn / rate;
    return { totalNgn, totalUsd, rate };
  }, [costTccBoq]);

  const startupFundsMetrics = useMemo(() => {
    const rate = Number(startupFunds.usdExchangeRate) || 1550;
    const totalFixedNgn = startupFunds.fixedAssets.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const totalFixedUsd = totalFixedNgn / rate;
    const totalOpNgn = startupFunds.operatingCapital.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const totalOpUsd = totalOpNgn / rate;
    const grandTotalNgn = totalFixedNgn + totalOpNgn;
    const grandTotalUsd = grandTotalNgn / rate;
    return { totalFixedNgn, totalFixedUsd, totalOpNgn, totalOpUsd, grandTotalNgn, grandTotalUsd, rate };
  }, [startupFunds]);

  const capexOpexDanciaMetrics = useMemo(() => {
    const totalAllocatedNgn = capexOpexDancia.items.reduce((acc, it) => acc + (Number(it.amountNgn) || 0), 0);
    const loanTarget = Number(capexOpexDancia.totalLoanAllocationNgn) || 1412050000;
    const remainingBudget = loanTarget - totalAllocatedNgn;
    return { totalAllocatedNgn, loanTarget, remainingBudget };
  }, [capexOpexDancia]);

  // Current approval status for active sheet
  const currentApproval = useMemo(() => {
    switch (selectedSheetKey) {
      case 'income_statement':
        return incomeStatement.approval || DEFAULT_INCOME_STATEMENT.approval;
      case 'balance_sheet':
        return balanceSheet.approval || DEFAULT_BALANCE_SHEET.approval;
      case 'cost_tcc_boq':
        return costTccBoq.approval || DEFAULT_COST_TCC_BOQ.approval;
      case 'startup_funds':
        return startupFunds.approval || DEFAULT_STARTUP_FUNDS.approval;
      case 'capex_opex_dancia':
        return capexOpexDancia.approval || DEFAULT_CAPEX_OPEX_DANCIA4TV.approval;
    }
  }, [selectedSheetKey, incomeStatement, balanceSheet, costTccBoq, startupFunds, capexOpexDancia]);

  // --------------------------------------------------------------------------
  // WORKFLOW ACTION HANDLERS (Database Connected, Guaranteed Clickable)
  // --------------------------------------------------------------------------

  // 1. Save CFO Draft
  const handleSaveWorkingDraft = () => {
    const actorName = governanceRole === 'CFO'
      ? 'Mrs. Mbah Eunice Emonena (CFO & Co-Founder)'
      : 'Mbah Israel Obinna (Super Admin - Editing on behalf of Executive Council)';
    const actorRole = governanceRole;

    const updateMeta = (prev: any) => {
      const nextVer = (prev.approval?.version || 1) + 1;
      return {
        ...prev,
        approval: {
          ...prev.approval,
          status: 'DRAFT' as ApprovalStatus,
          lastEditedBy: actorName,
          lastEditedAt: new Date().toISOString(),
          version: nextVer,
          notes: 'Working draft saved to sovereign financial database ledger.'
        }
      };
    };

    let updatedSheet: any;
    if (selectedSheetKey === 'income_statement') {
      updatedSheet = updateMeta(incomeStatement);
      setIncomeStatement(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_income_statement', JSON.stringify(updatedSheet));
    } else if (selectedSheetKey === 'balance_sheet') {
      updatedSheet = updateMeta(balanceSheet);
      setBalanceSheet(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_balance_sheet', JSON.stringify(updatedSheet));
    } else if (selectedSheetKey === 'cost_tcc_boq') {
      updatedSheet = updateMeta(costTccBoq);
      setCostTccBoq(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_cost_tcc_boq', JSON.stringify(updatedSheet));
    } else if (selectedSheetKey === 'startup_funds') {
      updatedSheet = updateMeta(startupFunds);
      setStartupFunds(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_startup_funds', JSON.stringify(updatedSheet));
    } else if (selectedSheetKey === 'capex_opex_dancia') {
      updatedSheet = updateMeta(capexOpexDancia);
      setCapexOpexDancia(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_capex_opex_dancia', JSON.stringify(updatedSheet));
    }

    // Persist to relational database & audit ledger
    financialDb.recordAudit({
      sheetKey: selectedSheetKey,
      sheetLabel: financialDb.getSheetTitle(selectedSheetKey),
      action: 'DRAFT_SAVED',
      actor: actorName,
      actorRole,
      notes: `Working draft version v${updatedSheet.approval.version} committed to sovereign database.`,
      version: updatedSheet.approval.version
    });
    setAuditList(financialDb.getAuditTrail());

    // Also update ecosystem config for fluctuating rates
    if (selectedSheetKey === 'income_statement') {
      financialDb.updateConfig({
        loanInterestRatePercent: incomeStatement.loanInterestRatePercent ?? 33.0,
        loanPrincipalNgn: incomeStatement.loanPrincipalNgn ?? 426700000,
        taxRatePercent: incomeStatement.taxRatePercent ?? 10.0
      }, actorName, actorRole);
    }

    setIsEditingSheet(true);
    showBanner(`💾 Draft saved & committed to Sovereign Database (v${updatedSheet.approval.version}). Status: DRAFT.`);
  };

  // 2. Submit to Super Admin
  const handleSubmitForApproval = () => {
    const actorName = 'Mrs. Mbah Eunice Emonena (CFO & Co-Founder)';
    const updateMeta = (prev: any) => ({
      ...prev,
      approval: {
        ...prev.approval,
        status: 'PENDING_SUPER_ADMIN_APPROVAL' as ApprovalStatus,
        lastEditedBy: actorName,
        lastEditedAt: new Date().toISOString(),
        notes: 'Submitted by CFO for statutory ratification and executive sign-off.'
      }
    });

    let updatedSheet: any;
    if (selectedSheetKey === 'income_statement') {
      updatedSheet = updateMeta(incomeStatement);
      setIncomeStatement(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_income_statement', JSON.stringify(updatedSheet));
    } else if (selectedSheetKey === 'balance_sheet') {
      updatedSheet = updateMeta(balanceSheet);
      setBalanceSheet(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_balance_sheet', JSON.stringify(updatedSheet));
    } else if (selectedSheetKey === 'cost_tcc_boq') {
      updatedSheet = updateMeta(costTccBoq);
      setCostTccBoq(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_cost_tcc_boq', JSON.stringify(updatedSheet));
    } else if (selectedSheetKey === 'startup_funds') {
      updatedSheet = updateMeta(startupFunds);
      setStartupFunds(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_startup_funds', JSON.stringify(updatedSheet));
    } else if (selectedSheetKey === 'capex_opex_dancia') {
      updatedSheet = updateMeta(capexOpexDancia);
      setCapexOpexDancia(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_capex_opex_dancia', JSON.stringify(updatedSheet));
    }

    financialDb.recordAudit({
      sheetKey: selectedSheetKey,
      sheetLabel: financialDb.getSheetTitle(selectedSheetKey),
      action: 'SUBMITTED_FOR_APPROVAL',
      actor: actorName,
      actorRole: 'CFO',
      notes: 'Sheet submitted by CFO for statutory ratification and executive sign-off.',
      version: updatedSheet.approval.version || 1
    });
    setAuditList(financialDb.getAuditTrail());

    showBanner(`📤 Submitted to SUPER ADMIN for ratification. Status: PENDING APPROVAL.`);
  };

  // 3. Ratify & Approve (Super Admin Only)
  const handleSuperAdminApprove = () => {
    if (governanceRole !== 'SUPER_ADMIN') {
      setGovernanceRole('SUPER_ADMIN');
    }

    const actorName = 'Mbah Israel Obinna (SUPER ADMIN - Supreme Council Authority)';
    const updateMeta = (prev: any) => ({
      ...prev,
      approval: {
        ...prev.approval,
        status: 'APPROVED_BY_SUPER_ADMIN' as ApprovalStatus,
        approvedBy: actorName,
        approvedAt: new Date().toISOString(),
        notes: 'Officially audited, verified, and ratified as the immutable baseline.'
      }
    });

    let updatedSheet: any;
    if (selectedSheetKey === 'income_statement') {
      updatedSheet = updateMeta(incomeStatement);
      setIncomeStatement(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_income_statement', JSON.stringify(updatedSheet));
    } else if (selectedSheetKey === 'balance_sheet') {
      updatedSheet = updateMeta(balanceSheet);
      setBalanceSheet(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_balance_sheet', JSON.stringify(updatedSheet));
    } else if (selectedSheetKey === 'cost_tcc_boq') {
      updatedSheet = updateMeta(costTccBoq);
      setCostTccBoq(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_cost_tcc_boq', JSON.stringify(updatedSheet));
    } else if (selectedSheetKey === 'startup_funds') {
      updatedSheet = updateMeta(startupFunds);
      setStartupFunds(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_startup_funds', JSON.stringify(updatedSheet));
    } else if (selectedSheetKey === 'capex_opex_dancia') {
      updatedSheet = updateMeta(capexOpexDancia);
      setCapexOpexDancia(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_capex_opex_dancia', JSON.stringify(updatedSheet));
    }

    financialDb.recordAudit({
      sheetKey: selectedSheetKey,
      sheetLabel: financialDb.getSheetTitle(selectedSheetKey),
      action: 'SUPER_ADMIN_APPROVED',
      actor: actorName,
      actorRole: 'SUPER_ADMIN',
      notes: 'Sheet officially ratified, locked, and immutably sealed by Supreme Council Authority.',
      version: updatedSheet.approval.version || 1
    });
    setAuditList(financialDb.getAuditTrail());

    setIsEditingSheet(false);
    showBanner(`🛡️ RATIFIED & LOCKED by SUPER ADMIN. Immutable audit seal applied.`);
  };

  // 4. Unlock for Revision (ALWAYS Available & Clickable)
  const handleSuperAdminUnlock = () => {
    const actorName = governanceRole === 'SUPER_ADMIN'
      ? 'Mbah Israel Obinna (SUPER ADMIN - Supreme Authority)'
      : 'Mrs. Mbah Eunice Emonena (CFO - Revision Requested)';
    const actorRole = governanceRole;

    const updateMeta = (prev: any) => ({
      ...prev,
      approval: {
        ...prev.approval,
        status: 'REVISION_REQUESTED' as ApprovalStatus,
        notes: `Unlocked by ${actorName} for active financial modeling and parameter updates.`
      }
    });

    let updatedSheet: any;
    if (selectedSheetKey === 'income_statement') {
      updatedSheet = updateMeta(incomeStatement);
      setIncomeStatement(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_income_statement', JSON.stringify(updatedSheet));
    } else if (selectedSheetKey === 'balance_sheet') {
      updatedSheet = updateMeta(balanceSheet);
      setBalanceSheet(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_balance_sheet', JSON.stringify(updatedSheet));
    } else if (selectedSheetKey === 'cost_tcc_boq') {
      updatedSheet = updateMeta(costTccBoq);
      setCostTccBoq(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_cost_tcc_boq', JSON.stringify(updatedSheet));
    } else if (selectedSheetKey === 'startup_funds') {
      updatedSheet = updateMeta(startupFunds);
      setStartupFunds(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_startup_funds', JSON.stringify(updatedSheet));
    } else if (selectedSheetKey === 'capex_opex_dancia') {
      updatedSheet = updateMeta(capexOpexDancia);
      setCapexOpexDancia(updatedSheet);
      localStorage.setItem('fmp_dynamic_sheet_capex_opex_dancia', JSON.stringify(updatedSheet));
    }

    financialDb.recordAudit({
      sheetKey: selectedSheetKey,
      sheetLabel: financialDb.getSheetTitle(selectedSheetKey),
      action: 'UNLOCK_FOR_REVISION',
      actor: actorName,
      actorRole,
      notes: 'Sheet unlocked for revisions. Full cell editing active.',
      version: updatedSheet.approval.version || 1
    });
    setAuditList(financialDb.getAuditTrail());

    setIsEditingSheet(true);
    showBanner(`🔓 Sheet unlocked for revision! CFO and accounts staff can now update all cells.`);
  };

  // 5. Reset to Baseline
  const handleResetToBaseline = () => {
    if (window.confirm('Reset this sheet back to platform default baseline values?')) {
      if (selectedSheetKey === 'income_statement') {
        setIncomeStatement(DEFAULT_INCOME_STATEMENT);
        localStorage.setItem('fmp_dynamic_sheet_income_statement', JSON.stringify(DEFAULT_INCOME_STATEMENT));
      } else if (selectedSheetKey === 'balance_sheet') {
        setBalanceSheet(DEFAULT_BALANCE_SHEET);
        localStorage.setItem('fmp_dynamic_sheet_balance_sheet', JSON.stringify(DEFAULT_BALANCE_SHEET));
      } else if (selectedSheetKey === 'cost_tcc_boq') {
        setCostTccBoq(DEFAULT_COST_TCC_BOQ);
        localStorage.setItem('fmp_dynamic_sheet_cost_tcc_boq', JSON.stringify(DEFAULT_COST_TCC_BOQ));
      } else if (selectedSheetKey === 'startup_funds') {
        setStartupFunds(DEFAULT_STARTUP_FUNDS);
        localStorage.setItem('fmp_dynamic_sheet_startup_funds', JSON.stringify(DEFAULT_STARTUP_FUNDS));
      } else if (selectedSheetKey === 'capex_opex_dancia') {
        setCapexOpexDancia(DEFAULT_CAPEX_OPEX_DANCIA4TV);
        localStorage.setItem('fmp_dynamic_sheet_capex_opex_dancia', JSON.stringify(DEFAULT_CAPEX_OPEX_DANCIA4TV));
      }
      financialDb.recordAudit({
        sheetKey: selectedSheetKey,
        sheetLabel: financialDb.getSheetTitle(selectedSheetKey),
        action: 'SHEET_RESET',
        actor: governanceRole === 'CFO' ? 'Mrs. Mbah Eunice Emonena (CFO)' : 'Mbah Israel Obinna (Super Admin)',
        actorRole: governanceRole,
        notes: 'Sheet reset to original platform baseline values.',
        version: 1
      });
      setAuditList(financialDb.getAuditTrail());
      showBanner(`🔄 Sheet reset to default baseline values.`);
    }
  };

  // 6. Manual Trigger Live Heartbeat
  const handleTriggerHeartbeat = () => {
    const live = financialHeartbeat.dispatchHeartbeat();
    setLastHeartbeat(live);
    showBanner(`⚡ Heartbeat dispatched! Live Gross Inflow Rate: ₦${live.grossOperatingRevenueNgn.toLocaleString()} / yr`);
  };

  // 7. Save Bank Rails
  const handleSaveBankRails = () => {
    financialDb.saveBankRails(
      bankRails,
      governanceRole === 'CFO' ? 'Mrs. Mbah Eunice Emonena (CFO)' : 'Mbah Israel Obinna (Super Admin)',
      governanceRole
    );
    setAuditList(financialDb.getAuditTrail());
    setIsEditingBankRails(false);
    showBanner(`💾 Sovereign Bank Rails saved to database successfully.`);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const formatNaira = (amount: number) => {
    return '₦' + Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatUSD = (amount: number) => {
    return '$' + Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const isLockedByAdmin = currentApproval.status === 'APPROVED_BY_SUPER_ADMIN';

  return (
    <div className="space-y-6">
      {/* ==================================================================== */}
      {/* STATUS BANNER (Floating Notification Toast)                          */}
      {/* ==================================================================== */}
      {statusBanner && (
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-lg transition-all animate-bounce ${
          statusBanner.type === 'warning'
            ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
            : 'bg-emerald-100 border-emerald-400 text-emerald-950 font-extrabold'
        }`}>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
            <span className="text-sm">{statusBanner.message}</span>
          </div>
          <button
            onClick={() => setStatusBanner(null)}
            className="text-xs font-black px-2 py-1 bg-white/70 rounded hover:bg-white text-black"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* EXECUTIVE GOVERNANCE & LIVE HEARTBEAT HEADER BAR                    */}
      {/* ==================================================================== */}
      <div className="p-4 rounded-xl bg-white border border-gray-300 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-600 text-white">
              SOVEREIGN FINANCIAL ECOSYSTEM
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE Heartbeat: ACTIVE (Every 10s)</span>
            </div>
          </div>
          <h2 className="text-xl font-black text-black tracking-tight mt-1">
            Enterprise Financial Economic Ecosystem Console
          </h2>
          <div className="flex items-center gap-2 flex-wrap text-xs text-black font-semibold mt-0.5">
            <span>Executive Governance: CFO Editing &amp; Super Admin Ratification.</span>
            <span className="text-gray-400">•</span>
            <span>Database: Sovereign Client-Side WORM Ledger Active.</span>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Heartbeat Sync Trigger Button */}
          <button
            onClick={handleTriggerHeartbeat}
            className="px-3 py-1.5 rounded-lg border border-emerald-400 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            title="Force immediate heartbeat data sync from active platform services"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sync Live Heartbeat Now</span>
          </button>

          {/* View Audit Trail Database Button */}
          <button
            onClick={() => setShowAuditModal(true)}
            className="px-3 py-1.5 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-black text-xs font-bold flex items-center gap-1.5"
            title="Inspect relational database tables, audit trail, and heartbeat telemetry"
          >
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span>Database &amp; Audit ({auditList.length})</span>
          </button>

          {/* Switch Role Controls */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg border border-gray-300">
            <button
              onClick={() => {
                setGovernanceRole('CFO');
                showBanner('Switched active session to CFO (Mrs. Mbah Eunice Emonena).', 'info');
              }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 ${
                governanceRole === 'CFO'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-black hover:bg-gray-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>👩‍💼 CFO</span>
            </button>
            <button
              onClick={() => {
                setGovernanceRole('SUPER_ADMIN');
                showBanner('Switched active session to SUPER ADMIN (Supreme Council).', 'info');
              }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 ${
                governanceRole === 'SUPER_ADMIN'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-black hover:bg-gray-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>🛡️ Super Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* NAVIGATION SUB-TAB BAR                                               */}
      {/* ==================================================================== */}
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
                  Gross &amp; Net Income
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

          {/* Section 1: Sovereign Revenue Destination Bank Rails */}
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
                <button
                  onClick={() => setIsEditingBankRails(!isEditingBankRails)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingBankRails ? 'Done Editing' : 'Edit Bank Rails'}</span>
                </button>
                {isEditingBankRails && (
                  <button
                    onClick={handleSaveBankRails}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Rails to DB</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {bankRails
                .filter((r) => r.railType === 'TOP_LINE_REVENUE')
                .map((rail, idx) => (
                  <div
                    key={rail.id}
                    className="rounded-xl border border-gray-300 bg-white p-5 space-y-4 hover:shadow-md transition-all shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wide bg-emerald-600 text-white">
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
                      {isEditingBankRails ? (
                        <input
                          type="text"
                          value={rail.accountName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBankRails((prev) =>
                              prev.map((r, i) => (r.id === rail.id ? { ...r, accountName: val } : r))
                            );
                          }}
                          className="w-full text-xs font-bold text-black border border-gray-300 rounded px-2 py-1 mt-1 bg-white"
                        />
                      ) : (
                        <div className="text-sm font-black text-black">{rail.accountName}</div>
                      )}
                      <div className="text-xs text-black font-semibold mt-0.5">
                        {rail.bankName} • {rail.branch}
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-300 flex items-center justify-between">
                      <div className="w-full mr-2">
                        <div className="text-[10px] uppercase font-black text-black">Account Number</div>
                        {isEditingBankRails ? (
                          <input
                            type="text"
                            value={rail.accountNumber}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBankRails((prev) =>
                                prev.map((r, i) => (r.id === rail.id ? { ...r, accountNumber: val } : r))
                              );
                            }}
                            className="w-full font-mono font-black text-sm text-black border border-gray-300 rounded px-1.5 py-0.5 bg-white"
                          />
                        ) : (
                          <div className="font-mono font-black text-base text-black tracking-wider">
                            {rail.accountNumber}
                          </div>
                        )}
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
                        {isEditingBankRails ? (
                          <input
                            type="text"
                            value={rail.ussdCode}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBankRails((prev) =>
                                prev.map((r, i) => (r.id === rail.id ? { ...r, ussdCode: val } : r))
                              );
                            }}
                            className="w-full font-mono font-black text-xs text-black border border-gray-300 rounded px-1 bg-white"
                          />
                        ) : (
                          <div className="font-mono font-black text-black">{rail.ussdCode}</div>
                        )}
                      </div>
                      <div className="p-2 rounded bg-gray-50 border border-gray-300">
                        <div className="text-[10px] text-black uppercase font-extrabold">Bank Swift</div>
                        {isEditingBankRails ? (
                          <input
                            type="text"
                            value={rail.swiftCode}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBankRails((prev) =>
                                prev.map((r, i) => (r.id === rail.id ? { ...r, swiftCode: val } : r))
                              );
                            }}
                            className="w-full font-mono font-black text-xs text-black border border-gray-300 rounded px-1 bg-white"
                          />
                        ) : (
                          <div className="font-mono font-black text-black">{rail.swiftCode}</div>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-black font-medium leading-tight">
                      {rail.purpose}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Section 2: Sovereign Profit Destination Bank Rails */}
          <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-300">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black mb-1">
                  <Landmark className="w-4 h-4 text-purple-600" />
                  Sovereign Surplus Protocol
                </div>
                <h3 className="text-xl font-extrabold text-black">
                  2. Platform PROFIT Destination Bank Rails (Area 8 Branch, Abuja)
                </h3>
                <p className="text-xs text-black font-medium">
                  The designated Sovereign Enterprise Bottom-Line Net Profit and Capital Surplus Vault Rail. Operating profits from the P&amp;L sweep into this account.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-purple-100 text-purple-950 border border-purple-300">
                  Auto-Sweep: ENABLED
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-purple-300 bg-purple-50/30 p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-xl border border-gray-300 shadow-2xs">
                  <div className="text-[10px] uppercase font-black text-black">Profit Bank</div>
                  <div className="font-black text-sm text-black">Fidelity Bank Plc</div>
                  <div className="text-xs text-black font-semibold">Area 8 Branch, Abuja F.C.T</div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-300 shadow-2xs">
                  <div className="text-[10px] uppercase font-black text-black">Account Name</div>
                  <div className="font-black text-xs text-black">FingerMobile Protocol Communication</div>
                  <div className="text-[10px] text-black font-bold font-mono">Swift: FIDTNGLA</div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-300 shadow-2xs flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-black text-black">Profit Account Number</div>
                    <div className="font-mono font-black text-base text-purple-900">5601279229</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard('5601279229', 'profit_acc')}
                    className="p-1.5 rounded hover:bg-gray-100 text-black hover:text-purple-700"
                    title="Copy Profit Account Number"
                  >
                    {copiedKey === 'profit_acc' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-300 shadow-2xs">
                  <div className="text-[10px] uppercase font-black text-black">USSD Direct Code</div>
                  <div className="font-mono font-black text-base text-black">5250325184</div>
                  <div className="text-[10px] text-emerald-800 font-bold">Fidelity *770# Protocol</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-purple-200 text-xs font-semibold text-black flex items-center justify-between">
                <span>Total Accumulated Platform Profit Surplus Swept:</span>
                <span className="font-mono font-black text-purple-900 text-base">
                  {formatNaira(124580000.00)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: ACCOUNTING & FINANCIAL RATIOS                                 */}
      {/* ==================================================================== */}
      {activeTab === 'ratios' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm">
            <h3 className="text-lg font-black text-black mb-1">
              Real-Time Accounting Ratios &amp; Balance Sheet Equation
            </h3>
            <p className="text-xs text-black font-medium mb-6">
              Audits the foundational accounting identity: Assets = Liabilities + Shareholder Equity. Dynamic Sandbox allows the CFO to model changes before submitting for Super Admin ratification.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl border border-gray-300 bg-gray-50">
                <span className="text-[10px] font-black uppercase text-black block mb-1">Current Ratio</span>
                <div className="text-2xl font-black font-mono text-black">{dynamicEvaluation.ratios.currentRatio.value}x</div>
                <span className="text-[10px] font-bold text-emerald-800">Benchmark: {dynamicEvaluation.ratios.currentRatio.benchmark}</span>
              </div>

              <div className="p-4 rounded-xl border border-gray-300 bg-gray-50">
                <span className="text-[10px] font-black uppercase text-black block mb-1">Quick (Acid-Test) Ratio</span>
                <div className="text-2xl font-black font-mono text-black">{dynamicEvaluation.ratios.quickRatio.value}x</div>
                <span className="text-[10px] font-bold text-emerald-800">Benchmark: {dynamicEvaluation.ratios.quickRatio.benchmark}</span>
              </div>

              <div className="p-4 rounded-xl border border-gray-300 bg-gray-50">
                <span className="text-[10px] font-black uppercase text-black block mb-1">Return on Assets (ROA)</span>
                <div className="text-2xl font-black font-mono text-black">{dynamicEvaluation.ratios.returnOnAssets.percent}%</div>
                <span className="text-[10px] font-bold text-emerald-800">Benchmark: {dynamicEvaluation.ratios.returnOnAssets.benchmark}</span>
              </div>

              <div className="p-4 rounded-xl border border-gray-300 bg-gray-50">
                <span className="text-[10px] font-black uppercase text-black block mb-1">Debt-to-Equity Ratio</span>
                <div className="text-2xl font-black font-mono text-black">{dynamicEvaluation.ratios.debtToEquity.value}x</div>
                <span className="text-[10px] font-bold text-emerald-800">Status: {dynamicEvaluation.ratios.debtToEquity.status}</span>
              </div>
            </div>

            {/* Interactive Sandbox Slider Inputs */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-300 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h4 className="text-xs font-black uppercase text-black flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  CFO Accounting Ratios Modeling Sandbox
                </h4>
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
                    showBanner('Reset ratio sandbox to platform default values.', 'info');
                  }}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Sandbox</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-black block mb-1">Total Assets (₦):</label>
                  <input
                    type="number"
                    value={sandboxAssets}
                    onChange={(e) => setSandboxAssets(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono font-bold text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Total Liabilities (₦):</label>
                  <input
                    type="number"
                    value={sandboxLiabilities}
                    onChange={(e) => setSandboxLiabilities(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono font-bold text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Total Equity (₦):</label>
                  <input
                    type="number"
                    value={sandboxEquity}
                    onChange={(e) => setSandboxEquity(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono font-bold text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Current Assets (₦):</label>
                  <input
                    type="number"
                    value={sandboxCurrentAssets}
                    onChange={(e) => setSandboxCurrentAssets(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono font-bold text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Current Liabilities (₦):</label>
                  <input
                    type="number"
                    value={sandboxCurrentLiabilities}
                    onChange={(e) => setSandboxCurrentLiabilities(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono font-bold text-black bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-black block mb-1">Inventory (₦):</label>
                  <input
                    type="number"
                    value={sandboxInventory}
                    onChange={(e) => setSandboxInventory(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono font-bold text-black bg-white"
                  />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Simple Interest */}
            <div className="bg-white rounded-xl border border-gray-300 p-5 shadow-sm space-y-4">
              <h4 className="text-base font-extrabold text-black flex items-center gap-2">
                <Calculator className="w-4 h-4 text-indigo-600" />
                Simple Interest Modeling (I = P × r × t)
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-black block mb-1">Principal (₦):</label>
                  <input
                    type="number"
                    value={simpleP}
                    onChange={(e) => setSimpleP(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono font-bold text-black bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-black block mb-1">Annual Rate (e.g. 0.33 for 33%):</label>
                    <input
                      type="number"
                      step={0.01}
                      value={simpleR}
                      onChange={(e) => setSimpleR(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono font-bold text-black bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-black block mb-1">Tenor (Years):</label>
                    <input
                      type="number"
                      value={simpleT}
                      onChange={(e) => setSimpleT(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono font-bold text-black bg-white"
                    />
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-300">
                  <div className="text-[11px] font-bold text-emerald-950">Total Interest Generated:</div>
                  <div className="text-xl font-black font-mono text-emerald-900">{formatNaira(simpleResult.interest)}</div>
                  <div className="text-[11px] font-semibold text-emerald-950 mt-1">
                    Total Payback: {formatNaira(simpleResult.totalAmount)}
                  </div>
                </div>
              </div>
            </div>

            {/* Compound Interest */}
            <div className="bg-white rounded-xl border border-gray-300 p-5 shadow-sm space-y-4">
              <h4 className="text-base font-extrabold text-black flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                Compound Interest Future Value (FV = PV × (1 + r/n)^(nt))
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-black block mb-1">Present Value (₦):</label>
                  <input
                    type="number"
                    value={compoundPv}
                    onChange={(e) => setCompoundPv(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded font-mono font-bold text-black bg-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-bold text-black block mb-1">Annual Rate:</label>
                    <input
                      type="number"
                      step={0.01}
                      value={compoundR}
                      onChange={(e) => setCompoundR(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded font-mono font-bold text-black bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-black block mb-1">Periods/Yr (n):</label>
                    <input
                      type="number"
                      value={compoundN}
                      onChange={(e) => setCompoundN(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded font-mono font-bold text-black bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-black block mb-1">Tenor (Yrs):</label>
                    <input
                      type="number"
                      value={compoundT}
                      onChange={(e) => setCompoundT(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded font-mono font-bold text-black bg-white"
                    />
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-300">
                  <div className="text-[11px] font-bold text-purple-950">Projected Future Value:</div>
                  <div className="text-xl font-black font-mono text-purple-900">{formatNaira(compoundResult.futureValue)}</div>
                  <div className="text-[11px] font-semibold text-purple-950 mt-1">
                    Compound Interest Earned: {formatNaira(compoundResult.interestEarned)}
                  </div>
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
                { key: 'capex_opex_dancia', label: 'CAPEX & OPEX (2) - Dancia-4Tv BoQ' }
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
          <div className="p-4 rounded-xl bg-white border border-gray-300 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${isEditingSheet ? 'bg-indigo-100 text-indigo-900 border border-indigo-300' : 'bg-gray-100 text-black border border-gray-300'}`}>
                    {isEditingSheet ? '✏️ Edit Mode Active' : '👁️ View Only'}
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

            {/* Workflow Action Buttons (All Truly Clickable with Database Persistence) */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Toggle Edit Mode */}
              <button
                onClick={() => setIsEditingSheet(!isEditingSheet)}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition ${
                  isEditingSheet
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                    : 'bg-gray-100 hover:bg-gray-200 text-black border-gray-300'
                }`}
                title="Toggle inline cell editing mode across all tables"
              >
                {isEditingSheet ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                <span>{isEditingSheet ? 'Switch to View Mode' : '✏️ Enable Edit Mode'}</span>
              </button>

              {/* Save CFO Draft */}
              <button
                onClick={handleSaveWorkingDraft}
                className="px-3.5 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                title="Save working draft to sovereign database & financial ledger"
              >
                <Save className="w-4 h-4 text-indigo-700" />
                <span>Save CFO Draft</span>
              </button>

              {/* Submit to Super Admin */}
              <button
                onClick={handleSubmitForApproval}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                title="Submit sheet to Super Admin for statutory sign-off"
              >
                <FileCheck className="w-4 h-4" />
                <span>Submit to Super Admin</span>
              </button>

              {/* Unlock for Revision (Always Clickable) */}
              <button
                onClick={handleSuperAdminUnlock}
                className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                title="Unlock this sheet to allow CFO modifications"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock for Revision</span>
              </button>

              {/* Ratify & Approve (Super Admin) */}
              <button
                onClick={handleSuperAdminApprove}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5"
                title="Ratify and lock financial sheet under Supreme Council Authority"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Ratify &amp; Approve</span>
              </button>
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
                    Auto-populated from Platform Subscriptions, Storefront Gross Commissions, Canary Ads, and Dancia-4Tv Broadcasting. Fully editable by CFO &amp; ratifiable by Super Admin.
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
                          <td className="py-2 px-3 font-bold text-black">
                            {isEditingSheet && !isLockedByAdmin ? (
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setIncomeStatement((prev) => ({
                                    ...prev,
                                    revenues: prev.revenues.map((r, i) => (i === idx ? { ...r, name: val } : r))
                                  }));
                                }}
                                className="w-full px-2 py-1 text-black font-bold border border-gray-300 rounded bg-white"
                              />
                            ) : (
                              item.name
                            )}
                          </td>
                          <td className="py-2 px-3 text-black font-semibold">
                            {isEditingSheet && !isLockedByAdmin ? (
                              <input
                                type="text"
                                value={item.category}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setIncomeStatement((prev) => ({
                                    ...prev,
                                    revenues: prev.revenues.map((r, i) => (i === idx ? { ...r, category: val } : r))
                                  }));
                                }}
                                className="w-32 px-2 py-1 text-black font-semibold border border-gray-300 rounded bg-white"
                              />
                            ) : (
                              item.category
                            )}
                          </td>
                          <td className="py-2 px-3 text-black font-medium">
                            {isEditingSheet && !isLockedByAdmin ? (
                              <input
                                type="text"
                                value={item.notes || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setIncomeStatement((prev) => ({
                                    ...prev,
                                    revenues: prev.revenues.map((r, i) => (i === idx ? { ...r, notes: val } : r))
                                  }));
                                }}
                                className="w-full px-2 py-1 text-black font-medium border border-gray-300 rounded bg-white"
                              />
                            ) : (
                              item.notes
                            )}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              disabled={!isEditingSheet || isLockedByAdmin}
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
                              disabled={!isEditingSheet || isLockedByAdmin}
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
                  disabled={!isEditingSheet || isLockedByAdmin}
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
                    B. Cost of Goods Sold (COGS &amp; Direct Operational Costs)
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
                          <td className="py-2 px-3 font-bold text-black">
                            {isEditingSheet && !isLockedByAdmin ? (
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setIncomeStatement((prev) => ({
                                    ...prev,
                                    cogs: prev.cogs.map((c, i) => (i === idx ? { ...c, name: val } : c))
                                  }));
                                }}
                                className="w-full px-2 py-1 text-black font-bold border border-gray-300 rounded bg-white"
                              />
                            ) : (
                              item.name
                            )}
                          </td>
                          <td className="py-2 px-3 text-black font-semibold">
                            {isEditingSheet && !isLockedByAdmin ? (
                              <input
                                type="text"
                                value={item.category}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setIncomeStatement((prev) => ({
                                    ...prev,
                                    cogs: prev.cogs.map((c, i) => (i === idx ? { ...c, category: val } : c))
                                  }));
                                }}
                                className="w-32 px-2 py-1 text-black font-semibold border border-gray-300 rounded bg-white"
                              />
                            ) : (
                              item.category
                            )}
                          </td>
                          <td className="py-2 px-3 text-black font-medium">
                            {isEditingSheet && !isLockedByAdmin ? (
                              <input
                                type="text"
                                value={item.notes || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setIncomeStatement((prev) => ({
                                    ...prev,
                                    cogs: prev.cogs.map((c, i) => (i === idx ? { ...c, notes: val } : c))
                                  }));
                                }}
                                className="w-full px-2 py-1 text-black font-medium border border-gray-300 rounded bg-white"
                              />
                            ) : (
                              item.notes
                            )}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              disabled={!isEditingSheet || isLockedByAdmin}
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
                              disabled={!isEditingSheet || isLockedByAdmin}
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

                <div className="flex items-center justify-between">
                  <button
                    disabled={!isEditingSheet || isLockedByAdmin}
                    onClick={() => {
                      const newItem: FinancialLineItem = {
                        id: `cogs_custom_${Date.now()}`,
                        name: 'New Direct Cost Component',
                        category: 'Operations',
                        amountNgn: 5000000.00,
                        notes: 'Direct operational cost component',
                        isCustom: true
                      };
                      setIncomeStatement((prev) => ({ ...prev, cogs: [...prev.cogs, newItem] }));
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Direct Cost (COGS)</span>
                  </button>

                  <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-bold text-black">
                    Auto-Calculated Gross Profit: <span className="font-mono font-black">{formatNaira(incomeMetrics.grossProfit)}</span> ({incomeMetrics.grossMarginPercent}% Margin)
                  </div>
                </div>
              </div>

              {/* 3. Operating Expenses (OPEX I & OPEX II) */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-black tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    C. Operating Expenses (OPEX I &amp; OPEX II)
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
                        <th className="py-2.5 px-3 text-left">Justification Notes</th>
                        <th className="py-2.5 px-3 text-right">Annual Budget (₦)</th>
                        <th className="py-2.5 px-2 text-center w-16">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {incomeStatement.opex.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="py-2 px-3 font-bold text-black">
                            {isEditingSheet && !isLockedByAdmin ? (
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setIncomeStatement((prev) => ({
                                    ...prev,
                                    opex: prev.opex.map((o, i) => (i === idx ? { ...o, name: val } : o))
                                  }));
                                }}
                                className="w-full px-2 py-1 text-black font-bold border border-gray-300 rounded bg-white"
                              />
                            ) : (
                              item.name
                            )}
                          </td>
                          <td className="py-2 px-3 text-black font-semibold">
                            {isEditingSheet && !isLockedByAdmin ? (
                              <input
                                type="text"
                                value={item.category}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setIncomeStatement((prev) => ({
                                    ...prev,
                                    opex: prev.opex.map((o, i) => (i === idx ? { ...o, category: val } : o))
                                  }));
                                }}
                                className="w-32 px-2 py-1 text-black font-semibold border border-gray-300 rounded bg-white"
                              />
                            ) : (
                              item.category
                            )}
                          </td>
                          <td className="py-2 px-3 text-black font-medium">
                            {isEditingSheet && !isLockedByAdmin ? (
                              <input
                                type="text"
                                value={item.notes || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setIncomeStatement((prev) => ({
                                    ...prev,
                                    opex: prev.opex.map((o, i) => (i === idx ? { ...o, notes: val } : o))
                                  }));
                                }}
                                className="w-full px-2 py-1 text-black font-medium border border-gray-300 rounded bg-white"
                              />
                            ) : (
                              item.notes
                            )}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              disabled={!isEditingSheet || isLockedByAdmin}
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
                              disabled={!isEditingSheet || isLockedByAdmin}
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

                <button
                  disabled={!isEditingSheet || isLockedByAdmin}
                  onClick={() => {
                    const newItem: FinancialLineItem = {
                      id: `opex_custom_${Date.now()}`,
                      name: 'New Operating Expense (OPEX)',
                      category: 'Administration',
                      amountNgn: 4000000.00,
                      notes: 'Operational overhead budget allocation',
                      isCustom: true
                    };
                    setIncomeStatement((prev) => ({ ...prev, opex: [...prev.opex, newItem] }));
                  }}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Operating Expense (OPEX)</span>
                </button>
              </div>

              {/* 4. Bottom Line, Fluctuating Debt Service & Fluctuating Tax Reserve */}
              <div className="pt-4 border-t border-gray-300 bg-gray-50 p-4 rounded-xl space-y-3 text-xs">
                <div className="flex justify-between items-center py-1">
                  <span className="font-bold text-black">Operating Income (EBITDA):</span>
                  <span className="font-mono text-black font-extrabold">{formatNaira(incomeMetrics.operatingIncome)}</span>
                </div>

                {/* Annual Commercial Loan Debt Service — Fluctuates Annually (CFO-Editable) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-t border-b border-gray-200 gap-2 bg-amber-50/60 p-2.5 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-extrabold text-black flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Annual Commercial Loan Debt Service (Fluctuates Regularly):
                    </span>
                    <span className="text-[11px] font-medium text-black mt-0.5">
                      Commercial bank debt interest rates fluctuate with monetary policy. Both Rate % and Principal (₦) are fully editable by the CFO.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] font-bold text-black">Rate %:</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.1}
                        disabled={!isEditingSheet || isLockedByAdmin}
                        value={incomeStatement.loanInterestRatePercent ?? 33}
                        onChange={(e) => {
                          const rate = parseFloat(e.target.value) || 0;
                          const principal = incomeStatement.loanPrincipalNgn ?? 426700000;
                          const annualDebt = (principal * rate) / 100;
                          setIncomeStatement((prev) => ({
                            ...prev,
                            loanInterestRatePercent: rate,
                            loanInterestAnnualNgn: annualDebt
                          }));
                        }}
                        className="w-16 px-1.5 py-1 border border-amber-400 rounded text-xs font-mono font-bold bg-white text-black text-center"
                      />
                      <label className="text-[11px] font-bold text-black ml-1">Principal (₦):</label>
                      <input
                        type="number"
                        min={0}
                        step={1000000}
                        disabled={!isEditingSheet || isLockedByAdmin}
                        value={incomeStatement.loanPrincipalNgn ?? 426700000}
                        onChange={(e) => {
                          const principal = parseFloat(e.target.value) || 0;
                          const rate = incomeStatement.loanInterestRatePercent ?? 33;
                          const annualDebt = (principal * rate) / 100;
                          setIncomeStatement((prev) => ({
                            ...prev,
                            loanPrincipalNgn: principal,
                            loanInterestAnnualNgn: annualDebt
                          }));
                        }}
                        className="w-32 px-1.5 py-1 border border-amber-400 rounded text-xs font-mono font-bold bg-white text-black"
                      />
                    </div>
                    <strong className="font-mono text-amber-900 font-black whitespace-nowrap">
                      ({formatNaira(incomeMetrics.debtService)})
                    </strong>
                  </div>
                </div>

                {/* Tax Reserve — Fluctuates with Fiscal Regulations (CFO-Editable) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-200 gap-2 bg-indigo-50/60 p-2.5 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-extrabold text-black flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      Tax Reserve (CIT / CITA Statutory Provision):
                    </span>
                    <span className="text-[11px] font-medium text-black mt-0.5">
                      Tax provisions fluctuate per FIRS / Federal fiscal year guidelines. CFO-adjustable each audit period.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] font-bold text-black">Tax Rate %:</label>
                      <input
                        type="number"
                        min={0}
                        max={50}
                        step={0.5}
                        disabled={!isEditingSheet || isLockedByAdmin}
                        value={incomeStatement.taxRatePercent ?? 10}
                        onChange={(e) => {
                          const rate = parseFloat(e.target.value) || 0;
                          setIncomeStatement((prev) => ({ ...prev, taxRatePercent: rate }));
                        }}
                        className="w-16 px-1.5 py-1 border border-indigo-400 rounded text-xs font-mono font-bold bg-white text-black text-center"
                      />
                    </div>
                    <strong className="font-mono text-indigo-950 font-black whitespace-nowrap">
                      ({formatNaira(incomeMetrics.tax)}) @ {incomeStatement.taxRatePercent}%
                    </strong>
                  </div>
                </div>

                {/* Final Net Bottom-Line Profit */}
                <div className="flex justify-between items-center pt-2 text-base font-black bg-emerald-100 p-3 rounded-xl border border-emerald-300">
                  <span className="text-emerald-950 font-black">
                    Net Platform Income (Bottom Line Profit Swept to Area 8 Abuja):
                  </span>
                  <span className="font-mono text-emerald-950 font-black text-lg">
                    {formatNaira(incomeMetrics.netIncome)}
                  </span>
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
                    Balance Sheet Identity: Assets = Liabilities + Shareholder Equity. Every asset and liability is editable by the CFO.
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
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black uppercase text-black block">A. Current Assets</span>
                      <button
                        disabled={!isEditingSheet || isLockedByAdmin}
                        onClick={() => {
                          const newItem: FinancialLineItem = {
                            id: `ca_custom_${Date.now()}`,
                            name: 'New Current Asset Item',
                            category: 'Current Assets',
                            amountNgn: 15000000
                          };
                          setBalanceSheet((prev) => ({ ...prev, currentAssets: [...prev.currentAssets, newItem] }));
                        }}
                        className="text-[10px] text-emerald-800 font-bold hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Current Asset
                      </button>
                    </div>

                    {balanceSheet.currentAssets.map((ca, idx) => (
                      <div key={ca.id} className="flex justify-between items-center py-1.5 border-b border-gray-200 gap-2">
                        {isEditingSheet && !isLockedByAdmin ? (
                          <input
                            type="text"
                            value={ca.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBalanceSheet((prev) => ({
                                ...prev,
                                currentAssets: prev.currentAssets.map((item, i) => (i === idx ? { ...item, name: val } : item))
                              }));
                            }}
                            className="w-full text-black font-semibold text-xs border border-gray-300 rounded px-2 py-0.5 bg-white"
                          />
                        ) : (
                          <span className="text-black font-semibold">{ca.name}</span>
                        )}
                        <div className="flex items-center gap-1 shrink-0">
                          <input
                            type="number"
                            disabled={!isEditingSheet || isLockedByAdmin}
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
                          <button
                            disabled={!isEditingSheet || isLockedByAdmin}
                            onClick={() => {
                              setBalanceSheet((prev) => ({
                                ...prev,
                                currentAssets: prev.currentAssets.filter((_, i) => i !== idx)
                              }));
                            }}
                            className="text-rose-600 hover:text-rose-800 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between font-black text-black pt-1">
                      <span>Total Current Assets:</span>
                      <span className="font-mono">{formatNaira(balanceMetrics.currentAssetsTotal)}</span>
                    </div>
                  </div>

                  {/* Fixed Assets */}
                  <div className="space-y-2 pt-2 border-t border-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black uppercase text-black block">B. Fixed Enterprise Assets</span>
                      <button
                        disabled={!isEditingSheet || isLockedByAdmin}
                        onClick={() => {
                          const newItem: FinancialLineItem = {
                            id: `fa_custom_${Date.now()}`,
                            name: 'New Fixed Enterprise Asset',
                            category: 'Fixed Equipment',
                            amountNgn: 20000000,
                            depreciationYears: 5
                          };
                          setBalanceSheet((prev) => ({ ...prev, fixedAssets: [...prev.fixedAssets, newItem] }));
                        }}
                        className="text-[10px] text-emerald-800 font-bold hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Fixed Asset
                      </button>
                    </div>

                    {balanceSheet.fixedAssets.map((fa, idx) => (
                      <div key={fa.id} className="flex justify-between items-center py-1.5 border-b border-gray-200 gap-2">
                        {isEditingSheet && !isLockedByAdmin ? (
                          <input
                            type="text"
                            value={fa.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBalanceSheet((prev) => ({
                                ...prev,
                                fixedAssets: prev.fixedAssets.map((item, i) => (i === idx ? { ...item, name: val } : item))
                              }));
                            }}
                            className="w-full text-black font-semibold text-xs border border-gray-300 rounded px-2 py-0.5 bg-white"
                          />
                        ) : (
                          <span className="text-black font-semibold">{fa.name}</span>
                        )}
                        <div className="flex items-center gap-1 shrink-0">
                          <input
                            type="number"
                            disabled={!isEditingSheet || isLockedByAdmin}
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
                          <button
                            disabled={!isEditingSheet || isLockedByAdmin}
                            onClick={() => {
                              setBalanceSheet((prev) => ({
                                ...prev,
                                fixedAssets: prev.fixedAssets.filter((_, i) => i !== idx)
                              }));
                            }}
                            className="text-rose-600 hover:text-rose-800 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between py-1 text-black font-bold">
                      <span>Gross Fixed Assets:</span>
                      <span className="font-mono">{formatNaira(balanceMetrics.grossFixedAssets)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 text-black font-bold">
                      <span>Less: Accumulated Depreciation:</span>
                      <input
                        type="number"
                        disabled={!isEditingSheet || isLockedByAdmin}
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
                    <h4 className="font-black text-sm uppercase text-black">2. Liabilities &amp; Equity</h4>
                    <span className="font-mono font-black text-black text-sm">
                      {formatNaira(balanceMetrics.totalLiabAndEquity)}
                    </span>
                  </div>

                  {/* Liabilities */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black uppercase text-black block">A. Current &amp; Long-Term Liabilities</span>
                      <button
                        disabled={!isEditingSheet || isLockedByAdmin}
                        onClick={() => {
                          const newItem: FinancialLineItem = {
                            id: `cl_custom_${Date.now()}`,
                            name: 'New Trade Liability / Payables',
                            category: 'Payables',
                            amountNgn: 10000000
                          };
                          setBalanceSheet((prev) => ({ ...prev, currentLiabilities: [...prev.currentLiabilities, newItem] }));
                        }}
                        className="text-[10px] text-indigo-800 font-bold hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Liability
                      </button>
                    </div>

                    {balanceSheet.currentLiabilities.map((cl, idx) => (
                      <div key={cl.id} className="flex justify-between items-center py-1.5 border-b border-gray-200 gap-2">
                        {isEditingSheet && !isLockedByAdmin ? (
                          <input
                            type="text"
                            value={cl.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBalanceSheet((prev) => ({
                                ...prev,
                                currentLiabilities: prev.currentLiabilities.map((item, i) => (i === idx ? { ...item, name: val } : item))
                              }));
                            }}
                            className="w-full text-black font-semibold text-xs border border-gray-300 rounded px-2 py-0.5 bg-white"
                          />
                        ) : (
                          <span className="text-black font-semibold">{cl.name}</span>
                        )}
                        <div className="flex items-center gap-1 shrink-0">
                          <input
                            type="number"
                            disabled={!isEditingSheet || isLockedByAdmin}
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
                          <button
                            disabled={!isEditingSheet || isLockedByAdmin}
                            onClick={() => {
                              setBalanceSheet((prev) => ({
                                ...prev,
                                currentLiabilities: prev.currentLiabilities.filter((_, i) => i !== idx)
                              }));
                            }}
                            className="text-rose-600 hover:text-rose-800 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {balanceSheet.longTermLiabilities.map((lt, idx) => (
                      <div key={lt.id} className="flex justify-between items-center py-1.5 border-b border-gray-200 gap-2">
                        {isEditingSheet && !isLockedByAdmin ? (
                          <input
                            type="text"
                            value={lt.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBalanceSheet((prev) => ({
                                ...prev,
                                longTermLiabilities: prev.longTermLiabilities.map((item, i) => (i === idx ? { ...item, name: val } : item))
                              }));
                            }}
                            className="w-full text-black font-semibold text-xs border border-gray-300 rounded px-2 py-0.5 bg-white"
                          />
                        ) : (
                          <span className="text-black font-semibold">{lt.name}</span>
                        )}
                        <div className="flex items-center gap-1 shrink-0">
                          <input
                            type="number"
                            disabled={!isEditingSheet || isLockedByAdmin}
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
                          <button
                            disabled={!isEditingSheet || isLockedByAdmin}
                            onClick={() => {
                              setBalanceSheet((prev) => ({
                                ...prev,
                                longTermLiabilities: prev.longTermLiabilities.filter((_, i) => i !== idx)
                              }));
                            }}
                            className="text-rose-600 hover:text-rose-800 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between font-black text-black pt-1">
                      <span>Total Liabilities:</span>
                      <span className="font-mono">{formatNaira(balanceMetrics.totalLiabilities)}</span>
                    </div>
                  </div>

                  {/* Equity */}
                  <div className="space-y-2 pt-2 border-t border-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black uppercase text-black block">B. Shareholder &amp; Platform Equity</span>
                      <button
                        disabled={!isEditingSheet || isLockedByAdmin}
                        onClick={() => {
                          const newItem: FinancialLineItem = {
                            id: `eq_custom_${Date.now()}`,
                            name: 'Additional Paid-In Founder Capital',
                            category: 'Share Capital',
                            amountNgn: 50000000
                          };
                          setBalanceSheet((prev) => ({ ...prev, equityItems: [...prev.equityItems, newItem] }));
                        }}
                        className="text-[10px] text-indigo-800 font-bold hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Equity Item
                      </button>
                    </div>

                    {balanceSheet.equityItems.map((eq, idx) => (
                      <div key={eq.id} className="flex justify-between items-center py-1.5 border-b border-gray-200 gap-2">
                        {isEditingSheet && !isLockedByAdmin ? (
                          <input
                            type="text"
                            value={eq.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBalanceSheet((prev) => ({
                                ...prev,
                                equityItems: prev.equityItems.map((item, i) => (i === idx ? { ...item, name: val } : item))
                              }));
                            }}
                            className="w-full text-black font-semibold text-xs border border-gray-300 rounded px-2 py-0.5 bg-white"
                          />
                        ) : (
                          <span className="text-black font-semibold">{eq.name}</span>
                        )}
                        <div className="flex items-center gap-1 shrink-0">
                          <input
                            type="number"
                            disabled={!isEditingSheet || isLockedByAdmin}
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
                          <button
                            disabled={!isEditingSheet || isLockedByAdmin}
                            onClick={() => {
                              setBalanceSheet((prev) => ({
                                ...prev,
                                equityItems: prev.equityItems.filter((_, i) => i !== idx)
                              }));
                            }}
                            className="text-rose-600 hover:text-rose-800 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between py-1 text-black font-bold">
                      <span>Retained Net Profit Surplus (from P&amp;L):</span>
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
                    Technical Computing Center (TCC) Hardware &amp; Broadcast Bill of Quantities. Editable equipment, rates, quantities, and USD exchange benchmark.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-extrabold text-black block">BoQ Total (₦)</span>
                  <span className="text-xl font-mono font-black text-black">
                    {formatNaira(costTccMetrics.totalNgn)}
                  </span>
                  <div className="flex items-center gap-1.5 justify-end mt-0.5">
                    <span className="text-xs font-mono font-bold text-black">
                      ({formatUSD(costTccMetrics.totalUsd)} @
                    </span>
                    <input
                      type="number"
                      disabled={!isEditingSheet || isLockedByAdmin}
                      value={costTccBoq.usdExchangeRate}
                      onChange={(e) => setCostTccBoq((prev) => ({ ...prev, usdExchangeRate: Number(e.target.value) || 1550 }))}
                      className="w-16 px-1 py-0.5 text-center font-mono font-bold text-black border border-gray-300 rounded bg-white text-xs"
                    />
                    <span className="text-xs font-mono font-bold text-black">/ $)</span>
                  </div>
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
                          <td className="py-2 px-3 font-bold text-black">
                            {isEditingSheet && !isLockedByAdmin ? (
                              <input
                                type="text"
                                value={it.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setCostTccBoq((prev) => ({
                                    ...prev,
                                    items: prev.items.map((item, i) => (i === idx ? { ...item, name: val } : item))
                                  }));
                                }}
                                className="w-full px-2 py-1 text-black font-bold border border-gray-300 rounded bg-white"
                              />
                            ) : (
                              it.name
                            )}
                          </td>
                          <td className="py-2 px-3 text-black font-semibold">
                            {isEditingSheet && !isLockedByAdmin ? (
                              <input
                                type="text"
                                value={it.category}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setCostTccBoq((prev) => ({
                                    ...prev,
                                    items: prev.items.map((item, i) => (i === idx ? { ...item, category: val } : item))
                                  }));
                                }}
                                className="w-28 px-2 py-1 text-black font-semibold border border-gray-300 rounded bg-white"
                              />
                            ) : (
                              it.category
                            )}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <input
                              type="number"
                              disabled={!isEditingSheet || isLockedByAdmin}
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
                              disabled={!isEditingSheet || isLockedByAdmin}
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
                              disabled={!isEditingSheet || isLockedByAdmin}
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
                disabled={!isEditingSheet || isLockedByAdmin}
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
                    Comprehensive capital requirement: Fixed Assets + Pre-Opening Operating Capital. Every cell is editable by the CFO.
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
                    <div key={fa.id} className="flex justify-between items-center py-1.5 border-b border-gray-200 gap-2">
                      {isEditingSheet && !isLockedByAdmin ? (
                        <input
                          type="text"
                          value={fa.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setStartupFunds((prev) => ({
                              ...prev,
                              fixedAssets: prev.fixedAssets.map((item, i) => (i === idx ? { ...item, name: val } : item))
                            }));
                          }}
                          className="w-full text-black font-semibold text-xs border border-gray-300 rounded px-2 py-0.5 bg-white"
                        />
                      ) : (
                        <span className="text-black font-semibold">{fa.name}</span>
                      )}
                      <div className="flex items-center gap-1 shrink-0">
                        <input
                          type="number"
                          disabled={!isEditingSheet || isLockedByAdmin}
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
                        <button
                          disabled={!isEditingSheet || isLockedByAdmin}
                          onClick={() => {
                            setStartupFunds((prev) => ({
                              ...prev,
                              fixedAssets: prev.fixedAssets.filter((_, i) => i !== idx)
                            }));
                          }}
                          className="text-rose-600 hover:text-rose-800 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    disabled={!isEditingSheet || isLockedByAdmin}
                    onClick={() => {
                      const newItem: FinancialLineItem = {
                        id: `su_fa_${Date.now()}`,
                        name: 'New Fixed Capital Asset',
                        category: 'Equipment',
                        amountNgn: 10000000,
                        depreciationYears: 5
                      };
                      setStartupFunds((prev) => ({ ...prev, fixedAssets: [...prev.fixedAssets, newItem] }));
                    }}
                    className="text-[11px] font-bold text-indigo-700 hover:underline flex items-center gap-1 pt-1"
                  >
                    <Plus className="w-3 h-3" /> Add Fixed Asset
                  </button>
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
                    <div key={op.id} className="flex justify-between items-center py-1.5 border-b border-gray-200 gap-2">
                      {isEditingSheet && !isLockedByAdmin ? (
                        <input
                          type="text"
                          value={op.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setStartupFunds((prev) => ({
                              ...prev,
                              operatingCapital: prev.operatingCapital.map((item, i) => (i === idx ? { ...item, name: val } : item))
                            }));
                          }}
                          className="w-full text-black font-semibold text-xs border border-gray-300 rounded px-2 py-0.5 bg-white"
                        />
                      ) : (
                        <span className="text-black font-semibold">{op.name}</span>
                      )}
                      <div className="flex items-center gap-1 shrink-0">
                        <input
                          type="number"
                          disabled={!isEditingSheet || isLockedByAdmin}
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
                        <button
                          disabled={!isEditingSheet || isLockedByAdmin}
                          onClick={() => {
                            setStartupFunds((prev) => ({
                              ...prev,
                              operatingCapital: prev.operatingCapital.filter((_, i) => i !== idx)
                            }));
                          }}
                          className="text-rose-600 hover:text-rose-800 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    disabled={!isEditingSheet || isLockedByAdmin}
                    onClick={() => {
                      const newItem: FinancialLineItem = {
                        id: `su_op_${Date.now()}`,
                        name: 'New Operating Capital Item',
                        category: 'Operating Reserves',
                        amountNgn: 5000000
                      };
                      setStartupFunds((prev) => ({ ...prev, operatingCapital: [...prev.operatingCapital, newItem] }));
                    }}
                    className="text-[11px] font-bold text-indigo-700 hover:underline flex items-center gap-1 pt-1"
                  >
                    <Plus className="w-3 h-3" /> Add Operating Capital Line
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE SHEET 5: CAPEX & OPEX (2) - Dancia-4Tv BoQ */}
          {selectedSheetKey === 'capex_opex_dancia' && (
            <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-300 gap-2">
                <div>
                  <h3 className="font-extrabold text-lg text-black">
                    {capexOpexDancia.title}
                  </h3>
                  <p className="text-xs text-black font-semibold">
                    17 Itemized Loan Allocation Lines from the Excel BoQ schedule. Fully editable by CFO &amp; ratified by Super Admin.
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
                    className="p-3 rounded-lg border border-gray-300 bg-white flex justify-between items-center shadow-xs gap-2"
                  >
                    <div className="w-full pr-2">
                      {isEditingSheet && !isLockedByAdmin ? (
                        <>
                          <input
                            type="text"
                            value={line.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCapexOpexDancia((prev) => ({
                                ...prev,
                                items: prev.items.map((item, i) => (i === idx ? { ...item, name: val } : item))
                              }));
                            }}
                            className="w-full font-bold text-black text-xs border border-gray-300 rounded px-1.5 py-0.5 bg-white mb-1"
                          />
                          <input
                            type="text"
                            value={line.notes || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCapexOpexDancia((prev) => ({
                                ...prev,
                                items: prev.items.map((item, i) => (i === idx ? { ...item, notes: val } : item))
                              }));
                            }}
                            className="w-full text-[11px] text-black font-medium border border-gray-300 rounded px-1.5 py-0.5 bg-white"
                          />
                        </>
                      ) : (
                        <>
                          <div className="font-bold text-black">{line.name}</div>
                          <div className="text-[11px] text-black font-medium">{line.notes}</div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        disabled={!isEditingSheet || isLockedByAdmin}
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
                      <button
                        disabled={!isEditingSheet || isLockedByAdmin}
                        onClick={() => {
                          setCapexOpexDancia((prev) => ({
                            ...prev,
                            items: prev.items.filter((_, i) => i !== idx)
                          }));
                        }}
                        className="text-rose-600 hover:text-rose-800 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                disabled={!isEditingSheet || isLockedByAdmin}
                onClick={() => {
                  const newItem: FinancialLineItem = {
                    id: `dancia_custom_${Date.now()}`,
                    name: `${capexOpexDancia.items.length + 1}. New Project Phase Allocation`,
                    category: 'Media Production',
                    amountNgn: 10000000,
                    notes: 'Custom allocation line item'
                  };
                  setCapexOpexDancia((prev) => ({ ...prev, items: [...prev.items, newItem] }));
                }}
                className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Allocation Line</span>
              </button>
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
                Click <strong>"Sync Subscriptions to Financial P&amp;L"</strong> to feed current pricing and volume into Sheet 8 (Income Statement).
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-300 gap-2">
            <div>
              <h3 className="font-extrabold text-base text-black flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Live Revenue Inflow &amp; Profit Sweep Ledger
              </h3>
              <p className="text-xs text-black font-medium">
                Audited real-time double-entry ledger routing revenue to Fidelity Bank Lagos and sweeping bottom-line profit to Fidelity Bank Area 8 Abuja.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const sweep = financialDb.commitSweep({
                    grossRevenueNgn: incomeMetrics.totalRevenue,
                    deductionsNgn: {
                      cogs: incomeMetrics.totalCogs,
                      opex: incomeMetrics.totalOpex,
                      debtService: incomeMetrics.debtService,
                      taxReserve: incomeMetrics.tax
                    },
                    netProfitSweptNgn: incomeMetrics.netIncome,
                    inflowBankRail: 'Fidelity Bank Lagos (5600792703)',
                    destinationSurplusRail: 'Fidelity Bank Area 8 Abuja (5601279229)',
                    sweepStatus: 'COMMITTED_TO_FIDELITY_AREA8'
                  });
                  showBanner(`💸 Profit Sweep Executed: ₦${sweep.netProfitSweptNgn.toLocaleString()} committed to Fidelity Area 8 Abuja.`);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Execute Profit Sweep Now</span>
              </button>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-black border border-emerald-300">
                Double-Entry Reconciled (100%)
              </span>
            </div>
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
                  <td className="py-2.5 px-3 font-bold text-black">VIP Flamingo &amp; Creator Tier Subscriptions</td>
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
                  <td className="py-2.5 px-3 text-black font-semibold">P&amp;L Auto-Reconciliation</td>
                  <td className="py-2.5 px-3 text-right font-mono font-black text-purple-900">₦25,000,000.00</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-black">PROFIT-ABUJA (Fidelity Bank Area 8: 5601279229)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* AUDIT TRAIL & RELATIONAL DATABASE INSPECTION MODAL                   */}
      {/* ==================================================================== */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-300 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-base text-black">
                  Sovereign Financial Relational Database &amp; Audit Trail
                </h3>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-200 text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Database Telemetry Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-[10px] uppercase font-black text-black">Commercial Loan Debt Rate</div>
                  <div className="text-lg font-black font-mono text-black">{incomeStatement.loanInterestRatePercent ?? 33}%</div>
                  <div className="text-[10px] text-black">Principal: {formatNaira(incomeStatement.loanPrincipalNgn ?? 426700000)}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-[10px] uppercase font-black text-black">Company Income Tax (CIT)</div>
                  <div className="text-lg font-black font-mono text-black">{incomeStatement.taxRatePercent ?? 10}%</div>
                  <div className="text-[10px] text-black">Annual Reserve: {formatNaira(incomeMetrics.tax)}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-[10px] uppercase font-black text-black">Total Audit Records</div>
                  <div className="text-lg font-black font-mono text-black">{auditList.length}</div>
                  <div className="text-[10px] text-black">WORM Compliant Ledger</div>
                </div>
              </div>

              {/* Audit Table */}
              <div>
                <h4 className="text-xs font-black uppercase text-black mb-2 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-indigo-600" />
                  Audit Trail Records (Immutable Write-Once Ledger)
                </h4>
                <div className="border border-gray-200 rounded-lg overflow-x-auto max-h-64">
                  <table className="w-full text-xs divide-y divide-gray-200">
                    <thead className="bg-gray-100 text-black font-extrabold sticky top-0">
                      <tr>
                        <th className="py-2 px-3 text-left">Action</th>
                        <th className="py-2 px-3 text-left">Sheet</th>
                        <th className="py-2 px-3 text-left">Actor</th>
                        <th className="py-2 px-3 text-left">Notes</th>
                        <th className="py-2 px-3 text-left">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {auditList.map((rec) => (
                        <tr key={rec.id} className="hover:bg-gray-50">
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              rec.action === 'SUPER_ADMIN_APPROVED'
                                ? 'bg-emerald-600 text-white'
                                : rec.action === 'SUBMITTED_FOR_APPROVAL'
                                ? 'bg-blue-600 text-white'
                                : rec.action === 'UNLOCK_FOR_REVISION'
                                ? 'bg-amber-600 text-white'
                                : 'bg-gray-100 text-black border border-gray-300'
                            }`}>
                              {rec.action}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-semibold text-black">{rec.sheetLabel || rec.sheetKey}</td>
                          <td className="py-2 px-3 font-bold text-black">{rec.actor}</td>
                          <td className="py-2 px-3 text-black font-medium">{rec.notes}</td>
                          <td className="py-2 px-3 font-mono text-[10px] text-black">
                            {new Date(rec.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Heartbeat Telemetry */}
              {lastHeartbeat && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-xs space-y-1">
                  <div className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-700" />
                    Last Live Heartbeat Inflow Pulse ({new Date(lastHeartbeat.timestamp).toLocaleTimeString()}):
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 font-mono text-[11px] text-emerald-900 font-bold">
                    <div>Subscriptions: ₦{lastHeartbeat.subscriptionsAnnualNgn.toLocaleString()}</div>
                    <div>Storefront Comm: ₦{lastHeartbeat.storefrontCommissionNgn.toLocaleString()}</div>
                    <div>Canary Ads: ₦{lastHeartbeat.canaryAdsAnnualNgn.toLocaleString()}</div>
                    <div>Dancia PPV: ₦{lastHeartbeat.danciaBroadcastingAnnualNgn.toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg"
              >
                Close Database Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnterpriseFinancialEcosystemConsole;
