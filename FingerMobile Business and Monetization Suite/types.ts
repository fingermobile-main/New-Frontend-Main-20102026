// Import base types from shared module for internal use
import type {
  User as UserType,
  SeshatPage as SeshatPageType,
  MonetizationMetrics as MetricsType,
  PlatformConfig as ConfigType,
} from './shared/types.js'

// Re-export shared types so they can be imported from this file
// Only keeping exports that aren't duplicated elsewhere in this file
export type {
  EstimateRequest,
  EstimateResponse,
} from './shared/types.js'

// User type is defined directly in this file rather than imported from shared
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'user' | 'moderator' | 'finance_admin' | 'business_admin' | 'super_admin';
  age: number;
  countryCode: string;
  accountAgeDays: number;
  createdAt: string;
}

// SeshatPage type is defined directly in this file rather than imported from shared
export interface SeshatPage {
  id: string;
  ownerUserId: string;
  name: string;
  description?: string;
  followersCount: number;
  visibility: 'public' | 'private' | 'unlisted';
  freeUntil: string;
  billingPlan: 'free_trial' | 'basic' | 'premium' | 'enterprise';
  verifiedBusiness: boolean;
  createdAt: string;
}

// PlatformConfig type is defined directly in this file rather than imported from shared
export interface PlatformConfig {
  id: string;
  minimumAge: number;
  minimumPayoutThreshold: number;
  seshatMonthlyFee: number;
  seshatYearlyFee: number;
  revenueSharePercentage: number;
  giftsCashValue: number;
  supportedCountries: string[];
  policyVersion: string;
  affiliateBonusPercentage: number;
}

export type UserRole =
  | 'member'
  | 'creator'
  | 'moderator'
  | 'finance_admin'
  | 'business_admin'
  | 'super_admin'

export type ProductKey =
  | 'in_stream_ads'
  | 'gifts'
  | 'subscriptions'
  | 'reels_ads'
  | 'affiliate'

export type EligibilityStatus = 'eligible' | 'warning' | 'blocked' | 'pending'

export interface EligibilityResult {
  product: ProductKey
  status: EligibilityStatus
  passedRules: string[]
  failedRules: string[]
  nextActions: string[]
}

export interface PayoutAccount {
  id: string
  userId: string
  bankName: string
  accountLast4: string
  currency: string
  verified: boolean
  createdAt: string
}

export interface ProgramDefinition {
  key: ProductKey
  title: string
  summary: string
  requirements: string[]
}

export interface OverviewResponse {
  user: UserType
  seshatPage: SeshatPageType
  metrics: MetricsType
  config: ConfigType
  eligibility: {
    universalStatus: EligibilityStatus
    products: EligibilityResult[]
  }
  revenue: {
    availableBalance: number
    pendingPayouts: number
    monthRevenue: number
    thresholdRemaining: number
    thisWeekEarnings?: number
    thisMonthEarnings?: number
    allTimeEarnings?: number
    adsRevenue?: number
    giftsRevenue?: number
    subscriptionRevenue?: number
    payoutAccount?: PayoutAccount
  }
  alerts: string[]
  programs?: ProgramDefinition[]
  verification?: {
    legalName: string
    registrationNumber: string
    countryCode: string
  }
}

// Legacy Types (from original implementation)
export type ApplicationStatus = 'submitted' | 'approved' | 'rejected' | 'pending_review'

export interface MonetizationApplication {
  id: string
  seshatPageId: string
  productKey: ProductKey
  status: ApplicationStatus
  submittedAt: string
  decisionNotes?: string
}

// ============================================================
// NEW MODELS - Week 1 Day 1 Implementation
// ============================================================

// Access Key Types
export type AccessKeyType = 'FOLLOWERSHIP' | 'MEMBERSHIP'

export interface AccessKey {
  id: string
  seshatPageId: string
  keyToken: string // 16-character alphanumeric
  keyType: AccessKeyType
  expiresAt: string
  isActive: boolean
  createdAt: string
}

// Coupon Management
export interface Coupon {
  id: string
  seshatPageId: string
  couponCode: string
  description?: string
  discountPercentage?: number
  discountAmount?: number
  minPurchaseAmount: number
  maxUses: number
  currentUses: number
  isRedeemed: boolean
  redeemedByUserId?: string
  validFrom: string
  validUntil?: string
  createdAt: string
}

// KYC Verification
export type KYCStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW'

export interface KYCRecord {
  id: string
  userId: string
  fullLegalName: string
  dateOfBirth?: string
  isAbove22Years: boolean
  nationality?: string
  idDocumentType?: string
  idDocumentNumber?: string
  biometricFaceHash: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  stateProvince?: string
  postalCode?: string
  countryCode?: string
  status: KYCStatus
  reviewedBy: string[]
  reviewNotes?: string
  submittedAt: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

// KYB Verification
export type KYBStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW'

export interface KYBRecord {
  id: string
  userId: string
  businessLegalName: string
  businessRegistrationNumber: string
  businessType: string
  taxId?: string
  incorporationDate?: string
  registeredAddress?: string
  businessEmail?: string
  businessPhone?: string
  websiteUrl?: string
  industryCategory?: string
  annualRevenueRange?: string
  employeeCountRange?: string
  documentsJson?: string
  status: KYBStatus
  reviewedBy: string[]
  reviewNotes?: string
  submittedAt: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

// Content Posts
export type PostType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'REEL' | 'STORY' | 'LIVE'
export type PostVisibility = 'PUBLIC' | 'PRIVATE' | 'FOLLOWERS_ONLY' | 'MEMBERS_ONLY'
export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED'

export interface ContentPost {
  id: string
  seshatPageId: string
  authorId: string
  title?: string
  body?: string
  mediaUrls: string[]
  postType: PostType
  visibility: PostVisibility
  status: PostStatus
  scheduledFor?: string
  publishedAt?: string
  hashtags: string[]
  locationMetadata?: Record<string, unknown>
  engagementStats: {
    likes: number
    comments: number
    shares: number
    views: number
  }
  isMonetizable: boolean
  adPlacementEnabled: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

// Inbox Messages
export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'SYSTEM'
export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ' | 'DELETED'

export interface InboxMessage {
  id: string
  conversationId: string
  senderId: string
  recipientId: string
  seshatPageId?: string
  messageType: MessageType
  content?: string
  mediaUrl?: string
  metadata?: Record<string, unknown>
  isRead: boolean
  readAt?: string
  status: MessageStatus
  createdAt: string
}

// Conversations
export interface Conversation {
  id: string
  participantIds: string[]
  seshatPageId?: string
  lastMessageId?: string
  lastMessageAt?: string
  unreadCount: number
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

// Ad Campaigns
export type CampaignType = 'BOOST_POST' | 'PAGE_LIKES' | 'WEBSITE_CLICKS' | 'APP_INSTALLS' | 'VIDEO_VIEWS'
export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'REJECTED'

export interface AdCampaign {
  id: string
  seshatPageId: string
  campaignName: string
  campaignType: CampaignType
  objective: string
  budgetDaily?: number
  budgetLifetime?: number
  currency: string
  startDate?: string
  endDate?: string
  status: CampaignStatus
  targetingCriteria?: Record<string, unknown>
  creativeAssets?: Record<string, unknown>
  performanceMetrics: {
    impressions: number
    clicks: number
    spend: number
    ctr: number
  }
  createdAt: string
  updatedAt: string
}

// Subscriptions
export type SubscriptionTier = 'BASIC' | 'PREMIUM' | 'ENTERPRISE'
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAST_DUE'

export interface Subscription {
  id: string
  seshatPageId: string
  subscriberId: string
  tier: SubscriptionTier
  priceMonthly: number
  status: SubscriptionStatus
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelledAt?: string
  stripeSubscriptionId?: string
  createdAt: string
  updatedAt: string
}

// Shop Products
export interface ShopProduct {
  id: string
  seshatPageId: string
  productName: string
  description?: string
  price: number
  currency: string
  inventoryCount: number
  sku?: string
  imagesUrls: string[]
  category?: string
  tags: string[]
  isActive: boolean
  stripeProductId?: string
  createdAt: string
  updatedAt: string
}

// Lead Management
export type LeadSource = 'AD_CAMPAIGN' | 'ORGANIC' | 'REFERRAL' | 'EVENT'
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST'

export interface Lead {
  id: string
  seshatPageId: string
  leadSource: LeadSource
  firstName: string
  lastName?: string
  email?: string
  phone?: string
  companyName?: string
  jobTitle?: string
  status: LeadStatus
  notes?: string
  customFields?: Record<string, unknown>
  assignedTo?: string
  convertedAt?: string
  createdAt: string
  updatedAt: string
}

// Analytics Events
export interface AnalyticsEvent {
  id: string
  seshatPageId: string
  eventType: string
  eventCategory: string
  userId?: string
  sessionId?: string
  metadata?: Record<string, unknown>
  revenueImpact: number
  occurredAt: string
}

// Team Members
export type TeamRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'ANALYST' | 'MODERATOR'
export type TeamMemberStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REVOKED'

export interface TeamMember {
  id: string
  seshatPageId: string
  userId: string
  role: TeamRole
  permissions?: Record<string, unknown>
  invitedAt: string
  joinedAt?: string
  status: TeamMemberStatus
  invitedBy?: string
}

// Content Metrics Interface
export interface ContentMetrics {
  id: string
  seshatPageId: string
  watchMinutes60d: number
  watchMinutes30d: number
  postEngagement30d: number
  returningViewers30d: number
  uniqueViews30d: number
  activeVideos: number
  consecutiveFollowerDays: number
  originalContentScore: number
  policyViolations: number
  giftPurchaseEligible: boolean
  updatedAt: string
}

// Webhook Event Interface
export interface WebhookEvent {
  id: string
  eventType: string
  payloadJson: string
  status: 'pending' | 'processed' | 'failed'
  receivedAt: string
}

// Affiliate Event Interface
export interface AffiliateEvent {
  id: string
  seshatPageId: string
  partnerName: string
  clicks: number
  conversions: number
  commissionAmount: number
  attributionWindowDays: number
  recordedAt: string
}

// Audit Log Interface
export interface AuditLog {
  id: string
  actorId: string
  action: string
  targetType: string
  targetId: string
  metadataJson: string
  createdAt: string
}

// Business Verification Interface
export interface BusinessVerification {
  id: string
  userId: string
  legalName: string
  registrationNumber: string
  countryCode: string
  reviewStatus: 'pending' | 'approved' | 'rejected'
  submittedAt: string
}

// Payout Interface
export interface Payout {
  id: string
  seshatPageId: string
  payoutAccountId: string
  amount: number
  status: 'pending' | 'scheduled' | 'paid' | 'held' | 'processing' | 'cancelled'
  scheduledFor: string
  paidAt: string | null
  holdReason?: string
}

// Revenue Ledger Entry Interface
export interface RevenueLedgerEntry {
  id: string
  seshatPageId: string
  productKey: ProductKey
  grossAmount: number
  platformFee: number
  reserveAmount: number
  taxAmount: number
  netAmount: number
  settlementStatus: 'scheduled' | 'held' | 'paid' | 'pending' | 'settled' | 'returned'
  occurredAt: string
}

export interface MonetizationMetrics {
  followers: number
  watchMinutes60d: number
  watchMinutes30d: number
  postEngagement30d: number
  returningViewers30d: number
  uniqueViews30d: number
  activeVideos: number
  consecutiveFollowerDays: number
  accountAgeDays: number
  age: number
  isEligibleCountry: boolean
  originalContentScore: number
  policyViolations: number
  giftPurchaseEligible: boolean
  verifiedBusiness: boolean
  verifiedPayout: boolean
}
