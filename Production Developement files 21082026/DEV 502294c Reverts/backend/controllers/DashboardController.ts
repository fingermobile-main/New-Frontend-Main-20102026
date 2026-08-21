/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * DashboardController
 * Dashboard analytics - Admin dashboard, metrics, KPIs
 */

class DashboardController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }


  /**
   * GET /api/dashboard
   * Get member dashboard statistics and recent activity
   */
  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const memberId = (req as any).member?.id || req.query.member_id;

      if (!memberId) {
        res.status(400).json({
          success: false,
          message: 'Member ID is required'
        });
        return;
      }

      // Get basic metrics
      const postsCountResult = await this.db.query(
        "SELECT COUNT(*) as count FROM posts WHERE member_id = $1",
        [memberId]
      );

      const followersCountResult = await this.db.query(
        "SELECT COUNT(*) as count FROM follows WHERE followed_id = $1",
        [memberId]
      );

      const followingCountResult = await this.db.query(
        "SELECT COUNT(*) as count FROM follows WHERE follower_id = $1",
        [memberId]
      );

      const likesReceivedResult = await this.db.query(
        `SELECT COUNT(*) as count 
         FROM post_likes pl
         JOIN posts p ON pl.post_id = p.id
         WHERE p.member_id = $1`,
        [memberId]
      );

      // Get recent activities
      const recentActivitiesResult = await this.db.query(
        `SELECT a.*, m.username as actor_name, m.avatar_url as actor_avatar
         FROM activities a
         JOIN users m ON a.actor_id = m.id
         WHERE a.actor_id = $1 OR a.target_id = $1
         ORDER BY a.created_at DESC
         LIMIT 10`,
        [memberId]
      );

      res.json({
        success: true,
        metrics: {
          posts_count: parseInt(postsCountResult.rows[0]?.count || '0'),
          followers_count: parseInt(followersCountResult.rows[0]?.count || '0'),
          following_count: parseInt(followingCountResult.rows[0]?.count || '0'),
          likes_received_count: parseInt(likesReceivedResult.rows[0]?.count || '0')
        },
        activities: recentActivitiesResult.rows.map((activity: any) => ({
          id: activity.id,
          type: activity.activity_type,
          title: activity.description || `${activity.activity_type} activity`,
          subtitle: `Action on ${activity.content_type}`,
          timestamp: activity.created_at,
          actor: {
            name: activity.actor_name,
            avatar: activity.actor_avatar
          }
        }))
      });

    } catch (err: any) {
      logger.error("Dashboard error:", err);
      res.status(500).json({
        success: false,
        message: "Server error fetching dashboard data",
        error: err.message
      });
    }
  }

}

export default new DashboardController();
