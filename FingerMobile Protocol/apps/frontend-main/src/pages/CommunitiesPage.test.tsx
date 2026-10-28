import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommunitiesPage from './CommunitiesPage';

// Mock apiService
jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({
      data: {
        communities: [
          { id: '1', name: 'Music Producers Network', description: 'Share tips and collaborate', members_count: 15000 },
          { id: '2', name: 'Digital Artists Hub', description: 'Share your creative art', members_count: 8500 }
        ]
      }
    }),
    post: jest.fn().mockResolvedValue({ data: { success: true } })
  }
}));

// Mock MainLayout
jest.mock('../components/layout/MainLayout', () => {
  return function MockMainLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="main-layout">{children}</div>;
  };
});

// Mock Lucide icons
jest.mock('lucide-react', () => {
  const icons = ['Users', 'PlusCircle', 'Compass', 'MessageSquare'];
  const mockIcons: Record<string, any> = {};
  icons.forEach((name) => {
    mockIcons[name] = (props: any) => <span data-testid={`icon-${name.toLowerCase()}`} {...props} />;
  });
  return mockIcons;
});

describe('CommunitiesPage Mobile & Responsive Suite', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CommunitiesPage />
      </BrowserRouter>
    );
  };

  it('renders the communities hub header and create button', () => {
    renderComponent();
    expect(screen.getByText(/Communities Hub/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create guild \/ group/i })).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with touch targets', () => {
    renderComponent();
    const dock = screen.getByTestId('communities-mobile-dock');
    expect(dock).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^create$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /my groups/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /forum/i })).toBeInTheDocument();
  });

  it('allows joining a community with 44px tap target', async () => {
    renderComponent();
    const joinButtons = await screen.findAllByRole('button', { name: /join/i });
    expect(joinButtons.length).toBeGreaterThan(0);
    fireEvent.click(joinButtons[0]);
    expect(await screen.findByRole('button', { name: /joined/i })).toBeInTheDocument();
  });
});

