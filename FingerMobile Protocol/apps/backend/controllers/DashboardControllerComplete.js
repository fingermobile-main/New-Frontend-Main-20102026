/**
 * DashboardController - Extracted from dashboard.js
 * Date: June 9, 2026
 */

const { identityDb, socialDb, contentDb } = require('../db');
const logger = require('../utils/logger');

class DashboardController {

  async getDashboard(req, res) {
    try {
      const memberId = req.member.id;

      // 1. Get basic metrics from socialDb and identityDb
      // Posts count
      const postsCountResult = await contentDb.query(
        'SELECT COUNT(*) as count FROM posts WHERE member_id = $1' [memberId]
      );

      // Followers count
      const followersCountResult = await identityDb.query(
        'SELECT COUNT(*) as count FROM follows WHERE followed_id = $1' [memberId]
      );

      // Following count
      const followingCountResult = await identityDb.query(
        'SELECT COUNT(*) as count FROM follows WHERE follower_id = $1',
        [memberId]
      );

      // Likes received count
      const likesReceivedResult = await contentDb.query(
        `SELECT COUNT(*) as count 
         FROM post_likes pl
         JOIN posts p ON pl.post_id = p.id
         WHERE p.member_id = $1`,
        [memberId]
      );

      // 2. Get recent activities
      const recentActivitiesResult = await socialDb.query(
        `SELECT a.*, m.membername as actor_name, m.profile_picture_url as actor_avatar
         FROM activities a
         JOIN members m ON a.actor_id = m.id
         WHERE a.actor_id = $1 OR a.target_id = $1
         ORDER BY a.created_at DESC
         LIMIT 10`,
        [memberId]
      );

      // 3. Format response to match mobile app expectations
      res.json({
        success: true,
        metrics: {
          posts_count: parseInt(postsCountResult.rows[0].count),
          followers_count: parseInt(followersCountResult.rows[0].count),
          following_count: parseInt(followingCountResult.rows[0].count),
          likes_received_count: parseInt(likesReceivedResult.rows[0].count)
        },
        activities: recentActivitiesResult.rows.map(activity => ({
          id: activity.id,
          type: activity.activity_type,
          title: activity.description || `${activity.activity_type} activity`,
          subtitle: `Action on ${activity.content_type}`,
          timestamp: activity.created_at,
          actor: {
            name: activity.actor_name, avatar: activity.actor_avatar
          }
        }))
      });

    } catch (err) {
      logger.error('Dashboard error:', err);
      res.status(500).json({
        success: false, message: 'Server error fetching dashboard data',
        error: err.message
      });
    }
  }
}

module.exports = new DashboardController();
