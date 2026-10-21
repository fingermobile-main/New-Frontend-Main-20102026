/* eslint-disable no-unused-vars */
const logger = require('../utils/logger');
const { monetizationDb } = require('../db');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

class VideoAssetService {
  /**
   * Upload a video asset
   */
  static async uploadVideo(memberId, videoFile, title) {
    try {
      const client = await monetizationDb.connect();
      try {
        const fileId = uuidv4();
        const fileName = `${fileId}.${videoFile.originalname.split('.').pop()}`;
        const filePath = path.join(
          process.cwd(),
          'uploads',
          'videos',
          fileName,
        );

        // Save file to disk
        await videoFile.mv(filePath);

        // Insert into DB
        const result = await client.query(
          `INSERT INTO video_assets 
           (member_id, title, original_file_url, file_size, duration, resolution, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [
            memberId,
            title,
            `/uploads/videos/${fileName}`,
            videoFile.size,
            0,
            'unknown',
            'uploaded'
          ],
        );

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error uploading video:', error);
      throw error;
    }
  }

  /**
   * Create a new video project
   */
  static async createProject(memberId, title, description, projectData) {
    try {
      const client = await monetizationDb.connect();
      try {
        const result = await client.query(
          `INSERT INTO video_projects 
           (member_id, title, description, project_data)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [memberId, title, description, JSON.stringify(projectData)],
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
   * Update a video project
   */
  static async updateProject(
    projectId,
    projectData,
    title = null,
    description = null,
  ) {
    try {
      const client = await monetizationDb.connect();
      try {
        let query = 'UPDATE video_projects SET project_data = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
        let params = [JSON.stringify(projectData), projectId];

        if (title || description) {
          query = `UPDATE video_projects 
                   SET project_data = $1, 
                       title = COALESCE($3, title), 
                       description = COALESCE($4, description), 
                       updated_at = NOW() 
                   WHERE id = $5 
                   RETURNING *`;
          params = [
            JSON.stringify(projectData),
            projectId,
            title,
            description,
            projectId
          ];
        }

        const result = await client.query(query, params);

        if (result.rows.length === 0) {
          throw new Error('Project not found');
        }

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error updating video project:', error);
      throw error;
    }
  }

  /**
   * Get a video project by ID
   */
  static async getProjectById(projectId, memberId) {
    try {
      const result = await monetizationDb.query(
        'SELECT * FROM video_projects WHERE id = $1 AND member_id = $2',
        [projectId, memberId],
      );

      if (result.rows.length === 0) {
        throw new Error('Project not found');
      }

      return result.rows[0];
    } catch (error) {
      logger.error('Error getting video project:', error);
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
      logger.error('Error getting video projects:', error);
      throw error;
    }
  }

  /**
   * Save project as draft
   */
  static async saveDraft(projectId, projectData) {
    try {
      const client = await monetizationDb.connect();
      try {
        const result = await client.query(
          `UPDATE video_projects 
           SET project_data = $1, status = 'draft', updated_at = NOW()
           WHERE id = $2
           RETURNING *`,
          [JSON.stringify(projectData), projectId],
        );

        if (result.rows.length === 0) {
          throw new Error('Project not found');
        }

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error saving draft:', error);
      throw error;
    }
  }

  /**
   * Schedule a project for publishing
   */
  static async scheduleProject(projectId, scheduleTime) {
    try {
      const client = await monetizationDb.connect();
      try {
        const result = await client.query(
          `UPDATE video_projects 
           SET status = 'scheduled', scheduled_publish_at = $1, updated_at = NOW()
           WHERE id = $2
           RETURNING *`,
          [scheduleTime, projectId],
        );

        if (result.rows.length === 0) {
          throw new Error('Project not found');
        }

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error scheduling project:', error);
      throw error;
    }
  }

  /**
   * Publish a project immediately
   */
  static async publishProject(projectId) {
    try {
      const client = await monetizationDb.connect();
      try {
        const result = await client.query(
          `UPDATE video_projects 
           SET status = 'published', updated_at = NOW()
           WHERE id = $1
           RETURNING *`,
          [projectId],
        );

        if (result.rows.length === 0) {
          throw new Error('Project not found');
        }

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error publishing project:', error);
      throw error;
    }
  }

  /**
   * Delete a video project
   */
  static async deleteProject(projectId, memberId) {
    try {
      const client = await monetizationDb.connect();
      try {
        const result = await client.query(
          'DELETE FROM video_projects WHERE id = $1 AND member_id = $2 RETURNING *',
          [projectId, memberId],
        );

        if (result.rows.length === 0) {
          throw new Error('Project not found');
        }

        return result.rows[0];
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error deleting project:', error);
      throw error;
    }
  }
}

module.exports = VideoAssetService;
