import React, { useState, useEffect } from 'react';
import { useAppContext } from './AppContext';
import { api } from '../services/api';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverArt?: string;
  url: string;
  plays?: number;
  likes?: number;
  dislikes?: number;
  genre?: string;
  year?: number;
  trackNumber?: number;
  writer?: string;
  producer?: string;
  explicit?: boolean;
  bpm?: number;
  key?: string;
  createdAt?: string;
  authorId?: string;
  isSaved?: boolean;
  isLiked?: boolean;
}

interface Playlist {
  id: string;
  title: string;
  description?: string;
  tracks: Track[];
  coverArt?: string;
  owner: string;
}

interface Artist {
  id: string;
  name: string;
  bio?: string;
  coverArt?: string;
  followers?: number;
}

interface Album {
  id: string;
  title: string;
  artist: string;
  year: number;
  tracks: Track[];
  coverArt?: string;
}

interface AmeboHistoryItem {
  id: string;
  memberId: string;
  action: string;
  targetId: string;
  targetType: string;
  timestamp: string;
}

interface BeatwaveNGContextType {
  tracks: Track[];
  playlists: Playlist[];
  artists: Artist[];
  albums: Album[];
  currentTrack: Track | null;
  isPlaying: boolean;
  playbackTime: number;
  volume: number;
  loading: boolean;
  error: string | null;
  ameboHistory: AmeboHistoryItem[];
  recentlyPlayed: Track[];
  queue: Track[];
  currentQueueIndex: number;

  playTrack: (track: Track, queue?: Track[]) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  stopTrack: () => void;
  seekTrack: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  searchBeatwaveNG: (query: string) => Promise<void>;
  addTrackToPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  createPlaylist: (name: string) => Promise<void>;
  likeTrack: (trackId: string) => Promise<void>;
  saveTrack: (trackId: string) => Promise<void>;
  getRecommendedTracks: (memberId: string) => Promise<Track[]>;
  getTrendingTracks: () => Promise<Track[]>;
  getArtistById: (artistId: string) => Promise<Artist>;
  getAlbumById: (albumId: string) => Promise<Album>;
  addToAmeboHistory: (action: Omit<AmeboHistoryItem, 'id'>) => void;
  getAmeboHistory: () => AmeboHistoryItem[];
  getRecentlyPlayed: () => Track[];
}

const BeatwaveNGContext = React.createContext<BeatwaveNGContextType | undefined>(
  undefined,
);

interface BeatwaveNGProviderProps {
  children: React.ReactNode;
}

export const BeatwaveNGProvider: React.FC<BeatwaveNGProviderProps> = ({
  children
}) => {
  const { showToast } = useAppContext();
  const [tracks, setTracks] = React.useState<Track[]>([]);
  const [playlists, setPlaylists] = React.useState<Playlist[]>([]);
  const [artists, setArtists] = React.useState<Artist[]>([]);
  const [albums, setAlbums] = React.useState<Album[]>([]);
  const [currentTrack, setCurrentTrack] = React.useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = React.useState<number>(0);
  const [volume, setVolume] = React.useState<number>(80);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [ameboHistory, setAmeboHistory] = React.useState<AmeboHistoryItem[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = React.useState<Track[]>([]);
  const [queue, setQueue] = React.useState<Track[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = React.useState<number>(-1);

  const addToAmeboHistory = React.useCallback((action: Omit<AmeboHistoryItem, 'id'>) => {
    const newAction: AmeboHistoryItem = {
      ...action,
      id: Date.now().toString()
    };
    setAmeboHistory((prev) => [newAction, ...prev].slice(0, 50));
  }, []);

  React.useEffect(() => {
    const fetchBeatwaveNGData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          tracksResponse,
          playlistsResponse,
          artistsResponse,
          albumsResponse
        ] = await Promise.allSettled([
          api.get('/beatwaveNG/tracks'),
          api.get('/beatwaveNG/playlists'),
          api.get('/beatwaveNG/artists'),
          api.get('/beatwaveNG/albums')
        ]);

        if (tracksResponse.status === 'fulfilled') {
          setTracks(tracksResponse.value.data || []);
        } else {
          showToast('Failed to fetch tracks', 'error');
          setTracks([
            {
              id: '1',
              title: 'Summer Vibes',
              artist: 'DJ Pulse',
              album: 'Beach Party',
              duration: 225,
              coverArt: '',
              url: '',
              plays: 1200,
              likes: 240,
              dislikes: 5,
              genre: 'Electronic',
              year: 2023,
              trackNumber: 1,
              writer: 'DJ Pulse',
              producer: 'Sound Master',
              explicit: false,
              bpm: 128,
              key: 'Am',
              createdAt: new Date().toISOString(),
              authorId: 'author1',
              isSaved: false,
              isLiked: false
            }
          ]);
        }

        if (playlistsResponse.status === 'fulfilled') {
          setPlaylists(playlistsResponse.value.data || []);
        } else {
          showToast('Failed to fetch playlists', 'error');
          setPlaylists([]);
        }

        if (artistsResponse.status === 'fulfilled') {
          setArtists(artistsResponse.value.data || []);
        } else {
          showToast('Failed to fetch artists', 'error');
          setArtists([]);
        }

        if (albumsResponse.status === 'fulfilled') {
          setAlbums(albumsResponse.value.data || []);
        } else {
          showToast('Failed to fetch albums', 'error');
          setAlbums([]);
        }
      } catch {
        setError('Failed to load BeatwaveNG data');
        showToast('Failed to load BeatwaveNG data', 'error');
      } finally {
        setLoading(false);
      }
    };

    void fetchBeatwaveNGData();
  }, [showToast]);

  const playTrack = React.useCallback((track: Track, suppliedQueue?: Track[]) => {
    setCurrentTrack(track);
    setIsPlaying(true);

    if (suppliedQueue && suppliedQueue.length > 0) {
      setQueue(suppliedQueue);
      const trackIndex = suppliedQueue.findIndex(t => t.id === track.id);
      setCurrentQueueIndex(trackIndex >= 0 ? trackIndex : 0);
    } else if (!suppliedQueue && currentTrack?.id !== track.id) {
      setQueue([track]);
      setCurrentQueueIndex(0);
    }

    setRecentlyPlayed(prev => {
      const existingIndex = prev.findIndex(t => t.id === track.id);
      if (existingIndex > -1) {
        const newRecentlyPlayed = [...prev];
        newRecentlyPlayed.splice(existingIndex, 1);
        return [track, ...newRecentlyPlayed.slice(0, 9)];
      }
      return [track, ...prev.slice(0, 9)];
    });

    addToAmeboHistory({
      memberId: '',
      action: 'play',
      targetId: track.id,
      targetType: 'track',
      timestamp: new Date().toISOString()
    });
  }, [currentTrack, addToAmeboHistory]);

  const pauseTrack = React.useCallback(() => setIsPlaying(false), []);

  const resumeTrack = React.useCallback(() => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const stopTrack = React.useCallback(() => {
    setCurrentTrack(null);
    setIsPlaying(false);
    setPlaybackTime(0);
  }, []);

  const seekTrack = React.useCallback((time: number) => setPlaybackTime(time), []);

  const setVolumeLevel = React.useCallback((level: number) =>
    setVolume(Math.max(0, Math.min(100, level))), []);

  const toggleMute = React.useCallback(() => {
    setVolume(prev => (prev === 0 ? 80 : 0));
  }, []);

  const setPlaybackRate = React.useCallback((_rate: number) => {
    // This framework handles operations directly on downstream native audio abstractions
  }, []);

  const playNext = React.useCallback(() => {
    if (queue.length === 0 || currentQueueIndex === -1) return;

    const nextIndex = currentQueueIndex + 1;
    if (nextIndex < queue.length) {
      setCurrentQueueIndex(nextIndex);
      setCurrentTrack(queue[nextIndex]);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      setCurrentQueueIndex(-1);
    }
  }, [queue, currentQueueIndex]);

  const playPrevious = React.useCallback(() => {
    if (queue.length === 0 || currentQueueIndex === -1) return;

    const prevIndex = currentQueueIndex - 1;
    if (prevIndex >= 0) {
      setCurrentQueueIndex(prevIndex);
      setCurrentTrack(queue[prevIndex]);
      setIsPlaying(true);
    }
  }, [queue, currentQueueIndex]);

  const searchBeatwaveNG = React.useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(
        `/beatwaveNG/search?q=${encodeURIComponent(query)}`,
      );
      setTracks(response.data.tracks || []);
    } catch {
      setError('Search failed');
      showToast('Search failed', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const addTrackToPlaylist = React.useCallback(async (playlistId: string, trackId: string) => {
    try {
      await api.post(`/beatwaveNG/playlists/${playlistId}/tracks`, {
        trackId
      });

      setPlaylists((prev) =>
        prev.map((playlist) =>
          playlist.id === playlistId
            ? {
              ...playlist,
              tracks: [
                ...playlist.tracks,
                  tracks.find((t) => t.id === trackId)!
              ]
            }
            : playlist,
        ),
      );
    } catch {
      setError('Failed to add track to playlist');
      showToast('Failed to add track to playlist', 'error');
    }
  }, [tracks, showToast]);

  const createPlaylist = React.useCallback(async (name: string) => {
    try {
      const response = await api.post('/beatwaveNG/playlists', { name });
      setPlaylists((prev) => [...prev, response.data]);
      showToast('Playlist created successfully', 'success');
    } catch {
      setError('Failed to create playlist');
      showToast('Failed to create playlist', 'error');
    }
  }, [showToast]);

  const likeTrack = React.useCallback(async (trackId: string) => {
    let previousTracks: Track[] = [];
    let previousCurrentTrack: Track | null = null;

    try {
      setTracks((prev) => {
        previousTracks = prev;
        return prev.map((track) =>
          track.id === trackId
            ? {
              ...track,
              likes: track.isLiked ? (track.likes || 0) - 1 : (track.likes || 0) + 1,
              isLiked: !track.isLiked
            }
            : track,
        );
      });

      setCurrentTrack((prev) => {
        previousCurrentTrack = prev;
        if (prev && prev.id === trackId) {
          return {
            ...prev,
            likes: prev.isLiked ? (prev.likes || 0) - 1 : (prev.likes || 0) + 1,
            isLiked: !prev.isLiked
          };
        }
        return prev;
      });

      await api.post(`/beatwaveNG/tracks/${trackId}/like`);
    } catch {
      if (previousTracks.length > 0) setTracks(previousTracks);
      if (previousCurrentTrack) setCurrentTrack(previousCurrentTrack);

      setError('Failed to like track');
      showToast('Failed to update like status', 'error');
    }
  }, [showToast]);

  const saveTrack = React.useCallback(async (trackId: string) => {
    let previousTracks: Track[] = [];
    let previousCurrentTrack: Track | null = null;

    try {
      setTracks((prev) => {
        previousTracks = prev;
        return prev.map((track) =>
          track.id === trackId ? { ...track, isSaved: !track.isSaved } : track,
        );
      });

      setCurrentTrack((prev) => {
        previousCurrentTrack = prev;
        if (prev && prev.id === trackId) {
          return { ...prev, isSaved: !prev.isSaved };
        }
        return prev;
      });

      await api.post(`/beatwaveNG/tracks/${trackId}/save`);
    } catch {
      if (previousTracks.length > 0) setTracks(previousTracks);
      if (previousCurrentTrack) setCurrentTrack(previousCurrentTrack);

      setError('Failed to save track');
      showToast('Failed to update save status', 'error');
    }
  }, [showToast]);

  const getRecommendedTracks = React.useCallback(async (memberId: string): Promise<Track[]> => {
    try {
      const response = await api.get(`/beatwaveNG/recommended/${memberId}`);
      return response.data;
    } catch {
      showToast('Failed to fetch recommendations', 'error');
      return [];
    }
  }, [showToast]);

  const getTrendingTracks = React.useCallback(async (): Promise<Track[]> => {
    try {
      const response = await api.get('/beatwaveNG/trending');
      return response.data;
    } catch {
      showToast('Failed to fetch trending tracks', 'error');
      return [];
    }
  }, [showToast]);

  const getArtistById = React.useCallback(async (artistId: string): Promise<Artist> => {
    try {
      const response = await api.get(`/beatwaveNG/artists/${artistId}`);
      return response.data;
    } catch (err) {
      showToast('Failed to fetch artist details', 'error');
      throw err;
    }
  }, [showToast]);

  const getAlbumById = React.useCallback(async (albumId: string): Promise<Album> => {
    try {
      const response = await api.get(`/beatwaveNG/albums/${albumId}`);
      return response.data;
    } catch (err) {
      showToast('Failed to fetch album details', 'error');
      throw err;
    }
  }, [showToast]);

  const getAmeboHistory = React.useCallback((): AmeboHistoryItem[] => ameboHistory, [ameboHistory]);
  const getRecentlyPlayed = React.useCallback((): Track[] => recentlyPlayed, [recentlyPlayed]);

  const contextValue = React.useMemo(
    () => ({
      tracks,
      playlists,
      artists,
      albums,
      currentTrack,
      isPlaying,
      playbackTime,
      volume,
      loading,
      error,
      ameboHistory,
      recentlyPlayed,
      queue,
      currentQueueIndex,

      playTrack,
      pauseTrack,
      resumeTrack,
      stopTrack,
      seekTrack,
      setVolume: setVolumeLevel,
      toggleMute,
      setPlaybackRate,
      playNext,
      playPrevious,
      searchBeatwaveNG,
      addTrackToPlaylist,
      createPlaylist,
      likeTrack,
      saveTrack,
      getRecommendedTracks,
      getTrendingTracks,
      getArtistById,
      getAlbumById,
      addToAmeboHistory,
      getAmeboHistory,
      getRecentlyPlayed
    }),
    [
      tracks,
      playlists,
      artists,
      albums,
      currentTrack,
      isPlaying,
      playbackTime,
      volume,
      loading,
      error,
      ameboHistory,
      recentlyPlayed,
      queue,
      currentQueueIndex,
      playTrack,
      pauseTrack,
      resumeTrack,
      stopTrack,
      seekTrack,
      setVolumeLevel,
      toggleMute,
      setPlaybackRate,
      playNext,
      playPrevious,
      searchBeatwaveNG,
      addTrackToPlaylist,
      createPlaylist,
      likeTrack,
      saveTrack,
      getRecommendedTracks,
      getTrendingTracks,
      getArtistById,
      getAlbumById,
      addToAmeboHistory,
      getAmeboHistory,
      getRecentlyPlayed
    ],
  );

  return (
    <BeatwaveNGContext.Provider value={contextValue}>
      {children}
    </BeatwaveNGContext.Provider>
  );
};

export const useBeatwaveNG = (): BeatwaveNGContextType => {
  const context = React.useContext(BeatwaveNGContext);
  if (context === undefined) {
    throw new Error('useBeatwaveNG must be used within a BeatwaveNGProvider');
  }
  return context;
};

export type UseBeatwaveNGResult = BeatwaveNGContextType;
export default BeatwaveNGContext;
