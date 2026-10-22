import React, { useState, useRef, useCallback } from 'react';
import {
  XMarkIcon,
  ArrowPathIcon,
  CheckIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  ScissorsIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  PlayIcon,
  PauseIcon,
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

export interface EditedMediaResult {
  url: string;
  filter?: string;
  crop?: string;
  rotation?: number;
  flipH?: boolean;
  flipV?: boolean;
  adjustments?: {
    brightness: number;
    contrast: number;
    saturation: number;
    warmth: number;
    blur: number;
    vignette: number;
  };
  playbackRate?: number;
  trim?: {
    start: number;
    end: number;
    duration: number;
  };
}

interface MediaEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  mediaName?: string;
  // eslint-disable-next-line no-unused-vars
  onSave?: (editedMedia: EditedMediaResult) => void;
}

// Preset filters inspired by /Assets/FingerMobile Image and Video Filters and Assets
export interface FilterPreset {
  id: string;
  name: string;
  subtitle: string;
  assetSource: string;
  cssFilter: string;
  tintRgb?: [number, number, number];
  tintAlpha?: number;
  bloom?: boolean;
  contrastBoost?: number;
  vignette?: boolean;
}

const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'normal',
    name: 'Normal (Clean)',
    subtitle: 'Original fidelity',
    assetSource: 'Standard Pass',
    cssFilter: 'none'
  },
  {
    id: '1001Nights_bloom',
    name: '1001 Nights Bloom',
    subtitle: 'Dreamy golden specular aura',
    assetSource: '1001Nights_bloom',
    cssFilter: 'brightness(112%) contrast(108%) saturate(135%) sepia(25%)',
    tintRgb: [255, 215, 120],
    tintAlpha: 0.18,
    bloom: true
  },
  {
    id: 'blur_bg',
    name: 'Bokeh Depth Blur',
    subtitle: 'Cinematic shallow aperture focus',
    assetSource: 'blur_bg / test_bokeh',
    cssFilter: 'contrast(106%) saturate(115%)',
    vignette: true
  },
  {
    id: 'test_image_process_cartoon',
    name: 'Cartoon Cel-Shader',
    subtitle: 'Vibrant pop comic posterization',
    assetSource: 'test_image_process_cartoon',
    cssFilter: 'contrast(165%) saturate(160%) brightness(105%)',
    contrastBoost: 1.4
  },
  {
    id: 'BG_Metro',
    name: 'Metro Cyberpunk',
    subtitle: 'High-contrast neon matrix teal & magenta',
    assetSource: 'BG_Metro',
    cssFilter: 'contrast(130%) saturate(145%) hue-rotate(190deg)',
    tintRgb: [0, 220, 255],
    tintAlpha: 0.15
  },
  {
    id: 'Makeup',
    name: 'Skin & Makeup Glow',
    subtitle: 'Porcelain beauty smoothing & blush',
    assetSource: 'Makeup / test_Skin',
    cssFilter: 'brightness(108%) contrast(98%) saturate(120%) sepia(10%)',
    tintRgb: [255, 190, 195],
    tintAlpha: 0.12
  },
  {
    id: 'Rorschach',
    name: 'Rorschach Noir',
    subtitle: 'Deep monochrome ink & silver highlights',
    assetSource: 'Rorschach',
    cssFilter: 'grayscale(100%) contrast(160%) brightness(95%)'
  },
  {
    id: 'test_Lips_glitter',
    name: 'Glitter Jewel',
    subtitle: 'Ruby crystal saturation & sparkle',
    assetSource: 'test_Lips_glitter',
    cssFilter: 'contrast(120%) saturate(180%) brightness(104%)',
    tintRgb: [255, 50, 120],
    tintAlpha: 0.12
  },
  {
    id: 'ownit_luxury_emerald',
    name: 'OwnIt Luxury Emerald',
    subtitle: 'Royal deep emerald velvet & 24k gold',
    assetSource: 'OWNIT_LUXURY_CURATION',
    cssFilter: 'contrast(125%) saturate(130%) hue-rotate(60deg)',
    tintRgb: [16, 185, 129],
    tintAlpha: 0.15
  },
  {
    id: 'vintage_vhs',
    name: 'Vintage 1990 VHS',
    subtitle: 'Warm analog tape nostalgia',
    assetSource: 'Retro Film Shader',
    cssFilter: 'sepia(45%) contrast(110%) brightness(102%) saturate(125%)',
    tintRgb: [250, 220, 170],
    tintAlpha: 0.2
  },
  {
    id: 'afro_groove',
    name: 'Afro Gold & Amber',
    subtitle: 'Warm rich terracotta & golden sunshine',
    assetSource: 'Afro / test_Hair',
    cssFilter: 'contrast(115%) saturate(140%) sepia(20%) brightness(106%)',
    tintRgb: [255, 180, 50],
    tintAlpha: 0.15
  },
  {
    id: 'cubemap_moon',
    name: 'Moonlit Starlight',
    subtitle: 'Silver moonlight specular radiance',
    assetSource: 'CubemapMoon',
    cssFilter: 'contrast(120%) brightness(95%) hue-rotate(205deg) saturate(110%)',
    tintRgb: [180, 220, 255],
    tintAlpha: 0.18,
    bloom: true
  },
  {
    id: 'rayban_dark',
    name: 'Ray-Ban Wayfarer Dark',
    subtitle: 'Polarized sunglasses tinted contrast',
    assetSource: 'glasses_RayBan4165_Dark',
    cssFilter: 'contrast(135%) brightness(88%) saturate(110%)',
    vignette: true
  },
  {
    id: 'cartoon_octopus',
    name: 'Cartoon Pop Art',
    subtitle: 'Hyper-vibrant manga illustration',
    assetSource: 'CartoonOctopus',
    cssFilter: 'contrast(175%) saturate(190%) brightness(108%)',
    contrastBoost: 1.5
  },
  {
    id: 'hair_pink_girl',
    name: 'Sakura Pastel Pink',
    subtitle: 'Soft anime cherry blossom aura',
    assetSource: 'HairPinkGirl',
    cssFilter: 'brightness(110%) contrast(105%) saturate(135%) hue-rotate(320deg)',
    tintRgb: [255, 160, 200],
    tintAlpha: 0.14
  }
];

type AspectRatioOption = 'free' | '1:1' | '4:5' | '16:9' | '9:16';

const MediaEditorModal: React.FC<MediaEditorModalProps> = ({
  isOpen,
  onClose,
  mediaUrl,
  mediaType = 'image',
  mediaName = 'Attached Media',
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'filters' | 'crop' | 'adjust' | 'transform' | 'timeline'>('filters');

  // Adjustments (-100 to 100 or 0 to 200)
  const [brightness, setBrightness] = useState(0); // -100 to 100 (0 default)
  const [contrast, setContrast] = useState(0); // -100 to 100 (0 default)
  const [saturation, setSaturation] = useState(100); // 0 to 200 (100 default)
  const [warmth, setWarmth] = useState(0); // -100 to 100 (0 default)
  const [blurAmount, setBlurAmount] = useState(0); // 0 to 15px
  const [vignetteAmount, setVignetteAmount] = useState(0); // 0 to 100%

  // Filter Preset
  const [selectedFilter, setSelectedFilter] = useState<string>('normal');

  // Crop & Transform
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('free');
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  // Video State (CapCut / OpenCut Timeline Controls)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoPlaybackRate, setVideoPlaybackRate] = useState<number>(1.0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [trimStartSeconds, setTrimStartSeconds] = useState<number>(0);
  const [trimEndSeconds, setTrimEndSeconds] = useState<number>(0);

  // Image & Video Refs
  const imageElementRef = useRef<HTMLImageElement | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset to original
  const handleResetAll = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(100);
    setWarmth(0);
    setBlurAmount(0);
    setVignetteAmount(0);
    setSelectedFilter('normal');
    setAspectRatio('free');
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setZoomScale(1);
    setVideoPlaybackRate(1.0);
    if (videoElementRef.current) {
      videoElementRef.current.playbackRate = 1.0;
      videoElementRef.current.currentTime = 0;
    }
    setTrimStartSeconds(0);
    setTrimEndSeconds(videoDuration);
  };

  // Build combined CSS filter for live preview
  const getCssFilterString = useCallback(() => {
    const preset = FILTER_PRESETS.find((p) => p.id === selectedFilter);
    let baseCss = preset && preset.cssFilter !== 'none' ? `${preset.cssFilter} ` : '';

    const bVal = 100 + brightness;
    const cVal = 100 + contrast;
    const sVal = saturation;
    const sepiaVal = warmth > 0 ? warmth * 0.7 : 0;
    const hueVal = warmth < 0 ? warmth * 0.8 : 0;

    let adjustmentsCss = `brightness(${bVal}%) contrast(${cVal}%) saturate(${sVal}%)`;
    if (sepiaVal > 0) adjustmentsCss += ` sepia(${sepiaVal}%)`;
    if (hueVal !== 0) adjustmentsCss += ` hue-rotate(${hueVal}deg)`;
    if (blurAmount > 0) adjustmentsCss += ` blur(${blurAmount}px)`;

    return `${baseCss} ${adjustmentsCss}`.trim();
  }, [selectedFilter, brightness, contrast, saturation, warmth, blurAmount]);

  // Video Time Update with trim bound checks
  const handleVideoTimeUpdate = () => {
    if (videoElementRef.current) {
      const current = videoElementRef.current.currentTime;
      const duration = videoElementRef.current.duration || 1;
      if (trimEndSeconds > 0 && current >= trimEndSeconds) {
        videoElementRef.current.currentTime = trimStartSeconds;
        videoElementRef.current.pause();
        setIsVideoPlaying(false);
      }
      setVideoProgress((current / duration) * 100);
    }
  };

  // Video Toggle Play
  const handleToggleVideoPlay = () => {
    if (videoElementRef.current) {
      if (isVideoPlaying) {
        videoElementRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoElementRef.current.play().catch(() => {});
        setIsVideoPlaying(true);
      }
    }
  };

  // Video Scrub
  const handleVideoScrub = (percent: number) => {
    if (videoElementRef.current && videoElementRef.current.duration) {
      const targetTime = (percent / 100) * videoElementRef.current.duration;
      videoElementRef.current.currentTime = targetTime;
      setVideoProgress(percent);
    }
  };

  // Video Loaded Metadata
  const handleVideoLoadedMetadata = () => {
    if (videoElementRef.current) {
      const dur = videoElementRef.current.duration || 0;
      setVideoDuration(dur);
      if (trimEndSeconds === 0) {
        setTrimEndSeconds(dur);
      }
    }
  };

  // Playback rate handler
  const handleSetPlaybackRate = (rate: number) => {
    setVideoPlaybackRate(rate);
    if (videoElementRef.current) {
      videoElementRef.current.playbackRate = rate;
    }
  };

  // High-Resolution Canvas Render & Export
  const handleApplyAndSave = () => {
    if (!mediaUrl) return;

    if (mediaType === 'video') {
      // For video, deliver parameters and preview styling
      onSave?.({
        url: mediaUrl,
        filter: selectedFilter,
        crop: aspectRatio,
        rotation,
        flipH,
        flipV,
        adjustments: {
          brightness,
          contrast,
          saturation,
          warmth,
          blur: blurAmount,
          vignette: vignetteAmount
        },
        playbackRate: videoPlaybackRate,
        trim: {
          start: trimStartSeconds,
          end: trimEndSeconds || videoDuration,
          duration: videoDuration
        }
      });
      onClose();
      return;
    }

    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = mediaUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          onClose();
          return;
        }

        let origW = img.naturalWidth || img.width;
        let origH = img.naturalHeight || img.height;

        // Determine crop bounds according to selected aspect ratio
        let cropX = 0;
        let cropY = 0;
        let cropW = origW;
        let cropH = origH;

        if (aspectRatio === '1:1') {
          const size = Math.min(origW, origH);
          cropX = (origW - size) / 2;
          cropY = (origH - size) / 2;
          cropW = size;
          cropH = size;
        } else if (aspectRatio === '4:5') {
          const targetRatio = 4 / 5;
          if (origW / origH > targetRatio) {
            cropW = origH * targetRatio;
            cropX = (origW - cropW) / 2;
          } else {
            cropH = origW / targetRatio;
            cropY = (origH - cropH) / 2;
          }
        } else if (aspectRatio === '16:9') {
          const targetRatio = 16 / 9;
          if (origW / origH > targetRatio) {
            cropW = origH * targetRatio;
            cropX = (origW - cropW) / 2;
          } else {
            cropH = origW / targetRatio;
            cropY = (origH - cropH) / 2;
          }
        } else if (aspectRatio === '9:16') {
          const targetRatio = 9 / 16;
          if (origW / origH > targetRatio) {
            cropW = origH * targetRatio;
            cropX = (origW - cropW) / 2;
          } else {
            cropH = origW / targetRatio;
            cropY = (origH - cropH) / 2;
          }
        }

        // Apply rotation dimensions
        const isRotated90or270 = rotation === 90 || rotation === 270;
        const outW = isRotated90or270 ? cropH : cropW;
        const outH = isRotated90or270 ? cropW : cropH;

        canvas.width = outW;
        canvas.height = outH;

        // Apply Canvas filter string
        const filterStr = getCssFilterString();
        ctx.filter = filterStr;

        // Context transform for rotation & flip
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.scale(zoomScale, zoomScale);

        // Draw cropped section
        ctx.drawImage(
          img,
          cropX,
          cropY,
          cropW,
          cropH,
          -cropW / 2,
          -cropH / 2,
          cropW,
          cropH
        );

        // Reset transform & filter for overlays
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.filter = 'none';

        // Apply Filter Tint Overlay if present
        const preset = FILTER_PRESETS.find((p) => p.id === selectedFilter);
        if (preset?.tintRgb && preset.tintAlpha) {
          ctx.fillStyle = `rgba(${preset.tintRgb[0]}, ${preset.tintRgb[1]}, ${preset.tintRgb[2]}, ${preset.tintAlpha})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Apply Vignette overlay if required
        if (vignetteAmount > 0 || preset?.vignette) {
          const strength = Math.max(vignetteAmount / 100, preset?.vignette ? 0.45 : 0);
          const radius = Math.max(canvas.width, canvas.height) * 0.75;
          const gradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            radius * 0.3,
            canvas.width / 2,
            canvas.height / 2,
            radius
          );
          gradient.addColorStop(0, 'rgba(0,0,0,0)');
          gradient.addColorStop(1, `rgba(0,0,0,${strength})`);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Export high quality JPEG data URL
        const exportedDataUrl = canvas.toDataURL('image/jpeg', 0.94);

        onSave?.({
          url: exportedDataUrl,
          filter: preset?.name || 'Custom',
          crop: aspectRatio,
          rotation,
          flipH,
          flipV,
          adjustments: {
            brightness,
            contrast,
            saturation,
            warmth,
            blur: blurAmount,
            vignette: vignetteAmount
          }
        });

        setIsProcessing(false);
        onClose();
      } catch (_err) {
        setIsProcessing(false);
        onClose();
      }
    };
    img.onerror = () => {
      setIsProcessing(false);
      onClose();
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-5xl w-full mx-auto max-h-[95vh] flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              {mediaType === 'video' ? (
                <VideoCameraIcon className="w-5 h-5" />
              ) : (
                <PhotoIcon className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Studio Media Editor &amp; Filter Lab
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {mediaType.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate max-w-xs sm:max-w-md">
                {mediaName} &bull; Banuba &amp; Sovereign Shader Presets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetAll}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-800 transition"
              title="Reset all edits"
            >
              Reset
            </button>
            <button aria-label="Close"
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-y-auto">
          {/* Visual Preview Viewport */}
          <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
            {/* Viewport Frame with Aspect-Ratio styling */}
            <div className="relative max-w-full max-h-[50vh] lg:max-h-[62vh] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center bg-black border border-slate-800">
              {mediaType === 'image' ? (
                <img
                  ref={imageElementRef}
                  src={mediaUrl}
                  alt="Editor Preview"
                  className="max-w-full max-h-[50vh] lg:max-h-[62vh] object-contain transition-all duration-150"
                  style={{
                    filter: getCssFilterString(),
                    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1}) scale(${zoomScale})`
                  }}
                />
              ) : (
                <div className="relative flex flex-col items-center justify-center">
                  <video
                    ref={videoElementRef}
                    src={mediaUrl}
                    className="max-w-full max-h-[46vh] lg:max-h-[56vh] object-contain"
                    style={{
                      filter: getCssFilterString(),
                      transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1}) scale(${zoomScale})`
                    }}
                    onLoadedMetadata={handleVideoLoadedMetadata}
                    onTimeUpdate={handleVideoTimeUpdate}
                    onEnded={() => setIsVideoPlaying(false)}
                    muted={isVideoMuted}
                    playsInline
                  />
                  {/* Video Play overlay button */}
                  <button aria-label="Pause"
                    type="button"
                    onClick={handleToggleVideoPlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition group"
                  >
                    <div className="w-14 h-14 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition">
                      {isVideoPlaying ? (
                        <PauseIcon className="w-7 h-7" />
                      ) : (
                        <PlayIcon className="w-7 h-7 translate-x-0.5" />
                      )}
                    </div>
                  </button>
                </div>
              )}

              {/* Aspect Ratio Guide Grid when in Crop tab */}
              {activeTab === 'crop' && aspectRatio !== 'free' && (
                <div className="absolute inset-0 pointer-events-none border-2 border-indigo-400/80 rounded-2xl">
                  {/* Rule of thirds grid lines */}
                  <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-40">
                    <div className="border-r border-b border-indigo-300"></div>
                    <div className="border-r border-b border-indigo-300"></div>
                    <div className="border-b border-indigo-300"></div>
                    <div className="border-r border-b border-indigo-300"></div>
                    <div className="border-r border-b border-indigo-300"></div>
                    <div className="border-b border-indigo-300"></div>
                    <div className="border-r border-indigo-300"></div>
                    <div className="border-r border-indigo-300"></div>
                    <div></div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls Bar if Video */}
            {mediaType === 'video' && (
              <div className="w-full max-w-md mt-4 p-2.5 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center gap-3">
                <button aria-label="Pause"
                  type="button"
                  onClick={handleToggleVideoPlay}
                  className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-md"
                >
                  {isVideoPlaying ? (
                    <PauseIcon className="w-4 h-4" />
                  ) : (
                    <PlayIcon className="w-4 h-4 translate-x-0.5" />
                  )}
                </button>

                <div className="flex-1 flex flex-col gap-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={videoProgress}
                    onChange={(e) => handleVideoScrub(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-300">
                    <span>
                      {videoElementRef.current
                        ? `${Math.floor(videoElementRef.current.currentTime || 0)}s`
                        : '0s'}
                    </span>
                    <span className="text-indigo-400 font-bold">{videoPlaybackRate}x</span>
                    <span>{Math.floor(videoDuration || 0)}s</span>
                  </div>
                </div>

                <button aria-label="Toggle mute"
                  type="button"
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  {isVideoMuted ? (
                    <SpeakerXMarkIcon className="w-4 h-4 text-rose-400" />
                  ) : (
                    <SpeakerWaveIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}

            {/* Active Preset Tag Indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900/90 border border-slate-700 text-slate-200 flex items-center gap-1.5 backdrop-blur-sm shadow-lg">
                <SparklesIcon className="w-3.5 h-3.5 text-amber-400" />
                {FILTER_PRESETS.find((p) => p.id === selectedFilter)?.name || 'Custom'}
              </span>
              {aspectRatio !== 'free' && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-950/80 border border-indigo-700 text-indigo-300">
                  {aspectRatio}
                </span>
              )}
            </div>
          </div>

          {/* Controls & Tools Sidebar */}
          <div className="lg:col-span-5 p-5 flex flex-col justify-between overflow-y-auto bg-slate-900">
            <div>
              {/* Tool Navigation Tabs */}
              <div className={`grid ${mediaType === 'video' ? 'grid-cols-5' : 'grid-cols-4'} gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-5`}>
                <button
                  type="button"
                  onClick={() => setActiveTab('filters')}
                  className={`py-2 text-xs font-bold rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                    activeTab === 'filters'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <SparklesIcon className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('crop')}
                  className={`py-2 text-xs font-bold rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                    activeTab === 'crop'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <ScissorsIcon className="w-3.5 h-3.5" />
                  <span>Crop</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('adjust')}
                  className={`py-2 text-xs font-bold rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                    activeTab === 'adjust'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <AdjustmentsHorizontalIcon className="w-3.5 h-3.5" />
                  <span>Adjust</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('transform')}
                  className={`py-2 text-xs font-bold rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                    activeTab === 'transform'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <ArrowPathIcon className="w-3.5 h-3.5" />
                  <span>Rotate</span>
                </button>

                {mediaType === 'video' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('timeline')}
                    className={`py-2 text-xs font-bold rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                      activeTab === 'timeline'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <VideoCameraIcon className="w-3.5 h-3.5" />
                    <span>Speed/Trim</span>
                  </button>
                )}
              </div>

              {/* TAB 1: FILTERS GALLERY */}
              {activeTab === 'filters' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Banuba &amp; Cinematic Presets
                    </span>
                    <span className="text-[11px] text-indigo-400 font-semibold">10 Styles</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 max-h-[48vh] overflow-y-auto pr-1">
                    {FILTER_PRESETS.map((preset) => {
                      const isSelected = selectedFilter === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setSelectedFilter(preset.id)}
                          className={`p-3 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                            isSelected
                              ? 'bg-indigo-950/70 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                              <CheckIcon className="w-3 h-3 stroke-2" />
                            </span>
                          )}
                          <div>
                            <h5 className="font-bold text-xs text-white truncate pr-4">
                              {preset.name}
                            </h5>
                            <p className="text-[10px] text-slate-300 mt-0.5 line-clamp-1">
                              {preset.subtitle}
                            </p>
                          </div>
                          <span className="text-[9px] font-mono text-indigo-400/90 mt-2 block truncate">
                            {preset.assetSource}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: CROP & ASPECT RATIO */}
              {activeTab === 'crop' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Aspect Ratio Framing
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'free', label: 'Freeform', desc: 'Original size' },
                        { id: '1:1', label: '1:1 Square', desc: 'Feed Post' },
                        { id: '4:5', label: '4:5 Portrait', desc: 'Social Standard' },
                        { id: '16:9', label: '16:9 Cinema', desc: 'Landscape TV' },
                        { id: '9:16', label: '9:16 Reel', desc: 'Mii™®©℠' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAspectRatio(item.id as AspectRatioOption)}
                          className={`p-3 rounded-2xl border text-left transition ${
                            aspectRatio === item.id
                              ? 'bg-indigo-600/30 border-indigo-500 text-white'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          <div className="font-bold text-xs">{item.label}</div>
                          <div className="text-[10px] text-slate-300 mt-0.5">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Zoom &amp; Scale ({Math.round(zoomScale * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="2.5"
                      step="0.05"
                      value={zoomScale}
                      onChange={(e) => setZoomScale(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: ADJUSTMENT SLIDERS */}
              {activeTab === 'adjust' && (
                <div className="space-y-3.5 max-h-[48vh] overflow-y-auto pr-1">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Brightness</span>
                      <span className="font-mono text-indigo-400">{brightness > 0 ? `+${brightness}` : brightness}</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Contrast</span>
                      <span className="font-mono text-indigo-400">{contrast > 0 ? `+${contrast}` : contrast}</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Saturation</span>
                      <span className="font-mono text-indigo-400">{saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Warmth &amp; Temperature</span>
                      <span className="font-mono text-indigo-400">{warmth > 0 ? `+${warmth}` : warmth}</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={warmth}
                      onChange={(e) => setWarmth(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Soft Blur / Bokeh</span>
                      <span className="font-mono text-indigo-400">{blurAmount}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      value={blurAmount}
                      onChange={(e) => setBlurAmount(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Vignette Edge Falloff</span>
                      <span className="font-mono text-indigo-400">{vignetteAmount}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={vignetteAmount}
                      onChange={(e) => setVignetteAmount(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: ROTATE & TRANSFORM */}
              {activeTab === 'transform' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setRotation((prev) => (prev + 90) % 360)}
                      className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-white transition"
                    >
                      <ArrowPathIcon className="w-4 h-4" />
                      Rotate 90&deg; CW
                    </button>

                    <button
                      type="button"
                      onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
                      className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-white transition"
                    >
                      <ArrowPathIcon className="w-4 h-4 -scale-x-100" />
                      Rotate 90&deg; CCW
                    </button>

                    <button
                      type="button"
                      onClick={() => setFlipH(!flipH)}
                      className={`p-3 border rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition ${
                        flipH
                          ? 'bg-indigo-600/30 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      Flip Horizontal
                    </button>

                    <button
                      type="button"
                      onClick={() => setFlipV(!flipV)}
                      className={`p-3 border rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition ${
                        flipV
                          ? 'bg-indigo-600/30 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      Flip Vertical
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: VIDEO TIMELINE & CAPCUT SPEED/TRIM */}
              {activeTab === 'timeline' && mediaType === 'video' && (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                      CapCut Playback Velocity
                    </span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[0.5, 0.75, 1.0, 1.5, 2.0].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => handleSetPlaybackRate(rate)}
                          className={`py-2 px-1 text-xs font-mono font-bold rounded-xl border transition ${
                            videoPlaybackRate === rate
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Trim Start ({trimStartSeconds.toFixed(1)}s)</span>
                      <span className="font-mono text-indigo-400">0s &rarr; {trimStartSeconds.toFixed(1)}s</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={Math.max(0, (trimEndSeconds || videoDuration) - 0.5)}
                      step="0.1"
                      value={trimStartSeconds}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setTrimStartSeconds(val);
                        if (videoElementRef.current) {
                          videoElementRef.current.currentTime = val;
                        }
                      }}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                      <span>Trim End ({(trimEndSeconds || videoDuration).toFixed(1)}s)</span>
                      <span className="font-mono text-indigo-400">Total: {videoDuration.toFixed(1)}s</span>
                    </div>
                    <input
                      type="range"
                      min={trimStartSeconds + 0.5}
                      max={videoDuration || 100}
                      step="0.1"
                      value={trimEndSeconds || videoDuration}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setTrimEndSeconds(val);
                        if (videoElementRef.current) {
                          videoElementRef.current.currentTime = val;
                        }
                      }}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                    <span className="text-indigo-400 font-bold block mb-1">⚡ OpenCut &amp; CapCut Engine:</span>
                    Clips render client-side using hardware acceleration. Trimming sets instant non-destructive in/out keypoints and custom velocity parameters.
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleApplyAndSave}
                className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    Rendering...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4 stroke-2" />
                    Apply &amp; Attach
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaEditorModal;
