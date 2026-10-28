import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyDownloadsPage from './MyDownloadsPage';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn()
  })
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}));

describe('MyDownloadsPage Component', () => {
  it('renders Digital Asset Vault heading and download items', () => {
    render(
      <BrowserRouter>
        <MyDownloadsPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Digital Asset Vault & Downloads/i)).toBeInTheDocument();
    expect(screen.getByText(/Midnight Lagos Grooves/i)).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with action buttons', () => {
    render(
      <BrowserRouter>
        <MyDownloadsPage />
      </BrowserRouter>
    );

    const nav = screen.getByRole('navigation', { name: /My Downloads Mobile Navigation/i });
    expect(nav).toBeInTheDocument();

    const allBtn = within(nav).getByRole('button', { name: /^All$/i });
    const audioBtn = within(nav).getByRole('button', { name: /^Audio$/i });
    const videoBtn = within(nav).getByRole('button', { name: /^Video$/i });
    const photosBtn = within(nav).getByRole('button', { name: /^Photos$/i });

    expect(allBtn).toBeInTheDocument();
    expect(audioBtn).toBeInTheDocument();
    expect(videoBtn).toBeInTheDocument();
    expect(photosBtn).toBeInTheDocument();

    fireEvent.click(audioBtn);
  });
});
