import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

export interface MediaAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  thumbnailPath?: string;
  uploadDate: Date;
}

export interface RichTextContent {
  html: string;
  plainText: string;
  formattedContent: any; // AST or structured format for rich text
  mediaEmbeds: MediaEmbed[];
}

export interface MediaEmbed {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  src: string;
  caption?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface UploadConfig {
  allowedTypes: string[];
  maxSize: number; // in bytes
  storagePath: string;
}

export class RichMediaService {
  private static readonly DEFAULT_CONFIG: UploadConfig = {
    allowedTypes: [
      // Images
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      // Videos
      'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo',
      // Audio
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/x-m4a',
      // Documents
      'text/markdown', 'text/xml', 'text/plain',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ],
    maxSize: 50 * 1024 * 1024, // 50MB
    storagePath: './uploads'
  };

  private config: UploadConfig;

  constructor(config?: Partial<UploadConfig>) {
    this.config = {
      ...RichMediaService.DEFAULT_CONFIG,
      ...config
    };
    this.ensureStoragePath();
  }

  private ensureStoragePath(): void {
    if (!fs.existsSync(this.config.storagePath)) {
      fs.mkdirSync(this.config.storagePath, { recursive: true });
    }
  }

  async uploadMedia(fileBuffer: Buffer, originalFileName: string, mimeType: string): Promise<MediaAttachment> {
    // Validate file type
    if (!this.config.allowedTypes.includes(mimeType)) {
      throw new Error(`File type not allowed: ${mimeType}`);
    }

    // Validate file size
    if (fileBuffer.length > this.config.maxSize) {
      throw new Error(`File size exceeds limit: ${fileBuffer.length} > ${this.config.maxSize}`);
    }

    // Generate unique filename
    const fileExtension = path.extname(originalFileName).toLowerCase();
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.config.storagePath, uniqueFileName);

    // Save file
    await writeFileAsync(filePath, fileBuffer);

    // Create thumbnail for images and videos
    let thumbnailPath: string | undefined;
    if (mimeType.startsWith('image/') || mimeType.startsWith('video/')) {
      thumbnailPath = await this.generateThumbnail(filePath, uniqueFileName);
    }

    const mediaAttachment: MediaAttachment = {
      id: uuidv4(),
      fileName: originalFileName,
      fileType: mimeType,
      fileSize: fileBuffer.length,
      filePath: filePath,
      thumbnailPath,
      uploadDate: new Date()
    };

    return mediaAttachment;
  }

  private async generateThumbnail(filePath: string, originalFileName: string): Promise<string> {
    // In a real implementation, this would generate actual thumbnails
    // using libraries like sharp for images or ffmpeg for videos
    // For now, we'll return a placeholder
    const thumbnailName = `thumb_${path.basename(filePath, path.extname(filePath))}.jpg`;
    const thumbnailPath = path.join(this.config.storagePath, thumbnailName);

    // Create a placeholder thumbnail file
    await writeFileAsync(thumbnailPath, Buffer.from('thumbnail placeholder'));

    return thumbnailPath;
  }

  async processRichText(content: string): Promise<RichTextContent> {
    // This would integrate with a rich text editor library like Quill, Draft.js, or similar
    // For now, we'll implement basic processing
    
    // Extract media embeds from content
    const mediaEmbeds: MediaEmbed[] = [];
    
    // Simple regex to extract image/video/audio/document tags
    const mediaRegex = /<(img|video|audio|embed|object)[^>]*src=["']([^"']*)["'][^>]*>/gi;
    let match;
    
    while ((match = mediaRegex.exec(content)) !== null) {
      const tag = match[1];
      const src = match[2];
      
      let type: 'image' | 'video' | 'audio' | 'document' = 'document';
      
      if (tag === 'img') type = 'image';
      else if (tag === 'video') type = 'video';
      else if (tag === 'audio') type = 'audio';
      
      mediaEmbeds.push({
        id: uuidv4(),
        type,
        src
      });
    }

    // Process and sanitize HTML content
    const sanitizedHtml = this.sanitizeHtml(content);
    
    // Convert to structured format (simplified implementation)
    const formattedContent = this.parseToStructuredFormat(sanitizedHtml);

    return {
      html: sanitizedHtml,
      plainText: this.extractPlainText(content),
      formattedContent,
      mediaEmbeds
    };
  }

  private sanitizeHtml(html: string): string {
    // Basic HTML sanitization (in a real implementation, use DOMPurify or similar)
    // Remove potentially dangerous tags and attributes
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '');
  }

  private extractPlainText(html: string): string {
    // Simple extraction of plain text from HTML
    return html.replace(/<[^>]*>/g, '').trim();
  }

  private parseToStructuredFormat(html: string): any {
    // Simplified structured format parsing
    // In a real implementation, this would use a proper HTML parser
    return {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{
          type: 'text',
          text: this.extractPlainText(html)
        }]
      }]
    };
  }

  async validateMediaForUser(userId: string, mediaAttachment: MediaAttachment): Promise<boolean> {
    // In a real implementation, this would check user permissions and quotas
    // For now, return true
    return true;
  }

  async processMediaBatch(files: Array<{ buffer: Buffer; originalName: string; mimeType: string }>): Promise<MediaAttachment[]> {
    const results: MediaAttachment[] = [];
    
    for (const file of files) {
      const attachment = await this.uploadMedia(file.buffer, file.originalName, file.mimeType);
      results.push(attachment);
    }
    
    return results;
  }

  async generateMediaMetadata(filePath: string, mediaType: string): Promise<any> {
    // In a real implementation, this would extract actual metadata
    // like dimensions for images, duration for videos, etc.
    // For now, return placeholder metadata
    const stats = fs.statSync(filePath);
    
    const metadata: any = {
      size: stats.size,
      uploadedAt: new Date(stats.birthtime),
      modifiedAt: new Date(stats.mtime)
    };

    if (mediaType.startsWith('image/')) {
      metadata.dimensions = { width: 1920, height: 1080 }; // Placeholder
      metadata.format = mediaType.split('/')[1];
    } else if (mediaType.startsWith('video/')) {
      metadata.duration = 120; // Placeholder in seconds
      metadata.format = mediaType.split('/')[1];
    } else if (mediaType.startsWith('audio/')) {
      metadata.duration = 180; // Placeholder in seconds
      metadata.format = mediaType.split('/')[1];
    } else if (mediaType === 'application/pdf') {
      metadata.pageCount = 10; // Placeholder
      metadata.title = 'Document Title'; // Placeholder
    }

    return metadata;
  }

  async cleanupOldFiles(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    let deletedCount = 0;
    const files = fs.readdirSync(this.config.storagePath);
    
    for (const file of files) {
      const filePath = path.join(this.config.storagePath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.birthtime < cutoffDate) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    }
    
    return deletedCount;
  }
}

// Export singleton instance
export const richMediaService = new RichMediaService();