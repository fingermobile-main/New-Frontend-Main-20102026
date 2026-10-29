import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Film,
  X,
  CheckCircle,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';

export interface CommerceMediaValue {
  coverUrl: string;
  galleryUrls: string[];
  videoUrl?: string;
  isCensored?: boolean;
}

interface CommerceMediaPickerProps {
  value: CommerceMediaValue;
  onChange: (newValue: CommerceMediaValue) => void;
  title?: string;
  description?: string;
  allowVideo?: boolean;
  allowGallery?: boolean;
  maxGalleryImages?: number;
}

export const CommerceMediaPicker: React.FC<CommerceMediaPickerProps> = ({
  value,
  onChange,
  title = 'Product & Service Media Assets',
  description = 'Upload high-resolution cover photos, gallery images, and showcase videos saved directly to Express backend storage.',
  allowVideo = true,
  allowGallery = true,
  maxGalleryImages = 8
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'cover' | 'gallery' | 'video'>('cover');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewBlur, setPreviewBlur] = useState<boolean>(Boolean(value.isCensored));

  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Core file upload helper targeting /api/uploads
  const uploadSingleFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      }
    });

    if (response.data?.success && response.data?.data?.url) {
      return response.data.data.url;
    }
    if (response.data?.url) {
      return response.data.url;
    }
    throw new Error('Upload succeeded but no media URL was returned by the server.');
  };

  // Handle Cover Photo Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);

    try {
      const url = await uploadSingleFile(file);
      onChange({
        ...value,
        coverUrl: url
      });
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to upload cover photo');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  // Handle Gallery Images (Single or Multi)
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (value.galleryUrls.length + files.length > maxGalleryImages) {
      setErrorMessage(`Maximum limit of ${maxGalleryImages} gallery images reached.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadSingleFile(files[i]);
        newUrls.push(url);
      }

      onChange({
        ...value,
        galleryUrls: [...value.galleryUrls, ...newUrls]
      });
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to upload gallery images');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  // Handle Video Upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);

    try {
      const url = await uploadSingleFile(file);
      onChange({
        ...value,
        videoUrl: url
      });
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to upload video showcase');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  // Remove Gallery Image
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    const updated = value.galleryUrls.filter((_, idx) => idx !== indexToRemove);
    onChange({
      ...value,
      galleryUrls: updated
    });
  };

  return (
    <div className="bg-slate-50 border border-slate-300 rounded-2xl p-4 space-y-3.5 text-xs">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
            <Upload className="w-4 h-4 text-indigo-700" />
            {title}
          </h4>
          <p className="text-[11px] font-medium text-slate-700 mt-0.5">
            {description}
          </p>
        </div>

        {/* 18+ Censorship Mask Switch */}
        <button
          type="button"
          onClick={() => {
            const next = !value.isCensored;
            setPreviewBlur(next);
            onChange({ ...value, isCensored: next });
          }}
          className={`px-2.5 py-1 rounded-lg font-bold border transition inline-flex items-center gap-1.5 cursor-pointer ${
            value.isCensored
              ? 'bg-amber-100 text-amber-950 border-amber-400'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
          }`}
          title="Toggle 18+ Sensitive Blur Censorship mask for catalog previews"
        >
          {value.isCensored ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-amber-800" />
              <span>18+ Censored Mask Active</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-slate-600" />
              <span>Apply 18+ Censor Mask</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-rose-700 hover:text-rose-950 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl font-bold">
        <button
          type="button"
          onClick={() => setActiveMediaTab('cover')}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeMediaTab === 'cover'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 text-indigo-700" />
          <span>Cover Photo {value.coverUrl ? '✓' : ''}</span>
        </button>

        {allowGallery && (
          <button
            type="button"
            onClick={() => setActiveMediaTab('gallery')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeMediaTab === 'gallery'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-purple-700" />
            <span>Gallery ({value.galleryUrls.length}/{maxGalleryImages})</span>
          </button>
        )}

        {allowVideo && (
          <button
            type="button"
            onClick={() => setActiveMediaTab('video')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeMediaTab === 'video'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-rose-700" />
            <span>Showcase Video {value.videoUrl ? '✓' : ''}</span>
          </button>
        )}
      </div>

      {/* TAB 1: COVER PHOTO */}
      {activeMediaTab === 'cover' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start gap-3">
            {/* Thumbnail Preview Box */}
            <div className="w-28 h-28 rounded-xl border-2 border-dashed border-slate-300 bg-white overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs">
              {value.coverUrl ? (
                <div className="relative w-full h-full group">
                  <img
                    src={value.coverUrl}
                    alt="Cover Preview"
                    className={`w-full h-full object-cover transition duration-200 ${
                      previewBlur ? 'filter blur-md' : ''
                    }`}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {previewBlur && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] text-white font-black uppercase tracking-wider">
                      18+ Blur
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => onChange({ ...value, coverUrl: '' })}
                    className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm"
                    title="Remove Cover Photo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="text-center p-2">
                  <ImageIcon className="w-6 h-6 text-slate-400 mx-auto" />
                  <span className="text-[10px] font-bold text-slate-500 block leading-tight mt-1">No Cover Photo</span>
                </div>
              )}
            </div>

            {/* Upload Area & Direct URL */}
            <div className="flex-1 w-full space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold inline-flex items-center gap-2 shadow-xs transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? `Uploading (${uploadProgress}%)` : 'Upload Cover Photo (.png, .jpg, .webp)'}</span>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                    onChange={handleCoverUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] font-medium text-slate-600">or enter direct image URL:</span>
              </div>

              <input
                type="text"
                value={value.coverUrl}
                onChange={(e) => onChange({ ...value, coverUrl: e.target.value.trim() })}
                placeholder="https://... or /uploads/images/cover.jpg"
                className="w-full p-2 font-mono text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GALLERY IMAGES */}
      {activeMediaTab === 'gallery' && allowGallery && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="cursor-pointer px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold inline-flex items-center gap-2 shadow-xs transition">
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? `Uploading (${uploadProgress}%)` : 'Add Gallery Photos'}</span>
              <input
                ref={galleryInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                onChange={handleGalleryUpload}
                disabled={isUploading || value.galleryUrls.length >= maxGalleryImages}
                className="hidden"
              />
            </label>
            <span className="text-[11px] font-medium text-slate-600">
              Hold Shift or Ctrl to select multiple images simultaneously.
            </span>
          </div>

          {/* Gallery Thumbnails Grid */}
          {value.galleryUrls.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {value.galleryUrls.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative group rounded-xl border border-slate-300 bg-white overflow-hidden aspect-square flex items-center justify-center shadow-2xs"
                >
                  <img
                    src={url}
                    alt={`Gallery ${idx + 1}`}
                    className={`w-full h-full object-cover transition ${
                      previewBlur ? 'filter blur-md' : ''
                    }`}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="p-1 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm"
                      title="Remove image from gallery"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-[9px] font-bold rounded">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-500">
              <ImageIcon className="w-6 h-6 mx-auto mb-1 text-slate-400" />
              <p className="font-bold text-slate-700">No gallery images added yet</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Click &ldquo;Add Gallery Photos&rdquo; above to select multi-angle product shots.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SHOWCASE VIDEO */}
      {activeMediaTab === 'video' && allowVideo && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start gap-3">
            {/* Video Player Preview Box */}
            <div className="w-36 h-28 rounded-xl border-2 border-dashed border-slate-300 bg-black overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs">
              {value.videoUrl ? (
                <div className="relative w-full h-full group">
                  <video
                    src={value.videoUrl}
                    controls
                    className={`w-full h-full object-cover ${
                      previewBlur ? 'filter blur-md' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => onChange({ ...value, videoUrl: '' })}
                    className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm z-10"
                    title="Remove Video"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="text-center p-2 text-slate-400">
                  <Film className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-[10px] font-bold block leading-tight">No Video Reel</span>
                </div>
              )}
            </div>

            {/* Video Upload Controls */}
            <div className="flex-1 w-full space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold inline-flex items-center gap-2 shadow-xs transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? `Uploading Video (${uploadProgress}%)` : 'Upload Video File (.mp4, .mov, .webm)'}</span>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*,.mp4,.mov,.webm,.mkv"
                    onChange={handleVideoUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] font-medium text-slate-600">or enter video/HLS URL:</span>
              </div>

              <input
                type="text"
                value={value.videoUrl || ''}
                onChange={(e) => onChange({ ...value, videoUrl: e.target.value.trim() })}
                placeholder="https://.../video.mp4 or https://.../stream.m3u8"
                className="w-full p-2 font-mono text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-bold text-slate-800">
            <span>Uploading media asset to Express backend...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-700 h-2 transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Active Assets Summary Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 text-[11px] font-bold text-slate-700">
        <span className="text-slate-500 font-medium">Attached Media:</span>
        {value.coverUrl ? (
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 border border-emerald-400 rounded-md inline-flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-800" />
            Cover Image Attached
          </span>
        ) : (
          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-300 rounded-md">
            No Cover
          </span>
        )}

        {value.galleryUrls.length > 0 && (
          <span className="px-2 py-0.5 bg-purple-100 text-purple-950 border border-purple-400 rounded-md">
            {value.galleryUrls.length} Gallery Image{value.galleryUrls.length > 1 ? 's' : ''}
          </span>
        )}

        {value.videoUrl && (
          <span className="px-2 py-0.5 bg-rose-100 text-rose-950 border border-rose-400 rounded-md">
            Showcase Video Attached
          </span>
        )}
      </div>
    </div>
  );
};

export default CommerceMediaPicker;
