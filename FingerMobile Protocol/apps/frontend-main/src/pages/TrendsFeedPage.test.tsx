import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TrendsFeedPage from './TrendsFeedPage';

// Mock MainLayout & AppContext
jest.mock('../components/layout/MainLayout', () => ({ children }: any) => <div data-testid="main-layout">{children}</div>);
jest.mock('../components/TrendsFeed', () => () => <div data-testid="trends-feed">Trends Feed Component</div>);
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    openModal: jest.fn(),
    showToast: jest.fn(),
    ficBalance: 120.5
  })
}));

describe('TrendsFeedPage Mobile Optimization', () => {
  it('renders trends feed header and title', async () => {
    render(
      <BrowserRouter>
        <TrendsFeedPage />
      </BrowserRouter>
    );

    expect(screen.getAllByText(/Trends Feed/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders sovereign mobile quick dock with Radar, Forum, and Post navigation', () => {
    render(
      <BrowserRouter>
        <TrendsFeedPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('link', { name: /radar/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /forum/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('link', { name: /post/i }).length).toBeGreaterThanOrEqual(1);
  });
});
