import React, { useState, useEffect, useCallback } from 'react';
import {
  Trophy,
  Award,
  TrendingUp,
  Compass,
  Archive,
  ShieldCheck,
  Share2,
  FolderTree,
  Coins,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sliders,
  ExternalLink,
  Users,
  Layers,
  ArrowUpRight,
  X
} from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  rank: number;
  userId: string;
  username: string;
  handle: string;
  avatarUrl: string;
  score: number;
  metricLabel: string;
  change24h: string;
  ficEarned: number;
  badges: string[];
}

interface LeaderboardCategory {
  id: string;
  name: string;
  description: string;
  engine: 'discover' | 'permanence' | 'seshat' | 'nexusgnn' | 'p2p' | 'organizethese' | string;
  category: string;
  metric_type: string;
  is_active: boolean;
  reset_period: string;
  entries: LeaderboardEntry[];
}

interface EcosystemMatrixData {
  engines: string[];
  leaderboards: LeaderboardCategory[];
  telemetry: {
    totalFICDistributedAcrossBoards: number;
    interconnectedEnginesCount: number;
    twoWayDiscoverSyncActive: boolean;
    lastSyncTimestamp: string;
  };
}

export const LeadershipBoardConsole: React.FC = () => {
  const [activeEngine, setActiveEngine] = useState<string>('all');
  const [matrixData, setMatrixData] = useState<EcosystemMatrixData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Modal State for Adding/Editing an Entry
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LeaderboardEntry | null>(null);
  const [selectedLeaderboardId, setSelectedLeaderboardId] = useState('');
  const [entryUsername, setEntryUsername] = useState('');
  const [entryHandle, setEntryHandle] = useState('');
  const [entryScore, setEntryScore] = useState('100');
  const [entryMetricLabel, setEntryMetricLabel] = useState('Velocity Index');
  const [entryBadges, setEntryBadges] = useState('Leader, Verified');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/leaderboards/ecosystem-matrix');
      const json = await res.json();
      if (json.success) {
        setMatrixData(json.data);
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Failed to load leadership boards: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showNotification = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // Recalculate ranks across engines
  const handleRecalculate = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/leaderboards/recalculate', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', data.message);
        fetchData();
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // Distribute rewards to top leaders
  const handleDistributeRewards = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/leaderboards/reward-distribution', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', data.message);
        fetchData();
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // Two-way reconcile with Discover
  const handleSyncDiscover = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/leaderboards/sync-discover', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', data.message);
        fetchData();
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // Save entry (create or update)
  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryUsername.trim() || !entryHandle.trim()) {
      showNotification('error', 'Username and handle are required.');
      return;
    }

    try {
      const badgeList = entryBadges.split(',').map(b => b.trim()).filter(Boolean);

      if (editingEntry) {
        const res = await fetch(`http://localhost:5001/api/leaderboards/entry/${editingEntry.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: entryUsername,
            handle: entryHandle,
            score: Number(entryScore),
            metricLabel: entryMetricLabel,
            badges: badgeList
          })
        });
        const data = await res.json();
        if (data.success) {
          showNotification('success', 'Entry updated successfully.');
          setIsEntryModalOpen(false);
          fetchData();
        }
      } else {
        const res = await fetch('http://localhost:5001/api/leaderboards/entry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leaderboardId: selectedLeaderboardId || matrixData?.leaderboards[0]?.id,
            username: entryUsername,
            handle: entryHandle,
            score: Number(entryScore),
            metricLabel: entryMetricLabel,
            badges: badgeList
          })
        });
        const data = await res.json();
        if (data.success) {
          showNotification('success', 'New ranked leader added.');
          setIsEntryModalOpen(false);
          fetchData();
        }
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // Delete entry
  const handleDeleteEntry = async (id: string) => {
    if (!window.confirm('Remove this member from the leaderboard?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/leaderboards/entry/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Member removed.');
        fetchData();
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const leaderboards = matrixData?.leaderboards || [];
  const filteredLeaderboards = activeEngine === 'all'
    ? leaderboards
    : leaderboards.filter(l => l.engine.toLowerCase() === activeEngine.toLowerCase());

  const getEngineBadge = (engine: string) => {
    switch (engine.toLowerCase()) {
      case 'discover':
        return { label: 'Discover UGC', icon: Compass, color: 'bg-blue-100 text-blue-950 border-blue-400' };
      case 'permanence':
        return { label: 'Permanence Proofs', icon: Archive, color: 'bg-amber-100 text-amber-950 border-amber-400' };
      case 'seshat':
        return { label: 'Seshat Guild', icon: ShieldCheck, color: 'bg-purple-100 text-purple-950 border-purple-400' };
      case 'nexusgnn':
        return { label: 'NexusGNN Graph', icon: Layers, color: 'bg-indigo-100 text-indigo-950 border-indigo-400' };
      case 'p2p':
        return { label: 'P2P Swarm', icon: Share2, color: 'bg-cyan-100 text-cyan-950 border-cyan-400' };
      case 'organizethese':
        return { label: 'OrganizeThese AI', icon: FolderTree, color: 'bg-emerald-100 text-emerald-950 border-emerald-400' };
      default:
        return { label: engine, icon: Award, color: 'bg-slate-100 text-slate-900 border-slate-300' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-950 border border-amber-400">
            <Trophy className="w-7 h-7 text-amber-900" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Cross-Engine LeadershipBoard Console
            </h1>
            <p className="text-sm font-semibold text-slate-700">
              Two-Way Interconnections: Discover UGC, Permanence, Seshat, NexusGNN, P2P Swarms & OrganizeThese
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold hover:bg-slate-100 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 text-slate-700 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleSyncDiscover}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Compass className="w-4 h-4" />
            Sync with Discover
          </button>
          <button
            onClick={handleRecalculate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-700 text-white font-bold hover:bg-indigo-800 transition-colors shadow-sm"
          >
            <Zap className="w-4 h-4" />
            Recalculate All
          </button>
          <button
            onClick={handleDistributeRewards}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Coins className="w-4 h-4" />
            Distribute FIC Rewards
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
              : 'bg-rose-100 border-rose-400 text-rose-950 font-bold'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>{statusMessage.text}</span>
          </div>
          <button aria-label="Close" type="button" onClick={() => setStatusMessage(null)}>
            <X className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      )}

      {/* Multi-Engine Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { key: 'discover', title: 'Discover UGC', sub: 'Velocity Index', icon: Compass, color: 'text-blue-900', count: leaderboards.find(l => l.engine === 'discover')?.entries.length || 0 },
          { key: 'permanence', title: 'Permanence', sub: 'Proof Epochs', icon: Archive, color: 'text-amber-900', count: leaderboards.find(l => l.engine === 'permanence')?.entries.length || 0 },
          { key: 'seshat', title: 'Seshat Vault', sub: 'FIC Royalties', icon: ShieldCheck, color: 'text-purple-900', count: leaderboards.find(l => l.engine === 'seshat')?.entries.length || 0 },
          { key: 'nexusgnn', title: 'NexusGNN', sub: 'Graph Centrality', icon: Layers, color: 'text-indigo-900', count: leaderboards.find(l => l.engine === 'nexusgnn')?.entries.length || 0 },
          { key: 'p2p', title: 'P2P Swarm', sub: 'Relay Bandwidth', icon: Share2, color: 'text-cyan-900', count: leaderboards.find(l => l.engine === 'p2p')?.entries.length || 0 },
          { key: 'organizethese', title: 'OrganizeThese', sub: 'AI Coherence', icon: FolderTree, color: 'text-emerald-900', count: leaderboards.find(l => l.engine === 'organizethese')?.entries.length || 0 }
        ].map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              onClick={() => setActiveEngine(item.key)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeEngine === item.key
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase ${activeEngine === item.key ? 'text-slate-300' : 'text-slate-700'}`}>{item.title}</span>
                <Icon className={`w-4 h-4 ${activeEngine === item.key ? 'text-amber-400' : item.color}`} />
              </div>
              <p className={`text-2xl font-black mt-1 ${activeEngine === item.key ? 'text-white' : 'text-slate-900'}`}>{item.count} Leaders</p>
              <span className={`text-[11px] font-bold ${activeEngine === item.key ? 'text-slate-300' : 'text-slate-700'}`}>{item.sub}</span>
            </div>
          );
        })}
      </div>

      {/* Engine Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-300 pb-3">
        <div className="flex flex-wrap gap-2">
          {['all', 'discover', 'permanence', 'seshat', 'nexusgnn', 'p2p', 'organizethese'].map(eng => (
            <button
              key={eng}
              onClick={() => setActiveEngine(eng)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeEngine === eng
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {eng === 'all' ? 'All 6 Engines' : eng.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setEditingEntry(null);
            setEntryUsername('');
            setEntryHandle('');
            setEntryScore('100');
            setEntryBadges('Leader, Verified');
            setSelectedLeaderboardId(filteredLeaderboards[0]?.id || '');
            setIsEntryModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white font-extrabold text-xs hover:bg-amber-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Leaderboard Member
        </button>
      </div>

      {/* Leaderboard Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLeaderboards.map(lb => {
          const badge = getEngineBadge(lb.engine);
          const EngineIcon = badge.icon;

          return (
            <div key={lb.id} className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badge.color}`}>
                      <EngineIcon className="w-3.5 h-3.5" />
                      {badge.label}
                    </span>
                    <span className="text-xs font-mono text-slate-700">Metric: {lb.metric_type}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{lb.name}</h3>
                  <p className="text-xs text-slate-700 font-medium">{lb.description}</p>
                </div>
              </div>

              {/* Ranked Entries Table */}
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                {lb.entries.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="p-3.5 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-950 border border-amber-400'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-900'
                          : idx === 2
                          ? 'bg-orange-100 text-orange-950 border border-orange-400'
                          : 'text-slate-700'
                      }`}>
                        #{entry.rank}
                      </div>

                      <img
                        src={entry.avatarUrl}
                        alt={entry.username}
                        className="w-9 h-9 rounded-full object-cover border border-slate-300"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-slate-900 text-sm">{entry.username}</p>
                          <span className="text-xs font-semibold text-slate-700">{entry.handle}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {entry.badges.map((b, i) => (
                            <span key={i} className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-900 border border-slate-300">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-black text-slate-900 text-sm">
                          {entry.score.toLocaleString()} <span className="text-xs font-semibold text-slate-700">{entry.metricLabel}</span>
                        </p>
                        <p className="text-xs font-bold text-emerald-950">{entry.change24h} • {entry.ficEarned} FIC</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button type="button" aria-label="Edit"
                          onClick={() => {
                            setEditingEntry(entry);
                            setSelectedLeaderboardId(lb.id);
                            setEntryUsername(entry.username);
                            setEntryHandle(entry.handle);
                            setEntryScore(String(entry.score));
                            setEntryMetricLabel(entry.metricLabel);
                            setEntryBadges(entry.badges.join(', '));
                            setIsEntryModalOpen(true);
                          }}
                          className="p-1 rounded hover:bg-slate-100 text-slate-700"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" aria-label="Delete"
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1 rounded hover:bg-rose-50 text-rose-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: ADD / EDIT LEADERBOARD ENTRY */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">
                {editingEntry ? 'Edit Leaderboard Member' : 'Add Ranked Member'}
              </h3>
              <button aria-label="Close" type="button" onClick={() => setIsEntryModalOpen(false)}>
                <X className="w-5 h-5 text-slate-700 hover:text-slate-900" />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Target Engine Board</label>
                <select
                  value={selectedLeaderboardId}
                  onChange={e => setSelectedLeaderboardId(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold outline-none"
                >
                  {leaderboards.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.engine})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Username *</label>
                <input
                  type="text"
                  required
                  value={entryUsername}
                  onChange={e => setEntryUsername(e.target.value)}
                  placeholder="e.g. Dr. Amina Seshat"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Handle *</label>
                <input
                  type="text"
                  required
                  value={entryHandle}
                  onChange={e => setEntryHandle(e.target.value)}
                  placeholder="@amina_seshat"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Score Value</label>
                  <input
                    type="number"
                    step="0.1"
                    value={entryScore}
                    onChange={e => setEntryScore(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Metric Label</label>
                  <input
                    type="text"
                    value={entryMetricLabel}
                    onChange={e => setEntryMetricLabel(e.target.value)}
                    placeholder="Velocity"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Badges (Comma-separated)</label>
                <input
                  type="text"
                  value={entryBadges}
                  onChange={e => setEntryBadges(e.target.value)}
                  placeholder="Seshat Verified, SuperSeeder"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEntryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white font-extrabold hover:bg-amber-700 shadow-sm"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadershipBoardConsole;
