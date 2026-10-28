import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DiscoveryPage from './DiscoveryPage';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

// Mock useCommunityPosts
jest.mock('../hooks/useCommunityPosts', () => ({
  useCommunityPosts: () => ({
    posts: [],
    loading: false,
    error: null,
    refreshPosts: jest.fn()
  })
}));

// Mock CuratedDiscovery
jest.mock('../components/CuratedDiscovery', () => {
  return function MockCuratedDiscovery() {
    return <div data-testid="curated-discovery">Curated Discovery Mock</div>;
  };
});

describe('DiscoveryPage Mobile View & Sovereign Quick Dock', () => {
  it('renders correctly with title and mobile quick dock navigation', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AppProvider>
            <DiscoveryPage />
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Discovery Hub/i)).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: /Discovery Quick Navigation/i });
    expect(nav).toBeInTheDocument();

    const allBtn = within(nav).getByRole('button', { name: /^All$/i });
    const peopleBtn = within(nav).getByRole('button', { name: /^People$/i });
    const groupsBtn = within(nav).getByRole('button', { name: /^Groups$/i });
    const contentBtn = within(nav).getByRole('button', { name: /^Content$/i });

    expect(allBtn).toBeInTheDocument();
    expect(peopleBtn).toBeInTheDocument();
    expect(groupsBtn).toBeInTheDocument();
    expect(contentBtn).toBeInTheDocument();

    fireEvent.click(peopleBtn);
    fireEvent.click(groupsBtn);
    fireEvent.click(contentBtn);
    fireEvent.click(allBtn);
  });
});
