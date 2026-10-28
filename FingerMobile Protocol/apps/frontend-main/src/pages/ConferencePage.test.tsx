import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ConferencePage from './ConferencePage';

// Mock components
jest.mock('../components/ConferenceRoom', () => ({
  __esModule: true,
  default: ({ roomName }: { roomName: string }) => <div data-testid="conference-room">{roomName}</div>,
}));

jest.mock('../components/layout/MainLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('ConferencePage Mobile Suite', () => {
  it('renders active meeting room component', () => {
    render(
      <BrowserRouter>
        <ConferencePage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('conference-room')).toBeInTheDocument();
  });

  it('renders sovereign mobile navigation quick dock controls', () => {
    render(
      <BrowserRouter>
        <ConferencePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Room/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /New Call/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sync/i })).toBeInTheDocument();
  });
});

