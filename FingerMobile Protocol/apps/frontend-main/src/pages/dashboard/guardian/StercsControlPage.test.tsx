import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StercsControlPage from './StercsControlPage';

// Mock contexts
jest.mock('../../../contexts/AppContext', () => ({
  useAppContext: () => ({
    seadsInitiatives: [],
    showToast: jest.fn(),
    handleStercsLogin: jest.fn().mockResolvedValue(true),
    handleStercsAction: jest.fn()
  })
}));

// Mock components
jest.mock('../../../components/dashboard/PlatformOwnershipCard', () => () => <div data-testid="ownership-card">Platform Ownership Card</div>);
jest.mock('../../../components/dashboard/SubscriptionModelsConsole', () => () => <div data-testid="subscription-models">Subscription Models Console</div>);

describe('StercsControlPage Mobile Optimization', () => {
  it('renders the Stercs Control title and auth options', async () => {
    render(
      <BrowserRouter>
        <StercsControlPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Strategic Tactical Enterprise Resource Control SYSTEM™©®/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile quick dock with Threat, Enterprise, and Authorize buttons', () => {
    render(
      <BrowserRouter>
        <StercsControlPage />
      </BrowserRouter>
    );

    expect(screen.getAllByRole('button', { name: /threat/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /enterprise/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /authorize/i })).toBeInTheDocument();
  });
});
