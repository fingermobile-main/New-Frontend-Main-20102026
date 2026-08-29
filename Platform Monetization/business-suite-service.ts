import { PROGRAM_DEFINITIONS } from './constants.js'
import { calculateEstimates } from './formulas.js'
import { monetizationPolicySections } from './policy.js'
import type {
  EstimateRequest,
  HallmarkPage,
  MonetizationApplication,
  MonetizationMetrics,
  OverviewResponse,
  PlatformConfig,
} from './types.js'
import { repository } from './repository.js'
import { evaluateEligibility } from './eligibility-service.js'

const createId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`

function buildMetrics(
  page: HallmarkPage,
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
    const hallmarkPage = repository.getHallmarkPage()
    const config = repository.getPlatformConfig()
    const metrics = buildMetrics(hallmarkPage, config)
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
      hallmarkPage,
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
    const hallmarkPage = repository.getHallmarkPage()
    const config = repository.getPlatformConfig()
    const metrics = buildMetrics(hallmarkPage, config)
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
  createHallmarkPage(payload: {
    name: string
    description: string
    visibility: HallmarkPage['visibility']
  }) {
    const user = repository.getUser()
    const freeUntil = new Date()
    freeUntil.setFullYear(freeUntil.getFullYear() + 2)
    const createdAt = new Date().toISOString()
    const id = createId('page')

    repository.createHallmarkPage({
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
      action: 'hallmark.created',
      targetType: 'hallmark_page',
      targetId: id,
      metadataJson: JSON.stringify(payload),
      createdAt,
    })

    return repository.getHallmarkPage()
  },
  updateHallmarkPage(payload: {
    id: string
    name: string
    description: string
    visibility: HallmarkPage['visibility']
    billingPlan: HallmarkPage['billingPlan']
  }) {
    repository.updateHallmarkPage(payload)

    return repository.getHallmarkPage()
  },
  submitMonetizationApplication(productKey: MonetizationApplication['productKey']) {
    const page = repository.getHallmarkPage()
    const application: MonetizationApplication = {
      id: createId('application'),
      hallmarkPageId: page.id,
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
      id: current.id,
      minimumAge: updated.minimumAge,
      minimumPayoutThreshold: updated.minimumPayoutThreshold,
      hallmarkMonthlyFee: updated.hallmarkMonthlyFee,
      hallmarkYearlyFee: updated.hallmarkYearlyFee,
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
}
