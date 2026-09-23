import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { connectDatabase } from './config/database';

// Import routes
import communicationRoutes from './routes/communicationRoutes';
import broadcastRoutes from './routes/broadcastRoutes';
import mediaRoutes from './routes/mediaRoutes'; // New route for media uploads

// Import middleware
import { authenticateToken, requireSuperAdmin } from './middleware/auth';

// Import services
import { BroadcastService } from './services/broadcastService';
import { automatedMessagingService } from './services/automatedMessagingService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.COMMUNICATIONS_PORT || 3002;
const server = http.createServer(app);

// Connect to database
connectDatabase().catch(error => {
  console.error('Failed to connect to database:', error);
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for media uploads
app.use(express.urlencoded({ extended: true }));

// Apply authentication to all routes except health check and media uploads
app.use('/api', authenticateToken);
app.use('/api/uploads', authenticateToken); // Media uploads also require auth

// Routes
app.use('/api/communications', communicationRoutes);
app.use('/api/broadcasts', requireSuperAdmin, broadcastRoutes); // Broadcast routes require superadmin access
app.use('/api/media', mediaRoutes); // New media routes

// Health check endpoint (no authentication required)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'Communications Service',
    timestamp: new Date().toISOString() 
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Socket.io server for real-time communications
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Store connected clients with their user info
interface ClientConnection {
  socket: Socket;
  userId: string;
  connectedAt: Date;
}

const connectedClients = new Map<string, ClientConnection>();

io.on('connection', (socket: Socket) => {
  // Extract user info from connection (in a real implementation, you'd verify the token)
  const userId = socket.handshake.headers['user-id'] as string || socket.handshake.query.userId as string || 'anonymous';
  const clientId = `${userId}_${socket.id}`;
  
  console.log(`New client connected: ${clientId} (user: ${userId})`);
  
  // Store the connection
  connectedClients.set(clientId, {
    socket,
    userId,
    connectedAt: new Date()
  });

  // Join a room specifically for this user to receive direct messages
  socket.join(`user_${userId}`);
  
  socket.on('message', (messageData: any) => {
    try {
      console.log(`Received message from ${userId}:`, messageData);
      
      // Handle different message types
      switch(messageData.type) {
        case 'DIRECT_MESSAGE':
          handleDirectMessage(messageData, userId);
          break;
        case 'GROUP_MESSAGE':
          handleGroupMessage(messageData, userId);
          break;
        case 'BROADCAST_MESSAGE':
          handleBroadcastMessage(messageData, userId);
          break;
        case 'TYPING_INDICATOR':
          handleTypingIndicator(messageData, userId);
          break;
        case 'READ_RECEIPT':
          handleReadReceipt(messageData, userId);
          break;
        default:
          console.log(`Unknown message type: ${messageData.type}`);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  // Join a group room
  socket.on('join_group', (groupId: string) => {
    socket.join(`group_${groupId}`);
    console.log(`User ${userId} joined group ${groupId}`);
  });

  // Leave a group room
  socket.on('leave_group', (groupId: string) => {
    socket.leave(`group_${groupId}`);
    console.log(`User ${userId} left group ${groupId}`);
  });
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${clientId}`);
    connectedClients.delete(clientId);
  });
});

// Function to handle direct messages
function handleDirectMessage(messageData: any, senderUserId: string) {
  const { recipientUserId, content, msgType, mediaAttachments } = messageData;
  
  io.to(`user_${recipientUserId}`).emit('message', {
    type: 'DIRECT_MESSAGE',
    from: senderUserId,
    content,
    msgType: msgType || 'text',
    mediaAttachments,
    timestamp: new Date().toISOString()
  });
}

// Function to handle group messages
function handleGroupMessage(messageData: any, senderUserId: string) {
  const { groupId, content, msgType, mediaAttachments } = messageData;
  
  // Broadcast to all members of the group except the sender
  // Wait, socket.io's io.to().emit() sends to everyone in the room. 
  // For group messaging, we can use socket.to() if we pass the socket, or we just rely on clients ignoring their own messages,
  // or we do it carefully. We will broadcast to the room.
  io.to(`group_${groupId}`).emit('message', {
    type: 'GROUP_MESSAGE',
    groupId,
    from: senderUserId,
    content,
    msgType: msgType || 'text',
    mediaAttachments,
    timestamp: new Date().toISOString()
  });
}

// Function to handle broadcast messages
function handleBroadcastMessage(messageData: any, senderUserId: string) {
  const { content, msgType, targetAudience, mediaAttachments } = messageData;
  
  // Broadcast to all connected clients
  io.emit('message', {
    type: 'BROADCAST_MESSAGE',
    from: senderUserId,
    content,
    msgType: msgType || 'text',
    targetAudience,
    mediaAttachments,
    timestamp: new Date().toISOString()
  });
}

// Function to handle typing indicators
function handleTypingIndicator(messageData: any, senderUserId: string) {
  const { groupId, isTyping } = messageData;
  
  // Notify other users in the group about typing status
  io.to(`group_${groupId}`).emit('message', {
    type: 'TYPING_INDICATOR',
    userId: senderUserId,
    groupId,
    isTyping,
    timestamp: new Date().toISOString()
  });
}

// Function to handle read receipts
function handleReadReceipt(messageData: any, userId: string) {
  const { messageId } = messageData;
  
  // In a real implementation, you'd update the message status in the database
  console.log(`Message ${messageId} read by user ${userId}`);
}

// Start scheduled tasks
async function startScheduledTasks() {
  console.log('Starting scheduled tasks...');
  
  // Process scheduled broadcasts periodically
  setInterval(async () => {
    try {
      await BroadcastService.processScheduledBroadcasts();
    } catch (error) {
      console.error('Error processing scheduled broadcasts:', error);
    }
  }, 60000); // Run every minute
  
  // Process scheduled automated messages
  setInterval(async () => {
    try {
      await automatedMessagingService.processScheduledAutomatedMessages();
    } catch (error) {
      console.error('Error processing scheduled automated messages:', error);
    }
  }, 120000); // Run every 2 minutes
}

server.listen(PORT, () => {
  console.log(`Communications service running on port ${PORT}`);
  console.log(`WebSocket server listening for real-time communications`);
  
  // Start background tasks
  startScheduledTasks();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});