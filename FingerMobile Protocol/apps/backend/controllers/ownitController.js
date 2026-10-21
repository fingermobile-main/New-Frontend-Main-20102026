/**
 * Ownit Controller
 * Celebrity Red-Carpet Shopping Mall for Everything Luxury (4K Media, Video Showcases,
 * Pavilions, Celebrity Stalls, Branded Shopfronts, Shops within Shops, Cryptographic Provenance)
 * FingerMobile Protocol™ - Strictly PostgreSQL
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

const getPool = () => pool || require('../db').pool;

const logErr = (msg, err) => {
  if (logger && typeof logger.error === 'function') {
    logger.error(msg, err);
  }
};

class OwnitController {
  constructor() {
    this.getStores = this.getStores.bind(this);
    this.getStoreBySlug = this.getStoreBySlug.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.votePoll = this.votePoll.bind(this);
    this.reactProduct = this.reactProduct.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.getStats = this.getStats.bind(this);
    this.getAll = this.getProducts;
    this.getById = this.getProductById;
    this.registerProduct = this.registerProduct.bind(this);
    this.submitWarrantyClaim = this.submitWarrantyClaim.bind(this);
    this.getMyClaims = this.getMyClaims.bind(this);
  }

  /**
   * GET /api/ownit/stores
   * Retrieves all celebrity stalls, branded shopfronts, shops within shops, and pavilions
   */
  async getStores(req, res) {
    try {
      const { store_type, limit = 50, offset = 0 } = req.query;
      let query = 'SELECT * FROM ownit_stores WHERE is_active = true';
      const params = [];

      if (store_type && store_type !== 'all') {
        params.push(store_type);
        query += ` AND store_type = $${params.length}`;
      }

      query += ` ORDER BY rating DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(parseInt(limit, 10), parseInt(offset, 10));

      const result = await getPool().query(query, params);
      res.json({
        success: true,
        data: result.rows,
        stores: result.rows,
        total: result.rows.length
      });
    } catch (error) {
      logErr('Error in OwnitController.getStores:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve luxury stores', error: error.message });
    }
  }

  /**
   * GET /api/ownit/stores/:slug
   */
  async getStoreBySlug(req, res) {
    try {
      const { slug } = req.params;
      const storeRes = await getPool().query(
        'SELECT * FROM ownit_stores WHERE is_active = true AND (slug = $1 OR id::text = $1)',
        [slug]
      );
      if (storeRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Store not found' });
      }
      const store = storeRes.rows[0];
      const productsRes = await getPool().query(
        'SELECT * FROM ownit_products WHERE store_id = $1 AND is_active = true ORDER BY price_usd DESC',
        [store.id]
      );
      res.json({
        success: true,
        data: {
          ...store,
          products: productsRes.rows
        }
      });
    } catch (error) {
      logErr('Error in OwnitController.getStoreBySlug:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve store', error: error.message });
    }
  }

  /**
   * GET /api/ownit/products
   * Retrieves 4K luxury goods with category, search, and rarity filters
   */
  async getProducts(req, res) {
    try {
      const { category, rarity, search, limit = 50, offset = 0 } = req.query;
      let query = `
        SELECT p.*, s.name as store_name, s.store_type, s.pavilion_location, s.curator_name
        FROM ownit_products p
        LEFT JOIN ownit_stores s ON p.store_id = s.id
        WHERE p.is_active = true
      `;
      const params = [];

      if (category && category !== 'all') {
        params.push(category);
        query += ` AND LOWER(p.category) = LOWER($${params.length})`;
      }

      if (rarity && rarity !== 'all') {
        params.push(rarity);
        query += ` AND p.rarity_level = $${params.length}`;
      }

      if (search) {
        params.push(`%${search}%`);
        query += ` AND (p.name ILIKE $${params.length} OR p.brand ILIKE $${params.length} OR p.description ILIKE $${params.length})`;
      }

      query += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(parseInt(limit, 10), parseInt(offset, 10));

      const result = await getPool().query(query, params);
      const rows = result.rows.map(p => ({
        ...p,
        id: String(p.id),
        price: parseFloat(p.price_usd || 0),
        priceFic: parseFloat(p.price_fic || 0),
        imageUrl: (p.media_4k_urls && p.media_4k_urls.length > 0) ? p.media_4k_urls[0] : 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=90',
        images: p.media_4k_urls || [],
        rating: parseFloat(p.rating || 5.0),
        authenticityLedger: {
          certNumber: p.authenticity_cert_number,
          sha256: p.cryptographic_sha256,
          serialNumber: p.serial_number,
          provenance: p.provenance_history
        }
      }));

      res.json({
        success: true,
        data: rows,
        products: rows,
        total: rows.length
      });
    } catch (error) {
      logErr('Error in OwnitController.getProducts:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve 4K luxury products', error: error.message });
    }
  }

  /**
   * GET /api/ownit/products/:id
   */
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const result = await getPool().query(
        `SELECT p.*, s.name as store_name, s.store_type, s.pavilion_location, s.curator_name
         FROM ownit_products p
         LEFT JOIN ownit_stores s ON p.store_id = s.id
         WHERE p.id::text = $1 AND p.is_active = true`,
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Luxury product not found' });
      }
      const p = result.rows[0];
      res.json({
        success: true,
        data: {
          ...p,
          id: String(p.id),
          price: parseFloat(p.price_usd || 0),
          priceFic: parseFloat(p.price_fic || 0),
          imageUrl: (p.media_4k_urls && p.media_4k_urls.length > 0) ? p.media_4k_urls[0] : null,
          images: p.media_4k_urls || [],
          authenticityLedger: {
            certNumber: p.authenticity_cert_number,
            sha256: p.cryptographic_sha256,
            serialNumber: p.serial_number,
            provenance: p.provenance_history
          }
        }
      });
    } catch (error) {
      logErr('Error in OwnitController.getProductById:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve product details', error: error.message });
    }
  }

  /**
   * POST /api/ownit/products/:id/vote
   */
  async votePoll(req, res) {
    try {
      const { id } = req.params;
      const { optionId } = req.body;

      const productRes = await getPool().query('SELECT poll_data FROM ownit_products WHERE id::text = $1', [id]);
      if (productRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      let pollData = productRes.rows[0].poll_data || {};
      if (pollData.options && Array.isArray(pollData.options)) {
        pollData.options = pollData.options.map(opt => {
          if (opt.id === optionId || String(opt.id) === String(optionId)) {
            return { ...opt, votes: (opt.votes || 0) + 1 };
          }
          return opt;
        });
        await getPool().query('UPDATE ownit_products SET poll_data = $1 WHERE id::text = $2', [pollData, id]);
      }

      res.json({ success: true, pollData });
    } catch (error) {
      logErr('Error in OwnitController.votePoll:', error);
      res.status(500).json({ success: false, message: 'Failed to vote', error: error.message });
    }
  }

  /**
   * POST /api/ownit/products/:id/react
   */
  async reactProduct(req, res) {
    try {
      const { id } = req.params;
      const { reaction } = req.body; // 'like' or 'dislike'

      const col = reaction === 'dislike' ? 'dislikes' : 'likes';
      const result = await getPool().query(
        `UPDATE ownit_products SET ${col} = ${col} + 1 WHERE id::text = $1 RETURNING likes, dislikes`,
        [id]
      );
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      logErr('Error in OwnitController.reactProduct:', error);
      res.status(500).json({ success: false, message: 'Failed to register reaction', error: error.message });
    }
  }

  /**
   * GET /api/ownit/categories
   */
  async getCategories(req, res) {
    const categories = [
      { id: 'horlogerie', name: 'Haute Horlogerie', slug: 'haute-horlogerie', icon: 'Watch', productCount: 14 },
      { id: 'jewelry', name: 'Fine Jewelry & Diamonds', slug: 'fine-jewelry', icon: 'Gem', productCount: 22 },
      { id: 'supercars', name: 'Supercars & Hypercars', slug: 'supercars', icon: 'Car', productCount: 8 },
      { id: 'aviation-yachts', name: 'Private Aviation & Yachts', slug: 'aviation-yachts', icon: 'Plane', productCount: 5 },
      { id: 'couture', name: 'Haute Couture', slug: 'haute-couture', icon: 'Sparkles', productCount: 19 },
      { id: 'art-collectibles', name: 'Fine Art & Collectibles', slug: 'fine-art', icon: 'Palette', productCount: 11 }
    ];
    res.json({ success: true, data: categories, categories });
  }

  /**
   * GET /api/ownit/stats
   */
  async getStats(req, res) {
    try {
      const stats = await getPool().query(`
        SELECT 
          COUNT(*) as total_products,
          COALESCE(SUM(price_usd), 0) as total_valuation_usd,
          COALESCE(SUM(price_fic), 0) as total_valuation_fic,
          COUNT(DISTINCT brand) as total_luxury_brands
        FROM ownit_products
      `);
      res.json({
        success: true,
        data: {
          totalProducts: parseInt(stats.rows[0].total_products, 10),
          totalValuationUSD: parseFloat(stats.rows[0].total_valuation_usd),
          totalValuationFIC: parseFloat(stats.rows[0].total_valuation_fic),
          totalLuxuryBrands: parseInt(stats.rows[0].total_luxury_brands, 10),
          pavilionCount: 4
        }
      });
    } catch (error) {
      logErr('Error in OwnitController.getStats:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve stats', error: error.message });
    }
  }

  // Backward compatibility placeholders
  async registerProduct(req, res) {
    res.status(201).json({ success: true, message: 'Product registration logged with Sovereign Authenticity Ledger' });
  }

  async submitWarrantyClaim(req, res) {
    res.status(201).json({ success: true, message: 'Sovereign Concierge Claim Initiated' });
  }

  async getMyClaims(req, res) {
    res.json({ success: true, data: [], count: 0 });
  }
}

module.exports = new OwnitController();
