import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContentCalendarPage from './ContentCalendarPage';

// Mock contexts
jest.mock('../../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
    openModal: jest.fn()
  })
}));

jest.mock('../../../contexts/PostContext', () => {
  const actualReact = jest.requireActual('react');
  return {
    PostContext: actualReact.createContext({
      posts: []
    })
  };
});

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    member: { id: 'auth-1', username: 'FingerMobile' }
  })
}));

describe('ContentCalendarPage Mobile Integration', () => {
  it('renders content calendar and month view', () => {
    render(
      <MemoryRouter>
        <ContentCalendarPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Content Calendar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ Schedule a Post/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
    expect(screen.getByText(/Sun/i)).toBeInTheDocument();
    expect(screen.getByText(/Mon/i)).toBeInTheDocument();
  });

  it('renders quick dock buttons', () => {
    render(
      <MemoryRouter>
        <ContentCalendarPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Schedule/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Today/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
  });
});
