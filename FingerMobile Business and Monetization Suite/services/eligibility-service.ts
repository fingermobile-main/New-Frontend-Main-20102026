import { MonetizationMetrics, PlatformConfig, Eligibility } from '../shared/types';

export const checkEligibility = async (_userId: string, metrics: MonetizationMetrics, config: PlatformConfig): Promise<Eligibility> => {
  // Check basic eligibility
  const basicEligibility = checkBasicEligibility(metrics, config);
  const premiumEligibility = checkPremiumEligibility(metrics, config);
  const enterpriseEligibility = checkEnterpriseEligibility(metrics, config);

  return {
    universalStatus: determineUniversalStatus([basicEligibility, premiumEligibility, enterpriseEligibility]),
    products: {
      basic: basicEligibility,
      premium: premiumEligibility,
      enterprise: enterpriseEligibility,
    },
    metrics,
    alerts: generateAlerts(metrics, config),
  };
};

const checkBasicEligibility = (
  metrics: MonetizationMetrics,
  config: PlatformConfig
): { eligible: boolean; status: 'ineligible' | 'eligible' | 'conditional'; reasons: string[] } => {
  const basicConfig = config.basicEligibility || {
    minFollowers: 100,
    minWatchMinutes30d: 500,
    minAccountAgeDays: 7,
  };
  
  const nextActions: string[] = [];

  if (metrics.followers !== undefined && metrics.followers < basicConfig.minFollowers) {
    nextActions.push(`Gain ${basicConfig.minFollowers - metrics.followers} more followers`);
  }

  if (metrics.watchMinutes30d !== undefined && metrics.watchMinutes30d < basicConfig.minWatchMinutes30d) {
    nextActions.push(`Increase watch time by ${basicConfig.minWatchMinutes30d - metrics.watchMinutes30d} minutes`);
  }

  if (metrics.accountAgeDays !== undefined && metrics.accountAgeDays < basicConfig.minAccountAgeDays) {
    nextActions.push(`Wait ${basicConfig.minAccountAgeDays - metrics.accountAgeDays} more days`);
  }

  if (metrics.policyViolations !== undefined && metrics.policyViolations > 0) {
    nextActions.push('Resolve policy violations');
  }

  return {
    eligible: nextActions.length === 0,
    status: nextActions.length === 0 ? 'eligible' : 'conditional',
    reasons: nextActions,
  };
};

const checkPremiumEligibility = (
  metrics: MonetizationMetrics,
  config: PlatformConfig
): { eligible: boolean; status: 'ineligible' | 'eligible' | 'conditional'; reasons: string[] } => {
  const premiumConfig = config.premiumEligibility || {
    minFollowers: 1000,
    minWatchMinutes30d: 5000,
    minAccountAgeDays: 30,
    minEngagementRate: 3,
  };

  const nextActions: string[] = [];

  if (metrics.followers !== undefined && metrics.followers < premiumConfig.minFollowers) {
    nextActions.push(`Gain ${premiumConfig.minFollowers - metrics.followers} more followers`);
  }

  if (metrics.watchMinutes30d !== undefined && metrics.watchMinutes30d < premiumConfig.minWatchMinutes30d) {
    nextActions.push(`Increase watch time by ${premiumConfig.minWatchMinutes30d - metrics.watchMinutes30d} minutes`);
  }

  if (metrics.accountAgeDays !== undefined && metrics.accountAgeDays < premiumConfig.minAccountAgeDays) {
    nextActions.push(`Wait ${premiumConfig.minAccountAgeDays - metrics.accountAgeDays} more days`);
  }

  if (metrics.postEngagement30d !== undefined && metrics.postEngagement30d < (premiumConfig.minEngagementRate || 3)) {
    nextActions.push(`Improve engagement rate by ${((premiumConfig.minEngagementRate || 3) - metrics.postEngagement30d).toFixed(1)}%`);
  }

  return {
    eligible: nextActions.length === 0,
    status: nextActions.length === 0 ? 'eligible' : 'conditional',
    reasons: nextActions,
  };
};

const checkEnterpriseEligibility = (
  metrics: MonetizationMetrics,
  config: PlatformConfig
): { eligible: boolean; status: 'ineligible' | 'eligible' | 'conditional'; reasons: string[] } => {
  const enterpriseConfig = config.enterpriseEligibility || {
    minFollowers: 10000,
    minWatchMinutes30d: 50000,
    minAccountAgeDays: 90,
    minEngagementRate: 5,
    minContentScore: 80,
  };

  const nextActions: string[] = [];

  if (metrics.followers !== undefined && metrics.followers < enterpriseConfig.minFollowers) {
    nextActions.push(`Gain ${enterpriseConfig.minFollowers - metrics.followers} more followers`);
  }

  if (metrics.watchMinutes30d !== undefined && metrics.watchMinutes30d < enterpriseConfig.minWatchMinutes30d) {
    nextActions.push(`Increase watch time by ${enterpriseConfig.minWatchMinutes30d - metrics.watchMinutes30d} minutes`);
  }

  if (metrics.accountAgeDays !== undefined && metrics.accountAgeDays < enterpriseConfig.minAccountAgeDays) {
    nextActions.push(`Wait ${enterpriseConfig.minAccountAgeDays - metrics.accountAgeDays} more days`);
  }

  if (metrics.postEngagement30d !== undefined && metrics.postEngagement30d < (enterpriseConfig.minEngagementRate || 5)) {
    nextActions.push(`Improve engagement rate by ${((enterpriseConfig.minEngagementRate || 5) - metrics.postEngagement30d).toFixed(1)}%`);
  }

  if (metrics.originalContentScore !== undefined && metrics.originalContentScore < (enterpriseConfig.minContentScore || 80)) {
    nextActions.push(`Improve content score by ${(enterpriseConfig.minContentScore || 80) - metrics.originalContentScore}`);
  }

  return {
    eligible: nextActions.length === 0,
    status: nextActions.length === 0 ? 'eligible' : 'conditional',
    reasons: nextActions,
  };
};

const determineUniversalStatus = (eligibilities: { eligible: boolean }[]): 'ineligible' | 'eligible' | 'conditional' => {
  if (eligibilities.some(el => el.eligible)) {
    return 'eligible';
  } else if (eligibilities.some(el => el.eligible === false)) {
    return 'conditional';
  } else {
    return 'ineligible';
  }
};

const generateAlerts = (metrics: MonetizationMetrics, _config: PlatformConfig): string[] => {
  void _config;
  const alerts: string[] = [];
  
  if (metrics.riskFactors && metrics.riskFactors.length > 0) {
    alerts.push(...metrics.riskFactors);
  }
  
  return alerts;
};

export const getRecommendations = async (
  _userId: string,
  metrics: MonetizationMetrics,
  config: PlatformConfig
): Promise<{ basic: string[]; premium: string[]; enterprise: string[] }> => {
  const basicConfig = config.basicEligibility || {
    minFollowers: 100,
    minWatchMinutes30d: 500,
    minAccountAgeDays: 7,
  };

  const premiumConfig = config.premiumEligibility || {
    minFollowers: 1000,
    minWatchMinutes30d: 5000,
    minAccountAgeDays: 30,
    minEngagementRate: 3,
  };

  const enterpriseConfig = config.enterpriseEligibility || {
    minFollowers: 10000,
    minWatchMinutes30d: 50000,
    minAccountAgeDays: 90,
    minEngagementRate: 5,
    minContentScore: 80,
  };

  const basicRecommendations: string[] = [];
  const premiumRecommendations: string[] = [];
  const enterpriseRecommendations: string[] = [];

  // Basic recommendations
  if (metrics.followers !== undefined && metrics.followers < basicConfig.minFollowers) {
    basicRecommendations.push(`Gain ${basicConfig.minFollowers - metrics.followers} more followers`);
  }

  if (metrics.watchMinutes30d !== undefined && metrics.watchMinutes30d < basicConfig.minWatchMinutes30d) {
    basicRecommendations.push(`Increase watch time by ${basicConfig.minWatchMinutes30d - metrics.watchMinutes30d} minutes`);
  }

  if (metrics.accountAgeDays !== undefined && metrics.accountAgeDays < basicConfig.minAccountAgeDays) {
    basicRecommendations.push(`Maintain account for ${basicConfig.minAccountAgeDays - metrics.accountAgeDays} more days`);
  }

  // Premium recommendations
  if (metrics.followers !== undefined && metrics.followers < premiumConfig.minFollowers) {
    premiumRecommendations.push(`Gain ${premiumConfig.minFollowers - metrics.followers} more followers`);
  }

  if (metrics.watchMinutes30d !== undefined && metrics.watchMinutes30d < premiumConfig.minWatchMinutes30d) {
    premiumRecommendations.push(`Increase watch time by ${premiumConfig.minWatchMinutes30d - metrics.watchMinutes30d} minutes`);
  }

  if (metrics.accountAgeDays !== undefined && metrics.accountAgeDays < premiumConfig.minAccountAgeDays) {
    premiumRecommendations.push(`Maintain account for ${premiumConfig.minAccountAgeDays - metrics.accountAgeDays} more days`);
  }

  if (metrics.postEngagement30d !== undefined && metrics.postEngagement30d < (premiumConfig.minEngagementRate || 3)) {
    premiumRecommendations.push(`Improve engagement rate by ${((premiumConfig.minEngagementRate || 3) - metrics.postEngagement30d).toFixed(1)}%`);
  }

  // Enterprise recommendations
  if (metrics.followers !== undefined && metrics.followers < enterpriseConfig.minFollowers) {
    enterpriseRecommendations.push(`Gain ${enterpriseConfig.minFollowers - metrics.followers} more followers`);
  }

  if (metrics.watchMinutes30d !== undefined && metrics.watchMinutes30d < enterpriseConfig.minWatchMinutes30d) {
    enterpriseRecommendations.push(`Increase watch time by ${enterpriseConfig.minWatchMinutes30d - metrics.watchMinutes30d} minutes`);
  }

  if (metrics.accountAgeDays !== undefined && metrics.accountAgeDays < enterpriseConfig.minAccountAgeDays) {
    enterpriseRecommendations.push(`Maintain account for ${enterpriseConfig.minAccountAgeDays - metrics.accountAgeDays} more days`);
  }

  if (metrics.postEngagement30d !== undefined && metrics.postEngagement30d < (enterpriseConfig.minEngagementRate || 5)) {
    enterpriseRecommendations.push(`Improve engagement rate by ${((enterpriseConfig.minEngagementRate || 5) - metrics.postEngagement30d).toFixed(1)}%`);
  }

  if (metrics.originalContentScore !== undefined && metrics.originalContentScore < (enterpriseConfig.minContentScore || 80)) {
    enterpriseRecommendations.push(`Improve content score by ${(enterpriseConfig.minContentScore || 80) - metrics.originalContentScore}`);
  }

  return {
    basic: basicRecommendations,
    premium: premiumRecommendations,
    enterprise: enterpriseRecommendations,
  };
};

export default {
  checkEligibility,
  getRecommendations
};