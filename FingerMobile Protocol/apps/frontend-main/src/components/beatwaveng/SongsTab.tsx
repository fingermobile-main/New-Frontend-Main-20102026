/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Music,
  Search,
  Play,
  Pause,
  Heart,
  Plus,
  Share2,
  Sparkles,
  Download,
  Filter,
  Check,
  Disc,
  Clock,
  Volume2
} from 'lucide-react';
import { useBeatwaveNG, Track } from '../../contexts/BeatwaveNGContext';
import { formatTime } from '../../utils/timeUtils';

export const SongsTab: React.FC = () => {
  const {
    tracks,
    currentTrack,
    isPlaying,
    playTrack,
    pauseTrack,
    resumeTrack,
    likeTrack,
    createPlaylist
  } = useBeatwaveNG();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedQuality, setSelectedQuality] = useState('All');
  const [addToPlaylistTrack, setAddToPlaylistTrack] = useState<Track | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  const genres = ['All', 'Afrobeats', 'Amapiano', 'Highlife', 'Fuji', 'Afro-Soul', 'Gospel', 'Drill'];
  const qualities = ['All', 'Lossless 24-bit', 'Hi-Res 320k', 'SoundOcean'];

  const filteredTracks = tracks.filter((t) => {
    const matchesSearch =
      !searchTerm ||
      (t.title && t.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.artist && t.artist.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.album && t.album.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGenre =
      selectedGenre === 'All' || Boolean(t.genre && t.genre.toLowerCase().includes(selectedGenre.toLowerCase()));

    const matchesQuality =
      selectedQuality === 'All' ||
      (selectedQuality === 'SoundOcean' && t.tier === 'SoundOcean') ||
      (t.bitrate && t.bitrate.toLowerCase().includes(selectedQuality.toLowerCase()));

    return matchesSearch && matchesGenre && matchesQuality;
  });

  const handlePlayToggle = (track: Track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        pauseTrack();
      } else {
        resumeTrack();
      }
    } else {
      playTrack(track);
    }
  };

  const handleAddToPlaylistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim() || !addToPlaylistTrack) return;
    createPlaylist(newPlaylistName.trim(), `Contains track: ${addToPlaylistTrack.title}`);
    setIsAddedSuccess(true);
    setTimeout(() => {
      setIsAddedSuccess(false);
      setAddToPlaylistTrack(null);
      setNewPlaylistName('');
    }, 1200);
  };

  const handleShuffleAll = () => {
    if (filteredTracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredTracks.length);
      playTrack(filteredTracks[randomIndex]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Music className="w-6 h-6 text-emerald-400" />
            <span>Songs Catalog</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              {filteredTracks.length} Tracks
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Browse, stream, and queue high-fidelity sovereign master tracks across all genres.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleShuffleAll}
            className="flex-1 sm:flex-none py-2 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Shuffle All Songs</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input
            type="text"
            placeholder="Search songs, artists, or albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
          />
        </div>

        {/* Quality Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {qualities.map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuality(q)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedQuality === q
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Genre Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedGenre === g
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Songs Table View */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Title &amp; Artist</th>
                <th className="py-3 px-4 hidden md:table-cell">Album</th>
                <th className="py-3 px-4 hidden sm:table-cell">Genre</th>
                <th className="py-3 px-4 hidden lg:table-cell">Audio Quality</th>
                <th className="py-3 px-4 text-center">
                  <Clock className="w-4 h-4 mx-auto" />
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredTracks.map((track, idx) => {
                const isCurrent = currentTrack?.id === track.id;
                return (
                  <tr
                    key={track.id}
                    className={`hover:bg-slate-800/50 transition group ${
                      isCurrent ? 'bg-emerald-950/30' : ''
                    }`}
                  >
                    {/* Index / Play Button */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handlePlayToggle(track)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition mx-auto ${
                          isCurrent
                            ? 'bg-emerald-500 text-slate-950 shadow-md'
                            : 'text-slate-300 group-hover:bg-slate-800 group-hover:text-white'
                        }`}
                        title={isCurrent && isPlaying ? 'Pause' : 'Play'}
                      >
                        {isCurrent && isPlaying ? (
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : isCurrent ? (
                          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                        ) : (
                          <span className="group-hover:hidden font-mono text-[11px]">{idx + 1}</span>
                        )}
                        {!isCurrent && (
                          <Play className="w-3.5 h-3.5 fill-current hidden group-hover:block" />
                        )}
                      </button>
                    </td>

                    {/* Title & Artist */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={track.coverArt}
                          alt={track.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <div
                            className={`font-bold truncate ${
                              isCurrent ? 'text-emerald-400' : 'text-white'
                            }`}
                          >
                            {track.title}
                          </div>
                          <div className="text-[11px] text-slate-300 truncate">
                            {track.artist}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Album */}
                    <td className="py-3 px-4 hidden md:table-cell text-slate-300 truncate max-w-xs">
                      {track.album}
                    </td>

                    {/* Genre */}
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300">
                        {track.genre}
                      </span>
                    </td>

                    {/* Audio Quality */}
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            track.tier === 'SoundOcean'
                              ? 'bg-amber-950/80 text-amber-400 border border-amber-800/80'
                              : 'bg-sky-950/80 text-sky-400 border border-sky-800/80'
                          }`}
                        >
                          {track.audioQuality || 'Lossless'}
                        </span>
                        <span className="text-[10px] text-slate-300 font-mono">
                          {track.bitrate ? track.bitrate.split(' ')[0] : '1411k'}
                        </span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-4 text-center font-mono text-slate-300 text-[11px]">
                      {formatTime(track.duration)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => likeTrack(track.id)}
                          className={`p-1.5 rounded-lg transition ${
                            track.isLiked
                              ? 'text-rose-500'
                              : 'text-slate-300 hover:text-rose-400'
                          }`}
                          title="Like Track"
                        >
                          <Heart
                            className={`w-4 h-4 ${track.isLiked ? 'fill-current' : ''}`}
                          />
                        </button>
                        <button
                          onClick={() => setAddToPlaylistTrack(track)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-white transition"
                          title="Add to Playlist"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add To Playlist Modal */}
      {addToPlaylistTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-left">
            <h3 className="text-base font-bold text-white mb-2">
              Add "{addToPlaylistTrack.title}" to Playlist
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Enter a new playlist name or select an existing sovereign collection.
            </p>

            <form onSubmit={handleAddToPlaylistSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Playlist name..."
                required
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />

              {isAddedSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                  ✓ Successfully added to playlist!
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddToPlaylistTrack(null)}
                  className="py-2 px-4 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
                >
                  Save to Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
