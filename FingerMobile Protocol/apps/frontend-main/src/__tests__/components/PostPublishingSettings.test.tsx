import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostPublishingSettings from '../../components/posts/PostPublishingSettings';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: () => ({ showToast: jest.fn() }),
}));

describe('PostPublishingSettings', () => {
  it('renders the current publication settings tabs and privacy controls', () => {
    render(<PostPublishingSettings />);

    expect(screen.getByText('Privacy & Audience')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Basic' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Monetization' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Advanced' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Demographics & Geofence' })).toBeInTheDocument();
    expect(screen.getByText('Who Can Comment')).toBeInTheDocument();
  });

  it('shows monetization controls on the monetization tab', () => {
    render(<PostPublishingSettings />);

    fireEvent.click(screen.getByRole('button', { name: 'Monetization' }));

    expect(screen.getByText('Enable Monetization')).toBeInTheDocument();
    expect(screen.getByText('Earn from your content through subscriptions or tips')).toBeInTheDocument();
  });

  it('shows broadcast and collaboration options on the advanced tab', () => {
    render(<PostPublishingSettings />);

    fireEvent.click(screen.getByRole('button', { name: 'Advanced' }));

    expect(screen.getByText('Broadcast Mode')).toBeInTheDocument();
    expect(screen.getByText('Invite Collaborators')).toBeInTheDocument();
  });
});
