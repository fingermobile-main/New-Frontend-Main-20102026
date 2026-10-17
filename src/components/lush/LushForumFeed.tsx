/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import {
  HeartIcon as HeartIconOutline,
  ChatBubbleOvalLeftEllipsisIcon,
  ChatBubbleLeftRightIcon,
  GiftIcon,
  ShareIcon,
  BookmarkIcon as BookmarkIconOutline,
  SparklesIcon,
  PhotoIcon,
  LockClosedIcon,
  QuestionMarkCircleIcon,
  PaperAirplaneIcon,
  FaceSmileIcon,
  Square2StackIcon,
  XMarkIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from '@heroicons/react/24/solid';
import { VerificationBadge } from '../verification/VerificationBadge';
import LushEncoreView from './LushEncoreView';
import SwipeDeck from '../SwipeDeck';

export interface LushPostItem {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verificationLevel: number;
    intentTag: string;
  };
  content: string;
  timestamp: string;
  likesCount: number;
  commentsCount: number;
  giftsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isPinLocked?: boolean;
  lapidaireQuestion?: string;
  lapidaireCategory?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  giftAttachment?: {
    name: string;
    imageUrl: string;
    price: number;
  };
  comments?: Array<{
    id: string;
    authorName: string;
    authorAvatar: string;
    text: string;
    timestamp: string;
  }>;
}

const isVideoUrl = (url?: string): boolean => {
  if (!url) return false;
  return (
    url.startsWith('data:video') ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)
  );
};

const POPULAR_EMOJIS = ['😊', '❤️', '😍', '🥂', '🌹', '✨', '🔥', '💎', '👏', '🙌', '🍾', '🎉'];

interface LushForumFeedProps {
  posts: LushPostItem[];
  activeTab: string;
  onTabChange: (_tab: string) => void;
  onLikePost: (_postId: string) => void;
  onAddComment: (_postId: string, _text: string) => void;
  onSendGiftClick: (_postId: string) => void;
  onOpenLapidaireModal: () => void;
  onCreatePost: (
    _content: string,
    _lapidaire?: string,
    _mediaUrl?: string
  ) => void;
  onOpenChat?: (_memberId: string, _memberName?: string) => void;
  onBookmarkPost?: (_postId: string) => void;
  onSharePost?: (_post: LushPostItem) => void;
}

export const LushForumFeed: React.FC<LushForumFeedProps> = ({
  posts,
  activeTab,
  onTabChange,
  onLikePost,
  onAddComment,
  onSendGiftClick,
  onOpenLapidaireModal,
  onCreatePost,
  onOpenChat,
  onBookmarkPost,
  onSharePost,
}) => {
  const [newPostText, setNewPostText] = useState('');
  const [selectedLapidaire, setSelectedLapidaire] = useState<string | null>(
    null
  );
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {}
  );
  const [attachedMedia, setAttachedMedia] = useState<string | null>(null);
  const [showComposerEmojis, setShowComposerEmojis] = useState<boolean>(false);
  const [showCommentEmojis, setShowCommentEmojis] = useState<
    Record<string, boolean>
  >({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [localBookmarks, setLocalBookmarks] = useState<Record<string, boolean>>(
    {}
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      showToast('⚠️ Media file exceeds maximum 50MB limit.');
      return;
    }

    const isVideo = file.type.startsWith('video/');
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setAttachedMedia(result);
      showToast(
        isVideo
          ? '🎥 Video attachment ready for post!'
          : '📷 Photo attachment ready for post!'
      );
    };
    reader.readAsDataURL(file);
  };

  const handleAttachDemoPhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800',
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800',
    ];
    const randomPhoto =
      samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    setAttachedMedia(randomPhoto);
    showToast('📷 Sample luxury photo attached!');
  };

  const handleAttachDemoVideo = () => {
    setAttachedMedia(
      'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-champagne-glasses-toast-41477-large.mp4'
    );
    showToast('🎥 Luxury celebration demo video attached!');
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && !attachedMedia) return;
    onCreatePost(
      newPostText.trim(),
      selectedLapidaire || undefined,
      attachedMedia || undefined
    );
    setNewPostText('');
    setSelectedLapidaire(null);
    setAttachedMedia(null);
    showToast('✨ Post published to Lush-Pressies community!');
  };

  const handleToggleComments = (postId: string) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    showToast('💬 Thoughtful reply posted!');
  };

  const handleToggleBookmark = (postId: string, currentBookmarked: boolean) => {
    const isNowBookmarked =
      localBookmarks[postId] !== undefined
        ? !localBookmarks[postId]
        : !currentBookmarked;

    setLocalBookmarks((prev) => ({ ...prev, [postId]: isNowBookmarked }));
    if (onBookmarkPost) onBookmarkPost(postId);
    showToast(
      isNowBookmarked
        ? '🔖 Post saved to your bookmarks!'
        : '🔖 Removed from bookmarks'
    );
  };

  const handleSharePost = (post: LushPostItem) => {
    const shareUrl = `${window.location.origin}/lush-pressies#post-${post.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: `${post.author.name} on Lush Pressies`,
          text: post.content,
          url: shareUrl,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          showToast('🔗 Post permalink copied to clipboard!');
        })
        .catch(() => {
          showToast('🔗 Share URL: ' + shareUrl);
        });
    } else {
      showToast('🔗 Share URL: ' + shareUrl);
    }
    if (onSharePost) onSharePost(post);
  };

  return (
    <div className="space-y-4 relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-gray-900/95 text-white border border-emerald-400 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-slideDown">
          <SparklesIcon className="w-5 h-5 text-emerald-400 animate-spin" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Channel Tabs */}
      <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs p-2 flex items-center justify-between overflow-x-auto gap-2">
        <button
          onClick={() => onTabChange('feed')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'feed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/70'
          }`}
        >
          Lush-Pressies
        </button>

        <button
          onClick={() => onTabChange('encore')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'encore'
              ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-sm'
              : 'text-amber-900 bg-amber-50/70 hover:bg-amber-100 hover:text-amber-950 border border-amber-200/60'
          }`}
          title="Curated 3-5 Star Members, FingerLux Meets, Diners & Luxury Gifts"
        >
          <StarIconSolid className="w-4 h-4 text-amber-400" />
          <span>Encore™ (3–5★)</span>
        </button>

        <button
          onClick={() => onTabChange('discover')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'discover'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/70'
          }`}
          title="Interactive Swipe Deck & Gestures"
        >
          <Square2StackIcon className="w-4 h-4 text-emerald-600" />
          <span>Discover Deck</span>
        </button>

        <button
          onClick={() => onTabChange('lapidaires')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'lapidaires' || activeTab === 'lapidaires'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/70'
          }`}
        >
          <QuestionMarkCircleIcon className="w-4 h-4 text-emerald-600" />
          <span>Lapidaires</span>
        </button>

        <button
          onClick={() => onTabChange('gifts')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'gifts'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/70'
          }`}
        >
          <GiftIcon className="w-4 h-4 text-[#DC582A]" />
          <span>Plushies</span>
        </button>

        <button
          onClick={() => onTabChange('trending')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'trending'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/70'
          }`}
        >
          <SparklesIcon className="w-4 h-4 text-amber-500" />
          <span>Trending</span>
        </button>
      </div>

      {activeTab === 'encore' ? (
        <LushEncoreView onOpenChat={onOpenChat} />
      ) : activeTab === 'discover' ? (
        <div className="bg-white rounded-3xl border border-emerald-100/90 p-5 sm:p-7 shadow-xs">
          <div className="text-center mb-5 space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-950 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-400 text-emerald-950 border-emerald-400 font-black">
              Cross-Device Swipe Engine
            </span>
            <h2 className="text-xl font-black text-gray-900 mt-2">
              Discover Deck · Real-Time Connections
            </h2>
            <p className="text-xs text-slate-700 max-w-md mx-auto">
              Drag cards with touch or mouse, or use arrow keys:{' '}
              <strong>← Pass</strong>, <strong>↑ Super Like</strong>,{' '}
              <strong>→ Like</strong>, <strong>↺ Rewind</strong>.
            </p>
          </div>
          <SwipeDeck userId={1} />
        </div>
      ) : (
        <>
          {/* 2. Post Creation Card */}
          <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs p-4 sm:p-5">
            <form onSubmit={handlePostSubmit}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />

              <div className="flex gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                  alt="You"
                  className="w-10 h-10 rounded-full object-cover border border-emerald-200 shrink-0"
                />
                <div className="flex-1 space-y-2">
                  {selectedLapidaire && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                      <div className="flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          Lapidaire: <strong>{selectedLapidaire}</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedLapidaire(null)}
                        className="text-slate-700 hover:text-gray-600 font-bold ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <textarea
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="Share a thoughtful thought, answer a Lapidaire question, or post a date idea..."
                    rows={3}
                    className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-gray-300 rounded-xl p-3 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-400/30 focus:outline-hidden transition resize-none shadow-xs font-bold border-slate-300"
                  />

                  {/* Attached Media Preview (Photo or Video) */}
                  {attachedMedia && (
                    <div className="relative rounded-xl overflow-hidden border border-emerald-200 max-h-64 bg-black flex items-center justify-center">
                      {isVideoUrl(attachedMedia) ? (
                        <video
                          src={attachedMedia}
                          controls
                          playsInline
                          className="w-full max-h-64 object-contain rounded-xl bg-black"
                        />
                      ) : (
                        <img
                          src={attachedMedia}
                          alt="Attached Preview"
                          className="w-full max-h-64 object-cover rounded-xl"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => setAttachedMedia(null)}
                        className="absolute top-2 right-2 bg-black/75 hover:bg-black text-white p-1 rounded-full transition shadow-md z-10"
                        title="Remove attached media"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Postcard Smileys / Emojis Bar */}
                  {showComposerEmojis && (
                    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                      <span className="text-[10px] font-semibold text-emerald-800 mr-1">
                        Smileys:
                      </span>
                      {POPULAR_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setNewPostText((prev) => prev + emoji)}
                          className="text-lg hover:scale-125 transition px-1 py-0.5 rounded hover:bg-emerald-200/50"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-200">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={onOpenLapidaireModal}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-1 transition"
                    title="Select from 30 Curated Lapidaire Questions"
                  >
                    <QuestionMarkCircleIcon className="w-4 h-4 text-emerald-600" />
                    <span className="hidden sm:inline">
                      30 Lapidaire Questions
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowComposerEmojis((prev) => !prev)}
                    className={`p-1.5 rounded-lg transition ${
                      showComposerEmojis
                        ? 'text-emerald-700 bg-emerald-100'
                        : 'text-gray-500 hover:text-emerald-700 hover:bg-emerald-50'
                    }`}
                    title="Attach Smileys & Emojis"
                  >
                    <FaceSmileIcon className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                      attachedMedia
                        ? 'text-emerald-800 bg-emerald-100 border border-emerald-300'
                        : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                    }`}
                    title="Attach Media (up to 50MB)"
                  >
                    <PhotoIcon className="w-4 h-4 text-emerald-600" />
                    <span>Media</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAttachDemoPhoto}
                    className="p-1.5 rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 transition text-[11px] hidden md:inline"
                    title="Attach Sample Luxury Photo"
                  >
                    Sample Photo
                  </button>

                  <button
                    type="button"
                    onClick={handleAttachDemoVideo}
                    className="p-1.5 rounded-lg text-slate-700 hover:text-teal-700 hover:bg-teal-50 transition text-[11px] hidden md:inline flex items-center gap-1"
                    title="Attach Sample Luxury Celebration Video"
                  >
                    <VideoCameraIcon className="w-3.5 h-3.5 text-teal-600" />
                    <span>Sample Video</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!newPostText.trim() && !attachedMedia}
                  className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition flex items-center gap-1.5"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                  Post
                </button>
              </div>
            </form>
          </div>

          {/* 3. Forum Post Cards List */}
          <div className="space-y-4">
            {posts.map((post) => {
              const isPostBookmarked =
                localBookmarks[post.id] !== undefined
                  ? localBookmarks[post.id]
                  : post.isBookmarked;

              return (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition hover:border-emerald-200"
                >
                  {/* Card Author Header */}
                  <div className="p-4 sm:p-5 pb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-11 h-11 rounded-full object-cover border border-emerald-200 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                            {post.author.name}
                          </h3>
                          <VerificationBadge
                            level={post.author.verificationLevel}
                            size="small"
                          />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-700 mt-0.5">
                          <span className="font-mono">
                            @{post.author.username}
                          </span>
                          <span>•</span>
                          <span>{post.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onOpenChat?.(post.author.id, post.author.name)
                        }
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-400 transition text-emerald-950 border-emerald-400 font-black"
                        title={`Sovereign Encrypted Chat with ${post.author.name}`}
                      >
                        <LockClosedIcon className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Encrypted Chat</span>
                      </button>

                      <span className="text-[11px] font-semibold text-emerald-950 bg-emerald-50/70 px-2.5 py-1 rounded-full border border-emerald-400 hidden sm:inline text-emerald-950 border-emerald-400 font-black">
                        {post.author.intentTag}
                      </span>
                    </div>
                  </div>

                  {/*Lapidaire Prompt Box if attached */}
                  {post.lapidaireQuestion && (
                    <div className="mx-4 sm:mx-5 mb-3 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                        <QuestionMarkCircleIcon className="w-4 h-4 text-emerald-600" />
                        <span>
                          {post.lapidaireCategory || 'Lapidaire Prompt'}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        "{post.lapidaireQuestion}"
                      </p>
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="px-4 sm:px-5 pb-3">
                    <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  {/* Media Attachment (Photo or Video) */}
                  {post.mediaUrl && (
                    <div className="px-4 sm:px-5 pb-3">
                      {isVideoUrl(post.mediaUrl) || post.mediaType === 'video' ? (
                        <video
                          src={post.mediaUrl}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full max-h-80 rounded-xl object-cover bg-black border border-gray-100 shadow-inner"
                        />
                      ) : (
                        <img
                          src={post.mediaUrl}
                          alt="Attachment"
                          className="w-full max-h-80 rounded-xl object-cover border border-slate-200 shadow-inner"
                        />
                      )}
                    </div>
                  )}

                  {/* Gift Exchange Card if attached */}
                  {post.giftAttachment && (
                    <div className="mx-4 sm:mx-5 mb-3 p-3 bg-teal-50/60 border border-teal-200 rounded-xl flex items-center gap-3">
                      <img
                        src={post.giftAttachment.imageUrl}
                        alt={post.giftAttachment.name}
                        className="w-14 h-14 rounded-lg object-cover border border-teal-300"
                      />
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wide">
                          🎁 Lush Gift Exchange
                        </span>
                        <h4 className="text-xs font-bold text-gray-900">
                          {post.giftAttachment.name}
                        </h4>
                        <p className="text-xs font-bold text-[#DC582A] mt-0.5">
                          {post.giftAttachment.price} FIC
                        </p>
                      </div>
                    </div>
                  )}

                  {/* PIN Locked Notice */}
                  {post.isPinLocked && (
                    <div className="mx-4 sm:mx-5 mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
                      <div className="flex items-center gap-2">
                        <LockClosedIcon className="w-4 h-4 text-amber-600" />
                        <span>
                          Content requires 8-digit mutual PIN exchange to view
                          full UGC
                        </span>
                      </div>
                      <button className="font-bold text-amber-800 underline">
                        Request Exchange
                      </button>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="px-4 sm:px-5 py-2.5 bg-gray-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <button
                        onClick={() => onLikePost(post.id)}
                        className={`flex items-center gap-1.5 font-semibold transition ${
                          post.isLiked
                            ? 'text-rose-600'
                            : 'text-gray-600 hover:text-rose-600'
                        }`}
                      >
                        {post.isLiked ? (
                          <HeartIconSolid className="w-4 h-4" />
                        ) : (
                          <HeartIconOutline className="w-4 h-4" />
                        )}
                        <span>{post.likesCount}</span>
                      </button>

                      <button
                        onClick={() => handleToggleComments(post.id)}
                        className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-700 font-semibold transition"
                      >
                        <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4" />
                        <span>{post.commentsCount}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onOpenChat?.(post.author.id, post.author.name)
                        }
                        className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-700 font-semibold transition"
                        title={`Send Message to ${post.author.name}`}
                      >
                        <ChatBubbleLeftRightIcon className="w-4 h-4 text-emerald-600" />
                        <span>Message</span>
                      </button>

                      <button
                        onClick={() => onSendGiftClick(post.id)}
                        className="flex items-center gap-1.5 text-[#DC582A] hover:text-orange-700 font-semibold transition"
                        title="Send Lush Plushie"
                      >
                        <GiftIcon className="w-4 h-4" />
                        <span>Send Gift</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 text-slate-700">
                      <button
                        type="button"
                        onClick={() => handleSharePost(post)}
                        className="p-1.5 rounded-lg hover:text-emerald-700 hover:bg-emerald-50 transition"
                        title="Share Post Permalink"
                      >
                        <ShareIcon className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleBookmark(post.id, post.isBookmarked)
                        }
                        className={`p-1.5 rounded-lg transition ${
                          isPostBookmarked
                            ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                            : 'hover:text-amber-600 hover:bg-amber-50'
                        }`}
                        title={
                          isPostBookmarked ? 'Remove Bookmark' : 'Save Bookmark'
                        }
                      >
                        {isPostBookmarked ? (
                          <BookmarkIconSolid className="w-4 h-4" />
                        ) : (
                          <BookmarkIconOutline className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Comments Section */}
                  {expandedComments[post.id] && (
                    <div className="p-4 sm:p-5 bg-[#F5F9F6]/50 border-t border-gray-100 space-y-3">
                      {post.comments && post.comments.length > 0 ? (
                        <div className="space-y-2">
                          {post.comments.map((c) => (
                            <div key={c.id} className="flex gap-2.5 text-xs">
                              <img
                                src={c.authorAvatar}
                                alt={c.authorName}
                                className="w-7 h-7 rounded-full object-cover border border-gray-200 mt-0.5"
                              />
                              <div className="flex-1 bg-white p-2.5 rounded-xl border border-slate-300 shadow-2xs">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold text-gray-900">
                                    {c.authorName}
                                  </span>
                                  <span className="text-[10px] text-slate-700">
                                    {c.timestamp}
                                  </span>
                                </div>
                                <p className="text-gray-800">{c.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 italic text-center py-1">
                          No comments yet. Start the thoughtful conversation!
                        </p>
                      )}

                      {/* Comment Input with Smileys Attachment */}
                      <div className="space-y-1.5 pt-1">
                        {showCommentEmojis[post.id] && (
                          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-emerald-50 border border-emerald-200 rounded-xl animate-in fade-in">
                            <span className="text-[10px] font-semibold text-emerald-800 mr-1">
                              Smileys:
                            </span>
                            {POPULAR_EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() =>
                                  setCommentInputs((prev) => ({
                                    ...prev,
                                    [post.id]: (prev[post.id] || '') + emoji,
                                  }))
                                }
                                className="text-base hover:scale-125 transition px-1 py-0.5 rounded hover:bg-emerald-200/50"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}

                        <form
                          onSubmit={(e) => handleCommentSubmit(post.id, e)}
                          className="flex items-center gap-1.5"
                        >
                          <div className="flex-1 relative flex items-center">
                            <input
                              type="text"
                              value={commentInputs[post.id] || ''}
                              onChange={(e) =>
                                setCommentInputs({
                                  ...commentInputs,
                                  [post.id]: e.target.value,
                                })
                              }
                              placeholder="Write a thoughtful comment..."
                              className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-gray-300 rounded-xl pl-3 pr-8 py-2 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden transition shadow-2xs font-bold border-slate-300"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowCommentEmojis((prev) => ({
                                  ...prev,
                                  [post.id]: !prev[post.id],
                                }))
                              }
                              className={`absolute right-2.5 p-0.5 rounded transition ${
                                showCommentEmojis[post.id]
                                  ? 'text-emerald-700 font-bold'
                                  : 'text-gray-400 hover:text-emerald-700'
                              }`}
                              title="Attach Smileys & Emojis"
                            >
                              <FaceSmileIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            type="submit"
                            disabled={!commentInputs[post.id]?.trim()}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold text-xs shadow-xs transition"
                          >
                            Reply
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default LushForumFeed;
