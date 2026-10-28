import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ManageMyGroupPage from './ManageMyGroupPage';

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ groupId: 'grp-123' }),
}));

// Mock contexts
jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    member: { id: 'usr-1', name: 'Owner' },
  }),
}));

jest.mock('../../contexts/GroupContext', () => {
  const ReactActual = require('react');
  return {
    GroupContext: ReactActual.createContext({
      groups: [
        { id: 'grp-123', name: 'Web Dev Guild', rules: 'No spamming' }
      ],
      handleUpdateGroup: jest.fn().mockResolvedValue(true),
    }),
  };
});

// Mock PlatformOwnershipCard
jest.mock('../../components/dashboard/PlatformOwnershipCard', () => {
  return function MockPlatformOwnershipCard() {
    return <div data-testid="platform-ownership-card">Platform Ownership Card</div>;
  };
});

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const icons = ['Users', 'Save', 'ArrowLeft', 'Compass', 'MessageSquare'];
  const mockIcons: Record<string, any> = {};
  icons.forEach((name) => {
    mockIcons[name] = (props: any) => <span data-testid={`icon-${name.toLowerCase()}`} {...props} />;
  });
  return mockIcons;
});

describe('ManageMyGroupPage Mobile & Responsive Suite', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ManageMyGroupPage />
      </BrowserRouter>
    );
  };

  it('renders manage group header and input fields', () => {
    renderComponent();
    expect(screen.getByText(/Manage: Web Dev Guild/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Group Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Group Rules & Charter/i)).toBeInTheDocument();
  });

  it('renders floating mobile navigation quick dock with touch targets', () => {
    renderComponent();
    const dock = screen.getByTestId('manage-group-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^back$/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /save/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /groups/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guilds/i })).toBeInTheDocument();
  });

  it('saves changes with 44px tap target button', () => {
    renderComponent();
    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    expect(saveBtn).toHaveClass('min-h-[44px]');
    fireEvent.click(saveBtn);
  });
});
