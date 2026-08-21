import React, {} from 'react';
import { renderHook, act } from "@testing-library/react-hooks";
import { useCommunityGroups } from '../useCommunityGroups';
import ApiService from '../../services/apiService';

// Mock the ApiService
jest.mock("../../services/apiService", () => ({
request: jest.fn(),
getCommunityGroups: jest.fn()
}));

const mockApiService = ApiService as jest.Mocked<typeof ApiService>;

describe("useCommunityGroups", () => {
  const mockGroups = [
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
content: "Test group post 1",
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
content: "Test group post 2",
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

  it("should fetch community groups successfully", async () => {
    mockApiService.getPosts.mockResolvedValue({
success: true,
data: mockGroups,
message: "Success"
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      useCommunityGroups(),
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.groups).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.groups).toEqual(mockGroups);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch error", async () => {
    mockApiService.getPosts.mockRejectedValue(new Error("Failed to fetch"));

    const { result, waitForNextUpdate } = renderHook(() =>
      useCommunityGroups(),
    );

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.groups).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch community groups.");
  });

  it("should refresh data when refreshGroups is called", async () => {
    mockApiService.getPosts.mockResolvedValue({
success: true,
data: mockGroups,
message: "Success"
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      useCommunityGroups(),
    );

    await waitForNextUpdate();

    expect(mockApiService.getPosts).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.refreshGroups();
    });

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(mockApiService.getPosts).toHaveBeenCalledTimes(2);
  });
});
