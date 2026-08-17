import React, {} from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize } from 'lucide-react';

interface BeatwaveControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  onFullscreen: () => void;
}

const BeatwaveControls: React.FC<BeatwaveControlsProps> = ({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  volume,
  onVolumeChange,
  onFullscreen
}) => {
  return (
    <div className="flex items-center justify-center space-x-4 p-4 bg-gray-800 text-white rounded-lg">
      <button 
        onClick={onPrevious}
        aria-label="Previous track"
        className="p-2 hover:bg-gray-700 rounded-full"
      >
        <SkipBack className="h-6 w-6" />
      </button>
      
      <button 
        onClick={onPlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="p-2 hover:bg-gray-700 rounded-full"
      >
        {isPlaying ? (
          <Pause className="h-8 w-8" />
        ) : (
          <Play className="h-8 w-8" />
        )}
      </button>
      
      <button 
        onClick={onNext}
        aria-label="Next track"
        className="p-2 hover:bg-gray-700 rounded-full"
      >
        <SkipForward className="h-6 w-6" />
      </button>
      
      <div className="flex items-center space-x-2 ml-4">
        <Volume2 className="h-6 w-6" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          aria-label="Volume control"
          className="w-24 accent-blue-500"
        />
      </div>
      
      <button 
        onClick={onFullscreen}
        aria-label="Toggle fullscreen"
        className="ml-4 p-2 hover:bg-gray-700 rounded-full"
      >
        <Maximize className="h-6 w-6" />
      </button>
    </div>
  );
};

export default BeatwaveControls;