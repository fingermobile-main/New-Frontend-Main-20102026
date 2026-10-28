import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityManagementPage from './CommunityManagementPage';

// Mock contexts
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({ member: { id: 'user-1', name: 'Test User' } })
}));

jest.mock('../../../contexts/HallmarkContext', () => ({
  useHallmark: () => ({
    hallmarks: [
      { id: 'h-1', name: 'Alpha Hallmark', owner: { id: 'user-1' }, members: [1, 2], posts: [1] }
    ]
  })
}));

jest.mock('../../../contexts/GemContext', () => ({
  useGem: () => ({ gems: [] })
}));

jest.mock('../../../contexts/GroupContext', () => ({
  useGroup: () => ({ groups: [] })
}));

// Mock PlatformOwnershipCard
jest.mock('../../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>
}));

describe('CommunityManagementPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <CommunityManagementPage />
      </BrowserRouter>
    );

  it('renders page title and description correctly', () => {
    renderComponent();
    expect(screen.getByText('Community Management Console')).toBeInTheDocument();
    expect(
      screen.getByText(/Manage your sovereign Hallmarks \(up to 250k members\), Gems, and interest groups/i)
    ).toBeInTheDocument();
  });

  it('renders tab buttons and items', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /my hallmarks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /my gems/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /my groups/i })).toBeInTheDocument();
    expect(screen.getByText('Alpha Hallmark')).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /^hallmarks$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^gems$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^groups$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^create$/i })).toBeInTheDocument();
  });
});
