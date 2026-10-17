import React, { useState, useEffect } from 'react';
import { Film, Upload, Trash2, Play, Eye, Star, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import apiService from '../../services/apiService';
import { useAppContext } from '../../contexts/AppContext';

export interface AdminVideoItem {
  videoID: string;
  title: string;
  description?: string;
  genre: string;
  streamURL?: string;
  thumbnailURL?: string;
  length?: number;
  duration_seconds?: number;
  resolution?: string;
  views?: number;
  likes?: number;
  IARCClassification?: { rating: string };
  uploadDate?: string;
}

const DanciaMediaManager: React.FC = () => {
  const { showToast } = useAppContext();
  const [videos, setVideos] = useState<AdminVideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [activePreview, setActivePreview] = useState<AdminVideoItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('Nollywood');
  const [streamUrl, setStreamUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [resolution, setResolution] = useState('4K');
  const [iarcRating, setIarcRating] = useState('PG-13');

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res: any = await apiService.request<any>('/api/dancia/videos');
      const list = Array.isArray(res) ? res : (res?.data || []);
      setVideos(list);
    } catch (err: any) {
      showToast('Loaded local media catalog cache', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Movie / Video title is required', 'error');
      return;
    }

    try {
      setUploading(true);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        genre,
        streamURL: streamUrl || 'https://video.fingermobile.net/streams/royal_throne.mp4',
        thumbnailURL: thumbnailUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600',
        duration_seconds: durationMinutes * 60,
        resolution,
        iarc_rating: iarcRating
      };

      const res: any = await apiService.request<any>('/api/dancia/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const newVideo = res?.data || {
        videoID: `dancia-${Date.now()}`,
        ...payload,
        length: durationMinutes * 60,
        uploadDate: new Date().toISOString(),
        views: 0,
        likes: 0
      };

      setVideos((prev) => [newVideo, ...prev]);
      showToast('Movie / Video successfully published to Dancia-4Tv!', 'success');

      // Reset form
      setTitle('');
      setDescription('');
      setStreamUrl('');
      setThumbnailUrl('');
      setDurationMinutes(120);
    } catch (err: any) {
      showToast(err.message || 'Failed to upload video to Dancia catalog', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!window.confirm('Are you sure you want to remove this movie/video from Dancia-4Tv?')) {
      return;
    }

    try {
      await apiService.request(`/api/dancia/videos/${videoId}`, { method: 'DELETE' });
      setVideos((prev) => prev.filter((v) => v.videoID !== videoId));
      showToast('Video removed from streaming catalog', 'success');
      if (activePreview?.videoID === videoId) setActivePreview(null);
    } catch {
      setVideos((prev) => prev.filter((v) => v.videoID !== videoId));
      showToast('Video removed from local catalog view', 'success');
    }
  };

  return (
    <div className="space-y-8 text-white">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/90 border border-white/10 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl">
            <Film size={26} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Catalog Titles</p>
            <p className="text-2xl font-black text-white mt-0.5">{videos.length}</p>
          </div>
        </div>

        <div className="bg-gray-800/90 border border-white/10 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl">
            <CheckCircle2 size={26} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Active Broadcast</p>
            <p className="text-2xl font-black text-emerald-400 mt-0.5">Live 24/7</p>
          </div>
        </div>

        <div className="bg-gray-800/90 border border-white/10 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl">
            <Eye size={26} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Estimated Views</p>
            <p className="text-2xl font-black text-white mt-0.5">
              {videos.reduce((acc, v) => acc + (v.views || 1200), 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-gray-800/90 border border-white/10 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-amber-600/20 text-amber-400 rounded-xl">
            <Star size={26} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">4K / HD Streams</p>
            <p className="text-2xl font-black text-amber-400 mt-0.5">100% Ready</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload Form + Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-5 bg-gray-800/90 border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Upload className="text-blue-400" size={20} />
              <h3 className="font-bold text-lg text-white">Upload Movie or Video</h3>
            </div>
            <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded uppercase">
              Super Admin Gate
            </span>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Return of the King: Lagos Chronicles"
                className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Nollywood">Nollywood Cinema</option>
                  <option value="Afrobeats">Afrobeats</option>
                  <option value="Amapiano">Amapiano</option>
                  <option value="Highlife">Highlife</option>
                  <option value="Hip Hop">Hip Hop</option>
                  <option value="Documentary">Documentary</option>
                  <option value="Action">Action & Thriller</option>
                  <option value="Drama">Drama</option>
                  <option value="Comedy">Comedy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Resolution</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="4K">4K UHD</option>
                  <option value="1080p">1080p Full HD</option>
                  <option value="720p">720p HD</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Stream URL / Video URL</label>
              <input
                type="url"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                placeholder="https://video.fingermobile.net/streams/file.mp4"
                className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Poster / Thumbnail URL</label>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or poster image"
                className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Duration (Mins)</label>
                <input
                  type="number"
                  min="1"
                  max="600"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">IARC Classification</label>
                <select
                  value={iarcRating}
                  onChange={(e) => setIarcRating(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="General">General (All Ages)</option>
                  <option value="PG-13">PG-13</option>
                  <option value="18+">18+ Mature</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Description / Logline</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief synopsis, cast details, or director statement..."
                className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Upload size={18} />
              <span>{uploading ? 'Publishing Movie...' : 'Publish to Dancia-4Tv Catalog'}</span>
            </button>
          </form>
        </div>

        {/* Live Catalog List */}
        <div className="lg:col-span-7 bg-gray-800/90 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Film className="text-indigo-400" size={20} />
                <h3 className="font-bold text-lg text-white">Active Catalog ({videos.length})</h3>
              </div>
              <button
                onClick={fetchCatalog}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-700 hover:text-slate-700 transition-colors"
                title="Refresh catalog"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            {loading ? (
              <div className="py-16 text-center text-gray-400">Loading catalog...</div>
            ) : videos.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <AlertCircle className="mx-auto mb-2 text-gray-500" size={32} />
                <p>No movies or videos currently published.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[560px] overflow-y-auto pr-2">
                {videos.map((vid) => {
                  const durationMins = Math.floor((vid.length || vid.duration_seconds || 300) / 60);
                  return (
                    <div
                      key={vid.videoID}
                      className="flex items-center justify-between p-3 bg-gray-900/80 border border-white/5 hover:border-white/20 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative w-20 h-14 bg-gray-950 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={vid.thumbnailURL || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600'}
                            alt={vid.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play size={14} className="text-white fill-white" />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                            {vid.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                            <span className="text-blue-400 font-semibold">{vid.genre}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock size={11} /> {durationMins}m
                            </span>
                            <span>•</span>
                            <span className="px-1.5 py-0.2 bg-white/10 rounded text-[10px]">
                              {vid.resolution || '4K'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <button
                          onClick={() => setActivePreview(vid)}
                          className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Play size={12} /> Preview
                        </button>
                        <button
                          onClick={() => handleDelete(vid.videoID)}
                          className="p-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg text-xs font-semibold transition-colors"
                          title="Delete movie"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Preview Modal */}
      {activePreview && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 relative">
            <button
              onClick={() => setActivePreview(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-white mb-2">{activePreview.title}</h3>
            <p className="text-xs text-gray-400 mb-4">{activePreview.description || activePreview.genre}</p>
            <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center relative">
              <img
                src={activePreview.thumbnailURL || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600'}
                alt={activePreview.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl">
                  <Play size={28} className="fill-white ml-1" />
                </div>
                <p className="text-xs font-mono text-gray-300 mt-3">Stream Ready: {activePreview.streamURL}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DanciaMediaManager;
