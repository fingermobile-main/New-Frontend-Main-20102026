import { PROGRAM_DEFINITIONS } from './constants.js'
import { calculateEstimates } from './formulas.js'
import { monetizationPolicySections } from './policy.js'
import type {
  EstimateRequest,
  SeshatPage,
  MonetizationMetrics,
  PlatformConfig,
} from './shared/types.js'
import type {
  OverviewResponse,
  MonetizationApplication,
  KYBRecord,
} from './types.js'
import { repository } from './repository.js'
import { evaluateEligibility } from './eligibility-service.js'
import { guardianAI } from './guardian-ai-service.js'
import { kycService, type KYCSubmissionData, type KYBSubmissionData } from './kyc-verification-service.js'
import { dbService } from './db/database-service.js'

const createId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`

function buildMetrics(
  page: SeshatPage,
  config: PlatformConfig,
): MonetizationMetrics {
  const user = repository.getUser()
  const contentMetrics = repository.getMetrics()
  const payoutAccount = repository.getPayoutAccount()

  return {
    followers: page.followersCount,
    watchMinutes60d: contentMetrics.watchMinutes60d,
    watchMinutes30d: contentMetrics.watchMinutes30d,
    postEngagement30d: contentMetrics.postEngagement30d,
    returningViewers30d: contentMetrics.returningViewers30d,
    uniqueViews30d: contentMetrics.uniqueViews30d,
    activeVideos: contentMetrics.activeVideos,
    consecutiveFollowerDays: contentMetrics.consecutiveFollowerDays,
    accountAgeDays: user.accountAgeDays,
    age: user.age,
    isEligibleCountry: config.supportedCountries.includes(user.countryCode),
    originalContentScore: contentMetrics.originalContentScore,
    policyViolations: contentMetrics.policyViolations,
    giftPurchaseEligible: contentMetrics.giftPurchaseEligible,
    verifiedBusiness: page.verifiedBusiness,
    verifiedPayout: Boolean(payoutAccount?.verified),
  }
}

export const businessSuiteService = {
  getOverview(): OverviewResponse {
    const user = repository.getUser()
    const seshatPage = repository.getSeshatPage()
    const config = repository.getPlatformConfig()
    const metrics = buildMetrics(seshatPage, config)
    const eligibility = evaluateEligibility(metrics, config)
    const revenueLedger = repository.getRevenueLedger()
    const payouts = repository.getPayouts()
    const availableBalance = revenueLedger.reduce(
      (sum, entry) => sum + entry.netAmount,
      0,
    )
    const pendingPayouts = payouts
      .filter((payout) => payout.status !== 'paid')
      .reduce((sum, payout) => sum + payout.amount, 0)

    return {
      user,
      seshatPage,
      metrics,
      config,
      eligibility: {
        universalStatus: eligibility.universalStatus,
        products: eligibility.products,
      },
      revenue: {
        availableBalance: Number(availableBalance.toFixed(2)),
        pendingPayouts: Number(pendingPayouts.toFixed(2)),
        monthRevenue: Number((availableBalance * 0.42).toFixed(2)),
        thresholdRemaining: Math.max(
          0,
          Number((config.minimumPayoutThreshold - availableBalance).toFixed(2)),
        ),
      },
      alerts: eligibility.universalAlerts,
    }
  },
  getPrograms() {
    return PROGRAM_DEFINITIONS
  },
  getEligibility() {
    const seshatPage = repository.getSeshatPage()
    const config = repository.getPlatformConfig()
    const metrics = buildMetrics(seshatPage, config)
    const result = evaluateEligibility(metrics, config)

    return {
      universalStatus: result.universalStatus,
      products: result.products,
      metrics,
      alerts: result.universalAlerts,
    }
  },
  getVerificationStatus() {
    return {
      businessVerification: repository.getBusinessVerification(),
      payoutAccount: repository.getPayoutAccount(),
      policyAcknowledged: true,
    }
  },
  getRevenueSummary() {
    return {
      ledger: repository.getRevenueLedger(),
      payouts: repository.getPayouts(),
      payoutAccount: repository.getPayoutAccount(),
      config: repository.getPlatformConfig(),
    }
  },
  getAffiliateSummary() {
    const partnerEvents = repository.getAffiliateEvents()
    const totalClicks = partnerEvents.reduce((sum, item) => sum + item.clicks, 0)
    const totalConversions = partnerEvents.reduce(
      (sum, item) => sum + item.conversions,
      0,
    )
    const totalCommission = partnerEvents.reduce(
      (sum, item) => sum + item.commissionAmount,
      0,
    )

    return {
      partners: partnerEvents,
      overview: {
        totalClicks,
        totalConversions,
        totalCommission: Number(totalCommission.toFixed(2)),
        conversionRate:
          totalClicks === 0
            ? 0
            : Number(((totalConversions / totalClicks) * 100).toFixed(2)),
      },
    }
  },
  getPolicy() {
    return {
      version: repository.getPlatformConfig().policyVersion,
      sections: monetizationPolicySections,
    }
  },
  getAdminMonitoring() {
    return {
      config: repository.getPlatformConfig(),
      auditLogs: repository.getAuditLogs(),
      webhooks: repository.getWebhookEvents(),
      applications: repository.getApplications(),
    }
  },
  createSeshatPage(payload: {
    name: string
    description: string
    visibility: SeshatPage['visibility']
  }) {
    const user = repository.getUser()
    const freeUntil = new Date()
    freeUntil.setFullYear(freeUntil.getFullYear() + 2)
    const createdAt = new Date().toISOString()
    const id = createId('page')

    repository.createSeshatPage({
      id,
      ownerUserId: user.id,
      name: payload.name,
      description: payload.description,
      visibility: payload.visibility,
      freeUntil: freeUntil.toISOString(),
      createdAt,
    })

    repository.addAuditLog({
      id: createId('audit'),
      actorId: user.id,
      action: 'seshat.created',
      targetType: 'seshat_page',
      targetId: id,
      metadataJson: JSON.stringify(payload),
      createdAt,
    })

    return repository.getSeshatPage()
  },
  updateSeshatPage(payload: {
    id: string
    name: string
    description: string
    visibility: SeshatPage['visibility']
    billingPlan: SeshatPage['billingPlan']
  }) {
    repository.updateSeshatPage(payload)

    return repository.getSeshatPage()
  },
  submitMonetizationApplication(productKey: MonetizationApplication['productKey']) {
    const page = repository.getSeshatPage()
    const application: MonetizationApplication = {
      id: createId('application'),
      seshatPageId: page.id,
      productKey,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      decisionNotes: 'Queued for compliance and payout review.',
    }

    repository.addApplication(application)

    return application
  },
  updateBusinessVerification(payload: {
    legalName: string
    registrationNumber: string
    countryCode: string
  }) {
    const user = repository.getUser()
    repository.updateBusinessVerification({
      id: 'verification_default',
      userId: user.id,
      legalName: payload.legalName,
      registrationNumber: payload.registrationNumber,
      countryCode: payload.countryCode,
      reviewStatus: 'pending',
      submittedAt: new Date().toISOString(),
    })

    return repository.getBusinessVerification()
  },
  updatePayoutAccount(payload: {
    bankName: string
    accountLast4: string
    currency: string
  }) {
    const user = repository.getUser()
    repository.updatePayoutAccount({
      id: 'payout_default',
      userId: user.id,
      bankName: payload.bankName,
      accountLast4: payload.accountLast4,
      currency: payload.currency,
      verified: 1,
      createdAt: new Date().toISOString(),
    })

    return repository.getPayoutAccount()
  },
  updateConfig(payload: Partial<PlatformConfig>) {
    const current = repository.getPlatformConfig()
    const updated = {
      ...current,
      ...payload,
    }

    repository.updateConfig({
      id: current.id ?? 'platform_default',
      minimumAge: updated.minimumAge,
      minimumPayoutThreshold: updated.minimumPayoutThreshold,
      seshatMonthlyFee: updated.seshatMonthlyFee,
      seshatYearlyFee: updated.seshatYearlyFee,
      revenueSharePercentage: updated.revenueSharePercentage,
      giftsCashValue: updated.giftsCashValue,
      supportedCountriesJson: JSON.stringify(updated.supportedCountries),
      policyVersion: updated.policyVersion,
      affiliateBonusPercentage: updated.affiliateBonusPercentage,
      updatedAt: new Date().toISOString(),
    })

    return repository.getPlatformConfig()
  },
  trackWebhook(eventType: string, payload: unknown) {
    const webhook = {
      id: createId('webhook'),
      eventType,
      payloadJson: JSON.stringify(payload),
      status: 'received' as const,
      receivedAt: new Date().toISOString(),
    }

    repository.addWebhookEvent(webhook)

    return webhook
  },
  estimateRevenue(payload: EstimateRequest) {
    return calculateEstimates(payload)
  },

  // ============================================================
  // NEW METHODS - Week 1 Implementation
  // ============================================================

  // Guardian AI Services
  async generateAccessKey(seshatPageId: string, keyType: 'FOLLOWERSHIP' | 'MEMBERSHIP', expiryDays?: number) {
    return await guardianAI.createAccessKey(seshatPageId, keyType, expiryDays);
  },

  async generateCoupon(seshatPageId: string, prefix?: string) {
    return await guardianAI.createCoupon(seshatPageId, prefix);
  },

  validateBusinessName(name: string) {
    return guardianAI.validateName(name);
  },

  generateBiometricHash(faceData: string | Buffer) {
    return guardianAI.generateBiometricHash(faceData);
  },

  // KYC/KYB Verification
  async submitKYC(data: KYCSubmissionData) {
    return await kycService.submitKYC(data);
  },

  async getKYCStatus(userId: string) {
    return await kycService.getKYCStatus(userId);
  },

  async submitKYB(data: KYBSubmissionData) {
    return await kycService.submitKYB(data);
  },

  async getKYBStatus(_userId: string): Promise<{
    status: string;
    kybRecord?: KYBRecord | null;
  }> {
    return await dbService.getKYBStatus(_userId);
  },

  // Admin KYC/KYB Management (Database operations - NOW IMPLEMENTED)
  async approveKYC(kycId: string, reviewerId: string, notes?: string) {
    return await dbService.approveKYC(kycId, reviewerId, notes);
  },

  async rejectKYC(kycId: string, reviewerId: string, reason: string) {
    return await dbService.rejectKYC(kycId, reviewerId, reason);
  },

  async approveKYB(kybId: string, reviewerId: string, notes?: string) {
    return await dbService.approveKYB(kybId, reviewerId, notes);
  },

  async rejectKYB(kybId: string, reviewerId: string, reason: string) {
    return await dbService.rejectKYB(kybId, reviewerId, reason);
  },

  // Access Key Management (Database operations - NOW IMPLEMENTED)
  async getAccessKeys(seshatPageId: string) {
    return await dbService.getAccessKeys(seshatPageId);
  },

  async createAccessKeyRecord(seshatPageId: string, keyType: string, expiryDays?: number) {
    return await dbService.createAccessKeyRecord(seshatPageId, keyType, expiryDays);
  },

  async revokeAccessKey(id: string) {
    return await dbService.revokeAccessKey(id);
  },

  // Coupon Management (Database operations - NOW IMPLEMENTED)
  async getCoupons(seshatPageId: string) {
    return await dbService.getCoupons(seshatPageId);
  },

  async createCouponRecord(data: {
    seshatPageId: string;
    couponCode?: string;
    prefix?: string;
    description?: string;
    discountPercentage?: number;
    discountAmount?: number;
    minPurchaseAmount?: number;
    maxUses?: number;
    validUntil?: string;
  }) {
    return await dbService.createCouponRecord(data);
  },

  async redeemCoupon(code: string, userId: string) {
    return await dbService.redeemCoupon(code, userId);
  },
}
