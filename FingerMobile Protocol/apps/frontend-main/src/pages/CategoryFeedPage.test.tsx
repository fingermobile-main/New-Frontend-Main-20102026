import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CategoryFeedPage from './CategoryFeedPage';

// Mock contexts and services
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../services/apiService', () => ({
  apiService: {
    get: jest.fn().mockResolvedValue({
      data: {
        posts: [
          {
            id: '1',
            title: 'Sample Tech Discussion',
            content: 'Exploring decentralization and Web3',
            author_name: 'Bob',
            likes_count: 5,
          },
        ],
      },
    }),
    post: jest.fn().mockResolvedValue({ success: true }),
  },
}));

jest.mock('../components/PostCard', () => ({
  __esModule: true,
  default: ({ post }: any) => <div data-testid="post-card">{post.title}</div>,
}));

describe('CategoryFeedPage Mobile Suite', () => {
  it('renders category feed header and topics button', async () => {
    render(
      <BrowserRouter>
        <CategoryFeedPage />
      </BrowserRouter>
    );

    expect(await screen.findByText(/Explore All Categories/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile navigation quick dock controls', () => {
    render(
      <BrowserRouter>
        <CategoryFeedPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Category/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /All Topics/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /New Post/i })).toBeInTheDocument();
  });
});
