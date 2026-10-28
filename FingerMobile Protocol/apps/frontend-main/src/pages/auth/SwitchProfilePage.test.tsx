import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    user: { id: 'usr-1', name: 'Test User' },
    showToast: jest.fn(),
  }),
}));

import SwitchProfilePage from './SwitchProfilePage';

describe('SwitchProfilePage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders switch profile page and quick dock', () => {
    render(
      <MemoryRouter>
        <SwitchProfilePage />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /Profile Home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Sub-Profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Profiles/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});
