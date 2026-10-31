/*
 * FingerMobile Protocol™ - Sovereign Engagement & Activity Dropdown Trigger
 * Compact, non-blocking header trigger replacing full-bleed static hubs
 * Allows opening the Engagement & Activity Console in a new screen or slide-over drawer
 * Strictly compliant with WCAG AAA contrast hierarchy standards.
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ChevronDown,
  ExternalLink,
  MessageSquare,
  AtSign,
  UserPlus,
  AlertCircle,
  X,
  SlidersHorizontal,
  ChevronUp,
  PanelRightOpen,
  Sparkles
} from 'lucide-react';
import { SovereignModuleEngagementHub, SovereignModuleType } from './SovereignModuleEngagementHub';

interface SovereignEngagementDropdownTriggerProps {
  module: SovereignModuleType;
  label?: string;
  className?: string;
}

interface SummaryData {
  comments_count: number;
  mentions_count: number;
  connect_and_follows_count: number;
  all_comments_count: number;
  responded_count: number;
  havent_responded_count: number;
  total_interactions: number;
}

export const SovereignEngagementDropdownTrigger: React.FC<SovereignEngagementDropdownTriggerProps> = ({
  module,
  label,
  className = ''
}) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInlineExpanded, setIsInlineExpanded] = useState(false);
  const [summary, setSummary] = useState<SummaryData>({
    comments_count: 0,
    mentions_count: 0,
    connect_and_follows_count: 0,
    all_comments_count: 0,
    responded_count: 0,
    havent_responded_count: 0,
    total_interactions: 0
  });

  const moduleDisplayName =
    label ||
    (module === 'forum'
      ? 'Forum'
      : module === 'groups'
        ? 'Groups'
        : module === 'blogs'
          ? 'Blogs'
          : module === 'hallmarks'
            ? 'HallMarks'
            : module === 'gems'
              ? 'Gems'
              : module === 'mii'
                ? 'Mii™'
                : module === 'publicitee'
                  ? 'Publicitee'
                  : 'Sovereign');

  useEffect(() => {
    let isMounted = true;
    const fetchSummary = async () => {
      try {
        const res = await fetch(`/api/module-interactions/summary?module=${module}`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.success && json.data) {
            setSummary(json.data);
          }
        }
      } catch {
        // Fallback gracefully to default zeroes
      }
    };
    fetchSummary();
    return () => {
      isMounted = false;
    };
  }, [module]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleOpenNewScreen = () => {
    setIsDropdownOpen(false);
    navigate(`/engagement-hub?module=${module}`);
  };

  const handleOpenDrawer = () => {
    setIsDropdownOpen(false);
    setIsDrawerOpen(true);
  };

  const handleToggleInline = () => {
    setIsDropdownOpen(false);
    setIsInlineExpanded((prev) => !prev);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* COMPACT TRIGGER BAR (< 48px high, zero obstruction to member screen) */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-xs px-3 sm:px-4 py-2 flex items-center justify-between gap-2.5 transition-all">
        {/* Left: Dropdown Toggle Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer group"
            title="Open Engagement & Activity Console Options"
            aria-expanded={isDropdownOpen}
          >
            <Activity className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
            <span className="truncate">{moduleDisplayName} Engagement Console</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180 text-orange-400' : ''
              }`}
            />
          </button>

          {/* FLOATING DROPDOWN MENU */}
          {isDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-300 shadow-2xl z-50 p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-orange-600" />
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    {moduleDisplayName} Console Controls
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  {summary.total_interactions} Total
                </span>
              </div>

              {/* Quick Summary Breakdown */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700 font-bold flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-orange-600" /> Comments:
                  </span>
                  <span className="text-slate-900 font-black">{summary.comments_count}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700 font-bold flex items-center gap-1.5">
                    <AtSign className="w-3.5 h-3.5 text-sky-600" /> Mentions:
                  </span>
                  <span className="text-slate-900 font-black">{summary.mentions_count}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700 font-bold flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5 text-purple-600" /> Connects:
                  </span>
                  <span className="text-slate-900 font-black">{summary.connect_and_follows_count}</span>
                </div>
                <div
                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    summary.havent_responded_count > 0
                      ? 'bg-rose-50 border-rose-300 text-rose-950'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  }`}
                >
                  <span className="font-bold flex items-center gap-1.5 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Unanswered:
                  </span>
                  <span className="font-black">{summary.havent_responded_count}</span>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="space-y-1.5 pt-1">
                <button
                  type="button"
                  onClick={handleOpenNewScreen}
                  className="w-full py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs transition-all shadow-xs flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-slate-950" />
                    <span>Open Console in Dedicated Screen</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold opacity-80">Full View ↗</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenDrawer}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs border border-slate-300 transition-all flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <PanelRightOpen className="w-4 h-4 text-slate-700" />
                    <span>Open Side-Over Drawer</span>
                  </span>
                  <span className="text-[10px] text-slate-700">Slide Panel</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleInline}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 transition-all flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{isInlineExpanded ? 'Collapse Inline Console' : 'Expand Inline (Preview)'}</span>
                  </span>
                  <span className="text-[10px] text-slate-600">
                    {isInlineExpanded ? 'Hide' : 'Show'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Center: Live Quick Metric Chips (Desktop & Tablet) */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none text-xs">
          <button
            type="button"
            onClick={handleOpenNewScreen}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 transition-colors cursor-pointer"
            title="View comments"
          >
            <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
            <span>Comments:</span>
            <strong className="text-slate-900">{summary.comments_count}</strong>
          </button>

          <button
            type="button"
            onClick={handleOpenNewScreen}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 transition-colors cursor-pointer"
            title="View mentions"
          >
            <AtSign className="w-3.5 h-3.5 text-sky-600" />
            <span>Mentions:</span>
            <strong className="text-slate-900">{summary.mentions_count}</strong>
          </button>

          <button
            type="button"
            onClick={handleOpenNewScreen}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 transition-colors cursor-pointer"
            title="View connects and follows"
          >
            <UserPlus className="w-3.5 h-3.5 text-purple-600" />
            <span>Connects:</span>
            <strong className="text-slate-900">{summary.connect_and_follows_count}</strong>
          </button>

          {summary.havent_responded_count > 0 ? (
            <button
              type="button"
              onClick={handleOpenNewScreen}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-950 font-bold border border-rose-400 transition-colors cursor-pointer animate-pulse"
              title="Items requiring your response"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
              <span>Haven't responded:</span>
              <strong className="text-rose-950 font-black">{summary.havent_responded_count}</strong>
            </button>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-950 font-bold border border-emerald-400 text-[11px]">
              <span>All Responded ✓</span>
            </span>
          )}
        </div>

        {/* Right: Direct "Open Screen" CTA */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleOpenNewScreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-950 text-xs font-bold border border-orange-300 transition-all shadow-xs cursor-pointer"
            title="Open dedicated Engagement & Activity Console screen"
          >
            <span className="hidden sm:inline">Open Console</span>
            <ExternalLink className="w-3.5 h-3.5 text-orange-600" />
          </button>

          <button
            type="button"
            onClick={handleOpenDrawer}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-all cursor-pointer"
            title="Open Quick Slide-Over Drawer"
            aria-label="Open Slide Panel"
          >
            <PanelRightOpen className="w-4 h-4 text-slate-700" />
          </button>

          <button
            type="button"
            onClick={() => setIsInlineExpanded((prev) => !prev)}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-all cursor-pointer"
            title={isInlineExpanded ? 'Collapse inline view' : 'Expand inline view'}
            aria-label="Toggle inline view"
          >
            {isInlineExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-700" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {/* OPTIONAL INLINE EXPANDED CONSOLE (Hidden by default, zero blocking!) */}
      {isInlineExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-700">Inline Console Preview</span>
            <button
              type="button"
              onClick={() => setIsInlineExpanded(false)}
              className="text-xs font-bold text-orange-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Close Preview
            </button>
          </div>
          <SovereignModuleEngagementHub module={module} compact={true} />
        </div>
      )}

      {/* FULL SLIDE-OVER DRAWER MODAL (Non-blocking, slides in from right) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[9998] flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-50 h-full shadow-2xl border-l border-slate-300 flex flex-col overflow-hidden animate-slideInRight">
            {/* Drawer Header */}
            <div className="p-4 bg-white border-b border-slate-300 flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-100 border border-orange-300">
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {moduleDisplayName} Engagement & Activity Console
                  </h3>
                  <p className="text-[11px] text-slate-700 font-medium">
                    Slide-over management • Responses sync live to PostgreSQL
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenNewScreen}
                  className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 text-xs font-black transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                  title="Expand to full screen"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Full Screen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Close slide-over"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <SovereignModuleEngagementHub module={module} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SovereignEngagementDropdownTrigger;

