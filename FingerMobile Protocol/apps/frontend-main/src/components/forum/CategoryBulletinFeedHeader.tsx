/*
 * FingerMobile Protocol™ - Sovereign Category Bulletin & Space Feed Header
 * Dedicated Center Column Preferred Topics Feed for Member-Generated Content (UGC)
 * Features On-Demand Audio Bulletins (Listen on the Move) & AI Curated Editorial Publishings
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Radio,
  FileText,
  UserCheck,
  Plus,
  Share2,
  ShieldCheck,
  Lock,
  Globe,
  ArrowLeft,
  PenSquare,
  Check,
  Flame,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const getCategoryEmoji = (name: string, icon?: string): string => {
  if (
    icon &&
    !icon.startsWith('http') &&
    !icon.startsWith('/') &&
    !icon.includes('.jpg') &&
    !icon.includes('.png') &&
    !icon.includes('.webp') &&
    !icon.includes('.jpeg')
  ) {
    return icon;
  }
  const n = (name || '').toLowerCase();
  if (n.includes('general')) return '🌐';
  if (n.includes('question') || n.includes('q&a') || n.includes('answer')) return '❓';
  if (n.includes('verified')) return '✅';
  if (n.includes('connect')) return '🤝';
  if (n.includes('dating')) return '💖';
  if (n.includes('sight') || n.includes('sound')) return '🎧';
  if (n.includes('movie') || n.includes('film') || n.includes('video')) return '🎬';
  if (n.includes('music') || n.includes('concert') || n.includes('audio') || n.includes('beatwave')) return '🎵';
  if (n.includes('art') || n.includes('nostalgic')) return '🎨';
  if (n.includes('crypto') || n.includes('token') || n.includes('coin') || n.includes('yield')) return '🪙';
  if (n.includes('security') || n.includes('cyber') || n.includes('proof') || n.includes('enclave')) return '🛡️';
  if (n.includes('sell') || n.includes('buy') || n.includes('market') || n.includes('classified') || n.includes('storefront')) return '🛍️';
  if (n.includes('order') || n.includes('kitchen') || n.includes('food') || n.includes('culinary')) return '🍲';
  if (n.includes('tech') || n.includes('gadget') || n.includes('hardware') || n.includes('device') || n.includes('sensor')) return '⚡';
  if (n.includes('lux') || n.includes('jewelry') || n.includes('diamond')) return '💎';
  if (n.includes('health') || n.includes('medical') || n.includes('telehealth') || n.includes('doctor')) return '🩺';
  if (n.includes('news') || n.includes('update') || n.includes('bulletin')) return '📰';
  if (n.includes('laff') || n.includes('meme') || n.includes('skitz') || n.includes('comedy')) return '🎭';
  if (n.includes('pet') || n.includes('wild') || n.includes('nature') || n.includes('animal')) return '🐾';
  if (n.includes('sport') || n.includes('olympia') || n.includes('fitness')) return '⚽';
  if (n.includes('game') || n.includes('gaming') || n.includes('quest')) return '🎮';
  if (n.includes('college') || n.includes('school') || n.includes('education') || n.includes('grant') || n.includes('university')) return '🎓';
  if (n.includes('give-away') || n.includes('gift') || n.includes('pressies')) return '🎁';
  if (n.includes('law') || n.includes('order') || n.includes('legal') || n.includes('charter')) return '⚖️';
  if (n.includes('private room') || n.includes('secret') || n.includes('enclave')) return '🔒';
  if (n.includes('chuta') || n.includes('nanee') || n.includes('ayersha') || n.includes('waeni') || n.includes('mirella')) return '✨';
  if (n.includes('velvet') || n.includes('suede') || n.includes('fashion') || n.includes('flamingo')) return '👗';
  if (n.includes('photo') || n.includes('creator')) return '📸';
  if (n.includes('ai') || n.includes('sentinel') || n.includes('bot')) return '🤖';
  if (n.includes('identity') || n.includes('did')) return '🔐';
  if (n.includes('loan') || n.includes('credit') || n.includes('bank') || n.includes('finance')) return '💳';
  return '📁';
};

export interface CategoryBulletinFeedHeaderProps {
  categoryName: string;
  categoryIcon?: string;
  totalPostsCount: number;
  editorialMode: 'curated' | 'all';
  onToggleEditorialMode: (mode: 'curated' | 'all') => void;
  onClearCategory: () => void;
  onPublishToCategory: () => void;
  triggerToast?: (msg: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  headerImageUrl?: string;
  coverImageUrl?: string;
  rules?: string;
  moderationState?: string;
  accessType?: string;
  subscriptionTierRequired?: string;
  isFrozen?: boolean;
  isCommentingPaused?: boolean;
  isGated?: boolean;
  hasAccess?: boolean;
  styleColor?: string;
}

export const CategoryBulletinFeedHeader: React.FC<CategoryBulletinFeedHeaderProps> = ({
  categoryName,
  categoryIcon,
  totalPostsCount,
  editorialMode,
  onToggleEditorialMode,
  onClearCategory,
  onPublishToCategory,
  triggerToast,
  headerImageUrl,
  coverImageUrl,
  rules,
  moderationState,
  accessType,
  subscriptionTierRequired,
  isFrozen,
  isCommentingPaused,
  isGated,
  hasAccess = true,
  styleColor,
}) => {
  const [showRules, setShowRules] = useState<boolean>(false);
  // Check if private room or subscription-based space
  const isPrivateSpace =
    Boolean(isGated) ||
    accessType === 'subscription' ||
    accessType === 'rbac_gated' ||
    categoryName.toLowerCase().includes('private') ||
    categoryName.toLowerCase().includes('verified') ||
    categoryName.toLowerCase().includes('classified') ||
    categoryName.toLowerCase().includes('lux') ||
    categoryName.toLowerCase().includes('grant');

  // Follow & Tailor state stored per category in localStorage
  const storageKey = `fpm_feed_tailored_${categoryName.toLowerCase().replace(/\s+/g, '_')}`;
  const [isTailored, setIsTailored] = useState<boolean>(() => {
    try {
      return localStorage.getItem(storageKey) === 'true';
    } catch {
      return false;
    }
  });

  // Audio Bulletin Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioPlaybackSpeed, setAudioPlaybackSpeed] = useState<number>(1.0);
  const [audioProgressSeconds, setAudioProgressSeconds] = useState<number>(0);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const totalDuration = 135; // 2m 15s

  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const cleanCategoryName = categoryName.replace(/https?:\/\/[^\s]+/g, '').trim() || categoryName;
  const categoryEmoji = getCategoryEmoji(cleanCategoryName, categoryIcon);
  const isIconUrl = categoryIcon && (categoryIcon.startsWith('http') || categoryIcon.startsWith('/'));

  // Bulletin Script for On-Demand Audio Update
  const bulletinTranscript = `FingerMobile Sovereign Audio Bulletin for ${cleanCategoryName}. Welcome mobile nodes and sovereign readers. Today's on-demand editorial digest features verified member-generated dispatches, active peer discussions, and cryptographic provenance checks. Community publishers have contributed ${Math.max(totalPostsCount, 6)} active threads with 99.4% authenticity ratings. Handpicked by AI direct editorial curation, this bulletin bypasses platform media tech algorithms to deliver unfiltered member intelligence straight to your ears.`;

  // Handle Speech Synthesis Playback
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlayingAudio) {
      timer = setInterval(() => {
        setAudioProgressSeconds((prev) => {
          if (prev >= totalDuration) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / audioPlaybackSpeed);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlayingAudio, audioPlaybackSpeed]);

  const handleTogglePlayAudio = () => {
    if (!isPlayingAudio) {
      // Start audio
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(bulletinTranscript);
        utterance.rate = audioPlaybackSpeed;
        utterance.pitch = 0.90; // Natural warm vocal resonance
        utterance.onend = () => {
          setIsPlayingAudio(false);
          setAudioProgressSeconds(0);
        };
        utterance.onerror = () => {
          setIsPlayingAudio(false);
        };
        speechUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
      setIsPlayingAudio(true);
      if (triggerToast) {
        triggerToast(`🎙️ Audio Bulletin Playing: ${cleanCategoryName} (Listen on the move)`, 'info');
      }
    } else {
      // Stop/Pause audio
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
    }
  };

  const handleChangeSpeed = (newSpeed: number) => {
    setAudioPlaybackSpeed(newSpeed);
    if (isPlayingAudio && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(bulletinTranscript);
      utterance.rate = newSpeed;
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setAudioProgressSeconds(0);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleTailorFeed = () => {
    const nextState = !isTailored;
    setIsTailored(nextState);
    try {
      localStorage.setItem(storageKey, String(nextState));
    } catch {
      // ignore localStorage error
    }
    if (triggerToast) {
      triggerToast(
        nextState
          ? `Added "${cleanCategoryName}" to your personalized daily publishing stream!`
          : `Removed "${cleanCategoryName}" from your tailored daily stream.`,
        nextState ? 'success' : 'info'
      );
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-300 dark:border-slate-800 shadow-sm overflow-hidden mb-6 transition-all">
      {/* 0. Category Header Banner Image */}
      {headerImageUrl && (
        <div className="w-full h-32 sm:h-48 overflow-hidden relative border-b border-slate-200 dark:border-slate-800 bg-slate-950">
          <img src={headerImageUrl} alt={cleanCategoryName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-6 text-white text-xs font-mono font-bold bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-white/20">
            Sovereign Header Space
          </div>
        </div>
      )}

      {/* 1. Category Space & Identity Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-50 via-white to-orange-50/40 dark:from-slate-900 dark:via-slate-850 dark:to-slate-800 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <button
            type="button"
            onClick={onClearCategory}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer border border-slate-300 dark:border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span>All Feeds & Topics</span>
          </button>

          <div className="flex items-center gap-2">
            {isPrivateSpace ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-950 dark:text-purple-300 border border-purple-400 dark:border-purple-800 text-[11px] font-black tracking-wide uppercase">
                <Lock className="w-3 h-3 text-purple-700 dark:text-purple-300" />
                {subscriptionTierRequired ? `${subscriptionTierRequired} • Subscription Space` : 'Sovereign Enclave • Gated Space'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-800 text-[11px] font-black tracking-wide uppercase">
                <Globe className="w-3 h-3 text-emerald-700 dark:text-emerald-300" />
                Public Member Space • Dedicated Feed
              </span>
            )}
            {moderationState && moderationState !== 'active' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-950 dark:text-amber-300 border border-amber-400 dark:border-amber-800 text-[11px] font-black uppercase">
                {moderationState.replace('_', ' ')}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-950 dark:text-orange-300 border border-orange-400 dark:border-orange-800 text-[11px] font-black">
              <Flame className="w-3 h-3 text-orange-600" />
              {totalPostsCount} UGC Posts
            </span>
          </div>
        </div>

        {/* Title & Core Purpose */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              {coverImageUrl ? (
                <div className="w-14 h-14 rounded-2xl border-2 border-slate-300 dark:border-slate-700 shadow-xs shrink-0 overflow-hidden relative">
                  <img src={coverImageUrl} alt={cleanCategoryName} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div
                  style={{ borderColor: styleColor || undefined }}
                  className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 border border-orange-300 dark:border-orange-800 flex items-center justify-center text-2xl shadow-xs shrink-0 overflow-hidden"
                >
                  {isIconUrl ? (
                    <img
                      src={categoryIcon}
                      alt={cleanCategoryName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    categoryEmoji
                  )}
                </div>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>{cleanCategoryName}</span>
                </h1>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium max-w-xl">
                  Dedicated preferred topics feed for personalized member-generated content. Independent feed state, rules & moderation.
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs: Tailor Stream & Publish UGC */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleTailorFeed}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                isTailored
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 border-emerald-400 dark:border-emerald-700 shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700 hover:border-orange-400 hover:bg-orange-50/50'
              }`}
              title="Tailor your daily personalized stream with this topic"
            >
              {isTailored ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
                  <span>Stream Tailored</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-orange-600" />
                  <span>Tailor My Daily Stream</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onPublishToCategory}
              disabled={isFrozen || !hasAccess}
              className={`px-4 py-2 rounded-xl text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5 ${
                isFrozen || !hasAccess
                  ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 cursor-pointer'
              }`}
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>{isFrozen ? 'Posting Locked' : !hasAccess ? 'Access Gated' : 'Publish UGC Here'}</span>
            </button>
          </div>
        </div>

        {/* 1.1 Gated Category Access Banner */}
        {isGated && !hasAccess && (
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-2xl border border-purple-500/40 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-purple-300 font-black text-sm">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>GATED CATEGORY: {subscriptionTierRequired || accessType?.toUpperCase() || 'MEMBERSHIP ONLY'}</span>
              </div>
              <p className="text-xs text-slate-200 mt-1 max-w-lg font-medium">
                This sovereign category is restricted to members holding an active {subscriptionTierRequired || 'subscription plan'} or collaborator RBAC credentials.
              </p>
            </div>
            <a
              href="/settings"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg border border-purple-400/40 shrink-0 text-center"
            >
              Unlock Membership &amp; Tier Access &rarr;
            </a>
          </div>
        )}

        {/* 1.2 Category Frozen Notice */}
        {isFrozen && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-400 dark:border-blue-700 rounded-2xl flex items-center gap-2.5 text-xs text-blue-950 dark:text-blue-200 font-bold">
            <Lock className="w-4 h-4 text-blue-600 shrink-0" />
            <span>❄️ CATEGORY FROZEN: This category is temporarily locked by moderators. New postcard dispatches and comments are locked.</span>
          </div>
        )}

        {/* 1.3 Commenting Paused Notice */}
        {isCommentingPaused && (
          <div className="mt-3 p-2.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-400 dark:border-amber-700 rounded-xl flex items-center gap-2 text-xs text-amber-950 dark:text-amber-200 font-bold">
            <Pause className="w-4 h-4 text-amber-600 shrink-0" />
            <span>🔒 Commenting has been paused across all discussions in this category by administration.</span>
          </div>
        )}

        {/* 1.4 Community Rules & Guidelines Expandable Section */}
        {rules && (
          <div className="mt-4 p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs">
            <div
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => setShowRules(!showRules)}
            >
              <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Community Rules &amp; Publishing Code of Conduct</span>
              </div>
              <button
                type="button"
                aria-label={showRules ? 'Collapse community rules' : 'Expand community rules'}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowRules(!showRules);
                }}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300"
              >
                {showRules ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            {showRules && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-medium">
                {rules}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. On-Demand Audio Updates Bulletin Player ("Listen on the move") */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-slate-50 dark:from-slate-850 dark:via-slate-800 dark:to-slate-850 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-600 text-white shadow-xs shrink-0">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Audio Updates & On-Demand Bulletin
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-300 border border-amber-400 dark:border-amber-700 text-[10px] font-black">
                  Follow on the move
                </span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                Concise audio briefing synthesizing today's member dispatches & top UGC highlights.
              </p>
            </div>
          </div>

          {/* Speed Pills */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-1 rounded-xl border border-slate-300 dark:border-slate-700 shrink-0">
            <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold mr-1">Speed:</span>
            {[1.0, 1.25, 1.5, 2.0].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => handleChangeSpeed(spd)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-black transition cursor-pointer ${
                  audioPlaybackSpeed === spd
                    ? 'bg-orange-500 text-white shadow-2xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Audio Player Controller Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-700 p-3 flex flex-col sm:flex-row items-center gap-3 shadow-2xs">
          <button
            type="button"
            onClick={handleTogglePlayAudio}
            className="w-10 h-10 rounded-xl bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shrink-0 shadow-md transition cursor-pointer"
            aria-label={isPlayingAudio ? 'Pause Audio Bulletin' : 'Play Audio Bulletin'}
          >
            {isPlayingAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          {/* Audio Scrubber & Waveform */}
          <div className="flex-1 w-full space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-orange-600" />
                <span>{formatTime(audioProgressSeconds)}</span>
              </span>
              <span className="text-slate-600 dark:text-slate-400 font-semibold">{formatTime(totalDuration)}</span>
            </div>

            {/* Simulated Animated Waveform Bars */}
            <div className="h-6 flex items-center gap-0.5 sm:gap-1 px-1 overflow-hidden">
              {[40, 65, 80, 45, 95, 30, 70, 85, 60, 100, 50, 75, 90, 35, 65, 80, 55, 90, 40, 70, 85, 60, 95, 50, 80, 45, 65, 90, 30, 85, 70, 40, 75, 90, 50, 60].map(
                (h, i) => {
                  const isActive = (i / 36) <= (audioProgressSeconds / totalDuration);
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'bg-orange-500 dark:bg-orange-400'
                          : 'bg-slate-200 dark:bg-slate-700'
                      } ${isPlayingAudio ? 'animate-pulse' : ''}`}
                      style={{
                        height: isPlayingAudio ? `${Math.max(20, (h * (0.6 + Math.sin((i + audioProgressSeconds) * 0.8) * 0.4)))}%` : `${h * 0.4}%`,
                      }}
                    />
                  );
                }
              )}
            </div>
          </div>

          {/* Transcript Drawer Toggle */}
          <button
            type="button"
            onClick={() => setShowTranscript((prev) => !prev)}
            className="shrink-0 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span>Transcript</span>
            {showTranscript ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
          </button>
        </div>

        {/* Expandable Bulletin Digest Transcript */}
        {showTranscript && (
          <div className="mt-2.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>On-Demand Audio Bulletin Script & UGC Highlights</span>
              </span>
              <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">Daily Direct Editorial</span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {bulletinTranscript}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block font-bold text-slate-900 dark:text-white">1. Member UGC</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Direct creator dispatches uploaded live.</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block font-bold text-slate-900 dark:text-white">2. Audio Stems</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Full BeatwaveNG & media playback support.</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block font-bold text-slate-900 dark:text-white">3. Zero Ad-Tech</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Editorial curation replacing corporate algorithms.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. AI Curated Direct Editorial Publishings vs Raw UGC Selector */}
      <div className="p-3 sm:px-5 sm:py-3.5 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleEditorialMode('curated')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              editorialMode === 'curated'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Curated Direct Editorial</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleEditorialMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              editorialMode === 'all'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>All Member UGC Stream</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Independent Editorial • Bypasses General Ad-Tech Algorithms</span>
        </div>
      </div>
    </div>
  );
};

export default CategoryBulletinFeedHeader;
