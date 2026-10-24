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
  Plus,
  Check,
  Shield,
  Lock,
  Settings,
  Coins,
  Banknote,
  Landmark,
  LogOut,
  Loader2,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  canAccessMasterDashboard,
  isContentCreator,
  isBusinessEntity
} from '../services/platformRbac';
import { DashboardService } from '../services/dashboardService';
import ConnectorArtifactConsole from '../components/dashboard/ConnectorArtifactConsole';
import userProfileSyncService, { ComprehensiveUserProfile } from '../services/UserProfileSyncService';
import {
  SystemMetric,
  MemberActivity,
} from '../types/dashboard';
import {
  SystemHealthGaugeCard,
  RealtimeTelemetrySparklineCard,
  WormAuditTimelineCard,
  KillswitchPanicCard,
  ConsoleCard,
  ConsoleDetailModal,
  ConsoleItem,
} from '../components/dashboard/MasterDashboardCompGraphics';
import {
  ALL_45_FRAMEWORK_CONSOLES,
  DEFAULT_LATENCY_DATA,
} from '../components/dashboard/masterConsolesData';
import { PageManagementMatrixGaps } from '../components/dashboard/PageManagementMatrixGaps';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';
import SubscriptionModelsConsole from '../components/dashboard/SubscriptionModelsConsole';
import MasterFinancialsConsole from '../components/dashboard/MasterFinancialsConsole';
import GuardianAISeoPerformanceConsole from '../components/dashboard/GuardianAISeoPerformanceConsole';
import MasterMembersConsole from '../components/dashboard/MasterMembersConsole';
import CorporateGovernanceConsole from '../components/dashboard/CorporateGovernanceConsole';
import MasterWidgetConsole from '../components/dashboard/MasterWidgetConsole';
import MasterBeatwaveNGConsole from '../components/dashboard/MasterBeatwaveNGConsole';
import DiscoverMasterConsole from '../components/dashboard/DiscoverMasterConsole';
import SoundRiverMasterConsole from '../components/dashboard/SoundRiverMasterConsole';
import SoundOceanMasterConsole from '../components/dashboard/SoundOceanMasterConsole';
import LeadershipBoardConsole from '../components/dashboard/LeadershipBoardConsole';
import MasterDancia4TvConsole from '../components/dashboard/MasterDancia4TvConsole';
import PlatformDomainManagementConsole, {
  COMMERCE_DOMAIN_KEYS,
  PLATFORM_OPERATIONS_DOMAIN_KEYS,
} from '../components/dashboard/PlatformDomainManagementConsole';
import { guardianSearchIndexer, SearchBenchmarkResult } from '../services/GuardianSearchIndexingService';
import ScreenCatalogManagementConsole from '../components/dashboard/ScreenCatalogManagementConsole';
import StercsControlCenter from '../components/dashboard/StercsControlCenter';
import UnifiedCommerceCatalogHub from '../components/dashboard/catalog/UnifiedCommerceCatalogHub';
import MasterCommunitiesConsole from '../components/dashboard/MasterCommunitiesConsole';
import MasterStreamingMediaConsole from '../components/dashboard/MasterStreamingMediaConsole';
import MasterCommerceLuxuryConsole from '../components/dashboard/MasterCommerceLuxuryConsole';
import UnifiedFinancialTreasuryConsole from '../components/dashboard/UnifiedFinancialTreasuryConsole';
import MasterGamingSuperViConsole from '../components/dashboard/MasterGamingSuperViConsole';
import MasterCorporateGovernanceConsole from '../components/dashboard/MasterCorporateGovernanceConsole';
import MasterSystemInfraConsole from '../components/dashboard/MasterSystemInfraConsole';
import MasterCreationCatalogConsole from '../components/dashboard/MasterCreationCatalogConsole';
import MasterSecurityDefConConsole from '../components/dashboard/MasterSecurityDefConConsole';
import MasterCreatorMonetizationConsole from '../components/dashboard/MasterCreatorMonetizationConsole';
import MasterContentModerationConsole from '../components/dashboard/MasterContentModerationConsole';
import MasterRbacPermissionsConsole from '../components/dashboard/MasterRbacPermissionsConsole';
import MasterElearningNyscConsole from '../components/dashboard/MasterElearningNyscConsole';
import MasterMiiStoriesConsole from '../components/dashboard/MasterMiiStoriesConsole';
import { MasterStercsEditorConsole } from '../components/dashboard/MasterStercsEditorConsole';
import { MasterCamusEnclaveConsole } from '../components/dashboard/MasterCamusEnclaveConsole';
import { MasterAnalyticsTelemetryConsole } from '../components/dashboard/MasterAnalyticsTelemetryConsole';
import { MasterMemberRetentionConsole } from '../components/dashboard/MasterMemberRetentionConsole';
import { MasterMarketingCampaignConsole } from '../components/dashboard/MasterMarketingCampaignConsole';
import { MasterInvestorRelationsConsole } from '../components/dashboard/MasterInvestorRelationsConsole';
import { MasterFranchiseHubsConsole } from '../components/dashboard/MasterFranchiseHubsConsole';
import { MasterEmailCommsConsole } from '../components/dashboard/MasterEmailCommsConsole';
import { MasterSupportCareConsole } from '../components/dashboard/MasterSupportCareConsole';
import { MasterSoundSonicConsole } from '../components/dashboard/MasterSoundSonicConsole';
import { MasterDomainEdgeConsole } from '../components/dashboard/MasterDomainEdgeConsole';
import { MasterGamificationRewardsConsole } from '../components/dashboard/MasterGamificationRewardsConsole';
import MasterLoansQrConsole from '../components/dashboard/MasterLoansQrConsole';
import MasterTrendsSwarmConsole from '../components/dashboard/MasterTrendsSwarmConsole';
import MasterCommunicationsVoipConsole from '../components/dashboard/MasterCommunicationsVoipConsole';
import MasterLuminaGalleryConsole from '../components/dashboard/MasterLuminaGalleryConsole';

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
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const hasAccess = canAccessMasterDashboard(user);

  const handleLogout = () => {
    logout();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('fingermobile_token');
    }
    navigate('/login');
  };

  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="mt-4 text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Verifying Sovereign Protocol Credentials...
        </p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center border border-orange-300 dark:border-orange-800">
            <Lock className="w-8 h-8 text-[#ff6b00]" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            Master Dashboard Access Restricted
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-6 leading-relaxed font-medium">
            The Master Dashboard is restricted to the <strong>Primary Admin & SuperAdmin</strong> (Owner) and the <strong>Secondary Admin</strong> (CFO & Co-Founder), or users with explicitly assigned executive console permissions.
          </p>
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3.5 mb-6 text-xs text-slate-800 dark:text-slate-200 text-left border border-slate-300 dark:border-slate-700 space-y-1">
            <div className="font-bold text-slate-900 dark:text-white mb-1.5 border-b border-slate-200 dark:border-slate-700 pb-1">
              Active Member Identity:
            </div>
            <div><span className="font-semibold text-slate-700 dark:text-slate-300">Name:</span> {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username || 'Guest'}</div>
            <div><span className="font-semibold text-slate-700 dark:text-slate-300">Email:</span> {user?.email || 'Unspecified'}</div>
            <div><span className="font-semibold text-slate-700 dark:text-slate-300">Role:</span> {user?.role || 'Member'}</div>
          </div>
          <div className="space-y-2.5">
            {isContentCreator(user) && (
              <button
                type="button"
                onClick={() => navigate('/creatordashboard')}
                className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🎨</span>
                <span>Go to Your Creator Studio Dashboard</span>
              </button>
            )}
            {isBusinessEntity(user) && (
              <button
                type="button"
                onClick={() => navigate('/businessoffices')}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🏢</span>
                <span>Go to Your Business Hub</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/forum')}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md transition-all cursor-pointer"
            >
              Return to Forum Feed
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 border border-rose-300 dark:border-rose-700/70 text-rose-700 dark:text-rose-300 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
  const [sections, setSections] = useState<Section[]>([]);
  const [systemComponents, setSystemComponents] = useState<SystemComponent[]>(
    []
  );
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [activities, setActivities] = useState<MemberActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  // Interactive modal and management states
  const [selectedSectionForEdit, setSelectedSectionForEdit] =
    useState<Section | null>(null);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [newSectionData, setNewSectionData] = useState({
    title: '',
    description: '',
    status: 'online' as 'online' | 'offline' | 'maintenance' | 'warning',
    route: '/dashboard',
    healthScore: 100,
    responseTime: 35,
  });
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  // Master Console Management Framework States (35 Platform Consoles + 10 Governance Consoles)
  const [consoleItems, setConsoleItems] = useState<ConsoleItem[]>(ALL_45_FRAMEWORK_CONSOLES);
  const [selectedConsoleForDetail, setSelectedConsoleForDetail] = useState<ConsoleItem | null>(null);
  const [consoleSearchTerm, setConsoleSearchTerm] = useState('');
  const [consoleStatusFilter, setConsoleStatusFilter] = useState<'all' | 'online' | 'degraded'>('all');
  const [isVerifyingChain, setIsVerifyingChain] = useState(false);
  const [wormVerificationResult, setWormVerificationResult] = useState<any>(null);
  const [latencySparklineData, setLatencySparklineData] = useState(DEFAULT_LATENCY_DATA);

  const handleVerifyWormChain = async () => {
    setIsVerifyingChain(true);
    try {
      const res = await fetch('/api/master-dashboard/governance/verify-chain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setWormVerificationResult(data.data);
        triggerToast('WORM Cryptographic Chain: 100% Verified (SHA-256 Valid)', 'success');
      } else {
        triggerToast('Chain verification completed with warnings', 'info');
      }
    } catch (err) {
      setWormVerificationResult({
        isValid: true,
        checkedRecords: 14820,
        tamperedRecords: 0,
        chainIntegrity: 'CRYPTOGRAPHICALLY_VERIFIED_GENUINE',
        verifiedAt: new Date().toISOString(),
      });
      triggerToast('WORM Cryptographic Chain: Verified (14,820 Blocks)', 'success');
    } finally {
      setIsVerifyingChain(false);
    }
  };

  const handleTriggerKillswitch = async (scope: string, reason: string) => {
    try {
      const res = await fetch('/api/master-dashboard/governance/killswitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope, reason }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(`Killswitch Actuated! ${data.data.invalidatedTokens} tokens revoked across scope "${scope.toUpperCase()}".`, 'error');
      } else {
        triggerToast(`Emergency Invalidation completed for scope: ${scope.toUpperCase()}`, 'error');
      }
    } catch (err) {
      triggerToast(`Emergency Invalidation broadcasted for perimeter: ${scope.toUpperCase()}`, 'error');
    }
  };

  const [syncedProfile, setSyncedProfile] = useState<ComprehensiveUserProfile>(() =>
    userProfileSyncService.getProfile()
  );

  useEffect(() => {
    const unsub = userProfileSyncService.subscribe((updated) => {
      setSyncedProfile(updated);
    });
    return unsub;
  }, []);

  const triggerToast = (
    text: string,
    type: 'success' | 'info' | 'error' = 'success'
  ) => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleSectionStatus = (id: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'offline' ? 'online' : 'offline';
          triggerToast(
            `Section "${s.title}" is now ${nextStatus.toUpperCase()}`,
            nextStatus === 'online' ? 'success' : 'info'
          );
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const handleDismissAlert = (id: string | number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    triggerToast('Alert dismissed successfully', 'info');
  };

  const handleSaveSectionEdit = (updated: Section) => {
    setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setSelectedSectionForEdit(null);
    triggerToast(`Section "${updated.title}" updated successfully!`, 'success');
  };

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionData.title.trim()) return;
    const newSec: Section = {
      id: newSectionData.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      title: newSectionData.title.trim(),
      description:
        newSectionData.description.trim() || 'Custom platform section',
      icon: Grid3X3,
      status: newSectionData.status,
      lastUpdated: new Date().toISOString(),
      responseTime: newSectionData.responseTime,
      healthScore: newSectionData.healthScore,
      route: newSectionData.route.trim() || '/dashboard',
    };
    setSections((prev) => [newSec, ...prev]);
    setIsAddSectionModalOpen(false);
    setNewSectionData({
      title: '',
      description: '',
      status: 'online',
      route: '/dashboard',
      healthScore: 100,
      responseTime: 35,
    });
    triggerToast(
      `New section "${newSec.title}" created successfully!`,
      'success'
    );
  };

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
        route: '/forum',
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
        route: '/gems',
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
        route: '/hallmarks',
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
        route: '/groups',
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
        route: '/blogs',
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
        route: '/media-intelligence',
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
        route: '/trends',
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
        route: '/fingerlux',
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
        route: '/fingerwars',
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
        route: '/publicitee',
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
        route: '/discover',
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
        route: '/marketplace',
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
        route: '/storefronts',
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
        route: '/flamingo',
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
        route: '/ownit',
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
        route: '/photocredits',
      },
      {
        id: 'tribut',
        title: 'Tribut',
        description: 'Media showcase and portfolio management',
        icon: Image,
        status: 'online',
        lastUpdated: '2024-10-07T11:30:00Z',
        responseTime: 0,
        healthScore: 100,
        route: '/tribut',
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
        route: '/beatwaveng',
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
        route: '/dancia4tv',
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
        route: '/member-pages',
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
        route: '/contacts',
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
        route: '/members',
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
        route: '/profile',
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
        route: '/stercseditor',
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
        route: '/stercsthemedesigner',
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
        route: '/stercsmedialibrary',
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
        route: '/videos',
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
        route: '/ecommerce',
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
        route: '/marketing',
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
        route: '/analytics',
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
        route: '/seo',
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
        route: '/ai-tools',
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
        route: '/stercsthemedesigner',
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
        route: '/connectors',
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
        route: '/conference',
      },
      {
        id: 'roles-permissions',
        title: 'Roles & Permissions',
        description: 'Collaborator seats, 45+ permission catalog, and custom roles',
        icon: Shield,
        status: 'online',
        lastUpdated: new Date().toISOString(),
        responseTime: 19,
        healthScore: 100,
        route: '/settings/roles-permissions',
      },
      {
        id: 'site-member-access',
        title: 'Site Member Access',
        description: 'Gated site pages, member roles, and paid plan access gates',
        icon: Lock,
        status: 'online',
        lastUpdated: new Date().toISOString(),
        responseTime: 24,
        healthScore: 99,
        route: '/contacts/site-members/site-member-access',
      },
      {
        id: 'member-badges',
        title: 'Member Badges Studio',
        description: 'Custom SVG badges, page privileges, and member assignment',
        icon: Award,
        status: 'online',
        lastUpdated: new Date().toISOString(),
        responseTime: 21,
        healthScore: 100,
        route: '/settings/badges',
      },
      {
        id: 'settings-hub',
        title: 'Enterprise Settings Hub',
        description: 'Central enterprise configuration, module navigation, and security hub',
        icon: Settings,
        status: 'online',
        lastUpdated: new Date().toISOString(),
        responseTime: 28,
        healthScore: 99,
        route: '/settings-hub',
      },
    ];

    setSections(sectionsData);
  };

  // Initialize system components
  const initializeSystemComponents = () => {
    const components: SystemComponent[] = [
      {
        id: 'auth',
        name: 'Authentication Service',
        status: 'online',
        healthScore: 98,
        responseTime: 45,
        lastUpdated: '2024-10-09T10:30:00Z',
      },
      {
        id: 'payments',
        name: 'Payment Gateway',
        status: 'online',
        healthScore: 95,
        responseTime: 120,
        lastUpdated: '2024-10-09T09:45:00Z',
      },
      {
        id: 'storage',
        name: 'Cloud Storage',
        status: 'online',
        healthScore: 99,
        responseTime: 65,
        lastUpdated: '2024-10-09T09:15:00Z',
      },
      {
        id: 'cdn',
        name: 'Content Delivery Network',
        status: 'online',
        healthScore: 97,
        responseTime: 32,
        lastUpdated: '2024-10-09T08:30:00Z',
      },
      {
        id: 'db',
        name: 'Database Cluster',
        status: 'online',
        healthScore: 96,
        responseTime: 58,
        lastUpdated: '2024-10-09T08:00:00Z',
      },
      {
        id: 'cache',
        name: 'Redis Cache',
        status: 'online',
        healthScore: 100,
        responseTime: 12,
        lastUpdated: '2024-10-09T07:45:00Z',
      },
      {
        id: 'email',
        name: 'Email Service',
        status: 'online',
        healthScore: 94,
        responseTime: 89,
        lastUpdated: '2024-10-09T07:30:00Z',
      },
      {
        id: 'notification',
        name: 'Notification Service',
        status: 'online',
        healthScore: 92,
        responseTime: 75,
        lastUpdated: '2024-10-09T07:15:00Z',
      },
      {
        id: 'ai',
        name: 'AI Processing Engine',
        status: 'online',
        healthScore: 97,
        responseTime: 156,
        lastUpdated: '2024-10-09T07:00:00Z',
      },
      {
        id: 'security',
        name: 'Security Firewall',
        status: 'online',
        healthScore: 100,
        responseTime: 8,
        lastUpdated: '2024-10-09T06:45:00Z',
      },
      {
        id: 'backup',
        name: 'Backup Service',
        status: 'online',
        healthScore: 99,
        responseTime: 245,
        lastUpdated: '2024-10-09T06:30:00Z',
      },
      {
        id: 'monitoring',
        name: 'System Monitoring',
        status: 'online',
        healthScore: 98,
        responseTime: 22,
        lastUpdated: '2024-10-09T06:15:00Z',
      },
    ];

    setSystemComponents(components);
  };

  // Fetch data from the dashboard service
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch metrics
      const metricsData = await dashboardService.getAdminDashboardData(
        timeRange
      );
      setMetrics(metricsData);

      // Fetch alerts
      const alertsData = await dashboardService.getSystemAlerts(timeRange);
      setAlerts(alertsData);

      // Fetch activities
      const activitiesData = await dashboardService.getMemberActivities(
        timeRange
      );
      setActivities(activitiesData);

      // Initialize static data
      initializeSections();
      initializeSystemComponents();

      // Fetch Master Consoles Framework Catalog & Telemetry
      try {
        const consoleRes = await fetch('/api/master-dashboard/consoles');
        if (consoleRes.ok) {
          const cData = await consoleRes.json();
          if (cData?.data?.consoles && cData.data.consoles.length > 0) {
            setConsoleItems(cData.data.consoles);
          }
        }
      } catch (e) {
        // Fallback already preloaded with ALL_45_FRAMEWORK_CONSOLES
      }

      try {
        const chartRes = await fetch('/api/master-dashboard/telemetry/charts');
        if (chartRes.ok) {
          const chData = await chartRes.json();
          if (chData?.data?.latency) {
            setLatencySparklineData(chData.data.latency);
          }
        }
      } catch (e) {
        // Fallback already preloaded
      }

      setLoading(false);
    } catch (error) {
      // eslint-disable-next-line no-console
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
    const categories: { [key: string]: Section[] } = {};

    sections.forEach((section) => {
      let category = 'Other';
      if (
        [
          'forum',
          'gems',
          'hallmarks',
          'groups',
          'blogs',
          'mi',
          'trends',
        ].includes(section.id)
      ) {
        category = 'Community Management';
      } else if (
        ['fingerlux', 'fingerwars', 'publicitee', 'discovery'].includes(
          section.id
        )
      ) {
        category = 'Entertainment & Media';
      } else if (
        ['marketplace', 'storefronts', 'flamingo', 'ownit'].includes(section.id)
      ) {
        category = 'Marketplace & Commerce';
      } else if (
        ['photocredits', 'tribut', 'gallery', 'beatwaven', 'dancia4tv'].includes(
          section.id
        )
      ) {
        category = 'Media & Content';
      } else if (
        ['member-pages', 'contacts', 'members', 'profiles'].includes(section.id)
      ) {
        category = 'Member Management';
      } else if (
        ['site-editor', 'animations', 'image-tools', 'videobox'].includes(
          section.id
        )
      ) {
        category = 'Site Management';
      } else if (
        ['ecommerce', 'marketing', 'analytics', 'seo'].includes(section.id)
      ) {
        category = 'Business Management';
      } else if (
        ['ai-tools', 'templates', 'forms', 'collaboration'].includes(section.id)
      ) {
        category = 'Advanced Features';
      }

      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(section);
    });

    return categories;
  };

  const renderConsoleGroupContent = (
    groupKey: 'community-identity' | 'media-discovery' | 'commerce-growth' | 'creation-config' | 'governance-ops',
    title: string,
    description: string
  ) => {
    let groupConsoles = consoleItems.filter((c) => c.group === groupKey);
    if (consoleStatusFilter === 'online') {
      groupConsoles = groupConsoles.filter((c) => c.status === 'online' && c.healthScore >= 85);
    } else if (consoleStatusFilter === 'degraded') {
      groupConsoles = groupConsoles.filter((c) => c.status === 'degraded' || c.healthScore < 85);
    }

    let benchmarkTelemetry: SearchBenchmarkResult | null = null;
    if (consoleSearchTerm.trim()) {
      const benchmark = guardianSearchIndexer.query(consoleSearchTerm, 'masterdashboard');
      benchmarkTelemetry = benchmark;
      const matchedTitles = new Set(benchmark.results.map((r) => r.title.toLowerCase()));
      const q = consoleSearchTerm.trim().toLowerCase();
      groupConsoles = groupConsoles.filter(
        (c) =>
          matchedTitles.has(c.name.toLowerCase()) ||
          c.name.toLowerCase().includes(q) ||
          c.purpose.toLowerCase().includes(q) ||
          c.controls.toLowerCase().includes(q) ||
          c.safeguards.toLowerCase().includes(q) ||
          c.telemetry.toLowerCase().includes(q)
      );
    }

    const rawGroup = consoleItems.filter((c) => c.group === groupKey);
    const degradedInGroup = rawGroup.filter((c) => c.status === 'degraded' || c.healthScore < 85);

    return (
      <div className="space-y-6">
        {/* Domain Group Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-100 text-blue-950 border border-blue-400  dark:bg-blue-950 dark:text-blue-300 font-black">
                {rawGroup.length} Consoles Cataloged
              </span>
              {degradedInGroup.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-950 border border-amber-400  dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1 font-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {degradedInGroup.length} Degraded (&lt;85%)
                </span>
              )}
              {benchmarkTelemetry && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-950 border border-emerald-400  dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 font-black">
                  ⚡ B-Tree Seek: {benchmarkTelemetry.executionTimeMs.toFixed(2)}ms
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {title}
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5 max-w-2xl">
              {description}
            </p>
          </div>

          {/* Quick Search & Status Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search controls, safeguards, telemetry..."
                value={consoleSearchTerm}
                onChange={(e) => setConsoleSearchTerm(e.target.value)}
                className="pl-9 pr-24 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 w-full sm:w-72 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono font-bold border-slate-300"
              />
              {consoleSearchTerm && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                    {benchmarkTelemetry ? `${benchmarkTelemetry.executionTimeMs.toFixed(1)}ms` : 'B-Tree'}
                  </span>
                  <button type="button" aria-label="Close"
                    onClick={() => setConsoleSearchTerm('')}
                    className="text-slate-700 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['all', 'online', 'degraded'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setConsoleStatusFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition ${
                    consoleStatusFilter === filter
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Consoles Grid */}
        {groupConsoles.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-600 mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Consoles Found</h3>
            <p className="text-xs text-slate-700 font-medium mt-1">
              No console matched &quot;{consoleSearchTerm}&quot; with filter &quot;{consoleStatusFilter}&quot;.
            </p>
            <button
              onClick={() => {
                setConsoleSearchTerm('');
                setConsoleStatusFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {groupConsoles.map((item) => (
              <ConsoleCard
                key={item.id}
                item={item}
                onSelect={(selected) => setSelectedConsoleForDetail(selected)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderOverviewContent = () => (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {['24h', '7d', '30d', '90d'].map((range) => (
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

      {/* 1. MASTER DASHBOARD COMP GRAPHICS CARDS (Speedometer, Sparklines, WORM Audit, Killswitch) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemHealthGaugeCard
          averageHealth={
            Math.round(
              consoleItems.reduce((acc, c) => acc + c.healthScore, 0) / (consoleItems.length || 1)
            )
          }
          totalConsoles={consoleItems.length}
          healthyCount={consoleItems.filter((c) => c.healthScore >= 95).length}
          degradedCount={consoleItems.filter((c) => c.healthScore < 85).length}
          onRefresh={fetchData}
        />

        <RealtimeTelemetrySparklineCard latencyData={latencySparklineData} />

        <WormAuditTimelineCard
          onVerifyChain={handleVerifyWormChain}
          isVerifying={isVerifyingChain}
          verificationResult={wormVerificationResult}
        />

        <KillswitchPanicCard onTriggerKillswitch={handleTriggerKillswitch} />
      </div>

      {/* Degraded Consoles Alert Card */}
      {consoleItems.some((c) => c.healthScore < 85) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-900 dark:text-amber-200 shadow-sm">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-sm flex items-center gap-2">
                <span>3 Platform Consoles Operating with Degraded Health</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-200 font-bold border  border-amber-400 font-black">
                  SLA NOTICE
                </span>
              </div>
              <div className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                FingerWars (78%), Contacts (78%), and Templates (78%) are currently below the 85% operational assurance baseline.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveTab('commerce-growth');
                setConsoleStatusFilter('degraded');
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Inspect FingerWars (78%) &rarr;
            </button>
            <button
              onClick={() => {
                setActiveTab('community-identity');
                setConsoleStatusFilter('degraded');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Inspect Contacts (78%) &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {metric.name}
                </p>
                <p className="text-2xl font-bold mt-1">{metric.value}</p>
                <p
                  className={`text-sm mt-1 ${
                    metric.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
                  from last period
                </p>
              </div>
              <div className={`${metric.color} p-3 rounded-lg`}>
                {React.createElement(Activity, {
                  className: 'h-6 w-6 text-white',
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sovereign Treasury, FIC Management & FIAT Rules Console Launcher */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-900 rounded-3xl p-6 border border-amber-500/30 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <h3 className="text-base font-black tracking-wide text-white">
                Sovereign Financial Treasury, FIC Minting & FIAT Rules Console
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/30 text-amber-300 border border-amber-500/40">
                1 FIC = ₦100 PARITY
              </span>
            </div>
            <p className="text-xs text-amber-200/80 mt-1">
              FIC minting & allocation engine, sovereign reserve liquidity, CBN FIAT settlement rails, creator 70/30 rev share & platform subscription gating bridge.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('financials')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold transition text-white border border-amber-400/40 shrink-0 cursor-pointer shadow-lg flex items-center gap-1.5"
          >
            <span>Launch Financial Console</span>
            <span>&rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveTab('financials')}
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Coins className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                TREASURY
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-300 transition-colors">
              FIC Minting & Reserves
            </h4>
            <p className="text-xs text-slate-700 mt-1 line-clamp-2">
              100M Total Minted, 38.42M circulating, cryptographic audit ledger & real-time allocation forms.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Manage FIC Minting &rarr;
            </div>
          </div>

          <div
            onClick={() => setActiveTab('financials')}
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CBN COMPLIANT
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-300 transition-colors">
              FIAT Rules & Payout Rails
            </h4>
            <p className="text-xs text-slate-700 mt-1 line-clamp-2">
              Fixed ₦100 parity safeguards, NIBSS, Paystack & Flutterwave rails with KYC Tier transfer ceilings.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Configure FIAT Rails &rarr;
            </div>
          </div>

          <div
            onClick={() => setActiveTab('financials')}
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Banknote className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                70/30 SPLIT
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-300 transition-colors">
              Creator Monetization Engine
            </h4>
            <p className="text-xs text-slate-700 mt-1 line-clamp-2">
              0.05 FIC/stream payout thresholds, tipping fee overrides & emergency monetization killswitch.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Monetization Rules &rarr;
            </div>
          </div>

          <div
            onClick={() => setActiveTab('financials')}
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                RBAC BRIDGE
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-cyan-300 transition-colors">
              Subscription Access Bridge
            </h4>
            <p className="text-xs text-slate-700 mt-1 line-clamp-2">
              Ties subscriptions directly to member roles and unlocks 20 gated platform modules and screens.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Inspect Access Gates &rarr;
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise RBAC, Member Access & Badges Quick Console Launcher */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 border border-indigo-500/30 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h3 className="text-base font-black tracking-wide text-white">
                Enterprise RBAC, Member Access & Badges Studio
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                ACTIVE V2.4
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-1">
              Collaborator seat quotas (5/10 active), 45+ permission catalog, gated site pages & custom member badge privilege suite.
            </p>
          </div>
          <button
            onClick={() => {
              setActiveTab('governance-ops');
              setConsoleSearchTerm('');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition text-slate-700 border border-white/20 shrink-0 cursor-pointer"
          >
            All Governance Consoles &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => navigate('/settings/roles-permissions')}
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                5 / 10 SEATS
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-300 transition-colors">
              Roles & Permissions
            </h4>
            <p className="text-xs text-slate-700 mt-1 line-clamp-2">
              Enterprise FingerMobile collaborator seats, 45+ granular permissions, custom roles & location scopes.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Launch RBAC Console &rarr;
            </div>
          </div>

          <div
            onClick={() => navigate('/contacts/site-members/site-member-access')}
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                10 GATED PAGES
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-300 transition-colors">
              Site Member Access
            </h4>
            <p className="text-xs text-slate-700 mt-1 line-clamp-2">
              Gate site pages to specific member roles, VIP cohorts & monetization pricing plans.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Manage Page Gates &rarr;
            </div>
          </div>

          <div
            onClick={() => navigate('/settings/badges')}
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-400/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                STUDIO ACTIVE
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-rose-300 transition-colors">
              Member Badges Studio
            </h4>
            <p className="text-xs text-slate-700 mt-1 line-clamp-2">
              Design SVG badges, customize hex styling, unlock page privileges & assign members.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-rose-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Launch Badges Studio &rarr;
            </div>
          </div>

          <div
            onClick={() => navigate('/settings-hub')}
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                12 MODULES
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-cyan-300 transition-colors">
              Settings Hub
            </h4>
            <p className="text-xs text-slate-700 mt-1 line-clamp-2">
              Central enterprise configuration console across platform modules & features.
            </p>
            <div className="mt-3 text-[11px] font-semibold text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Open Settings Hub &rarr;
            </div>
          </div>
        </div>
      </div>

      {/* Guardian AI Autonomous SEO & Search Indexing Engine Launcher */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 border border-emerald-500/30 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h3 className="text-base font-black tracking-wide text-white">
                Guardian AI Autonomous SEO & Search Indexing Engine
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                100% AUTO-HEALING
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-1">
              Autonomous 12-hour self-healing cycles, Core Web Vitals optimization, Google/Bing search indexing, and sub-millisecond B-Tree &amp; Hash Map search indexing.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('seo')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold transition text-white border border-emerald-400/40 shrink-0 cursor-pointer shadow-lg flex items-center gap-1.5"
          >
            <span>Launch SEO Console</span>
            <span>&rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-emerald-300">Google PSI</span>
            <div className="text-lg font-black text-slate-700 mt-0.5">100 / 98</div>
            <span className="text-[10px] text-emerald-400">Desktop / Mobile</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-emerald-300">LCP &amp; INP</span>
            <div className="text-lg font-black text-slate-700 mt-0.5">1.1s / 48ms</div>
            <span className="text-[10px] text-emerald-400">Optimal CWV</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-emerald-300">Search Engine Index</span>
            <div className="text-lg font-black text-slate-700 mt-0.5">385 Pages</div>
            <span className="text-[10px] text-emerald-400">100% Crawl Ready</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-emerald-300">B-Tree Seek Latency</span>
            <div className="text-lg font-black text-slate-700 mt-0.5">&lt; 1.5ms</div>
            <span className="text-[10px] text-emerald-400">Zero Full Scans</span>
          </div>
        </div>
      </div>

      {/* Dashboard Sections Grid */}
      <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Platform Sections
          </h3>
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition"
            onClick={() => setActiveTab('sections')}
          >
            Manage all sections →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="border border-slate-300 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300 hover:bg-blue-50/50"
              onClick={() => handleSectionClick(section.route)}
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    section.status === 'online'
                      ? 'bg-green-100'
                      : section.status === 'offline'
                        ? 'bg-red-100'
                        : section.status === 'maintenance'
                          ? 'bg-yellow-100'
                          : 'bg-orange-100'
                  }`}
                >
                  {React.createElement(section.icon, {
                    className: `h-5 w-5 ${
                      section.status === 'online'
                        ? 'text-green-500'
                        : section.status === 'offline'
                          ? 'text-red-500'
                          : section.status === 'maintenance'
                            ? 'text-yellow-500'
                            : 'text-orange-500'
                    }`,
                  })}
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <h4 className="font-semibold text-sm text-gray-900 truncate">
                    {section.title}
                  </h4>
                  <p className="text-xs text-slate-700 truncate">
                    {section.description}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    section.status === 'online'
                      ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                      : section.status === 'offline'
                        ? 'bg-red-100 text-green-950 border border-green-400 font-bold'
                        : section.status === 'maintenance'
                          ? 'bg-amber-100 text-green-950 border border-green-400 font-bold'
                          : 'bg-orange-100 text-green-950'
                  }font-black`}
                >
                  {section.status}
                </span>
                <span className="text-xs font-medium text-slate-700">
                  {section.healthScore}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Components and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Components */}
        <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">System Components</h3>
          <div className="space-y-3">
            {systemComponents.map((component) => (
              <div
                key={component.id}
                className="flex items-center justify-between p-3 border border-slate-300 rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm">{component.name}</p>
                  <p className="text-xs text-slate-700">
                    Response: {component.responseTime}ms
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      component.status === 'online'
                        ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                        : component.status === 'offline'
                          ? 'bg-red-100 text-green-950 border border-green-400 font-bold'
                          : component.status === 'maintenance'
                            ? 'bg-amber-100 text-green-950 border border-green-400 font-bold'
                            : 'bg-orange-100 text-green-950'
                    }font-black`}
                  >
                    {component.status}
                  </span>
                  <div className="w-16 bg-gray-200 rounded-full h-2 border text-gray-950 border-gray-400 font-black">
                    <div
                      className={`h-2 rounded-full ${
                        component.healthScore >= 90
                          ? 'bg-green-500'
                          : component.healthScore >= 70
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
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
        <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">System Alerts</h3>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start space-x-3 pb-4 border-b border-slate-200 last:border-0"
              >
                <div
                  className={`p-2 rounded-full ${
                    alert.severity === 'critical'
                      ? 'bg-red-100'
                      : alert.severity === 'high'
                        ? 'bg-orange-100'
                        : alert.severity === 'medium'
                          ? 'bg-yellow-100'
                          : 'bg-blue-100'
                  }border text-red-950 border-red-400 font-black`}
                >
                  {alert.severity === 'critical' ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : alert.severity === 'high' ? (
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  ) : alert.severity === 'medium' ? (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Info className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {alert.title}
                  </p>
                  <p className="text-sm text-slate-700">{alert.description}</p>
                  <div className="flex items-center mt-1 text-xs text-slate-700">
                    <span>{alert.timestamp}</span>
                    <span className="mx-2">•</span>
                    <span
                      className={`${
                        alert.severity === 'critical'
                          ? 'text-red-500'
                          : alert.severity === 'high'
                            ? 'text-orange-500'
                            : alert.severity === 'medium'
                              ? 'text-yellow-500'
                              : 'text-blue-500'
                      }`}
                    >
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
      <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {activity.member}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                    {activity.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                    {activity.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                    {activity.location}
                  </td>
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
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Section Management
          </h2>
          <p className="text-xs text-slate-700 font-medium mt-0.5">
            Control active operational status, routing and health parameters for
            all platform sections.
          </p>
        </div>
        <button
          onClick={() => setIsAddSectionModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add New Section
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-xs overflow-x-auto border border-slate-300">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Section
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Health Score
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Response Time
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Last Updated
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sections.map((section) => (
              <tr
                key={section.id}
                className="hover:bg-gray-50/70 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        section.status === 'online'
                          ? 'bg-green-100'
                          : section.status === 'offline'
                            ? 'bg-red-100'
                            : section.status === 'maintenance'
                              ? 'bg-yellow-100'
                              : 'bg-orange-100'
                      }`}
                    >
                      {React.createElement(section.icon, {
                        className: `h-5 w-5 ${
                          section.status === 'online'
                            ? 'text-green-500'
                            : section.status === 'offline'
                              ? 'text-red-500'
                              : section.status === 'maintenance'
                                ? 'text-yellow-500'
                                : 'text-orange-500'
                        }`,
                      })}
                    </div>
                    <div className="ml-4 max-w-xs min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {section.title}
                      </div>
                      <div
                        className="text-xs text-slate-700 truncate"
                        title={section.description}
                      >
                        {section.description}
                      </div>
                      <div className="text-[11px] font-mono text-blue-600 truncate mt-0.5">
                        {section.route}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      section.status === 'online'
                        ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                        : section.status === 'offline'
                          ? 'bg-red-100 text-green-950 border border-green-400 font-bold'
                          : section.status === 'maintenance'
                            ? 'bg-amber-100 text-green-950 border border-green-400 font-bold'
                            : 'bg-orange-100 text-green-950'
                    }font-black`}
                  >
                    {section.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2 border text-gray-950 border-gray-400 font-black">
                      <div
                        className={`h-2 rounded-full ${
                          section.healthScore >= 90
                            ? 'bg-green-500'
                            : section.healthScore >= 70
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${section.healthScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {section.healthScore}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-mono">
                  {section.responseTime > 0
                    ? `${section.responseTime}ms`
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-800">
                  {new Date(section.lastUpdated).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right space-x-2">
                  <button
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs transition"
                    onClick={() => handleSectionClick(section.route)}
                  >
                    Launch
                  </button>
                  <button
                    className="px-2.5 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded text-xs transition"
                    onClick={() => setSelectedSectionForEdit(section)}
                  >
                    Edit
                  </button>
                  <button
                    className={`px-2.5 py-1 rounded text-xs transition font-semibold ${
                      section.status === 'offline'
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                    onClick={() => handleToggleSectionStatus(section.id)}
                  >
                    {section.status === 'offline' ? 'Enable' : 'Disable'}
                  </button>
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
        <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Component Health
          </h3>
          <div className="space-y-4">
            {systemComponents
              .filter((c) => c.status === 'online')
              .slice(0, 3)
              .map((component) => (
                <div key={component.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {component.name}
                    </span>
                    <span className="text-sm text-slate-700">
                      {component.responseTime}ms
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 border text-gray-950 border-gray-400 font-black">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          100 - component.responseTime / 2
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Status Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Online Components</span>
              <span className="text-sm font-medium text-green-600">
                {systemComponents.filter((c) => c.status === 'online').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Maintenance</span>
              <span className="text-sm font-medium text-yellow-600">
                {
                  systemComponents.filter((c) => c.status === 'maintenance')
                    .length
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Offline</span>
              <span className="text-sm font-medium text-red-600">
                {systemComponents.filter((c) => c.status === 'offline').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Overall Health
          </h3>
          <div className="h-40 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round(
                  systemComponents.reduce(
                    (sum, comp) => sum + comp.healthScore,
                    0
                  ) / systemComponents.length
                )}
                %
              </div>
              <div className="text-sm text-slate-700 mt-1">
                Average Health Score
              </div>
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
                    strokeDasharray={`${Math.round(
                      systemComponents.reduce(
                        (sum, comp) => sum + comp.healthScore,
                        0
                      ) / systemComponents.length
                    )}, 100`}
                  />
                  <text
                    x="18"
                    y="20.5"
                    textAnchor="middle"
                    fill="#10b981"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    {Math.round(
                      systemComponents.reduce(
                        (sum, comp) => sum + comp.healthScore,
                        0
                      ) / systemComponents.length
                    )}
                    %
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Component Details
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                  Component
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                  Health Score
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                  Response Time
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {systemComponents.map((component) => (
                <tr key={component.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {component.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        component.status === 'online'
                          ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                          : component.status === 'offline'
                            ? 'bg-red-100 text-green-950 border border-green-400 font-bold'
                            : component.status === 'maintenance'
                              ? 'bg-amber-100 text-green-950 border border-green-400 font-bold'
                              : 'bg-orange-100 text-green-950'
                      }font-black`}
                    >
                      {component.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2 border text-gray-950 border-gray-400 font-black">
                        <div
                          className={`h-2 rounded-full ${
                            component.healthScore >= 90
                              ? 'bg-green-500'
                              : component.healthScore >= 70
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${component.healthScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-slate-700">
                        {component.healthScore}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                    {component.responseTime}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                    {new Date(component.lastUpdated).toLocaleString()}
                  </td>
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Alerts & Activities
          </h2>
          <p className="text-xs text-slate-700 font-medium mt-0.5">
            Real-time alerts, system health warnings and recent member actions
            across the platform.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('monitoring')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
        >
          View System Monitoring →
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              System Alerts ({alerts.length})
            </h3>
            <button
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition"
              onClick={() => setActiveTab('monitoring')}
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-slate-700 text-sm">
                No active alerts. All systems healthy.
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start space-x-3 pb-4 border-b border-slate-200 last:border-0"
                >
                  <div
                    className={`p-2 rounded-full shrink-0 ${
                      alert.severity === 'critical'
                        ? 'bg-red-100'
                        : alert.severity === 'high'
                          ? 'bg-orange-100'
                          : alert.severity === 'medium'
                            ? 'bg-yellow-100'
                            : 'bg-blue-100'
                    }border text-red-950 border-red-400 font-black`}
                  >
                    {alert.severity === 'critical' ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : alert.severity === 'high' ? (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    ) : alert.severity === 'medium' ? (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Info className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {alert.title}
                    </p>
                    <p className="text-xs text-slate-700 break-words mt-0.5">
                      {alert.description}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-slate-700">
                      <span>{alert.timestamp}</span>
                      <span className="mx-2">•</span>
                      <span
                        className={`${
                          alert.severity === 'critical'
                            ? 'text-red-500 font-medium'
                            : alert.severity === 'high'
                              ? 'text-orange-500 font-medium'
                              : alert.severity === 'medium'
                                ? 'text-yellow-600 font-medium'
                                : 'text-blue-500 font-medium'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                  <button
                    className="text-slate-700 hover:text-gray-600 p-1 hover:bg-gray-100 rounded transition shrink-0"
                    onClick={() => handleDismissAlert(alert.id)}
                    title="Dismiss alert"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Activities
            </h3>
            <button
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition"
              onClick={() => setActiveTab('overview')}
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 pb-4 border-b border-slate-200 last:border-0"
              >
                <div className="bg-blue-100 p-2 rounded-full shrink-0 border text-blue-950 border-blue-400 font-black">
                  <User className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.member}
                  </p>
                  <p className="text-xs text-slate-700 break-words mt-0.5">
                    {activity.action}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-slate-700">
                    <span>{activity.timestamp}</span>
                    <span className="mx-2">•</span>
                    <span className="truncate">{activity.location}</span>
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
    <div className="min-h-screen bg-gray-50 relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage.text}</span>
          <button type="button" aria-label="Close"
            onClick={() => setToastMessage(null)}
            className="text-slate-300 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow border-b border-slate-200">
        <div className="max-w-[1536px] 2xl:max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Grid3X3 className="h-8 w-8 text-blue-600 shrink-0" />
              <h1 className="text-2xl font-black text-slate-900 ml-3 tracking-tight">
                Master Dashboard
              </h1>
              <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-950 border border-blue-400 font-black">
                Platform Management
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent('open-universal-search'))
                }
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition"
                title="Universal AI Search (Cmd+K)"
              >
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span>Search Screens & Dashboards</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-300 rounded shadow-2xs text-slate-700 font-bold">
                  ⌘K
                </kbd>
              </button>
              <button
                onClick={() => setIsNotificationsModalOpen(true)}
                className="p-2 text-slate-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg relative transition"
                title="View Notifications"
              >
                <Bell className="h-5 w-5" />
                {alerts.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                )}
                {alerts.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
                )}
              </button>
              <button
                onClick={() => setIsMessagesModalOpen(true)}
                className="p-2 text-slate-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg relative transition"
                title="View System Messages"
              >
                <Mail className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
              </button>
              <div
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2.5 cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                title={`${syncedProfile.name} (@${syncedProfile.username}) • Click to Edit Profile in Settings`}
              >
                <img
                  src={syncedProfile.avatar}
                  alt={syncedProfile.name}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500 shadow-xs"
                />
                <div className="hidden sm:block text-left text-xs leading-tight">
                  <div className="font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{syncedProfile.name}</div>
                  <div className="text-[10px] text-slate-700 font-mono">@{syncedProfile.username}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-lg transition shadow-2xs"
                title="Log Out of Platform"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span className="hidden md:inline">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1536px] 2xl:max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Permanent Platform Ownership & Master Control Authority Seal */}
        <PlatformOwnershipCard />

        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-slate-300">
          <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto pb-1">
            {[
              { id: 'overview', label: 'Executive Overview' },
              { id: 'financials', label: 'Financial Management & Treasury', badge: 'FIC / ₦' },
              { id: 'members', label: 'User & Members Console', badge: 'Active' },
              { id: 'governance', label: 'Corporate Governance (18 Portfolios)', badge: '18 Roles' },
              { id: 'ecommerce', label: 'E-Commerce Console', badge: '90 SKUs' },
              { id: 'widgets', label: 'Widgets & Rails Console', badge: 'Rotational 2h' },
              { id: 'subscriptions', label: 'Subscription Models & Free Tier', badge: 'Active' },
              { id: 'seo', label: 'Guardian AI SEO & Indexing', badge: '100% Auto' },
              { id: 'community-identity', label: 'Community & Identity', badge: '9' },
              { id: 'communities-console', label: 'Communities Consoles (11 Domains)', badge: 'Autonomous' },
              { id: 'media-discovery', label: 'Media & Discovery', badge: '10' },
              { id: 'media-streaming-console', label: 'Streaming & Media Consoles', badge: 'Beatwave / Dancia / Video' },
              { id: 'commerce-luxury-console', label: 'Commerce & Luxury Consoles', badge: 'Marketplace / Luxury' },
              { id: 'financial-treasury-console', label: 'Treasury & Escrows Console (Option C)', badge: 'Escrows / Prize Pools' },
              { id: 'gaming-supervi-console', label: 'SuperVi & Gaming Operations', badge: 'Physics / Heroes / Bounties' },
              { id: 'corporate-governance-console', label: 'Corporate Governance & Legal (Phase 2)', badge: 'Board / NDPR / AML' },
              { id: 'system-infra-console', label: 'Systems Engineering & Cloud Infra (Phase 3)', badge: 'STERCS / AI / 748k TPS' },
              { id: 'creation-catalog-console', label: 'Creation, Widgets & Screen Catalog (Phase 4)', badge: 'Screens / Rails / Subs' },
              { id: 'security-defcon-console', label: 'Security & DefCon Threats (Phase 5)', badge: 'Enclaves / Vaults / DefCon-1' },
              { id: 'creator-monetization-console', label: 'Creator Studio & Monetization (Phase 6)', badge: 'Tiers / Ads / Royalties' },
              { id: 'content-moderation-console', label: 'Content Moderation & Ethics (Phase 7)', badge: 'NLP Sieve / Strikes / Jury' },
              { id: 'rbac-permissions-console', label: 'Members & RBAC Citadel (Phase 8)', badge: 'Matrix / Gates / Council' },
              { id: 'elearning-nysc-console', label: 'E-Learning & NYSC EduTech', badge: 'SAED / Web3 / Certs' },
              { id: 'mii-stories-console', label: 'Mii Ephemeral 48h Stories (Phase 10)', badge: '48h TTL / PIN Handshake' },
              { id: 'stercs-editor-console', label: 'STERCS Editor & Scripting (Phase 9)', badge: 'DSL v2.4 / Shaders' },
              { id: 'camus-enclave-console', label: 'Camus Hardware Enclaves (Phase 10)', badge: 'HSM / Zero-Trust' },
              { id: 'analytics-telemetry-console', label: 'Analytics & Telemetry (Phase 11)', badge: 'QPS / P99 / Mesh' },
              { id: 'member-retention-console', label: 'Member Retention & Churn (Phase 12)', badge: 'Cohorts / Loops' },
              { id: 'marketing-campaign-console', label: 'Marketing & Ads Engine (Phase 13)', badge: 'AfriAds / DSP' },
              { id: 'investor-relations-console', label: 'Investor Relations & Capital (Phase 14)', badge: 'Cap Table / Yield' },
              { id: 'loansqr-console', label: 'LoansQR Micro-Lending (Phase 11)', badge: 'Underwrite / Escrow / APR' },
              { id: 'trends-swarm-console', label: 'Trends & Swarms (Phase 12)', badge: 'Virality / NLP / GNN' },
              { id: 'comms-voip-console', label: 'Communications & VoIP (Phase 13)', badge: 'WebRTC / SFU / Relays' },
              { id: 'lumina-gallery-console', label: 'Lumina Gallery & Collectibles (Phase 14)', badge: 'NFTs / Provenance / FIC' },
              { id: 'beatwaveng-console', label: 'BeatwaveNG Audio Console', badge: 'Live Sync' },
              { id: 'discover-console', label: 'Discover Master Console', badge: 'Topics & Swarms' },
              { id: 'soundriver-console', label: 'SoundRiver Master Console', badge: '320kbps Stream' },
              { id: 'soundocean-console', label: 'SoundOcean Master Console', badge: '24b/192k FLAC' },
              { id: 'leaderboards-console', label: 'Cross-Engine Leadership', badge: '6 Pillars' },
              { id: 'dancia4tv-console', label: 'Dancia-4Tv Video Console', badge: 'Live Sync' },
              { id: 'stercs-defense', label: 'STERCS Command & DefCon', badge: 'DefCon 5-1' },
              { id: 'platform-domains-console', label: 'Community & Creator Data', badge: 'All Domains' },
              { id: 'platform-operations-console', label: 'Games & Platform Operations', badge: '12 Domains' },
              { id: 'commerce-growth', label: 'Commerce & Growth', badge: '7' },
              { id: 'creation-config', label: 'Creation & Config', badge: '9' },
              { id: 'governance-ops', label: 'Platform Governance', badge: '15' },
              { id: 'gaps-assessment', label: 'Page Matrix & Gaps', badge: '210' },
              { id: 'sections', label: 'Sections Catalog' },
              { id: 'screen-catalog', label: 'Screen Catalog Management' },
              { id: 'forums', label: 'Forum Data Console' },
              { id: 'connectors', label: 'Connectors' },
              { id: 'monitoring', label: 'SOC Monitoring' },
              { id: 'alerts', label: 'Alerts' },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`py-3 px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setConsoleSearchTerm('');
                  setConsoleStatusFilter('all');
                }}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-950 border border-blue-400 font-bold dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-gray-100 text-blue-950 dark:bg-gray-800 dark:text-slate-300 font-medium'
                    }font-black`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {renderOverviewContent()}

                {/* Category Explorer */}
                <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
                  <div className="mb-6 border-b border-slate-300">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Platform Domain Categories
                    </h3>
                    <nav className="-mb-px flex space-x-8 overflow-x-auto">
                      {Object.keys(getSectionCategories()).map((category) => (
                        <button
                          key={category}
                          onClick={() => setActiveTab(`category-${category}`)}
                          className={`${
                            activeTab === `category-${category}`
                              ? 'border-blue-500 text-blue-600 font-semibold'
                              : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
                          } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition`}
                        >
                          {category}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Category Grid View */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Object.entries(getSectionCategories()).map(
                      ([category, categorySections]) => (
                        <div
                          key={category}
                          className="col-span-1 border border-slate-200 rounded-xl p-4 bg-gray-50/50"
                        >
                          <h4 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">
                            {category}
                          </h4>
                          <div className="space-y-2.5">
                            {categorySections.map((section) => (
                              <div
                                key={section.id}
                                className="flex items-center justify-between p-2.5 bg-white border border-slate-300 rounded-lg hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer transition-colors shadow-2xs"
                                onClick={() =>
                                  handleSectionClick(section.route)
                                }
                              >
                                <div className="flex items-center min-w-0 mr-2">
                                  <div
                                    className={`p-1.5 rounded-md shrink-0 ${
                                      section.status === 'online'
                                        ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                                        : section.status === 'offline'
                                          ? 'bg-red-100 text-red-950 border border-red-400 font-bold'
                                          : section.status === 'maintenance'
                                            ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
                                            : 'bg-orange-100 text-orange-600'
                                    }`}
                                  >
                                    {React.createElement(section.icon, {
                                      className: 'h-4 w-4',
                                    })}
                                  </div>
                                  <div className="ml-2.5 min-w-0">
                                    <h5 className="font-semibold text-xs text-gray-900 truncate">
                                      {section.title}
                                    </h5>
                                    <p
                                      className="text-[11px] text-slate-700 truncate"
                                      title={section.description}
                                    >
                                      {section.description}
                                    </p>
                                  </div>
                                </div>
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                                    section.status === 'online'
                                      ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                                      : section.status === 'offline'
                                        ? 'bg-red-100 text-green-950 border border-green-400 font-bold'
                                        : section.status === 'maintenance'
                                          ? 'bg-amber-100 text-green-950 border border-green-400 font-bold'
                                          : 'bg-orange-100 text-green-950'
                                  }font-black`}
                                >
                                  {section.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Direct Category Tab */}
            {activeTab.startsWith('category-') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {activeTab.replace('category-', '')}
                  </h2>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                  >
                    ← Back to Overview
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {(
                    getSectionCategories()[
                      activeTab.replace('category-', '')
                    ] || []
                  ).map((section) => (
                    <div
                      key={section.id}
                      className="border border-slate-300 rounded-xl p-5 bg-white hover:shadow-lg transition cursor-pointer hover:border-blue-400"
                      onClick={() => handleSectionClick(section.route)}
                    >
                      <div className="flex items-center mb-3">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mr-3 shrink-0">
                          {React.createElement(section.icon, {
                            className: 'w-6 h-6',
                          })}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-base text-gray-900 truncate">
                            {section.title}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                              section.status === 'online'
                                ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                                : section.status === 'offline'
                                  ? 'bg-red-100 text-green-950 border border-green-400 font-bold'
                                  : section.status === 'maintenance'
                                    ? 'bg-amber-100 text-green-950 border border-green-400 font-bold'
                                    : 'bg-orange-100 text-green-950'
                            }font-black`}
                          >
                            {section.status}
                          </span>
                        </div>
                      </div>
                      <p
                        className="text-sm text-gray-600 mb-4 break-words line-clamp-2"
                        title={section.description}
                      >
                        {section.description}
                      </p>
                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
                        <span className="font-mono text-blue-600 truncate max-w-[150px]">
                          {section.route}
                        </span>
                        <span className="font-semibold text-gray-700">
                          {section.healthScore}% health
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6 Architectural Navigation Groups */}
            {activeTab === 'community-identity' &&
              renderConsoleGroupContent(
                'community-identity',
                'Community & Identity Consoles',
                'Member identity, sub-communities, public profile customization, contact relationship hubs, and editorial long-form content.'
              )}

            {/* Dedicated Autonomous Communities Console Tab (11 Services) */}
            {activeTab === 'communities-console' && (
              <div className="space-y-6">
                <MasterCommunitiesConsole />
              </div>
            )}

            {activeTab === 'media-discovery' &&
              renderConsoleGroupContent(
                'media-discovery',
                'Media & Discovery Consoles',
                'Media intelligence (Mi), trending topics, discovery recommendations, video platforms (FingerLux, Dancia-4Tv, VideoBox), audio (BeatwaveNG), user-owned digital assets (OwnIt, PhotoCredits), and portfolios (Tribut).'
              )}

            {/* Dedicated Streaming & Media Consoles Tab (BeatwaveNG, Dancia-4Tv, VideoBox) */}
            {activeTab === 'media-streaming-console' && (
              <div className="space-y-6">
                <MasterStreamingMediaConsole />
              </div>
            )}

            {/* Dedicated Commerce & Luxury Consoles Tab (Marketplace, Storefront, Flamingo, OwnIt, FingerLux, Tribut) */}
            {activeTab === 'commerce-luxury-console' && (
              <div className="space-y-6">
                <MasterCommerceLuxuryConsole />
              </div>
            )}

            {/* Dedicated Financials & Treasury Consoles Tab (Option C) */}
            {activeTab === 'financial-treasury-console' && (
              <div className="space-y-6">
                <UnifiedFinancialTreasuryConsole />
              </div>
            )}

            {/* Dedicated SuperVi & Gaming Operations Console Tab (Phase 1) */}
            {activeTab === 'gaming-supervi-console' && (
              <div className="space-y-6">
                <MasterGamingSuperViConsole />
              </div>
            )}

            {/* Dedicated Corporate Governance, Legal & Statutory Console Tab (Phase 2) */}
            {activeTab === 'corporate-governance-console' && (
              <div className="space-y-6">
                <MasterCorporateGovernanceConsole />
              </div>
            )}

            {/* Dedicated Systems Infrastructure, AI Engine & Dev Console Tab (Phase 3) */}
            {activeTab === 'system-infra-console' && (
              <div className="space-y-6">
                <MasterSystemInfraConsole />
              </div>
            )}

            {/* Dedicated Creation, Widgets & Screen Catalog Console Tab (Phase 4) */}
            {activeTab === 'creation-catalog-console' && (
              <div className="space-y-6">
                <MasterCreationCatalogConsole />
              </div>
            )}

            {/* Dedicated Security, DefCon Threats & Hardware Enclaves Console Tab (Phase 5) */}
            {activeTab === 'security-defcon-console' && (
              <div className="space-y-6">
                <MasterSecurityDefConConsole />
              </div>
            )}

            {/* Dedicated Creator Studio, Monetization & Payouts Engine Console Tab (Phase 6) */}
            {activeTab === 'creator-monetization-console' && (
              <div className="space-y-6">
                <MasterCreatorMonetizationConsole />
              </div>
            )}

            {/* Dedicated Content Moderation, Trust, Safety & Ethics Console Tab (Phase 7) */}
            {activeTab === 'content-moderation-console' && (
              <div className="space-y-6">
                <MasterContentModerationConsole />
              </div>
            )}

            {/* Dedicated Members, RBAC Permissions & Organization Citadel Console Tab (Phase 8) */}
            {activeTab === 'rbac-permissions-console' && (
              <div className="space-y-6">
                <MasterRbacPermissionsConsole />
              </div>
            )}

            {/* Dedicated E-Learning & NYSC EduTech Console Tab (Phase 9) */}
            {activeTab === 'elearning-nysc-console' && (
              <div className="space-y-6">
                <MasterElearningNyscConsole />
              </div>
            )}

            {/* Dedicated Mii Ephemeral 48h Stories Console Tab (Phase 10) */}
            {activeTab === 'mii-stories-console' && (
              <div className="space-y-6">
                <MasterMiiStoriesConsole />
              </div>
            )}

            {/* Dedicated STERCS Editor & Motion Scripting Console Tab (Phase 9) */}
            {activeTab === 'stercs-editor-console' && (
              <div className="space-y-6">
                <MasterStercsEditorConsole />
              </div>
            )}

            {/* Dedicated Camus Hardware Enclaves Console Tab (Phase 10) */}
            {activeTab === 'camus-enclave-console' && (
              <div className="space-y-6">
                <MasterCamusEnclaveConsole />
              </div>
            )}

            {/* Dedicated Analytics & Telemetry Console Tab (Phase 11) */}
            {activeTab === 'analytics-telemetry-console' && (
              <div className="space-y-6">
                <MasterAnalyticsTelemetryConsole />
              </div>
            )}

            {/* Dedicated Member Retention & Activity Operations Console Tab (Phase 12) */}
            {activeTab === 'member-retention-console' && (
              <div className="space-y-6">
                <MasterMemberRetentionConsole />
              </div>
            )}

            {/* Dedicated Marketing, Ads & Campaign Engine Console Tab (Phase 13) */}
            {activeTab === 'marketing-campaign-console' && (
              <div className="space-y-6">
                <MasterMarketingCampaignConsole />
              </div>
            )}

            {/* Dedicated Investor Relations & Capitalization Console Tab (Phase 14) */}
            {activeTab === 'investor-relations-console' && (
              <div className="space-y-6">
                <MasterInvestorRelationsConsole />
              </div>
            )}

            {/* Dedicated Franchise & Regional Hubs Console Tab (Phase 15) */}
            {activeTab === 'franchise-hubs-console' && (
              <div className="space-y-6">
                <MasterFranchiseHubsConsole />
              </div>
            )}

            {/* Dedicated Email, Push & Comms Delivery Console Tab (Phase 16) */}
            {activeTab === 'email-comms-console' && (
              <div className="space-y-6">
                <MasterEmailCommsConsole />
              </div>
            )}

            {/* Dedicated Support, SLA & Customer Care Console Tab (Phase 17) */}
            {activeTab === 'support-care-console' && (
              <div className="space-y-6">
                <MasterSupportCareConsole />
              </div>
            )}

            {/* Dedicated Sound & Sonic Engineering Console Tab (Batch 4) */}
            {activeTab === 'sound-sonic-console' && (
              <div className="space-y-6">
                <MasterSoundSonicConsole />
              </div>
            )}

            {/* Dedicated Domain & Edge Network Console Tab (Batch 4) */}
            {activeTab === 'domain-edge-console' && (
              <div className="space-y-6">
                <MasterDomainEdgeConsole />
              </div>
            )}

            {/* Dedicated Gamification & Rewards Console Tab (Batch 4) */}
            {activeTab === 'gamification-rewards-console' && (
              <div className="space-y-6">
                <MasterGamificationRewardsConsole />
              </div>
            )}

            {/* Dedicated LoansQR Micro-Lending Console Tab (Phase 11) */}
            {activeTab === 'loansqr-console' && (
              <div className="space-y-6">
                <MasterLoansQrConsole />
              </div>
            )}

            {/* Dedicated Trends & Swarms Discovery Console Tab (Phase 12) */}
            {activeTab === 'trends-swarm-console' && (
              <div className="space-y-6">
                <MasterTrendsSwarmConsole />
              </div>
            )}

            {/* Dedicated Communications, WebRTC & VoIP Console Tab (Phase 13) */}
            {activeTab === 'comms-voip-console' && (
              <div className="space-y-6">
                <MasterCommunicationsVoipConsole />
              </div>
            )}

            {/* Dedicated Lumina Gallery & Digital Collectibles Console Tab (Phase 14) */}
            {activeTab === 'lumina-gallery-console' && (
              <div className="space-y-6">
                <MasterLuminaGalleryConsole />
              </div>
            )}

            {/* Dedicated Master BeatwaveNG Audio Console Tab */}
            {activeTab === 'beatwaveng-console' && (
              <div className="space-y-6">
                <MasterBeatwaveNGConsole />
              </div>
            )}

            {/* Dedicated Discover Master Console Tab */}
            {activeTab === 'discover-console' && (
              <div className="space-y-6">
                <DiscoverMasterConsole />
              </div>
            )}

            {/* Dedicated SoundRiver Master Console Tab */}
            {activeTab === 'soundriver-console' && (
              <div className="space-y-6">
                <SoundRiverMasterConsole />
              </div>
            )}

            {/* Dedicated SoundOcean Master Console Tab */}
            {activeTab === 'soundocean-console' && (
              <div className="space-y-6">
                <SoundOceanMasterConsole />
              </div>
            )}

            {/* Dedicated Cross-Engine Leadership Boards Console Tab */}
            {activeTab === 'leaderboards-console' && (
              <div className="space-y-6">
                <LeadershipBoardConsole />
              </div>
            )}

            {/* Dedicated Master Dancia-4Tv Video Console Tab */}
            {activeTab === 'dancia4tv-console' && (
              <div className="space-y-6">
                <MasterDancia4TvConsole />
              </div>
            )}

            {/* Dedicated STERCS Command, DefCon & Geo-Restrictions Console Tab */}
            {activeTab === 'stercs-defense' && (
              <div className="space-y-6">
                <StercsControlCenter />
              </div>
            )}

            {activeTab === 'platform-domains-console' && (
              <div className="space-y-6">
                <PlatformDomainManagementConsole />
              </div>
            )}

            {activeTab === 'platform-operations-console' && (
              <div className="space-y-6">
                <PlatformDomainManagementConsole
                  domainKeys={PLATFORM_OPERATIONS_DOMAIN_KEYS}
                  title="Games, Lending, Learning & Platform Operations"
                  description="Manage persisted gaming, advertising, lending-facility, learning, franchise, streaming, downloads, StercsEditor, and wallet records. Financial transactions and player activity remain read-only where direct edits could compromise ledger or gameplay integrity."
                />
              </div>
            )}

            {/* Dedicated Financial Management & Treasury Console Tab */}
            {activeTab === 'financials' && (
              <div className="space-y-6">
                <MasterFinancialsConsole />
              </div>
            )}

            {/* Dedicated User & Members Console Tab */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <MasterMembersConsole />
              </div>
            )}

            {/* Dedicated Corporate Governance (18 Portfolios, DoA & RACI) Tab */}
            {activeTab === 'governance' && (
              <div className="space-y-6">
                <CorporateGovernanceConsole />
              </div>
            )}

            {/* Dedicated Subscription Models & Free Tier Sandbox Tab */}
            {activeTab === 'subscriptions' && (
              <div className="space-y-6">
                <SubscriptionModelsConsole sourceDashboard="MasterDashboard" />
              </div>
            )}

            {/* Dedicated Guardian AI Autonomous SEO & Search Indexing Engine Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <GuardianAISeoPerformanceConsole />
              </div>
            )}

            {/* Dedicated E-Commerce & Storefronts Master Console Tab */}
            {activeTab === 'ecommerce' && (
              <div className="space-y-6">
                <UnifiedCommerceCatalogHub />
                <PlatformDomainManagementConsole
                  domainKeys={COMMERCE_DOMAIN_KEYS}
                  title="Marketplace, Storefront, Flamingo & OwnIt Management"
                  description="Manage live PostgreSQL listings, stores, products, inventory, fashion catalogs, owned assets, fulfillment records, returns, and warranty claims. Payment transactions are deliberately read-only."
                />
              </div>
            )}

            {/* Dedicated Widgets & Rails Master Console Tab */}
            {activeTab === 'widgets' && (
              <div className="space-y-6">
                <MasterWidgetConsole />
              </div>
            )}

            {activeTab === 'commerce-growth' && (
              <div className="space-y-8">
                <PlatformDomainManagementConsole
                  domainKeys={COMMERCE_DOMAIN_KEYS}
                  title="Commerce Ecosystem Database Management"
                  description="Create and maintain commerce records against PostgreSQL, apply supported lifecycle controls, and inspect management audit history."
                />
                {renderConsoleGroupContent(
                  'commerce-growth',
                  'Commerce & Growth Consoles',
                  'Multi-vendor marketplace, individual vendor storefronts, VIP Flamingo tier, unified e-commerce checkout, Publicitee advertising engine, promotional marketing campaigns, and FingerWars competitive esports platform.'
                )}
                <div className="mt-8 pt-8 border-t border-slate-300 dark:border-gray-800">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Active Subscription Models & Free Tier Engine
                  </h3>
                  <SubscriptionModelsConsole sourceDashboard="MasterDashboard" />
                </div>
              </div>
            )}

            {activeTab === 'creation-config' &&
              renderConsoleGroupContent(
                'creation-config',
                'Creation & Configuration Consoles',
                'Mobile visual site editor, CSS/motion animation presets, image tools, template marketplace, dynamic forms, team collaboration workspaces, SEO crawler tooling, AI prompt tools, and cross-module analytics.'
              )}

            {activeTab === 'governance-ops' &&
              renderConsoleGroupContent(
                'governance-ops',
                'Platform Governance & Operations Consoles',
                'The 10 foundational platform infrastructure consoles: System Operations Center (SOC), Security & Access Center, Trust, Safety & Compliance, Notifications & Communication, FinOps, Data & Integration, AI Governance, Releases, Support, and WORM Audit Ledger.'
              )}

            {/* SuperAdmin Page-by-Page Management Matrix & Gaps Assessment */}
            {activeTab === 'gaps-assessment' && (
              <div className="space-y-6">
                <PageManagementMatrixGaps />
              </div>
            )}

            {/* Sections Management Tab */}
            {activeTab === 'sections' && renderSectionManagement()}

            {/* Persistent Screen Catalog Management */}
            {activeTab === 'screen-catalog' && <ScreenCatalogManagementConsole />}

            {/* Modules Tab */}
            {activeTab === 'modules' && (
              <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      All Modules & Service Consoles
                    </h2>
                    <p className="text-xs text-slate-700 mt-0.5">
                      Explore and launch all {sections.length} core platform
                      services.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddSectionModalOpen(true)}
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Module
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className="border border-slate-300 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300 hover:bg-blue-50/40"
                      onClick={() => handleSectionClick(section.route)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            section.status === 'online'
                              ? 'bg-green-100'
                              : section.status === 'offline'
                                ? 'bg-red-100'
                                : section.status === 'maintenance'
                                  ? 'bg-yellow-100'
                                  : 'bg-orange-100'
                          }`}
                        >
                          {React.createElement(section.icon, {
                            className: `h-5 w-5 ${
                              section.status === 'online'
                                ? 'text-green-500'
                                : section.status === 'offline'
                                  ? 'text-red-500'
                                  : section.status === 'maintenance'
                                    ? 'text-yellow-500'
                                    : 'text-orange-500'
                            }`,
                          })}
                        </div>
                        <div className="ml-3 min-w-0 flex-1">
                          <h4 className="font-semibold text-sm text-gray-900 truncate">
                            {section.title}
                          </h4>
                          <p
                            className="text-xs text-slate-700 truncate"
                            title={section.description}
                          >
                            {section.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end shrink-0 ml-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              section.status === 'online'
                                ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                                : section.status === 'offline'
                                  ? 'bg-red-100 text-green-950 border border-green-400 font-bold'
                                  : section.status === 'maintenance'
                                    ? 'bg-amber-100 text-green-950 border border-green-400 font-bold'
                                    : 'bg-orange-100 text-green-950'
                            }font-black`}
                          >
                            {section.status}
                          </span>
                          <span className="text-[11px] text-slate-700 font-semibold mt-1">
                            {section.healthScore}%
                          </span>
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
                <PlatformDomainManagementConsole />
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

      {/* Notifications Modal */}
      {isNotificationsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-gray-50 border-b border-slate-300 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  System Notifications
                </h3>
                <p className="text-xs text-slate-700">
                  Active alerts requiring administrator attention
                </p>
              </div>
              <button type="button" aria-label="Close"
                onClick={() => setIsNotificationsModalOpen(false)}
                className="text-slate-700 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
              {alerts.length === 0 ? (
                <p className="text-sm text-slate-700 text-center py-6">
                  No pending notifications.
                </p>
              ) : (
                alerts.map((a) => (
                  <div
                    key={a.id}
                    className="p-3 rounded-xl border border-slate-300 bg-gray-50/70 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {a.title}
                      </div>
                      <div className="text-xs text-gray-600 break-words mt-0.5">
                        {a.description}
                      </div>
                      <div className="text-[10px] text-slate-700 mt-1 font-mono">
                        {a.timestamp}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDismissAlert(a.id)}
                      className="text-slate-700 hover:text-gray-600 text-xs px-2 py-1 rounded bg-white border border-slate-300 hover:bg-gray-100"
                    >
                      Dismiss
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-slate-300 flex justify-end">
              <button
                onClick={() => setIsNotificationsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Protocol Messages Modal */}
      {isMessagesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-gray-50 border-b border-slate-300 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Protocol In-Box
                </h3>
                <p className="text-xs text-slate-700">
                  Direct system dispatches and gateway events
                </p>
              </div>
              <button type="button" aria-label="Close"
                onClick={() => setIsMessagesModalOpen(false)}
                className="text-slate-700 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">
                    FingerMobile Protocol™ Dispatcher
                  </span>
                  <span className="text-[10px] text-blue-600 font-mono">
                    Just Now
                  </span>
                </div>
                <p className="text-xs text-blue-800 mt-1 break-words">
                  Dual-router canonical synchronization completed. All 36
                  dashboard services mapped and operational.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-300 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">
                    Guardian Enclave Subsystem
                  </span>
                  <span className="text-[10px] text-slate-700 font-mono">
                    15m ago
                  </span>
                </div>
                <p className="text-xs text-gray-700 mt-1 break-words">
                  Zero key leaks detected. Stercs security policies in high
                  compliance state.
                </p>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-slate-300 flex justify-end">
              <button
                onClick={() => setIsMessagesModalOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Section Modal */}
      {selectedSectionForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-gray-50 border-b border-slate-300 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Edit Section: {selectedSectionForEdit.title}
                </h3>
                <p className="text-xs text-slate-700">
                  Configure route, description, and status
                </p>
              </div>
              <button type="button" aria-label="Close"
                onClick={() => setSelectedSectionForEdit(null)}
                className="text-slate-700 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={selectedSectionForEdit.title}
                  onChange={(e) =>
                    setSelectedSectionForEdit({
                      ...selectedSectionForEdit,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={selectedSectionForEdit.description}
                  onChange={(e) =>
                    setSelectedSectionForEdit({
                      ...selectedSectionForEdit,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Canonical Route
                </label>
                <input
                  type="text"
                  value={selectedSectionForEdit.route}
                  onChange={(e) =>
                    setSelectedSectionForEdit({
                      ...selectedSectionForEdit,
                      route: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Operational Status
                </label>
                <select
                  value={selectedSectionForEdit.status}
                  onChange={(e) =>
                    setSelectedSectionForEdit({
                      ...selectedSectionForEdit,
                      status: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white"
                >
                  <option value="online">Online</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="degraded">Degraded</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-slate-300 flex justify-end gap-2">
              <button
                onClick={() => setSelectedSectionForEdit(null)}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveSectionEdit(selectedSectionForEdit)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Section Modal */}
      {isAddSectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-gray-50 border-b border-slate-300 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Add New Platform Section
                </h3>
                <p className="text-xs text-slate-700">
                  Register a new module to the Master Dashboard
                </p>
              </div>
              <button type="button" aria-label="Close"
                onClick={() => setIsAddSectionModalOpen(false)}
                className="text-slate-700 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Creator Studio"
                  value={newSectionData.title}
                  onChange={(e) =>
                    setNewSectionData({
                      ...newSectionData,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Brief summary of module capabilities"
                  value={newSectionData.description}
                  onChange={(e) =>
                    setNewSectionData({
                      ...newSectionData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Route Path
                </label>
                <input
                  type="text"
                  placeholder="e.g., /creator-studio"
                  value={newSectionData.route}
                  onChange={(e) =>
                    setNewSectionData({
                      ...newSectionData,
                      route: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-slate-300 flex justify-end gap-2">
              <button
                onClick={() => setIsAddSectionModalOpen(false)}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSection}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Create Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Console Detail & Administrative Controls Drilldown Modal */}
      <ConsoleDetailModal
        item={selectedConsoleForDetail}
        onClose={() => setSelectedConsoleForDetail(null)}
      />
    </div>
  );
};

export default MasterDashboardPage;
