import * as React from 'react';
import { 
  Users, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Shield, 
  FileText, 
  ShoppingCart, 
  DollarSign 
} from 'lucide-react';
import { MembersIcon, LightBulbIcon, VideoCameraIcon } from '@/icons';

// Define the sections for the dashboard
export const dashboardSections = [
  {id: 'analytics',
  title: 'Analytics',
  icon: BarChart3,
  description: 'Track platform performance and user engagement metrics',
  route: '/dashboard/analytics'
  },
  {id: 'moderation',
  title: 'Content Moderation',
  icon: Shield,
  description: 'Monitor and manage user-generated content',
  route: '/dashboard/moderation'
  },
  {id: 'members',
  title: 'Member Management',
  icon: Users,
  description: 'Manage platform members and their accounts',
  route: '/dashboard/members'
  },
  {id: 'content',
  title: 'Content Management',
  icon: FileText,
  description: 'Manage platform content and publications',
  route: '/dashboard/content'
  },
  {id: 'commerce',
  title: 'E-commerce',
  icon: ShoppingCart,
  description: 'Manage products, orders, and payments',
  route: '/dashboard/commerce'
  },
  {id: 'community',
  title: 'Community',
  icon: MessageSquare,
  description: 'Manage groups, forums, and interactions',
  route: '/dashboard/community'
  },
  {id: 'settings',
  title: 'Platform Settings',
  icon: Settings,
  description: 'Configure platform settings and preferences',
  route: '/dashboard/settings'
  },
  {id: 'monetization',
  title: 'Monetization',
  icon: DollarSign,
  description: 'Manage revenue streams and monetization tools',
  route: '/dashboard/monetization'
  },
  {id: 'innovation',
  title: 'Innovation Hub',
  icon: LightBulbIcon, // Using custom icon,
  description: 'Explore new features and innovation opportunities',
  route: '/dashboard/innovation'
  },
  {id: 'live-streaming',
  title: 'Live Streaming',
  icon: VideoCameraIcon, // Using custom icon,
  description: 'Manage live streaming and broadcast features',
  route: '/dashboard/live-streaming'
  },
  {id: 'membership',
  title: 'Membership',
  icon: MembersIcon,
  description: 'Manage membership plans and subscriptions',
  route: '/dashboard/membership'
  }
];