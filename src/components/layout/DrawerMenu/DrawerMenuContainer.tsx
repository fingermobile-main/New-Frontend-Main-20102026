import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DRAWER_MENU_CONFIG } from '../../../config/drawerMenuConfig';
import userProfileSyncService from '../../../services/UserProfileSyncService';
import { useAuth } from '../../../contexts/AuthContext';
import {
  getUserRoleTier,
  canAccessMasterDashboard,
  canAccessDashboard,
  isDashboardRoute,
  getUserRoleBadge,
  getAuthorizedDashboardPath,
  isContentCreator,
  isBusinessEntity
} from '../../../services/platformRbac';
import {
  Search,
  ChevronDown,
  ChevronRight,
  X,
  Lock,
  Crown,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  FileText,
  MessageSquare,
  Gift,
  ShoppingBag,
  Music,
  Users,
  Shield,
  Bot,
  User,
  Settings,
  Wallet,
  Sparkles,
  Flame,
  EyeOff,
  Radio,
  Star
} from 'lucide-react';

interface DrawerMenuContainerProps {
  isOpen: boolean;
  onClose: () => void;
  isDesktopSidebar?: boolean;
}

const QUICK_CREATE_ITEMS = [
  {
    id: 'create-post',
    title: 'Create Post',
    description: 'Share updates, media or insights to the feed',
    icon: FileText,
    path: '/forum',
    color: 'from-blue-500 to-indigo-600',
    iconColor: 'text-blue-500'
  },
  {
    id: 'create-forum-topic',
    title: 'Discussion Topic',
    description: 'Start a debate in the 60 forum categories',
    icon: MessageSquare,
    path: '/forum?create=true',
    color: 'from-amber-500 to-orange-600',
    iconColor: 'text-amber-500'
  },
  {
    id: 'mint-lushpin',
    title: 'Mint / Gift LushPin',
    description: 'Send comforting pressie or minted pin to friends',
    icon: Gift,
    path: '/gems',
    color: 'from-pink-500 to-rose-600',
    iconColor: 'text-pink-500'
  },
  {
    id: 'launch-product',
    title: 'Store Product',
    description: 'List digital or physical item on Storefront',
    icon: ShoppingBag,
    path: '/storefront',
    color: 'from-emerald-500 to-teal-600',
    iconColor: 'text-emerald-500'
  },
  {
    id: 'drop-beatwave',
    title: 'Beatwave Audio',
    description: 'Upload audio stem, podcast or sovereign sound',
    icon: Music,
    path: '/beatwave',
    color: 'from-purple-500 to-violet-600',
    iconColor: 'text-purple-500'
  },
  {
    id: 'create-group',
    title: 'Community Group',
    description: 'Launch role-based group or hallmark enclave',
    icon: Users,
    path: '/groups',
    color: 'from-cyan-500 to-blue-600',
    iconColor: 'text-cyan-500'
  },
  {
    id: 'guardian-audit',
    title: 'Guardian AI Audit',
    description: 'Run platform security & spend cap evaluation',
    icon: Shield,
    path: '/admin',
    color: 'from-red-500 to-orange-600',
    iconColor: 'text-red-500'
  },
  {
    id: 'ai-prompt-console',
    title: 'AI Platform Director',
    description: 'Instruct Gemini AI for daily management',
    icon: Bot,
    path: '/master-dashboard',
    color: 'from-indigo-500 to-purple-600',
    iconColor: 'text-indigo-500'
  }
];

export const DrawerMenuContainer: React.FC<DrawerMenuContainerProps> = ({
  isOpen,
  onClose,
  isDesktopSidebar = false
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'explore' | 'create'>('explore');

  // Load sovereign user profile
  const [profile, setProfile] = useState(() => userProfileSyncService.getProfile());
  const [isRadiating, setIsRadiating] = useState(true);
  const [isIncognito, setIsIncognito] = useState(false);
  const [isRewardsExpanded, setIsRewardsExpanded] = useState(true);

  useEffect(() => {
    const unsub = userProfileSyncService.subscribe((updated) => setProfile(updated));
    return unsub;
  }, []);

  const { user } = useAuth();
  const path = (location.pathname || (typeof window !== 'undefined' ? window.location.pathname : '')).toLowerCase();
  const isAuthOrOnboardingRoute = 
    path === '/login' ||
    path === '/register' ||
    path === '/admin' ||
    path === '/adminlogin' ||
    path === '/verification' ||
    path === '/official-verification' ||
    path === '/securitysetup' ||
    path === '/changepassword' ||
    path === '/forgot-password' ||
    path === '/onboarding' ||
    path.startsWith('/auth') ||
    path.includes('/login') ||
    path.includes('/register') ||
    path.includes('/onboarding') ||
    path.includes('/adminlogin');

  const isOnboarded = Boolean(
    user &&
    (user.onboardingComplete || (user as any).onboarding_completed) &&
    (localStorage.getItem('onboardingComplete') === 'true' || localStorage.getItem('hasCompletedOnboarding') === 'true')
  );

  // Strict Security Rule: Never display menu under any circumstance until perfectly onboarded and outside auth/onboarding routes
  if (isAuthOrOnboardingRoute || !isOnboarded) {
    return null;
  }

  const roleTier = getUserRoleTier(user);
  const roleBadge = getUserRoleBadge(user);
  const canAccessMaster = canAccessMasterDashboard(user);
  const authorizedDashboardPath = getAuthorizedDashboardPath(user);

  // Track open accordion categories - expand all by default
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'executive-dashboards': true,
    'sovereign-governance': true,
    'community-social': true,
    'media-entertainment': true,
    'commerce-stores': true,
    'creative-ugc': true,
    'finance-monetization': true,
    'system-engagement': true
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const isActive = (path: string) => location.pathname === path;

  // Filter menu items by search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return DRAWER_MENU_CONFIG;

    const query = searchQuery.toLowerCase();
    return DRAWER_MENU_CONFIG.map((cat) => {
      const matchingItems = cat.items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
      );
      return {
        ...cat,
        items: matchingItems
      };
    }).filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  const getBadgeStyle = (type?: 'primary' | 'success' | 'warning' | 'danger' | 'info') => {
    switch (type) {
    case 'danger':
      return 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold';
    case 'warning':
      return 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold';
    case 'success':
      return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold';
    case 'info':
      return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold';
    case 'primary':
    default:
      return 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold';
    }
  };

  const renderContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 shadow-2xl border-r border-slate-800 overflow-hidden">
      {/* 1. TOP HEADER & CLOSE BUTTON */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl overflow-hidden bg-white/10 p-0.5 border border-orange-500/40 flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
            <img
              src="/assets/branding/fingermobile/logo-orange.webp"
              alt="FingerMobile Orange Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/branding/fingermobile/FingerMobile orange logo.webp';
              }}
            />
          </div>
          <div>
            <h2 className="font-bold text-white tracking-wide text-sm leading-tight flex items-center gap-1.5">
              FingerMobile Protocol
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-500/30 text-orange-300 border border-orange-500/50 font-bold">
                Menu
              </span>
            </h2>
            <p className="text-xs text-slate-200 font-bold">
              385 Sovereign Pages • 6 Core Clusters
            </p>
          </div>
        </div>

        {!isDesktopSidebar && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 2. FingerMobile MERGED MEMBER PROFILE & REWARDS CARD */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Cover Graphic Strip with Radiating Active Pulse */}
        <div className="h-16 bg-gradient-to-r from-emerald-600 via-teal-700 to-orange-600 relative px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white font-black">
              Sovereign Identity
            </span>
          </div>
          {/* Radiating Active Badge & Quick Toggle */}
          <button
            type="button"
            onClick={() => setIsRadiating((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
              isRadiating
                ? 'bg-emerald-950/85 text-emerald-300 border-emerald-400/50 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-900/90 text-slate-200 border-slate-600'
            }`}
            title="Toggle Radiating Active Status"
          >
            <span className={`w-2 h-2 rounded-full ${isRadiating ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'}`} />
            <span>{isRadiating ? 'Radiating Active' : 'Beacon Inactive'}</span>
          </button>
        </div>

        {/* Member Profile Main Container */}
        <div className="px-3.5 pb-3.5 pt-0 relative">
          <div className="flex items-start gap-3 -mt-6">
            {/* Clickable Profile Avatar -> Opens Profile Wall */}
            <Link
              to="/profile"
              onClick={() => !isDesktopSidebar && onClose()}
              className="relative shrink-0 group focus:outline-none"
              title="Click to open Member Profile Page / Wall"
            >
              <img
                src={(user && profile.avatar) || (user as any)?.avatar || '/assets/branding/default-avatar.svg'}
                alt={((user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username) || 'Member Profile Wall')}
                className="w-14 h-14 rounded-2xl object-cover ring-3 ring-orange-500/90 shadow-xl group-hover:scale-105 transition-transform bg-slate-900"
              />
              <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-slate-950 ${isIncognito ? 'bg-purple-500' : 'bg-emerald-500'}`} />
              <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] text-white font-bold backdrop-blur-xs">
                Wall →
              </div>
            </Link>

            <div className="flex-1 min-w-0 pt-7">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  to="/profile"
                  onClick={() => !isDesktopSidebar && onClose()}
                  className="font-black text-sm text-white hover:text-orange-400 transition-colors truncate"
                  title="Click to view full Profile Wall"
                >
                  {(user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username) || (user ? profile.name : '') || 'Sovereign Member'}
                </Link>
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${roleBadge.badgeClass}`}>
                  {roleBadge.label}
                </span>
              </div>

              {/* 5-Star Reputation Rating */}
              <div className="flex items-center gap-1 mt-0.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-slate-200 font-bold truncate max-w-[180px]">
                  {user?.email || (user?.username ? `@${user.username}` : (user ? `@${profile.username}` : '@member'))}
                </span>
              </div>

              <p className="text-xs text-slate-100 font-semibold truncate mt-0.5">
                {roleTier === 'PRIMARY_SUPER_ADMIN'
                  ? 'Founder & SuperAdmin | FingerMobile Protocol'
                  : roleTier === 'SECONDARY_ADMIN_CFO'
                    ? 'CFO & Co-Founder | FingerMobile Protocol'
                    : ((user && profile.headline) || (user as any)?.headline || 'Sovereign Member | FingerMobile Protocol')}
              </p>

              {/* Consent Verified PIN & Security Grid */}
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Consent Verified PIN: ••91
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/50 text-sky-300">
                  STERCS™ Active
                </span>
              </div>
            </div>
          </div>

          {/* PROTOCOL REWARDS & XP PROGRESS ACCORDION */}
          <div className="mt-3 rounded-xl bg-slate-950 border border-slate-700/80 p-2.5 shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-white flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                Protocol Rewards
              </span>
              <button
                type="button"
                onClick={() => setIsRewardsExpanded((prev) => !prev)}
                className="text-[10px] font-black text-orange-400 hover:text-orange-300 flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-orange-500/15 border border-orange-500/40"
              >
                <span>Level 5</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isRewardsExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* XP Progress Bar */}
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-100 mb-1">
                <span>XP Progress</span>
                <span className="text-orange-400 font-mono font-black">850 / 1000 XP</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                <div className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-orange-500 rounded-full w-[85%]" />
              </div>
            </div>

            {isRewardsExpanded && (
              <>
                {/* 2 Key Balances: FIC Coins & Daily Streak */}
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 flex items-center gap-2">
                    <span className="text-base">🪙</span>
                    <div>
                      <div className="text-[11px] font-black font-mono text-amber-300">2,850 FIC</div>
                      <div className="text-[9px] text-slate-200 font-bold uppercase tracking-wider">Coins Balance</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <div>
                      <div className="text-[11px] font-black text-orange-400">14 Days</div>
                      <div className="text-[9px] text-slate-200 font-bold uppercase tracking-wider">Daily Streak</div>
                    </div>
                  </div>
                </div>

                {/* Radar & Incognito Quick Toggles */}
                <div className="grid grid-cols-2 gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsRadiating((prev) => !prev)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                      isRadiating
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/60 shadow-xs'
                        : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-emerald-400" />
                      Radiate Radar
                    </span>
                    <span className="font-black px-1.5 py-0.2 rounded bg-slate-800 text-white">{isRadiating ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsIncognito((prev) => !prev)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                      isIncognito
                        ? 'bg-purple-950/60 text-purple-300 border-purple-500/60 shadow-xs'
                        : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <EyeOff className="w-3.5 h-3.5 text-purple-400" />
                      Incognito
                    </span>
                    <span className="font-black px-1.5 py-0.2 rounded bg-slate-800 text-white">{isIncognito ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Quick Profile Shortcuts */}
          <div className="grid grid-cols-4 gap-1.5 mt-2.5 pt-2 border-t border-slate-800/80">
            <Link
              to="/profile"
              onClick={() => !isDesktopSidebar && onClose()}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-100 hover:text-white transition-all text-center group shadow-xs"
              title="Open Sovereign Member Profile Wall"
            >
              <User className="w-4 h-4 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-200 group-hover:text-white">Wall</span>
            </Link>
            {authorizedDashboardPath ? (
              <Link
                to={authorizedDashboardPath}
                onClick={() => !isDesktopSidebar && onClose()}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-100 hover:text-white transition-all text-center group shadow-xs"
                title={
                  canAccessMaster
                    ? 'Master Dashboard (Executive Access Granted)'
                    : isContentCreator(user)
                      ? 'Creator Studio Dashboard'
                      : isBusinessEntity(user)
                        ? 'Business Hub & Offices'
                        : 'Your Assigned Dashboard'
                }
              >
                <Sparkles className="w-4 h-4 text-orange-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-slate-200 group-hover:text-white">
                  {canAccessMaster ? 'Dashboard' : isContentCreator(user) ? 'Studio' : isBusinessEntity(user) ? 'Business' : 'Dashboard'}
                </span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  alert('Dashboard access restricted. Only Primary Admins, CFO/Co-Founders, Content Creators, or explicitly assigned members have dashboard access.');
                }}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-500 cursor-not-allowed transition-all text-center group shadow-xs opacity-60 hover:opacity-80"
                title="Dashboard access restricted by RBAC"
              >
                <Lock className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-[11px] font-bold text-slate-400">Dashboard</span>
              </button>
            )}
            <Link
              to="/wallet"
              onClick={() => !isDesktopSidebar && onClose()}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-100 hover:text-white transition-all text-center group shadow-xs"
            >
              <Wallet className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-200 group-hover:text-white">Wallet</span>
            </Link>
            <Link
              to="/settings-hub"
              onClick={() => !isDesktopSidebar && onClose()}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-100 hover:text-white transition-all text-center group shadow-xs"
            >
              <Settings className="w-4 h-4 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-200 group-hover:text-white">Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. MOBILE TABS TOGGLE (Explore vs Create) */}
      <div className="flex md:hidden border-b border-slate-800 bg-slate-950 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('explore')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'explore'
              ? 'bg-orange-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white font-semibold'
          }`}
        >
          Explore Ecosystem
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'create'
              ? 'bg-orange-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white font-semibold'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Create Hub
        </button>
      </div>

      {/* 4. DUAL COLUMN BODY (FingerMobile Mega Menu on md+ screens) */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* LEFT COLUMN: Categorical Navigation & Search */}
        <div className={`flex-1 flex flex-col min-w-0 border-r border-slate-800 overflow-hidden ${
          activeTab === 'explore' ? 'flex' : 'hidden md:flex'
        }`}>
          {/* Search Box */}
          <div className="p-3 border-b border-slate-800 bg-slate-950">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-orange-600 z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 385 pages, features..."
                className="w-full pl-9 pr-14 py-2.5 text-xs rounded-xl bg-white border-2 border-slate-300 text-slate-900 placeholder:text-slate-400 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-sans shadow-sm border"
                style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-md font-bold cursor-pointer transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Accordion Categories */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
            {filteredCategories.length === 0 ? (
              <div className="py-8 text-center px-4">
                <p className="text-xs text-slate-300 font-semibold">
                  No matching pages or features found for "{searchQuery}"
                </p>
              </div>
            ) : (
              filteredCategories.map((cat) => {
                const isExpanded = expandedCategories[cat.id] || !!searchQuery.trim();

                return (
                  <div
                    key={cat.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => toggleCategory(cat.id)}
                      className="w-full px-3.5 py-2.5 flex items-center justify-between bg-slate-800/70 hover:bg-slate-800 transition-colors text-left border-b border-slate-800/50"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <span className="text-xs font-black uppercase tracking-wider text-orange-400 truncate">
                          {cat.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-100 font-bold border border-slate-700">
                          {cat.items.length}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-300 shrink-0 ml-1" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 ml-1" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-1 space-y-1">
                        {cat.items.map((item) => {
                          const active = isActive(item.path);
                          const isDashboard = isDashboardRoute(item.path);
                          const hasDashboardAccess = canAccessDashboard(item.path, user);
                          const isRestrictedDashboard = isDashboard && !hasDashboardAccess;

                          if (isRestrictedDashboard) {
                            return (
                              <div
                                key={item.id}
                                onClick={() => {
                                  alert(`Access to "${item.title}" is restricted by Platform RBAC. Contact Primary Admin (SuperAdmin) or CFO for dashboard assignment.`);
                                }}
                                className="group flex items-start justify-between p-2 rounded-lg text-xs bg-slate-950/60 border border-slate-800/80 text-slate-400 cursor-not-allowed opacity-60 hover:opacity-85 transition-opacity"
                                title="Access Restricted: Executive or Assigned RBAC Required"
                              >
                                <div className="flex items-start space-x-2.5 min-w-0 flex-1">
                                  <div className="mt-0.5 shrink-0">
                                    <Lock className="w-3.5 h-3.5 text-rose-400" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center space-x-1.5 flex-wrap">
                                      <span className="font-bold text-xs truncate text-slate-300">{item.title}</span>
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase bg-rose-950/70 text-rose-300 border border-rose-800/60">
                                        Disabled (RBAC)
                                      </span>
                                    </div>
                                    {item.description && (
                                      <p className="text-[11px] mt-0.5 line-clamp-1 leading-normal text-slate-500 font-medium">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <Link
                              key={item.id}
                              to={item.path}
                              onClick={() => !isDesktopSidebar && onClose()}
                              className={`group flex items-start justify-between p-2 rounded-lg text-xs transition-all ${
                                active
                                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
                                  : 'text-slate-100 hover:bg-slate-800/90 hover:text-white'
                              }`}
                            >
                              <div className="flex items-start space-x-2.5 min-w-0 flex-1">
                                <div className="mt-0.5 shrink-0">
                                  {item.logoUrl ? (
                                    <img
                                      src={item.logoUrl}
                                      alt={item.title}
                                      className="w-4 h-4 rounded object-contain bg-slate-900/40 p-0.5 border border-slate-700/60 shadow-sm"
                                    />
                                  ) : item.isPrivate ? (
                                    <Lock className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-rose-400'}`} />
                                  ) : item.requiresPaidPlan ? (
                                    <Crown className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-amber-400'}`} />
                                  ) : (
                                    <ArrowRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'text-white' : 'text-orange-400'}`} />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center space-x-1.5 flex-wrap">
                                    <span className="font-bold text-xs truncate text-white">{item.title}</span>
                                    {item.badge && (
                                      <span
                                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                                          active
                                            ? 'bg-white/20 text-white border border-white/30'
                                            : getBadgeStyle(item.badge.type)
                                        }`}
                                      >
                                        {item.badge.text}
                                      </span>
                                    )}
                                  </div>
                                  {item.description && (
                                    <p
                                      className={`text-[11px] mt-0.5 line-clamp-1 leading-normal ${
                                        active ? 'text-white/95 font-medium' : 'text-slate-200 font-medium'
                                      }`}
                                    >
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: FingerMobile "Create & Quick Actions" Panel */}
        <div className={`w-full md:w-72 md:shrink-0 flex flex-col bg-slate-950/70 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 ${
          activeTab === 'create' ? 'flex' : 'hidden md:flex'
        }`}>
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
              <PlusCircle className="w-3.5 h-3.5 text-orange-400" />
              Create & Quick Actions
            </span>
            <span className="text-[11px] text-slate-300 font-mono font-semibold">FingerMobile</span>
          </div>

          <div className="space-y-2">
            {QUICK_CREATE_ITEMS.map((q) => {
              const IconComp = q.icon;
              const isMasterDirector = q.path === '/master-dashboard';
              const isAdminAudit = q.path === '/admin';
              const isExecutiveRequired = isMasterDirector || isAdminAudit;
              const hasAccess = isMasterDirector
                ? canAccessMaster
                : isAdminAudit
                  ? (roleTier === 'PRIMARY_SUPER_ADMIN' || roleTier === 'SECONDARY_ADMIN_CFO')
                  : true;

              if (isExecutiveRequired && !hasAccess) {
                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      alert(`Access to "${q.title}" requires Executive RBAC (Primary Admin or CFO/Co-Founder).`);
                    }}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-900 text-slate-500 cursor-not-allowed opacity-50 hover:opacity-75 transition-opacity"
                    title="Executive RBAC required"
                  >
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 shrink-0">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-black text-slate-400">
                          {q.title}
                        </h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase bg-rose-950/60 text-rose-300 border border-rose-800/50">
                          Locked
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed mt-0.5">
                        {q.description}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={q.id}
                  to={q.path}
                  onClick={() => !isDesktopSidebar && onClose()}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 transition-all group"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-tr ${q.color} text-white shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-black text-white group-hover:text-orange-300 transition-colors">
                      {q.title}
                    </h4>
                    <p className="text-[11px] text-slate-200 font-medium line-clamp-2 leading-relaxed mt-0.5">
                      {q.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. FOOTER */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-slate-200">Live Network Consensus</span>
        </div>
        <span className="font-mono text-[10px] bg-slate-800 text-slate-100 px-2 py-0.5 rounded-md font-bold border border-slate-700">
          v2.5.0 • 385 Screens
        </span>
      </div>
    </div>
  );

  if (isDesktopSidebar) {
    return <aside className="w-80 h-screen sticky top-0 shrink-0">{renderContent()}</aside>;
  }

  return (
    <>
      {/* Drawer Overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[99998] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-Over Drawer Content */}
      <div
        className={`fixed inset-y-0 left-0 z-[99999] w-full sm:w-[500px] md:w-[740px] lg:w-[840px] max-w-[95vw] transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderContent()}
      </div>
    </>
  );
};

export default DrawerMenuContainer;
