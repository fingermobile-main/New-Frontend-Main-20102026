import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BusinessOfficesPage from './BusinessOfficesPage';

// Mock contexts
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    currentUser: { id: 'test-user', membername: 'TestLeader' },
    ficBalance: 25000,
    showToast: jest.fn(),
  }),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('BusinessOfficesPage Mobile Suite', () => {
  it('renders corporate offices header and hubs', () => {
    render(
      <BrowserRouter>
        <BusinessOfficesPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Corporate Offices & Global Network Hubs/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile navigation quick dock buttons', () => {
    render(
      <BrowserRouter>
        <BusinessOfficesPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Hubs/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Book Visit/i })).toBeInTheDocument();
  });
});
