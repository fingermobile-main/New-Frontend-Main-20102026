const db = require('../db');
const logger = require('../utils/logger');

const getPool = () => db.pool || db;

const logErr = (msg, err) => {
  if (logger && typeof logger.error === 'function') logger.error(msg, err);
  else console.error(msg, err);
};

class BlogsController {
  /**
   * GET /api/blogs/posts
   * Get blog posts with filtering and pagination
   */
  async getPosts(req, res) {
    try {
      const {
        status = 'published',
        author_id,
        category_id,
        tag,
        blog_id,
        is_featured,
        limit = 20,
        offset = 0,
        sort = 'created_at_desc'
      } = req.query;

      let query = `SELECT bp.id, bp.title, bp.content, bp.excerpt, bp.author_id, 
                          COALESCE(u.username, 'Author') as author_membername, 
                          u.avatar_url as author_avatar, 
                          bc.name as category, bp.meta_keywords as tags, bp.created_at, bp.updated_at,
                          bp.likes_count as likes, bp.views_count as views, bp.comments_count as comment_count,
                          EXISTS(SELECT 1 FROM blog_post_likes bpl WHERE bpl.post_id = bp.id AND ($1::text IS NOT NULL AND bpl.user_id::text = $1::text)) as is_liked,
                          false as is_bookmarked, bp.is_featured
                   FROM blog_posts bp
                   LEFT JOIN users u ON bp.author_id::text = u.id::text
                   LEFT JOIN blog_categories bc ON bp.category_id = bc.id`;
      const params = [];
      let paramIndex = 0;

      // Add user_id parameter for is_liked check
      const userId = req.user?.id || req.member?.id || null;
      params.push(userId);
      paramIndex++;

      const conditions = [];

      if (status) {
        paramIndex++;
        conditions.push(`bp.status = $${paramIndex}`);
        params.push(status);
      }

      if (author_id) {
        paramIndex++;
        conditions.push(`(bp.author_id::text = $${paramIndex}::text)`);
        params.push(author_id);
      }

      if (category_id) {
        paramIndex++;
        conditions.push(`bp.category_id = $${paramIndex}`);
        params.push(category_id);
      }

      if (blog_id) {
        paramIndex++;
        conditions.push(`bp.blog_id = $${paramIndex}`);
        params.push(blog_id);
      }

      if (is_featured !== undefined) {
        paramIndex++;
        conditions.push(`bp.is_featured = $${paramIndex}`);
        params.push(is_featured === 'true');
      }

      if (tag) {
        paramIndex++;
        conditions.push(`$${paramIndex} = ANY(bp.meta_keywords)`);
        params.push(tag);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      const validSorts = {
        'created_at_desc': 'bp.created_at DESC',
        'created_at_asc': 'bp.created_at ASC',
        'updated_at_desc': 'bp.updated_at DESC',
        'title_asc': 'bp.title ASC',
        'popular': 'bp.views_count DESC, bp.likes_count DESC'
      };
      const orderBy = validSorts[sort] || validSorts['created_at_desc'];
      query += ` ORDER BY ${orderBy}`;

      paramIndex++;
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(parseInt(limit, 10), parseInt(offset, 10));

      const { rows } = await getPool().query(query, params);

      let countQuery = 'SELECT COUNT(*) as total FROM blog_posts bp';
      const countParams = [];
      const countConditions = [];
      if (status) {
        countParams.push(status);
        countConditions.push(`bp.status = $${countParams.length}`);
      }
      if (author_id) {
        countParams.push(author_id);
        countConditions.push(`(bp.author_id::text = $${countParams.length}::text)`);
      }
      if (category_id) {
        countParams.push(category_id);
        countConditions.push(`bp.category_id = $${countParams.length}`);
      }
      if (blog_id) {
        countParams.push(blog_id);
        countConditions.push(`bp.blog_id = $${countParams.length}`);
      }
      if (is_featured !== undefined) {
        countParams.push(is_featured === 'true');
        countConditions.push(`bp.is_featured = $${countParams.length}`);
      }
      if (tag) {
        countParams.push(tag);
        countConditions.push(`$${countParams.length} = ANY(bp.meta_keywords)`);
      }
      if (countConditions.length > 0) {
        countQuery += ' WHERE ' + countConditions.join(' AND ');
      }
      await getPool().query(countQuery, countParams);

      // The frontend useBlogPosts hook expects a plain array of posts
      res.json(rows);
    } catch (error) {
      logErr('Error in BlogsController.getPosts:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve blog posts', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/blogs/posts/:id
   * Get a specific blog post
   */
  async getPostById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.member?.id || null;

      const { rows } = await getPool().query(
        `SELECT bp.*, 
                COALESCE(u.username, 'Author') as author_membername, 
                u.avatar_url as author_avatar,
                bc.name as category_name,
                EXISTS(SELECT 1 FROM blog_post_likes bpl WHERE bpl.post_id = bp.id AND ($2::text IS NOT NULL AND bpl.user_id::text = $2::text)) as is_liked,
                false as is_bookmarked
         FROM blog_posts bp
         LEFT JOIN users u ON bp.author_id::text = u.id::text
         LEFT JOIN blog_categories bc ON bp.category_id = bc.id
         WHERE bp.id = $1 AND bp.status = 'published'`,
        [id, userId]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Blog post not found'
        });
      }

      // Increment view count
      await getPool().query(
        'UPDATE blog_posts SET views_count = views_count + 1 WHERE id = $1',
        [id]
      );

      res.json(rows[0]);
    } catch (error) {
      logErr('Error in BlogsController.getPostById:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve blog post', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/blogs/posts
   * Create new blog post
   */
  async createPost(req, res) {
    try {
      const {
        title,
        slug,
        excerpt,
        content,
        cover_image,
        category_id,
        tags,
        blog_id,
        status = 'draft',
        is_featured = false,
        seo_title,
        seo_description
      } = req.body;

      let author_id = req.user?.id || req.user?.userId || req.member?.id;
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(author_id));
      if (!isUuid) {
        const userRes = await getPool().query('SELECT id FROM users ORDER BY created_at ASC LIMIT 1');
        author_id = userRes.rows[0]?.id || '00000000-0000-0000-0000-000000000001';
      }

      if (!title || !content) {
        return res.status(400).json({
          success: false, message: 'Title and content are required'
        });
      }

      let targetBlogId = blog_id;
      if (!targetBlogId) {
        const blogRes = await getPool().query('SELECT id FROM blogs LIMIT 1');
        targetBlogId = blogRes.rows[0]?.id;
      }

      const generatedSlug = slug || (title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36));
      const formattedTags = Array.isArray(tags) ? tags : (tags ? [tags] : []);

      const { rows } = await getPool().query(
        `INSERT INTO blog_posts 
         (author_id, blog_id, title, slug, excerpt, content, featured_image_url, category_id, 
          meta_keywords, status, is_featured, seo_title, seo_description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING *`,
        [
          author_id, targetBlogId, title, generatedSlug, excerpt || '', content, cover_image || null, category_id || null,
          formattedTags, status, is_featured, seo_title || title, seo_description || excerpt || ''
        ]
      );

      res.status(201).json({
        success: true, message: 'Blog post created successfully', data: rows[0]
      });
    } catch (error) {
      logErr('Error in BlogsController.createPost:', error);
      res.status(500).json({
        success: false, message: 'Failed to create blog post', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/blogs/posts/:id
   * Update blog post
   */
  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        slug,
        excerpt,
        content,
        cover_image,
        category_id,
        tags,
        blog_id,
        status,
        is_featured,
        seo_title,
        seo_description
      } = req.body;

      const userId = req.user?.id || req.member?.id;
      const userUuid = req.user?.uuid || req.member?.uuid;

      if (!userId && !userUuid) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Verify ownership
      const existing = await getPool().query(
        'SELECT * FROM blog_posts WHERE id = $1 AND (author_id::text = $2::text OR author_id::text = $3::text)',
        [id, userUuid || '', userId ? userId.toString() : '']
      );

      if (existing.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Blog post not found or unauthorized'
        });
      }

      const { rows } = await getPool().query(
        `UPDATE blog_posts 
         SET title = COALESCE($1, title),
             slug = COALESCE($2, slug),
             excerpt = COALESCE($3, excerpt),
             content = COALESCE($4, content),
             featured_image_url = COALESCE($5, featured_image_url),
             category_id = COALESCE($6, category_id),
             meta_keywords = COALESCE($7, meta_keywords),
             blog_id = COALESCE($8, blog_id),
             status = COALESCE($9, status),
             is_featured = COALESCE($10, is_featured),
             seo_title = COALESCE($11, seo_title),
             seo_description = COALESCE($12, seo_description),
             updated_at = NOW()
         WHERE id = $13
         RETURNING *`,
        [
          title, slug, excerpt, content, cover_image, category_id,
          tags ? (Array.isArray(tags) ? tags : [tags]) : null, blog_id, status, is_featured,
          seo_title, seo_description, id
        ]
      );

      res.json({
        success: true, message: 'Blog post updated successfully', data: rows[0]
      });
    } catch (error) {
      logErr('Error in BlogsController.updatePost:', error);
      res.status(500).json({
        success: false, message: 'Failed to update blog post', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/blogs/posts/:id
   * Delete blog post
   */
  async deletePost(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.member?.id;
      const userUuid = req.user?.uuid || req.member?.uuid;

      if (!userId && !userUuid) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const result = await getPool().query(
        'DELETE FROM blog_posts WHERE id = $1 AND (author_id::text = $2::text OR author_id::text = $3::text)',
        [id, userUuid || '', userId ? userId.toString() : '']
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false, message: 'Blog post not found or unauthorized'
        });
      }

      res.json({
        success: true, message: 'Blog post deleted successfully'
      });
    } catch (error) {
      logErr('Error in BlogsController.deletePost:', error);
      res.status(500).json({
        success: false, message: 'Failed to delete blog post', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/blogs/posts/:id/like
   * Like/unlike a blog post
   */
  async togglePostLike(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user?.id || req.member?.id || 1;

      // Check if user already liked the post
      const existingLike = await getPool().query(
        'SELECT * FROM blog_post_likes WHERE post_id = $1 AND user_id = $2',
        [id, user_id]
      );

      if (existingLike.rows.length > 0) {
        // Unlike the post
        await getPool().query(
          'DELETE FROM blog_post_likes WHERE post_id = $1 AND user_id = $2',
          [id, user_id]
        );

        // Decrement like count
        const { rows } = await getPool().query(
          'UPDATE blog_posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = $1 RETURNING likes_count',
          [id]
        );

        return res.json({
          success: true, message: 'Blog post unliked successfully', is_liked: false, like_count: rows[0]?.likes_count || 0
        });
      } else {
        // Like the post
        await getPool().query(
          'INSERT INTO blog_post_likes (post_id, user_id) VALUES ($1, $2)',
          [id, user_id]
        );

        // Increment like count
        const { rows } = await getPool().query(
          'UPDATE blog_posts SET likes_count = likes_count + 1 WHERE id = $1 RETURNING likes_count',
          [id]
        );

        return res.json({
          success: true, message: 'Blog post liked successfully', is_liked: true, like_count: rows[0]?.likes_count || 1
        });
      }
    } catch (error) {
      logErr('Error in BlogsController.togglePostLike:', error);
      res.status(500).json({
        success: false, message: 'Failed to toggle like', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new BlogsController();
