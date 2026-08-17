import React, {} from 'react';
// FingerMobile Protocol Service
// Handles core protocol communication logic for the FingerMobile platform

import { WebSocketService, WebSocketConfig, DEFAULT_WS_CONFIG } from './webSocketService'; // Added WebSocketConfig import
import {
  ProtocolMessage,
  HandshakeRequest,
  HandshakeResponse, Acknowledgement
} from '../types/protocol';
import cryptoUtils from '../utils/cryptoUtils';
import { WebSocketMessage } from '../types/realTime';

export class ProtocolService extends WebSocketService {
  // Event handlers - matching parent class
  public onConnect: (() => void) | null = null;
  public onDisconnect: (() => void) | null = null;
  public onError: ((error: Event) => void) | null = null;  // Updated to match parent class
  public onMessage: ((message: ProtocolMessage) => void) | null = null;  // Added onMessage handler

  private static instance: ProtocolService;
  private protocolVersion = "1.0.0";
  private clientId: string | null = null;
  private sessionId: string | null = null;
  private serverId: string | null = null;
  private isConnectedToProtocol = false;
  private messageQueue: ProtocolMessage[] = [];
  private protocolMessageCallbacks = new Map<string, ((response: ProtocolMessage) => void)[]>();
  private sequenceNumber = 0;
  private encryptionEnabled = false;
  private publicKey: string | null = null;
  private privateKey: string | null = null;
  private _enableEncryption: boolean = false; // Added property for tests

  private constructor(config?: Partial<WebSocketConfig>) {
    super(config);
  }

  public static getInstance(): ProtocolService {
    if (!ProtocolService.instance) {
      ProtocolService.instance = new ProtocolService();
    }
    return ProtocolService.instance;
  }

  // Initialize protocol service
  initialize(
  clientId: string): void {
    this.clientId = clientId;
    console.info(`Protocol service initialized for,
client: ${clientId}`);
  }

  // Overriding handleIncomingMessage to handle protocol-specific messages
  protected handleIncomingMessage(
  message: WebSocketMessage): void {
    const data = message.data;

    // If the message is a raw protocol message (not wrapped in WebSocketMessage)
    // or if it's the 'data' part of a WebSocketMessage
    if (
      data &&
      typeof data === "object" &&
      "messageId" in data &&
      "messageType" in data
    ) {
      this.processIncomingMessage(data as ProtocolMessage);
    } else {
      // Fallback to base class behavior for standard events
      super.handleIncomingMessage(message);
    }
  }

  // Establish protocol connection with handshake
  async connectToProtocol(): Promise<boolean> {
    if (!this.clientId) {
      throw new Error("Protocol service not initialized with client ID");
    }

    try {
      // Connect to WebSocket first if not already connected
      if (this.getConnectionStatus() !== "connected") {
        await this.connect(this.clientId);
      }

      // Create handshake request
      const handshakeRequest: HandshakeRequest = {protocolVersion: this.protocolVersion,
  clientId: this.clientId, supportedFeatures: ["messaging", "encryption", "acknowledgements"]
      };

      // Add public key if encryption is enabled
      if (this.encryptionEnabled && this.publicKey) {
        handshakeRequest.publicKey = this.publicKey;
      }

      // Send handshake message
      const response = await this.sendMessageAndWait(
        "server", "handshake",
        handshakeRequest,
      );

      const handshakeResponse = response.payload as HandshakeResponse;

      if (handshakeResponse.accepted) {
        this.sessionId = handshakeResponse.sessionId;
        this.serverId = handshakeResponse.serverId;
        this.isConnectedToProtocol = true;

        // Enable encryption if server supports it
        if (handshakeResponse.publicKey) {
          this.encryptionEnabled = true;
        }

        console.info(
          `Protocol connection established. Session,
ID: ${this.sessionId}`,
        );
        
        // Call onConnect handler if exists
        if (this.onConnect) {
          this.onConnect();
        }
        
        this.flushMessageQueue();
        return true;
      } else {
        console.error(
          `Handshake rejected.
Error: ${handshakeResponse.errorCode}` );
        return false;
      }
    } catch (error) {
      console.error("Protocol connection failed:", error);
      // Call onError handler if exists
      if (this.onError) {
        this.onError(error as Event);
      }
      return false;
    }
  }

  // Disconnect protocol service
  disconnectProtocol(): void {
    this.isConnectedToProtocol = false;
    this.sessionId = null;
    this.serverId = null;
    
    // Call onDisconnect handler if exists
    if (this.onDisconnect) {
      this.onDisconnect();
    }
    
    this.disconnect();
    console.info("Protocol service disconnected");
  }

  // Send a message and wait for response
  private sendMessageAndWait(
  destination: string,
messageType: string,
payload: unknown,
  ): Promise<ProtocolMessage> {
    return new Promise((resolve, reject) => {
      const message = this.createMessage(destination, messageType, payload);

      // Set up callback for response
      this.protocolMessageCallbacks.set(message.messageId, [
        (response) => {
          // Clean up callback
          this.protocolMessageCallbacks.delete(message.messageId);
          resolve(response);
        }
      ]);

      // Send message
      this.sendProtocolMessage(message).catch(reject);

      // Set timeout for response
      setTimeout(() => {
        if (this.protocolMessageCallbacks.has(message.messageId)) {
          this.protocolMessageCallbacks.delete(message.messageId);
          reject(
            new Error(
              `Timeout waiting for response to message ${message.messageId}`,
            ),
          );
        }
      }, 10000); // 10 second timeout
    });
  }

  // Create a protocol message
  private createMessage(
  destination: string,
messageType: string,
payload: unknown,
  ): ProtocolMessage {
    this.sequenceNumber++;

    let processedPayload = payload;

    // Encrypt payload if encryption is enabled
    if (this.encryptionEnabled && this.privateKey) {
      try {
        const payloadString = JSON.stringify(payload);
        processedPayload = cryptoUtils.encryptData(
          payloadString, this.privateKey
        );
      } catch (error) {
        console.error("Failed to encrypt payload:", error);
      }
    }

    const message: ProtocolMessage = {messageId: `${this.clientId}-${Date.now()}-${this.sequenceNumber}`,
      messageType, source: this.clientId || "unknown",
      destination,
      payload: processedPayload,
      timestamp: Date.now(),
      encrypted: this.encryptionEnabled
    };

    return message;
  }

  // Send a protocol message
  private async sendProtocolMessage(
  message: ProtocolMessage): Promise<void> {
    if (!this.isConnectedToProtocol && message.messageType !== "handshake") {
      console.warn("Protocol service not connected. Queuing message.");
      this.messageQueue.push(message);
      return;
    }

    try {
      // Use base WebSocketService's sendMessage
      this.sendMessage(message.messageType, message);
      console.info(
        `Message sent: ${message.messageType} (${message.messageId})`,
      );
    } catch (error) {
      console.error(`Failed to send message ${message.messageId}:`, error);
      throw error;
    }
  }

  // Process incoming messages
  processIncomingMessage(
  message: ProtocolMessage): void {
    console.info(
      `Processing incoming message: ${message.messageType} (${message.messageId})` );

    // Decrypt message if it's encrypted
    if (message.encrypted && this.encryptionEnabled && this.privateKey) {
      try {
        const decryptedPayload = cryptoUtils.decryptData(
          message.payload as string,
          this.privateKey,
        );
        message.payload = JSON.parse(decryptedPayload);
        console.info(`Decrypted message ${message.messageId}`);
      } catch (error) {
        console.error(`Failed to decrypt message ${message.messageId}:`, error);
        // Call onError handler if exists
        if (this.onError) {
          this.onError(error as Event);
        }
      }
    }

    // Handle acknowledgements
    if (message.messageType === "ack") {
      const ack = message.payload as Acknowledgement;
      const callbacks = this.protocolMessageCallbacks.get(ack.messageId);
      if (callbacks) {
        callbacks.forEach((callback) => callback(message));
      }

      return;
    }

    // Call onMessage handler if exists
    if (this.onMessage) {
      this.onMessage(message);
    }

    // Handle other message types
    switch (message.messageType) {
      case "notification": {
        this.handleNotification(message);
        break;
      }
      case "data_update": {
        this.handleDataUpdate(message);
        break;
      }
      case "handshake_response": {
        // Handle handshake response if received via handleIncomingMessage
        const callbacks = this.protocolMessageCallbacks.get(message.messageId);
        if (callbacks) {
          callbacks.forEach((callback) => callback(message));
        }
        break;
      }
default: {
        console.warn(`Unknown message type: ${message.messageType}`);
        break;
      }
    }

    // Send acknowledgement for non-handshake messages
    if (message.messageType !== "handshake" && message.messageType !== "ack") {
      this.sendAcknowledgement(message.messageId, "success");
    }
  }

  // Send an acknowledgement
  private sendAcknowledgement(
  messageId: string, status: "success" | "failure",
    errorCode?: string,
  ): void {
    const ackPayload: Acknowledgement = {
      messageId,
      status, errorCode
    };

    const ackMessage = this.createMessage(
      this.serverId || "server", "ack",
      ackPayload);

    this.sendProtocolMessage(ackMessage).catch((error) => {
      console.error("Failed to send acknowledgement:", error);
    });
  }

  // Handle notification messages
  private handleNotification(
  message: ProtocolMessage): void {
    console.info("Received notification:", message.payload);
    // In a real implementation, this would trigger UI updates or other actions
  }

  // Handle data update messages
  private handleDataUpdate(
  message: ProtocolMessage): void {
    console.info("Received data update:", message.payload);
    // In a real implementation, this would update local data stores
  }

  // Send a generic message
  async sendGenericMessage(
  destination: string,
messageType: string,
payload: unknown,
  ): Promise<ProtocolMessage> {
    return this.sendMessageAndWait(destination, messageType, payload);
  }

  // Enable encryption with public and private keys
  enableEncryption(
  publicKey: string,
privateKey: string): void {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.encryptionEnabled = true;
    this._enableEncryption = true;
    console.info("Encryption enabled with provided keys");
  }

  // Get protocol connection status
  getProtocolStatus(): {connected: boolean;
  sessionId: string | null;
  serverId: string | null;
  } {
    return {connected: this.isConnectedToProtocol,
  sessionId: this.sessionId,
  serverId: this.serverId
    };
  }

  // Flush message queue when connection is established
  private flushMessageQueue(): void {
    if (!this.isConnectedToProtocol || this.messageQueue.length === 0) {
      return;
    }

    console.info(`Flushing ${this.messageQueue.length} queued messages`);

    // Send all queued messages
    this.messageQueue.forEach((message) => {
      this.sendProtocolMessage(message).catch((error) => {
        console.error(
          `Failed to send queued message ${message.messageId}:`,
          error );
      });
    });

    // Clear queue
    this.messageQueue = [];
  }

  // Additional methods to satisfy type expectations
  getConnectionStatus(): "connected" | "disconnected" | "connecting" {
    return super.getConnectionStatus();
  }
}

export default ProtocolService.getInstance();