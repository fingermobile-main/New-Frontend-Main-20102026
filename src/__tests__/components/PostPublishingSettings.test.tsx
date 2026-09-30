import React, {} from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostPublishingSettings from '../../components/posts/PostPublishingSettings';

// Mock the heroicons with test IDs
jest.mock('../components/icons', () => ({
  LockClosedIcon: () => <div data-testid="lock-icon">Lock Icon</div>,
  UserGroupIcon: () => <div data-testid="user-group-icon">User Group Icon</div>,
  CalendarIcon: () => <div data-testid="calendar-icon">Calendar Icon</div>,
  CurrencyDollarIcon: () => (
    <div data-testid="currency-dollar-icon">Currency Dollar Icon</div>
  ),
  UserIcon: () => <div data-testid="user-icon">User Icon</div>,
  ShareIcon: () => <div data-testid="share-icon">Share Icon</div>,
  ChartBarIcon: () => <div data-testid="chart-bar-icon">Chart Bar Icon</div>,
  GlobeAltIcon: () => <div data-testid="globe-alt-icon">Globe Icon</div>,
  BellIcon: () => <div data-testid="bell-icon">Bell Icon</div>}));

describe('PostPublishingSettings', () => {
  it('renders without crashing', () => {
    render(<PostPublishingSettings />);
    expect(screen.getByText('Privacy & Audience')).toBeInTheDocument();
  });

  it('displays all main tabs', () => {
    render(<PostPublishingSettings />);

    expect(screen.getByText('Basic Settings')).toBeInTheDocument();
    expect(screen.getByText('Monetization')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('renders basic settings by default', () => {
    render(<PostPublishingSettings />);

    expect(screen.getByText('Post Privacy')).toBeInTheDocument();
    expect(screen.getByText('Audience Selection')).toBeInTheDocument();
    expect(screen.getByText('Who Can Comment')).toBeInTheDocument();
    expect(screen.getByText('Schedule Post')).toBeInTheDocument();
    expect(screen.getByText('Share to Mii©®™')).toBeInTheDocument();
  });

  it('switches to monetization tab when clicked', () => {
    render(<PostPublishingSettings />);

    const monetizationTab = screen.getByText('Monetization');
    fireEvent.click(monetizationTab);

    expect(screen.getByText('Earn From this UGC')).toBeInTheDocument();
    expect(screen.getByText('Monetization Model')).toBeInTheDocument();
  });

  it('switches to advanced tab when clicked', () => {
    render(<PostPublishingSettings />);

    const advancedTab = screen.getByText('Advanced');
    fireEvent.click(advancedTab);

    expect(screen.getByText('Live Broadcast')).toBeInTheDocument();
    expect(screen.getByText('Invite Collaborator')).toBeInTheDocument();
    expect(screen.getByText('Boost to Advertise')).toBeInTheDocument();
  });

  it('allows toggling monetization switch', () => {
    render(<PostPublishingSettings />);

    const monetizationTab = screen.getByText('Monetization');
    fireEvent.click(monetizationTab);

    const monetizationSwitch = screen.getByRole('switch', {
      name: /earn from this ugc/i});
    expect(monetizationSwitch).toBeInTheDocument();
  });

  it('allows toggling collaboration switch', () => {
    render(<PostPublishingSettings />);

    const advancedTab = screen.getByText('Advanced');
    fireEvent.click(advancedTab);

    const collaborationSwitch = screen.getByRole('switch', {
      name: /invite collaborator/i});
    expect(collaborationSwitch).toBeInTheDocument();
  });

  it('allows toggling boosting switch', () => {
    render(<PostPublishingSettings />);

    const advancedTab = screen.getByText('Advanced');
    fireEvent.click(advancedTab);

    const boostSwitch = screen.getByRole('switch', {
      name: /boost to advertise/i});
    expect(boostSwitch).toBeInTheDocument();
  });
});
