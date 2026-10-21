/**
 * Universal UGC Visibility & Privacy Controller
 * FingerMobile Protocol™
 * Handles content visibility states (public, followers_only, private, unlisted) and full privacy configuration
 * Enforces member privacy control: visibility
 */

const logger = require('../utils/logger');
const ugcPrivacyService = require('../services/ugcPrivacyService');


class VisibilityController {
  constructor() {
    this.getVisibility = this.getVisibility.bind(this);
    this.updateVisibility = this.updateVisibility.bind(this);
    this.updateFullPrivacySettings = this.updateFullPrivacySettings.bind(this);
  }

  /**
   * GET /api/ugc/:contentType/:contentId/visibility
   */
  async getVisibility(req, res) {
    try {
      const contentType = req.params.contentType || req.query.contentType;
      const contentId = req.params.contentId || req.query.contentId;

      if (!contentId || !contentType) {
        return res.status(400).json({ success: false, message: 'Content type and ID are required' });
      }

      const settings = await ugcPrivacyService.getPrivacySettings(contentType, contentId);

      res.json({
        success: true,
        data: {
          contentType,
          contentId,
          ownerId: settings.owner_id,
          visibility: settings.visibility,
          allowReviews: settings.allow_reviews,
          allowComments: settings.allow_comments,
          allowSharing: settings.allow_sharing,
          allowTagging: settings.allow_tagging,
          allowSaving: settings.allow_saving,
          allowDownload: settings.allow_download,
          allowedLocations: settings.allowed_locations,
          excludedLocations: settings.excluded_locations,
          genderTarget: settings.gender_target,
          allowedGenders: settings.allowed_genders,
          ageRangeMin: settings.age_range_min,
          ageRangeMax: settings.age_range_max,
          durationType: settings.duration_type,
          expiresAt: settings.expires_at
        }
      });
    } catch (error) {
      logger.error('Error in VisibilityController.getVisibility:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve visibility settings' });
    }
  }

  /**
   * PUT /api/ugc/:contentType/:contentId/visibility
   */
  async updateVisibility(req, res) {
    try {
      const userId = req.user.id;
      const contentType = req.params.contentType || req.body.contentType;
      const contentId = req.params.contentId || req.body.contentId;
      const { visibility } = req.body;

      const validVisibilities = ['public', 'followers_only', 'private', 'unlisted'];
      if (!validVisibilities.includes(visibility)) {
        return res.status(400).json({
          success: false,
          message: `Invalid visibility option. Must be one of: ${validVisibilities.join(', ')}`
        });
      }

      const currentSettings = await ugcPrivacyService.getPrivacySettings(contentType, contentId, userId);

      // Verify user owns content or setting is not locked by another owner
      if (currentSettings.owner_id && Number(currentSettings.owner_id) !== Number(userId)) {
        return res.status(403).json({ success: false, message: 'Only content owner can modify visibility' });
      }

      const updated = await ugcPrivacyService.upsertPrivacySettings(contentType, contentId, userId, {
        ...currentSettings,
        visibility
      });

      res.json({
        success: true,
        message: `Visibility updated to '${visibility}'`,
        data: updated
      });
    } catch (error) {
      logger.error('Error in VisibilityController.updateVisibility:', error);
      res.status(500).json({ success: false, message: 'Failed to update visibility' });
    }
  }

  /**
   * PUT /api/ugc/:contentType/:contentId/privacy
   * Comprehensive settings update for content owner
   */
  async updateFullPrivacySettings(req, res) {
    try {
      const userId = req.user.id;
      const contentType = req.params.contentType || req.body.contentType;
      const contentId = req.params.contentId || req.body.contentId;
      const settings = req.body;

      const currentSettings = await ugcPrivacyService.getPrivacySettings(contentType, contentId, userId);

      if (currentSettings.owner_id && Number(currentSettings.owner_id) !== Number(userId)) {
        return res.status(403).json({ success: false, message: 'Only content owner can modify privacy settings' });
      }

      const updated = await ugcPrivacyService.upsertPrivacySettings(contentType, contentId, userId, {
        ...currentSettings,
        ...settings
      });

      res.json({
        success: true,
        message: 'Privacy settings updated successfully',
        data: updated
      });
    } catch (error) {
      logger.error('Error in VisibilityController.updateFullPrivacySettings:', error);
      res.status(500).json({ success: false, message: 'Failed to update privacy settings' });
    }
  }
}

module.exports = new VisibilityController();
