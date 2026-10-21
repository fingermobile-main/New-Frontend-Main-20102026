import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    membername: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  views: number;
  commentCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export const useBlogPosts = () => {
  const [blogPosts, setBlogPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const DEFAULT_SEED_POSTS: BlogPost[] = [
    {
      id: 'blog-seed-1',
      title: 'Architecting High-Throughput Decentralized Protocols: The FingerMobile Paradigm',
      content: '<p>Decentralized infrastructure demands <b>sovereign account verification</b>, sub-second transaction clearing, and unified broadcast topologies. In this technical deep-dive, we explore how FingerMobile Protocol bridges user generated content (UGC) monetization with peer-to-peer economic networks.</p><p>By combining algorithmic virality metrics with authenticated badge verifications, creators unlock sustainable, commission-free content syndication across global node clusters.</p>',
      excerpt: 'Explore how FingerMobile Protocol bridges user generated content monetization with peer-to-peer economic networks.',
      author: {
        id: 'usr-1',
        membername: 'Israel Obinna',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
      },
      category: 'Technology',
      tags: ['#Decentralized', '#Protocol', '#Web3'],
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 42,
      views: 380,
      commentCount: 8,
      isLiked: false,
      isBookmarked: false
    },
    {
      id: 'blog-seed-2',
      title: 'The Creator Economy Revolution: Multi-Tiered Hallmarks & Community Commissioning',
      content: '<p>Traditional social networks extract massive advertising commissions from independent creators. FingerMobile flips this dynamic on its head by introducing <i>Hallmark Communities</i> with up to 5,000,000 members and direct <b>5% ad revenue commissions</b> once the 250,000 milestone is achieved.</p><p>Empowering creators with business tools, post scheduling, and custom action buttons turns ordinary publications into sovereign media franchises.</p>',
      excerpt: 'How FingerMobile flips traditional platforms by introducing Hallmark Communities with milestone-based ad commissions.',
      author: {
        id: 'usr-2',
        membername: 'Amara Vance',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'
      },
      category: 'Business & Commerce',
      tags: ['#CreatorEconomy', '#Hallmarks', '#Monetization'],
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 128,
      views: 1250,
      commentCount: 24,
      isLiked: true,
      isBookmarked: true
    },
    {
      id: 'blog-seed-3',
      title: 'Ephemeral Broadcast Channels: The Power of 24-Hour Gems Micro-Streaming',
      content: '<p>Not every thought belongs on a permanent ledger. Gems Broadcast Channels offer creators with 50,000+ followers a high-fidelity living room where updates, voice notes, and media expire cleanly after 24 hours.</p><p>This ephemeral nature sparks intense engagement and authentic, uncurated interactions without timeline bloat.</p>',
      excerpt: 'Discover the power of 24-hour ephemeral Gems broadcast channels for creators with 50k+ followers.',
      author: {
        id: 'usr-3',
        membername: 'David Adeleke',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
      },
      category: 'Creative Arts & Culture',
      tags: ['#Gems', '#Broadcast', '#Lifestyle'],
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 89,
      views: 940,
      commentCount: 15,
      isLiked: false,
      isBookmarked: false
    }
  ];

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await ApiService.request('/blogs/posts', {
        method: 'GET'
      });

      if (Array.isArray(response) && response.length > 0) {
        const transformedPosts = response.map((post: any) => ({
          id: String(post.id),
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || (post.content ? post.content.replace(/<[^>]+>/g, '').slice(0, 140) + '...' : ''),
          author: {
            id: String(post.author_id || '1'),
            membername: post.author_membername || 'Author',
            avatar: post.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
          },
          category: post.category || 'Technology',
          tags: Array.isArray(post.tags) ? post.tags : ['#Decentralized'],
          createdAt: post.created_at || new Date().toISOString(),
          updatedAt: post.updated_at || new Date().toISOString(),
          likes: Number(post.likes || 0),
          views: Number(post.views || 0),
          commentCount: Number(post.comment_count || 0),
          isLiked: Boolean(post.is_liked),
          isBookmarked: Boolean(post.is_bookmarked)
        }));
        setBlogPosts(transformedPosts);
      } else {
        setBlogPosts(DEFAULT_SEED_POSTS);
      }
      setLoading(false);
    } catch (err: any) {
      console.warn('Backend blogs fetch error, using default seed posts:', err);
      setBlogPosts(DEFAULT_SEED_POSTS);
      setLoading(false);
    }
  };

  const addBlogPost = (newPost: BlogPost) => {
    setBlogPosts(prev => [newPost, ...prev]);
  };

  const toggleLike = async (postId: string) => {
    try {
      const response = await ApiService.request(`/blogs/posts/${postId}/like`, {
        method: 'POST'
      });

      // Handle the response properly - ApiService.request returns response.data directly
      if (response && typeof response === 'object' && !Array.isArray(response)) {
        // Update the post in our local state
        setBlogPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                ...post,
                likes: (response as any).like_count || post.likes,
                isLiked: !post.isLiked
              }
              : post
          )
        );
        return {
          success: true,
          message: 'Post liked successfully'
        };
      } else {
        // If response doesn't have expected structure, just toggle locally
        setBlogPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                ...post,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !post.isLiked
              }
              : post
          )
        );
        return {
          success: true,
          message: 'Post liked successfully'
        };
      }
    } catch (err: any) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Failed to like post'
      };
    }
  };

  React.useEffect(() => {
    fetchBlogPosts();
  }, []);

  return {
    blogPosts,
    loading,
    error,
    fetchBlogPosts,
    toggleLike,
    addBlogPost,
    setBlogPosts
  };
};
