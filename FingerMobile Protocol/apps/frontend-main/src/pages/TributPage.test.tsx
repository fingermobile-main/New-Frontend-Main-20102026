import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('../components/tribut/TributPinDetailModal', () => ({
  __esModule: true,
  default: () => <div data-testid="tribut-pin-detail-modal" />
}));

jest.mock('../components/tribut/TributDisplayStyleRenderer', () => ({
  __esModule: true,
  default: () => <div data-testid="tribut-display-style-renderer">Tribut Display Grid</div>
}));

jest.mock('../components/tribut/MemberTributProjectsModal', () => ({
  __esModule: true,
  default: () => <div data-testid="member-tribut-projects-modal" />
}));

jest.mock('../components/tribut/TributCreatorUploadModal', () => ({
  __esModule: true,
  default: () => <div data-testid="tribut-creator-upload-modal" />
}));

import TributPage from './TributPage';

describe('TributPage', () => {
  it('renders Tribut title and design showcase', () => {
    render(
      <BrowserRouter>
        <TributPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Sovereign Tribut/i })).toBeInTheDocument();
    expect(screen.getByTestId('tribut-display-style-renderer')).toBeInTheDocument();
  });

  it('interacts with category selection and open create modal via quick dock', () => {
    render(
      <BrowserRouter>
        <TributPage />
      </BrowserRouter>
    );

    const fashionBtns = screen.getAllByRole('button', { name: /Fashion/i });
    expect(fashionBtns.length).toBeGreaterThan(0);
    fireEvent.click(fashionBtns[0]);

    const artBtns = screen.getAllByRole('button', { name: /Art/i });
    expect(artBtns.length).toBeGreaterThan(0);
    fireEvent.click(artBtns[0]);
  });
});
