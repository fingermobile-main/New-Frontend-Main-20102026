const logger = require('../utils/logger');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

class FFmpegService {
  /**
   * Generate a thumbnail from a video file
   * @param {string} inputPath - Path to the input video file
   * @param {string} [outputPath] - Path for the output thumbnail (optional)
   * @param {Object} [options] - Options for thumbnail generation
   * @returns {Promise<Object>} Result with output path and metadata
   */
  static async generateThumbnail(inputPath, outputPath = null, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        // Generate output path if not provided
        if (!outputPath) {
          const inputDir = path.dirname(inputPath);
          const inputName = path.basename(inputPath, path.extname(inputPath));
          outputPath = path.join(inputDir, `${inputName}_thumb.jpg`);
        }

        // Default options
        const {
          width = 320,
          height = 180,
          format = 'jpg',
          timestamp = '00:00:01' // Take thumbnail from 1 second into video
        } = options;

        ffmpeg(inputPath)
          .on('error', (err) => {
            logger.error('Error generating thumbnail:', err);
            reject(err);
          })
          .on('end', () => {
            resolve({
              outputPath,
              width,
              height,
              format,
              fileSize: fs.statSync(outputPath).size
            });
          })
          .screenshots({
            timestamps: [timestamp],
            filename: path.basename(outputPath),
            folder: path.dirname(outputPath),
            size: `${width}x${height}`,
            format
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Resize an image using FFmpeg
   * @param {string} inputPath - Path to the input image file
   * @param {string} outputPath - Path for the output image
   * @param {Object} [options] - Options for resizing
   * @returns {Promise<Object>} Result with output path and metadata
   */
  static async resizeImage(inputPath, outputPath, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        // Default options
        const {
          width = 320,
          height = 180,
          format = 'jpg'
        } = options;

        ffmpeg(inputPath)
          .on('error', (err) => {
            logger.error('Error resizing image:', err);
            reject(err);
          })
          .on('end', () => {
            resolve({
              outputPath,
              width,
              height,
              format,
              fileSize: fs.statSync(outputPath).size
            });
          })
          .size(`${width}x${height}`)
          .format(format)
          .save(outputPath);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Transcode a video file to a different format/quality
   * @param {string} inputPath - Path to the input video file
   * @param {string} outputPath - Path for the output transcoded file
   * @param {Object} [options] - Options for transcoding
   * @returns {Promise<Object>} Result with output path and metadata
   */
  static async transcode(inputPath, outputPath, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        // Default options
        const {
          format = 'mp4',
          resolution = '720p',
          quality = 'medium',
          videoBitrate = '2M',
          audioBitrate = '128k'
        } = options;

        // Map quality to FFmpeg preset
        let preset = 'medium';
        switch (quality) {
        case 'fast':
        case 'veryfast':
          preset = 'veryfast';
          break;
        case 'slow':
          preset = 'slow';
          break;
        case 'ultrafast':
          preset = 'ultrafast';
          break;
        case 'medium':
        default:
          preset = 'medium';
          break;
        }

        // Map resolution to dimensions
        let dimensions = '1280x720'; // 720p default
        switch (resolution) {
        case '480p':
          dimensions = '854x480';
          break;
        case '720p':
          dimensions = '1280x720';
          break;
        case '1080p':
          dimensions = '1920x1080';
          break;
        case '4k':
          dimensions = '3840x2160';
          break;
        }

        ffmpeg(inputPath)
          .on('error', (err) => {
            logger.error('Error transcoding video:', err);
            reject(err);
          })
          .on('end', () => {
            const stats = fs.statSync(outputPath);
            resolve({
              outputPath,
              format,
              resolution,
              quality,
              fileSize: stats.size,
              duration: stats.mtime - stats.birthtime // Approximation
            });
          })
          .videoCodec('libx264')
          .audioCodec('aac')
          .size(dimensions)
          .preset(preset)
          .videoBitrate(videoBitrate)
          .audioBitrate(audioBitrate)
          .format(format)
          .save(outputPath);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Extract audio from a video file
   * @param {string} inputPath - Path to the input video file
   * @param {string} outputPath - Path for the output audio file
   * @param {Object} [options] - Options for extraction
   * @returns {Promise<Object>} Result with output path and metadata
   */
  static async extractAudio(inputPath, outputPath, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const {
          format = 'mp3',
          audioBitrate = '128k'
        } = options;

        ffmpeg(inputPath)
          .on('error', (err) => {
            logger.error('Error extracting audio:', err);
            reject(err);
          })
          .on('end', () => {
            resolve({
              outputPath,
              format,
              audioBitrate,
              fileSize: fs.statSync(outputPath).size
            });
          })
          .noVideo()
          .audioCodec('aac')
          .audioBitrate(audioBitrate)
          .format(format)
          .save(outputPath);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Create a video clip from a segment of the original video
   * @param {string} inputPath - Path to the input video file
   * @param {string} outputPath - Path for the output video clip
   * @param {number} startTime - Start time in seconds
   * @param {number} duration - Duration in seconds
   * @returns {Promise<Object>} Result with output path and metadata
   */
  static async createClip(inputPath, outputPath, startTime, duration) {
    return new Promise((resolve, reject) => {
      try {
        ffmpeg(inputPath)
          .on('error', (err) => {
            logger.error('Error creating video clip:', err);
            reject(err);
          })
          .on('end', () => {
            resolve({
              outputPath,
              startTime,
              duration,
              fileSize: fs.statSync(outputPath).size
            });
          })
          .setStartTime(startTime)
          .duration(duration)
          .save(outputPath);
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = FFmpegService;
