import React, {} from 'react';
import ProtocolService from './protocolService';
import { ProtocolMessage } from '../types/protocol';
import { generateRSAKeyPair } from '../utils/cryptoUtils';

/**
 * Bridge between ProtocolCommunication component and ProtocolService
 * Provides simplified methods for the ProtocolCommunication component to interact with the protocol service
 */
class ProtocolBridge {
  private protocolService = ProtocolService;
  private messageListeners: ((
  message: ProtocolMessage) => void)[] = [];

  /**
   * Connect to the protocol service
   * @param url WebSocket URL to connect to
   * @returns Promise resolving to connection success status
   */
  async connect(
  url: string): Promise<{success: boolean; error?: string }> {
    try {
      // Configure WebSocket with the provided URL
      this.protocolService.initialize(`client_${Date.now()}`);
      
      // Connect to protocol
      const connected = await this.protocolService.connectToProtocol();
      
      if (!connected) {
        return {success: false,
  error: "Failed to establish protocol connection" };
      }
      
      // Set up message listener to forward messages to listeners
      this.protocolService.onMessage = (
  message: ProtocolMessage) => {
        this.forwardMessage(message);
      };
      
      return {success: true };
    } catch (
  error: any) {
      console.error("Protocol connection, error:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" };
    }
  }

  /**
   * Disconnect from the protocol service
   */
  disconnect(): void {
    this.protocolService.disconnectProtocol();
  }

  /**
   * Enable encryption for the protocol service
   */
  async enableEncryption(): Promise<void> {
    const { publicKey, privateKey } = await generateRSAKeyPair();
    this.protocolService.enableEncryption(publicKey, privateKey);
  }

  /**
   * Send a message via the protocol service
   */
  async sendGenericMessage(
  destination: string,
messageType: string,
payload: unknown
  ): Promise<unknown> {
    try {
      const response = await this.protocolService.sendGenericMessage(
        destination, messageType, payload
      );
      return response;
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }

  /**
   * Process an incoming message (used for simulating incoming messages)
   */
  processIncomingMessage(
  message: ProtocolMessage): void {
    this.protocolService.processIncomingMessage(message);
  }

  /**
   * Add a listener for incoming messages
   */
  addMessageListener(
  listener: (
  message: ProtocolMessage) => void): void {
    this.messageListeners.push(listener);
  }

  /**
   * Remove a message listener
   */
  removeMessageListener(
  listener: (
  message: ProtocolMessage) => void): void {
    const index = this.messageListeners.indexOf(listener);
    if (index !== -1) {
      this.messageListeners.splice(index, 1);
    }
  }

  /**
   * Forward a message to all registered listeners
   */
  private forwardMessage(
  message: ProtocolMessage): void {
    this.messageListeners.forEach((listener) => {
      try {
        listener(message);
      } catch (error) {
        console.error("Error in message, listener:", error);
      }
    });
  }

  /**
   * Get the current protocol connection status
   */
  getProtocolStatus() {
    return this.protocolService.getProtocolStatus();
  }

  /**
   * Initialize the protocol service with a client ID
   */
  initialize(
  clientId: string): void {
    this.protocolService.initialize(clientId);
  }
}

export default new ProtocolBridge();