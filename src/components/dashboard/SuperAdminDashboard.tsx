import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Activity,
  Server,
  Key,
  RefreshCw,
  Power,
  Sliders,
  CheckCircle,
  Database,
  Lock,
  Globe,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import PlatformOwnershipCard from './PlatformOwnershipCard';

interface SentinelNode {
  id: string;
  name: string;
  region: string;
  ip: string;
  status: 'ONLINE' | 'SYNCING' | 'MAINTENANCE';
  latency: string;
  version: string;
  quorumWeight: string;
}

interface SuperAdminAudit {
  id: string;
  timestamp: string;
  action: string;
  initiator: string;
  enclaveProof: string;
  status: 'VERIFIED' | 'PENDING' | 'FLAGGED';
}

const SuperAdminDashboard: React.FC = () => {
  // Protocol Master Governance State
  const [circuitBreakerActive, setCircuitBreakerActive] = useState(false);
  const [gasSubsidyRatio, setGasSubsidyRatio] = useState('75%');
  const [quorumThreshold, setQuorumThreshold] = useState('67% (2/3 Quorum)');
  const [selectedCluster, setSelectedCluster] = useState('Global Sovereign Mainnet');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sentinel Nodes
  const [nodes, setNodes] = useState<SentinelNode[]>([
    {
      id: 'NODE-001',
      name: 'Lagos Enclave Master Alpha',
      region: 'West Africa (NG-LOS)',
      ip: '102.89.44.12',
      status: 'ONLINE',
      latency: '24ms',
      version: 'v3.2.0-secure',
      quorumWeight: '18.5%'
    },
    {
      id: 'NODE-002',
      name: 'Frankfurt Sovereign Vault',
      region: 'Europe Central (DE-FRA)',
      ip: '194.25.10.88',
      status: 'ONLINE',
      latency: '68ms',
      version: 'v3.2.0-secure',
      quorumWeight: '22.0%'
    },
    {
      id: 'NODE-003',
      name: 'Nairobi Relay Cluster',
      region: 'East Africa (KE-NBO)',
      ip: '197.237.91.4',
      status: 'ONLINE',
      latency: '42ms',
      version: 'v3.2.0-secure',
      quorumWeight: '14.0%'
    },
    {
      id: 'NODE-004',
      name: 'London Sovereign Backup',
      region: 'UK & Global (GB-LON)',
      ip: '185.12.33.201',
      status: 'SYNCING',
      latency: '55ms',
      version: 'v3.2.0-rc1',
      quorumWeight: '15.5%'
    },
    {
      id: 'NODE-005',
      name: 'Johannesburg Sentinel',
      region: 'Southern Africa (ZA-JNB)',
      ip: '196.25.1.18',
      status: 'ONLINE',
      latency: '51ms',
      version: 'v3.2.0-secure',
      quorumWeight: '16.0%'
    }
  ]);

  // Cryptographic Audit Trail
  const [auditTrail, setAuditTrail] = useState<SuperAdminAudit[]>([
    {
      id: 'AUDIT-8941',
      timestamp: '2026-10-21 00:32:10 UTC',
      action: 'Rotated Secondary Validator Key Ring',
      initiator: 'superadmin_chidi (Multi-Sig 3/4)',
      enclaveProof: '0x8f2a...91b4c7',
      status: 'VERIFIED'
    },
    {
      id: 'AUDIT-8940',
      timestamp: '2026-10-20 22:15:48 UTC',
      action: 'Updated Gas Subsidy Parameter to 75%',
      initiator: 'gov_council_quorum (Consensus)',
      enclaveProof: '0x4e1c...77a3d2',
      status: 'VERIFIED'
    },
    {
      id: 'AUDIT-8939',
      timestamp: '2026-10-20 18:40:12 UTC',
      action: 'Automated Biometric Sentinel Heartbeat Check',
      initiator: 'STERCS_SENTINEL_DAEMON',
      enclaveProof: '0x11b9...ff84a1',
      status: 'VERIFIED'
    },
    {
      id: 'AUDIT-8938',
      timestamp: '2026-10-20 14:02:30 UTC',
      action: 'Dispute Settlement Safe Escrow Liquidity Injection',
      initiator: 'treasury_multisig_agent',
      enclaveProof: '0x99dd...02b5e6',
      status: 'VERIFIED'
    }
  ]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showNotification('Telemetry synchronised with hardware-attested enclave nodes.');
    }, 600);
  };

  const handleToggleCircuitBreaker = () => {
    const nextState = !circuitBreakerActive;
    setCircuitBreakerActive(nextState);
    const newAudit: SuperAdminAudit = {
      id: `AUDIT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      action: nextState ? 'TRIPPED EMERGENCY PROTOCOL CIRCUIT BREAKER' : 'Restored Normal Transaction Flow',
      initiator: 'superadmin_console',
      enclaveProof: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 8)}`,
      status: 'VERIFIED'
    };
    setAuditTrail(prev => [newAudit, ...prev]);
    showNotification(
      nextState
        ? '⚠️ EMERGENCY CIRCUIT BREAKER ENGAGED. High-value cross-chain transactions paused.'
        : '✓ Circuit breaker cleared. Protocol operating at full throughput.'
    );
  };

  const handleTriggerKeyRotation = () => {
    const newAudit: SuperAdminAudit = {
      id: `AUDIT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      action: 'Initiated Multi-Sig Cryptographic Master Key Rotation Ceremony',
      initiator: 'superadmin_manual_trigger',
      enclaveProof: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 8)}`,
      status: 'VERIFIED'
    };
    setAuditTrail(prev => [newAudit, ...prev]);
    showNotification('Key rotation ceremony broadcast to 5 validator signer enclaves.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-bounce">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mandatory Platform Ownership Card */}
      <PlatformOwnershipCard />

      {/* Super Admin Sovereign Header */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 text-purple-950 border border-purple-400 rounded-xl font-black">
              <ShieldCheck className="h-7 w-7 text-purple-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900">
                  Super Admin Sovereign Mission Control
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-950 border border-purple-400">
                  ROOT PRIVILEGES
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  ENCLAVE ATTESTED
                </span>
              </div>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">
                Hardware-isolated consensus control, cryptographic key rotation, and emergency circuit breakers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <select
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
              className="px-3 py-2 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="Global Sovereign Mainnet">Global Sovereign Mainnet</option>
              <option value="Regional Failover Enclave">Regional Failover Enclave</option>
              <option value="Staging Testnet Alpha">Staging Testnet Alpha</option>
            </select>
            <button
              type="button"
              onClick={handleRefreshTelemetry}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-700' : 'text-slate-600'}`} />
              Sync Telemetry
            </button>
            <button
              type="button"
              onClick={handleToggleCircuitBreaker}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors shadow-sm ${
                circuitBreakerActive
                  ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-700 animate-pulse'
                  : 'bg-rose-100 hover:bg-rose-200 text-rose-950 border-rose-400'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              {circuitBreakerActive ? 'CIRCUIT BREAKER ENGAGED' : 'Trip Circuit Breaker'}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Sovereign Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Escrow & Liquidity Reserve */}
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-5">
          <div className="flex items-center justify-between text-xs text-slate-700 font-bold mb-1">
            <span className="uppercase tracking-wider">Total Liquidity Reserve</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
              +3.4% 24h
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">$48,920,400</div>
          <p className="text-xs text-slate-700 font-medium mt-1">
            Dispute settlement & franchise escrow
          </p>
        </div>

        {/* Card 2: Consensus Quorum */}
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-5">
          <div className="flex items-center justify-between text-xs text-slate-700 font-bold mb-1">
            <span className="uppercase tracking-wider">Staking Rate & Quorum</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-950 border border-blue-400">
              OPTIMAL
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">84.2% (64/64)</div>
          <p className="text-xs text-slate-700 font-medium mt-1">
            Active multi-sig consensus signers
          </p>
        </div>

        {/* Card 3: Sentinel Health */}
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-5">
          <div className="flex items-center justify-between text-xs text-slate-700 font-bold mb-1">
            <span className="uppercase tracking-wider">Sentinel Enclave Uptime</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
              99.98%
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">0 Breaches</div>
          <p className="text-xs text-slate-700 font-medium mt-1">
            TEE biometric hardware verified
          </p>
        </div>

        {/* Card 4: Settlement Velocity */}
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-5">
          <div className="flex items-center justify-between text-xs text-slate-700 font-bold mb-1">
            <span className="uppercase tracking-wider">Settlement Latency</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-950 border border-purple-400">
              740ms
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">2,840 tx/min</div>
          <p className="text-xs text-slate-700 font-medium mt-1">
            P2P trade execution throughput
          </p>
        </div>
      </div>

      {/* Protocol Parameters & Sentinel Mission Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Protocol Sovereign Control Center */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-700" />
              Sovereign Governance Switches
            </h3>
            <p className="text-xs text-slate-700 font-semibold mt-0.5">
              Live runtime parameters applied to all validator nodes
            </p>
          </div>

          {/* Gas Subsidy Ratio */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Network Gas Subsidy Ratio
            </label>
            <select
              value={gasSubsidyRatio}
              onChange={(e) => {
                setGasSubsidyRatio(e.target.value);
                showNotification(`Gas subsidy ratio updated to ${e.target.value}`);
              }}
              className="w-full px-3 py-2 bg-white text-slate-900 font-bold border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="50%">50% Subsidized (Standard Congestion)</option>
              <option value="75%">75% Subsidized (Protocol Baseline)</option>
              <option value="100%">100% Zero-Gas (Community Promo)</option>
            </select>
            <p className="text-[11px] text-slate-700 font-medium">Reimbursed directly from Protocol DAO Liquidity Pool</p>
          </div>

          {/* Validator Quorum Threshold */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Validator Quorum Threshold
            </label>
            <select
              value={quorumThreshold}
              onChange={(e) => {
                setQuorumThreshold(e.target.value);
                showNotification(`Consensus threshold updated to ${e.target.value}`);
              }}
              className="w-full px-3 py-2 bg-white text-slate-900 font-bold border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="60% (Simple Majority)">60% (Simple Majority)</option>
              <option value="67% (2/3 Quorum)">67% (2/3 Super-Majority - Recommended)</option>
              <option value="80% (High Security)">80% (Strict High Security)</option>
            </select>
          </div>

          {/* Key Rotation Ceremony */}
          <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-purple-700" />
                Multi-Sig Key Enclave
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-400">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              Next scheduled key rotation ceremony in 14 days (Epoch 482).
            </p>
            <button
              type="button"
              onClick={handleTriggerKeyRotation}
              className="w-full py-2 px-3 text-xs font-bold text-purple-950 bg-purple-100 hover:bg-purple-200 border border-purple-400 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Trigger Out-of-Band Key Rotation
            </button>
          </div>

          {/* Emergency Safe Mode */}
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                Maintenance Mode
              </span>
              <button
                type="button"
                onClick={() => {
                  setMaintenanceMode(!maintenanceMode);
                  showNotification(`Maintenance mode ${!maintenanceMode ? 'ENABLED' : 'DISABLED'}`);
                }}
                className={`text-xs font-bold px-3 py-1 rounded border transition-colors ${
                  maintenanceMode
                    ? 'bg-amber-600 text-white border-amber-700'
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {maintenanceMode ? 'ACTIVE' : 'INACTIVE'}
              </button>
            </div>
            <p className="text-[11px] text-amber-900 font-medium">
              Restricts user writes to read-only during database schema upgrades.
            </p>
          </div>
        </div>

        {/* Right 2 Columns: Enclave Sentinel Nodes Table & Audit Trail */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sentinel Nodes Roster */}
          <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-600" />
                  Hardware-Attested Sentinel Enclave Nodes
                </h3>
                <p className="text-xs text-slate-700 font-semibold mt-0.5">
                  Distributed physical validator infrastructure across primary regional hubs
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                5 / 5 OPERATIONAL
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-left font-bold text-slate-800 uppercase tracking-wider">Node & Enclave</th>
                    <th className="px-5 py-3 text-left font-bold text-slate-800 uppercase tracking-wider">Region</th>
                    <th className="px-5 py-3 text-left font-bold text-slate-800 uppercase tracking-wider">Latency</th>
                    <th className="px-5 py-3 text-left font-bold text-slate-800 uppercase tracking-wider">Weight</th>
                    <th className="px-5 py-3 text-right font-bold text-slate-800 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {nodes.map((node) => (
                    <tr key={node.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{node.name}</div>
                        <div className="text-[11px] text-slate-700 font-mono">{node.id} • {node.ip}</div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-800 font-semibold">
                        {node.region}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {node.latency}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-800 font-bold">
                        {node.quorumWeight}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          node.status === 'ONLINE'
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                            : 'bg-amber-100 text-amber-950 border border-amber-400'
                        }`}>
                          {node.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cryptographic Super Admin Audit Trail */}
          <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-700" />
                  Live Cryptographic Audit Trail
                </h3>
                <p className="text-xs text-slate-700 font-semibold mt-0.5">
                  Append-only immutable record of all root administrative dispatches
                </p>
              </div>
              <span className="text-xs text-slate-700 font-bold">
                {auditTrail.length} Logged Entries
              </span>
            </div>

            <div className="divide-y divide-slate-200">
              {auditTrail.map((entry) => (
                <div key={entry.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{entry.action}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                        {entry.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-semibold">
                      Triggered by: <span className="font-bold text-slate-900">{entry.initiator}</span>
                    </p>
                    <p className="text-[10px] text-slate-600 font-mono">
                      Enclave Hash: {entry.enclaveProof}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-600 font-mono whitespace-nowrap">
                    {entry.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
