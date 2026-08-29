export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  age?: number;
  countryCode?: string;
  accountAgeDays?: number;
  createdAt: string;
}

export interface HallmarkPage {
  id: string;
  ownerUserId: string;
  name: string;
  description?: string;
  followersCount: number;
  visibility: string;
  freeUntil?: string;
  billingPlan: string;
  verifiedBusiness: boolean;
  createdAt: string;
}

export interface MonetizationApplication {
  id: string;
  hallmarkPageId: string;
  productKey: ProductKey; // Using the new type
  status: string;
  submittedAt?: string;
  decisionNotes?: string;
}

export interface PlatformConfig {
  id: string;
  minimumAge: number;
  minimumPayoutThreshold: number;
  hallmarkMonthlyFee: number;
  hallmarkYearlyFee: number;
  revenueSharePercentage: number;
  giftsCashValue: number;
  supportedCountries: string[];
  policyVersion: string;
  affiliateBonusPercentage: number;
}

export interface Metrics {
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

export interface Eligibility {
  universalStatus: string;
  products: Array<{
    product: ProductKey;
    status: string;
    passedRules: string[];
    failedRules: string[];
    nextActions: string[];
  }>;
}

export interface Revenue {
  availableBalance: number;
  pendingPayouts: number;
  monthRevenue: number;
  thresholdRemaining: number;
}

export interface Alert {
  id: string;
  message: string;
  type: string;
  timestamp: string;
}

export interface BusinessSuiteData {
  user: User;
  hallmarkPage: HallmarkPage;
  metrics: Metrics;
  config: PlatformConfig;
  eligibility: Eligibility;
  revenue?: Revenue;
  alerts: Alert[];
  estimate?: EstimateResponse;
}

export interface EstimateRequest {
  qualifyingViews: number;
  rpm: number;
  impressions: number;
  cpm: number;
  grossAdRevenue: number;
  revenueSharePercentage: number;
  totalClicks?: number;
  cpc?: number;
  totalRevenueGenerated?: number;
  totalOrders?: number;
  totalProductionCosts?: number;
  productLinkClicks?: number;
  contentPurchases?: number;
  totalViews?: number;
  totalWatchTimeMinutes?: number;
  totalVideoLengthMinutes?: number; // Added to fix error
  currency?: string; // 新增：指定估算所用的货币单位，例如 "USD"
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
}

export interface ProgramDefinition {
  key: ProductKey;
  title: string;
  summary: string;
  requirements: string[];
}

export type EligibilityStatus = 'eligible' | 'warning' | 'blocked' | 'pending';

// Added missing types
export interface OverviewResponse extends BusinessSuiteData {}

export interface EligibilityResult {
  status: EligibilityStatus;
  passedRules: string[];
  failedRules: string[];
  nextActions: string[];
}

// New type for product keys
export type ProductKey = 
  | 'in_stream_ads'
  | 'gifts'
  | 'subscriptions'
  | 'reels_ads'
  | 'affiliate'
  | string; // Allow custom product keys as well