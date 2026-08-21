/**
 * AdvertisingService
 * Ad campaign management with targeting, bidding, and impression/click tracking
 */

const pool = require('../database/connection');

class AdvertisingService {
  /**
   * Create ad campaign
   */
  async createCampaign(advertiserId, options = {}) {
    try {
      const { name, budget, bid_strategy, targeting_rules, start_date, end_date } = options;
      
      const query = `
        INSERT INTO ad_campaigns (
          advertiser_id, name, total_budget, bid_strategy,
          targeting_rules, start_date, end_date, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', NOW())
        RETURNING *
      `;
      
      const result = await pool.query(query, [
        advertiserId,
        name,
        budget,
        bid_strategy,
        JSON.stringify(targeting_rules),
        start_date,
        end_date
      ]);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating ad campaign:', error);
      throw error;
    }
  }
  
  /**
   * Track ad impression
   */
  async trackImpression(adId, userId, context = {}) {
    try {
      await pool.query(
        `INSERT INTO ad_impressions (ad_id, user_id, context, served_at)
         VALUES ($1, $2, $3, NOW())`,
        [adId, userId, JSON.stringify(context)]
      );
      
      // Update campaign metrics
      await this.updateCampaignMetrics(adId);
    } catch (error) {
      logger.error('Error tracking impression:', error);
    }
  }
  
  /**
   * Track ad click
   */
  async trackClick(adId, userId) {
    try {
      await pool.query(
        `INSERT INTO ad_clicks (ad_id, user_id, clicked_at)
         VALUES ($1, $2, NOW())`,
        [adId, userId]
      );
      
      await this.updateCampaignMetrics(adId);
    } catch (error) {
      logger.error('Error tracking click:', error);
    }
  }
  
  /**
   * Update campaign metrics
   */
  async updateCampaignMetrics(adId) {
    try {
      await pool.query(
        `UPDATE ad_campaigns ac
         SET 
           total_impressions = (SELECT COUNT(*) FROM ad_impressions ai WHERE ai.ad_id = ac.id),
           total_clicks = (SELECT COUNT(*) FROM ad_clicks acl WHERE acl.ad_id = ac.id),
           ctr = CASE 
             WHEN (SELECT COUNT(*) FROM ad_impressions WHERE ad_id = ac.id) > 0
             THEN (SELECT COUNT(*) FROM ad_clicks WHERE ad_id = ac.id)::FLOAT / 
                  (SELECT COUNT(*) FROM ad_impressions WHERE ad_id = ac.id) * 100
             ELSE 0
           END
         WHERE ac.id = $1`,
        [adId]
      );
    } catch (error) {
      logger.error('Error updating campaign metrics:', error);
    }
  }
}

module.exports = new AdvertisingService();
