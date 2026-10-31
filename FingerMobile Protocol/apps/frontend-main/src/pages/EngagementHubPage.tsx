/*
 * FingerMobile Protocol™ - Dedicated Sovereign Engagement & Activity Console Page
 * Full-screen management hub for Forum, Groups, Blogs, HallMarks, Gems, Mii, and Publicitee
 * Frees individual module feeds from obstruction while providing a dedicated command center
 * Strictly compliant with WCAG AAA contrast hierarchy standards.
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Activity,
  MessageSquare,
  Users,
  BookOpen,
  Award,
  Gift,
  Radio,
  Tv,
  Globe,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import {
  SovereignModuleEngagementHub,
  SovereignModuleType
} from '../components/common/SovereignModuleEngagementHub';

interface ModuleTabOption {
  id: SovereignModuleType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  returnUrl: string;
}

const MODULE_TABS: ModuleTabOption[] = [
  { id: 'all', label: 'All Modules', icon: Globe, returnUrl: '/master-dashboard?tab=communities' },
  { id: 'forum', label: 'Forum', icon: MessageSquare, returnUrl: '/forum' },
  { id: 'groups', label: 'Groups', icon: Users, returnUrl: '/groups' },
  { id: 'blogs', label: 'Blogs', icon: BookOpen, returnUrl: '/blogs' },
  { id: 'hallmarks', label: 'HallMarks', icon: Award, returnUrl: '/hallmarks' },
  { id: 'gems', label: 'Gems', icon: Gift, returnUrl: '/gems' },
  { id: 'mii', label: 'Mii™', icon: Radio, returnUrl: '/mii' },
  { id: 'publicitee', label: 'Publicitee', icon: Tv, returnUrl: '/publicitee' }
];

export const EngagementHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { module: paramModule } = useParams<{ module?: string }>();

  // Determine active module from query params or route params
  const initialModule =
    (paramModule as SovereignModuleType) ||
    (searchParams.get('module') as SovereignModuleType) ||
    'all';

  const [activeModule, setActiveModule] = useState<SovereignModuleType>(initialModule);

  useEffect(() => {
    const qModule = searchParams.get('module') as SovereignModuleType;
    if (qModule && qModule !== activeModule) {
      setActiveModule(qModule);
    }
  }, [searchParams]);

  const handleSelectModule = (mod: SovereignModuleType) => {
    setActiveModule(mod);
    setSearchParams({ module: mod });
  };

  const currentTab = MODULE_TABS.find((t) => t.id === activeModule) || MODULE_TABS[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* TOP BREADCRUMB & HEADER */}
        <div className="bg-white rounded-3xl border border-slate-300 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    navigate(currentTab.returnUrl);
                  }
                }}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors shadow-xs cursor-pointer"
                title="Return to previous screen"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-orange-100 text-orange-950 border border-orange-400">
                    Sovereign Command Console
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Live PostgreSQL Sync
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mt-1">
                  <Activity className="w-6 h-6 text-orange-600" />
                  <span>Engagement & Activity Console</span>
                </h1>
                <p className="text-xs text-slate-700 font-medium">
                  Unified multi-criteria interaction management, responses, and immutable audit trail.
                </p>
              </div>
            </div>

            {/* Quick Action: Jump directly to originating module */}
            <div className="flex items-center gap-2">
              <Link
                to={currentTab.returnUrl}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
                title={`Return to ${currentTab.label} feed`}
              >
                <span>Return to {currentTab.label}</span>
                <ExternalLink className="w-4 h-4 text-orange-400" />
              </Link>
            </div>
          </div>

          {/* MODULE SWITCHER TABS ROW */}
          <div className="pt-4 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none pb-1">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1 shrink-0 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" /> Module:
            </span>
            {MODULE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeModule === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectModule(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-500 text-slate-950 font-black shadow-xs ring-1 ring-orange-600'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FULL ENGAGEMENT & ACTIVITY CONSOLE STAGE */}
        <div className="space-y-6">
          <SovereignModuleEngagementHub
            module={activeModule}
            title={`${currentTab.label} Engagement & Activity Stream`}
            subtitle={`Real-time interactions, comments, mentions, connection requests, and audit logs for ${currentTab.label}`}
          />
        </div>
      </div>
    </div>
  );
};

export default EngagementHubPage;
