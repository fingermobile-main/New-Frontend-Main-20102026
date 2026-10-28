import React from 'react';
import { render, screen } from '@testing-library/react';
import StercsThemeDesignerPage from './StercsThemeDesignerPage';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../components/dashboard/StercsThemeDesigner', () => {
  return function MockStercsThemeDesigner() {
    return <div data-testid="mock-theme-designer">Stercs Theme Designer</div>;
  };
});

jest.mock('../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnershipCard() {
    return <div data-testid="mock-platform-ownership">Platform Ownership</div>;
  };
});

describe('StercsThemeDesignerPage Mobile Optimization Suite', () => {
  it('renders theme designer and platform ownership card', () => {
    render(<StercsThemeDesignerPage />);
    expect(screen.getByTestId('mock-theme-designer')).toBeInTheDocument();
    expect(screen.getByTestId('mock-platform-ownership')).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(<StercsThemeDesignerPage />);

    const mobileDock = screen.getByRole('navigation', { name: /stercs theme designer mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const buttons = mobileDock.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });
});
