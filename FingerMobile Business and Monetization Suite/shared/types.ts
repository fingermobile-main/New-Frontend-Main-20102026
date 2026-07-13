// User Interface
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  age: number;
  countryCode: string;
  accountAgeDays: number;
  createdAt: string;
}

// Monetization Metrics Interface
export interface MonetizationMetrics {
  followers: number;
  watchMinutes60d: number;
  watchMinutes30d: number;
  postEngagement30d: number;
  returningViewers30d: number;
  uniqueViews30d: number;
  activeVideos: number;
  consecutiveFollowerDays: number;
  accountAgeDays: number;
  age: number;
  isEligibleCountry: boolean;
  originalContentScore: number;
  policyViolations: number;
  giftPurchaseEligible: boolean;
  verifiedBusiness: boolean;
  verifiedPayout: boolean;
}

// Eligibility Interface
export interface EligibilityProduct {
  product: string;
  status: string;
  passedRules: string[];
  failedRules: string[];
  nextActions: string[];
}

export interface Eligibility {
  universalStatus: string;
  products: EligibilityProduct[];
}

// Platform Configuration Interface
export interface PlatformConfig {
  id?: string;
  minimumAge: number;
  minimumPayoutThreshold: number;
  seshatMonthlyFee: number;
  seshatYearlyFee: number;
  revenueSharePercentage: number;
  giftsCashValue: number;
  supportedCountries: string | string[];
  policyVersion: string;
  affiliateBonusPercentage: number;
}

// Seshat Page Interface
export interface SeshatPage {
  id: string;
  ownerUserId: string;
  name: string;
  description: string;
  followersCount: number;
  visibility: string;
  freeUntil: string | null;
  billingPlan: string;
  verifiedBusiness: boolean;
  createdAt: string;
}

// Revenue Interface
export interface Revenue {
  id: number;
  userId: string;
  availableBalance: number;
  pendingPayouts: number;
  monthRevenue: number;
  thresholdRemaining: number;
  todayEarnings?: number;
  thisWeekEarnings?: number;
  thisMonthEarnings?: number;
  allTimeEarnings?: number;
  adsRevenue?: number;
  giftsRevenue?: number;
  subscriptionRevenue?: number;
  paymentHistory?: Array<{
    date: string;
    type: string;
    amount: number;
    status: string;
  }>;
  payoutAccount?: {
    bankName: string;
    accountLast4: string;
    currency: string;
  };
  createdAt: string;
}

// Alert Interface
export interface Alert {
  id: string;
  userId: string;
  message: string;
  type: string;
  timestamp: string;
  read: boolean;
}

// Estimate Interface
export interface Estimate {
  id: number;
  userId: string;
  qualifyingViews: number;
  rpm: number;
  impressions: number;
  cpm: number;
  grossAdRevenue: number;
  revenueSharePercentage: number;
  totalClicks: number;
  cpc: number;
  totalRevenueGenerated: number;
  totalOrders: number;
  totalProductionCosts: number;
  productLinkClicks: number;
  contentPurchases: number;
  totalViews: number;
  totalWatchTimeMinutes: number;
  totalVideoLengthMinutes: number;
  currency: string;
  createdAt: string;
}

// Affiliate Interface
export interface Affiliate {
  id: number;
  userId: string;
  totalEarnings: number;
  activeReferrals: number;
  conversionRate: number;
  commissionRate: number;
  referralCode: string;
  createdAt: string;
  activity?: Array<{
    date: string;
    action: string;
    details: string;
  }>;
}

// Seshat 商业指标接口 - 存储用户的订阅和收入数据
export interface Seshats {
  id: number;
  userId: string;
  activeSubscribers: number;
  monthlyRevenue: number;
  conversionRate: number;
  avgRetention: number;
  basicTierPrice: number;
  premiumTierPrice: number;
  enterpriseTierPrice: number;
  createdAt: string;
}

// Hallmarks Interface (alias for Seshats)
export interface Hallmarks {
  id: number;
  userId: string;
  activeSubscribers: number;
  monthlyRevenue: number;
  conversionRate: number;
  avgRetention: number;
  basicTierPrice: number;
  premiumTierPrice: number;
  enterpriseTierPrice: number;
  createdAt: string;
}

// Program Definition Interface
export interface ProgramDefinition {
  key: string;
  name: string;
  title?: string;
  summary: string;
  description?: string;
  requirements: string[];
}

// Eligibility Result Interface
export interface EligibilityResult {
  status: string;
  requirementsMet: string[];
  requirementsNotMet: string[];
}

// Eligibility Status Interface
export interface EligibilityStatus {
  status: string;
  message: string;
}

// Business Suite Overview Interface
export interface BusinessSuiteOverview {
  user: User;
  seshatPage: SeshatPage | null;
  metrics: MonetizationMetrics;
  config: PlatformConfig;
  eligibility: Eligibility;
  revenue: Revenue | null;
  alerts: Alert[];
  estimate: Estimate | null;
  admin: {
    config: PlatformConfig;
    auditLogs: unknown[];
    webhooks: unknown[];
    applications: unknown[];
    userCount: number;
    applicationCount: number;
    revenueStats: {
      totalRevenue: number;
      monthlyRevenue: number;
    };
    webhookStatus: {
      lastProcessed: string;
      status: string;
    };
  };
  affiliate: Affiliate | null;
  seshat: Seshats | null;
  programs: ProgramDefinition[];
}

// Response Interfaces
export interface OverviewResponse {
  user: User;
  seshatPage: SeshatPage | null;
  metrics: MonetizationMetrics;
  config: PlatformConfig;
  eligibility: Eligibility;
  revenue: Revenue | null;
  alerts: Alert[];
  estimate: Estimate | null;
  admin: {
    config: PlatformConfig;
    auditLogs: unknown[];
    webhooks: unknown[];
    applications: unknown[];
    userCount: number;
    applicationCount: number;
    revenueStats: {
      totalRevenue: number;
      monthlyRevenue: number;
    };
    webhookStatus: {
      lastProcessed: string;
      status: string;
    };
  };
  affiliate: Affiliate | null;
  seshat: Seshats | null;
  programs: ProgramDefinition[];
  verification?: {
    legalName: string;
    registrationNumber: string;
    countryCode: string;
  };
}

export interface EstimateRequest {
  // Core metrics from form
  dailyViews?: number;
  rpm?: number;
  cpm?: number;
  engagementRate?: number;
  subscriberCount?: number;
  contentPerWeek?: number;
  
  // Calculated metrics
  qualifyingViews?: number;
  impressions?: number;
  grossAdRevenue?: number;
  revenueSharePercentage?: number;
  
  // Advanced metrics
  followerQualityScore?: number;
  contentEngagementRate?: number;
  avgWatchTime?: number;
  videoUploadFrequency?: number;
  subscriberGrowthRate?: number;
  monetizationPlatformUsage?: number;
  contentOriginalityScore?: number;
  audienceDemographicMatch?: number;
  brandSafetyCompliance?: number;
  adLoadTime?: number;
  
  // Legacy/alternative fields
  totalClicks?: number;
  cpc?: number;
  totalRevenueGenerated?: number;
  totalOrders?: number;
  totalProductionCosts?: number;
  productLinkClicks?: number;
  contentPurchases?: number;
  totalViews?: number;
  totalWatchTimeMinutes?: number;
  totalVideoLengthMinutes?: number;
  currency?: string;
}

export interface EstimateResponse {
  totalEarnings: number;
  totalAdCost: number;
  creatorRevenueShare: number;
  cpcRevenue: number;
  ctr: number;
  averageOrderValue: number;
  roi: number;
  clickToViewRatio: number;
  salesConversionRate: number;
  viewToPurchaseRate: number;
  averageViewDuration: number;
  retentionRate: number;
  
  // Additional properties used in MonetizationPage
  monthlyRevenue?: number;
  annualRevenue?: number;
  estimatedCpm?: number;
  revenueSharePercentage?: number;
}

// Admin Data Interface
export interface AdminData {
  userCount: number;
  applicationCount: number;
  revenueStats: {
    totalRevenue: number;
    monthlyRevenue: number;
  };
  webhookStatus: {
    lastProcessed: string;
    status: string;
  };
}

// Affiliate Metrics Interface
export interface AffiliateMetrics {
  totalEarnings: number;
  activeReferrals: number;
  conversionRate: number;
  commissionRate: number;
  referralCode: string;
  activity: Array<{
    date: string;
    referral: string;
    action: string;
    commission: number;
    status: string;
  }>;
}

// Verification Status Interface
export interface VerificationStatus {
  businessVerified: boolean;
  documentsSubmitted: boolean;
  verificationStatus: string;
  rejectionReason: string | null;
}

// Payout Account Interface
export interface PayoutAccount {
  bankName: string;
  accountLast4: string;
  currency: string;
  updatedAt: string;
}

// Product Interface
export interface Product {
  key: string;
  title: string;
  summary: string;
  requirements: string[];
}

// Config Update Interface
export interface ConfigUpdate {
  minimumAge?: number;
  minimumPayoutThreshold?: number;
  seshatMonthlyFee?: number;
  seshatYearlyFee?: number;
  revenueSharePercentage?: number;
  giftsCashValue?: number;
  supportedCountries?: string;
  policyVersion?: string;
  affiliateBonusPercentage?: number;
}

// Application Request Interface
export interface ApplicationRequest {
  productKey: string;
}

