import React, {} from 'react';
import { useAppContext } from '../contexts/AppContext';
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import ForumPage from '../ForumPage';

import * as useForumPostsModule from '../../hooks/useForumPosts';

// Mock the useForumPosts hook
jest.mock("../../hooks/useForumPosts");

const mockUseForumPosts = useForumPostsModule as jest.Mocked<
  typeof useForumPostsModule
>;

// Mock the PageTemplate component
jest.mock("../../components/layouts/PageTemplate", () => {
  return {
    __esModule: true,
    default: ({
      title,
      children}: {
      title: string;
      children: React.ReactNode;
    }) => (
      <div>
        <h1>{title}</h1>
        {children}
      </div>
    )};
});

// Mock the PostCard component
jest.mock("../../components/PostCard", () => {
  return {
    __esModule: true,
    default: ({ post }: { post: any }) => (
      <div data-testid="post-card">
        <h2>{post.content}</h2>
      </div>
    )};
});

describe("ForumPage", () => {
  const mockPosts = [
    {
      id: "1",
      title: "Test Post 1",
      content: "Test forum post 1",
      author: { id: "1", membername: "John Doe", avatar: "" },
      category: "general",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
      likes: 0,
      commentCount: 0,
      isLiked: false,
      viewCount: 0},
    {
      id: "2",
      title: "Test Post 2",
      content: "Test forum post 2",
      author: { id: "2", membername: "Jane Smith", avatar: "" },
      category: "general",
      createdAt: "2023-01-02T00:00:00Z",
      updatedAt: "2023-01-02T00:00:00Z",
      likes: 0,
      commentCount: 0,
      isLiked: false,
      viewCount: 0},
  ] as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseForumPosts.useForumPosts.mockReturnValue({
      forumPosts: mockPosts,
      loading: false,
      error: null,
      fetchForumPosts: jest.fn(),
      likePost: jest.fn(),
      addComment: jest.fn(),
      refreshData: jest.fn()});
  });
  it("renders without crashing", async () => {
    render(<ForumPage />);

    expect(screen.getByText("Forum")).toBeInTheDocument();
  });

  it("displays loading state initially", () => {
    mockUseForumPosts.useForumPosts.mockReturnValue({
      forumPosts: [],
      loading: true,
      error: null,
      fetchForumPosts: jest.fn(),
      likePost: jest.fn(),
      addComment: jest.fn(),
      refreshData: jest.fn()});
    render(<ForumPage />);

    // Initially should show loading
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should render forum posts when loaded", async () => {
    render(<ForumPage />);

    await waitFor(() => {
      expect(screen.getAllByTestId("post-card")).toHaveLength(2);
    });

    expect(screen.getByText("Test forum post 1")).toBeInTheDocument();
    expect(screen.getByText("Test forum post 2")).toBeInTheDocument();
  });

  it("should render error message when there is an error", async () => {
    mockUseForumPosts.useForumPosts.mockReturnValue({
      forumPosts: [],
      loading: false,
      error: "Failed to fetch forum posts.",
      fetchForumPosts: jest.fn(),
      likePost: jest.fn(),
      addComment: jest.fn(),
      refreshData: jest.fn()});

    render(<ForumPage />);

    expect(
      screen.getByText(
        "Error loading forum posts: Failed to fetch forum posts.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
