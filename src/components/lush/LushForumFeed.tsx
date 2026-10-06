import React, { useState } from 'react';
import {
  HeartIcon as HeartIconOutline,
  ChatBubbleOvalLeftEllipsisIcon,
  GiftIcon,
  ShareIcon,
  BookmarkIcon,
  SparklesIcon,
  PhotoIcon,
  LockClosedIcon,
  QuestionMarkCircleIcon,
  PaperAirplaneIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { VerificationBadge } from '../verification/VerificationBadge';

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
  icebreakerQuestion?: string;
  icebreakerCategory?: string;
  mediaUrl?: string;
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

interface LushForumFeedProps {
  posts: LushPostItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onSendGiftClick: (postId: string) => void;
  onOpenIcebreakerModal: () => void;
  onCreatePost: (content: string, icebreaker?: string) => void;
}

export const LushForumFeed: React.FC<LushForumFeedProps> = ({
  posts,
  activeTab,
  onTabChange,
  onLikePost,
  onAddComment,
  onSendGiftClick,
  onOpenIcebreakerModal,
  onCreatePost
}) => {
  const [newPostText, setNewPostText] = useState('');
  const [selectedIcebreaker, setSelectedIcebreaker] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    onCreatePost(newPostText.trim(), selectedIcebreaker || undefined);
    setNewPostText('');
    setSelectedIcebreaker(null);
  };

  const handleToggleComments = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Channel Tabs: Tab text for default is strictly 'Lush-Pressies' without '(Lush)' */}
      <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs p-2 flex items-center justify-between overflow-x-auto gap-2">
        <button
          onClick={() => onTabChange('feed')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'feed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/70'
          }`}
        >
          Lush-Pressies
        </button>

        <button
          onClick={() => onTabChange('icebreakers')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'icebreakers'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/70'
          }`}
        >
          <QuestionMarkCircleIcon className="w-4 h-4 text-emerald-600" />
          Icebreaker Q&A
        </button>

        <button
          onClick={() => onTabChange('gifts')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'gifts'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/70'
          }`}
        >
          <GiftIcon className="w-4 h-4 text-[#DC582A]" />
          Gift Exchanges
        </button>

        <button
          onClick={() => onTabChange('trending')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'trending'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/70'
          }`}
        >
          <SparklesIcon className="w-4 h-4 text-amber-500" />
          Trending Stories
        </button>
      </div>

      {/* 2. Post Creation Card (Visible dark text on white input) */}
      <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs p-4 sm:p-5">
        <form onSubmit={handlePostSubmit}>
          <div className="flex gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              alt="You"
              className="w-10 h-10 rounded-full object-cover border border-emerald-200 flex-shrink-0"
            />
            <div className="flex-1 space-y-2">
              {selectedIcebreaker && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Prompt: <strong>{selectedIcebreaker}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedIcebreaker(null)}
                    className="text-gray-400 hover:text-gray-600 font-bold ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}

              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Share a thoughtful thought, answer an icebreaker, or post a date idea..."
                rows={3}
                className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-xl p-3 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-400/30 focus:outline-hidden transition resize-none shadow-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={onOpenIcebreakerModal}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-1 transition"
                title="Select from 30 Curated Icebreaker Questions"
              >
                <QuestionMarkCircleIcon className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">30 Dating Questions</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedIcebreaker("What's your ideal Sunday morning?")}
                className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                title="Quick Prompt"
              >
                <FaceSmileIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                title="Attach Media"
              >
                <PhotoIcon className="w-5 h-5" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!newPostText.trim()}
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
        {posts.map((post) => (
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
                    <VerificationBadge level={post.author.verificationLevel} size="small" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="font-mono">@{post.author.username}</span>
                    <span>•</span>
                    <span>{post.timestamp}</span>
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/80">
                {post.author.intentTag}
              </span>
            </div>

            {/* Icebreaker Prompt Box if attached */}
            {post.icebreakerQuestion && (
              <div className="mx-4 sm:mx-5 mb-3 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                  <QuestionMarkCircleIcon className="w-4 h-4 text-emerald-600" />
                  <span>{post.icebreakerCategory || 'Icebreaker Prompt'}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  "{post.icebreakerQuestion}"
                </p>
              </div>
            )}

            {/* Post Content */}
            <div className="px-4 sm:px-5 pb-3">
              <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>

            {/* Media Attachment if any */}
            {post.mediaUrl && (
              <div className="px-4 sm:px-5 pb-3">
                <img
                  src={post.mediaUrl}
                  alt="Attachment"
                  className="w-full max-h-80 rounded-xl object-cover border border-gray-100 shadow-inner"
                />
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
                  <span>Content requires 8-digit mutual PIN exchange to view full UGC</span>
                </div>
                <button className="font-bold text-amber-800 underline">
                  Request Exchange
                </button>
              </div>
            )}

            {/* Action Bar */}
            <div className="px-4 sm:px-5 py-2.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-4 sm:gap-6">
                <button
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center gap-1.5 font-semibold transition ${
                    post.isLiked ? 'text-rose-600' : 'text-gray-600 hover:text-rose-600'
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
                  onClick={() => onSendGiftClick(post.id)}
                  className="flex items-center gap-1.5 text-[#DC582A] hover:text-orange-700 font-semibold transition"
                  title="Send Lush Plushie"
                >
                  <GiftIcon className="w-4 h-4" />
                  <span>Send Gift</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-gray-400">
                <button className="hover:text-gray-600 transition" title="Share">
                  <ShareIcon className="w-4 h-4" />
                </button>
                <button className="hover:text-gray-600 transition" title="Bookmark">
                  <BookmarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expandable Comments Section */}
            {expandedComments[post.id] && (
              <div className="p-4 sm:p-5 bg-[#F5F9F6]/50 border-t border-gray-100 space-y-3">
                {/* Comment list */}
                {post.comments && post.comments.length > 0 ? (
                  <div className="space-y-2">
                    {post.comments.map((c) => (
                      <div key={c.id} className="flex gap-2.5 text-xs">
                        <img
                          src={c.authorAvatar}
                          alt={c.authorName}
                          className="w-7 h-7 rounded-full object-cover border border-gray-200 mt-0.5"
                        />
                        <div className="flex-1 bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-gray-900">{c.authorName}</span>
                            <span className="text-[10px] text-gray-400">{c.timestamp}</span>
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

                {/* Add comment input (Explicit visible text on white background) */}
                <form
                  onSubmit={(e) => handleCommentSubmit(post.id, e)}
                  className="flex gap-2 pt-1"
                >
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) =>
                      setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                    }
                    placeholder="Write a comment..."
                    className="flex-1 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden transition shadow-2xs"
                  />
                  <button
                    type="submit"
                    disabled={!commentInputs[post.id]?.trim()}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold text-xs shadow-xs transition"
                  >
                    Reply
                  </button>
                </form>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};

export default LushForumFeed;
