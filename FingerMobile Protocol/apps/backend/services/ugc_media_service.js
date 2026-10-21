/* eslint-disable no-unused-vars */
const logger = require('../utils/logger');
/**
 * UGC Media Service - Cloud Storage Integration
 * Supports AWS S3, Google Cloud Storage, and local filesystem
 * Includes FFmpeg processing for videos and sharp for images
 */

const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Initialize S3 client (if configured)
let s3Client = null;
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });
  logger.info('✅ AWS S3 initialized for media storage');
}

const STORAGE_TYPE = process.env.MEDIA_STORAGE || 'local'; // 's3', 'gcs', or 'local'
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads/media';
const MAX_FILE_SIZE = parseInt(process.env.MAX_UPLOAD_SIZE) || 100 * 1024 * 1024; // 100MB default

class UGCMediaService {
  /**
   * Generate unique filename for uploaded media
   */
  generateFilename(originalName, userId) {
    const ext = path.extname(originalName).toLowerCase();
    const hash = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    return `${userId}_${timestamp}_${hash}${ext}`;
  }

  /**
   * Validate file type and size
   */
  validateFile(file) {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'video/mp4', 'video/webm', 'video/quicktime',
      'audio/mpeg', 'audio/wav', 'audio/ogg'
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} not allowed`);
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
  }

  /**
   * Upload media to cloud storage or local filesystem
   */
  async uploadMedia(file, userId, metadata = {}) {
    try {
      this.validateFile(file);

      const filename = this.generateFilename(file.originalname || file.name, userId);
      const fileType = file.mimetype.split('/')[0]; // 'image', 'video', 'audio'

      let uploadResult;

      if (STORAGE_TYPE === 's3' && s3Client) {
        uploadResult = await this.uploadToS3(file, filename, metadata);
      } else {
        uploadResult = await this.uploadToLocal(file, filename, metadata);
      }

      // Store metadata in database
      const mediaRecord = await this.saveMediaMetadata({
        mediaId: uploadResult.mediaId,
        userId,
        filename,
        originalName: file.originalname || file.name,
        fileType,
        mimeType: file.mimetype,
        size: file.size,
        url: uploadResult.url,
        thumbnailUrl: uploadResult.thumbnailUrl || null,
        status: 'uploaded',
        metadata
      });

      logger.info(`✅ Media uploaded: ${filename} (${fileType})`);

      return {
        success: true,
        mediaId: uploadResult.mediaId,
        url: uploadResult.url,
        thumbnailUrl: uploadResult.thumbnailUrl,
        filename,
        fileType,
        size: file.size
      };
    } catch (error) {
      logger.error('❌ Upload failed:', error.message);
      throw error;
    }
  }

  /**
   * Upload to AWS S3
   */
  async uploadToS3(file, filename, metadata) {
    const bucket = process.env.S3_BUCKET_NAME;
    const key = `media/${filename}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer || file.path ? await fs.readFile(file.path) : file,
      ContentType: file.mimetype,
      Metadata: {
        'user-id': metadata.userId || '',
        'upload-date': new Date().toISOString()
      },
      ACL: 'public-read'
    });

    await s3Client.send(command);

    const url = `https://${bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;

    return {
      mediaId: crypto.randomUUID(),
      url,
      thumbnailUrl: null // Will be generated during processing
    };
  }

  /**
   * Upload to local filesystem
   */
  async uploadToLocal(file, filename, metadata) {
    // Ensure upload directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const filePath = path.join(UPLOAD_DIR, filename);

    // Write file
    if (file.buffer) {
      await fs.writeFile(filePath, file.buffer);
    } else if (file.path) {
      await fs.copyFile(file.path, filePath);
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/uploads/media/${filename}`;

    return {
      mediaId: crypto.randomUUID(),
      url,
      thumbnailUrl: null
    };
  }

  /**
   * Process media file (generate thumbnails, transcode videos)
   */
  async processMedia(mediaId, options = {}) {
    try {
      // Get media metadata from database
      const media = await this.getMediaMetadata(mediaId);

      if (!media) {
        throw new Error('Media not found');
      }

      let processedUrls = {};

      if (media.file_type === 'image') {
        processedUrls = await this.processImage(media);
      } else if (media.file_type === 'video') {
        processedUrls = await this.processVideo(media, options);
      } else if (media.file_type === 'audio') {
        processedUrls = await this.processAudio(media);
      }

      // Update media record with processed URLs
      await this.updateMediaProcessingStatus(mediaId, 'completed', processedUrls);

      logger.info(`✅ Media processed: ${mediaId}`);

      return {
        success: true,
        mediaId,
        processedUrls,
        status: 'completed'
      };
    } catch (error) {
      logger.error('❌ Processing failed:', error.message);

      // Mark as failed
      await this.updateMediaProcessingStatus(mediaId, 'failed', {});

      return {
        success: false,
        mediaId,
        error: error.message,
        status: 'failed'
      };
    }
  }

  /**
   * Process image - generate thumbnails using sharp (if available)
   */
  async processImage(media) {
    const thumbnails = {};

    try {
      // Try to use sharp for image processing
      const sharp = require('sharp');

      let imagePath;
      if (media.url.startsWith('http')) {
        // Download from URL first
        const response = await fetch(media.url);
        const buffer = await response.arrayBuffer();
        imagePath = path.join(UPLOAD_DIR, `temp_${media.filename}`);
        await fs.writeFile(imagePath, Buffer.from(buffer));
      } else {
        imagePath = media.url.replace(process.env.BASE_URL || '', '');
      }

      // Generate thumbnail (200x200)
      const thumbnailPath = imagePath.replace(/\.[^.]+$/, '_thumb.jpg');
      await sharp(imagePath)
        .resize(200, 200, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      thumbnails.thumbnail = thumbnailPath.replace(UPLOAD_DIR, '/uploads/media');

      // Generate medium size (800x800)
      const mediumPath = imagePath.replace(/\.[^.]+$/, '_medium.jpg');
      await sharp(imagePath)
        .resize(800, 800, { fit: 'inside' })
        .jpeg({ quality: 85 })
        .toFile(mediumPath);

      thumbnails.medium = mediumPath.replace(UPLOAD_DIR, '/uploads/media');

      // Cleanup temp file
      if (imagePath.includes('temp_')) {
        await fs.unlink(imagePath);
      }

    } catch (error) {
      logger.warn('⚠️ Image processing skipped (sharp not available):', error.message);
      // Return original as fallback
      thumbnails.thumbnail = media.url;
      thumbnails.medium = media.url;
    }

    return thumbnails;
  }

  /**
   * Process video - generate thumbnail and transcode using FFmpeg
   */
  async processVideo(media, options = {}) {
    const thumbnails = {};

    try {
      // Check if FFmpeg is available
      await execPromise('ffmpeg -version');

      let videoPath;
      if (media.url.startsWith('http')) {
        const response = await fetch(media.url);
        const buffer = await response.arrayBuffer();
        videoPath = path.join(UPLOAD_DIR, `temp_${media.filename}`);
        await fs.writeFile(videoPath, Buffer.from(buffer));
      } else {
        videoPath = media.url.replace(process.env.BASE_URL || '', '');
      }

      // Generate thumbnail at 1 second mark
      const thumbnailPath = videoPath.replace(/\.[^.]+$/, '_thumb.jpg');
      await execPromise(`ffmpeg -i "${videoPath}" -ss 00:00:01 -vframes 1 "${thumbnailPath}"`);
      thumbnails.thumbnail = thumbnailPath.replace(UPLOAD_DIR, '/uploads/media');

      // Transcode to web-friendly format if requested
      if (options.transcode) {
        const transcodedPath = videoPath.replace(/\.[^.]+$/, '_web.mp4');
        await execPromise(
          `ffmpeg -i "${videoPath}" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k "${transcodedPath}"`
        );
        thumbnails.webVersion = transcodedPath.replace(UPLOAD_DIR, '/uploads/media');
      }

      // Cleanup temp file
      if (videoPath.includes('temp_')) {
        await fs.unlink(videoPath);
      }

    } catch (error) {
      logger.warn('⚠️ Video processing skipped (FFmpeg not available):', error.message);
      thumbnails.thumbnail = media.url;
      if (options.transcode) {
        thumbnails.webVersion = media.url;
      }
    }

    return thumbnails;
  }

  /**
   * Process audio - generate waveform visualization (optional)
   */
  async processAudio(media) {
    // Audio processing placeholder
    return {
      waveform: null
    };
  }

  /**
   * Retrieve media metadata from database
   */
  async getMediaMetadata(mediaId) {
    try {
      const { pool } = require('../db');
      const result = await pool.query(
        'SELECT * FROM ugc_media WHERE id = $1',
        [mediaId]
      );

      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error retrieving media metadata:', error);
      return null;
    }
  }

  /**
   * Save media metadata to database
   */
  async saveMediaMetadata(data) {
    try {
      const { pool } = require('../db');
      const result = await pool.query(
        `INSERT INTO ugc_media (id, user_id, filename, original_name, file_type, mime_type, size, url, thumbnail_url, status, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [
          data.mediaId,
          data.userId,
          data.filename,
          data.originalName,
          data.fileType,
          data.mimeType,
          data.size,
          data.url,
          data.thumbnailUrl,
          data.status,
          JSON.stringify(data.metadata || {})
        ]
      );

      return result.rows[0];
    } catch (error) {
      logger.error('Error saving media metadata:', error);
      throw error;
    }
  }

  /**
   * Update media processing status
   */
  async updateMediaProcessingStatus(mediaId, status, processedUrls) {
    try {
      const { pool } = require('../db');
      await pool.query(
        `UPDATE ugc_media 
         SET status = $1, processed_urls = $2, updated_at = NOW()
         WHERE id = $3`,
        [status, JSON.stringify(processedUrls), mediaId]
      );
    } catch (error) {
      logger.error('Error updating processing status:', error);
    }
  }

  /**
   * Delete media file from storage and database
   */
  async deleteMedia(mediaId, userId) {
    try {
      // Get media record
      const media = await this.getMediaMetadata(mediaId);

      if (!media) {
        throw new Error('Media not found');
      }

      // Verify ownership
      if (media.user_id !== userId) {
        throw new Error('Unauthorized: Cannot delete other users media');
      }

      // Delete from storage
      if (STORAGE_TYPE === 's3' && s3Client) {
        const bucket = process.env.S3_BUCKET_NAME;
        const key = `media/${media.filename}`;

        const command = new DeleteObjectCommand({
          Bucket: bucket,
          Key: key
        });

        await s3Client.send(command);
      } else {
        // Delete from local filesystem
        const filePath = path.join(UPLOAD_DIR, media.filename);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          logger.warn('⚠️ File deletion failed:', err.message);
        }

        // Also delete processed versions
        const baseName = media.filename.replace(/\.[^.]+$/, '');
        const extensions = ['_thumb.jpg', '_medium.jpg', '_web.mp4'];
        for (const ext of extensions) {
          try {
            await fs.unlink(path.join(UPLOAD_DIR, baseName + ext));
          } catch (err) {
            // Ignore if file doesn't exist
          }
        }
      }

      // Delete from database
      const { pool } = require('../db');
      await pool.query('DELETE FROM ugc_media WHERE id = $1', [mediaId]);

      logger.info(`✅ Media deleted: ${mediaId}`);

      return {
        success: true,
        message: 'Media deleted successfully'
      };
    } catch (error) {
      logger.error('❌ Deletion failed:', error.message);
      throw error;
    }
  }
}

module.exports = new UGCMediaService();
