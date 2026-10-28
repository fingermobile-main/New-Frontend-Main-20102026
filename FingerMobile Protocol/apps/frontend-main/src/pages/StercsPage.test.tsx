import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StercsPage from './StercsPage';

jest.mock('../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnershipCard() {
    return <div data-testid="mock-platform-ownership">Platform Ownership</div>;
  };
});

describe('StercsPage Mobile Optimization Suite', () => {
  it('renders title and add module button', () => {
    render(
      <BrowserRouter>
        <StercsPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/STERCS Management/i)).toBeInTheDocument();
    const addBtn = screen.getByRole('button', { name: /add module/i });
    expect(addBtn).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <BrowserRouter>
        <StercsPage />
      </BrowserRouter>
    );

    const mobileDock = screen.getByRole('navigation', { name: /stercs mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const buttons = mobileDock.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });
});
