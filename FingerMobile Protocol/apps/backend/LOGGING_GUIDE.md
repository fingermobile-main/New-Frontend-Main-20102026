# 📊 Winston Logging Configuration Guide

## Overview

The FingerMobile Protocol backend now uses **Winston** for structured, production-ready logging with daily rotation and multiple transport levels.

## Configuration

### Log Levels (Lowest to Highest Priority)

1. **debug** (4) - Detailed debugging information
2. **http** (3) - HTTP request/response logging
3. **info** (2) - General informational messages
4. **warn** (1) - Warning messages
5. **error** (0) - Error messages

### Environment Variables

```bash
# Set in .env file
LOG_LEVEL=info          # Minimum log level to display (default: info)
NODE_ENV=development    # Environment (affects error detail)
```

## Log Files

All logs are stored in `apps/backend/logs/` directory:

| File Pattern              | Level   | Retention | Max Size | Purpose                    |
| ------------------------- | ------- | --------- | -------- | -------------------------- |
| `error-YYYY-MM-DD.log`    | error   | 30 days   | 20 MB    | Error tracking             |
| `combined-YYYY-MM-DD.log` | all     | 14 days   | 20 MB    | All log levels             |
| `http-YYYY-MM-DD.log`     | http    | 7 days    | 20 MB    | HTTP request/response logs |

## Usage Examples

### Basic Logging

```javascript
const logger = require('./config/logger');

// Different log levels
logger.error('Something went wrong');
logger.warn('This is a warning');
logger.info('Informational message');
logger.http('HTTP request received');
logger.debug('Debug information');
```

### Structured Error Logging

```javascript
try {
  // Some operation
} catch (error) {
  logger.logError(error, {
    userId: req.user?.id,
    action: 'update_profile',
    context: 'user_service'
  });
}
```

### API Request Logging

```javascript
// Automatically logs with Morgan integration
// Logs method, URL, status, response time, IP, user agent
```

### Custom Context Logging

```javascript
logger.info('User logged in', {
  userId: '12345',
  email: 'user@example.com',
  ip: req.ip,
  timestamp: new Date().toISOString()
});
```

## Integration Points

### Server.js

- ✅ Morgan HTTP logging → Winston stream
- ✅ Error handling middleware → `logger.logError()`
- ✅ Startup messages → `logger.info()`
- ✅ Database connection status → `logger.info/warn/error()`

### Controllers & Services

Replace `console.log/error/warn` with:

```javascript
const logger = require('../config/logger');

// Before:
console.log('Processing request');
console.error('Error occurred:', error);

// After:
logger.info('Processing request', { requestId: req.id });
logger.logError(error, { endpoint: req.path });
```

## Log Format

### Console Output (Colored)

```
2026-06-22 17:36:30:3630 [info]: Winston test successful!
2026-06-22 17:36:30:3630 [error]: Something went wrong {"stack":"Error: ..."}
```

### File Output (JSON)

```json
{
  "level": "error",
  "message": "Something went wrong",
  "stack": "Error: Something went wrong\n    at...",
  "timestamp": "2026-06-22 17:36:30:3630",
  "context": {
    "userId": "12345",
    "action": "update_profile"
  }
}
```

## Monitoring & Analysis

### View Recent Errors

```bash
# Last 50 error lines
tail -50 logs/error-$(date +%Y-%m-%d).log

# Search for specific errors
grep "database" logs/error-*.log

# Real-time error monitoring
tail -f logs/error-$(date +%Y-%m-%d).log
```

### Analyze HTTP Traffic

```bash
# Count requests by status code
grep -o '"status":[0-9]*' logs/http-*.log | sort | uniq -c

# Find slow requests (>1000ms)
grep '"responseTime":"[0-9]{4,}ms"' logs/http-*.log
```

### Log Rotation

Logs automatically rotate daily. Old files are compressed and deleted based on retention policy:

- Error logs: 30 days
- Combined logs: 14 days
- HTTP logs: 7 days

## Best Practices

### DO ✅

- Use appropriate log levels (error for errors, info for general info)
- Include context in log messages (userId, requestId, etc.)
- Use `logger.logError()` for exceptions
- Structure metadata as objects, not strings
- Log at entry/exit points of critical operations

### DON'T ❌

- Don't use `console.log/error/warn` in production code
- Don't log sensitive data (passwords, tokens, PII)
- Don't log excessive debug info in production
- Don't ignore error stack traces
- Don't create custom log formats (use built-in)

## Performance Considerations

- Winston is asynchronous and non-blocking
- File rotation prevents disk space issues
- JSON format enables easy parsing and analysis
- Separate transports allow filtering by level
- Daily rotation makes log management easier

## Troubleshooting

### No Logs Appearing

1. Check `LOG_LEVEL` in `.env` (set to 'debug' to see all)
2. Verify `logs/` directory exists and is writable
3. Check Winston is imported correctly

### Logs Not Rotating

1. Verify `winston-daily-rotate-file` is installed
2. Check file permissions on `logs/` directory
3. Review rotation configuration in `config/logger.js`

### Missing Stack Traces

Ensure errors are passed as Error objects, not strings:

```javascript
// Correct:
logger.error(new Error('Something failed'));

// Incorrect:
logger.error('Something failed');
```

## Next Steps

1. Replace remaining `console.*` calls in controllers/services
2. Add request ID tracking for distributed tracing
3. Integrate with external monitoring (Sentry, DataDog, etc.)
4. Set up log aggregation (ELK stack, CloudWatch, etc.)
5. Configure alerts for critical errors

---

**Last Updated:** 2026-06-22  
**Status:** ✅ Active and Verified
