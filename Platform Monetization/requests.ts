import type { EstimateRequest, HallmarkPage, PlatformConfig, ProductKey } from './types.js'

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value.trim() : fallback

const asNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function parseHallmarkPayload(body: unknown) {
  const payload = body as Record<string, unknown>

  return {
    name: asString(payload?.name, 'Untitled HallMarks Page'),
    description: asString(payload?.description, 'Creator page'),
    visibility: (asString(payload?.visibility, 'private') ||
      'private') as HallmarkPage['visibility'],
    billingPlan: (asString(payload?.billingPlan, 'free_trial') ||
      'free_trial') as HallmarkPage['billingPlan'],
  }
}

export function parseApplicationPayload(body: unknown): ProductKey {
  const payload = body as Record<string, unknown>
  return (asString(payload?.productKey, 'in_stream_ads') ||
    'in_stream_ads') as ProductKey
}

export function parseBusinessVerificationPayload(body: unknown) {
  const payload = body as Record<string, unknown>

  return {
    legalName: asString(payload?.legalName, 'Unknown Business'),
    registrationNumber: asString(payload?.registrationNumber, 'PENDING'),
    countryCode: asString(payload?.countryCode, 'US'),
  }
}

export function parsePayoutPayload(body: unknown) {
  const payload = body as Record<string, unknown>

  return {
    bankName: asString(payload?.bankName, 'FingerMobile Treasury'),
    accountLast4: asString(payload?.accountLast4, '0000').slice(-4),
    currency: asString(payload?.currency, 'USD'),
  }
}

export function parseEstimatePayload(body: unknown): EstimateRequest {
  const payload = body as Record<string, unknown>

  return {
    qualifyingViews: asNumber(payload?.qualifyingViews, 500000),
    rpm: asNumber(payload?.rpm, 2.5),
    impressions: asNumber(payload?.impressions, 120000),
    cpm: asNumber(payload?.cpm, 8),
    grossAdRevenue: asNumber(payload?.grossAdRevenue, 2200),
    revenueSharePercentage: asNumber(payload?.revenueSharePercentage, 0.55),
    totalClicks: asNumber(payload?.totalClicks, 6000),
    cpc: asNumber(payload?.cpc, 0.75),
    totalRevenueGenerated: asNumber(payload?.totalRevenueGenerated, 12000),
    totalOrders: asNumber(payload?.totalOrders, 180),
    totalProductionCosts: asNumber(payload?.totalProductionCosts, 2400),
    productLinkClicks: asNumber(payload?.productLinkClicks, 3400),
    contentPurchases: asNumber(payload?.contentPurchases, 260),
    totalViews: asNumber(payload?.totalViews, 540000),
    totalWatchTimeMinutes: asNumber(payload?.totalWatchTimeMinutes, 890000),
    totalVideoLengthMinutes: asNumber(payload?.totalVideoLengthMinutes, 8),
  }
}

export function parseConfigPayload(body: unknown): Partial<PlatformConfig> {
  const payload = body as Record<string, unknown>

  return {
    minimumAge: asNumber(payload?.minimumAge, 22),
    minimumPayoutThreshold: asNumber(payload?.minimumPayoutThreshold, 100),
    hallmarkMonthlyFee: asNumber(payload?.hallmarkMonthlyFee, 24.99),
    hallmarkYearlyFee: asNumber(payload?.hallmarkYearlyFee, 249.99),
    revenueSharePercentage: asNumber(payload?.revenueSharePercentage, 0.55),
    giftsCashValue: asNumber(payload?.giftsCashValue, 0.01),
    supportedCountries: Array.isArray(payload?.supportedCountries)
      ? payload.supportedCountries.map((value) => asString(value)).filter(Boolean)
      : ['US', 'GB', 'CA'],
    policyVersion: asString(payload?.policyVersion, '2026.07'),
    affiliateBonusPercentage: asNumber(payload?.affiliateBonusPercentage, 0.01),
  }
}
