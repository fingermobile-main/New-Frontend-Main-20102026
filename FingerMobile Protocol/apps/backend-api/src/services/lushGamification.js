/**
 * Lush Gamification Service
 * Handles all gamification-related operations for the Lush Pressies app
 */

const db = require('../config/database');

class LushGamification {
  /**
   * Initialize user's gamification profile
   */
  static async initializeUserProfile(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Create initial gamification profile
      const initialProfile = await db.createGamificationProfile({
        userId,
        level: 1,
        currentXP: 0,
        totalXP: 0,
        streak: 0,
        longestStreak: 0,
        achievements: [],
        badges: [],
        lastActiveDate: new Date()
      });

      return {
        success: true,
        profile: initialProfile
      };
    } catch (error) {
      console.error('Error initializing user gamification profile:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Award XP to user
   */
  static async awardXP(userId, amount, reason, actionType = null) {
    try {
      if (!userId || !amount || amount <= 0) {
        throw new Error('User ID and positive XP amount are required');
      }

      // Get current user profile
      let profile = await db.getGamificationProfile(userId);
      if (!profile) {
        // Initialize profile if it doesn't exist
        const initResult = await this.initializeUserProfile(userId);
        if (!initResult.success) {
          throw new Error(initResult.error);
        }
        profile = initResult.profile;
      }

      // Calculate new values
      const newTotalXP = profile.totalXP + amount;
      const newCurrentXP = profile.currentXP + amount;

      // Check for level up
      const currentLevel = profile.level;
      let newLevel = currentLevel;
      let remainingXP = newCurrentXP;
      let levelUps = 0;

      // Calculate level ups based on XP thresholds
      while (remainingXP >= this.getXPForNextLevel(newLevel)) {
        remainingXP -= this.getXPForNextLevel(newLevel);
        newLevel++;
        levelUps++;
      }

      // Update profile
      const updatedProfile = await db.updateGamificationProfile(userId, {
        level: newLevel,
        currentXP: remainingXP,
        totalXP: newTotalXP,
        lastActiveDate: new Date()
      });

      // Trigger level up events if applicable
      if (levelUps > 0) {
        await this.handleLevelUp(userId, newLevel, levelUps);
      }

      // Log the XP award
      await db.logXPAward(userId, amount, reason, actionType);

      return {
        success: true,
        profile: updatedProfile,
        awardedXP: amount,
        levelUps,
        newLevel
      };
    } catch (error) {
      console.error('Error awarding XP:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get XP required for next level
   */
  static getXPForNextLevel(level) {
    // Simple exponential growth: each level requires 100 more XP than the previous
    // Level 1: 100 XP, Level 2: 200 XP, Level 3: 300 XP, etc.
    return 100 * level;
  }

  /**
   * Handle level up events
   */
  static async handleLevelUp(userId, newLevel, levelUps) {
    // Unlock rewards based on level
    await this.unlockLevelRewards(userId, newLevel);

    // Check for milestone achievements
    if (newLevel >= 5) {
      await this.awardAchievement(userId, 'milestone_level_5');
    }
    if (newLevel >= 10) {
      await this.awardAchievement(userId, 'milestone_level_10');
    }
    if (newLevel >= 25) {
      await this.awardAchievement(userId, 'milestone_level_25');
    }

    // Notify user of level up
    this.notifyLevelUp(userId, newLevel, levelUps);
  }

  /**
   * Unlock rewards for reaching a level
   */
  static async unlockLevelRewards(userId, level) {
    // Define level-based rewards
    const levelRewards = {
      5: { type: 'badge', reward: 'novice_explorer' },
      10: { type: 'badge', reward: 'social_butterfly' },
      15: { type: 'feature', reward: 'extra_likes' },
      20: { type: 'badge', reward: 'connection_master' },
      25: { type: 'feature', reward: 'priority_boost' },
      30: { type: 'badge', reward: 'lush_veteran' }
    };

    if (levelRewards[level]) {
      const reward = levelRewards[level];
      if (reward.type === 'badge') {
        await db.addBadgeToUser(userId, reward.reward);
      } else if (reward.type === 'feature') {
        await db.grantFeatureAccess(userId, reward.reward);
      }
    }
  }

  /**
   * Award an achievement to user
   */
  static async awardAchievement(userId, achievementId) {
    try {
      if (!userId || !achievementId) {
        throw new Error('User ID and achievement ID are required');
      }

      // Check if achievement already awarded
      const existingAchievement = await db.getUserAchievement(userId, achievementId);
      if (existingAchievement) {
        return {
          success: true,
          alreadyAwarded: true,
          achievementId
        };
      }

      // Get achievement details
      const achievement = await db.getAchievement(achievementId);
      if (!achievement) {
        throw new Error('Achievement not found');
      }

      // Award the achievement
      const awardedAchievement = await db.awardAchievement(userId, {
        achievementId,
        title: achievement.title,
        description: achievement.description,
        points: achievement.points,
        icon: achievement.icon,
        awardedAt: new Date()
      });

      // Award XP for achievement
      if (achievement.points > 0) {
        await this.awardXP(userId, achievement.points, `Achievement unlocked: ${achievement.title}`);
      }

      // Add any special rewards for the achievement
      if (achievement.rewards) {
        await this.processAchievementRewards(userId, achievement.rewards);
      }

      return {
        success: true,
        achievement: awardedAchievement,
        awardedXP: achievement.points
      };
    } catch (error) {
      console.error('Error awarding achievement:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process rewards for an achievement
   */
  static async processAchievementRewards(userId, rewards) {
    for (const reward of rewards) {
      if (reward.type === 'badge') {
        await db.addBadgeToUser(userId, reward.value);
      } else if (reward.type === 'feature') {
        await db.grantFeatureAccess(userId, reward.value);
      } else if (reward.type === 'virtual_item') {
        await db.grantVirtualItem(userId, reward.value);
      } else if (reward.type === 'discount') {
        await db.createDiscountCode(userId, reward.value);
      }
    }
  }

  /**
   * Update user's streak
   */
  static async updateStreak(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Get current streak data
      const profile = await db.getGamificationProfile(userId);
      if (!profile) {
        throw new Error('User gamification profile not found');
      }

      const today = new Date().toDateString();
      const lastActiveDate = new Date(profile.lastActiveDate).toDateString();

      let newStreak = profile.streak;

      if (today === lastActiveDate) {
        // Already active today, no change
        return {
          success: true,
          streak: profile.streak,
          unchanged: true
        };
      } else if (this.isYesterday(lastActiveDate)) {
        // Consecutive day, increment streak
        newStreak = profile.streak + 1;
      } else {
        // Broken streak, reset to 1
        newStreak = 1;
      }

      // Update longest streak if applicable
      const newLongestStreak = Math.max(newStreak, profile.longestStreak);

      // Update profile
      const updatedProfile = await db.updateGamificationProfile(userId, {
        streak: newStreak,
        longestStreak: newLongestStreak,
        lastActiveDate: new Date()
      });

      // Award streak-based achievements
      if (newStreak === 7) {
        await this.awardAchievement(userId, 'week_streak');
      }
      if (newStreak === 30) {
        await this.awardAchievement(userId, 'month_streak');
      }
      if (newStreak === 100) {
        await this.awardAchievement(userId, 'century_streak');
      }

      return {
        success: true,
        streak: newStreak,
        longestStreak: newLongestStreak,
        updated: true
      };
    } catch (error) {
      console.error('Error updating streak:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if date string represents yesterday
   */
  static isYesterday(dateString) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateString === yesterday.toDateString();
  }

  /**
   * Get user's gamification profile
   */
  static async getUserProfile(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const profile = await db.getGamificationProfile(userId);
      if (!profile) {
        // Initialize profile if it doesn't exist
        const initResult = await this.initializeUserProfile(userId);
        if (!initResult.success) {
          throw new Error(initResult.error);
        }
        return initResult.profile;
      }

      return {
        success: true,
        profile
      };
    } catch (error) {
      console.error('Error getting user gamification profile:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all available achievements
   */
  static async getAllAchievements() {
    try {
      const achievements = await db.getAllAchievements();

      return {
        success: true,
        achievements
      };
    } catch (error) {
      console.error('Error getting all achievements:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's achievements
   */
  static async getUserAchievements(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const achievements = await db.getUserAchievements(userId);

      return {
        success: true,
        achievements
      };
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get leaderboard
   */
  static async getLeaderboard(limit = 20, offset = 0, sortBy = 'level') {
    try {
      const leaderboard = await db.getLeaderboard(limit, offset, sortBy);

      return {
        success: true,
        leaderboard,
        count: leaderboard.length
      };
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process user action for gamification
   */
  static async processUserAction(userId, action, metadata = {}) {
    try {
      if (!userId || !action) {
        throw new Error('User ID and action are required');
      }

      // Define XP rewards for different actions
      const actionRewards = {
        // Profile-related actions
        'profile_completed': { xp: 100, achievement: 'profile_completer' },
        'profile_updated': { xp: 10 },
        'bio_added': { xp: 50 },

        // Matching-related actions
        'first_match': { xp: 200, achievement: 'first_match' },
        'like_given': { xp: 5 },
        'super_like_used': { xp: 15 },
        'match_made': { xp: 50 },

        // Messaging-related actions
        'first_message_sent': { xp: 100, achievement: 'first_contact' },
        'message_sent': { xp: 10 },
        'conversation_started': { xp: 75, achievement: 'conversation_starter' },
        'reply_within_24h': { xp: 25 },

        // Social-related actions
        'gift_sent': { xp: 30 },
        'gift_received': { xp: 15 },
        'social_links_added': { xp: 75 },
        'verified_account': { xp: 200, achievement: 'verified_member' },

        // Engagement-related actions
        'daily_login': { xp: 20 },
        'weekly_active': { xp: 100, achievement: 'weekly_champion' },
        'monthly_active': { xp: 300, achievement: 'loyal_member' },
        'streak_day': { xp: 10 },

        // Special events
        'event_participated': { xp: 150 },
        'referral_made': { xp: 250, achievement: 'social_spreader' }
      };

      const reward = actionRewards[action];
      if (!reward) {
        return { success: true, message: 'Action processed but no reward given' };
      }

      // Award XP
      if (reward.xp) {
        await this.awardXP(userId, reward.xp, `Action: ${action}`, action);
      }

      // Award achievement if specified
      if (reward.achievement) {
        await this.awardAchievement(userId, reward.achievement);
      }

      // Update streak for daily login
      if (action === 'daily_login') {
        await this.updateStreak(userId);
      }

      return {
        success: true,
        xpAwarded: reward.xp || 0,
        achievementAwarded: reward.achievement || null,
        action
      };
    } catch (error) {
      console.error('Error processing user action:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Notify user of level up
   */
  static notifyLevelUp(userId, newLevel, levelUps) {
    console.log(`User ${userId} leveled up to level ${newLevel} (+${levelUps} levels!)`);
    // In a real implementation, this would send a push notification
  }

  /**
   * Get user's progress toward next level
   */
  static async getUserProgress(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const profile = await db.getGamificationProfile(userId);
      if (!profile) {
        throw new Error('User gamification profile not found');
      }

      const xpForNextLevel = this.getXPForNextLevel(profile.level);
      const progressPercent = (profile.currentXP / xpForNextLevel) * 100;

      return {
        success: true,
        progress: {
          currentLevel: profile.level,
          currentXP: profile.currentXP,
          xpForNextLevel,
          progressPercent,
          remainingXP: xpForNextLevel - profile.currentXP
        }
      };
    } catch (error) {
      console.error('Error getting user progress:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's badges
   */
  static async getUserBadges(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const badges = await db.getUserBadges(userId);

      return {
        success: true,
        badges
      };
    } catch (error) {
      console.error('Error getting user badges:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get gamification statistics
   */
  static async getStats() {
    try {
      const stats = await db.getGamificationStats();

      return {
        success: true,
        stats
      };
    } catch (error) {
      console.error('Error getting gamification stats:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = LushGamification;