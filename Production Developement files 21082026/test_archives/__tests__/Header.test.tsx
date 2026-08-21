import { Link, MemoryRouter } from 'react-router-dom';
import React, {} from 'react';
import { useAppContext } from '../contexts/AppContext';
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from '../components/Header';


// Mock the Link component from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  )}));

// Mock the heroicons
jest.mock("../components/icons", () => ({
  ArrowTrendingUpIcon: () => <div data-testid="trending-icon" />,
  ShoppingBagIcon: () => <div data-testid="shopping-icon" />,
  HeartIcon: () => <div data-testid="heart-icon" />,
  MusicalNoteIcon: () => <div data-testid="music-icon" />,
  FilmIcon: () => <div data-testid="film-icon" />,
  VideoCameraIcon: () => <div data-testid="video-icon" />,
  PhotoIcon: () => <div data-testid="photo-icon" />,
  ChatBubbleLeftRightIcon: () => <div data-testid="chat-icon" />,
  ExclamationTriangleIcon: () => <div data-testid="exclamation-icon" />,
  Bars3Icon: () => <div data-testid="bars-icon" />,
  MagnifyingGlassIcon: () => <div data-testid="magnifying-glass-icon" />,
  UserCircleIcon: () => <div data-testid="member-circle-icon" />}));

// Mock the AppContext
jest.mock("../contexts/AppContext", () => ({
  useAppContext: () => ({
    ficBalance: 1250,
    member: null,
    login: jest.fn(),
    logout: jest.fn(),
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isMenuOpen: false,
    toggleMenu: jest.fn(),
    closeMenu: jest.fn(),
    openMenu: jest.fn()})}));

describe("Header", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Header 
          pageTitle="Test Page" 
          onMenuToggle={() => {}} // Adding the required onMenuToggle prop
        />
      </MemoryRouter>
    );
    expect(screen.getByText("Trends")).toBeInTheDocument();
  });

  it("displays all main navigation items", () => {
    render(<Header onMenuToggle={jest.fn()} />);

    expect(screen.getByText("Trends")).toBeInTheDocument();
    expect(screen.getByText("Hallmarks")).toBeInTheDocument();
    expect(screen.getByText("Groups")).toBeInTheDocument();
    expect(screen.getByText("Gems")).toBeInTheDocument();
  });

  it("shows search bar", () => {
    render(<Header onMenuToggle={jest.fn()} />);

    const searchInput = screen.getByPlaceholderText("Search...");
    expect(searchInput).toBeInTheDocument();
  });

  it("shows user profile section", () => {
    render(<Header onMenuToggle={jest.fn()} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /john doe/i })).toBeInTheDocument();
  });

  it("renders all icons", () => {
    render(<Header onMenuToggle={jest.fn()} />);

    expect(screen.getByTestId("trending-icon")).toBeInTheDocument();
    expect(screen.getByTestId("shopping-icon")).toBeInTheDocument();
    expect(screen.getByTestId("heart-icon")).toBeInTheDocument();
    expect(screen.getByTestId("music-icon")).toBeInTheDocument();
    expect(screen.getByTestId("film-icon")).toBeInTheDocument();
    expect(screen.getByTestId("video-icon")).toBeInTheDocument();
    expect(screen.getByTestId("photo-icon")).toBeInTheDocument();
    expect(screen.getByTestId("chat-icon")).toBeInTheDocument();
    expect(screen.getByTestId("exclamation-icon")).toBeInTheDocument();
    expect(screen.getByTestId("bars-icon")).toBeInTheDocument();
    expect(screen.getByTestId("magnifying-glass-icon")).toBeInTheDocument();
    expect(screen.getByTestId("member-circle-icon")).toBeInTheDocument();
  });
});