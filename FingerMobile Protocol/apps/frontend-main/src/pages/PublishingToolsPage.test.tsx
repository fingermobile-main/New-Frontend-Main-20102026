import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'u-publisher-1' },
    isAuthenticated: true,
  }),
}));

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../hooks/useCommunity', () => ({
    useCommunity: () => ({
      posts: [{ id: 'post-1', content: 'Testing publishing tools pipeline', timestamp: '2026-02-01T12:00:00Z' }]
    }),
  }));
jest.mock('../../src/hooks/useCommunity', () => ({
  useCommunity: () => ({
    posts: [
      { id: 'post-1', content: 'Testing publishing tools pipeline', timestamp: '2026-02-01T12:00:00Z' }
    ],
  }),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

import PublishingToolsPage from './PublishingToolsPage';

describe('PublishingToolsPage', () => {
  it('renders title and tool cards', () => {
    render(
      <BrowserRouter>
        <PublishingToolsPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Publishing Tools/i })).toBeInTheDocument();
    expect(screen.getByText(/Content Scheduler/i)).toBeInTheDocument();
    expect(screen.getByText(/Untitled Post|Testing publishing tools pipeline|No posts yet/i)).toBeInTheDocument();
  });

  it('triggers navigation from mobile quick dock', () => {
    render(
      <BrowserRouter>
        <PublishingToolsPage />
      </BrowserRouter>
    );

    const schedBtn = screen.getByRole('button', { name: /Schedule/i });
    expect(schedBtn).toBeInTheDocument();
    fireEvent.click(schedBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/postpublishingsettings');

    const analyticsBtn = screen.getByRole('button', { name: /Analytics/i });
    expect(analyticsBtn).toBeInTheDocument();
    fireEvent.click(analyticsBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
