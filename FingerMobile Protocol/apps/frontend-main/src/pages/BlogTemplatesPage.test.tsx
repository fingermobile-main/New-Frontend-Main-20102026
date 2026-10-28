import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BlogTemplatesPage from './BlogTemplatesPage';

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('../services/apiService', () => ({
  apiService: {
    get: jest.fn().mockResolvedValue({ data: [] }),
    post: jest.fn().mockResolvedValue({ data: { success: true } }),
    delete: jest.fn().mockResolvedValue({ data: { success: true } }),
  },
}));

describe('BlogTemplatesPage Mobile Optimization', () => {
  it('renders free SEO blog templates title and template cards', () => {
    render(
      <MemoryRouter>
        <BlogTemplatesPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Free SEO Blog Templates')).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <MemoryRouter>
        <BlogTemplatesPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('All Templates')).toBeInTheDocument();
    expect(screen.getByLabelText('Create Template')).toBeInTheDocument();
    expect(screen.getByLabelText('Blogs Hub')).toBeInTheDocument();
    expect(screen.getByLabelText('Back to Forum')).toBeInTheDocument();
  });
});
