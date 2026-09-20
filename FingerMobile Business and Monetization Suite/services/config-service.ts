import { PlatformConfig, ConfigUpdate } from '../shared/types';

export const getPlatformConfig = async (): Promise<PlatformConfig> => {
  // In a real implementation, this would fetch actual platform config
  // For now, returning mock data
  return {
    id: 'default',
    minimumAge: 13,
    minimumPayoutThreshold: 10,
    seshatMonthlyFee: 0,
    seshatYearlyFee: 0,
    revenueSharePercentage: 45,
    giftsCashValue: 0.01,
    supportedCountries: ['US', 'GB', 'CA', 'AU'],
    policyVersion: '1.0.0',
    affiliateBonusPercentage: 5,
  };
};

export const updatePlatformConfig = async (configUpdate: ConfigUpdate): Promise<PlatformConfig> => {
  // In a real implementation, this would update the platform config in the database
  // For now, returning the updated config
  return {
    id: 'default',
    minimumAge: configUpdate.minimumAge ?? 13,
    minimumPayoutThreshold: configUpdate.minimumPayoutThreshold ?? 10,
    seshatMonthlyFee: configUpdate.seshatMonthlyFee ?? 0,
    seshatYearlyFee: configUpdate.seshatYearlyFee ?? 0,
    revenueSharePercentage: configUpdate.revenueSharePercentage ?? 45,
    giftsCashValue: configUpdate.giftsCashValue ?? 0.01,
    supportedCountries: configUpdate.supportedCountries ?? ['US', 'GB', 'CA', 'AU'],
    policyVersion: configUpdate.policyVersion ?? '1.0.0',
    affiliateBonusPercentage: configUpdate.affiliateBonusPercentage ?? 5,
  };
};

export default {
  getPlatformConfig,
  updatePlatformConfig
};