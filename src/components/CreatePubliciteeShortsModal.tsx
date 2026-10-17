import React, { useState } from 'react';
import { Film, Smartphone, Clock, CheckCircle2, AlertCircle, X, Layers } from 'lucide-react';

import { uploadService } from '../services/UploadService';

interface CreatePubliciteeShortsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  hasPubliciteeSubscription?: boolean;
}

export const CreatePubliciteeShortsModal: React.FC<CreatePubliciteeShortsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  hasPubliciteeSubscription = false
}) => {
  const [selectedType, setSelectedType] = useState<'publicitee' | 'fingershorts'>('publicitee');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Publicitee State (Single Video Card, Max 1.5GB, Max 1h 55m, $3/mo)
  const [pubTitle, setPubTitle] = useState('');
  const [pubDescription, setPubDescription] = useState('');
  const [pubCategory, setPubCategory] = useState<'short_film' | 'vlog' | 'skit'>('short_film');
  const [pubVideoFile, setPubVideoFile] = useState<File | null>(null);
  const [pubThumbnailFile, setPubThumbnailFile] = useState<File | null>(null);
  const [pubDurationSeconds, setPubDurationSeconds] = useState(300);
  const [pubFileSizeBytes, setPubFileSizeBytes] = useState(0);

  // FingerShorts State (Up to 20 Media Cards, Max 20MB, Max 60s, Free)
  const [shortTitle, setShortTitle] = useState('');
  const [cards, setCards] = useState<Array<{
    media_url: string;
    media_type: 'video' | 'image' | 'audio';
    duration_seconds: number;
    file_size_bytes: number;
    sound_title?: string;
    file?: File;
  }>>([
    { media_url: '', media_type: 'video', duration_seconds: 15, file_size_bytes: 0 }
  ]);

  if (!isOpen) return null;

  const handleAddShortCard = () => {
    if (cards.length >= 20) {
      setErrorMessage('Maximum of 20 media cards reached for FingerShorts');
      return;
    }
    setCards(prev => [
      ...prev,
      { media_url: '', media_type: 'image', duration_seconds: 5, file_size_bytes: 2000000 }
    ]);
  };

  const handleRemoveShortCard = (index: number) => {
    if (cards.length <= 1) return;
    setCards(prev => prev.filter((_, i) => i !== index));
  };

  const handleCardChange = (index: number, field: string, value: any) => {
    setCards(prev => {
      const updated = [...prev];
      if (field === 'file' && value instanceof File) {
        updated[index] = { ...updated[index], file: value, file_size_bytes: value.size };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      if (selectedType === 'publicitee') {
        // Validate Publicitee Constraints
        if (!pubTitle || !pubVideoFile) {
          throw new Error('Title and Video File are required');
        }
        if (pubDurationSeconds > 6900) {
          throw new Error('Video duration exceeds 1hr 55mins (6900s) maximum cap');
        }
        if (pubFileSizeBytes > 1610612736) {
          throw new Error('File size exceeds 1.5GB maximum cap');
        }

        // Upload files
        const uploadedVideo = await uploadService.uploadFile(pubVideoFile, 'publicitee');
        let uploadedThumbUrl = '';
        if (pubThumbnailFile) {
          const uploadedThumb = await uploadService.uploadFile(pubThumbnailFile, 'publicitee');
          uploadedThumbUrl = uploadedThumb.url;
        }

        const res = await fetch('/api/publicitee', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            title: pubTitle,
            description: pubDescription,
            category: pubCategory,
            video_url: uploadedVideo.url,
            thumbnail_url: uploadedThumbUrl,
            duration_seconds: pubDurationSeconds,
            file_size_bytes: pubFileSizeBytes
          })
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 402) {
            throw new Error('Active $3.00/month Publicitee subscription required to upload reels.');
          }
          throw new Error(data.error || 'Failed to publish Publicitee');
        }

        setSuccessMessage('Publicitee reel published successfully! Active for 168 hours (7 days).');
      } else {
        // Validate FingerShorts Constraints
        if (cards.length === 0 || cards.length > 20) {
          throw new Error('FingerShorts must have between 1 and 20 media cards');
        }
        for (let i = 0; i < cards.length; i++) {
          if (!cards[i].file) {
            throw new Error(`Card #${i + 1} is missing a Media File`);
          }
          if (cards[i].duration_seconds > 60) {
            throw new Error(`Card #${i + 1} duration exceeds 1 minute (60s) cap`);
          }
          if (cards[i].file_size_bytes > 20971520) {
            throw new Error(`Card #${i + 1} exceeds 20MB file size cap`);
          }
        }

        const uploadedCards = await Promise.all(cards.map(async (c) => {
          if (c.file) {
            const uploaded = await uploadService.uploadFile(c.file, 'fingershorts');
            return { ...c, media_url: uploaded.url, file: undefined };
          }
          return c;
        }));

        const res = await fetch('/api/fingershorts/sessions', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            title: shortTitle || 'My FingerShorts Story',
            cards: uploadedCards
          })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to publish FingerShorts');
        }

        setSuccessMessage('FingerShorts story published successfully! Active for 48 hours.');
      }

      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while publishing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-slate-300 dark:border-gray-800 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Post</h2>
            <p className="text-xs text-slate-700 dark:text-gray-400">Choose between Publicitee (Reels) or FingerShorts (Stories)</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-950 dark:text-gray-300 flex items-center justify-center transition-colors border border-gray-400 font-black"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Choice Selector Tabs */}
        <div className="grid grid-cols-2 p-4 gap-3 bg-gray-50/70 dark:bg-gray-800/40 border-b border-slate-200 dark:border-gray-800">
          <button
            type="button"
            onClick={() => setSelectedType('publicitee')}
            className={`p-4 rounded-2xl flex flex-col items-start border-2 text-left transition-all ${
              selectedType === 'publicitee'
                ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 text-orange-950 dark:text-orange-200 shadow-sm'
                : 'border-transparent bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="p-2 rounded-xl bg-orange-500 text-white"><Film className="w-5 h-5" /></span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-200 dark:bg-orange-900/60 text-orange-950 dark:text-orange-200 border border-orange-400 font-black">$3.00/mo</span>
            </div>
            <span className="font-bold text-sm">Publicitee (Reels)</span>
            <span className="text-[11px] text-slate-700 dark:text-gray-400 mt-1">Short Films, Vlogs, Skits • 168h (7d) TTL • 1 Video Card only • Up to 1.5GB / 1h 55m</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('fingershorts')}
            className={`p-4 rounded-2xl flex flex-col items-start border-2 text-left transition-all ${
              selectedType === 'fingershorts'
                ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 text-purple-950 dark:text-purple-200 shadow-sm'
                : 'border-transparent bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="p-2 rounded-xl bg-purple-600 text-white"><Smartphone className="w-5 h-5" /></span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-950 text-green-950 dark:text-green-300 border border-green-400 font-black">Free $0.00</span>
            </div>
            <span className="font-bold text-sm">FingerShorts (Stories)</span>
            <span className="text-[11px] text-slate-700 dark:text-gray-400 mt-1">Disappearing Stories • 48h (2d) TTL • Up to 20 Media Cards • Max 20MB & 60s per Card</span>
          </button>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="m-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="m-4 p-3 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {successMessage}
          </div>
        )}

        {selectedType === 'publicitee' && !hasPubliciteeSubscription && (
          <div className="mx-4 mb-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span>Note: Publicitee uploads require an active $3.00/mo Creator Pass.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[55vh] overflow-y-auto">
          {selectedType === 'publicitee' ? (
            <>
              {/* Publicitee Fields */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Reel Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Behind The Scenes: Lagos Movie Set"
                  value={pubTitle}
                  onChange={(e) => setPubTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none font-bold border-slate-300 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={pubCategory}
                    onChange={(e: any) => setPubCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="short_film">Short Film</option>
                    <option value="vlog">Vlog</option>
                    <option value="skit">Skit & Comedy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Duration (seconds)</label>
                  <input
                    type="number"
                    max={6900}
                    value={pubDurationSeconds}
                    onChange={(e) => setPubDurationSeconds(Math.min(6900, parseInt(e.target.value, 10) || 0))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                  />
                  <span className="text-[10px] text-slate-700">Max 6,900s (1Hr 55Mins)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Video File (Max 1.5GB) *</label>
                <input
                  type="file"
                  required
                  accept="video/mp4,video/x-m4v,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPubVideoFile(file);
                      setPubFileSizeBytes(file.size);
                    }
                  }}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-white outline-none font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Thumbnail Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setPubThumbnailFile(e.target.files[0]);
                  }}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-white outline-none font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Add a synopsis or creator note..."
                  value={pubDescription}
                  onChange={(e) => setPubDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-white outline-none resize-none font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 text-[11px] text-orange-900 dark:text-orange-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Clock className="w-3.5 h-3.5 text-orange-600" /> 168-Hour Expiration Notice
                </div>
                <p>Publicitee content is hosted for exactly 7 Days (168 Hours). Subscribed creators pay $3.00 monthly.</p>
              </div>
            </>
          ) : (
            <>
              {/* FingerShorts Fields */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Story Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Lagos City Weekend Vibes"
                  value={shortTitle}
                  onChange={(e) => setShortTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-white outline-none font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              {/* Cards List (Up to 20) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-600" /> Story Cards ({cards.length}/20)
                  </label>
                  {cards.length < 20 && (
                    <button
                      type="button"
                      onClick={handleAddShortCard}
                      className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      + Add Card
                    </button>
                  )}
                </div>

                {cards.map((card, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-slate-300 dark:border-gray-700 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-purple-600 dark:text-purple-400">Card #{idx + 1}</span>
                      {cards.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveShortCard(idx)}
                          className="text-red-500 hover:text-red-700 text-[11px]"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <select
                          value={card.media_type}
                          onChange={(e: any) => handleCardChange(idx, 'media_type', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="video">Video (Max 60s)</option>
                          <option value="image">Image (JPG/PNG)</option>
                          <option value="audio">Audio Track (MP3)</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="number"
                          max={60}
                          placeholder="Duration (sec, max 60)"
                          value={card.duration_seconds}
                          onChange={(e) => handleCardChange(idx, 'duration_seconds', Math.min(60, parseFloat(e.target.value) || 0))}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="file"
                        required
                        accept="video/*,image/*,audio/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleCardChange(idx, 'file', file);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-white outline-none font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Sound / Track Title (Optional)"
                        value={card.sound_title || ''}
                        onChange={(e) => handleCardChange(idx, 'sound_title', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-white outline-none font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 text-[11px] text-purple-900 dark:text-purple-200">
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <Clock className="w-3.5 h-3.5 text-purple-600" /> 48-Hour Disappearing Lifespan
                </div>
                <p>FingerShorts stories are 100% Free and disappear automatically after 48 hours.</p>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl font-bold text-slate-700 shadow-md transition-all ${
                selectedType === 'publicitee'
                  ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/20'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/20'
              } disabled:opacity-50`}
            >
              {isSubmitting
                ? 'Publishing...'
                : selectedType === 'publicitee'
                  ? 'Publish Publicitee Reel ($3.00/mo)'
                  : `Publish FingerShorts Story (${cards.length} Cards)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePubliciteeShortsModal;
