import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, Shuffle, Heart, MoreVertical, Download, Share2,
  ListMusic, Mic2, Radio, BrainCircuit
} from 'lucide-react';
import { useBeatwaveNG } from '../hooks/useBeatwaveNG';
import { formatTime } from '../utils/timeUtils';

interface BeatwaveNGPlayerProps {
  className?: string;
}

const BeatwaveNGPlayer: React.FC<BeatwaveNGPlayerProps> = ({ className = '' }) => {
  const {
    currentTrack,
    isPlaying,
    playbackTime,
    volume,
    playTrack,
    pauseTrack,
    resumeTrack,
    seekTrack,
    setVolume,
    toggleMute,
    likeTrack,
    saveTrack,
    playNext,
    queue
  } = useBeatwaveNG();

  const [isMuted, setIsMuted] = React.useState(false);
  const [playbackRate, setPlaybackRate] = React.useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = React.useState(false);
  const [isShuffle, setIsShuffle] = React.useState(false);
  const [repeatMode, setRepeatMode] = React.useState<'none' | 'one' | 'all'>('none');

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const progressBarRef = React.useRef<HTMLDivElement>(null);

  // Handle audio element events
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      seekTrack(audio.currentTime);
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (queue.length > 0) {
        // Play next track in queue
        playNext();
      } else {
        pauseTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode, seekTrack, pauseTrack]);

  // Update audio when current track changes
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.url;
    audio.load();

    if (isPlaying) {
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
      });
    }
  }, [currentTrack]);

  // Handle play/pause
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        pauseTrack();
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, pauseTrack]);

  // Handle volume changes
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  // Handle playback rate
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  const handlePlayPause = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !currentTrack) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * currentTrack.duration;

    seekTrack(newTime);

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSkipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, playbackTime - 10);
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current && currentTrack) {
      audioRef.current.currentTime = Math.min(currentTrack.duration, playbackTime + 10);
    }
  };

  const toggleMuteHandler = () => {
    setIsMuted(!isMuted);
    toggleMute();
  };

  const cycleRepeatMode = () => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'all';
      if (prev === 'all') return 'one';
      return 'none';
    });
  };

  if (!currentTrack) {
    return (
      <div className={`bg-gradient-to-r from-purple-900/90 to-indigo-900/90 backdrop-blur-xl border-t border-white/10 p-4 ${className}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-center h-20">
          <div className="text-center text-gray-400">
            <Mic2 className="mx-auto mb-2 opacity-50" size={32} />
            <p className="text-sm font-medium">Select a track to start listening</p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = currentTrack.duration > 0
    ? (playbackTime / currentTrack.duration) * 100
    : 0;

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />

      <div className={`bg-gradient-to-r from-purple-900/95 to-indigo-900/95 backdrop-blur-xl border-t border-white/10 shadow-2xl ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Progress Bar */}
          <div
            ref={progressBarRef}
            onClick={handleSeek} role="button" tabIndex={0}
            className="relative h-1 bg-white/10 rounded-full cursor-pointer group mb-3"
          >
            <div
              className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
            <div
              className="absolute h-3 w-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1"
              style={{ left: `${progressPercentage}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Left: Track Info */}
            <div className="flex items-center space-x-3 min-w-0">
              {currentTrack.coverArt && (
                <img
                  src={currentTrack.coverArt}
                  alt={currentTrack.title}
                  className="w-14 h-14 rounded-lg object-cover shadow-lg"
                />
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-white font-semibold text-sm truncate">
                  {currentTrack.title}
                </h4>
                <p className="text-gray-400 text-xs truncate">
                  {currentTrack.artist}
                </p>
              </div>
              <button
                onClick={() => likeTrack(currentTrack.id)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label={currentTrack.isLiked ? 'Unlike track' : 'Like track'}
              >
                <Heart
                  size={18}
                  className={currentTrack.isLiked ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}
                />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="More options">
                <MoreVertical size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Center: Playback Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-2 rounded-full transition-colors ${isShuffle ? 'text-purple-400 bg-purple-500/20' : 'text-gray-400 hover:text-white'}`}
                aria-label={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
              >
                <Shuffle size={18} />
              </button>

              <button
                onClick={handleSkipBack}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Skip back 10 seconds"
              >
                <SkipBack size={24} fill="currentColor" />
              </button>

              <button
                onClick={handlePlayPause}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause size={24} fill="black" className="text-black ml-0.5" />
                ) : (
                  <Play size={24} fill="black" className="text-black ml-1" />
                )}
              </button>

              <button
                onClick={handleSkipForward}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Skip forward 10 seconds"
              >
                <SkipForward size={24} fill="currentColor" />
              </button>

              <button
                onClick={cycleRepeatMode}
                className={`p-2 rounded-full transition-colors relative ${repeatMode !== 'none' ? 'text-purple-400 bg-purple-500/20' : 'text-gray-400 hover:text-white'}`}
                aria-label={`Repeat mode: ${repeatMode === 'none' ? 'off' : repeatMode === 'one' ? 'one' : 'all'}`}
              >
                <Repeat size={18} />
                {repeatMode === 'one' && (
                  <span className="absolute -top-1 -right-1 text-[8px] font-bold bg-purple-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    1
                  </span>
                )}
              </button>
            </div>

            {/* Right: Volume & Extras */}
            <div className="flex items-center justify-end space-x-3">
              {/* Time Display */}
              <div className="text-xs text-gray-400 font-mono hidden sm:block">
                {formatTime(playbackTime)} / {formatTime(currentTrack.duration)}
              </div>

              {/* Volume Control */}
              <div className="relative">
                <button
                  onClick={toggleMuteHandler}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  aria-label={isMuted || volume === 0 ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX size={20} />
                  ) : (
                    <Volume2 size={20} />
                  )}
                </button>

                {(showVolumeSlider || true) && (
                  <div
                    className="absolute bottom-full right-0 mb-2 p-3 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl"
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-24 h-1 accent-purple-500"
                      aria-label="Volume"
                    />
                  </div>
                )}
              </div>

              {/* Playback Rate */}
              <select
                value={playbackRate}
                onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Playback speed"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>

              {/* Additional Actions */}
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <ListMusic size={18} />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Share2 size={18} />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Download size={18} />
              </button>
            </div>
          </div>

          {/* Mini Visualizer (decorative) */}
          {isPlaying && (
            <div className="absolute bottom-0 left-0 right-0 h-1 flex items-end justify-center space-x-0.5 opacity-30">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t animate-pulse"
                  style={{
                    height: `${Math.random() * 20 + 5}px`,
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BeatwaveNGPlayer;
