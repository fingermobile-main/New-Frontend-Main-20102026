import React, { useState, useMemo, useRef } from 'react';
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
  Sparkles,
  RefreshCw,
  Clock,
  AlertTriangle,
  Radio,
  Tv,
  Layers,
  X
} from 'lucide-react';

export interface OfflineDownload {
  id: string;
  title: string;
  creator: string;
  type: 'audio' | 'video' | 'photo' | 'document';
  format: string;
  sovereignExtension: '.fma' | '.fmv' | '.fmp' | '.pdf';
  sovereignFileName: string;
  fileSize: string;
  fileSizeBytes: number;
  downloadedAt: string;
  ttlDays: number; // 10 days
  daysRemaining: number;
  isExpired: boolean;
  thumbnailUrl: string;
  playbackUrl?: string;
  duration?: string;
  isEncrypted: boolean;
  licenseHash: string;
  lotId: string;
  rightsTier: string;
}

const INITIAL_OFFLINE_ITEMS: OfflineDownload[] = [
  {
    id: 'dl-1',
    title: 'Midnight Lagos Grooves (Master Stems & Mix)',
    creator: 'Alex Johnson & Beatwave NG',
    type: 'audio',
    format: 'FingerMobile Sovereign Audio (.FMA) • 24-bit / 96kHz',
    sovereignExtension: '.fma',
    sovereignFileName: 'midnight_lagos_grooves_master.fma',
    fileSize: '68.4 MB',
    fileSizeBytes: 71722598,
    downloadedAt: '2026-10-12T14:22:00Z',
    ttlDays: 10,
    daysRemaining: 6,
    isExpired: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    duration: '04:18',
    isEncrypted: true,
    licenseHash: '0x8f9a2b4c6e1d...3a88',
    lotId: 'LOT-FMA-88492',
    rightsTier: 'Commercial Sync License'
  },
  {
    id: 'dl-2',
    title: 'Dancia-4Tv Global Sound Clash - Full Live Replay',
    creator: 'Dancia-4Tv Broadcast Network',
    type: 'video',
    format: 'FingerMobile Sovereign Video (.FMV) • 4K UHD HDR (HEVC)',
    sovereignExtension: '.fmv',
    sovereignFileName: 'dancia_sound_clash_4k_hdr.fmv',
    fileSize: '1.85 GB',
    fileSizeBytes: 1986422374,
    downloadedAt: '2026-10-14T21:40:00Z',
    ttlDays: 10,
    daysRemaining: 8,
    isExpired: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    duration: '1h 24m',
    isEncrypted: true,
    licenseHash: '0x55aa910cde43...110a',
    lotId: 'LOT-FMV-19302',
    rightsTier: 'VIP Subscriber Replay'
  },
  {
    id: 'dl-3',
    title: 'Serengeti Golden Dawn at Mara River',
    creator: 'Amina Bello (Sony A7R V)',
    type: 'photo',
    format: 'FingerMobile Sovereign Package (.FMP) • RAW DNG Master',
    sovereignExtension: '.fmp',
    sovereignFileName: 'serengeti_golden_dawn_raw.fmp',
    fileSize: '124.8 MB',
    fileSizeBytes: 130862285,
    downloadedAt: '2026-10-08T18:10:00Z',
    ttlDays: 10,
    daysRemaining: 2,
    isExpired: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80',
    isEncrypted: true,
    licenseHash: '0x3c71a9e8b201...99e2',
    lotId: 'LOT-FMP-77312',
    rightsTier: 'Royalty-Free Extended'
  },
  {
    id: 'dl-4',
    title: 'Afro-House Drum Roots (Old Stems Archive)',
    creator: 'Lagos Sound Lab',
    type: 'audio',
    format: 'FingerMobile Sovereign Audio (.FMA) • 48kHz HD',
    sovereignExtension: '.fma',
    sovereignFileName: 'afro_house_drum_roots_stems.fma',
    fileSize: '45.1 MB',
    fileSizeBytes: 47290777,
    downloadedAt: '2026-10-01T09:12:00Z',
    ttlDays: 10,
    daysRemaining: 0,
    isExpired: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    duration: '03:45',
    isEncrypted: true,
    licenseHash: '0x101a88bb247e...ff89',
    lotId: 'LOT-FMA-00214',
    rightsTier: 'Editorial Use Only'
  },
  {
    id: 'dl-5',
    title: 'Sovereign Protocol Developer Deed & Smart License v2.5',
    creator: 'FingerMobile Foundation',
    type: 'document',
    format: 'Cryptographic Sovereign Package (.FMP) + SHA-256',
    sovereignExtension: '.fmp',
    sovereignFileName: 'sovereign_developer_deed_v2.5.fmp',
    fileSize: '4.2 MB',
    fileSizeBytes: 4404019,
    downloadedAt: '2026-10-11T09:12:00Z',
    ttlDays: 10,
    daysRemaining: 5,
    isExpired: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    isEncrypted: true,
    licenseHash: '0xdeadbeef1337...c001',
    lotId: 'LOT-FMP-99014',
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
  const [isPruning, setIsPruning] = useState(false);
  const [daysUntilNextPrune, setDaysUntilNextPrune] = useState(3);
  const [showStandAlonePlayerModal, setShowStandAlonePlayerModal] = useState(false);

  // Storage Quota calculations
  const totalAllocatedBytes = 10 * 1024 * 1024 * 1024; // 10 GB
  const totalUsedBytes = useMemo(() => items.reduce((acc, curr) => acc + curr.fileSizeBytes, 0), [items]);
  const usedPercentage = ((totalUsedBytes / totalAllocatedBytes) * 100).toFixed(1);
  const formattedUsedGB = (totalUsedBytes / (1024 * 1024 * 1024)).toFixed(2);

  // Breakdown
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
        item.sovereignFileName.toLowerCase().includes(q) ||
        item.sovereignExtension.toLowerCase().includes(q) ||
        item.lotId.toLowerCase().includes(q) ||
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
      showToast?.('Decrypted .fma/.fmv stream mounted from offline cache (0 Data Usage)', 'success');
    }
  };

  // Sovereign Cryptographic File Export (.fma, .fmv, .fmp)
  const handleExportSovereignFile = (item: OfflineDownload) => {
    setDownloadProgressId(item.id);
    setTimeout(() => {
      // Create sovereign binary container payload
      const sovereignHeader = `FINGERMOBILE_SOVEREIGN_V2_ENCRYPTED_MEDIA_CONTAINER\n` +
        `LOT_ID: ${item.lotId}\n` +
        `EXT: ${item.sovereignExtension}\n` +
        `TITLE: ${item.title}\n` +
        `CREATOR: ${item.creator}\n` +
        `LICENSE_HASH: ${item.licenseHash}\n` +
        `TTL_POLICY: 10_DAYS\n` +
        `PLAYER_COMPLIANCE: FingerMobile Website, Standalone FingerMobile Media Player, BeatwaveNG, Dancia-4TV\n` +
        `SOVEREIGN_PAYLOAD_CHECKSUM: 0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}\n`;

      const blob = new Blob([sovereignHeader], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.sovereignFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadProgressId(null);
      showToast?.(`Exported "${item.sovereignFileName}" to member device storage under proprietary ${item.sovereignExtension} format!`, 'success');
    }, 900);
  };

  // 15-Day Auto-Pruning Routine
  const handleTriggerPruningCycle = () => {
    setIsPruning(true);
    setTimeout(() => {
      // Remove all expired files (where daysRemaining <= 0)
      const unexpired = items.filter((i) => !i.isExpired && i.daysRemaining > 0);
      const purgedCount = items.length - unexpired.length;
      setItems(unexpired);
      setDaysUntilNextPrune(15);
      setIsPruning(false);
      showToast?.(
        `15-Day Sovereign Prune Completed: Purged ${purgedCount} expired lot(s), pruned logs, and reset cache. Next cycle in 15 days.`,
        'success'
      );
    }, 1100);
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
                <span>Proprietary Sovereign File Extensions (.FMA &amp; .FMV)</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Digital Asset Vault &amp; Downloads
              </h1>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                Holds logged-in member downloaded files, lots, history, and metadata under exclusive <strong className="text-slate-900">.fma</strong> (Audio) and <strong className="text-slate-900">.fmv</strong> (Video) formats. All files are restricted to play on FingerMobile Website, Standalone FingerMobile Media Player, BeatwaveNG, or Dancia-4TV.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => setShowStandAlonePlayerModal(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-600/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>FingerMobile Player Info</span>
              </button>

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

          {/* 10-DAY TTL & 15-DAY AUTO-PRUNING TELEMETRY BANNER */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-2">
                  <span>Guardian AI TTL Policy: 10-Day Retention Window</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 text-[10px] font-bold">
                    Active
                  </span>
                </h4>
                <p className="text-xs text-amber-900 font-medium">
                  Downloaded assets remain on your device and dashboard for <strong>10 days only</strong>. The sovereign pruner auto-deletes expired lots, clears cache, and prunes metadata logs every <strong>15 days</strong> (Next scheduled run in: <strong>{daysUntilNextPrune} days</strong>).
                </p>
              </div>
            </div>

            <button
              id="btn-trigger-pruning"
              type="button"
              onClick={handleTriggerPruningCycle}
              disabled={isPruning}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPruning ? 'animate-spin' : ''}`} />
              <span>{isPruning ? 'Pruning...' : 'Run 15-Day Prune Now'}</span>
            </button>
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
                  <p className="text-xs text-slate-700 font-medium">FingerMobile verified encrypted sandbox (.fma / .fmv)</p>
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
                  .FMA Audio ({audioPct}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                  .FMV 4K Video ({videoPct}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                  .FMP Packages ({photoPct}%)
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-950 font-black text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                <span>FingerMobile Cryptographic Integrity Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. PERSISTENT PLAYER DECK: Plays both .fma audio & .fmv video */}
        {activePlayingItem && (
          <div className="p-5 rounded-3xl bg-white border-2 border-orange-400 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 shrink-0">
                  <img
                    src={activePlayingItem.thumbnailUrl}
                    alt={activePlayingItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    {activePlayingItem.type === 'video' ? (
                      <Video className="w-6 h-6 text-blue-400 animate-pulse" />
                    ) : (
                      <Music className="w-6 h-6 text-amber-400 animate-pulse" />
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-orange-600 text-white uppercase">
                      PLAYING SOVEREIGN {activePlayingItem.sovereignExtension.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-700 font-mono font-bold">
                      {activePlayingItem.lotId}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-0.5">{activePlayingItem.title}</h3>
                  <p className="text-xs text-slate-700 font-medium">
                    {activePlayingItem.creator} • Authorized playback on FingerMobile Platform Engine
                  </p>
                </div>
              </div>

              {/* Audio Waveform Simulator for .FMA */}
              {activePlayingItem.type === 'audio' && (
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
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase flex items-center gap-2 shadow-sm transition-all"
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

            {/* Video Canvas for .FMV */}
            {activePlayingItem.type === 'video' && isPlayingAudio && (
              <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                <img
                  src={activePlayingItem.thumbnailUrl}
                  alt={activePlayingItem.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-between p-6">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Tv className="w-3.5 h-3.5" />
                      Dancia-4Tv 4K HDR Replay Engine
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-200 text-xs font-mono font-bold">
                      HEVC • 60 FPS • 0 Loss
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-white">{activePlayingItem.title}</h4>
                    <p className="text-xs text-slate-300">
                      Decrypting sovereign .FMV stream • License Hash: {activePlayingItem.licenseHash}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. TOOLBAR: FILTERS & SEARCH */}
        <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'all', label: 'All Vault Items', icon: HardDrive },
              { id: 'audio', label: '.FMA Audio Stems', icon: Music },
              { id: 'video', label: '.FMV 4K Replays', icon: Video },
              { id: 'photo', label: '.FMP RAW Photos', icon: ImageIcon },
              { id: 'document', label: '.FMP Smart Deeds', icon: FileText }
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
              placeholder="Search by title, lot ID, .fma, .fmv..."
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
              Download sovereign audio (.fma) and video (.fmv) media stems from Tribut, BeatwaveNG, or Dancia-4Tv.
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
                    item.isExpired
                      ? 'bg-rose-50/40 border-rose-300'
                      : isPlaying
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
                        {/* Sovereign Extension Badge */}
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-900 text-amber-400 border border-slate-700">
                          {item.sovereignExtension}
                        </span>

                        <span className="text-[11px] font-mono font-bold text-slate-800">
                          {item.sovereignFileName}
                        </span>

                        <span className="text-[11px] font-mono font-bold text-slate-500">•</span>

                        <span className="text-[11px] font-mono font-bold text-slate-700">
                          {item.fileSize}
                        </span>

                        <span className="text-[11px] font-mono font-bold text-slate-500">•</span>

                        {/* TTL Countdown Badge */}
                        {item.isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 border border-rose-400 text-rose-950 text-[10px] font-black uppercase">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            Expired (Prune Candidate)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 border border-amber-400 text-amber-950 text-[10px] font-bold">
                            <Clock className="w-3 h-3 text-amber-700" />
                            Expires in {item.daysRemaining} days (10d TTL)
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-slate-700 font-medium flex-wrap">
                        <span>By {item.creator}</span>
                        <span>•</span>
                        <span className="text-orange-600 font-bold">{item.rightsTier}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-500">{item.lotId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {/* In-Platform Playback (Authorized Player) */}
                    {(item.type === 'audio' || item.type === 'video') && (
                      <button
                        type="button"
                        onClick={() => handleTogglePlay(item.id)}
                        disabled={item.isExpired}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition-all disabled:opacity-40 ${
                          isPlaying
                            ? 'bg-orange-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{isPlaying ? 'Pause' : 'Play'}</span>
                      </button>
                    )}

                    {/* Export to device with proprietary .fma / .fmv extension */}
                    <button
                      type="button"
                      onClick={() => handleExportSovereignFile(item)}
                      disabled={isDownloading || item.isExpired}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors disabled:opacity-40"
                      title={`Export as ${item.sovereignExtension} to member hardware`}
                    >
                      <Download className="w-4 h-4" />
                      <span>{isDownloading ? 'Exporting...' : `Export ${item.sovereignExtension}`}</span>
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

        {/* 5. STANDALONE FINGERMOBILE MEDIA PLAYER PREVIEW MODAL */}
        {showStandAlonePlayerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-white rounded-3xl border border-slate-300 max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-purple-100 border border-purple-400 text-purple-950">
                    <Radio className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">FingerMobile Media Player</h3>
                    <p className="text-xs text-slate-700 font-medium">Standalone Sovereign Player App (In Development)</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStandAlonePlayerModal(false)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-300 text-purple-950 space-y-2">
                  <span className="font-black block uppercase tracking-wider text-purple-900 text-xs">
                    Combined Audio &amp; Video Architecture
                  </span>
                  <p>
                    The standalone <strong>FingerMobile Media Player</strong> combines the professional audio capabilities of <strong>BeatwaveNG</strong> (multi-stem track mixer, 64-band equalizer, 24-bit 96kHz master engine) with <strong>Dancia-4TV</strong> (4K Ultra HD HDR live replay broadcaster).
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-black text-slate-900">Proprietary Playback Logic:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-800">
                    <li><strong className="text-slate-900">.fma</strong> (FingerMobile Audio) files can only decode on FingerMobile Services, BeatwaveNG, or the standalone player.</li>
                    <li><strong className="text-slate-900">.fmv</strong> (FingerMobile Video) files enforce hardware DRM and decode on Dancia-4TV or the standalone player.</li>
                    <li><strong className="text-slate-900">10-Day TTL:</strong> Files are locally purged after 10 days, and metadata logs prune every 15 days automatically.</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowStandAlonePlayerModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default MyDownloadsPage;
