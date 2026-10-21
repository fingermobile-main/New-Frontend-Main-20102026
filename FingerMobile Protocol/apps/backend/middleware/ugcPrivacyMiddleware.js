/**
 * UGC Privacy & Permissions Control Middleware
 * FingerMobile Protocol™
 * Enforces member privacy settings for Reviews, Comments, Shares, Tags, Saves, Downloads, Visibility, and Duration.
 */

const ugcPrivacyService = require('../services/ugcPrivacyService');
const logger = require('../utils/logger');

/**
 * Higher-order middleware function to verify if an action is permitted on target content
 * Usage: router.post('/:contentType/:contentId/comments', requireUGCPermission('comment'), commentsController.create)
 */
const requireUGCPermission = (action) => {
  return async (req, res, next) => {
    try {
      const contentType = req.params.contentType || req.body.contentType || req.query.contentType || 'post';
      const contentId = req.params.contentId || req.params.id || req.body.contentId || req.query.contentId;
      const requestingUserId = req.user ? req.user.id : null;

      if (!contentId) {
        return next();
      }

      const permission = await ugcPrivacyService.checkPermission(
        contentType,
        contentId,
        requestingUserId,
        action
      );

      if (!permission.allowed) {
        logger.info(`Privacy block: User ${requestingUserId || 'guest'} denied ${action} on ${contentType}:${contentId}. Reason: ${permission.reason}`);
        return res.status(403).json({
          success: false,
          code: 'PRIVACY_RESTRICTION',
          message: permission.reason,
          action: action
        });
      }

      next();
    } catch (error) {
      logger.error(`Error in requireUGCPermission(${action}):`, error);
      next(); // Proceed gracefully on unexpected middleware exception
    }
  };
};

module.exports = {
  requireUGCPermission
};
