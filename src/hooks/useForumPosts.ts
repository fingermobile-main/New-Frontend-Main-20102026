import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export interface ForumPost {id: string;
  title: string;
  content: string;
  author: {id: string;
  membername: string;
  avatar: string;
  }; category: string;
createdAt: string;
updatedAt: string;
likes: number;
commentCount: number;
isLiked: boolean;
viewCount: number;
}

export const useForumPosts = () => {
  const [forumPosts, setForumPosts] = React.useState<ForumPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchForumPosts = async () => {
    try {
      setLoading(true);
      console.info('Fetching forum posts from /forums/posts...');
      
      const response = await api.get("/forums/posts");
      console.info('API Response:', response.data);

      if (response.data && Array.isArray(response.data)) {
        // Transform the data to match our interface
        const transformedPosts = response.data.map((post: any) => ({id: post.id,
  title: post.title || 'Untitled Post', content: post.content || '', author: { id: post.author_id || post.author?.id || 'unknown', membername: post.author_membername || post.author?.membername || 'Anonymous', avatar: post.author_avatar || post.author?.avatar || ''
          }, category: post.category || 'general', createdAt: post.created_at || post.createdAt || new Date().toISOString(),
updatedAt: post.updated_at || post.updatedAt || new Date().toISOString(),
likes: post.like_count || post.likes || 0,
commentCount: post.comment_count || post.comments_count || post.commentCount || 0, isLiked: post.is_liked || post.isLiked || false, viewCount: post.view_count || post.viewCount || 0
        }));

        console.info('Transformed posts:', transformedPosts.length);
        setForumPosts(transformedPosts);
        setError(null);
      } else {
        console.error('Invalid response format:', response.data);
        setError("Failed to fetch forum posts: Invalid response format");
      }
    } catch (
  err: any) {
      console.error("Error fetching forum posts:", err);
      const errorMessage = err.response?.data?.error || 
                          err.message || 
                          "An error occurred while fetching forum posts";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (
  postId: string) => {
    try {
      const response = await api.post(`/forums/posts/${postId}/like`);

      if (response.data) {
        // Update the post in our local state
        setForumPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
likes: response.data.like_count,
isLiked: !post.isLiked
                }
              : post,
          ) );
        return {success: true, message: response.statusText };
      } else {
        return {success: false, message: "Failed to like post" };
      }
    } catch (err) {
      console.error("Error liking post:", err);
      return {success: false, message: "Failed to like post" };
    }
  };

  const addComment = async (
  postId: string, content: string) => {
    try {
      const response = await api.post(`/forums/posts/${postId}/comments`, {
        content
      });

      if (response.data) {
        // Refresh the post to update comment count
        fetchForumPosts();
        return {success: true, message: "Comment added successfully" };
      } else {
        return {success: false, message: "Failed to add comment" };
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      return {success: false, message: "Failed to add comment" };
    }
  };


  React.useEffect(() => {
    fetchForumPosts();
  }, []);

  const refreshData = () => {
    fetchForumPosts();
  };

  return {
    forumPosts,
    loading,
    error,
    fetchForumPosts,
    likePost,
    addComment,
    refreshData
  };
};