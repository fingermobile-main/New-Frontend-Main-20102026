import { MonetizationMetrics, PlatformConfig, Eligibility, EligibilityProduct } from '../shared/types';

/**
 * Gets the eligibility status for a user
 * @param userId - The ID of the user to check
 * @returns A promise that resolves to the user's eligibility status
 */
export const getEligibility = async (userId: string): Promise<Eligibility> => {
  // In a real implementation, this would fetch user metrics from a database or API
  const userMetrics = await fetchUserMetrics(userId);
  
  // Get platform configuration
  const platformConfig = await getPlatformConfig();
  
  // Check eligibility for different programs
  const basicResult = checkBasicEligibility(userMetrics, platformConfig);
  const premiumResult = checkPremiumEligibility(userMetrics, platformConfig);
  const enterpriseResult = checkEnterpriseEligibility(userMetrics, platformConfig);

  // Determine overall status
  let universalStatus: 'eligible' | 'ineligible' | 'conditional' = 'ineligible';
  if (enterpriseResult.status === 'eligible') {
    universalStatus = 'eligible';
  } else if (basicResult.status === 'eligible' || premiumResult.status === 'eligible') {
    universalStatus = 'conditional';
  }

  // Create eligibility result
  const result: Eligibility = {
    universalStatus,
    products: [
      {
        product: 'basic',
        status: basicResult.status,
        passedRules: basicResult.passedRules,
        failedRules: basicResult.failedRules,
        nextActions: basicResult.nextActions
      },
      {
        product: 'premium',
        status: premiumResult.status,
        passedRules: premiumResult.passedRules,
        failedRules: premiumResult.failedRules,
        nextActions: premiumResult.nextActions
      },
      {
        product: 'enterprise',
        status: enterpriseResult.status,
        passedRules: enterpriseResult.passedRules,
        failedRules: enterpriseResult.failedRules,
        nextActions: enterpriseResult.nextActions
      }
    ]
  };

  return result;
};

/**
 * Fetches user metrics (mock implementation)
 * @param userId - The ID of the user to fetch metrics for
 * @returns A promise that resolves to the user's metrics
 */
const fetchUserMetrics = async (userId: string): Promise<MonetizationMetrics> => {
  // In a real implementation, this would fetch data from a database or API
  // For demo purposes, using mock data
  return {
    followers: 500,
    watchMinutes60d: 2500,
    watchMinutes30d: 1500,
    postEngagement30d: 4.5,
    returningViewers30d: 30,
    uniqueViews30d: 1200,
    activeVideos: 15,
    consecutiveFollowerDays: 10,
    accountAgeDays: 60,
    age: 25,
    isEligibleCountry: true,
    originalContentScore: 85,
    policyViolations: 0,
    giftPurchaseEligible: true,
    verifiedBusiness: true,
    verifiedPayout: true
  };
};

/**
 * Gets the platform configuration (mock implementation)
 * @returns A promise that resolves to the platform configuration
 */
const getPlatformConfig = async (): Promise<PlatformConfig> => {
  // In a real implementation, this would fetch data from a configuration service
  return {
    id: 'config-1',
    minimumAge: 18,
    minimumPayoutThreshold: 10,
    seshatMonthlyFee: 5,
    seshatYearlyFee: 50,
    revenueSharePercentage: 50,
    giftsCashValue: 0.1,
    supportedCountries: ['US', 'CA', 'GB'],
    policyVersion: '1.0',
    affiliateBonusPercentage: 5,
    basicEligibility: {
      minFollowers: 100,
      minWatchMinutes30d: 500,
      minAccountAgeDays: 30
    },
    premiumEligibility: {
      minFollowers: 1000,
      minWatchMinutes30d: 5000,
      minAccountAgeDays: 90,
      minEngagementRate: 3
    },
    enterpriseEligibility: {
      minFollowers: 10000,
      minWatchMinutes30d: 50000,
      minAccountAgeDays: 180,
      minEngagementRate: 5,
      minContentScore: 80
    }
  };
};

/**
 * Checks eligibility for the basic program
 * @param metrics - The user's metrics
 * @param config - The platform configuration
 * @returns The eligibility result
 */
export const checkBasicEligibility = (
  metrics: MonetizationMetrics,
  config: PlatformConfig
): EligibilityResult => {
  const failedRules: string[] = [];
  const nextActions: string[] = [];

  // Use default values if config.basicEligibility is not defined
  const basicConfig = config.basicEligibility || {
    minFollowers: 100,
    minWatchMinutes30d: 500,
    minAccountAgeDays: 30
  };

  // Check minimum requirements
  if (metrics.followers < basicConfig.minFollowers) {
    failedRules.push('followers');
    nextActions.push(`Gain ${basicConfig.minFollowers - metrics.followers} more followers`);
  }

  if (metrics.watchMinutes30d < basicConfig.minWatchMinutes30d) {
    failedRules.push('watch_minutes');
    nextActions.push(`Increase watch time by ${basicConfig.minWatchMinutes30d - metrics.watchMinutes30d} minutes`);
  }

  if (metrics.accountAgeDays < basicConfig.minAccountAgeDays) {
    failedRules.push('account_age');
    nextActions.push(`Wait ${basicConfig.minAccountAgeDays - metrics.accountAgeDays} more days`);
  }

  if (metrics.policyViolations > 0) {
    failedRules.push('policy_compliance');
    nextActions.push('Resolve policy violations');
  }

  const status: 'eligible' | 'ineligible' | 'conditional' = 
    failedRules.length === 0 ? 'eligible' : 'ineligible';

  return { 
    status, 
    passedRules: ['policy_compliance', 'content_quality'].filter(rule => !failedRules.includes(rule)),
    failedRules,
    nextActions 
  };
};

/**
 * Checks eligibility for the premium program
 * @param metrics - The user's metrics
 * @param config - The platform configuration
 * @returns The eligibility result
 */
export const checkPremiumEligibility = (
  metrics: MonetizationMetrics,
  config: PlatformConfig
): EligibilityResult => {
  const { status: basicStatus, failedRules: basicFailed, nextActions: basicActions } = 
    checkBasicEligibility(metrics, config);

  if (basicStatus !== 'eligible') {
    return {
      status: 'ineligible',
      passedRules: [],
      failedRules: basicFailed,
      nextActions: basicActions
    };
  }

  const failedRules: string[] = [];
  const nextActions: string[] = [];

  // Use default values if config.premiumEligibility is not defined
  const premiumConfig = config.premiumEligibility || {
    minFollowers: 1000,
    minWatchMinutes30d: 5000,
    minAccountAgeDays: 90,
    minEngagementRate: 3
  };

  // Check premium-specific requirements
  if (metrics.followers < premiumConfig.minFollowers) {
    failedRules.push('followers');
    nextActions.push(`Gain ${premiumConfig.minFollowers - metrics.followers} more followers`);
  }

  if (metrics.watchMinutes30d < premiumConfig.minWatchMinutes30d) {
    failedRules.push('watch_minutes');
    nextActions.push(`Increase watch time by ${premiumConfig.minWatchMinutes30d - metrics.watchMinutes30d} minutes`);
  }

  if (metrics.accountAgeDays < premiumConfig.minAccountAgeDays) {
    failedRules.push('account_age');
    nextActions.push(`Wait ${premiumConfig.minAccountAgeDays - metrics.accountAgeDays} more days`);
  }

  if (metrics.postEngagement30d < (premiumConfig.minEngagementRate || 3)) {
    failedRules.push('engagement_rate');
    nextActions.push(`Improve engagement rate by ${((premiumConfig.minEngagementRate || 3) - metrics.postEngagement30d).toFixed(1)}%`);
  }

  const status: 'eligible' | 'ineligible' | 'conditional' = 
    failedRules.length === 0 ? 'eligible' : 'ineligible';

  return { 
    status, 
    passedRules: ['policy_compliance', 'content_quality', 'followers', 'watch_minutes', 'account_age', 'engagement_rate']
      .filter(rule => !failedRules.includes(rule)),
    failedRules,
    nextActions 
  };
};

/**
 * Checks eligibility for the enterprise program
 * @param metrics - The user's metrics
 * @param config - The platform configuration
 * @returns The eligibility result
 */
export const checkEnterpriseEligibility = (
  metrics: MonetizationMetrics,
  config: PlatformConfig
): EligibilityResult => {
  const { status: premiumStatus, failedRules: premiumFailed, nextActions: premiumActions } = 
    checkPremiumEligibility(metrics, config);

  if (premiumStatus !== 'eligible') {
    return {
      status: 'ineligible',
      passedRules: [],
      failedRules: premiumFailed,
      nextActions: premiumActions
    };
  }

  const failedRules: string[] = [];
  const nextActions: string[] = [];

  // Use default values if config.enterpriseEligibility is not defined
  const enterpriseConfig = config.enterpriseEligibility || {
    minFollowers: 10000,
    minWatchMinutes30d: 50000,
    minAccountAgeDays: 180,
    minEngagementRate: 5,
    minContentScore: 80
  };

  // Check enterprise-specific requirements
  if (metrics.followers < enterpriseConfig.minFollowers) {
    failedRules.push('followers');
    nextActions.push(`Gain ${enterpriseConfig.minFollowers - metrics.followers} more followers`);
  }

  if (metrics.watchMinutes30d < enterpriseConfig.minWatchMinutes30d) {
    failedRules.push('watch_minutes');
    nextActions.push(`Increase watch time by ${enterpriseConfig.minWatchMinutes30d - metrics.watchMinutes30d} minutes`);
  }

  if (metrics.accountAgeDays < enterpriseConfig.minAccountAgeDays) {
    failedRules.push('account_age');
    nextActions.push(`Wait ${enterpriseConfig.minAccountAgeDays - metrics.accountAgeDays} more days`);
  }

  if (metrics.postEngagement30d < (enterpriseConfig.minEngagementRate || 5)) {
    failedRules.push('engagement_rate');
    nextActions.push(`Improve engagement rate by ${((enterpriseConfig.minEngagementRate || 5) - metrics.postEngagement30d).toFixed(1)}%`);
  }

  if (metrics.originalContentScore < (enterpriseConfig.minContentScore || 80)) {
    failedRules.push('content_quality');
    nextActions.push(`Improve content score by ${(enterpriseConfig.minContentScore || 80) - metrics.originalContentScore}`);
  }

  const status: 'eligible' | 'ineligible' | 'conditional' = 
    failedRules.length === 0 ? 'eligible' : 'ineligible';

  return { 
    status, 
    passedRules: ['policy_compliance', 'content_quality', 'followers', 'watch_minutes', 'account_age', 'engagement_rate']
      .filter(rule => !failedRules.includes(rule)),
    failedRules,
    nextActions 
  };
};

/**
 * Gets eligibility recommendations for a user
 * @param metrics - The user's metrics
 * @param config - The platform configuration
 * @returns An array of recommendation strings
 */
export const getEligibilityRecommendations = (
  metrics: MonetizationMetrics,
  config: PlatformConfig
): string[] => {
  const recommendations: string[] = [];
  
  // Basic eligibility recommendations
  const basicEligible = checkBasicEligibility(metrics, config);
  if (basicEligible.status !== 'eligible') {
    const basicConfig = config.basicEligibility || {
      minFollowers: 100,
      minWatchMinutes30d: 500,
      minAccountAgeDays: 30
    };
    
    if (metrics.followers < basicConfig.minFollowers) {
      recommendations.push(`Gain ${basicConfig.minFollowers - metrics.followers} more followers`);
    }
    
    if (metrics.watchMinutes30d < basicConfig.minWatchMinutes30d) {
      recommendations.push(`Increase watch time by ${basicConfig.minWatchMinutes30d - metrics.watchMinutes30d} minutes`);
    }
    
    if (metrics.accountAgeDays < basicConfig.minAccountAgeDays) {
      recommendations.push(`Maintain account for ${basicConfig.minAccountAgeDays - metrics.accountAgeDays} more days`);
    }
  }
  
  // Premium eligibility recommendations
  const premiumEligible = checkPremiumEligibility(metrics, config);
  if (premiumEligible.status !== 'eligible') {
    const premiumConfig = config.premiumEligibility || {
      minFollowers: 1000,
      minWatchMinutes30d: 5000,
      minAccountAgeDays: 90,
      minEngagementRate: 3
    };
    
    if (metrics.followers < premiumConfig.minFollowers) {
      recommendations.push(`Gain ${premiumConfig.minFollowers - metrics.followers} more followers`);
    }
    
    if (metrics.watchMinutes30d < premiumConfig.minWatchMinutes30d) {
      recommendations.push(`Increase watch time by ${premiumConfig.minWatchMinutes30d - metrics.watchMinutes30d} minutes`);
    }
    
    if (metrics.accountAgeDays < premiumConfig.minAccountAgeDays) {
      recommendations.push(`Maintain account for ${premiumConfig.minAccountAgeDays - metrics.accountAgeDays} more days`);
    }
    
    if (metrics.postEngagement30d < (premiumConfig.minEngagementRate || 3)) {
      recommendations.push(`Improve engagement rate by ${((premiumConfig.minEngagementRate || 3) - metrics.postEngagement30d).toFixed(1)}%`);
    }
  }
  
  // Enterprise eligibility recommendations
  const enterpriseEligible = checkEnterpriseEligibility(metrics, config);
  if (enterpriseEligible.status !== 'eligible') {
    const enterpriseConfig = config.enterpriseEligibility || {
      minFollowers: 10000,
      minWatchMinutes30d: 50000,
      minAccountAgeDays: 180,
      minEngagementRate: 5,
      minContentScore: 80
    };
    
    if (metrics.followers < enterpriseConfig.minFollowers) {
      recommendations.push(`Gain ${enterpriseConfig.minFollowers - metrics.followers} more followers`);
    }
    
    if (metrics.watchMinutes30d < enterpriseConfig.minWatchMinutes30d) {
      recommendations.push(`Increase watch time by ${enterpriseConfig.minWatchMinutes30d - metrics.watchMinutes30d} minutes`);
    }
    
    if (metrics.accountAgeDays < enterpriseConfig.minAccountAgeDays) {
      recommendations.push(`Maintain account for ${enterpriseConfig.minAccountAgeDays - metrics.accountAgeDays} more days`);
    }
    
    if (metrics.postEngagement30d < (enterpriseConfig.minEngagementRate || 5)) {
      recommendations.push(`Improve engagement rate by ${((enterpriseConfig.minEngagementRate || 5) - metrics.postEngagement30d).toFixed(1)}%`);
    }
    
    if (metrics.originalContentScore < (enterpriseConfig.minContentScore || 80)) {
      recommendations.push(`Improve content score by ${(enterpriseConfig.minContentScore || 80) - metrics.originalContentScore}`);
    }
  }
  
  return recommendations;
};

/**
 * Gets eligibility for a specific product
 * @param productName - The name of the product to check
 * @param metrics - The user's metrics
 * @param config - The platform configuration
 * @returns The eligibility result
 */
export const getProductEligibility = (
  productName: string,
  metrics: MonetizationMetrics,
  config: PlatformConfig
): Eligibility => {
  let productEligibility: EligibilityResult;
  let productStatus: EligibilityProduct;

  switch (productName.toLowerCase()) {
    case 'basic':
      productEligibility = checkBasicEligibility(metrics, config);
      productStatus = {
        product: 'basic',
        status: productEligibility.status,
        passedRules: productEligibility.passedRules,
        failedRules: productEligibility.failedRules,
        nextActions: productEligibility.nextActions
      };
      return {
        universalStatus: productEligibility.status,
        products: [productStatus]
      };
    case 'premium':
      productEligibility = checkPremiumEligibility(metrics, config);
      productStatus = {
        product: 'premium',
        status: productEligibility.status,
        passedRules: productEligibility.passedRules,
        failedRules: productEligibility.failedRules,
        nextActions: productEligibility.nextActions
      };
      return {
        universalStatus: productEligibility.status,
        products: [productStatus]
      };
    case 'enterprise':
      productEligibility = checkEnterpriseEligibility(metrics, config);
      productStatus = {
        product: 'enterprise',
        status: productEligibility.status,
        passedRules: productEligibility.passedRules,
        failedRules: productEligibility.failedRules,
        nextActions: productEligibility.nextActions
      };
      return {
        universalStatus: productEligibility.status,
        products: [productStatus]
      };
    default:
      return {
        universalStatus: 'ineligible',
        products: [{
          product: productName,
          status: 'ineligible',
          passedRules: [],
          failedRules: ['unknown_product'],
          nextActions: ['Product not recognized']
        }]
      };
  }
};

// Add a default export for the service
export default {
  getEligibility,
  checkBasicEligibility,
  checkPremiumEligibility,
  checkEnterpriseEligibility,
  getEligibilityRecommendations,
  getProductEligibility
};

// Add a type definition for the eligibility result
type EligibilityResult = {
  status: 'eligible' | 'ineligible' | 'conditional';
  passedRules: string[];
  failedRules: string[];
  nextActions: string[];
};