import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunityPage from './CommunityPage';

// Mock contexts
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const icons = [
    'Users',
    'MessageSquare',
    'Flag',
    'Eye',
    'EyeOff',
    'Lock',
    'Globe',
    'Settings',
    'Plus',
    'Search',
    'Filter',
    'MoreHorizontal',
    'CheckCircle',
    'XCircle',
    'UserPlus',
    'TrendingUp',
    'Activity',
    'BarChart3',
    'Ban',
    'Shield',
    'MessageCircle',
    'Heart',
    'Share2',
    'ChevronLeft',
    'ChevronRight',
    'PinIcon'
  ];
  const mockIcons: Record<string, any> = {};
  icons.forEach((name) => {
    mockIcons[name] = (props: any) => <span data-testid={`icon-${name.toLowerCase()}`} {...props} />;
  });
  return mockIcons;
});

describe('CommunityPage Mobile & Responsive Suite', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CommunityPage />
      </BrowserRouter>
    );
  };

  it('renders community management title and create group action', () => {
    renderComponent();
    expect(screen.getByText('Community Management')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /create group/i }).length).toBeGreaterThan(0);
  });

  it('renders floating mobile navigation quick dock with touch targets', () => {
    renderComponent();
    const dock = screen.getByTestId('community-management-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^new$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^stats$/i })).toBeInTheDocument();
  });

  it('renders navigation tabs with minimum 44px tap targets', () => {
    renderComponent();
    const groupsTabs = screen.getAllByRole('button', { name: /groups/i });
    expect(groupsTabs.length).toBeGreaterThan(0);
    expect(groupsTabs[0]).toHaveClass('min-h-[44px]');
  });
});
