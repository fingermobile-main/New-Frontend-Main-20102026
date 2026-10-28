import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MembersPage from './MembersPage';

describe('MembersPage Component', () => {
  it('renders Member Management header and member count', () => {
    render(
      <BrowserRouter>
        <MembersPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Member Management/i })).toBeInTheDocument();
    expect(screen.getByText(/Alex Johnson/i)).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with action buttons', () => {
    render(
      <BrowserRouter>
        <MembersPage />
      </BrowserRouter>
    );

    const nav = screen.getByRole('navigation', { name: /Members Mobile Navigation/i });
    expect(nav).toBeInTheDocument();

    expect(within(nav).getByRole('button', { name: /^Members$/i })).toBeInTheDocument();
    expect(within(nav).getByRole('button', { name: /^Active$/i })).toBeInTheDocument();
    expect(within(nav).getByRole('button', { name: /^Add$/i })).toBeInTheDocument();
  });
});
