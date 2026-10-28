import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/OrganizeTheseContext', () => ({
  useOrganizeThese: () => ({
    organizedData: { groups: [] },
    isOrganizing: false,
    organizationStats: { totalItems: 10, groupsCount: 2 },
    organizeMemberData: jest.fn(),
    exportData: jest.fn(),
  }),
}));

jest.mock('../contexts/OnboardingContext', () => ({
  useOnboarding: () => ({
    state: {
      progress: {
        interests: ['Music', 'Art'],
        demographicInfo: { ageRange: '25-34' }
      }
    }
  })
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../components/organize-these/OrganizationVisualization', () => ({
  __esModule: true,
  default: ({ onReorganize }: any) => (
    <div data-testid="org-vis">
      <button onClick={onReorganize}>Trigger Reorganize</button>
    </div>
  )
}));

jest.mock('../components/organize-these/AnalyticsDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="analytics-dash" />
}));

import OrganizeThesePage from './OrganizeThesePage';

describe('OrganizeThesePage', () => {
  it('renders heading and export buttons', () => {
    render(
      <BrowserRouter>
        <OrganizeThesePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Organize These/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Export PDF|PDF/i })[0]).toBeInTheDocument();
  });

  it('renders mobile quick dock buttons and handles organize click', () => {
    render(
      <BrowserRouter>
        <OrganizeThesePage />
      </BrowserRouter>
    );

    const organizeBtns = screen.getAllByRole('button', { name: /Organize/i });
    expect(organizeBtns.length).toBeGreaterThan(0);
    fireEvent.click(organizeBtns[0]);
  });
});
