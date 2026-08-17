import React, { useRef, useCallback  } from 'react';
import { useDancia4Tv } from '../contexts/Dancia4TvProvider';

export const useVideoPlayback = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { playerState, updatePlayerState, addToWatchHistory } = useDancia4Tv();

  // Sync internal context triggers down to HTML Element
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    
    if (playerState.isPlaying) {
      videoRef.current.pause();
      updatePlayerState({
  isPlaying: false });
    } else {
      videoRef.current.play().catch(() => {
        updatePlayerState({
  isPlaying: false });
      });
      updatePlayerState({
  isPlaying: true });
    }
  }, [playerState.isPlaying, updatePlayerState]);

  const changeVolume = useCallback((volume: number) => {
    if (!videoRef.current) return;
    const normalizedVolume = Math.min(1, Math.max(0, volume));
    videoRef.current.volume = normalizedVolume;
    updatePlayerState({volume: normalizedVolume,
  isMuted: normalizedVolume === 0 });
  }, [updatePlayerState]);

  // Hook up event listeners from DOM to update global State Tree
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    updatePlayerState({
  currentTime: videoRef.current.currentTime });
  }, [updatePlayerState]);

  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;
    updatePlayerState({
  duration: videoRef.current.duration });
  }, [updatePlayerState]);

  return {
    videoRef,
    playerState,
    togglePlay,
    changeVolume,
videoProps: {onTimeUpdate: handleTimeUpdate,
  onLoadedMetadata: handleLoadedMetadata,
  onPlay: () => updatePlayerState({
  isPlaying: true }),
onPause: () => updatePlayerState({isPlaying: false }),
onWaiting: () => updatePlayerState({isBuffering: true }),
onPlaying: () => updatePlayerState({isBuffering: false })
    }
  };
};
