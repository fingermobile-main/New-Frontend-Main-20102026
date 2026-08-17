import React, {} from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { Badge } from "@/components/ui/Badge";

interface BeatwavePlayerProps {
  track?: {
    id: string;
    title: string;
    artist: string;
    album?: string;
    coverArt?: string;
    duration: number;
  };
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  progress?: number;
  volume?: number;
  onSeek?: (time: number) => void;
  onVolumeChange?: (volume: number) => void;
}

const BeatwavePlayer: React.FC<BeatwavePlayerProps> = ({
  track,
  isPlaying = false,
  onPlayPause,
  onNext,
  onPrevious,
  progress = 0,
  volume = 70,
  onSeek,
  onVolumeChange
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!track) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground">No track selected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 space-y-4">
        {/* Track Info */}
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
            {track.coverArt ? (
              <img src={track.coverArt} alt={track.title} className="w-full h-full object-cover rounded-lg"  />
            ) : (
              <Music className="h-12 w-12 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate">{track.title}</h3>
            <p className="text-muted-foreground truncate">{track.artist}</p>
            {track.album && (
              <Badge variant="secondary" className="mt-2">
                {track.album}
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[progress]}
            max={track.duration || 100}
            step={1}
            onValueChange={(value) => onSeek?.(value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(track.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" onClick={onPrevious}>
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onNext}>
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={(value) => onVolumeChange?.(value[0])}
            className="flex-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BeatwavePlayer;
