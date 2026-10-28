import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HallmarkApprovalPage from './HallmarkApprovalPage';

// Mock contexts
jest.mock('../../../contexts/HallmarkContext', () => ({
  useHallmark: () => ({
    hallmarkApplications: [
      {
        id: 'app-1',
        status: 'pending',
        applicant: {
          id: 'user-1',
          name: 'Jane Doe',
          membername: 'janedoe',
          avatarUrl: 'https://placehold.co/100x100'
        },
        requestedHallmark: {
          name: 'Jane Art Enclave',
          slug: 'jane-art',
          settings: {
            joinFee: 50,
            memberLimit: 10000
          }
        }
      }
    ],
    handleApproveHallmarkApplication: jest.fn(),
    handleRejectHallmarkApplication: jest.fn()
  })
}));

// Mock PlatformOwnershipCard
jest.mock('../../../components/dashboard/PlatformOwnershipCard', () => () => (
  <div data-testid="platform-ownership-card">Platform Ownership</div>
));

describe('HallmarkApprovalPage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <HallmarkApprovalPage />
      </BrowserRouter>
    );

  it('renders hallmark approval queue header and pending cards', () => {
    renderComponent();
    expect(screen.getByText('Hallmark Approval Queue')).toBeInTheDocument();
    expect(screen.getByText('Jane Art Enclave')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /approve hallmark/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reject application/i })).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /^queue$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^refresh$/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^hub$/i }).length).toBeGreaterThanOrEqual(1);
  });
});
