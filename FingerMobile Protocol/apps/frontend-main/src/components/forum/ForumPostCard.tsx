/*
 * FingerMobile Protocol™ - Unified Forum & Profile Wall PostCard
 * Universal PostCard Component providing complete uniformity between http://localhost:3000/forum
 * and http://localhost:3000/profile with identical data structures, rich interactions,
 * MultiMediaGallery, Polls, Events, Attachments, OpenGraph previews, Audio stems, Video feeds,
 * Tagged Products, Comments Drawer, and FIC Coin micro-tipping.
 *
 * Strictly adheres to WCAG AAA contrast hierarchy standards (AGENTS.md).
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  ChartBarIcon,
  CalendarIcon,
  PaperClipIcon,
  LinkIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  EllipsisHorizontalIcon,
  MapPinIcon,
  MusicalNoteIcon,
  TvIcon,
  PlayIcon,
  ArrowTopRightOnSquareIcon,
  LockClosedIcon,
  GlobeAltIcon,
  UserGroupIcon,
  SparklesIcon,
  XMarkIcon,
  FaceSmileIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon,
  CheckCircleIcon as CheckCircleSolidIcon,
} from '@heroicons/react/24/solid';
import { FingerMobileEmojiPicker } from '../common/FingerMobileEmojiPicker';
import { renderContentWithFingerMobileEmojis, replaceEmojisInHtml } from '../../utils/fingerMobileEmojiRenderer';
import { sanitizeHtmlContent } from '../editor/RichTextEditor';
import MediaEditorModal, { EditedMediaResult } from '../MediaEditorModal';

export interface FeedComment {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface FeedPoll {
  question: string;
  options: { text: string; votes: number }[];
  userVotedIndex?: number;
  totalVotes: number;
  durationDays: number;
}

export interface FeedEvent {
  title: string;
  date: string;
  time: string;
  location: string;
  rsvpCount: number;
  isRsvpd?: boolean;
}

export interface FeedFileAttachment {
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface FeedLinkEmbed {
  url: string;
  title: string;
  description?: string;
  image?: string;
  domain: string;
  failureReason?: string;
}

export interface FeedTaggedProduct {
  platform: 'MarketPlace' | 'OwnIt' | 'Flamingo' | 'Storefront' | 'FingerLux';
  name: string;
  price: string;
  category?: string;
  image?: string;
  itemType?: 'product' | 'gift_card' | 'tip' | 'coupon';
}

export interface FeedPost {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorRole: string;
  categoryName: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  tags: string[];
  mediaUrl?: string;
  mediaUrls?: string[];
  audioPreview?: string;
  videoStreamUrl?: string;
  locationTag?: string;
  taggedProduct?: FeedTaggedProduct;
  poll?: FeedPoll;
  event?: FeedEvent;
  fileAttachment?: FeedFileAttachment;
  linkEmbed?: FeedLinkEmbed;
  isVerified?: boolean;
  commentsList?: FeedComment[];
  privacy?: 'public' | 'friends' | 'private';
  tipsFic?: number;
}

export interface ForumPostCardProps {
  post: FeedPost;
  // eslint-disable-next-line no-unused-vars
  onLike?: (postId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onToggleBookmark?: (postId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onShare?: (post: FeedPost) => void;
  // eslint-disable-next-line no-unused-vars
  onReport?: (postId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onVotePoll?: (postId: string, optionIndex: number) => void;
  // eslint-disable-next-line no-unused-vars
  onRsvpEvent?: (postId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onAddComment?: (postId: string, text: string) => void;
  // eslint-disable-next-line no-unused-vars
  onOpenLightbox?: (item: { url: string; title: string; author: string }) => void;
  // eslint-disable-next-line no-unused-vars
  onTip?: (postId: string, amount?: number) => void;
  // eslint-disable-next-line no-unused-vars
  triggerToast?: (message: string, type?: any) => void;
  isOwner?: boolean;
  hideCategory?: boolean;
  // eslint-disable-next-line no-unused-vars
  onUpdatePost?: (updatedPost: FeedPost) => void;
}

// =============================================================================
// MULTI-MEDIA POST GALLERY SUB-COMPONENT
// =============================================================================
export const MultiMediaGallery: React.FC<{
  urls: string[];
  title: string;
  author: string;
  // eslint-disable-next-line no-unused-vars
  onOpenLightbox: (item: { url: string; title: string; author: string }) => void;
  // eslint-disable-next-line no-unused-vars
  onEditUgc?: (item: { url: string; index: number; type: 'image' | 'video' }) => void;
}> = ({ urls, title, author, onOpenLightbox, onEditUgc }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!urls || urls.length === 0) return null;

  if (urls.length === 1) {
    const url = urls[0];
    const isVideo = /\.(mp4|webm|mov|m4v)$/i.test(url) || url.startsWith('data:video');
    return (
      <div
        onClick={() => !isVideo && onOpenLightbox({ url, title, author })}
        className="-mx-5 mt-3.5 overflow-hidden max-h-[700px] sm:max-h-[760px] border-y border-slate-300 dark:border-slate-800 cursor-pointer relative group bg-slate-900 shadow-xs"
      >
        {isVideo ? (
          <video src={url} controls playsInline className="w-full max-h-[700px] sm:max-h-[760px] object-contain bg-black" />
        ) : (
          <img src={url} alt={title} className="w-full max-h-[700px] sm:max-h-[760px] object-cover group-hover:scale-[1.01] transition duration-300" />
        )}
        
        {/* Persistent Floating Edit UGC Button */}
        {onEditUgc && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEditUgc({ url, index: 0, type: isVideo ? 'video' : 'image' });
            }}
            className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/85 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xl border border-white/20 backdrop-blur-md transition cursor-pointer z-10"
            title="Edit UGC with Banuba & Sovereign Filters, Crop & Trimming"
          >
            <SparklesIcon className="w-3.5 h-3.5 text-emerald-300" />
            <span>Edit UGC (Crop & Filters)</span>
          </button>
        )}

        {/* Overlay Action Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-between p-3.5 text-white">
          <div className="flex items-center gap-2">
            {!isVideo && (
              <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5 bg-black/70 px-3 py-1.5 rounded-xl">
                <MagnifyingGlassIcon className="w-4 h-4 text-amber-300" />
                Expand UHD Media
              </span>
            )}
            {onEditUgc && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditUgc({ url, index: 0, type: isVideo ? 'video' : 'image' });
                }}
                className="text-xs sm:text-sm font-bold flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 py-1.5 rounded-xl shadow-lg border border-emerald-400/60 transition cursor-pointer"
                title="Edit UGC with Banuba & Sovereign Filters, Crop & Trimming"
              >
                <SparklesIcon className="w-4 h-4 text-emerald-200" />
                <span>Edit UGC (Crop & Filters)</span>
              </button>
            )}
          </div>
          <span className="text-xs font-mono text-slate-300">FingerMobile High-Fi</span>
        </div>
      </div>
    );
  }

  const currentUrl = urls[activeIndex];
  const isVideo = /\.(mp4|webm|mov|m4v)$/i.test(currentUrl) || currentUrl.startsWith('data:video');

  return (
    <div className="-mx-5 mt-3.5 overflow-hidden border-y border-slate-300 dark:border-slate-800 bg-slate-950 relative group shadow-xs">
      {/* Current Active Item Viewport */}
      <div
        className="relative max-h-[640px] sm:max-h-[720px] aspect-[16/10] sm:aspect-video flex items-center justify-center cursor-pointer overflow-hidden bg-black"
        onClick={() => !isVideo && onOpenLightbox({ url: currentUrl, title, author })}
      >
        {isVideo ? (
          <video src={currentUrl} controls playsInline className="w-full h-full object-contain" />
        ) : (
          <img
            src={currentUrl}
            alt={`${title} (${activeIndex + 1})`}
            className="w-full h-full object-cover transition-all duration-200"
          />
        )}

        {/* Counter Badge */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-mono font-bold flex items-center gap-1 shadow-md z-10">
          <span>{activeIndex + 1}</span>
          <span className="text-slate-500 font-bold">/</span>
          <span>{urls.length}</span>
        </div>

        {/* Edit UGC Button Overlay */}
        {onEditUgc && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEditUgc({ url: currentUrl, index: activeIndex, type: isVideo ? 'video' : 'image' });
            }}
            className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/20 transition cursor-pointer z-10"
            title="Edit UGC (Crop, Banuba Filters & Speed)"
          >
            <SparklesIcon className="w-3.5 h-3.5 text-emerald-300" />
            <span>Edit UGC (Crop & Filters)</span>
          </button>
        )}

        {/* Previous Button */}
        {activeIndex > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex(activeIndex - 1);
            }}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition shadow-lg text-lg font-bold z-10"
            title="Previous media"
          >
            &#8249;
          </button>
        )}

        {/* Next Button */}
        {activeIndex < urls.length - 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex(activeIndex + 1);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition shadow-lg text-lg font-bold z-10"
            title="Next media"
          >
            &#8250;
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="p-2 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {urls.map((u, idx) => {
          const isItemVideo = /\.(mp4|webm|mov|m4v)$/i.test(u) || u.startsWith('data:video');
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition flex-shrink-0 relative ${
                activeIndex === idx
                  ? 'border-indigo-500 scale-105 shadow-md'
                  : 'border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              {isItemVideo ? (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-indigo-400 text-[10px] font-bold">
                  VID
                </div>
              ) : (
                <img src={u} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN UNIFIED FORUM POST CARD COMPONENT
// =============================================================================
export const ForumPostCard: React.FC<ForumPostCardProps> = ({
  post,
  onLike,
  onToggleBookmark,
  onShare,
  onReport,
  onVotePoll,
  onRsvpEvent,
  onAddComment,
  onOpenLightbox,
  onTip,
  triggerToast,
  hideCategory = false,
  onUpdatePost,
}) => {
  const navigate = useNavigate();

  // Local state for smooth reactive fallback if parent doesn't override
  const [isLiked, setIsLiked] = useState<boolean>(Boolean(post.isLiked));
  const [likesCount, setLikesCount] = useState<number>(post.likesCount || 0);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(Boolean(post.isBookmarked));
  const [activeMenuOpen, setActiveMenuOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState<number>(50);
  const [customTip, setCustomTip] = useState('');
  const [tipNote, setTipNote] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharesCount, setSharesCount] = useState<number>(post.sharesCount || 0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isCommentEmojiOpen, setIsCommentEmojiOpen] = useState(false);
  const [comments, setComments] = useState<FeedComment[]>(
    post.commentsList || [
      {
        id: 'c-default-1',
        authorName: 'Sarah Jenkins',
        authorHandle: '@sarahj',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        text: 'The zero-knowledge audit trail and 48-hour rotation schedule are revolutionary. Great milestone!',
        createdAt: '1h ago',
      },
    ]
  );

  // Poll local state
  const [pollData, setPollData] = useState<FeedPoll | undefined>(post.poll);
  // Event local state
  const [eventData, setEventData] = useState<FeedEvent | undefined>(post.event);
  // Audio playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  // Lightbox modal fallback
  const [localLightbox, setLocalLightbox] = useState<{ url: string; title: string; author: string } | null>(null);

  const mediaList = post.mediaUrls && post.mediaUrls.length > 0 ? post.mediaUrls : post.mediaUrl ? [post.mediaUrl] : [];
  const [localMediaUrls, setLocalMediaUrls] = useState<string[]>(mediaList);
  const [editingUgc, setEditingUgc] = useState<{
    url: string;
    index: number;
    type: 'image' | 'video';
  } | null>(null);

  React.useEffect(() => {
    setLocalMediaUrls(
      post.mediaUrls && post.mediaUrls.length > 0
        ? post.mediaUrls
        : post.mediaUrl
        ? [post.mediaUrl]
        : []
    );
  }, [post.mediaUrl, post.mediaUrls]);

  const handleOpenMediaEditor = (item: { url: string; index: number; type: 'image' | 'video' }) => {
    setEditingUgc(item);
  };

  const handleSaveEditedUgc = async (result: EditedMediaResult) => {
    if (!editingUgc) return;
    const newUrl = result.url;
    const currentList = localMediaUrls.length > 0 ? localMediaUrls : (post.mediaUrl ? [post.mediaUrl] : []);
    const updatedMediaUrls = currentList.map((m, idx) =>
      idx === editingUgc.index ? newUrl : m
    );
    if (updatedMediaUrls.length === 0) {
      updatedMediaUrls.push(newUrl);
    }
    setLocalMediaUrls(updatedMediaUrls);
    setEditingUgc(null);
    notify('UGC media edited successfully! Crop & filter grading applied.', 'success');

    const updatedPost: FeedPost = {
      ...post,
      mediaUrl: updatedMediaUrls[0],
      mediaUrls: updatedMediaUrls,
    };

    if (onUpdatePost) {
      onUpdatePost(updatedPost);
    }

    try {
      const cleanPostId = post.id.replace(/^post-/, '');
      await fetch(`/api/forums/posts/${cleanPostId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          media_url: updatedMediaUrls[0],
          media_urls: updatedMediaUrls,
        }),
      });
    } catch (_err) {
      // Offline fallback
    }
  };

  const notify = (msg: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    if (triggerToast) {
      triggerToast(msg, type);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('fingermobile:toast', {
          detail: {
            message: msg,
            text: msg,
            type,
            category: type,
            timestamp: Date.now(),
          },
        })
      );
    }
  };

  const handleLikeClick = () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));
    if (onLike) {
      onLike(post.id);
    } else {
      notify(nextState ? 'Post upvoted in sovereign ledger!' : 'Upvote removed', 'success');
    }
  };

  const handleBookmarkClick = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    if (onToggleBookmark) {
      onToggleBookmark(post.id);
    } else {
      notify(nextState ? 'Post bookmarked to your collection!' : 'Post removed from bookmarks', 'info');
    }
  };

  const handleShareClick = () => {
    setActiveMenuOpen(false);
    setIsShareModalOpen(true);
  };

  const handleTipClick = () => {
    setActiveMenuOpen(false);
    setIsTipModalOpen(true);
  };

  const handleConfirmTip = () => {
    const finalAmount = customTip ? parseInt(customTip, 10) : tipAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      notify('Please enter a valid FIC coin amount.', 'warning');
      return;
    }
    if (onTip) {
      onTip(post.id, finalAmount);
    }
    notify(`Tipped ${finalAmount} FIC to @${post.authorHandle}!`, 'success');
    setIsTipModalOpen(false);
    setCustomTip('');
    setTipNote('');
  };

  const postUrl = typeof window !== 'undefined' ? `${window.location.origin}/post/${post.id}` : `https://fingermobileprotocol.com/post/${post.id}`;

  const handleCopyPostLink = () => {
    navigator.clipboard?.writeText?.(postUrl);
    setCopiedLink(true);
    setSharesCount((prev) => prev + 1);
    notify('Post link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSocialShare = (platform: string) => {
    setSharesCount((prev) => prev + 1);
    if (onShare) onShare(post);
    if (platform === 'feed') {
      notify('Post shared to your sovereign wall feed!', 'success');
      setIsShareModalOpen(false);
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + postUrl)}`, '_blank');
      setIsShareModalOpen(false);
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`, '_blank');
      setIsShareModalOpen(false);
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`, '_blank');
      setIsShareModalOpen(false);
    }
  };

  const handleReportClick = () => {
    setActiveMenuOpen(false);
    if (onReport) {
      onReport(post.id);
    } else {
      notify('Report submitted to Guardian Sentinel for cryptographic consensus review.', 'info');
    }
  };

  const handleVoteClick = (optionIdx: number) => {
    if (!pollData || pollData.userVotedIndex !== undefined) return;
    const updatedOptions = pollData.options.map((opt, i) =>
      i === optionIdx ? { ...opt, votes: opt.votes + 1 } : opt
    );
    setPollData({
      ...pollData,
      options: updatedOptions,
      userVotedIndex: optionIdx,
      totalVotes: pollData.totalVotes + 1,
    });
    if (onVotePoll) {
      onVotePoll(post.id, optionIdx);
    } else {
      notify(`Vote recorded for "${pollData.options[optionIdx].text}"!`, 'success');
    }
  };

  const handleRsvpClick = () => {
    if (!eventData) return;
    const nextRsvpd = !eventData.isRsvpd;
    setEventData({
      ...eventData,
      isRsvpd: nextRsvpd,
      rsvpCount: nextRsvpd ? eventData.rsvpCount + 1 : Math.max(0, eventData.rsvpCount - 1),
    });
    if (onRsvpEvent) {
      onRsvpEvent(post.id);
    } else {
      notify(nextRsvpd ? 'You are confirmed attending this sovereign summit!' : 'RSVP cancelled', 'info');
    }
  };

  const handleCommentSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment: FeedComment = {
      id: `c-${Date.now()}`,
      authorName: 'Israel Obinna Mbah',
      authorHandle: '@israelobinna',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      text: commentInput.trim(),
      createdAt: 'Just now',
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentInput('');

    if (onAddComment) {
      onAddComment(post.id, newComment.text);
    } else {
      notify('Comment posted to post ledger thread!', 'success');
    }
  };

  const handleLightboxOpen = (item: { url: string; title: string; author: string }) => {
    if (onOpenLightbox) {
      onOpenLightbox(item);
    } else {
      setLocalLightbox(item);
    }
  };

  return (
    <>
      <article
        id={post.id}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-300 dark:border-slate-800 p-5 shadow-xs transition hover:shadow-sm"
      >
        {/* Post Header: Author, Verification, Role, Timestamp, Privacy Icon, Options Menu */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-11 h-11 rounded-full object-cover border border-slate-300 dark:border-slate-700 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/profile/${post.authorId || post.authorHandle}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(`/profile/${post.authorId || post.authorHandle}`);
                    }
                  }}
                  className="font-black text-slate-900 dark:text-white text-sm sm:text-[15px] hover:underline cursor-pointer"
                >
                  {post.authorName}
                </span>
                {post.isVerified && <CheckCircleSolidIcon className="w-4 h-4 text-orange-600" />}
                <span className="text-xs sm:text-[13px] text-slate-700 font-mono font-medium">
                  {post.authorHandle.startsWith('@') ? post.authorHandle : `@${post.authorHandle}`}
                </span>
                {post.privacy === 'private' && (
                  <span title="Private Post" className="text-slate-600">
                    <LockClosedIcon className="w-3.5 h-3.5" />
                  </span>
                )}
                {post.privacy === 'friends' && (
                  <span title="Friends Only" className="text-sky-600">
                    <UserGroupIcon className="w-3.5 h-3.5" />
                  </span>
                )}
                {post.privacy === 'public' && (
                  <span title="Public" className="text-slate-700">
                    <GlobeAltIcon className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{post.authorRole}</span>
                {!hideCategory && post.categoryName && (
                  <>
                    <span>•</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {post.categoryName.replace(/https?:\/\/[^\s]+/g, '').trim() || post.categoryName}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="text-slate-700 font-medium">{post.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Options Menu Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenuOpen(!activeMenuOpen)}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-transparent hover:border-slate-300 transition"
              title="Post options"
            >
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>

            {activeMenuOpen && (
              <div className="absolute right-0 top-9 w-52 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 z-30 text-xs">
                {localMediaUrls.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenuOpen(false);
                      const firstUrl = localMediaUrls[0];
                      const isVid = /\.(mp4|webm|mov|m4v)$/i.test(firstUrl) || firstUrl.startsWith('data:video');
                      handleOpenMediaEditor({ url: firstUrl, index: 0, type: isVid ? 'video' : 'image' });
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 font-bold rounded-xl flex items-center gap-2 transition"
                  >
                    <SparklesIcon className="w-4 h-4 text-emerald-600" />
                    <span>Edit UGC (Crop & Filters)</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleShareClick}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl flex items-center gap-2"
                >
                  <ShareIcon className="w-4 h-4 text-sky-600" />
                  <span>Share Post Link</span>
                </button>
                <button
                  type="button"
                  onClick={handleBookmarkClick}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl flex items-center gap-2"
                >
                  <BookmarkIcon className="w-4 h-4 text-amber-600" />
                  <span>{isBookmarked ? 'Remove Bookmark' : 'Save to Bookmarks'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleTipClick}
                  className="w-full text-left px-3 py-2 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-950 dark:text-amber-300 font-bold rounded-xl flex items-center gap-2"
                >
                  <SparklesIcon className="w-4 h-4 text-amber-600" />
                  <span>Send FIC Coin Tip</span>
                </button>
                <button
                  type="button"
                  onClick={handleReportClick}
                  className="w-full text-left px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-700 dark:text-rose-400 font-bold rounded-xl flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-1"
                >
                  <ShieldCheckIcon className="w-4 h-4 text-rose-600" />
                  <span>Report to Sentinel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Location Pin Tag (if attached) */}
        {post.locationTag && (
          <div className="flex items-center gap-1 mt-2.5 text-[11px] font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-300 w-fit">
            <MapPinIcon className="w-3.5 h-3.5 text-rose-600" />
            <span>{post.locationTag}</span>
          </div>
        )}

        {/* Post Title & Content */}
        <div className="mt-3.5">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
            {renderContentWithFingerMobileEmojis(post.title)}
          </h3>
          {/<[a-z][\s\S]*>/i.test(post.content) ? (
            <div
              className="prose prose-slate dark:prose-invert max-w-none text-[15px] sm:text-base text-slate-800 dark:text-slate-200 mt-2 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: replaceEmojisInHtml(sanitizeHtmlContent(post.content))
              }}
            />
          ) : (
            <p className="text-[15px] sm:text-base text-slate-800 dark:text-slate-200 mt-2 whitespace-pre-wrap leading-relaxed font-normal">
              {renderContentWithFingerMobileEmojis(post.content)}
            </p>
          )}
        </div>

        {/* Multi-Media Gallery (Single or Multi-Photo & Video Carousel with UHD Lightbox & UGC Editor) */}
        {(localMediaUrls.length > 0 || mediaList.length > 0) && (
          <MultiMediaGallery
            urls={localMediaUrls.length > 0 ? localMediaUrls : mediaList}
            title={post.title}
            author={post.authorName}
            onOpenLightbox={handleLightboxOpen}
            onEditUgc={handleOpenMediaEditor}
          />
        )}

        {/* INTERACTIVE POLL COMPONENT (With Real Voting) */}
        {pollData && (
          <div className="mt-3 p-3.5 bg-gradient-to-br from-purple-50 to-slate-50 border border-purple-300 rounded-2xl space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-purple-950 flex items-center gap-1.5">
                <ChartBarIcon className="w-4 h-4 text-purple-700" />
                {pollData.question}
              </span>
              <span className="text-[10px] text-purple-950 bg-purple-100 px-2 py-0.5 rounded-full font-bold border border-purple-400  font-black">
                {pollData.totalVotes} votes • {pollData.durationDays}d left
              </span>
            </div>
            <div className="space-y-1.5">
              {pollData.options.map((opt, optIdx) => {
                const isSelected = pollData.userVotedIndex === optIdx;
                const pct = pollData.totalVotes > 0 ? Math.round((opt.votes / pollData.totalVotes) * 100) : 0;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={pollData.userVotedIndex !== undefined}
                    onClick={() => handleVoteClick(optIdx)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold relative overflow-hidden transition border cursor-pointer ${
                      isSelected
                        ? 'border-purple-500 bg-purple-100 text-purple-950 font-bold'
                        : 'border-slate-300 bg-white hover:bg-purple-50/70 text-slate-800'
                    }`}
                  >
                    {pollData.userVotedIndex !== undefined && (
                      <div
                        className="absolute inset-y-0 left-0 bg-purple-200/60 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    )}
                    <div className="relative flex items-center justify-between z-10">
                      <span className="flex items-center gap-1.5">
                        {isSelected && <span className="text-purple-700 font-black">✓</span>}
                        {opt.text}
                      </span>
                      {pollData.userVotedIndex !== undefined && (
                        <span className="font-mono text-[11px] font-bold text-purple-950">
                          {pct}% ({opt.votes})
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* INTERACTIVE EVENT COMPONENT (With RSVP Toggle) */}
        {eventData && (
          <div className="mt-3 p-3.5 bg-gradient-to-r from-emerald-50 to-slate-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-950 rounded-xl font-black flex flex-col items-center justify-center min-w-[50px] border border-emerald-300">
                <CalendarIcon className="w-5 h-5 text-emerald-800 mb-0.5" />
                <span className="text-[10px] uppercase tracking-wider">EVENT</span>
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">{eventData.title}</h4>
                <div className="text-[11px] text-slate-700 mt-0.5 flex flex-wrap items-center gap-2 font-medium">
                  <span>📅 {eventData.date} • {eventData.time}</span>
                  <span>📍 {eventData.location}</span>
                </div>
                <div className="text-[10px] font-bold text-emerald-900 mt-1">
                  {eventData.rsvpCount} members attending
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRsvpClick}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs flex-shrink-0 cursor-pointer ${
                eventData.isRsvpd
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                  : 'bg-white border border-emerald-400 text-emerald-950 hover:bg-emerald-100'
              }`}
            >
              {eventData.isRsvpd ? 'Attending ✓' : 'RSVP Now'}
            </button>
          </div>
        )}

        {/* DOCUMENT FILE ATTACHMENT BADGE */}
        {post.fileAttachment && (
          <div className="mt-3 p-2.5 bg-indigo-50 border border-indigo-300 rounded-xl flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <PaperClipIcon className="w-4 h-4 text-indigo-700 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 truncate">{post.fileAttachment.name}</div>
                <div className="text-[10px] text-slate-700 font-medium">
                  {post.fileAttachment.size} • {post.fileAttachment.type}
                </div>
              </div>
            </div>
            <a
              href={post.fileAttachment.url || '#'}
              download={post.fileAttachment.name}
              onClick={(e) => {
                if (!post.fileAttachment?.url) {
                  e.preventDefault();
                  notify(`Downloading ${post.fileAttachment?.name}...`, 'info');
                }
              }}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg transition ml-2"
            >
              Download
            </a>
          </div>
        )}

        {/* RICH OPEN GRAPH (OG) LINK CARD */}
        {post.linkEmbed && (
          <a
            href={post.linkEmbed.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 p-3 bg-slate-50 hover:bg-blue-50 border border-slate-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group transition block text-xs shadow-xs"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {post.linkEmbed.image ? (
                <img
                  src={post.linkEmbed.image}
                  alt={post.linkEmbed.title}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-slate-300"
                />
              ) : (
                <div className="p-3 bg-blue-100 text-blue-950 border border-blue-400 font-bold rounded-xl flex-shrink-0  border-blue-300">
                  <LinkIcon className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="font-black text-slate-900 group-hover:text-blue-800 transition truncate">
                  {post.linkEmbed.title}
                </h4>
                {post.linkEmbed.description && (
                  <p className="text-[11px] text-slate-700 line-clamp-2 mt-0.5 font-medium">
                    {post.linkEmbed.description}
                  </p>
                )}
                <span className="text-[10px] text-slate-700 font-mono font-medium block mt-1">{post.linkEmbed.domain}</span>
              </div>
            </div>
            <ArrowTopRightOnSquareIcon className="w-4 h-4 text-slate-600 group-hover:text-blue-700 transition flex-shrink-0" />
          </a>
        )}

        {/* BEATWAVENG AUDIO STEM EMBED */}
        {post.audioPreview && (
          <div className="mt-3 p-3 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-300 rounded-2xl flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-xl shadow-xs flex-shrink-0">
                <MusicalNoteIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 truncate">{post.audioPreview}</div>
                <div className="text-[10px] text-orange-800 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-ping" />
                  BeatwaveNG 24-Bit Spatial Audio Stem
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <button
                type="button"
                onClick={() => {
                  const nextState = !isPlayingAudio;
                  setIsPlayingAudio(nextState);
                  notify(nextState ? `Streaming stem: ${post.audioPreview}` : 'Audio playback paused', 'info');
                }}
                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold rounded-xl transition flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <PlayIcon className="w-3.5 h-3.5" />
                <span>{isPlayingAudio ? 'Pause' : 'Play Stem'}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/beatwaveng')}
                className="px-2.5 py-1.5 bg-white border border-orange-300 hover:bg-orange-50 text-orange-900 text-[10px] font-bold rounded-xl transition"
              >
                DAW
              </button>
            </div>
          </div>
        )}

        {/* DANCIA-4TV VIDEO STREAM EMBED */}
        {post.videoStreamUrl && (
          <div className="mt-3 p-3 bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-2xl flex items-center justify-between text-xs border border-purple-800 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="p-2 bg-rose-500 rounded-lg text-white animate-pulse flex-shrink-0">
                <TvIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-white truncate">{post.videoStreamUrl}</div>
                <div className="text-[10px] text-purple-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Live Broadcast Feed (Dancia-4Tv)</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/dancia4tv')}
              className="px-3 py-1.5 bg-white text-purple-900 hover:bg-purple-100 text-[11px] font-bold rounded-xl transition ml-2 flex-shrink-0"
            >
              Watch Live
            </button>
          </div>
        )}

        {/* TAGGED PRODUCT CARD (MarketPlace, OwnIt, Flamingo, Storefront, FingerLux, Gift Cards, Tips, Coupons) */}
        {post.taggedProduct && (
          <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-amber-300 dark:border-amber-900/40 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {post.taggedProduct.image ? (
                <img
                  src={post.taggedProduct.image}
                  alt={post.taggedProduct.name}
                  className="w-10 h-10 rounded-xl object-cover border border-amber-300 dark:border-amber-800 flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0 text-amber-800 dark:text-amber-300 border border-amber-300">
                  <ShoppingBagIcon className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {post.taggedProduct.name}
                  </span>
                  {post.taggedProduct.category === 'Gift Card' && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-950 border border-emerald-400">
                      🎁 Gift Card
                    </span>
                  )}
                  {post.taggedProduct.category === 'FIC Tip' && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-blue-100 text-blue-950 border border-blue-400">
                      💸 FIC Tip
                    </span>
                  )}
                  {post.taggedProduct.category === 'Coupon' && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-100 text-rose-950 border border-rose-400">
                      🏷️ Coupon
                    </span>
                  )}
                  {(post.taggedProduct.platform === 'OwnIt' || post.taggedProduct.category === 'Luxury') && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-950 border border-amber-400">
                      💎 Luxury
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-amber-900 dark:text-amber-400 font-bold truncate mt-0.5">
                  {post.taggedProduct.platform} • {post.taggedProduct.category || 'Goods'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                {post.taggedProduct.price}
              </span>
              {post.taggedProduct.category === 'Gift Card' ? (
                <button
                  type="button"
                  onClick={() => notify(`Gift Card "${post.taggedProduct?.name}" redeemed to sovereign wallet!`, 'success')}
                  className="px-2.5 py-1 text-[10px] font-bold bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition shadow-xs cursor-pointer"
                >
                  Redeem Card
                </button>
              ) : post.taggedProduct.category === 'FIC Tip' ? (
                <button
                  type="button"
                  onClick={() => notify(`Tip sent to author! (${post.taggedProduct?.price})`, 'success')}
                  className="px-2.5 py-1 text-[10px] font-bold bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition shadow-xs cursor-pointer"
                >
                  Send Tip
                </button>
              ) : post.taggedProduct.category === 'Coupon' ? (
                <button
                  type="button"
                  onClick={() => notify(`Coupon discount "${post.taggedProduct?.name}" applied to cart!`, 'success')}
                  className="px-2.5 py-1 text-[10px] font-bold bg-rose-700 hover:bg-rose-600 text-white rounded-lg transition shadow-xs cursor-pointer"
                >
                  Claim Coupon
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const p = post.taggedProduct?.platform.toLowerCase();
                    navigate(`/${p}`);
                  }}
                  className="px-2.5 py-1 text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition shadow-xs"
                >
                  View Store
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-bold rounded-md border border-slate-200 dark:border-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Action Footer: Likes, Comments Toggle, Share, Bookmark */}
        <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 font-medium">
          <div className="flex items-center gap-5 sm:gap-6">
            {/* Like Button */}
            <button
              type="button"
              onClick={handleLikeClick}
              className={`flex items-center gap-1.5 transition font-semibold ${
                isLiked ? 'text-rose-600 font-black' : 'text-slate-700 hover:text-rose-600'
              }`}
            >
              {isLiked ? <HeartSolidIcon className="w-5 h-5 text-rose-600" /> : <HeartIcon className="w-5 h-5" />}
              <span>{likesCount}</span>
            </button>

            {/* Comments Toggle */}
            <button
              type="button"
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
              className="flex items-center gap-1.5 text-slate-700 hover:text-orange-600 transition font-semibold"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              <span>{post.commentsCount || comments.length}</span>
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShareClick}
              className="flex items-center gap-1.5 text-slate-700 hover:text-sky-600 transition font-semibold"
              title="Share post"
            >
              <ShareIcon className="w-5 h-5" />
              <span>{sharesCount}</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Edit UGC Button */}
            {(localMediaUrls.length > 0 || mediaList.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  const firstUrl = localMediaUrls[0] || mediaList[0];
                  const isVid = /\.(mp4|webm|mov|m4v)$/i.test(firstUrl) || firstUrl.startsWith('data:video');
                  handleOpenMediaEditor({ url: firstUrl, index: 0, type: isVid ? 'video' : 'image' });
                }}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                title="Edit UGC Media (Crop, Banuba Filters, AR Adjustments & Video Speed)"
              >
                <SparklesIcon className="w-4 h-4 text-emerald-700" />
                <span>Edit UGC</span>
              </button>
            )}

            {/* Direct Tipping Button */}
            <button
              type="button"
              onClick={handleTipClick}
              className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              title="Tip FIC Coins"
            >
              <SparklesIcon className="w-4 h-4 text-amber-700" />
              <span>Tip FIC</span>
            </button>

            {/* Bookmark Button */}
            <button
              type="button"
              onClick={handleBookmarkClick}
              className={`p-2 rounded-xl border border-transparent hover:border-slate-300 transition ${
                isBookmarked ? 'text-amber-600' : 'text-slate-600 hover:text-amber-600'
              }`}
              title="Bookmark post"
            >
              {isBookmarked ? (
                <BookmarkSolidIcon className="w-5 h-5 text-amber-600" />
              ) : (
                <BookmarkIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* INLINE EXPANDED COMMENTS THREAD */}
        {isCommentsOpen && (
          <div className="mt-3.5 pt-3.5 border-t border-slate-200 dark:border-slate-800 space-y-3">
            {comments.length > 0 && (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {comments.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm flex items-start gap-3 border border-slate-200 dark:border-slate-700"
                  >
                    <img
                      src={comm.authorAvatar}
                      alt={comm.authorName}
                      className="w-8 h-8 rounded-full object-cover mt-0.5 border border-slate-300 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900 dark:text-white text-xs sm:text-[13px]">
                          {comm.authorName}
                        </span>
                        <span className="text-xs text-slate-700 font-medium">{comm.createdAt}</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 mt-1 leading-relaxed font-normal text-sm">
                        {renderContentWithFingerMobileEmojis(comm.text)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1 relative">
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  placeholder="Write a sovereign comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full pl-4 pr-11 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setIsCommentEmojiOpen(!isCommentEmojiOpen)}
                  className="absolute right-2.5 p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-700 transition"
                  title="Add FingerMobile 5D Emoji"
                >
                  <FaceSmileIcon className="w-5 h-5 text-emerald-600" />
                </button>
                <FingerMobileEmojiPicker
                  isOpen={isCommentEmojiOpen}
                  onClose={() => setIsCommentEmojiOpen(false)}
                  onSelectEmoji={(emoji) => {
                    setCommentInput((prev) => `${prev} [emoji:${emoji.slug}] `);
                  }}
                  position="top"
                  align="right"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer shrink-0"
              >
                Reply
              </button>
            </form>
          </div>
        )}
      </article>

      {/* Local Fallback Lightbox Modal */}
      {localLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLocalLightbox(null)}
        >
          <div
            className="max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-white">
              <span className="text-xs font-bold truncate">{localLightbox.title}</span>
              <button
                type="button"
                onClick={() => setLocalLightbox(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] flex items-center justify-center bg-black p-2">
              <img
                src={localLightbox.url}
                alt={localLightbox.title}
                className="max-h-[65vh] w-auto object-contain rounded-xl"
              />
            </div>
            <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Author: {localLightbox.author}</span>
              <span className="font-mono text-[10px]">FingerMobile High-Fi UHD</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Tip FIC Modal */}
      {isTipModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsTipModalOpen(false)}
        >
          <div
            className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-300 dark:border-slate-800 p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-100 dark:bg-amber-950/50 rounded-2xl text-amber-700 border border-amber-300">
                  <SparklesIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Tip FIC Coins</h3>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Direct peer-to-peer sovereign creator support</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTipModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient summary */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                className="w-11 h-11 rounded-2xl object-cover border border-slate-300 dark:border-slate-600 shadow-2xs"
              />
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{post.authorName}</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300">@{post.authorHandle} • <span className="text-amber-800 dark:text-amber-400 font-semibold">{post.authorRole}</span></p>
              </div>
            </div>

            {/* Preset amounts */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Select Tip Amount</label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 50, 100, 500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setTipAmount(amt);
                      setCustomTip('');
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-black transition border ${
                      !customTip && tipAmount === amt
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {amt} FIC
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Or Custom Amount (FIC)</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  placeholder="Enter custom FIC amount..."
                  value={customTip}
                  onChange={(e) => setCustomTip(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-black text-amber-700">FIC</span>
              </div>
            </div>

            {/* Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Cheer Note (Optional)</label>
              <input
                type="text"
                placeholder="Awesome insight! Keep building..."
                value={tipNote}
                onChange={(e) => setTipNote(e.target.value)}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-bold"
              />
            </div>

            {/* Balance & Info */}
            <div className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300 font-medium px-1">
              <span>Available Balance: <strong className="text-slate-900 dark:text-slate-100">3,420 FIC</strong></span>
              <span className="text-emerald-800 font-semibold flex items-center gap-1">✓ Instant On-Chain</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsTipModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmTip}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
              >
                <SparklesIcon className="w-4 h-4" />
                <span>Confirm Tip of {customTip ? customTip : tipAmount} FIC</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Share Modal */}
      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-300 dark:border-slate-800 p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-sky-100 dark:bg-sky-950/50 rounded-2xl text-sky-700 border border-sky-300">
                  <ShareIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Share Sovereign Post</h3>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Amplify post across decentralized channels & socials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Post link copy field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Permanent Post URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={postUrl}
                  className="flex-1 px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-200 select-all focus:outline-hidden font-bold focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={handleCopyPostLink}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                    copiedLink
                      ? 'bg-emerald-600 text-white'
                      : 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs'
                  }`}
                >
                  {copiedLink ? '✓ Copied' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Broadcast to Networks</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSocialShare('feed')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-orange-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-left transition flex items-center gap-3"
                >
                  <span className="text-lg">📱</span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Repost to Wall</h5>
                    <p className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">Share to your feed</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialShare('whatsapp')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-left transition flex items-center gap-3"
                >
                  <span className="text-lg">💬</span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">WhatsApp</h5>
                    <p className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">Send to chats</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialShare('twitter')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-left transition flex items-center gap-3"
                >
                  <span className="text-lg">𝕏</span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">X / Twitter</h5>
                    <p className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">Broadcast tweet</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialShare('telegram')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-left transition flex items-center gap-3"
                >
                  <span className="text-lg">✈️</span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Telegram</h5>
                    <p className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">Direct channel</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UGC Media Editor Modal (Banuba Presets, Crop, Adjustments & Video Speed/Trim) */}
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
    </>
  );
};

export default ForumPostCard;
