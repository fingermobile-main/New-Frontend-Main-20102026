import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HallmarkCreatePage from './HallmarkCreatePage';

// Mock contexts
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    member: { id: 'user-1', name: 'Test User' }
  })
}));

jest.mock('../../contexts/HallmarkContext', () => ({
  useHallmark: () => ({
    handleCreateHallmarkApplication: jest.fn().mockResolvedValue({ success: true }),
    hallmarkApplications: []
  })
}));

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({
    showToast: jest.fn()
  })
}));

describe('HallmarkCreatePage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <HallmarkCreatePage />
      </BrowserRouter>
    );

  it('renders hallmark application fields and submit button', () => {
    renderComponent();
    expect(screen.getByText('Create Sovereign Hallmark')).toBeInTheDocument();
    expect(screen.getByLabelText(/community name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit for review/i })).toBeInTheDocument();
  });

  it('renders the floating mobile navigation quick dock with action buttons', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /^branding$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^rules$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^pricing$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^hub$/i })).toBeInTheDocument();
  });
});
