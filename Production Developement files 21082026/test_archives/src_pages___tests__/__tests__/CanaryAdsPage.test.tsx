import { useNavigate} from 'react-router-dom';
import React, {} from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CanaryAdsPage from '../CanaryAdsPage';

// Mock the useAds hook
const mockUseAds = jest.fn();
jest.mock("../../hooks/useAds", () => ({
  useAds: (...args: any[]) => mockUseAds(...args)}));

// Mock the icons
jest.mock("../../components/icons.tsx", () => ({
  UsersIcon: () => <svg data-testid="users-icon" />,
  // Add other icons used in CanaryAdsPage if necessary
}));

// Mock the AppContext
jest.mock("../../contexts/AppContext.tsx", () => ({
  useAppContext: () => ({
    member: {
      id: "123",
      username: "testuser",
      email: "test@example.com",
      avatarUrl: "https://example.com/avatar.jpg",
      role: "Member",
      ficBalance: 100,
      isLoggedIn: true},
    handleSubmitAdCampaign: jest.fn(),
    showToast: jest.fn()})}));

// Mock the MainLayout component
jest.mock("../../components/layout/MainLayout", () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="main-layout">{children}</div>
    )};
});

// Mock the LoadingSpinner component
jest.mock("../../components/LoadingSpinner", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="loading-spinner">Loading...</div>};
});

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  NavLink: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useNavigate: () => jest.fn()}));

describe("CanaryAdsPage", () => {
  const mockAds = [
    {
      id: "1",
      title: "Test Ad 1",
      description: "This is a test ad",
      placement: "feed",
      impressions: 1000,
      clicks: 50,
      cost: 100},
    {
      id: "2",
      title: "Test Ad 2",
      description: "This is another test ad",
      placement: "sidebar",
      impressions: 2000,
      clicks: 100,
      cost: 200},
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state initially", () => {
    mockUseAds.mockReturnValue({
      ads: [],
      loading: true,
      error: null,
      refreshAds: jest.fn()});

    render(<CanaryAdsPage />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should render ads when loaded", async () => {
    mockUseAds.mockReturnValue({
      ads: mockAds,
      loading: false,
      error: null,
      refreshAds: jest.fn()});

    render(<CanaryAdsPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Ad 1")).toBeInTheDocument();
      expect(screen.getByText("Test Ad 2")).toBeInTheDocument();
    });
  });

  it("should render error message when there is an error", async () => {
    mockUseAds.mockReturnValue({
      ads: [],
      loading: false,
      error: "Failed to fetch ads.",
      refreshAds: jest.fn()});

    render(<CanaryAdsPage />);

    expect(
      screen.getByText("Error loading ads: Failed to fetch ads."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
