/*
 * FingerMobile Protocol™ - Full-Screen Media Viewer & Cinematic Carousel Lightbox Modal
 * Displays high-resolution photographs & 4K UHD videos with smooth slide-in-from-right transitions
 * Includes Autonomous P2P UGC Shuffling (10s cadence), EXIF data, AI Quality score & 80/20 Licensing
 * Adheres strictly to Workspace High-Contrast Rules (AGENTS.md)
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  FolderHeart,
  Bookmark,
  Star,
  Share2,
  Download,
  Cpu,
  Camera,
  MapPin,
  ShieldCheck,
  Film,
  Sparkles,
  Shuffle,
  Timer
} from 'lucide-react';
import type { PhotoCreditItem } from '../../pages/PhotoCreditsPage';

export interface FullScreenMediaItem {
  id: string;
  title: string;
  imageUrl: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  media_type?: 'image' | 'video' | 'audio';
  photographer?: string;
  photographer_id?: string;
  author?: string;
  author_avatar?: string;
  category?: string;
  cohort?: string;
  location?: string;
  description?: string;
  caption?: string;
  likes?: number;
  saves?: number;
  comments?: number;
  downloads?: number;
  shares?: number;
  rating?: number;
  aiScore?: number;
  price_credits?: number;
  license_type?: string;
  camera_info?: {
    camera?: string;
    lens?: string;
    iso?: number;
    shutter?: string;
    aperture?: string;
    focalLength?: string;
  };
  hasLiked?: boolean;
  isSaved?: boolean;
  isBookmarked?: boolean;
  isFavorite?: boolean;
}

interface FullScreenMediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<FullScreenMediaItem | PhotoCreditItem | any>;
  initialIndex?: number;
  /* eslint-disable no-unused-vars */
  onLike?: (item: any) => void;
  onSave?: (item: any) => void;
  onBookmark?: (item: any) => void;
  onToggleFavorite?: (item: any) => void;
  onShare?: (item: any) => void;
  onLicense?: (item: any) => void;
  onInspectAi?: (item: any) => void;
  isLiked?: (id: string) => boolean;
  isSaved?: (id: string) => boolean;
  /* eslint-enable no-unused-vars */
}

export const FullScreenMediaViewerModal: React.FC<FullScreenMediaViewerModalProps> = ({
  isOpen,
  onClose,
  items,
  initialIndex = 0,
  onLike,
  onSave,
  onBookmark,
  onToggleFavorite,
  onShare,
  onLicense,
  onInspectAi
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');
  const [isAutoPlayP2P, setIsAutoPlayP2P] = useState<boolean>(true);
  const [autoPlayProgress, setAutoPlayProgress] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState<boolean>(false);
  const [showMetadataPanel, setShowMetadataPanel] = useState<boolean>(false);
  const [animKey, setAnimKey] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const thumbnailScrollRef = useRef<HTMLDivElement | null>(null);

  // Sync initialIndex whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const validIndex = Math.max(0, Math.min(initialIndex, items.length - 1));
      setCurrentIndex(validIndex);
      setSlideDirection('right');
      setAutoPlayProgress(0);
      setAnimKey((k) => k + 1);
    }
  }, [isOpen, initialIndex, items.length]);

  const activeItem = items[currentIndex] || items[0];
  const isVideo = activeItem?.media_type === 'video' || Boolean(activeItem?.videoUrl);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (items.length <= 1) return;
    setSlideDirection('right');
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setAutoPlayProgress(0);
    setAnimKey((k) => k + 1);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    if (items.length <= 1) return;
    setSlideDirection('left');
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setAutoPlayProgress(0);
    setAnimKey((k) => k + 1);
  }, [items.length]);

  // Autonomous P2P UGC Shuffling & Slide Cadence (every 10 seconds)
  useEffect(() => {
    if (!isOpen || !isAutoPlayP2P || items.length <= 1) return;

    const intervalTime = 100; // tick every 100ms
    const totalDuration = 10000; // 10 seconds
    const step = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setAutoPlayProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, isAutoPlayP2P, items.length, handleNext]);

  // Keep thumbnail in view
  useEffect(() => {
    if (!thumbnailScrollRef.current) return;
    const activeThumb = thumbnailScrollRef.current.children[currentIndex] as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentIndex]);

  // Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ' && !['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        e.preventDefault();
        if (isVideo && videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play();
            setIsVideoPlaying(true);
          } else {
            videoRef.current.pause();
            setIsVideoPlaying(false);
          }
        } else {
          setIsAutoPlayP2P((p) => !p);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose, isVideo]);

  // Native Fullscreen toggle
  const toggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsNativeFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsNativeFullscreen(false);
    }
  };

  if (!isOpen || !activeItem) return null;

  const creatorName = activeItem.photographer || activeItem.author || 'Verified Creator';
  const creatorAvatar = activeItem.author_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${creatorName}`;
  const displayTitle = activeItem.title || activeItem.caption || 'Sovereign Master Asset';
  const aiScore = activeItem.aiScore ?? Math.min(99, Math.round(((activeItem.rating || 4.9) / 5) * 100));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between overflow-hidden text-white animate-in fade-in duration-200 select-none"
    >
      {/* 1. TOP PROGRESS BAR (10-Second P2P Cadence) */}
      <div className="w-full h-1.5 bg-slate-900 overflow-hidden relative z-40">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-400 transition-all duration-100 ease-linear"
          style={{ width: `${isAutoPlayP2P ? autoPlayProgress : 0}%` }}
        />
      </div>

      {/* 2. TOP HEADER BAR */}
      <div className="p-3 sm:p-5 flex items-center justify-between gap-3 bg-gradient-to-b from-black/90 via-black/60 to-transparent z-30">
        {/* Creator Info & Metadata Badges */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <img
              src={creatorAvatar}
              alt={creatorName}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-amber-400 shadow-md"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm sm:text-base text-white truncate">{creatorName}</span>
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              {activeItem.category && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {activeItem.category}
                </span>
              )}
              {isVideo && (
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-sm">
                  <Film className="w-2.5 h-2.5" /> 4K UHD
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 truncate max-w-md sm:max-w-xl font-medium mt-0.5">
              {displayTitle} {activeItem.location && `• ${activeItem.location}`}
            </p>
          </div>
        </div>

        {/* Controls: P2P Auto-slide, Fullscreen, Metadata, Close */}
        <div className="flex items-center gap-2 shrink-0">
          {/* P2P 10-Second Shuffle Toggle */}
          <button
            onClick={() => setIsAutoPlayP2P(!isAutoPlayP2P)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              isAutoPlayP2P
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title={isAutoPlayP2P ? 'P2P Auto-Shuffle Active (10s)' : 'P2P Auto-Shuffle Paused'}
          >
            <Shuffle className={`w-3.5 h-3.5 ${isAutoPlayP2P ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">10s P2P Shuffle</span>
          </button>

          {/* AI Quality Score Button */}
          <button
            onClick={() => onInspectAi?.(activeItem)}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-amber-400/50 text-amber-300 text-xs font-bold hover:bg-slate-800 transition"
            title="Inspect Autonomous AI Valuation"
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>{aiScore}% AI</span>
          </button>

          {/* Toggle Camera/EXIF details */}
          {activeItem.camera_info && (
            <button
              onClick={() => setShowMetadataPanel(!showMetadataPanel)}
              className={`p-2 rounded-xl border transition ${
                showMetadataPanel
                  ? 'bg-slate-800 text-amber-300 border-amber-400'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Camera Specs & EXIF Data"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}

          {/* Native Fullscreen Button */}
          <button
            onClick={toggleNativeFullscreen}
            className="p-2 rounded-xl bg-slate-900/80 text-slate-300 border border-slate-700 hover:text-white transition"
            title="Toggle Native Browser Fullscreen"
          >
            {isNativeFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Lightbox */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-rose-600/90 text-white hover:bg-rose-500 transition shadow-lg"
            title="Close Full Screen View (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. MAIN CINEMATIC STAGE WITH SLIDE-IN-FROM-RIGHT TRANSITION */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 sm:left-6 z-30 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-black/90 text-white border border-slate-700 hover:border-amber-400 transition-all transform hover:scale-110 shadow-2xl backdrop-blur-md"
              title="Previous Media (Arrow Left)"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 sm:right-6 z-30 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-black/90 text-white border border-slate-700 hover:border-amber-400 transition-all transform hover:scale-110 shadow-2xl backdrop-blur-md"
              title="Next Media - Slide in from right (Arrow Right)"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </>
        )}

        {/* Media Canvas with Animated Slide-In-From-Right */}
        <div
          key={`${activeItem.id}-${animKey}`}
          className={`relative max-w-full max-h-[78vh] flex items-center justify-center ${
            slideDirection === 'right'
              ? 'animate-in slide-in-from-right duration-300'
              : 'animate-in slide-in-from-left duration-300'
          }`}
        >
          {isVideo ? (
            <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800">
              <video
                ref={videoRef}
                src={activeItem.videoUrl || activeItem.imageUrl}
                autoPlay
                loop
                muted={isVideoMuted}
                playsInline
                className="max-h-[72vh] max-w-full object-contain"
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              />

              {/* Video Floating Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-slate-700/80 z-20">
                <div className="flex items-center gap-3">
                  <button type="button" aria-label="Pause"
                    onClick={() => {
                      if (!videoRef.current) return;
                      if (isVideoPlaying) {
                        videoRef.current.pause();
                        setIsVideoPlaying(false);
                      } else {
                        videoRef.current.play();
                        setIsVideoPlaying(true);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                  >
                    {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  <button type="button" aria-label="Toggle mute"
                    onClick={() => {
                      if (!videoRef.current) return;
                      videoRef.current.muted = !isVideoMuted;
                      setIsVideoMuted(!isVideoMuted);
                    }}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                  >
                    {isVideoMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>

                  <span className="text-[11px] font-mono text-slate-300">
                    4K UHD WebRTC Master Stream
                  </span>
                </div>

                <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider">
                  Live Cinema
                </span>
              </div>
            </div>
          ) : (
            <img
              src={activeItem.imageUrl}
              alt={displayTitle}
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl border border-slate-800/80"
            />
          )}
        </div>

        {/* Floating EXIF Metadata Drawer */}
        {showMetadataPanel && activeItem.camera_info && (
          <div className="absolute right-4 bottom-20 z-40 max-w-xs p-4 rounded-2xl bg-slate-950/95 border border-amber-500/40 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase">
                <Camera className="w-3.5 h-3.5 text-amber-400" /> Hardware EXIF
              </span>
              <button aria-label="Close" type="button" onClick={() => setShowMetadataPanel(false)} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Camera:</span>
                <span className="text-white font-bold">{activeItem.camera_info.camera || 'Sony Alpha A7R V'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lens:</span>
                <span className="text-white font-bold">{activeItem.camera_info.lens || 'FE 24-70mm GM II'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Aperture:</span>
                <span className="text-white font-bold">{activeItem.camera_info.aperture || 'f/2.8'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Shutter:</span>
                <span className="text-white font-bold">{activeItem.camera_info.shutter || '1/250s'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ISO:</span>
                <span className="text-white font-bold">{activeItem.camera_info.iso || 100}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. BOTTOM ACTION & THUMBNAIL REEL BAR */}
      <div className="p-3 sm:p-5 bg-gradient-to-t from-black via-black/80 to-transparent z-30 space-y-3">
        {/* Action Row */}
        <div className="flex items-center justify-between flex-wrap gap-3 max-w-7xl mx-auto px-2">
          {/* Left: Like, Save to Gallery, Bookmark, Favorite, Share */}
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Like"
              onClick={() => onLike?.(activeItem)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                activeItem.hasLiked
                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:text-red-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${activeItem.hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{activeItem.likes || 0}</span>
            </button>

            <button
              onClick={() => onSave?.(activeItem)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                activeItem.isSaved
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:text-rose-300'
              }`}
              title="Save to My Gallery (+10 pts)"
            >
              <FolderHeart className={`w-3.5 h-3.5 ${activeItem.isSaved ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span className="hidden sm:inline">Save</span>
            </button>

            <button
              onClick={() => onBookmark?.(activeItem)}
              className={`p-2 rounded-xl border transition ${
                activeItem.isBookmarked
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:text-amber-400'
              }`}
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${activeItem.isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => onToggleFavorite?.(activeItem)}
              className={`p-2 rounded-xl border transition ${
                activeItem.isFavorite
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:text-amber-400'
              }`}
              title="Favorite"
            >
              <Star className={`w-4 h-4 ${activeItem.isFavorite ? 'fill-slate-950' : ''}`} />
            </button>

            <button
              onClick={() => onShare?.(activeItem)}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>

          {/* Right: Instant License / Download */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                {activeItem.license_type || 'Royalty-Free Standard'}
              </span>
              <span className="text-xs font-black text-amber-300">
                🪙 {activeItem.price_credits || 0} FIC (80% Creator Royalty)
              </span>
            </div>

            <button
              onClick={() => onLicense?.(activeItem)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-amber-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transform hover:scale-105 transition"
            >
              <Download className="w-4 h-4" />
              Acquire License
            </button>
          </div>
        </div>

        {/* Thumbnail Selector Strip (Sliding Gallery Preview) */}
        {items.length > 1 && (
          <div
            ref={thumbnailScrollRef}
            className="flex items-center gap-2 overflow-x-auto pb-1 max-w-7xl mx-auto scrollbar-none"
          >
            {items.map((item, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => {
                    setSlideDirection(idx > currentIndex ? 'right' : 'left');
                    setCurrentIndex(idx);
                    setAutoPlayProgress(0);
                    setAnimKey((k) => k + 1);
                  }}
                  className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    isSelected
                      ? 'border-amber-400 scale-105 shadow-lg shadow-amber-500/30'
                      : 'border-slate-800 opacity-50 hover:opacity-100 hover:border-slate-600'
                  }`}
                >
                  <img
                    src={item.thumbnailUrl || item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.media_type === 'video' && (
                    <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-600 flex items-center justify-center">
                      <Play className="w-2 h-2 text-white fill-white" />
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FullScreenMediaViewerModal;
