import ApiService from './api';
import { ForumPost, ForumCategory, ForumThread } from '../types/forum';

interface CreateForumPostData {
  content: string;
  threadId: string;
  parentId?: string;
}

interface CreateForumThreadData {
  title: string;
  content: string;
  categoryId: string;
  tags?: string[];
  isSticky?: boolean;
  mediaUrls?: string[];
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

class ForumService {
  // Get forum categories
  static async getCategories(): Promise<ApiResponse<{ categories: ForumCategory[]; total: number }>> {
    try {
      const response = await ApiService.get('/forums/categories');
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Categories retrieved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve categories',
        error: error.response?.data?.message || error.message || 'An error occurred while fetching categories',
      };
    }
  }

  // Get forum threads by category
  static async getThreadsByCategory(
    categoryId: string,
    limit: number = 20,
    offset: number = 0,
    sortBy: 'latest' | 'popular' | 'sticky' = 'latest'
  ): Promise<ApiResponse<{ threads: ForumThread[]; total: number; hasNext: boolean }>> {
    try {
      const response = await ApiService.get(`/forums/${categoryId}/threads`, {
        params: {
          limit,
          offset,
          sortBy,
        },
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Threads retrieved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve threads',
        error: error.response?.data?.message || error.message || 'An error occurred while fetching threads',
      };
    }
  }

  // Get forum posts by thread
  static async getPostsByThread(
    threadId: string,
    limit: number = 20,
    offset: number = 0,
    sortBy: 'oldest' | 'latest' = 'oldest'
  ): Promise<ApiResponse<{ posts: ForumPost[]; total: number; hasNext: boolean }>> {
    try {
      const response = await ApiService.get(`/forums/threads/${threadId}/posts`, {
        params: {
          limit,
          offset,
          sortBy,
        },
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Posts retrieved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve posts',
        error: error.response?.data?.message || error.message || 'An error occurred while fetching posts',
      };
    }
  }

  // Create a new forum thread
  static async createThread(threadData: CreateForumThreadData): Promise<ApiResponse<ForumThread>> {
    try {
      const response = await ApiService.post(`/forums/${threadData.categoryId}/threads`, threadData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Thread created successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to create thread',
        error: error.response?.data?.message || error.message || 'An error occurred while creating thread',
      };
    }
  }

  // Censor text using the backend content filter
  static async censorText(content: string): Promise<ApiResponse<{ original: string; censored: string; isCensored: boolean }>> {
    try {
      const response = await ApiService.post('/forums/censor', { content });
      return {
        success: true,
        data: response.data,
        message: 'Content censored successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to censor content',
        error: error.response?.data?.message || error.message || 'Error occurred while censoring',
      };
    }
  }

  // Create a new forum post/reply
  static async createPost(postData: CreateForumPostData): Promise<ApiResponse<ForumPost>> {
    try {
      const response = await ApiService.post('/forums/posts', postData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Post created successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to create post',
        error: error.response?.data?.message || error.message || 'An error occurred while creating post',
      };
    }
  }

  // Get a specific forum thread
  static async getThreadById(threadId: string): Promise<ApiResponse<ForumThread>> {
    try {
      const response = await ApiService.get(`/forums/threads/${threadId}`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Thread retrieved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve thread',
        error: error.response?.data?.message || error.message || 'An error occurred while fetching thread',
      };
    }
  }

  // Get a specific forum post
  static async getPostById(postId: string): Promise<ApiResponse<ForumPost>> {
    try {
      const response = await ApiService.get(`/forums/posts/${postId}`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Post retrieved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve post',
        error: error.response?.data?.message || error.message || 'An error occurred while fetching post',
      };
    }
  }

  // Update a forum thread
  static async updateThread(threadId: string, threadData: Partial<CreateForumThreadData>): Promise<ApiResponse<ForumThread>> {
    try {
      const response = await ApiService.put(`/forums/threads/${threadId}`, threadData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Thread updated successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to update thread',
        error: error.response?.data?.message || error.message || 'An error occurred while updating thread',
      };
    }
  }

  // Update a forum post
  static async updatePost(postId: string, postData: Partial<CreateForumPostData>): Promise<ApiResponse<ForumPost>> {
    try {
      const response = await ApiService.put(`/forums/posts/${postId}`, postData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Post updated successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to update post',
        error: error.response?.data?.message || error.message || 'An error occurred while updating post',
      };
    }
  }

  // Delete a forum thread
  static async deleteThread(threadId: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.delete(`/forums/threads/${threadId}`);
      return {
        success: true,
        message: 'Thread deleted successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete thread',
        error: error.response?.data?.message || error.message || 'An error occurred while deleting thread',
      };
    }
  }

  // Delete a forum post
  static async deletePost(postId: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.delete(`/forums/posts/${postId}`);
      return {
        success: true,
        message: 'Post deleted successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete post',
        error: error.response?.data?.message || error.message || 'An error occurred while deleting post',
      };
    }
  }

  // Pin a forum thread
  static async pinThread(threadId: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.post(`/forums/threads/${threadId}/pin`);
      return {
        success: true,
        message: 'Thread pinned successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to pin thread',
        error: error.response?.data?.message || error.message || 'An error occurred while pinning thread',
      };
    }
  }

  // Unpin a forum thread
  static async unpinThread(threadId: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.delete(`/forums/threads/${threadId}/pin`);
      return {
        success: true,
        message: 'Thread unpinned successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to unpin thread',
        error: error.response?.data?.message || error.message || 'An error occurred while unpinning thread',
      };
    }
  }

  // Lock a forum thread
  static async lockThread(threadId: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.post(`/forums/threads/${threadId}/lock`);
      return {
        success: true,
        message: 'Thread locked successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to lock thread',
        error: error.response?.data?.message || error.message || 'An error occurred while locking thread',
      };
    }
  }

  // Unlock a forum thread
  static async unlockThread(threadId: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.delete(`/forums/threads/${threadId}/lock`);
      return {
        success: true,
        message: 'Thread unlocked successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to unlock thread',
        error: error.response?.data?.message || error.message || 'An error occurred while unlocking thread',
      };
    }
  }

  // Subscribe to a forum thread
  static async subscribeToThread(threadId: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.post(`/forums/threads/${threadId}/subscribe`);
      return {
        success: true,
        message: 'Subscribed to thread successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to subscribe to thread',
        error: error.response?.data?.message || error.message || 'An error occurred while subscribing to thread',
      };
    }
  }

  // Unsubscribe from a forum thread
  static async unsubscribeFromThread(threadId: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.delete(`/forums/threads/${threadId}/unsubscribe`);
      return {
        success: true,
        message: 'Unsubscribed from thread successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to unsubscribe from thread',
        error: error.response?.data?.message || error.message || 'An error occurred while unsubscribing from thread',
      };
    }
  }

  // Report a forum post
  static async reportPost(postId: string, reason: string, description?: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.post(`/forums/posts/${postId}/report`, { reason, description });
      return {
        success: true,
        message: 'Post reported successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to report post',
        error: error.response?.data?.message || error.message || 'An error occurred while reporting post',
      };
    }
  }

  // Search forum posts
  static async searchPosts(
    query: string,
    limit: number = 10,
    offset: number = 0,
    filters?: {
      categoryId?: string;
      tags?: string[];
      authorId?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<ApiResponse<{ posts: ForumPost[]; total: number; hasNext: boolean }>> {
    try {
      let url = `/forums/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`;

      if (filters) {
        if (filters.categoryId) url += `&categoryId=${filters.categoryId}`;
        if (filters.tags) url += `&tags=${filters.tags.join(',')}`;
        if (filters.authorId) url += `&authorId=${filters.authorId}`;
        if (filters.dateFrom) url += `&dateFrom=${filters.dateFrom}`;
        if (filters.dateTo) url += `&dateTo=${filters.dateTo}`;
      }

      const response = await ApiService.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Search results retrieved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to search posts',
        error: error.response?.data?.message || error.message || 'An error occurred while searching posts',
      };
    }
  }

  // Like a forum post
  static async likePost(postId: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.post('/likes', { targetType: 'forum_post', targetId: postId });
      return {
        success: true,
        message: 'Post liked successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to like post',
        error: error.response?.data?.message || error.message || 'An error occurred while liking post',
      };
    }
  }

  // Unlike a forum post
  static async unlikePost(postId: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.delete('/likes', { data: { targetType: 'forum_post', targetId: postId } });
      return {
        success: true,
        message: 'Post unliked successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to unlike post',
        error: error.response?.data?.message || error.message || 'An error occurred while unliking post',
      };
    }
  }

  // Get forum notifications
  static async getNotifications(): Promise<ApiResponse<{ data: any[] }>> {
    try {
      const response = await ApiService.get('/forums/notifications');
      return {
        success: true,
        data: response.data,
        message: 'Notifications retrieved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve notifications',
        error: error.response?.data?.message || error.message || 'An error occurred while fetching notifications',
      };
    }
  }

  // Get unread notification count
  static async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    try {
      const response = await ApiService.get('/forums/notifications/unread-count');
      return {
        success: true,
        data: response.data,
        message: 'Unread count retrieved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve unread count',
        error: error.response?.data?.message || error.message || 'An error occurred while fetching unread count',
      };
    }
  }

  // Mark notification as read
  static async markNotificationRead(id: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.post(`/forums/notifications/${id}/read`);
      return {
        success: true,
        message: 'Notification marked as read',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to mark notification as read',
        error: error.response?.data?.message || error.message || 'An error occurred while marking notification as read',
      };
    }
  }

  // Mark all notifications as read
  static async markAllNotificationsRead(): Promise<ApiResponse<void>> {
    try {
      await ApiService.post('/forums/notifications/read-all');
      return {
        success: true,
        message: 'All notifications marked as read',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to mark all notifications as read',
        error: error.response?.data?.message || error.message || 'An error occurred while marking all notifications as read',
      };
    }
  }

  // ─── Save / Bookmark Posts ──────────────────────────────────────────────────
  // BACKEND GAP: Requires `saved_posts` table (id, user_id, post_id, saved_at)
  // Endpoint: POST /api/forums/posts/:postId/save
  static async savePost(postId: string): Promise<ApiResponse<{ saved: boolean }>> {
    try {
      const response = await ApiService.post(`/forums/posts/${postId}/save`, {});
      return {
        success: true,
        data: response.data.data || { saved: true },
        message: 'Post saved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to save post',
        error: error.response?.data?.message || error.message || 'An error occurred while saving post',
      };
    }
  }

  // Endpoint: DELETE /api/forums/posts/:postId/save
  static async unsavePost(postId: string): Promise<ApiResponse<{ saved: boolean }>> {
    try {
      const response = await ApiService.delete(`/forums/posts/${postId}/save`);
      return {
        success: true,
        data: response.data.data || { saved: false },
        message: 'Post unsaved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to unsave post',
        error: error.response?.data?.message || error.message || 'An error occurred while unsaving post',
      };
    }
  }

  // Endpoint: GET /api/forums/posts/saved
  static async getSavedPosts(): Promise<ApiResponse<ForumPost[]>> {
    try {
      const response = await ApiService.get('/forums/posts/saved');
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Saved posts retrieved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve saved posts',
        error: error.response?.data?.message || error.message || 'An error occurred while fetching saved posts',
      };
    }
  }

  // ─── Activity Type ──────────────────────────────────────────────────────────
  // Endpoint: PUT /api/forums/threads/:threadId/activity
  static async setThreadActivityType(threadId: string, activityType: string): Promise<ApiResponse<ForumThread>> {
    try {
      const response = await ApiService.put(`/forums/threads/${threadId}/activity`, { activityType });
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Activity type set successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to set activity type',
        error: error.response?.data?.message || error.message || 'An error occurred while setting activity type',
      };
    }
  }

  // ─── Video Rooms ────────────────────────────────────────────────────────────
  // Endpoint: POST /api/live-spaces/rooms/create
  static async createVideoRoom(title: string, type: 'video' | 'audio' = 'video', maxParticipants: number = 10): Promise<ApiResponse<any>> {
    try {
      const response = await ApiService.post('/live-spaces/rooms/create', {
        title,
        type,
        maxParticipants
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Video room created successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to create video room',
        error: error.response?.data?.message || error.message || 'An error occurred while creating video room',
      };
    }
  }

  static async askLuminaAI(question: string, context?: string): Promise<ApiResponse<{ question: string; answer: string; timestamp: string; context?: string }>> {
    try {
      const response = await ApiService.post('/lumina/ask', {
        question,
        context
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'AI response received',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to get AI response',
        error: error.response?.data?.message || error.message || 'An error occurred while getting AI response',
      };
    }
  }
}

export default ForumService;
