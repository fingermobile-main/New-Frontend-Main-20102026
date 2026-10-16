import React, { useState } from 'react';
import {
  FolderHeart,
  Plus,
  Sparkles,
  Play,
  Pause,
  Share2,
  Heart,
  Download,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBeatwaveNG } from '../../contexts/BeatwaveNGContext';
import { formatTime } from '../../utils/timeUtils';

export const LibraryTab: React.FC = () => {
  const {
    tracks,
    currentTrack,
    isPlaying,
    playTrack,
    createPlaylist,
    likeTrack
  } = useBeatwaveNG();

  const [activeSection, setActiveSection] = useState<'playlists' | 'liked' | 'vault'>('playlists');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAiCurateModal, setShowAiCurateModal] = useState(false);

  // Form states
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDesc, setPlaylistDesc] = useState('');
  const [aiPrompt, setAiPrompt] = useState('High-energy Lagos rooftop party with heavy Amapiano log drums');
  const [isCurating, setIsCurating] = useState(false);

  // User Playlists Seed
  const [userPlaylists, setUserPlaylists] = useState([
    {
      id: 'pl-1',
      title: 'Lagos Night Ride Heavy Bass',
      description: 'Late night cruising anthems curated for sovereign sound systems.',
      trackCount: 14,
      coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500',
      isAiCurated: true
    },
    {
      id: 'pl-2',
      title: 'Amapiano Studio Focus & Flow',
      description: 'Private school Amapiano and deep soulful jazz chords.',
      trackCount: 18,
      coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500',
      isAiCurated: false
    },
    {
      id: 'pl-3',
      title: 'Sunday Morning Afro-Soul & Highlife',
      description: 'Acoustic palm-wine rhythms and timeless vintage brass.',
      trackCount: 9,
      coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500',
      isAiCurated: true
    }
  ]);

  const likedTracks = tracks.filter((t) => t.isLiked || (t.likes ?? 0) > 200);

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName.trim()) return;
    createPlaylist(playlistName.trim(), playlistDesc.trim());
    setUserPlaylists((prev) => [
      {
        id: `pl-${Date.now()}`,
        title: playlistName.trim(),
        description: playlistDesc.trim() || 'Custom user sovereign playlist.',
        trackCount: 1,
        coverArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500',
        isAiCurated: false
      },
      ...prev
    ]);
    setShowCreateModal(false);
    setPlaylistName('');
    setPlaylistDesc('');
  };

  const handleAiCurate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsCurating(true);
    setTimeout(() => {
      setUserPlaylists((prev) => [
        {
          id: `pl-ai-${Date.now()}`,
          title: `AI Mix: ${aiPrompt.slice(0, 28)}...`,
          description: `AI-curated based on prompt: "${aiPrompt}"`,
          trackCount: 12,
          coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500',
          isAiCurated: true
        },
        ...prev
      ]);
      setIsCurating(false);
      setShowAiCurateModal(false);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/40 flex items-center gap-1.5">
              <FolderHeart size={14} />
              Structured Personal Music Library
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
              AI-Assisted Curation
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Your Sovereign Music Vault
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Organize personal playlists, liked master tracks, and AI-assisted generative mixes. Share playlists with your crew or sync directly to your offline encrypted device storage.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setShowAiCurateModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-2 transition-all shadow-md"
          >
            <Sparkles size={14} />
            AI-Assisted Curation
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30"
          >
            <Plus size={14} />
            Create Playlist
          </button>
        </div>
      </div>

      {/* Library Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSection('playlists')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'playlists'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          My Playlists ({userPlaylists.length})
        </button>

        <button
          onClick={() => setActiveSection('liked')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'liked'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Liked Tracks ({likedTracks.length})
        </button>

        <Link
          to="/mydownloads"
          className="ml-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
        >
          <Download size={13} className="text-emerald-400" />
          <span>Open My Downloads Vault</span>
          <ExternalLink size={12} className="text-slate-500" />
        </Link>
      </div>

      {/* SECTION 1: PLAYLISTS GRID */}
      {activeSection === 'playlists' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userPlaylists.map((pl) => (
            <div
              key={pl.id}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 p-5 space-y-4 transition-all shadow-xl group"
            >
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-950">
                <img
                  src={pl.coverArt}
                  alt={pl.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                {pl.isAiCurated && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Sparkles size={11} />
                    AI Curated
                  </span>
                )}

                <button
                  onClick={() => playTrack(tracks[0])}
                  className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                >
                  <Play size={20} fill="black" className="ml-0.5" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                  {pl.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {pl.description}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 mt-3 border-t border-slate-800/80 font-medium">
                  <span>{pl.trackCount} Tracks</span>
                  <button className="text-emerald-400 hover:underline flex items-center gap-1 font-bold">
                    <Share2 size={12} />
                    Share Playlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 2: LIKED TRACKS */}
      {activeSection === 'liked' && (
        <div className="space-y-3">
          {likedTracks.map((track) => {
            const isCurrentPlaying = currentTrack?.id === track.id && isPlaying;
            return (
              <div
                key={track.id}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => playTrack(track, likedTracks)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isCurrentPlaying
                        ? 'bg-emerald-500 text-black shadow-md'
                        : 'bg-slate-800 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {isCurrentPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                  </button>

                  <img
                    src={track.coverArt}
                    alt={track.title}
                    className="w-12 h-12 rounded-xl object-cover"
                  />

                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">{track.title}</div>
                    <div className="text-xs text-slate-400 truncate">{track.artist}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950 text-emerald-400 text-xs font-mono font-bold border border-slate-800">
                    {track.genre}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {formatTime(track.duration)}
                  </span>
                  <button
                    onClick={() => likeTrack(track.id)}
                    className="text-rose-500 p-1.5 hover:scale-110 transition-transform"
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Create Sovereign Playlist</h3>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Playlist Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afrobeats Workout Frequency"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="What is the vibe or purpose of this playlist?"
                  value={playlistDesc}
                  onChange={(e) => setPlaylistDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Curation Modal */}
      {showAiCurateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Sparkles size={18} />
              AI-Assisted Playlist Curation
            </div>
            <p className="text-xs text-slate-400">
              Prompt our sovereign music recommendation engine with any mood, tempo, or scene, and it will build a structured playlist.
            </p>

            <form onSubmit={handleAiCurate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Prompt / Vibe Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your desired mood, instruments, or occasion..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiCurateModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCurating}
                  className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black text-xs font-black shadow-md shadow-amber-600/30"
                >
                  {isCurating ? 'Curating Flow...' : 'Generate AI Playlist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryTab;
