import React, { useState, useEffect, useCallback } from 'react';
import {
  CircleStackIcon,
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
  FolderArrowDownIcon
} from '@heroicons/react/24/outline';
import {
  SoundOceanItem,
  SoundOceanOverview,
  SoundOceanSpawn,
  CreateSoundOceanPayload
} from '../../types/soundOceanConsole';
import { soundOceanConsoleService } from '../../services/soundOceanConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterSoundOceanConsole: React.FC = () => {
  const [items, setItems] = useState<SoundOceanItem[]>([]);
  const [overview, setOverview] = useState<SoundOceanOverview | null>(null);
  const [spawns, setSpawns] = useState<SoundOceanSpawn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedItemForUpload, setSelectedItemForUpload] = useState<SoundOceanItem | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<SoundOceanItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState<string>('');
  const [formArtist, setFormArtist] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formGenre, setFormGenre] = useState<string>('Afrobeat');
  const [formCategory, setFormCategory] = useState<string>('Master Stems');
  const [formBpm, setFormBpm] = useState<number>(120);
  const [formBitDepth, setFormBitDepth] = useState<number>(24);
  const [formSampleRate, setFormSampleRate] = useState<number>(96);
  const [formAudioFormat, setFormAudioFormat] = useState<string>('FLAC');
  const [formLicenseType, setFormLicenseType] = useState<string>('Creative Commons CC-BY 4.0');
  const [formFicPrice, setFormFicPrice] = useState<number>(15.0);
  const [formRoyaltySplit, setFormRoyaltySplit] = useState<number>(85.0);
  const [formStemChannels, setFormStemChannels] = useState<string>('Vocals, Drums, Bass, Horns, Synths');

  // Spawn Form State
  const [spawnName, setSpawnName] = useState<string>('');
  const [spawnSlug, setSpawnSlug] = useState<string>('');
  const [spawnEndpoint, setSpawnEndpoint] = useState<string>('/api/sound-ocean-console/spawns');
  const [spawnCategory, setSpawnCategory] = useState<string>('Master Stems');

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
        soundOceanConsoleService.getOverview(),
        soundOceanConsoleService.getItems({
          category: selectedCategory === 'ALL' ? undefined : selectedCategory,
          status: selectedStatus === 'ALL' ? undefined : selectedStatus,
          search: searchQuery.trim() || undefined
        }),
        soundOceanConsoleService.getSpawns()
      ]);
      setOverview(overviewData);
      setItems(itemsData);
      setSpawns(spawnsData);
    } catch (_err: any) {
      showToast('Error syncing with SoundOcean library plane', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleFreeze = async (item: SoundOceanItem) => {
    try {
      const updated = await soundOceanConsoleService.toggleFreeze(item.id);
      setItems(prev => prev.map(i => (i.id === item.id ? updated : i)));
      if (updated.status === 'frozen') {
        showToast(`Item "${updated.title}" quarantined/frozen securely!`, 'wahala');
      } else {
        showToast(`Item "${updated.title}" restored to active audio catalog!`, 'sweet');
      }
      loadData();
    } catch (err: any) {
      showToast('Failed to switch item freeze status', 'see_gobe');
    }
  };

  const handleReorder = async (currentIndex: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const sourceItem = items[currentIndex];
    const targetItem = items[targetIndex];

    try {
      const reordered = await soundOceanConsoleService.reorderItems(sourceItem.id, targetItem.id);
      setItems(reordered);
      showToast('Catalog priority resequenced in PostgreSQL!', 'gbaski');
    } catch (err: any) {
      showToast('Failed to reorder catalog items in database', 'wahala');
    }
  };

  const handleDelete = async (item: SoundOceanItem) => {
    if (!window.confirm(`Are you sure you want to delete "${item.title}" from SoundOcean library?`)) return;

    try {
      await soundOceanConsoleService.deleteItem(item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
      showToast(`Item "${item.title}" removed from library`, 'owo_ni_koko');
      loadData();
    } catch (err: any) {
      showToast('Failed to delete library item', 'see_gobe');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formCode || !formArtist) {
      showToast('Item Code, Title, and Artist are mandatory', 'wahala');
      return;
    }

    try {
      const parsedChannels = formStemChannels.split(',').map(s => s.trim()).filter(Boolean);
      const payload: CreateSoundOceanPayload = {
        code: formCode,
        title: formTitle,
        artist: formArtist,
        genre: formGenre,
        category: formCategory,
        bpm: Number(formBpm),
        bit_depth: Number(formBitDepth),
        sample_rate_khz: Number(formSampleRate),
        audio_format: formAudioFormat,
        license_type: formLicenseType,
        fic_price: Number(formFicPrice),
        royalty_split_pct: Number(formRoyaltySplit),
        stem_channels: parsedChannels
      };
      const created = await soundOceanConsoleService.createItem(payload);
      setItems(prev => [created, ...prev]);
      setIsAddModalOpen(false);
      resetForm();
      showToast(`Audio "${created.title}" added to SoundOcean Library!`, 'blessings');
      loadData();
    } catch (err: any) {
      showToast('Error registering item to SoundOcean', 'see_gobe');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    try {
      const parsedChannels = formStemChannels.split(',').map(s => s.trim()).filter(Boolean);
      const payload: Partial<CreateSoundOceanPayload> = {
        title: formTitle,
        artist: formArtist,
        genre: formGenre,
        category: formCategory,
        bpm: Number(formBpm),
        bit_depth: Number(formBitDepth),
        sample_rate_khz: Number(formSampleRate),
        audio_format: formAudioFormat,
        license_type: formLicenseType,
        fic_price: Number(formFicPrice),
        royalty_split_pct: Number(formRoyaltySplit),
        stem_channels: parsedChannels
      };
      const updated = await soundOceanConsoleService.updateItem(activeItem.id, payload);
      setItems(prev => prev.map(i => (i.id === activeItem.id ? updated : i)));
      setIsEditModalOpen(false);
      setActiveItem(null);
      resetForm();
      showToast(`Audio "${updated.title}" updated!`, 'madt_o');
      loadData();
    } catch (err: any) {
      showToast('Failed to update library item', 'wahala');
    }
  };

  const handleSpawn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spawnName || !spawnSlug) {
      showToast('Sub-Console Name and Slug are required', 'wahala');
      return;
    }

    try {
      const spawned = await soundOceanConsoleService.spawnSubConsole({
        sub_console_name: spawnName,
        slug: spawnSlug,
        endpoint: spawnEndpoint,
        category: spawnCategory
      });
      setSpawns(prev => [spawned, ...prev]);
      setIsSpawnModalOpen(false);
      setSpawnName('');
      setSpawnSlug('');
      showToast(`SoundOcean Sub-Console "${spawned.sub_console_name}" spawned live!`, 'colossal_combo');
      loadData();
    } catch (err: any) {
      showToast('Failed to spawn SoundOcean sub-console', 'see_gobe');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      showToast('Please select a master audio or stem archive file', 'wahala');
      return;
    }

    try {
      setUploading(true);
      const res = await soundOceanConsoleService.uploadAsset(
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

  const openEditModal = (item: SoundOceanItem) => {
    setActiveItem(item);
    setFormTitle(item.title);
    setFormArtist(item.artist);
    setFormCode(item.code);
    setFormGenre(item.genre);
    setFormCategory(item.category);
    setFormBpm(item.bpm);
    setFormBitDepth(item.bit_depth);
    setFormSampleRate(item.sample_rate_khz);
    setFormAudioFormat(item.audio_format);
    setFormLicenseType(item.license_type);
    setFormFicPrice(item.fic_price);
    setFormRoyaltySplit(item.royalty_split_pct);
    setFormStemChannels(Array.isArray(item.stem_channels) ? item.stem_channels.join(', ') : '');
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormTitle('');
    setFormArtist('');
    setFormCode('');
    setFormGenre('Afrobeat');
    setFormCategory('Master Stems');
    setFormBpm(120);
    setFormBitDepth(24);
    setFormSampleRate(96);
    setFormAudioFormat('FLAC');
    setFormLicenseType('Creative Commons CC-BY 4.0');
    setFormFicPrice(15.0);
    setFormRoyaltySplit(85.0);
    setFormStemChannels('Vocals, Drums, Bass, Horns, Synths');
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
            <div className="p-3 bg-cyan-100 rounded-xl border border-cyan-400">
              <CircleStackIcon className="w-8 h-8 text-cyan-950" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                SoundOcean Master Audio & Stem Library Console
              </h1>
              <p className="text-sm text-slate-700">
                Independent Sovereign Microservice: Member Ingestion, Audio Stems, Cultural Archival, Lossless FLAC & Metadata Library
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
            className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Ingest Audio/Stem</span>
          </button>
          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <FolderArrowDownIcon className="w-5 h-5" />
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
            <span>Direct Multipart Upload</span>
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
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Library Items</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{overview.summary.total_items}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Recordings</span>
            <p className="text-2xl font-black text-emerald-800 mt-1">{overview.summary.active_count}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quarantined / Frozen</span>
            <p className="text-2xl font-black text-rose-800 mt-1">{overview.summary.frozen_count}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Plays</span>
            <p className="text-2xl font-black text-blue-900 mt-1">{Number(overview.summary.total_plays).toLocaleString()}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Stem Downloads</span>
            <p className="text-2xl font-black text-indigo-900 mt-1">{Number(overview.summary.total_downloads).toLocaleString()}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Storage Footprint</span>
            <p className="text-2xl font-black text-cyan-900 mt-1">{Number(overview.summary.total_storage_mb).toFixed(1)} MB</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Avg Creator Royalty</span>
            <p className="text-2xl font-black text-amber-900 mt-1">{Number(overview.summary.avg_royalty_split_pct).toFixed(0)}%</p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="ALL">All Library Categories</option>
            <option value="Master Stems">Master Stems</option>
            <option value="Sound Packs">Sound Packs</option>
            <option value="Vocal & Instrument Stems">Vocal & Instrument Stems</option>
            <option value="Cultural Heritage">Cultural Heritage</option>
            <option value="Field Recordings">Field Recordings</option>
            <option value="Full Tracks">Full Tracks</option>
            <option value="Gaming & Metaverse">Gaming & Metaverse</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="ALL">All Operational Statuses</option>
            <option value="active">Active Audio Only</option>
            <option value="frozen">Frozen / Quarantined Only</option>
          </select>
        </div>

        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search audio titles, artists, codes, uploader..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Main Microservices Table */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="font-extrabold text-slate-900 text-lg">
            SoundOcean Catalog & Ingested Masters ({items.length})
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
                <th className="py-3.5 px-4">Track Title & Artist</th>
                <th className="py-3.5 px-4">Category / Genre</th>
                <th className="py-3.5 px-4">Audio Fidelity</th>
                <th className="py-3.5 px-4">BPM & Key</th>
                <th className="py-3.5 px-4">Royalty & Price</th>
                <th className="py-3.5 px-4">Plays / DLs</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-700 font-bold">
                    No library items matching filters.
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

                    {/* Title & Artist */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-xs font-semibold text-slate-700">{item.artist}</div>
                      <div className="text-xs font-mono text-slate-700 flex items-center space-x-2 mt-0.5">
                        <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[11px] font-bold">
                          {item.code}
                        </span>
                        <span className="text-slate-600 text-[11px] font-semibold">
                          By: {item.uploader_name}
                        </span>
                      </div>
                    </td>

                    {/* Category & Genre */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 text-xs bg-cyan-100 text-cyan-950 border border-cyan-300 px-2 py-0.5 rounded inline-block">
                        {item.category}
                      </div>
                      <div className="text-xs text-slate-700 mt-1 font-semibold">{item.genre}</div>
                    </td>

                    {/* Fidelity */}
                    <td className="py-3 px-4">
                      <span className="text-xs font-black text-indigo-950 bg-indigo-100 border border-indigo-400 px-2 py-0.5 rounded">
                        {item.bit_depth}-bit / {item.sample_rate_khz}kHz
                      </span>
                      <div className="text-xs font-mono text-slate-700 mt-0.5">
                        {item.audio_format} ({Number(item.file_size_mb).toFixed(1)}MB)
                      </div>
                    </td>

                    {/* BPM & Key */}
                    <td className="py-3 px-4 text-slate-800 font-semibold font-mono">
                      <div>{item.bpm} BPM</div>
                      <div className="text-xs text-slate-700">{item.key_signature}</div>
                    </td>

                    {/* Royalty & Price */}
                    <td className="py-3 px-4 text-slate-800 font-semibold">
                      <div className="font-mono">{item.fic_price > 0 ? `${item.fic_price} FIC` : 'Free / CC'}</div>
                      <div className="text-xs text-emerald-800 font-bold">{item.royalty_split_pct}% Split</div>
                    </td>

                    {/* Plays / Downloads */}
                    <td className="py-3 px-4 text-slate-800 text-xs font-semibold font-mono">
                      <div>▶ {item.play_count.toLocaleString()}</div>
                      <div className="text-slate-700">⬇ {item.download_count.toLocaleString()}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {item.status === 'active' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-950 border border-rose-400">
                          Frozen
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Toggle Freeze */}
                        <button
                          onClick={() => handleToggleFreeze(item)}
                          className={`p-1.5 rounded-lg border transition ${
                            item.status === 'active'
                              ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                              : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          }`}
                          title={item.status === 'active' ? 'Freeze / Quarantine' : 'Unfreeze Item'}
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
                          title="Upload FLAC Master or Stem Archive"
                        >
                          <ArrowUpTrayIcon className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
                          title="Edit Item Details"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-lg border border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100 transition"
                          title="Delete Library Item"
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
            <FolderArrowDownIcon className="w-6 h-6 text-cyan-900" />
            <h3 className="text-lg font-black text-slate-900">
              Active SoundOcean Sub-Consoles & Stem Archives ({spawns.length})
            </h3>
          </div>
          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 rounded-lg transition"
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
                className="border border-slate-300 rounded-xl p-4 bg-slate-50 hover:bg-white hover:border-cyan-400 transition shadow-sm"
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

      {/* MODAL: Ingest Audio/Stem */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 bg-slate-100 border-b border-slate-300 flex justify-between items-center sticky top-0 bg-slate-100 z-10">
              <h3 className="font-black text-slate-900 text-lg">Ingest Audio to SoundOcean Library</h3>
              <button type="button" aria-label="Close"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Catalog Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OCN-LIB-013"
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Track Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sovereign Horns of Ouidah"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Artist / Ensemble</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Benin Republic Brass Guild"
                    value={formArtist}
                    onChange={e => setFormArtist(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Genre</label>
                  <input
                    type="text"
                    required
                    value={formGenre}
                    onChange={e => setFormGenre(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Library Category</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Master Stems">Master Stems</option>
                  <option value="Sound Packs">Sound Packs</option>
                  <option value="Vocal & Instrument Stems">Vocal & Instrument Stems</option>
                  <option value="Cultural Heritage">Cultural Heritage</option>
                  <option value="Field Recordings">Field Recordings</option>
                  <option value="Full Tracks">Full Tracks</option>
                  <option value="Gaming & Metaverse">Gaming & Metaverse</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">BPM</label>
                  <input
                    type="number"
                    value={formBpm}
                    onChange={e => setFormBpm(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Bit Depth</label>
                  <select
                    value={formBitDepth}
                    onChange={e => setFormBitDepth(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value={16}>16-bit Standard</option>
                    <option value={24}>24-bit Studio</option>
                    <option value={32}>32-bit Float</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Sample Rate</label>
                  <select
                    value={formSampleRate}
                    onChange={e => setFormSampleRate(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value={44}>44.1 kHz</option>
                    <option value={48}>48.0 kHz</option>
                    <option value={96}>96.0 kHz Audiophile</option>
                    <option value={192}>192.0 kHz Master</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">FIC Price</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formFicPrice}
                    onChange={e => setFormFicPrice(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Creator Royalty %</label>
                  <input
                    type="number"
                    value={formRoyaltySplit}
                    onChange={e => setFormRoyaltySplit(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Stem Channels (Comma Separated)</label>
                <input
                  type="text"
                  value={formStemChannels}
                  onChange={e => setFormStemChannels(e.target.value)}
                  placeholder="e.g. Lead Vocals, Backing Vocals, Drums, Bass, Horns, Percussion"
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
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
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow transition"
                >
                  Register In Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Item */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 bg-slate-100 border-b border-slate-300 flex justify-between items-center sticky top-0 bg-slate-100 z-10">
              <h3 className="font-black text-slate-900 text-lg">Modify Library Item: {activeItem?.title}</h3>
              <button type="button" aria-label="Close"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Track Title</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Artist / Ensemble</label>
                  <input
                    type="text"
                    required
                    value={formArtist}
                    onChange={e => setFormArtist(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Library Category</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Master Stems">Master Stems</option>
                  <option value="Sound Packs">Sound Packs</option>
                  <option value="Vocal & Instrument Stems">Vocal & Instrument Stems</option>
                  <option value="Cultural Heritage">Cultural Heritage</option>
                  <option value="Field Recordings">Field Recordings</option>
                  <option value="Full Tracks">Full Tracks</option>
                  <option value="Gaming & Metaverse">Gaming & Metaverse</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">BPM</label>
                  <input
                    type="number"
                    value={formBpm}
                    onChange={e => setFormBpm(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">FIC Price</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formFicPrice}
                    onChange={e => setFormFicPrice(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Royalty %</label>
                  <input
                    type="number"
                    value={formRoyaltySplit}
                    onChange={e => setFormRoyaltySplit(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow transition"
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
              <h3 className="font-black text-slate-900 text-lg">Spawn SoundOcean Sub-Console</h3>
              <button type="button" aria-label="Close"
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
                  placeholder="e.g. Francophone Africa Stem Vault"
                  value={spawnName}
                  onChange={e => setSpawnName(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Console URL Slug</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. francophone-stem-vault"
                  value={spawnSlug}
                  onChange={e => setSpawnSlug(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Target Category</label>
                <select
                  value={spawnCategory}
                  onChange={e => setSpawnCategory(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Master Stems">Master Stems</option>
                  <option value="Raw Stems">Raw Stems</option>
                  <option value="Samples & Loops">Samples & Loops</option>
                  <option value="Dolby Atmos Bed">Dolby Atmos Bed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">API Endpoint</label>
                <input
                  type="text"
                  required
                  value={spawnEndpoint}
                  onChange={e => setSpawnEndpoint(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                {selectedItemForUpload ? `Upload FLAC/Stems for ${selectedItemForUpload.title}` : 'Direct Master Audio Upload'}
              </h3>
              <button type="button" aria-label="Close"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-2">
                  Select FLAC, WAV, or ZIP Archive (Direct Multipart/Form-Data to Express)
                </label>
                <input
                  type="file"
                  required
                  accept="audio/*,.flac,.wav,.zip,.aac"
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

export default MasterSoundOceanConsole;
