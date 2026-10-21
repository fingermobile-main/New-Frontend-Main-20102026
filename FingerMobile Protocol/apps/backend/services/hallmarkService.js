const logger = require('../utils/logger');
const { Hallmark, UserHallmark } = require('../models/Hallmark');
const { User } = require('../models/User'); // Assuming User model exists


class HallmarkService {
  // Create a new hallmark definition
  async createHallmark(hallmarkData) {
    try {
      const existingHallmark = await Hallmark.findOne({
        where: { name: hallmarkData.name }
      });

      if (existingHallmark) {
        return { success: false, message: 'Hallmark with this name already exists' };
      }

      const hallmark = await Hallmark.create(hallmarkData);

      return { success: true, hallmark };
    } catch (error) {
      logger.error('Error creating hallmark:', error);
      return { success: false, error: error.message };
    }
  }

  // Award a hallmark to a user
  async awardHallmarkToUser(userId, hallmarkId, reason = '') {
    try {
      // Check if user already has this hallmark
      const existingAward = await UserHallmark.findOne({
        where: {
          userId: userId,
          hallmarkId: hallmarkId
        }
      });

      if (existingAward) {
        return { success: false, message: 'User already has this hallmark' };
      }

      // Create the user-hallmark relationship
      const userHallmark = await UserHallmark.create({
        userId: userId,
        hallmarkId: hallmarkId,
        reason: reason
      });

      return { success: true, userHallmark };
    } catch (error) {
      logger.error('Error awarding hallmark to user:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if user qualifies for a milestone hallmark (e.g., Artist Hallmark at 10k streams)
  async checkAndAwardMilestoneHallmarks(userId, metrics) {
    try {
      const results = [];

      // Check for Artist Hallmark (10,000 verified streams)
      if (metrics.totalStreams >= 10000) {
        let artistHallmark = await Hallmark.findOne({
          where: { name: 'Artist' }
        });
        if (artistHallmark) {
          const result = await this.awardHallmarkToUser(userId, artistHallmark.id, 'Achieved 10,000 verified streams');
          if (result.success) results.push(result);
        } else {
          // Create the Artist hallmark if it doesn't exist
          const newHallmark = await this.createHallmark({
            name: 'Artist',
            description: 'Awarded for achieving 10,000 verified streams',
            rarity: 'rare',
            category: 'artist',
            criteria: { type: 'stream_count', threshold: 10000 }
          });

          if (newHallmark.success) {
            const result = await this.awardHallmarkToUser(userId, newHallmark.hallmark.id, 'Achieved 10,000 verified streams');
            if (result.success) results.push(result);
          }
        }
      }

      // Check for Legacy Hallmark (5+ years active participation)
      const user = await User.findByPk(userId);
      if (user) {
        const accountAgeInYears = (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365);
        if (accountAgeInYears >= 5) {
          let legacyHallmark = await Hallmark.findOne({
            where: { name: 'Legacy' }
          });
          if (legacyHallmark) {
            const result = await this.awardHallmarkToUser(userId, legacyHallmark.id, '5+ years of active participation');
            if (result.success) results.push(result);
          } else {
            // Create the Legacy hallmark if it doesn't exist
            const newHallmark = await this.createHallmark({
              name: 'Legacy',
              description: 'Awarded for 5+ years of active participation',
              rarity: 'epic',
              category: 'legacy',
              criteria: { type: 'account_age', threshold: 5 }
            });

            if (newHallmark.success) {
              const result = await this.awardHallmarkToUser(userId, newHallmark.hallmark.id, '5+ years of active participation');
              if (result.success) results.push(result);
            }
          }
        }
      }

      return { success: true, results };
    } catch (error) {
      logger.error('Error checking and awarding milestone hallmarks:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user's hallmarks
  async getUserHallmarks(userId) {
    try {
      const userHallmarks = await UserHallmark.findAll({
        where: { userId: userId },
        include: [{
          model: Hallmark,
          as: 'hallmark'
        }],
        order: [['awardedAt', 'DESC']]
      });

      return userHallmarks.map(uh => ({
        id: uh.id,
        userId: uh.userId,
        hallmark: uh.hallmark,
        awardedAt: uh.awardedAt,
        reason: uh.reason
      }));


    } catch (error) {
      logger.error('Error fetching user hallmarks:', error);
      throw error;
    }
  }

  // Get all available hallmarks
  async getAllHallmarks(filters = {}) {
    try {
      let whereClause = {};

      // Apply filters if provided
      if (filters.category) {
        whereClause.category = filters.category;
      }

      if (filters.rarity) {
        whereClause.rarity = filters.rarity;
      }

      const hallmarks = await Hallmark.findAll({
        where: whereClause,
        order: [
          ['category', 'ASC'],
          ['rarity', 'ASC'],
          ['createdAt', 'DESC']
        ]
      });
      return hallmarks;
    } catch (error) {
      logger.error('Error fetching hallmarks:', error);
      throw error;
    }
  }
}

module.exports = new HallmarkService();
