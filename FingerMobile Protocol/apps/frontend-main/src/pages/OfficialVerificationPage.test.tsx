import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OfficialVerificationPage from './OfficialVerificationPage';

// Mock MainLayout & AppContext
jest.mock('../components/layout/MainLayout', () => ({ children }: any) => <div data-testid="main-layout">{children}</div>);
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn(),
    user: { id: 'usr_1' },
    member: { id: 'usr_1' }
  })
}));

describe('OfficialVerificationPage Mobile Optimization', () => {
  it('renders official enterprise verification title', async () => {
    render(
      <BrowserRouter>
        <OfficialVerificationPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Official Verification/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile quick dock with Entity, Documents, and Review buttons', () => {
    render(
      <BrowserRouter>
        <OfficialVerificationPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /entity/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /documents/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /review/i })).toBeInTheDocument();
  });
});

