import React, { useState, useEffect, useCallback } from 'react';
import {
  PhoneIcon,
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
  ServerIcon,
  ShieldCheckIcon,
  WifiIcon
} from '@heroicons/react/24/outline';
import {
  CommsVoipItem,
  CommsVoipOverview,
  CommsVoipSpawn,
  CreateCommsVoipPayload
} from '../../types/commsVoipConsole';
import { commsVoipConsoleService } from '../../services/commsVoipConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterCommsVoipConsole: React.FC = () => {
  const [items, setItems] = useState<CommsVoipItem[]>([]);
  const [overview, setOverview] = useState<CommsVoipOverview | null>(null);
  const [spawns, setSpawns] = useState<CommsVoipSpawn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedItemForUpload, setSelectedItemForUpload] = useState<CommsVoipItem | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<CommsVoipItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formType, setFormType] = useState<string>('audio_video_conference');
  const [formCluster, setFormCluster] = useState<string>('Lagos-Citadel-TURN-01');
  const [formLimit, setFormLimit] = useState<number>(500);
  const [formBitrate, setFormBitrate] = useState<number>(256);
  const [formRecording, setFormRecording] = useState<boolean>(true);
  const [formEmergency, setFormEmergency] = useState<boolean>(false);
  const [formDescription, setFormDescription] = useState<string>('');

  // Spawn Form State
  const [spawnName, setSpawnName] = useState<string>('');
  const [spawnSlug, setSpawnSlug] = useState<string>('');
  const [spawnCategory, setSpawnCategory] = useState<string>('VoIP Mesh Relay');

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
        commsVoipConsoleService.getOverview(),
        commsVoipConsoleService.getItems({
          room_type: selectedCategory === 'ALL' ? undefined : selectedCategory,
          status: selectedStatus === 'ALL' ? undefined : selectedStatus,
          search: searchQuery.trim() || undefined
        }),
        commsVoipConsoleService.getSpawns()
      ]);
      setOverview(overviewData);
      setItems(itemsData);
      setSpawns(spawnsData);
    } catch (err: any) {
      console.error('Failed to load VoIP console data:', err);
      showToast('Error syncing with VoIP relay plane', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleFreeze = async (item: CommsVoipItem) => {
    try {
      const updated = await commsVoipConsoleService.toggleFreeze(item.id);
      setItems(prev => prev.map(i => (i.id === item.id ? updated : i)));
      if (updated.status === 'frozen') {
        showToast(`VoIP room "${updated.room_name}" frozen securely!`, 'wahala');
      } else {
        showToast(`VoIP room "${updated.room_name}" restored to active relay!`, 'sweet');
      }
      loadData();
    } catch (err: any) {
      showToast('Failed to toggle room freeze status', 'see_gobe');
    }
  };

  const handleReorder = async (currentIndex: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const sourceItem = items[currentIndex];
    const targetItem = items[targetIndex];

    try {
      const reordered = await commsVoipConsoleService.reorderItems(sourceItem.id, targetItem.id);
      setItems(reordered);
      showToast('VoIP relay routing priority resequenced!', 'gbaski');
    } catch (err: any) {
      showToast('Failed to reorder VoIP routes in database', 'wahala');
    }
  };

  const handleDelete = async (item: CommsVoipItem) => {
    if (!window.confirm(`Are you sure you want to decommission VoIP room "${item.room_name}"?`)) return;

    try {
      await commsVoipConsoleService.deleteItem(item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
      showToast(`VoIP room "${item.room_name}" decommissioned`, 'owo_ni_koko');
      loadData();
    } catch (err: any) {
      showToast('Failed to decommission VoIP room', 'see_gobe');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCode) {
      showToast('Room Code and Name are mandatory', 'wahala');
      return;
    }

    try {
      const payload: CreateCommsVoipPayload = {
        room_code: formCode,
        room_name: formName,
        room_type: formType,
        relay_cluster: formCluster,
        concurrency_limit: Number(formLimit),
        bitrate_kbps: Number(formBitrate),
        recording_enabled: formRecording,
        emergency_broadcast_priority: formEmergency,
        description: formDescription
      };
      const created = await commsVoipConsoleService.createItem(payload);
      setItems(prev => [created, ...prev]);
      setIsAddModalOpen(false);
      resetForm();
      showToast(`VoIP Relay "${created.room_name}" provisioned live!`, 'blessings');
      loadData();
    } catch (err: any) {
      showToast('Error creating VoIP room', 'see_gobe');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    try {
      const payload: Partial<CreateCommsVoipPayload> = {
        room_name: formName,
        room_type: formType,
        relay_cluster: formCluster,
        concurrency_limit: Number(formLimit),
        bitrate_kbps: Number(formBitrate),
        recording_enabled: formRecording,
        emergency_broadcast_priority: formEmergency,
        description: formDescription
      };
      const updated = await commsVoipConsoleService.updateItem(activeItem.id, payload);
      setItems(prev => prev.map(i => (i.id === activeItem.id ? updated : i)));
      setIsEditModalOpen(false);
      setActiveItem(null);
      resetForm();
      showToast(`VoIP Room "${updated.room_name}" updated!`, 'madt_o');
      loadData();
    } catch (err: any) {
      showToast('Failed to update VoIP room', 'wahala');
    }
  };

  const handleSpawn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spawnName || !spawnSlug) {
      showToast('Sub-Console Name and Slug are required', 'wahala');
      return;
    }

    try {
      const spawned = await commsVoipConsoleService.spawnSubConsole({
        title: spawnName,
        domain: spawnSlug,
        category: spawnCategory
      });
      setSpawns(prev => [spawned, ...prev]);
      setIsSpawnModalOpen(false);
      setSpawnName('');
      setSpawnSlug('');
      showToast(`VoIP Sub-Relay "${spawned.title}" spawned live!`, 'colossal_combo');
      loadData();
    } catch (err: any) {
      showToast('Failed to spawn VoIP sub-relay', 'see_gobe');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      showToast('Please select a codec/config asset', 'wahala');
      return;
    }

    try {
      setUploading(true);
      const res = await commsVoipConsoleService.uploadAsset(
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

  const openEditModal = (item: CommsVoipItem) => {
    setActiveItem(item);
    setFormName(item.room_name);
    setFormCode(item.room_code);
    setFormType(item.room_type);
    setFormCluster(item.relay_cluster);
    setFormLimit(item.concurrency_limit);
    setFormBitrate(item.bitrate_kbps);
    setFormRecording(item.recording_enabled);
    setFormEmergency(item.emergency_broadcast_priority);
    setFormDescription(item.description || '');
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormName('');
    setFormCode('');
    setFormType('audio_video_conference');
    setFormCluster('Lagos-Citadel-TURN-01');
    setFormLimit(500);
    setFormBitrate(256);
    setFormRecording(true);
    setFormEmergency(false);
    setFormDescription('');
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
            <div className="p-3 bg-sky-100 rounded-xl border border-sky-400">
              <PhoneIcon className="w-8 h-8 text-sky-950" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Communications VoIP & WebRTC Relay Master Console
              </h1>
              <p className="text-sm text-slate-700">
                Sovereign WebRTC STUN/TURN Relays, Telco SIP Trunks, Adaptive Jitter Buffers & Low-Latency Mesh Telemetry
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
            className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Provision VoIP Room</span>
          </button>
          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <ServerIcon className="w-5 h-5" />
            <span>Spawn Sub-Relay</span>
          </button>
          <button
            onClick={() => {
              setSelectedItemForUpload(null);
              setIsUploadModalOpen(true);
            }}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
            <span>Upload Config/Cert</span>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total VoIP Relays</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{overview.summary.total_items}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Relays</span>
            <p className="text-2xl font-black text-emerald-800 mt-1">{overview.summary.active_count}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Call Peers</span>
            <p className="text-2xl font-black text-blue-900 mt-1">{Number(overview.summary.total_active_peers).toLocaleString()}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Concurrency Capacity</span>
            <p className="text-2xl font-black text-sky-900 mt-1">{Number(overview.summary.total_concurrency_limit).toLocaleString()}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Avg Latency</span>
            <p className="text-2xl font-black text-indigo-900 mt-1">{Number(overview.summary.avg_latency_ms).toFixed(1)} ms</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Packet Loss</span>
            <p className="text-2xl font-black text-teal-900 mt-1">{Number(overview.summary.avg_packet_loss_pct).toFixed(2)}%</p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="ALL">All Room Types</option>
            <option value="audio_video_conference">Audio / Video Conference</option>
            <option value="spatial_audio_mesh">Spatial Audio Mesh</option>
            <option value="webinar_broadcast">Webinar Broadcast</option>
            <option value="encrypted_emergency_mesh">Encrypted Emergency Mesh</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="ALL">All Operational Statuses</option>
            <option value="active">Active Relays Only</option>
            <option value="frozen">Frozen Relays Only</option>
          </select>
        </div>

        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search rooms, codes, relay clusters..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Main Microservices Table */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="font-extrabold text-slate-900 text-lg">
            VoIP & WebRTC Mesh Relays ({items.length})
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
                <th className="py-3.5 px-4">Room & Cluster</th>
                <th className="py-3.5 px-4">Relay Type</th>
                <th className="py-3.5 px-4">Active Peers / Limit</th>
                <th className="py-3.5 px-4">Bitrate</th>
                <th className="py-3.5 px-4">Latency & Loss</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-700 font-bold">
                    No VoIP rooms matching filters.
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

                    {/* Room Name & Code */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.room_name}</div>
                      <div className="text-xs font-mono text-slate-700 flex items-center space-x-2 mt-0.5">
                        <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[11px] font-bold">
                          {item.room_code}
                        </span>
                        <span className="text-sky-800 font-semibold text-[11px]">
                          {item.relay_cluster}
                        </span>
                      </div>
                    </td>

                    {/* Room Type */}
                    <td className="py-3 px-4">
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md">
                        {item.room_type}
                      </span>
                    </td>

                    {/* Peers / Concurrency */}
                    <td className="py-3 px-4 text-slate-800 font-semibold font-mono">
                      <div>{item.active_peers_count} / {item.concurrency_limit} peers</div>
                    </td>

                    {/* Bitrate */}
                    <td className="py-3 px-4 text-slate-800 font-semibold font-mono">
                      {item.bitrate_kbps} kbps
                    </td>

                    {/* Latency & Loss */}
                    <td className="py-3 px-4 text-slate-800 font-semibold font-mono">
                      <div>{item.latency_ms} ms</div>
                      <div className="text-xs text-slate-600">{Number(item.packet_loss_percent).toFixed(2)}% loss</div>
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
                          title={item.status === 'active' ? 'Freeze Room' : 'Unfreeze Room'}
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
                          title="Upload Config/Cert"
                        >
                          <ArrowUpTrayIcon className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
                          title="Edit VoIP Room"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-lg border border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100 transition"
                          title="Decommission Room"
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
            <ServerIcon className="w-6 h-6 text-sky-900" />
            <h3 className="text-lg font-black text-slate-900">
              Active VoIP Sub-Relays & Bridges ({spawns.length})
            </h3>
          </div>
          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-lg transition"
          >
            Spawn Another Sub-Relay
          </button>
        </div>

        {spawns.length === 0 ? (
          <p className="text-sm font-semibold text-slate-700">No sub-relays spawned yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spawns.map(spawn => (
              <div
                key={spawn.id}
                className="border border-slate-300 rounded-xl p-4 bg-slate-50 hover:bg-white hover:border-sky-400 transition shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm">{spawn.title}</span>
                  <span className="text-[11px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 px-2 py-0.5 rounded">
                    {spawn.status}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-700 mt-2">Domain: {spawn.domain}</div>
                <div className="text-xs text-slate-700 mt-1">{spawn.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: Provision VoIP Room */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 bg-slate-100 border-b border-slate-300 flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-lg">Provision VoIP Room / Relay</h3>
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
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Room Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VOIP-CONF-05"
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Room Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lagos City Conference Stage"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Room Type</label>
                  <select
                    value={formType}
                    onChange={e => setFormType(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="audio_video_conference">Audio / Video Conference</option>
                    <option value="spatial_audio_mesh">Spatial Audio Mesh</option>
                    <option value="webinar_broadcast">Webinar Broadcast</option>
                    <option value="encrypted_emergency_mesh">Encrypted Emergency Mesh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">TURN Relay Cluster</label>
                  <input
                    type="text"
                    value={formCluster}
                    onChange={e => setFormCluster(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Concurrency Limit</label>
                  <input
                    type="number"
                    value={formLimit}
                    onChange={e => setFormLimit(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Bitrate (kbps)</label>
                  <input
                    type="number"
                    value={formBitrate}
                    onChange={e => setFormBitrate(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
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
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow transition"
                >
                  Provision Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Room */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 bg-slate-100 border-b border-slate-300 flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-lg">Modify Room: {activeItem?.room_name}</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Room Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Room Type</label>
                  <select
                    value={formType}
                    onChange={e => setFormType(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="audio_video_conference">Audio / Video Conference</option>
                    <option value="spatial_audio_mesh">Spatial Audio Mesh</option>
                    <option value="webinar_broadcast">Webinar Broadcast</option>
                    <option value="encrypted_emergency_mesh">Encrypted Emergency Mesh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Concurrency</label>
                  <input
                    type="number"
                    value={formLimit}
                    onChange={e => setFormLimit(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
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
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow transition"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Spawn Sub-Relay */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 bg-slate-100 border-b border-slate-300 flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-lg">Spawn VoIP Sub-Relay</h3>
              <button
                onClick={() => setIsSpawnModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSpawn} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Relay Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Accra WebRTC Gateway"
                  value={spawnName}
                  onChange={e => setSpawnName(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Domain Slug</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. accra-webrtc-gateway"
                  value={spawnSlug}
                  onChange={e => setSpawnSlug(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
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
                {selectedItemForUpload ? `Upload Config for ${selectedItemForUpload.room_name}` : 'Upload VoIP Asset'}
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
                  Select Config/Cert File (Direct Multipart/Form-Data to Express)
                </label>
                <input
                  type="file"
                  required
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
