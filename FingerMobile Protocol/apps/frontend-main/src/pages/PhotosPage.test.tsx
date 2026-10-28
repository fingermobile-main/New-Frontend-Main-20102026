import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    member: { name: 'Test Photographer' },
    showToast: jest.fn(),
  }),
}));

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'u1', name: 'Test User' },
    isAuthenticated: true,
  }),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

import PhotosPage from './PhotosPage';

describe('PhotosPage', () => {
  it('renders hero banner and curated photo items', () => {
    render(
      <BrowserRouter>
        <PhotosPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Community Photography & Master Visuals/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Lekki Toll Twilight & Sovereign Velocity/i)[0]).toBeInTheDocument();
  });

  it('renders mobile quick dock buttons and switches category', () => {
    render(
      <BrowserRouter>
        <PhotosPage />
      </BrowserRouter>
    );

    const urbanBtn = screen.getByRole('button', { name: /^Urban$/i });
    expect(urbanBtn).toBeInTheDocument();
    fireEvent.click(urbanBtn);

    expect(screen.getAllByText(/Lekki Toll Twilight & Sovereign Velocity/i)[0]).toBeInTheDocument();
  });
});
