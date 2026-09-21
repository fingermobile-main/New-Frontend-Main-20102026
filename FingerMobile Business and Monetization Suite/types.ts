// Basic types
export interface ProductKey {
  id: string;
  name: string;
  description?: string;
  visibility: 'public' | 'private' | 'unlisted';
  billingPlan: 'basic' | 'premium' | 'enterprise' | 'free_trial';
}

// Monetization types
export interface MonetizationApplication {
  id: string;
  userId: string;
  businessName: string;
  website: string;
  businessDescription: string;
  monthlyRevenue?: number;
  country: string;
  productInterest: string[];
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewerNotes?: string;
}

export interface Eligibility {
  universalStatus: 'ineligible' | 'eligible' | 'conditional';
  products: Record<string, {
    eligible: boolean;
    status: 'ineligible' | 'eligible' | 'conditional';
    reasons: string[];
  }>;
  metrics: MonetizationMetrics;
  alerts: string[];
}

export interface MonetizationMetrics {
  userBase: number;
  engagementRate: number;
  contentVolume: number;
  geographicDistribution: Record<string, number>;
  deviceBreakdown: Record<string, number>;
  revenuePotential: number;
  riskFactors: string[];
}

export interface EstimateRequest {
  projectedMonthlyUsers: number;
  engagementRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  averageOrderValue: number;
  contentCategories: string[];
  geographicFocus: string[];
}

export interface EstimateResult {
  potentialRevenueRange: {
    min: number;
    max: number;
    currency: string;
  };
  keyDrivers: string[];
  riskFactors: string[];
  recommendations: string[];
  confidenceLevel: 'low' | 'medium' | 'high';
}

export interface SeshatPage {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  views: number;
  likes: number;
  shares: number;
}

// Business verification types
export interface BusinessVerification {
  id: string;
  userId: string;
  businessName: string;
  registrationNumber: string;
  taxId: string;
  incorporationDate: Date;
  businessAddress: string;
  supportingDocuments: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedAt?: Date;
  notes?: string;
}

// Payout account types
export interface PayoutAccount {
  id: string;
  userId: string;
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  bankCountry: string;
  currency: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Platform configuration
export interface PlatformConfig {
  id: string;
  minimumAge: number;
  minimumPayoutThreshold: number;
  seshatMonthlyFee: number;
  seshatYearlyFee: number;
  monetizationFeePercentage: number;
  verificationFee: number;
  payoutProcessingTime: number;
  affiliateCommissionRate: number;
  enableMonetization: boolean;
  enableAffiliateProgram: boolean;
  contentPolicy: string;
  privacyPolicy: string;
  termsOfService: string;
  createdAt: Date;
  updatedAt: Date;
}

// Content metrics
export interface ContentMetrics {
  id: string;
  contentId: string;
  impressions: number;
  clicks: number;
  engagementRate: number;
  reach: number;
  saves: number;
  shares: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
}

// Affiliate event
export interface AffiliateEvent {
  id: string;
  affiliateId: string;
  eventId: string;
  eventType: 'click' | 'signup' | 'purchase' | 'conversion';
  commissionAmount: number;
  currency: string;
  metadata: Record<string, unknown>;
  occurredAt: Date;
}

// Revenue ledger entry
export interface RevenueLedgerEntry {
  id: string;
  userId: string;
  transactionType: 'sale' | 'affiliate_commission' | 'subscription_fee' | 'refund';
  amount: number;
  currency: string;
  description: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  processedAt: Date;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  metadata: Record<string, unknown>;
}

// User profile
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: Record<string, string>;
  role: 'user' | 'moderator' | 'admin' | 'super_admin';
  status: 'active' | 'inactive' | 'suspended' | 'deleted';
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Post/thread
export interface Post {
  id: string;
  userId: string;
  title?: string;
  content: string;
  contentType: 'text' | 'image' | 'video' | 'link' | 'poll';
  tags: string[];
  visibility: 'public' | 'friends' | 'private';
  parentId?: string;
  mediaUrls?: string[];
  pollOptions?: string[];
  pollExpiresAt?: Date;
  isPinned: boolean;
  isLocked: boolean;
  stats: {
    likes: number;
    dislikes: number;
    comments: number;
    shares: number;
    views: number;
    bookmarks: number;
  };
  moderation: {
    status: 'pending' | 'approved' | 'rejected' | 'flagged';
    flaggedBy?: string;
    flaggedReason?: string;
    reviewedBy?: string;
    reviewedAt?: Date;
  };
  publishedAt: Date;
  updatedAt: Date;
}

// Comment
export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  parentId?: string;
  isEdited: boolean;
  stats: {
    likes: number;
    dislikes: number;
  };
  moderation: {
    status: 'pending' | 'approved' | 'rejected' | 'flagged';
    flaggedBy?: string;
    flaggedReason?: string;
    reviewedBy?: string;
    reviewedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'mention' | 'follow' | 'message' | 'system';
  title: string;
  message: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

// Message
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  threadId: string;
  isRead: boolean;
  readAt?: Date;
  deliveredAt?: Date;
  attachments?: string[];
  status: 'sent' | 'delivered' | 'read';
  createdAt: Date;
  updatedAt: Date;
}

// Thread
export interface Thread {
  id: string;
  participants: string[];
  title?: string;
  isGroup: boolean;
  isArchived: boolean;
  lastMessageAt?: Date;
  lastMessage?: string;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Report
export interface Report {
  id: string;
  reporterId: string;
  reportedEntityId: string;
  reportedEntityType: 'post' | 'comment' | 'user' | 'message';
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'action_taken';
  reviewedBy?: string;
  reviewedAt?: Date;
  evidence?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Activity
export interface Activity {
  id: string;
  userId: string;
  action: string;
  targetId?: string;
  targetType?: string;
  metadata: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  occurredAt: Date;
}

// Session
export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken?: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Category
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  isActive: boolean;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Tag
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  usageCount: number;
  isModerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Moderation
export interface ModerationAction {
  id: string;
  moderatorId: string;
  targetId: string;
  targetType: string;
  action: 'approve' | 'reject' | 'flag' | 'suspend' | 'ban' | 'warn';
  reason: string;
  duration?: number; // in days for temporary actions
  metadata: Record<string, unknown>;
  createdAt: Date;
}

// Analytics
export interface AnalyticsData {
  id: string;
  userId: string;
  metric: string;
  value: number | string | Record<string, unknown>;
  date: Date;
  metadata: Record<string, unknown>;
}

// Subscription
export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  startDate: Date;
  endDate?: Date;
  nextBillingDate?: Date;
  amount: number;
  currency: string;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Plan
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Payment
export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  invoiceId?: string;
  metadata: Record<string, unknown>;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Invoice
export interface Invoice {
  id: string;
  userId: string;
  subscriptionId?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issuedAt: Date;
  dueAt?: Date;
  paidAt?: Date;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Coupon
export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  currency?: string;
  usageLimit?: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  applicablePlans: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Referral
export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  rewardAmount: number;
  rewardCurrency: string;
  status: 'pending' | 'awarded' | 'expired';
  rewardedAt?: Date;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Reward
export interface Reward {
  id: string;
  userId: string;
  type: 'achievement' | 'referral' | 'loyalty' | 'bonus';
  name: string;
  description: string;
  points: number;
  value?: number;
  status: 'pending' | 'awarded' | 'redeemed';
  awardedAt?: Date;
  redeemedAt?: Date;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Achievement
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  points: number;
  requirements: {
    type: 'activity' | 'duration' | 'milestone';
    condition: string;
    threshold: number;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Bookmark
export interface Bookmark {
  id: string;
  userId: string;
  entityId: string;
  entityType: 'post' | 'comment' | 'article' | 'video';
  folder?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Follow
export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  status: 'following' | 'requested' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

// Block
export interface Block {
  id: string;
  blockerId: string;
  blockedId: string;
  reason?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Privacy setting
export interface PrivacySetting {
  id: string;
  userId: string;
  setting: string;
  value: string | boolean | number;
  createdAt: Date;
  updatedAt: Date;
}

// Preference
export interface Preference {
  id: string;
  userId: string;
  category: string;
  key: string;
  value: string | boolean | number | Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Setting
export interface Setting {
  id: string;
  key: string;
  value: string | boolean | number | Record<string, unknown>;
  scope: 'global' | 'user' | 'tenant';
  dataType: 'string' | 'number' | 'boolean' | 'json';
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tenant
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  settings: Record<string, unknown>;
  status: 'active' | 'suspended' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

// Permission
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  conditions?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Role
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Audit log
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  occurredAt: Date;
}

// Backup
export interface Backup {
  id: string;
  fileName: string;
  size: number;
  checksum: string;
  status: 'pending' | 'completed' | 'failed';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Migration
export interface Migration {
  id: string;
  name: string;
  batch: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

// Cache entry
export interface CacheEntry {
  id: string;
  key: string;
  value: string;
  ttl?: number;
  createdAt: Date;
  expiresAt?: Date;
}

// Queue job
export interface QueueJob {
  id: string;
  queue: string;
  name: string;
  data: Record<string, unknown>;
  attempts: number;
  maxAttempts: number;
  status: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';
  priority: 'low' | 'normal' | 'high' | 'critical';
  startedAt?: Date;
  finishedAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Rate limit
export interface RateLimit {
  id: string;
  key: string;
  window: number; // in seconds
  count: number;
  resetAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Geo location
export interface GeoLocation {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  source: 'gps' | 'network' | 'manual';
  timestamp: Date;
  createdAt: Date;
}

// Device
export interface Device {
  id: string;
  userId: string;
  deviceId: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'tv' | 'other';
  os: string;
  osVersion: string;
  browser?: string;
  browserVersion?: string;
  appVersion?: string;
  pushToken?: string;
  isPrimary: boolean;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Push notification
export interface PushNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Email
export interface Email {
  id: string;
  userId: string;
  templateId: string;
  subject: string;
  body: string;
  recipients: string[];
  status: 'draft' | 'queued' | 'sent' | 'failed';
  sentAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

// SMS
export interface Sms {
  id: string;
  userId: string;
  phoneNumber: string;
  message: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

// File upload
export interface FileUpload {
  id: string;
  userId: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  processingError?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Search index
export interface SearchIndex {
  id: string;
  entity: string;
  entityId: string;
  content: string;
  metadata: Record<string, unknown>;
  indexedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API key
export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  permissions: string[];
  expiresAt?: Date;
  lastUsedAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Webhook
export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  lastTriggeredAt?: Date;
  lastResponseCode?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Integration
export interface Integration {
  id: string;
  userId: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  credentials: Record<string, unknown>;
  isActive: boolean;
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// OAuth app
export interface OauthApp {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  scopes: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// OAuth token
export interface OauthToken {
  id: string;
  userId: string;
  oauthAppId: string;
  token: string;
  refreshToken?: string;
  expiresAt: Date;
  scopes: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Task
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'critical';
  dueDate?: Date;
  assignedTo?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Event
export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  organizerId: string;
  attendees: string[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Group
export interface Group {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: string[];
  roleAssignments: Record<string, string>; // userId -> role
  settings: Record<string, unknown>;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Forum
export interface Forum {
  id: string;
  name: string;
  description?: string;
  slug: string;
  categoryId: string;
  threadsCount: number;
  postsCount: number;
  moderators: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Thread (forum)
export interface ForumThread {
  id: string;
  forumId: string;
  userId: string;
  title: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  replyCount: number;
  lastReplyAt?: Date;
  lastReplyUserId?: string;
  status: 'open' | 'closed' | 'archived';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Poll
export interface Poll {
  id: string;
  userId: string;
  question: string;
  options: string[];
  votes: Record<number, number>; // option index -> vote count
  isMultipleChoice: boolean;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Vote
export interface Vote {
  id: string;
  userId: string;
  pollId: string;
  optionIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

// Cart
export interface Cart {
  id: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    variant?: string;
    options?: Record<string, unknown>;
  }[];
  total: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order
export interface Order {
  id: string;
  userId: string;
  cartId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    variant?: string;
    options?: Record<string, unknown>;
  }[];
  total: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Product
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  tags: string[];
  stockQuantity: number;
  variants: Record<string, unknown>[];
  images: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Review
export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string;
  content: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  reportedCount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Wishlist
export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  addedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Advertisement
export interface Advertisement {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  targetUrl: string;
  campaignId: string;
  adType: 'banner' | 'popup' | 'sidebar' | 'native';
  placement: string;
  targeting: {
    demographics?: Record<string, unknown>;
    interests?: string[];
    behaviors?: string[];
  };
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Campaign
export interface Campaign {
  id: string;
  name: string;
  description: string;
  advertiserId: string;
  objective: 'awareness' | 'traffic' | 'engagement' | 'conversions';
  budget: number;
  spent: number;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  targeting: {
    demographics?: Record<string, unknown>;
    interests?: string[];
    behaviors?: string[];
    geographies?: string[];
  };
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Click
export interface Click {
  id: string;
  advertisementId: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
}

// Conversion
export interface Conversion {
  id: string;
  advertisementId: string;
  userId?: string;
  sessionId?: string;
  value: number;
  currency: string;
  type: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
}

// Media asset
export interface MediaAsset {
  id: string;
  userId: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  altText?: string;
  caption?: string;
  tags: string[];
  folderId?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Folder
export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  userId: string;
  path: string;
  assetCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Playlist
export interface Playlist {
  id: string;
  userId: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  tracks: string[]; // IDs of media assets
  isPublic: boolean;
  trackCount: number;
  duration: number; // in seconds
  createdAt: Date;
  updatedAt: Date;
}

// Stream
export interface Stream {
  id: string;
  userId: string;
  title: string;
  description?: string;
  streamKey: string;
  streamUrl: string;
  thumbnailUrl?: string;
  viewers: number;
  isLive: boolean;
  startedAt?: Date;
  endedAt?: Date;
  status: 'idle' | 'starting' | 'live' | 'ending' | 'ended';
  createdAt: Date;
  updatedAt: Date;
}

// Live event
export interface LiveEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  thumbnailUrl?: string;
  viewers: number;
  isLive: boolean;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Subscriber
export interface Subscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
  subscribedAt?: Date;
  unsubscribedAt?: Date;
  tags: string[];
  preferences: Record<string, boolean>;
  createdAt: Date;
  updatedAt: Date;
}

// Newsletter
export interface Newsletter {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent';
  scheduledAt?: Date;
  sentAt?: Date;
  recipients: number;
  opens: number;
  clicks: number;
  bounces: number;
  complaints: number;
  createdAt: Date;
  updatedAt: Date;
}

// Chat room
export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: string[];
  isPrivate: boolean;
  maxMembers?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Chat message
export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  isEdited: boolean;
  editedAt?: Date;
  reactions?: Record<string, string[]>; // emoji -> user IDs
  repliedTo?: string; // message ID
  createdAt: Date;
  updatedAt: Date;
}

// Knowledge base article
export interface KbArticle {
  id: string;
  title: string;
  content: string;
  authorId: string;
  categoryId: string;
  tags: string[];
  isPublished: boolean;
  viewCount: number;
  likes: number;
  helpfulCount: number;
  unhelpfulCount: number;
  status: 'draft' | 'review' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Knowledge base category
export interface KbCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  articleCount: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Ticket
export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
  assigneeId?: string;
  resolution?: string;
  resolvedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// FAQ
export interface Faq {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  tags: string[];
  isPublished: boolean;
  viewCount: number;
  helpfulCount: number;
  unhelpfulCount: number;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Survey
export interface Survey {
  id: string;
  title: string;
  description?: string;
  creatorId: string;
  questions: {
    id: string;
    type: 'text' | 'multiple_choice' | 'rating' | 'yes_no';
    question: string;
    options?: string[];
    isRequired: boolean;
  }[];
  isActive: boolean;
  startsAt: Date;
  endsAt?: Date;
  targetAudience?: string[];
  responseCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Survey response
export interface SurveyResponse {
  id: string;
  surveyId: string;
  userId?: string;
  answers: Record<string, string | string[] | number>; // question ID -> answer
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Feature flag
export interface FeatureFlag {
  id: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  rolloutPercentage: number; // 0-100
  targeting: {
    userIds?: string[];
    roles?: string[];
    tenants?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// A/B test
export interface AbTest {
  id: string;
  name: string;
  description?: string;
  featureId: string;
  variants: {
    id: string;
    name: string;
    trafficSplit: number; // percentage
    config: Record<string, unknown>;
  }[];
  status: 'draft' | 'running' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  winnerVariantId?: string;
  results?: {
    variantId: string;
    metricName: string;
    value: number;
    confidence: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Experiment
export interface Experiment {
  id: string;
  name: string;
  description?: string;
  hypothesis: string;
  goals: string[];
  status: 'planning' | 'running' | 'analysis' | 'concluded';
  startDate: Date;
  endDate?: Date;
  participants: number;
  results?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Feature
export interface Feature {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  dependencies: string[];
  accessGroups: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Changelog
export interface Changelog {
  id: string;
  title: string;
  content: string;
  version?: string;
  releaseDate: Date;
  authorId: string;
  tags: string[];
  isPublic: boolean;
  isBreakingChange: boolean;
  affectedComponents: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Announcement
export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  audience: 'all' | 'premium' | 'beta_testers';
  publishedAt: Date;
  expiresAt?: Date;
  isDismissable: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Feedback
export interface Feedback {
  id: string;
  userId: string;
  subject: string;
  content: string;
  category: 'bug' | 'feature_request' | 'improvement' | 'complaint' | 'compliment';
  status: 'received' | 'reviewed' | 'in_progress' | 'completed' | 'declined';
  priority: 'low' | 'normal' | 'high' | 'critical';
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Report summary
export interface ReportSummary {
  id: string;
  name: string;
  description: string;
  type: string;
  schedule: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';
  filters: Record<string, unknown>;
  recipients: string[];
  isActive: boolean;
  lastRunAt?: Date;
  nextRunAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard
export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  widgets: {
    id: string;
    type: string;
    title: string;
    config: Record<string, unknown>;
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Widget
export interface Widget {
  id: string;
  dashboardId: string;
  type: string;
  title: string;
  config: Record<string, unknown>;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Metric
export interface Metric {
  id: string;
  name: string;
  description: string;
  calculation: string;
  source: string;
  valueType: 'count' | 'percentage' | 'ratio' | 'amount';
  format: string;
  createdAt: Date;
  updatedAt: Date;
}

// KPI
export interface Kpi {
  id: string;
  name: string;
  description: string;
  target: number;
  currentValue: number;
  trend: 'up' | 'down' | 'stable';
  status: 'on_track' | 'at_risk' | 'off_track';
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Alert
export interface Alert {
  id: string;
  name: string;
  description: string;
  condition: string;
  threshold: number;
  severity: 'info' | 'warning' | 'error' | 'critical';
  status: 'active' | 'triggered' | 'resolved' | 'disabled';
  triggerValue?: number;
  triggeredAt?: Date;
  resolvedAt?: Date;
  notifiedUsers: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Notification preference
export interface NotificationPreference {
  id: string;
  userId: string;
  channel: 'email' | 'push' | 'sms' | 'web';
  eventType: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Data export
export interface DataExport {
  id: string;
  userId: string;
  exportType: string;
  filters: Record<string, unknown>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt?: Date;
  fileSize?: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Data import
export interface DataImport {
  id: string;
  userId: string;
  importType: string;
  source: string;
  fileUrl: string;
  status: 'pending' | 'validating' | 'processing' | 'completed' | 'failed';
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  errorMessage?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Backup schedule
export interface BackupSchedule {
  id: string;
  name: string;
  description?: string;
  schedule: string; // cron expression
  retentionPeriod: number; // in days
  storageLocation: string;
  lastRunAt?: Date;
  nextRunAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Maintenance window
export interface MaintenanceWindow {
  id: string;
  title: string;
  description: string;
  startAt: Date;
  endAt: Date;
  type: 'planned' | 'emergency';
  impact: 'none' | 'low' | 'medium' | 'high';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notifyUsers: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// System health
export interface SystemHealth {
  id: string;
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number; // in milliseconds
  lastCheckedAt: Date;
  details?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Performance metric
export interface PerformanceMetric {
  id: string;
  metricName: string;
  value: number;
  unit: string;
  timestamp: Date;
  labels: Record<string, string>;
  createdAt: Date;
}

// Log entry
export interface LogEntry {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  module: string;
  userId?: string;
  requestId?: string;
  metadata: Record<string, unknown>;
  timestamp: Date;
}

// Trace
export interface Trace {
  id: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in microseconds
  tags: Record<string, string>;
  logs: {
    timestamp: Date;
    fields: Record<string, unknown>;
  }[];
  createdAt: Date;
}

// Span
export interface Span {
  id: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in microseconds
  tags: Record<string, string>;
  logs: {
    timestamp: Date;
    fields: Record<string, unknown>;
  }[];
  createdAt: Date;
}

// Dependency
export interface Dependency {
  id: string;
  name: string;
  version: string;
  license: string;
  homepage?: string;
  repository?: string;
  isDevDependency: boolean;
  vulnerabilities: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Vulnerability
export interface Vulnerability {
  id: string;
  package: string;
  version: string;
  vulnerabilityId: string;
  title: string;
  description: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  cvssScore?: number;
  cveIds: string[];
  recommendation: string;
  advisoryUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Security scan
export interface SecurityScan {
  id: string;
  type: 'dependency' | 'code' | 'configuration' | 'secret';
  status: 'pending' | 'running' | 'completed' | 'failed';
  findings: {
    id: string;
    type: string;
    severity: string;
    description: string;
    location?: string;
    codeSnippet?: string;
    remediation: string;
  }[];
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Secret
export interface Secret {
  id: string;
  name: string;
  value: string;
  description?: string;
  scope: 'global' | 'tenant' | 'user';
  encryptionAlgorithm: string;
  isRotated: boolean;
  rotatedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Encryption key
export interface EncryptionKey {
  id: string;
  name: string;
  publicKey: string;
  privateKey?: string;
  algorithm: string;
  keyLength: number;
  purpose: 'encryption' | 'signing' | 'authentication';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Certificate
export interface Certificate {
  id: string;
  name: string;
  certificate: string;
  privateKey?: string;
  issuer: string;
  subject: string;
  validFrom: Date;
  validUntil: Date;
  serialNumber: string;
  fingerprint: string;
  status: 'valid' | 'expiring_soon' | 'expired' | 'revoked';
  createdAt: Date;
  updatedAt: Date;
}

// Token bucket
export interface TokenBucket {
  id: string;
  key: string;
  capacity: number;
  refillRate: number; // tokens per second
  tokens: number;
  lastRefillAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Circuit breaker
export interface CircuitBreaker {
  id: string;
  name: string;
  failureThreshold: number;
  timeout: number; // in milliseconds
  state: 'closed' | 'open' | 'half_open';
  failureCount: number;
  lastFailureAt?: Date;
  openedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Health check
export interface HealthCheck {
  id: string;
  name: string;
  url: string;
  interval: number; // in seconds
  timeout: number; // in seconds
  expectedStatus: number;
  isActive: boolean;
  lastCheckedAt?: Date;
  lastStatus?: number;
  lastResponseTime?: number; // in milliseconds
  createdAt: Date;
  updatedAt: Date;
}

// Feature toggle
export interface FeatureToggle {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  strategies: {
    name: string;
    parameters: Record<string, string>;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Launch darkly-like feature flag
export interface FeatureFlagV2 {
  id: string;
  key: string;
  name: string;
  description?: string;
  variations: {
    id: string;
    value: string | number | boolean | Record<string, unknown>;
    name?: string;
  }[];
  rules: {
    id: string;
    clauses: {
      attribute: string;
      operator: string;
      values: (string | number | boolean)[];
    }[];
    variationId: string;
  }[];
  fallthrough: {
    variationId: string;
  };
  offVariation: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Admin data
export interface AdminData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalPosts: number;
    totalComments: number;
    totalRevenue: number;
    subscriptions: {
      active: number;
      pending: number;
      expired: number;
    };
  };
  recentActivity: {
    action: string;
    user: string;
    timestamp: Date;
    details: string;
  }[];
  systemStats: {
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
    diskUsage: number;
  };
  performanceMetrics: {
    avgResponseTime: number;
    requestsPerMinute: number;
    errorRate: number;
  }[];
}