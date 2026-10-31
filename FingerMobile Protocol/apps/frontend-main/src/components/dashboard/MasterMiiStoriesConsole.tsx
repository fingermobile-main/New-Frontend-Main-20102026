import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  KeyRound,
  ShieldAlert,
  Flame,
  Upload,
  Plus,
  RefreshCw,
  Search,
  Eye,
  Heart,
  Trash2,
  Edit,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  AlertTriangle,
  Play,
  Cpu,
  Share2,
  Radio,
  Sliders,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import {
  MiiStoryItem,
  MiiStoriesOverview,
  MiiStoriesSpawnedConsole,
  CreateMiiStoryPayload,
  MiiStoryTimerType,
  MiiStoryAudience,
  MiiModerationStatus
} from '../../types/miiStoriesConsole';
import { miiStoriesConsoleService, ReorderEntry } from '../../services/miiStoriesConsoleService';
import superViAudio from '../../services/SuperViAudioEngine';
import SovereignModuleEngagementHub from '../common/SovereignModuleEngagementHub';

export const MasterMiiStoriesConsole: React.FC = () => {
  // 1. Core State
  const [overview, setOverview] = useState<MiiStoriesOverview | null>(null);
  const [items, setItems] = useState<MiiStoryItem[]>([]);
  const [spawns, setSpawns] = useState<MiiStoriesSpawnedConsole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pinFilter, setPinFilter] = useState<string>('all');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // 2. Modals & Actions State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MiiStoryItem | null>(null);
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null);

  // 3. Form States
  const [formData, setFormData] = useState<CreateMiiStoryPayload>({
    author_id: 'usr_lagos_creator_' + Math.floor(Math.random() * 900 + 100),
    author_name: '',
    caption: '',
    media_url: '',
    media_type: 'video',
    duration_seconds: 30,
    timer_type: '48hrs',
    audience_type: 'public',
    pin_handshake_required: false,
    handshake_pin: '123456'
  });

  const [spawnData, setSpawnData] = useState({
    title: '',
    domain: 'mii_stories',
    badge: 'MII-ORBIT-0' + Math.floor(Math.random() * 9 + 3),
    description: '',
    instances: 1
  });

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

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
        miiStoriesConsoleService.getOverview(),
        miiStoriesConsoleService.getItems(searchQuery, statusFilter, pinFilter),
        miiStoriesConsoleService.getSpawns()
      ]);
      setOverview(overviewData);
      setItems(itemsData);
      setSpawns(spawnsData);
    } catch (err: any) {
      console.error('Failed to load Mii Stories data:', err);
      showNotification(err.message || 'Error syncing with PostgreSQL', 'error', 'wahala');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, pinFilter]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Handle direct file upload to Express backend
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(`Ingesting ${file.name} directly to Express...`);
    try {
      const uploadRes = await miiStoriesConsoleService.uploadMedia(file);
      setFormData(prev => ({
        ...prev,
        media_url: uploadRes.url,
        media_type: uploadRes.media_type === 'video' ? 'video' : 'photo'
      }));
      setUploadProgress('');
      showNotification(`Direct multipart upload persisted: ${uploadRes.filename}`, 'success', 'gbaski');
    } catch (err: any) {
      setUploadProgress('');
      showNotification(err.message || 'Media upload failed', 'error', 'wahala');
    } finally {
      setIsUploading(false);
    }
  };

  // Create Story
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author_name || !formData.media_url) {
      showNotification('Author Name and Media URL are required', 'error', 'wahala');
      return;
    }
    try {
      const created = await miiStoriesConsoleService.createItem(formData);
      setItems(prev => [...prev, created]);
      setIsAddModalOpen(false);
      showNotification(`Mii story by "${created.author_name}" published live!`, 'success', 'gbaski');
      miiStoriesConsoleService.getOverview().then(setOverview);
    } catch (err: any) {
      showNotification(err.message || 'Failed to create story', 'error', 'wahala');
    }
  };

  // Edit Story
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const updated = await miiStoriesConsoleService.updateItem(editingItem.id, {
        caption: editingItem.caption,
        duration_seconds: editingItem.duration_seconds,
        timer_type: editingItem.timer_type,
        audience_type: editingItem.audience_type,
        pin_handshake_required: editingItem.pin_handshake_required,
        handshake_pin: editingItem.handshake_pin,
        is_censored: editingItem.is_censored,
        moderation_status: editingItem.moderation_status
      });
      setItems(prev => prev.map(item => item.id === updated.id ? updated : item));
      setIsEditModalOpen(false);
      setEditingItem(null);
      showNotification(`Story #${updated.id} updated live in PostgreSQL`, 'success', 'blessings');
      miiStoriesConsoleService.getOverview().then(setOverview);
    } catch (err: any) {
      showNotification(err.message || 'Failed to update story', 'error', 'wahala');
    }
  };

  // Delete Story
  const handleDeleteItem = async (id: number) => {
    if (!window.confirm(`Permanently purge Mii story #${id}?`)) return;
    try {
      await miiStoriesConsoleService.deleteItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
      showNotification(`Story #${id} purged permanently`, 'info');
      miiStoriesConsoleService.getOverview().then(setOverview);
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete story', 'error', 'wahala');
    }
  };

  // Reorder Item (Atomic swap)
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
      await miiStoriesConsoleService.reorderItems(reorders);
      showNotification('Story sequence updated atomically', 'success');
    } catch (err: any) {
      showNotification(err.message || 'Failed to persist order', 'error', 'wahala');
      loadAllData();
    }
  };

  // Execute DefCon Purge
  const handleExecutePurge = async (scope: 'expired_only' | 'flagged_only' | 'total_vanish') => {
    if (scope === 'total_vanish' && !window.confirm('DEFCON-1 PURGE: This will wipe ALL story cards across the network! Confirm?')) {
      return;
    }
    try {
      const res = await miiStoriesConsoleService.defconPurge(scope);
      showNotification(res.message, 'success', 'boom');
      setIsPurgeModalOpen(false);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Purge execution failed', 'error', 'wahala');
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
      const created = await miiStoriesConsoleService.spawnConsole(spawnData);
      setSpawns(prev => [...prev, created]);
      setIsSpawnModalOpen(false);
      showNotification(`Spawned sovereign console "${created.title}"`, 'success', 'gbaski');
      miiStoriesConsoleService.getOverview().then(setOverview);
    } catch (err: any) {
      showNotification(err.message || 'Failed to spawn console', 'error', 'wahala');
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
              <span className="p-2.5 bg-rose-100 border border-rose-400 text-rose-950 rounded-xl">
                <Flame className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  Mii Ephemeral 48h Stories & Social Console
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                    Phase 10 Live
                  </span>
                </h1>
                <p className="text-sm font-medium text-slate-700">
                  Autonomous 48h TTL Lifecycle, 6-Digit PIN Handshakes, Direct Multipart Ingestion & DefCon Vanish
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsPurgeModalOpen(true)}
              className="px-4 py-2 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm flex items-center gap-2 transition"
            >
              <ShieldAlert className="w-4 h-4" />
              DefCon Purge Killswitch
            </button>
            <button
              onClick={() => setIsSpawnModalOpen(true)}
              className="px-4 py-2 text-sm font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-sm flex items-center gap-2 transition"
            >
              <Cpu className="w-4 h-4" />
              Spawn Orbit Console
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              Publish Story Card
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
            <span>Total Stories</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.total_stories ?? '...'}
          </div>
          <div className="text-xs font-semibold text-emerald-800 mt-1">
            {overview?.live_stories ?? '0'} active in 48h pool
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
            <span>PIN Protected</span>
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.pin_protected_stories ?? '...'}
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-1">
            6-digit mutual handshake
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
            <span>Expired / Purged</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.expired_stories ?? '0'}
          </div>
          <div className="text-xs font-semibold text-emerald-800 mt-1">
            Zero residue protocol
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
            <span>Cumulative Views</span>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.total_views ? Number(overview.total_views).toLocaleString() : '...'}
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-1">
            Tracked in PostgreSQL
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
            <span>Reactions</span>
            <Heart className="w-4 h-4 text-pink-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.total_reactions ? Number(overview.total_reactions).toLocaleString() : '...'}
          </div>
          <div className="text-xs font-semibold text-pink-800 mt-1">
            Live stickers & hearts
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
            <span>Orbit Clusters</span>
            <Radio className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.active_orbit_spawns ?? '...'}
          </div>
          <div className="text-xs font-semibold text-blue-800 mt-1">
            {overview?.active_instances ?? '0'} live nodes
          </div>
        </div>
      </div>

      {/* Sovereign Engagement & Activity Console */}
      <SovereignModuleEngagementHub module="mii" />

      {/* Pillar 2: Controls & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search stories by author, caption, or user ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm font-bold text-slate-800 border border-slate-300 rounded-xl bg-white"
          >
            <option value="all">All Moderation Statuses</option>
            <option value="active">Active Only</option>
            <option value="under_review">Under Review</option>
            <option value="banned">Banned / Censored</option>
          </select>

          <select
            value={pinFilter}
            onChange={e => setPinFilter(e.target.value)}
            className="px-3 py-2 text-sm font-bold text-slate-800 border border-slate-300 rounded-xl bg-white"
          >
            <option value="all">All Access Modes</option>
            <option value="true">PIN Protected Only</option>
            <option value="false">Public Direct Only</option>
          </select>
        </div>
      </div>

      {/* Pillar 3: Active Stories Live Table */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-600" />
            Live Mii Ephemeral Stories Directory ({items.length})
          </h2>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-300">
            Ordered by Atomic Sequence
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800 uppercase">
              <tr>
                <th className="py-3 px-4 w-16">Seq</th>
                <th className="py-3 px-4">Author & Caption</th>
                <th className="py-3 px-4">Media</th>
                <th className="py-3 px-4">Duration / TTL</th>
                <th className="py-3 px-4">PIN Handshake</th>
                <th className="py-3 px-4">Audience</th>
                <th className="py-3 px-4">Engagement</th>
                <th className="py-3 px-4">Moderation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-600 font-medium">
                    No Mii stories found matching criteria. Click &quot;Publish Story Card&quot; to ingest.
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
                      <div className="font-bold text-slate-900">{item.author_name}</div>
                      <div className="text-xs text-slate-700 line-clamp-1">{item.caption || 'No caption'}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">{item.author_id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <button type="button" aria-label="Play"
                        onClick={() => setPreviewMediaUrl(item.media_url)}
                        className="px-2.5 py-1 text-xs font-bold text-indigo-950 bg-indigo-100 hover:bg-indigo-200 border border-indigo-400 rounded-lg flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3 text-indigo-700" />
                        {item.media_type.toUpperCase()}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.duration_seconds}s</div>
                      <div className="text-xs font-semibold text-slate-700">TTL: {item.timer_type}</div>
                      <div className="text-[11px] text-rose-700 font-semibold mt-0.5">
                        Exp: {new Date(item.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {item.pin_handshake_required ? (
                        <div className="flex items-center gap-1.5">
                          <span className="p-1 rounded bg-amber-100 text-amber-950 border border-amber-400">
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                          <span className="font-mono text-xs font-bold text-amber-950 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-300">
                            PIN: {item.handshake_pin}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                          <Unlock className="w-3.5 h-3.5 text-slate-500" />
                          Open Public
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold capitalize bg-slate-100 text-slate-800 border border-slate-300">
                        {item.audience_type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        {Number(item.views_count).toLocaleString()} views
                      </div>
                      <div className="text-xs font-semibold text-pink-700 flex items-center gap-1 mt-0.5">
                        <Heart className="w-3.5 h-3.5 text-pink-600" />
                        {Number(item.reactions_count).toLocaleString()} reactions
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        item.moderation_status === 'active'
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                          : item.moderation_status === 'under_review'
                          ? 'bg-amber-100 text-amber-950 border border-amber-400'
                          : 'bg-rose-100 text-rose-950 border border-rose-400'
                      }`}>
                        {item.moderation_status}
                      </span>
                      {item.is_censored && (
                        <span className="ml-1 text-[10px] font-bold text-rose-950 bg-rose-200 px-1.5 py-0.5 rounded border border-rose-400">
                          CENSORED
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
                          title="Edit Story"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 text-rose-700 hover:text-rose-900 border border-rose-300 rounded-lg hover:bg-rose-50"
                          title="Delete / Purge"
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

      {/* Pillar 4: Dynamic Spawned Orbit Consoles Directory */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Active Mii Orbit & PIN Handshake Enclaves ({spawns.length})
            </h3>
          </div>
          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="px-3 py-1.5 text-xs font-bold text-indigo-950 bg-indigo-100 hover:bg-indigo-200 border border-indigo-400 rounded-xl flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Spawn Cluster
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
              <p className="text-xs text-slate-700">{spawn.description || 'Dedicated sovereign Mii node'}</p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
                <span>Instances: <strong className="text-slate-900">{spawn.active_instances}</strong></span>
                <span className="font-mono text-[11px]">{new Date(spawn.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: Create Story */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-600" />
                Publish Live Mii Story Card
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-600 hover:text-slate-900 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.author_name}
                    onChange={e => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="e.g. Tunde AfroBeats"
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Author User ID</label>
                  <input
                    type="text"
                    value={formData.author_id}
                    onChange={e => setFormData({ ...formData, author_id: e.target.value })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Story Caption</label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={e => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="What is happening right now in your orbit? #Beatwave #LagosLive"
                  className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                />
              </div>

              {/* Direct Multipart File Ingestion */}
              <div className="p-4 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 space-y-2">
                <label className="block text-xs font-bold text-indigo-950 uppercase flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-indigo-600" />
                  Direct Multipart Upload to Express (Video / Photo)
                </label>
                <input
                  type="file"
                  accept="video/*,image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="w-full text-xs font-bold text-slate-800 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                />
                {isUploading && (
                  <p className="text-xs font-semibold text-indigo-800 animate-pulse">{uploadProgress}</p>
                )}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Or Direct Media URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.media_url}
                    onChange={e => setFormData({ ...formData, media_url: e.target.value })}
                    placeholder="https://assets.fingermobile.net/stories/my_story.mp4"
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Duration (Secs)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={formData.duration_seconds}
                    onChange={e => setFormData({ ...formData, duration_seconds: parseFloat(e.target.value) || 30 })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">TTL Timer</label>
                  <select
                    value={formData.timer_type}
                    onChange={e => setFormData({ ...formData, timer_type: e.target.value as MiiStoryTimerType })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="24hrs">24 Hours</option>
                    <option value="48hrs">48 Hours (Standard)</option>
                    <option value="72hrs">72 Hours</option>
                    <option value="infinite_archive">Infinite Archive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Audience</label>
                  <select
                    value={formData.audience_type}
                    onChange={e => setFormData({ ...formData, audience_type: e.target.value as MiiStoryAudience })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="public">Public Network</option>
                    <option value="followers">Followers Only</option>
                    <option value="close_friends">Close Friends Orbit</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-600" />
                    Require 6-Digit PIN Mutual Handshake
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.pin_handshake_required}
                    onChange={e => setFormData({ ...formData, pin_handshake_required: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300"
                  />
                </div>
                {formData.pin_handshake_required && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">6-Digit PIN Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.handshake_pin}
                      onChange={e => setFormData({ ...formData, handshake_pin: e.target.value })}
                      placeholder="e.g. 749210"
                      className="w-36 px-3 py-1.5 text-sm font-mono font-bold text-slate-900 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                )}
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
                  Publish Story Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Story */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Edit Story #{editingItem.id} ({editingItem.author_name})
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-600 hover:text-slate-900 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Caption</label>
                <textarea
                  rows={2}
                  value={editingItem.caption}
                  onChange={e => setEditingItem({ ...editingItem, caption: e.target.value })}
                  className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Duration (Secs)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={editingItem.duration_seconds}
                    onChange={e => setEditingItem({ ...editingItem, duration_seconds: parseFloat(e.target.value) || 30 })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Moderation Status</label>
                  <select
                    value={editingItem.moderation_status}
                    onChange={e => setEditingItem({ ...editingItem, moderation_status: e.target.value as MiiModerationStatus })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="under_review">Under Review</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">PIN Handshake Required</span>
                  <input
                    type="checkbox"
                    checked={editingItem.pin_handshake_required}
                    onChange={e => setEditingItem({ ...editingItem, pin_handshake_required: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300"
                  />
                </div>
                {editingItem.pin_handshake_required && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">6-Digit PIN</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={editingItem.handshake_pin}
                      onChange={e => setEditingItem({ ...editingItem, handshake_pin: e.target.value })}
                      className="w-36 px-3 py-1.5 text-sm font-mono font-bold text-slate-900 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-xs font-bold text-rose-800">Censor Card Media</span>
                  <input
                    type="checkbox"
                    checked={editingItem.is_censored}
                    onChange={e => setEditingItem({ ...editingItem, is_censored: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 border-slate-300"
                  />
                </div>
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

      {/* MODAL 3: DefCon Purge Killswitch */}
      {isPurgeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-rose-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-rose-950 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                DefCon Vanishing Purge Killswitch
              </h3>
              <button onClick={() => setIsPurgeModalOpen(false)} className="text-slate-600 hover:text-slate-900 font-bold">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-700">
              Immediate zero-residue wipe across PostgreSQL and Redis memory pools. Select the desired purge scope:
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleExecutePurge('expired_only')}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">Purge Expired Only</div>
                  <div className="text-xs text-slate-600">Removes cards that exceeded 48h TTL</div>
                </div>
                <Clock className="w-4 h-4 text-indigo-600" />
              </button>

              <button
                onClick={() => handleExecutePurge('flagged_only')}
                className="w-full p-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-amber-950 text-sm">Purge Censored & Banned</div>
                  <div className="text-xs text-amber-800">Immediately purges all flagged stories</div>
                </div>
                <ShieldAlert className="w-4 h-4 text-amber-600" />
              </button>

              <button
                onClick={() => handleExecutePurge('total_vanish')}
                className="w-full p-3 rounded-xl border border-rose-400 bg-rose-50 hover:bg-rose-100 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-rose-950 text-sm">DEFCON-1: Total Network Vanish</div>
                  <div className="text-xs text-rose-800">Wipes ALL stories across all creators</div>
                </div>
                <Flame className="w-4 h-4 text-rose-600" />
              </button>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsPurgeModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Spawn Orbit Console */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-600" />
                Spawn Sovereign Orbit Cluster
              </h3>
              <button onClick={() => setIsSpawnModalOpen(false)} className="text-slate-600 hover:text-slate-900 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSpawnSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Console Title *</label>
                <input
                  type="text"
                  required
                  value={spawnData.title}
                  onChange={e => setSpawnData({ ...spawnData, title: e.target.value })}
                  placeholder="e.g. Lagos West Orbit Hub"
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
                  placeholder="Target geography, shard capacity, or private syndicate rules"
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
                  Spawn Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEDIA PREVIEW POPUP */}
      {previewMediaUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black border border-slate-700 rounded-2xl max-w-xl w-full p-4 space-y-3 relative text-white">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-300 truncate max-w-md">{previewMediaUrl}</span>
              <button onClick={() => setPreviewMediaUrl(null)} className="text-white hover:text-rose-400 font-bold text-lg">
                ✕
              </button>
            </div>
            <div className="aspect-[9/16] max-h-[70vh] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
              {previewMediaUrl.endsWith('.mp4') || previewMediaUrl.includes('video') ? (
                <video src={previewMediaUrl} controls autoPlay className="w-full h-full object-contain" />
              ) : (
                <img src={previewMediaUrl} alt="Story Card Preview" className="w-full h-full object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterMiiStoriesConsole;
