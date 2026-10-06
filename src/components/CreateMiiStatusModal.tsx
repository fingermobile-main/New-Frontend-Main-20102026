import React, { useState } from 'react';
import { Camera, X, Plus, AlertCircle, ShieldAlert } from 'lucide-react';
import { uploadService } from '../services/UploadService';

interface CreateMiiStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateMiiStatusModal: React.FC<CreateMiiStatusModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [cards, setCards] = useState<Array<{ file: File; media_type: 'video' | 'image' | 'audio'; duration_seconds: number; file_size_bytes: number }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (cards.length === 0) {
        throw new Error('At least one media card is required');
      }

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Upload files sequentially or in parallel
      const uploadedCards = await Promise.all(cards.map(async (c) => {
        const uploaded = await uploadService.uploadFile(c.file, 'mii');
        return {
          media_url: uploaded.url,
          media_type: c.media_type,
          duration_seconds: c.duration_seconds,
          file_size_bytes: c.file_size_bytes
        };
      }));

      const res = await fetch('/api/mii/status', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          cards: uploadedCards,
          audience_type: 'followers'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create Mii status');
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Very basic file validation
      if (file.size > 52428800) {
        setErrorMessage('File size exceeds 50MB limit');
        return;
      }
      const type = file.type.startsWith('video') ? 'video' : file.type.startsWith('image') ? 'image' : 'audio';
      setCards([...cards, { file, media_type: type, duration_seconds: 15, file_size_bytes: file.size }]);
    }
  };

  const removeCard = (idx: number) => {
    setCards(cards.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create Mii™ Status</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </div>
          )}

          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Disappears in 48 hours. Max 20 cards per status. End-to-end encrypted.
          </div>

          <form id="mii-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Media Cards ({cards.length}/20)</label>
              <div className="flex space-x-2 overflow-x-auto py-2">
                {cards.map((card, idx) => (
                  <div key={idx} className="relative w-20 h-20 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                    <span className="text-[10px] text-gray-500 truncate px-2">{card.file.name}</span>
                    <button type="button" onClick={() => removeCard(idx)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {cards.length < 20 && (
                  <label className="w-20 h-20 flex-shrink-0 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center cursor-pointer hover:border-emerald-500">
                    <Plus className="w-6 h-6 text-gray-400" />
                    <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button
            type="submit"
            form="mii-form"
            disabled={isSubmitting || cards.length === 0}
            className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Uploading...' : 'Post Mii Status'}
          </button>
        </div>
      </div>
    </div>
  );
};
