'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.LiveStream = void 0;
const sequelize_1 = require('sequelize');
const connection_1 = require('../database/connection'); // assuming this is your DB connection
// Define the model class extending Sequelize's Model
class LiveStream extends sequelize_1.Model {
}
exports.LiveStream = LiveStream;
// Initialize the model with its attributes
LiveStream.init({
  id: {
    type: sequelize_1.DataTypes.UUID,
    defaultValue: sequelize_1.DataTypes.UUIDV4,
    primaryKey: true
  },
  streamKey: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  streamTitle: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: false
  },
  streamDescription: {
    type: sequelize_1.DataTypes.TEXT,
    allowNull: true
  },
  streamThumbnail: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamTags: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamCategory: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  }, streamPrivacy: {
    type: sequelize_1.DataTypes.ENUM('public', 'private', 'unlisted'),
    allowNull: false, defaultValue: 'public'
  },
  streamLanguage: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true, defaultValue: 'en'
  },
  streamScheduledStartTime: {
    type: sequelize_1.DataTypes.DATE,
    allowNull: true
  },
  streamActualStartTime: {
    type: sequelize_1.DataTypes.DATE,
    allowNull: true
  },
  streamEndTime: {
    type: sequelize_1.DataTypes.DATE,
    allowNull: true
  },
  streamViewerCount: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  streamIsLive: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamIsActive: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  streamOwnerId: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: false
  },
  streamPlaybackUrl: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamHlsUrl: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamRtmpUrl: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamViewCount: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  streamLikeCount: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  streamDislikeCount: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  streamCommentCount: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }, streamStatus: {
    type: sequelize_1.DataTypes.ENUM('created', 'scheduled', 'live', 'ended', 'replay_available'),
    allowNull: false, defaultValue: 'created'
  },
  streamReplayAvailable: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamDuration: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamBitrate: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamResolution: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamEncoder: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamRecordingEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  streamAutoStop: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamModerators: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamBannedUsers: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamSlowMode: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamSlowModeInterval: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30, // seconds
  },
  streamSubscribersOnly: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamSubscriberDelay: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // seconds
  },
  streamFollowersOnly: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamFollowerDelay: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // seconds
  },
  streamMaxConcurrentChatters: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamMaxMessageLength: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamEmoteOnly: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamSubscriberEmotesOnly: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamBitsRequiredToChat: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamPinMessages: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamChatEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  streamChatHistoryLimit: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100
  },
  streamWatermarkEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamWatermarkImageUrl: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  }, streamWatermarkPosition: {
    type: sequelize_1.DataTypes.ENUM('top-left', 'top-right', 'bottom-left', 'bottom-right'),
    allowNull: true
  },
  streamWatermarkOpacity: {
    type: sequelize_1.DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0.5
  },
  streamOverlayEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamOverlayImageUrl: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamDvrEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamDvrDuration: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamMultiQuality: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  streamQualitySettings: {
    type: sequelize_1.DataTypes.JSON,
    allowNull: true
  },
  streamTranscodingEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  streamTranscodingProfile: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamCdnEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamCdnProvider: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamAnalyticsEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  streamMonetizationEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamSubscriptionTiers: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamDonationEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamDonationGoal: {
    type: sequelize_1.DataTypes.DECIMAL,
    allowNull: true
  },
  streamDonationAmountRaised: {
    type: sequelize_1.DataTypes.DECIMAL,
    allowNull: true,
    defaultValue: 0
  },
  streamSponsorshipEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamSponsors: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamMerchandiseEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamMerchandiseItems: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamSuperChatEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamSuperChatAmounts: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.DECIMAL),
    allowNull: true,
    defaultValue: []
  },
  streamPollsEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamPolls: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamQuizEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamQuizQuestions: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamGiftsEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamGifts: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamRewardsEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamRewards: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamSubscriptionsEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamSubscribers: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamFollowers: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamLikes: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamDislikes: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamComments: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamShares: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamReports: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamModerationEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  streamModeratorsList: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamAutoModEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  streamAutoModSettings: {
    type: sequelize_1.DataTypes.JSON,
    allowNull: true
  },
  streamBlockedUsers: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamTimeouts: {
    type: sequelize_1.DataTypes.JSON,
    allowNull: true
  },
  streamBans: {
    type: sequelize_1.DataTypes.JSON,
    allowNull: true
  },
  streamEmotesEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  streamEmotesList: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamBttvEmotesEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamBttvEmotesList: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamFfzEmotesEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamFfzEmotesList: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamSevenTvEmotesEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamSevenTvEmotesList: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamCustomEmotesEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamCustomEmotesList: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamEmoteCooldown: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamEmotePerMinuteLimit: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamChatCooldown: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamChatPerMinuteLimit: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamFollowAgeRequirement: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamAccountAgeRequirement: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamVerifiedOnly: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamPriorityEncoding: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamLowLatencyMode: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamRestreamEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamRestreamPlatforms: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamClippingEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  streamClipDurationLimit: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 60, // seconds
  },
  streamClips: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamReplayProtectionEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamReplayProtectionKey: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamEmbeddingEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  streamEmbeddingDomains: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamGeoblockingEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamGeoblockCountries: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamGeoblockWhitelist: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamParentalControlEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamParentalControlRating: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamCaptioningEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamCaptioningLanguages: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamCaptioningProvider: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamTranslationEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamTranslationLanguages: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamTranslationProvider: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamThumbnailUploadEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  streamThumbnailUrl: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamThumbnailUploadLimit: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 5, // MB
  },
  streamThumbnailFormats: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true, defaultValue: ['jpg', 'jpeg', 'png']
  },
  streamBannerEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamBannerUrl: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamBannerUploadLimit: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 10, // MB
  },
  streamBannerFormats: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true, defaultValue: ['jpg', 'jpeg', 'png']
  },
  streamIntroVideoEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamIntroVideoUrl: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamOutroVideoEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamOutroVideoUrl: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamMidrollAdsEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamMidrollAdFrequency: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 5, // minutes
  },
  streamPreRollAdEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamPostRollAdEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamAdFreeForSubscribers: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamAdFreeForDonors: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamAdSchedule: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamRevenueSharingEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamRevenueSharingPercentage: {
    type: sequelize_1.DataTypes.DECIMAL,
    allowNull: true
  },
  streamRevenueSharingRecipients: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamAffiliateLinksEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamAffiliateLinks: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamDiscordIntegrationEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamDiscordWebhookUrl: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamTwitterIntegrationEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamTwitterApiKey: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamFacebookIntegrationEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamFacebookPageIds: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamInstagramIntegrationEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamInstagramBusinessAccountId: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamYouTubeIntegrationEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamYouTubeChannelId: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamTikTokIntegrationEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamTikTokAccountId: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamLinkedInIntegrationEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamLinkedInOrganizationId: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamTelegramIntegrationEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamTelegramBotToken: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamSlackIntegrationEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamSlackWebhookUrl: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamWebhookEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamWebhookUrl: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamWebhookEvents: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamThirdPartyIntegrations: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamMetadata: {
    type: sequelize_1.DataTypes.JSON,
    allowNull: true
  },
  streamCreatedBy: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: false
  },
  streamUpdatedBy: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: false
  },
  streamLastAccessedAt: {
    type: sequelize_1.DataTypes.DATE,
    allowNull: true
  },
  streamLastActivityAt: {
    type: sequelize_1.DataTypes.DATE,
    allowNull: true
  },
  streamSessionId: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamDeviceId: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamIpAddress: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamUserAgent: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamReferrer: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExternalId: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExternalProvider: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamSyncWithExternal: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamExternalSyncSettings: {
    type: sequelize_1.DataTypes.JSON,
    allowNull: true
  },
  streamBackupEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamBackupLocations: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamEncryptionEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamEncryptionKey: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamHashVerificationEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamHashAlgorithm: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true, defaultValue: 'SHA256'
  },
  streamRetentionPeriod: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 30, // days
  },
  streamComplianceCheckEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamComplianceStatus: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true, defaultValue: 'pending'
  },
  streamComplianceLastCheckedAt: {
    type: sequelize_1.DataTypes.DATE,
    allowNull: true
  },
  streamLegalAgreementsAccepted: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamTermsOfServiceAccepted: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamPrivacyPolicyAccepted: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamCookiePolicyAccepted: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamDataProcessingAgreement: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportDataOnDemand: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamExportFormat: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true, defaultValue: 'json'
  },
  streamExportCompression: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true, defaultValue: 'gzip'
  },
  streamExportDeliveryMethod: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true, defaultValue: 'download'
  },
  streamExportNotificationEnabled: {
    type: sequelize_1.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  streamExportNotificationEmail: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportNotificationWebhook: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportHistory: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamExportSchedule: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportNextRunAt: {
    type: sequelize_1.DataTypes.DATE,
    allowNull: true
  },
  streamExportLastRunAt: {
    type: sequelize_1.DataTypes.DATE,
    allowNull: true
  },
  streamExportLastRunStatus: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunError: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunDuration: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamExportLastRunSize: {
    type: sequelize_1.DataTypes.BIGINT,
    allowNull: true
  },
  streamExportLastRunFiles: {
    type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  streamExportLastRunChecksum: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunSignature: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerification: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationResult: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationLog: {
    type: sequelize_1.DataTypes.TEXT,
    allowNull: true
  },
  streamExportLastRunVerificationDate: {
    type: sequelize_1.DataTypes.DATE,
    allowNull: true
  },
  streamExportLastRunVerificationBy: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationStatus: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationNotes: {
    type: sequelize_1.DataTypes.TEXT,
    allowNull: true
  },
  streamExportLastRunVerificationChecksum: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationSignature: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationEncryption: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationDecryptionKey: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationAlgorithm: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationSalt: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationIterations: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamExportLastRunVerificationMemory: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamExportLastRunVerificationParallelism: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamExportLastRunVerificationTag: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationNonce: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationAssociatedData: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationKey: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationPublicKey: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationPrivateKey: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationCertificate: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationCa: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationProtocol: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationCipher: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationCurve: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationDigest: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationPadding: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationMask: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationSaltLength: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamExportLastRunVerificationIvLength: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamExportLastRunVerificationKeyLength: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamExportLastRunVerificationBlockSize: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamExportLastRunVerificationAuthTagLength: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamExportLastRunVerificationHmacLength: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamExportLastRunVerificationHmacAlgorithm: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationHmacKey: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationHmacSalt: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationHmacIterations: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamExportLastRunVerificationHmacMemory: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamExportLastRunVerificationHmacParallelism: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamExportLastRunVerificationHmacTag: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationHmacNonce: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationHmacAssociatedData: {
    type: sequelize_1.DataTypes.STRING,
    allowNull: true
  },
  streamExportLastRunVerificationHmacKeyLength: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamExportLastRunVerificationHmacSaltLength: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamExportLastRunVerificationHmacBlockSize: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  streamExportLastRunVerificationHmacAuthTagLength: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: true
  },
  // Add the custom timestamps
  streamCreatedAt: {
    type: sequelize_1.DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize_1.DataTypes.NOW
  },
  streamUpdatedAt: {
    type: sequelize_1.DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize_1.DataTypes.NOW
  } }, {
  tableName: 'live_streams', sequelize: connection_1.sequelize, // passing the sequelize instance
  timestamps: false, // Disable automatic timestamps since we're defining them manually
});
