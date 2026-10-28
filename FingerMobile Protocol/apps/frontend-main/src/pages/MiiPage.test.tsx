import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MiiPage from './MiiPage';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn()
  })
}));

jest.mock('../components/MiiStoriesBar', () => ({
  MiiStoriesBar: () => <div data-testid="mii-stories-bar">Stories Bar Mock</div>
}));

jest.mock('../components/common/UniversalProfileCard', () => ({
  __esModule: true,
  default: () => <div data-testid="universal-profile-card">Profile Card Mock</div>
}));

jest.mock('../components/MiiModals', () => ({
  MiiPinExchangeModal: () => null,
  MiiFingerOrbitModal: () => null,
  MiiMiniStoreModal: () => null
}));

jest.mock('../components/CreatePubliciteeShortsModal', () => ({
  CreatePubliciteeShortsModal: () => null
}));

describe('MiiPage Component', () => {
  it('renders Mii protocol title and action buttons', () => {
    render(
      <BrowserRouter>
        <MiiPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Disappearing Moments, ShowCase & FingerOrbit™/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /New Mii Moment/i })).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with action buttons', () => {
    render(
      <BrowserRouter>
        <MiiPage />
      </BrowserRouter>
    );

    const nav = screen.getByRole('navigation', { name: /Mii Mobile Navigation/i });
    expect(nav).toBeInTheDocument();

    const momentsBtn = screen.getByRole('button', { name: /^Moments$/i });
    const pinBtn = screen.getByRole('button', { name: /^PIN Sync$/i });
    const orbitBtn = screen.getByRole('button', { name: /^Orbit$/i });
    const storeBtn = screen.getByRole('button', { name: /^Store$/i });

    expect(momentsBtn).toBeInTheDocument();
    expect(pinBtn).toBeInTheDocument();
    expect(orbitBtn).toBeInTheDocument();
    expect(storeBtn).toBeInTheDocument();

    fireEvent.click(pinBtn);
  });
});

