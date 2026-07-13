import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TrendsPage from '../TrendsPage';
import * as useCommunityPostsModule from '../../hooks/useCommunityPosts';

// Mock the useCommunityPosts hook
jest.mock("../../hooks/useCommunityPosts");

const mockUseCommunityPosts = useCommunityPostsModule as jest.Mocked<typeof useCommunityPostsModule>;

// Mock the AppContext
jest.mock("../../contexts/AppContext.tsx", () => ({
  useAppContext: () => ({
    ficBalance: 100,
    openModal: jest.fn(),
    showToast: jest.fn(),
    handleAiAssist: jest.fn(),
  }),
}));

// Mock the MainLayout component
jest.mock("../../components/layout/MainLayout", () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="main-layout">{children}</div>
    ),
  };
});

// Mock the PostCard component
jest.mock("../../components/PostCard", () => {
  return {
    __esModule: true,
    default: ({ post }: { post: any }) => (
      <div data-testid="post-card">
        <h2>{post.content}</h2>
      </div>
    ),
  };
});

// Mock the LoadingSpinner component
jest.mock("../../components/LoadingSpinner", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="loading-spinner">Loading...</div>,
  };
});

describe("TrendsPage", () => {
  const mockPosts = [
    {
      id: "1",
      content: "Test Trend post 1",
      author: { id: "1", email: "", username: "John Doe" },
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
      likesCount: 0,
      comments: [],
      isLiked: false,
    },
    {
      id: "2",
      content: "Test trend post 2",
      author: { id: "2", email: "", username: "Jane Smith" },
      createdAt: "2023-01-02T00:00:00Z",
      updatedAt: "2023-01-02T00:00:00Z",
      likesCount: 0,
      comments: [],
      isLiked: false,
    },
  ] as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state initially", () => {
    mockUseCommunityPosts.useCommunityPosts.mockReturnValue({
      posts: [],
      loading: true,
      error: null,
      refreshPosts: jest.fn(),
    });

    render(<TrendsPage />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should render posts when loaded", async () => {
    mockUseCommunityPosts.useCommunityPosts.mockReturnValue({
      posts: mockPosts,
      loading: false,
      error: null,
      refreshPosts: jest.fn(),
    });

    render(<TrendsPage />);

    await waitFor(() => {
      expect(screen.getAllByTestId("post-card")).toHaveLength(2);
    });

    expect(screen.getByText("Test trend post 1")).toBeInTheDocument();
    expect(screen.getByText("Test trend post 2")).toBeInTheDocument();
  });

  it("should render error message when there is an error", async () => {
    mockUseCommunityPosts.useCommunityPosts.mockReturnValue({
      posts: [],
      loading: false,
      error: "Failed to fetch community posts.",
      refreshPosts: jest.fn(),
    });

    render(<TrendsPage />);

    expect(
      screen.getByText(
        "Error loading trends: Failed to fetch community posts.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
