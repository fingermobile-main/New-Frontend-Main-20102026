import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  Flame,
  Radio,
  Sliders,
  ShieldAlert,
  Plus,
  RefreshCw,
  Search,
  Upload,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  Share2,
  MapPin,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe,
  Cpu,
  Eye,
  MessageSquare
} from 'lucide-react';
import {
  TrendSwarmItem,
  TrendsSwarmOverview,
  TrendsSwarmSpawnedConsole,
  CreateTrendSwarmPayload,
  TrendCategory,
  TrendType
} from '../../types/trendsSwarmConsole';
import { trendsSwarmConsoleService, ReorderEntry } from '../../services/trendsSwarmConsoleService';
import superViAudio from '../../services/SuperViAudioEngine';

const CATEGORIES: TrendCategory[] = [
  'AfroBeats & Music',
  'Fashion & Luxury',
  'EduTech & NYSC',
  'Gaming & Physics',
  'Commerce & Deals',
  'Tech & Web3'
];

export const MasterTrendsSwarmConsole: React.FC = () => {
  // 1. Core State
  const [overview, setOverview] = useState<TrendsSwarmOverview | null>(null);
  const [items, setItems] = useState<TrendSwarmItem[]>([]);
  const [spawns, setSpawns] = useState<TrendsSwarmSpawnedConsole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<TrendCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [boostedOnlyFilter, setBoostedOnlyFilter] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // 2. Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<TrendSwarmItem | null>(null);
  const [isClampModalOpen, setIsClampModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);

  // 3. Form States
  const [formData, setFormData] = useState<CreateTrendSwarmPayload>({
    topic: '',
    category: 'AfroBeats & Music',
    trend_type: 'swarm',
    virality_decay_rate: 0.085,
    velocity_score: 88.5,
    target_clusters: ['Lagos', 'Abuja', 'Nairobi'],
    gnm_weight: 1.25,
    is_boosted: false
  });

  const [clusterInput, setClusterInput] = useState<string>('Lagos, Abuja, Nairobi');

  const [spawnData, setSpawnData] = useState({
    title: '',
    domain: 'trends_swarm',
    badge: 'SWRM-SENTINEL-0' + Math.floor(Math.random() * 9 + 3),
    description: '',
    instances: 1
  });

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedAssetUrl, setUploadedAssetUrl] = useState<string>('');

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success', voiceLine?: 'gbaski' | 'wahala' | 'boom' | 'blessings' | 'awesome') => {
    setNotification({ message, type });
    if (voiceLine) {
      superViAudio.playVoiceLine(voiceLine);
    }
    setTimeout(() => setNotification(null), 4500);
  };

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [overviewData, itemsData, spawnsData] = await Promise.all([
        trendsSwarmConsoleService.getOverview(),
        trendsSwarmConsoleService.getItems(selectedCategory, searchQuery, boostedOnlyFilter),
        trendsSwarmConsoleService.getSpawns()
      ]);
      setOverview(overviewData);
      setItems(itemsData);
      setSpawns(spawnsData);
    } catch (err: any) {
      console.error('Failed to load Trends & Swarms data:', err);
      showNotification(err.message || 'Error syncing with PostgreSQL', 'error', 'wahala');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery, boostedOnlyFilter]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Handle direct file upload to Express backend
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadRes = await trendsSwarmConsoleService.uploadAsset(file);
      setUploadedAssetUrl(uploadRes.url);
      showNotification(`Trend badge media ingested: ${uploadRes.filename}`, 'success', 'gbaski');
    } catch (err: any) {
      showNotification(err.message || 'Asset upload failed', 'error', 'wahala');
    } finally {
      setIsUploading(false);
    }
  };

  // Create Trend
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic) {
      showNotification('Topic name is required', 'error', 'wahala');
      return;
    }

    const clusters = clusterInput.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const created = await trendsSwarmConsoleService.createItem({
        ...formData,
        target_clusters: clusters
      });
      setItems(prev => [...prev, created]);
      setIsAddModalOpen(false);
      showNotification(`Topic "${created.topic}" published live to PostgreSQL!`, 'success', 'gbaski');
      trendsSwarmConsoleService.getOverview().then(setOverview);
    } catch (err: any) {
      showNotification(err.message || 'Failed to create trend', 'error', 'wahala');
    }
  };

  // Edit Trend
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const updated = await trendsSwarmConsoleService.updateItem(editingItem.id, {
        topic: editingItem.topic,
        category: editingItem.category,
        trend_type: editingItem.trend_type,
        virality_decay_rate: editingItem.virality_decay_rate,
        velocity_score: editingItem.velocity_score,
        target_clusters: editingItem.target_clusters,
        gnm_weight: editingItem.gnm_weight,
        is_boosted: editingItem.is_boosted,
        is_blacklisted: editingItem.is_blacklisted,
        status: editingItem.status
      });
      setItems(prev => prev.map(item => item.id === updated.id ? updated : item));
      setIsEditModalOpen(false);
      setEditingItem(null);
      showNotification(`Topic "${updated.topic}" updated in PostgreSQL`, 'success', 'blessings');
      trendsSwarmConsoleService.getOverview().then(setOverview);
    } catch (err: any) {
      showNotification(err.message || 'Failed to update trend', 'error', 'wahala');
    }
  };

  // Delete Trend
  const handleDeleteItem = async (id: number) => {
    if (!window.confirm(`Permanently remove trend #${id}?`)) return;
    try {
      await trendsSwarmConsoleService.deleteItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
      showNotification(`Topic #${id} purged`, 'info');
      trendsSwarmConsoleService.getOverview().then(setOverview);
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete trend', 'error', 'wahala');
    }
  };

  // Reorder Trend (Atomic swap)
  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const reorders: ReorderEntry[] = newItems.map((item, idx) => ({
      id: item.id,
      display_order: idx + 1
    }));

    setItems(newItems);

    try {
      await trendsSwarmConsoleService.reorderItems(reorders);
      showNotification('Trend priority sequence updated atomically', 'success');
    } catch (err: any) {
      showNotification(err.message || 'Failed to persist order', 'error', 'wahala');
      loadAllData();
    }
  };

  // Toggle Virality Clamp
  const handleToggleClamp = async (mode: 'emergency_clamp' | 'restore_normal') => {
    try {
      const res = await trendsSwarmConsoleService.toggleViralityClamp(mode, selectedCategory !== 'all' ? selectedCategory : undefined);
      showNotification(res.message, 'success', mode === 'emergency_clamp' ? 'boom' : 'blessings');
      setIsClampModalOpen(false);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to toggle clamp', 'error', 'wahala');
    }
  };

  // Spawn Console
  const handleSpawnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spawnData.title || !spawnData.badge) {
      showNotification('Title and Badge are required', 'error', 'wahala');
      return;
    }
    try {
      const created = await trendsSwarmConsoleService.spawnConsole(spawnData);
      setSpawns(prev => [...prev, created]);
      setIsSpawnModalOpen(false);
      showNotification(`Spawned sovereign swarm sentinel "${created.title}"`, 'success', 'gbaski');
      trendsSwarmConsoleService.getOverview().then(setOverview);
    } catch (err: any) {
      showNotification(err.message || 'Failed to spawn sentinel', 'error', 'wahala');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Notification Toast */}
      {notification && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-sm font-bold shadow-lg transition-all ${
          notification.type === 'success'
            ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
            : notification.type === 'error'
            ? 'bg-rose-100 text-rose-950 border-rose-400'
            : 'bg-indigo-100 text-indigo-950 border-indigo-400'
        }`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-800 hover:text-slate-900 font-bold ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-indigo-100 border border-indigo-400 text-indigo-950 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  Trends & Swarms Discovery Microservice Console
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                    Phase 12 Live
                  </span>
                </h1>
                <p className="text-sm font-medium text-slate-700">
                  Autonomous Virality Decay Tuning, Regional Swarms, Keyword Blacklists & GNN Cluster Weights
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsClampModalOpen(true)}
              className="px-4 py-2 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm flex items-center gap-2 transition"
            >
              <ShieldAlert className="w-4 h-4" />
              Virality Clamp Control
            </button>
            <button
              onClick={() => setIsSpawnModalOpen(true)}
              className="px-4 py-2 text-sm font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-sm flex items-center gap-2 transition"
            >
              <Cpu className="w-4 h-4" />
              Spawn Swarm Sentinel
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              Inject Trend Topic
            </button>
            <button
              onClick={loadAllData}
              disabled={isLoading}
              className="p-2 border border-slate-300 rounded-xl hover:bg-slate-100 text-slate-800 transition"
              title="Refresh Live DB"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Pillar 1: Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
            <span>Total Topics</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.total_topics ?? '...'}
          </div>
          <div className="text-xs font-semibold text-emerald-800 mt-1">
            {overview?.active_topics ?? '0'} active on feed
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
            <span>Boosted Swarms</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.boosted_topics ?? '...'}
          </div>
          <div className="text-xs font-semibold text-amber-800 mt-1">
            High-velocity priority
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
            <span>Cumulative Reach</span>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2 truncate">
            {overview?.total_reach ? (Number(overview.total_reach) / 1000000).toFixed(2) + 'M' : '...'}
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-1">
            {overview?.total_posts ? Number(overview.total_posts).toLocaleString() : '0'} posts
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
            <span>Avg Decay Rate</span>
            <Sliders className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.avg_decay_rate ?? '0.085'}
          </div>
          <div className="text-xs font-semibold text-blue-800 mt-1">
            18h virality half-life
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
            <span>Blacklisted</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.blacklisted_topics ?? '0'}
          </div>
          <div className="text-xs font-semibold text-rose-800 mt-1">
            Zero-exposure quarantine
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
            <span>Swarm Shards</span>
            <Radio className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.active_shards ?? '...'}
          </div>
          <div className="text-xs font-semibold text-emerald-800 mt-1">
            {overview?.active_instances ?? '0'} sentinels live
          </div>
        </div>
      </div>

      {/* Pillar 2: Controls & Category Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search trend topics or hashtags..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as TrendCategory | 'all')}
            className="px-3 py-2 text-sm font-bold text-slate-800 border border-slate-300 rounded-xl bg-white"
          >
            <option value="all">All Trend Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-50 px-3 py-2 rounded-xl border border-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={boostedOnlyFilter}
              onChange={e => setBoostedOnlyFilter(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 border-slate-300"
            />
            Boosted Only
          </label>
        </div>
      </div>

      {/* Pillar 3: Active Trends & Swarms Table */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Live Trends & Swarms Registry ({items.length})
          </h2>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-300">
            Real-Time PostgreSQL Sync
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800 uppercase">
              <tr>
                <th className="py-3 px-4 w-16">Seq</th>
                <th className="py-3 px-4">Topic & Category</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Virality Decay</th>
                <th className="py-3 px-4">Velocity & GNN Weight</th>
                <th className="py-3 px-4">Target Clusters</th>
                <th className="py-3 px-4">Reach & Posts</th>
                <th className="py-3 px-4">Flags</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-600 font-medium">
                    No trend topics found matching criteria. Click &quot;Inject Trend Topic&quot; to seed.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => handleReorder(index, 'up')}
                          className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center font-mono">{item.display_order}</span>
                        <button
                          disabled={index === items.length - 1}
                          onClick={() => handleReorder(index, 'down')}
                          className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        {item.topic}
                        {item.is_boosted && (
                          <span className="p-0.5 rounded bg-amber-100 text-amber-950 border border-amber-400" title="Boosted Topic">
                            <Zap className="w-3 h-3 text-amber-700" />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600">{item.category}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-800 border border-slate-300">
                        {item.trend_type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.virality_decay_rate} / hr</div>
                      <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${Math.min(100, item.virality_decay_rate * 500)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-indigo-700">{item.velocity_score} pts</div>
                      <div className="text-xs text-slate-600">GNN: {item.gnm_weight}x</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {Array.isArray(item.target_clusters) && item.target_clusters.slice(0, 3).map(cluster => (
                          <span key={cluster} className="text-[11px] font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-slate-500" />
                            {cluster}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{(Number(item.reach_count) / 1000).toFixed(0)}k reach</div>
                      <div className="text-xs text-slate-600">{Number(item.post_count).toLocaleString()} posts</div>
                    </td>
                    <td className="py-3 px-4">
                      {item.is_blacklisted ? (
                        <span className="text-[10px] font-bold text-rose-950 bg-rose-100 px-2 py-0.5 rounded border border-rose-400">
                          BLACKLISTED
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-400">
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-100"
                          title="Edit Topic"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 text-rose-700 hover:text-rose-900 border border-rose-300 rounded-lg hover:bg-rose-50"
                          title="Delete Topic"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Pillar 4: Spawned Regional Swarm Sentinels */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Active Regional Swarm Sentinels & NLP Pipelines ({spawns.length})
            </h3>
          </div>
          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="px-3 py-1.5 text-xs font-bold text-indigo-950 bg-indigo-100 hover:bg-indigo-200 border border-indigo-400 rounded-xl flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Spawn Swarm Sentinel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spawns.map(spawn => (
            <div key={spawn.id} className="p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-950 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-400">
                  {spawn.badge}
                </span>
                <span className="text-xs font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-400">
                  {spawn.status}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{spawn.title}</h4>
              <p className="text-xs text-slate-700">{spawn.description || 'Regional viral ingestion cluster'}</p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
                <span>Instances: <strong className="text-slate-900">{spawn.active_instances}</strong></span>
                <span className="font-mono text-[11px]">{new Date(spawn.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: Create Trend Topic */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Inject New Trend or Swarm Topic
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-600 hover:text-slate-900 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Topic Name or Hashtag *</label>
                <input
                  type="text"
                  required
                  value={formData.topic}
                  onChange={e => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g. #AfroTech2026 or Lagos Street Food Crawl"
                  className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as TrendCategory })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Trend Type</label>
                  <select
                    value={formData.trend_type}
                    onChange={e => setFormData({ ...formData, trend_type: e.target.value as TrendType })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="hashtag">Hashtag</option>
                    <option value="swarm">Swarm</option>
                    <option value="event">Event</option>
                    <option value="challenge">Challenge</option>
                    <option value="audio_stem">Audio Stem</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Decay Rate (/hr)</label>
                  <input
                    type="number"
                    step="0.005"
                    value={formData.virality_decay_rate}
                    onChange={e => setFormData({ ...formData, virality_decay_rate: parseFloat(e.target.value) || 0.085 })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Velocity Score</label>
                  <input
                    type="number"
                    value={formData.velocity_score}
                    onChange={e => setFormData({ ...formData, velocity_score: parseFloat(e.target.value) || 85 })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">GNN Weight</label>
                  <input
                    type="number"
                    step="0.05"
                    value={formData.gnm_weight}
                    onChange={e => setFormData({ ...formData, gnm_weight: parseFloat(e.target.value) || 1.25 })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Target Geographic Clusters (Comma-separated)</label>
                <input
                  type="text"
                  value={clusterInput}
                  onChange={e => setClusterInput(e.target.value)}
                  placeholder="Lagos, Abuja, Nairobi, Accra, London"
                  className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                />
              </div>

              {/* Direct Multipart Media Badge Upload */}
              <div className="p-4 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 space-y-2">
                <label className="block text-xs font-bold text-indigo-950 uppercase flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-indigo-600" />
                  Upload Topic Badge Asset (JPG / PNG / WEBP)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="w-full text-xs font-bold text-slate-800 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                />
                {uploadedAssetUrl && (
                  <p className="text-xs font-semibold text-indigo-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    Asset persisted: {uploadedAssetUrl}
                  </p>
                )}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-600" />
                  Priority Swarm Boost (Elevates feed ranking)
                </span>
                <input
                  type="checkbox"
                  checked={formData.is_boosted}
                  onChange={e => setFormData({ ...formData, is_boosted: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm"
                >
                  Inject Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Trend */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Edit Topic: {editingItem.topic}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-600 hover:text-slate-900 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Decay Rate (/hr)</label>
                  <input
                    type="number"
                    step="0.005"
                    value={editingItem.virality_decay_rate}
                    onChange={e => setEditingItem({ ...editingItem, virality_decay_rate: parseFloat(e.target.value) || 0.085 })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">GNN Weight</label>
                  <input
                    type="number"
                    step="0.05"
                    value={editingItem.gnm_weight}
                    onChange={e => setEditingItem({ ...editingItem, gnm_weight: parseFloat(e.target.value) || 1.25 })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.is_boosted}
                    onChange={e => setEditingItem({ ...editingItem, is_boosted: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300"
                  />
                  Priority Boost
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-rose-900 bg-rose-50 p-3 rounded-xl border border-rose-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.is_blacklisted}
                    onChange={e => setEditingItem({ ...editingItem, is_blacklisted: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 border-rose-300"
                  />
                  Blacklist Topic
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DefCon Virality Clamp */}
      {isClampModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-rose-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-rose-950 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                DefCon Virality Clamp Control Plane
              </h3>
              <button onClick={() => setIsClampModalOpen(false)} className="text-slate-600 hover:text-slate-900 font-bold">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-700">
              When activated, virality clamp accelerates topic decay to 0.950/hr and cancels active boosts. Used to suppress runaway disinformation spikes, viral exploits, or coordinated bot swarms.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleToggleClamp('emergency_clamp')}
                className="w-full p-3 rounded-xl border border-rose-400 bg-rose-50 hover:bg-rose-100 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-rose-950 text-sm">ACTIVATE Virality Clamp</div>
                  <div className="text-xs text-rose-800">Accelerates decay to 0.950 and strips all boosts</div>
                </div>
                <Flame className="w-4 h-4 text-rose-600" />
              </button>

              <button
                onClick={() => handleToggleClamp('restore_normal')}
                className="w-full p-3 rounded-xl border border-emerald-400 bg-emerald-50 hover:bg-emerald-100 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-emerald-950 text-sm">RESTORE Standard Decay Model</div>
                  <div className="text-xs text-emerald-800">Restores standard 18h half-life (0.085/hr)</div>
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </button>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsClampModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Spawn Swarm Sentinel */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Radio className="w-5 h-5 text-indigo-600" />
                Spawn Regional Swarm Sentinel
              </h3>
              <button onClick={() => setIsSpawnModalOpen(false)} className="text-slate-600 hover:text-slate-900 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSpawnSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Sentinel Title *</label>
                <input
                  type="text"
                  required
                  value={spawnData.title}
                  onChange={e => setSpawnData({ ...spawnData, title: e.target.value })}
                  placeholder="e.g. South-South Niger Delta Trend Pulse"
                  className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Badge ID *</label>
                <input
                  type="text"
                  required
                  value={spawnData.badge}
                  onChange={e => setSpawnData({ ...spawnData, badge: e.target.value })}
                  className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Description</label>
                <textarea
                  value={spawnData.description}
                  onChange={e => setSpawnData({ ...spawnData, description: e.target.value })}
                  placeholder="Regional NLP cluster scope, semantic ingestion weights, or audio stem radar"
                  className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white h-20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSpawnModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm"
                >
                  Spawn Sentinel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterTrendsSwarmConsole;
