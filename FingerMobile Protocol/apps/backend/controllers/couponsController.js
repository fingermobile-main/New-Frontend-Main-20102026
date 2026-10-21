/**
 * couponsController.js
 * Controller for Coupons & Promotions module
 */
const { pool } = require('../db');
const logger = require('../utils/logger');

class CouponsController {
  // GET /api/coupons
  async getAll(req, res) {
    try {
      const result = await pool.query(`
        SELECT * FROM coupons 
        WHERE is_active = true AND valid_until > NOW()
        ORDER BY created_at DESC
      `);
      return res.json({
        success: true,
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in couponsController.getAll:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch coupons', error: error.message });
    }
  }

  // GET /api/coupons/my-coupons
  async getMyCoupons(req, res) {
    try {
      const userId = req.user?.id || req.query.userId || 'current_user';
      const result = await pool.query(`
        SELECT c.*, cr.claimed_at, cr.is_redeemed, cr.redeemed_at
        FROM coupon_redemptions cr
        JOIN coupons c ON cr.coupon_id = c.id
        WHERE cr.user_id = $1
        ORDER BY cr.claimed_at DESC
      `, [userId]);

      return res.json({
        success: true,
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in couponsController.getMyCoupons:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch member coupons', error: error.message });
    }
  }

  // POST /api/coupons/claim/:id
  async claim(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.body.userId || 'current_user';

      const couponRes = await pool.query('SELECT * FROM coupons WHERE id = $1 AND is_active = true', [id]);
      if (couponRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Coupon not found or inactive' });
      }

      // Record claim
      const claimRes = await pool.query(`
        INSERT INTO coupon_redemptions (coupon_id, user_id, claimed_at, is_redeemed)
        VALUES ($1, $2, NOW(), false)
        ON CONFLICT DO NOTHING
        RETURNING *
      `, [id, userId]);

      return res.json({
        success: true,
        message: 'Coupon claimed successfully!',
        data: claimRes.rows[0] || { coupon_id: id, user_id: userId }
      });
    } catch (error) {
      logger.error('Error in couponsController.claim:', error);
      return res.status(500).json({ success: false, message: 'Failed to claim coupon', error: error.message });
    }
  }

  // POST /api/coupons/redeem
  async redeem(req, res) {
    try {
      const { code, order_amount = 0 } = req.body;
      const userId = req.user?.id || req.body.userId || 'current_user';

      if (!code) {
        return res.status(400).json({ success: false, message: 'Coupon code is required' });
      }

      const couponRes = await pool.query(`
        SELECT * FROM coupons 
        WHERE UPPER(code) = UPPER($1) AND is_active = true AND valid_until > NOW()
      `, [code.trim()]);

      if (couponRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
      }

      const coupon = couponRes.rows[0];

      if (coupon.minimum_order_amount > 0 && order_amount < coupon.minimum_order_amount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount of ${coupon.minimum_order_amount} FIC required`
        });
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.discount_type === 'percentage') {
        discountAmount = (order_amount * coupon.discount_value) / 100;
        if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
          discountAmount = coupon.max_discount_amount;
        }
      } else {
        discountAmount = coupon.discount_value;
      }

      // Record usage
      await pool.query('UPDATE coupons SET times_used = times_used + 1 WHERE id = $1', [coupon.id]);
      await pool.query(`
        INSERT INTO coupon_usages (coupon_id, user_id, discount_applied_fic)
        VALUES ($1, $2, $3)
      `, [coupon.id, userId, discountAmount]);

      return res.json({
        success: true,
        message: 'Coupon redeemed successfully!',
        data: {
          coupon_id: coupon.id,
          code: coupon.code,
          discount_type: coupon.discount_type,
          discount_value: coupon.discount_value,
          discount_applied: discountAmount,
          final_amount: Math.max(0, order_amount - discountAmount)
        }
      });
    } catch (error) {
      logger.error('Error in couponsController.redeem:', error);
      return res.status(500).json({ success: false, message: 'Failed to redeem coupon', error: error.message });
    }
  }
}

module.exports = new CouponsController();
