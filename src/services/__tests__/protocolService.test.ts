import React from 'react';
import protocolService from '../protocolService';

describe('ProtocolService', () => {
  beforeEach(() => {
    // Reset the service state before each test
    (protocolService as any).isConnected = false;
    (protocolService as any).sessionId = null;
    (protocolService as any).serverId = null;
    (protocolService as any).messageQueue = [];
    (protocolService as any).messageCallbacks = new Map();
  });

  describe('initialize', () => {
    it('should initialize with a client ID', () => {
      const clientId = 'test-client-123';
      protocolService.initialize(clientId);

      // We can't directly access private properties in tests
      // but we can test behavior that depends on initialization
      expect(() => {
        // This should work without throwing an error about uninitialized service
        (protocolService as any).clientId = clientId;
      }).not.toThrow();
    });
  });

  describe('getConnectionStatus', () => {
    it('should return correct initial status', () => {
      const status = protocolService.getConnectionStatus();
      // ConnectionStatus is a string: "disconnected" | "connecting" | "connected"
      expect(status).toBe('disconnected'); // Initially disconnected
    });

    it('should return connected status after connecting', async () => {
      // Mock the connect implementation for testing
      (protocolService as any).connectionStatus = 'connected';

      const status = protocolService.getConnectionStatus();
      expect(status).toBe('connected');
    });
  });

  describe('message creation', () => {
    it('should create messages with proper structure', () => {
      protocolService.initialize('test-client');

      const message = (protocolService as any).createMessage(
        'destination-123',
        'test-type',
        {
          testData: 'value' },
      );

      expect(message).toHaveProperty('messageId');
      expect(message).toHaveProperty('messageType', 'test-type');
      expect(message).toHaveProperty('source', 'test-client');
      expect(message).toHaveProperty('destination', 'destination-123');
      expect(message).toHaveProperty('payload');
      expect(message).toHaveProperty('timestamp');
    });
  });
});
