/**
 * Lush Match Controller
 * Handles all match-related operations for the Lush Pressies app
 */

const db = require('../config/database');
const LushChatController = require('./lushChatController');

class LushMatchController {
  /**
   * Create a match between two users
   */
  static async createMatch(userAId, userBId) {
    try {
      // Validate inputs
      if (!userAId || !userBId) {
        return { success: false, error: 'Both user IDs are required' };
      }

      // Prevent users from matching with themselves
      if (userAId === userBId) {
        return { success: false, error: 'Cannot match with yourself' };
      }

      // Check if users are already matched
      const existingMatch = await db.getMatchBetweenUsers(userAId, userBId);
      if (existingMatch) {
        return { success: false, error: 'Users are already matched' };
      }

      // Check if users have blocked each other
      const userABlockedB = await db.isUserBlocked(userAId, userBId);
      const userBBlockedA = await db.isUserBlocked(userBId, userAId);
      if (userABlockedB || userBBlockedA) {
        return { success: false, error: 'Cannot match with blocked user' };
      }

      // Create the match
      const match = await db.createMatch({
        userAId,
        userBId,
        matchedAt: new Date(),
        status: 'active',
        initiatedBy: null // Could track which user initiated the match
      });

      // Increment match counts for both users
      await db.incrementMatchCount(userAId);
      await db.incrementMatchCount(userBId);

      // Create a conversation for the matched users
      await LushChatController.createConversation(userAId, userBId);

      // Update discovery queues to remove matched users from each other's feeds
      await db.removeFromDiscoveryQueue(userAId, userBId);
      await db.removeFromDiscoveryQueue(userBId, userAId);

      // Notify both users about the new match
      this.notifyUsersOfMatch(match);

      return {
        success: true,
        match
      };
    } catch (error) {
      console.error('Error creating match:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Notify users about a new match
   */
  static notifyUsersOfMatch(match) {
    // This would typically emit a notification via WebSocket or push notification service
    // For now, we'll just log it
    console.log(`Match created between ${match.userAId} and ${match.userBId}`);
    
    // In a real implementation, you would:
    // 1. Emit to both users via WebSocket
    // 2. Send push notifications
    // 3. Update match counts in real-time
  }

  /**
   * Get user's matches
   */
  static async getUserMatches(userId, limit = 20, offset = 0) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      // Get user's matches
      const matches = await db.getUserMatches(userId, limit, offset);

      // Get details for each matched user
      const matchesWithDetails = await Promise.all(
        matches.map(async (match) => {
          // Determine the matched user ID
          const matchedUserId = match.userAId === userId ? match.userBId : match.userAId;
          const matchedUser = await db.getUser(matchedUserId);

          // Get last message if available
          let lastMessage = null;
          const conversation = await db.getConversation(userId, matchedUserId);
          if (conversation) {
            lastMessage = await db.getLastMessageInConversation(conversation.id);
          }

          // Get unread message count
          const unreadCount = conversation ? 
            await db.getUnreadMessageCount(conversation.id, userId) : 0;

          return {
            ...match,
            matchedUser: {
              id: matchedUser.id,
              username: matchedUser.username,
              avatar: matchedUser.avatar,
              firstName: matchedUser.firstName,
              lastName: matchedUser.lastName,
              isOnline: matchedUser.isOnline,
              lastActive: matchedUser.lastActive
            },
            lastMessage,
            unreadCount
          };
        })
      );

      return {
        success: true,
        matches: matchesWithDetails,
        count: matchesWithDetails.length
      };
    } catch (error) {
      console.error('Error getting user matches:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Unmatch two users
   */
  static async unmatchUsers(userId, matchedUserId) {
    try {
      if (!userId || !matchedUserId) {
        return { success: false, error: 'User ID and matched user ID are required' };
      }

      // Check if users are actually matched
      const match = await db.getMatchBetweenUsers(userId, matchedUserId);
      if (!match) {
        return { success: false, error: 'Users are not matched' };
      }

      // Verify that the requesting user is one of the matched users
      if (match.userAId !== userId && match.userBId !== userId) {
        return { success: false, error: 'Unauthorized to unmatch' };
      }

      // Update match status to unmatched
      await db.updateMatchStatus(match.id, 'unmatched');

      // Decrement match counts for both users
      await db.decrementMatchCount(userId);
      await db.decrementMatchCount(matchedUserId);

      // Optionally, block the users from matching again for a period
      // await db.temporarilyBlockUsers(userId, matchedUserId);

      // Notify both users about the unmatch
      this.notifyUsersOfUnmatch(match);

      return {
        success: true,
        matchId: match.id
      };
    } catch (error) {
      console.error('Error unmatching users:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Notify users about an unmatch
   */
  static notifyUsersOfUnmatch(match) {
    // This would typically emit a notification via WebSocket or push notification service
    console.log(`Users ${match.userAId} and ${match.userBId} have been unmatched`);
  }

  /**
   * Get match statistics for a user
   */
  static async getMatchStatistics(userId) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      // Get match stats
      const stats = await db.getMatchStatistics(userId);

      // Calculate additional metrics
      const totalSwipes = await db.getTotalSwipes(userId);
      const totalLikes = await db.getTotalLikes(userId);
      
      return {
        success: true,
        statistics: {
          ...stats,
          matchRate: totalLikes > 0 ? (stats.totalMatches / totalLikes) * 100 : 0,
          swipeEfficiency: totalSwipes > 0 ? (stats.totalMatches / totalSwipes) * 100 : 0,
          avgResponseTime: stats.avgResponseTime || 0 // in hours
        }
      };
    } catch (error) {
      console.error('Error getting match statistics:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get potential matches for a user based on preferences
   */
  static async getPotentialMatches(userId, limit = 10) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      // Get user's preferences
      const preferences = await db.getUserPreferences(userId);
      if (!preferences) {
        return { success: false, error: 'User preferences not found' };
      }

      // Get potential matches based on preferences
      const potentialMatches = await db.getPotentialMatches(userId, preferences, limit);

      // Calculate match scores for each potential match
      const matchesWithScores = await Promise.all(
        potentialMatches.map(async (potentialMatch) => {
          const matchScore = await this.calculateMatchScore(userId, potentialMatch.id);
          return {
            ...potentialMatch,
            matchScore
          };
        })
      );

      // Sort by match score (highest first)
      matchesWithScores.sort((a, b) => b.matchScore - a.matchScore);

      return {
        success: true,
        matches: matchesWithScores
      };
    } catch (error) {
      console.error('Error getting potential matches:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Calculate match score between two users
   */
  static async calculateMatchScore(userAId, userBId) {
    try {
      // Get profiles for both users
      const userA = await db.getUser(userAId);
      const userB = await db.getUser(userBId);

      if (!userA || !userB) {
        return 0;
      }

      // Calculate compatibility based on various factors
      let score = 0;
      const maxScore = 100;

      // Age compatibility (adjust score based on age difference)
      if (userA.age && userB.age) {
        const ageDiff = Math.abs(userA.age - userB.age);
        if (ageDiff <= 5) score += 20; // Strong match for similar ages
        else if (ageDiff <= 10) score += 10; // Moderate match
        else if (ageDiff <= 15) score += 5;  // Weak match
      }

      // Location compatibility
      if (userA.location && userB.location) {
        const distance = this.calculateDistance(
          userA.location.lat,
          userA.location.lng,
          userB.location.lat,
          userB.location.lng
        );
        
        if (distance < 5) score += 15; // Very close
        else if (distance < 15) score += 10; // Close
        else if (distance < 30) score += 5; // Somewhat close
      }

      // Interest compatibility
      if (userA.interests && userB.interests) {
        const commonInterests = userA.interests.filter(interest => 
          userB.interests.includes(interest)
        );
        score += Math.min(commonInterests.length * 5, 30); // Max 30 points for interests
      }

      // Values compatibility
      if (userA.values && userB.values) {
        const commonValues = userA.values.filter(value => 
          userB.values.includes(value)
        );
        score += Math.min(commonValues.length * 4, 20); // Max 20 points for values
      }

      // Lifestyle compatibility
      if (userA.lifestyle && userB.lifestyle) {
        const commonLifestyles = userA.lifestyle.filter(lifestyle => 
          userB.lifestyle.includes(lifestyle)
        );
        score += Math.min(commonLifestyles.length * 3, 15); // Max 15 points for lifestyle
      }

      // Personality compatibility
      if (userA.personality && userB.personality) {
        const commonPersonality = userA.personality.filter(personality => 
          userB.personality.includes(personality)
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
   * Report a match
   */
  static async reportMatch(userId, reportedUserId, reason) {
    try {
      if (!userId || !reportedUserId || !reason) {
        return { success: false, error: 'User IDs and reason are required' };
      }

      // Check if users are matched
      const match = await db.getMatchBetweenUsers(userId, reportedUserId);
      if (!match) {
        return { success: false, error: 'Users are not matched' };
      }

      // Create report
      const report = await db.createReport({
        reporterId: userId,
        reportedId: reportedUserId,
        type: 'match',
        reason,
        createdAt: new Date()
      });

      // Check if report threshold is reached to automatically take action
      const recentReports = await db.getRecentReports(reportedUserId, 7); // Last 7 days
      if (recentReports.length >= 3) {
        // Temporarily suspend the reported user's account
        await db.suspendUser(reportedUserId, 'Multiple reports received');
      }

      return {
        success: true,
        report
      };
    } catch (error) {
      console.error('Error reporting match:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get match recommendations
   */
  static async getMatchRecommendations(userId, limit = 10) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      // Get user's match history
      const matchHistory = await db.getUserMatches(userId);

      // Get users who have liked this user but weren't matched
      const usersWhoLiked = await db.getUsersWhoLiked(userId);

      // Combine potential matches and filter out already matched users
      const alreadyMatchedIds = matchHistory.map(match => 
        match.userAId === userId ? match.userBId : match.userAId
      );

      const recommendedMatches = usersWhoLiked.filter(user => 
        !alreadyMatchedIds.includes(user.id)
      ).slice(0, limit);

      return {
        success: true,
        recommendations: recommendedMatches
      };
    } catch (error) {
      console.error('Error getting match recommendations:', error);
      return { success: false, error: 'Internal server error' };
    }
  }
}

module.exports = LushMatchController;