import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DRAWER_MENU_CONFIG } from '../../../config/drawerMenuConfig';
import userProfileSyncService from '../../../services/UserProfileSyncService';
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
  Sparkles
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

  useEffect(() => {
    const unsub = userProfileSyncService.subscribe((updated) => setProfile(updated));
    return unsub;
  }, []);

  // Track open accordion categories - expand all by default
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
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
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20';
    case 'warning':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
    case 'success':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
    case 'info':
      return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20';
    case 'primary':
    default:
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
    }
  };

  const renderContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 shadow-2xl border-r border-slate-800 overflow-hidden">
      {/* 1. TOP HEADER & CLOSE BUTTON */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-orange-500/20">
            FM
          </div>
          <div>
            <h2 className="font-bold text-white tracking-wide text-sm leading-tight flex items-center gap-1.5">
              FingerMobile Protocol
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                Menu
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              385 Sovereign Pages • 6 Core Clusters
            </p>
          </div>
        </div>

        {!isDesktopSidebar && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 2. FACEBOOK-STYLE MEMBER PROFILE CARD AT TOP OF MENU */}
      <div className="p-3.5 border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 relative">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
              alt={profile.name || 'User Profile'}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-orange-500/80 shadow-lg"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-white truncate">
                {profile.name || 'Israel Mbah'}
              </h3>
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                Lvl 3 Sovereign
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              @{profile.username || 'israel_protocol'} • {profile.headline || 'Protocol Architect'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                #PIN-{profile.pinNumber || '749822'}
              </span>
              <span className="text-[10px] text-slate-300">
                Quota: <strong className="text-orange-400">{profile.pinQuotaRemaining ?? 48}</strong> / {profile.pinQuotaMax ?? 50} Pins
              </span>
            </div>
          </div>
        </div>

        {/* Quick Profile Shortcuts */}
        <div className="grid grid-cols-4 gap-1.5 mt-3 pt-2.5 border-t border-slate-800/80">
          <Link
            to="/settings"
            onClick={() => !isDesktopSidebar && onClose()}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-center"
          >
            <User className="w-3.5 h-3.5 text-blue-400 mb-0.5" />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
          <Link
            to="/dashboard"
            onClick={() => !isDesktopSidebar && onClose()}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-center"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400 mb-0.5" />
            <span className="text-[10px] font-medium">Dashboard</span>
          </Link>
          <Link
            to="/gems"
            onClick={() => !isDesktopSidebar && onClose()}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-center"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400 mb-0.5" />
            <span className="text-[10px] font-medium">Wallet</span>
          </Link>
          <Link
            to="/settings"
            onClick={() => !isDesktopSidebar && onClose()}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-center"
          >
            <Settings className="w-3.5 h-3.5 text-purple-400 mb-0.5" />
            <span className="text-[10px] font-medium">Settings</span>
          </Link>
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
              : 'text-slate-400 hover:text-white'
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
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Create Hub
        </button>
      </div>

      {/* 4. DUAL COLUMN BODY (Facebook-Style Mega Menu on md+ screens) */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* LEFT COLUMN: Categorical Navigation & Search */}
        <div className={`flex-1 flex flex-col min-w-0 border-r border-slate-800 overflow-hidden ${
          activeTab === 'explore' ? 'flex' : 'hidden md:flex'
        }`}>
          {/* Search Box */}
          <div className="p-3 border-b border-slate-800/80 bg-slate-950/60">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 385 pages, features..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
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
                <p className="text-xs text-slate-400 font-medium">
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
                      className="w-full px-3.5 py-2.5 flex items-center justify-between bg-slate-800/60 hover:bg-slate-800 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-orange-400 truncate">
                          {cat.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                          {cat.items.length}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-1 space-y-1">
                        {cat.items.map((item) => {
                          const active = isActive(item.path);

                          return (
                            <Link
                              key={item.id}
                              to={item.path}
                              onClick={() => !isDesktopSidebar && onClose()}
                              className={`group flex items-start justify-between p-2 rounded-lg text-xs transition-all ${
                                active
                                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-md shadow-orange-500/20'
                                  : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
                              }`}
                            >
                              <div className="flex items-start space-x-2.5 min-w-0 flex-1">
                                <div className="mt-0.5 shrink-0">
                                  {item.isPrivate ? (
                                    <Lock className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-red-400'}`} />
                                  ) : item.requiresPaidPlan ? (
                                    <Crown className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-amber-400'}`} />
                                  ) : (
                                    <ArrowRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'text-white' : 'text-orange-400'}`} />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center space-x-1.5 flex-wrap">
                                    <span className="font-medium truncate">{item.title}</span>
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
                                      className={`text-[10px] mt-0.5 line-clamp-1 ${
                                        active ? 'text-white/80' : 'text-slate-400'
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

        {/* RIGHT COLUMN: Facebook-Style "Create & Quick Actions" Panel */}
        <div className={`w-full md:w-72 md:shrink-0 flex flex-col bg-slate-950/70 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 ${
          activeTab === 'create' ? 'flex' : 'hidden md:flex'
        }`}>
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <PlusCircle className="w-3.5 h-3.5 text-orange-400" />
              Create & Quick Actions
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Facebook Style</span>
          </div>

          <div className="space-y-2">
            {QUICK_CREATE_ITEMS.map((q) => {
              const IconComp = q.icon;
              return (
                <Link
                  key={q.id}
                  to={q.path}
                  onClick={() => !isDesktopSidebar && onClose()}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 transition-all group"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-tr ${q.color} text-white shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                      {q.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
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
      <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-300">Live Network Consensus</span>
        </div>
        <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-medium border border-slate-700">
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
