import { PlatformConfig } from './shared/types';

export const APP_NAME = 'FingerMobile Business Suite';
export const DEFAULT_PAGE_ID = 'page_fingermobile_demo';
export const DEFAULT_USER_ID = 'user_fingermobile_demo';
export const DEFAULT_POLICY_KEY = 'partner_monetization_policy';

export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  id: 'config_default',
  minimumAge: 18,
  minimumPayoutThreshold: 100,
  seshatMonthlyFee: 5,
  seshatYearlyFee: 50,
  monetizationFeePercentage: 50,
  verificationFee: 5,
  payoutProcessingTime: 7,
  affiliateCommissionRate: 10,
  enableMonetization: true,
  enableAffiliateProgram: true,
  contentPolicy: 'standard',
  privacyPolicy: '1.0',
  termsOfService: 'standard',
  createdAt: new Date(),
  updatedAt: new Date()
};

// We don't need the PROGRAM_DEFINITIONS since they're not compatible with the main types.ts
// export const PROGRAM_DEFINITIONS: (ProgramDefinition & { commissionStructure: CommissionStructure })[] = [
//   // ... definitions ...
// ];

export const ALERT_COPY = {
  SUCCESS: 'Operation completed successfully',
  ERROR: 'An error occurred. Please try again.',
  WARNING: 'Please review the information before proceeding.'
};

export const UNIVERSAL_REQUIREMENTS = [
  'Compliance with community guidelines',
  'Valid identification verification',
  'Active account status'
];