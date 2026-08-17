import React, { useState, useRef, useEffect } from 'react';

interface MediaUploadProps {
  onUpload: (mediaFiles: File[]) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

const validateMediaFile = (file: File, allowedTypes: string[], maxSizeMB: number): boolean => {
  const sizeLimitBytes = maxSizeMB * 1024 * 1024;
  if (file.size > sizeLimitBytes) return false;

  // Handles checking prefixes like 'image/' or specific types like 'image/png'
  return allowedTypes.some(type => file.type.startsWith(type) || file.type === type);
};

const MediaUpload: React.FC<MediaUploadProps> = ({
  onUpload,
  allowedTypes = ['image/', 'video/'],
  maxSizeMB = 10
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      await processFiles(files);
    }
  };

  const processFiles = async (files: File[]) => {
    setError(null);
    
    // Filter valid files
    const validFiles = files.filter(file => 
      validateMediaFile(file, allowedTypes, maxSizeMB)
    );

    if (validFiles.length !== files.length) {
      setError(`Some files were rejected due to invalid type or size (max ${maxSizeMB}MB)`);
    }

    if (validFiles.length === 0) {
      return;
    }

    // Process files with progress simulation
    setUploadProgress(0);
    const totalFiles = validFiles.length;
    
    for (let i = 0; i < totalFiles; i++) {
      // Simulate progress
      setUploadProgress(Math.floor(((i + 1) / totalFiles) * 100));
      
      // Wait a bit to simulate processing
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Call the upload handler
    onUpload(validFiles);
    
    // Reset progress with proper timer cleanup
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
    }
    progressTimerRef.current = setTimeout(() => {
      setUploadProgress(null);
      progressTimerRef.current = null;
    }, 1000);
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragging ? 'border-neon-gold bg-[rgba(255,215,0,0.05)]' : 'border-gray-600 hover:border-neon-blue'}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileSelect}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={allowedTypes.join(',')}
        multiple
        onChange={handleFileChange}
      />
      
      <div className="flex flex-col items-center justify-center">
        <svg 
          className="w-12 h-12 text-gray-400 mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        
        <p className="text-lg font-medium text-gray-300 mb-1">
          Drag & drop your files here
        </p>
        <p className="text-sm text-gray-500 mb-4">
          or click to browse
        </p>
        
        <div className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
          Supports: {allowedTypes.map(t => t.replace('/', '.')).join(', ')} (Max {maxSizeMB}MB)
        </div>
      </div>

      {uploadProgress !== null && (
        <div className="absolute bottom-0 left-0 right-0">
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-neon-gold h-1.5 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <div className="text-xs text-right mt-1 text-gray-400">
            {uploadProgress}%
          </div>
        </div>
      )}

      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-900/80 text-red-200 text-xs p-2 rounded-b-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default MediaUpload;