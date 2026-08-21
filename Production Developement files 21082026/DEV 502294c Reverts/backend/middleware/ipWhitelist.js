/**
 * IP Whitelisting Middleware
 * Restrict access to trusted IPs
 */

function ipWhitelist(allowedIPs = []) {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (allowedIPs.includes(clientIP)) {
      return next();
    }
    
    // Check if IP is in allowed ranges
    const isAllowed = allowedIPs.some((allowedIP) => {
      if (allowedIP.includes('/')) {
        // CIDR notation
        return this.isInCIDR(clientIP, allowedIP)
      }
      return allowedIP === clientIP
    })
    
    if (isAllowed) {
      return next()
    }
    
    return res.status(403).json({
success: false,
error: 'Access denied - IP not whitelisted'
    });
  };
}

module.exports = ipWhitelist;
