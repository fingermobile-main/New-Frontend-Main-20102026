/*
 * FingerMobile Protocol™ - Friends Directory, Pending Requests & 7-Day Visitors
 * Document: Member Users Profile Page Wall Charter Development 15102026.md
 * 1. Verified Connections Directory (Search & Explore)
 * 2. Pending Friend Requests (Accept/Decline incoming requests)
 * 3. 7-Day Profile Visitors & Frequency Tracker with Privacy Gating:
 *    "Except profile has been set on Private, friends only view"
 * Strictly compliant with WCAG AAA contrast hierarchy standards.
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  Clock,
  Eye,
  Search,
  Check,
  X,
  Shield,
  ShieldAlert,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Activity,
  Calendar,
  Lock,
  Globe
} from 'lucide-react';

export interface FriendItem {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  mutualCount: number;
  isOnline?: boolean;
}

export interface PendingFriendRequestItem {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_handle: string;
  sender_avatar: string;
  sender_role: string;
  mutual_count: number;
  created_at: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface ProfileVisitorItem {
  id: string;
  viewer_id: string;
  viewer_name: string;
  viewer_handle: string;
  viewer_avatar: string;
  viewer_role: string;
  is_friend: boolean;
  frequency_count: number;
  last_viewed_at: string;
  device_tier: string;
}

interface FriendsDirectorySectionProps {
  isOwner: boolean;
  currentProfilePrivacy?: 'public' | 'friends' | 'private';
  initialFriends?: FriendItem[];
  initialPendingRequests?: PendingFriendRequestItem[];
  initialVisitors7d?: ProfileVisitorItem[];
  // eslint-disable-next-line no-unused-vars
  onToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
  // eslint-disable-next-line no-unused-vars
  onNavigateProfile?: (handle: string) => void;
}

export const FriendsDirectorySection: React.FC<FriendsDirectorySectionProps> = ({
  isOwner,
  currentProfilePrivacy = 'public',
  initialFriends,
  initialPendingRequests,
  initialVisitors7d,
  onToast,
  onNavigateProfile
}) => {
  // Sub-tab selection
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'pending' | 'visitors'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [privacySetting, setPrivacySetting] = useState<'public' | 'friends' | 'private'>(currentProfilePrivacy);

  // Friends List State
  const [friendsList, setFriendsList] = useState<FriendItem[]>(
    initialFriends || [
      {
        id: 'f-1',
        name: 'Alex Chen',
        handle: 'alexchen',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        role: 'Privacy Researcher & Sovereign Dev',
        mutualCount: 14,
        isOnline: true
      },
      {
        id: 'f-2',
        name: 'Sarah Jenkins',
        handle: 'sarahjenkins',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        role: 'Cryptographic Protocol Researcher',
        mutualCount: 19,
        isOnline: true
      },
      {
        id: 'f-3',
        name: 'Michael Scott',
        handle: 'michaelscott',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        role: 'Regional Commerce Director',
        mutualCount: 8,
        isOnline: false
      },
      {
        id: 'f-4',
        name: 'Marcus Adeyemi',
        handle: 'marcusadeyemi',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200',
        role: 'Sovereign Ecosystem Engineer',
        mutualCount: 11,
        isOnline: true
      },
      {
        id: 'f-5',
        name: 'Elena Rostova',
        handle: 'elenarostova',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
        role: 'Audio Mastering Architect',
        mutualCount: 6,
        isOnline: false
      },
      {
        id: 'f-6',
        name: 'David Kim',
        handle: 'davidkim',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        role: 'Security Node Operator',
        mutualCount: 9,
        isOnline: true
      }
    ]
  );

  // Pending Requests State
  const [pendingRequests, setPendingRequests] = useState<PendingFriendRequestItem[]>(
    initialPendingRequests || [
      {
        id: 'req_001',
        sender_id: 'usr_sarah_01',
        sender_name: 'Dr. Sarah Jenkins',
        sender_handle: 'sarahjenkins',
        sender_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        sender_role: 'Cryptographic Protocols Lead',
        mutual_count: 7,
        created_at: '2 hours ago',
        status: 'pending'
      },
      {
        id: 'req_002',
        sender_id: 'usr_tunde_02',
        sender_name: 'Tunde Adeleke',
        sender_handle: 'tunde_dev',
        sender_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        sender_role: 'Sovereign Hardware Core Engineer',
        mutual_count: 4,
        created_at: 'Yesterday',
        status: 'pending'
      },
      {
        id: 'req_003',
        sender_id: 'usr_amara_03',
        sender_name: 'Amara Kalu',
        sender_handle: 'amara_beats',
        sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        sender_role: 'Beatwave Audio Synthesist',
        mutual_count: 3,
        created_at: '3 days ago',
        status: 'pending'
      }
    ]
  );

  // 7-Day Profile Visitors State
  const [allVisitors] = useState<ProfileVisitorItem[]>(
    initialVisitors7d || [
      {
        id: 'view_001',
        viewer_id: '00000000-0000-0000-0000-000000000002',
        viewer_name: 'Alex Chen',
        viewer_handle: 'alexchen',
        viewer_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        viewer_role: 'Privacy Researcher',
        is_friend: true,
        frequency_count: 9,
        last_viewed_at: '15m ago',
        device_tier: 'STERCS™ Sovereign Hardware Node'
      },
      {
        id: 'view_002',
        viewer_id: '00000000-0000-0000-0000-000000000004',
        viewer_name: 'Michael Scott',
        viewer_handle: 'michaelscott',
        viewer_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        viewer_role: 'Regional Director',
        is_friend: true,
        frequency_count: 4,
        last_viewed_at: '3h ago',
        device_tier: 'Web3 Gateway Client'
      },
      {
        id: 'view_003',
        viewer_id: 'usr_elena_05',
        viewer_name: 'Elena Rostova',
        viewer_handle: 'elenarostova',
        viewer_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        viewer_role: 'Audio Architect',
        is_friend: false,
        frequency_count: 6,
        last_viewed_at: 'Yesterday',
        device_tier: 'Encrypted Mobile Node'
      },
      {
        id: 'view_004',
        viewer_id: 'usr_david_06',
        viewer_name: 'David Kim',
        viewer_handle: 'davidkim',
        viewer_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        viewer_role: 'Security Node Operator',
        is_friend: false,
        frequency_count: 2,
        last_viewed_at: '2 days ago',
        device_tier: 'Tor / Mesh P2P Relay'
      },
      {
        id: 'view_005',
        viewer_id: 'usr_marcus_07',
        viewer_name: 'Marcus Adeyemi',
        viewer_handle: 'marcusadeyemi',
        viewer_avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200',
        viewer_role: 'Ecosystem Engineer',
        is_friend: true,
        frequency_count: 5,
        last_viewed_at: '4 days ago',
        device_tier: 'Sovereign Desktop Terminal'
      }
    ]
  );

  // Filtered Friends by Search
  const filteredFriends = friendsList.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // PRIVACY GATING RULE:
  // "except profile has been set on Private, friends only view"
  const visibleVisitors = allVisitors.filter((visitor) => {
    if (privacySetting === 'private' || privacySetting === 'friends') {
      return visitor.is_friend === true;
    }
    return true;
  });

  const totalViewsCount = visibleVisitors.reduce((acc, curr) => acc + curr.frequency_count, 0);

  // Actions
  const handleAcceptRequest = (request: PendingFriendRequestItem) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== request.id));
    setFriendsList((prev) => [
      {
        id: request.sender_id,
        name: request.sender_name,
        handle: request.sender_handle,
        avatar: request.sender_avatar,
        role: request.sender_role,
        mutualCount: request.mutual_count,
        isOnline: true
      },
      ...prev
    ]);
    if (onToast) {
      onToast(`Accepted connection request from ${request.sender_name}!`, 'success');
    }
  };

  const handleDeclineRequest = (request: PendingFriendRequestItem) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== request.id));
    if (onToast) {
      onToast(`Declined connection request from ${request.sender_name}.`, 'info');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-sm space-y-6">
      {/* 1. Header with Sub-Navigation Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-200 gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-600" />
            <span>Connections, Pending Requests & Profile Analytics</span>
          </h3>
          <p className="text-xs font-medium text-slate-700 mt-0.5">
            Manage peer connections, review pending handshake invitations, and monitor 7-day visitor engagement frequencies.
          </p>
        </div>

        {/* Sub-Navigation Pills */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-300 shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>All Connections ({friendsList.length})</span>
          </button>

          {isOwner && (
            <button
              type="button"
              onClick={() => setActiveSubTab('pending')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 relative ${
                activeSubTab === 'pending'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-600" />
              <span>Pending Requests</span>
              {pendingRequests.length > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-black">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveSubTab('visitors')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'visitors'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>7-Day Visitors ({visibleVisitors.length})</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: ALL CONNECTIONS                              */}
      {/* ======================================================== */}
      {activeSubTab === 'all' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-black text-slate-900">
              Verified Connections Directory ({filteredFriends.length})
            </span>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search connections by name or handle..."
                className="pl-9 pr-4 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-bold w-64 focus:ring-2 focus:ring-slate-900 focus:outline-hidden placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-300 flex items-center justify-between gap-3 shadow-xs hover:border-slate-400 transition-all group"
              >
                <div className="flex items-center gap-3 truncate min-w-0 flex-1">
                  <div className="relative shrink-0">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                    {friend.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="truncate min-w-0 flex-1">
                    <h4 className="text-xs font-black text-slate-900 truncate">{friend.name}</h4>
                    <span className="text-[11px] font-mono text-slate-600 block truncate">@{friend.handle}</span>
                    <span className="text-[10px] text-slate-700 font-bold block truncate mt-0.5">{friend.role}</span>
                    <span className="text-[10px] text-sky-800 font-semibold block truncate">
                      {friend.mutualCount} mutual connections
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onNavigateProfile && onNavigateProfile(friend.handle)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-300 shrink-0 cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => onToast && onToast(`Direct messaging channel opened with @${friend.handle}.`, 'info')}
                    className="p-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 flex items-center justify-center cursor-pointer"
                    title="Send Message"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredFriends.length === 0 && (
            <div className="py-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
              <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">No connections matching "{searchQuery}"</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Try searching with a different name or sovereign handle.</p>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: PENDING FRIEND REQUESTS                      */}
      {/* ======================================================== */}
      {activeSubTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-slate-900 block">
                Incoming Connection Requests ({pendingRequests.length})
              </span>
              <span className="text-[11px] font-medium text-slate-700">
                Members requesting permission to join your sovereign network enclave.
              </span>
            </div>
            {pendingRequests.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  pendingRequests.forEach((req) => handleAcceptRequest(req));
                  if (onToast) onToast('All pending requests accepted!', 'success');
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept All ({pendingRequests.length})</span>
              </button>
            )}
          </div>

          {pendingRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-amber-50/50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={req.sender_avatar}
                      alt={req.sender_name}
                      className="w-14 h-14 rounded-2xl object-cover border border-amber-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-black text-slate-900 truncate">{req.sender_name}</h4>
                      <span className="text-[11px] font-mono text-slate-600 block truncate">@{req.sender_handle}</span>
                      <span className="text-[10px] text-amber-900 font-bold block truncate mt-0.5">{req.sender_role}</span>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-600 font-medium">
                        <span className="text-sky-800 font-bold">{req.mutual_count} mutual friends</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3 text-slate-600" />
                          {req.created_at}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleAcceptRequest(req)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeclineRequest(req)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
              <UserCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs font-black text-slate-900">All connection requests handled</p>
              <p className="text-[11px] text-slate-600 mt-0.5">You have no pending connection requests awaiting approval.</p>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: 7-DAY PROFILE VISITORS & FREQUENCY            */}
      {/* ======================================================== */}
      {activeSubTab === 'visitors' && (
        <div className="space-y-4">
          {/* Privacy Enforcement Notice Banner */}
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              privacySetting === 'private' || privacySetting === 'friends'
                ? 'bg-purple-50/70 border-purple-300 text-purple-950'
                : 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  privacySetting === 'private' || privacySetting === 'friends'
                    ? 'bg-purple-100 text-purple-950 border border-purple-400 font-bold'
                    : 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold'
                }`}
              >
                {privacySetting === 'private' || privacySetting === 'friends' ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Globe className="w-4 h-4" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-black tracking-tight">
                  {privacySetting === 'private' || privacySetting === 'friends'
                    ? 'Private Profile Mode Active (Friends-Only Visitor Logging)'
                    : 'Public Profile Mode Active (Open Member Analytics)'}
                </h4>
                <p className="text-[11px] font-medium mt-0.5 leading-relaxed">
                  {privacySetting === 'private' || privacySetting === 'friends'
                    ? 'Under FingerMobile Sovereign Privacy Rules: Because this profile is set to Private / Friends Only, only verified connections who viewed your profile in the past 7 days are tracked. Stranger impressions are strictly masked.'
                    : 'All members and friends who accessed your public wall in the past 7 days are logged with their exact frequency number.'}
                </p>
              </div>
            </div>

            {/* Privacy Mode Simulation Selector */}
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Privacy:</span>
              <button
                type="button"
                onClick={() => setPrivacySetting(privacySetting === 'public' ? 'private' : 'public')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 text-[11px] font-bold shadow-2xs hover:bg-slate-50 cursor-pointer"
              >
                {privacySetting === 'public' ? 'Switch to Private' : 'Switch to Public'}
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-300">
              <span className="text-[10px] font-bold text-slate-600 block uppercase tracking-wider">
                Total Visits (7 Days)
              </span>
              <span className="text-lg font-black text-slate-900 mt-0.5 block">{totalViewsCount} visits</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-300">
              <span className="text-[10px] font-bold text-slate-600 block uppercase tracking-wider">
                Unique Visitors
              </span>
              <span className="text-lg font-black text-slate-900 mt-0.5 block">
                {visibleVisitors.length} participants
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-300 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-600 block uppercase tracking-wider">
                Privacy Enforcement
              </span>
              <span className="text-xs font-black text-emerald-800 mt-1 block flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                {privacySetting === 'private' || privacySetting === 'friends' ? 'Friends Only' : 'Universal'}
              </span>
            </div>
          </div>

          {/* Visitors Grid */}
          <div className="space-y-3">
            <span className="text-xs font-black text-slate-900 block">
              Recent Viewers & Visit Frequencies (Past 7 Days)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {visibleVisitors.map((visitor) => (
                <div
                  key={visitor.id}
                  className="p-4 rounded-2xl bg-white border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 truncate min-w-0 flex-1">
                    <img
                      src={visitor.viewer_avatar}
                      alt={visitor.viewer_name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="truncate min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <h4 className="text-xs font-black text-slate-900 truncate">{visitor.viewer_name}</h4>
                        {visitor.is_friend ? (
                          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-950 border border-emerald-400 rounded-md text-[9px] font-bold shrink-0">
                            Friend
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 bg-slate-100 text-slate-800 border border-slate-300 rounded-md text-[9px] font-bold shrink-0">
                            Member
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-600 block truncate">@{visitor.viewer_handle}</span>
                      <span className="text-[10px] text-slate-700 font-medium block truncate mt-0.5">
                        {visitor.viewer_role} • {visitor.device_tier}
                      </span>
                    </div>
                  </div>

                  {/* Frequency & Time Badge */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="px-2.5 py-1 bg-sky-100 text-sky-950 border border-sky-300 rounded-xl flex items-center gap-1.5 shadow-2xs">
                      <Eye className="w-3.5 h-3.5 text-sky-700" />
                      <span className="text-xs font-black">{visitor.frequency_count}x</span>
                      <span className="text-[10px] font-bold text-sky-800">views</span>
                    </div>
                    <span className="text-[10px] text-slate-600 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-600" />
                      {visitor.last_viewed_at}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {visibleVisitors.length === 0 && (
              <div className="py-10 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                <Eye className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">No profile views recorded under this privacy tier</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  When verified connections visit your wall, their 7-day visit frequencies appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
