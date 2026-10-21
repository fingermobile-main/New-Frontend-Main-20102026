import React, {} from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProtocolCommunication from '../ProtocolCommunication';

describe('ProtocolCommunication Component', () => {
  const mockOnMessageReceived = jest.fn();
  const mockOnConnectionChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<ProtocolCommunication />);

    expect(screen.getByText('Protocol Communication')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    expect(screen.getByText('Protocol Communication')).toBeInTheDocument();
  });

  it('allows toggling security settings', () => {
    render(<ProtocolCommunication />);

    const settingsButton = screen.getByTitle('Security Settings');
    fireEvent.click(settingsButton);

    expect(screen.getByText('Security Settings')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: 'Close security settings' });
    fireEvent.click(closeButton);

    expect(screen.queryByText('Security Settings')).not.toBeInTheDocument();
  });

  it('handles message input and sending', async () => {
    render(<ProtocolCommunication />);

    const messageInput = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getAllByRole('button').find((button) => !button.getAttribute('title') && !button.textContent?.trim());
    expect(sendButton).toBeDefined();

    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    // Check that the message appears in the buffer even if not sent due to connection
    await waitFor(() => {
      expect(messageInput).toHaveValue('');
    });
  });

  it('shows connection status indicators', () => {
    render(
      <ProtocolCommunication
        onConnectionChange={mockOnConnectionChange}
      />
    );

    // Initially should show disconnected state
    expect(screen.getByTitle('Connect')).toBeInTheDocument();
  });

  it('toggles encryption setting', () => {
    render(<ProtocolCommunication />);

    const settingsButton = screen.getByTitle('Security Settings');
    fireEvent.click(settingsButton);

    const encryptionCheckbox = screen.getByLabelText('Enable End-to-End Encryption');
    expect(encryptionCheckbox).not.toBeChecked();

    fireEvent.click(encryptionCheckbox);
    expect(encryptionCheckbox).toBeChecked();
  });

  it('responds to Enter key press for sending messages', async () => {
    render(<ProtocolCommunication />);

    const messageInput = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    fireEvent.keyDown(messageInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => expect(messageInput).toHaveValue(''));
  });
});
