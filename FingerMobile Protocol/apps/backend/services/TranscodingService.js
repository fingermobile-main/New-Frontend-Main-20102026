/* eslint-disable no-async-promise-executor */
/**
 * TranscodingService
 * FFmpeg integration for video processing and format conversion
 * with input sanitization to prevent command injection
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const pool = require('../database/connection');
const StorageService = require('./StorageService');
const logger = require('../utils/logger'); // Added logger import

class TranscodingService {
  constructor() {
    this.ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
    this.tempDir = path.join(__dirname, '../temp');

    // Ensure temp directory exists
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  /**
   * Sanitize file paths to prevent command injection
   */
  sanitizeFilePath(filePath) {
    // Only allow alphanumeric characters, dots, hyphens, underscores, and forward slashes
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('Invalid file path provided');
    }

    // Check for dangerous patterns
    if (filePath.includes('..') || filePath.includes(';') ||
        filePath.includes('&') || filePath.includes('|') ||
        filePath.includes('`') || filePath.includes('$(')) {
      throw new Error('Invalid file path contains dangerous characters');
    }

    // Resolve to absolute path to ensure it's within allowed directories
    const resolvedPath = path.resolve(filePath);
    const allowedBasePath = path.resolve(this.tempDir);

    if (!resolvedPath.startsWith(allowedBasePath)) {
      throw new Error('File path is outside allowed directories');
    }

    return resolvedPath;
  }

  /**
   * Transcode video to multiple formats/bitrate
   */
  async transcodeVideo(jobId, sourceKey, options = {}) {
    try {
      // Update job status to processing
      await this.updateJobStatus(jobId, 'processing');

      const tempInputPath = path.join(this.tempDir, `input_${jobId}${path.extname(sourceKey)}`);
      const outputFiles = [];

      // Download source file from S3/Cloudinary
      await this.downloadFile(sourceKey, tempInputPath);

      // Define output profiles
      const profiles = options.profiles || [
        { name: '1080p', width: 1920, height: 1080, bitrate: '5000k' },
        { name: '720p', width: 1280, height: 720, bitrate: '2800k' },
        { name: '480p', width: 854, height: 480, bitrate: '1400k' },
        { name: '360p', width: 640, height: 360, bitrate: '800k' }
      ];

      // Transcode to each profile
      for (const profile of profiles) {
        const outputPath = await this.transcodeToProfile(
          tempInputPath,
          profile,
          jobId
        );

        // Upload transcoded file to storage
        const uploadResult = await StorageService.uploadToS3(
          fs.readFileSync(outputPath),
          `transcoded/${jobId}/${profile.name}.mp4`,
          { acl: 'public-read' }
        );

        outputFiles.push({
          profile: profile.name,
          url: uploadResult.url,
          width: profile.width,
          height: profile.height,
          bitrate: profile.bitrate
        });

        // Clean up temp file
        fs.unlinkSync(outputPath);

        // Update progress
        const progress = Math.round((profiles.indexOf(profile) + 1) / profiles.length * 100);
        await this.updateJobProgress(jobId, progress);
      }

      // Generate HLS playlist
      const hlsUrl = await this.generateHLSPlaylist(jobId, outputFiles);

      // Generate thumbnail
      const thumbnailUrl = await this.generateThumbnail(tempInputPath, jobId);

      // Update job as completed
      await this.completeJob(jobId, outputFiles, hlsUrl, thumbnailUrl);

      // Clean up input file
      fs.unlinkSync(tempInputPath);

      return {
        success: true,
        jobId,
        outputFiles,
        hlsUrl,
        thumbnailUrl
      };
    } catch (error) {
      logger.error('Error in TranscodingService.transcodeVideo:', error);
      await this.failJob(jobId, error.message);
      throw error;
    }
  }

  /**
   * Transcode video to specific profile
   */
  transcodeToProfile(inputPath, profile, jobId) {
    return new Promise((resolve, reject) => {
      try {
        // Sanitize input and output paths
        const safeInputPath = this.sanitizeFilePath(inputPath);
        const outputPath = path.join(this.tempDir, `output_${jobId}_${profile.name}.mp4`);
        const safeOutputPath = this.sanitizeFilePath(outputPath);

        // Validate profile parameters
        const safeWidth = Math.max(160, Math.min(3840, parseInt(profile.width) || 1920));
        const safeHeight = Math.max(144, Math.min(2160, parseInt(profile.height) || 1080));
        const safeBitrate = /^[0-9]+[km]$/.test(profile.bitrate) ? profile.bitrate : '2800k';

        const ffmpegArgs = [
          '-i', safeInputPath,
          '-vf', `scale=${safeWidth}:${safeHeight}:force_original_aspect_ratio=decrease`,
          '-c:v', 'libx264',
          '-preset', 'fast',
          '-b:v', safeBitrate,
          '-maxrate', safeBitrate,
          '-bufsize', `${parseInt(safeBitrate) * 2}k`,
          '-c:a', 'aac',
          '-b:a', '128k',
          '-movflags', '+faststart',
          '-y',
          safeOutputPath
        ];

        const ffmpeg = spawn(this.ffmpegPath, ffmpegArgs);

        ffmpeg.on('close', (code) => {
          if (code === 0) {
            resolve(safeOutputPath);
          } else {
            reject(new Error(`FFmpeg exited with code ${code}`));
          }
        });

        ffmpeg.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate HLS playlist for adaptive streaming
   */
  async generateHLSPlaylist(jobId, outputFiles) {
    try {
      const hlsDir = path.join(this.tempDir, `hls_${jobId}`);
      fs.mkdirSync(hlsDir, { recursive: true });

      // Create master playlist
      let masterPlaylist = '#EXTM3U\n#EXT-X-VERSION:3\n\n';

      for (const file of outputFiles) {
        const variantPlaylist = `playlist_${file.profile}.m3u8`;
        masterPlaylist += `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(file.bitrate) * 1000},RESOLUTION=${file.width}x${file.height}\n${variantPlaylist}\n`;
      }

      const masterPath = path.join(hlsDir, 'master.m3u8');
      fs.writeFileSync(masterPath, masterPlaylist);

      // Upload master playlist
      const uploadResult = await StorageService.uploadToS3(
        fs.readFileSync(masterPath),
        `hls/${jobId}/master.m3u8`,
        {
          acl: 'public-read',
          contentType: 'application/vnd.apple.mpegurl'
        }
      );

      // Clean up
      fs.rmSync(hlsDir, { recursive: true, force: true });

      return uploadResult.url;
    } catch (error) {
      logger.error('Error generating HLS playlist:', error);
      throw error;
    }
  }

  /**
   * Generate thumbnail from video
   */
  async generateThumbnail(videoPath, jobId) {
    try {
      // Sanitize video path
      const safeVideoPath = this.sanitizeFilePath(videoPath);
      const thumbnailPath = path.join(this.tempDir, `thumbnail_${jobId}.jpg`);
      const safeThumbnailPath = this.sanitizeFilePath(thumbnailPath);

      return new Promise(async (resolve, reject) => {
        const ffmpegArgs = [
          '-i', safeVideoPath,
          '-ss', '00:00:01', // Take frame at 1 second
          '-vframes', '1',
          '-vf', 'scale=640:-1',
          '-q:v', '5',
          safeThumbnailPath
        ];

        const ffmpeg = spawn(this.ffmpegPath, ffmpegArgs);

        ffmpeg.on('close', async (code) => {
          if (code === 0) {
            try {
              const uploadResult = await StorageService.uploadToS3(
                fs.readFileSync(safeThumbnailPath),
                `thumbnails/${jobId}.jpg`,
                { acl: 'public-read' }
              );

              fs.unlinkSync(safeThumbnailPath);
              resolve(uploadResult.url);
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error(`FFmpeg thumbnail generation failed with code ${code}`));
          }
        });

        ffmpeg.on('error', reject);
      });
    } catch (error) {
      logger.error('Error generating thumbnail:', error);
      throw error;
    }
  }

  /**
   * Download file from storage to temp
   */
  async downloadFile(sourceKey, destPath) {
    // Implementation depends on storage provider
    // For S3, use aws-sdk download
    // For now, assume file is already available or implement download logic

    // Placeholder - would implement actual download from S3/Cloudinary
    logger.info(`Downloading ${sourceKey} to ${destPath}`);
  }

  /**
   * Update job status
   */
  async updateJobStatus(jobId, status) {
    const query = 'UPDATE transcoding_jobs SET status = $1 WHERE id = $2';
    await pool.query(query, [status, jobId]);
  }

  /**
   * Update job progress
   */
  async updateJobProgress(jobId, progress) {
    const query = `
      UPDATE transcoding_jobs 
      SET progress_percentage = $1, updated_at = NOW()
      WHERE id = $2
    `;
    await pool.query(query, [progress, jobId]);
  }

  /**
   * Complete job
   */
  async completeJob(jobId, outputFiles, hlsUrl, thumbnailUrl) {
    const query = `
      UPDATE transcoding_jobs 
      SET status = 'completed',
          output_urls = $2,
          progress_percentage = 100,
          completed_at = NOW(),
          updated_at = NOW()
      WHERE id = $1
    `;

    await pool.query(query, [jobId, JSON.stringify({
      files: outputFiles,
      hls: hlsUrl,
      thumbnail: thumbnailUrl
    })]);
  }

  /**
   * Fail job
   */
  async failJob(jobId, errorMessage) {
    const query = `
      UPDATE transcoding_jobs 
      SET status = 'failed',
          error_message = $1,
          updated_at = NOW()
      WHERE id = $2
    `;

    await pool.query(query, [errorMessage, jobId]);
  }

  /**
   * Get transcoding job status
   */
  async getJobStatus(jobId) {
    const query = 'SELECT * FROM transcoding_jobs WHERE id = $1';
    const result = await pool.query(query, [jobId]);

    return result.rows[0] || null;
  }

  /**
   * Process pending transcoding jobs (worker function)
   */
  async processPendingJobs() {
    try {
      const query = `
        SELECT * FROM transcoding_jobs
        WHERE status = 'pending'
        ORDER BY priority DESC, created_at ASC
        LIMIT 5
      `;

      const result = await pool.query(query);

      for (const job of result.rows) {
        // Process each job
        this.transcodeVideo(job.id, job.source_key)
          .catch(error => {
            logger.error(`Failed to process job ${job.id}:`, error);
          });
      }

      return result.rows.length;
    } catch (error) {
      logger.error('Error processing pending jobs:', error);
      throw error;
    }
  }
}

module.exports = new TranscodingService();
