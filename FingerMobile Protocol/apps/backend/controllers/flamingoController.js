/**
 * Flamingo Controller
 * Handles adult wellness store functionality with age verification and discreet features
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class FlamingoController {
  /**
   * GET /api/flamingo/posts
   * Get all posts with filtering and pagination
   */
  async getAllPosts(req, res) {
    try {
      const { page = 1, limit = 20, search, postType, isPublic, isSponsored, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;

      let query = 'SELECT * FROM flamingo_posts WHERE 1=1';
      const params = [];

      if (search) {
        params.push(`%${search}%`);
        query += ` AND (title ILIKE $${params.length} OR caption ILIKE $${params.length})`;
      }

      if (postType) {
        params.push(postType);
        query += ` AND post_type = $${params.length}`;
      }

      if (isPublic !== undefined) {
        params.push(isPublic === 'true');
        query += ` AND is_public = $${params.length}`;
      }

      if (isSponsored !== undefined) {
        params.push(isSponsored === 'true');
        query += ` AND is_sponsored = $${params.length}`;
      }

      // Add sorting
      const validSortColumns = ['created_at', 'like_count', 'comment_count', 'share_count', 'engagement_score'];
      const validSortOrders = ['ASC', 'DESC'];

      if (validSortColumns.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
        query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
      } else {
        query += ' ORDER BY created_at DESC';
      }

      // Add pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);
      params.push(parseInt(limit), offset);
      query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

      const result = await pool.query(query, params);

      res.json({
        success: true,
        data: result.rows,
        posts: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.rows.length // In a real implementation, you'd get the total count separately
        }
      });
    } catch (error) {
      logger.error('Error in FlamingoController.getAllPosts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve posts',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/flamingo/posts
   * Create a new post
   */
  async createPost(req, res) {
    try {
      const userId = req.user?.id;
      const { caption, title, postType, isPublic, isSponsored, content_url, content_urls, tags } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!caption) {
        return res.status(400).json({
          success: false,
          message: 'Caption is required'
        });
      }

      const result = await pool.query(
        `INSERT INTO flamingo_posts 
         (category_id, author_id, title, caption, post_type, content_url, content_urls, is_public, is_sponsored, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          1, // Default category ID - in a real app, this would come from the request
          userId,
          title || '',
          caption,
          postType || 'text',
          content_url || null,
          content_urls || [],
          Boolean(isPublic),
          Boolean(isSponsored),
          tags || []
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in FlamingoController.createPost:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create post',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/flamingo/posts/:id
   * Get a specific post by ID
   */
  async getPostById(req, res) {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'SELECT * FROM flamingo_posts WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
        post: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in FlamingoController.getPostById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve post',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/flamingo/posts/:id
   * Update a post
   */
  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { caption, title } = req.body;

      const updates = [];
      const params = [id];
      let paramIndex = 2;

      if (caption) {
        updates.push(`caption = $${paramIndex}`);
        params.push(caption);
        paramIndex++;
      }

      if (title !== undefined) {
        updates.push(`title = $${paramIndex}`);
        params.push(title);
        paramIndex++;
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update'
        });
      }

      const query = `UPDATE flamingo_posts SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $1 RETURNING *`;

      const result = await pool.query(query, params);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      res.json({
        success: true,
        message: 'Post updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in FlamingoController.updatePost:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update post',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/flamingo/posts/:id
   * Delete a post
   */
  async deletePost(req, res) {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'DELETE FROM flamingo_posts WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      res.json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      logger.error('Error in FlamingoController.deletePost:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete post',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/flamingo/posts/author/:authorId
   * Get posts by author
   */
  async getPostsByAuthor(req, res) {
    try {
      const { authorId } = req.params;
      const { page = 1, limit = 20, postType, isPublic, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;

      let query = 'SELECT * FROM flamingo_posts WHERE author_id = $1';
      const params = [authorId];

      if (postType) {
        params.push(postType);
        query += ` AND post_type = $${params.length}`;
      }

      if (isPublic !== undefined) {
        params.push(isPublic === 'true');
        query += ` AND is_public = $${params.length}`;
      }

      // Add sorting
      const validSortColumns = ['created_at', 'like_count', 'comment_count', 'share_count', 'engagement_score'];
      const validSortOrders = ['ASC', 'DESC'];

      if (validSortColumns.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
        query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
      } else {
        query += ' ORDER BY created_at DESC';
      }

      // Add pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);
      params.push(parseInt(limit), offset);
      query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

      const result = await pool.query(query, params);

      res.json({
        success: true,
        data: result.rows,
        posts: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.rows.length // In a real implementation, you'd get the total count separately
        }
      });
    } catch (error) {
      logger.error('Error in FlamingoController.getPostsByAuthor:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve posts by author',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/flamingo/posts/trending
   * Get trending posts
   */
  async getTrendingPosts(req, res) {
    try {
      const { page = 1, limit = 20, days = 7 } = req.query;

      const query = `
        SELECT * FROM flamingo_posts 
        WHERE created_at >= NOW() - INTERVAL '${days} days'
        ORDER BY engagement_score DESC, like_count DESC
        LIMIT $1 OFFSET $2
      `;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const result = await pool.query(query, [parseInt(limit), offset]);

      res.json({
        success: true,
        data: result.rows,
        posts: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.rows.length // In a real implementation, you'd get the total count separately
        }
      });
    } catch (error) {
      logger.error('Error in FlamingoController.getTrendingPosts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve trending posts',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/flamingo/posts/:id/like
   * Like a post
   */
  async likePost(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Check if user already liked the post
      const existingLike = await pool.query(
        'SELECT * FROM flamingo_interactions WHERE user_id = $1 AND target_type = $2 AND target_id = $3 AND interaction_type = $4',
        [userId, 'post', id, 'like']
      );

      if (existingLike.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Post already liked'
        });
      }

      // Insert the like
      await pool.query(
        `INSERT INTO flamingo_interactions 
         (user_id, target_type, target_id, interaction_type)
         VALUES ($1, $2, $3, $4)`,
        [userId, 'post', id, 'like']
      );

      // Increment the like count
      await pool.query(
        'UPDATE flamingo_posts SET like_count = like_count + 1 WHERE id = $1',
        [id]
      );

      res.json({
        success: true,
        message: 'Post liked successfully'
      });
    } catch (error) {
      logger.error('Error in FlamingoController.likePost:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to like post',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/flamingo/posts/:id/unlike
   * Unlike a post
   */
  async unlikePost(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Delete the like
      const result = await pool.query(
        `DELETE FROM flamingo_interactions 
         WHERE user_id = $1 AND target_type = $2 AND target_id = $3 AND interaction_type = $4
         RETURNING *`,
        [userId, 'post', id, 'like']
      );

      if (result.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Post was not liked'
        });
      }

      // Decrement the like count
      await pool.query(
        'UPDATE flamingo_posts SET like_count = GREATEST(0, like_count - 1) WHERE id = $1',
        [id]
      );

      res.json({
        success: true,
        message: 'Post unliked successfully'
      });
    } catch (error) {
      logger.error('Error in FlamingoController.unlikePost:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unlike post',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/flamingo/posts/type/:postType
   * Get posts by type
   */
  async getPostsByType(req, res) {
    try {
      const { postType } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const validTypes = ['text', 'image', 'video', 'carousel', 'link', 'product', 'story'];
      if (!validTypes.includes(postType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid post type'
        });
      }

      const query = `
        SELECT * FROM flamingo_posts 
        WHERE post_type = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const result = await pool.query(query, [postType, parseInt(limit), offset]);

      res.json({
        success: true,
        data: result.rows,
        posts: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.rows.length // In a real implementation, you'd get the total count separately
        }
      });
    } catch (error) {
      logger.error('Error in FlamingoController.getPostsByType:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve posts by type',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/flamingo/categories
   * Get all categories
   */
  async getCategories(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM flamingo_categories WHERE is_active = true ORDER BY name ASC'
      );

      res.json({
        success: true,
        data: result.rows,
        categories: result.rows
      });
    } catch (error) {
      logger.error('Error in FlamingoController.getCategories:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve categories',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/flamingo/products
   * Get all products for the Flamingo store
   */
  async getProducts(req, res) {
    try {
      const { category, minPrice, maxPrice, search, limit = 50, offset = 0 } = req.query;

      let query = 'SELECT * FROM flamingo_products WHERE is_available = true AND is_approved = true';
      const params = [];

      if (category && category !== 'all') {
        params.push(category);
        query += ` AND category_id = $${params.length}`;
      }

      if (minPrice) {
        params.push(parseFloat(minPrice));
        query += ` AND price >= $${params.length}`;
      }

      if (maxPrice) {
        params.push(parseFloat(maxPrice));
        query += ` AND price <= $${params.length}`;
      }

      if (search) {
        params.push(`%${search}%`);
        query += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
      }

      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(parseInt(limit, 10), parseInt(offset, 10));

      const result = await pool.query(query, params);

      res.json({
        success: true,
        data: result.rows,
        products: result.rows
      });
    } catch (error) {
      logger.error('Error in FlamingoController.getProducts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve products',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/flamingo/outfits
   * Get user's custom outfits and public lookbook outfits
   */
  async getOutfits(req, res) {
    try {
      const userId = req.user?.id;

      let result;
      if (userId) {
        result = await pool.query(
          'SELECT * FROM flamingo_outfits WHERE user_id = $1 OR is_public = true ORDER BY created_at DESC',
          [userId]
        );
      } else {
        result = await pool.query(
          'SELECT * FROM flamingo_outfits WHERE is_public = true ORDER BY created_at DESC'
        );
      }

      res.json({
        success: true,
        data: result.rows,
        outfits: result.rows
      });
    } catch (error) {
      logger.error('Error in FlamingoController.getOutfits:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve outfits',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/flamingo/products/:id/react
   * React (like or dislike) to a flamingo product
   */
  async reactToProduct(req, res) {
    try {
      const { id } = req.params;
      const { type } = req.body;
      const col = type === 'dislike' ? 'dislikes' : 'likes';
      const result = await pool.query(
        `UPDATE flamingo_products SET ${col} = COALESCE(${col}, 0) + 1 WHERE id = $1 RETURNING id, likes, dislikes`,
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      logger.error('Error in FlamingoController.reactToProduct:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  /**
   * POST /api/flamingo/products/:id/vote
   * Vote on a flamingo runway product poll
   */
  async voteProductPoll(req, res) {
    try {
      const { id } = req.params;
      const { optionId } = req.body;
      const prodRes = await pool.query('SELECT poll_data FROM flamingo_products WHERE id = $1', [id]);
      if (prodRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      let poll = prodRes.rows[0].poll_data;
      if (poll && Array.isArray(poll.options)) {
        poll.options = poll.options.map(opt => opt.id === Number(optionId) ? { ...opt, votes: (opt.votes || 0) + 1 } : opt);
        await pool.query('UPDATE flamingo_products SET poll_data = $1 WHERE id = $2', [JSON.stringify(poll), id]);
      }
      res.json({ success: true, data: poll });
    } catch (err) {
      logger.error('Error in FlamingoController.voteProductPoll:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  /**
   * POST /api/flamingo/outfits
   * Create a new custom outfit
   */
  async createOutfit(req, res) {
    try {
      const userId = req.user?.id;
      const { name, description, occasion, season, style_tags, is_public } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Outfit name is required'
        });
      }

      const result = await pool.query(
        `INSERT INTO flamingo_outfits 
         (user_id, name, description, occasion, season, style_tags, is_public)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          userId,
          name,
          description || '',
          occasion || null,
          season || null,
          style_tags || [],
          Boolean(is_public)
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Outfit created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in FlamingoController.createOutfit:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create outfit',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/flamingo/measurements
   * Get user's body measurements
   */
  async getMeasurements(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const result = await pool.query(
        'SELECT * FROM flamingo_measurements WHERE user_id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No measurements found'
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
        measurements: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in FlamingoController.getMeasurements:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve measurements',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/flamingo/measurements
   * Save user's body measurements
   */
  async saveMeasurements(req, res) {
    try {
      const userId = req.user?.id;
      const { height_cm, weight_kg, chest_cm, waist_cm, hips_cm, preferred_fit } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Check if measurements already exist for this user
      const existing = await pool.query(
        'SELECT id FROM flamingo_measurements WHERE user_id = $1',
        [userId]
      );

      let result;
      if (existing.rows.length > 0) {
        // Update existing measurements
        result = await pool.query(
          `UPDATE flamingo_measurements 
           SET height_cm = $2, weight_kg = $3, chest_cm = $4, waist_cm = $5, hips_cm = $6, preferred_fit = $7, updated_at = NOW()
           WHERE user_id = $1
           RETURNING *`,
          [
            userId,
            height_cm || null,
            weight_kg || null,
            chest_cm || null,
            waist_cm || null,
            hips_cm || null,
            preferred_fit || 'regular'
          ]
        );
      } else {
        // Insert new measurements
        result = await pool.query(
          `INSERT INTO flamingo_measurements 
           (user_id, height_cm, weight_kg, chest_cm, waist_cm, hips_cm, preferred_fit)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [
            userId,
            height_cm || null,
            weight_kg || null,
            chest_cm || null,
            waist_cm || null,
            hips_cm || null,
            preferred_fit || 'regular'
          ]
        );
      }

      res.status(201).json({
        success: true,
        message: 'Measurements saved successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in FlamingoController.saveMeasurements:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save measurements',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/flamingo/recommendations
   * Get size recommendations based on user's measurements
   */
  async getSizeRecommendations(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const result = await pool.query(
        'SELECT * FROM flamingo_size_recommendations WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );

      res.json({
        success: true,
        data: result.rows,
        recommendations: result.rows
      });
    } catch (error) {
      logger.error('Error in FlamingoController.getSizeRecommendations:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve size recommendations',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/flamingo/brands/sizing
   * Get brand sizing information
   */
  async getBrandSizings(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM flamingo_brand_sizing ORDER BY brand_name ASC'
      );

      res.json({
        success: true,
        data: result.rows,
        brandSizings: result.rows
      });
    } catch (error) {
      logger.error('Error in FlamingoController.getBrandSizings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve brand sizings',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/flamingo/verify-age
   * Verify user age for adult content access
   */
  async verifyAge(req, res) {
    try {
      const userId = req.user?.id;
      const { birthDate } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!birthDate) {
        return res.status(400).json({
          success: false,
          message: 'Birth date is required'
        });
      }

      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }

      if (age < 19) {
        return res.status(403).json({
          success: false,
          message: 'Age verification failed. Must be 19 or older.'
        });
      }

      // Check if user already has age verification
      const existing = await pool.query(
        'SELECT id FROM flamingo_age_verification WHERE user_id = $1',
        [userId]
      );

      let result;
      if (existing.rows.length > 0) {
        // Update existing verification
        result = await pool.query(
          `UPDATE flamingo_age_verification 
           SET birth_date = $2, is_verified = true, verified_at = NOW()
           WHERE user_id = $1
           RETURNING *`,
          [userId, birthDate]
        );
      } else {
        // Insert new verification
        result = await pool.query(
          `INSERT INTO flamingo_age_verification 
           (user_id, birth_date, is_verified, verified_at)
           VALUES ($1, $2, true, NOW())
           RETURNING *`,
          [userId, birthDate]
        );
      }

      res.json({
        success: true,
        message: 'Age verification successful',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in FlamingoController.verifyAge:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify age',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/flamingo/check-verification
   * Check if user is age verified
   */
  async checkVerification(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const result = await pool.query(
        'SELECT * FROM flamingo_age_verification WHERE user_id = $1',
        [userId]
      );

      const isVerified = result.rows.length > 0 && result.rows[0].is_verified;

      res.json({
        success: true,
        isVerified,
        data: result.rows[0] || null
      });
    } catch (error) {
      logger.error('Error in FlamingoController.checkVerification:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check verification status',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new FlamingoController();
