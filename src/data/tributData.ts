/**
 * FingerMobile Sovereign Tribut & Guardian AI Smart Feed Data
 * Business Model Reference: Tribut Business Model 15102026.md
 *
 * Features:
 * - Guardian AI curation & 5 Algorithmic Pillars
 *   1. Domain Quality
 *   2. Pin Usage (Saves/Uses, Closeups, Outbound Clicks)
 *   3. Topic Relevance & SEO (Guardian AI Vision)
 *   4. Pinner Quality (2:3 Vertical Consistency)
 *   5. Rich Profile Data Sync (OOC Live Pricing)
 * - 2 Primary Locations: Tribut Smart Feed & Personalized Search Feed (Sidebar)
 * - Shopping Engine Ad Ecosystem (MarketPlace, Storefront, OwnIt, Flamingo)
 * - Buy and Share Profit Earning System
 */

export interface AlgorithmicPillars {
  domainQualityScore: number; // 0 - 100
  pinUsageScore: number; // 0 - 100
  topicRelevanceSeoScore: number; // 0 - 100
  pinnerQualityScore: number; // 0 - 100
  richProfileDataSync: boolean; // OOC live API synced
  overallGuardianScore: number; // composite 0 - 100
}

export interface ShoppingProductMeta {
  isShoppable: boolean;
  storeEngine: 'MarketPlace' | 'Storefront' | 'OwnIt' | 'Flamingo' | 'ShopifyPartner';
  productName: string;
  priceNgn: number;
  priceFic: number;
  originalPriceNgn?: number;
  inStock: boolean;
  merchantName: string;
  merchantDomain: string;
  buyAndShareCommissionPercent: number; // e.g. 5% commission on shared purchase
  canaryAdCampaign?: string;
  liveCatalogSync: boolean;
}

export interface PinCommentItem {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: {
    id: string;
    authorName: string;
    authorHandle: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
    likes: number;
  }[];
  critiqueTag?: string; // e.g. "Color Grading", "Fabric Texture", "Shape Up"
}

export interface TributPinItem {
  id: string;
  title: string;
  description: string;
  altText: string;
  category: 'interior' | 'fashion' | 'tech' | 'art' | 'culinary' | 'wellness' | 'architecture' | 'automotive';
  categoryLabel: string;
  boardName: string;
  aspectRatio: '2:3' | '3:4' | '1:1';
  mediaUrl: string;
  mediaType?: 'image' | 'video' | 'collage';
  multiMediaUrls?: string[];
  videoUrl?: string;
  colorPalette?: string[]; // e.g. hex colors for skin tone / mood swatches
  promptRecipe?: string; // AI prompt or design recipe
  priority?: 'high' | 'medium' | 'normal';
  commentsCount?: number;
  comments?: PinCommentItem[];
  beforeAfter?: {
    beforeUrl: string;
    afterUrl: string;
    labelBefore: string;
    labelAfter: string;
  };
  author: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    domainReputation: 'Sovereign Verified' | 'High Authority' | 'Master Creator' | 'Merchant Partner';
    consistencyStreak: string; // e.g. '42-Day Daily Pin Streak'
  };
  guardianAiRank?: number; // Real-time rank among 1.24M indexed platform media
  ugcSource?: {
    platformOrigin: 'Member Post' | 'Forum Design Showcase' | 'MarketPlace Lookbook' | 'Dancia4TV' | 'Beats Stems' | 'Direct Pin Upload';
    originalPostId?: string;
    curationTimestamp: string;
    curatorAiScore: number; // e.g. 98.9
    viralDecayProtection: boolean; // true = long shelf life
  };
  metrics: {
    saves: number; // Pin Uses / Long-term shelf-life signal
    downloads?: number; // Prioritized downloads
    closeups: number;
    outboundClicks: number;
    likes: number;
    shelfLifeDays: number; // long shelf life proof
  };
  pillars: AlgorithmicPillars;
  shopping?: ShoppingProductMeta;
  promoted?: {
    isPromoted: boolean;
    campaignType: 'Brand Awareness' | 'Performance CPC' | 'Canary Shopping Ad';
    sponsorName: string;
    cpcRateFic?: number;
  };
  tags: string[];
}

export interface UserProjectBoard {
  id: string;
  name: string;
  pinCount: number;
  coverImage: string;
  purpose: 'Project Planning' | 'Idea Ideation' | 'Shopping Wishlist' | 'Brand Moodboard';
  isPrivate: boolean;
  pinnedPinIds?: string[];
  priorityLevel?: 'high' | 'medium' | 'normal';
  colorPalette?: string[];
  discussionCount?: number;
}

export type TributDisplayStyle =
  | 'grid'
  | 'diptych-triptych'
  | 'magnetic-pages'
  | 'thematic-moodboards'
  | 'grid-2x2'
  | 'grid-3x3'
  | 'equal-triptych'
  | 'mixed-size-grid'
  | 'feature-hero'
  | 'classic-stack-feature'
  | 'before-and-after';

export interface DisplayStyleOption {
  id: TributDisplayStyle;
  label: string;
  category: 'Multi-Photo & Collage' | 'Grid & Symmetrical' | 'Feature & Hierarchy';
  description: string;
  iconName: string;
  layoutCount: string;
}

export const TRIBUT_DISPLAY_STYLES: DisplayStyleOption[] = [
  // Multi-Photo and Collage Display Styles
  {
    id: 'grid',
    label: 'Grid-Style Photo Wall',
    category: 'Multi-Photo & Collage',
    description: 'Uniform rows and columns creating a clean, modern, architectural photo wall layout.',
    iconName: 'GridIcon',
    layoutCount: 'Uniform Multi-Row'
  },
  {
    id: 'diptych-triptych',
    label: 'Diptychs & Triptychs',
    category: 'Multi-Photo & Collage',
    description: 'Pairing two or three images side-by-side or stacked to tell a sequential story and progression.',
    iconName: 'ViewListIcon',
    layoutCount: '2-3 Image Story'
  },
  {
    id: 'magnetic-pages',
    label: 'Self-Adhesive Magnetic Pages',
    category: 'Multi-Photo & Collage',
    description: 'Peel-back clear glassmorphic overlay sheets freely positioning mixed photo sizes and cutout angles.',
    iconName: 'SwatchIcon',
    layoutCount: 'Glassmorphic Peel'
  },
  {
    id: 'thematic-moodboards',
    label: 'Thematic Mood Boards',
    category: 'Multi-Photo & Collage',
    description: 'Curated clusters of images grouped by specific color palettes, rich textures, and design aesthetics.',
    iconName: 'SwatchIcon',
    layoutCount: 'Palette & Textures'
  },
  // Grid and Symmetrical Layouts
  {
    id: 'grid-2x2',
    label: '2x2 Balanced Grid',
    category: 'Grid & Symmetrical',
    description: 'A balanced four-photo square arrangement giving each design equal weight and breathing room.',
    iconName: 'Squares2X2Icon',
    layoutCount: '4-Item Quad'
  },
  {
    id: 'grid-3x3',
    label: '3x3 Matrix Grid',
    category: 'Grid & Symmetrical',
    description: 'A nine-photo balanced layout ideal for matching collections, series, or lookbook themes.',
    iconName: 'ViewGridIcon',
    layoutCount: '9-Item Matrix'
  },
  {
    id: 'equal-triptych',
    label: 'Equal Triptych',
    category: 'Grid & Symmetrical',
    description: 'Three same-sized panels placed side-by-side for direct comparison or sequential design storytelling.',
    iconName: 'RectangleStackIcon',
    layoutCount: '3 Equal Panels'
  },
  {
    id: 'mixed-size-grid',
    label: 'Mixed-Size Dynamic Grid',
    category: 'Grid & Symmetrical',
    description: 'Alternating rows and columns mixing rectangular sizes (3 & 5 configurations) to break monotony.',
    iconName: 'Squares2X2Icon',
    layoutCount: '3-5 Varied Mix'
  },
  // Feature and Hierarchy Layouts
  {
    id: 'feature-hero',
    label: 'Feature Hero Layout',
    category: 'Feature & Hierarchy',
    description: 'Places one large hero primary image in the spotlight, surrounded by secondary detail shots.',
    iconName: 'CanaryIcon',
    layoutCount: '1 Hero + Details'
  },
  {
    id: 'classic-stack-feature',
    label: 'Classic Stack with Feature',
    category: 'Feature & Hierarchy',
    description: 'Features a large vertical photo on one side paired with a secondary photo and smaller side-by-side frames.',
    iconName: 'RectangleStackIcon',
    layoutCount: 'Vertical + Stack'
  },
  {
    id: 'before-and-after',
    label: 'Before & After Arrangement',
    category: 'Feature & Hierarchy',
    description: 'Dual sequential layout contrasting the starting concept with the final execution via interactive split.',
    iconName: 'ArrowUpDown',
    layoutCount: 'Dual Contrast'
  }
];

export interface DesignDiscussionItem {
  id: string;
  title: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  createdAt: string;
  category: string;
  content: string;
  pinId?: string;
  boardName?: string;
  commentsCount: number;
  upvotesCount: number;
  tags: string[];
  resolved?: boolean;
}

// ==================== 1. CURATED PINS (GUARDIAN AI INDEXED) ====================
export const TRIBUT_PINS_DATA: TributPinItem[] = [
  {
    id: 'pin-silver-fox',
    title: 'Flyyy Silver Fox!',
    description: 'Nice shape up with silver frost textured fade, precision razor edge-up, sculpted silver beard line, and custom luxury gradient aviator optics.',
    altText: 'Distinguished handsome Black man with frosted silver cropped hair, shaped silver beard, and gold-frame tinted glasses',
    category: 'fashion',
    categoryLabel: 'Grooming & Style',
    boardName: 'Silver Fox Masterclass',
    aspectRatio: '2:3',
    mediaUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    colorPalette: ['#F5D1C4', '#E6A88C', '#BD7454', '#793F29', '#3D1C0F'],
    promptRecipe: 'Professional high fashion editorial 4k portrait of a handsome distinguished Black man in his late 40s with frosted silver hair, immaculate razor shape-up, sculpted silver beard, amber gradient sunglasses, studio cyclorama lighting, shot on 85mm lens.',
    priority: 'high',
    commentsCount: 14,
    comments: [
      {
        id: 'c-1',
        authorName: 'Adikamonday',
        authorHandle: '@adikamonday',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        content: 'Front hair tint looks absolutely crisp. What toner was used on the temples?',
        createdAt: '2 hours ago',
        likes: 12,
        isLiked: true,
        critiqueTag: 'Shape Up'
      },
      {
        id: 'c-2',
        authorName: 'Stephanie Morton (Creator)',
        authorHandle: '@stephanie_m',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        content: '@adikamonday Used a customized violet-ash frost pigment with organic shea butter gloss sealant.',
        createdAt: '1 hour ago',
        likes: 18,
        critiqueTag: 'Technique'
      },
      {
        id: 'c-3',
        authorName: 'Kemi Balogun',
        authorHandle: '@kemibalogun',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        content: 'The contrast between the cool silver hair and warm skin tone palette is exceptional!',
        createdAt: '45 mins ago',
        likes: 8,
        critiqueTag: 'Color Grading'
      }
    ],
    author: {
      id: 'usr-steph-01',
      name: 'Stephanie Morton',
      handle: '@stephanie_m',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Master Creator',
      consistencyStreak: '78-Day Daily Pin Streak'
    },
    guardianAiRank: 1,
    ugcSource: {
      platformOrigin: 'Member Post',
      originalPostId: 'post-ugc-8821',
      curationTimestamp: '2 hours ago',
      curatorAiScore: 98.4,
      viralDecayProtection: true
    },
    metrics: {
      saves: 3820,
      downloads: 940,
      closeups: 19400,
      outboundClicks: 2100,
      likes: 192,
      shelfLifeDays: 145
    },
    pillars: {
      domainQualityScore: 99,
      pinUsageScore: 98,
      topicRelevanceSeoScore: 97,
      pinnerQualityScore: 98,
      richProfileDataSync: true,
      overallGuardianScore: 98.4
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'MarketPlace',
      productName: 'Sovereign Organic Frost Hair Toner & Beard Balm Duo',
      priceNgn: 28500,
      priceFic: 48,
      inStock: true,
      merchantName: 'Stephanie Morton Grooming Lab',
      merchantDomain: 'stephanie-grooming.ng',
      buyAndShareCommissionPercent: 12,
      liveCatalogSync: true
    },
    tags: ['silver-fox', 'shape-up', 'mens-grooming', 'beard-care', 'fade-cut', 'afro-elegance']
  },
  {
    id: 'pin-diptych-01',
    title: 'Adire Eleko Masterclass: Raw Indigo Dyeing to Finished Tailored Blazer',
    description: 'Sequential triptych documenting heritage resist-paste indigo immersion in Abeokuta, precision hand-cutting, and final double-breasted sovereign blazer.',
    altText: 'Three panels showing indigo dye vat, cutting table with chalk lines, and tailored model',
    category: 'fashion',
    categoryLabel: 'Artisanal Process',
    boardName: 'Lagos Modern Adire Lookbook',
    aspectRatio: '2:3',
    mediaType: 'collage',
    mediaUrl: '/images/tribut/adire_male_jacket_1792082249653.jpg',
    multiMediaUrls: [
      '/images/tribut/adire_male_jacket_1792082249653.jpg',
      '/images/tribut/adire_male_patchwork_1792082376155.jpg',
      '/images/tribut/adire_male_safari_trousers.jpg'
    ],
    beforeAfter: {
      beforeUrl: '/images/tribut/adire_male_patchwork_1792082376155.jpg',
      afterUrl: '/images/tribut/adire_male_jacket_1792082249653.jpg',
      labelBefore: 'Raw Resist Dye Block',
      labelAfter: 'Finished Bespoke Blazer'
    },
    colorPalette: ['#1A2B4C', '#28467A', '#52796F', '#84A98C', '#E29578'],
    promptRecipe: 'Professional high fashion editorial 4k portrait of a handsome Nigerian male model in his mid-30s wearing a modern tailored Adire Eleko indigo-dyed geometric jacket with intricate resist patterns.',
    priority: 'high',
    commentsCount: 9,
    author: {
      id: 'usr-femi-02',
      name: 'Femi Sanni Studio',
      handle: '@femisanni_bespoke',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Sovereign Verified',
      consistencyStreak: '110-Day Daily Pin Streak'
    },
    guardianAiRank: 2,
    ugcSource: {
      platformOrigin: 'Forum Design Showcase',
      originalPostId: 'forum-thread-412',
      curationTimestamp: '5 hours ago',
      curatorAiScore: 99.1,
      viralDecayProtection: true
    },
    metrics: {
      saves: 4520,
      downloads: 1240,
      closeups: 22100,
      outboundClicks: 3890,
      likes: 540,
      shelfLifeDays: 190
    },
    pillars: {
      domainQualityScore: 99,
      pinUsageScore: 99,
      topicRelevanceSeoScore: 99,
      pinnerQualityScore: 98,
      richProfileDataSync: true,
      overallGuardianScore: 99.1
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'Storefront',
      productName: 'Bespoke Adire Indigo Geometric Blazer Pack',
      priceNgn: 145000,
      priceFic: 240,
      inStock: true,
      merchantName: 'Femi Sanni Bespoke',
      merchantDomain: 'femisanni.ng',
      buyAndShareCommissionPercent: 15,
      liveCatalogSync: true
    },
    tags: ['diptych', 'triptych', 'adire-eleko', 'bespoke-tailoring', 'process-story']
  },
  {
    id: 'pin-01',
    title: 'Minimalist Lekki Villa: Tropical Solar Architecture & Courtyard Pool',
    description: 'Biophilic residential engineering combining rammed-earth cooling walls, native iroko timber louvers, and integrated bifacial solar pergolas in Lagos.',
    altText: 'Modern tropical villa courtyard with infinity reflection pool and wooden pergolas',
    category: 'architecture',
    categoryLabel: 'Architecture & Living',
    boardName: 'Sovereign Coastal Homes',
    aspectRatio: '2:3',
    mediaUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    author: {
      id: 'usr-arch-01',
      name: 'Studio Adeyemi Architects',
      handle: '@adeyemi_design',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Sovereign Verified',
      consistencyStreak: '65-Day Daily Pin Streak'
    },
    guardianAiRank: 3,
    ugcSource: {
      platformOrigin: 'MarketPlace Lookbook',
      originalPostId: 'mkt-lookbook-089',
      curationTimestamp: '1 day ago',
      curatorAiScore: 98.2,
      viralDecayProtection: true
    },
    metrics: {
      saves: 1420,
      downloads: 620,
      closeups: 8940,
      outboundClicks: 1250,
      likes: 2180,
      shelfLifeDays: 240
    },
    pillars: {
      domainQualityScore: 98,
      pinUsageScore: 96,
      topicRelevanceSeoScore: 99,
      pinnerQualityScore: 97,
      richProfileDataSync: true,
      overallGuardianScore: 98.2
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'Storefront',
      productName: 'Custom Architectural CAD Blueprints & Solar Spec Pack',
      priceNgn: 185000,
      priceFic: 310,
      originalPriceNgn: 220000,
      inStock: true,
      merchantName: 'Adeyemi Architectural Assets',
      merchantDomain: 'adeyemi-architects.ng',
      buyAndShareCommissionPercent: 8,
      liveCatalogSync: true
    },
    promoted: {
      isPromoted: true,
      campaignType: 'Performance CPC',
      sponsorName: 'EcoLekki Engineering Ltd',
      cpcRateFic: 0.15
    },
    tags: ['tropical-architecture', 'lagos-homes', 'solar-design', 'cad-plans', 'biophilic']
  },
  {
    id: 'pin-02',
    title: 'Adire Indigo Oversized Kimono & Hand-Dyed Silk Ensemble',
    description: 'Heritage Yoruba indigo dye resist-printing techniques reimagined in relaxed gender-neutral streetwear silhouettes. Sourced sustainably from Abeokuta dyers.',
    altText: 'Model wearing hand-dyed dark blue and indigo patterned kimono robe in urban studio',
    category: 'fashion',
    categoryLabel: 'Fashion & Wearables',
    boardName: 'Contemporary African Wardrobe',
    aspectRatio: '2:3',
    mediaUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    author: {
      id: 'usr-fash-02',
      name: 'Folake Alabi Atelier',
      handle: '@folake_couture',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Master Creator',
      consistencyStreak: '90-Day Daily Pin Streak'
    },
    metrics: {
      saves: 2310,
      closeups: 14200,
      outboundClicks: 3410,
      likes: 4120,
      shelfLifeDays: 210
    },
    pillars: {
      domainQualityScore: 96,
      pinUsageScore: 99,
      topicRelevanceSeoScore: 95,
      pinnerQualityScore: 98,
      richProfileDataSync: true,
      overallGuardianScore: 97.4
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'MarketPlace',
      productName: 'Limited Edition Sovereign Adire Kimono (100% Organic Silk)',
      priceNgn: 65000,
      priceFic: 110,
      inStock: true,
      merchantName: 'Alabi Artisan Collective',
      merchantDomain: 'folakealabi.ng',
      buyAndShareCommissionPercent: 10,
      liveCatalogSync: true
    },
    tags: ['adire-indigo', 'streetwear', 'afro-minimalism', 'sustainable-silk', 'abeokuta-craft']
  },
  {
    id: 'pin-03',
    title: 'Tactical Portable Solar Mesh Node & Offline Edge Server',
    description: 'Ruggedized Pelican-cased local node running offline GGUF LLMs, LoRa mesh transceiver, and 500Wh LiFePO4 battery pack for remote field teams.',
    altText: 'Rugged black pelican case with solar panels, antennas, and small glowing mini server screen',
    category: 'tech',
    categoryLabel: 'Tech & Sovereign Gear',
    boardName: 'Off-Grid Compute Nodes',
    aspectRatio: '2:3',
    mediaUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    author: {
      id: 'usr-tech-03',
      name: 'Sovereign Hardware Labs',
      handle: '@sov_hardware',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Sovereign Verified',
      consistencyStreak: '30-Day Daily Pin Streak'
    },
    metrics: {
      saves: 1890,
      closeups: 10400,
      outboundClicks: 2150,
      likes: 3100,
      shelfLifeDays: 95
    },
    pillars: {
      domainQualityScore: 99,
      pinUsageScore: 94,
      topicRelevanceSeoScore: 98,
      pinnerQualityScore: 95,
      richProfileDataSync: true,
      overallGuardianScore: 96.8
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'OwnIt',
      productName: 'Nomad 500Wh Mesh Compute Rig (Pre-Loaded Local AI)',
      priceNgn: 340000,
      priceFic: 570,
      originalPriceNgn: 380000,
      inStock: true,
      merchantName: 'Sovereign Hardware Distribution',
      merchantDomain: 'hardware.fingermobileprotocol.com',
      buyAndShareCommissionPercent: 6,
      liveCatalogSync: true
    },
    promoted: {
      isPromoted: true,
      campaignType: 'Canary Shopping Ad',
      sponsorName: 'FingerMobile Hardware Foundry',
      cpcRateFic: 0.2
    },
    tags: ['solar-server', 'edge-ai', 'lora-mesh', 'offgrid-hardware', 'pelican-case']
  },
  {
    id: 'pin-04',
    title: 'Organic Stone-Milled Fonio Grain & Hibiscus Spice Blend',
    description: 'Ancient drought-resilient supergrain harvested by women-led farm cooperatives in Plateau State. Gluten-free, low-glycemic, and vacuum-sealed with zobo infused salt.',
    altText: 'Ceramic bowls with golden fonio grains and dried dark red hibiscus blossoms',
    category: 'culinary',
    categoryLabel: 'Culinary & Nutrition',
    boardName: 'Indigenous African Superfoods',
    aspectRatio: '2:3',
    mediaUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    author: {
      id: 'usr-food-04',
      name: 'Mama Zaria Organics',
      handle: '@zaria_farms',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Merchant Partner',
      consistencyStreak: '120-Day Daily Pin Streak'
    },
    metrics: {
      saves: 3120,
      closeups: 16800,
      outboundClicks: 4920,
      likes: 5400,
      shelfLifeDays: 280
    },
    pillars: {
      domainQualityScore: 97,
      pinUsageScore: 98,
      topicRelevanceSeoScore: 99,
      pinnerQualityScore: 99,
      richProfileDataSync: true,
      overallGuardianScore: 98.6
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'Flamingo',
      productName: 'Raw Heirloom Fonio (2kg Pack) + Zobo Spice Jar',
      priceNgn: 14500,
      priceFic: 25,
      inStock: true,
      merchantName: 'Zaria Agro-Processing Hub',
      merchantDomain: 'mamazaria.ng',
      buyAndShareCommissionPercent: 12,
      liveCatalogSync: true
    },
    tags: ['fonio-grain', 'superfood', 'plateau-agriculture', 'gluten-free', 'hibiscus']
  },
  {
    id: 'pin-05',
    title: 'Cyber-Bronze Sculpture: Digital Oba of Benin in High-Gloss Brass',
    description: '3D generative volumetric sculpture merging ancient royal guild metallurgy with algorithmic polygon tessellations. Limited physical casting of 50 serialized artifacts.',
    altText: 'Gleaming polished brass sculpture of African monarch with intricate beadwork and geometric facets',
    category: 'art',
    categoryLabel: 'Afrofuturist Art',
    boardName: 'Sacred Future Relics',
    aspectRatio: '2:3',
    mediaUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    author: {
      id: 'usr-art-05',
      name: 'Nosa Igbinedion Works',
      handle: '@nosa_sculpts',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Master Creator',
      consistencyStreak: '55-Day Daily Pin Streak'
    },
    metrics: {
      saves: 1640,
      closeups: 9800,
      outboundClicks: 1870,
      likes: 2950,
      shelfLifeDays: 160
    },
    pillars: {
      domainQualityScore: 95,
      pinUsageScore: 96,
      topicRelevanceSeoScore: 97,
      pinnerQualityScore: 96,
      richProfileDataSync: true,
      overallGuardianScore: 96.0
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'ShopifyPartner',
      productName: 'Serialized Bronze Edition #14 (Includes On-Chain Authenticity Chip)',
      priceNgn: 520000,
      priceFic: 880,
      inStock: true,
      merchantName: 'Benin Fine Arts Foundry',
      merchantDomain: 'nosa-bronze.com',
      buyAndShareCommissionPercent: 5,
      liveCatalogSync: true
    },
    tags: ['benin-bronze', 'cyberpunk-art', 'brass-sculpture', 'afrofuturism', 'collectible']
  },
  {
    id: 'pin-06',
    title: 'Hand-Carved Mahogany Ergonomic Desk & Studio Monitor Stands',
    description: 'Master joinery crafted from sustainably fell Benue mahogany with concealed cable trays, magnetic phone docks, and vegetable-oil satin finish.',
    altText: 'Rich dark mahogany desk with dual displays, mechanical keyboard, and minimalist brass lamp',
    category: 'interior',
    categoryLabel: 'Architecture & Living',
    boardName: 'Creative Workstations & Studios',
    aspectRatio: '2:3',
    mediaUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    author: {
      id: 'usr-furn-06',
      name: 'Kano Woodcraft Guild',
      handle: '@kano_craft',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Merchant Partner',
      consistencyStreak: '80-Day Daily Pin Streak'
    },
    metrics: {
      saves: 2840,
      closeups: 15300,
      outboundClicks: 3820,
      likes: 4720,
      shelfLifeDays: 320
    },
    pillars: {
      domainQualityScore: 98,
      pinUsageScore: 99,
      topicRelevanceSeoScore: 97,
      pinnerQualityScore: 98,
      richProfileDataSync: true,
      overallGuardianScore: 98.0
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'MarketPlace',
      productName: 'Benue Solid Mahogany Studio Desk (160cm x 75cm)',
      priceNgn: 210000,
      priceFic: 350,
      inStock: true,
      merchantName: 'Northern Artisans Collective',
      merchantDomain: 'kanocraft.ng',
      buyAndShareCommissionPercent: 7,
      liveCatalogSync: true
    },
    promoted: {
      isPromoted: true,
      campaignType: 'Brand Awareness',
      sponsorName: 'Northern Timber & Craft Guild'
    },
    tags: ['mahogany-desk', 'studio-setup', 'artisan-furniture', 'minimalist-desk', 'woodworking']
  },
  {
    id: 'pin-07',
    title: 'Cold-Pressed Raw Shea Butter & Morinda Citrus Elixir',
    description: 'Ethically harvested wild Vitellaria butter whipped with pure baobab oil and cold-pressed citrus from Oyo State groves. Zero preservatives.',
    altText: 'Amber glass jars with creamy golden butter and natural botanical leaves on wooden tray',
    category: 'wellness',
    categoryLabel: 'Wellness',
    boardName: 'Holistic Body Apothecary',
    aspectRatio: '2:3',
    mediaUrl: 'https://images.unsplash.com/photo-1608248597359-e932ec13e9a4?auto=format&fit=crop&w=800&q=80',
    author: {
      id: 'usr-well-07',
      name: 'Oyo Botanicals',
      handle: '@oyo_botanicals',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Sovereign Verified',
      consistencyStreak: '110-Day Daily Pin Streak'
    },
    metrics: {
      saves: 3450,
      closeups: 18900,
      outboundClicks: 5200,
      likes: 6100,
      shelfLifeDays: 365
    },
    pillars: {
      domainQualityScore: 99,
      pinUsageScore: 100,
      topicRelevanceSeoScore: 98,
      pinnerQualityScore: 99,
      richProfileDataSync: true,
      overallGuardianScore: 99.1
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'Storefront',
      productName: 'Whipped Raw Baobab Shea Butter Duo (250ml Glass Jars)',
      priceNgn: 18000,
      priceFic: 30,
      inStock: true,
      merchantName: 'Oyo Botanical Laboratories',
      merchantDomain: 'oyobotanicals.ng',
      buyAndShareCommissionPercent: 15,
      liveCatalogSync: true
    },
    tags: ['shea-butter', 'baobab-oil', 'natural-skincare', 'apothecary', 'oyo-groves']
  },
  {
    id: 'pin-08',
    title: 'Electric Solar Danfo: Zero-Emission Retrofit for Urban Transit',
    description: 'Conversion blueprint replacing internal combustion engines in classic commercial transit buses with 70kWh LFP battery packs and rooftop flexible solar arrays.',
    altText: 'Yellow commercial passenger bus retrofitted with modern electric drivetrain and rooftop solar cells',
    category: 'automotive',
    categoryLabel: 'Tech & Sovereign Gear',
    boardName: 'Clean Urban Mobility',
    aspectRatio: '2:3',
    mediaUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    author: {
      id: 'usr-auto-08',
      name: 'E-Danfo Mobility Consortium',
      handle: '@edanfo_mobility',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Sovereign Verified',
      consistencyStreak: '45-Day Daily Pin Streak'
    },
    metrics: {
      saves: 1950,
      closeups: 11200,
      outboundClicks: 2600,
      likes: 3890,
      shelfLifeDays: 115
    },
    pillars: {
      domainQualityScore: 97,
      pinUsageScore: 95,
      topicRelevanceSeoScore: 98,
      pinnerQualityScore: 96,
      richProfileDataSync: true,
      overallGuardianScore: 96.5
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'MarketPlace',
      productName: 'Commercial Fleet EV Conversion Whitepaper & Schematics',
      priceNgn: 95000,
      priceFic: 160,
      inStock: true,
      merchantName: 'Clean Mobility Systems',
      merchantDomain: 'edanfo.ng',
      buyAndShareCommissionPercent: 8,
      liveCatalogSync: true
    },
    tags: ['electric-vehicle', 'danfo-bus', 'lagos-clean-air', 'solar-mobility', 'retrofit']
  },
  // ==================== 10 NIGERIAN ADIRE FASHION LOOKS (5 MALE, 5 FEMALE) ====================
  {
    id: 'pin-adire-01',
    title: 'Adire Eleko Indigo Tailored Blazer & Fitted Black Chinos',
    description: 'Mid-30s Nigerian male model in sharp editorial studio lighting wearing a custom Adire Eleko tailored geometric jacket with solid black fitted trousers and calfskin dress shoes.',
    altText: 'Handsome Nigerian male model in his 30s wearing tailored Adire Eleko indigo jacket and solid black trousers in studio',
    category: 'fashion',
    categoryLabel: 'Fashion & Wearables',
    boardName: 'Lagos Modern Adire Lookbook',
    aspectRatio: '2:3',
    mediaUrl: '/images/tribut/adire_male_jacket_1792082249653.jpg',
    author: {
      id: 'usr-adire-01',
      name: 'Tunde Bakare Bespoke',
      handle: '@tundebakare_lagos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Master Creator',
      consistencyStreak: '120-Day Daily Pin Streak'
    },
    metrics: {
      saves: 3120,
      closeups: 16400,
      outboundClicks: 4200,
      likes: 5800,
      shelfLifeDays: 95
    },
    pillars: {
      domainQualityScore: 99,
      pinUsageScore: 98,
      topicRelevanceSeoScore: 100,
      pinnerQualityScore: 99,
      richProfileDataSync: true,
      overallGuardianScore: 99.2
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'Storefront',
      productName: 'Hand-Carved Stencil Adire Eleko Suit Jacket',
      priceNgn: 145000,
      priceFic: 240,
      originalPriceNgn: 175000,
      inStock: true,
      merchantName: 'Bakare Atelier Lagos',
      merchantDomain: 'bakare.ng',
      buyAndShareCommissionPercent: 12,
      liveCatalogSync: true
    },
    promoted: {
      isPromoted: true,
      campaignType: 'Performance CPC',
      sponsorName: 'Lagos Fashion Week Showcase',
      cpcRateFic: 0.25
    },
    tags: ['adire-eleko', 'menswear', 'tailored-blazer', 'nigerian-fashion', 'fitted-trousers', 'studio-editorial']
  },
  {
    id: 'pin-adire-02',
    title: 'Adire Alabere Cropped Top & Pleated Cream Mini Skirt',
    description: 'Early-30s Nigerian female model in warm studio lighting wearing an artisanal cropped Adire Alabere top in indigo and emerald green, paired with a solid cream-white pleated mini skirt.',
    altText: 'Nigerian female model in her 30s wearing Adire Alabere cropped top and cream white pleated mini skirt in studio',
    category: 'fashion',
    categoryLabel: 'Fashion & Wearables',
    boardName: 'Lagos Modern Adire Lookbook',
    aspectRatio: '2:3',
    mediaUrl: '/images/tribut/adire_female_skirt_1792082266716.jpg',
    author: {
      id: 'usr-adire-02',
      name: 'Zainab Danjuma Couture',
      handle: '@zainab_couture',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Sovereign Verified',
      consistencyStreak: '85-Day Daily Pin Streak'
    },
    metrics: {
      saves: 4210,
      closeups: 21500,
      outboundClicks: 5900,
      likes: 7800,
      shelfLifeDays: 120
    },
    pillars: {
      domainQualityScore: 99,
      pinUsageScore: 99,
      topicRelevanceSeoScore: 99,
      pinnerQualityScore: 98,
      richProfileDataSync: true,
      overallGuardianScore: 99.0
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'MarketPlace',
      productName: 'Adire Alabere Embroidered Silk Crop Top',
      priceNgn: 58000,
      priceFic: 95,
      inStock: true,
      merchantName: 'Zainab Couture Hub',
      merchantDomain: 'zainabdanjuma.com',
      buyAndShareCommissionPercent: 10,
      liveCatalogSync: true
    },
    tags: ['adire-alabere', 'mini-skirt', 'resort-wear', 'womenswear', 'studio-fashion']
  },
  {
    id: 'pin-adire-03',
    title: 'Adire Oniko Splash Camp Shirt & Solid Navy Tailored Shorts',
    description: 'Early-40s Nigerian male model styled with a neatly trimmed beard, wearing a vibrant terracotta rust and indigo Adire Oniko splash-dyed camp shirt with solid deep navy tailored shorts.',
    altText: 'Nigerian male model in his 40s wearing Adire Oniko splash camp shirt and navy blue tailored shorts in studio',
    category: 'fashion',
    categoryLabel: 'Fashion & Wearables',
    boardName: 'Lagos Modern Adire Lookbook',
    aspectRatio: '2:3',
    mediaUrl: '/images/tribut/adire_male_shorts_1792082288008.jpg',
    author: {
      id: 'usr-adire-03',
      name: 'Kolawole Indigo Guild',
      handle: '@kolawole_indigo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Master Creator',
      consistencyStreak: '140-Day Daily Pin Streak'
    },
    metrics: {
      saves: 2890,
      closeups: 15300,
      outboundClicks: 3800,
      likes: 5100,
      shelfLifeDays: 160
    },
    pillars: {
      domainQualityScore: 98,
      pinUsageScore: 97,
      topicRelevanceSeoScore: 99,
      pinnerQualityScore: 98,
      richProfileDataSync: true,
      overallGuardianScore: 98.1
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'OwnIt',
      productName: 'Adire Oniko Artisan Tied Splash Resort Shirt',
      priceNgn: 65000,
      priceFic: 110,
      inStock: true,
      merchantName: 'Kolawole Guild Abeokuta',
      merchantDomain: 'kolawoleguild.ng',
      buyAndShareCommissionPercent: 15,
      liveCatalogSync: true
    },
    tags: ['adire-oniko', 'mens-shorts', 'tie-dye', 'resort-shirt', 'summer-wardrobe']
  },
  {
    id: 'pin-adire-04',
    title: 'Adire Silk Off-Shoulder Corset Blouse & Emerald Fitted Trousers',
    description: 'Mid-30s Nigerian female model in olive studio cyclorama wearing a dramatic sculptural off-shoulder Adire silk blouse with swirl motifs, paired with solid emerald green high-waisted fitted trousers.',
    altText: 'Nigerian female model in her 30s wearing off-shoulder Adire silk top and emerald green fitted trousers in studio',
    category: 'fashion',
    categoryLabel: 'Fashion & Wearables',
    boardName: 'Lagos Modern Adire Lookbook',
    aspectRatio: '2:3',
    mediaUrl: '/images/tribut/adire_female_trousers_1792082307609.jpg',
    author: {
      id: 'usr-adire-04',
      name: 'Simi Adeleke Fashion',
      handle: '@simi_couture',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Sovereign Verified',
      consistencyStreak: '95-Day Daily Pin Streak'
    },
    metrics: {
      saves: 5340,
      closeups: 27800,
      outboundClicks: 7200,
      likes: 9400,
      shelfLifeDays: 180
    },
    pillars: {
      domainQualityScore: 100,
      pinUsageScore: 100,
      topicRelevanceSeoScore: 100,
      pinnerQualityScore: 100,
      richProfileDataSync: true,
      overallGuardianScore: 100
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'Flamingo',
      productName: 'Sculptural Off-Shoulder Adire Pure Silk Blouse',
      priceNgn: 89000,
      priceFic: 150,
      originalPriceNgn: 110000,
      inStock: true,
      merchantName: 'Simi Adeleke Official',
      merchantDomain: 'simiadeleke.com',
      buyAndShareCommissionPercent: 14,
      liveCatalogSync: true
    },
    promoted: {
      isPromoted: true,
      campaignType: 'Canary Shopping Ad',
      sponsorName: 'Lagos Luxury Goods Canary',
      cpcRateFic: 0.3
    },
    tags: ['off-shoulder', 'adire-silk', 'fitted-trousers', 'high-fashion', 'emerald-trousers']
  },
  {
    id: 'pin-adire-05',
    title: 'Adire Spiral Ochre Geometric Shirt & Beige Khaki Trousers',
    description: 'Late-30s Nigerian male model in a minimalist studio setting wearing an Adire button-down shirt with geometric spiral resist patterns in ochre, turquoise, and indigo, paired with solid tailored beige trousers.',
    altText: 'Nigerian male model in his 30s wearing Adire spiral patterned button-down shirt and beige trousers in studio',
    category: 'fashion',
    categoryLabel: 'Fashion & Wearables',
    boardName: 'Lagos Modern Adire Lookbook',
    aspectRatio: '2:3',
    mediaUrl: '/images/tribut/adire_male_trousers_1792082329775.jpg',
    author: {
      id: 'usr-adire-05',
      name: 'Olawale Craft House',
      handle: '@olawale_tailors',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Master Creator',
      consistencyStreak: '110-Day Daily Pin Streak'
    },
    metrics: {
      saves: 3340,
      closeups: 17800,
      outboundClicks: 4100,
      likes: 5900,
      shelfLifeDays: 130
    },
    pillars: {
      domainQualityScore: 98,
      pinUsageScore: 98,
      topicRelevanceSeoScore: 99,
      pinnerQualityScore: 99,
      richProfileDataSync: true,
      overallGuardianScore: 98.6
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'Storefront',
      productName: 'Contemporary Adire Cotton Geometric Spiral Shirt',
      priceNgn: 52000,
      priceFic: 88,
      inStock: true,
      merchantName: 'Olawale Tailoring',
      merchantDomain: 'olawale.ng',
      buyAndShareCommissionPercent: 10,
      liveCatalogSync: true
    },
    tags: ['geometric-adire', 'ochre-spiral', 'smart-casual', 'fitted-trousers', 'mens-fashion']
  },
  {
    id: 'pin-adire-06',
    title: 'Adire Eleko Structured Peplum Blazer & Deep Navy Mini Skirt',
    description: 'Early-40s Nigerian female executive model wearing a structured Adire Eleko peplum blazer in cobalt-blue lattice weave, paired with a solid deep navy mini skirt and royal blue suede pumps.',
    altText: 'Nigerian female model in her 40s wearing Adire Eleko peplum blazer and deep navy mini skirt in studio',
    category: 'fashion',
    categoryLabel: 'Fashion & Wearables',
    boardName: 'Lagos Modern Adire Lookbook',
    aspectRatio: '2:3',
    mediaUrl: '/images/tribut/adire_peplum_skirt_1792082352189.jpg',
    author: {
      id: 'usr-adire-06',
      name: 'Bisi Ogunleye Couture',
      handle: '@bisi_couture',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Sovereign Verified',
      consistencyStreak: '100-Day Daily Pin Streak'
    },
    metrics: {
      saves: 4890,
      closeups: 24900,
      outboundClicks: 6500,
      likes: 8300,
      shelfLifeDays: 200
    },
    pillars: {
      domainQualityScore: 99,
      pinUsageScore: 99,
      topicRelevanceSeoScore: 100,
      pinnerQualityScore: 99,
      richProfileDataSync: true,
      overallGuardianScore: 99.3
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'MarketPlace',
      productName: 'Adire Eleko Executive Structured Peplum Blazer',
      priceNgn: 110000,
      priceFic: 185,
      inStock: true,
      merchantName: 'Bisi Ogunleye Executive Line',
      merchantDomain: 'bisiogunleye.ng',
      buyAndShareCommissionPercent: 12,
      liveCatalogSync: true
    },
    tags: ['peplum-blazer', 'adire-eleko', 'navy-mini-skirt', 'corporate-chic', 'power-dressing']
  },
  {
    id: 'pin-adire-07',
    title: 'Adire Patchwork Resort Shirt & Olive Green Tailored Shorts',
    description: 'Early-30s Nigerian male model in studio spotlight wearing an Adire patchwork short-sleeve resort collar shirt with deep indigo, purple, and teal batiks, paired with solid olive green tailored shorts.',
    altText: 'Nigerian male model in his 30s wearing Adire patchwork resort shirt and olive green shorts in studio',
    category: 'fashion',
    categoryLabel: 'Fashion & Wearables',
    boardName: 'Lagos Modern Adire Lookbook',
    aspectRatio: '2:3',
    mediaUrl: '/images/tribut/adire_male_patchwork_1792082376155.jpg',
    author: {
      id: 'usr-adire-07',
      name: 'Akinwale Studio',
      handle: '@akinwale_art',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Master Creator',
      consistencyStreak: '75-Day Daily Pin Streak'
    },
    metrics: {
      saves: 2750,
      closeups: 13900,
      outboundClicks: 3400,
      likes: 4900,
      shelfLifeDays: 85
    },
    pillars: {
      domainQualityScore: 97,
      pinUsageScore: 96,
      topicRelevanceSeoScore: 98,
      pinnerQualityScore: 97,
      richProfileDataSync: true,
      overallGuardianScore: 97.2
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'OwnIt',
      productName: 'Upcycled Adire Batik Patchwork Resort Shirt',
      priceNgn: 54000,
      priceFic: 90,
      inStock: true,
      merchantName: 'Akinwale Upcycled Studio',
      merchantDomain: 'akinwale.com',
      buyAndShareCommissionPercent: 10,
      liveCatalogSync: true
    },
    tags: ['patchwork-adire', 'mens-shorts', 'olive-shorts', 'batik-shirt', 'casual-luxury']
  },
  {
    id: 'pin-adire-08',
    title: 'Adire Chevron Wrap Blouse & Solid Black High-Waist Trousers',
    description: 'Late-30s Nigerian female model in studio strobe lighting wearing an Adire chevron tie-dye wrap blouse in midnight blue, marigold, and teal, paired with solid black fitted high-waisted trousers.',
    altText: 'Nigerian female model in her 30s wearing Adire chevron wrap blouse and black fitted trousers in studio',
    category: 'fashion',
    categoryLabel: 'Fashion & Wearables',
    boardName: 'Lagos Modern Adire Lookbook',
    aspectRatio: '2:3',
    mediaUrl: '/images/tribut/adire_wrap_trousers_1792082401236.jpg',
    author: {
      id: 'usr-adire-08',
      name: 'Morayo Clothiers',
      handle: '@morayo_fashion',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Sovereign Verified',
      consistencyStreak: '115-Day Daily Pin Streak'
    },
    metrics: {
      saves: 4620,
      closeups: 23100,
      outboundClicks: 6100,
      likes: 7900,
      shelfLifeDays: 155
    },
    pillars: {
      domainQualityScore: 99,
      pinUsageScore: 99,
      topicRelevanceSeoScore: 99,
      pinnerQualityScore: 99,
      richProfileDataSync: true,
      overallGuardianScore: 99.0
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'Storefront',
      productName: 'Silk-Blend Adire Chevron Lantern-Sleeve Wrap Top',
      priceNgn: 68000,
      priceFic: 115,
      inStock: true,
      merchantName: 'Morayo Fashion House',
      merchantDomain: 'morayo.ng',
      buyAndShareCommissionPercent: 12,
      liveCatalogSync: true
    },
    tags: ['chevron-adire', 'wrap-blouse', 'fitted-trousers', 'statement-sleeves', 'nigerian-couture']
  },
  {
    id: 'pin-adire-09',
    title: 'Adire Indigo Safari Overshirt & Ivory Tailored Trousers',
    description: 'Mid-40s Nigerian male model in studio editorial portrait wearing an Adire safari overshirt with charcoal and indigo cassava leaf resist motifs, paired with solid ivory off-white fitted trousers.',
    altText: 'Distinguished Nigerian male model in his 40s wearing Adire safari overshirt and ivory fitted trousers in studio',
    category: 'fashion',
    categoryLabel: 'Fashion & Wearables',
    boardName: 'Lagos Modern Adire Lookbook',
    aspectRatio: '2:3',
    mediaUrl: '/images/tribut/adire_male_safari_trousers.jpg',
    author: {
      id: 'usr-adire-09',
      name: 'Femi Sanni Menswear',
      handle: '@femisanni_lagos',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Master Creator',
      consistencyStreak: '130-Day Daily Pin Streak'
    },
    metrics: {
      saves: 3100,
      closeups: 16200,
      outboundClicks: 3900,
      likes: 5400,
      shelfLifeDays: 145
    },
    pillars: {
      domainQualityScore: 98,
      pinUsageScore: 97,
      topicRelevanceSeoScore: 98,
      pinnerQualityScore: 98,
      richProfileDataSync: true,
      overallGuardianScore: 97.9
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'MarketPlace',
      productName: 'Adire Safari Utility Overshirt in Heavy Linen',
      priceNgn: 78000,
      priceFic: 130,
      inStock: true,
      merchantName: 'Femi Sanni Atelier',
      merchantDomain: 'femisanni.ng',
      buyAndShareCommissionPercent: 11,
      liveCatalogSync: true
    },
    tags: ['safari-overshirt', 'ivory-trousers', 'adire-menswear', 'distinguished-style', 'studio-portrait']
  },
  {
    id: 'pin-adire-10',
    title: 'Adire Cowl-Neck Gold & Indigo Silk Tunic & Rust Tailored Shorts',
    description: 'Mid-40s Nigerian female model in warm studio lighting wearing an artisanal Adire cowl-neck silk tunic top with gold swirls on midnight blue, paired with solid terracotta rust tailored shorts.',
    altText: 'Nigerian female model in her 40s wearing Adire cowl-neck tunic and rust tailored shorts in studio',
    category: 'fashion',
    categoryLabel: 'Fashion & Wearables',
    boardName: 'Lagos Modern Adire Lookbook',
    aspectRatio: '2:3',
    mediaUrl: '/images/tribut/adire_female_cowl_shorts.jpg',
    author: {
      id: 'usr-adire-10',
      name: 'Kemi Balogun Studio',
      handle: '@kemibalogun_design',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      domainReputation: 'Sovereign Verified',
      consistencyStreak: '105-Day Daily Pin Streak'
    },
    metrics: {
      saves: 4100,
      closeups: 20400,
      outboundClicks: 5300,
      likes: 6900,
      shelfLifeDays: 170
    },
    pillars: {
      domainQualityScore: 99,
      pinUsageScore: 98,
      topicRelevanceSeoScore: 99,
      pinnerQualityScore: 99,
      richProfileDataSync: true,
      overallGuardianScore: 98.8
    },
    shopping: {
      isShoppable: true,
      storeEngine: 'ShopifyPartner',
      productName: 'Artisanal Adire Cowl-Neck Silk Drape Tunic',
      priceNgn: 72000,
      priceFic: 120,
      inStock: true,
      merchantName: 'Kemi Balogun Studio',
      merchantDomain: 'kemibalogun.com',
      buyAndShareCommissionPercent: 13,
      liveCatalogSync: true
    },
    tags: ['cowl-neck', 'silk-adire', 'tailored-shorts', 'rust-shorts', 'studio-luxury']
  }
];

// ==================== 2. USER PROJECT BOARDS (PLANNING & INSPIRATION) ====================
export const USER_PROJECT_BOARDS: UserProjectBoard[] = [
  {
    id: 'brd-adire',
    name: 'Lagos Modern Adire Lookbook',
    pinCount: 10,
    coverImage: '/images/tribut/adire_female_trousers_1792082307609.jpg',
    purpose: 'Project Planning',
    isPrivate: false
  },
  {
    id: 'brd-01',
    name: 'Smart Home Lagos 2026',
    pinCount: 14,
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
    purpose: 'Project Planning',
    isPrivate: false
  },
  {
    id: 'brd-02',
    name: 'Afrobeats Festival Wardrobe',
    pinCount: 22,
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
    purpose: 'Shopping Wishlist',
    isPrivate: false
  },
  {
    id: 'brd-03',
    name: 'Plateau Agritech & Solar Setup',
    pinCount: 9,
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
    purpose: 'Idea Ideation',
    isPrivate: true
  },
  {
    id: 'brd-04',
    name: 'Minimalist Workspace & Studio',
    pinCount: 18,
    coverImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=80',
    purpose: 'Brand Moodboard',
    isPrivate: false
  }
];

// ==================== 3. ADVERTISING & SHOPPING METRICS ====================
export const TRIBUT_ECOSYSTEM_STATS = {
  activeAdvertisers: 248,
  activeMerchants: 512,
  averageConversionRate: '4.8%', // Higher purchase intent than social platforms
  totalBuyAndSharePaidOutNgn: 48500000, // ₦48.5M shared with members
  promotedCanaryAdsActive: 86,
  guardianVisionIndexCount: '1.24M Media Assets',
  connectedStoreEngines: ['MarketPlace', 'Storefront', 'OwnIt', 'Flamingo', 'Shopify Partners']
};

// ==================== 4. COMMUNITY DESIGN DISCUSSIONS & CRITIQUES ====================
export const COMMUNITY_DESIGN_DISCUSSIONS: DesignDiscussionItem[] = [
  {
    id: 'disc-01',
    title: 'Adire Eleko Resist Patterns: Modern Indigo Formulation vs Synthetic Bleach',
    authorName: 'Folake Alabi',
    authorHandle: '@folake_couture',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: '3 hours ago',
    category: 'Textile & Dyeing',
    content: 'When planning our 2026 Sovereign Lookbook board, we tested natural fermented Elu leaf indigo vs chemical vat dyestuff. The natural resist line edge retention was 40% sharper on raw silk. What dye fixatives are you all pairing for color fastness under tropical sun?',
    pinId: 'pin-02',
    boardName: 'Lagos Modern Adire Lookbook',
    commentsCount: 18,
    upvotesCount: 42,
    tags: ['adire-eleko', 'organic-dye', 'textile-critique', 'sustainable-craft'],
    resolved: false
  },
  {
    id: 'disc-02',
    title: 'Silver Frost Fades & Beard Contrast: Best Lighting Angles for Studio Lookbooks',
    authorName: 'Stephanie Morton',
    authorHandle: '@stephanie_m',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    createdAt: '5 hours ago',
    category: 'Grooming & Lighting',
    content: 'Reviewing our "Flyyy Silver Fox!" pin metrics: high-contrast rim lighting at 45 degrees separated the silver highlights from the cyclorama backdrop significantly better than diffused softboxes. Check out the skin-tone color swatches attached!',
    pinId: 'pin-silver-fox',
    boardName: 'Silver Fox Masterclass',
    commentsCount: 26,
    upvotesCount: 65,
    tags: ['silver-fox', 'lighting-setup', 'shape-up', 'lookbook-prep'],
    resolved: true
  },
  {
    id: 'disc-03',
    title: 'Passive Solar Cooling in Lekki Coastal Architecture: Rammed Earth vs AAC Blocks',
    authorName: 'Studio Adeyemi Architects',
    authorHandle: '@adeyemi_design',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    createdAt: '1 day ago',
    category: 'Architecture & Living',
    content: 'For the Lekki Villa courtyard project board, our thermodynamic simulation showed rammed earth walls maintained a 6°C delta during peak afternoon humidity without AC. CAD blueprints are now prioritized for board download.',
    pinId: 'pin-01',
    boardName: 'Sovereign Coastal Homes',
    commentsCount: 14,
    upvotesCount: 38,
    tags: ['green-building', 'rammed-earth', 'solar-design', 'lagos-climate'],
    resolved: false
  }
];

// Tribut standardized naming aliases (legacy backward-compatibility)
export type GalleryPinItem = TributPinItem;
export type GalleryDisplayStyle = TributDisplayStyle;
export const GALLERY_PINS_DATA = TRIBUT_PINS_DATA;
export const GALLERY_ECOSYSTEM_STATS = TRIBUT_ECOSYSTEM_STATS;
export const GALLERY_DISPLAY_STYLES = TRIBUT_DISPLAY_STYLES;


