import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateGroupPage from './CreateGroupPage';

// Mock contexts
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../contexts/GroupContext', () => ({
  useGroup: () => ({
    handleCreateGroup: jest.fn().mockResolvedValue({ id: 'grp-123' }),
  }),
}));

// Mock audioPlayer
jest.mock('../utils/audioPlayer', () => ({
  playAudio: jest.fn(),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const icons = ['Users', 'PlusCircle', 'Compass', 'MessageSquare', 'Volume2', 'ArrowLeft'];
  const mockIcons: Record<string, any> = {};
  icons.forEach((name) => {
    mockIcons[name] = (props: any) => <span data-testid={`icon-${name.toLowerCase()}`} {...props} />;
  });
  return mockIcons;
});

describe('CreateGroupPage Mobile & Responsive Suite', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CreateGroupPage />
      </BrowserRouter>
    );
  };

  it('renders create group header and form fields', () => {
    renderComponent();
    expect(screen.getByText(/Create Sovereign Group/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Web Developers United/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/What is this group about\?/i)).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with touch targets', () => {
    renderComponent();
    const dock = screen.getByTestId('create-group-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^groups$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /form/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guilds/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /forum/i })).toBeInTheDocument();
  });

  it('renders create group action button with minimum 44px height', () => {
    renderComponent();
    const createBtn = screen.getByRole('button', { name: /create group/i });
    expect(createBtn).toBeInTheDocument();
    expect(createBtn).toHaveClass('min-h-[44px]');
  });
});
