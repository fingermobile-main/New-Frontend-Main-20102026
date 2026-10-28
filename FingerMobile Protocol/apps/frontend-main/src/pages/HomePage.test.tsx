import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    logout: jest.fn(),
  }),
}));

describe('HomePage Mobile Optimization & Behavior', () => {
  it('renders landing hero header, brand name and min 44px entry links', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /welcome to fingermobile/i })).toBeInTheDocument();
    const signInLinks = screen.getAllByRole('link', { name: /sign in/i });
    expect(signInLinks.length).toBeGreaterThan(0);
    expect(signInLinks[0].className).toContain('min-h-[44px]');
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const mobileDock = screen.getByRole('navigation', { name: /home mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const links = mobileDock.querySelectorAll('a');
    expect(links.length).toBe(4);
    links.forEach((link) => {
      expect(link.className).toContain('min-h-[44px]');
    });
  });
});
