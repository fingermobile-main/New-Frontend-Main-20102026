import React, { useState, useEffect, useCallback } from 'react';
import {
  MusicalNoteIcon,
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
  SpeakerWaveIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import {
  SoundSonicItem,
  SoundSonicOverview,
  SoundSonicSpawn,
  CreateSoundSonicPayload
} from '../../types/soundSonicConsole';
import { soundSonicConsoleService } from '../../services/soundSonicConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterSoundSonicConsole: React.FC = () => {
  const [items, setItems] = useState<SoundSonicItem[]>([]);
  const [overview, setOverview] = useState<SoundSonicOverview | null>(null);
  const [spawns, setSpawns] = useState<SoundSonicSpawn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedItemForUpload, setSelectedItemForUpload] = useState<SoundSonicItem | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<SoundSonicItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Sonic River');
  const [formBitrate, setFormBitrate] = useState<number>(320);
  const [formSampleRate, setFormSampleRate] = useState<number>(48);
  const [formLatency, setFormLatency] = useState<number>(18);
  const [formChannels, setFormChannels] = useState<number>(2);
  const [formDescription, setFormDescription] = useState<string>('');

  // Spawn Form State
  const [spawnName, setSpawnName] = useState<string>('');
  const [spawnSlug, setSpawnSlug] = useState<string>('');
  const [spawnEndpoint, setSpawnEndpoint] = useState<string>('/api/sound-sonic-console/spawns');
  const [spawnCategory, setSpawnCategory] = useState<string>('Sonic Stream');

  const showToast = (msg: string, voice?: AfricanVoiceLine) => {
    setToastMessage(msg);
    if (voice) audioEngine.playVoiceLine(voice);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ov, itms, sps] = await Promise.all([
        soundSonicConsoleService.getOverview(),
        soundSonicConsoleService.getItems({
          category: selectedCategory,
          status: selectedStatus,
          search: searchQuery
        }),
        soundSonicConsoleService.getSpawns()
      ]);
      setOverview(ov);
      setItems(itms);
      setSpawns(sps);
    } catch (err: any) {
      showToast(err.message || 'Error fetching sound sonic data', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleFreeze = async (id: number) => {
    try {
      const updated = await soundSonicConsoleService.toggleFreeze(id);
      setItems(prev => prev.map(item => item.id === id ? updated : item));
      showToast(`Audio Pipe #${id} status changed to ${updated.status.toUpperCase()}`, 'wahala');
      loadData();
    } catch (_err) {
      showToast('Error toggling audio pipe freeze state', 'wahala');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    try {
      const updatedItems = await soundSonicConsoleService.reorderItems(items[index].id, items[targetIndex].id);
      setItems(updatedItems);
      showToast('Audio pipes reordered in PostgreSQL', 'gbaski');
    } catch (_err) {
      showToast('Error reordering audio pipes', 'wahala');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Purge audio pipe #${id} permanently from database?`)) return;
    try {
      await soundSonicConsoleService.deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      showToast(`Purged audio pipe #${id}`, 'madt_o');
      loadData();
    } catch (_err) {
      showToast('Error purging audio pipe', 'wahala');
    }
  };

  const handleCreatePipe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: CreateSoundSonicPayload = {
        code: formCode,
        name: formName,
        category: formCategory,
        bitrate_kbps: formBitrate,
        sample_rate_khz: formSampleRate,
        latency_ms: formLatency,
        channels: formChannels,
        description: formDescription,
        status: 'active'
      };
      await soundSonicConsoleService.createItem(payload);
      showToast(`Sonic Pipe "${formName}" provisioned live!`, 'blessings');
      setIsAddModalOpen(false);
      resetForm();
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Error creating sonic pipe', 'wahala');
    }
  };

  const handleEditPipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;
    try {
      await soundSonicConsoleService.updateItem(activeItem.id, {
        name: formName,
        category: formCategory,
        bitrate_kbps: formBitrate,
        sample_rate_khz: formSampleRate,
        latency_ms: formLatency,
        channels: formChannels,
        description: formDescription
      });
      showToast(`Sonic Pipe "${formName}" updated successfully!`, 'sweet');
      setIsEditModalOpen(false);
      setActiveItem(null);
      resetForm();
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Error updating sonic pipe', 'wahala');
    }
  };

  const openEditModal = (item: SoundSonicItem) => {
    setActiveItem(item);
    setFormCode(item.code);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormBitrate(item.bitrate_kbps);
    setFormSampleRate(item.sample_rate_khz);
    setFormLatency(item.latency_ms);
    setFormChannels(item.channels);
    setFormDescription(item.description);
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormCode('');
    setFormName('');
    setFormCategory('Sonic River');
    setFormBitrate(320);
    setFormSampleRate(48);
    setFormLatency(18);
    setFormChannels(2);
    setFormDescription('');
  };

  const handleSpawnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await soundSonicConsoleService.createSpawn({
        sub_console_name: spawnName,
        slug: spawnSlug,
        endpoint: spawnEndpoint,
        category: spawnCategory
      });
      showToast(`Sub-Console "${spawnName}" registered in PostgreSQL!`, 'owo_ni_koko');
      setIsSpawnModalOpen(false);
      setSpawnName('');
      setSpawnSlug('');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to spawn sub-console', 'wahala');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    try {
      setUploading(true);
      await soundSonicConsoleService.uploadAsset(selectedItemForUpload?.id || null, uploadFile);
      showToast('Master FLAC stem ingested directly to server!', 'blessings');
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setSelectedItemForUpload(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Stem upload failed', 'wahala');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-bounce">
          <SparklesIcon className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl border border-purple-700/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-purple-500/20 text-purple-300 border border-purple-400/30 rounded-2xl">
                <MusicalNoteIcon className="w-7 h-7" />
              </span>
              <span className="text-xs font-black tracking-widest uppercase bg-purple-500/20 text-purple-200 border border-purple-400/30 px-3 py-1 rounded-full">
                Sovereign High-Fidelity Sonic Mesh
              </span>
            </div>
            <h1 className="text-3xl font-black mt-3 tracking-tight text-white">
              Sound River & Sound Ocean Sonic Console
            </h1>
            <p className="text-purple-200/80 text-sm mt-1 max-w-2xl font-medium">
              Autonomous administration of 320kbps Sonic River adaptive pipes, 24-bit/192kHz Audiophile FLAC Ocean streams, spatial 3D audio panners, neural stem separators, and authentic African voice synthesizers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Register Sonic Pipe
            </button>
            <button
              onClick={() => setIsSpawnModalOpen(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-black rounded-xl transition-all flex items-center gap-2"
            >
              <BuildingOffice2Icon className="w-4 h-4" />
              Spawn Sub-Console
            </button>
            <button
              onClick={loadData}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all"
              title="Refresh Live Data"
            >
              <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 4 Overview Metrics */}
        {overview && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-purple-200/70 font-semibold uppercase tracking-wider">Audio Pipes</span>
              <div className="text-2xl font-black text-white mt-1">
                {overview.summary.total_items}
              </div>
              <span className="text-[11px] text-emerald-300 font-bold">
                {overview.summary.active_count} Active · {overview.summary.frozen_count} Frozen
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-purple-200/70 font-semibold uppercase tracking-wider">Peak FLAC Bitrate</span>
              <div className="text-2xl font-black text-emerald-300 mt-1 font-mono">
                {overview.summary.max_bitrate_kbps.toLocaleString()}
                <span className="text-xs font-normal text-purple-200/70 ml-1">kbps</span>
              </div>
              <span className="text-[11px] text-purple-200/70 font-medium">Studio Master Quality</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-purple-200/70 font-semibold uppercase tracking-wider">Max Sample Rate</span>
              <div className="text-2xl font-black text-amber-300 mt-1 font-mono">
                {overview.summary.max_sample_rate_khz}
                <span className="text-xs font-normal text-purple-200/70 ml-1">kHz</span>
              </div>
              <span className="text-[11px] text-purple-200/70 font-medium">24-Bit Audiophile Ocean</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-purple-200/70 font-semibold uppercase tracking-wider">Avg Latency</span>
              <div className="text-2xl font-black text-indigo-300 mt-1 font-mono">
                {parseFloat(overview.summary.avg_latency_ms || '0').toFixed(1)}
                <span className="text-xs font-normal text-purple-200/70 ml-1">ms</span>
              </div>
              <span className="text-[11px] text-purple-200/70 font-medium">{overview.totalSpawns} Sub-Consoles</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'Sonic River', 'Sound Ocean', 'Spatial Audio', 'Stems Processing', 'DSP & Mastering', 'Broadcast Relays', 'Spoken Word', 'Copyright & Proof', 'Monetization', 'Voice Synthesizer', 'Vault Storage'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
          >
            <option value="ALL">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="frozen">Frozen Only</option>
          </select>

          <input
            type="text"
            placeholder="Search stream, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl w-60 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Autonomous Sonic Streams & Audio DSP Registry ({items.length})
            </h3>
            <p className="text-xs text-slate-700">
              Live transactional resequencing (Up/Down) directly persisted in PostgreSQL
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-black text-slate-800 uppercase tracking-wider">
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4">Code / Stream Pipe</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Bitrate</th>
                <th className="py-3 px-4 text-right">Sample Rate</th>
                <th className="py-3 px-4 text-right">Latency / Ch</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Resequencing Up / Down */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUpIcon className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] font-mono font-bold text-slate-800 w-5 text-center">
                        {item.display_order}
                      </span>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === items.length - 1}
                        className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDownIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Stream Pipe Name and Code */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[11px] text-slate-700 flex items-center gap-2 mt-0.5">
                      <span className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-300">
                        {item.code}
                      </span>
                      <span>{item.description}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-100 text-purple-950 border border-purple-400">
                      {item.category}
                    </span>
                  </td>

                  {/* Bitrate */}
                  <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
                    {item.bitrate_kbps > 0 ? `${item.bitrate_kbps.toLocaleString()} kbps` : 'Lossless / Tick'}
                  </td>

                  {/* Sample Rate */}
                  <td className="py-3 px-4 text-right font-black text-indigo-700 font-mono">
                    {item.sample_rate_khz > 0 ? `${item.sample_rate_khz} kHz` : 'Direct Signal'}
                  </td>

                  {/* Latency & Channels */}
                  <td className="py-3 px-4 text-right">
                    <div className="font-bold text-slate-800 font-mono">{item.latency_ms} ms</div>
                    <span className="text-[10px] text-slate-600 font-medium">
                      {item.channels === 1 ? 'Mono' : item.channels === 2 ? 'Stereo' : `${item.channels}ch Spatial`}
                    </span>
                  </td>

                  {/* Freeze Killswitch */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleFreeze(item.id)}
                      className={`px-2.5 py-1 text-[11px] font-black rounded-lg border flex items-center justify-center gap-1 mx-auto transition-all ${
                        item.status === 'active'
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-950 border-rose-400 hover:bg-rose-200'
                      }`}
                    >
                      {item.status === 'active' ? (
                        <>
                          <PlayIcon className="w-3 h-3 text-emerald-700" />
                          ACTIVE
                        </>
                      ) : (
                        <>
                          <PauseIcon className="w-3 h-3 text-rose-700" />
                          FROZEN
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions: Upload, Edit, Delete */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedItemForUpload(item);
                          setIsUploadModalOpen(true);
                        }}
                        className="p-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg border border-purple-200"
                        title="Upload Master Stem / Audio"
                      >
                        <ArrowUpTrayIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 bg-slate-50 text-slate-700 hover:bg-slate-200 rounded-lg border border-slate-300"
                        title="Edit Pipe"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg border border-rose-200"
                        title="Delete Pipe"
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
      </div>

      {/* Spawned Sub-Consoles Card */}
      {spawns.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BuildingOffice2Icon className="w-5 h-5 text-purple-600" />
            Registered Sovereign Sub-Consoles ({spawns.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spawns.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="font-bold text-slate-900 text-sm">{s.sub_console_name}</div>
                <div className="text-xs text-slate-600 font-mono mt-1">{s.slug}</div>
                <div className="text-[11px] text-purple-700 mt-2 flex items-center justify-between">
                  <span>{s.category}</span>
                  <span className="text-emerald-700 font-bold uppercase">{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Register Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-300 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-black text-slate-900">Provision Sonic Audio Pipe</h3>
              <button type="button" aria-label="Close" onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreatePipe} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Pipe Code</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="e.g. SONIC-SURROUND-51"
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Pipe Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. 5.1 Surround Sound Afro-Cinema Pipe"
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="Sonic River">Sonic River</option>
                    <option value="Sound Ocean">Sound Ocean</option>
                    <option value="Spatial Audio">Spatial Audio</option>
                    <option value="Stems Processing">Stems Processing</option>
                    <option value="DSP & Mastering">DSP & Mastering</option>
                    <option value="Broadcast Relays">Broadcast Relays</option>
                    <option value="Spoken Word">Spoken Word</option>
                    <option value="Copyright & Proof">Copyright & Proof</option>
                    <option value="Monetization">Monetization</option>
                    <option value="Voice Synthesizer">Voice Synthesizer</option>
                    <option value="Vault Storage">Vault Storage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Bitrate (kbps)</label>
                  <input
                    type="number"
                    value={formBitrate}
                    onChange={(e) => setFormBitrate(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Sample Rate (kHz)</label>
                  <input
                    type="number"
                    value={formSampleRate}
                    onChange={(e) => setFormSampleRate(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Latency (ms)</label>
                  <input
                    type="number"
                    value={formLatency}
                    onChange={(e) => setFormLatency(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Channels</label>
                  <input
                    type="number"
                    value={formChannels}
                    onChange={(e) => setFormChannels(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Acoustic characteristics, codec parameters, buffer sizing..."
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md"
                >
                  Provision Pipe Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-300 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-black text-slate-900">Edit Sonic Pipe: {activeItem.code}</h3>
              <button type="button" aria-label="Close" onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditPipe} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Pipe Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="Sonic River">Sonic River</option>
                    <option value="Sound Ocean">Sound Ocean</option>
                    <option value="Spatial Audio">Spatial Audio</option>
                    <option value="Stems Processing">Stems Processing</option>
                    <option value="DSP & Mastering">DSP & Mastering</option>
                    <option value="Broadcast Relays">Broadcast Relays</option>
                    <option value="Spoken Word">Spoken Word</option>
                    <option value="Copyright & Proof">Copyright & Proof</option>
                    <option value="Monetization">Monetization</option>
                    <option value="Voice Synthesizer">Voice Synthesizer</option>
                    <option value="Vault Storage">Vault Storage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Bitrate (kbps)</label>
                  <input
                    type="number"
                    value={formBitrate}
                    onChange={(e) => setFormBitrate(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Sample Rate (kHz)</label>
                  <input
                    type="number"
                    value={formSampleRate}
                    onChange={(e) => setFormSampleRate(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Latency (ms)</label>
                  <input
                    type="number"
                    value={formLatency}
                    onChange={(e) => setFormLatency(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Channels</label>
                  <input
                    type="number"
                    value={formChannels}
                    onChange={(e) => setFormChannels(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub-Console Spawner Modal */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-black text-slate-900">Spawn Sovereign Sub-Console</h3>
              <button type="button" aria-label="Close" onClick={() => setIsSpawnModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSpawnSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Sub-Console Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Binaural 3D Sub-Console"
                  value={spawnName}
                  onChange={(e) => setSpawnName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. binaural-3d-sub-console"
                  value={spawnSlug}
                  onChange={(e) => setSpawnSlug(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">API Endpoint</label>
                <input
                  type="text"
                  required
                  value={spawnEndpoint}
                  onChange={(e) => setSpawnEndpoint(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                <input
                  type="text"
                  value={spawnCategory}
                  onChange={(e) => setSpawnCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSpawnModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
                >
                  Register Sub-Console
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Multipart File Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <SpeakerWaveIcon className="w-5 h-5 text-purple-600" />
                Upload Master Stem / Audio File
              </h3>
              <button type="button" aria-label="Close" onClick={() => setIsUploadModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
              <div className="text-xs text-slate-700">
                Direct multipart/form-data ingestion to Express storage (<code className="font-mono text-slate-900">/uploads/sonic/*</code>). Zero client localStorage fallback.
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-purple-500 transition-colors bg-slate-50">
                <input
                  type="file"
                  id="sonic-file-input"
                  className="hidden"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="sonic-file-input" className="cursor-pointer block">
                  <ArrowUpTrayIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <span className="text-xs font-bold text-slate-800">
                    {uploadFile ? uploadFile.name : 'Click to select audio stem (FLAC, WAV, MP3)'}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Up to 100MB</p>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadFile || uploading}
                  className="px-5 py-2 text-xs font-black text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-40 rounded-xl shadow-md flex items-center gap-2"
                >
                  {uploading ? 'Ingesting...' : 'Ingest to Server'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
