const User = require('../models/User');
const logger = require('../utils/logger');
const cognitiveLoadDetector = require('../utils/cognitiveLoadDetector');
const platformCompatibilityService = require('../services/platformCompatibilityService');

const cognitiveLoadMiddleware = async (req, res, next) => {
  if (!req.user) {
    // If no authenticated user, skip cognitive load processing
    return next();
  }

  try {
    // Determine the platform from request
    const platform = platformCompatibilityService.determinePlatform(req);

    // Get the user's profile to access cognitive load and notification settings
    const user = await User.findById(req.user.id);
    if (!user) {
      return next();
    }

    // Collect interaction data from the request
    const interactionData = {
      refreshFrequency: req.headers['x-refresh-frequency'] ? parseFloat(req.headers['x-refresh-frequency']) : 0,
      clicksPerMinute: req.headers['x-clicks-per-minute'] ? parseFloat(req.headers['x-clicks-per-minute']) : 0,
      sessionDurationMinutes: req.headers['x-session-duration'] ? parseFloat(req.headers['x-session-duration']) : 0,
      simultaneousActivities: req.headers['x-simultaneous-activities'] ? parseFloat(req.headers['x-simultaneous-activities']) : 0,
      errorRate: req.headers['x-error-rate'] ? parseFloat(req.headers['x-error-rate']) : 0
    };

    // Calculate cognitive load based on interaction data
    const cognitiveLoad = cognitiveLoadDetector.detectCognitiveLoad(interactionData);

    // Update user's cognitive load profile
    const updatedCognitiveLoad = cognitiveLoadDetector.updateUserCognitiveLoad(user, cognitiveLoad);

    // Determine appropriate notification timing based on platform
    req.notificationTiming = platformCompatibilityService.determineNotificationTimingForPlatform(
      updatedCognitiveLoad,
      platform,
      req.body.isCriticalNotification || false
    );

    // Store cognitive load in request for use by other middleware/routes
    req.cognitiveLoad = updatedCognitiveLoad;
    req.platform = platform;

    // Check if current time is in user's quiet hours (using platform-specific settings)
    req.inQuietHours = cognitiveLoadDetector.isInQuietHours(
      user,
      new Date() // Pass the current time to check
    );

    // Save updated cognitive load to user profile
    await User.findByIdAndUpdate(req.user.id, {
      cognitiveLoad: updatedCognitiveLoad
    });

    next();
  } catch (error) {
    logger.error('Error in cognitive load middleware:', error);
    // Don't block the request if cognitive load calculation fails
    next();
  }
};

module.exports = { cognitiveLoadMiddleware };
