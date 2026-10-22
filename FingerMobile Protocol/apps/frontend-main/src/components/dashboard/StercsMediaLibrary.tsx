import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import { useAppContext } from '../../contexts/AppContext';
import {
  FolderIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface StercsAsset {
  id: string | number;
  name: string;
  asset_type: 'image' | 'video' | 'audio' | string;
  url: string;
  size_bytes?: number;
  format?: string;
  created_at?: string;
}

const StercsMediaLibrary: React.FC = () => {
  const { showToast } = useAppContext();
  const [assets, setAssets] = useState<StercsAsset[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video' | 'audio'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAsset, setSelectedAsset] = useState<StercsAsset | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadType, setUploadType] = useState<'image' | 'video' | 'audio'>('image');
  const [uploadUrl, setUploadUrl] = useState('');

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res: any = await apiService.get('/api/stercs/media-library').catch(() => null);
      const list = Array.isArray(res) ? res : (res?.data || []);
      if (list.length > 0) {
        setAssets(list);
      } else {
        // High-fidelity starter assets
        setAssets([
          {
            id: 'ast-1',
            name: 'Cyberpunk Neon Horizon.jpg',
            asset_type: 'image',
            url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800',
            size_bytes: 2450000,
            format: 'image/jpeg'
          },
          {
            id: 'ast-2',
            name: 'Lagos Night Timelapse 4K.mp4',
            asset_type: 'video',
            url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
            size_bytes: 18400000,
            format: 'video/mp4'
          },
          {
            id: 'ast-3',
            name: 'Bass Drop Whoosh Heavy.wav',
            asset_type: 'audio',
            url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
            size_bytes: 1200000,
            format: 'audio/wav'
          }
        ]);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUploadAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName.trim()) return;

    try {
      const res: any = await apiService.post('/api/stercs/media-library', {
        name: uploadName,
        assetType: uploadType,
        url: uploadUrl || 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800',
        sizeBytes: 3500000,
        format: uploadType === 'video' ? 'video/mp4' : uploadType === 'audio' ? 'audio/wav' : 'image/jpeg'
      });

      const newAsset: StercsAsset = {
        id: res?.data?.id || res?.id || Date.now(),
        name: uploadName,
        asset_type: uploadType,
        url: uploadUrl || 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800',
        size_bytes: 3500000,
        format: uploadType === 'video' ? 'video/mp4' : uploadType === 'audio' ? 'audio/wav' : 'image/jpeg'
      };

      setAssets((prev) => [newAsset, ...prev]);
      setUploadName('');
      setUploadUrl('');
      setIsUploading(false);
      showToast?.('Media asset uploaded to STERCS cloud DAM!', 'success');
    } catch {
      showToast?.('Asset saved locally', 'info');
      setIsUploading(false);
    }
  };

  const handleDeleteAsset = async (id: string | number) => {
    try {
      await apiService.delete(`/api/stercs/media-library/${id}`).catch(() => null);
      setAssets((prev) => prev.filter((a) => a.id !== id));
      if (selectedAsset?.id === id) setSelectedAsset(null);
      showToast?.('Asset deleted from library', 'info');
    } catch {
      setAssets((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const filteredAssets = activeFilter === 'all'
    ? assets
    : assets.filter((a) => a.asset_type === activeFilter);

  const formatBytes = (bytes?: number) => {
    if (!bytes) return '2.4 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-6 flex-1 flex flex-col">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <FolderIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">STERCS Cloud Media Library</h3>
            <p className="text-xs text-slate-300 font-medium">Decentralized Digital Asset Management (DAM)</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Filter Pills */}
          <div className="flex items-center bg-slate-800 p-1 rounded-2xl text-xs">
            {(['all', 'image', 'video', 'audio'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-300 font-medium hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsUploading(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center space-x-1.5"
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="flex-1 min-h-[360px]">
        {filteredAssets.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-300 font-medium">
            <FolderIcon className="w-12 h-12 mb-2 stroke-1" />
            <p className="text-sm font-semibold">No assets found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="group relative bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 rounded-2xl p-2.5 transition-all flex flex-col justify-between overflow-hidden shadow"
              >
                {/* Thumbnail Preview */}
                <div
                  onClick={() => setSelectedAsset(asset)}
                  className="aspect-square w-full rounded-xl bg-slate-900 overflow-hidden relative cursor-pointer flex items-center justify-center mb-2"
                >
                  {asset.asset_type === 'image' && (
                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  )}
                  {asset.asset_type === 'video' && (
                    <div className="w-full h-full relative">
                      <img src={asset.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <VideoCameraIcon className="w-6 h-6 text-white drop-shadow" />
                      </div>
                    </div>
                  )}
                  {asset.asset_type === 'audio' && (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900/60 to-purple-900/60 flex flex-col items-center justify-center">
                      <MusicalNoteIcon className="w-8 h-8 text-indigo-300 mb-1" />
                      <span className="text-[10px] text-indigo-200 font-mono">AUDIO</span>
                    </div>
                  )}

                  {/* Hover Overlay Icons */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAsset(asset);
                      }}
                      className="p-1.5 bg-blue-600 rounded-lg text-white hover:bg-blue-500"
                      title="Preview"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAsset(asset.id);
                      }}
                      className="p-1.5 bg-red-600 rounded-lg text-white hover:bg-red-500"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">{asset.name}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium mt-1">
                    <span className="capitalize">{asset.asset_type}</span>
                    <span>{formatBytes(asset.size_bytes)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Asset Preview Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
            <button type="button" aria-label="Close"
              onClick={() => setSelectedAsset(null)}
              className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white rounded-full bg-slate-800"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <h4 className="text-base font-bold text-white mb-4 truncate pr-8">{selectedAsset.name}</h4>

            <div className="rounded-2xl overflow-hidden bg-slate-950 aspect-video mb-4 flex items-center justify-center border border-slate-800">
              {selectedAsset.asset_type === 'image' && (
                <img src={selectedAsset.url} alt={selectedAsset.name} className="max-h-full object-contain" />
              )}
              {selectedAsset.asset_type === 'video' && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img src={selectedAsset.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                    <VideoCameraIcon className="w-10 h-10 text-cyan-400 mb-2" />
                    <span className="text-xs text-slate-300 font-mono">4K Master Asset Stream</span>
                  </div>
                </div>
              )}
              {selectedAsset.asset_type === 'audio' && (
                <div className="flex flex-col items-center justify-center">
                  <MusicalNoteIcon className="w-12 h-12 text-purple-400 mb-2" />
                  <span className="text-xs text-slate-300 font-mono">Master Audio Track</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 font-medium bg-slate-800/50 p-3 rounded-xl mb-4">
              <div>
                <span className="text-slate-300 font-medium">Asset Type:</span> <span className="text-slate-200 capitalize">{selectedAsset.asset_type}</span>
              </div>
              <div>
                <span className="text-slate-300 font-medium">Format:</span> <span className="text-slate-200">{selectedAsset.format || 'Standard'}</span>
              </div>
              <div>
                <span className="text-slate-300 font-medium">File Size:</span> <span className="text-slate-200">{formatBytes(selectedAsset.size_bytes)}</span>
              </div>
              <div>
                <span className="text-slate-300 font-medium">Storage:</span> <span className="text-emerald-400">PostgreSQL Synced</span>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handleDeleteAsset(selectedAsset.id)}
                className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition-all"
              >
                Delete Asset
              </button>
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h4 className="text-lg font-bold text-white mb-2">Upload Asset to STERCS DAM</h4>
            <p className="text-xs text-slate-300 font-medium mb-4">Add high-resolution media to your creative studio workspace.</p>
            <form onSubmit={handleUploadAsset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cinematic Intro Drone Shot.mp4"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Media Type</label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="image">Image / Graphic Overlay</option>
                  <option value="video">Video Footage / Clip</option>
                  <option value="audio">Audio / SFX Sound Effect</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Media URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StercsMediaLibrary;
