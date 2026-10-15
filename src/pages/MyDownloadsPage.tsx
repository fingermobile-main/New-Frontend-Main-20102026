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
    title: 'Sovereign Protocol Developer Deed & Smart License v2.5',
    creator: 'FingerMobile Foundation',
    type: 'document',
    format: 'Cryptographic PDF Certificate + SHA-256',
    fileSize: '4.2 MB',
    fileSizeBytes: 4404019,
    downloadedAt: '2026-10-01T09:12:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    isEncrypted: true,
    licenseHash: '0xdeadbeef1337...c001',
    rightsTier: 'Perpetual Sovereign Grant'
  }
];

const MyDownloadsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [items, setItems] = useState<OfflineDownload[]>(INITIAL_OFFLINE_ITEMS);
  const [selectedType, setSelectedType] = useState<'all' | 'audio' | 'video' | 'photo' | 'document'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlaybackId, setActivePlaybackId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [downloadProgressId, setDownloadProgressId] = useState<string | null>(null);

  // Storage Quota calculations
  const totalAllocatedBytes = 10 * 1024 * 1024 * 1024; // 10 GB
  const totalUsedBytes = useMemo(() => items.reduce((acc, curr) => acc + curr.fileSizeBytes, 0), [items]);
  const usedPercentage = ((totalUsedBytes / totalAllocatedBytes) * 100).toFixed(1);
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
    showToast?.(`Removed "${title}" from offline vault cache`, 'info');
  };

  const handleClearAll = () => {
    if (items.length === 0) return;
    setItems([]);
    setActivePlaybackId(null);
    setIsPlayingAudio(false);
    showToast?.('Offline media vault cache cleared successfully', 'success');
  };

  const handleTogglePlay = (id: string) => {
    if (activePlaybackId === id) {
      setIsPlayingAudio(!isPlayingAudio);
    } else {
      setActivePlaybackId(id);
      setIsPlayingAudio(true);
      showToast?.('Decrypted local stream mounted from offline cache (0 Data Usage)', 'success');
    }
  };

  const handleReDownload = (item: OfflineDownload) => {
    setDownloadProgressId(item.id);
    setTimeout(() => {
      setDownloadProgressId(null);
      showToast?.(`Exported "${item.title}" to device storage!`, 'success');
    }, 1200);
  };

  return (
    <MainLayout pageTitle="Offline Media Vault & Cryptographic Downloads">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. HERO HEADER: Strict Contrast Hierarchy on White */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-400 text-orange-950 text-xs font-black uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                <span>AES-256 Cryptographic Local Media Vault</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Digital Asset Vault &amp; Downloads
              </h1>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                Sovereign local storage partition for master audio stems, 4K HDR videos, licensed high-res photographs, and cryptographic smart contract license grants. Zero data consumption during offline playback.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleClearAll}
                disabled={items.length === 0}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40"
              >
                Clear Cache Partition
              </button>
            </div>
          </div>

          {/* Storage Gauge & Vault Telemetry Card */}
          <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-orange-100 border border-orange-400 text-orange-950">
                  <HardDrive className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">Local Device Storage Partition</p>
                  <p className="text-xs text-slate-700 font-medium">FingerMobile verified encrypted sandbox</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-2xl font-black text-slate-900">{formattedUsedGB} GB</span>
                <span className="text-xs font-bold text-slate-700"> / 10.00 GB Allocated ({usedPercentage}%)</span>
              </div>
            </div>

            {/* Segmented Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-100 border border-slate-300 overflow-hidden flex p-0.5">
              <div
                className="h-full bg-amber-500 rounded-l-full transition-all duration-500"
                style={{ width: `${audioPct}%` }}
                title={`Audio: ${audioPct}%`}
              />
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${videoPct}%` }}
                title={`Video: ${videoPct}%`}
              />
              <div
                className="h-full bg-emerald-600 rounded-r-full transition-all duration-500"
                style={{ width: `${photoPct}%` }}
                title={`Photos: ${photoPct}%`}
              />
            </div>

            {/* Legend: High Contrast */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-800">
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  Audio Stems ({audioPct}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                  4K Video Replays ({videoPct}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                  RAW Master Photos ({photoPct}%)
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-950 font-black text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                <span>On-Chain Cryptographic Integrity Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. PERSISTENT PLAYER DECK */}
        {activePlayingItem && (
          <div className="p-5 rounded-3xl bg-white border-2 border-orange-400 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 shrink-0">
                <img
                  src={activePlayingItem.thumbnailUrl}
                  alt={activePlayingItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Music className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-orange-600 text-white uppercase">
                    PLAYING OFFLINE CACHE
                  </span>
                  <span className="text-xs text-slate-700 font-mono font-bold">{activePlayingItem.format}</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 mt-0.5">{activePlayingItem.title}</h3>
                <p className="text-xs text-slate-700 font-medium">{activePlayingItem.creator}</p>
              </div>
            </div>

            {/* Audio Waveform Simulator */}
            <div className="flex-1 max-w-md hidden lg:flex items-center gap-1 h-6 px-4">
              {[40, 75, 90, 60, 85, 30, 95, 70, 50, 80, 65, 90, 45, 100, 70, 85, 55, 90, 40, 70].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isPlayingAudio ? 'bg-orange-600 animate-pulse' : 'bg-slate-300'
                  }`}
                  style={{ height: isPlayingAudio ? `${h}%` : '20%' }}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase flex items-center gap-2 shadow-sm transition-all"
              >
                {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingAudio ? 'Pause' : 'Resume'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActivePlaybackId(null);
                  setIsPlayingAudio(false);
                }}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 3. TOOLBAR: FILTERS & SEARCH */}
        <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
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
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-800 hover:text-slate-900 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
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
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-bold placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
            />
          </div>
        </div>

        {/* 4. DOWNLOADED MEDIA ITEMS LIST */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-300 space-y-3">
            <FolderDown className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Downloaded Items in this Category</h3>
            <p className="text-xs text-slate-700 max-w-sm mx-auto">
              Download media stems, photo RAW files, and videos from the Gallery, BeatwaveNG, or Dancia-4Tv.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const isPlaying = activePlaybackId === item.id;
              const isDownloading = downloadProgressId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isPlaying
                      ? 'bg-orange-50/60 border-orange-400 shadow-md'
                      : 'bg-white border-slate-300 hover:border-slate-400 shadow-sm'
                  }`}
                >
                  {/* Thumbnail & Metadata */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 shrink-0 border border-slate-300">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        {item.type === 'audio' && <Music className="w-5 h-5 text-white" />}
                        {item.type === 'video' && <Video className="w-5 h-5 text-white" />}
                        {item.type === 'photo' && <ImageIcon className="w-5 h-5 text-white" />}
                        {item.type === 'document' && <FileText className="w-5 h-5 text-white" />}
                      </div>
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-900 border border-slate-300">
                          {item.type}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-700">
                          {item.fileSize}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-500">•</span>
                        <span className="text-[11px] font-mono font-bold text-slate-700">
                          {item.format}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                        <span>By {item.creator}</span>
                        <span>•</span>
                        <span className="text-orange-600 font-bold">{item.rightsTier}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {item.type === 'audio' && (
                      <button
                        type="button"
                        onClick={() => handleTogglePlay(item.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition-all ${
                          isPlaying
                            ? 'bg-orange-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{isPlaying ? 'Pause' : 'Play'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleReDownload(item)}
                      disabled={isDownloading}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
                      title="Export Asset to Disk"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isDownloading ? 'Exporting...' : 'Export'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                      title="Delete from Offline Vault"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default MyDownloadsPage;
