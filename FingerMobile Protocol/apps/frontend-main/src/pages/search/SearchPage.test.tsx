import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchPage from './SearchPage';

// Mock AppContext
jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    topics: [{ id: '1', name: 'Tech', postsCount: 10 }],
    hashtags: [{ id: '1', name: 'web3', category: 'General' }]
  })
}));

describe('SearchPage Mobile Optimization', () => {
  it('renders search input and title', async () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/Search posts, topics, keywords/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile quick dock with All, Posts, Topics, and Tags buttons', () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    expect(screen.getAllByRole('button', { name: /all/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /posts/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /topics/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /tags/i }).length).toBeGreaterThanOrEqual(1);
  });
});
