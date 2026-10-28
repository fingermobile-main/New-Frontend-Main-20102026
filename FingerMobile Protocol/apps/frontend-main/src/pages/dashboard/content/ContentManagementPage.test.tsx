import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContentManagementPage from './ContentManagementPage';

// Mock AppContext
jest.mock('../../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
    openModal: jest.fn(),
    ficBalance: 500,
    handleAiAssist: jest.fn(),
    triggerSpecialEffect: jest.fn()
  })
}));

// Mock PostContext
jest.mock('../../../contexts/PostContext', () => {
  const actualReact = jest.requireActual('react');
  return {
    PostContext: actualReact.createContext({
      posts: [],
      handleDeletePost: jest.fn(),
      handleLikePost: jest.fn(),
      handleAddNewComment: jest.fn(),
      handleVote: jest.fn(),
      handleTokenizePost: jest.fn()
    })
  };
});

// Mock AuthContext
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    member: { id: 'auth-1', username: 'FingerMobile' }
  })
}));

describe('ContentManagementPage Mobile Integration', () => {
  it('renders content manager tabs and fallback state', () => {
    render(
      <MemoryRouter>
        <ContentManagementPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Content Manager/i })).toBeInTheDocument();
    expect(screen.getByText(/Audit, moderate, and publish member submissions/i)).toBeInTheDocument();
  });

  it('renders quick dock buttons', () => {
    render(
      <MemoryRouter>
        <ContentManagementPage />
      </MemoryRouter>
    );

    expect(screen.getAllByRole('button', { name: /Posts/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /CMS/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
  });
});
