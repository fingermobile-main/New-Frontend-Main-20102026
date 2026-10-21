/**
 * IP Whitelisting Middleware
 * Restrict access to trusted IPs
 */

function ipWhitelist(allowedIPs = []) {
  if (allowedIPs && typeof allowedIPs.use === 'function') {
    // If passed app instance or req/res object
    return (req, res, next) => next();
  }

  if (!Array.isArray(allowedIPs) && typeof allowedIPs === 'object' && allowedIPs.headers) {
    // Called directly as express middleware (req, res, next)
    const req = allowedIPs;
    const res = arguments[1];
    const next = arguments[2];
    if (typeof next === 'function') return next();
  }

  const ips = Array.isArray(allowedIPs) ? allowedIPs : [];

  return (req, res, next) => {
    if (ips.length === 0) {
      return next();
    }
    const clientIP = req.ip || req.connection?.remoteAddress;
    if (ips.includes(clientIP)) {
      return next();
    }
    return res.status(403).json({
      success: false,
      error: 'Access denied - IP not whitelisted'
    });
  };
}

module.exports = ipWhitelist;
