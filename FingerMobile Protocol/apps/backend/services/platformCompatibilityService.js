/* eslint-disable no-unused-vars */
const platformConfig = require('../config/platformConfig');
const cognitiveLoadDetector = require('../utils/cognitiveLoadDetector');

class PlatformCompatibilityService {
  /**
   * Determines the platform based on request headers/user agent
   * @param {Object} req - Express request object
   * @returns {String} Platform identifier
   */
  determinePlatform(req) {
    const userAgent = req.get('User-Agent') || '';
    const platformHeader = req.get('X-Platform') || '';

    // Check custom header first
    if (platformHeader) {
      if (platformHeader.toLowerCase().includes('android')) return platformConfig.PLATFORMS.MOBILE_ANDROID;
      if (platformHeader.toLowerCase().includes('ios')) return platformConfig.PLATFORMS.MOBILE_IOS;
      if (platformHeader.toLowerCase().includes('mac')) return platformConfig.PLATFORMS.DESKTOP_MAC;
      if (platformHeader.toLowerCase().includes('win')) return platformConfig.PLATFORMS.DESKTOP_WINDOWS;
      if (platformHeader.toLowerCase().includes('web')) return platformConfig.PLATFORMS.WEB;
    }

    // Check user agent
    if (userAgent.includes('Android')) return platformConfig.PLATFORMS.MOBILE_ANDROID;
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return platformConfig.PLATFORMS.MOBILE_IOS;
    if (userAgent.includes('Mac')) return platformConfig.PLATFORMS.DESKTOP_MAC;
    if (userAgent.includes('Win')) return platformConfig.PLATFORMS.DESKTOP_WINDOWS;

    // Default to web
    return platformConfig.PLATFORMS.WEB;
  }

  /**
   * Adjusts Gems calculation based on platform
   * @param {Number} baseGems - Base gems amount
   * @param {String} platform - Platform identifier
   * @returns {Number} Adjusted gems amount
   */
  adjustGemsForPlatform(baseGems, platform) {
    const adjustmentFactor = platformConfig.GEMS_CALCULATION.PROOF_OF_PLAY_ADJUSTMENT[platform];
    return baseGems * adjustmentFactor;
  }

  /**
   * Gets platform-specific cognitive load thresholds
   * @param {String} platform - Platform identifier
   * @returns {Object} Cognitive load thresholds
   */
  getCognitiveLoadThresholds(platform) {
    return platformConfig.PERFORMANCE.COGNITIVE_LOAD_THRESHOLDS[platform];
  }

  /**
   * Determines appropriate notification timing based on platform
   * @param {Number} cognitiveLoad - Current cognitive load
   * @param {String} platform - Platform identifier
   * @param {Boolean} isCritical - Whether notification is critical
   * @returns {Object} Notification timing decision
   */
  determineNotificationTimingForPlatform(cognitiveLoad, platform, isCritical = false) {
    // Get platform-specific thresholds
    const thresholds = this.getCognitiveLoadThresholds(platform);

    // Adjust cognitive load evaluation based on platform
    let adjustedLoad = cognitiveLoad;
    if (platform === platformConfig.PLATFORMS.MOBILE_ANDROID || platform === platformConfig.PLATFORMS.MOBILE_IOS) {
      // Mobile users might have different tolerance
      adjustedLoad = Math.min(100, cognitiveLoad * 1.1); // Slight increase for mobile
    }

    // Use the cognitive load detector with adjusted values
    return cognitiveLoadDetector.determineNotificationTiming(adjustedLoad, isCritical);
  }

  /**
   * Checks if a platform has a feature enabled
   * @param {String} feature - Feature name
   * @param {String} platform - Platform identifier
   * @returns {Boolean} Whether feature is enabled for the platform
   */
  isFeatureEnabled(feature, platform) {
    if (typeof platformConfig.FEATURES[feature] === 'boolean') {
      return platformConfig.FEATURES[feature];
    }

    if (typeof platformConfig.FEATURES[feature] === 'object' && platformConfig.FEATURES[feature][platform] !== undefined) {
      return platformConfig.FEATURES[feature][platform];
    }

    return false;
  }

  /**
   * Gets platform-specific anti-bot thresholds
   * @param {String} platform - Platform identifier
   * @returns {Object} Anti-bot thresholds
   */
  getAntiBotThresholds(platform) {
    return platformConfig.GEMS_CALCULATION.ANTI_BOT_THRESHOLDS[platform];
  }

  /**
   * Checks if user is within platform limits
   * @param {String} platform - Platform identifier
   * @param {Object} userActivity - User activity data
   * @param {Date} timeWindow - Time window to check (default: last hour)
   * @returns {Object} Result with success status and message
   */
  checkPlatformLimits(platform, userActivity, timeWindow = new Date(Date.now() - 60 * 60 * 1000)) {
    const thresholds = this.getAntiBotThresholds(platform);
    const recentActivity = userActivity.filter(activity => activity.timestamp > timeWindow);

    // Calculate gems earned in time window
    const recentGems = recentActivity.reduce((sum, activity) => sum + (activity.gems || 0), 0);

    if (recentGems > thresholds.maxGemsPerHour) {
      return {
        success: false,
        message: `Too many gems earned in the last hour (${recentGems}/${thresholds.maxGemsPerHour})`,
        limitType: 'gems_per_hour'
      };
    }

    // Check concurrent sessions
    if (userActivity.concurrentSessions > thresholds.maxConcurrentSessions) {
      return {
        success: false,
        message: `Too many concurrent sessions (${userActivity.concurrentSessions}/${thresholds.maxConcurrentSessions})`,
        limitType: 'concurrent_sessions'
      };
    }

    return {
      success: true,
      message: 'Within platform limits'
    };
  }

  /**
   * Gets platform-specific notification settings
   * @param {String} platform - Platform identifier
   * @returns {Object} Notification settings
   */
  getNotificationSettings(platform) {
    return platformConfig.NOTIFICATIONS.TIMING[platform];
  }

  /**
   * Gets supported notification types for a platform
   * @param {String} platform - Platform identifier
   * @returns {Array} Supported notification types
   */
  getSupportedNotificationTypes(platform) {
    return platformConfig.NOTIFICATIONS.SUPPORTED_TYPES[platform];
  }

  /**
   * Gets platform-specific performance settings
   * @param {String} platform - Platform identifier
   * @returns {Object} Performance settings
   */
  getPerformanceSettings(platform) {
    return {
      cognitiveLoadThresholds: this.getCognitiveLoadThresholds(platform),
      animationPreference: platformConfig.PERFORMANCE.ANIMATION_PREFERENCES[platform]
    };
  }
}

module.exports = new PlatformCompatibilityService();
