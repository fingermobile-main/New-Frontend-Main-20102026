import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * CommerceController
 * Commerce platform - Products, orders, payments, shopping cart
 */

class CommerceController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * GET /api/commerce/products
   * Get all products with filtering and pagination
   */
  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = (page - 1) * limit;
      const { category, minPrice, maxPrice, search } = req.query;

      let whereClause = 'WHERE is_active = true';
      const params: any[] = [];
      let paramIndex = 1;

      if (category) {
        whereClause += ` AND category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }

      if (minPrice) {
        whereClause += ` AND price >= $${paramIndex}`;
        params.push(minPrice);
        paramIndex++;
      }

      if (maxPrice) {
        whereClause += ` AND price <= $${paramIndex}`;
        params.push(maxPrice);
        paramIndex++;
      }

      if (search) {
        whereClause += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      const query = `
        SELECT *, 
               COALESCE(stock_quantity, 0) as available_stock
        FROM commerce_products
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      params.push(limit, offset);
      const result = await this.db.query(query, params);

      const countQuery = `SELECT COUNT(*) as total FROM commerce_products ${whereClause}`;
      const countResult = await this.db.query(countQuery, params.slice(0, -2));
      const total = parseInt(countResult.rows[0]?.total || '0');

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      });
    } catch (error) {
      logger.error('CommerceController.getProducts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve products',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/commerce/cart/add
   * Add item to cart
   */
  async addToCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { productId, quantity = 1 } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      if (!productId) {
        res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
        return;
      }

      // Check product exists and has stock
      const productQuery = 'SELECT id, price, stock_quantity FROM commerce_products WHERE id = $1 AND is_active = true';
      const productResult = await this.db.query(productQuery, [productId]);

      if (productResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Product not found or inactive'
        });
        return;
      }

      const product = productResult.rows[0];

      if (product.stock_quantity < quantity) {
        res.status(400).json({
          success: false,
          message: 'Insufficient stock'
        });
        return;
      }

      // Add to cart or update quantity
      const upsertQuery = `
        INSERT INTO shopping_cart (user_id, product_id, quantity, added_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id, product_id) 
        DO UPDATE SET quantity = shopping_cart.quantity + $3, updated_at = NOW()
        RETURNING *
      `;
      
      const result = await this.db.query(upsertQuery, [userId, productId, quantity]);

      res.json({
        success: true,
        message: 'Item added to cart',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('CommerceController.addToCart error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add to cart',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/commerce/cart
   * Get user's shopping cart
   */
  async getCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const query = `
        SELECT sc.*, 
               p.name as product_name,
               p.price,
               p.thumbnail_url,
               (p.price * sc.quantity) as subtotal
        FROM shopping_cart sc
        JOIN commerce_products p ON sc.product_id = p.id
        WHERE sc.user_id = $1
        ORDER BY sc.added_at DESC
      `;
      
      const result = await this.db.query(query, [userId]);

      const totalAmount = result.rows.reduce((sum: number, item: any) => sum + parseFloat(item.subtotal), 0);

      res.json({
        success: true,
        data: {
          items: result.rows,
          totalAmount: totalAmount.toFixed(2),
          itemCount: result.rows.length
        }
      });
    } catch (error) {
      logger.error('CommerceController.getCart error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve cart',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/commerce/orders
   * Create order from cart
   */
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { shippingAddress, paymentMethod } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const client = await this.db.connect();

      try {
        await client.query('BEGIN');

        // Get cart items
        const cartQuery = `
          SELECT sc.*, p.price, p.stock_quantity
          FROM shopping_cart sc
          JOIN commerce_products p ON sc.product_id = p.id
          WHERE sc.user_id = $1
        `;
        
        const cartResult = await client.query(cartQuery, [userId]);

        if (cartResult.rows.length === 0) {
          await client.query('ROLLBACK');
          res.status(400).json({
            success: false,
            message: 'Cart is empty'
          });
          return;
        }

        // Calculate total
        const totalAmount = cartResult.rows.reduce((sum: number, item: any) => 
          sum + (parseFloat(item.price) * item.quantity), 0
        );

        // Create order
        const orderQuery = `
          INSERT INTO commerce_orders (user_id, total_amount, shipping_address, payment_method, status, created_at)
          VALUES ($1, $2, $3, $4, 'pending', NOW())
          RETURNING *
        `;
        
        const orderResult = await client.query(orderQuery, [userId, totalAmount, shippingAddress, paymentMethod]);
        const orderId = orderResult.rows[0].id;

        // Create order items and update stock
        for (const item of cartResult.rows) {
          await client.query(
            'INSERT INTO commerce_order_items (order_id, product_id, quantity, price, created_at) VALUES ($1, $2, $3, $4, NOW())',
            [orderId, item.product_id, item.quantity, item.price]
          );

          await client.query(
            'UPDATE commerce_products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
            [item.quantity, item.product_id]
          );
        }

        // Clear cart
        await client.query('DELETE FROM shopping_cart WHERE user_id = $1', [userId]);

        await client.query('COMMIT');

        res.status(201).json({
          success: true,
          message: 'Order created successfully',
          data: orderResult.rows[0]
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('CommerceController.createOrder error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create order',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/commerce/orders
   * Get user's orders
   */
  async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = (page - 1) * limit;

      const query = `
        SELECT o.*, 
               COUNT(oi.id) as item_count
        FROM commerce_orders o
        LEFT JOIN commerce_order_items oi ON o.id = oi.order_id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      
      const result = await this.db.query(query, [userId, limit, offset]);

      const countQuery = 'SELECT COUNT(*) as total FROM commerce_orders WHERE user_id = $1';
      const countResult = await this.db.query(countQuery, [userId]);
      const total = parseInt(countResult.rows[0]?.total || '0');

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      });
    } catch (error) {
      logger.error('CommerceController.getOrders error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve orders',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new CommerceController();
