import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Waves,
  Music,
  Radio,
  Podcast,
  Upload,
  Globe,
  Share2,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sliders,
  ExternalLink,
  Users,
  ShieldCheck,
  Disc,
  X,
  Volume2
} from 'lucide-react';

interface SoundRiverTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: number;
  bitrate: string;
  license: string;
  url: string;
  coverArt: string;
  plays: number;
  likes: number;
  isCreatorUpload: boolean;
  status: string;
  created_at: string;
}

interface SoundRiverPodcast {
  id: string;
  title: string;
  host: string;
  guest?: string | null;
  description: string;
  duration: number;
  bitrate: string;
  audioUrl: string;
  coverArt: string;
  episodeNumber: number;
  rssSynced: boolean;
  created_at: string;
}

interface AggregatorItem {
  id: string;
  source: string;
  title: string;
  creator: string;
  format: string;
  identifier: string;
  license: string;
  syncedAt: string;
}

interface ColaboPlaylist {
  id: string;
  title: string;
  description: string;
  creatorCount: number;
  trackCount: number;
  totalDurationMinutes: number;
  collaborators: string[];
}

interface SoundRiverTelemetry {
  tier: string;
  audioQuality: string;
  accessModel: string;
  totalTracks: number;
  totalPlays: number;
  totalLikes: number;
  activeListeners: number;
  bandwidthGbps: number;
  podcastEpisodeCount: number;
  aggregatorItemCount: number;
  colaboPlaylistCount: number;
  p2pRelayEfficiency: string;
  timestamp: string;
}

export const SoundRiverMasterConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stream' | 'catalog' | 'podcasts' | 'aggregator' | 'colabo'>('stream');
  const [telemetry, setTelemetry] = useState<SoundRiverTelemetry | null>(null);
  const [tracks, setTracks] = useState<SoundRiverTrack[]>([]);
  const [podcasts, setPodcasts] = useState<SoundRiverPodcast[]>([]);
  const [aggregatorItems, setAggregatorItems] = useState<AggregatorItem[]>([]);
  const [colaboList, setColaboList] = useState<ColaboPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Audio Playback simulation / test
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  // Form states for Track Upload (multipart/form-data)
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtist, setTrackArtist] = useState('');
  const [trackGenre, setTrackGenre] = useState('Afrobeat');
  const [trackLicense, setTrackLicense] = useState('Creative Commons CC-BY 4.0');
  const [trackDuration, setTrackDuration] = useState('210');
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [isSubmittingTrack, setIsSubmittingTrack] = useState(false);
  const trackFileInputRef = useRef<HTMLInputElement>(null);

  // Form states for Podcast Upload
  const [isPodcastModalOpen, setIsPodcastModalOpen] = useState(false);
  const [podcastTitle, setPodcastTitle] = useState('');
  const [podcastHost, setPodcastHost] = useState('');
  const [podcastDesc, setPodcastDesc] = useState('');
  const [selectedPodcastFile, setSelectedPodcastFile] = useState<File | null>(null);
  const podcastFileInputRef = useRef<HTMLInputElement>(null);

  // Form states for Colabo+ Playlist
  const [isColaboModalOpen, setIsColaboModalOpen] = useState(false);
  const [colaboTitle, setColaboTitle] = useState('');
  const [colaboDesc, setColaboDesc] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [telRes, tracksRes, podRes, aggRes, colaboRes] = await Promise.all([
        fetch('http://localhost:5001/api/beatwave/soundriver/telemetry').then(r => r.json()),
        fetch('http://localhost:5001/api/beatwave/soundriver/tracks').then(r => r.json()),
        fetch('http://localhost:5001/api/beatwave/soundriver/podcasts').then(r => r.json()),
        fetch('http://localhost:5001/api/beatwave/soundriver/aggregator').then(r => r.json()),
        fetch('http://localhost:5001/api/beatwave/soundriver/colabo').then(r => r.json())
      ]);

      if (telRes.success) setTelemetry(telRes.data);
      if (tracksRes.success) setTracks(tracksRes.data || []);
      if (podRes.success) setPodcasts(podRes.data || []);
      if (aggRes.success) setAggregatorItems(aggRes.data || []);
      if (colaboRes.success) setColaboList(colaboRes.data || []);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Failed to load SoundRiver data: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showNotification = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // 1. Submit Track Upload (multipart/form-data)
  const handleUploadTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackTitle.trim() || !trackArtist.trim()) {
      showNotification('error', 'Title and artist are required');
      return;
    }

    setIsSubmittingTrack(true);
    try {
      const formData = new FormData();
      formData.append('title', trackTitle);
      formData.append('artist', trackArtist);
      formData.append('genre', trackGenre);
      formData.append('license', trackLicense);
      formData.append('duration', trackDuration);

      if (selectedAudioFile) {
        formData.append('audio', selectedAudioFile);
      }

      const res = await fetch('http://localhost:5001/api/beatwave/soundriver/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        showNotification('success', 'Track successfully uploaded and queued for 320kbps streaming!');
        setTrackTitle('');
        setTrackArtist('');
        setSelectedAudioFile(null);
        if (trackFileInputRef.current) trackFileInputRef.current.value = '';
        fetchData();
      } else {
        showNotification('error', data.message || 'Upload failed.');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setIsSubmittingTrack(false);
    }
  };

  // 2. Delete Track
  const handleDeleteTrack = async (id: string) => {
    if (!window.confirm('Delete this track from SoundRiver?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/beatwave/soundriver/tracks/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Track removed.');
        fetchData();
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // 3. Submit Podcast
  const handleUploadPodcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!podcastTitle.trim() || !podcastHost.trim()) return;

    try {
      const formData = new FormData();
      formData.append('title', podcastTitle);
      formData.append('host', podcastHost);
      formData.append('description', podcastDesc);
      if (selectedPodcastFile) {
        formData.append('audio', selectedPodcastFile);
      }

      const res = await fetch('http://localhost:5001/api/beatwave/soundriver/podcasts', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Podcast episode published.');
        setIsPodcastModalOpen(false);
        setPodcastTitle('');
        setPodcastHost('');
        setPodcastDesc('');
        setSelectedPodcastFile(null);
        fetchData();
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // 4. Sync Public Aggregator
  const handleSyncAggregator = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/beatwave/soundriver/aggregator/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Internet Archive & FMA open catalog synchronized.');
        fetchData();
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // 5. Create Colabo+ Playlist
  const handleCreateColabo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colaboTitle.trim()) return;

    try {
      const res = await fetch('http://localhost:5001/api/beatwave/soundriver/colabo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: colaboTitle, description: colaboDesc })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Colabo+ collaborative playlist created.');
        setIsColaboModalOpen(false);
        setColaboTitle('');
        setColaboDesc('');
        fetchData();
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-100 text-cyan-950 border border-cyan-400">
            <Waves className="w-7 h-7 text-cyan-800" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              SoundRiver MasterDashboard Console
            </h1>
            <p className="text-sm font-semibold text-slate-700">
              Free-Flowing Sovereign Audio: 320kbps Streams, Open Creator Uploads, Podcasts & Public Aggregator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold hover:bg-slate-100 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 text-slate-700 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <a
            href="/beatwave"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-700 text-white font-bold hover:bg-cyan-800 transition-colors shadow-sm"
          >
            <Globe className="w-4 h-4" />
            Beatwave Player
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
              : 'bg-rose-100 border-rose-400 text-rose-950 font-bold'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>{statusMessage.text}</span>
          </div>
          <button type="button" onClick={() => setStatusMessage(null)}>
            <X className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      )}

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase">Audio Fidelity</p>
          <p className="text-xl font-black text-cyan-950 mt-1">320 kbps</p>
          <span className="text-[11px] font-bold text-cyan-800">High-Bitrate AAC</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase">Access Model</p>
          <p className="text-xl font-black text-emerald-950 mt-1">100% Free</p>
          <span className="text-[11px] font-bold text-emerald-800">Zero Paywalls</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase">River Tracks</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{telemetry?.totalTracks ?? tracks.length}</p>
          <span className="text-[11px] font-bold text-blue-800">Active Catalog</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase">Live Listeners</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{(telemetry?.activeListeners ?? 0).toLocaleString()}</p>
          <span className="text-[11px] font-bold text-indigo-800">Mobile Streamers</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase">Bandwidth</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{telemetry?.bandwidthGbps ?? 18.4} Gbps</p>
          <span className="text-[11px] font-bold text-cyan-800">P2P Relay Mesh</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase">Podcasts</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{telemetry?.podcastEpisodeCount ?? podcasts.length}</p>
          <span className="text-[11px] font-bold text-purple-800">Open Studio</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase">Colabo+ Lists</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{telemetry?.colaboPlaylistCount ?? colaboList.length}</p>
          <span className="text-[11px] font-bold text-amber-800">Shared Curations</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-300 pb-2">
        {[
          { id: 'stream', label: 'Stream Fleet & Telemetry', icon: Waves },
          { id: 'catalog', label: 'Track Catalog & Creator Uploads', icon: Music },
          { id: 'podcasts', label: 'Podcast Broadcast Studio', icon: Podcast },
          { id: 'aggregator', label: 'Public Web Aggregator', icon: Globe },
          { id: 'colabo', label: 'Colabo+ Shared Playlists', icon: Users }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all border ${
                isActive
                  ? 'bg-cyan-900 text-white border-cyan-900 shadow-md'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-slate-700'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: STREAM FLEET & TELEMETRY */}
      {activeTab === 'stream' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-300 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Waves className="w-5 h-5 text-cyan-700" />
                🌊 SoundRiver Open Streaming Architecture
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                SoundRiver operates on a free-flowing, low-friction paradigm. There are zero subscription gates or payout barriers.
                Youth artists, students, bedroom beatmakers, and community commentators can upload immediately.
                Media files are transcoded to high-bitrate <strong>320kbps AAC / MP3</strong> and cached over the distributed P2P mesh network.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2">
                  <span className="font-extrabold text-slate-900 text-sm">Mobile Data Efficiency</span>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold">Adaptive 320kbps AAC encoding saves up to 40% bandwidth vs raw uncompressed audio.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2">
                  <span className="font-extrabold text-slate-900 text-sm">P2P Swarm Peer Offload</span>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '99.4%' }}></div>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold">99.4% of media chunks relayed directly between listeners without server load.</p>
                </div>
              </div>
            </div>

            {/* Micro-Management Controls */}
            <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-slate-800" />
                Quick Fleet Operations
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-left transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Upload Open Track</p>
                    <p className="text-xs text-slate-700">Publish MP3/AAC via multipart form</p>
                  </div>
                  <Upload className="w-5 h-5 text-cyan-700" />
                </button>

                <button
                  onClick={() => setIsPodcastModalOpen(true)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-left transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-900 text-sm">New Podcast Episode</p>
                    <p className="text-xs text-slate-700">Record or upload talk show episode</p>
                  </div>
                  <Podcast className="w-5 h-5 text-purple-700" />
                </button>

                <button
                  onClick={handleSyncAggregator}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-left transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Sync Public Web Archives</p>
                    <p className="text-xs text-slate-700">Pull latest open CC tracks from Internet Archive</p>
                  </div>
                  <Globe className="w-5 h-5 text-blue-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRACK CATALOG & CREATOR UPLOADS */}
      {activeTab === 'catalog' && (
        <div className="space-y-8">
          {/* Track Upload Form (multipart/form-data) */}
          <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-cyan-700" />
              Upload Free-Flowing River Track (multipart/form-data)
            </h2>
            <p className="text-sm font-semibold text-slate-700">
              Submit MP3, AAC, or WAV audio files directly to Express backend. Stored in PostgreSQL with automatic 320kbps encoding.
            </p>

            <form onSubmit={handleUploadTrack} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Track Title *</label>
                  <input
                    type="text"
                    required
                    value={trackTitle}
                    onChange={e => setTrackTitle(e.target.value)}
                    placeholder="e.g. Lagos Sunset Afro-Groove"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-cyan-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Artist / Creator *</label>
                  <input
                    type="text"
                    required
                    value={trackArtist}
                    onChange={e => setTrackArtist(e.target.value)}
                    placeholder="e.g. Tunde Wave"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:ring-2 focus:ring-cyan-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Genre</label>
                  <select
                    value={trackGenre}
                    onChange={e => setTrackGenre(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold outline-none"
                  >
                    <option value="Afrobeat">Afrobeat</option>
                    <option value="Electronic Drill">Electronic Drill</option>
                    <option value="Acoustic Soul">Acoustic Soul</option>
                    <option value="Highlife">Highlife</option>
                    <option value="Hip-Hop">Hip-Hop</option>
                    <option value="Ambient">Ambient</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">License Model</label>
                  <select
                    value={trackLicense}
                    onChange={e => setTrackLicense(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold outline-none"
                  >
                    <option value="Creative Commons CC-BY 4.0">Creative Commons CC-BY 4.0</option>
                    <option value="CC0 Public Domain">CC0 Public Domain</option>
                    <option value="Open Sovereign License">Open Sovereign License</option>
                    <option value="CC-BY-SA 4.0">CC-BY-SA 4.0</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Duration (Seconds)</label>
                  <input
                    type="number"
                    value={trackDuration}
                    onChange={e => setTrackDuration(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold outline-none"
                  />
                </div>
              </div>

              {/* Audio File Input */}
              <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-2">
                <Music className="w-8 h-8 text-cyan-700" />
                <p className="text-sm font-bold text-slate-800">
                  {selectedAudioFile ? `Audio File: ${selectedAudioFile.name} (${(selectedAudioFile.size / (1024 * 1024)).toFixed(1)} MB)` : 'Choose Audio File (MP3, AAC, WAV up to 100MB)'}
                </p>
                <input
                  ref={trackFileInputRef}
                  type="file"
                  accept="audio/*,.mp3,.aac,.wav,.m4a,.ogg"
                  onChange={e => setSelectedAudioFile(e.target.files ? e.target.files[0] : null)}
                  className="text-xs text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-700 file:text-white hover:file:bg-cyan-800"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingTrack}
                className="px-6 py-3 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-extrabold text-sm transition-colors shadow-md flex items-center gap-2"
              >
                {isSubmittingTrack ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isSubmittingTrack ? 'Publishing Track...' : 'Publish to SoundRiver'}
              </button>
            </form>
          </div>

          {/* Track Catalog Table */}
          <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-black text-slate-900">SoundRiver Stream Catalog ({tracks.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-50 text-slate-800 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Track / Artist</th>
                    <th className="py-3 px-4">Genre</th>
                    <th className="py-3 px-4">Fidelity</th>
                    <th className="py-3 px-4">License</th>
                    <th className="py-3 px-4">Plays</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm text-slate-800">
                  {tracks.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setPlayingTrackId(playingTrackId === t.id ? null : t.id)}
                            className="p-2 rounded-full bg-cyan-100 text-cyan-950 border border-cyan-400 hover:bg-cyan-200"
                          >
                            {playingTrackId === t.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                          <div>
                            <p className="font-bold text-slate-900">{t.title}</p>
                            <p className="text-xs text-slate-700 font-semibold">{t.artist}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{t.genre}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-xs font-black bg-cyan-100 text-cyan-950 border border-cyan-400">
                          {t.bitrate}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">{t.license}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{t.plays.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-700">
                        {Math.floor(t.duration / 60)}:{String(t.duration % 60).padStart(2, '0')}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteTrack(t.id)}
                          className="p-1.5 rounded-lg border border-slate-300 hover:bg-rose-50 text-rose-700 hover:text-rose-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PODCASTS STUDIO */}
      {activeTab === 'podcasts' && (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Podcast className="w-5 h-5 text-purple-700" />
                Podcast Broadcast Studio
              </h2>
              <p className="text-sm font-semibold text-slate-700">
                Manage episodic talk shows, youth perspectives, and decentralized RSS broadcasts.
              </p>
            </div>
            <button
              onClick={() => setIsPodcastModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 text-white font-bold hover:bg-purple-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Upload Episode
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {podcasts.map(pod => (
              <div key={pod.id} className="p-5 rounded-xl border border-slate-300 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-950 border border-purple-400">
                    Episode #{pod.episodeNumber}
                  </span>
                  <span className="text-xs font-mono text-slate-700">{pod.bitrate}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">{pod.title}</h3>
                <p className="text-xs text-slate-700 font-medium line-clamp-2">{pod.description}</p>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 pt-2 border-t border-slate-200">
                  <span>Host: {pod.host}</span>
                  <span>Duration: {Math.floor(pod.duration / 60)} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PUBLIC WEB AGGREGATOR */}
      {activeTab === 'aggregator' && (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-700" />
                Public Web Audio Aggregator
              </h2>
              <p className="text-sm font-semibold text-slate-700">
                Pulls Creative Commons, Internet Archive, and Free Music Archive open heritage recordings into SoundRiver.
              </p>
            </div>
            <button
              onClick={handleSyncAggregator}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Sync Open Repositories
            </button>
          </div>

          <div className="space-y-3">
            {aggregatorItems.map(item => (
              <div key={item.id} className="p-4 rounded-xl border border-slate-300 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-950 border border-blue-400">
                      {item.source}
                    </span>
                    <span className="text-xs font-mono text-slate-700">{item.format}</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-700 font-semibold">Curator: {item.creator} • License: {item.license}</p>
                </div>
                <span className="text-xs font-mono text-slate-700">Synced: {new Date(item.syncedAt).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: COLABO+ SHARED PLAYLISTS */}
      {activeTab === 'colabo' && (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-700" />
                Colabo+ Collaborative Playlists
              </h2>
              <p className="text-sm font-semibold text-slate-700">
                Crowd-curated playlists where multiple indie artists and listeners curate community feeds together.
              </p>
            </div>
            <button
              onClick={() => setIsColaboModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Colabo+ List
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colaboList.map(c => (
              <div key={c.id} className="p-5 rounded-xl border border-slate-300 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-400">
                    {c.creatorCount} Collaborators
                  </span>
                  <span className="text-xs font-bold text-slate-700">{c.trackCount} Tracks</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">{c.title}</h3>
                <p className="text-xs text-slate-700 font-medium">{c.description}</p>
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-800 mb-1">Active Collaborator Handles:</p>
                  <div className="flex flex-wrap gap-1">
                    {c.collaborators.map((user, i) => (
                      <span key={i} className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-300">
                        {user}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: PODCAST UPLOAD */}
      {isPodcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Upload Podcast Episode</h3>
              <button type="button" onClick={() => setIsPodcastModalOpen(false)}>
                <X className="w-5 h-5 text-slate-700 hover:text-slate-900" />
              </button>
            </div>

            <form onSubmit={handleUploadPodcast} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Episode Title *</label>
                <input
                  type="text"
                  required
                  value={podcastTitle}
                  onChange={e => setPodcastTitle(e.target.value)}
                  placeholder="e.g. Youth Sovereign Voices: Episode 15"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Host Name *</label>
                <input
                  type="text"
                  required
                  value={podcastHost}
                  onChange={e => setPodcastHost(e.target.value)}
                  placeholder="e.g. Chidi & Amara"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Synopsis / Description</label>
                <textarea
                  rows={3}
                  value={podcastDesc}
                  onChange={e => setPodcastDesc(e.target.value)}
                  placeholder="Episode overview..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Podcast Audio File</label>
                <input
                  ref={podcastFileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={e => setSelectedPodcastFile(e.target.files ? e.target.files[0] : null)}
                  className="text-xs text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-purple-700 file:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPodcastModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 text-white font-extrabold hover:bg-purple-800 shadow-sm"
                >
                  Publish Episode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: COLABO+ LIST */}
      {isColaboModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Create Colabo+ Playlist</h3>
              <button type="button" onClick={() => setIsColaboModalOpen(false)}>
                <X className="w-5 h-5 text-slate-700 hover:text-slate-900" />
              </button>
            </div>

            <form onSubmit={handleCreateColabo} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Playlist Title *</label>
                <input
                  type="text"
                  required
                  value={colaboTitle}
                  onChange={e => setColaboTitle(e.target.value)}
                  placeholder="e.g. Lagos Bedroom Beatmakers Vol 1"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={colaboDesc}
                  onChange={e => setColaboDesc(e.target.value)}
                  placeholder="Community guidelines and sound palette..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold bg-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsColaboModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white font-extrabold hover:bg-amber-700 shadow-sm"
                >
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoundRiverMasterConsole;
