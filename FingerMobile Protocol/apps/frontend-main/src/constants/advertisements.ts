/**
 * Canary Ads & Marketing Specifications - FingerMobile Protocol™
 * Synchronized with PostgreSQL `advertisements` and `canary_ad_groups` tables.
 */

export interface AdPlacementDefinition {
  id: string;
  name: string;
  description: string;
  supportedFormats: ('banner' | 'video' | 'card' | 'overlay')[];
  recommendedAspect: string;
  minCpcFic: number;
}

export interface AdTypeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface AdvertisementRecord {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  landingPageUrl: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  status: 'active' | 'paused' | 'draft' | 'completed';
}

export const AD_PLACEMENTS: AdPlacementDefinition[] = [
  {
    id: 'feed_inline',
    name: 'Feed In-Stream Native Card',
    description: 'High-engagement display card rendered seamlessly inside social and music feeds',
    supportedFormats: ['card', 'banner', 'video'],
    recommendedAspect: '16:9 / 1:1',
    minCpcFic: 0.25
  },
  {
    id: 'story_overlay',
    name: 'Mii & Live Story Overlay',
    description: 'Vertical immersive sponsor placement during creator stories and live broadcasts',
    supportedFormats: ['overlay', 'video'],
    recommendedAspect: '9:16',
    minCpcFic: 0.50
  },
  {
    id: 'sidebar_banner',
    name: 'Console & Sidebar Banner',
    description: 'Sticky high-visibility sidebar showcase across desktop master consoles',
    supportedFormats: ['banner'],
    recommendedAspect: '300x250 / 300x600',
    minCpcFic: 0.15
  },
  {
    id: 'search_sponsored',
    name: 'Guardian Lens Sponsored Result',
    description: 'Promoted top placement when members use multimodal AI image and keyword search',
    supportedFormats: ['card'],
    recommendedAspect: '1:1',
    minCpcFic: 0.35
  },
  {
    id: 'video_preroll',
    name: 'Dancia-4Tv®™© Video Pre-Roll',
    description: 'Non-intrusive 6-15s sponsor intro preceding sovereign video streaming',
    supportedFormats: ['video'],
    recommendedAspect: '16:9',
    minCpcFic: 0.75
  }
];

export const AD_TYPES: AdTypeDefinition[] = [
  {
    id: 'canary_display_card',
    name: 'Canary Display Card',
    description: 'Standard responsive card with headline, thumbnail, and action button',
    icon: 'Layout'
  },
  {
    id: 'video_spotlight',
    name: 'Video Spotlight',
    description: 'Rich media auto-play stream with audio toggle and direct checkout',
    icon: 'Video'
  },
  {
    id: 'sponsored_product',
    name: 'Flamingo Sponsored Product',
    description: 'Commerce product card with instant FIC buy-now integration',
    icon: 'ShoppingBag'
  },
  {
    id: 'sovereign_partner_showcase',
    name: 'Sovereign Partner Showcase',
    description: 'Exclusive enterprise institutional badge and verified sponsor seal',
    icon: 'ShieldCheck'
  }
];

export const SEEDED_POSTGRES_ADVERTISEMENTS: AdvertisementRecord[] = [
  {
    id: 'ad-fingerbio-passkey',
    title: 'FingerBio™ Biometric Passkey Gate',
    description: 'Secure your digital assets with tamper-proof FIDO2 hardware biometric keys.',
    imageUrl: '/assets/fic/01_master_transparent.png',
    landingPageUrl: '/security/biometrics',
    budget: 5000.0,
    spent: 1420.5,
    impressions: 48200,
    clicks: 3120,
    status: 'active'
  },
  {
    id: 'ad-flamingo-sovereign',
    title: 'Flamingo Sovereign Marketplace',
    description: 'Shop authentic artisan leathercraft and bespoke luxury apparel directly with FIC.',
    imageUrl: '/assets/fic/03_thumbnail_512.png',
    landingPageUrl: '/storefront',
    budget: 8500.0,
    spent: 3200.0,
    impressions: 92400,
    clicks: 6810,
    status: 'active'
  },
  {
    id: 'ad-canary-community',
    title: 'Canary Targeted Community Ads',
    description: 'Launch hyper-targeted conversational ads to verified African enterprises.',
    imageUrl: '/assets/logos/fic_logo.png',
    landingPageUrl: '/canary-ad-maker',
    budget: 3000.0,
    spent: 890.0,
    impressions: 24100,
    clicks: 1940,
    status: 'active'
  }
];

export default SEEDED_POSTGRES_ADVERTISEMENTS;
