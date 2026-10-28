import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NYSCProgramPage from './NYSCProgramPage';

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('NYSCProgramPage Component', () => {
  it('renders NYSC header and program description', () => {
    render(
      <BrowserRouter>
        <NYSCProgramPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/FingerMobile NYSC Grants & Post-Graduate Skills Program/i)).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with action buttons', () => {
    render(
      <BrowserRouter>
        <NYSCProgramPage />
      </BrowserRouter>
    );

    const nav = screen.getByRole('navigation', { name: /NYSC Program Mobile Navigation/i });
    expect(nav).toBeInTheDocument();

    const overviewBtn = within(nav).getByRole('button', { name: /^Overview$/i });
    const awardsBtn = within(nav).getByRole('button', { name: /^Awards$/i });
    const coursesBtn = within(nav).getByRole('button', { name: /^Courses$/i });
    const applyBtn = within(nav).getByRole('button', { name: /^Apply$/i });

    expect(overviewBtn).toBeInTheDocument();
    expect(awardsBtn).toBeInTheDocument();
    expect(coursesBtn).toBeInTheDocument();
    expect(applyBtn).toBeInTheDocument();

    fireEvent.click(awardsBtn);
  });
});

