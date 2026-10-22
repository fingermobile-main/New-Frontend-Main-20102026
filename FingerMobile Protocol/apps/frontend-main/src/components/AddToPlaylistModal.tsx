import React, { useState } from 'react';
import { Plus, Music, ListMusic, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/Dialog';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
}

interface Playlist {
  id: string;
  name: string;
  trackCount: number;
}

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  track?: Track;
  playlists?: Playlist[];
  onCreatePlaylist?: (name: string) => void;
  onAddToPlaylist?: (playlistId: string, trackId: string) => void;
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  track,
  playlists: propPlaylists,
  onCreatePlaylist,
  onAddToPlaylist
}) => {
  const [selectedPlaylists, setSelectedPlaylists] = React.useState<string[]>([]);
  const [newPlaylistName, setNewPlaylistName] = React.useState('');
  const [showCreateForm, setShowCreateForm] = React.useState(false);

  const defaultPlaylists: Playlist[] = [
    { id: '1', name: 'Favorites', trackCount: 45 },
    { id: '2', name: 'Workout Mix', trackCount: 32 },
    { id: '3', name: 'Chill Vibes', trackCount: 28 },
    { id: '4', name: 'Road Trip', trackCount: 56 }
  ];

  const playlists = propPlaylists || defaultPlaylists;

  const handleTogglePlaylist = (playlistId: string) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      onCreatePlaylist?.(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowCreateForm(false);
    }
  };

  const handleAddSelected = () => {
    if (track) {
      selectedPlaylists.forEach((playlistId) => {
        onAddToPlaylist?.(playlistId, track.id);
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900 font-bold">
            <ListMusic className="h-5 w-5 text-slate-700" />
            Add to Playlist
          </DialogTitle>
          <DialogDescription className="text-slate-700">
            {track && (
              <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="font-semibold text-slate-900">{track.title}</p>
                <p className="text-sm text-slate-700 font-medium">{track.artist}</p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {!showCreateForm ? (
            <Button
              variant="outline"
              className="w-full text-slate-800 font-semibold border-slate-300"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Playlist
            </Button>
          ) : (
            <div className="space-y-2 p-4 border border-slate-200 rounded-lg">
              <Label htmlFor="new-playlist" className="text-slate-900 font-semibold">Playlist Name</Label>
              <div className="flex gap-2">
                <Input
                  id="new-playlist"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Enter playlist name..."
                  autoFocus
                />
                <Button onClick={handleCreatePlaylist}>Create</Button>
                <Button type="button" aria-label="Close" variant="ghost" size="icon" onClick={() => setShowCreateForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-slate-900 font-semibold">Your Playlists</Label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Checkbox
                    id={playlist.id}
                    checked={selectedPlaylists.includes(playlist.id)}
                    onCheckedChange={() => handleTogglePlaylist(playlist.id)}
                  />
                  <label
                    htmlFor={playlist.id}
                    className="flex-1 cursor-pointer"
                    onClick={() => handleTogglePlaylist(playlist.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4 text-slate-500" />
                      <span className="font-semibold text-slate-900">{playlist.name}</span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium">
                      {playlist.trackCount} tracks
                    </p>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddSelected}
            disabled={selectedPlaylists.length === 0}
          >
            Add to {selectedPlaylists.length} Playlist{selectedPlaylists.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToPlaylistModal;
