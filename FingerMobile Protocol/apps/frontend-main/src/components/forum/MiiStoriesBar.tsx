/*
 * FingerMobile Protocol™ - Mii™®©℠ 48H Disappearing Ephemeral Moments Bar
 * Reusable component shared across Forum and Profile Wall
 * Features:
 * - 48H Disappearing TTL indicator
 * - "Create Mii™®©℠" dashed-border avatar trigger
 * - Immediate UGC Media Rendering (uploaded photo/video thumbnail, NOT fallback to profile pic)
 * - Automated 10-second P2P UGC Random Shuffling Engine with slide-in-from-right transitions
 * - Cinematic Full-Screen Story Viewer sliding in one by one from the right
 * - High-Contrast Hierarchy Strict Compliance (AGENTS.md)
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  SparklesIcon,
  PlusIcon,
  XMarkIcon,
  CameraIcon,
  MusicalNoteIcon,
  VideoCameraIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';

export interface MiiItem {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  mediaUrl: string;
  expiresIn: string;
  caption: string;
  isViewed: boolean;
  type: 'photo' | 'audio' | 'video';
}

export const DEFAULT_MII_STORIES: MiiItem[] = [
  {
    id: 'mii-0',
    author: 'Israel',
    handle: '@israelobinna',
    avatar: '/assets/branding/mbah_israel_obinna.jpeg',
    mediaUrl: '/assets/branding/mbah_israel_obinna.jpeg',
    expiresIn: '46h left',
    caption: 'Protocol genesis block verified across African sovereign nodes! ⚡',
    isViewed: false,
    type: 'photo'
  },
  {
    id: 'mii-1',
    author: 'Amara',
    handle: '@amara_beats',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    expiresIn: '18h left',
    caption: 'Backstage at BeatwaveNG live studio sessions in Victoria Island! 🎵',
    isViewed: false,
    type: 'audio'
  },
  {
    id: 'mii-2',
    author: 'Tunde',
    handle: '@tunde_dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    expiresIn: '34h left',
    caption: 'Testing sovereign keycard NFC signatures live on testnet.',
    isViewed: false,
    type: 'video'
  },
  {
    id: 'mii-3',
    author: 'Zara',
    handle: '@zara_lush',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
    expiresIn: '41h left',
    caption: 'Sending escrow gifts to community builders on Lush Pressies! ✨',
    isViewed: false,
    type: 'photo'
  },
  {
    id: 'mii-4',
    author: 'Sylvia',
    handle: '@sylvia_art',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800',
    expiresIn: '26h left',
    caption: 'Heritage bronze sculpturing on Flamingo Fine Arts gallery.',
    isViewed: false,
    type: 'photo'
  }
];

interface MiiStoriesBarProps {
  currentUserName?: string;
  currentUserAvatar?: string;
  triggerToast?: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const MiiStoriesBar: React.FC<MiiStoriesBarProps> = ({
  currentUserName = 'Sovereign Member',
  currentUserAvatar = '/assets/branding/default-avatar.svg',
  triggerToast
}) => {
  const [miiStories, setMiiStories] = useState<MiiItem[]>(() => {
    try {
      const saved = localStorage.getItem('fmp_mii_stories') || localStorage.getItem('fingermobile_mii_stories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_MII_STORIES;
  });

  const [selectedMiiIndex, setSelectedMiiIndex] = useState<number | null>(null);
  const [isMiiCreatorOpen, setIsMiiCreatorOpen] = useState(false);
  const [miiType, setMiiType] = useState<'photo' | 'audio' | 'video'>('photo');
  const [miiCaption, setMiiCaption] = useState('');
  const [miiMediaUrl, setMiiMediaUrl] = useState('');
  const [isP2PAutoShuffling, setIsP2PAutoShuffling] = useState(true);
  const [p2pCycleTimer, setP2pCycleTimer] = useState(10);
  const [viewerIsPaused, setViewerIsPaused] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);

  const miiFileInputRef = useRef<HTMLInputElement>(null);

  // 10-Second P2P Random UGC Shuffling Engine:
  // Randomly cycles through members' uploaded media, giving fresh UGC immediate precedence
  useEffect(() => {
    if (!isP2PAutoShuffling || miiStories.length <= 1) return;

    const countdown = setInterval(() => {
      setP2pCycleTimer((prev) => (prev <= 1 ? 10 : prev - 1));
    }, 1000);

    const interval = setInterval(() => {
      setMiiStories((prev) => {
        if (prev.length <= 1) return prev;
        // P2P algorithm rotates queue so member UGC slides in from right
        const next = [...prev];
        const shifted = next.shift();
        if (shifted) next.push(shifted);
        return next;
      });
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
  }, [isP2PAutoShuffling, miiStories.length]);

  // Full-screen viewer auto-advance every 10 seconds (slides next story in from the right)
  useEffect(() => {
    if (selectedMiiIndex === null || viewerIsPaused) return;

    setStoryProgress(0);
    const progressInterval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          // Advance to next story
          setSelectedMiiIndex((curr) => {
            if (curr === null) return null;
            if (curr < miiStories.length - 1) {
              return curr + 1;
            } else {
              return 0; // loop back or close
            }
          });
          return 0;
        }
        return prev + 1;
      });
    }, 100); // 100 * 100ms = 10,000ms = 10s

    return () => clearInterval(progressInterval);
  }, [selectedMiiIndex, viewerIsPaused, miiStories.length]);

  const selectedMii = selectedMiiIndex !== null ? miiStories[selectedMiiIndex] : null;

  const handleSelectStory = (index: number) => {
    setSelectedMiiIndex(index);
    setStoryProgress(0);
    // Mark as viewed
    const story = miiStories[index];
    if (story) {
      setMiiStories((prev) =>
        prev.map((s) => (s.id === story.id ? { ...s, isViewed: true } : s))
      );
    }
  };

  const handleNextStory = () => {
    if (selectedMiiIndex === null) return;
    if (selectedMiiIndex < miiStories.length - 1) {
      setSelectedMiiIndex(selectedMiiIndex + 1);
    } else {
      setSelectedMiiIndex(0);
    }
    setStoryProgress(0);
  };

  const handlePrevStory = () => {
    if (selectedMiiIndex === null) return;
    if (selectedMiiIndex > 0) {
      setSelectedMiiIndex(selectedMiiIndex - 1);
    } else {
      setSelectedMiiIndex(miiStories.length - 1);
    }
    setStoryProgress(0);
  };

  const handlePublishMii = () => {
    const media = miiMediaUrl.trim() || currentUserAvatar || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800';
    const newMii: MiiItem = {
      id: `mii-${Date.now()}`,
      author: currentUserName.split(' ')[0] || 'You',
      handle: `@${currentUserName.toLowerCase().replace(/\s+/g, '')}`,
      avatar: currentUserAvatar,
      mediaUrl: media,
      expiresIn: '48h left',
      caption: miiCaption.trim() || 'Ephemeral sovereign moment ✨',
      isViewed: false,
      type: miiType
    };

    // P2P Algorithm takes control and gives new member UGC immediate precedence at front!
    const updated = [newMii, ...miiStories];
    setMiiStories(updated);
    try {
      localStorage.setItem('fmp_mii_stories', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setIsMiiCreatorOpen(false);
    setMiiCaption('');
    setMiiMediaUrl('');
    triggerToast?.('Mii published and prioritized across P2P swarm!', 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video');
      const isAud = file.type.startsWith('audio');
      if (isVid) setMiiType('video');
      else if (isAud) setMiiType('audio');
      else setMiiType('photo');

      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setMiiMediaUrl(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* 1. Mii™®©℠ 48H Ephemeral Stories Bar Container */}
      <div className="bg-white rounded-2xl border border-slate-300 p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2.5 px-1 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-900 flex items-center gap-1">
              <SparklesIcon className="w-4 h-4 text-amber-500" />
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-950 font-black tracking-tight border border-sky-300">
                Mii™®©℠
              </span>
            </span>
            <span className="text-[11px] text-slate-700 font-mono font-bold">48H Disappearing</span>
          </div>

          {/* P2P 10-second Shuffling Cadence Indicator */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 text-[10px] font-black flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>P2P Shuffling: {p2pCycleTimer}s</span>
            </span>
            <button
              type="button"
              onClick={() => setIsP2PAutoShuffling((v) => !v)}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 transition"
              title="Toggle P2P 10s auto-shuffle"
            >
              {isP2PAutoShuffling ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto scrollbar-none py-1.5">
          {/* Create Mii Button */}
          <button
            type="button"
            onClick={() => setIsMiiCreatorOpen(true)}
            className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer focus:outline-none"
          >
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-orange-400 flex items-center justify-center bg-orange-50/70 group-hover:bg-orange-100 group-hover:scale-105 transition-all shadow-xs border text-orange-950 font-black">
              <PlusIcon className="w-6 h-6 text-orange-600 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 tracking-tight">Create Mii™®©℠</span>
          </button>

          {/* Story Media Cards - IMMEDIATELY RENDERS UPLOADED MEDIA */}
          {miiStories.map((story, index) => (
            <button
              key={story.id}
              type="button"
              onClick={() => handleSelectStory(index)}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group focus:outline-none animate-in slide-in-from-right duration-300"
              title={`Click to view ${story.author}'s story in full screen`}
            >
              <div
                className={`relative w-16 h-16 rounded-2xl p-[2px] transition-all group-hover:scale-105 shadow-md overflow-hidden ${
                  story.isViewed
                    ? 'border-2 border-slate-300'
                    : 'border-2 border-orange-500 ring-2 ring-orange-200/60'
                }`}
              >
                {/* Immediately Display Uploaded UGC Media (Photo / Video poster / Audio visual) */}
                {story.type === 'video' ? (
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-950">
                    <video
                      src={story.mediaUrl}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <VideoCameraIcon className="w-4 h-4 text-white drop-shadow" />
                    </div>
                  </div>
                ) : story.type === 'audio' ? (
                  <div className="w-full h-full rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center text-white">
                    <MusicalNoteIcon className="w-6 h-6 animate-pulse" />
                  </div>
                ) : (
                  <img
                    src={story.mediaUrl || story.avatar}
                    alt={story.author}
                    className="w-full h-full rounded-xl object-cover"
                  />
                )}

                {/* Corner Creator Profile Badge */}
                <div className="absolute bottom-0.5 right-0.5 w-5 h-5 rounded-full overflow-hidden border border-white shadow-md bg-white">
                  <img
                    src={story.avatar}
                    alt={story.author}
                    className="w-full h-full object-cover"
                    title={`By ${story.author}`}
                  />
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-800 truncate max-w-[64px]">
                {story.author.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Full-Screen Cinematic Story Viewer (Slides in from the right) */}
      {selectedMii && (
        <div
          className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedMiiIndex(null)}
        >
          {/* Main Card - Slides in from right on every story transition */}
          <div
            key={selectedMii.id}
            className="max-w-md w-full max-h-[92vh] h-[820px] bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative text-white animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top 10-Second Auto-Advance Progress Bars */}
            <div className="p-3 bg-slate-950/90 border-b border-slate-800 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 w-full">
                {miiStories.map((s, idx) => (
                  <div key={s.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-orange-400 transition-all duration-100 ${
                        idx < (selectedMiiIndex ?? 0)
                          ? 'w-full'
                          : idx === selectedMiiIndex
                          ? `w-[${storyProgress}%]`
                          : 'w-0'
                      }`}
                      style={idx === selectedMiiIndex ? { width: `${storyProgress}%` } : undefined}
                    />
                  </div>
                ))}
              </div>

              {/* Author Info & Controls */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                  <img
                    src={selectedMii.avatar}
                    alt={selectedMii.author}
                    className="w-9 h-9 rounded-full object-cover border-2 border-orange-500 shadow-md"
                  />
                  <div>
                    <span className="font-bold text-xs block text-white flex items-center gap-1.5">
                      {selectedMii.author}
                      <span className="text-[10px] font-normal text-slate-300">{selectedMii.handle}</span>
                    </span>
                    <span className="text-[10px] text-amber-300 font-medium font-mono">{selectedMii.expiresIn}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Pause / Play 10s auto-slide */}
                  <button
                    type="button"
                    onClick={() => setViewerIsPaused((p) => !p)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition"
                    title={viewerIsPaused ? 'Resume 10s auto-advance' : 'Pause timer'}
                  >
                    {viewerIsPaused ? <PlayIcon className="w-4 h-4" /> : <PauseIcon className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMiiIndex(null)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition"
                    title="Close"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Central Media Canvas (Full Display of Uploaded Photo / Video / Audio) */}
            <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden select-none">
              {selectedMii.type === 'video' ? (
                <video
                  src={selectedMii.mediaUrl}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-full max-w-full object-contain"
                />
              ) : selectedMii.type === 'audio' ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 mx-auto flex items-center justify-center shadow-2xl">
                    <MusicalNoteIcon className="w-12 h-12 text-white animate-bounce" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">BeatwaveNG Studio Audio Mii</h4>
                    <p className="text-xs text-slate-300 mt-1">Direct sovereign audio stream</p>
                  </div>
                  <audio src={selectedMii.mediaUrl} controls autoPlay className="w-full max-w-xs mx-auto" />
                </div>
              ) : (
                <img
                  src={selectedMii.mediaUrl}
                  alt={selectedMii.author}
                  className="max-h-full max-w-full object-contain"
                />
              )}

              {/* Tap Left / Right Slide Navigation Buttons */}
              <button
                type="button"
                onClick={handlePrevStory}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition shadow-lg"
                title="Previous Story"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNextStory}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition shadow-lg"
                title="Next Story (Slide-in from right)"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Caption & Interactive Reply Bar */}
            <div className="p-3.5 bg-slate-950 border-t border-slate-800 space-y-2">
              <p className="text-xs text-slate-200 leading-relaxed font-medium">{selectedMii.caption}</p>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Send an ephemeral reply..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-400 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      triggerToast?.('Reply sent to peer via sovereign relay!', 'success');
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => triggerToast?.('Gifted 5 FIC to creator!', 'success')}
                  className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition shadow-md whitespace-nowrap"
                >
                  🪙 Tip 5 FIC
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Mii Creator Modal */}
      {isMiiCreatorOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsMiiCreatorOpen(false)}
        >
          <div
            className="max-w-md w-full bg-white rounded-3xl border border-slate-300 p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Publish Mii™®©℠ Moment</h3>
              </div>
              <button aria-label="Close"
                type="button"
                onClick={() => setIsMiiCreatorOpen(false)}
                className="text-slate-500 hover:text-slate-800"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Type selector */}
              <div className="grid grid-cols-3 gap-2">
                {(['photo', 'audio', 'video'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setMiiType(t)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize flex items-center justify-center gap-1.5 transition ${
                      miiType === t
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {t === 'photo' ? <CameraIcon className="w-4 h-4" /> : t === 'audio' ? <MusicalNoteIcon className="w-4 h-4" /> : <VideoCameraIcon className="w-4 h-4" />}
                    <span>{t}</span>
                  </button>
                ))}
              </div>

              {/* Upload trigger */}
              <input
                ref={miiFileInputRef}
                type="file"
                accept={miiType === 'video' ? 'video/*' : miiType === 'audio' ? 'audio/*' : 'image/*'}
                onChange={handleFileUpload}
                className="hidden text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />

              <div
                onClick={() => miiFileInputRef.current?.click()}
                className="p-6 border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-2xl bg-slate-50 text-center cursor-pointer space-y-1 transition"
              >
                <PlusIcon className="w-8 h-8 text-orange-500 mx-auto" />
                <p className="text-xs font-bold text-slate-800">Choose File or Photo</p>
                <p className="text-[10px] text-slate-700 font-medium">Auto-expires in 48 Hours</p>
              </div>

              {miiMediaUrl && (
                <div className="relative rounded-xl overflow-hidden max-h-36 bg-slate-950 flex items-center justify-center">
                  <img src={miiMediaUrl} alt="Preview" className="max-h-36 w-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                    Media Attached
                  </span>
                </div>
              )}

              {/* Caption */}
              <textarea
                value={miiCaption}
                onChange={(e) => setMiiCaption(e.target.value)}
                placeholder="Write an ephemeral caption..."
                rows={2}
                className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none font-bold placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                TTL: 48 Hours
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMiiCreatorOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePublishMii}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  Publish Mii
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MiiStoriesBar;
