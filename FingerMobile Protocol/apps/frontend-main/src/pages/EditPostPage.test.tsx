import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EditPostPage from './EditPostPage';

jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({
      data: {
        id: 'post-1',
        title: 'Original Post Title',
        content: 'Original Post Content for Testing',
      }
    }),
    post: jest.fn().mockResolvedValue({
      data: {
        editedContent: 'Enhanced Post Content by AI',
      }
    }),
    put: jest.fn().mockResolvedValue({ data: { success: true } })
  },
  apiService: {
    get: jest.fn().mockResolvedValue({
      data: {
        id: 'post-1',
        title: 'Original Post Title',
        content: 'Original Post Content for Testing',
      }
    }),
    post: jest.fn().mockResolvedValue({
      data: {
        editedContent: 'Enhanced Post Content by AI',
      }
    }),
    put: jest.fn().mockResolvedValue({ data: { success: true } })
  }
}));

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('../contexts/Web3Context', () => ({
  useWeb3: () => ({
    balance: 5000,
  }),
}));

jest.mock('../components/PageHeader', () => {
  return function MockPageHeader({ title }: { title: string }) {
    return <header data-testid="page-header">{title}</header>;
  };
});

describe('EditPostPage Mobile Optimization Suite', () => {
  it('renders editor header and primary action button with min 44px touch target', () => {
    render(
      <BrowserRouter>
        <EditPostPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    const generateBtn = screen.getByRole('button', { name: /generate ai edit/i });
    expect(generateBtn).toBeInTheDocument();
    expect(generateBtn.className).toContain('min-h-[44px]');
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <BrowserRouter>
        <EditPostPage />
      </BrowserRouter>
    );

    const mobileDock = screen.getByRole('navigation', { name: /edit post mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const buttons = mobileDock.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });
});
