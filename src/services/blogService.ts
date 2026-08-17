import React, {} from 'react';
/**
 * Blog Service - Comment Threading & Reading Lists
 * Handles blog publishing, threaded comments, reading lists, and engagement tracking
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ' http:// localhost:3001/api';

export interface BlogPost {id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  content_format?: "markdown" | "html" | "rich-text";
  featuredImage?: string;
  featured_image_url?: string; authorId: string;
  author?: { id: string;
  name: string;
    avatar?: string;
  }; authorName: string;
status: "draft" | "published" | "scheduled" | "archived";
tags: string[];
  category?: string;
  category_id?: string;
views: number;
  views_count?: number;
likes: number;
  likes_count?: number;
comments: number;
  comments_count?: number;
  publishedAt?: string;
  published_at?: string;
createdAt: string;
  created_at?: string;
updatedAt: string;
  seo_title?: string;
  seo_description?: string;
  reading_time_minutes?: number;
  is_featured?: boolean;
  is_pinned?: boolean;
  allow_comments?: boolean;
  gallery_images?: string[];
}

export interface BlogComment {id: string;
  postId: string;
  userId: string;
  author_id?: string;
  userName: string;
  author_name?: string;
  content: string;
  parentId?: string;
  likes: number;
  likes_count?: number;
  createdAt: string;
  created_at?: string;
  updatedAt: string;
  author_avatar?: string;
  is_edited?: boolean;
  replies?: BlogComment[];
}

export interface BlogReadingList {id: string;
  name: string;
  description?: string;
  userId: string;
  items: BlogReadingListItem[];
  createdAt: string;
  updatedAt: string;
  is_default?: boolean;
}

export interface BlogReadingListItem {id: string;
  listId: string;
  postId: string;
  position: number;
  addedAt: string;
}

export interface BlogTag {id: string;
  name: string;
  usage_count?: number;
}

class BlogService {
  private api = axios.create({baseURL: `${API_BASE_URL}/blogs`,
headers: {
      'Content-Type': 'application/json'
    }
  });

  async getPosts(authorId?: string, status?: string, limit: number = 20): Promise<BlogPost[]> {
    const response = await this.api.get('/posts', {params: { authorId,
  status, limit } });
    return response.data;
  }

  async getPostById( postId: string): Promise<BlogPost> {
    const response = await this.api.get(`/posts/${postId}`);
    return response.data;
  }

  async createPost( postData: Partial<BlogPost>): Promise<BlogPost> {
    const response = await this.api.post('/posts', postData);
    return response.data;
  }

  async updatePost(
postId: string,
updates: Partial<BlogPost>): Promise<BlogPost> {
    const response = await this.api.put(`/posts/${postId}`, updates);
    return response.data;
  }

  async deletePost(
postId: string): Promise<void> {
    await this.api.delete(`/posts/${postId}`);
  }

  async publishPost(
postId: string): Promise<BlogPost> {
    const response = await this.api.post(`/posts/${postId}/publish`);
    return response.data;
  }

  async getComments(
postId: string, parentId?: string): Promise<BlogComment[]> {
    const response = await this.api.get(`/posts/${postId}/comments`, {params: { parentId } });
    return response.data;
  }

  async addComment(
postId: string,
content: string, parentId?: string): Promise<BlogComment> {
    const response = await this.api.post(`/posts/${postId}/comments`, { content, parentId });
    return response.data;
  }

  async likePost( postId: string): Promise<void> {
    await this.api.post(`/posts/${postId}/like`);
  }

  async unlikePost( postId: string): Promise<void> {
    await this.api.delete(`/posts/${postId}/like`);
  }

  async getTrendingPosts( limit: number = 10): Promise<BlogPost[]> {
    const response = await this.api.get('/posts/trending', {params: { limit } });
    return response.data;
  }

  async createComment( postId: string, content: string, parentId?: string): Promise<BlogComment> {
    const response = await this.api.post(`/posts/${postId}/comments`, { content, parentId });
    return response.data;
  }

  async getReadingLists(): Promise<any[]> {
    const response = await this.api.get('/reading-lists');
    return response.data;
  }

  async getReadingListItems(
listId: string): Promise<any[]> {
    const response = await this.api.get(`/reading-lists/${listId}/items`);
    return response.data;
  }

  async updateReadingListItem( itemId: string, updates: unknown): Promise<unknown> {
    const response = await this.api.put(`/reading-list-items/${itemId}`, updates);
    return response.data;
  }

  async removeReadingListItem( itemId: string): Promise<void> {
    await this.api.delete(`/reading-list-items/${itemId}`);
  }

  async getTags(): Promise<BlogTag[]> {
    const response = await this.api.get('/tags');
    return response.data;
  }
}

export const blogService = new BlogService();
export default blogService;
