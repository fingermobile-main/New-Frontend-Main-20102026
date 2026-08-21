const logger = require('../utils/logger');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error with context
  if (logger && logger.logError) {
    logger.logError(err, {
method: req.method,
url: req.originalUrl,
ip: req.ip,
userId: req.user?.id || null,
body: req.body,
params: req.params,
query: req.query
    })
  } else {
    logger.error('❌ Error:', err.message)
    logger.error(err.stack)
  }

  // Determine status code
  const statusCode = err.statusCode || err.status || 500
  
  // Send response
  res.status(statusCode).json({
success: false,
error: {
message: process.env.NODE_ENV === 'production' && statusCode === 500 
        ? 'Internal server error' 
        : err.message || 'Unknown error',
      ...(process.env.NODE_ENV !== 'production' && {
stack: err.stack })
    }
  })
}

module.exports = { errorHandler }
