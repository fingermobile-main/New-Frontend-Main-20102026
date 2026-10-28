import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const mockRefreshData = jest.fn();

jest.mock('../hooks/useShowcaseData', () => ({
  __esModule: true,
  default: () => ({
    loading: false,
    error: null,
    refreshData: mockRefreshData,
    showcaseItems: [
      {
        title: 'Sovereign Core Dashboard',
        imageUrl: '/showcase/core-dashboard.png',
        description: 'Decentralized control plane interface',
        prompt: 'Generate an enterprise dashboard with high contrast metrics'
      }
    ]
  })
}));

jest.mock('../components/PageHeader', () => ({
  __esModule: true,
  default: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}));

import ShowcasePage from './ShowcasePage';

describe('ShowcasePage', () => {
  it('renders showcase page header and items', () => {
    render(
      <BrowserRouter>
        <ShowcasePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Application Showcase/i })).toBeInTheDocument();
    expect(screen.getByText(/Sovereign Core Dashboard/i)).toBeInTheDocument();
  });

  it('triggers refresh via mobile quick dock', () => {
    render(
      <BrowserRouter>
        <ShowcasePage />
      </BrowserRouter>
    );

    const refreshBtn = screen.getByRole('button', { name: /Refresh/i });
    expect(refreshBtn).toBeInTheDocument();
    fireEvent.click(refreshBtn);
    expect(mockRefreshData).toHaveBeenCalled();
  });
});
