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
  Filter,
  Search,
  CheckCircle2,
  Pause,
  FolderDown
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
    isEncrypted: true
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
    isEncrypted: false
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
    isEncrypted: true
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
    isEncrypted: false
  },
  {
    id: 'dl-5',
    title: 'Afro-Electric Odyssey EP (Lossless Album)',
    creator: 'Sola Davies',
    type: 'audio',
    format: 'ALAC Lossless',
    fileSize: '182.0 MB',
    fileSizeBytes: 190840832,
    downloadedAt: '2026-09-30T09:15:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    duration: '22:45',
    isEncrypted: true
  }
];

export const MyDownloadsPage: React.FC = () => {
  const { showToast } = useAppContext();

  const [items, setItems] = useState<OfflineDownload[]>(INITIAL_OFFLINE_ITEMS);
  const [selectedType, setSelectedType] = useState<'all' | 'audio' | 'video' | 'photo'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlaybackId, setActivePlaybackId] = useState<string | null>(null);

  // Storage metrics calculation
  const totalAllocatedBytes = 10 * 1024 * 1024 * 1024; // 10 GB offline quota
  const totalUsedBytes = useMemo(() => {
    return items.reduce((acc, curr) => acc + curr.fileSizeBytes, 0);
  }, [items]);

  const usedPercentage = Math.min(Math.round((totalUsedBytes / totalAllocatedBytes) * 100), 100);
  const formattedUsedGB = (totalUsedBytes / (1024 * 1024 * 1024)).toFixed(2);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.format.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [items, selectedType, searchQuery]);

  const handleDelete = (id: string, title: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (activePlaybackId === id) setActivePlaybackId(null);
    showToast(`Removed "${title}" from offline storage`, 'info');
  };

  const handleClearAll = () => {
    if (items.length === 0) return;
    setItems([]);
    setActivePlaybackId(null);
    showToast('Offline media cache cleared successfully', 'success');
  };

  const handleTogglePlay = (id: string) => {
    if (activePlaybackId === id) {
      setActivePlaybackId(null);
    } else {
      setActivePlaybackId(id);
      showToast('Playing from local encrypted cache (Zero Data Usage)', 'success');
    }
  };

  return (
    <MainLayout pageTitle="Offline Media & Downloads">
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500/20 to-amber-400/10 border border-amber-500/30">
                  <Download className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white">
                    Offline Media Vault
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Stream, listen, and view master audio stems, 4K videos, and licensed photos offline without cellular data.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClearAll}
                disabled={items.length === 0}
                className="px-4 py-2 rounded-xl bg-rose-950/40 border border-rose-900/60 hover:bg-rose-900/60 text-rose-300 font-semibold text-xs transition-all disabled:opacity-40"
              >
                Clear Offline Cache
              </button>
            </div>
          </div>

          {/* Storage Gauge Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <HardDrive className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-sm font-bold text-white">Local Storage Quota</p>
                  <p className="text-xs text-slate-400">FingerMobile encrypted local cache partition</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-mono font-bold text-amber-400">{formattedUsedGB} GB</span>
                <span className="text-xs text-slate-500"> / 10.00 GB Allocated ({usedPercentage}%)</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                style={{ width: `${usedPercentage}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                AES-256 Offline Storage Decryption Active
              </span>
              <span>{items.length} saved files</span>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {[
                { id: 'all', label: 'All Items', icon: Filter },
                { id: 'audio', label: 'Audio & Stems', icon: Music },
                { id: 'video', label: '4K Video', icon: Video },
                { id: 'photo', label: 'Master Photos', icon: ImageIcon }
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = selectedType === tab.id;
                return (
                  <button
                    key={tab.id}
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

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search downloaded media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Media Items List */}
          {filteredItems.length > 0 ? (
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const isPlaying = activePlaybackId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isPlaying
                        ? 'bg-amber-950/20 border-amber-400/40 shadow-lg shadow-amber-950/20'
                        : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
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
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm text-white truncate">{item.title}</h3>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-800 text-amber-300 border border-slate-700">
                            {item.format}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{item.creator}</p>
                        <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                          <span>{item.fileSize}</span>
                          {item.duration && <span>• {item.duration}</span>}
                          <span>• Saved {new Date(item.downloadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center">
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
                          {isPlaying ? 'Pause Offline' : 'Play Offline'}
                        </button>
                      )}

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
            <div className="text-center py-20 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <FolderDown className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Downloads Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No items match your filter. Download songs from BeatwaveNG, videos from Dancia-4Tv, or photos from PhotoCredits to access them offline.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MyDownloadsPage;
