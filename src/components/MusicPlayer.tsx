import React, { useState, useRef } from 'react';

interface MusicPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  coverImage?: string;
  autoplay?: boolean;
  className?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  src, 
  title = 'Unknown Title',
  artist = 'Unknown Artist',
  coverImage,
  autoplay = false,
  className = ''
}) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <audio
        ref={audioRef}
        src={src}
        autoPlay={autoplay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="flex items-center space-x-4">
        {coverImage && (
          <img 
            src={coverImage} 
            alt={title}
            className="w-16 h-16 rounded-md object-cover"
           />
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{artist}</p>
        </div>
        <button 
          onClick={togglePlay}
          className="p-3 bg-brand-blue text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          {isPlaying ? '⏸' : '▶️'}
        </button>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
