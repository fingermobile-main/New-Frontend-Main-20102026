/**
 * Catalog Controller
 * Comprehensive Multi-Channel Product & Services Engine for FingerMobile Protocol™
 * Powers General Product Catalogue, Marketplace, Flamingo, OwnIt, and Storefront Vetting
 * Strictly PostgreSQL
 */

const db = require('../db');
const logger = require('../utils/logger');

const getPool = () => db.pool || db;

const logErr = (msg, err) => {
  if (logger && typeof logger.error === 'function') {
    logger.error(msg, err);
  } else {
    console.error(msg, err);
  }
};

class CatalogController {
  constructor() {
    this.getGeneralCatalog = this.getGeneralCatalog.bind(this);
    this.getCatalogProductById = this.getCatalogProductById.bind(this);
    this.createCatalogProduct = this.createCatalogProduct.bind(this);
    this.updateCatalogProduct = this.updateCatalogProduct.bind(this);
    this.deleteCatalogProduct = this.deleteCatalogProduct.bind(this);
    this.curateStoreAllocation = this.curateStoreAllocation.bind(this);
    this.restockProduct = this.restockProduct.bind(this);
    this.getMarketplaceCatalog = this.getMarketplaceCatalog.bind(this);
    this.getFlamingoCatalog = this.getFlamingoCatalog.bind(this);
    this.getOwnitCatalog = this.getOwnitCatalog.bind(this);
    this.getStorefrontCatalog = this.getStorefrontCatalog.bind(this);
    this.vetStorefrontProduct = this.vetStorefrontProduct.bind(this);
    this.batchManageMedia = this.batchManageMedia.bind(this);
  }

  /**
   * GET /api/catalog/general
   * List all products & services in the General Master Catalogue
   */
  async getGeneralCatalog(req, res) {
    try {
      const {
        search,
        category,
        goods_type,
        store,
        status,
        vetting_status,
        limit = 50,
        offset = 0
      } = req.query;

      let query = 'SELECT * FROM general_product_catalog WHERE 1=1';
      const params = [];

      if (search && search.trim()) {
        params.push(`%${search.trim()}%`);
        query += ` AND (name ILIKE $${params.length} OR subtitle ILIKE $${params.length} OR description ILIKE $${params.length} OR sku ILIKE $${params.length})`;
      }

      if (category && category !== 'all') {
        params.push(category);
        query += ` AND LOWER(category) = LOWER($${params.length})`;
      }

      if (goods_type && goods_type !== 'all') {
        params.push(goods_type);
        query += ` AND goods_type = $${params.length}`;
      }

      if (store && store !== 'all') {
        params.push(store);
        query += ` AND $${params.length} = ANY(curated_stores)`;
      }

      if (status && status !== 'all') {
        params.push(status);
        query += ` AND status = $${params.length}`;
      }

      if (vetting_status && vetting_status !== 'all') {
        params.push(vetting_status);
        query += ` AND vetting_status = $${params.length}`;
      }

      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(parseInt(limit, 10), parseInt(offset, 10));

      const result = await getPool().query(query, params);

      // Get store breakdown statistics
      const statsQuery = `
        SELECT 
          count(*) as total_items,
          count(*) FILTER (WHERE 'marketplace' = ANY(curated_stores)) as marketplace_count,
          count(*) FILTER (WHERE 'flamingo' = ANY(curated_stores)) as flamingo_count,
          count(*) FILTER (WHERE 'ownit' = ANY(curated_stores)) as ownit_count,
          count(*) FILTER (WHERE 'storefront' = ANY(curated_stores)) as storefront_count,
          count(*) FILTER (WHERE vetting_status = 'pending_vetting') as pending_vetting_count
        FROM general_product_catalog
      `;
      const statsResult = await getPool().query(statsQuery);

      res.status(200).json({
        success: true,
        data: result.rows,
        products: result.rows,
        total: result.rows.length,
        stats: statsResult.rows[0]
      });
    } catch (error) {
      logErr('Error in CatalogController.getGeneralCatalog:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve catalog products', error: error.message });
    }
  }

  /**
   * GET /api/catalog/general/:id
   */
  async getCatalogProductById(req, res) {
    try {
      const { id } = req.params;
      const result = await getPool().query('SELECT * FROM general_product_catalog WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found in general catalog' });
      }
      res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      logErr('Error in CatalogController.getCatalogProductById:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve product details', error: error.message });
    }
  }

  /**
   * POST /api/catalog/general
   * Ingest a new product or service into the General Product Catalogue
   */
  async createCatalogProduct(req, res) {
    try {
      const {
        sku,
        name,
        subtitle,
        description,
        category = 'General',
        goods_type = 'physical',
        price_fic = 0,
        price_fiat = 0,
        currency = 'FIC',
        stock_quantity = 100,
        images = [],
        video_urls = [],
        specifications = {},
        service_details = {},
        status = 'active',
        curated_stores = ['marketplace'],
        store_scheduling = {},
        vetting_status = 'approved'
      } = req.body;

      if (!name) {
        return res.status(400).json({ success: false, message: 'Product name is required' });
      }

      const generatedSku = sku || `FMP-${goods_type.toUpperCase().substring(0, 3)}-${Date.now().toString().slice(-6)}`;

      const insertQuery = `
        INSERT INTO general_product_catalog (
          sku, name, subtitle, description, category, goods_type,
          price_fic, price_fiat, currency, stock_quantity,
          images, video_urls, specifications, service_details,
          status, curated_stores, store_scheduling, vetting_status,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13, $14,
          $15, $16, $17, $18,
          NOW(), NOW()
        ) RETURNING *
      `;

      const values = [
        generatedSku,
        name,
        subtitle || null,
        description || null,
        category,
        goods_type,
        parseFloat(price_fic),
        parseFloat(price_fiat),
        currency,
        parseInt(stock_quantity, 10),
        Array.isArray(images) ? images : [images],
        Array.isArray(video_urls) ? video_urls : [video_urls].filter(Boolean),
        typeof specifications === 'object' ? JSON.stringify(specifications) : '{}',
        typeof service_details === 'object' ? JSON.stringify(service_details) : '{}',
        status,
        Array.isArray(curated_stores) ? curated_stores : ['marketplace'],
        typeof store_scheduling === 'object' ? JSON.stringify(store_scheduling) : '{}',
        vetting_status
      ];

      const result = await getPool().query(insertQuery, values);
      const created = result.rows[0];

      res.status(201).json({
        success: true,
        message: 'Product ingested into General Product Catalogue',
        data: created
      });
    } catch (error) {
      logErr('Error in CatalogController.createCatalogProduct:', error);
      res.status(500).json({ success: false, message: 'Failed to create product in general catalog', error: error.message });
    }
  }

  /**
   * PUT /api/catalog/general/:id
   */
  async updateCatalogProduct(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        subtitle,
        description,
        category,
        goods_type,
        price_fic,
        price_fiat,
        stock_quantity,
        images,
        video_urls,
        specifications,
        service_details,
        status,
        curated_stores,
        store_scheduling,
        vetting_status,
        censorship_flags
      } = req.body;

      const updateQuery = `
        UPDATE general_product_catalog SET
          name = COALESCE($1, name),
          subtitle = COALESCE($2, subtitle),
          description = COALESCE($3, description),
          category = COALESCE($4, category),
          goods_type = COALESCE($5, goods_type),
          price_fic = COALESCE($6, price_fic),
          price_fiat = COALESCE($7, price_fiat),
          stock_quantity = COALESCE($8, stock_quantity),
          images = COALESCE($9, images),
          video_urls = COALESCE($10, video_urls),
          specifications = COALESCE($11, specifications),
          service_details = COALESCE($12, service_details),
          status = COALESCE($13, status),
          curated_stores = COALESCE($14, curated_stores),
          store_scheduling = COALESCE($15, store_scheduling),
          vetting_status = COALESCE($16, vetting_status),
          censorship_flags = COALESCE($17, censorship_flags),
          updated_at = NOW()
        WHERE id = $18
        RETURNING *
      `;

      const values = [
        name,
        subtitle,
        description,
        category,
        goods_type,
        price_fic !== undefined ? parseFloat(price_fic) : null,
        price_fiat !== undefined ? parseFloat(price_fiat) : null,
        stock_quantity !== undefined ? parseInt(stock_quantity, 10) : null,
        images ? (Array.isArray(images) ? images : [images]) : null,
        video_urls ? (Array.isArray(video_urls) ? video_urls : [video_urls]) : null,
        specifications ? JSON.stringify(specifications) : null,
        service_details ? JSON.stringify(service_details) : null,
        status,
        curated_stores ? (Array.isArray(curated_stores) ? curated_stores : [curated_stores]) : null,
        store_scheduling ? JSON.stringify(store_scheduling) : null,
        vetting_status,
        censorship_flags ? JSON.stringify(censorship_flags) : null,
        id
      ];

      const result = await getPool().query(updateQuery, values);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logErr('Error in CatalogController.updateCatalogProduct:', error);
      res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
    }
  }

  /**
   * DELETE /api/catalog/general/:id
   */
  async deleteCatalogProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await getPool().query(
        'DELETE FROM general_product_catalog WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      res.status(200).json({ success: true, message: 'Product removed from catalog', data: result.rows[0] });
    } catch (error) {
      logErr('Error in CatalogController.deleteCatalogProduct:', error);
      res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
    }
  }

  /**
   * POST /api/catalog/general/:id/curate
   * Curate / pick product for specific stores & configure timing/scheduling
   */
  async curateStoreAllocation(req, res) {
    try {
      const { id } = req.params;
      const { curated_stores, store_scheduling } = req.body;

      if (!Array.isArray(curated_stores)) {
        return res.status(400).json({ success: false, message: 'curated_stores must be an array of store keys' });
      }

      const updateQuery = `
        UPDATE general_product_catalog
        SET curated_stores = $1,
            store_scheduling = COALESCE($2, store_scheduling),
            updated_at = NOW()
        WHERE id = $3
        RETURNING *
      `;

      const result = await getPool().query(updateQuery, [
        curated_stores,
        store_scheduling ? JSON.stringify(store_scheduling) : null,
        id
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Store curation and scheduling updated',
        data: result.rows[0]
      });
    } catch (error) {
      logErr('Error in CatalogController.curateStoreAllocation:', error);
      res.status(500).json({ success: false, message: 'Failed to update store curation', error: error.message });
    }
  }

  /**
   * POST /api/catalog/general/:id/restock
   */
  async restockProduct(req, res) {
    try {
      const { id } = req.params;
      const { quantity = 50, status = 'active' } = req.body;

      const result = await getPool().query(`
        UPDATE general_product_catalog
        SET stock_quantity = stock_quantity + $1,
            status = CASE WHEN status = 'out_of_stock' THEN 'active' ELSE status END,
            updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `, [parseInt(quantity, 10), id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      res.status(200).json({
        success: true,
        message: `Restocked ${quantity} units`,
        data: result.rows[0]
      });
    } catch (error) {
      logErr('Error in CatalogController.restockProduct:', error);
      res.status(500).json({ success: false, message: 'Failed to restock product', error: error.message });
    }
  }

  /**
   * GET /api/catalog/marketplace
   */
  async getMarketplaceCatalog(req, res) {
    try {
      const result = await getPool().query(`
        SELECT * FROM general_product_catalog
        WHERE 'marketplace' = ANY(curated_stores)
        ORDER BY created_at DESC
      `);
      res.status(200).json({ success: true, data: result.rows, total: result.rows.length });
    } catch (error) {
      logErr('Error in CatalogController.getMarketplaceCatalog:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve marketplace catalog', error: error.message });
    }
  }

  /**
   * GET /api/catalog/flamingo
   */
  async getFlamingoCatalog(req, res) {
    try {
      const result = await getPool().query(`
        SELECT * FROM general_product_catalog
        WHERE 'flamingo' = ANY(curated_stores)
        ORDER BY created_at DESC
      `);
      res.status(200).json({ success: true, data: result.rows, total: result.rows.length });
    } catch (error) {
      logErr('Error in CatalogController.getFlamingoCatalog:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve flamingo catalog', error: error.message });
    }
  }

  /**
   * GET /api/catalog/ownit
   */
  async getOwnitCatalog(req, res) {
    try {
      const result = await getPool().query(`
        SELECT * FROM general_product_catalog
        WHERE 'ownit' = ANY(curated_stores)
        ORDER BY created_at DESC
      `);
      res.status(200).json({ success: true, data: result.rows, total: result.rows.length });
    } catch (error) {
      logErr('Error in CatalogController.getOwnitCatalog:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve ownit catalog', error: error.message });
    }
  }

  /**
   * GET /api/catalog/storefront
   * General Storefront Product Catalogue with vetting states
   */
  async getStorefrontCatalog(req, res) {
    try {
      const { vetting } = req.query;
      let query = `SELECT * FROM general_product_catalog WHERE 'storefront' = ANY(curated_stores)`;
      const params = [];

      if (vetting && vetting !== 'all') {
        params.push(vetting);
        query += ` AND vetting_status = $${params.length}`;
      }

      query += ' ORDER BY created_at DESC';
      const result = await getPool().query(query, params);

      res.status(200).json({ success: true, data: result.rows, total: result.rows.length });
    } catch (error) {
      logErr('Error in CatalogController.getStorefrontCatalog:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve storefront catalog', error: error.message });
    }
  }

  /**
   * POST /api/catalog/storefront/:id/vet
   * Vet and moderate merchant storefront products
   */
  async vetStorefrontProduct(req, res) {
    try {
      const { id } = req.params;
      const { action, notes, censorship_flags } = req.body; // action: 'approve' | 'reject' | 'censor'

      let newStatus = 'approved';
      if (action === 'reject') newStatus = 'rejected';
      if (action === 'censor') newStatus = 'censored';

      const updateQuery = `
        UPDATE general_product_catalog
        SET vetting_status = $1,
            vetting_notes = COALESCE($2, vetting_notes),
            censorship_flags = COALESCE($3, censorship_flags),
            store_scheduling = jsonb_set(
              COALESCE(store_scheduling, '{}'::jsonb),
              '{storefront,vetted}',
              to_jsonb($4::boolean)
            ),
            updated_at = NOW()
        WHERE id = $5
        RETURNING *
      `;

      const isVettedApproved = newStatus === 'approved';
      const result = await getPool().query(updateQuery, [
        newStatus,
        notes || null,
        censorship_flags ? JSON.stringify(censorship_flags) : null,
        isVettedApproved,
        id
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      res.status(200).json({
        success: true,
        message: `Product vetting set to ${newStatus}`,
        data: result.rows[0]
      });
    } catch (error) {
      logErr('Error in CatalogController.vetStorefrontProduct:', error);
      res.status(500).json({ success: false, message: 'Failed to vet storefront product', error: error.message });
    }
  }

  /**
   * POST /api/catalog/general/:id/media-batch
   * Bulk select/delete/erase/freeze/blur multiple media assets
   */
  async batchManageMedia(req, res) {
    try {
      const { id } = req.params;
      const { action, media_urls = [] } = req.body;

      if (!action || !Array.isArray(media_urls) || media_urls.length === 0) {
        return res.status(400).json({ success: false, message: 'Action and non-empty media_urls array are required' });
      }

      const prodRes = await getPool().query('SELECT * FROM general_product_catalog WHERE id = $1', [id]);
      if (prodRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const product = prodRes.rows[0];
      let updatedImages = product.images || [];
      let updatedVideos = product.video_urls || [];
      let censorshipFlags = product.censorship_flags || {};
      let frozenUrls = censorshipFlags.frozen_urls || [];

      if (action === 'delete') {
        updatedImages = updatedImages.filter((u) => !media_urls.includes(u));
        updatedVideos = updatedVideos.filter((u) => !media_urls.includes(u));
        frozenUrls = frozenUrls.filter((u) => !media_urls.includes(u));
      } else if (action === 'freeze' || action === 'blur') {
        media_urls.forEach((u) => {
          if (!frozenUrls.includes(u)) frozenUrls.push(u);
        });
        censorshipFlags.blurred = true;
      } else if (action === 'unfreeze' || action === 'restore') {
        frozenUrls = frozenUrls.filter((u) => !media_urls.includes(u));
        if (frozenUrls.length === 0) {
          censorshipFlags.blurred = false;
        }
      }

      censorshipFlags.frozen_urls = frozenUrls;

      const updateRes = await getPool().query(
        `UPDATE general_product_catalog 
         SET images = $1, video_urls = $2, censorship_flags = $3, updated_at = NOW() 
         WHERE id = $4 RETURNING *`,
        [updatedImages, updatedVideos, JSON.stringify(censorshipFlags), id]
      );

      res.status(200).json({
        success: true,
        message: `Media batch action "${action}" successfully executed on ${media_urls.length} item(s)`,
        data: updateRes.rows[0]
      });
    } catch (error) {
      logErr('Error in CatalogController.batchManageMedia:', error);
      res.status(500).json({ success: false, message: 'Failed to process media batch operation', error: error.message });
    }
  }
}

module.exports = new CatalogController();
