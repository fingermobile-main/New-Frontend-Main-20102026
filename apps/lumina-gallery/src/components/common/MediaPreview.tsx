import React, { useState } from 'react';
import { MediaFile } from '../../utils/mediaProcessing';

interface MediaPreviewProps {
  mediaFile: MediaFile;
  onRemove?: (id: string) => void;
  showControls?: boolean;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ 
  mediaFile, 
  onRemove, 
  showControls = true 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (mediaFile.type === 'video') {
      setIsPlaying(!isPlaying);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(mediaFile.id);
    }
  };

  return (
    <div className="relative group bg-gray-900 rounded-xl overflow-hidden border border-gray-700 w-full h-full">
      {mediaFile.type === 'image' ? (
        <img
          src={mediaFile.previewUrl}
          alt={mediaFile.metadata.fileName}
          className="w-full h-full object-cover"
        />
      ) : (
        <video
          src={mediaFile.previewUrl}
          className="w-full h-full object-cover"
          onClick={handlePlayPause}
          loop
        >
          Your browser does not support the video tag.
        </video>
      )}

      {showControls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <div className="w-full">
            <div className="text-xs text-gray-300 truncate mb-1">
              {mediaFile.metadata.fileName}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-400">
                {mediaFile.metadata.dimensions 
                  ? `${mediaFile.metadata.dimensions.width}×${mediaFile.metadata.dimensions.height}` 
                  : `${(mediaFile.metadata.fileSize / 1024 / 1024).toFixed(2)} MB`}
              </div>
              <button
                onClick={handleRemove}
                className="p-1.5 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                aria-label="Remove file"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {!showControls && (
        <div className="absolute top-2 right-2">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
            mediaFile.type === 'image' 
              ? 'bg-blue-500/80 text-white' 
              : 'bg-purple-500/80 text-white'
          }`}>
            {mediaFile.type === 'image' ? 'IMG' : 'VID'}
          </div>
        </div>
      )}

      {mediaFile.type === 'video' && (
        <button
          className={`absolute inset-0 flex items-center justify-center w-full h-full ${
            isPlaying ? 'hidden' : 'opacity-0 group-hover:opacity-100'
          } transition-opacity bg-black/30`}
          onClick={handlePlayPause}
        >
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
};

export default MediaPreview;