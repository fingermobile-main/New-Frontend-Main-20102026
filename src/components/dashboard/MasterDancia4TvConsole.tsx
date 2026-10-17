/*
 * FingerMobile Protocol™ - Master Dashboard Dancia-4Tv Video Console
 * Video Streaming, Live Ingest & Temporal Video Asset Moderation
 * Freeze, Block, Unblock, Edit, Delete, Suspend, Issue Warnings & Flagging System (Red, Orange, Yellow, Green)
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import {
  Tv,
  Search,
  AlertTriangle,
  Lock,
  Unlock,
  Flag,
  Trash2,
  Edit3,
  Clock,
  Radio,
  UserX,
  CheckCircle2,
  VolumeX,
  Film,
  Camera
} from 'lucide-react';
import { CURATED_DANCIA_MOVIES } from '../../data/dancia4tvMovies';

export interface DanciaStreamAsset {
  id: string;
  title: string;
  creator: string;
  regionalCategory: string;
  genre: string;
  durationMinutes: number;
  quality: string;
  posterImage: string;
  videoUrl: string;
  sourceType: 'live_broadcast' | 'temporal_drop' | 'studio_vod' | 'community_upload';
  ttlDays: 3 | 7 | 30;
  daysRemaining: number;
  moderationStatus: 'active' | 'frozen' | 'blocked' | 'suspended';
  flag: 'green' | 'yellow' | 'orange' | 'red';
  warningCount: number;
  adminNotes?: string;
}

const STORAGE_KEY = 'fmp_dancia4tv_moderation_v2';

export const MasterDancia4TvConsole: React.FC = () => {
  // Initial seed from curated data with temporal metadata and flags
  const [videoAssets, setVideoAssets] = useState<DanciaStreamAsset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }

    return [
      {
        id: 'dancia-stream-1',
        title: 'Lekki Tollgate Midnight Live Transmission',
        creator: 'Dancia Sovereign News Desk',
        regionalCategory: 'Nollywood',
        genre: 'Live News Broadcast',
        durationMinutes: 45,
        quality: '1080p Full HD',
        posterImage: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        sourceType: 'live_broadcast',
        ttlDays: 3,
        daysRemaining: 2,
        moderationStatus: 'active',
        flag: 'green',
        warningCount: 0
      },
      {
        id: 'dancia-stream-2',
        title: 'The Cyber-Heist of Marina Island',
        creator: 'Kunle Afolayan Studio',
        regionalCategory: 'Nollywood',
        genre: 'Action Cyberpunk Thriller',
        durationMinutes: 118,
        quality: '4K Ultra HD',
        posterImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        sourceType: 'studio_vod',
        ttlDays: 30,
        daysRemaining: 30,
        moderationStatus: 'active',
        flag: 'green',
        warningCount: 0
      },
      {
        id: 'dancia-stream-3',
        title: 'Underground Lagos Street Beats & Drift 2026',
        creator: 'Mainland Boyz Collective',
        regionalCategory: 'Nollywood',
        genre: 'Urban Street Docu-Series',
        durationMinutes: 32,
        quality: '1080p Full HD',
        posterImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        sourceType: 'temporal_drop',
        ttlDays: 7,
        daysRemaining: 6,
        moderationStatus: 'active',
        flag: 'yellow',
        warningCount: 1,
        adminNotes: 'Music copyright synchronization check pending.'
      },
      {
        id: 'dancia-stream-4',
        title: 'Benin Bronze Cosmic Portal (Rough Cut)',
        creator: 'Osasuyi Visuals',
        regionalCategory: 'Nollywood',
        genre: 'Sci-Fi Short Film',
        durationMinutes: 24,
        quality: '720p HD',
        posterImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        sourceType: 'community_upload',
        ttlDays: 3,
        daysRemaining: 1,
        moderationStatus: 'active',
        flag: 'orange',
        warningCount: 2,
        adminNotes: 'Unfiltered crowd audio requires loudness normalization review.'
      },
      ...CURATED_DANCIA_MOVIES.slice(0, 4).map((m: any, idx: number) => ({
        id: `dancia-cat-${idx + 5}`,
        title: m.title,
        creator: m.director,
        regionalCategory: m.regionalCategory,
        genre: m.genre,
        durationMinutes: m.durationMinutes,
        quality: m.quality,
        posterImage: m.posterImage,
        videoUrl: m.videoUrl,
        sourceType: 'studio_vod' as const,
        ttlDays: 30 as const,
        daysRemaining: 30,
        moderationStatus: 'active' as const,
        flag: 'green' as const,
        warningCount: 0
      }))
    ];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videoAssets));
  }, [videoAssets]);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'frozen' | 'blocked'>('all');
  const [flagFilter, setFlagFilter] = useState<'all' | 'red' | 'orange' | 'yellow' | 'green'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'live_broadcast' | 'temporal_drop' | 'studio_vod' | 'community_upload'>('all');

  // Modals
  const [editingItem, setEditingItem] = useState<DanciaStreamAsset | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCreator, setEditCreator] = useState('');
  const [editAdminNotes, setEditAdminNotes] = useState('');

  const [warningItem, setWarningItem] = useState<DanciaStreamAsset | null>(null);
  const [warningText, setWarningText] = useState('');

  // Statistics
  const totalAssets = videoAssets.length;
  const temporalCount = videoAssets.filter((v) => v.ttlDays <= 7).length;
  const liveCount = videoAssets.filter((v) => v.sourceType === 'live_broadcast').length;
  const redFlagsCount = videoAssets.filter((v) => v.flag === 'red').length;
  const orangeFlagsCount = videoAssets.filter((v) => v.flag === 'orange').length;
  const frozenCount = videoAssets.filter((v) => v.moderationStatus === 'frozen' || v.moderationStatus === 'blocked').length;

  // Filtered List
  const filteredAssets = videoAssets.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || item.moderationStatus === statusFilter;
    const matchesFlag =
      flagFilter === 'all' || item.flag === flagFilter;
    const matchesSource =
      sourceFilter === 'all' || item.sourceType === sourceFilter;
    return matchesSearch && matchesStatus && matchesFlag && matchesSource;
  });

  const handleToggleFreeze = (id: string) => {
    setVideoAssets((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.moderationStatus === 'frozen' ? 'active' : 'frozen';
          const nextFlag = nextStatus === 'frozen' ? 'orange' : 'green';
          return { ...item, moderationStatus: nextStatus, flag: nextFlag };
        }
        return item;
      })
    );
  };

  const handleToggleBlock = (id: string) => {
    setVideoAssets((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.moderationStatus === 'blocked' ? 'active' : 'blocked';
          const nextFlag = nextStatus === 'blocked' ? 'red' : 'green';
          return { ...item, moderationStatus: nextStatus, flag: nextFlag };
        }
        return item;
      })
    );
  };

  const handleSetFlag = (id: string, flag: 'green' | 'yellow' | 'orange' | 'red') => {
    setVideoAssets((prev) =>
      prev.map((item) => (item.id === id ? { ...item, flag } : item))
    );
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Permanently remove "${title}" from Dancia-4Tv video channels?`)) {
      setVideoAssets((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSuspendAccount = (item: DanciaStreamAsset) => {
    if (window.confirm(`Suspend broadcaster account "${item.creator}" and revoke live stream ingest credentials?`)) {
      setVideoAssets((prev) =>
        prev.map((v) =>
          v.id === item.id
            ? {
              ...v,
              moderationStatus: 'suspended',
              flag: 'red',
              adminNotes: 'Broadcaster suspended due to severe compliance violation.'
            }
            : v
        )
      );
    }
  };

  const handleOpenEdit = (item: DanciaStreamAsset) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditCreator(item.creator);
    setEditAdminNotes(item.adminNotes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setVideoAssets((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? {
            ...item,
            title: editTitle.trim(),
            creator: editCreator.trim(),
            adminNotes: editAdminNotes.trim()
          }
          : item
      )
    );
    setEditingItem(null);
  };

  const handleOpenWarning = (item: DanciaStreamAsset) => {
    setWarningItem(item);
    setWarningText(`Official Notice: Broadcast stream "${item.title}" contains unverified watermarks or unrated segments. Please update metadata within 24 hours.`);
  };

  const handleSendWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warningItem) return;
    setVideoAssets((prev) =>
      prev.map((item) => {
        if (item.id === warningItem.id) {
          const nextCount = item.warningCount + 1;
          const nextFlag = nextCount >= 3 ? 'red' : nextCount >= 2 ? 'orange' : 'yellow';
          return {
            ...item,
            warningCount: nextCount,
            flag: nextFlag,
            adminNotes: warningText.trim()
          };
        }
        return item;
      })
    );
    setWarningItem(null);
  };

  const getFlagBadge = (flag: string) => {
    switch (flag) {
    case 'red':
      return (
        <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-950 dark:bg-red-950 dark:text-red-300 border border-red-400 text-xs font-mono font-bold flex items-center gap-1 font-black">
          <Flag size={12} className="fill-red-500 text-red-500" />
            RED FLAG
        </span>
      );
    case 'orange':
      return (
        <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-950 dark:bg-orange-950 dark:text-orange-300 border border-orange-400 text-xs font-mono font-bold flex items-center gap-1 font-black">
          <Flag size={12} className="fill-orange-500 text-orange-500" />
            ORANGE FLAG
        </span>
      );
    case 'yellow':
      return (
        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-300 border border-amber-400 text-xs font-mono font-bold flex items-center gap-1 font-black">
          <Flag size={12} className="fill-amber-500 text-amber-500" />
            YELLOW FLAG
        </span>
      );
    case 'green':
    default:
      return (
        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-400 text-xs font-mono font-bold flex items-center gap-1 font-black">
          <Flag size={12} className="fill-emerald-500 text-emerald-500" />
            GREEN FLAG
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Console Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/60 to-slate-900 border border-rose-500/40 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold border border-rose-500/30 flex items-center gap-1.5">
              <Tv size={14} />
              Master Authority Console
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-mono font-bold">
              Dancia-4Tv Live Video &amp; Temporal Drops
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-2 text-white">
            Dancia-4Tv Master Broadcast &amp; Moderation Console
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Centralized supervisory console for Dancia-4Tv live broadcasts, temporal 3/7-day video drops, and VoD master releases. Immediate administrative actions to <strong>Freeze Streams</strong>, <strong>Block Transmissions</strong>, <strong>Edit Metadata</strong>, <strong>Delete Video Files</strong>, <strong>Suspend Accounts</strong>, <strong>Issue Warnings</strong>, and assign pinned <strong>Red, Orange, Yellow, and Green Flags</strong>.
          </p>
        </div>

        {/* Quick Flags Status Pill */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Live Broadcasts</div>
            <div className="text-lg font-black font-mono text-rose-400">{liveCount}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Temporal 3/7D</div>
            <div className="text-lg font-black font-mono text-amber-400">{temporalCount}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Flagged Risk</div>
            <div className="text-lg font-black font-mono text-rose-400">{redFlagsCount + orangeFlagsCount}</div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Total Video Streams</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalAssets}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Active Transcoding Ingests</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Temporal Drops Active</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{temporalCount}</div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold mt-0.5">3 &amp; 7-Day Auto-Purge TTL</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Pinned Flagged Risks</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{redFlagsCount + orangeFlagsCount}</div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-0.5">{redFlagsCount} Critical Red • {orangeFlagsCount} Orange</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Frozen / Blocked</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{frozenCount}</div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold mt-0.5">Stream Killswitch Active</div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-700" />
            <input
              type="text"
              placeholder="Search video stream title, creator, genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-bold text-slate-900 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 placeholder:text-slate-400 focus:ring-2"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="py-1.5 px-3 rounded-xl text-xs font-bold text-slate-900 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Status: All</option>
              <option value="active">Active Streams</option>
              <option value="frozen">Frozen Streams</option>
              <option value="blocked">Blocked Videos</option>
            </select>

            {/* Flag Filter */}
            <select
              value={flagFilter}
              onChange={(e) => setFlagFilter(e.target.value as any)}
              className="py-1.5 px-3 rounded-xl text-xs font-bold text-slate-900 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Flags: All Icons</option>
              <option value="red">🔴 Red Flags Only</option>
              <option value="orange">🟠 Orange Flags Only</option>
              <option value="yellow">🟡 Yellow Flags Only</option>
              <option value="green">🟢 Green Flags Only</option>
            </select>

            {/* Source Filter */}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="py-1.5 px-3 rounded-xl text-xs font-bold text-slate-900 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Source: All Types</option>
              <option value="live_broadcast">📡 Live Broadcast</option>
              <option value="temporal_drop">⏳ Temporal 3/7D Drop</option>
              <option value="studio_vod">🎬 Studio VoD Master</option>
              <option value="community_upload">📹 Community Upload</option>
            </select>
          </div>
        </div>
      </div>

      {/* Video Streams Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/70 text-[11px] uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300">
              <th className="py-3.5 px-4">Video Asset &amp; Broadcaster</th>
              <th className="py-3.5 px-4">Stream Source</th>
              <th className="py-3.5 px-4">Temporal TTL</th>
              <th className="py-3.5 px-4">Pinned Risk Flag</th>
              <th className="py-3.5 px-4">Stream Status</th>
              <th className="py-3.5 px-4 text-center">Warnings</th>
              <th className="py-3.5 px-4 text-right">Administrative Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                  No video streams found matching the active moderation filters.
                </td>
              </tr>
            ) : (
              filteredAssets.map((stream) => {
                const isFrozen = stream.moderationStatus === 'frozen';
                const isBlocked = stream.moderationStatus === 'blocked';
                const isSuspended = stream.moderationStatus === 'suspended';

                return (
                  <tr
                    key={stream.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      isBlocked
                        ? 'bg-red-50/40 dark:bg-red-950/20'
                        : isFrozen
                          ? 'bg-amber-50/40 dark:bg-amber-950/20'
                          : ''
                    }`}
                  >
                    {/* Video Asset Details */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={stream.posterImage}
                          alt={stream.title}
                          className="w-12 h-8 rounded-lg object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="font-black text-slate-900 dark:text-white line-clamp-1">
                            {stream.title}
                          </div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-400">
                            By <span className="font-bold text-slate-800 dark:text-slate-200">{stream.creator}</span> • {stream.quality} • {stream.durationMinutes}m
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Stream Source */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[10px] font-bold w-fit flex items-center gap-1 border border-slate-300 dark:border-slate-700">
                        {stream.sourceType === 'live_broadcast' ? (
                          <>
                            <Radio size={10} className="text-rose-500" /> Live Broadcast
                          </>
                        ) : stream.sourceType === 'temporal_drop' ? (
                          <>
                            <Clock size={10} className="text-amber-500" /> Temporal 3/7D Drop
                          </>
                        ) : stream.sourceType === 'studio_vod' ? (
                          <>
                            <Film size={10} className="text-blue-500" /> Studio VoD Master
                          </>
                        ) : (
                          <>
                            <Camera size={10} className="text-teal-500" /> Community Ingest
                          </>
                        )}
                      </span>
                    </td>

                    {/* Temporal TTL */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200">
                          <Clock size={12} className={stream.ttlDays <= 3 ? 'text-rose-500' : stream.ttlDays <= 7 ? 'text-amber-500' : 'text-emerald-500'} />
                          <span>{stream.daysRemaining}d remaining</span>
                        </div>
                        <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden border text-slate-950 border-slate-400 font-black">
                          <div
                            className={`h-full ${stream.ttlDays <= 3 ? 'bg-rose-500' : stream.ttlDays <= 7 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, (stream.daysRemaining / stream.ttlDays) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Pinned Risk Flag */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {getFlagBadge(stream.flag)}
                        <div className="flex items-center gap-0.5">
                          {(['green', 'yellow', 'orange', 'red'] as const).map((flagColor) => (
                            <button
                              key={flagColor}
                              type="button"
                              onClick={() => handleSetFlag(stream.id, flagColor)}
                              className={`w-4 h-4 rounded-full border transition-transform ${
                                flagColor === 'green'
                                  ? 'bg-emerald-500 border-emerald-600 hover:scale-125'
                                  : flagColor === 'yellow'
                                    ? 'bg-amber-400 border-amber-500 hover:scale-125'
                                    : flagColor === 'orange'
                                      ? 'bg-orange-500 border-orange-600 hover:scale-125'
                                      : 'bg-rose-600 border-rose-700 hover:scale-125'
                              } ${stream.flag === flagColor ? 'ring-2 ring-offset-1 ring-blue-500 scale-110' : 'opacity-60'}`}
                              title={`Set ${flagColor.toUpperCase()} Flag`}
                            />
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Stream Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold inline-flex items-center gap-1 ${
                          isBlocked
                            ? 'bg-red-100 text-red-950 dark:bg-red-950 dark:text-red-300 border border-red-400'
                            : isFrozen
                              ? 'bg-amber-100 text-red-950 dark:bg-amber-950 dark:text-amber-300 border border-red-400'
                              : isSuspended
                                ? 'bg-slate-200 text-red-950 dark:bg-slate-800 dark:text-slate-300 border border-red-400'
                                : 'bg-emerald-100 text-red-950 dark:bg-emerald-950 dark:text-emerald-300 border border-red-400'
                        }font-black`}
                      >
                        {isBlocked ? <Lock size={12} /> : isFrozen ? <VolumeX size={12} /> : <CheckCircle2 size={12} />}
                        {isBlocked ? 'BLOCKED' : isFrozen ? 'FROZEN' : isSuspended ? 'SUSPENDED' : 'LIVE'}
                      </span>
                    </td>

                    {/* Warnings */}
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                        stream.warningCount > 0
                          ? 'bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-300 border border-rose-400'
                          : 'bg-slate-100 text-rose-950 dark:bg-slate-800 dark:text-slate-400'
                      }font-black`}>
                        {stream.warningCount} / 3
                      </span>
                    </td>

                    {/* Actions Toolbar */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Freeze Stream */}
                        <button
                          type="button"
                          onClick={() => handleToggleFreeze(stream.id)}
                          className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                            isFrozen
                              ? 'bg-amber-500 text-black border-amber-600'
                              : 'bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/50 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                          }`}
                          title={isFrozen ? 'Unfreeze Stream' : 'Freeze Stream Transmission'}
                        >
                          <VolumeX size={14} />
                        </button>

                        {/* Block Video */}
                        <button
                          type="button"
                          onClick={() => handleToggleBlock(stream.id)}
                          className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                            isBlocked
                              ? 'bg-rose-600 text-white border-rose-700'
                              : 'bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                          }`}
                          title={isBlocked ? 'Unblock Video' : 'Block Video Asset'}
                        >
                          {isBlocked ? <Unlock size={14} /> : <Lock size={14} />}
                        </button>

                        {/* Edit Metadata */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(stream)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
                          title="Edit Video Stream Metadata"
                        >
                          <Edit3 size={14} />
                        </button>

                        {/* Issue Warning */}
                        <button
                          type="button"
                          onClick={() => handleOpenWarning(stream)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-slate-300 dark:border-slate-700"
                          title="Issue Broadcaster Warning"
                        >
                          <AlertTriangle size={14} />
                        </button>

                        {/* Suspend Account */}
                        <button
                          type="button"
                          onClick={() => handleSuspendAccount(stream)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-slate-300 dark:border-slate-700"
                          title="Suspend Broadcaster Account"
                        >
                          <UserX size={14} />
                        </button>

                        {/* Delete Asset */}
                        <button
                          type="button"
                          onClick={() => handleDelete(stream.id, stream.title)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 border border-slate-300 dark:border-slate-700"
                          title="Purge Video Stream"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Stream Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 size={16} className="text-blue-500" />
                Edit Dancia-4Tv Stream &bull; #{editingItem.id}
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-slate-700 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Video Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Broadcaster / Creator
                </label>
                <input
                  type="text"
                  required
                  value={editCreator}
                  onChange={(e) => setEditCreator(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Administrative Compliance Notes
                </label>
                <textarea
                  rows={2}
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30"
                >
                  Save Stream Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Broadcaster Warning Modal */}
      {warningItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-amber-400 dark:border-amber-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <AlertTriangle size={16} />
                Issue Broadcaster Warning &bull; Strike #{warningItem.warningCount + 1}
              </h3>
              <button
                type="button"
                onClick={() => setWarningItem(null)}
                className="text-slate-700 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300">
              Issuing a strike notification transmits an official warning to the creator studio console and updates the stream risk flag to <strong className="text-amber-500">YELLOW</strong> or <strong className="text-orange-500">ORANGE</strong>.
            </p>

            <form onSubmit={handleSendWarning} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Broadcaster Warning Notice Body *
                </label>
                <textarea
                  rows={4}
                  required
                  value={warningText}
                  onChange={(e) => setWarningText(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWarningItem(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-black text-xs shadow-md shadow-amber-600/30"
                >
                  Transmit Broadcaster Warning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterDancia4TvConsole;
