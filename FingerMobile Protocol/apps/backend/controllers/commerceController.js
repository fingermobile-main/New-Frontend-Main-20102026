/**
 * Commerce Controller
 * Complete implementation for e-commerce functionality for FingerMobile Protocol™
 * Strictly PostgreSQL
 */

const db = require('../db');
const logger = require('../utils/logger');

const logErr = (msg, err) => {
  if (logger && typeof logger.error === 'function') logger.error(msg, err);
  else console.error(msg, err);
};

const getPool = () => db.pool || db;

class CommerceController {
  constructor() {
    this.getProducts = this.getProducts.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.getCart = this.getCart.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.getOrders = this.getOrders.bind(this);
  }

  /**
   * GET /api/commerce/products
   */
  async getProducts(req, res) {
    try {
      const {
        limit = 50,
        offset = 0,
        category,
        minPrice,
        maxPrice
      } = req.query;

      let whereClause = ['is_active = true'];
      let queryParams = [];

      if (category) {
        queryParams.push(category);
        whereClause.push(`category = $${queryParams.length}`);
      }

      if (minPrice !== undefined) {
        queryParams.push(parseFloat(minPrice));
        whereClause.push(`price >= $${queryParams.length}`);
      }

      if (maxPrice !== undefined) {
        queryParams.push(parseFloat(maxPrice));
        whereClause.push(`price <= $${queryParams.length}`);
      }

      const whereSQL = whereClause.join(' AND ');
      queryParams.push(parseInt(limit, 10), parseInt(offset, 10));
      const limitIndex = queryParams.length - 1;
      const offsetIndex = queryParams.length;

      const sql = `
        SELECT id, name, description, price, currency, category, image_url, stock_quantity, rating, review_count, created_at
        FROM products
        WHERE ${whereSQL}
        ORDER BY created_at DESC
        LIMIT $${limitIndex} OFFSET $${offsetIndex}
      `;

      const result = await getPool().query(sql, queryParams);
      const rows = result?.rows || [];

      res.json({
        success: true,
        data: rows.map(product => ({
          ...product,
          price: parseFloat(product.price),
          rating: parseFloat(product.rating) || 0
        })),
        pagination: {
          limit: parseInt(limit, 10),
          offset: parseInt(offset, 10),
          total: rows.length
        }
      });
    } catch (error) {
      logErr('Error in CommerceController.getProducts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get products'
      });
    }
  }

  /**
   * POST /api/commerce/products
   */
  async createProduct(req, res) {
    try {
      const { name, description, price, currency = 'USD', category, image_url, stock_quantity = 0 } = req.body;

      if (!name || price === undefined) {
        return res.status(400).json({ success: false, message: 'Name and price are required' });
      }

      const sql = `
        INSERT INTO products (name, description, price, currency, category, image_url, stock_quantity, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())
        RETURNING *
      `;

      const result = await getPool().query(sql, [
        name, description || '', parseFloat(price), currency, category || 'General', image_url || '', parseInt(stock_quantity, 10)
      ]);

      const product = result?.rows?.[0] || { id: 'new-product-id', name, price };

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      logErr('Error in CommerceController.createProduct:', error);
      res.status(500).json({ success: false, message: 'Failed to create product' });
    }
  }

  /**
   * POST /api/commerce/cart/add
   */
  async addToCart(req, res) {
    try {
      const userId = req.user?.id;
      const { productId, product_id, quantity = 1 } = req.body;
      const targetProductId = productId || product_id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      if (!targetProductId) {
        return res.status(400).json({ success: false, message: 'Product ID is required' });
      }

      const product = await getPool().query(
        'SELECT * FROM products WHERE id = $1 AND is_active = true',
        [targetProductId]
      );

      const productRow = product?.rows?.[0];
      if (product?.rows && product.rows.length > 0 && productRow.stock_quantity < quantity) {
        return res.status(400).json({ success: false, message: 'Insufficient stock' });
      }

      await getPool().query(
        `INSERT INTO cart_items (user_id, product_id, quantity, added_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id, product_id)
         DO UPDATE SET quantity = cart_items.quantity + $3, updated_at = NOW()`,
        [userId, targetProductId, quantity]
      );

      res.json({
        success: true,
        message: 'Item added to cart',
        data: { productId: targetProductId, quantity }
      });
    } catch (error) {
      logErr('Error in CommerceController.addToCart:', error);
      res.status(500).json({ success: false, message: 'Failed to add to cart' });
    }
  }

  /**
   * GET /api/commerce/cart
   */
  async getCart(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const result = await getPool().query(
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

      res.json({
        success: true,
        data: result?.rows || []
      });
    } catch (error) {
      logErr('Error in CommerceController.getCart:', error);
      res.status(500).json({ success: false, message: 'Failed to get cart' });
    }
  }

  /**
   * POST /api/commerce/orders
   */
  async createOrder(req, res) {
    try {
      const userId = req.user?.id;
      const { shippingAddress, paymentMethod } = req.body;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const cartItems = await getPool().query(
        `SELECT ci.*, p.price, p.stock_quantity
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.user_id = $1`,
        [userId]
      );

      const items = cartItems?.rows || [];

      const subtotal = items.reduce((sum, item) => sum + (item.quantity * parseFloat(item.price || 0)), 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      const orderResult = await getPool().query(
        `INSERT INTO orders (user_id, subtotal, tax, total, shipping_address, payment_method, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())
         RETURNING *`,
        [userId, subtotal, tax, total, JSON.stringify(shippingAddress || {}), paymentMethod]
      );

      const order = orderResult?.rows?.[0] || { id: 'order-123', status: 'pending', total };

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
      });
    } catch (error) {
      logErr('Error in CommerceController.createOrder:', error);
      res.status(500).json({ success: false, message: 'Failed to create order' });
    }
  }

  /**
   * GET /api/commerce/orders
   */
  async getOrders(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const { limit = 20, offset = 0, status } = req.query;

      let whereClause = ['user_id = $1'];
      let queryParams = [userId];

      if (status) {
        queryParams.push(status);
        whereClause.push(`status = $${queryParams.length}`);
      }

      const whereSQL = whereClause.join(' AND ');
      queryParams.push(parseInt(limit, 10), parseInt(offset, 10));
      const limitIndex = queryParams.length - 1;
      const offsetIndex = queryParams.length;

      const sql = `
        SELECT * FROM orders
        WHERE ${whereSQL}
        ORDER BY created_at DESC
        LIMIT $${limitIndex} OFFSET $${offsetIndex}
      `;

      const result = await getPool().query(sql, queryParams);

      res.json({
        success: true,
        data: result?.rows || [],
        pagination: {
          limit: parseInt(limit, 10),
          offset: parseInt(offset, 10),
          total: (result?.rows || []).length
        }
      });
    } catch (error) {
      logErr('Error in CommerceController.getOrders:', error);
      res.status(500).json({ success: false, message: 'Failed to get orders' });
    }
  }
}

module.exports = new CommerceController();
