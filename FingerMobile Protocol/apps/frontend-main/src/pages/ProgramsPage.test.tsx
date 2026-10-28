import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 5000,
    showToast: jest.fn(),
  }),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

import ProgramsPage from './ProgramsPage';

describe('ProgramsPage', () => {
  it('renders hero title and core modules', () => {
    render(
      <BrowserRouter>
        <ProgramsPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Academic Programs/i })).toBeInTheDocument();
  });

  it('navigates tabs through mobile quick dock', () => {
    render(
      <BrowserRouter>
        <ProgramsPage />
      </BrowserRouter>
    );

    const examsBtn = screen.getByRole('button', { name: /Exams/i });
    expect(examsBtn).toBeInTheDocument();
    fireEvent.click(examsBtn);

    const tuitionBtn = screen.getByRole('button', { name: /Tuition/i });
    expect(tuitionBtn).toBeInTheDocument();
    fireEvent.click(tuitionBtn);
  });
});
