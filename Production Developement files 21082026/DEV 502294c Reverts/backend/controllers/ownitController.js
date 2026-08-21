/**
 * Ownit Controller
 * Complete implementation for product ownership/warranty platform
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class OwnitController {
  /**
   * GET /api/ownit/products
   * Get user's registered products
   */
  async getProducts(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const { limit = 50, offset = 0, category, status } = req.query;

      let whereClause = ['user_id = $1'];
      let queryParams = [userId];
      let paramCount = 2;

      if (category) {
        whereClause.push(`category = $${paramCount}`);
        queryParams.push(category);
        paramCount++;
      }

      if (status) {
        whereClause.push(`warranty_status = $${paramCount}`);
        queryParams.push(status);
        paramCount++;
      }

      const result = await pool.query('SELECT * FROM ownit_products WHERE $1 ORDER BY registered_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}', [...queryParams, parseInt(limit), parseInt(offset), whereClause.join(' AND ')]);

      res.json({
        success: true,
        data: result.rows.map(product => ({
          ...product,
          purchasePrice: parseFloat(product.purchase_price) || 0,
          warrantyExpiry: product.warranty_expiry ? new Date(product.warranty_expiry) : null
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset), total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in OwnitController.getProducts:', error);
      res.status(500).json({
        success: false, message: 'Failed to get products', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/ownit/products/register
   * Register a new product
   */
  async registerProduct(req, res) {
    try {
      const userId = req.user?.id;
      const { 
        productName, 
        brand, 
        category, 
        serialNumber, 
        purchaseDate,
        purchasePrice,
        warrantyMonths,
        receiptUrl
      } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!productName || !brand || !serialNumber) {
        return res.status(400).json({
          success: false, message: 'Product name, brand, and serial number are required'
        });
      }

      // Calculate warranty expiry
      const warrantyExpiry = warrantyMonths 
        ? new Date(new Date(purchaseDate || Date.now()).setMonth(new Date().getMonth() + parseInt(warrantyMonths)))
        : null;

      const result = await pool.query(
        `INSERT INTO ownit_products 
         (user_id, product_name, brand, category, serial_number, purchase_date, purchase_price, warranty_months, warranty_expiry, receipt_url, warranty_status, registered_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'active', NOW())
         RETURNING *`,
        [
          userId,
          productName,
          brand,
          category || null,
          serialNumber,
          purchaseDate || null,
          parseFloat(purchasePrice) || null,
          parseInt(warrantyMonths) || null,
          warrantyExpiry,
          receiptUrl || null
        ]
      );

      res.status(201).json({
        success: true, message: 'Product registered successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in OwnitController.registerProduct:', error);
      res.status(500).json({
        success: false, message: 'Failed to register product', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/ownit/warranty-claims
   * Submit warranty claim
   */
  async submitWarrantyClaim(req, res) {
    try {
      const userId = req.user?.id;
      const { productId, issueDescription, issueCategory, photos } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!productId || !issueDescription) {
        return res.status(400).json({
          success: false, message: 'Product ID and issue description are required'
        });
      }

      // Verify product ownership
      const product = await pool.query(
        'SELECT * FROM ownit_products WHERE id = $1 AND user_id = $2',
        [productId, userId]
      );

      if (product.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Product not found'
        });
      }

      // Check warranty status
      const productData = product.rows[0];
      if (productData.warranty_status !== 'active') {
        return res.status(400).json({
          success: false, message: 'Warranty is not active'
        });
      }

      if (productData.warranty_expiry && new Date(productData.warranty_expiry) < new Date()) {
        return res.status(400).json({
          success: false, message: 'Warranty has expired'
        });
      }

      await pool.query(
        `INSERT INTO ownit_warranty_claims 
         (product_id, user_id, issue_description, issue_category, photos, status, submitted_at)
         VALUES ($1, $2, $3, $4, $5, 'pending', NOW())`,
        [
          productId,
          userId,
          issueDescription,
          issueCategory || null,
          JSON.stringify(photos || [])
        ]
      );

      res.status(201).json({
        success: true, message: 'Warranty claim submitted successfully'
      });
    } catch (error) {
      logger.error('Error in OwnitController.submitWarrantyClaim:', error);
      res.status(500).json({
        success: false, message: 'Failed to submit warranty claim', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/ownit/warranty-claims/my-claims
   * Get user's warranty claims
   */
  async getMyClaims(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const { status } = req.query;

      let whereClause = ['wc.user_id = $1'];
      let queryParams = [userId];
      let paramCount = 2;

      if (status) {
        whereClause.push(`wc.status = $${paramCount}`);
        queryParams.push(status);
        paramCount++;
      }

      const result = await pool.query(
        `SELECT 
          wc.*,
          op.product_name,
          op.brand op.serial_number
         FROM ownit_warranty_claims wc
         JOIN ownit_products op ON wc.product_id = op.id
         WHERE ${whereClause.join(' AND ')}
         ORDER BY wc.submitted_at DESC`,
        queryParams
      );

      res.json({
        success: true,
        data: result.rows.map(claim => ({
          ...claim, photos: typeof claim.photos === 'string' ? JSON.parse(claim.photos) : claim.photos
        })), count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in OwnitController.getMyClaims:', error);
      res.status(500).json({
        success: false, message: 'Failed to get warranty claims', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/ownit/stats
   * Get ownership statistics
   */
  async getStats(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const stats = await pool.query(
        `SELECT 
          COUNT(*) as total_products COUNT(*) FILTER (WHERE warranty_status = 'active') as active_warranties COUNT(*) FILTER (WHERE warranty_status = 'expired') as expired_warranties,
          COUNT(DISTINCT brand) as unique_brands,
          COALESCE(SUM(purchase_price), 0) as total_value
         FROM ownit_products
         WHERE user_id = $1`,
        [userId]
      );

      res.json({
        success: true,
        data: {
          totalProducts: parseInt(stats.rows[0].total_products) || 0,
          activeWarranties: parseInt(stats.rows[0].active_warranties) || 0,
          expiredWarranties: parseInt(stats.rows[0].expired_warranties) || 0,
          uniqueBrands: parseInt(stats.rows[0].unique_brands) || 0, totalValue: parseFloat(stats.rows[0].total_value) || 0
        }
      });
    } catch (error) {
      logger.error('Error in OwnitController.getStats:', error);
      res.status(500).json({
        success: false, message: 'Failed to get statistics', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new OwnitController();
