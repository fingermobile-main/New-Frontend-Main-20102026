import ApiService from './api';

export interface Post {
  id: string;
  userId: string;
  title?: string;
  content: string;
  contentType: 'text' | 'image' | 'video' | 'link' | 'poll';
  mediaUrls?: string[];
  postStatus: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'followers_only' | 'private';
  scheduledPublishAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  tags?: string[];
  location?: string;
  parentId?: string;
  isRepost: boolean;
  repostOriginalPostId?: string;
  language: string;
  user: {
    id: string;
    username: string;
    profileImageUrl?: string;
  };
}

export interface CreatePostRequest {
  title?: string;
  content: string;
  contentType?: 'text' | 'image' | 'video' | 'link' | 'poll';
  mediaUrls?: string[];
  visibility?: 'public' | 'followers_only' | 'private';
  scheduledPublishAt?: string;
  tags?: string[];
  location?: string;
  language?: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  contentType?: 'text' | 'image' | 'video' | 'link' | 'poll';
  mediaUrls?: string[];
  postStatus?: 'draft' | 'published' | 'archived';
  visibility?: 'public' | 'followers_only' | 'private';
  scheduledPublishAt?: string;
  tags?: string[];
  location?: string;
  language?: string;
}

export interface PostListResponse {
  data: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class PostService {
  private static instance: PostService;
  
  private constructor() {}
  
  public static getInstance(): PostService {
    if (!PostService.instance) {
      PostService.instance = new PostService();
    }
    return PostService.instance;
  }

  async getPosts(params: { 
    page?: number; 
    limit?: number; 
    sortBy?: string; 
    sortOrder?: 'asc' | 'desc'; 
    status?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<PostListResponse> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.status) queryParams.append('status', params.status);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    return ApiService.get(`/posts?${queryParams.toString()}`);
  }

  async getPostById(id: string): Promise<Post> {
    return ApiService.get(`/posts/${id}`);
  }

  async createPost(postData: CreatePostRequest): Promise<Post> {
    return ApiService.post('/posts', postData);
  }

  async updatePost(id: string, postData: UpdatePostRequest): Promise<Post> {
    return ApiService.put(`/posts/${id}`, postData);
  }

  async deletePost(id: string): Promise<void> {
    return ApiService.delete(`/posts/${id}`);
  }

  async publishPost(id: string): Promise<Post> {
    return ApiService.post(`/posts/${id}/publish`);
  }

  async archivePost(id: string): Promise<Post> {
    return ApiService.post(`/posts/${id}/archive`);
  }

  async getPostAnalytics(id: string): Promise<any> {
    return ApiService.get(`/posts/${id}/analytics`);
  }
}

export default PostService.getInstance();