const logger = require('../utils/logger');
const Group = require('../models/Group'); // Using the updated Group model
const GroupMembership = require('../models/GroupMembership'); // Adding GroupMembership model
const User = require('../models/User'); // Adding User model for associations
const { Op } = require('sequelize');

class GroupsService {
  // Get all groups with pagination and filtering
  async getAllGroups(filters = {}, pagination = { page: 1, limit: 20 }) {
    try {
      const { page, limit } = pagination;
      const offset = (page - 1) * limit;

      // Build filters
      const where = { status: 'active' };

      // Search by name or description
      if (filters.search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${filters.search}%` } },
          { description: { [Op.iLike]: `%${filters.search}%` } }
        ];
      }

      // Filter by category
      if (filters.category) {
        where.category = filters.category;
      }

      // Filter by privacy
      if (filters.privacy) {
        where.privacy = filters.privacy;
      }

      // Fetch groups with pagination
      const { count, rows: groups } = await Group.findAndCountAll({
        where,
        limit,
        offset,
        order: [['memberCount', 'DESC'], ['createdAt', 'DESC']],
        include: [{
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'avatarUrl'],
          foreignKey: 'creatorId'
        }]
      });

      const totalPages = Math.ceil(count / limit);

      return {
        success: true,
        data: groups.map(group => ({
          id: group.id,
          name: group.name,
          description: group.description,
          category: group.category,
          privacy: group.privacy,
          memberCount: group.memberCount,
          creator: {
            id: group.creator?.id,
            username: group.creator?.username,
            avatarUrl: group.creator?.avatarUrl
          },
          avatarUrl: group.avatarUrl,
          bannerUrl: group.bannerUrl,
          isJoined: false, // This would be determined based on current user
          lastActivity: group.updatedAt,
          createdAt: group.createdAt
        })),
        pagination: {
          page,
          limit,
          total: count,
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

  // Get group by ID
  async getGroupById(groupId) {
    try {
      const group = await Group.findByPk(groupId, {
        include: [{
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'email', 'avatarUrl'],
          foreignKey: 'creatorId'
        }]
      });

      if (!group) {
        return { success: false, message: 'Group not found' };
      }

      return {
        success: true,
        data: {
          id: group.id,
          name: group.name,
          description: group.description,
          category: group.category,
          privacy: group.privacy,
          memberCount: group.memberCount,
          rules: group.rules,
          avatarUrl: group.avatarUrl,
          bannerUrl: group.bannerUrl,
          metadata: group.metadata,
          creator: {
            id: group.creator?.id,
            username: group.creator?.username,
            email: group.creator?.email,
            avatarUrl: group.creator?.avatarUrl
          },
          status: group.status,
          createdAt: group.createdAt,
          updatedAt: group.updatedAt
        }
      };
    } catch (error) {
      logger.error('Error in GroupsService.getGroupById:', error);
      throw error;
    }
  }

  // Create new group
  async createGroup(groupData, userId) {
    try {
      const group = await Group.create({
        name: groupData.name,
        description: groupData.description,
        category: groupData.category,
        privacy: groupData.privacy || 'public',
        rules: groupData.rules,
        avatarUrl: groupData.avatarUrl,
        bannerUrl: groupData.bannerUrl,
        metadata: groupData.metadata || {},
        creatorId: userId // Store the creator ID
      });

      // Automatically add creator as group admin/member
      await GroupMembership.create({
        groupId: group.id,
        userId: userId,
        role: 'admin', // Creator becomes admin
        status: 'accepted', // Auto-accept creator's membership
        joinedAt: new Date()
      });

      return {
        success: true,
        message: 'Group created successfully',
        data: {
          id: group.id,
          name: group.name,
          category: group.category,
          privacy: group.privacy,
          memberCount: group.memberCount,
          createdAt: group.createdAt
        }
      };
    } catch (error) {
      logger.error('Error in GroupsService.createGroup:', error);
      throw error;
    }
  }

  // Update group
  async updateGroup(groupId, updates, userId) {
    try {
      const group = await Group.findByPk(groupId);

      if (!group) {
        return { success: false, message: 'Group not found' };
      }

      // Only creator can update
      if (group.creatorId !== userId) {
        return { success: false, message: 'Not authorized to update this group' };
      }

      await group.update(updates);

      return {
        success: true,
        message: 'Group updated successfully',
        data: {
          id: group.id,
          name: group.name,
          description: group.description,
          updatedAt: group.updatedAt
        }
      };
    } catch (error) {
      logger.error('Error in GroupsService.updateGroup:', error);
      throw error;
    }
  }

  // Delete/archive group
  async deleteGroup(groupId, userId) {
    try {
      const group = await Group.findByPk(groupId);

      if (!group) {
        return { success: false, message: 'Group not found' };
      }

      // Only creator can delete
      if (group.creatorId !== userId) {
        return { success: false, message: 'Not authorized to delete this group' };
      }

      // Soft delete by archiving
      await group.update({ status: 'archived' });

      return {
        success: true,
        message: 'Group archived successfully'
      };
    } catch (error) {
      logger.error('Error in GroupsService.deleteGroup:', error);
      throw error;
    }
  }

  // Join group
  async joinGroup(groupId, userId) {
    try {
      const group = await Group.findByPk(groupId);

      if (!group) {
        return { success: false, message: 'Group not found' };
      }

      // Check if user is already a member
      const existingMembership = await GroupMembership.findOne({
        where: {
          groupId: groupId,
          userId: userId
        }
      });

      if (existingMembership) {
        if (existingMembership.status === 'banned') {
          return { success: false, message: 'You have been banned from this group' };
        }
        return { success: false, message: 'Already a member of this group' };
      }

      // Determine if approval is needed based on group privacy
      const status = group.privacy === 'public' ? 'accepted' : 'pending';

      await GroupMembership.create({
        groupId: groupId,
        userId: userId,
        role: 'member',
        status: status,
        joinedAt: new Date()
      });

      // Increment member count
      await group.increment('memberCount');

      return {
        success: true,
        message: status === 'accepted' ? 'Successfully joined group!' : 'Join request submitted for approval'
      };
    } catch (error) {
      logger.error('Error in GroupsService.joinGroup:', error);
      throw error;
    }
  }

  // Leave group
  async leaveGroup(groupId, userId) {
    try {
      const membership = await GroupMembership.findOne({
        where: {
          groupId: groupId,
          userId: userId
        }
      });

      if (!membership) {
        return { success: false, message: 'Not a member of this group' };
      }

      if (membership.status === 'banned') {
        return { success: false, message: 'You have been banned from this group and cannot leave' };
      }

      // Don't allow group creator to leave (unless deleting group)
      const group = await Group.findByPk(groupId);
      if (group.creatorId === userId) {
        return { success: false, message: 'Group creator cannot leave. Transfer ownership or delete group.' };
      }

      await membership.destroy();

      // Decrement member count
      await group.decrement('memberCount');

      return {
        success: true,
        message: 'Successfully left group'
      };
    } catch (error) {
      logger.error('Error in GroupsService.leaveGroup:', error);
      throw error;
    }
  }

  // Get group statistics
  async getStats() {
    try {
      const totalCount = await Group.count({ where: { status: 'active' } });
      const privateCount = await Group.count({ where: { status: 'active', privacy: 'private' } });
      const secretCount = await Group.count({ where: { status: 'active', privacy: 'secret' } });
      const publicCount = totalCount - privateCount - secretCount;

      const categoryStats = await Group.findAll({
        attributes: [
          'category',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
        ],
        where: { status: 'active' },
        group: ['category']
      });

      return {
        success: true,
        data: {
          total: totalCount,
          public: publicCount,
          private: privateCount,
          secret: secretCount,
          byCategory: categoryStats.reduce((acc, stat) => {
            acc[stat.category] = parseInt(stat.dataValues.count);
            return acc;
          }, {})
        }
      };
    } catch (error) {
      logger.error('Error in GroupsService.getStats:', error);
      throw error;
    }
  }

  // Check if user is member of group
  async isGroupMember(groupId, userId) {
    try {
      const membership = await GroupMembership.findOne({
        where: {
          groupId: groupId,
          userId: userId,
          status: 'accepted'
        }
      });

      return !!membership;
    } catch (error) {
      logger.error('Error in GroupsService.isGroupMember:', error);
      throw error;
    }
  }
}

module.exports = new GroupsService();
