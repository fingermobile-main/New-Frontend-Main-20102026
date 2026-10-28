import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>
}));

import RateLimitConfigPage from './RateLimitConfigPage';

describe('RateLimitConfigPage', () => {
  it('renders rate limit config header and list', () => {
    render(
      <BrowserRouter>
        <RateLimitConfigPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Rate Limit Configuration/i })).toBeInTheDocument();
  });

  it('triggers mobile quick dock actions', () => {
    render(
      <BrowserRouter>
        <RateLimitConfigPage />
      </BrowserRouter>
    );

    const newRuleBtns = screen.getAllByRole('button', { name: /New Rule|Add Rule/i });
    expect(newRuleBtns.length).toBeGreaterThan(0);
    fireEvent.click(newRuleBtns[0]);

    const refreshBtns = screen.getAllByRole('button', { name: /Refresh/i });
    expect(refreshBtns.length).toBeGreaterThan(0);
    fireEvent.click(refreshBtns[0]);
  });
});

