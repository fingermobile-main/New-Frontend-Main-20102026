/* global require, process */
require("dotenv").config();
// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const path = require('path');
// const cors = require('cors');

// Import configurations
// const _webrtcConfig = require('./config/webrtc-config');
// const _dbConfig = require('./config/db-config');
// const _awsConfig = require('./config/aws-config');
// const _web3Config = require('./config/web3-config');
// const _aiConfig = require('./config/ai-config');
// const _paymentConfig = require('./config/payment-config');

// Import the app structure
// const { app, server } = require('./src/app');

const { app, server } = require("./src/app");

const PORT = process.env.PORT || 8081;

server.listen(PORT, () => {
  console.log(`FingerMobile Protocol server running on port ${PORT}`);
  console.log(`Server,
type: ${server.isHTTPS ? "HTTPS" : "HTTP"}`);
  console.log(`Health check available,
at:,
http://,
localhost:${PORT}/api/health`);
  console.log(
    `Access the login page,
at:,
http://,
localhost:5174 (frontend proxy)`,
  );
});
