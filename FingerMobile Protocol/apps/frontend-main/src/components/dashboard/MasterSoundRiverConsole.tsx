import React, { useState, useEffect, useCallback } from 'react';
import {
  RadioIcon,
  PlayIcon,
  PauseIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  ArrowPathIcon,
  TrashIcon,
  PencilSquareIcon,
  SparklesIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  MusicalNoteIcon,
  SignalIcon,
  SpeakerWaveIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import {
  SoundRiverItem,
  SoundRiverOverview,
  SoundRiverSpawn,
  CreateSoundRiverPayload
} from '../../types/soundRiverConsole';
import { soundRiverConsoleService } from '../../services/soundRiverConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterSoundRiverConsole: React.FC = () => {
  const [items, setItems] = useState<SoundRiverItem[]>([]);
  const [overview, setOverview] = useState<SoundRiverOverview | null>(null);
  const [spawns, setSpawns] = useState<SoundRiverSpawn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedItemForUpload, setSelectedItemForUpload] = useState<SoundRiverItem | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<SoundRiverItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [seedingStreamId, setSeedingStreamId] = useState<number | null>(null);

  // Form State
  const [formStationName, setFormStationName] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Live Beatwave Feeder');
  const [formBitrate, setFormBitrate] = useState<number>(320);
  const [formCodec, setFormCodec] = useState<string>('AAC-LC');
  const [formCrossfade, setFormCrossfade] = useState<number>(4);
  const [formFeedMode, setFormFeedMode] = useState<string>('auto_seed');

  // Spawn Form State
  const [spawnName, setSpawnName] = useState<string>('');
  const [spawnSlug, setSpawnSlug] = useState<string>('');
  const [spawnEndpoint, setSpawnEndpoint] = useState<string>('/api/sound-river-console/spawns');
  const [spawnCategory, setSpawnCategory] = useState<string>('Live Beatwave Feeder');

  const showToast = (msg: string, voice?: AfricanVoiceLine) => {
    setToastMessage(msg);
    if (voice) {
      audioEngine.playVoiceLine(voice);
    }
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [overviewData, itemsData, spawnsData] = await Promise.all([
        soundRiverConsoleService.getOverview(),
        soundRiverConsoleService.getItems({
          category: selectedCategory === 'ALL' ? undefined : selectedCategory,
          status: selectedStatus === 'ALL' ? undefined : selectedStatus,
          search: searchQuery.trim() || undefined
        }),
        soundRiverConsoleService.getSpawns()
      ]);
      setOverview(overviewData);
      setItems(itemsData);
      setSpawns(spawnsData);
    } catch (err: any) {
      console.error('Failed to load SoundRiver console data:', err);
      showToast('Error syncing with SoundRiver stream plane', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleFreeze = async (item: SoundRiverItem) => {
    try {
      const updated = await soundRiverConsoleService.toggleFreeze(item.id);
      setItems(prev => prev.map(i => (i.id === item.id ? updated : i)));
      if (updated.status === 'frozen') {
        showToast(`Stream "${updated.station_name}" muted / frozen securely!`, 'wahala');
      } else {
        showToast(`Stream "${updated.station_name}" restored to live broadcast!`, 'sweet');
      }
      loadData();
    } catch (err: any) {
      showToast('Failed to switch stream freeze status', 'see_gobe');
    }
  };

  const handleReorder = async (currentIndex: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const sourceItem = items[currentIndex];
    const targetItem = items[targetIndex];

    try {
      const reordered = await soundRiverConsoleService.reorderItems(sourceItem.id, targetItem.id);
      setItems(reordered);
      showToast('Stream priority resequenced in PostgreSQL!', 'gbaski');
    } catch (err: any) {
      showToast('Failed to reorder streams in database', 'wahala');
    }
  };

  const handleSeedFromOcean = async (item: SoundRiverItem) => {
    try {
      setSeedingStreamId(item.id);
      const res = await soundRiverConsoleService.seedNextTrackFromOcean(item.id);
      setItems(prev => prev.map(i => (i.id === item.id ? res.data : i)));
      showToast(`Seeded "${res.seededTrack.title}" by ${res.seededTrack.artist} from SoundOcean!`, 'great_combo');
      loadData();
    } catch (err: any) {
      showToast('Error seeding stream from SoundOcean', 'wahala');
    } finally {
      setSeedingStreamId(null);
    }
  };

  const handleDelete = async (item: SoundRiverItem) => {
    if (!window.confirm(`Are you sure you want to decommission stream "${item.station_name}"?`)) return;

    try {
      await soundRiverConsoleService.deleteItem(item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
      showToast(`Stream "${item.station_name}" decommissioned`, 'owo_ni_koko');
      loadData();
    } catch (err: any) {
      showToast('Failed to delete stream station', 'see_gobe');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStationName || !formCode) {
      showToast('Stream Code and Station Name are mandatory', 'wahala');
      return;
    }

    try {
      const payload: CreateSoundRiverPayload = {
        code: formCode,
        station_name: formStationName,
        category: formCategory,
        target_bitrate_kbps: Number(formBitrate),
        codec: formCodec,
        crossfade_seconds: Number(formCrossfade),
        feed_mode: formFeedMode
      };
      const created = await soundRiverConsoleService.createItem(payload);
      setItems(prev => [created, ...prev]);
      setIsAddModalOpen(false);
      resetForm();
      showToast(`Stream Station "${created.station_name}" provisioned live!`, 'blessings');
      loadData();
    } catch (err: any) {
      showToast('Error creating SoundRiver station', 'see_gobe');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    try {
      const payload: Partial<CreateSoundRiverPayload> = {
        station_name: formStationName,
        category: formCategory,
        target_bitrate_kbps: Number(formBitrate),
        codec: formCodec,
        crossfade_seconds: Number(formCrossfade),
        feed_mode: formFeedMode
      };
      const updated = await soundRiverConsoleService.updateItem(activeItem.id, payload);
      setItems(prev => prev.map(i => (i.id === activeItem.id ? updated : i)));
      setIsEditModalOpen(false);
      setActiveItem(null);
      resetForm();
      showToast(`Stream "${updated.station_name}" updated!`, 'madt_o');
      loadData();
    } catch (err: any) {
      showToast('Failed to update stream configuration', 'wahala');
    }
  };

  const handleSpawn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spawnName || !spawnSlug) {
      showToast('Sub-Console Name and Slug are required', 'wahala');
      return;
    }

    try {
      const spawned = await soundRiverConsoleService.spawnSubConsole({
        sub_console_name: spawnName,
        slug: spawnSlug,
        endpoint: spawnEndpoint,
        category: spawnCategory
      });
      setSpawns(prev => [spawned, ...prev]);
      setIsSpawnModalOpen(false);
      setSpawnName('');
      setSpawnSlug('');
      showToast(`SoundRiver Sub-Console "${spawned.sub_console_name}" spawned live!`, 'colossal_combo');
      loadData();
    } catch (err: any) {
      showToast('Failed to spawn SoundRiver sub-console', 'see_gobe');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      showToast('Please select an audio bumper or stream asset', 'wahala');
      return;
    }

    try {
      setUploading(true);
      const res = await soundRiverConsoleService.uploadAsset(
        selectedItemForUpload ? selectedItemForUpload.id : null,
        uploadFile
      );
      showToast(`Asset uploaded to Express: ${res.filename}`, 'great_combo');
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setSelectedItemForUpload(null);
      loadData();
    } catch (err: any) {
      showToast('Multipart upload failed', 'wahala');
    } finally {
      setUploading(false);
    }
  };

  const openEditModal = (item: SoundRiverItem) => {
    setActiveItem(item);
    setFormStationName(item.station_name);
    setFormCode(item.code);
    setFormCategory(item.category);
    setFormBitrate(item.target_bitrate_kbps);
    setFormCodec(item.codec);
    setFormCrossfade(item.crossfade_seconds);
    setFormFeedMode(item.feed_mode);
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormStationName('');
    setFormCode('');
    setFormCategory('Live Beatwave Feeder');
    setFormBitrate(320);
    setFormCodec('AAC-LC');
    setFormCrossfade(4);
    setFormFeedMode('auto_seed');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-emerald-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 transition-all animate-bounce">
          <SparklesIcon className="w-6 h-6 text-emerald-400" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-100 rounded-xl border border-teal-400">
              <RadioIcon className="w-8 h-8 text-teal-950" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                SoundRiver Autonomous Stream Engine & BeatwaveNG Feeder
              </h1>
              <p className="text-sm text-slate-700">
                Independent Sovereign Microservice: Continuous Real-Time Audio Rivers, BeatwaveNG Seeder Pipeline, Dynamic BPM Crossfade & Lossless Relays
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Provision Stream</span>
          </button>
          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <SignalIcon className="w-5 h-5" />
            <span>Spawn Sub-Console</span>
          </button>
          <button
            onClick={() => {
              setSelectedItemForUpload(null);
              setIsUploadModalOpen(true);
            }}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
            <span>Upload Stream Bumper</span>
          </button>
          <button
            onClick={loadData}
            className="p-2.5 text-slate-700 hover:text-slate-900 border border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
            title="Refresh Operational State"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Telemetry Overview Metrics */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Stream Rivers</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{overview.summary.total_items}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Broadcasts</span>
            <p className="text-2xl font-black text-emerald-800 mt-1">{overview.summary.active_count}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Muted / Frozen</span>
            <p className="text-2xl font-black text-rose-800 mt-1">{overview.summary.frozen_count}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Listeners</span>
            <p className="text-2xl font-black text-blue-900 mt-1">{Number(overview.summary.total_active_listeners).toLocaleString()}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Peak Listeners</span>
            <p className="text-2xl font-black text-purple-900 mt-1">{Number(overview.summary.peak_listeners).toLocaleString()}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Avg Bitrate</span>
            <p className="text-2xl font-black text-teal-900 mt-1">{Number(overview.summary.avg_bitrate_kbps).toFixed(0)} kbps</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Buffer Health</span>
            <p className="text-2xl font-black text-indigo-900 mt-1">{Number(overview.summary.avg_buffer_health_pct).toFixed(1)}%</p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Stream Channels</option>
            <option value="Live Beatwave Feeder">Live Beatwave Feeder</option>
            <option value="Creator Showcase River">Creator Showcase River</option>
            <option value="Curated Algorithm River">Curated Algorithm River</option>
            <option value="P2P WebRTC Mesh Feeder">P2P WebRTC Mesh Feeder</option>
            <option value="Radio Relay">Radio Relay</option>
            <option value="Gaming & Metaverse">Gaming & Metaverse</option>
            <option value="Audiophile FLAC River">Audiophile FLAC River</option>
            <option value="Preserved Heritage Relay">Preserved Heritage Relay</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Operational Statuses</option>
            <option value="active">Active Streams Only</option>
            <option value="frozen">Muted / Frozen Only</option>
          </select>
        </div>

        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search streams, current tracks, codes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Main Microservices Table */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="font-extrabold text-slate-900 text-lg">
            SoundRiver Active Continuous Broadcasts & Seeders ({items.length})
          </h2>
          <span className="text-xs font-semibold text-slate-700 bg-slate-200 px-3 py-1 rounded-full">
            Transactional Ordering Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 text-xs uppercase font-black border-b border-slate-200 tracking-wider">
                <th className="py-3.5 px-4">Priority / Sort</th>
                <th className="py-3.5 px-4">Station / Stream Channel</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Current Track (from Ocean)</th>
                <th className="py-3.5 px-4">Bitrate & Codec</th>
                <th className="py-3.5 px-4">Active Listeners</th>
                <th className="py-3.5 px-4">Buffer %</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-700 font-bold">
                    No streams matching filters.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      item.status === 'frozen' ? 'bg-rose-50/40' : ''
                    }`}
                  >
                    {/* Order & Priority */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-black text-slate-900 w-6 text-center">{item.display_order}</span>
                        <div className="flex flex-col space-y-0.5">
                          <button
                            onClick={() => handleReorder(index, 'UP')}
                            disabled={index === 0}
                            className={`p-1 rounded hover:bg-slate-200 text-slate-700 disabled:opacity-30 ${
                              index === 0 ? 'cursor-not-allowed' : ''
                            }`}
                            title="Move Up (Transaction Priority)"
                          >
                            <ArrowUpIcon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleReorder(index, 'DOWN')}
                            disabled={index === items.length - 1}
                            className={`p-1 rounded hover:bg-slate-200 text-slate-700 disabled:opacity-30 ${
                              index === items.length - 1 ? 'cursor-not-allowed' : ''
                            }`}
                            title="Move Down (Transaction Priority)"
                          >
                            <ArrowDownIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Station Name & Code */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.station_name}</div>
                      <div className="text-xs font-mono text-slate-700 flex items-center space-x-2 mt-0.5">
                        <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[11px] font-bold">
                          {item.code}
                        </span>
                        <span className="text-teal-800 font-semibold text-[11px]">
                          Mode: {item.feed_mode}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md">
                        {item.category}
                      </span>
                    </td>

                    {/* Current Track from SoundOcean */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-xs truncate max-w-xs">
                        🎵 {item.current_track_title || 'Seeding Buffer...'}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-700 truncate max-w-xs">
                        {item.current_track_artist}
                      </div>
                      {item.next_track_title && (
                        <div className="text-[10px] text-slate-500 truncate max-w-xs mt-0.5">
                          Next: {item.next_track_title}
                        </div>
                      )}
                    </td>

                    {/* Bitrate & Codec */}
                    <td className="py-3 px-4">
                      <span className="text-xs font-black text-teal-950 bg-teal-100 border border-teal-400 px-2 py-0.5 rounded font-mono">
                        {item.target_bitrate_kbps} kbps
                      </span>
                      <div className="text-xs text-slate-700 font-semibold mt-0.5">{item.codec} ({item.crossfade_seconds}s X-fade)</div>
                    </td>

                    {/* Active Listeners */}
                    <td className="py-3 px-4 text-slate-800 font-semibold font-mono">
                      <div>🎧 {item.active_listeners.toLocaleString()}</div>
                      <div className="text-xs text-slate-700">Peak: {item.peak_listeners.toLocaleString()}</div>
                    </td>

                    {/* Buffer Health */}
                    <td className="py-3 px-4 text-slate-800 font-semibold">
                      <span className="text-xs font-bold text-emerald-950 bg-emerald-100 border border-emerald-400 px-2 py-0.5 rounded">
                        {item.buffer_health_pct}%
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {item.status === 'active' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-950 border border-rose-400">
                          Muted
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Seed from SoundOcean */}
                        <button
                          onClick={() => handleSeedFromOcean(item)}
                          disabled={seedingStreamId === item.id}
                          className="p-1.5 rounded-lg border border-teal-400 bg-teal-50 text-teal-800 hover:bg-teal-100 transition disabled:opacity-50"
                          title="Call & Seed Next Track from SoundOcean Library"
                        >
                          <ArrowsRightLeftIcon className={`w-4 h-4 ${seedingStreamId === item.id ? 'animate-spin' : ''}`} />
                        </button>

                        {/* Toggle Freeze */}
                        <button
                          onClick={() => handleToggleFreeze(item)}
                          className={`p-1.5 rounded-lg border transition ${
                            item.status === 'active'
                              ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                              : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          }`}
                          title={item.status === 'active' ? 'Mute / Freeze Stream' : 'Unmute Stream'}
                        >
                          {item.status === 'active' ? (
                            <PauseIcon className="w-4 h-4" />
                          ) : (
                            <PlayIcon className="w-4 h-4" />
                          )}
                        </button>

                        {/* Upload Asset */}
                        <button
                          onClick={() => {
                            setSelectedItemForUpload(item);
                            setIsUploadModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
                          title="Upload Station Bumper / Jingle"
                        >
                          <ArrowUpTrayIcon className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
                          title="Edit Stream Station"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-lg border border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100 transition"
                          title="Decommission Stream Station"
                        >
                          <TrashIcon className="w-4 h-4" />
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

      {/* Spawned Sub-Consoles Panel */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <SignalIcon className="w-6 h-6 text-teal-900" />
            <h3 className="text-lg font-black text-slate-900">
              Active SoundRiver Sub-Consoles & Feeder Relays ({spawns.length})
            </h3>
          </div>
          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg transition"
          >
            Spawn Another Sub-Console
          </button>
        </div>

        {spawns.length === 0 ? (
          <p className="text-sm font-semibold text-slate-700">No sub-consoles spawned yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spawns.map(spawn => (
              <div
                key={spawn.id}
                className="border border-slate-300 rounded-xl p-4 bg-slate-50 hover:bg-white hover:border-teal-400 transition shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm">{spawn.sub_console_name}</span>
                  <span className="text-[11px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 px-2 py-0.5 rounded">
                    {spawn.status}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-700 mt-2">Slug: {spawn.slug}</div>
                <div className="text-xs font-mono text-slate-700 truncate mt-0.5">Endpoint: {spawn.endpoint}</div>
                <div className="text-xs font-bold text-slate-800 mt-2 bg-slate-200 inline-block px-2 py-0.5 rounded">
                  {spawn.category}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: Provision Stream Station */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 bg-slate-100 border-b border-slate-300 flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-lg">Provision SoundRiver Stream Station</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Stream Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RVR-STRM-013"
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Station Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Accra Gold Coast Highlife River"
                    value={formStationName}
                    onChange={e => setFormStationName(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Stream Category</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Live Beatwave Feeder">Live Beatwave Feeder</option>
                  <option value="Creator Showcase River">Creator Showcase River</option>
                  <option value="Curated Algorithm River">Curated Algorithm River</option>
                  <option value="P2P WebRTC Mesh Feeder">P2P WebRTC Mesh Feeder</option>
                  <option value="Radio Relay">Radio Relay</option>
                  <option value="Gaming & Metaverse">Gaming & Metaverse</option>
                  <option value="Audiophile FLAC River">Audiophile FLAC River</option>
                  <option value="Preserved Heritage Relay">Preserved Heritage Relay</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Bitrate (kbps)</label>
                  <select
                    value={formBitrate}
                    onChange={e => setFormBitrate(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value={128}>128 kbps (Mobile)</option>
                    <option value={256}>256 kbps (Web)</option>
                    <option value={320}>320 kbps (High-Def)</option>
                    <option value={1411}>1411 kbps (FLAC)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Codec</label>
                  <select
                    value={formCodec}
                    onChange={e => setFormCodec(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="AAC-LC">AAC-LC</option>
                    <option value="Opus">Opus</option>
                    <option value="FLAC">FLAC</option>
                    <option value="MP3">MP3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">X-Fade (sec)</label>
                  <input
                    type="number"
                    value={formCrossfade}
                    onChange={e => setFormCrossfade(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Feeder Engine Mode</label>
                <select
                  value={formFeedMode}
                  onChange={e => setFormFeedMode(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="auto_seed">Auto-Seed from SoundOcean Library</option>
                  <option value="manual_curation">Manual Playlist Sequence</option>
                  <option value="webrtc_broadcast">Live WebRTC Broadcaster Relay</option>
                  <option value="p2p_mesh">P2P Swarm Audio Mesh</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow transition"
                >
                  Provision Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Stream Station */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 bg-slate-100 border-b border-slate-300 flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-lg">Modify Stream: {activeItem?.station_name}</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Station Name</label>
                <input
                  type="text"
                  required
                  value={formStationName}
                  onChange={e => setFormStationName(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Stream Category</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Live Beatwave Feeder">Live Beatwave Feeder</option>
                  <option value="Creator Showcase River">Creator Showcase River</option>
                  <option value="Curated Algorithm River">Curated Algorithm River</option>
                  <option value="P2P WebRTC Mesh Feeder">P2P WebRTC Mesh Feeder</option>
                  <option value="Radio Relay">Radio Relay</option>
                  <option value="Gaming & Metaverse">Gaming & Metaverse</option>
                  <option value="Audiophile FLAC River">Audiophile FLAC River</option>
                  <option value="Preserved Heritage Relay">Preserved Heritage Relay</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Bitrate</label>
                  <select
                    value={formBitrate}
                    onChange={e => setFormBitrate(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value={128}>128 kbps</option>
                    <option value={256}>256 kbps</option>
                    <option value={320}>320 kbps</option>
                    <option value={1411}>1411 kbps</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Codec</label>
                  <select
                    value={formCodec}
                    onChange={e => setFormCodec(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="AAC-LC">AAC-LC</option>
                    <option value="Opus">Opus</option>
                    <option value="FLAC">FLAC</option>
                    <option value="MP3">MP3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">X-Fade</label>
                  <input
                    type="number"
                    value={formCrossfade}
                    onChange={e => setFormCrossfade(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow transition"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Spawn Sub-Console */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 bg-slate-100 border-b border-slate-300 flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-lg">Spawn SoundRiver Sub-Console</h3>
              <button
                onClick={() => setIsSpawnModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSpawn} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Sub-Console Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Accra City Pulse Relay"
                  value={spawnName}
                  onChange={e => setSpawnName(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Console URL Slug</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. accra-city-pulse"
                  value={spawnSlug}
                  onChange={e => setSpawnSlug(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">API Endpoint</label>
                <input
                  type="text"
                  required
                  value={spawnEndpoint}
                  onChange={e => setSpawnEndpoint(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSpawnModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition"
                >
                  Spawn Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Direct Multipart Form-Data Upload (Zero Client Fallback) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 bg-slate-100 border-b border-slate-300 flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-lg">
                {selectedItemForUpload ? `Upload Bumper for ${selectedItemForUpload.station_name}` : 'Upload Stream Bumper / Jingle'}
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-2">
                  Select Audio Jingle/Asset (Direct Multipart/Form-Data to Express)
                </label>
                <input
                  type="file"
                  required
                  accept="audio/*,.mp3,.aac,.flac,.wav"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm focus:outline-none"
                />
                <p className="text-xs text-slate-700 mt-2">
                  Zero localStorage fallback. Streams directly to Express backend storage.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition disabled:opacity-50"
                >
                  {uploading ? 'Streaming to Express...' : 'Upload Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterSoundRiverConsole;
