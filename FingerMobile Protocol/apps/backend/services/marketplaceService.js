const logger = require('../utils/logger');
const { pool } = require('../db');

class MarketplaceService {
  /**
   * Get all marketplace listings with filtering and pagination
   */
  async getAllListings(options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        type,
        minPrice,
        maxPrice,
        search,
        sortBy = 'created_at',
        order = 'DESC',
        featured = false
      } = options;

      const offset = (page - 1) * limit;

      let query = `
        SELECT 
          ml.*,
          u.name as seller_name,
          u.avatar as seller_avatar,
          u.is_verified as seller_verified
        FROM marketplace_listings ml
        JOIN users u ON ml.seller_id = u.id
        WHERE ml.status = 'active'
      `;

      const params = [];
      let paramCount = 0;

      if (category) {
        paramCount++;
        query += ` AND ml.category = $${paramCount}`;
        params.push(category);
      }

      if (type) {
        paramCount++;
        query += ` AND ml.type = $${paramCount}::listing_type`;
        params.push(type);
      }

      if (minPrice) {
        paramCount++;
        query += ` AND ml.price >= $${paramCount}`;
        params.push(parseFloat(minPrice));
      }

      if (maxPrice) {
        paramCount++;
        query += ` AND ml.price <= $${paramCount}`;
        params.push(parseFloat(maxPrice));
      }

      if (search) {
        paramCount++;
        query += ` AND (ml.title ILIKE $${paramCount} OR ml.description ILIKE $${paramCount})`;
        params.push(`%${search}%`);
      }

      if (featured) {
        query += ' AND ml.is_featured = true';
      }

      // Order by
      const validSortFields = ['created_at', 'price', 'rating_avg', 'purchase_count', 'view_count'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
      const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      query += ` ORDER BY ml.${sortField} ${sortOrder}`;

      // Pagination
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(limit);

      paramCount++;
      query += ` OFFSET $${paramCount}`;
      params.push(offset);

      const result = await pool.query(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) FROM marketplace_listings WHERE status = \'active\'';
      const countParams = [];
      let countParamCount = 0;

      if (category) {
        countParamCount++;
        countQuery += ` AND category = $${countParamCount}`;
        countParams.push(category);
      }

      if (type) {
        countParamCount++;
        countQuery += ` AND type = $${countParamCount}::listing_type`;
        countParams.push(type);
      }

      if (minPrice) {
        countParamCount++;
        countQuery += ` AND price >= $${countParamCount}`;
        countParams.push(parseFloat(minPrice));
      }

      if (maxPrice) {
        countParamCount++;
        countQuery += ` AND price <= $${countParamCount}`;
        countParams.push(parseFloat(maxPrice));
      }

      if (search) {
        countParamCount++;
        countQuery += ` AND (title ILIKE $${countParamCount} OR description ILIKE $${countParamCount})`;
        countParams.push(`%${search}%`);
      }

      if (featured) {
        countQuery += ' AND is_featured = true';
      }

      const countResult = await pool.query(countQuery, countParams);

      return {
        listings: result.rows,
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
      };
    } catch (error) {
      logger.error('Error getting listings:', error);
      throw error;
    }
  }

  /**
   * Get single listing by ID
   */
  async getListingById(listingId, userId = null) {
    try {
      const query = `
        SELECT 
          ml.*,
          u.name as seller_name,
          u.avatar as seller_avatar,
          u.email as seller_email,
          u.is_verified as seller_verified,
          CASE 
            WHEN mw.user_id IS NOT NULL THEN true 
            ELSE false 
          END as is_in_wishlist
        FROM marketplace_listings ml
        JOIN users u ON ml.seller_id = u.id
        LEFT JOIN marketplace_wishlist mw ON ml.id = mw.listing_id AND mw.user_id = $2
        WHERE ml.id = $1 AND ml.status IN ('active', 'sold_out')
      `;

      const result = await pool.query(query, [listingId, userId]);

      if (result.rows.length === 0) {
        throw new Error('Listing not found');
      }

      const listing = result.rows[0];

      // Get recent reviews
      const reviewsQuery = `
        SELECT r.*, u.name as reviewer_name, u.avatar as reviewer_avatar
        FROM marketplace_reviews r
        JOIN users u ON r.buyer_id = u.id
        WHERE r.listing_id = $1 AND r.status = 'published'
        ORDER BY r.created_at DESC
        LIMIT 5
      `;
      const reviewsResult = await pool.query(reviewsQuery, [listingId]);
      listing.recent_reviews = reviewsResult.rows;

      // Increment view count
      await pool.query(
        'UPDATE marketplace_listings SET view_count = view_count + 1 WHERE id = $1',
        [listingId]
      );

      return listing;
    } catch (error) {
      logger.error('Error getting listing by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new marketplace listing
   */
  async createListing(userId, listingData) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const {
        title,
        description,
        type,
        category,
        subcategory,
        tags,
        price,
        currency,
        discount_price,
        inventory_count,
        thumbnail_url,
        media_urls,
        demo_url,
        delivery_method,
        delivery_instructions,
        settings
      } = listingData;

      // Validation
      if (!title || title.trim().length === 0) {
        throw new Error('Title is required');
      }

      if (!price || price <= 0) {
        throw new Error('Valid price is required');
      }

      // Generate slug from title
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + '-' + Date.now();

      // Check if slug already exists
      const slugCheck = await client.query('SELECT id FROM marketplace_listings WHERE slug = $1', [slug]);
      if (slugCheck.rows.length > 0) {
        throw new Error('Listing with this title already exists');
      }

      // Insert listing
      const insertQuery = `
        INSERT INTO marketplace_listings (
          seller_id, title, slug, description, type, category, subcategory, tags,
          price, currency, discount_price, inventory_count, thumbnail_url, media_urls,
          demo_url, delivery_method, delivery_instructions, settings
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *
      `;

      const result = await client.query(insertQuery, [
        userId,
        title,
        slug,
        description || null,
        type || 'digital_product',
        category || null,
        subcategory || null,
        tags || [],
        parseFloat(price),
        currency || 'USD',
        discount_price ? parseFloat(discount_price) : null,
        inventory_count !== undefined ? parseInt(inventory_count) : -1,
        thumbnail_url || null,
        media_urls || [],
        demo_url || null,
        delivery_method || 'instant',
        delivery_instructions || null,
        JSON.stringify(settings || {})
      ]);

      const listing = result.rows[0];

      // Auto-publish if all required fields are present
      if (thumbnail_url && description && price) {
        await client.query(`
          UPDATE marketplace_listings 
          SET status = 'active', published_at = NOW()
          WHERE id = $1
        `, [listing.id]);
        listing.status = 'active';
        listing.published_at = new Date();
      }

      await client.query('COMMIT');

      return listing;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error creating listing:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update a marketplace listing
   */
  async updateListing(listingId, userId, updates) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Check ownership
      const ownerCheck = await client.query(
        'SELECT id, seller_id, status FROM marketplace_listings WHERE id = $1',
        [listingId]
      );

      if (ownerCheck.rows.length === 0) {
        throw new Error('Listing not found');
      }

      const listing = ownerCheck.rows[0];

      if (listing.seller_id !== userId) {
        throw new Error('You can only update your own listings');
      }

      // Build dynamic update query
      const allowedFields = [
        'title', 'description', 'category', 'subcategory', 'tags',
        'price', 'discount_price', 'inventory_count', 'thumbnail_url',
        'media_urls', 'demo_url', 'delivery_method', 'delivery_instructions',
        'settings', 'status'
      ];

      const updateFields = [];
      const values = [];
      let paramCount = 0;

      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          paramCount++;
          if (field === 'settings') {
            updateFields.push(`${field} = $${paramCount}::jsonb`);
            values.push(JSON.stringify(updates[field]));
          } else if (field === 'tags' || field === 'media_urls') {
            updateFields.push(`${field} = $${paramCount}::text[]`);
            values.push(updates[field]);
          } else if (field === 'price' || field === 'discount_price') {
            updateFields.push(`${field} = $${paramCount}`);
            values.push(parseFloat(updates[field]));
          } else if (field === 'inventory_count') {
            updateFields.push(`${field} = $${paramCount}`);
            values.push(parseInt(updates[field]));
          } else {
            updateFields.push(`${field} = $${paramCount}`);
            values.push(updates[field]);
          }
        }
      }

      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }

      // Handle title/slug update
      if (updates.title) {
        const slug = updates.title.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') + '-' + Date.now();
        paramCount++;
        updateFields.push(`slug = $${paramCount}`);
        values.push(slug);
      }

      // Auto-publish if transitioning from draft to active
      if (updates.status === 'active' && listing.status === 'draft') {
        updateFields.push('published_at = NOW()');
      }

      paramCount++;
      values.push(listingId);

      const updateQuery = `
        UPDATE marketplace_listings 
        SET ${updateFields.join(', ')} updated_at = NOW()
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await client.query(updateQuery, values);

      await client.query('COMMIT');

      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error updating listing:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete/archive a marketplace listing
   */
  async deleteListing(listingId, userId) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Check ownership
      const ownerCheck = await client.query(
        'SELECT id, seller_id, status FROM marketplace_listings WHERE id = $1',
        [listingId]
      );

      if (ownerCheck.rows.length === 0) {
        throw new Error('Listing not found');
      }

      const listing = ownerCheck.rows[0];

      if (listing.seller_id !== userId) {
        throw new Error('You can only delete your own listings');
      }

      // Check if there are pending transactions
      const transactionCheck = await client.query(
        'SELECT COUNT(*) as count FROM marketplace_transactions WHERE listing_id = $1 AND status IN (\'pending\', \'completed\')',
        [listingId]
      );

      if (parseInt(transactionCheck.rows[0].count) > 0) {
        throw new Error('Cannot delete listing with active transactions. Archive instead.');
      }

      // Soft delete by archiving
      const result = await client.query(`
        UPDATE marketplace_listings 
        SET status = 'archived', updated_at = NOW()
        WHERE id = $1
        RETURNING id, title, status
      `, [listingId]);

      await client.query('COMMIT');

      return {
        success: true,
        message: 'Listing archived successfully',
        listing: result.rows[0]
      };
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error deleting listing:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Add to wishlist
   */
  async addToWishlist(userId, listingId) {
    try {
      // Check if listing exists
      const listingCheck = await pool.query(
        'SELECT id FROM marketplace_listings WHERE id = $1 AND status = \'active\'',
        [listingId]
      );

      if (listingCheck.rows.length === 0) {
        throw new Error('Listing not found or inactive');
      }

      // Add to wishlist
      await pool.query(`
        INSERT INTO marketplace_wishlist (user_id, listing_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, listing_id) DO NOTHING
      `, [userId, listingId]);

      return { success: true, message: 'Added to wishlist' };
    } catch (error) {
      logger.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  /**
   * Remove from wishlist
   */
  async removeFromWishlist(userId, listingId) {
    try {
      const result = await pool.query(`
        DELETE FROM marketplace_wishlist
        WHERE user_id = $1 AND listing_id = $2
      `, [userId, listingId]);

      if (result.rowCount === 0) {
        throw new Error('Item not in wishlist');
      }

      return { success: true, message: 'Removed from wishlist' };
    } catch (error) {
      logger.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  /**
   * Get user's wishlist
   */
  async getWishlist(userId, options = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;

      const query = `
        SELECT ml.*, mw.created_at as added_at
        FROM marketplace_wishlist mw
        JOIN marketplace_listings ml ON mw.listing_id = ml.id
        WHERE mw.user_id = $1 AND ml.status = 'active'
        ORDER BY mw.created_at DESC
        LIMIT $2 OFFSET $3
      `;

      const result = await pool.query(query, [userId, limit, offset]);

      // Get total count
      const countResult = await pool.query(
        'SELECT COUNT(*) FROM marketplace_wishlist WHERE user_id = $1',
        [userId]
      );

      return {
        items: result.rows,
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit)
      };
    } catch (error) {
      logger.error('Error getting wishlist:', error);
      throw error;
    }
  }
}

module.exports = new MarketplaceService();
