import {
  HomeIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  MegaphoneIcon,
  NewspaperIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PresentationChartLineIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  MemberGroupIcon,
  ShieldCheckIcon,
  MicrophoneIcon,
  GiftIcon,
  FireIcon,
  SettingsIcon,
  GlobeAltIcon,
  WalletIcon,
  BoltIcon,
  KeyIcon,
  ShieldIcon,
  PuzzlePieceIcon,
  IdentificationIcon,
  CubeIcon,
  PhotoIcon,
  VideoCameraIcon,
  SwatchIcon,
  FingerPrintIcon,
  ShieldExclamationIcon,
  CpuChipIcon
} from './components/icons';

export const DASHBOARD_NAVIGATION = [
  { name: 'Home', icon: HomeIcon, path: '/dashboard' },
  { name: 'Analytics', icon: ChartBarIcon, path: '/dashboard/analytics' },
  { name: 'Members', icon: MemberGroupIcon, path: '/dashboard/members' },
  { name: 'Content', icon: DocumentTextIcon, path: '/dashboard/content' },
  {
    name: 'Marketplace',
    icon: ShoppingBagIcon,
    path: '/dashboard/marketplace'
  },
  { name: 'Finance', icon: CurrencyDollarIcon, path: '/dashboard/finance' },
  {
    name: 'Marketing',
    icon: MegaphoneIcon,
    children: [
      { name: 'Dashboard', path: '/dashboard/marketing', icon: ChartBarIcon },
      {
        name: 'Campaigns',
        path: '/dashboard/marketing/campaigns',
        icon: MegaphoneIcon
      },
      {
        name: 'Ad Placements',
        path: '/dashboard/marketing/ads',
        icon: NewspaperIcon
      }
    ]
  },
  {
    name: 'Franchise',
    icon: BuildingOfficeIcon,
    children: [
      {
        name: 'Management',
        path: '/dashboard/franchise',
        icon: BuildingOfficeIcon
      },
      {
        name: 'Locations',
        path: '/dashboard/franchise/locations',
        icon: MapPinIcon
      },
      {
        name: 'Reports',
        path: '/dashboard/franchise/reports',
        icon: DocumentTextIcon
      }
    ]
  },
  {
    name: 'Investors',
    icon: PresentationChartLineIcon,
    children: [
      {
        name: 'Dashboard',
        path: '/dashboard/investors',
        icon: PresentationChartLineIcon
      },
      {
        name: 'Reports',
        path: '/dashboard/investors/reports',
        icon: DocumentTextIcon
      },
      {
        name: 'Communications',
        path: '/dashboard/investors/communications',
        icon: ChatBubbleLeftRightIcon
      }
    ]
  },
  {
    name: 'Admin',
    icon: CogIcon,
    children: [
      { name: 'Dashboard', path: '/dashboard/admin', icon: CogIcon },
      {
        name: 'Member Management',
        path: '/dashboard/admin/members',
        icon: MemberGroupIcon
      },
      {
        name: 'Content Moderation',
        path: '/dashboard/admin/content',
        icon: DocumentTextIcon
      },
      {
        name: 'Security',
        path: '/dashboard/admin/security',
        icon: ShieldCheckIcon
      },
      {
        name: 'Monetization',
        path: '/dashboard/admin/monetization',
        icon: CurrencyDollarIcon
      }
    ]
  },
  {
    name: 'Voice & Gaming',
    icon: MicrophoneIcon,
    children: [
      { name: 'Voice Engine', path: '/dashboard/voice', icon: MicrophoneIcon },
      { name: 'Gifting Engine', path: '/dashboard/gifting', icon: GiftIcon },
      { name: 'FingerWar', path: '/dashboard/fingerwar', icon: FireIcon }
    ]
  },
  {
    name: 'Settings',
    icon: SettingsIcon,
    children: [
      {
        name: 'General',
        path: '/dashboard/settings/general',
        icon: SettingsIcon
      },
      {
        name: 'Domains',
        path: '/dashboard/settings/domains',
        icon: GlobeAltIcon
      },
      {
        name: 'Billing',
        path: '/dashboard/settings/billing',
        icon: WalletIcon
      },
      { name: 'Policies', path: '/dashboard/policies', icon: DocumentTextIcon }
    ]
  },
  {
    name: 'Operations',
    icon: BoltIcon,
    children: [
      {
        name: 'Role Management',
        path: '/dashboard/operations/roles',
        icon: KeyIcon
      },
      {
        name: 'Platform Status',
        path: '/dashboard/operations/status',
        icon: ShieldIcon
      },
      {
        name: 'Feature Toggles',
        path: '/dashboard/operations/feature-toggles',
        icon: PuzzlePieceIcon
      }
    ]
  },
  {
    name: 'RBAC',
    icon: IdentificationIcon,
    children: [
      { name: 'Dashboard', path: '/dashboard/rbac', icon: ChartBarIcon },
      {
        name: 'Roles & Permissions',
        path: '/dashboard/rbac/roles',
        icon: KeyIcon
      },
      {
        name: 'Departments',
        path: '/dashboard/rbac/departments',
        icon: BuildingOfficeIcon
      },
      {
        name: 'Franchise Locations',
        path: '/dashboard/rbac/franchise',
        icon: GlobeAltIcon
      }
    ]
  },
  {
    name: 'STERCS Editor',
    icon: CubeIcon,
    children: [
      { name: 'Dashboard', path: '/dashboard/stercs', icon: CubeIcon },
      {
        name: 'Image Editor',
        path: '/dashboard/stercs/image-editor',
        icon: PhotoIcon
      },
      {
        name: 'Video Editor',
        path: '/dashboard/stercs/video-editor',
        icon: VideoCameraIcon
      },
      {
        name: 'Theme Designer',
        path: '/dashboard/stercs/theme-designer',
        icon: SwatchIcon
      },
      {
        name: 'Media Library',
        path: '/dashboard/stercs/media-library',
        icon: PhotoIcon
      }
    ]
  },
  {
    name: 'Guardian AI',
    icon: FingerPrintIcon,
    children: [
      {
        name: 'STERCS Control',
        path: '/dashboard/guardian/stercs',
        icon: ShieldExclamationIcon
      },
      {
        name: 'SENTIENT AI',
        path: '/dashboard/guardian/sentient',
        icon: CpuChipIcon
      },
      {
        name: 'PROMPTS Security',
        path: '/dashboard/guardian/prompts',
        icon: ShieldExclamationIcon
      },
      {
        name: 'GUARDIAN Protocol',
        path: '/dashboard/guardian/protocol',
        icon: ShieldCheckIcon
      }
    ]
  }
];

export const FAQ_DATA = [
  {
    question: 'How do I reset my password?',
    answer:
      'You can reset your password by going to Settings > Security > Change Password. Alternatively, on the login screen, click \'Forgot Password\' and follow the instructions sent to your email.'
  },
  {
    question: 'How do I update my payment method?',
    answer:
      'Navigate to Settings > Billing > Payment Methods. You can add, remove, or set a default payment method from this screen.'
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes, you can cancel your subscription at any time. Go to Settings > Billing > Subscription and click \'Cancel Subscription\'. Your subscription will remain active until the end of the current billing period.'
  },
  {
    question: 'How do I contact customer support?',
    answer:
      'You can reach our support team by submitting a ticket through this page, or by emailing support@fingerprotocol.com. Our team typically responds within 24 hours.'
  },
  {
    question: 'What are Gems and how do I earn them?',
    answer:
      'Gems are our platform\'s virtual currency. You can earn them by creating content, engaging with others, and participating in special events. They can be used to unlock premium features and exclusive content.'
  }
];

export const NORSE_GOD_GIFT_CARDS = [
  {
    name: 'Odin',
    color: 'from-blue-600 to-purple-700',
    icon: '👑',
    benefits: [
      'Premium profile badge',
      'Exclusive content access',
      'Priority support'
    ]
  },
  {
    name: 'Thor',
    color: 'from-red-500 to-orange-500',
    icon: '⚡',
    benefits: [
      'Enhanced audio quality',
      'Extended streaming time',
      'Special effects'
    ]
  },
  {
    name: 'Loki',
    color: 'from-green-500 to-teal-500',
    icon: '🎭',
    benefits: ['Stealth mode', 'Mystery gifts', 'Trickster abilities']
  },
  {
    name: 'Freya',
    color: 'from-pink-500 to-rose-500',
    icon: '💖',
    benefits: ['Love matching', 'Heartfelt connections', 'Beauty enhancements']
  },
  {
    name: 'Heimdall',
    color: 'from-yellow-500 to-amber-500',
    icon: '👁️',
    benefits: [
      'Advanced analytics',
      'Insightful reports',
      'Guardian oversight'
    ]
  }
];

// FingerLux booking categories used in FingerLuxPage
export const BOOKING_CATEGORIES = [
  {
    id: 'lux-1',
    name: 'Luxury Hotels',
    description:
      'Five-star accommodations with premium amenities and concierge service.',
    icon: '🏨',
    image:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80&auto=format&fit=crop',
    type: 'Accommodation'
  },
  {
    id: 'lux-2',
    name: 'Private Jets',
    description:
      'Exclusive private air travel with personalized flight experiences.',
    icon: '✈️',
    image:
      'https://images.unsplash.com/photo-1516466723877-1d3d66f3a8d7?w=1200&q=80&auto=format&fit=crop',
    type: 'Transport'
  },
  {
    id: 'lux-3',
    name: 'Yachts & Cruises',
    description: 'Premium yacht charters and luxury cruise experiences.',
    icon: '🛥️',
    image:
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&q=80&auto=format&fit=crop',
    type: 'Leisure'
  },
  {
    id: 'lux-4',
    name: 'Exclusive Events',
    description: 'VIP access to concerts, galas, and high-end social events.',
    icon: '🎟️',
    image:
      'https://images.unsplash.com/photo-1515165562835-c4c73a044ffd?w=1200&q=80&auto=format&fit=crop',
    type: 'Events'
  }
];
