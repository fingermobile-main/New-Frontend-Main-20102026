import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'fingermobile_identity_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

/**
 * UserController - Handles user-related operations
 * Implements CRUD operations for user management
 */
export class UserController {
  
  /**
   * Get user profile by ID
   */
  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        res.status(400).json({ 
          success: false, 
          error: 'User ID is required' 
        });
        return;
      }
      
      // Query users table for profile data
      const query = `
        SELECT id, username, email, first_name, last_name, 
               profile_picture_url, bio, phone, date_of_birth, 
               gender, location, website, is_verified, is_active, 
               role, created_at, updated_at, last_login_at
        FROM users 
        WHERE id = $1
      `;
      
      const result = await pool.query(query, [userId]);
      
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }
      
      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error getting user profile:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve user profile' 
      });
    }
  }
  
  /**
   * Update user profile
   */
  async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const updates = req.body;
      
      if (!userId) {
        res.status(400).json({ 
          success: false, 
          error: 'User ID is required' 
        });
        return;
      }
      
      // Build dynamic update query with allowed fields
      const allowedFields = [
        'first_name', 'last_name', 'profile_picture_url', 'bio',
        'phone', 'date_of_birth', 'gender', 'location', 'website'
      ];
      
      const setClauses: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;
      
      Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key)) {
          setClauses.push(`${key} = $${paramIndex}`);
          values.push(updates[key]);
          paramIndex++;
        }
      });
      
      if (setClauses.length === 0) {
        res.status(400).json({
          success: false,
          error: 'No valid fields to update'
        });
        return;
      }
      
      setClauses.push('updated_at = NOW()');
      values.push(userId);
      
      const query = `
        UPDATE users 
        SET ${setClauses.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING id, username, email, first_name, last_name, 
                  profile_picture_url, bio, phone, updated_at
      `;
      
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }
      
      res.json({
        success: true,
        data: result.rows[0],
        message: 'User profile updated successfully'
      });
    } catch (error) {
      logger.error('Error updating user profile:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update user profile' 
      });
    }
  }
  
  /**
   * Delete user account
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        res.status(400).json({ 
          success: false, 
          error: 'User ID is required' 
        });
        return;
      }
      
      // Delete user (CASCADE will handle related records)
      const query = `DELETE FROM users WHERE id = $1 RETURNING id, username`;
      const result = await pool.query(query, [userId]);
      
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'User account deleted successfully',
        data: {
          deletedUserId: result.rows[0].id,
          username: result.rows[0].username
        }
      });
    } catch (error) {
      logger.error('Error deleting user:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete user account' 
      });
    }
  }
  
  /**
   * List all users (admin only)
   */
  async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const offset = (page - 1) * limit;
      
      // Get total count
      const countQuery = 'SELECT COUNT(*) as total FROM users';
      const countResult = await pool.query(countQuery);
      const total = parseInt(countResult.rows[0].total);
      
      // Get paginated users (exclude sensitive data)
      const query = `
        SELECT id, username, email, first_name, last_name, 
               profile_picture_url, is_verified, is_active, 
               role, created_at, last_login_at
        FROM users 
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
      `;
      
      const result = await pool.query(query, [limit, offset]);
      
      res.json({
        success: true,
        data: {
          users: result.rows,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      logger.error('Error listing users:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve users' 
      });
    }
  }
  
  /**
   * Get user settings
   */
  async getUserSettings(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        res.status(400).json({ 
          success: false, 
          error: 'User ID is required' 
        });
        return;
      }
      
      // Check if user exists
      const userQuery = 'SELECT id FROM users WHERE id = $1';
      const userResult = await pool.query(userQuery, [userId]);
      
      if (userResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }
      
      // TODO: Create user_settings table and implement settings retrieval
      // For now, return default settings structure
      res.json({
        success: true,
        data: {
          userId,
          settings: {
            notifications: {
              email: true,
              push: true,
              sms: false
            },
            privacy: {
              profile_visibility: 'public',
              show_email: false,
              show_phone: false
            },
            preferences: {
              language: 'en',
              timezone: 'UTC',
              theme: 'light'
            }
          }
        }
      });
    } catch (error) {
      logger.error('Error getting user settings:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve user settings' 
      });
    }
  }
}

export default new UserController();
