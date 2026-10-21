/**
 * Lush Pressies Backend API Server
 * Main entry point for the application
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

// Import controllers and services
const lushSwipeController = require('./src/controllers/lushSwipeController');
const lushChatController = require('./src/controllers/lushChatController');
const lushMatchController = require('./src/controllers/lushMatchController');
const lushVerificationController = require('./src/controllers/lushVerificationController');
const lushSubscriptionController = require('./src/controllers/lushSubscriptionController');
const lushMonetizationController = require('./src/controllers/lushMonetizationController');
const lushAnalyticsController = require('./src/controllers/lushAnalyticsController');
const lushTrendsController = require('./src/controllers/lushTrendsController');
const lushGeoController = require('./src/controllers/lushGeoController');
const lushPrivacyController = require('./src/services/lushPrivacyController');

// Import services
const lushGamification = require('./src/services/lushGamification');
const lushPersonalityAI = require('./src/services/lushPersonalityAI');
const lushLapidaireGifting = require('./src/services/lushLapidaireGifting');
const lushPrivacySovereignty = require('./src/services/lushPrivacySovereignty');
const lushRadiatePlusPlus = require('./src/services/lushRadiatePlusPlus');
const lushMatchingEngine = require('./src/services/lushMatchingEngine');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configure Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/swipe', require('./src/routes/swipeRoutes'));
app.use('/api/chat', require('./src/routes/chatRoutes'));
app.use('/api/match', require('./src/routes/matchRoutes'));
app.use('/api/verification', require('./src/routes/verificationRoutes'));
app.use('/api/subscription', require('./src/routes/subscriptionRoutes'));
app.use('/api/monetization', require('./src/routes/monetizationRoutes'));
app.use('/api/analytics', require('./src/routes/analyticsRoutes'));
app.use('/api/trends', require('./src/routes/trendsRoutes'));
app.use('/api/geo', require('./src/routes/geoRoutes'));
app.use('/api/privacy', require('./src/routes/privacyRoutes'));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Join room based on user ID
  socket.on('join-room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room`);
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  // Forward events to appropriate controllers
  socket.on('new_message', (data) => {
    lushChatController.handleSocketMessage(io, socket, data);
  });
  
  socket.on('typing_start', (data) => {
    socket.to(data.roomId).emit('user_typing', { userId: data.userId, isTyping: true });
  });
  
  socket.on('typing_stop', (data) => {
    socket.to(data.roomId).emit('user_typing', { userId: data.userId, isTyping: false });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Lush Pressies API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (process.env.MAINTENANCE_MODE === 'true') {
    console.warn(`⚠️  MAINTENANCE MODE ACTIVE: ${process.env.MAINTENANCE_MESSAGE}`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Export controllers and services for use in routes
module.exports = {
  app,
  io,
  controllers: {
    lushSwipeController,
    lushChatController,
    lushMatchController,
    lushVerificationController,
    lushSubscriptionController,
    lushMonetizationController,
    lushAnalyticsController,
    lushTrendsController,
    lushGeoController,
    lushPrivacyController
  },
  services: {
    lushGamification,
    lushPersonalityAI,
    lushLapidaireGifting,
    lushPrivacySovereignty,
    lushRadiatePlusPlus,
    lushMatchingEngine
  }
};