import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../components/ui/Checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange, ...props }: any) => (
    <input
      type="checkbox"
      checked={!!checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  ),
}));

jest.mock('../components/ui/RadioGroup', () => ({
  RadioGroup: ({ children, ...props }: any) => <div role="radiogroup" {...props}>{children}</div>,
  RadioGroupItem: ({ value, ...props }: any) => <input type="radio" value={value} {...props} />,
}));

jest.mock('../components/ui/Progress', () => ({
  Progress: ({ value }: any) => <div data-testid="progress-bar" style={{ width: `${value}%` }} />,
}));

jest.mock('../components/onboarding/CreatorSpotAvailabilityCard', () => ({
  CreatorSpotAvailabilityCard: () => <div data-testid="creator-spot-card" />,
}));

jest.mock('../components/onboarding/HumanCaptchaPuzzle', () => ({
  HumanCaptchaPuzzle: () => <div data-testid="captcha-puzzle" />,
}));

jest.mock('../components/onboarding/CESFormulaCard', () => ({
  CESFormulaCard: () => <div data-testid="ces-formula-card" />,
}));

jest.mock('../contexts/OnboardingContext', () => ({
  useOnboarding: () => ({
    state: {
      steps: [
        { id: 'welcome', title: 'Welcome', isCompleted: false, isValid: true },
        { id: 'terms-permissions', title: 'Terms', isCompleted: false, isValid: true }
      ],
      currentStepIndex: 0,
      progress: { currentStep: 'welcome', completedSteps: [] }
    },
    initializeOnboarding: jest.fn(),
    updateProgress: jest.fn(),
    setAccountType: jest.fn(),
    setInterests: jest.fn(),
    setDemographics: jest.fn(),
    markVerificationComplete: jest.fn(),
    finalizeOnboarding: jest.fn(),
    nextStep: jest.fn(),
    previousStep: jest.fn(),
    updateFormData: jest.fn(),
  })
}));

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    state: { user: null, isAuthenticated: false }
  })
}));

import OnboardingPage from './OnboardingPage';

describe('OnboardingPage', () => {
  it('renders onboarding step progress and welcome screen', () => {
    render(
      <BrowserRouter>
        <OnboardingPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Step 1 of 2/i)).toBeInTheDocument();
  });

  it('renders mobile quick dock buttons', () => {
    render(
      <BrowserRouter>
        <OnboardingPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });
});
