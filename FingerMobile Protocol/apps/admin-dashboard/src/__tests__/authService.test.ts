import AuthService from '../services/authService';

describe('AuthService', () => {
  beforeEach(() => {
    // Reset the singleton instance before each test
    Object.assign(AuthService, new (AuthService.constructor as any)());
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('login', () => {
    it('should successfully log in with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = await AuthService.login(credentials);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(credentials.email);
      expect(result.token).toBeDefined();
      expect(AuthService.getCurrentUser()).toEqual(result.user);
    });
  });

  describe('logout', () => {
    it('should clear user and token on logout', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      await AuthService.login(credentials);
      expect(AuthService.isAuthenticated()).toBe(true);

      AuthService.logout();

      expect(AuthService.isAuthenticated()).toBe(false);
      expect(AuthService.getCurrentUser()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is logged in', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      await AuthService.login(credentials);

      expect(AuthService.isAuthenticated()).toBe(true);
    });

    it('should return false when user is not logged in', () => {
      expect(AuthService.isAuthenticated()).toBe(false);
    });
  });

  describe('setToken and getToken', () => {
    it('should store and retrieve token correctly', () => {
      const token = 'test-token-12345';
      
      AuthService.setToken(token);
      
      expect(AuthService.getToken()).toBe(token);
    });

    it('should persist token in localStorage', () => {
      const token = 'test-token-67890';
      
      AuthService.setToken(token);
      
      expect(localStorage.getItem('token')).toBe(token);
    });
  });

  describe('initializeFromStorage', () => {
    it('should load token from localStorage if present', () => {
      const token = 'stored-token-abcde';
      localStorage.setItem('token', token);
      
      AuthService.initializeFromStorage();
      
      expect(AuthService.getToken()).toBe(token);
    });

    it('should not set token if not in localStorage', () => {
      AuthService.initializeFromStorage();
      
      expect(AuthService.getToken()).toBeNull();
    });
  });
});