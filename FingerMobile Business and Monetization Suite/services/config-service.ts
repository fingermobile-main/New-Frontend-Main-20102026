import { PlatformConfig, ConfigUpdate } from '../shared/types';

let mockConfig: PlatformConfig = {
  id: 'config-1',
  minimumAge: 18,
  minimumPayoutThreshold: 100,
  seshatMonthlyFee: 10,
  seshatYearlyFee: 100,
  monetizationFeePercentage: 5,
  verificationFee: 5,
  payoutProcessingTime: 7,
  affiliateCommissionRate: 10,
  enableMonetization: true,
  enableAffiliateProgram: true,
  contentPolicy: 'Default content policy',
  privacyPolicy: 'Default privacy policy',
  termsOfService: 'Default terms of service',
  createdAt: new Date(),
  updatedAt: new Date(),
  revenueSharePercentage: 45, // Added for config service
};

export const getConfig = async (): Promise<PlatformConfig> => {
  return mockConfig;
};

export const updateConfig = async (configUpdate: ConfigUpdate): Promise<PlatformConfig> => {
  mockConfig = {
    ...mockConfig,
    ...configUpdate,
    updatedAt: new Date(), // Ensure this is a Date object
  };
  return mockConfig;
};

export default {
  getConfig,
  updateConfig
};