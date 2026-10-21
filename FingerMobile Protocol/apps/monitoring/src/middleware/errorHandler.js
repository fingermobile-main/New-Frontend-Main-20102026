/**
 * Error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error
  console.error(err.stack);

  // Set status code and message
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? (err.message || 'Internal Server Error')
    : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

/**
 * 404 handler middleware
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};