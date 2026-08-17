import React, {} from 'react';
import { Music, Play, Heart, Share2, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: string;
  coverArt?: string;
  likes: number;
  isLiked?: boolean;
}

interface MusicFeedProps {
  tracks?: Track[];
  onPlayTrack?: (track: Track) => void;
  onLikeTrack?: (trackId: string) => void;
  onShareTrack?: (trackId: string) => void;
}

const MusicFeed: React.FC<MusicFeedProps> = ({
  tracks: propTracks,
  onPlayTrack,
  onLikeTrack,
  onShareTrack
}) => {
  const defaultTracks: Track[] = [
    {
      id: "1",
      title: "Summer Vibes",
      artist: "DJ Cool",
      album: "Beach Party",
      duration: "3:45",
      likes: 1234,
      isLiked: false
    },
    {
      id: "2",
      title: "Night Drive",
      artist: "Synthwave Master",
      album: "Neon Dreams",
      duration: "4:20",
      likes: 2456,
      isLiked: true
    },
    {
      id: "3",
      title: "Ocean Waves",
      artist: "Chill Beats",
      album: "Relaxation",
      duration: "3:15",
      likes: 890,
      isLiked: false
    }
  ];

  const tracks = propTracks || defaultTracks;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Music className="h-6 w-6" />
          Music Feed
        </h2>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {tracks.map((track) => (
          <Card key={track.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                  {track.coverArt ? (
                    <img
                      src={track.coverArt}
                      alt={track.title}
                      className="w-full h-full object-cover"
                     />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <Button
                    size="icon"
                    className="absolute inset-0 m-auto h-10 w-10 opacity-0 hover:opacity-100 transition-opacity"
                    onClick={() => onPlayTrack?.(track)}
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{track.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                  {track.album && (
                    <p className="text-xs text-muted-foreground truncate">{track.album}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{track.duration}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onLikeTrack?.(track.id)}
                    className={track.isLiked ? "text-red-500" : ""}
                  >
                    <Heart className={`h-5 w-5 ${track.isLiked ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onShareTrack?.(track.id)}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MusicFeed;
