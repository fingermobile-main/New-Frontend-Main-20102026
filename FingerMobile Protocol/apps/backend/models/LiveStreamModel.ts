import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelize } from '../database/connection'; // assuming this is your DB connection

// Define the interface for the LiveStream model
interface LiveStreamAttributes {
  id: string;
  streamKey: string;
  streamTitle: string;
  streamDescription?: string;
  streamThumbnail: string;
  streamTags: string[];
  streamCategory: string;
  streamPrivacy: 'public' | 'private' | 'unlisted';
  streamLanguage: string;
  streamScheduledStartTime?: Date;
  streamActualStartTime?: Date;
  streamEndTime?: Date;
  streamViewerCount: number;
  streamIsLive: boolean;
  streamIsActive: boolean;
  streamCreatedAt?: Date;
  streamUpdatedAt?: Date;
  streamOwnerId: string;
  streamPlaybackUrl?: string;
  streamHlsUrl?: string;
  streamRtmpUrl?: string;
  streamViewCount: number;
  streamLikeCount: number;
  streamDislikeCount: number;
  streamCommentCount: number;
  streamStatus: 'created' | 'scheduled' | 'live' | 'ended' | 'replay_available';
  streamReplayAvailable: boolean;
  streamDuration?: number;
  streamBitrate?: number;
  streamResolution?: string;
  streamEncoder?: string;
  streamRecordingEnabled: boolean;
  streamAutoStop: boolean;
  streamModerators: string[];
  streamBannedUsers: string[];
  streamSlowMode: boolean;
  streamSlowModeInterval: number;
  streamSubscribersOnly: boolean;
  streamSubscriberDelay: number;
  streamFollowersOnly: boolean;
  streamFollowerDelay: number;
  streamMaxConcurrentChatters?: number;
  streamMaxMessageLength?: number;
  streamEmoteOnly: boolean;
  streamSubscriberEmotesOnly: boolean;
  streamBitsRequiredToChat?: number;
  streamPinMessages: boolean;
  streamChatEnabled: boolean;
  streamChatHistoryLimit: number;
  streamWatermarkEnabled: boolean;
  streamWatermarkImageUrl?: string;
  streamWatermarkPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  streamWatermarkOpacity?: number;
  streamOverlayEnabled: boolean;
  streamOverlayImageUrl?: string;
  streamDvrEnabled: boolean;
  streamDvrDuration?: number;
  streamMultiQuality: boolean;
  streamQualitySettings?: Record<string, any>;
  streamTranscodingEnabled: boolean;
  streamTranscodingProfile?: string;
  streamCdnEnabled: boolean;
  streamCdnProvider?: string;
  streamAnalyticsEnabled: boolean;
  streamMonetizationEnabled: boolean;
  streamSubscriptionTiers?: string[];
  streamDonationEnabled: boolean;
  streamDonationGoal?: number;
  streamDonationAmountRaised?: number;
  streamSponsorshipEnabled: boolean;
  streamSponsors?: string[];
  streamMerchandiseEnabled: boolean;
  streamMerchandiseItems?: string[];
  streamSuperChatEnabled: boolean;
  streamSuperChatAmounts?: number[];
  streamPollsEnabled: boolean;
  streamPolls?: string[];
  streamQuizEnabled: boolean;
  streamQuizQuestions?: string[];
  streamGiftsEnabled: boolean;
  streamGifts?: string[];
  streamRewardsEnabled: boolean;
  streamRewards?: string[];
  streamSubscriptionsEnabled: boolean;
  streamSubscribers?: string[];
  streamFollowers?: string[];
  streamLikes?: string[];
  streamDislikes?: string[];
  streamComments?: string[];
  streamShares?: string[];
  streamReports?: string[];
  streamModerationEnabled: boolean;
  streamModeratorsList?: string[];
  streamAutoModEnabled: boolean;
  streamAutoModSettings?: Record<string, any>;
  streamBlockedUsers?: string[];
  streamTimeouts?: Record<string, Date>;
  streamBans?: Record<string, Date>;
  streamEmotesEnabled: boolean;
  streamEmotesList?: string[];
  streamBttvEmotesEnabled: boolean;
  streamBttvEmotesList?: string[];
  streamFfzEmotesEnabled: boolean;
  streamFfzEmotesList?: string[];
  streamSevenTvEmotesEnabled: boolean;
  streamSevenTvEmotesList?: string[];
  streamCustomEmotesEnabled: boolean;
  streamCustomEmotesList?: string[];
  streamEmoteCooldown?: number;
  streamEmotePerMinuteLimit?: number;
  streamChatCooldown?: number;
  streamChatPerMinuteLimit?: number;
  streamFollowAgeRequirement?: number;
  streamAccountAgeRequirement?: number;
  streamVerifiedOnly?: boolean;
  streamPriorityEncoding?: boolean;
  streamLowLatencyMode?: boolean;
  streamRestreamEnabled: boolean;
  streamRestreamPlatforms?: string[];
  streamClippingEnabled: boolean;
  streamClipDurationLimit?: number;
  streamClips?: string[];
  streamReplayProtectionEnabled: boolean;
  streamReplayProtectionKey?: string;
  streamEmbeddingEnabled: boolean;
  streamEmbeddingDomains?: string[];
  streamGeoblockingEnabled: boolean;
  streamGeoblockCountries?: string[];
  streamGeoblockWhitelist?: string[];
  streamParentalControlEnabled: boolean;
  streamParentalControlRating?: string;
  streamCaptioningEnabled: boolean;
  streamCaptioningLanguages?: string[];
  streamCaptioningProvider?: string;
  streamTranslationEnabled: boolean;
  streamTranslationLanguages?: string[];
  streamTranslationProvider?: string;
  streamThumbnailUploadEnabled: boolean;
  streamThumbnailUrl?: string;
  streamThumbnailUploadLimit?: number;
  streamThumbnailFormats?: string[];
  streamBannerEnabled: boolean;
  streamBannerUrl?: string;
  streamBannerUploadLimit?: number;
  streamBannerFormats?: string[];
  streamIntroVideoEnabled: boolean;
  streamIntroVideoUrl?: string;
  streamOutroVideoEnabled: boolean;
  streamOutroVideoUrl?: string;
  streamMidrollAdsEnabled: boolean;
  streamMidrollAdFrequency?: number;
  streamPreRollAdEnabled: boolean;
  streamPostRollAdEnabled: boolean;
  streamAdFreeForSubscribers: boolean;
  streamAdFreeForDonors: boolean;
  streamAdSchedule?: string[];
  streamRevenueSharingEnabled: boolean;
  streamRevenueSharingPercentage?: number;
  streamRevenueSharingRecipients?: string[];
  streamAffiliateLinksEnabled: boolean;
  streamAffiliateLinks?: string[];
  streamDiscordIntegrationEnabled: boolean;
  streamDiscordWebhookUrl?: string;
  streamTwitterIntegrationEnabled: boolean;
  streamTwitterApiKey?: string;
  streamFacebookIntegrationEnabled: boolean;
  streamFacebookPageIds?: string[];
  streamInstagramIntegrationEnabled: boolean;
  streamInstagramBusinessAccountId?: string;
  streamYouTubeIntegrationEnabled: boolean;
  streamYouTubeChannelId?: string;
  streamTikTokIntegrationEnabled: boolean;
  streamTikTokAccountId?: string;
  streamLinkedInIntegrationEnabled: boolean;
  streamLinkedInOrganizationId?: string;
  streamTelegramIntegrationEnabled: boolean;
  streamTelegramBotToken?: string;
  streamSlackIntegrationEnabled: boolean;
  streamSlackWebhookUrl?: string;
  streamWebhookEnabled: boolean;
  streamWebhookUrl?: string;
  streamWebhookEvents?: string[];
  streamThirdPartyIntegrations?: string[];
  streamMetadata?: Record<string, any>;
  streamCreatedBy: string;
  streamUpdatedBy: string;
  streamLastAccessedAt?: Date;
  streamLastActivityAt?: Date;
  streamSessionId?: string;
  streamDeviceId?: string;
  streamIpAddress?: string;
  streamUserAgent?: string;
  streamReferrer?: string;
  streamExternalId?: string;
  streamExternalProvider?: string;
  streamSyncWithExternal: boolean;
  streamExternalSyncSettings?: Record<string, any>;
  streamBackupEnabled: boolean;
  streamBackupLocations?: string[];
  streamEncryptionEnabled: boolean;
  streamEncryptionKey?: string;
  streamHashVerificationEnabled: boolean;
  streamHashAlgorithm?: string;
  streamRetentionPeriod?: number;
  streamComplianceCheckEnabled: boolean;
  streamComplianceStatus?: string;
  streamComplianceLastCheckedAt?: Date;
  streamLegalAgreementsAccepted: boolean;
  streamTermsOfServiceAccepted: boolean;
  streamPrivacyPolicyAccepted: boolean;
  streamCookiePolicyAccepted: boolean;
  streamDataProcessingAgreement?: string;
  streamExportDataOnDemand: boolean;
  streamExportFormat?: string;
  streamExportCompression?: string;
  streamExportDeliveryMethod?: string;
  streamExportNotificationEnabled: boolean;
  streamExportNotificationEmail?: string;
  streamExportNotificationWebhook?: string;
  streamExportHistory?: string[];
  streamExportSchedule?: string;
  streamExportNextRunAt?: Date;
  streamExportLastRunAt?: Date;
  streamExportLastRunStatus?: string;
  streamExportLastRunError?: string;
  streamExportLastRunDuration?: number;
  streamExportLastRunSize?: number;
  streamExportLastRunFiles?: string[];
  streamExportLastRunChecksum?: string;
  streamExportLastRunSignature?: string;
  streamExportLastRunVerification?: string;
  streamExportLastRunVerificationResult?: string;
  streamExportLastRunVerificationLog?: string;
  streamExportLastRunVerificationDate?: Date;
  streamExportLastRunVerificationBy?: string;
  streamExportLastRunVerificationStatus?: string;
  streamExportLastRunVerificationNotes?: string;
  streamExportLastRunVerificationChecksum?: string;
  streamExportLastRunVerificationSignature?: string;
  streamExportLastRunVerificationEncryption?: string;
  streamExportLastRunVerificationDecryptionKey?: string;
  streamExportLastRunVerificationAlgorithm?: string;
  streamExportLastRunVerificationSalt?: string;
  streamExportLastRunVerificationIterations?: number;
  streamExportLastRunVerificationMemory?: number;
  streamExportLastRunVerificationParallelism?: number;
  streamExportLastRunVerificationTag?: string;
  streamExportLastRunVerificationNonce?: string;
  streamExportLastRunVerificationAssociatedData?: string;
  streamExportLastRunVerificationKey?: string;
  streamExportLastRunVerificationPublicKey?: string;
  streamExportLastRunVerificationPrivateKey?: string;
  streamExportLastRunVerificationCertificate?: string;
  streamExportLastRunVerificationCa?: string;
  streamExportLastRunVerificationProtocol?: string;
  streamExportLastRunVerificationCipher?: string;
  streamExportLastRunVerificationCurve?: string;
  streamExportLastRunVerificationDigest?: string;
  streamExportLastRunVerificationPadding?: string;
  streamExportLastRunVerificationMask?: string;
  streamExportLastRunVerificationSaltLength?: number;
  streamExportLastRunVerificationIvLength?: number;
  streamExportLastRunVerificationKeyLength?: number;
  streamExportLastRunVerificationBlockSize?: number;
  streamExportLastRunVerificationAuthTagLength?: number;
  streamExportLastRunVerificationHmacLength?: number;
  streamExportLastRunVerificationHmacAlgorithm?: string;
  streamExportLastRunVerificationHmacKey?: string;
  streamExportLastRunVerificationHmacSalt?: string;
  streamExportLastRunVerificationHmacIterations?: number;
  streamExportLastRunVerificationHmacMemory?: number;
  streamExportLastRunVerificationHmacParallelism?: number;
  streamExportLastRunVerificationHmacTag?: string;
  streamExportLastRunVerificationHmacNonce?: string;
  streamExportLastRunVerificationHmacAssociatedData?: string;
  streamExportLastRunVerificationHmacKeyLength?: number;
  streamExportLastRunVerificationHmacSaltLength?: number;
  streamExportLastRunVerificationHmacBlockSize?: number;
  streamExportLastRunVerificationHmacAuthTagLength?: number;
}

interface LiveStreamCreationAttributes extends Optional<LiveStreamAttributes,
  'id' | 'streamCreatedAt' | 'streamUpdatedAt' | 'streamViewerCount' | 'streamIsLive' |
  'streamIsActive' | 'streamViewCount' | 'streamLikeCount' | 'streamDislikeCount' |
  'streamCommentCount' | 'streamReplayAvailable' | 'streamRecordingEnabled' |
  'streamAutoStop' | 'streamSlowMode' | 'streamSubscribersOnly' | 'streamFollowersOnly' |
  'streamEmoteOnly' | 'streamSubscriberEmotesOnly' | 'streamModerationEnabled' |
  'streamAutoModEnabled' | 'streamEmotesEnabled' | 'streamBttvEmotesEnabled' |
  'streamFfzEmotesEnabled' | 'streamSevenTvEmotesEnabled' | 'streamCustomEmotesEnabled' |
  'streamParentalControlEnabled' | 'streamCaptioningEnabled' | 'streamTranslationEnabled' |
  'streamThumbnailUploadEnabled' | 'streamBannerEnabled' | 'streamIntroVideoEnabled' |
  'streamOutroVideoEnabled' | 'streamMidrollAdsEnabled' | 'streamPreRollAdEnabled' |
  'streamPostRollAdEnabled' | 'streamAdFreeForSubscribers' | 'streamAdFreeForDonors' |
  'streamRevenueSharingEnabled' | 'streamAffiliateLinksEnabled' | 'streamDiscordIntegrationEnabled' |
  'streamTwitterIntegrationEnabled' | 'streamFacebookIntegrationEnabled' | 'streamInstagramIntegrationEnabled' |
  'streamYouTubeIntegrationEnabled' | 'streamTikTokIntegrationEnabled' | 'streamLinkedInIntegrationEnabled' |
  'streamTelegramIntegrationEnabled' | 'streamSlackIntegrationEnabled' | 'streamWebhookEnabled' |
  'streamSyncWithExternal' | 'streamBackupEnabled' | 'streamEncryptionEnabled' |
  'streamHashVerificationEnabled' | 'streamComplianceCheckEnabled' | 'streamLegalAgreementsAccepted' |
  'streamTermsOfServiceAccepted' | 'streamPrivacyPolicyAccepted' | 'streamCookiePolicyAccepted' |
  'streamExportDataOnDemand' > {}

class LiveStream extends Model<LiveStreamAttributes, LiveStreamCreationAttributes> implements LiveStreamAttributes {
  public id!: string;
  public streamKey!: string;
  public streamTitle!: string;
  public streamDescription!: string;
  public streamThumbnail!: string;
  public streamTags!: string[];
  public streamCategory!: string;
  public streamPrivacy!: 'public' | 'private' | 'unlisted';
  public streamLanguage!: string;
  public streamScheduledStartTime?: Date;
  public streamActualStartTime?: Date;
  public streamEndTime?: Date;
  public streamViewerCount!: number;
  public streamIsLive!: boolean;
  public streamIsActive!: boolean;
  public streamCreatedAt?: Date;
  public streamUpdatedAt?: Date;
  public streamOwnerId!: string;
  public streamPlaybackUrl?: string;
  public streamHlsUrl?: string;
  public streamRtmpUrl?: string;
  public streamViewCount!: number;
  public streamLikeCount!: number;
  public streamDislikeCount!: number;
  public streamCommentCount!: number;
  public streamStatus!: 'created' | 'scheduled' | 'live' | 'ended' | 'replay_available';
  public streamReplayAvailable!: boolean;
  public streamDuration?: number;
  public streamBitrate?: number;
  public streamResolution?: string;
  public streamEncoder?: string;
  public streamRecordingEnabled!: boolean;
  public streamAutoStop!: boolean;
  public streamModerators!: string[];
  public streamBannedUsers!: string[];
  public streamSlowMode!: boolean;
  public streamSlowModeInterval!: number;
  public streamSubscribersOnly!: boolean;
  public streamSubscriberDelay!: number;
  public streamFollowersOnly!: boolean;
  public streamFollowerDelay!: number;
  public streamMaxConcurrentChatters?: number;
  public streamMaxMessageLength?: number;
  public streamEmoteOnly!: boolean;
  public streamSubscriberEmotesOnly!: boolean;
  public streamBitsRequiredToChat?: number;
  public streamPinMessages!: boolean;
  public streamChatEnabled!: boolean;
  public streamChatHistoryLimit!: number;
  public streamWatermarkEnabled!: boolean;
  public streamWatermarkImageUrl?: string;
  public streamWatermarkPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  public streamWatermarkOpacity?: number;
  public streamOverlayEnabled!: boolean;
  public streamOverlayImageUrl?: string;
  public streamDvrEnabled!: boolean;
  public streamDvrDuration?: number;
  public streamMultiQuality!: boolean;
  public streamQualitySettings?: Record<string, any>;
  public streamTranscodingEnabled!: boolean;
  public streamTranscodingProfile?: string;
  public streamCdnEnabled!: boolean;
  public streamCdnProvider?: string;
  public streamAnalyticsEnabled!: boolean;
  public streamMonetizationEnabled!: boolean;
  public streamSubscriptionTiers?: string[];
  public streamDonationEnabled!: boolean;
  public streamDonationGoal?: number;
  public streamDonationAmountRaised?: number;
  public streamSponsorshipEnabled!: boolean;
  public streamSponsors?: string[];
  public streamMerchandiseEnabled!: boolean;
  public streamMerchandiseItems?: string[];
  public streamSuperChatEnabled!: boolean;
  public streamSuperChatAmounts?: number[];
  public streamPollsEnabled!: boolean;
  public streamPolls?: string[];
  public streamQuizEnabled!: boolean;
  public streamQuizQuestions?: string[];
  public streamGiftsEnabled!: boolean;
  public streamGifts?: string[];
  public streamRewardsEnabled!: boolean;
  public streamRewards?: string[];
  public streamSubscriptionsEnabled!: boolean;
  public streamSubscribers?: string[];
  public streamFollowers?: string[];
  public streamLikes?: string[];
  public streamDislikes?: string[];
  public streamComments?: string[];
  public streamShares?: string[];
  public streamReports?: string[];
  public streamModerationEnabled!: boolean;
  public streamModeratorsList?: string[];
  public streamAutoModEnabled!: boolean;
  public streamAutoModSettings?: Record<string, any>;
  public streamBlockedUsers?: string[];
  public streamTimeouts?: Record<string, Date>;
  public streamBans?: Record<string, Date>;
  public streamEmotesEnabled!: boolean;
  public streamEmotesList?: string[];
  public streamBttvEmotesEnabled!: boolean;
  public streamBttvEmotesList?: string[];
  public streamFfzEmotesEnabled!: boolean;
  public streamFfzEmotesList?: string[];
  public streamSevenTvEmotesEnabled!: boolean;
  public streamSevenTvEmotesList?: string[];
  public streamCustomEmotesEnabled!: boolean;
  public streamCustomEmotesList?: string[];
  public streamEmoteCooldown?: number;
  public streamEmotePerMinuteLimit?: number;
  public streamChatCooldown?: number;
  public streamChatPerMinuteLimit?: number;
  public streamFollowAgeRequirement?: number;
  public streamAccountAgeRequirement?: number;
  public streamVerifiedOnly?: boolean;
  public streamPriorityEncoding?: boolean;
  public streamLowLatencyMode?: boolean;
  public streamRestreamEnabled!: boolean;
  public streamRestreamPlatforms?: string[];
  public streamClippingEnabled!: boolean;
  public streamClipDurationLimit?: number;
  public streamClips?: string[];
  public streamReplayProtectionEnabled!: boolean;
  public streamReplayProtectionKey?: string;
  public streamEmbeddingEnabled!: boolean;
  public streamEmbeddingDomains?: string[];
  public streamGeoblockingEnabled!: boolean;
  public streamGeoblockCountries?: string[];
  public streamGeoblockWhitelist?: string[];
  public streamParentalControlEnabled!: boolean;
  public streamParentalControlRating?: string;
  public streamCaptioningEnabled!: boolean;
  public streamCaptioningLanguages?: string[];
  public streamCaptioningProvider?: string;
  public streamTranslationEnabled!: boolean;
  public streamTranslationLanguages?: string[];
  public streamTranslationProvider?: string;
  public streamThumbnailUploadEnabled!: boolean;
  public streamThumbnailUrl?: string;
  public streamThumbnailUploadLimit?: number;
  public streamThumbnailFormats?: string[];
  public streamBannerEnabled!: boolean;
  public streamBannerUrl?: string;
  public streamBannerUploadLimit?: number;
  public streamBannerFormats?: string[];
  public streamIntroVideoEnabled!: boolean;
  public streamIntroVideoUrl?: string;
  public streamOutroVideoEnabled!: boolean;
  public streamOutroVideoUrl?: string;
  public streamMidrollAdsEnabled!: boolean;
  public streamMidrollAdFrequency?: number;
  public streamPreRollAdEnabled!: boolean;
  public streamPostRollAdEnabled!: boolean;
  public streamAdFreeForSubscribers!: boolean;
  public streamAdFreeForDonors!: boolean;
  public streamAdSchedule?: string[];
  public streamRevenueSharingEnabled!: boolean;
  public streamRevenueSharingPercentage?: number;
  public streamRevenueSharingRecipients?: string[];
  public streamAffiliateLinksEnabled!: boolean;
  public streamAffiliateLinks?: string[];
  public streamDiscordIntegrationEnabled!: boolean;
  public streamDiscordWebhookUrl?: string;
  public streamTwitterIntegrationEnabled!: boolean;
  public streamTwitterApiKey?: string;
  public streamFacebookIntegrationEnabled!: boolean;
  public streamFacebookPageIds?: string[];
  public streamInstagramIntegrationEnabled!: boolean;
  public streamInstagramBusinessAccountId?: string;
  public streamYouTubeIntegrationEnabled!: boolean;
  public streamYouTubeChannelId?: string;
  public streamTikTokIntegrationEnabled!: boolean;
  public streamTikTokAccountId?: string;
  public streamLinkedInIntegrationEnabled!: boolean;
  public streamLinkedInOrganizationId?: string;
  public streamTelegramIntegrationEnabled!: boolean;
  public streamTelegramBotToken?: string;
  public streamSlackIntegrationEnabled!: boolean;
  public streamSlackWebhookUrl?: string;
  public streamWebhookEnabled!: boolean;
  public streamWebhookUrl?: string;
  public streamWebhookEvents?: string[];
  public streamThirdPartyIntegrations?: string[];
  public streamMetadata?: Record<string, any>;
  public streamCreatedBy!: string;
  public streamUpdatedBy!: string;
  public streamLastAccessedAt?: Date;
  public streamLastActivityAt?: Date;
  public streamSessionId?: string;
  public streamDeviceId?: string;
  public streamIpAddress?: string;
  public streamUserAgent?: string;
  public streamReferrer?: string;
  public streamExternalId?: string;
  public streamExternalProvider?: string;
  public streamSyncWithExternal!: boolean;
  public streamExternalSyncSettings?: Record<string, any>;
  public streamBackupEnabled!: boolean;
  public streamBackupLocations?: string[];
  public streamEncryptionEnabled!: boolean;
  public streamEncryptionKey?: string;
  public streamHashVerificationEnabled!: boolean;
  public streamHashAlgorithm?: string;
  public streamRetentionPeriod?: number;
  public streamComplianceCheckEnabled!: boolean;
  public streamComplianceStatus?: string;
  public streamComplianceLastCheckedAt?: Date;
  public streamLegalAgreementsAccepted!: boolean;
  public streamTermsOfServiceAccepted!: boolean;
  public streamPrivacyPolicyAccepted!: boolean;
  public streamCookiePolicyAccepted!: boolean;
  public streamDataProcessingAgreement?: string;
  public streamExportDataOnDemand!: boolean;
  public streamExportFormat?: string;
  public streamExportCompression?: string;
  public streamExportDeliveryMethod?: string;
  public streamExportNotificationEnabled!: boolean;
  public streamExportNotificationEmail?: string;
  public streamExportNotificationWebhook?: string;
  public streamExportHistory?: string[];
  public streamExportSchedule?: string;
  public streamExportNextRunAt?: Date;
  public streamExportLastRunAt?: Date;
  public streamExportLastRunStatus?: string;
  public streamExportLastRunError?: string;
  public streamExportLastRunDuration?: number;
  public streamExportLastRunSize?: number;
  public streamExportLastRunFiles?: string[];
  public streamExportLastRunChecksum?: string;
  public streamExportLastRunSignature?: string;
  public streamExportLastRunVerification?: string;
  public streamExportLastRunVerificationResult?: string;
  public streamExportLastRunVerificationLog?: string;
  public streamExportLastRunVerificationDate?: Date;
  public streamExportLastRunVerificationBy?: string;
  public streamExportLastRunVerificationStatus?: string;
  public streamExportLastRunVerificationNotes?: string;
  public streamExportLastRunVerificationChecksum?: string;
  public streamExportLastRunVerificationSignature?: string;
  public streamExportLastRunVerificationEncryption?: string;
  public streamExportLastRunVerificationDecryptionKey?: string;
  public streamExportLastRunVerificationAlgorithm?: string;
  public streamExportLastRunVerificationSalt?: string;
  public streamExportLastRunVerificationIterations?: number;
  public streamExportLastRunVerificationMemory?: number;
  public streamExportLastRunVerificationParallelism?: number;
  public streamExportLastRunVerificationTag?: string;
  public streamExportLastRunVerificationNonce?: string;
  public streamExportLastRunVerificationAssociatedData?: string;
  public streamExportLastRunVerificationKey?: string;
  public streamExportLastRunVerificationPublicKey?: string;
  public streamExportLastRunVerificationPrivateKey?: string;
  public streamExportLastRunVerificationCertificate?: string;
  public streamExportLastRunVerificationCa?: string;
  public streamExportLastRunVerificationProtocol?: string;
  public streamExportLastRunVerificationCipher?: string;
  public streamExportLastRunVerificationCurve?: string;
  public streamExportLastRunVerificationDigest?: string;
  public streamExportLastRunVerificationPadding?: string;
  public streamExportLastRunVerificationMask?: string;
  public streamExportLastRunVerificationSaltLength?: number;
  public streamExportLastRunVerificationIvLength?: number;
  public streamExportLastRunVerificationKeyLength?: number;
  public streamExportLastRunVerificationBlockSize?: number;
  public streamExportLastRunVerificationAuthTagLength?: number;
  public streamExportLastRunVerificationHmacLength?: number;
  public streamExportLastRunVerificationHmacAlgorithm?: string;
  public streamExportLastRunVerificationHmacKey?: string;
  public streamExportLastRunVerificationHmacSalt?: string;
  public streamExportLastRunVerificationHmacIterations?: number;
  public streamExportLastRunVerificationHmacMemory?: number;
  public streamExportLastRunVerificationHmacParallelism?: number;
  public streamExportLastRunVerificationHmacTag?: string;
  public streamExportLastRunVerificationHmacNonce?: string;
  public streamExportLastRunVerificationHmacAssociatedData?: string;
  public streamExportLastRunVerificationHmacKeyLength?: number;
  public streamExportLastRunVerificationHmacSaltLength?: number;
  public streamExportLastRunVerificationHmacBlockSize?: number;
  public streamExportLastRunVerificationHmacAuthTagLength?: number;
}

// Initialize the model with its attributes maps to Sequelize Database Schema
LiveStream.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    streamKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    streamTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    streamDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    streamThumbnail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamTags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamCategory: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamPrivacy: {
      type: DataTypes.ENUM('public', 'private', 'unlisted'),
      allowNull: false,
      defaultValue: 'public'
    },
    streamLanguage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'en'
    },
    streamScheduledStartTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    streamActualStartTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    streamEndTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    streamViewerCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    streamIsLive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamIsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    streamOwnerId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    streamPlaybackUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamHlsUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamRtmpUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamViewCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    streamLikeCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    streamDislikeCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    streamCommentCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    streamStatus: {
      type: DataTypes.ENUM('created', 'scheduled', 'live', 'ended', 'replay_available'),
      allowNull: false,
      defaultValue: 'created'
    },
    streamReplayAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamDuration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamBitrate: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamResolution: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamEncoder: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamRecordingEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    streamAutoStop: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamModerators: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamBannedUsers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamSlowMode: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamSlowModeInterval: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30
    },
    streamSubscribersOnly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamSubscriberDelay: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    streamFollowersOnly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamFollowerDelay: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    streamMaxConcurrentChatters: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamMaxMessageLength: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamEmoteOnly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamSubscriberEmotesOnly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamBitsRequiredToChat: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamPinMessages: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamChatEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    streamChatHistoryLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100
    },
    streamWatermarkEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamWatermarkImageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamWatermarkPosition: {
      type: DataTypes.ENUM('top-left', 'top-right', 'bottom-left', 'bottom-right'),
      allowNull: true
    },
    streamWatermarkOpacity: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0.5
    },
    streamOverlayEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamOverlayImageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamDvrEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamDvrDuration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamMultiQuality: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    streamQualitySettings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    streamTranscodingEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    streamTranscodingProfile: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamCdnEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamCdnProvider: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamAnalyticsEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    streamMonetizationEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamSubscriptionTiers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamDonationEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamDonationGoal: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    streamDonationAmountRaised: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    streamSponsorshipEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamSponsors: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamMerchandiseEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamMerchandiseItems: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamSuperChatEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamSuperChatAmounts: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL),
      allowNull: true,
      defaultValue: []
    },
    streamPollsEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamPolls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamQuizEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamQuizQuestions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamGiftsEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamGifts: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamRewardsEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamRewards: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamSubscriptionsEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamSubscribers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamFollowers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamLikes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamDislikes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamComments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamShares: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamReports: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamModerationEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    streamModeratorsList: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamAutoModEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    streamAutoModSettings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    streamBlockedUsers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamTimeouts: {
      type: DataTypes.JSON,
      allowNull: true
    },
    streamBans: {
      type: DataTypes.JSON,
      allowNull: true
    },
    streamEmotesEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    streamEmotesList: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamBttvEmotesEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamBttvEmotesList: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamFfzEmotesEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamFfzEmotesList: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamSevenTvEmotesEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamSevenTvEmotesList: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamCustomEmotesEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamCustomEmotesList: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamEmoteCooldown: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamEmotePerMinuteLimit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamChatCooldown: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamChatPerMinuteLimit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamFollowAgeRequirement: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamAccountAgeRequirement: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamVerifiedOnly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamPriorityEncoding: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamLowLatencyMode: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamRestreamEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamRestreamPlatforms: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamClippingEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    streamClipDurationLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 60
    },
    streamClips: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamReplayProtectionEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamReplayProtectionKey: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamEmbeddingEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    streamEmbeddingDomains: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamGeoblockingEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamGeoblockCountries: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamGeoblockWhitelist: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamParentalControlEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamParentalControlRating: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamCaptioningEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamCaptioningLanguages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamCaptioningProvider: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamTranslationEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamTranslationLanguages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamTranslationProvider: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamThumbnailUploadEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    streamThumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamThumbnailUploadLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 5
    },
    streamThumbnailFormats: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: ['jpg', 'jpeg', 'png']
    },
    streamBannerEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamBannerUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamBannerUploadLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 10
    },
    streamBannerFormats: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: ['jpg', 'jpeg', 'png']
    },
    streamIntroVideoEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamIntroVideoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamOutroVideoEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamOutroVideoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamMidrollAdsEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamMidrollAdFrequency: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 5
    },
    streamPreRollAdEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamPostRollAdEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamAdFreeForSubscribers: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamAdFreeForDonors: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamAdSchedule: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamRevenueSharingEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamRevenueSharingPercentage: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    streamRevenueSharingRecipients: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamAffiliateLinksEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamAffiliateLinks: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamDiscordIntegrationEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamDiscordWebhookUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamTwitterIntegrationEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamTwitterApiKey: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamFacebookIntegrationEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamFacebookPageIds: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamInstagramIntegrationEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamInstagramBusinessAccountId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamYouTubeIntegrationEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamYouTubeChannelId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamTikTokIntegrationEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamTikTokAccountId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamLinkedInIntegrationEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamLinkedInOrganizationId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamTelegramIntegrationEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamTelegramBotToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamSlackIntegrationEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamSlackWebhookUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamWebhookEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamWebhookUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamWebhookEvents: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamThirdPartyIntegrations: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamMetadata: {
      type: DataTypes.JSON,
      allowNull: true
    },
    streamCreatedBy: {
      type: DataTypes.STRING,
      allowNull: false
    },
    streamUpdatedBy: {
      type: DataTypes.STRING,
      allowNull: false
    },
    streamLastAccessedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    streamLastActivityAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    streamSessionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamDeviceId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamIpAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamUserAgent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamReferrer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExternalId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExternalProvider: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamSyncWithExternal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamExternalSyncSettings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    streamBackupEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamBackupLocations: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamEncryptionEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamEncryptionKey: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamHashVerificationEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamHashAlgorithm: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'SHA256'
    },
    streamRetentionPeriod: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 30
    },
    streamComplianceCheckEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamComplianceStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'pending'
    },
    streamComplianceLastCheckedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    streamLegalAgreementsAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamTermsOfServiceAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamPrivacyPolicyAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamCookiePolicyAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamDataProcessingAgreement: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportDataOnDemand: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamExportFormat: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'json'
    },
    streamExportCompression: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'gzip'
    },
    streamExportDeliveryMethod: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'download'
    },
    streamExportNotificationEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    streamExportNotificationEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportNotificationWebhook: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportHistory: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamExportSchedule: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportNextRunAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    streamExportLastRunAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    streamExportLastRunStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunError: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunDuration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamExportLastRunSize: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    streamExportLastRunFiles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    streamExportLastRunChecksum: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunSignature: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerification: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationResult: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationLog: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    streamExportLastRunVerificationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    streamExportLastRunVerificationBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationStatus: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    streamExportLastRunVerificationChecksum: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationSignature: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationEncryption: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationDecryptionKey: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationAlgorithm: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationSalt: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationIterations: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamExportLastRunVerificationMemory: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamExportLastRunVerificationParallelism: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamExportLastRunVerificationTag: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationNonce: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationAssociatedData: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationKey: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationPublicKey: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationPrivateKey: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationCertificate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationCa: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationProtocol: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationCipher: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationCurve: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationDigest: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationPadding: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationMask: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationSaltLength: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamExportLastRunVerificationIvLength: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamExportLastRunVerificationKeyLength: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamExportLastRunVerificationBlockSize: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamExportLastRunVerificationAuthTagLength: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamExportLastRunVerificationHmacLength: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamExportLastRunVerificationHmacAlgorithm: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationHmacKey: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationHmacSalt: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationHmacIterations: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamExportLastRunVerificationHmacMemory: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamExportLastRunVerificationHmacParallelism: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamExportLastRunVerificationHmacTag: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationHmacNonce: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationHmacAssociatedData: {
      type: DataTypes.STRING,
      allowNull: true
    },
    streamExportLastRunVerificationHmacKeyLength: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamExportLastRunVerificationHmacSaltLength: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamExportLastRunVerificationHmacBlockSize: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    streamExportLastRunVerificationHmacAuthTagLength: {
      type: DataTypes.INTEGER,
      allowNull: true
    }},
  {
    sequelize,
    modelName: 'LiveStream',
    tableName: 'live_streams',
    timestamps: true, // Automates streamCreatedAt and streamUpdatedAt mapping natively if desired
    createdAt: 'streamCreatedAt',
    updatedAt: 'streamUpdatedAt'
  }
);

export { LiveStream };
export type { LiveStreamAttributes, LiveStreamCreationAttributes };
