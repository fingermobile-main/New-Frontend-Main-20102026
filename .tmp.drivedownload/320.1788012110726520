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

export interface PlatformConfig {
  id: string
  minimumAge: number
  minimumPayoutThreshold: number
  hallmarkMonthlyFee: number
  hallmarkYearlyFee: number
  revenueSharePercentage: number
  giftsCashValue: number
  supportedCountries: string[]
  policyVersion: string
  affiliateBonusPercentage: number
}

export interface User {
  id: string
  fullName: string
  email: string
  role: UserRole
  age: number
  countryCode: string
  accountAgeDays: number
  createdAt: string
}

export interface HallmarkPage {
  id: string
  ownerUserId: string
  name: string
  description: string
  followersCount: number
  visibility: 'private' | 'public'
  freeUntil: string
  billingPlan: 'free_trial' | 'monthly' | 'yearly'
  verifiedBusiness: boolean
  createdAt: string
}

export interface ContentMetrics {
  id: string
  hallmarkPageId: string
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

export interface BusinessVerification {
  id: string
  userId: string
  legalName: string
  registrationNumber: string
  countryCode: string
  reviewStatus: 'pending' | 'approved' | 'rejected'
  submittedAt: string
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

export interface RevenueLedgerEntry {
  id: string
  hallmarkPageId: string
  productKey: ProductKey
  grossAmount: number
  platformFee: number
  reserveAmount: number
  taxAmount: number
  netAmount: number
  settlementStatus: 'scheduled' | 'held' | 'paid'
  occurredAt: string
}

export interface Payout {
  id: string
  hallmarkPageId: string
  payoutAccountId: string
  amount: number
  status: 'pending' | 'scheduled' | 'paid' | 'held'
  scheduledFor: string
  paidAt: string | null
  holdReason: string
}

export interface MonetizationApplication {
  id: string
  hallmarkPageId: string
  productKey: ProductKey
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  submittedAt: string
  decisionNotes: string
}

export interface AffiliateEvent {
  id: string
  hallmarkPageId: string
  partnerName: string
  clicks: number
  conversions: number
  commissionAmount: number
  attributionWindowDays: number
  recordedAt: string
}

export interface AuditLog {
  id: string
  actorId: string
  action: string
  targetType: string
  targetId: string
  metadataJson: string
  createdAt: string
}

export interface WebhookEvent {
  id: string
  eventType: string
  payloadJson: string
  status: 'received' | 'processed' | 'failed'
  receivedAt: string
}

export interface PolicyAcknowledgement {
  id: string
  userId: string
  policyKey: string
  policyVersion: string
  acceptedAt: string
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

export interface EligibilityResult {
  product: ProductKey
  status: EligibilityStatus
  passedRules: string[]
  failedRules: string[]
  nextActions: string[]
}

export interface ProgramDefinition {
  key: ProductKey
  title: string
  summary: string
  requirements: string[]
}

export interface EstimateRequest {
  qualifyingViews: number
  rpm: number
  impressions: number
  cpm: number
  grossAdRevenue: number
  revenueSharePercentage: number
  totalClicks: number
  cpc: number
  totalRevenueGenerated: number
  totalOrders: number
  totalProductionCosts: number
  productLinkClicks: number
  contentPurchases: number
  totalViews: number
  totalWatchTimeMinutes: number
  totalVideoLengthMinutes: number
}

export interface EstimateResponse {
  totalEarnings: number
  totalAdCost: number
  creatorRevenueShare: number
  cpcRevenue: number
  ctr: number
  averageOrderValue: number
  roi: number
  clickToViewRatio: number
  salesConversionRate: number
  viewToPurchaseRate: number
  averageViewDuration: number
  retentionRate: number
}

export interface OverviewResponse {
  user: User
  hallmarkPage: HallmarkPage
  metrics: MonetizationMetrics
  config: PlatformConfig
  eligibility: {
    universalStatus: EligibilityStatus
    products: EligibilityResult[]
  }
  revenue: {
    availableBalance: number
    pendingPayouts: number
    monthRevenue: number
    thresholdRemaining: number
  }
  alerts: string[]
}
