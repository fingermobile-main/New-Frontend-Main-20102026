/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';
import * as crypto from 'crypto';

/**
 * DeveloperController
 * Developer portal - API management, developer tools
 */

class DeveloperController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }


  /**
   * POST /api/developer/api-keys/generate
   * Generate new API key for developer
   */
  async generateApiKey(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { name, permissions, expiryDays } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Generate API key
      const apiKey = `fm_${crypto.randomBytes(32).toString('hex')}`;
      const keyId = crypto.randomUUID();

      // Calculate expiry
      const expiresAt = expiryDays 
        ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000)
        : null;

      // Store API key in database
      await this.db.query(
        `INSERT INTO api_keys (id, user_id, name, api_key, permissions, expires_at, is_active, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          keyId,
          userId,
          name || 'API Key',
          apiKey,
          permissions || ['read'],
          expiresAt,
          true
        ]
      );

      return res.status(201).json({
        success: true,
        message: 'API key generated successfully',
        data: {
          id: keyId,
          name: name || 'API Key',
          apiKey: apiKey, // Only show once during creation
          permissions: permissions || ['read'],
          createdAt: new Date(),
          expiresAt: expiresAt,
          warning: 'Store this API key securely. It will not be shown again.'
        }
      });
    } catch (error) {
      logger.error('Error in DeveloperController.generateApiKey:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate API key',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/developer/api-keys
   * Get all API keys for current user
   */
  async getApiKeys(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const result = await this.db.query(
        `SELECT id, name, permissions, expires_at, is_active, created_at, last_used_at
         FROM api_keys
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
      );

      return res.json({
        success: true,
        data: result.rows.map(key => ({
          id: key.id,
          name: key.name,
          permissions: key.permissions,
          isActive: key.is_active,
          createdAt: key.created_at,
          expiresAt: key.expires_at,
          lastUsedAt: key.last_used_at
        })),
        count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in DeveloperController.getApiKeys:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get API keys',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * DELETE /api/developer/api-keys/:id
   * Revoke/Delete API key
   */
  async revokeApiKey(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const result = await this.db.query(
        `DELETE FROM api_keys 
         WHERE id = $1 AND user_id = $2
         RETURNING id`,
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'API key not found'
        });
      }

      return res.json({
        success: true,
        message: 'API key revoked successfully'
      });
    } catch (error) {
      logger.error('Error in DeveloperController.revokeApiKey:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to revoke API key',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * PUT /api/developer/api-keys/:id
   * Update API key permissions or name
   */
  async updateApiKey(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const { name, permissions } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 2;

      if (name !== undefined) {
        updates.push(`name = $${paramCount}`);
        values.push(name);
        paramCount++;
      }

      if (permissions !== undefined) {
        updates.push(`permissions = $${paramCount}`);
        values.push(permissions);
        paramCount++;
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No updates provided'
        });
      }

      values.push(id, userId);

      const result = await this.db.query(
        `UPDATE api_keys 
         SET ${updates.join(', ')}, updated_at = NOW()
         WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
         RETURNING id, name, permissions, updated_at`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'API key not found'
        });
      }

      return res.json({
        success: true,
        message: 'API key updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in DeveloperController.updateApiKey:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update API key',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/developer/docs
   * Get API documentation
   */
  async getDocumentation(req: Request, res: Response) {
    try {
      const docs = {
        title: 'FingerMobile Protocol API Documentation',
        version: '1.0.0',
        baseUrl: process.env.API_URL || 'http://localhost:3000/api',
        authentication: {
          type: 'Bearer Token',
          header: 'Authorization: Bearer <your_jwt_token>',
          description: 'Most endpoints require JWT authentication'
        },
        apiKeyAuth: {
          type: 'API Key',
          header: 'X-API-Key: <your_api_key>',
          description: 'Some endpoints support API key authentication'
        },
        endpoints: [
          {
            path: '/api/auth/login',
            method: 'POST',
            description: 'Authenticate user and get JWT token',
            body: {
              email: 'string',
              password: 'string'
            }
          },
          {
            path: '/api/developer/api-keys/generate',
            method: 'POST',
            description: 'Generate new API key',
            auth: 'JWT required',
            body: {
              name: 'string (optional)',
              permissions: 'array (optional)',
              expiryDays: 'number (optional)'
            }
          },
          {
            path: '/api/developer/api-keys',
            method: 'GET',
            description: 'List all API keys',
            auth: 'JWT required'
          }
        ],
        rateLimiting: {
          default: '100 requests per minute',
          authenticated: '1000 requests per minute',
          apiKey: '5000 requests per minute'
        },
        errorCodes: {
          400: 'Bad Request - Invalid input',
          401: 'Unauthorized - Authentication required',
          403: 'Forbidden - Insufficient permissions',
          404: 'Not Found - Resource not found',
          429: 'Too Many Requests - Rate limit exceeded',
          500: 'Internal Server Error'
        }
      };

      return res.json({
        success: true,
        data: docs
      });
    } catch (error) {
      logger.error('Error in DeveloperController.getDocumentation:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get documentation',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/developer/usage
   * Get API usage statistics
   */
  async getUsageStats(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Get API key usage stats
      const result = await this.db.query(
        `SELECT 
          COUNT(*) as total_requests,
          COUNT(CASE WHEN response_status >= 400 THEN 1 END) as error_count,
          AVG(response_time_ms) as avg_response_time
         FROM api_request_logs
         WHERE user_id = $1
         AND created_at >= NOW() - INTERVAL '30 days'`,
        [userId]
      );

      const stats = result.rows[0];

      return res.json({
        success: true,
        data: {
          period: 'Last 30 days',
          totalRequests: parseInt(stats.total_requests) || 0,
          errorCount: parseInt(stats.error_count) || 0,
          averageResponseTime: parseFloat(stats.avg_response_time) || 0,
          errorRate: stats.total_requests > 0 
            ? ((parseInt(stats.error_count) / parseInt(stats.total_requests)) * 100).toFixed(2) + '%'
            : '0%'
        }
      });
    } catch (error) {
      logger.error('Error in DeveloperController.getUsageStats:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get usage statistics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new DeveloperController();
