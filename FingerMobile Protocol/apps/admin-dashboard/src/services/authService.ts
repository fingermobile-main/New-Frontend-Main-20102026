export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}


class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private token: string | null = null;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // In a real app, this would make an API call
    // For now, we'll simulate a successful login
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: '1',
          username: 'admin',
          email: credentials.email,
          role: 'admin',
          permissions: ['read', 'write', 'delete']
        };
        
        this.currentUser = mockUser;
        this.token = `mock-token-${Date.now()}`;
        
        resolve({
          user: mockUser,
          token: this.token
        });
      }, 500); // Simulate network delay
    });
  }

  logout(): void {
    this.currentUser = null;
    this.token = null;
    // Use the global localStorage directly to ensure consistency with tests
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null && this.token !== null;
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    // Use the global localStorage directly to ensure consistency with tests
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  initializeFromStorage(): void {
    // Use the global localStorage directly to ensure consistency with tests
    const storedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (storedToken) {
      this.token = storedToken;
      // In a real app, you'd verify the token and fetch user info
      // For now, we'll skip this step
    }
  }
}

export default AuthService.getInstance();