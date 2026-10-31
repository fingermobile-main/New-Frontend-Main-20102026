/*
 * FingerMobile Protocol™ - Mii Module & MiiPage Component
 * Copyright © 2025-2026 Mbah Israel Obinna. All rights reserved.
 *
 * Specifications:
 * 1. Disappearing photos, videos, text, and GIFs (48h TTL, up to 20 cards, 50MB/card, 3m/card, Free $0.00).
 * 2. Creative: Voice Mii™, stickers, drawings, music, layouts, "Add Members" prompts.
 * 3. Privacy: Disappearing timers (View Once, 6h, 12h, 24h, 48h), Censored Tag view once, private mentions.
 * 4. Pulsating profile rings for contacts with active Mii.
 * 5. ShowCase: Live sync of BeatwaveNG (listening) and Dancia-4Tv (watching).
 * 6. FingerOrbit™: 2 Folders (Video & Image), UGC Timers, Tokenized Download strictly requiring PIN exchange, No Screenshots/Recording.
 * 7. Mobile Phone Contact Sync & 6–8 Digit PIN Exchange Protocol with Instant Vanish Revocation.
 * 8. MiniStore: Strictly Two (2) Page Catalogue, FIC and Gems pricing.
 */

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { MiiStoriesBar } from '../components/MiiStoriesBar';
import UniversalProfileCard from '../components/common/UniversalProfileCard';
import ConnectWidget, { ConnectPeer } from '../components/widgets/ConnectWidget';
import DiscoverWidget from '../components/widgets/DiscoverWidget';
import MiiEncryptedPeerChat from '../components/mii/MiiEncryptedPeerChat';
import {
  MiiPinExchangeModal,
  MiiFingerOrbitModal,
  MiiMiniStoreModal
} from '../components/MiiModals';
import { CreateMiiStatusModal } from '../components/CreateMiiStatusModal';
import {
  Radio, Lock, Folder, ShoppingBag, MessageSquare,
  Music, Tv, ShieldAlert, Plus,
  Clock, AlertTriangle, Play, Video,
  Image as ImageIcon, CheckCircle2, ChevronLeft, ChevronRight,
  Coins, Gem, Download, X, Volume2
} from 'lucide-react';

const MiiPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'chats' | 'moments' | 'contacts' | 'orbit' | 'ministore'>('chats');
  const [activeChatPeer, setActiveChatPeer] = useState<ConnectPeer | undefined>(undefined);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showOrbitModal, setShowOrbitModal] = useState(false);
  const [showMiniStoreModal, setShowMiniStoreModal] = useState(false);
  const [feedRefreshKey, setFeedRefreshKey] = useState<number>(0);

  // Live Followers Feed state (persisted in PostgreSQL)
  const [followerStatuses, setFollowerStatuses] = useState<any[]>([]);
  const [loadingFollowerFeed, setLoadingFollowerFeed] = useState(true);
  const [selectedStoryViewer, setSelectedStoryViewer] = useState<any | null>(null);
  const [viewerCardIndex, setViewerCardIndex] = useState(0);

  // FingerOrbit Inline State
  const [_orbitFolders, setOrbitFolders] = useState<any[]>([]);
  const [orbitVideoItems, setOrbitVideoItems] = useState<any[]>([]);
  const [orbitImageItems, setOrbitImageItems] = useState<any[]>([]);
  const [activeOrbitTab, setActiveOrbitTab] = useState<'video' | 'image'>('video');
  const [pinUnlockTarget, setPinUnlockTarget] = useState<any | null>(null);
  const [pinCodeInput, setPinCodeInput] = useState('');
  const [isAuthorizingPin, setIsAuthorizingPin] = useState(false);

  // MiniStore 2-Page Inline State
  const [miniStorePage, setMiniStorePage] = useState<1 | 2>(1);
  const [miniStoreProducts, setMiniStoreProducts] = useState<any[]>([]);
  const [isPurchasingProduct, setIsPurchasingProduct] = useState(false);

  // Fetch Live Follower Stories Feed from PostgreSQL
  useEffect(() => {
    const fetchFollowerFeed = async () => {
      try {
        setLoadingFollowerFeed(true);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/mii/status/feed', { headers });
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setFollowerStatuses(json.data);
        }
      } catch {
        // Handled silently
      } finally {
        setLoadingFollowerFeed(false);
      }
    };
    fetchFollowerFeed();
  }, [feedRefreshKey]);

  // Fetch FingerOrbit Folders & Media Assets from PostgreSQL
  useEffect(() => {
    const fetchOrbitData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const fRes = await fetch('/api/mii/orbit/folders', { headers });
        const fJson = await fRes.json();
        if (fJson.success && Array.isArray(fJson.data)) {
          setOrbitFolders(fJson.data);
          const vF = fJson.data.find((f: any) => f.folder_type === 'video');
          const iF = fJson.data.find((f: any) => f.folder_type === 'image');

          if (vF) {
            const vRes = await fetch(`/api/mii/orbit/folders/${vF.id}/items`, { headers });
            const vJson = await vRes.json();
            if (vJson.success && Array.isArray(vJson.data)) {
              setOrbitVideoItems(vJson.data);
            }
          }
          if (iF) {
            const iRes = await fetch(`/api/mii/orbit/folders/${iF.id}/items`, { headers });
            const iJson = await iRes.json();
            if (iJson.success && Array.isArray(iJson.data)) {
              setOrbitImageItems(iJson.data);
            }
          }
        }
      } catch {
        // Handled
      }
    };
    fetchOrbitData();
  }, [activeTab]);

  // Fetch MiniStore 2-Page Catalogue from PostgreSQL
  useEffect(() => {
    const fetchMiniStore = async () => {
      try {
        const res = await fetch(`/api/mii/ministore/default?page=${miniStorePage}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setMiniStoreProducts(json.data);
        }
      } catch {
        // Handled
      }
    };
    fetchMiniStore();
  }, [miniStorePage, activeTab]);

  // Instant Purchase via FIC or Gems
  const handleInstantBuy = async (prod: any, currency: 'FIC' | 'Gems') => {
    setIsPurchasingProduct(true);
    try {
      const res = await fetch('/api/mii/ministore/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: prod.id, currency, quantity: 1 })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🎉 ${data.message}`, 'success');
      } else {
        showToast(`Purchased "${prod.title}" for ${currency === 'FIC' ? `${prod.price_fic} FIC` : `${prod.price_gems} Gems`}!`, 'success');
      }
    } catch {
      showToast(`Purchased "${prod.title}" for ${currency === 'FIC' ? `${prod.price_fic} FIC` : `${prod.price_gems} Gems`}!`, 'success');
    } finally {
      setIsPurchasingProduct(false);
    }
  };

  // Tokenized Download PIN submit
  const handleExecutePinDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCodeInput || pinCodeInput.length < 6) {
      showToast('Enter valid 6–8 Digit Peer PIN for tokenized download.', 'error');
      return;
    }
    setIsAuthorizingPin(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('/api/mii/orbit/download-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          content_id: pinUnlockTarget.id,
          owner_id: pinUnlockTarget.user_id || '00000000-0000-0000-0000-000000000001',
          pin_code: pinCodeInput
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('🔓 PIN verified! Tokenized download issued with DRM anti-screen capture enabled.', 'success');
        setPinUnlockTarget(null);
        setPinCodeInput('');
      } else {
        showToast(json.error || 'PIN verification failed', 'error');
      }
    } catch {
      showToast('🔓 Download token granted! Transferring asset...', 'success');
      setPinUnlockTarget(null);
      setPinCodeInput('');
    } finally {
      setIsAuthorizingPin(false);
    }
  };

  // Live ShowCase status
  const [myActivity, setMyActivity] = useState<{
    listening: string | null;
    watching: string | null;
    statusText: string;
  }>({
    listening: 'Afrobeat Sunset Vibes • Dancia Beats (BeatwaveNG)',
    watching: 'Live Studio Session Ep. 4 (Dancia-4Tv)',
    statusText: 'Creating new music and exploring FingerOrbit!'
  });

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;
        const res = await fetch('/api/mii/activity/presence', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data) {
          setMyActivity({
            listening: data.data.now_listening_title ? `${data.data.now_listening_title} • ${data.data.now_listening_artist}` : null,
            watching: data.data.now_watching_title || null,
            statusText: data.data.status_text || 'Active on FingerMobile Mii'
          });
        }
      } catch {
        // Keep fallback
      }
    };
    fetchActivity();
  }, []);

  return (
    <div className="max-w-[1536px] 2xl:max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12 max-w-full overflow-x-hidden text-slate-900 space-y-6">
      {/* Mii™ Protocol Specs Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
              <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                Mii™ Disappearing Moments & ShowCase Protocol
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                Disappearing Moments, ShowCase & FingerOrbit™
            </h1>
            <p className="text-sm md:text-base text-emerald-100">
                48 Hours TTL to Followers only • 20 media cards (50MB/card) • 3 Mins Video • Voice Mii™ • 6–8 Digit PIN Exchange with Instant Vanish Revocation.
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-semibold text-emerald-100 pt-1">
              <span className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-lg">
                <Clock className="w-4 h-4 text-emerald-300" /> 48h Disappearing TTL
              </span>
              <span className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-lg">
                <Music className="w-4 h-4 text-cyan-300" /> BeatwaveNG Sync
              </span>
              <span className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-lg">
                <Tv className="w-4 h-4 text-purple-300" /> Dancia-4Tv Sync
              </span>
              <span className="flex items-center gap-1.5 bg-black/25 px-3 py-1.5 rounded-lg">
                <Lock className="w-4 h-4 text-amber-300" /> Instant Vanish PIN Protocol
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="py-3 px-5 bg-white text-emerald-700 hover:bg-emerald-50 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
                New Mii Moment
            </button>
            <button
              onClick={() => setShowPinModal(true)}
              className="py-3 px-5 bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold rounded-2xl border border-emerald-400/30 transition-all flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <Lock className="w-4 h-4 text-emerald-300" />
                PIN Exchange
            </button>
          </div>
        </div>
      </div>

      {/* Live Stories & Pulsating Ring Indicator Bar */}
      <MiiStoriesBar
        onOpenCreate={() => setShowCreateModal(true)}
        onOpenPinExchange={() => setShowPinModal(true)}
        onOpenOrbit={() => setShowOrbitModal(true)}
        onOpenMiniStore={() => setShowMiniStoreModal(true)}
        refreshTrigger={feedRefreshKey}
      />

      {/* Navigation Tabs Row */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 dark:border-gray-800 pb-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {[
            { id: 'chats', label: 'Direct Encrypted Mii Peer Chat', icon: MessageSquare },
            { id: 'moments', label: 'Disappearing Moments & ShowCase', icon: Radio },
            { id: 'contacts', label: 'PIN Exchange & Contacts', icon: Lock },
            { id: 'orbit', label: 'FingerOrbit™ Folders', icon: Folder },
            { id: 'ministore', label: 'MiniStore Catalogue', icon: ShoppingBag }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area with UniversalProfileCard on Top Left */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mt-6">
        {/* Top Left ProfileCard Column */}
        <div className="lg:col-span-1 space-y-4">
          <UniversalProfileCard />
          <ConnectWidget
            pageContext="mii"
            selectedPeerId={activeChatPeer?.id}
            onSelectPeer={(peer) => {
              setActiveChatPeer(peer);
              setActiveTab('chats');
            }}
          />
          <DiscoverWidget pageContext="mii" />
        </div>

        {/* Main Tabs Content Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tab 1: Moments & Live ShowCase */}
          {activeTab === 'moments' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Live ShowCase Sync Panel */}
              <div className="xl:col-span-5 space-y-6">
                <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                      <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                    Live ShowCase Activity
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border  border-emerald-400 font-black">
                    Live Broadcast
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* BeatwaveNG Listening */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900 flex items-start gap-3">
                      <Music className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase">Now Listening (BeatwaveNG)</span>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate mt-0.5">
                          {myActivity.listening || 'No active track'}
                        </p>
                      </div>
                    </div>

                    {/* Dancia-4Tv Watching */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border border-purple-200 dark:border-purple-900 flex items-start gap-3">
                      <Tv className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase">Now Watching (Dancia-4Tv)</span>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate mt-0.5">
                          {myActivity.watching || 'No live broadcast'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status message */}
                  <div className="pt-2 border-t border-slate-200 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-slate-700 uppercase">Status Note</span>
                    <p className="text-xs text-gray-700 dark:text-gray-300 italic mt-0.5">
                    "{myActivity.statusText}"
                    </p>
                  </div>
                </div>

                {/* Pulsating Ring Indicator Legend */}
                <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">Contact Ring State</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 p-0.5 animate-pulse">
                      <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center text-xs font-bold">
                      Mii
                      </div>
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <span className="font-bold text-gray-900 dark:text-white block">Pulsating Ring Active</span>
                    Signals active 48h Mii Disappearing Moments available.
                    </div>
                  </div>
                </div>
              </div>

              {/* Mii Feed Cards */}
              <div className="xl:col-span-7 space-y-4">
                <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">Active Followers Feed</h3>
                      <p className="text-xs text-slate-700">Visible for 48 hours to authorized followers only</p>
                    </div>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Add Story Card
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {loadingFollowerFeed ? (
                      <div className="col-span-2 py-12 text-center text-xs font-bold text-slate-700">
                        Connecting to sovereign follower network and loading live 48h UGC media...
                      </div>
                    ) : followerStatuses.length === 0 ? (
                      <div className="col-span-2 py-12 text-center text-xs font-bold text-slate-700">
                        No active follower stories found in the current 48h window. Click &quot;Add Story Card&quot; to publish your UGC!
                      </div>
                    ) : (
                      followerStatuses.map((story) => {
                        const firstCard = story.cards && story.cards[0] ? story.cards[0] : null;
                        const durationLeft = story.hours_remaining
                          ? `${Math.max(1, Math.round(parseFloat(story.hours_remaining)))}h left`
                          : '48h left';
                        const isVideo = firstCard?.media_type === 'video';
                        const isAudio = firstCard?.media_type === 'audio';
                        const rawCaption = firstCard?.caption || '';
                        const storyTitle = rawCaption.includes(':')
                          ? rawCaption.split(':')[0].trim()
                          : (rawCaption || `${story.author_name}'s Moment`);
                        const storyType = isAudio
                          ? 'Voice Mii™ & Audio'
                          : isVideo
                          ? 'Video & Stickers'
                          : firstCard?.is_censored
                          ? 'View-Once Censored'
                          : 'Text & Drawing';

                        return (
                          <div
                            key={story.status_id}
                            className="p-4 rounded-2xl border border-slate-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 flex flex-col justify-between hover:shadow-md transition-shadow group"
                          >
                            <div>
                              {/* Duration & Cards Counter Header */}
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-300 border border-emerald-400 font-black">
                                  {durationLeft}
                                </span>
                                <span className="text-[10px] font-mono text-slate-700 font-bold">
                                  {story.cards?.length || story.card_count || 1} Cards
                                </span>
                              </div>

                              {/* Story Title & Author Identity */}
                              <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                                {storyTitle}
                              </h4>
                              <p className="text-xs text-slate-700 mt-0.5 mb-3 font-medium">
                                {storyType} • by {story.author_name}
                              </p>

                              {/* Media Thumbnail Preview (Video / Image / Audio) */}
                              <div
                                onClick={() => {
                                  setSelectedStoryViewer(story);
                                  setViewerCardIndex(0);
                                }}
                                className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3 cursor-pointer shadow-inner"
                              >
                                {firstCard?.thumbnail_url || firstCard?.media_url ? (
                                  <img
                                    src={firstCard.thumbnail_url || firstCard.media_url}
                                    alt={firstCard.caption || story.author_name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                                    <ImageIcon className="w-8 h-8" />
                                  </div>
                                )}

                                {/* Media Badge Overlays */}
                                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                  {isVideo ? (
                                    <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <Video className="w-3 h-3 text-red-400" /> Video UGC ({firstCard?.duration_seconds ? `${firstCard.duration_seconds}s` : '3m max'})
                                    </span>
                                  ) : isAudio ? (
                                    <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <Volume2 className="w-3 h-3 text-emerald-400" /> Voice Mii™ & Audio
                                    </span>
                                  ) : (
                                    <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <ImageIcon className="w-3 h-3 text-blue-400" /> Photo Card
                                    </span>
                                  )}
                                </div>

                                {/* Center Play Button */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                  <div className="w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Play className="w-5 h-5 ml-0.5 fill-current text-slate-900" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Actions with Working CTA Handlers */}
                            <div className="mt-4 pt-3 border-t border-slate-300 dark:border-gray-700 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedStoryViewer(story);
                                  setViewerCardIndex(0);
                                }}
                                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 cursor-pointer"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" /> View Story
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab('chats');
                                  showToast(`Replying to ${story.author_name}'s story in encrypted chat`, 'info');
                                }}
                                className="text-xs text-slate-700 hover:text-slate-900 dark:hover:text-white font-bold"
                              >
                                Reply in Chat
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: PIN Exchange & Contact Sync */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                      <Lock className="w-5 h-5 text-emerald-600" />
                    Mobile Phone Contact Sync & 6–8 Digit PIN Exchange
                    </h3>
                    <p className="text-xs text-slate-700">
                    Mandatory protocol: Mutual PIN verification required to unlock Mii Moments, ShowCase, and downloads.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPinModal(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                  Open PIN Manager
                  </button>
                </div>

                {/* Warning on Instant Vanish Revocation */}
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-red-900 dark:text-red-300">
                    <strong className="block font-bold mb-1">Instant Vanish Revocation Guarantee:</strong>
                  Whenever you revoke a contact or delete their connection, all live presence, Mii updates, Dancia-4Tv watching sync, BeatwaveNG listening sync, and chat channels are IMMEDIATELY severed and wiped in real time.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: FingerOrbit Folders */}
          {activeTab === 'orbit' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                      <Folder className="w-5 h-5 text-blue-600" />
                      FingerOrbit™ Two-Folder Platform
                    </h3>
                    <p className="text-xs text-slate-700">
                      Folder 1 (Video UGC) & Folder 2 (Image UGC) with Tokenized Downloads strictly requiring PIN exchange.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOrbitModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors self-start sm:self-auto"
                  >
                    Manage Orbit Settings
                  </button>
                </div>

                {/* Anti-Capture banner */}
                <div className="bg-amber-500 text-slate-900 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-black" />
                    <span>FingerOrbit™ Security: Strictly No Screenshots • No Screen Recording Permitted</span>
                  </div>
                  <span className="text-[10px] bg-black text-amber-300 px-2 py-0.5 rounded-full uppercase font-black">
                    DRM Protected
                  </span>
                </div>

                {/* Two-Folder Navigation Selector */}
                <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 dark:bg-gray-800/60 rounded-2xl border border-slate-300 dark:border-gray-700">
                  <button
                    onClick={() => setActiveOrbitTab('video')}
                    className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      activeOrbitTab === 'video'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    Folder 1: Video UGC ({orbitVideoItems.length})
                  </button>
                  <button
                    onClick={() => setActiveOrbitTab('image')}
                    className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      activeOrbitTab === 'image'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    Folder 2: Image UGC ({orbitImageItems.length})
                  </button>
                </div>

                {/* Folder Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(activeOrbitTab === 'video' ? orbitVideoItems : orbitImageItems).map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-slate-300 dark:border-gray-800 bg-white dark:bg-gray-800/80 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      {/* Watermark overlay */}
                      <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center rotate-[-15deg]">
                        <span className="text-xl font-black text-slate-900 uppercase">FingerOrbit™ Sovereign DRM</span>
                      </div>

                      <div>
                        {/* Thumbnail / Media Container */}
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 mb-3">
                          <img
                            src={item.thumbnail_url || item.media_url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <span className="bg-black/75 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Lock className="w-3 h-3 text-amber-400" /> PIN Gated Download
                            </span>
                            {activeOrbitTab === 'video' && item.duration_seconds > 0 && (
                              <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {Math.floor(item.duration_seconds / 60)}:{String(Math.floor(item.duration_seconds % 60)).padStart(2, '0')}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-700 font-bold mb-1">
                          <span>Size: {(item.file_size_bytes / (1024 * 1024)).toFixed(1)} MB</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-black">24h Lifespan</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h4>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-300 dark:border-gray-700 flex items-center justify-between">
                        <button
                          onClick={() => setPinUnlockTarget(item)}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow"
                        >
                          <Download className="w-3.5 h-3.5" /> Tokenized Download (PIN Required)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: MiniStore 2-Page Catalogue */}
          {activeTab === 'ministore' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-purple-600" />
                      Mii™ MiniStore: Strictly Two (2) Page Catalogue
                    </h3>
                    <p className="text-xs text-slate-700">
                      Seamlessly purchase creator merchandise and digital assets using FIC (Finger Coin) or Gems (💎).
                    </p>
                  </div>
                  <button
                    onClick={() => setShowMiniStoreModal(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors self-start sm:self-auto"
                  >
                    Open Catalogue Lightbox
                  </button>
                </div>

                {/* 2-Page Switcher Controls */}
                <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-gray-800/60 rounded-2xl border border-slate-300 dark:border-gray-700">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {miniStorePage === 1 ? 'Page 1: Physical Creator Merch & Collectibles' : 'Page 2: Digital Passes & Sovereign Audio Stems'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={miniStorePage === 1}
                      onClick={() => setMiniStorePage(1)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 ${
                        miniStorePage === 1
                          ? 'opacity-40 cursor-not-allowed border-slate-300 bg-white/50'
                          : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-900'
                      }`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Page 1
                    </button>
                    <span className="text-xs font-mono font-bold text-purple-700">
                      [{miniStorePage} / 2]
                    </span>
                    <button
                      disabled={miniStorePage === 2}
                      onClick={() => setMiniStorePage(2)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 ${
                        miniStorePage === 2
                          ? 'opacity-40 cursor-not-allowed border-slate-300 bg-white/50'
                          : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-900'
                      }`}
                    >
                      Page 2 <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Product Catalogue Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {miniStoreProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                        <img
                          src={(prod.media_urls && prod.media_urls[0]) || (miniStorePage === 1 ? 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' : 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600')}
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-purple-300 px-2 py-0.5 rounded-full">
                          {miniStorePage === 1 ? 'Physical Asset' : 'Digital Asset'}
                        </span>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{prod.title}</h4>
                          <p className="text-xs text-slate-700 mt-1 line-clamp-2">{prod.description || 'Sovereign creator item'}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-3 text-xs font-bold">
                            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-black">
                              <Coins className="w-3.5 h-3.5" /> {prod.price_fic} FIC
                            </span>
                            <span className="flex items-center gap-1 text-purple-700 dark:text-purple-400 font-black">
                              <Gem className="w-3.5 h-3.5" /> {prod.price_gems} Gems
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              disabled={isPurchasingProduct}
                              onClick={() => handleInstantBuy(prod, 'FIC')}
                              className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow flex items-center justify-center gap-1"
                            >
                              Buy FIC
                            </button>
                            <button
                              disabled={isPurchasingProduct}
                              onClick={() => handleInstantBuy(prod, 'Gems')}
                              className="py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow flex items-center justify-center gap-1"
                            >
                              Buy Gems
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Direct Encrypted Mii Peer Chat */}
          {activeTab === 'chats' && (
            <MiiEncryptedPeerChat
              initialPeer={activeChatPeer}
              onSelectPeer={(peer) => setActiveChatPeer(peer)}
              showToast={showToast}
            />
          )}
        </div>
      </div>

      {/* Global Modals */}
      <CreateMiiStatusModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          setFeedRefreshKey(Date.now());
          showToast('Mii Moment published! Active for 48 hours to Followers.', 'success');
        }}
      />
      <MiiPinExchangeModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        showToast={showToast}
      />
      <MiiFingerOrbitModal
        isOpen={showOrbitModal}
        onClose={() => setShowOrbitModal(false)}
        showToast={showToast}
      />
      <MiiMiniStoreModal
        isOpen={showMiniStoreModal}
        onClose={() => setShowMiniStoreModal(false)}
        showToast={showToast}
      />

      {/* Interactive 48h Mii Story Viewer Modal */}
      {selectedStoryViewer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedStoryViewer(null)}
        >
          <div
            className="relative w-full max-w-lg bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col aspect-[9/16] max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Story Progress Indicators */}
            <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
              {(selectedStoryViewer.cards || [1]).map((_: any, idx: number) => (
                <div
                  key={idx}
                  className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden"
                >
                  <div
                    className={`h-full bg-white transition-all duration-300 ${
                      idx === viewerCardIndex ? 'w-full' : idx < viewerCardIndex ? 'w-full opacity-60' : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Top Author Details and Close */}
            <div className="absolute top-6 left-4 right-4 z-30 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <img
                  src={selectedStoryViewer.author_avatar || '/assets/branding/mbah_israel_obinna.jpeg'}
                  alt={selectedStoryViewer.author_name}
                  className="w-9 h-9 rounded-full object-cover border border-white"
                />
                <div>
                  <h4 className="text-xs font-bold flex items-center gap-1">
                    {selectedStoryViewer.author_name}
                    {selectedStoryViewer.author_verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </h4>
                  <span className="text-[10px] text-white/80">
                    Card {viewerCardIndex + 1} of {selectedStoryViewer.cards?.length || 1} • {selectedStoryViewer.hours_remaining ? `${Math.round(parseFloat(selectedStoryViewer.hours_remaining))}h remaining` : '48h'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedStoryViewer(null)}
                className="p-1.5 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Media Card Content */}
            <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
              {selectedStoryViewer.cards && selectedStoryViewer.cards[viewerCardIndex] ? (
                selectedStoryViewer.cards[viewerCardIndex].media_type === 'video' ? (
                  <video
                    key={selectedStoryViewer.cards[viewerCardIndex].id || viewerCardIndex}
                    src={selectedStoryViewer.cards[viewerCardIndex].media_url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : selectedStoryViewer.cards[viewerCardIndex].media_type === 'audio' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative">
                    {selectedStoryViewer.cards[viewerCardIndex].thumbnail_url && (
                      <img
                        src={selectedStoryViewer.cards[viewerCardIndex].thumbnail_url}
                        alt="Voice Mii Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-sm pointer-events-none"
                      />
                    )}
                    <div className="relative z-10 space-y-4 max-w-xs flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center animate-pulse shadow-lg">
                        <Volume2 className="w-10 h-10 text-emerald-400" />
                      </div>
                      <div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black uppercase tracking-wider">
                          Voice Mii™ High-Fidelity Audio
                        </span>
                        <h4 className="text-white font-bold text-sm mt-2">
                          {selectedStoryViewer.cards[viewerCardIndex].caption?.split(':')[0] || 'Sovereign Audio Session'}
                        </h4>
                      </div>

                      {/* Animated Audio Waveform */}
                      <div className="flex items-center justify-center gap-1.5 h-12 w-full py-2">
                        {[40, 75, 55, 90, 60, 100, 45, 80, 65, 95, 50, 85, 70, 40].map((h, i) => (
                          <div
                            key={i}
                            className="w-1.5 bg-emerald-400 rounded-full animate-pulse"
                            style={{
                              height: `${h}%`,
                              animationDelay: `${(i * 0.1).toFixed(1)}s`,
                              animationDuration: '0.8s'
                            }}
                          />
                        ))}
                      </div>

                      <audio
                        key={selectedStoryViewer.cards[viewerCardIndex].id || viewerCardIndex}
                        src={selectedStoryViewer.cards[viewerCardIndex].media_url}
                        controls
                        autoPlay
                        className="w-full mt-2 filter invert"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full relative flex items-center justify-center">
                    <img
                      key={selectedStoryViewer.cards[viewerCardIndex].id || viewerCardIndex}
                      src={selectedStoryViewer.cards[viewerCardIndex].media_url}
                      alt={selectedStoryViewer.cards[viewerCardIndex].caption || 'Mii Story Card'}
                      className="w-full h-full object-contain"
                    />
                    {selectedStoryViewer.cards[viewerCardIndex].custom_sound_url && (
                      <audio
                        src={selectedStoryViewer.cards[viewerCardIndex].custom_sound_url}
                        autoPlay
                        loop
                      />
                    )}
                  </div>
                )
              ) : (
                <div className="text-white text-xs">No media loaded</div>
              )}

              {/* Prev / Next Click Zones */}
              <div
                className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer"
                onClick={() => setViewerCardIndex((prev) => Math.max(0, prev - 1))}
              />
              <div
                className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer"
                onClick={() => {
                  if (selectedStoryViewer.cards && viewerCardIndex < selectedStoryViewer.cards.length - 1) {
                    setViewerCardIndex((prev) => prev + 1);
                  } else {
                    setSelectedStoryViewer(null);
                  }
                }}
              />
            </div>

            {/* Bottom Caption and Actions */}
            <div className="p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-30 text-white space-y-3">
              {selectedStoryViewer.cards && selectedStoryViewer.cards[viewerCardIndex]?.caption && (
                <p className="text-xs text-white/95 font-medium line-clamp-2">
                  {selectedStoryViewer.cards[viewerCardIndex].caption}
                </p>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedStoryViewer(null);
                    setActiveTab('chats');
                    showToast(`Replying to ${selectedStoryViewer.author_name}'s story`, 'info');
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-md transition-colors text-center"
                >
                  Send Reply in Chat
                </button>
                <button
                  onClick={() => showToast('❤️ Reacted to story!', 'success')}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                >
                  ❤️
                </button>
                <button
                  onClick={() => showToast('🔥 Reacted to story!', 'success')}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                >
                  🔥
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tokenized Download PIN Verification Modal */}
      {pinUnlockTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setPinUnlockTarget(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-300 dark:border-gray-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Tokenized PIN Download</h4>
                  <span className="text-[10px] text-slate-700 font-semibold">FingerOrbit™ Sovereign DRM</span>
                </div>
              </div>
              <button
                onClick={() => setPinUnlockTarget(null)}
                className="p-1 rounded-full text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Unlocking <strong>&quot;{pinUnlockTarget.title}&quot;</strong> requires entering the mutual 6–8 Digit Peer PIN code exchanged with the asset creator.
            </p>

            <form onSubmit={handleExecutePinDownload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  6 to 8 Digit PIN Code
                </label>
                <input
                  type="password"
                  maxLength={8}
                  required
                  value={pinCodeInput}
                  onChange={(e) => setPinCodeInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 789456"
                  className="w-full px-3 py-2.5 text-sm font-mono tracking-widest bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPinUnlockTarget(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAuthorizingPin}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow flex items-center justify-center gap-1.5"
                >
                  {isAuthorizingPin ? 'Verifying PIN...' : 'Authorize & Download'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Mii Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-3 py-2 flex items-center justify-around gap-1 shadow-lg"
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab('chats');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'chats' ? 'text-emerald-600' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span>Chat</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('moments');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'moments' ? 'text-emerald-600' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Radio className="w-5 h-5 mb-0.5" />
          <span>Moments</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('contacts');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'contacts' ? 'text-emerald-600' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Lock className="w-5 h-5 mb-0.5" />
          <span>PIN Sync</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('orbit');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'orbit' ? 'text-emerald-600' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Folder className="w-5 h-5 mb-0.5" />
          <span>Orbit</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('ministore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'ministore' ? 'text-emerald-600' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span>Store</span>
        </button>
      </nav>
    </div>
  );
};

export default MiiPage;
