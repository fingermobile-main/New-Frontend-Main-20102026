import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LushPressiesPage from './LushPressiesPage';

describe('LushPressiesPage Component', () => {
  it('renders Lush Pressies title, tabs, and profiles after loading', async () => {
    render(<LushPressiesPage />);

    // Wait for mock data loading to resolve
    await waitFor(() => {
      expect(screen.getByText('Lush Pressies')).toBeInTheDocument();
    });

    expect(screen.getByText('Alex Johnson, 28')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Gifts')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('allows opening and interacting with the Private PIN Exchange modal', async () => {
    render(<LushPressiesPage />);

    await waitFor(() => {
      expect(screen.getByText('Taylor Swift, 33')).toBeInTheDocument();
    });

    // Taylor Swift has isPinProtected: true
    const pinButtons = screen.getAllByRole('button', { name: /PIN/i });
    expect(pinButtons.length).toBeGreaterThan(0);
    fireEvent.click(pinButtons[0]);

    // Modal should be open
    expect(screen.getByText('Private PIN Exchange')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••')).toBeInTheDocument();

    const pinInput = screen.getByPlaceholderText('••••••');
    fireEvent.change(pinInput, { target: { value: '123456' } });

    const unlockButton = screen.getByRole('button', { name: /Verify & Unlock/i });
    expect(unlockButton).toBeEnabled();
    fireEvent.click(unlockButton);

    expect(screen.getByText('Cryptographic Key Verified!')).toBeInTheDocument();
  });

  it('allows opening and submitting the Escrow Icebreaker Gifting modal', async () => {
    render(<LushPressiesPage />);

    await waitFor(() => {
      expect(screen.getByText('Alex Johnson, 28')).toBeInTheDocument();
    });

    const escrowButtons = screen.getAllByRole('button', { name: /Escrow Icebreaker/i });
    expect(escrowButtons.length).toBeGreaterThan(0);
    fireEvent.click(escrowButtons[0]);

    // Modal open
    expect(screen.getByText('Escrow Icebreaker Gift')).toBeInTheDocument();
    expect(screen.getByText('Smart Escrow Guarantee')).toBeInTheDocument();

    // Select amount
    const fiftyDollarBtn = screen.getByRole('button', { name: '$50' });
    fireEvent.click(fiftyDollarBtn);

    const submitBtn = screen.getByRole('button', { name: /Bond & Dispatch Escrow \(\$50\)/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Escrow Deposit Locked!')).toBeInTheDocument();
  });

  it('renders Sovereign Member Privacy & Incognito Engine in Settings tab', async () => {
    render(<LushPressiesPage />);

    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    const settingsTab = screen.getByRole('button', { name: /Settings/i });
    fireEvent.click(settingsTab);

    expect(screen.getByText('Sovereign Member Privacy & Incognito Engine')).toBeInTheDocument();
    expect(screen.getByText('Incognito Browsing Mode')).toBeInTheDocument();
    expect(screen.getByText('Hide from Global Search')).toBeInTheDocument();
    expect(screen.getByText('Mask Profile Behind 6-Digit PIN')).toBeInTheDocument();
  });
});
