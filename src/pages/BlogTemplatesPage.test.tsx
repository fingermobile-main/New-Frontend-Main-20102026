import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BlogTemplatesPage from './BlogTemplatesPage';

jest.mock('../components/layout/MainLayout', () => ({ children }: { children: React.ReactNode }) => (
  <div data-testid="main-layout">{children}</div>
));

describe('BlogTemplatesPage', () => {
  it('renders page header and structured templates', () => {
    render(
      <MemoryRouter>
        <BlogTemplatesPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Free SEO Blog Templates/i })).toBeInTheDocument();
    expect(screen.getByText('Tech Benchmark & Hardware Review')).toBeInTheDocument();
    expect(screen.getByText('African Destination & Cultural Explorer')).toBeInTheDocument();
    expect(screen.getByText('Culinary Masterclass & Heritage Recipe')).toBeInTheDocument();
  });

  it('filters templates when a category button is clicked', () => {
    render(
      <MemoryRouter>
        <BlogTemplatesPage />
      </MemoryRouter>
    );

    const foodBtn = screen.getByRole('button', { name: /^Food$/i });
    fireEvent.click(foodBtn);

    expect(screen.getByText('Culinary Masterclass & Heritage Recipe')).toBeInTheDocument();
    expect(screen.queryByText('Tech Benchmark & Hardware Review')).not.toBeInTheDocument();
  });

  it('opens Schema.org JSON-LD preview modal', () => {
    render(
      <MemoryRouter>
        <BlogTemplatesPage />
      </MemoryRouter>
    );

    const schemaBtns = screen.getAllByRole('button', { name: /Schema JSON-LD/i });
    expect(schemaBtns.length).toBeGreaterThan(0);
    fireEvent.click(schemaBtns[0]);

    expect(screen.getByText(/Schema\.org JSON-LD Structured Data/i)).toBeInTheDocument();
  });
});
