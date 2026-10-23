/**
 * Groups Service
 * Pure PostgreSQL implementation for community groups with pagination and membership
 * FingerMobile Protocol™
 */

const db = require('../db');
const logger = require('../utils/logger');

const getPool = () => db.pool || db;

class GroupsService {
  /**
   * Get all groups with pagination and filtering
   */
  async getAllGroups(filters = {}, pagination = { page: 1, limit: 20 }) {
    try {
      const page = parseInt(pagination.page, 10) || 1;
      const limit = Math.min(parseInt(pagination.limit, 10) || 20, 100);
      const offset = (page - 1) * limit;

      let whereClause = 'WHERE g.moderation_status = \'active\'';
      const params = [];

      if (filters.search) {
        params.push(`%${filters.search}%`);
        whereClause += ` AND (g.name ILIKE $${params.length} OR g.description ILIKE $${params.length})`;
      }

      if (filters.category && filters.category !== 'all' && filters.category !== 'All') {
        params.push(filters.category);
        whereClause += ` AND LOWER(g.category) = LOWER($${params.length})`;
      }

      if (filters.privacy && filters.privacy !== 'all') {
        params.push(filters.privacy);
        whereClause += ` AND g.privacy_level = $${params.length}`;
      }

      const pool = getPool();

      // Total count
      const countRes = await pool.query(
        `SELECT COUNT(*) FROM groups g ${whereClause}`,
        params
      );
      const total = parseInt(countRes.rows[0]?.count || '0', 10);

      // Groups list with creator info
      const queryParams = [...params, limit, offset];
      const listRes = await pool.query(
        `SELECT g.*, 
                u.username AS creator_username, 
                u.avatar_url AS creator_avatar,
                u.email AS creator_email
         FROM groups g
         LEFT JOIN users u ON g.creator_id::text = u.id::text
         ${whereClause}
         ORDER BY g.members_count DESC, g.created_at DESC
         LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`,
        queryParams
      );

      const totalPages = Math.ceil(total / limit) || 1;

      return {
        success: true,
        data: listRes.rows.map(group => ({
          id: group.id,
          name: group.name,
          description: group.description || '',
          category: group.category || 'General',
          privacy: group.privacy_level || 'public',
          privacy_level: group.privacy_level || 'public',
          is_public: group.is_public !== false,
          memberCount: parseInt(group.members_count || 1, 10),
          members_count: parseInt(group.members_count || 1, 10),
          creator: {
            id: group.creator_id,
            username: group.creator_username || 'Creator',
            avatarUrl: group.creator_avatar || null,
            email: group.creator_email || null
          },
          creator_id: group.creator_id,
          avatarUrl: group.avatar_url || null,
          avatar_url: group.avatar_url || null,
          bannerUrl: group.banner_url || null,
          banner_url: group.banner_url || null,
          moderation_status: group.moderation_status,
          status: group.moderation_status,
          isJoined: false,
          lastActivity: group.updated_at,
          createdAt: group.created_at,
          updatedAt: group.updated_at
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      logger.error('Error in GroupsService.getAllGroups:', error);
      throw error;
    }
  }

  /**
   * Get group by ID
   */
  async getGroupById(groupId) {
    try {
      const pool = getPool();
      const res = await pool.query(
        `SELECT g.*, 
                u.username AS creator_username, 
                u.avatar_url AS creator_avatar,
                u.email AS creator_email
         FROM groups g
         LEFT JOIN users u ON g.creator_id::text = u.id::text
         WHERE g.id = $1`,
        [groupId]
      );

      if (res.rows.length === 0) {
        return { success: false, message: 'Group not found' };
      }

      const group = res.rows[0];

      return {
        success: true,
        data: {
          id: group.id,
          name: group.name,
          description: group.description || '',
          category: group.category || 'General',
          privacy: group.privacy_level || 'public',
          privacy_level: group.privacy_level || 'public',
          is_public: group.is_public !== false,
          memberCount: parseInt(group.members_count || 1, 10),
          members_count: parseInt(group.members_count || 1, 10),
          creator: {
            id: group.creator_id,
            username: group.creator_username || 'Creator',
            email: group.creator_email || null,
            avatarUrl: group.creator_avatar || null
          },
          creator_id: group.creator_id,
          avatarUrl: group.avatar_url || null,
          bannerUrl: group.banner_url || null,
          moderation_status: group.moderation_status,
          status: group.moderation_status,
          createdAt: group.created_at,
          updatedAt: group.updated_at
        }
      };
    } catch (error) {
      logger.error('Error in GroupsService.getGroupById:', error);
      throw error;
    }
  }

  /**
   * Create new group
   */
  async createGroup(groupData, userId) {
    try {
      const pool = getPool();
      const name = (groupData.name || '').trim();
      if (!name) {
        return { success: false, message: 'Group name is required' };
      }

      const privacy = groupData.privacy || groupData.privacy_level || 'public';
      const isPublic = privacy === 'public';
      const category = groupData.category || 'General';
      const description = groupData.description || '';
      const avatarUrl = groupData.avatarUrl || groupData.avatar_url || null;
      const bannerUrl = groupData.bannerUrl || groupData.banner_url || null;
      const creatorId = String(userId || '00000000-0000-0000-0000-000000000001');

      const insertRes = await pool.query(
        `INSERT INTO groups (
          creator_id, name, description, category, privacy_level, is_public,
          avatar_url, banner_url, members_count, moderation_status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, 1, 'active', NOW(), NOW()
        ) RETURNING *`,
        [creatorId, name, description, category, privacy, isPublic, avatarUrl, bannerUrl]
      );

      const createdGroup = insertRes.rows[0];

      // Add creator to group_members as admin
      try {
        await pool.query(
          `INSERT INTO group_members (group_id, user_id, role, joined_at)
           VALUES ($1, $2, 'admin', NOW())
           ON CONFLICT DO NOTHING`,
          [createdGroup.id, creatorId]
        );
      } catch (memErr) {
        logger.warn('Non-fatal group membership insertion warning:', memErr);
      }

      return {
        success: true,
        message: 'Group created successfully',
        data: {
          id: createdGroup.id,
          name: createdGroup.name,
          category: createdGroup.category,
          privacy: createdGroup.privacy_level,
          memberCount: 1,
          createdAt: createdGroup.created_at
        }
      };
    } catch (error) {
      logger.error('Error in GroupsService.createGroup:', error);
      throw error;
    }
  }

  /**
   * Update group
   */
  async updateGroup(groupId, updates, userId) {
    try {
      const pool = getPool();
      const checkRes = await pool.query('SELECT * FROM groups WHERE id = $1', [groupId]);
      if (checkRes.rows.length === 0) {
        return { success: false, message: 'Group not found' };
      }

      const group = checkRes.rows[0];
      if (group.creator_id && userId && String(group.creator_id) !== String(userId)) {
        return { success: false, message: 'Not authorized to update this group' };
      }

      const updateRes = await pool.query(
        `UPDATE groups 
         SET name = COALESCE($1, name),
             description = COALESCE($2, description),
             category = COALESCE($3, category),
             privacy_level = COALESCE($4, privacy_level),
             avatar_url = COALESCE($5, avatar_url),
             banner_url = COALESCE($6, banner_url),
             updated_at = NOW()
         WHERE id = $7
         RETURNING *`,
        [updates.name, updates.description, updates.category, updates.privacy || updates.privacy_level, updates.avatarUrl || updates.avatar_url, updates.bannerUrl || updates.banner_url, groupId]
      );

      return {
        success: true,
        message: 'Group updated successfully',
        data: updateRes.rows[0]
      };
    } catch (error) {
      logger.error('Error in GroupsService.updateGroup:', error);
      throw error;
    }
  }

  /**
   * Delete / archive group
   */
  async deleteGroup(groupId, userId) {
    try {
      const pool = getPool();
      const checkRes = await pool.query('SELECT * FROM groups WHERE id = $1', [groupId]);
      if (checkRes.rows.length === 0) {
        return { success: false, message: 'Group not found' };
      }

      const group = checkRes.rows[0];
      if (group.creator_id && userId && String(group.creator_id) !== String(userId)) {
        return { success: false, message: 'Not authorized to delete this group' };
      }

      await pool.query(
        'UPDATE groups SET moderation_status = \'archived\', updated_at = NOW() WHERE id = $1',
        [groupId]
      );

      return {
        success: true,
        message: 'Group archived successfully'
      };
    } catch (error) {
      logger.error('Error in GroupsService.deleteGroup:', error);
      throw error;
    }
  }

  /**
   * Join group
   */
  async joinGroup(groupId, userId) {
    try {
      const pool = getPool();
      const groupRes = await pool.query('SELECT * FROM groups WHERE id = $1', [groupId]);
      if (groupRes.rows.length === 0) {
        return { success: false, message: 'Group not found' };
      }

      const checkMem = await pool.query(
        'SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2',
        [groupId, String(userId)]
      );
      if (checkMem.rows.length > 0) {
        return { success: false, message: 'Already a member of this group' };
      }

      await pool.query(
        'INSERT INTO group_members (group_id, user_id, role, joined_at) VALUES ($1, $2, \'member\', NOW())',
        [groupId, String(userId)]
      );

      await pool.query(
        'UPDATE groups SET members_count = members_count + 1, updated_at = NOW() WHERE id = $1',
        [groupId]
      );

      return {
        success: true,
        message: 'Successfully joined group'
      };
    } catch (error) {
      logger.error('Error in GroupsService.joinGroup:', error);
      throw error;
    }
  }

  /**
   * Leave group
   */
  async leaveGroup(groupId, userId) {
    try {
      const pool = getPool();
      const deleteRes = await pool.query(
        'DELETE FROM group_members WHERE group_id = $1 AND user_id = $2 RETURNING id',
        [groupId, String(userId)]
      );

      if (deleteRes.rows.length === 0) {
        return { success: false, message: 'Not a member of this group' };
      }

      await pool.query(
        'UPDATE groups SET members_count = GREATEST(1, members_count - 1), updated_at = NOW() WHERE id = $1',
        [groupId]
      );

      return {
        success: true,
        message: 'Successfully left group'
      };
    } catch (error) {
      logger.error('Error in GroupsService.leaveGroup:', error);
      throw error;
    }
  }

  /**
   * Get group members
   */
  async getGroupMembers(groupId) {
    try {
      const pool = getPool();
      const res = await pool.query(
        `SELECT gm.*, u.username, u.avatar_url, u.email
         FROM group_members gm
         LEFT JOIN users u ON gm.user_id::text = u.id::text
         WHERE gm.group_id = $1
         ORDER BY gm.joined_at ASC`,
        [groupId]
      );

      return {
        success: true,
        data: res.rows
      };
    } catch (error) {
      logger.error('Error in GroupsService.getGroupMembers:', error);
      throw error;
    }
  }
}

module.exports = new GroupsService();
