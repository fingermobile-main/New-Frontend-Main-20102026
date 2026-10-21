const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Prevent aggressive browser caching during development
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

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

  // Proxy media and static uploads to the backend server
  app.use(
    '/uploads',
    createProxyMiddleware({
      target: backendTarget,
      changeOrigin: true,
      secure: false,
    })
  );

  // Proxy Prometheus and telemetry metrics
  app.use(
    '/metrics',
    createProxyMiddleware({
      target: backendTarget,
      changeOrigin: true,
      secure: false,
    })
  );
};
