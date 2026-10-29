import React, { useState } from 'react';
import {
  Podcast,
  Plus,
  Clock,
  Download,
  Play,
  Pause,
  CheckCircle2,
} from 'lucide-react';
import { useBeatwaveNG, PodcastCard } from '../../contexts/BeatwaveNGContext';

export const PodcastsTab: React.FC = () => {
  const {
    podcasts,
    createPodcast,
    downloadPodcast,
    playTrack,
    currentTrack,
    isPlaying
  } = useBeatwaveNG();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [host, setHost] = useState('');
  const [guest, setGuest] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [genre, setGenre] = useState('Music Production');
  const [tagsInput, setTagsInput] = useState('Amapiano, Studio Secrets, Log Drums');
  const [playbackNotice, setPlaybackNotice] = useState<string | null>(null);

  const showPlaybackNotice = (msg: string) => {
    setPlaybackNotice(msg);
    setTimeout(() => setPlaybackNotice(null), 4000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !host.trim()) return;
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    try {
      await createPodcast(
        title.trim(),
        host.trim(),
        description.trim() || 'A sovereign audio podcast card on BeatwaveNG.',
        Math.min(30, Math.max(1, durationMinutes)),
        genre,
        tags,
        guest.trim()
      );
    } catch {
      return;
    }
    setShowCreateModal(false);
    setTitle('');
    setHost('');
    setGuest('');
    setDescription('');
  };

  const handlePlayPodcast = (pod: PodcastCard) => {
    if (pod.moderationStatus !== 'active') {
      showPlaybackNotice('This podcast is awaiting publication approval.');
      return;
    }
    if (!pod.audioUrl) {
      showPlaybackNotice('This podcast has no persistent media URL. Audio file storage is not connected yet.');
      return;
    }
    playTrack({
      id: pod.id,
      title: pod.title,
      artist: `${pod.host} ${pod.guest ? `ft. ${pod.guest}` : ''}`,
      album: 'BeatwaveNG Sovereign Podcasts',
      duration: pod.durationMinutes * 60,
      coverArt: pod.coverArt,
      url: pod.audioUrl,
      tier: 'SoundRiver',
      audioQuality: 'Hi-Res',
      bitrate: '320 kbps Podcast Master',
      genre: pod.genre,
      plays: 320,
      likes: 88
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Live Playback Notice */}
      {playbackNotice && (
        <div className="p-4 rounded-2xl bg-teal-950/90 border border-teal-500/50 text-teal-200 text-sm font-bold flex items-center justify-between shadow-xl">
          <span>⚠️ {playbackNotice}</span>
          <button
            onClick={() => setPlaybackNotice(null)}
            className="text-teal-400 hover:text-white font-black ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-950/70 via-slate-900 to-emerald-950/70 border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-black uppercase tracking-wider border border-teal-500/40 flex items-center gap-1.5">
              <Podcast size={14} />
              Sovereign Podcast Episodes
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
              50 Cards Max • 30 Mins Each
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Independent Creator Podcast Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Publish and broadcast up to 50 audio podcast cards with zero middleman censorship. 30-day cloud TTL — download in sovereign <strong className="text-teal-300">.fmpod</strong> format to keep in your permanent device storage!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-xs text-slate-300 font-bold uppercase tracking-wider">Slot Allocation</div>
            <div className="text-xl font-black text-teal-400 mt-0.5">
              {podcasts.length} <span className="text-xs text-slate-300 font-medium">/ 50 Cards</span>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            disabled={podcasts.length >= 50}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-teal-600/30 disabled:opacity-50"
          >
            <Plus size={16} />
            Create Podcast Card
          </button>
        </div>
      </div>

      {/* Podcast Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {podcasts.map((pod) => {
          const isCurrentlyPlaying = currentTrack?.id === pod.id && isPlaying;
          return (
            <div
              key={pod.id}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 overflow-hidden flex flex-col justify-between transition-all shadow-xl group"
            >
              {/* Cover Art */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={pod.coverArt}
                  alt={pod.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-black uppercase text-teal-300 border border-teal-500/40">
                    Ep #{pod.episodeNumber} • {pod.genre}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-slate-300">
                    {pod.durationMinutes} mins
                  </span>
                </div>

                <button type="button" aria-label="Pause"
                  onClick={() => handlePlayPodcast(pod)}
                  className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-teal-500 hover:bg-teal-400 text-black flex items-center justify-center shadow-lg shadow-teal-500/40 transition-transform hover:scale-110 active:scale-95"
                >
                  {isCurrentlyPlaying ? (
                    <Pause size={20} fill="black" />
                  ) : (
                    <Play size={20} fill="black" className="ml-0.5" />
                  )}
                </button>
              </div>

              {/* Info Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-black text-white line-clamp-1">{pod.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-medium mt-0.5">
                    <span>Host: <strong className="text-slate-200">{pod.host}</strong></span>
                    {pod.guest && <span>• Guest: {pod.guest}</span>}
                  </div>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {pod.description}
                  </p>
                </div>

                {/* TTL & Download Bar */}
                <div className="pt-3 border-t border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 font-bold text-teal-400">
                      <Clock size={12} />
                      {pod.daysRemaining} Days Left (Cloud TTL)
                    </span>
                    <span className="text-slate-300 font-medium font-mono">
                      {pod.isDownloaded ? 'Downloaded' : 'Cloud Cache'}
                    </span>
                  </div>

                  <button
                    onClick={() => downloadPodcast(pod.id)}
                    className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      pod.isDownloaded
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800 hover:bg-teal-600 hover:text-black text-slate-200'
                    }`}
                  >
                    {pod.isDownloaded ? (
                      <>
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        Saved in Sovereign .fmpod Vault
                      </>
                    ) : (
                      <>
                        <Download size={14} />
                        Download Sovereign .fmpod (Permanent)
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Podcast Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-teal-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                <Podcast size={18} />
                Create Sovereign Podcast Episode Card
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-300 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Episode Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Amapiano Formula & 3-Step Rhythms"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Host Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DJ Spinall"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Guest (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Kabza De Small"
                    value={guest}
                    onChange={(e) => setGuest(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="Music Production">Music Production</option>
                  <option value="Afrobeats & Culture">Afrobeats & Culture</option>
                  <option value="Sound Engineering">Sound Engineering</option>
                  <option value="Web3 & Creator Royalties">Web3 & Creator Royalties</option>
                  <option value="Youth Lifestyle">Youth Lifestyle</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Duration (Max 30 Mins)</label>
                  <span className="text-xs font-mono font-bold text-teal-400">{durationMinutes} mins</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Outline topics covered in this 30-minute episode..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Drums, Studio, Production"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
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
                  className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/30"
                >
                  Publish Podcast Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastsTab;
