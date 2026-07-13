import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GemsPage from '../GemsPage';
import * as useGemsModule from '../../hooks/useGems';

// Mock the useGems hook
jest.mock("../../hooks/useGems");

const mockUseGems = useGemsModule as jest.Mocked<typeof useGemsModule>;

// Mock the AppContext
jest.mock("../../contexts/AppContext.tsx", () => ({
  AppContext: {
    Consumer: (props: any) => props.children({ ficBalance: 100 }),
  },
}));

// Mock components
jest.mock("../../components/AdBanner", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="ad-banner">Ad Banner</div>,
  };
});

jest.mock("../../components/FixedAdBanner", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="fixed-ad-banner">Fixed Ad Banner</div>,
  };
});

jest.mock("../../components/BurgerMenu", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="burger-menu">Burger Menu</div>,
  };
});

jest.mock("../../components/icons.tsx", () => ({
  GemIcon: () => <div data-testid="gem-icon">Gem Icon</div>,
  SearchIcon: () => <div data-testid="search-icon">Search Icon</div>,
  MicrophoneIcon: () => (
    <div data-testid="microphone-icon">Microphone Icon</div>
  ),
  TvIcon: () => <div data-testid="tv-icon">TV Icon</div>,
  MusicNoteIcon: () => <div data-testid="music-note-icon">Music Note Icon</div>,
  ShoppingBagIcon: () => (
    <div data-testid="shopping-bag-icon">Shopping Bag Icon</div>
  ),
  GiftIcon: () => <div data-testid="gift-icon">Gift Icon</div>,
  LinkIcon: () => <div data-testid="link-icon">Link Icon</div>,
}));

// Mock the LoadingSpinner component
jest.mock("../../components/LoadingSpinner", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="loading-spinner">Loading...</div>,
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

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => jest.fn(),
}));

describe("GemsPage", () => {
  const mockGems = [
    {
      id: 1,
      title: "Test Gem 1",
      description: "A test gem",
      author: "John Doe",
      price: "10.00",
      image: "https://example.com/gem1.jpg",
      tags: ["test"],
      likes: 0,
      views: 0,
      category: "test",
      isLiked: false,
      createdAt: "2023-01-01T00:00:00Z",
    },
    {
      id: 2,
      title: "Test Gem 2",
      description: "Another test gem",
      author: "Jane Smith",
      price: "20.00",
      image: "https://example.com/gem2.jpg",
      tags: ["test"],
      likes: 0,
      views: 0,
      category: "test",
      isLiked: false,
      createdAt: "2023-01-02T00:00:00Z",
    },
  ] as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state initially", () => {
    mockUseGems.useGems.mockReturnValue({
      gems: [],
      loading: true,
      error: null,
      refreshGems: jest.fn(),
      likeGem: jest.fn(),
      sendGift: jest.fn(),
      createPaylink: jest.fn(),
    });

    render(<GemsPage />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should render gems when loaded", async () => {
    mockUseGems.useGems.mockReturnValue({
      gems: mockGems,
      loading: false,
      error: null,
      refreshGems: jest.fn(),
      likeGem: jest.fn(),
      sendGift: jest.fn(),
      createPaylink: jest.fn(),
    });

    render(<GemsPage />);

    await waitFor(() => {
      expect(screen.getAllByTestId("post-card")).toHaveLength(2);
    });

    expect(screen.getByText("Test Gem 1")).toBeInTheDocument();
    expect(screen.getByText("Test gem 2")).toBeInTheDocument();
  });

  it("should render error message when there is an error", async () => {
    mockUseGems.useGems.mockReturnValue({
      gems: [],
      loading: false,
      error: "Failed to fetch gems.",
      refreshGems: jest.fn(),
      likeGem: jest.fn(),
      sendGift: jest.fn(),
      createPaylink: jest.fn(),
    });

    render(<GemsPage />);

    expect(screen.getByText("Failed to fetch gems.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
