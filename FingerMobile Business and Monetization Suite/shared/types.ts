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