/**
 * Loyalty & Rewards Ecosystem Constants - FingerMobile Protocol™
 * Synchronized with PostgreSQL `loyalty_rewards` and `user_loyalty` tables.
 */

export interface LoyaltyTierDefinition {
  id: string;
  name: string;
  minPoints: number;
  perks: string[];
  multiplier: number;
  badgeColor: string;
}

export interface LoyaltyRewardItem {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  tierRequired: string;
  category: 'Credential' | 'Financial' | 'Commerce' | 'Advertising' | 'Media' | 'Governance';
  isActive: boolean;
}

export const SOVEREIGN_LOYALTY_TIERS: LoyaltyTierDefinition[] = [
  {
    id: 'sovereign_bronze',
    name: 'Sovereign Bronze',
    minPoints: 0,
    perks: ['Standard P2P Transfer Limits', 'SoundSonic Audio Streaming', 'Community Forum Posting'],
    multiplier: 1.0,
    badgeColor: 'text-amber-800 bg-amber-100 border-amber-300'
  },
  {
    id: 'sovereign_silver',
    name: 'Sovereign Silver',
    minPoints: 500,
    perks: ['Flamingo 20% Merchant Rebates', 'Priority WebRTC Room Allocation', '1.2x Earning Multiplier'],
    multiplier: 1.2,
    badgeColor: 'text-slate-800 bg-slate-100 border-slate-300'
  },
  {
    id: 'sovereign_gold',
    name: 'Sovereign Gold',
    minPoints: 1200,
    perks: ['Zero-Fee Treasury Conversion Vouchers', 'Canary Ads Sovereign Boost', '1.5x Earning Multiplier'],
    multiplier: 1.5,
    badgeColor: 'text-yellow-950 bg-yellow-100 border-yellow-400'
  },
  {
    id: 'sovereign_platinum',
    name: 'Sovereign Platinum',
    minPoints: 3000,
    perks: ['Sovereign Protocol NFT Passport', 'AAL3 Hardware Biometric Priority', '2.0x Earning Multiplier'],
    multiplier: 2.0,
    badgeColor: 'text-emerald-950 bg-emerald-100 border-emerald-400'
  },
  {
    id: 'diamond_citadel',
    name: 'Diamond Citadel',
    minPoints: 10000,
    perks: ['Treasury Node Voting Rights', 'Unlimited Sleeper APY Bonuses', 'Executive White-Glove Support'],
    multiplier: 3.0,
    badgeColor: 'text-indigo-950 bg-indigo-100 border-indigo-400'
  }
];

export const SOVEREIGN_LOYALTY_REWARDS: LoyaltyRewardItem[] = [
  {
    id: 'rew-passport-01',
    name: 'Sovereign Protocol NFT Passport',
    description: 'Verified physical & on-chain biometric passport badge',
    pointsCost: 5000,
    tierRequired: 'sovereign_platinum',
    category: 'Credential',
    isActive: true
  },
  {
    id: 'rew-fee-waiver-02',
    name: 'Zero-Fee Treasury Conversion Voucher',
    description: '100% waiver on next 5 fiat-to-FIC treasury conversions',
    pointsCost: 1200,
    tierRequired: 'sovereign_gold',
    category: 'Financial',
    isActive: true
  },
  {
    id: 'rew-store-rebate-03',
    name: 'Flamingo Express 20% Merchant Rebate',
    description: 'Exclusive discount coupon on luxury vendor storefronts',
    pointsCost: 800,
    tierRequired: 'sovereign_silver',
    category: 'Commerce',
    isActive: true
  },
  {
    id: 'rew-canary-boost-04',
    name: 'Canary Ads Sovereign Boost credits',
    description: '1,000 complimentary ad impressions across sovereign network',
    pointsCost: 2500,
    tierRequired: 'sovereign_gold',
    category: 'Advertising',
    isActive: true
  },
  {
    id: 'rew-sound-vip-05',
    name: 'VIP SoundSonic Studio Pass',
    description: 'Unlimited lossless master downloads & acoustic stems',
    pointsCost: 1500,
    tierRequired: 'sovereign_bronze',
    category: 'Media',
    isActive: true
  }
];

// Preserved canonical export alias
export const loyalty_DATA = SOVEREIGN_LOYALTY_REWARDS;
export default SOVEREIGN_LOYALTY_REWARDS;
