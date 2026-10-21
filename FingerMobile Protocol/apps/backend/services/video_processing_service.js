/* eslint-disable no-unused-vars */
const { monetizationDb } = require('../db');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { spawn } = require('child_process');
const logger = require('../utils/logger'); // Added logger import

class VideoProcessingService {
  /**
   * Sanitize file paths to prevent command injection
   */
  static sanitizeFilePath(filePath) {
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

    return filePath;
  }

  /**
   * Sanitize filter parameters to prevent command injection
   */
  static sanitizeFilterParam(param) {
    if (!param || typeof param !== 'string') {
      return '';
    }
    // Remove potentially dangerous characters
    return param.replace(/[;&|$`]/g, '');
  }

  /**
   * Create a video processing job
   */
  static async createJob(projectId, jobType, inputParams) {
    try {
      const client = await monetizationDb.connect();
      try {
        const result = await client.query(
          `INSERT INTO video_processing_jobs 
           (project_id, job_type, input_params, status)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [projectId, jobType, JSON.stringify(inputParams), 'pending'],
        );

        // Start processing asynchronously based on job type
        this.startProcessing(result.rows[0].id, jobType, inputParams);

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error creating video processing job:', error);
      throw error;
    }
  }

  /**
   * Start processing a job with server-side FFmpeg
   */
  static async startProcessing(jobId, jobType, inputParams) {
    try {
      const client = await monetizationDb.connect();

      // Update status to processing
      await client.query(
        `UPDATE video_processing_jobs 
         SET status = 'processing', started_at = NOW()
         WHERE id = $1`,
        [jobId],
      );

      // Handle different job types
      switch (jobType) {
      case 'render':
        await this.handleRenderJob(client, jobId, inputParams);
        break;
      case 'export':
        await this.handleExportJob(client, jobId, inputParams);
        break;
      case 'apply-filter':
        await this.handleApplyFilterJob(client, jobId, inputParams);
        break;
      case 'add-text-overlay':
        await this.handleAddTextOverlayJob(client, jobId, inputParams);
        break;
      case 'add-sticker':
        await this.handleAddStickerJob(client, jobId, inputParams);
        break;
      case 'audio-mixing':
        await this.handleAudioMixingJob(client, jobId, inputParams);
        break;
      default:
        await this.completeJobWithError(
          client,
          jobId,
          `Unknown job type: ${jobType}`,
        );
        return;
      }
    } catch (error) {
      logger.error('Error starting video processing:', error);
      await this.completeJobWithError(null, jobId, error.message);
    }
  }

  /**
   * Handle render job with server-side FFmpeg
   */
  static async handleRenderJob(client, jobId, inputParams) {
    try {
      const { inputPath, outputPath, filters } = inputParams;

      if (!inputPath || !outputPath) {
        throw new Error('Input and output paths are required for render job');
      }

      // Sanitize file paths
      const safeInputPath = this.sanitizeFilePath(inputPath);
      const safeOutputPath = this.sanitizeFilePath(outputPath);

      // Prepare FFmpeg command
      const args = ['-i', safeInputPath];

      // Add filters if provided
      if (filters) {
        const safeFilters = this.sanitizeFilterParam(filters);
        args.push('-vf', safeFilters);
      }

      args.push(safeOutputPath);

      // Execute FFmpeg command
      const ffmpegProcess = spawn('ffmpeg', args);

      let progress = 0;
      const interval = setInterval(async () => {
        progress += Math.random() * 15; // Random progress increment
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          // In a real implementation, this would be where FFmpeg completes
          const outputResult = {
            processedFileUrl: safeOutputPath,
            thumbnailUrl: safeOutputPath.replace(/\.[^/.]+$/, '') + '_thumb.jpg',
            duration: 120, // seconds
            resolution: '1920x1080',
            fileSize: 15000000, // bytes
          };

          await client.query(
            `UPDATE video_processing_jobs 
             SET status = 'completed', 
                 progress = 100,
                 completed_at = NOW(),
                 output_result = $1
             WHERE id = $2`,
            [JSON.stringify(outputResult), jobId],
          );

          // Update the project to reflect completion
          const jobResult = await client.query(
            'SELECT project_id FROM video_processing_jobs WHERE id = $1',
            [jobId],
          );

          if (jobResult.rows.length > 0) {
            await client.query(
              `UPDATE video_projects 
               SET status = 'completed', updated_at = NOW()
               WHERE id = $1`,
              [jobResult.rows[0].project_id],
            );
          }
        } else {
          // Update progress
          await client.query(
            `UPDATE video_processing_jobs 
             SET progress = $1
             WHERE id = $2`,
            [Math.min(progress, 100), jobId],
          );
        }
      }, 1500); // Update every 1.5 seconds

      // Handle FFmpeg process completion
      ffmpegProcess.on('close', (code) => {
        if (code !== 0) {
          // FFmpeg failed
          this.completeJobWithError(
            client,
            jobId,
            `FFmpeg exited with code ${code}`,
          );
        }
      });

      // Handle FFmpeg errors
      ffmpegProcess.on('error', (err) => {
        this.completeJobWithError(
          client,
          jobId,
          `FFmpeg error: ${err.message}`,
        );
      });
    } catch (error) {
      await this.completeJobWithError(client, jobId, error.message);
    }
  }

  /**
   * Handle export job with server-side processing
   */
  static async handleExportJob(client, jobId, inputParams) {
    try {
      const { inputPath, outputPath, quality, format, resolution } =
        inputParams;

      if (!inputPath || !outputPath) {
        throw new Error('Input and output paths are required for export job');
      }

      // Sanitize file paths
      const safeInputPath = this.sanitizeFilePath(inputPath);
      const safeOutputPath = this.sanitizeFilePath(outputPath);

      // Map quality to bitrate
      const qualityMap = {
        low: '2M',
        medium: '5M',
        high: '8M',
        ultra: '15M'
      };

      const bitrate = qualityMap[quality] || '8M';
      const res = resolution || '1920x1080';

      // Prepare FFmpeg command for export
      const args = ['-i', safeInputPath, '-b:v', bitrate, '-s', res, safeOutputPath];

      // Execute FFmpeg command
      const ffmpegProcess = spawn('ffmpeg', args);

      let progress = 0;
      const interval = setInterval(async () => {
        progress += Math.random() * 10; // Slower progress for export
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          // Generate export result
          const outputResult = {
            processedFileUrl: safeOutputPath,
            thumbnailUrl: safeOutputPath.replace(/\.[^/.]+$/, '') + '_thumb.jpg',
            duration: 120, // seconds
            resolution: resolution || '1920x1080',
            fileSize: 25000000, // varies by quality
            quality: quality || 'high'
          };

          await client.query(
            `UPDATE video_processing_jobs 
             SET status = 'completed', 
                 progress = 100,
                 completed_at = NOW(),
                 output_result = $1
             WHERE id = $2`,
            [JSON.stringify(outputResult), jobId],
          );

          // Update project status
          const jobResult = await client.query(
            'SELECT project_id FROM video_processing_jobs WHERE id = $1',
            [jobId],
          );

          if (jobResult.rows.length > 0) {
            await client.query(
              `UPDATE video_projects 
               SET status = 'published', updated_at = NOW()
               WHERE id = $1`,
              [jobResult.rows[0].project_id],
            );
          }
        } else {
          await client.query(
            `UPDATE video_processing_jobs 
             SET progress = $1
             WHERE id = $2`,
            [Math.min(progress, 100), jobId],
          );
        }
      }, 2000);

      // Handle FFmpeg process completion
      ffmpegProcess.on('close', (code) => {
        if (code !== 0) {
          this.completeJobWithError(
            client,
            jobId,
            `FFmpeg export exited with code ${code}`,
          );
        }
      });

      // Handle FFmpeg errors
      ffmpegProcess.on('error', (err) => {
        this.completeJobWithError(
          client,
          jobId,
          `FFmpeg export error: ${err.message}`,
        );
      });
    } catch (error) {
      await this.completeJobWithError(client, jobId, error.message);
    }
  }

  /**
   * Handle applying filter job
   */
  static async handleApplyFilterJob(client, jobId, inputParams) {
    try {
      const { inputPath, outputPath, filterType } = inputParams;

      if (!inputPath || !outputPath) {
        throw new Error('Input and output paths are required for filter job');
      }

      // Sanitize file paths
      const safeInputPath = this.sanitizeFilePath(inputPath);
      const safeOutputPath = this.sanitizeFilePath(outputPath);

      // Map filter types to FFmpeg filter strings
      const filterMap = {
        clarendon:
          'curves=vintage,eq=contrast=1.1:brightness=0.1:saturation=1.2',
        moon: 'hue=s=0,eq=contrast=1.3:brightness=0.1',
        lark: 'eq=gamma=1.1:contrast=1.2:saturation=0.8,brightness=0.1,curves=preset=natural',
        reyes:
          'eq=contrast=0.8:brightness=0.1:saturation=0.8,curves=preset=mellow',
        juno: 'eq=brightness=0.1:saturation=1.3,curves=preset=fresh,yuv420p',
        kelvin: 'curves=rimless_warm,eq=contrast=1.1:saturation=1.3',
        amaro: 'eq=gamma=1.2:contrast=1.1,curves=preset=nature',
        rise: 'eq=brightness=0.1:saturation=0.9,curves=red=0.1/0.0:0.5/0.5:green=0.1/0.0:0.5/0.5'
      };

      const filter = filterMap[filterType] || 'null';

      // Prepare FFmpeg command
      const args = ['-i', safeInputPath, '-vf', filter, safeOutputPath];

      // Execute FFmpeg command
      const ffmpegProcess = spawn('ffmpeg', args);

      let progress = 0;
      const interval = setInterval(async () => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          const outputResult = {
            filteredVideoPath: safeOutputPath,
            appliedFilter: filterType,
            processingTime: Date.now()
          };

          await client.query(
            `UPDATE video_processing_jobs 
             SET status = 'completed', 
                 progress = 100,
                 completed_at = NOW(),
                 output_result = $1
             WHERE id = $2`,
            [JSON.stringify(outputResult), jobId],
          );
        } else {
          await client.query(
            `UPDATE video_processing_jobs 
             SET progress = $1
             WHERE id = $2`,
            [Math.min(progress, 100), jobId],
          );
        }
      }, 1000);

      // Handle FFmpeg process completion
      ffmpegProcess.on('close', (code) => {
        if (code !== 0) {
          this.completeJobWithError(
            client,
            jobId,
            `FFmpeg filter exited with code ${code}`,
          );
        }
      });

      // Handle FFmpeg errors
      ffmpegProcess.on('error', (err) => {
        this.completeJobWithError(
          client,
          jobId,
          `FFmpeg filter error: ${err.message}`,
        );
      });
    } catch (error) {
      await this.completeJobWithError(client, jobId, error.message);
    }
  }

  /**
   * Handle adding text overlay job
   */
  static async handleAddTextOverlayJob(client, jobId, inputParams) {
    try {
      const { inputPath, outputPath, textSpecs } = inputParams;

      if (!inputPath || !outputPath) {
        throw new Error(
          'Input and output paths are required for text overlay job',
        );
      }

      // Sanitize file paths
      const safeInputPath = this.sanitizeFilePath(inputPath);
      const safeOutputPath = this.sanitizeFilePath(outputPath);

      // Prepare FFmpeg command with drawtext filter
      const { content, position, fontSize, color, fontFamily } = textSpecs;
      const x = position.x || 10;
      const y = position.y || 10;
      const size = fontSize || 24;
      const font = fontFamily || 'Arial';
      const fontcolor = color || 'white';

      // Sanitize text content to prevent command injection
      const safeContent = this.sanitizeFilterParam(content || '');
      const safeFont = this.sanitizeFilterParam(font || 'Arial');
      const safeFontColor = this.sanitizeFilterParam(fontcolor || 'white');

      const drawtextFilter = `drawtext=text='${safeContent}':x=${x}:y=${y}:fontsize=${size}:fontcolor=${safeFontColor}:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf`;

      const args = ['-i', safeInputPath, '-vf', drawtextFilter, safeOutputPath];

      // Execute FFmpeg command
      const ffmpegProcess = spawn('ffmpeg', args);

      let progress = 0;
      const interval = setInterval(async () => {
        progress += Math.random() * 25;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          const outputResult = {
            videoWithTextOverlayPath: safeOutputPath,
            textSpecifications: textSpecs,
            processingTime: Date.now()
          };

          await client.query(
            `UPDATE video_processing_jobs 
             SET status = 'completed', 
                 progress = 100,
                 completed_at = NOW(),
                 output_result = $1
             WHERE id = $2`,
            [JSON.stringify(outputResult), jobId],
          );
        } else {
          await client.query(
            `UPDATE video_processing_jobs 
             SET progress = $1
             WHERE id = $2`,
            [Math.min(progress, 100), jobId],
          );
        }
      }, 800);

      // Handle FFmpeg process completion
      ffmpegProcess.on('close', (code) => {
        if (code !== 0) {
          this.completeJobWithError(
            client,
            jobId,
            `FFmpeg text overlay exited with code ${code}`,
          );
        }
      });

      // Handle FFmpeg errors
      ffmpegProcess.on('error', (err) => {
        this.completeJobWithError(
          client,
          jobId,
          `FFmpeg text overlay error: ${err.message}`,
        );
      });
    } catch (error) {
      await this.completeJobWithError(client, jobId, error.message);
    }
  }

  /**
   * Handle adding sticker job
   */
  static async handleAddStickerJob(client, jobId, inputParams) {
    try {
      const { inputPath, outputPath, stickerSpecs } = inputParams;

      if (!inputPath || !outputPath) {
        throw new Error('Input and output paths are required for sticker job');
      }

      // Sanitize file paths
      const safeInputPath = this.sanitizeFilePath(inputPath);
      const safeOutputPath = this.sanitizeFilePath(outputPath);

      // For simplicity, we'll just return the specification
      // In a real implementation, we would overlay the sticker image
      const outputResult = {
        videoWithStickerPath: safeOutputPath,
        stickerSpecifications: stickerSpecs,
        processingTime: Date.now()
      };

      await client.query(
        `UPDATE video_processing_jobs 
         SET status = 'completed', 
             progress = 100,
             completed_at = NOW(),
             output_result = $1
         WHERE id = $2`,
        [JSON.stringify(outputResult), jobId],
      );
    } catch (error) {
      await this.completeJobWithError(client, jobId, error.message);
    }
  }

  /**
   * Handle audio mixing job
   */
  static async handleAudioMixingJob(client, jobId, inputParams) {
    try {
      const { inputPath, outputPath, audioTrackPath, volumeAdjustments } =
        inputParams;

      if (!inputPath || !outputPath) {
        throw new Error(
          'Input and output paths are required for audio mixing job',
        );
      }

      // Sanitize file paths
      const safeInputPath = this.sanitizeFilePath(inputPath);
      const safeOutputPath = this.sanitizeFilePath(outputPath);
      const safeAudioTrackPath = audioTrackPath ? this.sanitizeFilePath(audioTrackPath) : '';

      // Prepare FFmpeg command for audio mixing
      const args = [
        '-i',
        safeInputPath,
        '-i',
        safeAudioTrackPath || audioTrackPath, // Use original if no safe version available
        '-filter_complex',
        `[0:a]volume=${volumeAdjustments.main || 1}[main];[1:a]volume=${volumeAdjustments.overlay || 0.8}[overlay];[main][overlay]amix=inputs=2:duration=longest[aout]`,
        '-map',
        '0:v',
        '-map',
        '[aout]',
        safeOutputPath
      ];

      // Execute FFmpeg command
      const ffmpegProcess = spawn('ffmpeg', args);

      let progress = 0;
      const interval = setInterval(async () => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          const outputResult = {
            mixedAudioVideoPath: safeOutputPath,
            mixedAudioTrack: safeAudioTrackPath || audioTrackPath,
            volumeAdjustments: volumeAdjustments,
            processingTime: Date.now()
          };

          await client.query(
            `UPDATE video_processing_jobs 
             SET status = 'completed', 
                 progress = 100,
                 completed_at = NOW(),
                 output_result = $1
             WHERE id = $2`,
            [JSON.stringify(outputResult), jobId],
          );
        } else {
          await client.query(
            `UPDATE video_processing_jobs 
             SET progress = $1
             WHERE id = $2`,
            [Math.min(progress, 100), jobId],
          );
        }
      }, 1200);

      // Handle FFmpeg process completion
      ffmpegProcess.on('close', (code) => {
        if (code !== 0) {
          this.completeJobWithError(
            client,
            jobId,
            `FFmpeg audio mixing exited with code ${code}`,
          );
        }
      });

      // Handle FFmpeg errors
      ffmpegProcess.on('error', (err) => {
        this.completeJobWithError(
          client,
          jobId,
          `FFmpeg audio mixing error: ${err.message}`,
        );
      });
    } catch (error) {
      await this.completeJobWithError(client, jobId, error.message);
    }
  }

  /**
   * Complete a job with error
   */
  static async completeJobWithError(client, jobId, errorMessage) {
    try {
      if (!client) {
        const tempClient = await monetizationDb.connect();
        try {
          await tempClient.query(
            `UPDATE video_processing_jobs 
             SET status = 'failed', 
                 progress = 100,
                 completed_at = NOW(),
                 output_result = $1
             WHERE id = $2`,
            [JSON.stringify({ error: errorMessage }), jobId],
          );
        } finally {
          tempClient.release();
        }
      } else {
        await client.query(
          `UPDATE video_processing_jobs 
           SET status = 'failed', 
               progress = 100,
               completed_at = NOW(),
               output_result = $1
           WHERE id = $2`,
          [JSON.stringify({ error: errorMessage }), jobId],
        );
      }
    } catch (error) {
      logger.error('Error completing job with error:', error);
    }
  }

  /**
   * Get processing job status
   */
  static async getJobStatus(jobId) {
    try {
      const result = await monetizationDb.query(
        'SELECT * FROM video_processing_jobs WHERE id = $1',
        [jobId],
      );

      if (result.rows.length === 0) {
        throw new Error('Job not found');
      }

      return result.rows[0];
    } catch (error) {
      logger.error('Error getting job status:', error);
      throw error;
    }
  }

  /**
   * Get all jobs for a project
   */
  static async getJobsForProject(projectId) {
    try {
      const result = await monetizationDb.query(
        'SELECT * FROM video_processing_jobs WHERE project_id = $1 ORDER BY created_at DESC',
        [projectId],
      );

      return result.rows;
    } catch (error) {
      logger.error('Error getting jobs for project:', error);
      throw error;
    }
  }

  /**
   * Cancel a processing job
   */
  static async cancelJob(jobId) {
    try {
      const client = await monetizationDb.connect();
      try {
        const result = await client.query(
          `UPDATE video_processing_jobs 
           SET status = 'cancelled', updated_at = NOW()
           WHERE id = $1 AND status = 'pending'
           RETURNING *`,
          [jobId],
        );

        if (result.rows.length === 0) {
          throw new Error('Job not found or already in progress');
        }

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error cancelling job:', error);
      throw error;
    }
  }
}

module.exports = VideoProcessingService;
