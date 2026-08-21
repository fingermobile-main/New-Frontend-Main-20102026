import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * CamusController
 * Creative/media platform - Projects, media management, creative tools
 */

class CamusController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * GET /api/camus/projects
   * Get creative projects with pagination and filtering
   */
  async getProjects(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 50, offset = 0, category, status, creatorId } = req.query;

      const whereClause: string[] = ['is_published = true'];
      const queryParams: any[] = [];
      let paramCount = 1;

      if (category) {
        whereClause.push(`category = $${paramCount}`);
        queryParams.push(category);
        paramCount++;
      }

      if (status) {
        whereClause.push(`status = $${paramCount}`);
        queryParams.push(status);
        paramCount++;
      }

      if (creatorId) {
        whereClause.push(`creator_id = $${paramCount}`);
        queryParams.push(creatorId);
        paramCount++;
      }

      const whereSQL = whereClause.join(' AND ');

      const query = `
        SELECT 
          p.*,
          u.name as creator_username,
          u.avatar_url as creator_avatar,
          COUNT(DISTINCT l.id) as likes_count,
          COUNT(DISTINCT v.id) as views_count
         FROM camus_projects p
         JOIN users u ON p.creator_id = u.id
         LEFT JOIN likes l ON l.target_id = p.id AND l.target_type = 'project'
         LEFT JOIN camus_views v ON v.project_id = p.id
         WHERE ${whereSQL}
         GROUP BY p.id, u.name, u.avatar_url
         ORDER BY p.created_at DESC
         LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `;
      
      const result = await this.db.query(query, [...queryParams, parseInt(limit as string), parseInt(offset as string)]);

      res.json({
        success: true,
        data: result.rows.map((project: any) => ({
          ...project,
          likesCount: parseInt(project.likes_count),
          viewsCount: parseInt(project.views_count)
        })),
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('CamusController.getProjects error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get projects',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/camus/projects
   * Create new creative project
   */
  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { title, description, category, mediaUrl, thumbnailUrl, tags } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      if (!title || !mediaUrl) {
        res.status(400).json({
          success: false,
          message: 'Title and media URL are required'
        });
        return;
      }

      const insertQuery = `
        INSERT INTO camus_projects (
          creator_id, title, description, category, media_url, thumbnail_url, tags, is_published, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())
        RETURNING *
      `;
      
      const result = await this.db.query(insertQuery, [
        userId, title, description, category, mediaUrl, thumbnailUrl, JSON.stringify(tags || [])
      ]);

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('CamusController.createProject error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create project',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/camus/projects/:id
   * Get single project by ID
   */
  async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const query = `
        SELECT 
          p.*,
          u.name as creator_username,
          u.avatar_url as creator_avatar
        FROM camus_projects p
        JOIN users u ON p.creator_id = u.id
        WHERE p.id = $1
      `;
      
      const result = await this.db.query(query, [id]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Project not found'
        });
        return;
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('CamusController.getProjectById error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get project',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * PUT /api/camus/projects/:id
   * Update project
   */
  async updateProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const { title, description, category, mediaUrl, thumbnailUrl, tags, isPublished } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const updateQuery = `
        UPDATE camus_projects 
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            category = COALESCE($3, category),
            media_url = COALESCE($4, media_url),
            thumbnail_url = COALESCE($5, thumbnail_url),
            tags = COALESCE($6, tags),
            is_published = COALESCE($7, is_published),
            updated_at = NOW()
        WHERE id = $8 AND creator_id = $9
        RETURNING *
      `;
      
      const result = await this.db.query(updateQuery, [
        title, description, category, mediaUrl, thumbnailUrl, 
        tags ? JSON.stringify(tags) : null, isPublished, id, userId
      ]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Project not found or unauthorized'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('CamusController.updateProject error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update project',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * DELETE /api/camus/projects/:id
   * Delete project
   */
  async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const deleteQuery = 'DELETE FROM camus_projects WHERE id = $1 AND creator_id = $2 RETURNING id';
      const result = await this.db.query(deleteQuery, [id, userId]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Project not found or unauthorized'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      logger.error('CamusController.deleteProject error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete project',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/camus/projects/:id/like
   * Like a project
   */
  async likeProject(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id: projectId } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const insertQuery = `
        INSERT INTO likes (user_id, target_id, target_type, created_at)
        VALUES ($1, $2, 'project', NOW())
        ON CONFLICT (user_id, target_id, target_type) DO NOTHING
      `;
      
      await this.db.query(insertQuery, [userId, projectId]);

      res.json({
        success: true,
        message: 'Project liked'
      });
    } catch (error) {
      logger.error('CamusController.likeProject error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to like project',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/camus/categories
   * Get all project categories
   */
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const query = `
        SELECT DISTINCT category, COUNT(*) as project_count
        FROM camus_projects
        WHERE is_published = true
        GROUP BY category
        ORDER BY project_count DESC
      `;
      
      const result = await this.db.query(query);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      logger.error('CamusController.getCategories error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get categories',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/camus/trending
   * Get trending projects
   */
  async getTrending(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 20 } = req.query;

      const query = `
        SELECT 
          p.*,
          u.name as creator_username,
          u.avatar_url as creator_avatar,
          COUNT(DISTINCT l.id) as likes_count,
          COUNT(DISTINCT v.id) as views_count
        FROM camus_projects p
        JOIN users u ON p.creator_id = u.id
        LEFT JOIN likes l ON l.target_id = p.id AND l.target_type = 'project'
        LEFT JOIN camus_views v ON v.project_id = p.id
        WHERE p.is_published = true
          AND p.created_at > NOW() - INTERVAL '7 days'
        GROUP BY p.id, u.name, u.avatar_url
        ORDER BY likes_count DESC, views_count DESC
        LIMIT $1
      `;
      
      const result = await this.db.query(query, [parseInt(limit as string)]);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      logger.error('CamusController.getTrending error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get trending projects',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new CamusController();
