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
  description: string;
  followersCount: number;
  visibility: string;
  freeUntil: string;
  billingPlan: string;
  verifiedBusiness: boolean;
  createdAt: string;
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

export interface BusinessSuiteConfig {
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

export interface Revenue {
  availableBalance: number;
  pendingPayouts: number;
  monthRevenue: number;
  thresholdRemaining: number;
}

export interface Alert {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface BusinessSuiteOverview {
  user: User;
  seshatPage: SeshatPage;
  metrics: Metrics;
  config: BusinessSuiteConfig;
  eligibility: Eligibility;
  revenue: Revenue;
  alerts: Alert[];
}

export interface Program {
  key: string;
  title: string;
  summary: string;
  requirements: string[];
}