import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';
import type { Post } from '../types';
import dataCache from '../utils/dataCache';

export type Comment = {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
};

export interface PostContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (postData: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'shares'>) => Promise<Post>;
  updatePost: (postId: string, postData: Partial<Post>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  handleDeletePost: (postId: string) => void;
  addComment: (postId: string, comment: Comment) => Promise<void>;
  handleAddNewComment: (postId: string, commentText: string) => void;
  handleVote: (postId: string, optionId: string) => void | Promise<void>;
  handleLikePost: (postId: string) => void;
  handleLike?: (postId: string) => void;
  handleTokenizePost: (postId: string) => void;
}

export const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePost = (): PostContextType => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPosts = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const cacheKey = 'posts_list';
      const cachedData = dataCache.get<Post[]>(cacheKey);

      if (cachedData) {
        setPosts(cachedData);
        return;
      }

      await new Promise<void>((resolve) => {
        timerRef.current = setTimeout(() => resolve(), 1000);
      });

      const mockPosts: Post[] = [];
      dataCache.set(cacheKey, mockPosts);
      setPosts(mockPosts);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts().catch((err) => {
      console.error('Initial post fetch failed:', err);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [fetchPosts]);

  const createPost = useCallback(async (
    postData: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'shares'>
  ): Promise<Post> => {
    try {
      setLoading(true);
      setError(null);

      // Create new post object with all required properties
      const newPost: Post = {
        id: Date.now().toString(),
        authorId: postData.authorId || '',
        title: postData.title || '',
        content: postData.content || '',
        body: postData.body || postData.content || '',
        excerpt: postData.excerpt || postData.content?.substring(0, 150) || '',
        type: postData.type || 'text',
        media: postData.media || [],
        mediaUrl: postData.mediaUrl || '',
        tags: postData.tags || [],
        category: postData.category || 'general',
        status: postData.status || 'published',
        visibility: postData.visibility || 'public',
        isReposted: false, // Changed from isReported to isReposted to match Post type
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setPosts((prev) => [newPost, ...prev]);
      dataCache.delete('posts_list');

      return newPost;
    } catch (err) {
      setError('Failed to create post');
      console.error('Error creating post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (postId: string, postData: Partial<Post>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? { ...post, ...postData } : post))
      );

      dataCache.delete('posts_list');
    } catch (err) {
      setError('Failed to update post');
      console.error('Error updating post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (postId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      setPosts((prev) => prev.filter((post) => post.id !== postId));
      dataCache.delete('posts_list');
    } catch (err) {
      setError('Failed to delete post');
      console.error('Error deleting post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = useCallback(async (postId: string, _comment: Comment): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              commentsCount: (post.commentsCount || 0) + 1,
              repliesCount: (post.repliesCount || 0) + 1,
            };
          }
          return post;
        })
      );

      dataCache.delete('posts_list');
    } catch (err) {
      setError('Failed to add comment');
      console.error('Error adding comment:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddNewComment = useCallback(
    (postId: string, commentText: string) => {
      const newComment: Comment = {
        id: `comment_${Date.now()}`,
        author: 'CurrentUser',
        content: commentText,
        timestamp: new Date().toISOString(),
        likes: 0,
      };

      addComment(postId, newComment).catch((err) => {
        console.error('Failed to add comment via handler:', err);
      });
    },
    [addComment]
  );

  const handleLikePost = useCallback((postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
            ...post,
            isLiked: !post.isLiked,
            likesCount: post.isLiked
              ? Math.max(0, (post.likesCount || 0) - 1)
              : (post.likesCount || 0) + 1,
          }
          : post
      )
    );
  }, []);

  const handleTokenizePost = useCallback((postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, tokenized: !post.tokenized } : post
      )
    );
  }, []);

  const handleDeletePost = useCallback((postId: string) => {
    deletePost(postId).catch((err) => {
      console.error('Failed to delete post via handler:', err);
    });
  }, [deletePost]);

  const handleVote = useCallback((postId: string, optionId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const updatedPollOptions = post.pollOptions
            ? post.pollOptions.map((option) => ({
              ...option,
              text: option.text || option.id,
            }))
            : [];

          if (post.type === 'poll' && updatedPollOptions.length > 0) {
            return {
              ...post,
              pollOptions: updatedPollOptions.map((option) =>
                option.id === optionId
                  ? { ...option, votes: option.votes + 1 }
                  : option
              ),
            };
          }
        }
        return post;
      })
    );
  }, []);

  const value = useMemo<PostContextType>(
    () => ({
      posts,
      loading,
      error,
      fetchPosts,
      createPost,
      updatePost,
      deletePost,
      handleDeletePost,
      addComment,
      handleAddNewComment,
      handleLikePost,
      handleLike: handleLikePost,
      handleTokenizePost,
      handleVote,
    }),
    [
      posts,
      loading,
      error,
      fetchPosts,
      createPost,
      updatePost,
      deletePost,
      handleDeletePost,
      addComment,
      handleAddNewComment,
      handleLikePost,
      handleTokenizePost,
      handleVote,
    ]
  );

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePostContext = usePost;
export default PostProvider;
