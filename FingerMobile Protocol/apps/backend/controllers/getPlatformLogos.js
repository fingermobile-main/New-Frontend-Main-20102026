const { connectDB } = require('../database/connection'); // Adjust path as needed
const logger = require('../utils/logger'); // Adjust path as needed

/**
 * Fetches all active platform logos from the database.
 * @param {*} req The Express request object.
 * @param {*} res The Express response object.
 */
async function getPlatformLogos(req, res) {
  const client = await connectDB(); // Get DB client instance (e.g., Knex or raw pg Client)

  try {
    logger.info('Fetching platform logos from database.');

    // Assuming 'client' is a Knex instance or similar query builder
    // Query for active logos, ordered by display_order
    const logos = await client('platform_logos')
      .select('name', 'alt_text', 'logo_url', 'platform_key', 'display_order')
      .where('is_active', true)
      .orderBy('display_order', 'asc');

    logger.info(`Successfully fetched ${logos.length} active platform logos.`);

    res.status(200).json({
      success: true,
      message: 'Platform logos retrieved successfully.',
      data: logos,
    });
  } catch (error) {
    logger.error('Error fetching platform logos:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error occurred while fetching platform logos.',
      error: error.message, // In production, consider not sending raw error messages
    });
  } finally {
    // Ensure the database client connection is released back to the pool if using raw pg
    // await client.release(); // Uncomment if using raw pg.Client from a pool
  }
}

module.exports = { getPlatformLogos };
