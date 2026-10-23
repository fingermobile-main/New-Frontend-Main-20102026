import { useState, useCallback, useRef } from 'react';
import { MediaFile, createMediaFile } from '../utils/mediaProcessing';

interface UseMediaUploadReturn {
  uploading: boolean;
  progress: number;
  error: string | null;
  uploadedFiles: MediaFile[];
  uploadFiles: (_files: FileList | File[]) => Promise<void>;
  reset: () => void;
}

const useMediaUpload = (
  apiEndpoint: string = '/api/lumina/upload'
): UseMediaUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);
  const uploadTimerRef = useRef<NodeJS.Timeout | null>(null);

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Convert FileList to array if needed
      const filesArray = Array.from(files);

      // Create MediaFile objects for previews
      const mediaFiles = await Promise.all(filesArray.map(file => createMediaFile(file)));
      setUploadedFiles(prev => [...prev, ...mediaFiles]);

      // Process each file individually
      for (let i = 0; i < filesArray.length; i++) {
        const formData = new FormData();
        formData.append('file', filesArray[i]);
        formData.append('originalName', filesArray[i].name);

        // Simulate upload progress
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            // Distribute progress across all files
            const overallProgress = ((i * 100) + percentComplete) / filesArray.length;
            setProgress(Number(overallProgress.toFixed(2)));
          }
        });

        // Simulate upload
        await new Promise((resolve) => {
          if (uploadTimerRef.current) {
            clearTimeout(uploadTimerRef.current);
          }
          uploadTimerRef.current = setTimeout(() => {
            setProgress(((i + 1) / filesArray.length) * 100);
            uploadTimerRef.current = null;
            resolve(true);
          }, 500 + Math.random() * 1000);
        });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [apiEndpoint]);

  const reset = useCallback(() => {
    // Clean up any pending timers
    if (uploadTimerRef.current) {
      clearTimeout(uploadTimerRef.current);
      uploadTimerRef.current = null;
    }

    setUploadedFiles([]);
    setError(null);
    setUploading(false);
    setProgress(0);
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadedFiles,
    uploadFiles,
    reset
  };
};

export default useMediaUpload;