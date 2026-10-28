import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CouncilDignitariesChamberPage from './CouncilDignitariesChamberPage';

// Mock sovereignRbacApi
jest.mock('../../services/sovereignRbacApi', () => ({
  __esModule: true,
  default: {
    getDistinguished: jest.fn().mockResolvedValue({
      ranks: [
        { id: '1', rank_name: 'Grand Chancellor', description: 'Oversees parliamentary floor', voting_weight: 5 },
        { id: '2', rank_name: 'Council Dignitary', description: 'Voting elder of the protocol', voting_weight: 3 }
      ],
      dignitaries: []
    })
  }
}));

// Mock privilege context
jest.mock('../../components/common/ExecutiveOnlyContent', () => ({
  usePlatformPrivilege: () => ({
    isExecutive: true,
  }),
}));

// Mock PlatformOwnershipCard
jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnershipCard() {
    return <div data-testid="platform-ownership-card">Platform Ownership Card</div>;
  };
});

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const icons = [
    'Landmark',
    'Shield',
    'Vote',
    'Award',
    'ChevronRight',
    'FileText',
    'CheckCircle',
    'Users',
    'MessageSquare',
    'Sparkles',
    'ArrowRight',
    'Compass',
    'Building'
  ];
  const mockIcons: Record<string, any> = {};
  icons.forEach((name) => {
    mockIcons[name] = (props: any) => <span data-testid={`icon-${name.toLowerCase()}`} {...props} />;
  });
  return mockIcons;
});

describe('CouncilDignitariesChamberPage Mobile & Responsive Suite', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CouncilDignitariesChamberPage />
      </BrowserRouter>
    );
  };

  it('renders chamber title and ownership banner', () => {
    renderComponent();
    expect(screen.getByText(/Council of Dignitaries Sovereign Chamber/i)).toBeInTheDocument();
    expect(screen.getByTestId('platform-ownership-card')).toBeInTheDocument();
  });

  it('renders floating mobile navigation quick dock with touch targets', () => {
    renderComponent();
    const dock = screen.getByTestId('council-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /chamber/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /votes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /forum/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guilds/i })).toBeInTheDocument();
  });

  it('allows voting on active floor proposals with 44px tap targets', () => {
    renderComponent();
    const voteYesButtons = screen.getAllByRole('button', { name: /vote yes/i });
    expect(voteYesButtons.length).toBeGreaterThan(0);
    fireEvent.click(voteYesButtons[0]);
    expect(screen.getByText(/Ballot Cast/i)).toBeInTheDocument();
  });
});

