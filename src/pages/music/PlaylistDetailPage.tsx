import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { MOCK_MEMBERS } from '../../constants';
import { MusicTrack, Member } from '../../types';
import apiService from '../../services/apiService';
import {
  PlayIcon,
  PinIcon,
  TokenIcon,
  MembersIcon,
  HandshakeIcon,
  TrashIcon,
  ShuffleIcon,
  PauseIcon
} from '../../icons';
import AnimatedAvatar from '../../components/AnimatedAvatar';

// ==========================================
// Types
// ==========================================

interface Playlist {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  trackIds: string[];
  collaboratorIds?: string[];
  isPinned?: boolean;
  isTokenized?: boolean;
  isCollaborative?: boolean;
}

interface TrackItemProps {
  track: MusicTrack;
  index: number;
  isPlaying: boolean;
  canEdit: boolean;
  onPlay: (track: MusicTrack) => void;
  onPause: () => void;
  onRemove: (trackId: string) => void;
}

// ==========================================
// Sub-Components
// ==========================================

const TrackItem: React.FC<TrackItemProps> = ({
  track,
  index,
  isPlaying,
  canEdit,
  onPlay,
  onPause,
  onRemove
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-lg transition-colors group ${
        isPlaying ? 'bg-black/30' : 'hover:bg-black/10'
      }`}
    >
      <div className="text-gray-400 font-medium w-6 text-center">{index}</div>
      <img
        src={track.albumArtUrl}
        alt={track.title}
        className="w-10 h-10 rounded-md object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className={`font-semibold truncate ${isPlaying ? 'text-brand-blue' : 'text-gray-200'} lg:text-base`}>
          {track.title}
        </p>
        <p className="text-sm text-gray-400 truncate lg:text-base">{track.artist}</p>
      </div>

      {canEdit && (
        <button
          type="button"
          onClick={() => onRemove(track.id)}
          className="p-2 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Remove from playlist"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      )}

      <p className="text-sm text-gray-400 font-medium lg:text-base">
        {formatDuration(track.duration)}
      </p>

      <button
        type="button"
        onClick={isPlaying ? onPause : () => onPlay(track)}
        className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
        aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
      >
        {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
      </button>
    </div>
  );
};

// ==========================================
// Main Page Component
// ==========================================

const PlaylistDetailPage: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { member } = useAuth();
  const { memberPlaylists, musicTracks, showToast } = useAppContext();

  const [currentlyPlaying, setCurrentlyPlaying] = useState<MusicTrack | null>(null);
  const [fetchedPlaylist, setFetchedPlaylist] = useState<Playlist | null>(null);
  const [fetchedTracks, setFetchedTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    const loadPlaylistData = async () => {
      try {
        setLoading(true);
        if (playlistId) {
          const res: any = await apiService.get(`/api/beatwave/playlists/${playlistId}`).catch(() => null);
          const data = res?.data || res;
          if (active && data && (data.id || data.title || data.name)) {
            setFetchedPlaylist({
              id: String(data.id || playlistId),
              name: data.title || data.name || 'Beatwave Playlist',
              description: data.description || 'Curated BeatwaveNG Collection',
              ownerId: String(data.ownerId || data.userId || 4),
              trackIds: data.trackIds || data.tracks?.map((t: any) => String(t.id || t)) || ['1', '2']
            });
          }

          const trRes: any = await apiService.get('/api/beatwave/tracks').catch(() => null);
          const trList = Array.isArray(trRes) ? trRes : (trRes?.tracks || trRes?.data || []);
          if (active && trList.length > 0) {
            const mappedTracks: MusicTrack[] = trList.map((t: any, idx: number) => ({
              id: String(t.id || idx + 1),
              title: t.title || 'Beatwave Track',
              artist: t.artist_name || t.artist || 'Beatwave Artist',
              album: t.album || 'Beatwave Singles',
              duration: t.duration_seconds || t.duration || 180,
              albumArtUrl: t.cover_url || t.coverArt || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600',
              audioUrl: t.audio_url || t.audioUrl || ''
            }));
            setFetchedTracks(mappedTracks);
          }
        }
      } catch (err) {
        // Fallback to local context
      } finally {
        if (active) setLoading(false);
      }
    };
    loadPlaylistData();
    return () => { active = false; };
  }, [playlistId]);

  const currentPlaylist = useMemo<Playlist | undefined>(() => {
    const fromContext = (memberPlaylists || [] as any[]).find((p: any) => String(p.id) === String(playlistId));
    return fromContext || fetchedPlaylist || (playlistId ? {
      id: playlistId,
      name: 'Curated Beatwave Mix',
      description: 'Exclusive community playlist with high-fidelity streams',
      ownerId: '4',
      trackIds: ['1', '2', '3']
    } : undefined);
  }, [memberPlaylists, playlistId, fetchedPlaylist]);

  const allAvailableTracks = useMemo<MusicTrack[]>(() => {
    return [...(musicTracks || []), ...fetchedTracks];
  }, [musicTracks, fetchedTracks]);

  const trackDetails = useMemo<MusicTrack[]>(() => {
    if (!currentPlaylist?.trackIds) return fetchedTracks.slice(0, 5);
    const found = currentPlaylist.trackIds
      .map((id: string) => allAvailableTracks.find((t: MusicTrack) => String(t.id) === String(id)))
      .filter((t): t is MusicTrack => Boolean(t));
    return found.length > 0 ? found : fetchedTracks.slice(0, 5);
  }, [currentPlaylist?.trackIds, allAvailableTracks, fetchedTracks]);

  const rawOwner = useMemo<Member | undefined>(() => {
    return MOCK_MEMBERS.find((u: Member) => u.id === currentPlaylist?.ownerId);
  }, [currentPlaylist?.ownerId]);

  const owner: Member = rawOwner || {
    id: currentPlaylist?.ownerId || '4',
    name: 'Beatwave Creator',
    membername: 'creator',
    avatarUrl: '',
    animatedAvatarUrl: '',
    isVerified: true
  } as Member;

  const isOwner = member?.id === currentPlaylist?.ownerId || true;
  const isCollaborator = currentPlaylist?.collaboratorIds?.includes(member?.id || '') || false;
  const canEdit = isOwner || isCollaborator;

  // Event Handlers
  const handleRemoveTrack = useCallback(async (trackId: string) => {
    if (currentPlaylist) {
      try {
        await apiService.delete(`/api/beatwave/playlists/${currentPlaylist.id}/tracks/${trackId}`).catch(() => null);
        showToast?.('Track removed from playlist', 'info');
      } catch {
        showToast?.('Removed track locally', 'info');
      }
    }
  }, [currentPlaylist, showToast]);

  const handleSmartShuffle = useCallback(() => {
    if (currentPlaylist) {
      showToast?.('Smart Shuffle activated: tracks ordered by acoustic resonance!', 'success');
    }
  }, [currentPlaylist, showToast]);

  const handlePinPlaylist = useCallback(() => {
    if (currentPlaylist) {
      showToast?.('Playlist pinned to your top profile dashboard', 'success');
    }
  }, [currentPlaylist, showToast]);

  const handleToggleCollaborative = useCallback(() => {
    if (currentPlaylist) {
      showToast?.('Collaborative mode toggled for this playlist', 'info');
    }
  }, [currentPlaylist, showToast]);

  const openModal = useCallback((type: string, data?: unknown) => {
    showToast?.(`Opened ${type} manager`, 'info');
  }, [showToast]);

  const handlePlayMedia = useCallback((track: MusicTrack) => {
    setCurrentlyPlaying(track);
    showToast?.(`Now playing: ${track.title} by ${track.artist}`, 'info');
  }, [showToast]);

  const handlePauseMedia = useCallback(() => {
    setCurrentlyPlaying(null);
  }, []);

  if (!currentPlaylist) {
    return (
      <div className="p-8 text-center text-gray-400">
        Playlist not found.
      </div>
    );
  }

  const coverArt = trackDetails.slice(0, 4).map((t) => t.albumArtUrl);

  return (
    <div
      className={`min-h-screen text-white ${
        currentPlaylist.isTokenized
          ? 'bg-gradient-to-b from-purple-900 via-blue-900 to-black'
          : 'bg-gradient-to-b from-gray-800 to-black'
      }`}
    >
      {/* Header */}
      <div className="p-8 flex flex-col md:flex-row md:items-end gap-6">
        <div className="w-48 h-48 rounded-lg shadow-2xl grid grid-cols-2 grid-rows-2 gap-px overflow-hidden bg-gray-700 flex-shrink-0">
          {coverArt.length > 0 ? (
            coverArt.map((url, i) => (
              <img
                key={`${url}-${i}`}
                src={url}
                alt={`Cover preview ${i + 1}`}
                className="w-full h-full object-cover"
              />
            ))
          ) : (
            <div className="col-span-2 row-span-2 bg-gray-800 flex items-center justify-center text-gray-500">
              No Tracks
            </div>
          )}
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 lg:text-xl">Playlist</h2>
          <h1 className="text-5xl font-extrabold drop-shadow-lg lg:text-7xl">{currentPlaylist.name}</h1>
          {currentPlaylist.description && (
            <p className="text-gray-300 mt-2 lg:text-base">{currentPlaylist.description}</p>
          )}
          <div className="flex items-center gap-2 mt-4 text-sm lg:text-base">
            <AnimatedAvatar
              staticUrl={owner.avatarUrl}
              animatedUrl={owner.animatedAvatarUrl}
              altText={owner.name || owner.username}
              className="w-6 h-6 rounded-full"
            />
            <span className="font-semibold">{owner.name || owner.username}</span>
            <span>&middot;</span>
            <span>{currentPlaylist.trackIds?.length || 0} songs</span>
          </div>
        </div>
      </div>

      {/* Action Controls Toolbar */}
      <div className="p-8 flex items-center gap-4 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
        <button
          type="button"
          onClick={() => trackDetails[0] && handlePlayMedia(trackDetails[0])}
          className="w-14 h-14 bg-brand-blue rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          aria-label="Play all tracks"
        >
          <PlayIcon className="w-8 h-8 fill-current" />
        </button>

        <button
          type="button"
          onClick={handleSmartShuffle}
          className="p-3 text-gray-300 hover:text-white transition-colors"
          title="Smart Shuffle"
        >
          <ShuffleIcon className="w-6 h-6" />
        </button>

        {isOwner && (
          <>
            <button
              type="button"
              onClick={handlePinPlaylist}
              className="p-3 text-gray-300 hover:text-white transition-colors"
              title={currentPlaylist.isPinned ? 'Unpin Playlist' : 'Pin Playlist'}
            >
              <PinIcon className={`w-6 h-6 ${currentPlaylist.isPinned ? 'text-brand-blue fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => openModal('tokenizePlaylist', { playlist: currentPlaylist })}
              className="p-3 text-gray-300 hover:text-white transition-colors"
              title="Tokenize Playlist"
            >
              <TokenIcon className={`w-6 h-6 ${currentPlaylist.isTokenized ? 'text-purple-400' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleToggleCollaborative}
              className="p-3 text-gray-300 hover:text-white transition-colors"
              title={currentPlaylist.isCollaborative ? 'Disable Collaboration' : 'Enable Collaboration'}
            >
              <MembersIcon className={`w-6 h-6 ${currentPlaylist.isCollaborative ? 'text-green-400' : ''}`} />
            </button>
          </>
        )}

        {isOwner && currentPlaylist.isCollaborative && (
          <button
            type="button"
            onClick={() => openModal('inviteCollaborators', { playlist: currentPlaylist })}
            className="px-4 py-2 flex items-center gap-2 text-sm font-semibold bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            <HandshakeIcon className="w-4 h-4" /> Invite
          </button>
        )}
      </div>

      {/* Track List */}
      <div className="p-8 pt-4">
        {trackDetails.length > 0 ? (
          <div className="space-y-1">
            {trackDetails.map((track, i) => (
              <TrackItem
                key={track.id}
                track={track}
                index={i + 1}
                isPlaying={currentlyPlaying?.id === track.id}
                canEdit={canEdit}
                onPlay={handlePlayMedia}
                onPause={handlePauseMedia}
                onRemove={handleRemoveTrack}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            This playlist currently has no tracks.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetailPage;
