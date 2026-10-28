import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CamusEnclaveMasterConsolePage from './CamusEnclaveMasterConsolePage';

jest.mock('../../components/dashboard/MasterCamusEnclaveConsole', () => ({
  MasterCamusEnclaveConsole: () => <div data-testid="master-camus-enclave">Master Camus Enclave</div>,
}));

describe('CamusEnclaveMasterConsolePage (Subpage Screen)', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  test('renders CamusEnclaveMasterConsolePage and mobile quick dock', () => {
    render(<CamusEnclaveMasterConsolePage />);

    expect(screen.getByTestId('master-camus-enclave')).toBeInTheDocument();

    // Check Sovereign Mobile Navigation Quick Dock
    expect(screen.getByRole('link', { name: /Enclave Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Enclave/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Enclave/i })).toBeInTheDocument();

    const topBtn = screen.getByRole('button', { name: /Scroll to Top/i });
    expect(topBtn).toBeInTheDocument();
    fireEvent.click(topBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
