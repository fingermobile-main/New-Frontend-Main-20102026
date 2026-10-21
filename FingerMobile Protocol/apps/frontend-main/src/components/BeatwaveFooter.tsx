import React, {} from 'react';
import { Volume2, SkipBack, Play, Pause, SkipForward, Repeat, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';

interface BeatwaveFooterProps {
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onShuffle?: () => void;
  onRepeat?: () => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  progress?: number;
  duration?: number;
  onSeek?: (time: number) => void;
}

const BeatwaveFooter: React.FC<BeatwaveFooterProps> = ({
  isPlaying = false,
  onPlayPause,
  onNext,
  onPrevious,
  onShuffle,
  onRepeat,
  volume = 70,
  onVolumeChange,
  progress = 0,
  duration = 0,
  onSeek
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <footer className="bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onShuffle} className="text-slate-700 hover:text-slate-900">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onPrevious} className="text-slate-700 hover:text-slate-900">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              className="h-10 w-10 rounded-full bg-slate-900 text-white hover:bg-slate-800"
              onClick={onPlayPause}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={onNext} className="text-slate-700 hover:text-slate-900">
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onRepeat} className="text-slate-700 hover:text-slate-900">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs text-slate-700 font-semibold w-12 text-right">
              {formatTime(progress)}
            </span>
            <Slider
              value={[progress]}
              max={duration || 100}
              step={1}
              onValueChange={(value: number[]) => onSeek?.(value[0])}
              className="flex-1"
            />
            <span className="text-xs text-slate-700 font-semibold w-12">
              {formatTime(duration)}
            </span>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 w-40">
            <Volume2 className="h-4 w-4 text-slate-700" />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={(value: number[]) => onVolumeChange?.(value[0])}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BeatwaveFooter;
