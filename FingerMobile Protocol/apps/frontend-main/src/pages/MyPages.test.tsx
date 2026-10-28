import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyPages from './MyPages';

jest.mock('../contexts/EditorContext', () => ({
  useEditor: () => ({
    publishedPages: [
      { id: 'p-1', name: 'Official Sovereign Page', slug: 'official-sovereign' }
    ],
    handleDeletePage: jest.fn()
  })
}));

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    ficBalance: 500,
    showToast: jest.fn()
  })
}));

describe('MyPages Component', () => {
  it('renders My Pages title and published page list', () => {
    render(
      <BrowserRouter>
        <MyPages />
      </BrowserRouter>
    );

    expect(screen.getByText(/My Pages/i)).toBeInTheDocument();
    expect(screen.getByText(/Official Sovereign Page/i)).toBeInTheDocument();
  });

  it('renders Sovereign Mobile Navigation Quick Dock with action buttons', () => {
    render(
      <BrowserRouter>
        <MyPages />
      </BrowserRouter>
    );

    const nav = screen.getByRole('navigation', { name: /My Pages Mobile Navigation/i });
    expect(nav).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /^Pages$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Create$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Wallet$/i })).toBeInTheDocument();
  });
});

