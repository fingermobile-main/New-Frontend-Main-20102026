import { MonetizationMetrics, PlatformConfig, Eligibility } from './shared/types';

export class EligibilityService {
  async checkEligibility(metrics: MonetizationMetrics, config: PlatformConfig): Promise<Eligibility> {
    const issues: string[] = [];

    // Check account age with undefined check
    if (metrics.accountAgeDays !== undefined && metrics.accountAgeDays < 30) {
      issues.push(`Account must be at least 30 days old. Current age: ${metrics.accountAgeDays} days`);
    }

    // Check user base with undefined check
    if (config.minimumUserBase !== undefined && metrics.userBase !== undefined && metrics.userBase < config.minimumUserBase) {
      issues.push(`Minimum user base of ${config.minimumUserBase} required. Current: ${metrics.userBase}`);
    }

    // Check revenue threshold if defined in config
    if (config.minimumPayoutThreshold !== undefined && metrics.revenuePotential !== undefined && metrics.revenuePotential < config.minimumPayoutThreshold) {
      issues.push(`Minimum revenue potential of $${config.minimumPayoutThreshold} required. Current: $${metrics.revenuePotential}`);
    }

    // Check content metrics if defined
    if (metrics.contentVolume !== undefined && metrics.contentVolume < 5) {  // Using a reasonable default
      issues.push(`Minimum 5 pieces of content required. Current: ${metrics.contentVolume}`);
    }

    // Check engagement metrics if defined
    if (metrics.engagementRate !== undefined && metrics.engagementRate < 1) {  // Using a reasonable default
      issues.push(`Minimum engagement rate of 1% required. Current: ${metrics.engagementRate}%`);
    }

    return {
      universalStatus: issues.length === 0 ? 'eligible' : 'ineligible',
      products: {}, // Placeholder for product eligibility
      metrics: metrics,
      alerts: issues
    };
  }

  async calculateRiskScore(metrics: MonetizationMetrics): Promise<number> {
    let riskScore = 50; // Base risk score

    // Adjust risk based on various factors
    if (metrics.accountAgeDays !== undefined && metrics.accountAgeDays < 90) {
      riskScore += 20; // Higher risk for newer accounts
    }

    if (metrics.contentVolume !== undefined && metrics.contentVolume < 10) {
      riskScore += 15; // Higher risk for low content count
    }

    if (metrics.engagementRate !== undefined && metrics.engagementRate < 2) {
      riskScore += 10; // Higher risk for low engagement
    }

    // Cap the risk score between 0 and 100
    return Math.min(100, Math.max(0, riskScore));
  }

  async generateAlerts(metrics: MonetizationMetrics, config: PlatformConfig): Promise<string[]> {
    const alerts: string[] = [];

    // Check account age with undefined check
    if (metrics.accountAgeDays !== undefined && metrics.accountAgeDays < 30) {
      alerts.push(`Account is new (${metrics.accountAgeDays} days old). Monitor closely.`);
    }

    // Check user base with undefined check
    if (config.minimumUserBase !== undefined && metrics.userBase < config.minimumUserBase * 0.5) {
      alerts.push(`User base is critically low (${metrics.userBase}). Engagement may be impacted.`);
    }

    // Check engagement rate if defined
    if (metrics.engagementRate !== undefined && metrics.engagementRate < 1) {
      alerts.push(`Engagement rate is low (${metrics.engagementRate}%). Consider optimizing content.`);
    }

    // Check content volume if defined
    if (metrics.contentVolume !== undefined && metrics.contentVolume < 5) {
      alerts.push(`Content volume is low (${metrics.contentVolume}). Consider increasing publishing frequency.`);
    }

    return alerts;
  }
}

// Export a singleton instance
export const eligibilityService = new EligibilityService();