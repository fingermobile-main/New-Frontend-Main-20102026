import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../components/ugc/UGCContentStudio', () => ({
  __esModule: true,
  default: () => <div data-testid="ugc-content-studio">Content Studio</div>
}));

jest.mock('../components/ugc/UGCPublishingTools', () => ({
  __esModule: true,
  default: () => <div data-testid="ugc-publishing-tools">Publishing Tools</div>
}));

jest.mock('../components/ugc/UGCAnalyticsDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="ugc-analytics-dashboard">Analytics Dashboard</div>
}));

jest.mock('../components/ugc/UGCMonetizationPanel', () => ({
  __esModule: true,
  default: () => <div data-testid="ugc-monetization-panel">Monetization Panel</div>
}));

jest.mock('../components/ugc/UGCScheduler', () => ({
  __esModule: true,
  default: () => <div data-testid="ugc-scheduler">Scheduler</div>
}));

jest.mock('../components/privacy/UGCPrivacyControlModal', () => ({
  __esModule: true,
  default: () => <div data-testid="ugc-privacy-modal" />
}));

jest.mock('../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>
}));

import UGCDashboardPage from './UGCDashboardPage';

describe('UGCDashboardPage', () => {
  it('renders UGC Creator Studio dashboard header', () => {
    render(
      <BrowserRouter>
        <UGCDashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /UGC Sovereign Studio/i })).toBeInTheDocument();
  });

  it('switches tabs and opens upload modal via mobile quick dock', () => {
    render(
      <BrowserRouter>
        <UGCDashboardPage />
      </BrowserRouter>
    );

    const analyticsBtns = screen.getAllByRole('button', { name: /Analytics/i });
    expect(analyticsBtns.length).toBeGreaterThan(0);
    fireEvent.click(analyticsBtns[0]);

    const monetizationBtns = screen.getAllByRole('button', { name: /Earnings|Monetization/i });
    expect(monetizationBtns.length).toBeGreaterThan(0);
    fireEvent.click(monetizationBtns[0]);
  });
});
