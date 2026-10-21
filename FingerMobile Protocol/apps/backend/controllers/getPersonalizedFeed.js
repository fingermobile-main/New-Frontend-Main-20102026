const logger = require('../utils/logger');
const { Pool } = require('pg');

// Assuming the pool is configured similarly to other controllers
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'fingermobile_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

/**
 * Controller to fetch a personalized product feed for a user.
 * This is a simplified version. A full implementation would involve ML models.
 * @param {*} req - Express request object containing the user ID in headers or JWT payload.
 * @param {*} res - Express response object.
 */
const getPersonalizedFeed = async (req, res) => {
  // In a real app, the user ID would come from req.user after authentication middleware.
  // For now, let's assume it comes from a query param for testing.
  const userId = req.query.userId || req.user?.id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required for personalization.' });
  }

  const client = await pool.connect();

  try {
    // Step 1: Get user's profile data (measurements, preferences)
    // This assumes a table `user_measurements` exists.
    const userMeasurementsQuery = `
      SELECT bust, waist, hip, inseam, shoulder_width, sleeve_length, preferred_brands, preferred_categories
      FROM user_measurements
      WHERE user_id = $1;
    `;
    const userMeasurementsResult = await client.query(userMeasurementsQuery, [userId]);
    const userData = userMeasurementsResult.rows[0] || {};

    // Step 2: Get user's interaction history (views, purchases, likes)
    // This assumes a table `user_interactions` exists.
    const userInteractionsQuery = `
      SELECT product_id, interaction_type, timestamp
      FROM user_interactions
      WHERE user_id = $1
      ORDER BY timestamp DESC
      LIMIT 50; -- Get last 50 interactions
    `;
    const userInteractionsResult = await client.query(userInteractionsQuery, [userId]);
    const interactions = userInteractionsResult.rows;

    // Step 3: Generate a simple feed based on preferences and interactions
    // This is a placeholder query. A real one would be much more complex or handled by an ML service.
    let feedQuery = `
      SELECT DISTINCT p.id, p.name, p.description, p.base_price AS price, p.images, p.brand, p.category_id, p.store_id
      FROM products p
      JOIN product_variants pv ON p.id = pv.product_id
      WHERE p.is_active = TRUE
      AND pv.is_active = TRUE
    `;

    const queryParams = [];
    let paramIndex = 1;

    // Filter by user's preferred categories (if any)
    if (userData.preferred_categories && Array.isArray(userData.preferred_categories) && userData.preferred_categories.length > 0) {
      feedQuery += ` AND p.category_id = ANY($${paramIndex})`;
      queryParams.push(userData.preferred_categories);
      paramIndex++;
    }

    // Boost products similar to recently interacted ones
    if (interactions.length > 0) {
      const recentProductIds = interactions.slice(0, 10).map(i => i.product_id); // Last 10 products interacted with
      if (recentProductIds.length > 0) {
        feedQuery += ` AND p.id = ANY($${paramIndex})`;
        queryParams.push(recentProductIds);
        paramIndex++;
      }
    }

    // Filter by brand if user has preferences
    if (userData.preferred_brands && Array.isArray(userData.preferred_brands) && userData.preferred_brands.length > 0) {
      feedQuery += ` AND p.brand = ANY($${paramIndex})`;
      queryParams.push(userData.preferred_brands);
      paramIndex++;
    }

    feedQuery += ' ORDER BY RANDOM() LIMIT 20;'; // Randomly order and limit results

    const feedResult = await client.query(feedQuery, queryParams);

    res.json({
      user_id: userId,
      generated_at: new Date(),
      feed: feedResult.rows
    });
  } catch (error) {
    logger.error('Database error in getPersonalizedFeed:', error);
    res.status(500).json({ error: 'Internal server error.' });
  } finally {
    client.release();
  }
};

module.exports = { getPersonalizedFeed };
