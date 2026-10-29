export interface DrawerMenuItem {
  id: string;
  title: string;
  description?: string;
  path: string;
  icon: string; // Lucide icon name or emoji fallback
  logoUrl?: string;
  badge?: {
    text: string;
    type: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  };
  isPrivate?: boolean;
  requiresPaidPlan?: boolean;
  requiresAgeVerification?: boolean;
}

export interface DrawerSubGroup {
  id: string;
  title: string;
  icon?: string;
  itemIds: string[];
}

export interface DrawerMenuCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  items: DrawerMenuItem[];
  subGroups?: DrawerSubGroup[];
}

export const DRAWER_MENU_CONFIG: DrawerMenuCategory[] = [
  {
    id: 'executive-dashboards',
    title: 'Executive & Managed Dashboards',
    icon: 'LayoutDashboard',
    description: 'Master Dashboard, UGC Analytics, Monetization Hub & Managed Consoles',
    items: [
      {
        id: 'master-dashboard',
        title: 'Master Dashboard',
        description: 'Primary Executive Console, Governance & STERCS™ Enclave',
        path: '/master-dashboard',
        icon: 'Crown',
        badge: { text: 'Executive', type: 'primary' }
      },
      {
        id: 'monetization-dashboard',
        title: 'Monetization Hub',
        description: 'Overview of all platform earnings & revenue streams',
        path: '/monetization-dashboard',
        icon: 'TrendingUp',
        badge: { text: 'Finance', type: 'info' }
      },
      {
        id: 'ugc-dashboard',
        title: 'UGC Analysis Dashboard',
        description: 'Performance metrics for uploaded creator content',
        path: '/ugc-dashboard',
        icon: 'BarChart2',
        badge: { text: 'Analytics', type: 'success' }
      },
      {
        id: 'creator-dashboard',
        title: 'Creator Studio Dashboard',
        description: 'Manage creator channels, streams, events & assets',
        path: '/creatordashboard',
        icon: 'Video',
        badge: { text: 'Studio', type: 'warning' }
      },
      {
        id: 'monitoring-dashboard',
        title: 'System Monitoring Dashboard',
        description: 'Real-time infrastructure health, uptime & nodes',
        path: '/monitoringdashboard',
        icon: 'Activity',
        badge: { text: 'Ops', type: 'info' }
      },
      {
        id: 'users-permissions-console',
        title: 'Users Permission Console',
        description: 'SuperAdmin & CFO matrix for Staff, Badges, Honors & Mod Scopes',
        path: '/admin/users-permissions',
        icon: 'Users',
        badge: { text: 'SuperAdmin', type: 'primary' }
      },
      {
        id: 'pages-permissions-console',
        title: 'Pages Permission Console',
        description: 'Master 385-screen directory, route locks & data shielding',
        path: '/admin/pages-permissions',
        icon: 'Lock',
        badge: { text: 'Gatekeeper', type: 'primary' }
      },
      {
        id: 'creators-console',
        title: 'Content Creators Console',
        description: 'Manage Creator Tiers, Subscriptions & Monetization Splits',
        path: '/admin/creators-console',
        icon: 'Palette',
        badge: { text: 'Creators Hive', type: 'primary' }
      },
      {
        id: 'business-console',
        title: 'Business & Orgs Console',
        description: 'Enterprise Accounts, KYB Vetting, Corporate SLA & Canary Ads',
        path: '/admin/business-console',
        icon: 'Building2',
        badge: { text: 'Enterprise Hive', type: 'primary' }
      }
    ]
  },
  {
    id: 'sovereign-governance',
    title: 'Sovereign Governance & Enclaves',
    icon: 'Shield',
    description: 'Back Office Operations, Badge Enclaves, Parliamentary Council & Moderation',
    items: [
      {
        id: 'backoffice-ops',
        title: 'Back Office Operations Portal',
        description: 'Staff clearances for KYC, disputes, settlements & catalogue',
        path: '/backoffice/operations',
        icon: 'Briefcase',
        badge: { text: 'Staff Lvl 1-5', type: 'info' }
      },
      {
        id: 'badge-enclave',
        title: 'Badge Sovereign Enclave',
        description: 'Tiered perks, fee discounts, private vault keys & VIP drops',
        path: '/enclave/badge-privileges',
        icon: 'Award',
        badge: { text: 'Perks', type: 'warning' }
      },
      {
        id: 'council-governance',
        title: 'Council of Dignitaries Chamber',
        description: 'Parliamentary voting floor for Founding Ambassadors & Fellows',
        path: '/council/governance',
        icon: 'Landmark',
        badge: { text: 'Council', type: 'primary' }
      },
      {
        id: 'moderator-command',
        title: 'Moderator Command Console',
        description: 'Forum sentinel queue, thread lock/pin & member cooldowns',
        path: '/moderator/command-center',
        icon: 'ShieldAlert',
        badge: { text: 'Sentinel', type: 'danger' }
      }
    ]
  },
  {
    id: 'community-social',
    title: 'Community & Social Hub',
    icon: 'MessageSquare',
    description: 'Forum, Halls, Groups, Members, and Social feeds',
    items: [
      {
        id: 'home-forum',
        title: 'Home Page (FingerMobile Forum)',
        description: 'News Feed housing 60 distinct categories',
        path: '/forum',
        icon: 'Home',
        badge: { text: 'Feed', type: 'primary' }
      },
      {
        id: 'hallmark',
        title: 'Hallmark',
        description: 'Mega-communities hosting up to 250,000 members',
        path: '/hallmark',
        icon: 'Award'
      },
      {
        id: 'gems',
        title: 'Gems',
        description: 'Curated community highlights & top posts',
        path: '/gems',
        icon: 'Gem'
      },
      {
        id: 'blogs',
        title: 'Blogs',
        description: 'Member long-form articles & publishing',
        path: '/blogs',
        icon: 'BookOpen'
      },
      {
        id: 'groups',
        title: 'Groups',
        description: 'Exclusive member groups & sub-communities',
        path: '/groups',
        icon: 'Users',
        requiresPaidPlan: true,
        badge: { text: 'Paid Plan', type: 'warning' }
      },
      {
        id: 'members',
        title: 'Members',
        description: 'Followers & Constellation network',
        path: '/community',
        icon: 'UserCheck'
      }
    ]
  },
  {
    id: 'media-entertainment',
    title: 'Media, Entertainment & Discovery',
    icon: 'Tv',
    description: 'Trending media, music, streaming, and events',
    items: [
      {
        id: 'trends',
        title: 'Trends',
        description: 'Real-time trending topics & hashtags',
        path: '/trends',
        icon: 'TrendingUp'
      },
      {
        id: 'beatwave-ng',
        title: 'BeatwaveNG',
        description: 'Next-Gen music streaming & audio player',
        path: '/beatwave-ng',
        icon: 'Music',
        logoUrl: '/assets/logos/beatwaveng_logo.png'
      },
      {
        id: 'dancia-4tv',
        title: 'Dancia-4Tv',
        description: 'Live broadcast TV, videos & streams',
        path: '/dancia-4tv',
        icon: 'Video',
        logoUrl: '/assets/logos/dancia4tv_logo.png'
      },
      {
        id: 'programs',
        title: 'Programs',
        description: 'Featured series & scheduled programs',
        path: '/programs',
        icon: 'Calendar'
      },
      {
        id: 'nysc',
        title: 'NYSC',
        description: 'National Youth Service Corps (NYSC) Grants & Skills Scheme',
        path: '/nysc',
        icon: 'Award',
        badge: { text: 'Grants', type: 'success' }
      },
      {
        id: 'events',
        title: 'Events',
        description: 'Live & virtual community events',
        path: '/events',
        icon: 'Ticket'
      },
      {
        id: 'tribut',
        title: 'Tribut',
        description: 'Public media stream & creative showcase',
        path: '/tribut',
        icon: 'Image',
        logoUrl: '/assets/logos/tribut_icon.png'
      },
      {
        id: 'lush-pressies',
        title: 'Lush Pressies',
        description: 'Gifting & appreciation center',
        path: '/lush-pressies',
        icon: 'Gift',
        logoUrl: '/assets/logos/lushpressies_logo.png',
        badge: { text: 'Hot', type: 'danger' }
      },
      {
        id: 'connect',
        title: 'Connect',
        description: 'Real-time messaging & networking',
        path: '/messages',
        icon: 'Share2'
      }
    ]
  },
  {
    id: 'commerce-stores',
    title: 'Commerce & Storefronts',
    icon: 'ShoppingBag',
    description: 'Marketplace, Member Storefronts, Flamingo & OwnIt',
    items: [
      {
        id: 'marketplace',
        title: 'Marketplace',
        description: 'Goods & Services curated from top 100 global stores',
        path: '/marketplace',
        icon: 'Store',
        logoUrl: '/assets/logos/marketplace_icon.png',
        badge: { text: 'Curated', type: 'info' }
      },
      {
        id: 'storefront-member',
        title: 'My Storefront',
        description: 'Member customer-facing shop with storage quota',
        path: '/my-storefront',
        icon: 'ShoppingBag',
        requiresPaidPlan: true
      },
      {
        id: 'ownit',
        title: 'OwnIt',
        description: 'Official FingerMobile branded products',
        path: '/ownit',
        icon: 'ShieldCheck'
      },
      {
        id: 'flamingo',
        title: 'Flamingo',
        description: 'Private & privileged adult storefront',
        path: '/flamingo',
        icon: 'Lock',
        logoUrl: '/assets/logos/flamingo_icon.png',
        isPrivate: true,
        requiresAgeVerification: true,
        badge: { text: '18+ Private', type: 'danger' }
      },
      {
        id: 'storefronts-mall',
        title: 'Storefronts Mall',
        description: 'Shoppers Mall featuring verified business owners',
        path: '/storefronts',
        icon: 'Building'
      }
    ]
  },
  {
    id: 'creative-ugc',
    title: 'Creative Studio & UGC Monetization',
    icon: 'Camera',
    description: 'PhotoCredits, HD media uploads, folders & luxury showcases',
    items: [
      {
        id: 'livestream-ugc',
        title: '#Livestream',
        description: 'Creator UGC Live Streaming Studio & Broadcast',
        path: '/live-streaming',
        icon: 'Video',
        badge: { text: 'UGC', type: 'danger' }
      },
      {
        id: 'photocredits',
        title: 'PhotoCredits',
        description: 'Upload & download HD media for instant monetization',
        path: '/photocredits',
        icon: 'Camera',
        logoUrl: '/assets/logos/photocredits_icon.png',
        badge: { text: 'Monetize', type: 'success' }
      },
      {
        id: 'gallery-ugc',
        title: 'Media Gallery',
        description: 'High Definition image & video collection',
        path: '/photos',
        icon: 'Images'
      },
      {
        id: 'folders',
        title: 'Folders',
        description: 'Organized media assets & file storage',
        path: '/my-downloads',
        icon: 'Folder'
      },
      {
        id: 'fingerlux',
        title: 'FingerLux',
        description: 'Premium luxury portfolio & high-end showcases',
        path: '/fingerlux',
        icon: 'Sparkles',
        logoUrl: '/assets/logos/fingerlux_icon.png',
        badge: { text: 'VIP', type: 'warning' }
      },
      {
        id: 'portfolio',
        title: 'Portfolio',
        description: 'Personal creative showcase',
        path: '/portfolio',
        icon: 'Briefcase'
      },
      {
        id: 'catalogue',
        title: 'Catalogue',
        description: 'Service & digital product list',
        path: '/catalogue',
        icon: 'List'
      }
    ]
  },
  {
    id: 'finance-monetization',
    title: 'Finance & Monetization Ops',
    icon: 'DollarSign',
    description: 'Wallet, Paylinks, Infinite Coins, Analytics & Payouts',
    items: [
      {
        id: 'subscriptions',
        title: 'Subscriptions',
        description: 'Manage memberships & plan tiers',
        path: '/pricing',
        icon: 'CreditCard'
      },
      {
        id: 'paylinks',
        title: 'Paylinks',
        description: 'Instant payment link generator',
        path: '/paylinks',
        icon: 'Link'
      },
      {
        id: 'referrals',
        title: 'Referral Programs',
        description: 'Invite members & earn commissions',
        path: '/referrals',
        icon: 'UserPlus'
      },
      {
        id: 'loyalty',
        title: 'Loyalty Programs',
        description: 'Reward points & perks',
        path: '/loyalty',
        icon: 'Award'
      },
      {
        id: 'gift-cards',
        title: 'Gift Cards',
        description: 'Purchase & redeem digital gift cards',
        path: '/advanced-gifting',
        icon: 'Gift'
      },
      {
        id: 'services',
        title: 'Services',
        description: 'Business & professional services',
        path: '/services',
        icon: 'Wrench'
      },
      {
        id: 'franchise',
        title: 'Franchise Models',
        description: 'FingerMobile partner & franchise network',
        path: '/franchise',
        icon: 'Network'
      },
      {
        id: 'business-offices',
        title: 'Business Offices',
        description: 'Virtual office & team hubs',
        path: '/business-offices',
        icon: 'Briefcase'
      },
      {
        id: 'monetization',
        title: 'Monetization Hub',
        description: 'Overview of all earnings & streams',
        path: '/monetization-dashboard',
        icon: 'TrendingUp'
      },
      {
        id: 'infinite-coins',
        title: 'Infinite Coins',
        description: 'Platform native currency & vault balance',
        path: '/fic-vault',
        icon: 'Coins',
        logoUrl: '/assets/logos/fic_logo.png',
        badge: { text: 'FIC', type: 'info' }
      },
      {
        id: 'my-wallet',
        title: 'My Wallet',
        description: 'Balance, transactions & funding',
        path: '/wallet',
        icon: 'Wallet'
      },
      {
        id: 'ugc-analysis',
        title: 'UGC Analysis Dashboard',
        description: 'Performance metrics for uploaded content',
        path: '/ugc-dashboard',
        icon: 'BarChart2'
      },
      {
        id: 'payouts',
        title: 'Payment and Payouts',
        description: 'Withdraw funds & payout history',
        path: '/payouts',
        icon: 'DollarSign'
      }
    ]
  },
  {
    id: 'system-engagement',
    title: 'Gamification, Campaigns & System',
    icon: 'Gamepad2',
    description: 'Games, FingerWars, Campaigns, Coupons, Support & Settings',
    items: [
      {
        id: 'game-on',
        title: 'Game On',
        description: 'Gaming hub & leaderboards',
        path: '/game-on',
        icon: 'Gamepad2',
        logoUrl: '/assets/logos/supervi_logo.png'
      },
      {
        id: 'supervi-gaming',
        title: 'SuperVi Arena',
        description: 'SuperVi next-gen sovereign gaming & tournament arena',
        path: '/games/supervi',
        icon: 'Gamepad2',
        logoUrl: '/assets/logos/supervi_logo.png',
        badge: { text: 'Arena', type: 'warning' }
      },
      {
        id: 'finger-wars',
        title: 'FingerWars',
        description: 'Community battles & viral challenges',
        path: '/finger-wars',
        icon: 'Swords',
        badge: { text: 'Live', type: 'danger' }
      },
      {
        id: 'campaigns',
        title: 'Campaigns',
        description: 'Marketing & promotional campaigns',
        path: '/canary-ads',
        icon: 'Target'
      },
      {
        id: 'coupons',
        title: 'Coupons',
        description: 'Discounts & promotional vouchers',
        path: '/coupons',
        icon: 'Tag'
      },
      {
        id: 'settings-hub',
        title: 'Settings Hub',
        description: 'Central enterprise configuration & feature console',
        path: '/settings-hub',
        icon: 'Sliders',
        badge: { text: 'Hub', type: 'info' }
      },
      {
        id: 'roles-permissions',
        title: 'Roles & Permissions',
        description: 'Collaborator seats, 45+ role permissions & location scopes',
        path: '/settings/roles-permissions',
        icon: 'ShieldCheck',
        badge: { text: 'RBAC', type: 'primary' }
      },
      {
        id: 'site-member-access',
        title: 'Site Member Access',
        description: 'Gate site pages for specific member roles & plans',
        path: '/contacts/site-members/site-member-access',
        icon: 'Lock',
        badge: { text: 'Gated', type: 'warning' }
      },
      {
        id: 'badges-studio',
        title: 'Member Badges Studio',
        description: 'Design custom badges, page unlocks & assign to members',
        path: '/settings/badges',
        icon: 'Award',
        badge: { text: 'Studio', type: 'success' }
      },
      {
        id: 'settings',
        title: 'Settings',
        description: 'Account, security & site preferences',
        path: '/settings',
        icon: 'Settings'
      },
      {
        id: 'support',
        title: 'Support Services',
        description: 'Customer help & tickets',
        path: '/support',
        icon: 'HelpCircle'
      }
    ]
  }
];
