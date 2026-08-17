import React, {} from 'react';
import axios from 'axios';
import { authService } from '../services/AuthService';
import { userService } from '../services/UserService';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Authentication Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Registration to Login Flow', () => {
    it('should complete registration flow successfully', async () => {
      const mockResponse = {
data: {
user: {
id: 'user123',
email: 'test@example.com',
username: 'testuser' },
token: 'mock-jwt-token',
refreshToken: 'mock-refresh-token'
        }
      };

      (mockedAxios.create().post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.register({
email: 'test@example.com',
username: 'testuser',
password: process.env.TEST_USER_PASSWORD || 'secure_test_password'
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBeDefined();
      expect(mockedAxios.create().post).toHaveBeenCalledWith('/register', {
email: 'test@example.com',
username: 'testuser',
password: process.env.TEST_USER_PASSWORD || 'secure_test_password'
      });
    });

    it('should handle registration validation errors', async () => {
      const mockError = {
response: {
data: {
message: 'Email already exists' },
status: 400
        }
      };

      (mockedAxios.create().post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        authService.register({
email: 'existing@example.com',
username: 'testuser',
password: process.env.TEST_USER_PASSWORD || 'secure_test_password'
        })
      ).rejects.toThrow();
    });
  });

  describe('Login and Profile Access Flow', () => {
    it('should login and retrieve user profile', async () => {
      const loginResponse = {
data: {
user: {
id: 'user123',
email: 'test@example.com',
username: 'testuser' },
token: 'mock-jwt-token'
        }
      };

      const profileResponse = {
data: {
id: 'user123',
username: 'testuser',
displayName: 'Test User',
bio: 'Test bio',
avatar: ',
https://example.com/avatar.jpg',
followers: 100,
following: 50
        }
      };

      (mockedAxios.create().post as jest.Mock).mockResolvedValue(loginResponse);
      (mockedAxios.create().get as jest.Mock).mockResolvedValue(profileResponse);

      // Step,
1: Login
      const loginResult = await authService.login({
email: 'test@example.com',
password: process.env.TEST_USER_PASSWORD || 'secure_test_password'
      });

      expect(loginResult.user.id).toBe('user123');

      // Step,
2: Get Profile
      const profile = await userService.getProfile('user123');

      expect(profile.username).toBe('testuser');
      expect(profile.displayName).toBe('Test User');
      expect(mockedAxios.create().get).toHaveBeenCalledWith('/user123');
    });

    it('should update user profile after login', async () => {
      const updatedProfile = {
data: {
id: 'user123',
username: 'testuser',
displayName: 'Updated Name',
bio: 'Updated bio',
avatar: ',
https://example.com/new-avatar.jpg'
        }
      };

      (mockedAxios.create().put as jest.Mock).mockResolvedValue(updatedProfile);

      const result = await userService.updateProfile('user123', {
displayName: 'Updated Name',
bio: 'Updated bio'
      });

      expect(result.displayName).toBe('Updated Name');
      expect(mockedAxios.create().put).toHaveBeenCalledWith('/user123', {
displayName: 'Updated Name',
bio: 'Updated bio'
      });
    });
  });

  describe('Logout Flow', () => {
    it('should logout and clear authentication state', async () => {
      (mockedAxios.create().post as jest.Mock).mockResolvedValue({
data: {
success: true } });

      await authService.logout();

      expect(mockedAxios.create().post).toHaveBeenCalledWith('/logout');
      
      // Verify auth state is cleared
      expect(authService.isAuthenticated()).toBe(false);
      expect(authService.getToken()).toBeNull();
    });
  });

  describe('Token Management Flow', () => {
    it('should refresh expired token', async () => {
      const refreshResponse = {
data: {
token: 'new-mock-jwt-token',
refreshToken: 'new-mock-refresh-token'
        }
      };

      (mockedAxios.create().post as jest.Mock).mockResolvedValue(refreshResponse);

      const result = await authService.refreshToken('old-refresh-token');

      expect(result.token).toBe('new-mock-jwt-token');
      expect(mockedAxios.create().post).toHaveBeenCalledWith('/refresh', {
refreshToken: 'old-refresh-token'
      });
    });

    it('should check authentication state correctly', () => {
      // Test with valid token
      localStorage.setItem('auth_token', 'valid-token');
      expect(authService.isAuthenticated()).toBe(true);
      expect(authService.getToken()).toBe('valid-token');

      // Test without token
      localStorage.removeItem('auth_token');
      expect(authService.isAuthenticated()).toBe(false);
      expect(authService.getToken()).toBeNull();
    });
  });

  describe('Password Reset Flow', () => {
    it('should request password reset', async () => {
      (mockedAxios.create().post as jest.Mock).mockResolvedValue({
data: {
success: true,
message: 'Reset email sent' }
      });

      await authService.requestPasswordReset('test@example.com');

      expect(mockedAxios.create().post).toHaveBeenCalledWith('/password-reset/request', {
email: 'test@example.com'
      });
    });

    it('should confirm password reset with token', async () => {
      (mockedAxios.create().post as jest.Mock).mockResolvedValue({
data: {
success: true }
      });

      await authService.confirmPasswordReset('reset-token', 'NewPassword123!');

      expect(mockedAxios.create().post).toHaveBeenCalledWith('/password-reset/confirm', {
token: 'reset-token',
newpassword: process.env.TEST_USER_PASSWORD || 'secure_test_password'
      });
    });
  });

  describe('Email Verification Flow', () => {
    it('should verify email with token', async () => {
      (mockedAxios.create().post as jest.Mock).mockResolvedValue({
data: {
success: true,
verified: true }
      });

      const result = await authService.verifyEmail('verification-token');

      expect(result.verified).toBe(true);
      expect(mockedAxios.create().post).toHaveBeenCalledWith('/verify-email', {
token: 'verification-token'
      });
    });

    it('should resend verification email', async () => {
      (mockedAxios.create().post as jest.Mock).mockResolvedValue({
data: {
success: true }
      });

      await authService.resendVerificationEmail('test@example.com');

      expect(mockedAxios.create().post).toHaveBeenCalledWith('/resend-verification', {
email: 'test@example.com'
      });
    });
  });
});
