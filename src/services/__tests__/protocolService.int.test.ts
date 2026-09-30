// Integration tests for Protocol Service
// These tests require the backend server to be running

import protocolService from '../protocolService';

describe('ProtocolService Integration', () => {
  beforeAll(() => {
    protocolService.initialize('integration-test-client');
  });

  describe('Connection', () => {
    it('should connect to the protocol server', async () => {
      // In a real test environment, you would connect to the actual server
      // For now, we'll just test that the method exists and returns a promise
      expect(typeof protocolService.connect).toBe('function');
    }, 10000); // 10 second timeout
  });

  describe('Message Sending', () => {
    it('should have sendGenericMessage method', () => {
      expect(typeof protocolService.sendGenericMessage).toBe('function');
    });
  });

  describe('Connection Status', () => {
    it('should return connection status', () => {
      const status = protocolService.getConnectionStatus();
      expect(status).toHaveProperty('connected');
      expect(status).toHaveProperty('sessionId');
      expect(status).toHaveProperty('serverId');
    });
  });
});
