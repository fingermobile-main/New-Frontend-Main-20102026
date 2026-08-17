import React, {} from 'react';
import { Music, ListMusic, Clock, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";

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
}

const BeatwavePlaylist: React.FC<BeatwavePlaylistProps> = ({
  playlists: propPlaylists,
  onPlayTrack,
  onEditPlaylist,
  onDeletePlaylist
}) => {
  const defaultPlaylists: Playlist[] = [
    {
      id: "1",
      name: "My Favorites",
      description: "All my favorite tracks in one place",
      createdAt: "2026-01-15",
      tracks: [
        { id: "t1", title: "Summer Vibes", artist: "DJ Cool", duration: "3:45" },
        { id: "t2", title: "Night Drive", artist: "Synthwave Master", duration: "4:20" },
        { id: "t3", title: "Ocean Waves", artist: "Chill Beats", duration: "3:15" }
      ]
    },
    {
      id: "2",
      name: "Workout Mix",
      description: "High energy tracks for gym sessions",
      createdAt: "2026-02-20",
      tracks: [
        { id: "t4", title: "Power Up", artist: "Energy Boost", duration: "3:30" },
        { id: "t5", title: "Beast Mode", artist: "Gym Tracks", duration: "4:00" }
      ]
    }
  ];

  const playlists = propPlaylists || defaultPlaylists;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ListMusic className="h-6 w-6" />
          My Playlists
        </h2>
        <Button size="sm">
          <Music className="h-4 w-4 mr-2" />
          New Playlist
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{playlist.name}</CardTitle>
                  {playlist.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {playlist.description}
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
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
                    className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer group"
                    onClick={() => onPlayTrack?.(track)} role="button" tabIndex={0}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Music className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {track.duration}
                      </span>
                    </div>
                  </div>
                ))}
                {playlist.tracks.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    +{playlist.tracks.length - 3} more tracks
                  </p>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
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
