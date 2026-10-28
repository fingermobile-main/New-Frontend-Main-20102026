import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
    member: { id: 'usr-1' },
  }),
}));

jest.mock('../../components/posts/PostPublishingSettings', () => {
  return function MockSettings() {
    return <div data-testid="settings-panel">Settings Panel</div>;
  };
});

import PostPublishingDemoPage from './PostPublishingDemoPage';

describe('PostPublishingDemoPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
  });

  it('renders post publishing demo and quick dock', () => {
    render(
      <MemoryRouter>
        <PostPublishingDemoPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Intelligent Post Publishing/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Publish/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /AI Assist/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Compose/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Top/i })).toBeInTheDocument();
  });
});
