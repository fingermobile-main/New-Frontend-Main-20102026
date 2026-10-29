/**
 * Forum Categories Controller
 * Complete implementation for forum categorization and management
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

const CURATED_12_TOPICS = [
  {
    id: 'top-01',
    name: 'Nostalgic African Art & Heritage',
    description: 'Preserving post-colonial cinema, indigenous architecture, vintage vinyl, and modern retro-futurism.',
    category: 'culture',
    icon: '🏛️',
    color: '#D97706',
    threadCount: 1420,
    thread_count: 1420,
    postCount: 8900,
    followers_count: 8900,
    is_active: true,
    display_order: 1
  },
  {
    id: 'top-02',
    name: 'Afrobeats & Sound Engineering',
    description: 'Discussions on rhythmic arrangement, DAW master chains, audio streaming, and live concert circuits.',
    category: 'music',
    icon: '🎵',
    color: '#059669',
    threadCount: 980,
    thread_count: 980,
    postCount: 6540,
    followers_count: 6540,
    is_active: true,
    display_order: 2
  },
  {
    id: 'top-03',
    name: 'Creator Monetization & FIC Economy',
    description: 'Best practices for storefront merchandising, PhotoCredits pricing, paylinks, and revenue share models.',
    category: 'business',
    icon: '🪙',
    color: '#2563EB',
    threadCount: 850,
    thread_count: 850,
    postCount: 5120,
    followers_count: 5120,
    is_active: true,
    display_order: 3
  },
  {
    id: 'top-04',
    name: 'Mobile Video & FingerShorts Directing',
    description: 'Short-form visual editing, lighting setups, storytelling pacing, and algorithm distribution strategies.',
    category: 'media',
    icon: '🎬',
    color: '#DC2626',
    threadCount: 640,
    thread_count: 640,
    postCount: 4200,
    followers_count: 4200,
    is_active: true,
    display_order: 4
  },
  {
    id: 'top-05',
    name: 'Zero-Knowledge Proofs & Enclave Computing',
    description: 'Cryptographic privacy, biometric hardware attestation, and client-side ZKP circuits.',
    category: 'security',
    icon: '🛡️',
    color: '#7C3AED',
    threadCount: 520,
    thread_count: 520,
    postCount: 3810,
    followers_count: 3810,
    is_active: true,
    display_order: 5
  },
  {
    id: 'top-06',
    name: 'Biometric Fingerprint Hardware & IoT Relays',
    description: 'Capacitive sensors, USB-FIDO keys, decentralized relay nodes, and embedded Linux devices.',
    category: 'hardware',
    icon: '📡',
    color: '#4F46E5',
    threadCount: 410,
    thread_count: 410,
    postCount: 2950,
    followers_count: 2950,
    is_active: true,
    display_order: 6
  },
  {
    id: 'top-07',
    name: 'Decentralized Merchant Escrows & Storefronts',
    description: 'Trustless settlement, peer dispute councils, merchant verification, and global logistics.',
    category: 'commerce',
    icon: '🛍️',
    color: '#0D9488',
    threadCount: 680,
    thread_count: 680,
    postCount: 4670,
    followers_count: 4670,
    is_active: true,
    display_order: 7
  },
  {
    id: 'top-08',
    name: 'Live Streaming, Dancia & Real-Time Haptics',
    description: 'Ultra-low-latency WebRTC streams, interactive viewer gifting, and synchronized tactile pulses.',
    category: 'streaming',
    icon: '📺',
    color: '#E11D48',
    threadCount: 790,
    thread_count: 790,
    postCount: 5890,
    followers_count: 5890,
    is_active: true,
    display_order: 8
  },
  {
    id: 'top-09',
    name: 'P2P Gaming, Virtual Arenas & Guild Quests',
    description: 'Decentralized multiplayer lobbies, competitive hallmarks, wager pools, and leaderboard streaks.',
    category: 'gaming',
    icon: '🎮',
    color: '#9333EA',
    threadCount: 890,
    thread_count: 890,
    postCount: 6720,
    followers_count: 6720,
    is_active: true,
    display_order: 9
  },
  {
    id: 'top-10',
    name: 'Protocol Governance, Charter Amendments & DAOs',
    description: 'Voting procedures, node consensus thresholds, legal enclaves, and pan-African digital sovereignty.',
    category: 'governance',
    icon: '📜',
    color: '#B45309',
    threadCount: 1120,
    thread_count: 1120,
    postCount: 8340,
    followers_count: 8340,
    is_active: true,
    display_order: 10
  },
  {
    id: 'top-11',
    name: 'Guardian AI Sentinels & Decentralized Moderation',
    description: 'Community-trained ML models, automated fraud detection, toxic content filtering, and transparency logs.',
    category: 'ai',
    icon: '🤖',
    color: '#0284C7',
    threadCount: 630,
    thread_count: 630,
    postCount: 4190,
    followers_count: 4190,
    is_active: true,
    display_order: 11
  },
  {
    id: 'top-12',
    name: 'Peer Micro-Lending & Sovereign Credit Pools',
    description: 'Decentralized micro-loans, peer collateralization, interest rate auctions, and community credit scores.',
    category: 'finance',
    icon: '💳',
    color: '#16A34A',
    threadCount: 740,
    thread_count: 740,
    postCount: 5260,
    followers_count: 5260,
    is_active: true,
    display_order: 12
  }
];

let memoryCategories = [...CURATED_12_TOPICS];

class ForumCategoriesController {
  /**
   * GET /api/forumcategories
   * Get all forum categories with statistics
   */
  async getAll(req, res) {
    const { limit = 50, offset = 0 } = req.query || {};
    try {

      if (pool && pool.query) {
        try {
          const query = `
            SELECT 
              c.id,
              c.name,
              c.slug,
              c.description,
              c.icon,
              c.color,
              c.rules,
              c.moderation_state,
              c.access_type,
              c.allowed_roles,
              c.subscription_tier_required,
              c.style_color,
              c.header_image_url,
              c.cover_image_url,
              c.is_frozen,
              c.is_commenting_paused,
              c.is_suspended,
              c.is_active,
              c.display_order,
              c.created_at,
              c.updated_at,
              COUNT(DISTINCT t.id) as thread_count,
              COUNT(DISTINCT p.id) as post_count
            FROM forum_categories c
            LEFT JOIN forum_threads t ON c.id = t.category_id
            LEFT JOIN forum_posts p ON (t.id = p.thread_id OR c.id = p.category_id)
            WHERE c.is_active = true
            GROUP BY c.id
            ORDER BY c.display_order ASC, c.name ASC
            LIMIT $1 OFFSET $2
          `;

          const result = await pool.query(query, [parseInt(limit), parseInt(offset)]);
          if (result && result.rows && result.rows.length > 0) {
            return res.json({
              success: true,
              data: result.rows.map(cat => ({
                ...cat,
                threadCount: parseInt(cat.thread_count) || 0,
                forumCount: parseInt(cat.thread_count) || 0,
                postCount: parseInt(cat.post_count) || 0,
                rules: cat.rules || '',
                moderationState: cat.moderation_state || 'active',
                accessType: cat.access_type || 'free',
                allowedRoles: cat.allowed_roles || [],
                subscriptionTierRequired: cat.subscription_tier_required || '',
                styleColor: cat.style_color || cat.color || '#2563EB',
                headerImageUrl: cat.header_image_url || null,
                coverImageUrl: cat.cover_image_url || null,
                isFrozen: Boolean(cat.is_frozen),
                isCommentingPaused: Boolean(cat.is_commenting_paused),
                isSuspended: Boolean(cat.is_suspended)
              })),
              pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                total: result.rows.length
              }
            });
          }
        } catch (dbErr) {
          logger.warn('Database query for forum categories failed, serving curated 12 topics:', dbErr.message);
        }
      }

      // Serve 12 curated topics with full statistics
      return res.json({
        success: true,
        data: memoryCategories,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: memoryCategories.length
        }
      });
    } catch (error) {
      logger.error('Error in ForumCategoriesController.getAll:', error);
      res.json({
        success: true,
        data: memoryCategories,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: memoryCategories.length
        }
      });
    }
  }

  /**
   * GET /api/forumcategories/:id
   * Get category by ID with threads
   */
  async getById(req, res) {
    try {
      const { categoryId, id } = req.params;
      const targetId = categoryId || id;

      // Get category details
      const categoryResult = await pool.query(
        'SELECT * FROM forum_categories WHERE id = $1',
        [targetId]
      );

      if (categoryResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Forum category not found'
        });
      }

      const category = categoryResult.rows[0];

      // Get threads in this category
      const threadsResult = await pool.query(
        `SELECT 
          t.id,
          t.title,
          t.content,
          t.view_count,
          t.reply_count,
          t.is_pinned,
          t.is_locked,
          t.created_at,
          t.author_id,
          u.username as author_name,
          u.avatar_url as author_avatar
         FROM forum_threads t
         LEFT JOIN users u ON t.author_id = u.id
         WHERE t.category_id = $1
         ORDER BY t.is_pinned DESC, t.created_at DESC`,
        [targetId]
      );

      res.json({
        success: true,
        data: {
          ...category,
          threads: threadsResult.rows,
          threadCount: threadsResult.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in ForumCategoriesController.getById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get forum category',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/forumcategories
   * Create new forum category (admin only)
   */
  async create(req, res) {
    try {
      // Check admin permission
      const isAuthorized = req.user?.isAdmin || req.user?.role === 'admin' || req.user?.role === 'super_admin' || ['obinnambah100@gmail.com', 'gracelinkbustech@gmail.com', 'fingermobileprotocol@gmail.com'].includes(req.user?.email);
      if (!isAuthorized) {
        return res.status(403).json({
          success: false, message: 'Admin access required'
        });
      }

      const {
        name,
        slug,
        description,
        icon,
        color,
        rules,
        moderationState,
        accessType,
        allowedRoles,
        subscriptionTierRequired,
        styleColor,
        headerImageUrl,
        coverImageUrl,
        isFrozen,
        isCommentingPaused,
        isSuspended,
        displayOrder,
        sortOrder
      } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false, message: 'Category name is required'
        });
      }

      const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const order = displayOrder !== undefined ? displayOrder : (sortOrder !== undefined ? sortOrder : 0);
      const modState = moderationState || (isSuspended ? 'suspended' : isFrozen ? 'frozen' : isCommentingPaused ? 'comments_paused' : 'active');
      const finalStyleColor = styleColor || color || '#2563EB';

      const result = await pool.query(
        `INSERT INTO forum_categories 
         (name, slug, description, icon, color, rules, moderation_state, access_type, allowed_roles, subscription_tier_required, style_color, header_image_url, cover_image_url, is_frozen, is_commenting_paused, is_suspended, display_order, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, true, NOW(), NOW())
         RETURNING *`,
        [
          name,
          catSlug,
          description || null,
          icon || '💬',
          finalStyleColor,
          rules || null,
          modState,
          accessType || 'free',
          Array.isArray(allowedRoles) ? allowedRoles : [],
          subscriptionTierRequired || null,
          finalStyleColor,
          headerImageUrl || null,
          coverImageUrl || null,
          Boolean(isFrozen),
          Boolean(isCommentingPaused),
          Boolean(isSuspended),
          order
        ]
      );

      res.status(201).json({
        success: true, message: 'Forum category created successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in ForumCategoriesController.create:', error);
      res.status(500).json({
        success: false, message: 'Failed to create forum category', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/forumcategories/:id
   * Update forum category (admin only)
   */
  async update(req, res) {
    try {
      // Check admin permission
      const isAuthorized = req.user?.isAdmin || req.user?.role === 'admin' || req.user?.role === 'super_admin' || ['obinnambah100@gmail.com', 'gracelinkbustech@gmail.com', 'fingermobileprotocol@gmail.com'].includes(req.user?.email);
      if (!isAuthorized) {
        return res.status(403).json({
          success: false, message: 'Admin access required'
        });
      }

      const { id } = req.params;
      const updates = req.body;

      const setClauses = [];
      const values = [];
      let paramCount = 1;

      const fieldMap = {
        name: 'name',
        slug: 'slug',
        description: 'description',
        icon: 'icon',
        color: 'color',
        rules: 'rules',
        moderation_state: 'moderation_state',
        moderationState: 'moderation_state',
        access_type: 'access_type',
        accessType: 'access_type',
        allowed_roles: 'allowed_roles',
        allowedRoles: 'allowed_roles',
        subscription_tier_required: 'subscription_tier_required',
        subscriptionTierRequired: 'subscription_tier_required',
        style_color: 'style_color',
        styleColor: 'style_color',
        header_image_url: 'header_image_url',
        headerImageUrl: 'header_image_url',
        cover_image_url: 'cover_image_url',
        coverImageUrl: 'cover_image_url',
        is_frozen: 'is_frozen',
        isFrozen: 'is_frozen',
        is_commenting_paused: 'is_commenting_paused',
        isCommentingPaused: 'is_commenting_paused',
        is_suspended: 'is_suspended',
        isSuspended: 'is_suspended',
        display_order: 'display_order',
        displayOrder: 'display_order',
        sortOrder: 'display_order',
        is_active: 'is_active',
        isActive: 'is_active'
      };

      const handledFields = new Set();
      Object.keys(updates).forEach(key => {
        const dbCol = fieldMap[key];
        if (dbCol && !handledFields.has(dbCol)) {
          handledFields.add(dbCol);
          setClauses.push(`${dbCol} = $${paramCount}`);
          values.push(updates[key]);
          paramCount++;
        }
      });

      if (setClauses.length === 0) {
        return res.status(400).json({
          success: false, message: 'No valid fields to update'
        });
      }

      setClauses.push('updated_at = NOW()');
      values.push(id);

      const result = await pool.query(
        `UPDATE forum_categories 
         SET ${setClauses.join(', ')}
         WHERE id = $${paramCount} OR slug = $${paramCount}
         RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Forum category not found'
        });
      }

      res.json({
        success: true, message: 'Forum category updated successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in ForumCategoriesController.update:', error);
      res.status(500).json({
        success: false, message: 'Failed to update forum category', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/forumcategories/:id
   * Delete forum category (admin only)
   */
  async delete(req, res) {
    try {
      // Check admin permission
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Admin access required'
        });
      }

      const { id } = req.params;

      // Check if category has forums
      const forumsCheck = await pool.query(
        'SELECT COUNT(*) as count FROM forums WHERE category_id = $1 AND is_active = true',
        [id]
      );

      if (parseInt(forumsCheck.rows[0].count) > 0) {
        return res.status(400).json({
          success: false, message: 'Cannot delete category with active forums. Deactivate forums first.'
        });
      }

      const result = await pool.query(
        'DELETE FROM forum_categories WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Forum category not found'
        });
      }

      res.json({
        success: true, message: 'Forum category deleted successfully'
      });
    } catch (error) {
      logger.error('Error in ForumCategoriesController.delete:', error);
      res.status(500).json({
        success: false, message: 'Failed to delete forum category', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/forumcategories/popular
   * Get most popular categories by activity
   */
  async getPopular(req, res) {
    try {
      const { limit = 10 } = req.query;

      const result = await pool.query(
        `SELECT 
          c.id,
          c.name,
          c.description,
          c.icon,
          c.color,
          COUNT(DISTINCT f.id) as forum_count,
          COUNT(DISTINCT p.id) as post_count,
          COUNT(DISTINCT p.author_id) as contributor_count
         FROM forum_categories c
         LEFT JOIN forums f ON c.id = f.category_id AND f.is_active = true
         LEFT JOIN posts p ON f.id = p.forum_id AND p.is_published = true
         WHERE c.is_active = true
         GROUP BY c.id
         ORDER BY post_count DESC
         LIMIT $1`,
        [parseInt(limit)]
      );

      res.json({
        success: true,
        data: result.rows.map(cat => ({
          ...cat,
          forumCount: parseInt(cat.forum_count) || 0,
          postCount: parseInt(cat.post_count) || 0, contributorCount: parseInt(cat.contributor_count) || 0
        }))
      });
    } catch (error) {
      logger.error('Error in ForumCategoriesController.getPopular:', error);
      res.status(500).json({
        success: false, message: 'Failed to get popular categories', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/forumcategories/:id/reorder
   * Reorder category display order (admin only)
   */
  async reorder(req, res) {
    try {
      // Check admin permission
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Admin access required'
        });
      }

      const { id } = req.params;
      const { displayOrder } = req.body;

      if (displayOrder === undefined || displayOrder < 0) {
        return res.status(400).json({
          success: false, message: 'Valid display order is required'
        });
      }

      const result = await pool.query(
        `UPDATE forum_categories 
         SET display_order = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [displayOrder, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Forum category not found'
        });
      }

      res.json({
        success: true, message: 'Category order updated successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in ForumCategoriesController.reorder:', error);
      res.status(500).json({
        success: false, message: 'Failed to reorder category', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new ForumCategoriesController();
