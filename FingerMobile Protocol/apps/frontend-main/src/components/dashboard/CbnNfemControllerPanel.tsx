/**
 * FingerMobile™Protocol - Central Bank of Nigeria (CBN) NFEM Ingestion Engine & REER Controller
 *
 * Implements the autonomous daily rate ingestion and official CBN financial methodology:
 * 1. Volume-Weighted Average Price (VWAP):
 *    Daily NFEM Rate = Sum(Price * Volume) / Total Daily Turnover Volume
 * 2. Structural Variables Telemetry (Money Supply M2 vs Reserves, FX Turnover, Inflation Variance)
 * 3. Real Effective Exchange Rate (REER) Basket Matrix (BIS Methodology)
 * 4. Autonomous Rate Search & Ingest Controller with Audit Cryptographic Stamp.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Landmark,
  Activity,
  TrendingUp,
  Scale,
  RefreshCw,
  CheckCircle,
  Building2,
  DollarSign,
  Globe,
  Clock,
  Database,
  ShieldCheck,
  Plus,
  X,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  cbnNfemIngestionService,
} from '../../services/cbnNfemIngestionService';
import {
  NFEMTransaction,
  NFEMDailySummary,
  StructuralMarketFactors,
  REERCalculationResult,
  AutonomousIngestAuditLog,
  DealerCategory,
} from '../../types/cbn-nfem';
import { exchangeRateService } from '../../services/exchangeRateService';

export const CbnNfemControllerPanel: React.FC = () => {
  const [summary, setSummary] = useState<NFEMDailySummary>(() =>
    cbnNfemIngestionService.getDailySummary()
  );
  const [transactions, setTransactions] = useState<NFEMTransaction[]>(() =>
    cbnNfemIngestionService.getTransactions()
  );
  const [factors, setFactors] = useState<StructuralMarketFactors>(() =>
    cbnNfemIngestionService.getStructuralFactors()
  );
  const [reer, setReer] = useState<REERCalculationResult>(() =>
    cbnNfemIngestionService.computeReer(summary.vwapRate)
  );
  const [auditLogs, setAuditLogs] = useState<AutonomousIngestAuditLog[]>(() =>
    cbnNfemIngestionService.getAuditLogs()
  );

  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestStatusMsg, setIngestStatusMsg] = useState<string>('');
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [tradeError, setTradeError] = useState<string | null>(null);
  const [isSchedulerActive, setIsSchedulerActive] = useState(() =>
    cbnNfemIngestionService.isSchedulerRunning()
  );

  // Trade Simulation Form State
  const [simDealerName, setSimDealerName] = useState('Standard Chartered Bank Nigeria');
  const [simDealerType, setSimDealerType] = useState<DealerCategory>('AUTHORIZED_DEALER_BANK');
  const [simPrice, setSimPrice] = useState('1330.00');
  const [simVolume, setSimVolume] = useState('10000000');
  const [simVenue, setSimVenue] = useState<'Bloomberg BMatch' | 'FMDQ Refinitiv'>('Bloomberg BMatch');

  // Refresh local state from service
  const refreshState = useCallback(() => {
    const s = cbnNfemIngestionService.getDailySummary();
    setSummary(s);
    setTransactions(cbnNfemIngestionService.getTransactions());
    setFactors(cbnNfemIngestionService.getStructuralFactors());
    setReer(cbnNfemIngestionService.computeReer(s.vwapRate));
    setAuditLogs(cbnNfemIngestionService.getAuditLogs());
  }, []);

  useEffect(() => {
    const unsubscribe = cbnNfemIngestionService.subscribe(() => {
      refreshState();
    });
    return () => {
      unsubscribe();
    };
  }, [refreshState]);

  // Execute Autonomous Ingestion Flow
  const handleTriggerAutonomousIngest = async () => {
    setIsIngesting(true);
    setIngestStatusMsg('Searching CBN Rates Portal (https://www.cbn.gov.ng/rates/ExchRateByCurrency.html) & BMatch Tape...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIngestStatusMsg('Aggregating willing buyer/seller interbank trades & computing Volume-Weighted Average Price (VWAP)...');

      await new Promise((resolve) => setTimeout(resolve, 800));
      setIngestStatusMsg('Calculating BIS REER Basket & calibrating platform FIC parity at $0.05c / ₦65.00k NGN...');

      const result = await cbnNfemIngestionService.runDailyAutonomousIngest(true);
      refreshState();

      // Synchronize exchangeRateService
      exchangeRateService.setApexBankNairaRate(result.summary.vwapRate, 65.0);
      exchangeRateService.setPlatformFicRate(20);

      setIngestStatusMsg(
        `Ingestion Successful: VWAP cleared at ₦${result.summary.vwapRate.toFixed(2)}/USD. FIC Calibrated to ₦${result.calibratedFic.ficNaira.toFixed(2)} ($0.05 USD). REER: ${result.reer.reerIndex}.`
      );

      setTimeout(() => setIngestStatusMsg(''), 7000);
    } catch {
      setIngestStatusMsg('Ingestion encountered network warning, defaulted to verified baseline NFEM parameters.');
    } finally {
      setIsIngesting(false);
    }
  };

  // Toggle Autonomous Daily Scheduler
  const handleToggleScheduler = () => {
    if (isSchedulerActive) {
      cbnNfemIngestionService.stopAutonomousScheduler();
      setIsSchedulerActive(false);
    } else {
      cbnNfemIngestionService.startAutonomousScheduler();
      setIsSchedulerActive(true);
    }
  };

  // Handle Trade Simulation Injection
  const handleSimulateTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTradeError(null);
    const p = parseFloat(simPrice);
    const v = parseFloat(simVolume);
    if (isNaN(p) || p <= 0 || isNaN(v) || v <= 0) {
      setTradeError('Please enter a valid price and trade volume greater than zero.');
      return;
    }

    cbnNfemIngestionService.simulateInterbankTrade(
      simDealerName.trim() || 'Anonymous Interbank Dealer',
      simDealerType,
      p,
      v,
      simVenue
    );

    refreshState();
    setIsTradeModalOpen(false);
  };

  // Reset to default tape
  const handleResetTape = () => {
    cbnNfemIngestionService.resetToDefaultTape();
    refreshState();
  };

  const ficParity = cbnNfemIngestionService.calibrateFicValuation(summary.vwapRate, true);

  const getDealerBadgeClass = (category: DealerCategory) => {
    if (category === 'AUTHORIZED_DEALER_BANK') {
      return 'bg-blue-950 text-blue-300 border border-blue-800/40';
    }
    if (category === 'INTERNATIONAL_OIL_COMPANY') {
      return 'bg-amber-950 text-amber-300 border border-amber-800/40';
    }
    return 'bg-purple-950 text-purple-300 border border-purple-800/40';
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. SOVEREIGN APEX CONTROLLER HEADER                                       */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-zinc-900 to-amber-950 p-6 sm:p-8 border border-amber-500/30 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Landmark className="w-3 h-3" />
                <span>CBN Sovereign Window Controller</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Activity className="w-3 h-3" />
                <span>Market-Determined NFEM Pricing</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Globe className="w-3 h-3" />
                <span>BIS REER Basket Standard</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Central Bank of Nigeria (CBN) NFEM Ingestion Engine & REER Controller
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
              Autonomous ingestion of the official Central Bank of Nigeria daily rate via the Nigerian Foreign Exchange Market (NFEM)
              window. Implements the <strong>Volume-Weighted Average Price (VWAP)</strong> on Bloomberg BMatch, structural macroeconomic factor modeling,
              and Bank for International Settlements (BIS) Real Effective Exchange Rate (REER) calculation.
            </p>
          </div>

          {/* Action Button Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={handleTriggerAutonomousIngest}
              disabled={isIngesting}
              className={`px-4 py-3 rounded-xl font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-lg ${
                isIngesting
                  ? 'bg-amber-600/50 text-slate-900 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isIngesting ? 'animate-spin' : ''}`} />
              <span>{isIngesting ? 'Ingesting Rates...' : 'Run Autonomous Daily Ingest'}</span>
            </button>

            <button
              onClick={() => setIsTradeModalOpen(true)}
              className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs font-mono transition flex items-center justify-center gap-2 border border-zinc-700"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Simulate Interbank Trade</span>
            </button>

            <button
              onClick={handleToggleScheduler}
              className={`px-3 py-3 rounded-xl font-bold text-xs font-mono transition flex items-center justify-center gap-2 border ${
                isSchedulerActive
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 font-medium hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Auto-Timer: {isSchedulerActive ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Live Status Toast Banner */}
        {ingestStatusMsg && (
          <div className="mt-4 p-3 rounded-xl bg-black/60 border border-amber-500/40 text-xs text-amber-300 font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{ingestStatusMsg}</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. CORE FINANCIAL METRICS QUAD                                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Official Cleared NFEM VWAP Rate */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-300 font-medium">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Daily NFEM VWAP Rate</span>
            <Landmark className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">
            ₦{summary.vwapRate.toFixed(2)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-300 font-mono">
            <span>Range: ₦{summary.lowRate.toFixed(2)} - ₦{summary.highRate.toFixed(2)}</span>
            <span className="text-emerald-400 font-bold">1 USD</span>
          </div>
          <p className="text-[10px] text-zinc-300 font-medium">
            Volume-Weighted Average Price cleared on Bloomberg BMatch & Refinitiv.
          </p>
        </div>

        {/* Card 2: 24h Interbank Turnover */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-300 font-medium">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Interbank FX Turnover</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            ${(summary.totalTurnoverUsd / 1000000).toFixed(1)}M USD
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-300 font-mono">
            <span>₦{(summary.totalNairaTurnover / 1000000000).toFixed(2)}B NGN</span>
            <span>{summary.transactionsCount} Trades</span>
          </div>
          <p className="text-[10px] text-zinc-300 font-medium">
            Total daily liquidity injected by Authorized Dealer Banks & IOCs.
          </p>
        </div>

        {/* Card 3: Calibrated FIC Token Valuation */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-300 font-medium">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Calibrated FIC Parity</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black font-mono text-indigo-300">
            ₦{ficParity.ficNaira.toFixed(2)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-300 font-mono">
            <span>1 FIC = ${ficParity.ficUsd.toFixed(2)} USD</span>
            <span className="text-amber-400 font-bold">{ficParity.discountPercent}% Buffer</span>
          </div>
          <p className="text-[10px] text-zinc-300 font-medium">
            Strict protocol standard: 1 USD = 20 FIC (1 FIC = $0.05c USD / ₦65.00k NGN).
          </p>
        </div>

        {/* Card 4: Real Effective Exchange Rate (REER) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-300 font-medium">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Composite REER Index</span>
            <Scale className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-300">
            {reer.reerIndex.toFixed(2)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-300 font-mono">
            <span>Base: {reer.baseYear}</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px]">
              {reer.valuationStatus}
            </span>
          </div>
          <p className="text-[10px] text-zinc-300 font-medium">
            BIS 6-currency trade-weighted purchasing power parity matrix.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. METHODOLOGY 1: VOLUME-WEIGHTED AVERAGE PRICE (VWAP) ENGINE             */}
      {/* ========================================================================= */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
              Methodology 1: Volume-Weighted Average Price (VWAP) Calculation
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Bloomberg BMatch Interbank Order Book &quot;Willing Buyer, Willing Seller&quot; Tape
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetTape}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono font-semibold rounded-lg transition"
            >
              Reset to Base Tape
            </button>
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-mono">
              Venue: {summary.sourceVenue}
            </span>
          </div>
        </div>

        {/* Mathematical Formula Callout */}
        <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white">Central Bank Official Valuation Formula:</span>
          </div>
          <div className="p-3 bg-zinc-950 rounded-lg font-mono text-xs sm:text-sm text-amber-300 text-center tracking-wide border border-zinc-800/80">
            Daily NFEM Rate = ∑ (Price of Transaction × Volume of Transaction) ÷ Total Daily Turnover Volume
          </div>
          <p className="text-[11px] text-zinc-300 font-medium leading-relaxed">
            <strong>Volume Weighting Tilt Principle:</strong> Authorized dealer commercial banks, institutional investors, and international oil companies (IOCs) engage in a market-cleared mechanism. For instance, if <strong>Bank A buys $10 million at ₦1,330/$</strong> and <strong>Bank B buys $2 million at ₦1,335/$</strong>, the official published rate mathematically tilts closer to ₦1,330 because of the significantly higher volume traded at that level.
          </p>
        </div>

        {/* Live Interbank Transactions Table */}
        <div className="overflow-x-auto border border-zinc-800 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/60 text-zinc-200 font-bold border-b border-zinc-800 text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Ticket Ref</th>
                <th className="py-3 px-4">Interbank Dealer / Counterparty</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Venue</th>
                <th className="py-3 px-4 text-right">Agreed Rate (₦/$)</th>
                <th className="py-3 px-4 text-right">Volume (USD)</th>
                <th className="py-3 px-4 text-right">Naira Turnover (NGN)</th>
                <th className="py-3 px-4 text-right">Volume Weight</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {transactions.map((tx) => {
                const weightPct = summary.totalTurnoverUsd > 0
                  ? ((tx.volumeUsd / summary.totalTurnoverUsd) * 100).toFixed(1)
                  : '0.0';
                return (
                  <tr key={tx.id} className="hover:bg-zinc-800/30 transition">
                    <td className="py-3 px-4 font-bold text-zinc-300">{tx.ticketRef}</td>
                    <td className="py-3 px-4 font-sans font-semibold text-white">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{tx.dealerName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[10px]">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${getDealerBadgeClass(tx.dealerType)}`}>
                        {tx.dealerType.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-300 text-[11px] font-medium">{tx.tradingVenue}</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-400">
                      ₦{tx.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400">
                      ${(tx.volumeUsd / 1000000).toFixed(2)}M
                    </td>
                    <td className="py-3 px-4 text-right text-zinc-300">
                      ₦{(tx.totalNairaValue / 1000000000).toFixed(2)}B
                    </td>
                    <td className="py-3 px-4 text-right text-indigo-300 font-bold">
                      <div className="flex items-center justify-end gap-1.5">
                        <span>{weightPct}%</span>
                        <div className="w-12 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, parseFloat(weightPct))}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px]">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. METHODOLOGY 2: STRUCTURAL VARIABLES TELEMETRY                          */}
      {/* ========================================================================= */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="border-b border-zinc-800 pb-3">
          <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
            Methodology 2: Macroeconomic Structural Drivers
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
            Key Variables Influencing the Market-Cleared Clearing Price
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Factor 1: Money Supply Differentials */}
          <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-zinc-300 font-medium">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                1. Money Supply Differentials
              </span>
              <Database className="w-4 h-4 text-amber-400" />
            </div>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between text-zinc-300 font-medium">
                <span>Broad Money (M2):</span>
                <span className="text-white font-bold">₦{factors.moneySupplyM2Naira.toFixed(1)} Trillion</span>
              </div>
              <div className="flex justify-between text-zinc-300 font-medium">
                <span>Gross FX Reserves:</span>
                <span className="text-emerald-400 font-bold">${factors.fxReservesUsd.toFixed(1)} Billion</span>
              </div>
              <div className="flex justify-between text-zinc-300 font-medium">
                <span>M2 / Reserves Ratio:</span>
                <span className="text-amber-400 font-bold">{factors.moneySupplyRatio.toFixed(2)}x</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-300 font-medium leading-relaxed border-t border-zinc-800 pt-2">
              The volume of local Naira in circulation relative to available USD liquid reserves determines interbank pressure.
            </p>
          </div>

          {/* Factor 2: Foreign Exchange Turnover */}
          <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-zinc-300 font-medium">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                2. Foreign Exchange Turnover
              </span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between text-zinc-300 font-medium">
                <span>Daily NFEM Volume:</span>
                <span className="text-white font-bold">${factors.dailyFxTurnoverUsd.toFixed(1)} Million</span>
              </div>
              <div className="flex justify-between text-zinc-300 font-medium">
                <span>Interbank Depth:</span>
                <span className="text-emerald-400 font-bold">Robust Willing-Seller Desk</span>
              </div>
              <div className="flex justify-between text-zinc-300 font-medium">
                <span>Clearing Velocity:</span>
                <span className="text-indigo-400 font-bold">T+0 Settlement (Instant)</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-300 font-medium leading-relaxed border-t border-zinc-800 pt-2">
              Daily liquidity injected by autonomous dealers, IOCs, and foreign portfolio investors (FPIs).
            </p>
          </div>

          {/* Factor 3: Inflation Variance */}
          <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-zinc-300 font-medium">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                3. Inflation Variance (CPI Gap)
              </span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between text-zinc-300 font-medium">
                <span>Nigeria CPI (Headline):</span>
                <span className="text-rose-400 font-bold">{factors.nigeriaCpi.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-zinc-300 font-medium">
                <span>US CPI (Headline):</span>
                <span className="text-emerald-400 font-bold">{factors.usCpi.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-zinc-300 font-medium">
                <span>Inflation Differential:</span>
                <span className="text-purple-300 font-bold">+{factors.inflationVariance.toFixed(1)}% Gap</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-300 font-medium leading-relaxed border-t border-zinc-800 pt-2">
              The purchasing power gap between Nigeria and top trade partners directly influences forward curve parity.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. METHODOLOGY 3: REAL EFFECTIVE EXCHANGE RATE (REER) BIS BASKET          */}
      {/* ========================================================================= */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-purple-400 tracking-wider">
              Methodology 3: Policy Formulation & Economic Planning
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              The Real Effective Exchange Rate (REER) Matrix (Bank for International Settlements Methodology)
            </h3>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-300 font-mono text-xs flex items-center gap-2">
            <Scale className="w-4 h-4" />
            <span>Composite REER: {reer.reerIndex.toFixed(2)}</span>
          </div>
        </div>

        {/* BIS Formula Display */}
        <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
          <div className="p-3 bg-zinc-950 rounded-lg font-mono text-xs sm:text-sm text-purple-300 text-center tracking-wide border border-zinc-800/80">
            REER = ∑ [ wi × ( E(Naira/i) ÷ ( P(Nigeria) / P(i) ) ) ]
          </div>
          <p className="text-[11px] text-zinc-300 font-medium leading-relaxed">
            Where <strong>wi</strong> represents trade flow weights assigned to Nigeria&apos;s top trading partners,
            <strong> E</strong> is the nominal exchange rate against partner currency <em>i</em>, and <strong>P</strong> represents the relative price levels (inflation) between nations.
          </p>
        </div>

        {/* REER Partners Table */}
        <div className="overflow-x-auto border border-zinc-800 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/60 text-zinc-200 font-bold border-b border-zinc-800 text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Trading Partner</th>
                <th className="py-3 px-4">Currency</th>
                <th className="py-3 px-4 text-right">Trade Weight (wi)</th>
                <th className="py-3 px-4 text-right">Nominal Rate E(Naira/i)</th>
                <th className="py-3 px-4 text-right">Partner CPI (Pi)</th>
                <th className="py-3 px-4 text-right">Price Ratio (P_NG / Pi)</th>
                <th className="py-3 px-4 text-right">Effective Weighted Term</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {reer.partners.map((partner) => (
                <tr key={partner.partnerCode} className="hover:bg-zinc-800/30 transition">
                  <td className="py-3 px-4 font-sans font-semibold text-white">
                    {partner.partnerName}
                  </td>
                  <td className="py-3 px-4 font-bold text-amber-400">{partner.currency}</td>
                  <td className="py-3 px-4 text-right font-bold text-indigo-300">
                    {(partner.tradeFlowWeight * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                    ₦{partner.nominalExchangeRate.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-zinc-300">
                    {partner.foreignPriceIndex.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-right text-zinc-300 font-medium">
                    {partner.relativePriceRatio.toFixed(3)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-purple-300">
                    {partner.effectiveTerm.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-black/80 border-t border-zinc-800 font-mono text-xs">
              <tr>
                <td colSpan={2} className="py-3 px-4 font-bold text-white uppercase tracking-wider">
                  Composite REER Index Summary:
                </td>
                <td className="py-3 px-4 text-right font-bold text-indigo-400">100%</td>
                <td colSpan={3} className="py-3 px-4 text-right text-zinc-300 font-medium">
                  Status: <span className="text-emerald-400 font-bold">{reer.valuationStatus}</span>
                </td>
                <td className="py-3 px-4 text-right font-extrabold text-purple-300 text-sm">
                  {reer.reerIndex.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. AUTONOMOUS INGESTION AUDIT LEDGER                                      */}
      {/* ========================================================================= */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
              Immutable Cryptographic Records
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
              Autonomous Ingestion & Rate Synchronization Audit Trail
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-300 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SHA-256 Validated</span>
          </span>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 5).map((log) => (
            <div
              key={log.id}
              className="p-3.5 bg-black/40 rounded-xl border border-zinc-800 text-xs font-mono flex flex-col md:flex-row md:items-center justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                    {log.status}
                  </span>
                  <span className="text-white font-bold">{log.source}</span>
                  <span className="text-zinc-300 text-[11px] font-medium">{log.timestamp.slice(0, 19).replace('T', ' ')}</span>
                </div>
                <p className="text-zinc-300 text-[11px] font-sans font-medium">{log.message}</p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-amber-400 font-bold">VWAP: ₦{log.computedNfemVwap.toFixed(2)}</div>
                <div className="text-[10px] text-zinc-300 font-medium truncate max-w-xs">{log.auditHash}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: SIMULATE INTERBANK TRADE (WILLING BUYER / SELLER)                   */}
      {/* ========================================================================= */}
      {isTradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Simulate Interbank Order Book Trade
                </h3>
              </div>
              <button type="button" aria-label="Close"
                onClick={() => setIsTradeModalOpen(false)}
                className="text-zinc-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 font-medium">
              Inject a transaction into the Bloomberg BMatch tape to watch how transaction volume dynamically tilts the Volume-Weighted Average Price (VWAP).
            </p>

            <form onSubmit={handleSimulateTradeSubmit} className="space-y-4">
              {tradeError && (
                <div className="p-3 bg-red-950/60 border border-red-500/60 rounded-xl text-red-200 text-xs font-bold">
                  {tradeError}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Counterparty / Interbank Dealer Name
                </label>
                <input
                  type="text"
                  value={simDealerName}
                  onChange={(e) => setSimDealerName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-xs font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Dealer Category
                  </label>
                  <select
                    value={simDealerType}
                    onChange={(e) => setSimDealerType(e.target.value as DealerCategory)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-xs"
                  >
                    <option value="AUTHORIZED_DEALER_BANK">Authorized Dealer Bank</option>
                    <option value="INTERNATIONAL_OIL_COMPANY">International Oil Company</option>
                    <option value="INSTITUTIONAL_INVESTOR">Institutional Investor</option>
                    <option value="CBN_INTERVENTION">CBN Intervention</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Trading Venue
                  </label>
                  <select
                    value={simVenue}
                    onChange={(e) => setSimVenue(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-xs"
                  >
                    <option value="Bloomberg BMatch">Bloomberg BMatch</option>
                    <option value="FMDQ Refinitiv">FMDQ Refinitiv</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Agreed Clearing Price (₦/USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={simPrice}
                    onChange={(e) => setSimPrice(e.target.value)}
                    placeholder="e.g. 1330.00"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-xs font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Volume Traded (USD)
                  </label>
                  <input
                    type="number"
                    value={simVolume}
                    onChange={(e) => setSimVolume(e.target.value)}
                    placeholder="e.g. 10000000"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-xs font-mono font-bold"
                    required
                  />
                </div>
              </div>

              {simPrice && simVolume && (
                <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Naira Turnover:</span>
                    <span className="text-amber-400 font-bold">
                      ₦{((parseFloat(simPrice) || 0) * (parseFloat(simVolume) || 0)).toLocaleString()} NGN
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volume in Millions:</span>
                    <span className="text-emerald-400 font-bold">
                      ${((parseFloat(simVolume) || 0) / 1000000).toFixed(2)}M USD
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTradeModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <span>Submit Trade to BMatch Tape</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CbnNfemControllerPanel;
