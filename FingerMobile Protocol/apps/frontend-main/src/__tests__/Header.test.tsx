import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../components/Header';

jest.mock('../components/BurgerMenu', () => () => <button type="button" onClick={() => { const active = true; window.dispatchEvent(new CustomEvent('toggle-menu', { detail: active })); }}>Menu</button>);

describe('Header', () => {
  it('renders search, sign-in, and onboarding actions', () => {
    render(<Header />);

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
  });
});
