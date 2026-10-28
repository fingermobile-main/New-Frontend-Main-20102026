import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import SuccessPage from './SuccessPage';

describe('SuccessPage', () => {
  it('renders onboarding success screen', () => {
    render(
      <MemoryRouter>
        <SuccessPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/FingerMobile/i)).toBeInTheDocument();
    expect(screen.getByText(/Onboarding Completed Successfully/i)).toBeInTheDocument();
  });
});
