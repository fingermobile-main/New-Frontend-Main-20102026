import React, {} from 'react';
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PostCard from './PostCard';

describe("PostCard", () => {
  const mockPost = {
    id: "1",
    title: "Test Post",
    content: "Test content",
    excerpt: "Test excerpt",
    timestamp: new Date("2023-01-01"),
    likes: 0,
    comments: 0,
    shares: 0,
    mediaUrl: "",
    author: {
      id: "author-1",
      name: "Test User",
      avatar: ""
    },
    createdAt: "2023-01-01",
    likesCount: 0,
    repliesCount: 0,
    repostsCount: 0,
    bookmarksCount: 0,
    isLiked: false,
    isBookmarked: false,
    isReposted: false,
    type: "post" as const, // Explicitly typing as const to match union type
    privacy: "public",
    tags: [],
    views: 0,
    location: "",
    profileId: "profile-1",
    authorId: "author-1",
    isSpoiler: false,
    isPrivate: false,
    isFollowersOnly: false,
    isAiGenerated: false,
    viewsCount: 0,
    sharesCount: 0,
    giftCount: 0,
    tokenized: false
  };

  it("renders without crashing", () => {
    render(<PostCard post={mockPost as any} />);
    expect(screen.getByText(/test post/i)).toBeTruthy();
  });
});
