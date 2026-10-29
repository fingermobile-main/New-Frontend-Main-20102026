import React, { useState } from 'react';
import { Music, ListMusic, Clock, MoreVertical, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  album?: string;
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  createdAt: string;
}

interface BeatwavePlaylistProps {
  playlists?: Playlist[];
  onPlayTrack?: (track: Track) => void;
  onEditPlaylist?: (playlistId: string) => void;
  onDeletePlaylist?: (playlistId: string) => void;
  onCreatePlaylist?: () => void;
}

const BeatwavePlaylist: React.FC<BeatwavePlaylistProps> = ({
  playlists: propPlaylists,
  onPlayTrack,
  onEditPlaylist,
  onDeletePlaylist,
  onCreatePlaylist
}) => {
  const defaultPlaylists: Playlist[] = [
    {
      id: '1',
      name: 'My Favorites',
      description: 'All my favorite tracks in one place',
      createdAt: '2026-01-15',
      tracks: [
        { id: 't1', title: 'Summer Vibes', artist: 'DJ Cool', duration: '3:45' },
        { id: 't2', title: 'Night Drive', artist: 'Synthwave Master', duration: '4:20' },
        { id: 't3', title: 'Ocean Waves', artist: 'Chill Beats', duration: '3:15' }
      ]
    },
    {
      id: '2',
      name: 'Workout Mix',
      description: 'High energy tracks for gym sessions',
      createdAt: '2026-02-20',
      tracks: [
        { id: 't4', title: 'Power Up', artist: 'Energy Boost', duration: '3:30' },
        { id: 't5', title: 'Beast Mode', artist: 'Gym Tracks', duration: '4:00' }
      ]
    }
  ];

  const [playlistList, setPlaylistList] = useState<Playlist[]>(propPlaylists || defaultPlaylists);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  const playlists = propPlaylists || playlistList;

  const handleCreateNew = () => {
    if (onCreatePlaylist) {
      onCreatePlaylist();
      return;
    }
    if (!newPlaylistName.trim()) return;
    const newEntry: Playlist = {
      id: `pl-${Date.now()}`,
      name: newPlaylistName.trim(),
      description: newPlaylistDesc.trim() || 'Custom BeatwaveNG playlist',
      createdAt: new Date().toISOString().split('T')[0],
      tracks: []
    };
    setPlaylistList(prev => [newEntry, ...prev]);
    setNewPlaylistName('');
    setNewPlaylistDesc('');
    setIsCreating(false);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ListMusic className="h-6 w-6 text-slate-800" />
          My Playlists
        </h2>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            if (onCreatePlaylist) {
              onCreatePlaylist();
            } else {
              setIsCreating(prev => !prev);
            }
          }}
        >
          <Music className="h-4 w-4 mr-2" />
          {isCreating ? 'Cancel' : 'New Playlist'}
        </Button>
      </div>

      {isCreating && (
        <div className="p-4 bg-white rounded-xl border border-slate-300 shadow-md space-y-3">
          <h3 className="text-sm font-black text-slate-900">Create New BeatwaveNG Playlist</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist name (e.g., Afro-Fusion Energy)..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              value={newPlaylistDesc}
              onChange={(e) => setNewPlaylistDesc(e.target.value)}
              placeholder="Description (optional)..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 text-slate-900 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleCreateNew}
              disabled={!newPlaylistName.trim()}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Save Playlist
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-slate-900">{playlist.name}</CardTitle>
                  {playlist.description && (
                    <p className="text-sm text-slate-700 mt-1">
                      {playlist.description}
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Options for playlist ${playlist.name}`}
                      onClick={(e) => { e.stopPropagation(); }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditPlaylist?.(playlist.id)}>
                      Edit Playlist
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeletePlaylist?.(playlist.id)}
                      className="text-red-600"
                    >
                      Delete Playlist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {playlist.tracks.slice(0, 3).map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-slate-100/60 cursor-pointer group"
                    onClick={() => onPlayTrack?.(track)} role="button" tabIndex={0}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Music className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 truncate">{track.title}</p>
                        <p className="text-xs text-slate-700 truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-slate-600" />
                      <span className="text-xs text-slate-700 font-medium">
                        {track.duration}
                      </span>
                    </div>
                  </div>
                ))}
                {playlist.tracks.length > 3 && (
                  <p className="text-xs text-slate-700 font-medium text-center pt-2">
                    +{playlist.tracks.length - 3} more tracks
                  </p>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-700">
                <Badge variant="secondary">{playlist.tracks.length} tracks</Badge>
                <span>Created {new Date(playlist.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BeatwavePlaylist;
