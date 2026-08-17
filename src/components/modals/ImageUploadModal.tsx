import React, { useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploadModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onUpload?: (file: File) => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ 
  isOpen = false, 
  onClose,
  onUpload
}) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload?.(selectedFile);
      onClose?.();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Upload Image</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to select or drag and drop</p>
            <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="imageInput" />
            <label htmlFor="imageInput" className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
              Select File
            </label>
          </div>
          {selectedFile && (
            <p className="text-sm text-gray-600">Selected: {selectedFile.name}</p>
          )}
          <button onClick={handleUpload} disabled={!selectedFile} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
