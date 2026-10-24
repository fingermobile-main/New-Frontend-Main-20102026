import React, { useState, useEffect, useCallback } from 'react';
import {
  PhoneCall,
  Video,
  Mic,
  Activity,
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
  Server,
  Zap,
  Globe,
  Radio,
  Sliders,
  Sparkles,
  Users,
  CheckCircle2
} from 'lucide-react';
import {
  CommsVoipRoomItem,
  CommsVoipOverview,
  CommsVoipSpawnedConsole,
  CreateVoipRoomPayload,
  VoipRoomType,
  StunTurnHealth
} from '../../types/commsVoipConsole';
import commsVoipConsoleService from '../../services/commsVoipConsoleService';
import superViAudio from '../../services/SuperViAudioEngine';

const ROOM_TYPES: { label: string; value: VoipRoomType }[] = [
  { label: 'Audio & Video Conference', value: 'audio_video_conference' },
  { label: 'Spatial Audio Mesh', value: 'spatial_audio_mesh' },
  { label: 'Voice-Only Room', value: 'voice_only_room' },
  { label: 'Executive Broadcast', value: 'executive_broadcast' },
  { label: 'Webinar Broadcast', value: 'webinar_broadcast' },
  { label: 'Encrypted Emergency Mesh', value: 'encrypted_emergency_mesh' },
  { label: 'Telehealth Encrypted P2P', value: 'telehealth_encrypted_p2p' }
];

export const MasterCommunicationsVoipConsole: React.FC = () => {
  // 1. State
  const [overview, setOverview] = useState<CommsVoipOverview | null>(null);
  const [items, setItems] = useState<CommsVoipRoomItem[]>([]);
  const [spawns, setSpawns] = useState<CommsVoipSpawnedConsole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Modals & Action States
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CommsVoipRoomItem | null>(null);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [isDefconEngaged, setIsDefconEngaged] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Forms
  const [newRoom, setNewRoom] = useState<CreateVoipRoomPayload>({
    room_name: '',
    room_code: '',
    room_type: 'audio_video_conference',
    relay_cluster: 'Lagos-Central-STUN-01',
    concurrency_limit: 100,
    bitrate_kbps: 128,
    recording_enabled: true,
    emergency_broadcast_priority: false
  });

  const [newSpawn, setNewSpawn] = useState({
    title: '',
    domain: '',
    badge: 'VOIP-MESH',
    description: '',
    active_instances: 1
  });

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [overviewData, itemsData, spawnsData] = await Promise.all([
        commsVoipConsoleService.getOverview(),
        commsVoipConsoleService.getItems(),
        commsVoipConsoleService.getSpawns()
      ]);
      setOverview(overviewData);
      setItems(itemsData);
      setSpawns(spawnsData);

      const hasDefcon = itemsData.some((i: CommsVoipRoomItem) => i.status === 'defcon_disabled');
      setIsDefconEngaged(hasDefcon);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Network / DB Error';
      notify(`Failed to fetch Communications VoIP data: ${errorMsg}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Handlers
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.room_name || !newRoom.room_code) {
      notify('Room Name and Room Code are mandatory', 'error');
      return;
    }
    try {
      await commsVoipConsoleService.createItem(newRoom);
      superViAudio.playVoiceLine('boom');
      notify(`WebRTC Room "${newRoom.room_name}" created & registered on mesh.`);
      setIsAddModalOpen(false);
      setNewRoom({
        room_name: '',
        room_code: '',
        room_type: 'audio_video_conference',
        relay_cluster: 'Lagos-Central-STUN-01',
        concurrency_limit: 100,
        bitrate_kbps: 128,
        recording_enabled: true,
        emergency_broadcast_priority: false
      });
      loadAllData();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Creation failed';
      notify(`Creation error: ${errorMsg}`, 'error');
    }
  };

  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await commsVoipConsoleService.updateItem(editingItem.id, {
        room_name: editingItem.room_name,
        room_type: editingItem.room_type,
        relay_cluster: editingItem.relay_cluster,
        concurrency_limit: editingItem.concurrency_limit,
        bitrate_kbps: editingItem.bitrate_kbps,
        recording_enabled: editingItem.recording_enabled,
        emergency_broadcast_priority: editingItem.emergency_broadcast_priority,
        stun_turn_health: editingItem.stun_turn_health,
        status: editingItem.status
      });
      superViAudio.playVoiceLine('sweet');
      notify(`Room "${editingItem.room_name}" updated successfully.`);
      setIsEditModalOpen(false);
      setEditingItem(null);
      loadAllData();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Update failed';
      notify(`Update error: ${errorMsg}`, 'error');
    }
  };

  const handleDeleteRoom = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete WebRTC room "${name}"?`)) return;
    try {
      await commsVoipConsoleService.deleteItem(id);
      superViAudio.playVoiceLine('wahala');
      notify(`VoIP room "${name}" deleted.`);
      loadAllData();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Delete failed';
      notify(`Delete error: ${errorMsg}`, 'error');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...items];
    const temp = reordered[index];
    reordered[index] = reordered[newIndex];
    reordered[newIndex] = temp;

    const payload = reordered.map((item, idx) => ({
      id: item.id,
      display_order: idx + 1
    }));

    setItems(reordered);

    try {
      await commsVoipConsoleService.reorderItems(payload);
      superViAudio.playVoiceLine('thumbs_up');
      notify('VoIP room channel order synchronized.');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Reorder failed';
      notify(`Reorder error: ${errorMsg}`, 'error');
      loadAllData();
    }
  };

  const handleToggleDefcon = async () => {
    const nextState = !isDefconEngaged;
    const confirmPrompt = nextState
      ? 'DEFCON ALERT: Engage emergency lockdown? This will lock all VoIP mesh channels and interrupt active calls.'
      : 'DISENGAGE DEFCON: Restore all WebRTC channels to active mesh status?';

    if (!window.confirm(confirmPrompt)) return;

    try {
      await commsVoipConsoleService.toggleDefcon(nextState);
      setIsDefconEngaged(nextState);
      if (nextState) {
        superViAudio.playVoiceLine('see_gobe');
        notify('DEFCON LOCKDOWN ENGAGED: VoIP mesh locked down.', 'error');
      } else {
        superViAudio.playVoiceLine('blessings');
        notify('DEFCON DISENGAGED: VoIP mesh restored.', 'success');
      }
      loadAllData();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Defcon toggle failed';
      notify(`Defcon toggle error: ${errorMsg}`, 'error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, roomId?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await commsVoipConsoleService.uploadAsset(file, roomId);
      superViAudio.playVoiceLine('gbaski');
      notify(`VoIP Media Asset uploaded: ${result.filename} (${result.url})`);
      loadAllData();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      notify(`Upload error: ${errorMsg}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSpawnConsole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpawn.title || !newSpawn.domain) {
      notify('Title and Domain are mandatory', 'error');
      return;
    }
    try {
      await commsVoipConsoleService.createSpawn(newSpawn);
      superViAudio.playVoiceLine('madt_o');
      notify(`Sovereign VoIP Console "${newSpawn.title}" spawned on domain ${newSpawn.domain}`);
      setIsSpawnModalOpen(false);
      setNewSpawn({
        title: '',
        domain: '',
        badge: 'VOIP-MESH',
        description: '',
        active_instances: 1
      });
      loadAllData();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Spawn error';
      notify(`Spawn error: ${errorMsg}`, 'error');
    }
  };

  // Filtered Items
  const filteredItems = items.filter(item => {
    const matchesType = selectedType === 'all' || item.room_type === selectedType;
    const matchesSearch =
      item.room_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.room_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.relay_cluster.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            notification.type === 'error'
              ? 'bg-rose-100 text-rose-950 border-rose-400'
              : notification.type === 'info'
              ? 'bg-sky-100 text-sky-950 border-sky-400'
              : 'bg-emerald-100 text-emerald-950 border-emerald-400'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Sparkles className="h-5 w-5" />
            <span className="font-bold text-sm">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold underline px-2 py-1 rounded hover:bg-white/20"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <PhoneCall className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 px-3 py-1 rounded-full text-blue-300 text-xs font-bold tracking-wider uppercase border border-blue-400/30">
              <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
              <span>Sovereign WebRTC & VoIP Mesh Engine</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center space-x-3">
              <span>Communications, WebRTC & VoIP Console</span>
            </h1>
            <p className="text-blue-200 text-sm max-w-2xl font-medium">
              Micromanage real-time WebRTC audio/video mesh conference rooms, STUN/TURN relays, DTLS-SRTP encryption, codec bitrates, and emergency broadcast overrides directly synced to PostgreSQL.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleToggleDefcon}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 shadow-lg transition-all ${
                isDefconEngaged
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30'
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              <span>{isDefconEngaged ? 'DEFCON ACTIVE (LOCKED)' : 'DEFCON LOCKDOWN'}</span>
            </button>

            <button
              onClick={() => setIsSpawnModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center space-x-2 shadow-lg transition-all"
            >
              <Globe className="h-4 w-4" />
              <span>Spawn VoIP Edge Node</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center space-x-2 shadow-lg transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Create WebRTC Room</span>
            </button>

            <button
              onClick={loadAllData}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Pillar 1: Telemetry Cards */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider">Active Rooms</span>
              <Video className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{overview.active_rooms} / {overview.total_rooms}</div>
            <div className="text-xs text-slate-700 font-semibold">Mesh Conference Channels</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider">Active Peers</span>
              <Users className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{overview.total_active_peers.toLocaleString()}</div>
            <div className="text-xs text-slate-700 font-semibold">Of {overview.total_mesh_capacity.toLocaleString()} Max Capacity</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider">Avg Latency</span>
              <Activity className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{overview.avg_latency_ms} ms</div>
            <div className="text-xs text-slate-700 font-semibold">Edge STUN/TURN Roundtrip</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider">Packet Loss</span>
              <Zap className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{overview.avg_packet_loss}%</div>
            <div className="text-xs text-slate-700 font-semibold">Jitter Buffer Optimized</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider">Optimal Relays</span>
              <Server className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{overview.optimal_relays}</div>
            <div className="text-xs text-slate-700 font-semibold">STUN/TURN Anycast Nodes</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider">Sovereign Shards</span>
              <Globe className="h-4 w-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{overview.active_shards} ({overview.active_instances})</div>
            <div className="text-xs text-slate-700 font-semibold">Dynamic VoIP Edge Instances</div>
          </div>
        </div>
      )}

      {/* Global Asset Uploader Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-100 rounded-lg text-blue-900">
            <Mic className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Direct Media & Audio Tone Asset Ingestion</h3>
            <p className="text-xs text-slate-700 font-semibold">
              Upload custom dial tones, room hold music, or conference avatar packs directly to Express backend.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <label className="cursor-pointer px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all">
            <Upload className="h-4 w-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload Media to Express'}</span>
            <input
              type="file"
              className="hidden"
              onChange={e => handleFileUpload(e)}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full md:w-96 bg-slate-50 border border-slate-300 px-3 py-2 rounded-xl">
          <Search className="h-4 w-4 text-slate-700" />
          <input
            type="text"
            placeholder="Search room name, code, or relay..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs font-bold text-slate-900 w-full focus:outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              All Types
            </button>
            {ROOM_TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => setSelectedType(t.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedType === t.value
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* WebRTC Rooms Table */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Sliders className="h-4 w-4 text-slate-800" />
            <h2 className="text-sm font-bold text-slate-900">Active WebRTC Mesh Rooms & Relays</h2>
            <span className="text-xs font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
              {filteredItems.length}
            </span>
          </div>
          <span className="text-xs text-slate-700 font-semibold">
            PostgreSQL Persistence (fingermobile_platform_db)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-300 text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Room / Identifier</th>
                <th className="py-3 px-4">Room Type</th>
                <th className="py-3 px-4">Relay Cluster</th>
                <th className="py-3 px-4">Bitrate</th>
                <th className="py-3 px-4">Peers / Cap</th>
                <th className="py-3 px-4">Health / Ping</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs font-bold text-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-700 font-semibold">
                    No WebRTC rooms found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/75 transition-colors">
                    {/* Order Controls */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-800 font-bold w-4">{item.display_order}</span>
                        <button
                          onClick={() => handleMoveOrder(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                          title="Move Up"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleMoveOrder(idx, 'down')}
                          disabled={idx === items.length - 1}
                          className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                          title="Move Down"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      </div>
                    </td>

                    {/* Room Info */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-extrabold text-slate-900 flex items-center space-x-1.5">
                          <span>{item.room_name}</span>
                          {item.emergency_broadcast_priority && (
                            <span className="bg-rose-100 text-rose-950 border border-rose-400 text-[9px] px-1.5 py-0.5 rounded font-black tracking-wide uppercase">
                              DEFCON PRIORITY
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-700 font-semibold flex items-center space-x-2">
                          <code className="text-blue-900 bg-blue-50 px-1 py-0.2 rounded font-mono">{item.room_code}</code>
                          {item.recording_enabled && (
                            <span className="text-emerald-800 flex items-center space-x-0.5">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Rec Active</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Room Type */}
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-900 border border-slate-300 text-[11px] px-2 py-0.5 rounded-full font-bold">
                        {item.room_type.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Relay Cluster */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center space-x-1">
                        <Server className="h-3.5 w-3.5 text-slate-700" />
                        <span>{item.relay_cluster}</span>
                      </div>
                    </td>

                    {/* Bitrate */}
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-blue-900">{item.bitrate_kbps} kbps</span>
                      <div className="text-[10px] text-slate-700 font-semibold">Opus/VP9 Codec</div>
                    </td>

                    {/* Peers */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-extrabold text-slate-900">{item.active_peers_count}</span>
                        <span className="text-slate-700 font-semibold">/ {item.concurrency_limit}</span>
                      </div>
                      <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (item.active_peers_count / item.concurrency_limit) * 100)}%`
                          }}
                        />
                      </div>
                    </td>

                    {/* Health */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            item.stun_turn_health === 'optimal'
                              ? 'bg-emerald-500'
                              : item.stun_turn_health === 'degraded'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        <span className="capitalize text-slate-900 font-bold">{item.stun_turn_health}</span>
                      </div>
                      <div className="text-[10px] text-slate-700 font-semibold">{item.latency_ms}ms · {item.packet_loss_percent}% loss</div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border ${
                          item.status === 'active'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                            : item.status === 'standby'
                            ? 'bg-amber-100 text-amber-950 border-amber-400'
                            : 'bg-rose-100 text-rose-950 border-rose-400'
                        }`}
                      >
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <label className="cursor-pointer p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200" title="Upload Audio/Banner">
                          <Upload className="h-3.5 w-3.5" />
                          <input
                            type="file"
                            className="hidden"
                            onChange={e => handleFileUpload(e, item.id)}
                            disabled={isUploading}
                          />
                        </label>

                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
                          title="Edit Configuration"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteRoom(item.id, item.room_name)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300"
                          title="Delete Room"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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

      {/* Pillar 6: Dynamic VoIP Edge Spawner Shards */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-900">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Dynamic VoIP Console Spawner & Edge Shards</h3>
              <p className="text-xs text-slate-700 font-semibold">
                Autonomous micro-console partitions for dedicated sub-networks (e.g. VIP Concierge, NYSC Broadcast, Beatwave Studio).
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-300 rounded-lg text-xs font-bold flex items-center space-x-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Spawn Edge Node</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {spawns.map(spawn => (
            <div key={spawn.id} className="p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider bg-indigo-100 text-indigo-950 border border-indigo-400 px-2 py-0.5 rounded">
                  {spawn.badge}
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {spawn.active_instances} Instance(s) Active
                </span>
              </div>
              <div className="font-extrabold text-slate-900 text-sm">{spawn.title}</div>
              <div className="text-xs font-mono text-blue-900 font-bold">{spawn.domain}</div>
              <p className="text-xs text-slate-700 font-medium">{spawn.description}</p>
              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <span className="text-[11px] text-emerald-800 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Sovereign SFU Mesh Ready</span>
                </span>
                <button
                  onClick={() => notify(`Console shard ${spawn.title} launched.`)}
                  className="text-xs text-indigo-900 font-bold hover:underline flex items-center space-x-1"
                >
                  <span>Launch</span>
                  <Share2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-300 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <h3 className="font-bold text-base">Create Sovereign WebRTC Room</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/70 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="p-6 space-y-4 text-xs font-bold text-slate-800">
              <div>
                <label className="block mb-1 text-slate-900">Room Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lagos Citadel Sovereign Boardroom"
                  value={newRoom.room_name}
                  onChange={e => setNewRoom({ ...newRoom, room_name: e.target.value })}
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-900">Room Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VOIP-CITADEL-01"
                    value={newRoom.room_code}
                    onChange={e => setNewRoom({ ...newRoom, room_code: e.target.value.toUpperCase() })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-blue-600"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-900">Room Type</label>
                  <select
                    value={newRoom.room_type}
                    onChange={e => setNewRoom({ ...newRoom, room_type: e.target.value as VoipRoomType })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-blue-600"
                  >
                    {ROOM_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-900">Relay Cluster</label>
                  <input
                    type="text"
                    placeholder="e.g. Lagos-Central-STUN-01"
                    value={newRoom.relay_cluster}
                    onChange={e => setNewRoom({ ...newRoom, relay_cluster: e.target.value })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-blue-600"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-900">Bitrate (kbps)</label>
                  <input
                    type="number"
                    min="32"
                    max="512"
                    value={newRoom.bitrate_kbps}
                    onChange={e => setNewRoom({ ...newRoom, bitrate_kbps: parseInt(e.target.value, 10) })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-900">Max Peer Concurrency Limit</label>
                <input
                  type="number"
                  min="2"
                  max="5000"
                  value={newRoom.concurrency_limit}
                  onChange={e => setNewRoom({ ...newRoom, concurrency_limit: parseInt(e.target.value, 10) })}
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-blue-600"
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRoom.recording_enabled}
                    onChange={e => setNewRoom({ ...newRoom, recording_enabled: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span className="text-slate-900">Enable Recording</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRoom.emergency_broadcast_priority}
                    onChange={e => setNewRoom({ ...newRoom, emergency_broadcast_priority: e.target.checked })}
                    className="rounded text-rose-600"
                  />
                  <span className="text-slate-900">DefCon Emergency Priority</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold"
                >
                  Save & Register Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-300 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <h3 className="font-bold text-base">Edit Room: {editingItem.room_name}</h3>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingItem(null);
                }}
                className="text-white/70 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateRoom} className="p-6 space-y-4 text-xs font-bold text-slate-800">
              <div>
                <label className="block mb-1 text-slate-900">Room Name</label>
                <input
                  type="text"
                  value={editingItem.room_name}
                  onChange={e => setEditingItem({ ...editingItem, room_name: e.target.value })}
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-900">Room Type</label>
                  <select
                    value={editingItem.room_type}
                    onChange={e => setEditingItem({ ...editingItem, room_type: e.target.value as VoipRoomType })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-blue-600"
                  >
                    {ROOM_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-slate-900">Status</label>
                  <select
                    value={editingItem.status}
                    onChange={e => setEditingItem({ ...editingItem, status: e.target.value as 'active' | 'standby' | 'defcon_disabled' })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-blue-600"
                  >
                    <option value="active">Active</option>
                    <option value="standby">Standby</option>
                    <option value="defcon_disabled">Defcon Disabled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-900">Relay Cluster</label>
                  <input
                    type="text"
                    value={editingItem.relay_cluster}
                    onChange={e => setEditingItem({ ...editingItem, relay_cluster: e.target.value })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-blue-600"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-900">STUN/TURN Health</label>
                  <select
                    value={editingItem.stun_turn_health}
                    onChange={e => setEditingItem({ ...editingItem, stun_turn_health: e.target.value as StunTurnHealth })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-blue-600"
                  >
                    <option value="optimal">Optimal</option>
                    <option value="degraded">Degraded</option>
                    <option value="standby">Standby</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-900">Bitrate (kbps)</label>
                  <input
                    type="number"
                    value={editingItem.bitrate_kbps}
                    onChange={e => setEditingItem({ ...editingItem, bitrate_kbps: parseInt(e.target.value, 10) })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-blue-600"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-900">Max Peer Concurrency</label>
                  <input
                    type="number"
                    value={editingItem.concurrency_limit}
                    onChange={e => setEditingItem({ ...editingItem, concurrency_limit: parseInt(e.target.value, 10) })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.recording_enabled}
                    onChange={e => setEditingItem({ ...editingItem, recording_enabled: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span className="text-slate-900">Enable Recording</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.emergency_broadcast_priority}
                    onChange={e => setEditingItem({ ...editingItem, emergency_broadcast_priority: e.target.checked })}
                    className="rounded text-rose-600"
                  />
                  <span className="text-slate-900">DefCon Emergency Priority</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Spawn Console Modal */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-300 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <h3 className="font-bold text-base">Spawn Sovereign VoIP Console</h3>
              </div>
              <button
                onClick={() => setIsSpawnModalOpen(false)}
                className="text-white/70 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSpawnConsole} className="p-6 space-y-4 text-xs font-bold text-slate-800">
              <div>
                <label className="block mb-1 text-slate-900">Shard Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Concierge Audio Mesh"
                  value={newSpawn.title}
                  onChange={e => setNewSpawn({ ...newSpawn, title: e.target.value })}
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-900">Domain *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. vip-audio.fingermobile.org"
                    value={newSpawn.domain}
                    onChange={e => setNewSpawn({ ...newSpawn, domain: e.target.value })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-blue-600"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-900">Badge Code</label>
                  <input
                    type="text"
                    placeholder="e.g. VIP-CONCIERGE"
                    value={newSpawn.badge}
                    onChange={e => setNewSpawn({ ...newSpawn, badge: e.target.value.toUpperCase() })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-900">Description</label>
                <textarea
                  rows={3}
                  placeholder="Autonomous microservice console partition for high-security voice sessions..."
                  value={newSpawn.description}
                  onChange={e => setNewSpawn({ ...newSpawn, description: e.target.value })}
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-blue-600"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-900">Active Node Instances</label>
                <input
                  type="number"
                  min="1"
                  max="16"
                  value={newSpawn.active_instances}
                  onChange={e => setNewSpawn({ ...newSpawn, active_instances: parseInt(e.target.value, 10) })}
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-blue-600"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSpawnModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold"
                >
                  Spawn Shard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterCommunicationsVoipConsole;
