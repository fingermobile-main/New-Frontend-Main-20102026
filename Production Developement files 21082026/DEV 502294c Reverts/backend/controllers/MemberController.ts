import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * MemberController
 * Member management - Profiles, membership tiers, benefits, status
 */

class MemberController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * GET /api/members/profile
   * Get current user's member profile
   */
  async getProfile(req: Request, res: Response): Promise<void> {
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
        SELECT 
          u.id,
          u.name,
          u.email,
          u.avatar_url,
          u.bio,
          m.membership_tier,
          m.joined_at,
          m.points_balance,
          m.level,
          COUNT(DISTINCT c.id) as connection_count,
          COUNT(DISTINCT p.id) as post_count,
          COUNT(DISTINCT l.id) as like_given_count
        FROM users u
        LEFT JOIN member_profiles m ON u.id = m.user_id
        LEFT JOIN connections c ON (c.sender_id = u.id OR c.receiver_id = u.id) AND c.status = 'accepted'
        LEFT JOIN posts p ON p.author_id = u.id
        LEFT JOIN likes l ON l.user_id = u.id
        WHERE u.id = $1
        GROUP BY u.id, m.membership_tier, m.joined_at, m.points_balance, m.level
      `;
      
      const result = await this.db.query(query, [userId]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Member profile not found'
        });
        return;
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('MemberController.getProfile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve profile',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * PUT /api/members/profile
   * Update member profile
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { bio, avatarUrl, displayName } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const updateQuery = `
        UPDATE users 
        SET name = COALESCE($1, name),
            bio = COALESCE($2, bio),
            avatar_url = COALESCE($3, avatar_url),
            updated_at = NOW()
        WHERE id = $4
        RETURNING id, name, email, bio, avatar_url
      `;
      
      const result = await this.db.query(updateQuery, [displayName, bio, avatarUrl, userId]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('MemberController.updateProfile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/members/tiers
   * Get all membership tiers
   */
  async getTiers(req: Request, res: Response): Promise<void> {
    try {
      const query = `
        SELECT * FROM membership_tiers
        ORDER BY level ASC
      `;
      
      const result = await this.db.query(query);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      logger.error('MemberController.getTiers error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve membership tiers',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/members/upgrade
   * Upgrade membership tier
   */
  async upgradeMembership(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { tierId } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      if (!tierId) {
        res.status(400).json({
          success: false,
          message: 'Tier ID is required'
        });
        return;
      }

      // Check tier exists
      const tierQuery = 'SELECT id, name, level, price FROM membership_tiers WHERE id = $1';
      const tierResult = await this.db.query(tierQuery, [tierId]);

      if (tierResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Membership tier not found'
        });
        return;
      }

      const tier = tierResult.rows[0];

      // Update membership
      const updateQuery = `
        INSERT INTO member_profiles (user_id, membership_tier, upgraded_at, points_balance)
        VALUES ($1, $2, NOW(), 0)
        ON CONFLICT (user_id) 
        DO UPDATE SET membership_tier = $2, upgraded_at = NOW()
        RETURNING *
      `;
      
      const result = await this.db.query(updateQuery, [userId, tier.name]);

      res.json({
        success: true,
        message: `Upgraded to ${tier.name} membership`,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('MemberController.upgradeMembership error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upgrade membership',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/members/benefits
   * Get membership benefits
   */
  async getBenefits(req: Request, res: Response): Promise<void> {
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
        SELECT mb.*, mt.name as tier_name
        FROM membership_benefits mb
        JOIN membership_tiers mt ON mb.tier_id = mt.id
        WHERE mt.level <= (
          SELECT COALESCE(membership_tier, 'free') 
          FROM member_profiles 
          WHERE user_id = $1
        )
        ORDER BY mt.level DESC, mb.priority ASC
      `;
      
      const result = await this.db.query(query, [userId]);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      logger.error('MemberController.getBenefits error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve benefits',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/members/:userId
   * Get public member profile
   */
  async getPublicProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const query = `
        SELECT 
          u.id,
          u.name,
          u.avatar_url,
          u.bio,
          m.membership_tier,
          m.joined_at,
          m.level,
          COUNT(DISTINCT c.id) as connection_count,
          COUNT(DISTINCT p.id) as post_count
        FROM users u
        LEFT JOIN member_profiles m ON u.id = m.user_id
        LEFT JOIN connections c ON (c.sender_id = u.id OR c.receiver_id = u.id) AND c.status = 'accepted'
        LEFT JOIN posts p ON p.author_id = u.id AND p.status = 'published'
        WHERE u.id = $1
        GROUP BY u.id, m.membership_tier, m.joined_at, m.level
      `;
      
      const result = await this.db.query(query, [userId]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Member not found'
        });
        return;
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('MemberController.getPublicProfile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve member profile',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/members/activity
   * Get member activity feed
   */
  async getActivity(req: Request, res: Response): Promise<void> {
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
        SELECT 
          'post' as activity_type,
          p.id as item_id,
          p.title as content,
          p.created_at,
          NULL as metadata
        FROM posts p
        WHERE p.author_id = $1
        
        UNION ALL
        
        SELECT 
          'comment' as activity_type,
          c.id as item_id,
          c.content,
          c.created_at,
          NULL as metadata
        FROM comments c
        WHERE c.author_id = $1
        
        UNION ALL
        
        SELECT 
          'like' as activity_type,
          l.target_id as item_id,
          l.target_type as content,
          l.created_at,
          NULL as metadata
        FROM likes l
        WHERE l.user_id = $1
        
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;
      
      const result = await this.db.query(query, [userId, limit, offset]);

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: result.rows.length
        }
      });
    } catch (error) {
      logger.error('MemberController.getActivity error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve activity',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new MemberController();
