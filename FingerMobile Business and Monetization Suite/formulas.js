"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEstimates = calculateEstimates;
const safeDivide = (value, divisor) => {
    if (!divisor) {
        return 0;
    }
    return value / divisor;
};
const round = (value) => Number(value.toFixed(2));
function calculateEstimates(input) {
    const qualifyingViews = input.qualifyingViews ?? 0;
    const rpm = input.rpm ?? 0;
    const impressions = input.impressions ?? 0;
    const cpm = input.cpm ?? 0;
    const grossAdRevenue = input.grossAdRevenue ?? 0;
    const revenueSharePercentage = input.revenueSharePercentage ?? 0;
    const totalClicks = input.totalClicks ?? 0;
    const cpc = input.cpc ?? 0;
    const totalRevenueGenerated = input.totalRevenueGenerated ?? 0;
    const totalOrders = input.totalOrders ?? 0;
    const totalProductionCosts = input.totalProductionCosts ?? 0;
    const productLinkClicks = input.productLinkClicks ?? 0;
    const contentPurchases = input.contentPurchases ?? 0;
    const totalViews = input.totalViews ?? 0;
    const totalWatchTimeMinutes = input.totalWatchTimeMinutes ?? 0;
    const totalVideoLengthMinutes = input.totalVideoLengthMinutes ?? 0;
    const totalEarnings = safeDivide(qualifyingViews, 1000) * rpm;
    const totalAdCost = safeDivide(impressions, 1000) * cpm;
    const creatorRevenueShare = grossAdRevenue * revenueSharePercentage;
    const cpcRevenue = totalClicks * cpc;
    const ctr = safeDivide(totalClicks, impressions) * 100;
    const averageOrderValue = safeDivide(totalRevenueGenerated, totalOrders);
    const roi = safeDivide(totalRevenueGenerated - totalProductionCosts, totalProductionCosts) * 100;
    const clickToViewRatio = safeDivide(productLinkClicks, totalViews) * 100;
    const salesConversionRate = safeDivide(contentPurchases, productLinkClicks) * 100;
    const viewToPurchaseRate = safeDivide(contentPurchases, totalViews) * 100;
    const averageViewDuration = safeDivide(totalWatchTimeMinutes, totalViews);
    const retentionRate = safeDivide(averageViewDuration, totalVideoLengthMinutes) * 100;
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
    };
}
