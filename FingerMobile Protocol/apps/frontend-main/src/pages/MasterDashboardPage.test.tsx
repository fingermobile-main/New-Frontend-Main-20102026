import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MasterDashboardPage from './MasterDashboardPage';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: {
      id: 'admin-1',
      username: 'admin',
      email: 'admin@fingermobile.com',
      role: 'super_admin'
    },
    userRole: 'super_admin',
    isAuthenticated: true
  })
}));

jest.mock('../services/platformRbac', () => ({
  canAccessMasterDashboard: () => true,
  isContentCreator: () => true,
  isBusinessEntity: () => true
}));

describe('MasterDashboardPage Component', () => {
  it('renders Master Dashboard heading and overview metrics', () => {
    render(
      <BrowserRouter>
        <MasterDashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Master Dashboard/i })).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with action buttons', () => {
    render(
      <BrowserRouter>
        <MasterDashboardPage />
      </BrowserRouter>
    );

    const overviewBtn = screen.getByRole('button', { name: /^Overview$/i });
    const analyticsBtn = screen.getByRole('button', { name: /^Analytics$/i });
    const systemBtn = screen.getByRole('button', { name: /^System$/i });
    const securityBtn = screen.getByRole('button', { name: /^Security$/i });

    expect(overviewBtn).toBeInTheDocument();
    expect(analyticsBtn).toBeInTheDocument();
    expect(systemBtn).toBeInTheDocument();
    expect(securityBtn).toBeInTheDocument();

    fireEvent.click(analyticsBtn);
  });
});

