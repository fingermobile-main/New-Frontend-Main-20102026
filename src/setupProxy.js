const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const backendTarget = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

  // Proxy API requests to the backend server
  app.use(
    '/api',
    createProxyMiddleware({
      target: backendTarget,
      changeOrigin: true,
      secure: false, // Set to true if using HTTPS
    })
  );

  // Proxy OAuth routes
  app.use(
    '/oauth',
    createProxyMiddleware({
      target: backendTarget,
      changeOrigin: true,
      secure: false,
    })
  );

  // Proxy authentication routes
  app.use(
    '/auth',
    createProxyMiddleware({
      target: backendTarget,
      changeOrigin: true,
      secure: false,
    })
  );
};
