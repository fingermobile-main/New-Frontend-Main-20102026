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

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await ApiService.request("/blogs/posts", {
        method: "GET"
      });

      // Ensure response is an array before mapping (ApiService.request returns response.data directly)
      if (Array.isArray(response)) {
        // Transform the data to match our interface
        const transformedPosts = response.map((post: any) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          author: {
            id: post.author_id,
            membername: post.author_membername,
            avatar: post.author_avatar
          },
          category: post.category,
          tags: post.tags || [],
          createdAt: post.created_at,
          updatedAt: post.updated_at,
          likes: post.likes || 0,
          views: post.views || 0,
          commentCount: post.comment_count || 0,
          isLiked: post.is_liked || false,
          isBookmarked: post.is_bookmarked || false
        }));
        setBlogPosts(transformedPosts);
      }
      setLoading(false);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Failed to fetch blog posts");
      setLoading(false);
    }
  };

  const toggleLike = async (postId: string) => {
    try {
      const response = await ApiService.request(`/blogs/posts/${postId}/like`, {
        method: "POST"
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
          message: "Post liked successfully"
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
          message: "Post liked successfully"
        };
      }
    } catch (err: any) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Failed to like post"
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
    toggleLike
  };
};