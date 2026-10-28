import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityPages from './CommunityPages';

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('CommunityPages Mobile Suite', () => {
  it('renders directory header and links list', () => {
    render(
      <BrowserRouter>
        <CommunityPages />
      </BrowserRouter>
    );

    expect(screen.getByText(/Community Pages Directory/i)).toBeInTheDocument();
    expect(screen.getByText(/Hallmark Achievements \(Static\)/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile navigation quick dock links', () => {
    render(
      <BrowserRouter>
        <CommunityPages />
      </BrowserRouter>
    );

    expect(screen.getAllByRole('link', { name: /Feed/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Create/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Dashboard/i }).length).toBeGreaterThan(0);
  });
});
