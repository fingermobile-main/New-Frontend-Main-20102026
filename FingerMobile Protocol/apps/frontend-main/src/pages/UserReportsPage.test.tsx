import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 2400,
    showToast: jest.fn(),
  }),
}));

jest.mock('../services/moderationAdminService', () => ({
  moderationAdminService: {
    getReports: jest.fn().mockResolvedValue([]),
    updateReportStatus: jest.fn().mockResolvedValue({ success: true })
  }
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

import UserReportsPage from './UserReportsPage';

describe('UserReportsPage', () => {
  it('renders user reports moderation center and stats', () => {
    render(
      <BrowserRouter>
        <UserReportsPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /User Reports/i })).toBeInTheDocument();
  });

  it('filters reports via mobile quick dock', () => {
    render(
      <BrowserRouter>
        <UserReportsPage />
      </BrowserRouter>
    );

    const pendingBtns = screen.getAllByRole('button', { name: /Pending/i });
    expect(pendingBtns.length).toBeGreaterThan(0);
    fireEvent.click(pendingBtns[0]);

    const resolvedBtns = screen.getAllByRole('button', { name: /Resolved/i });
    expect(resolvedBtns.length).toBeGreaterThan(0);
    fireEvent.click(resolvedBtns[0]);
  });
});
