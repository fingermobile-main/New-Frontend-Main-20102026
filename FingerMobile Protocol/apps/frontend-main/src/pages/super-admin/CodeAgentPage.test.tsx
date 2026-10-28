import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../services/api', () => ({
  generateCodeWithAi: jest.fn().mockResolvedValue({
    plan: 'Plan text',
    changes: [],
  }),
}));

jest.mock('../../components/dashboard/PlatformOwnershipCard', () => ({
  __esModule: true,
  default: () => <div data-testid="platform-ownership-card">Platform Ownership</div>,
}));

import CodeAgentPage from './CodeAgentPage';

describe('CodeAgentPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('renders code agent page and quick dock', () => {
    render(
      <MemoryRouter>
        <CodeAgentPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /Code Agent/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Prompt Agent/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Agent/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});
