# Multi-stage build for optimized production image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force


# ==========================================
# Production stage
# ==========================================
FROM node:20-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    postgresql-client \
    curl \
    && rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built dependencies from builder
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY . .

RUN mkdir -p uploads/media uploads/temp logs backups && \
    ln -sf /app/services/NotificationService.js /app/services/notificationService.js 2>/dev/null || true && \
    ln -sf /app/services/RolePermissionService.js /app/services/rolePermissionService.js 2>/dev/null || true && \
    ln -sf /app/services/PaymentService.js /app/services/paymentService.js 2>/dev/null || true && \
    ln -sf /app/controllers/communityController.js /app/controllers/CommunityController.js 2>/dev/null || true && \
    ln -sf /app/controllers/camusController.js /app/controllers/CamusController.js 2>/dev/null || true && \
    ln -sf /app/controllers/fingerluxController.js /app/controllers/FingerLuxController.js 2>/dev/null || true && \
    ln -sf /app/controllers/flamingoController.js /app/controllers/FlamingoController.js 2>/dev/null || true && \
    ln -sf /app/controllers/gameonController.js /app/controllers/GameonController.js 2>/dev/null || true && \
    ln -sf /app/controllers/hallmarksController.js /app/controllers/HallmarksController.js 2>/dev/null || true && \
    ln -sf /app/controllers/loansqrController.js /app/controllers/LoansqrController.js 2>/dev/null || true && \
    ln -sf /app/controllers/luminaController.js /app/controllers/LuminaController.js 2>/dev/null || true && \
    ln -sf /app/controllers/commentsController.js /app/controllers/CommentsController.js 2>/dev/null || true && \
    ln -sf /app/controllers/trendsController.js /app/controllers/TrendsController.js 2>/dev/null || true && \
    ln -sf /app/routes/contentmanagement.js /app/routes/contentManagement.js 2>/dev/null || true && \
    ln -sf /app/models/User.js /app/models/user.js 2>/dev/null || true && \
    ln -sf /app/models/Forum.js /app/models/forum.js 2>/dev/null || true && \
    ln -sf /app/models/ForumCategory.js /app/models/forumCategory.js 2>/dev/null || true && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["node", "app.js"]
