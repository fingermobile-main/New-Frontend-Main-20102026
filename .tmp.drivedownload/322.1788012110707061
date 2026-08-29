import type { EstimateRequest, EstimateResponse } from './types'

const safeDivide = (value: number, divisor: number): number => {
  if (!divisor) {
    return 0
  }

  return value / divisor
}

const round = (value: number): number => Number(value.toFixed(2))

export function calculateEstimates(input: EstimateRequest): EstimateResponse {
  const totalEarnings = safeDivide(input.qualifyingViews, 1000) * input.rpm
  const totalAdCost = safeDivide(input.impressions, 1000) * input.cpm
  const creatorRevenueShare =
    input.grossAdRevenue * input.revenueSharePercentage
  const cpcRevenue = input.totalClicks * input.cpc
  const ctr = safeDivide(input.totalClicks, input.impressions) * 100
  const averageOrderValue = safeDivide(
    input.totalRevenueGenerated,
    input.totalOrders,
  )
  const roi =
    safeDivide(
      input.totalRevenueGenerated - input.totalProductionCosts,
      input.totalProductionCosts,
    ) * 100
  const clickToViewRatio =
    safeDivide(input.productLinkClicks, input.totalViews) * 100
  const salesConversionRate =
    safeDivide(input.contentPurchases, input.productLinkClicks) * 100
  const viewToPurchaseRate =
    safeDivide(input.contentPurchases, input.totalViews) * 100
  const averageViewDuration = safeDivide(
    input.totalWatchTimeMinutes,
    input.totalViews,
  )
  const retentionRate =
    safeDivide(averageViewDuration, input.totalVideoLengthMinutes) * 100

  return {
    totalEarnings: round(totalEarnings),
    totalAdCost: round(totalAdCost),
    creatorRevenueShare: round(creatorRevenueShare),
    cpcRevenue: round(cpcRevenue),
    ctr: round(ctr),
    averageOrderValue: round(averageOrderValue),
    roi: round(roi),
    clickToViewRatio: round(clickToViewRatio),
    salesConversionRate: round(salesConversionRate),
    viewToPurchaseRate: round(viewToPurchaseRate),
    averageViewDuration: round(averageViewDuration),
    retentionRate: round(retentionRate),
  }
}
