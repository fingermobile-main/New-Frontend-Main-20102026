import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LiveStreamingPage from './LiveStreamingPage';

// Mock contexts and components
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    isLive: false,
    ficBalance: 1250,
    scheduledEvents: [],
    showToast: jest.fn(),
    handleStopLive: jest.fn(),
    handleStartConference: jest.fn(),
    paidStreamIds: []
  })
}));

jest.mock('../components/layout/MainLayout', () => ({ children }: { children: React.ReactNode }) => (
  <div data-testid="main-layout">{children}</div>
));

describe('LiveStreamingPage', () => {
  it('renders the stream management page and create action', () => {
    render(
      <MemoryRouter>
        <LiveStreamingPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Live Streaming Management' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Stream/i })).toBeInTheDocument();
  });

  it('opens the create stream dialog', () => {
    render(
      <MemoryRouter>
        <LiveStreamingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Create Stream/i }));

    expect(
      screen.getByRole('heading', { level: 3, name: /Create New Stream/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Create Stream/i }).length).toBeGreaterThan(0);
  });
});
