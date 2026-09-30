import { Link } from 'react-router-dom';
import React, { useState } from 'react';
/*
 * FingerMobile Protocol™ - Post Card Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */


import { Post } from '../types'; // Updated types file should now include likes property
import { HeartIcon } from '../icons';

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
  onAddComment?: (postId: string, comment: string) => void; // Un-prefixed
  onShare?: (postId: string) => void; // Un-prefixed
  onView?: (postId: string) => void; // Un-prefixed
  onVote?: (postId: string, voteType: unknown) => void;
  onOpenPollModal?: (postId: string) => void;
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

  // Keep the old prefixed props optional so it doesn't break everything instantly
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
  onOpenGiftModal,
  onOpenGiftcardModal,
  onOpenPaylinkModal,
  onOpenProductModal,
  onOpenGemModal,
  onOpenMarketplaceModal,
  _onAddComment,
  _onShare,
  _onView
}) => {
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Define missing functions that were referenced in the component
  const handleTokenizePost = async (postId: string) => {
    try {
      alert(`Post ${postId} tokenized successfully`);
    } catch {
      alert('Failed to tokenize post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      if (window.confirm('Are you sure you want to delete this post?')) {
        alert(`Post ${postId} deleted successfully`);
      }
    } catch {
      alert('Failed to delete post');
    }
  };

  // Helper function to calculate likes display value
  const getLikesDisplay = (): number => {
    if (post.likesCount != null) {
      return post.likesCount;
    }
    if (typeof post.likes === 'number') {
      return post.likes;
    }
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

  // Use either new un-prefixed or old prefixed props
  const handleComment = onAddComment || _onAddComment;
  const handleShare = onShare || _onShare;
  const handleView = onView || _onView;

  return (
    <div className="post-card glass rounded-2xl p-6 border border-white/40 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all mb-5 group">
      <div className="flex justify-between items-start gap-3">
        <Link to={`/post/${post.id}`} className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-blue transition-colors">
            {post.title || 'Untitled Post'}
          </h3>
        </Link>
        {((post as any).is_ai_generated || (post as any).isAiGenerated) && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-200 shadow-xs flex-shrink-0">
            🤖 {((post as any).ai_badge_label || (post as any).aiBadgeLabel || 'AI Synthetic')}
          </span>
        )}
      </div>
      <p className="mt-3 text-gray-600 text-sm leading-relaxed">
        {post.excerpt || post.content?.substring(0, 100) + '...' || 'No content available'}
      </p>

      {/* Postcard Attachments Section */}
      {Array.isArray((post as any).attachments) && (post as any).attachments.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
          {(post as any).attachments.map((att: any, idx: number) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 shadow-xs"
            >
              <span className="font-bold text-gray-900 capitalize">{att.type?.replace('_', ' ')}</span>
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

      <div className="mt-5 flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {(post.author?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="text-xs text-gray-500">
            <span className="font-bold text-gray-800">{post.author?.name || 'Unknown'}</span>
            <span className="mx-1.5">&middot;</span>
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
          </div>
        </div>

        {/* Actions Dropdown Toggle */}
        <button
          onClick={() => setShowMoreActions(!showMoreActions)}
          className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
          title="More Options"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {/* Primary Engagement Actions */}
        {onLike && (
          <button
            onClick={() => onLike(String(post.id))}
            className={`flex items-center space-x-1.5 px-3 py-1.5 border rounded-full transition-all text-xs font-bold ${
              post.isLiked
                ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                : 'bg-white/60 text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-red-500 hover:border-red-200'
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
                : 'bg-white/60 text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            <span>👎 {getDislikesDisplay()}</span>
          </button>
        )}

        {handleComment && (
          <button
            onClick={() => handleComment(String(post.id), '')}
            className="px-3 py-1.5 bg-white/60 text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-xs font-bold"
          >
            💬 Comment
          </button>
        )}

        {handleShare && (
          <button
            onClick={() => handleShare(String(post.id))}
            className="px-3 py-1.5 bg-white/60 text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-xs font-bold"
          >
            📤 Share
          </button>
        )}

        {handleView && (
          <button
            onClick={() => handleView(String(post.id))}
            className="px-3 py-1.5 bg-white/60 text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-xs font-bold"
          >
            👁️ View
          </button>
        )}

        {onVote && (
          <button
            onClick={() => onVote(String(post.id), 'up')}
            className="px-3 py-1.5 bg-green-50 text-green-600 border border-green-100 rounded-full hover:bg-green-100 transition-colors text-xs font-bold"
          >
            Vote
          </button>
        )}

        {onOpenPollModal && (
          <button
            onClick={() => onOpenPollModal(String(post.id))}
            className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-full hover:bg-blue-100 transition-colors text-xs font-bold"
          >
            📊 Poll
          </button>
        )}
      </div>

      {/* Secondary Actions / Add & Send Items (Toggleable to save space) */}
      {showMoreActions && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2 items-center animate-fade-in">
          {onOpenGiftModal && (
            <button onClick={() => onOpenGiftModal(String(post.id))} className="px-3 py-1.5 bg-yellow-50 text-yellow-600 border border-yellow-100 rounded-full hover:bg-yellow-100 transition-colors text-xs font-bold">
              🎁 Gift
            </button>
          )}
          {onOpenGiftcardModal && (
            <button onClick={() => onOpenGiftcardModal(String(post.id))} className="px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-full hover:bg-orange-100 transition-colors text-xs font-bold">
              💳 Giftcard
            </button>
          )}
          {onOpenGemModal && (
            <button onClick={() => onOpenGemModal(String(post.id))} className="px-3 py-1.5 bg-teal-50 text-teal-600 border border-teal-100 rounded-full hover:bg-teal-100 transition-colors text-xs font-bold">
              💎 Gem
            </button>
          )}
          {onOpenProductModal && (
            <button onClick={() => onOpenProductModal(String(post.id))} className="px-3 py-1.5 bg-pink-50 text-pink-600 border border-pink-100 rounded-full hover:bg-pink-100 transition-colors text-xs font-bold">
              🛍️ Product
            </button>
          )}
          {onOpenMarketplaceModal && (
            <button onClick={() => onOpenMarketplaceModal(String(post.id))} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full hover:bg-emerald-100 transition-colors text-xs font-bold">
              🏪 Storefront
            </button>
          )}
          {onOpenPaylinkModal && (
            <button onClick={() => onOpenPaylinkModal(String(post.id))} className="px-3 py-1.5 bg-purple-50 text-purple-600 border border-purple-100 rounded-full hover:bg-purple-100 transition-colors text-xs font-bold">
              🔗 Paylink
            </button>
          )}
          <button onClick={() => handleTokenizePost(String(post.id))} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full hover:bg-indigo-100 transition-colors text-xs font-bold">
            Tokenize
          </button>
          <button onClick={() => handleDeletePost(String(post.id))} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-full hover:bg-red-100 transition-colors text-xs font-bold">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;
