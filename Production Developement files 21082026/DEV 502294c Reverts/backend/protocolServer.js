// Protocol WebSocket Server for FingerMobile
// Handles real-time protocol communications

const WebSocket = require("ws");
const http = require("http");
const crypto = require("crypto");

class ProtocolServer {
  constructor(port = 3001) {
    this.port = port;
    this.clients = new Map(); // Store connected clients
    this.sessions = new Map(); // Store active sessions
    this.serverKeyPair = this.generateKeyPair(); // Server's RSA key pair
    this.heartbeatInterval = 30000; // 30 seconds heartbeat interval
    this.heartbeatTimeout = 10000; // 10 seconds timeout for heartbeat response
    this.reconnectAttempts = new Map(); // Track reconnection attempts
    this.maxReconnectAttempts = 5; // Maximum reconnection attempts
    this.reconnectDelay = 5000; // Delay between reconnection attempts (5 seconds)
  }

  // Generate RSA key pair for the server
  generateKeyPair() {
    // In a real implementation, you would use a proper crypto library
    // For now, we'll generate placeholder keys
    return {publicKey: "SERVER_PUBLIC_KEY_" + crypto.randomBytes(16).toString("hex"),
  privateKey: process.env.SERVER_PRIVATE_KEY + crypto.randomBytes(16).toString("hex")
    };
  }

  start() {
    // Create HTTP server
    this.server = http.createServer((req, res) => {
      // Handle HTTP requests (for status, etc.)
      if (req.url === "/protocol/status" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({service: "Protocol Service",
  status: "operational",
  version: "1.0.0",
  clients: this.clients.size,
  uptime: process.uptime()
          }),
        );
      } else if (req.url === "/protocol/clients" && req.method === "GET") {
        // Return list of connected clients
        const clientList = Array.from(this.clients.keys()).map((id) => ({
          id,
connectedAt: this.clients.get(id).connectedAt,
lastHeartbeat: this.clients.get(id).lastHeartbeat
        }));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({clients: clientList,
  count: clientList.length
          }),
        );
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({error: "Not Found" }));
      }
    });

    // Create WebSocket server
    this.wss = new WebSocket.Server({server: this.server });

    // Handle WebSocket connections
    this.wss.on("connection", (ws, req) => {
      this.handleConnection(ws, req);
    });

    // Start heartbeat monitoring
    this.startHeartbeatMonitoring();

    // Start server
    this.server.listen(this.port, () => {
      logger.info(`Protocol Server running on port ${this.port}`);
    });
  }

  startHeartbeatMonitoring() {
    // Periodically check for dead connections
    setInterval(() => {
      for (const [clientId, client] of this.clients.entries()) {
        if (client.ws.readyState === WebSocket.OPEN) {
          // Send heartbeat to client
          client.ws.send(
            JSON.stringify({event: "heartbeat",
  data: {,
  timestamp: Date.now() },
timestamp: Date.now()
            }),
          );

          // Mark that we're expecting a response
          client.expectingHeartbeatResponse = true;

          // Set timeout to close connection if no response
          setTimeout(() => {
            if (client.expectingHeartbeatResponse) {
              logger.info(
                `Client ${clientId} failed heartbeat check, closing connection`,
              );
              client.ws.close(1000, "Heartbeat timeout");
            }
          }, this.heartbeatTimeout);
        }
      }
    }, this.heartbeatInterval);
  }

  handleConnection(ws, req) {
    logger.info("New protocol client connected");

    // Generate client ID
    const clientId = `client_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    // Store client with additional metadata
    const clientData = {ws: ws,
  publicKey: null,
  encryptionEnabled: false,
  connectedAt: Date.now(),
  lastHeartbeat: Date.now(),
  expectingHeartbeatResponse: false,
  reconnectAttempts: 0
    };

    this.clients.set(clientId, clientData);

    // Handle messages
    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data);

        // Reset heartbeat expectation if we receive any message
        if (this.clients.has(clientId)) {
          const client = this.clients.get(clientId);
          client.lastHeartbeat = Date.now();
          client.expectingHeartbeatResponse = false;
        }

        this.handleMessage(clientId, message);
      } catch (error) {
        logger.error("Error parsing,
message:", error);
        ws.send(
          JSON.stringify({event: "error",
  data: {,
  message: "Invalid message format" },
timestamp: Date.now()
          }),
        );
      }
    });

    // Handle close
    ws.on("close", (code, reason) => {
      logger.info(
        `Client ${clientId} disconnected with code ${code},
reason: ${reason || "none"}`,
      );

      // Clean up client resources
      this.cleanupClient(clientId);

      // Track reconnection attempts
      if (clientData.reconnectAttempts < this.maxReconnectAttempts) {
        clientData.reconnectAttempts++;
        this.reconnectAttempts.set(clientId, clientData.reconnectAttempts);
      }
    });

    // Handle errors
    ws.on("error", (error) => {
      logger.error(`WebSocket error for client ${clientId}:`, error.message);

      // Close the connection to prevent resource leaks
      ws.close(1011, "Internal error");
    });

    // Handle pong responses (from heartbeat)
    ws.on("pong", () => {
      if (this.clients.has(clientId)) {
        const client = this.clients.get(clientId);
        client.lastHeartbeat = Date.now();
        client.expectingHeartbeatResponse = false;
      }
    });

    // Send welcome message
    ws.send(
      JSON.stringify({event: "welcome",
  data: {,
  message: "Connected to FingerMobile Protocol Server",
  clientId: clientId,
  serverTime: new Date().toISOString(),
  heartbeatInterval: this.heartbeatInterval
        },
timestamp: Date.now()
      }),
    );
  }

  cleanupClient(clientId) {
    // Remove client from clients map
    this.clients.delete(clientId);

    // Clean up sessions associated with this client
    for (const [sessionId, sessionData] of this.sessions.entries()) {
      if (sessionData.clientId === clientId) {
        this.sessions.delete(sessionId);
      }
    }

    // Clean up reconnection attempt tracking
    this.reconnectAttempts.delete(clientId);

    logger.info(`Cleaned up resources for client ${clientId}`);
  }

  handleMessage(clientId, message) {
    const { event, data } = message;
    const client = this.clients.get(clientId);

    if (!client) {
      logger.warn(`Client ${clientId} not found`);
      return;
    }

    switch (event) {
      case "handshake":
        this.handleHandshake(clientId, data, client);
        break;

      case "ping":
        // Respond to ping with pong
        client.ws.send(
          JSON.stringify({event: "pong",
  data: {},
timestamp: Date.now()
          }),
        );
        break;

      case "pong":
        // Handle pong response from client
        client.lastHeartbeat = Date.now();
        client.expectingHeartbeatResponse = false;
        break;

      case "reconnect_request":
        // Handle reconnection request
        this.handleReconnectRequest(clientId, data, client);
        break;

      case "generic_message":
        this.handleGenericMessage(clientId, data, client);
        break;,
default:
        logger.warn(`Unknown event,
type: ${event}`);
        client.ws.send(
          JSON.stringify({event: "error",
  data: {,
  message: `Unknown event,
  type: ${event}` },
timestamp: Date.now()
          }),
        );
    }
  }

  handleReconnectRequest(clientId, data, client) {
    const { previousClientId, sessionId } = data;

    // Check if this is a reconnection attempt
    if (previousClientId && this.reconnectAttempts.has(previousClientId)) {
      const attempts = this.reconnectAttempts.get(previousClientId);

      if (attempts <= this.maxReconnectAttempts) {
        // Allow reconnection
        logger.info(
          `Allowing reconnection for client ${previousClientId} as ${clientId}`,
        );

        // Transfer session if it exists
        for (const [sessionId, sessionData] of this.sessions.entries()) {
          if (sessionData.clientId === previousClientId) {
            sessionData.clientId = clientId; // Update client ID in session
          }
        }

        // Reset reconnection attempts
        this.reconnectAttempts.delete(previousClientId);

        // Send success response
        client.ws.send(
          JSON.stringify({event: "reconnect_response",
  data: {,
  success: true,
  message: "Reconnection successful",
  newClientId: clientId
            },
timestamp: Date.now()
          }),
        );
      } else {
        // Too many reconnection attempts
        client.ws.send(
          JSON.stringify({event: "reconnect_response",
  data: {,
  success: false,
  message: "Too many reconnection attempts",
  maxAttempts: this.maxReconnectAttempts
            },
timestamp: Date.now()
          }),
        );
      }
    } else {
      // Not a valid reconnection request
      client.ws.send(
        JSON.stringify({event: "reconnect_response",
  data: {,
  success: false,
  message: "Invalid reconnection request"
          },
timestamp: Date.now()
        }),
      );
    }
  }

  handleHandshake(clientId, data, client) {
    const { protocolVersion, supportedFeatures, publicKey } = data;

    // Validate protocol version
    const supportedVersions = ["1.0.0"];
    if (!supportedVersions.includes(protocolVersion)) {
      client.ws.send(
        JSON.stringify({event: "handshake_response",
  data: {,
  accepted: false,
  errorCode: "UNSUPPORTED_VERSION",
  message: `Unsupported protocol,
  version: ${protocolVersion}`
          },
timestamp: Date.now()
        }),
      );
      return;
    }

    // Store client's public key if provided
    if (publicKey) {
      client.publicKey = publicKey;
      client.encryptionEnabled = true;
    }

    // Generate session ID
    const sessionId = `session_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const serverId = `server_${Math.floor(Math.random() * 1000)}`;

    // Store session
    this.sessions.set(sessionId, {
      clientId,
      serverId,
      protocolVersion,
      supportedFeatures,
createdAt: Date.now()
    });

    // Prepare handshake response
    const responseData = {accepted: true,
  serverId,
  protocolVersion,
  sessionId,
  message: "Handshake successful"
    };

    // Include server's public key if client supports encryption
    if (client.encryptionEnabled) {
      responseData.publicKey = this.serverKeyPair.publicKey;
    }

    // Send acceptance
    client.ws.send(
      JSON.stringify({event: "handshake_response",
  data: responseData,
  timestamp: Date.now()
      }),
    );

    logger.info(
      `Handshake completed for client ${clientId}, session ${sessionId}`,
    );
  }

  handleGenericMessage(clientId, data, client) {
    const { messageType, payload, destination } = data;

    // Log the message
    logger.info(`Message received from ${clientId}: ${messageType}`, payload);

    // In a real implementation, you,
would:
    // 1. Validate the message
    // 2. Route it to the destination
    // 3. Process it accordingly

    // For now, we'll just acknowledge receipt
    client.ws.send(
      JSON.stringify({event: "message_ack",
  data: {,
  originalMessageType: messageType,
  receivedAt: Date.now(),
  status: "processed"
        },
timestamp: Date.now()
      }),
    );

    // If this is a notification, broadcast to all clients
    if (messageType === "notification") {
      this.broadcastNotification(payload, clientId);
    }
  }

  broadcastNotification(payload, senderId) {
    // Send notification to all connected clients except the sender
    for (const [clientId, client] of this.clients.entries()) {
      if (clientId !== senderId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(
          JSON.stringify({event: "notification",
  data: payload,
  timestamp: Date.now()
          }),
        );
      }
    }
  }

  stop() {
    // Close all client connections gracefully
    for (const [clientId, client] of this.clients.entries()) {
      client.ws.close(1001, "Server shutting down");
    }

    if (this.wss) {
      this.wss.close();
    }
    if (this.server) {
      this.server.close();
    }
    logger.info("Protocol Server stopped");
  }
}

// Start server if this file is run directly
if (require.main === module) {
  const server = new ProtocolServer(3001);
  server.start();

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    logger.info("Shutting down protocol server...");
    server.stop();
    process.exit(0);
  });

  // Handle termination signals
  process.on("SIGTERM", () => {
    logger.info(
      "Termination signal received, shutting down protocol server...",
    );
    server.stop();
    process.exit(0);
  });
}

module.exports = ProtocolServer;
