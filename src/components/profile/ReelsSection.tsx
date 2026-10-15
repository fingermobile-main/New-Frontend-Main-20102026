/*
 * FingerMobile Protocol™ - Reels Short-Form Video & Creator Management Section
 * Document: Member Users Profile Page Wall Charter Development 15102026.md (Section 7)
 * Enforces maximum 30 seconds playtime constraint on uploaded videos (Line 1214).
 * Supports "Your reels" and "Saved reels" tabs, looping preview, views, and creator studio.
 * Strictly compliant with WCAG AAA contrast hierarchy standards.
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useRef } from 'react';
import {
  Film,
  Plus,
  Play,
  Heart,
  Eye,
  Bookmark,
  Share2,
  Clock,
  Sparkles,
  Music,
  XCircle,
  UploadCloud,
  Check,
  AlertTriangle
} from 'lucide-react';

export interface ReelItem {
  id: string;
  title: string;
  videoUrl: string;
  durationSeconds: number; // <= 30s
  viewsCount: number;
  likesCount: number;
  audioTrack: string;
  isSaved?: boolean;
  isYourReel?: boolean;
  createdAt: string;
}

interface ReelsSectionProps {
  isOwner: boolean;
  // eslint-disable-next-line no-unused-vars
  onToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ReelsSection: React.FC<ReelsSectionProps> = ({ isOwner, onToast }) => {
  const [activeReelsTab, setActiveReelsTab] = useState<'your' | 'saved'>('your');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Initial Reels State (all duration <= 30 seconds as mandated)
  const [reels, setReels] = useState<ReelItem[]>([
    {
      id: 'reel-1',
      title: 'Decentralized Sovereign Enclave Demo (24s)',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42352-large.mp4',
      durationSeconds: 24,
      viewsCount: 14200,
      likesCount: 2310,
      audioTrack: 'FingerMobile - Afrobeat Synthstem 96kHz',
      isSaved: false,
      isYourReel: true,
      createdAt: '12 Oct 2026'
    },
    {
      id: 'reel-2',
      title: 'BeatwaveNG SoundMasters Master Stems Walkthrough (18s)',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-sound-mixer-in-a-studio-41444-large.mp4',
      durationSeconds: 18,
      viewsCount: 9800,
      likesCount: 1420,
      audioTrack: 'Beatwave SoundMasters - Studio Live Take #4',
      isSaved: true,
      isYourReel: true,
      createdAt: '10 Oct 2026'
    },
    {
      id: 'reel-3',
      title: 'OwnIt Atelier Provenance Verification (28s)',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-computer-technology-800-large.mp4',
      durationSeconds: 28,
      viewsCount: 6540,
      likesCount: 890,
      audioTrack: 'OwnIt - Sovereign Heritage Loop #1',
      isSaved: true,
      isYourReel: false,
      createdAt: '08 Oct 2026'
    }
  ]);

  // Create Reel Form States
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [newReelTitle, setNewReelTitle] = useState('');
  const [newReelAudio, setNewReelAudio] = useState('FingerMobile Original Stem - 96kHz');
  const [newReelVideoUrl, setNewReelVideoUrl] = useState('');
  const [newReelDuration, setNewReelDuration] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    const objectUrl = URL.createObjectURL(file);
    videoElement.src = objectUrl;

    videoElement.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      const duration = Math.round(videoElement.duration);

      // Enforce 30-second maximum playtime constraint
      if (duration > 30) {
        setUploadError(
          `Video playtime is ${duration} seconds. Under the Charter, uploaded reels cannot exceed 30 seconds playtime maximum.`
        );
        if (videoInputRef.current) videoInputRef.current.value = '';
        return;
      }

      setNewReelDuration(duration);

      const reader = new FileReader();
      reader.onload = () => {
        setNewReelVideoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    };

    videoElement.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setUploadError('Failed to inspect video duration. Please upload a valid MP4 or WebM video file.');
    };
  };

  const handlePublishReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReelTitle.trim() || !newReelVideoUrl) return;

    const newReel: ReelItem = {
      id: `reel-${Date.now()}`,
      title: newReelTitle.trim(),
      videoUrl: newReelVideoUrl,
      durationSeconds: newReelDuration || 15,
      viewsCount: 1,
      likesCount: 1,
      audioTrack: newReelAudio.trim() || 'FingerMobile Original Stem',
      isSaved: false,
      isYourReel: true,
      createdAt: 'Just now'
    };

    setReels([newReel, ...reels]);
    setIsCreateModalOpen(false);
    setNewReelTitle('');
    setNewReelVideoUrl('');
    setNewReelDuration(0);
    if (onToast) onToast('Reel published to Sovereign Video Feed! Playtime checked ≤30s.', 'success');
  };

  const handleToggleSave = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const nextSaved = !r.isSaved;
          if (onToast) {
            onToast(nextSaved ? 'Reel saved to collections!' : 'Reel removed from saved.', 'info');
          }
          return { ...r, isSaved: nextSaved };
        }
        return r;
      })
    );
  };

  const handleLikeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => (r.id === reelId ? { ...r, likesCount: r.likesCount + 1 } : r))
    );
  };

  const filteredReels =
    activeReelsTab === 'your'
      ? reels.filter((r) => r.isYourReel)
      : reels.filter((r) => r.isSaved);

  return (
    <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-sm space-y-6">
      {/* 1. Header with Title & Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-orange-100 text-orange-950 border border-orange-300">
            <Film className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Sovereign Reels & Short-Form Video</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-950 border border-amber-300">
                Max 30s Playtime
              </span>
            </h3>
            <p className="text-xs font-medium text-slate-700">
              High-frequency short-form video streaming with lossless audio stem attribution and creator analytics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-tabs: Your reels vs Saved reels */}
          <div className="p-1 rounded-xl bg-slate-100 border border-slate-300 flex items-center">
            <button
              type="button"
              onClick={() => setActiveReelsTab('your')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeReelsTab === 'your'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Your Reels ({reels.filter((r) => r.isYourReel).length})
            </button>
            <button
              type="button"
              onClick={() => setActiveReelsTab('saved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeReelsTab === 'saved'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Saved Reels ({reels.filter((r) => r.isSaved).length})
            </button>
          </div>

          {isOwner && (
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-orange-400" />
              <span>Create Reel</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Reels Grid */}
      {filteredReels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredReels.map((reel) => (
            <div
              key={reel.id}
              className="group rounded-3xl overflow-hidden border border-slate-300 bg-slate-950 flex flex-col justify-between shadow-sm hover:shadow-md transition-all relative aspect-[9/16] max-h-[480px]"
            >
              {/* Video Player */}
              <video
                src={reel.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Ambient Top Glow & Duration Tag */}
              <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 via-transparent to-transparent flex items-center justify-between text-white z-10">
                <span className="px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-mono font-bold border border-white/20 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{reel.durationSeconds}s / 30s max</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleSave(reel.id)}
                  className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                    reel.isSaved ? 'bg-amber-500 text-slate-950' : 'bg-black/50 text-white hover:bg-black/80'
                  }`}
                  title={reel.isSaved ? 'Remove from saved' : 'Save reel'}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${reel.isSaved ? 'fill-slate-950' : ''}`} />
                </button>
              </div>

              {/* Bottom Metadata & Engagement Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white space-y-2 z-10">
                <h4 className="text-xs font-black leading-snug line-clamp-2">{reel.title}</h4>

                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-300">
                  <Music className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{reel.audioTrack}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/20 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => handleLikeReel(reel.id)}
                    className="flex items-center gap-1 hover:text-red-400 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                    <span>{reel.likesCount.toLocaleString()}</span>
                  </button>

                  <div className="flex items-center gap-1 text-slate-300">
                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                    <span>{reel.viewsCount.toLocaleString()}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      if (onToast) onToast('Reel link copied!', 'success');
                    }}
                    className="hover:text-orange-400 transition-colors"
                    title="Share Reel"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl border border-slate-300 bg-slate-50 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <Film className="w-6 h-6" />
          </div>
          <h4 className="text-base font-black text-slate-900">
            {activeReelsTab === 'your' ? 'No Reels Published Yet' : 'No Saved Reels'}
          </h4>
          <p className="text-xs font-medium text-slate-700 max-w-sm mx-auto">
            {activeReelsTab === 'your'
              ? 'Record or upload a 15–30 second short-form video clip with lossless audio stems.'
              : 'Browse sovereign reels from creators and bookmark them to your collection.'}
          </p>
          {isOwner && activeReelsTab === 'your' && (
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4 text-orange-400" />
              <span>Create Your First Reel</span>
            </button>
          )}
        </div>
      )}

      {/* 3. Create Reel Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-black text-slate-900">Create Sovereign Reel (Max 30s)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-300 text-red-950 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handlePublishReel} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Reel Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Decentralized Media Enclave Demo"
                  value={newReelTitle}
                  onChange={(e) => setNewReelTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Audio Stem / Music Attribution
                </label>
                <input
                  type="text"
                  value={newReelAudio}
                  onChange={(e) => setNewReelAudio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Select Video File (MP4/WebM ≤ 30 Seconds)
                </label>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={handleVideoSelect}
                  className="w-full text-xs font-bold text-slate-800 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border file:border-slate-300 file:text-xs file:font-bold file:bg-slate-100 hover:file:bg-slate-200"
                />
                {newReelDuration > 0 && (
                  <p className="text-[11px] font-bold text-emerald-800 mt-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Duration verified: {newReelDuration}s (Within 30s limit)</span>
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newReelTitle.trim() || !newReelVideoUrl}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold shadow-sm"
                >
                  Publish Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReelsSection;
