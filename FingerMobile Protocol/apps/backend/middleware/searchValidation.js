const logger = require('../utils/logger');
/**
 * Search Validation Middleware
 * Validates and sanitizes search query parameters
 */
function searchValidation(req, res, next) {
  try {
    const { q, page = 1, limit = 20, sortBy = 'relevance', order = 'desc' } = req.query;

    // Validate search query
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query (q) is required'
      });
    }

    // Sanitize search query
    const sanitizedQuery = sanitizeSearchQuery(q);

    // Validate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid page number'
      });
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100'
      });
    }

    // Validate sort options
    const validSortFields = ['relevance', 'date', 'popularity', 'title'];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: `Invalid sort field. Must be one,
of: ${validSortFields.join(', ')}`
      });
    }

    const validOrders = ['asc', 'desc'];
    if (!validOrders.includes(order.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid order. Must be one,
of: ${validOrders.join(', ')}`
      });
    }

    // Attach validated params to request
    req.searchParams = {
      query: sanitizedQuery,
      page: pageNum,
      limit: limitNum,
      sortBy,
      order: order.toLowerCase()
    };

    next();
  } catch (error) {
    logger.error('Search validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Search validation failed'
    });
  }
}

/**
 * Sanitize search query to prevent injection attacks
 */
function sanitizeSearchQuery(query) {
  // Remove SQL injection patterns
  let sanitized = query
    .replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b)/gi, '')
    .replace(/(--|;|\/\*|\*\/)/g, '')
    .trim();

  // Limit length
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200);
  }

  // Escape special characters for regex/search
  sanitized = sanitized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return sanitized;
}

module.exports = searchValidation;
