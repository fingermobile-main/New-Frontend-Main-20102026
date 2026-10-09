import React, { useState, useMemo } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import {
  Download,
  Play,
  Trash2,
  Music,
  Video,
  Image as ImageIcon,
  HardDrive,
  Search,
  CheckCircle2,
  Pause,
  FolderDown,
  ShieldCheck,
  FileText,
  Volume2,
  ExternalLink,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';

export interface OfflineDownload {
  id: string;
  title: string;
  creator: string;
  type: 'audio' | 'video' | 'photo' | 'document';
  format: string;
  fileSize: string;
  fileSizeBytes: number;
  downloadedAt: string;
  thumbnailUrl: string;
  playbackUrl?: string;
  duration?: string;
  isEncrypted: boolean;
  licenseHash: string;
  rightsTier: string;
}

const INITIAL_OFFLINE_ITEMS: OfflineDownload[] = [
  {
    id: 'dl-1',
    title: 'Midnight Lagos Grooves (Master Stems & Mix)',
    creator: 'Alex Johnson & Beatwave NG',
    type: 'audio',
    format: 'FLAC 24-bit / 96kHz',
    fileSize: '68.4 MB',
    fileSizeBytes: 71722598,
    downloadedAt: '2026-10-05T14:22:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    duration: '04:18',
    isEncrypted: true,
    licenseHash: '0x8f9a2b4c6e1d...3a88',
    rightsTier: 'Commercial Sync License'
  },
  {
    id: 'dl-2',
    title: 'Serengeti Golden Dawn at Mara River',
    creator: 'Amina Bello (Sony A7R V)',
    type: 'photo',
    format: 'RAW DNG Master (9504 x 6336)',
    fileSize: '124.8 MB',
    fileSizeBytes: 130862285,
    downloadedAt: '2026-10-04T18:10:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80',
    isEncrypted: false,
    licenseHash: '0x3c71a9e8b201...99e2',
    rightsTier: 'Royalty-Free Extended'
  },
  {
    id: 'dl-3',
    title: 'Dancia-4Tv Global Sound Clash - Full Live Replay',
    creator: 'Dancia-4Tv Broadcast Network',
    type: 'video',
    format: '4K UHD HDR (HEVC)',
    fileSize: '1.85 GB',
    fileSizeBytes: 1986422374,
    downloadedAt: '2026-10-03T21:40:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    duration: '1h 24m',
    isEncrypted: true,
    licenseHash: '0x55aa910cde43...110a',
    rightsTier: 'VIP Subscriber Replay'
  },
  {
    id: 'dl-4',
    title: 'Tokyo Rain Reflection Neon Walk',
    creator: 'Kenji Sato (Leica M11)',
    type: 'photo',
    format: 'RAW DNG Master (60MP)',
    fileSize: '92.1 MB',
    fileSizeBytes: 96573849,
    downloadedAt: '2026-10-02T11:05:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    isEncrypted: false,
    licenseHash: '0x101a88bb247e...ff89',
    rightsTier: 'Editorial Use Only'
  },
  {
    id: 'dl-5',
    title: 'Afro-Electric Odyssey EP (Lossless Album Stems)',
    creator: 'Sola Davies & SoundLab',
    type: 'audio',
    format: 'ALAC Lossless / WAV',
    fileSize: '182.0 MB',
    fileSizeBytes: 190840832,
    downloadedAt: '2026-09-30T09:15:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    duration: '22:45',
    isEncrypted: true,
    licenseHash: '0x7e44a19bce32...bb45',
    rightsTier: 'Full Master Sync License'
  },
  {
    id: 'dl-6',
    title: 'Smart Contract Creator Licensing Agreement #2026-09',
    creator: 'FingerMobile Protocol Legal Engine',
    type: 'document',
    format: 'Cryptographic PDF Certificate',
    fileSize: '2.4 MB',
    fileSizeBytes: 2516582,
    downloadedAt: '2026-09-28T16:00:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
    isEncrypted: true,
    licenseHash: '0x00a1f29c48b7...d2c1',
    rightsTier: 'Sovereign Legal Deed'
  }
];

export const MyDownloadsPage: React.FC = () => {
  const { showToast } = useAppContext();

  const [items, setItems] = useState<OfflineDownload[]>(INITIAL_OFFLINE_ITEMS);
  const [selectedType, setSelectedType] = useState<'all' | 'audio' | 'video' | 'photo' | 'document'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlaybackId, setActivePlaybackId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedCertificateItem, setSelectedCertificateItem] = useState<OfflineDownload | null>(null);
  const [downloadProgressId, setDownloadProgressId] = useState<string | null>(null);

  // Storage metrics calculation
  const totalAllocatedBytes = 10 * 1024 * 1024 * 1024; // 10 GB offline quota
  const totalUsedBytes = useMemo(() => {
    return items.reduce((acc, curr) => acc + curr.fileSizeBytes, 0);
  }, [items]);

  const usedPercentage = Math.min(Math.round((totalUsedBytes / totalAllocatedBytes) * 100), 100);
  const formattedUsedGB = (totalUsedBytes / (1024 * 1024 * 1024)).toFixed(2);

  // Audio size breakdown
  const audioBytes = useMemo(() => items.filter((i) => i.type === 'audio').reduce((acc, c) => acc + c.fileSizeBytes, 0), [items]);
  const videoBytes = useMemo(() => items.filter((i) => i.type === 'video').reduce((acc, c) => acc + c.fileSizeBytes, 0), [items]);
  const photoBytes = useMemo(() => items.filter((i) => i.type === 'photo').reduce((acc, c) => acc + c.fileSizeBytes, 0), [items]);

  const audioPct = ((audioBytes / totalAllocatedBytes) * 100).toFixed(1);
  const videoPct = ((videoBytes / totalAllocatedBytes) * 100).toFixed(1);
  const photoPct = ((photoBytes / totalAllocatedBytes) * 100).toFixed(1);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.creator.toLowerCase().includes(q) ||
        item.format.toLowerCase().includes(q) ||
        item.rightsTier.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [items, selectedType, searchQuery]);

  const activePlayingItem = useMemo(() => {
    return items.find((i) => i.id === activePlaybackId) || null;
  }, [items, activePlaybackId]);

  const handleDelete = (id: string, title: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (activePlaybackId === id) {
      setActivePlaybackId(null);
      setIsPlayingAudio(false);
    }
    showToast(`Removed "${title}" from offline vault cache`, 'info');
  };

  const handleClearAll = () => {
    if (items.length === 0) return;
    setItems([]);
    setActivePlaybackId(null);
    setIsPlayingAudio(false);
    showToast('Offline media vault cache cleared successfully', 'success');
  };

  const handleTogglePlay = (id: string) => {
    if (activePlaybackId === id) {
      setIsPlayingAudio(!isPlayingAudio);
    } else {
      setActivePlaybackId(id);
      setIsPlayingAudio(true);
      showToast('Decrypted local stream mounted from offline cache (0 Data Usage)', 'success');
    }
  };

  const handleReDownload = (item: OfflineDownload) => {
    setDownloadProgressId(item.id);
    setTimeout(() => {
      setDownloadProgressId(null);
      showToast(`Exported "${item.title}" to device storage!`, 'success');
    }, 1200);
  };

  return (
    <MainLayout pageTitle="Offline Media Vault & Cryptographic Downloads">
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-amber-400/10 to-transparent border border-amber-500/30 shadow-lg shadow-amber-500/5">
                  <Download className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                    Digital Asset Vault & Downloads
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                      AES-256 VAULT
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    Sovereign local storage partition for master audio stems, 4K HDR videos, licensed high-res photographs, and cryptographic smart contract license grants. Zero data consumption during playback.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClearAll}
                disabled={items.length === 0}
                className="px-4 py-2.5 rounded-xl bg-rose-950/40 border border-rose-900/60 hover:bg-rose-900/60 text-rose-300 font-semibold text-xs transition-all disabled:opacity-40"
              >
                Clear Cache Partition
              </button>
            </div>
          </div>

          {/* Storage Gauge & Vault Telemetry Card */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Local Device Storage Quota</p>
                  <p className="text-xs text-slate-400">FingerMobile encrypted local partition</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-mono font-bold text-amber-400">{formattedUsedGB} GB</span>
                <span className="text-xs text-slate-500"> / 10.00 GB Allocated ({usedPercentage}%)</span>
              </div>
            </div>

            {/* Segmented Progress Bar */}
            <div className="w-full h-3.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden flex p-0.5">
              <div
                className="h-full bg-amber-400 rounded-l-full transition-all duration-500"
                style={{ width: `${audioPct}%` }}
                title={`Audio: ${audioPct}%`}
              />
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${videoPct}%` }}
                title={`Video: ${videoPct}%`}
              />
              <div
                className="h-full bg-emerald-400 rounded-r-full transition-all duration-500"
                style={{ width: `${photoPct}%` }}
                title={`Photos: ${photoPct}%`}
              />
            </div>

            {/* Legend & Security Badges */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs text-slate-400">
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  Audio Stems ({audioPct}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                  4K Video Replays ({videoPct}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  RAW Master Photos ({photoPct}%)
                </span>
              </div>

              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>On-Chain Cryptographic Integrity Verified</span>
              </div>
            </div>
          </div>

          {/* Persistent Player Deck if Item is Active */}
          {activePlayingItem && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-amber-400/40 flex-shrink-0">
                  <img
                    src={activePlayingItem.thumbnailUrl}
                    alt={activePlayingItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                    <Music className="w-5 h-5 text-amber-400 animate-pulse" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                      NOW PLAYING OFFLINE
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{activePlayingItem.format}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5">{activePlayingItem.title}</h3>
                  <p className="text-xs text-slate-400">{activePlayingItem.creator}</p>
                </div>
              </div>

              {/* Audio Waveform Simulator */}
              <div className="flex-1 max-w-md hidden lg:flex items-center gap-1 h-6 px-4">
                {[40, 75, 90, 60, 85, 30, 95, 70, 50, 80, 65, 90, 45, 100, 70, 85, 55, 90, 40, 70].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isPlayingAudio ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'
                    }`}
                    style={{ height: isPlayingAudio ? `${h}%` : '20%' }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md hover:bg-amber-300 transition-all"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlayingAudio ? 'Pause Stream' : 'Resume'}
                </button>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Volume2 className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-mono">100%</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActivePlaybackId(null);
                    setIsPlayingAudio(false);
                  }}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {[
                { id: 'all', label: 'All Vault Items', icon: HardDrive },
                { id: 'audio', label: 'Audio Stems', icon: Music },
                { id: 'video', label: '4K Video Replays', icon: Video },
                { id: 'photo', label: 'Master Photos', icon: ImageIcon },
                { id: 'document', label: 'Smart Contracts & Deeds', icon: FileText }
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = selectedType === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedType(tab.id as any)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search downloaded media, creator, format..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Media Items Grid / List */}
          {filteredItems.length > 0 ? (
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const isPlaying = activePlaybackId === item.id;
                const isDownloading = downloadProgressId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isPlaying
                        ? 'bg-amber-950/20 border-amber-400/50 shadow-lg shadow-amber-950/20'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Media Thumbnail & Title */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                          {item.type === 'audio' && <Music className="w-5 h-5 text-white/80" />}
                          {item.type === 'video' && <Video className="w-5 h-5 text-white/80" />}
                          {item.type === 'photo' && <ImageIcon className="w-5 h-5 text-white/80" />}
                          {item.type === 'document' && <FileText className="w-5 h-5 text-white/80" />}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-white truncate">{item.title}</h3>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-800 text-amber-300 border border-slate-700">
                            {item.format}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                            {item.rightsTier}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{item.creator}</p>
                        <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                          <span>{item.fileSize}</span>
                          {item.duration && <span>• {item.duration}</span>}
                          <span>• Saved {new Date(item.downloadedAt).toLocaleDateString()}</span>
                          <span className="hidden sm:inline font-mono text-[10px] text-slate-500">
                            Hash: {item.licenseHash}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        type="button"
                        onClick={() => setSelectedCertificateItem(item)}
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5"
                        title="View Cryptographic License Grant"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">License</span>
                      </button>

                      {(item.type === 'audio' || item.type === 'video') && (
                        <button
                          type="button"
                          onClick={() => handleTogglePlay(item.id)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isPlaying
                              ? 'bg-amber-400 text-slate-950 shadow-md'
                              : 'bg-slate-800 hover:bg-slate-700 text-white'
                          }`}
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          {isPlaying ? 'Pause' : 'Play Offline'}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleReDownload(item)}
                        disabled={isDownloading}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
                        title="Export file to device storage"
                      >
                        {isDownloading ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/60 transition-all"
                        title="Delete from offline storage"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
              <FolderDown className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Downloads Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No items match your filter. Download songs from BeatwaveNG, videos from Dancia-4Tv, or photos from PhotoCredits to access them offline.
              </p>
            </div>
          )}

          {/* Cryptographic License Modal */}
          {selectedCertificateItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
                <button
                  type="button"
                  onClick={() => setSelectedCertificateItem(null)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30">
                    <ShieldCheck className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Cryptographic License Grant</h3>
                    <p className="text-xs text-slate-400">FingerMobile Protocol Sovereign DRM</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Asset Title:</span>
                      <span className="text-white font-bold">{selectedCertificateItem.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Creator / Licensor:</span>
                      <span className="text-amber-400 font-semibold">{selectedCertificateItem.creator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">License Grant:</span>
                      <span className="text-emerald-400 font-bold">{selectedCertificateItem.rightsTier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Master Format:</span>
                      <span className="text-slate-200 font-mono">{selectedCertificateItem.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Smart Contract Hash:</span>
                      <span className="text-slate-300 font-mono text-[11px]">{selectedCertificateItem.licenseHash}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-300 text-[11px] leading-relaxed">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 inline mr-1.5" />
                    This asset is protected under FingerMobile Sovereign DRM. It is authorized for offline caching and playback on this registered device.
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedCertificateItem(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                    >
                      Close
                    </button>
                    <a
                      href={'https://etherscan.io'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Verify on Explorer
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MyDownloadsPage;
