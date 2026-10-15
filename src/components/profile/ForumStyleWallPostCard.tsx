/*
 * FingerMobile Protocol™ - Forum-Style Sovereign Wall Post Card
 * Re-exports and wraps the unified ForumPostCard component from http://localhost:3000/forum
 * ensuring absolute uniformity and database structure parity across the platform.
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React from 'react';
import ForumPostCard, {
  FeedPost,
  FeedTaggedProduct,
  FeedPoll,
  FeedEvent,
  FeedFileAttachment,
  FeedLinkEmbed,
  FeedComment,
  ForumPostCardProps
} from '../forum/ForumPostCard';

export type {
  FeedPost,
  FeedTaggedProduct,
  FeedPoll,
  FeedEvent,
  FeedFileAttachment,
  FeedLinkEmbed,
  FeedComment,
  ForumPostCardProps
};

// Backwards compatibility interface
export interface ForumPostItem extends Partial<FeedPost> {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorRole?: string;
  title?: string;
  content: string;
  mediaUrls?: string[];
  privacy: 'public' | 'friends' | 'private';
  tags: string[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  tipsFic: number;
  sharesCount?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  commentsList?: any[];
}

export interface ForumStyleWallPostCardProps {
  post: ForumPostItem | FeedPost;
  // eslint-disable-next-line no-unused-vars
  onLike?: (postId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onTip?: (postId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onShare?: (postId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onBookmark?: (postId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onAddComment?: (postId: string, commentText: string) => void;
  // eslint-disable-next-line no-unused-vars
  triggerToast?: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const ForumStyleWallPostCard: React.FC<ForumStyleWallPostCardProps> = ({
  post,
  onLike,
  onTip,
  onShare,
  onBookmark,
  onAddComment,
  triggerToast
}) => {
  // Normalize post to FeedPost structure
  const normalizedPost: FeedPost = {
    id: post.id,
    title: post.title || 'Sovereign Protocol Update',
    content: post.content,
    authorName: post.authorName,
    authorHandle: post.authorHandle,
    authorAvatar: post.authorAvatar,
    authorRole: post.authorRole || 'Founder & Architect',
    categoryName: post.categoryName || 'General',
    createdAt: post.createdAt,
    likesCount: post.likesCount || 0,
    commentsCount: post.commentsCount || (post.commentsList ? post.commentsList.length : 0),
    sharesCount: post.sharesCount || 0,
    isLiked: post.isLiked,
    isBookmarked: post.isBookmarked,
    tags: post.tags || [],
    mediaUrl: post.mediaUrl,
    mediaUrls: post.mediaUrls,
    audioPreview: post.audioPreview,
    videoStreamUrl: post.videoStreamUrl,
    locationTag: post.locationTag,
    taggedProduct: post.taggedProduct,
    poll: post.poll,
    event: post.event,
    fileAttachment: post.fileAttachment,
    linkEmbed: post.linkEmbed,
    isVerified: post.isVerified ?? true,
    commentsList: post.commentsList?.map((c) => ({
      id: c.id,
      authorName: c.authorName || c.author || 'Member',
      authorHandle: c.authorHandle || `@${(c.author || 'member').toLowerCase().replace(/\s+/g, '')}`,
      authorAvatar: c.authorAvatar || c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      text: c.text,
      createdAt: c.createdAt || c.timestamp || 'Recent',
    })),
    privacy: post.privacy || 'public',
    tipsFic: post.tipsFic,
  };

  return (
    <ForumPostCard
      post={normalizedPost}
      onLike={onLike}
      onTip={onTip}
      onShare={() => onShare && onShare(post.id)}
      onToggleBookmark={onBookmark}
      onAddComment={onAddComment}
      triggerToast={triggerToast}
    />
  );
};

export default ForumStyleWallPostCard;
