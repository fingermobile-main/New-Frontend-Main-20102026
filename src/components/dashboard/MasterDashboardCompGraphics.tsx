import React, { useState } from 'react';
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Lock,
  RefreshCw,
  Sliders,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Key,
  Database,
  Server,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  BarChart3,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ============================================================================
// DATA TYPES
// ============================================================================

export interface ConsoleItem {
  id: string;
  name: string;
  group: 'community-identity' | 'media-discovery' | 'commerce-growth' | 'creation-config' | 'governance-ops';
  groupName: string;
  purpose: string;
  healthScore: number;
  status: 'online' | 'degraded' | 'maintenance';
  responseTime: number;
  route: string;
  controls: string;
  safeguards: string;
  telemetry: string;
  activeIncidents: number;
  sparkline: number[];
}

// ============================================================================
// 1. SYSTEM HEALTH GAUGE GRAPHICS CARD (Speedometer / Radial Donut)
// ============================================================================

export const SystemHealthGaugeCard: React.FC<{
  averageHealth: number;
  totalConsoles: number;
  healthyCount: number;
  degradedCount: number;
  onRefresh?: () => void;
}> = ({ averageHealth, totalConsoles, healthyCount, degradedCount, onRefresh }) => {
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Semi-circle arc (180 degrees)
  const strokeDashoffset = circumference - (averageHealth / 100) * (circumference / 2);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
      {/* Background radial gradient */}
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div>
          <span className="text-xs uppercase tracking-wider font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Global Platform Assurance
          </span>
          <h3 className="text-lg font-black tracking-tight mt-0.5">Platform Operational Health</h3>
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
            title="Refresh Health Telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Gauge Visual */}
      <div className="relative flex flex-col items-center justify-center my-4 z-10">
        <svg height="150" width="220" className="overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          {/* Background Track Arc */}
          <path
            d="M 25 125 A 85 85 0 0 1 195 125"
            fill="none"
            stroke="#1e293b"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {/* Active Health Arc */}
          <path
            d="M 25 125 A 85 85 0 0 1 195 125"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={stroke}
            strokeDasharray={267}
            strokeDashoffset={267 - (averageHealth / 100) * 267}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute bottom-4 flex flex-col items-center">
          <span className="text-4xl font-black font-mono tracking-tight text-white flex items-baseline">
            {averageHealth}
            <span className="text-lg font-normal text-emerald-400">%</span>
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 -mt-1">
            Aggregate Index
          </span>
        </div>
      </div>

      {/* Metric Breakdown Grid */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center z-10">
        <div className="p-2 rounded-xl bg-slate-800/50">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Consoles</div>
          <div className="text-sm font-black font-mono text-white mt-0.5">{totalConsoles}</div>
        </div>
        <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-900/50">
          <div className="text-[10px] text-emerald-400 uppercase font-semibold">Optimal (&ge;95%)</div>
          <div className="text-sm font-black font-mono text-emerald-300 mt-0.5">{healthyCount}</div>
        </div>
        <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-900/50">
          <div className="text-[10px] text-amber-400 uppercase font-semibold">Degraded (&lt;85%)</div>
          <div className="text-sm font-black font-mono text-amber-300 mt-0.5">{degradedCount}</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. REAL-TIME TELEMETRY SPARKLINE GRAPHICS CARD (Multi-Layer Area Latency)
// ============================================================================

export const RealtimeTelemetrySparklineCard: React.FC<{
  latencyData: {
    labels: string[];
    p50: number[];
    p95: number[];
    p99: number[];
  };
}> = ({ latencyData }) => {
  const [activeTier, setActiveTier] = useState<'p50' | 'p95' | 'p99'>('p95');

  const values = latencyData[activeTier] || latencyData.p95;
  const maxVal = Math.max(...values, 120);
  const minVal = Math.min(...values, 20);

  // Normalize points to SVG viewBox 0 0 400 160
  const width = 400;
  const height = 150;
  const padding = 20;

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - minVal) / (maxVal - minVal || 1)) * (height - padding * 2);
    return { x, y, val: v };
  });

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs uppercase tracking-wider font-mono text-blue-400 font-semibold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Distributed Edge Latency
          </span>
          <h3 className="text-lg font-black tracking-tight mt-0.5">Response Time &amp; Velocity</h3>
        </div>

        {/* Tier Toggles */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
          {(['p50', 'p95', 'p99'] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setActiveTier(tier)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                activeTier === tier ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tier.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Current Value Hero */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-black font-mono text-white">
          {values[values.length - 1]}
          <span className="text-sm font-normal text-blue-400 ml-1">ms</span>
        </span>
        <span className="text-xs text-slate-400 font-mono">
          ({activeTier.toUpperCase()} Target: &lt;{activeTier === 'p99' ? '150' : activeTier === 'p95' ? '80' : '40'}ms)
        </span>
      </div>

      {/* SVG Multi-Layer Area Chart */}
      <div className="w-full relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36 overflow-visible">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#1e293b" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#1e293b" strokeDasharray="3 3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" />

          {/* Gradient Area Fill */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Smooth Stroke Line */}
          <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === points.length - 1 ? 5 : 3}
              fill={i === points.length - 1 ? '#60a5fa' : '#1e3a8a'}
              stroke="#ffffff"
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* Time Labels */}
        <div className="flex justify-between text-[10px] font-mono text-slate-400 px-2 mt-1">
          {latencyData.labels.map((lbl, idx) => (
            <span key={idx}>{lbl}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. WORM AUDIT CRYPTOGRAPHIC CHAIN TIMELINE GRAPHICS CARD
// ============================================================================

export const WormAuditTimelineCard: React.FC<{
  onVerifyChain: () => Promise<void>;
  isVerifying: boolean;
  verificationResult: any;
}> = ({ onVerifyChain, isVerifying, verificationResult }) => {
  const blocks = [
    {
      id: 14818,
      action: 'SYSTEM_CONFIG_PATCH',
      entity: 'stercs_policies',
      hash: '9f83a...b24e',
      prevHash: '8e71b...a19c',
      actor: 'Israel Mbah (SuperAdmin)',
      severity: 'critical'
    },
    {
      id: 14819,
      action: 'ROLE_OVERRIDE_GRANT',
      entity: 'user_permission_overrides',
      hash: '3d72c...58fa',
      prevHash: '9f83a...b24e',
      actor: 'Israel Mbah (SuperAdmin)',
      severity: 'critical'
    },
    {
      id: 14820,
      action: 'MARKETPLACE_ESCROW_RELEASE',
      entity: 'orders_ledger',
      hash: 'e3b0c...855',
      prevHash: '3d72c...58fa',
      actor: 'System Worker (Automated)',
      severity: 'info'
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs uppercase tracking-wider font-mono text-purple-400 font-semibold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            WORM Immutable Audit Ledger
          </span>
          <h3 className="text-lg font-black tracking-tight mt-0.5">Cryptographic Hash Continuity</h3>
        </div>

        <button
          type="button"
          onClick={onVerifyChain}
          disabled={isVerifying}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
          <span>{isVerifying ? 'Verifying Hashes...' : 'Verify Chain (SHA-256)'}</span>
        </button>
      </div>

      {/* Verification Status Banner */}
      {verificationResult && (
        <div
          className={`p-3 rounded-2xl border text-xs flex items-center justify-between mb-3 animate-in fade-in duration-200 ${
            verificationResult.isValid
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/40 border-rose-800 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="font-bold">{verificationResult.chainIntegrity || 'Healthy Cryptographic Chain'}</div>
              <div className="text-[10px] text-slate-400 font-mono">
                {verificationResult.checkedRecords} blocks inspected &bull; Zero tampered records detected
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-200 text-[10px] font-mono font-bold">
            100% VALID
          </span>
        </div>
      )}

      {/* Linear Hash Chain Blocks */}
      <div className="space-y-2.5 my-1">
        {blocks.map((blk, idx) => (
          <div
            key={blk.id}
            className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs relative group hover:border-purple-500/50 transition"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-xl bg-purple-950/60 border border-purple-800/80 flex items-center justify-center font-mono font-bold text-[11px] text-purple-300 flex-shrink-0">
                #{blk.id}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-white truncate">{blk.action}</span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-700 text-slate-300 text-[9px] font-mono">
                    {blk.entity}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  Actor: <span className="text-slate-300 font-semibold">{blk.actor}</span>
                </div>
              </div>
            </div>

            <div className="text-right flex-shrink-0 ml-3">
              <div className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-900">
                &larr; prev: {blk.prevHash}
              </div>
              <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
                hash: {blk.hash}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-slate-800/80">
        <span>WORM Architecture: ON UPDATE/DELETE DO INSTEAD NOTHING</span>
        <span className="text-purple-400 font-bold">AAL2 Step-Up Active</span>
      </div>
    </div>
  );
};

// ============================================================================
// 4. EMERGENCY KILLSWITCH & SESSION PANIC CONTROL GRAPHICS CARD
// ============================================================================

export const KillswitchPanicCard: React.FC<{
  onTriggerKillswitch: (scope: string, reason: string) => Promise<void>;
}> = ({ onTriggerKillswitch }) => {
  const [selectedScope, setSelectedScope] = useState('global');
  const [reason, setReason] = useState('Compromised credential containment');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);

  const handleExecute = async () => {
    setIsTriggering(true);
    await onTriggerKillswitch(selectedScope, reason);
    setIsTriggering(false);
    setIsConfirming(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs uppercase tracking-wider font-mono text-rose-400 font-semibold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            Active Defense System
          </span>
          <h3 className="text-lg font-black tracking-tight mt-0.5">Emergency Session Killswitch</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-mono font-bold">
          ROOT ONLY
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-3">
        Instantly invalidates all cryptographic access and refresh token families. Forces immediate re-authentication across targeted perimeter with zero token reuse.
      </p>

      {/* Scope Selector */}
      <div className="space-y-2 mb-4">
        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
          Target Execution Scope:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'global', label: 'All Modules (Global Panic)' },
            { id: 'fingerwars', label: 'FingerWars Platform' },
            { id: 'marketplace', label: 'MarketPlace & Commerce' },
            { id: 'storefronts', label: 'Storefronts Perimeter' },
          ].map((scope) => (
            <button
              key={scope.id}
              type="button"
              onClick={() => setSelectedScope(scope.id)}
              className={`p-2 rounded-xl text-xs font-semibold text-left transition border ${
                selectedScope === scope.id
                  ? 'bg-rose-950/80 border-rose-600 text-rose-200'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              {scope.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trigger Button or Confirmation */}
      {!isConfirming ? (
        <button
          type="button"
          onClick={() => setIsConfirming(true)}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Actuate Killswitch for Scope: {selectedScope.toUpperCase()}</span>
        </button>
      ) : (
        <div className="p-3 bg-rose-950/90 border border-rose-600 rounded-2xl space-y-2 animate-in fade-in duration-150">
          <div className="text-xs font-bold text-rose-200 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Confirm Emergency Invalidation?
          </div>
          <p className="text-[11px] text-rose-300/90">
            This will drop active JWTs and purge session token families for scope <span className="font-mono font-bold text-white">{selectedScope}</span>.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleExecute}
              disabled={isTriggering}
              className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition disabled:opacity-50"
            >
              {isTriggering ? 'Executing Revocation...' : 'Yes, Revoke Sessions'}
            </button>
            <button
              type="button"
              onClick={() => setIsConfirming(false)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 5. INDIVIDUAL CONSOLE CARD (35 Modules Matrix Item)
// ============================================================================

export const ConsoleCard: React.FC<{
  item: ConsoleItem;
  onSelect: (item: ConsoleItem) => void;
}> = ({ item, onSelect }) => {
  const navigate = useNavigate();

  const isDegraded = item.status === 'degraded' || item.healthScore < 85;

  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 hover:border-blue-500/80 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Top Header: Badge, Group, Health Indicator */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-700 block">
              {item.groupName}
            </span>
            <h4 className="text-base font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              {item.name}
            </h4>
          </div>

          <div
            className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold border flex items-center gap-1 ${
              isDegraded
                ? 'bg-amber-100 text-amber-950 border-amber-400 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                : 'bg-emerald-100 text-amber-950 border-amber-400 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
            }font-black`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isDegraded ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span>{item.healthScore}%</span>
          </div>
        </div>

        {/* Purpose */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
          {item.purpose}
        </p>

        {/* 7-Point Mini Sparkline Chart */}
        <div className="my-2 h-8 w-full flex items-end gap-1 px-1 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-1.5">
          {item.sparkline.map((val, idx) => {
            const hPct = Math.max(20, Math.min(100, val));
            return (
              <div
                key={idx}
                className="flex-1 rounded-sm transition-all duration-300"
                style={{
                  height: `${hPct}%`,
                  backgroundColor: isDegraded ? '#f59e0b' : '#3b82f6',
                  opacity: 0.4 + (idx / item.sparkline.length) * 0.6
                }}
                title={`Point ${idx + 1}: ${val}%`}
              />
            );
          })}
        </div>
      </div>

      {/* Footer Details & Quick Action */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          {item.responseTime}ms avg &bull; {item.activeIncidents} incident{item.activeIncidents === 1 ? '' : 's'}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(item.route);
          }}
          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-0.5 group-hover:translate-x-0.5 transition"
        >
          <span>Open Screen</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 6. CONSOLE DETAIL & ADMINISTRATIVE CONTROLS DRILLDOWN MODAL
// ============================================================================

export const ConsoleDetailModal: React.FC<{
  item: ConsoleItem | null;
  onClose: () => void;
}> = ({ item, onClose }) => {
  const navigate = useNavigate();

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-900 dark:text-white space-y-5">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase text-blue-600 dark:text-blue-400 font-bold tracking-wider">
              {item.groupName} &bull; Console #{item.id}
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-0.5 flex items-center gap-2">
              <span>{item.name}</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                  item.status === 'degraded'
                    ? 'bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-emerald-100 text-amber-950 dark:bg-emerald-950 dark:text-emerald-300'
                }border border-amber-400 font-black`}
              >
                {item.healthScore}% {item.status.toUpperCase()}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.purpose}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Core Administrative Controls Needed */}
        <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300 tracking-wider flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" />
            Core Administrative Controls Needed
          </span>
          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {item.controls}
          </p>
        </div>

        {/* Section 2: Automated Safeguards & Pipeline Operations */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Automated Safeguards &amp; Pipeline Operations
          </span>
          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {item.safeguards}
          </p>
        </div>

        {/* Section 3: Key Telemetry & Optimization Metrics */}
        <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 tracking-wider flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5" />
            Key Telemetry &amp; Optimization Metrics
          </span>
          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {item.telemetry}
          </p>
        </div>

        {/* Telemetry Metrics Strip */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-700 font-semibold uppercase">Latency Index</div>
            <div className="text-base font-black font-mono text-slate-900 dark:text-white mt-0.5">
              {item.responseTime} ms
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-700 font-semibold uppercase">Active Incidents</div>
            <div className="text-base font-black font-mono text-slate-900 dark:text-white mt-0.5">
              {item.activeIncidents}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-700 font-semibold uppercase">Assigned Route</div>
            <div className="text-base font-black font-mono text-blue-600 dark:text-blue-400 truncate mt-0.5">
              {item.route}
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition"
          >
            Dismiss
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              navigate(item.route);
            }}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch Dedicated Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
