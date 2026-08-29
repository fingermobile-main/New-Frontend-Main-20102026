export const DATABASE_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'fingermobile_db'
};

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'default_secret_key',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h'
};

export const BUSINESS_SUITE_CONFIG = {
  MINIMUM_AGE: 18,
  MINIMUM_FOLLOWERS: 100,
  MINIMUM_WATCH_TIME_HOURS: 10,
  REVENUE_SHARE_PERCENTAGE: 50,
  MONTHLY_FEE: 9.99,
  YEARLY_FEE: 99.99
};

export const PRODUCT_KEYS = {
  IN_STREAM_ADS: 'in_stream_ads',
  GIFTS: 'gifts',
  SUBSCRIPTIONS: 'subscriptions',
  REELS_ADS: 'reels_ads',
  AFFILIATE: 'affiliate'
} as const;

export const USER_ROLES = {
  MEMBER: 'member',
  CREATOR: 'creator',
  MODERATOR: 'moderator',
  FINANCE_ADMIN: 'finance_admin',
  BUSINESS_ADMIN: 'business_admin',
  SUPER_ADMIN: 'super_admin'
} as const;

export const ELIGIBILITY_STATUS = {
  ELIGIBLE: 'eligible',
  WARNING: 'warning',
  BLOCKED: 'blocked',
  PENDING: 'pending'
} as const;

export const DEFAULT_USER_ID = 'default_user_id';
export const DEFAULT_PAGE_ID = 'default_page_id';
export const DEFAULT_PLATFORM_CONFIG = {
  id: 'default_config',
  minimumAge: 18,
  minimumPayoutThreshold: 100,
  hallmarkMonthlyFee: 9.99,
  hallmarkYearlyFee: 99.99,
  revenueSharePercentage: 50,
  giftsCashValue: 0.05,
  supportedCountries: ['US', 'CA', 'GB'],
  policyVersion: '1.0.0',
  affiliateBonusPercentage: 10
};

export const DEFAULT_POLICY_KEY = 'default_policy';

export const APP_CONSTANTS = {
  MIN_AGE_REQUIREMENT: 18,
  MIN_PAYOUT_THRESHOLD: 10.00,
  REVENUE_SHARE_PERCENTAGE: 50.00,
  SUPPORTED_COUNTRIES: ['US', 'CA', 'GB', 'AU'],
  MONETIZATION_PRODUCTS: [
    'in_stream_ads',
    'gifts',
    'subscriptions',
    'reels_ads',
    'affiliate'
  ],
  ELIGIBILITY_STATUS: {
    ELIGIBLE: 'eligible',
    WARNING: 'warning',
    BLOCKED: 'blocked',
    PENDING: 'pending'
  },
  POLICY_VERSION: '1.0'
};

export const ROUTES = {
  OVERVIEW: '/api/overview',
  ESTIMATE: '/api/estimate',
  PROGRAMS: '/api/programs',
  APPLICATIONS: '/api/applications',
  CONFIG: '/api/config',
  VERIFICATION: '/api/verification'
};

// Constants for the FingerMobile Platform Monetization application

export const MINIMUM_AGE = 18;
export const MINIMUM_PAYOUT_THRESHOLD = 10.00;
export const REVENUE_SHARE_PERCENTAGE = 50.00;
export const GIFTS_CASH_VALUE = 0.05;

export const SUPPORTED_COUNTRIES = [
  'US',
  'CA',
  'GB',
  'AU',
];

export const MONETIZATION_PRODUCTS = {
  IN_STREAM_ADS: 'in_stream_ads',
  GIFTS: 'gifts',
  SUBSCRIPTIONS: 'subscriptions',
  REELS_ADS: 'reels_ads',
  AFFILIATE: 'affiliate',
} as const;

export const ELIGIBILITY_STATUSES = {
  ELIGIBLE: 'eligible',
  WARNING: 'warning',
  BLOCKED: 'blocked',
  PENDING: 'pending',
} as const;

export const DEFAULT_POLICY_VERSION = '1.0';
export const AFFILIATE_BONUS_PERCENTAGE = 5.00;

export const METRICS_REQUIREMENTS = {
  MIN_FOLLOWERS: 100,
  MIN_WATCH_MINUTES_30D: 100,
  MIN_POST_ENGAGEMENT_30D: 1,
  MIN_ACCOUNT_AGE_DAYS: 30,
};
