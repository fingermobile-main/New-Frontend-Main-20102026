/**
 * FingerMobile Protocol™ - Official Ecosystem Branding & Asset Placements
 * Master Source of Truth for Platform Logos, Icons, Taglines & Routes
 *
 * Platforms:
 * 1. PhotoCredits
 * 2. Dancia-4Tv
 * 3. BeatwaveNG
 * 4. MarketPlace
 * 5. FingerLux
 * 6. Finger Infinite Coin (FIC)
 * 7. SuperVi
 * 8. Flamingo
 * 9. LushPressies
 * 10. tribut
 * Core: FingerMobile Protocol, ORMUS
 */

export interface PlatformBrand {
  key: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  iconUrl: string;
  faviconUrl: string;
  route: string;
  category: 'media' | 'commerce' | 'fintech' | 'gaming' | 'luxury' | 'social' | 'governance' | 'core';
  badgeText: string;
  badgeColor: string;
  borderHoverColor: string;
  gradientFrom: string;
  gradientTo: string;
  medallionUrl?: string;
  masterPngUrl?: string;
  thumbnailUrl?: string;
  previewDarkUrl?: string;
  sha256?: string;
}

export const PLATFORM_BRANDS: Record<string, PlatformBrand> = {
  photocredits: {
    key: 'photocredits',
    name: 'PhotoCredits',
    tagline: 'Sovereign Photography Licensing & 80/20 Creator Split',
    description: 'Decentralized photography licensing, 80/20 creator revenue splits, and 22-day monthly UGC contest pool with 150,000 FIC prizes.',
    logoUrl: '/assets/logos/photocredits_logo.png',
    iconUrl: '/assets/logos/photocredits_icon.png',
    faviconUrl: '/photocredits-favicon.ico',
    route: '/photocredits',
    category: 'media',
    badgeText: '80/20 UGC Split',
    badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-400',
    borderHoverColor: 'hover:border-emerald-500',
    gradientFrom: 'from-amber-600',
    gradientTo: 'to-emerald-600'
  },
  dancia4tv: {
    key: 'dancia4tv',
    name: 'Dancia-4Tv',
    tagline: '4K Television, Visual Reels & Choreography Network',
    description: 'High-definition broadcast television network, cultural choreography, creator video reels, interactive studio showcases, and livestreams.',
    logoUrl: '/assets/logos/dancia4tv_logo.png',
    iconUrl: '/assets/logos/dancia4tv_logo.png',
    faviconUrl: '/dancia-favicon.ico',
    route: '/dancia-4tv',
    category: 'media',
    badgeText: '4K Studio Broadcast',
    badgeColor: 'bg-blue-100 text-blue-950 border-blue-400',
    borderHoverColor: 'hover:border-blue-500',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-indigo-600'
  },
  beatwaveng: {
    key: 'beatwaveng',
    name: 'BeatwaveNG',
    tagline: 'Audio & Live Beats Next-Gen Broadcast',
    description: 'Sovereign music streaming, live internet radio stations, DJ mixtape distribution, genre aggregators, and professional master studio equalizers.',
    logoUrl: '/assets/logos/beatwaveng_logo.png',
    iconUrl: '/assets/logos/beatwaveng_logo.png',
    faviconUrl: '/beatwave-favicon.ico',
    route: '/beatwave-ng',
    category: 'media',
    badgeText: 'Live Audio & DJ Mixes',
    badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-400',
    borderHoverColor: 'hover:border-emerald-500',
    gradientFrom: 'from-emerald-600',
    gradientTo: 'to-teal-600'
  },
  marketplace: {
    key: 'marketplace',
    name: 'MarketPlace',
    tagline: 'Sovereign Multi-Vendor Commerce & Logistics',
    description: 'Decentralized digital and physical marketplace connecting verified vendors, smart catalog escrow, buyer protection and multi-currency checkouts.',
    logoUrl: '/assets/logos/marketplace_logo.png',
    iconUrl: '/assets/logos/marketplace_icon.png',
    faviconUrl: '/marketplace-favicon.ico',
    route: '/marketplace',
    category: 'commerce',
    badgeText: 'Multi-Vendor Stores',
    badgeColor: 'bg-amber-100 text-amber-950 border-amber-400',
    borderHoverColor: 'hover:border-amber-500',
    gradientFrom: 'from-amber-600',
    gradientTo: 'to-yellow-600'
  },
  fingerlux: {
    key: 'fingerlux',
    name: 'FingerLux',
    tagline: 'All-in-One Scheduling, Concierge & High-Net-Worth Showcase',
    description: 'Ultra-luxury concierge, appointment scheduling, high-net-worth portfolio assets, private jets, fine art, and bespoke lifestyle booking.',
    logoUrl: '/assets/logos/fingerlux_logo.jpg',
    iconUrl: '/assets/logos/fingerlux_icon.png',
    faviconUrl: '/fingerlux-favicon.ico',
    route: '/fingerlux',
    category: 'luxury',
    badgeText: 'Prestige Concierge',
    badgeColor: 'bg-indigo-100 text-indigo-950 border-indigo-400',
    borderHoverColor: 'hover:border-indigo-500',
    gradientFrom: 'from-indigo-700',
    gradientTo: 'to-slate-900'
  },
  fic: {
    key: 'fic',
    name: 'Finger Infinite Coin',
    tagline: 'Sovereign Protocol Currency & Settlement Token',
    description: 'Cryptographic utility coin powering on-chain and off-chain settlements, peer-to-peer tipping, corporate vaults, and marketplace liquidation.',
    logoUrl: '/assets/fic/03_thumbnail_512.png',
    iconUrl: '/assets/fic/03_thumbnail_512.png',
    medallionUrl: '/assets/fic/02_web_transparent.webp',
    masterPngUrl: '/assets/fic/01_master_transparent.png',
    thumbnailUrl: '/assets/fic/03_thumbnail_512.png',
    previewDarkUrl: '/assets/fic/04_preview_dark.jpg',
    sha256: '8cde84afbdbd1e20e0394bbb2a418a39513fe68e245bf68267a5506c819611e3',
    faviconUrl: '/fic-favicon.ico',
    route: '/wallet',
    category: 'fintech',
    badgeText: 'Native Protocol Coin',
    badgeColor: 'bg-amber-100 text-amber-950 border-amber-400',
    borderHoverColor: 'hover:border-amber-500',
    gradientFrom: 'from-yellow-600',
    gradientTo: 'to-amber-700'
  },
  supervi: {
    key: 'supervi',
    name: 'SuperVi',
    tagline: 'Orbs of Glory - Rise of the Six Gaming Enclave',
    description: 'High-octane endless runner, competitive multiplayer sessions, esports tournaments, leaderboard seasons, and legendary character unlocks.',
    logoUrl: '/assets/logos/supervi_logo.png',
    iconUrl: '/assets/logos/supervi_logo.png',
    faviconUrl: '/supervi-favicon.ico',
    route: '/games/supervi',
    category: 'gaming',
    badgeText: 'Esports Runner',
    badgeColor: 'bg-cyan-100 text-cyan-950 border-cyan-400',
    borderHoverColor: 'hover:border-cyan-500',
    gradientFrom: 'from-cyan-600',
    gradientTo: 'to-blue-700'
  },
  flamingo: {
    key: 'flamingo',
    name: 'Flamingo',
    tagline: 'Curated Boutique & Bespoke Lifestyle Apparel',
    description: 'Curated lifestyle boutique, artisanal fashion, and bespoke retail experience with age-verified privacy and private member collections.',
    logoUrl: '/assets/logos/flamingo_logo.jpg',
    iconUrl: '/assets/logos/flamingo_icon.png',
    faviconUrl: '/flamingo-favicon.ico',
    route: '/flamingo',
    category: 'commerce',
    badgeText: 'Bespoke Boutique',
    badgeColor: 'bg-pink-100 text-pink-950 border-pink-400',
    borderHoverColor: 'hover:border-pink-500',
    gradientFrom: 'from-pink-600',
    gradientTo: 'to-rose-700'
  },
  lushpressies: {
    key: 'lushpressies',
    name: 'LushPressies',
    tagline: 'Matchmaking & Luxury Plushies Gifting',
    description: 'Empathetic social connection, consensual 6-digit PIN handshake verification, Lapidaire icebreaker Q&A, and plushies gift exchanges.',
    logoUrl: '/assets/logos/lushpressies_logo.png',
    iconUrl: '/assets/logos/lushpressies_logo.png',
    faviconUrl: '/lushpressies-favicon.ico',
    route: '/lush-pressies',
    category: 'social',
    badgeText: 'Match & Gifting',
    badgeColor: 'bg-rose-100 text-rose-950 border-rose-400',
    borderHoverColor: 'hover:border-rose-500',
    gradientFrom: 'from-rose-600',
    gradientTo: 'to-pink-700'
  },
  tribut: {
    key: 'tribut',
    name: 'tribut',
    tagline: 'Memorials, Honors, Heritage & Legacy Preservation',
    description: 'Digital memorials, enduring heritage registries, sovereign obituaries, lifetime achievement honors, and permanent legacy preservation.',
    logoUrl: '/assets/logos/tribut_logo.webp',
    iconUrl: '/assets/logos/tribut_icon.png',
    faviconUrl: '/tribut-favicon.ico',
    route: '/tribut',
    category: 'social',
    badgeText: 'Legacy & Honors',
    badgeColor: 'bg-purple-100 text-purple-950 border-purple-400',
    borderHoverColor: 'hover:border-purple-500',
    gradientFrom: 'from-amber-700',
    gradientTo: 'to-purple-900'
  },
  fingermobile: {
    key: 'fingermobile',
    name: 'FingerMobile Protocol',
    tagline: 'Sovereign Decentralized Media & Unified Ecosystem',
    description: 'Primary platform infrastructure uniting sovereign creators, tokenized commerce, high-speed streaming, and enterprise governance.',
    logoUrl: '/assets/logos/fingermobile_logo.webp',
    iconUrl: '/assets/logos/fingermobile_logo.webp',
    faviconUrl: '/favicon.ico',
    route: '/',
    category: 'core',
    badgeText: 'Protocol Core',
    badgeColor: 'bg-orange-100 text-orange-950 border-orange-400',
    borderHoverColor: 'hover:border-orange-500',
    gradientFrom: 'from-orange-600',
    gradientTo: 'to-amber-600'
  },
  ormus: {
    key: 'ormus',
    name: 'ORMUS',
    tagline: 'STERCS Enclave, Protocol Governance & Audit',
    description: 'Sovereign Technical Enforcement & Regulatory Compliance System (STERCS) enclave providing mathematical consensus and policy governance.',
    logoUrl: '/assets/logos/ormus_logo.png',
    iconUrl: '/assets/logos/ormus_logo.png',
    faviconUrl: '/favicon.ico',
    route: '/council/governance',
    category: 'governance',
    badgeText: 'STERCS Enclave',
    badgeColor: 'bg-slate-100 text-slate-950 border-slate-400',
    borderHoverColor: 'hover:border-slate-500',
    gradientFrom: 'from-slate-700',
    gradientTo: 'to-slate-950'
  }
};

export const ORDERED_PLATFORM_BRANDS: PlatformBrand[] = [
  PLATFORM_BRANDS.photocredits,
  PLATFORM_BRANDS.dancia4tv,
  PLATFORM_BRANDS.beatwaveng,
  PLATFORM_BRANDS.marketplace,
  PLATFORM_BRANDS.fingerlux,
  PLATFORM_BRANDS.fic,
  PLATFORM_BRANDS.supervi,
  PLATFORM_BRANDS.flamingo,
  PLATFORM_BRANDS.lushpressies,
  PLATFORM_BRANDS.tribut
];
