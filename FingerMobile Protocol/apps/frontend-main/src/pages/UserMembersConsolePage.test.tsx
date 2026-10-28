import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>
}));

jest.mock('../components/dashboard/MasterMembersConsole', () => ({
  __esModule: true,
  default: () => <div data-testid="master-members-console">Master Members Console Component</div>
}));

import UserMembersConsolePage from './UserMembersConsolePage';

describe('UserMembersConsolePage', () => {
  it('renders user members governance header and master console', () => {
    render(
      <BrowserRouter>
        <UserMembersConsolePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Dedicated User & Members Governance Console/i })).toBeInTheDocument();
    expect(screen.getByTestId('master-members-console')).toBeInTheDocument();
  });

  it('renders mobile quick dock buttons', () => {
    render(
      <BrowserRouter>
        <UserMembersConsolePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('link', { name: /Members/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /RBAC/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
  });
});
