import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreatePostPage from './CreatePostPage';

jest.mock('../services/apiService', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({ data: [] }),
    post: jest.fn().mockResolvedValue({ data: { success: true } })
  }
}));

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
    ficBalance: 2500,
  }),
}));

jest.mock('../contexts/AIContext', () => ({
  useAI: () => ({
    generatePostContent: jest.fn().mockResolvedValue('AI generated story'),
    isLoading: false,
    error: null,
  }),
}));

jest.mock('../contexts/Web3Context', () => ({
  useWeb3: () => ({
    balance: 5000,
  }),
}));

jest.mock('../components/MediaEditorModal', () => {
  return function MockMediaEditorModal() {
    return <div data-testid="mock-media-editor">Media Editor</div>;
  };
});

jest.mock('../components/H2Composer', () => {
  return function MockH2Composer() {
    return <div data-testid="mock-h2-composer">H2 Composer</div>;
  };
});

jest.mock('../components/dashboard/stores/TagProductSearchBar', () => ({
  TagProductSearchBar: () => <div data-testid="mock-product-search">Tag Products</div>
}));

describe('CreatePostPage Mobile Optimization Suite', () => {
  it('renders headline and publish action button with min 44px touch target', () => {
    render(
      <BrowserRouter>
        <CreatePostPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Create Sovereign Post & Postcard/i)).toBeInTheDocument();
    const publishBtn = screen.getByRole('button', { name: /publish post & broadcast/i });
    expect(publishBtn).toBeInTheDocument();
    expect(publishBtn.className).toContain('min-h-[44px]');
  });

  it('renders Sovereign Mobile Navigation Quick Dock with min 44px touch targets', () => {
    render(
      <BrowserRouter>
        <CreatePostPage />
      </BrowserRouter>
    );

    const mobileDock = screen.getByRole('navigation', { name: /create post mobile navigation/i });
    expect(mobileDock).toBeInTheDocument();

    const buttons = mobileDock.querySelectorAll('button');
    expect(buttons.length).toBe(4);
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });
});

