import { PlatformConfig } from './types';

export const APP_NAME = 'FingerMobile Business Suite';
export const DEFAULT_PAGE_ID = 'page_fingermobile_demo';
export const DEFAULT_USER_ID = 'user_fingermobile_demo';
export const DEFAULT_POLICY_KEY = 'partner_monetization_policy';

export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  platformId: 'platform_default',
  platformName: 'FingerMobile Business Suite',
  defaultPageId: 'page_fingermobile_demo',
  defaultUserId: 'user_fingermobile_demo',
  policyKey: 'partner_monetization_policy',
  monetizationEnabled: true,
  commissionStructure: {
    standardRate: 0.15, // 15% standard commission
    premiumRate: 0.20,  // 20% premium commission
    enterpriseRate: 0.25 // 25% enterprise commission
  },
  featureFlags: {
    enableRevenueSharing: true,
    enableCommissionTracking: true,
    enablePerformanceMetrics: false,
    enablePartnerDashboards: false
  }
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