import {
  MemberIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  LightBulbIcon,
  VideoCameraIcon,
  MembersIcon as MembersGroupIcon,
  BellIcon
} from "../../components/icons.tsx";
// Create aliases for missing icons using available ones
const HomeIcon = MemberIcon;
const BuildingOfficeIcon = MemberIcon;
const CpuChipIcon = MemberIcon;
const ShieldCheckIcon = MemberIcon;
const MegaphoneIcon = MemberIcon;
const PresentationChartLineIcon = ChartBarIcon;
const AdjustmentsHorizontalIcon = MemberIcon;
const FingerPrintIcon = MemberIcon;
const CreditCardIcon = CurrencyDollarIcon;
const GiftIcon = MemberIcon;
const MemberGroupIcon = MembersGroupIcon;
const ShieldExclamationIcon = ShieldCheckIcon;
const CogIcon = AdjustmentsHorizontalIcon;
export const DASHBOARD_SECTIONS = [
  {name: "Overview",
  href: "/dashboard",
  icon: HomeIcon
  },
  {name: "Community Management",
  href: "#",
  icon: MemberGroupIcon,
  children: [
      {
  name: "Member Management",
  href: "/dashboard/community/members",
  icon: MemberIcon
      },
      {name: "Groups & Forums",
  href: "/dashboard/community/groups",
  icon: MembersGroupIcon
      },
      {name: "Content Moderation",
  href: "/dashboard/community/moderation",
  icon: ShieldExclamationIcon
      },
      {name: "Reports & Analytics",
  href: "/dashboard/community/analytics",
  icon: ChartBarIcon
      }
    ]
  },
  {name: "Business Operations",
  href: "#",
  icon: ChartBarIcon,
  children: [
      {
  name: "Marketplace",
  href: "/dashboard/business/marketplace",
  icon: CurrencyDollarIcon
      },
      {name: "FingerLux Services",
  href: "/dashboard/business/fingerlux",
  icon: LightBulbIcon
      },
      {name: "FingerStream Media",
  href: "/dashboard/business/fingerstream",
  icon: VideoCameraIcon
      },
      {name: "FingerPay Finance",
  href: "/dashboard/business/fingerpay",
  icon: CurrencyDollarIcon
      },
      {name: "FingerLearn Education",
  href: "/dashboard/business/fingerlearn",
  icon: AcademicCapIcon
      },
      {name: "FingerGuard Security",
  href: "/dashboard/business/fingerguard",
  icon: ShieldCheckIcon
      },
      {name: "Store Management",
  href: "/dashboard/business/stores",
  icon: BuildingOfficeIcon
      }
    ]
  },
  {name: "AI & Automation",
  href: "#",
  icon: CpuChipIcon,
  children: [
      {
  name: "AI Content Studio",
  href: "/dashboard/ai/content",
  icon: LightBulbIcon
      },
      {name: "AI Voice Assistant",
  href: "/dashboard/ai/voice",
  icon: ChatBubbleLeftRightIcon
      },
      {name: "AI Analytics Engine",
  href: "/dashboard/ai/analytics",
  icon: ChartBarIcon
      },
      {name: "Automated Workflows",
  href: "/dashboard/ai/workflows",
  icon: CogIcon
      }
    ]
  },
  {name: "Marketing Hub",
  href: "#",
  icon: MegaphoneIcon,
  children: [
      {
  name: "Campaign Manager",
  href: "/dashboard/marketing/campaigns",
  icon: MegaphoneIcon
      },
      {name: "Social Media Tools",
  href: "/dashboard/marketing/social",
  icon: MemberGroupIcon
      },
      {name: "Email Marketing",
  href: "/dashboard/marketing/email",
  icon: ChatBubbleLeftRightIcon
      },
      {name: "SEO Optimization",
  href: "/dashboard/marketing/seo",
  icon: PresentationChartLineIcon
      }
    ]
  },
  {name: "Analytics & Reports",
  href: "#",
  icon: ChartBarIcon,
  children: [
      {
  name: "Dashboard Overview",
  href: "/dashboard/analytics/overview",
  icon: ChartBarIcon
      },
      {name: "Member Analytics",
  href: "/dashboard/analytics/members",
  icon: MemberGroupIcon
      },
      {name: "Content Performance",
  href: "/dashboard/analytics/content",
  icon: VideoCameraIcon
      },
      {name: "Revenue Reports",
  href: "/dashboard/analytics/revenue",
  icon: CurrencyDollarIcon
      },
      {name: "UGC Analytics",
  href: "/dashboard/analytics/ugc",
  icon: MemberIcon
      }
    ]
  },
  {name: "System Settings",
  href: "#",
  icon: CogIcon,
  children: [
      {
  name: "General Settings",
  href: "/dashboard/settings/general",
  icon: CogIcon
      },
      {name: "Member Roles",
  href: "/dashboard/settings/roles",
  icon: MemberIcon
      },
      {name: "Security Controls",
  href: "/dashboard/settings/security",
  icon: FingerPrintIcon
      },
      {name: "API Management",
  href: "/dashboard/settings/api",
  icon: CpuChipIcon
      },
      {name: "Billing & Plans",
  href: "/dashboard/settings/billing",
  icon: CreditCardIcon
      },
      {name: "Notifications",
  href: "/dashboard/settings/notifications",
  icon: BellIcon
      }
    ]
  },
  {name: "Loyalty & Rewards",
  href: "#",
  icon: GiftIcon,
  children: [
      {
  name: "Program Management",
  href: "/dashboard/loyalty/programs",
  icon: GiftIcon
      },
      {name: "Reward Catalog",
  href: "/dashboard/loyalty/rewards",
  icon: GiftIcon
      },
      {name: "Member Points",
  href: "/dashboard/loyalty/points",
  icon: AdjustmentsHorizontalIcon
      }
    ]
  },
  {name: "Franchise Management",
  href: "/dashboard/franchise",
  icon: BuildingOfficeIcon,
  badge: "New"
  },
  {name: "Security Center",
  href: "#",
  icon: ShieldCheckIcon,
  children: [
      {
  name: "Guardian Protocol",
  href: "/dashboard/security/guardian",
  icon: ShieldCheckIcon
      },
      {name: "Audit Logs",
  href: "/dashboard/security/audit",
  icon: ChartBarIcon
      },
      {name: "Data Privacy",
  href: "/dashboard/security/privacy",
  icon: FingerPrintIcon
      }
    ]
  },
  {name: "Monetization",
  href: "#",
  icon: CurrencyDollarIcon,
  children: [
      {
  name: "Revenue Analytics",
  href: "/dashboard/monetization/analytics",
  icon: ChartBarIcon
      },
      {name: "Subscription Plans",
  href: "/dashboard/monetization/subscriptions",
  icon: CreditCardIcon
      }
    ]
  }
];
