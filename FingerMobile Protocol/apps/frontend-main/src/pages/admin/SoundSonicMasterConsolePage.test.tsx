import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/dashboard/MasterSoundSonicConsole', () => ({
  MasterSoundSonicConsole: () => <div data-testid="master-sound-sonic-console">Sound Sonic Console</div>,
}));

import { SoundSonicMasterConsolePage } from './SoundSonicMasterConsolePage';

describe('SoundSonicMasterConsolePage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn(), href: '' },
      writable: true,
    });
  });

  it('renders console and quick dock', () => {
    render(
      <MemoryRouter>
        <SoundSonicMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('master-sound-sonic-console')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Sound Sonic Console/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search Sonic/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Sonic/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scroll to Top/i })).toBeInTheDocument();
  });
});

