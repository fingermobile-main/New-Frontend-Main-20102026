import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StercsModulesPage from './StercsModulesPage';

jest.mock('../services/api', () => ({
  api: {
    get: jest.fn().mockResolvedValue([]),
    post: jest.fn().mockResolvedValue({ success: true }),
  },
}));

jest.mock('../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnershipCard() {
    return <div data-testid="mock-platform-ownership">Platform Ownership</div>;
  };
});

describe('StercsModulesPage Mobile Optimization Suite', () => {
  it('renders header, add module button, and ownership card', () => {
    render(
      <BrowserRouter>
        <StercsModulesPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/STERCS Modules & Microservices/i)).toBeInTheDocument();
    const addBtn = screen.getByRole('button', { name: /add module/i });
    expect(addBtn).toBeInTheDocument();
    expect(addBtn.className).toContain('min-h-[44px]');
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <BrowserRouter>
        <StercsModulesPage />
      </BrowserRouter>
    );

    const mobileDock = screen.getByRole('navigation', { name: /stercs modules mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const buttons = mobileDock.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });
});

