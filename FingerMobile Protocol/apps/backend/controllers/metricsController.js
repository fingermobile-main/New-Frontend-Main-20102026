const { socialDb, contentDb } = require('../db');
const logger = require('../utils/logger');

exports.getPlatformInsights = async (req, res) => {
  try {
    // Aggregate platform metrics across DBs
    const usersResult = await socialDb.query('SELECT COUNT(*) as total_users FROM members');
    const postsResult = await contentDb.query('SELECT COUNT(*) as total_posts FROM posts');

    // Simulate other metrics for now as full tables might not exist
    const activeSessions = Math.floor(Math.random() * 1000) + 100;

    res.json({
      message: 'Platform insights retrieved successfully',
      data: {
        total_users: parseInt(usersResult.rows[0].total_users, 10),
        total_posts: parseInt(postsResult.rows[0].total_posts, 10),
        active_sessions: activeSessions,
        platform_health: 'optimal'
      }
    });
  } catch (error) {
    logger.error('Error fetching platform insights:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Aggregate user specific metrics from contentDb
    const userPosts = await contentDb.query(
      'SELECT COUNT(*) as post_count, SUM(likes_count) as total_likes, SUM(comments_count) as total_comments FROM posts WHERE author_id = $1',
      [userId]
    );

    const metrics = userPosts.rows[0];

    res.json({
      message: 'User analytics retrieved successfully',
      data: {
        post_count: parseInt(metrics.post_count || 0, 10),
        total_likes: parseInt(metrics.total_likes || 0, 10),
        total_comments: parseInt(metrics.total_comments || 0, 10),
        engagement_rate: metrics.post_count > 0 ?
          ((parseInt(metrics.total_likes || 0, 10) + parseInt(metrics.total_comments || 0, 10)) / parseInt(metrics.post_count, 10)).toFixed(2) : 0
      }
    });
  } catch (error) {
    logger.error('Error fetching user analytics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
