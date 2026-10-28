import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../services/apiService', () => ({
  ApiService: {
    get: jest.fn().mockResolvedValue({
      data: [
        {
          id: 'top-1',
          name: 'Decentralized Sovereign Identity',
          description: 'Self-sovereign DID frameworks',
          category: 'tech',
          thread_count: 42,
          followers_count: 512,
          is_following: true
        }
      ]
    }),
    post: jest.fn().mockResolvedValue({ data: { success: true } })
  }
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

import TopicsPage from './TopicsPage';

describe('TopicsPage', () => {
  it('renders forum topics title and list', () => {
    render(
      <BrowserRouter>
        <TopicsPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Forum Topics & Hashtags/i })).toBeInTheDocument();
  });

  it('selects category and triggers modal via mobile quick dock', () => {
    render(
      <BrowserRouter>
        <TopicsPage />
      </BrowserRouter>
    );

    const techBtns = screen.getAllByRole('button', { name: /Tech/i });
    expect(techBtns.length).toBeGreaterThan(0);
    fireEvent.click(techBtns[0]);

    const createBtns = screen.getAllByRole('button', { name: /Create|Create Topic/i });
    expect(createBtns.length).toBeGreaterThan(0);
    fireEvent.click(createBtns[0]);
  });
});
