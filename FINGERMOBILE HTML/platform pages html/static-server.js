const express = require('express');
const path = require('path');
const app = express();
const PORT = 3004; // Using a different port to avoid conflicts

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Static file server running',
    timestamp: new Date().toISOString()
  });
});

// Catch-all route to serve index.html for SPA support
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, 'localhost', () => {
  console.log(`=========================================`);
  console.log(`FingerMobile Static File Server Running`);
  console.log(`=========================================`);
  console.log(`🌍 Server: http://localhost:${PORT}`);
  console.log(`📁 Serving from: ${__dirname}`);
  console.log(`🔌 Health check: http://localhost:${PORT}/health`);
  console.log(`=========================================`);
  console.log(`Ready to serve HTML files!`);
  console.log(`=========================================`);
});