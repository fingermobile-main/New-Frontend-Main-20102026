import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Sparkles,
  Award,
  Users,
  FileText,
  Compass,
  TrendingUp,
  Video,
  Layers,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Edit3,
  Snowflake,
  Play,
  Volume2,
  Upload,
  ExternalLink,
  Shield,
  Coins,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  Eye,
  Tag
} from 'lucide-react';
import {
  CommunityServiceKey,
  CommunityConsoleItem,
  CommunityServiceOverview,
  SpawnedConsole
} from '../../types/communitiesConsole';
import communitiesConsoleService from '../../services/communitiesConsoleService';
import audioEngine from '../../services/SuperViAudioEngine';
import { useAppContext } from '../../contexts/AppContext';
import SovereignModuleEngagementHub from '../common/SovereignModuleEngagementHub';

// 11 Community Microservices Definition
export const COMMUNITY_SERVICES: {
  key: CommunityServiceKey;
  name: string;
  route: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  defaultCategory: string;
}[] = [
  {
    key: 'forum',
    name: 'ForumPage',
    route: '/forum',
    category: 'Discussion & Governance',
    icon: MessageSquare,
    description: 'Community threads, category pinning, moderation queues, and topic governance.',
    defaultCategory: 'Technology'
  },
  {
    key: 'mii',
    name: 'Mii Status',
    route: '/mii',
    category: 'Ephemeral Social',
    icon: Sparkles,
    description: '48-hour ephemeral story streams, 6-digit PIN verification, and vanishing media.',
    defaultCategory: 'Ephemeral Reel'
  },
  {
    key: 'fingershorts',
    name: 'FingerShorts',
    route: '/fingershorts',
    category: 'Short Video & Sounds',
    icon: Video,
    description: 'Bite-sized vertical video sessions, audio stem duets, and viral dance challenges.',
    defaultCategory: 'Gaming'
  },
  {
    key: 'groups',
    name: 'Groups & DAOs',
    route: '/groups',
    category: 'Sub-Communities',
    icon: Users,
    description: 'Private guilds, developer hubs, moderator delegation, and community rules.',
    defaultCategory: 'Private DAO'
  },
  {
    key: 'gems',
    name: 'Gems Marketplace',
    route: '/gems',
    category: 'Premium Assets',
    icon: Award,
    description: 'Curated 3D digital twins, historical regalia, and subscriber-gated content.',
    defaultCategory: 'Rare Gem'
  },
  {
    key: 'blogs',
    name: 'Blogs & Articles',
    route: '/blogs',
    category: 'Long-Form Editorial',
    icon: FileText,
    description: 'Long-form editorial essays, author reading lists, and rich media articles.',
    defaultCategory: 'Engineering'
  },
  {
    key: 'hallmarks',
    name: 'Hallmarks Registry',
    route: '/hallmarks',
    category: 'Achievements & Milestones',
    icon: Shield,
    description: 'Verification badges, centurion milestones, and sovereign protocol laurels.',
    defaultCategory: 'Platform Tier'
  },
  {
    key: 'discover',
    name: 'Discover Members',
    route: '/discover',
    category: 'Talent Recommendation',
    icon: Compass,
    description: 'Algorithmic creator matching, geo-located artisans, and featured innovators.',
    defaultCategory: 'Creator Spotlight'
  },
  {
    key: 'discovery',
    name: 'Discovery Hub',
    route: '/discovery',
    category: 'Cross-Platform Feeds',
    icon: Layers,
    description: 'Universal cross-platform synergy grid connecting all 11 community domains.',
    defaultCategory: 'Universal Hub'
  },
  {
    key: 'tribute',
    name: 'Tribute Atelier',
    route: '/tribut',
    category: 'Afro-Cultural Design',
    icon: Tag,
    description: 'Adire fashion lookbooks, textile blueprints, and indigenous maker boards.',
    defaultCategory: 'Lookbook'
  },
  {
    key: 'trends',
    name: 'Trends Sentinel',
    route: '/trends',
    category: 'Algorithmic Velocity',
    icon: TrendingUp,
    description: 'Real-time hashtag velocity, viral challenge tracking, and ecosystem buzz.',
    defaultCategory: 'Gaming Trend'
  }
];

export const MasterCommunitiesConsole: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  // Active Service State
  const [activeService, setActiveService] = useState<CommunityServiceKey>('forum');
  const [overview, setOverview] = useState<Record<CommunityServiceKey, CommunityServiceOverview> | null>(null);
  const [items, setItems] = useState<CommunityConsoleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CommunityConsoleItem | null>(null);
  const [isSpawnerModalOpen, setIsSpawnerModalOpen] = useState<boolean>(false);
  const [isMediaUploadModalOpen, setIsMediaUploadModalOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State for Create/Edit
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    description: '',
    media_url: '',
    media_type: 'image' as 'image' | 'video' | 'audio' | 'document',
    status: 'active' as 'active' | 'frozen' | 'draft',
    fic_bounty: 0,
    tags: '',
    voice_prompt: 'owo_ni_koko',
    author_name: 'Platform Admin'
  });

  // Console Spawner Form State
  const [spawnerData, setSpawnerData] = useState({
    console_id: '',
    name: '',
    service_key: 'forum',
    route: '/forum',
    description: ''
  });

  // Spawned Consoles List
  const [spawnedConsoles, setSpawnedConsoles] = useState<SpawnedConsole[]>([]);

  // Load Overview Data
  const loadOverview = useCallback(async () => {
    try {
      const data = await communitiesConsoleService.getOverview();
      setOverview(data);
    } catch (_err) {
      // Graceful fallback
    }
  }, []);

  // Load Service Items
  const loadServiceItems = useCallback(async (service: CommunityServiceKey) => {
    setLoading(true);
    try {
      const result = await communitiesConsoleService.getServiceItems(service, {
        search: searchQuery,
        status: statusFilter,
        category: categoryFilter
      });
      setItems(result.items);
    } catch (_err) {
      showToast('Failed to load community items from database', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, categoryFilter, showToast]);

  // Load Spawned Consoles
  const loadSpawnedConsoles = useCallback(async () => {
    try {
      const spawns = await communitiesConsoleService.getSpawnedConsoles();
      setSpawnedConsoles(spawns);
    } catch (_err) {
      // Graceful fallback
    }
  }, []);

  useEffect(() => {
    loadOverview();
    loadSpawnedConsoles();
  }, [loadOverview, loadSpawnedConsoles]);

  useEffect(() => {
    loadServiceItems(activeService);
  }, [activeService, loadServiceItems]);

  // Toggle Freeze Handler
  const handleToggleFreeze = async (id: number) => {
    try {
      const updated = await communitiesConsoleService.toggleFreeze(activeService, id);
      setItems(prev => prev.map(item => item.id === id ? updated : item));
      loadOverview();
      audioEngine.playVoiceLine('wahala');
      showToast(`Item #${id} is now ${updated.status.toUpperCase()}`, 'info');
    } catch (_err) {
      showToast('Error toggling freeze state', 'error');
    }
  };

  // Move Item Up / Down (Reorder)
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const current = newItems[index];
    const target = newItems[targetIndex];

    // Swap display_order
    const tempOrder = current.display_order;
    current.display_order = target.display_order;
    target.display_order = tempOrder;

    // Swap positions in array
    newItems[index] = target;
    newItems[targetIndex] = current;
    setItems(newItems);

    try {
      await communitiesConsoleService.reorderItems(activeService, [
        { id: current.id, display_order: current.display_order },
        { id: target.id, display_order: target.display_order }
      ]);
      audioEngine.playVoiceLine('sweet');
      showToast('Item arrangement saved to PostgreSQL live!', 'success');
    } catch (_err) {
      showToast('Failed to persist order to database', 'error');
      loadServiceItems(activeService);
    }
  };

  // Delete Item Handler
  const handleDeleteItem = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete item #${id}?`)) return;
    try {
      await communitiesConsoleService.deleteItem(activeService, id);
      setItems(prev => prev.filter(i => i.id !== id));
      loadOverview();
      showToast(`Item #${id} deleted from database`, 'success');
    } catch (_err) {
      showToast('Error deleting item', 'error');
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    const currentConfig = COMMUNITY_SERVICES.find(s => s.key === activeService);
    setFormData({
      title: '',
      slug: '',
      category: currentConfig?.defaultCategory || 'General',
      description: '',
      media_url: '',
      media_type: 'image',
      status: 'active',
      fic_bounty: 50,
      tags: '',
      voice_prompt: 'owo_ni_koko',
      author_name: 'Platform Admin'
    });
    setEditingItem(null);
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: CommunityConsoleItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      category: item.category,
      description: item.description,
      media_url: item.media_url,
      media_type: item.media_type,
      status: item.status as 'active' | 'frozen' | 'draft',
      fic_bounty: Number(item.fic_bounty) || 0,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
      voice_prompt: item.voice_prompt || 'owo_ni_koko',
      author_name: item.author_name || 'Platform Admin'
    });
    setIsCreateModalOpen(true);
  };

  // Save Item (Create or Update)
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      ...formData,
      tags: tagArray
    };

    try {
      if (editingItem) {
        const updated = await communitiesConsoleService.updateItem(activeService, editingItem.id, payload);
        setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
        showToast(`Item "${updated.title}" updated in PostgreSQL!`, 'success');
      } else {
        const created = await communitiesConsoleService.createItem(activeService, payload);
        setItems(prev => [created, ...prev]);
        showToast(`Item "${created.title}" published live to database!`, 'success');
      }
      setIsCreateModalOpen(false);
      loadOverview();
      audioEngine.playVoiceLine('blessings');
    } catch (_err) {
      showToast('Error saving item to database', 'error');
    }
  };

  // Direct Multipart Media File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(35);
    try {
      const res = await communitiesConsoleService.uploadMedia(file);
      setUploadProgress(100);
      setUploadedUrl(res.url);
      setFormData(prev => ({ ...prev, media_url: res.url }));
      audioEngine.playVoiceLine('owo_ni_koko');
      showToast(`Media "${file.name}" uploaded to server storage!`, 'success');
    } catch (_err) {
      showToast('Media upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // One-Click Console Spawner Handler
  const handleSpawnConsole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await communitiesConsoleService.spawnConsole(spawnerData);
      setSpawnedConsoles(prev => [res, ...prev]);
      setIsSpawnerModalOpen(false);
      audioEngine.playVoiceLine('colossal_combo');
      showToast(`Spawned console "${res.name}" successfully!`, 'success');
    } catch (_err) {
      showToast('Failed to spawn console', 'error');
    }
  };

  const activeConfig = COMMUNITY_SERVICES.find(s => s.key === activeService) || COMMUNITY_SERVICES[0];
  const activeOverview = overview?.[activeService];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Platform Console Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-300 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-950 border border-purple-300 uppercase">
              Phase 1: Communities Control Plane
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
              11 Microservices Active
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
              Zero-Code Governance
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span>Communities Master Console</span>
            <span className="text-sm font-normal text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
              Total Micromanagement Suite
            </span>
          </h1>
          <p className="text-slate-700 text-sm max-w-3xl leading-relaxed">
            Directly micromanage, rearrange, freeze, and publish across all 11 community microservices. Upload media via multipart/form-data, set FIC bounties, reorder layout weights, and spawn working consoles with one click.
          </p>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setSpawnerData({
                console_id: `console-${Date.now()}`,
                name: `${activeConfig.name} Custom Operations`,
                service_key: activeService,
                route: activeConfig.route,
                description: `Dedicated administrative sub-console for ${activeConfig.name}.`
              });
              setIsSpawnerModalOpen(true);
            }}
            className="min-h-[44px] py-2.5 px-4 rounded-xl font-bold text-xs bg-purple-700 hover:bg-purple-800 text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Layers className="w-4 h-4" />
            <span>Spawn New Console</span>
          </button>

          <button
            onClick={() => setIsMediaUploadModalOpen(true)}
            className="min-h-[44px] py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Upload Media</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="min-h-[44px] py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Item</span>
          </button>
        </div>
      </div>

      {/* 11 Community Microservices Switcher Bar */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-300 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {COMMUNITY_SERVICES.map((srv) => {
            const Icon = srv.icon;
            const isSelected = activeService === srv.key;
            const srvData = overview?.[srv.key];
            const isFrozen = (srvData?.frozenItems || 0) > 0;

            return (
              <button
                key={srv.key}
                onClick={() => {
                  setActiveService(srv.key);
                  audioEngine.playVoiceLine('small_combo');
                }}
                className={`min-h-[44px] py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2.5 shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                <span>{srv.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : isFrozen
                      ? 'bg-amber-100 text-amber-950 border border-amber-300'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {srvData?.totalItems ?? 3}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Service Telemetry & Operational Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl border border-slate-300 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase">
              {activeConfig.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700">
              Assigned Route: {activeConfig.route}
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">{activeConfig.name} Microservice</h2>
          <p className="text-slate-300 text-xs max-w-2xl">{activeConfig.description}</p>
        </div>

        {/* Live Metrics Quad */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Items</span>
            <span className="text-xl font-black text-white mt-0.5 block">{activeOverview?.totalItems ?? items.length}</span>
            <span className="text-[10px] font-bold text-emerald-400">PostgreSQL</span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Status</span>
            <span className="text-xl font-black text-emerald-400 mt-0.5 block">{activeOverview?.activeItems ?? items.filter(i => i.status === 'active').length}</span>
            <span className="text-[10px] font-bold text-slate-400">Live Traffic</span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Frozen Items</span>
            <span className="text-xl font-black text-amber-400 mt-0.5 block">{activeOverview?.frozenItems ?? items.filter(i => i.status === 'frozen').length}</span>
            <span className="text-[10px] font-bold text-amber-300">Defcon Stasis</span>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">FIC Economy</span>
            <span className="text-xl font-black text-purple-300 mt-0.5 block">{activeOverview?.totalBountyFic ?? 450} FIC</span>
            <span className="text-[10px] font-bold text-purple-400">Total Bounty</span>
          </div>
        </div>

        <div className="flex md:flex-col justify-end gap-2 shrink-0">
          <button
            onClick={() => navigate(activeConfig.route)}
            className="min-h-[44px] py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Launch Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sovereign Engagement & Activity Hub (Granular Comments, Mentions, Connects, Responded, Activity Log) */}
      <SovereignModuleEngagementHub
        module={(activeService as any) || 'all'}
        title={`${activeConfig.name} Live Engagement & Activity Command`}
        subtitle={`Live monitoring of comments, mentions, connection links, response states and complete activity audit trail for ${activeConfig.name}.`}
      />

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${activeConfig.name} items by title, slug, or tags...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[44px] pl-9 pr-4 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-h-[44px] py-2 px-3 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="frozen">Frozen Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
          <span>Arrangement:</span>
          <span className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200 text-slate-800 font-bold">
            Order by Display Weight (▲ Up / ▼ Down)
          </span>
        </div>
      </div>

      {/* Dynamic Feature & Items Table */}
      <div className="bg-white rounded-3xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
              {activeConfig.name} Live Entities ({items.length})
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-700">
            Real-Time PostgreSQL Mirror
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-700 text-sm font-semibold">
            Connecting to PostgreSQL and fetching {activeConfig.name} records...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-bold text-slate-800">No items found matching the filter criteria.</p>
            <button
              onClick={handleOpenCreateModal}
              className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Create First {activeConfig.name} Item
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center w-24">Order / Move</th>
                  <th className="py-3.5 px-4">Entity Details</th>
                  <th className="py-3.5 px-4">Category &amp; Tags</th>
                  <th className="py-3.5 px-4">FIC Bounty</th>
                  <th className="py-3.5 px-4">Voice FX</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Autonomous Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, idx) => {
                  const isFrozen = item.status === 'frozen';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Reorder Buttons (Up / Down) */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleMoveOrder(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 transition-colors"
                            title="Move Feature Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-mono font-black text-slate-900 w-5">
                            #{item.display_order}
                          </span>
                          <button
                            onClick={() => handleMoveOrder(idx, 'down')}
                            disabled={idx === items.length - 1}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 transition-colors"
                            title="Move Feature Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Entity Details */}
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-3">
                          {item.media_url ? (
                            <img
                              src={item.media_url}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-500 shrink-0 font-bold text-xs">
                              {item.media_type.toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-black text-slate-900 block text-sm leading-snug">
                              {item.title}
                            </span>
                            <span className="text-xs font-mono text-blue-600 block">
                              /{item.slug}
                            </span>
                            <p className="text-xs text-slate-700 mt-1 line-clamp-1 max-w-md">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category & Tags */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 block w-max mb-1">
                          {item.category}
                        </span>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(item.tags || []).map((t, tidx) => (
                            <span
                              key={tidx}
                              className="text-[10px] font-bold text-slate-600 bg-slate-50 px-1.5 py-0.2 rounded border border-slate-200"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* FIC Bounty */}
                      <td className="py-4 px-4 font-black text-emerald-950">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-950 border border-emerald-300 text-xs font-black inline-flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-emerald-700" />
                          <span>+{Number(item.fic_bounty)} FIC</span>
                        </span>
                      </td>

                      {/* Voice Prompt Preview */}
                      <td className="py-4 px-4">
                        {item.voice_prompt ? (
                          <button
                            onClick={() => audioEngine.playVoiceLine(item.voice_prompt as any)}
                            className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 flex items-center gap-1.5 text-xs font-bold transition-colors"
                            title="Preview African Commentary Voice Line"
                          >
                            <Volume2 className="w-4 h-4 text-amber-700" />
                            <span className="capitalize">{item.voice_prompt.replace('_', ' ')}</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">None</span>
                        )}
                      </td>

                      {/* Status & Freeze Toggle */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                            isFrozen
                              ? 'bg-amber-100 text-amber-950 border-amber-400'
                              : 'bg-emerald-100 text-emerald-950 border-emerald-400'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleFreeze(item.id)}
                            className={`p-2 rounded-xl font-bold text-xs border transition-colors flex items-center gap-1 ${
                              isFrozen
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-300'
                                : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300'
                            }`}
                            title={isFrozen ? 'Unfreeze and reactivate feature' : 'Freeze feature (Defcon state)'}
                          >
                            <Snowflake className="w-3.5 h-3.5" />
                            <span>{isFrozen ? 'Unfreeze' : 'Freeze'}</span>
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
                            title="Edit Item Metadata"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Spawned Sub-Consoles Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-300 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" />
              <span>One-Click Generated Sub-Consoles ({spawnedConsoles.length})</span>
            </h3>
            <p className="text-xs text-slate-700">Autonomous operational dashboards spawned dynamically with zero code deployments.</p>
          </div>
          <button
            onClick={() => setIsSpawnerModalOpen(true)}
            className="py-2 px-3.5 rounded-xl font-bold text-xs bg-purple-700 hover:bg-purple-800 text-white transition-colors"
          >
            Spawn Another Console
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {spawnedConsoles.map((c) => (
            <div key={c.id} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-950 uppercase">{c.service_key}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
                  {c.status.toUpperCase()} &bull; {c.health_score}%
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-900">{c.name}</h4>
              <p className="text-xs text-slate-700 line-clamp-2">{c.description}</p>
              <div className="pt-2 border-t border-purple-200 flex items-center justify-between">
                <span className="text-xs font-mono text-purple-800 font-bold">{c.route}</span>
                <button
                  onClick={() => navigate(c.route)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Launch</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODAL 1: CREATE / EDIT ITEM MODAL                                     */}
      {/* ===================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-300 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase">
                  {activeConfig.name} &bull; Live Entity Configuration
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {editingItem ? `Edit: ${editingItem.title}` : `Create New ${activeConfig.name} Item`}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Item Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Lekki Tech Hub Meetup"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">Vanity URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="auto-generated-if-empty"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                  >
                    <option value="active">Active (Published)</option>
                    <option value="frozen">Frozen (Suspended)</option>
                    <option value="draft">Draft (Unpublished)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">FIC Bounty / Price</label>
                  <input
                    type="number"
                    value={formData.fic_bounty}
                    onChange={(e) => setFormData({ ...formData, fic_bounty: Number(e.target.value) })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 font-medium text-slate-900 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detailed description of the feature or community entity..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Media URL or Upload</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.media_url}
                      onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                      className="flex-1 p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                      placeholder="/images/supervi-banner.png"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-300 flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>File</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">Voice Line Prompt FX</label>
                  <select
                    value={formData.voice_prompt}
                    onChange={(e) => setFormData({ ...formData, voice_prompt: e.target.value })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                  >
                    <option value="owo_ni_koko">Owo Ni Koko (Wealth Voice)</option>
                    <option value="colossal_combo">Colossal Combo (Triumph Voice)</option>
                    <option value="blessings">Blessings Blessings (Abundance)</option>
                    <option value="sweet">Sweet (Praise Voice)</option>
                    <option value="stunning">Stunning (Aesthetic Voice)</option>
                    <option value="madt_o">Madt O (Shock/Excitement)</option>
                    <option value="wahala">Wahala Dey (Warning/Freeze)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                  placeholder="Web3, Fashion, SuperVi, Lagos"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md"
                >
                  {editingItem ? 'Save Changes' : 'Publish to PostgreSQL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: DIRECT MEDIA UPLOAD (MULTIPART/FORM-DATA)                    */}
      {/* ===================================================================== */}
      {isMediaUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-300 w-full max-w-lg shadow-2xl p-6 space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                <span>Direct Media Uploader (Multipart Form)</span>
              </h3>
              <button
                onClick={() => setIsMediaUploadModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-700">
              Upload videos for FingerShorts &amp; Mii, audio tracks for Beatwave, or lookbook photography for Tribute. Files are written directly to backend storage.
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-3 bg-slate-50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div>
                <label className="cursor-pointer font-black text-xs text-blue-600 hover:underline">
                  Click to select file from device
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-500 block mt-1">Supports PNG, JPG, MP4, MP3 up to 50MB</span>
              </div>
            </div>

            {isUploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Uploading to Express backend...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {uploadedUrl && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 space-y-1 text-xs">
                <span className="font-bold text-emerald-950 block">Upload Complete:</span>
                <span className="font-mono text-emerald-900 block break-all">{uploadedUrl}</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsMediaUploadModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: ONE-CLICK CONSOLE SPAWNER                                    */}
      {/* ===================================================================== */}
      {isSpawnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-300 w-full max-w-lg shadow-2xl p-6 space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                <span>One-Click Console Spawner Engine</span>
              </h3>
              <button
                onClick={() => setIsSpawnerModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-700">
              Instantly scaffold and register a new autonomous operational console for any community entity or sub-domain.
            </p>

            <form onSubmit={handleSpawnConsole} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-900 block mb-1">Console ID *</label>
                <input
                  type="text"
                  required
                  value={spawnerData.console_id}
                  onChange={(e) => setSpawnerData({ ...spawnerData, console_id: e.target.value })}
                  className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                  placeholder="console-forum-moderation"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Console Display Name *</label>
                <input
                  type="text"
                  required
                  value={spawnerData.name}
                  onChange={(e) => setSpawnerData({ ...spawnerData, name: e.target.value })}
                  className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                  placeholder="Forum Moderation Super Console"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Service Domain</label>
                  <select
                    value={spawnerData.service_key}
                    onChange={(e) => setSpawnerData({ ...spawnerData, service_key: e.target.value })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                  >
                    {COMMUNITY_SERVICES.map(s => (
                      <option key={s.key} value={s.key}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">Target Route</label>
                  <input
                    type="text"
                    required
                    value={spawnerData.route}
                    onChange={(e) => setSpawnerData({ ...spawnerData, route: e.target.value })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Console Purpose</label>
                <textarea
                  rows={2}
                  value={spawnerData.description}
                  onChange={(e) => setSpawnerData({ ...spawnerData, description: e.target.value })}
                  className="w-full p-2.5 font-medium text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                  placeholder="Autonomous governance and real-time telemetry controls..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSpawnerModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md"
                >
                  Spawn Console Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterCommunitiesConsole;
