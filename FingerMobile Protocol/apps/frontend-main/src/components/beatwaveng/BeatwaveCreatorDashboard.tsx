import React, { useState, useEffect } from 'react';

interface TaxSummaryData {
  creatorId: string;
  totalPoPPulses: number;
  totalGemsEarned: number;
  grossEarningsNGN: number;
  cybersecurityLevyDeducted: number;
  cybersecurityLevyPercentage: string;
  isSmallBusinessExempt: boolean;
  citRateApplied: string;
  pitReliefUtilized: number;
  pitReliefThreshold: number;
  withholdingEscrow: number;
  netPayout: number;
  complianceYear: string;
}

export const BeatwaveCreatorDashboard: React.FC = () => {
  const [taxData, setTaxData] = useState<TaxSummaryData | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamSeconds, setStreamSeconds] = useState(0);
  const [currentGems, setCurrentGems] = useState(140.5);
  const [pulseCount, setPulseCount] = useState(1405);

  const creatorId = 'a0000000-0000-0000-0000-000000000001';

  useEffect(() => {
    const fetchTaxSummary = async () => {
      try {
        const res = await fetch(`/api/v1/vault/beatwave/tax/summary/${creatorId}`);
        if (res.ok) {
          const json = await res.json();
          setTaxData(json.data);
        }
      } catch (err) {
        // Fallback
      }
    };

    fetchTaxSummary();
  }, [creatorId]);

  // Stream heartbeat pulse simulation
  useEffect(() => {
    let timer: any = null;
    if (isStreaming) {
      timer = setInterval(() => {
        setStreamSeconds((prev) => {
          const nextSec = prev + 1;
          if (nextSec % 30 === 0) {
            // Pulse triggered
            setCurrentGems((g) => parseFloat((g + 0.1).toFixed(2)));
            setPulseCount((c) => c + 1);
          }
          return nextSec;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isStreaming]);

  return (
    <div className="space-y-6 text-white max-w-5xl mx-auto p-4">
      {/* Top Banner: Proof of Play Heartbeat Live Meter */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🎵</span>
              <h2 className="text-xl font-black text-white">BeatwaveNG™ Proof of Play (PoP) Engine</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                Off-Chain Pulse Verified
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Streams mint <strong>0.1 Gems every 30 seconds</strong> of active, unmuted playback with anti-bot cryptographic validation.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-lg ${
                isStreaming
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110'
              }`}
            >
              {isStreaming ? '⏹ Stop PoP Stream' : '▶ Start Listening / Stream'}
            </button>
          </div>
        </div>

        {/* Live Pulse Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Stream Status</p>
            <p className={`text-sm font-black mt-1 ${isStreaming ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isStreaming ? `Active (${streamSeconds}s)` : 'Idle'}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">PoP Pulses</p>
            <p className="text-sm font-black text-amber-400 mt-1 font-mono">{pulseCount}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Minted Gems</p>
            <p className="text-sm font-black text-amber-400 mt-1 font-mono">💎 {currentGems.toFixed(1)}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Pulse Velocity</p>
            <p className="text-sm font-black text-indigo-400 mt-1">0.1 Gems / 30s</p>
          </div>
        </div>
      </div>

      {/* 2026 Fiscal Tax-Shield Ledger Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>⚖️</span> 2026 Nigeria Tax Act & Statutory Shield
            </h3>
            <p className="text-xs text-slate-300">
              Automated statutory deductions with 0% CIT threshold protection and transparent withholding escrow.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">
            {taxData?.complianceYear || '2026 Fiscal Year'}
          </span>
        </div>

        {/* 3 Metric Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <p className="text-xs text-slate-300 font-bold">Cybersecurity Levy (Statutory)</p>
            <p className="text-xl font-black text-amber-400 mt-1">
              0.005% <span className="text-xs font-normal text-slate-300">(Cybercrimes Act 2024)</span>
            </p>
            <p className="text-[11px] text-slate-300 mt-2">
              Deducted into national cybersecurity escrow automatically.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <p className="text-xs text-slate-300 font-bold">Corporate Income Tax (CIT)</p>
            <p className="text-xl font-black text-emerald-400 mt-1">
              0.0% <span className="text-xs font-normal text-slate-300">(&lt; ₦50M turnover)</span>
            </p>
            <p className="text-[11px] text-slate-300 mt-2">
              Micro/Small business creator exemption fully applied.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <p className="text-xs text-slate-300 font-bold">Personal Relief Exemption</p>
            <p className="text-xl font-black text-indigo-400 mt-1">
              ₦800,000 <span className="text-xs font-normal text-slate-300">Tax-Free Allowance</span>
            </p>
            <p className="text-[11px] text-slate-300 mt-2">
              Earnings up to ₦800,000 exempt from personal income tax.
            </p>
          </div>
        </div>

        {/* Financial Transparency Distribution Bar */}
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-3">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Gross Proof of Play Value:</span>
            <span className="font-mono font-bold text-white">₦{(currentGems * 100).toLocaleString()}.00 NGN</span>
          </div>
          <div className="flex justify-between text-xs text-slate-300">
            <span>Cybersecurity Levy (0.005%):</span>
            <span className="font-mono font-bold text-rose-400">-₦{((currentGems * 100) * 0.00005).toFixed(2)} NGN</span>
          </div>
          <div className="flex justify-between text-xs text-slate-300">
            <span>CIT Deduction (&lt;₦50M turnover):</span>
            <span className="font-mono font-bold text-emerald-400">₦0.00 (Exempt)</span>
          </div>
          <div className="flex justify-between text-sm text-slate-200 pt-3 border-t border-slate-700">
            <span className="font-black">Net Creator Payout ($P_net$):</span>
            <span className="font-mono font-black text-amber-400 text-base">
              ₦{((currentGems * 100) - ((currentGems * 100) * 0.00005)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NGN
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeatwaveCreatorDashboard;
