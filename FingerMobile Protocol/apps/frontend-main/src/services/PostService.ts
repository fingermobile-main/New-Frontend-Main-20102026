import ApiService from './api';
import { Post } from '../types/post';

interface CreatePostData {
  content: string;
  title?: string;
  tags?: string[];
  media?: string[];
  visibility?: 'public' | 'friends' | 'private';
  scheduledAt?: string;
  groupId?: string;
}

interface UpdatePostData {
  content?: string;
  title?: string;
  tags?: string[];
  media?: string[];
  visibility?: 'public' | 'friends' | 'private';
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

class PostService {
  // Create a new post
  static async createPost(postData: CreatePostData): Promise<ApiResponse<Post>> {
    try {
      const response = await ApiService.post('/posts', postData);
      return {
        success: true,
        data: response.data,
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

  // Get a post by ID
  static async getPostById(postId: string): Promise<ApiResponse<Post>> {
    try {
      const response = await ApiService.get(`/posts/${postId}`);
      return {
        success: true,
        data: response.data,
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

  // Get posts feed
  static async getPostsFeed(limit: number = 10, offset: number = 0, filters?: {
    userId?: string;
    groupId?: string;
    tags?: string[];
    dateFrom?: string;
    dateTo?: string
  }): Promise<ApiResponse<{ posts: Post[]; total: number; hasNext: boolean }>> {
    try {
      let url = `/posts/feed?limit=${limit}&offset=${offset}`;

      if (filters) {
        if (filters.userId) url += `&userId=${filters.userId}`;
        if (filters.groupId) url += `&groupId=${filters.groupId}`;
        if (filters.tags) url += `&tags=${filters.tags.join(',')}`;
        if (filters.dateFrom) url += `&dateFrom=${filters.dateFrom}`;
        if (filters.dateTo) url += `&dateTo=${filters.dateTo}`;
      }

      const response = await ApiService.get(url);
      return {
        success: true,
        data: response.data,
        message: 'Posts feed retrieved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve posts feed',
        error: error.response?.data?.message || error.message || 'An error occurred while fetching posts feed',
      };
    }
  }

  // Update a post
  static async updatePost(postId: string, postData: UpdatePostData): Promise<ApiResponse<Post>> {
    try {
      const response = await ApiService.put(`/posts/${postId}`, postData);
      return {
        success: true,
        data: response.data,
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

  // Delete a post
  static async deletePost(postId: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.delete(`/posts/${postId}`);
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

  // Like a post
  static async likePost(postId: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.post(`/posts/${postId}/like`);
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

  // Unlike a post
  static async unlikePost(postId: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.delete(`/posts/${postId}/like`);
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

  // Comment on a post
  static async commentOnPost(postId: string, content: string): Promise<ApiResponse<any>> {
    try {
      const response = await ApiService.post(`/posts/${postId}/comments`, { content });
      return {
        success: true,
        data: response.data,
        message: 'Comment added successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to add comment',
        error: error.response?.data?.message || error.message || 'An error occurred while adding comment',
      };
    }
  }

  // Share a post
  static async sharePost(postId: string, message?: string): Promise<ApiResponse<Post>> {
    try {
      const response = await ApiService.post(`/posts/${postId}/share`, { message });
      return {
        success: true,
        data: response.data,
        message: 'Post shared successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to share post',
        error: error.response?.data?.message || error.message || 'An error occurred while sharing post',
      };
    }
  }

  // Get post engagement stats
  static async getPostStats(postId: string): Promise<ApiResponse<{
    likes: number;
    comments: number;
    shares: number;
    views: number;
    engagementRate: number;
  }>> {
    try {
      const response = await ApiService.get(`/posts/${postId}/stats`);
      return {
        success: true,
        data: response.data,
        message: 'Post stats retrieved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve post stats',
        error: error.response?.data?.message || error.message || 'An error occurred while fetching post stats',
      };
    }
  }

  // Pin a post
  static async pinPost(postId: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.post(`/posts/${postId}/pin`);
      return {
        success: true,
        message: 'Post pinned successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to pin post',
        error: error.response?.data?.message || error.message || 'An error occurred while pinning post',
      };
    }
  }

  // Unpin a post
  static async unpinPost(postId: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.delete(`/posts/${postId}/pin`);
      return {
        success: true,
        message: 'Post unpinned successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to unpin post',
        error: error.response?.data?.message || error.message || 'An error occurred while unpinning post',
      };
    }
  }

  // Report a post
  static async reportPost(postId: string, reason: string, description?: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.post(`/posts/${postId}/report`, { reason, description });
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
}

export default PostService;
