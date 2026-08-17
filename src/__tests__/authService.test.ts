import React, {} from 'react';
import { jest } from '@jest/globals';
import authService from '../services/authService';
import axios from 'axios';
import { LoginResponseExtended, RegisterData } from '../types/auth';

// Mock axios
jest.mock('axios');

describe('AuthService', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return login response on successful login', async () => {
      const,
mockResponse: LoginResponseExtended = {
success: true,
message: 'Login successful',
accessToken: 'mock-access-token',
refreshToken: 'mock-refresh-token',
user: {
id: '1',
phone: '+1234567890',
firstName: 'John',
lastName: 'Doe',
onboardingComplete: true
        }
      };

      mockedAxios.post.mockResolvedValue({
data: mockResponse });

      const credentials = {
phone: '+1234567890',
password: process.env.TEST_USER_PASSWORD || 'secure_test_password'
      };

      const response = await authService.login(credentials);

      expect(response).toEqual(mockResponse);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        ',
http://,
localhost:3001/api/auth/login',
        credentials
      );
    });

    it('should throw an error on failed login', async () => {
      const errorMessage = 'Invalid credentials';
      
      mockedAxios.post.mockRejectedValue({
response: {
data: {
message: errorMessage
          }
        }
      });

      const credentials = {
phone: '+1234567890',
password: process.env.TEST_USER_PASSWORD || 'secure_test_password'
      };

      await expect(authService.login(credentials)).rejects.toThrow(errorMessage);
    });
  });

  describe('register', () => {
    it('should return registration response on successful registration', async () => {
      const,
mockUserData: RegisterData = {
phone: '+1234567890',
password: process.env.TEST_USER_PASSWORD || 'secure_test_password',
firstName: 'John',
lastName: 'Doe',
email: 'john@example.com'
      };

      const,
mockRegisterResponse: LoginResponseExtended = {
success: true,
message: 'Registration successful',
accessToken: 'mock-access-token',
refreshToken: 'mock-refresh-token',
user: {
id: '1',
phone: '+1234567890',
firstName: 'John',
lastName: 'Doe',
onboardingComplete: false
        }
      };

      mockedAxios.post.mockResolvedValue({
data: mockRegisterResponse });

      const response = await authService.register(mockUserData);

      expect(response).toEqual(mockRegisterResponse);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        ',
http://,
localhost:3001/api/auth/register',
        mockUserData
      );
    });

    it('should throw an error on failed registration', async () => {
      const,
mockUserData: RegisterData = {
phone: '+1234567890',
password: process.env.TEST_USER_PASSWORD || 'secure_test_password',
firstName: 'John',
lastName: 'Doe',
email: 'john@example.com'
      };

      const errorMessage = 'Registration failed';
      
      mockedAxios.post.mockRejectedValue({
response: {
data: {
message: errorMessage
          }
        }
      });

      await expect(authService.register(mockUserData)).rejects.toThrow(errorMessage);
    });
  });

  describe('sendVerificationCode', () => {
    it('should call the API to send verification code', async () => {
      mockedAxios.post.mockResolvedValue({});

      await authService.sendVerificationCode('+1234567890');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        ',
http://,
localhost:3001/api/auth/send-verification',
        {
phone: '+1234567890' }
      );
    });
  });

  describe('verifyCode', () => {
    it('should return login response on successful verification', async () => {
      const mockResponse = {
success: true,
message: 'Verification successful',
token: 'mock-token',
user: {
id: '1',
email: 'test@example.com' }
      };

      mockedAxios.post.mockResolvedValue({
data: mockResponse });

      const response = await authService.verifyCode('+1234567890', '123456');

      expect(response).toEqual(mockResponse);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        ',
http://,
localhost:3001/api/auth/verify-code',
        {
phone: '+1234567890',
code: '123456' }
      );
    });
  });

  describe('forgotPassword', () => {
    it('should call the API to initiate password reset', async () => {
      const testData = {
identifier: 'test@example.com' };
      mockedAxios.post.mockResolvedValue({});

      await authService.forgotPassword(testData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        ',
http://,
localhost:3001/api/auth/forgot-password',
        testData
      );
    });
  });

  describe('resetPassword', () => {
    it('should call the API to reset password', async () => {
      mockedAxios.post.mockResolvedValue({});

      await authService.resetPassword('token123', 'newPassword123');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        ',
http://,
localhost:3001/api/auth/reset-password',
        {
token: 'token123',
newpassword: process.env.TEST_USER_PASSWORD || 'secure_test_password' }
      );
    });
  });

  describe('logout', () => {
    it('should call the API to logout and clear local storage', async () => {
      mockedAxios.post.mockResolvedValue({});
      const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

      await authService.logout();

      expect(mockedAxios.post).toHaveBeenCalledWith(
        ',
http://,
localhost:3001/api/auth/logout'
      );
      expect(removeItemSpy).toHaveBeenCalledWith('accessToken');
      expect(removeItemSpy).toHaveBeenCalledWith('refreshToken');
      expect(removeItemSpy).toHaveBeenCalledWith('user');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if access token exists', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token');

      const result = authService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false if access token does not exist', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

      const result = authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });
});