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
  it('renders Live Streaming page and Go Live streamer action', () => {
    render(
      <MemoryRouter>
        <LiveStreamingPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Live Streaming/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go Live/i })).toBeInTheDocument();
  });

  it('opens WebRTC studio drawer when Go Live is clicked', () => {
    render(
      <MemoryRouter>
        <LiveStreamingPage />
      </MemoryRouter>
    );

    const goLiveBtn = screen.getByRole('button', { name: /Go Live/i });
    fireEvent.click(goLiveBtn);

    expect(
      screen.getByRole('heading', { level: 3, name: /WebRTC Live Broadcast Studio/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Broadcast/i })).toBeInTheDocument();
  });
});
