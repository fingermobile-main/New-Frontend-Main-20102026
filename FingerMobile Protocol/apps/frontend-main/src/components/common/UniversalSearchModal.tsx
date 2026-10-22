import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { router } from '../../app/AppRoutes';
import {
  Search,
  Sparkles,
  ShieldCheck,
  Compass,
  Radio,
  Music,
  ShoppingBag,
  DollarSign,
  Layers,
  Bot,
  ArrowRight,
  CornerDownLeft,
  X,
  FileText,
  Users,
  Video,
  Activity,
  Flame,
  Camera
} from 'lucide-react';

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  category: 'Platform Screens' | 'Enterprise Dashboards' | 'Products & Hardware' | 'Music & Radio' | 'AI Assistant';
  route: string;
  badge?: string;
  icon: React.ReactNode;
}

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: string) => void;
}

const STATIC_REGISTRY: SearchResultItem[] = [
  // 1. Core Platform Pages
  {
    id: 'nav-forum',
    title: 'Forum Community & Discussions',
    description: 'Explore 53 curated forum categories, threads, and rich composer.',
    category: 'Platform Screens',
    route: '/forum',
    badge: 'Core Hub',
    icon: <Users className="w-4 h-4 text-emerald-500" />
  },
  {
    id: 'nav-mii',
    title: 'Mii™®©℠ Moments & Spotlight',
    description: 'Creator broadcast channel, media spotlight, and engagement timeline.',
    category: 'Platform Screens',
    route: '/mii',
    badge: 'Statutory Mii',
    icon: <Flame className="w-4 h-4 text-orange-500" />
  },
  {
    id: 'nav-beatwave',
    title: 'BeatwaveNG Music & Online Radio',
    description: 'Apple Music UI with Lush Pressies Green and 10 live radio stations.',
    category: 'Platform Screens',
    route: '/beatwave-ng',
    badge: '60M+ Tracks',
    icon: <Music className="w-4 h-4 text-emerald-500" />
  },
  {
    id: 'nav-photo-credits',
    title: 'PhotoCredits Licensing Engine',
    description: 'Stock photography licensing and 26-day Friday monthly giveaway.',
    category: 'Platform Screens',
    route: '/photo-credits',
    badge: '80/20 Royalties',
    icon: <Camera className="w-4 h-4 text-blue-500" />
  },
  {
    id: 'nav-marketplace',
    title: 'Marketplace Flagship Store',
    description: 'Official hardware keycards, certified merch, and verified escrow.',
    category: 'Platform Screens',
    route: '/marketplace',
    badge: 'Official Drops',
    icon: <ShoppingBag className="w-4 h-4 text-indigo-500" />
  },
  {
    id: 'nav-storefront',
    title: 'Storefront Merchant Portal',
    description: 'Member subscription custom shops, inventory tracking, and SKU management.',
    category: 'Platform Screens',
    route: '/storefront',
    badge: 'Merchant Portal',
    icon: <ShoppingBag className="w-4 h-4 text-teal-500" />
  },
  {
    id: 'nav-ownit',
    title: 'OwnIt Red-Carpet Luxury Boutique',
    description: 'Haute couture, fine jewelry, 4K video showcase, and Certificates of Authenticity.',
    category: 'Platform Screens',
    route: '/ownit',
    badge: 'Luxury 4K',
    icon: <Sparkles className="w-4 h-4 text-amber-500" />
  },
  {
    id: 'nav-flamingo',
    title: 'Flamingo Discrete Luxury & Intimacy',
    description: 'Statutory 19+ dual-lock runway gowns and 10 NYT Wirecutter wellness devices.',
    category: 'Platform Screens',
    route: '/flamingo',
    badge: 'Dual-Lock 19+',
    icon: <ShieldCheck className="w-4 h-4 text-rose-500" />
  },
  {
    id: 'nav-loansqr',
    title: 'LoanSqr SME Micro-Financing',
    description: 'MSME float, Guardian AI automated credit scoring, and POS receivables float.',
    category: 'Platform Screens',
    route: '/loansqr',
    badge: 'Guardian AI Credit',
    icon: <DollarSign className="w-4 h-4 text-emerald-600" />
  },
  {
    id: 'nav-groups',
    title: 'Groups & Micro-Communities',
    description: 'Public, private & hidden peer groups with admin assist and vetting guides.',
    category: 'Platform Screens',
    route: '/groups',
    badge: 'Peer-to-Peer',
    icon: <Users className="w-4 h-4 text-purple-500" />
  },
  {
    id: 'nav-gems',
    title: 'Gems Highlights & Tipping',
    description: 'Curated ephemeral creator highlights with virtual token tipping.',
    category: 'Platform Screens',
    route: '/gems',
    badge: 'FIC Tipping',
    icon: <Sparkles className="w-4 h-4 text-yellow-500" />
  },
  {
    id: 'nav-hallmarks',
    title: 'Hallmarks Certified Achievements',
    description: 'Verified creator milestones, badges, and sovereign identity seals.',
    category: 'Platform Screens',
    route: '/hallmarks',
    badge: 'Verified Badges',
    icon: <ShieldCheck className="w-4 h-4 text-blue-500" />
  },
  {
    id: 'nav-blogs',
    title: 'Sovereign Blogs & Paylinks',
    description: 'Full blogging suite with gift sending, tokenization, and paylinks.',
    category: 'Platform Screens',
    route: '/blogs',
    badge: 'Articles',
    icon: <FileText className="w-4 h-4 text-slate-600" />
  },
  {
    id: 'nav-camus',
    title: 'Camus Ad Campaign Manager',
    description: 'Sovereign programmatic campaign specs, Canary ads, and CPM auctioning.',
    category: 'Platform Screens',
    route: '/camus',
    badge: 'Sovereign CPM',
    icon: <Compass className="w-4 h-4 text-orange-500" />
  },

  // 2. Enterprise Dashboard Modules
  {
    id: 'dash-master',
    title: 'Master Dashboard Executive Center',
    description: 'Unified command center aggregating all 12 satellite modules and system telemetry.',
    category: 'Enterprise Dashboards',
    route: '/master-dashboard',
    badge: 'Executive',
    icon: <Activity className="w-4 h-4 text-emerald-500" />
  },
  {
    id: 'dash-stercs',
    title: 'STERCS Sentient Control System',
    description: 'Dynamic rule engine, circuit breakers, content moderation, and policy overrides.',
    category: 'Enterprise Dashboards',
    route: '/stercs',
    badge: 'Sentient Control',
    icon: <ShieldCheck className="w-4 h-4 text-cyan-500" />
  },
  {
    id: 'dash-guardian-ai',
    title: 'Guardian AI Security & Biometrics',
    description: 'Autonomous security sentinel, biometric hashing, and coupon fraud defense.',
    category: 'Enterprise Dashboards',
    route: '/guardian-protection',
    badge: 'AI Sentinel',
    icon: <Bot className="w-4 h-4 text-indigo-500" />
  },
  {
    id: 'dash-users',
    title: 'User Management & RBAC',
    description: 'Member CRUD, role-based access control, session revokes, and audit trails.',
    category: 'Enterprise Dashboards',
    route: '/user-management',
    badge: 'RBAC',
    icon: <Users className="w-4 h-4 text-blue-500" />
  },
  {
    id: 'dash-content',
    title: 'Content Management & Moderation',
    description: 'Editorial approvals, multi-format moderation, and CDN cache purges.',
    category: 'Enterprise Dashboards',
    route: '/content-management',
    badge: 'Editorial',
    icon: <FileText className="w-4 h-4 text-amber-500" />
  },
  {
    id: 'dash-ecommerce',
    title: 'E-Commerce Enterprise Console',
    description: 'Multi-vendor order fulfillment, escrow disbursements, and SKU quotas.',
    category: 'Enterprise Dashboards',
    route: '/ecommerce',
    badge: 'Fulfillment',
    icon: <ShoppingBag className="w-4 h-4 text-rose-500" />
  },
  {
    id: 'dash-compliance',
    title: 'Compliance & GDPR Governance',
    description: 'Statutory KYC/KYB records, DPO logging, and regulatory audit reports.',
    category: 'Enterprise Dashboards',
    route: '/compliance',
    badge: 'DPO / GDPR',
    icon: <ShieldCheck className="w-4 h-4 text-slate-600" />
  },
  {
    id: 'dash-ai-governance',
    title: 'AI Governance & Ethics Framework',
    description: 'Prompt filtering policies, model ethics benchmarks, and bias monitoring.',
    category: 'Enterprise Dashboards',
    route: '/ai-governance',
    badge: 'Ethics',
    icon: <Bot className="w-4 h-4 text-emerald-500" />
  },
  {
    id: 'dash-seo',
    title: 'Guardian AI Autonomous SEO & Search Indexing Engine',
    description: '100% daily autonomous SEO self-healing, Core Web Vitals, Google/Bing crawling & sub-ms search indexing.',
    category: 'Enterprise Dashboards',
    route: '/masterdashboard?tab=seo',
    badge: '100% Auto',
    icon: <Sparkles className="w-4 h-4 text-emerald-500" />
  },
  {
    id: 'nav-financials-treasury',
    title: 'Sovereign Treasury, FIC & FIAT Rules Console',
    description: 'Live FIC minting engine, ₦100 fixed parity anchor, NIBSS/Paystack/Flutterwave rails, and subscription gating bridge.',
    category: 'Enterprise Dashboards',
    route: '/masterdashboard?tab=financials',
    badge: 'FIC / ₦',
    icon: <DollarSign className="w-4 h-4 text-amber-500" />
  },
  {
    id: 'nav-roles-permissions',
    title: 'Roles & Permissions (RBAC & Collaborator Seats)',
    description: 'Enterprise collaborator seats (5/10), 45+ granular permissions catalog, custom roles, and location restriction fences.',
    category: 'Enterprise Dashboards',
    route: '/settings/roles-permissions',
    badge: 'RBAC Seats',
    icon: <Users className="w-4 h-4 text-indigo-500" />
  },
  {
    id: 'nav-site-member-access',
    title: 'Gated Content & Member Access Gatekeeper',
    description: 'Gate 20 platform modules and 10 restricted site pages to specific subscription passes, VIP cohorts, and roles.',
    category: 'Enterprise Dashboards',
    route: '/contacts/site-members/site-member-access',
    badge: 'Paywall Gate',
    icon: <ShieldCheck className="w-4 h-4 text-rose-500" />
  },

  // 3. Products & Hardware
  {
    id: 'prod-magic-wand',
    title: 'Magic Wand Rechargeable (HV-270)',
    description: 'Wirecutter #1 rated deep-rumble wand power massager with 4 speed settings.',
    category: 'Products & Hardware',
    route: '/flamingo',
    badge: 'NYT Wirecutter',
    icon: <ShoppingBag className="w-4 h-4 text-rose-500" />
  },
  {
    id: 'prod-womanizer',
    title: 'Womanizer Pleasure Air (Eco Series)',
    description: 'Touchless air-suction pulses with 12 calibrated intensity levels.',
    category: 'Products & Hardware',
    route: '/flamingo',
    badge: 'Pleasure Air™',
    icon: <ShoppingBag className="w-4 h-4 text-rose-500" />
  },
  {
    id: 'prod-satisfyer',
    title: 'Satisfyer Pro 2 Next Generation',
    description: 'Popular budget-friendly air-pulse clitoral stimulator with 11 programs.',
    category: 'Products & Hardware',
    route: '/flamingo',
    badge: 'Best Value',
    icon: <ShoppingBag className="w-4 h-4 text-rose-500" />
  },
  {
    id: 'prod-handy',
    title: 'The Handy 2 Pro Interactive Stroker',
    description: 'CES 2026 automated stroker with 0-120mm configurable stroke length.',
    category: 'Products & Hardware',
    route: '/flamingo',
    badge: 'Robotics',
    icon: <ShoppingBag className="w-4 h-4 text-rose-500" />
  },
  {
    id: 'prod-njoy',
    title: 'Njoy Pure Plug (Stainless Steel)',
    description: 'Medical-grade 316 stainless steel with mirror polish for thermal play.',
    category: 'Products & Hardware',
    route: '/flamingo',
    badge: 'Medical 316',
    icon: <ShoppingBag className="w-4 h-4 text-rose-500" />
  },

  // 4. Music & Radio
  {
    id: 'radio-bbc1',
    title: 'BBC Radio 1 Live Stream',
    description: 'Contemporary pop, indie rock, live concerts, and official chart-toppers.',
    category: 'Music & Radio',
    route: '/beatwave-ng',
    badge: 'Station 1',
    icon: <Radio className="w-4 h-4 text-emerald-500" />
  },
  {
    id: 'radio-npr',
    title: 'NPR 24-Hour Global Stream',
    description: 'Continuous global journalism, investigative reporting, and thought-leadership.',
    category: 'Music & Radio',
    route: '/beatwave-ng',
    badge: 'Station 2',
    icon: <Radio className="w-4 h-4 text-emerald-500" />
  },
  {
    id: 'radio-classic',
    title: 'Classic FM Orchestral Broadcast',
    description: 'World-class orchestral masterpieces, timeless concertos, and calm study mixes.',
    category: 'Music & Radio',
    route: '/beatwave-ng',
    badge: 'Station 3',
    icon: <Radio className="w-4 h-4 text-emerald-500" />
  },
  {
    id: 'radio-somafm',
    title: 'SomaFM Deep Underground Ambient',
    description: 'Listener-supported indie chill, ambient electronica, and late-night vibes.',
    category: 'Music & Radio',
    route: '/beatwave-ng',
    badge: 'Station 10',
    icon: <Radio className="w-4 h-4 text-emerald-500" />
  }
];

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const goToRoute = useCallback(
    (route: string) => {
      onClose();
      if (onNavigate) {
        onNavigate(route);
      } else if (router && router.navigate) {
        router.navigate(route);
      } else {
        window.location.href = route;
      }
    },
    [onClose, onNavigate]
  );

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter results dynamically
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return STATIC_REGISTRY.slice(0, 8);
    }

    return STATIC_REGISTRY.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchBadge = item.badge?.toLowerCase().includes(q) ?? false;
      return matchTitle || matchDesc || matchCategory || matchBadge;
    });
  }, [query]);

  // Reset selectedIndex on search change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  // Navigate to item
  const handleSelect = useCallback(
    (item: SearchResultItem) => {
      goToRoute(item.route);
    },
    [goToRoute]
  );

  // Key navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < filteredResults.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredResults.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          handleSelect(filteredResults[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [filteredResults, selectedIndex, handleSelect, onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a screen, product, radio, or ask Guardian AI..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 text-base focus:outline-none font-medium font-bold border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500"
          />
          {query ? (
            <button type="button" aria-label="Close"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-700 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono text-slate-700 dark:text-slate-300 font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-slate-100 dark:divide-slate-800/40">
          {filteredResults.length > 0 ? (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 border border-emerald-200/60 dark:border-emerald-800/60 shadow-xs'
                      : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-3 shrink-0">
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 font-bold hidden sm:inline">
                      {item.category}
                    </span>
                    {isSelected ? (
                      <CornerDownLeft className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-700 dark:text-slate-600" />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 px-4">
              <Bot className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                No exact matches found for "{query}"
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1 max-w-sm mx-auto">
                Guardian AI Search suggests checking related routes like /forum, /loansqr, or /master-dashboard.
              </p>
              <button
                onClick={() => {
                  goToRoute('/forum');
                }}
                className="mt-4 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition"
              >
                Go to Forum Feed
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300 font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                ↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                ↵
              </kbd>
              <span>to select</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Universal AI Search</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalSearchModal;
