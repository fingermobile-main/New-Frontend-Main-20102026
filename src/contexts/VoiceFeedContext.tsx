import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
export interface VoiceFeedTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverArt?: string;
}

interface VoiceFeedState {
  currentTrack: VoiceFeedTrack | null;
  isPlaying: boolean;
  queue: VoiceFeedTrack[];
  volume: number;
  muted: boolean;
  currentTime: number;
}

interface VoiceFeedContextType {
  state: VoiceFeedState;
  playTrack: (track: VoiceFeedTrack) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  addToQueue: (track: VoiceFeedTrack) => void;
  clearQueue: () => void;
}

const initialState: VoiceFeedState = {
  currentTrack: null,
  isPlaying: false,
  queue: [],
  volume: 1,
  muted: false,
  currentTime: 0
};

const VoiceFeedContext = createContext<VoiceFeedContextType | undefined>(undefined);

export { VoiceFeedContext };

interface VoiceFeedProviderProps {
  children: ReactNode;
}

export function VoiceFeedProvider({ children }: VoiceFeedProviderProps) {
  const [state, setState] = useState<VoiceFeedState>(initialState);

  const playTrack = useCallback((track: VoiceFeedTrack) => {
    setState((prev) => ({
      ...prev,
      currentTrack: track,
      isPlaying: true,
      currentTime: 0
    }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const resume = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const next = useCallback(() => {
    setState((prev) => {
      if (prev.queue.length === 0) return prev;
      const [nextTrack, ...remainingQueue] = prev.queue;
      return {
        ...prev,
        currentTrack: nextTrack,
        queue: remainingQueue,
        isPlaying: true,
        currentTime: 0
      };
    });
  }, []);

  const previous = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentTime: 0
    }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState((prev) => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  }, []);

  const toggleMute = useCallback(() => {
    setState((prev) => ({ ...prev, muted: !prev.muted }));
  }, []);

  const addToQueue = useCallback((track: VoiceFeedTrack) => {
    setState((prev) => ({ ...prev, queue: [...prev.queue, track] }));
  }, []);

  const clearQueue = useCallback(() => {
    setState((prev) => ({ ...prev, queue: [] }));
  }, []);

  const value: VoiceFeedContextType = {
    state,
    playTrack,
    pause,
    resume,
    next,
    previous,
    setVolume,
    toggleMute,
    addToQueue,
    clearQueue
  };

  return <VoiceFeedContext.Provider value={value}>{children}</VoiceFeedContext.Provider>;
}

export function useVoiceFeed() {
  const context = useContext(VoiceFeedContext);
  if (context === undefined) {
    throw new Error('useVoiceFeed must be used within a VoiceFeedProvider');
  }
  return context;
}

export default VoiceFeedProvider;