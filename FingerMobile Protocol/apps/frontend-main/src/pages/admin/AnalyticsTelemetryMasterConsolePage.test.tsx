import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AnalyticsTelemetryMasterConsolePage from './AnalyticsTelemetryMasterConsolePage';

jest.mock('../../components/dashboard/MasterAnalyticsTelemetryConsole', () => ({
  MasterAnalyticsTelemetryConsole: () => <div data-testid="master-analytics-telemetry">Master Analytics Telemetry</div>,
}));

describe('AnalyticsTelemetryMasterConsolePage (Subpage Screen)', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  test('renders AnalyticsTelemetryMasterConsolePage with sub-console and mobile quick dock', () => {
    render(<AnalyticsTelemetryMasterConsolePage />);

    expect(screen.getByTestId('master-analytics-telemetry')).toBeInTheDocument();

    // Check Sovereign Mobile Navigation Quick Dock
    expect(screen.getByRole('link', { name: /Telemetry Stream/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Metrics/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Console/i })).toBeInTheDocument();

    const topBtn = screen.getByRole('button', { name: /Scroll to Top/i });
    expect(topBtn).toBeInTheDocument();
    fireEvent.click(topBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
