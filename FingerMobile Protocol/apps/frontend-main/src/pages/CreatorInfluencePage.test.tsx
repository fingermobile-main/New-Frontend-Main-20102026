import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreatorInfluencePage from './CreatorInfluencePage';

// Mock subcomponents
jest.mock('../components/CreatorInfluence/SubscriptionDashboard', () => () => (
  <div data-testid="subscription-dashboard">Dashboard View</div>
));
jest.mock('../components/CreatorInfluence/TierDisplayComponent', () => () => (
  <div data-testid="tier-display">Tier Display View</div>
));
jest.mock('../components/CreatorInfluence/SubscriptionRecommendationForm', () => () => (
  <div data-testid="recommendation-form">Recommendation Form</div>
));

describe('CreatorInfluencePage', () => {
  it('renders all four navigation tabs including Perks & Subscriber Roster', () => {
    render(<CreatorInfluencePage />);
    expect(screen.getByRole('button', { name: /My Subscription/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Plans & Pricing/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get Recommendation/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Perks & Subscriber Roster/i })).toBeInTheDocument();
  });

  it('navigates to Perks & Subscriber Roster tab and renders perks studio and roster table', () => {
    render(<CreatorInfluencePage />);
    const rosterTab = screen.getByRole('button', { name: /Perks & Subscriber Roster/i });
    fireEvent.click(rosterTab);

    expect(screen.getByText(/Creator Tier Perks Management Studio/i)).toBeInTheDocument();
    expect(screen.getByText(/VIP Subscriber Roster/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Recurring Revenue \(MRR\)/i)).toBeInTheDocument();
    expect(screen.getByText('Chioma Okeke')).toBeInTheDocument();
  });
});
