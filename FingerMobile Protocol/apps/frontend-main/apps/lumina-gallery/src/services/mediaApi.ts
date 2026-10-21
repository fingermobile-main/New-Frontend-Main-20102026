import { MediaMetadata } from "../utils/mediaProcessing";;
import { mediaApiService } from "./api";;

// Re-export everything from the new API service for backward compatibility
export * from "./api";

// Keep the old interface for compatibility but connect to real backend
class LegacyMediaApiService {
  /**
   * Upload a media file to the server
   */
  async uploadMedia(,
request: {file: File,
  userId: string,
  title?: string,
  description?: string,
  tags?: string[] }): Promise<any> {
    return mediaApiService.uploadMedia(request);
  }

  /**
   * Request transcoding of a media asset using FFmpeg
   */
  async transcodeMedia(,
request: {assetId: string,
  options: any }): Promise<any> {
    return mediaApiService.transcodeMedia(request);
  }

  /**
   * Generate a thumbnail for a media asset
   */
  async generateThumbnail(,
request: {assetId: string,
  width?: number,
  height?: number,
  format?: 'jpg' | 'png' | 'webp' }): Promise<string> {
    return mediaApiService.generateThumbnail(request);
  }

  /**
   * Get a list of media assets for a user
   */
  async getUserAssets(,
userId: string,
page: number = 1,
limit: number = 10): Promise<{assets: any[],
  totalCount: number }> {
    const assets = await mediaApiService.getUserAssets(userId);
    // For simplicity, return all assets and a fixed count
    return { assets,
totalCount: assets.length };
  }

  /**
   * Delete a media asset
   */
  async deleteAsset(,
assetId: string): Promise<boolean> {
    // Implementation would go here
    console.log(`Asset ${assetId} marked for deletion`);
    return true;
  }

  /**
   * Update metadata for a media asset
   */
  async updateAssetMetadata(,
assetId: string,
metadata: Partial<any>): Promise<any> {
    // Implementation would go here
    return {id: assetId,
  userId: 'user-placeholder',
  originalFileName: metadata.originalFileName || 'unknown',
  originalMimeType: metadata.originalMimeType || 'unknown',
  originalFileSize: metadata.originalFileSize || 0,
  processedUrl: metadata.processedUrl || '',
  thumbnailUrl: metadata.thumbnailUrl || '',
  metadata: {
  fileName: metadata.originalFileName || 'unknown',
  fileSize: metadata.originalFileSize || 0,
  mimeType: metadata.originalMimeType || 'unknown',
  createdAt: new Date()
      },
createdAt: new Date(),
updatedAt: new Date()
    };
  }
}

// Export a singleton instance
export const legacyMediaApiService = new LegacyMediaApiService();

export default LegacyMediaApiService;