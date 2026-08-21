const { pool } = require('../db');

class CommunityService {
  /**
   * Get all communities with pagination and filtering
   */
  async getAllCommunities(options = {}) {
    try {
      const { page = 1, limit = 20, category, type, search, sortBy = 'created_at', order = 'DESC' } = options;
      const offset = (page - 1) * limit;

      let query = `
        SELECT 
          c.*,
          u.name as creator_name,
          u.avatar as creator_avatar
        FROM communities c
        JOIN users u ON c.creator_id = u.id
        WHERE c.status = 'active'
      `;

      const params = [];
      let paramCount = 0;

      if (category) {
        paramCount++;
        query += ` AND c.category = $${paramCount}`;
        params.push(category);
      }

      if (type) {
        paramCount++;
        query += ` AND c.type = $${paramCount}::community_type`;
        params.push(type);
      }

      if (search) {
        paramCount++;
        query += ` AND (c.name ILIKE $${paramCount} OR c.description ILIKE $${paramCount})`;
        params.push(`%${search}%`);
      }

      // Order by
      const validSortFields = ['created_at', 'member_count', 'name', 'post_count'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
      const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      query += ` ORDER BY c.${sortField} ${sortOrder}`;

      // Pagination
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(limit);

      paramCount++;
      query += ` OFFSET $${paramCount}`;
      params.push(offset);

      const result = await pool.query(query, params);

      // Get total count
      let countQuery = `SELECT COUNT(*) FROM communities WHERE status = 'active'`;
      const countParams = [];
      let countParamCount = 0;

      if (category) {
        countParamCount++;
        countQuery += ` AND category = $${countParamCount}`;
        countParams.push(category);
      }

      if (type) {
        countParamCount++;
        countQuery += ` AND type = $${countParamCount}::community_type`;
        countParams.push(type);
      }

      if (search) {
        countParamCount++;
        countQuery += ` AND (name ILIKE $${countParamCount} OR description ILIKE $${countParamCount})`;
        countParams.push(`%${search}%`);
      }

      const countResult = await pool.query(countQuery, countParams);

      return {
        communities: result.rows,
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
      };
    } catch (error) {
      logger.error('Error getting communities:', error);
      throw error;
    }
  }

  /**
   * Get single community by ID with details
   */
  async getCommunityById(communityId, userId = null) {
    try {
      const query = `
        SELECT 
          c.*,
          u.name as creator_name,
          u.avatar as creator_avatar,
          CASE 
            WHEN cm.user_id IS NOT NULL THEN cm.role 
            ELSE NULL 
          END as user_role,
          CASE 
            WHEN cm.user_id IS NOT NULL THEN true 
            ELSE false 
          END as is_member
        FROM communities c
        JOIN users u ON c.creator_id = u.id
        LEFT JOIN community_members cm ON c.id = cm.community_id AND cm.user_id = $2
        WHERE c.id = $1 AND c.status = 'active'
      `;

      const result = await pool.query(query, [communityId, userId]);

      if (result.rows.length === 0) {
        throw new Error('Community not found');
      }

      const community = result.rows[0];

      // Get recent posts count
      const postsQuery = `
        SELECT COUNT(*) as post_count
        FROM community_posts
        WHERE community_id = $1 AND status = 'published'
      `;
      const postsResult = await pool.query(postsQuery, [communityId]);
      community.recent_post_count = parseInt(postsResult.rows[0].post_count);

      return community;
    } catch (error) {
      logger.error('Error getting community by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new community
   */
  async createCommunity(userId, communityData) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const { name, description, type, category, tags, avatar_url, cover_image_url, rules, settings } = communityData;

      // Generate slug from name
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      // Check if slug already exists
      const slugCheck = await client.query('SELECT id FROM communities WHERE slug = $1', [slug]);
      if (slugCheck.rows.length > 0) {
        throw new Error('Community with this name already exists');
      }

      // Insert community
      const insertQuery = `
        INSERT INTO communities (
          name, slug, description, type, category, tags, creator_id,
          avatar_url, cover_image_url, rules, settings
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;

      const result = await client.query(insertQuery, [
        name,
        slug,
        description || null,
        type || 'public',
        category || null,
        tags || [],
        userId,
        avatar_url || null,
        cover_image_url || null,
        rules || null,
        JSON.stringify(settings || {})
      ]);

      const community = result.rows[0];

      // Add creator as owner member
      await client.query(`
        INSERT INTO community_members (community_id, user_id, role, status)
        VALUES ($1, $2, 'owner', 'active')
      `, [community.id, userId]);

      await client.query('COMMIT');

      return community;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error creating community:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Join a community
   */
  async joinCommunity(communityId, userId) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Check if community exists and is active
      const communityCheck = await client.query(
        'SELECT id, type, settings FROM communities WHERE id = $1 AND status = \'active\'',
        [communityId]
      );

      if (communityCheck.rows.length === 0) {
        throw new Error('Community not found or inactive');
      }

      const community = communityCheck.rows[0];

      // Check if already a member
      const memberCheck = await client.query(
        'SELECT id, status FROM community_members WHERE community_id = $1 AND user_id = $2',
        [communityId, userId]
      );

      if (memberCheck.rows.length > 0) {
        const existingMember = memberCheck.rows[0];
        if (existingMember.status === 'active') {
          throw new Error('Already a member of this community');
        } else if (existingMember.status === 'banned') {
          throw new Error('You are banned from this community');
        } else if (existingMember.status === 'pending') {
          throw new Error('Membership request is pending approval');
        }
      }

      // Determine initial status based on community settings
      const settings = community.settings;
      const requiresApproval = settings.require_approval || false;
      const initialStatus = requiresApproval ? 'pending' : 'active';

      // Add member
      await client.query(`
        INSERT INTO community_members (community_id, user_id, role, status)
        VALUES ($1, $2, 'member', $3)
        ON CONFLICT (community_id, user_id) 
        DO UPDATE SET status = $3, joined_at = NOW()
      `, [communityId, userId, initialStatus]);

      await client.query('COMMIT');

      return {
        success: true,
        status: initialStatus,
        message: requiresApproval 
          ? 'Membership request submitted for approval' 
          : 'Successfully joined community'
      };
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error joining community:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Leave a community
   */
  async leaveCommunity(communityId, userId) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Check membership
      const memberCheck = await client.query(
        'SELECT role FROM community_members WHERE community_id = $1 AND user_id = $2 AND status = \'active\'',
        [communityId, userId]
      );

      if (memberCheck.rows.length === 0) {
        throw new Error('Not a member of this community');
      }

      const member = memberCheck.rows[0];

      // Prevent owner from leaving without transferring ownership
      if (member.role === 'owner') {
        throw new Error('Cannot leave as owner. Transfer ownership first or delete the community.');
      }

      // Remove member
      await client.query(`
        DELETE FROM community_members 
        WHERE community_id = $1 AND user_id = $2
      `, [communityId, userId]);

      await client.query('COMMIT');

      return { success: true, message: 'Successfully left community' };
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error leaving community:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update community
   */
  async updateCommunity(communityId, userId, updates) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Check if user has permission (owner or admin)
      const permissionCheck = await client.query(`
        SELECT role FROM community_members 
        WHERE community_id = $1 AND user_id = $2 AND status = 'active'
        AND role IN ('owner', 'admin')
      `, [communityId, userId]);

      if (permissionCheck.rows.length === 0) {
        throw new Error('Insufficient permissions to update community');
      }

      // Build dynamic update query
      const allowedFields = ['name', 'description', 'category', 'tags', 'avatar_url', 'cover_image_url', 'rules', 'settings'];
      const updateFields = [];
      const values = [];
      let paramCount = 0;

      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          paramCount++;
          if (field === 'settings') {
            updateFields.push(`${field} = $${paramCount}::jsonb`);
            values.push(JSON.stringify(updates[field]));
          } else if (field === 'tags') {
            updateFields.push(`${field} = $${paramCount}::text[]`);
            values.push(updates[field]);
          } else {
            updateFields.push(`${field} = $${paramCount}`);
            values.push(updates[field]);
          }
        }
      }

      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }

      // Handle name/slug update
      if (updates.name) {
        const slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        paramCount++;
        updateFields.push(`slug = $${paramCount}`);
        values.push(slug);
      }

      paramCount++;
      values.push(communityId);

      const updateQuery = `
        UPDATE communities 
        SET ${updateFields.join(', ')} updated_at = NOW()
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await client.query(updateQuery, values);

      await client.query('COMMIT');

      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error updating community:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete community
   */
  async deleteCommunity(communityId, userId) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Check if user is owner
      const ownerCheck = await client.query(`
        SELECT role FROM community_members 
        WHERE community_id = $1 AND user_id = $2 AND role = 'owner'
      `, [communityId, userId]);

      if (ownerCheck.rows.length === 0) {
        throw new Error('Only the owner can delete a community');
      }

      // Soft delete by changing status
      const result = await client.query(`
        UPDATE communities 
        SET status = 'archived', updated_at = NOW()
        WHERE id = $1
        RETURNING id, name
      `, [communityId]);

      if (result.rows.length === 0) {
        throw new Error('Community not found');
      }

      await client.query('COMMIT');

      return {
        success: true,
        message: 'Community archived successfully',
        community: result.rows[0]
      };
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error deleting community:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get community members
   */
  async getCommunityMembers(communityId, options = {}) {
    try {
      const { page = 1, limit = 50, role, search } = options;
      const offset = (page - 1) * limit;

      let query = `
        SELECT 
          cm.*,
          u.name,
          u.username,
          u.avatar,
          u.is_verified
        FROM community_members cm
        JOIN users u ON cm.user_id = u.id
        WHERE cm.community_id = $1 AND cm.status = 'active'
      `;

      const params = [communityId];
      let paramCount = 1;

      if (role) {
        paramCount++;
        query += ` AND cm.role = $${paramCount}::community_role`;
        params.push(role);
      }

      if (search) {
        paramCount++;
        query += ` AND (u.name ILIKE $${paramCount} OR u.username ILIKE $${paramCount})`;
        params.push(`%${search}%`);
      }

      query += ` ORDER BY cm.joined_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
      params.push(limit, offset);

      const result = await pool.query(query, params);

      // Get total count
      let countQuery = `
        SELECT COUNT(*) FROM community_members cm
        WHERE cm.community_id = $1 AND cm.status = 'active'
      `;
      const countParams = [communityId];

      if (role) {
        countQuery += ` AND cm.role = '${role}'::community_role`;
      }

      const countResult = await pool.query(countQuery, countParams);

      return {
        members: result.rows,
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit)
      };
    } catch (error) {
      logger.error('Error getting community members:', error);
      throw error;
    }
  }
}

module.exports = new CommunityService();
