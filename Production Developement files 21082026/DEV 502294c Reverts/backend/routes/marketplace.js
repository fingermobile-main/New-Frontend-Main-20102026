const express = require('express');
const logger = require('../utils/logger');
const router = express.Router();
const MarketplaceController = require('../controllers/marketplaceController');
const { authenticate } = require('../middleware/auth');
const { identityDb, financialDb } = require('../db');

/**
 * Marketplace Routes
 * IMPORTANT: Specific routes MUST come before parameterized routes (/:id)
 */

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

// NEW: Unified Marketplace Endpoints (MUST be before /:id route)
router.get('/unified-products', async (req, res) => {
  try {
    const { platform = 'all', limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT p.*, u.username as seller_name, u.first_name || ' ' || u.last_name as seller_full_name,
             COALESCE(AVG(pr.rating), 0) as avg_rating,
             COUNT(pr.id) as review_count CASE 
               WHEN p.platform_type = 'ownit' THEN 'Ownit'
               WHEN p.platform_type = 'flamingo' THEN 'Flamingo'
               WHEN p.platform_type = 'storefront' THEN 'Storefront'
               ELSE 'Marketplace'
             END as platform_name
      FROM products p
      LEFT JOIN users u ON p.creator_id = u.id
      LEFT JOIN product_reviews pr ON p.id = pr.product_id
      WHERE p.is_active = true
    `;
    
    const params = [];
    let paramIndex = 1;

    if (platform && platform !== 'all') {
      query += ` AND p.platform_type = $${paramIndex++}`;
      params.push(platform);
    }

    query += ` GROUP BY p.id, u.id`;
    query += ` ORDER BY p.created_at DESC`;
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await identityDb.query(query, params);
    
    // Get total count
    const countQuery = `SELECT COUNT(*) FROM products WHERE is_active = true${platform && platform !== 'all' ? ' AND platform_type = $1' : ''}`;
    const countResult = await identityDb.query(
      countQuery, platform && platform !== 'all' ? [platform] : []
    );
    
    res.json({
      success: true,
      data: rows.map(product => ({
        ...product,
        id: product.id.toString(),
        price: parseFloat(product.price),
        stock_quantity: parseInt(product.stock_quantity),
        avg_rating: parseFloat(product.avg_rating),
        review_count: parseInt(product.review_count)
      })),
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page: Math.floor(offset / limit) + 1,
        limit: parseInt(limit),
        hasMore: rows.length === parseInt(limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching unified products:', error);
    res.status(500).json({ 
      success: false, message: 'Failed to fetch unified products', error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    // Get total products count
    const productsCount = await identityDb.query(
      'SELECT COUNT(*) as total FROM products WHERE is_active = true'
    );
    
    // Get total orders count
    const ordersCount = await identityDb.query(
      'SELECT COUNT(*) as total FROM orders'
    );
    
    // Get total revenue
    const revenueResult = await financialDb.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE status = \'completed\''
    );
    
    // Get active sellers count
    const sellersCount = await identityDb.query(
      'SELECT COUNT(DISTINCT creator_id) as total FROM products WHERE is_active = true'
    );
    
    // Get recent activity (last 7 days)
    const recentActivity = await identityDb.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders_count COALESCE(SUM(total_amount), 0) as revenue
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);
    
    res.json({
      success: true,
      data: {
        totalProducts: parseInt(productsCount.rows[0].total),
        totalOrders: parseInt(ordersCount.rows[0].total),
        totalRevenue: parseFloat(revenueResult.rows[0].total),
        activeSellers: parseInt(sellersCount.rows[0].total),
        recentActivity: recentActivity.rows.map(row => ({
          date: row.date,
          ordersCount: parseInt(row.orders_count), revenue: parseFloat(row.revenue)
        }))
      }
    });
  } catch (error) {
    logger.error('Error fetching marketplace analytics:', error);
    res.status(500).json({ 
      success: false, message: 'Failed to fetch analytics', error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ==========================================
// PROTECTED ENDPOINTS (Requires Authentication)
// ==========================================

// GET /api/marketplace/unified-orders - Get user's orders from all platforms
router.get('/unified-orders', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || req.member?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User context not found' });
    }
    
    const { status = 'all', limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT o.*, p.name as product_name, p.image_url as product_image, u.username as seller_name
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      LEFT JOIN users u ON p.creator_id = u.id
      WHERE o.buyer_id = $1
    `;
    
    const params = [userId];
    let paramIndex = 2;

    if (status && status !== 'all') {
      query += ` AND o.status = $${paramIndex++}`;
      params.push(status);
    }

    query += ` ORDER BY o.created_at DESC`;
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await identityDb.query(query, params);
    
    // Get total count
    const countQuery = `SELECT COUNT(*) FROM orders WHERE buyer_id = $1${status && status !== 'all' ? ' AND status = $2' : ''}`;
    const countResult = await identityDb.query(
      countQuery, status && status !== 'all' ? [userId, status] : [userId]
    );
    
    res.json({
      success: true,
      data: rows.map(order => ({
        ...order,
        id: order.id.toString(),
        product_id: order.product_id?.toString(),
        total_amount: parseFloat(order.total_amount),
        created_at: order.created_at,
        updated_at: order.updated_at
      })),
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page: Math.floor(offset / limit) + 1,
        limit: parseInt(limit),
        hasMore: rows.length === parseInt(limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching unified orders:', error);
    res.status(500).json({ 
      success: false, message: 'Failed to fetch orders', error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/marketplace/transactions - Get user's financial ledger records
router.get('/transactions', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || req.member?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User context not found' });
    }
    
    const { type = 'all', limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT t.* CASE 
               WHEN t.type = 'purchase' THEN 'Purchase'
               WHEN t.type = 'sale' THEN 'Sale'
               WHEN t.type = 'refund' THEN 'Refund'
               ELSE t.type
             END as transaction_type_label
      FROM transactions t
      WHERE t.user_id = $1
    `;
    
    const params = [userId];
    let paramIndex = 2;

    if (type && type !== 'all') {
      query += ` AND t.type = $${paramIndex++}`;
      params.push(type);
    }

    query += ` ORDER BY t.created_at DESC`;
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await financialDb.query(query, params);
    
    // Get total count
    const countQuery = `SELECT COUNT(*) FROM transactions WHERE user_id = $1${type && type !== 'all' ? ' AND type = $2' : ''}`;
    const countResult = await financialDb.query(
      countQuery, type && type !== 'all' ? [userId, type] : [userId]
    );
    
    res.json({
      success: true,
      data: rows.map(transaction => ({
        ...transaction,
        id: transaction.id.toString(),
        amount: parseFloat(transaction.amount),
        created_at: transaction.created_at
      })),
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page: Math.floor(offset / limit) + 1,
        limit: parseInt(limit),
        hasMore: rows.length === parseInt(limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching transactions:', error);
    res.status(500).json({ 
      success: false, message: 'Failed to fetch transactions', error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
