import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ManageMyHallmarkPage from './ManageMyHallmarkPage';

// Mock AppContext
jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    member: { id: 'user-1', name: 'Test User' },
    showToast: jest.fn(),
    startSession: jest.fn(),
    joinSession: jest.fn(),
    leaveSession: jest.fn(),
    activeSession: null,
    openModal: jest.fn()
  })
}));

// Mock hallmarkService
jest.mock('../../services/hallmarkService', () => ({
  hallmarkService: {
    getAllHallmarks: jest.fn().mockResolvedValue([
      {
        id: 'hallmark-1',
        name: 'Alpha Sovereign Guild',
        description: 'Elite builder community',
        tags: ['web3', 'defi']
      }
    ]),
    updateHallmark: jest.fn().mockResolvedValue({ success: true })
  }
}));

// Mock PlatformOwnershipCard
jest.mock('../../components/dashboard/PlatformOwnershipCard', () => () => (
  <div data-testid="platform-ownership-card">Platform Ownership Card</div>
));

describe('ManageMyHallmarkPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <ManageMyHallmarkPage />
      </BrowserRouter>
    );

  it('renders hallmark management header and select options', async () => {
    renderComponent();
    expect(screen.getByText('Manage Sovereign Hallmark')).toBeInTheDocument();
    expect(await screen.findByText('Select Hallmark')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to hallmarks hub/i })).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /^hallmark$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^session$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^member$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^hub$/i })).toBeInTheDocument();
  });
});
