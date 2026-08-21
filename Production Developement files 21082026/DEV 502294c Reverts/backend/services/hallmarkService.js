const { Hallmark, UserHallmark } = require('../models/hallmark');
const User = require('../models/user');

class HallmarkService {
  // Create a new hallmark definition
  async createHallmark(hallmarkData) {
    try {
      const existingHallmark = await Hallmark.findOne({ name: hallmarkData.name });
      
      if (existingHallmark) {
        return { success: false, message: 'Hallmark with this name already exists' };
      }

      const hallmark = new Hallmark(hallmarkData);
      await hallmark.save();

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
        userId,
        hallmarkId
      });

      if (existingAward) {
        return { success: false, message: 'User already has this hallmark' };
      }

      // Create the user-hallmark relationship
      const userHallmark = new UserHallmark({
        userId,
        hallmarkId,
        reason
      });

      await userHallmark.save();

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
        const artistHallmark = await Hallmark.findOne({ name: 'Artist' });
        if (artistHallmark) {
          const result = await this.awardHallmarkToUser(userId, artistHallmark._id, 'Achieved 10,000 verified streams');
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
            const result = await this.awardHallmarkToUser(userId, newHallmark.hallmark._id, 'Achieved 10,000 verified streams');
            if (result.success) results.push(result);
          }
        }
      }

      // Check for Legacy Hallmark (5+ years active participation)
      const user = await User.findById(userId);
      if (user) {
        const accountAgeInYears = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365);
        if (accountAgeInYears >= 5) {
          const legacyHallmark = await Hallmark.findOne({ name: 'Legacy' });
          if (legacyHallmark) {
            const result = await this.awardHallmarkToUser(userId, legacyHallmark._id, '5+ years of active participation');
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
              const result = await this.awardHallmarkToUser(userId, newHallmark.hallmark._id, '5+ years of active participation');
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
      const userHallmarks = await UserHallmark.find({ userId })
        .populate('hallmarkId')
        .sort({ awardedAt: -1 });

      return userHallmarks;
    } catch (error) {
      logger.error('Error fetching user hallmarks:', error);
      throw error;
    }
  }

  // Get all available hallmarks
  async getAllHallmarks(filters = {}) {
    try {
      const hallmarks = await Hallmark.find(filters).sort({ rarity: 1, createdAt: -1 });
      return hallmarks;
    } catch (error) {
      logger.error('Error fetching hallmarks:', error);
      throw error;
    }
  }
}

module.exports = new HallmarkService();