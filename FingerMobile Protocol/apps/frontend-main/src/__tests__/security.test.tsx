import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SecurityDashboard from '../components/dashboard/SecurityDashboard';
import SecurityEvents from '../components/dashboard/SecurityEvents';

describe('Security dashboard components', () => {
  it('shows the current security summary', () => {
    render(<SecurityDashboard />);

    expect(screen.getByText('Security Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Threats Blocked')).toBeInTheDocument();
    expect(screen.getByText('1,247')).toBeInTheDocument();
    expect(screen.getByText('Security Score')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('shows recent security events', () => {
    render(<SecurityEvents />);

    expect(screen.getByText('Security Events')).toBeInTheDocument();
    expect(screen.getByText('Login Attempt')).toBeInTheDocument();
    expect(screen.getByText('Password Change')).toBeInTheDocument();
    expect(screen.getByText('API Access')).toBeInTheDocument();
  });
});
