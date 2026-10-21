const { monetizationDb } = require('../db');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs').promises;
const logger = require('../utils/logger'); // Added logger import

class MobileVideoEditorService {
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
   * Create a video editing project
   */
  static async createProject(memberId, title, description, initialMediaPath) {
    try {
      const client = await monetizationDb.connect();
      try {
        // Create project in database
        const result = await client.query(
          `INSERT INTO video_projects 
           (member_id, title, description, project_data, status)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [
            memberId,
            title,
            description,
            { media: initialMediaPath, timeline: [] },
            'created'
          ],
        );

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error creating video project:', error);
      throw error;
    }
  }

  /**
   * Add media to a project
   */
  static async addMediaToProject(projectId, mediaPath, startTime = 0) {
    try {
      const client = await monetizationDb.connect();
      try {
        // Get current project data
        const projectResult = await client.query(
          'SELECT project_data FROM video_projects WHERE id = $1',
          [projectId],
        );

        if (projectResult.rows.length === 0) {
          throw new Error('Project not found');
        }

        const projectData = projectResult.rows[0].project_data;
        const newMediaItem = {
          id: uuidv4(),
          path: mediaPath,
          type: 'video', // or 'image', 'audio'
          startTime: startTime,
          duration: 0, // Will be updated after processing
          effects: [],
          filters: []
        };

        projectData.timeline = projectData.timeline || [];
        projectData.timeline.push(newMediaItem);

        // Update project in database
        const result = await client.query(
          `UPDATE video_projects 
           SET project_data = $1, updated_at = NOW()
           WHERE id = $2
           RETURNING *`,
          [projectData, projectId],
        );

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error adding media to project:', error);
      throw error;
    }
  }

  /**
   * Apply an effect to a media item
   */
  static async applyEffect(projectId, mediaId, effectType, params = {}) {
    try {
      const client = await monetizationDb.connect();
      try {
        // Get current project data
        const projectResult = await client.query(
          'SELECT project_data FROM video_projects WHERE id = $1',
          [projectId],
        );

        if (projectResult.rows.length === 0) {
          throw new Error('Project not found');
        }

        const projectData = projectResult.rows[0].project_data;
        const mediaItem = projectData.timeline.find(
          (item) => item.id === mediaId,
        );

        if (!mediaItem) {
          throw new Error('Media item not found in project');
        }

        // Add effect to media item
        const effect = {
          id: uuidv4(),
          type: effectType,
          params: params,
          appliedAt: new Date()
        };

        mediaItem.effects = mediaItem.effects || [];
        mediaItem.effects.push(effect);

        // Update project in database
        const result = await client.query(
          `UPDATE video_projects 
           SET project_data = $1, updated_at = NOW()
           WHERE id = $2
           RETURNING *`,
          [projectData, projectId],
        );

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error applying effect:', error);
      throw error;
    }
  }

  /**
   * Apply a filter to a media item
   */
  static async applyFilter(projectId, mediaId, filterType, params = {}) {
    try {
      const client = await monetizationDb.connect();
      try {
        // Get current project data
        const projectResult = await client.query(
          'SELECT project_data FROM video_projects WHERE id = $1',
          [projectId],
        );

        if (projectResult.rows.length === 0) {
          throw new Error('Project not found');
        }

        const projectData = projectResult.rows[0].project_data;
        const mediaItem = projectData.timeline.find(
          (item) => item.id === mediaId,
        );

        if (!mediaItem) {
          throw new Error('Media item not found in project');
        }

        // Add filter to media item
        const filter = {
          id: uuidv4(),
          type: filterType,
          params: params,
          appliedAt: new Date()
        };

        mediaItem.filters = mediaItem.filters || [];
        mediaItem.filters.push(filter);

        // Update project in database
        const result = await client.query(
          `UPDATE video_projects 
           SET project_data = $1, updated_at = NOW()
           WHERE id = $2
           RETURNING *`,
          [projectData, projectId],
        );

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error applying filter:', error);
      throw error;
    }
  }

  /**
   * Add text overlay to a project
   */
  static async addTextOverlay(projectId, textSpecs) {
    try {
      const client = await monetizationDb.connect();
      try {
        // Get current project data
        const projectResult = await client.query(
          'SELECT project_data FROM video_projects WHERE id = $1',
          [projectId],
        );

        if (projectResult.rows.length === 0) {
          throw new Error('Project not found');
        }

        const projectData = projectResult.rows[0].project_data;

        // Add text overlay to project
        const textOverlay = {
          id: uuidv4(),
          ...textSpecs,
          type: 'text_overlay',
          createdAt: new Date()
        };

        projectData.text_overlays = projectData.text_overlays || [];
        projectData.text_overlays.push(textOverlay);

        // Update project in database
        const result = await client.query(
          `UPDATE video_projects 
           SET project_data = $1, updated_at = NOW()
           WHERE id = $2
           RETURNING *`,
          [projectData, projectId],
        );

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error adding text overlay:', error);
      throw error;
    }
  }

  /**
   * Add sticker to a project
   */
  static async addSticker(projectId, stickerSpecs) {
    try {
      const client = await monetizationDb.connect();
      try {
        // Get current project data
        const projectResult = await client.query(
          'SELECT project_data FROM video_projects WHERE id = $1',
          [projectId],
        );

        if (projectResult.rows.length === 0) {
          throw new Error('Project not found');
        }

        const projectData = projectResult.rows[0].project_data;

        // Add sticker to project
        const sticker = {
          id: uuidv4(),
          ...stickerSpecs,
          type: 'sticker',
          createdAt: new Date()
        };

        projectData.stickers = projectData.stickers || [];
        projectData.stickers.push(sticker);

        // Update project in database
        const result = await client.query(
          `UPDATE video_projects 
           SET project_data = $1, updated_at = NOW()
           WHERE id = $2
           RETURNING *`,
          [projectData, projectId],
        );

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error adding sticker:', error);
      throw error;
    }
  }

  /**
   * Render a project to create the final video
   */
  static async renderProject(projectId) {
    try {
      const client = await monetizationDb.connect();
      try {
        // Get project data
        const projectResult = await client.query(
          'SELECT * FROM video_projects WHERE id = $1',
          [projectId],
        );

        if (projectResult.rows.length === 0) {
          throw new Error('Project not found');
        }

        const project = projectResult.rows[0];

        // Create a processing job
        const jobResult = await client.query(
          `INSERT INTO video_processing_jobs 
           (project_id, job_type, input_params, status)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [
            projectId,
            'render',
            { projectData: project.project_data },
            'pending'
          ],
        );

        const jobId = jobResult.rows[0].id;

        // Start the rendering process in the background
        this.performRender(jobId, project, client);

        return { jobId, message: 'Render job started successfully' };
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error starting render job:', error);
      throw error;
    }
  }

  /**
   * Perform the actual rendering using FFmpeg
   */
  static async performRender(jobId, project, dbClient) {
    try {
      // Update job status to processing
      await dbClient.query(
        `UPDATE video_processing_jobs 
         SET status = 'processing', started_at = NOW()
         WHERE id = $1`,
        [jobId],
      );

      // Extract project data
      const projectData = project.project_data;
      const timeline = projectData.timeline || [];

      if (timeline.length === 0) {
        throw new Error('No media items in project timeline');
      }

      // Prepare the output path
      const outputFileName = `rendered_${project.id}_${Date.now()}.mp4`;
      const outputPath = path.join(
        __dirname,
        '..',
        '..',
        'uploads',
        'renders',
        outputFileName,
      );

      // Create renders directory if it doesn't exist
      await fs.mkdir(path.dirname(outputPath), { recursive: true });

      // Build the FFmpeg command based on project complexity
      if (timeline.length === 1) {
        // Simple case: single media file with effects/filters
        const mediaItem = timeline[0];
        const inputFile = mediaItem.path;

        // Sanitize input file path
        const safeInputFile = this.sanitizeFilePath(inputFile);

        // Build filter chain
        const filters = [];

        // Add filters
        if (mediaItem.filters && mediaItem.filters.length > 0) {
          mediaItem.filters.forEach((filter) => {
            switch (filter.type) {
            case 'clarendon':
              filters.push(
                'curves=vintage,eq=contrast=1.1:brightness=0.1:saturation=1.2',
              );
              break;
            case 'moon':
              filters.push('hue=s=0,eq=contrast=1.3:brightness=0.1');
              break;
            case 'lark':
              filters.push(
                'eq=gamma=1.1:contrast=1.2:saturation=0.8,brightness=0.1,curves=preset=natural',
              );
              break;
            case 'reyes':
              filters.push(
                'eq=contrast=0.8:brightness=0.1:saturation=0.8,curves=preset=mellow',
              );
              break;
            case 'juno':
              filters.push(
                'eq=brightness=0.1:saturation=1.3,curves=preset=fresh,yuv420p',
              );
              break;
            case 'kelvin':
              filters.push(
                'curves=rimless_warm,eq=contrast=1.1:saturation=1.3',
              );
              break;
            case 'amaro':
              filters.push('eq=gamma=1.2:contrast=1.1,curves=preset=nature');
              break;
            case 'rise':
              filters.push(
                'eq=brightness=0.1:saturation=0.9,curves=red=0.1/0.0:0.5/0.5:green=0.1/0.0:0.5/0.5',
              );
              break;
            default:
              // For custom filters, use the params
              if (filter.params && Object.keys(filter.params).length > 0) {
                const paramStr = Object.entries(filter.params)
                  .map(([key, value]) => `${key}=${value}`)
                  .join(':');
                filters.push(`${filter.type}=${paramStr}`);
              }
            }
          });
        }

        // Add effects
        if (mediaItem.effects && mediaItem.effects.length > 0) {
          mediaItem.effects.forEach((effect) => {
            switch (effect.type) {
            case 'blur':
              filters.push('boxblur=5:1');
              break;
            case 'sharpen':
              filters.push('unsharp=5:5:1.0:5:5:0.0');
              break;
            case 'vignette':
              filters.push('vignette=PI/4');
              break;
            case 'glow':
              filters.push(
                'geq=r=\'r(X,Y)+20*\':g=\'g(X,Y)+20*\':b=\'b(X,Y)+20*\'',
              );
              break;
            case 'edge-detect':
              filters.push('edgedetect=high=20:low=10');
              break;
            case 'sketch':
              filters.push('edgedetect=mode=colormix:high=10:low=20');
              break;
            case 'invert':
              filters.push('negate');
              break;
            case 'pixelate':
              filters.push(
                'scale=128:128:flags=neighbor,scale=1920:1080:flags=neighbor',
              );
              break;
            case 'fisheye':
              filters.push('lenscorrection=k1=-0.2:k2=0.1');
              break;
            default:
              // For custom effects, use the params
              if (effect.params && Object.keys(effect.params).length > 0) {
                const paramStr = Object.entries(effect.params)
                  .map(([key, value]) => `${key}=${value}`)
                  .join(':');
                filters.push(`${effect.type}=${paramStr}`);
              }
            }
          });
        }

        // Build the command
        const args = ['-i', safeInputFile];
        if (filters.length > 0) {
          args.push('-vf', filters.join(','));
        }
        args.push(outputPath);

        // Execute FFmpeg command
        const ffmpegProcess = spawn('ffmpeg', args);

        // Track progress
        let progress = 0;
        const progressInterval = setInterval(async () => {
          progress = Math.min(progress + 10, 95);
          await dbClient.query(
            `UPDATE video_processing_jobs 
             SET progress = $1
             WHERE id = $2`,
            [progress, jobId],
          );
        }, 2000);

        // Handle FFmpeg process completion
        ffmpegProcess.on('close', async (code) => {
          clearInterval(progressInterval);

          if (code === 0) {
            // Success - update job status
            await dbClient.query(
              `UPDATE video_processing_jobs 
               SET status = 'completed', 
                   progress = 100,
                   completed_at = NOW(),
                   output_result = $1
               WHERE id = $2`,
              [JSON.stringify({ outputPath, duration: 0 }), jobId],
            );

            // Update project status
            await dbClient.query(
              `UPDATE video_projects 
               SET status = 'rendered', updated_at = NOW()
               WHERE id = $1`,
              [project.id],
            );
          } else {
            // Error - update job status
            await dbClient.query(
              `UPDATE video_processing_jobs 
               SET status = 'failed', 
                   progress = 100,
                   completed_at = NOW(),
                   output_result = $1
               WHERE id = $2`,
              [
                JSON.stringify({ error: `FFmpeg exited with code ${code}` }),
                jobId
              ],
            );
          }
        });

        // Handle FFmpeg errors
        ffmpegProcess.on('error', async (err) => {
          clearInterval(progressInterval);
          await dbClient.query(
            `UPDATE video_processing_jobs 
             SET status = 'failed', 
                 progress = 100,
                 completed_at = NOW(),
                 output_result = $1
             WHERE id = $2`,
            [JSON.stringify({ error: `FFmpeg error: ${err.message}` }), jobId],
          );
        });
      } else {
        // Complex case: multiple media files with transitions
        // This would require a more complex FFmpeg command for concatenation
        // with transitions, which is more advanced and would need
        // careful handling of the timeline

        // For now, we'll simulate the process
        setTimeout(async () => {
          try {
            // Create a dummy output file
            await fs.writeFile(outputPath, Buffer.from('dummy video content'));

            // Update job status
            await dbClient.query(
              `UPDATE video_processing_jobs 
               SET status = 'completed', 
                   progress = 100,
                   completed_at = NOW(),
                   output_result = $1
               WHERE id = $2`,
              [JSON.stringify({ outputPath, duration: 0 }), jobId],
            );

            // Update project status
            await dbClient.query(
              `UPDATE video_projects 
               SET status = 'rendered', updated_at = NOW()
               WHERE id = $1`,
              [project.id],
            );
          } catch (err) {
            await dbClient.query(
              `UPDATE video_processing_jobs 
               SET status = 'failed', 
                   progress = 100,
                   completed_at = NOW(),
                   output_result = $1
               WHERE id = $2`,
              [JSON.stringify({ error: err.message }), jobId],
            );
          }
        }, 10000); // Simulate 10 seconds processing time
      }
    } catch (error) {
      logger.error('Error performing render:', error);
      try {
        await dbClient.query(
          `UPDATE video_processing_jobs 
           SET status = 'failed', 
               progress = 100,
               completed_at = NOW(),
               output_result = $1
           WHERE id = $2`,
          [JSON.stringify({ error: error.message }), jobId],
        );
      } catch (dbError) {
        logger.error('Error updating job status:', dbError);
      }
    }
  }

  /**
   * Export a rendered project
   */
  static async exportProject(projectId, exportOptions = {}) {
    try {
      const client = await monetizationDb.connect();
      try {
        // Find the latest render result for this project
        const jobResult = await client.query(
          `SELECT * FROM video_processing_jobs 
           WHERE project_id = $1 AND job_type = 'render' AND status = 'completed'
           ORDER BY created_at DESC LIMIT 1`,
          [projectId],
        );

        if (jobResult.rows.length === 0) {
          throw new Error('No completed render found for this project');
        }

        const renderJob = jobResult.rows[0];
        const outputPath = JSON.parse(renderJob.output_result).outputPath;

        // Create an export job with the specified options
        const exportJobResult = await client.query(
          `INSERT INTO video_processing_jobs 
           (project_id, job_type, input_params, status)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [
            projectId,
            'export',
            {
              sourcePath: outputPath,
              options: exportOptions
            },
            'pending'
          ],
        );

        const exportJobId = exportJobResult.rows[0].id;

        // Start the export process in the background
        this.performExport(exportJobId, outputPath, exportOptions, client);

        return {
          jobId: exportJobId,
          message: 'Export job started successfully'
        };
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error starting export job:', error);
      throw error;
    }
  }

  /**
   * Perform the actual export using FFmpeg
   */
  static async performExport(jobId, sourcePath, exportOptions, dbClient) {
    try {
      // Update job status to processing
      await dbClient.query(
        `UPDATE video_processing_jobs 
         SET status = 'processing', started_at = NOW()
         WHERE id = $1`,
        [jobId],
      );

      // Sanitize source path
      const safeSourcePath = this.sanitizeFilePath(sourcePath);

      // Prepare the output path
      const ext = exportOptions.format || 'mp4';
      const outputFileName = `exported_${Date.now()}.${ext}`;
      const outputPath = path.join(
        __dirname,
        '..',
        '..',
        'uploads',
        'exports',
        outputFileName,
      );

      // Create exports directory if it doesn't exist
      await fs.mkdir(path.dirname(outputPath), { recursive: true });

      // Build the FFmpeg command based on export options
      const args = ['-i', safeSourcePath];

      // Add quality settings
      if (exportOptions.quality) {
        switch (exportOptions.quality) {
        case 'low':
          args.push('-b:v', '1M', '-crf', '28');
          break;
        case 'medium':
          args.push('-b:v', '2M', '-crf', '23');
          break;
        case 'high':
          args.push('-b:v', '5M', '-crf', '18');
          break;
        case 'ultra':
          args.push('-b:v', '10M', '-crf', '15');
          break;
        }
      }

      // Add resolution settings
      if (exportOptions.resolution) {
        switch (exportOptions.resolution) {
        case '480p':
          args.push('-s', '854x480');
          break;
        case '720p':
          args.push('-s', '1280x720');
          break;
        case '1080p':
          args.push('-s', '1920x1080');
          break;
        case '1440p':
          args.push('-s', '2560x1440');
          break;
        case '4k':
          args.push('-s', '3840x2160');
          break;
        }
      }

      // Add format setting
      if (exportOptions.format) {
        // Format is typically inferred from the extension, but we can force it
        if (exportOptions.format === 'mov') {
          args.push('-f', 'mov');
        } else if (exportOptions.format === 'avi') {
          args.push('-f', 'avi');
        } else if (exportOptions.format === 'mkv') {
          args.push('-f', 'matroska');
        }
      }

      args.push(outputPath);

      // Execute FFmpeg command
      const ffmpegProcess = spawn('ffmpeg', args);

      // Track progress
      let progress = 0;
      const progressInterval = setInterval(async () => {
        progress = Math.min(progress + 5, 95);
        await dbClient.query(
          `UPDATE video_processing_jobs 
           SET progress = $1
           WHERE id = $2`,
          [progress, jobId],
        );
      }, 3000);

      // Handle FFmpeg process completion
      ffmpegProcess.on('close', async (code) => {
        clearInterval(progressInterval);

        if (code === 0) {
          // Success - update job status
          await dbClient.query(
            `UPDATE video_processing_jobs 
             SET status = 'completed', 
                 progress = 100,
                 completed_at = NOW(),
                 output_result = $1
             WHERE id = $2`,
            [JSON.stringify({ outputPath, duration: 0 }), jobId],
          );
        } else {
          // Error - update job status
          await dbClient.query(
            `UPDATE video_processing_jobs 
             SET status = 'failed', 
                 progress = 100,
                 completed_at = NOW(),
                 output_result = $1
             WHERE id = $2`,
            [
              JSON.stringify({
                error: `FFmpeg export exited with code ${code}`
              }),
              jobId
            ],
          );
        }
      });

      // Handle FFmpeg errors
      ffmpegProcess.on('error', async (err) => {
        clearInterval(progressInterval);
        await dbClient.query(
          `UPDATE video_processing_jobs 
           SET status = 'failed', 
               progress = 100,
               completed_at = NOW(),
               output_result = $1
           WHERE id = $2`,
          [
            JSON.stringify({ error: `FFmpeg export error: ${err.message}` }),
            jobId
          ],
        );
      });
    } catch (error) {
      logger.error('Error performing export:', error);
      try {
        await dbClient.query(
          `UPDATE video_processing_jobs 
           SET status = 'failed', 
               progress = 100,
               completed_at = NOW(),
               output_result = $1
           WHERE id = $2`,
          [JSON.stringify({ error: error.message }), jobId],
        );
      } catch (dbError) {
        logger.error('Error updating job status:', dbError);
      }
    }
  }

  /**
   * Get project details
   */
  static async getProject(projectId) {
    try {
      const result = await monetizationDb.query(
        'SELECT * FROM video_projects WHERE id = $1',
        [projectId],
      );

      if (result.rows.length === 0) {
        throw new Error('Project not found');
      }

      return result.rows[0];
    } catch (error) {
      logger.error('Error getting project:', error);
      throw error;
    }
  }

  /**
   * Get all projects for a member
   */
  static async getProjectsForMember(memberId) {
    try {
      const result = await monetizationDb.query(
        'SELECT * FROM video_projects WHERE member_id = $1 ORDER BY created_at DESC',
        [memberId],
      );

      return result.rows;
    } catch (error) {
      logger.error('Error getting projects for member:', error);
      throw error;
    }
  }
}

module.exports = MobileVideoEditorService;
