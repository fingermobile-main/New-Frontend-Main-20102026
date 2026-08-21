/**
 * Commerce Controller
 * Complete implementation for e-commerce functionality
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class CommerceController {
  /**
   * GET /api/commerce/products
   * Get all products
   */
  async getProducts(req, res) {
    try {
      const { 
        limit = 50, 
        offset = 0, 
        category, 
        minPrice, 
        maxPrice, sortBy = 'created_at', order = 'DESC'
      } = req.query;

      let whereClause = ['is_active = true'];
      let queryParams = [];
      let paramCount = 1;

      if (category) {
        whereClause.push(`category = $${paramCount}`);
        queryParams.push(category);
        paramCount++;
      }

      if (minPrice !== undefined) {
        whereClause.push(`price >= $${paramCount}`);
        queryParams.push(parseFloat(minPrice));
        paramCount++;
      }

      if (maxPrice !== undefined) {
        whereClause.push(`price <= $${paramCount}`);
        queryParams.push(parseFloat(maxPrice));
        paramCount++;
      }

      const whereSQL = whereClause.join(' AND ');

      const result = await pool.query('SELECT id, name, description, price, currency, category, image_url, stock_quantity, rating, review_count created_at FROM products WHERE $1 ORDER BY ${sortBy} ${order} LIMIT $${paramCount} OFFSET $${paramCount + 1}', [...queryParams, parseInt(limit), parseInt(offset), whereSQL]);

      res.json({
        success: true,
        data: result.rows.map(product => ({
          ...product,
          price: parseFloat(product.price),
          rating: parseFloat(product.rating) || 0
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in CommerceController.getProducts:', error);
      res.status(500).json({
        success: false, message: 'Failed to get products', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/commerce/cart/add
   * Add item to cart
   */
  async addToCart(req, res) {
    try {
      const userId = req.user?.id;
      const { productId, quantity = 1 } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!productId) {
        return res.status(400).json({
          success: false, message: 'Product ID is required'
        });
      }

      // Check product exists and has stock
      const product = await pool.query(
        'SELECT * FROM products WHERE id = $1 AND is_active = true',
        [productId]
      );

      if (product.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Product not found'
        });
      }

      if (product.rows[0].stock_quantity < quantity) {
        return res.status(400).json({
          success: false, message: 'Insufficient stock'
        });
      }

      // Add to cart or update quantity
      await pool.query(
        `INSERT INTO cart_items (user_id, product_id, quantity, added_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id, product_id)
         DO UPDATE SET quantity = cart_items.quantity + $3, updated_at = NOW()`,
        [userId, productId, quantity]
      );

      res.json({
        success: true, message: 'Item added to cart', data: { productId, quantity }
      });
    } catch (error) {
      logger.error('Error in CommerceController.addToCart:', error);
      res.status(500).json({
        success: false, message: 'Failed to add to cart', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/commerce/cart
   * Get user's cart
   */
  async getCart(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const result = await pool.query(
        `SELECT 
          ci.id,
          ci.product_id,
          ci.quantity,
          p.name,
          p.price,
          p.image_url,
          (ci.quantity * p.price) as subtotal
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.user_id = $1
         ORDER BY ci.added_at DESC`,
        [userId]
      );

      const total = result.rows.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

      res.json({
        success: true,
        data: {
          items: result.rows.map(item => ({
            ...item,
            price: parseFloat(item.price),
            subtotal: parseFloat(item.subtotal)
          })),
          total: total, itemCount: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in CommerceController.getCart:', error);
      res.status(500).json({
        success: false, message: 'Failed to get cart', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/commerce/orders
   * Create order from cart
   */
  async createOrder(req, res) {
    try {
      const userId = req.user?.id;
      const { shippingAddress, paymentMethod } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Get cart items
      const cartItems = await pool.query(
        `SELECT ci.*, p.price, p.stock_quantity
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.user_id = $1`,
        [userId]
      );

      if (cartItems.rows.length === 0) {
        return res.status(400).json({
          success: false, message: 'Cart is empty'
        });
      }

      // Calculate totals
      const subtotal = cartItems.rows.reduce((sum, item) => sum + (item.quantity * parseFloat(item.price)), 0);
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax;

      // Create order
      const orderResult = await pool.query(
        `INSERT INTO orders (user_id, subtotal, tax, total, shipping_address, payment_method, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())
         RETURNING *`,
        [userId, subtotal, tax, total, JSON.stringify(shippingAddress), paymentMethod]
      );

      const orderId = orderResult.rows[0].id;

      // Create order items
      for (const item of cartItems.rows) {
        await pool.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
           VALUES ($1, $2, $3, $4, $5)` [orderId, item.product_id, item.quantity, item.price, item.quantity * parseFloat(item.price)]
        );

        // Update stock
        await pool.query(
          'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2' [item.quantity, item.product_id]
        );
      }

      // Clear cart
      await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

      res.status(201).json({
        success: true, message: 'Order created successfully',
        data: {
          orderId: orderId, total: total
        }
      });
    } catch (error) {
      logger.error('Error in CommerceController.createOrder:', error);
      res.status(500).json({
        success: false, message: 'Failed to create order', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/commerce/orders
   * Get user's orders
   */
  async getOrders(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const { limit = 20, offset = 0, status } = req.query;

      let whereClause = ['user_id = $1'];
      let queryParams = [userId];
      let paramCount = 2;

      if (status) {
        whereClause.push(`status = $${paramCount}`);
        queryParams.push(status);
        paramCount++;
      }

      const result = await pool.query('SELECT * FROM orders WHERE $1 ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}', [...queryParams, parseInt(limit), parseInt(offset), whereClause.join(' AND ')]);

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset), total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in CommerceController.getOrders:', error);
      res.status(500).json({
        success: false, message: 'Failed to get orders', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new CommerceController();
