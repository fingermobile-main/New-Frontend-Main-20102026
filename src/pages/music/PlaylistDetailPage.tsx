import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { MOCK_MEMBERS } from '../../constants';
import { MusicTrack } from '../../types';
import { PlayIcon, PinIcon, TokenIcon, MembersIcon, HandshakeIcon, TrashIcon, ShuffleIcon, PauseIcon } from '../../icons';
import AnimatedAvatar from '../../components/AnimatedAvatar';

const PlaylistDetailPage = () => {
    const { playlistId } = useParams<{ playlistId: string }>();
   const { member } = useAuth();
    const { memberPlaylists, musicTracks } = useAppContext();

    const currentPlaylist = (memberPlaylists || []).find((p: any) => p.id === playlistId);

    const trackDetails = React.useMemo(() => {
        return currentPlaylist?.trackIds.map((id: string) => musicTracks.find((t: MusicTrack) => t.id === id)).filter(Boolean) as MusicTrack[] || [];
    }, [currentPlaylist?.trackIds, musicTracks]);

    const owner = React.useMemo(() => {
        return MOCK_MEMBERS.find((u: any) => u.id === currentPlaylist?.ownerId);
    }, [currentPlaylist?.ownerId]);

    const [currentlyPlaying, setCurrentlyPlaying] = React.useState<MusicTrack | null>(null);

    const handleRemoveTrackFromPlaylist = async (playlistId: string, trackId: string) => {
        console.info('Remove track from playlist:', playlistId, trackId);
    };

    const handleSmartShuffle = async (playlistId: string) => {
        console.info('Smart shuffle playlist:', playlistId);
    };

    const handlePinPlaylist = async (playlistId: string) => {
        console.info('Pin playlist:', playlistId);
    };

    const handleToggleCollaborativePlaylist = async (playlistId: string) => {
        console.info('Toggle collaborative playlist:', playlistId);
    };

    const openModal = (type: string, data?: unknown) => {
        console.info('Open modal:', type, data);
    };

    if (!currentPlaylist || !owner) {
        return <div className="p-8 text-center">Playlist not found.</div>;
    }

    const isOwner = member?.id === currentPlaylist.ownerId;
    const isCollaborator = currentPlaylist.collaboratorIds?.includes(member?.id || '') || false;
    const canEdit = isOwner || isCollaborator;

    const handlePlayMedia = (track: MusicTrack) => {
        setCurrentlyPlaying(track);
        // In a real app, this would trigger actual audio playback
        // console.info('Playing:', track.title);
    };

    const handlePauseMedia = () => {
        setCurrentlyPlaying(null);
        // console.info('Paused.');
    };

    const coverArt = trackDetails.slice(0, 4).map(t => t.albumArtUrl);
    
    const TrackItem: React.FC<{ track: MusicTrack, index: number }> = ({ track, index }) => {
        const isPlaying = currentlyPlaying?.id === track.id;
        return (
             <div className={`flex items-center gap-4 p-3 rounded-lg transition-colors group ${isPlaying ? 'bg-black/20' : 'hover:bg-black/10'}`}>
                <div className="text-gray-400 font-medium w-4">{index + 1}</div>
                <img src={track.albumArtUrl} alt={track.title} className="w-10 h-10 rounded-md object-cover" />
                <div className="flex-1">
                    <p className={`font-semibold ${isPlaying ? 'text-white' : 'text-gray-300'} lg:text-base`}>{track.title}</p>
                    <p className="text-sm text-gray-400 lg:text-base">{track.artist}</p>
                </div>
                 {canEdit && (
                    <button 
                        onClick={() => handleRemoveTrackFromPlaylist(currentPlaylist.id, track.id)}
                        className="p-2 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100"
                        title="Remove from playlist"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                )}
                <p className="text-sm text-gray-400 font-medium lg:text-base">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </p>
                <button 
                    onClick={isPlaying ? handlePauseMedia : () => handlePlayMedia(track)}
                    className="p-2 text-white hover:bg-white/20 rounded-full"
                    aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                >
                    {isPlaying ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6"/>}
                </button>
            </div>
        );
    };

    return (
        <div className={`min-h-screen ${currentPlaylist.isTokenized ? 'bg-gradient-to-b from-purple-900 via-blue-900 to-black' : 'bg-gradient-to-b from-gray-800 to-black'} text-white`}>
            {/* Header */}
            <div className="p-8 flex items-end gap-6">
                <div className="w-48 h-48 rounded-lg shadow-2xl grid grid-cols-2 grid-rows-2 gap-px overflow-hidden bg-gray-700">
                     {coverArt.map((url, i) => <img key={i} src={url} alt={`Playlist cover art ${i + 1}`} className="w-full h-full object-cover" />)}
                </div>
                <div>
                    <h2 className="text-sm font-bold uppercase lg:text-xl">Playlist</h2>
                    <h1 className="text-6xl font-extrabold drop-shadow-lg lg:text-7xl">{currentPlaylist.name}</h1>
                    <p className="text-gray-300 mt-2 lg:text-base">{currentPlaylist.description}</p>
                    <div className="flex items-center gap-2 mt-4 text-sm lg:text-base">
                        <AnimatedAvatar staticUrl={owner.avatarUrl} animatedUrl={owner.animatedAvatarUrl} altText={owner.name} className="w-6 h-6 rounded-full" />
                        <span className="font-semibold">{owner.name}</span>
                        <span>&middot;</span>
                        <span>{currentPlaylist.trackIds.length} songs</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="p-8 flex items-center gap-4 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
                <button className="w-14 h-14 bg-brand-blue rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                    <PlayIcon className="w-8 h-8"/>
                </button>
                 <button onClick={() => handleSmartShuffle(currentPlaylist.id)} className="p-3 text-gray-300 hover:text-white" title="Smart Shuffle">
                    <ShuffleIcon className="w-6 h-6" />
                </button>
                {isOwner && (
                    <>
                        <button onClick={() => handlePinPlaylist(currentPlaylist.id)} className="p-3 text-gray-300 hover:text-white" title={currentPlaylist.isPinned ? "Unpin Playlist" : "Pin Playlist"}>
                            <PinIcon className={`w-6 h-6 ${currentPlaylist.isPinned ? 'text-brand-blue fill-current' : ''}`} />
                        </button>
                         <button onClick={() => openModal('tokenizePlaylist', { playlist: currentPlaylist })} className="p-3 text-gray-300 hover:text-white" title="Tokenize Playlist">
                            <TokenIcon className={`w-6 h-6 ${currentPlaylist.isTokenized ? 'text-purple-400' : ''}`} />
                        </button>
                         <button onClick={() => handleToggleCollaborativePlaylist(currentPlaylist.id)} className="p-3 text-gray-300 hover:text-white" title={currentPlaylist.isCollaborative ? "Disable Collaboration" : "Enable Collaboration"}>
                            <MembersIcon className={`w-6 h-6 ${currentPlaylist.isCollaborative ? 'text-green-400' : ''}`} />
                        </button>
                    </>
                )}
                 {isOwner && currentPlaylist.isCollaborative && (
                    <button onClick={() => openModal('inviteCollaborators', { playlist: currentPlaylist })} className="px-4 py-2 flex items-center gap-2 text-sm font-semibold bg-white/10 rounded-full hover:bg-white/20">
                        <HandshakeIcon className="w-4 h-4" /> Invite
                    </button>
                )}
            </div>

            {/* Tracks */}
            <div className="p-8 pt-4">
                <div className="space-y-1">
                    {trackDetails.map((track, i) => (
                        <TrackItem key={track.id} track={track} index={i + 1} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlaylistDetailPage;
