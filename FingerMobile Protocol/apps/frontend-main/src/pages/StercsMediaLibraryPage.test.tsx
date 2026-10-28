import React from 'react';
import { render, screen } from '@testing-library/react';
import StercsMediaLibraryPage from './StercsMediaLibraryPage';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../components/dashboard/StercsMediaLibrary', () => {
  return function MockStercsMediaLibrary() {
    return <div data-testid="mock-media-library">Stercs Media Library</div>;
  };
});

jest.mock('../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnershipCard() {
    return <div data-testid="mock-platform-ownership">Platform Ownership</div>;
  };
});

describe('StercsMediaLibraryPage Mobile Optimization Suite', () => {
  it('renders media library component and platform ownership card', () => {
    render(<StercsMediaLibraryPage />);
    expect(screen.getByTestId('mock-media-library')).toBeInTheDocument();
    expect(screen.getByTestId('mock-platform-ownership')).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(<StercsMediaLibraryPage />);

    const mobileDock = screen.getByRole('navigation', { name: /stercs media library mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const buttons = mobileDock.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });
});
