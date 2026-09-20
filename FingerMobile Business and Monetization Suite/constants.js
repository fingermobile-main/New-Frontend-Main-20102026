"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALERT_COPY = exports.UNIVERSAL_REQUIREMENTS = exports.PROGRAM_DEFINITIONS = exports.DEFAULT_PLATFORM_CONFIG = exports.DEFAULT_POLICY_KEY = exports.DEFAULT_USER_ID = exports.DEFAULT_PAGE_ID = exports.APP_NAME = void 0;
exports.APP_NAME = 'FingerMobile Business Suite';
exports.DEFAULT_PAGE_ID = 'page_fingermobile_demo';
exports.DEFAULT_USER_ID = 'user_fingermobile_demo';
exports.DEFAULT_POLICY_KEY = 'partner_monetization_policy';
exports.DEFAULT_PLATFORM_CONFIG = {
    id: 'platform_default',
    minimumAge: 22,
    minimumPayoutThreshold: 100,
    seshatMonthlyFee: 24.99,
    seshatYearlyFee: 249.99,
    revenueSharePercentage: 0.55,
    giftsCashValue: 0.01,
    supportedCountries: ['US', 'GB', 'CA', 'AU', 'NG', 'ZA', 'KE', 'IN', 'BR', 'MX'],
    policyVersion: '2026.07',
    affiliateBonusPercentage: 0.01,
};
exports.PROGRAM_DEFINITIONS = [
    {
        key: 'in_stream_ads',
        title: 'In-Stream Ads',
        summary: 'Earn from ads placed before, during, or after eligible videos and live content.',
        requirements: [
            'At least 10,000 followers',
            'At least 100,000 eligible watch minutes in the last 60 days',
            'At least 35 active videos on the Seshat Page',
            'Original content and policy-safe account behavior',
        ],
    },
    {
        key: 'gifts',
        title: 'Gifts',
        summary: 'Receive tips from followers during live streams and selected posts.',
        requirements: [
            'At least 500 followers maintained for 60 consecutive days',
            'User must first be eligible to purchase gifts from the marketplace',
            'Verified payout account and compliant account status',
        ],
    },
    {
        key: 'subscriptions',
        title: 'FingerMobile Subscriptions',
        summary: 'Offer recurring paid memberships with exclusive content and perks.',
        requirements: [
            'At least 50,000 followers or 500+ returning viewers',
            'At least 100,000 post engagements or 180,000 watch minutes in the last 30 days',
            'Page and payouts in good standing',
        ],
    },
    {
        key: 'reels_ads',
        title: 'Ads on Reels & Content Monetization',
        summary: 'Monetize short-form content and overall content engagement with ad and bonus logic.',
        requirements: [
            'At least 20,000 followers',
            'At least 350,000 unique views in the last 30 days',
            'Originality score and policy standing above platform minimum',
        ],
    },
    {
        key: 'affiliate',
        title: 'Affiliate Partnerships',
        summary: 'Tag shoppable partner products and earn commissions on attributed conversions.',
        requirements: [
            'Business verification completed',
            'Payout account verified',
            'Disclosure requirements accepted',
            'Page must be in a supported market',
        ],
    },
];
exports.UNIVERSAL_REQUIREMENTS = [
    'Account is at least 30 days old',
    'Member is at least 22 years old',
    'Member resides in a supported country',
    'Original content and authenticity requirements are satisfied',
    'No unresolved severe policy violations',
    'Valid bank account is linked before payouts',
];
exports.ALERT_COPY = {
    unsupportedCountry: 'Monetization is unavailable in the current country setting.',
    underAge: 'Member must be at least 22 years old.',
    accountTooNew: 'Account must be at least 30 days old.',
    originalityRisk: 'Content originality score is below the monetization threshold.',
    policyRisk: 'Policy violations are blocking one or more monetization products.',
    payoutMissing: 'A verified payout account is required to collect earnings.',
};
