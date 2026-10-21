/* eslint-disable no-unused-vars */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger'); // Added logger import

class MediaProcessingService {
  constructor() {
    this.uploadDir = path.join(__dirname, '../uploads');
    this.thumbnailDir = path.join(this.uploadDir, 'thumbnails');
    this.processedDir = path.join(this.uploadDir, 'processed');

    // Ensure directories exist
    this.ensureDirectories();
  }

  ensureDirectories() {
    [this.uploadDir, this.thumbnailDir, this.processedDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
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
    const allowedBasePath = path.resolve(__dirname, '..');

    if (!resolvedPath.startsWith(allowedBasePath)) {
      throw new Error('File path is outside allowed directories');
    }

    return resolvedPath;
  }

  /**
   * Generate thumbnail from video file
   * @param {string} inputFile - Path to input video file
   * @param {string} outputFile - Path for output thumbnail
   * @returns {Promise<string>} - Path to generated thumbnail
   */
  generateThumbnail(inputFile, outputFile = null) {
    return new Promise((resolve, reject) => {
      try {
        // Sanitize input file path
        const safeInputFile = this.sanitizeFilePath(inputFile);
        const output = outputFile ||
          path.join(this.thumbnailDir, `${path.basename(inputFile, path.extname(inputFile))}_${Date.now()}.jpg`);
        const safeOutput = this.sanitizeFilePath(output);

        const ffmpegArgs = [
          '-i', safeInputFile,        // Input file
          '-ss', '00:00:01.000',  // Seek to 1 second into the video
          '-vframes', '1',        // Extract only 1 frame
          '-f', 'image2',         // Output format
          safeOutput               // Output path
        ];

        const ffmpeg = spawn('ffmpeg', ffmpegArgs);

        let stderrOutput = '';

        ffmpeg.stderr.on('data', (data) => {
          stderrOutput += data.toString();
        });

        ffmpeg.on('error', (err) => {
          logger.error('FFmpeg error:', err);
          reject(new Error(`FFmpeg process failed: ${err.message}`));
        });

        ffmpeg.on('close', (code) => {
          if (code === 0) {
            resolve(safeOutput);
          } else {
            reject(new Error(`FFmpeg process exited with code ${code}. Error: ${stderrOutput}`));
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Transcode video to specified format/resolution
   * @param {string} inputFile - Path to input video file
   * @param {Object} options - Transcoding options
   * @returns {Promise<string>} - Path to transcoded file
   */
  transcodeVideo(inputFile, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        // Sanitize input file path
        const safeInputFile = this.sanitizeFilePath(inputFile);
        const output = path.join(
          this.processedDir,
          `${path.basename(inputFile, path.extname(inputFile))}_transcoded_${Date.now()}.${options.format || 'mp4'}`
        );
        const safeOutput = this.sanitizeFilePath(output);

        const ffmpegArgs = ['-i', safeInputFile];

        // Apply resolution option
        if (options.resolution && options.resolution !== 'original') {
          // Validate resolution parameter
          const validResolutions = ['1080p', '720p', '480p'];
          if (validResolutions.includes(options.resolution)) {
            switch(options.resolution) {
            case '1080p':
              ffmpegArgs.push('-s', '1920x1080');
              break;
            case '720p':
              ffmpegArgs.push('-s', '1280x720');
              break;
            case '480p':
              ffmpegArgs.push('-s', '854x480');
              break;
            }
          }
        }

        // Apply quality option via bitrate
        if (options.quality) {
          const bitrates = {
            'high': '8M',
            'medium': '5M',
            'low': '2M'
          };
          const videoBitrate = options.videoBitrate || bitrates[options.quality];
          if (videoBitrate && /^[0-9]+[kKmM]$/.test(videoBitrate)) {
            ffmpegArgs.push('-b:v', videoBitrate);
          }

          const audioBitrate = options.audioBitrate ||
            (options.quality === 'high' ? '320k' : options.quality === 'medium' ? '192k' : '128k');
          if (audioBitrate && /^[0-9]+[kK]$/.test(audioBitrate)) {
            ffmpegArgs.push('-b:a', audioBitrate);
          }
        }

        // Specify output format
        if (options.format) {
          const validFormats = ['mp4', 'webm', 'mov', 'avi', 'mkv'];
          if (validFormats.includes(options.format)) {
            switch(options.format) {
            case 'mp4':
              ffmpegArgs.push('-c:v', 'libx264', '-c:a', 'aac');
              break;
            case 'webm':
              ffmpegArgs.push('-c:v', 'libvpx-vp9', '-c:a', 'libopus');
              break;
            case 'mov':
              ffmpegArgs.push('-c:v', 'libx264', '-c:a', 'aac');
              break;
            case 'avi':
              ffmpegArgs.push('-c:v', 'mpeg4', '-c:a', 'mp3');
              break;
            case 'mkv':
              ffmpegArgs.push('-c:v', 'libx264', '-c:a', 'aac');
              break;
            }
          }
        }

        ffmpegArgs.push(safeOutput);

        const ffmpeg = spawn('ffmpeg', ffmpegArgs);

        let stderrOutput = '';

        ffmpeg.stderr.on('data', (data) => {
          stderrOutput += data.toString();
        });

        ffmpeg.on('error', (err) => {
          logger.error('FFmpeg transcode error:', err);
          reject(new Error(`FFmpeg transcode process failed: ${err.message}`));
        });

        ffmpeg.on('close', (code) => {
          if (code === 0) {
            resolve(safeOutput);
          } else {
            reject(new Error(`FFmpeg transcode process exited with code ${code}. Error: ${stderrOutput}`));
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Process media file - generate thumbnail and optionally transcode
   * @param {string} filePath - Path to the uploaded media file
   * @param {Object} options - Processing options
   * @returns {Promise<Object>} - Object containing paths to processed files
   */
  async processMediaFile(filePath, options = {}) {
    try {
      const results = {
        originalPath: filePath,
        thumbnailPath: null,
        processedPath: null,
        metadata: {}
      };

      // Sanitize file path
      const safeFilePath = this.sanitizeFilePath(filePath);

      // Get file stats for metadata
      const stats = fs.statSync(safeFilePath);
      results.metadata = {
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        fileType: path.extname(safeFilePath).toLowerCase()
      };

      // Generate thumbnail if it's a video
      if (this.isVideoFile(safeFilePath)) {
        results.thumbnailPath = await this.generateThumbnail(safeFilePath);
      } else if (this.isImageFile(safeFilePath)) {
        // For images, we can just copy as thumbnail
        results.thumbnailPath = safeFilePath;
      }

      // Transcode if options are provided and it's a video
      if (options.transcode && this.isVideoFile(safeFilePath)) {
        results.processedPath = await this.transcodeVideo(safeFilePath, options);
      }

      return results;
    } catch (error) {
      logger.error('Error processing media file:', error);
      throw error;
    }
  }

  /**
   * Check if file is a video
   * @param {string} filePath - Path to file
   * @returns {boolean} - True if file is a video
   */
  isVideoFile(filePath) {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v'];
    return videoExtensions.includes(path.extname(filePath).toLowerCase());
  }

  /**
   * Check if file is an image
   * @param {string} filePath - Path to file
   * @returns {boolean} - True if file is an image
   */
  isImageFile(filePath) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.includes(path.extname(filePath).toLowerCase());
  }

  /**
   * Get media file metadata
   * @param {string} filePath - Path to file
   * @returns {Object} - Metadata object
   */
  getFileMetadata(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return {
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        isVideo: this.isVideoFile(filePath),
        isImage: this.isImageFile(filePath),
        extension: path.extname(filePath).toLowerCase(),
        name: path.basename(filePath)
      };
    } catch (error) {
      logger.error('Error getting file metadata:', error);
      throw error;
    }
  }

  /**
   * Clean up temporary files
   * @param {string} filePath - Path to file to delete
   */
  cleanupFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      logger.error('Error cleaning up file:', error);
    }
  }
}

module.exports = new MediaProcessingService();
