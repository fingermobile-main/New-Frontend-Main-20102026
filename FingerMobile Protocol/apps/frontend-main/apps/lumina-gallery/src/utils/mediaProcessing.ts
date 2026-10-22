/**
 * Media processing utilities for Lumina Gallery
 * Handles image/video processing, thumbnail generation, and format conversion
 */

// Types for media processing
export interface MediaFile {
  id: string;
  file: File;
  previewUrl: string;
  type: 'image' | 'video';
  metadata: MediaMetadata;
}

export interface MediaMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  dimensions?: { width: number; height: number };
  duration?: number;
  createdAt: Date;
}

export interface ProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // For images (0-1)
  format?: 'jpeg' | 'png' | 'webp' | 'mp4' | 'webm'; // Desired output format
  thumbnailSize?: { width: number; height: number };
}

/**
 * Validates media file type and size
 */
export const validateMediaFile = (file: File, allowedTypes: string[] = [], maxSizeMB: number = 10): boolean => {
  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.some(type => file.type.startsWith(type))) {
    console.error(`Invalid file type: ${file.type}`);
    return false;
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    console.error(`File size exceeds limit: ${file.size} > ${maxSizeBytes} bytes`);
    return false;
  }

  return true;
};

/**
 * Generates a thumbnail from an image or video file
 */
export const generateThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      
      if (file.type.startsWith('image/')) {
        // For images, create a thumbnail directly
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          // Set thumbnail dimensions (max 200x200 while preserving aspect ratio)
          const maxWidth = 200;
          const maxHeight = 200;
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = dataUrl;
      } else if (file.type.startsWith('video/')) {
        // For videos, capture a frame at 2 seconds or middle of video
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = dataUrl;
        
        video.onloadedmetadata = () => {
          // Seek to 2 seconds or middle of video if shorter
          const seekTo = Math.min(2, video.duration / 2);
          
          video.currentTime = seekTo;
          
          video.onseeked = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              reject(new Error('Could not get canvas context'));
              return;
            }
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          };
        };
      } else {
        reject(new Error('Unsupported file type for thumbnail generation'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Gets metadata from media file
 */
export const extractMediaMetadata = (file: File): Promise<MediaMetadata> => {
  return new Promise((resolve) => {
    const metadata: MediaMetadata = {fileName: file.name,
  fileSize: file.size,
  mimeType: file.type,
  createdAt: new Date()
    };
    
    if (file.type.startsWith('image/')) {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.onload = () => {
          metadata.dimensions = {width: img.width,
  height: img.height
          };
          resolve(metadata);
        };
        img.src = e.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      const reader = new FileReader();
      
      reader.onload = (e) => {
        video.onloadedmetadata = () => {
          metadata.dimensions = {width: video.videoWidth,
  height: video.videoHeight
          };
          metadata.duration = video.duration;
          resolve(metadata);
        };
        video.src = e.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    } else {
      // For non-image/video files, just return basic metadata
      resolve(metadata);
    }
  });
};

/**
 * Compresses an image file to reduce size
 */
export const compressImage = (file: File, options: ProcessingOptions = {}): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        
        if (options.maxWidth && width > options.maxWidth) {
          height = (height * options.maxWidth) / width;
          width = options.maxWidth;
        }
        
        if (options.maxHeight && height > options.maxHeight) {
          width = (width * options.maxHeight) / height;
          height = options.maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Determine output format
        const format = options.format || 'jpeg';
        const mimeType = format === 'jpeg' ? 'image/jpeg' : 
                         format === 'png' ? 'image/png' : 'image/webp';
        
        // Determine quality
        const quality = options.quality !== undefined ? options.quality : 0.8;
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Could not compress image'));
            }
          },
          mimeType,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Error loading image for compression'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading image file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Creates a MediaFile object with preview and metadata
 */
export const createMediaFile = async (file: File): Promise<MediaFile> => {
  const previewUrl = URL.createObjectURL(file);
  const metadata = await extractMediaMetadata(file);
  
  return {id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    file,
    previewUrl,
type: file.type.startsWith('image/') ? 'image' : 
          file.type.startsWith('video/') ? 'video' : 'image',
    metadata
  };
};

/**
 * Releases the preview URL to free up memory
 */
export const releaseMediaFile = (mediaFile: MediaFile) => {
  URL.revokeObjectURL(mediaFile.previewUrl);
};