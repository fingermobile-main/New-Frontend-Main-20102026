/* eslint-disable no-console */
const db = require('../db');

class RevenueController {
  // Create a new subscription for a user
  static async createSubscription(req, res) {
    try {
      const { userId, tier, amount, billingCycle } = req.body;
      if (!userId || !tier || !amount) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // 30 days from now for basic math
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const query = `
        INSERT INTO subscriptions (user_id, tier, amount, billing_cycle, expires_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const values = [userId, tier, amount, billingCycle || 'MONTHLY', expiresAt];
      const result = await db.query(query, values);

      // Also log the transaction
      const walletQuery = 'SELECT wallet_id FROM user_wallets WHERE user_id = $1';
      const walletResult = await db.query(walletQuery, [userId]);
      if (walletResult.rows.length > 0) {
        const walletId = walletResult.rows[0].wallet_id;
        await db.query(`
          INSERT INTO transactions (wallet_id, user_id, type, amount, status, description)
          VALUES ($1, $2, 'SUBSCRIPTION', $3, 'COMPLETED', $4)
        `, [walletId, userId, -amount, `Subscription to ${tier} tier`]);
      }

      res.status(201).json({ message: 'Subscription created', subscription: result.rows[0] });
    } catch (error) {
      console.error('Error creating subscription:', error);
      res.status(500).json({ error: 'Failed to create subscription' });
    }
  }

  // Advertisers create campaigns
  static async createAdCampaign(req, res) {
    try {
      const { advertiserId, title, budget, cpmRate } = req.body;
      const query = `
        INSERT INTO ad_campaigns (advertiser_id, title, budget, cpm_rate)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const values = [advertiserId, title, budget, cpmRate];
      const result = await db.query(query, values);

      res.status(201).json({ message: 'Campaign created', campaign: result.rows[0] });
    } catch (error) {
      console.error('Error creating campaign:', error);
      res.status(500).json({ error: 'Failed to create ad campaign' });
    }
  }

  // Distribute ad revenue to a creator based on a campaign engagement
  static async distributeAdRevenue(req, res) {
    try {
      const { creatorId, campaignId, contentId, impressions } = req.body;

      // Calculate earnings based on campaign CPM
      const campaignQuery = 'SELECT cpm_rate FROM ad_campaigns WHERE campaign_id = $1';
      const campaignResult = await db.query(campaignQuery, [campaignId]);

      if (campaignResult.rows.length === 0) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      const cpmRate = campaignResult.rows[0].cpm_rate;
      const earnedAmount = (impressions / 1000) * cpmRate;

      // Log share
      const shareQuery = `
        INSERT INTO creator_revenue_shares (creator_id, campaign_id, content_id, impressions, earned_amount, paid_out)
        VALUES ($1, $2, $3, $4, $5, TRUE)
        RETURNING *;
      `;
      const shareResult = await db.query(shareQuery, [creatorId, campaignId, contentId, impressions, earnedAmount]);

      // Credit wallet
      const walletQuery = 'SELECT wallet_id FROM user_wallets WHERE user_id = $1';
      const walletResult = await db.query(walletQuery, [creatorId]);

      if (walletResult.rows.length > 0) {
        const walletId = walletResult.rows[0].wallet_id;

        await db.query('UPDATE user_wallets SET balance = balance + $1 WHERE wallet_id = $2', [earnedAmount, walletId]);

        await db.query(`
          INSERT INTO transactions (wallet_id, user_id, type, amount, reference_id, description)
          VALUES ($1, $2, 'AD_REVENUE', $3, $4, 'Ad revenue distribution')
        `, [walletId, creatorId, earnedAmount, shareResult.rows[0].share_id]);
      }

      res.status(200).json({ message: 'Revenue distributed', amount: earnedAmount });
    } catch (error) {
      console.error('Error distributing revenue:', error);
      res.status(500).json({ error: 'Failed to distribute revenue' });
    }
  }
}

module.exports = RevenueController;
