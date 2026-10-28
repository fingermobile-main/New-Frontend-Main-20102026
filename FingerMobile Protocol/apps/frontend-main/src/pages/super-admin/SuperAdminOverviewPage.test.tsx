import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
    guardianSystemStatuses: [],
    guardianAlerts: [],
    handleResolveGuardianAlert: jest.fn(),
  }),
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

jest.mock('../../components/dashboard/PlatformTaskManager', () => () => <div>Tasks</div>);
jest.mock('../../components/dashboard/StercsControlCenter', () => () => <div>Stercs</div>);
jest.mock('../../components/dashboard/SentientAIDashboard', () => () => <div>Sentient</div>);
jest.mock('../../components/dashboard/GuardianProtocolDashboard', () => () => <div>Guardian</div>);
jest.mock('../../components/dashboard/PromptsThreatDashboard', () => () => <div>Prompts</div>);
jest.mock('../../components/admin/RegionalCreatorControlsPanel', () => () => <div>Regional</div>);

import SuperAdminOverviewPage from './SuperAdminOverviewPage';

describe('SuperAdminOverviewPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders super admin overview page and quick dock', () => {
    render(
      <MemoryRouter>
        <SuperAdminOverviewPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /Overview Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Guardian System/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});
