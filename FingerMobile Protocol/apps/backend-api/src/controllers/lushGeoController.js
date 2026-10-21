/**
 * Lush Geo Controller
 * Handles all geolocation-related operations for the Lush Pressies app
 */

const db = require('../config/database');

class LushGeoController {
  /**
   * Update user's location
   */
  static async updateUserLocation(userId, location, accuracy = 10) {
    try {
      // Validate inputs
      if (!userId || !location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
        return { success: false, error: 'User ID and valid location coordinates are required' };
      }

      // Validate coordinate bounds
      if (location.latitude < -90 || location.latitude > 90 || location.longitude < -180 || location.longitude > 180) {
        return { success: false, error: 'Invalid coordinates' };
      }

      // Update user's location in the database
      const updatedLocation = await db.updateUserLocation(userId, {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: accuracy,
        updatedAt: new Date()
      });

      // Update user's last active time
      await db.updateUserLastActive(userId);

      return {
        success: true,
        location: updatedLocation
      };
    } catch (error) {
      console.error('Error updating user location:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get user's current location
   */
  static async getUserLocation(userId) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      const location = await db.getUserLocation(userId);

      if (!location) {
        return { success: false, error: 'Location not found for user' };
      }

      // Check if location is too old (older than 24 hours)
      const now = new Date();
      const locationTime = new Date(location.updatedAt);
      const timeDiff = now - locationTime;
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        return { success: false, error: 'Location data is outdated' };
      }

      return {
        success: true,
        location
      };
    } catch (error) {
      console.error('Error getting user location:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get nearby users
   */
  static async getNearbyUsers(userId, maxDistance = 50, limit = 20) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      // Get current user's location
      const userLocation = await db.getUserLocation(userId);
      if (!userLocation) {
        return { success: false, error: 'User location not available' };
      }

      // Get nearby users based on location and distance
      const nearbyUsers = await db.getNearbyUsers(
        userId,
        userLocation.latitude,
        userLocation.longitude,
        maxDistance,
        limit
      );

      // Get user details for each nearby user
      const usersWithDetails = await Promise.all(
        nearbyUsers.map(async (user) => {
          const userDetails = await db.getUser(user.id);
          return {
            ...user,
            user: {
              id: userDetails.id,
              username: userDetails.username,
              firstName: userDetails.firstName,
              lastName: userDetails.lastName,
              avatar: userDetails.avatar,
              isOnline: userDetails.isOnline,
              lastActive: userDetails.lastActive
            }
          };
        })
      );

      return {
        success: true,
        users: usersWithDetails,
        count: usersWithDetails.length,
        maxDistance
      };
    } catch (error) {
      console.error('Error getting nearby users:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get users within a specific area
   */
  static async getUsersInArea(northEast, southWest, limit = 50) {
    try {
      // Validate input bounds
      if (!northEast || !southWest || 
          typeof northEast.latitude !== 'number' || typeof northEast.longitude !== 'number' ||
          typeof southWest.latitude !== 'number' || typeof southWest.longitude !== 'number') {
        return { success: false, error: 'Valid bounding box coordinates are required' };
      }

      // Get users within the specified area
      const users = await db.getUsersInArea(northEast, southWest, limit);

      // Get user details for each user
      const usersWithDetails = await Promise.all(
        users.map(async (user) => {
          const userDetails = await db.getUser(user.id);
          return {
            ...user,
            user: {
              id: userDetails.id,
              username: userDetails.username,
              firstName: userDetails.firstName,
              lastName: userDetails.lastName,
              avatar: userDetails.avatar,
              isOnline: userDetails.isOnline,
              lastActive: userDetails.lastActive
            }
          };
        })
      );

      return {
        success: true,
        users: usersWithDetails,
        count: usersWithDetails.length
      };
    } catch (error) {
      console.error('Error getting users in area:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Update user's geo preferences
   */
  static async updateUserGeoPreferences(userId, preferences) {
    try {
      if (!userId || !preferences) {
        return { success: false, error: 'User ID and preferences are required' };
      }

      // Validate preferences
      if (preferences.maxDistance && (typeof preferences.maxDistance !== 'number' || preferences.maxDistance <= 0)) {
        return { success: false, error: 'Max distance must be a positive number' };
      }

      if (preferences.locationSharing && !['everyone', 'matches', 'connections', 'none'].includes(preferences.locationSharing)) {
        return { success: false, error: 'Invalid location sharing option' };
      }

      // Update user's geo preferences
      const updatedPreferences = await db.updateUserGeoPreferences(userId, preferences);

      return {
        success: true,
        preferences: updatedPreferences
      };
    } catch (error) {
      console.error('Error updating user geo preferences:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get user's geo preferences
   */
  static async getUserGeoPreferences(userId) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      const preferences = await db.getUserGeoPreferences(userId);

      return {
        success: true,
        preferences
      };
    } catch (error) {
      console.error('Error getting user geo preferences:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get location-based recommendations
   */
  static async getLocationBasedRecommendations(userId, location, maxDistance = 25, limit = 10) {
    try {
      if (!userId || !location) {
        return { success: false, error: 'User ID and location are required' };
      }

      // Get users near the specified location
      const recommendedUsers = await db.getNearbyUsers(
        userId,
        location.latitude,
        location.longitude,
        maxDistance,
        limit
      );

      // Get user details for each recommended user
      const usersWithDetails = await Promise.all(
        recommendedUsers.map(async (user) => {
          const userDetails = await db.getUser(user.id);
          // Calculate match score for each user
          const matchScore = await this.calculateMatchScore(userId, user.id);
          return {
            ...user,
            user: {
              id: userDetails.id,
              username: userDetails.username,
              firstName: userDetails.firstName,
              lastName: userDetails.lastName,
              avatar: userDetails.avatar,
              isOnline: userDetails.isOnline,
              lastActive: userDetails.lastActive
            },
            matchScore
          };
        })
      );

      // Sort by match score descending
      usersWithDetails.sort((a, b) => b.matchScore - a.matchScore);

      return {
        success: true,
        recommendations: usersWithDetails,
        count: usersWithDetails.length,
        maxDistance
      };
    } catch (error) {
      console.error('Error getting location-based recommendations:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Calculate match score between two users
   */
  static async calculateMatchScore(userAId, userBId) {
    try {
      // This would typically involve a complex algorithm considering multiple factors
      // For this implementation, we'll use a simple proximity-based score
      const userALocation = await db.getUserLocation(userAId);
      const userBLocation = await db.getUserLocation(userBId);

      if (!userALocation || !userBLocation) {
        return 50; // Default score if location is unavailable
      }

      // Calculate distance between users
      const distance = this.calculateDistance(
        userALocation.latitude,
        userALocation.longitude,
        userBLocation.latitude,
        userBLocation.longitude
      );

      // Calculate proximity score (closer = higher score)
      // Max score for distance under 5km, decreasing as distance increases
      if (distance < 5) return 90;
      if (distance < 10) return 80;
      if (distance < 20) return 70;
      if (distance < 30) return 60;
      if (distance < 50) return 50;
      if (distance < 100) return 30;
      return 10;
    } catch (error) {
      console.error('Error calculating match score:', error);
      return 50; // Default score
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
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
   * Get location statistics
   */
  static async getLocationStats(userId) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      // Get user's location history
      const locationHistory = await db.getUserLocationHistory(userId);

      // Calculate location statistics
      const stats = {
        totalLocations: locationHistory.length,
        lastUpdated: locationHistory.length > 0 ? locationHistory[0].updatedAt : null,
        accuracyAverage: locationHistory.length > 0 
          ? locationHistory.reduce((sum, loc) => sum + loc.accuracy, 0) / locationHistory.length 
          : null
      };

      return {
        success: true,
        stats
      };
    } catch (error) {
      console.error('Error getting location stats:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get users by country
   */
  static async getUsersByCountry(countryCode, limit = 50) {
    try {
      if (!countryCode) {
        return { success: false, error: 'Country code is required' };
      }

      // Get users from specific country
      const users = await db.getUsersByCountry(countryCode, limit);

      // Get user details for each user
      const usersWithDetails = await Promise.all(
        users.map(async (user) => {
          const userDetails = await db.getUser(user.id);
          return {
            ...user,
            user: {
              id: userDetails.id,
              username: userDetails.username,
              firstName: userDetails.firstName,
              lastName: userDetails.lastName,
              avatar: userDetails.avatar,
              isOnline: userDetails.isOnline,
              lastActive: userDetails.lastActive
            }
          };
        })
      );

      return {
        success: true,
        users: usersWithDetails,
        count: usersWithDetails.length,
        countryCode
      };
    } catch (error) {
      console.error('Error getting users by country:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get trending locations
   */
  static async getTrendingLocations(timeframe = 'daily', limit = 10) {
    try {
      // Validate timeframe
      const validTimeframes = ['hourly', 'daily', 'weekly', 'monthly'];
      if (!validTimeframes.includes(timeframe)) {
        return { success: false, error: 'Invalid timeframe' };
      }

      // Get trending locations based on activity
      const locations = await db.getTrendingLocations(timeframe, limit);

      return {
        success: true,
        locations,
        timeframe,
        limit
      };
    } catch (error) {
      console.error('Error getting trending locations:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get location-based events
   */
  static async getLocationBasedEvents(userId, location, radius = 25, limit = 10) {
    try {
      if (!userId || !location) {
        return { success: false, error: 'User ID and location are required' };
      }

      // Get events near the specified location
      const events = await db.getEventsNearLocation(location.latitude, location.longitude, radius, limit);

      return {
        success: true,
        events,
        count: events.length,
        radius
      };
    } catch (error) {
      console.error('Error getting location-based events:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Hide user from specific location discovery
   */
  static async hideFromLocationDiscovery(userId, hide = true) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      // Update user's visibility in location discovery
      const updatedUser = await db.updateUserLocationDiscoveryVisibility(userId, hide);

      return {
        success: true,
        user: updatedUser,
        hidden: hide
      };
    } catch (error) {
      console.error('Error updating location discovery visibility:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get users with similar location patterns
   */
  static async getUsersWithSimilarLocationPatterns(userId, limit = 10) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' }; }
      // Get users with similar location patterns (e.g., frequently in the same areas)
      const similarUsers = await db.getUsersWithSimilarLocationPatterns(userId, limit);

      // Get user details for each similar user
      const usersWithDetails = await Promise.all(
        similarUsers.map(async (user) => {
          const userDetails = await db.getUser(user.id);
          return {
            ...user,
            user: {
              id: userDetails.id,
              username: userDetails.username,
              firstName: userDetails.firstName,
              lastName: userDetails.lastName,
              avatar: userDetails.avatar,
              isOnline: userDetails.isOnline,
              lastActive: userDetails.lastActive
            }
          };
        })
      );

      return {
        success: true,
        users: usersWithDetails,
        count: usersWithDetails.length
      };
    } catch (error) {
      console.error('Error getting users with similar location patterns:', error);
      return { success: false, error: 'Internal server error' };
    }
  }
}

module.exports = LushGeoController;