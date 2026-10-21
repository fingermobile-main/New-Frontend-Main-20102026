import ApiService from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  profileImageUrl?: string;
  bio?: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  lastActiveAt?: string;
  timezone?: string;
  locale?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  bio?: string;
  role?: string;
  timezone?: string;
  locale?: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  profileImageUrl?: string;
  bio?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  emailVerified?: boolean;
  phoneVerified?: boolean;
  timezone?: string;
  locale?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class UserService {
  private static instance: UserService;
  
  private constructor() {}
  
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getUsers(params: PaginationParams = {}): Promise<UserListResponse> {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    return ApiService.get(`/users?${queryParams.toString()}`);
  }

  async getUserById(id: string): Promise<User> {
    return ApiService.get(`/users/${id}`);
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    return ApiService.post('/users', userData);
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    return ApiService.put(`/users/${id}`, userData);
  }

  async deleteUser(id: string): Promise<void> {
    return ApiService.delete(`/users/${id}`);
  }

  async suspendUser(id: string): Promise<User> {
    return ApiService.post(`/users/${id}/suspend`);
  }

  async activateUser(id: string): Promise<User> {
    return ApiService.post(`/users/${id}/activate`);
  }

  async verifyEmail(id: string): Promise<User> {
    return ApiService.post(`/users/${id}/verify-email`);
  }

  async verifyPhone(id: string): Promise<User> {
    return ApiService.post(`/users/${id}/verify-phone`);
  }
}

export default UserService.getInstance();