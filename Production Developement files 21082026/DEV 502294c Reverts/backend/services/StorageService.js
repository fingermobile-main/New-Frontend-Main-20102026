/**
 * StorageService
 * AWS S3 and Cloudinary integration for file storage and media management
 */

const AWS = require('aws-sdk');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const pool = require('../database/connection');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class StorageService {
  constructor() {
    this.s3Bucket = process.env.S3_BUCKET_NAME;
    this.storageProvider = process.env.STORAGE_PROVIDER || 's3'; // 's3' or 'cloudinary'
  }
  
  /**
   * Upload file to S3
   */
  async uploadToS3(file, key, options = {}) {
    try {
      const params = {
        Bucket: this.s3Bucket,
        Key: key,
        Body: file.buffer || file,
        ContentType: file.mimetype || this.getContentType(key),
        ACL: options.acl || 'private',
        Metadata: options.metadata || {}
      };
      
      if (options.cacheControl) {
        params.CacheControl = options.cacheControl;
      }
      
      const result = await s3.upload(params).promise();
      
      return {
        success: true,
        url: result.Location,
        key: result.Key,
        bucket: result.Bucket,
        etag: result.ETag
      };
    } catch (error) {
      logger.error('Error in StorageService.uploadToS3:', error);
      throw error;
    }
  }
  
  /**
   * Upload file to Cloudinary
   */
  async uploadToCloudinary(file, options = {}) {
    try {
      const uploadOptions = {
        folder: options.folder || 'fingermobile',
        public_id: options.publicId,
        resource_type: options.resourceType || 'auto',
        transformation: options.transformations || []
      };
      
      let result;
      
      if (file.path) {
        // File from disk
        result = await cloudinary.uploader.upload(file.path, uploadOptions);
      } else {
        // File from buffer/memory
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        result = await cloudinary.uploader.upload(base64, uploadOptions);
      }
      
      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes
      };
    } catch (error) {
      logger.error('Error in StorageService.uploadToCloudinary:', error);
      throw error;
    }
  }
  
  /**
   * Upload file (auto-detect provider)
   */
  async uploadFile(file, key, options = {}) {
    if (this.storageProvider === 'cloudinary') {
      return this.uploadToCloudinary(file, options);
    } else {
      return this.uploadToS3(file, key, options);
    }
  }
  
  /**
   * Upload image with optimization
   */
  async uploadImage(file, userId, options = {}) {
    try {
      const timestamp = Date.now();
      const extension = path.extname(file.originalname || 'image.jpg');
      const key = `users/${userId}/images/${timestamp}${extension}`;
      
      // Optimize image before upload
      let optimizedBuffer = file.buffer;
      
      if (options.resize) {
        const resizeOptions = {
          width: options.resize.width || 1920,
          height: options.resize.height,
          fit: options.resize.fit || 'inside',
          withoutEnlargement: true
        };
        
        optimizedBuffer = await sharp(file.buffer)
          .resize(resizeOptions)
          .jpeg({ quality: options.quality || 80 })
          .toBuffer();
      }
      
      const optimizedFile = {
        buffer: optimizedBuffer,
        mimetype: 'image/jpeg',
        originalname: file.originalname
      };
      
      const result = await this.uploadFile(optimizedFile, key, options);
      
      // Store in database
      await this.storeMediaRecord(userId, 'image', result.url, key, {
        originalName: file.originalname,
        size: file.size,
        optimized: true,
        ...options.metadata
      });
      
      return result;
    } catch (error) {
      logger.error('Error in StorageService.uploadImage:', error);
      throw error;
    }
  }
  
  /**
   * Upload video with transcoding
   */
  async uploadVideo(file, userId, options = {}) {
    try {
      const timestamp = Date.now();
      const extension = path.extname(file.originalname || 'video.mp4');
      const key = `users/${userId}/videos/${timestamp}${extension}`;
      
      // For videos, upload to S3 first, then trigger transcoding job
      const result = await this.uploadToS3(file, key, {
        acl: 'public-read',
        cacheControl: 'public, max-age=31536000' // 1 year
      });
      
      // Create transcoding job
      const jobId = await this.createTranscodingJob(userId, key, options);
      
      // Store in database
      await this.storeMediaRecord(userId, 'video', result.url, key, {
        originalName: file.originalname,
        size: file.size,
        transcodingJobId: jobId,
        status: 'processing',
        ...options.metadata
      });
      
      return {
        ...result,
        transcodingJobId: jobId
      };
    } catch (error) {
      logger.error('Error in StorageService.uploadVideo:', error);
      throw error;
    }
  }
  
  /**
   * Generate signed URL for private files
   */
  async generateSignedUrl(key, expiresIn = 3600) {
    try {
      const params = {
        Bucket: this.s3Bucket,
        Key: key,
        Expires: expiresIn
      };
      
      const url = await s3.getSignedUrlPromise('getObject', params);
      
      return url;
    } catch (error) {
      logger.error('Error generating signed URL:', error);
      throw error;
    }
  }
  
  /**
   * Delete file from storage
   */
  async deleteFile(key) {
    try {
      if (this.storageProvider === 'cloudinary') {
        // Extract public_id from Cloudinary URL
        const publicId = this.extractPublicIdFromUrl(key);
        await cloudinary.uploader.destroy(publicId);
      } else {
        await s3.deleteObject({
          Bucket: this.s3Bucket,
          Key: key
        }).promise();
      }
      
      return { success: true };
    } catch (error) {
      logger.error('Error deleting file:', error);
      throw error;
    }
  }
  
  /**
   * Create transcoding job
   */
  async createTranscodingJob(userId, sourceKey, options = {}) {
    try {
      const query = `
        INSERT INTO transcoding_jobs (
          user_id, source_key, status, priority, created_at
        ) VALUES ($1, $2, 'pending', $3, NOW())
        RETURNING id
      `;
      
      const result = await pool.query(query, [
        userId,
        sourceKey,
        options.priority || 0
      ]);
      
      return result.rows[0].id;
    } catch (error) {
      logger.error('Error creating transcoding job:', error);
      throw error;
    }
  }
  
  /**
   * Store media record in database
   */
  async storeMediaRecord(userId, type, url, key, metadata = {}) {
    try {
      const query = `
        INSERT INTO media_files (
          user_id, type, url, storage_key, 
          metadata, created_at
        ) VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *
      `;
      
      const result = await pool.query(query, [
        userId,
        type,
        url,
        key,
        JSON.stringify(metadata)
      ]);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error storing media record:', error);
      throw error;
    }
  }
  
  /**
   * Get content type from file extension
   */
  getContentType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const types = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    
    return types[ext] || 'application/octet-stream';
  }
  
  /**
   * Extract public ID from Cloudinary URL
   */
  extractPublicIdFromUrl(url) {
    const match = url.match(/\/([^\/]+)\.[^\.]+$/);
    return match ? match[1] : url;
  }
  
  /**
   * Get user media files
   */
  async getUserMedia(userId, type = null, limit = 50, offset = 0) {
    try {
      let query = 'SELECT * FROM media_files WHERE user_id = $1';
      const params = [userId];
      
      if (type) {
        query += ' AND type = $2';
        params.push(type);
      }
      
      query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);
      
      const result = await pool.query(query, params);
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting user media:', error);
      throw error;
    }
  }
}

module.exports = new StorageService();
