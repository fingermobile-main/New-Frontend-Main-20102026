const logger = require('../utils/logger');
const { MiiAvatar, MiiTemplate, MiiItem } = require('../models/mii');


class MiiService {
  // Get user avatars
  async getUserAvatars(userId) {
    try {
      const avatars = await MiiAvatar.findAll({
        where: { userId: userId },
        order: [['createdAt', 'DESC']]
      });

      return avatars;
    } catch (error) {
      logger.error('Error fetching user avatars:', error);
      throw error;
    }
  }

  // Create new avatar
  async createAvatar(userId, avatarData) {
    try {
      const avatar = await MiiAvatar.create({
        userId: userId,
        name: avatarData.name,
        baseTemplate: avatarData.baseTemplate,
        customization: avatarData.customization || {}
      });

      return avatar;
    } catch (error) {
      logger.error('Error creating avatar:', error);
      throw error;
    }
  }

  // Update avatar customization
  async updateAvatarCustomization(avatarId, userId, customization) {
    try {
      const avatar = await MiiAvatar.findOne({
        where: {
          id: avatarId,
          userId: userId
        }
      });

      if (!avatar) {
        throw new Error('Avatar not found or unauthorized');
      }

      await avatar.update({
        customization: customization,
        updatedAt: new Date()
      });

      return avatar;
    } catch (error) {
      logger.error('Error updating avatar customization:', error);
      throw error;
    }
  }

  // Get avatar templates
  async getTemplates(filters = {}) {
    try {
      let whereClause = { isAvailable: true };

      // Apply filters if provided
      if (filters.category) {
        whereClause.category = filters.category;
      }

      const templates = await MiiTemplate.findAll({
        where: whereClause,
        order: [['popularity', 'DESC']]
      });

      return templates;
    } catch (error) {
      logger.error('Error fetching templates:', error);
      throw error;
    }
  }

  // Get avatar customization items
  async getItems(filters = {}) {
    try {
      let whereClause = { isAvailable: true };

      // Apply filters if provided
      if (filters.category) {
        whereClause.category = filters.category;
      }

      if (filters.rarity) {
        whereClause.rarity = filters.rarity;
      }

      const items = await MiiItem.findAll({
        where: whereClause,
        order: [
          ['category', 'ASC'],
          ['name', 'ASC']
        ]
      });

      return items;
    } catch (error) {
      logger.error('Error fetching items:', error);
      throw error;
    }
  }

  // Get item by ID
  async getItemById(itemId) {
    try {
      const item = await MiiItem.findByPk(itemId);
      return item;
    } catch (error) {
      logger.error('Error fetching item by ID:', error);
      throw error;
    }
  }

  // Get template by ID
  async getTemplateById(templateId) {
    try {
      const template = await MiiTemplate.findByPk(templateId);
      return template;
    } catch (error) {
      logger.error('Error fetching template by ID:', error);
      throw error;
    }
  }
}

module.exports = new MiiService();
