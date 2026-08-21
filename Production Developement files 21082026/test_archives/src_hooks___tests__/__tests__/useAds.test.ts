import React, {} from 'react';
import { renderHook, act } from "@testing-library/react-hooks";
import { useAds } from '../useAds';
import ApiService from '../../services/apiService';

// Mock the ApiService
jest.mock("../../services/apiService", () => ({
request: jest.fn(),
getAds: jest.fn()
}));

const mockApiService = ApiService as jest.Mocked<typeof ApiService>;

describe("useAds", () => {
  const mockAds = [
    {
id: "1",
title: "Test Ad 1",
description: "This is a test ad",
targetUrl: "https://example.com",
placement: "feed",
startDate: "2023-01-01",
endDate: "2023-12-31",
impressions: 1000,
clicks: 50,
cost: 100
    },
    {
id: "2",
title: "Test Ad 2",
description: "This is another test ad",
targetUrl: "https://example2.com",
placement: "sidebar",
startDate: "2023-01-01",
endDate: "2023-12-31",
impressions: 2000,
clicks: 100,
cost: 200
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch ads successfully", async () => {
    mockApiService.request.mockResolvedValue({
isSuccess: true,
data: mockAds,
message: "Success"
    });

    const { result, waitForNextUpdate } = renderHook(() => useAds());

    expect(result.current.loading).toBe(true);
    expect(result.current.ads).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.ads).toEqual(mockAds);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch error", async () => {
    mockApiService.request.mockRejectedValue(new Error("Failed to fetch"));

    const { result, waitForNextUpdate } = renderHook(() => useAds());

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.ads).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch ads.");
  });

  it("should refresh data when refreshAds is called", async () => {
    mockApiService.request.mockResolvedValue({
isSuccess: true,
data: mockAds,
message: "Success"
    });

    const { result, waitForNextUpdate } = renderHook(() => useAds());

    await waitForNextUpdate();

    expect(mockApiService.request).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.refreshAds();
    });

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(mockApiService.request).toHaveBeenCalledTimes(2);
  });
});
