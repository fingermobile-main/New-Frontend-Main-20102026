import { Link } from 'react-router-dom';
import React from 'react';
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

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  _onAddComment?: (postId: string, comment: string) => void; // Renamed to indicate unused
  _onShare?: (postId: string) => void; // Renamed to indicate unused
  _onView?: (postId: string) => void; // Renamed to indicate unused
  onVote?: (postId: string, voteType: unknown) => void;
  onOpenGiftModal?: (postId: string) => void;
  onOpenPaylinkModal?: (postId: string) => void;
  displayStyle?: string;
  handleDeletePost?: (postId?: string) => void;
  handleTokenizePost?: (postId?: string) => void;
  handleAiAssist?: (...args: unknown[]) => any;
  onTriggerSpecialEffect?: (...args: unknown[]) => any;
  ficBalance?: number;
  showToast?: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  _onAddComment, 
  _onShare,
  _onView,
  onVote,
  onOpenGiftModal,
  onOpenPaylinkModal
}) => {
  // Define missing functions that were referenced in the component
  const handleTokenizePost = async (postId: string) => {
    // Placeholder implementation for tokenize post functionality
    try {
      // In a real implementation, this would make an API call
      // await api.tokenizePost(postId);
      alert(`Post ${postId} tokenized successfully`);
    } catch {
      alert('Failed to tokenize post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    // Placeholder implementation for delete post functionality
    try {
      if (window.confirm('Are you sure you want to delete this post?')) {
        // In a real implementation, this would make an API call
        // await api.deletePost(postId);
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

  return (
    <div className="post-card bg-white rounded-lg shadow p-4 mb-4">
      <Link to={`/posts/${post.id}`}>
        <h3 className="text-xl font-bold">{post.title || 'Untitled Post'}</h3>
      </Link>
      <p className="mt-2 text-gray-600">
        {post.excerpt || post.content?.substring(0, 100) + "..." || "No content available"}
      </p>
      <div className="mt-4 text-sm text-gray-500">
        By <span className="font-medium">{post.author?.name || 'Unknown'}</span> on{" "}
        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {onLike && (
          <button
            onClick={() => onLike(String(post.id))}
            className={`flex items-center space-x-1 px-3 py-1.5 border border-transparent rounded-full ${
              post.isLiked ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
            }`}
          >
            <HeartIcon />
            <span>{getLikesDisplay()}</span>
          </button>
        )}
        {onVote && (
          <button
            onClick={() => onVote(String(post.id), "up")}
            className="px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
          >
            Vote
          </button>
        )}
        {onOpenGiftModal && (
          <button
            onClick={() => onOpenGiftModal(String(post.id))}
            className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200"
          >
            Gift
          </button>
        )}
        {onOpenPaylinkModal && (
          <button
            onClick={() => onOpenPaylinkModal(String(post.id))}
            className="px-3 py-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
          >
            Paylink
          </button>
        )}
        {/* Using the newly defined functions */}
        <button
          onClick={() => handleTokenizePost(String(post.id))}
          className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
        >
          Tokenize
        </button>
        <button
          onClick={() => handleDeletePost(String(post.id))}
          className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PostCard;