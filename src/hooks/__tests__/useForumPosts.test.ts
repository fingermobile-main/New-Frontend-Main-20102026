import React, {} from 'react';
import { renderHook, act } from "@testing-library/react-hooks";
import { useForumPosts } from '../useForumPosts';
import ApiService from '../../services/apiService';

// Mock the ApiService
jest.mock("../../services/apiService", () => ({
request: jest.fn(),
getForumPosts: jest.fn()
}));

const mockApiService = ApiService as jest.Mocked<typeof ApiService>;

describe("useForumPosts", () => {
  const mockPosts = [
    {
id: "1",
_type: "post",
author: {
id: "1",
name: "John Doe",
membername: "johndoe",
email: "john@example.com"
      },
timestamp: "2023-01-,
01T00:,
00:00Z",
content: "Test post 1",
likesCount: 10,
repliesCount: 5,
repostsCount: 2,
bookmarksCount: 1,
isLiked: false,
isReposted: false,
isSpoiler: false,
isPrivate: false,
isFollowersOnly: false,
isAiGenerated: false
    },
    {
id: "2",
_type: "post",
author: {
id: "2",
name: "Jane Smith",
membername: "janesmith",
email: "jane@example.com"
      },
timestamp: "2023-01-,
02T00:,
00:00Z",
content: "Test post 2",
likesCount: 20,
repliesCount: 3,
repostsCount: 1,
bookmarksCount: 0,
isLiked: true,
isReposted: false,
isSpoiler: false,
isPrivate: false,
isFollowersOnly: false,
isAiGenerated: false
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch forum posts successfully", async () => {
    mockApiService.request.mockResolvedValue({
isSuccess: true,
data: mockPosts,
message: "Success"
    });

    const { result, waitForNextUpdate } = renderHook(() => useForumPosts());

    expect(result.current.loading).toBe(true);
    expect(result.current.forumPosts).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.forumPosts).toEqual(mockPosts);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch error", async () => {
    mockApiService.request.mockRejectedValue(new Error("Failed to fetch"));

    const { result, waitForNextUpdate } = renderHook(() => useForumPosts());

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.forumPosts).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch forum posts.");
  });

  it("should refresh data when refreshData is called", async () => {
    mockApiService.request.mockResolvedValue({
isSuccess: true,
data: mockPosts,
message: "Success"
    });

    const { result, waitForNextUpdate } = renderHook(() => useForumPosts());

    await waitForNextUpdate();

    expect(mockApiService.request).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.refreshData();
    });

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(mockApiService.request).toHaveBeenCalledTimes(2);
  });
});
