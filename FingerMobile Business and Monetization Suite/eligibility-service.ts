import type { MonetizationMetrics, PlatformConfig } from './shared/types.js';

interface EligibilityResult {
  universalStatus: 'ineligible' | 'eligible' | 'conditional';
  products: Record<string, {
    eligible: boolean;
    status: 'ineligible' | 'eligible' | 'conditional';
    reasons: string[];
  }>;
  universalAlerts: string[];
}

export function evaluateEligibility(metrics: MonetizationMetrics, config: PlatformConfig): EligibilityResult {
  // Determine universal eligibility
  let universalStatus: 'ineligible' | 'eligible' | 'conditional' = 'eligible';
  const universalAlerts: string[] = [];

  if (metrics.accountAgeDays < 30) {
    universalStatus = 'ineligible';
    universalAlerts.push('Account must be at least 30 days old');
  }

  if (metrics.age && metrics.age < config.minimumAge) {
    universalStatus = 'ineligible';
    universalAlerts.push(`Must be at least ${config.minimumAge} years old`);
  }

  if (!metrics.isEligibleCountry) {
    universalStatus = 'ineligible';
    universalAlerts.push('Account country is not supported for monetization');
  }

  if (metrics.policyViolations > 5) {
    universalStatus = 'ineligible';
    universalAlerts.push('Too many policy violations');
  }

  // Determine product-specific eligibility
  const products = {
    basic: {
      eligible: universalStatus !== 'ineligible' && metrics.followers >= 100,
      status: universalStatus !== 'ineligible' && metrics.followers >= 100 ? 'eligible' : 'ineligible',
      reasons: universalStatus === 'ineligible' ? universalAlerts : metrics.followers < 100 ? ['Need at least 100 followers'] : [],
    },
    premium: {
      eligible: universalStatus !== 'ineligible' && metrics.followers >= 1000 && metrics.originalContentScore >= 0.7,
      status: universalStatus !== 'ineligible' && metrics.followers >= 1000 && metrics.originalContentScore >= 0.7 ? 'eligible' : 'ineligible',
      reasons: universalStatus === 'ineligible' 
        ? universalAlerts 
        : metrics.followers < 1000 || metrics.originalContentScore < 0.7 
          ? ['Need at least 1,000 followers', 'Content score must be 0.7 or higher'] 
          : [],
    },
    enterprise: {
      eligible: universalStatus !== 'ineligible' && metrics.followers >= 10000 && metrics.originalContentScore >= 0.85,
      status: universalStatus !== 'ineligible' && metrics.followers >= 10000 && metrics.originalContentScore >= 0.85 ? 'eligible' : 'ineligible',
      reasons: universalStatus === 'ineligible' 
        ? universalAlerts 
        : metrics.followers < 10000 || metrics.originalContentScore < 0.85 
          ? ['Need at least 10,000 followers', 'Content score must be 0.85 or higher'] 
          : [],
    },
  };

  return {
    universalStatus,
    products,
    universalAlerts,
  };
}

// Define MonetizationMetrics interface since it's used but not in shared/types.ts
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