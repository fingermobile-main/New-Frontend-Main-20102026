import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NyscPage from './NyscPage';

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('NyscPage', () => {
  it('renders NYSCProgramPage delegating properly', () => {
    render(
      <BrowserRouter>
        <NyscPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/FingerMobile NYSC Grants & Post-Graduate Skills Program/i)).toBeInTheDocument();
  });
});
