const { contentDb } = require('../db');
const logger = require('../utils/logger');
const nexusgnnService = require('../services/nexusgnn');

exports.getDiscoverFeed = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;

    // Fully wired: if user context is available and NexusGNN is enabled, serve personalized GNN feed
    if (userId) {
      try {
        const matches = await nexusgnnService.findMatches(userId, 'post', 50);
        if (matches && matches.length > 0) {
          return res.json({
            message: 'Discover feed retrieved successfully via NexusGNN',
            algorithm: 'NexusGNN-PinSage-MetaGNN',
            data: matches
          });
        }
      } catch (gnnErr) {
        logger.warn('NexusGNN matching fallback to popularity query:', gnnErr.message);
      }
    }

    // Baseline algorithmic feed for unauthenticated or cold-start users
    const result = await contentDb.query(
      `SELECT id, content, author_id, likes_count, comments_count, created_at 
       FROM posts 
       WHERE created_at > CURRENT_DATE - INTERVAL '30 days'
       ORDER BY (COALESCE(likes_count, 0) * 2) + COALESCE(comments_count, 0) DESC, created_at DESC 
       LIMIT 50`
    );

    res.json({
      message: 'Discover feed retrieved successfully',
      algorithm: 'PopularityBaseline',
      data: result.rows
    });
  } catch (error) {
    logger.error('Error fetching discover feed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
