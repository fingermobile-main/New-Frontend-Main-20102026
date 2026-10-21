import protocolService from '../protocolService';
import { generateKey, encryptData, decryptData } from '../../utils/cryptoUtils';

describe('Protocol service and crypto utilities', () => {
  afterEach(() => jest.restoreAllMocks());

  it('initializes and reports disconnected protocol status', () => {
    protocolService.initialize('test-client');

    expect(protocolService.getProtocolStatus()).toEqual({
      connected: false,
      sessionId: null,
      serverId: null,
    });
  });

  it('enables encryption with the supplied key pair', () => {
    protocolService.enableEncryption('public-key', 'private-key');

    expect((protocolService as any).encryptionEnabled).toBe(true);
    expect((protocolService as any).publicKey).toBe('public-key');
    expect((protocolService as any).privateKey).toBe('private-key');
  });

  it('generates a key and round-trips encrypted text', () => {
    const key = generateKey();
    const message = 'Protocol message ✓';

    expect(key).toHaveLength(32);
    const encrypted = encryptData(message, key);
    expect(encrypted).not.toBe(message);
    expect(decryptData(encrypted, key)).toBe(message);
  });

  it('does not decrypt ciphertext correctly with a different key', () => {
    const encrypted = encryptData('Secret message', 'key-one');

    expect(decryptData(encrypted, 'key-two')).not.toBe('Secret message');
  });
});
