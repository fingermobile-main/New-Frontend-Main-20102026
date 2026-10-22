/* eslint-disable no-unused-vars */
/*
 * FingerMobile Protocol™ - Sovereign Media Cropper & Editor Studio Modal
 * Interactive Media Container for Scheduled Profile Photo Changes & Validity Duration
 * Holds maximum of 3 files (Image/Video), supports batch select/delete,
 * and enforces strict 30-second maximum playtime on video files.
 * Formats: PNG, JPEG, WebP, GIF89a, APNG (24-bit Alpha), MP4 / WebM
 * Strictly compliant with WCAG AAA contrast hierarchy standards.
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  XCircle,
  UploadCloud,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  Sparkles,
  Clock,
  Repeat,
  Play,
  Pause,
  Crop,
  Info,
  Trash2,
  CheckSquare,
  Square,
  AlertTriangle,
  Film,
  Camera,
  Layers,
  Plus
} from 'lucide-react';

export type MediaFormatType = 'png' | 'jpeg' | 'webp' | 'gif' | 'apng' | 'mp4' | 'webm';
export type PhotoScheduleDuration = '48h' | '1w' | '1m' | 'indefinite';

export interface ScheduledAvatarItem {
  id: string;
  url: string;
  format: MediaFormatType;
  label: string;
  scheduleDuration: PhotoScheduleDuration;
  addedAt: string;
  isActive: boolean;
  durationSeconds?: number;
}

export interface SovereignCropperResult {
  url: string;
  format: MediaFormatType;
  scheduleDuration: PhotoScheduleDuration;
  rotateWeekly: boolean;
  label: string;
  mediaContainerItems: ScheduledAvatarItem[];
}

interface SovereignMediaCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (result: SovereignCropperResult) => void;
  currentAvatarUrl?: string | null;
  existingQueue?: ScheduledAvatarItem[];
}

type FilterPreset = 'none' | 'beauty' | 'cyber' | 'warm' | 'noir';

export const SovereignMediaCropperModal: React.FC<SovereignMediaCropperModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentAvatarUrl,
  existingQueue
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. Media Container State: Holds maximum of 3 files (Image/Video)
  const [containerItems, setContainerItems] = useState<ScheduledAvatarItem[]>(() => {
    if (existingQueue && existingQueue.length > 0) {
      return existingQueue.slice(0, 3);
    }
    return [
      {
        id: 'slot-1',
        url: currentAvatarUrl || '/assets/branding/mbah_israel_obinna.jpeg',
        format: 'jpeg',
        label: 'Primary Founder Portrait (UHD)',
        scheduleDuration: 'indefinite',
        addedAt: '10 Oct 2026',
        isActive: true
      },
      {
        id: 'slot-2',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
        format: 'webp',
        label: 'Metaverse High-Definition WebP',
        scheduleDuration: '1w',
        addedAt: '12 Oct 2026',
        isActive: false
      },
      {
        id: 'slot-3',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        format: 'apng',
        label: 'Protocol Crest (24-bit Alpha APNG)',
        scheduleDuration: '48h',
        addedAt: '14 Oct 2026',
        isActive: false
      }
    ];
  });

  // Multi-selection state for batch operations
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Active view: 'container' (overview of up to 3 slots) or 'editor' (crop & filter workspace)
  const [activeView, setActiveView] = useState<'container' | 'editor'>('container');

  // Source media state for the editor
  const [sourceMediaUrl, setSourceMediaUrl] = useState<string>(
    currentAvatarUrl || '/assets/branding/mbah_israel_obinna.jpeg'
  );
  const [detectedFormat, setDetectedFormat] = useState<MediaFormatType>('jpeg');
  const [mediaLabel, setMediaLabel] = useState<string>('Sovereign Avatar');
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number | undefined>(undefined);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(true);

  // Canvas Transform States
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<FilterPreset>('none');
  const [isCircleMask, setIsCircleMask] = useState<boolean>(true);
  const [outputFormat, setOutputFormat] = useState<'webp' | 'png' | 'jpeg'>('webp');

  // Drag-to-pan state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Scheduling states
  const [scheduleDuration, setScheduleDuration] = useState<PhotoScheduleDuration>('indefinite');
  const [rotateWeekly, setRotateWeekly] = useState<boolean>(true);

  // Loaded Image element
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  // Sync initial queue if updated
  useEffect(() => {
    if (existingQueue && existingQueue.length > 0) {
      setContainerItems(existingQueue.slice(0, 3));
    }
  }, [existingQueue]);

  // Detect if URL is video
  const checkIsVideoUrl = (url?: string | null): boolean => {
    if (!url) return false;
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.startsWith('data:video/');
  };

  // Load media whenever sourceMediaUrl changes
  useEffect(() => {
    if (!sourceMediaUrl) return;

    const videoDetected = checkIsVideoUrl(sourceMediaUrl);
    setIsVideo(videoDetected);

    if (videoDetected) {
      if (sourceMediaUrl.endsWith('.webm') || sourceMediaUrl.includes('video/webm')) {
        setDetectedFormat('webm');
      } else {
        setDetectedFormat('mp4');
      }
      return;
    }

    // Detect format
    if (sourceMediaUrl.endsWith('.apng')) {
      setDetectedFormat('apng');
    } else if (sourceMediaUrl.endsWith('.gif') || sourceMediaUrl.includes('image/gif')) {
      setDetectedFormat('gif');
    } else if (sourceMediaUrl.endsWith('.webp') || sourceMediaUrl.includes('image/webp')) {
      setDetectedFormat('webp');
    } else if (sourceMediaUrl.endsWith('.png') || sourceMediaUrl.includes('image/png')) {
      setDetectedFormat('png');
    } else {
      setDetectedFormat('jpeg');
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setLoadedImage(img);
    };
    img.src = sourceMediaUrl;
  }, [sourceMediaUrl]);

  // Render to HTML5 Canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !loadedImage || isVideo) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 500;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    let filterString = 'none';
    if (activeFilter === 'beauty') {
      filterString = 'brightness(1.08) contrast(1.04) saturate(1.06)';
    } else if (activeFilter === 'cyber') {
      filterString = 'contrast(1.25) saturate(1.35) hue-rotate(8deg)';
    } else if (activeFilter === 'warm') {
      filterString = 'sepia(0.2) contrast(1.08) brightness(1.02)';
    } else if (activeFilter === 'noir') {
      filterString = 'grayscale(1) contrast(1.3) brightness(0.95)';
    }
    ctx.filter = filterString;

    ctx.save();
    ctx.translate(size / 2 + panX, size / 2 + panY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, 1);

    const imgAspect = loadedImage.width / loadedImage.height;
    let drawWidth = size * zoom;
    let drawHeight = size * zoom;

    if (imgAspect > 1) {
      drawWidth = size * zoom * imgAspect;
    } else {
      drawHeight = (size * zoom) / imgAspect;
    }

    ctx.drawImage(loadedImage, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    ctx.filter = 'none';

    if (isCircleMask) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.beginPath();
      ctx.rect(0, 0, size, size);
      ctx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();
    }
  }, [loadedImage, isVideo, zoom, rotation, flipH, panX, panY, activeFilter, isCircleMask]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Handle Drag to Pan on Canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Enforce Video Duration Check (< 30 seconds playtime)
  const validateAndGetVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      const objectUrl = URL.createObjectURL(file);
      videoElement.src = objectUrl;

      videoElement.onloadedmetadata = () => {
        URL.revokeObjectURL(objectUrl);
        const duration = videoElement.duration;
        resolve(duration);
      };

      videoElement.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Unable to parse video metadata. Ensure file is a valid MP4 or WebM.'));
      };
    });
  };

  // Handle File Input Selection with Max 3 constraint & Max 30s video check
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (containerItems.length >= 3) {
      setValidationError(
        'Media Container Full: A maximum of 3 files (Image/Video) can be held. Select and delete existing files before uploading.'
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const fileName = file.name.toLowerCase();
    const mimeType = file.type.toLowerCase();

    let fmt: MediaFormatType = 'jpeg';
    if (fileName.endsWith('.apng')) fmt = 'apng';
    else if (mimeType.includes('webp') || fileName.endsWith('.webp')) fmt = 'webp';
    else if (mimeType.includes('gif') || fileName.endsWith('.gif')) fmt = 'gif';
    else if (mimeType.includes('png') || fileName.endsWith('.png')) fmt = 'png';
    else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) fmt = 'jpeg';
    else if (mimeType.includes('mp4') || fileName.endsWith('.mp4')) fmt = 'mp4';
    else if (mimeType.includes('webm') || fileName.endsWith('.webm')) fmt = 'webm';

    // If it's a video file, strictly enforce 30 seconds playtime limit
    if (fmt === 'mp4' || fmt === 'webm' || mimeType.startsWith('video/')) {
      try {
        const duration = await validateAndGetVideoDuration(file);
        if (duration > 30) {
          setValidationError(
            `Playtime Limit Exceeded: Uploaded video file is ${Math.round(
              duration
            )}s long. Under the Charter, profile video loops cannot exceed 30 seconds playtime maximum.`
          );
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }
        setVideoDuration(Math.round(duration));
      } catch (err: any) {
        setValidationError(err.message || 'Failed to inspect video duration.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    } else {
      setVideoDuration(undefined);
    }

    setDetectedFormat(fmt);
    setMediaLabel(file.name.replace(/\.[^/.]+$/, ''));

    // Reset crop transforms
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setPanX(0);
    setPanY(0);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSourceMediaUrl(dataUrl);
      setActiveView('editor'); // Switch to editor workspace
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Add currently cropped/selected media into the 3-file Media Container
  const handleCommitEditorToContainer = () => {
    setValidationError(null);

    if (containerItems.length >= 3) {
      setValidationError(
        'Media Container Full: Maximum of 3 files (Image/Video) allowed. Delete an existing file to add this one.'
      );
      return;
    }

    let finalUrl = sourceMediaUrl;

    // Export canvas if still image
    if (!isVideo && detectedFormat !== 'gif' && detectedFormat !== 'apng' && canvasRef.current) {
      const exportCanvas = document.createElement('canvas');
      const exportSize = 600;
      exportCanvas.width = exportSize;
      exportCanvas.height = exportSize;
      const expCtx = exportCanvas.getContext('2d');

      if (expCtx && loadedImage) {
        let filterString = 'none';
        if (activeFilter === 'beauty') filterString = 'brightness(1.08) contrast(1.04) saturate(1.06)';
        else if (activeFilter === 'cyber') filterString = 'contrast(1.25) saturate(1.35) hue-rotate(8deg)';
        else if (activeFilter === 'warm') filterString = 'sepia(0.2) contrast(1.08) brightness(1.02)';
        else if (activeFilter === 'noir') filterString = 'grayscale(1) contrast(1.3) brightness(0.95)';
        expCtx.filter = filterString;

        expCtx.save();
        expCtx.translate(exportSize / 2 + (panX * exportSize) / 500, exportSize / 2 + (panY * exportSize) / 500);
        expCtx.rotate((rotation * Math.PI) / 180);
        expCtx.scale(flipH ? -1 : 1, 1);

        const imgAspect = loadedImage.width / loadedImage.height;
        let dW = exportSize * zoom;
        let dH = exportSize * zoom;
        if (imgAspect > 1) dW = exportSize * zoom * imgAspect;
        else dH = (exportSize * zoom) / imgAspect;

        expCtx.drawImage(loadedImage, -dW / 2, -dH / 2, dW, dH);
        expCtx.restore();

        const mime = outputFormat === 'webp' ? 'image/webp' : outputFormat === 'png' ? 'image/png' : 'image/jpeg';
        finalUrl = exportCanvas.toDataURL(mime, 0.95);
      }
    }

    const newItem: ScheduledAvatarItem = {
      id: `slot-${Date.now()}`,
      url: finalUrl,
      format: isVideo ? detectedFormat : (detectedFormat === 'gif' || detectedFormat === 'apng') ? detectedFormat : outputFormat,
      label: mediaLabel || 'Sovereign Avatar',
      scheduleDuration,
      addedAt: 'Today',
      isActive: containerItems.length === 0, // Make active if first item
      durationSeconds: videoDuration
    };

    setContainerItems((prev) => [...prev, newItem]);
    setActiveView('container');
  };

  // Batch Selection Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItemIds.length === containerItems.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(containerItems.map((item) => item.id));
    }
  };

  // Batch Delete Handler
  const handleDeleteSelected = () => {
    setValidationError(null);
    if (selectedItemIds.length === 0) return;

    if (selectedItemIds.length === containerItems.length) {
      setValidationError('You must retain at least 1 profile media file in your container.');
      return;
    }

    const remaining = containerItems.filter((item) => !selectedItemIds.includes(item.id));

    // Ensure at least one active item
    const hasActive = remaining.some((item) => item.isActive);
    if (!hasActive && remaining.length > 0) {
      remaining[0].isActive = true;
    }

    setContainerItems(remaining);
    setSelectedItemIds([]);
  };

  // Set Active Avatar Slot
  const handleSetActiveSlot = (id: string) => {
    setContainerItems((prev) =>
      prev.map((item) => ({ ...item, isActive: item.id === id }))
    );
  };

  // Per-item Validity Duration update
  const handleUpdateItemDuration = (id: string, duration: PhotoScheduleDuration) => {
    setContainerItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, scheduleDuration: duration } : item))
    );
  };

  // Save and Commit entire Media Container
  const handleSaveAndApply = () => {
    setValidationError(null);
    if (containerItems.length === 0) {
      setValidationError('Please upload at least one profile image or video.');
      return;
    }

    const activeItem = containerItems.find((item) => item.isActive) || containerItems[0];

    onSave({
      url: activeItem.url,
      format: activeItem.format,
      scheduleDuration: activeItem.scheduleDuration,
      rotateWeekly,
      label: activeItem.label,
      mediaContainerItems: containerItems
    });

    onClose();
  };

  if (!isOpen) return null;

  const activeItem = containerItems.find((item) => item.isActive) || containerItems[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-300 p-5 sm:p-7 max-w-4xl w-full shadow-2xl max-h-[94vh] overflow-y-auto space-y-6">

        {/* Header Title & Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-100 text-orange-950 border border-orange-300">
              <Camera className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Schedule Profile Photo Changes & Validity Duration
              </h3>
              <p className="text-xs font-medium text-slate-700">
                Media container holds maximum 3 files (Image/Video). Batch select/delete, 30s video duration limit & weekly rotation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-300">
              <button
                type="button"
                onClick={() => setActiveView('container')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeView === 'container'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-orange-500" />
                <span>Media Container ({containerItems.length}/3)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('editor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeView === 'editor'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Crop className="w-3.5 h-3.5 text-emerald-600" />
                <span>Crop & Filter Studio</span>
              </button>
            </div>

            <button aria-label="Close"
              type="button"
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Validation / Alert Banner */}
        {validationError && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-300 text-red-950 text-xs font-bold flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Acceptable Formats & Constraints Bar */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-xs font-bold text-slate-900">Container Constraints & Formats:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 text-[10px] font-mono font-black">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-400">Max 3 Files</span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-400">Video Max 30s Playtime</span>
            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-900 border border-slate-300">PNG</span>
            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-900 border border-slate-300">JPEG</span>
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-950 border border-sky-400">WebP</span>
            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-950 border border-purple-400">GIF89a</span>
            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-950 border border-indigo-400">APNG (24-bit Alpha)</span>
            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-950 border border-rose-400">MP4 / WebM</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* VIEW 1: MEDIA CONTAINER (MAX 3 FILES & BATCH CONTROLS)       */}
        {/* ============================================================ */}
        {activeView === 'container' && (
          <div className="space-y-6">
            {/* Batch Action Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-300">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 transition-colors"
                >
                  {selectedItemIds.length === containerItems.length && containerItems.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600" />
                  )}
                  <span>
                    {selectedItemIds.length === containerItems.length && containerItems.length > 0
                      ? 'Deselect All'
                      : 'Select All'}
                  </span>
                </button>
                <span className="text-slate-700">|</span>
                <span className="text-xs font-bold text-slate-700">
                  {selectedItemIds.length} of {containerItems.length} selected
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedItemIds.length > 0 && (
                  <button
                    type="button"
                    onClick={handleDeleteSelected}
                    className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-950 text-xs font-bold border border-red-300 flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-700" />
                    <span>Delete Selected ({selectedItemIds.length})</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={containerItems.length >= 3}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4 text-orange-400" />
                  <span>Upload & Crop New ({containerItems.length}/3)</span>
                </button>
              </div>
            </div>

            {/* Hidden Input for adding files */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.gif,.apng,.mp4,.webm,image/*,video/mp4,video/webm"
              onChange={handleFileChange}
              className="hidden text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            />

            {/* Container Grid (Holds max 3 files) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {containerItems.map((item, index) => {
                const isSelected = selectedItemIds.includes(item.id);
                const isItemVideo = checkIsVideoUrl(item.url);

                return (
                  <div
                    key={item.id}
                    className={`rounded-3xl border p-4 space-y-3 transition-all relative ${
                      item.isActive
                        ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/40 shadow-md'
                        : isSelected
                        ? 'bg-amber-50/60 border-amber-400 shadow-xs'
                        : 'bg-white border-slate-300 shadow-xs hover:border-slate-400'
                    }`}
                  >
                    {/* Header: Slot Badge & Multi-Select Checkbox */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(item.id)}
                          className="text-slate-600 hover:text-slate-900"
                          title="Select item for batch delete"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                        <span className="text-xs font-mono font-black text-slate-800">
                          Slot #{index + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-slate-900 text-white">
                          {item.format}
                        </span>
                        {item.isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-950 border border-emerald-400">
                            Active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Media Thumbnail Preview */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-slate-300 bg-slate-950">
                      {isItemVideo ? (
                        <video
                          src={item.url}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.label}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Video Playtime Badge */}
                      {isItemVideo && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-mono font-bold text-amber-300 flex items-center gap-1">
                          <Film className="w-3 h-3 text-amber-400" />
                          <span>{item.durationSeconds ? `${item.durationSeconds}s` : '≤30s'}</span>
                        </span>
                      )}
                    </div>

                    {/* Title & Metadata */}
                    <div>
                      <h4 className="text-xs font-black text-slate-900 truncate">{item.label}</h4>
                      <p className="text-[10px] font-bold text-slate-600 mt-0.5">Added {item.addedAt}</p>
                    </div>

                    {/* Validity Duration Selector */}
                    <div className="space-y-1 pt-2 border-t border-slate-200">
                      <label className="block text-[11px] font-bold text-slate-800">
                        Validity Duration:
                      </label>
                      <select
                        value={item.scheduleDuration}
                        onChange={(e) =>
                          handleUpdateItemDuration(item.id, e.target.value as PhotoScheduleDuration)
                        }
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="indefinite">Keep Indefinitely (Permanent)</option>
                        <option value="48h">48 Hours (Campaign)</option>
                        <option value="1w">1 Week (Weekly Cycle)</option>
                        <option value="1m">1 Month (Monthly Season)</option>
                      </select>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => handleSetActiveSlot(item.id)}
                        disabled={item.isActive}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          item.isActive
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                        }`}
                      >
                        {item.isActive ? '✓ Current Avatar' : 'Set as Active'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedItemIds([item.id]);
                          handleDeleteSelected();
                        }}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                        title="Delete this file"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Placeholder Card if < 3 items */}
              {containerItems.length < 3 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-3xl border-2 border-dashed border-slate-300 hover:border-orange-500 p-6 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer bg-slate-50/50 hover:bg-orange-50/30 transition-all min-h-[300px]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      Empty Media Container Slot #{containerItems.length + 1}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-700 max-w-[180px] mt-1">
                      Upload an Image (PNG, JPEG, WebP, GIF, APNG) or Video Loop (MP4/WebM ≤ 30s).
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 shadow-xs">
                    Browse File
                  </span>
                </div>
              )}
            </div>

            {/* Global Weekly Rotation & Scheduling Settings */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-black text-emerald-950 flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-emerald-700" />
                  <span>Auto-Rotate Images Weekly Between Container Slots</span>
                </div>
                <p className="text-[11px] font-medium text-emerald-800">
                  Automatically cycle profile avatars among the items in your media container every Monday at 00:00 UTC.
                </p>
              </div>
              <input
                type="checkbox"
                checked={rotateWeekly}
                onChange={(e) => setRotateWeekly(e.target.checked)}
                className="w-5 h-5 rounded-md text-slate-900 border-slate-300 focus:ring-emerald-500 cursor-pointer font-bold border bg-white focus:ring-2 placeholder:text-slate-400"
              />
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: CROP & FILTER STUDIO (INDIVIDUAL MEDIA WORKSPACE)    */}
        {/* ============================================================ */}
        {activeView === 'editor' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Canvas / Video Viewport (7 cols) */}
            <div className="md:col-span-7 space-y-3">
              <div className="relative aspect-square w-full rounded-3xl overflow-hidden border-2 border-slate-300 bg-slate-950 flex items-center justify-center shadow-inner group">
                {isVideo ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video
                      ref={videoRef}
                      src={sourceMediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {isCircleMask && (
                      <div className="absolute inset-0 pointer-events-none ring-4 ring-white/90 rounded-full scale-95 shadow-[0_0_0_9999px_rgba(15,23,42,0.4)]" />
                    )}
                    <button aria-label="Pause"
                      type="button"
                      onClick={() => {
                        if (!videoRef.current) return;
                        if (isPlayingVideo) {
                          videoRef.current.pause();
                          setIsPlayingVideo(false);
                        } else {
                          videoRef.current.play();
                          setIsPlayingVideo(true);
                        }
                      }}
                      className="absolute bottom-4 right-4 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md shadow-md"
                    >
                      {isPlayingVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-orange-400" />}
                    </button>
                  </div>
                ) : (
                  <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="w-full h-full cursor-grab active:cursor-grabbing select-none"
                    title="Drag on canvas to reposition/pan photo within circular frame"
                  />
                )}

                {/* Format Badge Indicator */}
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-mono font-black uppercase bg-slate-900/90 text-white border border-slate-700 shadow-md">
                  {detectedFormat.toUpperCase()} {isVideo ? `(≤30s LOOP)` : ''}
                </span>

                {!isVideo && (
                  <span className="absolute bottom-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold bg-slate-900/80 text-slate-300 backdrop-blur-sm pointer-events-none">
                    👆 Drag to pan • Sliders to crop
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold border border-slate-300 shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <UploadCloud className="w-4 h-4 text-slate-700" />
                  <span>Choose Another File</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCircleMask(!isCircleMask)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isCircleMask
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-800 border-slate-300'
                  }`}
                >
                  Circle Mask: {isCircleMask ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Right Editing Suite & Transformations (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              {!isVideo && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <ZoomIn className="w-3.5 h-3.5 text-slate-600" />
                      <span>Zoom & Scale:</span>
                    </span>
                    <span className="font-mono text-emerald-700">{zoom.toFixed(2)}x</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ZoomOut className="w-4 h-4 text-slate-600" />
                    <input
                      type="range"
                      min="0.8"
                      max="3.0"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-slate-900 cursor-pointer text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    />
                    <ZoomIn className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
              )}

              {!isVideo && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 space-y-2">
                  <span className="block text-xs font-bold text-slate-900">Rotate & Orientation</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>-90°</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRotation((prev) => (prev + 90) % 360)}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 flex items-center justify-center gap-1"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>+90°</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlipH(!flipH)}
                      className={`p-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 ${
                        flipH ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-800 border-slate-300'
                      }`}
                    >
                      <FlipHorizontal className="w-3.5 h-3.5" />
                      <span>Flip</span>
                    </button>
                  </div>
                </div>
              )}

              {!isVideo && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Meishe / Protocol Filters:</span>
                    </span>
                    <span className="text-[10px] uppercase font-mono font-black text-slate-600">
                      {activeFilter}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
                    {[
                      { id: 'none' as FilterPreset, label: 'Clean / Raw' },
                      { id: 'beauty' as FilterPreset, label: 'Beauty Glow' },
                      { id: 'cyber' as FilterPreset, label: 'Cyber Sovereign' },
                      { id: 'warm' as FilterPreset, label: 'Cinematic' },
                      { id: 'noir' as FilterPreset, label: 'Monochrome' }
                    ].map((flt) => (
                      <button
                        key={flt.id}
                        type="button"
                        onClick={() => setActiveFilter(flt.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                          activeFilter === flt.id
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {flt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!isVideo && detectedFormat !== 'gif' && detectedFormat !== 'apng' && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-300 space-y-2">
                  <span className="block text-xs font-bold text-slate-900">Output Encoding Format:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['webp', 'png', 'jpeg'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setOutputFormat(fmt)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-mono font-black uppercase border transition-all ${
                          outputFormat === fmt
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-900">Avatar Title / Label</label>
                <input
                  type="text"
                  value={mediaLabel}
                  onChange={(e) => setMediaLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <button
                type="button"
                onClick={handleCommitEditorToContainer}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Layers className="w-4 h-4" />
                <span>Save to Media Container Slot</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer CTAs */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-medium text-slate-700">
            Active Profile Media:{' '}
            <strong className="text-slate-900">{activeItem?.label}</strong> ({activeItem?.format.toUpperCase()})
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndApply}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Apply Changes & Update Wall</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SovereignMediaCropperModal;
