/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {} from 'react';
import {
  BanknotesIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  ChartBarIcon,
  GiftIcon,
  LockClosedIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  CalendarIcon,
  BellAlertIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  LifebuoyIcon,
  PresentationChartBarIcon,
  RectangleStackIcon,
  ArrowTrendingUpIcon,
  Squares2X2Icon,
  NewspaperIcon,
  FilmIcon,
  MusicalNoteIcon,
  VideoCameraIcon,
  ShoppingCartIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  LightBulbIcon,
  UserCircleIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  StarIcon,
  MoonIcon,
  SunIcon,
  ComputerDesktopIcon,
  PhoneIcon,
  EnvelopeIcon,
  KeyIcon,
  FingerPrintIcon,
  LockOpenIcon,
  SignalIcon,
  SignalSlashIcon,
  ArrowsPointingOutIcon,
  WifiIcon,
  Battery100Icon,
  ArrowsRightLeftIcon,
  CubeIcon,
  CubeTransparentIcon,
  CurrencyDollarIcon,
  TagIcon,
  BuildingOfficeIcon,
  BuildingLibraryIcon,
  TruckIcon,
  DocumentCheckIcon,
  UserPlusIcon,
  LinkIcon,
  HashtagIcon,
  FireIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChartPieIcon,
  FolderIcon,
  FolderOpenIcon,
  DocumentDuplicateIcon,
  SwatchIcon,
  BarsArrowUpIcon,
  WrenchScrewdriverIcon,
  CommandLineIcon,
  PowerIcon,
  CheckIcon,
  FunnelIcon,
  HandRaisedIcon,
  HandThumbUpIcon,
  QuestionMarkCircleIcon,
  QueueListIcon,
  TableCellsIcon,
  ServerIcon,
  DeviceTabletIcon,
  HomeIcon,
  UsersIcon
} from '../icons';

// Aliasing solid icons to outline ones for now to stabilize build
const ChatBubbleLeftRightIconSolid = ChatBubbleLeftRightIcon;
const HeartIconSolid = HeartIcon;
const ShoppingBagIconSolid = ShoppingBagIcon;
const GiftIconSolid = GiftIcon;
const NewspaperIconSolid = NewspaperIcon;
const FilmIconSolid = FilmIcon;
const MusicalNoteIconSolid = MusicalNoteIcon;
const VideoCameraIconSolid = VideoCameraIcon;
const ShoppingCartIconSolid = ShoppingCartIcon;
const AcademicCapIconSolid = AcademicCapIcon;
const BriefcaseIconSolid = BriefcaseIcon;
const LightBulbIconSolid = LightBulbIcon;
const UserCircleIconSolid = UserCircleIcon;
const StarIconSolid = StarIcon;
const MoonIconSolid = MoonIcon;
const SunIconSolid = SunIcon;
const CurrencyDollarIconSolid = CurrencyDollarIcon;
const BuildingOfficeIconSolid = BuildingOfficeIcon;
const BuildingLibraryIconSolid = BuildingLibraryIcon;
const TruckIconSolid = TruckIcon;
const DocumentCheckIconSolid = DocumentCheckIcon;
const UserPlusIconSolid = UserPlusIcon;
const FireIconSolid = FireIcon;
const ArrowPathIconSolid = ArrowPathIcon;
const ArrowDownTrayIconSolid = ArrowDownTrayIcon;
const ArrowUpTrayIconSolid = ArrowUpTrayIcon;
const ChartPieIconSolid = ChartPieIcon;
const SwatchIconSolid = SwatchIcon;
const BarsArrowUpIconSolid = BarsArrowUpIcon;
const WrenchScrewdriverIconSolid = WrenchScrewdriverIcon;
const QueueListIconSolid = QueueListIcon;
const TableCellsIconSolid = TableCellsIcon;
const ServerIconSolid = ServerIcon;
const ArrowPathRoundedSquareIconSolid = ArrowPathIcon;
const ArrowRightCircleIconSolid = ArrowRightOnRectangleIcon;
const ArrowLeftCircleIconSolid = ArrowRightOnRectangleIcon;
const PlusCircleIconSolid = UserPlusIcon;
const MinusCircleIconSolid = CheckIcon;
const ExclamationTriangleIconSolid = ShieldCheckIcon;
const ExclamationCircleIconSolid = ShieldCheckIcon;
const InformationCircleIconSolid = QuestionMarkCircleIcon;
const ChatBubbleBottomCenterTextIconSolid = ChatBubbleLeftRightIcon;
const ChatBubbleLeftEllipsisIconSolid = ChatBubbleLeftRightIcon;
const ArchiveBoxIconSolid = FolderIcon;
const TrashIconSolid = ShieldCheckIcon;
const PencilIconSolid = DocumentTextIcon;
const EyeIconSolid = DocumentTextIcon;
const EyeSlashIconSolid = DocumentTextIcon;
const ArrowTopRightOnSquareIconSolid = LinkIcon;
const ArrowDownIconSolid = ArrowDownTrayIcon;
const ArrowUpIconSolid = ArrowUpTrayIcon;
const ArrowLeftIconSolid = ArrowsRightLeftIcon;
const ArrowRightIconSolid = ArrowsRightLeftIcon;
const Bars3IconSolid = BarsArrowUpIcon;
const Bars3BottomLeftIconSolid = BarsArrowUpIcon;
const XMarkIconSolid = ShieldCheckIcon;
const EllipsisVerticalIconSolid = Cog6ToothIcon;
const EllipsisHorizontalIconSolid = Cog6ToothIcon;
const BackspaceIconSolid = ArrowRightOnRectangleIcon;
const CircleStackIconSolid = ServerIcon;

import type { Product } from '../types'; // Removed Program type since it doesn't exist

export interface PaymentProvider {
  id: string; name: string; type: string; enabled: boolean; provider: string; // Adding the missing field,
  icon: React.ComponentType<any>;
}

export const PAYMENT_PROVIDERS: PaymentProvider[] = [
  {id: 'provider-1',
    name: 'Stripe',
    type: 'card',
    enabled: true,
    provider: 'Stripe',
    icon: CreditCardIcon },
  {id: 'provider-2',
    name: 'PayPal',
    type: 'wallet',
    enabled: true,
    provider: 'PayPal',
    icon: GlobeAltIcon },
  {id: 'provider-3',
    name: 'Google Pay',
    type: 'digital-wallet',
    enabled: true,
    provider: 'Google Pay',
    icon: DevicePhoneMobileIcon },
  {id: 'provider-4',
    name: 'Apple Pay',
    type: 'digital-wallet',
    enabled: true,
    provider: 'Apple Pay',
    icon: DevicePhoneMobileIcon }
];

export const SIDEBAR_LINKS = [
  {name: 'Home',
    icon: HomeIcon,
    path: '/' },
  {name: 'Dashboard',
    icon: ChartBarIcon,
    path: '/dashboard' },
  {name: 'Members',
    icon: UserGroupIcon,
    path: '/dashboard/members' },
  {name: 'Messages',
    icon: ChatBubbleLeftRightIcon,
    path: '/dashboard/messages' },
  {name: 'Notifications',
    icon: BellAlertIcon,
    path: '/dashboard/notifications' },
  {name: 'Posts',
    icon: NewspaperIcon,
    path: '/dashboard/posts' },
  {name: 'Media',
    icon: FilmIcon,
    path: '/dashboard/media' },
  {name: 'Marketplace',
    icon: ShoppingBagIcon,
    path: '/dashboard/marketplace' },
  {name: 'Storefronts',
    icon: BuildingStorefrontIcon,
    path: '/dashboard/storefronts' },
  {name: 'Events',
    icon: CalendarIcon,
    path: '/dashboard/events' },
  {name: 'Courses',
    icon: AcademicCapIcon,
    path: '/dashboard/courses' },
  {name: 'Jobs',
    icon: BriefcaseIcon,
    path: '/dashboard/jobs' },
  {name: 'Gigs',
    icon: LightBulbIcon,
    path: '/dashboard/gigs' },
  {name: 'Paylinks',
    icon: LinkIcon,
    path: '/dashboard/paylinks' },
  {name: 'Hallmarks',
    icon: HashtagIcon,
    path: '/dashboard/hallmarks' },
  {name: 'Gems',
    icon: FireIcon,
    path: '/dashboard/gems' },
  {name: 'Blogs',
    icon: DocumentTextIcon,
    path: '/dashboard/blogs' },
  {name: 'News',
    icon: ArrowPathIcon,
    path: '/dashboard/news' },
  {name: 'Music',
    icon: MusicalNoteIcon,
    path: '/dashboard/music' },
  {name: 'Videos',
    icon: VideoCameraIcon,
    path: '/dashboard/videos' },
  {name: 'Live Streams',
    icon: VideoCameraIcon,
    path: '/dashboard/live-streams' },
  {name: 'Forums',
    icon: ChatBubbleLeftRightIcon,
    path: '/dashboard/forums' },
  {name: 'Groups',
    icon: UsersIcon,
    path: '/dashboard/groups' },
  {name: 'Topics',
    icon: HashtagIcon,
    path: '/dashboard/topics' },
  {name: 'Coupons',
    icon: TagIcon,
    path: '/dashboard/coupons' },
  {name: 'Gift Cards',
    icon: GiftIcon,
    path: '/dashboard/giftcards' },
  {name: 'Wallet',
    icon: BanknotesIcon,
    path: '/dashboard/wallet' },
  {name: 'Payouts',
    icon: CurrencyDollarIcon,
    path: '/dashboard/payouts' },
  {name: 'Orders',
    icon: ShoppingCartIcon,
    path: '/dashboard/orders' },
  {name: 'Products',
    icon: CubeIcon,
    path: '/dashboard/products' },
  {name: 'Services',
    icon: CubeTransparentIcon,
    path: '/dashboard/services' },
  {name: 'Settings',
    icon: Cog6ToothIcon,
    path: '/dashboard/settings' },
  {name: 'Security',
    icon: ShieldCheckIcon,
    path: '/dashboard/security' },
  {name: 'Help Center',
    icon: LifebuoyIcon,
    path: '/dashboard/help' },
  {name: 'Analytics',
    icon: PresentationChartBarIcon,
    path: '/dashboard/analytics' },
  {name: 'Reports',
    icon: ChartBarIcon,
    path: '/dashboard/reports' },
  {name: 'Admin',
    icon: RectangleStackIcon,
    path: '/dashboard/admin' },
  {name: 'Moderation',
    icon: ArrowTrendingUpIcon,
    path: '/dashboard/moderation' },
  {name: 'Business Hub',
    icon: BuildingOfficeIcon,
    path: '/dashboard/business-hub' },
  {name: 'Franchise',
    icon: BuildingLibraryIcon,
    path: '/dashboard/franchise' },
  {name: 'Logistics',
    icon: TruckIcon,
    path: '/dashboard/logistics' },
  {name: 'Compliance',
    icon: DocumentCheckIcon,
    path: '/dashboard/compliance' },
  {name: 'RBAC',
    icon: UserPlusIcon,
    path: '/dashboard/rbac' },
  {name: 'API Management',
    icon: LinkIcon,
    path: '/dashboard/api-management' }
];

export const DASHBOARD_SIDEBAR_LINKS = [
  {name: 'Overview',
    icon: ChartBarIcon,
    path: '/dashboard/overview' },
  {name: 'Analytics',
    icon: PresentationChartBarIcon,
    path: '/dashboard/analytics' },
  {name: 'Content',
    icon: DocumentTextIcon,
    path: '/dashboard/content' },
  {name: 'Community',
    icon: UserGroupIcon,
    path: '/dashboard/community' },
  {name: 'Engagement',
    icon: ChatBubbleLeftRightIcon,
    path: '/dashboard/engagement' },
  {name: 'Commerce',
    icon: ShoppingCartIcon,
    path: '/dashboard/commerce' },
  {name: 'Operations',
    icon: WrenchScrewdriverIcon,
    path: '/dashboard/operations' },
  {name: 'Monetization',
    icon: CurrencyDollarIcon,
    path: '/dashboard/monetization' },
  {name: 'Marketing',
    icon: ChatBubbleLeftRightIcon,
    path: '/dashboard/marketing' }, // Using existing icon
  {name: 'Growth',
    icon: ArrowTrendingUpIcon,
    path: '/dashboard/growth' },
  {name: 'Support',
    icon: LifebuoyIcon,
    path: '/dashboard/support' },
  {name: 'System',
    icon: ServerIcon,
    path: '/dashboard/system' },
  {name: 'Security',
    icon: ShieldCheckIcon,
    path: '/dashboard/security' },
  {name: 'Compliance',
    icon: DocumentCheckIcon,
    path: '/dashboard/compliance' },
  {name: 'Integrations',
    icon: LinkIcon,
    path: '/dashboard/integrations' },
  {name: 'Tools',
    icon: WrenchScrewdriverIcon,
    path: '/dashboard/tools' },
  {name: 'Settings',
    icon: Cog6ToothIcon,
    path: '/dashboard/settings' }
];

// Dashboard navigation using only existing icons
export const DASHBOARD_NAVIGATION = [
  {name: 'Home',
    icon: HomeIcon,
    path: '/dashboard/home' },
  {name: 'Wallet',
    icon: BanknotesIcon,
    path: '/dashboard/wallet' },
  {name: 'Messages',
    icon: ChatBubbleLeftRightIcon,
    path: '/dashboard/messages' },
  {name: 'Marketplace',
    icon: ShoppingBagIcon,
    path: '/dashboard/marketplace' },
  {name: 'Social',
    icon: HeartIcon,
    path: '/dashboard/social' },
  {name: 'Business',
    icon: BuildingOfficeIcon,
    path: '/dashboard/business' },
  {name: 'Courses',
    icon: AcademicCapIcon,
    path: '/dashboard/courses' },
  {name: 'AI Tools',
    icon: LightBulbIcon,
    path: '/dashboard/aitools' },
  {name: 'Entertainment',
    icon: FilmIcon,
    path: '/dashboard/entertainment' },
  {name: 'News',
    icon: NewspaperIcon,
    path: '/dashboard/news' },
  {name: 'Apps',
    icon: DevicePhoneMobileIcon,
    path: '/dashboard/apps' },
  {name: 'Settings',
    icon: Cog6ToothIcon,
    path: '/dashboard/settings' },
  {name: 'Support',
    icon: LifebuoyIcon,
    path: '/dashboard/support' },
  {name: 'Members',
    icon: UserGroupIcon,
    path: '/dashboard/members' }
];

// Alternative dashboard navigation section with fixed icons
export const DASHBOARD_NAVIGATION_ALT = [
  {name: 'Home',
    icon: HomeIcon,
    path: '/dashboard' },
  {name: 'Analytics',
    icon: ChartBarIcon,
    path: '/dashboard/analytics' },
  {name: 'Members',
    icon: UserGroupIcon,
    path: '/dashboard/members' },
  {name: 'Content',
    icon: DocumentTextIcon,
    path: '/dashboard/content' },
  {name: 'Marketplace',
    icon: ShoppingBagIcon,
    path: '/dashboard/marketplace'
  },
  {name: 'Finance',
    icon: CurrencyDollarIcon,
    path: '/dashboard/finance' },
  {name: 'Marketing',
    icon: ChatBubbleLeftRightIcon,
    children: [
      {
        name: 'Dashboard',
        path: '/dashboard/marketing',
        icon: ChartBarIcon },
      {name: 'Campaigns',
        path: '/dashboard/marketing/campaigns',
        icon: ChatBubbleLeftRightIcon},
      {name: 'Ad Placements',
        path: '/dashboard/marketing/ads',
        icon: NewspaperIcon
      }
    ]},
  {name: 'Franchise',
    icon: BuildingOfficeIcon,
    children: [
      {
        name: 'Management',
        path: '/dashboard/franchise',
        icon: BuildingOfficeIcon
      },
      {name: 'Locations',
        path: '/dashboard/franchise/locations',
        icon: MapPinIcon
      },
      {name: 'Reports',
        path: '/dashboard/franchise/reports',
        icon: DocumentTextIcon
      }
    ]
  },
  {name: 'Investors',
    icon: PresentationChartBarIcon,
    children: [
      {
        name: 'Dashboard',
        path: '/dashboard/investors',
        icon: PresentationChartBarIcon
      },
      {name: 'Reports',
        path: '/dashboard/investors/reports',
        icon: DocumentTextIcon
      },
      {name: 'Communications',
        path: '/dashboard/investors/communications',
        icon: ChatBubbleLeftRightIcon
      }
    ]
  },
  {name: 'Admin',
    icon: Cog6ToothIcon,
    children: [
      {
        name: 'Dashboard',
        path: '/dashboard/admin',
        icon: Cog6ToothIcon },
      {name: 'Member Management',
        path: '/dashboard/admin/members',
        icon: UserGroupIcon},
      {name: 'Content Moderation',
        path: '/dashboard/admin/content',
        icon: DocumentTextIcon
      },
      {name: 'Security',
        path: '/dashboard/admin/security',
        icon: ShieldCheckIcon
      },
      {name: 'Monetization',
        path: '/dashboard/admin/monetization',
        icon: CurrencyDollarIcon
      }
    ]
  },
  {name: 'Voice & Gaming',
    icon: MusicalNoteIcon,
    children: [
      {
        name: 'Voice Engine',
        path: '/dashboard/voice',
        icon: MusicalNoteIcon },
      {name: 'Gifting Engine',
        path: '/dashboard/gifting',
        icon: GiftIcon },
      {name: 'FingerWar',
        path: '/dashboard/fingerwar',
        icon: FireIcon }
    ]
  },
  {name: 'Settings',
    icon: Cog6ToothIcon,
    children: [
      {
        name: 'General',
        path: '/dashboard/settings/general',
        icon: Cog6ToothIcon
      },
      {name: 'Domains',
        path: '/dashboard/settings/domains',
        icon: GlobeAltIcon
      },
      {name: 'Billing',
        path: '/dashboard/settings/billing',
        icon: BanknotesIcon},
      {name: 'Policies',
        path: '/dashboard/policies',
        icon: DocumentTextIcon }
    ]
  },
  {name: 'Operations',
    icon: ArrowTrendingUpIcon,
    children: [
      {
        name: 'Role Management',
        path: '/dashboard/operations/roles',
        icon: KeyIcon
      },
      {name: 'Platform Status',
        path: '/dashboard/operations/status',
        icon: ShieldCheckIcon
      },
      {name: 'Feature Toggles',
        path: '/dashboard/operations/feature-toggles',
        icon: FunnelIcon}
    ]
  },
  {name: 'RBAC',
    icon: FingerPrintIcon,
    children: [
      {
        name: 'Dashboard',
        path: '/dashboard/rbac',
        icon: ChartBarIcon },
      {name: 'Roles & Permissions',
        path: '/dashboard/rbac/roles',
        icon: KeyIcon
      },
      {name: 'Departments',
        path: '/dashboard/rbac/departments',
        icon: BuildingOfficeIcon
      },
      {name: 'Franchise Locations',
        path: '/dashboard/rbac/franchise',
        icon: GlobeAltIcon
      }
    ]
  },
  {name: 'STERCS Editor',
    icon: CubeIcon,
    children: [
      {
        name: 'Dashboard',
        path: '/dashboard/stercs',
        icon: CubeIcon },
      {name: 'Image Editor',
        path: '/dashboard/stercs/image-editor',
        icon: SwatchIcon},
      {name: 'Video Editor',
        path: '/dashboard/stercs/video-editor',
        icon: VideoCameraIcon
      },
      {name: 'Theme Designer',
        path: '/dashboard/stercs/theme-designer',
        icon: SwatchIcon
      },
      {name: 'Media Library',
        path: '/dashboard/stercs/media-library',
        icon: SwatchIcon}
    ]
  },
  {name: 'Guardian AI',
    icon: FingerPrintIcon,
    children: [
      {
        name: 'STERCS Control',
        path: '/dashboard/guardian/stercs',
        icon: ShieldCheckIcon},
      {name: 'SENTIENT AI',
        path: '/dashboard/guardian/sentient',
        icon: LightBulbIcon},
      {name: 'GUARDIAN Protocol',
        path: '/dashboard/guardian/protocol',
        icon: ShieldCheckIcon
      }
    ]
  }
];

// Admin navigation using only existing icons
export const ADMIN_NAVIGATION = [
  {name: 'Platform Admin',
    icon: Cog6ToothIcon,
    path: '/dashboard/admin',
    subItems: [
      {
        name: 'System Status',
        path: '/dashboard/admin/status',
        icon: SignalIcon },
      {name: 'System Config',
        path: '/dashboard/admin/config',
        icon: Cog6ToothIcon },
      {name: 'User Management',
        path: '/dashboard/admin/users',
        icon: UserGroupIcon },
      {name: 'Content Moderation',
        path: '/dashboard/admin/moderation',
        icon: ShieldCheckIcon },
      {name: 'Security',
        path: '/dashboard/admin/security',
        icon: LockClosedIcon },
      {name: 'Audit Logs',
        path: '/dashboard/admin/logs',
        icon: DocumentTextIcon },
      {name: 'Permissions',
        path: '/dashboard/admin/permissions',
        icon: FingerPrintIcon },
      {name: 'System Health',
        path: '/dashboard/admin/health',
        icon: HeartIcon },
      {name: 'Backup & Recovery',
        path: '/dashboard/admin/backup',
        icon: ArrowPathIcon },
      {name: 'Maintenance',
        path: '/dashboard/admin/maintenance',
        icon: WrenchScrewdriverIcon },
      {name: 'Notifications',
        path: '/dashboard/admin/notifications',
        icon: BellAlertIcon },
      {name: 'API Management',
        path: '/dashboard/admin/api',
        icon: LinkIcon },
      {name: 'Reports',
        path: '/dashboard/admin/reports',
        icon: ChartBarIcon }
    ]
  },
  {name: 'Media Engine',
    icon: FilmIcon,
    path: '/dashboard/media',
    subItems: [
      {
        name: 'Video Processing',
        path: '/dashboard/media/video',
        icon: VideoCameraIcon },
      {name: 'Audio Processing',
        path: '/dashboard/media/audio',
        icon: MusicalNoteIcon },
      {name: 'Image Processing',
        path: '/dashboard/media/images',
        icon: SwatchIcon },
      {name: 'Transcoding',
        path: '/dashboard/media/transcoding',
        icon: ArrowPathIcon },
      {name: 'Streaming',
        path: '/dashboard/media/streaming',
        icon: WifiIcon },
      {name: 'CDN Management',
        path: '/dashboard/media/cdn',
        icon: ServerIcon },
      {name: 'Voice Engine',
        path: '/dashboard/voice',
        icon: MusicalNoteIcon }
    ]
  },
  {name: 'Platform Config',
    icon: Cog6ToothIcon,
    path: '/dashboard/platform-config',
    subItems: [
      {
        name: 'System Settings',
        path: '/dashboard/platform-config/system',
        icon: Cog6ToothIcon },
      {name: 'Feature Toggles',
        path: '/dashboard/platform-config/features',
        icon: FunnelIcon },
      {name: 'Environment Config',
        path: '/dashboard/platform-config/env',
        icon: ComputerDesktopIcon },
      {name: 'Performance',
        path: '/dashboard/platform-config/performance',
        icon: ArrowTrendingUpIcon },
      {name: 'Caching',
        path: '/dashboard/platform-config/caching',
        icon: ServerIcon }, // Using ServerIcon instead of CircleStackIcon
      {name: 'Queues',
        path: '/dashboard/platform-config/queues',
        icon: QueueListIcon },
      {name: 'Monitoring',
        path: '/dashboard/platform-config/monitoring',
        icon: PresentationChartBarIcon },
      {name: 'Alerts',
        path: '/dashboard/platform-config/alerts',
        icon: BellAlertIcon },
      {name: 'Backup',
        path: '/dashboard/platform-config/backup',
        icon: ArrowDownTrayIcon },
      {name: 'Migration Tools',
        path: '/dashboard/platform-config/migration',
        icon: ArrowUpTrayIcon },
      {name: 'Data Export',
        path: '/dashboard/platform-config/export',
        icon: ArrowUpTrayIcon },
      {name: 'Data Import',
        path: '/dashboard/platform-config/import',
        icon: ArrowDownTrayIcon }
    ]
  },
  {name: 'Advanced Features',
    icon: ArrowTrendingUpIcon,
    path: '/dashboard/advanced',
    subItems: [
      {
        name: 'AI Services',
        path: '/dashboard/advanced/ai',
        icon: LightBulbIcon },
      {name: 'ML Models',
        path: '/dashboard/advanced/ml',
        icon: ChartPieIcon },
      {name: 'Predictive Analytics',
        path: '/dashboard/advanced/predictive',
        icon: PresentationChartBarIcon },
      {name: 'Automation',
        path: '/dashboard/advanced/automation',
        icon: CommandLineIcon },
      {name: 'Workflows',
        path: '/dashboard/advanced/workflows',
        icon: ArrowsRightLeftIcon },
      {name: 'Integrations',
        path: '/dashboard/advanced/integrations',
        icon: LinkIcon },
      {name: 'Plugins',
        path: '/dashboard/advanced/plugins',
        icon: CubeTransparentIcon },
      {name: 'Extensions',
        path: '/dashboard/advanced/extensions',
        icon: CubeIcon },
      {name: 'Custom Fields',
        path: '/dashboard/advanced/custom-fields',
        icon: UserIcon },
      {name: 'Permissions Matrix',
        path: '/dashboard/advanced/permissions-matrix',
        icon: TableCellsIcon },
      {name: 'API Gateway',
        path: '/dashboard/advanced/api-gateway',
        icon: GlobeAltIcon },
      {name: 'Rate Limiting',
        path: '/dashboard/advanced/rate-limiting',
        icon: ClockIcon }
    ]
  },
  {name: 'Media Tools',
    icon: FilmIcon,
    path: '/dashboard/media-tools',
    subItems: [
      {
        name: 'Image Editor',
        path: '/dashboard/media-tools/image-editor',
        icon: SwatchIcon },
      {name: 'Video Editor',
        path: '/dashboard/media-tools/video-editor',
        icon: VideoCameraIcon },
      {name: 'Audio Editor',
        path: '/dashboard/media-tools/audio-editor',
        icon: MusicalNoteIcon },
      {name: 'Thumbnail Generator',
        path: '/dashboard/media-tools/thumbnails',
        icon: SwatchIcon },
      {name: 'Watermarking',
        path: '/dashboard/media-tools/watermarking',
        icon: ShieldCheckIcon },
      {name: 'Optimization',
        path: '/dashboard/media-tools/optimization',
        icon: ArrowTrendingUpIcon }
    ]
  },
  {name: 'AI Tools',
    icon: LightBulbIcon,
    path: '/dashboard/ai-tools',
    subItems: [
      {
        name: 'Sentient AI',
        path: '/dashboard/ai-tools/sentient',
        icon: LightBulbIcon },
      {name: 'Guardian AI',
        path: '/dashboard/ai-tools/guardian',
        icon: FingerPrintIcon },
      {name: 'STERCS AI',
        path: '/dashboard/ai-tools/stercs',
        icon: ShieldCheckIcon },
      {name: 'Predictive Analytics',
        path: '/dashboard/ai-tools/predictive',
        icon: PresentationChartBarIcon },
      {name: 'Automation',
        path: '/dashboard/ai-tools/automation',
        icon: CommandLineIcon },
      {name: 'Workflows',
        path: '/dashboard/ai-tools/workflows',
        icon: ArrowsRightLeftIcon },
      {name: 'Integrations',
        path: '/dashboard/ai-tools/integrations',
        icon: LinkIcon },
      {name: 'Plugins',
        path: '/dashboard/ai-tools/plugins',
        icon: CubeTransparentIcon },
      {name: 'Extensions',
        path: '/dashboard/ai-tools/extensions',
        icon: CubeIcon },
      {name: 'Custom Fields',
        path: '/dashboard/ai-tools/custom-fields',
        icon: UserIcon },
      {name: 'Permissions Matrix',
        path: '/dashboard/ai-tools/permissions-matrix',
        icon: TableCellsIcon },
      {name: 'API Gateway',
        path: '/dashboard/ai-tools/api-gateway',
        icon: GlobeAltIcon },
      {name: 'Rate Limiting',
        path: '/dashboard/ai-tools/rate-limiting',
        icon: ClockIcon }
    ]
  },
  {name: 'Security Tools',
    icon: ShieldCheckIcon,
    path: '/dashboard/security-tools',
    subItems: [
      {
        name: 'Firewall',
        path: '/dashboard/security-tools/firewall',
        icon: ShieldCheckIcon },
      {name: 'Intrusion Detection',
        path: '/dashboard/security-tools/id',
        icon: ShieldCheckIcon },
      {name: 'Vulnerability Scanner',
        path: '/dashboard/security-tools/vuln',
        icon: ShieldCheckIcon },
      {name: 'DDoS Protection',
        path: '/dashboard/security-tools/ddos',
        icon: ShieldCheckIcon },
      {name: 'Encryption',
        path: '/dashboard/security-tools/encryption',
        icon: LockClosedIcon },
      {name: 'Access Control',
        path: '/dashboard/security-tools/access',
        icon: KeyIcon },
      {name: 'Audit Logs',
        path: '/dashboard/security-tools/logs',
        icon: DocumentTextIcon },
      {name: 'Incident Response',
        path: '/dashboard/security-tools/incident',
        icon: ShieldCheckIcon },
      {name: 'Compliance',
        path: '/dashboard/security-tools/compliance',
        icon: DocumentTextIcon },
      {name: 'Security Policies',
        path: '/dashboard/security-tools/policies',
        icon: DocumentTextIcon }
    ]
  },
  {name: 'Monitoring Tools',
    icon: PresentationChartBarIcon,
    path: '/dashboard/monitoring-tools',
    subItems: [
      {
        name: 'System Metrics',
        path: '/dashboard/monitoring-tools/metrics',
        icon: ChartBarIcon },
      {name: 'Resource Usage',
        path: '/dashboard/monitoring-tools/resources',
        icon: ChartPieIcon },
      {name: 'Network Traffic',
        path: '/dashboard/monitoring-tools/network',
        icon: WifiIcon },
      {name: 'Disk Usage',
        path: '/dashboard/monitoring-tools/disk',
        icon: ServerIcon }, // Using ServerIcon instead of CircleStackIcon
      {name: 'CPU Usage',
        path: '/dashboard/monitoring-tools/cpu',
        icon: LightBulbIcon },
      {name: 'Memory Usage',
        path: '/dashboard/monitoring-tools/memory',
        icon: ServerIcon }, // Using ServerIcon instead of CircleStackIcon
      {name: 'Database Performance',
        path: '/dashboard/monitoring-tools/db',
        icon: ServerIcon },
      {name: 'Application Performance',
        path: '/dashboard/monitoring-tools/app',
        icon: CommandLineIcon },
      {name: 'Real-time Alerts',
        path: '/dashboard/monitoring-tools/alerts',
        icon: BellAlertIcon },
      {name: 'Historical Data',
        path: '/dashboard/monitoring-tools/history',
        icon: DocumentTextIcon }
    ]
  },
  {name: 'Dev Tools',
    icon: CommandLineIcon,
    path: '/dashboard/dev-tools',
    subItems: [
      {
        name: 'API Explorer',
        path: '/dashboard/dev-tools/api',
        icon: LinkIcon },
      {name: 'Database Console',
        path: '/dashboard/dev-tools/db',
        icon: ServerIcon },
      {name: 'Code Editor',
        path: '/dashboard/dev-tools/code',
        icon: CommandLineIcon },
      {name: 'Version Control',
        path: '/dashboard/dev-tools/vc',
        icon: CommandLineIcon },
      {name: 'CI/CD Pipelines',
        path: '/dashboard/dev-tools/cicd',
        icon: ArrowsRightLeftIcon },
      {name: 'Container Management',
        path: '/dashboard/dev-tools/containers',
        icon: CubeIcon },
      {name: 'Infrastructure as Code',
        path: '/dashboard/dev-tools/iac',
        icon: CommandLineIcon },
      {name: 'Monitoring',
        path: '/dashboard/dev-tools/monitoring',
        icon: PresentationChartBarIcon },
      {name: 'Logging',
        path: '/dashboard/dev-tools/logging',
        icon: DocumentTextIcon },
      {name: 'Security',
        path: '/dashboard/dev-tools/security',
        icon: ShieldCheckIcon }
    ]
  },
  {name: 'User Tools',
    icon: UserCircleIcon,
    path: '/dashboard/user-tools',
    subItems: [
      {
        name: 'Profile Management',
        path: '/dashboard/user-tools/profile',
        icon: UserCircleIcon },
      {name: 'Settings',
        path: '/dashboard/user-tools/settings',
        icon: Cog6ToothIcon },
      {name: 'Notifications',
        path: '/dashboard/user-tools/notifications',
        icon: BellAlertIcon },
      {name: 'Security',
        path: '/dashboard/user-tools/security',
        icon: ShieldCheckIcon },
      {name: 'Billing',
        path: '/dashboard/user-tools/billing',
        icon: BanknotesIcon },
      {name: 'Support',
        path: '/dashboard/user-tools/support',
        icon: LifebuoyIcon },
      {name: 'Help Center',
        path: '/dashboard/user-tools/help',
        icon: QuestionMarkCircleIcon }, // Using QuestionMarkCircleIcon instead of InformationCircleIcon
      {name: 'Feedback',
        path: '/dashboard/user-tools/feedback',
        icon: ChatBubbleLeftRightIcon },
      {name: 'Privacy',
        path: '/dashboard/user-tools/privacy',
        icon: LockClosedIcon },
      {name: 'Terms of Service',
        path: '/dashboard/user-tools/terms',
        icon: DocumentTextIcon }
    ]
  }
];

export const FAQ_DATA = [
  {question: 'How do I reset my password?',
    answer:
      'You can reset your password by going to Settings > Security > Change Password. Alternatively, on the login screen, click \'Forgot Password\' and follow the instructions sent to your email.'
  },
  {question: 'How do I update my payment method?',
    answer:
      'Navigate to Settings > Billing > Payment Methods. You can add, remove, or set a default payment method from this screen.'
  },
  {question: 'Can I cancel my subscription?',
    answer:
      'Yes, you can cancel your subscription at any time. Go to Settings > Billing > Subscription and click \'Cancel Subscription\'. Your subscription will remain active until the end of the current billing period.'
  },
  {question: 'How do I contact customer support?',
    answer:
      'You can reach our support team by submitting a ticket through this page, or by emailing support@fingerprotocol.com. Our team typically responds within 24 hours.'
  },
  {question: 'What are Gems and how do I earn them?',
    answer:
      'Gems are our platform\'s virtual currency. You can earn them by creating content, engaging with others, and participating in special events. They can be used to unlock premium features and exclusive content.'
  }
];

export const NORSE_GOD_GIFT_CARDS = [
  {name: 'Odin',
    color: 'from-blue-600 to-purple-700',
    icon: '👑',
    benefits: [
      'Premium profile badge',
      'Exclusive content access',
      'Priority support'
    ]
  },
  {name: 'Thor',
    color: 'from-red-500 to-orange-500',
    icon: '⚡',
    benefits: [
      'Enhanced audio quality',
      'Extended streaming time',
      'Special effects'
    ]
  },
  {name: 'Loki',
    color: 'from-green-500 to-teal-500',
    icon: '🎭',
    benefits: ['Stealth mode', 'Mystery gifts', 'Trickster abilities']
  },
  {name: 'Freya',
    color: 'from-pink-500 to-rose-500',
    icon: '💖',
    benefits: ['Love matching', 'Heartfelt connections', 'Beauty enhancements']
  },
  {name: 'Heimdall',
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
  {id: 'lux-1',
    name: 'Luxury Hotels',
    description:
      'Five-star accommodations with premium amenities and concierge service.',
    icon: '🏨',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'
  },
  {id: 'lux-2',
    name: 'Private Jets',
    description:
      'Exclusive private air travel with personalized flight experiences.',
    icon: '✈️',
    image:
      'https://images.unsplash.com/photo-1516466723877-1d3d66f3a8d7?w=1200&q=80&auto=format&fit=crop',
    type: 'Transport'
  },
  {id: 'lux-3',
    name: 'Yachts & Cruises',
    description: 'Premium yacht charters and luxury cruise experiences.',
    icon: '🛥️',
    image:
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&q=80&auto=format&fit=crop',
    type: 'Leisure'
  },
  {id: 'lux-4',
    name: 'Exclusive Events',
    description: 'VIP access to concerts, galas, and high-end social events.',
    icon: '🎟️',
    image:
      'https://images.unsplash.com/photo-1515165562835-c4c73a044ffd?w=1200&q=80&auto=format&fit=crop',
    type: 'Events'
  }
];

export const MEMBER_STORE_PRODUCTS: Product[] = [];

export const PROGRAMS_DATA: any[] = [  // Changed from Program[] to any[] since Program type doesn't exist
  {id: 'program-1',
    title: 'Featured Program 1',
    description: 'Our top recommended program',
    thumbnailUrl: '',
    category: 'featured',
    isLive: true,
    price: 0,
    duration: 'N/A',
    instructor: 'N/A',
    level: 'Beginner',
    rating: 0,
    totalRatings: 0,
    tags: [],
    curriculum: [],
    prerequisites: [],
    outcomes: []
  }
];

// Export navigation sections
export * from './navigation';

// Export advertisements
export * from './advertisements';

// Export trends
export * from './trends';

// Export suggested members
export * from './suggestedMembers';

// Export topics
export * from './topics';

// Export hashtags
export * from './hashtags';

// Export loyalty tiers
export * from './loyalty';

// Export events
export * from './events';

// Adding missing exports for the errors
export const CURATED_PRODUCTS: Product[] = [
  {id: 'curated-1',
    name: 'Featured Product 1',
    description: 'Our top recommended product',
    price: 29.99,
    currency: 'USD',
    imageUrl: '/images/featured-product-1.jpg', // Added missing property
    images: [],
    category: 'featured',
    stock: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {id: 'curated-2',
    name: 'Featured Product 2',
    description: 'Another great product',
    price: 49.99,
    currency: 'USD',
    imageUrl: '/images/featured-product-2.jpg', // Added missing property
    images: [],
    category: 'featured',
    stock: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const PUBLISHED_PAGES = [];

// FingerWars Leaderboard Data (placeholder)
export const FINGERWARS_LEADERBOARD = [
  { rank: 1, username: 'Player1', score: 1000, wins: 50 },
  { rank: 2, username: 'Player2', score: 950, wins: 45 },
  { rank: 3, username: 'Player3', score: 900, wins: 40 }
];

// Export dashboard constants
export * from './dashboardConstants';

// Export Camus constants
export * from './camusConstants';

