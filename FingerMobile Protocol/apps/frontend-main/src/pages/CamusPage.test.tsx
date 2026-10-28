import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CamusPage from './CamusPage';

// Mock contexts and services
jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    currentUser: { id: 'test-user', membername: 'Scholar' },
    ficBalance: 4200,
  }),
}));

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    member: { id: 'test-user', name: 'Scholar' },
    user: { id: 'test-user', name: 'Scholar' },
  }),
}));

jest.mock('../services/camusService', () => ({
  camusService: {
    getTelemetry: jest.fn().mockResolvedValue({
      totalLearners: 12500,
      totalCourses: 45,
      totalCertificatesIssued: 3200,
      completionRate: 88,
    }),
    getCourses: jest.fn().mockResolvedValue([]),
    getApplicantTracks: jest.fn().mockResolvedValue([]),
    getOpenResources: jest.fn().mockResolvedValue([]),
    getMyEnrollments: jest.fn().mockResolvedValue([]),
    verifyCertificate: jest.fn().mockResolvedValue(null),
  },
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('CamusPage Mobile Suite', () => {
  it('renders CAMUS academic engine header and mode switcher', () => {
    render(
      <BrowserRouter>
        <CamusPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/CAMUS Sovereign Academic Engine/i)).toBeInTheDocument();
  });

  it('renders sovereign mobile navigation quick dock controls', () => {
    render(
      <BrowserRouter>
        <CamusPage />
      </BrowserRouter>
    );

    expect(screen.getAllByRole('button', { name: /Courses/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Tracks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Library/i })).toBeInTheDocument();
  });
});
