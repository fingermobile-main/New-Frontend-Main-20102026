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
import {
  MiiPinExchangeModal,
  MiiFingerOrbitModal,
  MiiMiniStoreModal
} from '../components/MiiModals';
import { CreatePubliciteeShortsModal } from '../components/CreatePubliciteeShortsModal';
import {
  Radio, Lock, Folder, ShoppingBag, MessageSquare,
  Music, Tv, ShieldAlert, Plus,
  Clock, AlertTriangle, Send
} from 'lucide-react';
import voiceLineServiceInstance from '../services/VoiceLineService';

interface DirectMessage {
  id: string;
  sender: 'me' | 'peer';
  text: string;
  timestamp: string;
}

const MiiPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'moments' | 'contacts' | 'orbit' | 'ministore' | 'chats'>('moments');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showOrbitModal, setShowOrbitModal] = useState(false);
  const [showMiniStoreModal, setShowMiniStoreModal] = useState(false);

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

  // Direct Peer Encrypted Messages
  const [messages, setMessages] = useState<DirectMessage[]>([
    { id: '1', sender: 'peer', text: 'Hey! Did you check out my latest Voice Mii™ snippet?', timestamp: '10:45 AM' },
    { id: '2', sender: 'me', text: 'Yes, absolutely love the BeatwaveNG track you synced in ShowCase!', timestamp: '10:46 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'me',
        text: chatInput.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    voiceLineServiceInstance.playCommentaryVoiceLine('mii');
    setChatInput('');
  };

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
      />

      {/* Navigation Tabs Row */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 dark:border-gray-800 pb-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {[
            { id: 'moments', label: 'Disappearing Moments & ShowCase', icon: Radio },
            { id: 'contacts', label: 'PIN Exchange & Contacts', icon: Lock },
            { id: 'orbit', label: 'FingerOrbit™ Folders', icon: Folder },
            { id: 'ministore', label: 'MiniStore Catalogue', icon: ShoppingBag },
            { id: 'chats', label: 'Encrypted Peer Chat', icon: MessageSquare }
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
                    {[
                      { title: 'Behind the Console Session', duration: '24h left', type: 'Voice Mii™ & Audio', cards: 4, author: 'Alex Johnson' },
                      { title: 'Dancia-4Tv Live Rehearsal', duration: '41h left', type: 'Video & Stickers', cards: 8, author: 'Sarah Williams' },
                      { title: 'Late Night Studio Thoughts', duration: '12h left', type: 'Text & Drawing', cards: 2, author: 'Michael Chen' },
                      { title: 'Exclusive Orbit Teaser', duration: '6h left', type: 'View-Once Censored', cards: 1, author: 'Emma Rodriguez' }
                    ].map((story, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl border border-slate-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 flex flex-col justify-between hover:shadow-md transition-shadow"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-300 border  border-emerald-400 font-black">
                              {story.duration}
                            </span>
                            <span className="text-[10px] font-mono text-slate-700">
                              {story.cards} Cards
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white">{story.title}</h4>
                          <p className="text-xs text-slate-700 mt-1">{story.type} • by {story.author}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-300 dark:border-gray-700 flex items-center justify-between">
                          <button
                            onClick={() => showToast(`Playing story by ${story.author}`, 'info')}
                            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                          View Story
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('chats');
                              showToast(`Replying to ${story.author}'s story in chat`, 'info');
                            }}
                            className="text-xs text-slate-700 hover:text-gray-900 dark:hover:text-white"
                          >
                          Reply in Chat
                          </button>
                        </div>
                      </div>
                    ))}
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
              <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                      <Folder className="w-5 h-5 text-blue-600" />
                    FingerOrbit™ Two-Folder Platform
                    </h3>
                    <p className="text-xs text-slate-700">
                    Folder 1 (Video UGC) & Folder 2 (Image UGC) with Tokenized Downloads strictly requiring PIN exchange.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOrbitModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                  Manage Orbit UGC
                  </button>
                </div>

                {/* Anti-Capture banner */}
                <div className="bg-amber-500 text-slate-900 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-black" />
                    <span>FingerOrbit™ Security: Strictly No Screenshots • No Screen Recording Permitted</span>
                  </div>
                  <span className="text-[10px] bg-black text-amber-300 px-2 py-0.5 rounded-full uppercase">
                  Protected
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: MiniStore 2-Page Catalogue */}
          {activeTab === 'ministore' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-purple-600" />
                    Mii™ MiniStore: Strictly Two (2) Page Catalogue
                    </h3>
                    <p className="text-xs text-slate-700">
                    Seamlessly purchase creator merchandise and digital assets using FIC (Finger Coin) or Gems (💎).
                    </p>
                  </div>
                  <button
                    onClick={() => setShowMiniStoreModal(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                  Launch MiniStore
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Encrypted Peer Chat */}
          {activeTab === 'chats' && (
            <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
              Direct Encrypted Mii Peer Chat
              </h3>

              <div className="h-64 overflow-y-auto space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-slate-300 dark:border-gray-700">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md p-3 rounded-2xl text-xs ${
                        m.sender === 'me'
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-none'
                      }`}
                    >
                      <p>{m.text}</p>
                      <span className={`text-[10px] mt-1 block text-right ${m.sender === 'me' ? 'text-emerald-100' : 'text-slate-600 font-medium'}`}>
                        {m.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type encrypted message or reply to Mii..."
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-bold border-slate-300 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Global Modals */}
      <CreatePubliciteeShortsModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
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

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Mii Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-3 py-2 flex items-center justify-around gap-1 shadow-lg"
      >
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
