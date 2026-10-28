import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ModeratorCommandCenterPage from './ModeratorCommandCenterPage';

jest.mock('../../services/sovereignRbacApi', () => ({
  __esModule: true,
  default: {
    getModerators: () => Promise.resolve([
      {
        id: 'mod-1',
        user_id: 'usr-1',
        category_id: 'cat-crypto',
        scope_level: 'category',
        created_at: '2026-10-28T08:00:00Z',
      },
    ]),
  },
}));

jest.mock('../../services/adminOperationsService', () => ({
  adminOperationsService: {
    strikeUser: () => Promise.resolve({ success: true }),
  },
}));

jest.mock('../../components/common/ExecutiveOnlyContent', () => ({
  usePlatformPrivilege: () => ({
    isExecutive: true,
  }),
}));

describe('ModeratorCommandCenterPage Mobile Optimization & Behavior', () => {
  it('renders command center title, queue items and min 44px action buttons', () => {
    render(
      <BrowserRouter>
        <ModeratorCommandCenterPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /moderator sentinel command center/i })).toBeInTheDocument();
    expect(screen.getByText(/FLAG-9901/i)).toBeInTheDocument();

    const timeoutBtn = screen.getAllByRole('button', { name: /issue 24h timeout/i })[0];
    expect(timeoutBtn.className).toContain('min-h-[44px]');
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <BrowserRouter>
        <ModeratorCommandCenterPage />
      </BrowserRouter>
    );

    const mobileDock = screen.getByRole('navigation', { name: /moderator command center mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const items = mobileDock.querySelectorAll('button, a');
    expect(items.length).toBe(4);
    items.forEach((item) => {
      expect(item.className).toContain('min-h-[44px]');
    });
  });
});
