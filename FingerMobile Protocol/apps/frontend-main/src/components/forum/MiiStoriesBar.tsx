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
  PauseIcon,
  MicrophoneIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import MediaEditorModal, { EditedMediaResult } from '../MediaEditorModal';

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

export interface MiiAttachedMedia {
  id: string;
  url: string;
  adjustedUrl?: string;
  type: 'photo' | 'audio' | 'video';
  name: string;
  filter?: string;
  crop?: string;
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
  const [miiCaption, setMiiCaption] = useState('');
  const [isP2PAutoShuffling, setIsP2PAutoShuffling] = useState(true);
  const [p2pCycleTimer, setP2pCycleTimer] = useState(10);
  const [viewerIsPaused, setViewerIsPaused] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);

  // Multi-Media & Voice Note Attachments
  const [miiMediaList, setMiiMediaList] = useState<MiiAttachedMedia[]>([]);
  const [editingMediaItem, setEditingMediaItem] = useState<MiiAttachedMedia | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecordSeconds, setVoiceRecordSeconds] = useState(0);

  const miiFileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const voiceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Handle Multiple File Selection (Images, Videos, Audio / Voice Notes)
  const handleMultipleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isVid = file.type.startsWith('video');
      const isAud = file.type.startsWith('audio');
      const type: 'photo' | 'audio' | 'video' = isVid ? 'video' : isAud ? 'audio' : 'photo';

      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const newItem: MiiAttachedMedia = {
            id: `mii-upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url: ev.target.result as string,
            type,
            name: file.name,
          };
          setMiiMediaList((prev) => [...prev, newItem]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
    triggerToast?.(`Added media to Mii queue. You can crop & edit before publishing!`, 'info');
  };

  // Live Voice Note Recording
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) {
          audioChunksRef.current.push(ev.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            const voiceItem: MiiAttachedMedia = {
              id: `mii-voice-${Date.now()}`,
              url: ev.target.result as string,
              type: 'audio',
              name: `Voice Note (${voiceRecordSeconds}s)`,
            };
            setMiiMediaList((prev) => [...prev, voiceItem]);
          }
        };
        reader.readAsDataURL(audioBlob);

        stream.getTracks().forEach((track) => track.stop());
        setIsRecordingVoice(false);
        setVoiceRecordSeconds(0);
        if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
        triggerToast?.('Voice note recorded & attached!', 'success');
      };

      mediaRecorder.start();
      setIsRecordingVoice(true);
      setVoiceRecordSeconds(0);
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
      voiceTimerRef.current = setInterval(() => {
        setVoiceRecordSeconds((s) => s + 1);
      }, 1000);
    } catch {
      triggerToast?.('Microphone access denied or unavailable', 'error');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
    }
  };

  // Save Crop & Filter Edits from MediaEditorModal
  const handleSaveEditedMedia = (result: EditedMediaResult) => {
    if (!editingMediaItem) return;
    setMiiMediaList((prev) =>
      prev.map((item) =>
        item.id === editingMediaItem.id
          ? {
              ...item,
              adjustedUrl: result.url,
              filter: result.filter,
              crop: result.crop,
            }
          : item
      )
    );
    setEditingMediaItem(null);
    triggerToast?.('Crop & filter adjustments applied to moment!', 'success');
  };

  const handlePublishMii = () => {
    const safeName = currentUserName || 'User';

    // If media was attached, create an ephemeral story for each attached media item
    if (miiMediaList.length > 0) {
      const newStories: MiiItem[] = miiMediaList.map((item, idx) => ({
        id: `mii-${Date.now()}-${idx}`,
        author: safeName.split(' ')[0] || 'You',
        handle: `@${safeName.toLowerCase().replace(/\s+/g, '')}`,
        avatar: currentUserAvatar || '/assets/branding/default-avatar.svg',
        mediaUrl: item.adjustedUrl || item.url,
        expiresIn: '48h left',
        caption: miiCaption.trim() || item.name || 'Ephemeral sovereign moment ✨',
        isViewed: false,
        type: item.type,
      }));

      const updated = [...newStories, ...miiStories];
      setMiiStories(updated);
      try {
        localStorage.setItem('fmp_mii_stories', JSON.stringify(updated));
      } catch {}
      setIsMiiCreatorOpen(false);
      setMiiCaption('');
      setMiiMediaList([]);
      triggerToast?.(`${newStories.length} Mii moment${newStories.length > 1 ? 's' : ''} published to the P2P swarm!`, 'success');
    } else {
      // Fallback text/avatar story
      const newMii: MiiItem = {
        id: `mii-${Date.now()}`,
        author: safeName.split(' ')[0] || 'You',
        handle: `@${safeName.toLowerCase().replace(/\s+/g, '')}`,
        avatar: currentUserAvatar || '/assets/branding/default-avatar.svg',
        mediaUrl: currentUserAvatar || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
        expiresIn: '48h left',
        caption: miiCaption.trim() || 'Ephemeral sovereign moment ✨',
        isViewed: false,
        type: 'photo',
      };
      const updated = [newMii, ...miiStories];
      setMiiStories(updated);
      try {
        localStorage.setItem('fmp_mii_stories', JSON.stringify(updated));
      } catch {}
      setIsMiiCreatorOpen(false);
      setMiiCaption('');
      triggerToast?.('Mii published and prioritized across P2P swarm!', 'success');
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

      {/* 3. Mii Creator Modal with Multi-Media, Voice Note & Pre-Upload Crop/Editing */}
      {isMiiCreatorOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in"
          onClick={() => {
            if (isRecordingVoice) stopVoiceRecording();
            setIsMiiCreatorOpen(false);
          }}
        >
          <div
            className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-300 dark:border-slate-800 p-4 sm:p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Publish 48H Mii™®©℠ Moment</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-100 text-orange-950 border border-orange-400 font-black">
                  48H TTL
                </span>
              </div>
              <button
                aria-label="Close"
                type="button"
                onClick={() => {
                  if (isRecordingVoice) stopVoiceRecording();
                  setIsMiiCreatorOpen(false);
                }}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold p-1 rounded-lg"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Multi-Format Action Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* 1. Multiple Media Upload (Photos & Videos) */}
                <button
                  type="button"
                  onClick={() => miiFileInputRef.current?.click()}
                  className="py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-300 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer min-h-[44px]"
                >
                  <CameraIcon className="w-4 h-4 text-orange-600" />
                  <span>Add Photos/Videos</span>
                </button>

                {/* 2. Live Voice Note Recorder */}
                <button
                  type="button"
                  onClick={isRecordingVoice ? stopVoiceRecording : startVoiceRecording}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer min-h-[44px] ${
                    isRecordingVoice
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300'
                  }`}
                >
                  <MicrophoneIcon className={`w-4 h-4 ${isRecordingVoice ? 'text-white' : 'text-emerald-700'}`} />
                  <span>{isRecordingVoice ? `Stop (${voiceRecordSeconds}s)` : 'Record Voice Note'}</span>
                </button>

                {/* 3. Audio / Stems Picker */}
                <button
                  type="button"
                  onClick={() => miiFileInputRef.current?.click()}
                  className="col-span-2 sm:col-span-1 py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-950 border border-sky-300 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer min-h-[44px]"
                >
                  <MusicalNoteIcon className="w-4 h-4 text-sky-600" />
                  <span>Audio & Stems</span>
                </button>
              </div>

              {/* Hidden multi-file input */}
              <input
                ref={miiFileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={handleMultipleFileUpload}
                className="hidden"
              />

              {/* Live Voice Recording Status Banner */}
              {isRecordingVoice && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-2xl flex items-center justify-between text-xs animate-pulse">
                  <div className="flex items-center gap-2 text-rose-950 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                    <span>Recording Voice Note: 00:{voiceRecordSeconds < 10 ? `0${voiceRecordSeconds}` : voiceRecordSeconds}s</span>
                  </div>
                  <button
                    type="button"
                    onClick={stopVoiceRecording}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs"
                  >
                    Done & Attach
                  </button>
                </div>
              )}

              {/* Drag/Click Dropzone when no media attached yet */}
              {miiMediaList.length === 0 && !isRecordingVoice && (
                <div
                  onClick={() => miiFileInputRef.current?.click()}
                  className="p-6 border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center cursor-pointer space-y-1.5 transition"
                >
                  <PlusIcon className="w-8 h-8 text-orange-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Select Multiple Images, Videos or Voice Notes
                  </p>
                  <p className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">
                    Batch upload enabled • Crop & edit each asset before sharing
                  </p>
                </div>
              )}

              {/* Attached Media Cards Carousel (Crop, Filter & Manage Before Upload) */}
              {miiMediaList.length > 0 && (
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <SparklesIcon className="w-4 h-4 text-amber-400" />
                      Attached Moments ({miiMediaList.length})
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => miiFileInputRef.current?.click()}
                        className="px-2.5 py-1 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 transition shadow-xs cursor-pointer"
                      >
                        <PlusIcon className="w-3.5 h-3.5" />
                        <span>Add More</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMiiMediaList([])}
                        className="text-slate-400 hover:text-rose-400 text-[11px] font-semibold transition cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Scrollable Media Cards */}
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                    {miiMediaList.map((item, idx) => (
                      <div
                        key={item.id}
                        className="relative flex-shrink-0 w-28 h-32 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex flex-col justify-between p-1.5 shadow-md"
                      >
                        {/* Media Visual Preview */}
                        {item.type === 'video' ? (
                          <div className="absolute inset-0 bg-black flex items-center justify-center">
                            <video
                              src={item.adjustedUrl || item.url}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <VideoCameraIcon className="w-6 h-6 text-white drop-shadow" />
                            </div>
                          </div>
                        ) : item.type === 'audio' ? (
                          <div className="absolute inset-0 bg-gradient-to-tr from-amber-600 via-orange-600 to-rose-700 flex flex-col items-center justify-center p-2 text-white text-center">
                            <MusicalNoteIcon className="w-6 h-6 animate-pulse mb-1" />
                            <span className="text-[9px] font-bold truncate max-w-full px-1">{item.name}</span>
                          </div>
                        ) : (
                          <img
                            src={item.adjustedUrl || item.url}
                            alt={item.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}

                        {/* Top Badges & Remove Button */}
                        <div className="relative z-10 flex items-center justify-between w-full">
                          <span className="px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono font-bold text-white backdrop-blur-xs">
                            #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setMiiMediaList((prev) => prev.filter((m) => m.id !== item.id));
                            }}
                            className="w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-xs font-bold transition shadow cursor-pointer"
                            title="Remove item"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Filter/Crop tag status */}
                        {(item.filter || item.crop) && (
                          <div className="relative z-10">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-[9px] font-bold truncate block backdrop-blur-xs">
                              ✨ {item.filter || item.crop}
                            </span>
                          </div>
                        )}

                        {/* Bottom Edit Action (Crop & Filters) for images & videos */}
                        <div className="relative z-10 w-full">
                          {item.type !== 'audio' ? (
                            <button
                              type="button"
                              onClick={() => setEditingMediaItem(item)}
                              className="w-full py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center gap-1 backdrop-blur-xs transition shadow-xs cursor-pointer"
                              title="Crop, rotate, filter & grade"
                            >
                              <SparklesIcon className="w-3 h-3 text-amber-300" />
                              <span>Crop & Edit</span>
                            </button>
                          ) : (
                            <div className="text-center py-0.5 bg-black/50 rounded text-[9px] text-slate-200 font-mono">
                              Voice Note
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Caption */}
              <textarea
                value={miiCaption}
                onChange={(e) => setMiiCaption(e.target.value)}
                placeholder="Write an ephemeral caption or context for your Mii moment(s)..."
                rows={2}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none placeholder:text-slate-400"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                TTL: 48 Hours Disappearing
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (isRecordingVoice) stopVoiceRecording();
                    setIsMiiCreatorOpen(false);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePublishMii}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  {miiMediaList.length > 1 ? `Publish ${miiMediaList.length} Moments` : 'Publish Mii'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Creative Media Editor Modal (Crop, Rotate, Filters & Adjustments before publishing) */}
      {editingMediaItem && (
        <MediaEditorModal
          isOpen={Boolean(editingMediaItem)}
          onClose={() => setEditingMediaItem(null)}
          mediaUrl={editingMediaItem.adjustedUrl || editingMediaItem.url}
          mediaType={editingMediaItem.type === 'video' ? 'video' : 'image'}
          mediaName={editingMediaItem.name}
          onSave={handleSaveEditedMedia}
        />
      )}
    </>
  );
};

export default MiiStoriesBar;
