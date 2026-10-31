import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '00000000-0000-0000-0000-000000000001', username: 'ObinnaMbah' },
    isAuthenticated: true,
  }),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../components/PubliciteeSection', () => ({
  PubliciteeSection: () => <div data-testid="publicitee-section">Publicitee Section</div>
}));

jest.mock('../components/CreatePubliciteeShortsModal', () => ({
  CreatePubliciteeShortsModal: () => <div data-testid="create-publicitee-modal" />
}));

import PubliciteePage from './PubliciteePage';

describe('PubliciteePage', () => {
  it('renders publicitee hero and category pills', () => {
    render(
      <BrowserRouter>
        <PubliciteePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Reels for Filmmakers/i })).toBeInTheDocument();
    expect(screen.getByTestId('publicitee-section')).toBeInTheDocument();
  });

  it('interacts with category selection and mobile quick dock', () => {
    render(
      <BrowserRouter>
        <PubliciteePage />
      </BrowserRouter>
    );

    const filmsBtns = screen.getAllByRole('button', { name: /Films|Short Films/i });
    expect(filmsBtns.length).toBeGreaterThan(0);
    fireEvent.click(filmsBtns[0]);

    const uploadBtns = screen.getAllByRole('button', { name: /Upload/i });
    expect(uploadBtns.length).toBeGreaterThan(0);
  });
});

