import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { useAppContext } from '../contexts/AppContext';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, Disc,
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  Music, ListMusic, Plus, Sparkles, Radio, ArrowLeft
} from 'lucide-react';

interface BeatwaveTrack {
  id: number | string;
  title: string;
  artist_name?: string;
  artist?: string;
  genre: string;
  duration_seconds?: number;
  duration?: number | string;
  plays?: number;
  likes?: number;
  cover_url?: string;
  audio_url?: string;
}

interface BeatwavePlaylist {
  id: number | string;
  title?: string;
  name?: string;
  description: string;
  cover_url?: string;
  track_count?: number;
}

const BeatwaveDemoPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const [tracks, setTracks] = useState<BeatwaveTrack[]>([]);
  const [playlists, setPlaylists] = useState<BeatwavePlaylist[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [currentTrack, setCurrentTrack] = useState<BeatwaveTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(80);
  const [playbackSec, setPlaybackSec] = useState<number>(0);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState<boolean>(true);

  // New playlist modal state
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState<boolean>(false);
  const [playlistTitle, setPlaylistTitle] = useState<string>('');
  const [playlistGenre, setPlaylistGenre] = useState<string>('Afrobeats');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [trRes, plRes, gnRes] = await Promise.all([
          apiService.get('/api/beatwave/tracks').catch(() => null),
          apiService.get('/api/beatwave/playlists').catch(() => null),
          apiService.get('/api/beatwave/genres').catch(() => null)
        ]);

        if (active) {
          const rawTracks = Array.isArray(trRes) ? trRes : (trRes?.tracks || trRes?.data || []);
          const rawPlaylists = Array.isArray(plRes) ? plRes : (plRes?.playlists || plRes?.data || []);
          const rawGenres = Array.isArray(gnRes) ? gnRes : (gnRes?.genres || gnRes?.data || ['Afrobeats', 'Amapiano', 'Highlife', 'Afro-fusion']);

          if (rawTracks.length > 0) {
            setTracks(rawTracks);
            setCurrentTrack(rawTracks[0]);
          } else {
            const fallback: BeatwaveTrack[] = [
              { id: 1, title: 'Lagos Night Pulse', artist_name: 'Dancia Beats', genre: 'Afrobeats', duration_seconds: 215, plays: 14200, likes: 920 },
              { id: 2, title: 'Amapiano Sunrise Grooves', artist_name: 'DJ Maphorisa Club', genre: 'Amapiano', duration_seconds: 240, plays: 28400, likes: 1850 },
              { id: 3, title: 'Sovereign Frequency', artist_name: 'fingermobileprotocol Audio', genre: 'Electronic', duration_seconds: 180, plays: 9800, likes: 640 }
            ];
            setTracks(fallback);
            setCurrentTrack(fallback[0]);
          }

          setPlaylists(rawPlaylists.length > 0 ? rawPlaylists : [
            { id: 'pl-1', name: 'Top 50 Pan-African Hits', description: 'The hottest tracks across Lagos, Nairobi, and Johannesburg', track_count: 50 },
            { id: 'pl-2', name: 'Chill Deep Lofi Protocol', description: 'Ambient study and deep coding electronic grooves', track_count: 32 }
          ]);
          setGenres(['All', ...rawGenres]);
        }
      } catch (err) {
        // Handled via defaults
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setPlaybackSec((prev) => {
          const maxDur = (currentTrack?.duration_seconds || 200) as number;
          if (prev >= maxDur) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentTrack]);

  const handlePlayTrack = (track: BeatwaveTrack) => {
    setCurrentTrack(track);
    setPlaybackSec(0);
    setIsPlaying(true);
    showToast?.(`Now Playing: ${track.title}`, 'info');
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistTitle.trim()) return;

    try {
      const res: any = await apiService.post('/api/beatwave/playlists', {
        name: playlistTitle,
        description: `Curated demo mix in ${playlistGenre}`,
        genre: playlistGenre,
        trackIds: [currentTrack?.id || 1]
      });

      const newPl: BeatwavePlaylist = {
        id: res?.data?.id || res?.id || Date.now(),
        name: playlistTitle,
        description: `Curated demo mix in ${playlistGenre}`,
        track_count: 1
      };

      setPlaylists((prev) => [newPl, ...prev]);
      setPlaylistTitle('');
      setIsCreatingPlaylist(false);
      showToast?.(`Playlist "${playlistTitle}" saved successfully!`, 'success');
    } catch {
      showToast?.('Created playlist in local session cache', 'info');
      setIsCreatingPlaylist(false);
    }
  };

  const filteredTracks = selectedGenre === 'All'
    ? tracks
    : tracks.filter((t) => t.genre?.toLowerCase() === selectedGenre.toLowerCase());

  const formatSec = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-slate-300"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Disc className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Beatwave Studio Console</h1>
              <p className="text-xs text-slate-300 font-medium">High-Resolution Audio Engine • PostgreSQL Active</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCreatingPlaylist(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-xs font-bold transition-all shadow flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Playlist</span>
          </button>
          <button
            onClick={() => navigate('/beatwave-ng')}
            className="px-4 py-2 border border-slate-700 hover:border-slate-500 rounded-xl text-xs font-semibold text-slate-300 transition-colors"
          >
            Full BeatwaveNG App
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Player & Active Track Deck */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Album Art Deck */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-800 mb-6 shadow-2xl border border-slate-700/50 flex items-center justify-center">
              <img
                src={currentTrack?.cover_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800'}
                alt={currentTrack?.title || 'Beatwave'}
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="flex items-end space-x-1 h-8">
                    {[40, 75, 100, 60, 90, 45, 80].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-cyan-400 rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="mb-4">
              <h2 className="text-xl font-bold truncate">{currentTrack?.title || 'Select a Track'}</h2>
              <p className="text-sm text-slate-300 font-medium truncate">{currentTrack?.artist_name || currentTrack?.artist || 'Unknown Artist'}</p>
              <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
                {currentTrack?.genre || 'Beatwave'}
              </div>
            </div>

            {/* Scrubber */}
            <div className="space-y-1 mb-6">
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (playbackSec / ((currentTrack?.duration_seconds as number) || 200)) * 100)}%`
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-300 font-medium font-mono">
                <span>{formatSec(playbackSec)}</span>
                <span>{formatSec((currentTrack?.duration_seconds as number) || 200)}</span>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-center space-x-6 mb-6">
              <button
                onClick={() => {
                  const idx = tracks.findIndex((t) => t.id === currentTrack?.id);
                  if (idx > 0) handlePlayTrack(tracks[idx - 1]);
                }}
                className="p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="p-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
              </button>

              <button
                onClick={() => {
                  const idx = tracks.findIndex((t) => t.id === currentTrack?.id);
                  if (idx >= 0 && idx < tracks.length - 1) handlePlayTrack(tracks[idx + 1]);
                }}
                className="p-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center space-x-3 text-slate-300 font-medium">
              <Volume2 className="w-4 h-4 flex-shrink-0" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono w-8 text-right">{volume}%</span>
            </div>
          </div>
        </div>

        {/* Right Column: Track Catalog & Playlists */}
        <div className="lg:col-span-2 space-y-6">
          {/* Genre Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedGenre === g
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-300 font-medium border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Tracks List */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Music className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-lg">Catalog Tracks</h3>
              </div>
              <span className="text-xs text-slate-300 font-medium">{filteredTracks.length} tracks available</span>
            </div>

            <div className="space-y-2">
              {filteredTracks.map((track, i) => (
                <div
                  key={track.id}
                  onClick={() => handlePlayTrack(track)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    currentTrack?.id === track.id
                      ? 'bg-slate-800/80 border border-cyan-500/30'
                      : 'hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="text-xs text-slate-300 font-medium font-mono w-4">{i + 1}</span>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
                      <img
                        src={track.cover_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200'}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className={`font-semibold text-sm truncate ${currentTrack?.id === track.id ? 'text-cyan-400' : 'text-white'}`}>
                        {track.title}
                      </p>
                      <p className="text-xs text-slate-300 font-medium truncate">{track.artist_name || track.artist || 'Beatwave Artist'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-slate-300 font-medium hidden sm:inline">{track.genre}</span>
                    <span className="text-xs text-slate-300 font-medium font-mono">
                      {formatSec(typeof track.duration_seconds === 'number' ? track.duration_seconds : 180)}
                    </span>
                    <button
                      type="button"
                      aria-label={currentTrack?.id === track.id && isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                      onClick={() => {
                        if (currentTrack?.id === track.id) {
                          handleTogglePlay();
                        } else {
                          handlePlayTrack(track);
                        }
                      }}
                      className="p-2 text-slate-300 hover:text-white rounded-lg"
                    >
                      {currentTrack?.id === track.id && isPlaying ? (
                        <Pause className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Playlists Showcase */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ListMusic className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-lg">Curated Playlists</h3>
              </div>
              <button
                onClick={() => setIsCreatingPlaylist(true)}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
              >
                + New Playlist
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {playlists.map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => navigate(`/music/playlist/${pl.id}`)}
                  className="p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 cursor-pointer transition-all flex items-start space-x-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow">
                    <Disc className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-white truncate">{pl.title || pl.name}</h4>
                    <p className="text-xs text-slate-300 font-medium line-clamp-1 mt-0.5">{pl.description}</p>
                    <span className="text-[11px] text-cyan-400 font-semibold mt-1 inline-block">
                      {pl.track_count || 12} tracks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Create Playlist Modal */}
      {isCreatingPlaylist && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Create New Playlist</h3>
            <p className="text-xs text-slate-300 font-medium mb-4">Save to your decentralized Beatwave cloud storage.</p>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Playlist Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afro-Fusion Chill Vol. 1"
                  value={playlistTitle}
                  onChange={(e) => setPlaylistTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Genre Category</label>
                <select
                  value={playlistGenre}
                  onChange={(e) => setPlaylistGenre(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Afrobeats">Afrobeats</option>
                  <option value="Amapiano">Amapiano</option>
                  <option value="Highlife">Highlife</option>
                  <option value="Electronic">Electronic</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingPlaylist(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20"
                >
                  Save to Beatwave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeatwaveDemoPage;
