import React, {} from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GroupsPage from '../GroupsPage';
import * as useCommunityGroupsModule from '../../hooks/useCommunityGroups';

// Mock the useCommunityGroups hook
jest.mock("../../hooks/useCommunityGroups");

const mockUseCommunityGroups = useCommunityGroupsModule as jest.Mocked<typeof useCommunityGroupsModule>;

// Mock the MainLayout component
jest.mock("../../components/layout/MainLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  )}));

// Mock the PostCard component
jest.mock("../../components/PostCard", () => ({
  __esModule: true,
  default: ({ post }: { post: any }) => (
    <div data-testid="post-card">
      <h2>{post.content}</h2>
    </div>
  )}));

// Mock the LoadingSpinner component
jest.mock("../../components/LoadingSpinner", () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>}));

// Mock contexts
jest.mock("../../contexts/HapticFeedbackContext", () => ({
  useHaptic: () => ({
    triggerHaptic: jest.fn()})}));

jest.mock("../../contexts/CommunityContext", () => ({
  useCommunity: () => ({
    displayOption: "card",
    setDisplayOption: jest.fn()})}));

jest.mock("../../contexts/AppContext.tsx", () => ({
  useAppContext: () => ({
    ficBalance: 100,
    openModal: jest.fn(),
    showToast: jest.fn(),
    handleAiAssist: jest.fn()})}));

describe("GroupsPage", () => {
  const mockGroups = [
    {
      id: "1",
      name: "Test Group 1",
      description: "A test group",
      category: "general",
      createdBy: { id: "1", membername: "John Doe" },
      isPrivate: false,
      memberCount: 10,
      isMember: true,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z"},
    {
      id: "2",
      name: "Test Group 2",
      description: "Another test group",
      category: "general",
      createdBy: { id: "2", membername: "Jane Smith" },
      isPrivate: false,
      memberCount: 20,
      isMember: false,
      createdAt: "2023-01-02T00:00:00Z",
      updatedAt: "2023-01-02T00:00:00Z"},
  ] as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state initially", () => {
    mockUseCommunityGroups.useCommunityGroups.mockReturnValue({
      groups: [],
      loading: true,
      error: null,
      refreshGroups: jest.fn(),
      createGroup: jest.fn(),
      joinGroup: jest.fn(),
      leaveGroup: jest.fn()});

    render(<GroupsPage />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should render groups when loaded", async () => {
    mockUseCommunityGroups.useCommunityGroups.mockReturnValue({
      groups: mockGroups,
      loading: false,
      error: null,
      refreshGroups: jest.fn(),
      createGroup: jest.fn(),
      joinGroup: jest.fn(),
      leaveGroup: jest.fn()});

    render(<GroupsPage />);

    await waitFor(() => {
      expect(screen.getAllByTestId("post-card")).toHaveLength(2);
    });

    expect(screen.getByText("Test group post 1")).toBeInTheDocument();
    expect(screen.getByText("Test group post 2")).toBeInTheDocument();
  });

  it("should render error message when there is an error", async () => {
    mockUseCommunityGroups.useCommunityGroups.mockReturnValue({
      groups: [],
      loading: false,
      error: "Failed to fetch community groups.",
      refreshGroups: jest.fn(),
      createGroup: jest.fn(),
      joinGroup: jest.fn(),
      leaveGroup: jest.fn()});

    render(<GroupsPage />);

    expect(
      screen.getByText(
        "Error loading groups: Failed to fetch community groups.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
