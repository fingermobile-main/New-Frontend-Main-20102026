import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  ShieldAlert,
  KeyRound,
  Download,
  RefreshCw,
  ArrowLeft,
  Mail,
  UserX,
  UserCheck,
  Clock,
  Activity,
  Layers,
  Zap,
  CheckCircle2,
  Lock,
  FileSpreadsheet
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

interface ContactRecord {
  id: string;
  sourceUser: {
    id: string;
    username: string;
    avatarInitials: string;
    email: string;
  };
  targetUser: {
    id: string;
    username: string;
    avatarInitials: string;
    email: string;
  };
  relationship: 'mutual' | 'pending' | 'blocked' | 'opted_out';
  mutualPinStatus: 'verified' | 'unverified' | 'reset_requested';
  lastInteracted: string;
  messageCount: number;
  encryptionKeyVersion: string;
}

const INITIAL_CONTACTS: ContactRecord[] = [
  {
    id: 'CNT-10921',
    sourceUser: { id: 'usr-001', username: 'kemi_ade', avatarInitials: 'KA', email: 'kemi@fingermobileprotocol.com' },
    targetUser: { id: 'usr-044', username: 'tunde_dev', avatarInitials: 'TD', email: 'tunde@fingermobileprotocol.com' },
    relationship: 'mutual',
    mutualPinStatus: 'verified',
    lastInteracted: '10 mins ago',
    messageCount: 342,
    encryptionKeyVersion: 'v3-ed25519'
  },
  {
    id: 'CNT-10922',
    sourceUser: { id: 'usr-012', username: 'chioma_lagos', avatarInitials: 'CL', email: 'chioma@fingermobileprotocol.com' },
    targetUser: { id: 'usr-088', username: 'spam_bot_99', avatarInitials: 'SB', email: 'suspicious@domain.xyz' },
    relationship: 'blocked',
    mutualPinStatus: 'unverified',
    lastInteracted: '2 hours ago',
    messageCount: 4,
    encryptionKeyVersion: 'v3-ed25519'
  },
  {
    id: 'CNT-10923',
    sourceUser: { id: 'usr-055', username: 'victor_beats', avatarInitials: 'VB', email: 'victor@beatwave.ng' },
    targetUser: { id: 'usr-099', username: 'dancia_host', avatarInitials: 'DH', email: 'host@dancia4tv.com' },
    relationship: 'mutual',
    mutualPinStatus: 'verified',
    lastInteracted: 'Yesterday',
    messageCount: 1289,
    encryptionKeyVersion: 'v3-ed25519'
  },
  {
    id: 'CNT-10924',
    sourceUser: { id: 'usr-102', username: 'amina_kano', avatarInitials: 'AK', email: 'amina@storefronts.ng' },
    targetUser: { id: 'usr-210', username: 'habib_buyer', avatarInitials: 'HB', email: 'habib@buyer.com' },
    relationship: 'opted_out',
    mutualPinStatus: 'reset_requested',
    lastInteracted: '3 days ago',
    messageCount: 18,
    encryptionKeyVersion: 'v2-legacy'
  },
  {
    id: 'CNT-10925',
    sourceUser: { id: 'usr-301', username: 'emeka_escrow', avatarInitials: 'EE', email: 'emeka@fingermobileprotocol.com' },
    targetUser: { id: 'usr-404', username: 'zainab_fx', avatarInitials: 'ZF', email: 'zainab@fintech.io' },
    relationship: 'pending',
    mutualPinStatus: 'unverified',
    lastInteracted: '5 days ago',
    messageCount: 0,
    encryptionKeyVersion: 'v3-ed25519'
  }
];

export const ContactsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const [activeTab, setActiveTab] = useState<'directory' | 'queue' | 'abuse' | 'export'>('directory');
  const [contacts, setContacts] = useState<ContactRecord[]>(INITIAL_CONTACTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [relFilter, setRelFilter] = useState<string>('all');
  const [queueBacklog, setQueueBacklog] = useState(4120);
  const [isDraining, setIsDraining] = useState(false);

  const handleResetPin = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, mutualPinStatus: 'reset_requested' } : c))
    );
    showToast(`Mutual security PIN reset token issued for contact link ${id}`, 'info');
  };

  const handleToggleBlock = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextRel = c.relationship === 'blocked' ? 'mutual' : 'blocked';
          return { ...c, relationship: nextRel };
        }
        return c;
      })
    );
    showToast(`Updated relationship status for ${id}`, 'success');
  };

  const handleDrainQueue = () => {
    setIsDraining(true);
    setTimeout(() => {
      setQueueBacklog(42);
      setIsDraining(false);
      showToast('RabbitMQ / Kafka contact message queue cleared! Backlog resolved.', 'success');
    }, 1200);
  };

  const filteredContacts = contacts.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.id.toLowerCase().includes(q) ||
      c.sourceUser.username.toLowerCase().includes(q) ||
      c.targetUser.username.toLowerCase().includes(q) ||
      c.sourceUser.email.toLowerCase().includes(q);
    const matchesRel = relFilter === 'all' || c.relationship === relFilter;
    return matchesSearch && matchesRel;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate('/master-dashboard')}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-emerald-400 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Master Dashboard
              </button>
              <span className="text-zinc-600">/</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Community & Identity
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Contacts & Communication Hub
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Health 78% • Degraded
                  </span>
                </h1>
                <p className="text-sm text-zinc-400">
                  Member Relationship States, Mutual PIN Verification, Message Queues & Abuse Prevention
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                showToast('Exporting Contact Ledger (CSV/JSON)...', 'info');
              }}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition"
            >
              <Download className="w-4 h-4" />
              Export Contacts
            </button>
            <button
              onClick={handleDrainQueue}
              disabled={isDraining}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition"
            >
              <RefreshCw className={`w-4 h-4 ${isDraining ? 'animate-spin' : ''}`} />
              Drain Message Queue
            </button>
          </div>
        </div>

        {/* Degraded Telemetry Banner */}
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-amber-300">
                Contact Sync Pipeline Alert: Message Queue Backlog ({queueBacklog.toLocaleString()} msgs)
              </h4>
              <p className="text-xs text-amber-200/80">
                RabbitMQ consumer cluster node-02 experienced transient latency (p95: 418ms). Auto-healing active.
              </p>
            </div>
          </div>
          <button
            onClick={handleDrainQueue}
            disabled={isDraining}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg transition shrink-0"
          >
            Heal & Drain Backlog
          </button>
        </div>

        {/* Telemetry Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Section Health</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400">78.0%</div>
            <div className="text-[11px] text-zinc-500 mt-1">Degraded • Queue lag</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>p95 Delivery Latency</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-300">418 ms</div>
            <div className="text-[11px] text-zinc-500 mt-1">Target &lt;150ms</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Queue Backlog</span>
              <Layers className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-white">{queueBacklog.toLocaleString()}</div>
            <div className="text-[11px] text-zinc-500 mt-1">Stalled consumer buffer</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Sync Failure Rate</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">2.2%</div>
            <div className="text-[11px] text-zinc-500 mt-1">Retry threshold: 3 attempts</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Mutual PIN Verified</span>
              <KeyRound className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">89.4%</div>
            <div className="text-[11px] text-zinc-500 mt-1">Ed25519 Handshake active</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-zinc-800 mt-8">
          <button
            onClick={() => setActiveTab('directory')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'directory'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Contacts Directory ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'queue'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Message Queue & Consumer Status
          </button>
          <button
            onClick={() => setActiveTab('abuse')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'abuse'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Block & Abuse Manager ({contacts.filter((c) => c.relationship === 'blocked').length})
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'export'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Compliance & Data Export (GDPR)
          </button>
        </div>

        {/* TAB 1: Contacts Directory */}
        {activeTab === 'directory' && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/40 p-3 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-2 w-full md:w-96 bg-zinc-900 px-3 py-2 rounded-lg border border-zinc-800">
                <Search className="w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search member, username, ID, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm w-full focus:outline-none text-zinc-200"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <Filter className="w-3.5 h-3.5" />
                  <span>State:</span>
                </div>
                <select
                  value={relFilter}
                  onChange={(e) => setRelFilter(e.target.value)}
                  className="bg-zinc-900 text-xs border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 focus:outline-none"
                >
                  <option value="all">All Relationships</option>
                  <option value="mutual">Mutual Connected</option>
                  <option value="pending">Pending Request</option>
                  <option value="blocked">Blocked</option>
                  <option value="opted_out">Opted Out</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/20">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900/80 text-zinc-400 uppercase tracking-wider text-[11px] border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Initiating Member</th>
                      <th className="py-3 px-4">Connected Member</th>
                      <th className="py-3 px-4">Relationship State</th>
                      <th className="py-3 px-4">Mutual PIN Status</th>
                      <th className="py-3 px-4">Cipher Version</th>
                      <th className="py-3 px-4">Messages</th>
                      <th className="py-3 px-4 text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredContacts.map((c) => (
                      <tr key={c.id} className="hover:bg-zinc-800/30 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-[10px] text-amber-400 border border-zinc-700">
                              {c.sourceUser.avatarInitials}
                            </div>
                            <div>
                              <div className="font-semibold text-zinc-200">@{c.sourceUser.username}</div>
                              <div className="text-[10px] text-zinc-500">{c.sourceUser.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-[10px] text-cyan-400 border border-zinc-700">
                              {c.targetUser.avatarInitials}
                            </div>
                            <div>
                              <div className="font-semibold text-zinc-200">@{c.targetUser.username}</div>
                              <div className="text-[10px] text-zinc-500">{c.targetUser.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {c.relationship === 'mutual' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                              <UserCheck className="w-3 h-3" /> Mutual Connected
                            </span>
                          )}
                          {c.relationship === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                              <Clock className="w-3 h-3" /> Pending Approval
                            </span>
                          )}
                          {c.relationship === 'blocked' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                              <UserX className="w-3 h-3" /> Blocked
                            </span>
                          )}
                          {c.relationship === 'opted_out' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 font-medium">
                              <Lock className="w-3 h-3" /> Opted Out
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {c.mutualPinStatus === 'verified' && (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Verified (E2E)
                            </span>
                          )}
                          {c.mutualPinStatus === 'unverified' && (
                            <span className="text-zinc-500">Unverified</span>
                          )}
                          {c.mutualPinStatus === 'reset_requested' && (
                            <span className="text-amber-400 animate-pulse">Reset Requested</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-300">
                          {c.messageCount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-400 text-[10px]">
                          {c.encryptionKeyVersion}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleResetPin(c.id)}
                              className="px-2.5 py-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/20 transition"
                            >
                              Reset PIN
                            </button>
                            <button
                              onClick={() => handleToggleBlock(c.id)}
                              className={`px-2.5 py-1 text-[11px] font-medium rounded border transition ${
                                c.relationship === 'blocked'
                                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
                                  : 'text-rose-400 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20'
                              }`}
                            >
                              {c.relationship === 'blocked' ? 'Unblock' : 'Block'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Queue & Consumer Status */}
        {activeTab === 'queue' && (
          <div className="mt-6 space-y-6">
            <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    Kafka / RabbitMQ Message Pipeline
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Contact sync exchanges, message deliveries, and handshake event routing
                  </p>
                </div>
                <button
                  onClick={handleDrainQueue}
                  disabled={isDraining}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs rounded-lg transition"
                >
                  Restart Stalled Consumer Pools
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
                <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                  <span className="text-xs text-zinc-500">Queue Name:</span>
                  <div className="text-sm font-mono text-zinc-200 mt-1">fingermobile.contacts.events</div>
                  <div className="text-xs text-amber-400 mt-1">Backlog: {queueBacklog} messages</div>
                </div>
                <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                  <span className="text-xs text-zinc-500">Active Consumer Threads:</span>
                  <div className="text-sm font-mono text-emerald-400 mt-1">8 / 12 workers healthy</div>
                  <div className="text-xs text-zinc-500 mt-1">Auto-scaling triggered</div>
                </div>
                <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                  <span className="text-xs text-zinc-500">Dead Letter Queue (DLQ):</span>
                  <div className="text-sm font-mono text-zinc-200 mt-1">18 quarantined items</div>
                  <div className="text-xs text-zinc-500 mt-1">Auto-retry scheduled in 5m</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Block & Abuse Manager */}
        {activeTab === 'abuse' && (
          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <h3 className="text-sm font-bold text-white mb-2">Automated Abuse Gating Policy</h3>
              <p className="text-xs text-zinc-400">
                Accounts generating more than 50 contact requests/minute are automatically throttled.
                Harassment reports trigger automated mutual PIN revocation.
              </p>
            </div>

            {contacts
              .filter((c) => c.relationship === 'blocked')
              .map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <UserX className="w-5 h-5 text-rose-400" />
                    <div>
                      <div className="text-sm font-bold text-white">
                        @{c.sourceUser.username} blocked @{c.targetUser.username}
                      </div>
                      <div className="text-xs text-zinc-400">
                        Record ID: {c.id} • Reason: Suspicious unsolicited contact spam
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleBlock(c.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded hover:bg-emerald-500/20 transition"
                  >
                    Force Unblock & Clear Flag
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* TAB 4: Compliance & Export */}
        {activeTab === 'export' && (
          <div className="mt-6 p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <FileSpreadsheet className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">GDPR & Regulatory Contact Export</h3>
            </div>
            <p className="text-xs text-zinc-400">
              Export comprehensive relationship graphs, mutual handshake records, and communication timestamps
              for audit compliance.
            </p>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => showToast('Full Contact Graph exported in JSON format', 'success')}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-semibold rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export as JSON
              </button>
              <button
                onClick={() => showToast('Contact Ledger exported in CSV format', 'success')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-semibold rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export as CSV
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsPage;
