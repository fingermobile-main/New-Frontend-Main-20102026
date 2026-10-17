/*
 * FingerMobile Protocol™ - Mii™®©℠ 48H Disappearing Ephemeral Moments Bar
 * Reusable component shared across Forum and Profile Wall
 * Features:
 * - 48H Disappearing TTL indicator
 * - "Create Mii™®©℠" dashed-border avatar trigger
 * - Story circles (Israel, Amara, Tunde, Zara, Sylvia, etc.)
 * - Fullscreen Story Viewer modal
 * - Interactive Mii Creator modal with local persistence
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useRef } from 'react';
import {
  SparklesIcon,
  PlusIcon,
  XMarkIcon,
  CameraIcon,
  MusicalNoteIcon,
  VideoCameraIcon
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
  currentUserName = 'Israel Obinna Mbah',
  currentUserAvatar = '/assets/branding/mbah_israel_obinna.jpeg',
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

  const [selectedMii, setSelectedMii] = useState<MiiItem | null>(null);
  const [isMiiCreatorOpen, setIsMiiCreatorOpen] = useState(false);
  const [miiType, setMiiType] = useState<'photo' | 'audio' | 'video'>('photo');
  const [miiCaption, setMiiCaption] = useState('');
  const [miiMediaUrl, setMiiMediaUrl] = useState('');
  const miiFileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectStory = (story: MiiItem) => {
    setSelectedMii(story);
    // Mark as viewed
    setMiiStories((prev) =>
      prev.map((s) => (s.id === story.id ? { ...s, isViewed: true } : s))
    );
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
    triggerToast?.('Mii published (expires in 48 hours)!', 'success');
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
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-black text-slate-900 flex items-center gap-1">
            <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
            <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-950 font-black tracking-tight">
              Mii™®©℠
            </span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono font-semibold">48H Disappearing</span>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto scrollbar-none py-1">
          {/* Create Mii Button */}
          <button
            type="button"
            onClick={() => setIsMiiCreatorOpen(true)}
            className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer focus:outline-none"
          >
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-orange-400 flex items-center justify-center bg-orange-50/60 group-hover:bg-orange-100 group-hover:scale-105 transition-all shadow-xs border text-orange-950 font-black">
              <PlusIcon className="w-5 h-5 text-orange-600 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold text-slate-800 tracking-tight">Create Mii™®©℠</span>
          </button>

          {/* Story Avatars */}
          {miiStories.map((story) => (
            <button
              key={story.id}
              type="button"
              onClick={() => handleSelectStory(story)}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group focus:outline-none"
            >
              <div
                className={`w-14 h-14 rounded-full p-[2px] transition-all group-hover:scale-105 shadow-xs ${
                  story.isViewed
                    ? 'border-2 border-slate-300'
                    : 'border-2 border-orange-500 ring-2 ring-orange-200/50'
                }`}
              >
                <img
                  src={story.avatar}
                  alt={story.author}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="text-[10px] font-bold text-slate-800 truncate max-w-[62px]">
                {story.author.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Mii Story Viewer Modal */}
      {selectedMii && (
        <div
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedMii(null)}
        >
          <div
            className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={selectedMii.avatar}
                  alt={selectedMii.author}
                  className="w-8 h-8 rounded-full object-cover border-2 border-orange-500"
                />
                <div>
                  <span className="font-bold text-xs block text-white">{selectedMii.author}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{selectedMii.expiresIn}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMii(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-700"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center bg-black/60 max-h-[60vh] overflow-hidden">
              {selectedMii.type === 'video' ? (
                <video src={selectedMii.mediaUrl} controls autoPlay className="max-h-full max-w-full rounded-xl object-contain" />
              ) : selectedMii.type === 'audio' ? (
                <div className="p-8 text-center space-y-3">
                  <MusicalNoteIcon className="w-16 h-16 text-orange-400 mx-auto animate-bounce" />
                  <audio src={selectedMii.mediaUrl} controls autoPlay className="w-full" />
                </div>
              ) : (
                <img
                  src={selectedMii.mediaUrl}
                  alt={selectedMii.author}
                  className="max-h-full max-w-full rounded-xl object-contain"
                />
              )}
            </div>
            <div className="p-3 bg-slate-950 border-t border-slate-800">
              <p className="text-xs text-slate-200 leading-relaxed">{selectedMii.caption}</p>
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
              <button
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
                <p className="text-[10px] text-slate-500">Auto-expires in 48 Hours</p>
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
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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
