import UserService from '../UserService';
import { ApiService } from '../api';

describe('Social user service', () => {
  afterEach(() => jest.restoreAllMocks());

  it('follows a user through the current endpoint', async () => {
    const post = jest.spyOn(ApiService, 'post').mockResolvedValue({ data: {} } as any);

    const result = await UserService.followUser('member-123');

    expect(result.success).toBe(true);
    expect(post).toHaveBeenCalledWith('/users/member-123/follow');
  });

  it('unfollows a user through the current endpoint', async () => {
    const remove = jest.spyOn(ApiService, 'delete').mockResolvedValue({ data: {} } as any);

    const result = await UserService.unfollowUser('member-123');

    expect(result.success).toBe(true);
    expect(remove).toHaveBeenCalledWith('/users/member-123/unfollow');
  });

  it('returns the follow status from the API', async () => {
    jest.spyOn(ApiService, 'get').mockResolvedValue({ data: { isFollowing: true } } as any);

    const result = await UserService.isFollowing('member-123');

    expect(result.data?.isFollowing).toBe(true);
  });

  it('searches users and preserves the service response envelope', async () => {
    const users = [{ id: 'member-123', username: 'member123' }];
    const get = jest.spyOn(ApiService, 'get').mockResolvedValue({ data: { users, total: 1 } } as any);

    const result = await UserService.searchUsers('member', 5);

    expect(result.data?.users).toEqual(users);
    expect(get).toHaveBeenCalledWith('/users/search?q=member&limit=5&offset=0');
  });
});
