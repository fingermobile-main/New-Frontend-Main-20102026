import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../contexts/AppContext', () => ({
  useAppContext: () => ({
    user: { id: 'user-demo-1' },
    showToast: jest.fn(),
  }),
}));

jest.mock('../services/protocolService', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    connect: jest.fn().mockResolvedValue({ success: true }),
    disconnect: jest.fn(),
    enableEncryption: jest.fn().mockReturnValue(true),
    sendMessage: jest.fn().mockReturnValue(true),
    onMessage: jest.fn(),
    onError: jest.fn(),
    onClose: jest.fn(),
  }
}));

jest.mock('../utils/cryptoUtils', () => ({
  generateRSAKeyPair: jest.fn().mockResolvedValue({
    publicKey: 'mock-public-key',
    privateKey: 'mock-private-key'
  })
}));

import ProtocolDemoPage from './ProtocolDemoPage';

describe('ProtocolDemoPage', () => {
  it('renders protocol service title and connection controls', () => {
    render(
      <BrowserRouter>
        <ProtocolDemoPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /FingerMobile Protocol Service/i })).toBeInTheDocument();
    expect(screen.getByText(/Connection Control/i)).toBeInTheDocument();
  });

  it('renders mobile quick dock and triggers actions', () => {
    render(
      <BrowserRouter>
        <ProtocolDemoPage />
      </BrowserRouter>
    );

    const connectBtns = screen.getAllByRole('button', { name: /Connect/i });
    expect(connectBtns.length).toBeGreaterThan(0);
    fireEvent.click(connectBtns[0]);

    const clearBtns = screen.getAllByRole('button', { name: /Clear/i });
    expect(clearBtns.length).toBeGreaterThan(0);
    fireEvent.click(clearBtns[0]);
  });
});

