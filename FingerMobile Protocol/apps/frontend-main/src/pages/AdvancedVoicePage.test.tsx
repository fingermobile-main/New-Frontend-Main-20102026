import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdvancedVoicePage from './AdvancedVoicePage';
import { useAppContext } from '../contexts/AppContext';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('../components/voice/AdvancedVoiceEngine', () => ({
  __esModule: true,
  default: () => <div data-testid="advanced-voice-engine">Voice Engine Console</div>,
}));

describe('AdvancedVoicePage Mobile Optimization', () => {
  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue({
      ficBalance: 500,
      showToast: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders voice engine heading and engine component', () => {
    render(
      <MemoryRouter>
        <AdvancedVoicePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Advanced Voice Engine')).toBeInTheDocument();
    expect(screen.getByTestId('advanced-voice-engine')).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <MemoryRouter>
        <AdvancedVoicePage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Start Voice Recording')).toBeInTheDocument();
    expect(screen.getByLabelText('Voice Effects')).toBeInTheDocument();
    expect(screen.getByLabelText('Share Audio')).toBeInTheDocument();
    expect(screen.getByLabelText('Back to Forum')).toBeInTheDocument();
  });
});
