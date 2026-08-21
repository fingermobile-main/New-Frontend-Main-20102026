import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * UconnectionsController
 * Social connections management - Send requests, accept/decline, manage network
 */

class UconnectionsController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * POST /api/connections/request
   * Send connection request
   */
  async sendRequest(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { targetUserId, message } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      if (!targetUserId) {
        res.status(400).json({
          success: false,
          message: 'Target user ID is required'
        });
        return;
      }

      if (userId === targetUserId) {
        res.status(400).json({
          success: false,
          message: 'Cannot connect with yourself'
        });
        return;
      }

      // Check if already connected or request pending
      const existingQuery = `
        SELECT id, status FROM connections 
        WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
      `;
      
      const existingResult = await this.db.query(existingQuery, [userId, targetUserId]);

      if (existingResult.rows.length > 0) {
        const status = existingResult.rows[0].status;
        if (status === 'accepted') {
          res.status(400).json({
            success: false,
            message: 'Already connected'
          });
          return;
        } else if (status === 'pending') {
          res.status(400).json({
            success: false,
            message: 'Connection request already pending'
          });
          return;
        }
      }

      const insertQuery = `
        INSERT INTO connections (sender_id, receiver_id, message, status, created_at)
        VALUES ($1, $2, $3, 'pending', NOW())
      `;
      
      await this.db.query(insertQuery, [userId, targetUserId, message || null]);

      res.status(201).json({
        success: true,
        message: 'Connection request sent'
      });
    } catch (error) {
      logger.error('UconnectionsController.sendRequest error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send request',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/connections/:id/accept
   * Accept connection request
   */
  async acceptRequest(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id: connectionId } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const updateQuery = `
        UPDATE connections 
        SET status = 'accepted', accepted_at = NOW()
        WHERE id = $1 AND receiver_id = $2 AND status = 'pending'
        RETURNING *
      `;
      
      const result = await this.db.query(updateQuery, [connectionId, userId]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Connection request not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Connection accepted'
      });
    } catch (error) {
      logger.error('UconnectionsController.acceptRequest error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to accept request',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/connections/:id/decline
   * Decline connection request
   */
  async declineRequest(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id: connectionId } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const updateQuery = `
        UPDATE connections 
        SET status = 'declined'
        WHERE id = $1 AND receiver_id = $2 AND status = 'pending'
        RETURNING *
      `;
      
      const result = await this.db.query(updateQuery, [connectionId, userId]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Connection request not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Connection request declined'
      });
    } catch (error) {
      logger.error('UconnectionsController.declineRequest error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to decline request',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * DELETE /api/connections/:id
   * Remove connection
   */
  async removeConnection(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id: connectionId } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const deleteQuery = `
        DELETE FROM connections 
        WHERE id = $1 AND (sender_id = $2 OR receiver_id = $2)
        RETURNING *
      `;
      
      const result = await this.db.query(deleteQuery, [connectionId, userId]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Connection not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Connection removed'
      });
    } catch (error) {
      logger.error('UconnectionsController.removeConnection error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove connection',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/connections
   * Get user's connections
   */
  async getConnections(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = (page - 1) * limit;

      const query = `
        SELECT c.*, 
               u.id as user_id,
               u.name as user_name,
               u.email as user_email,
               u.avatar_url,
               CASE 
                 WHEN c.sender_id = $1 THEN 'sent'
                 ELSE 'received'
               END as direction
        FROM connections c
        JOIN users u ON (c.receiver_id = u.id AND c.sender_id = $1) 
                     OR (c.sender_id = u.id AND c.receiver_id = $1)
        WHERE (c.sender_id = $1 OR c.receiver_id = $1)
          AND c.status = 'accepted'
        ORDER BY c.accepted_at DESC
        LIMIT $2 OFFSET $3
      `;
      
      const result = await this.db.query(query, [userId, limit, offset]);

      const countQuery = `
        SELECT COUNT(*) as total
        FROM connections
        WHERE (sender_id = $1 OR receiver_id = $1)
          AND status = 'accepted'
      `;
      
      const countResult = await this.db.query(countQuery, [userId]);
      const total = parseInt(countResult.rows[0]?.total || '0');

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      });
    } catch (error) {
      logger.error('UconnectionsController.getConnections error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve connections',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/connections/pending
   * Get pending connection requests
   */
  async getPendingRequests(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const query = `
        SELECT c.*, 
               u.id as sender_id,
               u.name as sender_name,
               u.email as sender_email,
               u.avatar_url
        FROM connections c
        JOIN users u ON c.sender_id = u.id
        WHERE c.receiver_id = $1 AND c.status = 'pending'
        ORDER BY c.created_at DESC
      `;
      
      const result = await this.db.query(query, [userId]);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      logger.error('UconnectionsController.getPendingRequests error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve pending requests',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/connections/suggestions
   * Get connection suggestions
   */
  async getSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

      // Suggest users with mutual connections or similar interests
      const query = `
        SELECT DISTINCT u.id, u.name, u.email, u.avatar_url, u.bio,
               COUNT(DISTINCT c2.id) as mutual_connections
        FROM users u
        LEFT JOIN connections c1 ON u.id = c1.receiver_id OR u.id = c1.sender_id
        LEFT JOIN connections c2 ON 
          (c2.sender_id = u.id AND c2.receiver_id IN (
            SELECT CASE WHEN c3.sender_id = $1 THEN c3.receiver_id ELSE c3.sender_id END
            FROM connections c3
            WHERE (c3.sender_id = $1 OR c3.receiver_id = $1) AND c3.status = 'accepted'
          ))
          OR
          (c2.receiver_id = u.id AND c2.sender_id IN (
            SELECT CASE WHEN c3.sender_id = $1 THEN c3.receiver_id ELSE c3.sender_id END
            FROM connections c3
            WHERE (c3.sender_id = $1 OR c3.receiver_id = $1) AND c3.status = 'accepted'
          ))
        WHERE u.id != $1
          AND NOT EXISTS (
            SELECT 1 FROM connections c4
            WHERE (c4.sender_id = $1 AND c4.receiver_id = u.id)
               OR (c4.receiver_id = $1 AND c4.sender_id = u.id)
          )
        GROUP BY u.id, u.name, u.email, u.avatar_url, u.bio
        HAVING COUNT(DISTINCT c2.id) > 0
        ORDER BY mutual_connections DESC, RANDOM()
        LIMIT $2
      `;
      
      const result = await this.db.query(query, [userId, limit]);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      logger.error('UconnectionsController.getSuggestions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve suggestions',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/connections/stats
   * Get connection statistics
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const statsQuery = `
        SELECT 
          COUNT(*) FILTER (WHERE status = 'accepted' AND (sender_id = $1 OR receiver_id = $1)) as total_connections,
          COUNT(*) FILTER (WHERE status = 'pending' AND receiver_id = $1) as pending_received,
          COUNT(*) FILTER (WHERE status = 'pending' AND sender_id = $1) as pending_sent,
          COUNT(*) FILTER (WHERE status = 'accepted' AND created_at >= NOW() - INTERVAL '30 days') as recent_connections
        FROM connections
        WHERE sender_id = $1 OR receiver_id = $1
      `;
      
      const result = await this.db.query(statsQuery, [userId]);

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('UconnectionsController.getStats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve statistics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new UconnectionsController();
