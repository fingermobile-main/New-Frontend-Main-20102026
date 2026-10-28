import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CommsVoipMasterConsolePage } from './CommsVoipMasterConsolePage';

jest.mock('./CommunicationsVoipMasterConsolePage', () => ({
  __esModule: true,
  default: () => <div data-testid="communications-voip-page">Communications VoIP Page</div>,
}));

describe('CommsVoipMasterConsolePage', () => {
  it('renders the delegated CommunicationsVoipMasterConsolePage', () => {
    render(
      <MemoryRouter>
        <CommsVoipMasterConsolePage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('communications-voip-page')).toBeInTheDocument();
  });
});

