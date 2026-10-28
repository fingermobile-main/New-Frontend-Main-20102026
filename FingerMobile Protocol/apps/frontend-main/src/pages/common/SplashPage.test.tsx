import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import SplashPage from './SplashPage';

describe('SplashPage', () => {
  it('renders splash branding', () => {
    render(
      <MemoryRouter>
        <SplashPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/FingerMobile/i)).toBeInTheDocument();
    expect(screen.getByText(/Loading security services/i)).toBeInTheDocument();
  });
});

