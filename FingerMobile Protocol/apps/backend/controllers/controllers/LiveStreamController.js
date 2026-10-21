/* eslint-disable no-unused-vars */
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express_validator_1 = require('express-validator');
const logger = require('../../utils/logger');
const LiveStreamModel_1 = require('../models/LiveStreamModel');
const uuid_1 = require('uuid');
class LiveStreamController {
  constructor() {
    /**
         * Create a new live stream
         */
    this.createLiveStream = async (req, res) => {
      try {
        // Validate request
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
          return;
        }
        // Check if user is authenticated
        if (!req.user) {
          res.status(401).json({ error: 'User not authenticated' });
          return;
        }
        // Create the live stream record with all required fields
        const liveStream = await LiveStreamModel_1.LiveStream.create({
          streamKey: (0, uuid_1.v4)(), streamTitle: req.body.title || 'Untitled Stream', streamDescription: req.body.description || '',
          streamOwnerId: req.user.id, streamPrivacy: req.body.privacy || 'public', streamLanguage: req.body.language || 'en', streamStatus: req.body.isScheduled ? 'scheduled' : 'created', streamCategory: req.body.category || 'General',
          streamTags: req.body.tags || [],
          streamScheduledStartTime: req.body.scheduledStartTime ? new Date(req.body.scheduledStartTime) : undefined, // Provide default values for all required fields
          streamThumbnail: req.body.thumbnail || '',
          streamModerators: [],
          streamBannedUsers: [],
          streamSlowModeInterval: 0,
          streamSubscriberDelay: 0,
          streamFollowerDelay: 0,
          streamMaxConcurrentChatters: 1000,
          streamMaxMessageLength: 300, streamWatermarkPosition: 'bottom-right',
          streamWatermarkOpacity: 0.5, streamTranscodingProfile: 'default', streamCdnProvider: 'default',
          streamSubscriptionTiers: [],
          streamSponsors: [],
          streamMerchandiseItems: [],
          streamSuperChatAmounts: [],
          streamPolls: [],
          streamQuizQuestions: [],
          streamGifts: [],
          streamRewards: [],
          streamSubscribers: [],
          streamFollowers: [],
          streamLikes: [],
          streamDislikes: [],
          streamComments: [],
          streamShares: [],
          streamReports: [],
          streamModeratorsList: [],
          streamAutoModSettings: {},
          streamTimeouts: {},
          streamBans: {},
          streamEmotesList: [],
          streamBttvEmotesList: [],
          streamFfzEmotesList: [],
          streamSevenTvEmotesList: [],
          streamCustomEmotesList: [],
          streamEmoteCooldown: 30,
          streamEmotePerMinuteLimit: 100,
          streamChatCooldown: 0,
          streamChatPerMinuteLimit: 100,
          streamFollowAgeRequirement: 0,
          streamAccountAgeRequirement: 0,
          streamViewerCount: 0,
          streamIsLive: false,
          streamIsActive: true, streamHlsUrl: '', streamRtmpUrl: '',
          streamActualStartTime: undefined,
          streamEndTime: undefined,
          streamDuration: 0,
          streamDvrDuration: 0,
          streamBitsRequiredToChat: 0, streamWatermarkImageUrl: '', streamOverlayImageUrl: '',
          streamSponsorshipEnabled: false,
          streamDonationEnabled: false,
          streamDonationGoal: 0,
          streamDonationAmountRaised: 0,
          streamMerchandiseEnabled: false,
          streamSuperChatEnabled: false,
          streamPollsEnabled: false,
          streamQuizEnabled: false,
          streamGiftsEnabled: false,
          streamRewardsEnabled: false,
          streamSubscriptionsEnabled: false,
          streamModerationEnabled: false,
          streamAutoModEnabled: false,
          streamEmotesEnabled: false,
          streamBttvEmotesEnabled: false,
          streamFfzEmotesEnabled: false,
          streamSevenTvEmotesEnabled: false,
          streamCustomEmotesEnabled: false,
          streamChatEnabled: true,
          streamChatHistoryLimit: 100,
          streamWatermarkEnabled: false,
          streamOverlayEnabled: false,
          streamDvrEnabled: false,
          streamMultiQuality: true,
          streamQualitySettings: {},
          streamTranscodingEnabled: false,
          streamCdnEnabled: false,
          streamAnalyticsEnabled: false,
          streamMonetizationEnabled: false,
          streamPinMessages: false,
          streamEmoteOnly: false,
          streamSubscriberEmotesOnly: false,
          streamSlowMode: false,
          streamSubscribersOnly: false,
          streamFollowersOnly: false,
          streamVerifiedOnly: false,
          streamPriorityEncoding: false,
          streamRecordingEnabled: true,
          streamAutoStop: false,
          streamLowLatencyMode: false,
          streamRestreamEnabled: false,
          streamClippingEnabled: true,
          streamReplayProtectionEnabled: false,
          streamEmbeddingEnabled: true,
          streamGeoblockingEnabled: false,
          streamParentalControlEnabled: false,
          streamCaptioningEnabled: false,
          streamTranslationEnabled: false,
          streamThumbnailUploadEnabled: true,
          streamBannerEnabled: false,
          streamIntroVideoEnabled: false,
          streamOutroVideoEnabled: false,
          streamMidrollAdsEnabled: false,
          streamPreRollAdEnabled: false,
          streamPostRollAdEnabled: false,
          streamAdFreeForSubscribers: false,
          streamAdFreeForDonors: false,
          streamRevenueSharingEnabled: false,
          streamAffiliateLinksEnabled: false,
          streamDiscordIntegrationEnabled: false,
          streamTwitterIntegrationEnabled: false,
          streamFacebookIntegrationEnabled: false,
          streamInstagramIntegrationEnabled: false,
          streamYouTubeIntegrationEnabled: false,
          streamTikTokIntegrationEnabled: false,
          streamLinkedInIntegrationEnabled: false,
          streamTelegramIntegrationEnabled: false,
          streamSlackIntegrationEnabled: false,
          streamWebhookEnabled: false,
          streamCreatedBy: req.user.id,
          streamUpdatedBy: req.user.id,
          streamSyncWithExternal: false,
          streamBackupEnabled: false,
          streamEncryptionEnabled: false,
          streamHashVerificationEnabled: false,
          streamComplianceCheckEnabled: false,
          streamLegalAgreementsAccepted: false,
          streamTermsOfServiceAccepted: false,
          streamPrivacyPolicyAccepted: false,
          streamCookiePolicyAccepted: false,
          streamExportDataOnDemand: false, streamExportNotificationEnabled: false
        });
        res.status(201).json({
          message: 'Live stream created successfully',
          streamKey: liveStream.streamKey, streamUrl: liveStream.streamHlsUrl || '', // Using HLS URL as the stream URL
          liveStream: {
            id: liveStream.id,
            title: liveStream.streamTitle,
            description: liveStream.streamDescription,
            streamKey: liveStream.streamKey, streamUrl: liveStream.streamHlsUrl || '',
            category: liveStream.streamCategory,
            tags: liveStream.streamTags,
            affiliatePartnerType: req.body.affiliatePartnerType || null,
            maxDuration: req.body.maxDuration || 4,
            isScheduled: !!req.body.scheduledStartTime,
            scheduledStartTime: liveStream.streamScheduledStartTime,
            followerRequirement: req.body.followerRequirement || 1000,
            isActive: liveStream.streamIsActive,
            isLive: liveStream.streamIsLive,
            viewerCount: liveStream.streamViewerCount,
            startTime: liveStream.streamActualStartTime,
            endTime: liveStream.streamEndTime, duration: liveStream.streamDuration
          }
        });
      }
      catch (error) {
        logger.error('Error creating live stream:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
    /**
         * Start a live stream
         */
    this.startLiveStream = async (req, res) => {
      try {
        // Validate request
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
          return;
        }
        // Check if user is authenticated
        if (!req.user) {
          res.status(401).json({ error: 'User not authenticated' });
          return;
        }
        const { streamId } = req.params;
        const liveStream = await LiveStreamModel_1.LiveStream.findOne({
          where: {
            id: streamId,
            streamOwnerId: req.user.id,
            streamIsActive: true
          } });
        if (!liveStream) {
          res.status(404).json({ error: 'Live stream not found' });
          return;
        }
        if (liveStream.streamIsLive) {
          res.status(409).json({ error: 'Stream is already live' });
          return;
        }
        // Update the stream to be live
        await liveStream.update({
          streamIsLive: true,
          streamIsActive: true, streamActualStartTime: new Date(), streamStatus: 'live'
        });
        res.status(200).json({
          message: 'Live stream started successfully',
          liveStream: {
            id: liveStream.id,
            title: liveStream.streamTitle,
            description: liveStream.streamDescription,
            streamKey: liveStream.streamKey, streamUrl: liveStream.streamHlsUrl || '',
            category: liveStream.streamCategory,
            tags: liveStream.streamTags,
            affiliatePartnerType: req.body.affiliatePartnerType || null,
            maxDuration: req.body.maxDuration || 4,
            isScheduled: !!(liveStream.streamScheduledStartTime),
            scheduledStartTime: liveStream.streamScheduledStartTime,
            followerRequirement: req.body.followerRequirement || 1000,
            isActive: liveStream.streamIsActive,
            isLive: liveStream.streamIsLive,
            viewerCount: liveStream.streamViewerCount,
            startTime: liveStream.streamActualStartTime,
            endTime: liveStream.streamEndTime, duration: liveStream.streamDuration
          }
        });
      }
      catch (error) {
        logger.error('Error starting live stream:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
    /**
         * End a live stream
         */
    this.endLiveStream = async (req, res) => {
      try {
        // Validate request
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
          return;
        }
        // Check if user is authenticated
        if (!req.user) {
          res.status(401).json({ error: 'User not authenticated' });
          return;
        }
        const { streamId } = req.params;
        const liveStream = await LiveStreamModel_1.LiveStream.findOne({
          where: {
            id: streamId,
            streamOwnerId: req.user.id,
            streamIsActive: true
          } });
        if (!liveStream) {
          res.status(404).json({ error: 'Live stream not found' });
          return;
        }
        if (!liveStream.streamIsLive) {
          res.status(400).json({ error: 'Stream is not currently live' });
          return;
        }
        // Calculate duration
        const endTime = new Date();
        const duration = liveStream.streamActualStartTime
          ? Math.floor((endTime.getTime() - liveStream.streamActualStartTime.getTime()) / 1000 / 60) // in minutes
          : 0;
        // Update the stream to end
        await liveStream.update({
          streamIsLive: false,
          streamIsActive: false,
          streamEndTime: endTime, streamDuration: duration, streamStatus: 'ended'
        });
        res.status(200).json({
          message: 'Live stream ended successfully',
          duration });
      }
      catch (error) {
        logger.error('Error ending live stream:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
    /**
         * Get all active live streams
         */
    this.getActiveStreams = async (req, res) => {
      try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const { category, affiliatePartnerType, } = req.query;
        let whereClause = {
          streamIsLive: true,
          streamIsActive: true, streamStatus: 'live'
        };
        if (category) {
          whereClause.streamCategory = category;
        }
        if (affiliatePartnerType) {
          // Note: Affiliate partner type isn't a direct field in the model, so this would need custom handling
        }
        const liveStreams = await LiveStreamModel_1.LiveStream.findAndCountAll({
          where: whereClause,
          limit,
          offset, order: [['streamViewerCount', 'DESC']], attributes: [
            'id', 'streamOwnerId', 'streamTitle', 'streamDescription', 'streamKey', 'streamHlsUrl', 'streamCategory', 'streamTags', 'streamDuration', 'streamIsLive', 'streamIsActive', 'streamViewerCount', 'streamActualStartTime', 'streamEndTime', 'streamScheduledStartTime', 'streamPrivacy', 'streamLanguage', 'streamStatus'
          ]
        });
        res.status(200).json({
          streams: liveStreams.rows.map(stream => ({
            id: stream.id,
            title: stream.streamTitle,
            description: stream.streamDescription,
            streamKey: stream.streamKey, streamUrl: stream.streamHlsUrl || '',
            category: stream.streamCategory,
            tags: stream.streamTags,
            viewerCount: stream.streamViewerCount,
            startTime: stream.streamActualStartTime,
            scheduledStartTime: stream.streamScheduledStartTime,
            privacy: stream.streamPrivacy,
            language: stream.streamLanguage,
            status: stream.streamStatus
          })),
          pagination: {
            total: liveStreams.count,
            totalPages: Math.ceil(liveStreams.count / limit),
            currentPage: page, limit
          }
        });
      }
      catch (error) {
        logger.error('Error fetching active streams:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
    /**
         * Get a specific live stream
         */
    this.getLiveStream = async (req, res) => {
      try {
        // Validate request
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
          return;
        }
        // Check if user is authenticated
        if (!req.user) {
          res.status(401).json({ error: 'User not authenticated' });
          return;
        }
        const { streamId } = req.params;
        const liveStream = await LiveStreamModel_1.LiveStream.findOne({
          where: {
            id: streamId,
            streamIsActive: true
          } });
        if (!liveStream) {
          res.status(404).json({ error: 'Live stream not found' });
          return;
        }
        res.status(200).json({
          liveStream: {
            id: liveStream.id,
            title: liveStream.streamTitle,
            description: liveStream.streamDescription,
            streamKey: liveStream.streamKey, streamUrl: liveStream.streamHlsUrl || '',
            category: liveStream.streamCategory,
            tags: liveStream.streamTags,
            affiliatePartnerType: req.body.affiliatePartnerType || null,
            maxDuration: req.body.maxDuration || 4,
            isScheduled: !!(liveStream.streamScheduledStartTime),
            scheduledStartTime: liveStream.streamScheduledStartTime,
            followerRequirement: req.body.followerRequirement || 1000,
            isActive: liveStream.streamIsActive,
            isLive: liveStream.streamIsLive,
            viewerCount: liveStream.streamViewerCount,
            startTime: liveStream.streamActualStartTime,
            endTime: liveStream.streamEndTime, duration: liveStream.streamDuration
          }
        });
      }
      catch (error) {
        logger.error('Error fetching live stream:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
    /**
         * Update viewer count for a live stream
         */
    this.updateViewerCount = async (req, res) => {
      try {
        // Validate request
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
          return;
        }
        // Check if user is authenticated
        if (!req.user) {
          res.status(401).json({ error: 'User not authenticated' });
          return;
        }
        const { streamId } = req.params;
        const { viewerCount } = req.body;
        const liveStream = await LiveStreamModel_1.LiveStream.findOne({
          where: {
            id: streamId,
            streamIsLive: true,
            streamIsActive: true
          } });
        if (!liveStream) {
          res.status(404).json({ error: 'Live stream not found or not active' });
          return;
        }
        await liveStream.update({
          streamViewerCount: parseInt(viewerCount) });
        res.status(200).json({
          message: 'Viewer count updated successfully',
          viewerCount: parseInt(viewerCount) });
      }
      catch (error) {
        logger.error('Error updating viewer count:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
    /**
         * Check if user can go live
         */
    this.canGoLive = async (req, res) => {
      try {
        // Check if user is authenticated
        if (!req.user) {
          res.status(401).json({ error: 'User not authenticated' });
          return;
        }
        // Check if user already has a live stream running
        const existingLiveStream = await LiveStreamModel_1.LiveStream.findOne({
          where: {
            streamOwnerId: req.user.id,
            streamIsLive: true,
            streamIsActive: true, streamStatus: 'live'
          }
        });
        if (existingLiveStream) {
          res.status(409).json({
            canGoLive: false, error: 'You already have a live stream running',
            streamId: existingLiveStream.id
          });
          return;
        }
        // Check if user meets follower requirements
        const userFollowerCount = await this.getUserFollowerCount(req.user.id);
        // For basic live streaming, default requirement is 1000 followers
        const canGoLive = userFollowerCount >= 1000;
        res.status(200).json({
          canGoLive,
          followerCount: userFollowerCount,
          requiredFollowers: 1000 });
      }
      catch (error) {
        logger.error('Error checking if user can go live:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
  }
  /**
     * Get required followers based on affiliate partner type and region
     */
  getRequiredFollowers(partnerType, region) {
    // Default requirements - can be adjusted based on region
    const baseRequirements = {
      gamer: region === 'US' ? 1000 : 500, // Gaming has lower requirement in US
      influencer: 1000,
      content_creator: 1000,
      course_creator: 10000, // Higher requirement for educators
      business: 1000,
      musician: 1000,
      podcaster: 1000,
      // Default for other types
      default: 1000 };
    return baseRequirements[partnerType] || baseRequirements.default;
  }
  /**
     * Helper to get user follower count
     * This is a placeholder - you'll need to implement this based on your user/follower model
     */
  async getUserFollowerCount(userId) {
    // Placeholder implementation
    // In a real implementation, this would query your follower/following tables
    return 1500; // Return a sample follower count for now
  }
}
exports.default = new LiveStreamController();
