/*
 * FingerMobile Protocol™ - 4K Video Player & Lightbox Modal
 * Stream, inspect, and license 4K sovereign cinematic media assets
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useRef, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  X,
  Film,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { CuratedMediaItem } from '../../data/curatedPhotoCredits';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoItem: CuratedMediaItem | null;
  // eslint-disable-next-line no-unused-vars
  onLicense: (item: CuratedMediaItem) => void;
}

export const FingerMobileVideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  videoItem,
  onLicense
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  if (!isOpen || !videoItem) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white shadow-md">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  4K UHD Cinema Stream
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {videoItem.cohort}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5 line-clamp-1">
                {videoItem.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Close Player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Canvas */}
        <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden group">
          <video
            ref={videoRef}
            src={videoItem.videoUrl}
            poster={videoItem.imageUrl}
            autoPlay
            loop
            playsInline
            muted={isMuted}
            className="w-full h-full object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Quick Play/Pause Center Overlay */}
          <button type="button" aria-label="Pause"
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors group"
          >
            <div className="w-16 h-16 rounded-full bg-slate-950/80 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
              {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
            </div>
          </button>

          {/* Bottom Floating Video Controls */}
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button type="button" aria-label="Pause"
                onClick={togglePlay}
                className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button type="button" aria-label="Toggle mute"
                onClick={toggleMute}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="font-mono text-[11px] text-amber-300 font-bold">
                4K 60FPS • PRORES MASTER
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFullscreen}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Info and Sovereign Licensing Footer */}
        <div className="p-4 sm:p-6 bg-slate-950/90 border-t border-slate-800 overflow-y-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <span>Director/Photographer:</span>
                <span className="text-white font-bold">{videoItem.photographer}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-200">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {videoItem.location}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium mt-1">
                {videoItem.description}
              </p>
            </div>

            <div className="flex items-baseline gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl shrink-0">
              <span className="text-xs uppercase font-bold text-slate-300">License:</span>
              <span className="text-lg font-black text-amber-400">🪙 {videoItem.price_credits} FIC</span>
            </div>
          </div>

          {/* Camera EXIF Details */}
          {videoItem.camera_info && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div>
                <span className="text-slate-300 font-semibold">Cinema Body:</span>{' '}
                <span className="text-white font-bold">{videoItem.camera_info.camera}</span>
              </div>
              <div>
                <span className="text-slate-300 font-semibold">Lens:</span>{' '}
                <span className="text-white font-bold">{videoItem.camera_info.lens}</span>
              </div>
              <div>
                <span className="text-slate-300 font-semibold">Aperture:</span>{' '}
                <span className="text-white font-bold">{videoItem.camera_info.aperture}</span>
              </div>
              <div>
                <span className="text-slate-300 font-semibold">Shutter/FPS:</span>{' '}
                <span className="text-white font-bold">{videoItem.camera_info.shutter}</span>
              </div>
            </div>
          )}

          {/* CTA Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => {
                onClose();
                onLicense(videoItem);
              }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-amber-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Acquire 4K Master Video License (80% Creator Royalty)
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
