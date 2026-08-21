import React, {} from 'react';
import { renderHook, act } from "@testing-library/react-hooks";
import { useGems } from '../useGems';
import ApiService from '../../services/apiService';

// Mock the ApiService
jest.mock("../../services/apiService", () => ({
request: jest.fn(),
getGems: jest.fn()
}));

const mockApiService = ApiService as jest.Mocked<typeof ApiService>;

describe("useGems", () => {
  const mockGems = [
    {
id: "1",
_type: "post",
author: {
id: "1",
name: "John Doe",
membername: "johndoe",
email: "john@example.com"
      },
timestamp: "2023-01-01T00:00:00Z",
content: "Test gem 1",
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
timestamp: "2023-01-02T00:00:00Z",
content: "Test gem 2",
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

  it("should fetch gems successfully", async () => {
    mockApiService.request.mockResolvedValue({
success: true,
data: mockGems,
message: "Success"
    });

    const { result, waitForNextUpdate } = renderHook(() => useGems());

    expect(result.current.loading).toBe(true);
    expect(result.current.gems).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.gems).toEqual(mockGems);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch error", async () => {
    mockApiService.request.mockRejectedValue(new Error("Failed to fetch"));

    const { result, waitForNextUpdate } = renderHook(() => useGems());

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.gems).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch gems.");
  });

  it("should refresh data when refreshGems is called", async () => {
    mockApiService.request.mockResolvedValue({
success: true,
data: mockGems,
message: "Success"
    });

    const { result, waitForNextUpdate } = renderHook(() => useGems());

    await waitForNextUpdate();

    expect(mockApiService.getPosts).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.refreshGems();
    });

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(mockApiService.getPosts).toHaveBeenCalledTimes(2);
  });
});
