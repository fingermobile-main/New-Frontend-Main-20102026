import React, { useState } from 'react';
import { Music, Headphones, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  coverArt?: string;
}

interface BeatwaveNGMusicProps {
  currentTrack?: Track;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onSeek?: (time: number) => void;
  onVolumeChange?: (volume: number) => void;
}

const BeatwaveNGMusic: React.FC<BeatwaveNGMusicProps> = ({
  currentTrack,
  isPlaying = false,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange
}) => {
  const [currentTime, setCurrentTime] = React.useState(0);
  const [volume, setVolume] = React.useState(80);

  const defaultTrack: Track = {
    id: '1',
    title: 'Summer Vibes',
    artist: 'DJ Cool',
    duration: 225, // 3:45
  };

  const track = currentTrack || defaultTrack;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    onSeek?.(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    onVolumeChange?.(newVolume);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Headphones className="h-5 w-5" />
          Now Playing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
            {track.coverArt ? (
              <img src={track.coverArt} alt={track.title} className="w-full h-full object-cover rounded-lg"  />
            ) : (
              <Music className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{track.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
            <Badge variant="secondary" className="mt-2">
              Beatwave NG
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(track.duration)}</span>
          </div>
          <Slider
            value={[currentTime]}
            onValueChange={handleSeek}
            max={track.duration}
            step={1}
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" onClick={onPrevious}>
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button size="icon" className="h-12 w-12" onClick={onPlayPause}>
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onNext}>
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-8">{volume}%</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BeatwaveNGMusic;
