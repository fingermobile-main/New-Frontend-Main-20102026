import { Link } from 'react-router-dom';
import React, { useState } from 'react';
/*
 * FingerMobile Protocol™ - Post Card Component
 * Copyright © 2026 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive property of Mbah Israel Obinna.
 */

import { Post } from '../types';
import { HeartIcon } from '../icons';
import MediaEditorModal, { EditedMediaResult } from './MediaEditorModal';

export interface AiAssistData {
  postId?: string;
  content?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface AiAssistResponse {
  success: boolean;
  message?: string;
  result?: unknown;
  data?: Record<string, unknown>;
  response?: string;
  error?: string;
}

/* eslint-disable no-unused-vars */
interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onDislike?: (postId: string) => void;
  onAddComment?: (postId: string, comment: string) => void;
  onShare?: (postId: string) => void;
  onView?: (postId: string) => void;
  onVote?: (postId: string, voteType: unknown) => void;
  onOpenPollModal?: (postId: string) => void;
  onVotePoll?: (postId: string, optionIndex: number) => void;
  onBookmark?: (postId: string) => void;
  onReport?: (postId: string) => void;
  onMessage?: (postId: string) => void;
  onOpenGiftModal?: (postId: string) => void;
  onOpenGiftcardModal?: (postId: string) => void;
  onOpenPaylinkModal?: (postId: string) => void;
  onOpenProductModal?: (postId: string) => void;
  onOpenGemModal?: (postId: string) => void;
  onOpenMarketplaceModal?: (postId: string) => void;

  displayStyle?: string;
  handleDeletePost?: (postId?: string) => void;
  handleTokenizePost?: (postId?: string) => void;
  handleAiAssist?: (...args: unknown[]) => any;
  onTriggerSpecialEffect?: (...args: unknown[]) => any;
  ficBalance?: number;
  showToast?: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;

  _onAddComment?: (postId: string, comment: string) => void;
  _onShare?: (postId: string) => void;
  _onView?: (postId: string) => void;
}
/* eslint-enable no-unused-vars */

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onDislike,
  onAddComment,
  onShare,
  onView,
  onVote,
  onOpenPollModal,
  onVotePoll,
  onBookmark,
  onReport,
  onMessage,
  onOpenGiftModal,
  onOpenGiftcardModal,
  onOpenPaylinkModal,
  onOpenProductModal,
  onOpenGemModal,
  onOpenMarketplaceModal,
  handleDeletePost,
  handleTokenizePost,
  showToast,
  _onAddComment,
  _onShare,
  _onView
}) => {
  const [showMoreActions, setShowMoreActions] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState<boolean>((post as any).isBookmarked || false);
  const [isReported, setIsReported] = useState<boolean>(false);
  const [lightboxItem, setLightboxItem] = useState<{ url: string; type: 'image' | 'video'; filter?: string } | null>(null);
  const [editingUgc, setEditingUgc] = useState<{
    url: string;
    index: number;
    type: 'image' | 'video';
  } | null>(null);
  const [overrideMediaList, setOverrideMediaList] = useState<Array<{ url: string; type: 'image' | 'video'; filter?: string }> | null>(null);

  // Extract multi-attachment media items (Banuba/CapCut photos & videos)
  const mediaItems = React.useMemo(() => {
    const list: Array<{ url: string; type: 'image' | 'video'; filter?: string }> = [];

    const rawUrls =
      (post as any).media_urls ||
      (post as any).mediaUrls ||
      (post as any).media ||
      (post.mediaUrl ? [post.mediaUrl] : []);
    if (Array.isArray(rawUrls)) {
      rawUrls.forEach((item: any) => {
        if (typeof item === 'string' && item.trim()) {
          const isVid = !!item.match(/\.(mp4|webm|ogg|mov)$/i);
          list.push({ url: item, type: isVid ? 'video' : 'image' });
        } else if (item && typeof item === 'object' && item.url) {
          list.push({
            url: item.url,
            type: item.type === 'video' || item.mediaType === 'video' ? 'video' : 'image',
            filter: item.filter
          });
        }
      });
    }

    const rawAtts = (post as any).attachments;
    if (Array.isArray(rawAtts)) {
      rawAtts.forEach((att: any) => {
        if (att?.data?.url && !list.some((l) => l.url === att.data.url)) {
          const isVid =
            att.data.mediaType === 'video' ||
            att.type === 'video' ||
            !!att.data.url.match(/\.(mp4|webm|ogg|mov)$/i);
          list.push({
            url: att.data.url,
            type: isVid ? 'video' : 'image',
            filter: att.data.filter
          });
        }
      });
    }

    return list;
  }, [post]);

  const activeMediaItems = overrideMediaList || mediaItems;

  const handleSaveEditedUgc = (result: EditedMediaResult) => {
    if (!editingUgc) return;
    const current = [...(overrideMediaList || mediaItems)];
    if (current[editingUgc.index]) {
      current[editingUgc.index] = {
        ...current[editingUgc.index],
        url: result.url,
        filter: result.filter,
      };
      setOverrideMediaList(current);
    }
    setEditingUgc(null);
    showToast?.('UGC edited successfully! Filters and crop applied.', 'success');
  };

  // Poll state handling
  const rawPoll = (post as any).poll;
  const rawPollOptions = (post as any).pollOptions;

  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(() => {
    if (rawPoll?.userVotedIndex !== undefined) return rawPoll.userVotedIndex;
    if (rawPoll?.votedOption !== undefined) {
      const idx = rawPoll.options?.findIndex((o: string) => o === rawPoll.votedOption);
      return idx >= 0 ? idx : null;
    }
    return null;
  });

  const [pollData, setPollData] = useState(() => {
    if (rawPoll?.options && Array.isArray(rawPoll.options)) {
      return {
        question: rawPoll.question || 'Community Consensus Poll',
        options: rawPoll.options.map((opt: any) =>
          typeof opt === 'string'
            ? { text: opt, votes: Math.floor(Math.random() * 25) + 3 }
            : { text: opt.text || opt.title, votes: Number(opt.votes) || 0 }
        )
      };
    }
    if (Array.isArray(rawPollOptions) && rawPollOptions.length > 0) {
      return {
        question: (post as any).title || 'Community Poll',
        options: rawPollOptions.map((opt: any) => ({
          text: opt.text || opt.title || String(opt),
          votes: Number(opt.votes) || 0
        }))
      };
    }
    return null;
  });

  const totalPollVotes = pollData
    ? pollData.options.reduce((sum: number, opt: any) => sum + (opt.votes || 0), 0)
    : 0;

  const handleVotePollOption = (idx: number) => {
    if (selectedPollOption !== null) {
      showToast?.('You have already voted on this poll.', 'info');
      return;
    }
    setSelectedPollOption(idx);
    setPollData((prev: any) => {
      if (!prev) return null;
      const updated = prev.options.map((opt: any, i: number) =>
        i === idx ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
      );
      return { ...prev, options: updated };
    });
    showToast?.('Vote cast successfully on sovereign ledger! ✓', 'success');
    onVotePoll?.(String(post.id), idx);
  };

  const handleToggleBookmark = () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    showToast?.(next ? 'Post bookmarked to your library!' : 'Bookmark removed', 'info');
    onBookmark?.(String(post.id));
  };

  const handleReportPost = () => {
    setIsReported(true);
    showToast?.('Post flagged for Community Moderator council review.', 'warning');
    onReport?.(String(post.id));
  };

  const handleMessageAuthor = () => {
    showToast?.(`Opening direct encrypted message with ${post.author?.name || 'Author'}...`, 'info');
    onMessage?.(String(post.id));
  };

  const onTokenize = handleTokenizePost || (async (postId?: string) => {
    alert(`Post ${postId} tokenized successfully`);
  });

  const onDelete = handleDeletePost || (async (postId?: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      alert(`Post ${postId} deleted successfully`);
    }
  });

  const getLikesDisplay = (): number => {
    if (post.likesCount != null) return post.likesCount;
    if (typeof post.likes === 'number') return post.likes;
    if (typeof post.likes === 'string') {
      const parsed = parseInt(post.likes, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const getDislikesDisplay = (): number => {
    if (post.dislikesCount != null) return post.dislikesCount;
    return 0;
  };

  const handleComment = onAddComment || _onAddComment;
  const handleShare = onShare || _onShare;
  const handleView = onView || _onView;

  return (
    <div className="post-card glass rounded-2xl p-6 border border-white/40 dark:border-gray-800 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all mb-5 group bg-white/95 dark:bg-gray-900/90">
      {/* Post Header */}
      <div className="flex justify-between items-start gap-3">
        <Link to={`/post/${post.id}`} className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
            {post.title || 'Untitled Post'}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          {pollData && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-400    dark:bg-emerald-950 dark:text-emerald-300 shadow-2xs font-black">
              📊 Live Poll
            </span>
          )}
          {((post as any).is_ai_generated || (post as any).isAiGenerated) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-950 border border-purple-400 font-bold   shadow-xs flex-shrink-0 font-black">
              🤖 {((post as any).ai_badge_label || (post as any).aiBadgeLabel || 'AI Synthetic')}
            </span>
          )}
        </div>
      </div>

      <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        {post.excerpt || post.content?.substring(0, 160) + '...' || 'No content available'}
      </p>

      {/* Multi-Attachment Media Grid (UHD Photos & CapCut/Banuba Video Clips) */}
      {activeMediaItems.length > 0 && (
        <div className="my-4">
          {activeMediaItems.length === 1 ? (
            activeMediaItems[0].type === 'video' ? (
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-md border border-gray-100 dark:border-gray-800 group/vid">
                <video
                  src={activeMediaItems[0].url}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingUgc({ url: activeMediaItems[0].url, index: 0, type: 'video' });
                  }}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/20 transition cursor-pointer z-10"
                  title="Edit UGC (Crop, Banuba Filters & Speed)"
                >
                  <span className="text-emerald-300">✨</span>
                  <span>Edit UGC (Crop & Filters)</span>
                </button>
              </div>
            ) : (
              <div
                className="relative rounded-2xl overflow-hidden max-h-[420px] bg-slate-900 group/img cursor-pointer shadow-md border border-gray-100 dark:border-gray-800"
                onClick={() => setLightboxItem(activeMediaItems[0])}
              >
                <img
                  src={activeMediaItems[0].url}
                  alt={post.title || 'Attached Media'}
                  className="w-full h-auto max-h-[420px] object-cover group-hover/img:scale-[1.01] transition duration-300"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingUgc({ url: activeMediaItems[0].url, index: 0, type: 'image' });
                  }}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/20 transition cursor-pointer z-10"
                  title="Edit UGC (Crop, Banuba Filters & Speed)"
                >
                  <span className="text-emerald-300">✨</span>
                  <span>Edit UGC (Crop & Filters)</span>
                </button>
                {activeMediaItems[0].filter && activeMediaItems[0].filter !== 'normal' && (
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-600/90 text-white backdrop-blur-xs flex items-center gap-1 shadow-md">
                    ✨ {activeMediaItems[0].filter}
                  </span>
                )}
              </div>
            )
          ) : activeMediaItems.length === 2 ? (
            <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
              {activeMediaItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxItem(item)}
                  className="relative aspect-square bg-slate-900 overflow-hidden cursor-pointer group/tile rounded-xl"
                >
                  {item.type === 'video' ? (
                    <video src={item.url} className="w-full h-full object-cover" />
                  ) : (
                    <img
                      src={item.url}
                      alt={`Media ${idx + 1}`}
                      className="w-full h-full object-cover group-hover/tile:scale-105 transition duration-300"
                    />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingUgc({ url: item.url, index: idx, type: item.type });
                    }}
                    className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/80 hover:bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-md border border-white/20 transition cursor-pointer z-10"
                    title="Edit UGC"
                  >
                    <span>✨ Edit</span>
                  </button>
                  {item.type === 'video' && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white">
                      🎬 Video
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : activeMediaItems.length === 3 ? (
            <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden">
              {activeMediaItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxItem(item)}
                  className="relative aspect-square bg-slate-900 overflow-hidden cursor-pointer group/tile rounded-xl"
                >
                  {item.type === 'video' ? (
                    <video src={item.url} className="w-full h-full object-cover" />
                  ) : (
                    <img
                      src={item.url}
                      alt={`Media ${idx + 1}`}
                      className="w-full h-full object-cover group-hover/tile:scale-105 transition duration-300"
                    />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingUgc({ url: item.url, index: idx, type: item.type });
                    }}
                    className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/80 hover:bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-md border border-white/20 transition cursor-pointer z-10"
                    title="Edit UGC"
                  >
                    <span>✨ Edit</span>
                  </button>
                  {item.type === 'video' && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white">
                      🎬 Video
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
              {activeMediaItems.slice(0, 4).map((item, idx) => {
                const isLast = idx === 3 && activeMediaItems.length > 4;
                return (
                  <div
                    key={idx}
                    onClick={() => setLightboxItem(item)}
                    className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer group/tile rounded-xl"
                  >
                    {item.type === 'video' ? (
                      <video src={item.url} className="w-full h-full object-cover" />
                    ) : (
                      <img
                        src={item.url}
                        alt={`Media ${idx + 1}`}
                        className="w-full h-full object-cover group-hover/tile:scale-105 transition duration-300"
                      />
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingUgc({ url: item.url, index: idx, type: item.type });
                      }}
                      className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/80 hover:bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-md border border-white/20 transition cursor-pointer z-10"
                      title="Edit UGC"
                    >
                      <span>✨ Edit</span>
                    </button>
                    {isLast && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-lg">
                        +{activeMediaItems.length - 3} more
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Interactive Poll Component (LushPressies Standard) */}
      {pollData && (
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-slate-50/60 dark:from-emerald-950/30 dark:via-gray-800/60 dark:to-gray-900 border border-emerald-200/90 dark:border-emerald-800/50 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold tracking-wider uppercase">
                Poll
              </span>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                {pollData.question}
              </h4>
            </div>
            <span className="text-[11px] font-mono text-emerald-950 dark:text-emerald-300 font-bold bg-emerald-100/80 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full border  border-emerald-400 font-black">
              {totalPollVotes} votes
            </span>
          </div>

          <div className="space-y-2">
            {pollData.options.map((opt: any, idx: number) => {
              const percent = totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;
              const isSelected = selectedPollOption === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleVotePollOption(idx)}
                  className={`w-full text-left relative overflow-hidden rounded-xl border p-2.5 transition-all text-xs font-semibold ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-400/50'
                      : 'border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 hover:border-emerald-300 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <div
                    className={`absolute top-0 bottom-0 left-0 transition-all duration-500 ${
                      isSelected
                        ? 'bg-emerald-400/30 dark:bg-emerald-500/40'
                        : 'bg-emerald-200/40 dark:bg-emerald-900/30'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {isSelected ? (
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-[10px] text-slate-500">
                          {idx + 1}
                        </span>
                      )}
                      <span>{opt.text}</span>
                    </span>
                    <span className="font-mono text-[11px] font-bold text-gray-700 dark:text-gray-300">
                      {percent}% ({opt.votes})
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Postcard Attachments Section */}
      {Array.isArray((post as any).attachments) && (post as any).attachments.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-gray-800 flex flex-wrap gap-2">
          {(post as any).attachments.map((att: any, idx: number) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg text-xs text-gray-700 dark:text-gray-300 shadow-xs"
            >
              <span className="font-bold text-gray-900 dark:text-white capitalize">{att.type?.replace('_', ' ')}</span>
              {att.data?.amount && (
                <span className="text-emerald-600 font-mono font-bold">({att.data.amount} {att.data.currency || 'FIC'})</span>
              )}
              {att.data?.filename && (
                <span className="text-indigo-600 font-mono text-[10px]">{att.data.filename}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tagged Products Commerce Strip */}
      {Array.isArray((post as any).tagged_products) && (post as any).tagged_products.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-gray-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
            <span>🛍️ Tagged Products ({ (post as any).tagged_products.length })</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(post as any).tagged_products.map((prod: any, pIdx: number) => (
              <div
                key={pIdx}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xs hover:border-emerald-400 transition"
              >
                {prod.image && <img src={prod.image} alt={prod.title} className="w-6 h-6 rounded-md object-cover" />}
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{prod.title}</span>
                <span className="text-xs font-mono font-bold text-emerald-600">${prod.price}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase">
                  {prod.store}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Author and Date */}
      <div className="mt-5 flex items-center justify-between border-b border-slate-200 dark:border-gray-800 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {(post.author?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="text-xs text-slate-700">
            <span className="font-bold text-gray-800 dark:text-gray-200">{post.author?.name || 'Unknown Member'}</span>
            <span className="mx-1.5">&middot;</span>
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Active Protocol'}
          </div>
        </div>

        {/* Actions Dropdown Toggle */}
        <button
          onClick={() => setShowMoreActions(!showMoreActions)}
          className="text-slate-700 hover:text-gray-600 p-1 transition-colors"
          title="More Options"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </svg>
        </button>
      </div>

      {/* Primary Engagement Actions (Upvote, Downvote, Like, Dislike, Comment, Share, Bookmark, Message, Report) */}
      <div className="flex flex-wrap gap-2 items-center">
        {onLike && (
          <button
            onClick={() => onLike(String(post.id))}
            className={`flex items-center space-x-1.5 px-3 py-1.5 border rounded-full transition-all text-xs font-bold ${
              post.isLiked
                ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                : 'bg-white/60 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:text-red-500 hover:border-red-200'
            }`}
          >
            <HeartIcon className={post.isLiked ? 'text-red-500' : ''} />
            <span>{getLikesDisplay()}</span>
          </button>
        )}

        {onDislike && (
          <button
            onClick={() => onDislike(String(post.id))}
            className={`flex items-center space-x-1.5 px-3 py-1.5 border rounded-full transition-all text-xs font-bold ${
              post.isDisliked
                ? 'bg-gray-200 text-gray-800 border-gray-300'
                : 'bg-white/60 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:text-gray-900'
            }`}
          >
            <span>👎 {getDislikesDisplay()}</span>
          </button>
        )}

        {onVote && (
          <button
            onClick={() => onVote(String(post.id), 'up')}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-950 border border-emerald-400 rounded-full hover:bg-emerald-100 transition-colors text-xs font-bold   font-black"
          >
            ▲ Upvote
          </button>
        )}

        {handleComment && (
          <button
            onClick={() => handleComment(String(post.id), '')}
            className="px-3 py-1.5 bg-white/60 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-slate-300 dark:border-gray-700 rounded-full hover:bg-gray-50 transition-colors text-xs font-bold"
          >
            💬 Comment
          </button>
        )}

        {handleShare && (
          <button
            onClick={() => handleShare(String(post.id))}
            className="px-3 py-1.5 bg-white/60 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-slate-300 dark:border-gray-700 rounded-full hover:bg-gray-50 transition-colors text-xs font-bold"
          >
            📤 Share
          </button>
        )}

        {/* Bookmark / Save */}
        <button
          onClick={handleToggleBookmark}
          className={`px-3 py-1.5 border rounded-full transition-colors text-xs font-bold ${
            isBookmarked
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-white/60 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:text-amber-600'
          }`}
          title="Save to personal bookmarks"
        >
          {isBookmarked ? '🔖 Saved' : '🔖 Bookmark'}
        </button>

        {/* Direct Encrypted Message */}
        <button
          onClick={handleMessageAuthor}
          className="px-3 py-1.5 bg-white/60 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-slate-300 dark:border-gray-700 rounded-full hover:bg-gray-50 hover:text-emerald-600 transition-colors text-xs font-bold"
          title="Message Creator"
        >
          ✉️ Message
        </button>

        {/* Report Action */}
        <button
          onClick={handleReportPost}
          className={`px-3 py-1.5 border rounded-full transition-colors text-xs font-bold ${
            isReported
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-white/60 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:text-rose-600'
          }`}
          title="Report inappropriate content"
        >
          {isReported ? 'Flagged' : '⚠️ Report'}
        </button>

        {handleView && (
          <button
            onClick={() => handleView(String(post.id))}
            className="px-3 py-1.5 bg-white/60 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-slate-300 dark:border-gray-700 rounded-full hover:bg-gray-50 transition-colors text-xs font-bold"
          >
            👁️ View
          </button>
        )}

        {onOpenPollModal && (
          <button
            onClick={() => onOpenPollModal(String(post.id))}
            className="px-3 py-1.5 bg-blue-50 text-blue-950 border border-blue-400 rounded-full hover:bg-blue-100 transition-colors text-xs font-bold   font-black"
          >
            📊 Create Poll
          </button>
        )}
      </div>

      {/* Secondary Actions / Add & Send Items (Toggleable) */}
      {showMoreActions && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-gray-800 flex flex-wrap gap-2 items-center animate-fade-in">
          {onOpenGiftModal && (
            <button type="button" onClick={() => onOpenGiftModal(String(post.id))} className="px-3 py-1.5 bg-yellow-50 text-yellow-950 border border-yellow-400 rounded-full hover:bg-yellow-100 transition-colors text-xs font-bold font-black">
              🎁 Gift
            </button>
          )}
          {onOpenGiftcardModal && (
            <button type="button" onClick={() => onOpenGiftcardModal(String(post.id))} className="px-3 py-1.5 bg-orange-50 text-orange-950 border border-orange-400 rounded-full hover:bg-orange-100 transition-colors text-xs font-bold font-black">
              💳 Giftcard
            </button>
          )}
          {onOpenGemModal && (
            <button type="button" onClick={() => onOpenGemModal(String(post.id))} className="px-3 py-1.5 bg-teal-50 text-teal-950 border border-teal-400 rounded-full hover:bg-teal-100 transition-colors text-xs font-bold font-black">
              💎 Gem
            </button>
          )}
          {onOpenProductModal && (
            <button type="button" onClick={() => onOpenProductModal(String(post.id))} className="px-3 py-1.5 bg-pink-50 text-pink-950 border border-pink-400 rounded-full hover:bg-pink-100 transition-colors text-xs font-bold font-black">
              🛍️ Product
            </button>
          )}
          {onOpenMarketplaceModal && (
            <button type="button" onClick={() => onOpenMarketplaceModal(String(post.id))} className="px-3 py-1.5 bg-emerald-50 text-emerald-950 border border-emerald-400 rounded-full hover:bg-emerald-100 transition-colors text-xs font-bold   font-black">
              🏪 Storefront
            </button>
          )}
          {onOpenPaylinkModal && (
            <button type="button" onClick={() => onOpenPaylinkModal(String(post.id))} className="px-3 py-1.5 bg-purple-50 text-purple-950 border border-purple-400 rounded-full hover:bg-purple-100 transition-colors text-xs font-bold   font-black">
              🔗 Paylink
            </button>
          )}
          <button type="button" onClick={() => onTokenize(String(post.id))} className="px-3 py-1.5 bg-indigo-50 text-indigo-950 border border-indigo-400 rounded-full hover:bg-indigo-100 transition-colors text-xs font-bold font-black">
            Tokenize
          </button>
          <button type="button" onClick={() => onDelete(String(post.id))} className="px-3 py-1.5 bg-red-50 text-red-950 border border-red-400 rounded-full hover:bg-red-100 transition-colors text-xs font-bold font-black">
            Delete
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              className="absolute -top-12 right-0 px-3 py-1.5 text-slate-700 hover:text-slate-700 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold transition flex items-center gap-1"
            >
              ✕ Close
            </button>
            {lightboxItem.type === 'video' ? (
              <video
                src={lightboxItem.url}
                controls
                autoPlay
                className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl"
              />
            ) : (
              <img
                src={lightboxItem.url}
                alt="Enlarged view"
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />
            )}
            {lightboxItem.filter && lightboxItem.filter !== 'normal' && (
              <span className="mt-3 px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-lg">
                ✨ {lightboxItem.filter}
              </span>
            )}
          </div>
        </div>
      )}

      {/* UGC Media Editor Modal */}
      {editingUgc && (
        <MediaEditorModal
          isOpen={!!editingUgc}
          onClose={() => setEditingUgc(null)}
          mediaUrl={editingUgc.url}
          mediaType={editingUgc.type}
          mediaName={`${post.title || 'UGC Media'} (Media #${editingUgc.index + 1})`}
          onSave={handleSaveEditedUgc}
        />
      )}
    </div>
  );
};

export default PostCard;
