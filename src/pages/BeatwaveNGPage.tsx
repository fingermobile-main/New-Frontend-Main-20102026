import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, Search, Heart,
  Music, Disc, ListMusic, BrainCircuit, ShieldCheck, Settings, Activity, Clock, Trash2, Plus, X
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import DisplaySettings, { DisplayMode, SortCriteria } from '../components/DisplaySettings';
import DanciaAppSettings from '../components/DanciaAppSettings';
import Dancia4TvControls from '../components/Dancia4TvControls';
import MainLayout from '../components/layout/MainLayout';
import { MusicalNoteIcon } from '../icons';
import api from '../services/api';

interface Track {
  id: number;
  title: string;
  artist_name?: string;
  artistName?: string;
  artist?: string;
  genre: string;
  duration_seconds?: number;
  duration?: number | string;
  plays?: number;
  likes?: number;
  audio_url?: string;
  audioUrl?: string;
  url?: string;
  cover_url?: string;
  coverArt?: string;
  cover?: string;
}

interface Playlist {
  id: number;
  title?: string;
  name?: string;
  description: string;
  cover_url?: string;
  coverArt?: string;
  track_count?: number;
  totalTracks?: number;
  total_duration?: number;
}

interface Artist {
  id: number;
  name: string;
  bio?: string;
  coverArt?: string;
  followers?: number;
  verified?: boolean;
}

interface HistoryItem {
  history_id: number;
  playedAt: string;
  id: number;
  title: string;
  artistName: string;
  genre: string;
  duration: number;
  audioUrl?: string;
  coverArt?: string;
}

const BeatwaveNGPage: React.FC = () => {
  const { showToast, ficBalance } = useAppContext();
  const [activeTab, setActiveTab] = useState<'discover' | 'trending' | 'artists' | 'library' | 'history'>('discover');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [groupVideos, setGroupVideos] = useState(false);
  const [groupAudio, setGroupAudio] = useState(false);
  const [sortBy, setSortBy] = useState<SortCriteria>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [favoriteTrackIds, setFavoriteTrackIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Format seconds to mm:ss
  const formatDuration = (secs?: number | string): string => {
    if (!secs) return '3:00';
    const num = typeof secs === 'number' ? secs : parseInt(secs, 10) || 180;
    const m = Math.floor(num / 60);
    const s = num % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Fetch Tracks
  const fetchTracks = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoint = activeTab === 'trending' ? '/beatwave/tracks/trending' : '/beatwave/tracks';
      const params: Record<string, string> = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get(endpoint, { params });
      if (res.data?.success && Array.isArray(res.data.data)) {
        const loadedTracks: Track[] = res.data.data.map((t: Track) => ({
          ...t,
          artist: t.artistName || t.artist_name || t.artist || 'Independent Artist',
          duration: t.duration || 180,
          audio_url: t.audioUrl || t.audio_url || t.url,
          cover: t.coverArt || t.cover_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=500&q=80'
        }));
        setTracks(loadedTracks);
        if (!currentTrack && loadedTracks.length > 0) {
          setCurrentTrack(loadedTracks[0]);
        }
      }
    } catch {
      showToast('Could not load tracks. Using cached library.', 'info');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery, currentTrack, showToast]);

  // Fetch Artists
  const fetchArtists = useCallback(async () => {
    try {
      const res = await api.get('/beatwave/artists');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setArtists(res.data.data);
      }
    } catch {
      // Ignore background error
    }
  }, []);

  // Fetch Playlists
  const fetchPlaylists = useCallback(async () => {
    try {
      const res = await api.get('/beatwave/playlists');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setPlaylists(res.data.data);
      }
    } catch {
      // Ignore background error
    }
  }, []);

  // Fetch User Favorites
  const fetchFavorites = useCallback(async () => {
    try {
      const res = await api.get('/beatwave/favorites');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setFavoriteTrackIds(res.data.data.map((f: { id: number }) => f.id));
      }
    } catch {
      // Guest mode
    }
  }, []);

  // Fetch Playback History
  const fetchHistory = useCallback(async () => {
    try {
      const res = await api.get('/beatwave/history');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setHistoryItems(res.data.data);
      }
    } catch {
      // Guest mode
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'discover' || activeTab === 'trending') {
      fetchTracks();
    } else if (activeTab === 'artists') {
      fetchArtists();
    } else if (activeTab === 'library') {
      fetchPlaylists();
    } else if (activeTab === 'history') {
      fetchHistory();
    }
    fetchFavorites();
  }, [activeTab, fetchTracks, fetchArtists, fetchPlaylists, fetchFavorites, fetchHistory]);

  // Handle Audio events
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 180);
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
  };

  // Play / Pause Track
  const handlePlayTrack = async (track: Track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }

    setCurrentTrack(track);
    setIsPlaying(true);

    try {
      await api.post(`/beatwave/tracks/${track.id}/play`);
    } catch {
      // Silent error
    }
  };

  useEffect(() => {
    if (currentTrack && isPlaying && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play policy handling
        });
      }
    }
  }, [currentTrack, isPlaying]);

  // Toggle Favorite
  const handleToggleFavorite = async (e: React.MouseEvent, trackId: number) => {
    e.stopPropagation();
    const isFav = favoriteTrackIds.includes(trackId);
    try {
      if (isFav) {
        await api.delete(`/beatwave/favorites/${trackId}`);
        setFavoriteTrackIds(prev => prev.filter(id => id !== trackId));
        showToast('Removed from favorites', 'success');
      } else {
        await api.post(`/beatwave/favorites/${trackId}`);
        setFavoriteTrackIds(prev => [...prev, trackId]);
        showToast('Added to favorites!', 'success');
      }
    } catch {
      showToast('Please log in to manage your favorites', 'info');
    }
  };

  // Create Playlist
  const handleCreatePlaylistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) return;

    try {
      const res = await api.post('/beatwave/playlists', {
        title: newPlaylistTitle.trim(),
        description: newPlaylistDesc.trim(),
        isPublic: true
      });
      if (res.data?.success) {
        showToast('Playlist created successfully!', 'success');
        setShowCreatePlaylistModal(false);
        setNewPlaylistTitle('');
        setNewPlaylistDesc('');
        fetchPlaylists();
      }
    } catch {
      showToast('Failed to create playlist', 'error');
    }
  };

  // Clear History
  const handleClearHistory = async () => {
    try {
      await api.delete('/beatwave/history');
      setHistoryItems([]);
      showToast('Playback history cleared!', 'success');
    } catch {
      showToast('Failed to clear playback history', 'error');
    }
  };

  const filteredTracks = tracks.filter(t => {
    if (showFavoritesOnly && !favoriteTrackIds.includes(t.id)) return false;
    return true;
  });

  return (
    <MainLayout pageTitle="Beatwave NG">
      <audio
        ref={audioRef}
        src={currentTrack?.audio_url || currentTrack?.audioUrl || ''}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl shadow-md">
              <MusicalNoteIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                BEATWAVE-NG
              </h1>
              <p className="text-gray-600 mt-1">
                Pure Auditory Excellence & Streaming Protocol
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/40">
                  <Disc className="text-white animate-spin" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tighter text-gray-900">BEATWAVE-NG</h2>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em]">Pure Auditory Excellence</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 w-full md:w-auto">
                <div className="flex-grow md:w-80 relative group">
                  <Search className="absolute left-4 top-3 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') fetchTracks(); }}
                    placeholder="Search artists, tracks, genres..."
                    className="w-full bg-white border border-gray-200 rounded-2xl py-2.5 pl-12 pr-4 text-gray-900 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all shadow-sm"
                  />
                </div>
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm"
                  title="Player Settings"
                >
                  <Settings size={20} className="text-gray-600" />
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar Navigation */}
              <aside className="lg:col-span-3 space-y-8">
                <nav className="space-y-2">
                  {[
                    { id: 'discover', label: 'Discover', icon: <Music size={18} /> },
                    { id: 'trending', label: 'Trending', icon: <Activity size={18} /> },
                    { id: 'artists', label: 'Artists', icon: <Disc size={18} /> },
                    { id: 'library', label: 'Playlists', icon: <ListMusic size={18} /> },
                    { id: 'history', label: 'History', icon: <Clock size={18} /> }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as 'discover' | 'trending' | 'artists' | 'library' | 'history')}
                      className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                        activeTab === item.id
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
                          : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>

                <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-[2rem] space-y-4">
                  <div className="flex items-center space-x-3">
                    <BrainCircuit className="text-indigo-600" size={20} />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">AI Curated</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    FingerMobile Harmonizer AI processes auditory dynamics to personalize your playlist streams.
                  </p>
                  <button
                    onClick={() => showToast('Harmonizer AI Echo Stream initialized', 'success')}
                    className="w-full py-3 bg-indigo-600 text-white text-[10px] font-black rounded-xl hover:bg-indigo-700 transition-colors uppercase tracking-[0.2em] shadow"
                  >
                    Initialize Echo
                  </button>
                </div>
              </aside>

              {/* Main Content Area */}
              <main className="lg:col-span-9 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <h2 className="text-xl font-black tracking-tight text-gray-900 capitalize">
                    {activeTab === 'library' ? 'Curated Playlists' : activeTab === 'history' ? 'Playback History' : activeTab}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4">
                    <Dancia4TvControls />
                    <DisplaySettings
                      currentMode={displayMode}
                      onModeChange={setDisplayMode}
                      showFavoritesOnly={showFavoritesOnly}
                      onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
                      groupVideos={groupVideos}
                      onToggleGroupVideos={() => setGroupVideos(!groupVideos)}
                      groupAudio={groupAudio}
                      onToggleGroupAudio={() => setGroupAudio(!groupAudio)}
                      sortCriteria={sortBy}
                      onSortChange={setSortBy}
                    />
                  </div>
                </div>

                {/* Artists View */}
                {activeTab === 'artists' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {artists.map((artist) => (
                      <div
                        key={artist.id}
                        className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow group flex items-center space-x-4 cursor-pointer"
                        onClick={() => {
                          setSearchQuery(artist.name);
                          setActiveTab('discover');
                        }}
                      >
                        <img
                          src={artist.coverArt || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80'}
                          alt={artist.name}
                          className="w-16 h-16 rounded-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <h3 className="font-bold text-gray-900 flex items-center">
                            {artist.name}
                            {artist.verified && (
                              <ShieldCheck size={16} className="text-indigo-600 ml-1.5" />
                            )}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{artist.bio || 'Verified Beatwave Creator'}</p>
                          <span className="text-[11px] font-semibold text-indigo-600 mt-1 block">
                            {(artist.followers || 0).toLocaleString()} Followers
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activeTab === 'history' ? (
                  /* Playback History View */
                  <div className="space-y-4">
                    {historyItems.length > 0 && (
                      <div className="flex justify-end">
                        <button
                          onClick={handleClearHistory}
                          className="flex items-center text-xs text-red-600 hover:text-red-700 font-bold px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={14} className="mr-1.5" /> Clear History
                        </button>
                      </div>
                    )}
                    {historyItems.length === 0 ? (
                      <div className="py-12 text-center text-gray-500">
                        No playback history available. Start listening to tracks!
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 shadow-sm overflow-hidden">
                        {historyItems.map((item) => (
                          <div key={item.history_id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-4">
                              <img
                                src={item.coverArt || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80'}
                                alt={item.title}
                                className="w-12 h-12 rounded-xl object-cover"
                              />
                              <div>
                                <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                                <p className="text-xs text-gray-500">{item.artistName}</p>
                              </div>
                            </div>
                            <div className="text-right text-xs text-gray-400">
                              <span>{new Date(item.playedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : activeTab === 'library' ? (
                  /* Playlists View */
                  <div className="space-y-6">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowCreatePlaylistModal(true)}
                        className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-indigo-700 transition-colors"
                      >
                        <Plus size={16} />
                        <span>Create Playlist</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {playlists.map((playlist) => (
                        <div
                          key={playlist.id}
                          className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                          onClick={() => {
                            setActiveTab('discover');
                            fetchTracks();
                          }}
                        >
                          <div className="aspect-square rounded-xl overflow-hidden mb-4 relative">
                            <img
                              src={playlist.cover_url || playlist.coverArt || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=500&q=80'}
                              alt={playlist.title || playlist.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <Play fill="black" size={20} className="ml-1 text-black" />
                              </div>
                            </div>
                          </div>
                          <h3 className="font-bold text-gray-900 truncate">{playlist.title || playlist.name}</h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{playlist.description}</p>
                          <div className="mt-3 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                            <span>{playlist.track_count || playlist.totalTracks || 0} Tracks</span>
                            <span>Curated Mix</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Tracks Grid / List / Mosaic */
                  <div className={`grid gap-6 ${displayMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : displayMode === 'mosaic' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
                    {isLoading ? (
                      <div className="col-span-full py-12 text-center text-gray-500">
                        Loading auditory library...
                      </div>
                    ) : filteredTracks.length === 0 ? (
                      <div className="col-span-full py-12 text-center text-gray-500">
                        No tracks found matching criteria.
                      </div>
                    ) : (
                      filteredTracks.map((track) => {
                        const isFav = favoriteTrackIds.includes(track.id);
                        const isThisPlaying = currentTrack?.id === track.id && isPlaying;
                        return (
                          <div
                            key={track.id}
                            onClick={() => handlePlayTrack(track)}
                            className={`group relative bg-white border border-gray-200 rounded-[2rem] overflow-hidden hover:border-indigo-400 hover:shadow-lg transition-all cursor-pointer ${displayMode === 'list' ? 'flex items-center p-4' : 'p-3'}`}
                          >
                            <div className={`relative overflow-hidden rounded-[1.5rem] ${displayMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-square mb-4'}`}>
                              <img src={track.cover} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-xl">
                                  {isThisPlaying ? (
                                    <Pause fill="black" size={20} />
                                  ) : (
                                    <Play fill="black" size={20} className="ml-1" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className={`${displayMode === 'list' ? 'ml-6 flex-grow' : 'px-2 pb-2'}`}>
                              <div className="flex justify-between items-start">
                                <div className="pr-2">
                                  <h3 className="text-base font-bold text-gray-900 truncate">{track.title}</h3>
                                  <p className="text-xs text-gray-500 font-medium">{track.artist}</p>
                                  <span className="inline-block mt-1 text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                                    {track.genre}
                                  </span>
                                </div>
                                <button
                                  onClick={(e) => handleToggleFavorite(e, track.id)}
                                  className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${isFav ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                                  title={isFav ? 'Remove Favorite' : 'Add Favorite'}
                                >
                                  <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                                </button>
                              </div>

                              <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-gray-500">
                                <span className="flex items-center"><Play size={10} className="mr-1" /> {(track.plays || 0).toLocaleString()}</span>
                                <span>{formatDuration(track.duration)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </main>
            </div>
          </div>

          {/* Right Sidebar Widgets */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MusicalNoteIcon className="h-5 w-5 text-purple-600 mr-2" />
                FIC Wallet & Tokens
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button
                  onClick={() => showToast('Wallet Top-up ready', 'info')}
                  className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-lg hover:from-purple-700 hover:to-pink-700 shadow-sm"
                >
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Platform Media Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => showToast('Creator track upload modal active', 'info')}
                  className="w-full text-left px-4 py-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors flex items-center text-sm font-semibold text-gray-800"
                >
                  <MusicalNoteIcon className="h-5 w-5 text-purple-600 mr-3" />
                  Upload Original Track
                </button>
                <button
                  onClick={() => setShowCreatePlaylistModal(true)}
                  className="w-full text-left px-4 py-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors flex items-center text-sm font-semibold text-gray-800"
                >
                  <ListMusic className="h-5 w-5 text-indigo-600 mr-3" />
                  Create Playlist
                </button>
                <button
                  onClick={() => showToast('Premium Lossless Audio Unlocked', 'success')}
                  className="w-full text-left px-4 py-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors flex items-center text-sm font-semibold text-gray-800"
                >
                  <ShieldCheck className="h-5 w-5 text-emerald-600 mr-3" />
                  Upgrade to Beatwave Pro
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Floating Mini Player Bar */}
        {currentTrack && (
          <div className="fixed bottom-6 left-6 right-6 bg-gray-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl z-40">
            <div className="flex items-center space-x-4 w-1/4">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block truncate">
                <h4 className="text-sm font-bold text-white uppercase tracking-tight truncate">{currentTrack.title}</h4>
                <p className="text-[11px] text-gray-400 font-semibold truncate">{currentTrack.artist}</p>
              </div>
            </div>

            <div className="flex flex-col items-center flex-grow max-w-xl px-4">
              <div className="flex items-center space-x-8 mb-2">
                <button
                  onClick={() => showToast('Previous track', 'info')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <SkipBack size={20} />
                </button>
                <button
                  onClick={() => handlePlayTrack(currentTrack)}
                  className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-md"
                >
                  {isPlaying ? <Pause fill="black" size={22} /> : <Play fill="black" size={22} className="ml-1" />}
                </button>
                <button
                  onClick={() => showToast('Next track', 'info')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <SkipForward size={20} />
                </button>
              </div>
              <div className="w-full flex items-center space-x-3">
                <span className="text-[10px] font-mono text-gray-400">{formatDuration(currentTime)}</span>
                <div className="flex-grow h-1.5 bg-white/20 rounded-full relative overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (currentTime / (duration || 180)) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-mono text-gray-400">{formatDuration(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 w-1/4">
              <div className="hidden md:flex items-center space-x-3">
                <Volume2 size={18} className="text-gray-400" />
                <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-indigo-500 rounded-full"></div>
                </div>
              </div>
              <button
                onClick={(e) => handleToggleFavorite(e, currentTrack.id)}
                className={`p-2 rounded-full hover:bg-white/10 ${favoriteTrackIds.includes(currentTrack.id) ? 'text-red-500' : 'text-gray-400'}`}
              >
                <Heart size={20} fill={favoriteTrackIds.includes(currentTrack.id) ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className="text-gray-400 hover:text-white p-2"
                title="View Playlists"
              >
                <ListMusic size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Create Playlist Modal */}
        {showCreatePlaylistModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Create New Playlist</h3>
                <button onClick={() => setShowCreatePlaylistModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreatePlaylistSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Playlist Title</label>
                  <input
                    type="text"
                    required
                    value={newPlaylistTitle}
                    onChange={(e) => setNewPlaylistTitle(e.target.value)}
                    placeholder="e.g. Afrobeats Chill Mix"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                  <textarea
                    value={newPlaylistDesc}
                    onChange={(e) => setNewPlaylistDesc(e.target.value)}
                    placeholder="Brief description of your playlist..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none rows={3}"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreatePlaylistModal(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showSettingsModal && <DanciaAppSettings onClose={() => setShowSettingsModal(false)} />}
      </div>
    </MainLayout>
  );
};

export default BeatwaveNGPage;

