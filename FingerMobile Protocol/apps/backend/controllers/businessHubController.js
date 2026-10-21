const pool = require('../db');
const logger = require('../utils/logger');

exports.getBusinessMetrics = async (req, res) => {
  try {
    const userId = req.user.id;

    // First find the business profile for this user
    const profileResult = await pool.query(
      'SELECT id FROM business_profiles WHERE member_id = $1',
      [userId]
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ message: 'Business profile not found for this user.' });
    }

    const businessId = profileResult.rows[0].id;

    // Fetch the metrics for this business
    const metricsResult = await pool.query(
      'SELECT * FROM business_metrics WHERE business_id = $1 ORDER BY recorded_at DESC LIMIT 30',
      [businessId]
    );

    res.json({
      message: 'Business metrics retrieved successfully',
      data: metricsResult.rows
    });
  } catch (error) {
    logger.error('Error fetching business metrics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateBusinessProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { company_name, industry, description, website_url, logo_url } = req.body;

    if (!company_name) {
      return res.status(400).json({ message: 'Company name is required' });
    }

    const result = await pool.query(
      `INSERT INTO business_profiles (member_id, company_name, industry, description, website_url, logo_url, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       ON CONFLICT (member_id) DO UPDATE SET
       company_name = EXCLUDED.company_name,
       industry = EXCLUDED.industry,
       description = EXCLUDED.description,
       website_url = EXCLUDED.website_url,
       logo_url = EXCLUDED.logo_url,
       updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, company_name, industry, description, website_url, logo_url]
    );

    res.json({
      message: 'Business profile updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error updating business profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
