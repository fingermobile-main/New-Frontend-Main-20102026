# =============================================================================
# FINGERMOBILE PLATFORM - MASTER NGINX DOCKERFILE
# Centralized reverse proxy for all 27 entities
# 
# Created: 2026-03-19
# =============================================================================

FROM nginx:alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY ./nginx.conf /etc/nginx/nginx.conf

# Create necessary directories with proper permissions
RUN mkdir -p /var/cache/nginx \
    && mkdir -p /tmp \
    && mkdir -p /etc/nginx/conf.d \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /tmp \
    && chown -R nginx:nginx /etc/nginx

# Expose ports
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q --spider http://127.0.0.1/health || exit 1

# Start nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
