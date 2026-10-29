import React, { useState, useEffect, useCallback } from 'react';
import {
  ChartBarIcon,
  PlayIcon,
  PauseIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  ArrowPathIcon,
  TrashIcon,
  PencilSquareIcon,
  SparklesIcon,
  SpeakerWaveIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  BoltIcon,
  CircleStackIcon,
  SignalIcon
} from '@heroicons/react/24/outline';
import {
  AnalyticsTelemetryConsoleItem,
  AnalyticsTelemetryConsoleOverview,
  AnalyticsTelemetryConsoleSpawn
} from '../../types/analyticsTelemetryConsole';
import { analyticsTelemetryConsoleService } from '../../services/analyticsTelemetryConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterAnalyticsTelemetryConsole: React.FC = () => {
  const [items, setItems] = useState<AnalyticsTelemetryConsoleItem[]>([]);
  const [overview, setOverview] = useState<AnalyticsTelemetryConsoleOverview | null>(null);
  const [spawns, setSpawns] = useState<AnalyticsTelemetryConsoleSpawn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<AnalyticsTelemetryConsoleItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Traffic & Throughput');
  const [formScope, setFormScope] = useState<string>('Platform Edge');
  const [formSamplingHz, setFormSamplingHz] = useState<number>(1000.0);
  const [formLatencyMs, setFormLatencyMs] = useState<number>(12.5);
  const [formQps, setFormQps] = useState<number>(50000.0);
  const [formRetention, setFormRetention] = useState<number>(90);
  const [formVoiceTag, setFormVoiceTag] = useState<AfricanVoiceLine>('sweet');
  const [formNotes, setFormNotes] = useState<string>('');

  // Spawn Form State
  const [spawnTitle, setSpawnTitle] = useState<string>('');
  const [spawnDomain, setSpawnDomain] = useState<string>('analytics_telemetry');
  const [spawnBadge, setSpawnBadge] = useState<string>('TELEMETRY');

  const showToast = (msg: string, voice?: AfricanVoiceLine) => {
    setToastMessage(msg);
    if (voice) audioEngine.playVoiceLine(voice);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ov, itms, sps] = await Promise.all([
        analyticsTelemetryConsoleService.getOverview(),
        analyticsTelemetryConsoleService.getItems(selectedCategory, selectedStatus, searchQuery),
        analyticsTelemetryConsoleService.getSpawns()
      ]);
      setOverview(ov);
      setItems(itms);
      setSpawns(sps);
    } catch (err: any) {
      showToast(err.message || 'Error fetching telemetry data', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleFreeze = async (id: string) => {
    try {
      const updated = await analyticsTelemetryConsoleService.toggleFreeze(id);
      setItems(prev => prev.map(item => item.id === id ? updated : item));
      showToast(`Telemetry node #${id} is now ${updated.status.toUpperCase()}`, 'wahala');
      loadData();
    } catch (_err) {
      showToast('Error toggling telemetry state', 'wahala');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    try {
      const updatedItems = await analyticsTelemetryConsoleService.reorderItems(items[index].id, items[targetIndex].id);
      setItems(updatedItems);
      showToast('Telemetry nodes reordered successfully', 'gbaski');
    } catch (_err) {
      showToast('Error reordering telemetry nodes', 'wahala');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete ${id}?`)) return;
    try {
      await analyticsTelemetryConsoleService.deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      showToast(`Deleted ${id}`, 'madt_o');
      loadData();
    } catch (_err) {
      showToast('Error deleting item', 'wahala');
    }
  };

  const handleUploadFeed = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('Uploading telemetry feed directly to Express backend...', 'blessings');
      const res = await analyticsTelemetryConsoleService.uploadAsset(id, file);
      setItems(prev => prev.map(item => item.id === id ? res.item : item));
      showToast('Telemetry feed saved live!', 'colossal_combo');
    } catch (_err) {
      showToast('Failed to upload feed', 'wahala');
    }
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await analyticsTelemetryConsoleService.createItem({
        name: formName,
        code: formCode,
        category: formCategory,
        metric_scope: formScope,
        sampling_rate_hz: Number(formSamplingHz),
        p99_latency_ms: Number(formLatencyMs),
        qps_throughput: Number(formQps),
        retention_days: Number(formRetention),
        voice_tag: formVoiceTag,
        notes: formNotes
      });
      setIsAddModalOpen(false);
      showToast('New telemetry node provisioned live in database', 'great_combo');
      loadData();
    } catch (_err) {
      showToast('Failed to create telemetry node', 'wahala');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;
    try {
      await analyticsTelemetryConsoleService.updateItem(activeItem.id, {
        name: formName,
        code: formCode,
        category: formCategory,
        metric_scope: formScope,
        sampling_rate_hz: Number(formSamplingHz),
        p99_latency_ms: Number(formLatencyMs),
        qps_throughput: Number(formQps),
        retention_days: Number(formRetention),
        voice_tag: formVoiceTag,
        notes: formNotes
      });
      setIsEditModalOpen(false);
      showToast(`Telemetry node ${activeItem.id} updated live`, 'owo_ni_koko');
      loadData();
    } catch (_err) {
      showToast('Failed to update telemetry node', 'wahala');
    }
  };

  const handleSpawnConsole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await analyticsTelemetryConsoleService.spawnConsole({
        console_title: spawnTitle,
        target_domain: spawnDomain,
        route: `/admin/telemetry-${spawnTitle.toLowerCase().replace(/\s+/g, '-')}`,
        badge_text: spawnBadge
      });
      setIsSpawnModalOpen(false);
      showToast(`Spawned sovereign telemetry console: ${spawnTitle}`, 'stunning');
      loadData();
    } catch (_err) {
      showToast('Failed to spawn console', 'wahala');
    }
  };

  const openEditModal = (item: AnalyticsTelemetryConsoleItem) => {
    setActiveItem(item);
    setFormName(item.name);
    setFormCode(item.code);
    setFormCategory(item.category);
    setFormScope(item.metric_scope || 'Platform Edge');
    setFormSamplingHz(item.sampling_rate_hz || 1000.0);
    setFormLatencyMs(item.p99_latency_ms || 12.5);
    setFormQps(item.qps_throughput || 50000.0);
    setFormRetention(item.retention_days || 90);
    setFormVoiceTag(item.voice_tag || 'sweet');
    setFormNotes(item.notes || '');
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-3">
          <SparklesIcon className="w-5 h-5 text-indigo-400" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-300 p-6 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 border border-indigo-300 rounded-lg text-indigo-950">
              <ChartBarIcon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Analytics & Telemetry Operations Console</h1>
              <p className="text-sm font-medium text-slate-700">Platform-Wide QPS Tracing, Latency Budgets, Database Health & Real-Time Funnels</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setFormName('');
              setFormCode(`QPS_${Date.now().toString(36).toUpperCase()}`);
              setFormCategory('Traffic & Throughput');
              setFormScope('Platform Edge');
              setFormSamplingHz(1000.0);
              setFormLatencyMs(12.5);
              setFormQps(50000.0);
              setFormRetention(90);
              setFormVoiceTag('sweet');
              setFormNotes('');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold text-sm shadow-sm transition"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create Telemetry Node</span>
          </button>

          <button
            onClick={() => {
              setSpawnTitle('');
              setSpawnDomain('analytics_telemetry');
              setSpawnBadge('TELEMETRY');
              setIsSpawnModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-bold text-sm shadow-sm transition"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>Spawn Sub-Console</span>
          </button>

          <button
            onClick={() => loadData()}
            className="p-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition"
            title="Refresh"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Telemetry Nodes</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{overview.summary.total_items}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Active Streams</span>
            <div className="text-2xl font-black text-emerald-950 mt-1">{overview.summary.active_count}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Frozen Nodes</span>
            <div className="text-2xl font-black text-rose-950 mt-1">{overview.summary.frozen_count}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Total QPS</span>
            <div className="text-2xl font-black text-indigo-950 mt-1">{Math.round(Number(overview.summary.total_qps)).toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Avg P99 Latency</span>
            <div className="text-2xl font-black text-amber-950 mt-1">{Number(overview.summary.avg_p99_latency).toFixed(1)} ms</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Sub-Consoles</span>
            <div className="text-2xl font-black text-purple-950 mt-1">{overview.totalSpawns}</div>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search telemetry, scopes, codes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 w-72"
          />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="ALL">All Categories</option>
            <option value="Traffic & Throughput">Traffic & Throughput</option>
            <option value="Latency Budgets">Latency Budgets</option>
            <option value="Database Health">Database Health</option>
            <option value="User Engagement">User Engagement</option>
            <option value="Commerce Funnels">Commerce Funnels</option>
            <option value="Reliability & Faults">Reliability & Faults</option>
            <option value="Media Performance">Media Performance</option>
            <option value="Caching & State">Caching & State</option>
          </select>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="ALL">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="frozen">Frozen Only</option>
          </select>
        </div>

        <div className="text-sm font-semibold text-slate-700">
          Showing {items.length} Telemetry Nodes
        </div>
      </div>

      {/* Telemetry Table */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-700 font-bold">Loading telemetry streams from database...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-700 font-bold">No telemetry nodes found matching query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Metric Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Scope / Sampling</th>
                  <th className="py-3.5 px-4">P99 Latency / QPS</th>
                  <th className="py-3.5 px-4">Retention</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    {/* Order & Reordering */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-sm font-bold text-slate-900 w-6">#{item.display_order}</span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleMove(index, 'up')}
                            disabled={index === 0}
                            className={`p-1 rounded hover:bg-slate-200 ${index === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700'}`}
                            title="Move Up"
                          >
                            <ArrowUpIcon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMove(index, 'down')}
                            disabled={index === items.length - 1}
                            className={`p-1 rounded hover:bg-slate-200 ${index === items.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700'}`}
                            title="Move Down"
                          >
                            <ArrowDownIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-sm text-slate-900">{item.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-800">{item.code}</span>
                        {item.voice_tag && (
                          <button
                            onClick={() => audioEngine.playVoiceLine(item.voice_tag as AfricanVoiceLine)}
                            className="flex items-center gap-1 text-xs font-bold text-indigo-800 hover:text-indigo-950 transition"
                            title="Play Voice Line"
                          >
                            <SpeakerWaveIcon className="w-3.5 h-3.5" />
                            <span>{item.voice_tag}</span>
                          </button>
                        )}
                      </div>
                      {item.notes && <p className="text-xs text-slate-700 mt-1 max-w-xs">{item.notes}</p>}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-200 text-slate-900 border border-slate-300">
                        {item.category}
                      </span>
                    </td>

                    {/* Scope / Sampling */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-900">{item.metric_scope || 'Platform Edge'}</div>
                      <div className="text-xs text-slate-700">{item.sampling_rate_hz || 1000} Hz sampling</div>
                    </td>

                    {/* P99 Latency / QPS */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-900">{item.p99_latency_ms || 12.5} ms P99</div>
                      <div className="text-xs text-slate-700">{Math.round(Number(item.qps_throughput || 0)).toLocaleString()} QPS</div>
                    </td>

                    {/* Retention */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-900">{item.retention_days || 90} Days</div>
                    </td>

                    {/* Status & Freeze Killswitch */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFreeze(item.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border transition ${
                          item.status === 'active'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-950 border-rose-400 hover:bg-rose-200'
                        }`}
                        title="Toggle Freeze Killswitch"
                      >
                        {item.status === 'active' ? (
                          <>
                            <PlayIcon className="w-3.5 h-3.5 text-emerald-800" />
                            <span>LIVE</span>
                          </>
                        ) : (
                          <>
                            <PauseIcon className="w-3.5 h-3.5 text-rose-800" />
                            <span>MUTED</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Direct File Upload */}
                        <label className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer transition" title="Upload Telemetry Feed directly to Express backend">
                          <ArrowUpTrayIcon className="w-4 h-4" />
                          <input
                            type="file"
                            className="hidden"
                            onChange={e => handleUploadFeed(item.id, e)}
                          />
                        </label>

                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                          title="Edit Node"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg border border-slate-300 text-rose-700 hover:bg-rose-50 transition"
                          title="Delete Node"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Spawned Consoles Registry */}
      {spawns.length > 0 && (
        <div className="mt-8 bg-white rounded-xl border border-slate-300 p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-indigo-500" />
            <span>Spawned Sovereign Sub-Consoles ({spawns.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spawns.map(spawn => (
              <div key={spawn.id} className="p-4 rounded-lg border border-slate-300 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-sm text-slate-900">{spawn.console_title}</div>
                  <div className="font-mono text-xs text-slate-700">{spawn.route}</div>
                </div>
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-indigo-100 text-indigo-950 border border-indigo-300">
                  {spawn.badge_text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-black text-slate-900">Provision Telemetry Node</h2>
              <button type="button" aria-label="Close" onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Metric Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Metric Code</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  >
                    <option value="Traffic & Throughput">Traffic & Throughput</option>
                    <option value="Latency Budgets">Latency Budgets</option>
                    <option value="Database Health">Database Health</option>
                    <option value="User Engagement">User Engagement</option>
                    <option value="Commerce Funnels">Commerce Funnels</option>
                    <option value="Reliability & Faults">Reliability & Faults</option>
                    <option value="Media Performance">Media Performance</option>
                    <option value="Caching & State">Caching & State</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">African Voice Stem</label>
                  <select
                    value={formVoiceTag}
                    onChange={e => setFormVoiceTag(e.target.value as AfricanVoiceLine)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  >
                    <option value="sweet">sweet</option>
                    <option value="gbaski">gbaski</option>
                    <option value="owo_ni_koko">owo_ni_koko</option>
                    <option value="blessings">blessings</option>
                    <option value="madt_o">madt_o</option>
                    <option value="boom">boom</option>
                    <option value="stunning">stunning</option>
                    <option value="colossal_combo">colossal_combo</option>
                    <option value="wahala">wahala</option>
                    <option value="see_gobe">see_gobe</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Scope</label>
                  <input
                    type="text"
                    value={formScope}
                    onChange={e => setFormScope(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Sampling Rate (Hz)</label>
                  <input
                    type="number"
                    value={formSamplingHz}
                    onChange={e => setFormSamplingHz(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">P99 Latency (ms)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formLatencyMs}
                    onChange={e => setFormLatencyMs(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Throughput (QPS)</label>
                  <input
                    type="number"
                    value={formQps}
                    onChange={e => setFormQps(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Retention (Days)</label>
                  <input
                    type="number"
                    value={formRetention}
                    onChange={e => setFormRetention(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Notes / Description</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 shadow"
                >
                  Create Telemetry Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && activeItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-black text-slate-900">Edit Telemetry Node #{activeItem.id}</h2>
              <button type="button" aria-label="Close" onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Metric Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Metric Code</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  >
                    <option value="Traffic & Throughput">Traffic & Throughput</option>
                    <option value="Latency Budgets">Latency Budgets</option>
                    <option value="Database Health">Database Health</option>
                    <option value="User Engagement">User Engagement</option>
                    <option value="Commerce Funnels">Commerce Funnels</option>
                    <option value="Reliability & Faults">Reliability & Faults</option>
                    <option value="Media Performance">Media Performance</option>
                    <option value="Caching & State">Caching & State</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">African Voice Stem</label>
                  <select
                    value={formVoiceTag}
                    onChange={e => setFormVoiceTag(e.target.value as AfricanVoiceLine)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  >
                    <option value="sweet">sweet</option>
                    <option value="gbaski">gbaski</option>
                    <option value="owo_ni_koko">owo_ni_koko</option>
                    <option value="blessings">blessings</option>
                    <option value="madt_o">madt_o</option>
                    <option value="boom">boom</option>
                    <option value="stunning">stunning</option>
                    <option value="colossal_combo">colossal_combo</option>
                    <option value="wahala">wahala</option>
                    <option value="see_gobe">see_gobe</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Scope</label>
                  <input
                    type="text"
                    value={formScope}
                    onChange={e => setFormScope(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Sampling Rate (Hz)</label>
                  <input
                    type="number"
                    value={formSamplingHz}
                    onChange={e => setFormSamplingHz(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">P99 Latency (ms)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formLatencyMs}
                    onChange={e => setFormLatencyMs(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Throughput (QPS)</label>
                  <input
                    type="number"
                    value={formQps}
                    onChange={e => setFormQps(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Retention (Days)</label>
                  <input
                    type="number"
                    value={formRetention}
                    onChange={e => setFormRetention(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Notes / Description</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 shadow"
                >
                  Save Telemetry Node Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Spawn Modal */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-black text-slate-900">Spawn Sovereign Telemetry Console</h2>
              <button type="button" aria-label="Close" onClick={() => setIsSpawnModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSpawnConsole} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Console Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Real-Time WebSocket Telemetry Rail"
                  value={spawnTitle}
                  onChange={e => setSpawnTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Target Domain</label>
                <input
                  type="text"
                  required
                  value={spawnDomain}
                  onChange={e => setSpawnDomain(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Badge Text</label>
                <input
                  type="text"
                  required
                  value={spawnBadge}
                  onChange={e => setSpawnBadge(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSpawnModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-500 shadow"
                >
                  Spawn Console
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
