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
  accountAgeDays?: number;  // Added for eligibility checks
  followers?: number;       // Added for eligibility checks
  watchMinutes30d?: number; // Added for eligibility checks
  policyViolations?: number; // Added for eligibility checks
  postEngagement30d?: number; // Added for eligibility checks
  originalContentScore?: number; // Added for eligibility checks
}

export interface EstimateRequest {
  projectedMonthlyUsers: number;
  engagementRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  averageOrderValue: number;
  contentCategories: string[];
  geographicFocus: string[];
  productKey?: string;      // Added for estimate service
  projectedVolume?: number; // Added for estimate service
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
  minimumUserBase?: number;  // Added for eligibility checks
  basicEligibility?: {       // Added for eligibility checks
    minFollowers: number;
    minWatchMinutes30d: number;
    minAccountAgeDays: number;
  };
  premiumEligibility?: {     // Added for eligibility checks
    minFollowers: number;
    minWatchMinutes30d: number;
    minAccountAgeDays: number;
    minEngagementRate: number;
  };
  enterpriseEligibility?: {  // Added for eligibility checks
    minFollowers: number;
    minWatchMinutes30d: number;
    minAccountAgeDays: number;
    minEngagementRate: number;
    minContentScore: number;
  };
  revenueSharePercentage?: number; // Added for config service
}

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

// Content types
export interface Post {
  id: string;
  userId: string;
  title?: string;
  content: string;
  contentType: 'text' | 'image' | 'video' | 'link' | 'poll';
  tags: string[];
  likes: number;
  shares: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  parentId?: string;
  likes: number;
  repliesCount: number;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  title?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Messaging types
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  subject?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Thread {
  id: string;
  participants: string[];
  subject: string;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Moderation types
export interface Report {
  id: string;
  reporterId: string;
  reportedId: string;
  reportedType: 'user' | 'post' | 'comment' | 'message';
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  targetId?: string;
  targetType?: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

// Session and authentication
export interface Session {
  id: string;
  userId: string;
  token: string;
  userAgent?: string;
  ip: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Categories and tags
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  usageCount: number;
  createdAt: Date;
}

// Moderation actions
export interface ModerationAction {
  id: string;
  moderatorId: string;
  targetId: string;
  targetType: 'user' | 'post' | 'comment' | 'message';
  action: 'warn' | 'suspend' | 'ban' | 'remove_content' | 'approve_content';
  reason: string;
  duration?: number; // in days
  createdAt: Date;
  updatedAt: Date;
}

// Analytics data
export interface AnalyticsData {
  id: string;
  dataType: 'user_engagement' | 'content_performance' | 'revenue_metrics' | 'growth_metrics';
  data: Record<string, unknown>;
  periodStart: Date;
  periodEnd: Date;
  createdAt: Date;
}

// Subscription types
export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Payment and financial
export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: 'subscription' | 'one_time' | 'payout' | 'fee';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  provider: string;
  transactionId: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  userId: string;
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
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
  issuedAt: Date;
  dueAt: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Referral and rewards
export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  status: 'pending' | 'completed' | 'expired';
  rewardAmount: number;
  rewardCurrency: string;
  rewardedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reward {
  id: string;
  userId: string;
  type: 'achievement' | 'referral' | 'bonus' | 'loyalty';
  description: string;
  points: number;
  value?: number;
  status: 'pending' | 'awarded' | 'redeemed';
  awardedAt?: Date;
  expiresAt?: Date;
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

// Affiliate events
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

// Revenue ledger entries
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
  id: string;
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
  // Add missing properties that services expect
  totalEarnings?: number;
  totalAdCost?: number;
  creatorRevenueShare?: number;
  cpcRevenue?: number;
  ctr?: number;
  averageOrderValue?: number;
  roi?: number;
  clickToViewRatio?: number;
  salesConversionRate?: number;
  viewToPurchaseRate?: number;
  averageViewDuration?: number;
  retentionRate?: number;
  monthlyRevenue?: number;
  annualRevenue?: number;
  estimatedCpm?: number;
  revenueSharePercentage?: number;
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
  status?: 'pending' | 'approved' | 'rejected' | 'under_review';
}

// Add missing interfaces that are referenced in services
export interface EligibilityProduct {
  product: string;
  eligible: boolean;
  status: 'ineligible' | 'eligible' | 'conditional';
  reasons: string[];
}

// Add missing types for services
export interface BusinessSuiteOverview {
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

export interface ConfigUpdate {
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
  revenueSharePercentage?: number;
}

export interface VerificationStatus {
  status: 'pending' | 'verified' | 'rejected';
  notes?: string;
  verifiedAt?: Date;
}

export interface ProgramDefinition {
  id: string;
  name: string;
  title?: string; // Added title property
  description: string;
  summary?: string; // Added summary property
  features: string[];
  requirements?: string[]; // Added requirements property
  pricing: {
    monthly: number;
    yearly: number;
  };
  eligibilityRequirements: Record<string, unknown>;
}

export interface AffiliateMetrics {
  totalReferrals: number;
  totalCommission: number;
  conversionRate: number;
  averageCommissionPerReferral: number;
  topPerformingReferrals: string[];
  monthlyTrends: {
    month: string;
    referrals: number;
    commission: number;
  }[];
}