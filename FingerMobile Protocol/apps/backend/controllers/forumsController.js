/* eslint-disable no-unused-vars */
/**
 * ForumsController - Complete Implementation
 * Extracted from routes/forums.js inline handlers
 */

const { socialDb, contentDb } = require('../db/db');
const logger = require('../utils/logger');

class ForumsController {
  /**
   * GET /api/forums/categories
   * Get all forum categories
   */
  async getCategories(req, res) {
    try {
      const { rows } = await socialDb.query(
        'SELECT * FROM forum_categories WHERE is_active = $1 ORDER BY name',
        [true]
      );
      res.json(rows);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * GET /api/forums
   * Get all forums
   */
  async getAll(req, res) {
    try {
      const {
        category,
        search,
        limit = 20,
        offset = 0, sort_by = 'created_at', order = 'DESC'
      } = req.query;

      let query = `SELECT f.*, fc.name as category_name,
                   COUNT(ft.id) as thread_count, COUNT(fp.id) as post_count
                   FROM forums f
                   JOIN forum_categories fc ON f.category_id = fc.id
                   LEFT JOIN forum_threads ft ON f.id = ft.forum_id
                   LEFT JOIN forum_posts fp ON ft.id = fp.thread_id
                   WHERE f.moderation_status = 'active' AND fc.is_active = true`;
      const params = [];
      let paramIndex = 0;

      if (category) {
        paramIndex++;
        query += ` AND f.category_id = $${paramIndex}`;
        params.push(category);
      }

      if (search) {
        paramIndex++;
        query += ` AND (f.name ILIKE $${paramIndex} OR f.description ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
      }

      query += ' GROUP BY f.id, fc.name';

      // Add sorting
      const sortColumns = {
        created_at: 'f.created_at',
        name: 'f.name',
        post_count: 'post_count'
      };
      const sortColumn = sortColumns[sort_by] || sortColumns.created_at;
      const sortOrder = String(order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      query += ` ORDER BY ${sortColumn} ${sortOrder}`;

      query += ` LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}`;
      params.push(parseInt(limit), parseInt(offset));

      const { rows } = await socialDb.query(query, params);
      res.json(rows);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * GET /api/forums/:forumId
   * Get a specific forum by ID
   */
  async getById(req, res) {
    try {
      const { forumId } = req.params;

      const { rows } = await socialDb.query(
        `SELECT f.*, fc.name as category_name
         FROM forums f
         JOIN forum_categories fc ON f.category_id = fc.id
         WHERE f.id = $1`, [forumId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Forum not found' });
      }

      res.json(rows[0]);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * GET /api/forums/:forumId/threads
   * Get threads in a forum
   */
  async getThreads(req, res) {
    try {
      const { forumId } = req.params;
      const {
        limit = 20,
        offset = 0, sort_by = 'last_post_date', order = 'DESC',
        sticky_first = true
      } = req.query;

      let resolvedForumId = forumId;
      if (isNaN(parseInt(forumId))) {
        const forumRes = await socialDb.query('SELECT id FROM forums LIMIT 1');
        if (forumRes.rows.length > 0) {
          resolvedForumId = forumRes.rows[0].id;
        } else {
          return res.json([]); // No forums exist
        }
      }

      let query = `SELECT ft.*, m.membername as author_name, m.avatar_url as author_avatar,
                   COUNT(fp.id) as reply_count, MAX(fp.created_at) as last_post_date
                   FROM forum_threads ft
                   JOIN members m ON ft.author_id = m.user_id
                   LEFT JOIN forum_posts fp ON ft.id = fp.thread_id`;
      const params = [];
      query += ' WHERE ft.forum_id = $1';
      params.push(resolvedForumId);

      query += ' GROUP BY ft.id, m.membername, m.avatar_url';

      // Add sorting
      if (sticky_first === 'true' || sticky_first === true) {
        query += ` ORDER BY ft.is_sticky DESC, ${sort_by} ${order}`;
      } else {
        query += ` ORDER BY ${sort_by} ${order}`;
      }

      query += ' LIMIT $2 OFFSET $3';
      params.push(parseInt(limit), parseInt(offset));

      const { rows } = await socialDb.query(query, params);
      res.json(rows);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * POST /api/forums/:forumId/threads
   * Create a new thread in a forum
   */
  async createThread(req, res) {
    try {
      if (!req.member) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const userId = req.member.user_id || req.member.id;
      const { forumId } = req.params;
      const { title, content, is_sticky } = req.body;

      // Validation
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      let resolvedForumId = forumId;
      if (isNaN(parseInt(forumId))) {
        const checkForum = await socialDb.query('SELECT id FROM forums LIMIT 1');
        if (checkForum.rows.length > 0) resolvedForumId = checkForum.rows[0].id;
      }

      // Check if forum exists
      const forumResult = await socialDb.query(
        'SELECT id FROM forums WHERE id = $1', [resolvedForumId]
      );

      if (forumResult.rows.length === 0) {
        return res.status(404).json({ error: 'Forum not found' });
      }

      // Create the thread
      const threadResult = await socialDb.query(
        `INSERT INTO forum_threads 
         (forum_id, author_id, title, content, is_sticky)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`, [resolvedForumId, userId, title, content, is_sticky || false]
      );

      res.status(201).json(threadResult.rows[0]);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * GET /api/forums/threads/:threadId
   * Get a specific thread
   */
  async getThreadById(req, res) {
    try {
      const { threadId } = req.params;

      const { rows } = await socialDb.query(
        `SELECT ft.*, f.name as forum_name, m.membername as author_name, m.avatar_url as author_avatar
         FROM forum_threads ft
         JOIN forums f ON ft.forum_id = f.id
         JOIN members m ON ft.author_id = m.user_id
         WHERE ft.id = $1`, [threadId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Thread not found' });
      }

      res.json(rows[0]);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * GET /api/forums/threads/:threadId/posts
   * Get posts in a thread
   */
  async getThreadPosts(req, res) {
    try {
      const { threadId } = req.params;
      const {
        limit = 20, offset = 0, sort_by = 'created_at', order = 'ASC'
      } = req.query;

      const { rows } = await socialDb.query(`SELECT fp.*, m.membername as author_name, m.avatar_url as author_avatar FROM forum_posts fp JOIN members m ON fp.author_id = m.user_id WHERE fp.thread_id = $1 ORDER BY fp.${sort_by} ${order} LIMIT $2 OFFSET $3`, [threadId, parseInt(limit), parseInt(offset)]);

      res.json(rows);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * POST /api/forums/threads/:threadId/reply
   * Reply to a thread
   */
  async replyToThread(req, res) {
    try {
      if (!req.member) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const userId = req.member.user_id || req.member.id;
      const { threadId } = req.params;
      const { content } = req.body;

      // Validation
      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      // Check if thread exists
      const threadResult = await socialDb.query(
        'SELECT id FROM forum_threads WHERE id = $1', [threadId]
      );

      if (threadResult.rows.length === 0) {
        return res.status(404).json({ error: 'Thread not found' });
      }

      // Create the post
      const postResult = await socialDb.query(
        `INSERT INTO forum_posts 
         (thread_id, author_id, content)
         VALUES ($1, $2, $3)
         RETURNING *`, [threadId, userId, content]
      );

      res.status(201).json(postResult.rows[0]);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * POST /api/forums
   * Create a new forum
   */
  async create(req, res) {
    try {
      if (!req.member) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const userId = req.member.user_id || req.member.id;
      const { name, description, category_id } = req.body;

      // Validation
      if (!name || !category_id) {
        return res.status(400).json({ error: 'Name and category ID are required' });
      }

      // Check if user has permission to create forums (e.g., is admin or moderator)
      // For simplicity, we'll assume any authenticated user can create a forum
      // In a real implementation, you'd check user roles

      const { rows } = await socialDb.query(
        `INSERT INTO forums 
         (name, description, category_id, created_by)
         VALUES ($1, $2, $3, $4)
         RETURNING *`, [name, description, category_id, userId]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * GET /api/forums/posts
   * Get all forum posts
   */
  async getAllPosts(req, res) {
    try {
      const { limit = 20, offset = 0 } = req.query;

      const query = `SELECT fp.id, fp.content, fp.author_id, 
                            m.membername as author_membername, m.avatar_url as author_avatar,
                            ft.title as title, fc.name as category,
                            fp.created_at, fp.updated_at
                     FROM forum_posts fp
                     LEFT JOIN members m ON fp.author_id = m.user_id
                     LEFT JOIN forum_threads ft ON fp.thread_id = ft.id
                     LEFT JOIN forums f ON ft.forum_id = f.id
                     LEFT JOIN forum_categories fc ON f.category_id = fc.id
                     ORDER BY fp.created_at DESC
                     LIMIT $1 OFFSET $2`;

      const { rows } = await socialDb.query(query, [parseInt(limit), parseInt(offset)]);

      // Transform to match expected format
      const transformedPosts = rows.map(post => ({
        id: post.id.toString(),
        title: post.title || 'Forum Post',
        content: post.content,
        author_id: post.author_id,
        author_membername: post.author_membername || `User_${post.author_id}`,
        author_avatar: post.author_avatar || '',
        category: post.category || 'general',
        created_at: post.created_at,
        updated_at: post.updated_at || post.created_at,
        like_count: 0,
        comment_count: 0,
        is_liked: false,
        view_count: 0
      }));

      res.json(transformedPosts);
    } catch (err) {
      logger.error('Error fetching forum posts:', err);
      res.status(500).json({ error: 'Server error fetching posts' });
    }
  }
}

module.exports = new ForumsController();
