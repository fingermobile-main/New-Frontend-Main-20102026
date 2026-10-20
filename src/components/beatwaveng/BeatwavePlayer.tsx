import React, { useEffect, useRef, useState } from 'react';
/**
 * BeatwavePlayer Component
 * Advanced music player for BeatwaveNG application
 */

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  coverUrl?: string;
  audioUrl: string;
}

interface BeatwavePlayerProps {
  tracks: Track[];
  initialTrackIndex?: number;
  autoPlay?: boolean;
  onTrackChange?: (track: Track, index: number) => void;
  className?: string;
}

const BeatwavePlayer: React.FC<BeatwavePlayerProps> = ({
  tracks,
  initialTrackIndex = 0,
  autoPlay = false,
  onTrackChange,
  className = ''
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      if (autoPlay) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    setCurrentTime(0);
    setIsPlaying(true);
    onTrackChange?.(tracks[nextIndex], nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setCurrentTime(0);
    setIsPlaying(true);
    onTrackChange?.(tracks[prevIndex], prevIndex);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return <div className="bg-gray-900 rounded-lg p-6 text-center text-slate-300 font-medium">No tracks available</div>;
  }

  return (
    <div className={`bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-xl shadow-2xl ${className}`}>
      <audio
        ref={audioRef}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={handleNext}
      />

      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            {currentTrack.coverUrl ? (
              <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover rounded-lg"  />
            ) : (
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-lg truncate">{currentTrack.title}</h3>
            <p className="text-gray-300 text-sm truncate">{currentTrack.artist}</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-4">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={(e) => {
            const time = parseFloat(e.target.value);
            setCurrentTime(time);
            if (audioRef.current) audioRef.current.currentTime = time;
          }}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-2 text-xs text-slate-300 font-medium">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="px-6 pb-6 flex items-center justify-between">
        <button onClick={handlePrevious} className="p-2 text-gray-300 hover:text-white" aria-label="Button"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
        </svg>
        </button>

        <button onClick={togglePlay} className="p-4 bg-purple-600 hover:bg-purple-700 rounded-full text-white shadow-lg">
          {isPlaying ? (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <button onClick={handleNext} className="p-2 text-gray-300 hover:text-white" aria-label="Button"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
        </svg>
        </button>
      </div>
    </div>
  );
};

export default BeatwavePlayer;
