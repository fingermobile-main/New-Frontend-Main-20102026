// Protocol Client for FingerMobile
// Handles real-time protocol communications from the client side

const WebSocket = require("ws");
const crypto = require("crypto");
const logger = require('./utils/logger'); // Adding missing logger import

class ProtocolClient {
  constructor(serverUrl = "ws://localhost:3001") {
    this.serverUrl = serverUrl;
    this.ws = null;
    this.connected = false;
    this.sessionId = null;
    this.clientId = null;
    this.protocolVersion = "1.0.0";
    this.supportedFeatures = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 5000; // 5 seconds
    this.heartbeatInterval = null;
    this.heartbeatTimeout = null;
    this.reconnectTimeout = null; // Add property to track reconnection timeout
    this.heartbeatIntervalMs = 30000; // 30 seconds
    this.heartbeatTimeoutMs = 10000; // 10 seconds

    // Callbacks for handling events
    this.onConnectCallback = null;
    this.onDisconnectCallback = null;
    this.onMessageCallback = null;
    this.onErrorCallback = null;
  }

  // Connect to the protocol server
  connect() {
    return new Promise((resolve, reject) => {
      logger.info(`Connecting to protocol server: ${this.serverUrl}`);

      this.ws = new WebSocket(this.serverUrl);

      this.ws.on("open", () => {
        logger.info("Connected to protocol server");
        this.connected = true;
        this.reconnectAttempts = 0; // Reset on successful connection

        if (this.onConnectCallback) {
          this.onConnectCallback();
        }

        resolve();
      });

      this.ws.on("message", (data) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(message);
        } catch (error) {
          logger.error("Error parsing message:", error);
          if (this.onErrorCallback) {
            this.onErrorCallback(error);
          }
        }
      });

      this.ws.on("close", (code, reason) => {
        logger.info(
          `Disconnected from protocol server with code ${code}, reason: ${reason || "none"}`,
        );
        this.connected = false;
        this.clearHeartbeatTimers();
        this.clearReconnectTimeout(); // Clear reconnection timeout on disconnect

        if (this.onDisconnectCallback) {
          this.onDisconnectCallback(code, reason);
        }

        // Attempt to reconnect if not a manual disconnect
        if (code !== 1000 && code !== 1001) { // 1000 = normal closure, 1001 = server shutdown
          this.attemptReconnect();
        }
      });

      this.ws.on("error", (error) => {
        logger.error("WebSocket error:", error);
        this.connected = false;

        if (this.onErrorCallback) {
          this.onErrorCallback(error);
        }
      });
    });
  }

  // Handle incoming messages
  handleMessage(message) {
    const { event, data, timestamp } = message;

    switch (event) {
      case "welcome":
        this.handleWelcome(data);
        break;

      case "handshake_response":
        this.handleHandshakeResponse(data);
        break;

      case "message_ack":
        // Message acknowledged by server
        logger.info("Message acknowledged by server:", data);
        break;

      case "notification":
        // Handle notification from server
        if (this.onMessageCallback) {
          this.onMessageCallback({event: "notification", data: data, timestamp});
        }
        break;

      case "error":
        logger.error("Server error:", data.message);
        if (this.onErrorCallback) {
          this.onErrorCallback(new Error(data.message));
        }
        break;

      case "heartbeat":
        // Server sent heartbeat, respond with pong
        this.sendPong();
        break;

      case "reconnect_response":
        this.handleReconnectResponse(data);
        break;

      case "pong":
        // Server responded to our ping
        this.handlePong();
        break;
      default:
        logger.warn(`Unknown event type: ${event}`);
        if (this.onMessageCallback) {
          this.onMessageCallback(message);
        }
    }
  }

  handleWelcome(data) {
    logger.info("Received welcome message from server:", data);
    this.clientId = data.clientId;

    // Store heartbeat interval from server if provided
    if (data.heartbeatInterval) {
      this.heartbeatIntervalMs = data.heartbeatInterval;
    }

    // Start heartbeat after successful connection
    this.startHeartbeat();

    // Perform handshake
    this.performHandshake();
  }

  handleHandshakeResponse(data) {
    if (data.accepted) {
      logger.info("Handshake successful:", data);
      this.sessionId = data.sessionId;

      // If we have a stored previous session, we might want to handle reconnection logic here
    } else {
      logger.error("Handshake failed:", data.message);
      if (this.onErrorCallback) {
        this.onErrorCallback(new Error(`Handshake failed: ${data.message}`));
      }
    }
  }

  handleReconnectResponse(data) {
    if (data.success) {
      logger.info("Reconnection successful:", data);
      this.clientId = data.newClientId;
      this.connected = true;
      this.reconnectAttempts = 0;

      if (this.onConnectCallback) {
        this.onConnectCallback();
      }
    } else {
      logger.error("Reconnection failed:", data.message);
      if (this.onErrorCallback) {
        this.onErrorCallback(new Error(`Reconnection failed: ${data.message}`));
      }
    }
  }

  // Perform handshake with the server
  performHandshake() {
    const handshakeData = {
      protocolVersion: this.protocolVersion,
      supportedFeatures: this.supportedFeatures,
      publicKey: null, // In a real implementation, you would provide a public key
    };

    this.sendMessage({event: "handshake", data: handshakeData, timestamp: Date.now()});
  }

  // Send a message to the server
  sendMessage(message) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      logger.error("WebSocket is not connected");
      return false;
    }

    try {
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      logger.error("Error sending message:", error);
      return false;
    }
  }

  // Send a generic message
  sendGenericMessage(messageType, payload, destination = null) {
    if (!this.connected) {
      logger.error("Client not connected");
      return false;
    }

    return this.sendMessage({
      event: "generic_message",
      data: {
        messageType,
        payload,
        destination
      },
      timestamp: Date.now()
    });
  }

  // Send ping to server
  sendPing() {
    if (this.connected) {
      this.sendMessage({event: "ping", data: {}, timestamp: Date.now()});
    }
  }

  // Send pong response to server
  sendPong() {
    if (this.connected) {
      this.sendMessage({event: "pong", data: {}, timestamp: Date.now()});
    }
  }

  // Handle pong response (acknowledging our ping)
  handlePong() {
    // Clear the heartbeat timeout since we received a response
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  // Start heartbeat mechanism
  startHeartbeat() {
    // Clear any existing heartbeat timers
    this.clearHeartbeatTimers();

    // Send periodic pings to server
    this.heartbeatInterval = setInterval(() => {
      if (this.connected) {
        this.sendPing();

        // Set timeout to detect if server doesn't respond
        this.heartbeatTimeout = setTimeout(() => {
          logger.info("Heartbeat timeout - server not responding");
          if (this.ws) {
            this.ws.close(1006, "Heartbeat timeout");
          }
        }, this.heartbeatTimeoutMs);
      }
    }, this.heartbeatIntervalMs);
  }

  // Clear heartbeat timers
  clearHeartbeatTimers() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  // Clear reconnection timer
  clearReconnectTimeout() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  // Attempt to reconnect to the server
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error("Maximum reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    logger.info(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`,
    );

    // Clear any existing reconnection timer
    this.clearReconnectTimer();

    this.reconnectTimer = setTimeout(async () => {
      try {
        // Clear the reconnect timer reference since we're executing now
        this.reconnectTimer = null;
        
        // Try to connect again
        await this.connect();

        // If we have a previous session, request reconnection
        if (this.clientId) {
          this.requestReconnection();
        }
      } catch (error) {
        logger.error("Reconnection failed:", error);
        // Try again after delay (but only if we haven't exceeded max attempts)
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.attemptReconnect();
        }
      }
    }, this.reconnectDelay);
  }

  // Request reconnection to the server with previous session info
  requestReconnection() {
    if (!this.connected || !this.clientId) {
      return;
    }

    this.sendMessage({
      event: "reconnect_request",
      data: {
        previousClientId: this.clientId,
        sessionId: this.sessionId
      },
      timestamp: Date.now()
    });
  }

  // Disconnect from the server
  disconnect() {
    this.connected = false;
    this.clearHeartbeatTimers();
    this.clearReconnectTimeout(); // Clear reconnection timeout on disconnect

    if (this.ws) {
      this.ws.close(1000, "Client initiated disconnect");
    }
  }

  // Set callback for connection events
  onConnect(callback) {
    this.onConnectCallback = callback;
  }

  // Set callback for disconnection events
  onDisconnect(callback) {
    this.onDisconnectCallback = callback;
  }

  // Set callback for message events
  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  // Set callback for error events
  onError(callback) {
    this.onErrorCallback = callback;
  }

  // Check if client is connected
  isConnected() {
    return this.connected && this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

// Example usage
if (require.main === module) {
  const client = new ProtocolClient("ws://localhost:3001");

  // Set up event handlers
  client.onConnect(() => {
    logger.info("Connected to protocol server!");

    // Send a test message after connecting
    setTimeout(() => {
      client.sendGenericMessage("test", {message: "Hello from client!" });
    }, 1000);
  });

  client.onDisconnect((code, reason) => {
    logger.info(`Disconnected from server: code=${code}, reason=${reason}`);
  });

  client.onMessage((message) => {
    logger.info("Received message:", message);
  });

  client.onError((error) => {
    logger.error("Client error:", error);
  });

  // Connect to the server
  client.connect().catch(logger.error);

  // Graceful shutdown
  process.on("SIGINT", () => {
    logger.info("Shutting down client...");
    client.disconnect();
    process.exit(0);
  });
}

module.exports = ProtocolClient;