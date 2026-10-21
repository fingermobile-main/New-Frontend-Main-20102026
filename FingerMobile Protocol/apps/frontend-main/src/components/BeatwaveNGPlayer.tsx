/*
 * FingerMobile Protocol™ - BeatwaveNG Player Component
 * Apple Music Desktop Aesthetic & Sovereign Audio Player Architecture
 * LushPressies Emerald Theme (#10b981)
 * 10-Band Equalizer Modal, Synchronized Scrolling Lyrics Drawer, A-B Repeat, Sleep Timer
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, Shuffle, Heart,
  ListMusic, Mic2, Sliders, Clock,
  X, RotateCcw, FastForward, Rewind, Info,
  Speaker
} from 'lucide-react';
import { useBeatwaveNG, EQ_FREQUENCIES, EQ_PRESETS } from '../contexts/BeatwaveNGContext';
import { formatTime } from '../utils/timeUtils';
import AudioDeviceSelectorModal from './beatwaveng/AudioDeviceSelectorModal';

interface BeatwaveNGPlayerProps {
  className?: string;
}

const BeatwaveNGPlayer: React.FC<BeatwaveNGPlayerProps> = ({ className = '' }) => {
  const {
    currentTrack,
    isPlaying,
    playbackTime,
    duration,
    volume,
    queue,
    currentQueueIndex,
    playbackRate,
    isShuffle,
    repeatMode,
    audioQuality,
    eqGains,
    activeEqPreset,
    abRepeat,
    sleepTimerMinutes,
    sleepTimerRemaining,
    currentLyricIndex,
    parsedLyrics,
    playTrack,
    pauseTrack,
    resumeTrack,
    seekTrack,
    jumpTime,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleShuffle,
    cycleRepeatMode,
    setAbRepeatA,
    setAbRepeatB,
    clearAbRepeat,
    setSleepTimer,
    setEqGain,
    applyEqPreset,
    playNext,
    playPrevious,
    likeTrack,
    activeAudioDevice
  } = useBeatwaveNG();

  // Modals & Drawers
  const [showEqModal, setShowEqModal] = useState(false);
  const [showLyricsDrawer, setShowLyricsDrawer] = useState(false);
  const [showQueueDrawer, setShowQueueDrawer] = useState(false);
  const [showSleepTimerModal, setShowSleepTimerModal] = useState(false);
  const [showAmeboModal, setShowAmeboModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll lyrics to active line
  useEffect(() => {
    if (showLyricsDrawer && lyricsContainerRef.current && currentLyricIndex >= 0) {
      const activeElem = lyricsContainerRef.current.children[currentLyricIndex] as HTMLElement;
      if (activeElem) {
        activeElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentLyricIndex, showLyricsDrawer]);

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
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const targetDuration = duration || currentTrack.duration || 180;
    const newTime = percentage * targetDuration;
    seekTrack(newTime);
  };

  const currentDuration = duration || (currentTrack?.duration ?? 180);
  const progressPercentage = currentDuration > 0
    ? (playbackTime / currentDuration) * 100
    : 0;

  if (!currentTrack) {
    return null;
  }

  return (
    <>
      {/* ======================================================== */}
      {/* APPLE MUSIC FLOATING BOTTOM PLAYER BAR */}
      {/* ======================================================== */}
      <aside
        aria-label="Audio Player"
        className={`fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-emerald-500/30 text-white shadow-2xl transition-all ${className}`}
      >
        {/* Glowing Apple Music Top Scrub Line */}
        <div
          ref={progressBarRef}
          onClick={handleSeek}
          className="relative w-full h-1.5 bg-slate-800/80 hover:h-2.5 transition-all cursor-pointer group"
        >
          <div
            className="absolute h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300 transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
          {/* Glowing Thumb Handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg shadow-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ left: `${progressPercentage}%`, transform: 'translate(-50%, -50%)' }}
          />

          {/* A-B Repeat Markers */}
          {abRepeat.a !== null && (
            <div
              className="absolute top-0 bottom-0 w-1 bg-amber-400 z-10"
              style={{ left: `${(abRepeat.a / currentDuration) * 100}%` }}
              title={`Point A: ${Math.round(abRepeat.a)}s`}
            />
          )}
          {abRepeat.b !== null && (
            <div
              className="absolute top-0 bottom-0 w-1 bg-red-400 z-10"
              style={{ left: `${(abRepeat.b / currentDuration) * 100}%` }}
              title={`Point B: ${Math.round(abRepeat.b)}s`}
            />
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 py-2.5 grid grid-cols-12 gap-3 items-center">
          {/* ======================================================== */}
          {/* LEFT: Track Artwork & Info (Cols 1-4) */}
          {/* ======================================================== */}
          <div className="col-span-4 sm:col-span-3 flex items-center gap-3 min-w-0">
            <div className="relative group shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shadow-md bg-slate-900 border border-slate-800">
              <img
                src={currentTrack.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'}
                alt={currentTrack.title}
                className={`w-full h-full object-cover transition-transform ${isPlaying ? 'scale-105' : ''}`}
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="flex items-end gap-0.5 h-4">
                    <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3" />
                    <span className="w-1 bg-emerald-300 rounded-full animate-bounce h-4 delay-100" />
                    <span className="w-1 bg-teal-300 rounded-full animate-bounce h-2 delay-200" />
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-white font-bold text-xs sm:text-sm truncate hover:text-emerald-300 transition-colors cursor-pointer">
                  {currentTrack.title}
                </h4>
                {/* Tier Badge */}
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0 border ${
                  currentTrack.tier === 'SoundOcean'
                    ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                    : 'bg-sky-950/90 text-sky-300 border-sky-500/40'
                }`}>
                  {currentTrack.tier === 'SoundOcean' ? '💎 Ocean' : '🌊 River'}
                </span>
              </div>

              <p className="text-slate-300 text-[11px] truncate mt-0.5">
                {currentTrack.artist}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => likeTrack(currentTrack.id)}
                  className={`p-1 rounded-md transition-colors ${
                    currentTrack.isLiked ? 'text-red-500' : 'text-slate-300 hover:text-white'
                  }`}
                  title="Favorite"
                >
                  <Heart size={14} className={currentTrack.isLiked ? 'fill-red-500' : ''} />
                </button>

                <button
                  onClick={() => setShowAmeboModal(true)}
                  className="p-1 rounded-md text-slate-300 hover:text-emerald-300 transition-colors text-[10px] flex items-center gap-0.5"
                  title="Track Information (Amebo)"
                >
                  <Info size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CENTER: Apple Music Playback Controls (Cols 5-8) */}
          {/* ======================================================== */}
          <div className="col-span-8 sm:col-span-6 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-lg transition-colors ${
                  isShuffle ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-300 hover:text-white'
                }`}
                title="Shuffle"
              >
                <Shuffle size={16} />
              </button>

              {/* Previous */}
              <button
                onClick={playPrevious}
                className="p-2 text-slate-300 hover:text-white transition-colors"
                title="Previous Track"
              >
                <SkipBack size={20} fill="currentColor" />
              </button>

              {/* Jump -10s */}
              <button
                onClick={() => jumpTime(-10)}
                className="p-1.5 text-slate-300 hover:text-white transition-colors text-xs font-mono"
                title="Rewind 10 seconds"
              >
                <Rewind size={16} />
              </button>

              {/* Large Apple Music Play/Pause Button */}
              <button
                onClick={handlePlayPause}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-black flex items-center justify-center shadow-lg shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause size={22} fill="black" className="text-black" />
                ) : (
                  <Play size={22} fill="black" className="text-black ml-0.5" />
                )}
              </button>

              {/* Jump +10s */}
              <button
                onClick={() => jumpTime(10)}
                className="p-1.5 text-slate-300 hover:text-white transition-colors text-xs font-mono"
                title="Fast forward 10 seconds"
              >
                <FastForward size={16} />
              </button>

              {/* Next */}
              <button
                onClick={playNext}
                className="p-2 text-slate-300 hover:text-white transition-colors"
                title="Next Track"
              >
                <SkipForward size={20} fill="currentColor" />
              </button>

              {/* Repeat Mode */}
              <button
                onClick={cycleRepeatMode}
                className={`p-2 rounded-lg transition-colors relative ${
                  repeatMode !== 'none' ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-300 hover:text-white'
                }`}
                title={`Repeat: ${repeatMode}`}
              >
                <Repeat size={16} />
                {repeatMode === 'one' && (
                  <span className="absolute -top-1 -right-1 text-[8px] font-black bg-emerald-500 text-black rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    1
                  </span>
                )}
              </button>
            </div>

            {/* Time Indicator */}
            <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono mt-1">
              <span>{formatTime(playbackTime)}</span>
              <span>/</span>
              <span>{formatTime(currentDuration)}</span>
              {/* Quality Pill */}
              <span className="ml-2 px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-emerald-300 font-bold border border-emerald-500/30">
                {audioQuality === 'Lossless' ? 'Lossless 24-bit/192kHz' : audioQuality}
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT: Actions, Equalizer, Lyrics & Volume (Cols 9-12) */}
          {/* ======================================================== */}
          <div className="col-span-12 sm:col-span-3 flex items-center justify-end gap-1.5 sm:gap-2">
            {/* Playback Speed selector */}
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded-lg px-1.5 py-1 text-[11px] text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              title="Playback Speed"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1.0x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2.0x</option>
            </select>

            {/* 10-Band Equalizer Button */}
            <button
              onClick={() => setShowEqModal(true)}
              className={`p-2 rounded-xl transition-colors ${
                showEqModal || activeEqPreset !== 'Flat'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
              }`}
              title="10-Band Equalizer"
            >
              <Sliders size={16} />
            </button>

            {/* Synchronized Lyrics Drawer Button */}
            <button
              onClick={() => setShowLyricsDrawer(!showLyricsDrawer)}
              className={`p-2 rounded-xl transition-colors ${
                showLyricsDrawer
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
              }`}
              title="Live Scrolling Lyrics"
            >
              <Mic2 size={16} />
            </button>

            {/* Sleep Timer Button */}
            <button
              onClick={() => setShowSleepTimerModal(true)}
              className={`p-2 rounded-xl transition-colors relative ${
                sleepTimerMinutes !== null
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
              }`}
              title={sleepTimerMinutes ? `Sleep timer: ${Math.ceil((sleepTimerRemaining || 0) / 60)}m left` : 'Sleep Timer'}
            >
              <Clock size={16} />
              {sleepTimerMinutes !== null && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>

            {/* Queue Toggle Button */}
            <button
              onClick={() => setShowQueueDrawer(!showQueueDrawer)}
              className={`p-2 rounded-xl transition-colors ${
                showQueueDrawer
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
              }`}
              title="Queue List"
            >
              <ListMusic size={16} />
            </button>

            {/* Audio Device Selector Button */}
            <button
              onClick={() => setShowDeviceModal(true)}
              className={`p-2 rounded-xl transition-colors ${
                showDeviceModal
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
              }`}
              title={`Audio Output: ${activeAudioDevice.name} (${activeAudioDevice.bitrateSupport})`}
            >
              <Speaker size={16} className={activeAudioDevice.type !== 'system' ? 'text-emerald-400' : ''} />
            </button>

            {/* Volume Slider with Mute */}
            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={toggleMute}
                className="p-1.5 text-slate-300 hover:text-white transition-colors"
                title={volume === 0 ? 'Unmute' : 'Mute'}
              >
                {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-16 sm:w-20 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                title={`Volume: ${volume}%`}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Audio Device Selector Modal */}
      <AudioDeviceSelectorModal
        isOpen={showDeviceModal}
        onClose={() => setShowDeviceModal(false)}
      />

      {/* ======================================================== */}
      {/* 10-BAND EQUALIZER MODAL */}
      {/* ======================================================== */}
      {showEqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Sliders size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    10-Band Sovereign Equalizer
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      Web Audio API Engine
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">Precision hardware-grade acoustic tuning for BeatwaveNG</p>
                </div>
              </div>

              <button
                onClick={() => setShowEqModal(false)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* EQ Presets Bar */}
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2">Preset Profiles:</span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(EQ_PRESETS).map((pName) => (
                  <button
                    key={pName}
                    onClick={() => applyEqPreset(pName)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeEqPreset === pName
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {pName}
                  </button>
                ))}
              </div>
            </div>

            {/* 10 Visual Sliders Grid */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="grid grid-cols-10 gap-2 sm:gap-3 text-center">
                {EQ_FREQUENCIES.map((freq, idx) => {
                  const gainVal = eqGains[idx] || 0;
                  const label = freq >= 1000 ? `${freq / 1000}k` : `${freq}`;

                  return (
                    <div key={freq} className="flex flex-col items-center space-y-2">
                      <span className="text-[10px] font-mono font-bold text-emerald-400">
                        {gainVal > 0 ? `+${gainVal}` : gainVal}dB
                      </span>

                      {/* Vertical Slider */}
                      <div className="h-40 flex items-center justify-center">
                        <input
                          type="range"
                          min="-12"
                          max="12"
                          step="1"
                          value={gainVal}
                          onChange={(e) => setEqGain(idx, Number(e.target.value))}
                          className="w-36 h-2 -rotate-90 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                        />
                      </div>

                      <span className="text-[10px] font-mono text-slate-300 font-bold">
                        {label}Hz
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-800">
              <button
                onClick={() => applyEqPreset('Flat')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw size={14} />
                Reset to Flat (0dB)
              </button>

              <button
                onClick={() => setShowEqModal(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SYNCHRONIZED SCROLLING LYRICS DRAWER (APPLE MUSIC STYLE) */}
      {/* ======================================================== */}
      {showLyricsDrawer && (
        <aside
          aria-label="Live Synchronized Lyrics"
          className="fixed top-0 right-0 bottom-20 z-40 w-full sm:w-96 bg-slate-950/98 backdrop-blur-2xl border-l border-emerald-500/30 p-6 flex flex-col shadow-2xl animate-slideLeft"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Mic2 className="text-emerald-400" size={20} />
              <h3 className="font-black text-white text-base">Live Synchronized Lyrics</h3>
            </div>
            <button
              onClick={() => setShowLyricsDrawer(false)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div
            ref={lyricsContainerRef}
            className="flex-1 overflow-y-auto space-y-6 py-8 px-2 scroll-smooth"
          >
            {parsedLyrics.length > 0 ? (
              parsedLyrics.map((line, idx) => {
                const isActive = idx === currentLyricIndex;

                return (
                  <div
                    key={idx}
                    onClick={() => seekTrack(line.time)}
                    className={`cursor-pointer transition-all duration-300 text-left font-sans select-none ${
                      isActive
                        ? 'text-xl sm:text-2xl font-black text-white scale-105 origin-left drop-shadow-[0_0_12px_rgba(16,185,129,0.7)]'
                        : 'text-sm sm:text-base font-semibold text-slate-500 hover:text-slate-300 opacity-60'
                    }`}
                  >
                    <p className="leading-relaxed">{line.text}</p>
                    {isActive && (
                      <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                        • {formatTime(line.time)}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-24 text-center text-slate-500 space-y-3">
                <Mic2 className="w-10 h-10 mx-auto text-slate-600 opacity-40" />
                <p className="text-xs">No synced lyrics available for this master recording.</p>
                <p className="text-[11px] text-slate-600">Creators can submit time-tagged LRC scripts via SoundRiver Studio.</p>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* ======================================================== */}
      {/* QUEUE DRAWER */}
      {/* ======================================================== */}
      {showQueueDrawer && (
        <aside
          aria-label="Playback Queue"
          className="fixed top-0 right-0 bottom-20 z-40 w-full sm:w-96 bg-slate-950/98 backdrop-blur-2xl border-l border-slate-800 p-6 flex flex-col shadow-2xl animate-slideLeft"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <ListMusic className="text-emerald-400" size={20} />
              <h3 className="font-black text-white text-base">Up Next Queue</h3>
              <span className="text-xs text-slate-300">({queue.length} tracks)</span>
            </div>
            <button
              onClick={() => setShowQueueDrawer(false)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {queue.map((track, idx) => {
              const isCurrent = idx === currentQueueIndex;

              return (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => playTrack(track, queue)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-emerald-950/60 border border-emerald-500/50 text-white'
                      : 'bg-slate-900/50 hover:bg-slate-900 border border-transparent text-slate-300'
                  }`}
                >
                  <img
                    src={track.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100'}
                    alt={track.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="font-bold text-xs truncate">{track.title}</h5>
                    <p className="text-[11px] text-slate-300 truncate">{track.artist}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-300">{formatTime(track.duration)}</span>
                </div>
              );
            })}
          </div>
        </aside>
      )}

      {/* ======================================================== */}
      {/* SLEEP TIMER MODAL */}
      {/* ======================================================== */}
      {showSleepTimerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Clock size={18} />
                Sleep Timer Controls
              </div>
              <button
                onClick={() => setShowSleepTimerModal(false)}
                className="text-slate-300 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select duration to automatically fade out and stop streaming:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setSleepTimer(mins);
                    setShowSleepTimerModal(false);
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    sleepTimerMinutes === mins
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>

            {sleepTimerMinutes !== null && (
              <button
                onClick={() => {
                  setSleepTimer(null);
                  setShowSleepTimerModal(false);
                }}
                className="w-full py-2 bg-red-600/30 hover:bg-red-600/40 text-red-300 text-xs font-bold rounded-xl transition-colors"
              >
                Turn Off Sleep Timer
              </button>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* AMEBO TRACK PROVENANCE & INFO MODAL */}
      {/* ======================================================== */}
      {showAmeboModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Info size={18} />
                Amebo Track Provenance & Audio Specs
              </div>
              <button
                onClick={() => setShowAmeboModal(false)}
                className="text-slate-300 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl">
                <span className="text-slate-300 font-medium">Master Title:</span>
                <span className="text-white font-bold">{currentTrack.title}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl">
                <span className="text-slate-300 font-medium">Primary Artist:</span>
                <span className="text-white font-bold">{currentTrack.artist}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl">
                <span className="text-slate-300 font-medium">Platform Tier:</span>
                <span className="text-emerald-400 font-bold">{currentTrack.tier || 'SoundOcean Sovereign'}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl">
                <span className="text-slate-300 font-medium">Encoding / Bitrate:</span>
                <span className="text-emerald-300 font-bold">{currentTrack.bitrate || '1411 kbps FLAC Lossless 24-bit/192kHz'}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl">
                <span className="text-slate-300 font-medium">Genre:</span>
                <span className="text-white font-bold">{currentTrack.genre || 'Afrobeats'}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl">
                <span className="text-slate-300 font-medium">Release Year:</span>
                <span className="text-white font-bold">{currentTrack.year || 2026}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl">
                <span className="text-slate-300 font-medium">Total Stream Plays:</span>
                <span className="text-amber-400 font-bold">{(currentTrack.plays || 142000).toLocaleString()} streams</span>
              </div>
            </div>

            {/* A-B Repeat Quick Setter */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block">A-B Repeat Looper:</span>
              <div className="flex gap-2">
                <button
                  onClick={setAbRepeatA}
                  className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs font-bold text-amber-300"
                >
                  Set Point A ({abRepeat.a !== null ? `${Math.round(abRepeat.a)}s` : 'unset'})
                </button>
                <button
                  onClick={setAbRepeatB}
                  className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs font-bold text-red-300"
                >
                  Set Point B ({abRepeat.b !== null ? `${Math.round(abRepeat.b)}s` : 'unset'})
                </button>
                {abRepeat.enabled && (
                  <button
                    onClick={clearAbRepeat}
                    className="px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-bold text-slate-300"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowAmeboModal(false)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BeatwaveNGPlayer;
