import axios from 'axios';
import authService from '../authService';
import UserService from '../UserService';

const mockedAxios = axios as jest.Mocked<typeof axios>;
const api = () => mockedAxios.create();

describe('Authentication and profile services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('registers a user and returns the current auth response shape', async () => {
    const payload = {
      accessToken: 'access-1', refreshToken: 'refresh-1',
      user: { id: 'user-1', email: 'member@example.com' },
    };
    api().post.mockResolvedValue({ data: payload });

    const result = await authService.register({ email: 'member@example.com', password: 'safe-password' });

    expect(result).toEqual(payload);
    expect(api().post).toHaveBeenCalledWith('/register', { email: 'member@example.com', password: 'safe-password' });
  });

  it('logs in and stores the returned session token', async () => {
    const payload = {
      accessToken: 'access-2', refreshToken: 'refresh-2',
      user: { id: 'user-2', email: 'member@example.com' },
    };
    api().post.mockResolvedValue({ data: payload });

    const result = await authService.login({ email: 'member@example.com', password: 'safe-password' });

    expect(result.user.id).toBe('user-2');
    expect(authService.getToken()).toBe('access-2');
  });

  it('loads and updates a profile through the user service API', async () => {
    api().get.mockResolvedValue({ data: { id: 'user-3', username: 'member3' } });
    const profile = await UserService.getCurrentUser();
    expect(profile.data?.id).toBe('user-3');

    api().put.mockResolvedValue({ data: { id: 'user-3', firstName: 'Updated' } });
    const updated = await UserService.updateUserProfile({ firstName: 'Updated' });
    expect(updated.data?.firstName).toBe('Updated');
  });

  it('uses the current password reset endpoints and payloads', async () => {
    api().post.mockResolvedValue({ data: {} });

    await authService.forgotPassword('member@example.com');
    expect(api().post).toHaveBeenCalledWith('/forgot-password', { identifier: 'member@example.com' });

    await authService.resetPassword('reset-1', 'NewPassword123!');
    expect(api().post).toHaveBeenLastCalledWith('/reset-password', { token: 'reset-1', newPassword: 'NewPassword123!' });
  });

  it('sends and verifies a phone code using the current API contract', async () => {
    api().post.mockResolvedValue({ data: { user: { id: 'user-4' }, accessToken: 'access-4', refreshToken: 'refresh-4' } });

    await authService.sendVerificationCode('+1234567890');
    expect(api().post).toHaveBeenCalledWith('/send-verification', { phone: '+1234567890' });

    const result = await authService.verifyCode('+1234567890', '123456');
    expect(result.user.id).toBe('user-4');
    expect(api().post).toHaveBeenLastCalledWith('/verify-code', { phone: '+1234567890', code: '123456' });
  });

  it('clears the session on logout', async () => {
    localStorage.setItem('accessToken', 'access-5');
    localStorage.setItem('refreshToken', 'refresh-5');
    api().post.mockResolvedValue({ data: {} });

    await authService.logout();

    expect(api().post).toHaveBeenCalledWith('/logout');
    expect(authService.isAuthenticated()).toBe(false);
  });
});
