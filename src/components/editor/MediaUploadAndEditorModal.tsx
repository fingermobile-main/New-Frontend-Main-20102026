/*
 * FingerMobile Protocol™ - Media Upload & Creative Editor Suite
 * Complete multi-modal asset processor for uploading, editing, cropping,
 * filter grading, and configuring Photos, Videos, and Audio tracks.
 */

import React, { useState, useRef } from 'react';
import {
  Image,
  Video,
  Music,
  Upload,
  Sliders,
  Crop,
  RotateCw,
  FlipHorizontal,
  Sparkles,
  Check,
  X,
  Volume2,
  Play,
  Pause,
  Trash2
} from 'lucide-react';

export interface ProcessedMedia {
  id: string;
  url: string;
  type: 'photo' | 'video' | 'audio';
  name: string;
  caption?: string;
  aspectRatio?: string;
  duration?: number;
  filters?: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    filterName: string;
  };
}

interface MediaUploadAndEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMedia: (media: ProcessedMedia) => void;
  defaultType?: 'photo' | 'video' | 'audio';
}

const FILTER_PRESETS = [
  { name: 'Normal', filter: 'none' },
  { name: 'Vintage', filter: 'sepia(0.5) contrast(1.1) brightness(0.95)' },
  { name: 'Monochrome', filter: 'grayscale(1) contrast(1.2)' },
  { name: 'Vibrant', filter: 'saturate(1.6) contrast(1.1)' },
  { name: 'Warm', filter: 'sepia(0.3) saturate(1.3) hue-rotate(-15deg)' },
  { name: 'Cool', filter: 'hue-rotate(30deg) saturate(1.2)' },
  { name: 'Sepia', filter: 'sepia(0.9)' },
];

export const MediaUploadAndEditorModal: React.FC<MediaUploadAndEditorModalProps> = ({
  isOpen,
  onClose,
  onSaveMedia,
  defaultType = 'photo'
}) => {
  const [activeMediaType, setActiveMediaType] = useState<'photo' | 'video' | 'audio'>(defaultType);
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'original' | '1:1' | '16:9' | '4:3' | '9:16'>('original');
  const [rotation, setRotation] = useState(0);
  const [isFlippedH, setIsFlippedH] = useState(false);
  
  // Photo Adjustments
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [activeFilter, setActiveFilter] = useState('Normal');

  // Video / Audio Playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoTrimStart, setVideoTrimStart] = useState(0);
  const [videoTrimEnd, setVideoTrimEnd] = useState(60);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setMediaUrl(objectUrl);
      if (!caption) setCaption(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const getComputedStyleFilter = () => {
    const baseFilter = FILTER_PRESETS.find(p => p.name === activeFilter)?.filter || 'none';
    const adjustments = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
    return baseFilter === 'none' ? adjustments : `${baseFilter} ${adjustments}`;
  };

  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case '1:1': return 'aspect-square max-w-sm';
      case '16:9': return 'aspect-video max-w-lg';
      case '4:3': return 'aspect-[4/3] max-w-md';
      case '9:16': return 'aspect-[9/16] max-w-xs';
      default: return 'max-h-96 w-auto';
    }
  };

  const handleSave = () => {
    if (!mediaUrl.trim()) {
      alert('Please select or upload media first.');
      return;
    }

    const processed: ProcessedMedia = {
      id: `media-${Date.now()}`,
      url: mediaUrl,
      type: activeMediaType,
      name: caption || `${activeMediaType}-${Date.now()}`,
      caption,
      aspectRatio,
      filters: activeMediaType === 'photo' ? {
        brightness,
        contrast,
        saturation,
        blur,
        filterName: activeFilter
      } : undefined
    };

    onSaveMedia(processed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                Studio Media Editor & Uploader
              </h3>
              <p className="text-xs text-slate-700 font-medium">
                Enhance, style, and attach UGC photo, video, or audio before publishing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-700 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Type Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-3 gap-2 bg-slate-100/50 dark:bg-slate-950/40">
          <button
            type="button"
            onClick={() => { setActiveMediaType('photo'); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeMediaType === 'photo'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Photo / Image</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveMediaType('video'); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeMediaType === 'video'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Clip</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveMediaType('audio'); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeMediaType === 'audio'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Voice / Audio</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Upload or URL Selector */}
          {!mediaUrl ? (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-slate-950/30 flex flex-col items-center justify-center">
              <input
                ref={fileInputRef}
                type="file"
                accept={activeMediaType === 'photo' ? 'image/*' : (activeMediaType === 'video' ? 'video/*' : 'audio/*')}
                onChange={handleFileUpload}
                className="hidden text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                <Upload className="w-7 h-7" />
              </div>
              <p className="font-semibold text-slate-800 dark:text-white text-sm mb-1">
                Upload from device or enter URL
              </p>
              <p className="text-xs text-slate-700 font-medium mb-4">
                Supports {activeMediaType === 'photo' ? 'PNG, JPG, WebP, GIF' : (activeMediaType === 'video' ? 'MP4, MOV, WebM' : 'MP3, WAV, M4A')} up to 100MB
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-sm transition"
                >
                  Choose File
                </button>
                <span className="text-xs text-slate-700">or</span>
                <input
                  type="text"
                  placeholder="Paste direct media URL..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setMediaUrl((e.target as HTMLInputElement).value);
                    }
                  }}
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white text-slate-900 font-bold bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Media Preview & Canvas View */}
              <div className="relative flex items-center justify-center bg-slate-950 rounded-2xl p-4 min-h-[260px] overflow-hidden border border-slate-800">
                {activeMediaType === 'photo' && (
                  <div className={`overflow-hidden rounded-xl transition-all duration-300 ${getAspectRatioClasses()}`}>
                    <img
                      src={mediaUrl}
                      alt="Preview"
                      style={{
                        filter: getComputedStyleFilter(),
                        transform: `rotate(${rotation}deg) scaleX(${isFlippedH ? -1 : 1})`
                      }}
                      className="w-full h-full object-cover rounded-xl transition-all duration-200"
                    />
                  </div>
                )}

                {activeMediaType === 'video' && (
                  <div className={`relative overflow-hidden rounded-xl ${getAspectRatioClasses()}`}>
                    <video
                      src={mediaUrl}
                      controls
                      className="w-full h-full rounded-xl object-contain"
                    />
                  </div>
                )}

                {activeMediaType === 'audio' && (
                  <div className="w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                        <Music className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{caption || 'Audio Track'}</p>
                        <p className="text-xs text-slate-300 font-medium">Voice clip preview</p>
                      </div>
                    </div>
                    {/* Simulated Waveform Bars */}
                    <div className="flex items-end gap-1 h-12 justify-center py-1">
                      {[30, 60, 45, 90, 80, 40, 100, 65, 35, 75, 90, 50, 70, 40, 85, 95, 30, 60].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className="w-1.5 bg-orange-500 rounded-full transition-all animate-pulse"
                        />
                      ))}
                    </div>
                    <audio src={mediaUrl} controls className="w-full mt-2" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setMediaUrl('')}
                  className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition"
                  title="Remove media"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Editing Controls for Photos */}
              {activeMediaType === 'photo' && (
                <div className="space-y-4">
                  {/* Aspect Ratio & Transform Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-slate-700 dark:text-slate-300 mr-2 flex items-center gap-1">
                        <Crop className="w-3.5 h-3.5" /> Ratio:
                      </span>
                      {(['original', '1:1', '16:9', '4:3', '9:16'] as const).map(ratio => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setAspectRatio(ratio)}
                          className={`px-2.5 py-1 rounded-lg font-medium transition ${
                            aspectRatio === ratio
                              ? 'bg-orange-500 text-white'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setRotation((prev) => (prev + 90) % 360)}
                        className="p-1.5 bg-white dark:bg-slate-800 border rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                        title="Rotate 90°"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsFlippedH(!isFlippedH)}
                        className="p-1.5 bg-white dark:bg-slate-800 border rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                        title="Flip Horizontal"
                      >
                        <FlipHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Filter Presets */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Color Filter Presets:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_PRESETS.map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => setActiveFilter(p.name)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition ${
                            activeFilter === p.name
                              ? 'border-orange-500 bg-orange-500 text-white'
                              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Adjustment Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Brightness</span>
                        <span className="text-slate-700 font-bold">{brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={150}
                        value={brightness}
                        onChange={(e) => setBrightness(parseInt(e.target.value))}
                        className="w-full accent-orange-500 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Contrast</span>
                        <span className="text-slate-700 font-bold">{contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={150}
                        value={contrast}
                        onChange={(e) => setContrast(parseInt(e.target.value))}
                        className="w-full accent-orange-500 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Saturation</span>
                        <span className="text-slate-700 font-bold">{saturation}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={200}
                        value={saturation}
                        onChange={(e) => setSaturation(parseInt(e.target.value))}
                        className="w-full accent-orange-500 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Soft Blur</span>
                        <span className="text-slate-700 font-bold">{blur}px</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={8}
                        value={blur}
                        onChange={(e) => setBlur(parseInt(e.target.value))}
                        className="w-full accent-orange-500 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Caption / Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Media Caption / Alt Description:
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Describe this media object for followers..."
                  className="w-full px-4 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white text-slate-900 font-bold bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!mediaUrl}
            className="px-6 py-2.5 text-xs font-bold bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Apply & Embed in Content</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaUploadAndEditorModal;
