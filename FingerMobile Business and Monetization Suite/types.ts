// Shared types for the FingerMobile protocol

// User-related types
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

// Product-related types
export interface ProductKey {
  id: string;
  name: string;
  description?: string;
  visibility: 'public' | 'private' | 'unlisted';
  billingPlan: 'basic' | 'premium' | 'enterprise' | 'free_trial';
}

// Monetization-related types
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

// Response types
export interface OverviewResponse {
  applications: MonetizationApplication[];
  verifications: BusinessVerification[];
  payoutAccounts: PayoutAccount[];
  platformConfig: PlatformConfig;
}

export interface SeshatResponse {
  pages: SeshatPage[];
}

export interface ProgramsResponse {
  programs: ProductKey[];
}

export interface EligibilityResponse {
  eligibility: Eligibility;
}

export interface EstimateResponse {
  estimate: EstimateResult;
}

export interface ApplicationResponse {
  application: MonetizationApplication;
}

export interface ApplicationsResponse {
  applications: MonetizationApplication[];
}

export interface VerificationResponse {
  verification: BusinessVerification;
}

export interface VerificationsResponse {
  verifications: BusinessVerification[];
}

export interface PayoutAccountResponse {
  account: PayoutAccount;
}

export interface PayoutAccountsResponse {
  accounts: PayoutAccount[];
}

export interface ConfigResponse {
  config: PlatformConfig;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// API Request types
export interface CreateApplicationRequest {
  name: string;
  email: string;
  businessDescription: string;
  website?: string;
  monthlyRevenue?: number;
  country: string;
  productInterest: string[];
}

export interface UpdateApplicationRequest {
  name?: string;
  email?: string;
  businessDescription?: string;
  website?: string;
  monthlyRevenue?: number;
  country?: string;
  productInterest?: string[];
}

export interface CreateVerificationRequest {
  businessName: string;
  registrationNumber: string;
  taxId: string;
  incorporationDate: string;
  businessAddress: string;
  supportingDocuments: string[];
}

export interface UpdateVerificationRequest {
  businessName?: string;
  registrationNumber?: string;
  taxId?: string;
  incorporationDate?: string;
  businessAddress?: string;
  supportingDocuments?: string[];
}

export interface CreatePayoutAccountRequest {
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  bankCountry: string;
  currency: string;
}

export interface UpdatePayoutAccountRequest {
  accountHolderName?: string;
  accountNumber?: string;
  routingNumber?: string;
  bankName?: string;
  bankCountry?: string;
  currency?: string;
}

export interface UpdateConfigRequest {
  minimumAge?: number;
  minimumPayoutThreshold?: number;
  seshatMonthlyFee?: number;
  seshatYearlyFee?: number;
  monetizationFeePercentage?: number;
  verificationFee?: number;
  payoutProcessingTime?: number;
  affiliateCommissionRate?: number;
  enableMonetization?: boolean;
  enableAffiliateProgram?: boolean;
  contentPolicy?: string;
  privacyPolicy?: string;
  termsOfService?: string;
}

// Content-related types
export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  mediaUrls?: string[];
  privacy: 'public' | 'friends' | 'private';
  stats: {
    likes: number;
    dislikes: number;
    comments: number;
    shares: number;
    views: number;
    bookmarks: number;
  };
  moderation: {
    status: 'pending' | 'approved' | 'rejected';
    flaggedReason?: string;
  };
  publishedAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  parentId?: string;
  isEdited: boolean;
  stats: {
    likes: number;
    dislikes: number;
  };
  moderation: {
    status: 'pending' | 'approved' | 'rejected';
    flaggedReason?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  status: 'sent' | 'delivered' | 'read';
  createdAt: Date;
  updatedAt: Date;
}

export interface Thread {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Date;
  isGroup: boolean;
  isArchived: boolean;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedEntityId: string;
  reportedEntityType: 'post' | 'comment' | 'user' | 'message';
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  targetId?: string;
  targetType?: string;
  metadata?: Record<string, unknown>;
  occurredAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  deviceInfo?: string;
  ipAddress?: string;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  postCount: number;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  usageCount: number;
  isModerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModerationAction {
  id: string;
  moderatorId: string;
  action: 'approve' | 'reject' | 'flag' | 'remove' | 'suspend';
  targetId: string;
  targetType: string;
  reason?: string;
  notes?: string;
  createdAt: Date;
}

export interface AnalyticsData {
  id: string;
  metric: string;
  value: number;
  date: Date;
  metadata?: Record<string, unknown>;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  currency?: string;
  usageLimit?: number;
  usedCount: number;
  expiryDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Referral {
  id: string;
  referrerId: string;
  refereeId?: string;
  code: string;
  status: 'pending' | 'activated' | 'converted';
  rewardAmount?: number;
  rewardCurrency?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reward {
  id: string;
  userId: string;
  type: string;
  amount: number;
  currency: string;
  status: 'pending' | 'awarded' | 'redeemed';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  points: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bookmark {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  status: 'following' | 'pending' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

export interface Block {
  id: string;
  blockerId: string;
  blockedId: string;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrivacySetting {
  id: string;
  userId: string;
  setting: string;
  value: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Preference {
  id: string;
  userId: string;
  category: string;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Setting {
  id: string;
  userId?: string;
  key: string;
  value: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  subdomain?: string;
  config: Record<string, unknown>;
  status: 'active' | 'suspended' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  occurredAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  stockQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    currency: string;
  }[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cart {
  id: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    currency: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Advertisement {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  targetUrl: string;
  campaignId?: string;
  status: 'draft' | 'active' | 'paused' | 'ended';
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: 'draft' | 'active' | 'paused' | 'ended';
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Click {
  id: string;
  advertisementId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  occurredAt: Date;
}

export interface Conversion {
  id: string;
  campaignId: string;
  userId?: string;
  value: number;
  currency: string;
  occurredAt: Date;
}

export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  userId?: string;
  folderId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  userId?: string;
  assetCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  userId: string;
  isPublic: boolean;
  trackCount: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stream {
  id: string;
  title: string;
  description?: string;
  userId: string;
  streamKey: string;
  isLive: boolean;
  viewers: number;
  thumbnailUrl?: string;
  scheduledStartAt?: Date;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LiveEvent {
  id: string;
  title: string;
  description?: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  isLive: boolean;
  viewers: number;
  thumbnailUrl?: string;
  recordingUrl?: string;
  status: 'scheduled' | 'live' | 'ended' | 'recorded';
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
  subscribedAt?: Date;
  unsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Newsletter {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent';
  scheduledAt?: Date;
  sentAt?: Date;
  recipientCount: number;
  openRate?: number;
  clickRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  maxMembers?: number;
  ownerId: string;
  memberIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface KbArticle {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface KbCategory {
  id: string;
  name: string;
  description?: string;
  articleCount: number;
  parentId?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  categoryId?: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: {
    id: string;
    type: 'text' | 'multiple_choice' | 'rating' | 'yes_no';
    question: string;
    options?: string[];
    isRequired: boolean;
  }[];
  status: 'draft' | 'published' | 'closed';
  targetAudience?: string;
  startDate?: Date;
  endDate?: Date;
  responseCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  userId?: string;
  answers: {
    questionId: string;
    answer: string | string[] | number;
  }[];
  submittedAt: Date;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  targeting: {
    userIds?: string[];
    percentage?: number;
    attributes?: Record<string, string>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AbTest {
  id: string;
  name: string;
  description?: string;
  variants: {
    id: string;
    name: string;
    weight: number;
  }[];
  status: 'draft' | 'running' | 'completed';
  startDate?: Date;
  endDate?: Date;
  winnerVariantId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experiment {
  id: string;
  name: string;
  description?: string;
  hypothesis: string;
  variantA: string;
  variantB: string;
  metric: string;
  status: 'draft' | 'running' | 'completed';
  startDate?: Date;
  endDate?: Date;
  results?: {
    variant: string;
    value: number;
    confidence: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Feature {
  id: string;
  name: string;
  description?: string;
  status: 'development' | 'testing' | 'released' | 'deprecated';
  releaseDate?: Date;
  dependencies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Changelog {
  id: string;
  title: string;
  description: string;
  version: string;
  type: 'feature' | 'enhancement' | 'bug_fix' | 'security' | 'deprecation';
  releasedAt: Date;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'critical';
  priority: 'low' | 'medium' | 'high';
  isPublished: boolean;
  publishedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Feedback {
  id: string;
  userId?: string;
  type: 'bug_report' | 'feature_request' | 'general_feedback';
  subject: string;
  content: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportSummary {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  dateRange: {
    start: Date;
    end: Date;
  };
  data: Record<string, unknown>;
  createdAt: Date;
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  layout: {
    widgetId: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  userId?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Widget {
  id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  dashboardId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Metric {
  id: string;
  name: string;
  description?: string;
  source: string;
  calculation: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Kpi {
  id: string;
  name: string;
  description?: string;
  target: number;
  currentValue: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Alert {
  id: string;
  name: string;
  description?: string;
  condition: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  lastTriggeredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  channel: 'email' | 'push' | 'sms' | 'in_app';
  eventType: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataExport {
  id: string;
  userId: string;
  entityType: string;
  filters?: Record<string, unknown>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataImport {
  id: string;
  userId: string;
  entityType: string;
  source: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processedCount: number;
  totalCount: number;
  errors?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BackupSchedule {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  timezone: string;
  retentionDays: number;
  isActive: boolean;
  nextRunAt: Date;
  lastRunAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceWindow {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  impact: 'low' | 'medium' | 'high';
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemHealth {
  id: string;
  serviceName: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastCheckedAt: Date;
  details?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PerformanceMetric {
  id: string;
  metricName: string;
  value: number;
  unit: string;
  timestamp: Date;
  labels?: Record<string, string>;
}

export interface LogEntry {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
  userId?: string;
}

export interface Trace {
  id: string;
  traceId: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  durationMs: number;
  status: 'success' | 'error';
  tags?: Record<string, string>;
  createdAt: Date;
}

export interface Span {
  id: string;
  traceId: string;
  parentId?: string;
  operationName: string;
  startTime: Date;
  endTime?: Date;
  durationMs: number;
  tags?: Record<string, string>;
  logs?: Record<string, unknown>[];
  createdAt: Date;
}

export interface Dependency {
  id: string;
  name: string;
  version: string;
  license?: string;
  vulnerabilities: string[];
  lastScannedAt: Date;
}

export interface Vulnerability {
  id: string;
  cveId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedPackage: string;
  fixedVersion?: string;
  discoveredAt: Date;
}

export interface SecurityScan {
  id: string;
  type: 'dependency' | 'sast' | 'dast' | 'container';
  status: 'pending' | 'running' | 'completed' | 'failed';
  findings: {
    id: string;
    type: string;
    severity: string;
    description: string;
    location?: string;
  }[];
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
}

export interface Secret {
  id: string;
  name: string;
  value: string;
  description?: string;
  encrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EncryptionKey {
  id: string;
  name: string;
  algorithm: string;
  publicKey?: string;
  privateKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Certificate {
  id: string;
  name: string;
  type: 'ssl' | 'client_auth' | 'code_signing';
  issuer: string;
  subject: string;
  validFrom: Date;
  validUntil: Date;
  status: 'valid' | 'expiring_soon' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenBucket {
  id: string;
  identifier: string;
  capacity: number;
  refillRate: number;
  currentTokens: number;
  lastRefillAt: Date;
}

export interface CircuitBreaker {
  id: string;
  name: string;
  failureThreshold: number;
  timeoutMs: number;
  status: 'closed' | 'open' | 'half_open';
  lastFailureAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthCheck {
  id: string;
  name: string;
  type: 'http' | 'tcp' | 'grpc' | 'script';
  target: string;
  intervalSeconds: number;
  timeoutSeconds: number;
  healthy: boolean;
  lastCheckedAt: Date;
  lastResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeatureToggle {
  id: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  conditions: {
    type: 'user' | 'environment' | 'percentage';
    value: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FeatureFlagV2 {
  id: string;
  key: string;
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

// Backup and migration types
export interface Backup {
  id: string;
  filename: string;
  size: number;
  createdAt: Date;
  createdBy: string;
  status: 'completed' | 'failed' | 'in_progress';
  notes?: string;
}

export interface Migration {
  id: string;
  name: string;
  version: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

// Caching and queue types
export interface CacheEntry {
  id: string;
  key: string;
  value: string;
  ttl?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QueueJob {
  id: string;
  queue: string;
  jobType: string;
  payload: Record<string, unknown>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

// Rate limiting
export interface RateLimit {
  id: string;
  key: string;
  limit: number;
  window: number;
  count: number;
  resetTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Geographic and device types
export interface GeoLocation {
  id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: Date;
  userId?: string;
}

export interface Device {
  id: string;
  userId: string;
  deviceId: string;
  platform: 'ios' | 'android' | 'web';
  model?: string;
  osVersion?: string;
  appVersion?: string;
  fcmToken?: string;
  isPushEnabled: boolean;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Notification types
export interface PushNotification {
  id: string;
  userId?: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  status: 'queued' | 'sent' | 'failed';
  scheduledAt?: Date;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Email {
  id: string;
  to: string;
  subject: string;
  body: string;
  status: 'draft' | 'queued' | 'sent' | 'failed';
  sentAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sms {
  id: string;
  to: string;
  body: string;
  status: 'queued' | 'sent' | 'failed';
  sentAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

// File upload types
export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  userId?: string;
  status: 'uploading' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

// Search index types
export interface SearchIndex {
  id: string;
  entity: string;
  entityId: string;
  content: string;
  tags: string[];
  searchable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API and integration types
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  userId?: string;
  permissions: string[];
  expiresAt?: Date;
  lastUsedAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastTriggeredAt?: Date;
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// OAuth types
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

export interface OauthToken {
  id: string;
  userId: string;
  clientId: string;
  token: string;
  refreshToken?: string;
  scope: string[];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Task and event types
export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startAt: Date;
  endAt: Date;
  location?: string;
  organizerId: string;
  attendees: string[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Group and forum types
export interface Group {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  memberIds: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Forum {
  id: string;
  name: string;
  description?: string;
  slug: string;
  isPublic: boolean;
  threadCount: number;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumThread {
  id: string;
  forumId: string;
  title: string;
  content: string;
  authorId: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  replyCount: number;
  lastReplyAt?: Date;
  lastReplyBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Poll and voting types
export interface Poll {
  id: string;
  question: string;
  options: string[];
  userId: string;
  isMultipleChoice: boolean;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vote {
  id: string;
  pollId: string;
  userId: string;
  optionIndex: number;
  createdAt: Date;
}

// Re-export all types from the shared types file to maintain compatibility
export * from './shared/types';

// Additional types that might be needed for the frontend
export interface FormState {
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
  supportedCountries: string[];
}

export interface ExtendedOverviewResponse {
  applications: MonetizationApplication[];
  verifications: BusinessVerification[];
  payoutAccounts: PayoutAccount[];
  platformConfig: PlatformConfig;
  admin?: AdminData;
  affiliate?: AffiliateEvent[];
  revenue?: RevenueLedgerEntry[];
  policy?: string;
  seshat?: SeshatPage[];
  monetization?: MonetizationApplication[];
  eligibility?: Eligibility;
  estimate?: EstimateResult;
}
