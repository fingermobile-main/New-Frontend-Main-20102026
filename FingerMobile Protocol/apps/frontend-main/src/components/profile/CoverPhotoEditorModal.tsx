/* eslint-disable no-unused-vars */
/*
 * FingerMobile Protocol™ - Sovereign Cover Photo Editor & Studio Modal
 * Standard Dimensions Engine:
 * - Profile & Page Cover: 851 x 315 px (displays 820 x 312 desktop, 640 x 360 mobile, min 400 x 150 px)
 *   * Profile picture overlaps bottom-left on desktop & mobile
 * - Group Cover: 1640 x 856 px (~1.91:1)
 * - Event Cover: 1920 x 1005 px (or 1200 x 628 px)
 * - Profile / Company Banner: 1584 x 396 px (4:1)
 * - Sovereign Ultra HD Master Canvas: 2560 x 1440 px (min 2048 x 1152 px, Safe Area for text & logos: 1546 x 423 px)
 *
 * Quality: Rich and high (4K & UHD) maintained at all times.
 * WCAG AAA Contrast Compliant.
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  UploadCloud,
  Check,
  Eye,
  EyeOff,
  MoveVertical,
  ZoomIn,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Monitor,
  Smartphone,
  Layers,
  Image as ImageIcon,
  Sliders,
  Maximize2
} from 'lucide-react';

export type CoverFormatKey =
  | 'profile-page'
  | 'group-cover'
  | 'event-cover'
  | 'company-banner'
  | 'uhd-master';

export interface CoverFormatSpec {
  key: CoverFormatKey;
  title: string;
  recommendedWidth: number;
  recommendedHeight: number;
  desktopDisplay?: string;
  mobileDisplay?: string;
  minWidth: number;
  minHeight: number;
  aspectRatio: string;
  aspectRatioValue: number; // width / height
  safeArea?: {
    width: number;
    height: number;
    description: string;
  };
  notes: string;
  badge: string;
}

export const COVER_FORMAT_SPECS: Record<CoverFormatKey, CoverFormatSpec> = {
  'profile-page': {
    key: 'profile-page',
    title: 'Profile & Page Cover',
    recommendedWidth: 851,
    recommendedHeight: 315,
    desktopDisplay: '820 × 312 px',
    mobileDisplay: '640 × 360 px',
    minWidth: 400,
    minHeight: 150,
    aspectRatio: '2.7:1 (851×315)',
    aspectRatioValue: 851 / 315,
    notes: 'Profile pictures overlap the bottom-left on desktop and mobile.',
    badge: 'Standard Profile'
  },
  'group-cover': {
    key: 'group-cover',
    title: 'Group Cover',
    recommendedWidth: 1640,
    recommendedHeight: 856,
    desktopDisplay: 'Full Responsive',
    mobileDisplay: 'Scaled 1.91:1',
    minWidth: 820,
    minHeight: 428,
    aspectRatio: '~1.91:1 (1640×856)',
    aspectRatioValue: 1640 / 856,
    notes: 'Optimized for community headers, sovereign guild walls & group hubs.',
    badge: 'Guild & Groups'
  },
  'event-cover': {
    key: 'event-cover',
    title: 'Event Cover',
    recommendedWidth: 1920,
    recommendedHeight: 1005,
    desktopDisplay: '1920 × 1005 px',
    mobileDisplay: '1200 × 628 px fallback',
    minWidth: 1200,
    minHeight: 628,
    aspectRatio: '~1.91:1 (1920×1005 / 1200×628)',
    aspectRatioValue: 1920 / 1005,
    notes: 'High-impact panoramic resolution for summits, streams & calendar showcases.',
    badge: 'Summits & Events'
  },
  'company-banner': {
    key: 'company-banner',
    title: 'Profile / Company Banner',
    recommendedWidth: 1584,
    recommendedHeight: 396,
    desktopDisplay: '1584 × 396 px',
    mobileDisplay: 'Scaled 4:1',
    minWidth: 792,
    minHeight: 198,
    aspectRatio: '4:1 (1584×396)',
    aspectRatioValue: 1584 / 396,
    notes: 'Ultra-wide panoramic header for corporate nodes, enterprise suites & verified institutions.',
    badge: 'Enterprise 4:1'
  },
  'uhd-master': {
    key: 'uhd-master',
    title: 'Ultra HD Sovereign Master Canvas',
    recommendedWidth: 2560,
    recommendedHeight: 1440,
    desktopDisplay: '2560 × 1440 px (QHD/UHD)',
    mobileDisplay: 'Responsive Safe Area',
    minWidth: 2048,
    minHeight: 1152,
    aspectRatio: '16:9 (2560×1440)',
    aspectRatioValue: 2560 / 1440,
    safeArea: {
      width: 1546,
      height: 423,
      description: 'Safe area for text and logos is 1546 × 423 pixels.'
    },
    notes: 'Minimum size is 2048 × 1152 px. Safe area for text and logos is 1546 × 423 pixels.',
    badge: '4K / UHD Master'
  }
};

export interface CuratedCoverPreset {
  id: string;
  title: string;
  category: string;
  url: string;
  width: number;
  height: number;
  description: string;
}

export const CURATED_4K_PRESETS: CuratedCoverPreset[] = [
  {
    id: 'fingermobile-matrix',
    title: 'FingerMobile Sovereign Grid',
    category: 'Official Brand',
    url: '/assets/branding/backgrounds/FingerMobile Login screen Background image.webp',
    width: 3840,
    height: 2160,
    description: 'Official FingerMobile dark teal & cybernetic security matrix.'
  },
  {
    id: 'obsidian-gold',
    title: 'Obsidian & Sovereign Gold Enclave',
    category: 'Cryptographic',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=3840&q=95&auto=format&fit=crop',
    width: 3840,
    height: 2160,
    description: 'Luminous liquid gold veins over deep basalt sovereign stone in 4K UHD.'
  },
  {
    id: 'lagos-twilight',
    title: 'Lagos Waterfront Megacity Dusk',
    category: 'Heritage & Hub',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=3840&q=95&auto=format&fit=crop',
    width: 3840,
    height: 2160,
    description: 'Vibrant coastal twilight reflections and modern metropolitan radiance in 4K UHD.'
  },
  {
    id: 'zkp-matrix',
    title: 'Cybernetic ZKP Luminescent Network',
    category: 'Decentralized Tech',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=3840&q=95&auto=format&fit=crop',
    width: 3840,
    height: 2160,
    description: 'Deep emerald nodes and quantum cryptographic fiber mesh in 4K UHD.'
  },
  {
    id: 'heritage-sunburst',
    title: 'Heritage Terracotta & African Horizon',
    category: 'Sovereign Culture',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=3840&q=95&auto=format&fit=crop',
    width: 3840,
    height: 2160,
    description: 'Warm crimson dawn and panoramic golden dunes in crisp 4K UHD.'
  },
  {
    id: 'ocean-aurora',
    title: 'Abyssal Deep Ocean Aurora',
    category: 'Nature & Radiance',
    url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=3840&q=95&auto=format&fit=crop',
    width: 3840,
    height: 2160,
    description: 'Bioluminescent deep sapphire oceanic currents in 4K UHD fidelity.'
  }
];

export interface CoverPhotoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (coverData: {
    coverPhotoUrl: string;
    coverPositionY: number;
    coverFormat: CoverFormatKey;
    zoomLevel: number;
  }) => void;
  currentCoverUrl?: string;
  currentPositionY?: number;
  currentFormat?: CoverFormatKey;
}

export const CoverPhotoEditorModal: React.FC<CoverPhotoEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentCoverUrl,
  currentPositionY = 50,
  currentFormat = 'profile-page'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Active cover format spec
  const [selectedFormat, setSelectedFormat] = useState<CoverFormatKey>(currentFormat);
  const activeSpec = COVER_FORMAT_SPECS[selectedFormat];

  // Selected cover image URL & adjustments
  const [coverUrl, setCoverUrl] = useState<string>(
    currentCoverUrl || '/assets/branding/backgrounds/FingerMobile Login screen Background image.webp'
  );
  const [positionY, setPositionY] = useState<number>(currentPositionY);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [showGuides, setShowGuides] = useState<boolean>(true);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [isApplyingCustomUrl, setIsApplyingCustomUrl] = useState<boolean>(false);

  // Detected natural resolution & verification
  const [detectedResolution, setDetectedResolution] = useState<{ width: number; height: number }>({
    width: 3840,
    height: 2160
  });
  const [isCheckingDimensions, setIsCheckingDimensions] = useState<boolean>(false);

  // Detect image resolution when coverUrl changes
  useEffect(() => {
    if (!coverUrl) return;
    setIsCheckingDimensions(true);
    const img = new Image();
    img.src = coverUrl;
    img.onload = () => {
      setDetectedResolution({
        width: img.naturalWidth || 2560,
        height: img.naturalHeight || 1440
      });
      setIsCheckingDimensions(false);
    };
    img.onerror = () => {
      // Fallback
      setDetectedResolution({ width: 1920, height: 1080 });
      setIsCheckingDimensions(false);
    };
  }, [coverUrl]);

  if (!isOpen) return null;

  // Check if image meets recommended resolution or is 4K/UHD
  const is4K = detectedResolution.width >= 3840 || detectedResolution.height >= 2160;
  const isUHD = detectedResolution.width >= 2560 && detectedResolution.height >= 1440;
  const meetsMinSize =
    detectedResolution.width >= activeSpec.minWidth &&
    detectedResolution.height >= activeSpec.minHeight;

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPEG, WebP, AVIF).');
      return;
    }
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCoverUrl(dataUrl);
        setPositionY(50);
        setZoomLevel(1.0);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle custom URL submission
  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    setCoverUrl(customUrlInput.trim());
    setCustomUrlInput('');
    setIsApplyingCustomUrl(false);
  };

  const handleSaveAndApply = () => {
    onSave({
      coverPhotoUrl: coverUrl,
      coverPositionY: positionY,
      coverFormat: selectedFormat,
      zoomLevel
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-slate-300 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-md ring-2 ring-orange-400/40">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>Add / Edit Cover Photo Studio</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 font-mono font-bold">
                    Mii™ Identity
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                FingerMobile Sovereign Canvas Engine • 4K & UHD Ultra-Fidelity Standards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 text-[11px] font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>4K & UHD Quality Guaranteed</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-700 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {uploadError && (
            <div className="p-3.5 rounded-2xl bg-rose-100 border border-rose-400 text-rose-950 font-bold text-xs flex items-center justify-between">
              <span>⚠️ {uploadError}</span>
              <button
                type="button"
                onClick={() => setUploadError(null)}
                className="text-rose-950 font-black ml-2"
              >
                ✕
              </button>
            </div>
          )}
          {/* 1. COVER FORMAT STANDARDS SELECTOR */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                  Select Cover Dimension Standard
                </label>
                <p className="text-xs text-slate-700">
                  Choose the target layout dimension. Profile & Page Cover is default.
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300">
                Active: {activeSpec.title}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {(Object.keys(COVER_FORMAT_SPECS) as CoverFormatKey[]).map((key) => {
                const spec = COVER_FORMAT_SPECS[key];
                const isSelected = selectedFormat === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedFormat(key)}
                    className={`text-left p-3 rounded-2xl border transition-all text-xs relative ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/30 shadow-xs'
                        : 'border-slate-300 bg-slate-50/70 hover:bg-white hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-slate-900">{spec.title}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-orange-600 text-white'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {spec.badge}
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-800">
                      {spec.recommendedWidth} × {spec.recommendedHeight} px
                    </div>
                    <div className="text-[10px] text-slate-700 mt-1 line-clamp-1">
                      {spec.notes}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. LIVE INTERACTIVE CANVAS PREVIEW WITH SAFE AREA & OVERLAP GUIDES */}
          <div className="bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-white">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wide text-white uppercase flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-orange-400" />
                  Live Canvas Preview ({activeSpec.aspectRatio})
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Target: {activeSpec.recommendedWidth}×{activeSpec.recommendedHeight} px
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowGuides(!showGuides)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition border ${
                    showGuides
                      ? 'bg-orange-600/90 text-white border-orange-500 shadow-xs'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {showGuides ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{showGuides ? 'Hide Safe Guides' : 'Show Safe Guides'}</span>
                </button>
              </div>
            </div>

            {/* VISUAL PREVIEW CONTAINER */}
            <div
              className="relative w-full rounded-2xl overflow-hidden bg-black border-2 border-slate-700 shadow-2xl"
              style={{
                // Maintain accurate aspect ratio in preview container
                aspectRatio: `${activeSpec.aspectRatioValue}`
              }}
            >
              {/* Cover Image Element */}
              <img
                src={coverUrl}
                alt="Cover Preview"
                className="w-full h-full object-cover transition-all duration-150 ease-out"
                style={{
                  objectPosition: `center ${positionY}%`,
                  transform: `scale(${zoomLevel})`
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    '/assets/branding/backgrounds/FingerMobile Login screen Background image.webp';
                }}
              />

              {/* OVERLAY: SAFE AREA & OVERLAP GUIDES */}
              {showGuides && (
                <div className="absolute inset-0 pointer-events-none z-10">
                  {/* SPEC 1: Profile & Page Cover (851x315) -> Bottom-Left Profile Avatar Overlap Zone */}
                  {selectedFormat === 'profile-page' && (
                    <>
                      {/* Avatar Overlap Zone on Bottom Left */}
                      <div className="absolute bottom-2 left-4 sm:left-6 w-20 h-20 sm:w-28 sm:h-28 rounded-2xl border-2 border-dashed border-orange-400 bg-orange-950/40 backdrop-blur-xs p-1.5 flex flex-col justify-end shadow-lg">
                        <div className="bg-orange-900/90 text-orange-200 text-[9px] sm:text-[10px] font-black px-1 py-0.5 rounded leading-tight">
                          Avatar Overlap
                        </div>
                        <span className="text-[8px] text-orange-300 font-semibold hidden sm:block">
                          Desktop & Mobile
                        </span>
                      </div>

                      {/* Safe Display Cut-Off Labels */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-black/70 text-sky-300 border border-sky-500/40 backdrop-blur-xs flex items-center gap-1">
                          <Monitor className="w-3 h-3 text-sky-400" />
                          Desktop Display: 820 × 312 px
                        </span>
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-black/70 text-emerald-300 border border-emerald-500/40 backdrop-blur-xs flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-emerald-400" />
                          Mobile Display: 640 × 360 px
                        </span>
                      </div>
                    </>
                  )}

                  {/* SPEC 5: Ultra HD Sovereign Master Canvas (2560x1440) -> Safe Area for text and logos: 1546 x 423 px */}
                  {selectedFormat === 'uhd-master' && (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div
                        className="w-[60.4%] h-[29.4%] border-2 border-dashed border-emerald-400 bg-emerald-950/30 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center text-center p-2 shadow-2xl"
                        title="Safe Area for text and logos: 1546 x 423 pixels"
                      >
                        <span className="text-[10px] sm:text-xs font-black text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-400/50">
                          Safe Area for Text & Logos (1546 × 423 px)
                        </span>
                        <span className="text-[8px] sm:text-[9px] text-emerald-200 mt-0.5 font-medium hidden sm:block">
                          Content within this zone never gets cropped on mobile or desktop
                        </span>
                      </div>
                    </div>
                  )}

                  {/* SPEC 2: Group Cover (~1.91:1) */}
                  {selectedFormat === 'group-cover' && (
                    <div className="absolute inset-x-4 bottom-3 flex items-center justify-between text-[9px] font-mono text-amber-300 bg-black/60 px-3 py-1 rounded-lg border border-amber-500/40 backdrop-blur-xs">
                      <span>Group Canvas Aspect Ratio: ~1.91:1 (1640 × 856 px)</span>
                      <span>Min Size: 820 × 428 px</span>
                    </div>
                  )}

                  {/* SPEC 3: Event Cover */}
                  {selectedFormat === 'event-cover' && (
                    <div className="absolute inset-x-4 bottom-3 flex items-center justify-between text-[9px] font-mono text-purple-300 bg-black/60 px-3 py-1 rounded-lg border border-purple-500/40 backdrop-blur-xs">
                      <span>Event Canvas: 1920 × 1005 px (or 1200 × 628 px)</span>
                      <span>High Impact Stream Showcase</span>
                    </div>
                  )}

                  {/* SPEC 4: Profile / Company Banner (4:1) */}
                  {selectedFormat === 'company-banner' && (
                    <div className="absolute inset-x-4 bottom-2 flex items-center justify-between text-[9px] font-mono text-cyan-300 bg-black/60 px-3 py-0.5 rounded-lg border border-cyan-500/40 backdrop-blur-xs">
                      <span>Corporate Aspect Ratio: 4:1 (1584 × 396 px)</span>
                      <span>Enterprise Panoramic Banner</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RESOLUTION STATUS BAR */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-medium">Source Image Resolution:</span>
                <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {detectedResolution.width} × {detectedResolution.height} px
                </span>
                {is4K ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/50 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    4K UHD Verified
                  </span>
                ) : isUHD ? (
                  <span className="px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 text-[10px] font-bold border border-teal-500/50 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-teal-400" />
                    2.5K QHD Verified
                  </span>
                ) : meetsMinSize ? (
                  <span className="px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 text-[10px] font-bold border border-sky-500/50">
                    Meets Minimum Standard
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 text-[10px] font-bold border border-rose-500/50 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    Below Minimum ({activeSpec.minWidth}×{activeSpec.minHeight} px)
                  </span>
                )}
              </div>

              <div className="text-[11px] text-slate-300 font-medium">
                Minimum Required: <strong className="text-white">{activeSpec.minWidth} × {activeSpec.minHeight} px</strong>
              </div>
            </div>
          </div>

          {/* 3. REPOSITION & ZOOM CONTROLS */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-300 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Canvas Framing & Fine Repositioning
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPositionY(50);
                  setZoomLevel(1.0);
                }}
                className="text-[11px] font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Framing</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vertical Position Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <MoveVertical className="w-3.5 h-3.5 text-slate-600" />
                    Vertical Position (Y-Offset)
                  </span>
                  <span className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                    {positionY}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={positionY}
                  onChange={(e) => setPositionY(Number(e.target.value))}
                  className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-orange-600 text-slate-900 font-bold border border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-700">
                  <button
                    type="button"
                    onClick={() => setPositionY(0)}
                    className="hover:text-orange-600 underline"
                  >
                    Top (0%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPositionY(50)}
                    className="hover:text-orange-600 underline"
                  >
                    Center (50%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPositionY(100)}
                    className="hover:text-orange-600 underline"
                  >
                    Bottom (100%)
                  </button>
                </div>
              </div>

              {/* Zoom Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-slate-600" />
                    Scale / Zoom Level
                  </span>
                  <span className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                    {zoomLevel.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.05"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(Number(e.target.value))}
                  className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-orange-600 text-slate-900 font-bold border border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-700">
                  <span>1.00x (Standard)</span>
                  <span>1.75x</span>
                  <span>2.50x (Ultra Zoom)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. CHOOSE SOURCE: CURATED 4K UHD PRESETS & LOCAL UPLOAD */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                  Curated 4K & UHD Sovereign Master Presets
                </label>
                <p className="text-xs text-slate-700">
                  Ultra-crisp 4K UHD wallpapers calibrated for FingerMobile cover dimensions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  className="hidden text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Local 4K File</span>
                </button>
              </div>
            </div>

            {/* PRESETS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {CURATED_4K_PRESETS.map((preset) => {
                const isSelected = coverUrl === preset.url;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setCoverUrl(preset.url);
                      setPositionY(50);
                      setZoomLevel(1.0);
                    }}
                    className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-orange-600 ring-4 ring-orange-500/30 shadow-md scale-102'
                        : 'border-slate-300 hover:border-slate-400 hover:shadow-xs'
                    }`}
                  >
                    <div className="w-full h-20 bg-slate-900 overflow-hidden relative">
                      <img
                        src={preset.url}
                        alt={preset.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      <div className="absolute bottom-1 left-1.5 bg-black/70 text-[9px] font-bold text-amber-300 px-1 rounded backdrop-blur-xs">
                        4K UHD
                      </div>
                    </div>
                    <div className="p-2 bg-white">
                      <span className="font-bold text-slate-900 text-[11px] block truncate">
                        {preset.title}
                      </span>
                      <span className="text-[10px] text-slate-600 font-semibold block truncate">
                        {preset.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CUSTOM URL OPTION */}
            <div className="pt-2">
              {!isApplyingCustomUrl ? (
                <button
                  type="button"
                  onClick={() => setIsApplyingCustomUrl(true)}
                  className="text-xs font-bold text-slate-700 hover:text-orange-600 underline transition"
                >
                  + Enter custom 4K image URL or decentralized IPFS CID
                </button>
              ) : (
                <form
                  onSubmit={handleApplyCustomUrl}
                  className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-300"
                >
                  <input
                    type="url"
                    placeholder="https://images.example.com/ultra-hd-cover-4k.webp"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black transition"
                  >
                    Apply URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsApplyingCustomUrl(false)}
                    className="px-2 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* 5. QUALITY REMINDER ALERT (MANDATORY RULE) */}
          <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-black text-emerald-950 block">
                FingerMobile Protocol™ Rich 4K & UHD Quality Mandate
              </span>
              <p className="text-emerald-900 font-semibold mt-0.5">
                Image quality is kept rich and high (4K and UHD) across all devices. The Sovereign
                Canvas Engine automatically maps your adjustments to high-DPI viewports, ensuring
                profile pictures and brand logos align perfectly without pixelation.
              </p>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-300 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">
              Format: <strong className="text-slate-900">{activeSpec.title}</strong>
            </span>
            <span className="text-slate-700">•</span>
            <span className="text-xs font-bold text-slate-700">
              Y-Offset: <strong className="text-slate-900">{positionY}%</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold text-xs hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndApply}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Save & Apply 4K Cover Photo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
