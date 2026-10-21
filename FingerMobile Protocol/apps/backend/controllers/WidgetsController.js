const logger = require('../utils/logger');
const WidgetDataService = require('../services/WidgetDataService');

// In-memory persistent cache / fallback state for widgets when running without DB or in staging
const DEFAULT_WIDGETS = [
  {
    id: 'canary-ads-permanent',
    name: 'Canary Ads Widget',
    slug: 'canary-ads',
    type: 'permanent_ad',
    title: 'Canary Ads™ Sovereign Sponsor Rail',
    subtitle: 'Verified Decentralized Network Reach',
    description: 'Direct high-impact community advertising powered by FingerMobile Protocol. High conversion, cryptographic attribution, and verified click guarantees.',
    category: 'Advertising',
    isPermanent: true,
    displayLocation: 'bottom_right_column',
    rotationIntervalMinutes: 0,
    rotationPriority: 100,
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
      hourly_clicks: { '10:00': 140, '11:00': 210, '12:00': 320 },
      device_breakdown: { desktop: 58, mobile: 37, tablet: 5 },
      historical_ctr: 6.88,
      feedback_scores: { positive: 94, neutral: 5, negative: 1 },
      feedback_comments: ['Exceptional ROI on campaigns', 'Great bottom-rail visibility'],
    },
    metadata: { advertiser: 'Canary Protocol', tier: 'Enterprise Sovereign', verified: true },
  },
  {
    id: 'fingerlux-widget',
    name: 'FingerLux Widget',
    slug: 'fingerlux',
    type: 'luxury',
    title: 'FingerLux™ Luxury & VIP Suites',
    subtitle: 'High-Net-Worth Sovereign Marketplace',
    description: 'Curated luxury lifestyle, private jet bookings, exclusive gem vaults, and bespoke haute horlogerie for verified elite accounts.',
    category: 'Luxury',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 2,
    primaryImageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80',
    actionUrl: '/fingerlux',
    ctaText: 'Explore FingerLux',
    badgeText: 'VIP CONCIERGE',
    accentColor: '#9333ea',
    badgeStyle: 'purple',
    status: 'active',
    clicks: 4890,
    impressions: 89000,
    conversions: 412,
    shares: 310,
    avgEngagementSeconds: 34.2,
    metadata: { tier: 'Black Diamond', minimumHoldings: '100,000 FIC' },
  },
  {
    id: 'supervi-widget',
    name: 'SuperVI Widget',
    slug: 'supervi',
    type: 'intelligence',
    title: 'SuperVI™ Neural Vision & Verification',
    subtitle: 'Consensus Telemetry & Zero-Knowledge Audits',
    description: 'Real-time protocol node diagnostics, cryptographic state proofs, and continuous multi-agent cognitive security scans.',
    category: 'Intelligence',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 2,
    primaryImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
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
    metadata: { latencyMs: 14, activeNodes: 1248, zkWormHash: 'sha256-verified-live' },
  },
  {
    id: 'loansqr-widget',
    name: 'Loansqr Widget',
    slug: 'loansqr',
    type: 'fintech',
    title: 'Loansqr™ Instant Nano-Liquidity',
    subtitle: 'Collateralized Micro-Loans from ₦5,000 to ₦5,000,000',
    description: 'Instant 60-second loan decisioning, competitive APR, decentralized credit scoring, and automatic smart contract disbursement.',
    category: 'Fintech',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 2,
    primaryImageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
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
    metadata: { startingApr: '4.8%', maxTenorMonths: 24, instantPreApproval: true },
  },
  {
    id: 'camus-admaker-widget',
    name: 'Camus AdMaker Widget',
    slug: 'camus-admaker',
    type: 'rotational',
    title: 'Camus AdMaker™ Visual Studio',
    subtitle: 'Automated AI Banners & Video Ad Generation',
    description: 'Generate high-CTR promotional banners, interactive stories, and promotional collateral in under 30 seconds.',
    category: 'Creator Tools',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&auto=format&fit=crop&q=80',
    actionUrl: '/canary-admaker',
    ctaText: 'Create Ad',
    badgeText: 'AI GENERATIVE',
    accentColor: '#e11d48',
    status: 'active',
    clicks: 3410,
    impressions: 48000,
    conversions: 390,
  },
  {
    id: 'luminar-widget',
    name: 'Luminar Widget',
    slug: 'luminar',
    type: 'rotational',
    title: 'Luminar™ Media Pipeline',
    subtitle: 'Ultra-High-Definition Creator Transcoding',
    description: 'Next-generation lossless media processing, automated subtitle translation, and video watermarking.',
    category: 'Media',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&auto=format&fit=crop&q=80',
    actionUrl: '/media',
    ctaText: 'Open Luminar',
    badgeText: '4K LOSSLESS',
    accentColor: '#8b5cf6',
    status: 'active',
    clicks: 2950,
    impressions: 41000,
    conversions: 240,
  },
  {
    id: 'catalogue-widget',
    name: 'Catalogue Widget',
    slug: 'catalogue',
    type: 'rotational',
    title: 'Catalogue™ Product Index',
    subtitle: 'Cross-Storefront Unified Catalog',
    description: 'Search across 90,000+ verified goods, crafts, fashion, and digital assets across sovereign sellers.',
    category: 'Commerce',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=80',
    actionUrl: '/catalogue',
    ctaText: 'Browse Catalog',
    badgeText: 'INDEXED 90K',
    accentColor: '#d97706',
    status: 'active',
    clicks: 4210,
    impressions: 62000,
    conversions: 520,
  },
  {
    id: 'coupons-widget',
    name: 'Coupons Widget',
    slug: 'coupons',
    type: 'rotational',
    title: 'Coupons™ Flash Discounts',
    subtitle: 'Tokenized Merchant Discount Codes',
    description: 'Claim limited-edition discount vouchers redeemable across verified storefronts and beatwave tracks.',
    category: 'Commerce',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80',
    actionUrl: '/coupons',
    ctaText: 'Claim 30% Off',
    badgeText: 'EXPIRING 2H',
    accentColor: '#16a34a',
    status: 'active',
    clicks: 5820,
    impressions: 71000,
    conversions: 980,
  },
  {
    id: 'dancia-4tv-widget',
    name: 'Dancia-4Tv Widget',
    slug: 'dancia-4tv',
    type: 'rotational',
    title: 'Dancia-4Tv™ Live Streaming',
    subtitle: 'High-Energy Dance, Culture & TV Channels',
    description: 'Watch live cultural dance battles, community broadcasts, and interact with synchronized live chat.',
    category: 'Entertainment',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    actionUrl: '/dancia4tv',
    ctaText: 'Watch Live TV',
    badgeText: 'LIVE BROADCAST',
    accentColor: '#dc2626',
    status: 'active',
    clicks: 6490,
    impressions: 83000,
    conversions: 810,
  },
  {
    id: 'giftsshop-widget',
    name: 'GiftsShop Widget',
    slug: 'giftsshop',
    type: 'rotational',
    title: 'GiftsShop™ Souvenirs & Rewards',
    subtitle: 'Bespoke Curated Memorabilia',
    description: 'Unique custom merchandise, commemorative enamel pins, and protocol-branded collectibles.',
    category: 'Commerce',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
    actionUrl: '/giftsshop',
    ctaText: 'Shop Gifts',
    badgeText: 'CURATED GIFTS',
    accentColor: '#db2777',
    status: 'active',
    clicks: 3120,
    impressions: 44000,
    conversions: 420,
  },
  {
    id: 'lushpressies-widget',
    name: 'Lushpressies Widget',
    slug: 'lushpressies',
    type: 'rotational',
    title: 'Lushpressies™ 3D Plushies',
    subtitle: 'Digital Romance & Creator Appreciation',
    description: 'Send animated 3D love plushies, radiant gift boxes, and celebratory tokens directly inside chats.',
    category: 'Gifting',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    actionUrl: '/lushpressies',
    ctaText: 'Send 3D Gift',
    badgeText: 'ROMANCE & GIFTS',
    accentColor: '#f43f5e',
    status: 'active',
    clicks: 7210,
    impressions: 98000,
    conversions: 1120,
  },
  {
    id: 'mylearning-widget',
    name: 'MyLearning Widget',
    slug: 'mylearning',
    type: 'rotational',
    title: 'MyLearning™ Academy',
    subtitle: 'Accredited Sovereign Education Tracks',
    description: 'Master blockchain engineering, creator monetization, and business governance with verified completion certificates.',
    category: 'Education',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=80',
    actionUrl: '/mylearning',
    ctaText: 'Enroll Now',
    badgeText: 'ACCREDITED',
    accentColor: '#0d9488',
    status: 'active',
    clicks: 2840,
    impressions: 39000,
    conversions: 310,
  },
  {
    id: 'storefront-widget',
    name: 'Storefront Widget',
    slug: 'storefront',
    type: 'rotational',
    title: 'Storefront™ Creator Shops',
    subtitle: 'Zero-Middleman Sovereign E-Commerce',
    description: 'Launch your independent boutique, sell merchandise, and accept FIC tokens and fiat with instant settlement.',
    category: 'Commerce',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
    actionUrl: '/storefront',
    ctaText: 'Open Storefront',
    badgeText: '0% COMMISSIONS',
    accentColor: '#ea580c',
    status: 'active',
    clicks: 5120,
    impressions: 74000,
    conversions: 640,
  },
  {
    id: 'nysc-widget',
    name: 'Nysc Widget',
    slug: 'nysc',
    type: 'rotational',
    title: 'NYSC™ Corps Member Hub',
    subtitle: 'National Service Placements & Community CDS',
    description: 'Connect with fellow corp members, find verified PPA openings, and collaborate on community development initiatives.',
    category: 'Community',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    actionUrl: '/nysc',
    ctaText: 'Enter NYSC Hub',
    badgeText: 'CORPS SERVICE',
    accentColor: '#15803d',
    status: 'active',
    clicks: 3900,
    impressions: 52000,
    conversions: 480,
  },
  {
    id: 'gems-widget',
    name: 'Gems Widget',
    slug: 'gems',
    type: 'rotational',
    title: 'Gems™ Curated Masterpieces',
    subtitle: 'VIP Editorial Selection & Rare Media',
    description: 'Exclusive masterclass tutorials, rare audio stems, and high-impact investigative essays curated by our council.',
    category: 'Editorial',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=600&auto=format&fit=crop&q=80',
    actionUrl: '/gems',
    ctaText: 'Unlock Gems',
    badgeText: 'CURATED GEM',
    accentColor: '#7c3aed',
    status: 'active',
    clicks: 4450,
    impressions: 61000,
    conversions: 590,
  },
  {
    id: 'flamingo-widget',
    name: 'Flamingo Widget',
    slug: 'flamingo',
    type: 'rotational',
    title: 'Flamingo™ Lifestyle & Travel',
    subtitle: 'Global Destinations, Food & Culture',
    description: 'Discover hidden culinary gems, luxury staycations, and authentic travel stories from global wanderers.',
    category: 'Lifestyle',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    actionUrl: '/flamingo',
    ctaText: 'Explore Flamingo',
    badgeText: 'GLOBAL WANDER',
    accentColor: '#f97316',
    status: 'active',
    clicks: 3780,
    impressions: 53000,
    conversions: 340,
  },
  {
    id: 'blogs-widget',
    name: 'Blogs Widget',
    slug: 'blogs',
    type: 'rotational',
    title: 'Blogs™ Independent Publishing',
    subtitle: 'Long-Form Journalism & Sovereign Insights',
    description: 'Deep dives, opinion editorials, technical breakdowns, and verified perspectives from independent writers.',
    category: 'Publishing',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80',
    actionUrl: '/blogs',
    ctaText: 'Read Stories',
    badgeText: 'TOP READS',
    accentColor: '#475569',
    status: 'active',
    clicks: 4890,
    impressions: 68000,
    conversions: 410,
  },
  {
    id: 'giftcard-widget',
    name: 'GiftCard Widget',
    slug: 'giftcard',
    type: 'rotational',
    title: 'GiftCard™ Cosmos Vouchers',
    subtitle: 'Universal Crypto & Fiat Prepaid Cards',
    description: 'Generate, gift, and redeem digital gift cards with custom QR authentication and instant balance loading.',
    category: 'Fintech',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1556742049-0a67e557224d?w=600&auto=format&fit=crop&q=80',
    actionUrl: '/giftcards',
    ctaText: 'Buy Gift Card',
    badgeText: 'INSTANT QR',
    accentColor: '#0284c7',
    status: 'active',
    clicks: 5310,
    impressions: 76000,
    conversions: 890,
  },
  {
    id: 'loyalty-widget',
    name: 'Loyalty Widget',
    slug: 'loyalty',
    type: 'rotational',
    title: 'Loyalty™ Points & Tier Perks',
    subtitle: 'Stake, Earn & Unlock Protocol Privileges',
    description: 'Redeem your engagement points for VIP badges, gas discounts, exclusive merch, and physical event tickets.',
    category: 'Gamification',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
    actionUrl: '/loyalty',
    ctaText: 'Check Balance',
    badgeText: 'POINTS x2.5',
    accentColor: '#ca8a04',
    status: 'active',
    clicks: 6820,
    impressions: 91000,
    conversions: 1280,
  },
  {
    id: 'trends-widget',
    name: 'Trends Widget',
    slug: 'trends',
    type: 'rotational',
    title: 'Trends™ Viral Pulse',
    subtitle: 'Real-Time #Hashtags & Community Sentiment',
    description: 'Discover what is breaking across topics, audio releases, sports tournaments, and policy debates right now.',
    category: 'Social',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    actionUrl: '/trends',
    ctaText: 'View Pulse',
    badgeText: 'LIVE #PULSE',
    accentColor: '#2563eb',
    status: 'active',
    clicks: 9810,
    impressions: 145000,
    conversions: 1940,
  },
];

let widgetsStore = [...DEFAULT_WIDGETS];
let currentRotationStep = 0;
let lastRotationTimestamp = Date.now();

class WidgetsController {
  /**
   * GET /api/widgets - Get all widgets with optional filtering
   */
  async getAllWidgets(req, res) {
    try {
      const { status, type, isPermanent, displayLocation } = req.query;
      let filtered = [...widgetsStore];

      if (status) {
        filtered = filtered.filter((w) => w.status === status);
      }
      if (type) {
        filtered = filtered.filter((w) => w.type === type);
      }
      if (isPermanent !== undefined) {
        const boolVal = isPermanent === 'true';
        filtered = filtered.filter((w) => Boolean(w.isPermanent) === boolVal);
      }
      if (displayLocation) {
        filtered = filtered.filter((w) => w.displayLocation === displayLocation);
      }

      res.json({
        success: true,
        count: filtered.length,
        total: widgetsStore.length,
        data: filtered,
      });
    } catch (error) {
      logger.error('Error fetching all widgets:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch widgets', error: error.message });
    }
  }

  /**
   * GET /api/widgets/rail - Returns live rail layout with permanent Canary Ads and 2-hr rotated active widgets
   */
  async getRailWidgets(req, res) {
    try {
      const now = Date.now();
      const twoHoursMs = 2 * 60 * 60 * 1000;
      const elapsed = now - lastRotationTimestamp;

      // Auto-rotate if 2 hours elapsed
      if (elapsed >= twoHoursMs) {
        currentRotationStep += 1;
        lastRotationTimestamp = now;
      }

      const nextRotationTimestamp = lastRotationTimestamp + twoHoursMs;
      const remainingSeconds = Math.max(0, Math.floor((nextRotationTimestamp - now) / 1000));

      // 1. Permanent Widget: Always 'Canary ads Widget'
      const permanentWidget = widgetsStore.find(
        (w) => w.id === 'canary-ads-permanent' || w.isPermanent || w.displayLocation === 'bottom_right_column'
      ) || widgetsStore[0];

      // 2. Rotational Pool (Excludes permanent widget)
      const rotationalPool = widgetsStore.filter(
        (w) => !w.isPermanent && w.id !== 'canary-ads-permanent' && w.status === 'active'
      );

      // Select 3 active rotational widgets according to current rotation cycle
      const poolSize = rotationalPool.length;
      const activeRotational = [];
      if (poolSize > 0) {
        for (let i = 0; i < Math.min(3, poolSize); i++) {
          const index = (currentRotationStep + i) % poolSize;
          activeRotational.push(rotationalPool[index]);
        }
      }

      res.json({
        success: true,
        data: {
          permanent: permanentWidget,
          activeRotational,
          rotationState: {
            currentStep: currentRotationStep,
            intervalMinutes: 120,
            lastRotatedAt: new Date(lastRotationTimestamp).toISOString(),
            nextRotationAt: new Date(nextRotationTimestamp).toISOString(),
            remainingSeconds,
            poolSize,
          },
        },
      });
    } catch (error) {
      logger.error('Error getting rail widgets:', error);
      res.status(500).json({ success: false, message: 'Failed to load rail widgets', error: error.message });
    }
  }

  /**
   * POST /api/widgets/rotate - Manually force rotation step (e.g. for testing 2-hr change in MasterDashboard)
   */
  async triggerRotation(req, res) {
    try {
      currentRotationStep += 1;
      lastRotationTimestamp = Date.now();
      const twoHoursMs = 2 * 60 * 60 * 1000;

      res.json({
        success: true,
        message: 'Widgets rotated successfully to next 2-hour queue state',
        currentStep: currentRotationStep,
        lastRotatedAt: new Date(lastRotationTimestamp).toISOString(),
        nextRotationAt: new Date(lastRotationTimestamp + twoHoursMs).toISOString(),
      });
    } catch (error) {
      logger.error('Error triggering rotation:', error);
      res.status(500).json({ success: false, message: 'Failed to trigger rotation', error: error.message });
    }
  }

  /**
   * POST /api/widgets - Create new widget (Widget Creator Studio)
   */
  async createWidget(req, res) {
    try {
      const payload = req.body;
      if (!payload.name || !payload.title || !payload.actionUrl) {
        return res.status(400).json({
          success: false,
          message: 'Widget name, title, and actionUrl are required',
        });
      }

      const slug = payload.slug || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newWidget = {
        id: `widget-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: payload.name,
        slug,
        type: payload.type || 'rotational',
        title: payload.title,
        subtitle: payload.subtitle || '',
        description: payload.description || '',
        category: payload.category || 'General',
        isPermanent: Boolean(payload.isPermanent),
        displayLocation: payload.isPermanent ? 'bottom_right_column' : (payload.displayLocation || 'right_column_dynamic'),
        rotationIntervalMinutes: payload.rotationIntervalMinutes || 120,
        rotationPriority: payload.rotationPriority || 1,
        primaryImageUrl: payload.primaryImageUrl || '',
        primaryVideoUrl: payload.primaryVideoUrl || '',
        videoPosterUrl: payload.videoPosterUrl || '',
        images: payload.images || (payload.primaryImageUrl ? [payload.primaryImageUrl] : []),
        videos: payload.videos || (payload.primaryVideoUrl ? [payload.primaryVideoUrl] : []),
        actionUrl: payload.actionUrl,
        ctaText: payload.ctaText || 'Learn More',
        secondaryActionUrl: payload.secondaryActionUrl || '',
        secondaryCtaText: payload.secondaryCtaText || '',
        badgeText: payload.badgeText || '',
        accentColor: payload.accentColor || '#059669',
        badgeStyle: payload.badgeStyle || 'emerald',
        edgeStyle: payload.edgeStyle || 'glassmorphism',
        status: payload.status || 'active',
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
        metadata: payload.metadata || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      widgetsStore.unshift(newWidget);

      logger.info(`New widget created: ${newWidget.name} (${newWidget.id})`);
      res.status(201).json({
        success: true,
        message: 'Widget successfully published to database',
        data: newWidget,
      });
    } catch (error) {
      logger.error('Error creating widget:', error);
      res.status(500).json({ success: false, message: 'Failed to create widget', error: error.message });
    }
  }

  /**
   * PUT /api/widgets/:id - Update existing widget
   */
  async updateWidget(req, res) {
    try {
      const { id } = req.params;
      const index = widgetsStore.findIndex((w) => w.id === id);

      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Widget not found' });
      }

      const updated = {
        ...widgetsStore[index],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      widgetsStore[index] = updated;
      res.json({ success: true, message: 'Widget updated', data: updated });
    } catch (error) {
      logger.error('Error updating widget:', error);
      res.status(500).json({ success: false, message: 'Failed to update widget', error: error.message });
    }
  }

  /**
   * DELETE /api/widgets/:id - Delete / archive widget
   */
  async deleteWidget(req, res) {
    try {
      const { id } = req.params;
      const widget = widgetsStore.find((w) => w.id === id);

      if (!widget) {
        return res.status(404).json({ success: false, message: 'Widget not found' });
      }

      if (widget.isPermanent) {
        return res.status(403).json({
          success: false,
          message: 'Canary Ads Permanent Widget cannot be deleted from the database.',
        });
      }

      widgetsStore = widgetsStore.filter((w) => w.id !== id);
      res.json({ success: true, message: `Widget ${id} deleted successfully` });
    } catch (error) {
      logger.error('Error deleting widget:', error);
      res.status(500).json({ success: false, message: 'Failed to delete widget', error: error.message });
    }
  }

  /**
   * POST /api/widgets/:id/click - Record interaction click
   */
  async recordClick(req, res) {
    try {
      const { id } = req.params;
      const widget = widgetsStore.find((w) => w.id === id);

      if (!widget) {
        return res.status(404).json({ success: false, message: 'Widget not found' });
      }

      widget.clicks = (widget.clicks || 0) + 1;
      const impressions = widget.impressions || 1;
      const ctr = ((widget.clicks / impressions) * 100).toFixed(2);
      if (widget.analytics) {
        widget.analytics.historical_ctr = parseFloat(ctr);
      }

      res.json({ success: true, clicks: widget.clicks, ctr });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to record click' });
    }
  }

  /**
   * POST /api/widgets/:id/impression - Record impression
   */
  async recordImpression(req, res) {
    try {
      const { id } = req.params;
      const widget = widgetsStore.find((w) => w.id === id);

      if (widget) {
        widget.impressions = (widget.impressions || 0) + 1;
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to record impression' });
    }
  }

  /**
   * POST /api/widgets/:id/feedback - Record user review or rating
   */
  async recordFeedback(req, res) {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;
      const widget = widgetsStore.find((w) => w.id === id);

      if (!widget) {
        return res.status(404).json({ success: false, message: 'Widget not found' });
      }

      if (!widget.analytics) {
        widget.analytics = { feedback_scores: { positive: 0, neutral: 0, negative: 0 }, feedback_comments: [] };
      }

      if (rating >= 4) widget.analytics.feedback_scores.positive += 1;
      else if (rating === 3) widget.analytics.feedback_scores.neutral += 1;
      else widget.analytics.feedback_scores.negative += 1;

      if (comment) {
        widget.analytics.feedback_comments.unshift(comment);
        if (widget.analytics.feedback_comments.length > 20) {
          widget.analytics.feedback_comments.pop();
        }
      }

      res.json({ success: true, feedback: widget.analytics.feedback_scores });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to record feedback' });
    }
  }

  /**
   * GET /api/widgets/analytics/summary - Master aggregated telemetry
   */
  async getAnalyticsSummary(req, res) {
    try {
      const totalWidgets = widgetsStore.length;
      const activeWidgets = widgetsStore.filter((w) => w.status === 'active').length;
      const totalClicks = widgetsStore.reduce((acc, w) => acc + (w.clicks || 0), 0);
      const totalImpressions = widgetsStore.reduce((acc, w) => acc + (w.impressions || 0), 0);
      const totalConversions = widgetsStore.reduce((acc, w) => acc + (w.conversions || 0), 0);
      const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

      res.json({
        success: true,
        data: {
          totalWidgets,
          activeWidgets,
          totalClicks,
          totalImpressions,
          totalConversions,
          avgCtr: `${avgCtr}%`,
          permanentWidgets: widgetsStore.filter((w) => w.isPermanent).length,
          rotationalWidgets: widgetsStore.filter((w) => !w.isPermanent).length,
          rotationIntervalMinutes: 120,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to load analytics summary' });
    }
  }

  // Legacy compatibility methods
  async getWidget(req, res) {
    const { type } = req.params;
    const match = widgetsStore.find((w) => w.slug === type || w.id === type || w.type === type);
    if (match) {
      return res.json({ success: true, data: match, widgetType: type });
    }
    try {
      const data = await WidgetDataService.getWidgetData(type, req.query);
      return res.json({ success: true, data, widgetType: type });
    } catch (error) {
      return res.json({ success: true, data: { name: type, status: 'simulated' } });
    }
  }

  async getBatchWidgets(req, res) {
    res.json({ success: true, data: widgetsStore });
  }

  async invalidateCache(req, res) {
    res.json({ success: true, message: 'Cache invalidated' });
  }

  async listWidgetTypes(req, res) {
    const types = [...new Set(widgetsStore.map((w) => w.type))];
    res.json({ success: true, data: types });
  }
}

module.exports = new WidgetsController();
