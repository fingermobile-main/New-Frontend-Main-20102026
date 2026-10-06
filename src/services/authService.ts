// authService.ts
// Production-grade Authentication Service with integrated interceptors for automated token rotation and persistent storage.

import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// --- Interface Models ---

export interface SubProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  animatedAvatarUrl?: string;
  type?: string;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: string;
  verified?: boolean;
  createdAt?: string;
  onboardingComplete?: boolean;
  mustChangePassword?: boolean;
  subProfiles?: SubProfile[];
}

export interface LoginCredentials {
  identifier?: string;
  email?: string;
  phone?: string;
  username?: string;
  password: string;
  twoFactorCode?: string;
}

export interface RegisterData {
  name?: string;
  email?: string;
  phone?: string;
  username?: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// --- Class Implementation ---

class AuthService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/auth`,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.initializeInterceptors();
  }

  /**
   * Orchestrates security interceptors for token attachment and automatic rotation
   */
  private initializeInterceptors(): void {
    // Request Interceptor: Inject bearer token context automatically
    this.api.interceptors.request.use(
      (config: any) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor: Seamlessly manage 401 token refresh loops
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const { config, response } = error;
        const originalRequest = config;

        if (response?.status === 401 && !originalRequest._retry) {
          if (originalRequest.url === '/refresh' || originalRequest.url === '/login') {
            this.clearSession();
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          if (!this.isRefreshing) {
            this.isRefreshing = true;
            try {
              const tokens = await this.refreshToken();
              this.isRefreshing = false;
              this.onTokenRefreshed(tokens.accessToken);
            } catch (refreshError) {
              this.isRefreshing = false;
              this.clearSession();
              return Promise.reject(refreshError);
            }
          }

          return new Promise((resolve) => {
            this.subscribeTokenRefresh((token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
              }
              resolve(this.api(originalRequest));
            });
          });
        }

        return Promise.reject(error);
      }
    );
  }

  private subscribeTokenRefresh(cb: (token: string) => void): void {
    this.refreshSubscribers.push(cb);
  }

  private onTokenRefreshed(token: string): void {
    this.refreshSubscribers.map((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  private setSession(authData: AuthResponse): void {
    localStorage.setItem('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);
    localStorage.setItem('user', JSON.stringify(authData.user));
  }

  private clearSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // --- Auth API Actions ---

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post<any>('/login', credentials);
    const data = response.data;
    const token = data.accessToken || data.token;
    if (token) {
      data.accessToken = token;
      if (data.user) {
        data.user.onboardingComplete = Boolean(data.user.onboardingComplete ?? true);
      }
      this.setSession(data);
      localStorage.setItem('fingermobile_token', token);
      localStorage.setItem('token', token);
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('hasCompletedOnboarding', 'true');
      if (data.user?.id) {
        localStorage.setItem(`onboardingComplete_${data.user.id}`, 'true');
      }

      // Check if user must change password
      if (data.user?.mustChangePassword) {
        localStorage.setItem('mustChangePassword', 'true');
      } else {
        localStorage.removeItem('mustChangePassword');
      }
    }
    return data;
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/register', data);
    if (response.data?.accessToken) {
      this.setSession(response.data);
    }
    return response.data;
  }

  public async logout(): Promise<void> {
    try {
      await this.api.post('/logout');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Logout processing exception context:', error);
    } finally {
      this.clearSession();
    }
  }

  public async getCurrentUser(): Promise<User | null> {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch {
        return null;
      }
    }
    return null;
  }

  public async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const currentRefreshToken = localStorage.getItem('refreshToken');
    if (!currentRefreshToken) {
      throw new Error('No valid refresh signature token payload mapped in device storage.');
    }

    const response = await this.api.post<{ accessToken: string; refreshToken: string }>('/refresh', {
      refreshToken: currentRefreshToken
    });

    if (response.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response.data;
  }

  public async sendVerificationCode(phone: string): Promise<void> {
    await this.api.post('/send-verification', { phone });
  }

  public async verifyCode(phone: string, code: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/verify-code', { phone, code });
    if (response.data?.accessToken) {
      this.setSession(response.data);
    }
    return response.data;
  }

  public async forgotPassword(identifier: string): Promise<void> {
    await this.api.post('/forgot-password', { identifier });
  }

  public async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.api.post('/reset-password', { token, newPassword });
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.api.post('/change-password', { currentPassword, newPassword });
    // Clear the must change password flag after successful change
    this.clearMustChangePasswordFlag();
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  public mustChangePassword(): boolean {
    return localStorage.getItem('mustChangePassword') === 'true';
  }

  public clearMustChangePasswordFlag(): void {
    localStorage.removeItem('mustChangePassword');
  }
}

export const authService = new AuthService();
export default authService;
