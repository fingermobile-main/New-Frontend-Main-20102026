/*
 * FingerMobile Protocol™ - Master Dashboard BeatwaveNG Audio Console
 * Administrative Control, Temporal TTL Lifecycle, Content Moderation & Risk Flagging
 * Freeze, Block, Unblock, Edit, Delete, Suspend, Issue Warnings & Flagging System (Red, Orange, Yellow, Green)
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState } from 'react';
import {
  Music,
  Search,
  AlertTriangle,
  Lock,
  Unlock,
  Flag,
  Trash2,
  Edit3,
  Clock,
  Mic,
  FileAudio,
  FileText,
  Sparkles,
  UserX,
  CheckCircle2,
  VolumeX
} from 'lucide-react';
import { useBeatwaveNG, AudioNovelCard } from '../../contexts/BeatwaveNGContext';

export const MasterBeatwaveNGConsole: React.FC = () => {
  const {
    audioNovels,
    updateAudioNovelModeration,
    freezeAudioNovel,
    blockAudioNovel,
    unblockAudioNovel,
    setAudioNovelFlag,
    issueAudioNovelWarning,
    deleteAudioNovel
  } = useBeatwaveNG();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'frozen' | 'blocked'>('all');
  const [flagFilter, setFlagFilter] = useState<'all' | 'red' | 'orange' | 'yellow' | 'green'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'live_recording' | 'audio_upload' | 'text_upload' | 'ai_prompt'>('all');

  // Modals
  const [editingItem, setEditingItem] = useState<AudioNovelCard | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editSynopsis, setEditSynopsis] = useState('');
  const [editAdminNotes, setEditAdminNotes] = useState('');

  const [warningItem, setWarningItem] = useState<AudioNovelCard | null>(null);
  const [warningText, setWarningText] = useState('');


  // Statistics
  const totalAssets = audioNovels.length;
  const temporalCount = audioNovels.filter((n) => n.ttlDays <= 7).length;
  const liveMicCount = audioNovels.filter((n) => n.sourceType === 'live_recording').length;
  const audioUploadCount = audioNovels.filter((n) => n.sourceType === 'audio_upload').length;
  const redFlagsCount = audioNovels.filter((n) => n.flag === 'red').length;
  const orangeFlagsCount = audioNovels.filter((n) => n.flag === 'orange').length;
  const frozenCount = audioNovels.filter((n) => n.moderationStatus === 'frozen' || n.moderationStatus === 'blocked').length;

  // Filtered Assets
  const filteredAssets = audioNovels.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || item.moderationStatus === statusFilter;
    const matchesFlag =
      flagFilter === 'all' || item.flag === flagFilter;
    const matchesSource =
      sourceFilter === 'all' || item.sourceType === sourceFilter;
    return matchesSearch && matchesStatus && matchesFlag && matchesSource;
  });

  const handleOpenEdit = (item: AudioNovelCard) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditAuthor(item.author);
    setEditSynopsis(item.synopsis);
    setEditAdminNotes(item.adminNotes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateAudioNovelModeration(editingItem.id, {
      title: editTitle.trim(),
      author: editAuthor.trim(),
      synopsis: editSynopsis.trim(),
      adminNotes: editAdminNotes.trim()
    });
    setEditingItem(null);
  };

  const handleOpenWarning = (item: AudioNovelCard) => {
    setWarningItem(item);
    setWarningText('Notice: Audio asset violates Community Guidelines regarding unverified licensing. Please provide authorization within 48 hours.');
  };

  const handleSendWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warningItem) return;
    issueAudioNovelWarning(warningItem.id, warningText.trim());
    setWarningItem(null);
  };

  const handleToggleFreeze = (item: AudioNovelCard) => {
    if (item.moderationStatus === 'frozen') {
      unblockAudioNovel(item.id);
    } else {
      freezeAudioNovel(item.id);
    }
  };

  const handleToggleBlock = (item: AudioNovelCard) => {
    if (item.moderationStatus === 'blocked') {
      unblockAudioNovel(item.id);
    } else {
      blockAudioNovel(item.id);
    }
  };

  const handleSuspendAccount = (item: AudioNovelCard) => {
    const confirmSuspend = window.confirm(
      `Are you sure you want to suspend creator account "${item.author}" and revoke their audio publishing privileges?`
    );
    if (!confirmSuspend) return;
    updateAudioNovelModeration(item.id, {
      moderationStatus: 'suspended',
      flag: 'red',
      adminNotes: 'Creator account suspended due to critical safety or copyright violation.'
    });
  };

  const getFlagBadge = (flag?: string) => {
    switch (flag) {
    case 'red':
      return (
        <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-950 dark:bg-red-950 dark:text-red-300 border border-red-400 text-xs font-mono font-bold flex items-center gap-1 shadow-xs font-black">
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border border-emerald-500/40 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <Music size={14} />
              Master Authority Console
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[11px] font-mono font-bold">
              BeatwaveNG Audio &amp; AudioNovels
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-2 text-white">
            BeatwaveNG Master Moderation &amp; Ingestion Console
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Centralized supervisory console for all spoken AudioNovels, podcasts, studio mic recordings, and manuscript uploads. Real-time controls to <strong>Freeze</strong>, <strong>Block</strong>, <strong>Edit</strong>, <strong>Delete</strong>, <strong>Suspend Accounts</strong>, <strong>Issue Warnings</strong>, and assign pinned <strong>Red, Orange, Yellow, and Green Flags</strong>.
          </p>
        </div>

        {/* Quick Flags Status Pill */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Temporal 3/7D</div>
            <div className="text-lg font-black font-mono text-amber-400">{temporalCount}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Live Mic / Uploads</div>
            <div className="text-lg font-black font-mono text-teal-400">{liveMicCount + audioUploadCount}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Red / Orange Risk</div>
            <div className="text-lg font-black font-mono text-rose-400">{redFlagsCount + orangeFlagsCount}</div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Total AudioNovels</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalAssets}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">50 Card Quota Capacity</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Temporal Drops Active</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{temporalCount}</div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold mt-0.5">3 &amp; 7-Day TTL Lifecycles</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Pinned Flagged Risks</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{redFlagsCount + orangeFlagsCount}</div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-0.5">{redFlagsCount} Critical Red • {orangeFlagsCount} Orange</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Frozen / Blocked</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{frozenCount}</div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold mt-0.5">Stream Killswitch Engaged</div>
        </div>
      </div>

      {/* Supervisory Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-700" />
            <input
              type="text"
              placeholder="Search audio title, creator, genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-bold text-slate-900 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400"
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
              <option value="active">Active Playback</option>
              <option value="frozen">Frozen Streams</option>
              <option value="blocked">Blocked Assets</option>
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
              <option value="live_recording">🎙️ Live Studio Mic</option>
              <option value="audio_upload">🎵 Audio Stem Upload</option>
              <option value="text_upload">📄 Text Manuscript</option>
              <option value="ai_prompt">🤖 AI Prompt Synthesis</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audio Assets Management Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/70 text-[11px] uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300">
              <th className="py-3.5 px-4">Asset Details &amp; Creator</th>
              <th className="py-3.5 px-4">Source &amp; Ingestion</th>
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
                  No AudioNovels found matching the active moderation filters.
                </td>
              </tr>
            ) : (
              filteredAssets.map((novel) => {
                const isFrozen = novel.moderationStatus === 'frozen';
                const isBlocked = novel.moderationStatus === 'blocked';
                const isSuspended = novel.moderationStatus === 'suspended';

                return (
                  <tr
                    key={novel.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                      isBlocked
                        ? 'bg-red-50/40 dark:bg-red-950/20'
                        : isFrozen
                          ? 'bg-amber-50/40 dark:bg-amber-950/20'
                          : ''
                    }`}
                  >
                    {/* Asset Details */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={novel.coverArt}
                          alt={novel.title}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="font-black text-slate-900 dark:text-white line-clamp-1">
                            {novel.title}
                          </div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-400">
                            By <span className="font-bold text-slate-800 dark:text-slate-200">{novel.author}</span> • {novel.durationMinutes} mins
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Source & Ingestion */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[10px] font-bold w-fit flex items-center gap-1 border border-slate-300 dark:border-slate-700">
                          {novel.sourceType === 'live_recording' ? (
                            <>
                              <Mic size={10} className="text-rose-500" /> Live Studio Mic
                            </>
                          ) : novel.sourceType === 'audio_upload' ? (
                            <>
                              <FileAudio size={10} className="text-teal-500" /> Audio Stem Ingest
                            </>
                          ) : novel.sourceType === 'text_upload' ? (
                            <>
                              <FileText size={10} className="text-sky-500" /> Text Manuscript
                            </>
                          ) : (
                            <>
                              <Sparkles size={10} className="text-amber-500" /> AI Synthesized
                            </>
                          )}
                        </span>
                        {novel.sourceFileName && (
                          <span className="text-[10px] text-slate-500 font-mono truncate max-w-[140px]">
                            {novel.sourceFileName}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Temporal TTL */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200">
                          <Clock size={12} className={novel.ttlDays <= 3 ? 'text-rose-500' : novel.ttlDays <= 7 ? 'text-amber-500' : 'text-emerald-500'} />
                          <span>{novel.daysRemaining}d remaining</span>
                        </div>
                        <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden border text-slate-950 border-slate-400 font-black">
                          <div
                            className={`h-full ${novel.ttlDays <= 3 ? 'bg-rose-500' : novel.ttlDays <= 7 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, (novel.daysRemaining / novel.ttlDays) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Pinned Risk Flag (Red, Orange, Yellow, Green) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {getFlagBadge(novel.flag)}
                        <div className="flex items-center gap-0.5">
                          {(['green', 'yellow', 'orange', 'red'] as const).map((flagColor) => (
                            <button
                              key={flagColor}
                              type="button"
                              onClick={() => setAudioNovelFlag(novel.id, flagColor)}
                              className={`w-4 h-4 rounded-full border transition-transform ${
                                flagColor === 'green'
                                  ? 'bg-emerald-500 border-emerald-600 hover:scale-125'
                                  : flagColor === 'yellow'
                                    ? 'bg-amber-400 border-amber-500 hover:scale-125'
                                    : flagColor === 'orange'
                                      ? 'bg-orange-500 border-orange-600 hover:scale-125'
                                      : 'bg-rose-600 border-rose-700 hover:scale-125'
                              } ${novel.flag === flagColor ? 'ring-2 ring-offset-1 ring-blue-500 scale-110' : 'opacity-60'}`}
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
                              ? 'bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-300 border border-amber-400'
                              : isSuspended
                                ? 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-300 border border-slate-400'
                                : 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-400'
                        }`}
                      >
                        {isBlocked ? <Lock size={12} /> : isFrozen ? <VolumeX size={12} /> : <CheckCircle2 size={12} />}
                        {isBlocked ? 'BLOCKED' : isFrozen ? 'FROZEN' : isSuspended ? 'SUSPENDED' : 'ONLINE'}
                      </span>
                    </td>

                    {/* Warnings Count */}
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                        (novel.warningCount || 0) > 0
                          ? 'bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-300 border border-rose-400'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {novel.warningCount || 0} / 3
                      </span>
                    </td>

                    {/* Actions Toolbar */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Freeze Stream */}
                        <button
                          type="button"
                          onClick={() => handleToggleFreeze(novel)}
                          className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                            isFrozen
                              ? 'bg-amber-500 text-black border-amber-600'
                              : 'bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/50 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                          }`}
                          title={isFrozen ? 'Unfreeze Audio Stream' : 'Freeze Audio Stream'}
                        >
                          <VolumeX size={14} />
                        </button>

                        {/* Block / Unblock */}
                        <button
                          type="button"
                          onClick={() => handleToggleBlock(novel)}
                          className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                            isBlocked
                              ? 'bg-rose-600 text-white border-rose-700'
                              : 'bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                          }`}
                          title={isBlocked ? 'Unblock Asset' : 'Block Playback Asset'}
                        >
                          {isBlocked ? <Unlock size={14} /> : <Lock size={14} />}
                        </button>

                        {/* Edit Metadata */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(novel)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
                          title="Edit Audio Novel Metadata"
                        >
                          <Edit3 size={14} />
                        </button>

                        {/* Issue Warning */}
                        <button
                          type="button"
                          onClick={() => handleOpenWarning(novel)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-slate-300 dark:border-slate-700"
                          title="Issue Official Compliance Warning"
                        >
                          <AlertTriangle size={14} />
                        </button>

                        {/* Suspend Creator Account */}
                        <button
                          type="button"
                          onClick={() => handleSuspendAccount(novel)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-slate-300 dark:border-slate-700"
                          title="Suspend Creator Account"
                        >
                          <UserX size={14} />
                        </button>

                        {/* Delete Asset */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Permanently delete "${novel.title}" from BeatwaveNG?`)) {
                              deleteAudioNovel(novel.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 border border-slate-300 dark:border-slate-700"
                          title="Purge Audio Asset"
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

      {/* Edit Asset Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 size={16} className="text-blue-500" />
                Edit AudioNovel Asset &bull; #{editingItem.id}
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
                  Title
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
                  Author / Creator
                </label>
                <input
                  type="text"
                  required
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Synopsis
                </label>
                <textarea
                  rows={2}
                  value={editSynopsis}
                  onChange={(e) => setEditSynopsis(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Administrative Compliance Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Internal audit remarks or verification notices..."
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
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Warning Modal */}
      {warningItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-amber-400 dark:border-amber-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <AlertTriangle size={16} />
                Issue Regulatory Warning &bull; Strike #{((warningItem.warningCount || 0) + 1)}
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
              Issuing a warning increments the creator strike meter and automatically upgrades the asset risk flag to <strong className="text-amber-500">YELLOW</strong> or <strong className="text-orange-500">ORANGE</strong>.
            </p>

            <form onSubmit={handleSendWarning} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Warning Notice Body *
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
                  Transmit Warning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterBeatwaveNGConsole;
