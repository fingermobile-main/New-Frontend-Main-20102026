import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MediaEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  onSave?: (editedMedia: any) => void;
}

const MediaEditorModal: React.FC<MediaEditorModalProps> = ({ 
  isOpen, 
  onClose,
  mediaUrl,
  mediaType = 'image',
  onSave 
}) => {
  const [brightness, setBrightness] = React.useState(100);
  const [contrast, setContrast] = React.useState(100);
  const [saturation, setSaturation] = React.useState(100);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave?.({
      url: mediaUrl,
      adjustments: { brightness, contrast, saturation }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Media</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-100 rounded-lg flex items-center justify-center min-h-[400px]">
            {mediaUrl ? (
              mediaType === 'image' ? (
                <img
                  src={mediaUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-lg"
                  style={{
                    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
                  }}
                 />
              ) : (
                <div className="text-gray-500">{mediaType} preview not available</div>
              )
            ) : (
              <div className="text-gray-400">No media selected</div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brightness: {brightness}%
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contrast: {contrast}%
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Saturation: {saturation}%
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={() => {
                setBrightness(100);
                setContrast(100);
                setSaturation(100);
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Reset Adjustments
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaEditorModal;
