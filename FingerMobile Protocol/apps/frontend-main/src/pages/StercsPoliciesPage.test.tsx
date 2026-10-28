import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StercsPoliciesPage from './StercsPoliciesPage';

jest.mock('../services/api', () => ({
  api: {
    get: jest.fn().mockResolvedValue([]),
    post: jest.fn().mockResolvedValue({ success: true }),
    put: jest.fn().mockResolvedValue({ success: true }),
    delete: jest.fn().mockResolvedValue({ success: true }),
  },
}));

jest.mock('../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnershipCard() {
    return <div data-testid="mock-platform-ownership">Platform Ownership</div>;
  };
});

describe('StercsPoliciesPage Mobile Optimization Suite', () => {
  it('renders header, add policy button, and ownership card', () => {
    render(
      <BrowserRouter>
        <StercsPoliciesPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /STERCS Policies/i })).toBeInTheDocument();
    const createBtn = screen.getByRole('button', { name: /create policy/i });
    expect(createBtn).toBeInTheDocument();
    expect(createBtn.className).toContain('min-h-[44px]');
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <BrowserRouter>
        <StercsPoliciesPage />
      </BrowserRouter>
    );

    const mobileDock = screen.getByRole('navigation', { name: /stercs policies mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const buttons = mobileDock.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });
});
