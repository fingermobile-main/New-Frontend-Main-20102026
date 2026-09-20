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

export interface SeshatPage {
  id: string;
  ownerUserId: string;
  name: string;
  description?: string;
  followersCount: number;
  visibility: string;
  freeUntil: string;
  billingPlan: string;
  verifiedBusiness: boolean;
  createdAt: string;
}

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
  age?: number;
  isEligibleCountry: boolean;
  originalContentScore: number;
  policyViolations: number;
  giftPurchaseEligible: boolean;
  verifiedBusiness: boolean;
  verifiedPayout: boolean;
}

export interface EligibilityRequirements {
  minFollowers: number;
  minWatchMinutes30d: number;
  minAccountAgeDays: number;
  minEngagementRate?: number;
  minContentScore?: number;
}

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
  basicEligibility?: EligibilityRequirements;
  premiumEligibility?: EligibilityRequirements;
  enterpriseEligibility?: EligibilityRequirements;
}

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

export interface EligibilityProduct {
  product: string;
  status: string;
  passedRules: string[];
  failedRules: string[];
  nextActions: string[];
}

export interface Eligibility {
  universalStatus: 'eligible' | 'ineligible' | 'conditional';
  products: EligibilityProduct[];
}

export interface Alert {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface EstimateRequest {
  projectedVolume: number;
  conversionRate: number;
  averageOrderValue: number;
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
  monthlyRevenue: number;
  annualRevenue: number;
  estimatedCpm: number;
  revenueSharePercentage: number;
}

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

export interface AdminData {
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
}

export interface ApplicationRequest {
  businessName: string;
  businessDescription: string;
  website: string;
  country: string;
  documents: string[];
}

export interface BusinessSuiteOverview {
  user: User;
  seshatPage: SeshatPage | null;
  metrics: MonetizationMetrics;
  config: PlatformConfig;
  eligibility: Eligibility;
  revenue: Revenue | null;
  alerts: Alert[];
  estimate: EstimateResponse | null;
  admin: AdminData;
  affiliate: any | null;
  seshat: any | null;
  programs: any[];
}