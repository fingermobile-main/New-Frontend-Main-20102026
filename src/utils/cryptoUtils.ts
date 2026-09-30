import React, {} from 'react';
// Crypto utilities for the FingerMobile Protocol Service
// Provides encryption and decryption functions for secure communications

/**
 * Generates a random encryption key
 * @returns A random string suitable for use as an encryption key
 */
export function generateKey(): string {
  // In a real implementation, this would generate a proper cryptographic key
  // For now, we'll generate a pseudo-random string
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('');
}

/**
 * Encrypts data using a simple XOR cipher (for demonstration purposes only)
 * In a real implementation, use a proper encryption algorithm like AES
 * @param data The data to encrypt
 * @param key The encryption key
 * @returns The encrypted data as a hex string
 */
export function encryptData(
  data: string,
  key: string): string {
  // This is a simplified implementation for demonstration
  // A real implementation would use a proper encryption library

  const dataBytes = new TextEncoder().encode(data);
  const keyBytes = new TextEncoder().encode(key);

  const encryptedBytes = dataBytes.map(
    (byte, index) => byte ^ keyBytes[index % keyBytes.length],
  );

  // Convert to hex string for easy transport
  return Array.from(encryptedBytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Decrypts data using a simple XOR cipher (for demonstration purposes only)
 * In a real implementation, use a proper encryption algorithm like AES
 * @param encryptedData The encrypted data as a hex string
 * @param key The encryption key
 * @returns The decrypted data as a string
 */
export function decryptData(
  encryptedData: string,
  key: string): string {
  // Convert hex string back to bytes
  const encryptedBytes: number[] = [];
  for (let i = 0; i < encryptedData.length; i += 2) {
    encryptedBytes.push(parseInt(encryptedData.substr(i, 2), 16));
  }

  const keyBytes = new TextEncoder().encode(key);

  const decryptedBytes = encryptedBytes.map(
    (byte, index) => byte ^ keyBytes[index % keyBytes.length],
  );

  return new TextDecoder().decode(Uint8Array.from(decryptedBytes));
}

/**
 * Generates an RSA key pair using Web Crypto API.
 * Keys are generated in memory and should be stored securely.
 * @returns Object containing publicKey and privateKey (JWK format)
 */
export async function generateRSAKeyPair(): Promise<{
  publicKey: string;
  privateKey: string;
}> {
  try {
    // Generate RSA key pair using Web Crypto API
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );

    // Export keys to JWK format for storage/transmission
    const publicKeyJWK = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);
    const privateKeyJWK = await window.crypto.subtle.exportKey('jwk', keyPair.privateKey);

    return {
      publicKey: JSON.stringify(publicKeyJWK),
      privateKey: JSON.stringify(privateKeyJWK)
    };
  } catch (error) {
    console.error('Error generating RSA key pair:', error);
    throw new Error('Failed to generate RSA key pair');
  }
}

export default {
  generateKey,
  encryptData,
  decryptData,
  generateRSAKeyPair
};
