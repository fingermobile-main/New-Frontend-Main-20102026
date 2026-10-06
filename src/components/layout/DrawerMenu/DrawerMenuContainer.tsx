import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DRAWER_MENU_CONFIG,
  DrawerMenuCategory,
  DrawerMenuItem
} from '../../../config/drawerMenuConfig';
import {
  Search,
  ChevronDown,
  ChevronRight,
  X,
  Lock,
  Crown,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface DrawerMenuContainerProps {
  isOpen: boolean;
  onClose: () => void;
  isDesktopSidebar?: boolean;
}

export const DrawerMenuContainer: React.FC<DrawerMenuContainerProps> = ({
  isOpen,
  onClose,
  isDesktopSidebar = false
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track open accordion categories - expand all by default or first two
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
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-xl border-r border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-orange-500/20">
            FM
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white tracking-wide text-base leading-tight">
              FingerMobile
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Protocol Ecosystem
            </p>
          </div>
        </div>

        {!isDesktopSidebar && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pages, features..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Accordion Categories */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {filteredCategories.length === 0 ? (
          <div className="py-8 text-center px-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              No matching pages or features found for "{searchQuery}"
            </p>
          </div>
        ) : (
          filteredCategories.map((cat) => {
            const isExpanded = expandedCategories[cat.id] || !!searchQuery.trim();

            return (
              <div
                key={cat.id}
                className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between bg-slate-100/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 truncate">
                      {cat.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                      {cat.items.length}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                  )}
                </button>

                {/* Category Items */}
                {isExpanded && (
                  <div className="p-1 space-y-1">
                    {cat.items.map((item) => {
                      const active = isActive(item.path);

                      return (
                        <Link
                          key={item.id}
                          to={item.path}
                          onClick={() => {
                            if (!isDesktopSidebar) onClose();
                          }}
                          className={`group flex items-start justify-between p-2.5 rounded-lg text-xs transition-all duration-150 ${
                            active
                              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-md shadow-orange-500/20'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800/90 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <div className="flex items-start space-x-2.5 min-w-0 flex-1">
                            <div className="mt-0.5 shrink-0">
                              {item.isPrivate ? (
                                <Lock className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-red-500'}`} />
                              ) : item.requiresPaidPlan ? (
                                <Crown className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-amber-500'}`} />
                              ) : (
                                <ArrowRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'text-white' : 'text-orange-500'}`} />
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
                                    active
                                      ? 'text-white/80'
                                      : 'text-slate-500 dark:text-slate-400'
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

      {/* Footer / Status */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">Live Network</span>
        </div>
        <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium">
          v2.4.0
        </span>
      </div>
    </div>
  );

  if (isDesktopSidebar) {
    return <aside className="w-72 h-screen sticky top-0 shrink-0">{renderContent()}</aside>;
  }

  return (
    <>
      {/* Drawer Overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Mobile Drawer Content */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderContent()}
      </div>
    </>
  );
};
