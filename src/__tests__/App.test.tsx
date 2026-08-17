import { MemoryRouter } from 'react-router-dom';
import React, {} from 'react';
import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import App from '../App';

// Simple test to verify App renders without crashing
describe("App", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    
    // Basic check to ensure something rendered
    expect(container.firstChild).toBeInTheDocument();
  });
});

// Removed global jest declaration to prevent conflicts

// Mock all the page components to isolate the test
// @ts-ignore to bypass jest.mock namespace errors
jest.mock("../pages/HomePage", () => () => <div>Home Page</div>);
jest.mock("../pages/ProfilePage", () => () => <div>Profile Page</div>);
jest.mock("../pages/Dancia4TvPage", () => () => <div>Dancia4Tv Page</div>);
jest.mock("../pages/AboutPage", () => () => <div>About Page</div>);
jest.mock("../pages/CommunityPages", () => () => <div>Community Pages</div>);
jest.mock("../pages/CommunityManagementPage", () => () => (
  // @ts-ignore
  <div>Community Management Page</div>
));
jest.mock("../pages/AdminControlDashboard", () => () => (
  // @ts-ignore
  <div>Admin Control Dashboard</div>
));
jest.mock("../pages/MarketplacePage", () => () => <div>Marketplace Page</div>);
jest.mock("../pages/OwnItPage", () => () => <div>Own It Page</div>);
jest.mock("../pages/StorefrontPage", () => () => <div>Storefront Page</div>);
jest.mock("../components/Toast", () => () => <div>Toast</div>);

// Mock contexts
jest.mock("../contexts/AppProvider", () => ({
  AppProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )}));

jest.mock("../contexts/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )}));

jest.mock("../contexts/Dancia4TvContext", () => ({
  Dancia4TvProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )}));

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Routes: () => <div>Routes</div>,
  Route: () => <div>Route</div>}));

describe("App", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("renders the main app providers", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    // Check that the providers are rendering children
    expect(screen.getByText("Routes")).toBeInTheDocument();
  });
});

export {};