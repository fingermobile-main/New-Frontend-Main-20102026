import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  FileText, 
  ShoppingCart, 
  Activity, 
  TrendingUp, 
  Search, 
  Bell, 
  Mail, 
  User, 
  Grid3X3, 
  UsersRound, 
  Store, 
  Building2, 
  Network, 
  Key, 
  Radio, 
  Camera, 
  Gamepad2, 
  Tv, 
  Award, 
  Gem, 
  Sparkles, 
  Palette, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  X, 
  Brain, 
  Compass, 
  Feather, 
  Image, 
  Music, 
  Video, 
  UserRound, 
  Megaphone, 
  Bot, 
  Copy, 
  FileInput, 
  Users2,
  Users,
  Shield,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardService } from '../services/dashboardService';
import ForumsManagement from '../components/dashboard/ForumsManagement';
import ConnectorArtifactConsole from '../components/dashboard/ConnectorArtifactConsole';
import { 
  SystemMetric, 
  MemberActivity, 
  SystemAlert, 
  SecurityEvent, 
  UGCMetric, 
  ContentPerformance, 
  AudienceDemographic 
} from '../types/dashboard';

interface Section {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'online' | 'offline' | 'maintenance' | 'warning';
  lastUpdated: string;
  responseTime: number;
  healthScore: number;
  route: string; // Added route property for navigation
}

interface SystemComponent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance' | 'warning';
  healthScore: number;
  responseTime: number;
  lastUpdated: string;
}

const MasterDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sections, setSections] = useState<Section[]>([]);
  const [systemComponents, setSystemComponents] = useState<SystemComponent[]>([]);
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [activities, setActivities] = useState<MemberActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  
  const navigate = useNavigate();

  const dashboardService = new DashboardService();

  // Initialize sections representing different dashboard areas with routes
  const initializeSections = () => {
    const sectionsData: Section[] = [
      // Community Management
      {
        id: 'forum',
        title: 'Forum',
        description: 'Manage community discussions and interactions',
        icon: MessageSquare,
        status: 'online',
        lastUpdated: '2024-10-09T10:30:00Z',
        responseTime: 45,
        healthScore: 98,
        route: '/dashboard/forum'
      },
      {
        id: 'gems',
        title: 'Gems',
        description: 'Curated premium content and highlights',
        icon: Gem,
        status: 'online',
        lastUpdated: '2024-10-09T09:15:00Z',
        responseTime: 38,
        healthScore: 99,
        route: '/dashboard/gems'
      },
      {
        id: 'hallmarks',
        title: 'Hallmarks',
        description: 'Featured content and achievements',
        icon: Award,
        status: 'online',
        lastUpdated: '2024-10-08T16:45:00Z',
        responseTime: 52,
        healthScore: 95,
        route: '/dashboard/hallmarks'
      },
      {
        id: 'groups',
        title: 'Groups',
        description: 'Manage community groups and sub-communities',
        icon: UsersRound,
        status: 'online',
        lastUpdated: '2024-10-08T14:20:00Z',
        responseTime: 67,
        healthScore: 92,
        route: '/dashboard/groups'
      },
      {
        id: 'blogs',
        title: 'Blogs',
        description: 'Manage blog posts and articles',
        icon: FileText,
        status: 'online',
        lastUpdated: '2024-10-07T11:30:00Z',
        responseTime: 0,
        healthScore: 100,
        route: '/dashboard/blogs'
      },
      {
        id: 'mi',
        title: 'Mi (Media Intelligence)',
        description: 'AI-powered media analysis and insights',
        icon: Brain,
        status: 'online',
        lastUpdated: '2024-10-08T10:15:00Z',
        responseTime: 41,
        healthScore: 96,
        route: '/dashboard/mi'
      },
      {
        id: 'trends',
        title: 'Trends',
        description: 'Monitor and manage trending topics',
        icon: TrendingUp,
        status: 'online',
        lastUpdated: '2024-10-08T09:45:00Z',
        responseTime: 58,
        healthScore: 94,
        route: '/dashboard/trends'
      },
      
      // Entertainment & Media
      {
        id: 'fingerlux',
        title: 'FingerLux',
        description: 'Entertainment and video content platform',
        icon: Tv,
        status: 'online',
        lastUpdated: '2024-10-08T08:30:00Z',
        responseTime: 72,
        healthScore: 89,
        route: '/dashboard/fingerlux'
      },
      {
        id: 'fingerwars',
        title: 'FingerWars',
        description: 'Competitive gaming and esports platform',
        icon: Gamepad2,
        status: 'online',
        lastUpdated: '2024-10-07T15:20:00Z',
        responseTime: 89,
        healthScore: 78,
        route: '/dashboard/fingerwars'
      },
      {
        id: 'publicitee',
        title: 'Publicitee',
        description: 'Advertising and promotional platform',
        icon: Radio,
        status: 'online',
        lastUpdated: '2024-10-08T12:10:00Z',
        responseTime: 63,
        healthScore: 91,
        route: '/dashboard/publicitee'
      },
      {
        id: 'discovery',
        title: 'Discovery',
        description: 'Content discovery and recommendation engine',
        icon: Compass,
        status: 'online',
        lastUpdated: '2024-10-08T13:45:00Z',
        responseTime: 49,
        healthScore: 97,
        route: '/dashboard/discovery'
      },
      
      // Marketplace & Commerce
      {
        id: 'marketplace',
        title: 'Marketplace',
        description: 'Multi-vendor marketplace platform',
        icon: Store,
        status: 'online',
        lastUpdated: '2024-10-08T17:30:00Z',
        responseTime: 35,
        healthScore: 99,
        route: '/dashboard/marketplace'
      },
      {
        id: 'storefronts',
        title: 'Storefronts',
        description: 'Individual vendor storefronts',
        icon: Building2,
        status: 'online',
        lastUpdated: '2024-10-09T10:30:00Z',
        responseTime: 45,
        healthScore: 98,
        route: '/dashboard/storefronts'
      },
      {
        id: 'flamingo',
        title: 'Flamingo',
        description: 'Premium marketplace features',
        icon: Feather,
        status: 'online',
        lastUpdated: '2024-10-09T09:15:00Z',
        responseTime: 38,
        healthScore: 99,
        route: '/dashboard/flamingo'
      },
      {
        id: 'ownit',
        title: 'OwnIt',
        description: 'User-owned content and assets',
        icon: Key,
        status: 'online',
        lastUpdated: '2024-10-08T16:45:00Z',
        responseTime: 52,
        healthScore: 95,
        route: '/dashboard/ownit'
      },
      
      // Media & Content
      {
        id: 'photocredits',
        title: 'PhotoCredits',
        description: 'Photo licensing and credits system',
        icon: Camera,
        status: 'online',
        lastUpdated: '2024-10-08T14:20:00Z',
        responseTime: 67,
        healthScore: 92,
        route: '/dashboard/photocredits'
      },
      {
        id: 'gallery',
        title: 'Gallery',
        description: 'Media gallery and portfolio management',
        icon: Image,
        status: 'online',
        lastUpdated: '2024-10-07T11:30:00Z',
        responseTime: 0,
        healthScore: 100,
        route: '/dashboard/gallery'
      },
      {
        id: 'beatwaven',
        title: 'BeatwaveNG',
        description: 'Music and audio content platform',
        icon: Music,
        status: 'online',
        lastUpdated: '2024-10-08T10:15:00Z',
        responseTime: 41,
        healthScore: 96,
        route: '/dashboard/beatwaven'
      },
      {
        id: 'dancia4tv',
        title: 'Dancia-4Tv',
        description: 'Video streaming and broadcasting',
        icon: Video,
        status: 'online',
        lastUpdated: '2024-10-08T09:45:00Z',
        responseTime: 58,
        healthScore: 94,
        route: '/dashboard/dancia4tv'
      },
      
      // Member Management
      {
        id: 'member-pages',
        title: 'Member Pages',
        description: 'Individual member profile management',
        icon: User,
        status: 'online',
        lastUpdated: '2024-10-08T08:30:00Z',
        responseTime: 72,
        healthScore: 89,
        route: '/dashboard/member-pages'
      },
      {
        id: 'contacts',
        title: 'Contacts',
        description: 'Member contact and communication management',
        icon: Mail,
        status: 'online',
        lastUpdated: '2024-10-07T15:20:00Z',
        responseTime: 89,
        healthScore: 78,
        route: '/dashboard/contacts'
      },
      {
        id: 'members',
        title: 'Members',
        description: 'Comprehensive member management',
        icon: Users,
        status: 'online',
        lastUpdated: '2024-10-08T12:10:00Z',
        responseTime: 63,
        healthScore: 91,
        route: '/dashboard/members'
      },
      {
        id: 'profiles',
        title: 'Profiles',
        description: 'Member profile customization and management',
        icon: UserRound,
        status: 'online',
        lastUpdated: '2024-10-08T13:45:00Z',
        responseTime: 49,
        healthScore: 97,
        route: '/dashboard/profiles'
      },
      
      // Site Management
      {
        id: 'site-editor',
        title: 'Site Editor',
        description: 'Full mobile site editor',
        icon: Palette,
        status: 'online',
        lastUpdated: '2024-10-08T17:30:00Z',
        responseTime: 35,
        healthScore: 99,
        route: '/dashboard/site-editor'
      },
      {
        id: 'animations',
        title: 'Animations',
        description: 'Entrance animations and effects',
        icon: Sparkles,
        status: 'online',
        lastUpdated: '2024-10-09T10:30:00Z',
        responseTime: 45,
        healthScore: 98,
        route: '/dashboard/animations'
      },
      {
        id: 'image-tools',
        title: 'Image Tools',
        description: 'Image cropping, filters, and enhancement',
        icon: Image,
        status: 'online',
        lastUpdated: '2024-10-09T09:15:00Z',
        responseTime: 38,
        healthScore: 99,
        route: '/dashboard/image-tools'
      },
      {
        id: 'videobox',
        title: 'VideoBox',
        description: 'Video showcase and management',
        icon: Video,
        status: 'online',
        lastUpdated: '2024-10-08T16:45:00Z',
        responseTime: 52,
        healthScore: 95,
        route: '/dashboard/videobox'
      },
      
      // Business Management
      {
        id: 'ecommerce',
        title: 'E-commerce',
        description: 'Online store with payments and shipping',
        icon: ShoppingCart,
        status: 'online',
        lastUpdated: '2024-10-08T14:20:00Z',
        responseTime: 67,
        healthScore: 92,
        route: '/dashboard/ecommerce'
      },
      {
        id: 'marketing',
        title: 'Marketing',
        description: 'Marketing campaigns and promotions',
        icon: Megaphone,
        status: 'online',
        lastUpdated: '2024-10-07T11:30:00Z',
        responseTime: 0,
        healthScore: 100,
        route: '/dashboard/marketing'
      },
      {
        id: 'analytics',
        title: 'Analytics',
        description: 'Performance reports and insights',
        icon: BarChart3,
        status: 'online',
        lastUpdated: '2024-10-08T10:15:00Z',
        responseTime: 41,
        healthScore: 96,
        route: '/dashboard/analytics'
      },
      {
        id: 'seo',
        title: 'SEO',
        description: 'Search engine optimization tools',
        icon: Search,
        status: 'online',
        lastUpdated: '2024-10-08T09:45:00Z',
        responseTime: 58,
        healthScore: 94,
        route: '/dashboard/seo'
      },
      
      // Advanced Features
      {
        id: 'ai-tools',
        title: 'AI Tools',
        description: 'AI-powered features and automation',
        icon: Bot,
        status: 'online',
        lastUpdated: '2024-10-08T08:30:00Z',
        responseTime: 72,
        healthScore: 89,
        route: '/dashboard/ai-tools'
      },
      {
        id: 'templates',
        title: 'Templates',
        description: 'Website templates and designs',
        icon: Copy,
        status: 'online',
        lastUpdated: '2024-10-07T15:20:00Z',
        responseTime: 89,
        healthScore: 78,
        route: '/dashboard/templates'
      },
      {
        id: 'forms',
        title: 'Forms',
        description: 'Custom forms and data collection',
        icon: FileInput,
        status: 'online',
        lastUpdated: '2024-10-08T12:10:00Z',
        responseTime: 63,
        healthScore: 91,
        route: '/dashboard/forms'
      },
      {
        id: 'collaboration',
        title: 'Collaboration',
        description: 'Team collaboration and permissions',
        icon: Users2,
        status: 'online',
        lastUpdated: '2024-10-08T13:45:00Z',
        responseTime: 49,
        healthScore: 97,
        route: '/dashboard/collaboration'
      }
    ];
    
    setSections(sectionsData);
  };

  // Initialize system components
  const initializeSystemComponents = () => {
    const components: SystemComponent[] = [
      { id: 'auth', name: 'Authentication Service', status: 'online', healthScore: 98, responseTime: 45, lastUpdated: '2024-10-09T10:30:00Z' },
      { id: 'payments', name: 'Payment Gateway', status: 'online', healthScore: 95, responseTime: 120, lastUpdated: '2024-10-09T09:45:00Z' },
      { id: 'storage', name: 'Cloud Storage', status: 'online', healthScore: 99, responseTime: 65, lastUpdated: '2024-10-09T09:15:00Z' },
      { id: 'cdn', name: 'Content Delivery Network', status: 'online', healthScore: 97, responseTime: 32, lastUpdated: '2024-10-09T08:30:00Z' },
      { id: 'db', name: 'Database Cluster', status: 'online', healthScore: 96, responseTime: 58, lastUpdated: '2024-10-09T08:00:00Z' },
      { id: 'cache', name: 'Redis Cache', status: 'online', healthScore: 100, responseTime: 12, lastUpdated: '2024-10-09T07:45:00Z' },
      { id: 'email', name: 'Email Service', status: 'online', healthScore: 94, responseTime: 89, lastUpdated: '2024-10-09T07:30:00Z' },
      { id: 'notification', name: 'Notification Service', status: 'online', healthScore: 92, responseTime: 75, lastUpdated: '2024-10-09T07:15:00Z' },
      { id: 'ai', name: 'AI Processing Engine', status: 'online', healthScore: 97, responseTime: 156, lastUpdated: '2024-10-09T07:00:00Z' },
      { id: 'security', name: 'Security Firewall', status: 'online', healthScore: 100, responseTime: 8, lastUpdated: '2024-10-09T06:45:00Z' },
      { id: 'backup', name: 'Backup Service', status: 'online', healthScore: 99, responseTime: 245, lastUpdated: '2024-10-09T06:30:00Z' },
      { id: 'monitoring', name: 'System Monitoring', status: 'online', healthScore: 98, responseTime: 22, lastUpdated: '2024-10-09T06:15:00Z' }
    ];
    
    setSystemComponents(components);
  };

  // Fetch data from the dashboard service
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch metrics
      const metricsData = await dashboardService.getAdminDashboardData(timeRange);
      setMetrics(metricsData);
      
      // Fetch alerts
      const alertsData = await dashboardService.getSystemAlerts(timeRange);
      setAlerts(alertsData);
      
      // Fetch activities
      const activitiesData = await dashboardService.getMemberActivities(timeRange);
      setActivities(activitiesData);
      
      // Initialize static data
      initializeSections();
      initializeSystemComponents();
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  // Handler for navigating to a section
  const handleSectionClick = (route: string) => {
    navigate(route);
  };

  // Group sections by category
  const getSectionCategories = () => {
    const categories: {[key: string]: Section[]} = {};
    
    sections.forEach(section => {
      let category = 'Other';
      if (['forum', 'gems', 'hallmarks', 'groups', 'blogs', 'mi', 'trends'].includes(section.id)) {
        category = 'Community Management';
      } else if (['fingerlux', 'fingerwars', 'publicitee', 'discovery'].includes(section.id)) {
        category = 'Entertainment & Media';
      } else if (['marketplace', 'storefronts', 'flamingo', 'ownit'].includes(section.id)) {
        category = 'Marketplace & Commerce';
      } else if (['photocredits', 'gallery', 'beatwaven', 'dancia4tv'].includes(section.id)) {
        category = 'Media & Content';
      } else if (['member-pages', 'contacts', 'members', 'profiles'].includes(section.id)) {
        category = 'Member Management';
      } else if (['site-editor', 'animations', 'image-tools', 'videobox'].includes(section.id)) {
        category = 'Site Management';
      } else if (['ecommerce', 'marketing', 'analytics', 'seo'].includes(section.id)) {
        category = 'Business Management';
      } else if (['ai-tools', 'templates', 'forms', 'collaboration'].includes(section.id)) {
        category = 'Advanced Features';
      }
      
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(section);
    });
    
    return categories;
  };

  const renderOverviewContent = () => (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {['24h', '7d', '30d', '90d'].map(range => (
            <button
              key={range}
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === range
                  ? 'z-10 bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              } border`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{metric.name}</p>
                <p className="text-2xl font-bold mt-1">{metric.value}</p>
                <p className={`text-sm mt-1 ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}% from last period
                </p>
              </div>
              <div className={`${metric.color} p-3 rounded-lg`}>
                {React.createElement(Activity, { className: "h-6 w-6 text-white" })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard Sections Grid */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Platform Sections</h3>
          <button 
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            onClick={() => navigate('/dashboard')} // Navigate to main dashboard
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sections.map(section => (
            <div 
              key={section.id} 
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300 hover:bg-blue-50"
              onClick={() => handleSectionClick(section.route)}
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${
                  section.status === 'online' ? 'bg-green-100' :
                  section.status === 'offline' ? 'bg-red-100' :
                  section.status === 'maintenance' ? 'bg-yellow-100' :
                  'bg-orange-100'
                }`}>
                  {React.createElement(section.icon, { 
                    className: `h-5 w-5 ${
                      section.status === 'online' ? 'text-green-500' :
                      section.status === 'offline' ? 'text-red-500' :
                      section.status === 'maintenance' ? 'text-yellow-500' :
                      'text-orange-500'
                    }` 
                  })}
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-sm">{section.title}</h4>
                  <p className="text-xs text-gray-500 truncate">{section.description}</p>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  section.status === 'online' ? 'bg-green-100 text-green-800' :
                  section.status === 'offline' ? 'bg-red-100 text-red-800' :
                  section.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {section.status}
                </span>
                <span className="text-xs text-gray-500">{section.healthScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Components and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Components */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">System Components</h3>
          <div className="space-y-3">
            {systemComponents.map(component => (
              <div key={component.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{component.name}</p>
                  <p className="text-xs text-gray-500">Response: {component.responseTime}ms</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    component.status === 'online' ? 'bg-green-100 text-green-800' :
                    component.status === 'offline' ? 'bg-red-100 text-red-800' :
                    component.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {component.status}
                  </span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        component.healthScore >= 90 ? 'bg-green-500' :
                        component.healthScore >= 70 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} 
                      style={{ width: `${component.healthScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">System Alerts</h3>
          <div className="space-y-4">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                <div className={`p-2 rounded-full ${
                  alert.severity === 'critical' ? 'bg-red-100' :
                  alert.severity === 'high' ? 'bg-orange-100' :
                  alert.severity === 'medium' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  {alert.severity === 'critical' ? <AlertTriangle className="h-4 w-4 text-red-500" /> :
                   alert.severity === 'high' ? <AlertCircle className="h-4 w-4 text-orange-500" /> :
                   alert.severity === 'medium' ? <AlertCircle className="h-4 w-4 text-yellow-500" /> :
                   <Info className="h-4 w-4 text-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-sm text-gray-500">{alert.description}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-400">
                    <span>{alert.timestamp}</span>
                    <span className="mx-2">•</span>
                    <span className={`${
                      alert.severity === 'critical' ? 'text-red-500' :
                      alert.severity === 'high' ? 'text-orange-500' :
                      alert.severity === 'medium' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activities.map(activity => (
                <tr key={activity.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.member}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSectionManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Section Management</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Add New Section
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Section
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Health Score
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Response Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sections.map(section => (
              <tr key={section.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${
                      section.status === 'online' ? 'bg-green-100' :
                      section.status === 'offline' ? 'bg-red-100' :
                      section.status === 'maintenance' ? 'bg-yellow-100' :
                      'bg-orange-100'
                    }`}>
                      {React.createElement(section.icon, { 
                        className: `h-5 w-5 ${
                          section.status === 'online' ? 'text-green-500' :
                          section.status === 'offline' ? 'text-red-500' :
                          section.status === 'maintenance' ? 'text-yellow-500' :
                          'text-orange-500'
                        }` 
                      })}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{section.title}</div>
                      <div className="text-sm text-gray-500">{section.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    section.status === 'online' ? 'bg-green-100 text-green-800' :
                    section.status === 'offline' ? 'bg-red-100 text-red-800' :
                    section.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {section.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${
                          section.healthScore >= 90 ? 'bg-green-500' :
                          section.healthScore >= 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${section.healthScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">{section.healthScore}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {section.responseTime > 0 ? `${section.responseTime}ms` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(section.lastUpdated).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => handleSectionClick(section.route)}
                  >
                    View
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Disable</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSystemMonitoring = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">System Monitoring</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Component Health</h3>
          <div className="space-y-4">
            {systemComponents.filter(c => c.status === 'online').slice(0, 3).map(component => (
              <div key={component.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{component.name}</span>
                  <span className="text-sm text-gray-500">{component.responseTime}ms</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (100 - component.responseTime/2))}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Status Distribution</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Online Components</span>
              <span className="text-sm font-medium text-green-600">{systemComponents.filter(c => c.status === 'online').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Maintenance</span>
              <span className="text-sm font-medium text-yellow-600">{systemComponents.filter(c => c.status === 'maintenance').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Offline</span>
              <span className="text-sm font-medium text-red-600">{systemComponents.filter(c => c.status === 'offline').length}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Overall Health</h3>
          <div className="h-40 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round(systemComponents.reduce((sum, comp) => sum + comp.healthScore, 0) / systemComponents.length)}%
              </div>
              <div className="text-sm text-gray-500 mt-1">Average Health Score</div>
              <div className="mt-3 w-32 h-32 mx-auto relative">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray={`${Math.round(systemComponents.reduce((sum, comp) => sum + comp.healthScore, 0) / systemComponents.length)}, 100`}
                  />
                  <text x="18" y="20.5" textAnchor="middle" fill="#10b981" fontSize="8" fontWeight="bold">
                    {Math.round(systemComponents.reduce((sum, comp) => sum + comp.healthScore, 0) / systemComponents.length)}%
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Component Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Score</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {systemComponents.map(component => (
                <tr key={component.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{component.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      component.status === 'online' ? 'bg-green-100 text-green-800' :
                      component.status === 'offline' ? 'bg-red-100 text-red-800' :
                      component.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {component.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            component.healthScore >= 90 ? 'bg-green-500' :
                            component.healthScore >= 70 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} 
                          style={{ width: `${component.healthScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{component.healthScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{component.responseTime}ms</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(component.lastUpdated).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAlertsAndActivities = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Alerts & Activities</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">System Alerts</h3>
            <button className="text-blue-500 hover:text-blue-700 text-sm">View all</button>
          </div>
          <div className="space-y-4">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                <div className={`p-2 rounded-full ${
                  alert.severity === 'critical' ? 'bg-red-100' :
                  alert.severity === 'high' ? 'bg-orange-100' :
                  alert.severity === 'medium' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  {alert.severity === 'critical' ? <AlertTriangle className="h-4 w-4 text-red-500" /> :
                   alert.severity === 'high' ? <AlertCircle className="h-4 w-4 text-orange-500" /> :
                   alert.severity === 'medium' ? <AlertCircle className="h-4 w-4 text-yellow-500" /> :
                   <Info className="h-4 w-4 text-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-sm text-gray-500">{alert.description}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-400">
                    <span>{alert.timestamp}</span>
                    <span className="mx-2">•</span>
                    <span className={`${
                      alert.severity === 'critical' ? 'text-red-500' :
                      alert.severity === 'high' ? 'text-orange-500' :
                      alert.severity === 'medium' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
            <button className="text-blue-500 hover:text-blue-700 text-sm">View all</button>
          </div>
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.member}</p>
                  <p className="text-sm text-gray-500">{activity.action}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-400">
                    <span>{activity.timestamp}</span>
                    <span className="mx-2">•</span>
                    <span>{activity.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Grid3X3 className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 ml-3">Master Dashboard</h1>
              <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Platform Management
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-universal-search'))}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition"
                title="Universal AI Search (Cmd+K)"
              >
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span>Search Screens & Dashboards</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-300 rounded shadow-2xs text-slate-500">⌘K</kbd>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Mail className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">M</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {['overview', 'modules', 'forums', 'connectors', 'monitoring', 'alerts'].map(tab => (
              <button
                key={tab}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Loading State */}
        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Category Tabs */}
                <div className="mb-6 border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {Object.keys(getSectionCategories()).map(category => (
                      <button
                        key={category}
                        onClick={() => setActiveTab(`category-${category}`)}
                        className={`${
                          activeTab === `category-${category}`
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                      >
                        {category}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Category Grid View */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Object.entries(getSectionCategories()).map(([category, categorySections]) => (
                    <div 
                      key={category} 
                      className={`col-span-1 ${
                        activeTab !== 'overview' && activeTab !== `category-${category}` ? 'hidden' : ''
                      }`}
                    >
                      <div className="bg-white rounded-xl shadow p-6 border border-gray-100 mb-6">
                        <h3 className="text-lg font-semibold mb-4">{category}</h3>
                        <div className="space-y-4">
                          {categorySections.map(section => (
                            <div 
                              key={section.id}
                              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => handleSectionClick(section.route)}
                            >
                              <div className="flex items-center">
                                <div className={`p-2 rounded-lg ${
                                  section.status === 'online' ? 'bg-green-100' :
                                  section.status === 'offline' ? 'bg-red-100' :
                                  section.status === 'maintenance' ? 'bg-yellow-100' :
                                  'bg-orange-100'
                                }`}>
                                  {React.createElement(section.icon, { 
                                    className: `h-5 w-5 ${
                                      section.status === 'online' ? 'text-green-500' :
                                      section.status === 'offline' ? 'text-red-500' :
                                      section.status === 'maintenance' ? 'text-yellow-500' :
                                      'text-orange-500'
                                    }` 
                                  })}
                                </div>
                                <div className="ml-3">
                                  <h4 className="font-medium text-sm">{section.title}</h4>
                                  <p className="text-xs text-gray-500 truncate">{section.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  section.status === 'online' ? 'bg-green-100 text-green-800' :
                                  section.status === 'offline' ? 'bg-red-100 text-red-800' :
                                  section.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-orange-100 text-orange-800'
                                }`}>
                                  {section.status}
                                </span>
                                <span className="ml-2 text-xs text-gray-500">{section.healthScore}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Modules Tab */}
            {activeTab === 'modules' && (
              <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-6">All Modules</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sections.map(section => (
                    <div 
                      key={section.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300 hover:bg-blue-50"
                      onClick={() => handleSectionClick(section.route)}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${
                          section.status === 'online' ? 'bg-green-100' :
                          section.status === 'offline' ? 'bg-red-100' :
                          section.status === 'maintenance' ? 'bg-yellow-100' :
                          'bg-orange-100'
                        }`}>
                          {React.createElement(section.icon, { 
                            className: `h-5 w-5 ${
                              section.status === 'online' ? 'text-green-500' :
                              section.status === 'offline' ? 'text-red-500' :
                              section.status === 'maintenance' ? 'text-yellow-500' :
                              'text-orange-500'
                            }` 
                          })}
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="font-medium text-sm">{section.title}</h4>
                          <p className="text-xs text-gray-500 truncate">{section.description}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            section.status === 'online' ? 'bg-green-100 text-green-800' :
                            section.status === 'offline' ? 'bg-red-100 text-red-800' :
                            section.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {section.status}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">{section.healthScore}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Forums Management */}
            {activeTab === 'forums' && (
              <div className="space-y-6">
                <ForumsManagement />
              </div>
            )}

            {/* Connectors & Ingestion Console */}
            {activeTab === 'connectors' && (
              <div className="space-y-6">
                <ConnectorArtifactConsole />
              </div>
            )}

            {/* System Monitoring */}
            {activeTab === 'monitoring' && renderSystemMonitoring()}

            {/* Alerts */}
            {activeTab === 'alerts' && renderAlertsAndActivities()}
          </>
        )}
      </main>
    </div>
  );
};

export default MasterDashboardPage;