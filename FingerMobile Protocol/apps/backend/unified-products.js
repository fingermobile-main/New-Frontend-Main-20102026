/* eslint-disable no-unused-vars */
const { identityDb } = require('./database/connection');
const express = require('express');
const router = express.Router();

const logger = require('./utils/logger');
// NEW: Unified Marketplace Endpoints
router.get('/unified-products', async (req, res) => {
  try {
    const { platform = 'all', limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT p.id, p.name, p.description, p.base_price as price, p.status, 
             u.username as seller_name, u.first_name || ' ' || u.last_name as seller_full_name,
             0 as avg_rating,
             0 as review_count,
             0 as stock_quantity,
             'Marketplace' as platform_name
      FROM products p
      LEFT JOIN members u ON p.seller_id = u.id
      WHERE p.status = 'active'
    `;

    const params = [];
    let paramIndex = 1;

    query += ' ORDER BY p.created_at DESC';
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await identityDb.query(query, params);

    // Get total count
    const countQuery = 'SELECT COUNT(*) FROM products WHERE status = \'active\'';
    const countResult = await identityDb.query(countQuery);

    res.json({
      success: true,
      data: rows.map(product => ({
        ...product,
        id: product.id.toString(),
        price: parseFloat(product.price || 0),
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
