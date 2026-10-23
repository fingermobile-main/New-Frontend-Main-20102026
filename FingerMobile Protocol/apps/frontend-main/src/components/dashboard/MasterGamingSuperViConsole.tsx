import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Gamepad2,
  Trophy,
  Zap,
  Flame,
  Award,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  Upload,
  Plus,
  RefreshCw,
  Sliders,
  CheckCircle,
  AlertTriangle,
  FileText,
  Volume2,
  Sparkles,
  ExternalLink,
  Trash2,
  Edit,
  X,
  Users,
  Timer,
  Shield,
  Layers,
  Heart
} from 'lucide-react';
import {
  GamingSuperViDomain,
  GamingSuperViItem,
  GamingSuperViOverview,
  GamingSpawnedConsole,
  CreateGamingItemPayload
} from '../../types/gamingSuperViConsole';
import { gamingSuperViConsoleService } from '../../services/gamingSuperViConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterGamingSuperViConsole: React.FC = () => {
  // State
  const [activeDomain, setActiveDomain] = useState<GamingSuperViDomain | 'all'>('all');
  const [items, setItems] = useState<GamingSuperViItem[]>([]);
  const [overview, setOverview] = useState<GamingSuperViOverview | null>(null);
  const [spawnedConsoles, setSpawnedConsoles] = useState<GamingSpawnedConsole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reordering, setReordering] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<GamingSuperViItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateGamingItemPayload>({
    domain: 'characters_roster',
    name: '',
    code: '',
    category: 'Speedster Hero',
    reward_fic: 0,
    score_multiplier: 1.0,
    duration_seconds: 0,
    cooldown_seconds: 0,
    character_asset_url: '',
    audio_stem_url: '',
    voice_tag: 'sharp',
    notes: ''
  });

  // Spawn Modal Form State
  const [spawnTitle, setSpawnTitle] = useState<string>('');
  const [spawnDomain, setSpawnDomain] = useState<GamingSuperViDomain>('supervi_core');
  const [spawnBadge, setSpawnBadge] = useState<string>('Tournament Sub-Console');

  // File Upload State
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Trigger Toast & Audio
  const notify = (message: string, type: 'success' | 'error' = 'success', voiceLine?: AfricanVoiceLine) => {
    setNotification({ message, type });
    if (voiceLine) {
      try {
        audioEngine.playVoiceLine(voiceLine);
      } catch (err) {
        console.warn('Audio feedback failed:', err);
      }
    }
    setTimeout(() => setNotification(null), 5000);
  };

  // Load All Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [overviewData, itemsData, spawnsData] = await Promise.all([
        gamingSuperViConsoleService.getOverview(),
        gamingSuperViConsoleService.getItems(activeDomain),
        gamingSuperViConsoleService.getSpawns()
      ]);
      setOverview(overviewData);
      setItems(itemsData);
      setSpawnedConsoles(spawnsData);
    } catch (err: any) {
      notify(err.message || 'Failed to load gaming telemetry', 'error', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [activeDomain]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Domain Change
  const handleDomainFilter = (domain: GamingSuperViDomain | 'all') => {
    setActiveDomain(domain);
  };

  // Move Item Up or Down Transactionally
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    try {
      setReordering(true);
      const updated = [...items];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;

      // Assign new sequential order
      const orders = updated.map((item, idx) => ({
        id: item.id,
        display_order: idx + 1
      }));

      // Update UI optimistically
      setItems(updated);

      // Persist atomically to PostgreSQL
      await gamingSuperViConsoleService.reorderItems(orders);
      notify(`Re-sequenced display order for "${temp.name}"`, 'success', 'sweet');
    } catch (err: any) {
      notify(err.message || 'Failed to persist reorder', 'error', 'wahala');
      await fetchData(); // Rollback
    } finally {
      setReordering(false);
    }
  };

  // Toggle Freeze State
  const handleToggleFreeze = async (item: GamingSuperViItem) => {
    try {
      const updated = await gamingSuperViConsoleService.toggleFreeze(item.id);
      setItems((prev) => prev.map((it) => (it.id === item.id ? updated : it)));
      const isNowFrozen = updated.status === 'frozen';
      notify(
        `Gaming asset "${item.name}" is now ${isNowFrozen ? 'FROZEN (Disabled from Gameplay)' : 'ACTIVE'}`,
        isNowFrozen ? 'error' : 'success',
        isNowFrozen ? 'wahala' : 'sweet'
      );
      // Refresh overview counts
      const ov = await gamingSuperViConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to toggle freeze state', 'error', 'wahala');
    }
  };

  // Delete Item
  const handleDelete = async (item: GamingSuperViItem) => {
    if (!window.confirm(`Are you certain you want to purge "${item.name}" from SuperVi engine?`)) return;

    try {
      await gamingSuperViConsoleService.deleteItem(item.id);
      setItems((prev) => prev.filter((it) => it.id !== item.id));
      notify(`Purged "${item.name}" from gaming registry`, 'success', 'sweet');
      const ov = await gamingSuperViConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to delete item', 'error', 'wahala');
    }
  };

  // Handle Form Submission (Add)
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newItem = await gamingSuperViConsoleService.createItem(formData);
      setItems((prev) => [...prev, newItem]);
      setIsAddModalOpen(false);
      notify(`Registered "${newItem.name}" into SuperVi engine`, 'success', 'blessings');
      // Reset form
      setFormData({
        domain: 'characters_roster',
        name: '',
        code: '',
        category: 'Speedster Hero',
        reward_fic: 0,
        score_multiplier: 1.0,
        duration_seconds: 0,
        cooldown_seconds: 0,
        character_asset_url: '',
        audio_stem_url: '',
        voice_tag: 'sharp',
        notes: ''
      });
      const ov = await gamingSuperViConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to create gaming asset', 'error', 'wahala');
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const updated = await gamingSuperViConsoleService.updateItem(selectedItem.id, formData);
      setItems((prev) => prev.map((it) => (it.id === selectedItem.id ? updated : it)));
      setIsEditModalOpen(false);
      setSelectedItem(null);
      notify(`Updated gaming item "${updated.name}"`, 'success', 'sweet');
      const ov = await gamingSuperViConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to update gaming item', 'error', 'wahala');
    }
  };

  // Open Edit Modal
  const openEditModal = (item: GamingSuperViItem) => {
    setSelectedItem(item);
    setFormData({
      domain: item.domain,
      name: item.name,
      code: item.code,
      category: item.category,
      reward_fic: parseFloat(String(item.reward_fic)),
      score_multiplier: parseFloat(String(item.score_multiplier)),
      duration_seconds: item.duration_seconds || 0,
      cooldown_seconds: item.cooldown_seconds || 0,
      character_asset_url: item.character_asset_url || '',
      audio_stem_url: item.audio_stem_url || '',
      voice_tag: item.voice_tag || 'sharp',
      notes: item.notes || ''
    });
    setIsEditModalOpen(true);
  };

  // Handle Real Multipart File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(10);
      const uploaded = await gamingSuperViConsoleService.uploadMedia(file, (percent) => {
        setUploadProgress(percent);
      });
      setFormData((prev) => ({ ...prev, character_asset_url: uploaded.url }));
      notify(`Asset "${uploaded.originalName}" uploaded to Express disk storage`, 'success', 'sweet');
    } catch (err: any) {
      notify(err.message || 'Asset upload failed', 'error', 'wahala');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Spawn New Console
  const handleSpawnConsole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spawnTitle.trim()) return;

    try {
      const spawned = await gamingSuperViConsoleService.spawnConsole({
        console_title: spawnTitle.trim(),
        target_domain: spawnDomain,
        badge_text: spawnBadge.trim() || 'Dynamic Sub-Console',
        icon_name: 'Gamepad2'
      });
      setSpawnedConsoles((prev) => [spawned, ...prev]);
      setIsSpawnModalOpen(false);
      setSpawnTitle('');
      notify(`Spawned console "${spawned.console_title}" successfully`, 'success', 'colossal_combo');
      const ov = await gamingSuperViConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to spawn console', 'error', 'wahala');
    }
  };

  // Domain labels & badge formatting
  const domainConfig: Record<
    GamingSuperViDomain,
    { label: string; badgeColor: string; description: string }
  > = useMemo(
    () => ({
      supervi_core: {
        label: 'SuperVi Core Physics & Mechanics',
        badgeColor: 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold',
        description: 'Endless runner kinematics, terminal velocity, gravity (26.5 m/s²), and golden fruit scoring multipliers.'
      },
      characters_roster: {
        label: 'The Six African Heroes Roster',
        badgeColor: 'bg-purple-100 text-purple-950 border border-purple-400 font-bold',
        description: 'Obinna (Flash), Amara (Solar Shield), Kwame (Magnet Pulse), Nia (Shadow Dash), Zola (Zephyr), Tariq (Thunder).'
      },
      powerups_catalog: {
        label: 'Powerups & Kinetic Augments',
        badgeColor: 'bg-amber-100 text-amber-950 border border-amber-400 font-bold',
        description: 'Afro-Rocket Jetpacks, Neodymium Magnets, Aegis Shields, 3x Multipliers, Chrono Time Freezes.'
      },
      leaderboards_ranks: {
        label: 'Leaderboards & Clan Hegemony',
        badgeColor: 'bg-blue-100 text-blue-950 border border-blue-400 font-bold',
        description: 'Continental All-Time Champions, Lagos Expressway Daily 24h, Accra Weekly, and 64-Clan War stakes.'
      },
      daily_challenges: {
        label: 'Daily Bounties & Trophy Milestones',
        badgeColor: 'bg-rose-100 text-rose-950 border border-rose-400 font-bold',
        description: 'Mango Harvest, Obstacle Acrobat leaps, and Jetpack Stratosphere flights with automated FIC rewards.'
      },
      voice_audio_lines: {
        label: 'African Voice Lines & 8-Bit Afrobeat',
        badgeColor: 'bg-sky-100 text-sky-950 border border-sky-400 font-bold',
        description: 'Authentic African cultural callouts: "Wahala Dey!", "Correct Guy!", "Owo Ni Koko!", "Sharp Sharp!".'
      }
    }),
    []
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-lg border shadow-md flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center space-x-3">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" />
            )}
            <span className="font-bold text-sm">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-500 hover:text-slate-900 font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-100 text-amber-950 rounded-lg border border-amber-300">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                SuperVi & Gaming Operations Autonomous Control Plane
              </h1>
              <p className="text-sm font-medium text-slate-700">
                Phase 1: Full autonomous management of physics, characters, powerups, leaderboards, daily bounties, and African voice lines.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => notify('African Voice Protocol active', 'success', 'colossal_combo')}
            className="px-3.5 py-2 bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 rounded-lg text-sm font-bold flex items-center space-x-2 transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>Voice: Colossal Combo</span>
          </button>

          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-950 border border-blue-300 rounded-lg text-sm font-bold flex items-center space-x-2 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Spawn Gaming Console</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold flex items-center space-x-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Game Asset</span>
          </button>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded-lg transition-colors"
            title="Refresh Gaming Registry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Active African Heroes
              </span>
              <div className="p-2 bg-purple-100 text-purple-950 rounded-md border border-purple-300">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">
                {overview.summary.total_characters} Heroes
              </div>
              <p className="text-xs font-medium text-slate-700 mt-1">
                Obinna, Amara, Kwame, Nia, Zola, Tariq
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Powerups & Augments
              </span>
              <div className="p-2 bg-amber-100 text-amber-950 rounded-md border border-amber-300">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">
                {overview.summary.total_powerups} In Catalog
              </div>
              <p className="text-xs font-medium text-slate-700 mt-1">
                Jetpack, Magnet, Shield, 3x Multiplier, Freeze
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Active Prize Bounties
              </span>
              <div className="p-2 bg-emerald-100 text-emerald-950 rounded-md border border-emerald-300">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">
                {parseFloat(String(overview.summary.total_fic_rewards)).toLocaleString(undefined, { maximumFractionDigits: 0 })} FIC
              </div>
              <p className="text-xs font-medium text-slate-700 mt-1">
                Allocated across Leaderboards & Challenges
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Live Leaderboards
              </span>
              <div className="p-2 bg-blue-100 text-blue-950 rounded-md border border-blue-300">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">
                {overview.summary.total_leaderboards} Active Circuits
              </div>
              <p className="text-xs font-medium text-slate-700 mt-1">
                Global Apex, Lagos 24h, Accra Weekly
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Domain Navigation Filter Tabs */}
      <div className="bg-white border border-slate-300 rounded-xl p-2 shadow-sm">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => handleDomainFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
              activeDomain === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            All Game Assets ({items.length})
          </button>

          {(Object.keys(domainConfig) as GamingSuperViDomain[]).map((dom) => (
            <button
              key={dom}
              onClick={() => handleDomainFilter(dom)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
                activeDomain === dom
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              {domainConfig[dom].label}
            </button>
          ))}
        </div>
      </div>

      {/* Spawned Consoles Bar */}
      {spawnedConsoles.length > 0 && (
        <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Spawned Gaming Consoles ({spawnedConsoles.length})
              </span>
            </div>
            <span className="text-xs text-slate-700 font-medium">Click to navigate</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {spawnedConsoles.map((sc) => (
              <div
                key={sc.id}
                className="p-3 bg-slate-50 border border-slate-300 rounded-lg flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => notify(`Console "${sc.console_title}" route active: ${sc.route}`, 'success', 'blessings')}
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">{sc.console_title}</div>
                  <div className="text-xs text-slate-700 mt-0.5">{sc.target_domain}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-950 border border-blue-300">
                  {sc.badge_text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Gaming Assets Table */}
      <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {activeDomain === 'all'
                ? 'All Gaming Engine & SuperVi Assets'
                : domainConfig[activeDomain]?.label || activeDomain}
            </h2>
            <p className="text-xs font-medium text-slate-700 mt-0.5">
              {activeDomain === 'all'
                ? 'Unified view across physics mechanics, character rosters, powerups, leaderboards, and audio cues.'
                : domainConfig[activeDomain]?.description}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded">
              {items.length} Registered
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <th className="px-4 py-3 text-center w-16">Seq</th>
                <th className="px-4 py-3">Code / Name</th>
                <th className="px-4 py-3">Domain & Category</th>
                <th className="px-4 py-3">Multiplier / Bounty</th>
                <th className="px-4 py-3">Duration / Cooldown</th>
                <th className="px-4 py-3">Voice Line / Trigger</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-700 font-bold">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-800" />
                    Connecting to PostgreSQL SuperVi gaming registry...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-700 font-bold">
                    No gaming assets found for this domain.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => {
                  const isFrozen = item.status === 'frozen';
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isFrozen ? 'bg-rose-50/50' : ''
                      }`}
                    >
                      {/* Sequencing Controls */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => handleMove(index, 'up')}
                            disabled={index === 0 || reordering}
                            className="p-1 rounded text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-xs text-slate-800 w-4">
                            {item.display_order}
                          </span>
                          <button
                            onClick={() => handleMove(index, 'down')}
                            disabled={index === items.length - 1 || reordering}
                            className="p-1 rounded text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Code / Name */}
                      <td className="px-4 py-3">
                        <div className="font-black text-slate-900">{item.name}</div>
                        <div className="text-xs font-bold text-slate-700 flex items-center space-x-1 mt-0.5">
                          <span>{item.code}</span>
                          {item.character_asset_url && (
                            <a
                              href={item.character_asset_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-700 hover:underline flex items-center space-x-0.5"
                              title="View Asset"
                            >
                              <FileText className="w-3 h-3 ml-1" />
                              <span>Sprite</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Domain & Category */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs ${
                            domainConfig[item.domain]?.badgeColor ||
                            'bg-slate-100 text-slate-950 border border-slate-300 font-bold'
                          }`}
                        >
                          {item.domain}
                        </span>
                        <div className="text-xs font-medium text-slate-700 mt-1">
                          {item.category}
                        </div>
                      </td>

                      {/* Multiplier / Bounty */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">
                          {parseFloat(String(item.score_multiplier))}x Multiplier
                        </div>
                        {parseFloat(String(item.reward_fic)) > 0 ? (
                          <div className="text-xs font-black text-emerald-950 bg-emerald-100 border border-emerald-300 rounded px-1.5 py-0.5 inline-block mt-0.5">
                            {parseFloat(String(item.reward_fic)).toLocaleString()} FIC Bounty
                          </div>
                        ) : (
                          <div className="text-xs font-medium text-slate-700 mt-0.5">Standard</div>
                        )}
                      </td>

                      {/* Duration / Cooldown */}
                      <td className="px-4 py-3">
                        <div className="text-xs font-bold text-slate-900">
                          {item.duration_seconds > 0 ? `${item.duration_seconds}s active` : 'Passive'}
                        </div>
                        <div className="text-xs font-medium text-slate-700 mt-0.5">
                          {item.cooldown_seconds > 0 ? `${item.cooldown_seconds}s cooldown` : 'No CD'}
                        </div>
                      </td>

                      {/* Voice Line / Audio */}
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => {
                              if (item.voice_tag) {
                                notify(`Playing voice line: "${item.voice_tag}"`, 'success', item.voice_tag as AfricanVoiceLine);
                              }
                            }}
                            className="p-1 rounded bg-purple-100 text-purple-950 border border-purple-300 hover:bg-purple-200 transition-colors"
                            title="Play Voice Cue"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-mono text-slate-800">
                            {item.voice_tag || 'none'}
                          </span>
                        </div>
                      </td>

                      {/* Status & Freeze Killswitch */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleFreeze(item)}
                          className={`px-2.5 py-1 rounded text-xs font-black border transition-colors inline-flex items-center space-x-1 ${
                            isFrozen
                              ? 'bg-rose-100 text-rose-950 border-rose-400 hover:bg-rose-200'
                              : 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200'
                          }`}
                          title={isFrozen ? 'Click to Unfreeze' : 'Click to Freeze Killswitch'}
                        >
                          {isFrozen ? (
                            <>
                              <Lock className="w-3 h-3 text-rose-800" />
                              <span>FROZEN</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3 h-3 text-emerald-800" />
                              <span>ACTIVE</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 text-slate-700 hover:text-slate-900 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                            title="Edit Asset"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-1.5 text-rose-700 hover:text-rose-900 border border-rose-300 rounded hover:bg-rose-50 transition-colors"
                            title="Purge Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Asset Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-slate-300 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xl font-black text-slate-900">
                {isEditModalOpen ? `Edit Game Asset: ${selectedItem?.code}` : 'Register New SuperVi Game Asset'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setSelectedItem(null);
                }}
                className="text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={isEditModalOpen ? handleEditSubmit : handleCreateSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Game Domain
                  </label>
                  <select
                    value={formData.domain}
                    onChange={(e) =>
                      setFormData({ ...formData, domain: e.target.value as GamingSuperViDomain })
                    }
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm"
                  >
                    {(Object.keys(domainConfig) as GamingSuperViDomain[]).map((dom) => (
                      <option key={dom} value={dom}>
                        {domainConfig[dom].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Asset Code (e.g. CHAR-07, PWR-06)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                    placeholder="CHAR-KAYODE-07"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Title / Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  placeholder="Kayode (Calabar Forest Glider)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Score Multiplier
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={formData.score_multiplier}
                    onChange={(e) =>
                      setFormData({ ...formData, score_multiplier: parseFloat(e.target.value) || 1.0 })
                    }
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    FIC Reward / Cost
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={formData.reward_fic}
                    onChange={(e) =>
                      setFormData({ ...formData, reward_fic: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Duration (Seconds)
                  </label>
                  <input
                    type="number"
                    value={formData.duration_seconds}
                    onChange={(e) =>
                      setFormData({ ...formData, duration_seconds: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    African Voice Tag
                  </label>
                  <select
                    value={formData.voice_tag || 'sharp'}
                    onChange={(e) => setFormData({ ...formData, voice_tag: e.target.value })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm"
                  >
                    <option value="sharp">Sharp Sharp! (Speed)</option>
                    <option value="correct">Correct Guy! (Milestone)</option>
                    <option value="owo_ni_koko">Owo Ni Koko! (Jackpot)</option>
                    <option value="wahala">Wahala Dey! (Danger/Crash)</option>
                    <option value="colossal_combo">Colossal African Combo!</option>
                    <option value="sweet">Sweet Run!</option>
                    <option value="blessings">More Blessings!</option>
                    <option value="supervi_intro">SuperVi Intro Anthem</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Cooldown (Seconds)
                  </label>
                  <input
                    type="number"
                    value={formData.cooldown_seconds}
                    onChange={(e) =>
                      setFormData({ ...formData, cooldown_seconds: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              {/* Real Multipart File Upload for Sprites & Audio */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Upload Character Sprite / 3D GLB Model / Audio Stem (Backend Disk Storage)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.glb,.gltf,.wav,.mp3,.json"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="text-sm text-slate-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200"
                  />
                  {formData.character_asset_url && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-1 rounded">
                      Uploaded
                    </span>
                  )}
                </div>
                {isUploading && (
                  <div className="mt-2 space-y-1">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-700">Uploading to /uploads/gaming/... {uploadProgress}%</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Engine & Physics Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  placeholder="Kinematic hitboxes, special ability parameters, and seasonal leaderboard rules."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                >
                  {isEditModalOpen ? 'Save Changes' : 'Confirm & Commit Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* One-Click Console Spawner Modal */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-slate-300 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xl font-black text-slate-900">
                One-Click Gaming Console Spawner
              </h3>
              <button
                onClick={() => setIsSpawnModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSpawnConsole} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Console Title
                </label>
                <input
                  type="text"
                  required
                  value={spawnTitle}
                  onChange={(e) => setSpawnTitle(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  placeholder="e.g. Speedrun Anti-Cheat Watchdog"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Target Gaming Domain
                </label>
                <select
                  value={spawnDomain}
                  onChange={(e) =>
                    setSpawnDomain(e.target.value as GamingSuperViDomain)
                  }
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm"
                >
                  {(Object.keys(domainConfig) as GamingSuperViDomain[]).map((dom) => (
                    <option key={dom} value={dom}>
                      {domainConfig[dom].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={spawnBadge}
                  onChange={(e) => setSpawnBadge(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  placeholder="e.g. Esports Live Sentinel"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSpawnModalOpen(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
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

export default MasterGamingSuperViConsole;
