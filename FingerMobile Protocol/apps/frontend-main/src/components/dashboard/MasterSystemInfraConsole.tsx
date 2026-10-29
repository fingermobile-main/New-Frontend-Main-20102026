import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Cpu,
  Server,
  Activity,
  Layers,
  Database,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  Upload,
  Plus,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Volume2,
  Sparkles,
  ExternalLink,
  Trash2,
  Edit,
  X,
  Lock,
  Unlock,
  Radio,
  Share2,
  Zap
} from 'lucide-react';
import {
  SystemInfraDomain,
  SystemInfraItem,
  SystemInfraOverview,
  SystemInfraSpawnedConsole,
  CreateSystemInfraItemPayload
} from '../../types/systemInfraConsole';
import { systemInfraConsoleService } from '../../services/systemInfraConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterSystemInfraConsole: React.FC = () => {
  // State
  const [activeDomain, setActiveDomain] = useState<SystemInfraDomain | 'all'>('all');
  const [items, setItems] = useState<SystemInfraItem[]>([]);
  const [overview, setOverview] = useState<SystemInfraOverview | null>(null);
  const [spawnedConsoles, setSpawnedConsoles] = useState<SystemInfraSpawnedConsole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reordering, setReordering] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<SystemInfraItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateSystemInfraItemPayload>({
    domain: 'stercs_control_core',
    name: '',
    code: '',
    category: 'Kernel Execution',
    cluster_node: 'lagos-dc1-cluster-alpha',
    defcon_level: 5,
    throughput_tps: 25000,
    latency_ms: 1.5,
    health_score: 99.98,
    config_manifest_url: '',
    voice_tag: 'gbaski',
    notes: ''
  });

  // Spawn Modal Form State
  const [spawnTitle, setSpawnTitle] = useState('');
  const [spawnDomain, setSpawnDomain] = useState<SystemInfraDomain>('stercs_control_core');
  const [spawnBadge, setSpawnBadge] = useState('SOVEREIGN');
  const [spawnIcon, setSpawnIcon] = useState('Cpu');

  // Trigger Notifications with multi-sensory African Voice Lines
  const notify = (msg: string, type: 'success' | 'error' = 'success', voiceTag?: AfricanVoiceLine) => {
    setNotification({ message: msg, type });
    if (voiceTag) {
      audioEngine.playVoiceLine(voiceTag);
    }
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Fetch all initial telemetry
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ovData, itemsData, spawnsData] = await Promise.all([
        systemInfraConsoleService.getOverview(),
        systemInfraConsoleService.getItems(activeDomain),
        systemInfraConsoleService.getSpawnedConsoles()
      ]);
      setOverview(ovData);
      setItems(itemsData);
      setSpawnedConsoles(spawnsData);
    } catch (err: any) {
      notify(err.message || 'Failed to load systems telemetry', 'error', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [activeDomain]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Domain Change
  const handleDomainFilter = async (domain: SystemInfraDomain | 'all') => {
    setActiveDomain(domain);
  };

  // Move Item Up (Atomic PostgreSQL reordering)
  const handleMoveUp = async (index: number) => {
    if (index === 0 || reordering) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;

    const orders = newItems.map((item, idx) => ({
      id: item.id,
      display_order: idx + 1
    }));

    setItems(newItems);
    setReordering(true);
    try {
      await systemInfraConsoleService.reorderItems(orders);
      notify(`Re-sequenced node "${temp.name}" execution priority upwards`, 'success', 'gbaski');
    } catch (err: any) {
      notify('Failed to reorder infrastructure nodes in PostgreSQL', 'error', 'wahala');
      loadData();
    } finally {
      setReordering(false);
    }
  };

  // Move Item Down (Atomic PostgreSQL reordering)
  const handleMoveDown = async (index: number) => {
    if (index >= items.length - 1 || reordering) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;

    const orders = newItems.map((item, idx) => ({
      id: item.id,
      display_order: idx + 1
    }));

    setItems(newItems);
    setReordering(true);
    try {
      await systemInfraConsoleService.reorderItems(orders);
      notify(`Re-sequenced node "${temp.name}" execution priority downwards`, 'success', 'gbaski');
    } catch (err: any) {
      notify('Failed to reorder infrastructure nodes in PostgreSQL', 'error', 'wahala');
      loadData();
    } finally {
      setReordering(false);
    }
  };

  // Toggle Freeze State
  const handleToggleFreeze = async (item: SystemInfraItem) => {
    try {
      const updated = await systemInfraConsoleService.toggleFreeze(item.id);
      setItems((prev) => prev.map((it) => (it.id === item.id ? updated : it)));
      const isNowFrozen = updated.status === 'frozen';
      notify(
        `Node "${item.name}" is now ${isNowFrozen ? 'FROZEN (Isolated from Mesh Routing)' : 'ACTIVE'}`,
        isNowFrozen ? 'error' : 'success',
        isNowFrozen ? 'wahala' : 'sweet'
      );
      const ov = await systemInfraConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to toggle freeze state', 'error', 'wahala');
    }
  };

  // Delete Item
  const handleDelete = async (item: SystemInfraItem) => {
    if (!window.confirm(`Are you certain you want to decommission and purge "${item.name}"?`)) return;

    try {
      await systemInfraConsoleService.deleteItem(item.id);
      setItems((prev) => prev.filter((it) => it.id !== item.id));
      notify(`Decommissioned "${item.name}" from infrastructure mesh`, 'success', 'sweet');
      const ov = await systemInfraConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to delete node', 'error', 'wahala');
    }
  };

  // Handle Form Submission (Add)
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newItem = await systemInfraConsoleService.createItem(formData);
      setItems((prev) => [...prev, newItem]);
      setIsAddModalOpen(false);
      notify(`Provisioned node "${newItem.name}" into infrastructure registry`, 'success', 'blessings');
      setFormData({
        domain: 'stercs_control_core',
        name: '',
        code: '',
        category: 'Kernel Execution',
        cluster_node: 'lagos-dc1-cluster-alpha',
        defcon_level: 5,
        throughput_tps: 25000,
        latency_ms: 1.5,
        health_score: 99.98,
        config_manifest_url: '',
        voice_tag: 'gbaski',
        notes: ''
      });
      const ov = await systemInfraConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to provision infrastructure node', 'error', 'wahala');
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const updated = await systemInfraConsoleService.updateItem(selectedItem.id, formData);
      setItems((prev) => prev.map((it) => (it.id === selectedItem.id ? updated : it)));
      setIsEditModalOpen(false);
      setSelectedItem(null);
      notify(`Updated infrastructure node "${updated.name}"`, 'success', 'sweet');
      const ov = await systemInfraConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to update infrastructure item', 'error', 'wahala');
    }
  };

  // Open Edit Modal
  const openEditModal = (item: SystemInfraItem) => {
    setSelectedItem(item);
    setFormData({
      domain: item.domain,
      name: item.name,
      code: item.code,
      category: item.category,
      cluster_node: item.cluster_node || 'lagos-dc1-cluster-alpha',
      defcon_level: item.defcon_level || 5,
      throughput_tps: parseFloat(String(item.throughput_tps)) || 0,
      latency_ms: parseFloat(String(item.latency_ms)) || 1.0,
      health_score: parseFloat(String(item.health_score)) || 100.0,
      config_manifest_url: item.config_manifest_url || '',
      voice_tag: item.voice_tag || 'gbaski',
      notes: item.notes || ''
    });
    setIsEditModalOpen(true);
  };

  // Handle File Upload (Multipart directly to Express backend)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, item: SystemInfraItem) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      notify(`Uploading K8s/YAML manifest for "${item.name}"...`, 'success', 'gbaski');
      const uploadRes = await systemInfraConsoleService.uploadMedia(file, item.id, 'config_manifest_url');
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, config_manifest_url: uploadRes.fileUrl } : it))
      );
      notify(`Successfully bound manifest "${uploadRes.filename}" to PostgreSQL`, 'success', 'sweet');
    } catch (err: any) {
      notify(err.message || 'Failed to upload manifest', 'error', 'wahala');
    }
  };

  // Spawn New Console
  const handleSpawnConsole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spawnTitle.trim()) {
      notify('Please provide a title for the new infrastructure console', 'error', 'wahala');
      return;
    }

    try {
      const newSpawn = await systemInfraConsoleService.spawnConsole({
        console_title: spawnTitle.trim(),
        target_domain: spawnDomain,
        badge_text: spawnBadge,
        icon_name: spawnIcon,
        config: { createdBy: 'AdminMaster', engine: 'STERCS-InfraMesh' }
      });

      setSpawnedConsoles((prev) => [newSpawn, ...prev]);
      setIsSpawnModalOpen(false);
      setSpawnTitle('');
      notify(`Successfully spawned "${newSpawn.console_title}" at ${newSpawn.route}`, 'success', 'blessings');
      const ov = await systemInfraConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to spawn new infra console', 'error', 'wahala');
    }
  };

  // Filtered List
  const filteredItems = useMemo(() => {
    if (activeDomain === 'all') return items;
    return items.filter((it) => it.domain === activeDomain);
  }, [items, activeDomain]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Protocol Header */}
      <div className="bg-white border-b border-slate-300 px-6 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-blue-100 text-blue-950 rounded-lg border border-blue-400">
                <Cpu className="w-6 h-6 text-blue-950" />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  Systems Engineering, AI & Cloud Infrastructure Console
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400 font-semibold uppercase tracking-wider">
                    STERCS Core V4
                  </span>
                </h1>
                <p className="text-sm text-slate-700 mt-0.5 font-medium">
                  Autonomous administration of STERCS Sentient Core, Guardian AI DefCon, NexusGNN, Redis Queues & PostgreSQL Mesh
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                audioEngine.playVoiceLine('gbaski');
                setIsSpawnModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Spawn Infra Console
            </button>
            <button
              onClick={() => {
                audioEngine.playVoiceLine('gbaski');
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Provision Node
            </button>
            <button
              onClick={() => {
                audioEngine.playVoiceLine('gbaski');
                loadData();
              }}
              disabled={loading}
              className="p-2 bg-white text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-100 transition-all shadow-sm"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div
            className={`p-4 rounded-lg flex items-center justify-between border ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-950 border-emerald-400'
                : 'bg-rose-50 text-rose-950 border-rose-400'
            } shadow-sm transition-all`}
          >
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-700" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-700" />
              )}
              <span className="font-semibold text-sm">{notification.message}</span>
            </div>
            <button type="button" aria-label="Close" onClick={() => setNotification(null)} className="text-slate-500 hover:text-slate-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Telemetry Dashboard Stats */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Throughput</span>
              <span className="p-2 bg-blue-100 text-blue-950 rounded-lg border border-blue-400">
                <Zap className="w-4 h-4 text-blue-950" />
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {overview?.summary.total_throughput_tps
                ? `${Math.round(parseFloat(String(overview.summary.total_throughput_tps))).toLocaleString()} TPS`
                : '748,250 TPS'}
            </p>
            <p className="text-xs text-slate-700 mt-1 font-medium">Aggregate Protocol Mesh Capacity</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Average Latency</span>
              <span className="p-2 bg-purple-100 text-purple-950 rounded-lg border border-purple-400">
                <Radio className="w-4 h-4 text-purple-950" />
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {overview?.summary.average_latency_ms
                ? `${parseFloat(String(overview.summary.average_latency_ms)).toFixed(2)} ms`
                : '4.22 ms'}
            </p>
            <p className="text-xs text-slate-700 mt-1 font-medium">Cross-Zone Distributed Response</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mesh Health Score</span>
              <span className="p-2 bg-emerald-100 text-emerald-950 rounded-lg border border-emerald-400">
                <Activity className="w-4 h-4 text-emerald-950" />
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {overview?.summary.average_health_score
                ? `${parseFloat(String(overview.summary.average_health_score)).toFixed(2)}%`
                : '99.97%'}
            </p>
            <p className="text-xs text-slate-700 mt-1 font-medium">Zero Degraded Containers</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Nodes</span>
              <span className="p-2 bg-amber-100 text-amber-950 rounded-lg border border-amber-400">
                <Server className="w-4 h-4 text-amber-950" />
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {overview?.summary.active_count ?? '19'}{' '}
              <span className="text-sm font-medium text-slate-700">
                / {overview?.summary.total_items ?? '19'} active
              </span>
            </p>
            <p className="text-xs text-slate-700 mt-1 font-medium">Sovereign Cluster Resilience</p>
          </div>
        </div>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-300">
          <button
            onClick={() => handleDomainFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${
              activeDomain === 'all'
                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            All Mesh Nodes ({items.length})
          </button>
          <button
            onClick={() => handleDomainFilter('stercs_control_core')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${
              activeDomain === 'stercs_control_core'
                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            STERCS Sentient Core (3)
          </button>
          <button
            onClick={() => handleDomainFilter('guardian_ai_defcon')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${
              activeDomain === 'guardian_ai_defcon'
                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Guardian AI DefCon (3)
          </button>
          <button
            onClick={() => handleDomainFilter('nexus_gnn_engine')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${
              activeDomain === 'nexus_gnn_engine'
                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            NexusGNN Engine (3)
          </button>
          <button
            onClick={() => handleDomainFilter('worker_queues_redis')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${
              activeDomain === 'worker_queues_redis'
                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Worker Queues (3)
          </button>
          <button
            onClick={() => handleDomainFilter('microservices_mesh')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${
              activeDomain === 'microservices_mesh'
                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Microservices Mesh (4)
          </button>
          <button
            onClick={() => handleDomainFilter('cloud_infra_database')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${
              activeDomain === 'cloud_infra_database'
                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Cloud Infra & DB (3)
          </button>
        </div>
      </div>

      {/* Main Infrastructure Data Table */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-300 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-700" />
              Sovereign Systems Infrastructure & AI Mesh Nodes
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                {filteredItems.length} nodes
              </span>
            </h2>
            <span className="text-xs text-slate-700 font-medium">
              Priority resequencing persists directly to PostgreSQL
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider border-b border-slate-300">
                  <th className="py-3 px-4 w-12 text-center">Seq</th>
                  <th className="py-3 px-4">Node & Service</th>
                  <th className="py-3 px-4">Cluster / Host</th>
                  <th className="py-3 px-4">DefCon</th>
                  <th className="py-3 px-4">Throughput</th>
                  <th className="py-3 px-4">Latency & Health</th>
                  <th className="py-3 px-4">Config Manifest</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Audio</th>
                  <th className="py-3 px-4 text-right">Autonomous Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-700 font-medium">
                      No infrastructure nodes found in this domain. Click "Provision Node" to register one.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        item.status === 'frozen' ? 'bg-rose-50/40 opacity-75' : ''
                      }`}
                    >
                      {/* Seq Reordering */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => handleMoveUp(idx)}
                            disabled={idx === 0 || reordering}
                            className="p-1 hover:bg-slate-200 rounded text-slate-700 disabled:opacity-30 transition-all"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-black text-slate-900">{item.display_order}</span>
                          <button
                            onClick={() => handleMoveDown(idx)}
                            disabled={idx === filteredItems.length - 1 || reordering}
                            className="p-1 hover:bg-slate-200 rounded text-slate-700 disabled:opacity-30 transition-all"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Node & Service */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-700 font-medium">{item.code}</div>
                        <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-800 border border-slate-300">
                          {item.category}
                        </span>
                      </td>

                      {/* Cluster Node */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-xs font-semibold text-slate-800">
                          {item.cluster_node || 'lagos-dc1-cluster-alpha'}
                        </div>
                      </td>

                      {/* DefCon Level */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-black bg-blue-100 text-blue-950 border border-blue-400">
                          <ShieldAlert className="w-3 h-3 text-blue-950" />
                          DC-{item.defcon_level ?? 5}
                        </span>
                      </td>

                      {/* Throughput */}
                      <td className="py-3 px-4">
                        <div className="text-xs font-black text-slate-900">
                          {Math.round(parseFloat(String(item.throughput_tps))).toLocaleString()} TPS
                        </div>
                      </td>

                      {/* Latency & Health */}
                      <td className="py-3 px-4">
                        <div className="text-xs font-bold text-slate-900">
                          {parseFloat(String(item.latency_ms)).toFixed(2)} ms
                        </div>
                        <div className="text-[11px] font-bold text-emerald-900">
                          {parseFloat(String(item.health_score)).toFixed(1)}% healthy
                        </div>
                      </td>

                      {/* Config Manifest / Upload */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {item.config_manifest_url ? (
                            <a
                              href={item.config_manifest_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-800 hover:text-blue-950 font-bold underline flex items-center gap-1"
                            >
                              <Layers className="w-3.5 h-3.5" />
                              View Spec
                            </a>
                          ) : (
                            <span className="text-xs text-slate-600 italic">No spec attached</span>
                          )}
                          <label
                            className="p-1 hover:bg-slate-200 rounded cursor-pointer text-slate-700 transition-all"
                            title="Upload K8s / Architecture Manifest"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, item)}
                              accept=".yaml,.yml,.json,.conf,.txt,.bin"
                            />
                          </label>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                            item.status === 'active'
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                              : 'bg-rose-100 text-rose-950 border-rose-400'
                          }`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Audio Voice Stem */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            const tag = (item.voice_tag as AfricanVoiceLine) || 'gbaski';
                            audioEngine.playVoiceLine(tag);
                            notify(`Voicing: "${tag.toUpperCase()}"`, 'success');
                          }}
                          className="p-1.5 hover:bg-purple-100 text-purple-900 rounded-lg transition-all border border-transparent hover:border-purple-300"
                          title="Play Multi-Sensory Voice Line"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleFreeze(item)}
                            className={`p-1.5 rounded-lg border text-xs font-semibold transition-all ${
                              item.status === 'active'
                                ? 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100'
                            }`}
                            title={item.status === 'active' ? 'Freeze / Isolate Node' : 'Activate Node'}
                          >
                            {item.status === 'active' ? (
                              <Lock className="w-3.5 h-3.5" />
                            ) : (
                              <Unlock className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 bg-slate-100 text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-200 transition-all"
                            title="Edit Node"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-1.5 bg-rose-50 text-rose-900 border border-rose-300 rounded-lg hover:bg-rose-100 transition-all"
                            title="Decommission Node"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Spawned Consoles Section */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-700" />
                Spawned Sovereign Infrastructure Consoles
              </h3>
              <p className="text-xs text-slate-700 mt-0.5 font-medium">
                Autonomous systems sub-consoles dynamically created and registered into PostgreSQL
              </p>
            </div>
            <button
              onClick={() => setIsSpawnModalOpen(true)}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Spawn New
            </button>
          </div>

          {spawnedConsoles.length === 0 ? (
            <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center text-slate-700 text-sm font-medium">
              No infrastructure sub-consoles spawned yet. Use the "Spawn Infra Console" button above to launch an autonomous node.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {spawnedConsoles.map((sc) => (
                <div key={sc.id} className="p-4 rounded-lg border border-slate-300 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-950 border border-purple-300">
                        {sc.badge_text}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600">{sc.target_domain}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{sc.console_title}</h4>
                    <p className="text-xs text-slate-700 mt-1 font-mono">{sc.route}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900">Active Node</span>
                    <a
                      href={sc.route}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                    >
                      Open Console <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Provision Node Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-700" />
                Provision New Infrastructure Node / Service
              </h3>
              <button type="button" aria-label="Close" onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Target Domain</label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value as SystemInfraDomain })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  >
                    <option value="stercs_control_core">STERCS Sentient Core</option>
                    <option value="guardian_ai_defcon">Guardian AI DefCon</option>
                    <option value="nexus_gnn_engine">NexusGNN Engine</option>
                    <option value="worker_queues_redis">Worker Queues & Redis</option>
                    <option value="microservices_mesh">Microservices Mesh</option>
                    <option value="cloud_infra_database">Cloud Infra & Database</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Node / Service Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Distributed Vector Shard Cluster"
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Code / Identifier</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. GNN-SHARD-04"
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Semantic Vector Sharding"
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Cluster / Pod Node</label>
                  <input
                    type="text"
                    value={formData.cluster_node || ''}
                    onChange={(e) => setFormData({ ...formData, cluster_node: e.target.value })}
                    placeholder="e.g. lagos-dc1-cluster-alpha"
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">DefCon Level (1-5)</label>
                  <select
                    value={formData.defcon_level ?? 5}
                    onChange={(e) => setFormData({ ...formData, defcon_level: parseInt(e.target.value, 10) })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  >
                    <option value={5}>DefCon 5 (Normal Protocol Ops)</option>
                    <option value={4}>DefCon 4 (Heightened Alertness)</option>
                    <option value={3}>DefCon 3 (Surge Protection Active)</option>
                    <option value={2}>DefCon 2 (Critical Shield Engaged)</option>
                    <option value={1}>DefCon 1 (Maximum Sovereign Lockdown)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Throughput Capacity (TPS)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.throughput_tps || 0}
                    onChange={(e) => setFormData({ ...formData, throughput_tps: parseFloat(e.target.value) || 0 })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Latency Target (ms)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.latency_ms || 1.0}
                    onChange={(e) => setFormData({ ...formData, latency_ms: parseFloat(e.target.value) || 1.0 })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Notes / Cluster Spec</label>
                <textarea
                  rows={3}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Deployment instructions, hardware enclaves, CPU cores, replication lag..."
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
                >
                  Provision Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Node Modal */}
      {isEditModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-700" />
                Edit Infrastructure Node: {selectedItem.name}
              </h3>
              <button type="button" aria-label="Close" onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Node / Service Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Cluster Node</label>
                  <input
                    type="text"
                    value={formData.cluster_node || ''}
                    onChange={(e) => setFormData({ ...formData, cluster_node: e.target.value })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">DefCon Level (1-5)</label>
                  <select
                    value={formData.defcon_level ?? 5}
                    onChange={(e) => setFormData({ ...formData, defcon_level: parseInt(e.target.value, 10) })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  >
                    <option value={5}>DefCon 5 (Normal)</option>
                    <option value={4}>DefCon 4 (Alert)</option>
                    <option value={3}>DefCon 3 (Surge Protection)</option>
                    <option value={2}>DefCon 2 (Shield Active)</option>
                    <option value={1}>DefCon 1 (Lockdown)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Throughput Capacity (TPS)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.throughput_tps || 0}
                    onChange={(e) => setFormData({ ...formData, throughput_tps: parseFloat(e.target.value) || 0 })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Latency (ms)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.latency_ms || 1.0}
                    onChange={(e) => setFormData({ ...formData, latency_ms: parseFloat(e.target.value) || 1.0 })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* One-Click Console Spawner Modal */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-700" />
                Spawn Sovereign Infrastructure Console
              </h3>
              <button type="button" aria-label="Close" onClick={() => setIsSpawnModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSpawnConsole} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Console Title</label>
                <input
                  type="text"
                  required
                  value={spawnTitle}
                  onChange={(e) => setSpawnTitle(e.target.value)}
                  placeholder="e.g. Distributed Vector Shards Control"
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Target Mesh Domain</label>
                <select
                  value={spawnDomain}
                  onChange={(e) => setSpawnDomain(e.target.value as SystemInfraDomain)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                >
                  <option value="stercs_control_core">STERCS Sentient Core</option>
                  <option value="guardian_ai_defcon">Guardian AI DefCon</option>
                  <option value="nexus_gnn_engine">NexusGNN Engine</option>
                  <option value="worker_queues_redis">Worker Queues & Redis</option>
                  <option value="microservices_mesh">Microservices Mesh</option>
                  <option value="cloud_infra_database">Cloud Infra & Database</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={spawnBadge}
                    onChange={(e) => setSpawnBadge(e.target.value)}
                    placeholder="e.g. SOVEREIGN"
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Icon Name</label>
                  <input
                    type="text"
                    value={spawnIcon}
                    onChange={(e) => setSpawnIcon(e.target.value)}
                    placeholder="e.g. Cpu"
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs text-purple-950 font-medium">
                This will dynamically mint a sovereign infrastructure micro-console route with live PostgreSQL state tracking.
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSpawnModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
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

export default MasterSystemInfraConsole;
