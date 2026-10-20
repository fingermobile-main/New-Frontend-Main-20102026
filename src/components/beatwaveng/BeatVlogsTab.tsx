import React, { useState } from 'react';
import {
  Video,
  Plus,
  Play,
  Heart,
  Eye,
  Share2,
  Sparkles,
  Tag,
  CheckCircle2,
  X
} from 'lucide-react';
import { useBeatwaveNG, BeatVlog } from '../../contexts/BeatwaveNGContext';

export const BeatVlogsTab: React.FC = () => {
  const { beatVlogs, createBeatVlog } = useBeatwaveNG();

  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState<BeatVlog | null>(null);

  // Upload Form
  const [title, setTitle] = useState('');
  const [sharedInterest, setSharedInterest] = useState('Beat Making');
  const [duration, setDuration] = useState('12:45');
  const [tagsInput, setTagsInput] = useState('MPC, Drums, Vintage Beats');

  const categories = [
    'All',
    'Beat Making',
    'Live Soundcheck',
    'Amapiano Studio Sessions',
    'Vinyl Digging',
    'Mixing & Mastering'
  ];

  const filteredVlogs = selectedTag === 'All'
    ? beatVlogs
    : beatVlogs.filter((v) => v.sharedInterest === selectedTag || v.tags.includes(selectedTag));

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    await createBeatVlog(
      title.trim(),
      tags,
      sharedInterest,
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
      duration
    );
    setShowUploadModal(false);
    setTitle('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-wider border border-purple-500/40 flex items-center gap-1.5">
              <Video size={14} />
              BeatVlogs Creator Hub
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
              Shared Interest Streams
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Curated Shared Interest Vlogs
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Immerse yourself in authentic behind-the-scenes beat making, soundcheck setups, live vinyl crate digging, and studio workflow vlogs curated by the sovereign community.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-600/30 shrink-0"
        >
          <Plus size={16} />
          Submit BeatVlog
        </button>
      </div>

      {/* Shared Interest Filter Tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pr-1">
        {categories.map((cat) => {
          const isActive = selectedTag === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedTag(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Vlogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVlogs.map((vlog) => (
          <div
            key={vlog.id}
            onClick={() => setActiveVideoModal(vlog)}
            className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 overflow-hidden flex flex-col justify-between cursor-pointer transition-all shadow-xl group"
          >
            {/* Thumbnail Canvas */}
            <div className="relative h-48 overflow-hidden bg-slate-950">
              <img
                src={vlog.thumbnailUrl}
                alt={vlog.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

              {/* Duration & Tag Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-black uppercase text-purple-300 border border-purple-500/40">
                  {vlog.sharedInterest}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-slate-300">
                  {vlog.duration}
                </span>
              </div>

              {/* Play CTA in Center on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-xl shadow-purple-600/50 transform scale-90 group-hover:scale-100 transition-transform">
                  <Play size={24} fill="currentColor" className="ml-1" />
                </div>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-5 space-y-3">
              <h3 className="text-base font-black text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                {vlog.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <span className="font-bold text-slate-200">{vlog.creator}</span>
                <span>•</span>
                <span>{vlog.createdAt}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {vlog.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-slate-950 text-slate-300 text-[10px] font-semibold border border-slate-800"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Telemetry: Views & Likes */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1">
                  <Eye size={13} className="text-purple-400" />
                  {vlog.views.toLocaleString()} views
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={13} className="text-rose-400" />
                  {vlog.likes.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Playback Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                <Video size={18} />
                <span>{activeVideoModal.title}</span>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Video Stage Simulator */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-slate-800">
              <img
                src={activeVideoModal.thumbnailUrl}
                alt={activeVideoModal.title}
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xl animate-pulse">
                  <Play size={28} fill="currentColor" className="ml-1" />
                </div>
                <div className="text-xs text-white font-bold bg-black/60 px-3 py-1 rounded-full">
                  Streaming Sovereign 1080p 60fps Vlog
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 font-medium pt-2">
              <div>
                Creator: <strong className="text-white">{activeVideoModal.creator}</strong> • {activeVideoModal.sharedInterest}
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Share a BeatVlog with Community</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Vlog Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sampling 1970s Highlife Vinyl in Lagos"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Shared Interest Theme</label>
                <select
                  value={sharedInterest}
                  onChange={(e) => setSharedInterest(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="Beat Making">Beat Making</option>
                  <option value="Live Soundcheck">Live Soundcheck</option>
                  <option value="Amapiano Studio Sessions">Amapiano Studio Sessions</option>
                  <option value="Vinyl Digging">Vinyl Digging</option>
                  <option value="Mixing & Mastering">Mixing & Mastering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 15:30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Highlife, Vinyl, MPC"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30"
                >
                  Submit Vlog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeatVlogsTab;
