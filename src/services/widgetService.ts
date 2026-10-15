import axios from 'axios';

export interface WidgetFeedback {
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface WidgetAnalytics {
  hourly_clicks?: Record<string, number>;
  geographic_distribution?: Record<string, number>;
  device_breakdown?: { desktop: number; mobile: number; tablet: number };
  historical_ctr?: number;
  feedback_scores?: { positive: number; neutral: number; negative: number };
  feedback_comments?: string[];
}

export interface WidgetEntity {
  id: string;
  name: string;
  slug: string;
  type: string; // 'permanent_ad' | 'luxury' | 'intelligence' | 'fintech' | 'rotational' | 'custom'
  title: string;
  subtitle?: string;
  description?: string;
  category: string;
  isPermanent: boolean;
  displayLocation: 'bottom_right_column' | 'right_column_dynamic' | string;
  rotationIntervalMinutes: number; // 120 = 2 hours
  rotationPriority: number;
  lastRotatedAt?: string;
  nextRotationAt?: string;
  scheduleStartDate?: string;
  scheduleEndDate?: string;
  images: string[];
  videos: string[];
  primaryImageUrl?: string;
  primaryVideoUrl?: string;
  videoPosterUrl?: string;
  actionUrl: string;
  ctaText: string;
  secondaryActionUrl?: string;
  secondaryCtaText?: string;
  badgeText?: string;
  accentColor: string;
  badgeStyle?: string;
  edgeStyle?: string;
  status: 'active' | 'paused' | 'scheduled' | 'archived';
  clicks: number;
  impressions: number;
  conversions: number;
  shares: number;
  avgEngagementSeconds: number;
  analytics?: WidgetAnalytics;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface RailRotationState {
  currentStep: number;
  intervalMinutes: number;
  lastRotatedAt: string;
  nextRotationAt: string;
  remainingSeconds: number;
  poolSize: number;
}

const STORAGE_KEY = 'fingermobile_protocol_widgets_db_v1';
const ROTATION_STORAGE_KEY = 'fingermobile_widget_rotation_v1';
const ROTATION_INTERVAL_MS = 2 * 60 * 60 * 1000; // 2 hours

export const SEEDED_PROTOCOL_WIDGETS: WidgetEntity[] = [
  // ---------------------------------------------------------------------------
  // 1. PERMANENT ANCHOR WIDGET: Canary ads Widget (Bottom Right Column)
  // ---------------------------------------------------------------------------
  {
    id: 'canary-ads-permanent',
    name: 'Canary Ads Widget',
    slug: 'canary-ads',
    type: 'permanent_ad',
    title: 'Canary Ads™ Sovereign Sponsor Rail',
    subtitle: 'Verified Decentralized Network Advertising',
    description: 'Permanent bottom-rail community spotlight. Cryptographic impression attribution, high ROI, and instant campaign activation.',
    category: 'Advertising',
    isPermanent: true,
    displayLocation: 'bottom_right_column',
    rotationIntervalMinutes: 0,
    rotationPriority: 999,
    primaryImageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
    primaryVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoPosterUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    ],
    videos: ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'],
    actionUrl: '/canary-ads',
    ctaText: 'Launch Canary Ad',
    secondaryActionUrl: '/canary-admaker',
    secondaryCtaText: 'AdMaker Studio',
    badgeText: 'PERMANENT PINNED',
    accentColor: '#f59e0b',
    badgeStyle: 'amber',
    edgeStyle: 'neon-border',
    status: 'active',
    clicks: 14829,
    impressions: 215400,
    conversions: 3410,
    shares: 890,
    avgEngagementSeconds: 28.5,
    analytics: {
      hourly_clicks: { '08:00': 110, '10:00': 240, '12:00': 350, '14:00': 410 },
      device_breakdown: { desktop: 58, mobile: 37, tablet: 5 },
      historical_ctr: 6.88,
      feedback_scores: { positive: 94, neutral: 5, negative: 1 },
      feedback_comments: [
        'Exceptional bottom-column permanence and visibility.',
        'Direct attribution through FingerMobile Protocol smart contracts.',
      ],
    },
    metadata: {
      advertiser: 'Canary Media Protocol',
      tier: 'Enterprise Sovereign',
      verified: true,
      placement: 'Bottom Right Column (Anchored)',
    },
  },

  // ---------------------------------------------------------------------------
  // 2. NEW ADDITION: FingerLux Widget
  // ---------------------------------------------------------------------------
  {
    id: 'fingerlux-widget',
    name: 'FingerLux Widget',
    slug: 'fingerlux',
    type: 'luxury',
    title: 'FingerLux™ Luxury & VIP Suites',
    subtitle: 'High-Net-Worth Sovereign Marketplace',
    description: 'Bespoke luxury concierge, rare gem vaults, private jet charters, and high-value real estate tokenization.',
    category: 'Luxury',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 2,
    primaryImageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/fingerlux',
    ctaText: 'Access VIP Suite',
    badgeText: 'VIP CONCIERGE',
    accentColor: '#9333ea',
    badgeStyle: 'purple',
    status: 'active',
    clicks: 4890,
    impressions: 89000,
    conversions: 412,
    shares: 310,
    avgEngagementSeconds: 34.2,
    analytics: {
      historical_ctr: 5.49,
      feedback_scores: { positive: 45, neutral: 3, negative: 0 },
      feedback_comments: ['Top tier bespoke concierge.', 'Rare gem collection verification is seamless.'],
    },
    metadata: { tier: 'Black Diamond', minHolding: '100,000 FIC' },
  },

  // ---------------------------------------------------------------------------
  // 3. NEW ADDITION: SuperVI Widget
  // ---------------------------------------------------------------------------
  {
    id: 'supervi-widget',
    name: 'SuperVI Widget',
    slug: 'supervi',
    type: 'intelligence',
    title: 'SuperVI™ Neural Vision & Proofs',
    subtitle: 'Real-Time Protocol Telemetry & Audits',
    description: 'Consensus engine telemetry, zero-knowledge block proofs, cognitive sentiment indexing, and active validator health.',
    category: 'Intelligence',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 2,
    primaryImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/security',
    ctaText: 'View Node Proofs',
    badgeText: 'SUPER-VERIFIED 99.9%',
    accentColor: '#0284c7',
    badgeStyle: 'sky',
    status: 'active',
    clicks: 6120,
    impressions: 94000,
    conversions: 670,
    shares: 440,
    avgEngagementSeconds: 42.1,
    analytics: {
      historical_ctr: 6.51,
      feedback_scores: { positive: 88, neutral: 2, negative: 0 },
      feedback_comments: ['Live node heartbeat is super informative.', 'Zero-latency proof verified.'],
    },
    metadata: { latencyMs: 14, activeNodes: 1248, zkWormHash: '0x9fa4...81e2' },
  },

  // ---------------------------------------------------------------------------
  // 4. NEW ADDITION: Loansqr Widget
  // ---------------------------------------------------------------------------
  {
    id: 'loansqr-widget',
    name: 'Loansqr Widget',
    slug: 'loansqr',
    type: 'fintech',
    title: 'Loansqr™ Instant Nano-Liquidity',
    subtitle: 'Low-APR Collateralized Micro-Loans',
    description: 'Instant 60-second credit assessment, ₦5,000 to ₦5,000,000 instant liquidity lines, and direct automated settlement.',
    category: 'Fintech',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 2,
    primaryImageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/loansqr',
    ctaText: 'Calculate Loan',
    badgeText: 'INSTANT PAYOUT',
    accentColor: '#059669',
    badgeStyle: 'emerald',
    status: 'active',
    clicks: 8940,
    impressions: 112000,
    conversions: 1540,
    shares: 620,
    avgEngagementSeconds: 48.0,
    analytics: {
      historical_ctr: 7.98,
      feedback_scores: { positive: 91, neutral: 6, negative: 3 },
      feedback_comments: ['Approved and disbursed in 45 seconds.', 'Transparent APR with zero surprise fees.'],
    },
    metadata: { startingApr: '4.8%', maxTenorMonths: 24, instantPreApproval: true },
  },

  // ---------------------------------------------------------------------------
  // ROTATIONAL POOL: All other dynamic 2-hour rotation widgets
  // ---------------------------------------------------------------------------
  {
    id: 'camus-admaker-widget',
    name: 'Camus AdMaker Widget',
    slug: 'camus-admaker',
    type: 'rotational',
    title: 'Camus AdMaker™ Visual Studio',
    subtitle: 'Automated AI Banner & Video Ad Engine',
    description: 'Craft dynamic responsive ad campaigns, generate animated motion banners, and boost content visibility in 30 seconds.',
    category: 'Creator Tools',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/canary-admaker',
    ctaText: 'Create Ad Now',
    badgeText: 'AI STUDIO',
    accentColor: '#e11d48',
    status: 'active',
    clicks: 3410,
    impressions: 48000,
    conversions: 390,
    shares: 190,
    avgEngagementSeconds: 31.0,
  },
  {
    id: 'luminar-widget',
    name: 'Luminar Widget',
    slug: 'luminar',
    type: 'rotational',
    title: 'Luminar™ Media Engine',
    subtitle: 'Lossless Transcoding & Watermarking',
    description: 'Transcode 4K lossless video, apply sovereign watermarks, and auto-generate multilingual subtitles.',
    category: 'Media',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/media',
    ctaText: 'Open Luminar',
    badgeText: '4K LOSSLESS',
    accentColor: '#8b5cf6',
    status: 'active',
    clicks: 2950,
    impressions: 41000,
    conversions: 240,
    shares: 130,
    avgEngagementSeconds: 26.5,
  },
  {
    id: 'catalogue-widget',
    name: 'Catalogue Widget',
    slug: 'catalogue',
    type: 'rotational',
    title: 'Catalogue™ Global Index',
    subtitle: 'Cross-Storefront Verified Directory',
    description: 'Explore over 90,000 decentralized commerce SKUs, digital goods, and handmade crafts with buyer protection.',
    category: 'Commerce',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/catalogue',
    ctaText: 'Browse Catalog',
    badgeText: '90,000+ ITEMS',
    accentColor: '#d97706',
    status: 'active',
    clicks: 4210,
    impressions: 62000,
    conversions: 520,
    shares: 280,
    avgEngagementSeconds: 38.0,
  },
  {
    id: 'coupons-widget',
    name: 'Coupons Widget',
    slug: 'coupons',
    type: 'rotational',
    title: 'Coupons™ Flash Perks',
    subtitle: 'Tokenized Merchant Discount Vouchers',
    description: 'Grab verified discount codes redeemable for up to 50% off select verified vendor products.',
    category: 'Commerce',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/coupons',
    ctaText: 'Claim 30% Off',
    badgeText: 'LIMITED 2H DEALS',
    accentColor: '#16a34a',
    status: 'active',
    clicks: 5820,
    impressions: 71000,
    conversions: 980,
    shares: 410,
    avgEngagementSeconds: 22.0,
  },
  {
    id: 'dancia-4tv-widget',
    name: 'Dancia-4Tv Widget',
    slug: 'dancia-4tv',
    type: 'rotational',
    title: 'Dancia-4Tv™ Live Channels',
    subtitle: 'High-Energy Dance, Beats & Cultural TV',
    description: 'Tune into synchronized live performances, dance battles, and creator livestreams with real-time tipping.',
    category: 'Entertainment',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/dancia4tv',
    ctaText: 'Watch Live Now',
    badgeText: 'ON AIR LIVE',
    accentColor: '#dc2626',
    status: 'active',
    clicks: 6490,
    impressions: 83000,
    conversions: 810,
    shares: 550,
    avgEngagementSeconds: 52.3,
  },
  {
    id: 'giftsshop-widget',
    name: 'GiftsShop Widget',
    slug: 'giftsshop',
    type: 'rotational',
    title: 'GiftsShop™ Souvenirs',
    subtitle: 'Commemorative Pins & Protocol Merch',
    description: 'Exclusive physical merchandise, metal commemorative coins, and protocol-branded apparel.',
    category: 'Commerce',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/giftsshop',
    ctaText: 'Visit Gift Shop',
    badgeText: 'OFFICIAL MERCH',
    accentColor: '#db2777',
    status: 'active',
    clicks: 3120,
    impressions: 44000,
    conversions: 420,
    shares: 210,
    avgEngagementSeconds: 29.1,
  },
  {
    id: 'lushpressies-widget',
    name: 'Lushpressies Widget',
    slug: 'lushpressies',
    type: 'rotational',
    title: 'Lushpressies™ 3D Plushies',
    subtitle: 'Animated Digital Gifts & Romance',
    description: 'Delight creators and friends with interactive 3D plushies, emerald gift cards, and animated romantic gestures.',
    category: 'Gifting',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/lushpressies',
    ctaText: 'Send 3D Plushie',
    badgeText: '3D ANIMATED',
    accentColor: '#f43f5e',
    status: 'active',
    clicks: 7210,
    impressions: 98000,
    conversions: 1120,
    shares: 790,
    avgEngagementSeconds: 36.4,
  },
  {
    id: 'mylearning-widget',
    name: 'MyLearning Widget',
    slug: 'mylearning',
    type: 'rotational',
    title: 'MyLearning™ Academy',
    subtitle: 'Decentralized Masterclasses & Diplomas',
    description: 'Learn modern Web3 development, cryptographic law, and algorithmic trading with verifiable on-chain certificates.',
    category: 'Education',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/mylearning',
    ctaText: 'Start Course',
    badgeText: 'DIPLOMA TRACK',
    accentColor: '#0d9488',
    status: 'active',
    clicks: 2840,
    impressions: 39000,
    conversions: 310,
    shares: 160,
    avgEngagementSeconds: 44.0,
  },
  {
    id: 'storefront-widget',
    name: 'Storefront Widget',
    slug: 'storefront',
    type: 'rotational',
    title: 'Storefront™ Merchant Hub',
    subtitle: 'Zero-Fee Sovereign E-Commerce',
    description: 'Host your independent web boutique with zero platform tax, instant checkout, and automated shipping calculators.',
    category: 'Commerce',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/storefront',
    ctaText: 'Open Storefront',
    badgeText: '0% COMMISSIONS',
    accentColor: '#ea580c',
    status: 'active',
    clicks: 5120,
    impressions: 74000,
    conversions: 640,
    shares: 380,
    avgEngagementSeconds: 37.2,
  },
  {
    id: 'nysc-widget',
    name: 'Nysc Widget',
    slug: 'nysc',
    type: 'rotational',
    title: 'NYSC™ Sovereign Corps Portal',
    subtitle: 'National Service Placements & CDS Support',
    description: 'Connect with corp members nationwide, discover verified PPA employers, and collaborate on impact projects.',
    category: 'Community',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/nysc',
    ctaText: 'Access NYSC Portal',
    badgeText: 'CORPS SERVICE',
    accentColor: '#15803d',
    status: 'active',
    clicks: 3900,
    impressions: 52000,
    conversions: 480,
    shares: 310,
    avgEngagementSeconds: 33.8,
  },
  {
    id: 'gems-widget',
    name: 'Gems Widget',
    slug: 'gems',
    type: 'rotational',
    title: 'Gems™ Curated Masterpieces',
    subtitle: 'VIP Content & Rare Audio Stems',
    description: 'Access hand-picked high-value releases, investigative journalistic reports, and lossless studio stems.',
    category: 'Editorial',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/gems',
    ctaText: 'Unlock Gems',
    badgeText: 'EDITORIAL GEMS',
    accentColor: '#7c3aed',
    status: 'active',
    clicks: 4450,
    impressions: 61000,
    conversions: 590,
    shares: 360,
    avgEngagementSeconds: 41.5,
  },
  {
    id: 'flamingo-widget',
    name: 'Flamingo Widget',
    slug: 'flamingo',
    type: 'rotational',
    title: 'Flamingo™ Lifestyle & Wanderlust',
    subtitle: 'Global Destinations, Food & Culture',
    description: 'Immerse in curated travel itineraries, culinary master reviews, and boutique resort reservations.',
    category: 'Lifestyle',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/flamingo',
    ctaText: 'Explore Destinations',
    badgeText: 'WANDERLUST',
    accentColor: '#f97316',
    status: 'active',
    clicks: 3780,
    impressions: 53000,
    conversions: 340,
    shares: 290,
    avgEngagementSeconds: 35.0,
  },
  {
    id: 'blogs-widget',
    name: 'Blogs Widget',
    slug: 'blogs',
    type: 'rotational',
    title: 'Blogs™ Independent Voices',
    subtitle: 'Decentralized Opinion & Technical Thought',
    description: 'Read deep-dive analysis on economic sovereignty, AI agentic models, and community governance.',
    category: 'Publishing',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/blogs',
    ctaText: 'Read Deep Dives',
    badgeText: 'ESSAYS & OPINION',
    accentColor: '#475569',
    status: 'active',
    clicks: 4890,
    impressions: 68000,
    conversions: 410,
    shares: 420,
    avgEngagementSeconds: 58.0,
  },
  {
    id: 'giftcard-widget',
    name: 'GiftCard Widget',
    slug: 'giftcard',
    type: 'rotational',
    title: 'GiftCard™ Cosmos Vouchers',
    subtitle: 'Prepaid Digital & Physical Gift Cards',
    description: 'Instant zero-fee gift card generation, custom QR verification, and cross-border instant balance delivery.',
    category: 'Fintech',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1556742049-0a67e557224d?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1556742049-0a67e557224d?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/giftcards',
    ctaText: 'Issue Gift Card',
    badgeText: 'CRYPTO & FIAT',
    accentColor: '#0284c7',
    status: 'active',
    clicks: 5310,
    impressions: 76000,
    conversions: 890,
    shares: 490,
    avgEngagementSeconds: 27.5,
  },
  {
    id: 'loyalty-widget',
    name: 'Loyalty Widget',
    slug: 'loyalty',
    type: 'rotational',
    title: 'Loyalty™ Staking Rewards',
    subtitle: 'Earn Yield & Tier Multipliers',
    description: 'Stake protocol badges, earn points for every post and trade, and unlock exclusive VIP merchandise perks.',
    category: 'Gamification',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/loyalty',
    ctaText: 'Check Loyalty Points',
    badgeText: '2.5X MULTIPLIER',
    accentColor: '#ca8a04',
    status: 'active',
    clicks: 6820,
    impressions: 91000,
    conversions: 1280,
    shares: 510,
    avgEngagementSeconds: 31.8,
  },
  {
    id: 'trends-widget',
    name: 'Trends Widget',
    slug: 'trends',
    type: 'rotational',
    title: 'Trends™ Viral Hashtags',
    subtitle: 'Real-Time Sentiment & Topic Surges',
    description: 'Monitor high-velocity discussions, trending audio releases, breaking sports debates, and hashtag velocity.',
    category: 'Social',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/trends',
    ctaText: 'View Trending Pulse',
    badgeText: 'TRENDING #1',
    accentColor: '#2563eb',
    status: 'active',
    clicks: 9810,
    impressions: 145000,
    conversions: 1940,
    shares: 880,
    avgEngagementSeconds: 46.2,
  },
];

type Listener = () => void;

class WidgetService {
  private widgets: WidgetEntity[] = [];
  private listeners: Set<Listener> = new Set();
  private rotationTimer: any = null;

  constructor() {
    this.initStorage();
    this.startRotationTicker();
  }

  private initStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.widgets = parsed;
          return;
        }
      }
    } catch (e) {
      // Ignore localStorage errors
    }
    this.widgets = [...SEEDED_PROTOCOL_WIDGETS];
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.widgets));
    } catch (e) {
      // Storage error
    }
    this.notifyListeners();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn());
  }

  // ---------------------------------------------------------------------------
  // 2-Hour Auto-Rotation Engine
  // ---------------------------------------------------------------------------
  public getRotationState(): RailRotationState {
    let rotationData = { step: 0, anchor: Date.now() };
    try {
      const stored = localStorage.getItem(ROTATION_STORAGE_KEY);
      if (stored) {
        rotationData = JSON.parse(stored);
      } else {
        localStorage.setItem(ROTATION_STORAGE_KEY, JSON.stringify(rotationData));
      }
    } catch (e) {
      // Ignore
    }

    const now = Date.now();
    const elapsed = now - rotationData.anchor;

    // Check if 2 hours passed
    if (elapsed >= ROTATION_INTERVAL_MS) {
      const cyclesPassed = Math.floor(elapsed / ROTATION_INTERVAL_MS);
      rotationData.step += cyclesPassed;
      rotationData.anchor = now - (elapsed % ROTATION_INTERVAL_MS);
      try {
        localStorage.setItem(ROTATION_STORAGE_KEY, JSON.stringify(rotationData));
      } catch (e) {}
    }

    const nextRotationAt = rotationData.anchor + ROTATION_INTERVAL_MS;
    const remainingSeconds = Math.max(0, Math.floor((nextRotationAt - now) / 1000));
    const poolSize = this.getRotationalPool().length;

    return {
      currentStep: rotationData.step,
      intervalMinutes: 120,
      lastRotatedAt: new Date(rotationData.anchor).toISOString(),
      nextRotationAt: new Date(nextRotationAt).toISOString(),
      remainingSeconds,
      poolSize,
    };
  }

  private startRotationTicker() {
    if (this.rotationTimer) clearInterval(this.rotationTimer);
    // Ticker checks every second for smooth UI countdown and seamless 2h triggers
    this.rotationTimer = setInterval(() => {
      const state = this.getRotationState();
      if (state.remainingSeconds === 0) {
        this.forceRotation();
      }
    }, 1000);
  }

  public forceRotation(): void {
    let rotationData = { step: 0, anchor: Date.now() };
    try {
      const stored = localStorage.getItem(ROTATION_STORAGE_KEY);
      if (stored) {
        rotationData = JSON.parse(stored);
      }
    } catch (e) {}

    rotationData.step += 1;
    rotationData.anchor = Date.now();
    try {
      localStorage.setItem(ROTATION_STORAGE_KEY, JSON.stringify(rotationData));
    } catch (e) {}

    // Optionally notify backend
    axios.post('/api/widgets/rotate').catch(() => {});
    this.notifyListeners();
  }

  // ---------------------------------------------------------------------------
  // Right Rail Layout Resolvers
  // ---------------------------------------------------------------------------

  /**
   * Returns the permanent bottom right column widget (Canary Ads Widget)
   */
  public getPermanentCanaryWidget(): WidgetEntity {
    const permanent = this.widgets.find(
      (w) => w.isPermanent || w.id === 'canary-ads-permanent' || w.displayLocation === 'bottom_right_column'
    );
    return permanent || this.widgets[0];
  }

  /**
   * Returns the pool of all rotational widgets (excluding permanent Canary Ads)
   */
  public getRotationalPool(): WidgetEntity[] {
    return this.widgets.filter(
      (w) => !w.isPermanent && w.id !== 'canary-ads-permanent' && w.status === 'active'
    );
  }

  /**
   * Returns the active rotating widgets for the right column (rotates every 2 hours)
   * Displays 3 widgets from the pool in the current 2-hr rotation window
   */
  public getActiveRotationalWidgets(count = 3): WidgetEntity[] {
    const pool = this.getRotationalPool();
    if (pool.length === 0) return [];

    const { currentStep } = this.getRotationState();
    const result: WidgetEntity[] = [];

    for (let i = 0; i < Math.min(count, pool.length); i++) {
      const idx = (currentStep + i) % pool.length;
      result.push(pool[idx]);
    }

    return result;
  }

  /**
   * Returns all widgets for the MasterDashboard Console
   */
  public getAllWidgets(): WidgetEntity[] {
    return [...this.widgets];
  }

  public getWidgetById(id: string): WidgetEntity | undefined {
    return this.widgets.find((w) => w.id === id);
  }

  // ---------------------------------------------------------------------------
  // Telemetry & Feedback Actions
  // ---------------------------------------------------------------------------
  public recordClick(id: string): void {
    const widget = this.widgets.find((w) => w.id === id);
    if (widget) {
      widget.clicks = (widget.clicks || 0) + 1;
      const impressions = widget.impressions || 1;
      if (!widget.analytics) widget.analytics = {};
      widget.analytics.historical_ctr = parseFloat(((widget.clicks / impressions) * 100).toFixed(2));
      this.saveToStorage();
    }
    axios.post(`/api/widgets/${id}/click`).catch(() => {});
  }

  public recordImpression(id: string): void {
    const widget = this.widgets.find((w) => w.id === id);
    if (widget) {
      widget.impressions = (widget.impressions || 0) + 1;
      this.saveToStorage();
    }
    axios.post(`/api/widgets/${id}/impression`).catch(() => {});
  }

  public recordFeedback(id: string, rating: number, comment?: string): void {
    const widget = this.widgets.find((w) => w.id === id);
    if (widget) {
      if (!widget.analytics) {
        widget.analytics = { feedback_scores: { positive: 0, neutral: 0, negative: 0 }, feedback_comments: [] };
      }
      if (!widget.analytics.feedback_scores) {
        widget.analytics.feedback_scores = { positive: 0, neutral: 0, negative: 0 };
      }

      if (rating >= 4) widget.analytics.feedback_scores.positive += 1;
      else if (rating === 3) widget.analytics.feedback_scores.neutral += 1;
      else widget.analytics.feedback_scores.negative += 1;

      if (comment && comment.trim()) {
        if (!widget.analytics.feedback_comments) widget.analytics.feedback_comments = [];
        widget.analytics.feedback_comments.unshift(comment.trim());
      }
      this.saveToStorage();
    }
    axios.post(`/api/widgets/${id}/feedback`, { rating, comment }).catch(() => {});
  }

  // ---------------------------------------------------------------------------
  // CRUD & Widget Creator Engine
  // ---------------------------------------------------------------------------
  public createWidget(widgetData: Partial<WidgetEntity>): WidgetEntity {
    const id = widgetData.id || `widget-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const slug = widgetData.slug || (widgetData.name || 'custom-widget').toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newWidget: WidgetEntity = {
      id,
      name: widgetData.name || 'Custom Protocol Widget',
      slug,
      type: widgetData.type || 'rotational',
      title: widgetData.title || widgetData.name || 'Custom Widget',
      subtitle: widgetData.subtitle || '',
      description: widgetData.description || '',
      category: widgetData.category || 'General',
      isPermanent: Boolean(widgetData.isPermanent),
      displayLocation: widgetData.isPermanent ? 'bottom_right_column' : (widgetData.displayLocation || 'right_column_dynamic'),
      rotationIntervalMinutes: widgetData.rotationIntervalMinutes || 120,
      rotationPriority: widgetData.rotationPriority || 1,
      images: widgetData.images || (widgetData.primaryImageUrl ? [widgetData.primaryImageUrl] : []),
      videos: widgetData.videos || (widgetData.primaryVideoUrl ? [widgetData.primaryVideoUrl] : []),
      primaryImageUrl: widgetData.primaryImageUrl || '',
      primaryVideoUrl: widgetData.primaryVideoUrl || '',
      videoPosterUrl: widgetData.videoPosterUrl || '',
      actionUrl: widgetData.actionUrl || '/',
      ctaText: widgetData.ctaText || 'Explore Now',
      secondaryActionUrl: widgetData.secondaryActionUrl || '',
      secondaryCtaText: widgetData.secondaryCtaText || '',
      badgeText: widgetData.badgeText || '',
      accentColor: widgetData.accentColor || '#059669',
      badgeStyle: widgetData.badgeStyle || 'emerald',
      edgeStyle: widgetData.edgeStyle || 'glassmorphism',
      status: widgetData.status || 'active',
      clicks: 0,
      impressions: 0,
      conversions: 0,
      shares: 0,
      avgEngagementSeconds: 0,
      analytics: {
        hourly_clicks: {},
        device_breakdown: { desktop: 0, mobile: 0, tablet: 0 },
        historical_ctr: 0.0,
        feedback_scores: { positive: 0, neutral: 0, negative: 0 },
        feedback_comments: [],
      },
      metadata: widgetData.metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.widgets.unshift(newWidget);
    this.saveToStorage();
    axios.post('/api/widgets', newWidget).catch(() => {});
    return newWidget;
  }

  public updateWidget(id: string, updates: Partial<WidgetEntity>): WidgetEntity | null {
    const index = this.widgets.findIndex((w) => w.id === id);
    if (index === -1) return null;

    this.widgets[index] = {
      ...this.widgets[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveToStorage();
    axios.put(`/api/widgets/${id}`, updates).catch(() => {});
    return this.widgets[index];
  }

  public deleteWidget(id: string): boolean {
    const widget = this.widgets.find((w) => w.id === id);
    if (!widget || widget.isPermanent) return false;

    this.widgets = this.widgets.filter((w) => w.id !== id);
    this.saveToStorage();
    axios.delete(`/api/widgets/${id}`).catch(() => {});
    return true;
  }

  public resetToDefault(): void {
    this.widgets = [...SEEDED_PROTOCOL_WIDGETS];
    this.saveToStorage();
  }
}

export const widgetService = new WidgetService();
export default widgetService;
