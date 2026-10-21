/**
 * Storefront Controller
 * Complete Merchant Storefront Management for FingerMobile Protocol™
 * Strictly PostgreSQL
 */

const db = require('../db');
const logger = require('../utils/logger');
const { randomUUID } = require('crypto');

const logErr = (msg, err) => {
  if (logger && typeof logger.error === 'function') {
    logger.error(msg, err);
  }
};

const getPool = () => db.pool || db;

class StorefrontController {
  constructor() {
    this.getStores = this.getStores.bind(this);
    this.getStoreByIdOrSlug = this.getStoreByIdOrSlug.bind(this);
    this.createStore = this.createStore.bind(this);
    this.updateStore = this.updateStore.bind(this);
    this.deleteStore = this.deleteStore.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getProductDetail = this.getProductDetail.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.getOrders = this.getOrders.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.updateOrderStatus = this.updateOrderStatus.bind(this);
    this.processOrderClawback = this.processOrderClawback.bind(this);
    this.getInventory = this.getInventory.bind(this);
    this.restockInventory = this.restockInventory.bind(this);
    this.adjustInventory = this.adjustInventory.bind(this);
    this.getStats = this.getStats.bind(this);
    this.getTrackingShipments = this.getTrackingShipments.bind(this);
    this.createTrackingShipment = this.createTrackingShipment.bind(this);
    this.updateTrackingStatus = this.updateTrackingStatus.bind(this);

    // Aliases for compatibility
    this.getAll = this.getStores;
    this.getById = this.getStoreByIdOrSlug;
    this.getStore = this.getStoreByIdOrSlug;
    this.create = this.createStore;
    this.update = this.updateStore;
    this.delete = this.deleteStore;
    this.getMyOrders = this.getOrders;
    this.getStoreProducts = this.getProducts;
  }

  /**
   * GET /api/storefront or /api/storefront/stores
   */
  async getStores(req, res) {
    try {
      const { limit = 50, offset = 0, is_verified } = req.query;

      let query = `
        SELECT s.*, 
               COALESCE(s.cover_image_url, s.banner_url) as "coverImageUrl",
               COALESCE(s.cover_image_url, s.banner_url) as cover_image_url,
               COALESCE(u.username, 'Verified Creator') as owner_name,
               COALESCE(u.username, 'creator') as owner_username,
               COALESCE(s.logo_url, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80') as owner_avatar
        FROM storefronts s
        LEFT JOIN users u ON s.owner_id::text = u.id::text
        WHERE s.is_active = true
      `;
      const params = [];

      if (is_verified !== undefined) {
        params.push(is_verified === 'true');
        query += ` AND s.is_verified = $${params.length}`;
      }

      query += ` ORDER BY s.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(parseInt(limit, 10), parseInt(offset, 10));

      const result = await getPool().query(query, params);
      const rows = result?.rows || [];

      // Map owner sub-object for frontend compatibility
      const mapped = rows.map(r => ({
        ...r,
        owner: {
          id: r.owner_id,
          name: r.owner_name,
          membername: r.owner_username,
          avatarUrl: r.owner_avatar,
          animatedAvatarUrl: r.owner_avatar,
          isVerified: r.is_verified,
          stats: {
            followers: r.follower_count || 0,
            posts: r.product_count || 0
          }
        }
      }));

      res.status(200).json({
        success: true,
        storefronts: mapped,
        stores: mapped,
        data: mapped,
        total: mapped.length,
        count: mapped.length
      });
    } catch (error) {
      logErr('Error in StorefrontController.getStores:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve storefronts', error: error.message });
    }
  }

  /**
   * GET /api/storefront/:id or :slug
   */
  async getStoreByIdOrSlug(req, res) {
    try {
      const identifier = req.params.id || req.params.slug;
      if (!identifier) {
        return res.status(400).json({ success: false, message: 'Identifier required' });
      }

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
      const query = isUuid
        ? 'SELECT s.*, COALESCE(s.cover_image_url, s.banner_url) as cover_image_url FROM storefronts s WHERE s.id = $1 AND s.is_active = true'
        : 'SELECT s.*, COALESCE(s.cover_image_url, s.banner_url) as cover_image_url FROM storefronts s WHERE s.slug = $1 AND s.is_active = true';

      const storeResult = await getPool().query(query, [identifier]);
      if (!storeResult.rows || storeResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Storefront not found' });
      }

      const store = storeResult.rows[0];

      // Fetch store products
      const prodResult = await getPool().query(
        'SELECT * FROM storefront_products WHERE storefront_id = $1 AND status = \'active\' ORDER BY created_at DESC',
        [store.id]
      );

      const products = (prodResult.rows || []).map(p => {
        let imgs = [];
        try {
          imgs = Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : []);
        } catch {
          imgs = [];
        }
        return {
          ...p,
          price: parseFloat(p.price || 0),
          imageUrl: imgs[0] || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
          images: imgs
        };
      });

      const responseData = {
        ...store,
        coverImageUrl: store.cover_image_url || store.banner_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
        productCount: products.length,
        followerCount: store.follower_count || 0,
        rating: parseFloat(store.rating || 0),
        owner: {
          id: store.owner_id,
          name: store.name + ' Owner',
          membername: store.slug || 'creator',
          avatarUrl: store.logo_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
          animatedAvatarUrl: store.logo_url,
          isVerified: store.is_verified,
          stats: {
            followers: store.follower_count || 0,
            posts: products.length
          }
        },
        products
      };

      res.status(200).json({
        success: true,
        data: responseData,
        ...responseData
      });
    } catch (error) {
      logErr('Error in StorefrontController.getStoreByIdOrSlug:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve storefront', error: error.message });
    }
  }

  /**
   * POST /api/storefront
   */
  async createStore(req, res) {
    try {
      const ownerId = req.user?.id || req.body.owner_id;
      const {
        name,
        store_name,
        slug,
        description,
        tagline,
        business_type = 'boutique',
        currency = 'FIC',
        cover_image_url,
        logo_url
      } = req.body;

      const finalName = String(name || store_name || '').trim();
      if (!ownerId || !finalName) {
        return res.status(400).json({ success: false, message: 'Store owner and name are required' });
      }
      const allowedBusinessTypes = ['individual', 'boutique', 'brand', 'marketplace', 'dropshipper'];
      if (!allowedBusinessTypes.includes(business_type)) {
        return res.status(400).json({ success: false, message: 'Unsupported storefront business type' });
      }
      const finalSlug = slug || finalName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();

      const sql = `
        INSERT INTO storefronts (
          owner_id, name, slug, description, tagline, business_type, 
          currency, cover_image_url, banner_url, logo_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8, $9)
        RETURNING *
      `;

      const result = await getPool().query(sql, [
        ownerId, finalName, finalSlug, description || '', tagline || '',
        business_type, currency, cover_image_url || null, logo_url || null
      ]);

      res.status(201).json({
        success: true,
        message: 'Storefront created successfully',
        data: result.rows[0],
        ...result.rows[0]
      });
    } catch (error) {
      logErr('Error in StorefrontController.createStore:', error);
      res.status(500).json({ success: false, message: 'Failed to create storefront', error: error.message });
    }
  }

  /**
   * PUT /api/storefront/:storeId
   */
  async updateStore(req, res) {
    try {
      const storeId = req.params.storeId || req.params.id;
      const { name, description, tagline, cover_image_url, logo_url, is_active } = req.body;
      if (is_active !== undefined && typeof is_active !== 'boolean') {
        return res.status(400).json({ success: false, message: 'is_active must be a boolean' });
      }

      const result = await getPool().query(`
        UPDATE storefronts
        SET name = COALESCE($1, name),
            description = COALESCE($2, description),
            tagline = COALESCE($3, tagline),
            cover_image_url = COALESCE($4, cover_image_url),
            banner_url = COALESCE($4, banner_url),
            logo_url = COALESCE($5, logo_url),
            is_active = COALESCE($6, is_active),
            updated_at = NOW()
        WHERE id::text = $7::text OR slug = $7::text
        RETURNING *
      `, [name, description, tagline, cover_image_url, logo_url, is_active, storeId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Storefront not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Storefront updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logErr('Error in StorefrontController.updateStore:', error);
      res.status(500).json({ success: false, message: 'Failed to update storefront', error: error.message });
    }
  }

  /**
   * DELETE /api/storefront/:storeId
   */
  async deleteStore(req, res) {
    try {
      const storeId = req.params.storeId || req.params.id;
      const result = await getPool().query(
        'DELETE FROM storefronts WHERE id::text = $1::text OR slug = $1::text RETURNING id',
        [storeId]
      );
      if (!result.rowCount) {
        return res.status(404).json({ success: false, message: 'Storefront not found' });
      }
      res.status(200).json({ success: true, message: 'Storefront deleted successfully' });
    } catch (error) {
      logErr('Error in StorefrontController.deleteStore:', error);
      res.status(500).json({ success: false, message: 'Failed to delete storefront', error: error.message });
    }
  }

  /**
   * GET /api/storefront/products or /api/storefront/products/:storeId
   */
  async getProducts(req, res) {
    try {
      const storeId = req.params.storeId || req.params.storefrontId;
      const { status } = req.query;

      let query = `
        SELECT p.*, s.name as store_name, s.slug as store_slug,
               COALESCE(i.quantity - i.reserved_quantity, 0) as stock,
               i.id as inventory_id,
               i.reorder_point
        FROM storefront_products p
        JOIN storefronts s ON p.storefront_id = s.id AND s.is_active = true
        LEFT JOIN LATERAL (
          SELECT id, quantity, reserved_quantity, reorder_point
          FROM storefront_inventory
          WHERE product_id = p.id
          ORDER BY created_at DESC
          LIMIT 1
        ) i ON true
        WHERE 1=1
      `;
      const params = [];

      if (storeId) {
        params.push(storeId);
        query += ` AND (p.storefront_id::text = $${params.length}::text OR s.slug = $${params.length}::text)`;
      }

      if (status) {
        params.push(status);
        query += ` AND p.status = $${params.length}`;
      } else {
        query += ' AND p.status = \'active\'';
      }

      query += ' ORDER BY p.created_at DESC';

      const result = await getPool().query(query, params);
      const rows = (result?.rows || []).map(p => {
        let imgs = [];
        try {
          imgs = Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : []);
        } catch {
          imgs = [];
        }
        return {
          ...p,
          price: parseFloat(p.price || 0),
          imageUrl: imgs[0] || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
          images: imgs,
          stock: Number(p.stock || 0)
        };
      });

      res.status(200).json({
        success: true,
        data: rows,
        products: rows,
        total: rows.length
      });
    } catch (error) {
      logErr('Error in StorefrontController.getProducts:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve products', error: error.message });
    }
  }

  /**
   * GET /api/storefront/products/detail/:productId or /api/storefront/products/:productId
   */
  async getProductDetail(req, res) {
    try {
      const productId = req.params.productId || req.params.id;
      const result = await getPool().query(
        `SELECT p.* FROM storefront_products p
         JOIN storefronts s ON s.id = p.storefront_id
         WHERE p.id = $1 AND p.status = 'active' AND s.is_active = true`,
        [productId]
      );

      if (!result.rows || result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const p = result.rows[0];
      let imgs = [];
      try {
        imgs = Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images) : []);
      } catch {
        imgs = [];
      }

      res.status(200).json({
        success: true,
        data: {
          ...p,
          price: parseFloat(p.price || 0),
          imageUrl: imgs[0] || '',
          images: imgs
        }
      });
    } catch (error) {
      logErr('Error in StorefrontController.getProductDetail:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve product', error: error.message });
    }
  }

  /**
   * POST /api/storefront/products or /api/storefront/products/:storeId
   */
  async addProduct(req, res) {
    let client;
    try {
      client = await getPool().connect();
      const storeId = req.params.storeId || req.params.storefrontId || req.body.store_id || req.body.storefront_id;
      const {
        name,
        description,
        short_description,
        price,
        compare_at_price,
        category = 'General',
        sku,
        images = [],
        stock = 0,
        reorder_point = 5,
        goods_type = 'physical'
      } = req.body;

      if (!name || price === undefined) {
        return res.status(400).json({ success: false, message: 'Name and price are required' });
      }
      const initialStock = Number(stock);
      const reorderPoint = Number(reorder_point);
      if (!Number.isInteger(initialStock) || initialStock < 0 || !Number.isInteger(reorderPoint) || reorderPoint < 0) {
        return res.status(400).json({ success: false, message: 'Stock and reorder point must be non-negative integers' });
      }
      if (!['physical', 'digital', 'service'].includes(goods_type)) {
        return res.status(400).json({ success: false, message: 'Goods type must be physical, digital, or service' });
      }

      // If storeId is missing, pick the first active storefront
      let targetStoreId = storeId;
      if (!targetStoreId) {
        const firstStore = await client.query('SELECT id FROM storefronts WHERE is_active = true ORDER BY created_at LIMIT 1');
        targetStoreId = firstStore.rows?.[0]?.id;
      }

      if (!targetStoreId) {
        return res.status(400).json({ success: false, message: 'Target storefront required' });
      }

      const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
      const imgsJson = JSON.stringify(Array.isArray(images) ? images : [images]);

      await client.query('BEGIN');
      const sql = `
        INSERT INTO storefront_products (
          storefront_id, name, slug, description, short_description, price, 
          compare_at_price, currency, sku, category, images, goods_type, requires_shipping,
          status, visibility, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'FIC', $8, $9, $10::jsonb, $11, $12, 'active', 'visible', NOW(), NOW())
        RETURNING *
      `;

      const result = await client.query(sql, [
        targetStoreId, name, slug, description || '', short_description || '',
        parseFloat(price), compare_at_price ? parseFloat(compare_at_price) : null,
        sku || 'SKU-' + Date.now(), category, imgsJson, goods_type, goods_type === 'physical'
      ]);

      const newProd = result.rows[0];
      const inventory = await client.query(
        `INSERT INTO storefront_inventory (
           id, product_id, quantity, reserved_quantity, reorder_point,
           status, created_at, updated_at
         )
         VALUES (gen_random_uuid(), $1, $2, 0, $3, $4, NOW(), NOW())
         RETURNING id`,
        [newProd.id, initialStock, reorderPoint, initialStock > 0 ? 'in_stock' : 'out_of_stock']
      );

      // Update product count on store
      await client.query(
        'UPDATE storefronts SET product_count = COALESCE(product_count, 0) + 1 WHERE id = $1',
        [targetStoreId]
      );
      await client.query(
        `INSERT INTO storefront_inventory_logs (
           inventory_id, change_type, quantity_change, previous_quantity, new_quantity, reason, notes
         )
         VALUES ($1, 'adjustment', $2, 0, $2, 'Initial product stock', 'Catalog product creation')`,
        [inventory.rows[0].id, initialStock]
      );
      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: {
          ...newProd,
          stock: initialStock,
          inventory_id: inventory.rows[0].id,
          reorder_point: reorderPoint
        }
      });
    } catch (error) {
      if (client) await client.query('ROLLBACK');
      logErr('Error in StorefrontController.addProduct:', error);
      res.status(500).json({ success: false, message: 'Failed to add product', error: error.message });
    } finally {
      client?.release();
    }
  }

  /**
   * PUT /api/storefront/products/:productId
   */
  async updateProduct(req, res) {
    try {
      const productId = req.params.productId || req.params.id;
      const { name, description, price, category, status } = req.body;

      const result = await getPool().query(`
        UPDATE storefront_products
        SET name = COALESCE($1, name),
            description = COALESCE($2, description),
            price = COALESCE($3, price),
            category = COALESCE($4, category),
            status = COALESCE($5, status),
            updated_at = NOW()
        WHERE id = $6
        RETURNING *
      `, [name, description, price !== undefined && price !== null ? parseFloat(price) : null, category, status, productId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logErr('Error in StorefrontController.updateProduct:', error);
      res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
    }
  }

  /**
   * DELETE /api/storefront/products/:productId
   */
  async deleteProduct(req, res) {
    let client;
    try {
      client = await getPool().connect();
      const productId = req.params.productId || req.params.id;
      await client.query('BEGIN');
      const deleted = await client.query(
        'DELETE FROM storefront_products WHERE id = $1 RETURNING storefront_id',
        [productId]
      );
      if (!deleted.rowCount) {
        await client.query('ROLLBACK');
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      await client.query(
        'UPDATE storefronts SET product_count = GREATEST(COALESCE(product_count, 0) - 1, 0) WHERE id = $1',
        [deleted.rows[0].storefront_id]
      );
      await client.query('COMMIT');
      res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      if (client) await client.query('ROLLBACK');
      logErr('Error in StorefrontController.deleteProduct:', error);
      res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message });
    } finally {
      client?.release();
    }
  }

  /**
   * GET /api/storefront/orders or /api/storefront/orders/:storeId
   */
  async getOrders(req, res) {
    try {
      const storeId = req.params.storeId || req.params.storefrontId;
      const { status } = req.query;

      let query = `SELECT o.* FROM storefront_orders o
                   LEFT JOIN storefronts s ON s.id = o.storefront_id
                   WHERE 1=1`;
      const params = [];

      if (storeId) {
        params.push(storeId);
        query += ` AND (o.storefront_id::text = $${params.length}::text OR s.slug = $${params.length}::text)`;
      }

      if (status) {
        params.push(status);
        query += ` AND o.status = $${params.length}`;
      }

      query += ' ORDER BY o.created_at DESC';

      const result = await getPool().query(query, params);
      const orders = (result.rows || []).map(o => ({
        ...o,
        total: parseFloat(o.total || 0),
        subtotal: parseFloat(o.subtotal || 0),
        tax: parseFloat(o.tax || 0)
      }));

      res.status(200).json({
        success: true,
        data: orders,
        orders,
        total: orders.length
      });
    } catch (error) {
      logErr('Error in StorefrontController.getOrders:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve orders', error: error.message });
    }
  }

  /**
   * POST /api/storefront/orders
   */
  async createOrder(req, res) {
    let client;
    try {
      const {
        storefront_id,
        storefrontId,
        customer_name,
        customerName,
        product_name,
        items = [],
        total,
        totalAmount,
        shipping_address,
        payment_method = 'FIC',
        currency = 'FIC'
      } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'At least one order item is required' });
      }
      const finalTotal = Number(total ?? totalAmount);
      if (!Number.isFinite(finalTotal) || finalTotal <= 0) {
        return res.status(400).json({ success: false, message: 'A positive order total is required' });
      }
      if (typeof currency !== 'string' || !/^[A-Z]{3,10}$/.test(currency)) {
        return res.status(400).json({ success: false, message: 'Order currency must be a 3-10 character uppercase code' });
      }
      const finalCustomerName = String(customer_name || customerName || req.user?.username || req.user?.display_name || '').trim();
      if (!finalCustomerName) {
        return res.status(400).json({ success: false, message: 'Customer name is required' });
      }

      let finalStoreId = storefront_id || storefrontId;
      if (!finalStoreId) {
        const productIds = [...new Set(items.map(item => item?.productId || item?.id).filter(id => /^[0-9a-f-]{36}$/i.test(String(id))))];
        if (productIds.length) {
          const stores = await getPool().query(
            `SELECT DISTINCT storefront_id
             FROM storefront_products
             WHERE id = ANY($1::uuid[]) AND status = 'active'`,
            [productIds]
          );
          if (stores.rowCount === 1) finalStoreId = stores.rows[0].storefront_id;
          else if (stores.rowCount > 1) {
            return res.status(400).json({ success: false, message: 'An order cannot include products from multiple storefronts' });
          }
        }
      }
      if (!finalStoreId) {
        return res.status(400).json({ success: false, message: 'A storefront is required for the order' });
      }

      const firstItem = items[0] || {};
      const firstItemName = firstItem.productName || firstItem.name || 'Storefront order';
      let address = shipping_address || {};
      if (typeof shipping_address === 'string') {
        try {
          address = JSON.parse(shipping_address);
        } catch {
          address = { address: shipping_address };
        }
      }
      if (!address || typeof address !== 'object' || Array.isArray(address)) {
        address = {};
      }
      client = await getPool().connect();
      await client.query('BEGIN');
      const store = await client.query(
        'SELECT id, name FROM storefronts WHERE (id::text = $1::text OR slug = $1::text) AND is_active = true FOR SHARE',
        [finalStoreId]
      );
      if (!store.rowCount) {
        await client.query('ROLLBACK');
        return res.status(404).json({ success: false, message: 'Active storefront not found' });
      }
      finalStoreId = store.rows[0].id;
      const result = await client.query(
        `INSERT INTO storefront_orders (
           storefront_id, customer_name, product_name, items, total, subtotal, tax,
           status, payout_status, payment_method, shipping_address, currency, created_at, updated_at
         )
         VALUES ($1, $2, $3, $4::jsonb, $5, $5, 0, 'Pending', 'pending', $6, $7::jsonb, $8, NOW(), NOW())
         RETURNING *`,
        [
          finalStoreId,
          finalCustomerName,
          product_name || firstItemName,
          JSON.stringify(items),
          finalTotal,
          payment_method,
          JSON.stringify(address),
          currency
        ]
      );
      const newOrder = result.rows[0];
      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: newOrder,
        order: newOrder
      });
    } catch (error) {
      if (client) await client.query('ROLLBACK');
      logErr('Error in StorefrontController.createOrder:', error);
      res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
    } finally {
      client?.release();
    }
  }

  /**
   * PUT /api/storefront/orders/:orderId/status
   */
  async updateOrderStatus(req, res) {
    try {
      const orderId = req.params.orderId || req.params.id;
      const { status } = req.body;

      const result = await getPool().query(`
        UPDATE storefront_orders
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `, [status, orderId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Order status updated',
        data: result.rows[0]
      });
    } catch (error) {
      logErr('Error in StorefrontController.updateOrderStatus:', error);
      res.status(500).json({ success: false, message: 'Failed to update order status', error: error.message });
    }
  }

  /**
   * POST /api/storefront/orders/:orderId/clawback
   */
  async processOrderClawback(req, res) {
    try {
      const orderId = req.params.orderId;
      const { reason } = req.body;

      const result = await getPool().query(`
        UPDATE storefront_orders
        SET status = 'Cancelled', payout_status = 'clawed_back', updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `, [orderId]);

      if (!result.rowCount) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      res.status(200).json({
        success: true,
        message: 'Order clawback processed successfully',
        data: result.rows[0],
        reason
      });
    } catch (error) {
      logErr('Error in StorefrontController.processOrderClawback:', error);
      res.status(500).json({ success: false, message: 'Failed to process clawback', error: error.message });
    }
  }

  /**
   * GET /api/storefront/inventory or /api/storefront/inventory/:storeId
   */
  async getInventory(req, res) {
    try {
      const storeId = req.params.storeId || req.params.storefrontId || req.query.storefront_id;
      const params = [];
      let query = `
        SELECT i.*, p.name as "productName", p.sku, 
               COALESCE(i.quantity, 0) as quantity,
               COALESCE(i.reserved_quantity, 0) as reserved,
               COALESCE(i.available_quantity, i.quantity - i.reserved_quantity) as available
        FROM storefront_inventory i
        JOIN storefront_products p ON i.product_id = p.id
        JOIN storefronts s ON s.id = p.storefront_id AND s.is_active = true
      `;
      if (storeId) {
        params.push(storeId);
        query += ' WHERE (p.storefront_id::text = $1::text OR s.slug = $1::text)';
      }
      query += ' ORDER BY i.created_at DESC';
      const result = await getPool().query(query, params);

      res.status(200).json({
        success: true,
        data: result.rows || [],
        inventory: result.rows || []
      });
    } catch (error) {
      logErr('Error in StorefrontController.getInventory:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve inventory', error: error.message });
    }
  }

  /**
   * POST /api/storefront/inventory/:inventoryId/restock
   */
  async restockInventory(req, res) {
    const { quantity = 50, notes = 'Routine restock' } = req.body || {};
    const delta = Number(quantity);
    if (!Number.isInteger(delta) || delta <= 0) {
      return res.status(400).json({ success: false, message: 'Restock quantity must be a positive integer' });
    }
    return this.adjustInventory({
      params: req.params,
      body: { delta, reason: notes }
    }, res);
  }

  /**
   * POST /api/storefront/inventory/:inventoryId/adjust
   */
  async adjustInventory(req, res) {
    let client;
    try {
      client = await getPool().connect();
      const { inventoryId } = req.params;
      const delta = Number(req.body?.delta);
      const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim().slice(0, 500) : '';
      if (!Number.isInteger(delta) || delta === 0) {
        return res.status(400).json({ success: false, message: 'Inventory adjustment must be a non-zero integer' });
      }

      await client.query('BEGIN');
      const result = await client.query(
        'SELECT * FROM storefront_inventory WHERE id = $1 FOR UPDATE',
        [inventoryId]
      );
      if (!result.rowCount) {
        await client.query('ROLLBACK');
        return res.status(404).json({ success: false, message: 'Inventory item not found' });
      }

      const current = result.rows[0];
      const previousQuantity = Number(current.quantity);
      const reservedQuantity = Number(current.reserved_quantity || 0);
      const newQuantity = previousQuantity + delta;
      if (newQuantity < reservedQuantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ success: false, message: 'Adjustment cannot reduce stock below reserved quantity' });
      }

      const updated = await client.query(
        `UPDATE storefront_inventory
         SET quantity = $1,
             status = $2,
             last_restocked_date = CASE WHEN $3 > 0 THEN CURRENT_DATE ELSE last_restocked_date END,
             updated_at = NOW()
         WHERE id = $4
         RETURNING *`,
        [
          newQuantity,
          newQuantity === 0 ? 'out_of_stock' : newQuantity <= Number(current.reorder_point || 0) ? 'low_stock' : 'in_stock',
          delta,
          inventoryId
        ]
      );
      await client.query(
        `INSERT INTO storefront_inventory_logs (
           inventory_id, change_type, quantity_change, previous_quantity, new_quantity, reason
         )
         VALUES ($1, 'adjustment', $2, $3, $4, $5)`,
        [inventoryId, delta, previousQuantity, newQuantity, reason || 'Merchant inventory adjustment']
      );
      await client.query('COMMIT');
      return res.status(200).json({
        success: true,
        message: 'Inventory adjusted successfully',
        data: updated.rows[0]
      });
    } catch (error) {
      if (client) await client.query('ROLLBACK');
      logErr('Error in StorefrontController.adjustInventory:', error);
      return res.status(500).json({ success: false, message: 'Failed to adjust inventory', error: error.message });
    } finally {
      client?.release();
    }
  }

  /**
   * GET /api/storefront/stats or /api/storefront/analytics/:storeId
   */
  async getStats(req, res) {
    try {
      const storeId = req.params.storeId || req.query.store_id;
      const params = storeId ? [storeId] : [];
      const scopedWhere = storeId ? 'WHERE storefront_id::text = $1::text' : '';
      const [ordersResult, productsResult, inventoryResult, ratingResult, analyticsResult, chartResult] = await Promise.all([
        getPool().query(
          `SELECT
             COUNT(*)::int AS total_orders,
             COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE)::int AS today_orders,
             COALESCE(SUM(total) FILTER (
               WHERE LOWER(COALESCE(status, '')) NOT IN ('cancelled', 'canceled', 'refunded')
             ), 0) AS total_revenue,
             COALESCE(SUM(total) FILTER (
               WHERE created_at >= CURRENT_DATE
                 AND LOWER(COALESCE(status, '')) NOT IN ('cancelled', 'canceled', 'refunded')
             ), 0) AS today_revenue
           FROM storefront_orders
           ${scopedWhere}`,
          params
        ),
        getPool().query(
          `SELECT COUNT(*)::int AS total_products
           FROM storefront_products
           ${storeId ? 'WHERE storefront_id::text = $1::text AND status = \'active\'' : 'WHERE status = \'active\''}`,
          params
        ),
        getPool().query(
          `SELECT COUNT(*)::int AS low_stock_items
           FROM storefront_inventory i
           JOIN storefront_products p ON p.id = i.product_id AND p.status = 'active'
           ${storeId ? 'WHERE p.storefront_id::text = $1::text AND i.quantity <= i.reorder_point AND i.status <> \'discontinued\'' : 'WHERE i.quantity <= i.reorder_point AND i.status <> \'discontinued\''}`,
          params
        ),
        getPool().query(
          `SELECT COALESCE(AVG(rating), 0) AS average_rating
           FROM storefronts
           ${storeId ? 'WHERE id::text = $1::text AND is_active = true' : 'WHERE is_active = true'}`,
          params
        ),
        getPool().query(
          `SELECT
             COALESCE(SUM(unique_visitors), 0)::int AS total_visitors,
             COALESCE(AVG(conversion_rate) FILTER (WHERE date >= CURRENT_DATE - INTERVAL '6 days'), 0) AS conversion_rate
           FROM storefront_analytics_daily
           ${scopedWhere}`,
          params
        ),
        getPool().query(
          `SELECT date, COALESCE(SUM(total_revenue), 0) AS revenue
           FROM storefront_analytics_daily
           ${storeId ? 'WHERE storefront_id::text = $1::text AND date >= CURRENT_DATE - INTERVAL \'6 days\'' : 'WHERE date >= CURRENT_DATE - INTERVAL \'6 days\''}
           GROUP BY date
           ORDER BY date`,
          params
        )
      ]);
      const orders = ordersResult.rows[0];
      const analytics = analyticsResult.rows[0];
      const stats = {
        totalProducts: Number(productsResult.rows[0].total_products),
        totalRevenue: Number(orders.total_revenue),
        todayRevenue: Number(orders.today_revenue),
        totalOrders: Number(orders.total_orders),
        todayOrders: Number(orders.today_orders),
        totalVisitors: Number(analytics.total_visitors),
        conversionRate: Number(analytics.conversion_rate),
        avgRating: Number(ratingResult.rows[0].average_rating),
        lowStockItems: Number(inventoryResult.rows[0].low_stock_items),
        revenueChart: chartResult.rows.map(row => ({
          date: row.date,
          revenue: Number(row.revenue)
        }))
      };

      res.status(200).json({
        success: true,
        data: stats,
        ...stats
      });
    } catch (error) {
      logErr('Error in StorefrontController.getStats:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve stats', error: error.message });
    }
  }

  /**
   * Seeded / in-memory store for tracking shipments when DB is syncing or offline
   */
  getInitialShipments() {
    return [
      {
        id: 1,
        tracking_number: 'FM-TRK-882914',
        order_id: 'ORD-2026-8812',
        storefront_id: 'sf-1',
        storefront_name: 'Flamingo Fashion & Lifestyle Hub',
        customer_name: 'Chidi Nnamdi',
        carrier: 'DHL Express',
        status: 'in-transit',
        origin: 'Lagos Dispatch Hub 1',
        destination: 'Maitama, Abuja, Nigeria',
        current_location: {
          country: 'Nigeria',
          state: 'Abuja FCT',
          area: 'Abuja Central Sort Facility',
          lat: 9.0765,
          lng: 7.3986
        },
        estimated_arrival: '2026-10-16 14:00',
        total: 285.00,
        currency: 'FIC',
        items: [
          { title: 'Limited Edition Flamingo Bomber Jacket', qty: 1, price: 185 },
          { title: 'Silk Embroidered Scarf', qty: 2, price: 50 }
        ],
        status_updates: [
          { id: 1, status: 'Order Placed', description: 'Order confirmed and verified via FingerMobile Protocol', alert_level: 'info', created_at: '2026-10-13T09:12:00Z' },
          { id: 2, status: 'Picked & Packed', description: 'Items securely packaged at Flamingo Fulfilment Center', alert_level: 'info', created_at: '2026-10-13T14:30:00Z' },
          { id: 3, status: 'Dispatched', description: 'Handed over to DHL Express courier node', alert_level: 'info', created_at: '2026-10-14T08:00:00Z' },
          { id: 4, status: 'In-Transit', description: 'Shipment in transit to regional sorting center', alert_level: 'info', created_at: '2026-10-14T16:45:00Z' }
        ]
      },
      {
        id: 2,
        tracking_number: 'FM-TRK-771902',
        order_id: 'ORD-2026-8799',
        storefront_id: 'sf-2',
        storefront_name: 'Dancia Official Merch & Audio',
        customer_name: 'Zainab Al-Mansoor',
        carrier: 'GIG Logistics',
        status: 'shipped',
        origin: 'Port Harcourt Distribution Center',
        destination: 'Lekki Phase 1, Lagos, Nigeria',
        current_location: {
          country: 'Nigeria',
          state: 'Rivers',
          area: 'PH Fulfilment Hub',
          lat: 4.8156,
          lng: 7.0498
        },
        estimated_arrival: '2026-10-17 11:30',
        total: 420.00,
        currency: 'FIC',
        items: [
          { title: 'Beatwave Studio Wireless Headphones', qty: 1, price: 320 },
          { title: 'Dancia Signature Vinyl', qty: 1, price: 100 }
        ],
        status_updates: [
          { id: 1, status: 'Order Placed', description: 'Order paid with FIC Tokens (Tx: 0x9f...a12)', alert_level: 'info', created_at: '2026-10-14T11:00:00Z' },
          { id: 2, status: 'Shipped', description: 'Package manifested and courier assigned', alert_level: 'info', created_at: '2026-10-14T18:20:00Z' }
        ]
      },
      {
        id: 3,
        tracking_number: 'FM-TRK-663180',
        order_id: 'ORD-2026-8654',
        storefront_id: 'sf-3',
        storefront_name: 'Sovereign Tech & Wearables',
        customer_name: 'David Adeleke',
        carrier: 'FedEx Priority',
        status: 'delivered',
        origin: 'Ikeja Tech Terminal',
        destination: 'Ikoyi, Lagos, Nigeria',
        current_location: {
          country: 'Nigeria',
          state: 'Lagos',
          area: 'Ikoyi Delivery Point',
          lat: 6.4549,
          lng: 3.4246
        },
        estimated_arrival: 'Delivered (Oct 14, 2026)',
        total: 650.00,
        currency: 'USDT',
        items: [
          { title: 'FingerLux Biometric Smart Ring - Stealth Black', qty: 1, price: 650 }
        ],
        status_updates: [
          { id: 1, status: 'Order Placed', description: 'Order confirmed', alert_level: 'info', created_at: '2026-10-12T08:15:00Z' },
          { id: 2, status: 'Dispatched', description: 'Departed hub', alert_level: 'info', created_at: '2026-10-13T10:00:00Z' },
          { id: 3, status: 'Out for Delivery', description: 'Courier on route to destination', alert_level: 'info', created_at: '2026-10-14T09:30:00Z' },
          { id: 4, status: 'Delivered', description: 'Package signed and received by recipient', alert_level: 'info', created_at: '2026-10-14T13:45:00Z' }
        ]
      },
      {
        id: 4,
        tracking_number: 'FM-TRK-554219',
        order_id: 'ORD-2026-8910',
        storefront_id: 'sf-4',
        storefront_name: 'Lush Plushies & Comfort Gifts',
        customer_name: 'Amina Yusuf',
        carrier: 'DHL Express',
        status: 'delayed',
        origin: 'Kano Express Gateway',
        destination: 'Enugu City Center, Nigeria',
        current_location: {
          country: 'Nigeria',
          state: 'Plateau',
          area: 'Jos Waypoint Facility',
          lat: 9.8965,
          lng: 8.8583
        },
        estimated_arrival: '2026-10-18 16:00 (Rescheduled)',
        total: 180.00,
        currency: 'FIC',
        items: [
          { title: 'Giant Lush Cloud Bear (Lavender Edition)', qty: 1, price: 120 },
          { title: 'Aromatherapy Scent Pack', qty: 2, price: 30 }
        ],
        status_updates: [
          { id: 1, status: 'Order Placed', description: 'Order verified', alert_level: 'info', created_at: '2026-10-11T12:00:00Z' },
          { id: 2, status: 'In-Transit', description: 'Transferred between transit hubs', alert_level: 'info', created_at: '2026-10-13T07:30:00Z' },
          { id: 3, status: 'Delayed', description: 'Severe weather alert along expressway; transport paused for driver safety', alert_level: 'warning', created_at: '2026-10-14T11:20:00Z' }
        ]
      },
      {
        id: 5,
        tracking_number: 'FM-TRK-449102',
        order_id: 'ORD-2026-9011',
        storefront_id: 'sf-1',
        storefront_name: 'Flamingo Fashion & Lifestyle Hub',
        customer_name: 'Tariq Edwards',
        carrier: 'GIG Logistics',
        status: 'processing',
        origin: 'Flamingo Central Fulfillment',
        destination: 'Calabar, Cross River, Nigeria',
        current_location: {
          country: 'Nigeria',
          state: 'Lagos',
          area: 'Fulfillment Packing Zone',
          lat: 6.5244,
          lng: 3.3792
        },
        estimated_arrival: '2026-10-19 12:00',
        total: 95.00,
        currency: 'FIC',
        items: [
          { title: 'Eco-Cotton Minimalist Cap & Tee', qty: 1, price: 95 }
        ],
        status_updates: [
          { id: 1, status: 'Processing', description: 'Order received; awaiting final courier pickup', alert_level: 'info', created_at: '2026-10-14T15:00:00Z' }
        ]
      }
    ];
  }

  /**
   * GET /api/storefront/tracking
   */
  async getTrackingShipments(req, res) {
    try {
      const storeId = req.params.storeId || req.params.storefrontId || req.query.storefront_id;
      const params = storeId ? [storeId] : [];
      const result = await getPool().query(
        `SELECT sh.*, s.name AS storefront_name, o.customer_name, o.product_name,
                o.items, o.total, o.currency
         FROM storefront_shipments sh
         JOIN storefronts s ON s.id = sh.storefront_id
         JOIN storefront_orders o ON o.id = sh.order_id
         ${storeId ? 'WHERE sh.storefront_id::text = $1::text' : ''}
         ORDER BY sh.created_at DESC`,
        params
      );
      return res.status(200).json({
        success: true,
        data: result.rows,
        shipments: result.rows,
        count: result.rowCount
      });
    } catch (error) {
      logErr('Error in StorefrontController.getTrackingShipments:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve shipment tracking records', error: error.message });
    }
  }

  /**
   * POST /api/storefront/tracking
   * Create / Dispatch a new shipment tracking record
   */
  async createTrackingShipment(req, res) {
    let client;
    try {
      const {
        order_id,
        storefront_id,
        tracking_number,
        carrier,
        status = 'processing',
        origin,
        destination,
        current_location,
        estimated_arrival,
      } = req.body || {};
      if (!order_id || !String(carrier || '').trim()) {
        return res.status(400).json({ success: false, message: 'Order ID and carrier are required' });
      }
      const allowedStatuses = ['processing', 'shipped', 'in-transit', 'delivered', 'delayed', 'on-hold', 'cancelled'];
      const normalizedStatus = String(status).toLowerCase().replace(/_/g, '-');
      if (!allowedStatuses.includes(normalizedStatus)) {
        return res.status(400).json({ success: false, message: 'Unsupported shipment status' });
      }
      const location = current_location && typeof current_location === 'object' && !Array.isArray(current_location)
        ? current_location
        : {};

      client = await getPool().connect();
      await client.query('BEGIN');
      const order = await client.query(
        `SELECT o.id, o.storefront_id, o.shipping_address, s.name AS storefront_name
         FROM storefront_orders o
         JOIN storefronts s ON s.id = o.storefront_id
         WHERE o.id::text = $1::text AND s.is_active = true
         FOR SHARE OF o, s`,
        [order_id]
      );
      if (!order.rowCount) {
        await client.query('ROLLBACK');
        return res.status(404).json({ success: false, message: 'Active storefront order not found' });
      }
      if (storefront_id && String(storefront_id) !== String(order.rows[0].storefront_id)) {
        await client.query('ROLLBACK');
        return res.status(400).json({ success: false, message: 'Order does not belong to the selected storefront' });
      }
      const trackingNumber = String(tracking_number || `SF-${randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase()}`).trim();
      const updates = [{
        id: 1,
        status: normalizedStatus,
        description: 'Shipment tracking record created',
        alert_level: 'info',
        created_at: new Date().toISOString()
      }];
      const result = await client.query(
        `INSERT INTO storefront_shipments (
           order_id, storefront_id, tracking_number, carrier, status, origin,
           destination, current_location, estimated_arrival, status_updates
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10::jsonb)
         RETURNING *`,
        [
          order.rows[0].id,
          order.rows[0].storefront_id,
          trackingNumber,
          String(carrier).trim(),
          normalizedStatus,
          origin || null,
          destination || (order.rows[0].shipping_address ? JSON.stringify(order.rows[0].shipping_address) : null),
          JSON.stringify(location),
          estimated_arrival || null,
          JSON.stringify(updates)
        ]
      );
      await client.query(
        'UPDATE storefront_orders SET tracking_number = $1, updated_at = NOW() WHERE id = $2',
        [trackingNumber, order.rows[0].id]
      );
      await client.query('COMMIT');

      return res.status(201).json({
        success: true,
        message: 'Shipment tracking record created successfully',
        shipment: result.rows[0],
        data: result.rows[0]
      });
    } catch (error) {
      if (client) await client.query('ROLLBACK');
      logErr('Error in StorefrontController.createTrackingShipment:', error);
      return res.status(500).json({ success: false, message: 'Failed to create shipment', error: error.message });
    } finally {
      client?.release();
    }
  }

  /**
   * PUT /api/storefront/tracking/:id/status
   * Update shipment status and log milestone updates
   */
  async updateTrackingStatus(req, res) {
    let client;
    try {
      const { id } = req.params;
      const { status, note, location, alert_level = 'info' } = req.body || {};
      const allowedStatuses = ['processing', 'shipped', 'in-transit', 'delivered', 'delayed', 'on-hold', 'cancelled'];
      const normalizedStatus = String(status || '').toLowerCase().replace(/_/g, '-');
      if (!allowedStatuses.includes(normalizedStatus)) {
        return res.status(400).json({ success: false, message: 'Unsupported shipment status' });
      }
      const alertLevels = ['info', 'warning', 'success', 'error'];
      if (!alertLevels.includes(alert_level)) {
        return res.status(400).json({ success: false, message: 'Unsupported shipment alert level' });
      }
      if (location !== undefined && (!location || typeof location !== 'object' || Array.isArray(location))) {
        return res.status(400).json({ success: false, message: 'Location must be an object' });
      }

      client = await getPool().connect();
      await client.query('BEGIN');
      const current = await client.query(
        'SELECT * FROM storefront_shipments WHERE id::text = $1::text OR tracking_number = $1::text FOR UPDATE',
        [id]
      );
      if (!current.rowCount) {
        await client.query('ROLLBACK');
        return res.status(404).json({ success: false, message: 'Shipment not found' });
      }
      const shipment = current.rows[0];
      const updates = Array.isArray(shipment.status_updates) ? shipment.status_updates : [];
      const currentLocation = shipment.current_location && typeof shipment.current_location === 'object'
        ? shipment.current_location
        : {};
      updates.push({
        id: updates.length + 1,
        status: normalizedStatus,
        description: String(note || `Shipment status changed to ${normalizedStatus}`).trim().slice(0, 500),
        alert_level,
        created_at: new Date().toISOString()
      });
      const updated = await client.query(
        `UPDATE storefront_shipments
         SET status = $1, current_location = $2::jsonb, status_updates = $3::jsonb, updated_at = NOW()
         WHERE id::text = $4::text
         RETURNING *`,
        [
          normalizedStatus,
          JSON.stringify(location ? { ...currentLocation, ...location } : currentLocation),
          JSON.stringify(updates),
          String(shipment.id)
        ]
      );
      await client.query('COMMIT');
      return res.status(200).json({
        success: true,
        message: 'Shipment status updated successfully',
        shipment: updated.rows[0],
        data: updated.rows[0]
      });
    } catch (error) {
      if (client) await client.query('ROLLBACK');
      logErr('Error in StorefrontController.updateTrackingStatus:', error);
      return res.status(500).json({ success: false, message: 'Failed to update shipment status', error: error.message });
    } finally {
      client?.release();
    }
  }
}

module.exports = new StorefrontController();
