/**
 * Lush Swipe Controller
 * Handles all swipe-related operations for the Lush Pressies app
 */

const db = require('../config/database');
const LushMatchController = require('./lushMatchController');

class LushSwipeController {
  /**
   * Process a swipe action (like or pass)
   */
  static async processSwipe(userId, targetUserId, direction) {
    try {
      // Validate inputs
      if (!userId || !targetUserId || !['like', 'pass'].includes(direction)) {
        return { success: false, error: 'Invalid input parameters' };
      }

      // Prevent users from swiping on themselves
      if (userId === targetUserId) {
        return { success: false, error: 'Cannot swipe on yourself' };
      }

      // Check if users have already swiped on each other
      const existingSwipe = await db.getSwipe(userId, targetUserId);
      if (existingSwipe) {
        return { success: false, error: 'Swipe already recorded' };
      }

      // Check if target user exists and is active
      const targetUser = await db.getUser(targetUserId);
      if (!targetUser || !targetUser.isActive) {
        return { success: false, error: 'Target user not found or inactive' };
      }

      // Check if target user is blocked by current user
      const isBlocked = await db.isUserBlocked(userId, targetUserId);
      if (isBlocked) {
        return { success: false, error: 'Cannot swipe on blocked user' };
      }

      // Check if user has exceeded daily swipe limit
      const dailySwipes = await db.getDailySwipes(userId);
      const userMembership = await db.getUserMembership(userId);
      
      let maxSwipes = 10; // Default for free users
      if (userMembership && userMembership.plan === 'premium') {
        maxSwipes = 50; // Premium users get more swipes
      } else if (userMembership && userMembership.plan === 'elite') {
        maxSwipes = Infinity; // Elite users get unlimited swipes
      }
      
      if (dailySwipes >= maxSwipes) {
        return { success: false, error: 'Daily swipe limit exceeded' };
      }

      // Record the swipe
      const swipeRecord = await db.createSwipe({
        userId,
        targetUserId,
        direction,
        timestamp: new Date()
      });

      // Check if there's a match (mutual like)
      const oppositeSwipe = await db.getSwipe(targetUserId, userId);
      let isMatch = false;
      let matchData = null;

      if (oppositeSwipe && oppositeSwipe.direction === 'like' && direction === 'like') {
        // It's a match! Create match record
        isMatch = true;
        matchData = await LushMatchController.createMatch(userId, targetUserId);
        
        // Update match counts for both users
        await db.incrementMatchCount(userId);
        await db.incrementMatchCount(targetUserId);
      }

      // Update daily swipe count
      await db.incrementDailySwipes(userId);

      // Update user's discovery queue to remove the swiped profile
      await db.removeFromDiscoveryQueue(userId, targetUserId);

      return {
        success: true,
        swipeId: swipeRecord.id,
        isMatch,
        match: isMatch ? matchData : null
      };
    } catch (error) {
      console.error('Error processing swipe:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get a user's discovery queue
   */
  static async getDiscoveryQueue(userId, limit = 10, offset = 0) {
    try {
      // Get user's preferences
      const preferences = await db.getUserPreferences(userId);
      if (!preferences) {
        return { success: false, error: 'User preferences not found' };
      }

      // Get users that match preferences
      const candidates = await db.getMatchingUsers(
        userId,
        preferences,
        limit,
        offset
      );

      // Filter out users that current user has already swiped on
      const filteredCandidates = [];
      for (const candidate of candidates) {
        const existingSwipe = await db.getSwipe(userId, candidate.id);
        if (!existingSwipe) {
          // Add match score for the candidate
          const matchScore = await this.calculateMatchScore(userId, candidate.id);
          filteredCandidates.push({
            ...candidate,
            matchScore
          });
        }
      }

      return {
        success: true,
        profiles: filteredCandidates,
        count: filteredCandidates.length
      };
    } catch (error) {
      console.error('Error getting discovery queue:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Calculate match score between two users
   */
  static async calculateMatchScore(userId, targetUserId) {
    try {
      // Get profiles for both users
      const user1 = await db.getUser(userId);
      const user2 = await db.getUser(targetUserId);

      if (!user1 || !user2) {
        return 0;
      }

      // Calculate compatibility based on various factors
      let score = 0;
      const maxScore = 100;

      // Age compatibility (adjust score based on age difference)
      if (user1.age && user2.age) {
        const ageDiff = Math.abs(user1.age - user2.age);
        if (ageDiff <= 5) score += 20; // Strong match for similar ages
        else if (ageDiff <= 10) score += 10; // Moderate match
        else if (ageDiff <= 15) score += 5;  // Weak match
      }

      // Location compatibility
      if (user1.location && user2.location) {
        const distance = this.calculateDistance(
          user1.location.lat,
          user1.location.lng,
          user2.location.lat,
          user2.location.lng
        );
        
        if (distance < 5) score += 15; // Very close
        else if (distance < 15) score += 10; // Close
        else if (distance < 30) score += 5; // Somewhat close
      }

      // Interest compatibility
      if (user1.interests && user2.interests) {
        const commonInterests = user1.interests.filter(interest => 
          user2.interests.includes(interest)
        );
        score += Math.min(commonInterests.length * 5, 30); // Max 30 points for interests
      }

      // Values compatibility
      if (user1.values && user2.values) {
        const commonValues = user1.values.filter(value => 
          user2.values.includes(value)
        );
        score += Math.min(commonValues.length * 4, 20); // Max 20 points for values
      }

      // Lifestyle compatibility
      if (user1.lifestyle && user2.lifestyle) {
        const commonLifestyles = user1.lifestyle.filter(lifestyle => 
          user2.lifestyle.includes(lifestyle)
        );
        score += Math.min(commonLifestyles.length * 3, 15); // Max 15 points for lifestyle
      }

      // Personality compatibility
      if (user1.personality && user2.personality) {
        const commonPersonality = user1.personality.filter(personality => 
          user2.personality.includes(personality)
        );
        score += Math.min(commonPersonality.length * 2, 10); // Max 10 points for personality
      }

      // Ensure score doesn't exceed max
      return Math.min(score, maxScore);
    } catch (error) {
      console.error('Error calculating match score:', error);
      return 50; // Default score if calculation fails
    }
  }

  /**
   * Calculate distance between two coordinates
   */
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  }

  /**
   * Get user's swipe statistics
   */
  static async getUserSwipeStats(userId) {
    try {
      const stats = await db.getUserSwipeStats(userId);
      return {
        success: true,
        stats: {
          totalSwipes: stats.totalSwipes || 0,
          likes: stats.likes || 0,
          passes: stats.passes || 0,
          matchRate: stats.totalSwipes > 0 ? (stats.likes / stats.totalSwipes) * 100 : 0,
          dailySwipes: stats.dailySwipes || 0,
          dailyLimit: await this.getDailySwipeLimit(userId)
        }
      };
    } catch (error) {
      console.error('Error getting swipe stats:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get daily swipe limit for a user based on membership
   */
  static async getDailySwipeLimit(userId) {
    const userMembership = await db.getUserMembership(userId);
    
    if (userMembership && userMembership.plan === 'premium') {
      return 50; // Premium users get more swipes
    } else if (userMembership && userMembership.plan === 'elite') {
      return Infinity; // Elite users get unlimited swipes
    }
    
    return 10; // Default for free users
  }

  /**
   * Rewind last swipe (undo)
   */
  static async rewindSwipe(userId) {
    try {
      // Check if user has rewind feature available
      const hasRewind = await db.hasRewindFeature(userId);
      if (!hasRewind) {
        return { success: false, error: 'Rewind feature not available' };
      }

      // Get user's last swipe
      const lastSwipe = await db.getLastSwipe(userId);
      if (!lastSwipe) {
        return { success: false, error: 'No previous swipe found' };
      }

      // Check if it's recent enough to be rewound
      const timeDiff = Date.now() - new Date(lastSwipe.timestamp).getTime();
      const maxRewindTime = 10 * 60 * 1000; // 10 minutes in milliseconds
      if (timeDiff > maxRewindTime) {
        return { success: false, error: 'Too late to rewind swipe' };
      }

      // Remove the swipe record
      await db.deleteSwipe(lastSwipe.id);

      // If it was a match, remove the match as well
      if (lastSwipe.isMatch) {
        await db.deleteMatch(lastSwipe.matchId);
      }

      // Charge for rewind if needed
      if (await db.requiresPaymentForRewind(userId)) {
        await db.chargeForRewind(userId);
      }

      // Add target user back to discovery queue
      await db.addToDiscoveryQueue(userId, lastSwipe.targetUserId);

      return {
        success: true,
        rewoundSwipe: lastSwipe
      };
    } catch (error) {
      console.error('Error rewinding swipe:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Perform a super like
   */
  static async performSuperLike(userId, targetUserId) {
    try {
      // Validate inputs
      if (!userId || !targetUserId) {
        return { success: false, error: 'Invalid input parameters' };
      }

      // Check if user has super like feature available
      const hasSuperLike = await db.hasSuperLikeFeature(userId);
      if (!hasSuperLike) {
        return { success: false, error: 'Super like feature not available' };
      }

      // Check if target user exists and is active
      const targetUser = await db.getUser(targetUserId);
      if (!targetUser || !targetUser.isActive) {
        return { success: false, error: 'Target user not found or inactive' };
      }

      // Check if user has already super liked this person
      const existingSuperLike = await db.getSuperLike(userId, targetUserId);
      if (existingSuperLike) {
        return { success: false, error: 'Already super liked this user' };
      }

      // Check if user has already liked this person normally
      const existingLike = await db.getSwipe(userId, targetUserId);
      if (existingLike && existingLike.direction === 'like') {
        // Update the existing like to a super like
        await db.updateSwipeToSuperLike(existingLike.id);
      } else {
        // Create a new super like swipe record
        await db.createSwipe({
          userId,
          targetUserId,
          direction: 'super_like',
          timestamp: new Date()
        });
      }

      // Create super like record
      const superLikeRecord = await db.createSuperLike({
        userId,
        targetUserId,
        timestamp: new Date()
      });

      // Check if target user has also super liked current user (mutual super like)
      const mutualSuperLike = await db.getSuperLike(targetUserId, userId);
      let isMutualSuperLike = false;
      let matchData = null;

      if (mutualSuperLike) {
        isMutualSuperLike = true;
        // Create match since it's a mutual super like
        matchData = await LushMatchController.createMatch(userId, targetUserId);
      }

      // Update user's discovery queue to remove the super liked profile
      await db.removeFromDiscoveryQueue(userId, targetUserId);

      return {
        success: true,
        superLikeId: superLikeRecord.id,
        isMutualSuperLike,
        match: isMutualSuperLike ? matchData : null
      };
    } catch (error) {
      console.error('Error performing super like:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get who liked a user recently
   */
  static async getRecentLikes(userId, limit = 10) {
    try {
      const recentLikes = await db.getRecentLikes(userId, limit);
      return {
        success: true,
        likes: recentLikes
      };
    } catch (error) {
      console.error('Error getting recent likes:', error);
      return { success: false, error: 'Internal server error' };
    }
  }
}

module.exports = LushSwipeController;