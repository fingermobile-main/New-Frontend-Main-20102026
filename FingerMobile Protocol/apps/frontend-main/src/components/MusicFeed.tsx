import React, {} from 'react';
import { Link } from 'react-router-dom';
import { Music, Play, Heart, Share2, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

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
  onOptionsTrack?: (track: Track) => void;
}

const MusicFeed: React.FC<MusicFeedProps> = ({
  tracks: propTracks,
  onPlayTrack,
  onLikeTrack,
  onShareTrack,
  onOptionsTrack
}) => {
  const [activeOptionsTrack, setActiveOptionsTrack] = React.useState<Track | null>(null);
  const [copyFeedback, setCopyFeedback] = React.useState<string | null>(null);
  const defaultTracks: Track[] = [
    {
      id: '1',
      title: 'Summer Vibes',
      artist: 'DJ Cool',
      album: 'Beach Party',
      duration: '3:45',
      likes: 1234,
      isLiked: false
    },
    {
      id: '2',
      title: 'Night Drive',
      artist: 'Synthwave Master',
      album: 'Neon Dreams',
      duration: '4:20',
      likes: 2456,
      isLiked: true
    },
    {
      id: '3',
      title: 'Ocean Waves',
      artist: 'Chill Beats',
      album: 'Relaxation',
      duration: '3:15',
      likes: 890,
      isLiked: false
    }
  ];

  const tracks = propTracks || defaultTracks;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
          <Music className="h-6 w-6 text-slate-800" />
          Music Feed
        </h2>
        <Link
          to="/beatwave"
          aria-label="View all music tracks"
          className="text-sm font-semibold text-slate-800 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {tracks.map((track) => (
          <Card key={track.id} className="border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                  {track.coverArt ? (
                    <img
                      src={track.coverArt}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="h-8 w-8 text-slate-500" />
                    </div>
                  )}
                  <Button
                    type="button"
                    size="icon"
                    aria-label={`Play ${track.title} by ${track.artist}`}
                    className="absolute inset-0 m-auto h-10 w-10 opacity-0 hover:opacity-100 transition-opacity"
                    onClick={() => onPlayTrack?.(track)}
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{track.title}</h3>
                  <p className="text-sm text-slate-700 font-medium truncate">{track.artist}</p>
                  {track.album && (
                    <p className="text-xs text-slate-600 truncate">{track.album}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-700 font-medium">{track.duration}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={track.isLiked ? `Unlike ${track.title}` : `Like ${track.title}`}
                    onClick={() => onLikeTrack?.(track.id)}
                    className={track.isLiked ? 'text-red-500' : 'text-slate-700'}
                  >
                    <Heart className={`h-5 w-5 ${track.isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Share ${track.title}`}
                    onClick={() => onShareTrack?.(track.id)}
                    className="text-slate-700"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`More options for ${track.title}`}
                    onClick={() => {
                      if (onOptionsTrack) {
                        onOptionsTrack(track);
                      } else {
                        setActiveOptionsTrack(track);
                      }
                    }}
                    className="text-slate-700"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Track Options Modal */}
      {activeOptionsTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm truncate">{activeOptionsTrack.title}</h4>
                <p className="text-xs text-slate-700 font-medium">{activeOptionsTrack.artist}</p>
              </div>
              <button
                onClick={() => setActiveOptionsTrack(null)}
                className="text-slate-500 hover:text-slate-800 p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-xs font-bold">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/soundsonic?track=${activeOptionsTrack.id}`);
                  setCopyFeedback('Track link copied!');
                  setTimeout(() => setCopyFeedback(null), 2000);
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 flex items-center justify-between cursor-pointer"
              >
                <span>Copy Track Share Link</span>
                {copyFeedback && <span className="text-emerald-600 font-semibold">{copyFeedback}</span>}
              </button>

              <button
                onClick={() => {
                  onShareTrack?.(activeOptionsTrack.id);
                  setActiveOptionsTrack(null);
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 cursor-pointer"
              >
                Broadcast to SoundSonic Feed
              </button>

              <button
                onClick={() => {
                  onPlayTrack?.(activeOptionsTrack);
                  setActiveOptionsTrack(null);
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 cursor-pointer"
              >
                Play Lossless Master Stream
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveOptionsTrack(null)}
                className="text-xs border-slate-300 text-slate-800"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicFeed;
