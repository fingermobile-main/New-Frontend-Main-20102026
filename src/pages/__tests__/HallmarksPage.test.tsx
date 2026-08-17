import React, {} from 'react';
import { useAppContext } from '../contexts/AppContext';
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import HallmarksPage from '../HallmarksPage';
import * as useHallmarksModule from '../../hooks/useHallmarks';

// Mock the useHallmarks hook
jest.mock("../../hooks/useHallmarks");

const mockUseHallmarks = useHallmarksModule as jest.Mocked<typeof useHallmarksModule>;

// Mock the MainLayout component
jest.mock("../../components/layout/MainLayout", () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="main-layout">{children}</div>
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

// Mock the LoadingSpinner component
jest.mock("../../components/LoadingSpinner", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="loading-spinner">Loading...</div>};
});

// Mock contexts
jest.mock("../../contexts/HapticFeedbackContext", () => ({
  useHaptic: () => ({
    triggerHaptic: jest.fn()})}));

jest.mock("../../contexts/CommunityContext", () => ({
  useCommunity: () => ({
    displayOption: "card",
    setDisplayOption: jest.fn()})}));

describe("HallmarksPage", () => {
  const mockHallmarks = [
    {
      id: "1",
      content: "Test hallmark 1",
      author: { name: "John Doe" },
      timestamp: "2023-01-01T00:00:00Z"},
    {
      id: "2",
      content: "Test hallmark 2",
      author: { name: "Jane Smith" },
      timestamp: "2023-01-02T00:00:00Z"},
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state initially", () => {
    mockUseHallmarks.useHallmarks.mockReturnValue({
      hallmarks: [],
      loading: true,
      error: null,
      refreshData: jest.fn()});

    render(<HallmarksPage />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should render hallmarks when loaded", async () => {
    mockUseHallmarks.useHallmarks.mockReturnValue({
      hallmarks: mockHallmarks,
      loading: false,
      error: null,
      refreshData: jest.fn()});

    render(<HallmarksPage />);

    await waitFor(() => {
      expect(screen.getAllByTestId("post-card")).toHaveLength(2);
    });

    expect(screen.getByText("Test hallmark 1")).toBeInTheDocument();
    expect(screen.getByText("Test hallmark 2")).toBeInTheDocument();
  });

  it("should render error message when there is an error", async () => {
    mockUseHallmarks.useHallmarks.mockReturnValue({
      hallmarks: [],
      loading: false,
      error: "Failed to fetch hallmarks.",
      refreshData: jest.fn()});

    render(<HallmarksPage />);

    expect(
      screen.getByText("Error loading hallmarks: Failed to fetch hallmarks."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
