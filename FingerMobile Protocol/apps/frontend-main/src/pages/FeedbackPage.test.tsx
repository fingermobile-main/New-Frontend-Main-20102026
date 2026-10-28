import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FeedbackPage from './FeedbackPage';
import { ToastProvider } from '../components/Toast';
import { AppProvider } from '../contexts/AppContext';
import { AuthProvider } from '../contexts/AuthContext';

describe('FeedbackPage Mobile View & Sovereign Quick Dock', () => {
  it('renders correctly with title and sovereign mobile navigation dock', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AppProvider>
            <ToastProvider>
              <FeedbackPage />
            </ToastProvider>
          </AppProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Send us Feedback/i)).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: /Feedback Quick Navigation/i });
    expect(nav).toBeInTheDocument();

    const generalBtn = within(nav).getByRole('button', { name: /^General$/i });
    const bugBtn = within(nav).getByRole('button', { name: /^Bug$/i });
    const featureBtn = within(nav).getByRole('button', { name: /^Feature$/i });
    const writeBtn = within(nav).getByRole('button', { name: /^Write$/i });

    expect(generalBtn).toBeInTheDocument();
    expect(bugBtn).toBeInTheDocument();
    expect(featureBtn).toBeInTheDocument();
    expect(writeBtn).toBeInTheDocument();

    fireEvent.click(bugBtn);
    fireEvent.click(featureBtn);
    fireEvent.click(generalBtn);
    fireEvent.click(writeBtn);
  });
});

